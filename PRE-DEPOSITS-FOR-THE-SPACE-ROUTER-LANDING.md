# PRE-DEPOSITS FOR THE SPACE ROUTER (Oct 30 2026, lane/pre-deposits-for-the-space-router, claude-1a67b2d3)

Every time is UTC.

## His words (to flask)

- 12:54:22: "i said 10% $WARM is sold until breakpoint begins to seed liquidity, this is to say, we should formulate the thing as "Pre-Deposits for the Space Router available""
- 12:57:35: "1. the first one is an auction sale basically 10% to whoever throws money into it 2. the second one is as rebate so $WARM is given out to reward space router users with rebate"

## What the page does now

- The kit carries its own door, **Pre-Deposits for the Space Router**, beside the staking card's Stake your SOL (untouched).
- At load, one GET of flask's deposit door (`/space-router/v1/deposit`, lane/pay-a-tank, on main since 13:44). Only its terms (200: cluster, mint,
  treasury) enable the button and say "Open"; a 503 (no treasury set) keeps it "Paused".
- The countdown's PRE-DEPOSITS · FOR SPACE ROUTER · OPEN now follows this button (`dl-athena.mjs` COUNT.door `.snowtrace-kit [data-deposit]`), so it
  says OPEN only when deposits work.
- A press opens a form: the dollars, $30 first, $1 to $100,000. The page makes the buyer's tank key and shows it before the wallet asks, with a copy button,
  so a closed tab never loses it. It is kept nowhere.
- The wallet signs one transaction built by flask's `depositMessage`: the memo naming the key's commitment (never the key), and the USDC moved from the
  buyer's own USDC account to the treasury. The blockhash comes from the cluster's public node.
- The page waits for the transaction to be final, then hands the door `{signature, key}` once, retrying a not-yet-final 404, a 429 or a 503 up to six times.
- Each answer has its words: credited (and "its fuel waits for the opening" before SPACE_ROUTER_OPENED_AT), 409, 403, 428, 422, 429, 503.

## Cost

| | |
|---|---|
| at load | one GET of the door (~300 B) |
| a pre-deposit | the library the checkout already pins, one getLatestBlockhash, the wallet's one signature, one confirm, one POST |
| at rest | nothing |

## Checks

- `node --test app/dl-kit-deposit.test.mjs` (new): 6 of 6.
- `node --test app/dl-athena.test.mjs`: 22 of 23, the one red ("THE DEPTH rides the engine") red on main too.
- `node --test app/dl-paywall.test.mjs`: 35 of 36, the one red ("Harmony ice and accent tokens") red on main too.
- Rule 8: `node --test app/dl-twelve.test.mjs` 21 of 21. `nice -n 19 node app/dl-twelve.proof.mjs --url http://127.0.0.1:18994/intro/dyson-society/app/warm.html
  --tap button` PASS and `--tap sphere` PASS, served by `tools/serve-range`.

## His, and owed

- **His:** the treasury (`SPACE_ROUTER_TREASURY`), migration 0015 and the deploy. Until then the door answers 503 and the button stays Paused.
- **Owed:** a deposit through a real wallet against a devnet door. The page's road is flask's, proven 11/11 on devnet by flask's proof; this page's own wallet
  run is not done here.
