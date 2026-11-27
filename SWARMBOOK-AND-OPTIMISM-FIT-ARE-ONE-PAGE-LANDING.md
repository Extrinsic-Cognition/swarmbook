# SWARMBOOK AND OPTIMISM.FIT ARE ONE PAGE (lane/swarmbook-and-optimism-fit-are-one-page, Nov 18 to 19 2026, claude-7bd13290)

## His words (UTC)

- Nov 18 2026 ~23:5x, after the Swarmbook lineage (ec-workspace `docs/swarmbook-is-the-new-poleis-us-and-the-claw-riders-hypertrace-2026-11-10.md`,
  its section 7): "ok... but like... swarmbook and optimism.fit are unaligned still... u get what i mean? there is no video here dude..."
- Nov 10 23:48: "let's make swarmbook about $WARM... it would basically be putting all the latest optimism.fit is at, but on swarmbook.com... u get me?"
- Nov 13 15:15, over the page after the close: "there is absolutely no fucking linear connection between the fucking thing we did with the mint and the
  post-mint... you forgot all the shit we dide?"; ~16:15: "rename to swarmbook... dyson-society is a swarm part of the swarmbook".
- Oct 27 23:44: "the aiolos scene seya is drawing the arrow but after the mint is complete, the arrow is let go of".

## What stood (read live, Nov 18 2026 23:5x UTC)

- `https://optimism.fit/` opened `app/after-the-mint.html` (the mint closed, worker/premint.mjs THE FRONT DOORS): the ball with nothing in its core,
  no film, the mark DysonLight Harmony.
- `https://swarmbook.com/` opened `app/swarmbook.html`, a page of its own (the Nov 13 page he judged "low quality html css basics... nothing
  delightful atm"), no film.
- The film lived on `app/warm.html` alone (the mint page). The live Worker is the one deployed Nov 13 16:5x from `lane/swarmbook-dot-com`, never
  landed; main had nothing of Swarmbook.
- `lane/the-page-is-swarmbooks-the-dyson-society-its-swarm` (seat claude-552ca914, Nov 13 to 14, 14 commits, its receipt
  `THE-ARROW-IS-LET-GO-IN-THE-BALL-LANDING.md`) had made the page after the close Swarmbook's with the Saint Seiya film in its ball, and was never
  handed. Its last commit (Nov 14 00:49) put the swarms' timing back to the one he called right ("you had it time well originally").

## What this lane does

1. Merges that lane into main as it stands (no conflict; main had not touched those files since its base).
2. Adds `swarmbook.com` and `www.swarmbook.com` to the Worker's routes (`wrangler.optimism-fit.jsonc`) with no front door of a host's own: `/` on
   either name opens the same page, which since the mint closed is `app/after-the-mint.html`, now Swarmbook's.
3. Keeps `preview_urls` on, as the live Worker has it since his Nov 14 01:19 "Allow the preview" (4dde65b211), so a deploy from here does not turn it off.

What a publish from here changes on the live site: both names open the one page with the film; `/app/swarmbook.html` and the door
`/space-router/v1/mine` (read only by that page's script) are no longer served. Main brought no other change to the site since the live cut.

## What it costs

From the merged lane's receipt: one frame of the sphere a display frame while the tab shows, about 14 s of a 0.94 Mbit/s film a load (of the order
of 1.7 MB) by range requests. This lane's own change is configuration: no JavaScript, no new request.

## The numbers

- New Mac, scratch worktree at 45c321435b (node 26.13.1, nice 19, background band), Nov 19 00:0x UTC: `app/after-the-mint.test.mjs` 7 of 7,
  `app/dl-twelve.test.mjs` 21 of 21, `app/dl-kit-deposit.test.mjs` 8 of 8, `tools/site-files.test.mjs` 4 of 4, `worker/premint.test.mjs` 27 of 27;
  the-javascript-only-shrinks 19 of 19 (this lane +22 -22, net 0 in 3 files), the-look-is-a-law 2 of 2, no-page-of-its-own 3 of 3.
- A real browser (the app's browser pane on this MacBook, the lane served by `tools/serve-range` on 127.0.0.1:18991, the film answering a range
  request with 206), Nov 19 00:1x UTC: the title "Swarmbook · The Dyson Society", the mark SWARMBOOK over The Dyson Society; 3 s after the load the
  film `saint-seiya.mp4#t=120.65` playing in the ball's core at 127.88 s, muted, `data-arrow` drawn; at 13 s the film paused at 135.3 s (the strike
  is 134.8 s) and the page scrolled on to "Prompt to mine".
