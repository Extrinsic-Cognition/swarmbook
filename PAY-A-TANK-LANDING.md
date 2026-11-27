# PAY A TANK: a buyer's USDC, read on chain, fills their own Space Router tank (Oct 30 2026)

`lane/pay-a-tank`, by claude-9a126af2, cut on `lane/a-stake-pays-its-tank` (it lands after that lane or falls with it). Every time is UTC.

## His words

- **The press.** 12:30:29: "Pay a tank", on the seat's button "a buyer's USDC fills their own Space Router tank (the paused $30 starter kit)".
- 12:54:22: "i said 10% $WARM is sold until breakpoint begins to seed liquidity, this is to say, we should formulate the thing as "Pre-Deposits for the
  Space Router available" ... we need to take seriously the business of the router dude".
- 12:57:35: "1. the first one is an auction sale basically 10% to whoever throws money into it 2. the second one is as rebate so $WARM is given out to
  reward space router users with rebate".
- So $WARM never goes into a tank. Money does, and a tank's spending earns the $WARM rebate. This lane is the money road into a tank.

## The cut

- **`app/space-router-deposit.mjs` (new, pure, the same on the page and at the gate).**
  - **A deposit is what the chain says moved, never a shape of bytes.** It is a finalized transaction with no error, signed by its fee payer, that
    raised the treasury's USDC account by an amount the fee payer's own USDC accounts paid (`verifyDeposit`, read from `getTransaction` jsonParsed).
    A wallet's priority fee or guard instructions, an agent's own compile and a transfer with no memo all count: money that arrived is never refused
    for its shape.
  - **The key is claimed by its preimage.** The memo may carry `space-router:deposit:v1:<commitment>`, where the commitment is sha256 of
    `space-router:key:` plus a key the page made; it is not the key's hash. Such a deposit counts only when the key itself is brought with its
    signature, and the tank keeps only the key's sha256. Reading the chain neither opens nor claims a tank.
  - **The page's road:** `depositMessage` (byte for byte what `tools/warm-launch/chain.mjs` compiles), `unsignedDeposit`, `signedDeposit`, `newTankKey`,
    `keyHashOf`, `keyCommitmentOf`, and `unkeyedOf` / `isUnkeyed` (the mark of a tank no key opens yet).
