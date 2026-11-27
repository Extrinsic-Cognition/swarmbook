# THE TICKET BUYS FUEL: $WARM only on the burn, in the Space-Router (Oct 28 2026, claude-0f7e9ef2)

His words, Oct 28 2026 13:50 WET, asked whether the money spent in a Swarmy counts when it is paid in or when it is burned: "no when burned... we
should give $WARM only when money is spent in the SPACE-ROUTER". His go for this lane came by the marketing plan's next-step button (lane 5 of
`plans/the-marketing-plan-2026-10-28.md`).

## What changed

- **The Space-Router owes $WARM for burns alone.** `tools/embertide-mesh/lib/space-tanks.mjs`: `WARM_PER_USD = 1` (his Oct 27 "1$ = 1$WARM? to
  begin with", one number), `warmOwed(drunkUsd)`, and every tank's `state()` carries `warm_owed`, folded from its burn rows. A refill (a ticket's
  fuel, a pour) owes none; a call at a house door burns $0 and owes 0. `space-tanks.mjs ls` prints what each tank's burns owe. Nothing is minted.
- **The offer says the ticket buys fuel** (`embertide-app/ui/intro/dyson-society/app/`):
  - `warm.html`: the offer's line is "Your ticket is his fuel, spent as AI credits in the Space-Router. Every burn gives you $WARM. Every ticket
    also builds Project Snowtrace." (was "$WARM is his fuel. Buy it like GTA Online cash..."); the $WARM card is "Given only as your Swarmy burns
    his fuel in the Space-Router, never with a ticket. Uncapped." (was "The fuel, uncapped... Your ticket fills it."); both tickets' bullet is
    "Fuel for your Swarmy" (was "$WARM, cash for your Swarmy"); the free way is "without fuel" / "with no fuel" (was "without $WARM"); the
    galaxy's line is "It's time to fuel your Swarmy." (was "It's time to get $WARM.").
  - `index.html`: the mint's kicker, "It's time to fuel your Swarmy."
  - `dl-athena.js`: "What do I get?" answers "Fuel for your Swarmy, and the published code. $WARM comes only as he burns it."
  - `dl-athena.mjs`: her line "Agents burn the fuel in this flask. Each burn gives $WARM. Burn your cosmos." (was "Agents run on $WARM, the fuel
    in this flask."); the $WARM figure's words "Given as his fuel burns." (was "The fuel. Your ticket fills his tank.").
  - `warm-flask.mjs`: the cards' standing words "Fuel for your Swarmy"; POUR now reads as the fuel a ticket pours, in dollars (still his, still
    null), and its card line, once set, "$10 of fuel in your Swarmy's tank"; a header note says how to read his October words under the ruling.
  - Comments that stated the free way's law (`dl-paywall.js`, `tracenet-register.mjs`) say "with no fuel".
- Left as they stand: the "30% of every seat fills the tank of Swarmy, Solana's companion" line (his ruling 7 in the plan, open), the
  "JOIN THE $WARM" cry, the fees page's "$WARM has not been minted. There is no sale.", and the records in `lab/PAYWALL.md` and
  `app/tracenet/LANDING.md`.

## The numbers

- `tools/embertide-mesh/lib/space-tanks.test.mjs`: a new test. A $10 refill owes 0 $WARM; one burn of $0.0105 (a $0.01 call at 500 bps) owes 0.0105;
  a house-door call owes 0; a second refill owes 0. The CLI test reads "owes 0 $WARM" after a pour.
- Every test in `app/` (47 files) and the tanks test, on main and on the lane, this Mac at nice 10: 44 pass on each, the same 4 files fail on
  each (`dl-athena.test.mjs` THE DEPTH, `dl-glass.test.mjs`, `dl-paywall.test.mjs` the ice and accent tokens, `warm-sphere-moment.test.mjs`):
  main's own, no new red.
- Rule 8, `dl-twelve.proof.mjs` (named for `dl-twelve.test.mjs`'s law) on the lane's `warm.html` served by `tools/serve-range` with `--tap sphere`:
  PASS, all seven checks (the sound came in where the picture was; the film never went back).
- The look, headless Chrome for Testing on the lane's served pages: the mint section draws whole (the offer's line, the $WARM and $POOL cards,
  both tickets with "Fuel for your Swarmy", the free way "without fuel"), the front page's kicker under "Minting the Dyson Society." reads
  "IT'S TIME TO FUEL YOUR SWARMY.", and no page threw.

## His

- optimism.fit changes only with his deploy (`REFERRALS.md`: `node tools/build-optimism-fit.mjs`, then `npx wrangler deploy --config
  wrangler.optimism-fit.jsonc`). Until then the live offer still promises $WARM with the ticket.
- The 30% to Solana's Swarmy, now that every seat has its own (the plan's ruling 7).
- No tank is open yet (no `~/.embertide/space-router` on the old Mac): nothing has burned and no $WARM is owed.
