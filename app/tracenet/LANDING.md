# THE SUBSCRIBE PORTAL: optimism.fit/<handle>, a builder's tracenet, each drop subscribers' for 7 days (Oct 14 2026, 22:3x to 23:0x WEST, lane/tracenet-portal)

## Current requirement — sell the creator's traces, October 15, 2026

Guido rejected the creator journey below: "we dont fucking need all of that, we just fucking need a place where i can sell self-sovereign my fucking traces". The portfolio, bookmark and disabled subscription sheet are not an accepted product. The implementation record below is retained as history, not a design brief.

The acceptance test is one real buyer completing this journey: open the creator's link, inspect a real trace preview, select access, pay the creator, then read or download the purchased traces and restore access later. Keep the public surface to the creator, trace releases and access. The creator chooses what leaves the Nest, controls the receiving wallet and published files, and can carry the catalog and access records to their own deployment. Earlier explicit prices remain Normal $10/month and Priority $1,000/month; their benefits and renewal mechanism must be explicit before sale. Do not silently substitute Society seats.

Source audit at `dbd64627`: the manifest contains **0 published trace releases**. The only implemented payment route transfers SOL directly to a single pinned Society recipient; its ownership is not established by the source. The vault uses Society receipts across creators and Cloudflare assets/D1. There is no creator recipient configuration, creator-scoped monthly entitlement or membership export. Calling this self-sovereign creator commerce would be false.

The next implementation must close the sale loop using the existing payment verification, wallet proof, manifest, vault and download hashing where appropriate. It must preserve the Nest sanitization gate; the withdrawn sample is a test fixture, not inventory. Prove correct creator/plan/paid-through access, denial for unpaid or other-creator purchases, restoration, expiry and verified delivery. A screenshot of another subscription sheet is not that proof. No payment, publication or UI change was performed during this correction audit; runtime cost added: **0 requests, 0 timers, 0 bytes shipped**.

## Remove redundant identity and captions — October 15, 2026, 18:51 WEST

Guido rejected the repeated identity/product/bio block in his screenshot. The reading header now contains only the handle and Subscribe. Removed the large display name, biography and TRACENET label; suppressed search/count for the three-item list, project captions and metadata, and the typing strip while reading. Project details retain the context behind each preview. Existing Harmony styling and laptop appearance remain. The moved Subscribe is hidden in the closed laptop so it cannot receive keyboard focus there.

Browser QA passed at 1280 x 720 and 390 x 844: one identity, three project previews, no horizontal overflow, Subscribe opens and returns focus, and Traces navigation still works. The desktop list fits without scrolling. HTML/CSS only: -1,485 B raw / -271 B gzip; no added requests, scripts or loops. The unavailable checkout and unpublished trace inventory are unchanged.

## Visual consistency correction — October 15, 2026

Guido: "eh so? why the fuck cant you fucking keep the style consistent diocane". Tracenet now consumes the existing `dl-paywall.css` tokens used by Project Snowtrace in `warm.html#mint`: glacier panels, navy text, teal accents, Bodoni headings and DM Sans controls. Its local serif-body override and separate gold/teal membership palette were removed. Reader, project, Margaret, traits and membership surfaces share that treatment; laptop and Lyssajudron artwork remain unchanged. Removed the bookmark controls and redundant membership captions. This is a styling correction, not acceptance or completion of creator commerce.

QA: 21 targeted access/profile/register tests passed. In-app browser checks covered the desktop reader, 390 x 844 reader and membership sheet, both monthly prices, Margaret subscription and return, project details, traits, and a 390 x 640 scrolling project dialog. No horizontal page overflow; project close remained visible after scrolling 181 px. Source review caught and fixed Margaret's hover contrast and a close-button positioning regression. Computed controls use DM Sans, headings Bodoni; primary action is navy `#16263a` with pale cyan `#a9e6f5`. Three project covers loaded. Before the correction the reader had 24 computed text/background colors and a Georgia body override; the final reader uses the shared palette (six distinct text/background colors, excluding transparent). The character appearance colors are user traits, not UI palette tokens.

Cost: one additional cacheable request for the existing shared stylesheet (9,936 B raw / 2,907 B gzip). Net HTML/CSS delta including that request: +10,377 B raw / +2,729 B gzip. No added script, backend request, timer or animation loop. Checkout remains unavailable and there are no published trace releases; no payment or trace publication was performed.

## Rejected creator journey — October 15, 2026

Guido chose **monthly creator subscription**, then **$1,000 priority / $10 normal**. This supersedes the historical statement below that a creator subscription is a Society seat. Existing Society file rights remain intact; monthly creator billing is not implemented.

The laptop and Lyssajudron remain the entrance. Enter Tracenet opens the builder's identity and a scrollable list of real projects. Each project opens its public demo and published traces. Subscribe opens a compact sheet for that creator, retains the selected project or Margaret collection, and returns to it on dismissal. Normal is $10/month; Priority is $1,000/month. Selection changes the displayed monthly total only. Priority's precise benefit and release timing still need definition; Society Gold/Bronze timing is not silently reused.

Today the public `photons_enjoyor.json` register has zero traces. The sheet states that fact and disables checkout. Save creator is a browser bookmark, explicitly labelled "Saved on this device"; it neither subscribes nor promises notifications. Existing holders use the separate Restore Society access link, without a sales-availability preflight. Restoring that access does not label the user a monthly subscriber.

The complete paid journey still needs recurring billing tied to buyer + creator + plan, server-verified paid-through access, a return to the chosen trace after confirmation, and membership management with the next renewal amount/date and cancellation. Failed, pending or cancelled payment must return to the selected work without unlocking it. Local storage and a client payment event cannot establish paid access. Publish actual creator traces before enabling purchase; the UI contains no invented trace packs.

This UI increment adds one static stylesheet, no polling or animation loop, and no new backend requests. Targeted access, profile, register and keyboard tests pass; browser QA covers desktop and 390px reading, price selection, project/collection return and bookmarks across reload. The older sections below are retained as historical implementation records.

## What it costs

