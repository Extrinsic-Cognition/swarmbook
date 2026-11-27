# HARMONIZER PLAYS FIRST TIME — Landing Receipt

Date: 2026-11-26
Branch: `lane/harmonizer-plays-first-time`
Base: `d377c1817730`

## Problem

`dl-athena.js` writes `am-intro=1` the instant Nefertiti offers her egg (`"Take this egg."`) so future visits to `/` go straight to Societies (`index.html`). Because `after-the-mint-tree.mjs` checked the exact same `am-intro=1` cookie to skip the arrow / three-waves / 12-pentagon harmonizer animation, every first-time visitor who clicked Blue Pent (`Keep your SOL · Fuel the swarm`) from Nefertiti had the entire harmonizer animation skipped on arrival and jumped straight to the static bar + governance film popup.

## Change

- `embertide-app/ui/intro/dyson-society/app/after-the-mint-tree.mjs`:
  - Check a dedicated `am-bar=1` cookie instead of `am-intro=1`, and always play when arriving directly via Nefertiti's blue pentagon handoff (`!doc.querySelector('.am-bridge')`).
  - Write both `am-intro=1` and `am-bar=1` when the bar stands (`end()`), so tab cycling between `Societies | Stake | Ride | Tracenet` still opens directly on the bar without replaying.
- `embertide-app/ui/intro/dyson-society/app/after-the-mint.test.mjs`:
  - Assert `am-bar=1` skips to the bar, `am-intro=1` alone does NOT skip the harmonizer, and `.am-bridge` always plays it.

## Verification

- JS unit tests (`after-the-mint.test.mjs`, `dl-twelve.test.mjs`, `dl-side-press.test.mjs`, `swarmbook-floor.test.mjs`): **53/53 passed**.
- Rule 8 browser proofs (`dl-twelve.proof.mjs` over `tools/serve-range`):
  - `--tap button`: **PASS** (`soundOn: true`, `hearing: true`, `seeks: 0`, `drift: -0.0137 s`, `errors: []`).
  - `--tap sphere`: **PASS** (`soundOn: true`, `hearing: true`, `seeks: 0`, `drift: -0.0136 s`, `errors: []`).
- Net JS/HTML lines: **0** (`+6 / -6` across 2 files).
