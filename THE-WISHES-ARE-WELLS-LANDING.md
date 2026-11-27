# THE WISHES ARE WELLS

His words (Guido, UTC):

- Nov 21 2026 23:58: "as a capital allocator you can toss money into a wallet and that wallet then drives swarms toward common oss public good goal"
- Nov 22 2026 00:02: "we now gotta focus on the UX... consider that this is akin to cyber patronage..."
- Nov 22 2026 00:37:30, over the drawn patron's road: "i love that. is it implemented yet?"
- Earlier, on this page: Nov 19 "why the fuck do you gotta pollute my eyes with useless text"; Nov 20 "dude, less. LESS".

## What it is

1. On Swarmbook's page after the mint (`app/after-the-mint.html`), "Wishes pull riders" is `#wells`. On the pool's side (`?side=pool`, where the blue plate of the mint page lands) it stands first under the hero, before "The two sides".
2. Once the bar stands (`html[data-arrow="bar"]`), each picture in the row becomes a society read off the chain by the wall's own reader. Each shows its name, the SOL in its treasury and its seats, and is a door to its page (`polis.html?civ=…&program=…`, with the visit's query carried).
3. The last cell is the unlit well: "Make a wish", "Found a society", a door to `found.html`.
4. "Back the riders" now points at `#wells`, not at the governance film's picture. Swarmbook's front (`swarmbook.html`) points its own "Back the riders" at `after-the-mint.html?side=pool#wells`: the door names its side, as the split's blue plate does, so it lands on the wishes (his Nov 12 2026 "it gotta split based on what people click"). Until this lane that door named no side, and a visit with no side is sent on to the mint page while the mint is open, so it led to the film and never to the pool.
5. The flask's side and a plain visit keep the section where it always stood, with its five captions, and fetch nothing new. With no society, or with no answer from the chain, the five captions stay.

The design followed is the drawn one (the patron's road, screen 2: `draw.py`'s cell and its `STYLE`), copied without changes. The one exception is the order of the cells: it is the wall's live order, not the order the sketch was drawn in.

## How

- `app/after-the-mint-book.mjs`:
  - `well()` writes the cell exactly as draw.py does (`<li><a …><img …><b>Name</b><span>0.600 SOL · 8 seats</span></a></li>`). The non-breaking spaces keep a narrow cell from breaking inside "0.014 SOL"; it breaks at the dot instead. `UNLIT` is the last cell.
  - `mountBook()` does the rest on the pool's side only:
    - it moves the section to the front of `.sbk`;
    - it waits for the bar with one MutationObserver, which is disconnected once the bar stands;
    - it then loads the wall page's two classic scripts (web3.js, tweetnacl; `engine.js` draws tiles, and nothing here draws one, so it is left out) and imports `tree.js?v=cache-1`, `wall-roster.js?v=common-form-1` and `chain-cache.js`;
    - it reads `restoreChain()` (the snapshot store), then `readChain({maxAgeMs: CACHE_FRESH_MS})` and `scanBalances(…, {maxAgeMs: CACHE_FRESH_MS})`, which is the wall's freshness;
    - it paints once per read: at most twice, with no timer, no poll and no subscription.
  - Every path is written as a literal (`new URL('<literal>', import.meta.url)`, `import('<literal>')`), so the build's walk (`tools/page-files.mjs`) reaches each one.
- Copies of laws this needs, said here and not hidden (wall.js and polis.js export nothing):
  - **The wall's order** is a second copy of wall.js `chairOrder`, `rankOf` and `byRank`: the fund's chairs by fees, then seals this week, then seats, then treasury. It was checked against the live wall on Nov 22: The Crowded Room, Sealed; The Root, Tipped; The Root, Tipped (the older program); The Split. That is the wall's first four, in that order.
  - **The name** is a second copy of polis.js `renderHead`'s casing.
  - **The treasury** and **the seats** are the same sums over `subtree()` as polis.js "In the treasury" and the first number of "Seats occupied". The treasury uses its `sol()` (`(l / 1e9).toFixed(3)`).
