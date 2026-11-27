-- 0029_who_minted_mines.sql · PROMPT-TO-MINE IS FOR WHO MINTED (Nov 22 2026, worker/space-router.mjs MINTED). His words that day, UTC: 14:08:14 "prompt-2-mine
-- with $WARM should not be possible unless people minted the lyssajudron"; 14:03:48 "claw riders = no mint anything, can use software self-hosted and all /
-- snowtracers aka eligible tracenettters gotta mint the tracenet thing". A call mines only where a mint stands for its tank: a deposit of the tank's that took a
-- place on the ball (sr_drops), or a tracenet bought from it (its burn row, why tracenet:<id>). It is read with the hold of every call let in, so two indexes
-- bound the read: the tank's deposits of a dollar or more, oldest first (her egg is the first of 10; what comes after it is fuel, whatever its size), each looked
-- for once in sr_drops until one took a place, 365 at most (one a day for a year); then the first of the tank's tracenet rows. A deposit under a dollar is in no
-- index, and a model call's burn row (why NULL) neither, so a call writes no more than it did. Nothing that was mined is touched.
CREATE INDEX IF NOT EXISTS sr_deposits_tank ON sr_deposits(tank, paid_at, signature, usd) WHERE usd >= 1;
CREATE INDEX IF NOT EXISTS sr_ledger_why ON sr_ledger(tank, why) WHERE why IS NOT NULL;
