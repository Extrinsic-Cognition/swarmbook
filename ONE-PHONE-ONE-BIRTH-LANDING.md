# ONE PHONE, ONE BIRTH

His word, UTC, Nov 1 2026, 06:03:55: "please do what is still open". It answered the three open lines that closed THE WISH IS IN THE APP (a8cabe1a8), as
he read them at 05:41:

- "A reinstall gets three more wishes. The daily spending cap limits the damage; Apple's DeviceCheck could hold each phone to one, which is your call."
- "Android has no app that proves itself yet."
- "On the welcome screen, MAKE A WISH sits under 'scan your Mac's code'. Whether the wish should come first for a stranger is yours to say."

This lane takes up all three, and the fourth item that receipt left (`worker/her.mjs`'s web birth doors, read by nothing once the wish moved into the app).
The seat claude-10f3e36e wrote most of it between 06:06 and 06:13 UTC and again from 16:16; its account's weekly limit ended it twice. The seat
claude-7d8aa813 (MMO-RPG) saved its tree out of /tmp, finished it, proved it and handed it.

## Cost, first

| | measured (node WebCrypto on the new Mac) |
|---|---|
| the phone's mark at birth | 32 random bytes drawn once a phone, read from the keychain at a key's first word only; about 55 B more in that hello; at the door one more SHA-256, one indexed SELECT, and on a reinstall one UPDATE. Nothing more on a wish |
| Android: the door's check of a key's first word | **0.46 ms** p50, 0.63 ms p95 on a real phone's TEE chain (Google's sample, under Google's RSA 4096 root, n 200); 0.37 ms on an invented P-256 chain |
| Android: the door's check of every later word | **0.08 ms** p50, 0.13 ms p95 (n 200) |
| Android: a first word's chain | 5,239 base64 characters (Google's sample), once an install |
| Google's revocation list | 180,486 B, 1,769 entries; read at an Android key's first word, at most once an hour an isolate (and Cloudflare's cache); 0.49 ms to parse and read |
| a wish in the real browser, press to answer | **228 to 259 ms** over three runs (the stand-in router on loopback; 230 ms before this lane) |

No call to Apple and no key of his for Apple: the mark is the app's own, in its keychain. DeviceCheck (the road the open line named) would have needed his
DeviceCheck key on the Worker and one call to Apple at each birth.

## What changed

1. **The phone's mark** (iPhone: `harmony-clip/Host/WishFront.swift` PhoneMark; the law: `app/dl-her-wishes.mjs` bornData, phoneOf, HER_PHONE_DOMAIN): 32
   random bytes drawn once, kept in the keychain for this device only (never synced, never in a backup), which outlives the app's deletion. The key's first word
   attests the page's words and the mark together (`bornData`: the hello's words, a newline, `phone <mark>`), so the mark cannot be laid on another phone's
   attestation. The door keeps `base64url(sha256("optimism.fit/her/phone/v1\n" + mark))` beside her (migration 0018, `her_apps.phone`, unique), never the mark.
2. **The door at birth** (`worker/space-router.mjs` hello): a first word without a mark is refused. A new key whose mark the door holds takes that row: her code,
   her friend as born, her wishes as they stood; the key, its public half and its counter are replaced. No new three, and no friend counted twice. A mark never
   seen is a new her, as before.
3. **Android at the door** (`worker/android-attest.mjs`, new, WebCrypto, on the same small DER reader as `app-attest.mjs`): a key's first word is its keystore's
   certificate chain, checked as Google's guide says. Each certificate is signed by the next, ending under one of Google's roots, which his hand places beside Apple's
   (Google's RSA root is verified by RSASSA-PKCS1-v1_5). The certificates above the leaf must be valid now and the leaf not expired, and none may be on Google's
   revocation list; while no copy of the list can be read, no Android key is born (503), and the iPhone does not wait on it. The key description must carry this word's challenge and a TEE or StrongBox key.
   Its package and signing digest must be an app his hand names (`android:<package>:<sha256 hex>[@development]`), and a production name needs a locked,
   verified boot. The key must be P-256, named by the hash of its point. Every later word: the key's signature over a counter that only goes up and the word's hash.
4. **Android's link file and store**: `GET /.well-known/assetlinks.json` names the Android apps (package, signing digest). `/wish` sends an Android browser to Google
   Play (`SPACE_ROUTER_WISH_PLAY`), never to the App Store, else to her page.
5. **Her page** (`app/dl-her-colours.js`): Android's hand is `window.dysonlight`, a web message port (androidx.webkit's listener, for her site alone). Each ask carries an id,
   and its answer comes back with it. The first word carries the mark (and `platform: 'android'` on Android). On the web, the door into the app shows only where this
   phone's store holds the app.
6. **The welcome** (`harmony-clip/Host/JourneyApp.swift`, DysonLight 89): MAKE A WISH stands first and largest under the name, the Mac's code under it at the
   same one press as before; nothing opens by itself. The welcome is a new phone's alone (a phone with a Nest in its book never sees it).
7. **The web's birth doors are gone**: `worker/her.mjs`, `worker/her.test.mjs` and `app/dl-her-friends.proof.mjs` are out, and `/api/her/*` no longer reaches the Worker.
   A friend counts when born in DysonLight, at the app's hello. The table `her_births` stays.

## Proofs