- The dead code is removed: `shelf`, `mineLine`, and the fills of `#am-shelf` and `#am-mine`. No page has those elements. Their CSS is removed too.
- `app/swarmbook-book.css`: draw.py's `STYLE` block.
  - The cell rules sit under `.wells a`, so the five static captions keep their look.
  - The lifted spacing and the 190 px pictures apply only under `html[data-side="pool"]`.
  - The unlit cell is centred on a phone by `li.unlit`.
- The script policy (main `0700016840`) needed no change. Its `script-src 'self'` covers the injected `./vendor/*.js` and the imports. The policy has no `connect-src`, so the devnet RPC the wall already calls goes through. The hash of the one inline module, whose tag changed to `?v=book-3`, is computed again at each build.

Why the section is moved by the module and not by CSS `order`: a flex column on `.sbk` widened the page at 390 px from 413 to 431 px (`.am-riders`'s posters). Moving the node leaves every other section's layout exactly as it was.

## THE TITLE FITS THE PHONE

The fault, read live at 390 px once the bar stands: the page was 413 px wide and SWARMBOOK's last letter was cut at the screen's edge.

- The plate's size comes from `swarmbook-book.css`: `clamp(46px,8.6vw,104px)`.
- Under 700 px, `after-the-mint.css` now caps it at `min(46px, (100vw − 32px) / 8.9)`. The 8.9 em is the word's 7.9 em plus the stroke's .42 em past the word on each side. The stroke keeps its measure, and the type and colours are the plate's own.
- A second overflow, at 360 and 390 px: two doors were wider than the phone on one line ("Ride" with its note, 404 px, and the board's "Be the first rider", 357 px). Under 700 px they now wrap their small line (`swarmbook-book.css`); a door that fits stands as it did.
- Under 380 px a well's numbers close their letter-spacing so they stay on one line.

Measured by script on the live page, served from the lane (headless Chrome, reduced motion, the bar standing). Each box is the left edge plus its width; `sw` is `document.documentElement.scrollWidth`. The "before" figures at 360 and 390 px are in the widened layout's frame (412 and 413 px):

| width | before: sw, font | before: SWARMBOOK word, stroke | after: sw, font | after: word, stroke |
|---|---|---|---|---|
| 360 | 412, 46 px | 26.15+364.45, 5.12+405.69 | **360**, 36.85 px | 34.01+291.96, 17.18+324.98 (stroke ends at 342.16) |
| 390 | 413, 46 px | 26.15+364.45, 5.12+405.69 | **390**, 40.22 px | 35.67+318.66, 17.28+354.73 (ends 372.01) |
| 430 | 430, 46 px | 32.77+364.45, 11.75+405.69 (ends 417.44, past the 16 px side) | 430, 44.72 px | 37.87+354.24, 17.43+394.33 (ends 411.76) |

At 760, 982 and 1440 px nothing moves. The boxes (x, y, w, h) are equal to the hundredth before and after:

| width | `.am-router .am-name` | `.am-warm .am-name` |
|---|---|---|
| 760 | 121.08, 169.53, 517.84, 58.81 | 201.53, 281.7, 356.92, 33.5 |
| 982 | 156.46, 212.19, 669.07, 76 | 260.45, 350.72, 461.11, 43.31 |
| 1440 | 308.01, 238.89, 823.97, 93.59 | 432.46, 404.5, 575.07, 54 |

On the flask's side, the sections' tops and heights at 1440 px are equal before and after (574+529, 1215+571, 1898+360, 2350+1198, 3603+217, 3866+505). At 390 px they move only by the smaller title (−8 px) and the wrapped doors (+25 and +23 px).

## The cost, measured

- **Before the bar:** no byte. The hero's film is untouched.
- **On the pool's side, after the bar** (a cold walk at 1440 px, film to its end, this MacBook's network):
  - 12 files, 189,371 bytes on the wire (695,862 decoded): web3.js 109,467, the two program clients 36,692, tree.js 11,817, tweetnacl 10,713, the reader's scenes/discussion/poetry 14,287, the rest 6,395;
  - then 5 reads of the devnet RPC, the same calls the wall makes.
  - The bar stood at 24.99 s and the wells were in at 25.67 s: 0.68 s from the bar to the wells. A visit with a fresh snapshot paints from the store first.
- **On `?side=flask` and on a plain visit:** nothing new is fetched. The `resource` entries hold no vendor script, no tree.js and no RPC.
- **At rest:** nothing. The one observer is disconnected once the bar stands, and nothing keeps running after the two paints.

JavaScript (`tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs`): +23 −23, **net 0** in 4 files (the dead `shelf`/`mineLine` code paid for the wells and their test).

## Tests (on the new Mac, scratch worktree at the lane's tip)

At f495d9b1ca (node --test, one file at a time, nice 19):

- `app/after-the-mint.test.mjs`: 9 of 9 pass (one new: the well's markup, the unlit cell, nothing read on the flask's side or a plain visit, the wells only after the bar, a failed read leaves the row).
- `app/swarmbook.test.mjs`: 7 of 7.
- `app/dl-twelve.test.mjs`: 21 of 21 (rule 8; the proofs of `app/dl-twelve.proof.mjs`, `--tap button` and `--tap sphere`, ride the hand).
- `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs`: 31 of 31, "+23 -23, net +0 in 4 files".
- `tools/site-files.test.mjs`: 4 of 4. `tools/page-files.mjs` on `app/after-the-mint.html`: 114 files, among them both vendor scripts, tree.js, wall-roster.js, chain-cache.js and the reader's own imports.
- `lab/one-page.test.mjs` (the page-files test of the mint page): 7 of 10, the same three red on main 8965a3dbaa (tests 1, 8, 9: the mint page's entry and the lab's freeze scene), none of them this page's.

## Stills

The stills were read at 360, 390, 430, 760, 982 and 1440 px, at the top once the bar stood and scrolled to the wells. Further runs: one with the film left to its end, one at `?side=flask`, and a before/after pair of the top at 360, 390 and 430 px. They are in the seat's scratch folder; none of them is committed.

## Not built (the next lane)

- The stake that keeps the patron's SOL: a well's "Back this society" press, and the pour into it. A pool born by a society's own seal stands on devnet since Oct 29 2026 (`poleis/THE-HANDS-WIDEN-LANDING.md`), empty when read on Nov 22; no door deposits into one, and the launch press births none.
- A patron's record: who backed which society, and with how much.
- The society's own blue door on its page (`polis.html`, held by another seat).
- A rule for which picture a society's well wears: today the place in the row picks it (4, 3, 2, 1).
- One order for the wall and the wells: the order here is a copy of `wall.js`'s (above). The cure is the rank moved into `wall-roster.js` and read by both pages; it touches the wall's own page, so it is its own lane.
- A name longer than its cell is cut with an ellipsis, as drawn ("The Crowded Room, S…"); the whole name is on the society's page.

## Judged before the hand (seat claude-901e44a8, Nov 22 2026 01:1x UTC)

The lane's four files served on the live site (`swarmbook.com/app/after-the-mint.html`), headless and off every screen, nothing pressed:

| the visit | the page's width | what the row holds |
|---|---|---|
| `?side=pool` at 1440, 982, 760, 390 and 360 px | equal to the screen's at every size | the wells first under the hero: The Crowded Room, Sealed (0.014 SOL, 12 seats); The Root, Tipped (0.600, 8); The Root, Tipped (0.300, 6: the older program's); The Split (0.009, 6); Make a wish |
| `?side=flask` at 390 px | 390 | the five captions, where the section always stood |

Looked at, each still: the top at 1440 and 982 (the wells' names and numbers inside the first screen), the wells at 760 (the numbers break at the dot), the top, the wells and the doors at 390, the wells at 360.

Run again on the new Mac at 1962f4fbba (this judgement's own tip, Nov 22 2026 01:2x UTC, one file at a time, nice 19): `app/swarmbook.test.mjs` 7 of 7; `app/after-the-mint.test.mjs` 9 of 9; `app/dl-twelve.test.mjs` 21 of 21; `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs` 31 of 31, "+23 -23, net +0 in 4 files"; `tools/site-files.test.mjs` 4 of 4.
