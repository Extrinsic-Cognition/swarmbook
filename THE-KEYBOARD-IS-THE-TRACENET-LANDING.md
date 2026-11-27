# THE KEYBOARD IS THE TRACENET

`lane/the-keyboard-is-the-tracenet`, seat claude-93958ebc, Nov 19 2026, cut from main 0a0cac1aa6. Every time is UTC.

## His words

- 16:36, over a person's page on the flat keyboard: "this is ugly as fuck dude... i dont understand why you got that fucking keyboard instead of the 3D
  realistic one dude... that page is violating so many solidified principles... hypertrace".
- 16:46, over the tracenet's light 3D page of October shown as "the 3D one": "that is not my fucking keyboard... i had made a scene already there was dmc4
  lyssajudron fight ffs".
- 16:5x, over the three stills of that scene as it renders today (the box shut on the keys, her rising out of it, her on G with "I am Lyssajudron." and
  the bar): **"this is supposed to become the default swarmbook/userprofile thing dude... everyone that mints a lyssajudron and joins claw riders will
  have their profile there... that is the tracenet"**.

The lineage: ec-workspace `docs/the-keyboard-tracenet-with-the-lyssajudron-hypertrace-2026-11-19.md` (his keyboard in his words, Oct 14 to Nov 19; the
nine principles the flat page broke; his ruling).

## The numbers first

| what | before | after |
|---|---|---|
| a person's page, `/<handle>` (`app/tracenet.html?of=<handle>`) | a flat keyboard of CSS boxes with a 150 px sprite of her laid over it (THE TRAIL'S END, Nov 1) | **his keyboard**: the first door's glass (`room/laptop-glass.mjs`), the laptop at night with her box on its keys, leading the page at the window's width and its first screen |
| the Lyssajudron on it | the same default sprite on every page | **the page's own**, in the six colours its depositor gave (the door's list of everyone's faces), rising out of her box at a press |
| a page the door names no hexagon for | the same keyboard | the box shut; its press goes to the mint page, where a box is opened |
| asks of the page | the register, the seat proofs | the same, one GET of the door's list (held 20 s by the door), the glass's modules and one WebGL renderer drawing on a cause (the load, the press and the hatch, a size), never at rest; no Nest |
| JavaScript | | **+88 -252, net -164** in 8 files |
| the files the site ships for the page | | 79 (`tools/page-files.mjs` over the page), `poleis/poems.js` and `poleis/discussion.js` among none of them |

## What changed

- `app/tracenet.html`: the scene's place (`#tt-scene`) leads `<main>`, where the keyboard of boxes, her canvas and the hint stood; the head's comment says
  what the floor is now; the sheet and the module carry a new version.
- `app/tracenet-trail.mjs`: the keyboard of boxes and her sprite are gone (`keysOf`, `drawHer`, the keys' loop, `HER_KEY`, two imports); in their place
  THE KEYBOARD IS THE TRACENET: `hexagonFor` asks the door once, then the page imports `room/her-face.js`, `room/laptop-glass.mjs` and
  `poleis/alphabet.js`, mounts the glass with `{ seat: 'tracenet', nest: null }`, paints the depositor's colours (`glass.paint`, and her light by the
  page's own `{light}` message, the fold the glass already reads), stands her box shut (`glass.box({ show: true, alphabet, word: 'LYSSAJUDRON' })`), and
  opens it on a click or Enter (`glass.box({ open: true })`). `hexagonOf` and `PORTRAIT_LIST` find the row whose claimed page is this one.
- `app/tracenet-trail.css`: the keys' styles out; the scene's window in (full width, the first screen; on a phone the screen less the header); the page
  scrolls no sideways.
- `poleis/alphabet.js` (new) holds the Society's alphabet, moved byte for byte out of `poleis/discussion.js`, which imports and re-exports it: every
  `import { ALPHABET } from '.../discussion.js'` stands (lysa's laptop page, the Board's glasses page, the X step, the laptop's proofs). The entrance
  asset's build and its test read the letters from `alphabet.js` (the same 26 letters, compared). Why: the box engraves LYSSAJUDRON in that alphabet, and
  `discussion.js` imports `poems.js`, his poems in full verse, which the live site serves none of (404 at 16:2x); the public page takes the letters alone.
- `app/the-trails-end.proof.mjs` (150 lines) is removed: it proved the keyboard of boxes and her sprite over its keys.
- `app/tracenet-trail.test.mjs`: the keyboard's test is replaced by two: the tracenet is his keyboard (the glass with no Nest, the box, the colours,
  the letters, and no import naming `discussion` or `poems`), and the page's hexagon (the door's row, its colours; none when the door names none or does
  not answer).

