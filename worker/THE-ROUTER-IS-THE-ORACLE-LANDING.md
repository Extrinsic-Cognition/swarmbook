# THE ROUTER IS THE ORACLE: every call through Space Router's door gets a signed receipt of what was asked and what came back, each hour sealed into one Merkle root and anchored on Solana (Oct 30 2026, lane `lane/the-router-is-the-oracle`)

A seat on the new Mac (claude-1c4795af, handed the build by claude-61e371e5's session so it could answer his next question).

**Landed:** the oracle landed on Oct 30 2026 at 05:20:59 UTC as main `f74c37438` (409abcd9f). Its batch of 2 was green: 200 of 203, 3 of them main's own red, and
proofs 4 of 4, in 256 s.

**The follow-up, `lane/the-oracle-counts-the-cache`:** the receipt and the ledger also count the input the provider read from its cache (`tokens_cached`,
below), a seat's suggestion. It is built after the landing, in its own migration 0013, so that 0012 is never edited.

## His words, UTC

- **Oct 30 04:41:46:** "i dont get the cheater decentralized sorry... i think you are forgetting we'd be the router through with the prompt is sent to and to which the
  result of the model responding to the request is queried at... u get what i mean? if we are the router we can afford cognitio salvata... that is the entire point
  of snowtrace.."
- **Oct 30 04:42:33:** "we are the oracle on what model was called for what prompt and the trusted anchor for what comes back from the provider api..."
- **Oct 30 04:46:03:** "Yes, build it", on the seat's question "Build the oracle's signed receipt on Space Router's door?". The button's words are the seat's, and only its label
  is his. They said: "Build the oracle's receipt on Space Router's door: the prompt's and the answer's hashes, the model and cost the provider returned, signed with
  the router's key, and one Merkle root a period anchored on devnet."
- **His lineage:**
  - Sept 7 07:15: "sharing traces allows us to go towards COGNITIO SALVATA METRICS MY DUDE", and in the same turn "it's consent based and all knowing and advertised".
  - Sept 21 14:0x WEST: "minirouter sells the traces... have you applied FIDES?" (quoted in the purse door, `tools/embertide-mesh/minirouter-openai-shim.mjs`).
  - Oct 22 16:23: "project snowtrace is about cognitio salvata...".

## The design in one line

**The router is the one place a prompt and its answer both pass, so it is the one honest witness of a call.**
- It signs what it saw, keeps the signature and never the words.
- The holder keeps the words. The hashes prove them, to anyone, on the day the holder chooses to share them.
- Each hour's receipts are sealed into one Merkle root, and the root goes on Solana in a memo, so the router cannot rewrite an hour once it is over.

**The hot key and the cold key are separate.**
- The key that signs receipts lives at the edge (a Worker secret).
- The key that signs the anchor lives at home (a Solana keypair file).
- A leaked edge key could sign false receipts, but could not put them under an anchored root.

## Cost first

The door's two columns are the same proof (`worker/space-router.proof.mjs`) on the same Mac (the new Mac, nice 19, 2,000 calls, this process's SQLite, the router answering at once).

