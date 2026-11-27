# The house's USDC fills a flask (lane/the-houses-usdc-fills-a-flask, Nov 12 2026)

NOT handed, NOT deployed, nothing sent. The door below moves real money once his presses are made; until then it is code and its tests.

## Cost

- **At rest: nothing.** No timer, no request, no listener added. The page reads its address' fragment once, at the module's load (one regex).
- **One ask of the house's door** (once, by his press): 1 D1 read, 1 `getGenesisHash` an isolate, 1 `getAccountInfo`, 1 `getLatestBlockhash`,
  1 Ed25519 signature, 1 D1 insert, 1 `sendTransaction`, then the door's own hearing of the drop (up to 6 `getTransaction`, 2 D1 statements).
- **On the chain:** one transaction of 338 bytes, one signature, two instructions the law already writes (a memo, a `transferChecked`); its
  fee 5,000 lamports from the fee wallet's 0.05 SOL. No account is made, no program is new.
- **Every later count of any deposit** (`POST {signature}`): one import of the fee key's address more; one D1 read more only when the payer
  is the fee wallet itself.
- **JavaScript: +64 -26, net +38 in 7 files** over main db1499d47a (`git diff --numstat`; the gate's own word below). Three dead lines of the
  same files were taken out to pay (`ATA_SEEDS`, `unsignedDeposit` and its assertion: -3). By file: the door +14, its test +19, the page's
  test +6, the law's test +1, the page's script +10 -10 (0), `dl-kit-deposit.mjs` -1, the law -1. **His pass for +38 is asked at the hand,
  never assumed.**
  Not JavaScript: the migration (13 lines of SQL), the press script (shell), this receipt.
- **Measured** (the stand-in walk, below): 6.0 s from the pour's word to the fill's word; the whole walk 26 of 26.

## His words (Nov 12 2026, UTC)

- ~10:59 "i sent 600 usdc in total. is that enough to get this fucking mint going or not? u get me or what?"
- ~11:02 "are you stupid dude? hypertrace dio merda... we must have that fucking key somewhere"
- ~11:05, on the seat's offer to return the USDC to his wallet: "why the fuck would you return it back? we need to get going with the
  fucking token mint here dude wtf?"

So the USDC is not returned. It becomes the first deposit of the mint: it lands in the treasury by the mint's own law, it is his (the flask
whose key is in his browser), it stands on the deposits' list so its hexagon is on every visitor's tree, and the step on works for it.

## What stood (read on mainnet by this builder, Nov 12 2026 11:10 to 11:38 UTC; reads only)

- The live terms (`GET https://optimism.fit/space-router/v1/deposit`): cluster mainnet, the mint mainnet's USDC, the treasury
  `2mgZu7b1d6YiTCgDtPZq9bZGXPwVpozFss2RRERiQGmz`, the fee's payer `7JQkXFg372rqETnFQfYBJo3xvx5xgPryzQRaDe2gBBEA`.
- The fee wallet holds 50,000,000 lamports (0.05 SOL) and, in its own USDC account `HB9vKN9Vnb8gN845ABioi6xaR743xmyhrzJ2j9wM8Svs`,
  **600412645 base units (600.412645 USDC)**: his two sends of 10:54:54 and 10:58:05 UTC. That account is the wallet's own by Solana's rule
  (worked out here from the owner and the mint, and the node names the same one), so the door's `ataOf` finds it; the live door's own watch
  reads it (`?flask=<the fee wallet>` answered 600412645 at 11:38).
- The treasury's account exists, is initialized, is mainnet USDC, its owner `4vbBapEHbotyCig5yEwhrFFcGwEEPY9DrjqjPkwqYGHJ` (it is that owner's own
  USDC account by the same rule). It holds **7156 base units (0.007156 USDC)**, not nothing: dust from before, counted by no door.
