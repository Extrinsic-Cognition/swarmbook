# The hexagon path (lane/the-hexagon-path, Nov 22 2026)

## Cost

- **At rest:** one module (`app/dl-hexagon.js`, 231 lines, three light imports), one sheet (43 lines), one click listener. The heavier pieces are the page's own modules, asked for again (already loaded) as she offers her egg.
- **The press and the dive:** no script a frame. Five drawn hexagons, her egg, the night, and in the dive the ball itself, are layers that move by transform and opacity on the compositor. The ball is not drawn from the dive to her Enter (the glow under her making drew it 30 times a second on the old road).
- **While she is coloured:** her portrait's own painter, staged once (one hidden WebGL canvas, as a depositor's), one drawing after each colour is let go; it rests between them. One more `<video>` on the film the page already plays, muted, loaded to the drawn arrow.
- **After Enter:** the sphere's own draws, on the film's frames, for 23 s; then nothing (below).
- **JavaScript:** +315 -609, net -294 on main of Nov 22 2026 17:3x UTC. `lab/mint-freeze-navigation.mjs` and its test (562 lines, `createMintFreezeNavigation`) are out, with the one test of `mint-freeze-layout.test.mjs` that used it: no page, tool or module reaches it (two dated docs name it). The first payment, `lab/mint-freeze-environment.mjs`, went on main by another lane meanwhile. `no-landing-adds-a-failing-screen.sh`: 36 cells judged, 0 new failing.

## His words (UTC, Nov 22 2026, relayed by the seat that handed this lane)

- over a first version of red's press beside blue's: "you cant compare the quality of the pentagon path vs this hexagon path... it is so fucking suboptimal dude"
- over a moving draft of this path, filmed on the real page: "Yes, build it"

## What it does

