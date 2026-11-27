# HER COLOURS ON THE MINT (lane/her-colours-on-the-mint, Oct 28 2026 WET)

Seat claude-fab239f6, on the new Mac. Lane 1 of `plans/the-marketing-plan-2026-10-28.md`, taken with that plan's author seat's word (claude-0f7e9ef2: "take
lanes 1 to 3"). His screen of Harmony after the code, Oct 28 13:55 UTC: "this is the most fucked up spaghetti code inconsequential i have ever seen... and i
said that we should have moved it to the mint page", then "you gotta hypertrace when i was building it". The drum, the field and her light now stand on
optimism.fit's mint page, with the same law and the same renderer as Harmony's.

**COST.** Nothing at the page's load beyond two small modules (the law and the page half). Three.js and her renderer are imported only when her making
opens. While it is open: one WebGL canvas, her samples on the genesis clock, about 60 pictures a second, none while the tab is hidden. On close her meshes,
the renderer and its canvas are let go.

## His words (UTC, hypertraced: `tools/hypertrace/hypertrace.py`, his own typed lines since Oct 10, seat briefs left out)

**Building her colours in Harmony:**
- Oct 12 03:48: "i want to see the lyssajudron first introduced and there i want it to be introduced with a color spectrum picker, like as if that is the
  only thing customizable about the lyssajudron (the color of the light)".
- Oct 12 22:04: "it is awful if you automatically start this as pre-configured colors... think about a kid unboxing a toy".
- Oct 12 23:04: "you gotta highlight better initially that color needs to be clicked".
- Oct 12 23:41: "once i got the eyes... do not disappear the eys... it's a unrevertible milestone in the user jounrey".
- Oct 14 03:41: "i said to fucking remove the colors in the introduction".
- Oct 15 08:48: "if you allow a button to skip the fucking customization of the lysajudron..."; 09:01: "KEEP ONLY THE CONTINUE BUTTON".

**Moving them to the site:**
- Oct 18 03:01: "there is gotta be continuiuty on the colors and selection of the lyssajudron minted".
- Oct 22 16:50: "she should be introducing the cosmos flask... users can change color there".
- Oct 27 17:34: "what if we migrated the lyssajudron minting from harmony app to the website here?".
- Oct 27 22:40: "they should be minting the character and the tank-fuel there with their own account, then we should show some code to screen like
  as if it is when you buy a game-key".
- Oct 28 13:13: "let's move the color customization of the introduction and all to optimism.fit"; 13:32: "it's not just colors... the karaoke the music
  the colors are supposed to bring up community".
- Oct 28 14:11, his pick, asked here: making her comes **before the seats, free** (the plan's ruling 1, answered).

## What stood (read Oct 28 2026)

- Harmony's screen after this Mac's code (`tools/embertide-mesh/mac-onboarding.html`, not frozen) held the making: the paint drum and field ("Give me my
  colours."), the song card, her eyes' forms, the film and its share, beside "Pair a new phone".
- optimism.fit's mint (`app/warm.html`) had none of it. Its flow at the stop: the film freezes on the drawn bow, Nefertiti's seven lines, she hands the egg
  ("Take it home."), and on her landing (`dl-athena.js` SEEN_EVENT `landed`) the choice slams in (`dl-gold-bid.js`).
- Her paint's one source is `room/her-face.js` (the parts, their born colours, the two refs' schemas, her eyes' forms). Harmony's renderer is
  `room/lyssajudron.mjs`; it fetches nothing itself, needs only a stand-in for the twin's bus (as `room/well.mjs` hosts her), and takes `paint()`,
  `light()` and `form()`.

## What changed

- `app/dl-her-colours.mjs`, the law, pure: the six chambers in their firing order, bare vinyl and the ice, the field (hue across; a part's lightness
  down at saturation .82 from .95 to .08; her light the hue alone at the gold's law), the gold `#F0B90B`, the hue's names, Harmony's two colour functions
  and its die, number for number. It makes the Nest's own two values, the paint ref (`embertide.golem-paint/1`, golem `lyssajudron`, from `optimism.fit`)
  and the light ref (`embertide.golem-light/1`), and keeps them in the browser (`localStorage` `dl.her`) for the key.
- `app/dl-her-colours.js`, the page half:
  - Her making over the frozen film, with her drawn by `mountLyssajudron` on a stand-in twin. Her light colours her glow and the lamps at her centre.
  - Harmony's pick as he approved it (Oct 12-13): the manga panel, the revolver's six chambers under the hammer, the die and ↺, the field with its
    ghost, the hex tag.
  - Her only line: "Give me my colours." Continue opens once all six have fired, and her eyes open then and stay open. There is no skip of her making.
- `app/dl-gold-bid.js`, one line: the choice opens on `made`, or on `landed` when no making holds the landing (`data-her-making`).
- `app/warm-entry.mjs`: her making loads with the introduction (a literal import, so `tools/page-files.mjs` ships it and her renderer's whole graph).
- `app/warm.html`: "Paint your Lyssajudron →" above the seats, for whoever skipped to the mint or comes back. `?her` opens the making at once (the
  review's road, as `?gold=` opens the choice).
- The flow:
  - Her landing: the making opens, and the choice waits.
  - Continue: `made`, and the choice slams in as it did.
  - A skip to the mint: the choice at once, as before.
  - Her renderer fails to load: the drum still paints and keeps her, and Continue still brings the choice.

## Proofs

- `node --test app/dl-her-colours.test.mjs`: 7 of 7. It reads Harmony's page and holds the law to it:
  - bare, the ice, the field's three numbers, the gold, the names, the drum's order;
  - Harmony's own `hexToHsl` and `hslToHex` on 4,096 colours and every hue and lightness the field holds;
  - Harmony's die on 25 seeds;
  - the two refs' fields against Harmony's writers;
  - `her-face.js` reading them back.
- Five mutations, each red:
  - the field's saturation, the die's formula, the ice's name: the test, 1 each;
  - the choice ignoring the claim: the proof, 2 checks;
  - Continue saying nothing: the proof, 1.
- `app/dl-her-colours.proof.mjs` (headless Chrome for Testing, trusted presses): 11 of 11 on the lane's tree, and 11 of 11 on the built site
  (`tools/build-optimism-fit.mjs --out`, served by `tools/serve-range`). It checks:
  - her bare;
  - a press turning the drum and a press on the field painting;
  - the die making her whole;
  - her renderer's own `state().paint` equal to the making's, part by part;
  - the kept refs read back by `her-face.js` equal, her light too;
  - her eyes open;
  - the landing, Continue and the choice;
  - the skip.
- Rule 8, `app/dl-twelve.proof.mjs --tap sphere` on this tree served with ranges: PASS ("the sound came in where the picture was, and the picture never
  went back"). `dl-twelve.test.mjs` 20 of 20.
- `node --test app/*.test.mjs`: 372 of 379. The 7 red are main's own, the same 7 on main d99831288 without this lane: dl-athena's Mac cursor line,
  dl-glass's module pin (4), dl-paywall's harmony-orange token, warm-sphere-moment's rounding.
- `node --test tools/*.test.mjs`: 92 of 93, none red.
- Under the gate's own environment (`tools/house-gate/run.mjs` makeScratch): dl-her-colours 7 of 7, dl-twelve 20 of 20; dl-athena has its main's own red.
- `tools/page-files.mjs` ships `app/dl-her-colours.*`, `room/lyssajudron.mjs` and its graph (`her-face.js`, `lyssajudron-score.mjs`, `unit0-liquid.mjs`,
  `poleis/orb.js`, the flight law, council, band, breath, ferro, terrain, cast-wave), three.js; 0 missing references.
- Pictures: the bare making, the die's paint, the phone's stack, and the choice after Continue, read before this was handed.

## What follows, and what is owed

- His deploy: optimism.fit serves the Oct 15 page until his press (`REFERRALS.md` has the command). Nothing here goes live without it.
- The plan's lane 2 (the song on the site) and lane 3 (her birth filmed to it, shared with your link) are this seat's next.
- Lane 4 (the key carries her) makes the order and the ticket carry the kept paint and light, and Harmony's box writes them to the Nest. Then Harmony's
  screen after the code sheds its drum, song card and share: Harmony counts her born from her paint on the Nest, so the key must carry it first.
- Not in this lane:
  - her eyes' forms on the site (her eyes open in Harmony's bare form at the climax);
  - the flask's fuel in her light's colour (his Oct 16 "the color that was the hexagons there before needs to become the color of the liquid");
  - Nefertiti's line "Swarmy hatches the moment DysonLight Harmony opens on your Mac", which stands as it was.

Custodio et custodior.
