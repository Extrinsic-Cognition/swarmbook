# $WARM IS PROMPT-TO-MINE: its line in the small print names it (Oct 29 2026, lane/prompt-to-mine, claude-8bbe8998)

**His words,** Oct 29 2026 UTC, to claude-61e371e5, relayed by claude-1a67b2d3:
- 20:55:59: "bro, make fucking enourmous attention strategically to how memetic can "Prompt-to-Mine" can be... imagine like mining the supply with
  rebates dude..."
- 20:56:41: "it's like proof of work distribution dude".
- 21:02:32: "Halve by date"; 21:04:16: "Every 6 months" (relayed by claude-61e371e5).
- The strategy: ec-workspace `docs/prompt-to-mine-proof-of-work-distribution-hypertrace-2026-10-29.md`.

## What changes (`app/warm.html`, the tokens' small print)

- **$WARM:** "Prompt-to-mine: every $1 your Swarmy burns in the Space Router mines 1 $WARM, halving every six months. Liquid from day one; the
  swarm's futarchy runs on it."
  The line was "The MMO's currency: 1 for every $1 your Swarmy burns in the Space Router. Liquid from day one; the swarm's futarchy runs on it."
- **The halving:** 1 a dollar is the Space Router's own rate (`WARM_PER_USD`) for the first six months after the opening. Then it is half as much
  every six months, down to 1/1024 at year five, when $POOL unlocks (claude-61e371e5's hypertrace).
  At a steady spend, the first six months mine half of all that will ever be mined.
- **Athena:** her "What is $WARM?" reads this line (`dl-athena.js` 'tokens'), so she says it as written.
- **Still no sale words on the page,** its comments included (the pin from THE TOKENS IN HIS WORDS stands).
- **Pin** (`app/dl-paywall.test.mjs`): the $WARM line, whole.
- The freeze's slams (SPACE ROUTER stamped PROMPT-TO-MINE, then 1 $WARM stamped MINED PER $1) are claude-1a67b2d3's, on
  lane/prompt-to-mine-at-the-freeze. That lane does not touch warm.html.

## Cost

Words only: no request, no script, nothing at rest.

## Measured

- **Tests:** `node --test` over the folder's 51 files: 417 of 420. The 3 reds are main's own: dl-athena's THE DEPTH, dl-paywall's Harmony ice and
  accent tokens, and warm-sphere-moment's her cut. In dl-paywall.test.mjs the tokens' test is the only red.
- **Rule 8,** on the lane's page served with byte ranges (`tools/serve-range`, 206):
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS (6.01 s at the tap).
  - The same with `--tap sphere`: PASS (6.06 s).

## Edges, said

- **The kit's own $WARM line** ("$WARM: 1 per $1 she burns, like damage in a raid.") says the opening rate. It carries neither the name nor the
  halving; his to add.
- **Not deployed.** Deploys stay on his "we are good with it".
