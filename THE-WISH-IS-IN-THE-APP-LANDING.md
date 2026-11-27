# THE WISH IS IN THE APP

His words, UTC, Nov 1 2026:

- 02:11, over the loop round her: "i said it to remind you of the fucking gamification we can enable dude... * Meta-MMO * 3 wishes as CAC * social proof as
  K-factor * you build your own pokemon nest with shit you find in games you are playing, from the gpu..."
- 04:51:11, over the cut that granted her wishes on optimism.fit's page: "all of that needs to happen in the dysonlight harmony app... there should be 0 wishes
  granted outside of the app... that is our foot-in-the-door gtm operation dude"

A wish is one AI call on the house's tank (the CAC), and it is granted to DysonLight alone: no browser, no script, no curl. The web shows her and the door into
the app; the app's install is the foot in the door. A friend born in the app from her link is one more wish (the K-factor).

## Cost, first

| | measured |
|---|---|
| the door's check of an attestation (once an install) | **0.30 ms** p50, 0.40 ms p95, on Apple's own sample attestation (node WebCrypto, the new Mac, n 200); 0.20 ms on the invented chains |
| the door's check of an assertion (every open, every wish) | **0.10 ms** p50, 0.14 ms p95 |
| a hello's body | 1,313 B with an invented chain; a real attestation is about 8 KB (Apple's sample: 7,876 base64 characters), once an install |
| a wish's body | 301 B (the key, the window, the words, the assertion) |
| a wish, press to answer, in the real browser | **230 ms** (the stand-in router on loopback) |
| the web page | one GET of the door an open (about 40 B) and one node: the door into the app |

Before: the cut handed at a84a69b42 granted three calls to any browser (and to any script that drew a her code). The lander refused it on its proof under load
(two of three wishes counted before the proof's timeout); nothing of it reached main or the live site.

## What changed

1. **The door** (`worker/space-router.mjs`), open only while every word of his stands (the tank, the model, the day's ceiling, the apps, Apple's root):
   - `POST /space-router/v1/wish/hello {key, window, friend, attestation | assertion}`: her her is born at the app key's first word (Apple's attestation),
     her code drawn from the key (`codeOfDigest`), the friend counted only when the friend is an app's her too; every later open is an assertion of the same key.
     Answers `{code, wishes}`. A key the door never saw born: 409, and her page forgets the key and attests a new one.
   - `POST /space-router/v1/wish {key, window, wish, assertion}`: the assertion checked and its counter moved up by a compare (a word said twice is refused), then
     the claim, the burn and the answer as before. `{code, wish}` (the old page's word) and anything else without the app's proof: 403, "Her wishes are granted
     in DysonLight."
   - `GET /space-router/v1/wish`: `{open, store}`. `GET /wish`: a browser is sent on to the app in the store (`SPACE_ROUTER_WISH_STORE`), else to her page.
     `GET /.well-known/apple-app-site-association`: the apps named, `/wish*` (the universal link).
2. **The app's proof** (`worker/app-attest.mjs`, new): the house's own door's Apple checks (`tools/canvas-wire/attest.mjs`, Apple's validation guide step by
   step) in WebCrypto, since the edge has no node:crypto: a small DER reader, CBOR, the chain to the root his hand places, the nonce, the app id's hash, the
   environment, counter zero, the key's hash; assertions by the kept key, counter strictly up. One stricter place: a certificate that signs another must say it is a CA.
