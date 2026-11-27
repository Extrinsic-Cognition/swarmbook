# THE OPTIMAL ROUTER FROM FIRST PRINCIPLES (hypertrace, Oct 30 2026)

**The ask.** Oct 30 2026 04:46:55 UTC, to claude-61e371e5: "hypertrace how to build optimal router from first principles please".

**Method.**
- His typed lines: `tools/hypertrace/hypertrace.py`, both Macs, the themes minirouter, openrouter, space router, router, cognitio salvata, prompt-to-mine,
  rebate, sells the traces, oracle. 586 of his lines to Sept 17, 224 after. His own short lines are kept below; long pastes are left out.
- The house's own numbers, read on Oct 30 2026:
  - the purse door's burn log on the old Mac (`~/.embertide/minirouter-burn.jsonl`, every call through MiniRouter since Sept 15);
  - this Mac's Claude Code transcripts of the last three days (their `usage` fields);
  - the Offering Road's measure (`tools/embertide-mesh/tracenet-offer/THE-OFFERING-ROAD-LANDING.md`).

## His words (UTC)

| when | his words |
|---|---|
| Sept 4 00:34 | "is there really no openrouter on solana seriously?!??! because like... what if we built one?" |
| Sept 7 07:29 | the study he pasted: "Agents that remember each other. What one agent solved, another retrieves before spending compute again. Peer to peer, with no landlord. Computed once. Retrieved by every agent that asks." |
| Sept 8 19:29 | "IT IS FUCKING DONE IN LAYERS ... THINK ABOUT THE SAVINGS IN CACHED VIDEOS ... COGNITIO SALVATA" |
| Sept 16 08:24 | "WHY IS THAT THEY HAVE A TERRIBLE LATENCY? SHOULD I LAUNCH MY OWN COMPETITOR TO MINIROUTER?" |
| Sept 17 14:20 | "sometimes it goes through sometimes it doesn, i really dont know what the shit it" |
| Sept 21 12:57 | "btw, minirouter sells the traces... so have you applied FIDES and all out info OpCogSec stuff?" |
| Sept 24 18:16 | "i dont want minirouter to get my private data or my steerings" (the private tank's law in the purse door) |
| Oct 6 00:03 | "we need a runtime scheduler that kinda looks like a trading bot?" |
| Oct 12 12:16 | "as a business i want to start a openrouter competitor focused on gaming traces.. you get me or not?" |
| Oct 12 18:53 | "dyson light as the IDE with integrated harness with cash-back / rebate by tracenet sharing" |
| Oct 12 23:47 | "our business model is cognitio salvata" |
| Oct 14 17:38 | "the fucking business model is: * BURN MY COSMOS SWARMMAXXING * combined with cost savings of COGNITIO SALVATA + TRACES POOLING" |
| Oct 18 18:17 | "cognitio salvata is the hill-climbed code, no?" |
| Oct 22 20:52 | "how do we build towards a neural content delivery network based on cognitio salvata?" |
| Oct 25 18:05 | "SPACE-ROUTER IS OUR FUCKING ROUTER MAN" |
| Oct 27 03:26 | "the market that we are after is the market of power users using a router for their needs" |
| Oct 27 23:56 | "the north star here is SPACE ROUTER & Project Snowtrace with rebates on credits based on traces" |
| Oct 30 00:01 | "how the fuck do we build a router? like... the fucking graph dude... i think that is aspirational" |
| Oct 30 04:41:46 | "we'd be the router through with the prompt is sent to and to which the result of the model responding to the request is queried at... if we are the router we can afford cognitio salvata... that is the entire point of snowtrace.." |
| Oct 30 04:42:33 | "we are the oracle on what model was called for what prompt and the trusted anchor for what comes back from the provider api..." |

**What they say together.**
- The router is the pipe every call passes, so it alone sees the prompt and the answer.
- Being the pipe is what pays for cognitio salvata: computed once, retrieved by every agent that asks.
- The router vouches for what it saw (the oracle). It does not sell what it saw (MiniRouter does), and a private call never leaves the house.
- The money comes back as fuel to the people whose traces saved the compute.
- The provider graph (which provider serves a model) was never his to build: Oct 30 00:01.

## What an agent's call costs: the house's own numbers

**Claude Code on this Mac, the last three days** (every seat's calls straight to Anthropic):
- 129,730 calls, 49.0 billion input tokens and 173 million output tokens. **99.6 % of the tokens are input.**
- 98.0 % of the input was read from the prompt cache, 2.0 % written to it, and almost none of it was uncached.
- At the list ratios (a read is 0.1 of the input price, a write 1.25 or 2 times it), the input was paid at **12 % to 14 % of its uncached price**.

**The purse door through MiniRouter, Sept 15 to Oct 28** (codex, the swarms, Hermes, opencode):

| model | calls | spent | a call | input a call | output a call | median | p90 |
|---|---|---|---|---|---|---|---|
| openai/gpt-6-astra | 2,903 | $295.71 | $0.102 | 24,907 | 688 | 12.2 s | 51.1 s |
| anthropic/claude-fable-5.1 | 430 | $43.40 | $0.101 | 24,330 | 327 | 8.2 s | 156.1 s |
| openai/gpt-5.6-sol | 118 | $2.44 | $0.021 | 13,603 | 244 | 5.0 s | 24.8 s |
| all 3,501 | | $341.67 | $0.098 | | | | |

- 97 % of the tokens are input here too.
- **Whether the provider's cache served them is recorded on 10 calls of 3,501.** All 10 used Anthropic's own wire, and there the cache did serve (a Sonnet session read 3,132, then 8,732, then 9,240 tokens from it). The chat wire, which carried 99.7 % of the calls, records nothing.
- A fit of cost against tokens leaves residuals of 34 % (Astra) and 160 % (Fable) at the median. The bill varies from call to call for reasons the log does not hold (hidden reasoning tokens, or a cache).

**One agent with and without a saved fix** (the Offering Road, Haiku 5.5, three pairs each):
- On the two hard fixes the card cut the cost by 40 % and 36 %, and one fix went from 2 of 3 solved to 3 of 3.
- On the easy fix it added 5 %.

**The first principle these numbers give.** An agent's call is paid for re-reading its context, not for its answer.
- 97 % to 99.6 % of what is billed is input, and most of it is what was already sent the turn before.
- So the optimal router is the one that does not compute what is already computed, does not re-read what is already read, and sends less.
- Choosing a cheaper model comes only after those three.

His foundation says the same thing: "a process becomes efficient when there is no amount of work that can add it a marginal information gain". Computing an answer the house already holds adds no information.

## The optimal router: seven moves, in the order of the cost they remove

For each call the router chooses one action:
- **retrieve** a saved answer or fix;
- **call** a model, at a place.

It chooses the action with the lowest expected **dollars per verified outcome** (a landed lane, a passed test), within his latency and the membrane.

### 1. Do not compute what is computed (cognitio salvata)

- **What it is.** Before paying a provider, look up whether the same ask was answered: first by its exact hash, then as a solved fix (a card), and later by meaning.
- **Why only the router can.** It is the one place every prompt passes before it is paid for.
- **What a hit saves:**
  - an exact hit costs a lookup instead of a call: about 1 ms against $0.10 and 8 to 12 s;
  - a card on a hard fix saves 36 % to 40 %, measured.
- **What it needs:**
  - the oracle, so that a saved answer is as good as a fresh one (move 6);
  - consent, so that only a tank that shares is retrieved from ("Consent, always", the manifesto's IV);
  - the membrane, so that nothing private is kept to be served.
- **His "neural content delivery network" (Oct 22).**
  - The router keeps only the hash and its signed receipt.
  - The bytes stay with whoever made them and are served by any peer that holds them, over the house's own wire (iroh, foundation 9). Each byte is checked against the hash before it is used.
  - That is "peer to peer, with no landlord": the router is the index and the notary, never the landlord of the traces.
- **When not to.** On an easy problem a card costs about 5 % more. Retrieve when the expected saving beats the lookup and the reading, which the router can estimate from what the same kind of ask cost without it.

### 2. Do not re-read what is read (stay on one cache)

- **What it is.** A session's calls stay on one model at one provider, with its earlier context unchanged, so the provider serves about 98 % of the input from its cache.
- **What it saves.** The input bill falls to 12 % to 14 % of its full price (measured on Claude Code above).
- **The rule this gives: choose a model per session, never per call.**
  - A router that switches models call by call to save on price throws the cache away. It pays the whole context again on every switch: up to 7 to 8 times that call's input.
  - Switch only where the context starts again anyway: a new task, or after the context is compacted.
- **What the house lacks.**
  - The purse door does not record cached tokens on the chat wire, so the house cannot say whether its 25,000-token contexts were cached through MiniRouter.
  - MiniRouter's graph may move a model between providers, and a move between providers loses the cache too.
  - If none of it was cached, caching at Claude Code's rate would have saved roughly half of the $341.67. That is an estimate from the price fit, whose residuals are large; the number to measure first is the cached tokens.

### 3. Send less

- **What it is.** The input is the bill, so the context carried is the cost.
- **How.**
  - Engines read state from the Nest (C-9) instead of dragging transcripts.
  - Compact the context at a task's edge.
  - Do not reattach what the provider already caches.
- **What it saves.** Every token not sent is saved on every turn that would have re-read it.

### 4. The cheapest model that is enough, learned from reality

- **What it is.** For each kind of task, the model with the lowest dollars per verified outcome.
- **What it learns from.**
  - The house has a ground truth no public router has: the lander's verdicts, which say whether a lane's tests passed and whether it landed.
  - Joined to the router's receipts (which tank and model made which calls), they give how often each model succeeds on each kind of task, per dollar.
- **How it searches.**
  - Several candidates are scored by reality at once (foundation 6, "never greedy"), sampled by how likely each is to be the best, with a little traffic always tried on the others.
  - A cascade (try the cheap model, climb on failure) only where failure is cheap to see, as with a test.
- **What it is not.** A leaderboard, or a model switched mid-session (move 2).

### 5. Where it is allowed, then where it is cheapest

- **The law first.**
  - A private tank is served only by a house door in front of a local brain (his Sept 24 words; the purse door already refuses it at a router's door).
  - Room data never reaches a provider (foundation 5).
  - The membrane labels what crosses (FIDES at the door, his Sept 21).
- **Then the price.**
  - The two Macs (an M4 Max and an M5 Max) can serve the cheap kinds of task for their electricity. The purse door already runs in front of Ollama.
  - The frontier goes outside.
- **Then the tail.**
  - One upstream is one outage: his Sept 17, "sometimes it goes through sometimes it doesn".
  - The tail is long: p90 is 51 s on Astra and 156 s on Fable.
  - A second upstream, and a call sent again past its p90, removes the worst of it. A resend may pay a second cache-less call, so it is for tasks where latency is worth more than that.
- **The provider graph stays MiniRouter's** (his Oct 30 00:01).

### 6. Witness it (the oracle)

- **What it is.** Each call's receipt is signed with the router's key: the hash of the prompt, the hash of what came back, and the model and cost the provider returned. Each period's Merkle root is anchored on Solana.
- **Why it matters (his 04:42:33).**
  - A retrieved answer can be trusted (move 1).
  - Prompt-to-mine mines only on calls the oracle saw.
  - A trace sold on TraceNet carries proof that the model said it.
- **What it costs.** Two hashes and a signature a call, well under a millisecond; a few hundred bytes a row; one transaction a period.
- **Being built:** the session "THE ROUTER IS THE ORACLE", started Oct 30 at his "Yes, build it" (04:46:03).

### 7. Pay it back (the rebate)

- **What it is.** On a hit the provider costs nothing, so the gap between what the asker pays and what the call cost upstream is nearly all of the price.
- **Where it goes.**
  - Fuel to the tank whose trace answered (his Oct 27 "rebates on credits based on traces").
  - A cheaper call for the asker.
  - The house's margin.
- **Why it works.** That is "if we are the router we can afford cognitio salvata": the saving from not computing pays the people who made the computing unnecessary.
- **Mining.** Prompt-to-mine mines on what was paid, on the oracle's receipts.

## Against OpenRouter's router (its post of Oct 29)

- OpenRouter's router turns among the providers: it rewards the provider that gives the best quality for a request's cost, and that provider wins more traffic.
- The optimal router turns among the people who pay. Its three biggest moves (1, 2, 3) cut the bill whichever provider serves it.
- It scores models by verified outcomes, not by a request's quality.
- It pays the saving back to the traces that made it.
- His Mar 28 reading of OpenRouter: "they probably have the most amount of data from any anybody aside from the foundational models". The house keeps only hashes, and the traces stay their makers'.

## The build order, annealed

| | move | what it costs to build | what it unlocks |
|---|---|---|---|
| 1 | Record cached tokens at both doors (`prompt_tokens_details.cached_tokens` on the chat wire, `cache_read_input_tokens` on Anthropic's) | one field a row | the size of move 2 on the house's own calls |
| 2 | The oracle's receipt (being built) | under 1 ms a call | trust for move 1, and mining |
| 3 | From the receipts, the repeat rate of the `ask` hashes | one query | the size of move 1's exact hits, before any retrieval is built |
| 4 | Exact retrieval for the tanks that share | one lookup a call (about 1 ms), one table | the first saved call |
| 5 | One model a session at the door, and a warning when a provider moves | a rule and a field | move 2 kept |
| 6 | The card on hard problems (the Offering Road's measure decides when) | one match at a session's start | 36 % to 40 % on hard fixes |
| 7 | Models scored by landings | a join of receipts to the lander's ledger | move 4 |
| 8 | A second upstream and a resend past p90 | one more upstream and its key (his) | the tail |

**The router's own cost at every step.**
- About 1 ms a call against 8 to 12 s of inference: the tank's step is 44 µs, the oracle's under 1 ms, an exact lookup about 1 ms.
- Nothing runs at rest.

## What it keeps and breaks

- **It keeps:**
  - the foundations' first line (efficiency): no work without marginal information;
  - foundation 5: private calls stay local, nothing of the room leaves;
  - foundation 6: models scored by reality, with several candidates;
  - foundation 9: content-addressed bytes, peers over iroh, hashes checked before use.
- **It breaks nothing** as long as the router keeps hashes, not prompts.
- **What changes that:** keeping a shared trace's bytes at the edge to serve them. That is the membrane's to sanitize first ("everything shared outside must be thoroughly sanitized in the nest itself", his Oct 14 23:01).

## His calls

- Whether a tank shares its traces by default, or only when its holder turns it on (consent).
- On a retrieval hit: what the asker pays, the sharer's fuel, the house's share.
- A second upstream: which one, and its key.
- When the anchor moves from devnet to mainnet.
