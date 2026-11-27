# THE FIELDS (lab/fields.js): hair as strands, light from its source, a silhouette into smoke, water or petals

His words, Oct 14 2026 WEST, over the hero (hero-ab.html, the Saint Seiya film on the dodecahedron box):
- 16:3x, at film 32.6 s (Athena from behind, her long violet hair streaming left toward the fight): "i mean dude it'd be cool as hell if you
  were able to use some houdini shit rendered with the hairs that are flowing like the screenshot,... you get what i mean?"
- 16:3x: "i grew up watching MTV shortcuts creatives, i love them... i have a fetish for houdini and human silhouettes as smoke or water or
  flowers or idk you get what i mean my dude??"
- 16:4x, over the box open at film 47.2 s, the film's burst on its faces and the gold cloth unlit in the middle: "the light is not on the
  surfaces projected dude... THE LIGHT IS COMING FROM THE ARMOR ITSELF DUDE COME ON!!!!! ... THAT IS ALL A VECTORIAL FIELD MY DUDE"

Built here, from first principles, on the page's own GPU in three.js r185 (the hero's `room/procedural`), never Houdini or another vendor's
tool. Each field is a pure function of the film's second: a seek, a pause or a loop lands on the same picture as a first play, on every glass.

## Cost first

| | before (main 86b94546) | predicted | measured (new Mac, M5 Max, per render) |
| --- | --- | --- | --- |
| her hair | the game's sheet: its long locks 369 triangles, hanging | 220 strands x 24 points, ~120 k chain steps a draw: under 0.05 ms of GPU | 0.038 ms median, 0.134 p95, with the ripple bending them (0.021 / 0.106 before the ripple's code) |
| the light | the film's picture on the faces; the armor unlit; nothing drawn | 40 beams, a core, 900 motes: under 0.1 ms; the flames' overdraw the most | star's rays 0.003 / 0.152; burst 0.026 / 0.109; sun and flood ~0 / 0.153; centaur's flames 0.111 / 0.244 |
| a silhouette | none | 3,200 to 9,000 points x 6 curl steps: under 0.05 ms | A, her petals (3,200): 0.029 / 0.170; B, gold smoke (3,200): 0.205 / 0.64 (below) |
| JS a draw | | under 0.05 ms | the fields' updates 0.010 to 0.040 ms; their extra render 0.000 to 0.009 ms |
| draws | | none of their own | none of their own: one a film frame, 29.6 to 30.0 a second (the page's); the hero's box 28.5 to 30.4 in her shot and 40.8 to 41.0 in the light's window, with and without the lines alike |
| at rest | | nothing | 3 s after a pause: 0 draws, 0 animation frames, 0 video frame callbacks asked or left waiting |

How (fields.proof.mjs, the receipt fields.proof.json): Chrome for Testing 156 headless on the new Mac (ANGLE Metal, Apple M5 Max, 40 GPU
cores), 1440 x 900, cross-origin isolated by the proof's own door (a 5 us clock), load 7 to 11 (the last run, 18:26 WEST, on main b63b505b;
the first runs at 17:4x read within the noise of these, the strands 0.021 ms before the ripple). The film played through each piece's window
on the lab page; every film frame rendered 32 times with the fields and 32 times without them inside the same draw, in turn order, two timer
queries: the field's GPU is the difference within one frame, so the GPU's clock state (which follows the whole frame's work) cancels. Two
earlier ways read noise: separate page loads with and without (negative fields: the clock state moved between loads), and 8 renders a query
(a floor of about 0.1 ms). The light's medians are by the film's forms (the star 43.15 to 45.445 s, the burst to 47.6, the sun and flood to
50.05, the flames to 53.053); the hair's over her first shot; the dissolve while it is in the air.

### The silhouette's cost (A and B, each by its own run; the receipt's rows dissolve-* and dissolve-b-*)

The same paired bench (32 renders a draw, the new Mac), each while it is in the air:
- **A**, her figure and strands to violet petals at his Aiolos (37.132 to 41.132 s; the run of 18:26 WEST, load 7.4): 3,200 petals, 0.029 ms
  of GPU a render median, 0.170 p95; with budget 'lysa' (1,600) within the floor (median about 0, p95 0.083). JS 0.010 ms a draw. On lysa by
  the arithmetic below about 1.1 ms.
- **B**, Seiya to gold smoke (71.572 to 75.572 s; the run of 19:00 WEST, load 7.4): 3,200 smoke puffs growing to 3.4 times their size, 0.205
  ms median, 0.64 p95, over a scene of 0.21; with budget 'lysa' (1,600 puffs) 0.092 and 0.42. JS 0.010 to 0.015 ms a draw. Smoke is the
  costliest field: soft sprites that swell, so fill. On lysa by the arithmetic about 7.6 ms (3.4 with budget 'lysa', p95 about 15): there,
  cut the puffs' count or size further, or show B in water or petals (smaller sprites).
- C (water, 9,000 drops) was not re-measured.

### lysa's budget

lysa is an Intel Core i7-10510U with UHD Graphics (Comet Lake GT2, 24 EUs at up to 1.15 GHz: 24 x 16 x 1.15 = 0.44 TFLOPS of FP32). Apple
publishes no figure for the M5 Max; clocked as the M4 Max, its 5,120 lanes give about 16 TFLOPS: about 37 times lysa. Not measured on lysa:
its headless Chrome draws with SwiftShader (no GPU) and the kiosk Chrome has no debugging port. Carried over by the arithmetic, per render on
lysa: the strands about 1.4 ms (budget 'lysa': 1.0); the burst about 1.0 ms, the sun and flood under 1 ms, the centaur's flames about 4.1 ms
(budget 'lysa', 700 flames: 2.2 ms, p95 7.7); a silhouette about 1.1 ms. The pieces never overlap in time (the hair 29 to 75 s in her shots,
the light 42.3 to 53.6 s, a silhouette at one moment), so the budget at any instant is one piece: under 3 ms with `budget: 'lysa'` against a
film frame of 33.4 ms (the hero draws on the film's frames), the box's own scene beside it (0.13 to 0.33 ms here, about 5 to 12 ms there).
The flames are overdraw (soft sprites), so they may scale worse than the arithmetic: on lysa cut `BUDGETS.lysa.flames` first; at 1920 x 1080
(lysa's TVs) the fill-bound parts cost 1.6 times this 1440 x 900.

## The three fields

### 1. The hair as strands (createHair)
- **The film's drawn hair, read once** (fields.measure.mjs, frames 886 to 1005, 29.563 to 33.567 s): in each cell of the face's picture square
  (a 24 x 16 grid) the direction her strands run, from the structure tensor of the picture's light inside her violet (cubism.mjs hairMask),
  summed over the shot's 120 frames, pointed from root to tip; its coherence; and each frame's sway in the streaming part. 183 cells read hair;
  the others take their neighbours' direction. The stream (the mean direction of the streaming part, weighted by coherence): 150 degrees,
  left and down 30 degrees. fields-film.mjs holds it (8.8 KB, written by the tool).
- **Guides grown from her own hair** (athena.hades.glb, E00H's 4,328 to 7,019): its vertices welded (642), the mesh's edges a graph, the
  shortest paths over the mesh (Dijkstra) from her scalp to each lock's tip: 12 locks, 0.42 to 0.83 m, in 5.9 ms. 220 strands between
  neighbouring guides, clumped to them, 1.4 times the locks' length (the wind's hair is longer than the game's sheet).
- **Her game hair keeps its cap and front** (911 of its 1,280 triangles: within 0.11 m of the scalp along the mesh, and the bangs and the
  locks by her face) and loses its long locks (369) to the strands; the cap is repainted in the film's lavender (filmPaint: her hair's texels,
  read off the shot: middle (143, 97, 153), shade (130, 97, 116), lines (81, 41, 84), pale strands (230, 207, 208)), so the hair is one paint.
- **The chain, on the GPU at every draw**: each strand's points in a float texture; the vertex shader integrates the chain from the root, each
  segment turning from its rest direction toward the flow, more the farther down the strand. The flow is read round HER head on the screen
  (screenFlowFrame: the screenshot's composition laid on her as the eye sees her, her head joint at the film's head, at the film's head's
  size); beyond the film's picture the strands follow the stream. Drawn as ribbons tapering to a point, in the film's paint, a Kajiya-Kay
  highlight for its pale strands and a dark line at each lock's edge.
- Read on the face's own frame instead (faceFlowFrame, kept as `?flow=face` on the lab page) the stream ran into the depth: the face she is
  joined to (pent:9, ATHENA'S CUBIST FIT) stands on the sphere's right silhouette, so the picture's left points along the face, away from the eye.
- **When**: on in each of the film's shots over her shoulder, her hair streaming left in all three: 29.563 to 33.567, 36.570 to 38.071 and
  72.472 to 74.975 s (read by eye), half a second's ease either side; the measured sway in the first. braindance.json keeps her on the page
  from 71.138 s, where the film shows Seiya in the light: there her strands hang (no wind). That record is not this lane's.

### 2. The light from its source (createLight)
- **One vector field** with its source at the gold cloth's place in 3D: the direction away from the cloth, the strength falling with distance
  (1 / (1 + (r / r0)^2)), shaped by the film's own rays: the 16 rays of the burst at 45.445 s (fields.measure.mjs: the light's centre each
  frame and its light by angle, frames 1362 to 1429), each kept at its angle in the picture and leaning out of it by up to 0.55 rad, so from
  the eye at the cut they are the film's rays and the box's turn shows them in depth. The star's rays at 43.5 s could not be read (the
  mountain's gold scores as light): the star uses the burst's set, thin and long.
- **Its forms by the film's cuts** (cuts.js FILM_CUTS) and its **strength by the film's own light** (fields-film.mjs LIGHT, the mean of
  theater-light.mjs's score over the picture every tenth of a second): the star's rays from its flash (43.15 s), the burst shooting out over
  0.35 s at its cut (45.445 s), the gold sun (47.6 s), the white flood (49.55 s), the centaur's flames (50.05 to 53.053 s).
- **Shown four ways, all of the one field**: the beams (camera-facing along each ray, pulses running outward along them, occluded by the box's
  faces), the hot core, motes carried outward, and the centaur's flames rising off the cloth's own surface (sampled by area, rim-weighted so
  the figure reads inside its fire, a curl field over buoyancy). `FIELD_GLSL` lets any surface take its light: on the hero the box's faces are
  lit from inside by the cloth, brightest where a ray strikes; the cloth's own aura rises with the field.
- On the hero's white page light is drawn as amber and gold over (alpha), never added: added light vanishes on white.

### The ripple (createRipple, RIPPLE_GLSL; the cubist-fit session's yes, Oct 14 2026 18:4x WEST)
His 16:58 WEST "imagine that seeing athena from that perspective ripples a wave through the fabric of spacetime" and 17:19 WEST "the "FRAME"
AKA "WINDOW INTO THE SCENE" should expand outwards from the alignment of athena hair... SHE IS ALSO CLOSING IT BY WALL OF LIGHT AIOLOS". The
moment is the cubist-fit lane's (her portal, cubism-window.js); this is its fronts as a field. Origin: her hair's join, the window's own
geometry (cubism-window.js stats.geometry, taken at its opening; mountFields reads it from the mounted window). Fronts: the window's
(cubism.mjs portalWindow: 2,600 stage px a second for 0.1 s from 29.763 s, then growing to the stage's far corner by 37.1 s; the bend strong
while it opens, easing to 0.35 after) and the wall of light's (from Aiolos, 37.132 s, to 37.6 s). The bend where a front passes is the cubist
storyboard's (18 px x exp(-(u / 60)^2) x sin(u / 13), radial). RIPPLE_GLSL bends a vertex's clip position where it stands on the stage
(uRippleRect places the canvas): **her strands only**. The ripple never bends her body or her dress (one mesh, one material): she is Saori,
13. The ruling, relayed by the cubist-fit session at 18:5x WEST as "no motion of any kind on her body", is in the coordinator's words of 19:05
WEST no breast or body jiggle and nothing that sexualizes her, and the coordinator called this change right. The patch for her materials given
at 18:5x WEST is withdrawn from createRipple and from the lines. It draws no line (the window draws its warm
line) and nothing at rest. His 18:47 WEST word supersedes the disc portal: the box's own faces fold onto her face's plane into one window,
which shrinks and follows the fight (the box seat builds it). mountFields' `portal` provider then gives that window's origin and its fronts
({origin, r, k, wall, kWall}, taken as given) in place of the disc's geometry. During her shots the box's faces are the
page's own 2D sphere (warm-sphere.js), out of a shader's reach; RIPPLE_GLSL's `rippleBendStage(px)` is there for any shader that reads the
film by its stage position (the box's faces once they are out, the theater's glass). Seen on the lab page by the difference of a bent and a
still frame: the bend sits in a band at the front's radius (about 96 px from her hair's join at 29.80 s, 250 px at 29.86 s) and moves out.

### 3. A silhouette into smoke, water or petals (createDissolve)
- A body's surface sampled by area (its own colours from its texture where they can be read), a front sweeping across it frayed by a curl
  field's noise, the body's own material cut by the same front with a gold rim (`patch`), her strands cut with her (`bindHair`), and every
  released point carried by a divergence-free curl field: smoke rising and swelling, water thrown and falling (drawn along its motion on the
  screen), petals drifting and tumbling. All on the GPU from the release time; nothing kept.
- **The moment is his** (his tags decide the film's moments). Three candidates, shown on his canvas; nothing is wired:
  - **A**, 37.132 s, his tag Aiolos: the wall of light running out from her, her whole figure and her strands to violet petals on that light
    (first shown at 33.567 s, moved to Aiolos by his 17:35 WEST words). A transformation of her figure, his to pick: this lane withdrew it at
    19:01 WEST, past the ruling's scope (no jiggle of her body, nothing that sexualizes her; she is Saori, 13), and restored it at the
    coordinator's word of 19:05 WEST. The lab page's road for her (`?moment=athena-aiolos`) and `bindHair` (her strands cut with her) are back.
  - **B**, 71.572 s, he goes up into the light: Seiya to gold smoke, from his feet up.
  - **C**, 11.044 s, the hit lands on the one standing in the blast with his arms spread: his silhouette to water.
- **A and THE FOLD**, a fact for his pick, not a reason to drop A. THE FOLD as the hero's hypertrace reads his 19:19 WEST words
  (ec-workspace docs/optimism-fit-hero-hypertrace-2026-10-14.md, which every seat reads before touching the hero): from her cut the faces
  interpolate from the sphere onto her plane (by 30.2 s), and when the wall of light hits (37.132 s) they come back into the sphere, whole by
  38.071 s, the white back; she leaves on that cut (cubism.mjs SHOTS). A starts at 37.132 s and its front takes 1.6 s to cross her, its petals
  living 2.4 s more: it is 59 % across her when the sphere is whole again and she leaves. To end before she leaves its front would take 0.94 s;
  or its petals fly on past 38.071 s, over the white. (The fact first written at 19:20 WEST used the hinged 'in' fold's timing, white by 37.6 s:
  that reading is struck in the hypertrace.)

## The pictures, and his question (on his canvas)

His page "Storyboard" (page-ac490689-8632-4333-b93a-b38ea97d9274), Nest seq 281768, 17:50 WEST, by dyson-society/tools/storyboard-canvas.mjs:
four rows below his panels (y 9648 to 11744, ids claude-fields-*): the hair (the film at 32.6 s, the hero today, the hero with the lines at
30.5, 32.6 and 33.4 s, her whole hair from further back), the light (the film at 45.6 s, the hero today at 46.3 s, the hero with the lines at
44.6, 46.3, 47.2 and 51.5 s), the three silhouette candidates beside the film's frames, and each in the other two styles; three notes ask him:
the hair's flow, which of the light's three moments, and the silhouette's moment and style. A fifth row at 18:02 WEST (Nest seq 282181,
y 11948 to 12450, with a note): the same lines on main's hero as it stood at d74049a0 (the empty frames from the centaur on: the flames burn
inside them) and candidate A at his Aiolos tag. A note at 19:01 WEST (seq 283831) said A was withdrawn; at 19:20 WEST its own words were
corrected in place (one update op, seq 284395: A is back among A, B and C), and a note beside it gives A's timing in THE FOLD (seq 284396,
x 4370, y 12000), its words corrected in place at 19:28 WEST to THE FOLD as the hypertrace reads his 19:19 words (seq 284622; the page's
snapshot rev 19). The pictures hold the film's frames
and the game's figures: not in git; they are in the
coordinator's notes folder, `fields-pictures/`.

## The lines for unboxing.js (the unboxing session's file; nothing of it was edited)

The unboxing session asked (Oct 14 2026 18:1x WEST) for one call that takes the box's scene, camera and cloth and returns an update a draw:
`mountFields({scene, camera, cloth})` in fields.js (the light from the cloth and her strands; `fields.cloth(holder)`, `fields.athena(holder,
spot)`, `fields.glow(t)`, `fields.update(t, beat, {height, px, box})`; nothing in it schedules a frame). fields-lines.mjs holds its lines as
text found in main's unboxing.js and what it becomes (never line numbers): `heroLines(text)` applies them and says which applied;
fields.test.mjs checks that they fit the unboxing.js the tree holds, that the result parses, that the field is made before `const clothSpot`
(it reads the cloth's group at each draw, `cloth: () => clothSpot`: the faces need its uniforms before the group exists) and that her strands
come before her compile step. THE CUBIST FIT is mounted on main by its own lane (d873ca46: herAt places her in her shots; the face she joins
cuts her in her own shader, `uHerCut`, three's clipping being off on that renderer): her strands stand on her as it places her and take the
same cut (`fields.athena(..., {cut: herCut})` shares the uniform). The copies of the cubist lines this file carried before that are gone.
The fields' eight, in seven places (a ninth, the ripple on her looks, given at 18:5x WEST, is withdrawn: the ripple never bends her body):
1. Beside the record's import: `import {mountFields, FIELD_GLSL} from './fields.js';`.
2. PANEL_FS: `${FIELD_GLSL}` after `uniform vec3 uLight;`, and after the shade line `col += fieldLight(-vView, n);` (the faces lit from inside).
3. Before `const panels = faces.map(`: `const fields = mountFields({scene, camera, cloth: () => clothSpot}); Object.assign(shared, fields.uniforms);`.
4. In setCloth after `clothSpot.add(holder);`: `slice().then(() => timed('fields: the flames on the cloth', () => { if (cloth?.holder ===
   holder) fields.cloth(holder); }));` (an idle slice of its own; no texture read).
5. Before her compile step (`await slice(); timed('athena: her three looks compiled', ...`): `await slice(); timed('fields: her strands', () =>
   fields.athena(holder, athenaSpot, {cut: herCut}));` (her strands are compiled with her and cut by the face she joins, as she is).
6. In drawBox after the cloth's aura line: the aura raised by `fields.glow(t)` (`max` with 0.3 k and 0.25 + 0.6 k) while the cloth is shown.
7. In draw() after `const her = athenaOn && layerView === 'all' && drawAthena(t, R);` (the lab's one-layer view since 4bf23542):
   `fields.update(t, s, {height: canvas.height, px: dpr, box: Boolean(boxOut), rect});`
   (the light stands at the cloth while the box is out and the cloth is shown; her strands follow her spot, her clipping and the flow round
   her head, and wear THE CUTS' look her body wears that draw: her normals, then the gold matte; the ripple takes her portal's fronts on her
   strands on this canvas, `rect` being where it stands in the stage).
With `budget: 'lysa'` in mountFields for lysa's glasses. To apply them as written:
`node -e "import('./fields-lines.mjs').then(async ({heroLines}) => { const fs = await import('node:fs'); const r = heroLines(fs.readFileSync('unboxing.js', 'utf8'), {cubism: false}); fs.writeFileSync('unboxing.js', r.text); console.log(r); })"`
in lab/. Run on the hero by fields.proof.mjs --hero on the new Mac (18:3x WEST, main 61538611 with the cubist fit and her portal mounted,
load 13): no page error; her strands in her shot from the cut on (12,985 triangles, 2 calls a draw; at the cut they wear the gold matte with
her), streaming down and left over her portal's window, the drawn hair inside it running the same way; the light's window 20 to 21 calls
against 17 to 18; the box's draws 31.0 a second in her shot and 40.8 in the light's window, with and without the lines alike (31.1 and 40.9).

The silhouette's line, after his pick (B or C): createDissolve on that figure's model as it stands (`createDissolve(holder, {at, style})`), its
object added to the model, `patch` on the model's materials, `update(t, {height: canvas.height})` each draw. Never on her model.

## Prove it again
- The lab page: `http://127.0.0.1:8921/intro/dyson-society/lab/fields.html` (aiolos serves the checkout; `?t=31.5`, `?fields=light`,
  `?moment=seiya-light&style=petals`, `?budget=lysa`, `?far=2.2`; nothing draws while the film is paused).
- On the new Mac, from a scratch folder with this tree: `nice -n 10 node tools/dead-tasks/bounded.mjs 14m -- node
  embertide-app/ui/intro/dyson-society/lab/fields.proof.mjs --out <dir> --passes pictures,cost,rest --bench 32` and `--hero --passes
  pictures,hero-cost --only none` for the hero with the lines and without.
- The film's readings again: `nice -n 19 node lab/fields.measure.mjs --module lab/fields-film.mjs` (about 10 to 18 s; writes the module).
- `node --test --test-force-exit --test-timeout=60000 lab/fields.test.mjs`: 15 tests, no GPU (the module built in node through three r185).

## Not done, said plainly
- **Nothing is wired on the hero**: the lines are the unboxing session's to apply, and the silhouette waits for his pick. The pictures of the
  hero with the lines are this proof's door serving unboxing.js with them (and with the cubist fit's), not main.
- **lysa and WebKit are unmeasured**: the budget above is arithmetic; his Harmony window (WebKit) was not run. The lab page keeps no video
  callback waiting at rest (no VideoTexture: a raw texture, its callback cancelled at the pause), which is what costs WebKit at rest.
- **The flow is the first shot's**: the sway and the field were read off 29.563 to 33.567 s; her other two shots use the same field without
  their own sway. The star's rays are the burst's, not read off 43.5 s.
- **Her hair's look**: the strands are the film's paint on ribbons; the drawn hair's long pale strands are a highlight, not separate strands.
  Over the face she is joined to the strands are cut with her (the cubist fit's planes), so inside it the drawn hair is the film's own.
- **The silhouettes' bodies are as the models stand**: Seiya and the fighter in their stance, not in the film's pose at those seconds.
