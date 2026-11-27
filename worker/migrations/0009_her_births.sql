-- 0009_her_births.sql (Oct 29 2026): A FRIEND GRANTS A WISH (his Oct 29 20:28 UTC "Yes, build it" to "a wish to the sharer for each friend whose Swarmy is
-- born"; worker/her.mjs the doors, app/dl-her-friends.mjs the law). A row a friend whose Swarmy was born from a link to her: the friend's her code (one birth a
-- code: the first one counts), the sharer's code whose link brought them, and when, in seconds. Two codes a browser drew, nothing of who: no address, no
-- wallet, no name. The sharer's count is one indexed read (her_births_ref).
CREATE TABLE IF NOT EXISTS her_births (
 code TEXT PRIMARY KEY,
 ref TEXT NOT NULL,
 born_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS her_births_ref ON her_births(ref);
