# THE WALL WAITS FOR THE HAND: the wall's introduction starts at the visitor's own scroll, never by itself (Nov 24 2026, lane/the-wall-waits-for-the-hand, claude-73a178b3)

## His words, UTC

- **18:23:45** "why the fuck is the swarmbook website constantly flashing? is it unoptimized as fuck vomit shit?"
- **19:55:13** "Yes, only on scroll", to "Make the wall's intro movie play only when the visitor scrolls, never by itself?".

## Cost first

The wall page (`app/index.html`) served from the tree, reading devnet, desktop Chrome headless on the new Mac, untouched for 40 s, then one turn of
the wheel:

| | main (b12c7f0af0) | this lane |
|---|---|---|
| untouched, the page's scroll at 4, 8, ... 40 s | 63, 221, 378, ... 1,481 px: the movie playing by itself from 1.2 s, scrolling the page | 0 at every read: nothing plays |
| one turn of the wheel | | the movie starts on it: playing, at 0.14 of its length 6 s later |
| script | | +1 -1 (net 0) |

## What changed

- `app/wall.js`: the slope is installed with `autoStart:false`. The self-start was `slope.js`'s default since the mint page came into the house (Oct 12
  2026, "the version he approved, as found": "The first descent starts by itself: once the assembly is ready and the page still rests at the chamber,
  a beat, then the film"); his word of today replaces it. A reload mid-story no longer resumes the film by itself either.
- Unchanged: on the visitor's downward scroll the film plays at its steady pace to its end, is skipped by "Skip to the civilizations", or lets go when
  the hand reverses (slope.js, as before).
- `app/index.html` asks for the new `wall.js` (`?v=hand-1`).

## The gates

- Rule 8 (a change under the mint's folder, none of the mint's own): `node --test app/dl-twelve.test.mjs` 21 of 21; on this lane's tree served by
  `tools/serve-range` (206), `nice -n 19 node app/dl-twelve.proof.mjs --url <served>/dyson-society/app/warm.html --tap button` PASS and `--tap sphere` PASS.
- The site's tests that read the wall (`after-the-mint`, `assembly-dive`, `riders`, `swarmbook-floor`, `site-files`): 45 of 45.
- `the-javascript-only-shrinks.test.mjs` 37 of 37 (net 0); `the-law-is-the-gate.test.mjs` 8 of 8; `no-landing-adds-a-failing-screen.2.sh` green.
- No gate yet on a page moving by itself: the measure it waits for is the wall's scroll and frames untouched for 40 s after load, read by the screens
  gate (0 px, no film); today it is read by hand (ec-workspace `docs/the-order-book-is-the-multiplayer-server-2026-11-23/the-walls-balls-on-the-gpu/untouched.mjs`).
- Not published: swarmbook.com serves what was deployed.
