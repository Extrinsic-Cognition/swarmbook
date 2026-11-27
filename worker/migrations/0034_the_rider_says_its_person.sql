-- 0034_the_rider_says_its_person.sql · THE RIDER CROSSES TO SWARMBOOK (Nov 24 2026, his ~15:4x UTC "Build stop 7"; Nov 22 12:1x UTC "the identity is what is later
-- uploaded into swarmbook..."; worker/space-router-grant.mjs PERSON_PATH). One row a person (a tank: the flask's own, or the one its X holds, space-router-egg.mjs):
-- the face they chose in Harmony, by the sha256 of bytes the house carries (app/riders.mjs PERSONS), said by a Harmony key that person's flask let in; the flask
-- that let it in (the rider); when it was said. A person with no row wears the default, Nefertiti. Nothing else of theirs is kept.
CREATE TABLE IF NOT EXISTS sr_persons (
  tank TEXT PRIMARY KEY,
  person TEXT NOT NULL,
  rider TEXT NOT NULL,
  said_at INTEGER NOT NULL
);
