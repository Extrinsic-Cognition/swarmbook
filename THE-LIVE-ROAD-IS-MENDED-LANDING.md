# The live road is mended (lane/the-live-road-is-mended, Nov 12 2026)

## Cost

Nothing at rest, on either page: 0 draws, 0 frames asked, 0 timeouts and no interval over 3 s at rest on the tree, at every size and deposit
count walked (as before). On every visit to optimism.fit: one request fewer (the read of `<host>:8904`, which waited 5 s for its timeout) and,
for a visit held on the stop, one refused socket fewer. On the tree with no deposit: 11 frames more before it stands at 1440x900, 12 at
390x844 (0.4 s at the sphere's 30 draws a second on the stop), in which the twelve are led 440 and 480 ms along their orbits; none with 1,
14 or 60 deposits. No new request, timer, store or listener. JavaScript +25 -25 over the lane's main (net 0, 8 files, the gate green, no
pass); the sheets: `after-the-mint.css` +1 -1, `dl-paywall.css` +6 -7.

## His word (UTC)

Nov 12 2026 ~08:44, in the app: "Yes, fix them", on "Fix the five live faults on one lane now?". The five were met by a stranger's walk of
the live https://optimism.fit at 08:37 to 08:41 (its frames and `live.json` are the seat's scratch; nothing of it is in the tree).

## The five, each at its cause

1. **The phone's door is whole** (`app/dl-paywall.css`). `warm.html?door=deposit` at 390x844 was a white glow, the stamp and an address.
   Cause: under 700 px the code was `display:none` (the Nov 11 sheet: "no code (a phone does not scan its own screen)"), and this morning's
   rule hid her corner picture there (`html:has(.snowtrace-kit-link) .dl-router-her{visibility:hidden}`) because the door, laid at
   `73vh + 12px`, lay on it. Mend: on a phone the door stands over her picture (`bottom: min(27vh,210px) + 16px`, her picture's own height),
   with its code (`min(112px,15vh)`), its stamp and its address; the address may wrap, in even lines; her picture stays. The desk's door is
   as it was.
2. **The address is whole** (`app/after-the-mint.css`). On the tree's door it ended in an ellipsis at every width. Cause:
   `max-width:min(300px,100%)` with `nowrap` and `text-overflow:ellipsis`; a 44 letter address in that type needs 311 px. Mend:
   `max-width:min(340px,100%)`, no ellipsis, `overflow-wrap:anywhere; word-break:break-all; text-wrap:balance`: one line wherever the column
   holds it, two even lines where it does not (768x1024, a 282 px column: 22 and 22).
3. **The balls stand clear** (`app/after-the-mint-tree.mjs`, `app/warm-sphere.js`). With no deposit one of the twelve stood over the
   visitor's cell, frozen. Cause: the tree holds the sphere on the arrow's frame, where the sphere's own second rests (`mintClockAt`), so
   the twelve stand where that instant leaves them on their orbits; the camera then brings the side's face to the middle, and for cell 123
   (the land law's first) a ball drawn before the cage stands 30 px from the middle. A turn does not part them: the orbits lie 1.5 to 1.7
   radii out and the cage's faces 1.36, so a turn carries both nearly alike (walked: the cell aimed 67 px off the middle, the ball 83.5 px
   with it, three turns, the ball still on the cell). Mend, by the instant: while the rim of a ball drawn over the faces (`z > 0`) is nearer
   the side's face than `AIM_PX` (6 px), the tree leads the twelve on along their own orbits, `LEAD_MS` (40 ms of the orbits' time) a frame
   the sphere draws anyway, and stands on the first instant that leaves the face clear (12 s of lead at most for one face). The sphere hands
   its overlay the twelve's bodies (`balls`: x, y, r, z) and has one new door, `setOrbit(ms)`, added to the orbits' time; it asks no frame
   and is 0 unless the tree asks (the mint page never does). Nothing is hidden, no timer is added, the face stays at the middle. The tree's
   state says `gap` (px from the face to the nearest ball drawn over the faces) and `lead` (ms).
