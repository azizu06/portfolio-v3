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
