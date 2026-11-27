-- 0019_the_counter_tank.sql (Nov 2 2026): THE COUNTER-TANK DRINKS (his Oct 12 18:34 UTC "a counter-fueltank that fills up as you consume"; Oct 18 15:33 "you can
-- use $WARM as credits for AI genie"; Oct 28 00:24 "u get back "fuel" in your "tank""; the law: app/space-router-law.mjs USD_PER_WARM, split). The $WARM a tank
-- mined is its second tank, spent as credits once its dollars are gone: sr_tanks.warm_spent sums what it spent (warm - warm_spent is its balance), and a burn
-- row says what of its price was paid in $WARM. The hold names warm_spent, so a database behind this migration shuts the door before anything is sent.
ALTER TABLE sr_tanks ADD COLUMN warm_spent REAL NOT NULL DEFAULT 0;
ALTER TABLE sr_ledger ADD COLUMN warm_spent REAL;
