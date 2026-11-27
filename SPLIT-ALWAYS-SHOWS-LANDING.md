# SPLIT ALWAYS SHOWS — Landing Receipt

Date: 2026-11-26
Branch: `lane/split-always-shows`
Base: `2642923c9e8e`

## Problem

When Nefertiti reaches `"Take this egg."` (`html[data-egg-offered]`) on `warm.html`, `#dl-sides` (the blue pentagon / red hexagon split background) and `.dl-flask-door` (the two choice plates `Keep your SOL / Fuel the swarm` and `The egg is yours / Ride the swarm`) were still gated on `:has(.snowtrace-kit [data-deposit]:not(:disabled))` / `:has([data-deposit]:not(:disabled))` in `dl-paywall.css`. Whenever `/space-router/v1/deposit` did not answer (static localhost preview, offline, or slow/paused Worker), the entire blue/red split and both plates stayed hidden — even though neither plate needs the deposit API (`Fuel the swarm` navigates via `dl-side-press.js` to `./after-the-mint.html?side=pool`, and `Ride the swarm` runs `dl-hexagon.js` / `./after-the-mint.html?side=flask`).

## Change

- `embertide-app/ui/intro/dyson-society/app/dl-paywall.css` (lines 275, 278, 433, 442, 456, 459): removed `:has(.snowtrace-kit [data-deposit]:not(:disabled))` and `:has([data-deposit]:not(:disabled))` from the `html[data-egg-offered]` split background and plate rules so Nefertiti's blue pentagon / red hexagon split always renders as soon as she offers the egg.

## Verification

- JS unit tests (`dl-twelve.test.mjs`, `dl-athena.test.mjs`, `dl-kit-deposit.test.mjs`, `dl-side-press.test.mjs`, `dl-hexagon.test.mjs`, `after-the-mint.test.mjs`): **83/83 passed**.
- Rule 8 browser proofs (`dl-twelve.proof.mjs` over `tools/serve-range`):
  - `--tap button`: **PASS** (`soundOn: true`, `hearing: true`, `seeks: 0`, `drift: -0.0133 s`, `errors: []`).
  - `--tap sphere`: **PASS** (`soundOn: true`, `hearing: true`, `seeks: 0`, `drift: -0.0141 s`, `errors: []`).
- Net JS/HTML lines: **0** (CSS-only change).
