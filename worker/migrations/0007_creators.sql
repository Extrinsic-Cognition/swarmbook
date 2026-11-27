-- 0007_creators.sql (Oct 23 2026): TRACENET IS FOR EVERY CREATOR (his "i dont wanna do one thing for me only, it has to be for more creators to come
-- and do the same"; worker/creators.mjs). A creator is a row: the handle (the X handle, optimism.fit/<handle>), who (name, line, X, avatar), the
-- PAYEE (wallet: the Solana address every SOL seat for this tracenet pays and every Gold bid is sealed to; stripe_account: the Connect account
-- every card subscription is paid out to; stripe_price: the creator's monthly Bronze price on the platform; bronze_cents: its amount), and
-- whether Stripe has enabled charges on the account (onboarded). The first creator's register stays the asset file in git (app/tracenet/
-- photons_enjoyor.json): a handle with no row here reads from the assets, so nothing of his moves.
-- drops: a creator's register in D1 (the asset registers are the same shape), the bytes in R2 under vault/<handle>/<id>/<file>.
-- The seats, subscriptions and bids learn whose tracenet they are for: creator, NULL meaning the first creator's (every row before this day).
CREATE TABLE IF NOT EXISTS creators (
 handle TEXT PRIMARY KEY,
 name TEXT NOT NULL, line TEXT NOT NULL DEFAULT '', x TEXT, avatar TEXT,
 wallet TEXT NOT NULL UNIQUE,
 stripe_account TEXT UNIQUE, stripe_price TEXT, bronze_cents INTEGER, onboarded INTEGER NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS drops (
 handle TEXT NOT NULL, id TEXT NOT NULL,
 title TEXT NOT NULL, kind TEXT NOT NULL, file TEXT NOT NULL, bytes INTEGER NOT NULL, sha256 TEXT NOT NULL, published TEXT NOT NULL,
 sanitized TEXT,
 PRIMARY KEY (handle, id)
);
ALTER TABLE premint_orders ADD COLUMN creator TEXT;
ALTER TABLE bronze_subs ADD COLUMN creator TEXT;
ALTER TABLE gold_bids ADD COLUMN creator TEXT;
ALTER TABLE gold_totals ADD COLUMN creator TEXT;