- Rule 8: the film here is the picture alone (no sound), so a tap never starts a song on this page; the mint page's proof is unchanged.

## THE FILM STOPS ITSELF AT THE STRIKE (Nov 19 2026, 00:1x to 00:4x UTC; bfc4a6ffbc)

His words: "it is still fucked up... check frame by frame the hero player and the frames played please", then "frame by frame" over the strike's
frame in the ball.

- **The film's own frames** (ffmpeg, four a second, 116 to 140 s): the gold aura and the aim to 121.7 s, the cliff, Dolbar from 122.75 s, "Dolbar!
  Take this arrow of justice!" from 124.5 s, Dolbar's sword at 127.75 s, the loose at 128.66 s (Seiya's face and the beam), the blue flight from
  131.25 s, THE STRIKE from 134.25 s, a cut at about 135.30 s (a key frame at 135.302 s) to a green crystal.
- **The page at full speed** (a GPU Chrome on the new Mac, `--headless=new --use-angle=metal`, a still every 49 ms with the film's time read just
  before it, every presented film frame by `requestVideoFrameCallback`): 420 film frames presented from 120.62 s to 134.80 s, 415 of 419 steps
  one frame, none back; the core's picture matches the film's own frame at the same time in all 51 quarter-second pairs but the first, where
  the ball shows a burst of white sparks for the first ~0.4 s before the film's first frame; rests at 134.821 s on the strike.
- **The page in the app's pane on this MacBook, hidden while it played:** the page drew about once a second (its animation frames 1008 ms apart at
  the 90th percentile), so the core showed 61 film frames of 462, a second of film at a step, and the stop, read only when the page draws
  (`after-the-mint-tree.mjs`: `s >= STRIKE_S`), came late: the film rested at 135.3 s, on the green crystal. The pane at rest gave 120 frames a
  second, so the slowness was the hidden pane's, but a visitor's background tab gets the same late stop.
- **Reproduced** on the new Mac with the page's frames held to one a second and its thread free (a scratch `requestAnimationFrame` through a 1 s
  timer): rested at 134.886 s, then 135.765 s (the green crystal).
- **The fix:** `src="./saint-seiya.mp4#t=120.65,134.8"`. A media fragment's end is kept by the browser's media clock (Chromium's progress timer,
  every quarter second), not by the page's frames. One attribute changed in place.
- **After it:** one frame a second, three runs: rests at 134.853, 134.840 and 134.953 s, all on the strike; full speed: 134.832 s. The tests again
  on the new Mac: `app/after-the-mint.test.mjs` 7 of 7, `worker/premint.test.mjs` 27 of 27, the-javascript-only-shrinks 19 of 19 (net 0), the
  look 2 of 2, no page of its own 3 of 3.
- **Not mended:** the spark burst of the first ~0.4 s, before the film's first frame reaches the core.

## Not done

- Not handed; not published. The publish is his press: from `embertide-app/ui/intro/dyson-society` of a tree that holds this lane, with the ignored
  media linked in a worktree, `node tools/build-optimism-fit.mjs` then `npx --yes wrangler@4.151.0 deploy --config wrangler.optimism-fit.jsonc`.
  The way back: `npx --yes wrangler@4.151.0 rollback b5fd510d-144e-4d92-b9eb-ffa65be32bd0 --config wrangler.optimism-fit.jsonc`.
- Not seen on a phone or on lysa. What he still called wrong in the swarms' flow on Nov 14 is not known (the merged lane's last section).

## THE THREE WAVES, THE LIGHT AND THE HERO BECOMES THE BAR (Nov 19 2026, 00:5x to 01:3x UTC; f4eb0ddbcd to e12fa79b0e)

### His words (UTC, as relayed to this seat)

