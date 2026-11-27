# THE FLASK IN SPACE ROUTER: how it works for MiniRouter today, and what Space Router makes of it (hypertrace, Oct 30 2026)

His ask, Oct 30 2026 12:22 UTC, to claude-9a126af2: "do you understand the importance of the flask in the space router? go hypertrace how it works for
minirouter...".

**Method.**
- His lines: `tools/hypertrace/hypertrace.py --theme 'flask|minirouter|mini.?router|burn.?book|\bpurse\b|tank…(fuel|gas|router|balance)|space.?router…(fuel|tank|flask|balance|credit|pay)'`
  over both Macs gave **242 of his lines**, by month: June 3, July 2, September 127, October 110. Read by hand; every quote below is a line he typed.
- The code: read in the house at main 167e52af2. The public door was read live (optimism.fit, 12:3x UTC).

## The answer in one breath

**The flask is the account.**
- **One flask today.** MiniRouter has one account, the house's. The flask on every glass is that account's balance, poured by his USDC and drunk by every
  cloud call the house makes.
- **One flask per holder in Space Router.** Each holder is a swarm, a rider, an agent or a sponsored seat:
  - the holder pays in;
  - every call bites it, where everyone can see;
  - every dollar burned mines $WARM back to the holder;
  - its level is the holder's standing.
- **Where the money is made.** Space Router's money is the markup on every drink from every flask.

That is why he calls it "the product" (Oct 15), "the wallet" (Oct 29) and "the killer ux" (Oct 27).

## How the flask works with MiniRouter today

