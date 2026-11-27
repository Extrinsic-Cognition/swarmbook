-- 0015_space_router_deposits.sql · PAY A TANK (Oct 30 2026, worker/space-router-deposit.mjs; the law: app/space-router-deposit.mjs). One row per USDC
-- deposit the door counted: its signature (the chain's receipt, and why a deposit fills a tank once), its payer, the tank it filled, what arrived and
-- when, and what it did to the tank's key (set, kept, taken by another tank, or none yet).
CREATE TABLE IF NOT EXISTS sr_deposits (
  signature TEXT PRIMARY KEY,
  payer TEXT NOT NULL,
  tank TEXT NOT NULL,
  amount TEXT NOT NULL,
  usd REAL NOT NULL,
  mint TEXT NOT NULL,
  cluster TEXT NOT NULL CHECK (cluster IN ('mainnet', 'devnet')),
  slot INTEGER NOT NULL,
  paid_at INTEGER NOT NULL,
  credited_at INTEGER NOT NULL,
  keyed TEXT NOT NULL CHECK (keyed IN ('set', 'kept', 'taken', 'none'))
);
CREATE INDEX IF NOT EXISTS sr_deposits_payer ON sr_deposits(payer, paid_at);
