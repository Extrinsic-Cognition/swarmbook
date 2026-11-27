# THE TILE IS ITS OWN SIZE (Nov 26 2026, claude-0f25b5e7)

**Why.** His "play swarmbook on her and measure fps": Swarmbook played full-screen on lysa's real display, a visitor's Chrome (Chrome 151, Intel UHD on
OpenGL, no WebGPU). The front page, the wall, crawled at **2.4 to 4.4 fps** with 17 to 22 long frames in 8 s while the processor was 4 to 14 % busy. My
headless runs had used lysa's GPU through four Vulkan flags and read 60 fps, so a visitor's road was never measured. The warden's GO: fix it.

**Split on lysa's screen**:
- script loops frozen: 60 fps (twice); CSS animations paused: no better;
- the only loop asking frames at rest is the engine's tick (engine.js), which, with no WebGPU for the wall's swarm glass, paints the 11 visible tiles itself;
- each tile was a **440 x 440 bitmap shown at about 120 px** (the engine sized it `size x devicePixelRatio`, whatever the wall's own scale showed), at 30 a second.

**The cure.**
- `app/engine.js`, two lines in place: a tile's bitmap is its on-screen box (after the wall's scale) times the pixel ratio, never above its 440 units
  (`dprNow` is that scale; the discussion overlay already sizes itself by `size x dprNow`, so it follows). A big tile on a Retina screen keeps its sharpness;
  a 113 px tile on lysa paints 113 px.
- `app/wall.js`, one option in place: the wall's tiles paint 15 times a second at most (`fpsCap: 66`), as the wells do since THE WELLS DRAW AT FIFTEEN.

**Measured on lysa's real display** (8 s windows, 25 s after load, live site and the lane served from the new Mac, interleaved):
- live (main): 2.4, 4.4, 3.6, 2.4 and 4.4 fps;
- bitmap fix alone: 9.1 and 9.3 fps;
- bitmap fix and 15 a second: 16.3, 15.1, 10.3 and 9.4 fps.

So three to five times faster. Tried and not the cause: the tiles' face pictures and their clips, switched off, made no difference.

**Not solved, owed:** the wall is still not smooth on lysa (40 to 70 long frames in 8 s with the processor at 17 %). The graphics process stays saturated,
and a trace of lysa's GPU on the wall is the next step, as it was for the red side.

**Proofs.**
- The tests that read the engine, the wall and the tree: 80 of 80.
- Rule 8: `node --test app/dl-twelve.test.mjs` (21 of 21); `node app/dl-twelve.proof.mjs --url <served lane>/dyson-society/app/warm.html --tap button` PASS,
  `--tap sphere` PASS.
- JavaScript +3 -3, net 0.

**Cost.** One `getBoundingClientRect` a paint per tile, which the culling tiles already read; fewer pixels everywhere a tile is shown smaller than 440 px.
