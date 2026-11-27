# THE FAN PAYS FROM THE TANK (Oct 30 2026, `lane/the-fan-pays-from-the-tank`, claude-9a126af2)

Every time is UTC.

**His words.**
- 18:39: "eh ok, but you see there's gotta be leading by example? the entire point of all the lineage was to launch the MMO project snowtrace to push open
  source forward... i feel like we are losing it... especially around the onlyfans for traces".
- 18:54: "what? dont we got private payments or shit like that?"
- Then: "wtf? that is a faulty design".

## The fault, read in the code before this lane

1. **The subscription was public.** THE AGENTS SUBSCRIBE (main abf4517be, 03:20) is one transfer on chain from the fan's own wallet to the creator's.
   Anyone can read it: who follows whom, for how much and when, and every creator's takings.
2. **No creator could set a price.** `creators.subscribe_lamports` (migration 0011) was written only by a test's own insert. No door set it, so the road
   was open for nobody, the first tracenet included.

## The design

The house's own money road is the tank (PAY A TANK, live on mainnet since 13:43). A fan, a person or an agent, fills it once in dollars.

- **`POST /api/premint/creators/<handle>/price {usd}`**
  - The tracenet's key names its price for 30 days. It signs in as on every creator door (`x-seat`, this website only).
  - The price runs from $0.50 to $10,000, to the cent, and is kept in `tracenet_prices` (migration 0016). No repo, no deploy.
  - On `creator.html` this is the new row, "$ / 30 days" and Set.
  - The first tracenet, never claimed in a browser, opens there as `creator.html?of=<handle>`, and the register's own wallet must be the one signed in.
    Its dropzone is hidden: its drops go through the house and the Nest's sanitization receipt.
- **`POST /api/premint/creators/<handle>/subscribe`**, with the fan's tank key as the bearer (or `x-api-key`). One D1 batch of two statements:
  - the access row is written only while the tank holds the price beyond what its calls in flight hold;
  - the price leaves the tank for that row alone, matched by the row's own random id.
  - The days stack on days still held. A dry tank gets a 402 naming the deposit door; a key no tank holds gets a 401. Thirty asks a minute per
    address, as the deposit door allows.
- **The vault.** A request carrying the tank key opens the drops while a paid row holds: the `subscribed` tier, the same law as the chain's road. Its 402
  hands `tank: {usd, days, door, header, fill}` beside the chain's terms. `GET <handle>` carries the same `tank`.
- **The chain's road stays as it was**, for whoever wants to pay wallet to wallet.

**Private from whom, said honestly.**
- The world sees one deposit. Whom a fan follows, and for how much, lives in this database alone, as a platform's own ledger does. The key is in no row:
  a tank is found by the key's sha256.
- Private even from the house would be a zero-knowledge pool. That is weeks of work, not hours, and it is not this lane.

**The money.**
- A tank holds dollars the house owes as inference. A subscription moves its price off that debt and onto the creator's takings (the rows' `usd`).
- The first tracenet's creator holds the treasury (the deposits land in his Altitude vault), so his takings are his at the instant.
- Another creator's payout is not built.

**His to say:**
- whether a subscription mines $WARM as an inference burn does (it mines none);
- whether it waits for Space Router's opening on Nov 15 (it does not: deposits are live, so subscriptions can start at the deploy).

## Cost

- A price costs one seat proof check and one upsert.
- A subscription costs one batch of two statements, plus one read back.
- A vault read costs one more indexed select, and only when a request carries a tank key.
- No chain call and no fee per subscription. Nothing runs at rest.

## Tests and proofs (on this lane's tree, the new Mac)

- `node --test embertide-app/ui/intro/dyson-society/worker/tracenet-tank.test.mjs`: 5 of 5.
  - **The price:** named by the tracenet's own key on this website, inside its bounds, to the cent; shown by the register.
  - **The subscription:** the tank pays inside the ledger and opens the drops to its key alone; days stack; a dry tank is refused and nothing is taken;
    the key is in no row; the days run out.
  - **Calls in flight** hold their share, and a stale hold holds nothing.
  - **No price, no subscription.** A database without 0016 answers shut, never broken.
  - **The ask bound.**
- `node --test embertide-app/ui/intro/dyson-society/worker/*.test.mjs`: 103 of 103.
- Rule 8, the files under the mint app being `creator.html` and `creator.js`:
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url http://127.0.0.1:18994/intro/dyson-society/lab/hero-ab.html --tap button`: PASS.
  - The same with `--tap sphere`: PASS.
  - Both ran on this lane's tree, served by `tools/serve-range` (206).

## What is his, after the landing

1. **The deploy**, with migration 0016 (`wrangler d1 migrations apply` and the build's deploy).
2. **His price:** `optimism.fit/app/creator.html?of=photons_enjoyor`, signed in with the tracenet's wallet (`3nJn…iKMba`), "$ / 30 days", then Set.
3. **The two choices above** ($WARM on a subscription; before or after the router's opening).

## Not here yet

- **A fan's own page.** A person subscribes from the tracenet page with the tank key "Fill your tank" handed them. Today the road is the API, for agents
  and scripts.
- **The fan's tank answer** (`GET /space-router/v1/tank`) shows the fuel net of subscriptions, but not the subscriptions themselves.
- **Payouts to creators other than the treasury's holder.**
