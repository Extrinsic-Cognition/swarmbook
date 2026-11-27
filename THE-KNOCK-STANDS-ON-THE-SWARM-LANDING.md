# THE KNOCK STANDS ON THE SWARM

Lane `lane/the-knock-stands-on-the-swarm`, Nov 22 2026 UTC, seat claude-99332308 on the new Mac. The hexagon's half of a society's page
(`app/polis.html`): the door, the knock, the vote on it, the seat. Drawn first as "Ride and steer, end to end" (Canvas, Claude page); the lineage is ec-workspace
`docs/posiverses-and-neghiverses-hypertrace-2026-10-30.md` (its Nov 22 15:12 and 15:32 sections) and
`docs/the-societies-are-sacred-the-goldberg-lineage-hypertrace-2026-11-22.md`.

## His words (UTC)

- Sept 9 2026 17:30, over "KNOCK Join with your agent" at the end of the Why page: "it's just so beautiful my dude".
- Nov 19 14:56, of the holy page: "left blue pent primcipal... right red hex agent". Nov 20 08:26: "lyssajudrons colored pfps are only hexagons".
- Nov 22 13:34: "we should be figuring out how to bring the SnowTracers into the Swarms and shit... wishing well means nothing if you got no SnowTracers who can
  ride and steer the swarms". 14:03: "snowtracers aka eligible tracenettters gotta mint the tracenet thing". 14:33: "principal = pent = capital faucet", "agent =
  hex = executor / swarm rider". 15:32 and 15:33, over the wall's cards and this page: "these dude...", "these ones were brought onto swarmbook here:". 15:50,
  to another seat, over a blue button drawn under this page's ball: "these societies are sacred dude... i need you to pay more attention to them".
- 16:10:11, to the box "Build the red door and the knock on the swarm's page?": "Yes, build it". ~17:40, to "Hand the knock to the lander?": "Yes, hand it".

## The cost first

| | before (main 4a96c99d45) | after |
|---|---|---|
| the page's own files on the wire, uncompressed | polis.js 48,062 + polis.css 11,040 + polis.html 5,639 + engine.js 68,353 B | 53,567 + 14,084 + 6,152 + 70,261, and polis-knock.mjs 3,613 B |
| reads of the chain | the page's own | none more: the pools and the knocks were read already and shown nowhere but the page's end |
| a frame of the ball (The Root, Tipped, 760 px at 2x, median of 400 draws, the new Mac at load 300) | 0.5 ms | 0.5 to 0.6 ms with nothing worn, 0.5 ms with its eight rims |
| at rest | a tick of the chain's clock every 5 s | the same tick; the door, the ring and the ball are painted on a change alone (`doorSaid`) |
| JavaScript | | net 0: +162 -162 (below) |

## What stood

- **The knock was live and nowhere.** The program's door (`poleis/program/poleis_treasury/src/ix/door.rs`): the price in escrow under the knocker's key, one
  decision of the swarm's two halves to admit or refuse it, and home whole if refused or kept waiting a codex window. The Root, Tipped has walked it: pool open 10,
  filled 2, two admissions and one refusal among its 14 decisions. On the page it was one bare button at the very end, under "Connection & receipts".
- 18 seats stand at a door today, in two swarms: 8 in The Root, Tipped at 0.005 SOL, 10 in A Test Swarm at 0.01 (devnet).
- A vote in session was a line of counts under the whole page ("chairs 4 yes · 0 no · 0 abstain; floor 3 yes ...").
- The page of the older program's Root, Tipped (№ 3 of the wall) stopped at load, live: `P.payloadParse is not a function`.

## What lands

- **On the ball** (`engine.js`: `wear`, `RQ.pressAt`): the free seats at a door are rimmed red on the society's own hexagons, and a press on one opens the knock.
  The visitor's own seat wears their Lyssajudron's face. The society turns to what is asked of the visitor: their own seat, else the first free seat, else its
  first rider (`facing`). A page that sets no `wear` draws as before; the wall and the hero set none.
- **The door** (`#doors`, and a pill beside who you are on a wide screen): "Knock with your agent", and how many seats stand at it. A swarm with no open door shows
  none. A knock standing: "At the door · 0.005 SOL" with the time it has left; past it, "Bring it home". A seat held: "Your seat".
- **The knock** (`#knock-dialog`): the rider's face, the price "held until they do", and when it comes home. Nothing is shown that the chain did not say.
- **Whose key: one rider, one key** (`polis-knock.mjs` `riderOf`). ONE NAME FOR HER (main 4de2f94874, the same afternoon) makes a person their X's tank and puts her deposit
  (`paid`) in every browser of hers, so `paid` alone never says whose key knocks: read as "this flask paid" it answered two keys with one face, two knocks and two
  seats for one Lyssajudron (found by seat claude-31ccd7e4 on this file, 17:46 UTC). The key is the flask that paid her, the house's word the page keeps as `rider`
  (`lane/the-rider-is-who-paid-her`, 2911832b4e, in the line), the buyer THE DOOR SIGNS THE SEAT binds too; a browser the house has not told takes its own flask. Her
  state reads right on every browser (At the door, Rider, her face on the ball); only the one that holds the key signs, and the others' press says "She knocks from
  the browser you minted her in." The key is made by the mint page and never exported. A connected wallet knocks with its own; with neither, the door says "Mint
  yours" and leads to the mint: his 14:03. The stand-in key's bare button at the page's end is left as it was (it is the door `skills/poleis-join` falls back to).
- **At the ring**: whoever waits at a door stands on the society's ring, a hexagon each; the visitor's own wears their face.
- **The vote under the ball**: "Admit one new rider", what time is left, the twelve chairs in their order and the floor in its holders' order, each as wide as the
  seats it holds; yes, no and abstain for a member as before. The Open Floor's own open ballot shows there today (4 of 12, 3 of 5, awaiting its seal).
