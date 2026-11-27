# THE BEAT ASKS WHAT THE GLASS CAN HOLD

Nov 25 2026 UTC, seat claude-168f7fed, `lane/the-beat-asks-what-the-glass-can-hold`. His words, ~23:1x UTC, over a still of the blue intro of
`swarmbook.com/app/after-the-mint.html?side=pool` (the ball in its blue pentagons, the swarm round it): "we have profund performance fps issues when i
click on the pentagon shit here... please dude it is important we get highest performances".

## The number, before (the live page)

- His glass draws 120 frames a second (8.3 ms each): read in the Claude app's browser pane on the new Mac, where his still was taken.
- On it the ball drew its whole scene 120 times a second, every 8.3 ms, 4.4 to 5.3 ms of script a draw through the film's first 14 s (9.6 at most),
  2.3 to 2.7 after: 58 % of the page's one thread, on a canvas of 1646 x 1924 px.
- A draw is about 7,300 canvas calls: 2,449 fills and 312 strokes of the 156 small balls, 1,853 strokes of the units' links, 1,730 copies of birds,
  511 strokes of the trails, 360 of the ribbons.
- The scene's ceiling, a headless Chrome with its frame-rate limit off on the same Mac while calm (load 10): 137 to 162 draws a second through the
  first 11 s, 208 in the three waves, 279 in the crystal, 110 in the light. So 120 a second had 14 to 35 % of room on a calm M5 Max.
- This Mac is rarely calm. At load 15 (a gate and its compiles) a draw costs 8.4 to 9.5 ms, 11.5 at most.

## The cause (`after-the-mint-tree.mjs`, the beat)

The page asks the ball for a draw itself, by a beat on the screen's frames (Nov 22 2026). It asked at every screen frame while the last draw was
under 8 ms, with no word of how fast the screen is.

- On a 120 Hz glass that is 120 draws a second of a scene that can barely hold them.
- A single draw past 8 ms stopped the asking, and the ball fell to the stop's own pace. There a draw costs more still (fewer draws, a slower core),
  so it stayed. Read with the 8 ms edge kept, at load 15: 25 to 26 draws a second from the film's start for ten seconds, then 60 at second 13.

## What changes

- The beat asks once every 12 ms at most: 60 draws a second on any glass faster than that, every frame on a 60 Hz one, as before.
- It reads the draws' cost blended over the last few, with an edge each way. One late draw flips nothing. Only draws past 12 ms, which no longer
  fit a 60 Hz frame with room, leave the frames to the stop's own pace; they come back under 10.5 ms.
- JavaScript +15 -15: the beat's line and its constants in place, the new test paid by seven lines of its file folded.

## Measured, after (this tree served by `tools/serve-range`, the same pane, the Mac at load 15)

| | before | after |
|---|---|---|
| draws a second, his 120 Hz glass | 120 | 60 in every second of the intro |
| between two draws | 8.3 ms | 16.6 ms, 1,577 of 1,579 |
| script a draw | 4.4 to 5.3 ms | 3.4 to 6.3 ms, 9.1 at most |
| share of the page's thread | 58 % | 29 % |
| room in a frame | 3 ms of 8.3 | 10 ms of 16.7 |

- A 60 Hz glass (headless, to the bar's end): 60 draws a second in every phase, before and after, the Mac at load 52 in the after run.
- `node --test app/after-the-mint.test.mjs`: 11 of 11. The new case was red on main's beat first: "a 4.8 ms scene on a 120 Hz glass: every other
  frame, steady", 120 where 60 are due.
- Rule 8, though no sound is touched: `node --test app/dl-twelve.test.mjs` 21 of 21, and `app/dl-twelve.proof.mjs` on `warm.html` served by
  `tools/serve-range`, both taps (button, sphere): named in the commit.

## The first gate, and Skip's type

- The first hand (4a2b7f9c3639) was refused at 00:14 UTC on Nov 26 for one red: NO LANDING ADDS A FAILING SCREEN, the blue page at 320 x 568 and
  360 x 800, "Skip is 12.0 px (needs 13)". The checker reads the page 28 s after its load, about 3 s after Skip leaves at the light; that gate ran
  with the Mac at load 134, the intro started late, and Skip was still there to be read.
- The same tree through the gate's two halves at 00:4x UTC: green, 0 new failing of 36 cells. So the red was the wait's margin, not the beat.
- The fault it showed is real all the same: Skip's type was 12 px on a phone, where the screens' law asks 13, and it passed only when the checker
  came after Skip had gone. Skip is 13 px now (`swarmbook-book.css`), so the cell passes whenever it is read.

## Tried and taken out

- The birds' two sheets painted whole at their making (3,072 tiles; no write after a copy, where up to 980 came in the first second). The ceiling did
  not move: 136 to 154 draws a second against 137 to 162. Not landed.
- Taking parts of the scene out at the ceiling: no birds +40 %, no small balls +12 to 15 %, no links 0, no glow 0, half the pixels 0. The cost is
  spread across the units, with no one part to cut.

## Owed

- The live half: his glass after the site's deploy. The read here is of the page's own frames in a background tab of his pane, not of what the
  compositor showed.
- 120 draws a second on a 120 Hz glass needs a draw under about 3 ms through the first 14 s. The road: the rite's units (1,728 birds, 156 balls) on
  the kernel's instanced shapes, as the trails, strips and bodies already are off the rite (THE SHAPES ARE RUST'S, Nov 24 2026).
- One frame of 137 ms as the bar stands and the page's words come in under it (style and layout, no script): read, not changed.
