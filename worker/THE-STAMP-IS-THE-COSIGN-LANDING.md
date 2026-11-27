# THE STAMP IS THE COSIGN: a stamp on a drop, signed by the stamper whose agent followed it and countersigned by the drop's creator (Oct 29 2026, lane `lane/the-stamp-is-the-cosign`)

**His words.**
- Sept 8 2026 03:38 WEST: "THE VOTES ARE "STAMPS OF APPROVALS" ON CONCEPTS / POINTED-INFORMATION... IT'S ALL ABOUT POINTERS AND REPUTATION MY DUDE!!!!"
- Sept 28 02:45: "we gotta beat cosign by a16z with true neutrality".
- Oct 17: "EVERY PROBLEM IS SOLVED ONLY ONCE".
- Oct 27 03:16 WET: "what do they trade dude? think... we have been trying to build cosign alternative... the idea is, what do they do? they network".

**The ask.** Oct 29 2026 22:11:10 UTC: his press of "Do it here" on this seat's card "The stamp is the cosign". The brief is the seat's words. It answered his question, what the seat thought of the Claw Riders vision (ec-workspace `docs/the-vision-claw-riders-against-cosign-hypertrace-2026-10-29.md`): the one piece that beats Cosign, the cosign itself, was the one not built, and the cheapest, since signed drops already stood.

**The design** it lands: ec-workspace `docs/beat-cosign-with-true-neutrality-2026-10-25.md` section 5, point 3 (an approval is a stamp on a pointer, never a count of believers on a person) and point 4 (two who met each sign), and `docs/tamagotchi-pokemon-exchange-the-lineage-hypertrace-2026-10-27.md` section 10 (the countersign lives in both chains).

## What stood (main 3e80aac8f)

- THE DROP IS SIGNED (main 0f43eab10, Oct 25). Each tracenet drop is a line its creator's wallet signs, chained to the one before. D1 is its cache, and every reader proves a drop itself (`app/tracenet-drop-line.mjs`).
- No stamp and no countersign anywhere.
- The Campaigns' mod line showed `cosigns` as a bare number on the mod's ref (`life-menu/the-room.mjs` `modsOf`), and nothing wrote it. That is a count held as a number, the shape his Sept 8 words refuse.

## The cut

1. **`app/tracenet-stamp.mjs`** (pure). A stamp is five fields, each by its own law:
   - `stamper` and `by`: two wallets, never the same one, so nobody stamps their own drop;
   - `on`: the drop's sha256;
   - `door`: one of the five snow doors (GAMEPAD, ASSETS, API, MEMORY, MOD);
   - `at`: the instant it was followed.

   `stampText` gives the words both wallets sign, one field a line, under the schema `optimism.tracenet/stamp/1`. `stampId` is the sha256 of those words, the stamp's name on every Nest (`stamps/<id>`) and in every index.

   `proveStamp` says whether the stamper's signature (`sig`) verifies; when the creator's countersign (`cosig`) over the same words verifies too, the stamp is cosigned. `proveStamps` proves each stamp once into a reader's map. `cosignsOn` counts the stampers whose stamp on this pointer by this creator is cosigned, each one once.
2. **`app/tracenet-drop-line.mjs`.** `walletSigned(wallet, sig, text)` is factored out of `verifyDropLine`: the same check, now shared by drops and stamps.
3. **`worker/creators.mjs`.** The creator door gains `POST <handle>/stamps`:
   - The stamp must be on a drop of this tracenet that a reader may draw: one verify of that drop, not one per drop. Its creator must be the tracenet's wallet.
   - The follow comes after the drop was published and is never ahead of the door's clock beyond ten minutes.
   - The stamper's half waits for the creator's countersign, which completes it; a stamp may also come whole. The signatures are the proof, so there is no seat proof.
   - One stamp per stamper per drop (`stamps_once`). At most `MAX_WAITING` (64) halves wait on a drop; a cosigned stamp waits on nobody.
   - `GET <handle>` carries the stamps, and each reader proves them itself.
   - `worker/migrations/0010_stamps.sql` holds the table: this index's cache, never the stamp's authority.
4. **`life-menu/the-room.mjs`.** The one read of the refs takes `stamps/`. A mod names its pointer (`sha256`) and its maker's `wallet`. Its cosigns are counted from the stamps on that pointer by that wallet whose two signatures the page checked: each stamp once, the shelf drawn again only when a check proved something. The bare number is never read again. The line says cosigns only when there is at least one.

## How a follow is known (this lane's design; its writer is owed)

The stamper's agent names it. When an agent of B's runs A's drop (as a mod, or with its trace as the path) and a snow door opens, B's wallet signs the stamp at that instant. Any Solana wallet is an iroh keypair (his Sept 14), so a Nest's device key signs as well. B's agent writes `stamps/<id>` on B's Nest and posts the half to A's tracenet. A's page shows the halves that wait on A's drops; A countersigns, and A's Nest keeps the cosigned stamp.

