# Issue tracker: GitHub

Issues and PRDs live in `azizu06/portfolio-v3`. Prefer `gh-axi` for supported
operations; inspect its help and use `gh` only for a documented capability gap.
Run from the correct worktree and verify the remote before a write.

Read the relevant issue and comments before implementation. A direct user request
can define a small local correction; do not manufacture tickets for trivial edits.
For a feature or multi-step change, use a finite issue with acceptance criteria,
owned surfaces, exclusions, dependencies, and verification. Keep one substantive
issue to one branch/worktree/PR; resume existing ownership.

Use --body-file for multiline GitHub text. Publishing an issue, PR, or comment
must stay within the user's authorization. Setup does not publish anything.

**PRs as a request surface: no.**

For wayfinding, use a parent issue with child issues; use native dependencies
where supported, otherwise explicit `Blocked by #N` links. Verify blockers are
closed before claiming a child. Fetch live issue state rather than relying on
saved summaries.
