# THE MOTION IS CHEAP, ecology first (Nov 26 2026, claude-0f25b5e7)

**His words:** "Keep it, make it cheap" (Nov 26 2026, this seat's chat), over the choice for the pages that cost at rest: keep their motion and make it cheap, or
let them go still.

**Read on lysa** (the 2019 laptop, Chrome 151 headless on its own processor and GPU, 36 s after load, 8 s measured), swarmbook.com at rest:

| page | busy | fps | long frames |
|---|---|---|---|
| why (ecology) | **35 %** | 58 | 5 |
| red, after the mint | 12 % | 40 | 21 |
| the front, the wall | 14 % | 61 | 0 |
| a swarm | 8 % | 56 | 4 |
| blue, after the mint | 7 % | 61 | 0 |

**Ecology's cost.** Its four lenses run a requestAnimationFrame loop. On the cones' lens each frame rebuilds, as SVG path text, the outlines and cages of two
cones and eight background cones and every edge of the graph, at 60 a second. The drift is slow, on sines of 30 to 60 s.

**The cure** (`app/ecology.js`, three lines in place). Every lens is painted 30 times a second at most. The cones' outlines are redrawn 15 times a second; a call
off the frame's clock (a resize, a lens, the reduced-motion switch) redraws them at once. The loop still ticks every frame, and nothing about the motion's path
or speed changes.

**Measured** on this Mac, the processor slowed 4 times, 20 s after load, 8 s, main and the lane served side by side, two rounds interleaved:
- main: 51 % and 45 % busy, script 36 % and 30 %, 1 long frame each;
- the lane: 33 % and 24 % busy, script 21 % and 14 %, no long frame.

Lysa's numbers after the deploy go in the next lane's receipt.

**The wall** (`app/wall.js`, one option in place): its tiles had no frame cap, so each was drawn up to 60 times a second on the card. Now `fpsCap: 33`, as the
wells already had. The processor slowed 4 times, 36 s after load: main 28 and 15 % busy, the lane 20 and 13 %.

**Not in this lane**, measured and owed:
- the red side on lysa: 40 fps with 21 to 25 long frames while the processor is 11 % busy. On lysa, the rings' CSS orbit is not it (stopped, no better); the
  ball is not drawing at rest (its canvas 1x1, its glass layers off screen). The live canvases are the wells' activity scenes (a dozen voting and discussion
  canvases). Hiding every canvas gave 57 fps once and 35 fps once: lysa's own kiosk shares the graphics, so this needs repeated runs before a cure;
- the mint's colony moment.

**Cost.** JavaScript +3 -3, net 0. Nothing at rest changes: the loop still stops when the page is hidden or off screen.
