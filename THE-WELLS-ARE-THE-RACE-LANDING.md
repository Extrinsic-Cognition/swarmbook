# THE WELLS ARE THE RACE (Nov 23 2026)

Lane `lane/the-wells-are-the-race`, seat claude-bd202a7f on the new Mac, cut from main 68039c6e7f. The page after the mint showed the wells and a
small Pantheon that said nothing of each other. Now a well says its place on the Pantheon's ladder, and the small Pantheon names its twelve thrones,
lights the one the next fee takes, and is the door to the Pantheon.

## His words (UTC, Nov 23 2026)

- Over the Pantheon's page and the wells, side by side: "u get the connection between them?"
- "draft first dude" (the draft: the Canvas, the Claude page, widget `d05ea814`).
- Over the draft: "hold on... i think you are missing that in swarmbook it's not harmony macos app... it means that you dont seem to understand what
  nefertiti and dante AND THE CUSTOM PFP CHARACTER MY DUDE" (the corrected draft: widget `f94db61c`).
- Over his fork's figure of the swarm of swarms (the Pantheon: each pentagon a whole swarm, its centre the common pot; a swarm: each pentagon a
  person; a person: Nefertiti, or you): "ok... u know this?", then "ok, so? what does that translates into?"
- To "Build the wells' race and the small Pantheon's thrones now?": "Yes, build both".

## The cost first

| | main 68039c6e7f | this lane |
|---|---|---|
| a well | its treasury and its seats | its rank and its fees this season, the throne it takes when it is the challenger; treasury and seats last |
| the wells' order | the Fund's seated by fees, then seals this week, seats, treasury | this season's fees first (the Pantheon's ladder), then the seated, then as before |
| over the wells | nothing | one strip: the season and the thrones taken, or which throne the next fee takes; a link to the Pantheon |
| the small Pantheon | twelve nameless chairs round the pot | the twelve thrones by name, the next one lit, the whole picture a link to the Pantheon; the pot stays its centre |
| a seated society's chair | its place in a list sorted by fees | its own chair of the Fund |
| asks | | one more module, after the bar, that the society page already ships (`polis-state.js`) |
| at rest | | one throne's opacity (none under reduced motion) |
| JavaScript | | +10 −10, net 0 |

## What lands

- `app/after-the-mint-book.mjs`: the wells read the Pantheon's own law, `polis-state.js` `pantheonOf` and `GODS`, the function the society page draws
  its hall from; never a copy. A root of another generation of the program races in no Fund.
- `app/after-the-mint.html`: the strip; the small Pantheon as a link (`polis.html?civ=0#hall`).
- `app/swarmbook-book.css`: the strip, the rank, the fees, the thrones' names, the lit throne.

## What the page says today, read off devnet

Season 1 ran out and never rolled; 0 of 12 thrones are taken. By the program's rule a season that ran out rolls at the Fund's next write and its
tallies go stale, so there is no challenger: the strip reads "Season 1 ran out · the next fee takes IVPPITER" and IVPPITER is lit. The Root, Tipped is
first with 250,000 lamports this season, A Test Swarm second with 25,000; A Test Swarm enters the four wells and The Split leaves. The draft had said
"The Root, Tipped takes IVPPITER at the roll": the law says otherwise, and the page follows the law.

## Not built (named to him)

- **The characters.** Every person who holds a pentagon is still drawn as Nefertiti: the choice (Nefertiti, Dante, one's own) lives only in Harmony's
  opening and does not reach the site.
- **The Pantheon's own page** (another seat's): her at the oculus where his fork's figure puts the common pot; a throne does not open the swarm inside.
- **The ladder's rows as balls**, on that page.
- The leader's ball on a thread to its throne, as the draft drew it: the lit throne and the well's own line say it instead.

## The proofs (the new Mac, nice 19)

| | |
|---|---|
| `app/after-the-mint.test.mjs`, `swarmbook-film`, `polis-rite`, `riders`, `polis-knock` | 24 of 24: a well's rank, fees and throne; the strip's two states; the thrones' names, the next lit, a seated society on its own chair; the page reads `pantheonOf` |
| `app/dl-twelve.test.mjs` (The rule, 8; no film and no sound touched) | 21 of 21 |
| `app/dl-twelve.proof.mjs --url <the lane's warm.html, served with ranges by tools/serve-range> --tap button`, and `--tap sphere` | PASS and PASS: the sound came in where the picture was, and the picture never went back |
| `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs` | green: +10 −10, net 0 in 3 files |
| the screens gate (`no-landing-adds-a-failing-screen.1.sh`, `.2.sh`) | 36 cells judged (18 a shard), 0 new failing, 0 to take out; green in 70 s and 68 s |
| main's built site with this lane's files laid over it, behind the Worker's own handler on an empty D1, a headless engine off every screen, on devnet, at 390 by 844 and 1280 by 900 | the strip, the four wells in the ladder's order with their fees, the twelve names round the pot, IVPPITER lit, the door's address; 0 page errors |

## No gate yet

The measure it waits for: the wells' order and the Pantheon's ladder read off one chain state and held equal by a check in a headless engine; today
the test pins that the page calls the Pantheon's own function.
