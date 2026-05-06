"use client";

import { useState } from "react";
import {
  ConversationProvider,
  useConversationControls,
  useConversationInput,
  useConversationStatus,
} from "@elevenlabs/react";
import { MicIcon, MicOffIcon, PhoneIcon, PhoneOffIcon } from "lucide-react";

type SignedUrlResponse = {
  signedUrl?: string;
  error?: string;
  retryAfterSeconds?: number;
  remainingToday?: number;
};

function formatWait(seconds: number) {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  return `${Math.ceil(seconds / 60)}m`;
}

function VoiceOrb({ connected }: { connected: boolean }) {
  return (
    <div
      className={[
        "relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-ice/18 shadow-[inset_0_1px_1px_rgba(255,255,255,0.42),0_0_28px_rgba(47,111,237,0.34)] transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        connected
          ? "scale-105 border-sky-200/65"
          : "border-ice/18",
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[conic-gradient(from_210deg,#f8fbff_0deg,#6f52d9_42deg,#120b2a_86deg,#dbeafe_132deg,#2f6fed_184deg,#070311_238deg,#9ce6e6_310deg,#f8fbff_360deg)]" />
      <div className="absolute inset-[0.22rem] rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.95),transparent_0.44rem),conic-gradient(from_26deg,rgba(255,255,255,0.92),rgba(141,183,255,0.2),rgba(30,15,69,0.96),rgba(255,255,255,0.72),rgba(47,111,237,0.62),rgba(12,5,28,0.98),rgba(255,255,255,0.92))]" />
      <div className="absolute inset-[0.55rem] rounded-full bg-[#080311]/70 shadow-[inset_0_0_16px_rgba(255,255,255,0.18)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.7),transparent_32%,rgba(255,255,255,0.12)_52%,transparent_68%)] mix-blend-screen" />
    </div>
  );
}

function VoiceControls() {
  const { startSession, endSession } = useConversationControls();
  const { status, message } = useConversationStatus();
  const { isMuted, setMuted } = useConversationInput();
  const [notice, setNotice] = useState<string | null>(null);

  const connected = status === "connected";
  const connecting = status === "connecting";
  const busy = connected || connecting;

  async function getSignedUrl() {
    const response = await fetch("/api/elevenlabs/signed-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as SignedUrlResponse;

    if (!response.ok || !data.signedUrl) {
      const retryMessage = data.retryAfterSeconds
        ? ` Try again in ${formatWait(data.retryAfterSeconds)}.`
        : "";
      throw new Error(`${data.error ?? "Voice access is unavailable."}${retryMessage}`);
    }

    return data.signedUrl;
  }

  async function toggleCall() {
    setNotice(null);

    if (connected || connecting) {
      endSession();
      return;
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone access is not available in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      const signedUrl = await getSignedUrl();

      startSession({
        signedUrl,
        connectionType: "websocket",
        onError: (errorMessage) => {
          setNotice(errorMessage || "The voice session hit an error.");
        },
      });
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "I could not start the voice session.",
      );
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {notice || message ? (
        <p className="max-w-[18rem] rounded-2xl border border-ice/12 bg-[#070311]/86 px-4 py-3 text-right text-xs font-medium leading-5 text-ice/88 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
          {notice ?? message}
        </p>
      ) : null}

      <div className="relative flex items-center gap-2 rounded-full border border-ice/10 bg-[#070311]/90 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_22px_70px_rgba(0,0,0,0.38)] ring-1 ring-cobalt/18 backdrop-blur-2xl">
        <VoiceOrb connected={connected} />

        <button
          type="button"
          onClick={toggleCall}
          disabled={status === "connecting"}
          aria-label={busy ? "End voice conversation" : "Start voice conversation"}
          className={[
            "group grid size-11 place-items-center rounded-full border border-[#6c55d8]/34 bg-[#24164f]/92 text-ice shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-[#8db7ff]/48 hover:bg-[#2a195e] active:scale-[0.96] disabled:pointer-events-none disabled:opacity-60",
            connected ? "bg-cobalt/42" : "",
          ].join(" ")}
        >
          {busy ? (
            <PhoneOffIcon className="size-5 stroke-[1.9]" aria-hidden="true" />
          ) : (
            <PhoneIcon className="size-5 stroke-[1.9]" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setMuted(!isMuted)}
          disabled={!connected}
          aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
          className="group relative grid size-11 place-items-center rounded-full border border-ice/14 bg-[#080311]/74 text-ice shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-[#8db7ff]/42 hover:bg-[#120b2a] active:scale-[0.96] disabled:opacity-55"
        >
          {isMuted ? (
            <MicOffIcon className="size-5 stroke-[1.9]" aria-hidden="true" />
          ) : (
            <MicIcon className="size-5 stroke-[1.9]" aria-hidden="true" />
          )}
        </button>

        <span
          aria-hidden="true"
          className={[
            "absolute right-1.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full shadow-[0_0_16px_rgba(141,183,255,0.76)] transition duration-500",
            connected
              ? "bg-[#9ce6e6]"
              : connecting
                ? "animate-pulse bg-[#8db7ff]"
                : "bg-[#2f6fed]",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

export function ElevenLabsWidget() {
  return (
    <ConversationProvider>
      <VoiceControls />
    </ConversationProvider>
  );
}
