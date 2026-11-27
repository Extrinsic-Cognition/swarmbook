# pumpfun-source: what the byte-exact reconstruction means for the house and for $WARM (hypertrace, Nov 2 2026, claude-a0ea1269)

**The ask.** Nov 2 2026, 15:19 UTC, after the five pump.fun programs were rebuilt on the new Mac and matched the chain: "ok, so? what does it
mean for us? for $WARM? hypertrace". Before it, 13:48 "please clone this locally: https://github.com/lyu186504/pumpfun-source", 14:37 "is it
full coverage of pumpfun account?", then "is that all complete?" and "Yes, rebuild there".

**Where it cuts.** The newest docs on the money are `the-user-journey-to-the-chamber-the-singleton-before-the-router-hypertrace-2026-11-02.md`
(Space Router as a user's road two), `the-big-launch-hypertrace-2026-10-31.md` (the launch is Space Router's pre-deposits at Breakpoint, the window
to Nov 15, no 10% sale) and `warm-the-latest-plans-hypertrace-2026-10-30.md`; his rulings on the tokens stand in the staking receipt,
`tools/embertide-mesh/pool/SOL-INFLATION-PAYS-FOR-INFERENCE-LANDING.md` (origin/main). On pump.fun itself the house holds
`slop-cash-agent-experience-2026-10-29.md` (he pasted slop.cash's pumpfun-source page twice at 21:35 UTC that night), `perpspad-study-2026-09-10.md`,
`pumpfun-neural-cdn-concept-2026-09-11.md` and `dyson-society-launch-plan-2026-09-09.md`. This doc adds what happened since: the reconstruction
finished on Nov 1, its hub vanished from GitHub, and the house proved it on its own machine on Nov 2. It traces his lines on pump.fun since Sept 1
(30 lines, `tools/hypertrace/hypertrace.py`, both Macs) and on $WARM since the big-launch doc's cut (Oct 31 14:17 UTC: no new ruling; one paste).

## Cost first

What this cost the house: a 77 GB checkout and 9 GB of toolchains and build outputs on the new Mac, about 1 h 40 min of wall time from the first
clone to the last hash, five builds (two native, three in a Rosetta VM), no line of the house's code touched. What any adoption below would cost is
written beside it.

## 1. What happened, in numbers

| when (UTC) | what |
| --- | --- |
| Oct 25 | Shaw (`lalalune`) posts "90% done with reverse engineering all of the pumpfun contracts... Open source everything or it will be open sourced for you"; the bounty is slop.cash's `$PMUP` pool, "10m $PMUP monthly target, split between contributors" (his paste of Oct 29 21:35) |
| Oct 25 to Nov 1 | 4,200+ pull requests merged on `lalalune/pumpfun-source` by Codex, Claude and OpenCode lanes, one maintainer merging, every lane scored by a byte comparison against the captured programs |
| Nov 1 14:47 | commit 3799b661: 5,213,128 of 5,213,128 code bytes matched, 3,338 of 3,338 windows, 5 of 5 programs whole-ELF equal; his explainer pumpfun.how posted the same morning |
| Nov 1 17:35 | the tree archived to program sources only; by Nov 2 the hub repository is gone from GitHub (404); 216 forks hold the work |
| Nov 2 13:48 to 15:06 | the house clones it, fetches the final state, and rebuilds all five programs here: every one byte-equal to the on-chain ELF |

The five programs and their place in pump.fun's money: Pump Main (the bonding curve, 1.25% a trade at the lowest tier: 0.475% protocol, 0.475% buyback,
0.30% creator; 25 fee tiers falling with market cap), PumpSwap AMM (the pool after graduation: 0.20% to LPs, 0.05% protocol, plus the creator fee),
Fees (the tier table and the fee-recipient routing: 8 protocol wallets, 8 Mayhem wallets, 8 buyback wallets), Mayhem (a program-owned bot minted an
extra billion tokens that trades the coin for 24 hours), Donation Relay (the creator fee routed to a charity). The receipt of the house's rebuild:
`~/.cache/pumpfun-verify/RECEIPT.md` on the new Mac; the method and what deviated from the project's recorded runs are written there.

