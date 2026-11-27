# THE PAYEE IS NOT THE KEY (Oct 28 2026, claude-0f7e9ef2)

S1 of `plans/the-marketing-plan-2026-10-28.md` ("The mint waits until it is safe"): a payee only he holds. His pick, Oct 28 about 14:5x WET by the
plan's next-step box: a Squads multisig on Solana of his three Keystone devices, two of three to approve any payout. Asked first (14:5x, his words): "i
have 3 keystone devices, can we setup a multisig or something?".

## Why a split first

The mint's payee, `RECIPIENT` (3nJn2…KMba, the devnet deployer's plain-file key on both Macs), was also the creator's key: Gold bids are sealed to its
X25519 twin (`app/dl-gold-bid.mjs`), the Gold month's total is signed by it (`worker/gold.mjs`), and the first tracenet's drops are signed by it. A
multisig vault is a program-derived address: it can receive SOL, but it can neither open a sealed bid nor sign. So the address seats pay is now apart
from the key.

## What changed (no behaviour changes today: PAYEE equals RECIPIENT)

- `app/dl-direct-protocol.mjs`: `PAYEE`, where the first tracenet's seats pay; `buyerAddress` refuses it as it refuses RECIPIENT.
- Seats pay PAYEE: `app/dl-direct.js` (the first tracenet's pinned recipient), `app/dl-paywall.js` (a paid receipt is to PAYEE), `app/dl-mint-ledger.js`
  (the chain read of seats), `app/dl-mint-pour.js` (the live pour's subscription), `app/tracenet.js` (the payee shown), `worker/premint.mjs` (the tank's
  and the holders' counts).
- A register may name `payee` apart from `wallet` (`app/tracenet-register.mjs`); `worker/creators.mjs` `payeeOf` = payee, else wallet; `keyOf` = wallet;
  the first tracenet's payee is PAYEE when it differs from its key. `worker/gold.mjs` seals to and checks with `keyOf`, never a payee.
- RECIPIENT stays where it is the key: `app/dl-gold-bid.mjs`, `app/dl-gold-bid.js`, the first tracenet's wallet.

The switch, once the vault exists: `PAYEE = '<the vault's deposit address>'` in `app/dl-direct-protocol.mjs`, a lane with the rule-8 proof, his deploy.

## The numbers

- `worker/the-payee-is-not-the-key.test.mjs`, 3 tests pass: a register's key and payee read apart (an invalid payee dropped, none reads as before); the
  first tracenet's key RECIPIENT and payee PAYEE, its register unchanged while they are equal; a creator whose payee is a vault: availability names the
  vault, the Gold pot names the key.
- Every test in `app/` and `worker/` on main (4b7249162) and on the lane, this Mac at nice 10: 50 and 51 pass, the same 4 files fail on each with the same
  failing subtests (dl-athena 1, dl-glass 4, dl-paywall 1, warm-sphere-moment 1): main's own, no new red.
- Rule 8: `dl-twelve.proof.mjs` (the law of `dl-twelve.test.mjs`) on the lane's `warm.html` with `--tap sphere`: PASS. `warm.html` and `tracenet.html`
  load headless with no script error.
