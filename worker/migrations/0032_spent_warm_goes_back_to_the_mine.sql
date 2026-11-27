-- 0032_spent_warm_goes_back_to_the_mine.sql · SPENT $WARM GOES BACK TO THE MINE (Nov 23 2026; his press at 18:17:41 UTC, "Back to the mine", to
-- "When someone spends their $WARM as credits, what happens to it on the chain?", the option worded "One $WARM, the token: spending it as credits
-- returns it, to be mined again"). Where his deploy names the mine (SPACE_ROUTER_MINE), a tank's $WARM credit is what its flasks paid back on the
-- chain, read off each flask's record at finalized (the mine's own count of what moved into its vault), never what the ledger says it mined.
-- sr_tanks.warm_back is that credit: raised by what its flasks paid back ($WARM), lowered by what its calls drank of it where the mine is named, never
-- below nothing (what a tank drank of the ledger's $WARM before the mine was named is not taken from it). sr_backs keeps, a flask, the paid_back the
-- door last read, so a pay-back counts once (a read counts only what rose since). With no mine named neither is read. The hold names warm_back only
-- where the mine is named, so a Worker ahead of this migration is shut there instead of answering calls it cannot judge.
ALTER TABLE sr_tanks ADD COLUMN warm_back REAL NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS sr_backs (
  flask TEXT PRIMARY KEY,
  tank TEXT NOT NULL,
  paid INTEGER NOT NULL,
  slot INTEGER NOT NULL,
  at INTEGER NOT NULL
);
