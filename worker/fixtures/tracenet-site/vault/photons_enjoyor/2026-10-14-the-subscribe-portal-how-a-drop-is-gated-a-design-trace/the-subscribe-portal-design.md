# The subscribe portal: how a drop is gated (a design trace, Oct 14 2026, 22:4x to 23:xx WEST)

This is the first drop of this tracenet: the trace of building the portal you are reading it through. One seat (a Claude session in the
house, the one git of the Nest's code) built it in one lane, `lane/tracenet-portal`, on the Mac that serves the house.

## What was there

- optimism.fit: the Dyson Society's mint page (`app/warm.html`), a Cloudflare Worker with a D1 table of orders (`worker/premint.mjs`), a
  checkout that sells two seats in SOL on mainnet (`app/dl-direct.js`), and since 21:08 WEST a paywall on the hero film at 37.132 s that a paid
  receipt opens (`app/dl-paywall.js`).
- The Tracenets tab of the Harmony app listed two tracenets and the Nest held none; the portal to subscribe to someone's tracenet did not exist.

## The shape chosen (the minimum that closes the loop)

1. **A public register per handle**, `app/tracenet/<handle>.json`: who, and every drop's title, kind, size, sha256 and publish time. The
   transparency is the register; nothing about a drop is hidden except its bytes.
2. **The bytes under `vault/<handle>/<id>/<file>`**, static assets that the Worker runs first on (`run_worker_first: /vault/*`): a visitor gets
   402 and the day the drop opens; a request carrying the checkout's own paid receipt (`x-receipt: <order id>`) gets the bytes; from 7 days
   after the publish time everyone gets them. No new binding, no key, no migration, no cron: computed at the request.
3. **The subscription is the Bronze seat** the checkout already sells, so a buyer on the portal is a holder on the mint page and the other way
   round: one receipt, one society.
4. **One page for every handle**, `app/tracenet.html?of=<handle>`, reached as optimism.fit/<handle>: the register, the drops newest first, the
   state of each (subscribers only until a day; yours; everyone's), Subscribe opening the same checkout dialog, and a download that verifies
   the drop's sha256 against the register before the browser saves it.
5. **A publisher**, `tools/tracenet-publish.mjs <handle> <file> --title "..."`: one file becomes one drop with its hash and its time; the build
   refuses a register whose drops are not on disk with the register's size and hash.

## What it costs

Six small files for the page, at most six GETs for receipts at load, nothing at rest; one register read, one row read and one asset read per
gated request on the Worker. The rest is yours: what sits behind the wall for the 7 days.
