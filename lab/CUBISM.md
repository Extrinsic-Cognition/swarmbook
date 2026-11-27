# ATHENA'S CUBIST FIT (lab/cubism.mjs)

**ON HOLD: wire nothing from this file.** His words of Oct 14 2026 16:1x and 16:2x WEST (relayed by the coordinator, verbatim): "i mean diocane
of corse the poitnt is to have a sphere of attention my dude... until that point of the screenshot what happened was the attention was
centered in the point of contact of dolbar and the other knights there... below atehna"; "see that you didnt fucking properly astral project
athena into a coherent spacetime there dio merda???"; and over the hero at 32.6 s: "dude...until this point the dodecahedron has rigghtfully
kept same size... however dude... when athena is there, the fucking dodecahedron must be sized down to align with the battlefied... can you
show me the frames where this is happening please?? i need to teach you some spatial computing shit". So the box is the fight, the
attention's centre; she stands above it in the same 3D space, looking down; in her shot the page's view is the film's view and the box
shrinks to the battlefield's size. The fit below glues her, giant, to a full-size face: it measures the cubist join and stands as that
measure, but its lines are not to be applied until he has taught the lesson. What the frames say for that lesson is in THE BATTLEFIELD IN
HER SHOT, at the end.

**The hold is over: his 17:35 WEST word is to build it on the page (HER SHOTS AND HER PORTAL ON THE PAGE, the last section).** Before that, his bible (17:0x WEST) took this very fit as his panel 2 ("then athena appears perfectly overlapped", over this file's own proof
picture): the box keeps its size and the composition stands. The lines still wait for one word of his: whether she comes at the cut itself or
a beat after it with the wave (HIS BIBLE, the last section).

His words, Oct 14 2026 (relayed as 16:1x WEST), over hero-ab.html at film 29.8 s: "bro this is soo fucking poorly spatial aware as fuck...
do you understand what cubism is? why the fuck dont you align the frame seen there and the hair of the 3d model? you get what i mean or not?"

## Cost first

| what | when | measured |
| --- | --- | --- |
| the fit (cubism.fit.mjs) | once, offline, on the serving Mac niced | 124.8 s wall for four classes of face (23 to 50 s a class), 2,808 evaluations a class at about 8 to 18 ms each (twelve views an evaluation); ffmpeg decodes the shot's 120 frames into memory in 4.2 s |
| the page, per draw | while she is on (her shot, 4.0 s) | one 4x4 and five planes from the face's pose (about 200 multiplications): 0.1 to 0.2 ms median, 1.1 to 1.3 ms the slowest, 8 draws a proof run (Chrome's clock floor is 0.1 ms there); the materials' new program with five planes is compiled at load in the lines below |
| the GPU | her fragments only | five dot products a fragment for the clip; not measured apart from her draw |
| at rest | | nothing: no timer, no frame, no network in the module (its test reads the source) |
| the pictures | once | one headless Chrome at a time (about 500 MB) for about 90 s on the new Mac, three page loads, 36 pictures |

## The reading

Cubism is one subject seen from two viewpoints at once and joined. In the film's shot over her shoulder (frames 886 to 1005, 29.563 to
33.567 s, cut to cut: the frames' mean difference 49.1 and 43.2 at the cuts, 0.1 to 8.5 inside) every face of the page's dodecahedron
carries the film's centre square, laid on the face by warm-sphere.js decal(): her head from behind at the picture's upper right, her violet
hair streaming down to the left. The game's Athena (athena.hades.glb) is the same woman. So she is no longer stood at a sampled point of the
record's Gaussian: she is put where her 3D hair continues the hair the face draws, across that face's edge, at the film's scale, seen as the
film's camera sees her (behind and above her head, looking down at the fight), and the face's five edges cut her: inside the face the
film's picture of her, outside it her body in 3D. The film's frame is a close-up of her head, so at its scale she is large: 1.8 to 4.6 box
radii a metre (2.9 to 7.4 box radii tall, the sphere 2), her body going down past the sphere's lower right.

## Method (all measured, nothing guessed)

- **The drawn hair**: a mask of the film's pixels by her violet (hue 262 to 336 deg, saturation >= 0.15, value >= 0.30). Read off the
  shot's frames: her hair 289 to 306 deg (saturation 0.28 to 0.38), the rocks and the ground 160 to 190, the fighters 11, the pillarbox
  bars at columns 0 to 81 and 878 to 959. Closed by 2 px, the majority over the shot for the fit's start, each frame for its views.
- **The 3D hair**: athena.hades.glb's E00H vertices (4,328 to 7,019 of its one primitive: the hair model comes after the body's in
  tools/hades-glb.mjs build(), and every one of them samples the violet or pink of the texture), 1,280 triangles, posed as the asset
  stands, read through the hero's own three.js r185 skinning in node.
- **Her place on a face**: her head joint at (u, v, w) box radii from the face's centre along the decal's across (the picture's right),
  up and the face's outward normal; s box radii a metre; seen from behind, her up tilted toward the eye by theta (the film's camera
  looking down at her), turned psi about her own up, rolled phi about the face's normal. The face turns with the sphere; she turns with it.
- **The join**, along the face's five edges in the page's pixels: whether the face's picture shows her hair 3 px inside each boundary
  pixel, and whether her 3D hair is there 3 px outside it; runs under 8 px (her strands) folded into their neighbours. Its **gap** (px):
  the mean distance along the boundary from each place where the drawn hair's edge meets the boundary to the nearest place her 3D hair's
  edge does, both ways. Its **mismatch** (px): the boundary's length where one has hair and the other not. Its **angle** (deg): the mean
  turn between the two hair edges where they meet. Its **overlap**: none, the face's edges cut her.
- **The search**: a (mu/mu, lambda) evolution, 24 candidates a generation from the 6 best, each candidate's own step size (log-normal),
  the best ever kept; 2 seeds x 60 generations. The score is gap + half the mismatch + a quarter px a degree, averaged over **twelve
  views** a shot spans: the face picked at the cut at its window's start, middle or end, then turned 0.12 rad a second (the sphere's own
  drift, warm-sphere.js) while the film runs to the next cut, each turn paired with its frame (886, 926, 966, 1005). The first fit, at one
  view against the majority mask, joined within 0.4 to 2 px there but broke as the sphere turned (50 to 140 px): the twelve views pulled
  her hair into the face's plane (w within 0.08 to 0.49 box radii of it), where a turn moves both views together.
- **Classes of face**: the decal's across is horizontal (cross(Y, n)), so the pentagon sits four ways in its picture. Each class is fitted
  on the face that chooseFace() picks for the longest run of yaws, at the run's middle.
- **The face chosen**, once at her cut and kept while the shot lasts: of the faces turned to the eye (cosine over 0.3), the one whose
  picture's right side (where the film has her head) stands farthest right on the stage, so her body goes out past the sphere's right
  silhouette into the white. In the proof (yaw 21.8 to 45.8 deg) that is **pent:9**, an equator face whose picture's right side is a
  vertical edge on the sphere's right silhouette (the class of faces 9 and 10, chosen at 28 % of yaws). One face carries her; when the
  sphere has turned another face to that place by her next cut, that face carries her then.

## Receipts

### The fit (FIT in cubism.mjs; R 180 px, the sphere's pitch -0.12)

