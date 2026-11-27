# A STAKE PAYS ITS TANK: a staker links a stake to their own Space Router tank with the stake's withdraw key, and the crank pours its rewards there (Oct 30 2026)

`lane/a-stake-pays-its-tank`, by claude-9a126af2. Every time is UTC.

## His words

- **The press.** Oct 30 ~12:4x: "Pay a tank", on the seat's button "First the road to pay a tank: a buyer's USDC fills their own Space Router tank (the paused
  $30 starter kit)". The button's words are the seat's.
- **The premise had moved.** That premise was stale: since 09:41 (THE STAKE IS WHO BELIEVES IN SPACE ROUTER, deployed 09:55) the kit pays a tank with the
  stake's rewards, at his Oct 29 18:01: "i think we should make it a staking thing so we get staking yield an use that as inference credits, so basically SOL
  inflation pays for inference". This lane follows the staking road.
- **The road's own list.** `tools/embertide-mesh/pool/SOL-INFLATION-PAYS-FOR-INFERENCE-LANDING.md`, "Not built", opens with "a staker's signed link".
  `plans/the-fuel-by-staking-hypertrace-2026-10-26.md`, brick 2: "A staker links a stake account to a tank by signing with its withdraw authority".
- **Handed over.** The staking seat (claude-61e371e5, STAKE4INFERENCE) handed this piece over at 12:5x: "Take the signed link, crank.mjs reading links, and
  the devnet proof". Its terms bind the lane:
  - devnet first;
  - the pool's manager is his key, and no seat signs as him;
  - refills and the ClawRiders' tank are his hand;
  - credits go only to vetted proof-of-skill;
  - the D1 migration and the deploy are his to run;
  - the tank's key is handed back once and only its hash is kept.

## What stood

- **Links by hand only.** The epoch crank (`pool/crank.mjs`, Oct 29) turned each linked stake's reward into a refill row, but a link was his hand on the Mac
  (`stakes.json`), and its refills went to the Mac's tanks.
- **Tanks by hand only.** Space Router's public door (`worker/space-router.mjs`) served tanks at the site's edge that only his hand made and poured
  (`tools/space-router-tank.mjs`).
- **No road for a stranger.** Nothing let a stranger's stake feed a tank.

## The cut

- **`worker/space-router-link.mjs` (new): POST `/space-router/v1/link` `{ proof }`.**
  - **The proof** is a Sign In With Solana text and its Ed25519 signature, in the seat proof's travelling shape. The text names:
    - this site (domain and URI);
    - the stake's withdraw authority, which signs;
    - the stake account, in its statement ("Link stake account … to your Swarmy's tank on Space Router. This sends no transaction and moves no funds.");
    - the cluster, as its Chain ID;
    - a nonce, and its issue and expiry, ten minutes apart at most.
  - **The door's checks:**
    - the text byte for byte, its times and its signature;
    - one `getAccountInfo` on the Worker's node, finalized and parsed. The node's cluster is checked against `SOLANA_CLUSTER` by its genesis. The account
      must be the stake program's, and its withdrawer the signer.
  - **The link** is one row of `sr_links`: the stake, its authority, the tank, the cluster, the signed time and the signature as its receipt. A link signed
    before the one standing is refused (409).
  - **THE TANK is the authority's own:** `st-` and 12 hex of its address's sha256.
    - Its first link makes it, with a fresh key (`sr_…`). The key is handed back in that one answer and kept only as its sha256: never logged, never kept.
    - A later link answers the tank and no key.
    - The statement "… and give the tank a new key" replaces the key's hash and hands the new key back once.
  - **Refusals:** 401 for a proof that is not fresh, not this site's or not signed by the authority; 400 for another cluster; 403 when the signer is not the
    withdrawer; 422 for no stake account; 503 for a node of another cluster.
