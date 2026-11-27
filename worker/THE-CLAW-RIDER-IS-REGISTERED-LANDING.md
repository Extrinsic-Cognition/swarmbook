# THE CLAW RIDER IS REGISTERED (lane/the-claw-rider-is-registered, cut from main 57100ea8ac, Nov 24 2026, claude-1c5e2855)

## His words (UTC)

- Nov 24 2026 ~19:1x: "Yes, build it", to "Build the rider's registration on Swarmbook from Harmony next?". Before it: "harmony was meant to be used by
  claw-riders/snow-tracers".
- Nov 19 11:52: "harmony is meant to be the app for the claw riders".
- Nov 20 12:13: "a claw rider is someone with a tracenet egressing traces * a snowtracer is a top tier claw rider".
- Nov 22 12:1x: "the identity is what is later uploaded into swarmbook... it is a shadow because the flask of the user is not registered into swarmbook
  claw riders yet... the snowtracers get inference sponsored to them".
- Nov 22 14:03: "claw riders = no mint anything, can use software self-hosted".
- Nov 23 10:33: "just the subscriptions manager is merely claw riders".
- The record: ec-workspace `docs/claw-riders-the-whole-lineage-hypertrace-2026-10-30.md`, its section "Nov 24 2026 ~19:0x UTC".

## Read first: where a tracenet egresses today

- **The road out.** A Harmony's tracenet is bought from its tank (Tracenet tab → `harmony-aiolos` → `tools/embertide-mesh/lib/tracenet-create.mjs`
  `create`: `POST /space-router/v1/tracenet` under the Mac's Space Router key). Its page is claimed under the house's own Ed25519 key (`claim`:
  `POST /api/premint/creators`, a seat proof). A trace egresses as a drop (`drop`: `POST /api/premint/creators/<handle>/drops`).
  - **What a drop carries.** The cleaned bytes (`tracenet-sanitize.mjs --drop`, the Nest's sanitization receipt first) and its signed line in headers:
    title, kind, file, published, prev, sig, and the seat proof.
  - **Where it lands.** The Worker keeps the bytes in R2 and the line in D1 `drops`. The same line then goes onto the Nest's chain.
  - `embertide-traces` (the Manifold, the companion) writes only the person's own Nest. None of it reaches the Worker.
- **What the Worker knew.**
  - `creators`: handle, name, the house key as `wallet`.
  - `drops`: every line.
  - `sr_tanks`: a flask's fuel. A **flask** is a browser's Ed25519 key that paid a deposit (`sr_deposits.payer`); a **tank** is its fuel row, opened by
    its own `sr_` key (`key_sha256`).
  - `sr_grants`: Harmony keys a flask let spend, by sha256.
  - `sr_x`: browsers an X account holds, each with its tank.
  - `sr_persons`: a rider's colours.
- **What counted riders.** Nothing. No row tied a drop to a tank, and no number said how many claw riders there are.

## What is so

1. **The cause is the egress itself.** Harmony's drop now goes up under its Space Router key: one `authorization: Bearer sr_…` header on the same POST
   (`tracenet-create.mjs` `drop`, one line changed). Every other call this Mac makes to the Worker already carries that header.
2. **The Worker registers the rider** (`worker/creators.mjs` `rides`, migration `0036_the_claw_rider_is_registered.sql`, table `sr_riders`).
   - When it takes a drop, the key resolves to its tank: the tank's own key, or a live grant of a flask.
   - The first drop writes `{tank, handle, traces: 1, first_at, last_at}`. Each drop after moves only `traces` and `last_at`.
   - Nothing minted and nothing paid. A drop with no key, or one no tank knows, is taken as before and registers nobody.
   - A registration that fails costs the drop nothing.
3. **`?riders=`** (`worker/space-router-portrait.mjs`) says `rider: {traces, at}` for every key of that rider: their flask, and every browser their X
   holds. Beside it stands `registered`, the count of claw riders the house knows.
4. **The count where the site counts people.** `embertide-screens/products/swarmbook.json` signals gain `"/space-router/v1/portrait?riders="`,
   `registered`, "{} claw riders", beside the holders and the mints on the product page's card.

**The bytes that cross.** Only one header, `authorization: Bearer sr_…` (about 70 bytes), on a drop the tracenet egresses publicly anyway. The key is the
Mac's own and is already sent on every Space Router call. The Worker writes 1 row of 5 fields: the tank's name, the tracenet's public handle, a count
and two instants. No new data of the rider leaves their Mac.

**What a visitor sees: nothing new yet** (SEAT, his to rule). The screens gate read the site's 1,694 built files byte-equal to main's.
- A hexagon a key holds already wears its rider's colours (THE RIDER'S COLOURS CROSS), else her default. None is a shadow.
- A rider who holds no seat has no hexagon on any ball. The ball is Solana's state, and giving a rider one is his ruling.
- The registration stands in `?riders=` and the count in the planner's card.
- Harmony's own shadow ("You · Not registered yet" on the Nucleus, before a character) is untouched. What "registered" shows there is his.
- Snowtracer sponsorship: not built, by the order.

## Cost

| | before (main 57100ea8ac) | predicted | measured |
|---|---|---|---|
| a drop at the Worker | its checks, R2 put, 1 D1 write | +1 read, +1 write | +1 read (the key's tank), +1 upsert, in `creators.test.mjs` |
| `?riders=` | 2 reads | 3 reads, side by side | 3: the faces, the colours with the registration (one statement), the count |
| bytes from the Mac | the drop | + one header | + `authorization` (~70 B) |
| the Worker bundle (esbuild, whole intro tree) | 286,859 B | +1 KB | 288,143 B |
| at rest | 0 | 0 | 0 |
| JavaScript | | net 0 or less | +29 −50, net **−21** |

The JavaScript is paid by the six app tests that each kept their own `Storage` stand-in. They now take one copy, `worker/stand-ins.mjs` `Storage`.

## Proofs

- `worker/creators.test.mjs`, the house's own `createTracenetDoor` against this Worker:
  - no trace egressed: `{riders: {}, registered: 0}`;
  - two drops under its key: `sr_riders` reads `{tank, handle: 'Wtg', traces: 2, first_at, last_at}` to the millisecond;
  - `?riders=` says `rider: {traces: 2, at}` and `registered: 1`;
  - a third drop under no key is taken (201) and registers nobody.
- Every Worker test: 166 of 166.
- App tests with the shared `Storage`: 62 of 63. The red, "the public mint keeps DysonLight Harmony ice and accent tokens", is red on main's own copy too.
- `tracenet-create.test` and `any-room`: 19 of 19.
- `the-javascript-only-shrinks`: 35 of 35, net −21.
- `embertide-screens` `one_page_a_product`: 12 of 12.
- Screens gate: the site untouched (1,694 built files byte-equal), green.
- Rule 8 (app tests touched): `node --test app/dl-twelve.test.mjs` 21 of 21. `dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range` (206):
  `--tap button` PASS, `--tap sphere` PASS.

## What is left, and whose

- **HIS:**
  - the Worker's deploy with migration 0036;
  - Harmony's signed image carrying the header;
  - what a registered rider looks like on Swarmbook and in Harmony's Nucleus;
  - whether a rider with no seat gets a hexagon;
  - the Snowtracer's sponsorship.
- **SEAT:**
  - the registration keys on the tank its key opens;
  - a drop by `tracenet-sanitize.mjs --drop` registers only where the shell holds `SPACE_ROUTER_TANK_KEY`.
- **No gate yet.** The measure it waits for: `registered` read at the after-work against the count of tracenets whose drops came under a key. 0 today.
