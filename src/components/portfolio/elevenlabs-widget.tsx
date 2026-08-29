import { createElement } from "react";
import Script from "next/script";

// Embeds the ElevenLabs voice agent that serves as Aziz's AI portfolio guide, so
// visitors can ask a transparent third-person assistant about his work. The
// agent's system prompt and RAG knowledge base are maintained in /elevenlabs (see
// elevenlabs/README.md). This public embed connects by agent ID and needs no
// API key; the agent must be configured under THIS id for the widget to work.
const ELEVENLABS_AGENT_ID = "agent_3001kqxxgvjkexzr40ce3x5db8m5";

export function ElevenLabsWidget() {
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
