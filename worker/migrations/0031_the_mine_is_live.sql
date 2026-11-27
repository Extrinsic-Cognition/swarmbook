-- 0031_the_mine_is_live.sql · THE MINE IS LIVE (Nov 23 2026, lane/the-mine-is-live; his Nov 21 2026 17:34:37 UTC "it is supposed to be uncapped
-- supply, prompt-2-mine; the issuance needs to be live and continuous based on the space-router utilization"). A receipt names the burn it is the
-- receipt of (its ledger row's id, written in the burn's own batch), so the crank that posts spends to the $WARM mine reads each signed receipt beside
-- the fuel dollars its burn drank and the $WARM the ledger says it mined. A receipt written before this names none and is never posted: the mine
-- counts spends from here on. The door's hold reads the column, so a Worker ahead of this migration is shut instead of answering calls it cannot write.
ALTER TABLE sr_receipts ADD COLUMN burn INTEGER;
-- WHAT CANNOT MINE NEVER HOLDS THE LINE: how far the crank has read past receipts that mined nothing on the chain (their flasks' deposits spent, or a
-- tank fed by a pour or a stake). One row, a place to read from and never what was mined: that is the mine's own cursor, on the chain.
CREATE TABLE IF NOT EXISTS sr_crank (id INTEGER PRIMARY KEY CHECK (id = 1), through INTEGER NOT NULL);
