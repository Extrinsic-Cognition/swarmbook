# A SKIP THAT WAITS FOR THE FILM: SKIP TO THE MINT pressed in the film's first moments lands when the film can be sought (Oct 29 2026, lane/a-skip-waits-for-the-film, claude-8bbe8998)

**His word:** "Do this task here: “A skip pressed before the film can seek is lost”" (Oct 29 2026, ~17:15 UTC). That was his press on the proposal
THE PATH TO THE KIT made when it found the bug walking the demo path (`THE-PATH-TO-THE-KIT-LANDING.md`, Edges). Behind it, his Oct 28 2026 03:5x WET
ask: "put a visible Skip to the mint on the film from its first second".

## What stood (main, and THE PATH TO THE KIT)

SKIP TO THE MINT stands on the film from its first second. In the film's first ~0.4 s the film has no metadata (`readyState` 0, `seekable` empty).
`startAt` then refuses (rule 5: nothing is sought outside the seekable ranges), and the press was lost:
- `count.skip.film` was false;
- the skip was marked done and hidden for the visit;
- the film played on from 0, with no stop and no entrance of hers.

Measured in headless Chrome on the page served by `tools/serve-range`: a press at 0.36 s, then 45 s of the film playing from 0 with no event of hers.

## What changes

- **`app/dl-twelve-clock.js`, `startWhenSeekable(media, t, then)`:** `startAt` at once when the medium can be sought. Before its metadata, it waits for
  the medium's `loadedmetadata`, once, and is put there then; `then` hears the late answer. It never seeks outside the seekable ranges. The debug
  start already waited this way; the skip did not.
- **`app/dl-twelve.js`:** the skip seeks through it, so `count.skip.film` says `'waiting'`, then `true`. The film's own `seeked` moves the page, as any
  seek does. The clock's import is `?v=skip-waits-1`, so a fresh page never meets a cached clock without the function.
- **Tests:** `app/dl-twelve.test.mjs` adds a behavioural test with fake media. A film that can be sought is put there at once. One already past is not
  sought back. A server that ignores Range gets nothing sought. An early press waits for one `loadedmetadata` (no timer) and lands; a second outside
  the seekable ranges is still refused. The skip's source pins follow the new call.
- **Proof:** `app/dl-path-to-the-kit.proof.mjs` takes `--skip-at <s>`. It presses the skip the moment it stands, `<s>` seconds after the load at the
  soonest, and checks that the film is put just before the arrow (`count.skip.film` true) before walking on to the kit.

## Cost

One listener on the film's `loadedmetadata`, once, and only when the press comes before the film's metadata. Nothing at rest, and no timer.

## Measured

- **The press before the film's metadata, in headless Chrome off every screen.** `nice -n 19 node app/dl-path-to-the-kit.proof.mjs --url <the page>
  --skip-at 0`, on the page served by `tools/serve-range`. The film's request was held back until the trusted press was in:

  | | the press | the film then | the skip then | let through | her landing | the walk |
  | --- | --- | --- | --- | --- | --- | --- |
  | old code (main's `dl-twelve.js`), 1440x900 | 0.46 s | `readyState` 0, at 0 | `false`: lost | | | FAIL at the press |
  | this lane, 1440x900 | 0.29 s | `readyState` 0, at 0 | `'waiting'` | put at 117.67 s, `true` | 29.12 s | 28 of 28 |
  | this lane, 673x873 | 0.23 s | `readyState` 0, at 0 | `'waiting'` | put at 117.84 s, `true` | 28.95 s | 28 of 28 |

  The skip's second is 117.65 s, three seconds before the drawn arrow. Through both of this lane's walks no error was thrown, and the console said
  none. Each walk went on to her making, the rebate and the kit with her picture.
- **A viewer's press still skips as before:** the same walk with no `--skip-at` presses after the film's first two seconds, 26 of 26 at both sizes.
- **Rule 8,** on this lane's page served with byte ranges (`tools/serve-range`, 206):
  - `node --test app/dl-twelve.test.mjs`: 21 of 21, the early press's new test with them.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS. The film never went below its second at the tap (6.01 s).
  - The same with `--tap sphere`: PASS (6.09 s).
- **The page's nearest suites** (dl-twelve, dl-athena, dl-paywall, dl-her-colours, dl-space-router.scene, warm-entry): 88 of 90. The two reds are
  main's own: dl-athena's THE DEPTH, dl-paywall's Harmony ice and accent tokens.

## Edges, said

- A server that ignores Range (python's `http.server`) still gets nothing sought: rule 8's road, unchanged.
- The skip still hides at the press. The press is taken, and the film follows when it can.
- Not deployed. optimism.fit takes this at his word.