- ~00:50, over the page's ball at the strike with five unit1s circled on the cage, and an arrow drawn from the loose across the film's blue
  flight frames: "u see that when the arrow lands there are still some unit1s there... i wish you did something proper... you get what i mean?
  like... why dont we brainstorm something like... have all the unit1s also towards here hit dolbar, then have a giant beam of light and then
  evolve the hero to have 12 pentagons horizontally laid up top bar..."
- ~00:45: "i also think that there's more anime there... you are stopping the anime sooner than its natural ending..." (3e5a78ea85: the film's
  address ends at 145.05 s; e18cc82bd6 moved it to 144.9 s, clear of the black.)
- ~00:50, the anime's last golden frame (145.25 s) boxed and the black end card crossed out: "see here the final one is exactly what i said must
  have introduced the light and all shit... u remember?" Before it, over the mint's hero: Oct 16 01:35 "the anime has that fucking cool light
  transformation transfusion transcension yet you made this cheap plastic trash"; Oct 17 21:24 "...they must rapidly but lyssajudrean erratically
  arrive like a boomerang back to the sky light egg, check the anime dude".
- ~01:08, over the first cut (THE TWELVE GO HOME, f4eb0ddbcd) frame by frame: "change the order there... im so unsatisfied... you could have the
  unit1s do first, then unit2s than swarmlings... like... look here dumbass... u dont see there's many moments where you could be artistic yet you
  find yourself to be a subservient to the death cult? dolbar is bad".

### As built (every motion a function of the film's second; app/after-the-mint-tree.mjs, app/warm-sphere.js)

1. **THE THREE WAVES** (5a38555fa9, 838d3f8e86). Dolbar is the enemy: nothing of ours goes into him. The unit1s leave their chairs at his loose
   (128.662 s), sweep round the cage's rim into a fan of twelve on its left (whole by ~130.9 s, while the arrow rides his golden beam) and dive at
   his blue face one after another, 131.25 to 131.75 s. The unit2s sweep round to the top and rain down along the white streak, 132.0 to 133.5 s.
   The swarmlings (the unit3 leaves) leave their hexes as a flock and strike as he raises his sword, 133.75 to 134.16 s. Each body breaks on him
   where it hits: a flash and sparks, the body gone. The arrow strikes at 134.25 s (STRIKE_S) on a bare cage, and the film plays on.
2. **THE LIGHT** (ff56724c9c). From 143.25 s, as the anime's golden rays engulf Dolbar, the core's light floods the ball and a gold-white column
   rises from the core to the window's top in half a second, a light at its head; it is gone by the film's end.
