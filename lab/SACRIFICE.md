# THE SACRIFICE: the one who intercepts the hit, cut out of the film and standing large over his second (`sacrifice.js`; Oct 15 2026, 00:3x to 02:4x WEST, lane `lane/sacrifice`)

## His words

- **Oct 15 2026 00:27 WEST**, over his page at about 10.8 s (the red dodecahedron, the shield closed, the swarm on it): "i need you to
  segment out and enhance the sacrifice here again of aiolos one second time: (the guy that savees the hit)"
- **His tag on the film at 10.835 s** (the Nest ref mint/seiya-tags, rev 1; cuts.js TAGS_AT_REV_1): "THIS MOMENT IS FUCKING CRITICAL DUDE!
  THIS IS THE MOMENT OF SACRIFICE!!!!"
- **Oct 14 13:0x WEST**, over the hero paused at 12.7 s: "that exact moment where he intercepts the hit needs to be slowed down like fucking
  slow-mo dude"
- **Oct 14 13:4x WEST**, having heard a slow-mo of the film and its song: "it is awful dude. you cant slow down the audio it morphs like
  shit... but the animation is epic.. cant you just keep the animation ongoing for longer? natural speed... longer duration of the animation
  more fluid..." (that slow-mo was taken out: hero-ab.html THE SLOW-MO; commit c51dbd1a built it)
- **Oct 15 2026 02:1x WEST**, over the page at about 11 s, after the first cut landed (aacc1aa2): "are you sure it is well timed? cant you
  upscale it? it is super blurry dude"

## The reading

The film and its song keep their own speed, always (THE SOUND NEVER RESTARTS THE PICTURE, `app/dl-twelve-clock.js`; the house `CLAUDE.md`,
The rule, item 8). The one who intercepts is cut out of the film's own frames (segmented), enhanced, and stands on the page as his own figure
for one second, while the film runs on underneath. The film, the song, the faces, the burst and the shield are untouched.

The first cut (aacc1aa2) spread his twelve frames over the second, each held a twelfth: he was right that it was not well timed. The figure
trailed the film (cel 322 shown while the film was on 326) and stood 0.6 s into the next shot. THE FIGURE IS NOW LOCKED TO THE FILM: on
each film frame 319 to 330 the cel shown is that very frame, cut out of it as the film presents it, at the film's own speed; at the cut to
the hit cel 330 holds over the burst for the rest of the second. Nothing is replayed slowly and nothing trails.

## The frames (saint-seiya.mp4 ?v=53561d47, 960 x 540, 30000/1001 fps)

| frame | second | |
|---|---|---|
| 316 to 318 | 10.544 to 10.611 | he flies in from the left: a motion-blurred streak tangled with Seiya and the purple cliff; no figure of him alone in these frames |
| 319 | 10.644 | he stands in front of Seiya with his arms spread: THE SECOND BEGINS; cel 319 on frame 319, at a quarter (in over three frames) |
| 319 to 330 | 10.644 to 11.044 | ONE HELD CEL on film: the same drawing in every frame, only the blast's light on him changes (the strike's white flash on 324 to 326). On the page: cel n on frame n, each frame's own |
| 324 | 10.811 to 10.844 | his tag (10.835 s) falls on this frame |
| 325 | 10.844 | the still under reduced motion |
| 331 | 11.044 | the cut to the close-up of the hit landing on his armour: the hero's first burst (hero-ab.html BURSTS[0]); cel 330 HOLDS over it |
| 347, 348 | 11.578 to 11.645 | he goes: three quarters, a quarter |
| 349 | 11.645 | THE SECOND ENDS (30 film frames from 319): he is gone; the layer's pixels, cut-outs, rim and glow released |

The brief said 10.54 to 11.6 s; the second runs from frame 319 (10.644 s) because the fly-in frames hold no clean figure of him (below),
so it starts on the first frame he stands, and it is 30 film frames long, to the end of frame 348 (11.645 s).

## The matte (`tools/film-matte.swift`): Apple Vision, then the held cel

`VNGenerateForegroundInstanceMaskRequest` on each frame (macOS 15.7.3) gives one instance a frame, always the one under the point asked
(his chest, 0.68 across, 0.62 down). What it lifted, frame by frame (Oct 15 2026 00:4x WEST):

- 316 to 318: one blob of him, Seiya behind him and the purple cliff over his head (the box 358 x 459 reaching y = 76): not a matte of him.
- 319, 320, 322, 323, 327, 328, 330: him whole (head, both arms, the cape, both legs).
- 321: him plus the cliff over his head (the box reaching y = 108); 319 to 321 also take Seiya's hair at his left.
- 324, 325, 326, 329: his legs lost to the strike's flash (the box 167 to 232 px tall against 302 to 313).

