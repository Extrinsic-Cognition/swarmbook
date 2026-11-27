# Referrals and the claim code: the loop as built (Oct 16 2026)

His words, Oct 16 2026 (the cloud seat, session_017am3Q9pDp6AkwRzdWTBGsH): "these things require referral codes and install links that are not
implemented today... do you understand how critical referrals are to our launch dude???"; Oct 15, in the box conversation: "we can link the 2 things
with codes (the browser page and the app ide)... they can pay directly on the main page". Before this, `?ref=` rode the box's link to the page and
died there (warm-entry.test: "referral visits start the existing checkout and story"); `room/society-referrals.mjs` was presentation only and said
so ("Referral codes aren't available yet"); no claim code existed; `app/nestos-release.json` is unpublished with no installer.

## The loop

1. **A friend's link.** `https://optimism.fit/?ref=<code>` (room/society-referrals.mjs's share URL; `/referral?code=` is the other form). The Worker
   runs first on `/`, `/referral` and `/claim` (wrangler `run_worker_first`) and 302s to the page with the query whole: whether the assets'
   `_redirects` kept a query was never proven, and now does not matter.
2. **The page keeps it.** `app/warm-entry.mjs` calls `captureReferral()` (app/dl-society-codes.mjs) on either way in: the code is kept in this
   browser 30 days, the latest arrival wins, a word that is no code keeps nothing. The checkout's fields say "Referred by <code> · Remove"
   (`app/dl-direct.js` referralLine).
3. **The order freezes it.** The checkout sends `referral` with `POST /api/premint/orders`; the Worker resolves it to the paid seat whose code it is
   and writes `premint_orders.referred_by` at the order's making, before any payment (box-mint-logic-20261015.md, 7: freeze attribution before
   issuance). Never issued, or the buyer's own: 400 with the reason, no order. Attribution never moves after that.