- **`worker/migrations/0014_space_router_links.sql` (new).** The `sr_links` table.
- **`worker/premint.mjs`.** One dispatch line, before Space Router's doors. `/space-router/*` already runs the Worker first.
- **`tools/embertide-mesh/pool/pool-crank.mjs`: `runEdgeEpoch`, `keysOfWhys`.** The same epoch, rows and keys over the edge's store, through a d1 of four
  calls: links by cluster, written whys, standing tanks, refill.
  - It writes only with `write`, and only into tanks that stand, all or nothing.
  - **`crank.mjs epoch --edge [--local] [--cluster devnet]`** reads the site's D1 through wrangler, as `space-router-tank.mjs` does. Dry, it prints each row
    with the SQL `--write` would run; written, it is his hand.
- **No change under the mint's `app/`.** Rule 8 does not apply; the law files are only imported.

## Cost

| | before | measured |
|---|---|---|
| A stranger's stake feeding a tank | impossible: a link was his hand on the Mac | one signed link: one chain read, three D1 statements; 178 ms on devnet, the chain read included |
| A staker's tank | made by his hand | made by the staker's first link; its key shown once, only its hash kept |
| An epoch at the edge | | one `getInflationReward` for every linked stake, three reads through wrangler; written only by his hand |
| At rest | | nothing: no timer, no poll |

## Tests and the proof

- **`worker/space-router-link.test.mjs`: 4 of 4.**
  - The proof read back byte for byte. Refused: another site, expired, beyond the skew, a window over ten minutes, a forged signature.
  - The withdrawer read from the node's answer, and nothing else.
  - The tank made once, its key handed back once and found nowhere in D1. A second link gives no key; a new key shuts out the old one. A second stake of the
    same authority feeds the same tank.
  - Every refusal with its reason.
- **`pool/pool-crank.test.mjs`: 11 of 11.** The new edge epoch:
  - links read by cluster;
  - the same rows and keys;
  - written only with `write`;
  - a key never written twice;
  - a missing tank refuses the whole run.
- **The suites the lane touches:** the Worker's, the site tools', the pool's and `any-room`, 219 of 220 (one skipped), 0 red.
- **`tools/space-router-link.proof.mjs` on devnet: PASS, 11 of 11.**
  - **The stage:** the Worker's own handler on 127.0.0.1 over a scratch D1 with every migration, its node devnet.
  - **The stake:** an invented staker, funded by the devnet deployer, made its own stake account (CreateAccount and Initialize, the staker its withdraw
    authority), finalized in 1.9 s.
  - **The link:**
    - it made the staker's tank, `st-da2fd936fe08`, and handed its key back once;
    - the key opened that tank at Space Router's own `/tank` door ($0 of fuel), and is nowhere in D1;
    - a second link gave no key;
    - a new key shut the old one out (401) and opened (200).
  - **The refusals:** a stranger's link of the same stake got 403, and a link of the staker's wallet 422.
  - **The crank:** its edge epoch read the link on devnet's own rewards for epoch 1195: one stake, no row (a stake made this epoch earns none).
  - **A stand-in reward** of 1 SOL at $150, written as his hand writes it, gave the tank $150 of fuel at the door. The same epoch was never poured twice.

## What it does not do, and whose

- **The kit's "Stake your SOL" button** lives in `app/warm.html`'s offer, held by the $WARM & Space Router seat (claude-1a67b2d3). Wiring it to this door (the
  wallet signs the link text) is that seat's, asked first.
- **Mainnet.**
  - **His to run:** migration 0014 and the deploy.
  - **The crank's `--edge --write`:** his hand, at his price for SOL.
  - **The stake pool itself and its manager:** his key, devnet first.
- **Not here:**
  - the ClawRiders' tank and its pours (his hand, behind the vetting);
  - a staker's choice to allocate at the edge: the toggle stays the Nest's `pool/toggles`, and an edge tank it does not name accumulates.
- **A lost key** is answered by a new one: the staker signs the new-key statement. There is no other recovery, by design: the key is never kept.
