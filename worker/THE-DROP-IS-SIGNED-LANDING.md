# THE DROP IS SIGNED BY ITS CREATOR (Oct 25 2026)

lane/the-drop-is-signed, by claude-e8f1a927 (the seat ClawRiders), cut on main 11cddb492. It is the first lane of the design in ec-workspace
`docs/beat-cosign-with-true-neutrality-2026-10-25.md` (c8c4c317b): section 5 point 1, section 6 lane 1.

## His words

- Sept 28 2026 02:45 WEST: "onlyfans and the fans are agents... we gotta beat cosign by a16z with true neutrality".
- Sept 14 12:14 WEST: "BASICALLY ANY SOLANA WALLET IS A IROH KEYPAIR SO WE CAN RETAIN IDENTITY 1:1... YOU UNDERSTAND WHY IT'S CRITICAL TO RETAIN
  ACCOUNTABILITY".
- Sept 15 14:33 WEST: "there is only a performance append-only signed log from authorities on indexing the surface good quality of tracenet".
- Oct 25 16:45 WET: "Do this task here: "Beat Cosign by a16z with true neutrality"". About 17:25 WET: "Do this task here: "The tracenet drop is signed by
  its creator"".

## What stood (main 11cddb492, built on 4287be4bf of Oct 23)

- **The drop door** (`POST /api/premint/creators/<handle>/drops`) took the bytes with the creator's seat proof and set the line's instant itself. It
  wrote the line into D1 and the bytes into R2. The line was nobody's statement, so a reader had to trust the database.
- **The tracenet page** (`app/tracenet.js`) read every register with the Nest's sanitization receipt required, readManifest's default. A D1
  creator's drops carry no receipt, so they were never drawn on their own page: the register listed them, and the page said "No published traces yet."
- **The creator page** (`app/creator.js`) never reused the seat proof it kept. `verifySeatProof` is async and was read unawaited, so every visit asked
  the wallet to sign in again.

## The law, as landed

1. **The signed line.** A creator's drop is a line their own wallet signs (`app/tracenet-drop-line.mjs` dropLineText). It holds:
   - the handle, the wallet, the id and the title (JSON-quoted);
   - the kind, the file, the bytes and the sha256;
   - the instant;
   - the hash of their last signed line (NO_PREV for the first);
   - the schema, `optimism.tracenet/drop/1`.

   The wallet shows the text with its statement: "Sign this line to publish a drop of your tracenet. This sends no transaction and moves no funds."
2. **What the door keeps.** It keeps only a line that is:
   - signed by the tracenet's wallet (otherwise 401);
   - within ten minutes of the door's clock (otherwise 400);
   - after the last signed line (otherwise 409);
   - naming that line's hash (otherwise 409).

   There is one signed line per prev (`drops_chain`, migration 0008). When two drops race for the same last line, one is kept and the other gets 409.
   The door stores the signature and the link beside the line and answers with the line's hash.
3. **What a reader draws.** Every reader draws a drop only when it is proven (`proveItems`): by the Nest's sanitization receipt (the house's own
   registers, his first tracenet), or by its creator's signature.
   - A line whose signature does not verify, or that carries neither proof, is not drawn.
   - A signed line whose link skips a line is drawn and says so: "a line before it is missing".
   - A row written past the door (unsigned, or signed over other words) is no link of the chain. The head skips it, at the door and in every reader alike.

   The tracenet page and the Harmony window's Tracenets tab both read through `proveItems`.
4. **The creator page** signs at Publish, one wallet prompt per drop, and reuses its kept seat proof (now awaited).

## Cost (measured on the new Mac, node v26.11.0, the lane's own module)

- At rest: nothing.
- Per drop:
  - the creator's wallet signs 483 bytes of text (0.027 ms to sign in node);
  - the door does one SHA-256 of the line before (0.009 ms) and one Ed25519 verify (0.081 ms).
- Per row in D1: the signature (64 bytes, 88 base58 characters) and the link (64 hex characters).
- Per read: `proveItems` verifies each signed line once, 8.65 ms for a register of 100 lines (all 100 proven and linked). `headOf` does one verify when
  nothing was tampered with: 0.10 ms on the same 100.
- No new door, server or dependency: WebCrypto's Ed25519 and SHA-256, as the seat proof already uses.

## The proofs (the new Mac, nice 19)

- **The lane's two tests.** These are `worker/creators.test.mjs` (its new test and the signed road in its drop test) and `app/tracenet-drop-line.test.mjs`
  (4 tests). Copied onto main 11cddb492 they exit 1: the module isn't there, and main keeps an unsigned drop. On the lane, 10 of 10 pass.
- **dyson-society's other 97 test files:** 925 pass and 13 fail on main; the lane gives the same 925 and the same 13 (main's own: the hero's, the
  lab's and the build's pins).
- **Parsing:** the browser modules parse as modules (creator.js and tracenet.js as .mjs copies, and life-menu/tracenets.mjs).
- **Rule 8 (the sound never restarts the picture).** The lane changes five files under `app/`, so the mint's film rule binds it. At fcd803dab on the
  new Mac (node v26.11.0, the tree served by `tools/serve-range`, which answers Range with 206): `node --test app/dl-twelve.test.mjs` passes 17 of 17;
  `nice -n 19 node app/dl-twelve.proof.mjs --url <served>/embertide-app/ui/intro/dyson-society/app/warm.html --tap button` PASS and `--tap sphere`
  PASS, each with the film never below its second at the tap (6.00 s), no seek back, the song within 0.15 s of the picture at the end. The lander
  refused the first hand of this lane (line 740, Oct 25 20:53 WET) because neither its commit nor its hand named these two; the second hand carries
  both proofs.

## What changes at the landing

Nothing live by itself:
- optimism.fit goes up by his press (`tools/build-optimism-fit.mjs` and wrangler). Its D1 takes migrations 0005 to 0008 with that deploy; the ds-waves
  seat's note says they go together.
- The Harmony window's Tracenets tab is served from the checkout. After the landing it reads his register through `proveItems`, and his drops stand on
  the Nest's receipt as before (none is published yet).

## What is left (the design's section 6)

- **His own lines signed.** The first tracenet publishes through the house (`tools/tracenet-publish.mjs`, the Nest's sanitization receipt). Signing its
  lines takes his wallet's key, which is his hand: no seat signs as him.
- **The rest of the design:**
  - the log carried on the house's wire (swarmclock over iroh) and later a DHT, with D1 as a cache;
  - approvals as stamps on hashes;
  - agents subscribing with their own wallets and tanks;
  - the public treasury on the mint page;
  - the copy that says "true neutrality".
- **Wallets.** A wallet that cannot sign a message (`signMessage`) cannot drop. Phantom and Solflare can.
