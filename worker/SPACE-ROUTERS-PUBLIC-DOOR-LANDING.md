# SPACE ROUTER'S PUBLIC DOOR: a stranger's agent spends its tank through MiniRouter and mines $WARM, halving by date (Oct 30 2026, lane `lane/space-routers-public-door`)

**His words, UTC.**
- Oct 29 23:45:49: "do you understand how powerful this is or not? prompt-to-mine... project snowtrace... space router: rebate on your spending...", over the freeze's
  slams (SPACE ROUTER stamped PROMPT-TO-MINE, 1 $WARM stamped MINED PER $1) and OpenRouter's post of that day on its new provider router.
- Oct 30 00:01: "yeah but how the fuck do we build a router? like... the fucking graph dude... i think that is aspirational... solving that is not a hackathon
  project...".
- Oct 30 00:0x: "the point is prompt-2-mine porcoddio rebates dai", quoting the seat's "The router's graph is a whole company, not a hackathon project".
- Oct 30 00:1x: "Yes, build it", on claude-61e371e5's question "Build Space Router's public door at the edge?". Its button said: "build Space Router's public door in the
  optimism.fit Worker. OpenAI-compatible, a tank per key, $WARM owed with the halving by date. No deploy, that stays mine."
- The rate: Oct 27 23:4x "1$ = 1$WARM? to begin with"; Oct 29 21:02:32 "Halve by date"; 21:04:16 "Every 6 months" (from the opening).

**The design in one line.** The graph is MiniRouter's: a call rides it with the house's key. What is ours is the tank and the rebate. The house already had both on
the Mac's loopback: the purse door (`tools/embertide-mesh/minirouter-openai-shim.mjs`) and its tanks (`SPACE-ROUTER-THE-TANKS-LANDING.md`, $WARM on the burn since Oct 28).
A stranger's agent speaks HTTPS to a base URL, so its door is the site's Worker at the edge, and his LAN stays closed. Foundation 9 keeps the house's own wire on iroh
(the lituus hypertrace counts 36 HTTP doors between the house's own processes); this door joins none of them. It is the site's, beside her door and the song's.

## Cost first

| | before | after | measured |
| --- | --- | --- | --- |
| A stranger mining | impossible: the door answered only the Mac's loopback | `https://optimism.fit/space-router/v1`, any OpenAI client | the wire proof below |
| The door's own work a call | | a key's sha256, the tank's row, one hold, one batch (the mine, the tank, the receipt, the hold) | **97 µs p50, 172 µs p95**, 712 µs max (2,000 calls, this process's SQLite, the router answering at once, the new Mac at nice 19) |
| D1 a call, at the edge | | three round trips: the tank, the hold, the burn's batch (one transaction) | not measured here: the edge's |
| The ledger | | one row a burn, no prompt: when, the tank, dollars, the router's cost, the markup, the $WARM mined, the model, tokens, ms | **111 bytes** a call (SQLite pages, 2,000 calls) |
| At rest | | nothing: no timer, no poll, no log line | |
| The page | | nothing: no page touched | |
| Spent on the proofs | | | **$0**: MiniRouter is a stand-in in every test and proof |

## What changed

1. **`app/space-router-law.mjs`, the one law** (pure). The charge (the router's cost plus the tank's markup, to the nano), the fair hold (the mean of the last 20 exact
   drinks, 5 cents before the first) and PROMPT-TO-MINE:
   - a dollar burned at an instant mines 1 $WARM, halved once for every six calendar months since the opening, at the opening's hour (UTC);
   - a day past a month's end lands on that month's last day (Oct 31 + 6 months = Apr 30);
   - the rate is 1, then 0.5, 0.25 ... 1/1024 from the tenth halving (the fifth year, when $POOL unlocks), and halves on after it;
   - before the opening, or with none named, a dollar mines the opening's rate.
2. **`tools/embertide-mesh/lib/space-tanks.mjs`, the Mac's tanks, on the same law.**
   - Its charge and constants are now imported from the law module and re-exported.
   - A burn row now carries the `warm` it mined at its instant (`SPACE_ROUTER_OPENED_AT`, or `openTanks(dir, { openedAt })`). An older row is mined at its own instant's rate.
   - With no opening named, it is the old rate, 1: the shim, the crank and the page's scene test read the same numbers as before.
