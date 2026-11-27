# THE PAGES RUN ONLY THEIR OWN SCRIPTS (Nov 20 2026, lane/the-pages-run-only-their-own-scripts, seat claude-62e500da)

## His words

- Nov 20 2026 18:34:43 UTC: "Yes, cut it", to "Cut the script policy for the public pages next?" (what THE SITE PINS HTTPS left owed, from
  the Nest's audit of that day).

## The cost

- One header line grows from 80 to 782 characters on every file the site answers: about 700 bytes a response. Nothing runs anywhere.
- At a build: one read of each page that ships (17 today) and one sha256 a written script (12 today). The build took 1.7 s before and after.
- Three pages and two modules take two libraries from this site instead of a CDN: one host less to reach, the same bytes.
- No Worker change, no migration.
- JavaScript net 0: the build tool 4 changed lines, `tools/site-files.mjs` 2, its test 2, five page files 9. Every change rides an existing line.

## What was so (live since Nov 20 ~18:35 UTC, main 4a59b4a162)

- The content policy shut a base tag, an object and a foreign form, and said nothing on scripts: a script written into a page by anyone, or
  loaded from any host, ran.
- `found.html`, `index.html` (the Swarmbook front), `polis.html`, `dl-slot.js` and `dl-whitelist.js` took web3.js 1.95.8 and tweetnacl
  1.0.3 from `cdn.jsdelivr.net`, with no integrity check, on a site that holds a flask's key. The same two libraries stood in `app/vendor/`
  for the other pages.

## What stands now

The build's one content policy, on every file the site serves:

`base-uri 'self'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' <the hash of each written script>`

- **A page runs the scripts this site serves and the scripts written inside its own pages, and no other.** The build names each written
  script by the sha256 of its text (`inlineScripts` in `tools/site-files.mjs`, over every page that ships), so a page's script edited later
  is named again at the next build with nothing to keep by hand. A build whose policy line would pass 1,900 characters stops (a `_headers`
  line holds 2,000).
- **`'unsafe-eval'` stays**, on purpose: her making builds the original Lyssajudron from its own source text (`app/dl-athena.mjs`,
  `new Function`), and the worlds are WebAssembly. No page evaluates a string anyone else can write. Without it, Safari before 16 would
  also refuse the WebAssembly.
- **The two libraries are the site's own copies** (`app/vendor/`): web3.js byte for byte the CDN's, tweetnacl the CDN's with one final
  newline.
- **The painter's frame keeps no policy** (`/app/dl-her-portrait-frame.html`, `! Content-Security-Policy`): it has no origin, no storage
  and no wallet, and Reactor's kit runs in it as it does today in every browser.
- Still left out, as in THE SITE PINS HTTPS: who may frame a page (his glasses frame a page of the web, `THE-JOURNEY-GATE.md` 5d) and any
  upgrade of plain http (the pages ask the visitor's Nest on 127.0.0.1). The test pins both, and that the policy holds no `unsafe-inline`
  and names no other host.

Read before writing it, over every file that ships: no page writes a handler into HTML, builds a script from text, starts a worker or a
worklet, imports a blob, or times a string. Blob addresses are pictures, films and downloads only. The six `eval(` in the room's modules
are methods of that name, not the language's.

## The proof

The lane's site built for real (1,733 files), served with byte ranges behind a stand-in host on the new Mac that lays its `_headers` on
each answer as Cloudflare's static assets do. Every write stood in.

**Chrome, headless, off every screen:**

- 17 of 17 pages load with nothing refused; no page takes a script from another host; on `index.html`, `found.html` and `polis.html` the
  two libraries load from the site's own copies.
- The control, on a page of the site: a script written in by code, a script from another host and a handler written into the page are each
  refused and none runs; a base tag elsewhere and an object are refused; a script this site serves runs; `eval` and WebAssembly run.
- The stations, no page error in any: the front with its chamber and its board; the split at 1440 and 390; the egg's call; a filled flask
  with no X through her making (her engine built from its source) to its plate, Connect X, X's road back, the claim; the plate at 390; X
  refusing; a flask that has not paid, at the door.
- A page of another origin still frames the mint page; the painter's frame loads and says ready.

**Safari, an iPhone 17 simulator (iOS 26.3), booted with no window:**

- A probe page of the stand-in host, under the same policy, that writes what the browser did: a written script the policy names ran; its
  import map and a module that needs it ran; a written script it does not name, a script written in by code, a handler and a script from
  another host were refused; `new Function`, `eval` and WebAssembly run. The same probe reads the same in Chrome.
- The mint page and the Swarmbook front both draw whole under the policy (the film's sphere, her, the call; the ball and its worlds).

## The tests

On the new Mac at nice 19, in a scratch worktree at this lane's first commit (the receipt alone came after):

| Suite | Result |
|---|---|
| `tools/*.test.mjs` (the mint folder's) | 105 of 107 (1 red, main's own; 1 skipped); `site-files.test.mjs` alone 4 of 4 |
| `app/*.test.mjs` | 537 of 541 (4 red, main's own) |
| `worker/*.test.mjs` | 150 of 150 |
| The law gates (the JavaScript only shrinks, any room, the look, the law is the gate, no page of its own, the pixel is a lookup) | 59 of 59 |
| `app/dl-twelve.test.mjs` (rule 8) | 21 of 21 |

The red ones are main's own, the same as on the three lanes before this one that day.

Rule 8: the lane touches the mint's `app/` (five files that only name where two libraries come from). `app/dl-twelve.test.mjs` ran
(above) and the two proofs of `app/dl-twelve.proof.mjs` (`--tap button`, `--tap sphere`) ride the hand. Neither sound nor picture is touched.

## Not done, said plainly

- **Not live.** The policy changes at his publish press.
- **`'unsafe-eval'` is in the policy.** It goes when her making stops building the engine from text; that is a change to her, not to a header.
- **Styles are not covered**: a page may still carry any style. Pictures, films and connections are not restricted either.
- **Older Safari was not run.** The simulator is iOS 26.3. Hashes and import maps under a policy are old in WebKit, and the pages already
  need import maps (Safari 16.4).
- **The painter was not run**, as before: its frame loads, and it keeps no policy.
- **The wallet roads of `found.html` and `polis.html` were not pressed**: the two libraries load and define what those pages read
  (`solanaWeb3`, `nacl`); no wallet was connected.
- **A script Cloudflare may add** (its analytics beacon, a challenge) would be refused: none is added today (a page's bytes as a browser
  asks them are the built bytes). If one is switched on, its host goes into the policy first.
