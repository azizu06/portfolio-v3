import { NextResponse } from "next/server";

// Returns a short-lived signed WebSocket URL so the browser can connect to the
// ElevenLabs voice agent without ever seeing the API key. The signed URL is
// valid for 15 minutes; the client must start the conversation within that
// window. Required env: ELEVENLABS_API_KEY, ELEVENLABS_AGENT_ID.
//
// Only needed for PRIVATE agents. A public agent can embed the
// <elevenlabs-convai agent-id="..."> widget directly with no signed URL.

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // never cache an auth token

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey || !agentId) {
    return NextResponse.json(
      { error: "ElevenLabs is not configured on the server." },
      { status: 500 },
    );
  }

  const endpoint = new URL(
    "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url",
  );
  endpoint.searchParams.set("agent_id", agentId);

  try {
    const res = await fetch(endpoint, {
      headers: { "xi-api-key": apiKey },
      cache: "no-store",
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "Failed to get signed URL from ElevenLabs.", detail },
        { status: 502 },
      );
    }

    const data = (await res.json()) as { signed_url?: string };
    if (!data.signed_url) {
      return NextResponse.json(
        { error: "ElevenLabs response did not include a signed URL." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { signedUrl: data.signed_url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not reach ElevenLabs." },
      { status: 502 },
    );
  }
}
