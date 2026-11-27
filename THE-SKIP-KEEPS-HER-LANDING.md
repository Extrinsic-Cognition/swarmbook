# THE SKIP KEEPS HER: Skip to the mint passes the film alone; her intro and her colours play (Oct 29 2026, lane/the-skip-keeps-her, claude-1a67b2d3)

**His words,** Oct 29 2026 16:2x UTC, over two screenshots of the mint page (her intro over the sphere, and "Give me my colours."): "i said to prepare
the ux, why the fuck if i click "skip to mint" then i get to a place that skips past the coloring phase of the lyssajudron; also her fucking intro... it
looks all too accidental and it kinda is... i need you to fucking optimize for MMO vibes and bringing this fucking lyssajudron with you... you understand
that a pivotal moment in all this is going to be the demo video we still gott to record.. right?".

**Before it,** his Oct 15 words on her making: "no skip of her customization", "KEEP ONLY THE CONTINUE BUTTON".

## What stood (THE FLASK AT THE FREEZE, Oct 28)

SKIP TO THE MINT seeks the film to 1.2 s before the drawn arrow and says SKIP_EVENT. Two listeners heard it:
- `dl-athena.js` set `S.skipped`, so at the stop she landed with no entrance;
- `dl-her-colours.js` marked her making `skipped`, so the rebate slammed in at once, and her colouring (your MMO character) was passed by.

## What changes

- **`dl-athena.js`:** SKIP_EVENT asks for her entrance's frames at once (`preload()`) and ends nothing. The no-entrance branch is gone. Her coming, her
  entrance and her landing play as for everyone. A press, a key or a scroll during her entrance still ends it, her own Skip, as before.
- **`dl-her-colours.js`:** SKIP_EVENT no longer marks her making skipped. After a skip, her landing opens her making ("Give me my colours.", the song,
  Continue), and the rebate comes on her 'made'.
- **`dl-twelve.js`:** the skip lands 3 s before the arrow (was 1.2 s), so her entrance's frames load on the way and her coming plays whole.
- **Tests follow:** `dl-athena.test.mjs`, `dl-twelve.test.mjs` (3 s), and `dl-her-colours.proof.mjs` (a skip opens her making).

## Measured

- **The real press, in headless Chrome off every screen.** The setup: this lane's page on the dev road (`tools/serve-range` and `mint-dev.mjs`), the
  film playing muted, the real SKIP TO THE MINT clicked, her event read off the page. Times from the page's load:

  | Time | What the page said |
  | --- | --- |
  | 7.0 s | the skip |
  | 9.2 s | `coming` |
  | 10.1 s | `entered` (her entrance) |
  | 35.8 s | `landed`, with the entrance `whole` |

  Then her making opened (`DL_HER.state().open`). The rebate scene did not open before she was made. No page error.
- `node --test` over dl-athena, dl-twelve, dl-her-colours, dl-space-router.scene, dl-visit and dl-harmony-doors: 52 of 53. The one red is main's own
  (dl-athena's THE DEPTH).
- **Rule 8,** on this lane's page served with byte ranges:
  - `node --test app/dl-twelve.test.mjs`: green.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS.
  - The same with `--tap sphere`: PASS.

## Edges, said

- Her entrance is 25.7 s long from her hit to her landing. That is her intro, now kept after a skip, and the demo video will show it whole.
- The rest of his ask is the flow as one MMO story for the demo video, and the brand as renegades grouping together against bullies. Those are this
  lane's next steps, not in it.
