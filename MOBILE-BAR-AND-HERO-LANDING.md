# MOBILE BAR AND HERO

Cleans up the mobile (`<= 760px`) navigation bar and Societies (`index.html`) hero layout:

1. **Single-row mobile nav bar (`site-bar.css`):** On `<= 600px`, sets `padding: 0 8px; letter-spacing: .04em` directly on `.site-bar a, header .site-bar a` (overriding `front.css`'s `0.2em` on `header nav a`) so all four pills (`SOCIETIES · STAKE · RIDE · TRACENET`) fit cleanly on one row on 390 px iPhones (`barRows: 2 -> 1`) while preserving `>= 13px` type, `>= 44px` tap targets, and graceful wrapping at 320 px (`overflowX: 0`).
2. **Natural reading order in mobile hero (`swarmbook-front.css`):** Stops floating `PROMPT-2-MINE / $WARM` above `SWARMBOOK` on `<= 760px`. `SWARMBOOK` now leads cleanly at the top (`titleTop: 189px -> 106px`) and `PROMPT-2-MINE / $WARM` sits across from `WHY` on the action row (`gap: 45px` at 390 px, `5px` at 320 px, zero overlap).
3. **320px Ride flask clearance (`swarmbook-book.css`):** Lowers `.sbk .duo-art .flask` min width from `240px` to `210px` (`clamp(210px, 31vw, 390px)`) so orbiting unit1 dots stay inside `320×568` (`scrollWidth <= 320px`) while keeping desktop `390px` scale intact.
4. **`index.html`:** Bumps `site-bar.css?v=bar-2`.

## Verification
- Unit tests: `node --test dl-twelve.test.mjs after-the-mint.test.mjs swarmbook-floor.test.mjs guide.test.mjs` — 53/53 PASS.
- Rule 8: verified with `dl-twelve.test.mjs` and `dl-twelve.proof.mjs` (`--tap button`, `--tap sphere`).
- JS net lines: `0` (CSS/HTML only).
- Headless Chrome (`390×844` and `320×568`): `overflowX: 0`, `barRows: 2 -> 1` at 390 px, `titleTop: 189px -> 106px`.
