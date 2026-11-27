# SPACE ROUTER AT THE FREEZE: $1 SPENT, 1 $WARM, REBATE (Oct 29 2026, lane/the-freeze-introduces-space-router, claude-1a67b2d3)

His words, UTC, over optimism.fit's mint page in the app's preview, the choice at the freeze on his screenshot (BRONZE $10 with B Bold., GOLD $1,000 with
SSS SSSovereign!!!, JOIN THE $WARM, her holding the golden egg out):

- 09:10: "i need you to completely restructure this... no longer being about bronze or gold, but rather, YOU MUST INTRODUCE SPACE ROUTER AND HOW IT HAS A:
  1 $ SPENT = 1$WARM u get what i mean? it is rebate".
- 09:11: "hypertrace rich lineage including claw riders and project snowtrace... space router is how we make money".

The lineage, his words dated from Sept 7 ("it's like cashback on ai credits") to today: `plans/space-router-is-how-we-make-money-hypertrace-2026-10-29.md`.

## What stood

- `app/dl-gold-bid.js` (THE CHOICE AT THE FREEZE, Oct 28) slammed two seats in round the flask when she landed:
  - BRONZE $10 on copper and GOLD $1,000 on her red and gold, each with the style meter's rank;
  - each name opened the page's checkout for its seat.
- Under them: Bronze by card (Stripe) where its plan was set up, the Gold month's sealed bid on `?gold=`, and a subscriber's return on
  `?bronze=welcome`.
- At each open the scene made two reads (the Gold month's pot and the Bronze plan): 30,641 B, 314 lines.
- The offer below (`#dl-paywall-choice`) opened on "Ask, and Swarmy provides." Its $WARM line said "Given only as your Swarmy burns his fuel in the
  Space-Router" with no rate, though the Space-Router's own rate stood in `tools/embertide-mesh/lib/space-tanks.mjs`: `WARM_PER_USD = 1` (his Oct 27
  22:48 "can we do 1$ = 1$WARM?").

## What changes

- **The scene is the rebate.** `app/dl-space-router.js` replaces `app/dl-gold-bid.js` (a `git mv`, then rewritten) in the same grammar: the white, the
  focus lines, two slashes with the flask between them.
  - **SPACE ROUTER**, stamped **$1 SPENT**, on a blue slash.
  - Then **1 $WARM**, stamped **REBATE**, on her red and gold, with ドン.
  - Wide screens put the dollar and the rebate on either side of the tank they burn in; tall screens stack them above it, the rebate nearer and louder.
  - Each name is a button that scrolls down to the offer. His JOIN THE $WARM and its chevrons stay under the flask, and the scene still rides away with
    the hero.
  - The `1` in **1 $WARM** is the scene's `WARM_PER_USD`. Its test holds it equal to the Space-Router's.
- **What left the scene:** BRONZE and GOLD, the ranks that named them, Bronze by card, the Gold month's road and the subscriber's return. The scene
  reads nothing and keeps no timer: 18,102 B, 177 lines.
- **The offer opens on the Space Router.** The heading is "Space Router." and the line under it is "Every $1 spent in it gives you 1 $WARM back: a
  rebate. Your ticket is your Swarmy's fuel there, the AI credits he spends for you. Every ticket also builds Project Snowtrace."
  - $WARM's line is "1 for every $1 your Swarmy spends in the Space Router: a rebate, never with a ticket. Uncapped."
  - These are also her line and her answer to "What is $WARM?" (`dl-athena.js` reads them as the page's own words).
- **The road to it:**
  - `warm-entry.mjs` imports `dl-space-router.js?v=router-1`, and `warm.html` asks for `warm-entry.mjs?v=society-mint-9`;
  - `warm-entry.test.mjs` and `worker/ranges.test.mjs` name the new paths;
  - the comments naming the old file are rewritten (`dl-her-colours.js`, `dl-twelve.js`, `dl-direct.js`, `tracenet-bronze.mjs`, `creator.html`).

## What does not change

- **The seats and their money.** The checkout still sells the protocol's two seats (`dl-direct-protocol.mjs` TIERS: Bronze Mint $10, Golden Aiolos
  $1,000), and the offer's two cards still name them. Hanging on those names:
  - the receipts' rows ("Golden Aiolos · paid");
  - the tracenet's law (a Gold Mint receipt opens a drop at once, a Bronze Mint one on day 15);
  - the tank's share and the cards' months.

  Folding them into Space Router fuel changes the money and the law, so it waits for his word.
