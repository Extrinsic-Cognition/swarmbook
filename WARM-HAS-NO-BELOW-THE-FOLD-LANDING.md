# WARM HAS NO BELOW THE FOLD

Nov 26 2026 UTC, `lane/warm-has-no-below-the-fold` (off `main` `dcf52f9b3f`).

His words, Nov 26 2026, seeing `UNIT 0 · The Dyson Society` appear underneath `Restart | Sound off | Pause` on `swarmbook.com/app/warm.html`: "this is not supposed to be accessible" / "how the fuck u got there?".

## What changed

- **`app/warm.html`**:
  - Wrapped `<section class="warm-galaxy hero-journey" id="purpose" ...>` (containing `.galaxy-theater`, `#warm-world` / `UNIT 0 · The Dyson Society`, and `#warm-state`) in `<template data-commented-out>`, matching `#harmony-doors`/`#mint`, `#rite`, `#refuel`, and `<footer>`. Claudio's governance film now lives on the Stake tab (`after-the-mint.html?side=pool`, THE FILM OPENS THE STAKE).
  - Updated the head reload script so `history.replaceState` clears any stale hash (`location.pathname + location.search`) instead of appending `#purpose`.
  - Removed 31 trailing blank lines before `#dl-swarmy-holder` and bumped `warm-entry.mjs?v=no-below-1` and `warm-fullframe.css?v=no-below-1`.
- **`app/warm-entry.mjs`**:
  - Gated `warm-film-center.js`, `warm-galaxy-player.js`, `warm-state.js`, and `warm-spatial.js` on `doc.querySelector('[data-warm-galaxy]')` (same pattern as `warm-ceremony.js`), preserving literal dynamic imports for `tools/page-files.mjs` while loading/running none of them on `warm.html` and avoiding any `galaxy-desktop.mp4` / `galaxy-mobile.mp4` / poster fetches.
- **`app/warm-fullframe.css`**:
  - Fixed `.genesis:has([data-cinematic]) > .hero-copy` specificity so `.hero-copy` keeps `height:0; padding:0` and `.genesis:has([data-cinematic])` keeps `padding:0` — exact `100svh` hero with `0 px` scrollable overflow below the viewport at desktop and mobile sizes.
- **`app/warm-entry.test.mjs`**:
  - Added pin test asserting `#purpose`, `#warm-world`, `#warm-state`, `[data-warm-galaxy]`, `[data-galaxy-video]`, and `UNIT 0` world chrome are absent from live `warm.html`, reload never appends `#purpose`, `warm-entry.mjs` gates all four galaxy/world modules, and `dl-space-router.js` appends 0 `.dl-film-skip` buttons without `#purpose`.
- **`embertide-screens/baseline.json`**:
  - Removed all 12 `{"screen":"warm","size":"...","check":"d"}` lines that now pass because the sub-12px `#purpose` controls and `.dl-film-skip` pill are no longer in the live DOM.

## Measured (served by `tools/serve-range`, headless Chrome off every screen)

- **DOM / scroll / network probes** (`desktop 1440x900`, `mobile 390x844`, `#purpose`, `#world`, and `localStorage['dl.egg.minted']='1'` without `data-on-track`):
  - `scrollHeight === innerHeight` (`overflowY === 0`), `scrollTo(0, 5000)` stays at `scrollY === 0`;
  - `#purpose`, `#warm-world`, `#warm-state`, `[data-warm-galaxy]` are `null`, `.dl-film-skip` count is `0`;
  - `0` requests for `galaxy-desktop.mp4`, `galaxy-mobile.mp4`, `galaxy-*-poster.jpg`, `warm-galaxy-player.js`, `warm-spatial.js`, `warm-state.js`, or `warm-film-center.js`; `0` runtime exceptions.
- **Rule 8 (sound never restarts picture):**
  - `node --test app/dl-twelve.test.mjs`: green;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <served>/intro/dyson-society/app/warm.html --tap button`: PASS (7/7 checks, drift `-0.013 s`);
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <served>/intro/dyson-society/app/warm.html --tap sphere`: PASS (7/7 checks, drift `-0.013 s`).
- **THE JAVASCRIPT ONLY SHRINKS:** `+27 -39`, net `-12` JS/HTML lines in 3 files — green (40/40).
- **Site & worker tests (`app/*.test.mjs tools/site-files.test.mjs worker/premint.test.mjs`):** 610 of 612 pass (only main's 2 pre-existing failures: `dl-paywall.test.mjs:450` and `warm-sphere-moment.test.mjs:12`).
- **House gates (`any-room`, `no-page-of-its-own`, `the-law-is-the-gate`):** green.
- **NO LANDING ADDS A FAILING SCREEN:** green on both shards (0 new failing, 0 loads drift, baseline shrunk by 12 `warm` check `d` cells).
