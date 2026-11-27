-- 0028_one_name_for_her.sql · ONE NAME FOR HER (Nov 22 2026 UTC, worker/space-router-egg.mjs). His words: Oct 16 08:12 "there is only ever 1 lyssajudron for user"; Nov 22
-- 15:17 "this is the fucking delicate point... we need idempotency"; 15:44, over the five stations under one name, "fully support this". One row a person's egg, named by
-- their tank (the flask's own, or the one their X account holds: a second browser with the same X is the same row): the Stripe checkout that stands for it, the first
-- deposit that paid it (her one hexagon; a later deposit is fuel and takes none), the name she was born under when she was made in Harmony first, and when. The eggs
-- paid before this migration take their row here, the first hexagon of each tank.
CREATE TABLE IF NOT EXISTS sr_eggs (
  tank TEXT PRIMARY KEY,
  session TEXT,
  signature TEXT UNIQUE,
  name TEXT,
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sr_x_tank ON sr_x(tank);
INSERT OR IGNORE INTO sr_eggs(tank, signature, at) SELECT p.tank, d.signature, d.heard_at FROM sr_drops AS d JOIN sr_deposits AS p ON p.signature = d.signature ORDER BY d.n;
