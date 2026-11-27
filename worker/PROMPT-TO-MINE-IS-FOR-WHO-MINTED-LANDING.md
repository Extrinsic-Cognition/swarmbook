# PROMPT-TO-MINE IS FOR WHO MINTED

Lane `lane/prompt-to-mine-is-for-who-minted`, Nov 22 2026 UTC, seat claude-2c86184f on the new Mac, on main e6fef479c8. The second half of his ruling; the first, the ring, is
`lane/the-gold-is-for-who-minted` (6a8d995a66, seat claude-99332308). Held until his own word; handed on it: 16:12:54, "Yes, hand it", in this seat's session. Refused at 16:19:33 by another gate's fault, mended on main at 17:01:39 (below), and handed again. Nothing is
deployed and no migration is applied: the site's press is his.

## His words (UTC, read in the store, session 1c9400fb)

- 14:08:14: "mmm this is not inclusive rn. we should allow everyone to have their own colored face lyssajudron there... the thing is different... you should only allow the gold radial
  exp bar for people that minted their lyssajudrons... u get me? prompt-2-mine with $WARM should not be possible unless people minted the lyssajudron".
- 14:03:48: "i think we should make it like: * claw riders = no mint anything, can use software self-hosted and all * snowtracers aka eligible tracenettters gotta mint the tracenet thing".
- 14:33:50, after it: "principal = pent = capital faucet * agent = hex = executor / swarm rider".
- 15:44:27 (session 31ccd7e4): "fully support this", over five stations under one name: the egg, her colours free, the mint ("MINT YOUR SWARMY EGG", "X holds it, Stripe carries it"),
  Harmony, her hexagon in the pool ("is it"). The lane built on it (`lane/one-name-for-her`) gives a person one hexagon, and every later deposit is fuel.

## The cost first

**A call's D1 rows**, read by D1's own counters: the Worker's own handler on a local D1 (workerd 1.20261103.1, the one wrangler 4.157.0 carries), main's ledger beside the lane's. The
database: 20,000 burns, 5,000 deposits and 2,000 hexagons of others, and 3,000 burns of each tank's own.

| the tank | main, rows read | the lane | the lane, 0029 not applied |
|---|---|---|---|
| nothing minted, no deposit | 40 | 41 | 15,249 |
| nothing minted, 5,000 deposits of 0.50 | 42 | 43 | 15,249 |
| nothing minted, 100 deposits of 5 | 42 | 144 | 15,348 |
| a hexagon | 42 | 44 | 12,247 |
| a hexagon after 100 deposits of 5 | 42 | 144 | 12,347 |
| a hexagon, then 1,000 refills of 100 | 42 | 44 | 12,883 |
| a tracenet | 43 | 44 | 15,249 |
| the worst: 1,000 deposits of 5 that took no place, and a tracenet | 43 | 409 | 16,248 |
| rows written, all eight | 13 | 13 | 13 |

**The bound:** 366 rows more a call, whatever a tank holds: its deposits of a dollar or more, oldest first, each looked for once on the ball until one took a place, 365 at most (one a day for
a year), then one row of its tracenets. A hexagon's holder pays 2, and one more for every deposit of 1 to 9.99 made before it. Each row read was a dollar or more of the tank's own fuel.

| | before | after |
|---|---|---|
| round trips to D1 a call | 3 | 3: the mint is read in the hold's own statement |
| the hold's statement, in this process's SQLite (nice 19, the Mac at load 47) | 28 µs | 49 µs |
| a tracenet bought by a tank of 3,000 burns | 18,036 rows read, 5 written | 16 read, 6 written |
| a deposit counted, a refill | 3 rows written each | 4 each (the two indexes) |
| a call of the home's tanks | 55 µs p50 | 59 µs p50 (inside that load's noise); no file is read that was not |
| JavaScript | | +102 -333 in 9 files, net -231 |
| at rest | nothing | nothing |

## What stood

Every burn of every tank mined, in both ledgers (a wish's, on the house's own tank, never did). Read live at 15:15 UTC, with no key:

- `optimism.fit/space-router/v1/mine`: 9.28 mined, the rate 1, opened Nov 15. `/drops`: none. `/portrait?board`: 0 hexagons. His purse on the Nest: `gold.mined` 9.28.
- **The 9.28 is one thing: the tracenet he bought on Nov 4.** The Nest's log, seq 325177, 09:24:54: "Wtg", 0.1 SOL, $9.28, 9.28 $WARM, receipt 2. No call has mined on the site: the mine's
  whole sum is that purchase. At 20:01 that day his Nest's `tracenet/house` was set to null, on his 19:57:11 "please reset the tracenet status here as if i still have to
  initialize/accept/create it... for ui purposes dude"; the purchase stands on the site.
- The home's tanks: none on either Mac (`~/.embertide/space-router` is on neither).

