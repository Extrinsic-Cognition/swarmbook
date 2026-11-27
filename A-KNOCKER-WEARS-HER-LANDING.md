# A KNOCKER WEARS HER (Nov 23 2026)

Lane `lane/a-knocker-wears-her`, seat claude-bd202a7f on the new Mac, cut from main d04ae412ea. A hexagon that stands for a person wears a
Lyssajudron: theirs when the page has it, else her default. Three such hexagons were still bare ivory on main after A HELD HEXAGON WEARS HER,
which mended the balls only: the Knock card's, each knocker's in the ring at the door, and the mint page's. Empty seats on a ball stay bare.

## His words (UTC, Nov 23 2026)

- 2026-11-23T13:10:44Z, a comment pinned on the Canvas (Claude page, 800,707320) over the Knock screen of the site's tour: "@Swarmbook status
  check this shit cant be blank hexagon diocane".
- Before it: 12:27:39Z "why u making hexagons blank in some?"; 12:29:04Z "yeah. build all" (to a hexagon somebody holds always wearing a Lyssajudron).

## The cost first

| | main d04ae412ea | this lane |
|---|---|---|
| the Knock card, a visitor with no minted Lyssajudron | a bare ivory hexagon | her default Lyssajudron |
| a knocker at the door the house holds no picture of | a bare ivory hexagon | her default Lyssajudron |
| the mint page's hexagon, no colours in this browser | bare ivory, and stays so | her default until the person's own picture, colours or portrait comes, then theirs in place |
| the hexagon the mint page carries from the knock's place before its ball draws (`dl-mint-hexagon.css`, `body::before`, its first 1 to 2 s) | bare ivory | her default, as the knock showed it |
| asks | | one picture the site already ships (`app/assets/her-default.jpg`, 21 kB), once a page, cached |
| at rest | | nothing new |
| JavaScript | | +11 −11, net 0 |

## What lands

- `app/polis.css`: `.her` carries her default under any face of its own (one line, one comment line). polis.js sets a face only where it has
  one, so the Knock card (`polis.js` openKnock) and the ring (`polis.js` the waiting knockers) wear her with no line of their own.
- `app/dl-mint-hexagon.js`: `paint()` loads her default when neither a picture nor colours stand, marks it `S.hers = false`, and keeps trying for
  the person's own; their picture, colours or portrait replace it in place with no fade back through blank.
- `app/dl-mint-hexagon.css`: the hexagon carried from the knock's place (`html[data-hexmint] body::before`) wears her default under its ivory, so
  the flight from the Knock card to the ball shows the same face from end to end. Found by a sweep of the site for every ivory hexagon after the
  first hand; the ball's paper colours in `engine.js` and `orb.js` are vote states under the faces and stay.

## The proofs (the new Mac, nice 19)

| | |
|---|---|
| `app/dl-mint-hexagon.test.mjs`, `app/polis-knock.test.mjs`, `app/riders.test.mjs`, `app/after-the-mint.test.mjs` | 31 of 31: no colours here, her default in her hexagon, never a blank; colours here, her own; `.her` and the carried hexagon carry her default |
| `app/dl-twelve.test.mjs` (The rule, 8; no film and no sound touched) | 21 of 21 |
| `app/dl-twelve.proof.mjs --url <the lane's warm.html, served with ranges by tools/serve-range> --tap button`, and `--tap sphere` | PASS and PASS: the sound came in where the picture was, and the picture never went back |
| `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs` | green: +11 −11, net 0 in 3 files |
| the screens gate (`no-landing-adds-a-failing-screen.1.sh`, `.2.sh`) | 24 cells judged (12 a shard), 0 new failing, 0 to take out; green in 27 s and 27 s on the final tree (26 s and 25 s before the carried hexagon) |
| main's built site with this lane's two files laid over it, behind the Worker's own handler on an empty D1, a headless engine off every screen, 390 by 844: The Root, Tipped, "Knock with your agent", "Mint yours" | the Knock card and the mint's hexagon wear her default; 0 page errors. Before and after stand on the Canvas beside his pin (widget `8286e0b9`, 1600,707250) |

## No gate yet

The measure it waits for: a hexagon standing for a person drawn bare on a page, read by the screens checker's pixels inside each `.her` and the
mint's hexagon; today the tests above pin the lines that decide it.
