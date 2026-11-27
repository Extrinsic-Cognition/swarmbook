# THE PANTHEON READS THE FUND (Nov 23 2026, seat claude-41008c71)

His words, UTC: 16:01 "ok... but like... hypertrace all the times we tried to figure out futarchic user interfaces..."; then, over two cards of that
trace (ec-workspace `docs/the-governance-visualizations-...-2026-11-11.md`, its section 9; the Canvas, the Claude page, "The futarchy, every try"):
the Nov 7 Pantheon ("A split goes to the futarchy") and Inside the Neghiverse ("The market only on a split"), "these please".

Read with his newer rulings on the same screens: the meta swarm's twelve pentagons are the Sanctuary's twelve houses and its first, Gemini, is
Nefertiti (Nov 20 2026, NEFERTITI IS THE GEMINI HOUSE: "nefertiti as the house of gemini is for the metaswarm... lyssajudrons colored pfps are only
hexagons"); "the unit1 satellites of the diving lyssajudron are the houses of the pantheon" (Nov 22). So the Nov 7 Roman gods and her seat at the
oculus are not drawn; their places are the houses and Gemini.

## What changed

The meta swarm's own society page on Swarmbook (`app/polis.html?civ=0`: unit 0, the root polis, "The Root, Tipped" on devnet) wears a fourth tab
beside The room, Decisions and Charter: **The Pantheon**, the Nov 7 Pantheon's right column read off the chain. Every other society's page is unchanged
(the tab stays hidden).

- **The season**: the Fund's cycle, "Season 1", and where the slot stands in it: when it ends (an hour of the clock, written once, never ticked), or
  "ran out · it rolls at the next write" (a cycle that has run its slots rolls at the Fund's next write, `poleis-client.js` settleCycle).
- **The thrones**: the Fund's twelve chairs as the Sanctuary's houses, Aries to Pisces by chair (`swarmbook-floor.mjs` HOUSES, read, never copied); a
  seated chair is gold and names its society; Gemini wears the front's pool blue and says Nefertiti (`SEALED`), as both balls do; "N of 12 thrones
  seated, by the fees a society brings".
- **The road**: the Fund's current option, its manifest in the Gold and Silver unowns (no words on chain), the stakes on it as marks on the Fund's
  range, each mark as tall as its stake, and the price: each staker's value weighted by its stake.
- **The ladder**: every society's fee tally by this season's fees, the seated in gold, and the first unseated with fees marked "takes a throne at the
  roll".

Paid for: `app/tracenet-reader.mjs` (53 lines) and `app/tracenet-projects.mjs` (24), which no file of the house names (their one reader, the tracenet
profile, left on this afternoon's THE SWARM RESTS ON ITS CHAIRS).

## Numbers

| | |
|---|---|
| devnet read, layout 8, slot 525,491,281 | season 1 of 1,800 slots, started at slot 494,190,058: ran out, never rolled; 0 of 12 chairs seated |
| the ladder | The Root, Tipped 250,000 lamports this season (275,000 lifetime): takes a throne at the roll; A Test Swarm 25,000 |
| the road | one option, vetted, staked by two: 30 % at weight 2, 50 % at weight 1; priced 36.7 % of the Fund (its range 20 % to 80 %) |
| cost at rest | nothing: the tab is drawn on a chain change (`refreshAll`), never on the page's clock; the houses' module loads only on unit 0 |
| JavaScript and HTML (the gate's count) | +40 -89, net -49 |
| desktop 1440 by 1000, phone 390 by 844 | the tab drawn whole; nothing past the edge (the tabs wrap on a phone, the thrones four a row); 0 page errors |

Driven by `tools/house-mirror/spool/board/pw-cdp.mjs`: headless Chromium off every screen, the site served by `tools/serve-range` from this tree, on
devnet. THE THIN LINE's page shows no tab.

## Tests and gates

- `app/polis-rite.test.mjs`: red on main (`polis-state.js` has no `pantheonOf`), 7 of 7 here: the season, the seated chair, the ladder by fees, the
  challenger, the price from the road's own stakes only, no road with no current option; the tab on unit 0 only; the tab in place.
- The app's tests: 575 of 579 (the 4 red are main's own: dl-athena, dl-handoff, dl-paywall, warm-sphere-moment).
- `the-javascript-only-shrinks` 31/31, `the-look-is-a-law` 2/2, `no-page-of-its-own` 3/3, `the-pixel-is-a-lookup` 3/3, `any-room` 12/12.
- `no-landing-adds-a-failing-screen` (both shards, on 8e0185a02f): 18 cells of the built site judged in each, 0 new failing, 0 to take out.
- Rule 8 on this tip (no film, no sound touched): `node --test app/dl-twelve.test.mjs` 21 of 21; `nice -n 19 node app/dl-twelve.proof.mjs --url <this
  tree's warm.html, served by tools/serve-range> --tap button` PASS, `--tap sphere` PASS.

## The two designs, part by part

| Nov 7 | Today |
|---|---|
| twelve thrones of software | this lane: the Fund's twelve chairs, as his houses |
| Nefertiti at the oculus, proposing roads | his Nov 20 word puts her in Gemini: drawn there |
| the season clock | this lane: the Fund's season; the $POOL unlock is owed (the pool is not born) |
| the throne, its stake-time, its $POOL | owed: no chair is seated, and stake-time is on no chain |
| the challenger at the gate | this lane: the first unseated society with fees |
| her road, PASSED, both chambers | this lane: the Fund's road and its stakers' price; a ballot's two chambers: the page's own (Chairs, Riders) while it is live |
| "A split goes to the futarchy, in $WARM" | owed: the decision market (`poleis/program/poleis_roads`) is on no chain |
| the ladder of stake-time | this lane: the ladder by fees, as the program seats a throne |
| your two votes | the page's own, for a member, while a ballot is live (A RIDER STEERS, Nov 22) |
| your posiverse, its subscribers | Harmony's Tracenet tab (YOUR TRACENET IS YOUR SWARMS, landed 16:21 today) |
| your throne in the pool, Pool more, accumulate or allocate | owed on this page; the stake is the mint page's (Stake in her, Nov 22) |

## Not proven here

- A seated throne and a season in course: devnet has none today; both are the same function's other branch, pinned by the test, not driven.
- A member staking a value on the road (`poleis-client.js` stake): not built here.
