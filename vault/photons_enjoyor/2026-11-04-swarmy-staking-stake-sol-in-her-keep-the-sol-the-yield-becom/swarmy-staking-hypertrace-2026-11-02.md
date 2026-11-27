# $SWARMY STAKING: stake SOL in her, keep the SOL, the yield becomes the Swarmy's fuel (hypertrace, Nov 2 2026, claude-ac61d4f0)

**His ask, whole.** Nov 2 2026 15:4x UTC, to this seat on the new Mac, while it was reading his own Marinade Native stake for him ("can u check in on
marinade native staking?"): "hypertrace $SWARMY Staking we discussed". "$SWARMY" with the dollar sign is new today; no earlier doc or turn of his spells it
so. What he discussed, between Oct 29 and Nov 1 and in the seats' receipts, is the staking of SOL in her whose yield pays for inference: the Swarmy's fuel.

## Method (the index first, then only since the newest doc)

- The index (`what-recurs-and-where-it-is-already-written-hypertrace-2026-10-31.md`) carries this on two rows: "SWARMY, tamagotchi, Pokémon, gamification"
  and "snowtrace, ClawRiders, Space Router, $WARM, $POOL, cosign, the minirouter". The newest docs on them were read before any trace, and are not repeated
  here: the staking receipt `tools/embertide-mesh/pool/SOL-INFLATION-PAYS-FOR-INFERENCE-LANDING.md` (Oct 29, his words 17:56 to 19:12 UTC, the law and the
  numbers), `THE-POOL-WAITS-ON-HIS-KEY-LANDING.md` beside it (Oct 29), `the-flask-allocators-and-the-creators-hypertrace-2026-11-02.md` (Nov 2, the staker's
  toggle as one allocator among the donors, the sponsors and the buyers), `the-big-launch-hypertrace-2026-10-31.md`, `warm-the-latest-plans-hypertrace-2026-10-30.md`,
  `the-guardian-angel-hypertrace-2026-10-30.md`, `the-way-she-talks-hypertrace-2026-10-29.md` (her lines on the page), `swarmy-the-seekers-agent-and-the-tamagotchi-hypertrace-2026-10-25.md`
  (what Swarmy is), `dyson-society-snowtrace-tracenet-swarm-money-hypertrace-2026-10-14.md` (the validator set "like marinade native").
- His typed turns were traced only since the flask doc's ask (Nov 2 01:16 UTC), across the 75 session transcripts touched on this Mac in the last day, for
  `swarmy|stake|staking|$POOL|$WARM|marinade`: none of his on staking. One on the token, to the token seat (claude-a0ea1269, 15:19 UTC): "ok, so? what does it
  mean for us? for $WARM? hypertrace"; that seat's doc on $WARM is its own.
- So this page is an index of what already stands, in his words, plus the one thing new today: the live read of his own Marinade Native stake, the shape he
  already uses with his own SOL, as the measure for "$SWARMY staking".
- Cost: about 6 minutes of reads on the new Mac at nice 19, 40 public RPC calls to mainnet, no key read, nothing changed.

## The answer in one breath (every clause his; only the joins are this page's)

**The shape: stake SOL in her, keep the SOL, give up the yield.**
- Oct 29 18:01: "i think we should make it a staking thing so we get staking yield an use that as inference credits, so basically SOL inflation pays for
  inference".
- Oct 29 18:23:28: "staking only, with staking rewards that become fuel and credits for the project snowtrace cohort... this works when there is a lot of stake
  moved".
- Oct 29 18:43:09: "people that stake SOL in her, they are giving up the yields of that SOL in the belief that $POOL will be more valuable than their yield".
- Oct 29 19:12:48: "$SOL is staked and SOL yields are sold for ai credits".
- Her line on the page, landed Oct 29 20:13 UTC (`lane/keep-your-sol-keep-your-soul`, main f01656586): "Keep your SOL. Keep your soul." and "One stake is a
  spark. Together, a sun."; the kit: "Keep your SOL, keep your soul. Believers give its light to Space Router."

**Whose inference the yield pays: the staker's Swarmy, or the snowtracers, by a toggle.**
- Oct 29 18:04:21, asked whose: "The staker's Swarmy".
- Oct 29 18:08:08: "this is where you introduce a simple toggle... the toggle is: * accumulate credits * or allocate to ClawRiders in Project SnowTrace".
- Oct 30 05:25:02: "i think staking for the meta-swarm is a nice narrative tbh".
- Oct 30 06:16:09: "do you understand the core dynamic of the stake-4-inference? it is a patreonism thing... a status symbol... stake to provide inference to
  trailblazers... to the snowtracers".
- Nov 1 23:37 (the flask doc): the donors hold "many flasks" and give them one by one; the staker's toggle is one of the allocators.

**The tokens around it: $POOL in five years to who staked the most, $WARM liquid now.**
- Oct 29 18:57:09: "$POOL is unlocked all at once 5 years down the line, until then, stakers just compete for who accumulates the most, and the SOL yielded
  goes into funding ai credits".
- Oct 29 19:06:27, on a staker who leaves early: "they keep it but can only get it 5 years down... not before, just like the others".
- Oct 29 19:12:48: "$WARM is liquid upfront qnd is what the futarchy runs decisions on * $POOL is liquid only after 5 years to who staked the most".
- Oct 29 18:56:35: "liquidation-free size increase that anyone can tap into for futarchy trades and it just multiplies how long u been staking".
- Oct 30 06:21:37: "$POOL reads like SPOOL... like $WARM reads like SWARM... u get me? POOL OF TRACES; WARDEN OF THE $POOL".

**The timing.** Oct 29 19:00:45: "we gotta think strategically about the timing... because i need liquidity and solana breakpoint is in 14 days"; the window
ends at Breakpoint's opening (Oct 29 23:46).

## What stands in the code today (read Nov 2 on main, by the receipts)

| his words | where | what it does today | what is open |
|---|---|---|---|
| "SOL inflation pays for inference" (Oct 29 18:01) | `tools/embertide-mesh/pool/pool-genesis.mjs` | the stake pool's birth on devnet, one transaction of 1,162 bytes that only his key signs (his Oct 29 19:38:21 "Only my key"), a 100% epoch fee so the yield mints to her fee account and the stakers' receipt stays at its SOL | unborn: it waits on his key; mainnet after devnet |
| "accumulate credits / or allocate to ClawRiders" (Oct 29 18:08) | `embertide-app/ui/intro/life-menu/pool-toggle.mjs`; `pool/pool-crank.mjs` | one ref `pool/toggles`, two choices, the staker's Swarmy by default; the crank reads every linked stake's `getInflationReward` and writes one refill row a stake into the tanks' ledger, in dollars at his stated price | `pool/toggles` empty, no tank stands (the flask doc, Nov 2 01:4x); the ClawRiders' tank is his hand |
| "staking only" (Oct 29 18:23) | the mint page and the kit (`dl-athena.mjs` STORY) | the NFT mint's words left the page (Oct 30 03:21); the kit's door reads "Paused" until the pool exists | the page's $POOL lines of main named in the receipt's "Not built" |
| "$WARM... the opening on mainnet" | `lane/the-terms-say-mainnet` (Oct 30 06:54, merged) | the Terms, Fees and Privacy pages made true for mainnet, a draft for his read and counsel's | his read |
| "$POOL... 5 years... who staked the most" (Oct 29 18:57, 19:12) | none | nothing counts stake-time | his bricks in `plans/swarmic-futarchy-the-structure-hypertrace-2026-10-26.md` |

## The measure, new today: his own stake is already this shape

Read Nov 2 15:0x to 15:4x UTC by public address, mainnet epoch 1075 (nothing of his signed; the chain and Marinade's own pages):
- His Ledger's address holds 66 stake accounts, 22,161 SOL, in Marinade Native (Select). The stake authority is Marinade's program key (it can delegate,
  split, merge and deactivate, never withdraw); the withdraw authority is his on every account. That is "Keep your SOL" as a running fact: he gave the
  delegation, never the SOL, and his key last signed on Sep 3 2025.
- Its yield: 3.10, 3.13 and 2.99 SOL in the last three epochs of 1.07 days, 3.07 SOL an epoch, 4.75 % a year of inflation alone (1,053 SOL a year at this
  rate), with MEV tips sent to the accounts on top; 63 validators at 3.2 % commission on average, none delinquent; Marinade's fee is set each epoch within
  2 to 16 % of the yield, and Native earned 5.32 % in Q3 2026 against the staking index's 5.84 % (Marinade's Q3 report).
- What it says for $SWARMY staking:
  1. The staker's ticket the receipt priced (about 0.18 SOL given up per SOL over five years) holds at his own scale: 1,000 SOL make about 47 SOL of yield a
     year today, falling with the taper.
  2. The two shapes differ in where the yield lands. Marinade's keeps it in the staker's own account, so moving it to inference needs the staker's signature
     every time (or her running a validator and taking it as commission). The pool's 100% epoch fee lands it in her fee account each epoch with nobody's
     signature, and the stakers' receipt stays at its SOL. The receipt's choice stands; nothing of his since says otherwise.
  3. What he is giving up with his own stake today, if it were in her: about 1,050 SOL a year of fuel, the whole of which the toggle would route to his own
     Swarmy or to the snowtracers. That is the size "a lot of stake moved" (Oct 29 18:23) means, from one staker.

## What is open (his to say)

1. The pool's birth: his key on devnet (one transaction), then the mainnet terms.
2. The ClawRiders' tank (his hand), and the vetting behind its pours (Oct 27 23:56).
3. The stake-time count and $POOL's five-year unlock: nothing counts it today.
4. The futarchy's size multiplied by time staked: what backs the extra size (his call, the receipt).
5. Whether "$SWARMY" names a thing of its own (a token, the stake's name) or is today's spelling of the Swarmy's fuel: not asked, no word of his either way.

## The gate

- **Standing, run by the lander on every lane:** `tools/embertide-mesh/pool/pool-genesis.test.mjs` (7 tests: the pool accounts from his address alone, the
  birth one transaction under the limit that only his key signs, devnet only) and `pool-crank.test.mjs` (10 tests: the toggle one law on the page and in the
  crank, the reward read one `getInflationReward` for every stake, the epoch's rows into the tanks, a write refused without his stated price).
- **No gate yet** for the yield's road itself. The measure it waits for: SOL of yield that reached a tank, the refill rows in the Macs' `~/.embertide/space-router/ledger.jsonl`
  whose source is a stake account, read by the lander. On Nov 2 it is 0: the pool is unborn, `pool/toggles` is empty, no tank stands. The gate owed is one test,
  `tools/embertide-mesh/tests/the-yield-reaches-a-tank.test.mjs`, red while the crank's rows cannot be traced to an epoch's reward on chain.
