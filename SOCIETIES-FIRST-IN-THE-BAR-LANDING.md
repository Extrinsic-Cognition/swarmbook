# SOCIETIES FIRST IN THE BAR

Nov 26 2026 UTC, `lane/societies-first-in-the-bar`.

His words, Nov 26 2026, over the site bar (`STAKE`, `RIDE`, `SOCIETIES`, `TRACENET`):
- "move societies to first order beforer stake"

## What changes

- **The site bar puts Societies first** on all eleven pages wearing `<nav class="site-bar" aria-label="Swarmbook">`:
  `Societies`, `Stake`, `Ride`, `Tracenet` (`after-the-mint.html`, `ecology.html`, `fees.html`, `found.html`, `index.html`, `polis.html`, `privacy.html`, `rules.html`, `terms.html`, `tracenet.html`, `warm.html`).
  - Active `aria-current="page"` attributes stay on each page's own item (`Societies` on `index.html`, `found.html`, `polis.html`; `Tracenet` on `tracenet.html`).
- **Tests updated:** `app/after-the-mint.test.mjs` (THE ONE HEADER) and `app/swarmbook-floor.test.mjs` (THE FRONT DOOR WEARS THE BAR) assert the new order.
- **JavaScript / HTML net 0** (+14 / -14 across 13 files; static links only, no script or runtime cost added).

## Measured (this tree served by `tools/serve-range`, headless off every screen)

- `node --test app/after-the-mint.test.mjs app/swarmbook-floor.test.mjs`: 28 of 28 passing.
- **Rule 8, no sound touched:**
  - `node --test app/dl-twelve.test.mjs`: 22 of 22 passing;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <warm.html served by tools/serve-range>` passes with `--tap button` (PASS, tap at 6.08 s, 0 seeks) and `--tap sphere` (PASS, tap at 6.07 s, 0 seeks).

## Owed

- Live on swarmbook.com at his word (deploy).
