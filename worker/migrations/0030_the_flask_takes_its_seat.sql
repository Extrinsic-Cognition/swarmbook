-- 0030_the_flask_takes_its_seat.sql · THE FLASK TAKES ITS SEAT (Nov 22 2026, worker/space-router-seat.mjs; his 17:07:40 UTC "Yes, build it" to "Next:
-- the page lets a finished Lyssajudron take its seat with one tap of the buyer's wallet?"). A seat the house pays, its buyer the deposit's own paying
-- flask, in its sr_seats row: the transaction the door offered (its legacy message, base64, written by the seat's law, worker/poleis-seat.wasm), what
-- it costs the house (the seat's lamports and the fee, lamports), and when; then the take: the transaction's signature (the fee key's, the first) and
-- when it was sent. A take holds the row while its send may have gone (RELAY_MS); a send the node refused gives it back; a new offer clears an old take.
ALTER TABLE sr_seats ADD COLUMN offer TEXT;
ALTER TABLE sr_seats ADD COLUMN cost INTEGER;
ALTER TABLE sr_seats ADD COLUMN offered_at INTEGER;
ALTER TABLE sr_seats ADD COLUMN taken TEXT;
ALTER TABLE sr_seats ADD COLUMN taken_at INTEGER;
