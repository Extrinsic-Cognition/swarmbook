# THE FILMS KEEP THE SITE'S HEADERS (Oct 28 2026, claude-cc7b2f4f)

Lane `lane/the-films-keep-the-sites-headers`, cut from origin/main b45cb10ac, after `THE-FILMS-FROM-R2-LANDING.md` and
`THE-FILM-BY-ITS-BYTES-LANDING.md` (beside this one).

## His words

- Oct 28 15:2x WET, asked whether all was fixed, over the regression found then: "Yes: make the films served from R2 carry the same headers
  the site gives them (cache, noindex on the submission videos, nosniff), prove it live, and hand it."

## Why

The site's `_headers` lines (written by `tools/build-optimism-fit.mjs`) are applied by the assets. An answer the Worker made from R2 carried
none of them: only the object's own type and cache. So from 14:15Z (THE FILMS FROM R2) the submission's two videos lost `X-Robots-Tag:
noindex` and the site's short cache, and took the object's year-long `immutable` instead. Every film also lost `X-Content-Type-Options:
nosniff` and `Referrer-Policy`. Live at 15:2x: `/submission/demo.mp4` answered with only `cache-control: public, max-age=31536000,
immutable` and its ETag.

## The change

- `worker/ranges.mjs`: `mediaFromR2(request, bucket, pathname, names, site)`. R2's answer carries the headers the site gives that film:
  `site()`, [name, value] pairs, the assets' own answer (its type, its cache, its `_headers` lines). Only the headers its bytes decide are R2's
  own: Content-Length, Content-Range, ETag and Accept-Ranges; Content-Encoding, Transfer-Encoding and Last-Modified are never taken. The object's
  stored type and cache are no longer read. A site whose headers cannot be read gives null, and the assets answer, whole.
- `worker/premint.mjs`: `siteOf` asks the assets for a film's headers with a HEAD, once per film per isolate, and only for a film R2 holds by
  the named bytes. A failed read is read again next time.

## Cost

One HEAD through the assets binding per film per isolate (internal: no R2, no network). R2 reads as before.

## Checks

- `node --test worker/ranges.test.mjs`: 8 of 8. New: the films keep the site's headers. The submission's noindex and short cache override the
  object's year; nosniff and the referrer policy stay; the ETag and length are the bytes' (206 900, 200 1000, 416 none, HEAD 1000); a site's
  Content-Encoding and Last-Modified never pass. Unreadable site headers send the film to the assets, and the site is asked only for a film R2
  holds. The door: the names and each film's site headers read once; an unreadable HEAD sends the film to the assets, then is read again. The
  Worker's suite: 64 of 64.
- The platform's runtime, before landing (Oct 28 15:3x): this lane's tree in a temporary worktree on the old Mac under `wrangler dev --local`,
  the built site as its assets, the local bucket empty, then holding the film and the demo by their bytes (each object saying a year). Each film
  asked `bytes=1000-`, first answered by the assets (the bucket without it), then by R2.
  - The `_headers` lines reach the Worker's fallback through the assets binding: the assets' answers carried them.
  - `/app/saint-seiya.mp4`: R2's 206 carried the assets' own headers: immutable for a year, nosniff, the referrer policy, `video/mp4`.
  - `/submission/demo.mp4`: R2's 206 carried `x-robots-tag: noindex`, nosniff, the referrer policy and `cache-control: public, max-age=0,
    must-revalidate`, the assets' answer to the HEAD. The assets' own range answer under `wrangler dev` carried no Cache-Control. Production's
    assets give `public, max-age=0, must-revalidate` to every file without a rule (live at 15:3x: `app/warm.html`, `submission/index.html`, an
    image), so R2's answer is the one the site gives.
  - `/app/warm-media/fantasia-1/galaxy-desktop.mp4`, never put: the assets' answer, whole. Its Cache-Control is the platform's join of the two
    rules matching it (`/app/*.mp4` and `/app/warm-media/*`): `public, max-age=31536000, immutable, public, max-age=31536000, immutable`; R2's
    answer, once the film is put, carries the same.
  - The worktree, its server, its assets and its local bucket were removed after.
- Live, Oct 28 (UTC): landed 15:46:08 (house 13dac166d); built there, the put 0 of 10 (every film already in the bucket by its bytes);
  deployed 15:46:49, version 97c589c1-a867-4b5f-82f1-617e1ff23989. The mint stays paused (availability `enabled: false`).
  - Each of the 12 asked `bytes=1000-` (15:47:04): 206 from R2 (its ETag the bytes' MD5), with the site's headers. The Saint Seiya film
    and song: `public, max-age=31536000, immutable`, nosniff, the referrer policy, their type. The fantasia and galaxy films and songs: the
    platform's join of their two rules, immutable twice, nosniff, the referrer policy. `/submission/demo.mp4` and `pitch.mp4`:
    `x-robots-tag: noindex`, `public, max-age=0, must-revalidate`, nosniff, the referrer policy.
  - The film's ranges: `bytes=0-` 206 with all 20,451,031 bytes, `bytes=16000000-` 4,451,031, a 100-byte range 100, `bytes=30000000-` 416
    (`bytes */20451031`), the plain GET 200 whole (MD5 2d3641f6, the film's), a HEAD 200 with its Content-Length and nosniff.
  - Headless Chrome on https://optimism.fit/app/warm.html: the film seekable 0 to 152 s; Skip to the mint at 4.8 s, and 5 s later the film
    stands at 120.7 s on the drawn arrow, paused, the choice open (the picture judged); no page error.
  - This deploy also carried main's landings since 14:48 live, among them THE MINT GLASS READS THE ROOM'S PIN (6b164ec07).

## Not done

- The fantasia and galaxy films match two `_headers` rules (`/app/*.mp4` or `/app/*.m4a`, and `/app/warm-media/*`), so the platform joins
  their Cache-Control twice. It means the same as once; one rule in the build would make it one line.
