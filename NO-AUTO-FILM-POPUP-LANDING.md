# NO AUTO FILM POPUP — Landing Receipt

Date: 2026-11-26
Branch: `lane/no-auto-film-popup`
Base: `8b892aa85ecd`

## Problem

Auto-opening `#film-pop` immediately after the blue harmonizer lands on `after-the-mint.html?side=pool` caused intro exhaustion right after Saint Seiya → Nefertiti → Harmonizer.

## Change

- `embertide-app/ui/intro/dyson-society/app/after-the-mint-book.mjs`: mount the governance film (`film()`) without auto-calling `F?.intro?.()` or `F?.open?.()` after the bar stands. Clicking Nefertiti's face at the Pantheon Oculus (`[data-film-door]`) continues to open `#film-pop` on demand.
- `embertide-app/ui/intro/dyson-society/app/after-the-mint.test.mjs`: assert `after-the-mint-book.mjs` does not auto-open the governance film popup.

## Verification

- JS unit tests (`after-the-mint.test.mjs`, `dl-twelve.test.mjs`, `swarmbook-floor.test.mjs`): **50/50 passed**.
- Rule 8 browser proofs (`dl-twelve.proof.mjs` over `tools/serve-range`):
  - `--tap button`: **PASS** (`soundOn: true`, `hearing: true`, `seeks: 0`, `drift: -0.0142 s`, `errors: []`).
  - `--tap sphere`: **PASS** (`soundOn: true`, `hearing: true`, `seeks: 0`, `drift: -0.0130 s`, `errors: []`).
- Net JS/HTML lines: **0** (`+2 / -2` across 2 files).
