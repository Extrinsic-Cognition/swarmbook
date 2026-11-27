# THE STOP HOLDS UNTIL BREAKPOINT: the film's stop on the drawn arrow holds through Breakpoint's last day, Nov 17 (Oct 29 2026, lane/the-stop-holds-until-breakpoint, claude-1a67b2d3)

## His words, Oct 29 2026, UTC

- 19:00:45, to this seat: "we gotta think strategically about the timing... because i need liquidity and solana breakpoint is in 14 days... so i
  thought we could have a liquidity pool initiation u get me? let the price stabilize on its own over 14 days until solana breakpoint and just balance
  the liquidity pool by dripping tokens into the pool u get what i mean?"
- 19:10:59, to claude-ff987105: "yeah dude i know liquitiy, which is why we are going to have 10% sale over 14 days... that is going to seed the
  liquidity needed".
- 19:39:28, his click "Yes, until Breakpoint". The seat had asked: "Hold the film's stop until Breakpoint instead of Oct 30 23:59 UTC?".

**Breakpoint 2026** runs Nov 15 to 17 at Olympia London, its first time in the UK. Sources: Solana Compass and Cryptoast; the Foundation announced the
city on June 29, with registration on Luma. That is 17 to 19 days after his 19:00 word, not 14.

## What stood

- `MINT_CLOSES` was `'2026-10-30T23:59:00+00:00'`, from his Oct 21 "until oct 30th 11:59".
- Until then, the wall (createPaywall's `hold`) holds the film at frame 3616, the drawn arrow, for everyone without a paid seat.
- At that instant three things would have gone at once:
  - the film plays past the drawn arrow;
  - SKIP TO THE MINT is no longer offered (`dl-twelve.js`: hidden when no window is ahead);
  - her entrance at the stop never comes.
- So from Oct 31 the flow for the demo video and for Breakpoint would have been gone.

## What changes

- **`app/dl-paywall.js`:** `MINT_CLOSES = '2026-11-17T23:59:00+00:00'`. That is Breakpoint's last day, 23:59 in London (GMT, which is UTC in
  November). The comment above it carries his words.
- **`app/dl-paywall.test.mjs`:**
  - THE FREEZE's close is now Nov 17 23:59 UTC, and its line on Oct 21 now reads "28 days left".
  - A new test, THE STOP HOLDS UNTIL BREAKPOINT. The stop holds at the old close, the day after it, Breakpoint's first morning and its last minute;
    at the close it opens.
- **Her line at the stop** reads `[data-mint-line]` (dl-athena.js, topic `stop`), so it now names November 17.

**Cost:** one constant. Nothing runs that did not run before. The page's scripts are revalidated at every visit (`tools/build-optimism-fit.mjs`
caches only the films for a year), so no `?v=` moves.

## Measured

- **The suites.** `node --test` over dl-paywall, dl-twelve, dl-athena, tracenet and dl-space-router.scene: 79 of 81. The two reds are main's own, the
  same as in this seat's earlier receipts: dl-athena's THE DEPTH and dl-paywall's Harmony ice and accent tokens.
- **Headless Chrome, off every screen.** How it ran:
  - the page's clock was moved by shifting `Date.now` before any script ran;
  - every request to another host was refused;
  - the lane's tree was served with byte ranges (`tools/serve-range`);
  - for main's run, only `app/dl-paywall.js` was served from main in place of the lane's, so the A/B differs by this one change.

  | Page clock (UTC) | dl-paywall.js | Skip offered | The film, read every 2 s after the press (or after the same seek to 3 s before the stop) | Her events |
  | --- | --- | --- | --- | --- |
  | Nov 1 12:00 | main's | no | 119.52, 121.53, 123.53 ... 131.54: it plays past the arrow | none |
  | Nov 1 12:00 | this lane's | yes, pressed | 119.55, then 120.66 paused six times: held on the arrow | SKIP, coming, entered |
  | Nov 18 00:30 | this lane's | no | 119.52, 121.52 ... 131.54: it plays on | none |

  No page error in any run.
- **Rule 8,** on this lane's page served with byte ranges:
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS.
  - The same with `--tap sphere`: PASS.
  - Both said "the sound came in where the picture was, and the picture never went back".

## What does not change

- **The live site.** optimism.fit, version 298ebc53, still closes the stop at Oct 30 23:59 UTC. It takes this lane only when deployed, on his
  "we are good with it".
- **The mint's other laws:** the launch day, the 7 days and day 15's free code.