- `node --test worker/her-wish.test.mjs`: **12 of 12**. New: ONE PHONE, ONE BIRTH (a reinstall takes back her code, her friend and her wishes as they stood:
  one row, re-keyed, no second friend, the new key wishes; a first word with no mark refused; another phone's mark laid on an attestation refused by the
  nonce). ANDROID PROVES ITSELF (born by the keystore's chain, a wish under its key, a replay refused, a reinstall on Android gets her back; refused: an unlocked
  boot named for production, another signing key, a key in software, a chain Google revoked; the list unread, no Android birth and the iPhone unaffected; the list
  read once however many births). The door on the web: Android's link file, Google Play for an Android browser, never the App Store.
- `node --test worker/android-attest.test.mjs`: **5 of 5**. A real phone's TEE chain as Google publishes it (`worker/fixtures/google-key-attestation`, from
  github.com/google/android-key-attestation, Apache 2.0) verifies under Google's own RSA root. Refused, each by its own words: its unlocked boot named for
  production, another challenge, a revoked intermediate, the list unread, no root, another root, another key, a moment past its intermediates, a missing link.
  The invented phones cover what Google's sample cannot show.
- `app/dl-her-colours.test.mjs` **22 of 22** (new: the page through Android's port; on an Android browser the door only when Google Play holds the app);
  `worker/app-attest.test.mjs` 4 of 4; `app/dl-her-wishes.test.mjs` 7 of 7; `app/dl-her-friends.test.mjs` 4 of 4; `worker/space-router.test.mjs` 9 of 9;
  `worker/premint.test.mjs` 26 of 26.
- **The real browser** (`nice -n 19 node app/dl-her-wish.proof.mjs --url <the page on tools/serve-range>`): **PASS 14 of 14**. New is the third glass,
  THE APP AGAIN: the app deleted and installed again (a fresh browser context, the phone's key forgotten, its keychain mark kept). Her hello attests the new
  key with the same mark, and the door gives her back: her code, her three wishes spent, 4/12, Fuel me, one row re-keyed, the tank still three calls.
  **The same proof on the lane's base (ae691be52) FAILS that check**: a new her (another code), 3/12, three fresh wishes, two rows.
- **Rule 8**: `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button` and `--tap sphere`: PASS, the sound came in where the picture was and the
  picture never went back (`app/dl-twelve.test.mjs` untouched).
- **The mint's folder**: 1,156 tests, 11 red, every one of them red on the base too (the base: 1,153 tests, 12 red; its twelfth, a room pin's timing, is no
  file of this lane's). No new red.
- **DysonLight**: `SDKROOT=<MacOSX26.5.sdk> harmony-clip/tests/run-tests.sh` **1,108 of 1,108** (new: the mark's base64url as node writes it, and the SHA-256 of
  bornData byte for byte as the door hashes it). `WishRoad.swift` and `WishFront.swift` typecheck clean against iPhoneOS 26.2 (`-target arm64-apple-ios17.0`),
  with the welcome's new lines in a probe view. The app's compile of record is the lander's (THE CLIP COMPILES BEFORE IT LANDS).
- `tools/any-room/any-room.test.mjs` 8 of 8; `the-law-is-the-gate.test.mjs` 7 of 7; `no-page-of-its-own.test.mjs` 3 of 3; `the-pixel-is-a-lookup.test.mjs` 3 of 3.

## His presses (none of it is live before them; the five of THE-WISH-IS-IN-THE-APP-LANDING.md stand, and these join them)

1. The migrations, 0017 and 0018 in one press: `npx wrangler d1 migrations apply optimism-fit-premint --remote --config wrangler.optimism-fit.jsonc`
   (on the old Mac).
2. DysonLight **89** is the first build that can be born: the door refuses a first word with no mark, and 88 never left the house.
3. For Android, once its app's half exists (below): Google's two roots in `SPACE_ROUTER_WISH_ROOT` beside Apple's (the two PEMs of
   https://android.googleapis.com/attestation/root), the app's word in `SPACE_ROUTER_WISH_APPS` (`android:<package>:<sha256 of its signing certificate>`), and
   `SPACE_ROUTER_WISH_PLAY` (its page on Google Play). A stranger installs from Google Play only: his Play developer account, and a personal one made since Nov 13
   2023 must first run a closed test with at least 12 testers opted in for 14 days in a row before Google opens production to it (Play Console Help,
   "App testing requirements for new personal developer accounts").
4. The deploy from the old Mac.

## What it does not do

- **The Android app's half.** The door, the link file and her page's hand are ready. DysonLight on Android has no cover for her yet: her page in a WebView with
  the `dysonlight` port for optimism.fit alone, a P-256 key in the keystore attested with the challenge `sha256(bornData)`, the mark drawn from the phone's own id
  for the app's signing key (`Settings.Secure.ANDROID_ID`, which survives a reinstall and dies with a factory reset), and the counter its later words carry.
  That needs an Android lane with its own number from the warden.
- **A phone erased whole** (Erase All Content and Settings, a factory reset) draws a new mark, so it is a new her with three wishes. DeviceCheck's two bits would
  hold across an erase, at the cost of his DeviceCheck key on the Worker and one call to Apple a birth: his call, not taken here.
- **The keychain outliving an app's deletion** is how iOS behaves (an iOS 10.3 beta cleared it and Apple took that back before release); Apple does not promise it.
  If an iOS clears it, a reinstall is a new her again, as before this lane, and nothing breaks.
- **A jailbroken or rooted phone** running the genuine app can clear its own mark. The day's ceiling bounds the spend whatever passes.
- The other two links of his loop: the Meta-MMO (Nests that meet) and the Nest from the GPU.
