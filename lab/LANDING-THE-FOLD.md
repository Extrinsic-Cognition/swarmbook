# THE FOLD, his final spec, on the hero (lane `lane/the-fold`, Oct 14 2026, 20:15 to 21:0x WEST)

## The cost first

- **Before** (main 7269fc20, `hero-ab.html?v=film`, his span 29.563 to 38.071 s): the box canvas drew Athena alone (her 3D figure refitted
  shot by shot) on the film's frames, plus her disc portal on a canvas of its own (cubism-window.js, not counted below). Measured on the new
  Mac in the proof's window over the span (29.3 to 38.4 s): **319 box draws (34.7 a second), JS 0.40 ms median a draw (p95 0.60), GPU
  0.52 ms median (p95 3.39)**; at rest (the page's Pause) 0 draws.
- **Predicted** for the fold: the same causes (the film's frames, the screen's while the faces fly), the box canvas over the whole stage
  (about 2.6 M device pixels, PX_CAP), twelve faces of 15 triangles, one full-canvas quad for her plane's window (one ray-plane test a
  fragment), her 3D figure; per draw a few microseconds of JS more (hexFold's twelve poses, foldSpin, herAt one plane 1.2 us,
  herLightUniforms 0.25 us), about 0.3 to 0.6 ms of GPU more for the whole-stage canvas; hexCells once at her cut (tens of microseconds);
  nothing at rest; the disc portal's canvas gone.
- **Measured** (the new Mac, Chrome for Testing headless, ANGLE Metal, M5 Max, load 6 to 7 of 18 cores, the lane's proof script on both
  trees): **331 box draws over the span (36.0 a second: 255 on the film's frames, 75 on the screen's while the faces come and go, 1 the
  hand-over), JS 0.60 ms median a draw (p95 0.80), GPU 0.98 ms median (p95 3.22)** on a 1866 x 1394 canvas; 0 draws at rest; the box's own
  hand-overs unchanged (1.49 and 1.17 / 255 at 42.34 and 71.67 s, main 1.48 and 1.19). The long frames over 84 s of play: below.

## His words (WEST, verbatim, in order; the spec)

