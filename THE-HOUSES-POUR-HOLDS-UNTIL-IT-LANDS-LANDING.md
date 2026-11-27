# The house's pour holds until it lands (lane/the-houses-pour-holds-until-it-lands, Nov 12 to 13 2026)

NOT handed, NOT deployed, nothing sent, no token used. The fee wallet still holds its 600412645 base units (the coordinator's live read).

## Cost

- **At rest: nothing.** No timer, no request, no listener at rest. A page with no `#house=` in its address runs the visitor's door as before.
- **A house address, pressed:** one ask at once. A first ask that goes through: 1 D1 read, the cluster check (once an isolate), 3 reads
  of the chain (the account, the blockhash, the send) and the door's hearing of its drop. Asked again on a row that stands: 2 reads (the
  finalized height, the row's transaction). Every read is tried up to 3 times, 300 ms apart, so a node that fails once costs 0.3 s, and a
  node that is down costs about 0.6 s a read before the door says 503.
- **The page while it waits:** one ask every 3 s while the door answers a failed read (40 asks at most), one count every 4.5 s while a
  deposit is poured; after 8 counts with no final it asks the door once more. Under the door's own 30 asks a minute.
- **On the chain:** the same one transaction as before (338 bytes, one signature, 5,000 lamports). A second one is signed only when the
  first can no longer land or was refused by the node itself.
- **JavaScript: +103 -59, net +44 in 8 files** over main a72acdb099 (the gate's own word, below). No dead line was found to pay with:
  `FIRST_USD` in `dl-kit-deposit.mjs` has no reader but shares its line. No exception and no row were written: **his pass for +44 is the
  seat's to ask.** Not JavaScript: migration 0023 (7 lines), the new press script (73), the old one (+6 -6), this receipt.
- **Measured** (the stand-in walk): the one line stands from the press; a node down for 5 s gives two 503s, the retry line, then the fill;
  a refused first send pours on the second ask, 3 s later.

## What happened, and his words (Nov 12 2026, UTC)

THE HOUSE'S USDC FILLS A FLASK landed at 22:08 (main c9cb9987d6cb) and he deployed it at 22:15. He opened the one address and pressed Fill
your tank. His words: "are ylu fucking kidding me? wtf is this shit? it is jumpign straight into the qr code diocane dioporco...", then
"think... get good design please".

Read live by the seat: nothing moved. The Worker's one node (`SOLANA_RPC`, solana-rpc.publicnode.com) failed reads from the Worker: 1 of 3
watch reads answered 503 at 22:18, 2 of 12 at 23:04. The house's ask made four reads in a row and asked once, 3 s after the press; until
then, and for ever after a 503, the page showed the visitor's door: a code asking for 10 USDC, the stamp, the flask's address. The token
was dropped by the page at that one ask; the door kept no row, so the address he holds is unspent.

## The design, as built (his "get good design"; the six points of the seat's brief)

1. **No visitor's door on a house address** (`app/dl-kit-deposit.js form`). With `#house=<token>` the door's box is made with ONE child, its
   line; the code, the stamp and the address are never made (not hidden: absent). It is in its pour state (`data-at="pouring"`) and says
   "The house pours its USDC into your flask." before anything is awaited, and the ask goes at once. Then the standing lines: Pouring.,
   the count, the fill, the kept signature, Paint your Lyssajudron. No new colour, font or sheet: the line is the door's own
   `.snowtrace-kit-say`.
2. **Never silent** (`housed`, and the pure `houseOf`, `HOUSE_SAYS` in `app/dl-kit-deposit.mjs`). Every answer has a line. 503, 429, a
   network error or anything else that is not a deposit or a 404: the token is kept, "The chain did not answer. Asking again.", asked again
   every 3 s, 40 times at most, then "Not poured. Open this address again." A 404: "This address is spent, or it belongs to another
   browser’s flask." and nothing else, asked no more.
3. **The door retries its own reads** (`worker/space-router-deposit.mjs thrice`, `read`). The cluster check, the height, the row's
   transaction, the account, the blockhash: each up to 3 times, 300 ms apart, before a 503. The send: the same bytes up to 3 times.
4. **One address until it lands** (`house`). A token whose row exists, asked by the SAME flask:
   - its transaction is on the chain with no error: 200 `{signature, amount}`, nothing sent (a page closed after the send goes on);
   - not on the chain and its blockhash still good: the same 200, the page counts;
   - not on the chain and its blockhash past, or on the chain with an error, or refused by the node itself: signed again on a new
     blockhash, the row's signature and height replaced, sent, answered as a first ask;
   - the token from ANOTHER flask: 404, as before.
   Migration `0023_the_pour_holds.sql`: `ALTER TABLE sr_house_deposits ADD COLUMN valid_until INTEGER` (the last valid block height the node
   gives beside the blockhash), nullable.
5. **The books as before:** `post()` counts a deposit the fee wallet paid for the flask of the row that holds its signature now. Unchanged.
6. **The press:** `the-houses-pour-holds-until-it-lands.sh`, below.

### Where the build goes past the brief's words, and why

- **"Its status on the chain" is read by `getTransaction` at confirmed**, the read the door already makes of this node (`heard`), after the
  finalized `getBlockHeight`. `getSignatureStatuses` forgets a signature after about two minutes unless it searches history, and this node
  has refused another searching read ("Indexed requests require a personal token"); a page opened again an hour later must still find its
  deposit. The height is read BEFORE the transaction is looked for, so nothing can land between the look and the verdict.
- **Past means 64 finalized blocks beyond the last valid height** (`PAST`, about 26 s more), against a node whose backends disagree.
- **A send the node itself refused at every try** (a JSON-RPC error: it took nothing) marks the row as past at once, so the next ask signs
  again 3 s later instead of waiting about 100 s for the blockhash. `worker/solana-node.mjs` marks such an error (`refused`). A send that
  merely got no answer is NOT marked: it may have landed, so it waits for its height. Without this the brief's walk (d), "pours on the
  second ask", could not stand.
- **It signs again only while the fee wallet still holds a flask's worth.** If the account is empty the first deposit has landed unseen:
  the door keeps the row and answers 503, and the next ask finds it.
- **The row is replaced only over the signature that was read** (`WHERE ... AND signature = ?6`): of two asks at once, one signs and sends.
- **A row with no height** (written before 0023; none exists) is past only 5 minutes after it was written.
- **The page goes back to the door** after 8 counts with no final (36 s), so a transaction that died is signed again without his hand; and a
  count an earlier visit already made (409) is this flask's fill too.
- **The tree marks the cell the deposit took** (`app/after-the-mint-tree.mjs`, +3 -3). Seen in the still of the address opened again: the
  tree marked the next free cell as his, dashed, and never filled it. Now, once the pour's word names the signature, his cell is that
  deposit's own face.
- The apostrophe in the 404's line is the page's own typographic one (as in "Swarmy’s flask").

### What could not stand as written

- **Walk (b) as worded.** A node that fails every third read never shows the retry line, because the door's three tries absorb it (the
  Worker test proves that: such a node still deposits). The line is seen only when a read fails three times running, so scene b is a node
  down for 5 s and THEN failing every third ask.
- **A 422** ("A flask is made from 10 USDC.": no row and nothing at the fee wallet) has no line of its own in the design; the page treats it
  as a failed read and ends, 40 asks later, on "Not poured. Open this address again."

## The press script, and the old one's greps

`embertide-app/ui/intro/dyson-society/the-houses-pour-holds-until-it-lands.sh`: refuses unless the code (d84cfb8ef1) is on main and the
served tree holds it; applies migration 0023; builds and deploys by the house's line; compares three live files with main; then reads the
Worker's secret NAMES: if the secret is still there it says the address he already holds still works (the table is empty, the token
unspent), else it points to `token`. Modes `token`, `read`, `remove`; every hint is a whole path. No wrangler line of it has run; only
its usage line and `bash -n`.

