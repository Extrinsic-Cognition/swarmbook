-- 0003_premint_society.sql (Oct 16 2026): THE SOCIETY'S CODES (app/dl-society-codes.mjs). An order carries the paid seat whose referral code it
-- was made with (referred_by: that seat's order id, frozen at the order's making, before any payment). A paid order's ticket holds its referral
-- code (public, 8 letters), the sha256 of its live claim code (12 letters, shown to the buyer once; NULL once redeemed, or never drawn), the
-- sha256 of the long token Harmony took for it, her wallet (holder) once the seat is bound, and when. No code and no token is kept in clear.
ALTER TABLE premint_orders ADD COLUMN referred_by TEXT;
CREATE TABLE IF NOT EXISTS premint_tickets (
 order_id TEXT PRIMARY KEY REFERENCES premint_orders(id),
 code TEXT NOT NULL UNIQUE, made_at INTEGER NOT NULL,
 claim_hash TEXT UNIQUE, claim_made_at INTEGER,
 token_hash TEXT UNIQUE, holder TEXT, claimed_at INTEGER
);
CREATE INDEX IF NOT EXISTS premint_referred ON premint_orders(referred_by, paid_at DESC);
