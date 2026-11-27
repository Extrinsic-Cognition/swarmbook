# SOCIETIES WALL AND $WARM.

Fixes three visual defects on `index.html` (`Societies`):

1. **Row 1 card stretch & dead void (`front.css`, `wall.js`):** `.wish-card` previously stretched Row 1 to 607 px (`361 px` orb canvas + `246 px` form), leaving 144–177 px of empty black void under `.cap` on Row 1 neighbor cards. Setting `.wish-card .wish-orb` to `height: 186px; margin-top: 10px;` (`viewScale: 0.68`, net 0 JS lines `+1/-1`) and `.tile .cap { flex: 1; }` brings Row 1 to its natural `464 px` height with zero empty gap under `.cap`.
2. **Dark-theme `.tile .chip` pills (`front.css`):** Replaces parchment-era cream chip fills (`#EDE5D2` / `#fff`) on the dark front wall with matching obsidian glass (`rgba(7,6,11,.82)`) and readable dark-glass semantic tints for `OTIUM`, `DISCUSSIO`, `RATUM`, `REIECTUM`, `DISSENSIO`, and `SUFFRAGIUM`.
3. **`$WARM.` glyph collision (`front.css`):** Sets `.warm-entry .warm-title { letter-spacing: 0.01em; }` so `$` and `W` no longer collide in Bodoni 72.

## Verification
- Unit tests: `node --test dl-twelve.test.mjs swarmbook-floor.test.mjs wall-door.test.mjs guide.test.mjs after-the-mint.test.mjs` — 55/55 PASS.
- Rule 8: verified with `dl-twelve.test.mjs` and `dl-twelve.proof.mjs` (`--tap button`, `--tap sphere`).
- JS net lines: `0` (`wall.js` +1/-1).
- Headless Chrome (`1280×800`) Before/After verified: Row 1 height `607px -> 464px`, dead void under `.cap` `177px / 144px -> 0px`.