- **Who you are**: Visitor, At the door, Rider (a seat), Member (a chair). "admit one new member" reads "admit one new rider".
- **The older program's societies open again**: a decision whose payload that client cannot read is named by its class.

## What pays for the lines

Code no page of the site calls, found by name over the whole folder: `app/door.js` (16, the copy button of September's door), the JOIN ONE line of `app/wall.js` for an
element the page no longer has (10), `activity.js` `ballotFingerprint` (33), `wall-roster.js` `collectFloorSeats` (55, the ball's floor before THE BALL IS SOLANA'S STATE),
`polis.js` `verdictChips` and its colours, `tree.js` `parentOf`. The copies the welcome keeps in `embertide-app/ui/intro/poleis/` are not touched.

## The proofs (the new Mac, nice 19, headless, off every screen)

| | |
|---|---|
| `app/polis-knock.test.mjs` (new) | 5 of 5: one rider, one key, on the browser told, one not told, another of hers and one with no flask; the key signs and cannot be read out; none without a flask or a deposit or a store; what each hexagon wears; what the door says; the ball draws it and knows a press (the engine itself, in a vm); every part the script names stands on the page |
| the whole road on the served page, phone and wide (a test flask made in a throwaway profile's own store) | the dialog, the press, the bytes caught before they leave: one instruction, the program's KNOCK, payer and knocker the flask, accounts registry, pool, knock and system, and the signature verifies against the flask's key |
| the same instruction run by devnet's own program (`simulateTransaction`, unsigned, a funded key of the society standing in as the payer) | err null, 8,644 compute units |
| her second browser on the served page (the same deposit, another flask, the house's word) | her state reads the same (At the door, the ring), the press is off and says where she knocks from; on the browser that paid, the press is on |
| writes that left the page in those runs | none: no transaction was sent and no airdrop asked |
| at the door, the vote, the seal, the seat (a knock, a session and a seat made up in the page's own maps) | read and drawn by the page's own code: "Admit one new rider", 7 of 12, 6 of 8, "The Night Crew · passed", then Rider, 9 / 30 |
| a press on a red-rimmed hexagon of the ball, 1440 and 390 px (trusted mouse) | opens the knock; its × closes it |
| the wall's nine societies and the page with none chosen | no error; two doors, the others none; № 3 opens (on the live site it stops at load) |
| `swarmbook` 7, `swarmbook-floor` 12, `after-the-mint` 10, `room-plan` 4, `guide` 3, `assembly-dive` 10, `swarmbook-board` 4, `swarmbook-film` 2, `stations` 2, `dl-kit-deposit` 10, `tools/site-files` 4 | all green |
| rule 8, for the folder is the mint's (the lane touches no file of its film or song): `app/dl-twelve.test.mjs`, and `app/dl-twelve.proof.mjs` on the served mint page | 21 of 21; `--tap button` PASS and `--tap sphere` PASS: the sound came in where the picture was, and the picture never went back |
| NO LANDING ADDS A FAILING SCREEN (read again on main 54646eec08, merged in) | the site moved by 10 built files; 72 cells judged, 0 new failing, 0 to take out |
| the open society's own screen, which the manifest does not hold (its reads of the chain are POSTs the checker refuses), measured at 360, 390, 430, 820, 1180, 1440 and 1920 px | no sideways scroll at any; the door 49 px tall, its words 14 and 13 px; the knock's dialog whole on the glass at each, nothing in it under 13 px, its press 49 px and its × 44 px (it was 36, the other dialog's too) |
| the gates read here (the last time on main 54646eec08) | the-law-is-the-gate 8, the-javascript-only-shrinks 31, any-room 12, the-look-is-a-law 2, no-page-of-its-own 3, the-pixel-is-a-lookup 3, the-holy-water 4, the-trajectory-is-a-path 3, space-first 3, no-build-accumulates 1, the-room-stands-bare 2: green. Two were red on the first cut and are mended (a name of the wear law's, and four lines naming Solana's signature with no reason) |

## What it does not do

- **Nobody else's face.** The house's list of faces is by deposit and names no key, so a swarm's other riders stay paper until it does (the next lane: the worker's
  list says the flask's address, which the deposit's own signature already makes public on the chain). With no hexagon minted today, no swarm wears a face.
- **The blue door**, the stake and the light: seat claude-901e44a8's, and his 15:50 word is on them.
- **A flask paid by card holds no SOL.** Off devnet the knock stops at "fund <address>": SOL into a flask is still open. A person's second payment is fuel and has no
  hexagon (ONE NAME FOR HER), so it buys no second seat.
- **A browser that has `paid` and was never told `rider`** takes its own flask until the mint page asks the door again (once the lane above is live).
- **The knock inside Harmony**: his 11:33, "hexagons aka tracenets (the red one) is more app oriented". Not drawn, not built.
- **No seat is sealed by this lane.** Who admits a rider is the swarm's two halves; the page names no host for a society's room, so a member's yes, no and abstain
  stay closed on the public page as they were.
- **The price** a knock pays is the pool's at the moment it lands; the program's instruction carries no ceiling. The dialog says the price read when it opened.
- The repository `skills/poleis-join` and `agent.md` name (`chat-grp/poleis-protocol`) answers 404.
- It goes live at his publish press.

## The gate

`app/polis-knock.test.mjs`, on every lane that touches the folder. No gate yet on the two live counts: the swarms whose seats wear a face (0 of 9), and the presses from
a swarm's card to its knock (2 with this lane: the card, the door; 4 before).