4. **No socket that refuses a browser** (`app/dl-mint-pour.js`). Every visit held on the stop opened `wss://api.mainnet-beta.solana.com`
   first (the list's first host) and got 403. Cause: both hosts answered Node on Oct 28; a browser sends its Origin. Asked from
   `https://optimism.fit` (a GET of `/app/terms.html`, then the page's own `logsSubscribe`) in the new Mac's headless Chrome on Nov 12 at
   09:06:32, 09:06:49 and 09:06:52 UTC: `api.mainnet-beta` refused the handshake 3 of 3 (0.13 s); `solana-rpc.publicnode.com` opened 3 of 3
   (0.15 s) and answered the subscription in 0.2 s twice, once said nothing in 8 s. Mend: the refusing host is off the list (`WS` is the one
   that answers); the poll stays the floor. No host of the lane's own.
5. **The public page asks no house port** (`lab/hero-mount.js`). "hero-mount: his tags were not read from https://optimism.fit:8904
   TimeoutError" on every visit: the hero read `mint/seiya-tags` from `<the page's host>:8904` and waited 5 s. Mend: the read is made only
   on his house's hosts (`dl-twelve-clock.js asksNest`: loopback, a private LAN address, a `.local` name, as the debug start and the glass's
   look already do) or where the lab names a `?nest=`; a public host takes rev 1's words at once and asks nothing.
   **The favicon**: `/favicon.ico` answers 404 and the site's tree holds no icon of its own (the only pictures of that kind are
   `app/idle-sign.svg` and `app/assets/tracenet-poleis.svg`, neither the site's mark; `phone/icons/` is the phone app's). None is added;
   the 404 stands until he gives the site an icon.

Kept of the earlier builder's uncommitted edits (it stopped at 08:5x with nothing run): 1, 2 and 5 as written, their comments tidied, and
the sphere handing its balls to the overlay. Thrown out: its mend of 3, a turn off the middle towards the ball (walked: it does not part
them, above); its socket probe was run after two corrections (it asked from a 404's empty origin, which both hosts answer).

The live site answers these files `cache-control: public, max-age=0, must-revalidate` with an etag (read Nov 12 09:52 UTC), so the mends
reach a returning visitor at the next deploy with no stamp moved.

## The pins (edited in place)

- `app/after-the-mint.test.mjs`: a ball drawn over the faces with its rim on the face: the tree does not stand, `setOrbit(40)`, one frame
  more; the ball clear (and one behind the cage ignored): it stands, `gap` 12, `lead` 40. The sphere's `+ lead`, its `setOrbit` (which
  asks no frame) and `balls` in the overlay's hand. The tree's address: `overflow-wrap:anywhere;word-break:break-all;text-wrap:balance`,
  no ellipsis, no nowrap.
- `app/dl-kit-deposit.test.mjs`: no `.dl-flask-qr{display:none}`, no `.dl-router-her{visibility:hidden}`; the phone's door over her
  picture; its address wraps.
- `app/dl-mint-pour.test.mjs`: `WS` is the one host; the socket opened again is the same one.
- `lab/one-page.test.mjs`: the read is behind `!q.get('nest') && !asksNest(win.location.hostname)`.

## Measures (the new Mac, headless Chrome, the code tip 9ddcae23f6, stand-in money, Nov 12 2026 09:47 to 09:54 UTC)

The walk: the site's own files (ranged, 206) and the Worker's own handler on one 127.0.0.1 origin over a D1 in memory; the door's treasury,
mint and fee key are stand-ins made in the run, the deposits rows in that store. No money moves and no key of his is read.

**1. The mint page's door, `warm.html?door=deposit`** (boxes l, t, r, b in px; "lying": any two of the code, the stamp, the address and her
picture that overlap; words under the door: any box of text under one of its parts):

| size | the code | the stamp | the address | her picture | lying | words under | address |
|---|---|---|---|---|---|---|---|
| 1440x900 | 652, 324, 787, 459 (135) | 588, 479, 852, 503 | 531, 515, 909, 544 | 1069, 522, 1440, 900 | none | 0 | 44 letters, 1 line, not cut |
| 390x844 | 139, 438, 251, 550 (112) | 90, 562, 300, 580 | 35, 592, 355, 618 | 184, 634, 390, 844 | none | 0 | 44 letters, 1 line, not cut |
| 360x780 | 124, 374, 236, 486 (112) | 75, 498, 285, 516 | 20, 528, 340, 554 | 154, 570, 360, 780 | none | 0 | 44 letters, 1 line, not cut |
| 320x640 | 112, 272, 208, 368 (96) | 55, 380, 265, 399 | 12, 411, 308, 451 | 150, 467, 320, 640 | none | 0 | 44 letters, 2 even lines, not cut |

