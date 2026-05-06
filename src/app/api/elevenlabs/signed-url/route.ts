import { type NextRequest } from "next/server";

const DAILY_SESSION_LIMIT = 3;
const COOLDOWN_MS = 2 * 60 * 1000;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_WINDOW_ENTRIES = 5_000;

type RateEntry = {
  count: number;
  firstSeenAt: number;
  lastStartedAt: number;
};

type SignedUrlResponse = {
  signed_url?: string;
  signedUrl?: string;
};

declare global {
  var elevenLabsRateLimitStore: Map<string, RateEntry> | undefined;
}

function getStore() {
  if (!globalThis.elevenLabsRateLimitStore) {
    globalThis.elevenLabsRateLimitStore = new Map<string, RateEntry>();
  }

  return globalThis.elevenLabsRateLimitStore;
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function pruneStore(now: number) {
  const store = getStore();

  for (const [key, entry] of store.entries()) {
    if (now - entry.firstSeenAt > WINDOW_MS) {
      store.delete(key);
    }
  }

  if (store.size <= MAX_WINDOW_ENTRIES) {
    return;
  }

  const excess = store.size - MAX_WINDOW_ENTRIES;
  const keys = Array.from(store.keys()).slice(0, excess);

  keys.forEach((key) => store.delete(key));
}

function sameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return true;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function checkRateLimit(key: string, now: number) {
  const store = getStore();
  const existing = store.get(key);

  if (!existing || now - existing.firstSeenAt > WINDOW_MS) {
    const freshEntry = {
      count: 1,
      firstSeenAt: now,
      lastStartedAt: now,
    };
    store.set(key, freshEntry);

    return {
      allowed: true,
      remainingToday: DAILY_SESSION_LIMIT - freshEntry.count,
    };
  }

  const cooldownRemaining = COOLDOWN_MS - (now - existing.lastStartedAt);

  if (cooldownRemaining > 0) {
    return {
      allowed: false,
      error: "Voice sessions are cooling down.",
      retryAfterSeconds: Math.ceil(cooldownRemaining / 1000),
      remainingToday: Math.max(DAILY_SESSION_LIMIT - existing.count, 0),
    };
  }

  if (existing.count >= DAILY_SESSION_LIMIT) {
    const resetRemaining = WINDOW_MS - (now - existing.firstSeenAt);

    return {
      allowed: false,
      error: "Daily voice session limit reached.",
      retryAfterSeconds: Math.ceil(resetRemaining / 1000),
      remainingToday: 0,
    };
  }

  existing.count += 1;
  existing.lastStartedAt = now;
  store.set(key, existing);

  return {
    allowed: true,
    remainingToday: DAILY_SESSION_LIMIT - existing.count,
  };
}

export async function POST(request: NextRequest) {
  if (!sameOriginRequest(request)) {
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return Response.json(
      { error: "Voice agent is not configured yet." },
      { status: 503 },
    );
  }

  const now = Date.now();
  pruneStore(now);

  const ip = getClientIp(request);
  const rateKey = `convai:${ip}`;
  const rateLimit = checkRateLimit(rateKey, now);

  if (!rateLimit.allowed) {
    return Response.json(
      {
        error: rateLimit.error,
        retryAfterSeconds: rateLimit.retryAfterSeconds,
        remainingToday: rateLimit.remainingToday,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds ?? 120),
        },
      },
    );
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
    {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return Response.json(
      { error: "Could not create a voice session right now." },
      { status: response.status },
    );
  }

  const data = (await response.json()) as SignedUrlResponse;
  const signedUrl = data.signed_url ?? data.signedUrl;

  if (!signedUrl) {
    return Response.json(
      { error: "Voice session response was missing a signed URL." },
      { status: 502 },
    );
  }

  return Response.json({
    signedUrl,
    remainingToday: rateLimit.remainingToday,
  });
}
