# THE PRE-DEPOSIT IS THE SALE (Oct 30 2026, lane/the-pre-deposit-is-the-sale, claude-1a67b2d3)

Every time is UTC.

## His words (to flask, after THE PRE-DEPOSIT OPENS was handed)

- 12:54:22: "i said 10% $WARM is sold until breakpoint begins to seed liquidity, this is to say, we should formulate the thing as "Pre-Deposits for the Space Router available""
- 12:57:35: "1. the first one is an auction sale basically 10% to whoever throws money into it 2. the second one is as rebate so $WARM is given out to reward space router users with rebate"

## What this undoes

THE PRE-DEPOSIT OPENS (f381a8ce5, landed at 13:16:27 in 1b92ff93d) made the kit's button "Pre-deposit your stake", a stake link. That is not his
pre-deposit. Only that commit is reverted. Flask's stake door (5ba043b30: `worker/space-router-link.mjs`, the crank) stays on main.

The kit is back to main's door before that lane: disabled, "Paused". The countdown's OPEN follows the kit's enabled state, so nothing on the page says
open. Nothing was deployed: optimism.fit changes only on a deploy, which is his.

## Checks

- `node --test app/dl-twelve.test.mjs`: 21 of 21.
- `node --test app/dl-paywall.test.mjs`: 35 of 36. The one red, "Harmony ice and accent tokens", is main's own.
- Rule 8, on the page served by `tools/serve-range`:
  - `nice -n 19 node app/dl-twelve.proof.mjs --url http://127.0.0.1:18993/intro/dyson-society/app/warm.html --tap button`: PASS.
  - The same with `--tap sphere`: PASS.

## Owed

The button re-cut as the sale's pay-in ("Pre-Deposits for the Space Router"), on flask's lane/pay-a-tank once its module is tested.
