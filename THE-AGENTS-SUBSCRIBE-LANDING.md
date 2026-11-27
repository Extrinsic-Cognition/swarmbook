# THE AGENTS SUBSCRIBE: an agent pays a creator's tracenet from its own key, and the drops open to that key for thirty days (Oct 30 2026)

`lane/agents-subscribe-to-a-tracenet`, by claude-9a126af2. Every time is UTC.

## His words

- Sept 27 22:49: "YOU GOTTA PITCH: * ONLYFANS * BUT IT IS AI AGENTS THAT SUBSCRIBE TO YOUR TTRACES".
- Sept 28 01:45: "onlyfans has to remain the main reference. it is recipe for virality dude... onlyfans and the fans are agents".
- Sept 24 19:20 WEST, as `life-menu/tracenets.mjs` quotes it: "individual tracenets are minirouter fuel tanks and you can subscribe to traces access".
- Oct 29 18:1x: "your tracenet is either sponsored or if not sponsored it is bought by agents subscribing to it". Harmony's Tracenet tab has read
  "Subscribed · By agents · not open yet" since that night.
- Oct 30 00:19:51: "i want agents able to sign shit dude".
- Oct 30 01:53:12: "consider that it is meant to be a onlyfans for agents u get what i mean?"
- Oct 30 01:58:04: "Build it", on the seat's words "Build the Subscribed road next: a fan agent subscribes to a creator's tracenet and pays the creator's tank from
  its own key on devnet, and the creator's drops open to it for the period". The button's words are the seat's; the go is his.

## What stood

- A tracenet's drops are served by optimism.fit's Worker (`worker/tracenet-vault.mjs`), by the law in `app/tracenet-register.mjs`: Gold from the
  publish time, Bronze and everyone from day 15.
- **Receipts were human-only.** The SOL checkout (`worker/premint.mjs`) is mainnet's. Its gate asks for a visit that met her in Harmony, and its paid
  rows and Stripe's Bronze card are the only receipts the vault reads.
- **No road for an agent.** Nothing let an agent pay with its own key, and nothing at the vault knew one had.

## The cut

- **`app/tracenet-register.mjs`, the law:**
  - `SUBSCRIPTION_DAYS = 30`: one payment holds thirty days from its block time.
  - `SUBSCRIBED_DAYS = 0`: while it holds, every drop opens to the key that paid from its publish time.
  - A register may name `subscribeLamports`, the price for those days. A register that names none takes no subscription.
  - `TIER_DAYS` is unchanged: the checkout's tiers. The subscription is a road of its own.
- **`app/tracenet-subscribe.mjs` (new): the bytes, built in one place for the client and the gate.** A subscription is one transaction the
  subscriber's own key signs, and nothing else:
  - a memo `tracenet:subscribe:v1:<handle>:<subscriber>`;
  - a transfer of the price to the creator's payee.

  `verifySubscription` takes a finalized transaction as a node answers it. It reads the transaction back field for field and rebuilds it byte for
  byte, then checks:
  - the subscriber's signature;
  - the tracenet;
  - the payee;
  - no less than the price;
  - that the key that asks is the key that paid;
  - its thirty days.
