# From Nefertiti to blue (lane/from-nefertiti-to-blue, Nov 22 2026, seat claude-67824bad)

## Cost

- **The mint page:** one module (dl-side-press.js, 42 lines) and one listener. On a blue press no script a frame: her pentagon is the svg's own animation, the night and the leaving layers are opacity and transform. Then one picture of the canvas (a JPEG over the night, kept in sessionStorage for the one page change): 11 to 12 ms on a phone, 35 to 40 ms on a wide screen.
- **Blue's page:** the ball draws from the Rust kernel the mint page already ships (`app/wasm/embertide-mint.wasm`, 28 KB, in the browser's cache from the mint page), at every screen frame while a draw is under 8 ms, until the bar; nothing after. Its canvas is the window's, as on the mint page. One still (58 KB); the film's bytes (24 MB, the wide cut, on a phone too) and its sound (5.6 MB) only on a press.
- **Red's page:** the still is not asked for; its ball takes the kernel and the screen's frames too. JavaScript net negative: `lab/syrup-optics.mjs` (315 lines, imported by nothing, 229 of its 235 code lines also in `lab/syrup-inside.html`) is out.

## The audit (his Nov 22 2026 "it is a bit clunky and laggy when the move happens... audit performances and shit... optimize for highest fps and leanest code")

Measured in a hidden Chrome at 2x with the page's own frame times (no screenshots: they stall the page), 390x844 and 1440x900, this Mac at a load of 45 to 50.

| | before | after |
|---|---|---|
| The page held by the hand-over picture, phone | 234 to 250 ms (WebP) | 11 to 12 ms (JPEG over the night) |
| The same, wide (2880x1800) | 1,069 to 1,256 ms | 35 to 40 ms |
| The page changes after the press, phone / wide | 2.00 s / 2.84 s | 1.77 s / 1.80 s |
| The move's frames, slow ones (over 20 ms) | 56 to 59 a second, 1 of 50 to 133 ms | 60 a second, none, in 4 runs of 4 |
| Script a frame in the move | her pentagon's points, width and colour | none |
| The whole window repainted in the move | 96 times (the night's colour stepped) | never (two layers, opacity) |
| Blue's ball, draws a second, phone | 21 (the stop's own pace, from JavaScript, 7 to 14 ms a draw) | 56 to 60 (the Rust kernel, about 5 ms) |
| The same, wide | 21 | 27 to 50 (a draw is 6 to 8 ms at 2880x1800, at the edge of the 8 ms rule) |
| Blue's script in its first 8 s at 21 draws a second, phone | 1,604 ms | 769 ms (measured before the ball was let draw at 60) |

