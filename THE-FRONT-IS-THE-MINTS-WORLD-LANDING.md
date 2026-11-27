# THE FRONT IS THE MINT'S WORLD (lane/the-front-is-the-mints-world, cut from main fbfc55efc4, Nov 24 2026)

## His words (UTC)

- **Nov 24 2026 ~20:4x**: "Yes, rebuild it", to "Rebuild the front in the mint's world, her at the centre?".
- **Before it**, two pictures side by side, swarmbook.com/app/ (the front) and swarmbook.com/app/after-the-mint.html?side=pool: "what? dont you get the
  dissonance between the 2?".
- **Read with:** Nov 19 12:37 "meta swarm is the largest of them all... each lyssajudron minted is a hex there"; Nov 24 19:18:38 "the claw-rider is a hexagon of a
  lyssajudron on the unit0 of the meta swarm".
- **Records:** ec-workspace `docs/swarmbook-is-the-new-poleis-us-and-the-claw-riders-hypertrace-2026-11-10.md` (sections 17, 25),
  `docs/claw-riders-the-whole-lineage-hypertrace-2026-10-30.md` (its last section).

## What moved

1. **Her at the centre.** The ball the wall's swarms orbit is the page after the mint's own: `app/wall.js` mounts `after-the-mint-tree.mjs` `mountTree`
   (`warm-sphere.js`, the film in her core and in her twelve, the rite's unit1s, her faces through `dl-her-portrait.js`), imported, never copied; no line of
   `warm-sphere.js` or `after-the-mint-tree.mjs` moved. Her canvas (`#genesis-sphere`) and the film's element (`.am-arrow`, muted, never seen by itself) stand in
   the chamber's band of `app/index.html`.
2. **Her hexagons are the meta swarm's.** Her pour is the front's one list: `swarmbook-floor.mjs`'s floor now carries `list`, the list it folded (the mints the
   drops door holds, then the registered claw riders, `rider-<n>`), and `wall.js` hands it to her sphere (`setPour`), so the riders landed today stand on her ball
   after the minted ones, with their faces (the portrait door's list: her default, or their colours). `html[data-pour-own]` keeps the mint page's own read
   (`dl-mint-pour.js`) off the front. `swarmbook-floor.mjs` no longer says a stand-in sphere when it is given no faces' hook: the faces go to her.
3. **The wall's swarms orbit her.** `app/assembly.js` keeps the orbits of the wall's worlds (each tile its own canvas, the game publisher's GPU drawing of it
   untouched) and stands her canvas where the ball stood: its side set once, at the skin's measure (her sphere a fifth of her canvas, `R / .22`), a CSS scale
   after it, shown as the chamber shows it (`--her-shown`). The page's own 2D ball, its faces' hook, its trails, the hex-page press (her sphere's portrait
   module opens a face's page now) and the diving one's branches left it: `app/assembly-dive.mjs` and its test, whose only reader was this page, are deleted
   (the welcome's own engine, `room/assembly-gpu.mjs`, is untouched).
4. **The rest of the front takes the same world.** `index.html`'s inline sheet moved whole into `app/front.css` (read where it stood, the cascade unchanged), and
   its last block is the mint's world: the night #0e1c2d falling to the holy ground #07060b, the chamber a blue glow on the night, the Poleis tokens said again on
   `body` in the holy page's ivory and gold, no parchment, no hex mesh (`poleis-mesh.js` is no longer loaded by the front), no dusk band. The type is the mint's
   (Bodoni titles, DM Sans words, the plates' Gelasio). The look's reference moved in this lane: `harmony-appearance.json` `site.front`, and
   `HARMONY-APPEARANCE.md` "The front is the mint's world", under his dated word.
5. **Nothing at rest costs anything.** The worlds orbit her only while her film plays (`skinAlive`: `her.moving()`, false once the bar stands); her film plays
   once under the after-the-mint page's own law (from the drawn arrow to 144.9 s, or the bar after 4 s without a frame), then her sphere is paused and draws only
   on a cause. At her film's end the page after the mint fades her canvas out (its bar takes her place there); on the front she stays (`front.css`
   `opacity: var(--her-shown, 1) !important`).

## What I kept of the game publisher's work, and what I replaced

- **Kept:** the wall's tiles and their balls on the graphics card (`swarm-glass.mjs` / `.wasm`, wall.js `mountTile`, the swap), the wall waiting for the hand
  (`installSlope` `autoStart:false`). The worlds keep the page's own orbit law (assembly.js `loopPoint`), now round her; their trails, drawn by the page's 2D
  ball, left with it (the right picture draws none).
- **Also moved:** the wish, the wall's first card, stays in the wall while the chamber shows her (the diving one's `--assembly-dive` hid it there before; under
  reduced motion it shows); the film is asked by `preload="metadata"`, not the after-the-mint page's `auto` (19.2 MB of film on a front page).
- **Replaced:** the centre ball only: the diving one's WebGL ball (`assembly-dive.mjs` over `room/assembly-gpu.mjs`) and assembly.js's 2D fallback of it, by her
  sphere. Their held lane (the mint frame on the GPU, `warm-sphere.js`) is not touched here; the front takes it when it lands, by the import.

## Cost

Read in headless Chrome off every screen at nice 19, the Worker's own handler on a scratch D1 with two box-room riders, the chain's devnet JSON-RPC reads let
through and nothing signed. **The Mac read load 230 to 457 on 18 cores while these ran**, so Chrome's `TaskDuration` (wall time of the main thread's tasks)
says contention, not the page; the numbers that stand are the frames asked, the script time and the pixels.

| | before (main fbfc55efc4) | after (the lane) |
|---|---|---|
| at rest, 1440 wide: frames asked in a 10 s window with no capture in it | the orbits and the diving one's ball, for ever: 72 callbacks in 76 s | **0**; script 0.0 % |
| at rest, 1440: pixels changed between two stills 10 s apart | 104,018 | 16,230, every one on the wall's tiles (`engine.js`'s own frames, 40 px cells at their places); **her pixels unchanged** |
| at rest, 390 wide, phone profile (CPU 4x, DPR 2) | 48 callbacks in 88 s; 98,533 px changed in 10 s | 2 callbacks in the window, attributed to `engine.js` (the tiles); script 0.2 % |
| her film (once, at the load) | none | the after-the-mint page's own: her frames while it plays (24 s, or the bar at 4 s without a frame); script 13.6 % of the load window at 1440, 60.3 % on the phone profile, against 0.6 and 1.1 % on main. This is her sphere's `drawScene` on the CPU, the cost the game publisher's held lane (`lane/the-mint-frame-on-the-gpu`) moves to the GPU; the front takes it by the import |
| bytes in the load window (all of the page, the chain's reads included) | 9.8 MB | 12.5 to 13.5 MB with the film asked by `preload="metadata"`; 19.2 MB with `auto` (the after-the-mint page's), measured once and refused here |
| a 6 s trace 60 s after the load, phone profile | | renderer main 212 ms of tasks (3.5 %); her canvas hidden by hand in a probe: busy 1.0 % against 97.8 % shown, read under the load: owed again on a quiet Mac |
| the Worker bundle (esbuild, whole intro tree) | 289,754 B | 289,754 B (the Worker is untouched) |
| JavaScript | | +59 −607, **net −548** in 7 files (the diving one and its test out, the page's sheet out of the page) |

## Proofs

- **Stills** (headless, off every screen, nice 19; the chain's reads through; two box-room riders in a scratch D1), in the seat's scratchpad
  (`/private/tmp/claude-501/-Users-lysergic-ratata-code-ec-house/1c5e2855-de8c-4cf4-b199-53a4d29a1ed5/scratchpad/`): `front-before-1440.png`,
  `front-after-1440.png`, `front-before-390.png`, `front-after-390.png`. Before: the cream paper, the hex mesh, the dusk, a dark nameless ball with the swarms
  and their trails. After: the night and gold; her at the centre, the film in her core and her twelve in gold, the rite's unit1s and their Goldberg balls round
  her, a box-room rider's face on her hexagon, the wall's swarms orbiting her, the plates as the page after the mint wears them. Seen beside
  after-the-mint.html?side=pool at 1440: the same world. One more still, `film-end.png`, is her at her film's end: she stays, the strike in her core.
- **Two faults the stills found, mended in the lane:** at her film's end the page after the mint fades her canvas out (its bar takes her place): the front keeps
  her (`--her-shown`, `!important`); on a slow phone the film stops 0.7 s past its end, on the fansub's credits (frames read at 143.5, 144.3, 144.9, 145.2 and
  145.6 s): the front brings it back to the strike, inside its range, muted (`wall.js`).
- `app/swarmbook-floor.test.mjs` 13 of 13: the floor's `list` is the mints then the riders; no stand-in sphere without a hook; the page's markup (her canvas,
  her film, `data-pour-own`, no parchment, no mesh, no `<style>`), assembly.js's gate on her film and her size, front.css's night and her opacity, the film's
  rest on the strike.
- The front's other suites: `guide`, `after-the-mint`, `swarmbook-board`, `mint-chairs`, `riders`, `dl-mint-ledger`, `dl-direct`, `tools/site-files`,
  `tools/welcome-bake/bake`: all pass. `dl-athena.test.mjs` "THE DEPTH rides the engine and the corner" is red ("the shell's cursor is her look on a Mac"): it
  reads no file this lane touches.
- Gates: `the-javascript-only-shrinks` green (net −548); `tools/any-room/any-room.test.mjs` green (49 of 49 with the JS gate); `the-look-is-a-law` 2 of 2.
  `embertide-app/tests/harmony-appearance.test.mjs`: its three reds name `life-menu/the-room.css`, main's own drift, not a file of this lane.
- Screens gate (`no-landing-adds-a-failing-screen`, both shards, on the lane's tree): the site **36 cells, 0 new failing**; 18 of the front's baseline cells
  pass now (the checks c and e: words on words and contrast, at every size) and leave `embertide-screens/baseline.json`; the front's loads are her page's now
  (31 lines in `embertide-screens/loads.json`, 4 out: the diving one, the mesh, `room/assembly-gpu.mjs`, `room/assembly-floor.mjs`). Harmony **45 cells, 0 new
  failing** (its reds are the load's, said apart). Run again after the baselines moved: 0 new failing, 0 to take out, 0 files asked that the loads do not hold.
- Rule 8 (`app/` touched): `node --test app/dl-twelve.test.mjs` 21 of 21; `dl-twelve.proof.mjs --url <serve-range>/intro/dyson-society/app/warm.html` on the
  lane's tree served by `tools/serve-range` (206): `--tap button` PASS, `--tap sphere` PASS.
- Worker: bundled with esbuild from `dyson-society` with the whole intro tree present: 289,754 bytes.

## What is left, and whose

- **HIS:** the deploy of the site.
- **The game publisher's (claude-73a178b3), through the coordinator; nothing of `warm-sphere.js` or `after-the-mint-tree.mjs` was edited here:**
  - a canvas resized while the sphere is paused or held stays blank: `resize()` asks a frame, and `visibility()` (called by the observers and `setPaused`)
    cancels a pending frame while `canAnimate()` is false. The front works round it (her side is set once, and she is asked to redraw 120 ms after). The need
    inside: a resize, or any `requestFrame()` asked while paused, draws once and is never cancelled by `visibility()`;
  - her frames during her film on a phone (above): the mint frame on the GPU is what brings them down.
- **SEAT:**
  - the page after the mint does not carry the riders on her (its pour, `dl-mint-pour.js`, reads the chain's seats and the drops, not `riders`): owed there, or
    the same `list` handed in;
  - the wall's tiles still ask frames while their scene is live (`engine.js` tick, the 16,230 px at rest): the wall's engine, not this lane's;
  - the film's run end to end was not seen in headless under this load (the bar came by the 4 s wait); her end frame was proven by a seek to 142.5 s and a play;
  - riders are numbered on from the minted (a new mint moves a rider's number), as before.
- **No gate yet** on the front at rest: the measure it waits for is the front in `embertide-app/ui/intro/room/nothing-at-rest.proof.mjs`'s list (0 frames, 0
  pixels between two stills 10 s apart once her film has played), read at the gate.

## HER SPHERE WEARS THE RIDERS AFTER THE MINT (lane/her-sphere-wears-the-riders-after-the-mint, cut from this lane's tip 0aba1d9e00, Nov 24 2026)

**His words (UTC):** Nov 24 2026 19:18:38 "the claw-rider is a hexagon of a lyssajudron on the unit0 of the meta swarm. when claw-riders open up tracenets, they
become eligible for snowtracers pantheon"; ~22:3x "do all". The seat's line above (SEAT, "the page after the mint does not carry the riders on her") is this.

**What moved.** One road for both pages: the drops door's riders are read and made seats by two pure functions beside the door's other reader,
`app/dl-drops-live.mjs` `ridersOf(answer, was)` (the `rider-<n>` names its `riders` holds, or what was read where it names none) and `riderSeats(riders, from)`
(them as seats numbered on from the minted). `swarmbook-floor.mjs` (the front) and `dl-mint-pour.js` (the page after the mint, the mint page) both import them
(`?v=riders-1`, one instance); the floor's own copy of the two lines is gone. The pour hands her sphere the minted (the chain's seats, then the door's deposits),
then the riders, the front's order, so her fold (`after-the-mint-tree.mjs` `setPour`, `foldWorld` at `MINT_FRONT`) is the same on both pages; their faces are
the portrait door's, as on the front (her default, or their colours). The riders come with the read the page already made (the drops list at the load and at
the door's terms, at each showing, at a deposit): no new request. Like the deposits, they are read once the door's terms stand (`dl-deposit-terms`). Nothing of
`warm-sphere.js` or `after-the-mint-tree.mjs` moved.

**Cost.** Before: the page after the mint read the drops list and dropped its `riders`. Predicted: no request more, no frame more, a fold of the riders per pour
(the door gives 150 at most). Measured (nice 19, the Mac at load 134 to 154): `foldWorld` with 2 mints and 0, 2 and 150 riders 3.1, 2.5 and 4.5 ms a pour
(the tree folds twice a pour, `setPour` and `cellOf`); the Worker bundle 289,754 B before and after (esbuild, the whole intro tree; the Worker's import of
`dl-drops-live.mjs` takes `LIVE_PATH` alone); JavaScript +18 −18, **net 0** (the gate over main with this lane under it: +76 −624, net −548, the front's).

**Proofs.**
- Stills (headless Chrome off every screen, the Worker's own handler on a scratch D1 with two box-room riders, `box_room` with no colours and `Box2` with its six,
  a scratch fee key made in memory so the door's terms stand; the chain's GET reads let through, nothing signed), 1440 x 900, in the seat's scratchpad
  `/private/tmp/claude-501/-Users-lysergic-ratata-code-ec-house/1c5e2855-de8c-4cf4-b199-53a4d29a1ed5/scratchpad/`: `after-the-mint-with-two-riders.png` (her
  pour read off the page: `rider-1:1, rider-2:2`, the tree's `seats` 2; Box2's face on her hexagon), `after-the-mint-with-two-riders-bar.png` (after her film),
  `after-the-mint-before-riders.png` (this lane's base, its `dl-mint-pour.js` served in place of the lane's: her pour `[]`, `seats` 0; the still is the bar, her
  film gave no frame in 4 s under the Mac's load in both tries, so her ball is compared by the numbers, not by the picture).
- `app/dl-mint-pour.test.mjs` 4 of 4 (new: HER SPHERE WEARS THE RIDERS: the minted first, then the riders the door names, a name that is no rider's passed over;
  a new mint stands before them and they are numbered on; an answer naming no riders keeps them). With `dl-drops-live`, `swarmbook-floor`, `after-the-mint`,
  `dl-mint-flask`, `dl-mint-ledger`, `riders`: 49 of 49.
- Gates: `the-javascript-only-shrinks` 37 of 37; `tools/any-room/any-room.test.mjs` 12 of 12; screens gate both shards on the lane's tree (the site 60 cells with
  `after-the-mint-pool` and `-flask` among them, 0 new failing, 0 to take out; Harmony 45 cells, 0 new failing, its two reds the load's, asked again).
- Rule 8 (`app/` touched): `node --test app/dl-twelve.test.mjs` 21 of 21; `dl-twelve.proof.mjs --url <serve-range 206>/intro/dyson-society/app/warm.html` on the
  lane's tree: `--tap button` PASS (the film never below its second at the tap, 6.00 s), `--tap sphere` PASS (6.08 s).

**What is left, and whose.**
- **The game publisher's (claude-73a178b3), inside `after-the-mint-tree.mjs`, not touched here:** `cellOf(list)` folds the visitor's next deposit after the whole
  list, so with riders on her the deposit door marks the hexagon after the last rider (read: cell 123 with no rider, 134 with two), while the deposit lands
  before them (the mints then the riders) and takes the first rider's place. The need: `setPour` computes `S.cell = cellOf(minted)` over the list without its
  riders (a seat whose signature is `rider-<n>`, `/^rider-\d+$/`), e.g. `cellOf(list.filter((s) => !/^rider-\d+$/.test(s.signature)))`; the fold is a prefix
  law, so that is the face the deposit takes. Its `S.seats` counts the riders too (a count it says nowhere I found).
- **SEAT:** the riders stand on her only once the door's terms stand (one read with the deposits); a rider's number moves at a new mint, as on the front; the
  tree imports `dl-mint-pour.js?v=flask-11` (its version is the tree's to move).
## The lander's red, mended (Nov 24 2026 ~23:0x UTC, claude-1c5e2855)

The first gate (22:51:25 UTC) refused one new red: `life-menu/society.test.mjs` "THE BALL IS SWARMBOOK'S" read the front's `--hex-night` (the wall of hexagons) out of
`app/index.html` to pin Harmony's Society tab to it, and this lane takes that wall off the front. The test now takes the front's wall when it stands, else the
society's own chamber (`society.mjs` CHAMBER), so the society keeps its wall until it follows the front's night (owed, his to order). society.test 6 of 6.
