# THE SHARE INVITES TO SNOWTRACE: her making's share is an Invite, and what it shares is a way into Project Snowtrace (lane/the-share-invites-to-snowtrace, Oct 30 2026)

The seat: claude-e0975625, on the new Mac. The lane is cut on lane/the-poet-and-the-first-trace (a32887cf4), which holds main (b7882a8ae). No other seat has
committed to these files since 19:07 UTC (faceeec22, HER REEL, LOOKED AT).

## His words (UTC)

- **23:29:03,** over her making at 4/12 with the share at the end of her bar: "ok, i think i like all of it. how do we link it to joining project snowtrace? can you
  do a tiny bit better with the share there please? u get me?"

## The road it makes (the answer to "how do we link it")

1. **You share.** The Invite press films her reel. Its card wears PROJECT SNOWTRACE over the reel. Its words end on "Join Project Snowtrace:" and the link to her
   (`#her=`, with your her code).
2. **A friend comes in by your link.** They land on her as you made her. Their first stroke makes her their own, so they make their Swarmy.
3. **They walk the trail.** After Enter the world, her station says her poem and draws the first trace. Its one press, Follow the trail ↗, opens
   optimism.fit/photons_enjoyor.
4. **You get a wish.** Each friend born from your link grants you one (A FRIEND GRANTS A WISH, unchanged). That is a step on your ladder of twelve, and the friend
   count rides the Invite.

## What changed

- **The share** (`app/dl-her-colours.js`):
  - It was a 36 px gold-ringed circle with a glyph and no word. Now it is a gold pill with the share glyph and **INVITE**. On a phone it is 30 px tall.
  - The friends count stays as its badge, now ink on gold-ringed dark.
  - Its ring, filled as the reel films, is now the pill's own outline: a rounded `rect` with `pathLength="100"` and a non-scaling stroke, where the circle was. It
    animates only while the reel films, as before.
  - Its name for the reader: `INVITE = 'Invite to Project Snowtrace'`. With friends it reads "Invite to Project Snowtrace. Friends: N".
- **The reel** (`app/dl-her-reel.js`):
  - The caption's last line is `Join Project Snowtrace: <link to her>` (`JOIN`). It goes out by the X door, the browser's share and the clipboard on save. With no
    link there is no invitation line.
  - The card puts the project's name, **PROJECT SNOWTRACE** (`SNOWTRACE`), over the reel. It is a name with no line under it (his Oct 29 06:07 rule).
  - The video's height gives up 32 px to the name (`min(74vh, 100% - 128px)`; on a phone `min(66vh, 100% - 120px)`).
  - The reel's frames are Harmony's (`room/birth-film.mjs`) and are untouched.
- **Version tags, moved together:**
  - `dl-her-colours.js?v=her-2` in `warm-entry.mjs` and in `dl-lyssajudron.js` HER_STAGE (one instance);
  - `dl-her-reel.js?v=snowtrace-1` (it had no tag);
  - `dl-lyssajudron.js?v=share-1` in `warm-spatial.js`;
  - `warm-spatial.js?v=share-1` in `warm-entry.mjs`;
  - `warm-entry.mjs?v=society-share-1` in `warm.html`. The tests follow.
- **Cost:**
  - `dl-her-colours.js` 80,358 → 81,410 B (gzip 26,546 → 27,029);
  - `dl-her-reel.js` 13,406 → 14,253 B, loaded only at the press as before;
  - nothing at rest: static paint, and the ring moves only while the reel films.

## Proof (the new Mac, nice 19)

- **The share's, the reel's and her player's tests:** 61 of 61. They cover `dl-her-colours`, `dl-her-reel`, `dl-lyssajudron`, `warm-entry`, `dl-her-friends` and
  `dl-her-wishes`.
  - New pins: the share's one word, its ring as the pill's outline, its name with and without friends, the caption's JOIN line (and none without a link), and the
    card's order (name, reel, doors) with its name.
- **Every test file of the mint plus the any-room gate:** 481 of 484. The same 3 fail on main: THE DEPTH, the ice and accent tokens, her cut.
- **Rule 8:**
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url {serve}/embertide-app/ui/intro/dyson-society/app/warm.html --tap button`: PASS.
  - The same with `--tap sphere`: PASS.
  - The page was served by `tools/serve-range`.
- **On the page in the preview (800 × 862, then 375 × 812), `warm.html?her` at 4/12:**
  - The pill read ⇧ INVITE beside 4/12, with aria-label "Invite to Project Snowtrace". Its press filmed her reel, and its outline filled round the pill.
  - The card stood with PROJECT SNOWTRACE over the reel and its doors (save, X, close) under it. Its words ended "Join Project Snowtrace:
    https://optimism.fit/#her=1.…" with the her code.
  - On the phone the pill sat beside 4/12 under the slots.
  - Not exercised here: a friend's birth and the wish it grants. Those ride the Worker's doors (`worker/her.mjs`), which serve-range does not have, and are
    unchanged.

## Handed to the lander on his word (Oct 31 2026)

- **His words (UTC):** 23:29:03 Oct 30, over the preview, "ok, i think i like all of it." Then 00:14:45 Oct 31, "please deploy optimism.fit".
- **Why the hand comes first:** the deploy builds from main on the old Mac. None of the three mint lanes he looked at in the preview was on main yet.
- **This lane carries all three**, each with its own receipt:
  - THE FIRST TRACENET: the freeze. Lane `lane/the-first-tracenet-on-main`, receipt `THE-FIRST-TRACENET-LANDING.md`.
  - THE POET AND THE FIRST TRACE: her station's poem. Lane `lane/the-poet-and-the-first-trace`, receipt `THE-POET-AND-THE-FIRST-TRACE-LANDING.md`.
  - THE SHARE INVITES TO SNOWTRACE: this receipt.
- **Main merged in at `e5a57ce9f`** (merge `20d1ab562`). Nothing it brought touches the mint.
- **Proof run again on the merge (the new Mac, nice 19):**
  - every mint test plus the any-room gate: 481 of 484. The same 3 fail on main.
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url {serve}/embertide-app/ui/intro/dyson-society/app/warm.html --tap button`: PASS. The same with
    `--tap sphere`: PASS. The page was served by `tools/serve-range`.
- **Unchanged and his to rule:** the vow dialog on `warm.html` still carries the oath's sigil on the public page, as THE-DISK-OPENS-NOTHING-LANDING.md says.