- **The Worker's doors.** The Gold month (`app/dl-gold-bid.mjs`, `worker/gold.mjs`, `tools/gold-close.mjs`) and Bronze by card (`tracenet-bronze.mjs`,
  `worker/bronze.mjs`, shared with the tracenet page) stay as they are; only the mint page stops opening them.
- **Nothing is deployed.** The mint stays paused (`PREMINT_ENABLED` false since Oct 28). optimism.fit changes only by his deploy.

## Measured

- `node --test app/dl-space-router.scene.test.mjs`: 3 of 3.
  - **The rate:** the scene's rate is the Space-Router's (`warmOwed(1)` = 1).
  - **The slams:** no seat, no price and no rank.
  - **The scene on a bare document, step by step:**
    - nothing before she lands;
    - in sight only SPACE ROUTER, $1 SPENT, 1 $WARM, REBATE, ドン, JOIN THE $WARM and ×;
    - each name presses down to the offer;
    - the wide and tall frames, the ride, the close;
    - her making holds it, and `?handoff` leaves it alone;
    - a stand-in `fetch` that throws is never called.
- **The suites the lane touches,** 15 files (the scene, the entry, her colours, her layer, the twelve, the checkout, the tracenet, the Gold law, the flask,
  the wallets, and the Worker's Bronze, Gold and ranges): 112 of 113.
  - The one red is main's own: `app/dl-athena.test.mjs` "THE DEPTH rides the engine and the corner". It is red the same way on the shared checkout at
    25ce3b49e, and was named among main's reds by THE CHOICE AT THE FREEZE.
- `node --test tools/any-room/any-room.test.mjs`: 8 of 8.
- **Rule 8, the sound never restarts the picture.** The lander's gate refused the first hand at 09:38:45 UTC because its proof was missing. Run since,
  on this lane's page served with byte ranges (`tools/serve-range`):
  - `node --test app/dl-twelve.test.mjs`: 20 of 20.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS.
  - The same with `--tap sphere`: PASS.
  - Both said "the sound came in where the picture was, and the picture never went back".
  - The lane is handed again with both proofs.
- **Judged in headless Chrome, off every screen.** The setup:
  - the lane's tree, served with byte ranges (`tools/serve-range` on 9061, `mint-dev.mjs` on 9062);
  - the page at each size, then "made" said on her event, as her making says it;
  - every write refused, and nothing leaving the Mac (the page's Solana reads refused).

  At 1440x900, 673x873 (his preview pane) and 390x844:
  - every name and stamp is in view and clear of the sphere (by 48 px or more at 1440, 109 px at 673, 118 px on the phone);
  - no name covers another or her;
  - the call to arms stays under the flask;
  - no page error.
- **Sizes in px:**

  | Screen | SPACE ROUTER | 1 $WARM |
  | --- | --- | --- |
  | 1440x900 | 54 | 86 |
  | 673x873 | 70 | 110 |
  | 390x844 | 40 | 63 |

  The names' widths were measured in that render (SPACE ROUTER 8.85 em, 1 $WARM 5.39 em, the skew and the stroke included). A first pass sized them
  from a canvas measure (7.73, 4.53), and 1 $WARM ran past the screen's edge at all three sizes.

## Cost

- **At rest, nothing.** The scene mounts one style and waits on her event. It reads nothing and keeps no timer. It moves on her landing, a resize and the
  scroll. The chevrons' CSS loop runs only while the scene is open, as before.
- **Smaller.** Two reads fewer at each open and 12.5 KB less script. The Gold month's sealed box (tweetnacl, loaded at a bid) has no road from the mint page now.

## Edges, said

- The receipts in `app/` ship with the site: `tools/build-optimism-fit.mjs` copies `app/` whole and skips only a file named exactly `LANDING.md`, so the
  15 `app/*-LANDING.md` receipts (his words among them) go out on optimism.fit at a deploy. This receipt stands outside `app/` for that reason; the build's
  rule is not this lane's to change.
- A page held in a browser from before this lane asks for `warm-entry.mjs?v=society-mint-8` until reloaded, which is the old scene.
- The offer's cards still read Bronze Mint and Gold Mint. That is the one question for him.