The old script's line 49: under this Mac's `/usr/bin/grep` (2.6.0-FreeBSD) the pattern `"HOUSE = /^#house="` DOES match; under the seat
shell's `grep` (a ugrep wrapper) it does not. Both scripts now use `grep -F` there and for the secret's name, which matches under both, and
the old script's `remove` hint is a whole path; its printed words no longer speak of an address shown first.

## Verified (the new Mac guidos-MBP-2 over `ssh newmac-away`, node v26.11.0; this Mac ran no node)

Written before any run: commit 7403fd3515. It ran green at once and needed no fix; the two commits after it add a test's line and the tree's mend.

**The lane's tests** (code tip d84cfb8ef1, Nov 12 2026 23:34 UTC):
- `worker/space-router-deposit.test.mjs` 12 of 12. The house's door is two tests now: the guard, the first ask through a node that answers
  503 to every third ask, the bytes, the row with its height, asked again once landed (the same signature, nothing sent), another flask
  404, the books, the limit; then: a send the node refused (three tries of one signature, 503, the row marked) and the same address signing
  again; a send with no useful answer (the row and its height kept), still good (the standing signature), 64 blocks beyond (still), a row
  with no height (still), past with an empty fee wallet (503, the row kept), past (signed again, the row replaced), on the chain however
  late (its signature), on the chain with an error (signed again); a database behind 0023 (503 "cannot keep", nothing read or sent, other
  deposits counted); two asks at once (one signature, one send).