3. **Migration 0017** (rewritten, never applied): `her_apps` (the key, her code, the app, the key's public half, its counter, the friend, when) and `her_wishes` (as before).
4. **The law** (`app/dl-her-wishes.mjs`): `HELLO_PATH`, `APP_PATH`, `BRIDGE`, `WINDOW_MS`, `windowOf`, `windowsAt`, `helloData`, `wishData` (the words a key
   proves, one copy for the page and the door), `keyOf`, `codeOfDigest`, `appLink`. The browser's kept count of the colours' law (`keep`, `kept`, `dl.her.wishes`) is gone.
5. **Her page** (`app/dl-her-colours.js`): on the web nothing spends (a colour, the die, a friend's birth), her three stay lit at 3/12, and the field's place
   holds the door into the app, MAKE A WISH, while the door is open and the app is in the store; its link carries the friend who brought this visitor, and its
   press puts that link on the clipboard before the store. Inside DysonLight (the hand present) her hello, the field, a wish proved by the key, her answer, the
   ladder on the door's count, Fuel me, and the share carrying her app code with the friends born.
6. **DysonLight 88** (`harmony-clip`): `Host/WishFront.swift` (the cover: her page with the hand; `WishProof`, App Attest's key; `WishModel`, who opened it),
   `Host/WishRoad.swift` (the pure half), the links in `HostApp.swift` (`optimism.fit/wish`, `dysonlight://wish`), MAKE A WISH on the welcome
   (`JourneyApp.swift`), `Paid/DysonLight.entitlements` (App Attest and `applinks:optimism.fit`), signed only with a paid team (`build.sh`, `DYSONLIGHT_PAID_TEAM`).
7. **The Worker's config**: `/wish` and the link file reach the Worker first.

## Proofs

- `node --test worker/app-attest.test.mjs`: **4 of 4**. The Worker's checks and the house's own door give one verdict on the same bytes, case by case: a right
  attestation (P-256 chains and Apple's own mix, P-384 CA keys signing with SHA-384), its assertions, and each wrong part.
- **Apple's own sample** (the Attestation Object Validation Guide's, team 1234567890, bundle com.example.myapp): taken by `attestationOf` with Apple's intermediate
  standing in for the root (nothing downloaded, nothing of Apple's in the tree); refused a day after its leaf ends, under another challenge, for another app.
- `node --test worker/her-wish.test.mjs`: **10 of 10**. Shut until his words; 0 wishes outside the app (the old page's word, a script, a key never born, a forged
  or another app's or a developer's proof); the hello, a replay refused, a stale window refused, a reinstall a new her; three answers, no $WARM, no word kept,
  Fuel me; the K-factor in the app (a web code and the same friend twice count nothing); the day's ceiling; a failed call spends nothing; the bounds; the door on
  the web; the chat still waits for the sale.
- `node --test app/dl-her-colours.test.mjs`: **21 of 21**; `app/dl-her-wishes.test.mjs` 7 of 7; `worker/space-router.test.mjs` 9 of 9; `worker/her.test.mjs`
  4 of 4; `app/dl-lyssajudron.test.mjs` 12 of 12; `app/warm-entry.test.mjs` 7 of 7.
- **The real browser** (`nice -n 19 node app/dl-her-wish.proof.mjs --url <the page on tools/serve-range>`, headless Chrome for Testing, the Worker's own doors on
  node:sqlite with every migration, an invented Apple, a stand-in MiniRouter): **PASS 13 of 13**. The web: the door stands, the die spends nothing, the old
  page's wish refused, the press goes to /wish and on to the store. The app (the hand injected, its key in the proof's process): the attested hello names her
  code, the field at 3/12, three proved wishes, the fourth pentagon's slam, Fuel me, one key and three rows, the last word sent again refused, no page error.
- **Rule 8**: `node --test app/dl-twelve.test.mjs` 21 of 21; `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button` and `--tap sphere`: PASS, the
  sound came in where the picture was and the picture never went back.
- **The mint's folder**: 1,153 tests, 12 red, **the same 12 red on main's tree** (a893b7c28); no new red.
- **DysonLight**: `SDKROOT=<MacOSX26.5.sdk> harmony-clip/tests/run-tests.sh` **1,103 of 1,103** (the new WishRoad checks among them; the words' SHA-256 is node's
  byte for byte); `WishRoad.swift` and `WishFront.swift` typecheck clean against iPhoneOS 26.2 (`-target arm64-apple-ios17.0`), the app's new lines in a probe
  view. The app's compile of record is the lander's (THE CLIP COMPILES BEFORE IT LANDS).
- `tools/any-room/any-room.test.mjs` 8 of 8; `the-law-is-the-gate.test.mjs` 7 of 7; `no-page-of-its-own.test.mjs` 3 of 3.

## His presses (nothing of it is live before them)

1. **The paid Apple Developer Program** for DysonLight's team: App Attest and the universal link are not given to a personal team (Apple's capability table,
   read Nov 1 2026: App Attest, Associated Domains: Apple Developer Program and Enterprise only), and a stranger installs only through TestFlight or the App Store,
   which need it too. Then DysonLight signed with it, `DYSONLIGHT_PAID_TEAM=<team id> harmony-clip/build.sh --sign`, and sent to TestFlight from his account.
2. The migration: `npx wrangler d1 migrations apply optimism-fit-premint --remote --config wrangler.optimism-fit.jsonc` (on the old Mac).
3. The tank that pays: `node tools/space-router-tank.mjs add wishes --markup-bps 0 --run`, then `node tools/space-router-tank.mjs refill wishes <usd> the house sponsors her wishes --run`.
4. On the Worker: `SPACE_ROUTER_WISH_TANK=wishes`, `SPACE_ROUTER_WISH_MODEL=<the model a wish asks>`, `SPACE_ROUTER_WISH_USD_DAY=<the day's ceiling>`,
   `SPACE_ROUTER_WISH_APPS=<team id>.gg.playroll.embertide.dysonlight`, `SPACE_ROUTER_WISH_ROOT=<Apple App Attestation Root CA, its PEM>`,
   `SPACE_ROUTER_WISH_STORE=<the TestFlight public link, or the App Store page>`.
5. The deploy from the old Mac.

Then, read live: `curl https://optimism.fit/space-router/v1/wish` answers `{"open":true,"store":...}`; on the phone, MAKE A WISH on her page opens DysonLight
(or the store), and three wishes answer there.

## What it does not do

(His Nov 1 06:03 UTC "please do what is still open" took up the first four below in lane/one-phone-one-birth: `ONE-PHONE-ONE-BIRTH-LANDING.md`.)

- **One phone, one birth.** A reinstall makes a new key and three more wishes; the day's ceiling bounds it. Apple's DeviceCheck bits would hold one phone to one
  birth: his key for Apple's DeviceCheck API and one call out of the Worker, his call.
- **Android.** No app proves itself at this door yet (the house's own door reads Android's key attestation; the phones' app has no cover for her).
- **The welcome** leads with the Mac's code (his Oct 29 word); MAKE A WISH sits under it. Whether her wish leads a stranger's first screen is his to say. A phone
  already in a Nest has no Wish key in its rooms; the links open the cover.
- `worker/her.mjs`'s two doors (the web's births) are read by nothing after this deploy; they leave in a lane of their own.
- The other two links of his loop: the Meta-MMO (Nests that meet) and the Nest from the GPU.
