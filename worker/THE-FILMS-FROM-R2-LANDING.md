# THE FILMS FROM R2 (Oct 28 2026, claude-cc7b2f4f)

Lane `lane/the-films-from-r2`, cut from origin/main 7f016c8e3 (with `lane/the-films-answer-ranges` landed and rolled back, its receipt beside
this one: `THE-FILMS-ANSWER-RANGES-LANDING.md`).

## His words

- Oct 28 14:1x WET: "Yes: put the films and songs in R2, have the Worker answer their ranges with R2's native ranged read, prove the skip seeks
  live without cutting any film short, and hand it."

## Why

On optimism.fit the platform's assets answer a range of a film with the whole file, so a browser held the film unseekable and "Skip to the mint"
(`app/dl-twelve.js` skipToMint) did nothing. A range cut in the Worker's JS answered short checks and then, live, cut every open range short
(`bytes=0-` stopped at 221,184 of 20,451,031 bytes): every chunk of the film went through a TransformStream, past the Worker's CPU limit in
production; under `wrangler dev` the same code answered whole. It was rolled back. A film's range wants a cut that is not JS.

## The change

- `worker/ranges.mjs`: `mediaFromR2(request, bucket, pathname)`. A film or song lives in the Worker's bucket at `media/<its path>` (beside the
  creators' `vault/<handle>/...`). One byte range is asked of R2 itself (`get(key, { range: { offset, length } })`): R2 cuts the bytes, its body
  passes through untouched, no byte of the film through JS. 206 with Content-Range and Content-Length; past the end 416 (`bytes */size`);
  none or several ranges 200 whole; a HEAD its headers; the object's own type, cache and ETag; every answer `Accept-Ranges: bytes`. `parseRange`
  stays; the JS cut (`sliceStream`, `withRanges`) and the sizes file are gone.
- `worker/premint.mjs`: a film or song the bucket holds comes from R2; one it does not hold, or R2 down, is the assets' answer, untouched.
- `wrangler.optimism-fit.jsonc`: the media reach the Worker first again (`/*.mp4`, `/*.m4a`, `/*.mp3`, `/*.webm`; the router's rule is
  `^/.*\.mp4$`); the pages and their code stay asset-first.
- `tools/media-to-r2.mjs`: puts every film and song of the built site into the bucket the config binds as VAULT, with its type and the films'
  year-long cache; only what changed since that Mac's last put (each file's sha256 in `~/.embertide/optimism-fit/r2-media.json`); `--check` says
  what would go up. The deploy road: `node tools/build-optimism-fit.mjs && node tools/media-to-r2.mjs && npx wrangler deploy --config
  wrangler.optimism-fit.jsonc`. A new film the put missed costs a seek, never a film: the assets serve it whole (a re-cut film: Not done).
- `tools/build-optimism-fit.mjs`: no sizes file; its header names the put in the deploy road.

## Cost

A seek is two R2 reads (a head, then the ranged get: class B operations, free to 10 million a month) and only the bytes asked leave R2; no
byte passes through the Worker's JS, so a film costs the Worker no CPU however long it plays. Storage: the 12 films and songs, 200.0 MB
(R2 is free to 10 GB). At rest: nothing.

## Checks

- `node --test worker/ranges.test.mjs`: 6 of 6 (the parser; a film from R2 with R2 asked for exactly the range, an open end, a suffix, 200
  whole; 416 and HEAD asking R2 for no byte; the door: R2's film, the assets' answer untouched for a film the bucket lacks, for a page and with R2
  down; the media Worker-first, the pages asset-first; the tool's keys, types, cache and only-what-changed). The Worker's suite: 59 of 59. The
  build's four tests: 50 of 54, as on main (main's own four).
- The platform's runtime, before landing (Oct 28 14:3x): this lane's tree in a temporary worktree on the old Mac under `wrangler dev --local`,
  the film and the song put into its local bucket, the built site as its assets: `bytes=0-` 206 with all 20,451,031 bytes in 0.018 s,
  `bytes=16000000-` 4,451,031 bytes, `bytes=19000000-` 1,451,031, a 100-byte range 100, `bytes=30000000-` 416. Headless Chrome through a
  tunnel: the film seekable 0 to 152 s, Skip to the mint pressed at 4 s, the film standing at 120.7 s on the drawn arrow, the choice open, 5 s
  later; no page error. The worktree, its server and the tunnel removed after.
- Live, Oct 28 (UTC): landed 14:13:53 (house d99831288); the put 14:14:30 to 14:15:14, 12 put, 0 kept; deployed 14:15:52 from that house,
  version 015726d3-6b3e-4f89-8e8b-b3e9efc1e748.
  - `curl` on https://optimism.fit/app/saint-seiya.mp4: `bytes=0-` 206 with all 20,451,031 bytes, `bytes=16000000-` 4,451,031,
    `bytes=19000000-` 1,451,031, a 100-byte range 100, `bytes=30000000-` 416 (`bytes */20451031`), the plain GET 200 whole. Its ETag
    `"2d3641f608e68f44f7647b9fb7e9c455"` is the film's MD5: the bytes are R2's.
  - The 12 films and songs, each fetched whole from the site: its sha256 equal to the put record's, its Content-Length its size; its last
    4,096 bytes by a suffix range, 206 with their Content-Range.
  - Headless Chrome on https://optimism.fit/app/warm.html: the film seekable 0 to 152 s; Skip to the mint pressed at 4.5 s; 5 s later the
    film stands at 120.7 s on the drawn arrow, paused, the choice open (the picture judged: BRONZE and GOLD, JOIN THE $WARM, her with the
    apple); no page error. Played from the start, 20 s of film in 20 s (4.6 to 24.6 s), ready 4; set to 60 s, on to 69.5 s, no stall. Ten of
    the twelve (the mothership's projection and soundtrack are the fantasia's bytes under a second name, whole by their hash) played from five
    seconds before their end: each `ended` at its full length (152.41, 152.41, 230.14, 230.14, 51 four times, 74.77, 118.65 s), no stall,
    no error.

## Not done

- A film re-cut under its old name needs the put before the deploy. Until then the bucket still holds the old cut and the door serves it: it
  does not compare the bucket's copy with the asset, and the page's `?v=` never reaches the key. The guard: built the same day,
  `THE-FILM-BY-ITS-BYTES-LANDING.md` (the build names each film by its bytes, the bucket holds it by them, so a stale copy is never asked).
- His own deploy road, the plain `wrangler deploy` over ssh, now carries the door (he ran it at 14:13:38Z: version a1ffdf8f, house f9f436010,
  before this lane landed; this lane's deploy followed at 14:15:52Z, his fuel words still live on app/warm.html and app/index.html). It has
  no put, which only a re-cut film needs.
