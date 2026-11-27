# AFTER THE MINT: the page optimism.fit opens on once the $WARM window has closed (Nov 2 2026, lane/after-the-mint)

**His words (UTC).**
- Nov 2 ~01:3x: "ok, can we work on a optimism.fit landing page for after the mint? let's look into it?" A mock was drawn back: the diving Lyssajudron
  with an arrow let go, SPACE ROUTER OPEN and THE CODE IS FREE on the freeze's plates, Fill your tank and Download DysonLight, three cards in the
  page's own words.
- Then, over that mock: "can you please for now show me optimism.fit after the mint phase? like, this: it is supposed to be implemented there no?"
- ~02:2x, over the first build in the preview, whose hero was a flat SVG sphere of hexagons: "bro, wtf? put the diving lyssajudron there wtf is that shit?
  the same one from the welcome pages".
- ~02:3x, over the arrow drawn on top of her: "why the arrow?" The arrow was the seat's own, not the welcome's, and it came off.

## What stood (read on the live site, Nov 2 2026 ~02:0x UTC)

Headless Chrome, off every screen, opened https://optimism.fit/ with its clock moved before any script ran. Only GETs left the browser.

| Page clock (UTC) | What the visitor sees |
| --- | --- |
| Nov 2 (today) | the film page (`/` → `app/warm.html`); at 120.67 s the film stops on the drawn arrow and "Give me my colours." stands |
| Nov 16 (after MINT_CLOSES) | the same film page; the film runs on past the arrow (136.5 s, then 145.1 s, read 3.5 s apart), the sphere opens, the seats read Closed |

There was no page after the mint. From MINT_CLOSES (`app/dl-paywall.js`, Nov 15 00:00 UTC, as Breakpoint opens), the code only let the film run past the
arrow and closed the seats. The mock was a picture.

## What changes

- **`app/after-the-mint.html`, `.css`, `.mjs`** (new): the mock built as a page of the site.
  - Look: Harmony's night from `../../harmony-accent.css`, the mint's type from `../../fonts/fonts.css`, the one wordmark from `../../brand/dl-wordmark.css`.
  - The plates: the freeze's two plates (`dl-space-router.js` `.dl-router-plate`), settled, with no motion.
  - The doors are the mint page's own: `warm.html#refuel`, `warm.html#her-door` (the stake), the trail (`dl-space-router.js` TRACENET), and the download
    (`dl-harmony-doors.mjs`). Each door keeps the visit's query, so a friend's `?ref=` survives.
  - **The hero is the welcome's diving Lyssajudron, the same module, nothing copied.**
    - The module: `../../assembly-home.mjs` on `room/assembly-gpu.mjs`, as `embertide-app/ui/intro/index.html` mounts it. The Lyssajudron, the twelve
      diving through her like fishing birds, a ring where each passes her skin, and a click on her is a dive.
    - The stage is the one the welcome gives it: `#assembly` with `data-renderer="gpu"` and the canvas `#assembly-gpu`.
    - Its colours pass through the same ice law (`../../harmony-ice.js`, brought in before the module).
    - The page's own sheets keep Harmony's night: `html[data-own-colours]` keeps the law off them, so the gold stays gold.
    - It runs as on the welcome: while in view and the window is shown; it stands still under reduced motion.
    - Without WebGL2 the welcome's module drops its canvas, and the words take the row.
  - **The words:** "The arrow is let go." stays: the mint film's drawn arrow, the one the window held. The line under it is "The pre-deposits closed at
    Solana Breakpoint." The mock's "Every tank filled is a hexagon of the sphere" is gone: the welcome's panels are the home's 680 seats, not tanks.
  - **Before the close** the page is not yet: a visit goes on to `warm.html`, query kept, and the hero is never loaded. A `#preview` address stays, for
    looks before Nov 15.
