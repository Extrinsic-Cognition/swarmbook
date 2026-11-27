# THE TWO SIDES COME ALIVE (Nov 23 2026)

Lane `lane/the-two-sides-come-alive`, seat claude-bd202a7f on the new Mac, cut from main 88801824d5. "The two sides" of the page after the mint
were the last pixel pictures on the site: the pool with twelve chairs and the flask feeding three agents. They are now drawn live, and no pixel
picture is left on the page.

## His words (UTC, Nov 23 2026)

- 10:40, over the walk of the pages (the wells, the pool, the flask): "the pixel images ruin the day... i wish we could use something more magical".
- ~13:4x, after THE WISHES ARE SWARMS had replaced the wells and three beats only: "didnt we say to replace the pixel arts with more delightful shit? that
  was merged or what?".
- Then "Yes, build them", over the drawing on the Canvas (Claude page, widget `29efaa12`, 3200,706430).

## The cost first

| | main 88801824d5 | this lane |
|---|---|---|
| Keep your SOL · Fuel the swarm | `swarm-pool.webp`, a pixel pool | the Pantheon: twelve pentagon chairs round a pool of gold that breathes and ripples; a society the Fund seats turns live on its chair, an empty chair bare |
| The egg is yours · Ride the swarm | `swarm-flask.webp`, a pixel flask | the rider's hexagon wearing her Lyssajudron (her default), three unit1s in orbit, each fed by a gold thread |
| pictures asked | two webp, 640 px | her default (21 kB, already cached across the site); a seated chair is one tree, as a well is |
| at rest | still | the compositor alone: three dots turn, one glow breathes (transform and opacity); nothing under reduced motion |
| pixel scenes in the tree | 9 webp, 2 on the page | none |
| JavaScript | | +8 −8, net 0 |

## What lands

- `app/after-the-mint.html`: the two drawings, in place of the two pictures.
- `app/after-the-mint-book.mjs`: `read()` keeps each society's chair in the Fund (by fees, the wall's order); `on()` mounts a seated society's own tree
  on its chair after the wells, with the wells' mount; a chair no society holds stays bare.
- `app/swarmbook-book.css`: the two drawings' styles; cache word `book-12`.
- Out of the tree, no page loading any of them: `swarm-pool`, `swarm-flask`, `swarm-bond`, `swarm-whim`, `swarm-road-1` to `swarm-road-5` (webp).

## What the page shows today, read off devnet

The Fund stands and seats no society yet (0 of 12, read on main's page through `tree.js` GENERATIONS), so all twelve chairs stand bare round the pool
until one is seated; the drawing on the Canvas showed four seated, from the wells, as a sketch of a seated chair.

## Not built (named to him)

- **The rider's own Lyssajudron on the flask.** The page after the mint knows no visitor's picture (no portrait, no rider key on it), so the hexagon wears
  her default for everyone; it needs the riders' door read by the flask's key.

## The proofs (the new Mac, nice 19)

| | |
|---|---|
| `app/after-the-mint.test.mjs`, `app/swarmbook-film.test.mjs`, `app/riders.test.mjs`, `app/polis-knock.test.mjs` | 24 of 24: a seated society's tree on its chair after the wells, an empty chair bare; the page holds no pixel picture; the Pantheon's twelve chairs and the flask's three unit1s; her default on the flask |
| `app/dl-twelve.test.mjs` (The rule, 8; no film and no sound touched) | 21 of 21 |
| `app/dl-twelve.proof.mjs --url <the lane's warm.html, served with ranges by tools/serve-range> --tap button`, and `--tap sphere` | PASS and PASS: the sound came in where the picture was, and the picture never went back |
| `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs` | green: +8 −8, net 0 in 3 files |
| the screens gate (`no-landing-adds-a-failing-screen.1.sh`, `.2.sh`) | 36 cells judged (18 a shard), 0 new failing, 0 to take out; green in 77 s and 77 s |
| main's built site with this lane's three files laid over it, behind the Worker's own handler on an empty D1, a headless engine off every screen: `after-the-mint.html?side=pool#preview`, the hero skipped, at 390 by 844 and 1280 by 900 | both drawings stand on both sizes; 0.39 % and 0.22 % of the pixels moved between two stills 3.5 s apart (the unit1s, the pool); 0 page errors |

## No gate yet

The measure it waits for: a pixel picture on a page of the site, read by a check over the pages' image sources against the assets' kinds; today
`after-the-mint.test.mjs` pins that this page holds none.