Since 319 to 330 is one held cel (the box's corner stays at 493 to 495, 219 to 220 wherever the legs are kept), the matte is the cel's:
`--union 327,328,330` (the clean frames' masks united) with `--fill` (the holes a mask leaves inside the figure, the boots' dark, closed
with their soft rings), applied to every frame. Checked by eye on 319, 321, 323, 325, 327 and 330: he is whole on each, nothing of the cliff,
nothing of Seiya outside his silhouette (in 319 to 321 Seiya is behind him and the film's own pixels inside the silhouette are his). Keying
by colour was not needed. The box: [494, 219, 352 x 313], padded by 4 to [490, 215, 360 x 321].

Shipped: `lab/sacrifice-masks.png`, 360 x 321, gray with alpha (white, the matte as its alpha), 17,992 bytes, one cell. No film pixel is in
it; the page composites the figure from its own film. The frames and cut-outs the tool writes hold the film's pixels and stay out of git.

## The second (`sacrificeAt`, pure, a function of the film's frame)

- `frameAt(t)` is the film's frame on screen at second t (the frame whose time is at or before it, with a microsecond's grace: Chrome
  writes media times in whole microseconds, so frame 319's time comes as 10.643966, a hair short of 319 / 29.97).
- Frames 319 to 330: the cel is the film's frame. Frames 331 to 348: cel 330, held (`hold`). Before 319 and from 349: off.
- The fades are frames too: in over the first 0.1 s (319 at a quarter, 320 at three quarters, whole from 321), out over the last 0.1 s
  (347 at three quarters, 348 at a quarter). One alpha a frame, so a pause or a seek lands on the same picture.
- On the page the clock is the film's frame callback (`requestVideoFrameCallback`): each presented frame of 319 to 330 cuts its own cel from
  that very frame and draws it on that frame. While the film plays a `timeupdate` never draws (its clock runs ahead of the frame on screen);
  it only asks for the frame callback near the second and hides what a jump left behind. Paused or sought onto a frame of 319 to 330, the
  film shows that frame and its cel is cut from the film itself. Paused or sought into the hold with cel 330 never presented, the helper
  film seeks once to frame 330. A frame the film drops while playing is never stood in for in 319 to 330: the next presented frame brings
  its own cel; in the hold the last cel presented holds.
- `sacrifice.test.mjs` holds it: for every presented frame 319 to 330 (half with a microsecond-short media time) the cel drawn is that frame
  and is cut from it; at every millisecond of 319 to 330 the plan's cel is the film's frame; 331 to 348 show 330; 349 is off.
- Where: large at the sphere's centre-right, 2.4 sphere radii tall (the matte's shape kept), his centre 0.35 radii right of the sphere's and
  0.1 below (SACRIFICE.height and SACRIFICE.at are the two knobs). On the hero at 1440 x 900 (the stage 1205 x 900, the sphere's radius 180):
  432 px tall, 485 wide, his centre at (725, 468) of the stage.
- Over the theater's burst (11.044 s) and the shield's shatter (the canvas after the raid's, `hero-anti-satellites`), under the page's
  controls and the sound bubble (z-index 4). The stage's layers as the hero stands: genesis-sphere, hero-dark, hero-theater, hero-box,
  hero-front, hero-anti-satellites, **hero-sacrifice**, hero-ko-edge, then the page's own.
- prefers-reduced-motion: one still cut-out (frame 325), whole (no fade), drawn once it is there and held to the end of the second.

## What it draws

Each cut-out is prepared ONCE, on its own frame, at twice the film's pixels (the zoom), from the frame the film presents (`requestVideoFrameCallback`): the
matte's box drawn 2x with the enhancement, through the matte (`destination-in`), the rim light on him (`source-atop`), the glow under him
(`destination-over`). The enhancement is an SVG filter the mount puts in the page (`#hero-sacrifice-enhance`): an unsharp mask (the frame
plus 0.7 of the frame less its 1.5 px blur, `feComposite arithmetic`), contrast 1.15, saturation 1.1; Chrome takes it on a canvas
(`ctx.filter = 'url(#hero-sacrifice-enhance)'`, read back as accepted on the hero), a browser that refuses url() filters gets
`contrast(1.15) saturate(1.1)`, one with no canvas filter the zoom alone. The rim light is the society's lit gold (#e5c782): the silhouette
less itself shifted 7 px right and 6 down (2x pixels), so it lies along his edges facing the blast. The glow is the society's gold (#d4a34a):
the silhouette blurred 14 px at 0.7 and 4 px at 0.45. The rim and the glow come from the matte alone, made once as the second comes near
(a second before, on the film's timeupdate, never on a frame).

Paused or sought: a frame of 319 to 330 is on the film, so its cel is cut from the film itself; in the hold with cel 330 never presented, a
hidden helper film (the idea of unboxing.js THE KNIGHTS IN THE FRAMES) seeks once to frame 330 and is let go after (see The second).

## The cost, measured

Round 2, the figure locked to the film: on the hero (`lab/hero-ab.html`) served from this tree by `tools/serve-range`, in a muted headless
Chrome at 1440 x 900, this Mac at load 61 to 170 (`sacrifice-timing.mjs` in the lane's scratchpad; Oct 15 2026 02:0x WEST):

- **At rest**: the layer 0 x 0 pixels, no callback waiting, no timer, no requestAnimationFrame of its own; outside the second the film's
  timeupdate is answered with a comparison. A hidden page draws nothing.
- **Once, as the second comes near**: the rim and the glow from the matte, 0.3 ms (0.1 to 2.9 ms on the first cut's runs; two outliers of
  39.6 and 75.6 ms at load 330 to 345, on a timeupdate a second before the second, never on a frame). The matte, 18 kB, fetched once in the
  page's idle time after the mount.
- **A cel cut**: 0.35 ms on average (70 cut in 24.5 ms over the log and the six pictures), 2.8 ms at most: one per presented frame of 319 to
  330, on that frame.
- **A draw**: 0.026 ms on average (76 in 2.0 ms), 0.2 ms at most: a clear and one `drawImage` of the frame's cel, 1:1 on an 800 x 722 canvas
  scaled by CSS to the figure. A pass draws 14 times (319 to 330, then 347 and 348 for the fade out; the hold draws cel 330 once): fewer than
  the first cut's 30.
- **The helper**: only for a pause or a seek into the hold with cel 330 never presented in that play: one seek (2 seeks in 3 runs over the
  six pictures, 273 ms in all, the helper film's own load included). A pause or a seek onto 319 to 330 needs none: the film shows the frame.
- **Memory while the second runs**: the cut-outs of 800 x 722 (2.3 MB a cel, 28 MB at most for the twelve), the rim and the glow (4.6 MB);
  all released on frame 349.
- `sacrificeAt`: 1.3 us a call bare, 3.2 us with a geometry, at load 249 (the test bounds it at 50 us for a loaded Mac).

Not in the numbers: the browser's own cost of the GPU filter and composites, and the helper film's decode (a second decoder beside the film's,
only on a pause or a seek into the hold).

## The proof

- `node --test lab/sacrifice.test.mjs`: 18 of 18. Among them THE FIGURE IS NEVER BEHIND THE FILM: for every presented frame 319 to 330 (half
  with a microsecond-short media time) the cel drawn is that frame, cut from it on it; cel 330 holds 331 to 348, redrawn only for the fade;
  at every millisecond of 319 to 330 the plan's cel is the film's frame; a timeupdate while the film plays never draws.
- The whole dyson-society suite (app, lab, tools; nice -n 19): 423 tests, 421 pass, 1 skipped, 1 fail: `lab/braindance.solve.test.mjs`
  "solvePose ... tens of microseconds a solve" (main's own, cf75d3ce: a 20 ms bound a solve, over it at load 143 to 180; it passes alone).
- THE SOUND NEVER RESTARTS THE PICTURE: `app/dl-twelve.proof.mjs --tap button` (the tap at 6.02 s) and `--tap sphere` (6.05 s) on this
  tree's hero served by `tools/serve-range` (8998): both PASS, the film never below its second at the tap, the song within 0.15 s.
- THE LOG in the real browser (`sacrifice-timing.mjs`): the film played 9.4 to 11.9 s; for each of the 30 frames it presented in the second
  (none dropped), once that frame's callbacks had run, the layer was on that very frame and showed cel 319 ... 330 on frames 319 ... 330 and
  cel 330 on 331 ... 348, alpha 0.259 and 0.741 on 319 and 320 and on 348 and 347; nothing before 319, nothing from 349. Chrome wrote frame
  319's time as 10.643967.
- Pictures (the lane's scratchpad, never in git), each the hero beside the film's own frame as the browser holds it: 10.70 s (frame 320, cel
  320), 10.90 s (326, 326), 11.00 s (329, 329), 11.10 s (332, cel 330 over the burst), 11.40 s (341, 330), 11.70 s (350, gone). The first
  cut's pictures and numbers stand in this lane's history (aacc1aa2).

## Not done, and why

- In 319 to 321 his pose is still settling (he has just landed) and the held matte lets a sliver of Seiya's blue show at his right hand and
  legs; he is coming in then (319 at a quarter, 320 at three quarters), so it is barely seen. A matte of their own for those three frames would
  need the cliff and Seiya's hair keyed out of Vision's masks; not done.

- Frames 316 to 318 (the fly-in) are not cut out: Vision returns one blob of him, Seiya and the cliff, and by eye there is no clean figure
  of him in a motion-blurred streak. The film shows the fly-in underneath; he appears on the page as he lands.
- The matte is one for the twelve frames because the cel is held; if a cut ever carries frames where he moves, `film-matte.swift` without
  `--union` writes one cell a frame and the sheet's JSON says so.
