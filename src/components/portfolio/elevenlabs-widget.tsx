"use client";

import { createElement, useState } from "react";
import Script from "next/script";
import { PhoneIcon } from "lucide-react";

const ELEVENLABS_AGENT_ID = "agent_3001kqxxgvjkexzr40ce3x5db8m5";
const STORAGE_KEY = "aziz-elevenlabs-widget-usage";
const DAILY_LIMIT = 3;
const COOLDOWN_MS = 2 * 60 * 1000;
const WINDOW_MS = 24 * 60 * 60 * 1000;

type VoiceUsage = {
  count: number;
  firstUsedAt: number;
  lastUsedAt: number;
};

type UsageCheck =
  | {
      allowed: true;
      nextUsage: VoiceUsage;
    }
  | {
      allowed: false;
      reason: string;
    };

function formatWait(ms: number) {
  const minutes = Math.ceil(ms / 60_000);

  if (minutes <= 1) {
    return "about 1 minute";
  }

  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  return `${Math.ceil(minutes / 60)} hours`;
}

function readUsage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Partial<VoiceUsage>;

    if (
      typeof parsed.count !== "number" ||
      typeof parsed.firstUsedAt !== "number" ||
      typeof parsed.lastUsedAt !== "number"
    ) {
      return null;
    }

    return parsed as VoiceUsage;
  } catch {
    return null;
  }
}

function writeUsage(usage: VoiceUsage) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // If storage is unavailable, still allow the official widget to open.
  }
}

function checkUsage(now = Date.now()): UsageCheck {
  const usage = readUsage();

  if (!usage || now - usage.firstUsedAt > WINDOW_MS) {
    return {
      allowed: true,
      nextUsage: {
        count: 1,
        firstUsedAt: now,
        lastUsedAt: now,
      },
    };
  }

  const cooldownRemaining = COOLDOWN_MS - (now - usage.lastUsedAt);

  if (cooldownRemaining > 0) {
    return {
      allowed: false,
      reason: `Voice assistant is cooling down. Try again in ${formatWait(cooldownRemaining)}.`,
    };
  }

  if (usage.count >= DAILY_LIMIT) {
    const resetRemaining = WINDOW_MS - (now - usage.firstUsedAt);

    return {
      allowed: false,
      reason: `Daily voice assistant limit reached. Try again in ${formatWait(resetRemaining)}.`,
    };
  }

  return {
    allowed: true,
    nextUsage: {
      ...usage,
      count: usage.count + 1,
      lastUsedAt: now,
    },
  };
}

export function ElevenLabsWidget() {
  const [widgetEnabled, setWidgetEnabled] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function enableWidget() {
    const result = checkUsage();

    if (!result.allowed) {
      setNotice(result.reason);
      return;
    }

    writeUsage(result.nextUsage);
    setNotice(null);
    setWidgetEnabled(true);
  }

  if (widgetEnabled) {
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

  return (
    <div className="fixed bottom-5 right-5 z-40 flex max-w-[min(19rem,calc(100vw-2.5rem))] flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {notice ? (
        <p className="rounded-2xl border border-ice/12 bg-[#030817]/92 px-4 py-3 text-right text-xs font-medium leading-5 text-ice/86 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
          {notice}
        </p>
      ) : null}

      <button
        type="button"
        onClick={enableWidget}
        className="group relative flex items-center gap-3 rounded-full border border-[#153d86]/52 bg-[#030817]/94 p-1.5 pr-4 text-sm font-semibold text-ice shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_22px_70px_rgba(0,0,0,0.42),0_0_0_1px_rgba(47,111,237,0.12)] backdrop-blur-2xl transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[#8db7ff]/58 hover:bg-[#061125]/95 active:scale-[0.98]"
        aria-label="Enable voice assistant"
      >
        <span
          className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-ice/18 shadow-[inset_0_1px_1px_rgba(255,255,255,0.42),0_0_28px_rgba(47,111,237,0.34)] sm:size-11"
          aria-hidden="true"
        >
          <span className="absolute inset-0 bg-[conic-gradient(from_210deg,#f8fbff_0deg,#6f52d9_42deg,#120b2a_86deg,#dbeafe_132deg,#2f6fed_184deg,#070311_238deg,#9ce6e6_310deg,#f8fbff_360deg)]" />
          <span className="absolute inset-[0.2rem] rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.95),transparent_0.42rem),conic-gradient(from_26deg,rgba(255,255,255,0.92),rgba(141,183,255,0.2),rgba(30,15,69,0.96),rgba(255,255,255,0.72),rgba(47,111,237,0.62),rgba(12,5,28,0.98),rgba(255,255,255,0.92))]" />
          <span className="absolute inset-[0.5rem] rounded-full bg-[#080311]/70 shadow-[inset_0_0_16px_rgba(255,255,255,0.18)]" />
          <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.7),transparent_32%,rgba(255,255,255,0.12)_52%,transparent_68%)] mix-blend-screen" />
        </span>
        <span className="grid size-9 place-items-center rounded-full border border-[#2f6fed]/72 bg-[#081426]/76 text-ice shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_18px_rgba(47,111,237,0.16)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-[#8db7ff]/82 group-hover:bg-[#0b1f3a] sm:size-10">
          <PhoneIcon className="size-[1.05rem] stroke-[1.9] sm:size-[1.15rem]" aria-hidden="true" />
        </span>
        <span className="hidden text-left leading-none text-ice/82 sm:block">
          Voice assistant
        </span>
      </button>
    </div>
  );
}
