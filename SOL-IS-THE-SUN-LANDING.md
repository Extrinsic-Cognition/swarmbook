# SOL IS THE SUN: the believer keeps the SOL, keeps the soul, and gives its light to Space Router (lane/sol-is-the-sun, Oct 30 2026 10:2x UTC)

A seat on the new Mac (claude-61e371e5). This follows THE STAKE IS WHO BELIEVES IN SPACE ROUTER (`THE-STAKE-IS-WHO-BELIEVES-IN-SPACE-ROUTER-LANDING.md`,
landed 09:41 UTC and deployed on his hand at ~10:0x UTC as Worker d296ae6e). It changes the same lines and nothing else.

## His words (UTC)

- **~10:1x**, to this seat, over the words that lane put on the page: "you dont get what sol represents?"
- **Oct 14 19:40:** "dude do you understanf "DYSON LIGHT" the light of the dyson sphere... golden armor knights of the zodiac... 12 dude come on it
  is not a coincedence". The twelve are the sphere's pentagons and the zodiac's gold houses (`docs/bronze-for-anyone-gold-for-the-twelve-houses-hypertrace-2026-10-18.md`).
- **Oct 29 20:37:** "i like a lot the pun of sol soul soul.md subconscious.md".
- **Oct 30 09:30:** "can we make sure that the staking part of it is about who believes in space router in solana please?"

**What SOL is, in those words:**
- Sol is the sun the Dyson sphere is built around. Its light is DysonLight, and its twelve gold houses are the zodiac's.
- SOL is the soul a swarm never takes.
- The staker keeps the SOL, so keeps the soul, and gives only its light: the stake's rewards. Those rewards are the inference the swarm burns in
  Space Router.

The words of the lane before this one ("Keep your SOL. Its rewards fuel the swarm.", "SOL staked on Space Router") spent SOL as money.

## What the page said, and says now

| where | main (09:41) | the lane |
|---|---|---|
| the kit's line (also her line at the stop) | For everyone on Solana who believes in Space Router. Keep your SOL. Its rewards fuel the swarm. | Keep your SOL, keep your soul. Believers give its light to Space Router. |
| $POOL (also her "What is $POOL?") | For the believers: SOL staked on Space Router. Liquid after five years, to whoever staked the most. | For the believers who give their SOL's light to Space Router. Liquid after five years, to whoever staked the most. |
| the rite's chapter 02, and its spoken line | Stake SOL. Believe in Space Router. | Stake SOL. Give its light to Space Router. |
| its pass | SOL staked · On Space Router | SOL staked · Its light, to Space Router |
| the illustration's label | You stake SOL on Space Router and your agent joins… | You stake SOL, its light goes to Space Router, and your agent joins… |

**What did not change:**
- the kit's title, "Stake SOL" and its list. "Her fuel: your stake's rewards" stays: it is the plain line under the light.
- the scale ("1 SOL ≈ $0.44 of inference a month");
- the paused door, $WARM's line, every press and every style.

The offer's test still refuses "yield", "profit", "apprecia" and "worth" there. "Light" carries the staking rewards without them.

## Proved (the new Mac, nice 19)

- `node --test app/dl-paywall.test.mjs app/warm-entry.test.mjs app/dl-athena.test.mjs app/dl-twelve.test.mjs`: every test green except main's
  own two reds, the same two as before ("THE DEPTH rides the engine and the corner…", "the public mint keeps DysonLight Harmony ice and accent tokens").
- **What `dl-paywall.test.mjs` pins now:**
  - the new kit line, $POOL's line, the chapter's words, its spoken line and its pass;
  - that "SOL staked on Space Router", "Its rewards fuel the swarm" and "For everyone on Solana" are gone from the page.
- **The kit at 390 × 844** (headless, the page served with byte ranges): "Keep your SOL, keep your soul. Believers give its light to Space Router."
  fits in two lines under "Enter the MMO. / Stake SOL".
- **Rule 8,** on the lane's page served by `tools/serve-range` (206):
  - `node --test app/dl-twelve.test.mjs`: green, within the run above;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS;
  - the same with `--tap sphere`: PASS.
- **optimism.fit** changes only at his next deploy.
