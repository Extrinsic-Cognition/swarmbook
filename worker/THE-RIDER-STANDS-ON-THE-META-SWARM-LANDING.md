# THE RIDER STANDS ON THE META SWARM (lane/the-rider-stands-on-the-meta-swarm, cut from main dd234e46e5, Nov 24 2026, claude-1c5e2855)

## His words (UTC)

- **Nov 24 2026 19:18:38**, to "What should a registered claw rider look like on Swarmbook?": "the claw-rider is a hexagon of a lyssajudron on the
  unit0 of the meta swarm. when claw-riders open up tracenets, they become eligible for snowtracers pantheon".
- **Read with:**
  - Nov 19 12:37: "meta swarm is the largest of them all... each lyssajudron minted is a hex there * each pentagon there is a posiverse elected * my
    posiverse is the first pentagon added there";
  - Nov 20 12:53: "if we nail the "Snowtracers Pantheon" we won forever";
  - Nov 22 14:03: "claw riders = no mint anything".
- **Records:** ec-workspace `docs/posiverses-and-neghiverses-hypertrace-2026-10-30.md` (Nov 20 12:53) and `docs/claw-riders-the-whole-lineage-hypertrace-2026-10-30.md`.

## Which ball is the meta swarm's unit0

The front's live ball on the wall, `app/index.html`. Its header says: "The front's ball is the meta swarm's floor: every Lyssajudron minted is one
hexagon". `wall.js` mounts it with `swarmbook-floor.mjs`. It is one list (`/space-router/v1/drops`, the mints the house heard, in order), folded by the
land law (`dl-mint-ledger.js` `foldFloor`). Its faces are the mint sphere's own (`dl-her-portrait.js` `fill`, the portrait door's list by signature).
That ball is the one his Nov 19 line names, the one where each minted Lyssajudron is a hexagon.

## What is so

1. **Registration on the opening.** A tracenet opened through the Space Router's tracenet door, under the Harmony's key (`worker/space-router.mjs`
   `tracenet`), registers its tank's claw rider: `sr_riders` (0036), traces 0, its first instant. A second tracenet writes no second row. A drop
   registers as before and counts its traces.
   - Opening a tracenet is paid today: 0.1 SOL from the rider's tank (`SPACE_ROUTER_TRACENET_SOL`). That price is not this lane's to move.
   - Nothing is minted, and no seat is asked.
2. **The rider is a hexagon on the meta swarm's unit0.**
   - **The list.** The drops door's answer carries `riders`: every claw rider as `rider-<n>`, in the order they came (`first_at`).
   - **The fold.** The floor folds them by the ball's own law after the minted ones, numbered on from them.
   - **The faces.** The portrait door's list carries each rider's hexagon (`n`, `rider-<n>`, their colours) and her default portrait
     (`/app/assets/her-default.jpg`) where no colours came. `dl-her-portrait.js` `fill` seats a picture-only hexagon too (one condition widened).
   - A rider's hexagon leads to their tracenet's page once a drop names its handle.
3. **Eligible for the Snowtracers Pantheon.** The Pantheon's board (`?board`) lists, after the hexagons the fees rank, every rider with an open
   tracenet by the traces they egressed. Their fees, burn and mining are zero, and the row says "N traces". The board's "No rider yet." no longer
   stands under its rows: its `[hidden]` lost to its own `display:grid`, a fault of main's, mended in `product.css`.
   - The election, the houses' holding and polis.html's thrones are not built, by the order.

## Cost