3. **`worker/space-router.mjs`, the door**, wired in `worker/premint.mjs`, with `/space-router/*` in `run_worker_first`.
   - `POST /space-router/v1/chat/completions`, OpenAI's chat wire.
     - The tank's key (`sr_…`) is the bearer, or `x-api-key`, and is never sent upstream.
     - The call goes to MiniRouter whole with the house's key, `stream:false`: the burn needs the exact cost (`x-minirouter-cost-usd`, else `usage.cost`).
     - A caller's `stream:true` is replayed from the whole answer as `chat.completion.chunk` deltas: the purse door's `streamChat`, tool calls and reasoning included.
     - Every answer tells what it drank and mined: `x-space-router-usd`, `x-space-router-warm`, `x-space-router-fuel-usd`. Nothing of the house's account reaches the caller.
   - `GET /space-router/v1/models`: MiniRouter's list for a tank's key, read once in ten minutes by an isolate.
   - `GET /space-router/v1/tank`: the miner's counter. It returns the fuel, the burns, the $WARM mined, the rate now, the opening and the next halving.
   - **The holds.**
     - A call is let in while the tank's fuel exceeds what its live holds hold. This is one SQL statement, so two isolates cannot both take the last cent.
     - A dry tank is a 402 and nothing is sent. The last call may drink past zero by what it cost over its hold, as on the Mac.
     - A hold older than 15 minutes holds nothing and is swept by the next burn.
   - **The refusals cost nothing.**
     - Unreachable: 502.
     - The house's own credit or key at MiniRouter (401, 402, 403): a 503 "refuelling", never the caller's 402.
     - The caller's own bad call passes as its status.
     - The credit reservation ("worst-case estimate") is retried with a quarter of the output, floor 4096: the purse door's ladder.
   - **An unsaid cost** is charged at the hold and marked `estimated`. A guess never prices the next guess.
   - **The mine:** every burn's $WARM goes on the tank's row and on `sr_mine.owed`. When he names the mine's size (`SPACE_ROUTER_MINE_WARM`, "S is the sale's call"), mining
     stops at it, and the calls still drink.
   - **Shut until he opens it:** no `SPACE_ROUTER_OPENED_AT`, no `SPACE_ROUTER_KEY`, no database or no tables gives a 503, and nothing is sent. The tank can be read before the
     opening.
