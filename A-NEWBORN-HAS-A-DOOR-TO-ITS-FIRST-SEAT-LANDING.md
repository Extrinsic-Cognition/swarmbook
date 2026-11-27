# A NEWBORN HAS A DOOR TO ITS FIRST SEAT (Nov 24 2026, lane/a-newborn-has-a-door-to-its-first-seat)

## His words, UTC

- **15:26:58** "the wish evolves into a neghiverse issuiing hexagons * hexagons aare rights to use the product idk dude".
- **15:51:59** "it is not meant to be hardcoded".
- **17:03:50** "build all and ship to prod", over three drafts (draft 3, left frame: the door reads "Bid for its first seat", "a sealed bid, then
  reveal, then claim · nothing can be decided until one seat is taken"; ec-workspace
  `docs/swarmbook-is-the-wishs-road-2026-11-24/the-gaps-drafted.jpg`, section 25.15 of the swarmbook hypertrace).

What it mends: finding 1 of `poleis/ceremony/A-WISH-IS-PLAYED-LANDING.md`. A newborn swarm is frozen until one seat is taken at its birth, and its page
had no door for that seat.

## Cost first

| | before | after |
|---|---|---|
| the newborn's page | no door; the first seat only through the walker or `found.js` | one door under the ball, where the knock stands, that follows the genesis sale's own state |
| transactions per press | | 1 each: bid (`commit_seat_bid`), reveal (`reveal_seat_bid`), settle (`settle_seats`), claim (`claim_seat`), ratify (`ratify_genesis`); on localnet and devnet an airdrop before it when the key is short |
| reads | | none new: the sale (sale 0), the config and the registry were already read by `tree.js` and its subscription; the door is drawn again only when what it says changes (`doorSaid`) |
| `polis.js` | 710 lines, 64,826 bytes | 715 lines, 67,059 bytes |
| `polis-knock.mjs` | 24 lines, 4,089 bytes | 29 lines, 6,277 bytes |
| `polis-knock.test.mjs` | 44 lines, 7,745 bytes | 49 lines, 10,315 bytes |
| `polis.css` | 48 lines, 20,700 bytes | 50 lines, 21,004 bytes (one rule: the bid's field in the door's own size, `var(--panel)`, `var(--line)`, `var(--words)`) |
| `polis.html` | 15 lines | 15 lines (the two cache words moved) |
| JavaScript, this lane | | +24 -9, **net +15** (polis.js +10 -5, polis-knock.mjs +5 -0, polis-knock.test.mjs +7 -2, polis.html +2 -2); one dead line taken out (`originS` in `renderOpen`). Over THE JAVASCRIPT ONLY SHRINKS: it needs his pass |
| Rust | | `poleis/seal/examples/wish.rs` +4 -1: `WISH_WINDOW_SLOTS` sets both windows of the first sale |
| shell | | `poleis/ceremony/a-wish-is-played.sh`: `WISH_STEPS` (e.g. `start`) stops the play right after the birth |

## What the door reads from the chain, at every tick (polis-knock.mjs `firstSeatOf`, pure)

Nothing is named by the page: the door is a function of the genesis sale account (`commitEnd`, `revealEnd`, `reserve`, `deposit`, `settled`,
`clearing`, `board`), the config's mode (GENESIS until ratified), the root registry's `totalSeats` and whether this key holds a seat, the clock's slot,
and whether this browser holds a sealed bid.

| the chain holds | the door | the line under it |
|---|---|---|
| config not GENESIS (ratified), no sale, no clock | none: the page is as it was (the knock, "Your seat") | |
| slot < commitEnd, no bid in this browser | the price field (reserve to deposit) and "Bid for its first seat" | "a sealed bid, then reveal, then claim · reserve, deposit · bids close at slot N, about HH:MM UTC" |
| slot < commitEnd, a bid held | none | "Your bid is sealed · its reveal opens at slot N" |
| commitEnd <= slot < revealEnd | "Reveal your bid" (a bid held, not yet on the board) | "Your bid is revealed" / "The reveal window is open" · the reveals close at slot N |
| slot >= revealEnd, not settled | "Settle the sale" (anyone) | "The reveals closed at slot N · anyone may settle the sale" |
| settled, this key on the board, no seat held | "Claim your seat" | "Your bid won · the seat costs <clearing> SOL, the rest of the deposit comes home" |
| settled, a seat taken | "Ratify the founding" (anyone) | "1 seat taken · anyone may ratify the founding" |
| settled, no seat taken, not won | none | "Its winners have yet to claim a seat", or "Nothing was revealed: it can never be founded" |

Under every door with no seat taken: "nothing can be decided until one seat is taken".

