# THE STAKE IS WHO BELIEVES IN SPACE ROUTER: the mint's staking words say the stake is belief in Space Router, held on Solana (lane/the-stake-is-who-believes-in-space-router, Oct 30 2026 09:4x UTC)

A seat on the new Mac (claude-61e371e5). The $WARM & SpaceRouter seat (claude-1a67b2d3), which holds the offer in `app/warm.html`, was told before the
change. No line of hers (`dl-athena.*`) changes: her intro no longer speaks of staking, and her "What is $POOL?" reads $POOL's line, so she says the
new one.

## His words (UTC)

- **Oct 30 09:30**, to this seat, after the brand's hypertrace and "the four names are one mind": "yeah ok, but can we make sure that the staking part
  of it is about who believes in space router in solana please?"
- **Before it**, the lineage of the stake as belief (ec-workspace `docs/our-brand-style-identity-and-values-hypertrace-2026-10-30.md`):
  - Sept 9 22:22: "i dont want people who dont believe";
  - Oct 18 05:43: "what really matters is that people believe in the collective self-improvement...";
  - Oct 29 18:43: people stake SOL "in the belief" (the money words: `tools/embertide-mesh/pool/SOL-INFLATION-PAYS-FOR-INFERENCE-LANDING.md`);
  - Oct 30 06:16: "stake-4-inference? it is a patreonism thing... a status symbol".

## What the page said, and says now

| where | main | the lane |
|---|---|---|
| the kit's line (also her line at the stop) | Keep your SOL. Its rewards fuel the swarm. | For everyone on Solana who believes in Space Router. Keep your SOL. Its rewards fuel the swarm. |
| $POOL (also her "What is $POOL?") | For SOL stakers only. Liquid after five years, to whoever staked the most. | For the believers: SOL staked on Space Router. Liquid after five years, to whoever staked the most. |
| the rite's chapter 02 | Stake SOL. Join the swarm. | Stake SOL. Believe in Space Router. |
| its spoken line (`swarm-explainer.js`) | Stake SOL. Join the swarm. | Stake SOL. Believe in Space Router. |
| its pass | SOL staked · The starter kit | SOL staked · On Space Router |
| the illustration's label | You stake SOL and your agent joins… | You stake SOL on Space Router and your agent joins… |

**What did not change:**
- the kit's title, its price word "Stake SOL" and its list;
- the scale line ("It works when a lot of stake moves") and the paused door;
- $WARM's line and the free way;
- every press, every style.

**Belief in the router, never a promise of a return.** The offer's own test refuses "yield", "profit", "apprecia" and "worth" anywhere in the offer,
its comments included. This lane's first draft quoted his Oct 29 line about the yields given up, and the test caught it; the quote was cut. His word of
Oct 29 19:03 ("it is a marketing problem") stands behind that guard.

## Measured

- **Bytes:** `warm.html` grows by the note and about 120 characters of words; `swarm-explainer.js` by 11 characters. No request, frame or timer is
  added.
- **The kit at 390 × 844** (headless Chrome, off every screen, muted, every other host refused, the page served with byte ranges): the new line wraps
  in three lines under "Enter the MMO. / Stake SOL", nothing clipped. The page under it is unchanged.

## Proved (the new Mac, nice 19)

- `node --test app/dl-paywall.test.mjs app/warm-entry.test.mjs app/dl-athena.test.mjs app/dl-twelve.test.mjs`: every test green but two, which are
  main's own reds, failing the same on `origin/main` in a scratch checkout:
  - "THE DEPTH rides the engine and the corner…";
  - "the public mint keeps DysonLight Harmony ice and accent tokens".
- **What `dl-paywall.test.mjs` now pins:**
  - the kit's line;
  - $POOL's line;
  - the chapter's words, its spoken line and its pass;
  - that no staking line leaves Space Router out ("Join the swarm.", "For SOL stakers only", "The starter kit").
- **Rule 8,** on the lane's page served by `tools/serve-range` (206 to a Range request):
  - `node --test app/dl-twelve.test.mjs`: green, within the run above;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS;
  - the same with `--tap sphere`: PASS.