On main at 390x844 (the same walk): no code, no her, the stamp at 628 and the address at 659 to 685, where her picture stands. On a phone
the address ends 16 px over her picture's box at every size. No sideways scroll.

**2. The tree's door, `after-the-mint.html?side=flask`, Fill your tank pressed, 14 deposits** (gap: from the ball's disc, the cage's reach, to
the door's box):

| size | door box (l, t, r, b) | disc (cx, cy, r) | gap | words under it | the address |
|---|---|---|---|---|---|
| 1440x900 | 891, 504, 1202, 676 | 462, 387, 259 | 185 | 0 | 44 letters, 1 line, not cut, no ellipsis |
| 1280x800 | 811, 438, 1122, 610 | 382, 354, 230 | 207 | 0 | 1 line, not cut |
| 1024x768 | 638, 430, 949, 602 | 287, 350, 227 | 133 | 0 | 1 line, not cut |
| 768x1024 | 450, 571, 732, 758 | 213, 428, 205 | 72 | 0 | 2 even lines (22 and 22), not cut |
| 712x1125 | 201, 646, 512, 818 | 356, 352, 244 | 50 | 0 | 1 line, not cut |
| 390x844 | 40, 492, 351, 664 | 195, 275, 170 | 47 | 0 | 1 line, not cut |
| 360x780 | 25, 460, 336, 633 | 180, 259, 157 | 44 | 0 | 1 line, not cut |

The door is 44 to 207 px clear of the ball at the seven sizes, as landed (768x1024 was 79: its door is 14 px taller for the second line).
No sideways scroll. With the door open the tree stands (still, 0 draws over 2 s; the door's own
3 s watch is its one interval, as before).