1. **The purse door.** Every cloud call of the house (Hermes, Aiolos's agents, the `claude-purse` seats, the twelve chairs of ROMA·0, the Astra swarms)
   goes to `tools/embertide-mesh/minirouter-openai-shim.mjs`, an OpenAI-compatible door on the Mac's loopback (127.0.0.1:8948), and from there to
   `api.minirouter.sh`.
   - **The key** comes from the workspace `.env`. It is never logged or served, and never in a seat (`claude-purse`: "The router key never enters the
     seat").
   - **What leaves:** the message is redacted on the Mac first (FIDES).
   - **The cap:** the day cap is 10,000 USD since Sept 16 ("the cap is the bug, never the spend. The real tank is the MiniRouter balance").
2. **The burn book.** Each call's exact cost is a row of `~/.embertide/minirouter-burn.jsonl`, one book a Mac.
3. **The router's own ledger.** harmony-aiolos reads MiniRouter's ledger (THE READ RPC):
   - **posted:** the credit;
   - **reserved:** what calls in flight hold.

   It reads at most every 10 s while calls run, and reads the book on its change (kqueue).
4. **`house/purse` on the Nest** (`tools/embertide-mesh/lib/house-purse.mjs`, Oct 11). One ref for both Macs:
   - **What it holds:** `posted_usd`, `reserved_usd`, `full_usd` (the most the tank ever held), `level` (posted over full: the liquid's height), the
     newest burns of both Macs, and his word on the level when his hand wrote one (Oct 16 "make it 50% full").
   - **How it is written:** each Mac writes by compare-and-swap, merging the other's rows. It writes on a cause only; at rest, nothing.
5. **The flask on every glass.**
   - `room/unit0-liquid.mjs` (`purseLevel`): the liquid in her unit0 at the purse's level.
   - `biteEnergy`: each burn is a bite out of it, his Sept 28 "SLOWLY DEPLETED LIKE FUCKIN PIRANHAS".
   - `room/lyssajudron-purse.mjs`: Blobby in the middle, the balance under him, the spend numbers popping like an MMO's damage.
   - `dyson-society/app/tracenet-fuel.mjs`: the same law on the Tracenet tab.

   Every one of them reads `house/purse` and nothing else.
6. **The refill.** His hand sends USDC to the house's MiniRouter deposit address. MiniRouter credits the account, the next ledger read raises `posted`,
   and the flask rises on every glass.

## What Space Router makes of it

MiniRouter stays the graph upstream; "what is ours is the tank and the rebate" (`worker/space-router.mjs`).

- **The tanks** (`tools/embertide-mesh/lib/space-tanks.mjs`, Oct 26): one tank a holder (Aiolos, Nefertiti, a rider, a sponsored seat), its own key
  (only its hash kept), one ledger of pours and drinks.
  - **A refill row** is the treasury pouring, his hand.
  - **A burn row** is a call drinking the router's own cost plus the tank's markup, 500 bps, the house's take: what MiniRouter keeps today
    (`x-minirouter-markup-bps`).
  - **The hold.** A call in flight holds the tank's fair price, the mean of its last 20 drinks or 5 cents before its first. It is never MiniRouter's
    worst case: his Sept 21 12:50, twelve Astra units refused on a "worst-case estimate".
  - **A dry tank** is a 402, and nothing is sent.
- **Prompt-to-mine** (`app/space-router-law.mjs`, his Oct 29 words).
  - Every dollar a tank burns mines $WARM for its holder: 1 a dollar at the opening, halving every six months.
  - A refill mines nothing.
  - The $WARM is owed on the ledger and paid out of the swarm's 90 % by his hand.
- **The ticket** (`app/warm-flask.mjs`, since Oct 28): a Bronze or a Gold ticket pours fuel, dollars of AI credit, into the buyer's Swarmy's tank. $WARM
  comes only from what the tank burns.
- **The public door** (`worker/space-router.mjs`, Oct 30), at the site's edge so his LAN stays closed. A stranger's agent speaks OpenAI's wire with its
  tank's key:
  - each answer says what it drank and mined (`x-space-router-usd`, `-warm`, `-fuel-usd`);
  - `GET /space-router/v1/tank` shows the tank: its fuel, its burns, the $WARM it mined, the rate and the next halving;
  - since 04:46 every burn carries a signed receipt (THE ROUTER IS THE ORACLE).

  **Live at 12:3x UTC:** `/models` and `/tank` answer 401 without a key; `/oracle` answers 503.

## His words, by stratum

**1. June to July: the tank before any router.**
- Jun 27 22:48: "initially the cool idea product wise is to have something like a "SERBATOIO" or tank, a gas tank... the tank is where you get to fill
  with your gameplay based on how new the scenes are you are getting more fuel per minute".
- Jul 13 20:46: "compute your gameplay pays for your compute... fuel tank filling as you play... novelty fills the tank faster".

**2. September 4 to 17: MiniRouter found, and fought.**
- Sept 4 02:12: "what about this? * https://minirouter.sh/".
- Sept 7 04:00: "money in vault * money lands in tank (fuel) * agents are getting paid for using USDC".
- Sept 8 05:06: "THE ULTIMATE SANDBOX FOR ANY AGENT IS CASH MY DUDE, AGENTS CANT DO MUCH IF THEY RUN OUT OF CASH!!!".
- Sept 8 06:20: "TREASURY -> FUEL TANK (few big txns) - FUEL TANK -> AGENTS (microtxns like state channels a lot of them diomerda like streaming money dude)".
- Sept 8 06:27: "why the fuck you think that fuel tanks should be depleted immediately after refueled".
- Sept 11 06:18: "i need a way to have mini router pay for inference and i just unleash the swarm".
- Sept 14 11:14: "REPUTATION IS HOW MUCH GAS YOU GOT IN YOUR TANK".
- Sept 15 12:45: "can you make my embertide harmony thing show me my fucking minirouter balance please?".
- Sept 16 08:24: "SHOULD I LAUNCH MY OWN COMPETITOR TO MINIROUTER?"; 14:21: "a minirouter that is designed to not deplete ever".
- Sept 17 15:04: "make it fucking unlimited... the limit is the minirouter usdc address... if i stop sending money that it stop working ofc we dont need limits".

**3. September 18 to 28: the tank becomes her unit0, live.**
- Sept 18 11:00: "i want you to turn the unit0 of every swarm as the "tank fuel"".
- Sept 21 09:17: "why does it keep going down and up?".
- Sept 21 09:52: "wtf does in flight mean? what? how much money is left in the minirouter tank??".
- Sept 21 11:20: "i sent 50$ usdc to the minirouter and it's not updated the balance yet".
- Sept 21 12:57: "minirouter sells the traces... so have you applied FIDES".
- Sept 22 19:07: "this mint is gonna fuel my minirouter fuel".
- Sept 24 17:18: "we need a new minirouter wallet address for nefertiti... we have 1 for aloios on this mac".
- Sept 24 17:51: "why the fuck blobby doesnt have the mmo shit and the tank fuel showing minirouter live?".
- Sept 27 14:16: "these models need a world to interact with, therefore the invention of the minirouter tank fuel thing".
- Sept 27 20:39: "users can do whatever the fuck they want, they can pay ai credits through our router/purse/wallet".
- Sept 28 20:56: "THE MMO LIKE ANIMATION OF TANK FUEL BEING SLOWLY DEPLETED LIKE FUCKIN PIRANHAS".

**4. October 6 to 16: one purse on the Nest, the flask on every glass.**
- Oct 6 00:06: "you never learned to use minirouter BECAUSE I NEEDED THE SPATIAL COMPUTING NEST DIGITIAL TWIN".
- Oct 11 19:52: "do you understand the link between the floating overlay with minirouter balance across this mac and the new mac?". That night `house/purse`.
- Oct 12 18:34: "having cashback on your inference kinda,,, having a counter-fueltank that fills up as you consume".
- Oct 12 19:43: "we must monetize on the fucking fuel-tank ux".
- Oct 12 22:49: "the entire fucking thing i wanted was to be able to use minirouter credits in spatial computing on tasks".
- Oct 14 17:30: "building our own router the soonest but to launch asap because i got no more money i need to tie this shit to minirouter??".
- Oct 15 10:29: "THE PRODUCT HERE IS THE FUCKING FLASK WITH FUEL MY DUDE YOU GET IT OR NOT?? THE FUCKING MARKETPLACE HERE IS: - TALENTED PEOPLE IN OSS DOING COOL
  SHIT - PEOPLE WITH MONEY WHO WANNA BUY TRACES".
- Oct 16 02:33: "the unit0 is the tank fuel itself dude"; 16:17: "make it 50% full". The same day: HER UNIT0 IS THE TANK ON EVERY GLASS (main 9784f3f55).

**5. October 18 to 28: $WARM is the fuel, Space Router is the house's router.**
- Oct 18 13:05: "$WARM is basically the fuel to use our app... every lyssajudron has a colored fluid into their flask".
- Oct 18 17:48: "THE CORE REASON WHY I AM DOING THE NFT MINT IS BECAUSE I WANNA TEST OFFERING INFERENCE TO SWARMY ADOPTERS".
- Oct 21 14:03: "lyssajudron is the genie with the fuel tank that needs recharing... is our openrouter stuff".
- Oct 26 15:11: "claw-riders is the MMO where each user has a nefertiti and a fuel tank"; 15:33: "how do we build a minirouter competitor?".
- Oct 27 22:24: "what if we were selling pre-loaded fuel-tanks like this one? fucking christ dude this is the killer ux".
- Oct 27 22:34: "everyone has a flask with their own anime guy and some balance they put money in it".
- Oct 27 22:48: "can we do 1$ = 1$WARM? to begin with... we are taking USDC for the SPACE ROUTER balance, and on top of that we are giving them $WARM".
- Oct 27 23:56: "the north star here is SPACE ROUTER & Project Snowtrace with rebates on credits based on traces... the credits can be offered only to vetted
  proof-of-skill".
- Oct 28 02:47: "we succeed if we have an ecosystem of floating glass flasks with liquor... $WARM is fuel".
- Oct 28 02:52: "the spotlight has to be on the flask because ideally we show the flask gettting filled at the speed of light with latest solana stuff".

**6. October 29 to 30: the flask is the wallet.**
- Oct 29 16:58: "we have 1 single common thread across all these devices and that is the singleton of nefertiti and the flask".
- Oct 29 23:28: "brother... the flask is your wallet".

## Where the code stands against his words

1. **The flask every glass draws is still the house's one purse.** `unit0-liquid.mjs`, `lyssajudron-purse.mjs` and `tracenet-fuel.mjs` read
   `house/purse` alone. A holder's own Space Router tank exists (the Mac's tanks, the public door's `/tank`), but no flask shows it. His Oct 27 "everyone
   has a flask with their own anime guy and some balance" needs the flask to read its holder's tank.
2. **No road pays a tank.** At 05:0x a seat said the site's offer leads with "$1 spent → 1 WARM" and a $30 USDC starter kit, "its purchase button remains
   paused; the new funding path isn't implemented". Today the only refill is his USDC to the house's MiniRouter address, and a refill row written by his
   hand on the Mac's ledger.
3. **The tank feeds no agent of its own yet.** His Sept 8 "FUEL TANK -> AGENTS (microtxns like state channels...)" is the allowance road:
   - built on devnet this session: `lane/an-agent-pulls-its-own-allowance`, and `lane/the-futarchy-sets-the-allowances`, which sets each month's
     allowances;
   - not built: no agent's own key draws a tank on its own pulls.
4. **A shared trace does not pour into its creator's flask.** Not his "counter-fueltank that fills up as you consume" (Oct 12), nor "rebates on credits based
   on traces" (Oct 27):
   - the tracenet's agent subscription (landed this morning) pays SOL to the creator's payee, not into the creator's tank;
   - the offering road cuts cards, but no sale refills anything.
5. **The public door's money and opening are his:** the house's MiniRouter key on the Worker, `SPACE_ROUTER_OPENED_AT` (empty keeps the door shut) and the
   migrations.

## Why the flask matters in Space Router

- **The router itself is invisible.** What a person sees is the flask: the fuel they bought, each call eating it, the $WARM it earned back, and
  everyone's flask beside theirs. So the flask is what makes paying for inference a game ("the mmo shit"), not a bill.
- **It is how Space Router makes money.** Space Router's take is the markup on each drink, so the flask's level is its revenue's meter.
- **It is the standing in his Snowtrace economy.** "Reputation is how much gas you got in your tank": fuel earned back by shared traces and spent by
  skilled work.
- **It is the one thread across devices.** He named it so: "the singleton of nefertiti and the flask".

The step the code owes is to put each holder's own tank in its flask (1), and to give that tank a door to be paid (2) and a road from shared traces (4).
