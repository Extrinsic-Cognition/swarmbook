-- 0027_the_seats.sql · THE DOOR SIGNS THE SEAT (Nov 22 2026, worker/space-router-seat.mjs; his 15:20:34 UTC "Yes, build it" to "Next: the mint door signs
-- each finished Lyssajudron's permit, so the floor can fill?"). One row per deposit whose seat of root 0's floor the door has signed: the deposit's signature
-- (one seat a deposit), the buyer its first ask bound (never another after), the completion digest Poleis names the seat by (hex; the seat's mint derives
-- from it, so the chain seats a deposit once), the permit's 246 bytes and the issuer's signature over them (base64), and when it was signed. A permit that
-- has run out is signed again for the same buyer, in the same row.
CREATE TABLE IF NOT EXISTS sr_seats (
  deposit TEXT PRIMARY KEY,
  buyer TEXT NOT NULL,
  completion TEXT NOT NULL,
  permit TEXT NOT NULL,
  signature TEXT NOT NULL,
  issued_at INTEGER NOT NULL
);