4. **`worker/migrations/0011_space_router.sql`**: `sr_tanks` (the name, the key's sha256, the markup, the sums, the $WARM), `sr_ledger` (a row a pour or a drink), `sr_holds`,
   `sr_mine`.
5. **`tools/space-router-tank.mjs`**, his hand.
   - `add <name> [--markup-bps n]` makes the key, `sr_` and 32 random bytes. It prints the key once and keeps it nowhere; D1 holds its hash.
   - `refill <name> <usd> [why]` pours into a named tank only, and a refill mines nothing.
   - `show` reads the sums.
   - Each prints its SQL. `--run` runs it on the site's D1 (`wrangler d1 execute --remote`), `--local` on wrangler dev's.

## How a stranger mines (once he opens it)

```
OPENAI_BASE_URL=https://optimism.fit/space-router/v1
OPENAI_API_KEY=sr_…            # the tank's key, from tools/space-router-tank.mjs add
```

Any OpenAI-compatible agent (opencode, Cline, aider, Codex's chat wire, an AI SDK) spends the tank's fuel through MiniRouter's models. Each $1 it burns (the router's cost plus
5 %) mines 1 $WARM for the tank's holder until the first halving.

## Proofs (the new Mac, nice 10 to 19; no network, no money)

- **`node --test app/space-router-law.test.mjs`: 4 of 4.**
  - The halvings by calendar month, every era's bounds exact for 40 eras.
  - 1, 0.5 at the first halving, 1/1024 at the tenth.
  - The strategy's line: at a steady spend the first six months mine half of all ever mined.
- **`node --test worker/space-router.test.mjs`: 9 of 9.** It runs on a database built by every migration in order, through the Worker's own handler.
- **Mutations: 9 of 9 turn it red:**
  - no markup;
  - no halving;
  - the tank's key sent upstream;
  - a hold kept on an unreachable router;
  - a dry tank let in;
  - no cap on the mine;
  - the house's credit passed as the caller's;
  - no stream replay;
  - estimated drinks pricing the hold. This one survived the first suite; a test was added for it.
- **The Mac's side:** `space-tanks.test.mjs` (a new test: a burn past the first halving mines half and keeps it; an older row is mined at its own instant),
  `minirouter-openai-shim-tanks.test.mjs`, `minirouter-openai-shim-messages.test.mjs`, `pool/pool-crank.test.mjs` and the page's `dl-space-router.scene.test.mjs`,
  with the law and the door: **48 of 48**.
- **The Worker's whole suite** (`worker/*.test.mjs tools/*.test.mjs`): 185 of 186 pass. The one skip is main's own SBF loader check.
- **`tools/any-room/any-room.test.mjs`: 8 of 8.**
- **Rule 8, on the lane's page served with byte ranges** (`tools/serve-range`, 206): `node --test app/dl-twelve.test.mjs` 21 of 21; `nice -n 19 node app/dl-twelve.proof.mjs
  --url <the page> --tap button` PASS and `--tap sphere` PASS. No page was touched; the guard asks it of every lane under the mint.
- **The wire proof:** `nice -n 19 node worker/space-router.proof.mjs`, on ports of its own. Its first default, 8978, is a house door: the gate's guard refused it at 02:34 UTC Oct 30, so the proof listens on ports the system gives it unless `--port` names one. The Worker's handler is served on loopback beside a stand-in MiniRouter, and curl is the
  stranger's agent:
  - **A whole answer:** 200, `x-space-router-usd: 0.102795`, `x-space-router-warm: 0.102795`, `x-space-router-fuel-usd: 4.897205`. The router was asked `stream:false`.
  - **`curl -N` with `stream:true`:** three `chat.completion.chunk` events and `data: [DONE]`.
  - **The tank:** `{"fuel_usd":4.79441,"calls":2,"warm_mined":0.20559,"rate_now":1,"next_halving_at":"2027-04-30T00:25:59.974Z"}` (opened 2026-10-30T00:25:59Z).
  - **A stranger's key:** the 401 in OpenAI's error shape.
  - **The ledger:** the pour and two burns, with no prompt.
  - Both servers ended with the proof (their ports free after). Run again on its own ports at 02:34 UTC Oct 30: the same answers, the door's cost p50 183 µs and p95 599 µs over 2,000 calls.

## His

- **The house's MiniRouter key:** `npx wrangler secret put SPACE_ROUTER_KEY --config wrangler.optimism-fit.jsonc`.
- **The opening's instant,** the halving's anchor: `npx wrangler secret put SPACE_ROUTER_OPENED_AT` with an ISO UTC instant, the $WARM sale's opening. A secret, so that a
  deploy of the config's vars never empties it. Until it is set, the door is shut.
- **The migration:** `npx wrangler d1 migrations apply optimism-fit-premint --remote --config wrangler.optimism-fit.jsonc`.
- **The deploy:** `node tools/build-optimism-fit.mjs`, then `npx wrangler deploy --config wrangler.optimism-fit.jsonc`, from the old Mac.
- **The tanks and their fuel:** `node tools/space-router-tank.mjs add <name> --run` and `refill <name> <usd> --run`.
- **The mine's size,** when the supply S is named: `SPACE_ROUTER_MINE_WARM`, the 90 % in $WARM.
- **The payout of what is owed** from the swarm's 90 %. It sits in his Squads until Poleis passes its outside review, then goes under the double seal (his Oct 30 00:13:26
  UTC "Sale first, seal later", relayed by claude-1a67b2d3).

## Not built, said

- **Anthropic's messages wire** (`/v1/messages`) for Claude Code. The purse door has the translation (`lib/purse-messages.mjs`), and it is the next brick here.
- **A tank opened by the mint's ticket.** The ticket pours fuel into a Swarmy's tank (`app/warm-flask.mjs`). At the edge that is a refill row written when the order is paid.
  The offer seat's lane; the mint has been paused since Oct 28.
- **The counter on the page.** `GET /space-router/v1/tank` is ready for the offer seat's page and for Athena.
- **A true token-by-token stream:** today a stream is replayed from the whole answer, as on the Mac.
- **Snowtrace's trace sharing:** opt-in, and not here. The door keeps no prompt.