3. **THE HERO BECOMES THE BAR** (2e472975ac, 6205bfb9b4, e18cc82bd6). From 143.55 s the cage's twelve pentagons leave their faces, 0.045 s
   apart, each in 0.8 s, the last in by 144.85 s: a boomerang's way up the beam past the bar toward the light at the window's top and back down
   onto its place, tumbling and flipping on a Lissajous figure of its own, landing point up; each face it leaves stays lit. The ball goes out over
   the film's last 0.75 s. At the film's end (END_S, 144.9 s: its address's end, and the page's own check; e18cc82bd6 moved it from 145.05 s so
   the browser's late stop clears the black) the bar stands: the film paused on the golden rays, the ball gone (html[data-arrow="bar"]), the twelve
   in a row in the header beside the SWARMBOOK mark, the sphere paused, nothing drawn after; then the page scrolls to its words once if the
   visitor's hand has not touched it.
4. **Reduced motion, no film, or a film not started in 4 s:** the bar at once, no ball, no scroll (a failed film still scrolls).

### Each choice, in one line

- The page steers the waves through one field of the rite's own answer (`strike`), which the mint page never sets; there the volley never fires.
- Wave one's fan stands on the cage's left (±50°, 1.5 radii), my reading of "a fan behind" an arrow flying right; it gathers by a sweep round the rim.
- The way to the fan or the top is a sweep round the outside in polar terms, so no body crosses his face before it hits.
- A dive gathers speed (the square of its time): 0.45 s for the unit1s, 0.35 s for the unit2s, 0.55 s from the hex for a swarmling.
- Each wave's hits come in an order of its own (steps 5, 89 and 1001, prime to 12, 144 and 1728).
- Where a body hits is strewn over the disc by the R2 sequence (the golden angle drew one spiral arm, read in the first recording).
- A strike's light is the arrows' own glow sprite, added: flashes 0.42, 0.16 and 0.06 radii by depth, 10 and 5 sparks for unit1s and unit2s, 0.4 s.
- A swarmling's flash is 0.3 of the glass, so 1,728 of them read as sparks and do not white out his face.
- A body behind the cage brightens to a front one's glass as it comes round, and a striking body rises from the satellites' third to whole.
- The children's links fade with a striking parent, and a unit1's ribbon follows the way it flew.
- STRIKE_S moved from 134.8 to 134.25 s, the strike's first frame (data-arrow 'struck' there; the film never stops there now).
- END_S and the film's address end moved from 145.05 to 144.9 s: the browser stops late by up to 0.26 s (read at one frame a second), so the rest clears the black (145.379 s) by 0.2 s.
- The beam is 0.9 radii wide, a horizontal gradient #f0cf74 to #fff to #f0cf74; its head 1.6 by 0.55 radii, #fff and #fff3c4 (the freeze plate's list).
- The ball's light is a radial glow added on the sphere's own canvas, reaching 1.6 radii.
- The bar is a svg in the header (twelve slots in a 120 by 10 box): between the mark and the label on a desk, its own row under the mark on a phone.
- Pentagon i goes to slot i, so the bar reads the chairs I to XII left to right; gold #f0cf74 edged in cream #fbf6ea.
- The header stands over the page (z-index 3) and its svg draws past its box: the beam and the flights cross the hero.
- At the bar the hero's column collapses (the words take its whole width): a cut, since the sheet holds no transition.
- The page's scroll moved from the strike to after the bar; with the hero collapsed it moves nothing at 1440 by 900 or 390 by 844.
- Dead under this law and taken out: the calm path's camera turn, zoom and THE BALLS STAND CLEAR, the WILD lead, and the sphere's setOrbit door.
- The carpet's glints are not drawn on the stop (e12fa79b0e): at one frame a second they stood frozen on the cage from 128.7 to 144.5 s.

### The numbers

- JavaScript (the gate on the new Mac at e12fa79b0e): this lane +72 -75, net -3 in 4 files.
- New Mac, node 26.13.1, nice 19, at e12fa79b0e (and app/after-the-mint.test.mjs and the JavaScript gate again at e18cc82bd6): app/after-the-mint.test.mjs
  8 of 8, worker/premint.test.mjs 27 of 27, app/dl-twelve.test.mjs 21 of 21, tools/site-files.test.mjs 4 of 4, lab/rite-unit1s.test.mjs 33 of 33,
  app/dl-mint-flask.test.mjs 6 of 6, app/dl-kit-deposit.test.mjs 8 of 8; the-javascript-only-shrinks 19 of 19, the-look-is-a-law 2 of 2,
  no-page-of-its-own 3 of 3. app/dl-paywall.test.mjs 35 of 36, app/warm-sphere-moment.test.mjs 10 of 11 and lab/heartbeat.test.mjs 8 of 9 are
  main's own failures: each fails the same one test at main (a33f2bda07), 1bacb479b9, 3e5a78ea85 and e12fa79b0e (Harmony's orange token, her
  cut's 29.563 against 29.5629, the warm page's ?v=mint-3 import).
