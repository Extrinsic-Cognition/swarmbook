# NOTHING OF HIS HOME SHIPS: the site's build refuses a file that names a home folder (lane/nothing-of-his-home-ships, Nov 3 2026)

Seat claude-d03b170c, on the new Mac, in its worktree; the lane cut from main eb27283a5.

## His words

- Nov 3 2026 13:18:38 UTC, while his optimism.fit press ran: "are you exposing the mac's addresses or any other shit through npm on my mac llike risky shit?"
- The rule it keeps: "Public pages never name him or his username" (his word, held in the seats' memory).

## What was read on the live house (Nov 3 13:19 to 13:21 UTC)

- The build his press made on the old Mac (`dist/optimism-fit`, 13:19:37 UTC), searched whole: no LAN, link-local or Tailscale address, no host name of a
  Mac as an address. One file named his home folder: `room/nest-wire.mjs` line 2, a comment `// Spec: /Users/<his user>/code-ec/ec-workspace/...`,
  served live at optimism.fit/room/nest-wire.mjs (28,305 bytes, the line in it); the line has stood in that file since at least Oct 17.
- `127.0.0.1` in 12 shipped files: each page's road to a Nest on the visitor's own machine (every visitor's loopback), not an address of his.

## The cost, first

- JavaScript (THE JAVASCRIPT ONLY SHRINKS): +9 −9, net 0 in 4 files. Row by row:

  | file | change | lines |
  |---|---|---|
  | room/nest-wire.mjs | the spec pointer without the home folder; the empty comment line under it out | +1 −2 |
  | tools/site-files.mjs | outputProblems takes read(p) and names a text that names a home folder (/Users/, /home/, C:\Users\); its doc says so in its two lines | +3 −2 |
  | tools/build-optimism-fit.mjs | the build's read-back passes each output file's text | +1 −1 |
  | tools/site-files.test.mjs | the read-back test carries a home folder and a URL with /home/ in it (named, and not) | +3 −3 |

- The build: one read of each text file of its output (1,615 files on this tree), once per build, before a deploy; nothing at rest.

## Proved (the new Mac, nice 19, the lane's tree)

- `node --test embertide-app/ui/intro/dyson-society/tools/site-files.test.mjs`: 4 of 4.
- The check over everything this tree would ship (planSite and the three pages' walks, 1,615 files): 0 name a home folder; main's `room/nest-wire.mjs` is named.
- `node --test tools/any-room/any-room.test.mjs`: 13 of 13. `node --test embertide-app/ui/intro/room/nest-wire-recovery.test.mjs nest-wire-stall.test.mjs`: 28 of 28.
- No file under the mint (`app/`, `lab/`) changes, so rule 8's proofs are not this lane's.

## Refused once, and why (the lander, Nov 3 13:30:10 UTC)

`embertide-app/ui/intro/room/board-follow.test.mjs` was red: `room/nest-wire.mjs` is in the Board's closure, so the comment's change moved the Board's
stamp. `node embertide-app/tools/publish-board.mjs --commit` stamped generation 001a483a1ed1 (fe275a61a: board.html and board-release.mjs, +4 −4);
the test is 31 of 31 on the lane. No Board was rung: the house serves it when the lane lands.

## The press, pinned (the second part, on his question's "through npm")

- Wrangler is pinned to 4.157.0 (published by Cloudflare's CI with SLSA provenance, the version his live press ran) wherever the site's road spawns it:
  `tools/media-to-r2.mjs` (it ran `npx --yes wrangler`, so the film step took whatever was published last), `tools/premint-refund.mjs`,
  `tools/space-router-tank.mjs`, and the deploy lines in `tools/build-optimism-fit.mjs` and `worker/README.md`; `worker/ranges.test.mjs` pins the
  argument. JavaScript +6 −6 in those files, net 0.
- `worker/README.md` holds the whole press his third run proved (13:19:54 UTC, version 4681c4a1): from the old Mac, telemetry off, the login renewed
  and 90 s waited before the first write (D1 refused, 7403, a write sent within a second of a renewal, twice that day), no `-t` (the migrations take
  their fallback yes, so no prompt outlives the login's hour), and the deploy only once `d1 migrations list` says none is left.
- Done on the machines, not in git: `wrangler telemetry disable` on the old Mac (his press, 13:38:18 UTC) and on the new Mac (this seat, 13:39:00 UTC,
  from the cached copy); the three `wrangler dev` servers left on the old Mac since Oct 28 (ten processes with their workerd children, listening on
  nothing) ended at his `pkill` and this seat's `kill -9`.
- Proved: `node --test worker/ranges.test.mjs tools/premint-refund.test.mjs tools/site-files.test.mjs` 17 of 17; board-follow 31 of 31.

## His, and not here

- The deploy: the fix reaches optimism.fit at his next press; until then the live file keeps the line.
- His Cloudflare account's workers.dev subdomain carries his first name (`optimism-fit.<it>.workers.dev` serves the site; shipped files link to
  `poleis-web.<it>.workers.dev`): renaming it is his dashboard's; the links then move in one lane.
