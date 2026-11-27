# THE DEPTH AT THE DISPLAY'S RATE (Oct 27 2026, the receipt)

His words, Oct 27 2026 23:0x WET, over his screenshot of her on the Harmony window (Athena's sprite over unit0, the twelve on their wires, the purse at
$318.32): "can you please maximize the FPS until idk 140fps or something for her? like, optimize the code and make it parallax depth like i want this 2D
thing to become 3D-ish". By claude-0f7e9ef2, lane/her-depth-at-the-displays-rate.

## What she is, where she is painted

Her figure in his picture is the mint's layer (`dl-athena-layer.mjs`, the law `dl-athena.mjs`), mounted on the Mac's one overlay by the corner
(`room/one-corner.mjs`, the overlay's page `room/one.html` framed by the shell's panel): Athena's sprite (an `img`, the CSS float), the Poleis engine
(`lysa-engine.js` + `roma-engine.js`, the same bytes as the mint's and Harmony's) painting ROMA·0 in discussion at 150 css px (300 x 300 backing at dpr
2), and the purse painter sampling on each of the engine's pictures (`dl-athena-purse.mjs` over `room/lyssajudron-purse.mjs`).

## Before (measured, headless Chrome, this tree's main, `her-profile.scratch.mjs` in the seat's scratchpad)

| what | number |
| --- | --- |
| the cap on the engine (`figureOptions` fpsCap) | 30 pictures a second |
| pictures painted in 5 s at the cap, of 301 frames the browser gave | 151 |
| one picture of her (300 drawOnce in a row, 300 x 300) | 0.33 ms |
| the layer's busy time in 5 s at 30 (profiler, self time) | ~190 ms (3.8 % of a core), of it `getBoundingClientRect` 20 ms: the offscreen test, a layout read a frame |
| the display he looks at | the new Mac's built-in Liquid Retina XDR, 3456 x 2234, ProMotion: 120 Hz at most (140 is past this panel) |

So the engine was not the cost: the cap was the only thing holding her at 30, and WebKit's own default held every page of the shell near 60 whatever the
panel.

## What landed

1. **THE DISPLAY'S RATE, the page half.** `figureOptions`: `fpsCap: 0` (the engine paints on every frame the display gives) and `cullOffscreen: false`
   (the layer is `position: fixed` inside the viewport: the test was a layout read a frame for an answer that is always "seen"; the layer's own `veiled`
   keeps the page's hiding, her waiting and a modal's park). Harmony's corner (`harmony.html`, the rail's sky) keeps its own 30: not his ask, and a far
   bigger canvas; its pin in `dl-athena.test.mjs` is split from the layer's.
2. **THE DISPLAY'S RATE, the shell half** (`harmony-mac/native/Shell.swift` `preferTheDisplaysRate`). WebKit keeps a page's rendering updates near 60 a
   second by default (its feature `PreferPageRenderingUpdatesNear60FPSEnabled`, on), so no page in the shell's web views could pass 60 whatever the
   display. The overlay's and the Harmony window's configurations now turn that feature off, asked by name through the runtime (`_features`,
   `_setEnabled:forFeature:`) and skipped whole when WebKit has no such feature or setter: never a crash, never a guessed selector. Proven on this Mac
   (`wkrate.swift` in the seat's scratchpad, under the build's SDK 26.5): the feature read `true` before, `false` after. The shell's sources typecheck
   with the build's own file list (`build.sh` SOURCES + the iPad's shared files, SDK 26.5, `-target arm64-apple-macosx15.0`). The build itself is the
   lander's (THE ONE ROAD): it builds the shell from main after this landing and both Macs switch together.
