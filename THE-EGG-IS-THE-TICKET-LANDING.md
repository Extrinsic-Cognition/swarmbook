# THE EGG IS THE TICKET (lane/the-egg-is-the-ticket, seat claude-eee8b377, sworn)

**Since Nov 22 2026** (`ONE-NAME-FOR-HER-LANDING.md`): X comes before the price, a checkout that stands is answered again, and a person's second payment is fuel.

## His words (Nov 19 2026 UTC)

- ~20:0x, over the deposit door's raw Solana address and its code on her flask's liquor: "how come you dont realize this ux is among the worst fucking UXs
  ever? like... can we please make the minting of the swarmy egg be the entrance ticket to the MMO? and i am saying this to say let's also sell access on
  stripe..."
- Then "Show me frames first" (four frames drawn on the live page: the Canvas's Claude page, "The egg is the ticket", widget e080a459), then "Yes, build it".
- Before them: Nov 11 "the CTA must become mint your SWARMY EGG... it gotta be about swarmy"; the 10 USDC is the starter pack (Nov 19 12:33); Oct 18 "bronze
  is a recurring thing and it's done with stripe subscriptions just like patreon"; Nov 19 18:59 X before the mint (X IS THE FLASK'S NAME).

## What was so (main 9c1299d590)

The mint page's deposit door opened on a code to scan, a "10 USDC · SOLANA" stamp and the flask's raw address, laid on the flask's liquor, whatever road
brought a person there (the door's press, Harmony's fill and grant links, warm.html?door=deposit). No card road reached the egg: the house's Stripe code
(worker/bronze.mjs) sold the Bronze subscription only, and its keys are not on the live Worker (the Bronze plan answers card: false).

## What is so

- **Her egg is the press** (app/dl-kit-deposit.js egg, app/dl-paywall.css). The door opens on her: her egg wears a gold ring in her own layer and presses as
  the stamp does; beside her, at her egg's height, "First, your X / Connect X" (X IS THE FLASK'S NAME's row), "MINT YOUR SWARMY EGG · $10" and "card, Apple
  Pay or a Solana wallet · with your X". Nothing stands on the liquor. The press opens the roads: "Card · Apple Pay ›" where the card road stands, and
  "Solana wallet ›", which is the address and its code as before (form, unchanged). Where no card road stands, the press goes straight to the address.
- **The card road** (worker/space-router-card.mjs, `/space-router/v1/card`): GET says whether it stands (Stripe's keys on the Worker); POST, signed by the
  flask's key (x-seat), opens a Stripe Checkout Session of one $10 egg and comes back to the door with ?card={CHECKOUT_SESSION_ID}; GET ?session says whether
  Stripe's word has filled the tank. Stripe's checkout.session.completed reaches the platform's one webhook (bronze.mjs, no second endpoint or secret) and
  pours the egg as a deposit is (eggPaid): the tank its X account holds, else the flask's own; the deposit's row (mint `card`, counted in the State of
  $WARM), the refill (why `card:<session>`), the drop the flask pours; once per session; a failed batch throws so Stripe asks again. Its id is base58 of
  SHA-512("stripe:" + session), shaped as a signature, so every door that reads a deposit reads it (the drops, her portrait's pass, the count).
- **The return** (cardBack): the door is asked until paid (the webhook is a moment behind the payer), then the page's own pour and fill, and her making;
  one fill (`filled`) now ends both roads.
- The card's fee is the house's: the tank takes the egg's $10 (his to change).

## Cost

A checkout is one Stripe call; a payment one D1 batch of four rows; the return asks at most 30 times, 2 s apart, only after a payment. Nothing at rest:
the ring is two bounded asks for her sprite (600 ms, 2 s). JavaScript: +188 / -13, net +175 (the card door 65 and its test 81; the page 20; the router and
the webhook 2): his pass, "Yes, pass +175" (Nov 20 2026 05:08 UTC), the exception the-egg-is-the-ticket-exception-2026-11-20.json.

## The proofs

- `worker/space-router-card.test.mjs` 4 of 4 (made-up flasks, Stripe and its webhook stood in, every migration): the road stands only with the keys; one
  egg's checkout signed by its flask, back to the door with the visit's query; a word Stripe did not sign pours nothing, an unpaid or other session nothing,
  the egg once into the tank (the X account's when one holds the flask); its id is a deposit's on the drops, at the deposit door (409, counted).
- Green on the merged tree (main 0b46e4cbf3): `dl-kit-deposit` 10 (two old pins written to the new code: the asked door opens her egg; the one fill), `space-router-deposit`
  13, `space-router-grant` 3, `space-router-x` 3, `premint` 27, `bronze` 6, `creators` 8, `after-the-mint` 8, `swarmbook-floor` 11; `dl-paywall` 35 of 36:
  its one red is main's own (the mint's accent #37b6d8 against Harmony's orange #0d4769, the same on main 9c1299d590).
- Rule 8: `node --test app/dl-twelve.test.mjs` 21 of 21; `dl-twelve.proof.mjs --tap button` and `--tap sphere` on the lane's tree served by
  tools/serve-range: both PASS (the song within 0.15 s of the picture, both media seekable past the tap, the picture never went back).
- The real page walked (optimism.fit's warm.html in a headless Chrome off every screen; the lane's dl-kit-deposit.js, .mjs and dl-paywall.css swapped in
  by CDP Fetch; the card door, the drops' POST and the portrait stood in; nothing written to the site), at 1512x945: her egg's call beside her (563 to
  1114 px across, her sprite from 1123; the ring on her egg at 1171,762, 147x159), no address on the liquor; the press: "Card · Apple Pay ›" and "Solana
  wallet ›" on the stamp's plate; Card: one checkout ask signed by the flask (x-seat) naming the door to come back to, then Stripe's address; Solana wallet:
  the address box on the liquor as before, its code drawn; back with ?card=: the door asked twice (paid at the second), the pour, the fill, her making
  (GENIE OF THREE WISHES, LYSSAJUDRON); the card road shut: the press goes straight to the address. No page error in any walk. Before the door was placed
  (the first walk) the call stood on the liquor's centre and the stamp had lost its plate; both mended in this lane.
- The four design frames he said yes to, on the Canvas (widget e080a459).

## What it does not do

- The card road stays shut until his Stripe keys are on the Worker (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET) and Stripe's webhook names
  `https://optimism.fit/api/premint/bronze/stripe` with checkout.session.completed: his account, one press after it.
- A Solana wallet in the browser is not asked to sign: the wallet road is the address and its code (Solana Pay's transfer form for a phone), as before.
- It is live only at the site's next publish (a press of its own after it lands).
- Not seen with a real card or on a phone.