- 18:47:06 "this is all fucking wrong... whay the fuck did i say that happens to the dodecahedron here? i said: * AS SOON AS ATHENA FUCKING
  APPEARS SHE BREACHES THE FABRIC OF SPACETIME (it simply means, the dodecahedron faces dissolve into 1 single window into reality * THE
  DODECAHEDRON IS VISUALLY SEEN TO BE SHRINKING AND FOLLOWING THE BATTLE (USE "THE MASK" typa movement here please come on"
- 19:03:29 "dude you fot this all wrong... i said time and time again... UNTIL THE FUCKING WALL OF LIGHT, THE DODECAHEDRON DISAPPEARS, IT IS
  FOLDED UNTO 1 SINGLE PLANE WHICH IS THE FUCKING PLANE FROM WHICH ATHENA IS ALIGNED TO" (this struck the window that chased the fight)
- 19:11:01 "also the fucking lightining dude come on... you have the chance to turn the entire background black there... make it fucking
  immersive... she has fucking tore through space and time dude... we saw her fold the dodechadron lik a fukin origami"
- 19:19:14, the final word: "why the fuck are you trying to brusteforce into place a 3D model when you can interpolate the dodecahedron chosen
  destination plane for all faces to be folded in that plain hexagomnally... you get me? its come and go from plane to back again into sphere
  when wall of lights hits again"
- 19:34:43, to the box seat over its first pictures of the fold (in its transcript, after the hero's hypertrace was written): "why would you use
  this angle? the dodecahedron has 12 faces dude omg..."

## What stood, and what this lane did with it

- **Merged, not checked out** (both branches are held by other worktrees): the Athena seat's `claude/athena-cubism-0a5d15` (07444b4d one plane,
  a930a5e5 and 94bf9905 the film's light measured, fffbbc42 the light on all of her, 9f23b49d her face shot hidden and the origami storyboard)
  and the box seat's `claude/hero-unboxing-75699d` (18f48629 "WIP: THE FOLD": the box at her cut, the faces as windows onto her plane's
  picture, her plane's window, the page's dark layer, foldBeat, the square turn after his 19:34 words).
- **The Athena seat's uncommitted edits** (its worktree distracted-jepsen-3998ac, files of 19:40 to 19:44, read there, never committed there):
  hexCells, hexAt, hexFold and their test in cubism.mjs and cubism.test.mjs, and its CUBISM.md section, applied as they stood (f506fee8).
- **Kept from main**: the one plane's window (herPlane, planeWindowGeometry, planeWindowAt, planeUniforms, CUBIST_PLANE_GLSL: the window opens
  from her hair's join at 29.763 s, grows to the stage by 37.1 s, the wall of light from Aiolos), the one picture zoomed about her hair's join,
  her shots and her presence to 38.071 s, and d6247476's timing (the faces back into the sphere from the wall, whole by 38.071 s).
- **Dropped, as his words struck them**: the hinged fold onto her face (foldTree, fold 'in', the outward net 'out' and `?fold=out`, the trees
  grown at load) is gone from the page (its code stays in cubism.mjs for its tests and record, marked struck); her refit per shot (in the fold
  she has one placement, the shoulder shot's fit, turning with the box); the disc portal stays retired; no window chases the fight. The box
  seat's scene rim light and `lightFor` are dropped too: under herLight (the film's measured light) they lit nothing of hers and added a light
  to every lit look's program.

## What the page does now, in The film view (`hero-ab.html?v=film`)

- **29.563 s, her cut**: the box takes the page's sphere's place at the page's own pose, in the page's own frame (the hush), and her face (the
  face she is aligned to, chooseFace) is chosen once; so are the faces' cells: `hexCells`, her face the centre cell and the other eleven in
  the two hexagonal rings round it by the exact least-travel assignment (computed once, never searched again; no two pentagons meet).
- **29.563 to 30.2 s, the origami**: every face interpolates from its place on the sphere to its cell (`hexFold`: its centre on a straight line,
  one turn about one axis, the nearest first, all landed by 30.2 s), its gold leading the fold's edges, its picture turning from the page's
  own (the film on each face) into a window onto the one picture in her plane (THE MASK's look); the box turns her face square to the eye as
  they come (his 19:34 words; `foldSpin`), and she turns with it; the page goes black.
- **30.2 to 37.132 s, no dodecahedron**: the twelve lie flat in her plane, square to the eye, windows onto one picture; her plane's window
  opens from her hair's join behind them and the face shader dissolves their leading where it has reached, so they become one window into
  the film; the whole page is black edge to edge (the dark layer over the page and its sphere, and the page's near rings and worlds on the front
  canvas go with it); she keeps one plane and one placement, hidden in her face shot (the window shows her own face there), and is lit by the
  film's own measured light (cubism.mjs herLight on her lit looks, compiled at load).
- **37.132 to 38.071 s, the go**: her wall of light runs out white from her hair's join over the window and the faces, the page's white comes
  back by 37.6 s, and every face interpolates back from its cell into the sphere (the nearest first) while the box turns back to the page's own
  pose of that frame, the faces taking the page's own look again; whole at 38.071 s, where the page's sphere takes over (nothing jumps: the
  plan's test samples every 5 ms).
- A paused film inside the plane costs no box draw for the page's own turn (the box reads the page's pose only on the way back; by the code,
  unboxing.js skin(), not measured).
- `?fold=off` leaves her span as main has it (her per-shot fit, no fold), for comparison only.

## The proof (headless on the new Mac, no window anywhere, no Nest: the page's tag read was refused and it played on his rev-1 tags)

Pictures of the whole viewport at 29.5, 30.2, 33.0, 36.0, 37.1, 37.6 and 38.1 s (`unboxing.proof.mjs --viewport --pictures-only --at ...`;
they hold the film's frames, so they are not in git):
- 29.5 s: the page's own sphere on white, before her cut.
- 30.2 s: the twelve landed in the hexagonal lattice, square to the eye, gold leading, black page; her face's cell shows the film where her
  drawn hair meets her 3D hair, her 3D figure in front.
- 33.0 s: her plane's window grown from her hair's join over the battle (Dolbar on the cliff), the faces' leading dissolved inside it, the
  outer frames still gold on black.
- 36.0 s: her face shot: the window shows her face; her 3D figure hidden; black round it.
- 37.1 s: the column: the window over the film's column, her figure back in the film's light (her hair the column's dark navy).
- 37.6 s: the wall of light: the white back, the faces flying home through the theater's burst.
- 38.1 s: the page's own sphere, whole, the film on its faces.

And between them (`--at 29.65,29.8,29.95,34.5,37.3,37.45,37.75,37.95`): at 29.65 s the box still the page's sphere, the leading coming in
and her cut's normals pass (THE CUTS' device); at 29.8 and 29.95 s the faces in flight with their gold edges, the nearest landed, the page
going grey then dark; at 34.5 s her face shot in the window over the black, the outer leading not yet reached; at 37.3 and 37.45 s her wall
of light a white disc running out from her hair's join, the faces lifting off the plane white inside it, the page lightening; at 37.75 and
37.95 s the dodecahedron forming again at the centre through the theater's burst (its planes are the thin-edged ones), the last faces
flying in.

The pictures sat in this seat's scratchpad and in its folder on the new Mac (removed at the end); they are made again with
`node embertide-app/ui/intro/dyson-society/lab/unboxing.proof.mjs --out <dir> --nest http://127.0.0.1:9 --viewport --pictures-only --at
29.5,30.2,33.0,36.0,37.1,37.6,38.1` (about 20 s on the new Mac; never on the serving Mac), the receipt with `--no-pictures` (70 s) and
`--load --seconds 84` (and `--cold`), each under `nice -n 19` and `tools/dead-tasks/bounded.mjs`.

The receipt (the proof's play windows, the lane against main with the same proof script; `unboxing.proof.mjs --no-pictures`):

| window (film s) | main 7269fc20 | lane/the-fold |
|---|---|---|
| Athena over her shoulder (27.5 to 31.9) | 81 draws, JS 0.40 / 0.70 ms, GPU 0.49 / 1.97 ms | 91 draws, JS 0.70 / 1.10 ms, GPU 0.93 / 2.11 ms |
| THE FOLD (29.3 to 38.4) | 319 draws, JS 0.40 / 0.60 ms, GPU 0.52 / 3.39 ms | 331 draws, JS 0.60 / 0.80 ms, GPU 0.98 / 3.22 ms |
| the column, the flood, the second burst (36.4 to 42.3) | 95 draws, JS 0.40 / 0.60, GPU 1.39 / 4.73 | 94 draws, JS 0.60 / 0.80, GPU 1.23 / 5.35 |
| at rest (the page's Pause, 25 and 55 s) | 0 / 0 / 0 | 0 / 0 / 0 |

(medians / p95 a draw; GPU by EXT_disjoint_timer_query_webgl2, whose floor on ANGLE Metal is about 0.2 ms.)

The long frames over 84 s of play (the lab's LANDING.md method: `--load --seconds 84`, the film playing from the first byte through every
moment, every frame's callback timed, long tasks and long animation frames observed; the same Mac, the same hour):

| 84 s from the first byte | main 7269fc20 | lane/the-fold |
|---|---|---|
| warm: long tasks over 50 ms | 0 | 0 |
| warm: frame gaps over 25 / 34 / 50 ms | 2 / 0 / 0, the longest 26 ms (32 ms; 29.84 s, her cut) | 3 / 1 / 0, the longest 36 ms (35 ms and 166 ms, the page's own first frames; 3.97 s, between two of the box's primed looks at load; 38.38 s of page time, the film about 38.0 to 38.3 s, at the hand-back) |
| frames | 5072 | 5071 |
| every shader cold (`--cold`): long tasks; gaps over 25 / 34 / 50 ms | not run | 0; 4 / 0 / 0, the longest 29 ms (the page's first 0.2 s, 15.1 s, and 26 ms at her cut, 29.89 s) |

So her span ran with no long task; one 27 ms frame (one missed at 60 Hz) at the end of the go or the hand-back to the page's sphere, where main
has none (main's one, 26 ms, is at her cut); the lane's 36 ms is at load, 26 s before her cut.

## Tests

`node --test` over the lab's twelve suites: 156 of 156 on this Mac at nice 19 (4.3 s at load 15; 5.9 s from the house root at load 40). The fold's own:
- cubism.test.mjs: THE FOLD as he gave it at 19:19 WEST (the Athena seat's: the lattice, flat in her plane at its cell from 30.2 s to the
  wall, turned like her face, no two meeting, no swap travels less, nearest first, home by 38.071 s); THE FOLD on the page (this lane's: on the
  sphere at her cut and once whole; landed and square to the eye every point of every face reads the one picture in her plane where it lies,
  as the face shader does: twelve cells, twelve places in one picture, no copies).
- unboxing-plan.test.mjs: out from her cut to her last; the faces from the page's look into windows and back; nothing jumps from her cut to
  her last, the hand-over and the hand-back included (every 5 ms); black edge to edge as they land and white under the wall; the screen's
  frames only while the faces come and go; the turn square to the eye, held, and back to the page's own pose, the short way round.

## Files another seat committed to in the hour before this lane

unboxing.js and hero-ab.html (the box seat's 18f48629, 19:29 WEST) and cubism.mjs (the Athena seat's 9f23b49d, 19:35, and its uncommitted
edits): that work is what this lane merged by its brief. hero-ab.html is also the dolbar lane's (beside this one): this lane's own change to it
past the box seat's WIP is the header paragraph, the `HEX` import, `foldOf` (no `dir`) and one line in `darken` (the front canvas's opacity).

## Not done, said plainly

- lysa and WebKit (his Harmony window) are unmeasured; the GPU cost is the M5 Max's.
- The KO edge (ko-edge.js, his landed red borders while Dolbar holds Seiya, 15:3x WEST) stays over the black: by its own design it steps down to
  0.55 at her cut (29.563 s) and is gone at the beam's first frame (36.570 s), so from 30.2 to 36.57 s the black page has a dark red rim (the
  pictures at 30.2, 33.0 and 36.0 s). The page under it is black edge to edge. Whether the KO edge goes quiet in the fold is his call.
- At 30.2 s most of the lattice's cells are empty gold frames on black: the film's picture, zoomed about her hair's join, covers only her
  cell and slivers of its neighbours until her window grows (her hair stands at the picture's right edge, so cells right of her are never
  in the picture; her figure covers most of them). A picture zoomed to fill the lattice would break the join of her hair with the drawn hair.
- cubism.storyboard.mjs still draws the struck hinged fold as origami (its frames on his canvas are the Athena seat's); not redrawn.
- The hand-back at 38.071 s is proved by the plan (every quantity at the page's own value, the turn at the page's own pose), not by a pixel
  difference: her figure is on the page in that frame, so a box-off picture is not the same scene.

## The wishes it touches (rule 6; lines for the wishes doc)

- "Dyson Society mint page and $WARM mint" (the mint's hero, optimism.fit's film): Oct 14 2026 20:15 to 21:0x WEST, house `lane/the-fold`, THE
  FOLD on the hero as he gave it at 19:19 WEST (the faces into a hexagonal lattice in her plane by 30.2 s, black edge to edge, the film's light
  on her, back into the sphere whole by 38.071 s), the two interrupted seats' WIP merged; proved headless on the new Mac (7 pictures, 331
  draws over the span at 0.60 ms JS and 0.98 ms GPU median, 0 at rest); on the lab page only, not on optimism.fit (the deploy is his).
- His hero lineage (optimism-fit-hero-hypertrace-2026-10-14.md, the 29.563 to 38.071 row): state from "building" to "built on a lane, proved,
  not on main" until the lander merges it.