**3. The tree at rest** (gap: px from the side's face to the rim of the nearest ball drawn over the faces; lead: ms the twelve were led):

| side, deposits | cell | 1440x900 gap, lead | 390x844 gap, lead |
|---|---|---|---|
| flask, 0 | 123 | 8, 440 | 8, 480 |
| flask, 1 | 84 | 82, 0 | 54, 0 |
| flask, 14 | 149 | 133, 0 | 87, 0 |
| flask, 60 | 14 | 64, 0 | 42, 0 |
| pool, 0 | the centre chair | 52, 0 | 39, 0 |
| pool, 14 | the centre chair | 52, 0 | 39, 0 |

At rest after each: 0 draws, 0 frames asked, 0 timeouts, no interval, over 3 s. The face stays at the middle (the aim's own 6 px). A sweep
of 2 to 13, 20, 30, 40 and 100 deposits at 390x844 (the working files, before the first commit): no lead needed, gaps 34 to 174. With the
door open on a new house the lead stands (440, 480) and the tree is still. On main with no deposit the ball stands 30 px from the middle of
the 88 px face (1440x900), its rim 33 px inside it.

**4 and 5. The console and every request, 20 s a page**, the page served under the name `optimism.fit` (Chrome's resolver maps the name to the
walk's server, so `asksNest` sees the public host), nothing blocked, at 1440x900 and 390x844:

| page | to a house port | sockets | console (errors, warnings) | failed requests |
|---|---|---|---|---|
| `warm.html` | 0 | none opened (no stop in 20 s) | `/favicon.ico` 404 (once a browser, at 1440) | 0 |
| `warm.html?door=deposit` | 0 | `wss://solana-rpc.publicnode.com` 101, 3 s in | none | 0 |
| `after-the-mint.html?side=flask` | 0 | none opened | none | 0 |

The same walk on main (782da4480a): `http://optimism.fit:8904/nest/ref/mint/seiya-tags` asked on both mint pages (failed, with its warning),
and `wss://api.mainnet-beta.solana.com` "Unexpected response code: 403" on `?door=deposit`. The other requests off the site are the page's own
read of the seats (`solana-rpc.publicnode.com`, 1 or 2 a page). The player lets go 2 to 4 ranged reads of the films a mint page (canceled,
not failed).

## Gates (the new Mac, the code tip 9ddcae23f6, 09:46 UTC; every red file run on main's tree 782da4480a too)

- `the-javascript-only-shrinks`: 15 of 15, "this lane's JavaScript +25 -25, net +0 in 8 files". No pass.
- `the-look-is-a-law` 2 of 2; `the-law-is-the-gate` 7 of 7; `no-page-of-its-own` 3 of 3.
- `any-room` 12 of 13: ONE ROOM, EVERY FIXTURE names `embertide-viewer-ios/Checks/house-heard/main.swift: Box-0`. Main's: the same on main.
- Green: `app/after-the-mint` 7 of 7, `app/dl-kit-deposit` 7 of 7, `app/dl-mint-pour` 2 of 2, `app/dl-mint-flask` 6 of 6, `app/warm-door`
  5 of 5, `app/dl-twelve` 21 of 21, `worker/premint` 27 of 27, `worker/space-router-deposit` 10 of 10, `-link` 4 of 4, `-oracle` 7 of 7,
  `-portrait` 6 of 6, `worker/space-router` 11 of 11; of the 20 other tests that name a file this lane touches: `app/dl-depth` 16,
  `app/dl-mint-ledger` 4, `app/dl-space-router.scene` 5, `app/mint-wasm` 5, `app/warm-cosmos` 4, `lab/anti-satellites` 34, `lab/cubism` 27,
  `lab/glass-look` 7, `lab/orbit-kick` 20, `lab/rite-unit1s` 33, `lab/sagittarius-flight` 15, `lab/seiya-flight` 9, `lab/unboxing-plan` 24,
  `tools/site-files` 4, all of all.
- Red, each the same test with the same assertion on main's tree (main's, none this lane's): `app/dl-athena` 23 of 24 ("the shell's cursor
  is her look on a Mac"); `app/dl-paywall` 35 of 36 (Harmony's harmony-orange `#37b6d8` against `#0d4769`); `lab/one-page` 7 of 10 (the
  page's last script; `lab/mint-freeze-scene.mjs` ships; the tracenet's file list); `app/warm-sphere-moment` 10 of 11 (her cut 29.563);
  `lab/breakdown` 9 of 11 (the-column.to 37.087); `lab/heartbeat` 8 of 9 (`warm.js?v=mint-3`); `lab/irradiance` 20 of 21 and `lab/ko-edge`
  14 of 15 (BURSTS' second cut); `lab/sacrifice` 17 of 18 (the mount's line order).
- **Rule 8**, on this tip: `node --test app/dl-twelve.test.mjs` 21 of 21; `warm.html` served by `tools/serve-range` (206 on a Range):
  `node app/dl-twelve.proof.mjs --url <the page> --tap button` PASS, `--tap sphere` PASS ("the sound came in where the picture was, and the
  picture never went back"). Both were also run before each of the two code commits, on their bytes.

## The stills (the seat's scratch, never in git)

`the-mend/strip-1440.png`, `strip-390.png`, `strip-360.png`, `strip-768.png`: one strip a width, a plain caption under each frame, nothing
drawn on a frame; beside them every frame and its 3x crop (`door-*`, `treedoor-*`, `flask-<deposits>-*`, `pool-<deposits>-*`).

## What is still wrong, and what is not done

- The trail of the ball that was led on is a hairline across the visitor's cell (0 deposits): the trails cross faces everywhere; the body
  stands 8 px clear.
- A ball behind the cage (dim, drawn under the faces) may stand beside or behind the side's face: with 1 deposit one touches the cell's
  left corner from behind, and on the pool side one stands under the chair's lower edge, in the liquor. Counting those too was walked and
  thrown out: it led the twelve 2.4 to 2.8 s and brought a ball drawn over the faces to the chair's edge.
- A ball may stand over another deposit's face (60 deposits, the right of the cell): the law clears the side's face only.
- The stills at 0 deposits differ by one step between sizes (440 and 480 ms): the 6 px are the screen's.
- The mint page's door on a desk with deposits stands over the ball's faces (a face shows by the stamp at 1440x900 with 14): not one of
  the five, left.
- `html[data-flask-waits] .dl-athena-egg` still names the egg's place on a phone (47vh to 73vh), where the door now stands; no road shows
  that egg with the door since the split's plates became links (walked: no egg at any size). Left as it is.
- `/favicon.ico` 404 stands (no icon of the site's in the tree).
- The publicnode socket once opened and said nothing for 8 s (1 of 3 probes): the poll covers it; nothing retries a silent socket.
- Not walked: the pour and the fill on a phone's mint door (`[data-at]`, one line over her picture by the same rule), a real phone, Safari.
- Not on the live site: nothing is deployed, pushed or handed.
