# RIDE DUO BALANCE

Balances the two-column `.duo` centerpiece on `after-the-mint.html?side=flask` (`Ride`):

- **`swarmbook-book.css`:** On desktop (`>= 701px`) outside `html[data-side="pool"]`, sets `.sbk .duo { align-items: stretch }`, `.sbk .duo-side { grid-template-rows: 1fr auto }`, and `.sbk .duo-art { align-self: center }`, and scales `.sbk .duo-art .flask` from `clamp(220px, 26vw, 320px)` to `clamp(240px, 31vw, 390px)`.
- Eliminates the `176 px` vertical drop between `KEEP YOUR SOL / FUEL THE SWARM` and `THE EGG IS YOURS / RIDE THE SWARM` (`deltaY: 176px -> 0px`) so both headings share one horizontal baseline and both artworks balance across the center `YIELD -> / <- TRACES` seam.
- **`after-the-mint.html`:** Bumps `swarmbook-book.css?v=book-20`.

## Verification
- Unit tests: `node --test dl-twelve.test.mjs after-the-mint.test.mjs` — 37/37 PASS.
- Rule 8: verified with `dl-twelve.test.mjs` and `dl-twelve.proof.mjs` (`--tap button`, `--tap sphere`).
- JS net lines: `0` (CSS/HTML only).
- Headless Chrome (`1280×800`) Before/After verified: `deltaY: 176px -> 0px`.
