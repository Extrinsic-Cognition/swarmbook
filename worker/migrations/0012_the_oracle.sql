-- 0012_the_oracle.sql · THE ROUTER IS THE ORACLE (Oct 30 2026, worker/space-router.mjs; the law: app/space-router-oracle.mjs). Every burned call's receipt,
-- signed with the router's key: the canonical signed receipt as the caller got it (the sha256 of what was asked and of what the provider answered, the
-- models, the provider, the instant, the tank, the cost), never the words; its leaf hash names it. A period is a UTC hour; its seal is its Merkle root over
-- the period's receipts up to last_id, written once when the hour is five minutes over and never changed.
CREATE TABLE IF NOT EXISTS sr_receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  period INTEGER NOT NULL,
  at INTEGER NOT NULL,
  tank TEXT NOT NULL,
  leaf TEXT NOT NULL UNIQUE,
  body TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sr_receipts_period ON sr_receipts(period, id);
CREATE TABLE IF NOT EXISTS sr_seals (
  period INTEGER PRIMARY KEY,
  n INTEGER NOT NULL,
  root TEXT NOT NULL,
  last_id INTEGER NOT NULL,
  sealed_at INTEGER NOT NULL
);
