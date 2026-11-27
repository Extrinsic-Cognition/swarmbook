# THE MINT IS A DEPOSIT: a flask from 10 USDC with no ceiling, and the mint open through Breakpoint (Nov 11 2026, lane/the-mint-is-a-deposit, claude-d86f9ecf)

## His words (UTC, Nov 11 2026, to this seat)

- 05:43:34: "we need to check in, when people are here, did they mint the the thing? minting the thing consists in what? u get what i mean? because we
  could have people deposit USDC like min 10 USDC and uncapped max... u get me?"
- 05:46:13: "let's work on it. can you bring to the thing the dev latest of optimsim fit? we can work on the liquor thing i think it would be pertinenet
  to use hexagnos and 10$ min usdc..."
- 06:09:20: "i need people to create their damn fucking flask... so i could use nefertiti introducing the urgency and the egg... then bringing back
  instead of jumping straight into lyssajudron... it could be that it stays in mint mode for the duration of breakpoint..."
- 06:10:50, on this seat's "Keep the mint open through Breakpoint's last day, Nov 17, instead of closing Nov 15?": "Yes, through Nov 17".

## What stood

- The deposit into a person's own Space Router tank (PRE-DEPOSITS FOR THE SPACE ROUTER, Oct 30: `app/dl-kit-deposit.mjs`, `app/dl-kit-deposit.js`,
  `worker/space-router-deposit.mjs`) took 1 to 100,000 dollars.
- The sphere's land law (`lab/mint-gravity.mjs` PRICE) already priced a floating hexagon at 10 and an anchored one at 1,000, for the seats of October.
- `MINT_CLOSES` (`app/dl-paywall.js`) was Nov 15 00:00 UTC, as Breakpoint opens, by his Oct 29 "End at Nov 15" ("i want it to be over once breakpoint
  is there so people feel FOMO cause they missed the window").

## What changes

- **The floor is the price of a hexagon.** `MIN_USD = PRICE.bronze` (10); the ceiling is gone (twelve digits of dollars pass the form). The form's
  refusal reads "From 10 USDC, in dollars and cents."
- **`seatOfUsd(usd)`** (`app/dl-kit-deposit.mjs`): which hexagon a deposit's dollars take, by the same law: `'bronze'` from 10, `'gold'` from 1,000,
  `null` under the floor. Nothing calls it yet.
- **The mint stays open through Breakpoint.** `MINT_CLOSES = '2026-11-18T00:00:00+00:00'`, the end of Nov 17 in London, his words in its comment. The
  stop on the drawn arrow holds through Breakpoint's three days; the page after the mint (`/` after the close, `worker/premint.mjs`) opens at the same
  instant, so two days later.
- Tests moved with it: `app/dl-kit-deposit.test.mjs` (the floor, no ceiling, the hexagon by dollars), `app/dl-paywall.test.mjs` (the instant, "28 days
  left" on Oct 21, held on Breakpoint's first morning and last evening, open the morning after), and one literal in `app/dl-athena.test.mjs` (line 130,
  the regex that pins the instant; that file is lane/the-egg-waits-for-the-mint's, told).

## What it does not do

- **Nobody can create a flask yet.** The door answers only when `SPACE_ROUTER_TREASURY` is set and the worker is deployed with its migrations; both his.
- **A deposit does not yet take a hexagon or pour liquor.** The sphere's world is folded from October's seats (SOL transfers with a tier memo,
  `app/dl-mint-ledger.js`); reading USDC deposits off the treasury as seats is the next piece.
- **The page cannot tell a returning depositor** after a reload: the tank's key is kept nowhere by design; only the wallet names the tank.
- **Her count's stamp** (`app/dl-athena.mjs` `until: 'UNTIL SOLANA BREAKPOINT'`) now counts to Breakpoint's end and reads wrong; hers and his to word.
- **The $WARM pool's own close** (`app/warm-pair.mjs`, written by `tools/warm-launch` from `params.mainnet.json`) still says Nov 15: a launch parameter, his.
- The deposit under the floor sent by another road is still credited to its tank by the worker (the money arrived); it takes no hexagon.

## Cost

Nothing at rest and nothing new per visit: constants and one pure function. JavaScript and HTML: 19 lines in, 19 out, net 0 (every line changed in place).

## Read (the new Mac, nice 19)

Twice: ended 06:14 UTC on these changes over main `1f122cdd39`, and ended 06:17 UTC on the lane as it stands, `adec66628d`, over main `7dfc54340f`
(lane/the-egg-waits-for-the-mint landed between the two; this lane was laid again on that main). The same result both times:

- Every test file of `app/` and `worker/` on the lane and on its base: **no file red on the lane that is not red on main.** Red on both, one test
  each, main's own: `app/dl-athena.test.mjs` (THE DEPTH rides the engine), `app/dl-handoff.test.mjs`, `app/dl-paywall.test.mjs` (the ice and accent
  tokens), `app/warm-sphere-moment.test.mjs`.
- The rule, item 8 (a change under the mint): `node --test app/dl-twelve.test.mjs` green in that run; `nice -n 19 node app/dl-twelve.proof.mjs --url
  <the served warm.html> --tap button` PASS and `--tap sphere` PASS on `tools/serve-range`.
- The gates: the-javascript-only-shrinks 13 of 13, the-look-is-a-law 2 of 2, the-law-is-the-gate 7 of 7, no-page-of-its-own 3 of 3.

A fold of this lane's commits made at about 06:14 UTC (`84715e6a3e`) undid 80 files of main and was never pushed as the lane or handed; the lane was laid
again from its own seven files.

Not run: the deposit against a real wallet and a real treasury (none is set), the site's build and its deploy.

## The times, corrected (lane/the-mint-receipt-says-its-true-times)

This receipt and `MINT_CLOSES`'s comment landed (main `4e1c9dd633`, 06:20:55 UTC) with times the seat had estimated, up to 40 minutes ahead of the
clock. They are now read off the seat's own transcript (his words) and its runs' files (the reads). Nothing else changed: the code is a comment.