| | before (main `cbc89111f`) | after (this lane) |
| --- | --- | --- |
| The door's own work, a call | **p50 101–105 µs**, p95 257–310 µs (two runs) | **p50 218–222 µs**, p95 508–547 µs (two runs) |
| The oracle's share of it: two hashes, the receipt, its Ed25519 signature, its leaf | | **72 µs p50**, 152 µs p95 for a short call; **239 µs p50**, 384 µs p95 for a call of 200 KB (`space-router-oracle.proof.mjs`) |
| Against what a call costs | | an inference is seconds; 0.12 ms is under a ten-thousandth of it |
| The database, a call | **111 bytes** (the ledger's row) | **891–897 bytes**: the ledger's row, and the receipt's row and its two indexes, 705 bytes |
| What the caller gets | the cost, the $WARM, the fuel | the same, and `x-space-router-receipt`: **730 characters** of base64url, the canonical signed receipt |
| Sealing an hour | | on its first read once the hour is five minutes over: one read of its leaves and 2n − 1 hashes, once; every later read is one row |
| A receipt's proof | | one read of its hour's leaves and about 2n hashes; ⌈log₂ n⌉ hashes come back |
| The anchor, an hour | | one Memo-program transaction: **350 bytes, 5,000 lamports, 78,026 compute units** (devnet, below) |
| At rest | nothing | nothing: no timer. An hour is sealed by its first read, and the anchor is his hand. |
| Spent | | **$0** on every test and proof (MiniRouter is a stand-in). On devnet, 0.01 devnet SOL was poured into the anchor's key from the ceremony's devnet bank (`poleis-devnet-deployer`), and the anchor's fee was 5,000 lamports. |

**The noise floor.** The door's two columns were measured back to back, minutes apart. Later the same morning, with this Mac's load averages at 20 to 32 (the
gates' tests), the same proof read the lane's door at p50 349 to 554 µs, and the oracle's share of a short call at 285 µs: the Mac was slower, not the code.

## What changed

1. **`app/space-router-oracle.mjs`, the oracle's law.** It is pure: crypto.subtle (the Worker's and Node's), no clock, no I/O.
   - **canonical:** RFC 8785's JSON. Keys are sorted by UTF-16 code units at every depth, numbers and strings are written as JSON.stringify writes them, and there are no spaces.
   - **The receipt:** `{ v, at, tank, asked_model, model, provider, ask, answer, usd, router_usd, tokens_in, tokens_out, tokens_cached, nonce }`, then `by`
     (the oracle's public key, hex) and `sig` (Ed25519, base64url, over the canonical rest).
     - `tokens_cached` is the input the provider says it read from its cache: the chat wire's `usage.prompt_tokens_details.cached_tokens`, or Anthropic's
       `cache_read_input_tokens`. It is null when the provider says neither, and 0 when the cache paid for nothing. The ledger's row keeps it too, beside
       `tokens_in` and `tokens_out` (migration 0013 adds the column).
       - It was a seat's suggestion, not his word: claude-61e371e5, at 05:1x UTC, from the router hypertrace (ec-workspace
         `docs/the-optimal-router-from-first-principles-hypertrace-2026-10-30.md`, 0a08abf2f).
       - The hypertrace found the house's calls are 97 to 99.6 % input tokens. The purse door had recorded cached tokens on only 10 of its 3,501 MiniRouter
         calls, so the router's biggest lever was unmeasured.
     - `ask` is the sha256 of the canonical request as the client sent it, without `stream` and `stream_options`, so the holder recomputes it from its own trace.
     - `answer` is the sha256 of the canonical whole answer the provider sent back.
     - `model` is the model the provider says answered: null when it says none.
     - The nonce makes two equal calls in one millisecond two receipts.
   - **The tree:** RFC 9162's Merkle tree. A leaf is SHA-256(0x00 ‖ the canonical signed receipt), a node SHA-256(0x01 ‖ left ‖ right), split at the largest power of
     two below n. The law gives the root, the inclusion proof and the proof's check (§2.1.3.2).
   - **The period:** a UTC hour, sealable five minutes after it ends. Its memo reads `space-router oracle v1 <hour> n=<count> root=<hex> by=<key>`.
2. **`worker/space-router.mjs`, the door.**
   - **The receipt.** Every burn signs its receipt and writes it in the burn's own batch (one transaction): the canonical receipt and its leaf, never the words.
     - The caller gets it as `x-space-router-receipt`, only when the batch landed, because a receipt that was not kept proves nothing.
   - **Shut without the oracle.** No `SPACE_ROUTER_ORACLE_KEY`, or one that does not import, is a 503 "being prepared", and nothing is sent upstream.
     - The hold's one statement now probes `sr_receipts` and `sr_ledger.tokens_cached`. A database behind migration 0012 or 0013 therefore fails before anything
       is sent, instead of answering calls whose burns it could not write.
     - The door answers "no such table" and "no such column" alike, with a 503 "being prepared".
   - **`GET /space-router/v1/oracle`:** the receipts' key, the algorithm, the period, the tree, and the anchor's address (`SPACE_ROUTER_ANCHOR`, public, his).
   - **`GET /space-router/v1/oracle/root?period=`** (a number, or an hour like `2026-10-30T05Z`):
     - 409 until the hour is five minutes over;
     - then sealed once (`INSERT OR IGNORE`: two isolates keep the first) and never changed;
     - an hour with no receipts is the empty tree's root and is not written.
   - **`GET /space-router/v1/oracle/proof?receipt=<leaf>`:**
     - only with the receipt's own tank's key: the holder shares by its consent, and another tank's receipt is a 404;
     - returns the receipt, its index, the sealed root and the path;
     - a receipt written after its hour's seal (the five-minute grace is there so none is) is told that no root holds it.
3. **`worker/migrations/0012_the_oracle.sql`:**
   - `sr_receipts`: period, at, tank, a unique leaf, and the body;
   - `sr_seals`: period, n, root, last_id, sealed_at.
   - **`worker/migrations/0013_the_cached_input.sql`** (the follow-up): `sr_ledger.tokens_cached`, the new column.
4. **`tools/space-router-oracle.mjs`, his hand.**
   - **`keygen`:** the private JWK on stdout, piped into `wrangler secret put SPACE_ROUTER_ORACLE_KEY`; the public half on stderr. Nothing is kept.
   - **`root`:** an hour's seal, read from the door.
   - **`anchor`:** the root's memo in one transaction signed by the anchor's key.
     - It is a dry run by default, with no network.
     - With `--send`, `tools/warm-launch/rpc.mjs` asks the cluster's genesis hash before sending, so only devnet is reached. The transaction is then read back,
       and the memo on the chain must be the memo sent.
   - **`check`:** an anchor read back from the cluster.
   - It reuses the warm launch's devnet road (`rpc.mjs`, `chain.mjs`): no new dependency.
5. **`worker/space-router.test.mjs` and `worker/space-router.proof.mjs`:** their door now has an oracle key. The first test's expected ledger row has the new
   column (null: its stand-in says no cached tokens). Nothing else in them changed.

## What a holder can prove, and how

1. Keep the words sent, the whole answer got, and the receipt header.
2. **Signature:** `verifyReceipt(receipt, key)` with the key `/oracle` names (or the anchor's memo names).
3. **The words:** `askOf(words sent) === receipt.ask`, and `answerOf(answer got) === receipt.answer`.
4. **Inclusion:** after the hour, ask `/oracle/proof` with the tank's key, then `verifyInclusion(leafOf(receipt), index, n, proof, root)`.
5. **The anchor:** the root and n match the memo signed by the anchor's address on Solana (`space-router-oracle.mjs check --sig <signature>`).

A stream is replayed from the same whole answer, so its holder sees the same words but not the provider's whole JSON. A holder who wants its answer provable asks
whole (`stream:false`). That costs nothing at this door, which asks the provider whole either way: the receipt's `ask` is the same for both.

## Proved (the new Mac, nice 19)

- **The two router test files:** `node --test worker/space-router-oracle.test.mjs worker/space-router.test.mjs`, **14 of 14**: the 5 new tests and the 9 old ones
  (point 5 above says what changed in them).
  - A receipt verifies with the key `/oracle` names. Its ask and answer are the sha256 of the words sent and the answer got, and the door keeps none of the words.
  - The cached input reaches the receipt and the ledger: 11 from the chat wire, 9 from Anthropic's, and 0 as 0.
  - Changing its cost, its model, its answer or its key breaks it, and so does another key.
  - A stream's ask is the whole call's.
  - The door is shut with no key, with a key that is not one, and on a database behind 0012 or 0013. Nothing goes upstream and nothing is charged.
  - The roots of Certificate Transparency's eight test vectors match exactly (RFC 6962's, the same tree as 9162). Every inclusion proof of trees of 1 to 17 leaves
    holds, and a wrong leaf, a wrong place or a place past the end fails.
  - An hour is sealed only once it is five minutes over, and is the same a day later, even with a receipt written after it.
  - A proof is the tank's own: another tank's receipt is a 404, and no key is a 401.
  - The memo reads back, and the anchor is one Memo-program transaction under 1,232 bytes.
- **The worker folder whole:** `node --test worker/*.test.mjs`, **94 of 94**.
- **Rule 8** (the law module sits under the mint's `app/`, so the guard applies; no page that plays a picture changed). On the lane's tree, `warm.html` served by
  `tools/serve-range` answered a range read with 206:
  - `node --test app/dl-twelve.test.mjs`: **21 of 21**;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <warm.html> --tap button`: **PASS**;
  - the same with `--tap sphere`: **PASS**. The sound came in where the picture was, and the picture never went back.
- **The site's tests:**
  - `node --test app/*.test.mjs`: **440 of 443**. The 3 failures (`dl-athena`, `dl-paywall` and `warm-sphere-moment`) are main's own: 60 of 63 fail the same way on a
    clean main `cbc89111f`.
  - `tools/*.test.mjs`: 101 pass, none fail.
  - The tanks, the warm launch and any-room: **33 of 33**.
- **The wire proof:** `nice -n 19 node worker/space-router-oracle.proof.mjs`, **every line holds**.
  - Three calls (two whole, one stream) and another tank's call go through the door on loopback with curl.
  - Every receipt is verified with nothing but the key the door names, against the words sent and the answer got, and a receipt at half its cost does not verify.
  - The door kept four receipts and none of the words.
  - The hour is refused before its seal. Once sealed it holds four leaves, each receipt's proof leads to the root, and the root is the same a week later.
  - The anchor's transaction is built with no network: 350 bytes.
- **The anchor on devnet:** `nice -n 19 node worker/space-router-oracle.proof.mjs --devnet-payer <the anchor's devnet key>`, every line holds.
  - The memo `space-router oracle v1 2026-10-30T05Z n=4 root=a4a71d591f676d4dfcc639ae118a9960dd63db936c28f4a9e05173874825b33c by=1da1f1b249e3f61e7eea76496f5234cbca7bf7b2fee49728145d1b5614839673`
    is in transaction **`4QJF4DLvFkEwcZxjHqNVTYxUFGoVfqekQzFwgdLNXPh6xQGJ5S7eF8ocuc5frt1a6DNAoknTqxrgq3MVQrHQ9NjS`**, slot 516,664,500.
    - It was signed by the throwaway anchor key `7TpCYaYBbLrF7uWmgfSkrTP8KLMe7CoZeawpbjaA4CYg`.
    - It carries 5,000 lamports of fee and 78,026 compute units.
    - It was read back from devnet with the same memo.
    - <https://explorer.solana.com/tx/4QJF4DLvFkEwcZxjHqNVTYxUFGoVfqekQzFwgdLNXPh6xQGJ5S7eF8ocuc5frt1a6DNAoknTqxrgq3MVQrHQ9NjS?cluster=devnet>
  - The anchor key was funded from the ceremony's devnet bank by `4atxRpSKL3RiQK7yNMqga3Aid64XhTc1FRVgXgpYZPExHrKo48aTmy4v9h8zDzGSo6HhayWHXkGvc2dg6gNRNw6c` (0.01 devnet SOL).
  - The key is a throwaway in the seat's scratchpad, never in git; his anchor key will be his own.
- **The tool:**
  - `keygen` prints one JWK (kty, crv, d, x) and the public key on stderr.
  - `check --sig` reads the devnet anchor back.
  - The `anchor` dry run sends nothing.
  - `anchor --send --rpc https://api.mainnet-beta.solana.com` is refused by mainnet's genesis hash before anything is sent.

## His, before the door opens

- **The oracle's key:** `node tools/space-router-oracle.mjs keygen | npx wrangler secret put SPACE_ROUTER_ORACLE_KEY --config wrangler.optimism-fit.jsonc`.
  Without it the door stays shut, beside its other two secrets.
- **The migration:** `npx wrangler d1 migrations apply optimism-fit-premint --remote --config wrangler.optimism-fit.jsonc` (0011, 0012 and 0013). Then the deploy, from
  the old Mac, run by the $WARM & SpaceRouter seat with him.
- **The anchor's key:** a Solana keypair of his, kept at home. Its address is `SPACE_ROUTER_ANCHOR` in the Worker's vars, so `/oracle` names it.
  - Each hour: `node tools/space-router-oracle.mjs anchor --door https://optimism.fit --period <hour> --payer <his key> --send`.
  - It is devnet only until his word for mainnet. Nothing anchors on a timer.

## Not built

- **The purse door on the Mac** (`tools/embertide-mesh/minirouter-openai-shim.mjs`) signs nothing yet. The house's own seats' calls have no receipts.
- **No answer comes from a saved trace yet**, cognitio salvata's first step: a shared trace, filed under its ask, answering the same ask the next time instead of the
  provider. The receipt's `ask` is the key that step will file it under.
- **The mint does not read the receipts yet.** PROMPT-TO-MINE still mines from the ledger's burns; the receipts are what a mint, or anyone, can check them against.
- **One signer.** His Sept 1 wish is "a weighted sum oracle thna a single point of failure". The receipts have one signer. The anchor at home splits the hot key from
  the cold, but several routers co-signing is not built.
- **No list of past keys.** `/oracle` names the key now. A receipt carries its own `by`, so it still verifies after a rotation, but the door does not list the keys it
  had.
