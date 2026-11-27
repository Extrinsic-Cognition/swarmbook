-- 0004_premint_installs.sql (Oct 22 2026): THE INSTALL. A visit to the Society's page (app/dl-visit.mjs: 26 letters of the codes' alphabet,
-- kept in that browser) whose download opened as DysonLight Harmony, as Harmony reports it from the Mac it opened on: the installer's address
-- carried the visit (?s=) and what Athena had done before the press (?a=, athena), and macOS keeps that address with the download. How
-- Harmony found it (via: quarantine, macOS's own record of the download; handoff, the page's word in a browser), when Harmony first opened
-- (installed_at), when she was saved there (saved_at: her paint opened, the Lyssajudron's tutorial done), and the sha256 of the install's
-- own secret, so that only the Harmony that first named the visit may mark it saved. No secret is kept in clear.
CREATE TABLE IF NOT EXISTS premint_installs (
 visit TEXT PRIMARY KEY,
 athena TEXT, via TEXT NOT NULL,
 install_hash TEXT NOT NULL,
 installed_at INTEGER NOT NULL, saved_at INTEGER
);
