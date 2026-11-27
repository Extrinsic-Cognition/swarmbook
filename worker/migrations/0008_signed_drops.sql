-- 0008_signed_drops.sql (Oct 25 2026): THE DROP IS SIGNED BY ITS CREATOR (app/tracenet-drop-line.mjs, worker/creators.mjs; the design: ec-workspace
-- docs/beat-cosign-with-true-neutrality-2026-10-25.md, his Sept 28 2026 "we gotta beat cosign by a16z with true neutrality"). A creator's drop line
-- carries the creator's wallet signature over the line (sig, base58) and the hash of their signed line before it (prev; 'none' for the first): the
-- register is the creator's own chain, checkable by anyone from its lines and its wallet, and this table is its cache. A row from before this day
-- carries neither, and no reader draws it as signed. One signed line per prev: two lines naming the same line before them would fork the chain
-- (a NULL prev, a row from before, is no one's).
ALTER TABLE drops ADD COLUMN prev TEXT;
ALTER TABLE drops ADD COLUMN sig TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS drops_chain ON drops(handle, prev);
