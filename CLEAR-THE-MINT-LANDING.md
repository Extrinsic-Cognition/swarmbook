# CLEAR THE MINT: optimism.fit's page says $WARM, never the old NFT mint (Oct 30 2026, lane/clear-the-mint, claude-bf9176cc)

## His words, Oct 30 2026, UTC (relayed by claude-1a67b2d3, the $WARM seat, which started this one)

- 03:18:17: "explain to me what have you been doing all along... what is all that? i dont fucking get it... i am left at a page where people mint shit dude".
- 03:21:04: his click "Yes, clear it". The question was "Clear the old NFT mint off the page and make it the $WARM launch page?". The button's text was
  the seat's: "Yes: take every NFT mint word off the page (Augur Pass, Bronze, pre-mint, the mint count, Skip to the mint) and make it the $WARM launch
  page, until Breakpoint."

## What a visitor met on main (read, not guessed)

`app/dl-warm-words.proof.mjs` (new, below) walked main's page in headless Chrome at 1440x900 and 390x844 and read every word it renders, at every
moment of the walk. Main said the old mint 15 times at each size:

| Where | On main |
| --- | --- |
| the film's skip, its text and its aria-label | "Skip to the mint ›", "Skip the film to the mint" |
| the film's row (aria-labels) | "Mint film controls", "Restart the mint film from its first frame", "Pause the mint film and motion" |
| her question | "Skip to the mint?" |
| the swarm's rite, chapter 02: its button, its words, its announcement, the pass in its picture, the picture's label | "Mint Augur Pass", "Mint an Augur Pass. Join the society.", "Mint an Augur Pass. Your agent joins the Dyson Society.", "Augur Pass", "Your agent mints an Augur Pass, ..." |
| a press on a face of the film's dodecahedron opens the passport chamber | "Mint passport ↗" (under "Opens 14 September 2026 · 0.1 SOL"), the passport's "OG Augur passport — unissued design preview" and "... not an NFT or proof of admission." |
| the app's entry (?from=harmony) | "Choose pre-mint access below. NFT minting is not open yet." |

Her own Skip, while her entrance runs, said the film's words ("Skip to the mint ›"): the read keeps each word once, so it counts once above. Pressed,
the holder's road opened the slot (below).

## What put the legacy reservation slot on the page, and how it is kept off

The slot is `#slot-dialog` in `app/warm.html`: "Bronze Mint.", "$10 · Whitelist pre-mint access." and a link to `legacy-reservations.html`, the
checkout's dialog (`dl-direct.js`). Two ways open it:
1. **The holder's road**, "I hold a seat: connect my wallet ↗" (`[data-mint-holder]`, under the kit): one press runs `dl-direct.js holder()`,
   which opens the dialog on the wallet's purchases. This was the page's one live door to it.
2. **`window.takeSlot()`** from `warm.js` on a press of a confirmed face of the sphere. The sphere is confirmed only by the whitelist reader
   (`dl-whitelist.js` `setSnapshot`), which this page never loads, so a face press opens the passport chamber instead (the table above).

So: the holder's road left the page with the seats (no seat is offered, and the order book held none paid: `A-REFUND-HE-SIGNS-LANDING.md`), her
topic for it went with it (`dl-athena.js` TOPICS 'holder' and its act), and the dialog stays only as the checkout's mount (`dl-direct.js` reads its
ids at load), with no words of its own: an empty title and price, and no link to the earlier test reservations. The code stays in the tree:
`dl-direct.js` (holder(), open(), takeSlot), `dl-slot.js`, `dl-sale-tiers.js`, `legacy-reservations.html`, and a tracenet's own `#tn-holder`.

## What changes (the words are drafts, his to reword)