| | before (main dd234e46e5) | measured |
|---|---|---|
| a tracenet opened | its pay | + 1 write (`INSERT … ON CONFLICT DO NOTHING`) |
| the drops door's answer | 1 read | 2 (the riders' ids, 150 at most), held 1 s as before |
| the portrait door's list and board | 2 to 3 reads | + 1 (the riders with their colours), held 20 s as before |
| the floor | 1 GET a read | the same GET; no new door asked |
| at rest | 0 | 0 |
| the Worker bundle (esbuild, whole intro tree) | 288,143 B (lane 5's) | 289,754 B |
| JavaScript | | +49 −71, net **−22** |

The JavaScript is paid by tests that each kept their own stand-ins:
- four Worker and app tests' identical `wallet` one-liner, now `worker/stand-ins.mjs` `wallet` (which gives its `pair` too);
- `tracenet.test.mjs`'s wallet;
- three lab tests' identical film stand-in, now `filmStandIn`.

## Proofs

- `worker/space-router-grant.test.mjs`, the house's own handler on a scratch D1:
  - two flasks open tracenets: two riders, nothing minted;
  - a second tracenet writes no second row;
  - the portrait list gives rider 1 her default (no colours) and rider 2 their own;
  - the board ranks them by the traces they egressed;
  - `?riders=` says the traces.
- `worker/space-router-deposit.test.mjs`: the drops answer names the riders in `first_at` order.
- `app/swarmbook-floor.test.mjs`: with no mint, two riders make the ball (no dodecahedron) and their faces are asked. A mint read puts them after it,
  numbered 2 and 3.
- `app/swarmbook-board.test.mjs`: a rider's row says "3 traces · Hexagon 5".
- Worker and app tests touched, with the shared stand-ins: all green.
  - The lab tests' two reds ("THE GOLDEN FLASH ONLY", "the rule of one") are red on main's own copies too.
- Stills, headless Chrome off every screen, the Worker's handler on a scratch D1 with two box-room riders, nothing asked of the network
  (`https`/`wss` blocked):
  - **The board:** both rows with both faces, her default and the colours, and no "No rider yet." under them.
  - **The ball:** the floor held both riders (`capacity` 30: the first rung, no longer the dodecahedron), and her painter drew both faces (the
    portrait module's `wall: 2`, the page `box_room` linked). The page's own ball did not paint in that headless run with the chain's doors blocked:
    its still shows the wall with the ball's area dark. Seeing it on the ball is owed, on a glass or a run that lets the chain's reads answer.
- Screens gate, both shards: the site's 4 changed built files reach 60 cells and Harmony 55 cells, 0 new failing, 0 to take out.
- Gates: `the-javascript-only-shrinks` 36 of 36 (net −22); `any-room` and `the-look-is-a-law` 14 of 14.
- Rule 8 (app/ touched): `node --test app/dl-twelve.test.mjs` 21 of 21. `dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range` (206):
  `--tap button` PASS, `--tap sphere` PASS.

## What is left, and whose

- **HIS:**
  - the Worker's deploy;
  - the Snowtracers Pantheon's election and its houses;
  - polis.html?civ=0's thrones;
  - whether a rider with a tracenet still owes its price.
- **SEAT:**
  - riders are numbered on from the minted, so a new mint moves a rider's number;
  - a rider with no handle yet is "Hexagon N · no page claimed".
- **No gate yet.** The measure it waits for: the hexagons on the front's ball that are riders, against `registered`, read at the after-work.

## THE RIDERS SHOW ON THE BALL (lane/the-riders-show-on-the-ball, cut from main fa19a72ce3, Nov 24 2026)

**The still.** The meta swarm's unit0 was shot in headless Chrome, off every screen, at nice 19, on the lane's tree:
- the Worker's handler on a scratch D1 with the two box-room riders;
- the chain's reads let through to `api.devnet.solana.com` (JSON-RPC reads only: getSlot, getProgramAccounts, getMultipleAccounts; anything that
  signs or sends was refused; nothing else left the Mac).

The ball stands with the ten societies orbiting it. Rider 1's hexagon (her default portrait) faces the eye; rider 2's (their own colours) is on the far
side. The portrait module drew both faces.

**The fault the still found.** The sphere's label said "2 Lyssajudrons minted": the floor's `count` had counted the riders, who minted nothing.
- **The fix:** `count` is the mints again. Whether the ball holds anything (faces asked, the hero, a page shown again) reads `held.length`.
- **The test:** `swarmbook-floor.test.mjs` pins a riders-only ball at count 0 with its two hexagons held.
- **Cost:** JavaScript net 0 (+5 −5).
- **Proofs:**
  - `swarmbook-floor` and `swarmbook-board`: 17 of 17.
  - `the-javascript-only-shrinks`: green (+5 −5).
  - Screens gate: the site 36 cells and Harmony 45 cells, 0 new failing.
  - Worker bundle: 289,754 bytes (unchanged: the fix is the site's).
  - Rule 8: `node --test app/dl-twelve.test.mjs` 21 of 21. `dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range` (206): `--tap button`
    PASS, `--tap sphere` PASS.
