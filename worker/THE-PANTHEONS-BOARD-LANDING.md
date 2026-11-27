# THE PANTHEON'S BOARD: the website's global leaderboard is the router's wall of hexagons, ranked by the fees each flask brought (lane/the-pantheons-board, seat claude-137e91ec)

## His words (Nov 19 2026 UTC)

- 12:37, to seat claude-eee8b377: "the 12 pentagons are to be fucking gamified dude... * meta swarm is the largest of them all... * each lyssajudron
  minted is a hex there * each pentagon there is a posiverse elected * my posiverse is the first pentagon added there... we add 1 new pentagon per month";
  12:43, asked what elects: "ideally it would be fees".
- 17:02, over the pantheon sheet: "hypertrace the gamification of it all... it seems like you have forgotten the idea of having SWARM-FUTARCHY".
- ~17:3x: "where is this supposed to be implemented? we need this both in the website (global leaderboard)", then "Yes, build it" on "Build the
  leaderboard's public door on the router's server first?".
- Nov 11, over a first cut of the faces that kept a ranking of its own beside the deposits' list (this door's own header): "have you been working in
  isolation?". So the board is the wall's own list, not a second one.

## What was so (main 7177d35311)

The Space Router's Worker keeps every flask's burns (`sr_ledger`: each call's charge, what the provider charged, the markup, the $WARM it mined) and
every heard deposit's hexagon (`sr_drops`, its face `sr_hexagons`, its claimed page `creators`). Its one public read of them was the wall,
`GET /space-router/v1/portrait`: the hexagons in the order they were heard. Nothing ranked them, and nothing public said what a flask had burned.

## What is so

**`GET /space-router/v1/portrait?board`**, on the same door (`worker/space-router-portrait.mjs`), the same hexagons:

- **A flask is a tank with a heard deposit**; its hexagon is its first (two deposits into one tank are one flask, its burns counted once).
- **Ranked by the fees its model calls brought the router** in the window (`?since=<ms>`, else the last 30 days, never before 0), then by its
  fees of all time, then by its number. A fee is the markup: what a call paid less what the provider charged; where the cost was not known, the charge
  times markup / (1 + markup), which is the same by the router's own law (`app/space-router-law.mjs` charge). A tracenet bought is a burn and mines,
  but it pays its creator: it is no fee and no call.
- **Each row:** `{ rank, n, signature, colours|null, picture?, handle?, month: { fees, burned, mined, calls }, all: { fees, burned, mined, calls } }`,
  amounts to a ten-thousandth; `handle` only where the depositor claimed a page, as on the wall. 150 rows at most, as the wall. Held 20 s.
- **Body:** `{ count, since, board }`; `count` is every hexagon heard, as the wall's.
- The wall itself is unchanged, byte for byte, when `board` is not asked.

**One read** (a CTE: the flasks, then each flask's burns through the ledger's `(tank, id)` index, then its face and page). No migration, no new table,
no new door, no new binding; nothing written.

**JavaScript: +16 −16.** The door's three lines of its GET, its SQL map, its helper line and two lines of its header changed in place; the test's helper,
its stand and its list test grew in place and by three lines; three wrapped lines of the header's prose were joined to the line before them to pay for
those (the words unchanged).

## Measured (the gate's Mac, at 16af4ef5e1)

| | measured |
| --- | --- |
| `worker/*.test.mjs` | **138 of 138** (the portrait's 6, its list test now also: a cost not known pays the markup it would have, a tracenet bought is no fee, a tie in the window falls to all time, a hexagon with no deposit is no flask, an empty house answers `{ count: 0, since: 0, board: [] }`) |
| the-javascript-only-shrinks, any-room, the-law-is-the-gate, the-look-is-a-law | **42 of 42** |
| the board's read through the door, node:sqlite (D1's engine), invented houses, every flask a face, one in ten a page | 150 flasks and 15,000 burns: **5.4 ms** (the wall 0.4 ms); 1,000 and 100,000: **43 ms**; 3,000 and 900,000: **467 ms**. 150 rows: 56 KB of JSON |
| the live door, read Nov 19 ~17:3x | `{"count":0,"hexagons":[]}`: no deposit heard yet. Once deployed, the board answers `{ count: 0, since, board: [] }` |

## What it does not do

- **Not live until his deploy.** The Worker is published by his hand (the site's publish script); no D1 migration is needed (it reads tables that
  stand). Read after: `curl -s 'https://optimism.fit/space-router/v1/portrait?board'`.
- **No page draws it yet.** Step 2 is its section on the site's page, which stands on the one Swarmbook branch (`lane/swarmbook-one-branch`, not
  landed): to be laid there with that branch's seat, never on a page of its own.
- **It scans the ledger.** Every read sums each flask's burns: fine at today's size (none), 43 ms at 100,000 burns, half a second at 900,000, and D1
  bills rows read. Before a house that size: keep each tank's window sums at the burn (one more update in the burn's batch) or hold the answer in the
  Worker's cache for its 20 s.
- **A flask's spend becomes public**: its fees, burns, $WARM and calls, by its hexagon, its face and (only where claimed) its page. That is the board's
  purpose; it shows no prompt, no model and no key.
- **Only the web's flasks.** The house's own flask (her, his posiverse, the first throne) burns through the house's purse on the Nest, not through a
  tank of this Worker, so it is not on this board.
- **The window is 30 days, not the race.** His "1 new pentagon per month" names a month; which month (from his first throne's day, or the calendar) is
  his call, and the page can ask its own `since`.
- **No futarchy.** The board ranks; the swarm futarchy (Nefertiti's roads, the PASS and FAIL markets in $WARM, the thrones sealing) stands in the
  house's Rust crate `embertide-futarchy`, paper only, on a home Nest. Moving it to where the website can read it is a later step.
