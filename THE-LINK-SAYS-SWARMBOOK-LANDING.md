# THE LINK SAYS SWARMBOOK

Nov 26 2026 UTC, seat claude-168f7fed, `lane/the-link-says-swarmbook`. His "Yes, swarmbook.com", ~01:5x UTC, to "Should the share link say swarmbook.com
instead of optimism.fit?", after his "the share link is broken: https://optimism.fit/#her=..." (THE ENDING IS THE PAGE, AND THE LINK GIVES HER).

## What changes

- `dl-her-reel.mjs` SITE: `https://swarmbook.com`, where it was `https://optimism.fit`. Every link to her takes it: her reel's share, the Post your face on
  X plate of the red road (`dl-hexagon.js` postOf), and the fallback base of the app's door (`dl-her-colours.js` toApp).
- The same Worker answers both names (SWARMBOOK AND OPTIMISM.FIT ARE ONE PAGE), so a link made before still opens her.
- Not changed: the signing domains (`dl-her-wishes.mjs` PROOF_DOMAIN, HER_PHONE_DOMAIN, HER_KEY_DOMAIN), which are the keys' context and not
  addresses (a change would void every proof and every her code made so far), and the `from: 'optimism.fit'` word on a paint the Nest keeps.
- JavaScript +4 -4, net 0.

## Measured

- Live, headless, 823 x 962: `https://swarmbook.com/#her=1.760BF0...` (his link under the new name) answers 302 to `/app/warm.html`, the fragment kept,
  and her making opens on the sharer's her (`her: on`, a visit), as the optimism.fit link does.
- `node --test app/dl-her-reel.test.mjs app/dl-her-colours.test.mjs app/dl-hexagon.test.mjs app/dl-her-friends.test.mjs app/harmony-link.test.mjs`:
  49 of 49. The new case was red first: SITE still optimism.fit.
- Rule 8, no sound touched: `node --test app/dl-twelve.test.mjs` and `app/dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range`, both taps
  (button, sphere): 21 of 21, PASS on both.

## Owed

- Not on swarmbook.com until a deploy, his word.