| class (pentagon corners in its picture) | fitted on | chosen | s (box radii a metre) | theta | gap at its view | over twelve views: gap mean / worst | noise floor |
| --- | --- | --- | --- | --- | --- | --- | --- |
| -108,-36,36,108,180 (a vertical right edge) | pent:9 at yaw 22 deg | 28.3 % of yaws (pent:9, pent:10) | 4.01 | 40.6 deg | 14.6 px | 25.9 / 47.6 px | 11.4 px |
| -144,-72,0,72,144 (a corner at the right) | pent:8 at yaw 90 deg | 32.8 % (pent:8, pent:11) | 1.80 | 44.0 deg | 14.6 px | 21.1 / 39.6 px | 12.0 px |
| -162,-90,-18,54,126 | pent:4 at yaw 328 deg | 31.7 % (pent:4, pent:6) | 1.99 | 43.9 deg | 14.1 px | 16.6 / 32.3 px | 8.5 px |
| -126,-54,18,90,162 | pent:2 at yaw 234 deg | 7.2 % (pent:2, pent:3) | 4.65 | 15.8 deg | 5.6 px | 11.8 / 30.8 px | 9.8 px |

The noise floor is the gap's spread (one standard deviation) when the same place is read against each of the shot's 120 frames at the
fitted view: her hair moves in the wind, and a strand crossing the 8 px fold adds or takes an edge. A gap under it is not a difference.
Three runs were scored under this one objective (this one; the run before the strand filter was mended; the run before the filter): this
one is best in all four classes (for faces 9 and 10: 51.95 against 60.46 and 61.49, its mismatch 30 px against 53 and 59). Three of the four
classes found theta 40.6 to 44.0 deg, the film's "about 40 degrees"; the record's camera (4.2, 12.2, 15.6) to its look (-1, 0.8, 0) is 34.7.

### The proof (cubism.proof.mjs, the new Mac, Chrome for Testing 156 headless, 1440 x 900, Oct 14 2026 16:35 WEST)

