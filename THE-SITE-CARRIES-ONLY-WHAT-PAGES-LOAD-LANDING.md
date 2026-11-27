# THE SITE CARRIES ONLY WHAT PAGES LOAD (Oct 29 2026, lane/the-site-carries-only-what-pages-load, claude-1a67b2d3)

**His word.** His click "Yes, first in line", at 2026-10-29 09:40:31 UTC in the warden's chat, on the warden's question "Put the optimism.fit leak fix
first in the lander's line?". The click is his label; the question is the warden's words. The warden relayed it, and it stands as his own turn in that
session's transcript.

**The order.** The warden of the spool (claude-914395ea), 09:4x UTC: "The deploy carries only what the pages load".

**His law.** Oct 14 2026: "everything shared outside must be thoroughly sanitized in the nest itself".

## What stood

- **The old copy.** `tools/build-optimism-fit.mjs` copied `app/`, `js/`, `skills/`, `submission/` and `vault/` whole. It left out only dotfiles, backups
  and a file named exactly `LANDING.md`.
- **What the live site served.**
  - The warden's read at 09:3x UTC: 16 of app/'s 17 `.md` files answered 200 at `optimism.fit/app/`, among them `ROOM.md` (his room's words, 4,105 B) and
    every `*-LANDING.md` receipt with his quoted words.
  - Mine at 09:4x UTC:
    - `app/THE-CHOICE-AT-THE-FREEZE-LANDING.md`: 200, 15,172 B;
    - `app/THE-GOLD-MONTH-IS-A-SEALED-BID-LANDING.md`: 200, 19,556 B;
    - `app/saint-seiya.layers.bin`: 200, 3,171,786 B. These are the film's depth layers. No page loads them, and the GitHub copy strips them
      (`tools/house-mirror/strip-families.txt`).
- **Shipped as well:** the 55 tests and proofs, the local road's release (`nestos-release.local.json`, whose own note says "never shipped"), and
  `assets/her-card.json`, which no page fetches (the App Clip carries its own copy).

## What changes

- **The rule, `tools/site-files.mjs`, judges each file of those folders once (`shipsAs`).**
  - **Ships:**
    - the kinds a page loads: html, js, mjs, css, pictures, films and songs, fonts, wasm and glb models;
    - data (json, txt) when a shipped page or script names the file;
    - the films' own manifests under `app/warm-media/`, which are fetched by computed names;
    - the tracenets' registers and drops this build already verifies against their sha256 and the Nest's sanitization receipt;
    - the licence texts that travel with a vendored script or a font.
  - **Stays home:**
    - every other `.md` (receipts, notes, READMEs);
    - tests and proofs (`*.test.*`, `*.proof.*`, `*.browser.*`, `*.spec.*`);
    - the local road's own (`*.local.*`);
    - dotfiles and backups;
    - every other kind.
- **The build copies by the rule** (`planSite`). It then reads its own output back (`outputProblems`); when anything the rule keeps home is in it, the
  build removes the output and refuses, so no such build is left for a deploy. It prints its listing by kind, the `.md` it shipped, the tests it shipped
  (none) and what it kept home, by reason.
- **The four `.md` that ship, on purpose.** The warden's order said never `*.md`. These four are what the site is for, so they stay; his word can still
  take them down.
  - `app/agent.md`: the page for agents, which the build's own `/agent.md` and `/llms.txt` routes send to.
  - The two skills it hands an agent: `skills/poleis-join/SKILL.md` and `skills/poleis-found/SKILL.md`.
  - The first tracenet's drop, which the Worker serves only by its law (`worker/tracenet-vault.mjs`, `run_worker_first: /vault/*`).
- **`gen/` ships.** It is not notes: its one file, `gen/poleis-client-v7.js`, is the module `app/found.html` imports. The tree test caught this when a
  first cut kept `gen/` home.

## Measured

- **`node --test tools/site-files.test.mjs`: 4 of 4.** It holds:
  - the rule one file at a time;
  - the build's reading back of its output;
  - over this tree:
    - every page ships, and so does every module each page's walk reaches (`tools/page-files.mjs`);
    - every data file a page names ships;
    - no receipt, note, test, proof or local release ships;
    - `ROOM.md` and the film's layers stay home.
- **The proof build:** `node tools/build-optimism-fit.mjs --out <scratch>` on this lane's tree. The judges' two films are not in git, and the house never
  copies files between Macs, so two empty stand-ins took their place for this run and were removed after it.
  - Output: 1,594 files, 348.0 MiB.
  - By kind:

    | Kind | Files |
    | --- | --- |
    | png | 1,257 |
    | js | 153 |
    | mjs | 88 |
    | css | 33 |
    | json | 15 |
    | html | 14 |
    | jpg | 6 |
    | mp4 | 6 |
    | md | 4 |
    | glb | 4 |
    | txt | 3 |
    | ttf | 3 |
    | no extension (`_redirects`, `_headers`) | 2 |
    | svg | 2 |
    | m4a | 2 |
    | webp | 1 |
    | wasm | 1 |

  - Tests and proofs shipped: 0. `.md` shipped: the four above.
  - Kept home: 79 files.

    | Reason | Files |
    | --- | --- |
    | a receipt or a note (`ROOM.md` among them) | 21 |
    | a test or a proof | 55 |
    | data no page names (`her-card.json`) | 1 |
    | the local road's own | 1 |
    | not a kind a page loads (`saint-seiya.layers.bin`) | 1 |

  - `ROOM.md` on the built site: 404.
- **The page walk over the built folder.** All 14 pages (13 in `app/` and `submission/index.html`) opened in headless Chrome, off every screen, from the
  built folder served with byte ranges. Requests to any other host were refused, so nothing left the Mac.
  - **Files the rule left out that a page asked for: 0.**
  - What failed was already failing before this lane:
    - the Worker's own `/api/premint/*` routes, which a static server does not answer;
    - `/favicon.ico` on claim.html and `/fonts/fonts.css` on tracenet.html, both outside the copied folders (the live site answers `/fonts/fonts.css`
      404 today too);
    - the stand-in films' empty ranges;
    - the CDN's `@solana/web3.js`, refused by the walk, which index, found and polis need.
- **Neighbours:**
  - `worker/ranges.test.mjs` green.
  - `lab/one-page.test.mjs`: 7 of 10. Its three reds are main's own: they fail the same way on the shared checkout at 9b92fa7c8.
  - `tools/any-room/any-room.test.mjs`: 8 of 8.
- **A scan of the built output's text files** for home paths, the LAN's addresses, Stripe keys and private keys: one hit, below under edges.

## Cost

- The build reads each file of the copied folders once more, plus the texts of what ships (to judge the data), and reads its output back once:
  well under a second on this Mac, against a copy of about 350 MB.
- Nothing at rest; nothing on the site's hot path.

## The redeploy (his press)

The live site keeps serving the files until the next deploy, which is his.

**Where:** on the old Mac (the deploy road's own: its `~/.embertide/optimism-fit/r2-media.json`, its wrangler), once this lane has landed.

The deploy road, run on the old Mac with `/opt/homebrew/bin` on the path:

    cd ~/code-ec/house/embertide-app/ui/intro/dyson-society && node tools/build-optimism-fit.mjs && node tools/media-to-r2.mjs && npx wrangler deploy --config wrangler.optimism-fit.jsonc

**Corrected:** this section first said `submission/pitch.mp4` was missing from the old Mac's source and put a `cp` from `dist/` before the build. It was
never missing: the listing I read it from was cut by `head -5`. The old Mac's `submission/` holds `demo.mp4` (23,568,931 B) and `pitch.mp4` (8,545,788 B).
The `cp` also failed on the new Mac, where `dist/optimism-fit` does not exist, when the line was handed to him and run there. That failure stopped the
chain at its first step, so nothing was built or deployed.

**What it carried:**
- main as it stood (ba6c91337): this lane and main's page commits since the last build (Oct 28 17:11 WET);
- SPACE ROUTER AT THE FREEZE, landed by then.

The Worker and its config had not changed since that build, and `PREMINT_ENABLED` stayed false.

## Measured after the deploy (Oct 29 2026, 10:18 UTC, from the old Mac at ba6c91337)

**The build** (`tools/build-optimism-fit.mjs`):
- 1,608 files, 454.2 MiB. The old Mac holds the git-ignored films of `app/warm-media/` that no worktree has.
- `.md` shipped: the four named above. Tests and proofs shipped: 0.
- Kept home: 80 files.

  | Reason | Files |
  | --- | --- |
  | a receipt or a note | 21 |
  | a test or a proof | 55 |
  | data no page names | 1 |
  | the local road's own | 1 |
  | not a kind a page loads | 1 |
  | a backup | 1 |

**The deploy:**
- `node tools/media-to-r2.mjs` said "12 films and songs, 10 by their bytes, 0 to put into optimism-fit-vault": the bucket already held every film.
- `npx wrangler deploy` uploaded 16 new or changed assets (1,590 already held).
- Version `e21bb114-9ccf-41ef-86ea-5d5d158887f5` is live on optimism.fit and www.optimism.fit. `PREMINT_ENABLED` stayed "false".

**Read live after the deploy:**
- **Answering 404:**
  - every `.md` of `app/` but `agent.md`: 21 of 21, `ROOM.md` and every receipt among them;
  - `app/saint-seiya.layers.bin`;
  - `app/dl-twelve.test.mjs` and `app/dl-twelve.proof.mjs`;
  - `app/nestos-release.local.json`;
  - `app/assets/her-card.json`.
- **Still answering:**
  - `app/agent.md`: 200, 4,480 B; `/llms.txt` redirects to it with 302;
  - `app/warm.html`: 200, 55,448 B. It carries "Space Router." and `warm-entry.mjs?v=society-mint-9`;
  - `app/dl-space-router.js`: 200, 18,102 B;
  - `app/gen/poleis-client-v7.js` and `app/found.html`: 200;
  - the film's byte range: 206.

## Edges, said

- `room/nest-wire.mjs` ships with a comment naming `~/...` (its spec's path). It is one of the page's own files outside the copied folders
  and is in the GitHub copy too; this lane's rule does not reach it.
- Every other page module and asset outside the copied folders still ships by the page's walk alone, as before.
