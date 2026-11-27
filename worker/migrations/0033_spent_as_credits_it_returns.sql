-- 0033_spent_as_credits_it_returns.sql · SPENT AS CREDITS, IT RETURNS (Nov 23 2026; his press at 18:17:41 UTC, "Back to the mine": "One $WARM, the
-- token: spending it as credits returns it, to be mined again"). A flask keeps its $WARM: one approval in its page makes the mine the delegate of its
-- own $WARM account, and after a drink of $WARM credit the crank brings back just what the tank drank (the program's `take_back`). A tank's $WARM
-- credit (`warm_back`, migration 0032) is then what its flasks paid back and what they hold for the mine, less what it drank.
-- sr_tanks.warm_drunk: the $WARM a tank drank as credits where the mine is named, in all (the take-back's target, against its flasks' records).
-- sr_backs.held: what a flask held for the mine (its balance as far as the mine's delegation goes) when the door last read it, beside `paid`.
ALTER TABLE sr_tanks ADD COLUMN warm_drunk REAL NOT NULL DEFAULT 0;
ALTER TABLE sr_backs ADD COLUMN held INTEGER NOT NULL DEFAULT 0;
