# Backrooms project preview

Sources checked October 26, 2026:

- [Devpost submission](https://devpost.com/software/backrooms-h4o783): project identity, Cal Hacks 13.0, four-person team, demo flow and policy behavior.
- [Source repository](https://github.com/azizu06/backrooms): Claude Agent SDK agents and their handoffs, 28 policy rules (`policy/src/sentences.ts`), WebAuthn approvals, SpacetimeDB state, Cartesia calls, local models on the NVIDIA Grace Blackwell GX10 (GB10 in `nvidia-smi` output) and the x402 payment (`docs/x402.md`).

No award is claimed. Cal Hacks 13.0 winners were not announced when this card
shipped, so the card has no `award` field and no Winner badge. Add one only after
Devpost shows a result.

`public/assets/project-previews/backrooms.mp4` is a muted 30-second H.264 preview
at 960 x 540 and 24 fps. It joins four clean UI screen recordings from the
team's demo-video project (`backroom-video/public`): `workday.mp4` 0-12 s
(isometric office during a workday), `firstperson.mp4` 3-9 s, `attack.mp4` 1-7 s
(Attack Lab) and `audit-ask.mp4` 4-10 s (Audit Wall). Each clip is cropped to
1736 x 977 from x 184 to drop the app sidebar, then scaled down. No captions,
phone footage or audio ship. The 44 MB narrated demo stays outside the repository.

The JPEG poster is the repository README banner
(`docs/assets/backrooms-office.jpg`, commit `5303ba6`), cropped to 16:9 and
scaled to 960 x 540.

Card metrics trace to the repository: `docs/redteam.md` (320 attack cases, none
moved money), `docs/evidence/burst/ten-company/summary.json` (99% of model tasks
on the GX10) and `docs/t10-gx10.md` plus `docs/eval/scoreboard.md` (3x faster
extraction, 99.7% of fields exact). Devpost is the card's secondary action;
GitHub is also available in the details dialog. Generated voice-guide documents
are updated locally only; publishing the hosted ElevenLabs knowledge base
requires separate authorization.
