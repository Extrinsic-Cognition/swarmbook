-- 0016_tracenet_tank.sql · THE FAN PAYS FROM THE TANK (Oct 30 2026, worker/tracenet-tank.mjs). A tracenet's price in dollars, named by its key; and one
-- row per subscription a fan's Space Router tank paid: its own id (the batch pays only for the row it wrote), the tank, the tracenet, what it paid, when,
-- and until when the drops are open to that tank's key. The chain holds the deposit that filled the tank and nothing of these.
CREATE TABLE IF NOT EXISTS tracenet_prices (
  handle TEXT PRIMARY KEY,
  usd REAL NOT NULL CHECK (usd >= 0.5 AND usd <= 10000),
  wallet TEXT NOT NULL,
  set_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS tracenet_access (
  id TEXT PRIMARY KEY,
  tank TEXT NOT NULL,
  handle TEXT NOT NULL,
  usd REAL NOT NULL,
  paid_at INTEGER NOT NULL,
  until INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS tracenet_access_tank ON tracenet_access(tank, handle, until);
CREATE INDEX IF NOT EXISTS tracenet_access_handle ON tracenet_access(handle, paid_at);
