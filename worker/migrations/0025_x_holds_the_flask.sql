-- 0025_x_holds_the_flask.sql · X HOLDS THE FLASK (Nov 19 2026, worker/space-router-x.mjs; the law: app/space-router-x.mjs). sr_x: one row a flask an X account
-- holds: the flask's address, the X account's id and handle as X said them at the sign-in, the tank its deposits fill (the X account's: the tank of the first flask
-- it held, so a second browser's flask fills the same credits), when, and the flask's signature as the receipt. sr_x_waits: a Harmony's key an X account asked to
-- spend before it held any flask; the flask's sign-in turns it into a grant (sr_grants, payer `x:<id>`).
CREATE TABLE IF NOT EXISTS sr_x (
  address TEXT PRIMARY KEY,
  x_id TEXT NOT NULL,
  handle TEXT NOT NULL,
  tank TEXT NOT NULL,
  bound_at INTEGER NOT NULL,
  signature TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sr_x_id ON sr_x(x_id);
CREATE TABLE IF NOT EXISTS sr_x_waits (
  key_sha256 TEXT PRIMARY KEY,
  x_id TEXT NOT NULL,
  label TEXT NOT NULL,
  asked_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sr_x_waits_id ON sr_x_waits(x_id);
