-- 0017_her_wishes.sql (Nov 1 2026): THE WISH IS A CALL, IN THE APP (his Nov 1 02:11 UTC "3 wishes as CAC * social proof as K-factor"; 04:51 UTC "there should be
-- 0 wishes granted outside of the app"; worker/space-router.mjs the doors, worker/app-attest.mjs the app's proof, app/dl-her-wishes.mjs the law).
-- her_apps: a row a her born in DysonLight: the app's key as the door names it (Apple's App Attest key id, base64url), her code drawn from it, the app it was
-- attested for (team and bundle), the key's public half (its SPKI, base64) and the last counter its words carried (an assertion's counter never goes back),
-- the code of the her whose link brought her (the K-factor: one more wish owed to that code), and when. No address, no name, no device id.
-- her_wishes: a row a wish the door granted: the her code that wished, when, what it drank from the house's tank (its estimate while it is in flight, the burn's
-- cost once it burned) and its receipt's leaf (the oracle's tree). Never the words. A wish in flight is a row with no leaf; one whose call failed is deleted.
CREATE TABLE IF NOT EXISTS her_apps (
 key TEXT PRIMARY KEY,
 code TEXT NOT NULL UNIQUE,
 app TEXT NOT NULL,
 pub TEXT NOT NULL,
 counter INTEGER NOT NULL,
 friend TEXT,
 at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS her_apps_friend ON her_apps(friend);
CREATE TABLE IF NOT EXISTS her_wishes (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 code TEXT NOT NULL,
 at INTEGER NOT NULL,
 usd REAL NOT NULL,
 leaf TEXT
);
CREATE INDEX IF NOT EXISTS her_wishes_code ON her_wishes(code);
CREATE INDEX IF NOT EXISTS her_wishes_at ON her_wishes(at);
