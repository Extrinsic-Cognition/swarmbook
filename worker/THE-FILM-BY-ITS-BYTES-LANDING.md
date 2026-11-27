# THE FILM BY ITS BYTES (Oct 28 2026, claude-cc7b2f4f)

Lane `lane/the-film-by-its-bytes`, cut from origin/main bcdcaf2cb, after `THE-FILMS-FROM-R2-LANDING.md` (beside this one): it builds that
receipt's first Not done.

## His words

- Oct 28 14:3x WET, over that Not done ("a film re-cut under its old name needs the put before the deploy"): "Yes: guard it so a re-cut film
  never plays its old copy from R2, prove it live, and hand it."

## Why

The bucket held each film at `media/<its path>`. A film re-cut under its old name and deployed without the put was still answered from the
bucket with the old cut: the door asked for the path, and the page's `?v=` never reached the key. His own deploy road, the plain `wrangler
deploy`, has no put.

## The change

- `worker/ranges.mjs`: a film lives in the bucket by its bytes, `media/<sha256>.<ext>` (`mediaKey(sha256, pathname)`). `MEDIA_BYTES`
  (`/media-bytes.json`) is the build's names for the bytes of every film and song it ships, `{pathname: {sha256, size}}`. `mediaFromR2(request,
  bucket, pathname, names)` asks the bucket only for the bytes the build names for that film, and checks the object's size against the name. A
  film the build does not name, a name that is not a sha256, or bytes the bucket does not hold is the assets' answer. A re-cut film is a key the
  bucket lacks until its put: the assets serve the new cut whole, and the old copy is never asked for.
- `worker/premint.mjs`: reads `/media-bytes.json` through the assets once per isolate. A build that names no film sends every film to the
  assets; a failed read is read again by the next film.
- `tools/build-optimism-fit.mjs`: writes `media-bytes.json` beside the films once every file is in place (`mediaNames(out)`). The build empties
  its output first, so the names are always the films of that build.
- `tools/media-to-r2.mjs`: `mediaNames(out)`; `plan(out, names, state)` puts each film by its bytes, once for the same bytes under two names
  (the fantasia's projection and soundtrack under `film-mothership-1`), and refuses a file that is not the bytes the build named: a key always
  holds the bytes it names. It prints each key's paths.
- The bucket keeps the copies put by path at 14:14Z. This door never reads them; a rollback to a version before this lane still finds them.

## Cost

A seek is two R2 class B reads, as before, plus one read of `media-bytes.json` through the assets per isolate (no R2, no network). The build
hashes the 12 films and songs (200.0 MB) in under a second. Storage: the films by their bytes, 10 objects, 172.6 MB, beside the 12 by path
(200.0 MB); R2 is free to 10 GB.

## Checks

- `node --test worker/ranges.test.mjs`: 7 of 7. New: a re-cut film never plays its old copy. Before its put the bucket is asked only for the new
  cut's key (never the old bytes, never the path) and the door answers null; after it, 206 with the new cut. The Worker's suite: 60 of 60.
- The platform's runtime, before landing (Oct 28 14:4x): this lane's tree in a temporary worktree on the old Mac under `wrangler dev --local`.
  Its assets were the built site with a re-cut: the pitch film's bytes (8,545,788, sha256 8a1dd463) under `/app/saint-seiya.mp4`, named by
  `mediaNames`. Its local bucket held the old cut (20,451,031 bytes, sha256 e2321f14) by its bytes and by its path, and the song by its bytes.
  - Before the re-cut's put: `bytes=4000000-` 200, the re-cut whole (8,545,788 bytes, its sha256), the assets' ETag; no range the same. The
    song: 206 from R2. A film never put: 200 whole from the assets.
  - After the re-cut's put: `bytes=4000000-` 206, 4,545,788 bytes, the re-cut's own bytes from 4,000,000 (`cmp`), its ETag the re-cut's MD5
    (R2). No range: 200 whole. `bytes=9000000-`: 416, `bytes */8545788`.
  - The old cut was never answered. The worktree, its server, its assets and its local bucket were removed after.
- Live, Oct 28 (UTC): landed 14:47:33 (house 97be4cee2); built there 14:48 (1,678 files; `media-bytes.json` names 12 films and songs, 10
  kinds of bytes); deployed 14:48:31, version 48a031a3-0fa4-4d4e-b927-350f13e57ba3, before any put. The mint stays paused (`PREMINT_ENABLED`
  false in the config, availability `enabled: false`).
  - The guard, live before the put (14:48:46): each of the 12 asked `bytes=1000-` answered 200 whole, its full Content-Length, with the assets'
    ETag (none of them R2's MD5), though the bucket held all 12 by their paths since 14:14. The film whole: the build's sha256 (e2321f14).
    For that minute and a half the skip had no ranges; every film played whole.
  - The put, 14:49:22 to 14:50:03: 10 put (the 12 by their 10 kinds of bytes), 0 kept.
  - After it (14:57:58), on https://optimism.fit/app/saint-seiya.mp4: `bytes=0-` 206 with all 20,451,031 bytes, `bytes=16000000-` 4,451,031,
    `bytes=19000000-` 1,451,031, a 100-byte range 100, `bytes=30000000-` 416 (`bytes */20451031`), the plain GET 200 whole, its MD5 its ETag
    (R2). The 12, each fetched whole: its sha256 the build's name for it, its size its Content-Length; its last 4,096 bytes 206.
  - Headless Chrome on https://optimism.fit/app/warm.html: the film seekable 0 to 152 s; Skip to the mint at 4.5 s, and 5 s later the film
    stands at 120.7 s on the drawn arrow, paused, the choice open (the picture judged); no page error. Played from the start, 4.8 to 24.9 s in
    20 s; set to 60 s, on to 70 s; no stall. The 10 kinds of bytes, each from five seconds before its end: `ended` at its full length, no
    stall, no error. One earlier run of the playback check stopped answering at its fourth reading, the film's clock running until then (its
    240 s cap ended it); the run after it passed whole.
  - This deploy also carried main's other landings live: HER COLOURS ON THE MINT (28f8c4bd6, landed 14:37Z) and the paused mint's config.

## Not done

- A browser that already holds an old cut keeps it for a year (the films are immutable): a new cut is still a new URL, the build's own law
  (the Saint Seiya pair's `?v=`). The guard covers the server: the bucket's old copy is never asked for.
- The 12 copies by path of 14:14Z stay in the bucket (200.0 MB), unread by this door; a rollback to 015726d3 or 29d7bee9 still reads them.
  Removing them is his call.
