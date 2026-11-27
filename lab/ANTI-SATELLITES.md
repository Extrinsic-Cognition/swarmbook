# THE ATTACK IS DOLBAR'S: the swarm charges with him, strikes on his blow from his border and stops on the block (`anti-satellites.js`, `dolbar-beats.js`; Oct 15 2026, lane `lane/dolbar-attack`)

## His words

**Oct 15 2026 02:2x WEST**, over his page during the raid (the sphere with red film faces, the gold honeycomb shield ring round it, red
pentagon swarmies scattered outside it doing nothing, the twelve worlds with gold tethers): "honestly super fucking poor performance on the
attack... completely uncorrelated to the animation of dolbar dude... like he charges a lot and then does hyper quicck attac from a distancr
and then the other gguy blocks it".

## The film's beats, measured (`tools/dolbar-beats.mjs` writes `dolbar-beats.js`; 30000/1001 fps)

Every frame from 96 to 351 was read by eye (240 x 136 and 480 x 270 sheets). Each beat is one rule over three numbers of each frame,
in thousandths:
- the halo's red over the faces' square (`dolbar-charge.js`'s numbers);
- the pale light of the whole frame (value over 0.85, saturation under 0.35);
- the change from the frame before (mean absolute grey difference; a cut is over 118).

The test measures the film again and gets the same table.

| beat | frame | second | the film | the measure (red, light, change) |
|---|---|---|---|---|
| orb | 115 | 3.837 | the orb lit in his hand (114 holds its first red dot) | 25, 8, 3 (the red half again over 13) |
| flood | 134 | 4.471 | the frame floods red over him: his halo | 516, 3, 56 (the red reaches 500) |
| (cut) | 162 | 5.405 | Seiya in his pink light | change 134 |
| (cut) | 192 | 6.406 | back to Dolbar: still charging, the sparks gathering | change 138, light 12 |
| peak | 245 | 8.175 | the charge at its height: the focus lines close on his palm (from 220) | 980, 0, 9 (the most red before the release) |
| **release** | **251** | **8.375** | **THE BLAST LET GO: his hand thrust out of the frame in light** | 707, **98**, 82 (the light, 0 to 44 through the charge, reaches 80) |
| streaks | 256, 259, 261, 264, 266 | 8.542 to 8.876 | the blue and red streaks, each flicker of their red | the cut after the release; then each rise of the red by 100 |
| hand | 267 | 8.909 | the giant hand of light | 455, 170, 241 (the next cut) |
| flash | 286 | 9.543 | the hand reaches Seiya in a red flash | 888, 3, 101 (the light goes out) |
| sweep | 290 | 9.676 | the blast sweeps over Seiya | 725 (the red falls by 153) |
| block | 319 | 10.644 | the one who takes it stands in it, arms spread | THE SACRIFICE's (`sacrifice.js` SACRIFICE.first) |
| tag | 325 | 10.844 | his tag, "THE MOMENT OF SACRIFICE" (10.835 s) | `sacrifice.js` SACRIFICE.tag |
| hit | 331 | 11.044 | the cut to the hit landing on him: BURST 1 | change 153 (the first cut after the tag) |

The release is 251, not 6.406 s. 192 is only the cut back to him: he still charges there and no light comes off him. The
coordinator agreed on 251 (Oct 15 2026). It is the frame `ANTI.sent` already held.

## What it does, act by act (the hero's stage, 1205 x 900 at 1440 x 900)

1. **He charges a lot** (115 to 250).
   - The swarm comes in from past his border on the orb: thirty-six set off over 0.8 s and walk in over 0.5 to 0.9 s.
   - They MASS at his border: a column at the stage's left edge, level with the sphere, 1.5 to 1.9 rings out.
   - The charge's BUILD is the film's red summed from the orb, reaching 1 at the release. With it:
     - the mass tightens, from 507 px tall at 5.5 s to 386 px at the release;
     - the swarm trembles, up to 0.012 of the stage's height times the red;
     - their light is the red held, and a red glow sits round the mass.
   - The film's flow sways them on their places, by 0.03 of the stage's height at most.
   - Nothing crosses to the sphere.
   - His signal runs into them on each rise of his red, the last on 248.
   - THE DEFENCE: the twelve feel it coming. The shield rises with the build:
     - the side facing the mass first (strength 0.64 at the cut back to him);
     - up by 75 % of the build (7.47 s);
     - closed all round by 90 % (whole from 8.0 s, before the blast).
   - THE RESISTANCE: the twelve fire at the mass, futile. 51 shots from 163 to 250, more as the build rises. Four in five hit and throw a
     swarmie back. The tethers are at 45 %.
2. **Hyper-quick attack from a distance** (251 to 290).
   - On 251 all of them strike at once from where each stands, along the blow's one way (the mass to the sphere): a front as wide as
     the mass.
   - Each covers a third of its way on 251 and two thirds on 252. All land on the shield on 254: three frames, 0.1 s.
   - The strike is drawn as a streak behind each one, with 22 speed lines over its way on 251 to 253.
   - It lands on the left arc, from 144 to 219 degrees. The cells under each light up, a ripple runs from each, the shield flares
     white-gold and is dented in.
   - From 254 it is ONE BLOW: each one stays where it landed, pressing.
   - On each beat the film shows (256, 259, 261, 264, 266, 267, 286, 290) the blow drives them in: a kick of 0.05 of the ring, a short
     streak behind each, a third of them rippling, the shield flaring.
   - No second approach and no wandering (tested: every one keeps its landing angle to the cut).
   - The twelve stop firing on the release. Their bolts are overtaken by the blow, and the tethers come up whole.
3. **The other guy blocks it** (290 to 331).
   - The blow presses on while the blast pours over Seiya; the press and the shield's light rise (the blow gathering itself).
   - Over 316 to 318 the blow draws back 0.07 of the ring.
   - THE LAST AND BIGGEST BLOW lands on 319, as the one who takes it stands in it (THE SACRIFICE's cut-out over the stage). The press
     jumps by 0.39 and the shield goes white-gold.
   - It peaks on his tag (325): flare 1, press 0.9. The cracks run from under every one to the cut. Held over half.
   - On the cut to the hit (331) the swarm is gone and the shield shatters outward with BURST 1, as before; its pieces are gone by
     11.812 s.
   - No blow after the last; no signal after the release.
- **Reduced motion**: a still. The mass at its height and a faint ring, drawn once; no signal, strike, bolt or piece.

## Before and after, beside the film's own frames

The pictures hold the film's frames, so they stay out of git: the lane's scratchpad, `dolbar-attack/{before,after}/cmp-<s>s.jpg`.

| | before (the raid, main d34dcedc) | after |
|---|---|---|
| the charge, 3.8 to 7.8 s | the swarm set off at 5.07 s and drifted in round the sphere on the flow, already at the shield's left half by 6.8 s; the twelve fired from 6.37 s | nothing until the orb, then the swarm walks in to its border and masses there: tighter, trembling, glowing with the red; the shield rises with the build and is whole by 8.0 s; bolts fly at the mass |
| the strike, 8.375 to 9.6 s | the swarm scattered round the sphere, circling, no change on 251; the coordination at 9.41 s | on 251 the whole mass strikes in streaks and speed lines, landing on 254; pressing on the left arc, driven in on each beat |
| the block, 10.644 to 11.044 s | the strike from 10.611 s, landing at 10.844 s from all ways round | the blow drawn back over 316 to 318, landing on 319 with the sacrifice, the peak on 325, the cracks, the shatter on 331 |

## What it costs

- **Before and after, in a real browser**: `lab/anti-satellites.proof.mjs`, Chrome 155 headless at 1440 x 900, his Mac at load 27 to 79.
  - Each run played the window (a second before the orb to 0.55 s after the impact, 8.8 s) twice with the layer and twice without it
    (its destroy()), each pass traced. Two runs each, the code before and after alternating.
  - Before was main d34dcedc, a detached tree served by the proof's own door (`--root`).
  - "GPU" is the GPU process's threads' top-level tasks summed, per page frame (CrGpuMain, the viz compositor and its pools).
  - The first pass with the layer after the page loads is the trace's and the GPU's warm-up in every run, both codes alike: GPU 11.4 and
    8.7 ms after, 14.0 and 7.5 ms before. It is left out below.

| at 1440 x 900, a pass of 8.8 s | before (the raid) | after (Dolbar's attack) |
|---|---|---|
| the layer's draws a pass | 215 (from the flood) | 234 (from the orb, 19 frames sooner) |
| the layer's own script a draw (JS) | 0.29 to 0.33 ms, the longest 1.3 to 1.5 ms | 0.32 to 0.39 ms, the longest 1.2 to 1.4 ms |
| GPU a page frame, with the layer | 5.43, 5.72 ms | 6.46, 5.31 ms |
| GPU a page frame, without it | 5.39, 5.48, 5.52, 5.70 ms | 6.01, 5.32, 5.66, 6.03 ms |
| of it on CrGpuMain, with / without | 3.36, 3.49 / 3.24 to 3.39 ms | 3.77, 3.49 / 3.13 to 3.60 ms |
| the hero's main thread a page frame, with / without | 2.54, 2.53 / 2.24 to 3.34 ms | 2.71, 2.43 / 2.20 to 2.58 ms |
| the page's frames | 528 to 529 a pass, 0 over 25 ms, p95 16.7 to 16.8 ms, longest 16.8 ms | the same |
| long animation frames (both documents) | 0 | 0 |
| playing 20 to 24 s (outside) | 0 draws, 0 frame callbacks | 0 draws, 0 frame callbacks |
| paused 3 s at 7.75 s (at rest) | 0 draws, 0 callbacks, none waiting | 0 draws, 0 callbacks, none waiting |

So the layer costs what the raid cost:
- about 0.33 ms of script a draw;
- on the GPU, 0.1 to 0.2 ms a frame over the page without it, inside the spread between passes (up to 0.7 ms);
- no long frame.

- **In node** (`anti-satellites.test.mjs`): a stand-in page, 1440 x 900, twelve worlds, a no-op 2D context, each frame's best of five
  passes.
  - 0.028 ms a draw over the window: the charge 0.027, the strike and the blow 0.031, the block 0.036, the shatter 0.023.
  - The slowest frame is 0.100 ms; 239 draws a pass.
- **The plan, in idle time, once per stage, before the window**:
  - the raid 2 to 22 ms (before: 20 to 112 ms);
  - its shield 14 to 130 ms (before: 21 to 116 ms).
  - Each pair is now and before, measured back to back on this Mac at load 80 to 87, so the spread is the load's.
- **At rest nothing**: no timer, no requestAnimationFrame, no frame callback waiting at the pause (the source tests, the clock test, and the
  proof's rest pass above).

## Tests and proofs

- `node --test lab/anti-satellites.test.mjs`: 34 of 34.
  - The beats are the film's, measured again off `app/saint-seiya.mp4` (the same table and the same module text).
  - The code's beats are the film's to the frame:
    - the strike on 251, landing by 254;
    - a blow at its height on 254 and on each beat, and on no other frame;
    - the last blow on 319, its peak on 325, the cut on 331.
  - Act 1: nothing crosses; the mass tightens, trembles and glows with the build; the shield rises with the build, left first, whole
    before the release.
  - Act 2: each one strikes from where it stood, on its own straight line, at once and in one way. Streaks and speed lines on 251 to 254;
    then each keeps its landing angle to the cut.
  - Act 3: drawn back only over the three frames before the block; the last blow on 319; the flare at its height on 325 and only there.
    The pulse only falls after the block. The cracks run; it holds to the cut.
  - The defence, the resistance (from the flood to the release), the clock, reduced motion, no pops, the same picture twice, the cost.
- The dyson-society suite on the merged tree (`node --test app/*.test.mjs lab/*.test.mjs tools/*.test.mjs worker/*.test.mjs`): 470 tests,
  468 pass, 2 skipped, 0 fail.
- `lab/anti-satellites.proof.mjs` on this tree and on main d34dcedc (`--root`), four runs, each exit 0: the cost above.
  - The after run's 19 pictures at the beats are in the lane's scratchpad `dolbar-attack/proof-after/` (they hold the film's frames).
  - In every run: no page error; requests refused, the fonts and his Nest's tags (8904), as before.
- Both sound taps on this tree, served by `tools/serve-range` (port 8985) and stopped after, on lab/hero-ab.html:
  - `--tap button`: PASS, all six checks, the film never below 6.10 s;
  - `--tap sphere`: PASS, all six, 6.05 s.

## Not done, said plainly

- **Port 8992** was taken by another lane's server (`.worktrees/hero-dark-20261015`) once mine had timed out, so the last pictures and
  every proof here ran on 8985, serving this tree. That port was checked before each run.
- **Seen only headless** (Chrome): not on lysa, not in WebKit, not at his MacBook's 2x.
- **The breakdown's scene cards** (`scenes.mjs`, lane/breakdown's file) still list the old raid's layers for 6.406 to 10.644 s: the strike now
  lands at 8.475 s, inside "The blast let go".
- **hero-mount.js's comment** on the mount line still reads "DOLBAR'S CHARGE, 4.471 to 11.044 s". It is one-page's line, left alone. The layer
  now runs from the orb, 3.837 s, to the last piece, 11.812 s.
- The look is mine from his words; no word of his has seen it yet.

# THE DEFENCE and THE RESISTANCE: the sphere's side raises a shield on the raid's ring, and the twelve fight back (`anti-satellites.js`; Oct 14 2026, 22:3x to 23:4x WEST, lane `lane/dolbar-raid`)

## His words

- **22:2x WEST**, over the raid at about 7 s (Dolbar's red swarmies streaming in from the left with his red dashes, while the
  dodecahedron and its twelve Lissajous orbits go on as if nothing were happening): "dude wha the fuck is here that they do not prepare for
  defence?? they dont have a shield up? there is no smooth transition to the other one or not??"
- **23:15 WEST**, over his screenshot of the live page during the charge (about 6 to 8 s, the twelve orbiting calmly, doing nothing): "how
  many times i said you gotta make the ones here defending or react in a way to the attacking ones diomerda... just some futile resistence
  dude"
- **23:09 WEST** (relayed by the coordinator): "maximize stabiility i am fucking tired of you fucking up shit". Stability before spectacle:
  every number of it is a pure function of the film's frame and the stage, eased from frame to frame, and tested.

## What the sphere's side does, by the film's own frames

On a 1600 x 900 stage (the raid's moments are the same frames on every stage; the shield's light and the twelve's fire are read off each
stage's own raid).

| frame | second | |
|---|---|---|
| 134 to 151 | 4.471 to 5.039 | the swarm waits past his border: nothing of the shield |
| 152 | 5.072 | the first swarmie sets off; the shield stirs (too faint to draw until 5.54 s) |
| 191 | 6.373 | the twelve's first shot, at the first swarmies near the ring on the left |
| 204 | 6.807 | the shield's left half up (half its light) |
| 244 | 8.141 | its right half up |
| 282 | 9.409 | the raid coordinates: no shot from here (the last at 9.38 s); the shield closes all round in 0.2 s; the tethers come up whole |
| 285 | 9.510 | the last bolt lands |
| 288 | 9.610 | whole all round |
| 318 | 10.611 | THE STRIKE: they draw back together and dive; their volley flies, fading out by the landing (the shield takes it) |
| 325 | 10.844 | they land ON THE SHIELD, every one on this frame (his tag, the sacrifice): it flares white-gold; the cracks start |
| 330 | 11.011 | pressed in by 3 % of the ring, the cracks run across it from under each, and it holds |
| 331 | 11.044 | the burst: the swarmies gone on the cut, the shield shatters outward with the theater's blast |
| 334 | 11.144 | its white-gold flash at the height; the cracks gone; the tethers and the lit cells gone by 11.24 s |
| 354 | 11.812 | the last piece gone; the canvas emptied |

- **The shield is the ring** the swarmies already keep outside of (1.5 x 1.18 sphere radii): two rows of hexagonal cells, honeycombed round
  it, the Dyson society's own figure (an arrival becomes a hexagon), the outer row's corners on the ring; 96 cells a row at the hero's size
  (84 on a phone; a cell 0.064 radii, 6 px at least); the page's gold leading (#b28a3e, lit #e5c782) over a pale light fill, never opaque;
  on the raid's canvas, under the swarmies.
- **It rises with the threat**, read off the raid at each frame, not a clock: its strength is the swarm's share of its way in (each swarmie
  from where it waited to the ring), the mean, eased. By direction it is strongest where they are (each swarmie's share squared, spread round
  the ring as e^(5 (cos - 1)), about 26 degrees either way), so the left, his border, rises first. On the raid's own frame of coordination
  (each swarmie takes its place round the sphere) it closes all round in 0.2 s.
- **The twelve hold it up**: each world off the sphere's face gives off a thin tether of light, outward, to the two inner cells either side
  of it. At 45 % while they fight, and whole once they stop and hold it up. A world over the face lets go (from 1.14 radii in to 1.02: no
  line across the film), and so does one right at the shield's inner edge (it holds it already): on the hero's page 2 to 9 of the twelve
  tie at a time. With no worlds, the shield stands alone.
- **A hit**: a swarmie within 0.06 ring radii lights the cells under it, and its coming in sends a ripple through the cells round it (10
  cells a second, gone in 0.4 s); the light of a cell eases in over three frames (the fastest swarmie crosses the margin inside one).
- **The resistance, futile**: from when the swarm comes within reach of the twelve (6.37 s here, 5.84 s on a phone) until the raid
  coordinates, each swarmie draws their fire on its own seeded cadence: 1.1 shots a second at the ring, times its own pace (0.6 to 1.4) and
  its share of its way in, squared, while it is within reach of their loop. So the fire rises as the swarm closes: twice as many shots in
  the fight's second half as in its first, 54 on this stage. The world nearest where it was fired at fires: off the sphere's face, within
  1.2 radii, its line clear of the sphere. The bolt is in the society's gold (#e5c782 over #b28a3e) and reaches the swarmie in 4 frames
  (0.133 s). At the world, its dot flares and a ring opens off it. Four in five hit: the swarmie flares, a gold ring opens off it, and it is
  thrown back along the bolt by 0.06 radii (out in 2 frames, back in 10), then comes on again. The rest pass beside it and fly on, fading.
  None falls, and the raid's own path is untouched (the throw is only drawn).
- **The strike lands on it** and **the handover**: as in the table. The pieces fly out 0.55 to 1 radius, at once and slowing as the
  theater's planes do, turning, shrinking and fading.
- **The rules**: every number is eased from frame to frame (the test bounds each: the strength 0.06 a frame at most, a cell's light 0.12,
  its lit share 0.35, the closure 0.25, the flare 0.3; a hit's throw 0.65 of its length). The whole is a pure function of the film's
  frame and the stage (`shieldAt`, `resistanceAt`), so a seek lands on the same picture (the test draws the same frame after two different
  ones and gets the same canvas calls). Nothing at rest: no timer, no frame loop of its own; it draws only when the raid's layer draws, from
  the halo to 11.812 s. prefers-reduced-motion: a faint still ring (0.3 of its light), drawn once, no bolt, no pieces.

## What it costs (performance culture 1)

- **Before**: the raid's layer, drawn on each presented film frame from 4.471 to 11.044 s.
- **Predicted**: the shield worked out once per stage in idle time; a few levels of cells a draw (a path, a fill and a stroke each); the
  fire a handful of strokes; the layer kept to 11.812 s for the pieces; under 0.5 ms a draw.
- **Measured**, his MacBook Pro (M4 Max), Oct 14 2026 23:2x to 23:4x WEST, the Mac at load 28 to 56 from the other lanes:

| | the twelve tie and fire | no worlds (no tether, no fire) | before the fire (the shield alone) |
|---|---|---|---|
| Chrome 155 headless, the hero served from this tree, played 4.0 to 12.1 s, the layer's own drawMs, three passes each, alternating (taken before the tethers' face fade was narrowed: the same strokes) | 0.385, 0.320, 0.311 ms a draw (220 draws a pass, the longest 0.6 to 2.4 ms) | 0.370, 0.302, 0.275 ms a draw (the longest 0.8 to 2.8 ms) | |
| the page's frames over those passes | 489 a pass, 0 over 25 ms, p95 16.7 to 16.8 ms | the same | |
| node, a stand-in page with a no-op 2D context (1440 x 900, twelve worlds), each frame's best of seven passes | 0.021 ms a draw over the window, 0.026 ms while they fire | | 0.018 ms over the window, 0.021 ms in the same frames |
| canvas calls a draw | 1,491 over the window, 1,721 while they fire, 2,969 while they press and the cracks run | | 1,483, 1,705, 2,969 |
| worked out in idle time, once per stage | the raid 13 to 58 ms, then its shield and the fire 6 to 40 ms (two idle callbacks) | | |
| memory | the shield's numbers 94 kB a stage | | |

So the twelve's tethers and fire cost about 0.02 ms a draw in Chrome (0.005 ms of script), and the whole layer about 0.3 ms on a loaded
Mac, inside the 0.5 ms asked. Nothing at rest, nothing outside the window (the existing clock tests, unchanged in spirit; the window now ends
at 11.812 s).

## Tests and proofs

- `node --test lab/anti-satellites.test.mjs lab/heartbeat.test.mjs`: 40 pass, 0 fail. New: nothing before set-off; the strength is the
  swarm's own state; the left over the right before 9 s; whole by 9.6 s; the strike lands on one frame and flares; the pieces outside the
  ring and gone by 11.8 s; no pops; the same picture twice; reduced motion; the twelve's tethers; the resistance (from reach to
  coordination, rising, from the worlds, never across the sphere); futile (hits and misses, the throw and back, none falls); the cost (each
  frame's best of five, under 0.5 ms). Changed: the dive ends on the ring, not at 0.97 radii; the clock test keeps the layer to 11.812 s.
- The whole dyson-society suite after merging main (ANTI.sent, no wave from Dolbar once his attack is sent): 406 tests, 405 pass, 1 skipped
  (the SBF loader's, not this lane's).
- The sound proof (`app/dl-twelve.proof.mjs --tap button`, a trusted tap in a headless Chrome) on this tree, served for the run only and
  stopped after: PASS, all six checks.
- Frame grabs of the hero, headless, served from this tree by the grab's own door, at 5.5, 6.5, 7.5, 8.5, 9.2, 9.6, 10.2, 10.75, 10.9,
  11.1, 11.5 and 12.0 s: in the lane's scratchpad, not in the house (they hold the film's frames). His QA is on his own page once this lands.

## Not done, said plainly

- **Seen only headless** (Chrome 155): not on lysa, not in WebKit (his Harmony window), not at his MacBook's 2x.
- **The volley crosses the shield**: the strike's red lines still run from the sphere's rim to each swarmie, as before, drawn under the
  shield and fading out by the landing. If he reads them as the attack getting through, they can stop at the shield instead.
- **Which world fires** is the nearest one to where the shot was fired at, chosen again at each frame from the page's last list of worlds.
  If two worlds are nearly as near, a bolt in flight may jump from one to the other; it lasts four frames.
- **The worlds' list is the page's last frame's**: a bolt starts where the page last drew the dot (one page frame behind at most).
- **A grab is the paused film, seeked**: in play the layer draws on each presented frame of the film, the pieces at the film's 30 frames a
  second while the theater's burst moves at the screen's.
- The look is mine from his words; no word of his has seen it yet.

# The first version: DOLBAR'S CHARGE, the anti-unit1 satellites aligned on his signal (Oct 14 2026, 20:16 to 21:0x WEST, lane `lane/anti-satellites`)

What follows is the first version's record: twelve anti-unit1 satellites aligned on his signal. The raid replaced it (Dolbar's swarmies from
his border, his Oct 14 2026 21:2x WEST words; `anti-satellites.js`'s header describes it). The window, the measure of his red and the cost
culture below still stand.

## What it costs (performance culture 1)

- **Before:** nothing of ours drew on the hero from 4.471 to 11.044 s: the page's sphere with the film on its faces, the twelve worlds on
  their loop (orbit-kick.js hearing the score), and from 10.644 s the theater waking for the first burst.
- **Predicted:** one 2D canvas the stage's size, alive only inside the window; about 0.2 ms of script for each presented film frame (one clear,
  two paths, twelve sprites); no frame over budget; nothing outside the window; nothing at rest.
- **Measured** (the new Mac, Chrome 156 for Testing headless, ANGLE Metal on the M5 Max, 1440 x 900; three runs at 1x and one at 2x, his
  MacBook's pixels; the film played 3.47 to 11.6 s, twice with the satellites and twice without, alternating):

| | with the satellites | without | playing 20 to 24 s (outside) | paused 3 s at 7.75 s (at rest) |
|---|---|---|---|---|
| the page's frames (requestAnimationFrame in the hero's document) | 490 to 491 a pass; 0 over 25 ms, 0 over 50 ms; p95 16.7 to 16.8 ms, longest 16.8 ms | the same | 242 to 243; 0 over 25 ms | |
| long animation frames (both documents) | 0 | 0 | 0 | |
| the satellites' draws / frame callbacks | 197 / 234 to 235 a pass (one draw for each presented frame of the window) | | 0 / 0 | 0 / 0, none waiting |
| the satellites' own script | 24.3 to 28.1 ms a pass: 0.12 to 0.14 ms a draw, the longest 0.3 to 0.4 ms (2x: 24.3 and 24.5 ms) | | 0 | 0 |
| CDP script time over a pass (ms) | 857 to 914 (2x: 748, 792) | 685 to 882 (2x: 750, 765) | 375 to 445 | |
| pixels held | the stage at the page's ratio while it is shown: 1205 x 900 (4.3 MB), 2410 x 1800 at 2x (17.4 MB) | | 0 x 0 | the last picture, as shown |

The page's own script time over the same 8 s moves by up to 197 ms between passes (without the satellites: 685 to 882 ms), so the CDP
difference, pass for pass (median +32 ms, from -2 to +172), is noise around the satellites' own measured 24 to 28 ms. Draws at rest: 0. Script outside the window: a comparison on each of the film's
timeupdates (about four a second), no draw, no callback.

## His words (Oct 14 2026 19:37:56 WEST, the friendly-lichterman seat, cut at 19:45:05 by the weekly limit)

"you. see when it becomes red halo when dolbar is charging the attack before the dodecahedron explodes in umpact? can you show some
anti-unit1satellites like... imagine that dolbar is sending signal to attack to others and we visually see the shit aligned there... you know
what i mean?"

## The window, the film's own (measured again: the cut seat's 19:42 measure was lost with it)

`tools/dolbar-charge.mjs` decodes `app/saint-seiya.mp4` (30000/1001 fps) to RGB at 240 x 136 and, for each frame from 2.002 s to 11.5 s,
counts the share of the square the hero's faces show (the frame's centre square, warm-sphere.js `drawPortrait`) whose colour is the halo's red
(hue 25 degrees under red to 20 over, saturation 0.45, value 0.30: his red and the pink it throws on Seiya; not Dolbar's purple, not the
sky, not gold, not black). Run on the new Mac at 20:23 WEST (286 frames, 97 ms with the decode), written to `dolbar-charge.js`; measured
again by the tests on this Mac off the same film, the same 286 numbers.

| frames | seconds | the red (thousandths) | what the film shows |
|---|---|---|---|
| 87 to 109 | 2.903 to 3.670 | 30 | the cut to Dolbar in purple, "This is the coup de grace." |
| 110 to 133 | 3.670 to 4.438 | 13 to 73 | the orb lit in his hand |
| **134** | **4.471** | **516** | **the frame floods red over him: the charge begins** |
| 135 to 161 | 4.505 to 5.372 | 631 rising to 907 | his halo, sparks |
| 162 to 191 | 5.405 to 6.373 | 557 rising to 716 | the cut to Seiya in its pink light |
| 192 to 250 | 6.406 to 8.342 | 928 to 980 | back to Dolbar, the blast let go, red speed lines |
| 251 to 266 | 8.375 to 8.876 | 575 to 949, flickering a frame | the blast's blue and red streaks |
| 267 to 330 | 8.909 to 11.011 | 453 to 888 | the giant hand of light (its flash 9.543 s, 888), the one who stands in it, arms spread (his tag, the sacrifice, 10.835 s) |
| **331** | **11.044** | 832 | **the cut to the hit landing: the hero's first burst, the dodecahedron explodes. The satellites are gone on this frame** |

The window is frames 134 to 330, 4.471 to 11.044 s (6.57 s, 197 frames), each end a cut on the film's own frame (CUTS.md: never a fade),
its lines half a frame before the frames as the KO edge's are. It holds no burst of the theater and none of the KO edge (18.018 s on).

## What it draws

The dodecahedron carries the film, so in these seconds Dolbar is the sphere and his halo is on its faces. From its rim his **signal** goes out:
a bright dash runs along a red line to each of twelve **anti-unit1 satellites**, one for each of the twelve worlds on the Lissajous loop, on
the frame the red rises over what it held, and one more each time another twelfth of the charge is in (the more red, the faster). The
fifteen signals: 4.471 (the flood), 5.005, 5.572, 6.240, **6.406** (back into Dolbar's red), 6.874, 7.341, 7.808, 8.275, **8.542** (the
streaks), **8.809**, **9.376**, **9.543** (the hand's flash), 10.210, **10.377** s (bold: the film's own rises). The satellite a signal
reaches flares (falls by e in 0.22 s).

They wake where the first signal finds them (5.021 s), scattered off their lines (seeded, up to 0.6 rad) and turned every way, 1.4 to 1.7
loop radii out; as the red pours on (the charge summed frame by frame) they turn to point at the sphere, swing onto the line from Dolbar
through their world (aligned at 55 % of the charge, frame 236, 7.875 s) and close in, to stand in a ring at 1.18 loop radii, outside every world, each
one aimed down its line at its world, at the impact. Their brightness is the red's own, held through a cut away from it (it falls by e in
0.45 s). An anti-unit1 is a unit1's dot and ring in the halo's red (the KO edge's 214, 18, 30 and 140, 0, 12) inside one of the sphere's
pentagons turned upside down, its point toward the sphere. The twelve are untouched: nothing of the page's drawing is moved, hushed or
covered, and a line breaks round the world it passes. The worlds' places are orbit-kick.js's list of the page's last frame, matched to the
satellites by nearness from frame to frame (the list's order changes as a world passes behind the sphere); with no list (`?hear=off`) the
twelve lines spread evenly round the sphere. They go with the sphere's own fade (the panel's C and B). prefers-reduced-motion: the ring
aligned and still, drawn once, no signal, no flare.

The pictures (`anti-satellites-pictures/`, the new Mac's run 6 at 20:48 WEST, cropped round the sphere; frames of the film, stripped from
GitHub by `tools/house-mirror/strip-families.txt` as THE CUTS' are): `anti-4.472s.jpg` the charge's first frame, the first signal leaving
the rim; `anti-5.106s.jpg` the satellites woken, scattered; `anti-7.751s.jpg` the middle, aligned; `anti-11.012s.jpg` the last frame before
the impact, the ring; `anti-11.045s.jpg` the impact, gone; `sheet-4.30-11.20s.jpg` every eighth frame of the window (run 5). The receipts:
`anti-satellites.proof.json` (1x, run 6) and `anti-satellites.proof.2x.json` (2x, run 4, the code before the first dash's minimum length,
which costs nothing).

## The cost, said as the screens' law says it

- **At rest nothing:** paused, no frame callback waits (a waiting requestVideoFrameCallback costs 17 to 24 ms of CPU a second at rest in
  WebKit, ko-edge.js), no timer, no requestAnimationFrame (the tests read the source for them).
- **Outside the window nothing:** the canvas is hidden and holds 0 x 0 pixels; the film's timeupdate is answered with a comparison.
- **Inside:** one draw for each presented film frame (requestVideoFrameCallback from 1 s before the window to 0.25 s after it), the boxes
  read once as the charge comes in and on a resize (no layout read a frame), the sprite painted once in idle time.

## On the hero: its two lines

`hero-ab.html`: `import {mountAntiSatellites} from './anti-satellites.js';` (after the orbit kick's import) and, in `ready()` right after the
KO edge's, `mountAntiSatellites({stage: found.stage, film: found.film, worlds: () => kick?.worlds ?? []});`. Its canvas goes in after the
stage's last canvas (the box's front layer), before the KO edge's layer and the page's controls. The fold lane (`lane/the-fold`) edits this
file beside me: my lines are away from its hunks, and `git merge-tree` of this lane with `lane/the-fold` (fe5bd22b, 20:50 WEST) is clean.
hero-ab.html's last commit was 467ab4b8 at 18:58 WEST, more than an hour before mine.

The brief named `mint-sphere.js` for the sphere; the hero's sphere is `app/warm-sphere.js`'s (the iframe's `genesisSphere`), whose public
handle the satellites read (`getViewState().radius`, its centre 55 % across and halfway down its canvas, the loop at 1.5 radii before the
network grows at 107 s). `mint-sphere.js` is the lab's clone and is not on the hero.

## Tests

`nice -n 19 node --test embertide-app/ui/intro/dyson-society/lab/anti-satellites.test.mjs` (from the house root): 14 tests, 14 pass, 0.55 s
(the film measured again with ffmpeg in 0.31 s when the film and ffmpeg are there; skipped in a clone without the film). The neighbours that
read hero-ab.html or the worlds: `ko-edge.test.mjs`, `orbit-kick.test.mjs`, `cuts.test.mjs`, 47 of 47.

The proof, on the new Mac (`tools/dolbar-charge.mjs` and the proof need ffmpeg and Chrome for Testing there):
`node embertide-app/ui/intro/dyson-society/lab/anti-satellites.proof.mjs --out <dir> [--scale 2] [--clip 4.3:11.2:2]`, about two minutes,
one Chrome, a door of its own on a port the OS gives; every request outside the tree refused (his tags' read too: nothing touched a Nest).

## The wishes it touches (rule 6; lines for the wishes doc)

- **Dyson Society mint page and $WARM mint** (new:dyson-society-minting), stays "not": Oct 14 2026 20:1x to 21:0x WEST, a lane that touched
  it (the seat given "Dolbar's charge: the signal to attack and the anti-unit1 satellites aligned", on his 19:37:56 words; house lane
  `lane/anti-satellites`, `dyson-society/lab/ANTI-SATELLITES.md`). The mint's hero in the lab (hero-ab.html) now shows Dolbar's charge,
  4.471 to 11.044 s: twelve anti-unit1 satellites woken by his signal, aligned on the lines from the sphere through the twelve worlds, gone at
  the impact; 0.13 ms a frame inside the window, nothing at rest or outside it. A lab page: optimism.fit's mint is unchanged and nothing is
  deployed; the wish (the page live, the mint running) is no nearer by it.
- **Unit2 named agents and the 2D swarm of clickies** (new:unit2-named-agents), stays "partly": the same lane. His Sept 18 "i wanna see the
  unit1s traveling across the screen doing whatever they wamma do" is met on the hero only as twelve anti-unit1s that wake, align and close in
  on Dolbar's signal while the twelve unit1 worlds fly their loop: a choreography of the film, not agents, no names, no unit2s.

## Not done, said plainly

- **Not on lysa and not in WebKit** (his Harmony window); the numbers are the new Mac's headless Chrome, with no panel's refresh in them.
- **Where Dolbar is:** I read him as the sphere (the film on its faces and its star; the signal leaves its rim). A point on the front face
  where his orb is (the film's left third at 3.8 to 4.3 s) would give one source and a fan of lines; that is a second candidate, not built.
- **When the charge begins:** at the flood (4.471 s), as his "when it becomes red halo" reads. The orb in his hand from 3.670 s draws nothing
  (13 to 73 thousandths of red); if he wants the satellites to stir at the orb, `ANTI.rise` is the one number.
- **The invitation bubble** ("Play with audio on", the page's own, while the sound is off) stands over the lowest satellites while they are
  still far out (5 to 8 s); they clear it by the impact.
- **A seek inside the half frame before a frame's own time** shows the satellites of that frame over the picture of the one before (the KO
  edge's convention, the same); in play every draw is on a presented frame's own time, so the two never part.
- The look is mine from his words; no word of his has seen it yet.

## His press

Nothing to land on a glass: it is a lab page. To see it, once a lander has merged `lane/anti-satellites`: hero-ab.html (`?v=film`), and
"To the interception − 3 s" (8.04 s, the satellites aligned and closing in) or a seek to 4.4 s for the whole charge.
