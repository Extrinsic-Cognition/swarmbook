# NO GHOST TRAILS OR NAKED WISH

Nov 26 2026 UTC, `lane/no-ghost-trails-or-naked-wish`.

His words, Nov 26 2026, over `index.html` while scrolling and at the hero:
- "cehck scrolliung... why is one of the shits fucked up there? it is poorly designed" (over `#wish-orb` popping in naked mid-scroll and showing a giant flat white parchment polyhedron on the dark wall)
- "yiu see there is also a satellite line without satellite roaming around" (over the empty chair's blue-grey orbital trail flying with no satellite at its head)

## What was wrong

- **Satellite-less trails:** After `THE DIVING ONE COMES BACK` veiled all 12 stand-in worlds in `assembly-dive.mjs` so only the `records.length` live societies orbit her, `assembly-dive.mjs` still waited until scrolling (`homeAt(p) > 0`) to call `A.become(HOME_ONLY, 1, homeless)`. At `p = 1`, unfilled chairs (`seated..11`, e.g., chair 11's blue-grey lane `#718996`) still drew trails (`(1 - home[w]) * trails`) and could be picked by `traverse()` with no satellite at their head.
- **Naked `#wish-orb` mid-scroll:** `front.css` hid `#wall > .wish-card` only in `data-phase="whole"` and `"assembling"`, missing `"gathering"` (`0 < p < 0.45`) while `--assembly-chrome` is still `0` down to `p = 0.16`. At `p = 0.45`, `#wish-card` popped visible with invisible card chrome, leaving only its static canvas floating on black next to the descending swarms. `assembly.js` also queried `.vacant` instead of `.wish-card`, so the card was never `inert` during scroll.
- **Parchment wish orb on the dark wall:** `wall.js` drew `#wish-orb` via `createFoundingScene` at `viewScale: 0.62` (~1.7× the real societies' size) with light-mode `#FBF8F1` parchment hexes and a cream `.chip.PREVIEW`.

## What changes

- **Empty chairs stay home (`assembly-dive.mjs`, `room/assembly-gpu.mjs`):** `chairs(n)` calls `A.become(homeless.length ? HOME_ONLY : null, homeless.length ? 1 : 0, homeless)` immediately and `draw()` never brings unfilled chairs back out. `assembly-gpu.mjs` `traverse()` skips chairs sent home by `become()` so only seated societies dive.
- **Wish card fades with wall chrome (`front.css`, `assembly.js`):** `#assembly #wall > .wish-card` uses `opacity: var(--assembly-chrome)` (under `prefers-reduced-motion: no-preference`) and `pointer-events: none` outside `data-phase="wall"`, staying hidden through `whole`, `assembling`, and the flight portion of `gathering`, then fading in whole alongside the wall cards. `assembly.js` marks `.wish-card` `inert` while `progress > 0.05`.
- **Dark-wall wish orb (`wall.js`, `found-scene.js`, `front.css`):** `wall.js` passes `viewScale: () => 0.44` and `dark: true` to `createFoundingScene`, drawing a dark obsidian-and-gold Goldberg with `#f0cf74` edges and subtle dashed orbital rings (`found.html` unchanged). `.wish-card .chip.PREVIEW` wears dark glass + `--gold` text.
- Cache-bust versions bumped in `index.html` and `wall.js`.
- **JavaScript / HTML net 0** (+19 / -19 across 7 JS/HTML files; CSS +6 / -1).

## Measured (this tree served by `tools/serve-range`, headless off every screen)

- `node --test app/assembly-dive.test.mjs ../room/assembly-gpu.test.mjs app/swarmbook-floor.test.mjs app/after-the-mint.test.mjs app/wall-door.test.mjs app/dl-twelve.test.mjs`: 75 of 75 passing (including `assembly-dive.test.mjs` asserting empty chairs stay home at `p = 1` and on climb-back).
- **Rule 8, no sound touched:**
  - `node --test app/dl-twelve.test.mjs`: 22 of 22 passing;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <warm.html served by tools/serve-range>` passes with `--tap button` (PASS, tap at 6.06 s, 0 seeks) and `--tap sphere` (PASS, tap at 6.02 s, 0 seeks).

## Owed

- Live on swarmbook.com at his word (deploy).
