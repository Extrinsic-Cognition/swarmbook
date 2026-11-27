# NO SKIP THE FIRST TIME

His words, Nov 20 2026 UTC, over a screenshot of her pitch with "SKIP TO THE TRAIL?" drawn under its diagrams: "still full of bugs like here it shouldnt be skippable or if yes, there's issues, theres parts of the system that are coded but not reachable etc..". Asked whether her pitch should be skippable, he answered "No skip first time".

## What a person met

- **The question was drawn under her diagrams.** While her pitch drew its explainer, the question opened by her Skip ("Skip to $WARM ›") came out under the explainer's layer.
  - The explainer (`#dl-explain`, dl-paywall.css) stands at z-index 2147483600. The question (`div.dl-athena-ask`, dl-athena.js) stood at `LAYER_Z + 1` = 2147483001.
  - So the explainer's dark gradient dimmed the box and made its Stay and Skip look disabled, and "The swarm" and SOL → FUEL were drawn over its title.
  - Read on the live page (swarmbook.com, main 535266d69a): the same picture as his screenshot.
- **Skipping cut off her pitch.** A press on her Skip, answered Skip, ended her entrance before her pitch had said what the egg is for. That is the part of the page built for every person and never reached by one who skips.

## The change (app/dl-athena.js, net 0 lines)

- **First visit.** Her Skip never shows on a first visit. The page already knows a first visit: `html[data-on-track]` (ON TRACK, dl-space-router.js) stands until the second film has been seen (`dl.egg.minted`), and the page already holds the scroll for it. So her pitch plays through, and no new storage is added.
- **Every visit after it.** Her Skip shows as before, and still asks first.
- **The question on top.** The question now stands over every layer of the page (z-index 2147483647), the explainer's included.
- **The film's own skip ("Skip to $WARM ›" on the film) is unchanged.** It passes the film alone and brings her entrance (THE SKIP KEEPS HER, Oct 29), so it never cut her pitch.

## The numbers

- `node --test app/dl-athena.test.mjs app/dl-twelve.test.mjs`: 44 of 45 pass.
  - The two new asserts: her Skip is hidden under ON TRACK, and the question stands above the explainer's z-index as read from dl-paywall.css.
  - The one red, "THE DEPTH rides the engine and the corner" (line 415, the Mac painter's cursor line), is red on main as it stands, before and after this lane.
- Rule 8, on the lane's page served by tools/serve-range (127.0.0.1:18998): `dl-twelve.proof.mjs --tap button` PASS and `--tap sphere` PASS. In both, the sound came in where the picture was, and the picture never went back.
- The walk of both visits, on the same served page in a headless Chrome off every screen (each visit: the film's skip, asked and answered Skip, then 3 s into her pitch):
  - **First visit** (no `dl.egg.minted`): ON TRACK stands, her pitch is running (lines 0 and 1 said, the explainer drawn), and her Skip is hidden. No page error.
  - **A visit after it** (`dl.egg.minted` = 1): her Skip shows, and a press opens the question at z-index 2147483647, over the explainer's 2147483600. The box is clear and its Stay and Skip are bright. Stay closes it and her pitch goes on. No page error.

## What is not done

- The words: her Skip and the film's pill say "Skip to $WARM ›", while the question asks "Skip to the trail?". His Oct 30 words name the landing both ways (CLEAR THE MINT at 03:21, THE FIRST TRACENET at ~22:4x). This lane leaves them as they are, for his word.
- The deploy (his press).
