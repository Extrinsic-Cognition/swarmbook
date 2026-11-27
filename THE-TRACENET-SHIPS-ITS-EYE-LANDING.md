# THE TRACENET SHIPS ITS EYE

`lane/the-tracenet-ships-its-eye`, seat claude-93958ebc, Nov 19 2026, cut from main c60a3f6a8c. Every time is UTC.

## Why

His word at 16:5x, "this is supposed to become the default swarmbook/userprofile thing dude... that is the tracenet", is on main as THE KEYBOARD IS THE
TRACENET (17:18) and THE BUILD READS EVERY IMPORT. The site built from that main, served from its own bytes by `tools/serve-range` and walked in a
headless Chrome, now loads the scene, but frames the laptop from inside its keys: the build leaves out `room/wasm/embertide-nexus.wasm` (404), which
`room/eye-door.mjs` loads through `new URL(WASM_FILE, import.meta.url)`, a constant no walk can read. Walked again with only that file handed in by CDP's
Fetch domain, the same built page frames the laptop at night as the lane's tree does (the box shut on the keys, "Open the box↵").

## What changed

- `tools/page-files.mjs` COMPUTED: `'../room/eye-door.mjs': ['wasm/embertide-nexus.wasm']`; the comment above the list one line shorter with the same
  words and the reason. JavaScript +4 -4, net 0.

## What the build ships with it

The nexus wasm, 1,253,554 bytes, for all three pages (each walks `room/eye-door.mjs`: the person's page, the mint page and the page after it, the two
last missing it on the live site today). Its 2,907 strings hold no address, no path or name of his Macs, no email, no key, no scan id and no device name.

## Read on the new Mac

Scratch trees at 5857a12d7c beside main c60a3f6a8c; node under `tools/dead-tasks/bounded.mjs`, nice 19.

- The mint folder's tests: 1188 / 1173 / 13 / 2 on the lane and on main, the same thirteen names.
- `room/house-door.test.mjs` 3 of 3; the welcome's door test 3 of 3; `room/laptop-glass.proof.mjs` PASS.
- **Rule 8** (the lane is under the mint's folder and changes no page with a picture and a sound): `node --test app/dl-twelve.test.mjs` 21 of 21. On the
  lane's tree served by `tools/serve-range`: `nice -n 19 node app/dl-twelve.proof.mjs --url http://127.0.0.1:18997/dyson-society/app/warm.html --tap
  button` PASS and `--tap sphere` PASS ("the sound came in where the picture was, and the picture never went back").
- The JavaScript law: +4 -4, net 0, green.
