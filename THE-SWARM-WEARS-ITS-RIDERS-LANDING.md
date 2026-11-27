# THE SWARM WEARS ITS RIDERS

Lane `lane/the-swarm-wears-its-riders`, Nov 22 2026 UTC, seat claude-99332308 on the new Mac, cut from `lane/the-knock-stands-on-the-swarm` (015653f93f, on main as c7e7187a8d since 19:06 UTC; its
receipt beside this one: "Nobody else's face" was what it did not do). A swarm's hexagons wear the Lyssajudrons of whoever holds them, on the wall's cards and on
the swarm's page. Drawn first as the two upper pictures of "Ride and steer, end to end" (Canvas, Claude page): "Today: nobody's face is on it" and "Ridden: its
hexagons are its riders". The lineage: ec-workspace `docs/posiverses-and-neghiverses-hypertrace-2026-10-30.md` (its Nov 22 sections) and
`docs/the-societies-are-sacred-the-goldberg-lineage-hypertrace-2026-11-22.md`.

## His words (UTC)

- Aug 31 2026 22:19: "the polyhedron has many faces... hexs and pents are faces"; Sept 1 07:54: "polyhedrons are organizations... faces are individuals (agents or humans)".
- Nov 19 13:20: "the swarmbook is made by many pages... that hex is a page". Nov 20 08:26: "lyssajudrons colored pfps are only hexagons".
- Nov 22 13:34: "you got something mystical there that can be used as a leaderboard virtue signaling... and we should be figuring out how to bring the SnowTracers
  into the Swarms and shit". 17:50:53, to seat claude-1c9400fb: "Patreon (pentagons) and Swarm Riders (hexagons)".
- 18:02:34, to the box "Build the other riders' faces on the swarm?": "Yes, build it". 19:09:28, to "Hand the riders' faces to the lander too?": "Yes, hand it".
- Where his words part, not cut by this seat: at 17:02:34, over a drawing of a society's ball, he marked the small orbiting ball "snowtracers participating in the
  wishing well". This lane follows the newer line and the press: a rider is a hexagon. The small ball is a chamber too, so its own hexagons wear their riders the same.

## The cost first

