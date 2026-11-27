# THE POET AND THE FIRST TRACE: at her station the Lyssajudron says a poem while the first trace is drawn from math, then one press to the trail (lane/the-poet-and-the-first-trace, Oct 30 2026)

The seat: claude-e0975625, on the new Mac. The lane is cut on lane/the-first-tracenet-on-main (21fdcf4cb), which is cut on main. Set aside by his words tonight,
and nothing of them is here: a fight at her station (lane/the-landlord-fight) and a framed page (lane/the-lyssajudron-explains-the-nexus).

## His words (UTC)

- **~23:2x,** over the framed page at her station: "focus on the geometry dude... i need to have the lyssajudron there be a poet... i need delicious outlining of the first
  tracenet + finally link to it (never fucking mention me by my name or username, it is ok to just have the click be the url being optimism.fit/photons_enjoyor u get me?"
- **Under the image:** Project Snowtrace's own, his since Sept 19.
  - "a leader is tracing a path in the snow the others can follow" (Oct 22 15:03);
  - "crystals of compute are frozen computations" (Oct 12 19:13);
  - "every problem is solved only once" (Oct 17 03:28);
  - and "i dont like generated images... i like math" (Oct 12).

## The scene (`app/dl-lyssajudron.js` POEM, SCENES.poem; `app/dl-lyssajudron-trail.mjs`; played by her station, `app/warm-spatial.js` encounter)

Her entrance (ゴゴゴ, ドン, her card), then six lines. Under each, the first trace is drawn from math on her night:

| she says | what is drawn |
| --- | --- |
| "Fresh snow. No one has walked here." | the snow: a hexagonal lattice of points comes |
| "One went first. The cold was theirs alone." (ザク) | the trail: a Catmull-Rom spline through its ten stations, outlined from its first point to its last, the one who goes first a light at its tip, the footprints laid either side as it passes |
| "Each step answered something." | a hexagon outlined edge by edge where five of the steps answered something, each tied to its step |
| "Answered once, it froze. It stays." (キン) | they freeze: ice within, a ring of light that breathes |
| "The others follow, in their prints." | the pack: eighteen others walk the trail, each a little behind the last |
| "The first trace. Walk it." | all of it lit; PROJECT SNOWTRACE over **THE FIRST TRACENET**, and its press **Follow the trail ↗** |

- **Where it goes:** the press goes to `https://optimism.fit/photons_enjoyor` (his address for it) in its own tab, `rel=noopener`. optimism.fit sends that address on to
  the first tracenet (the build's `_redirects`, read live: 302 to `/app/tracenet.html?of=photons_enjoyor`).
- **No name, no handle on the screen:** the handle stands in the press's address alone, and the test reads every word shown for it.
- **When it ends:** she stays with the trail until × (or Escape), then goes home at once. Her lines are a seat's draft from his, his to reword.

## Cost

- Nothing at rest. The trace is drawn in her own frame loop only while her poem plays: one 2D canvas at the screen's size and its pixel ratio (at most 2), and the
  geometry recomputed from ten stations each frame.
- Its module is 9 KB and reads nothing (no fetch, no timer of its own); the test holds that.

## Proof (the new Mac, nice 19)

- **`node --test app/dl-lyssajudron.test.mjs`:** 12 of 12. Three of them are new.
  - **The geometry, pure:**
    - the spline from its first station to its last, its length only growing;
    - the tangent a unit, the stations clear of her and of her words;
    - the steps in order, left and right either side;
    - six corners on each crystal's circle, a crystal at each answer;
    - the pack none before setting out, each behind the last, all at the end;
    - the snow a lattice inside the screen;
    - the module drawing only when asked and reading nothing.
  - **The poem:**
    - the drawings in their order, one image a line, the title and the press with the last;
    - the address his, and no name or handle in any word shown;
    - the press's own tab, the build sending a handle on to its tracenet, the first tracenet one it sends;
    - her entrance first, each line held until read and drawn, the trace and the press going with her;
    - her station playing `poem` with no `#refuel`, never back on her panel, his Harmony door standing.
  - **The poem on a page with hand-run timers:** each line with its drawing, the title and the press at the last, her staying a minute and more until ×, × once, and all
    of it gone with her.
- **Every test file of the mint plus the any-room gate:** 480 of 483. The 3 that fail fail on main too (THE DEPTH, the ice and accent tokens, her cut).
- **Rule 8:**
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url {serve}/embertide-app/ui/intro/dyson-society/app/warm.html --tap button`: PASS.
  - The same with `--tap sphere`: PASS.
  - The page was served by `tools/serve-range`.
- **On the page in the preview (800 x 860):**
  - the trail outlined with its prints, the five hexagons outlined then frozen, and the title with **Follow the trail ↗**;
  - the press's address read on the page: `https://optimism.fit/photons_enjoyor`;
  - two touches on the way: the trail lifted clear of her words, and her last sound let go so the title stands alone.

## Version tags

`dl-lyssajudron.js?v=poem-1` (`dl-lyssajudron-trail.mjs?v=trace-1`), `warm-spatial.js?v=poem-1`, `warm-entry.mjs?v=society-poem-1` (`warm-entry.test.mjs` follows).
