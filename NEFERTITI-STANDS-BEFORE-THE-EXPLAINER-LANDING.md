# NEFERTITI STANDS BEFORE THE EXPLAINER

Lane `lane/nefertiti-stands-before-the-explainer`, seat claude-3853f028, Nov 12 2026, cut from main 20c64cf5cf. Not handed: his word for the hand.

## His words (Nov 12 2026, about 00:15 and 01:00 UTC, over a crop of the mint page during her pitch)

- "there is this ugly shadow shit dude..." (her face half dimmed, the dark edge running down through her eye)
- to "the fix is one line, it is not in main yet": "so?"

## What was wrong

The explainer's sheet (`#dl-explain`, `app/dl-paywall.css`: the dark ground under the drawing that goes with her twelve lines, the left 66vw of the
picture's band) was a child of `body` at z-index 2147483600, above her layer (`.dl-athena-layer`, 2147483000). Her picture begins left of 66vw on
every screen that is not wide and low: read in a 712 by 1125 window, her picture began at 168 px and the sheet ended at 470 px, so 300 px of her was
under it; at 1440 by 900 the sheet's fading end still dimmed her hair.

## What changed

One declaration: the sheet's z-index is 2147482999, one under her layer. Her picture and her line are never under it; the sheet and its drawing
still lie over the sphere. `warm.html` names the sheet's new version (`flask-door-28`). The file is the deposit seat's (claude-d86f9ecf); it was told
the cause and the fix at about 00:20 UTC, its follow-up lane landed without it, and this lane changes that one declaration and nothing else of it.

## Cost

None: one number in a stylesheet. No JavaScript (the page's one changed line is its stylesheet's version mark, net 0).

## Read

- In the app's browser pane, on a scratch copy of the Worker serving this lane's tree, during her pitch: at 1440 by 900, 712 by 1125 and 390 by 844
  she stands whole and bright before the sheet. Pictures: `.claude/the-mint-page/fixed-*.jpg` in the seat's worktree (not in git).
- On the new Mac at 7316dfd901 (this commit's code): `node --test app/dl-twelve.test.mjs` 21 of 21; `nice -n 19 node app/dl-twelve.proof.mjs --url
  <the served page> --tap button` PASS and `--tap sphere` PASS; the app folder's tests 491 of 495, the same 4 red as main at 20c64cf5cf, none red on
  this lane alone.

## What it leaves

- In a window narrower than about 900 px that is not a phone's, the drawing's lower labels run under her picture: the drawing's layout, not changed.
- The sheet's right end still reads as a vertical edge across the sphere (its fade is the last 14% of 66vw): not his crop, not changed.
- optimism.fit serves an older build: nothing of the mint page as it is in main is live until the deploy.
