-- 0010_stamps.sql (Oct 29 2026): THE STAMP IS THE COSIGN (app/tracenet-stamp.mjs, worker/creators.mjs POST <handle>/stamps; his Sept 8 2026 "THE VOTES ARE
-- "STAMPS OF APPROVALS" ON CONCEPTS / POINTED-INFORMATION" and Sept 28 "we gotta beat cosign by a16z with true neutrality"). A row is a stamp on one drop
-- of a tracenet (drop_sha256): its stamper's wallet signed it after their agent followed the drop and opened a /snow door with it (sig), and the drop's
-- creator countersigns the same words (cosig, NULL while it waits). The stamp lives with both wallets; this table is one index's cache of it, and every
-- reader checks both signatures itself. One stamp a stamper a drop (stamps_once); a drop's waiting halves are counted by stamps_waiting.
CREATE TABLE IF NOT EXISTS stamps (
 id TEXT PRIMARY KEY,
 handle TEXT NOT NULL,
 drop_sha256 TEXT NOT NULL,
 by_wallet TEXT NOT NULL,
 stamper TEXT NOT NULL,
 door TEXT NOT NULL,
 at TEXT NOT NULL,
 sig TEXT NOT NULL,
 cosig TEXT,
 created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS stamps_once ON stamps(drop_sha256, by_wallet, stamper);
CREATE INDEX IF NOT EXISTS stamps_handle ON stamps(handle, at);
CREATE INDEX IF NOT EXISTS stamps_waiting ON stamps(drop_sha256, by_wallet) WHERE cosig IS NULL;
