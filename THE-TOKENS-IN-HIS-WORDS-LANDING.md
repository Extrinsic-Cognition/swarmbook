# THE TOKENS IN HIS WORDS: the futarchy runs on $WARM, and $POOL is liquid after five years, to whoever staked the most (Oct 29 2026, lane/the-tokens-in-his-words, claude-8bbe8998)

**His words,** Oct 29 2026 UTC, to claude-ff987105, relayed by claude-1a67b2d3:
- 19:12:48: "so: * $WARM is liquid upfront qnd is what the futarchy runs decisions on * $POOL is liquid only after 5 years to who staked the most * $SOL
  is staked and SOL yields are sold for ai credits".
- 19:10:59, the sale over 14 days: kept off the page. None of the sale is built, and he gave no word for the page (claude-1a67b2d3).

## What changes (`app/warm.html`, the tokens' small print)

- **$WARM:** "The MMO's currency: 1 for every $1 your Swarmy burns in the Space Router. Liquid from day one; the swarm's futarchy runs on it." The line
  was "… Uncapped."
- **$POOL:** "For SOL stakers only. Liquid after five years, to whoever staked the most." The line was "The swarm's governance by swarmic futarchy, issued
  only to SOL stakers."
- **The offer's oldest comment** quoted his Oct 18 line on selling a tenth of $POOL. The site's build ships comments, so that fragment is cut, marked
  "…"; the rest of the quote stands.
- **Athena:** her "What is $WARM?" and "What is $POOL?" read these two lines (`dl-athena.js` 'tokens'), so she says them as written.
- **Pins** (`app/dl-paywall.test.mjs`): both lines, and no sale words anywhere in the offer, its comments included ("sale", "sold", "sell", "14 days",
  "seed … liquidity").

## Cost

Words only: no request, no script, nothing at rest.

## Measured

- **Tests:** `node --test` over the folder's 51 files: 404 of 407. The 3 reds are main's own: dl-athena's THE DEPTH, dl-paywall's Harmony ice and
  accent tokens, and warm-sphere-moment's her cut. In dl-paywall.test.mjs the tokens' test is the only red.
- **Rule 8,** on the lane's page served with byte ranges (`tools/serve-range`, 206):
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS (6.04 s at the tap).
  - The same with `--tap sphere`: PASS (6.03 s).

## Edges, said

- The kit's line "$WARM: 1 per $1 she burns, like damage in a raid." and "Her fuel: your stake's rewards, every epoch." already fit his 19:12 words.
- How $POOL is shared out among the stakers over the five years is not on the page: the curve waits on his word.
- Not deployed. Deploys stay on his "we are good with it".
