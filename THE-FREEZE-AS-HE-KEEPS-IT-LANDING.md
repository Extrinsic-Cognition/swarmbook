# THE FREEZE AS HE KEEPS IT: the rebate's freeze stands as in his 08:52 picture, with Nefertiti holding the egg out at its corner (lane/the-freeze-as-he-keeps-it, Oct 30 2026 13:1x UTC)

A seat on the new Mac (claude-61e371e5), cut from main a1d228acc.

## His words (UTC)

- **~13:1x**, over his phone's freeze of 08:52 (SPACE ROUTER / PROMPT-TO-MINE, 1 $WARM / MINED PER $1, the flask, JOIN THE $WARM, and Nefertiti
  holding the golden egg out): "why the fuck have you changed it? it was perfect before".
- **Then:** "prompt-2-mine is a genius thing and the rebate as well".

## What had changed on the freeze since that picture

The rebate's words never changed: SPACE ROUTER / PROMPT-TO-MINE and 1 $WARM / MINED PER $1 (dl-space-router.js SLAMS) stand as they were. Only its
corner had changed:
- **09:14, THE ROAD IS ONE TAKE:** once her egg was given, the freeze showed no picture of her. That was on optimism.fit since the ~10:0x deploy.
- **12:53, THE GUIDE IS YOUR SWARMY (this seat):** the visitor's own Lyssajudron stood there instead.

## What changed

- **`app/dl-space-router.js`.** The freeze opens with Nefertiti's offer pose at its corner, every time, whether or not her egg was given. The Swarmy
  code and its CSS left the freeze. JOIN THE $WARM stands in the floor left of her in two tiers, as in his picture.
- **What stays from THE GUIDE IS YOUR SWARMY:**
  - after the freeze, the page's floating guide is the visitor's own Lyssajudron;
  - Nefertiti's floating guide never comes back;
  - the guide is seen again once the freeze has ridden off the screen.
- **Tests and proofs follow:**
  - `dl-space-router.scene.test.mjs`: her egg given, the freeze still shows her offer pose.
  - `dl-athena.test.mjs`: no Swarmy in the freeze's code.
  - `dl-athena-entrance.proof.mjs`: as in his picture, Nefertiti at the corner, no other picture of her, and the one guide the Swarmy.

## Proved (the new Mac, nice 19, the lane's page served by tools/serve-range with 206)

- **`node --test` on the mint's eight files: 119 of 121.** The two reds are main's own.
- **`dl-athena-entrance.proof.mjs`: PASS** at 1440 × 900, 491 × 866 and 390 × 844. "After Enter the freeze as in his picture: Nefertiti at its corner
  holding the egg out, no other picture of her, and the one guide the visitor's own Swarmy."
- **Rule 8:**
  - `node --test app/dl-twelve.test.mjs` is green, within the run above;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS (6.05 s);
  - the same with `--tap sphere`: PASS (6.06 s).
