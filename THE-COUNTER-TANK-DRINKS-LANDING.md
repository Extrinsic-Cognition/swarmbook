# THE COUNTER-TANK DRINKS: a tank's $WARM is its second tank, spent as AI credits once its dollars are gone (lane/the-counter-tank-drinks, Nov 2 2026, claude-a0ea1269)

## His words (UTC)

- Oct 12 18:34: "having cashback on your inference kinda,,, having a counter-fueltank that fills up as you consume subscriotions".
- Oct 14 17:59: "$WARM uncapped and GTA-like in-currency minted for free with AI credits"; Oct 14 19:38: "of course it is USDC as credits my dude" (the tanks count dollars).
- Oct 18 13:05, 15:33: "$WARM is basically the fuel to use our app"; "you can use $WARM as credits for AI genie, you just ask and SWARMY PROVIDES".
- Oct 23 17:00, his page copy: "$WARM is his fuel. Buy it like GTA Online cash and spend it as AI credits."
- Oct 28 00:24, 02:47: "u pay but it is trace-sharing so u get back "fuel" in your "tank""; "$WARM is fuel".
- Nov 2 17:2x, 17:3x, over a seat's figure that said a $WARM had "nothing to spend it on": "it is about not burning 1$ but spending 1$ of inference in tokens"; "wtf?"; then "so?".
- The lineage and the economics: ec-workspace `docs/space-router-tokenomics-value-flows-stock-to-flow-sellers-buyers-revenue-2026-11-02.md` section 9.

## What stood

The ledger owed $WARM on every burn row (`warm_owed`, THE TICKET BUYS FUEL, Oct 28) and the public door kept it on the tank's row (`sr_tanks.warm`), and nothing
let a tank spend it: the second tank filled and never drank.

## What changes

- **The law** (`app/space-router-law.mjs`): `USD_PER_WARM = 1`, his one word (a dollar of credits a $WARM, to begin with; his to change), and `split(usd, fuel, warm)`:
  a drink takes the tank's dollars first (past zero, as the last call always could) and the rest in $WARM at that rate; the part paid in $WARM mines nothing, as a
  refill mines nothing.
- **The Mac's tanks** (`tools/embertide-mesh/lib/space-tanks.mjs`): a tank is let in while its dollars and its $WARM together exceed its calls in flight; a burn row
  carries `warm_spent`; the fold counts the dollars' part as drunk and the $WARM's part as spent; `state()` says `warm_mined`, `warm_spent` and `warm_owed`
  (mined less spent); the house's `take_usd` falls by what $WARM paid, which is the house paying the second dollar.
- **The public door** (`worker/space-router.mjs`, migration `0019_the_counter_tank.sql`): `sr_tanks.warm_spent` and `sr_ledger.warm_spent`; the hold counts the
  $WARM balance as fuel (`?5`, USD_PER_WARM), and names the new column, so a database behind the migration shuts the door before anything is sent, as the oracle's
  did; the burn's batch drinks the dollars' part, spends the $WARM's part and mines on the dollars alone; the answer says `x-space-router-warm-spent`; the 402 names
  both balances; `/space-router/v1/tank` says `warm_spent`, `warm_balance` and `usd_per_warm`.
- **The oracle's receipt is unchanged:** `usd` is the call's price, whatever paid it; the split is the tank's ledger's.

## Cost

- JavaScript: +63 −93, net −30 (THE JAVASCRIPT ONLY SHRINKS: a lane cut after the gate pays its lines). It pays by deleting `app/kpi.js`, 59 lines: the old wall's
  dark strip of four numbers, named by no file in the tree since the Oct 17 folder rename, so no page loads it and the site does not ship it; and by the Mac's tanks
  taking the law's own `fairHold` for their private copy of it, which no other file used. The first cut was +93 −31, net +62, and the gate refused it.
- The door: one more column read per call, one more bound parameter in the hold, one in the drink; no request, no timer.

## Proof (the new Mac, nice 19, the lane's tree)

- `node --test app/space-router-law.test.mjs`: 5 of 5 (the new: split's five cases; that a $WARM-paid part mines nothing is the door's proof below).
- `node --test tools/embertide-mesh/lib/space-tanks.test.mjs`: 11 of 11 (the new: a tank with $0 and 0.0105 $WARM is let in, the row says `warm_spent` 0.0105 and
  `warm` 0, the take is −0.0095, both gone refuses and says "0.000000 $WARM").
- `node --test app/dl-space-router.scene.test.mjs` 5 of 5, `node --test tools/site-files.test.mjs` 4 of 4 (kpi.js was never shipped), `node --test tools/any-room/any-room.test.mjs`
  13 of 13, and `node --test tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs` on the lane's tip.
- `node --test worker/*.test.mjs`: 122 of 122 on a database built by every migration in order, 0019 included (the new: one drink's dollars, then the $WARM pays the
  next call and mines nothing, then a 402 that names both balances and sends nothing; the tank door's three new fields; the dry-tank test now expects the $WARM
  a drink past zero mined to pay one more call).

- **Rule 8**, on the lane's tree served by `tools/serve-range` (206 to a Range request), Nov 3 2026 on the new Mac: `node --test app/dl-twelve.test.mjs` 21 of 21;
  `nice -n 19 node app/dl-twelve.proof.mjs --url {serve}/embertide-app/ui/intro/dyson-society/app/warm.html --tap button`: PASS; the same with `--tap sphere`: PASS.
  (The first hands, Nov 2 19:06 UTC, were refused by the lander for want of this proof.)

## His, and not deployed

- The rate is his word (`USD_PER_WARM`); the deploy of optimism.fit and the migration are his hand; until the migration is applied the door is shut by the hold's
  probe, and nothing is sent.
- Not here: a holder's choice to keep $WARM instead of spending it (today the dollars go first and the $WARM only when they are gone, so a holder who refuels
  keeps it); the markets and the vote the token also serves.
