# THE GUIDE IS YOUR SWARMY: once you press Enter the world, the page's guide is the Lyssajudron you just painted (lane/the-guide-is-your-swarmy, Oct 30 2026 12:3x UTC)

A seat on the new Mac (claude-61e371e5), cut from main 84805437b. The intro seat (claude-603a6063) and the $WARM & SpaceRouter seat
(claude-1a67b2d3) were told before the change. No line of hers changes. The guide speaks only the page's own words, as before.

## His words (UTC)

- **~12:0x**, over the mint in the preview, with four pictures: her making at 4/12, her share card, ENTER THE WORLD, and the freeze. "this is what gets
  shown when i click enter the world".
- **~12:1x:** "what if you replace the floating nefertiti in the webpage with the lyssajudron just created and we use that for the guide vs anything else?
  that lyssajudron could explain the 2nd video etc..."
- **Behind it:**
  - Oct 29 17:39, on the 2nd video, his governance film (#purpose): "leave my fucking governance film as it was".
  - Oct 30 11:23: "i asked to make lyssajudron basically AR over thesims4 at runtime". This is the same creature, entering the world.

## What changed

1. **The guide is your Swarmy** (`app/dl-athena.js` handoff, `app/dl-athena.mjs` SWARMY).
   - **The cause.** Her making's Continue ("Enter the world") cuts one picture of her from her renderer's own canvas, transparent round her, and puts it in
     the kit (`[data-kit-her]`, dl-her-colours.js KIT_HER). That picture landing is the cause.
   - **Nefertiti's part is never cut short.** If she is still to come, or mid-entrance, she finishes first, and the hand-off waits until she leaves with
     her egg or lands after her Skip.
   - **Then she is gone for the page.** Her layer is let go: no `athena.png` anywhere, and no lyssajudron engine under the guide.
   - **The guide is the same layer law**: the same topics, bubble and doors. Its figure is that picture, scaled smoothly (not as pixels) and with no mask.
   - **It steps aside** while her making is open (SWARMY.making, the layer's new `modal`) and while the freeze stands in sight.
   - **A Continue again** (her door in the kit) dresses her again (`wear`).
2. **The freeze** (`app/dl-space-router.js`).
   - Your Swarmy stands where Nefertiti held the egg out.
   - The guide is seen again once the freeze has ridden off the screen (`data-space-router-away`). Until now, a guide under the freeze stayed hidden for
     the rest of the visit unless the × was pressed.
3. **The 2nd video, his governance film** (TOPICS `purpose`, on `#purpose`). The guide says only the page's own words for it:
   - the section's own name: "From Claudio to a galaxy of swarms.";
   - then "What happens in it?" and "And then?": the film's own description (its video's label), told in whole sentences, at most 300 characters a turn.
   - Never its closing invitation, "Carry the light. To the stars.", which the page hides until the film has played.
   - Nothing is put into the film.
4. **The bubble's "Got questions?" had been laid over its own words at every width** (`app/dl-athena.js` INTRO_CSS).
   - The cause: THE SKIP ASKS FIRST (Oct 29) named its full-screen question `.dl-athena-ask`, the same class as the bubble's button. Its rule
     (`position:fixed;inset:0;display:grid;place-items:center`) made the button fill the bubble, with its words in the middle of her line.
   - The fix: the rule now holds for its `div` alone. Every proof's `.dl-athena-ask [data-ask=...]` still finds the question.

## Cost

- **Bytes:** dl-athena.js +3,997 B; dl-athena.mjs +1,187; dl-athena-layer.mjs +875; dl-space-router.js +1,018.
- **No new request, timer or picture.** The guide's figure is the picture her making already cut for the kit.
- **What leaves the page.** After the hand-off, Athena's engine (143 KB fetched once) and its ticker (0.24 ms a picture while she was shown) are gone.
  The guide's frames are the compositor's own transform.
- **The modal watch** is a MutationObserver over the page's classes. It runs only on a cause, never at rest.

## Proved (the new Mac, nice 19)

- `node --test` on dl-athena, dl-athena-layer, dl-space-router.scene, dl-her-colours, dl-athena-film, dl-paywall, warm-entry and dl-twelve: 119 of 121.
  The two reds are main's own, failing the same before this lane: "THE DEPTH rides the engine and the corner…" and "the public mint keeps DysonLight Harmony
  ice and accent tokens".
- `node --test` on the other pages that mount the layer (room/her-follow, room/one-corner, life-menu nefertiti-bubble, glass-follow, ball-dive): 65 of 65.
- **The road in a real browser:** headless Chrome off every screen, muted, every other host refused, 390 × 844, the page served with byte ranges.
  - **The road taken:** skip the film, paint her at random, Enter the world, read the freeze, JOIN THE $WARM to the kit, then the governance film.
  - **At the freeze:** "Your Swarmy" stands at 210 × 210, her own picture (a blob).
  - **At the kit:** one guide layer, Nefertiti left, no `athena.png` on the page. The figure is the kit's own picture (129 × 129, smooth) and it is visible.
  - **At the film:** the bubble's topic is `purpose`, saying "From Claudio to a galaxy of swarms." with the kit's door, every part of it in flow.
  - **The film itself:** untouched, and no script errors.
- **Rule 8,** on the lane's page served by `tools/serve-range` (206):
  - `node --test app/dl-twelve.test.mjs`: green, within the run above.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS. The film was never below its second at the tap (6.05 s).
  - The same with `--tap sphere`: PASS (6.04 s).
- **The page's own proofs on the same page,** at nice 19:
  - `dl-athena-entrance.proof.mjs`: PASS, 172 checks at 1440 × 900, 491 × 866 and 390 × 844.
    - Its check "after Enter the freeze, and no picture of her holds the egg again" now also asks that the freeze's corner and the one guide left are the
      visitor's own Swarmy, the kit's picture.
    - It failed on the old law before that change, and passes on the new one.
  - `dl-path-to-the-kit.proof.mjs`: PASS at 1440 × 900 and 673 × 873.
  - `dl-athena-film.proof.mjs`: PASS. The governance film still comes with her being made, and never goes back on a tap.
  - `dl-warm-words.proof.mjs`: PASS. Every word of the page was read at 1440 × 900 and 390 × 844, and none of them is the old mint.
