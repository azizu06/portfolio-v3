# Agent configuration reference

Concrete settings to apply in the ElevenLabs Agents dashboard for the portfolio assistant. Pair this with `system-prompt.md` (the System prompt field) and the `knowledge-base/` documents.

## First message

The agent speaks as Aziz in the first person, so the opening line (the "First message" field) should sound like Aziz greeting a visitor. Pick one:

- Default: "Hey, I'm Aziz — welcome to my portfolio. Ask me anything about my background, my projects, or what I'm working on."
- Shorter: "Hey, I'm Aziz. What would you like to know about my work?"
- Warmer: "Hey there, Aziz here. Want to hear about my projects, my research, or how I got here?"

## Language

- Primary language: English.

## LLM

- Recommended model: a strong, low-latency model (for example GPT-4.1 / GPT-4o-class or Claude Sonnet-class). The prompt is small and the knowledge base does the heavy lifting, so you do not need the largest model.
- Temperature: 0.3–0.5. Lower keeps it factual and on-script, which suits a grounded, no-hallucination assistant.

## Knowledge base + RAG (the important part)

- Attach every document in `knowledge-base/` (including all of `knowledge-base/projects/`) to the agent.
- Turn ON **Use RAG** in the agent's Knowledge Base settings.
- Advanced settings (current values, set automatically by `npm run kb:push`):
  - Embedding model: `e5_mistral_7b_instruct`
  - Maximum document chunks (`max_retrieved_rag_chunks_count`): `20` (the ElevenLabs maximum)
  - Maximum vector distance (`max_vector_distance`): `0.7` (a bit looser than the 0.6 default to improve recall on paraphrased questions)
  - Maximum documents length (`max_documents_length`): `50000`
- Per-document mode:
  - Leave project docs and most docs on **Auto** (retrieved only when relevant).
  - `00-start-here.md` (core identity) and `07-timeline.md` (project recency) are set to **Prompt** mode so they're always in context — this is what makes "who are you" and "most recent project" reliable without depending on retrieval. Keep prompt-mode docs few and small.
- Note: ElevenLabs cannot RAG-index documents smaller than 500 bytes (they fall back to prompt mode). All generated docs in this repo clear that floor; the generator checks and warns if one doesn't.

## Voice

- Pick a clear, friendly, professional voice. Keep stability moderate so it sounds natural but not erratic.
- Optimize for latency if the 3D site is already heavy on the page.

## Guardrail / evaluation criteria (optional but recommended)

If you use ElevenLabs evaluation criteria or the Focus Guardrail, add checks like:

- "The response is in the first person and stays in character as Aziz (never a third-person 'assistant')."
- "The response only contains facts about Aziz that are supported by the knowledge base."
- "The response stays on the topic of Aziz, his work, or the portfolio."
- "The response does not share a contact email unless one is in the knowledge base."
- "If asked directly whether it is the real Aziz or an AI, the response acknowledges it is an AI version of Aziz, in his voice."

## Dynamic variables (optional)

If you later want to personalize (e.g. greet by referrer or page), ElevenLabs dynamic variables can be injected at conversation start. Not required for the base setup.

## Widget / embedding

The portfolio embeds the agent. For a private agent, the site requests a short-lived signed URL from `GET /api/elevenlabs/signed-url` (implemented in this repo) using `ELEVENLABS_API_KEY` and `ELEVENLABS_AGENT_ID` from `.env`. For a public agent you can embed the `<elevenlabs-convai agent-id="...">` widget directly without a signed URL. See `README.md` for which path to use.
