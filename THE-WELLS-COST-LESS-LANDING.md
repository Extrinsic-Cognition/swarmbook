# THE WELLS COST LESS (Nov 23 2026)

Lane `lane/the-wells-cost-less`, seat claude-bd202a7f on the new Mac, cut from main 249d3e8f88. The four wells on the page after the mint were
painted far past the pixels they show, every frame, for as long as they were in view. They are now painted near their tile's own pixels, 30 times
a second. The look is the same.

## His words (UTC, Nov 23 2026)

- 14:41:05: "are the FPS optimized? is it rasterized as video or is it fucked up in ways?"
- 15:09:55, over the measure and the pick (keep them alive, paint them at the size they are shown, 30 frames a second, measure again): "Yes, cut it".

## The number first (the new Mac, a headless engine with the GPU on, 390 by 844, the wells in view)

Three runs each, main and the lane one after the other, the Mac under load 16 to 50 from other seats; CPU is the engine's own processes' CPU time
over 4 s, which the load does not inflate.

| | main 249d3e8f88 | this lane |
|---|---|---|
| a well's bitmap | 880 by 880 for a tile of about 380 device px | 440 by 440 |
| paints a second, each well | the display's rate (60 here, 120 on his Mac) | 30 |
| the engine's CPU, of one core | 63 % (68, 47, 73) | 37 % (33, 42, 37) |
| the page's drawing, ms a second | 144 (153, 116, 164) | 77 (65, 90, 78) |
| frames | 60 of 60, none over 17 ms | 60 of 60, none over 17 ms |

Predicted before the build: about an eighth (a quarter of the pixels, half the paints). Measured: a little over half. The floor, with a well painted
once a second: 5 % of a core and 13 ms a second. So the cost that is left is the paint itself, each tree's faces drawn one by one, and it follows
the paints a second; the pixels were the smaller part.

## Brought onto main 8b33d85020 (15:13 UTC)

THE WELLS FIT THEIR COLUMNS (lane/the-wells-fit-their-columns, this seat's fork claude-cb623661) landed on the same mount line while this lane was
measured: a well out of view is paused in the engine (an IntersectionObserver), so the page asks no frame at its top and foot. Both are kept on the
mount: that lane cuts the cost out of view, this one in view; the wells test keeps both assertions. "Rest" under Not done is that lane's for a
well out of view. The merged tree read once more with the wells in view, the Mac under load 170: 33 % of a core and 75 ms a second (a second run
lost its reading when an engine process ended between the two samples), against 48 % and 112 on the stage's main of 14:16 UTC.

## What lands

- `app/tree.js` mountTree: the bitmap's pixel ratio and the engine's cap are the caller's to say (`dpr: o.dpr ?? true, fpsCap: o.fpsCap`). Every
  other caller (the wall, a society's page) is as it was. The engine held both already; no line of `engine.js` changes.
- `app/after-the-mint-book.mjs`: a well, and a seated chair of the Pantheon, mount with `dpr: false, fpsCap: 30`.
- Cache words: `tree.js?v=wells-1`, `after-the-mint-book.mjs?v=book-6`.

## Not done (named to him)

- **lysa and a phone.** Not measured there; the frame time on the slowest glass is the metric (The performance culture, 3).
- **Rest.** A well still turns for as long as it is in view, and the page's ticker runs at the display's rate while one is mounted (13 ms a second).
- **The wall and a society's page** paint as before; not measured in this lane.
- **The hero's two stalls** over 50 ms in 5 s on his pane (worst 83 ms): not traced.

## The proofs (the new Mac, nice 19)

| | |
|---|---|
| `app/after-the-mint.test.mjs`, `swarmbook-film`, `riders`, `polis-knock`, `polis-rite` | 28 of 28 on the merged tip: every well's mount says `dpr: false, fpsCap: 30`, and a well out of view is paused |
| `app/dl-twelve.test.mjs` (The rule, 8; no film and no sound touched) | 21 of 21 |
| `app/dl-twelve.proof.mjs --url <the lane's warm.html, served with ranges by tools/serve-range> --tap button`, and `--tap sphere` | PASS and PASS: the sound came in where the picture was, and the picture never went back |
| `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs` | green: +5 −5, net 0 in 4 files |
| the screens gate (`no-landing-adds-a-failing-screen.1.sh`, `.2.sh`) | 72 cells judged (36 a shard), 0 new failing, 0 to take out; green in 69 s and 72 s on the merged tip (79 s and 76 s before the merge) |
| the wells on main and on the lane, the same still side by side (headless, 390 by 844) | the same picture, the lane's a hair softer; 0 page errors |

## No gate yet

The measure it waits for: the page's drawing in ms a second with the wells in view, read by a check in a headless engine against a baseline that
only shrinks; today the test pins the two options on the mount.
