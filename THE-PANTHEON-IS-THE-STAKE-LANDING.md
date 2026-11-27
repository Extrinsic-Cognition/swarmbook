# THE PANTHEON IS THE STAKE

Nov 26 2026 UTC, seat claude-168f7fed, `lane/the-pantheon-is-the-stake`. His words, ~12:4x UTC, over two stills (the blue page's stake card under
the Pantheon's ring; the Root's page with Societies lit over its Pantheon): "what is the pantheon lane? this shit should be focusing on $POOL and
staking SOL man... you seem to forget entirely about all we discussed... this is the stakers section and there is 0 mentions of pool... the pantheon
visualization should be the staking interface, societies are the sub-swarms of the meta-swarm".

## What was wrong (this tree served by `tools/serve-range`, headless, 1440 x 900, once the bar stands)

- The first view of the blue side: SWARMBOOK, then PROMPT-2-MINE $SWARM (the red side's door), then the governance film. $POOL appeared
  nowhere above the fold.
- Under the film, the Pantheon's ring, with "in the common pot" at its centre and the call "Fuel the swarm".
- The stake card stood below that, apart from the ring. Its words never named the sub-swarms its yield goes to.
- The bar had a Pantheon tab, the Root's governance hall, apart from Stake.
- The Pantheon lane he asked about is the side session's (claude-212510a1): the mint's bar and a page of its own for the Root's hall. The lander
  refused it at 03:56 UTC and it never landed. This lane turns the other way: the Pantheon is the stake.

## What changes

- **The ring is her pool.** On blue its centre says $POOL, Stake SOL here; the common pot's SOL stays the red side's. A press on the centre opens
  her stake door, or brings the stake into view while her pool is not born. A racing swarm's hex still opens its swarm, the + still makes a wish.
- **The stake stands beside the ring,** in the Pantheon's own article (stacked under it below 960 px), first under the hero, the film after it:
  - Stake SOL. Hold $POOL.
  - 1 Stake your SOL in her pool. You keep it. Unstake any epoch.
  - 2 Its yield fuels the sub-swarms. Every epoch: to a wish you choose, or where the futarchy places it.
  - 3 You accumulate $POOL. Stakers compete to hold the most. It unlocks all at once in five years.
  - Round her pool: the sub-swarms of the meta-swarm, on twelve thrones won by fees.
  - Her pool opens at her launch. (Her door, Stake SOL in her, takes this line's place once a chain names her pool.)
- The words are his, from `tools/embertide-mesh/pool/SOL-INFLATION-PAYS-FOR-INFERENCE-LANDING.md`: his 18:57 "$POOL is unlocked all at once 5
  years down the line, until then, stakers just compete for who accumulates the most"; his 19:12 "$POOL is liquid only after 5 years to who staked
  the most"; the light's two ways, a wish and the futarchy, as her door already writes them.
- **Blue stands alone.** The red half, the seam and the red plate (Prompt-2-mine) stand down on blue. The red side is unchanged: both halves, its
  plate, its race and its board.
- **The bar loses Pantheon** on all ten pages, since the Pantheon is the stake now: Stake, Ride, Societies, Tracenet.
- Her dialog's line names $POOL: "Stake it in her, once: you accumulate $POOL. Unstake any epoch."
- JavaScript +20 -20, net 0.

## Measured

- Blue at 1440 x 900, from the top: the bar, SWARMBOOK, then the ring and the stake side by side. The ring's top is at 472 px, so the stake opens
  at 546 px, inside the first screen (it was below the film, at 1028 px). At 390 x 844 the ring is at 257 px and the stake at 649 px. No sideways
  scroll at either width.
- Red, read in the same headless Chrome: its half shown, the stake hidden, $POOL hidden, its plate shown.
- Local, the chain is not read, so the thrones and wells stand bare. On swarmbook.com they carry the racing swarms as before.
- `node --test app/after-the-mint.test.mjs`: 15 of 15. The new pins (the $POOL centre, the stake in the Pantheon's article, blue alone, the stake
  before the film, no Pantheon tab) would be red on main, which holds none of them.
- The site's 71 test files: 567 of 569. The 2 red are main's own: the public mint's ice tokens and her cut's sphere.
- `cargo test --test the_pages` in `poleis/door`: 4 of 4. Its pin on her door moved with the door.
- Rule 8, no sound touched: `node --test app/dl-twelve.test.mjs` 21 of 21. `app/dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range`:
  PASS on both taps (button, sphere).
- NO LANDING ADDS A FAILING SCREEN: green on both halves, 0 new failing of 72 site cells each.

## Owed

- Her pool is not on mainnet, so the stake has no live numbers and no door: no SOL staked, no $POOL held. Both come when a chain names her pool.
- "Send it to a wish" in her dialog still goes to `#wells`, where blue no longer shows the race. Two Rust tests pin it (`poleis/door/tests/the_pages.rs`,
  `poleis/press/tests/page.rs`). It needs his word on where a staker picks a sub-swarm.
- The bar still says Societies for the wall of sub-swarms. Renaming it Sub-swarms is his call.
- Not on swarmbook.com until a deploy, his word.
