# THE INTRO PLAYS ONCE

Nov 26 2026 UTC, seat claude-168f7fed, `lane/the-intro-plays-once`. His words, ~02:3x UTC, over the bar of THE ONE HEADER in his browser pane: "u realize
most of the buttons are broken? also keep cookies to avoid re-showing intro animations all the times especially when cycling through these tabs..."

## What was wrong

- Each of the bar's sides, Stake and Ride, is `after-the-mint.html`, and every visit to it played its intro again.
- The bar hides during the intro, so as not to cover the film. So a press on Ride showed 27 s of film with nothing to press but the blue side's Skip
  (the red side has none).
- Cycling Stake, Ride, Stake was a film each time. Read in a headless Chrome, one visitor: the bar stood 27.4 s after the first press.

## What changes

`after-the-mint-tree.mjs`: once the bar has stood, the cookie `am-intro=1` says so for a year (`max-age=31536000; path=/; samesite=lax`). A visit
that carries it opens either side on its bar, the film not played, as a visitor who asks for less motion already does. A first visit plays the intro as
ever.

JavaScript +8 -8, net 0: `dl-athena-film.test.mjs` folded where its assertions stood one to a line.

## Measured (this tree served by `tools/serve-range`, one visitor, one headless Chrome, 1200 x 900)

| | the bar stood after the press | the film |
|---|---|---|
| first visit, blue | 27.4 s | played |
| Ride | 0.6 s | not played |
| Stake | 0.3 s | not played |
| Ride | 0.3 s | not played |

The lit item followed each press: Stake, Ride, Stake, Ride.

- `node --test app/after-the-mint.test.mjs`: 15 of 15. The new case was red on the lane before the change: "seen once: the bar at once, no film".
- Rule 8, no sound touched: `node --test app/dl-twelve.test.mjs` and `app/dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range`, both taps
  (button, sphere): 21 of 21, PASS on both.

## Owed

- The buttons he called broken were the sides' presses that answered with the film. Every other button of the bar goes where it says (read today:
  Pantheon to the Pantheon, Societies to the wall, Tracenet to the first tracenet). Any other broken button he means is not found here.
- The mint's own intro (`warm.html`) keeps its own memory (dl-space-router.js, the egg kept); its bar is the lane `the-mint-s-bar-and-a-pan`'s.
- Not on swarmbook.com until a deploy, his word.
