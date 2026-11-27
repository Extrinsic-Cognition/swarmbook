# THE BRAINDANCE VIEWER: the record of the event drawn as what it is, and the module the hero places Athena through (Oct 14 2026, 15:3x to 16:0x WEST)

His words (Oct 14 2026 14:4x WEST): "start having spatial computing awareness of where the fight is happening... if you want to make a
cinematography replication you need to be able to correctly place athena from the height of where she is and all that dude"; "like imagine that
you are needing to make a 4DGS of the trajectory AKA BRAINDANCE of the event here... you get what i mean?"; "IT IS VECTORIAL SPACES AND NORMAL
DISTRIBUTIONS ALL THE WAY DOWN".

## The cost line

| what | measured (new Mac, Chrome for Testing 156 headless, ANGLE Metal on the M5 Max, load 10.4 to 11.1; house a91bcda3, the disc's fighters in) |
| --- | --- |
| Gaussians drawn | 2 to 4 at any second of the record (3 at 30.0 s: Athena, Seiya, Dolbar; 4 at 37.132 s with the column's base), one more in the free view (the shot's camera); each is a 1-sigma solid, a 2-sigma wire shell and its mean |
| triangles, draw calls | 5,250 and 11 (43.0 s, the pinnacle) to 11,714 and 20 (37.132 s, the column) on the shot; 12,682 and 24 in the free view at 37.132 s. Athena's glb is 3,234 of them, Seiya's 4,000 (3,828 in the Sagittarius Cloth), Ikki's 4,021 |
| ms a frame | median 1.3 to 1.7 ms, p95 1.9 to 3.7 ms, at 2880 x 1672 device px (1440 x 900 at dpr 2), 120 draws of one state, each read back by one pixel so the GPU's time is inside the number (before the fighters landed, with capsules: median 1.1 to 1.5, p95 1.9 to 3.0, house 4fcf4a2f) |
| bytes loaded | 19,076,185 B on the first load: the film 9,830,400 (Chrome's own preload of byte ranges; `?film=off` asks for its metadata only), the three fighters' glbs 6,225,932 (all three at load, whatever the second: a lazy load is the next cut), three.js 2,093,212 with GLTFLoader, OrbitControls and their two helpers 204,605, Athena's glb 660,836, the page 30,711, the record 12,761, the two modules 17,728 |
| at rest | 0 draws and 0 requestAnimationFrame in 3 s with nothing pressed, and 0 and 0 in the 3 s after a pause; 88 draws in 3 s of the film playing (one a film frame, 29.97 fps) and still 0 rAF |

The page draws on cause only: a scrub, a film frame while it plays (`requestVideoFrameCallback`, held only while the film plays), a toggle, a
drag, a load, a resize. The torn still's move is one rAF chain for its 3.2 s, on a press. Nothing runs on this Mac: the pictures and numbers
were made on the new Mac by `braindance.proof.mjs` (the tree by `git archive`, run under `bounded.mjs`, its scratch folder removed after).

## The files

- `braindance-view.mjs`: pure functions over `braindance.json` (read by `braindance.mjs`), no three.js and no DOM, no number of its own.
  `sceneAt`, `placeAthena`, `cameraFor`, `pageFrame`, `athenaAt`, `engineAt`, `lookQuaternion`, `qmul`, `rotate`, `SPACES`. 11 tests in
  `braindance-view.test.mjs` (with `braindance.test.mjs`, 17 of 17 in 81 ms, nice 19); the camera's turn equals three.js's own `PerspectiveCamera.lookAt` for all 19 shots to 1e-9.
- `braindance.html`: the viewer (aiolos serves it at `/intro/dyson-society/lab/braindance.html`). `?t=30`, `?cam=shot|free`,
  `?space=cinematographic|establishing`, `?film=corner|side|off`, `?anchor=head|centre|feet`, `?still=1`, `?record=<a file beside it>`.
  The ground as a metre grid with a 10 m grid under it for the pinnacle; every place a Gaussian named with its mu and sigma; Athena's glb at
  `placeAthena`; the fighters as capsules of the record's heights (Seiya 1.65, Dolbar 1.9, Ikki 1.75 m), or `seiya.hades.glb`,
  `seiya-sagittarius.hades.glb` (from his conversion tag, the record's dressing track at 61.767 s) and `ikki.hades.glb` (the fighters lane,
  main 003208f9: a HEAD at load finds them, never a wait; standing at mu in their stance, turned to their look, at the record's height over
  their extras.height 1.65); the column at `columnWidthAt` from its base to its top; the star, the sun and the cloth on their
  tracks; the camera on the shot or a free orbit (the shot's camera then drawn as a frustum and its own Gaussian); the film beside it at the same
  second; the scrub over `span(bd)` with his three tags read from the Nest (`mint/seiya-tags`; a copy of rev 1 when the Nest is not reached);
  `braindance.engine.json` drawn as points when the measured session lands one (it said the event is not stageable today).
- `braindance.proof.mjs`: the pictures and the numbers above (headless Chrome over CDP, its own door with byte ranges, every other request
  refused and listed: none was). `braindance-pictures/braindance.proof.json` is its receipt; the pictures are in `braindance-pictures/frames/`
  (a film frame or the game's figure in every one: the mirror's strip list drops `frames/` folders before GitHub).

## What the hero page imports

```js
import {placeAthena, cameraFor, sceneAt, pageFrame} from './braindance-view.mjs';
placeAthena(bd, t, {space = 'cinematographic', centre = [0, 0, 0], unit = 1, view = null, anchor = 'head', assetHeight})
  // -> {position, quaternion, scale, mu, sigma, axes, look, gaze: {yaw, pitch}, unit, view, space, pose, anchor} for athena.hades.glb,
  //    or null when she is on no track (before 24 s), or when view asks for the shot at t and none holds it
cameraFor(shot, {centre = [0, 0, 0], unit = 1, view = null})
  // -> {position, quaternion, fov}: a camera on one of the record's shots (shotAt(bd, t)), fov vertical in degrees
sceneAt(bd, t, {space, centre, unit, view})
  // -> {t, space, shot, items: [{name, kind, mu, sigma, look, pose, height, base?, top?, width?}], turn, up, unit, view}: everything at t, in the page
pageFrame(bd, t, {centre, unit, view})
  // -> {point(p), unit, turn, up, view}: how the arena's metres go into the page, the one map the three above use
```

Quaternions are `[x, y, z, w]` (three.js's `Quaternion.fromArray`), positions `[x, y, z]`. Two ways into a page:
- `{centre, unit}` (toPage's): the arena's axes kept, the fight's ground at `centre`, `unit` page units a metre.
- `{view: {eye = 4, shot}}` (or `view: true`), the hero seat's frame (its ask of 16:0x WEST: "the page's eye is the shot's camera, eye = 4,
  centre = the shot's look"): the arena turned so the shot's camera looks down the page's -z from `[0, 0, eye]` with no roll and its look
  point at the page's origin, scaled so that distance is `eye`: `unit = eye / |camera - look|` page units a metre (0.19991 at the over-the-
  shoulder shots, the record's 20.0 m). `shot` defaults to the shot at t. The same numbers as `athena-shot.mjs`'s `toView(p, frameOf(shot), eye)`:
  the worst difference over 7 points at 7 seconds of those shots, with the column's up and the unit, was 7.1e-15 (a one-off check against main's
  athena-shot.mjs at bd63d9a2; my tests check the frame by its own definition, so a change there cannot break them). In this frame a sigma's
  axes are the arena's turned by `axes` (`turn`), and `up` is the arena's up on the page (the column's axis).

How hero-ab.html places her: it loads `athena.hades.glb` with its GLTFLoader once, reads her height from the glb (`gltf.parser.json.extras.height`,
1.6) and keeps `gltf.scene` hidden; on each of its own causes (the film's frame callback, a seek) it calls `placeAthena(bd, t, {view: {eye: 4},
assetHeight})` (its page's eye 4 box radii from the dodecahedron's centre: the shot's camera stands at that eye and the shot's look at that
centre), and when the answer is not null sets `scene.position.fromArray(p.position)`, `scene.quaternion.fromArray(p.quaternion)`,
`scene.scale.setScalar(p.scale)` in box radii (with `eye: 4 * r` instead, r its radius, when its scene counts in its own units) and shows her
(null: hide her).
She then stands where the film's camera sees the record's mean, turned to the fight, the stance in her joints holding her head 24 degrees down
(`p.gaze.pitch`: the fight 37.5 degrees below her horizon at 30.0 s). At 30.0 s that mean stands at z 3.55 of the eye's 4, right in front of the
dodecahedron, as the hero seat found: until the record is mended (the mirror and the distance below), the hero's least move inside her sigma
(`athena-shot.mjs`, 0.61 sigma, (1.5, -1.0, -1.25) m) is what puts her where the film has her.
No number of its own: every place is the record's, and a better record moves her without a line of the hero changing. (`athena-shot.mjs` also
exports a `placeAthena(bd, t, page)`: the film's place fitted inside her sigma, over-the-shoulder shots only, her feet at mu plus the swing.
Import one under another name when both are wanted.)

## The replication, judged by eye against the film's own frames

The page at each second with the film's frame beside it at its native 960 x 540 (`frames/30.0-*`, `37.132-*`, `43.0-*`, `77.0-*`). The mp4
pillarboxes a 1.474:1 picture (columns 82 to 877) in its 16:9 frame; the record's fov of 40 degrees is read over the 540 rows.

Where it agrees:
- The fight lies below her and in front of her, seen down past her from behind and above at about 40 degrees, at mid-height of the frame
  (0.47 of it in the film, 0.5 in the render).
- With the top of her head at mu (`30.0-over-her-shoulder-head-at-mu.jpg`) the camera looks down on her hair as the film does, as the record's
  own test says ("the camera is behind and above her head"). With her feet at mu (`30.0-over-her-shoulder-feet-at-mu.jpg`) the camera stands at
  her chest and her body fills the frame's left half: that reading of mu does not agree, so `anchor` is `'head'` by default.
- At 37.132 s the column stands at the fighters, a fifth of the film's picture wide and a quarter of the render's. At 14.0 s Ikki stands
  between Seiya and Dolbar, as the record says (`14.0-ikki-takes-the-blast.jpg`; the film is a close-up of his face in the red light there,
  the record's camera a wider one).

Where it does not:
1. **The record is mirrored in x against the film.** At 30.0 s the film has her hair on the right third and Dolbar right of Seiya; the
   record's camera over her right shoulder (x 4.2 against her 3) puts her on the left, and Dolbar's x -2.5 puts him left of Seiya. At 43.0 s
   the film has the star at the upper left of the pinnacle; the pinnacle camera looks along +z, where +x is the frame's left, so the record's
   star (x -60) lands right of her. One flip of every x moves all three: the candidate `braindance.mirror-x.json` (every mu and look with x
   negated, served by the proof's door, never written to the lab) puts her on the right, Dolbar right of Seiya, the column left of her and the
   star upper left of her (`candidate-mirror-x-*.jpg`).
2. **The fight is about 2.7 times too far, or the lens too wide.** At 30.0 s the film's Dolbar is 163 of 540 rows tall (0.30) and Seiya 130
   (0.24), read by eye on the frame; the record's camera is 20.0 m from Dolbar with a 40 degree fov, which draws him 0.11 to 0.12 of the frame
   (seen 34 degrees from above). The film's size wants the camera about 7 m from him at 40 degrees, or a fov of about 15 degrees at 20 m; one frame cannot tell which (the floor's foreshortening over
   several frames would). The record's evidence text says "0.13 to 0.15 of the frame tall": at 30.0 s the frame says 0.30.
3. **The film does not look at the fight.** Its fighters stand at 0.30 of the picture's width, about 12 degrees left of the axis; the record's
   look is the fight itself, so the render has them in the middle. Her hair takes the right 35 % of the film's picture from its top; in the
   mirrored candidate she stands at 0.6 to 0.8 of the frame with her head at 0.42 of its height: the film's camera is nearer her and her head
   higher in its frame.
4. **At 77 s the film shows Seiya's face, the render his back** (`77.0-his-thanks.jpg`): the record's camera for his thanks stands at z -3
   and his pose says "looking up at her" (+z, where the glb faces with no look of his own), so the camera sees his wings. The record has no
   look for Seiya: either his look is the camera's side, or the camera stands on hers.
5. At 43.0 s her establishing place is a Gaussian of sigma 30, 40, 80 m: the frame can only say she is at the statue's top, at the frame's
   upper right; the record's look puts her in the middle.

These are the record's to mend (`braindance.json` is the measuring session's file, not this lane's): flip x (all of it, the camera list
included), bring the over-the-shoulder camera to about 7 m from the fight or its fov to about 15 degrees, and turn its look about 12 degrees
right of the fight; give Seiya a look at 76 to 81 s. The viewer takes the mended record without a change, and `?record=` shows any candidate beside the film first.

## The torn still (CUTS.md's device 4)

`?still=1`: the film's frame at 30.0 s, its black bars cut by a scan of one row, stood across the 30.0 s camera's axis at the depth of her
mean (2.21 m) and sized so that from that camera it covers its own place in the view; its edges torn by two octaves of value noise in the
fragment shader (a discard, no texture of its own). "Leave the still" runs the move: the first 0.4 backs out along her shoulder's line from
20 m to 30 m from what it looks at, so the frame becomes a torn card in space with her figure under it and her Gaussian around it
(`30.0-torn-still-leave-0.4.jpg`); the rest orbits the fight (the look, the distance, the height and the turn about it each going to the
record's two-shot camera, 19 to 28 s), the fighters in the frame the whole way, ending at chest height beside them.

## Prove it again

From a seat on the serving Mac (the run itself goes to the new Mac; nothing heavy here):

```bash
git -C ~/code-ec/house archive -o /tmp/bd.tar HEAD embertide-app/ui/intro/dyson-society/lab embertide-app/ui/intro/dyson-society/app/saint-seiya.mp4 embertide-app/ui/intro/room/procedural tools/dead-tasks/bounded.mjs
```

then `ssh builder@local-host "mkdir -p ~/code/bd && tar -x -C ~/code/bd" < /tmp/bd.tar`, run
`nice -n 10 node ~/code/bd/tools/dead-tasks/bounded.mjs 4m -- node ~/code/bd/embertide-app/ui/intro/dyson-society/lab/braindance.proof.mjs --out ~/code/bd/out`
there through `ssh ... 'bash -s'`, bring `out/` back by `tar` over ssh, and remove `~/code/bd` by its literal path. About 70 s of one Chrome.

## Not done, said plainly

- Athena is not on the hero page: `hero-ab.html` is the unboxing session's. The paragraph above is how it places her; nothing here edits it.
- The fighters stand still in their glbs' stance (clip 00's first key): no clip plays (the record names a pose in words, not a clip), and
  Dolbar, who is not on the disc, is a capsule of 1.9 m. All three fighters' glbs load at the page's load (6.2 MB) whatever the second.
  The generated cloth and Seiya of `unboxing-assets.json` (the asset lane's TRELLIS road) are the hero's box's, not the event's figures.
- No engine layer: `braindance.engine.json` does not exist (the measured session found the game not running on pelino and Saori no fighter).
  The reader (`engineAt`) is tolerant of the shape the measured session's note promised and is tested on an invented sample only.
- The record's mirror, its distance and its look are judged here and not mended: `braindance.json` is not this lane's.
- His tags in the proof are the page's copy of rev 1 (the proof's door has no Nest); on aiolos the page reads the Nest's live ref.
- lysa, WebKit (his Harmony window) and the phones are not measured; the numbers are the new Mac's M5 Max.
- The capsules, the shells and the labels are a lab's drawing, not the hero's look; the hero takes the places, not the drawing.