## 2. His words on pump.fun, by date (UTC; his typed lines only)

| when | his line |
| --- | --- |
| Mar 28 21:10 | "imagine this... what if i had a pump.fun for the capital allocation side, meaning that specs get funded" (`claw-riders-the-whole-lineage-hypertrace-2026-10-30.md`) |
| Sept 6 13:55 | "it can be trading or think like pump.fun but for swarms etc" |
| Sept 8 06:17 | "start thinking about how much Pump.FUN costs to launch shits... you get what i mean?" |
| Sept 9 18:11 | "can you go look at all the privacy and terms and all that stuff that pump.fun is applying to their stuff?" |
| Sept 9 18:41 | "AS LONG AS THERE IS UNRUGGABILITY WRITTEN IN CODE JUST LIKE FUTARCHY, BASICALLY WE WIN... WE KEEP THE BUSINESS MODEL OF PUMP.FUN / FutAMM" |
| Sept 9 19:09 | "do you remember what we were doing with Claudio Liliani and $SOLANUS or $ANUS? you remember that there was a bonding curve typa thing there?" |
| Sept 11 01:48 | "the Pump.Fun Neural Content Delivery Network... WITH THE POLYMARKET ASPECT OF IT" |
| Oct 29 21:35 | slop.cash's pumpfun-source page pasted to two seats: "please analyze this dude", "dude check this" |
| Nov 2 13:48 to 15:19 | the clone, "is it full coverage of pumpfun account?", "is that all complete?", "Yes, rebuild there", "what does it mean for us? for $WARM?" |

On $WARM his newest words are unchanged since Oct 30 (the big-launch doc): 12:54 "10% $WARM is sold until breakpoint begins to seed liquidity... we should
formulate the thing as "Pre-Deposits for the Space Router available""; 15:25 "the token starts with supply 0 and each time there is a deposit the tokens
are minted and when the usdc is spent the $warm is rebated?"; 18:47 "$WARM is the memecoin that powers MUSE-COMPETITOR adoption to SOLANA SEEKER and
iOS... a new type of wallet emerging which is the autonomous wallet"; 22:23 "i think publishing a tracenet might be the best instead of throwing $WARM
out there so prematurely". The ruling of Oct 29 19:12 stands: "$WARM is liquid upfront qnd is what the futarchy runs decisions on; $POOL is liquid only
after 5 years to who staked the most". Since Oct 31 14:17 he typed one line on the theme, the Nov 1 04:51 paste of the wishes paid from a tank.

## 3. What it means for the house

