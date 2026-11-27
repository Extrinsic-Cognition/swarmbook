# THE HALL IS THE STAKE

Nov 26 2026 UTC, seat claude-168f7fed, `lane/the-hall-is-the-stake`.

His words:
- ~13:1x UTC, over a still of THE PANTHEON IS THE STAKE: "did you miss the other chat where i said we'd be movign pantheon there??"
- To the other seat (claude-212510a1), as it relayed: "pantheon should go into the stake tab... pantheon is for the stakers. socieities remains
  with grid".

## What was wrong

THE PANTHEON IS THE STAKE (8d6b8f74ca) had relabelled the blue side's decorative ring as her pool. The Pantheon itself stayed a section down The
Root's page (`polis.html?civ=0#hall`), out of the Stake tab:
- her at the oculus and the floor;
- the twelve thrones by their signs and the gate;
- the season clock, the throne and the challenger;
- the road its stakers priced;
- the ladder of fees.

## What changes

- **The hall stands on Stake.** It moves whole from `polis.js` to `pantheon.mjs` (the draw, unchanged, and the glyphs the society page also draws).
  On blue the Pantheon's article now holds:
  - the hall's arena;
  - THE PANTHEON;
  - **Stake SOL. Hold $POOL.** at the head of its column, with its three steps, then "The twelve thrones are the sub-swarms of the meta-swarm,
    seated by the fees they bring the Fund", then her door or "Her pool opens at her launch";
  - then the hall's own cards: season, throne and challenger, the road, the ladder.
- **One read of the chain.** The blue page's own read (`after-the-mint-book.mjs`) draws it, with no second copy of the chain reader.
- **The ring stays the red side's picture.** Its door, and the race strip's "The Pantheon →", now land on the hall on Stake (`?side=pool#hall`).
- **The Root's page no longer holds the hall.** Its sheet moved from `polis.css` to `swarmbook-book.css`.
- **Societies is untouched.** Its grid is the other seat's.
- JavaScript +35 -36, net -1.

## Measured

This tree served by `tools/serve-range`, headless Chrome with its GPU, the chain read from devnet.

| | 1440 x 900 | 390 x 844 |
|---|---|---|
| the hall (from the page's top) | at 472 px, 1108 px wide | at 257 px |
| the stake card | at 645 px | at 783 px |
| thrones drawn from the chain | 12 | 12 |
| sideways scroll | none | none |

- The live hall's numbers, read on swarmbook.com's Root page the same hour, are what it draws here:
  - season 1, ran out, 1,800 slots;
  - the floor, 8 of 30 seats held;
  - the road VETTED: 0 of 12 thrones back it, the stakers at 36.7 % of the Fund;
  - the ladder: The Root, Tipped first.
- Two stills were shown to him, desktop and phone.
- `node --test app/after-the-mint.test.mjs app/polis-rite.test.mjs`: 23 of 23. The new pins would be red on main, which holds none of them:
  - the hall on blue with the stake at the head of its column;
  - blue the hall alone, red the ring and never the hall;
  - the Root's page without the hall;
  - the Pantheon's door landing on the stake.
- Rule 8, no sound touched: `node --test app/dl-twelve.test.mjs` 21 of 21. `app/dl-twelve.proof.mjs` on `warm.html` served by
  `tools/serve-range`: PASS on both taps (button, sphere).
- The site's 71 test files: 567 of 569. The 2 red are main's own: the public mint's ice tokens and her cut's sphere.
- `cargo test --test the_pages` in `poleis/door`: 4 of 4. Her door's pin holds in its new place.
- NO LANDING ADDS A FAILING SCREEN:
  - First run: red on both halves, though 0 screens failed. The gate asked for 8 loads lines for the hall's files (its module, her oculus, its
    stone, its face), now in `embertide-screens/loads.json`.
  - After those lines, on main with THE SOCIETIES ARE THE HOME: green on both halves, 0 new failing of 24 site cells each.

## Owed

- **Her pool is not on mainnet:** the stake card has no live numbers and no door until a chain names it.
- **The hall reads the chain once per visit** (twice with a fresh snapshot). On The Root's page it followed the program's accounts by push. A push
  here is a next step if a season's change should move it while a staker watches.
- **Wording, his call:** "Send it to a wish" in her dialog still goes to `#wells`, the hidden race; the bar still says Societies.
- **Not on swarmbook.com until a deploy, his word.**
