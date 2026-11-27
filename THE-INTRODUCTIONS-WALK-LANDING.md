# THE INTRODUCTIONS WALK, AND NO STAIRS

Nov 26 2026 UTC, seat claude-212510a1, `lane/the-introductions-walk`.

His words, Nov 26 2026:
- "clicking why is a fucking nightmare dude";
- "no dumbass, there is no fucking coherent navigation... also the loading is sequential and it causes hiccups like stair effects: these shits load
  before the images and it fucks shit up", over Why's labels ("Your traces / Your agent") standing before their cones.

## What changes

- **The introductions walk.** Why (`ecology.html`) and How (`rules.html`) are two steps out of Societies and back.
  - Under the bar a strip says where the visitor stands: `← Societies · I Why · II How`, the step lit.
  - At the page's end one door goes on: Why to "How a swarm decides", How to "Enter the societies".
  - Static links and CSS (`site-bar.css`), no script.
- **No stairs.** Why's figure labels wait for the cones they name: `opacity: 0` until `ecology.js` places them and marks the figure drawn, then they
  fade in with it. `ecology.js` has a new version tag, so no browser keeps the old script, under which the labels would never show.
- **Each cell a first visit.** The screens checker (`embertide-screens/src/main.rs`) clears the browser's cookies at each cell.
  - The cells of one Chrome shared its cookies.
  - A mint cell that reached her offer wrote `am-intro`, and HER OFFER IS ONCE A BROWSER then sent every later mint cell to Societies: 58 files
    asked for that the mint's loads never held.
- **JavaScript net 0.**

## Measured (this tree served by `tools/serve-range`, headless off every screen)

- **Why and How** at 1440x900 and 390x844: the walk under the bar with the step lit, the next door at the end, no sideways scroll; on Why the figure
  marked drawn.
- **The site's tests:** 608 of 611, the 3 red main's own.
- **The screens checker's own tests:** `cargo test --release` 57, 14, 12 and 10, all passing.
- **NO LANDING ADDS A FAILING SCREEN:** green on both halves, 0 new failing of 168 cells, 0 files missing from the loads.
  - The first run was red: the walk's gold numerals on the bare split at 4.1 to 4.4:1, and the mint cells asking for Societies' files.
- **Rule 8, no sound touched:**
  - `node --test app/dl-twelve.test.mjs` passes 22 of 22;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <warm.html served by tools/serve-range>` passes with `--tap button` and with `--tap sphere`.

## Owed

- Live on swarmbook.com at his word (deploy).
