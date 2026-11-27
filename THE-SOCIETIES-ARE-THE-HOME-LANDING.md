# THE SOCIETIES ARE THE HOME

Nov 26 2026 UTC, seat claude-212510a1, `lane/the-societies-are-the-home`.

His words, Nov 26 2026:
- "rules is all fucked up", over the live rules.html; then "same thing for this", over ecology.html.
- "societies should be the app homepage for people that have already watched the animations (saint seya)... rules there and ecology should be
  introductions explaining but the societies tab is the home tab dude".
- "pantheon should go into the stake tab... pantheon is for the stakers. socieities remains with grid".

The Pantheon on Stake landed as `lane/the-pantheon-is-the-stake` (seat claude-168f7fed). This seat withdrew its own Pantheon page
(`lane/the-front-door-wears-the-bar-and-the-pantheon-stands`, its end said on the Nest).

## What was wrong (read live on swarmbook.com, headless)

- **Rules' sandbox never played.** The page holds two elements with the id `plate`.
  - Since Nov 19 (0def153aca) an empty `<i id="plate" hidden>` anchor comes first. The book frames rules.html at `#plate`.
  - `seals.js` watched `getElementById('plate')`, which is that hidden anchor. It never intersects, so the scene never started.
  - The figure stood frozen on its first frame: the users and their Wardens only, the red half empty. It was identical at 5 s and at 20 s.
- **A box at the top of Rules, Why and the other split pages.** The sticky header's glass (dark, with an 8 px blur) laid a second blue-to-red band
  over the split. Its colours did not meet the split's seam below it.
- **Societies was not a home.** It opened on an introduction: the big SWARMBOOK plate, Prompt-2-mine, a 4,718 px scroll story (her ball, the
  goldberg, the descent), then the governance study and the anatomy. The wall of societies sat inside the scroll story, thrown about by it.

## What changes

- **The home is the grid.** `index.html` opens on the mark (to the front door), the bar, then the wall: Your wish first, then the twelve most active
  societies, each card a door to its page. Then Join and the roster.
  - The hero, the scroll story, the governance study and the anatomy leave the home. The introductions are Why and How.
  - The grid is the wall's own (`front.css`, three columns, two under 980 px, one under 620 px), its cards their own heights.
  - `wall.js` no longer mounts her ball, the assembly, the descent, the slope or the anatomy. Each tile keeps its own engine, as before.
  - Their modules stand in the tree, unmounted.
- **A visitor who has seen the intro opens on Societies.**
  - `worker/premint.mjs`: `/` with the `am-intro=1` cookie and no query goes to `/app/index.html`.
  - A friend's link (any query) still opens the mint.
  - The cookie is written by the bar after the mint (THE INTRO PLAYS ONCE), and now by the mint itself when her egg is offered (`dl-athena.js`).
- **Rules' sandbox plays.** `seals.js` watches `.plate`.
- **The split runs under the header.** On every page of `holy.css`, at the top the header stands on the split. Its glass comes in over the first
  120 px of the scroll, pure CSS (`animation-timeline: scroll()`). Its small line ("Constitutional AI Swarms") turns ivory.
- **The front door wears the bar.** `warm.html` carries the bar: Stake, Ride, Societies, Tracenet, the Pantheon now in Stake.
  - It is fixed in the black band above her split.
  - It is unseen through the film, her entrance and her making.
  - It is seen at her offer and on the ending's plates.
  - The held page never scrolls.

JavaScript: net −117 lines (+38 −155 in 22 files).

## Measured (this tree served by `tools/serve-range`, headless off every screen)

- **The home** at 1440x900, 750x960 and 390x844:
  - the mark, the bar with Societies lit, then the grid's 12 cards;
  - no sideways scroll;
  - the header 81, 125 and 159 px.
- **Rules** at the same sizes: the sandbox moving, with the users, the Wardens, the public treasury, the three fuel tanks, the agents'
  micropayments and the products. No box at the top. **Why** the same, with no box.
- **The mint**, walked by trusted presses at 1440x900, 390x844 and 360x740:

  | Step | Bar |
  | --- | --- |
  | Film, entrance | hidden |
  | Offer | seen, on top, bottom 81, 53 and 48 px against the split at 117, 110 and 96 px |
  | Her making | hidden |
  | Ending plates | seen, on top |

  - `am-intro=1` is written at the offer.
  - scrollY stayed 0.
  - The film and the song were never sought.
  - The proof's one red is main's own: its step 4 expects the page to be given back after the plates, which THE ENDING IS THE PAGE now holds.
- **The site's tests** (`node --test app/*.test.mjs tools/site-files.test.mjs worker/premint.test.mjs`): 597 of 600.
  - The 3 red are main's own: `dl-glass`, `dl-paywall`, `warm-sphere-moment`.
  - `swarmbook-floor.test.mjs` now holds the home: no intro on it, the mark, the grid, the mint's bar.
  - `premint.test.mjs` holds the door: seen goes to Societies, a friend's link to the mint, `am-intro=10` to the mint.
- **Rule 8, no sound touched:**
  - `node --test app/dl-twelve.test.mjs` passes 21 of 21;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <warm.html served by tools/serve-range>` passes with `--tap button` and with `--tap sphere`.
- **NO LANDING ADDS A FAILING SCREEN** (`.1.sh`, `.2.sh`): green, 0 new failing of 204 cells.
  - The first run was red on 11 cells: the header's line at 3.7 to 4.5:1 on the bare split, and the home's status saying "did not answer" on a
    4K first screen while the static copy reads no chain.
  - The mint's two sheets were also missing from the loads.
  - All three were fixed.
- **THE JAVASCRIPT ONLY SHRINKS:** green, net −117.

## Owed

- The scroll story (her ball, the goldberg, the descent) and the governance study stand unmounted. If Why or How should carry them, that is his word.
- `dl-red-road.proof.mjs` step 4 still expects the page to be given back after the plates. Main's own.
- Not on swarmbook.com until a deploy, his word.
