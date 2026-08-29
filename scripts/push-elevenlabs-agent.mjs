// Push the local ElevenLabs config to the live agent: upload every knowledge-base
// document, attach them to the agent, enable RAG with our settings, and set the
// system prompt + first message. Turns the manual dashboard work into one command.
//
// Usage:
//   node scripts/push-elevenlabs-agent.mjs            # create missing docs, reuse existing by name
//   node scripts/push-elevenlabs-agent.mjs --replace  # delete + recreate existing docs (refresh content)
//   node scripts/push-elevenlabs-agent.mjs --dry-run  # show what would happen, no writes
//
// Reads ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID from .env.
// Run `npm run kb:build` first so the knowledge base is up to date.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const KB_DIR = join(ROOT, "elevenlabs", "knowledge-base");
const SYSTEM_PROMPT_FILE = join(ROOT, "elevenlabs", "system-prompt.md");
const API = "https://api.elevenlabs.io/v1";
const SYNTHETIC_VOICE_ID = "7EzWGsX10sAS4c9m9cPf"; // Jack John - Conversational and Upbeat

const FIRST_MESSAGE =
  "Hi, I'm Aziz's AI portfolio guide. Ask me anything about his background, experience, or projects.";

const RAG_SETTINGS = {
  enabled: true,
  embedding_model: "e5_mistral_7b_instruct",
  max_documents_length: 50000,
  max_vector_distance: 0.7, // a bit looser than the 0.6 default to improve recall on paraphrased queries
  max_retrieved_rag_chunks_count: 20, // 20 is the ElevenLabs maximum
};

// Documents we always inject into the prompt (not retrieval-gated): the overview and
// the project timeline, so identity and recency are always available. Everything else
// is retrieved on demand.
const PROMPT_MODE_DOCS = new Set(["00-start-here", "07-timeline"]);

const REPLACE = process.argv.includes("--replace");
const DRY_RUN = process.argv.includes("--dry-run");

// --- env --------------------------------------------------------------------

function loadEnv() {
  const raw = readFileSync(join(ROOT, ".env"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const API_KEY = env.ELEVENLABS_API_KEY;
const AGENT_ID = env.ELEVENLABS_AGENT_ID;

if (!API_KEY || !AGENT_ID || AGENT_ID === "ELEVENLABS_AGENT_ID") {
  console.error("Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID in .env.");
  process.exit(1);
}

// --- api helper -------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, path, body) {
  const url = path.startsWith("http") ? path : `${API}${path}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      method,
      headers: {
        "xi-api-key": API_KEY,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 429) {
      await sleep(1500 * (attempt + 1));
      continue;
    }
    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { raw: text };
    }
    if (!res.ok) {
      const err = new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`);
      err.status = res.status;
      throw err;
    }
    return json;
  }
  throw new Error(`${method} ${path} -> rate limited after retries`);
}

// --- gather local docs ------------------------------------------------------

function collectMarkdown(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...collectMarkdown(full));
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}

// Document name in ElevenLabs = path under knowledge-base/ without extension,
// e.g. "00-start-here" or "projects/crisislens". Stable, so re-runs match by name.
function docNameFor(file) {
  return relative(KB_DIR, file).replace(/\.md$/, "");
}

function extractSystemPrompt() {
  const md = readFileSync(SYSTEM_PROMPT_FILE, "utf8");
  const m = md.match(/```text\n([\s\S]*?)\n```/);
  if (!m) throw new Error("Could not find a ```text code block in system-prompt.md");
  return m[1].trim();
}

// --- main -------------------------------------------------------------------

// RAG indexing is NOT automatic — each document must be explicitly indexed with the
// embedding model before it can be retrieved. Without this, retrieval returns nothing
// and the agent falls back on guesses. Trigger indexing for every doc, then poll.
function indexDone(overview, model) {
  const idx = (overview.indexes || []).find((i) => i.model === model) || (overview.indexes || [])[0];
  if (!idx) return { state: "missing" };
  const pct = idx.progress_percentage ?? 0;
  const st = (idx.status || "").toLowerCase();
  if (st.includes("fail")) return { state: "failed" };
  if (pct >= 100 || st.includes("succ") || st.includes("complete") || st === "done") {
    return { state: "done" };
  }
  return { state: "pending" };
}

async function ragIndexAll(entries) {
  const model = RAG_SETTINGS.embedding_model;
  console.log("\nTriggering RAG indexing...");
  for (const e of entries) {
    try {
      await api("POST", `/convai/knowledge-base/${e.id}/rag-index`, { model });
    } catch (err) {
      console.warn(`  ⚠ index trigger failed for ${e.name} (${err.status ?? "?"})`);
    }
  }
  const deadline = Date.now() + 180000; // up to 3 minutes
  while (Date.now() < deadline) {
    let done = 0;
    let failed = 0;
    for (const e of entries) {
      const overview = await api("GET", `/convai/knowledge-base/${e.id}/rag-index`);
      const { state } = indexDone(overview, model);
      if (state === "done") done++;
      else if (state === "failed") failed++;
    }
    console.log(`  indexed ${done}/${entries.length}${failed ? ` (${failed} failed)` : ""}`);
    if (done + failed >= entries.length) return { done, failed };
    await sleep(5000);
  }
  console.warn("  ⚠ indexing still in progress after 3 min; it will finish server-side.");
  return { done: -1, failed: 0 };
}

