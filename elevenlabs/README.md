# ElevenLabs portfolio voice agent

Everything needed to configure Aziz Umarov's portfolio voice agent: a crafted system prompt, a RAG-optimized knowledge base split into focused documents, and the exact dashboard settings.

**This agent is Aziz, in the first person.** It's embedded on the portfolio so visitors feel like they're talking to Aziz directly — not to a separate "assistant." The system prompt, knowledge base, and first message are all written in his voice. The one honesty rule: if a visitor *directly* asks whether they're talking to the real Aziz or an AI, the agent acknowledges (in his voice) that it's an AI version of Aziz built into the site, then keeps going. It never claims to be a physically present human or pretends it can take real-world actions.

## What's in here

```
elevenlabs/
├── README.md            ← you are here (setup guide)
├── system-prompt.md     ← paste into the agent's System prompt field
├── agent-config.md      ← first message, LLM, voice, RAG settings (exact values)
└── knowledge-base/      ← upload ALL of these to the agent's knowledge base
    ├── 00-start-here.md      (overview + routing)   — curated
    ├── 01-profile.md         (identity + contact)   — curated
    ├── 02-education.md       (UCF, GPA, coursework) — curated
    ├── 03-experience.md      (Knight Hacks, ISUE)   — GENERATED
    ├── 04-skills.md          (skills + rationale)   — GENERATED
    ├── 05-faq.md             (conversational Q&A)   — curated
    ├── 06-portfolio-site.md  (how the site works)   — curated
    └── projects/
        ├── index.md          (project catalog)      — GENERATED
        └── <one file per project>.md (24 files)     — GENERATED
```

"GENERATED" files are built from the portfolio's own data and must not be edited by hand.

## Why RAG (and why many small documents)

ElevenLabs is right that a short knowledge base could just be pasted into the system prompt — but that doesn't scale here. With 24 projects plus profile, education, experience, and skills, inlining everything would blow past the ~2000-token prompt budget (which raises latency and cost) and bury the agent's instructions in reference text.

RAG fixes this: the agent retrieves only the chunks relevant to each question. Splitting into one document per topic — and one per project — gives clean, high-precision retrieval. A question about "PopChoice" pulls the PopChoice document, not a slice of a giant file that happens to also mention CrisisLens. This is the setup that makes the agent feel like it actually knows the work.

Constraint to remember: ElevenLabs cannot RAG-index documents under 500 bytes (they silently fall back to prompt mode). Every generated doc here clears that floor, and the build script verifies it.

## How the knowledge base is generated

The generated docs come from the portfolio's source of truth in `src/data/`:

- `src/data/projects.ts` → `knowledge-base/projects/*.md` + `projects/index.md`
- `src/data/experience.ts` → `knowledge-base/03-experience.md`
- `src/data/skills.ts` → `knowledge-base/04-skills.md`

Rebuild any time you change project/skill/experience data:

```bash
npm run kb:build
```

(The script is `scripts/build-elevenlabs-kb.mjs`, run with Node's TS type-stripping.) The curated docs — overview, profile, education, FAQ, site guide — are written by hand and never touched by the build. Edit those directly when Aziz's bio, education, or contact details change.

### Fill-in placeholders

A few curated docs have `<!-- FILL IN -->` comments for facts only you know — expected graduation date, class standing, specific coursework, a public contact email, and confirmation of the internship-seeking line. Search for `FILL IN`:

```bash
grep -rn "FILL IN" elevenlabs/knowledge-base
```

Fill them in (or delete the comment to keep the default behavior). The agent is instructed never to guess these, so leaving them blank is safe — it just means the agent will say "I don't have that detail."

## Setup steps (ElevenLabs dashboard)

1. **Open your agent.** It already exists — its ID is in `.env` as `ELEVENLABS_AGENT_ID`.
2. **System prompt.** Copy the contents of the code block in `system-prompt.md` into the agent's System prompt field.
3. **First message + LLM + voice.** Apply the values in `agent-config.md`.
4. **Upload the knowledge base.** Add every file under `knowledge-base/` (including all of `projects/`) to the agent's knowledge base. You can drag the markdown files in directly.
5. **Enable RAG.** In the agent's Knowledge Base settings, toggle on **Use RAG**, then under Advanced set:
   - Embedding model: `e5_mistral_7b_instruct`
   - Maximum document chunks: `20`
   - Maximum vector distance: `0.6`
   - Maximum documents length: `50000`
6. **Document modes.** Leave everything on **Auto**. Optionally switch only `00-start-here.md` to **Prompt** mode so core identity is always in context.
7. **Wait for indexing.** Each document indexes automatically once added to a RAG-enabled agent. Give it a moment before testing.
8. **Test.** Speak to it as a visitor and confirm it answers as Aziz in the first person: "Who are you?", "What's your best project?", "Do you have RAG experience?", "How do I reach you?", an out-of-scope one ("What's the weather?") to check the guardrails, and "Are you actually Aziz or an AI?" to confirm the honest-but-in-character acknowledgment.

## Embedding the agent on the site

Two options depending on whether your agent is public or private:

- **Public agent (simplest):** drop the ElevenLabs widget on the page — `<elevenlabs-convai agent-id="...">` plus their embed script. No server code needed.
- **Private agent (recommended for control):** the browser fetches a short-lived signed URL from this repo's endpoint, which keeps the API key server-side.

This repo implements the private path at:

```
src/app/api/elevenlabs/signed-url/route.ts   →  GET /api/elevenlabs/signed-url
```

It reads `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID` from `.env`, calls ElevenLabs, and returns `{ "signedUrl": "wss://..." }`. The signed URL expires after 15 minutes. Wire the client widget / SDK to call this endpoint to start a conversation. (Make sure `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID` are set in your Vercel project env, not just local `.env`.)

## Replacing the old single-file knowledge base

The repo's earlier `elevenlabs-portfolio-knowledge-base.txt` (one 32KB file) is superseded by this document set. After uploading the new docs and confirming the agent answers well, remove that single document from the ElevenLabs knowledge base so retrieval isn't split between the old monolith and the new focused docs. (The local `.txt` file can stay or be deleted — it's just the old source.)

## Maintenance checklist

- Added/edited a project, skill, or role? → `npm run kb:build`, then re-upload the changed `knowledge-base/projects/*.md` / `03-experience.md` / `04-skills.md`.
- Changed bio, education, or contact? → edit the curated doc directly, then re-upload it.
- Want different agent behavior? → edit `system-prompt.md` and paste it back into the dashboard.
