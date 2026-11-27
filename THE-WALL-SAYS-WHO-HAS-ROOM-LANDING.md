# THE WALL SAYS WHO HAS ROOM

His words (UTC, Nov 24 2026), over the drafts `ec-workspace/docs/swarmbook-is-the-wishs-road-2026-11-24/the-gaps-drafted.jpg`
(record: section 25.15 of `docs/swarmbook-is-the-new-poleis-us-and-the-claw-riders-hypertrace-2026-11-10.md`):

- 15:26:58 "the 12 pentagons become fertile soil for SnowTracers to apply" (draft 2: a rider finds a swarm with room)
- 15:51:59 "it is not meant to be hardcoded"
- 17:03:50 "build all and ship to prod"

## Cost first

| | before (main 84c7bb060b) | after (this lane) |
|---|---|---|
| JavaScript lines (`.js .mjs .html`, tests too) | | +79 -82, net **-3** in 9 files |
| bytes of the touched page files (index.html, wall.js, wall-roster.js, landing-boot.js, found.js, found.html, found-capacity.js) | 91,731 | 93,091 (+1,360); the test +1,340 |
| what the wall page fetches anew | | found-scene.js 15,536 B and found-capacity.js 4,015 B (orb.js it already had through tree.js) |
| chain reads | | none added: the filter reads the pools the wall's one scan already holds |
| frames at rest (headless, 5 s with the wall in view, `?scene=idle` and live) | 273 and 266 rAF calls | 283 (the card's scene is `still`: drawn on cause alone; spinning, it had made 578 and 564) |

Paid for by taking out what the page computed and never showed: the hero's four numbers (swarms, agents, decisions, fund) were
painted on every refresh into cells hidden since the page came into the house (Oct 12 2026); the painter (`paintNumbers`), the
cells, their CSS, the boot's text restore of them (`landing-boot.js`), and dead rules (`.assembly-mint`, `.hero .sub`, `.hero .lead`,
the title's `em`, `@keyframes pulse`, a doubled `.tile .name`).

## What each piece reads from the chain

1. **At the door** (`wall.js`, `wall-roster.js` doorSeats). After a bar in the wall's line of words, beside but apart from the staged
   scene previews (live, voting, discussion, energy saver), "at the door" filters the wall to exactly the swarms whose card prints
   "n at the door": the sum over the swarm's chambers of its pool's `open - filled`, the very sum the card prints (the card now calls
   the same function). `?wall=door` keeps it in a shared link and goes with `?scene=`. The label says "n of N swarms with seats open",
   or "no swarm has a seat open at its door". Read on devnet at 17:2x UTC: 2 of 10 (THE ROOT, TIPPED 8, A TEST SWARM 10).
2. **The wish is the wall's first card** (`index.html` #wish-card, `wall.js`, `found-capacity.js`, `found.js`). The smaller build the
   order allowed: the chip "Your wish"; the founding page's own tree (`found-scene.js` createFoundingScene, reused with a new `still`
   option, one root whose room morphs the ball); its question "What should this swarm exist to do?"; the name; the room (the founding
   ladder, 20 to 150). The sentence is cut to 128 UTF-8 bytes and the name to 64 as typed, never inside a character. "Found on Solana"
   opens `found.html#wish=&name=&room=` (the fragment: no server reads it) and found.html lands on its second step with them filled;
   its own founding (`open_genesis`, devnet) is one press away. found.html alone opens on its first step as before. The founding now
   writes the wish's sentence as the root's `desc` (fitted to 128 bytes; it was empty), which the swarm's page prints; the charter still
   hashes the whole wish. Nothing on the card is a number or a name of the chain's: it holds only what the visitor types.

## Tests and proofs

- `node --test embertide-app/ui/intro/dyson-society/app/wall-door.test.mjs`: 2 pass (the filter's predicate; the byte limits and the hand-over).
- The app's tests that read the touched files: after-the-mint 10, assembly-dive 10, dl-mint-hexagon 9, dl-direct 6, tracenet 5, riders 10,
  mint-chairs 8, swarmbook-floor 12, warm-door 5, guide 3, tools/site-files 4: all pass. dl-athena (1), lab/breakdown (1), dl-paywall (1) and
  warm-sphere-moment (1) fail the same on main.
- `the-javascript-only-shrinks.test.mjs` 32 pass (net -3); `the-look-is-a-law.test.mjs` 2 pass; `the-law-is-the-gate.test.mjs`: its screens
  gate found 0 new failing cells and asked for the two new loads of the index screen, now in `embertide-screens/loads.json`.
- Headless, off every screen (pw-cdp.mjs, the worktree served by tools/serve-range): the wall with the filter on and off and combined with
  `?scene=voting`, the URL after each press, the card's byte cuts (127 and 64 bytes), and the hand-over landing on found.html's second step.

## Not verified

- The empty state's words ("no swarm has a seat open at its door") were not seen on a page: devnet has two swarms with room today.
- Founding from the card was proved only up to found.html's second step; no transaction was sent (no devnet, no practice chain run), so
  the root's new `desc` on chain is read from the code, not from a chain.
- The headless screens are a static copy: the router's doors (`/space-router/v1/*`) answer 404 there, as on main.

## The gate

No gate yet on the wall's filter itself: the measure it waits for is the count of tiles the wall shows under `?wall=door` against the count of
swarms whose pools hold open seats on the same read, at the site's screens run. The lines it rides: THE JAVASCRIPT ONLY SHRINKS
(`tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs`), THE LOOK IS A LAW (`tools/embertide-mesh/tests/the-look-is-a-law.test.mjs`)
and NO LANDING ADDS A FAILING SCREEN (`tools/embertide-mesh/tests/no-landing-adds-a-failing-screen.sh`).

## Rule 8, proven on this lane (Nov 24 2026 ~17:5x UTC, the integrating seat claude-9516217b)

`node --test app/dl-twelve.test.mjs`: every test passes. On this lane's tree served by `tools/serve-range` (206): `nice -n 19 node app/dl-twelve.proof.mjs --url <served>/embertide-app/ui/intro/dyson-society/app/warm.html --tap button` PASS and `--tap sphere` PASS ("the sound came in where the picture was, and the picture never went back").
