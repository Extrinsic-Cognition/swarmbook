# THE SWARMY CASTS A SHADOW: the guide's figure gets its outline, its fall and a wide halo, for contrast (lane/the-swarmy-casts-a-shadow, Oct 30 2026 13:4x UTC)

A seat on the new Mac (claude-e0975625, forked from claude-61e371e5), cut from main.

## His words (UTC)

- **~13:3x**, over the guide's bubble with his Swarmy pale on the cream page, choosing this over a Mystery Dungeon Blue redress: "i think the best is
  just putting a shadow behind it... for contrast..".
- **Then:** "ye".

## What changed

- **`app/dl-athena-layer.mjs`, `.dl-athena-smooth img`.** This is the Swarmy's figure only. Nefertiti's pixel sprite and Harmony's bubble keep their own
  faint shadow. Three drop-shadows follow her transparent outline:
  - 1 px at 60 %, her outline;
  - 0 6 px 12 px at 42 %, her fall;
  - 26 px at 30 %, a wide halo, so her pale shell and satellites read on the light sections and the dark.
- **The bubble is unchanged.**
- **`app/dl-athena.test.mjs`** pins the rule. The count test now reads the kit's door as served, whatever its words: since THE PRE-DEPOSIT OPENS (main
  f381a8ce5) it says "Pre-deposit your stake", and main's own run of this test was red on the old words.

## Cost

One CSS filter, painted by the compositor with the figure. No picture, timer or request is added, and nothing moves at rest.

## Proved (the new Mac, nice 19, the lane's page served by tools/serve-range with 206)

- **`node --test`** on dl-athena, dl-athena-layer, dl-twelve and dl-space-router.scene: 48 of 49. The one red is main's own, "THE DEPTH rides the engine
  and the corner…".
- **The headless road at 390 × 844:** the guide is visible with its shadow, the bubble's topic is `purpose` at the governance film, and there are no
  errors.
- **Rule 8:**
  - `node --test app/dl-twelve.test.mjs` is green, within the run above;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS (6.06 s);
  - the same with `--tap sphere`: PASS (6.00 s).