- `app/dl-kit-deposit.test.mjs` 8 of 8 (`houseOf`, the four lines, and the page's text: no code made, asked at once, every answer a line);
  `app/space-router-deposit.test.mjs` 5 of 5; `app/after-the-mint.test.mjs` 7 of 7 (the tree's cell).
- **Eleven faults planted one at a time, each red, the tree restored after each:** no retry of a read; a landed row sends again; a refused
  send not marked; a past blockhash never past; a good one always past; another flask let in; a row that cannot be read taken as no row;
  signing again though the fee wallet is empty; the row replaced without its compare (red only once the two-asks test was added); the
  page asking again on a 404; a house address making the code.
- Green beside them at that tip: `app/dl-twelve` 21 of 21, `warm-door` 5 of 5, `dl-mint-pour` 2 of 2, `dl-mint-flask` 6 of 6,
  `worker/premint` 27 of 27, `space-router-link` 4 of 4, `creators` 8 of 8, `tools/site-files` 4 of 4. At 38aa907d6d (the same Worker
  bytes): `android-attest` 5, `app-attest` 4, `bronze` 6, `gold` 3, `her-wish` 12, `ranges` 8, `space-router-oracle` 7, `-portrait` 6,
  `space-router` 11, `the-payee-is-not-the-key` 3, `tracenet-subscribe` 5, `tracenet-tank` 5, `tracenet-vault` 12, all of all.
- Red, main's, the same on the new Mac's main tree (f323c04e83, which holds a72acdb099): `lab/one-page` 7 of 10; `any-room` 12 of 13
  (`embertide-viewer-ios/Checks/house-heard/main.swift: Box-0`).

**Rule 8** (d84cfb8ef1, 23:35 UTC): `node --test app/dl-twelve.test.mjs` 21 of 21; `app/warm.html` served by `tools/serve-range` (206 on a
Range): `app/dl-twelve.proof.mjs --tap button` PASS and `--tap sphere` PASS ("the sound came in where the picture was, and the picture
never went back").

**The gates** (d84cfb8ef1, 23:34 UTC): `the-javascript-only-shrinks` 16 of 17, RED, this lane's: "this lane's JavaScript +103 -59, net +44
in 8 files"; `the-look-is-a-law` 2 of 2; `the-law-is-the-gate` 7 of 7; `no-page-of-its-own` 3 of 3.

**The stand-in walk, 73 of 73 over seven scenes** (d84cfb8ef1, 23:32 to 23:34 UTC; a scratch script, not committed). The site's files and
the Worker's own handler on 127.0.0.1, a D1 in memory with every migration, headless Chrome that resolves no host but the loopback; the fee
key, the mint and the treasury are stand-ins made in the run, and the Worker's node is a stand-in chain that gives a new blockhash an ask,
counts its height by the clock and takes a send only when its bytes are the law's deposit on a blockhash it gave, signed by the fee key.
- **a, 1440x900 and 390x844, 13 of 13 each.** The frame right after the press: the box holds one child, in its pour state, its text the
  one line; no code, stamp or address was ever in the document from the press to the fill (an observer on every change). One ask, one
  transaction, the lines in order (the one line, Pouring., "Swarmy’s flask holds $600.41."), the signature kept, the books right, the cell
  filled, Paint your Lyssajudron.
- **b, 11 of 11.** The node down for 5 s, then failing every third ask: two asks answered 503 and the retry line stood (still no code);
  the third poured; the node failed 9 of its 16 asks; one send.
- **c, 12 of 12.** The page closed the instant the send reached the chain; nothing counted while it was closed. The same address opened
  again in the same profile: the pour's word for the SAME signature, the fill, no second send.
- **d, 11 of 11.** The first send refused by the node at all three tries: 503, the retry line; the second ask, 3 s later, signed another
  transaction and poured; the row and the browser hold the one that landed.
- **e, 6 of 6.** An address whose token is not the secret: one ask, 404, the spent line and nothing else, asked no more.
- **v, 7 of 7.** The visitor's own door with no fragment: its code, stamp and address as before, and its own 10 USDC poured by the relay
  and filled, by the same lines as before (the count is one function for both roads now).

**The stills** (37 files; this Mac: the seat's scratchpad `pour-walk/`; the new Mac: `~/c4-scratch/house552-pour-out/`), each looked at, the
door at 3x:
- At the press, 1440x900: under the two buttons, about 140 px below them, one centred line in the door's quiet grey, 13 px. Nothing else
  where the code stood. It is small: it reads at once at 3x, and at 1x it is the quietest thing on the page. Larger or brighter is a
  sheet's change and his call.
- At the press the ball is covered in sparks and no stem is drawn yet; the visitor's door shows the very same frame, so it is the tree's
  own opening, not this lane's. By the pour the stem runs from the cell to the line and the cell is rimmed crimson.
- At the press, 390x844: the line stands between the ball and the wordmarks, whole on one line. Fill your tank is caught in the phone's
  own tap highlight (a green fill, a blue box): the frame was taken as the touch ended.
- The retry line and the spent line: the same place and type, whole on one line at 1440. On the spent address the tree still draws its
  dashed cell and the stem to the line, as for any opened door.
- The fill: his hexagon filled at the middle with its crimson rim, the liquor under it, Paint your Lyssajudron under the words, Fill
  your tank still beside it (as landed). The address opened again shows the same picture since the tree's mend; before it, a dashed empty
  cell stood at the middle and his hexagon low on the ball.

## NOT verified

- **Mainnet and the real Worker.** Nothing ran on Cloudflare, on real D1 or against the real node. This Worker has still never sent a
  transaction on mainnet; whether solana-rpc.publicnode.com takes a `sendTransaction` from it, answers `getBlockHeight` at finalized and
  keeps a transaction readable an hour later is unread.
- **The node's failures are assumed to be quick 503s.** A read that hangs costs the Worker's 8 s limit a try: three tries of one read are
  24 s, and the page waits on that one ask.
- The press script's wrangler lines; a devnet walk; Safari; a real phone; the mint page's own door (`warm.html?door=deposit#house=`), which
  runs the same module but was not walked.

## His presses, in order

1. His eyes on this lane, his pass for the JavaScript (+44), the hand.
2. On the Mac that publishes: `~/code-ec/house/embertide-app/ui/intro/dyson-society/the-houses-pour-holds-until-it-lands.sh`.
3. The address he already holds, opened again in the same browser as before (or `... token` for a new one), then Fill your tank.
4. After the fill: `... remove`.

## What a real run could still break

- **A send that got no answer and never reached the chain:** the door answers its standing signature while the blockhash is good, so the
  page says Pouring. and plays the drop for about 100 s before the door signs again and it pours for real. Honest only if it lands.
- **A node whose backends disagree by more than 64 finalized blocks** while a first transaction lands unseen AND the fee wallet's account
  still reads full: the door would sign a second one, the row would hold the wrong signature, and the first deposit would be in the
  treasury uncounted for his flask. The money cannot go twice (the second finds nothing to move). The mend would be his hand on one row.
- **The first ask on a node that hangs:** up to 24 s a read with only the one line on the page.
- **40 asks spent** (about 2 minutes of a dead node): "Not poured. Open this address again."; the token is kept by the door, so the same
  address works again.
- **The token read by another** before he uses it, the browser that forgets its flask, the fee key rotated between the send and the count:
  as in THE-HOUSES-USDC-FILLS-A-FLASK-LANDING.md, unchanged.

## The pour's words, and his pass for the JavaScript (Nov 13 2026)

After the builder's walk the house's one line stood as the quietest thing on the page (13 px, grey). One rule of `app/after-the-mint.css`
(`.am-tree-kit [data-at] .snowtrace-kit-say`) sets the pour's words in the title's serif, in cream, at a sentence's size; the waiting visitor's
line is as it was. Walked again on the new Mac at a44e47217f, 14:01 UTC: a 13 of 13 at 1440x900 and 390x844, b 11 of 11, e 6 of 6, v 7 of 7.

Five frames of that walk were sent to him. His words in claude-552ca914's chat, about 14:05 UTC, to "Hand the rebuilt deposit page with a pass
for +44 JavaScript lines?": "Yes, pass +44". The pass is `tools/embertide-mesh/tests/the-houses-pour-holds-until-it-lands-exception-2026-11-13.json`
and its row in the gate's table, written on the line of the row before it: the lane as handed counts +104 -60, net +44 in 9 files.