- `/space-router/v1/drops` is empty: no deposit heard, no hexagon, no flask filled.
- The fee wallet's key is in one place, the Worker's secret `SPACE_ROUTER_FEE_KEY` (the lineage: ec-workspace
  `docs/the-fee-wallets-key-where-it-is-hypertrace-2026-11-12.md`). No seat holds it; this lane never reads it. Until now the Worker signed
  with it only as the payer of a relayed deposit's fee.

## The door

`POST /space-router/v1/deposit { "house": "<token>" }` with the header `x-seat` (worker/space-router-deposit.mjs `house`).

1. **The guard.** `SPACE_ROUTER_HOUSE_DEPOSIT_TOKEN`, a Worker secret he sets by one press: 32 random bytes, 43 letters. The token in the ask
   is compared with it by their sha256, in constant time. With no secret set, a wrong token, a spent token, a token of another shape, or no
   valid proof of a flask: **404 "No such Space Router door."**, the same answer as a door that is not there, with no reason. The deposit
   door's own limit (30 asks a minute an address) stands before it.
2. **Who asks.** `x-seat` is the site's own sign-in (dl-direct-protocol.mjs `verifySeatProof`, the proof the profile's claim already
   carries), signed by the flask's key in the browser that asks: the deposit is counted for that address, and only a browser that holds the
   key can be that address.
