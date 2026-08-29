# ElevenLabs portfolio voice agent

Everything needed to configure Aziz Umarov's portfolio voice agent: a crafted system prompt, a RAG-optimized knowledge base split into focused documents, and the exact dashboard settings.

**This agent is Aziz's AI portfolio guide.** It uses a synthetic voice and speaks about Aziz in the third person. The system prompt and first message identify it transparently; it never impersonates Aziz or implies that the selected voice is his real voice. Some knowledge-base documents remain Aziz-authored first-person source material, and the system prompt requires the guide to convert that wording into third-person narration before speaking.

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
    ├── 07-timeline.md        (projects newest-first)— GENERATED (prompt mode)
    └── projects/
        ├── index.md          (project catalog)      — GENERATED
        └── <one file per project>.md (24 files)     — GENERATED
```

"GENERATED" files are built from the portfolio's own data and must not be edited by hand.

## Why RAG (and why many small documents)

ElevenLabs is right that a short knowledge base could just be pasted into the system prompt — but that doesn't scale here. With 25 projects plus profile, education, experience, and skills, inlining everything would blow past the ~2000-token prompt budget (which raises latency and cost) and bury the agent's instructions in reference text.

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

## Setup (automated)

The whole agent — system prompt, first message, all knowledge-base documents, RAG settings, and per-document modes — is pushed by one script using the ElevenLabs API:

```bash
npm run kb:build              # regenerate docs from src/data/*.ts
npm run kb:push               # upload + attach + enable RAG + set prompt/first message
npm run kb:push -- --replace  # refresh content of docs that already exist (detaches, recreates, reattaches)
npm run kb:push -- --dry-run  # preview actions without writing
```

It reads `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID` from `.env`. What it sets:

- **System prompt** from the code block in `system-prompt.md`.
- **First message** (the default in `scripts/push-elevenlabs-agent.mjs`).
- **Synthetic voice**: Jack John - Conversational and Upbeat.
- **All `knowledge-base/` docs** created and attached.
- **RAG** on: `e5_mistral_7b_instruct`, max chunks `20`, max vector distance `0.7`, max docs length `50000`.
- **Prompt-mode docs**: `00-start-here` (identity) and `07-timeline` (recency) are always in context; everything else is Auto (retrieved on demand).

The script triggers RAG indexing for every document and waits for it to finish (indexing is **not** automatic on attach — without it, retrieval returns nothing and the agent guesses). Then **test** by talking to the agent: "Who are you?", "What's Aziz's most recent project?", "What vector database does PopChoice use?", "How do I reach Aziz?", an out-of-scope one ("What's the weather?"), and "Are you actually Aziz?". You can also test programmatically with the `simulate-conversation` API.

The script preserves the existing LLM model/temperature. Voice and guide behavior are pinned by the repository configuration.

### Doing it by hand instead

If you'd rather not run the script: open the agent (ID in `.env`), paste `system-prompt.md` into the System prompt field, set the first message from `agent-config.md`, drag every file under `knowledge-base/` (incl. `projects/`) into the knowledge base, toggle **Use RAG** with the Advanced values above, and set `00-start-here` + `07-timeline` to Prompt mode.

## Embedding the agent on the site

Two options depending on whether your agent is public or private:

- **Public agent (simplest):** drop the ElevenLabs widget on the page — `<elevenlabs-convai agent-id="...">` plus their embed script. No server code needed.
- **Private agent (recommended for control):** the browser fetches a short-lived signed URL from this repo's endpoint, which keeps the API key server-side.

This repo implements the private path at:

```
src/app/api/elevenlabs/signed-url/route.ts   →  GET /api/elevenlabs/signed-url
```

It reads `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID` from `.env`, calls ElevenLabs, and returns `{ "signedUrl": "wss://..." }`. The signed URL expires after 15 minutes. Wire the client widget / SDK to call this endpoint to start a conversation. (Make sure `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID` are set in your Vercel project env, not just local `.env`.)

## Maintenance checklist

- Added/edited a project, skill, or role? → `npm run kb:build` then `npm run kb:push -- --replace`.
- Changed bio, education, or contact? → edit the curated doc directly, then `npm run kb:push -- --replace`.
- Want different agent behavior? → edit `system-prompt.md`, then `npm run kb:push` (re-pushes the prompt).
- The old single `elevenlabs-portfolio-knowledge-base.txt` monolith has been removed (deleted locally and from the ElevenLabs account) — the focused document set replaces it.