- A real GPU browser on the new Mac (Chrome for Testing, headless new, ANGLE Metal on the M5 Max, the lane served by a range server, the film
  answering 206), the exact viewport set by the emulator, a still every ~49 ms with the film's time read before it:
  | run, at e18cc82bd6 | film rests at | clear of the black | frames in 10 s at rest | sphere draws | the two stills |
  |---|---|---|---|---|---|
  | 1440 x 900, full speed | 144.948 s, paused | 0.43 s | 0 | 0 | identical |
  | 1440 x 900, one frame a second | 145.030 s, paused | 0.35 s | 0 | 0 | identical |
  | 390 x 844 at 2x, full speed | 144.925 s, paused | 0.45 s | 0 | 0 | identical |
  | 390 x 844 at 2x, one frame a second | 144.989 s, paused | 0.39 s | 0 | 0 | 6,350 channel values of 3,949,920 differ by 1 level (a re-raster of the plates' blurred shadow) |
  The black begins at 145.379 s. Before e18cc82bd6 (the end at 145.05 s) the one-frame-a-second runs rested at 145.310 and 145.295 s, two frames
  from it; at full speed at 145.092 and 145.051 s.
- Read tile by tile, 1440 full speed at e18cc82bd6 (quarter-second stills from 128 s): the unit1s move at 128.76; the fan on the left at 130.98;
  their strikes on the blue face at 131.25 to 131.75; the unit2s at the top raining along the streak from 131.99 to 133.24; the swarmlings off their
  hexes at 133.50, their storm at 133.76 to 134.0; the cage bare from 134.24 (hexagons and the twelve chairs only) through the crystal and the
  shatter; the light at 143.52, the beam at the top at 143.74 with the first pentagons leaving; the pentagons up the beam at 143.97 to 144.24; the
  row in the header at 144.49 to 144.74; all twelve in and the ball and the beam gone at 144.87; the bar standing at 144.95. The phone reads the
  same beats, its bar in its own row under the mark.

### Not done

- Not seen by him; his eye judges the look. Not handed; not published.
- After the bar the ball is gone, so the deposit door opens its kit with no stem from the visitor's cell, and the flask's liquor is not seen.
- At 390 wide the unit1s' fan brushes the canvas's left edge; the phone keeps an empty row under the mark until the light.
- At one frame a second the light and the flight are seen in about two frames and the ball's fade not at all; the next frame lands on the bar.
- The three failing tests above are main's own, not mended here. Not measured on lysa or a real phone.

## NO DEAD SECOND (Nov 19 2026, 01:5x to 03:xx UTC; a5d3c0570f, 90d66c3392, 964ddf3942, f1a1103a0c)

His words, ~01:45 UTC, over the page stepped frame by frame: "it is so badly interpolated... i feel like you dont rewatch shit before submitting
to me... there are a shit ton of dead moments... you must fucking rewatch frame by frame". The coordinator's measure, on every film frame (the
film paused and sought to each one, a still after two animation frames; the ring's motion is the mean change between consecutive stills on the
ball outside its core): nine seconds dead after the strike (134.25 to 143.25 s, 270 steps at 0.01 to 0.03), an even drift before the loose, a pop
as the page opened (120.85 s, 9.3 against 0.9), the fan a clump on the cage's left edge, the storm stopping dead, the beam a line, the pentagons
piling at the bar, the words cut.

### As built (after-the-mint-tree.mjs; every motion the film's second's, eased)

- **The opening:** the page opens on the drawn arrow's own frame, held; the walk to it (the illustration's carpet and its glints) is gone.
- **The draw, 120.65 to 128.66 s (drawOf):** in his gold aura every family glows and circles, on until the bow is drawn; on the cliff (121.75 s)
  they spread wide; as Dolbar comes (122.75 s) a glow runs round the ball; through "Dolbar! Take this arrow of justice!" (124.5 to 127.5 s) the
  swarm is drawn back as a bowstring, slow and then faster: the twelve to an arc on the far (left) side, the unit2s and the swarmlings drawn in
  and stretched after them; at his raised sword they tremble at full draw; at the loose the unit2s and the swarmlings spring back onto their
  hexes, a spring that starts from rest.
- **The fan, 128.66 to 131.25 s:** from the bow's arc the twelve open into a fan of 1.2 radii on the left (inside the canvas at 1440 and 390)
  and fly with the arrow, swaying, then dive at his blue face one after another (131.25 to 131.75 s).
- **The waves, 131.25 to 134.25 s:** as before (the unit2s rain from the top along the white streak, the swarmlings strike as a flock as he
  raises his sword), each strike throwing its sparks outward as embers (emberAt), out past the disc.
- **After the strike, 134.25 to 143.25 s (stage, emberAt):** a shockwave of two rings out of the core, flaring the embers and pushing them out;
  through the crystal and its blue beam the embers drift and gather along the beam's way, flowing, and the twelve chairs light one by one, a
  count to twelve, shimmering; at the shatter the ball shudders (its own camera, eased in, dying out) and the embers burst; over the sword and
  the wide shot they settle into a slow ring and the lit chairs pulse, growing toward the light.
