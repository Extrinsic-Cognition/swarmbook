-- 0011_space_router.sql · SPACE ROUTER'S PUBLIC DOOR (Oct 30 2026, worker/space-router.mjs; the law: app/space-router-law.mjs). The purse door's tanks
-- (tools/embertide-mesh/lib/space-tanks.mjs) at the site's edge. A tank is a name, its key's sha256 (never the key) and its markup; its sums are kept on
-- its row so a call reads one row. Every pour and every drink is a ledger row: the receipt, never a prompt. A call in flight is a hold row until it burns.
CREATE TABLE IF NOT EXISTS sr_tanks (
  name TEXT PRIMARY KEY,
  key_sha256 TEXT NOT NULL UNIQUE,
  markup_bps INTEGER NOT NULL DEFAULT 500,
  poured_usd REAL NOT NULL DEFAULT 0,
  drunk_usd REAL NOT NULL DEFAULT 0,
  router_usd REAL NOT NULL DEFAULT 0,
  calls INTEGER NOT NULL DEFAULT 0,
  warm REAL NOT NULL DEFAULT 0,
  made_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sr_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at INTEGER NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('refill', 'burn')),
  tank TEXT NOT NULL,
  usd REAL NOT NULL,
  router_usd REAL,
  markup_bps INTEGER,
  warm REAL,
  model TEXT,
  tokens_in INTEGER,
  tokens_out INTEGER,
  ms INTEGER,
  estimated INTEGER,
  why TEXT
);
CREATE INDEX IF NOT EXISTS sr_ledger_tank ON sr_ledger(tank, id);
CREATE TABLE IF NOT EXISTS sr_holds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tank TEXT NOT NULL,
  usd REAL NOT NULL,
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sr_holds_tank ON sr_holds(tank, at);
-- THE MINE: what every burn has mined, and the last burn's share (the burn's batch reads it); capped by SPACE_ROUTER_MINE_WARM when he names it
CREATE TABLE IF NOT EXISTS sr_mine (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  owed REAL NOT NULL DEFAULT 0,
  last REAL NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO sr_mine(id) VALUES (1);