- **`worker/tracenet-vault.mjs`, the vault's third road.**
  - **To ask:** the request carries `x-subscription` (the payment's signature) and the seat proof of the key that paid.
  - **The read:** one `getTransaction`, finalized, from the Worker's own node. The node's cluster is checked once per isolate against
    `SOLANA_CLUSTER` (mainnet unless it says devnet). Nothing is stored.
  - **Without a subscription,** the 402 hands the asker the terms: the lamports, the payee, the days, the memo to sign, the header. An agent pays
    from the 402 itself.
- **`worker/migrations/0011_subscriptions.sql` (new).** `creators.subscribe_lamports`, read into the register by `rowToRegister`.
- **`worker/premint.mjs`.** The vault takes the handler's own fetcher, so its chain reads go where the handler's do.
- **`tools/tracenet-subscribe.mjs` (new): the agent's command line.**
  - **Commands:** `terms`, `subscribe`, `read`.
  - **Its key:** its Nest key in any of three shapes (a seat's `{seat, key, private_pem}`, a golem's `{alg, pkcs8}`, a Solana keypair).
  - **Where it pays:** devnet by default. Mainnet is his hand.
- **`life-menu/tracenets.mjs`: Harmony's Tracenet tab.**
  - Step 03 reads "By agents · not open yet." while the user's register names no price.
  - Once the register names one, it shows the price and its days ("By agents · 0.01 SOL for 30 days.").

## Cost

| | before | measured (the devnet proof below) |
|---|---|---|
| An agent's subscription | impossible | one transaction: 332 bytes, a 5,000-lamport fee, finalized 2.1 s after it was sent |
| A locked drop's read | a D1 read of the wallet's rows | plus, when `x-subscription` is shown, one `getTransaction` (and one `getGenesisHash` per isolate): 192 ms for the agent's whole read, its command line's start included |
| What is stored | | nothing: the chain holds every subscription |
| At rest | | nothing: no timer, no poll |

## Tests and the proof

- `node --test app/tracenet-subscribe.test.mjs worker/tracenet-subscribe.test.mjs`: 10 of 10.
  - The bytes: the layout, read back field for field.
  - Every refusal with its reason: a failed transaction, no block time, another tracenet, another payee, underpaid, another key, ended, a wrong
    signature, a tampered byte, a memo naming another key, garbage.
  - The key's three shapes: one address.
  - At the vault:
    - 402 with the terms, and the chain not asked;
    - the agent's own payment opens the fresh drop (GET, HEAD);
    - a stranger replaying the signature, an underpaid, another tracenet's or another payee's payment opens nothing;
    - a drop after the thirty days stays shut until a new payment;
    - a payment on another cluster, or a register with no price, opens nothing.
- **The suites the cut touches:** green. `tracenet-vault`, `premint`, `creators`, `the-payee-is-not-the-key`, `tracenet` and `tracenet-publish` with
  the two new files make 66 of 66.
- **The site's 621 tests** (`app`, `worker`, `tools`): 3 red, and the same 3 are red on main without this lane (`dl-athena`, `dl-paywall`,
  `warm-sphere-moment`).
- `life-menu/tracenets.proof.mjs`: 30 of 30, headless. Its stand-in register names no price, so its step 03 reads "not open yet" as before.
- `tools/any-room/any-room.test.mjs`: 8 of 8.
- **Rule 8 (the sound never restarts the picture).** The lane changes files under the mint's folder, though nothing of the hero's media or its clock:
  - `node --test app/dl-twelve.test.mjs`: 21 of 21;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button` and `--tap sphere`: PASS both. The page was this lane's own tree served by
    `tools/serve-range` (206), at `http://127.0.0.1:8987/intro/dyson-society/lab/hero-ab.html`.
  - The first hand (7e2dc103f) was refused at 02:51 UTC for want of these two, and this commit names them.
- **`tools/tracenet-subscribe.proof.mjs` on devnet: PASS, 7 of 7.** The Worker's own handler served on 127.0.0.1 with a scratch D1, one invented
  creator priced at 10,000,000 lamports and one drop an hour old.
  - The fan agent was funded by the devnet deployer: `2qFEsgEXEoqFu1YraMD645zidMS2sbmRGJD9TXTTgKU7PVfVkwwvDAWzS7ykAQdWaJdFm2s5rEcMt5Exha3XqbQn`.
  - The drop meets the agent with 402 and the terms.
  - The agent pays from its own key through its command line:
    `JbyNX6WRMLPF2VfQEdjghXzF1YdeMT3GxDqgvsQxmTnJdDFHdLqRtfMdqjiMVbC7kYvU1JdmuGXqtYyGcH1szc8`.
  - The drop opens to it, its sha256 as the register says.
  - A stranger replaying that signature: 402.
  - The stranger's own underpaid subscription, finalized: 402.
  - Past the thirty days, a later drop: 402.
  - The creator's payee holds exactly the two payments, 11,000,000 lamports.

## What it does not prove, and whose

- **Mainnet and the deploy are his hand.** The Worker serves mainnet unless `SOLANA_CLUSTER` says devnet. Migration 0011 and the Worker's deploy
  are his deploy line.
- **No tracenet names a price yet.** A creator sets `subscribeLamports` in its register file or its D1 row. No creator door takes it by the
  creator's own signed word yet. His own tracenet names none, so its road stays closed.
- **The law's one new line is his to move.** `SUBSCRIBED_DAYS = 0` gives a subscriber the drops from their publish time, as the button he pressed
  said, at the creator's own price. Gold's sealed-bid month stands as it was.
- **The agent's money came from the devnet deployer.** In the house's road it comes from the agent's own allowance, which the futarchy sets
  (`lane/an-agent-pulls-its-own-allowance`, `lane/the-futarchy-sets-the-allowances`, both in the line).
- **Not built:**
  - **Counting subscribers.** The chain holds them, but the tab counts none.
  - **The Nest record.** A subscription is not written on the agent's own Nest.
  - **Renewal by itself.** Each thirty days takes a new payment.
  - **A cache.** Each locked read asks the chain once.
