# THE CUTS: Ingi Erlingsson's grammar, read from four spots, and what the hero takes from it (Oct 14 2026, 15:1x to 15:3x WEST)

His words (Oct 14 15:1x WEST): "can you please pay attention to his style recurring please? he got predicatble transitions etc" and the four
posts; "he keeps sharing how what he all" (cut off: the breakdowns he posts of his own spots).

The four, read at two frames a second (the contact sheets are in the lane's scratchpad, not in the house: his work is his):

| post | date (WEST) | length | what it is |
|---|---|---|---|
| [dial up ☎️](https://x.com/ingi_erlingsson/status/2081896962836541731) | Jul 28 01:18 | 11.0 s, 1:1 | one model's face on a flat blue backdrop; the person under it swaps six times |
| [its components](https://x.com/ingi_erlingsson/status/2082202511159521777) | Jul 28 21:32 | 11.0 s, 3:4 | his own breakdown of the same spot: "here are the components - used either as they are or as masks" |
| [tread lightly](https://x.com/ingi_erlingsson/status/2106567435826446624) | Oct 4 03:09 | 11.4 s, 1:1 | frames of a TV series turned into rough 3D and orbited |
| [[p-frames]](https://x.com/ingi_erlingsson/status/2109099689404662081) | Oct 11 02:52 | 11.7 s, 1:1 | eight fashion portraits in a garden; the cuts are a video codec's predicted frames |

## The grammar (what recurs in all four)

1. **One constant under every change.** In dial up the eyes, the nose, the lips and the necklace are cut out as tracked rectangles with small
   coloured tag chips (cyan, blue, yellow, white bars) and they STAY while the person under them changes (0.5 s: the patches alone on a
   checkerboard; then a new face assembles under them at 1.0, 2.0, 3.0 s). In p-frames the blue tiled grid and the HUD line ("P-FRAME POC ...
   I P SKIP") stay while the subject swaps every 1.5 s. In tread lightly the tracked tags with their thin lines stay on the bodies through every
   scene. The viewer never loses the frame: the swap happens under an invariant.
2. **The render passes are the transitions.** His breakdown shows the stack he composites: the picture, the wire mesh (yellow lines between the
   tracked points), the tag chips alone on black, the alpha matte (a flat white silhouette), the normals pass (the purple-green head), the point
   markers, a grey depth. A cut is a pass shown AS IT IS for a few frames: tread lightly flashes the normals pass at 1.0 s, 2.0 s, 4.5 s and
   the flat lime matte at 2.0 s and 2.5 s before the picture returns; dial up ends on the wire mesh and the chips alone (9 to 10.5 s). "Used
   either as they are or as masks": the same pass that masks the composite is the thing you see at the cut.
3. **The data's own artifacts are the cuts.** dial up smears into RGB-shifted, posterised blocks at 4 to 5.5 s (a datamosh); p-frames keeps
   macroblocks of the previous shot standing in the next one (0.5, 2.0, 3.5, 5.0, 6.5, 8.0, 9.5 s: the old picture's blocks linger, the grid shows
   through the holes, the new picture fills in block by block). The cut is never a dissolve: it is the codec's prediction made visible.
4. **2D into 3D, then the camera moves.** tread lightly projects the series' frames onto rough geometry with torn, splat-like edges and orbits
   the frozen moment (3 to 8.5 s: the walk, the money pile, the green apron, the lab from below): a still becomes a place the camera can
   leave. That is the house's own line, 2D to 3D and back (lab/braindance.json; his "4DGS of the trajectory AKA BRAINDANCE").
5. **A swarm of UI as texture.** Mouse cursors multiply over the face in dial up (6 to 8.5 s), tag chips and label lines everywhere, a codec's
   HUD text in p-frames: the tool's chrome is the surface.
6. **A beat, and one device per spot.** A cut every 1.0 to 1.5 s, each transition 6 to 12 frames, eleven seconds, a loop that lands back on the
   first frame. Each spot has ONE device and repeats it, so by the second cut the viewer knows the third is coming: that is the "predictable"
   he means, and it is what makes the spot legible at speed. The flat backdrop (one blue) is the stage the whole time.

## What the hero takes from it (for the unboxing session's three.js in hero-ab.html and theater.js, and the next hero lanes)

- **The constant:** the dodecahedron's twelve faces carrying the film are the invariant. Everything that changes (the box opening at his tag
  37.132 s, Athena standing above at her braindance place, Seiya rising at 61.767 s, the end card) changes UNDER it: the faces never stop
  carrying the picture during a cut. His tags on the line of time (Nest ref mint/seiya-tags) are the tag chips: small, coloured, with a thin
  line to the face they belong to, kept through the cuts.
- **The pass as the cut:** at each burst (11.044 s, 37.10 s) and at the conversion, six to twelve frames of a pass shown as it is: the
  dodecahedron as its normals (the face normal as colour), then as a flat gold matte, then the picture back. theater.js already draws the
  faces from their normals; the pass is a uniform and two shader lines, nothing at rest.
- **The codec's cut inside the faces:** between the film's shots on the faces, keep the previous frame's macroblocks standing for a beat while
  the new frame fills in; the page's white shows through the holes. The film's own shot changes (24, 28, 32, 36.6, 38, 42.5 s in braindance.json's
  camera list) are the beat; one device, repeated.
- **Athena as a 2D-into-3D frame:** her film frame (30.0 s, the over-the-shoulder shot) cut out with torn edges and stood at her braindance
  place, the game's figure behind it, and the camera orbiting from her shoulder down to the fight (the shot "over Athena's shoulder, down at the
  fight" to "her face, the prow"): tread lightly's move, with our own stills.
- **The rule of one:** one device per moment, the same device at every burst, a cut on the beat the film already has. No dissolves.

Nothing here is wired yet: hero-ab.html and theater.js are the unboxing session's files at this hour; this sheet goes to it by message.

## Landed: THE CUTS WIRED (Oct 14 2026, 15:3x to 16:1x WEST, lane claude/hero-cuts-fdacd1)

The devices are one module, `cuts.js`, a pure plan of the film's second; `cuts.html` proves them on a page of their own (the hero's A: the
film on the twelve faces, centred on the page's white, three.js so theater.js is not touched); `cuts.proof.mjs` reads it in headless Chrome
over CDP on the new Mac; `cuts-pictures/` holds the pictures and the receipt (`cuts.proof.json`; the pictures are stripped before GitHub).

### The contract

`cutsAt(t, {tags, shots, bursts, quiet})` -> `{pass, passFrame, blocks, chips, keep, cut}` for the film's second `t` (saint-seiya.mp4
?v=53561d47, 30000/1001 frames a second).
- `tags`: his tags (the Nest ref mint/seiya-tags, its value or its array; `TAGS_AT_REV_1` when the Nest is silent). `bursts`: default 11.044
  and 37.10 s (hero-ab.html BURSTS).
- `shots`: the film's own cuts. Default `FILM_CUTS`: ffmpeg's scene score, gt(scene,0.25), on the film (the mint session's measure, 16:0x
  WEST), 28 cuts up to 81 s, each a frame's pts. `shotsOf(braindance.json)` reads the record's `cuts` array once it holds one and falls back
  to FILM_CUTS; never the camera list, whose boundaries are readings at about half a second (24.0, 28.0 and 32.0 s are not cuts at all).
- `quiet`: spans where none of ours fires, pass or block. Default `FLURRIES`, where the film runs its own cut device (about forty cuts 0.07 to
  0.2 s apart): 64.898 to 69.603 s (the armor closing), 100.767 to 108.275 s (the meteors), 115.282 to 119.353 s (the arrow). A caller adds its
  own: the hero keeps 42.342 s, a film cut, for its box with `quiet: [...FLURRIES, [42.342, 42.6]]`.
- `pass`: `'picture' | 'normals' | 'matte'`. At each burst and at his conversion tag (61.767 s at rev 1): 6 frames of the normals pass, 4 of
  the flat gold matte (0.83, 0.64, 0.29, the gold the hero's engines already wear), then the picture; `passFrame` 0 to 9 inside it.
- `blocks`: `{since, filled, seed, holes, cut}` for the 6 frames after each film cut, else null. `filled` of the frame's 16-px blocks (60 x 34)
  show the new frame in one seeded order (seed 1988, the same at every cut); `holes` (0.3) of the rest are holes for the page's white; the
  others are the frame before the cut. `keep` names the cut on the 3 frames before it: the page keeps that frame as the one that stands.
- `chips`: his tags whose second has come, `{t, name, colour, face, id, words}`, named by his own word (SACRIFICE, AIOLOS, CONVERSION),
  cyan, yellow, blue, each on the face that faced the eye at its second. `cut`: the device on now.
- The rule of one is in the plan: a pass wins over a cut inside it (11.044 s is a burst and a cut: the pass; the cut at 37.204 s is the 4th
  frame of the 37.10 s pass: nothing), no device starts inside another, none in a quiet span, no dissolve (every frame is one state, the fill
  moves in sixths). In the first 81 s: 26 codec's cuts and 3 passes.
- `CUTS_GLSL` is the shader half (`cutsPass`, `cutsBlock`); `blockOrder` the order as data. One place to retune: `PASS`, `BEAT`, `HOLES`, `SEED`,
  `KEEP`, `GOLD`, `FILM_CUTS`, `FLURRIES`.

### Cost (measured Oct 14 2026 16:06 WEST: the new Mac, Chrome 156 for Testing headless, ANGLE Metal on the M5 Max, 1280 x 800 css at 2x = 2560 x 1600, load 8.8 to 10.0)

| | per cut | per frame drawn | at rest |
|---|---|---|---|
| the pass | 10 draws, the film's own 10 frames (0 extra); one uniform | JS 0.3 ms; GPU 0.40 ms bench median (picture 0.46) | 0 |
| the codec's cut | 6 draws, the film's own frames, + 3 copies of the 960 x 540 frame into the frame that stands | JS 0.3 ms; GPU 0.41 ms bench median | 0 |
| the chips | 0 draws; DOM made once (a div and an SVG line a tag), a few attributes written on a draw that moves them | | 0 |
| cutsAt | | 0.15 to 0.20 us a call (node, this Mac) | not called |

- While the film plays the page draws once per frame it presents, plus one on the pause: 48 frames through the first burst's pass, 43
  through the cut at 29.563 s (3 copies), 71 through 36.570 s, the 37.10 s pass and 38.071 s (6 copies), 43 through the conversion's pass,
  159 through the armor's flurry (every draw the picture: none of ours there). The page's requestAnimationFrame calls in all of it: 0
  (counted from before its scripts). At rest (paused, 3 s): 0 draws, 0 rAF calls, 0 copies.
- The bench (60 draws asked one at a time on a paused frame), GPU median: picture 0.461, normals 0.402, matte 0.403, blocks 0.411 ms (min 0.21
  to 0.40, p95 1.1 to 2.0 under the new Mac's other GPU work); JS 0.1 ms. The devices cost the same as the picture within the timer query's
  floor on ANGLE Metal. Two draw calls (60 triangles, 30 hairline edges). The film's upload and mipmaps are in every number; a glass's
  refresh wait is not (headless).
- lysa (the slowest glass) and WebKit (his Harmony window) are not measured.

### The receipts (`cuts-pictures/`, the new Mac's run at 16:06 WEST)

- **The pass** at the first burst: `01` 11.00 s the picture, `02` 11.10 s the normals (frame 1 of the cut, which begins on frame 331, the hit),
  `03` 11.25 s the gold matte (frame 6), `04` 11.45 s the picture back. The same 10 frames at 37.10 s and at 61.767 s (the playthroughs).
- **No cut at 24 s** (`05`): the film has none there, so nothing fires.
- **The codec's cut at the film's cut to her shoulder**, 29.563 s, frame 886 (`15` to `17`): the two-shot (frame 885) stands as 16-px blocks
  with the page's white through the holes, her shoulder shot fills in (half on the 4th frame), whole on the 8th.
- **The codec's cut at 36.570 s**, frame 1096 (`09` to `11`): her face (frame 1095) stands, the column fills in.
- **The chips** at 37.2 s (`12`): SACRIFICE (cyan, its face turned away: a dashed line) and AIOLOS (yellow, a solid line to the front face),
  kept while the faces show the 37.10 s pass.
- History: `06` to `08` are the device at the camera list's 28.0 s, which is no cut (it punched holes in one shot); `13` and `14` are the look
  at 29.50 and 29.60 s that found that cut by eye before the scene score came; `cuts.look.json` the frame-difference reading, superseded.

### The film's cuts and the record

The record's camera boundaries are readings; the film's cuts are FILM_CUTS until braindance.json carries them as its own `cuts` array (the
mint session is landing that on main), and then shotsOf reads them there. The looks taken here agree with the scene score at 29.563,
36.570, 74.975 and 76.977 s. On the hero, athena-shot.mjs takes her shots from the camera list (28.0 s): her shot begins at 29.563 s, so she
enters 1.56 s early until it reads the cuts.

### The ko-edge (lab/ko-edge.js, the mint session's, landing)

A red pulsing vignette on the stage's borders from 18.018 s (Dolbar's gauntlet closing in Seiya's hair) to 36.570 s; its level steps down at
the 29.563 s cut and it ends at the 36.570 s cut. It is a state on the borders, not a cut. The codec's cuts at 19.052, 29.563 and 33.567 s fall
inside it, on the faces, and the one at 36.570 s is on the frame it ends: one cut device on the faces, and a border state that changes on the
same beat. If the hero wants the border alone to change at 29.563 or 36.570 s, those seconds go in `quiet`.

### The lines for theater.js and the hero (for the unboxing session; nothing of theirs was edited here)

**The pass** is already in theater.js since main bd63d9a2 (`uniform float ... uPass;` and, after `vec3 face = ...;`,
`if (uPass > 0.5) face = uPass > 1.5 ? vec3(0.83, 0.64, 0.29) : n * 0.5 + 0.5;`), timed there by the burst's age (0.1 s + 0.1 s = 3 + 3
frames), in unboxing-plan.mjs by the rise (the same), and on Athena by athena-shot.mjs passAt. One device means one clock: let the plan say it.
- hero-ab.html, once his tags and the record are read (a new object each time: the plan is kept per object):
  `import {cutsAt, FLURRIES} from './cuts.js';` ... `CUTS = {tags, shots: bd, quiet: [...FLURRIES, [42.342, 42.6]]};` and in `road(t)`:
  `return {..., pass: cutsAt(t, CUTS).pass};`
- theater.js draw(), in place of its line `gl.uniform1f(U.uPass, live && way?.glass !== false ? (age < 0.1 ? 1 : age < 0.2 ? 2 : 0) : 0);`:
  `gl.uniform1f(U.uPass, way?.glass === false ? 0 : ({normals: 1, matte: 2})[way?.pass] ?? 0);`
- theater.js FS, so a pass is shown as it is (no gold leading over the normals or the matte), the glass's line becomes:
  `over(col, a, mix(face, leading, lead * mix(0.74, 1.0, kl) * step(uPass, 0.5)), uGlass);`
- The box (unboxing-plan.mjs `pass`) and Athena (passAt) take `({normals: 1, matte: 2})[cutsAt(t, CUTS).pass] ?? 0`. If her cuts keep the
  pass, hand their seconds to the plan as pass moments (`bursts: [...BURSTS, ...herCuts]`, her cuts read from the film's cuts): the rule of
  one then keeps the codec's cut off them.
- The frames differ today: the plan's pass is 6 + 4 frames (the lane's "six to twelve frames of the normals pass", so 11.25 s is the matte),
  the hero's is 3 + 3. To keep 3 + 3, change `PASS` in cuts.js, once, and every engine follows.

**The codec's cut** is not on the hero yet. In theater.js it is, with `CUTS_GLSL` included in FS (it declares `uPass`: take `uPass` out of
theater.js's own uniform line), a second and a third texture and five lines:
- textures: `gl.activeTexture(gl.TEXTURE1)` a held texture (LINEAR, CLAMP), `gl.activeTexture(gl.TEXTURE2)` the order,
  `gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, cols, rows, 0, gl.RED, gl.FLOAT, blockOrder(cols, rows))` (NEAREST; `[cols, rows] = gridOf(960, 540)`),
  `gl.uniform1i(U.uHeld, 1); gl.uniform1i(U.uOrder, 2); gl.uniform2f(U.uFilmPx, 960, 540); gl.uniform2f(U.uGrid, cols, rows);`
- in draw(), with `const c = way?.cuts` (the road hands `cutsAt(t, CUTS)`): on `c.keep !== null`, `texImage2D` the film into the held texture
  (UNPACK_FLIP_Y is on, so it lies as uFilm does) and remember `heldFor = c.keep`; then `gl.uniform1f(U.uFilled, c?.blocks ? c.blocks.filled : -1);
  gl.uniform1f(U.uHoles, c?.blocks?.holes ?? 0.3); gl.uniform1f(U.uHeldOk, c?.blocks && heldFor === c.blocks.cut ? 1 : 0);`
- FS, where the glass reads the film (`vec3 seen = ...`): `vec2 fu = mix(laid, uPic.xy + clamp(qw, 0.0, 1.0) * uPic.zw, uLook);
  float blk = cutsBlock(fu); vec3 now = texture(uFilm, fu).rgb, was = texture(uHeld, fu).rgb;` (both read before the choice: mipmaps want
  uniform control), `seen` from `blk > 0.5 ? now : was`, and the glass's `over(...)` only where `blk >= 0.0` (a hole leaves the page's paper).
- hero-ab.html wakes the theater for the 9 frames of a cut (3 kept, 6 shown) as it does near a burst, and theater.js holds its glass over the
  sphere for them (today `uGlass` is 0 at m 0 outside a burst).

**The chips** on the hero: in hero-ab.html, made once from `cutsAt(1e6, CUTS).chips` (a div and an SVG line each, as cuts.html
`makeChips`), placed on the road's call: the chip's face centre is `FACES[face] * H` turned by the sphere's pose (poseOfA's yaw and pitch,
theater.js `sphereTurn`) and seen at `c + xy * r / (1 - z * 0.25)`; shown from the chip's second (`cutsAt(t, CUTS).chips`).

### Not done, said plainly

- Nothing is wired on the hero (hero-ab.html, theater.js, unboxing*.js, athena-shot.mjs are the unboxing session's); the lines above are for it.
- braindance.json's `cuts` array is not on main yet: FILM_CUTS stands in, the same 28 cuts.
- The film's cuts are listed to 81 s: after the armor (69.6 s) and up to 81 s the plan has its cuts; past 81 s it has none, so nothing of ours
  fires there (the meteors' and the arrow's flurries are quiet anyway).
- lysa and WebKit are not measured; the numbers are the new Mac's headless Chrome (no panel refresh in them).
- warm-sphere.js's `SEIYA_MOMENTS` holds the end of the film (cosmos 100.25, flash 106.5, meteors 107, impact 112, credits 147.5 s), not the
  bursts: 11.044 and 37.10 s are hero-ab.html's `BURSTS`, which cuts.js copies as its default.
- Ingi's other devices (the wire mesh, the datamosh, the swarm of cursors) and Athena's torn-edge still are not built here.