The stamp is B's testimony. What it cost B is the follow itself: B burned the inference.

Space Router seeing A's trace in B's context is the stronger witness. It comes after, as a later schema, never by changing these words.

## The sanitization

A stamp carries two wallets, a sha256, one of five door names and an instant. `stampOf` keeps nothing else, and the words both wallets sign are built from those fields alone: no title, no path, no free word. That shape is the membrane for a stamp. Nothing of a room or a trace can leave a Nest on one ("everything shared outside must be thoroughly sanitized in the nest itself", Oct 14 23:01).

## What it leaves room for: his Sept 7 testimonies

His Sept 7 02:02: "PEOPLE TESTIFY THERE TO HAVE MET YOU AND THAT YOU ARE REAL IN A DUNBAR TYPA THING: THEN, YOU CAN GO THERE AND SIGNAL WHEN SOMEONE HAS BEEN HACKED OR COMPROMISED".

The count is a set of stampers over proofs the reader holds (`cosignsOn`). So a reader can weigh a stamper, or leave one out, by testimonies without a word of the stamp changing. A design for it, his to rule:
- A testimony is the same act on another pointer (a wallet, not a drop) under its own schema, signed by both who met, at most about 150 for each signer: the Dunbar bound.
- A compromise is a signed testimony with an instant. After that instant, the compromised wallet's stamps stop counting for every reader who holds it.

Until then every stamper counts once, and a stamp from a made-up wallet costs a key and two signatures. The bound against it (weight by the stamper's burn, and the testimonies) is owed, and this receipt says so.

## Cost (measured on the new Mac, node v26.11.0, 1,000 stamps of fresh wallets)

| | measured |
|---|---|
| a stamp's words (what each wallet signs) | 503 bytes |
| a signed stamp as a Nest entry or a register line (JSON) | 423 bytes (predicted about 300; each base58 signature is 88 characters and each wallet 44) |
| proving one stamp (SHA-256 and two Ed25519 verifies, WebCrypto) | 0.31 ms |
| proving 1,000 stamps once | 317 ms |
| the count over 1,000 proven stamps | 0.35 ms |
| proving again what is proven (1,000) | 0.42 ms, map reads only |

- **At rest:** nothing. No timer, no new process, no new HTTP door (the creator door gained a path).
- **The room page:** a stamp is proven once, when it first appears. The read of the refs carries 423 bytes per stamp more.
- **The door:** a POST costs one verify of the drop it names, one stamp proof and at most three D1 statements. A GET costs one indexed read more.

## The tests (on the new Mac)

| | result |
|---|---|
| `app/tracenet-stamp.test.mjs` (new) | 4 of 4: the words pinned word for word, each field's law, the half and the cosign, the count |
| `app/tracenet-drop-line.test.mjs` | 4 of 4 (`walletSigned` under `verifyDropLine`) |
| `worker/creators.test.mjs` | 7 of 7. The new test covers the half that waits, the countersign that completes it, a whole stamp, eleven refusals, nothing refused kept, the cap of 64, a forged row that adds nobody, and the first tracenet's drops |
| `life-menu/the-room.test.mjs` | 29 of 29. The new test is the count: a half, a forgery, another pointer, another wallet or none count nothing, and the bare number is never read. The Campaigns' mount test carries a stamped mod: "1 cosign", and nothing written |
| every `app/tracenet*.test.mjs` and `worker/*.test.mjs`, `life-menu/the-room.test.mjs`, `life-menu/journey-gate.test.mjs`, `tools/any-room/any-room.test.mjs` | 181 of 181 |
| rule 8: `node --test app/dl-twelve.test.mjs` | 21 of 21 |
| rule 8: `nice -n 19 node app/dl-twelve.proof.mjs --url <tools/serve-range>/embertide-app/ui/intro/dyson-society/app/warm.html --tap button`, and `--tap sphere` | PASS and PASS: both media seekable past the tap, the invitation gone once the sound is on, the sound in where the picture was, and the picture never back |

## Predicted on the live house

- **No glass changes today.** No mod names a pointer and a wallet yet, and no Nest holds a stamp, so every mod line reads as before. The one difference: the bare `cosigns` number, which nothing wrote, is no longer read.
- **optimism.fit:** nothing until his deploy of the worker with D1 0010. That is his press.

## Owed

- The follow's writer: B's agent signs at the door's opening, writes `stamps/<id>` on its Nest and posts the half to A's tracenet.
- The creator's countersign on the tracenet page (`app/creator.js`): the halves waiting on my drops, one signature each.
- Mods that name their `sha256` and `wallet` when they are made (the Campaigns' "+ A new campaign").
- The weight: the stamper's burn (its tank) and his Sept 7 testimonies.
- The stamps carried between a tracenet's index and its creator's Nest, on the house's wire.
- optimism.fit's deploy with D1 0010: his press.
