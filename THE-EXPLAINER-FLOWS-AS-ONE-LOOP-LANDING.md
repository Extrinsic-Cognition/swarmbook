# THE EXPLAINER FLOWS AS ONE LOOP (Nov 25 2026, claude-0f25b5e7)

**His words:** "can you please have this better? like... the flows, they are shitty arrows... it is broken. can you fucking rebuild it from scratch? have you
done QA of this across all resolutions to see if its good or not?" (Nov 25 2026, this seat's chat), over a still of her explainer on swarmbook.com.

**What it was** (main, live on swarmbook.com): the $WARM name laid across the fuel-to-swarm line; a red arrow rising from empty space into the swarm; the trail
a solid line turning dotted halfway, then a spiral drawn into $POOL as one long polyline; names 7.3 px beside her at 956 by 700 and 10.9 px at 1280 by 800.

**The rebuild** (`app/warm.html` #dl-explain, one line in place; the drawing laid by a generator kept in the seat's scratch, never in the tree):
- **One grid.** Top row, what you stake and what burns: SOL, then fuel, then the swarm. Under each, what it makes: SOL's light becomes $POOL, the burn mines
  $WARM, the swarm and its trail are one loop.
- **The flows.** Six, each a line with a soft glow under it. Each starts and ends a 12-unit gap off its node's edge. Each head lies on its line's own tangent
  and comes once the line has drawn. A light runs along each while she speaks (`.flow`).
- **The loop.** The white trail leaves the swarm on the right, and the red return comes back on the left. "THEN / FASTER" stands inside the loop it names, and
  the dashed ring turns faster at her seventh line, as before.
- **Words.** Her lines decide what shows when, as before (`data-at` 1 to 10). Names on the split's slashes, each slash sized to its measured type at both
  sizes. Notes on stamp plates where the sheet is wide enough.
- **Type.** In a landscape window up to 1366 px wide the sheet beside her is narrow, so its names take the tall layout's size and its notes leave, as the tall
  layout already did.
- **Palette.** The same colours as before, colour for colour.

**QA**, a headless Brave on the served lane at 1920×1080, 1440×900 (and at 2×), 1280×800, 1100×1000, 956×700, 760×930 and 390×844, stilled at her lines 4, 7
and 10. Every visible name checked against every other name, and against 61 points along every flow:
- 0 overlaps at all eight sizes;
- the smallest text is 12.3 px, 13 px on a phone. The names alone: 17.5 px at the narrowest desk, 16.6 px at 956×700, 25 px at 1280×800.

**Proofs.**
- `node --test app/dl-twelve.test.mjs app/dl-athena.test.mjs app/dl-kit-deposit.test.mjs`: 54 of 54.
- Rule 8, `node app/dl-twelve.proof.mjs --url <served lane>/dyson-society/app/warm.html --tap button` and `--tap sphere`: PASS, PASS.

**Cost.** Nothing at rest: the sheet is not painted unless she is on the stage. While she speaks, six dash animations on one SVG replace the eleven SMIL dots
that ran before. JavaScript net 0 (one line of warm.html in place); the sheet +13 lines of CSS.