3. **THE DEPTH** (`dl-athena.mjs` DEPTH, `lookOf`, `depthOf`, `lookStep`; `dl-athena-layer.mjs` `look`, `depthStep`): her figure is one body that is 3D
   already under one plane. THE BODY TURNS TOWARD HIS POINTER: the engine's camera yaws and pitches by the look (`lookYaw`, `lookPitch` on the instance,
   added in `cameraAt`, 0 unset: the same bytes paint every other glass as before), so the twelve behind unit0 slide against the twelve before it by the one
   projection that paints them. THE SPRITE SLIDES WITH THE POINTER, nearest, by the perch's `translate` (the compositor's: no paint of the sprite). The
   look is tanh of the pointer's pull from her centre over 420 px (soft to the edge, never a snap at a clamp), on a critically damped spring (omega 7)
   stepped on the engine's own picture, so at the display's rate while it moves; the last step lands on the target exactly and then nothing is written
   (the same key: the same picture). The tank (the purse's layers inside unit0) stays where unit0's centre is: a turn about the centre moves no centre.
   His pointer reaches her as it reaches the follow: the page's own `pointermove` on the mint and in the window; the shell's cursor through the corner on
   a Mac (`harmony-cursor` → `layer.look`), and his pointer on her body. A reader who asked for less motion keeps her still.

## After (measured, headless Chrome at 60 Hz, `dl-athena-depth.proof.mjs`, PASS)

| what | number |
| --- | --- |
| pictures painted in 3 s, of the frames the browser gave | 181 of 181 (every frame; on the Mac's panel, every one of 120) |
| one picture of her | 0.24 ms (300 x 300): 120 a second is 29 ms of a second, 3 % of a core |
| the purse sampled on the engine's paint | every picture (samples + kept = paints) |
| a look to her left and above, settled in 1.1 s | yaw +0.113 rad, pitch +0.067 rad, the sprite −2.1 px −1.5 px; 64 writes while it moved |
| a look to her right and below | yaw −0.113, pitch −0.067, the sprite +2.1 px +1.5 px; 63 writes |
| at rest with the pointer still, 1 s | 0 writes, 60 steps (the engine kept painting, the look stepped and stood) |
| the sprite's `img` | untouched: no transform, no translate (the perch moved) |
| requests off the loopback | 0 blocked, 3 refs read, 1 stream |

In the proof she follows the pointer (the layer's own spring), so the look is the small pull from beside it (0.24); on the Mac at rest she stands over
the ball with his cursor anywhere on the screen, so the look runs to its edge (0.48 rad of yaw, 9 px of slide) and back as he crosses her.

Tests: `dl-athena.test.mjs` (the law: tanh, the signs, the spring's settle and its one last exact step; the engine's `cameraAt`, the layer's and the
corner's lines), `dl-athena-layer.test.mjs` (a stand-in engine: look() writes nothing, the picture does; written while it moves, not on every picture;
nothing at rest; the pointer gone, straight ahead), `one-corner.test.mjs` (the shell's cursor and his pointer on her body are her look, a word is not,
a message from elsewhere is nothing): 104 of 104 in the suite around her (`dl-athena`, `dl-athena-layer`, `dl-athena-purse`, `one-corner`,
`one-shadows`, `laptop-overlay`, `lyssajudron`, `her-follow`).

## Cost

| | before | after |
| --- | --- | --- |
| her engine's pictures a second | 30 | the display's (120 on his panel) |
| CPU of her engine | 0.33 ms × 30 = 10 ms/s | 0.24 ms × 120 = 29 ms/s (3 % of a core) |
| layout reads a frame | 1 (`getBoundingClientRect`) | 0 |
| per picture, the depth | — | 2 tanh, 2 spring steps, 1 string compare; while it moves 2 numbers on the instance + 1 `translate` (compositor) |
| at rest | the engine's own paint (unchanged: she is shown, it paints) | the same, nothing of the depth written |
| in the ball | nothing | nothing |

What is not here: the mint page's film strike (the cap was measured there once, 85 fps with the cut figure); at 0.24 ms a picture it stays as it was.
The window's sky corner (`harmony.html`) keeps 30. The Mac app's 120 needs the lander's build of the shell (the one road), so until that build switches
in, her engine runs at the WebKit default 60: twice the 30 he had, and the depth works at 60 as at 120.

Pictures (the proof's, her corner at 2x): `a-rest.png`, `b-left.png`, `c-right.png` under the proof's `--out`.
