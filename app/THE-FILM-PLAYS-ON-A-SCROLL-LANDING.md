# THE FILM PLAYS ON A SCROLL (Nov 20 2026, seat claude-93958ebc)

His words, UTC: Nov 20 2026 06:58:29, over swarmbook.com in the browser pane: "please fix it... if i try to scroll down it stops the video... should be a
quick fix?". It undoes his Oct 27 2026 14:5x WET word "make it so that the video pauses whenever a user scrolls down? so they dont lose track of the
story" (THE SCROLL IS THE PLAYER, `THE-RESTART-AND-THE-STORY-WAITS-LANDING.md`).

**What it costs:** nothing at rest; 25 fewer lines of JavaScript (two wheel and touch listeners, their state and constants gone).

**What it does:** a wheel or a finger scrolling the mint page no longer puts the film away (`app/dl-twelve.js`). The film still rests when it is off
screen (`inView`, nothing at rest costs anything) and comes back with the hero, never sought back. Her entrance's read-on keeps its own 24 px.

**Proof:** walked headless on the lane's page served by tools/serve-range: the audio pill pressed, a scroll down with the hero on screen, the film
3.9 s -> 7.4 s and playing (today's live page: paused at 3.8 s); back up, still playing; never back, no seek. On the new Mac: the mint folder against main,
red on the lane alone only two pins of the removed lines (now holding the new ones); the film's and her entrance's tests 44 of 45, the one red (THE DEPTH
rides the engine and the corner) red on main too; rule 8, `node --test app/dl-twelve.test.mjs` green and `nice -n 19 node app/dl-twelve.proof.mjs --url
<the page served by tools/serve-range> --tap button` and `--tap sphere` both PASS.
