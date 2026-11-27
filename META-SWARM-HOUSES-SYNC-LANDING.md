# Receipt: lane/meta-swarm-houses (Fix #7 — 3D House Symbols, 1:1 Hover Sync & Canonical Genesis Init)

## User Approvals
- "we gotta figure out what the pentagons are initialized to... also i think having symbols for the houses would be best... also consider a 1:1 on-hover highlighting of whetehr i am on clicking on a house or another from sphere to 2d side thing"
- "y" (2026-11-26T21:28:13Z) on Fix #7 before/after verification (`final_step_154.png`).

## Changes
- `app/assembly-dive.mjs`: Fixed GPU icosahedron cell-id to canonical zodiac chair permutation (`[5, 7, 4, 6, 1, 3, 0, 2, 9, 11, 8, 10]`) so clicking/hovering the blue Nefertiti pentagon always resolves to chair 2 (`♊︎` Gemini) and all 12 houses map 1:1.
- `app/assembly.js`: Drew crisp perspective-scaled zodiac glyphs (`♈︎–♓︎`) directly on all 12 front-facing pentagons of the 3D Meta Swarm sphere, added luminous gold pentagon highlight on hover & selection, bidirectional `unit0-house` event sync, and smooth sphere spin (`aim`) when a throne is clicked in the 2D Pantheon drawer.
- `app/pantheon.mjs`: Initialized Futarchy/Genesis state canonically (`♊︎ Gemini · Nefertiti` sealed Genesis House + live Solana Fund seated chairs, 0 fake chairs), added bidirectional `unit0-house` hover highlight (`.is-hover`) and click-to-spin.
- `app/wall.js`: Wired live Solana Fund seated chairs into both the 3D Meta Swarm (`sealed`) and the 2D Pantheon drawer (`liveHall()`).
- `app/index.html`, `app/front.css`: Moved `#unit0-pantheon` pill into `.hero` at `z-index: 20` so it is never occluded, raised `#assembly-canvas` above `#assembly-dive` (`z-index: 3`, front worlds `z-index: 4`), and styled `.u0d-arena .throne.is-hover`.

## Verification
- `NET_JS_HTML: 0` (strictly <= 0).
- Unit & site-files tests: `dl-twelve.test.mjs`, `after-the-mint.test.mjs`, `polis-rite.test.mjs`, `assembly-dive.test.mjs`, `swarmbook-floor.test.mjs`, `guide.test.mjs`, `dl-her-portrait.test.mjs`, `tools/site-files.test.mjs` — **84/84 PASS**.
- Live browser verification (`1deefe34-5c41-4d6d-b9cc-7d4394d96a05`, `final_step_154.png`): unoccluded `Meta Swarm ◧` pill opens drawer directly, crisp 3D zodiac glyphs on pentagons, exact 1:1 hover highlight sync both ways (`2D → 3D` and `3D → 2D`), `♊︎` Nefertiti sealed on both sides, 0 JS/page errors.