- **`worker/premint.mjs` THE FRONT DOORS:** from MINT_CLOSES, `/` and `/referral` open on `/app/after-the-mint.html` with the friend's code carried. Until
  then they open on `/app/warm.html`; `/claim` is unchanged. One clock read (the handler's `clockMs`), using the mint's own `mintState`.
- **`tools/build-optimism-fit.mjs`:** the page's graph is walked like the mint's and the tracenet's. What it asks for outside `app/` ships by its own
  imports, at the site's root: `assembly-home.mjs`, `room/assembly-gpu.mjs`, `harmony-ice.js`. Its files ship by the site's rule (`site-files.mjs`
  shipsAs); its test stays home.

## The cost

| Piece | Cost |
| --- | --- |
| the page's own files | 13.7 KB (html 4.6, css 5.5, module 3.6) |
| the welcome's hero | 79.7 KB of modules (`assembly-gpu.mjs` 55.5, `harmony-ice.js` 18.0, `assembly-home.mjs` 6.2), one WebGL2 canvas, a frame while it is seen: the welcome's own cost, unchanged |
| the chain | none: the page reads nothing off Solana |
| at rest | the hero stops when out of view or hidden; the page itself keeps no clock, animation or storage |

## Proofs (the new Mac, nice 10)

- **75 of 75** in one run:
  - `app/after-the-mint.test.mjs`;
  - `worker/premint.test.mjs`;
  - `embertide-app/ui/intro/harmony-ice.test.mjs`;
  - the gates: `tools/any-room/any-room.test.mjs`, `the-law-is-the-gate`, `no-page-of-its-own`, `the-pixel-is-a-lookup`, `tools/site-files.test.mjs`.
- **What the page's own test holds:**
  - The window is over from MINT_CLOSES, and not a millisecond before.
  - The hero is the welcome's module on the welcome's stage, with the law before it and no picture of the page's own, the arrow included.
  - A door keeps the query.
  - Every door goes to a page the site has, and to an anchor that page holds.
  - Every literal colour in the sheet is the freeze plate's.
  - The module has no clock, no chance and no storage.
  - Before the close a visit goes on with no hero loaded; with `#preview`, or after the close, the doors are carried and the hero comes in.
- **The Worker's test** holds the front doors either side of the close, and every day after.
- **The site's neighbours, first build: 171 of 172.** `worker/*.test.mjs`, `dl-paywall`, `dl-mint-ledger`, `page-files`, `site-files`. The one red is main's
  own and reads none of this lane's files: dl-paywall's "the public mint keeps DysonLight Harmony ice and accent tokens" (`harmony-orange` is
  `#37b6d8`, the test expects `#0d4769`).
- **Rule 8 (the sound never restarts the picture),** because the lane changes files under the mint's folder. The lander refused the first hand at 02:52 UTC
  for not naming them, and they ran on Nov 2 ~10:5x UTC on this lane's tree, served by `tools/serve-range` (206):
  - `node --test app/dl-twelve.test.mjs`: 21 of 21;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <warm.html served> --tap button`: PASS;
  - the same with `--tap sphere`: PASS.
- **The served page in headless Chrome, off every screen,** on this lane's tree served by `tools/serve-range`:
  - `#preview` at 1440 px: the hero running on a 1180 × 594 canvas, no sideways scroll.
  - `#preview` at 390 px: the hero running, no sideways scroll, and Fill your tank carries `?ref=` to `warm.html?ref=…#refuel`.
  - Clock at Nov 16, no `#preview`: the page stays, and its hero runs.
  - Today's clock, no `#preview`: the page goes on to `warm.html`.
- **The built-in browser pane** also showed it at 1024 px and at the phone size. A pane hidden behind another panel does not repaint the WebGL canvas,
  so the phone pictures above are the headless ones.

## Not done

- **The deploy is his.** Nothing reached optimism.fit.
- **The full build** (`tools/build-optimism-fit.mjs`) cannot run in a fresh worktree: it stops on `submission/demo.mp4`, which git does not carry. It
  builds where the films are.
- Night only, as the mock. The page's tokens flip under `html[data-theme="light"]`, but there is no switch on it yet.
