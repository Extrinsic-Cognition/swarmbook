# X IS THE FLASK'S NAME (lane/x-is-the-flasks-name, Nov 19 2026, claude-1cd371e0)

## His words (UTC)

- Nov 19 18:59:17, after the grant link landed (main a7d2aa6277): "hold on... is this not retarded? shouldn't we have people first link their twitters and
  then do the mint so then when they use twitter on the harmony app they see balance? am i missing something? u get what i mean or not?"
- Nov 19 19:01:37: "Yes, build it", to "Build the X road for the balance (X on the mint page, Harmony's X sign-in opens the flask)?".
- Before it: Nov 19 ~14:1x "people mint their lyssajudron online the social swarmy thing with pfp linked to their twitter; in the app, they connect their
  twitter" (`tools/embertide-mesh/X-CARRIES-HER-IN-LANDING.md`); the audit's "his X account is his name" (ec-workspace
  `docs/the-flasks-money-on-solana-what-he-wanted-hypertrace-2026-11-19.md`).

## What was so (main 82ab637427)

- Harmony's "Connect with X" signed in with X for real (`x-door.mjs`), but only to find the person's Swarmy. It never looked at money.
- On the mint page the X handle was typed after the deposit, and nothing proved it.
- The grant that landed an hour before (`A-FLASK-LETS-ITS-HARMONY-SPEND-LANDING.md`) let Harmony spend a flask only through a link opened in the browser that
  made the flask. A person who paid on their phone and runs Harmony on their Mac could not use it.

## What is so

- **The mint page signs in with X before paying** (`app/dl-flask-x.mjs`, called from `app/dl-kit-deposit.js`). The deposit box shows "First, your X" and
  "Connect X" above the address, in the box's own stamp and chip (no style added). The press goes to X's own consent page for the house's X app (PKCE; the
  verifier stays in the tab). X answers to `/space-router/v1/x/back`, which sends the person back to the deposit door with X's code in the address's
  fragment, so no log keeps it. The flask's key then signs that the X account of this one sign-in holds it: the grant law's X text
  (`app/space-router-grant.mjs`), naming the sha256 of the sign-in's verifier. After that the chip shows the handle, and the page's profile claim uses the
  handle X gave instead of a typed one. Paying without X still works, and X can be connected later from the same browser; the credits follow.
- **The Worker trades the code itself** (`worker/space-router-x.mjs`, `POST /space-router/v1/x`), so it knows the X account from X, never from the page. It
  writes that this X account holds the flask (`sr_x`, migration `0025_x_holds_the_flask.sql`). The X account's tank is the tank of the first flask it held,
  and a second browser's flask fills the same credits (`tankOfFlask` in `worker/space-router-link.mjs`, read by the deposit door and the grant door).
- **Harmony's "Connect with X" gets the balance** (`x-door.mjs`, `harmony-aiolos.mjs`). The X door hands the code to the site instead of the old exchange
  worker, with this Mac's own key named by its sha256 (the key it already had, made once). The site lets that key spend the flask this X account holds:
  $5 a UTC day for 90 days (`X_CAP`, `X_DAYS` in `app/space-router-x.mjs`, mine, his to change), checked by the spend code the grant lane landed. The X door
  writes the X profile on the Nest as before, and the tab X lands in says "Your flask holds $10.00; Harmony may spend $5 a day of it". The Tracenet tab's
  balance (`/api/tracenet` `fuel_usd`) reads it through the same key. If Harmony connects X before the person has minted, its key waits (`sr_x_waits`) and
  becomes a grant when the mint page's X sign-in holds the first flask: no second sign-in needed.
- A site whose Worker is not deployed, or whose database is behind 0025, answers 404 before any code is traded, and the X door takes its old road (the
  profile alone).

## What it costs (counted, not measured on the live Worker)

A mint page's X sign-in: two https calls from the Worker to X, three or four D1 reads and one batch. Harmony's: two calls to X, two to four reads and one
write. A deposit: one D1 read more (`sr_x` by address). Nothing runs at rest. No X token is kept: it is used once for `/users/me`. JavaScript: +315 -32, net
+283 in 14 files (133 of them the test and the proof): the page's sign-in and the Worker's route are JavaScript where they stand; the Worker loads no WASM.

## The proofs

- `node --test embertide-app/ui/intro/dyson-society/worker/space-router-x.test.mjs`: 3 of 3 (the X text; X first, then the mint, Harmony spends within the
  cap, a second browser fills the same credits; the refusals and a database behind 0025).
- `node --test tools/embertide-mesh/x-door.test.mjs`: 12 of 12 (one new: the site's road, the key never sent, the tab's balance, the old road behind a 404).
- The Worker's neighbours, the deposit page, the Tracenet door and tab, rule 8's test: 139 of 139 together.
- `nice -n 19 node embertide-app/ui/intro/dyson-society/tools/flask-grant.proof.mjs`: 8 of 8. The real `warm.html` in a headless Chrome off every screen, the
  Worker's own handler on a scratch D1 behind it, X a stand-in that answers as X's two doors do (PKCE checked). The five checks of the grant link still pass,
  and three new ones: a browser with no flask sees "First, your X" and "Connect X" in sight, on top, above the address; one trusted press goes to X's consent
  page with the site's own address back, and the flask is held by `@anna_x` (the chip says it, the fragment is gone, `sr_x` has it); with its 10 USDC
  counted, Harmony's own X door (its real code, a fresh key) signs in as the same person, says $10.00, and that key's chat call is paid from the flask
  (10 -> 9.475, `/tank` says its grant).
- Rule 8 (the lane touches the mint page's folder; the film and the song untouched): `node --test app/dl-twelve.test.mjs` passes; `nice -n 19 node
  app/dl-twelve.proof.mjs --url http://127.0.0.1:8988/app/warm.html --tap button` and `--tap sphere`, served by `tools/serve-range` (206): both PASS, the
  sound came in where the picture was and the picture never went back.
- The laws: any-room 13 of 13, no-page-of-its-own 3 of 3, the-look-is-a-law 2 of 2; the-javascript-only-shrinks red at +283 until his pass.

## Not done, said

- **His hand in X's developer portal:** the house's X app must list `https://optimism.fit/space-router/v1/x/back` (and swarmbook.com's) as callbacks.
  Until then X refuses the mint page's sign-in. Harmony's side needs nothing new there (its callback is already listed).
- **His press:** the Worker's deploy with migrations 0024 and 0025.
- Not seen: a real X sign-in, on the live site or in the real Harmony window; a phone.
- The Swarmy on the site's wall is still found by the typed handle (`x-door.mjs` `bring()`); the handle X proved could replace it. Its own lane. (Done Nov 22 2026: `ONE-NAME-FOR-HER-LANDING.md`.)
- The grant link stays, for a person without X.
