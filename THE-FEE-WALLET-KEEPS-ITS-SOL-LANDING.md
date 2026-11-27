# THE FEE WALLET KEEPS ITS SOL: the door pays a flask's fee only for its own account, at the door's price, one deposit in flight a flask, never under the wallet's reserve (Nov 20 2026, lane/the-fee-wallet-keeps-its-sol, claude-81203e94)

## His words, UTC

- **Nov 20 ~10:00:** "can you please audit the shit i was doing with solana swarmbook please? the contracts etc? the gvs..."
- **Nov 20 ~10:4x,** to the audit's "Which do I fix first?": "The mint's door".

The audit's record: `ec-workspace/docs/devnet-governance-code-hypertrace-2026-11-02.md`, section 8.5, M1.

## The leak

The door pays the fee of a flask's deposit (THE HOUSE PAYS THE FEE, Nov 11: a flask's address holds USDC and no SOL). It did so for any deposit of
10 USDC or more that a flask signed, at a price a unit the caller named up to the cap, and it kept no memory of a relay in flight.

- Thirty relays of the same 10 USDC, each over its own blockhash, pass the node's simulation together. One lands. The other twenty-nine fail on the
  chain, and a failed transaction still charges its fee's payer.
- If the caller moves the USDC out itself, all thirty fail and it keeps its money.
- At the cap a failed relay cost the fee wallet 610,000 lamports (10,000 for two signatures, 600,000 for 30,000 units at 20,000,000 micro-lamports).
  The wallet holds 0.05 SOL (read on mainnet Nov 20): about 82 of them, minutes from one address.
- After that no flask can deposit, and the house's own pour cannot pay its fee, until he sends SOL. The 600.412645 USDC there could not be taken.

## What stands before the door signs now

`worker/space-router-deposit.mjs`, `relay`. In this order, after the flask's signature is checked:

1. **The account is the flask's own USDC account** by Solana's rule (`ataOf`). No other account of the owner's and no delegate's is paid for.
2. **The price is no more than the door's own**, read at the ask as the watch reads it. A price above it answers 409.
3. **The fee wallet holds its reserve** (`RESERVE`, 0.005 SOL). Under it the door pays no flask's fee (503), so the house's own pour always has its fee.
4. **One deposit in flight a flask.** The flask's row in `sr_relays` (migration 0026) is written before the send and stands for two minutes
   (`RELAY_MS`: a relayed deposit's blockhash lives about a minute, so by then it has landed or never will). While it stands the door sends no other
   deposit for that flask (429). Of two asks at once, one sends.
5. A send the node itself refused took nothing, so its row is given back and the flask asks again at once. A send with no answer may have gone, so
   its row stands.
6. A house whose migration 0026 has not run has no `sr_relays`: the door then sends as before, with 1 to 3 standing.

**What a person meets:** nothing new. The page already sends its flask's own account at the door's price. When the door refuses (a second ask inside
two minutes, a node that could not be read), the USDC stays at the flask's address and the page's watch asks again, as it did before
(`app/dl-kit-deposit.js`, `landed`). No page changed.

## Cost first

| | before | predicted | measured |
|---|---|---|---|
| what one relay asks the node | 1 (the send) | 3 | 3: the price, the wallet, the send (the test reads the stand-in node's asks) |
| what one relay writes | nothing | 1 row | 1 row (and 1 delete when the node refuses the send) |
| at rest | nothing | nothing | nothing |
| the most a failed relay costs the wallet | 610,000 lamports, the caller's price up to the cap | the door's price | 40,000 lamports when the node says no recent fee (10,000 and 30,000 units at the floor) |
| failed relays a flask can cause | as many as it asks (30 a minute an address) | 1 in 2 minutes | 1 in 2 minutes (to the last millisecond, in the test) |
| JavaScript | | no line added | +15 −15, net 0 in 2 files (the gate's own count) |

Not measured: the door's latency on the live Worker (two more reads of its node an ask). It needs the deploy.

## Proof (the new Mac, node v26.13.1, a scratch worktree at 62ab846d23, nice 19)

- `worker/space-router-deposit.test.mjs`: 13 of 13 in 15 s. The relay's test now also tries: an account the flask signed for that is not its own
  (400, nothing sent, the node asked nothing); the same USDC signed again over other blockhashes while the first can still land (429, 429, and 429
  at two minutes less a millisecond; one transaction sent); the next deposit at two minutes (200); a price above the door's own (409) and one within
  it (200); a wallet one lamport under its reserve (503); a send the node refused (422, then 200 at once); a send with no answer (422, then 429); a site
  whose migrations stop before 0026 (200, sent).
- **The same test over main's door fails where it should** (run at 9d731ec3ab): 12 pass, 1 fail. The account that is not the flask's own answered 200 and was sent.
- Every test of the Worker: 150 of 150 in 21 files, 18 s.
- `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs`: green, "this lane's JavaScript +15 -15, net +0 in 2 files".

## Not done, and what is not proven

- **Not live.** The Worker and migration 0026 go out together by his press. A Worker with this code and no `sr_relays` table still takes every
  flask's deposit: the first three stand and the fourth (one in flight) is off until the migration has run. A deploy that forgot it stops nobody.
- **Nothing was tried on a chain.** No transaction was sent on mainnet or devnet, by the old door or the new one. The leak is read from the code and
  from how Solana charges a failed transaction; the cure is proven on the stand-in node only.
- **The leak is narrowed, not gone.** Someone who moves 10 USDC from one new flask to the next can still make the wallet pay one fee a hop, at the
  door's price, 30 asks a minute an address. Each hop now costs them a transaction of their own that must land first, about what it costs the wallet.
  The reserve keeps the house's own pour paid whatever happens. A budget of fee a day is not built.
- The audit's M2 (a spent house token is live again when the node no longer returns its transaction) is not touched.
