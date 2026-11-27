# THE FILMS ANSWER RANGES (Oct 28 2026, claude-cc7b2f4f)

**Where it stands (Oct 28 14:0xZ): rolled back. The films are served whole again and the skip does not seek, as before this lane.** The third
cut worked on short checks and then, on the live site, cut every open range short: `bytes=0-` (how a browser starts a film) stopped after
221,184 of 20,451,031 bytes and `bytes=16000000-` gave 0 bytes, so a film stalled seconds in. The same Worker under `wrangler dev` on the old
Mac (the platform's runtime, no production limits) answered all of them whole (4,451,031 bytes for `bytes=16000000-` in 0.09 s): the cut in JS
(every chunk of the film through a TransformStream, read from its head) runs past the Worker's per-request CPU limit in production, most likely
the Free plan's. Rolled back to version 97c79548 (the films asset-first, whole) minutes after it was seen; then the media came out of
`run_worker_first` on main, so no later deploy brings the stall back. The range code and `media-sizes.json` stay, unused by the films.

The road for a seek that works: a native cut, not a JS one. The films in R2 (the `optimism-fit-vault` bucket exists), read with a range
(`env.VAULT.get(key, { range: request.headers })`: R2 cuts the bytes itself, no chunk passes through JS), the Worker answering 206 from the
object's range and size; or a Workers plan whose CPU limit a JS cut fits (his call, it is paid).

Lane `lane/the-films-answer-ranges`, cut from origin/main 57f4d4a49.

## His words

- Oct 28 13:3x WET, after the first deploy of the choice at the freeze, when I showed him the skip doing nothing on the live site: "Yes: make the
  optimism.fit Worker answer Range requests for the films with 206 Partial Content, prove the skip seeks on the live site, and hand the lane."

## What was wrong (read live, Oct 28 13:3x)

- optimism.fit answered `Range: bytes=0-1023` on `app/saint-seiya.mp4` with `200` and all 20,451,031 bytes: the platform's assets
  (`env.ASSETS.fetch`, the Worker's last door) never answer a part.
- So Chrome held the film unseekable (`seekable` 0 to 0). "Skip to the mint" (`app/dl-twelve.js` skipToMint, a seek 1.2 s before the drawn
  arrow) hid its pill and left the film playing from where it was: a headless watch saw it play from 5 s to 65 s after the press. The film still
  reached the stop by itself, 115 s later, and the slam opened (the wall holds the film by pausing it, no seek).
- At home every page was served with byte ranges (the scratch servers, the lander's own serve), so no proof ever saw it.

## The change

- `worker/ranges.mjs`: `parseRange` (one span, an open end, a suffix; past the end unsatisfiable; several ranges, not bytes, or malformed: the
  whole answer), `sliceStream` (the bytes asked, read from the stream's head, the source cancelled once past the end), `withRanges` (a whole 200 of a
  known length, not content-encoded: a GET's one range is 206 with Content-Range and Content-Length, past the end is 416 with `bytes */size`, every
  whole answer says Accept-Ranges: bytes; a 206 the assets made, a 304, an error, a compressed body or an unknown length pass as they came). In the
  Workers runtime the cut body runs through a `FixedLengthStream`, so the 206 keeps its Content-Length.
- `worker/premint.mjs`: the asset door is `withRanges(request, await env.ASSETS.fetch(request))`.
- `wrangler.optimism-fit.jsonc` (the second cut, after the first landed and deployed at 13:4x and the live film still answered 200): the platform
  serves a request that matches an asset itself and never wakes the Worker, unless `run_worker_first` names its path. It named only the front
  doors, the premint doors and the vault. It now names the media too: `/*.mp4`, `/*.m4a`, `/*.mp3`, `/*.webm` ("*" matches deep, per the
  platform's docs, Workers > Static Assets > Configuration and Bindings, read Oct 28). The pages and their code stay asset-first.
- The third cut, after the second landed and deployed at 13:47Z: `wrangler tail` showed the film's requests now reach the Worker, and the Worker
  still answered 200, because inside a Worker the assets answer a film with no Content-Length (a HEAD neither): read through a throwaway Worker
  under `wrangler dev` on the old Mac, the platform's own asset code, never deployed. So `tools/build-optimism-fit.mjs` writes `media-sizes.json`
  at the site's root, {pathname: bytes} for every film and song it ships (`MEDIA` in ranges.mjs), and the asset door reads it once an isolate and
  hands a film's size to `withRanges` when the assets tell none. No sizes built: the whole answer, as before.

## Cost

A seek reads the film from its head up to the end of the asked range, inside Cloudflare (the asset store has no seek): a seek near the drawn arrow
reads about 16 MB of the 20 MB film once per range Chrome asks; playback from the start reads what it plays. At rest: nothing. A cheaper road, not
taken here: the films in R2 (the `optimism-fit-vault` bucket exists since 13:26Z), whose reads take a range natively.

## Checks

- First cut (09bd0ed87) landed 13:41Z and deployed (version 97c79548) from the house at 118e86071; the live film still answered a range with 200:
  the asset was never routed to the Worker. Hence the second cut.
- Second cut (325edae9d) landed 13:46Z and deployed (version bad8e6d9) from 6db36c694: `wrangler tail` showed the film reaching the Worker and a
  200 answer; the assets told the Worker no length. Hence the third cut.

- `node --test worker/ranges.test.mjs`: 6 of 6 (the parser; 206, 200, 416 and HEAD; what passes as it came; a slice across chunks exact and an
  endless source let go past the end; the Worker's own asset door answering a seek; every film and song under `app/` and `submission/` reaching
  the Worker first, the pages and their code asset-first; the size handed in makes the 206 when the assets tell none; the asset door reading the
  sizes once an isolate, and the whole film without them): 8 of 8. The Worker's suite: 61 of 61. The four tests that run the build (dl-harmony-
  doors, tracenet, dl-paywall, lab/one-page): 50 of 54 on this lane and on a clean main alike, the four reds main's own.
- Seen in headless Chrome off every screen, through this Worker in front of assets that answer like the platform's (always 200, the whole file):
  `bytes=16000000-16000099` is 206 `bytes 16000000-16000099/20451031`, `bytes=30000000-` is 416; the film's `seekable` is 0 to 152; Skip to the
  mint pressed at 5.6 s, and 5 s later the film stood at 120.7 s, paused on the drawn arrow, the choice open.
- On the live site, first look (it did not hold; see the top of this receipt): (the third cut, 356a4b2d4, landed 13:56Z; built and deployed from the house at d7c0e1cfb, version 0227aa44-32c3-459e-a8cf-feeae20a5b1a; its
  media-sizes.json holds the 12 films and songs): `bytes=16000000-16000099` of the film is 206 `bytes 16000000-16000099/20451031`, and those
  bytes are the film's own (bytes 1000 to 1099 hash the same ranged and cut from the whole); past the end is 416 `bytes */20451031`. In headless
  Chrome on optimism.fit the film's `seekable` is 0 to 152 (0 to 0 before), and Skip to the mint pressed at 5.1 s had the film standing at
  120.7 s, paused on the drawn arrow, the choice open, 5 s later; no page error. Before the fix the same press left the film playing on.
- On the live site, second look (14:0xZ), after a headless watch stalled at 119.5 s: `bytes=16000000-` 206 with 0 bytes, `bytes=19000000-` 206
  with 0 bytes, `bytes=0-` 206 cut at 221,184 bytes. Rolled back (`wrangler rollback 97c79548`): the film 200 whole, 20,451,031 bytes, for a
  plain request and for `bytes=0-`. Under `wrangler dev` on the old Mac the same code answered every range whole.