The sealed bid: a random 32-byte salt and the price are written to this browser's seat store (`localStorage`, `poleis-seat-<program>-bids`, beside
the browser key's own `poleis-seat-<program>`) before the bid is sent, so the same browser reveals it; the commitment is `P.seatCommitment`, the
program's `sha256(price ‖ nonce ‖ salt ‖ bidder)` (sale.rs `reveal_seat_bid`). It signs with whatever key the page speaks with (a wallet, the flask,
the browser key), through the page's own `sendMine`.

## Tests

- `node --test polis-knock.test.mjs polis-rite.test.mjs after-the-mint.test.mjs dl-mint-hexagon.test.mjs riders.test.mjs` (cwd
  `embertide-app/ui/intro/dyson-society/app`): 42 of 42. The new test: every door of the table above off a made-up sale, and the page's commitment equal
  to the program's formula computed by node's own sha256.
- `node --test tools/embertide-mesh/tests/the-law-is-the-gate.test.mjs`: 8 of 8.
- `cargo test --offline` in `poleis/seal` (nice 19): law.rs 6 of 6; `cargo build --offline --example wish`: 0 warnings.

## The proof, on a practice chain (never devnet or mainnet)

`WISH_STEPS=start WISH_WINDOW_SLOTS=300 WISH_HOLD=900 WISH_SITE_PORT=31180 sh poleis/ceremony/a-wish-is-played.sh` (a validator of this machine, the
tree's own Poleis, the tree's own pages served on loopback): the wish started (2 transactions, 0 failed), held right after its birth. A scratch driver
on the house's `tools/house-mirror/spool/board/pw-cdp.mjs` (headless, off every screen, 1440x1400; not added to the tree) opened
`polis.html?civ=<root>&program=<id>&rpc=http://127.0.0.1:31000` with a fresh browser key in the page's seat store and pressed the door through:

| state | the page said | read back from the chain |
|---|---|---|
| birth | "Bid for its first seat", reserve 0.001, deposit 0.005, bids close at slot 311 | slot 60, sale not settled, 0 revealed, config mode 1 (GENESIS) |
| bid 0.003 SOL | "Your bid is sealed · its reveal opens at slot 311"; the seat store holds the bid under `<root>|<key>` | |
| reveal window | "Reveal your bid" | |
| revealed | "Your bid is revealed · the reveals close at slot 611" | 1 revealed |
| reveal window closed | "Settle the sale" | |
| settled | "Claim your seat" · the seat costs 0.001 SOL | settled, clearing 1,000,000 lamports (the reserve: the board was not full) |
| claimed | "Ratify the founding" · 1 seat taken | |
| ratified | the door gives way to the page as it was: "Your seat" | config mode 2 (COUNCIL); the walker's `said`: ratified true, hexagons 1 of 20, treasury 1,000,000 lamports |

0 page errors. Everything ended: the validator, the server, the ledger and the stand-in keys (the script's own cleanup).

## What I could not verify

- The words "The reveal window is open" (shown while the reveals run and this browser has not revealed) were changed after the proof; the still of that
  state shows the earlier words "The bids are revealed". The unit test covers the new words' door, not the sentence.
- A wallet (Phantom and others) and the flask were not driven: only the browser key. A browser with no storage refuses the bid before it is sent.
- The time of day beside each slot is the page's 400 ms a slot; on the practice chain slots ran near 640 ms, so "about 17:20" came at 17:21.
- Not run: the screens gate (`no-landing-adds-a-failing-screen.sh`) and the look gate on this lane's commit (the integrator's).

## The gate

No gate yet: the measure it waits for is `sh poleis/ceremony/a-wish-is-played.sh` run with `WISH_STEPS=start` and a driver of the page's door that ends
with the config in COUNCIL mode and 0 page errors, run at the ship. The pure half is held by `polis-knock.test.mjs` on every lane that touches the page.

## THE FIRST SEAT SAYS ONLY WHEN (Nov 24 2026 ~21:1x UTC, claude-3f06fe2b)

Under "Bid for its first seat" the page said "a sealed bid, then reveal, then claim · 0.001 SOL reserve, 0.005 SOL held as its deposit · bids close at
slot 311, about 17:20 UTC": the program's steps and a slot number, a builder's words on his screen (his Oct 29 2026 rule, only words he acts on). Now it
says "Bids close about 17:20 UTC"; the input still holds the reserve and the deposit as its bounds, and every later line of the door says its time the
same way ("about HH:MM UTC", no slot). Cost: three lines changed in place (polis-knock.mjs, polis.js, the test), no net line of JavaScript, no frame, no request.

Run on this lane's tree: `node --test app/polis-knock.test.mjs app/dl-twelve.test.mjs` (27 of 27); rule 8, served by tools/serve-range (206),
`node app/dl-twelve.proof.mjs --url <served>/embertide-app/ui/intro/dyson-society/app/warm.html --tap button` and `--tap sphere`, both PASS.
