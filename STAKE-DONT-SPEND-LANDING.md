# STAKE, DON'T SPEND: the kit is a stake of SOL, its rewards her fuel or the ClawRiders' (Oct 29 2026, lane/stake-dont-spend, claude-8bbe8998)

**His words,** Oct 29 2026 UTC:
- ~18:2x, relayed by claude-1a67b2d3: "staking only, with staking rewards that become fuel and credits for the project snowtrace cohort... you get what i
  mean? the thing is, and we should be very clear about it, this works when there is a lot of stake moved..."
- ~18:2x, to this seat: "$POOL is governance token that is only issued to stakers that stake SOL... while $WARM is the rebate for users".
- 18:08, to claude-61e371e5, the toggle: "accumulate credits * or allocate to ClawRiders in Project SnowTrace".

## What changes

- **The kit is a stake** (`app/warm.html`, the offer). "Enter the MMO." now stands over "Stake SOL" where "$30 USDC" stood. Under it: "Keep your SOL. Its
  rewards fuel the swarm.", in step with the intro session's "Keep your SOL. Keep your soul."
- **Its lines:**
  - "Her fuel: your stake's rewards, every epoch." takes the place of the USDC tank line.
  - "Your toggle: her credits, or the ClawRiders'." is new.
  - "$WARM: 1 per $1 she burns, like damage in a raid." now says "she", as her picture does.
- **The scale, said plainly,** under the lines: "It works when a lot of stake moves: 1 SOL ≈ $0.44 of inference a month." The figure is the house's own
  reading: stakers earn 5.22% a year at epoch 1071, with SOL at $101, read 18:02 UTC (the governance hypertrace, §13).
- **Its door:** "Stake your SOL", disabled, "Paused", until the stake pool exists (the STAKE4INFERENCE seat builds it).
- **The small print:**
  - $POOL is "The swarm's governance by swarmic futarchy, issued only to SOL stakers."
  - "Later, and capped", "where its value accrues" and "10% of it will be sold" are gone.
  - The free way reads "Not staking · wait for the free release".
- **The mint's line,** "The mint runs for 7 days from launch.", is no longer seen. Its span stays, hidden: the paywall still writes the wall's close
  there (MINT_CLOSES), and Athena reads it at the stop.
- `app/dl-paywall.css`: the scale line is small, in the lines' ink. Where the screen is wide, her card spans the kit's six rows.
- `app/dl-paywall.js`: one comment says the kit's door waits on the stake pool. No code changes.
- **Pins:**
  - `app/dl-paywall.test.mjs`: the stake, the toggle, the scale, and $POOL issued only to stakers. It also pins that the offer carries no USDC, no $30,
    no sale and no mint's days, and that the mint's line is hidden.
  - `app/warm-flask.test.mjs`: her fuel line.

## Cost

Words only: no request, no script, nothing at rest. The kit gains one line and one small line under its list.

## Measured

- **Tests:** `node --test` over the folder's 51 files: 402 of 405.
  - The 3 reds are main's own: dl-athena's THE DEPTH, dl-paywall's Harmony ice and accent tokens, and warm-sphere-moment's her cut.
  - dl-paywall.test.mjs is red on main too, so a new red there would pass the gate unseen. Its tests were read one by one here: the tokens' test is
    the only red.
- **The walk:** `dl-path-to-the-kit.proof.mjs`, by real presses at 1440x900 and 673x873, on the lane's page served with byte ranges: 26 of 26. The kit
  lands whole in sight, with her picture in it.
- **Rule 8,** on the same page (`tools/serve-range`, 206):
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS (6.08 s at the tap).
  - The same with `--tap sphere`: PASS (6.08 s).

## Edges, said

- **Athena's words are hers** (`dl-athena.js`, which the intro session is rewriting):
  - Her stop line reads the hidden mint line, so at the stop she still says the wall's close: "The mint is open until October 30: 2 days left."
  - Her free topic still opens "Not minting?".
  - Her kit topic reads the new words: "Enter the MMO. Stake SOL. Keep your SOL. Its rewards fuel the swarm."
- **The wall is unchanged:** the film holds at the drawn arrow until MINT_CLOSES (Oct 30 23:59 UTC).
- **$POOL's issuance is not on the page.** His "5 years time horizon... strongly benefits long term stakers" waits on his word for the curve.
- **Not built yet:** the stake pool, the epoch crank and the toggle's state. The door stays paused.
- **The $0.44 is one reading,** Oct 29 18:02 UTC. It moves with SOL's price and its inflation.
- **Not deployed.** optimism.fit takes this at his word.
