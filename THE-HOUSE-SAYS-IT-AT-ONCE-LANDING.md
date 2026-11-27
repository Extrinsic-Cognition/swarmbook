# THE HOUSE SAYS IT AT ONCE (lane/swarmbook-one-branch, Nov 20 2026)

## His words

Nov 20 2026, UTC, seat claude-7209e519's chat, over the screenshot of the Swarmbook front's ball: "do you understand that the unit0 there must expand
hexagon counts live on solana? you get what i mean? the entire point of it is, any time, anywhere we got that diving lyssajudron, it gotta be updating asap
with solana state... u get what i mean by that? it means now it is 0 hexs... i am visiting and see 0 hexs. i wanna be able to see this in the image getting
updated as new ones are minted... with a live rpc or some sort you get me?". Asked "Build the live ball: the site pushes each mint, the Mac listens to
Solana and updates your screens?", he answered **"Build it"**. Asked "Ship the live ball to the site? It needs a +113 JavaScript pass.", after he was told
it was built and rehearsed whole, he answered at 07:31:41: **"Ship it, pass +113"**.

## Before

| Where the diving one is | How a mint reached it | How late |
|---|---|---|
| The Swarmbook front, swarmbook.html's welcome ball | the door's list read every 20 s while the ball was seen (`swarmbook-floor.mjs` POLL_MS) | up to 20 s |
| The mint page's sphere | the list read every second, only while the film held the stop (`dl-mint-pour.js` POUR.drops_ms) | 1 s, only there |
| His glasses (the welcome on the Nest) | `mint/floor`, written only when he ran `mint-floor.mjs take` by hand | never by itself |

And the door heard a deposit only when the payer's own page told it: the live Worker has no chain webhook (no `SPACE_ROUTER_HOOK_KEY`).

## What lands

- **The door pushes** (`worker/drops-live.mjs`): one Durable Object, `DropsLive` (a SQLite class, migration tag `drops-live-1` in `wrangler.optimism-fit.jsonc`),
  holds every open ball's socket asleep (the hibernation API; a page's `ping` answered `pong` without waking it). `GET /space-router/v1/drops/live` upgrades to
  it. The three places the list takes a row say it at once: `heard()` (a deposit told at confirmed), the finalized count when it adds the hexagon, and the card
  road's egg. Each message is `{drops: [row]}`, the list's own rows.
- **Every ball takes the push** (`app/dl-drops-live.mjs`, the page's half): one socket while the page is shown; a pushed mint falls in at once; the list is read
  at each opening and across a gap; a socket that drops opens again (1, 2, 5, 10, then every 30 s). The Swarmbook front and the welcome ball
  (`swarmbook-floor.mjs`) lose their 20 s poll; the mint page (`dl-mint-pour.js`) loses its one-second read and is filled whatever the film is doing.
- **The Mac's ear** (`embertide-mint-ear`, Rust): one socket to Solana (logsSubscribe at confirmed) on the treasury's token account and on the treasury,
  read off the door's own terms; every transaction that did not fail is told to the door by its signature, so a deposit made any way at all reaches the list.
  One socket to the door's push: at its opening and at every mint, the house's own writer runs (`mint-floor.mjs take`), so the Nest's `mint/floor` and the
  welcome on every glass follow. Its job: `tools/embertide-mesh/launchd/gg.embertide.mint-ear.plist` (laid by `lay.sh`, bootstrapped by his hand).

## Read

- On the new Mac at a9eec8e6ee: the site's and the Worker's suites, 691 tests, 685 green; the 6 red are main's own four (`dl-athena`, `dl-handoff`,
  `dl-paywall`, `warm-sphere-moment`, red on main's bytes too) and two pins of `assembly-dive.test.mjs` on the `seen` hook this lane took out (fixed at
  8d0c91e0eb). `embertide-mint-ear`: `cargo test --release --offline` 3 passed; the binary 2.7 MB.
- The treasury's token account the ear derives is the one the house's JavaScript derives (`tools/warm-launch/chain.mjs` ata); on chain it does not exist yet:
  no USDC has reached the treasury, as the door's empty list says. A dry run of 25 s against the live door and Solana: the chain's socket listened; the
  door's push answered 404 (no hall until the deploy), said once.
- **The loop, rehearsed whole in the Worker's own runtime** (wrangler 4.157.0 local, workerd, a fresh local D1, a stand-in node for the chain): a page's
  socket opened (101) and its ping came back `pong`; a deposit told by a page reached that socket **17 ms** after the telling; a deposit only the chain named
  went from the stand-in node to the ear, to the door ("heard 1"), to the page's socket in **10 ms**; the ear's door socket ran the floor writer at its
  opening and after each mint.
- Rule 8: `node --test app/dl-twelve.test.mjs` green in the suite at a9eec8e6ee (no file of the mint page changed since); `nice -n 19 node app/dl-twelve.proof.mjs
  --url <the lane's tree, served with ranges>/embertide-app/ui/intro/dyson-society/app/warm.html --tap button` and `--tap sphere`: both PASS.

## Cost

At rest: nothing at the door (sockets asleep), one socket a shown page (a ping each 45 s), two idle sockets on the Mac. Per mint: one D1 read and one message
to every open socket, instead of every page's reads every 20 s or every second. The JavaScript: +145 -32, net +113 in 18 files (the Worker's hall and the
page's half are new; the polls are out). The ear is Rust.

## His pass of the JavaScript

The lane against main 9048666f89: net +113 in 18 files. His "Ship it, pass +113" is the gate's exception, `the-house-says-it-at-once-exception-2026-11-20.json`
beside this receipt (the base, his words, the net, the cap 113, every counted file's blob before and after, the gate file's own), and its entry in the gate's
approvals, written at the end of the last entry's line. It covers these bytes only.

## After it lands

Nothing is live until his press: the site's deploy (the migration tag makes the hall; `wrangler deploy` applies it), then the ear built and laid on the Mac
whose Nest is at 127.0.0.1:8904 (`cargo build --release` in `embertide-mint-ear`, `lay.sh mint-ear`, his `launchctl bootstrap`). The hook key is optional:
without it the ear tells each deposit as a page does (one signature an ask, 30 asks a minute).

## Installed (Nov 20 2026 ~08:00 UTC, his "Install it")

On the MacBook whose Nest is at 127.0.0.1:8904: `cargo build --release` in `embertide-mint-ear` (49 s), `lay.sh mint-ear`, `launchctl bootstrap gui/501`.
Its first lines: the chain's socket listening on the live treasury and its token account; the door's push answering 404 until the site's deploy
(said once, asked again up to every 30 s). The floor seat's key it writes with is the one his run of take made on Nov 19 (`~/.embertide/nest/mint-floor.key.json`).