3. **What is sent.** The amount is the fee wallet's WHOLE USDC, read on the chain at the ask (`getAccountInfo` of its own account, the watch's
   read); under 10 USDC nothing is sent (the relay's own floor). The destination is `SPACE_ROUTER_TREASURY`, the Worker's own setting. **The
   ask names no amount, no account and no destination; such fields in it are not read** (pinned).
4. **The token is spent before the send.** The row of `sr_house_deposits` (migration 0022: the token's sha256, the transaction's signature,
   the flask, the amount, when) is written after the signature is made and before `sendTransaction`. Its primary key is why a token asks once:
   a second ask finds the row (404), and two asks at the same instant cannot both insert. A failure before the row (the node unreachable, D1
   down, under the floor) spends nothing and sends nothing.
5. **After the send** the door hears its own drop (the deposits' list gains the row at confirmed, as a relayed deposit's does) and answers
   `{ signature, amount }`. A send the node refused answers 422 with the signature and the amount too: the row stays, so a send whose answer
   was lost is still counted for its flask.

### The transaction's form

The law's own one-signer deposit, with no byte of this lane's: `depositMessage({ payer: <the fee wallet>, source: <its own USDC account>,
treasury, mint, amount, blockhash })` (app/space-router-deposit.mjs, the form with no `fee` beside it and no commitment): a legacy message,
one signer who pays the fee and owns the account, the memo `space-router:deposit:v1`, then `transferChecked` of the whole amount to the
treasury. Its wire is `signedDeposit` (one signature, the message). This form was finalized on devnet on Oct 30 (PAY-A-TANK-LANDING.md,
`tools/space-router-deposit.proof.mjs`, 12 of 12, with a commitment in its memo); the law's test now pins the plain-memo form to the launch
tool's compiler too.

### Whose deposit it is: the one law line extended

Under the standing law a deposit is its payer's: `verifyDeposit` names the signer whose USDC fell, and the door fills
`tankOfAuthority(payer)`. Here that payer is the fee wallet, so the tank, the row of `sr_deposits` (which the profile's claim and the
faces' list read by `payer`) and the profile would all be the fee wallet's, a key nobody holds in a browser.

- **Built (the smallest):** in `post`, after `verifyDeposit`, one statement: when the payer is the door's own fee wallet, the payer is the
  flask of the signature's row in `sr_house_deposits`, if there is one. Everything after it is the standing code: the flask's tank
  (`st-` and 12 hex of its address' sha256) filled dollar for dollar, `sr_deposits.payer` the flask, the drop, 409 on a second count. For
  every other payer nothing is read and nothing changes; a deposit the fee wallet paid with no row is its payer's, as before (pinned).
  The row can only exist for a signature the door itself made with the fee key, so no ask of a stranger's can point a deposit at a flask.
- **What he then holds**, exactly as after a flask's own relayed deposit: the flask's key in his browser (never exportable), the kept
  signature (`paid`, beside the key), the flask's tank (unkeyed, as every flask's is today: "a flask made this way has no key for an
  agent" still stands), the hexagon, and the right to claim a profile (worker/creators.mjs reads `sr_deposits.payer`).
- **Not built, B: a tank key by the memo's commitment.** The browser would make an `sr_` key and the memo would carry its commitment. Under
  the standing law that keys the PAYER's tank, the fee wallet's; `sr_deposits.payer` would still be the fee wallet, so the profile's claim
  would answer 402 and the faces' list would show no handle; the page would hold a second secret with nowhere to show it, against THE FLASK
  BEGINS AS AN ADDRESS (the page's test forbids a tank key on the page). It needs the same law change as the built one and more.
- **Not built, C: the memo committing to the flask's address.** The chain itself would name the flask, and without the row the standing door
  would refuse the count (428) instead of filling the fee wallet's tank. But a commitment is a secret's by the law; an address is public,
  and only the door's key pattern would stand between it and a claim. Since the row is written before the send, there is no moment the
  transaction exists without it. Left out; it can be added later without touching the bytes' form.
- **Not built, D: send the USDC to the flask's address and let its own relay deposit it.** No law changes at all, but it needs a new
  instruction (making the flask's token account), moves the money twice, and leaves 600 USDC under a browser's key between the two.

## The page's half (app/dl-kit-deposit.js, +10 -10)

With `#house=<43 letters>` in the address, the open deposit door (Fill your tank on `after-the-mint.html?side=flask`; the mint page's door
is the same module) asks the house's door ONCE, in the place of its first watch: the token in the body, the flask's proof in `x-seat`,
nothing else. A fragment reaches no server and no log (walked: the token was in no address the server saw). On the answer it does what it
does for the flask's own deposit, by the same lines: `dl-tank-pouring` with the signature, the count by `POST {signature}`, the fill no
sooner than 6 s after the pour, `paid` kept beside the key, `dl-tank-filled`, and Paint your Lyssajudron stands. A refusal leaves the page
its own watch, with no word. No new UI and no new copy. The flask's proof is one function now (`proofOf`), used by the profile's claim too.

## Verified (the new Mac guidos-MBP-2 over the away shell, node v26.11.0, Nov 12 2026 11:30 to 11:46 UTC; this Mac ran no node)

Written before any run: commit f85bbeca9e (the door, the page's half, the tests). It was run afterwards on its own bytes and needed no fix.

**The lane's tests** (code tip eede02c551; the shipped code is 4737a66bac's):
- `worker/space-router-deposit.test.mjs` 11 of 11 (one new test: no secret 404; a wrong token, no token, no proof, a proof another key
  signed: the same 404, nothing read on the chain; under the floor 422 and the token unspent; the right token: the wire is exactly the
  law's message for the fee wallet's whole balance into the door's treasury, signed by the stand-in fee key, with an amount, a source, a
  treasury and a destination in the ask ignored; the drops' list gains the row; the row holds the flask and no token; a second ask by the
  same or another flask 404, one send; counted for the asking flask by the signature alone, its tank dollar for dollar, 409 again, no tank
  of the fee wallet's; the flask's key claims its profile 201; a fee-wallet deposit with no row is its payer's; a send the node refused: 422
  with its signature, the row kept, a second ask 404; a database behind 0022: 503, nothing sent, other deposits counted; the 31st ask 429).
  Four faults planted in the door on the scratch tree (no spent check; the payer not the flask; the token never compared; half the balance)
  each turned this test red, 10 of 11; the tree was restored.
- `app/space-router-deposit.test.mjs` 5 of 5; `app/dl-kit-deposit.test.mjs` 8 of 8 (one new test of the page's half).
- Green beside them: `app/dl-twelve` 21 of 21, `app/after-the-mint` 7 of 7, `app/warm-door` 5 of 5, `app/dl-mint-pour` 2 of 2,
  `app/dl-mint-flask` 6 of 6; `worker/android-attest` 5, `app-attest` 4, `bronze` 6, `creators` 8, `gold` 3, `her-wish` 12, `premint` 27,
  `ranges` 8, `space-router-link` 4, `-oracle` 7, `-portrait` 6, `space-router` 11, `the-payee-is-not-the-key` 3, `tracenet-subscribe` 5,
  `tracenet-tank` 5, `tracenet-vault` 12, `tools/site-files` 4, all of all.
- Red, main's: `lab/one-page` 7 of 10 (a tracenet's file list; warm.html's entry module; what the build ships outside app/), the same three
  on main's own tree db1499d47a.

**Rule 8** (tip 4737a66bac): `node --test app/dl-twelve.test.mjs` 21 of 21; `app/warm.html` served by `tools/serve-range` (206 on a Range):
`dl-twelve.proof.mjs --url <the page> --tap button` PASS and `--tap sphere` PASS ("the sound came in where the picture was, and the picture
never went back").

**The gates** (tip 4737a66bac, and again with the same counts at 0212f5b19f, the tip that holds the script and this receipt, 11:45 UTC, where
the lane's three tests, `app/dl-twelve` 21 of 21, `tools/site-files` 4 of 4 and `worker/premint` 27 of 27 were green again):
- `the-javascript-only-shrinks` 14 of 15, RED, this lane's: "this lane's JavaScript +64 -26, net +38 in 7 files". His pass is asked.
- `the-look-is-a-law` 2 of 2; `the-law-is-the-gate` 7 of 7; `no-page-of-its-own` 3 of 3.
- `any-room` 12 of 13, red, main's: ONE ROOM, EVERY FIXTURE names `embertide-viewer-ios/Checks/house-heard/main.swift: Box-0`, the same on
  main's own tree.

**The walk, 26 of 26** (tips f85bbeca9e and 4737a66bac; a scratch script, not committed: the JavaScript gate refuses a new file). The site's
own files and the Worker's own handler on one 127.0.0.1 origin, a D1 in memory with every migration, headless Chrome off every screen with no
host resolved but the loopback. The fee key, the mint (the dev-mint road) and the treasury are stand-ins made in the run; the Worker's node
is a stand-in chain made in the run that takes a `sendTransaction` only if its bytes are the law's one-signer deposit of the fee wallet's
whole USDC into the treasury and its signature is the stand-in fee key's. No real key, no mainnet, no money.
- The door asked directly: no secret 404; a wrong token 404; the right token with no proof 404; nothing read on the chain, nothing spent.
- The page with no fragment: Fill your tank (a trusted press), the address shown, two watches of its own address, no ask of the house's.
- The page at `#house=<token>`: Fill your tank; one ask (`house` its only field, the proof beside it), 200; one transaction on the stand-in
  chain, 338 bytes, the law's bytes, the fee key's signature, 600412645; the pour's word with the signature, 600.412645 and its tier; the
  fill's word 6.0 s later for the flask's own tank; `paid` in the browser is the signature; the house's row names this flask; `sr_deposits`
  has one row, its payer the flask; one tank, 600.412645 poured, unkeyed; one drop; the cell filled, "Paint your Lyssajudron →" shown, the
  door's line "Swarmy’s flask holds $600.41."; the token in no address the server saw.
- Paint your Lyssajudron pressed: the mint page arrived at `?door=deposit&then=making` and said the pour for the kept signature, then the fill.
- The same address opened again: the page asks once more, 404, nothing sent. Another flask with the right token: 404. The signature brought
  again: 409.
- No page error. The still after the fill was looked at (the visitor's cell filled at the middle, the button under the words, Fill your tank
  still beside it as landed); the still of the step on caught her making's white flash and says nothing more.

## NOT verified

- **Mainnet, and the real Worker.** Nothing here ran on Cloudflare, on real D1 or against the Worker's real node. This Worker has never sent a
  transaction on mainnet: the relay was walked on devnet's node (Nov 11), and the node the config names (`solana-rpc.publicnode.com`) has
  answered the live Worker's reads, never a `sendTransaction`. The first send may be refused (422): the token is then spent, nothing has
  moved, and `token` makes another.
- **A devnet walk with a stand-in fee key** was not made: it needs test SOL and a stand-in mint on devnet (the faucet was closed on Nov 11).
  The walk above stands in the chain itself. Before any real press, that walk is the one thing more that could be done.
- **The press script** ran only in its `read` mode (three GETs; it read the fee wallet's 600412645 at 11:38 UTC). Its wrangler lines (the
  secret by a pipe, the migration, the deploy, `secret list`, `secret delete`) have not run.
- A phone's width, Safari, a private window (the page says "A private window keeps no flask." and asks nothing: read, not walked).
- The Worker's 8 s limit on a node's answer against a slow `sendTransaction`.

## His presses, in order

1. His eyes on this lane, his pass for the JavaScript (+38), the hand. Nothing below works before the lane is on main.
2. On the Mac that publishes the site: `embertide-app/ui/intro/dyson-society/the-houses-usdc-fills-a-flask.sh`. It refuses unless the lane
   is on main and the served tree holds it; reads the chain; makes the one-time token and pipes it into the Worker's secret (never shown,
   never on a disk); applies migration 0022 (wrangler may ask: yes); builds and deploys by the house's line; reads the live site against
   main; then prints ONE address, `https://optimism.fit/app/after-the-mint.html?side=flask#house=<token>`. That line shows the token, once,
   because he must open it; it is his alone until it is spent.
3. He opens that address in the browser that should own the flask (the one he keeps: the flask's key lives in that browser alone), presses
   Fill your tank, waits for the fill (about 20 s on mainnet: finality, then the pour's 6 s), then presses Paint your Lyssajudron. If he left
   the page before pressing it, the step on, in the same browser: `https://optimism.fit/app/warm.html?door=deposit&then=making`.
4. `the-houses-usdc-fills-a-flask.sh read`: the fee wallet holds 0, the list holds one drop.
5. `the-houses-usdc-fills-a-flask.sh remove`: the secret off the Worker; the door answers 404 to everyone again.

If the send is refused or the address is lost: `the-houses-usdc-fills-a-flask.sh token` (a new secret and its address; no deploy).

## What can still go wrong with real money, and how the door fails closed

- **The money can only go to the treasury.** Whatever is asked, by whomever, the one thing this door signs is the fee wallet's whole USDC
  into `SPACE_ROUTER_TREASURY`. It cannot be sent twice: a second transaction would find nothing to move.
- **The token read by another before he uses it** (the terminal's scrollback, the browser's history, a screen shared): they could have the
  deposit counted for THEIR flask. The USDC still lands in his treasury; what they would hold is a tank's fuel, the hexagon and the profile.
  The mend would be his hand on three D1 rows. Open the address at once; `remove` after.
- **The node refuses the send:** 422, the row kept, the token spent, nothing moved. `token` again.
- **The send's answer is lost** (the Worker's 8 s limit, a cut): the page still gets the signature and counts as usual. If the page got no
  answer at all, the deposit is counted for his flask the moment anyone brings its signature (`POST {signature}`, a public ask that moves
  nothing; the signature is the fee wallet's last transaction), and its hexagon stands, but that browser holds no `paid`: the step on to her
  making and the profile's picture would need the signature put beside the key by hand. Not mended.
- **Finality slower than the page waits** (30 asks, 135 s): "Sent. Still counting."; the same case as above for `paid`.
- **The door shows an address first.** For about 3 s after Fill your tank (until the watch's first turn, where the ask is made) the page
  shows the flask's own address and its code, as for every visitor. Nothing is to be sent to it; the script's last lines say so. USDC sent
  there by mistake is not lost: the flask's own relay deposits it (10 or more), for the same flask.
- **The browser forgets its flask** (cleared site data, another browser): the tank and the profile cannot be reached, as for every flask.
  The money is in the treasury regardless.
- **The fee key changed between the send and the count:** the count would not know the old fee wallet as the door's own and would fill
  that payer's tank. Do not rotate `SPACE_ROUTER_FEE_KEY` between the two.
- **The deploy before migration 0022:** the house's ask answers 503 and sends nothing; every other deposit counts as ever (pinned).
- **More USDC reaches the fee wallet later:** a new token deposits the new whole balance for whichever flask asks; the door is his to open
  again by a new secret.
- **The books.** For this one deposit `sr_deposits.payer` is the flask, not the chain's payer (the fee wallet); `sr_house_deposits` says so by
  its signature. The 0.007156 USDC already in the treasury is in no book.

## Files

`worker/space-router-deposit.mjs` (+20 -6), `worker/migrations/0022_the_houses_deposit.sql` (new), `app/dl-kit-deposit.js` (+10 -10),
`app/dl-kit-deposit.mjs` (+3 -4), `app/space-router-deposit.mjs` (+1 -2), the three tests (`worker/space-router-deposit.test.mjs` +21 -2,
`app/space-router-deposit.test.mjs` +3 -2, `app/dl-kit-deposit.test.mjs` +6 -0), `the-houses-usdc-fills-a-flask.sh`, this receipt.
No stamp moved: the live site answers these files `max-age=0, must-revalidate`, so the page's half reaches his browser at the deploy.

## His pass for the JavaScript (Nov 12 2026, about 11:50 UTC)

The lane's JavaScript is net +38. His words in claude-552ca914's chat, to "Hand the deposit door with a pass for +38 JavaScript lines?":
"Yes, pass +38". The pass is `tools/embertide-mesh/tests/the-houses-usdc-fills-a-flask-exception-2026-11-12.json` and its row in the gate's table
(`tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs`), written on the line of the row before it, so the gate's file changes one line and
adds none: the lane as handed counts +65 -27, net +38 in 8 files. It covers these bytes on this base and nothing else.

## Nov 20 2026: the address that opens the pour, and a read that fails is not an empty wallet (lane/the-pour-opens-where-it-is-read, claude-1cd371e0)

- His run of `token` at 08:43 UTC printed `holds ? base units` and stopped with "the fee wallet holds no USDC ... Tell Claude: nothing there", while the
  chain held 600412645 (mainnet's own node at 08:43:34 UTC, and the door three times right after). The door's read had failed (its second node,
  solana-rpc.publicnode.com, now answers some reads "Indexed requests require a personal token"), and the script took the empty answer for zero.
  Now it asks the door six times, 5 s apart, and when none answers it says "the chain could not be read just now ... run this again in a minute",
  never zero. Tested: `read` live, 600412645; a copy against a stand-in door that answers the terms and fails every wallet read: the new stop line.
- The address it printed, `after-the-mint.html?side=flask#house=`, opens Swarmbook's front now (the ball, "Prompt-2-mine $WARM"): no Fill your
  tank, nothing to press. It prints `warm.html?door=deposit#house=` instead: the mint page's deposit door reads the fragment at its load and asks at
  once. Rehearsed on the live site with a made-up 43-letter token in a throwaway headless Chrome: the door opened in its pour state, asked, and said
  "This address is spent, or it belongs to another browser's flask." (the server's 404 for a wrong token); nothing was sent.
- Not verified: the 200 path on mainnet, this Worker's first send. A refused first send spends the token and moves nothing; `token` makes another.