| | before (the knock's lane, 015653f93f) | after |
|---|---|---|
| the wall's and the page's own files, uncompressed | tree.js 31,925 + wall.js 18,510 + polis.js 53,759 + polis-knock.mjs 3,870 B | tree.js 33,510 + wall.js 18,652 + polis.js 53,819 + polis-knock.mjs 4,089 + riders.mjs 3,607 B |
| the mint page's `warm-assembly.js` | 31,093 B | 2,032 B |
| asks of the house | none | one GET a page: 21 keys for the whole wall today, 6 for The Root, Tipped; none more until a chamber on the chain has a new holder |
| pictures | none | one a rider, the house's 480 px JPEG (held a year by its name), drawn once to 256 px (262 kB of memory) |
| the house's database | | one read an ask, by the payer's index (sr_deposits_payer), the drop's and the hexagon's keys; no new table, no new index |
| a frame of the ball, The Root, Tipped with its 8 seats worn (median of 400 draws, headless, load 60) | 0.5 ms at 760 px and at 440 px | 0.5 ms and 0.5 ms (the clock's step is 0.1) |
| the same with the pixels read back (median of 240, load 105) | 7.2 and 6.1 ms; 4.6 and 4.8 ms | 7.8 and 6.8 ms; 5.2 and 5.1 ms |
| at rest | | nothing: no timer, no poll; a door that does not answer is asked again when a chamber is read again (1 ask in 25 s, read in the browser) |
| JavaScript | | +124 -456, net -332 over the knock's lane |

## What lands

- **The house says whose face a key wears, and only to who names the key** (`worker/space-router-portrait.mjs`): `GET /space-router/v1/portrait?riders=<key>,<key>` (100 at
  most) answers, of those keys, each that paid a hexagon's deposit, with its first hexagon's painting and the page its person claimed. A key that paid none is not said.
  Nobody's keys are listed: a swarm's seats stand on Solana, and the page asks for the ones it reads there. "Who paid" is the same word THE RIDER IS WHO PAID HER keeps.
- **Every ball wears it** (`app/riders.mjs`, `app/tree.js`): a chamber's seats are its registry's holders in their order, as the ball already drew their votes. In a vote a
  face is dim until its yes, then whole and rimmed in the floor's gold. The pentagons wear none.
- **The ball turns to its riders** the first time their faces come in: on the wall each card; on the page, the faces with the first free seat beside them, or with the visitor's
  own seat in front among them. With no face nothing turns: today's wall stands as it did.
- **A face is a page**: a press on a rider's hexagon on the swarm's page opens /<handle>, their tracenet, as on the front's ball; a face with no page claimed leads nowhere and
  no hand stands over it. A press on a free seat is still the knock.
- **At the door**: whoever waits on the society's ring wears their own face too, and it leads to their page: the two halves see who is asking.

## What pays for the lines

`app/warm-assembly.js`: `createWarmAssembly`, `projectMemberFace` and their helpers (429 lines), called by nobody in the house (read by name over the whole tree): the mint page loads the file for
`loopPoint` and `loopUnitAt` alone, which answer the same to the last bit (12 chairs, 201 instants each, the worst difference 0). `app/ecology-memory.js`'s dead scene was taken out first and given
back: `lane/her-colours-cross-into-harmony`, in the line, pays with it. The welcome's copies are not touched.

## The proofs (the new Mac, nice 19, headless, off every screen; the faces are the house's own drawer's, the house's answer made up at the wire)

| | |
|---|---|
| `app/riders.test.mjs` (new) | 7 of 7: the seats' keys; one ask a turn and each key once; the vote's dress; only the house's own pictures and pages; a closed door and a lost picture; 203 keys in three asks; every ball, the page's own hexagons first, a press on a face never a knock |
| `worker/space-router-portrait.test.mjs` | 7 of 7, one new: on D1's surface with every migration it reads: no painting, no face; the first hexagon of a key; another person's key and page; what is no key; the hundred-and-first key; the list names no key; no database, 503 |
| the wall, its nine societies, moving and with reduced motion | one ask of 21 keys, 14 pictures; every society wears its riders (12, 8, 6, 6, 5, 4, 3, 2 and 1 seats) and turned to them |
| the page, 1440 and 390 px | one ask of 6 keys, 8 seats worn, the free seats' red rims beside them |
| a vote in session and two knocks (made up in the page's own maps) | yes whole and gold, the rest dim, the chairs green; both stand on the ring with their faces; "Admit one new rider", 8 of 12 |
| a trusted press on every pressable hexagon, 1440 and 390 px | a face with a page opens it and no knock; a free seat opens the knock and no page; the hand stands over both and nothing else |
| the whole road of the knock's lane walked again on this tip (a test flask, the knock signed and caught, devnet's simulation, the door, the vote, the seat), and a seat of the visitor's own among eight riders | the same answers (err null, 8,644 units), no error, no write left; their own face in front, rimmed in the gold, the riders round it |
| the house's door closed | the page stands; 1 ask in 25 s; a chamber read again: 1 ask, 8 faces |
| NO LANDING ADDS A FAILING SCREEN | the site moved by 11 built files; 72 cells judged, 0 new failing, 0 to take out |
| the folder's suites that read what changed (swarmbook, floor, after-the-mint, room-plan, guide, assembly, stations, dl-kit-deposit, tracenet-trail, one-name-for-her, every `space-router*`, tools) | 251 of 253, one skipped by its own word; the red one is main's own (`tools/storyboard-canvas.test.mjs`, red in main's checkout the same way). Every test that reads the mint's sphere: 336 of 342, one skipped; the five reds are main's own, the same five there (main ea09fc5b9f) |
| rule 8, for the folder is the mint's (the lane touches no file of its film or song): `app/dl-twelve.test.mjs`, and `app/dl-twelve.proof.mjs` on the served mint page | 21 of 21; `--tap button` PASS and `--tap sphere` PASS: the sound came in where the picture was, and the picture never went back |
| the gates read here | the-law-is-the-gate 8, the-javascript-only-shrinks 31, any-room 12, the-look-is-a-law 2, no-page-of-its-own 3, the-pixel-is-a-lookup 3, the-holy-water 4, the-trajectory-is-a-path 3, space-first 3, no-build-accumulates 1, the-room-stands-bare 2, the classical census: green |

## What it does not do

- **Nothing is worn today.** No hexagon is minted on the live site (`/space-router/v1/portrait`: count 0, read 18:00 UTC), so no key has a face; the pictures above are examples.
- The sheet's "You ride" on a card and its "yours" view are not built; nor the knock inside Harmony.
- A rider who mints, paints or claims a page while a page is open is seen when it is opened again.
- A rider whose seat is held by another key than the flask that paid her wears nothing there: one rider, one key.
- It goes live at his publish press, with the knock. It needs no database step of its own.

## The gate

`app/riders.test.mjs` and `worker/space-router-portrait.test.mjs`, on every lane that touches the folder. No gate yet on the live count: the swarms whose seats wear a face (0 of 9
today), read at the publish.