## Seen before it lands

The lane's tree served by `tools/serve-range`, the page opened in a headless Chrome off every screen, the door's list stood in by one example hexagon
through CDP's Fetch domain (the laptop proof's example colours: base #2E6BE6, coat #1B3F8F, gold #E2B341, eyes and flame #F05A28, light #7FE0FF, on his
first tracenet's page as Hexagon 1; his own Nest's paint is bare since Nov 12). Read off the page:

| moment | the screen of the laptop | what stands |
|---|---|---|
| the page opened | "Open the box↵" | the laptop at night, her box shut on the keys |
| 1.5 s after a click on the scene | (the hatch) | the box open, she rising out of it |
| 5 s after | "I am Lyssajudron." | she on G in the depositor's colours, the bar "Lyssajudron, Genie of Three Wishes" |
| a phone, 390 wide | "Open the box↵" | the box shut, the scene the screen's height less the header |
| the door names no hexagon | "Open the box↵" | a click opens `/app/warm.html` |

On a plain load, against main's page served the same way: the lane asks the door's list once more, and the shared scene module asks a Nest for its
bytes' name (below); nothing else of the page differs. The stills and the walkers: ec-workspace
`tools/anchor-beat/lyssa-pfp/out/the-keyboard-is-the-tracenet/`.

## Read on the new Mac

Scratch trees at 3347c0f219 (and the tip 0db4ff8b28) beside main 0a0cac1aa6; node under `tools/dead-tasks/bounded.mjs`, nice 19.

- The mint folder's tests (`app/*.test.mjs worker/*.test.mjs tools/*.test.mjs lab/*.test.mjs`, four at once), at the tip: 1188 tests, 1173 pass, 13
  red, 2 skipped; main 1187, 1172, 13, 2; the same thirteen names red on both (the first run at 3347c0f219 had one more red, this lane's own new test,
  too strict on a comment: mended at the tip).
- `app/tracenet-trail.test.mjs`: 8 of 8.
- The room's tests that read the alphabet or the laptop (`entrance-asset.test.mjs`, `laptop-*.test.mjs`): 40 of 40 on the lane and on main.
- `tools/embertide-mesh/lib/harmony-front-door.welcome.test.mjs` (it serves `/intro/poleis/discussion.js`): 3 of 3.
- `room/laptop-glass.proof.mjs` on the lane (lysa's page and the Mac's card, the letters through the re-export): PASS.
- **Rule 8** (the lane is under the mint's folder and changes no page with a picture and a sound): `node --test app/dl-twelve.test.mjs` 21 of 21. On the
  lane's tree served by `tools/serve-range`: `nice -n 19 node app/dl-twelve.proof.mjs --url http://127.0.0.1:18997/dyson-society/app/warm.html --tap
  button` PASS and `--tap sphere` PASS ("the sound came in where the picture was, and the picture never went back").
- The JavaScript law in the lane's tree: green, +88 -252, net -164 in 8 files.

## What it leaves

- **The live site changes at his publish.** Until someone fills a flask, is drawn and claims a handle, the door lists no hexagon (`{"count":0}` at
  16:2x): every page shows the box shut, and its press opens the mint page.
- The shared scene module asks a Nest for its bytes' name on every page that loads it (`room/scene-wasm.mjs` nestHere): on optimism.fit that is
  `https://optimism.fit:8904`, which never answers, so the module runs "unchecked". Its owner's fix: no Nest off the house.
- The quiet hatch only: her boss entrance (the mash, the style rank, the name card) and the phone's fight are not played on a person's page; whether
  and when they play there (the owner's first visit, every visit) is not ruled.
- The words above the first trace ("The first tracenet · Project Snowtrace", "Your tracenet.", "A path traced in the snow...") still stand on every
  person's page: his first tracenet's words, the lineage's seventh principle.
- On a phone the glass frames the keyboard for a wide screen: the box stands at the right edge.
- The door's list holds 150 rows at most (WALL): past 150 deposits a later page is not found there until the door answers by handle.