async function listAllKbDocs() {
  const byName = new Map();
  let cursor = "";
  do {
    const q = new URLSearchParams({ page_size: "100" });
    if (cursor) q.set("cursor", cursor);
    const page = await api("GET", `/convai/knowledge-base?${q}`);
    for (const d of page.documents || []) byName.set(d.name, d);
    cursor = page.has_more ? page.next_cursor : "";
  } while (cursor);
  return byName;
}

async function main() {
  const files = collectMarkdown(KB_DIR).sort((a, b) => {
    // Prompt-mode docs first, then the rest alphabetically.
    const na = docNameFor(a);
    const nb = docNameFor(b);
    const pa = PROMPT_MODE_DOCS.has(na);
    const pb = PROMPT_MODE_DOCS.has(nb);
    if (pa && !pb) return -1;
    if (pb && !pa) return 1;
    return na.localeCompare(nb);
  });
  const systemPrompt = extractSystemPrompt();

  console.log(`Agent: ${AGENT_ID}`);
  console.log(`Knowledge base docs found: ${files.length}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no writes)" : REPLACE ? "REPLACE existing" : "reuse existing by name"}`);
  console.log("");

  // Confirm the agent exists and grab its current config to merge into (never clobber).
  const agent = await api("GET", `/convai/agents/${AGENT_ID}`);
  const cc = agent.conversation_config || {};
  const existing = await listAllKbDocs();

  // For a clean content refresh, detach everything from the agent first so the old
  // documents are no longer "in use" and can be deleted, then recreate + reattach.
  if (REPLACE && !DRY_RUN && existing.size) {
    const detached = {
      ...cc,
      agent: {
        ...(cc.agent || {}),
        prompt: { ...((cc.agent && cc.agent.prompt) || {}), knowledge_base: [] },
      },
    };
    await api("PATCH", `/convai/agents/${AGENT_ID}`, { conversation_config: detached });
    console.log("Detached existing knowledge base for clean replace.\n");
  }

  const kbEntries = [];
  let created = 0;
  let reused = 0;
  let replaced = 0;

  for (const file of files) {
    const name = docNameFor(file);
    const text = readFileSync(file, "utf8");
    const usage_mode = PROMPT_MODE_DOCS.has(name) ? "prompt" : "auto";
    const prior = existing.get(name);

    if (DRY_RUN) {
      const action = prior ? (REPLACE ? "replace" : "reuse") : "create";
      console.log(`  [${action}] ${name} (${usage_mode})`);
      kbEntries.push({ type: "text", name, id: prior?.id ?? "<new>", usage_mode });
      continue;
    }

    let id = prior?.id;
    if (prior && REPLACE) {
      try {
        await api("DELETE", `/convai/knowledge-base/${prior.id}`);
        id = undefined;
        replaced++;
      } catch (e) {
        console.warn(`  ⚠ could not delete "${name}" (${e.status ?? "?"}); reusing existing, content may be stale`);
      }
    }

    if (!id) {
      const res = await api("POST", "/convai/knowledge-base/text", { text, name });
      id = res.id;
      if (!(prior && REPLACE)) created++;
      console.log(`  ✓ ${prior ? "recreated" : "created"} ${name}`);
    } else {
      reused++;
      console.log(`  • reused ${name}`);
    }

    kbEntries.push({ type: "text", name, id, usage_mode });
  }

  // Build a merge-safe conversation_config: keep everything the agent already has,
  // while pinning the approved synthetic voice and guide behavior.
  const mergedConfig = {
    ...cc,
    tts: {
      ...(cc.tts || {}),
      voice_id: SYNTHETIC_VOICE_ID,
    },
    agent: {
      ...(cc.agent || {}),
      first_message: FIRST_MESSAGE,
      prompt: {
        ...((cc.agent && cc.agent.prompt) || {}),
        prompt: systemPrompt,
        knowledge_base: kbEntries,
        rag: RAG_SETTINGS,
      },
    },
  };

  console.log("");
  if (DRY_RUN) {
    console.log("DRY RUN — would PATCH agent with:");
    console.log(`  - system prompt: ${systemPrompt.length} chars`);
    console.log(`  - first message: "${FIRST_MESSAGE}"`);
    console.log(`  - voice: Jack John (${SYNTHETIC_VOICE_ID})`);
    console.log(`  - knowledge base: ${kbEntries.length} docs attached`);
    console.log(`  - RAG: ${JSON.stringify(RAG_SETTINGS)}`);
    return;
  }

  await api("PATCH", `/convai/agents/${AGENT_ID}`, { conversation_config: mergedConfig });

  // Indexing must be triggered explicitly — it is NOT automatic on attach.
  const { done, failed } = await ragIndexAll(kbEntries);

  console.log("");
  console.log(`✓ Docs: ${created} created, ${replaced} replaced, ${reused} reused`);
  console.log(`✓ Attached ${kbEntries.length} documents to the agent`);
  console.log(`✓ RAG enabled (${RAG_SETTINGS.embedding_model}); prompt-mode docs: ${[...PROMPT_MODE_DOCS].join(", ")}`);
  console.log(`✓ System prompt and first message updated`);
  console.log(
    done === -1
      ? "✓ RAG indexing triggered (finishing server-side)"
      : `✓ RAG indexing complete: ${done}/${kbEntries.length}${failed ? ` (${failed} failed)` : ""}`,
  );
  console.log("");
  console.log("Any previously-attached documents (e.g. the old single .txt) are now detached.");
}

main().catch((e) => {
  console.error("\n✗ Failed:", e.message);
  process.exit(1);
});