- **The light, 143.25 to 144.9 s:** the beam is as wide as the ball (2.4 radii), a column from the window's top to under the core shown by a mask
  from the core up, soft at both ends, its head slowing as it reaches the top (0.7 s); the embers rise into it and go; each socket lights as its
  pentagon leaves; the pentagons leave 0.04 s apart from 143.45 s, 0.95 s each, eased (seen leaving, seen landing), up the beam and out under
  their own slots into them; the ball goes out over the last 0.75 s; the words slide to the place the hero leaves them (144.3 s to the end,
  sideways on a desk, up on a phone), so the bar's layout comes on with no jump.
- warm-sphere.js: the page's answer carries a glow (its sixth word); the strikes throw no sparks of their own (the embers are the sparks).

### The numbers

- The coordinator's stepper, on the new Mac at f1a1103a0c, every film frame from 120.75 to 144.88 s (724 steps), measured with his ffmpeg
  line (the ring: the ball's crop with its core boxed out; the header: the top 90 px):
  | run | runs of over 15 steps under 0.15 | steps over 4 times their 10 neighbours' median | least / median step by beat group: draw, fan, waves, after the strike, light |
  |---|---|---|---|
  | 1440 x 900, ring | none | none | 0.61/3.71, 1.37/2.31, 0.09/5.01, 0.39/0.67, 0.76/3.57 |
  | 1440 x 900, header | (still before the light, by design) | none above the JPEG noise (8 at 0.000 to 0.004, medians 0) | |
  | 390 x 844 exact, ring | none | none | 0.78/4.21, 1.84/2.84, 0.19/5.97, 0.61/1.02, 1.13/4.34 |
  | 390 x 844 exact, header | (still before the light) | none | |
  Before this rework, at cab983c30d: one run of 279 steps under 0.15 (134.05 to 143.35 s) and the pop at 120.85 s. The 390 runs need the
  viewport set exactly (a headless window keeps a least width of its own, so a 390 window laid the page out wider): a copy of the stepper with
  the emulator's metrics, its ring crop 195x203 at (0, 57), the core boxed out 92 px.
- Read by eye, consecutive stills at every beat, 1440 and 390: the opening with no burst; the circling and the spread; the glow running round
  as Dolbar comes; the bow drawn and trembling; the spring back and the fan opening; the fan's dive and its flashes; the rain along the streak;
  the flock and its storm resolving into embers; the shock rings; the embers gathered along the crystal's beam and the chairs lit one by one;
  the shudder and the burst; the ring of embers; the light and the giant beam; the pentagons up the beam and into their slots; the words sliding.
- Tests on the new Mac at f1a1103a0c (node 26.13.1, nice 19): app/after-the-mint.test.mjs 8 of 8, worker/premint.test.mjs 27 of 27,
  app/dl-twelve.test.mjs 21 of 21, tools/site-files.test.mjs 4 of 4, lab/rite-unit1s.test.mjs 33 of 33, app/dl-mint-flask.test.mjs 6 of 6,
  app/dl-kit-deposit.test.mjs 8 of 8; the-javascript-only-shrinks 19 of 19 (this lane +73 -75, net -2 in 4 files), the-look-is-a-law 2 of 2,
  no-page-of-its-own 3 of 3.
- The stop and the rest at f1a1103a0c (the four runs as before): 1440 full speed 144.906 s, 1440 one frame a second 144.974 s, 390 full speed
  144.912 s, 390 one frame a second 144.942 s, all paused on the golden rays, 0.4 s or more clear of the black; with the bar standing, 0 frames,
  0 asks and 0 sphere draws in 10 s in all four, the two stills identical but at 390 full speed (6,350 channel values of 3,949,920 differ by 1
  level, the plates' blurred shadow re-rastered).

### Not done

- He has not seen it. Lysa and a real phone not measured. The 30-a-second page is held to the sphere's held rate (HELD_FPS, 30 a second); a
  60 Hz glass draws every other frame.
