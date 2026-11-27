# THE PREAMBLE STANDS, AND THE FILM IS SEEN ONCE

Nov 26 2026 UTC, seat claude-212510a1, `lane/the-preamble-and-the-film-seen-once`.

His words, Nov 26 2026, over the live site after THE SOCIETIES ARE THE HOME was deployed:
- "we need some shit that remembers when this fucking video has been seen already dude", with the link https://swarmbook.com/app/warm.html#purpose.
- "why is society not having the preamble anymore!?!?", then "this fuckign thing dude, why was it moved?!!" over the Societies page as it was: the
  SWARMBOOK and Prompt-2-mine plates, "It's time to fuel your swarmy.", WHY, and her ball with the swarms.

## What changes

- **The preamble stands again.**
  - `index.html`, `wall.js` and `front.css` are back to the page before THE SOCIETIES ARE THE HOME:
    - the plates and the line;
    - the scroll story (WHY, her ball, the swarms flying down into the wall);
    - the wall;
    - the governance study and the anatomy.
  - What stays from that lane: the bar's four items (Stake, Ride, Societies, Tracenet), the front door for a returning visitor, Rules' sandbox, the
    split under the header, and the mint's bar.
  - `swarmbook-floor.test.mjs` is back to its check of the front, with the mint's bar check kept.
- **The film is seen once.**
  - `dl-twelve.js`: a browser that has seen her offer (`am-intro=1`, written by `dl-athena.js` at her egg and by the bar after the mint) passes the
    mint's film at the load. It uses the film's own skip, the one the deposit door uses (`skipToMint`, a forward seek to just before the arrow).
  - Her entrance and her offer play as for everyone.
  - Nothing is pressed and no sound is touched.
- **JavaScript net −15.** The restore's lines are paid by folding runs of whole-line comments into one line each, in `wall.js`, `dl-twelve.js`,
  `dl-athena.js` and two tests. A section marker (`// ----`) stands alone, because the tests slice the source by it. No code line moved.

## Measured (this tree served by `tools/serve-range`, headless off every screen)

- **The Societies page at 900x562:** the hero, WHY and the 12 cards of the wall, as in his picture.
- **The mint with `am-intro=1` set before the load:**
  - the film skipped at the load (count.skip from 0 to 117 s, the film at 121 s six seconds in);
  - at 40 s her egg offered ("Take this egg.") with the bar seen above her.
- **Without the cookie (a fresh profile), rule 8:**
  - `node --test app/dl-twelve.test.mjs` passes 22 of 22;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <warm.html served by tools/serve-range>` passes with `--tap button` and with `--tap sphere`.
- **The site's tests:** 598 of 601. The 3 red are main's own: `dl-glass`, `dl-paywall`, `warm-sphere-moment`.
- **NO LANDING ADDS A FAILING SCREEN:** green on both halves.
- **THE JAVASCRIPT ONLY SHRINKS:** green, net −15.

## Owed

- Live on swarmbook.com at his word (deploy).
