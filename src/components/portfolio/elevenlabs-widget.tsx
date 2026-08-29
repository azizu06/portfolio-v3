"use client";

import { createElement, useEffect } from "react";
import Script from "next/script";

// Embeds the ElevenLabs voice agent that serves as Aziz's AI portfolio guide, so
// visitors can ask a transparent third-person assistant about his work. The
// agent's system prompt and RAG knowledge base are maintained in /elevenlabs (see
// elevenlabs/README.md). This public embed connects by agent ID and needs no
// API key; the agent must be configured under THIS id for the widget to work.
const ELEVENLABS_AGENT_ID = "agent_3001kqxxgvjkexzr40ce3x5db8m5";

export function ElevenLabsWidget() {
  useEffect(() => {
    let stopAlignment: (() => void) | undefined;

    const alignTriggerWithAttribution = () => {
      const widget = document.querySelector<HTMLElement>("elevenlabs-convai");
      const root = widget?.shadowRoot;

      if (!root) return false;

      const attribution = Array.from(root.querySelectorAll("p")).find((element) =>
        element.textContent?.includes("Powered by"),
      );
      const trigger = root.querySelector<HTMLElement>(".overlay > .bg-base");

      if (!attribution || !trigger) return false;

      const updateAlignment = () => {
        const attributionWidth = attribution.getBoundingClientRect().width;
        const triggerWidth = trigger.getBoundingClientRect().width;
        const offset = Math.max(0, (attributionWidth - triggerWidth) / 2);

        trigger.style.translate = `${-offset}px 0`;
      };

      const observer = new ResizeObserver(updateAlignment);
      observer.observe(attribution);
      observer.observe(trigger);
      updateAlignment();

      stopAlignment = () => {
        observer.disconnect();
        trigger.style.removeProperty("translate");
      };

      return true;
    };

    const interval = window.setInterval(() => {
      if (alignTriggerWithAttribution()) window.clearInterval(interval);
    }, 100);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 5_000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      stopAlignment?.();
    };
  }, []);

  return (
    <>
      {createElement("elevenlabs-convai", {
        "agent-id": ELEVENLABS_AGENT_ID,
        className: "elevenlabs-convai-widget",
      })}
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
      />
    </>
  );
}