- The stall was the picture: Chrome's WebP encoder on the whole canvas, at the instant the page should change.
- Blue's ball was choppy by itself: the page never loaded the kernel the mint page gives the same ball (`warm.js`), and a held sphere draws every third screen frame.
- Left as it is: at the split, with nothing pressed, the mint page's ball redraws about 22 times a second (his glow and the liquor, by its own design): 273 ms of script in 1.6 s. Blue's first 60 to 130 ms is one long task (the ball's set-up), under the still picture, before the ball comes in.

## His words (UTC, Nov 22 2026, to this seat, by the transcript)

- "if people chose stake sol, they gotta see that video ... if people chose tracenet (the red hex vs blue pent) then we gotta show something else, focus on the stake sol one first"
- "stop rushing. we must stay true to the spirit of beauty."
- "we got today the saint seya shit as 1st thing everyone sees ... after that, we got the split between pent-stake-sol and then tracenets-snowtracers-hexred ... you are not fucking mapping the tree of states"
- "pentagons instead are the ones who should be shown the video... you should figure out a proper onboarding there; a proper blending of the video with the blue pents glowing stuff there", with an X over red's road to the video
- a box between "Wishes pull riders" and the first well: "video here instead of right away. reduce exhaustion...", and "do qa frame by frame you will see it is unnevving too much"
- "the intro should be skippable tho... the blue pent one... you gotta make sure it is aligned with what the user is left at from the nefertiti introduction ... make sure the polyhedron the drawing tension of saint seya the swarms and all are aligned dude..."
- "Build this"

## What stood (swarmbook.com, walked as a first visitor in a hidden browser, 390x844)

- Her split and blue's page hold the ball in the same pose and size (yaw 15.184, pitch -0.12). Blue laid it 219 px higher, without the film in its twelve, let the arrow go at once, and asked the swarm with no clock of the sphere's; its canvas was a 406 px box that cut the swarm by a straight line.
- On a phone "Wishes pull riders" flashed for about 0.3 s and went: `@media (max-width:760px){... .am-hero{min-height:0}}` undid his Nov 19 "why the fuck am i seeing glimpses of this from the hero?".
- The ball, the swarm and the anime came in as three pops within a second. No skip.
- The governance film was behind the pool's picture on both sides: first on red's page, a scroll away on blue's.

## What changes

1. **The press on her blue plate** (`app/dl-side-press.js`, `dl-paywall.css` html[data-chose]): 1.75 s on the page. The night comes up behind the ball, red leaves, she steps down, her pentagon goes onto the ball's front pentagon. Then the plate's own address, the query kept, and the ball handed over as one picture. Reduced motion, a new-tab press, no ball, no glyph: the plain link. Back from the side undoes it.
2. **Blue opens on what she left** (`after-the-mint-tree.mjs`, `after-the-mint.html`, `swarmbook-book.css`): the ball on the same pixel, the gold in the twelve, the swarm from the mint's own rest (`mintClockAt` 'leaving'), the drawn arrow held 2.1 s; her pentagon is lit first, then the others, then the arrow is let go and the film runs to its own end as before. The titles come under the ball, and rise to their place at the end.
3. **Skip** on blue: to the light (143 s), so the twelve still rise; where nothing can be sought, the bar. It leaves at the light.
4. **The film in blue's page** (`swarmbook-film.mjs`): at rest its night frame, its ball in a blue pentagon; a press plays it in place with its music, a press pauses it, its end brings the rest back. The film's bytes are untouched. Red's page and the pool's picture have no door to it now.
5. Nothing is laid under the hero before the script speaks, on either side.

## Proven

- **Tests:** `after-the-mint` 10, `dl-side-press` 3 (no script a frame, a JPEG, only opacity and transform in the move's keyframes), `swarmbook-film` 2, `swarmbook` 7, `warm-entry` 7, `dl-athena-film` 11, `dl-kit-deposit` 10, `mint-wasm` 5, `site-files` 4, `worker/premint` 27, `any-room` 11, `no-page-of-its-own` 3, `the-look-is-a-law` 2, `nothing-at-rest` 1, `the-javascript-only-shrinks` 31. Four faults put in by hand were each caught (a Sound press writing the picture's time; blue playing at once; Skip going back; a new-tab press taken).
- **The rule, item 8:** `node --test app/dl-twelve.test.mjs` 21; `dl-twelve.proof.mjs --tap button` PASS and `--tap sphere` PASS on the lane's served page. The film in the page, by real presses: 5.33 s at Sound off, 9.33 s at Sound on (4.0 s of clock), paused and resumed at 12.96 s, at its end 51 s and at rest.
- **The hand-over,** recorded whole at 390x844 (the recorder's stills run at about 17 a second or fewer; the frame rates above are the page's own) and walked by stills at 1440x900: the ball's pentagon stands on the same pixel on both pages (wide: 632,296 before and after). No blank frame between the pages. The steepest half second is the light leaving at the film's end (68 to 40 of 255).
- **The files:** `pageFiles` walks both pages, nothing missing. The whole build was not run here: `submission/demo.mp4` is on the old Mac alone.

## Not done, not proven

- No real phone, no Safari. Sound still stops at the page change, as before.
- The first drop of the page is still a step when the bar stands (the layout changes in one frame, as before).
- The egg's door opened while blue's film plays takes the titles' place; its own look there is main's.
- Red keeps its old start (the jump, the cut swarm); its own road is not designed. Red's page still opens on the pool's picture, now only a picture.
- Failing on main before this lane and untouched by it: `dl-paywall` (harmony-orange), `dl-athena` (THE DEPTH), `warm-sphere-moment` (her cut).

Live at his publish press alone (the old Mac). Supersedes lane/blue-opens-on-the-second-video (never handed).