## What lands

- **The site (`space-router.mjs`, migration `0029_who_minted_mines.sql`).** `MINTED`: the tank holds a hexagon (one of its deposits, oldest first, took a place on the ball, `sr_deposits`
  joined to `sr_drops` by signature) or bought a tracenet (its own burn row, `tracenet:<id>`). It is read as the call is let in, with its hold. Without it the burn drinks the same, writes
  `warm` 0, says `x-space-router-warm: 0` and adds nothing to `sr_mine.owed`. With it, it mines as it did.
- **The home (`lib/space-tanks.mjs`, `space-tanks.mjs mint`).** A mint is a row of the ledger, `{ kind: 'mint', tank, hexagon | tracenet, why }`: the treasury's witness of what the site says,
  by his hand as a pour is. A tank with none drinks the same and its burn row says `warm` 0. `ls` says which tanks mine nothing.
- **A prompt asked before the mint mines nothing**, in both: the mint is judged when the call is let in, never when its answer comes back.
- **No mint:** a deposit under 10, or one that took no place; another tank's hexagon; a refill or a model with a tracenet's name; a mint row that names neither.
- **A database with no list of hexagons (behind 0020) is shut before anything is sent**, as one behind 0012, 0013 and 0019 was: it never answers a call whose mint it cannot read.
- **The law file is untouched** (`app/space-router-law.mjs`): what a dollar mines, and when it halves, is the same. `poleis/program/warm_mine` holds that file by its sha256.

## The fault of the first cut, found after it was held

2a5593c0fc looked at a tank's twelve largest deposits, on the reading that any deposit above one that took a place took one too. By his 15:44 that is false: a person has one hexagon and every later
deposit is fuel, so a holder of a 10 dollar egg with twelve larger refills would have stopped mining. Read on his "so?" at 16:00, written red first (0 where 0.102795 was owed), then mended: oldest
first, where her egg stands before its fuel. Checked with the other lane's own statements, not committed yet: 20 deposits of 4, no mint; the egg, a mint and one hexagon; 15 refills of 50 after it,
still a mint and one hexagon. Once its `sr_eggs` (one row a person's egg, by tank) stands, the first half of `MINTED` is one row by its key, and the bound falls to 2.

## Decided here, and his to strike

- **The tracenet's purchase mines its own dollars, as it did.** It is itself a mint, and he was told on Nov 3, before his "Charge the tank", that "the spend mints their first $WARM one for one
  as rebate". The tank's calls mine from then on.
- **What stands mined on an unminted tank is left as it is.** By the two mints above none stands: the whole 9.28 is the tracenet's. If he rules that a hexagon alone counts, 9.28 stands on one
  unminted tank, and stays its own. No line here lowers a tank's `warm`, and it still pays calls.

## His to rule

1. **What a mint is:** a hexagon, a paid tracenet, or both (built: either). Each is one line of `MINTED`. His 14:08 says the lyssajudron and his 15:44 puts her mint at the egg, so a hexagon is
   one by his own words; his 14:03 says the tracenet, and that half is open. The chain's mine knows no tracenet: it counts only the USDC a flask's own key deposited, 10 or more at a time, so a tank whose one mint is a tracenet would mine here and never there.
2. **His own Nov 4 tracenet.** This ledger holds it, so his tank mines. The ring reads the Nest, where he had it reset, so it shows none. No other account holds a mint today. One
   word on `/tank`, said by `MINTED` and read by the ring, makes them one, once both lanes stand.
3. **Whether gold mined before a mint counts after it.** Built: what a tank already mined counts as before; what its prompts burned before its mint mined nothing and is not given after. Each
   row keeps its dollars and its instant, so if he rules that it counts, one statement can give it.
4. **Where a person mints while the page's minting is off.** What answers now: the deposit door on mainnet (a flask from 10 USDC), the card road (`card: true`, $10), the tracenet's price (0.1 SOL,
   $7.01). What is off: `PREMINT_ENABLED` is "false" in the site's config (the NFT's checkout).
5. **Stakers and tanks poured by his hand.** A tank fed by a stake's rewards, or by a refill of his, holds no mint by itself and mines nothing until its holder mints. Read as his 14:33 says it: the
   pentagon is the capital, the hexagon the agent that prompts.
6. **A hexagon's 10 dollars mine only as they are spent; a tracenet's are spent, and mine, at once.**
7. **Three public sentences**, true of who minted: `app/warm.html` 170 ("every $1 your Swarmy burns in the Space Router mines 1 $WARM"), `app/agent.md` 10 and 19 ("every prompt mines $WARM").

## The proofs (the new Mac, nice 19)

