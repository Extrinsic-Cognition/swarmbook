# THE SWARM RESTS ON ITS CHAIRS (Nov 23 2026, seat claude-41008c71)

His words, UTC: "it is glorious. so? all built?" (over "The grammar, rehearsed"), then "Yes, build both" over the two pieces named to him: the snapped
rest and the progression level on the society page. Before them: Sept 25 "anchored to the normals to the pentagon faces normal to the center of the unit0
sphere"; Oct 21 "the unit1s should orbit geostationarily to the pentagons"; Nov 2 "u lost the link between the unit1s and his 12 pentagons... diocane". The
record: ec-workspace `docs/the-senatus-holy-origins-the-grammar-of-a-gvs-hypertrace-2026-11-23.md`, sections 9 and 13.

## What changed

THE SWARM PLAYS ITS VOTE (4f95984dc3, this morning) made the society page rest by pausing the engine wherever the orbit left it: at rest the child
swarms and the agents stood mid-loop, with no tether. That was this seat's own miss.

- **The snap** (`app/engine.js`: `snap`, `snapK`, `chairHome`). Inside the orbit mode, every child chamber eases from its loop onto the normal of its own
  pentagon at the orbit's radius, and every agent onto its own just above the face; the loops' ink fades as they come; the tether is drawn once a child is
  home. 0.9 s, a pure reading of the tree's clock. Off, the same in reverse: a vote de-anchors them (his Sept 6 "IN THIS MODE THEY GOTTA DE-ANCHOR").
  A consumer that never calls `snap` draws exactly what it drew (the wall, the wells).
- **It comes forward as it comes home** (`homeFit`; his "so this?" over a phone's still of THE THIN LINE at rest, the swarm a fifth of its stage). The orbit
  keeps a tree small to leave room for its loops, and a chain hangs off one side of its root. Home, the loops are gone: the middle of the whole tree eases
  to the stage's middle and the tree grows until its farthest body, as the eye sees it, nears the edge (2.4 times at most). A vote eases it back.
- **The page** (`app/polis.js`): it snaps at rest and lets go when a ballot or the record moves; the engine runs for the 0.9 s of coming home and is
  paused again. Under reduced motion it is home at once.
- **The progression level** (`app/polis-state.js` `levelOf`; the facts row): beside the seats, the treasury and the chambers, the chairs held of twelve
  (by a key or by a whole swarm) and the levels of the tree, the level's three numbers first (seats, chairs, levels). Five across where there is room,
  three and two on a phone (`app/polis.css`).
- A verdict once shown now holds on the phase strip until the next ballot (it flashed SUFFRAGIUM for 0.2 s just before rest).
- **Paid:** `app/tracenet-profile.mjs` and its test: no file of the house imports it and its one export, `mountProfile`, is named nowhere but in that
  test, since 22ba5c7383 (Nov 4 2026, THE VOW MAKES THE PAGE); `app/poetry.js`'s import of the poems, unused since the poem reader left this morning.
  `dl-voices.js` is also unwired and was left: it is his sealed talk on the mint's sphere.

## Numbers

| | before (main 249d3e8f88) | after |
|---|---|---|
| a child swarm at rest | wherever its loop left it, no tether | on its pentagon's normal, tethered |
| frames in 10 s at rest (THE SPLIT, 1440 by 1000) | 0 | 0, after 0.9 s of coming home |
| the facts (THE SPLIT) | 6 / 80 seats · 0.009 SOL · 3 chambers | the same, and 11 / 12 chairs held · 2 levels |
| THE THIN LINE on a phone (390 by 844) | | REIECTUM, rest at 32.8 s, 0 frames; 8 / 12 chairs held · 3 levels |
| page errors | | 0 |
| the root's ball at rest on a phone (THE THIN LINE, 390 by 844) | about 35 px across, off to one side of its chain | about 75 px, the tree centred |
| JavaScript (the gate's count) | | +57 -287, net -230 in 7 files |

Driven by `tools/house-mirror/spool/board/pw-cdp.mjs`, headless and off every screen, on devnet, the site served by `tools/serve-range`.

## Tests and gates

- `app/polis-rite.test.mjs`: red on main (`polis-state.js` has no `levelOf`), 6 of 6 here; the snap is tested on the engine itself in a made-up
  tree (off its chair in orbit, between at half the time, on the normal to 1e-9 when home, off again when let go, at once under `now`; a chain
  three deep comes forward until what the eye sees of it is between 0.8 and 1 of the stage). With
  `polis-knock`, `riders`, `after-the-mint`, `dl-mint-hexagon`, `dl-twelve` and `dl-tank`: 63 of 63. Every test of `app/`: 574 of 578, the four red main's own
  (`dl-athena`, `dl-handoff`, `dl-paywall`, `warm-sphere-moment`, each red alone on main too). `tools/embertide-mesh/lib/mint-drops` and `mint-floor`: 15 of 15. The 28 test files under `tools/` and the worker that read the society's app: all green.
- `the-javascript-only-shrinks` 31/31, `any-room` 12/12, `the-look-is-a-law` 2/2, `no-page-of-its-own` 3/3, `the-pixel-is-a-lookup` 3/3,
  `the-law-is-the-gate` 8/8.
- `no-landing-adds-a-failing-screen` on a173b0c081: shard 2 green (42 cells, 0 new); shard 1 red once on a cell this lane does not reach
  (after-the-mint-pool at 390 by 844: the film's "Skip ›" button at 12 px, caught while it stood), green on its second run on the same commit (42 cells,
  0 new). That button's size is main's and the film page's seat's.
- Rule 8, though no film and no sound is touched: `node --test app/dl-twelve.test.mjs` 21 of 21; `nice -n 19 node app/dl-twelve.proof.mjs --url <this
  tree's warm.html, served by tools/serve-range> --tap button` PASS, `--tap sphere` PASS.

## Not proven here

- Reduced motion in a browser: the driver cannot set it; the engine's `snap(t, on, now)` is tested, the page's passing of it is read, not driven.
- A live vote de-anchoring the swarm: no ballot opened on devnet; the record's replay lets go through the same call, seen 0.7 s after the press.
- swarmbook.com serves none of this until his deploy press (`worker/README.md`).

No gate yet: the measure it waits for is a society page at rest whose child swarm stands off its pentagon's normal or with no tether drawn, read from the
engine's layout at the rest's still, at the walk (the record's section 9).

## The first hand was refused, and why

3cda0b3de8 paid with `app/dl-tank.js` and its test, called dead by a search that read the site's folder and not `tools/`: the mint's keeper
(`tools/embertide-mesh/lib/mint-drops.mjs`) imports its `tankLine`. The lander refused it at 15:35 UTC, 2 new red (`mint-drops.test.mjs`,
`mint-floor.test.mjs`), 551 s of its gate spent. Mended: `dl-tank.js` and its test stand as main has them; the payment is `tracenet-profile.mjs`, searched
by file name and by export over every tracked file of the house (`git grep`, no cut on the output).
