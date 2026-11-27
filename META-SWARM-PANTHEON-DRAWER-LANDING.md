# Receipt: lane/unit0-pantheon-c (Fix #6 — Meta Swarm Drawer + Fast Hex PFPs)

## User Approvals
- "the unit0 here shoulkd be linked to the pantheon visualization here... they are fundamentally 2 interfaces to the same solana onchain state and program/behaviors"
- "all throughout shit, stop using complicated terms or numbers... just fucking call it the 'Meta Swarm'"
- "i like click -> stake and i also like side by side drawer... the only thing is the hex pfps take forever to load there"
- "y" (2026-11-26T20:07:55Z) on Fix #6 before/after verification (`final_step_126.png`).

## Changes
- `app/index.html`, `app/front.css`, `app/wall.js`, `app/assembly.js`, `app/assembly-dive.mjs`:
  - Clicking any pentagon on the 3D Meta Swarm (or the `Meta Swarm` pill) shifts the sphere left and slides open `#unit0-drawer` (The Pantheon) side-by-side, synced 1:1 with the live Solana floor, with `Stake page ↗` jumping to `./after-the-mint.html?side=pool&throne=<k>#hall`.
  - Replaced all `Unit 0` / `GP(1,0)` / `Goldberg Rung` UI jargon with **Meta Swarm**.
- `app/pantheon.mjs`, `app/after-the-mint.html`, `app/after-the-mint-book.mjs`, `app/swarmbook-book.css`:
  - Synced 2D Pantheon 1:1 to live Solana floor (`mountFloor`), added `Meta Swarm ↗` back-link, `↺ Live` reset, and `?throne=<k>` URL param support.
- `app/dl-her-portrait.js`:
  - Replaced 3.5s wall-clock sleeps with virtual-time ticks, `her.sharp(1)` + right-sized `512px` wall tiles (13.5x fewer GPU pixels per hex while keeping 100% original Three.js Lyssajudron art), batched GPU atlas uploads, and instant colour-seed glow that cross-fades smoothly into the real faces.
- `app/polis-rite.test.mjs`: Updated regex for `META SWARM` / `12 THRONES` copy.

## Verification
- `NET_JS_HTML: -10` (strictly <= 0).
- Unit & site-files tests: `dl-twelve.test.mjs`, `after-the-mint.test.mjs`, `polis-rite.test.mjs`, `assembly-dive.test.mjs`, `swarmbook-floor.test.mjs`, `guide.test.mjs`, `dl-her-portrait.test.mjs`, `tools/site-files.test.mjs` — **84/84 PASS**.
- Live browser verification (`1deefe34-5c41-4d6d-b9cc-7d4394d96a05`, `final_step_126.png`): 0 console/page errors, `#unit0-tip` hidden when drawer open, all 22 real Lyssajudron hex PFPs rendered crisp with both eyes open.
