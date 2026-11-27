# A RIDER STEERS

Lane `lane/a-rider-steers`, Nov 22 2026 UTC, cut from main 8eac00c2eb (stop 8 on main). Seat claude-99332308 cut it, the Claude app quit at 22:57,
and seat claude-1c24847b built it. His word: 22:52:17 UTC "Yes, build it", given to "Build steering next, so a seated rider votes from the page?". The ask
comes from his 13:34 "ride and steer" (ec-workspace `docs/posiverses-and-neghiverses-hypertrace-2026-10-30.md`, its Nov 22 13:34 section).

## What was wrong

A rider holding a hexagon of a swarm saw a vote in session on the society page (`app/polis.html`) but had no buttons to answer it. Yes, no and abstain
were drawn only while `bodyIn()` held: the society's own host had to be in the room over its websocket, and that host then carried the vote. A rider
reached the page through the flask that minted their hexagon, so they had a seat but no host, and the vote went uncast.

The chain asks for no host. `attest` (`poleis/program/poleis_treasury/src/ix/proposal.rs`) takes any signer as the crank. The vote is the holder's
ed25519 signature over `voteEnvelope(hash, unit, choice)`, checked by the precompile in the instruction just before it.

## What it does now (`app/polis.js`)

- The buttons stand for every key that holds a seat or a chair in a session that is open, whether or not a host is in.
- A press signs the envelope with the key that holds the seat. That is the rider's flask key in the browser that minted them (`riderOf`, never
  exported), or else a wallet, or else the browser's own key.
- With a host in, the host carries the vote as before. With none, the page sends `[ed25519 precompile, attest]` (`P.attestBatch`) itself, the same
  key paying the fee (`ensureLamports`, then `sendMine`).
- The chain counts a key's voice once. Once it has counted one, "You said yes|no|abstain" stands in the buttons' place.

## Proof (the lane's own page, on a practice chain on this Mac; nothing left 127.0.0.1)

- The chain: `solana-test-validator` 4.2.0 on 127.0.0.1:23210, running devnet's own Poleis program
  (`AJdsmjxQjHnBxDEdRxwEk2UMRW7bgNmvEMUwMziRTyab`, its bytes dumped read-only from devnet, sha256 `92f3bcf2…8406`). The 3.0.13 release here
  refuses that program's `init_config` ("insufficient funds for rent"), so 4.2.0 it is.
- The practice society: 11 founders in the chairs, and a genesis sale that seated a rider (1 hexagon) and another holder (2). Then one decision was
  proposed, the swarm's name.
- The page is `polis.html?civ=0&program=…&rpc=http://127.0.0.1:23210`, served from the worktree by `tools/serve-range`, in a headless Chrome off every
  screen. The rider's key went into the browser's flask store (`dl-flask`) as a non-extractable Ed25519 key, just as the mint keeps it. Then a trusted
  press on yes.

| | wide 1440x900 | phone 390x844 |
|---|---|---|
| the page said | "the vote landed · 3K6jpq3cuQWG…" | "the vote landed · 2SV2HEzJURsS…" |
| press to landed | 141 ms | 375 ms |
| the session on chain | the rider's voice PRO, hexPro 1, votes 1 | the same |
| fee payer | the rider's key | the rider's key |
| fee | 10,000 lamports (2 signatures: the transaction's, the vote's) | 10,000 |
| compute | 5,500 CU | 5,500 CU |
| transaction size | 580 bytes | 580 bytes |
| page errors | none | none |

Cost, as predicted before the build: one transaction per vote, paid by the voter, with no host and no new door. Measured: the numbers above. Nothing
runs at rest, and the page draws nothing new until a press.

## Gates (this worktree, nice 19)

- `app/polis-knock.test.mjs` + `riders.test.mjs` + `after-the-mint.test.mjs` + `dl-mint-hexagon.test.mjs`: 31 pass, 0 fail. The new assertions (in "the
  page carries every part…") go red when the buttons wait for the host again, and red when the page's attest names another crank than the voter.
- The JavaScript only shrinks: net 0 (polis.js +6 −7, the test +3 −2, polis.html +2 −2). The look is a law, no page of its own, the pixel is a lookup,
  the room stands bare, the holy water, any room: all green. The classical-signature census adds no line (1157 against 1159).
- No landing adds a failing screen: 24 cells judged, 0 new failing. The society page with a vote open is behind a chain, so no screen of the manifest
  reaches it; the two films are its screens.

## Not done

- Live only after his publish. The proof stood on a practice chain. No real vote has been cast.
- On a cluster where the rider's flask holds no SOL, the press says how much to send to which key. Nothing pays the fee for the rider (a sponsor would be
  another lane).
- The ball's gold rim on the rider's hexagon follows the session's voices as before (`riders.mjs`). It was not filmed apart from the page's bars.
