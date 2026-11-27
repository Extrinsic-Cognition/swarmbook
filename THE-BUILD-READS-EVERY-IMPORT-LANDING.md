# THE BUILD READS EVERY IMPORT

`lane/the-build-reads-every-import`, seat claude-93958ebc, Nov 19 2026, cut from main f8e5add42d. Every time is UTC.

## Why

His word at 16:5x, "this is supposed to become the default swarmbook/userprofile thing dude... that is the tracenet", landed at 17:18 as THE KEYBOARD
IS THE TRACENET: a person's page mounts the first door's glass. The site built from that main, walked from its own bytes, hid the scene: the build had
left out `room/house-clock.mjs` (404), which the glass's graph imports from `room/him-rows.mjs`, on the same line as another import:

    import { TAG, covariance } from './splat-rows.mjs'; import { createHouseClock } from './house-clock.mjs';

The build's walk (`tools/page-files.mjs` specifiers) read an import or export only at a line's start, so a second statement on a line was never seen.

## What changed

- `tools/page-files.mjs`: a statement is read at a line's start or right after one that ended on its line (`'...';`, read by a lookbehind so the first
  match does not swallow the second's marker). Two lines changed in place.
- `lab/one-page.test.mjs`: its walk test gains `import {c} from './one.js'; import {d} from './two.js';   import './three.js';` on one line, all three
  read; a comment and a doc line still are not. Three lines changed in place.
- JavaScript: net 0.

## What the build ships with it, against main's walk

| page | more files | fewer |
|---|---|---|
| `app/tracenet.html` | `room/house-clock.mjs` (404 on the live site today) | none |
| `app/after-the-mint.html` | `room/house-door.mjs` (already served: 200, by another page's walk) | none |
| `app/warm.html` | `app/after-the-mint.mjs`, `app/after-the-mint-tree.mjs` (in `app/`, which ships whole by `site-files.mjs` already) | none |

So the deploy changes by one file.

## Read on the new Mac

Scratch trees at 4d582abee3 beside main f8e5add42d; node under `tools/dead-tasks/bounded.mjs`, nice 19.

- The mint folder's tests (`app/*.test.mjs worker/*.test.mjs tools/*.test.mjs lab/*.test.mjs`, four at once, `lab/one-page.test.mjs` among them):
  1188 tests, 1173 pass, 13 red, 2 skipped on the lane and on main, the same thirteen names.
- `room/house-door.test.mjs` 3 of 3 on both; the welcome's door test 3 of 3; `room/laptop-glass.proof.mjs` PASS.
- **Rule 8** (the lane is under the mint's folder and changes no page with a picture and a sound): `node --test app/dl-twelve.test.mjs` 21 of 21. On the
  lane's tree served by `tools/serve-range`: `nice -n 19 node app/dl-twelve.proof.mjs --url http://127.0.0.1:18997/dyson-society/app/warm.html --tap
  button` PASS and `--tap sphere` PASS ("the sound came in where the picture was, and the picture never went back").
- The JavaScript law in the lane's tree: +5 -5, net 0, green.
- On the MacBook, the walk over `app/tracenet.html` with the lane's `page-files.mjs`: 80 files, `room/house-clock.mjs` among them (79 without it on main).
