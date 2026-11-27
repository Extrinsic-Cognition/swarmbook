# TRACENET-GLOBAL-FEED-LANDING.md

## His words
- 2026-11-27 UTC (on live `tracenet.html`): *"tarcenet is fucking vomit tbh... it is all to be redone, entirely re-architected from scratch... why the fuck is the box there?... this is supposed to be the fucking feed of all claw riders and snowtracers dude"*
- 2026-11-27 UTC (with 4 reference crops): *"this one went hard as fuck tho... imagine if you have the flask on left and the crystal with that figure on the rgith and instead of cringe fucking uselss text you keep impactufl shit"*
- 2026-11-27 UTC (on Draft E): *"fuck yeah lets' go"*
- 2026-11-27 UTC (design alignment): *"you think you dont need to use the style and design.md we got in the other places?"* → realigned to `harmony-appearance.json`, unmodified `site-bar.css`, `front.css`, and `holy.css`.
- 2026-11-27 UTC (on real Chrome build screenshot): *"y"*

## What changed
- Re-architected `app/tracenet.html`, `app/tracenet-trail.css`, `app/tracenet-trail.mjs`, and `app/tracenet-trail.test.mjs`:
  - Removed the Pandora's Box keyboard (`room/laptop-glass.mjs`) and single-user `firstTrace()` restriction.
  - Added hero assets `app/assets/tracenet-flask.webp` (21 KB), `app/assets/tracenet-crystal.webp` (25 KB), and `app/assets/tracenet-flask-mini.webp` (2.4 KB).
  - Global multi-rider feed pulling live riders from `/space-router/v1/portrait?board` and published registers from `/api/premint/creators/<handle>` (fallback `./tracenet/<handle>.json`), validated via `readManifest` + `proveItems`.
  - Unmodified `.site-bar` (Societies · blue Stake · red Ride · gold-lit Tracenet), `#0e1c2d` Harmony Sky → `#07060b` Holy Ground, Swarmbook Gelasio `TRACENET` slash plate, Bodoni 72 titles, DM Sans words & tabular-nums hashes, inline verified markdown `Read Trace` dialog, `Browse Riders` roster, category tabs, search, `$ swarmbook pull`, and `Fuel $WARM`.
  - Updated all 12 top `.site-bar` `Tracenet` links from `./tracenet.html?of=photons_enjoyor` to `./tracenet.html` (preserving `?of=<handle>` filtering and `after-the-mint.html` footer's `"The first trail"` link).

## Verification
- `node --test` (69/69 pass): `tracenet.test.mjs`, `tracenet-trail.test.mjs`, `after-the-mint.test.mjs`, `swarmbook-floor.test.mjs`, `dl-direct.test.mjs`, `dl-twelve.test.mjs`, `site-files.test.mjs`.
- `the-javascript-only-shrinks.test.mjs`: net `-30` JS/HTML lines.
- Real Chrome (`1440×900` + `390×844`): 0 JS/console errors, 0 horizontal overflow, all 19 traces rendered, `Browse Riders`, category tabs, and inline markdown reader verified end-to-end.