| Where | Was | Is |
| --- | --- | --- |
| `app/warm.html` the film's skip | Skip to the mint › (aria "Skip the film to the mint") | **Skip to $WARM ›** (aria "Skip the film to $WARM") |
| `app/dl-athena.js` her Skip | Skip to the mint › | **Skip to $WARM ›** |
| `app/dl-athena.mjs` ASK | Skip to the mint? | **Skip to $WARM?** (Skip and Stay kept) |
| `app/warm.html` + `app/dl-twelve.js` the film's row (aria) | Mint film controls; Restart the mint film ...; Pause/Resume the mint film and motion | Film controls; Restart the film ...; Pause/Resume the film and motion |
| `app/warm.html` the sphere's status | Reading NFT mint count… (`dl-mint-liquor.mjs` writes "NFT minting is not live yet." and siblings) | nothing: the element and its two CSS rules are gone, so the reader writes nowhere |
| `app/warm.html` the app's entry | Choose pre-mint access below. NFT minting is not open yet. | removed |
| `app/warm.html` + `app/swarm-explainer.js` chapter 02 | Mint Augur Pass; Mint an Augur Pass. Join the society.; its announcement | **Stake SOL**; **[Stake SOL.](#her-door) Join the swarm.** (a link to the starter kit, its first child `#her-door`); the announcement "Stake SOL. Join the swarm." |
| `app/warm.html` the pass in the rite's picture | Augur Pass / The Dyson Society | **SOL staked / The starter kit** (her figure's own SOL STAKED) |
| `app/warm.html` the picture's label | Your agent mints an Augur Pass, verifies ... | You stake SOL and your agent joins, verifies ... |
| `app/warm.html` the passport chamber | Opens 14 September 2026 · 0.1 SOL · Mint passport ↗ | removed |
| `app/warm-passport.js` the passport's SVG title and desc | OG Augur passport ...; ... not an NFT or proof of admission. | OG passport ...; ... not proof of admission. |
| `lab/mint-liquor-scene.mjs` the glass's aria-label | ... Amber liquor follows verified Society NFT supply. | that sentence removed |
| `app/warm.html` the holder's road and the slot's words | above | above |
| `app/dl-paywall.js` mintLine, with a close given (the film's page only: `dl-twelve.js` passes `closes: MINT_CLOSES`) | The mint is open until November 15: N days left. / The mint is closed. | **$WARM · N days left** / **$WARM's window is closed.** (with his launch day set: "... The code is free." / "... The code is free from <day>.") |

`app/swarm-explainer.css` gives chapter 02's link an underline (the page's links have none). A tracenet's page passes no close, so its words
("The mint runs for 7 days from launch.", ...) stand as they were. Code names stay: classes, ids, `data-mint-*`, `MINT_CLOSES`, `SKIP_EVENT`
('dl-skip-to-mint'), comments.

**The mint line is still hidden on this page** (`<span data-mint-line hidden>`, since lane/stake-dont-spend, pinned in `dl-paywall.test.mjs`), and her
stop topic says only a shown line, so no visitor reads "$WARM · N days left" today: her stop says the kit's "Keep your SOL. Its rewards fuel the
swarm." Showing it as the launch's countdown is his call (the $WARM seat's), not this lane's.

## Tests that follow

- `app/dl-twelve.test.mjs`: the row's and the skip's words; the pause label in `dl-twelve.js`.
- `app/dl-athena.test.mjs`: her Skip, ASK, and the stop's stand-in line.
- `app/dl-paywall.test.mjs`: THE FREEZE's line ("$WARM · 25 days left" on Oct 21), the close ("$WARM's window is closed."), 1 day and 3 days left, the
  launch day's free day under a close, no "mint" in any close-given line, and a tracenet's words unchanged.
- `app/dl-direct.test.mjs`: no holder's road on the film's page (one on a tracenet), and the slot with no tier, price or legacy link.
- `app/warm-entry.test.mjs`: a guard over the page's own words: every text and aria-label, title, alt and placeholder of `warm.html`, comments,
  scripts, styles and attributes aside, says no mint, NFT, Augur or Bronze. On main it finds 14.

## The proof: `app/dl-warm-words.proof.mjs` (new)