4. **The seat's card.** Under a paid receipt (`app/dl-seat-card.mjs`, mounted by dl-direct.js): the seat's referral code in fours, Copy link,
   the friends who paid ("Each counts when their Society seat is issued": `paid` never counts, by the card's own law), the claim code drawn in a
   press (large, with the QR of `https://optimism.fit/claim#<code>`; a new draw kills the old), and the installer's doors from
   `app/nestos-release.json`, or "Harmony's installer isn't published yet. Keep your code: it stays yours."
5. **The claim page.** `app/claim.html` + `app/dl-claim.mjs`: the QR's landing on a phone, the code large, Copy, the installer's doors. Nothing sent:
   the code lives in the fragment.
6. **Harmony's box.** `room/box-ticket-claim.mjs` in Your box (mac-onboarding.html, above the referral card): the code typed or its link pasted,
   `POST /api/society/ticket/claim` on this Mac's own door.
7. **The house binds the seat.** `tools/embertide-mesh/lib/society-ticket.mjs` (harmony-aiolos, behind localOnly): redeems the code once at the
   Worker with her wallet's address (lyssajudron-wallet holder()), keeps the seat's token in `~/.embertide/society/ticket.json` (0600; never in a
   browser, never on the Nest, never in a log), and projects `society/ticket` (society.ticket/1) and `society/referrals` (society.referrals/1) onto
   the Nest. The box's card fills from the second with no change of its own. `GET /api/society/ticket` reads the ticket again and rewrites the refs
   when they changed; the Worker out of reach, the last ticket kept is said as such.

## The Worker (worker/premint.mjs, migration 0003)

`premint_orders.referred_by`; `premint_tickets(order_id, code UNIQUE, made_at, claim_hash, claim_made_at, token_hash, holder, claimed_at)`. Doors:
`GET /api/premint/seat?buyer=` (x-seat), `POST /api/premint/tickets/:id/claim` (x-seat, same origin), `POST /api/premint/claims/redeem`
(`{claim, holder}`, no origin: the code is the authority, 60 bits), `GET /api/premint/ticket` (x-ticket). `availability` names the new column and
table: a database behind the migration answers 503 and takes no order. Apply: `npx wrangler d1 migrations apply optimism-fit-premint --remote
--config wrangler.optimism-fit.jsonc`, then `node tools/build-optimism-fit.mjs` and `npx wrangler deploy --config wrangler.optimism-fit.jsonc`.

## Tests (Node 22, all green on the GitHub copy)

```sh
cd embertide-app/ui/intro/dyson-society && node --test app/dl-society-codes.test.mjs app/warm-entry.test.mjs app/dl-direct.test.mjs app/dl-seat-card.test.mjs app/dl-claim.test.mjs app/dl-paywall.test.mjs worker/premint.test.mjs
cd ../../../.. && node --test tools/embertide-mesh/lib/society-ticket.test.mjs embertide-app/ui/intro/room/box-ticket-claim.test.mjs embertide-app/ui/intro/room/society-referrals.test.mjs tools/embertide-mesh/mac-onboarding-invitation.test.mjs
```

## What is his, not built here

- **The installer.** `app/nestos-release.json` is `unpublished` with no URL. The card and the claim page read it and say so; the day he publishes a
  release (schema nestos.release.v1, status published, https URLs per platform) the doors appear with no code change.
- **Confirmed referrals.** A referral counts when a Society seat is issued (his "Mint a Society seat"); the issuer is null (`harmony-aiolos.mjs`
  mounts `builder: null`). Until then the card lists the friends who paid and counts none. The Worker's `referrals.receipts` rows are `paid`; a
  `confirmed` row needs the on-chain receipt and comes from the issuer, not from here.
- **Rewards.** No cash or $WARM reward is authorized by the counting rule (box-mint-logic-20261015.md, 7); none is paid here.
- **Who gets a code.** A paid seat: the free way has no code. A user with two wallets can refer themselves across them; the Worker refuses only the
  same wallet. Since Oct 29 2026 every visitor has her code too (`A-FRIEND-GRANTS-A-WISH-LANDING.md`): 10 letters in the link to her (`#her=`), never in
  `?ref=`, and what a friend's birth earns is a wish on her bar, nothing of a seat's.
- **The box's class.** `society/ticket` carries the tier; her-box's finish still does not read it (box-mint-logic: the adapter before the first
  preload).
- **The Nest's ceiling** for `society/*` refs (lib/nest-ceiling.mjs) is unset: they are C0 by default. Both refs carry public addresses and the
  payment's signature, nothing of the room.
- **Rate limiting** on the redeem door: the code's 60 bits alone.

## The object of the invite is a game (his words, Oct 16 2026 07:3x UTC)

"remember... it IS ALL ABOUT DECOMP AND SHARE AND INVITE GAMES MY DUDE OMG", over the block lane's note (embertide-block/SPEC.md at a95cb0f5,
06:42 UTC): a new game is a new block named by three hashes (the genesis, the assets, the program); the real road is one instance of the game on
pelino, ghidrated, its reader emitting the player's pose, the camera and the entities as signed causes on the house count, every glass a mirror
painting its own perspective; the gate on all of it is which game is first.

What follows for this loop. None of it is built; each line is a lane with its number, after his word on the first game.

- **Share is a hash.** A game is content-addressed, so sharing a game is sharing its hash: `https://optimism.fit/play/<block hash>?ref=<code>`. The
  page names the game from its genesis and the friend who invited, offers Harmony's installer, and the claim code binds the seat as today. The
  join itself (the host's iroh ticket and the block hash) rides the fragment, as the claim code does: never the query, never a server log.
- **Decomp is the supply.** The per-game reader (the decompilation's addresses of the pose and the camera, the pad table) is published under
  the block's hash beside the genesis; whoever holds the disc and the reader can host, and a glass that joins fetches the block from any
  replica. The decomp is what makes a game shareable at all.
- **Invite is the loop built here, with the game as its object.** The referral code and its freezing on the order stay as they are; the
  `receipts` rows gain a state beside `paid` and `confirmed`: `joined`, a friend's Harmony mirroring the block's first confirmed tick from
  this seat's invite, carried by the host's causes, not by a browser. Whether a `joined` row counts, and what it earns ($WARM is the game's
  currency, uncapped, earned by contribution), is his ruling: today a referral counts when a friend mints a Society seat, and that stays
  until he says otherwise.
- **The number each must read:** a share link to the game named on the page, cold, in ms; an invite to the friend's first mirrored tick, in
  ticks of the house count; `joined` rows per seat per day against seats paid.

Gated by two words of his: the first game, and what an invite counts.
