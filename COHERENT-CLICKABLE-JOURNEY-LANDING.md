# COHERENT CLICKABLE JOURNEY — Landing Receipt

Date: 2026-11-26
Branch: `lane/coherent-clickable-journey`
Base: `49ceaf7982`

## Problem (Exhaustive Clickable Traversal)

An exhaustive traversal of every clickable link and button across all 13 Swarmbook pages (`warm.html`, `index.html`, `after-the-mint.html`, `ecology.html`, `rules.html`, `found.html`, `polis.html`, `tracenet.html`, `claim.html`, `creator.html`, `fees.html`, `terms.html`, `privacy.html`) found 7 journey breaks against the canonical flow (`warm.html` Saint Seiya → Nefertiti Blue Pent / Red Hex split → persistent 4-tab webapp `Societies | Stake | Ride | Tracenet`):

1. **`warm.html?door=deposit` hid the site-bar**: `site-bar.css` excluded `:not([data-hexmint])`, stranding anyone who entered the deposit door with no navigation back to the four tabs.
2. **Orphaned `$WARM` / `Mint your hexagon →` CTAs on `ecology.html` and `rules.html`**: both intro pages jumped straight to `./warm.html?door=deposit` instead of staying on the intro walk (`Why → How → Societies`).
3. **Dead/short-circuited CTAs on `index.html`**: `a.hero-mine` (`Prompt-2-mine $WARM`) pointed to `./warm.html#refuel` (commented out), and bottom `#get-warm` (`Mint your hexagon →`) jumped straight to `./warm.html?door=deposit` instead of the Ride tab (`./after-the-mint.html?side=flask`).
4. **Dead `#wells` anchor on Stake (`after-the-mint.html?side=pool`)**: `#her-door`'s `"Send it to a wish"` pointed to `./after-the-mint.html?side=pool#wells`, which is `display:none!important` on the blue Stake side. Retargeted to `./index.html#wall` (the Societies wall).
5. **Unminted `tracenet.html` bounce**: clicking an unminted tracenet canvas in `tracenet-trail.mjs` called `open('./warm.html')`, which bounces returning visitors (`am-intro=1`) to `index.html` instead of Ride (`./after-the-mint.html?side=flask`).
6. **Stranded pages without site-bar**: `claim.html` and `creator.html` had no `.site-bar`, and `claim.html`'s `"Back to your seat ↗"` linked to bare `./after-the-mint.html` (which redirects to `./warm.html`).
7. **Broken root wordmarks**: 8 pages (`ecology.html`, `rules.html`, `found.html`, `polis.html`, `tracenet.html`, `fees.html`, `terms.html`, `privacy.html`) linked `SWARMBOOK` to `href="/"` instead of `href="./index.html"`.

## Changes

- `embertide-app/ui/intro/dyson-society/app/site-bar.css` & `warm.html`: keep `.mint-site-bar` visible on `html[data-hexmint]`; bump `site-bar.css?v=bar-3`.
- `embertide-app/ui/intro/dyson-society/app/ecology.html` & `rules.html`: remove orphaned `#get-warm` deposit CTA block; change wordmark `href="/"` → `./index.html`.
- `embertide-app/ui/intro/dyson-society/app/index.html`: retarget `a.hero-mine` and `#get-warm` `a.plug` to `./after-the-mint.html?side=flask`.
- `embertide-app/ui/intro/dyson-society/app/after-the-mint.html`, `poleis/door/tests/the_pages.rs`, `poleis/press/tests/page.rs`: retarget `#her-door` `"Send it to a wish"` from `./after-the-mint.html?side=pool#wells` to `./index.html#wall`.
- `embertide-app/ui/intro/dyson-society/app/tracenet-trail.mjs` & `tracenet.html`: unminted canvas click opens `./after-the-mint.html?side=flask`; bump `tracenet-trail.mjs?v=the-page-says-only-its-own-2`; wordmark `href="./index.html"`.
- `embertide-app/ui/intro/dyson-society/app/claim.html` & `creator.html`: add `.site-bar` (`Societies | Stake | Ride | Tracenet`) and `site-bar.css?v=bar-3`; update `claim.html` back link to `./after-the-mint.html?side=flask`.
- `embertide-app/ui/intro/dyson-society/app/found.html`, `polis.html`, `fees.html`, `terms.html`, `privacy.html`: wordmark `href="/"` → `./index.html`.
- `embertide-app/ui/intro/dyson-society/app/swarmbook-floor.test.mjs` & `after-the-mint.test.mjs`: align assertions with coherent link targets, visible `.mint-site-bar` on `data-hexmint`, and `.site-bar` on `claim.html` + `creator.html`.
- `embertide-screens/loads.json`: add `app/site-bar.css` (and `dm-sans-500.ttf` / `dm-sans-400.ttf`) to `claim` and `creator`.

## Verification

- JS unit tests (`after-the-mint.test.mjs`, `swarmbook-floor.test.mjs`, `dl-claim.test.mjs`, `dl-twelve.test.mjs`, `dl-mint-hexagon.test.mjs`, `dl-kit-deposit.test.mjs`, `tracenet.test.mjs`, `tracenet-trail.test.mjs`, `guide.test.mjs`, `wall-door.test.mjs`): **88/88 passed**.
- `build-optimism-fit.test.mjs`: passed (every page and reached module ships).
- Rust `poleis/door` (`cargo test --test the_pages`): **4/4 passed**.
- Rule 8 browser proofs (`dl-twelve.proof.mjs` over `tools/serve-range`):
  - `--tap button`: **PASS** (`soundOn: true`, `hearing: true`, `seeks: 0`, `drift: -0.0134 s`, `errors: []`).
  - `--tap sphere`: **PASS** (`soundOn: true`, `hearing: true`, `seeks: 0`, `drift: -0.0126 s`, `errors: []`).
- Screens gate (`no-landing-adds-a-failing-screen` shards 1 & 2): **192/192 cells judged, 0 new failing, 0 baseline regressions** (2 newly loaded DM Sans font files added to `loads.json`).
- House gates: `the-look-is-a-law.test.mjs` and `the-javascript-only-shrinks.test.mjs` (**42/42 passed**, net **-12** JS/HTML lines: `+24 / -36` across 16 files).
