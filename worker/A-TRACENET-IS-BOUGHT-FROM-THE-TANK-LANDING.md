# A TRACENET IS BOUGHT FROM THE TANK (Nov 3 2026)

`lane/a-tracenet-is-bought-from-the-tank`, by claude-d1847ce4. Every time is UTC.

## His words

- Nov 2 00:54, over the Tracenet mock: "the user has to pay money for the tracenet creation u get me?"
- Nov 2 13:00: "explain, what? charge the tank? hypertrace what we could do and what strategic effects it could have on us" (the lineage:
  ec-workspace `docs/paying-for-a-tracenet-hypertrace-2026-11-02.md`, 1f40566ef).
- Nov 3: "Charge the tank", over the four roads that lineage laid out, the first of them said as: "Every creator is on Space Router at the door, the fee
  is router revenue, and the spend mints their first $WARM one for one as rebate, never a sale; the payment is private."
- Nov 3, asked the price: **"0.1 sol"**.
- Before them, the laws this lane keeps: Oct 28 13:50 WET "we should give $WARM only when money is spent in the SPACE-ROUTER"; Oct 29 09:10 "1 $ SPENT =
  1$WARM u get what i mean? it is rebate"; Oct 30 12:30 "Pay a tank".

## The road

1. **The site (`worker/space-router.mjs`, `TRACENET_PATH` = `/space-router/v1/tracenet`).**
   - **The price is his 0.1 SOL**, `SPACE_ROUTER_TRACENET_SOL` in the Worker's vars (`wrangler.optimism-fit.jsonc`, beside `PREMINT_ENABLED`, so the deploy
     carries it; none named: 503 and the door is shut). The tank holds dollars (his Oct 14 "of course it is USDC as credits"), so a tracenet is charged at
     SOL's dollar price at the instant: the mint's own read (`premint.mjs` price, Coinbase's spot), handed to the router's door and kept a minute by its
     isolate. No live price: 503, nothing taken. `GET` says `{sol, usd, sol_usd}`; a receipt says the SOL and the dollars it was.
   - `POST {id}` with the tank's key (`sr_…`, bearer or `x-api-key`): one D1 batch, as a call's burn is one: the mine's share, a burn row (`model` tracenet,
     `why` `tracenet:<id>`, no router cost, no tokens, no words), the tank's dollars. Each statement only while the tank's dollars beyond its live holds pay the
     price and no row of that id stands. It mines $WARM at its instant's rate (the opening's before the opening; the halving by date after), as every dollar
     spent in the router does. The same id asked again answers the same row (200): a retry never pays twice. A short tank is a 402 that says both sums, and
     nothing is taken. No call goes upstream, so there is no oracle receipt: the ledger row is the receipt.
   - The fair hold of calls (the mean of a tank's last twenty exact drinks) now reads only rows with no `why`: a tracenet's price never inflates what a chat
     call holds. Bought with dollars only: the counter-tank's $WARM does not buy a tracenet (his to say otherwise).
   - No migration: `sr_ledger.why` stands since 0011.
2. **The house (`tools/embertide-mesh/lib/tracenet-create.mjs`, wired in `harmony-aiolos.mjs` as `GET|POST /api/tracenet`).** The window never reaches the site
   and never holds a key (as `society-ticket.mjs` and the Gold month's door before it).
   - `GET`: `{ open, price_usd, keyed, fuel_usd, deposit }`, the site's price and the holder's tank (`GET /space-router/v1/tank` with the key).
   - `POST {name, colour}`: the site takes the price, then this door writes the Nest's `tracenet/house` `{schema, name, colour, at, by: harmony-tracenet, paid:
     {usd, warm, receipt, id, at}}` by compare-and-swap. A house stands on the Nest only once it was paid; the page writes no house now. The id is drawn once
     a press and sent again when the site did not answer, so the tank pays once; a receipt paid whose house the Nest did not keep is written at the next press,
     unpaid.
   - The key: `SPACE_ROUTER_TANK_KEY`, a new row of Settings' keys (`~/.embertide/keys.env`, as every key Harmony holds), never on the Nest, the page or a log.
     A buyer gets it from the deposit page (Pay a tank, `optimism.fit/app/warm.html`), which hands it back once.
   - It took the place of `/api/gold/pot` (the Gold month's pot), which no page read since Oct 29 (SOL INFLATION PAYS FOR INFERENCE took the tab off it).
3. **The tab (`life-menu/tracenets.mjs`).** Create's line says the price, "0.1 SOL ($N now) from your Space Router tank. Your house on the net and your first flask.", or
   "Not open yet: the price is not named."; Light it asks the door; the answer's ref is the house. A short tank shows "Fill your tank" (the deposit page); no
   key shows "Open Settings". The trail's flask is the Space Router tank now (it was the house's MiniRouter credit, `/api/purse`, which is the operator's, not
   the user's); the line's tank says what is left.

## The acid on what this lane touched

`harmony-aiolos.mjs` carried three of his room (`tools/any-room/baseline.json`): the launcher's displays `'tv1', 'tv2', 'mac'` (now any seat by its shape;
do-word resolves the name against the house, as it did) and the redaction seed's `lysa`, `pelino`, `gorgia` (the seed is written only when a house has no
redaction file: his Macs keep theirs; a new house's seed no longer carries his machines). Every file this lane touched comes out with none of his room.

## The cost

| | before (main 747bad9b5) | after |
|---|---|---|
| a tracenet's creation | free, written by the page | one batch of three statements and one read on the site; one call out from the house; one compare-and-swap |
| the tab at rest | nothing | nothing |
| the tab's reads at a show | the purse (`/api/purse`), the register, one stream | the door's terms (one GET out to the site, two with a key), the register, one stream |
| the lane's JavaScript (`git diff --numstat` against main) | | measured below; the new lines are paid by `embertide-app/harmony-canvas/backups-live-map-20261007/`, a seat's Oct 7 copy of eight files git keeps whole (2,701 lines of JavaScript; nothing imports it; its `app.test.mjs` was a known red on main) |
| money spent proving it | | $0: the site is a stand-in in every test and the proof |

## What is his

1. **The price** is his 0.1 SOL, in the Worker's vars (Nov 3). It moves in dollars with SOL; a tank pays the dollars of the instant.
2. **The deploy** of the Worker with this door (no migration). Until then the house's door hears 404 and says "Not open yet".
3. **Harmony's restart** on each Mac, for `/api/tracenet` to exist (the lander's after-work restarts the daemons a landing moved, when that road stands).
4. Whether a tracenet may be bought with the counter-tank's $WARM (today: dollars only), and whether its $WARM rebate stands (today: it mines, as he was told).

## Tests and proofs

Run on the new Mac (Nov 3 2026 15:2x UTC, a scratch worktree beside ec-workspace, every command bounded):

- **1,001 tests over the worker's 18 files, the door's, the tab's, the shell's two, harmony-canvas's, Aiolos's and the five gates: 986 pass, 1 red**, and that
  one is red the same on main's tree 747bad9b5 beside it (`harmony-canvas/tests/app.test.mjs`, "index.html keeps the old editor header byte for byte").
  `space-router.test.mjs`: A TRACENET IS BOUGHT FROM THE TANK green. `tracenet-create.test.mjs` 4 of 4.
- **The gates:** THE JAVASCRIPT ONLY SHRINKS "+263 -2781, net -2518 in 14 files"; ANY ROOM and THE ACID green (every touched file clean); no page of its own,
  the pixel is a lookup, the law is the gate green.
- **`tracenets.proof.mjs` 13 of 13** (tree af540ed27): the price on Create's line, "$30 from your Space Router tank. Your house on the net and your first flask."
  (the stand-in's $30, never his); Light it paid the stand-in site once (1 post) and the house on the scratch Nest carries `paid {usd 30, warm 30, receipt 1}`
  by `harmony-tracenet`; the tank says $20 after; 0 frames and 0 changes at rest, twice; no request outside the door and the scratch Nest. First show 30.6 ms
  task, 70.6 ms to the second frame, 75 nodes.
- **`new-user.walk.mjs --only Tracenet`: PASS**, 3194 ms, on a house not his.

### The refusal of 3313ce8a1 and the run at aece7ff33 (Nov 3 2026, 15:53 to 16:03 UTC)

claude-d1847ce4 died at 15:37:06 UTC (its account's weekly limit) as it committed 3313ce8a1, the tab taking the tank's fuel from the payment's own
answer. That commit put its comment mid-line at `life-menu/tracenets.mjs:149`, which commented out the `else` and the `try`'s close: a SyntaxError at :150
("Unexpected token 'catch'"), and the lander refused it at 15:53:54 (`tracenets.test.mjs` 0 of 1, the proof 0 of 1). aece7ff33 (claude-b84bd8e7, the seat
raised from it) moves the comment to the line's end; the code is 3313ce8a1's, the same line count. Run on the new Mac in that seat's worktree, every command
bounded, `nice -n 19`:

- **177 of 177 tests**: the worker's 18 files, `tracenet-create.test.mjs`, `tracenets.test.mjs`, Aiolos's, and THE JAVASCRIPT ONLY SHRINKS, no page of its
  own, the law is the gate, ANY ROOM.
- **`tracenets.proof.mjs` 13 of 13**: Light it paid the stand-in site 0.1 SOL ($15 at its price) once (1 post), the house on the scratch Nest carries
  `paid {sol 0.1, usd 15, warm 15, receipt 1}`; the line says "$35 in your tank" from the payment's own answer; 0 frames and 0 changes at rest, twice;
  244 requests, none outside the door and the scratch Nest. First show 24.5 ms task, 70.1 ms to the second frame, 75 nodes.
- **`new-user.walk.mjs`: PASS**, 14 of 14 in 50 s, on a house not his.
