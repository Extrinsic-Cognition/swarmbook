# DESCENT CAPTIONS READABLE

Nov 26 2026 UTC, `lane/descent-captions-readable`.

His words, Nov 26 2026, over the descent caption "REASON, THEN REUSE" on `index.html`:
- "bro, all those shits are unlegible"

## What was wrong

- `guide.css` defined `.descent`'s `--descent-ink` and `--descent-ground` by mixing `var(--ink)` and `var(--panel)` for the old parchment-to-night theme (`--ink` dark, `--panel` cream).
- After `THE FRONT IS THE MINT'S WORLD` (Nov 24) turned `index.html` dark (`--ink: #fbf6ea`, `--panel: rgba(251,246,234,.045)`), `--descent-ground` resolved to solid `#fbf6ea` white — turning `.descent-words::before` into a solid white blurred fog box behind white `--descent-ink` text with white text-shadow, making every descent caption unreadable.

## What changes

- **`front.css`:** sets `.descent { --descent-ink: var(--ink); --descent-ground: #07060b; }` and `.descent-dev { background: rgba(7,6,11,.92); }` using the site's approved dark ground and ivory tokens, so descent captions render crisp ivory text and `#f0cf74` gold detail lines over a soft `#07060b` night feather.
- **`index.html`:** bumps `front.css?v=her-3`.
- **JavaScript / HTML net 0** (+1 / -1 in `index.html`; CSS +2 / -0 in `front.css`).

## Measured (this tree served by `tools/serve-range`, headless off every screen)

- `node --test app/guide.test.mjs app/after-the-mint.test.mjs app/swarmbook-floor.test.mjs app/dl-twelve.test.mjs`: 53 of 53 passing.
- **Rule 8, no sound touched:**
  - `node --test app/dl-twelve.test.mjs`: 22 of 22 passing;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <warm.html served by tools/serve-range>` passes with `--tap button` (PASS, tap at 6.06 s) and `--tap sphere` (PASS, tap at 6.09 s).

## Owed

- Live on swarmbook.com at his word (deploy).
