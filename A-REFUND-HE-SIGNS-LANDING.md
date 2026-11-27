# A REFUND HE SIGNS (Oct 28 2026, claude-0f7e9ef2)

His words, WET: 14:23 "wtf? if someone foudn it it could mint now? u kidding me? are we prepared for that?"; 14:28 "dude... we need a way to make
this safe come on... we cant be out there like this unprepared rushing... what is needed?". Then his go by the next-step box: pause the mint and
start the safety list. This is the refund half of S4 in `plans/the-marketing-plan-2026-10-28.md` ("The mint waits until it is safe").

## What it is

`tools/premint-refund.mjs <order-id>` reads one order (the Worker's D1, `wrangler d1 execute --remote`, one read-only SELECT; or `--orders <file>`),
checks on chain that its payment moved exactly its lamports from its buyer to its payee in a transaction that did not fail, and writes a Solana Pay
transfer request back to the buyer for the same lamports: `solana:<buyer>?amount=…&reference=…&label=optimism.fit&message=Refund of order <id>
&memo=optimism.fit:refund:v1:<id>`, as a QR and a small page in `~/.embertide/premint-refunds/` (never in git), with a log line. He scans it with
the wallet that was paid and approves it there: no seat holds a key, signs or moves money. The reference (sha256 of the memo, as an account key)
finds the refund on chain: `--check` says whether the order was refunded, and a second request for a refunded order is refused.

## The numbers

- `tools/premint-refund.test.mjs`, 5 tests, all pass: the amount to the lamport (59000000 → "0.059"), the request's fields, refusals (not paid, no
  signature, an id that is not a plain word), the payment read off a parsed transaction (a lamport short, the other way, a failed transaction: no),
  a refund found by its reference, the QR drawn by the house's `qrcode-generator.js`.
- Live, Oct 28 about 14:4x: an invented paid order against mainnet was refused ("the chain does not show 0.059 SOL … nothing written"); `--check`
  said "not refunded yet"; the order book read from the old Mac held 2 orders, both open (quotes never paid), 0 paid. This Mac's wrangler login
  answers D1 with 7403 (not authorized for the account), and the tool now says to run it on the old Mac.

## Left

Payment alerts (the other half of S4) need his channel. The payee only he holds (S1), the terms with refunds (S2), the offer that promises only what
ships (S3), and one real test purchase with a refund (S5) are his or wait on his.
