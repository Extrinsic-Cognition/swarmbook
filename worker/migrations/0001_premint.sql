CREATE TABLE IF NOT EXISTS premint_orders (
 id TEXT PRIMARY KEY, tier TEXT NOT NULL CHECK(tier IN ('bronze','gold')),
 buyer TEXT NOT NULL, recipient TEXT NOT NULL, lamports TEXT NOT NULL,
 sol_usd TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL,
 blockhash TEXT NOT NULL, last_valid_block_height INTEGER NOT NULL,
 terms_version TEXT NOT NULL, github TEXT NOT NULL, handle TEXT, avatar_url TEXT,
 signature TEXT UNIQUE, status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','submitted','paid','failed','expired')),
 paid_slot INTEGER, paid_at INTEGER
);
CREATE INDEX IF NOT EXISTS premint_buyer ON premint_orders(buyer, created_at DESC);
CREATE INDEX IF NOT EXISTS premint_paid ON premint_orders(status, paid_at DESC);
