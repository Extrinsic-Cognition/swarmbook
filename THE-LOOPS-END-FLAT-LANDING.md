# THE LOOPS END FLAT (Nov 26 2026, claude-0f25b5e7)

**Why.** The warden's GO (Nefertiti, 13:00 his zone): trace the remaining slow frames on lysa's screen. After THE LOOP IS ITS OWN SIZE the live wall on
lysa's real display (a visitor's Chrome, Intel UHD on OpenGL) stood at 26 to 38 fps, 12 to 50 slow frames in 8 s.

**The trace** (the live wall, 6 s): lysa's graphics process still ~95 % busy, ~22,000 `drawPoints` and ~26,000 `drawPath` a second; each tile still
strokes 256 to 1,152 loop pieces a frame (85 % of its strokes), 45 to 160 face fills, 2 to 17 pictures.

**Each kind switched off in turn on lysa's screen** (8 s each, interleaved with none off at 37 to 40 fps): the loops off 55.6 fps; the fills off 46.4;
the outlines off and the pictures off no change; everything off 57.3. So the loops.

**Tried and dropped:**
- joining pieces of one rounded style: the depth sort interleaves the four loops, 768 strokes become ~700 at best;
- fewer pieces: a piece is already 4.65 px on the glass; fewer would show corners;
- the tiles taking turns (the 11 tiles paint in one frame every 66 ms, then two frames paint none): spread over every frame the wall fell to 13.6 and
  16.4 fps against 26.1 and 25.9 live. lysa pays less for one burst and two idle frames than for paint in every frame; the burst stays.

**The cause.** `paintInst` draws every tile with round caps (so a face's rim seen edge-on keeps no knife corners), and a loop's piece inherits it: each
4.6 px piece became a stroke with two half-discs, a curved path the GPU fills, 7,700 of them a frame. With the pieces' caps flat, on lysa's screen:
57.3 and 57.6 fps, 0 and 1 slow frames, the same as the loops switched off (59.5).

**The cure.** `app/engine.js`, one line in place: a loop's piece is stroked with flat ends (`lineCap='butt'`), the round cap given back for the faces
after it. At a 1 to 2 px piece turning ~0.2 rad, a flat end leaves at most ~0.15 px at the bend, under a pixel; a still of the same tile, live and lane,
x3: the loops look the same.

**Measured on lysa's real display** (8 s windows, 25 s after load, live and the lane served from the new Mac, interleaved):
- live (main, THE LOOP IS ITS OWN SIZE): 36.5 fps (19 slow frames), 37.3 (18);
- the lane: **56.6 fps (0)**, **57.6 (2)**.

**Not solved, owed:** the same loops are drawn by `warm-spatial-scene.js` (its own copy, 5,000 lines) on the mint's spatial scene; not measured there,
not touched. No gate counts a tile's strokes or its round caps: the measure it waits for is the 2D calls a tile makes a frame on the box room's wall,
read by a test against a baseline.

**Proofs.**
- The tests that read the engine, the wall, the tree and the polis: 65 of 65.
- Rule 8: `node --test app/dl-twelve.test.mjs` (21 of 21); `node app/dl-twelve.proof.mjs --url <served lane>/dyson-society/app/warm.html --tap button` PASS,
  `--tap sphere` PASS (served by tools/serve-range, 206).
- JavaScript +1 -1, net 0.

**Cost.** Two state sets a piece on the main thread (measured busy 22 to 23 % against 17 to 18 %: the main thread now runs at 57 frames a second, not 37);
on the GPU the loops cost about what nothing costs.