- **`worker/space-router-deposit.mjs` (new).**
  - **GET** `/space-router/v1/deposit` answers the terms. It is 503 while `SPACE_ROUTER_TREASURY` is unset, or on devnet while the stand-in mint is
    unset (mainnet's USDC is never offered on devnet).
  - **POST** `{ signature, key? }` fills the payer's own tank (`st-` + 12 hex of sha256(wallet), the same tank a stake link feeds) dollar for dollar.
    One batch writes the deposit row, the tank and a refill whose `why` is `deposit:<signature>`, so a signature counts once.
  - **Refusals:**
    - 400: not a signature or not a key;
    - 403: a key that is not the memo's;
    - 404: not finalized yet;
    - 409: counted already;
    - 422: not a deposit into this treasury;
    - 428: the memo names a key and none was brought;
    - 429: more than 30 asks a minute from one address;
    - 503: unopened, a node of another cluster, or the node or D1 unreachable. Every D1 error answers 503, never a raw 500.
- **`worker/solana-node.mjs` (new).** The one chain reader the stake link and the deposit share: an 8 s timeout, the cluster checked by its genesis
  once per isolate, and a failed read asked again. It also holds the per-address limit.
- **`worker/space-router-link.mjs`.**
  - It reads the chain through the shared node.
  - Its tank insert is safe beside a deposit making the same tank, and a tank a deposit made without a key gets its first key from the link.
  - A link writes before any key, and only over an older link: a newer one is never overwritten (409).
  - D1 errors answer 503.
- **`worker/space-router.mjs`.** The chat door waits for `SPACE_ROUTER_OPENED_AT` itself, not only for its being set, so a pre-deposit's fuel waits
  until the opening.
- **`worker/migrations/0015_space_router_deposits.sql` (new).** The `sr_deposits` table.
- **`worker/premint.mjs`.** One dispatch line.
- **No page changes.** Wiring warm.html's button is the $WARM & Space Router seat's (claude-1a67b2d3).

## The review (Oct 30 13:4x, his "please make sure we are using solid code?")

An independent review of the lane found nine faults. Each one is fixed and pinned by a test:

1. **Exact-shape verification stranded real money.** A priority fee, a wallet's guard or another compile meant 422 forever, with the USDC already in
   the treasury. Now the door counts what moved.
2. **The key's hash in the public memo could be claimed first.** A dust deposit with a copied hash took the key and left the victim's tank unkeyed.
   Now the memo carries a commitment, and counting needs the key.
3. **Fuel paid before the opening could be spent** when the opening was set ahead. Now the chat door waits for the instant.
4. **D1 errors (for example, deployed before 0015) were raw 500s.** Now 503.
5. **No rate limit** on a door that calls the node. Now 30 a minute per address.
6. **The link door's insert raced a deposit's, and it misreported a tank a deposit had made without a key.**
7. **The unkeyed mark was read by guess.** Now it is one named function.
8. **The chain reader existed in two copies.** Now there is one.
9. **Devnet offered mainnet's mint.** Now 503.

## Cost

| | before | measured |
|---|---|---|
| A stranger's dollars into a tank | impossible: tanks were poured only by his hand | one transaction; the door's check took 81 ms on devnet, chain read included |
| The key | | made on the buyer's page; the chain holds only a commitment, and D1 only its sha256 |
| At rest | | nothing: no timer, no poll |

## Tests and the proof

- **`app/space-router-deposit.test.mjs`: 4 of 4.**
  - The page's bytes equal the launch tool's compile.
  - The commitment is not the hash.
  - Every shape that moves the money counts: a priority fee, a guard, no memo, a treasury account made in the same transaction.
  - Every refusal: no rise, another treasury, mint or decimals, paid by someone else, failed, unsigned, two memos, a bent memo.
- **`worker/space-router-deposit.test.mjs`: 6 of 6.**
  - Filled once, with the key nowhere in D1.
  - A top-up keeps the key; a new key shuts out the old one.
  - **The front-run:** the signature alone gives 428, a wrong key 403, and a copied commitment counts nothing.
  - Any shape counts; an unkeyed tank waits.
  - A stake link gives a deposit-made tank its first key.
  - Every refusal, including a D1 without 0015 (503) and the rate limit (429, another caller untouched).
- **`worker/space-router.test.mjs`:** an opening named an hour ahead keeps the fuel waiting.
- **The suites the lane touches,** after merging main: 291, 289 pass, 1 skipped, 1 red. The red is `dl-paywall.test.mjs`'s Harmony-tokens test, a file
  this lane does not touch, red on main before this lane.
- **Rule 8:** `node --test app/dl-twelve.test.mjs` is green, and `nice -n 19 node app/dl-twelve.proof.mjs --url .../warm.html --tap button` and
  `--tap sphere` both PASS on the merged tree, served by `tools/serve-range` (206). The lane is handed with both as gate proofs.
- **`tools/space-router-deposit.proof.mjs` on devnet: PASS, 12 of 12.** It is not a gate proof: the gate's guard refuses the network.
  - The signature alone counted nothing (428). With the key, $30 filled `st-aa5ee851022a`, and the key opened it.
  - Counted once.
  - A $5 top-up with a priority fee instruction before it counted ($35).
  - A bare transfer with no memo counted ($36).
  - A deposit into another account was refused.
  - The treasury holds $36 on chain, every dollar counted.

## What it does not do, and whose

- **His:**
  - `SPACE_ROUTER_TREASURY`: his treasury's USDC token account (its ATA, not the wallet).
  - Migration 0015 (after 0014) and the deploy.
- **What still needs his hand:** USDC sent by an exchange (its hot wallet pays the fee) is counted to the exchange's tank, not the buyer's; such a
  case is his to settle by hand.
- **The 10 % sale.** Whether a pre-deposit made before Breakpoint also counts in the 10 % auction is his ruling. `sr_deposits` keeps who paid what and
  when (indexed by payer), so the book is there if he says so.
- **The page's wiring** belongs to the $WARM & Space Router seat.

## After the landing: the deploy (Oct 30 13:5x)

- His 13:4x "plesase do them". Migrations 0014 and 0015 were applied to the live D1 by his hand (13:5x).
- **The build refused:** the 12:53 and 13:55 tabula rasa presses set the Nest aside, and the Oct 26 trace drop's sanitization receipt with it.
- **The fix:** `tracenet-sanitize.mjs` over the drop gives the same 23,711 bytes, nothing withheld. The receipt was written again on the Nest at
  13:56:50 UTC, and the register carries its new stamp (`lane/the-drop-keeps-its-receipt`). The publish time is unchanged.
- **A tabula rasa press again** clears the receipt, and the build refuses again until it is rewritten.
