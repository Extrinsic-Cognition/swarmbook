# THE BUILT FRONT LOADS ITS FLOOR (lane/swarmbook-one-branch, Nov 20 2026)

## His words

Nov 20 2026, UTC, seat claude-7209e519's chat. Asked "Land the fix so the publish can go ahead?", after he was told the site built from main had the front's chamber
dead and that the fix was checked on a fresh build, he answered at 05:29:53: **"Hand it, pass +8"**.

The +8 could not be written: the gate's own check of every pass (`the-javascript-only-shrinks.test.mjs`, the test of each temporary exception) samples a net of 10,
so an exception capped under 10 is red there, and no pass before this one had been under +14. Told so and asked "The JS gate's own check refuses any pass under +10.
How do I land the fix?", he answered at 05:47:36: **"Pass +10"**.

## What it mends

Walking the site built from main a04aec9436 for his publish press (headless Chrome, the build served with byte ranges), before anything went live: the front's
chamber did not run on the built site (no floor, no diving one). `room/assembly-floor.mjs` (THE ONE FLOOR LANDS, main 0b46e4cbf3) imported
`../dyson-society/app/assembly-geometry.js`; the site's build (`tools/page-files.mjs`) places each file of the tree once, and that one was already placed at `/app/`
for the mint page, so `/dyson-society/app/assembly-geometry.js` answered 404 and the front's whole module graph failed. The live site never had it (its last
publish was built from main 9c1299d590).

## What lands

- `room/assembly-floor.mjs`: no import outside `room/`; `floorRows(floor, skinOf)` and `floorOn(A, doc, skinOf)` take the land law's skin builder.
- `app/assembly-dive.mjs`, `app/swarmbook.mjs`: they hand `buildAssemblySkin` from `./assembly-geometry.js`, their own place in the tree and in the build.
- `assembly-home.mjs`: a page's floor comes with the page's skin; on the house's own glasses the skin is loaded where the house serves it.
- `app/assembly-dive.test.mjs`: a guard that the floor module names no other folder.

## Read

- The site built from the fix (1732 files), served with byte ranges: the front's chamber runs (the dodecahedron with the door's empty list; 30 places, 12 faces
  with `?pour=12`); `swarmbook.html`'s ball the same floor; the mint page's film paused on the arrow at 120.7 s on the dodecahedron.
- Rule 8: `nice -n 19 node app/dl-twelve.proof.mjs --url <the built warm.html> --tap button` and `--tap sphere`: both pass true; `node --test app/dl-twelve.test.mjs`
  21 of 21 on the new Mac.
- On the new Mac at 9157c4b4d6: `assembly-dive` 10, `swarmbook` 7, `swarmbook-floor` 11, `dl-twelve` 21, `room/assembly-gpu` 13, `tools/site-files` 4,
  `after-the-mint` 8, `mint-floor` 4, `harmony-front-door.welcome` 3. None red.

## His pass of the JavaScript

The lane against main c6f1b81699 (merged in at b3d0d14908; main moved none of the fix's files): +28 -20, net +8 in 6 files. His "Pass +10" is the gate's exception,
`the-built-front-loads-its-floor-exception-2026-11-20.json` beside this receipt (the base, his words, the net 8, the cap 10, every counted file's blob before and after,
the gate file's own), and its entry in the gate's approvals, written at the end of the last entry's line. It covers these bytes only.

## After it lands

The next publish (seat claude-eee8b377's, carrying its egg ticket and seat claude-93958ebc's split) waits for it and walks the built front and mint page first.
