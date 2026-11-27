# BLUE HARMONIZER SMOOTH — Landing Receipt

Date: 2026-11-26
Branch: `lane/blue-harmonizer-smooth`
Base: `ea465d2dc0f0` (`lane/harmonizer-plays-first-time`)

## Problems Fixed

1. **`PROMPT-2-MINE $WARM` leaking onto Blue (`?side=pool`) during the harmonizer**: `swarmbook-book.css` only hid `.am-say .am-warm` once `data-arrow="bar"` was set, so the red plate rendered under `SWARMBOOK` throughout the blue harmonizer animation and then abruptly vanished at the end.
2. **Frozen whitened-out pentagons and harsh snap into the top bar**:
   - `after-the-mint-tree.mjs` lit each pentagon on the ball white (`ease(f / .15)`) on liftoff and never faded it back out as the pentagon flew away (`f > .15`).
   - `swarmbook-book.css` left `transition: opacity .9s` active on `.am-tree-canvas`, restarting a 0.9 s transition lag on every frame of JS's 0.75 s fadeout (`canvas.style.opacity = String(1 - gone)`), keeping the ball frozen on screen until `end()` snapped `.am-tree` to `display:none`.
   - `.am-bar polygon` snapped from `opacity: 1` to `0` in one frame when `data-arrow="bar"` revealed the 12 zodiac houses.
3. **Governance video popup skipped after explicit Nefertiti Blue Pent replay**: once `am-film=1` had been set by a prior Skip, replaying the full Nefertiti → Blue Pent (`Fuel the swarm`) handoff (`.am-bridge`) did not open `#film-pop` after the harmonizer finished.

## Changes

- `embertide-app/ui/intro/dyson-society/app/swarmbook-book.css`:
  - Line 262: `html[data-side="pool"] .am-say .am-warm{display:none}` (hide `PROMPT-2-MINE` throughout blue, not only after `data-arrow="bar"`).
  - Line 412: disable `.am-tree-canvas` opacity transition once `data-arrow="struck"` (`html[data-side="pool"][data-arrow="struck"] .am-tree-canvas{transition:none}`) so JS's 0.75 s fadeout runs in real time; add `.am-bar polygon{transition:opacity .45s ease}` to smoothly dissolve the 12 flying gold pentagons into the 12 sculpted zodiac houses.
- `embertide-app/ui/intro/dyson-society/app/after-the-mint-tree.mjs`:
  - Line 21: fade each pentagon's liftoff flash back out (`ease(f / .12) * (1 - ease((f - .12) / .38))`) instead of staying solid white on the ball.
- `embertide-app/ui/intro/dyson-society/app/after-the-mint-book.mjs`:
  - Line 15: open the governance film popup (`F?.open?.()`) when arriving via Nefertiti's blue pentagon handoff (`.am-bridge`), while preserving `F?.intro?.()` (cookie `am-film=1`) for normal tab switches.

## Verification

- JS unit tests (`after-the-mint.test.mjs`, `dl-twelve.test.mjs`, `dl-side-press.test.mjs`, `swarmbook-floor.test.mjs`): **53/53 passed**.
- Rule 8 browser proofs (`dl-twelve.proof.mjs` over `tools/serve-range`):
  - `--tap button`: **PASS** (`soundOn: true`, `hearing: true`, `seeks: 0`, `drift: -0.0139 s`, `errors: []`).
  - `--tap sphere`: **PASS** (`soundOn: true`, `hearing: true`, `seeks: 0`, `drift: -0.0136 s`, `errors: []`).
- Net JS/HTML lines: **0** (`+2 / -2` across 2 JS files).
