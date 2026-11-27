-- 0020_the_drops.sql · THE HOUSE HEARS ONCE (Nov 11 2026, worker/space-router-deposit.mjs DROPS_PATH). His words that day, UTC: 08:10:10 "it should be
-- designed to render with lowest latency using webhooks solana txns landing therefore drops of liquors falling at the same time for the devices there";
-- then, over every page reading the chain by itself: "i dont think you realize that there's gonna be a catchup delay". One row per USDC deposit into the
-- treasury that takes a place on the flask (10 USDC or more), in the order the house heard them (n): its signature, its tier (the floating hexagon or the
-- anchored one), what arrived, its block's time (every page lands its drop from this one number) and when the house heard it. Every page reads this one
-- list and never the chain; a newcomer reads it whole.
CREATE TABLE IF NOT EXISTS sr_drops (
  n INTEGER PRIMARY KEY AUTOINCREMENT,
  signature TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'gold')),
  usd REAL NOT NULL,
  at_ms INTEGER NOT NULL,
  slot INTEGER NOT NULL,
  heard_at INTEGER NOT NULL
);
