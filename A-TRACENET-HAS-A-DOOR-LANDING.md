# A TRACENET HAS A DOOR (Nov 23 2026, seat claude-41008c71)

His words, UTC, 21:09:32: "ofc people land on the mint... that's for when the mint period is open... so the rest is people cant open a tracenet
atm. fix all dude come on". He said it over the walk of every Swarmbook screen:
- ec-workspace `docs/swarmbook-every-screen-walked-the-tree-of-screens-2026-11-23.md`;
- the Canvas, the Claude page, "Swarmbook, every screen" and "What the walk found".

The mint as the front door is his rule while the mint is open, and stays.

## What changed

**The door.** The first tracenet's page (`app/tracenet.html`, "Your tracenet.") carries "Open your own tracenet →" to `app/creator.html`.
- No page had linked creator.html since Nov 19. That day 1ed6ae85d5 (THE END OF THE INTRO IS ONE SCREEN, "no panel, no box, no card") took the
  "Start a tracenet" card out with the page's other cards.
- creator.html had no way out. It now has one: "← Swarmbook", to the red side (`after-the-mint.html?side=flask`). It is fixed at the top left, outside
  the hexagon's composition.

**The society page is checked.** `polis.html?civ=0` (The Root, Tipped: the meta swarm's page, with the Pantheon) joins
`embertide-screens/screens.json`, and its 32 files join `loads.json`.
- It failed 12 of 12 cells. `app/polis.css` mends it:
  - the Decisions count at 13 px (it was 11);
  - the status (`#activity-label`) in the page's ink;
  - the folds' + drawn by CSS. It was aria-hidden already; the checker read the thin glyph against its own anti-aliased edge;
  - on a phone, every button and fold is 44 px: Enter as a member, the motion toggle, Enter, and the three folds.
- Checked twice on this lane's build: 12 cells, 0 red.
- What the gate sees is the page as a visitor whose chain reads fail sees it. The checker sends no POST, and a Solana read is a POST. So it judges the
  page's frame, never the hall.

**GitHub at every visit.**
- `app/stars.js` asked `api.github.com/repos/chat-grp/poleis-protocol` on seven pages: index, ecology, rules, found, fees, terms, privacy.
- At every visit it got 404 (a private repository), and it painted nothing: none of the seven holds a `[data-stars]` or an `a[data-repo]`.
- The module and its seven script tags are out.

**The Nov 13 page is retired.** `app/swarmbook.html` goes, with `swarmbook.mjs`, `swarmbook.css` and `swarmbook.test.mjs`.
- Why: Swarmbook's page (after-the-mint) has superseded it since SWARMBOOK AND OPTIMISM.FIT ARE ONE PAGE (Nov 18). No page linked it, and its
  `assembly-geometry.js` answered 404.
- It is out of the build's page list, the manifest, the baseline (12 lines) and the loads. `assembly-dive.test.mjs` no longer reads it.
- The wall's ball (`room/assembly-gpu.mjs`, `room/assembly-floor.mjs`) shipped only through that page's graph. The screens gate found both 404 on the
  wall at every size (and the gold ">>" on the beige, where the ball did not draw). The build now ships them by `app/index.html`'s own graph.
- The welcome's `assembly-home.mjs`, asked by that page alone, no longer ships.

**The wells race only the Fund's program.** In `app/after-the-mint-book.mjs` read(), the older program's Root no longer stands as a second Root with "No
fees yet".

**The tab icon.** The phone's icon (`../phone/icons/icon-192.png`, her ball) ships as `/favicon.png`, and `/favicon.ico` answers 302 to it (the build's
`_redirects`). Every page had asked for `/favicon.ico` and found nothing.

## Not changed

- **The test reservations** (`legacy-reservations.html`) stay unlinked. `dl-direct.test.mjs` holds the mint off them: they are the earlier testers'
  recovery.
- **The tracenet page's ask of `/nest/ref/scene/module`** still answers 404 on the public site.
  - The room's shared loader asks it, because `room/house-door.mjs` onFront takes every https page for the house's front.
  - The loader treats the 404 as "unchecked" and goes on.
  - It is the room's own lane, beside every glass that uses it.

## Numbers

| | |
|---|---|
| JavaScript and HTML (the gate's count) | +9 -200, net -191 |
| the site | 16 pages to 15; the wall's two room modules by its own graph; assembly-home.mjs no longer shipped |
| per visit | no GitHub request on seven pages; no favicon 404 on any |
| the screens gate's manifest | 17 screens: swarmbook out, polis-root in |

Seen on this lane's build, behind the Worker's own handler (`worker/premint.mjs`) on an empty D1, headless and off every screen:
- `/favicon.ico` answers 302 to `/favicon.png`, which answers 200 image/png.
- The tracenet page at 1440 and at 390: "Open your own tracenet →", 197 by 46, to `./creator.html`.
- The creator page: "← Swarmbook", 119 by 44, to `./after-the-mint.html?side=flask`.

## Tests and gates

- The touched tests (after-the-mint, assembly-dive, tracenet-trail, tracenet): 33 of 33.
- The site's suite: 568 of 572. The 4 red are main's own: dl-athena, dl-handoff, dl-paywall, warm-sphere-moment. dl-paywall's and dl-athena's are red on
  main's own copy too.
- `the-javascript-only-shrinks` 31/31, `the-look-is-a-law` 2/2, `no-page-of-its-own` 3/3, `the-pixel-is-a-lookup` 3/3, `any-room` 12/12.
- `no-landing-adds-a-failing-screen`, both shards, on this Mac while other seats loaded it:
  - In its 270 s it judged 114 of its cells and named 1 new failing cell: the blue side's title at 390 px, gold on cream.
  - That was a moment of the film: the same cell passed three times alone on this build.
  - The first run on 96b560fb1d had named the wall's two 404s; 56b582e055 mends them.
- The checker over every screen of this build against the baseline, with no time limit: 204 cells judged, 0 new failing, 0 to take out. polis-root
  has 0 red cells.
- Rule 8 on this tip (no film, no sound touched; the mint page's files byte-equal):
  - `node --test app/dl-twelve.test.mjs` 21 of 21;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <this lane's built warm.html, served by tools/serve-range> --tap button` PASS;
  - the same with `--tap sphere` PASS.

## His

- swarmbook.com changes at his deploy press.
- The test reservations: keep them unlinked, link them, or retire them.
