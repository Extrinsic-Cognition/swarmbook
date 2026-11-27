-- 0036_the_claw_rider_is_registered.sql · THE CLAW RIDER IS REGISTERED (Nov 24 2026, his ~19:1x UTC "Yes, build it"; Nov 20 12:13 UTC "a claw rider is someone with a
-- tracenet egressing traces"; Nov 22 12:1x "the identity is what is later uploaded into swarmbook... it is a shadow because the flask of the user is not registered into
-- swarmbook claw riders yet"; Nov 22 14:03 "claw riders = no mint anything"). One row a rider (a tank: the flask's own, or the one its X holds), written by the creators' drop
-- door when a drop of their tracenet comes under their Harmony's Space Router key (worker/creators.mjs rides): the tracenet's handle, how many traces it has egressed since,
-- its first and its newest (ms). Nothing minted and nothing paid makes it; ?riders says it (space-router-portrait.mjs), and the count of rows is the claw riders the site counts.
CREATE TABLE IF NOT EXISTS sr_riders (
  tank TEXT PRIMARY KEY,
  handle TEXT NOT NULL,
  traces INTEGER NOT NULL,
  first_at INTEGER NOT NULL,
  last_at INTEGER NOT NULL
);
