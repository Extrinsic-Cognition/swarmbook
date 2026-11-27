-- 0035_the_riders_colours_cross.sql · THE RIDER'S COLOURS CROSS (Nov 24 2026; his Nov 22 14:08 UTC "we should allow everyone to have their own colored face lyssajudron";
-- worker/space-router-grant.mjs PERSON_PATH). Her six colours as the person gave them in Harmony ({light, base, coat, gold, eyes, thruster}, #RRGGBB each, as
-- space-router-portrait.mjs coloursOf keeps a hexagon's), kept beside the face they chose; null until said. A row whose person is '' said only her colours.
ALTER TABLE sr_persons ADD COLUMN colours TEXT;
