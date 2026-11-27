# THE WELLS DRAW AT FIFTEEN (Nov 26 2026, claude-0f25b5e7)

**His words:** "Keep it, make it cheap" (Nov 26 2026), then the warden's GO to trace the red side and fix it.

**Found on lysa** (Chrome 151 headless on its own processor and GPU, after-the-mint.html?side=flask, 36 s after load, 8 s windows):
- The red side held 39 to 41 fps with 15 to 26 long frames while the processor was only 11 % busy.
- A 6 s trace of lysa's browser: its graphics process busy 5.4 s of the 6, rasterising about 3 times a frame (536 rasters, 1.9 s of it deserialising the paint
  commands). The only invalidation each frame was the rings' CSS orbit, and stopping it changed nothing.
- **Script loops frozen: 60 fps, 0 long frames, three rounds out of three.** CSS animations paused: no better. One loop asks for frames at rest: the engine's
  `tick` (engine.js), painting the eight wells' society trees (four of them mid-discussion) into their canvases at their cap, 30 a second.
- Caps tried on lysa, two rounds each: 30 (today) 39 to 41 fps, 24 to 26 long frames; **15: 53 to 54 fps, 5 to 6 long frames**; 10: 50 fps, 7 to 9 (no better).

**The cure** (`app/after-the-mint-book.mjs`, one option in place): a well's tree is drawn 15 times a second at most (`fpsCap: 66`), still at its tile's own pixels
(`dpr: false`). Its orbit and its discussion keep moving, stepped at 15 instead of 30. The test that pinned THE WELLS COST LESS at 30 now pins 66.

**Proofs.**
- `node --test app/after-the-mint.test.mjs`: 12 of 12.
- Rule 8: `node --test app/dl-twelve.test.mjs` (21 of 21); `node app/dl-twelve.proof.mjs --url <served lane>/dyson-society/app/warm.html --tap button` PASS,
  `--tap sphere` PASS.

**Cost.** JavaScript +2 -2, net 0. The wells' trees cost half the paints they did; nothing at rest changes otherwise.

**Owed.** The remaining gap to 60 fps on lysa (5 to 6 long frames at 15 fps) is the discussion overlays and the trees' own rasters. Lysa's numbers on the live
site after the deploy are read by this seat once it lands.
