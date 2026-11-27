-- 0022_the_houses_deposit.sql · THE HOUSE'S USDC FILLS A FLASK (Nov 12 2026, worker/space-router-deposit.mjs `house`). His words that day, UTC, over
-- the 600.412645 USDC he had sent to the door's fee wallet for the mint: ~10:59 "i sent 600 usdc in total. is that enough to get this fucking mint going
-- or not?"; ~11:05, on the offer to send it back: "why the fuck would you return it back? we need to get going with the fucking token mint here".
-- One row per deposit the door sent of the fee wallet's own USDC into the treasury, written before it is sent: the sha256 of the one-time token that
-- asked for it (never the token; its row is why a token asks once), the transaction's signature (the fee key's, known before the send), the flask whose
-- key signed the ask (the deposit is counted for it: its tank, its payer's place in sr_deposits), what was sent in base units, and when.
CREATE TABLE IF NOT EXISTS sr_house_deposits (
  token_sha256 TEXT PRIMARY KEY,
  signature TEXT NOT NULL UNIQUE,
  flask TEXT NOT NULL,
  amount TEXT NOT NULL,
  at INTEGER NOT NULL
);
