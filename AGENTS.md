# Portfolio agent guide

`AGENTS.md` is the shared project workflow; `CLAUDE.md` imports it.
This is `azizu06/portfolio-v3`, the current Next.js portfolio. Read `README.md`
for the project map and only the source/data relevant to the requested change.

## Delivery and verification

- Inspect branch, status, worktrees, and open PRs before edits. Preserve existing
  work; use a separate branch/worktree for concurrent changes.
- Use the installed Matt Pocock workflow appropriate to the task: diagnosing-bugs
  for an unproved regression, tdd for changed behavior, and independent Standards
  and Spec code-review for a reviewable change. Keep tests proportional to risk.
- Use Node 24.x and npm with the committed package-lock.json. For code changes,
  run `npm run lint` and `npm run build`; report unavailable checks honestly.
  For visual changes, inspect the affected routes at desktop/mobile sizes,
  keyboard focus, reduced motion, loading/failure states, and console errors.
- There is no general `npm test` script. The Playwright capture spec records
  external project demos; it is not a regression suite. Do not run it as a
  generic test or overwrite media merely to validate unrelated edits.
- Edit portfolio facts in `src/data/` and verify Aziz's personal contribution
  against supplied evidence. Repository presence is not proof of his mastery.
  When changing data consumed by the voice guide, run `npm run kb:build` and
  inspect the generated knowledge-base diff for truth and consistency.
- `npm run kb:push` mutates the hosted ElevenLabs agent. Obtain explicit
  authorization for that publication; local validation does not require it.
- Preserve existing design direction and assets. Load skills needed for the
  affected surface; missing optional tooling is not a reason to invent results.

## Agent skills

### Issue tracker

GitHub Issues in `azizu06/portfolio-v3`; see `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary; see `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout; see `docs/agents/domain.md`.

## Graphify

For a cross-module question, use an existing current graph when available and
verify its claims against source. Otherwise use targeted source search. Do not
install Graphify, index the whole repository, or commit generated graphs as a
prerequisite for a content, styling, or small component change.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:react-bits-agent-rules -->
# React Bits visual component preference

For React or Next.js UI work in this repo, prefer React Bits components via the
`@react-bits` shadcn registry for backgrounds, small visual components,
animations, and hover effects before creating custom effects from scratch.

Use the configured shadcn registry to browse and install components, then adapt
them to the existing app structure and styling conventions.
<!-- END:react-bits-agent-rules -->

<!-- BEGIN:portfolio-design-agent-rules -->
# Portfolio design quality rules

For any UI, UX, visual design, animation, layout, or copy-presentation work in
this portfolio, agents must consult and apply the local design/taste guidance
before changing code. Use these skills as the required baseline:

- `gpt-taste`
- `design-taste-frontend`
- `high-end-visual-design`

Treat UI/UX quality as a primary requirement, not polish after implementation.
Before editing portfolio UI, do a quick design pass for hierarchy, spacing,
motion, material treatment, responsiveness, accessibility, and consistency with
the Cobalt sky palette. Favor Apple/macOS-style restraint where appropriate:
liquid glass surfaces, clear hierarchy, smooth physical motion, precise hover
states, generous spacing, and minimal visual clutter.

Keep using React Bits and shadcn/ui for interface components whenever practical.
Do not add custom UI primitives when an existing React Bits or shadcn component
can be adapted cleanly.
<!-- END:portfolio-design-agent-rules -->