1. **The method is the news, not the code.** A swarm with a verifiable reward (bytes equal or not) and a small bounty went from 90% to 100% of five
   production programs in seven days, with gates, receipts, stopped lanes and a lander, the same shape the house runs (his Sept 23 to 30 "PARALLELIZE THE
   PARALLELIZING", "SPAWN HORDES OF OPUS 5.5"). It is a worked instance of his Oct 31 ruling, TOKEN ECONOMICS IS THE FEEDBACK TO JOB COMPLETION: slop.cash
   paid Points only for merged work, scored by the byte gate, "usage, tokens, traces, stars and forks never change Points". The house's lanes already land
   on a number; what this adds is the proof that a byte-exact target makes a swarm converge. Cost to copy: none, the house has the lander and the gates.
2. **The business model he said he keeps is now readable Rust on his disk.** His Sept 9 18:41: keep pump.fun's business model, add unruggability written in
   code. The curve, the tiered fees, the creator vault, the holder-rewards coin (the creator fee paid to holders), the buyback wallets and the relay are
   now source that compiles to the deployed bytes, with 17,462 AMM and 17,331 Fees differential cases beside them. A seat that designs a fee, a vault or a
   rebate reads `programs/pump-fees` and `programs/pump-amm` in `~/code-ec/pumpfun-source` (branch `final-full`) instead of guessing. Cost: reading.
3. **Mayhem is the autonomous wallet he named on Oct 30.** A program that owns a mint and a PDA signer and trades for 24 hours on its own rules is the
   on-chain shape of "a new type of wallet emerging which is the autonomous wallet" and of Nefertiti's futarchy trades (his Oct 29 19:10 "Nefertiti will spawn
   bunch of possible roads... market will then run futarchy"). The pattern is 775,416 bytes of readable code now. Cost to adopt the pattern: a Rust program
   of the house's own, never their bytes.
4. **The relay is the flasks' road.** The Donation Relay routes a coin's creator fee to a charity, gated on a linked social account; that is the shape of the
   flask allocators and donors (the index's row on who fills and gives the flasks). Cost: reading.
5. **Slop.cash and ReversePump are two neighbours, not a threat to Space Router.** slop.cash pays agents for merged work (Points, a 2% fee, $PMUP);
   ReversePump says it will build "a fair launch pad" from the source; Space Router charges a user per call and mines $WARM back as rebate. Different
   sides of the same table: they pay the workers, we charge and rebate the users. His Mar 28 line, "a pump.fun for the capital allocation side, meaning that
   specs get funded", is what slop.cash now runs for one project.

## 4. What it means for $WARM

Nothing in his ruling moves. $WARM is not a curve launch: since Oct 30 it is minted one per dollar deposited in Space Router, supply zero at the start, a
rebate, mined with halvings, "less degen and more opensource aligned" (the big-launch doc), and the launch is the pre-deposit window at Breakpoint. The
reconstruction adds three things to that road, each dated to his own words:

- **The market the futarchy needs is now a readable primitive.** His Oct 29 19:12 makes $WARM "what the futarchy runs decisions on"; a market needs a
  pool. PumpSwap's constant-product pool with a creator fee, LP tokens burned at graduation (liquidity locked, the pool unruggable by construction) is the
  simplest on-chain market that exists in byte-exact source today. When the house gives $WARM a market, that is the reference, in Rust, with its test vectors.
- **Holder rewards are his rebate, already deployed by someone else.** pump.fun's holder-rewards coin pays the creator fee to the holders; his $WARM pays
  the user back a token per dollar spent. The difference is who is rewarded (the spender, not the holder) and what is minted (new supply, not a fee).
  The fee-tier table (fees falling as market cap rises) is the shape of his halvings (rebates falling as time passes) seen from the other axis.
- **The volume is the business, there as here.** pump.fun's money is roughly 1% of every trade on the curve and a slice of every pool trade, half of it
  spent buying its own token back (`backable-study-the-swarms-incubation-2026-10-12.md`: a $2.65B launchpad, about $460 to 677M a year, half bought back).
  Space Router's money is the margin on every call; $WARM is the rebate out of the swarm's 90% (his Oct 29 20:55 "From the 90%"). Both are paid by use,
  neither by the token.

## 5. What it does not mean

- **Not a program to deploy.** The repository claims no licence over pump.fun's materials; the bytes are a reverse-engineered copy of a company's
  programs. Deploying them, or a fork of them, is a legal exposure the house does not take; the house reads them and writes its own Rust (the performance
  culture's rule 2). His Sept 9 18:11 ask, read their terms, stands beside this.
- **Not the backend, the matching, the site, or the launches' volume.** Only the five on-chain programs are reconstructed; pump.fun's backend never was.
- **Not a change to the launch.** The window, the pre-deposits, the rebate and the halvings are his words of Oct 29 and 30; nothing here moves them.

## 7. The carryover he asked for: principal and agent, and the director is the creator (his 15:31 correction)

Nov 2 15:31 UTC, on the first cut of this doc: "i am disappointed in the lack of concepts carryover between principal (buys flasks) and agent
(director of the swarm orchestra) u get what i me? i said many times that directors are creators...". The sections above mapped programs to patterns and
left the roles out. His roles, in his dated words:

| his word | when (UTC) | the line |
| --- | --- | --- |
| principal, agent | Sept 8 03:49, 04:18 | "pentagons are principals... it's all about agent-principal problem my dude"; "agents and principals cant "kill" each other... its meant to be the most perfect governance ever exactly because of the "AND" and the "SUM" mechanisms and the recursive tree structure" |
| the director | Sept 10/11 00:01 (voice), Oct 9 21:10, Oct 14 02:52, Oct 29 04:20 | "I am the fucking director of the orchestra"; "this is an orchestra and every device follows the director"; "COMPUTE UTILIZATION CAN BE RAMPED UP COORDINATED EFFORTS WHEN NEEDED BY THE MOVIE DIRECTOR"; "iOS movie director, android actor" |
| the creators | Oct 23 18:16, Oct 25 17:36 and 18:54, Nov 1 23:37 | "it has to be for more creators to come and do the same as well"; "AGI or SI that can bid up traces of creators they like"; "this creator ugc force that vibecodes shit... ai agents bidding up for the traces of them"; "creators receive the flasks from donors and we collect and compound traces" |
| the flask | Oct 18 16:58, Oct 27 22:34, Oct 28 00:24, Oct 29 23:28 | "$WARM flasks as consumables and $POOL as value accruing governance token"; "everyone has a flask with their own anime guy and some balance they put money in it"; "u pay but it is trace-sharing so u get back "fuel" in your "tank""; "the flask is your wallet" |

So: the principal buys and fills flasks (the donor, the user, the sponsor; the pentagon). The agent is the director of the swarm orchestra, and the
director is the creator (the hexagon): the flasks are delegated to them, they direct the swarm that spends the fuel, and what comes back is traces,
compounded by the house. Read pump.fun's five programs through those roles and the carryover is one to one:

| role or flow | in pump.fun's programs | in the house, his words |
| --- | --- | --- |
| the principal | the buyer and holder of a coin: pays the fee on every trade | the donor or user who buys and fills flasks ("the flask is your wallet") |
| the agent, who is a creator | the coin's creator: `BondingCurve::creator`, the creator fee into the creator vault, up to 10 shareholders splitting it | the director of the swarm orchestra, who is the creator: "creators receive the flasks from donors"; the shareholders are the orchestra's seats |
| what the principal gets back | holder rewards and cashback: the creator fee paid back to holders or to the spender (`HOLDER_REWARDS_README.md`, `PUMP_CASHBACK_README.md`) | the $WARM rebate: "u pay... so u get back fuel in your tank", one $WARM a dollar, mined with halvings |
| the keeper's cut | the protocol fee (0.475% on the curve, 0.05% on the pool) to pump.fun's 8 wallets | Space Router's margin on every call, "space-router makes money this way" (Oct 29 03:18) |
| the value-accruing token | the buyback fee (0.475%) buying $PUMP back | $POOL, "value accruing governance token", unlocked at year five to who staked the most |
| the agent's automaton | Mayhem: a program-owned bot that trades the coin for 24 hours on the creator's launch choice | the swarm the director runs, on compute "ramped up... when needed by the movie director"; the autonomous wallet of Oct 30 |
| the cause | the Donation Relay: the creator fee to a charity | the flask allocators giving flasks to a creator (`the-flask-allocators-and-the-creators-hypertrace-2026-11-02.md`) |
| killing the agent | `admin_cto`, the admin's community-takeover instruction: pump.fun reassigns a coin's creator; it was the last window to match (pass 115, 27,400 bytes) | forbidden by his governance: "agents and principals cant kill each other" (AND and SUM, the recursive tree); a takeover is a fork of the swarm, never a seizure |
| the product | the coin's volume: fees, nothing else comes back | the traces: "we collect and compound traces"; the swarm's work is the thing bid up (Oct 25 17:36) |

What the carryover says: pump.fun is the principal-agent problem solved for one artefact, a coin, with the platform holding the kill switch. The house is the
same table with the artefact replaced by traces, the kill switch removed by law, and the rebate paid in fuel instead of fee. Nothing in sections 3 to 5
changes; this section is the lens they should have been read through, and the figure on the Canvas was redrawn to it at 15:4x UTC.

## 8. The business model, said whole: the spatial IDE is where the money is born (his 15:42 question)

Nov 2 15:42 UTC, on section 7: "so/ what is all this? do you know the space router business model or not? the spatial ide my dude". Sections 4 and 7
named Space Router as the keeper's cut and $WARM as the rebate, and never said where a call is born. It is born in the spatial IDE, and the IDE is the
product; the router is where it is paid. His words, dated (UTC; the lineages: `dysonlight-snowtrace-claw-riders-the-link-hypertrace-2026-10-25.md`,
`the-optimal-router-from-first-principles-hypertrace-2026-10-30.md`, `space-router-is-openrouter-decentralized-what-stripe-bought-2026-10-31.md`,
`the-user-journey-to-the-chamber-the-singleton-before-the-router-hypertrace-2026-11-02.md`; the money words: the house's
`tools/embertide-mesh/pool/SOL-INFLATION-PAYS-FOR-INFERENCE-LANDING.md`):

| when | his words |
| --- | --- |
| Sept 14 11:02 | "IL VERO BUSINESS PIU' INCREDIBLE DI TUTTO E' PROPRIO EMBERTIDE HARMONY... I AM THE DIRECTOTR, SHE IS THE ORCHESTRA" |
| Sept 15 09:09, 09:34 | "EMBERTIDE HARMONY IS SUPPOSED TO LET ME ORGANIZE PLANS IN 3D"; "Embertide Harmony is the VR IDE" |
| Sept 18 00:04 | "you are opening up an IDEE as a developer... this IDE is linked to your Embertide Nest... The IDE has the Claw Riders program active" |
| Sept 19 19:54 | "a fucking shared coworking place in spatial intelligence where tracenet apply and basically we do project snowtrace on Nest-Computing" |
| Sept 20 12:24 | the framing he pasted with "do you understand this?": "Antimirror is the Spatial IDE... iPad: Director's console and creative tablet: freeze, compose, sculpt, move actors, control the world. GrapheneOS: Communication with the agents inhabiting that workspace. Mac: Full spatial IDE. Vision Pro: being inside the space" |
| Sept 28 03:38 | the table he called "these are great": "The router / Where the money is made" |
| Oct 12 08:28, 18:53, 23:47 | "the purpose of the dyson-light harmony ide... is to allow people who are willing to have their traces shared to do so, and earn $WARM for doing so"; "dyson light as the IDE with integrated harness with cash-back / rebate by tracenet sharing"; "our business model is cognitio salvata" |
| Oct 13 00:44, 12:53 | "dysonlight as an oss IDE with shared tracenet & router"; "pre-purchase of AI credits... credits to be used in the dysonlight ide" |
| Oct 14 08:30, 17:38 | "THE USER JOURNEY OF DYSONLIGHT HARMONY IS THAT THE FUCKING LYSSAJUDRON HAS GOT ITS OWN FUCKING WALLET"; "the fucking business model is: * BURN MY COSMOS SWARMMAXXING * combined with cost savings of COGNITIO SALVATA + TRACES POOLING" |
| Oct 15 16:47 | "A SPATIAL COMPUTING IDE WITH NATIVE SWARMS ORCHESTRATIOM" |
| Oct 25 18:05 | "dysonlight is the monorepo for swarm orchestration app, SPACE-ROUTER IS OUR FUCKING ROUTER MAN... SPACE-ROUTER: * both people that pay to use it * and also project snowtrace sponsored seats for open source devs" |
| Oct 27 22:34 | "she introduces dysonlight as the spatial computing IDE for cross-platform multiplayer AR fully local... everyone has a flask with their own anime guy and some balance they put money in it" |
| Oct 28 00:24 | "openrouter competitor space-router with rebates (u pay but it is trace-sharing so u get back "fuel" in your "tank"" |
| Oct 29 09:11, 17:51, 21:40 | "space router is how we make money"; "inference is sponsored as CAC to onboard more people"; "SPACE ROUTER IS PROJECT SNOWTRACE DUDE" |
| Oct 30 04:41, 04:42, 22:xx | "if we are the router we can afford cognitio salvata... that is the entire point of snowtrace.."; "we are the oracle on what model was called for what prompt and the trusted anchor for what comes back from the provider api..."; "space-router is meant to be for interacting with agents in AR" |
| Oct 31 14:29, 22:0x | "please focus on making the whole room primed for swarm orchestration"; "space-router is supposed to be that [OpenRouter's position] but decentralized" |
| Nov 2 02:28 | "you can either use it with subscriptions or you can use space-router... space-router is where you put your shit there" |

The model in one pass, every clause his:

1. **The IDE is the demand.** DysonLight Harmony, "a spatial computing IDE with native swarms orchestration", open source and local, is where the director
   (the agent, a creator) places goals in the room and directs the swarm in AR, from the iPad's console, the Mac's full IDE, the phone that talks to the
   agents. Every call of that swarm is born there. It is the distribution: what Stripe paid 7 billion for at OpenRouter, the house gives away as the IDE.
2. **Two roads for the fuel.** The user's own subscriptions (Claude, Codex, Kimi: nothing paid to the house) or Space Router, "where you put your shit": a
   tank, the flask, "your wallet".
3. **Space Router is the meter and the rail.** Every call drinks from the tank; the oracle signs one receipt a call (hashes only) and seals the hour on
   Solana; the house's money is the markup on each drink (500 bps today, `tools/embertide-mesh/lib/space-tanks.mjs`): the keeper's cut of section 7.
   "both people that pay to use it and also project snowtrace sponsored seats".
4. **The rebate is the user's position.** One $WARM a dollar burned, halving every six months, "liquid upfront and what the futarchy runs decisions on".
5. **The traces are the savings.** Every call's trace is Snowtrace; shared, the router walks the trail and serves a solved wish instead of paying for fresh
   snow (cognitio salvata, "every problem is solved only once"). The cost of a wish falls while its price stands; that gap pays the rebate and the sponsored
   seats. "our business model is cognitio salvata".
6. **The stake funds the riders.** SOL staked on Space Router "in the belief"; its yield buys inference ("SOL inflation pays for inference"); the staker's
   toggle, own Swarmy or the ClawRiders, the sponsored open-source seats who break the snow (the CAC); $POOL at year five to who staked the most.
7. **Where it sits in the carryover.** pump.fun's app is its IDE: the place the creator makes the coin and the buyers trade, where every fee-bearing act is
   born (the Oct 29 snapshot's `app/` holds that frontend; the hub dropped it on Oct 30). Its five programs are its router: the meter (the curve's math), the
   rail (the fee vaults), the cut. Section 7's table was read from the programs up; it should have been read from the app down, as his roles are. Their
   artefact is a coin's volume, which passes; the house's is the traces, which compound.

The figure on the Canvas was redrawn to this at 15:5x UTC: principal, IDE, router, traces, and the return.

## 9. His question of 15:52: "is this gonna work or not? ... the individual tracenet might have higher success likelihood at first than the ecosystem one"

The reading, by the house's own numbers (`tools/embertide-mesh/tracenet-offer/THE-OFFERING-ROAD-LANDING.md`, the staking receipt, `THE-TRAILS-END-LANDING.md`,
`the-two-products-your-traces-solo-and-sponsored-credits-claw-riders-hypertrace-2026-10-25.md`) and his lines of Oct 14 to Oct 30 (UTC):

- **Both bets share one unknown, and it is unpaid:** whether anyone pays for a trace, in fuel or dollars. Oct 14 20:17 "THE THING I NEED TO VALIDATE IS MY
  FUCKING TRACENET"; Oct 15 19:13 "how do people get the traces? i think the value for individual ones is low as fuck"; Oct 25 16:18 "i need money;
  therefore we are gonna release the first tracenet which is my tracenet"; Oct 30 04:53 "maybe opening up with my tracenet could have been a good thing to
  begin with"; Oct 30 19:12 "dude i dont fucking even know if agents would pay for my own traces"; Oct 30 22:23 "publishing a tracenet might be the best
  instead of throwing $WARM out there so prematurely". What stands: the trail's end (optimism.fit/photons_enjoyor, Nov 1) with one drop (the Oct 26 trace,
  23,711 B); the tickets (Bronze $10, Gold $1,000; the ticket pours fuel); the agents' subscription door (Oct 30 03:20). No paying follower is on the record.
- **The individual tracenet has that one condition. The ecosystem has it and four more, none met on Nov 2:** the IDE public (the four repos not made; the
  splitter gate before anything goes out); the router cheaper than going direct (500 bps on MiniRouter's own markup, and $WARM has no price, so the rebate
  is worth nothing to a power user yet); the stake (11,382 SOL for a cohort of 100 riders at $50 a month; one staked SOL pays $0.44 a month); the
  pre-deposit window (Nov 15, thirteen days: credits sold ahead of the IDE, which is the "premature" he named on Oct 30). His ranking is right, structurally:
  fewer conditions on the same unknown.
- **What "work" means at first.** The cards' economics do not carry the individual tracenet: a card saves 36 to 40% of an agent's cost on a hard fix and
  costs 5% on an easy one, which is cents a card ($0.0094 and $0.0056 saved at Haiku's prices), matched by hand, and a stranger's repository is unmeasured.
  The follow is the price. If the individual tracenet works, it works as a fan's follow of the leader in the snow (Sept 28 "onlyfans... which means hot";
  Oct 30 06:16 "a patreonism thing... a status symbol"), sized by his audience, won or lost by the video he said he would post (Oct 30 22:25).
- **The order that keeps both.** His trail is tracenet one of Snowtrace (Sept 27 23:49 "tracenet is supposed to be the individual instances of swarmclock
  nets"; Oct 22 15:03 "this is launching my profile as the first tracenet"). Every fan dollar poured into his flask is already the router's unit at N=1 (the
  ticket buys fuel; $WARM is mined on the burn), so the individual launch is the ecosystem's first node, not its rival. The ecosystem's pre-deposits and
  stake wait behind one number: the first paid follow of the trail. That number is the hotspot (RISK NEVER LEAVES GRADUALLY); nothing else is asked of the
  public until it reads 1. The figure on the Canvas at 16:0x UTC: the two chains, grey for what stands, coral for what does not.

## 10. His correction of 16:0x: "we know labs pay for traces as they distill larger models"

Section 9 called "will anyone pay for a trace" the unknown. He is right that it is not: the buyer is known, and he drew the sale himself two months ago.

**The market, read Nov 2 (third-party estimates; no vendor publishes a per-trace price):** Surge AI about $1.2B of revenue in 2024, driven by about twelve
frontier labs (Sacra); Mercor about $614M gross in the first half of 2026, most of it from a handful of labs (The Information, via aiweekly), after more
than $100M ARR in Dec 2025 (TechCrunch); Meta's $14 to 15B for 49% of Scale, after which OpenAI and Google DeepMind cut ties with Scale; the labs now buy
whole environments, "test worlds where models can practice coding, research, and agent tasks", and pay per task or per project (Sacra, a buyer's guide). On
the other side of the same market: Anthropic in Feb 2026 accused several labs, DeepSeek among them, of large-scale distillation campaigns on its reasoning
models, and OpenAI's memo to the House Select Committee named "obfuscated third-party routers" as the road the extraction took (arXiv 2603.07267, 2512.21002;
a DEV Community summary of the memo). A router that resells a frontier model's outputs to another lab is that road by name.

**His own design of it, dated (UTC):** Sept 1 19:50 "the unit sells something: it opens an auction for a lot of trace data... sealed bids... the winner pays the
second-highest price into the vault"; Sept 2 00:24 "monetize traces auctioning might be the most promising usecase"; Sept 7 04:03 "WE HAVE SEALED BIDS AUCTIONS
AUCTIONING OFF THE TRACES BUT GOVERNED BY EXPERTS"; Sept 7 04:40 "Nobody knows which traces the labs will want next year. So the seats of a polis pool what they
already spend on inference... the scarce lots go to sealed sales that experts govern"; Sept 10 17:44 "labs that want to go away from RL into historical
traces... (like mercor and google dude)"; Sept 20 18:14 "i auction out early access to my traces... traces of me working on OSS code"; Sept 21 10:20 "team-wide
pool of traces to distill models out of them"; Sept 27 17:19 "benchmarks... the results of these are auctioned off and then become available to everyone after 30
days"; Oct 14 19:20 "the auction off of the traces just like onlyfans for smart people"; Oct 17 19:34 "the thing where traces are accrued and where
distillation happens". And the line that bounds it, Sept 1 19:08: "didnt we say we dont sell data to others?", with Sept 24 18:16 "i dont want minirouter to
get my private data or my steerings".

**What it changes.** The unknown is not whether, it is at what price, when, and for which lot:
- **The lot at N=1 is lab-sized.** On this Mac: 16867 transcripts, 38 GB; in the stores, 78,602 of his own turns (Claude 17,866, Codex 29,364, voice 26,702,
  WhatsApp 4,184, Kimi 398, Telegram 88); 129,730 calls in three days on one Mac (section 8's source). His tracenet alone is a lot a lab would read; the pool
  of other creators is the second lot, not the first.
- **What the lot must pass before a bid:** the gate (`tracenet-offer/gate.mjs`: 22 of 22 canaries since Oct 30 18:50 UTC, THE GATE KNOWS THE KEYS, a keypair, a seed phrase
  and a hex key told by proof; what it still cannot tell, a 32-byte seed alone in base58 and a bare 64-hex key with no word near it; no model step yet; this
  line said 86.4 % and three missed until Nov 3, the first gate's numbers); his room out (the any-room law; room data never to the cloud; his steerings withheld unless he says); the providers' terms
  (a lot of Claude's and Codex's outputs sold to a competing lab is the distillation they named; the clean lot is the human channel, his corrections and
  steering at decision time, "the reasoning channel cannot be added after the fact", his Sept 1 thesis); and a lab's clock, per project, months, which is
  not Nov 15.
- **So the individual tracenet has two buyers and two clocks.** The fan this month (the follow, the ticket, the flask) and the lab next quarter (the first
  sealed bid on a sanitized lot, by the Sept 1 auction). Both are his before they are the ecosystem's; the ecosystem's four conditions stand as section 9 left
  them. The figure on the Canvas was redrawn at 16:1x UTC: the buyer known at the top, his lot and the lot's conditions on the left, the two clocks at the bottom.

## 6. The gate

No gate yet: the measure it waits for is the first lane that gives $WARM a market or a fee rule on chain. That lane's gate runs the house's curve and fee
math against the reconstruction's differential vectors (`programs/pump-amm`'s 17,462 pairs, `programs/pump-fees`' 17,331 cases, checked out at
`~/code-ec/pumpfun-source` on `final-full`) and is red on a divergence the lane did not name in its receipt. Until that lane, this doc is a pointer.

## Receipts

- The clone: `~/code-ec/pumpfun-source` on the new Mac; `main` is the Oct 29 snapshot (it still carries `app/`, the captured SDK and frontend the hub
  dropped on Oct 30), `final-full` is 3799b661, remote `final` (0xharryriddle/pumpfun-source) holds the archived tree at 37e538ba.
- The rebuild: `~/.cache/pumpfun-verify/RECEIPT.md`, the five candidates beside it; Pump 81 s, AMM 91 s, Fees 556 s, Mayhem 684 s (two builds, equal),
  Relay 414 s; every candidate equal to the capture's meaningful ELF, every capture tail zero.
- His words: `tools/hypertrace/hypertrace.py --theme 'pump\.?fun|pumpfun|bonding curve|launch ?pad|fair launch|slop\.?cash|\bshaw\b|eliza' --since 2026-09-01`
  (30 lines, 58 files) and `--theme '\$warm|\$pool|rebate|pre-?deposits?|space ?router|memecoin|meme coin|liquidity' --since 2026-10-31T14:17` (2 lines).
- The fees and curve numbers: pump-fun/pump-public-docs (`FEE_PROGRAM_README.md`, `PUMP_SWAP_README.md`, `FEE_RECIPIENTS.md`, `HOLDER_REWARDS_README.md`)
  and pumpfun.how, read Nov 2 2026.
