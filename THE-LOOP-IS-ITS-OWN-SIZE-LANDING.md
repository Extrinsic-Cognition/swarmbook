# THE LOOP IS ITS OWN SIZE (Nov 26 2026, claude-0f25b5e7)

**Why.** His "Yes, trace it" to the trace THE TILE IS ITS OWN SIZE owed: the wall on lysa's real display (a visitor's Chrome, Intel UHD on OpenGL, no
WebGPU) stood at 18 to 19 fps with 80 long frames in 8 s, the processor at 17 %.

**The trace** (lysa's kiosk Chrome, the wall 30 s after load, 6 s, every process):
- the graphics process's main thread was busy **99.5 %** of the time; the page's main thread 5 %;
- of that time, 640 ms a second went to rasterizing canvas 2D, through about 27,000 `drawPoints` (single lines) and 29,000 `drawPath` calls a second.

**Who sends them** (each 2D call counted by its canvas for 4 s): the wall's 11 tiles (`canvas.voting-canvas`), each stroking 1,068 to 3,222 paths a frame,
about 19,000 strokes a frame in all. Of those, **exactly 1,024, 2,048 or 3,072 per tile are the discussion loops**: four Lissajous loops of
`RQ.discussionSegments` (256) segments for each node a tile shows, each segment with its own width and alpha (front, proximity), so they cannot be joined
into one path: 1,185 distinct styles in one tile's 2,048 segments, runs of one style 1,966.

The 256 was set for a tile drawn at 440 units. Since THE TILE IS ITS OWN SIZE, a lysa tile is 440 units shown on ~110 px (`dprNow` 0.25), so each
segment covers a quarter of a pixel's worth of curve.

**The cure.** `app/engine.js`, one line in place: a loop is cut by the pixels it is shown on, `ceil(256 x dprNow / 32) x 32` segments with 32 at least,
256 wherever the tile is shown at 440 units or more (a big tile, a Retina screen). A 110 px tile on lysa cuts each loop in 64; the segment's length on the
glass is the one it had at full size.

**Measured on lysa's real display** (8 s windows, 25 s after load, the live site and the lane served from the new Mac, interleaved):
- live (main): 9.0 fps (51 long frames), 10.8 fps (55);
- the lane: **37.0 fps (19)**, **35.3 fps (25)**;
- processor 18 to 20 % on both.

So the wall goes from about 10 to about 36 fps on lysa. The live reads were lower than the 18 to 19 fps of this morning: same page, a different layout
of the wall on that load and lysa's heat; the lane was faster in every pair. A still of three tiles from each, x3: the loops are as smooth as before, no
corners seen.

**Not solved, owed:** 19 to 25 long frames in 8 s remain on lysa (the faces' fills and outlines, ~100 a tile, and their pictures). No gate counts the
strokes a tile sends: the measure it waits for is the 2D calls a tile makes a frame on the box room's wall, read by a test against a baseline.

**Proofs.**
- The tests that read the engine, the wall, the tree and the polis: 65 of 65 (polis-knock, polis-rite, dl-athena, dl-athena-layer, riders,
  after-the-mint).
- Rule 8: `node --test app/dl-twelve.test.mjs` (21 of 21); `node app/dl-twelve.proof.mjs --url <served lane>/dyson-society/app/warm.html --tap button` PASS,
  `--tap sphere` PASS (the lane served by tools/serve-range, 206).
- JavaScript +1 -1, net 0.

**Cost.** One multiply and a table per tile size (the Lissajous tables are cached by count, 32 at most); a quarter of the loop strokes on every tile shown
under 440 units.
