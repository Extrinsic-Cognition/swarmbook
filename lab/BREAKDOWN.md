# THE BREAKDOWN: his hero scene by scene, every layer a card in depth (Oct 15 2026, 01:0x to 02:1x WEST, lane/breakdown)

## His words

- **Oct 15 2026 ~01:00 WEST**, sending the behind-the-scenes of Guillaume Scoffier's After Effects opening for Shad Hottaboy's summer tour
  (x.com/Botan_cr/status/2109968257822412817; on top AE's 3D view from outside the shot, its 2D layers stood as flat cards spaced in depth on a
  cyan ground, the shot's camera a yellow frustum, the view swinging slowly round the cards; under it the finished shot from that camera):
  "can you please start outlining to me what we have scene by scene? is it possible for you to give me something like this or not?"

## What it is

`lab/breakdown.html` (lab page, outside the build, like `cuts.html` and `braindance.html`): his page taken apart, scene by scene.

- **TOP**: every layer the page draws at the scene's second, as a card at its depth, back to front in the page's own stacking, 7 cm apart in a
  world where the page's window is 1.44 m wide (a pixel a millimetre). Each card is as large as the page's camera sees it at its depth, so the
  yellow frustum (his eye, 1.3 m before the window, through the window's four corners) runs through every card's corners: from his eye the
  stack is the page. Each card carries its name and the file that draws it. The outside view swings round the stack, 35 degrees either way,
  once when a scene opens, and rests on its turn; a drag takes it over.
- **BOTTOM**: the page as he sees it at that second (the composite).
- **The scene**: its span, what the film shows, what the page draws and the files that draw it, his words that set it (verbatim, WEST), its
  status (`on his page`, `behind the wall`, `being built`, `held`), and the layers at that second, front to back.
- ←/→ step the scenes, Space plays them one after another (3 s each), a click opens one, `?scene=<id>` opens that one.
- **Nothing runs at rest**: `requestAnimationFrame` only while the view swings, a drag moves it or a picture comes in; the swing ends on its turn
  and the frames stop; Space again ends the play on the next turn; the page hidden, nothing runs. The one timer is the play's.

The scenes are `lab/scenes.mjs`: the house's read of his page (main at 248b44f4, with a46521bc, the hold on the previous screen with THE
CHOICE as the wall, and aacc1aa2, THE SACRIFICE), 27 scenes, 15 on his page, 11 behind the wall, 1 held (THE END OF IT). `breakdown.test.mjs`
holds every span to the film's cuts and the files' own moments.

## The passes (`lab/breakdown.capture.mjs`)

One muted headless Chrome over CDP, off every screen, requests only to the page's origin and only GET or HEAD. For each scene it plays the film in
from 1.2 s before the scene's second, pauses it with the page's own pause (the sphere, the film and the song stand still), seeks it to the second
exactly and lets it settle (the page's own finite animations on the stage done). Then, with Chrome's default background transparent and the page's
paper hidden, one transparent PNG per layer, every other layer hidden by `visibility` (no layout changes, no observer wakes):

| z | pass | the file that draws it | how it is isolated |
|---|------|------------------------|--------------------|
| 0 | film | app/saint-seiya.mp4 (`#dl-twelve-film`) | the video at that second read into a canvas: the 1986 picture inside the file (theater-light.mjs CROP), laid where theater.js has the film behind the page |
| 1 | paper | app/warm.css, app/warm-layout.css | the stage's ancestors and `.atmosphere` alone |
| 2 | sphere | app/warm-sphere.js (`#genesis-sphere`, and `#hero-front` while the box is out) | its canvas redrawn without the twelve worlds |
| 3 | worlds | warm-sphere.js orbitalSocieties, orbit-kick.js | the same canvas redrawn with the worlds alone: what is drawn in their four lane colours (the colours only orbitalSocieties uses; orbit-kick.js reads them the same way) and what follows one inside the same save (their miniatures once the network comes), by own-property wrappers on that context in the capture's Chrome; the page is not touched |
| 4 | dark | `#hero-dark` (unboxing.js onDark) | its element alone |
| 5 | theater | lab/theater.js `#hero-theater` | its canvas alone |
| 6 | irradiance | lab/irradiance.js `#hero-irradiance` | its canvas alone |
| 7 | box | lab/unboxing.js `#hero-box` | its canvas alone |
| 8 | raid | lab/anti-satellites.js `#hero-anti-satellites` | its canvas alone |
| 9 | sacrifice | lab/sacrifice.js `#hero-sacrifice` | its canvas alone |
| 10 | ko | lab/ko-edge.js `#hero-ko-edge` | its element alone |
| 11 | dom | app/warm.html, app/dl-paywall.js, app/dl-twelve.js, the bubble | every element that is not a layer, the paper, the film or the song (THE CHOICE, the wall, the sound buttons, the invitation bubble) |
| - | composite | his page | nothing hidden; taken first |

The z column is the page's stacking as the capture reads it at every scene (z-index, then positioned or not, then the document's order; the
sphere's canvas is static, so it paints under every positioned layer). A layer is found as `[data-layer~="<pass>"]` if the page marks it so,
else by the id its mounting gives it. The manifest (`lab/breakdown-pictures/manifest.json`) keeps each pass's z, its elements' box on the
window, its ink (where its PNG holds a pixel; none: the layer draws nothing there) and the page's view (a visitor's or a minter's).

**Whose view.** A scene up to the wall (the hold on frame 1111, 37.087 s) is taken as a visitor meets it (THE CHOICE comes in from her cut; the
film holds on the previous screen with the choice standing); a scene after it as a minter sees it (`?paywall=off`).

**Which page, both ways.** His page is the mint page itself, `app/warm.html`; lane/one-page moves every hero layer into its own document and
`lab/hero-ab.html` becomes a panel over it. The capture finds the hero by what the page holds, never by a script of the lab's: the document
with `#sphere-stage` is the page's own or its frame's; a handle the page may offer (`window.hero`) is only asked for the box's models and a
redraw. `--url auto` (the default) opens `app/warm.html?paywall=off` and goes where it goes (on his door THE BRIDGE, d723196c, sends it on to
`lab/hero-ab.html`): it takes that page when the layers stand in its own document or in its frame, else `lab/hero-ab.html?v=film&paywall=off`.

**Privacy.** The wall's offer will hold his hackathon videos (submission/demo.mp4, pitch.mp4). They are refused at the network (no request to
`/submission/` or `/Movies/` leaves the capture's Chrome), and before every picture, the composite included, every `<video>` inside
`#dl-paywall` and `#dl-paywall-choice` (THE CHOICE, which is the wall since a46521bc) is `display:none`, checked on the page before the shot; a
scene where one shows is not written. `--probe-private` plants a `<video>` in the wall at every scene and proves it never reaches a picture.
The pictures hold frames of the Saint Seiya film: `lab/breakdown-pictures/` is gitignored, never committed, never sent anywhere.

**The house's lock.** When aiolos answers a browser with its Touch ID lock ("DysonLight · Harmony"), the capture asks nothing of it (no POST
ever leaves its Chrome, so no panel comes up on his screen), says so and ends: unlock the door, or capture a served tree with `--origin`.

## Refresh the passes after each landing

It refreshes from his one page, so the breakdown always shows the cumulative version. From `embertide-app/ui/intro/dyson-society`:

    nice -n 19 node lab/breakdown.capture.mjs

Some scenes only: `--only the-wall,inversion`. Another door: `--origin http://127.0.0.1:8995` (a tree served by
`~/code-ec/house/tools/serve-range/serve`, never python's http.server). Then open `http://127.0.0.1:8921/intro/dyson-society/lab/breakdown.html`.

The page's proof (headless, off every screen):

    nice -n 19 node lab/breakdown.proof.mjs --url http://127.0.0.1:8995/intro/dyson-society/lab/breakdown.html

## The numbers (Oct 15 2026 02:0x WEST, this Mac at load 19 to 30)

- The capture: 27 scenes, 13 pictures each, in 201 s (3.7 to 13.2 s a scene); 85 MB of PNG; 0 page errors; 351 privacy checks, the probe's
  video seen and hidden in every one, 0 shown; refused: the page's font from Google and his tags' read from the Nest (the page uses its copy as
  at rev 1, the Nest's own rev).
- The page (breakdown.proof.mjs, on the served tree): 0 page errors; a scene's swing is about 720 frames (12 s), then 3 s at rest with 0
  requestAnimationFrame, 0 setTimeout, 0 setInterval, 0 frames, after each of the three scenes, after play and pause, and after a drag (8 frames
  while it moved); a phone at 390 x 844: no sideways scroll.
- `breakdown.test.mjs`: 11 tests (the manifest's z-order one runs only where the pictures were taken).
