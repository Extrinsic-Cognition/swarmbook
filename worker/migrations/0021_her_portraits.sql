-- 0021_her_portraits.sql · HER PORTRAIT'S PASS, AND EVERYONE'S FACES (Nov 11 2026, worker/space-router-portrait.mjs). Both tables are keyed by the
-- signature of a deposit the house has heard (sr_drops, migration 0020): a face is its deposit's.
-- One row per pass the door gave a deposit for a Reactor session; the door counts a deposit's rows against its limit.
CREATE TABLE IF NOT EXISTS sr_portraits (
  signature TEXT NOT NULL,
  made_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sr_portraits_signature ON sr_portraits(signature, made_at);
-- A hexagon's face: her six colours as its depositor last gave them (the door bounds how often), and its painting's name in the bucket
-- (portraits/<picture>.jpg, the last one kept) with how many it has kept.
CREATE TABLE IF NOT EXISTS sr_hexagons (
  signature TEXT PRIMARY KEY,
  colours TEXT NOT NULL,
  set_at INTEGER NOT NULL,
  sets INTEGER NOT NULL DEFAULT 1,
  picture TEXT,
  pictures INTEGER NOT NULL DEFAULT 0
);