A headless Chrome, off every screen, by trusted presses only, at each size: the film and its skip; her question, answered Skip; her entrance with her
own Skip; her landing and her making; Continue and the rebate; JOIN THE $WARM and the kit; each chapter of the rite pressed; the free way; every word
her topics can say; five presses on the film's stage (whatever opens is read); the holder's road if any; the app's entry. A word is everything the page
renders (`Element.checkVisibility`, opacity not asked, so a word fading in is read before it has), every aria-label, title, alt and placeholder, an
SVG's title and desc, `::before`/`::after`, the tab and the link preview. FAIL on mint (minted, pre-mint ...), NFT, Augur with its capital (Claudio's
lore keeps "The last augur.", the founding corpus) or Bronze, on a slot that opened, or on a page error. Canvas text is pixels and is not read.

## Measured

On the new Mac, the lane's page served by `tools/serve-range` (206 on ranges), headless Chrome off every screen.

- **The words, read live** (`nice -n 19 node app/dl-warm-words.proof.mjs --url <the page>`), on the lane rebased on main f4dae2166: PASS, 34 of 34 at
  1440x900 and 390x844; 334 and 336 words read, none of them the old mint; the film's skip "Skip to $WARM ›", her question "Skip to $WARM?", her
  own Skip "Skip to $WARM ›", chapter 02 "02 Stake SOL" / "Stake SOL. Join the swarm." / "SOL staked"; a face press opens the passport chamber and
  nothing else; the slot never opened; no page error. On main's own files, the same proof: FAIL, 15 words of the old mint at each size (344 and
  346 read), and the holder's road, pressed, opened the slot.
- **Rule 8:** `node --test app/dl-twelve.test.mjs` 21 of 21; `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button` PASS (the tap at
  6.10 s), `--tap sphere` PASS (6.01 s): the film never below its second at the tap, the song within 0.15 s of the picture.
- **Her entrance** (`app/dl-athena-entrance.proof.mjs`, her module changed): PASS, 84 of 84 at both sizes, her question "Skip to $WARM?", the focus on
  Stay, her stop and free topics saying the page as it shows.
- **The suites.** The six touched and two neighbours (dl-athena, dl-direct, dl-paywall, dl-twelve, warm-entry, dl-mint-liquor, tracenet,
  dl-harmony-doors) on the rebased lane: 99 of 101, the 2 reds main's own (dl-athena THE DEPTH, dl-paywall Harmony ice and accent tokens). Every
  suite under the mint and every suite outside it that reads the changed files, 142 files, on the lane before its rebase (main abf4517be): 1480 of
  1495 tests, 4 skipped, 11 red; the same 11 fail on main's own files (dl-athena THE DEPTH; dl-paywall Harmony ice tokens; warm-sphere-moment her cut;
  lab/breakdown the scenes' moments; lab/irradiance THE GOLDEN FLASH ONLY; lab/ko-edge the rule of one; lab/one-page three; lab/sacrifice the hero
  mounts it; tools/embertide-mesh/lib/canvas-seat-tags the route).
- **The page's own words** (`warm-entry.test.mjs`'s guard): 14 of the old mint on main, none on the lane.

## Cost

- Bytes: +135 gzipped over the nine shipped files (comments, mostly; `warm.html` -44). No timer, listener or draw is added: the chapter's link is a plain
  anchor; the page carries ten fewer elements (the status, the holder's road, the chamber's locked mint, the slot's legacy link; one link added).
- The page still loads the checkout (`dl-direct.js` and `dl-slot-profile.js`) in both entries, with no door into it now. Leaving it is this lane's
  choice (its tests pin the entry's load); dropping it is a lane of its own.

## Left, his

- Every word above is a draft for him to reword: "Skip to $WARM ›", "Skip to $WARM?", "Stake SOL", "Stake SOL. Join the swarm.", "SOL staked / The
  starter kit", "$WARM · N days left", "$WARM's window is closed.".
- Words of the old seats that are not mint words, kept: her question at the rite "What does a seat do?"; the app's entry "After checkout, switch back to
  Harmony to continue your Lyssajudron." (pinned by `warm-entry.test.mjs`; the kit's door is paused, so there is no checkout yet); the sphere's label
  "Saint Seiya dodecahedron and reservation holders".
- Nothing is deployed: the deploy is claude-1a67b2d3's, on his word.