main's hero-ab.html (the tree at 7ca5f7ff, main e3281f3d merged), the sphere paused and turned by its own keys to where it would be had the
shot begun at yaw 21.8 deg (within 2.4 deg of that course), the film paused at each second. **Before**: the page as it is. **After**: the
same page with the fit put on from outside (its renderer wrapped: before each draw her group takes place() on the face chooseFace() picked
and her materials take the face's five planes). **Lines**: the door serves main's unboxing.js with the lines below applied (and nothing
wrapped), so the lines themselves put her on the face. The join is read off the pictures themselves along pent:9's edges: the drawn hair from a
picture of the sphere alone, her hair from a picture of her alone (her rendered violet: hue 250 to 350, saturation >= 0.12).

| second | yaw | before: gap / mismatch | after and lines (the same): gap / mismatch / angle |
| --- | --- | --- | --- |
| 29.6 | 21.8 deg | 82.9 / 173 to 224 px | 82.9 / 161 to 224 px: THE CUTS' normals pass (0.04 s after her cut), no violet of hers to read; the faces still in the cut's blocks |
| 29.8 | 21.8 deg | 82.9 / 228 px | 26.3 / 31 px / 18.7 deg |
| 31.0 | 29.8 deg | 88.8 / 205 px | 1.0 / 2 px / 48.4 deg |
| 33.4 | 45.8 deg | 97.3 / 247 px | 13.0 / 22 px / 25.5 deg |

(29.6 s read differently on each of the three loads, 161 to 224 px of drawn hair: the cut's blocks fill her shoulder in over its first frames.)
The lines' pass caught a fault the injection could not: unboxing.js has a `place` of its own (the canvas's rect, line 640) that shadowed the
import, and her draw threw; the import is aliased below (`cubistPlace`), and the third run drew her without an error.

Before, her 3D hair never reaches the face (no edge of hers on its boundary: the gap is the measure's penalty, an eighth of the boundary).
After, on the boundary's 663 to 779 px, 2 to 31 px disagree; the gaps of 1.0 and 13.0 px sit within the class's noise floor (11.4 px), 26.3 px a little over two of it. No page errors; the one request refused
was the page's Google font. The pictures hold the film's frames and the game's Athena, so they are not in git: the whole-page ones are in the
coordinator's notes folder, `side-session-notes/local_32846573-ee6a-4249-b39e-2a5af2f24732/cubism-pictures/` (before-31.0s-all.png,
after-31.0s-all.png, lines-31.0s-all.png and the same at 29.6, 29.8 and 33.4 s, with cubism.proof.json).

## The lines for unboxing.js (the unboxing session's file; the steps' line numbers as main had it at e3281f3d, the patch below re-based on 8dd999c5)

**SUPERSEDED, do not apply:** the mount landed on main in d873ca46 and a4199965, with her cut in her own shader (MOUNTED, at the end); hero-ab.html and unboxing.js have one writer, the box seat. 


1. Line 41, beside the record's import:
   ```js
   import {FIT, chooseFace, place as cubistPlace} from './cubism.mjs';   // unboxing.js has a place() of its own (the canvas)
   ```
2. Lines 598 and 599 (her own group, out of the record's arena; the five planes; the face she is on):
   ```js
   const arena = new THREE.Group(), athenaSpot = new THREE.Group(), cut = Array.from({length: 5}, () => new THREE.Plane());
   arena.matrixAutoUpdate = false; athenaSpot.matrixAutoUpdate = false; scene.add(arena, athenaSpot); arena.visible = false; athenaSpot.visible = false;
   let herFace = -1;   // cubism.mjs: the face of the dodecahedron she is joined to, picked at her cut
   ```
3. Line 627, before the compile loop (so the programs compiled at load carry the planes; renderer.localClippingEnabled is already true):
   ```js
   for (const m of [...athena.own, passMaterials.normals, passMaterials.matte]) { m.clippingPlanes = cut; m.clipIntersection = true; }
   ```
4. In drawAthena: line 828 gains `athenaSpot.visible = Boolean(presence);`; inside `if (key !== placedKey) {` (line 832) add
   `herFace = chooseFace(faces, sphere.getViewState());`; line 837 becomes `if (!placed) { arena.visible = false; athenaSpot.visible = false; return false; }`.
5. Lines 842 to 845 (the record's mean, swung inside its sigma) become:
   ```js
   // ATHENA'S CUBIST FIT (cubism.mjs): her hair continues the hair the face draws, across that face's edges, the face turning with the sphere
   const on = cubistPlace(FIT, faces[herFace], sphere.getViewState());
   athenaSpot.matrix.set(...on.matrix); athenaSpot.matrixWorldNeedsUpdate = true;
   on.planes.forEach((q, i) => { cut[i].normal.set(q[0], q[1], q[2]); cut[i].constant = q[3]; });
   ```
6. Lines 868 and 871 (each draw starts with her hidden): add `athenaSpot.visible = false;` beside `arena.visible = false;`.

The same, as a patch against main's unboxing.js at 8dd999c5 (re-based after the box came to be made in idle time; `git apply --check` passes from the house root; the hero drew his bible's panel 2 with it, below):

```diff
diff --git a/embertide-app/ui/intro/dyson-society/lab/unboxing.js b/embertide-app/ui/intro/dyson-society/lab/unboxing.js
index d5b22468..5a6be65b 100644
--- a/embertide-app/ui/intro/dyson-society/lab/unboxing.js
+++ b/embertide-app/ui/intro/dyson-society/lab/unboxing.js
@@ -41,2 +41,3 @@ import {beat, lotus, floorOf, rotate, ss, PIECES, RAYS} from './unboxing-plan.mj
 import {placeAthena, presenceAt, passAt, columnOnPage} from './athena-shot.mjs';
+import {FIT, chooseFace, place as cubistPlace} from './cubism.mjs';   // unboxing.js has a place() of its own (the canvas)
 import {shotAt, columnWidthAt} from './braindance.mjs';
@@ -687,4 +688,5 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
   // the arena (the record's metres) seen through the shot's camera from the page's eye: S x the camera's axes x (p - look)
-  const arena = new THREE.Group(), athenaSpot = new THREE.Group();
-  arena.matrixAutoUpdate = false; arena.add(athenaSpot); scene.add(arena); arena.visible = false;
+  const arena = new THREE.Group(), athenaSpot = new THREE.Group(), cut = Array.from({length: 5}, () => new THREE.Plane());
+  arena.matrixAutoUpdate = false; athenaSpot.matrixAutoUpdate = false; scene.add(arena, athenaSpot); arena.visible = false; athenaSpot.visible = false;
+  let herFace = -1;   // cubism.mjs: the face of the dodecahedron she is joined to, picked at her cut
   const beamMaterial = new THREE.ShaderMaterial({vertexShader: COLUMN_VS, fragmentShader: COLUMN_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide,
@@ -716,2 +718,3 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
       athenaSpot.add(holder);
+      for (const m of [...athena.own, passMaterials.normals, passMaterials.matte]) { m.clippingPlanes = cut; m.clipIntersection = true; }   // the face's edges cut her (cubism.mjs)
       await slice();
@@ -920,3 +923,3 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
     const presence = athenaAt(t);
-    arena.visible = Boolean(presence); flood.visible = false;
+    arena.visible = Boolean(presence); flood.visible = false; athenaSpot.visible = Boolean(presence);
     if (!presence) return false;
@@ -925,2 +928,3 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
     if (key !== placedKey) {
+      herFace = chooseFace(faces, sphere.getViewState());
       placed = placeAthena(bd, t, {eye: EYE, R, stage: stageBox}); placedKey = key;
@@ -929,3 +933,3 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
     }
-    if (!placed) { arena.visible = false; return false; }
+    if (!placed) { arena.visible = false; athenaSpot.visible = false; return false; }
     const {frame, unit: s} = placed, r = frame.right, u = frame.up, b = frame.back, L = frame.L;
@@ -934,6 +938,6 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
     arena.matrixWorldNeedsUpdate = true;
-    // her feet where placeAthena put them (the record's mean, swung inside its sigma), turned to her look
-    const track = bd.entities.athena.tracks.find(k => t >= k.t[0] && t < k.t[1]);
-    athenaSpot.position.set(track.mu[0] + placed.swing[0], track.mu[1] + placed.swing[1], track.mu[2] + placed.swing[2]);
-    athenaSpot.rotation.set(0, placed.yaw, 0);
+    // ATHENA'S CUBIST FIT (cubism.mjs): her hair continues the hair the face draws, across that face's edges, the face turning with the sphere
+    const on = cubistPlace(FIT, faces[herFace], sphere.getViewState());
+    athenaSpot.matrix.set(...on.matrix); athenaSpot.matrixWorldNeedsUpdate = true;
+    on.planes.forEach((q, i) => { cut[i].normal.set(q[0], q[1], q[2]); cut[i].constant = q[3]; });
     // THE CUTS' device on her cut: her normals, then a flat gold matte, then her own picture
@@ -960,6 +964,6 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
     project(R);
-    box.visible = Boolean(boxOut); heaven.visible = Boolean(boxOut); arena.visible = false; beam.visible = false; flood.visible = false;
+    box.visible = Boolean(boxOut); heaven.visible = Boolean(boxOut); arena.visible = false; athenaSpot.visible = false; beam.visible = false; flood.visible = false;
     if (boxOut) drawBox(t, s, v, R);
     const her = athenaOn && drawAthena(t, R);
-    if (!boxOut && !her) { arena.visible = false; flood.visible = false; clear(); lastPose = `${v.yaw},${v.pitch},${v.radius}`; return; }
+    if (!boxOut && !her) { arena.visible = false; athenaSpot.visible = false; flood.visible = false; clear(); lastPose = `${v.yaw},${v.pitch},${v.radius}`; return; }
     sparkUniforms.uT.value = t;
```

`faces` is the file's own `buildAssemblySkin(0).pents` (line 409), the page's twelve pentagons. The record's column of light and its flood
keep the arena and the shot's frame as they are. The panel's line ("moved 0.61 sigma from the record's mean") then says the record's
place, not hers: `state.athena.swing` could carry `{face: faces[herFace].id, ...FIT.classes[...]}` instead (classOf in cubism.mjs).
Optional: her body runs past the canvas's bottom (place(): 2.2 box radii below the centre); `place(R, true)` while she is on would cover it.

## Not done, said plainly

- **The scale is the film's.** Her head in the frame is a close-up, so she stands 3 to 7 box radii tall; the hero's canvas cuts her body
  at 2.2 box radii below the sphere's centre. The join is at the face's edge; the rest of her is large on purpose, not fitted to the stage.
- **A sheet cannot continue strands.** Her game hair is a solid sheet; the film's hair at the lower edges is strands. Runs under 8 px are
  folded, which is why the noise floor is 8.5 to 12 px; the angle where the edges meet stays 17 to 57 deg.
- **The join wears as the sphere turns.** Over the 27.5 deg a shot turns it, the worst of the twelve views is 31 to 48 px; picked at the
  middle of its window it holds within 1 to 26 px in the proof. The face is picked once at her cut; a hand that drags the sphere during the
  shot takes her with the face.
- **Colour**: the game's hair is pinker (magenta) than the film's lavender; the join reads both as violet but the eye sees two paints.
- **Her other shots** (over her shoulder at the column, 36.570 to 37.204 s; the flood to 38.071; 71 to 74 s) use the same frame of hers in
  the page but were not fitted: their frames differ (the beam, the flood). The fit is for frames 886 to 1005.
- **Engines**: Chrome only. WebKit (his Harmony window) and lysa are unmeasured, the clip's GPU cost on lysa too.
- **The proof's sphere was pinned** (paused and turned by keys); on his screen it turns by the wall clock, so the face at his cut is
  whichever stands at the right then.

## THE BATTLEFIELD IN HER SHOT (measured for his lesson; nothing wired)

The frames, read off app/saint-seiya.mp4 (the picture's own columns 82 to 877; the coordinator's 4:3 picture is columns 120 to 840, and the
fractions below are of that picture, so his and mine read alike):

| what | where in her shot (29.563 to 33.567 s) | how it was read |
| --- | --- | --- |
| the fight (Dolbar holding Seiya up by the hair, his crown's tip to the cape's tip, Seiya's trousers to the cape's edge) | film x 268 to 375, y 172 to 337: 0.31 of the picture's height (0.306 +- 0.011), 0.15 of its width, centred at (0.28, 0.47) | by eye on 3x crops with a 10 px grid, frames 886, 946 and 1005; the box stays within 3 px over the shot |
| her head and hair | the head's mass from x 0.708 (+- 0.001) to the right edge, its crown at y 0.095 (+- 0.002); violet covers 0.290 (+- 0.007) of the picture | the violet mask, all 120 frames |
| the fight's scale against the two-shot (19.052 to 29.563 s) | Dolbar's head 250 px there against 22 to 36 px here; Seiya's about 295 against 15 to 20: the same metres are 0.06 to 0.15 as large (about 0.1) | by eye on a 20 px grid, frames 571 and 616 there, 886 here; the small heads carry +- 5 px |

The two-shot is a close-up from the chest up: the group overflows its frame, so "about 1.0 of the frame" there is a floor, and the group's
share of the frame (1.0 or more, then 0.31) and the fight's own scale (1, then about 0.1) are two different measures. The stage the
hero draws on is 1205 x 900 at a 1440 x 900 window (aspect 1.339), the 4:3 picture's own shape (1.333): the stage can stand for her frame.
Three candidate scales follow from those readings, drawn over frame 929 in `cubism-pictures/candidates-929.png` (the coordinator's notes
folder; it holds a film frame, so not in git):

| candidate | the box in her shot | its reading |
| --- | --- | --- |
| A | R 140 px (0.78 of today's 180), centred at the fight, stage (337, 423) instead of (663, 450) | the stage is her frame and the box is the battlefield as the frame shows it: 0.31 of the frame's height |
| C | R 54 px (0.30 of today's) at the same place | the box keeps its ratio to the fight's share of the frame: 0.31 against the two-shot's 1.0 |
| B | R 11 to 27 px (0.06 to 0.15 of today's) at the same place | the box keeps its metres: the fight's own scale change between the two shots |

Today's box (R 180 at (0.55, 0.50) of the stage) stands where her frame has her hair (x from 0.48 to 1.0 with the streaming strands).
Before the cut, the coherent spacetime puts her above the box: braindance.json's track has her 11 m up and 14 to 22 m from the fight
(sigma 3, 4, 5 m), the ground seen at about 40 deg from above; how many metres the box spans then is the lesson's to say. Nothing of this
is wired: the box's size is drawn by the unboxing seat's files, and they take numbers only through that seat or a module of mine they import.

## THE TWO OVERLAPS AND THE WAVE (the storyboard on his canvas, Oct 14 2026 17:14 WEST; nothing wired)

His lesson, 16:58 WEST, over the hero at 32.6 s (relayed verbatim): "this is fucking indecent dude omg... how many fucking times i said what
needs to happen with 2 overlaps? imagine that seeing athena from that perspective ripples a wave through the fabric of spacetime... you get
what i mean? you appear once that pov then".

The reading the frames show: the two overlaps are the box over the battlefield and her 3D figure over the Athena the film draws, both in her
frame through ONE camera (the film's inverse problem and the page's forward one, one projective law). The stage is her frame: the 4:3 picture
(film columns 120 to 840) has the stage's own shape. She is not on the page before that point of view; at the cut a wave leaves its origin,
bends what it passes, sizes the box down to the battlefield as it passes the box and lets her appear behind its front.

- **The camera**: 40 deg over the 900 px stage (focal 1,236 px, centred). **The box** over the battlefield (candidate A): its screen
  radius 140 px at (337, 423), so 8.83 box radii in front of the camera. **Her pose** (lab/cubism.storyboard.mjs overlapFit, an evolution of
  32 a generation over 90 generations on the silhouettes): her head joint at (0.59, 0.13, -1.92) box radii, 2.02 box radii a metre, seen
  from behind, her up leaning 31.8 deg toward the camera, turned -21.9 deg, rolled 21.6 deg. **The overlap**: IoU 0.81 against the shot's
  majority hair mask, 0.712 to 0.736 against single frames. What it misses is the film's hair streaming left in the wind; the game's hangs.
- The frame does not settle metres: her scale and her distance trade off. At 2.02 box radii a metre the box is 0.5 m across. The ratio of
  the fight's distance to her head's is 4.6 here and about 10 in braindance.json's camera (20 m and 2 m).
- **The wave** (a candidate): its front runs 2,600 stage px a second from its origin. The origin is the point of contact (the box's centre
  at the cut) or her head (983, 300). Where the front passes it bends what it passes (18 px) and draws a warm line; the box takes the
  battlefield's size and place as the front passes its centre, and she appears behind the front. It is a function of the film's second, so
  it runs only while the film plays: nothing at rest.
- **On his canvas**: page-ac490689-8632-4333-b93a-b38ea97d9274 ("Storyboard"), seq 280258, rows from y 5760: the wave from the point of
  contact (29.400 to 30.200 s), the wave from her, her shot (31.0 to 33.5 s, and 31.0 s with the film at 35 % under it), the box's three
  sizes (A, C, B), and the two questions (the wave's origin, the box's size). 59 items, 17 frames, 320 KB, rehearsed with --dry first.
- **Reproduced** by `nice -n 19 node lab/cubism.storyboard.mjs --out <dir>`: the same pose and IoU, the frames within JPEG noise of the
  posted ones (PSNR 54 to 62 dB), 119 s on this Mac at load. Its output holds the film's frames: not in git.

Open, for him: where the wave starts, and how far the box sizes down (A, C or B). Wiring it is the box seat's (unboxing.js, hero-ab.html).
During her shot its 3D box would take the page's sphere's place, as at 42 s, and one camera would draw the box and her. Her pose is a
constant, and the wave is one number per film frame for about 0.6 s. None of that is measured on a page yet.

## HIS BIBLE: panels 1 and 2 as the hero draws them (Oct 14 2026 17:25 WEST; the lines wait for his word)

His picture, 17:0x WEST, three panels drawn over the hero (kept out of git in the coordinator's notes folder): "at first the 12hedron starts
showing this as normal" over the box alone with her shot on its faces; "then athena appears perfectly overlapped" over this file's own proof
picture (after-31.0s: her head at the box's right face, pent:9, her 3D hair continuing the drawn hair). So the box keeps its size, and the
face-anchored fit above is the composition he wants; THE BATTLEFIELD IN HER SHOT and THE TWO OVERLAPS AND THE WAVE (the box sized down) are
superseded by it. Panel 3 is not built.

The hero drew both panels with the patch above served in place of unboxing.js (cubism.proof.mjs --passes lines --seconds 29.4,29.563,...,33.5,
the new Mac, 16:2x WEST). The join was read off the pictures along pent:9's edges:

| second | the hero (yaw) | gap / mismatch |
| --- | --- | --- |
| 29.563 to 29.75 | THE CUTS' device on her cut: her normals, then a gold matte | no violet of hers to read |
| 29.85 | 21.8 deg | 2 / 4 px |
| 30.2 | 29.8 deg | 37 / 36 px |
| 31.0 | 29.8 deg | 1 / 2 px |
| 32.0 | 37.8 deg | 5 / 10 px |
| 33.0 | 45.8 deg | 39 / 35 px |
| 33.5 | 45.8 deg | 15.5 / 24 px |

The hair's noise floor is 11 px; the boundary is 663 to 779 px. On his canvas (Storyboard, seq 280710, rows from y 7860): panel 1 (the box
alone, 29.400 to 30.200 s), the wave at her appearance drawn over the hero's own frame at 30.2 s (cubism.storyboard.mjs waveOverHero: outside
the front the page with the box alone, inside it the page with her; its origin is her head, from FIT), panel 2 through her shot, and her cut as
the hero draws it with the lines today.

The question left for him: does she come at the cut itself, through THE CUTS' device, or a beat after it with the wave from her? The wave is
not on the hero; drawn there it would be one number a film frame (the front's radius) for about 0.6 s while the film plays, nothing at rest.

## HER PORTAL (his 17:19 WEST; frames on his canvas beside the wave rows, nothing wired)

His words, verbatim, over the hero at 31.0 s and at 37.6 s: "before these, the background is white... after these, the background ramins
white... FOR THE DURATION INBETWEEN THESE, I SAID ALREADY HOW THE "FRAME" AKA "WINDOW INTO THE SCENE" should expand outwards from the
alignment of athena hair. is that clear? do you know what i mean? it means that athena is basically opening up this portal into spacetiem and
then SHE IS ALSO CLOSING IT BY WALL OF LIGHT AIOLOS".

The reading drawn (cubism.storyboard.mjs portalOverHero, over the hero's own pictures with the lines; the new Mac, 17:3x):
- **It opens at 29.763 s**, the first frame where her hair is aligned on the hero. From the cut (29.563 s) her place is already the join, but
  THE CUTS' device draws her as normals and a gold matte for 0.2 s. His 31.0 s picture is a moment inside it; without the device it would
  open at the cut.
- **Its point** is her head on the window (994, 522), at pent:9's right edge, from FIT. Its front runs 2,600 px a second for 0.1 s, then
  grows to the whole window (1,122 px) by 37.1 s.
- **What it shows** is the film's picture (columns 82 to 877), seen through the joined face's own picture plane at the opening, so the film's
  hair runs on under her 3D hair. The scene zooms out from her hair 8.8 times by 37.1 s. The picture ends just right of her head (the film
  cuts her there too), so the window is white beyond it. The box (its front faces) and she stay in front. Through her face shot (33.567 to
  36.570 s) the window shows her face and she is not on the page. From 36.570 s she is back, joined at pent:8, the face the box has turned
  to the right by then.
- **The wall of light**: from his Aiolos tag (37.132 s) a wall runs out from her and leaves white behind it, closed at 37.6 s. From 37.10 s the
  theater's own burst holds the sphere's place, and the wall runs over it.
- **The box inside it**: it keeps its size (his bible) and stands in front. The window's battlefield grows with the zoom, from 80 px tall at
  the opening (about candidate C) to 708 px, and meets the box's 360 px near 33.5 s (zoom 4.5). A, C and B now read as moments of the
  zoom, not as sizes of the box.
- **On his canvas**: Storyboard seq 281227, x 2300, y 5760 to 7090: the opening (29.763 to 30.600 s), the growth (31.0 to 37.0 s), the wall
  of light (37.132 to 37.6 s) and a note. 41 items, 15 frames, 360 KB. Remade by `cubism.storyboard.mjs --portal <captures> --out <dir>`,
  identical to the posted frames.
- **If wired**: one more full-stage textured quad on the box's canvas (the film it already uploads), drawn behind the box and her while the
  window is open. Two uniforms change per film frame (the window's radius and zoom), and the wall's radius for 0.47 s. Nothing at rest, and
  it is gone after 37.6 s. Not measured on a page.

## HER SHOTS AND HER PORTAL ON THE PAGE (his 17:35 WEST: build it; the mount waits for the box seat)

His words, verbatim (relayed), over the hero at 34.2 s, her face shot with no 3D Athena anywhere: "this is the proof that you have not done
what i told you to do which was, for the time between the 2 keyframes with athena alignment and the waall of ligt.... this perspective of
athena is not even there let alone RLVR'd into place...".

**Built (this lane's files):**
- **cubism.mjs**: SHOTS, her three shots cut to cut, each with its pose found by the evolution against the measured join (FITS = [FIT, FIT2,
  FIT3]), and herAt(t, faces, spin, keep) for the page.

  | shot | frames | how it was fitted | gap at its fitted view |
  | --- | --- | --- | --- |
  | over her shoulder | 886 to 1005 | FIT, above | 11.8 to 27.5 px |
  | her face | 1006 to 1095 | seen from the front; the face picked on the sphere's left outline (the drawn hair is at the picture's left); a close-up's scale, 2.5 to 5 box radii a metre; frames 1006 to 1085, before the beam's golden light turns her hair pale | 6.6 to 19.9 px |
  | over her shoulder at the column | 1096 to 1114 | her hair navy in the beam, hue 215 to 300 | 2.5 to 16.3 px; the class of faces 9 and 10 weak at 63.9 |

  Also PORTAL, portalWindow and portalGeometry: her portal's timing and geometry, pure.
- **cubism-window.js**: her portal on the page. It is one canvas in the stage at z-index -1, under the sphere and above the page's white
  (the stage made its own stacking context; the page lays its sphere canvas out in flow, so a positioned canvas would cover the box). From
  29.763 s it draws the page's own <video> through the joined face's picture plane, zoomed about her hair (8 times at most), inside a window
  that opens like the wave and grows. From 37.132 s the wall of light closes it, white by 37.6 s. It draws on the film's frames only while
  open.

**The mount (the box seat's files; the patches below pass `git apply --check` on main; not applied here):** hero-ab.html imports
cubism-window.js and mounts it before the KO edge. unboxing.js takes her presence and place from cubism.mjs (presenceOf, herAt) instead of
the record's mean, keeps the record's arena for its column of light only, and gives her the face's five clipping planes.

**The receipt** (cubism.proof.mjs --passes lines --hero --play, headless Chrome 156 on the new Mac, 1440 x 900, Oct 14 2026 17:58 WEST; the
page with both patches served, nothing else changed):
- **Playing 29.4 to 37.8 s** (8.45 s): her portal drew 235 times, 0.18 ms each (43 ms in all; 0.11 ms a draw on the run before). The box's
  canvas drew 264 times, all with her (median 0.30 ms of script, 0.22 ms of GPU). Paused for 3 s after: the portal drew 0 times and held no
  frame callback.
- **She is on the page** in all three shots: 29.8, 31.0 and 33.0 s at pent:9; 34.2 and 35.5 s in her face shot; 36.8 and 37.132 s at the
  column, at pent:8. She is off at 37.4 and 37.6 s, the flood, as the wall closes her portal.
- **The join, read off the pictures** (her portal hidden for the reading):

  | second | gap / mismatch |
  | --- | --- |
  | 29.8 | 26.3 / 31 px |
  | 31.0 | 1 / 2 px |
  | 33.0 | 38.8 / 35 px |
  | 34.2 (her face, pent:4) | 66.4 / 47 px: her 3D hair does not reach that face's edges at this pose |
  | 36.8 (the column) | the violet reading sees no drawn hair: there it is navy |

**Not done, said plainly:** in her face shot she is on the page but smaller than the drawn close-up (about half the face's picture) and low
at the box's lower left, and her join is not met at the proof's pose. The column shot's join is unread on the pictures (its hair is navy).
The portal's film is soft at 8 times. Lysa and WebKit (his Harmony window) are unmeasured. The pictures (film frames) are in the
coordinator's notes folder, cubism-pictures/live/.

**SUPERSEDED, do not apply:** the mount landed on main in d873ca46 and a4199965, with her cut in her own shader (MOUNTED, at the end); hero-ab.html and unboxing.js have one writer, the box seat. The mount for hero-ab.html:

```diff
diff --git a/embertide-app/ui/intro/dyson-society/lab/hero-ab.html b/embertide-app/ui/intro/dyson-society/lab/hero-ab.html
index 14620ee9..835f5fe3 100644
--- a/embertide-app/ui/intro/dyson-society/lab/hero-ab.html
+++ b/embertide-app/ui/intro/dyson-society/lab/hero-ab.html
@@ -118,2 +118,3 @@ import {CLOSE, SHUT} from './unboxing-plan.mjs';
 import {mountKoEdge} from './ko-edge.js';
+import {mountCubismWindow} from './cubism-window.js';
 
@@ -357,2 +358,3 @@ async function ready(found) {
   theater = await createTheater({canvas, film: found.film, wall: groundOf(found.stage), clear: true, vignette: 0, fit: 0.92, active: false, road, onDraw: (s) => { last = s; }});
+  mountCubismWindow({stage: found.stage, film: found.film, sphere: frame.contentWindow.genesisSphere, before: found.sphere});   // HER PORTAL (cubism-window.js, CUBISM.md): behind the sphere
   mountKoEdge({stage: found.stage, film: found.film});   // THE KO EDGE (ko-edge.js, its lane's two lines: LANDING.md), after the stage's last canvas
```

**SUPERSEDED, do not apply:** the mount landed on main in d873ca46 and a4199965, with her cut in her own shader (MOUNTED, at the end); hero-ab.html and unboxing.js have one writer, the box seat. The lines for unboxing.js (her shots; they supersede the patch above; re-based on main at f8b74324, the box's ending, after the proof ran on the lines over 8f89bcd4's file: the Athena code is the same text in both):

```diff
diff --git a/embertide-app/ui/intro/dyson-society/lab/unboxing.js b/embertide-app/ui/intro/dyson-society/lab/unboxing.js
index 6c9ddd59..d1bf49f7 100644
--- a/embertide-app/ui/intro/dyson-society/lab/unboxing.js
+++ b/embertide-app/ui/intro/dyson-society/lab/unboxing.js
@@ -41,2 +41,3 @@ import {beat, lotus, floorOf, rotate, ss, PIECES, RAYS, KNIGHTS_COSMOS, STREAM,
 import {placeAthena, presenceAt, passAt, columnOnPage} from './athena-shot.mjs';
+import {herAt, presenceOf} from './cubism.mjs';   // ATHENA'S CUBIST FIT: her shots, each fitted into place (lab/CUBISM.md)
 import {shotAt, columnWidthAt} from './braindance.mjs';
@@ -798,4 +799,4 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
   // the arena (the record's metres) seen through the shot's camera from the page's eye: S x the camera's axes x (p - look)
-  const arena = new THREE.Group(), athenaSpot = new THREE.Group();
-  arena.matrixAutoUpdate = false; arena.add(athenaSpot); scene.add(arena); arena.visible = false;
+  const arena = new THREE.Group(), athenaSpot = new THREE.Group(), cut = Array.from({length: 5}, () => new THREE.Plane()), herKeep = {};
+  arena.matrixAutoUpdate = false; athenaSpot.matrixAutoUpdate = false; scene.add(arena, athenaSpot); arena.visible = false; athenaSpot.visible = false;
   const beamMaterial = new THREE.ShaderMaterial({vertexShader: COLUMN_VS, fragmentShader: COLUMN_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide,
@@ -827,2 +828,3 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
       athenaSpot.add(holder);
+      for (const m of [...athena.own, passMaterials.normals, passMaterials.matte]) { m.clippingPlanes = cut; m.clipIntersection = true; }   // the face's edges cut her (cubism.mjs)
       await slice();
@@ -834,4 +836,5 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
   // she is on the page during the record's over-the-shoulder shots, and the canvas wakes half a second before so her cut lands on the film's frame
-  const athenaAt = (t) => bd && athena ? presenceAt(bd, t) : null;
-  const athenaNear = (t) => Boolean(bd && athena && (presenceAt(bd, t) || presenceAt(bd, t + 0.5)));
+  // her shots from the alignment to the wall of light (cubism.mjs SHOTS: over her shoulder, her face, the column), on the film's own cuts
+  const athenaAt = (t) => bd && athena ? presenceOf(t) : null;
+  const athenaNear = (t) => Boolean(bd && athena && (presenceOf(t) || presenceOf(t + 0.5)));
 
@@ -1063,3 +1066,3 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
     const presence = athenaAt(t);
-    arena.visible = Boolean(presence); flood.visible = false;
+    arena.visible = Boolean(presence); flood.visible = false; athenaSpot.visible = Boolean(presence);
     if (!presence) return false;
@@ -1072,11 +1075,15 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
     }
-    if (!placed) { arena.visible = false; return false; }
-    const {frame, unit: s} = placed, r = frame.right, u = frame.up, b = frame.back, L = frame.L;
-    const dotL = (a) => a[0] * L[0] + a[1] * L[1] + a[2] * L[2];
-    arena.matrix.set(s * r[0], s * r[1], s * r[2], -s * dotL(r), s * u[0], s * u[1], s * u[2], -s * dotL(u), s * b[0], s * b[1], s * b[2], -s * dotL(b), 0, 0, 0, 1);
-    arena.matrixWorldNeedsUpdate = true;
-    // her feet where placeAthena put them (the record's mean, swung inside its sigma), turned to her look
-    const track = bd.entities.athena.tracks.find(k => t >= k.t[0] && t < k.t[1]);
-    athenaSpot.position.set(track.mu[0] + placed.swing[0], track.mu[1] + placed.swing[1], track.mu[2] + placed.swing[2]);
-    athenaSpot.rotation.set(0, placed.yaw, 0);
+    // ATHENA'S CUBIST FIT (cubism.mjs): her shot's fitted pose on the face she joins (picked at the shot's cut), turning with the sphere; the
+    // face's five edges cut her, so inside it the film's picture of her and outside it her body in 3D
+    const on = herAt(t, faces, sphere.getViewState(), herKeep);
+    if (!on) { arena.visible = false; athenaSpot.visible = false; return false; }
+    athenaSpot.matrix.set(...on.matrix); athenaSpot.matrixWorldNeedsUpdate = true;
+    on.planes.forEach((q, i) => { cut[i].normal.set(q[0], q[1], q[2]); cut[i].constant = q[3]; });
+    // the record's arena (its column of light and its flood) where the shot looks at the fight
+    if (placed) {
+      const {frame, unit: s} = placed, r = frame.right, u = frame.up, b = frame.back, L = frame.L;
+      const dotL = (a) => a[0] * L[0] + a[1] * L[1] + a[2] * L[2];
+      arena.matrix.set(s * r[0], s * r[1], s * r[2], -s * dotL(r), s * u[0], s * u[1], s * u[2], -s * dotL(u), s * b[0], s * b[1], s * b[2], -s * dotL(b), 0, 0, 0, 1);
+      arena.matrixWorldNeedsUpdate = true;
+    } else arena.visible = false;
     // THE CUTS' device on her cut: her normals, then a flat gold matte, then her own picture
@@ -1104,6 +1111,6 @@ export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}
     project(R);
-    box.visible = Boolean(boxOut); heaven.visible = Boolean(boxOut); arena.visible = false; beam.visible = false; flood.visible = false;
+    box.visible = Boolean(boxOut); heaven.visible = Boolean(boxOut); arena.visible = false; athenaSpot.visible = false; beam.visible = false; flood.visible = false;
     if (boxOut) (s.end ? drawEnd : drawBox)(t, s, v, R);
     const her = athenaOn && drawAthena(t, R);
-    if (!boxOut && !her) { arena.visible = false; flood.visible = false; clear(); lastPose = `${v.yaw},${v.pitch},${v.radius}`; return; }
+    if (!boxOut && !her) { arena.visible = false; athenaSpot.visible = false; flood.visible = false; clear(); lastPose = `${v.yaw},${v.pitch},${v.radius}`; return; }
     sparkUniforms.uT.value = t;
```

## MOUNTED (Oct 14 2026 18:1x WEST; the box seat's yes): hero-ab.html and unboxing.js carry it on main

The box seat (local_b6eebded) agreed this lane lands its own lines and stayed off both files. Its constraints, met:
- her five planes are in her shader (herClip: onBeforeCompile and a uniform, as floorClip; three's clipping stays off), set before her three
  looks are compiled and primed at load. The page proof caught a first cut that failed to compile: MeshNormalMaterial's fragment has no
  #include <common>, so the declarations go just before main();
- the canvas wakes 0.5 s before each of her shots (presenceOf covers her face shot);
- her portal sits under everything in the stage;
- the record's flood is out: her wall of light closes the scene, under the theater's burst.

**Receipts, headless Chrome on the new Mac, 18:0x to 18:1x WEST:**
- **The page as main has it** (cubism.proof.mjs --passes before --play): playing 29.4 to 37.8 s, her portal drew 235 times at 0.105 ms and
  the box's canvas 266 times with her (0.30 ms script, 0.23 ms GPU, medians). Paused: 0 draws, no callback. No page error. The join is the
  same as with three's clipping (26.3/31 px at 29.8 s, 1/2 at 31.0, 38.8/35 at 33.0).
- **The box seat's load receipt** (unboxing.proof.mjs --load --seconds 40), the film playing to 40.65 s:
  - warm: 0 long tasks; frame gaps over 25 ms at 43, 122 and 272 ms (the longest 40 ms); 2,430 frames.
  - every shader cold, two runs: 1 or 2 long tasks (53 ms; 74 + 62 ms); frame gaps in the first 0.3 s, during the box's own priming of looks
    at 3.6 to 4.9 s (28 to 75 ms), and one at her portal's opening (27 and 31 ms at 29.76 to 29.94 s).
  - A video prime before the opening did not remove that gap, and was taken back out.
- Lysa and WebKit are unmeasured.
- **Closed on main at 5f7b536c** (the box seat, Oct 14 2026 18:2x WEST): the cold long tasks were a race in the box's priming, not her cut. A prime()
  from the models' warm() pass listed every look, hers included, before their programs were ready, and compiled them on the main thread. Now
  prime() takes only looks compiled in parallel and awaited, and her three looks are compiled by compileAsync, one after another. Its receipt on
  the new Mac, --load --seconds 40 with every shader cold, two runs: 0 long tasks, her looks ready in 84 to 107 ms, her cut's normals and matte
  still drawn, no page error. Her portal's 27 to 31 ms at its opening (29.76 s) was not re-read there.
- **Her last shot runs through the flood to its cut** (18:3x WEST, asked by the fields lane, b2bd9522): SHOTS' third shot is now frames 1096 to
  1140, the column and the flood (37.204 to 38.071 s: the same camera over her shoulder, "all light but her hair"). She is on the page for the
  whole wall of light (37.132 to 37.6 s) that closes her window, and goes on the film's cut at 38.071 s. It is one presence, so the cut's device
  does not fire at the light's change. FIT3, fitted on the column's frames, carries her through the flood. unboxing.js is unchanged: it reads
  presenceOf and herAt. Tests 14/14 on the new Mac (99 ms).

## THE FOLD (his 18:47 WEST; geometry here, the box seat mounts it)

His words, verbatim: "AS SOON AS ATHENA FUCKING APPEARS SHE BREACHES THE FABRIC OF SPACETIME (it simply means, the dodecahedron faces
dissolve into 1 single window into reality"; "THE DODECAHEDRON IS VISUALLY SEEN TO BE SHRINKING AND FOLLOWING THE BATTLE (USE "THE MASK"
typa movement here please come on"; and 18:4x: "of coruse, the fucking face that we start from means all the other faces are folded onto the
main plane... you get what i mean?". His disc portal (cubism-window.js) is superseded: it retires once the fold is on the hero.

cubism.mjs, pure, tests 16/16 on the new Mac:
- **foldTree(pents, root)**: rooted at the face she joins. Its rings hold 1, 5, 5 and 1 faces, and every hinge turns 63.435 deg. Of the 160
  choices of parents, it takes the most compact net that does not overlap itself (reach 5.63 face radii at the opening pose).
- **foldPose(pents, tree, ks)**: each face's 4x4 at its fold amount.
- **foldAt(tree, t)**: her neighbours unfold from her cut (29.563 s), a ring every 0.17 s, 0.3 s each, flat at 30.2 s.
- **pictureOf(rootFace, p, {join, z})** and **netDecal(pents, tree, zoom)**: the one picture laid in her face's plane, zoomed z times about
  her hair's join (joinOnFace). **coverZoom** is the zoom that fills the whole net.

The proof (cubism.storyboard.mjs --fold 29.8, the new Mac; on his Storyboard canvas, seq 283920, y 9620), with her hair's join at
u 1.34, v 0.66 of her face's picture:
- at her face's own scale (z 1), her hair meets the drawn hair exactly and the fight stays in view, but the net's far faces lie beyond the
  picture's edge;
- zoomed to fill the net (z 9.6), every face is filled with her hair blown up, and the fight leaves the window.

The scale is his question; z 1 keeps the join and lets the mask shrink onto the fight inside the picture.

## FOLDED IN, ONE PLANE (his 19:0x WEST; this replaces the outward net as the default)

His words, verbatim: "dude you fot this all wrong... i said time and time again... UNTIL THE FUCKING WALL OF LIGHT, THE DODECAHEDRON
DISAPPEARS, IT IS FOLDED UNTO 1 SINGLE PLANE WHICH IS THE FUCKING PLANE FROM WHICH ATHENA IS ALIGNED TO".

cubism.mjs, tests 18/18 on the new Mac:
- **The fold, 'in' by default**: every face turns about its hinge by 116.565 deg (the dihedral closed) until it lies ON its parent. So
  folded, all eleven lie on her face: within 1e-6 of its plane and inside its outline, tested for four starting faces. The far side folds
  first (the face opposite hers, then the second ring, then her neighbours), from her cut, done at 30.2 s: the solid visibly shrinks into
  her one face. The functions are foldAngle, fold(pents, root, t, dir), foldPose and foldAt with dir. 'out', the outward net, stays the
  second candidate.
- **The faces as windows**: while folding, each face shows the picture where the eye's ray through it meets her plane (pictureAtRay; the
  same in CUBIST_PLANE_GLSL herPictureUV). The picture holds and the faces move over it, so they land without a seam.
- **The one plane's window**: herPlane, planeWindowGeometry and planeWindowAt. The window opens from her hair's join IN her plane, a face's
  radius in its first 0.1 s from 29.763 s, then grows to the stage's reach by 37.1 s while the picture's zoom about the join goes 1 to
  zFull (8 at most). From Aiolos (37.132 s) the wall of light runs out from her and leaves white behind it, closed at 37.6 s.
  planeUniforms(plane, geom, t) gives a shader its uniforms; CUBIST_PLANE_GLSL has herPictureUV, herWindow and herInPicture.
- No window chases the fighters: the battle is what the window shows.

## ONE PLANE, THE LIGHT, THE ORIGAMI (his 19:1x WEST; this lane's geometry and light, the box seat wires them)

His words, verbatim (relayed): "also the fucking lightining dude come on... you have the chance to turn the entire background black there...
make it fucking immersive... she has fucking tore through space and time dude... we saw her fold the dodechadron lik a fukin origami". The
coordinator's asks: one plane from her cut to the wall of light, with no new face and no refit that jumps her (at 35.5 s she stood at the lower
left beside the box); the page black from the fold to the wall of light and her looks in the film's light; the fold onto her face, as origami.

cubism.mjs, tests 20/20 on the new Mac (170 ms):
- **One plane**: `herAt(t, faces, spin, keep, FITS, {onePlane: true})` picks her face at her first draw (chooseFace, as before) and holds
  it, the sphere's pose (`on.spin`) and one pose on it (the shoulder shot's fit) to the end of her presence: nothing refits her, nothing
  moves her. The fold, her plane and her window take `on.spin` too, whatever the page's sphere does. Without the option, herAt is as before.
- **Her face shot (33.567 to 36.570 s) hides her** (`faceShot: 'kept'` keeps her). In the frames, kept, a second her from behind stands at
  the stage's right edge beside her own face in the window, joined to nothing and washed out by the shot's bright light (2.1x). Hidden, the
  window shows her face alone, and she comes back at the column on the same plane and pose. A page that seeks into the face shot first picks
  her plane at the column.
- **The window's zoom** (`planeWindowGeometry(..., {cover})`): 'above' (now the default) is the least zoom at which the picture covers the
  stage above her hair's join and to its left, 3.06 at the frames' pose. The first rule, now 'stage', made the picture cover the whole height
  below the join too. Her join sits low in the picture (v 0.66), so that ran to the cap of 8, and through her face shot the window showed a
  blur of hair and sky. At 3.06 the fight (33.3 s) and her face (34 to 36 s) stay readable, and her body stands below the picture in the black.
  The geometry also gives `at`, the join on the stage (876, 522 px at a 1205 x 900 stage).
- **The film's light**, measured by cubism.light.mjs (the new Mac, 255 frames, 6 s) and carried as FILM_LIGHT, in 42 bins of 6 frames:
  - over her shoulder, her drawn hair at 0.6 to 0.95 of her glb hair's own colour, with a teal shadow and no gold;
  - in her face shot she is lit bright, to 2.4x, with gold glints in its last second;
  - from the column (36.570 s) dark navy, 0.07 to 0.3, with a pale gold (linear 0.41, 0.37, 0.19) on 0.7 to 0.9 % of her hair;
  - the flood lifts the shadow to 0.2 to 0.58.

  The bins' spread over their frames is 0.3 to 3 of 255 over her shoulder, and up to 45 in the column, where the beam moves on her hair.
  `filmLightAt(t)` turns it into a light that carries to all of her. A per-channel ratio of the drawn hair over hers was tried first: it
  turned her skin green and her dress cyan in the column, because the two palettes differ in hue, not only in light. So the light is:
  - her luminance mapped so her hair's own 20th and 90th percentile land on the drawn hair's;
  - her hair-coloured parts (`toneShareOf`, by the albedo's chroma against HER_HAIR_CHROMA) in the drawn hair's tone, while her skin and
    the white of her dress keep their own colour, only darker or lighter;
  - a form term (the page's key, 0.3) so her shape still reads;
  - the gold at her edge, a band in |n.v| as wide as the square root of the gold's share.

  `HER_LIGHT_GLSL` and `herLight(shader, uniforms)` patch her lit look (MeshStandardMaterial) just before `<opaque_fragment>`, to be
  compiled at load with uHerFilm 0. Her normals and gold matte looks are left as they are. `herLightUniforms(t)` gives the eight uniforms.
- **The origami**: unchanged geometry (fold 'in', far side first, flat at 30.2 s). The storyboard draws each face catching the page's light
  by its tilt while it turns, and gold edges until it is flat: the far side moves behind her face from 29.6 s, then her neighbours swing
  onto it from 29.9 to 30.2 s, and the dodecahedron is gone.
- **Costs** (the new Mac, median of 7 x 20,000 calls): herAt one plane 1.18 us, herLightUniforms 0.25 us, fold 2.3 us, planeUniforms 0.03 us
  a draw. The light is a few dozen ALU operations a fragment of hers only. Nothing at rest. The page's black is the box seat's.

The frames (cubism.storyboard.mjs --plane, the new Mac, about 1 s each; they hold film frames, not in git) are on his Storyboard canvas, seq
284958, from y 12600: the origami (8 frames), her shots on one plane to the wall of light (6), her face shot hidden and kept (4), a note.

Not done here: lysa and WebKit (nothing is wired yet); the page's own pictures wait for the box seat's lines. The gold edge follows the
film's measured share and is thin (|n.v| < 0.09). The film's gold in the column lies across her strands more than on her outline, so a gold
key from the beam's side is the next candidate if he wants more of it.

## THE FOLD AS HE GAVE IT, ON THE PAGE (his 19:19 WEST; lane/the-fold, Oct 14 2026 20:xx WEST)

His final word: "why the fuck are you trying to brusteforce into place a 3D model when you can interpolate the dodecahedron chosen destination
plane for all faces to be folded in that plain hexagomnally... you get me? its come and go from plane to back again into sphere when wall of
lights hits again". The hinged fold above ('in', the origami's geometry) is struck by it and is off the page; hexCells, hexAt and hexFold are
THE FOLD, mounted in unboxing.js with her one plane and the film's light on her. The page, its proof on the new Mac and its receipt:
LANDING-THE-FOLD.md beside this file.

## Continuity correction · 15 October 2026

His correction: “it loses its all fucking realism ... check the claude traces where we analyzed the scene already”.
The Oct 15 `film-guided-athena.js` arena is withdrawn from the default hero. It remains an explicitly opt-in study
(`createUnboxing({nativeStudy: true})`), unloaded by the public page. Its cameras, rocks, actor scale and motion were authored
without matching the film. A working GLB and a continuous clock did not make it a continuous shot.

Re-read source: Claude session `5a94585a-53e8-4b34-9c53-fdb3f5fcd68d`, 14 October, relay turns at 15:38Z, 16:00Z,
16:19Z, 16:26Z and 18:45Z; the source images and measurements in this file, `FIELDS.md`, and `LANDING-THE-FOLD.md`.
The later one-plane direction supersedes the earlier box-sizing proposals. No new stage is implied by it.

The continuation must satisfy these together:

- At 29.563–33.567 s, Athena's head/hair occupies the near right foreground; Dolbar holding Seiya remains below-left.
  Preserve that depth, screen-space scale, lens and pose. The model must join the drawn silhouette at the moving boundary.
- Hair follows the measured screen-space flow (`fields-film.mjs` / `FIELDS.md`), with the source's light (`herLightUniforms`).
  The column shot changes the hair to navy with pale gold streaks. White/pink model lighting cannot stand in for it.
- The same plane opens from the hair join. Window zoom, native projection and occlusion must agree throughout growth.
  The close-up must not acquire a second Athena seen from behind.
- Aiolos's wall of light at 37.132 s closes the scene and returns to the sphere by 38.071 s. The page title remains on paper;
  darkness belongs to the hero alone. Sound toggles never seek the film.

Live inspection of the old `?her=on` fit at 31.2 s still showed a second head above-right of the drawn head and a long static
hair silhouette across the window. It therefore remains off by default too. Restoring the source picture repairs the disruptive
cut; it does **not** complete the requested native 3D continuation. Native projection/rig and the growing-window occlusion are
still owed. The measured data above are the basis, not evidence that the existing fit already meets the requirement.

Cost of this correction: the default page no longer loads the study or allocates its 1280×720 half-float/depth render target
(approximately 10.5 MiB), and removes its extra scene pass and 8.4k triangles. The existing film texture/window is reused.


## Three source layers · 15 October 2026, screenshot correction

His correction: “isolate in separate layers: athena and her hair; bottom terrain; couple fighting”.

The shoulder and column shots now have three independently inspectable meshes: `athena-hair`, `terrain`,
and `fighters`. They share the decoded film texture and its clock. `athena-layers.build.py` builds a compact
RGB mask atlas at every frame of those two shots (151 frames); the source remains at its original resolution.
Masks partition each pixel exactly, and premultiplied additive composition preserves the source without dark
seams. The close-up belongs to Athena alone. The lab’s “Shot layers” menu isolates each mesh; this menu does
not enter the public journey. Runtime cost: two extra draws and one approximately 0.6 MB mask download;
no runtime segmentation, second video, extra render target or animation loop.

The doubled picture had two causes. The fold crossfaded repeated whole-film faces into the single projected
picture; it now uses that single projection from the source cut. Also `hero-front`, although intended for
foreground orbits, retained a complete video-covered sphere when orbit-kick was hushed. Both old canvases
are hidden only after the replacement renderer has painted, and restored on handback. Fold leading is subdued
so it no longer cuts heavy gold bars through the shot.

The native continuation (`athena-continuation.mjs`) uses the measured cranium, source camera and hair field.
It is clipped outside the source-picture bounds, never painted over the source head, and hidden at the face
close-up. It shares the moving window projection and source lighting. This supersedes the disabled older
native fit described above; the invented arena remains disabled.

Limits: these are assisted colour/region mattes, not manually rotoscoped production mattes. The distant pair
uses a traced envelope; fine edge pixels and the gold crossing light can still need hand cleanup. The terrain
layer contains observed source pixels only; it does not invent the surfaces hidden behind Athena. This is
layer separation and a measured native continuation, not a recovered volumetric set.

Validation: all 151 matte partitions sum to 255 at every pixel; source-frame addressing includes backwards
scrubs and both cuts. Run `node --test app/dl-twelve.test.mjs lab/athena-continuation.test.mjs lab/athena-layers.test.mjs`
from this directory’s parent. Served-page sound continuity is checked by `app/dl-twelve.proof.mjs --tap button`
and `--tap sphere`: trusted taps, Range seeking, four seconds of playback with no restart.
