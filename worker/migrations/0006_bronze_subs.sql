-- 0006_bronze_subs.sql (Oct 23 2026): BRONZE IS A SUBSCRIPTION (worker/bronze.mjs). One row per card subscription: the sha256 of the access token the
-- Worker minted at the checkout (the token itself lives only in the subscriber's browser), Stripe's state of the subscription as its webhook last
-- said it (pending until then), its customer and subscription ids, and the end of the paid period (seconds). The Bronze tier holds while the status
-- is active or trialing and the period has not ended. No card number, no email, no name: Stripe holds those.
CREATE TABLE IF NOT EXISTS bronze_subs (
 token_hash TEXT PRIMARY KEY,
 status TEXT NOT NULL,
 customer TEXT,
 subscription TEXT UNIQUE,
 period_end INTEGER,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
