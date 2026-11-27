# THE SONG DOOR CLOSES: the Worker's /api/song/ door leaves with the box it served (lane/the-song-door-closes, Oct 30 2026)

Seat claude-fea81f3c, on his click to "Do it here" on this seat's card, "Close the Worker's unused /api/song/ door". The lane is cut from main
7af343845, after lane/theres-no-time landed as 4afe7102b (07:12:32Z) and took the song box out of her making. Worked 07:4x UTC on the new Mac.
Nothing is deployed: the Worker's deploy is claude-1a67b2d3's, once, on his word.

## His words (UTC, as typed; the stamp is claude-1a67b2d3's transcript's)

- 06:24:04, over main's page in the preview, her making's "LET YOUR SONG BEGIN." answering "No song by that name.": "...also remove the song thing it
  doesnt work...". lane/theres-no-time took the box off the page. Its door on the site's Worker was left, asked by no page.

## What moved

- **`worker/song.mjs` and `worker/song.test.mjs` are deleted.** That was the door, `GET /api/song/search` and `GET /api/song/track`, which held
  Spotify's client-credentials token in the isolate and allowed 30 asks a minute an address.
  `git show 7af343845:embertide-app/ui/intro/dyson-society/worker/song.mjs` brings it back.
- **`worker/premint.mjs`:** its import, its construction and its route are gone. In their place is one comment that says why.
  - The harmony-link import takes back the comment it carried before the song came in (054c6b7e6): "THE LINK: the page's and Harmony's one contract".
- **`wrangler.optimism-fit.jsonc`:** `"/api/song/*"` leaves `run_worker_first`. A request for it now meets the site's assets first, and they answer 404.
- **`worker/her.test.mjs`:** the line that proves her door answers its own two paths and no other now asks `/api/premint/receipts`, a door that still
  stands, instead of the song's.

## Cost

| file | raw | gzip -9 |
| --- | --- | --- |
| `worker/song.mjs` | 6,494 B to none | 2,836 B to none |
| `worker/song.test.mjs` | 8,977 B to none | 2,902 B to none |
| `worker/premint.mjs` | 35,962 to 35,882 B | 11,495 to 11,555 B (the comment that says why) |

- The Worker bundle loses the door's module and its token cache.
- The site loses one path that woke the Worker and could spend Spotify's quota for anyone who asked it.

## Proofs (main 7af343845 plus this lane, on the new Mac)

- `node --test worker/*.test.mjs` (from `embertide-app/ui/intro/dyson-society`): 88 of 88 tests in 11 files.
- **The site config:** `wrangler.optimism-fit.jsonc` parses as JSONC. `run_worker_first` is `/`, `/referral`, `/claim`, `/api/premint/*`, `/api/her/*`,
  `/space-router/*`, `/vault/*` and the four media patterns.
- **The Worker asked directly** (`createHandler()`, Spotify's two codes still bound in its env): `/api/song/search?q=castle` and
  `/api/song/track?id=...` both answer the assets' 404, and no request leaves the Worker.
- **Rule 8** does not apply: no file under `dyson-society/app/` or `dyson-society/lab/` moves (the lander's RULE8_PATHS).

## His

- **The Spotify codes stay set:** `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are still the deployed Worker's secrets. Nothing reads them after this
  lane deploys. Deleting them is his hand: `wrangler secret delete SPOTIFY_CLIENT_ID` and `wrangler secret delete SPOTIFY_CLIENT_SECRET` with the site's
  config. So is the Spotify app "optimism.fit" in Spotify's dashboard.
- **Harmony's own making** (`tools/embertide-mesh/mac-onboarding.html`) keeps its song. It never asked this door.
- The deploy is claude-1a67b2d3's, once, on his word.