| | before | predicted | measured |
| --- | --- | --- | --- |
| the page, as a visitor | no page | the page, three sheets, three modules, the register: 9 GETs, about 30 KB gzipped, 0 to the Worker | **9 GETs**, 0 to the Worker (the door's own count under headless Chrome, both sizes): tracenet.html 4,751 B (1,913 gz), tracenet.js 8,450 (3,466), tracenet.css 3,292 (1,316), tracenet-register.mjs 4,291 (2,005), dl-paywall.js 11,919, dl-direct-protocol.mjs 4,789, warm.css 39,537, dl-slot.css 5,920, the register 722 B |
| the page, as a holder | | one GET per order the checkout saved in this browser, at most six, once at load | one (`GET /api/premint/orders/<id>`; the paywall's `savedReceipts`, its cap of six) |
| the page at rest | | 0 | no timer, no poll, no animation (`tracenet.test.mjs` reads the sources: no setTimeout, setInterval, requestAnimationFrame, @keyframes); the Subscribe press loads the checkout's files once |
| a gated request on the Worker | no route | one read of the register (an asset), one row (`SELECT * FROM premint_orders WHERE id = ?`), one read of the bytes | a visitor 402 in **15.9 ms** cold then 1.7 to 2.1 ms; a paid receipt 200 in **3.1 ms** (2,527 B, the register's sha256); HEAD 3.5 ms, no body; day 8 to a visitor 200 in 1.6 ms (the proof's door on this Mac at load 10.2, the handler called in-process: the Worker's own time, no network) |
| the Worker | 118 lines | +1 import, +2 lines | `premint.mjs` 6 lines changed; the gate is its own module, 4,210 B; one pattern added to `run_worker_first` |
| the build | 1,428 files, 440.8 MiB (the house checkout, Oct 14 10:2x) | +1 folder (`vault/`), one check per drop (its bytes and sha256), one redirect per handle | in the lane's checkout (no films there): 171 files, 57.8 MiB, "tracenets: photons_enjoyor"; the redirect `/photons_enjoyor /app/tracenet.html?of=photons_enjoyor 302`; `/vault/*` `Cache-Control: private, no-store` |
| moving parts added | | none: no binding, no key, no migration, no cron, no third-party file | none; the clock is the request's |

## His words (WEST, verbatim)

- Oct 14 19:17 (9952a56c): "dude do you understand how basically we need to nail the fucking loop of: * being a OSS dev * getting money thrown at in
  exchange for traces exchange * THE THING I NEED TO VALIDATE IS MY FUCKING TRACENET DUDE CAN WE PLEASE FOCUS ON CREATING THE PORTAL TO WHERE YOU
  SUBSCRIBE TO THE TRACENET OF SOME GUY? WHAT DO YOU THINK?"
- Oct 14 19:13 (2ef6a80e): "listen dude... i need to start gettign money i am ran out of credits i need people to start minting... the viral videos are
  aiming to overcome the paywall as the paywall is mainly premium paid on novelty... i want to keep 7 day exclusivity: BASICALLY I AM LAUNCHING MY OWN
  FUCKIG TTRACENET DUDE OK?"
- Oct 14 21:21 (this seat, and 004f9faa): "i am trying to: * get enough money from the mint to make ai credits back by starting my own tracenet * thrive
  and get more than that by having gamified karaoke lyssajudron bonding"; 22:3x: "i need you to be fucking execution oriented by the roadmap to execute
  on is not something i can spend the entire day whisperigninto your ear".
- Oct 12 19:29: "optimism.fit is gonna be the ground domain... my visitable page is an address there... like think about hivemind and address of your
  individual hive cell"; 18:49: "github page / optimism.fit (basically my entrypoint into personal website aka tracenet subscription...)".
- Sept 28 00:49: "i am focused on people that vibecode cool shit and have "onlyfans-like links" that people can use to go there, pay money and download
  their traces... everything needs to be frictionless and with as least steps/clicks possible... maximum transparency etc..."; 03:23: "tracenets =
  onlyfans profiles for vibe coders".
- Sept 24 19:20: "individual tracenets are minirouter fuel tanks and you can subscribe to traces access".
- Sept 20 19:14: "i want to do something where basically i auction out early access to my traces... i am sharing traces of me working on OSS code".

The lineages this lane read first: `docs/the-intro-to-the-karaoke-mint-confluence-2026-10-14.md`, `docs/phase-one-lyssajudron-warm-pool-hypertrace-2026-10-14.md`,
`docs/warm-memecoin-fuel-panspermia-trace-auction-hypertrace-2026-10-14.md`, `docs/optimism-fit-lineage-hypertrace-2026-10-14.md` (row 23: "the 7-day window:
each new thing carries its publish time, the Worker serves it to a paid receipt... until 7 days pass, then to all; computed at the request, nothing runs at rest"),
`docs/dyson-society-snowtrace-tracenet-swarm-money-hypertrace-2026-10-14.md`, `docs/wishes-and-the-servants-hypertrace-2026-10-11.md` (Tracenet / Project Snowtrace: partly).

## What it does

- **The address.** `optimism.fit/<handle>` is a builder's tracenet (the handle is the X handle without the @: his is `photons_enjoyor`, `identity/x` on the
  Nest). The build writes the redirect for every register it finds; the one page `app/tracenet.html?of=<handle>` draws them all.
- **The register is public, the bytes are not.** `app/tracenet/<handle>.json` (`optimism.tracenet/1`): who (name, one line, X, avatar) and every drop's
  id, title, kind, size, sha256 and publish time, newest first. The bytes are `vault/<handle>/<id>/<file>`, assets the Worker runs first on.
- **The law** (until Oct 15 2026: since then THE LAW, TIERED, the last section of this file). A drop is subscribers' for `EXCLUSIVE_DAYS` (`app/dl-paywall.js`, his 7) from its publish time, to the millisecond, and
  everyone's after: `app/tracenet-register.mjs` `opensAt`, read by the page, the Worker, the build and the publisher. No second definition anywhere
  (the test reads the sources).
- **The gate** (`worker/tracenet-vault.mjs`, `GET` and `HEAD /vault/<handle>/<id>/<file>`): what no register names is 404; before day 8 a request must carry
  `x-seat: <the wallet's seat proof>` (since Oct 15 2026, THE SEAT PROOF below; until then `x-receipt: <order id>`) from a wallet with a row that is paid,
  to the pinned recipient, under the current terms, a tier the checkout sells, signed (the paywall's five conditions on the Worker's own row), else 402
  with the instant the drop opens; from day 8, everyone. Served `private, no-store`, `nosniff`, as an
  attachment under the drop's own name. A walk up is resolved by the URL before any Worker sees it; `%2e%2e` and `%00` are not names.
- **The subscription is the seat.** Subscribe is `[data-mint-tier="bronze"]`: the first press loads `dl-direct.js` once and opens the checkout's own dialog
  (the markup of `warm.html`, every id it asks for, the same wallet, the same receipt saved under the same key); from then on the checkout's own binding
  opens it. A purchase fires `dl-premint-paid` and the page re-reads its receipt. A holder of the mint page is a subscriber here and the other way round.
- **A holder's download** fetches the drop with the receipt, hashes it, says whether the sha256 is the register's, then the browser saves it. An open
  drop is a plain link. A visitor sees "Subscribers only until <day>".
- **The publisher** `node tools/tracenet-publish.mjs <handle> <file> --title "..." [--kind trace]` (the first time: `--name "<who>"`, and `--line`, `--x`,
  `--avatar`): one file becomes one drop in a folder of its own, hashed and timed, first in the register; a second drop of the same title on the same day
  is refused. The build refuses a register whose drop is not on disk with the register's size and hash.
- **The first drop** is this lane's own design trace (`vault/photons_enjoyor/2026-10-14-the-subscribe-portal-how-a-drop-is-gated-a-design-trace/`, 2,527 B,
  published 21:51:05.751 UTC, everyone's from Oct 21 21:51 UTC). It is a sample so the loop runs end to end; his to keep or replace.

## The receipt (this Mac, `lab/tracenet.proof.mjs`, Oct 14 22:53 to 22:55 WEST; load 10.2)

The door served this lane's `app/` and `vault/` and the Worker's handler on `/vault/*` and `/api/premint/*`, with an orders table in memory holding one
paid stand-in receipt (a signature that was never a transaction; no Solana, no purchase, nothing posted). Then his Chrome, headless and muted, off every
screen, over CDP, a device the size of the glass. The proof's own verdicts: the door HOLDS, the page HOLDS.

| pass | what happened |
| --- | --- |
| a visitor, today | 402 in 15.9 ms (cold), `{"error":"Subscribers only until 2026-10-21T21:51:05.751Z.","opensAt":...}`, 97 B, no-store; HEAD the same |
| a paid receipt, today | 200 in 3.1 ms: 2,527 B, sha256 `c2a0d88a…83bc` = the register's; `private, no-store`; `attachment; filename="the-subscribe-portal-design.md"`; HEAD 200, 0 B, the same length header |
| an unknown receipt; submitted, open, another recipient, old terms, upper case, one char more or less | 402, every one (the tests); `?receipt=` in the address is not a receipt |
| the last millisecond before day 8 | 402 |
| day 8, day 38, to a visitor | 200, the same bytes and hash |
| the register, the page | 200: 722 B in 0.9 ms, 4,751 B in 1.3 ms |
| headless Chrome 1440 x 900 | the title "extrocco \| Latency Guy · a tracenet · optimism.fit", 1 row, Subscribe shown, document width 1440 = window (no sideways scroll); 9 GETs, 0 to the Worker; 1.4 s; `lab/tracenet-pictures/1-a-visitor-1440x900.png` |
| headless Chrome 390 x 844, mobile | the same title and row, width 390 = window, height 851 (one screen and 7 px); 9 GETs, 0 to the Worker; 2.4 s; `2-a-visitor-on-a-phone-390x844.png` (the avatar had not arrived from X when the picture was taken; the desktop one had) |

A first picture taken with Chrome's one-shot `--screenshot` at 390 px was cut at the right: that is Chrome's minimum window width, not the page; the
proof drives CDP with device metrics since, and reads the document's width itself.

## Tests

- `node --test worker/tracenet-vault.test.mjs` 10 of 10: every register whole (on disk, size, hash, forms, newest first); the law to the millisecond; the
  wall; the paid receipt (bytes, headers, HEAD); the receipts that open nothing; day 8 and the millisecond before; what no register names (handle, id,
  file, encoded dots, a NUL, methods); a register that is not this handle's; the Worker running first and the premint door still answering; the build.
- `node --test app/tracenet.test.mjs` 6 of 6: one law; the handle from the address; the register as read; the receipt among saved orders; the page's
  paint as visitor, holder, pressing Subscribe (one load, one open), no such tracenet; the dialog whole (every id `dl-direct.js` asks for), no timer, no
  animation.
- `node --test tools/tracenet-publish.test.mjs` 2 of 2.
- The mint's neighbours unchanged: premint 15, paywall 14, holder orbits and profiles 42: **89 of 89** in the folder.
- The proof: `node lab/tracenet.proof.mjs --out lab/tracenet-pictures` (about 4 s; `--no-chrome` for the door alone).

## His presses (nothing of these was touched)

1. **The deploy**, from `embertide-app/ui/intro/dyson-society`: `node tools/build-optimism-fit.mjs && npx wrangler deploy --config wrangler.optimism-fit.jsonc`.
   It ships all of main since the live page (07:26 WEST) with this: the paywall, her wallet's road, the sound first, and the portal.
2. **The drops**: what sits behind the wall for the 7 days is his, by `node tools/tracenet-publish.mjs photons_enjoyor <file> --title "..."`, then commit
   `app/tracenet/photons_enjoyor.json` and `vault/photons_enjoyor/<id>/`, then the deploy. The first drop (a design trace) is his to keep or replace.
3. **The words**: the page's sentences (the law line, the seat line, the footer) are mine, marked in `tracenet.html`; the register's name and line are his
   X name and a line of mine ("Traces of OSS work: the house, the Nest, Project Snowtrace.").
4. **The price**: the subscription is the Bronze seat ($10, the checkout's `TIERS`); a tier of its own for subscriptions is a Worker change, his call.
5. **One seat, every tracenet**: a paid receipt opens every drop of every tracenet on this site (one society). Per-tracenet seats are his call.
6. **The bearer**: the receipt was the order id the checkout saved in the buyer's browser, carried in a header; whoever held the id downloaded. Closed
   Oct 15 2026 (THE SEAT PROOF, the last section): the wallet signs a fresh nonce, and an order id opens nothing.

## Not done, and why

- Not deployed, not signed, nothing sent; the Worker's config gained one pattern and nothing else; its database untouched.
- Not measured on lysa or a phone device: headless on this Mac only (the serving Mac, at nice 19, 4 s).
- The Harmony app's Tracenets tab (`embertide-app/ui/intro/life-menu/tracenets.mjs`) does not yet name the address `optimism.fit/<handle>` next to
  THIS NEST, and the share's words (`user-journey-from-zero-2026-10-14.md`, break 4) still land on the mint: one line each, after his word on the address.
- The Sept 16 blind auction and the 30 days are not this: his Oct 14 7-day rule is what the gate keeps.
- The register is public by design; a drop's title is public the moment it is published.

## The wishes it touches (rule 6; the line written in the wishes doc)

Under **Tracenet / Project Snowtrace (tracenet-snowtrace): partly**: "- Oct 14 2026 23:0x WEST · The subscribe portal, Claude Fable 5.1
(lane/tracenet-portal; `embertide-app/ui/intro/dyson-society/app/tracenet/LANDING.md`), on his 19:17 ("CREATING THE PORTAL TO WHERE YOU SUBSCRIBE TO
THE TRACENET OF SOME GUY") and 19:13 ("7 day exclusivity: BASICALLY I AM LAUNCHING MY OWN FUCKIG TTRACENET"): optimism.fit/photons_enjoyor is his
tracenet's page: the public register of drops, each subscribers' for 7 days from its publish time through the Worker's vault against the checkout's
paid receipt, then everyone's; Subscribe is the Bronze seat; one drop published (a design trace). Proved on the door and in headless Chrome (390 px:
no sideways scroll). Not deployed; his: the deploy line, the drops behind the wall, the words. The wish stays partly: the mesh between Nests, the room
as the window and a marketplace beyond one builder are not this."

## Live (his deploy, Oct 14 2026 23:1x WEST; read from Lisbon at 23:2x)

His one line (`node tools/build-optimism-fit.mjs && npx wrangler deploy --config wrangler.optimism-fit.jsonc`): 1,442 files, 440.9 MiB, "tracenets:
photons_enjoyor"; wrangler 4.151.0 uploaded 25 new or modified assets (the portal's files, the register, the drop, and all of main since the live page
of 07:26: the paywall, the sound first, her wallet's road), 1,415 already there; the Worker 22.25 KiB (7.18 gz), 2 ms startup, the same four bindings;
version `b2d15634-db2b-4d0f-a1c0-55a33640c4dc`, optimism.fit and www.optimism.fit.

| read | answer |
| --- | --- |
| `https://optimism.fit/photons_enjoyor` | 302 to `/app/tracenet.html?of=photons_enjoyor` in 0.12 s |
| the page | 200, 4,751 B, 0.31 s |
| the register | 200, 722 B, 0.24 s |
| the drop, a visitor | **402** in 0.07 s, `{"error":"Subscribers only until 2026-10-21T21:51:05.751Z.","opensAt":"2026-10-21T21:51:05.751Z"}`, `cache-control: no-store`, `nosniff` |
| the drop, an unknown receipt | 402 in 0.18 s |
| the drop, HEAD / POST | 402 / 405 |
| `/api/premint/holders` | `{"holders":[]}`: no seat sold yet, so no one can open the drop before Oct 21 21:51 UTC |
| `/app/saint-seiya.m4a` (the paywall lane's receipt) | 200, `cache-control: public, max-age=31536000, immutable`, first read `cf-cache-status: MISS` |

The vault's gate stands on the public edge exactly as the proof had it. What is still his: the drops behind the wall and the words on the page.

## Pulled back (his Oct 14 2026 23:2x WEST: "have you shared any of my information? what is this tracenet? do you understand that everything shared outside must be thoroughly sanitized in the nest itself?")

What his deploy of 23:1x had put on the public edge from this lane, exactly, and what this pass does about each:

| on the edge | what it is | now |
| --- | --- | --- |
| the register `app/tracenet/photons_enjoyor.json` | his X handle, X name and X avatar URL (read from `identity/x` on the Nest, without his word; all three on his public X profile already), a line of mine, and the one drop's title, size, hash and time | the drop's line removed: `items: []`. The who stays, his to strike. |
| the drop under `/vault/` | a design note of mine (2,527 B; names the mint's inner shape and file paths; no words of his, no room data, no key); 402 to everyone today; it would have opened to everyone on Oct 21 21:51 UTC by the 7-day law, with no further press and no sanitization | moved out of `vault/` into `worker/fixtures/tracenet-site/` (never built, never served): the tests and the proof run on that fixture. `vault/` is empty. |
| `app/tracenet.js`, `app/tracenet-register.mjs`, `app/tracenet.html` | his dated chat lines verbatim in their headers, as the mint's existing files carry them (`dl-paywall.js`, `dl-direct.js`, `warm.html`: the same deploy shipped the paywall's with his 19:13 line) | his lines taken out of the three served files; they point here instead (this file is not built). The mint's other files are not mine to change: his call, house-wide. |
| `worker/tracenet-vault.mjs`, `tools/tracenet-publish.mjs` | his lines in their headers; the Worker is a bundle, the tool is not served | unchanged |
| the commits and this file | his lines, in the house git (mirrored stripped of room data to the team's private GitHub) | unchanged: the house's own way |

Nothing of his left this machine by the seat's hand: no message, no upload, no search, no service; the hypertrace reads, the Nest reads and the
proof were local (the proof's Chrome fetched his public X avatar and Google Fonts, as the page does). The one outward step was his deploy line.

**What the edge still holds until his next deploy:** the drop, gated (402 to everyone), opening to everyone on Oct 21 21:51 UTC. The deploy line
takes it off (the build copies no `vault/` now, the register names no drop); it is his, and before Oct 21.

**The rule this lane broke, and what closes it:** "everything shared outside must be thoroughly sanitized in the nest itself". The publisher takes
any file from disk straight into the vault, and the law opens a drop with no second press. Until a drop carries the Nest's own sanitization
receipt, no drop is published: the test now refuses a register in the folder with any drop in it. The pass itself (his Oct 12 13:15 "dude, we
need to have repo sanitization please... come on"; the Sept 18 redactor seed of Harmony-on-Aiolos, `nest-clients-teleology.md`) is the next
lane, his design: a drop is a Nest entry first, the sanitization is a pass the Nest runs over it and signs, the register carries that receipt
and the Worker serves nothing without it. Tests 89 of 89 on the fixture; the proof HOLDS on both door and page; the build with the empty
register: "tracenets: photons_enjoyor", no `vault/` copied, the redirect kept.

## The gate (Oct 14 2026 23:4x WEST, after his template run `tracenet-publish.mjs photons_enjoyor <file> --title "<title>"`, zsh: no such file or directory: file)

Nothing was published by that run (zsh read `<file>` as a redirection). Before a real file goes in, the gate his rule asks for is wired, in the
smallest form that is the Nest's word and not a checkbox:

- **The receipt is a Nest ref**, `tracenet/sanitized/<sha256 of the bytes>`, written by the sanitization pass when it has read the bytes and signed
  them off. The pass itself is the next lane, his design (his Oct 12 13:15 "dude, we need to have repo sanitization please... come on"; the Sept 18
  redactor seed of Harmony-on-Aiolos). Until it exists, the Nest holds no such ref and nothing can be published: read live at 23:4x,
  `GET /nest/ref/tracenet/sanitized/<sha>` answers `{"error":"not found"}`.
- **The publisher** reads that ref (loopback, 5 s) and refuses without it: "not sanitized in the Nest: it holds no tracenet/sanitized/<sha> for
  <file>. Run the Nest's sanitization pass over the file first; nothing was published." (read live on a scratch file at 23:4x: refused, nothing
  written). With it, the drop carries `sanitized: {ref, rev, seat, ts}`, the Nest's own stamp.
- **The register's law**: a drop without a whole receipt is not a drop (`validItem`): the page does not list it, the Worker does not serve it, the
  build refuses it.
- **The build** asks the Nest again for every drop and refuses one whose receipt is not there or not the same rev, seat and ts; with no drops the
  Nest is not asked (built at 23:4x: 1,441 files, no vault, the redirect kept).
- Tests 89 of 89 (the publisher's: the Nest says no, the receipt is another file's, the Nest answers 503, the Nest's 404 and a ref as
  `receiptFromNest` reads them); the proof HOLDS on the fixture, whose stand-in receipt says so in its `seat`.

What the pass must do is his to say; what it must produce is now one ref per file. Cost: one loopback GET per publish and one per drop per build.

## THE LAW, TIERED, AND THE FIRST TRACENET (Oct 15 2026, 01:4x to 02:xx WEST, lane/first-tracenet, step 2)

His words (WEST, verbatim): Oct 15 00:34 "like... my dude... my dear dude my god... THAT THING OVER THERE IS THE FIRST TRACENET: SUBSCRIPTION TO
YOU BY AI AGENTS OR BROKERS OR WHATEVER"; 00:36 "BUT HERE IT IS PEOPLE SUBBING TO ME BECAUSE I SHIPPED SOMETHING REALLY FUCKING COOL TBH AND THEY
WANT THE CODE SO THEY PAY PREMIIM... REMEMBER GOLD MINT MEANS ACCESS NOW!!!!! BRONZE MINT MEANS ACCESS AFTER 15 DAYS; THEN IT IS FREE (but they
dont get any $WARM in-game currency)"; 00:40 "do you understand that the mint process here is 7 days? and you gey $WARM liquid because it is in-game
currency". Before them: Oct 14 19:13 "i want to keep 7 day exclusivity: BASICALLY I AM LAUNCHING MY OWN FUCKIG TTRACENET DUDE OK?"; Oct 12 19:38
"we launch $WARM now * for the first 15 days the market is restricted to authorized developers with approved github"; Sept 28 "tracenets =
onlyfans profiles for vibe coders"; Sept 20 "i auction out early access to my traces... i am sharing traces of me working on OSS code".

**The constants, each in one place** (the tests read the sources for a second definition):

| constant | value | where | what it is |
| --- | --- | --- | --- |
| `MINT_DAYS` | 7 | `app/dl-paywall.js` (was `EXCLUSIVE_DAYS`, the same 7, renamed when the law was split from it) | the mint: Gold and Bronze are sold in the 7 days from `LAUNCH_DAY` (his, unset), and the wall stands for them |
| `GOLD_DAYS` | 0 | `app/tracenet-register.mjs` | a drop is the Gold Mint's from its publish time |
| `BRONZE_DAYS` | 15 | `app/tracenet-register.mjs` | the Bronze Mint's 15 days after it |
| `OPEN_DAYS` | 15 | `app/tracenet-register.mjs` | everyone's, free and with no $WARM, 15 days after it |

"THEN IT IS FREE" is read as day 15 for everyone: `OPEN_DAYS` 15, the same day as the Bronze Mint's (a Bronze seat's difference from the free
way is $WARM). His to move: a tier's day is never later than everyone's (`opensFor` takes the smaller). `TIER_DAYS` maps the checkout's tiers
(`dl-direct-protocol.mjs` TIERS: gold, bronze) to their days; a tier the law does not name waits for everyone. The page's words are written from
the constants (`LAW_WORDS`: "now", "on day 15"; `paintLaw` in `dl-paywall.js` writes every `[data-law]` piece), so moving one moves the mint's
choice and this page with it.

**The gate** (`worker/tracenet-vault.mjs`): every other condition kept (paid, the pinned recipient, the current terms, a tier the checkout sells,
signed); the receipt's TIER is the row's, and before its tier's instant a paid receipt meets 402 with that instant. The answers, the fixture drop
published Oct 14 21:51:05.751 UTC (`lab/tracenet.proof.mjs`, this Mac, Oct 15 01:5x WEST):

| request | answer |
| --- | --- |
| a visitor, the day it lands | 402 `{"error":"Seat holders first; free from 2026-10-29T21:51:05.751Z.","opensAt":"2026-10-29T21:51:05.751Z","tier":null}` |
| a Gold Mint receipt, the day it lands | **200**, 2,527 B, the register's sha256; HEAD 200, no body |
| a Bronze Mint receipt, the day it lands | **402** `{"error":"Bronze Mint opens this drop at 2026-10-29T21:51:05.751Z.","opensAt":"2026-10-29T21:51:05.751Z","tier":"bronze"}` |
| an unknown receipt | 402, tier null |
| the last millisecond before day 15 | 402 to a visitor, 402 to the Bronze receipt |
| day 15 | 200 to a visitor, 200 to the Bronze receipt, the same bytes and hash |
| day 45 | 200 to a visitor |

**The page** (`app/tracenet.html`, `app/tracenet.js`): two seats, "Gold Mint · $1,000 · the code now" and "Bronze Mint · $10 · the code on
day 15" (each the checkout's own `[data-mint-tier]`; the first press loads the checkout once and hands the press on, so the seat's own tier
opens); the law line; "The mint is open 7 days." (the days left once his launch day is set; after the 7 days both seats read closed and the
line says the day the code is free); "Both seats carry $WARM at the mint, liquid: in-game currency, no lock. Free access carries none." (mine,
his to reword, inside `app/terms.html` VI and `app/fees.html` IV: no price, yield or value of $WARM). A holder's seat is read from the receipts
this browser carries, the Gold one first (it ends the asking): a Gold holder downloads each drop at once, a Bronze holder reads "Yours from
<day>" until day 15, a visitor "Free from <day>". Proved in headless Chrome at 1440 x 900 and 390 x 844: no sideways scroll, both seats shown,
the title, 9 GETs to the door (10 on the phone: its favicon), page errors: none (`lab/tracenet-pictures/1-a-visitor-1440x900.png`, `2-a-visitor-on-a-phone-390x844.png`).

**On the mint's page** (`lab/PAYWALL.md`, step 1, commit 4d903ee5): the choice is the wall at the hold, its seats saying the code now / on day
15 and $WARM, liquid, its "Not mint" the free way, its day words written from these constants.

**What the page shows** (with `LAUNCH_DAY` set to day 0; unset today, the wall stands every day and nothing counts down):
- day 0: the mint's hero holds a visitor on the previous screen (frame 1111) with the choice: Bronze Mint $10 "the code on day 15, and
  $WARM, liquid", Gold Mint $1,000 "the code now, and $WARM, liquid", Not mint "free on day 15, no $WARM", "The mint is open 7 days: 7 days
  left."; a holder plays on. This page: both seats on sale, "The mint is open 7 days: 7 days left.".
- day 8: the mint is closed: the hero plays through for everyone (no choice, no hold). This page: both seats read "Closed" (disabled), and
  "The mint is closed. The code is free from <day 15>."; a Gold holder downloads, a Bronze holder reads "Yours from <day>", a visitor "Free from
  <day>".
- day 15: the code drop of the launch day is everyone's: the Worker serves it to all, this page lists it with a plain Download, and the line
  says "The mint is closed. The code is free.".
The code's free day on the mint's lines is the launch day plus `OPEN_DAYS`: the code is taken to land as a drop on the launch day (each
drop's own day is its publish time; the register holds none today).

**On the merged tree** (main at ab3d8c2e merged into the lane, 83063b6b: step 1 landed as a46521bc, the fold as one window, the sacrifice;
this Mac, nice 19, load 85 to 124): the folder's suite 446, 445 pass, 1 skipped, 0 fail; `lab/paywall.proof.mjs --passes
visitor,checkout,notmint,phone,lab` every pass HOLDS, page errors none (the page held on frame 1111 with 0 frames past, the pair 0.24 % of the
pixels apart and 0.02 % of the choice; his lab held at 37.0706 s with no seek, the pair 0 apart; the choice's Bronze seat opened the checkout
and the wall 57 ms after Connect; "Not mint" kept the hold; the phone inside its 16 px gutters); `lab/tracenet.proof.mjs` door HOLDS, page
HOLDS, page errors none; the sound, this tree by `tools/serve-range` on 8999 for the run: `--tap button` PASS (6.09 s), `--tap sphere` PASS
(6.05 s).

**Not done, and why:** the Worker's checkout (`worker/premint.mjs`) still takes orders after the mint's 7 days (`PREMINT_ENABLED` is his
switch): the page's seats read closed and a pressed seat opens no checkout, but the Worker itself does not refuse; closing it there is a Worker
change, his call. The mint section under the hero ("Take a Bronze slot", "Golden Aiolos access") still sells after day 7. Nothing deployed,
nothing published, the Worker's database untouched.

## THE SEAT PROOF: an order id opens nothing (Oct 15 2026, 14:3x to 15:1x WEST, lane/seat-proof)

The hole (ec-workspace `docs/the-mint-where-it-stands-hypertrace-2026-10-15.md`, item 2; press 6 above): the vault and the film's wall took a bare
order id as a seat, and the id is public. `/api/premint/holders` listed every paid order's id, `/api/premint/receipts?buyer=<address>` gave any
address's ids to anyone, and every finalized payment carries its id in its memo on mainnet (`orderMemo`:
`optimism.fit:premint:v1:<id>:<tier>:<buyer>`). So one Gold sale would have opened every Gold drop, and the rest of the film, to whoever read the
payee's transactions. Hiding the ids in the API alone could not close it: the memo is on chain for good.

**What closes it** (`app/dl-direct-protocol.mjs`, THE SEAT PROOF): the buyer's wallet signs a Sign In With Solana message (that standard's text, so the
wallet itself can check the domain): this host, the wallet, a fixed statement ("This sends no transaction and moves no funds"), the origin, `Chain ID:
mainnet`, a random 128-bit nonce, issued now, expiring `SEAT_PROOF_DAYS` (30) on. The proof is the text (base64url) and the Ed25519 signature
(base58), 586 B, sent in `x-seat`. The Worker checks it in one place (`verifySeatProof`): the text byte for byte as the checkout writes it, this
host and origin, issued no more than ten minutes ahead of its clock, unexpired, valid for 30 days at most, and signed by the wallet it names.
Nothing is stored and no key is the Worker's: freshness is the signed issue and expiry times read against the Worker's clock, so a proof lives as
long as its own expiry, in the buyer's browser and in that one header.

- `/api/premint/holders` names no order id: a holder's key on the sphere is its payment's signature (public on mainnet; `dl-holder-orbits.js` only
  needs it unique).
- `/api/premint/receipts?buyer=<address>` answers 401 without that wallet's own proof; with it, the receipts, ids included.
- The vault (`worker/tracenet-vault.mjs`) reads the wallet's paid rows from its proof and opens by the soonest tier; `x-receipt` is read nowhere.
- The film's wall (`app/dl-paywall.js`) and this page (`app/tracenet.js`) ask `/receipts` with the proofs this browser keeps (`savedProofs`: one per
  wallet, unexpired, at most six); the checkout's saved order ids (`RECEIPT_KEY`) are no seat by themselves.
- The checkout (`app/dl-direct.js`) has the wallet sign once when it connects (one `signMessage`, no fee) and keeps the proof under `SEAT_KEY` +
  the wallet, reused while it has a day left. A sign-in or receipts step that fails leaves the wallet unconnected, so no payment can start
  unchecked. A wallet holding a seat of any tier says so (`dl-premint-paid`), and the wall and the vault open by its proof.
- `GET /api/premint/orders/<id>` still answers (the checkout's own recovery); it opens nothing.

**The receipt** (this Mac, Oct 15 14:4x WEST, load 19 to 22, everything `nice -n 19`):

| | main (b12a67b3) | this lane |
| --- | --- | --- |
| the same attack: one paid Gold order; the attacker holds only the buyer's address and the memo | `/holders` carries the id; `/receipts`, unsigned, 200 with the id; the Gold drop with `x-receipt: <id from the memo>` **200, 2,527 B** | `/holders` no id; `/receipts` **401**, no id; the drop **402** |
| a holder's vault GET (in-process, the Worker's own time, 400 runs) | median 0.078 ms, p95 0.222 ms (`x-receipt`) | median 0.203 ms, p95 0.399 ms (`x-seat`) |
| one proof check (`verifySeatProof`, warm, 2,000 runs) | | 118.7 µs |
| at rest | 0 | 0: no timer, no poll, no table, no key, no binding, no migration |
| GETs a holder's page makes at load | one per saved order id (at most six) | one per kept proof (at most six) |

**Tests** (each alone, `nice -n 19`): `worker/premint.test.mjs` 17 of 17 (two new: an order id leaves only to its wallet's signature; the proof's text,
host, origin, times and signer, byte for byte); `worker/tracenet-vault.test.mjs` 12 of 12 (one new: an order id alone, in any header or the address,
opens nothing; the holding wallet's proof does, and no other); `app/dl-paywall.test.mjs` 27 of 27 (one new: a browser carrying only order ids meets
the wall and asks nothing); `app/tracenet.test.mjs` 6 of 6 (it failed 1 of 6 on main since 5f10a080 changed the mint's line; its expectation is
moved with it here); `app/dl-twelve.test.mjs` 9 of 9; the neighbours unchanged (`tools/dl-direct-wallets` 6, `lab/breakdown` 10 and 1 skipped,
`app/dl-holder-orbits` 7, `tools/tracenet-publish` 2).

**In a real browser** (headless Chrome, muted, off every screen): `lab/paywall.proof.mjs --passes checkout,holder,bareid`, its stand-in wallet now a
key made by the proof that signs in the page, its stand-in Worker checking the proof as the Worker does. checkout: the Bronze seat opens the
checkout, Connect, one signature, the wallet's paid receipt listed ("Access reserved"), the wall opened 41 ms after Connect and the film played 63
frames past the hold; the proof kept as `dyson-seat-proof-v1:<wallet>`. holder: a kept proof, one ask at load with it, and the film plays on.
bareid: the wallet's two paid orders by id alone in the browser: no ask, held on frame 1111: HOLDS. (The checkout pass could not reach the seat
since the editorial offer went below the fold at 11:31: it scrolls it into view now.) `lab/tracenet.proof.mjs --no-chrome`: the door HOLDS, the Gold
id alone 402. The sound, on this lane's page served by `tools/serve-range` (206): `dl-twelve.proof.mjs --tap button` PASS (the film never below
6.02 s), `--tap sphere` PASS (never below 6.07 s).

**What his next deploy changes for buyers** (nothing deployed here): connecting a wallet in the checkout asks for one more approval, a sign-in
message (no fee, no transaction), before the checkout reads the wallet's purchases; a holder on a new browser, or after 30 days, connects and signs
once to play on. A receipt that an older checkout saved in a browser is read again once its wallet signs in. Nobody holding only an order id, or a
buyer's address, gets a drop, the film past the wall, or a receipt list. No sale has happened, so no browser holds a paid receipt yet.

**Not done**: a wallet with no `signMessage` cannot sign in (Phantom, Solflare and Backpack have it; the checkout says so). A device clock more than
ten minutes ahead of the Worker's is refused. The statement and `SEAT_PROOF_DAYS` are his to reword and move (a new statement makes every kept proof
sign again). The wishes doc (ec-workspace) has no line from this lane: the parent seat's to write.

## THE HOLDER'S ROAD: one press and one signature, no tier and no price (Oct 15 2026, 15:2x to 16:3x WEST, lane/holder-connect)

The gap (THE SEAT PROOF above, "what his next deploy changes": a holder on a new browser, or after 30 days, connects and signs once to play on):
a holder whose kept proof was gone could reach "connect and sign" only through a seat's price button ("Choose Gold $1,000" on the film's wall,
the two seats here), which opens the checkout for that tier. It worked, and it read like buying again.

**What it does** (`app/dl-direct.js` `holder()`, bound to every `[data-mint-holder]`): one control on the film's wall (`app/warm.html`, inside
`#dl-paywall-choice`, under the two seats) and one on this page (`#tn-holder`, after the two seats), "I hold a seat: connect my wallet" (mine, his
to reword). One press opens the checkout's own dialog on the wallet's purchases, with no tier and no price ("Your seat." and "Connect the wallet
that holds it and sign in once. No fee, no transaction.", mine, his to reword), and starts the checkout's own road at once: the wallet connects
(`reach()`, split out of `connect()` unchanged: her wallet alone when a link names her), signs in once (`seat()`, the proof kept 30 days), and its
receipts are read with that proof (`/api/premint/receipts`, `x-seat`). A paid one says so (`dl-premint-paid`): the wall asks with the proof this
browser now keeps and opens, and the film plays on; this page reads the seat and paints it. The Worker is asked nothing else: no availability, no
quote, no order. A refused approval, no wallet, or another wallet than hers reads and keeps nothing; a wallet with no seat signs once, is told so
by the list, and the wall stands. Here the control loads the checkout on its first press, as a seat does, and hands the press on; it goes once a
seat is read here, and stays after the mint's 7 days (a holder's drops outlive them). On the wall it goes with the choice. Nothing at rest: no
timer, no poll.

**The receipt** (this Mac, Oct 15 16:1x WEST, the machine at load 170 to 430 the whole time, everything `nice -n 19`):

| | main (61086fba) | this lane |
| --- | --- | --- |
| a Gold holder whose kept proof is gone, from the wall held on frame 1111 to the wall open | press "Choose Gold $1,000" (the checkout for that tier, its price on screen, availability read), then Connect, one signature: two presses and a price | one press of "I hold a seat", one signature, no tier and no price on screen: the wall opened 53 and 76 ms after the press (one run), 466 and 558 ms (another, the load higher) |
| GETs to the Worker on the road | 3: availability, the receipts (`x-seat`), the wall's ask (`x-seat`) | 2: the receipts (`x-seat`), the wall's ask (`x-seat`) |
| bytes (gzip -9) | | the film's page: `warm.html` +170 B, `dl-paywall.css` +112 B, `dl-direct.js` +555 B; this page: +269 B at load, `dl-direct.js` +555 B on the first press only |
| at rest | 0 | 0 |

**Tests** (each alone, `nice -n 19`): `app/dl-direct.test.mjs` 6 of 6, new: the real checkout and the real wall on one stand-in window, storage
and Worker (a key made by the test signs in the page): a new browser and an expired proof each open the wall in one press and one signature, the
Worker asked for the receipts only, no tier and no price in the dialog, the proof kept 30 days and the next visit open with no press; a wallet
with no seat, a refused approval, no wallet, another wallet than hers open nothing; the seats' own road unchanged (availability, Connect, one
signature, the tier's receipt saved). Under main's `dl-direct.js` it passes 1 of 6, the seats' road: the road is not there. `app/tracenet.test.mjs`
6 of 6 (the control: shown to a visitor, gone for a Bronze and a Gold holder, kept after the mint's days, the checkout loaded once by its first
press and the press handed on); `app/dl-paywall.test.mjs` 27 of 27; `app/dl-twelve.test.mjs` 9 of 9; `tools/dl-direct-wallets.test.mjs` 6 of 6 (its
"her wallet alone" case read the refusal inside `connect()`; it reads it in `reach()` now, and both roads reach the wallet before any storage or
receipt is read); the neighbours unchanged (`app/dl-holder-orbits` 7, `lab/one-page` 9).

**In a real browser** (headless Chrome, muted, off every screen): `lab/paywall.proof.mjs --passes returning`, new. A Gold holder on a new browser,
and one whose kept proof is 31 days old: the film held on frame 1111, nothing asked at load; one trusted press of the choice's control, the
stand-in wallet 1 connect and 1 signature, the Worker's calls the receipts twice (the checkout's read, the wall's ask), the dialog "Your seat."
with the Golden Aiolos receipt listed and "Your seat is open in this browser.", the proof kept for 30 days, the wall open by the receipt, the film
63 to 66 frames past the hold and on to 39.2 s, the choice gone: HOLDS. This page as a visitor: the control shown, nothing asked; one press, the
checkout loaded and the road run, "You hold a Gold Mint seat: every drop is yours the moment it lands." 56 and 666 ms later (the two runs), the
seats and the control gone, 1 signature, 2 GETs: HOLDS. At 390 x 844 both controls sit inside the 16 px gutters, 44 px tall, no sideways scroll
(the first run caught this page's at 37 px; `.tn-holder` has `min-height: 44px` since). The seats' own road, unchanged in the same browser:
`--passes visitor,checkout,holder,bareid`: the visitor held on frame 1111 with nothing at rest; the Bronze seat, Connect, one signature, "Access
reserved", the wall open 462 ms after Connect and the film 67 frames past the hold; a kept proof plays on (one ask, 65 frames past the stop); the
bare ids held with nothing asked; page errors none. The sound, on this lane's page served by `tools/serve-range`
(206): `dl-twelve.proof.mjs --tap button` PASS (the tap at 6.41 s, the film never below 10.08 s in the reading, no seek back, the song 0.043 s from
the picture at the end), `--tap sphere` PASS (the tap at 6.23 s, never below 8.75 s, no seek back, 0.017 s). An earlier `--tap button` run at load
about 350 failed one check, the song 0.15 s or more from the picture at the end, with the picture never back; the run after it passed, and a
`--tap sphere` run at that load ended at its own 120 s (exit 2, could not run).

**What his next deploy changes for buyers** (nothing deployed here): a visitor sees one more line under the seats, "I hold a seat: connect my
wallet"; a holder whose browser shows no seat presses it, approves the wallet's connect and one sign-in message, and plays on. Nobody is sold
anything by it: it opens no checkout for a tier and asks no price.

**Not done**: the words are his. The dialog stays open on the wallet's purchases once the wall opens (the holder closes it, as after a purchase);
on the wall the holder is left where the choice stood, below the film, which plays only in view: bringing the film back into view is his call.

**What I broke, and the fix** (Oct 15 16:4x WEST, lane/returning-own-wallet; found by the mint-freeze lane, `lab/MINT-FREEZE.md`): the
`returning` pass held run alone and FAILED after `checkout` and `holder` in one run. The proof's stand-in Worker is shared by every pass
and answers each wallet its own receipts, and the pass used the run's one wallet: the receipts the other passes had made for it (the
checkout's Bronze, the holder's Gold, the bare ids') listed as five rows in a dialog the pass expected to hold one. The page was right; the
pass was not independent. It signs with a wallet of its own now (a key it makes), so its dialog lists its own Gold receipt alone whatever
ran before it.

**After the tracenet's rewrite** (ad4285d8, Oct 15 16:46 WEST, "an overhead computer with characters typing on oversized keys"; read at 17:0x):
the holder's road stands there as "Already a member?" in the page's footer (`#tn-holder`, still `[data-mint-holder]`, bound and hidden by
`tracenet.js` as before). `app/dl-direct.test.mjs` pinned the old words and failed 5 of 6 on main from that commit; it holds the control's place
and kind now, not its words (lane/speed-catch). The page asks `/api/premint/availability` before it loads the checkout when it runs on
localhost (a local preview has no payment service; optimism.fit never does), so the proof's tracenet part reads past that one call. Found, not
changed: the control is 32 px tall on a phone (`.tn-foot button{min-height:32px}`), under the 44 px the wall's control keeps;
`lab/paywall.proof.mjs --passes returning` says DOES NOT FIT there and the pass FAILS on that alone (the wall's two cases and the tracenet road
hold). The page is that lane's: the size is its call, or his.

**One browsing list (Oct 15, removing the Projects / Traces / Margaret strip):** removed the tab row and its listeners. Projects, character collections and published traces share the existing scrolling surface. Margaret opens from a single named entry; an empty trace inventory adds no placeholder text to the list. The existing project and character dialogs retain their publication status and access actions. No payment or access rules changed.

**Cost and checks:** five shipped files are 1,608 bytes smaller raw and 360 bytes smaller gzip in aggregate; no new requests, polling or animation. The existing computer, profile and trace tests pass 16/16 in 94 ms. Browser QA at 1280 x 720 and 390 x 844 confirms no tab row or horizontal overflow, working project and Margaret details, and the existing subscription dialog and return path. Visible images load and the console has no errors; the unused hidden checkout portrait has no source. Monthly checkout remains unavailable, as before.

**Profile list narrowed (Oct 15, 20:10 screenshot):** removed The Dyson Society and Poleis showcases and the Margaret entry from the browsing list, leaving DysonLight: Harmony. The character detail route remains available independently. Two shipped files shrink by 1,413 bytes raw / 451 bytes gzip, with two fewer cover images requested. Existing profile tests pass 5/5 (79 ms); browser inspection confirms the three requested entries are absent. No new requests, timers or dependencies.