1. **The press** on her red plate while her egg is offered (`app/dl-hexagon.js`). The words fade, a red night comes up behind the ball and settles, blue leaves as red leaves on blue's press, she steps down, and her egg stays where her hands held it, then lifts. The plate's hexagon goes round the archer, turned 30 degrees and no more, sized from the star circle the sphere is drawing on that glass (`roundOf`), white to red; the egg comes in; it lands with a swell of light.
2. **The dive.** The ball comes forward, the hexagon's edges pass the glass, the inside darkens, and her making stands behind it with its own fade: no white and no ドン over it, nothing given, made or paid (`dl-athena.js`: her entrance ends 'handed', egg 'free', `S.given` as it was). One egg: it arrives on the egg her making's own entrance shakes, at its size and place, and its light leaves it there.
3. **Enter the world.** Her making says 'world' on this path, never 'made' (`dl-her-colours.js`), so the freeze, the governance card and her portrait's second drawing never hear it: `dl-space-router.js` needed no line. The archer stands close, the hexagon comes back round him and holds; the arrow is let go in a flare, on a second muted copy of the film and with the swarm on that copy's seconds, as blue does it; the ball opens into its hexagons, and her face lands in the middle, its rim gold. The film's motion ends at 143.8 s and everything rests.
4. **Two plates** in the split's own lettering and slashes: POST YOUR FACE / ON X, a link to X's compose page with the link to her (`herLink` alone: the reel's caption speaks of a dance and a reel, and there is none here), opened by the visitor in a new tab; RIDE / DOWNLOAD HARMONY, a plate that is no link and takes no press. Beside the ball on a wide glass, under it on a tall one.
5. **The page is given back** as the freeze's own press gives it: with the plates, a first visit is no longer held at the top (`data-on-track` leaves) and the page scrolls; the ending is laid on the hero, so it rides away with it. The film's controls come back at rest, on the night's colours. The wall still holds the page's own film where it stood; its word no longer moves the ball.

Back by the browser's cache before her egg is handed over: the split as she left it. Reduced motion, a new-tab press, no offer, no ball, no making: the plate's plain link.

## What differs from the draft he saw

- The draft showed two eggs for about 0.3 s as her making opened; here there is one.
- At the arrow the swarm jumps to the hexagons in one frame (the sphere's own, the window leaving); in the draft it showed, here a golden flare is whole on that frame.
- The swarm is the film's after the arrow: about 8 s on it is loosed into her face, and the ball rests as clean hexagons. In the draft it stood still.
- The plates no longer stand on the ball's edge, and the ball is a little smaller for it on a wide glass.
- The hexagon round the archer, close, is the same hexagon as round the ball, scaled (the draft drew a smaller one by hand). Her stage keeps its own hexagon, over the dark ground instead of under it.

## Measured (the page's own frame times, no recorder, headless Chrome, this Mac at a load of 21 to 24)

| | wide 1440x900 | phone 390x844 at 2x |
|---|---|---|
| The press move, 2.5 s | 60.0 a second, 0 slow | 60.0, 0 slow |
| The dive, 1.5 s | 56.0, 1 slow (117 ms) | 56.7, 1 slow (100 ms) |
| Her making's entrance, 5.5 s | 59.6, 1 slow | 59.3, 2 slow |
| The ending, 5.2 s | 53.1, 25 slow (worst 83 ms) | 60.0, 0 slow |
| The film on, 3.8 s | 60.0, 0 slow | 60.0, 0 slow |

- Slow is over 20 ms. The same runs at a load of 58 to 60, before the last touches: the press 60.0 and 0 slow on both; the ending 53.1 (24 slow) wide and 59.0 (3 slow) phone.
- The dive's slow frame is her making being built (its DOM, then its renderer), one task on the main thread; the layers on the screen run on through it, and its renderer is met once in the still beat before (`warm`).
- The wide ending's slow frames are the sphere's own draws as the window leaves with the film moving: 411 ms of 1,300 were the glow's upload of each film frame (`dl-mint-flask.js` aura), 398 ms the swarm. Not this lane's code, and blue's ball draws 27 to 50 a second there by its own receipt. The rim, the flare, her face and the plates are layers and do not wait for it.
- At rest, both sizes: 0 frames asked in 3 s, 0 draws, no animation running, no interval, every video paused (the second copy at 143.8 s), no price, seat or deposit word on the glass, the page scrolled (860 and 916 px).

## Proven

- `dl-hexagon` 8 tests; 21 faults put in by hand, each caught.
- Green: `dl-side-press` 3, `dl-athena-film` 11, `dl-athena-layer` 2, `dl-her-colours` 23, `dl-her-portrait` 9, `dl-her-reel` 12, `after-the-mint` 10, `swarmbook` 7, `swarmbook-film` 2, `swarmbook-board` 4, `swarmbook-floor` 12, `warm-entry` 7, `dl-kit-deposit` 10, `site-files` 4, `mint-wasm` 5, `dl-harmony-doors` 4, `dl-space-router.scene` 5, `dl-twelve` 21, `dl-visit` 3, `dl-lyssajudron` 12. Red on main and untouched here: `dl-athena` (THE DEPTH), `dl-paywall` (harmony ice), `warm-sphere-moment` (her cut), `lab/one-page` (3).
- **The rule, item 8:** `dl-twelve.test.mjs` 21; `dl-twelve.proof.mjs --tap button` PASS and `--tap sphere` PASS on the lane's served page (byte ranges). The path reads the film's address and nothing else of it.
- **In a real browser:** undone by a restored `pageshow` at 0.9 s and in the dive, then pressed again to her making; a new-tab press left alone; an Enter 7 s after her making opened (her face was drawn in time); 1440x900, 390x844, 1024x768 and 1920x1080 filmed and looked at.

## Not done, not proven

- No real phone, no Safari, no Firefox. A retina wide screen was not measured (the runs are 1x wide).
- A glass in a hurry: the main thread held by a loaded Mac (load 80 and more) delays the timed beats (the dive, her making, the arrow); the layers between them still move.
- The door of RIDE, and the picture itself on X: X's compose page takes words, so her face goes as the link to her.
- `ds-invite` (the invitation pill) stays hidden after the ending. The page below the hero is the page as it was.
- Enter pressed before her painter has staged (about 4 s after the first press in her making): her face lands when it is drawn, after the ball has opened.
- The whole site build was not run here.

Live at his publish press alone.

## Reviewed by seat claude-1c9400fb (Nov 22 2026 UTC), filmed again from the page, nothing injected, 1440x900 and 390x844

- The egg shrank to the press's size for about 100 ms on a wide screen: its move ended on the instant her making is built, and the browser fell back to the older fill until the page was free. The move now stands on at its end through the hand-over.
- The ending's ball fills .4 of the window's height on a wide screen, as the draft's did nearly (it stood at about .32); the plates' lettering gives it the room. The plates' slashes stand behind the names.
- The sound proof again after this, on the page served with 206: `--tap button` and `--tap sphere` both PASS.
- On the merged tip b63e07e0a9 (the page served with 206): `node --test app/dl-twelve.test.mjs` 21 of 21; `dl-twelve.proof.mjs --tap button` PASS, `--tap sphere` PASS. Handed on his "Hand both lanes" (Nov 22 2026 UTC).
