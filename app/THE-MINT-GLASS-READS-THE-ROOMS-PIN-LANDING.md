# THE MINT GLASS READS THE ROOM'S PIN (Oct 28 2026)

The mint page on a seat of the house (`warm.html?seat=<glass>`, `dl-glass.js` on the law `dl-glass.mjs`, THE-PAGE-IS-A-GLASS-LANDING.md) is a
glass of the room: it loads the room folder's `wasm/embertide-nexus.wasm` and refuses it unless its sha256 is the pin. Since this lane, the pin is
the room's own, read off the room's eye door; before it, the glass refused the house's module on every seat.

## What was wrong

- The pin was a copy in `dl-glass.mjs`, `2abd671b…`, the module of Oct 22 21:32 when the glass landed (f27c25658). No line of
  `embertide-radio/nexus/build.sh` or `tools/embertide-mesh/radio/inline-nexus.mjs` ever named it.
- From Oct 23 13:24 (364a04ebc, lane/the-shell-is-the-frame) every rebuild left it behind: the room's pin moved seven times, fa34516c, 0062b2a3,
  5c800323, 99957e41, 2a589d34, 3c2d0838, 19ac95ce. On main at 74f2b42a6 the glass said "the module is not the pinned one: sha256 19ac95cec35f2916,
  the pin 2abd671bf4d4be3c: refused before it runs".
- `dl-glass.test.mjs` caught it (2 of 6 on main), but from that first rebuild on it was red on main too, so every gate since excused it as main's
  own red.

## The road taken

- `dl-glass.mjs` names where the pin lives: `PIN_FILE` (`eye-door.mjs`, under the room folder beside `WASM_FILE`), `PIN_LINE` (the line
  `export const NEXUS_WASM_SHA256 = '<64 hex>';`, the very line build.sh writes with its sed and checks with its grep on every rebuild) and
  `pinOf(text)`. The mount fetches the eye door's text beside the bytes, in parallel; with no line, or an eye door that does not answer, nothing
  runs; any other bytes are refused before they run, as before.
- Not imported: in a browser `eye-door.mjs` loads the module itself at import (`if (!NODE && typeof fetch === 'function') await load();`), a
  second 770,497-byte instance on the page.
- Not a line in build.sh (the card's first plan, and the note in `embertide-radio/nexus/THE-PHONES-KEEP-DIFFERENT-THIRDS-OF-THE-BEAT-LANDING.md`):
  a copy build.sh wrote sits under the mint, so every landing that rebuilds the module would fall under rule 8, 12 such landings from Oct 20 to
  Oct 28. Each would then be unbatchable and owe the sound's real-browser proof, for a line the page never needed.
- The trust is the same as before. The page, the eye door and the bytes come from one server's tree. The bytes are the room folder's, so the room's
  pin is the one they answer to.
- The drift guard moves to the contract. The test reads the real eye door, holds the bytes in the tree and in the room to it, and holds build.sh to
  writing and checking the eye door's line in the form `PIN_LINE` reads.

## Cost

One GET of the eye door's text (13,028 bytes) at the mount, in parallel with the module's 770,497 bytes, behind the seat only. The public page
still fetches nothing (the no-seat test holds it to zero requests). `tools/page-files.mjs` ships nothing new: the name resolves against the room
folder, not `import.meta.url`.

## Numbers (main 74f2b42a6 plus this lane, the new Mac)

- `node --test app/dl-glass.test.mjs`: 2 of 6 on main, 6 of 6 here.
- A headless Chrome off every screen, on the lane's tree served by `tools/serve-range`, opened
  `warm.html?seat=newmac&nest=127.0.0.1:9&rite=127.0.0.1:9`; every request but a GET to the page's own origin was failed by Fetch interception.
  `dlGlass.state().module` read: sha256 `19ac95ce…`, 770,497 bytes, the pin read from `/embertide-app/ui/intro/room/eye-door.mjs`, 56.9 ms.
  The glass then stopped at the count door, because the rite it was given is a dead port ("Failed to fetch dynamically imported module:
  http://127.0.0.1:9/lib/count-door.mjs"); the count on a real station is the node test's (the rite's real count door host, a fake clock).
- Rule 8: `node --test app/dl-twelve.test.mjs` 20 of 20; `nice -n 19 node app/dl-twelve.proof.mjs --url <warm.html served by tools/serve-range>
  --tap button` PASS and `--tap sphere` PASS.
- The mint folder's other suites carry the same 8 reds on main and here: `app/dl-athena` 1, `app/dl-paywall` 1, `lab/breakdown` 1,
  `lab/irradiance` 1, `lab/one-page` 3 (identical messages), `lab/sacrifice` 1. `tools/any-room` is green.

## What it does not do

The glass still mounts only on a seat and still writes nothing to the Nest. Its four gates are the house's, as before: the room's shell, the glass
measured, the field born and the module published.
