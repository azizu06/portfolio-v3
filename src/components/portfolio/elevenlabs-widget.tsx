import { createElement } from "react";
import Script from "next/script";

const ELEVENLABS_AGENT_ID = "agent_3001kqxxgvjkexzr40ce3x5db8m5";

export function ElevenLabsWidget() {
  return (
    <>
      {createElement("elevenlabs-convai", {
        "agent-id": ELEVENLABS_AGENT_ID,
      })}
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
      />
    </>
  );
}
