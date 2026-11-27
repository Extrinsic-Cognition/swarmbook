-- 0005_gold_bids.sql (Oct 23 2026): THE GOLD MONTH IS A SEALED BID (app/dl-gold-bid.mjs holds the law). gold_bids is the signed log of a month's
-- bids: the commitment (the row's name; one bid one commitment), the bid's own Ed25519 key (bidder), the amount and blinder sealed to the
-- recipient's key (box, which only he opens), the bid's signature over its canonical bytes, and when the Worker took it. Nothing in clear:
-- the Worker never knows an amount. gold_totals is what he posts at a month's close, signed by the recipient's key: the month's lamports, the
-- sum of the blinders (so anyone checks the log's commitments add up to it), the count, and the winners' openings (JSON), which the page
-- checks before it shows them; a winner's paid Gold seat is a premint_orders row of tier gold whose gold_bid names the commitment.
CREATE TABLE IF NOT EXISTS gold_bids (
 commitment TEXT PRIMARY KEY,
 month TEXT NOT NULL,
 bidder TEXT NOT NULL UNIQUE,
 box TEXT NOT NULL,
 signature TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS gold_bids_month ON gold_bids(month, created_at);
CREATE TABLE IF NOT EXISTS gold_totals (
 month TEXT PRIMARY KEY,
 lamports INTEGER NOT NULL,
 blinder TEXT NOT NULL,
 bids INTEGER NOT NULL,
 winners TEXT NOT NULL,
 signature TEXT NOT NULL,
 posted_at INTEGER NOT NULL
);
ALTER TABLE premint_orders ADD COLUMN gold_bid TEXT;
