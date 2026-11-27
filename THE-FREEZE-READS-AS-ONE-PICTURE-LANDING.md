# THE FREEZE READS AS ONE PICTURE: on a phone the freeze owns the screen, its two names are one title, and JOIN THE $WARM is a call, not a caption (lane/the-freeze-reads-as-one-picture, Oct 30 2026 07:xx UTC)

A seat on the new Mac (claude-61e371e5).
- **The scene:** SPACE ROUTER AT THE FREEZE (`app/dl-space-router.js`; `SPACE-ROUTER-AT-THE-FREEZE-LANDING.md`, `PROMPT-TO-MINE-AT-THE-FREEZE-LANDING.md`).
- **Its tokens are the router's own** (his Oct 29 21:23 UTC "space-router coded"), and none is new here.
- **The $WARM & SpaceRouter seat** (claude-1a67b2d3), which holds the file, was told before the change.

## His words (UTC)

**06:39:47:** "ok, but like... can you please focus on the aesthetics of this?", over a screenshot of the freeze on his phone (390 × 844). It showed:
- SPACE ROUTER stamped PROMPT-TO-MINE;
- 1 $WARM stamped MINED PER $1;
- the flask;
- JOIN THE $WARM, and her with the egg.

## What his screenshot showed, and main showed again headless

The rig: headless Chrome, off every screen and muted, with every other host refused. The page was served with byte ranges (`tools/serve-range`, from
`embertide-app/ui/intro`, since the page reaches `../../room/`). The film was skipped and she was made. Sizes: 390 × 844 (his phone), 673 × 873 (his
preview pane) and 1440 × 900.

1. **The page under the freeze showed through.**
   - The vignette darkens the page but does not hide it. "The Dyson Society. / Collective Self Improvement" stood as a dim ghost behind SPACE ROUTER's
     slash.
   - "Play with audio on" showed under her.
2. **The two names were two islands.** Their centres were set at 32 % and 72 % of the dark above the flask, which left:
   - on the phone, a dead band of about 59 px between PROMPT-TO-MINE and 1 $WARM;
   - in his preview pane, PROMPT-TO-MINE touching the rebate's slash.
3. **JOIN THE $WARM, the one action, was the smallest thing on the screen.** On the phone it was wrapped in two lines at 17 px, in the 134 px her 240 px
   figure left beside her.

## What changed (`app/dl-space-router.js`, CSS and `place()` only)

1. **The freeze owns the screen.** While it stands, the page's header, its skip and its invite step out (`visibility:hidden`). This is the way
   `.dl-athena-layer` and the film already did.
2. **One over the other, the names are one title.**
   - The rebate stands under the router at one gap (0.3 of 1 $WARM's size, at least 14 px).
   - The pair is centred in the dark above the flask, clear of the close (`TOP_CLEAR`, 56 px).
   - When that dark is too low for both at their size, each is made a little smaller, so they never cover the flask or each other.
   - Their sizes are worked out as before. Beside the flask (a wide screen) nothing changes.
3. **In the floor left of her, the call stands in two tiers:** JOIN THE stamped in gold over $WARM.
   - It is as large as that floor holds (its width is `STACK_EMS`, 6 ems, measured headless), and never above 0.6 of 1 $WARM's size (`CRY_OF_WARM`).
   - On a narrow screen her figure is at most 210 px tall (27 vh) instead of 240 px (30 vh), so the call has the room to be read.
   - Under the flask (a wide screen) the call stays one line, as before.

**What did not change:**
- the words, the stamps and the slams' timing;
- the flask, the vignette, the white and the focus lines;
- the presses: each name to the offer, the call to the kit;
- her sprite, which is only smaller on a narrow screen;
- the wide layout.

## Measured (the lane's page, the same rig)

| | main | the lane |
|---|---|---|
| 390 × 844, SPACE ROUTER and 1 $WARM | centres 113 and 255 px | blocks 80–148 and 178–274 px, a 30 px gap |
| 673 × 873, the names | the stamp touching the rebate's slash | 49 and 65 px, blocks 61–141 and 171–271 px |
| 390 × 844, JOIN THE $WARM | two lines at 17 px in 134 px | two tiers, $WARM at 28 px; 8 px from the edge, 8 px clear of her |
| 673 × 873, JOIN THE $WARM | one line at 22 px | two tiers, $WARM at 39 px (0.6 of 65) |
| 1440 × 900 | names at the flask's shoulders, the call one line under it | the same |
| the page under the freeze | its header and invite visible | hidden |
| page errors | none | none |

**The cost:**
- `dl-space-router.js` grows 2,388 bytes (19,369 to 21,757), mostly comments.
- No request, no frame and no timer is added.
- `place()`, which runs on open and on resize, does at most three more multiplications per name.

## Proved

- `node --test app/dl-space-router.scene.test.mjs app/dl-twelve.test.mjs` (the new Mac, nice 19): 24 of 24. The scene test now pins:
  - the page's header, skip and invite stepping out;
  - the one gap between the names and the title clear of the close;
  - in his preview pane, the pair never over the flask or over each other, with the rebate still the louder;
  - the call in two tiers left of her, as large as the floor holds and never louder than the rebate;
  - one line under the flask.
- **Rule 8,** on the lane's page served with byte ranges (`tools/serve-range`):
  - `node --test app/dl-twelve.test.mjs`: green, within the 24 above.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS.
  - The same with `--tap sphere`: PASS.
