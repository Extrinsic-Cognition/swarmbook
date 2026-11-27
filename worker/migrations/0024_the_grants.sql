-- 0024_the_grants.sql · A FLASK LETS ITS HARMONY SPEND (Nov 19 2026, worker/space-router-grant.mjs; the law: app/space-router-grant.mjs). One row a key a
-- flask let spend from its tank: the key's sha256 (never the key: it is made on the machine that spends and stays there), the flask's tank and address, the
-- name the person read, the cap a UTC day and what the key drank on `day`, its end, when the flask signed and the door wrote it, when the flask ended it,
-- and the signature as its receipt. A key once written is never written again: an ended key stays ended.
CREATE TABLE IF NOT EXISTS sr_grants (
  key_sha256 TEXT PRIMARY KEY,
  tank TEXT NOT NULL,
  payer TEXT NOT NULL,
  label TEXT NOT NULL,
  cap_usd REAL NOT NULL,
  until INTEGER NOT NULL,
  day INTEGER NOT NULL DEFAULT 0,
  drunk_usd REAL NOT NULL DEFAULT 0,
  signed_at INTEGER NOT NULL,
  granted_at INTEGER NOT NULL,
  ended_at INTEGER,
  signature TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sr_grants_tank ON sr_grants(tank, ended_at);