| | |
|---|---|
| `node --test worker/*.test.mjs app/space-router-law.test.mjs app/dl-twelve.test.mjs` | 180 of 180 (main 179) |
| the home's: `space-tanks`, `minirouter-openai-shim-tanks`, `-messages`, `pool-crank` | 35 of 35. The purse door's own test: one tank, 0 before its mint row, 0.021 after it, the door running |
| the 31 test files the lane reaches (the house gate's own selector) | 258 of 259; the one red is main's own ("the phone carries the page's own files", `dl-handoff.test.mjs`, red on main 22d09dd4ac by the same name). |
| the two ledgers' tests, twelve files at once, three times | 36 of 36 (the first cut's) |
| 26 wrong versions of the code, one at a time | 26 red: the gate taken out, nobody mining, an unminted call reading the share the mine gave last, any tank's hexagon, a deposit with no place, the newest deposits looked at, the twelve largest (the first cut), the oldest twelve alone, a refill or a model by a tracenet's name, the mint judged at the burn, either index missing, a database behind 0020 answering, what stood taken away |
| `space-router.proof.mjs`, the wire, curl as the stranger | nothing minted: 200, $0.102795, `x-space-router-warm: 0`; its egg minted: 0.102795. The tank after: 2 calls, 0.102795 mined |
| `space-router-oracle.proof.mjs` | 24 lines hold |
| rule 8 (the mint's folder; no page changes): `app/dl-twelve.test.mjs`, and `app/dl-twelve.proof.mjs` on this tree's `warm.html` served by `tools/serve-range` (206) | 21 of 21; `--tap button` PASS, `--tap sphere` PASS |
| the plan of `MINTED` on three SQLites (node 3.54.1, the system's 3.51.0, D1's) | two index searches, no table scanned, nothing sorted; pinned by the test |
| the gates (JavaScript, look, any room, one room, no page of its own, the pixel, the plists, the Canvas's name, the room bare) | 63 of 63 at the first hand; on e6fef479c8 the first six files again, 57 of 57, and the law table under the lander's guard, 8 of 8 |
| this lane, `lane/the-door-signs-the-seat` (db8e3765aa, on main now), `lane/one-name-for-her` (d5ac202355) and `lane/the-gold-is-for-who-minted` (6a8d995a66) merged in one tree | no conflict; the twelve test files of the Space Router's doors, the egg, the seat, the wish, the tracenet and the gold: 98 of 98 |
| the screen gate that refused it, run here under the lander's own guard | on main before its mend: exit 2, could not judge. After it: green, the site untouched, its 1705 built files byte-equal on the lane and its base |

**What pays for the JavaScript.** `lab/mint-freeze-dolbar.mjs` (277 lines): it built a figure of the freeze that the page no longer enters, its one export is named nowhere, and the two notes that name the
file say it is out (its twin, `mint-freeze-environment.mjs`, goes with the egg's lane for the same reason). This lane's own lines are +46. At its first hand they were paid by one stand-in of D1 on SQLite for
the seven tests and proofs that each carried a copy; `lane/the-door-signs-the-seat` wrote the same file for more of them in the same hours and landed first (e6fef479c8, 17:03:15), so this lane takes that one.
The two ledgers' headers no longer repeat quotes that their receipts hold. Of the three tests whose database skipped one migration and ran the later ones, the one that skipped 0015 now stops before it, as D1
would (the same line as in the egg's lane).

**The number.** This lane's migration was 0027 at its first hand. 0027 is `0027_the_seats.sql` (the door's lane) and 0028 the egg's, so it is 0029. It makes two indexes on tables that stand since 0012 and
0015, so it may be applied before or after the other two.

## Refused once, and why

2c6b825c51 was refused at 16:19:33 UTC on one red: the gate that landed at 16:04:47, no landing adds a failing screen, "could not build the base's site". That build asks the Nest at 127.0.0.1:8904 for the
receipt of each tracenet drop (`tools/build-optimism-fit.mjs`), and the lander's guard refuses a test any live port. So it was red on every lane that touches `embertide-app/ui`, whatever it held: this one was
the first, then the door's and the egg's. Its author (claude-6c2484aa) found the same cause at 16:22 and mended it, `lane/the-screens-gate-asks-no-door` (635072cef4, 17:01:39).

## What it does not do

- **Nothing is deployed.** The press applies 0029 before it deploys; a Worker with this and no 0029 answers right, at the last column's cost.
- **The chain.** `warm_mine` mines every spend its miner posts. The crank that will post them is on no lane: it must post only the burns whose `warm` is above 0.
- **`/tank` and the ring** are the first half's. Nothing here reads or writes a purse.

## The gate

`worker/space-router.test.mjs` and `lib/space-tanks.test.mjs`, on every lane that touches them. No gate yet on the live half: the measure it waits for is the burn rows of calls (`why` null)
written after the Worker that holds this whose `warm` is above 0 on a tank with no hexagon and no tracenet, read at the press (none expected).
