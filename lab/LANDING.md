# The syrup glass: the mint's Goldberg as a glass pouch filling with syrup (Oct 14 2026, 05:4x to 06:4x WEST)

His words (Oct 14 05:4x): the mint's sphere must read as a glass polyhedron, a pouch, filling with syrup: maple syrup, whiskey, amber drops
that ripple on the surface, with caustics and pristine liquids, the best shaders in the world, and the same rigour as the floating versus
anchored land. The land stays `mint-gravity.mjs` (lane/goldberg-gravity 1a802217, merged here unchanged); `mint-sphere.js` only exports its
`morphPlan` so the glide is the mint's own. The new files, all lab, none in the build, worn on no glass:

- `syrup-glass.html`: the page, WebGL2, four passes (the wave, the glass, the caustics, the drops), his X picture as the star (the lab's stand-in).
- `syrup-glass.bench.mjs`: a muted headless Chrome over CDP from this tree's files, off every screen; the pictures and the numbers below.
- `syrup-glass-pictures/`: the five pictures (1920 x 1080) and `syrup-glass.bench.json`, the receipt of the run the numbers come from.

## The mapping

A drop is a purchase. Bronze is a small drop that rolls from the rim to its cell and floats as a pale film (depth 0.18); gold is a heavy drop
that sets in the glass as a deep amber well (depth 1.0, the cell bulges and glows once); the twelve chairs are set from the start (depth 1.0).
A held cell is amber by Beer-Lambert through its film (sigma 0.35, 1.15, 3.3: red passes, blue barely); an open cell is clear and the star is
seen through it. A drop's ripple is a splat in a height field on the sphere map and travels only through its pool: the wave's taps into
another pool are walls (the pool-id texture is the nearest face centre's home mass, rebuilt on the GPU when a gold lands or the swarm expands).
The pouch's level is the land held over the land there is: it rises as drops land (250 ms), falls at an expansion, a full pouch is sold out, a
drop with no open cell hangs at the rim and pours onto the new land once the glide (1.6 s, morphPlan) ends. The syrup below the level tints
every ray through it by its length in the pool; the meniscus is a line of light on the glass at the level; the caustic under the pouch is the
field's Laplacian as light focus through the bottom hemisphere, tinted by the cell's amber and the pool's thickness, inside the shadow ellipse.

## The law of rest, proved

The field integrates only while its energy (a 32 x 16 reduction of h² + 4v², read back through a fence, polled once a frame) is above 0.03;
then it is cleared and the page stops its frame loop. Nothing draws on a timer; a draw happens on a cause (a drop, a ripple alive, a glide,
the level moving, a drag, a resize). Measured, both sizes: **0 draws in 300 frames at rest** (the bench counts its own frames and the page's
draws; the page's own frame count stayed at 0), the field at 2.96e-2 (1080p) and 2.21e-2 (720p), 0 synchronous fallbacks of the fence.

## The wave that stood (and the one that exploded)

The first scheme, `h' = h + (h - h_before)(1 - d) + k lap(h)` with an explicit viscosity `+ visc lap(h - h_before)`, saturated the RG16F field at
65504 within 300 ms of a gold (max |h| 2.94 twenty milliseconds after the splat; energy 3.6e16), so the pouch never rested. A 256 x 128 replay of
the exact update in Node (one minute) found the term: the explicit viscosity in the leapfrog form is unstable at short wavelengths, and a splat
written into h alone while h_before keeps the old value is a velocity kick of the whole amplitude every step that leaves a DC offset the damping
never drains. What stands now: the velocity smoothed as a convex mix with its neighbours' (`v = (h - h_before) + visc/4 lap(h - h_before)`,
visc 0.2), `k` 0.36 (the replay: 0.36 holds for 900 steps with pool walls and fractional taps, 0.40 explodes after 480), damping 0.012 a step,
four steps a frame (half a texel a step, 2.4 texels a frame, 0.9 rad/s), and a zero-mean splat (a cosine dip of the drop's radius, 0.45 cells
bronze and 0.8 gold, with the displaced syrup risen in a rim twice as wide at a quarter of the amplitude) with a velocity kick of 0.3. A gold's
ripple then decays from max 1.39 to nothing in 4.6 s and the page rests; a bronze's in about 2.6 s. The taps are one physical cell apart on the
equirect map (the longitude tap widens by 1/cos lat, clamped at 32 texels), so a ripple is round anywhere but smeared in the last rows at the poles.

## The cost, measured (the receipt: `syrup-glass-pictures/syrup-glass.bench.json`)

The run: Oct 14 2026 06:3x WEST, Chrome 155.0.8059.40 headless (`--headless=new`, muted, its own profile, Fetch interception letting through
only the tree's door and the star's picture), renderer `ANGLE (Apple, ANGLE Metal Renderer: Apple M4 Max)`, on the serving Mac at load 30 to 90,
under `nice -n 19` and `tools/dead-tasks/bounded.mjs`. 300 frames alive (a bronze drop every 24 frames, a gold every 96, so ripples, drops, the
level and the setting never stop), then 300 frames at rest. 0 page errors, 0 refused requests.

| per alive frame | 1920 x 1080 | 1280 x 720 |
| --- | --- | --- |
| draws / frames | 300 / 300 | 300 / 300 |
| frame delta (rAF) min / median / p95 / max | 16.60 / 16.70 / 16.70 / 16.80 ms | 16.50 / 16.70 / 16.70 / 16.80 ms |
| draw, CPU, median / p95 / max | 0.10 / 0.20 / 0.20 ms | 0.10 / 0.20 / 0.30 ms |
| GPU timer, floor (a two-pixel draw) | 271 µs | 218 µs |
| GPU timer, wave (4 steps, 1024 x 512 RG16F) | 295 µs | 261 µs |
| GPU timer, parchment + caustics (the dirty rect) | 328 µs | 242 µs |
| GPU timer, glass (the mesh, front faces) | 404 µs | 285 µs |
| GPU timer, drops (instanced impostors) | 356 µs | 243 µs |
| GPU timer, energy (every 12 frames) | 653 µs | 583 µs |
| at rest, draws in 300 frames | 0 | 0 |

How to read the timer: `EXT_disjoint_timer_query_webgl2` on ANGLE Metal puts each query in its own command buffer, and the floor query (two
pixels) reads 218 to 271 µs; every pass reads within a floor of that, and the wave, which never touches the canvas size, reads 13 % cheaper at
720p, so the numbers follow the command buffers and the GPU's clock state more than the pass. What they bound: the whole alive frame is under
2 ms of GPU time on the M4 Max at both sizes (1.65 ms summed at 1080p, 1.25 at 720p, floor included), and the frame is the vsync's at 16.7 ms.
The per-pass wall clock between `gl.finish()` calls in the receipt (`passesAlone_us`) is submission time only (Chrome's finish does not wait
for Metal); it is kept for the record, not read as cost.

**Texture memory, the page's own: 6.19 MB at both sizes.** The field 2 x 2.0 MB (RG16F 1024 x 512, ping-pong), the pools 2.0 MB (RG16F: pool
id, face id), the energy 8 KB (32 x 16 RGBA32F), the face centres and the face data 16 KB each (1024 x 1 RGBA32F), the star 160 KB (200 x 200
RGBA8), the floor target 16 B. The mesh 89 KB at 80 cells, 158 KB at 150, 645 KB at 630 (14 floats a vertex, a fan a face, the glide's two
shapes in one buffer). Not counted: the canvas's own buffers (Chrome's 4-sample MSAA at 1080p is about 33 MB plus the 8 MB resolve). The
first cut of this page had a backdrop texture and a copy pass (14.1 MB at 1080p, two more 2 Mpx passes a frame): the parchment is now a function
of the pixel that the glass and the drops evaluate where their refraction lands, the canvas keeps its buffer, and a frame repaints only the
rectangle around the pouch (992 x 1011 px at 1080p, 662 x 674 at 720p).

**The work a frame, for any other chip:** wave 4 x 0.52 Mpx x 10 taps = 21 Mtaps; parchment 1.0 Mpx (1080p) or 0.45 Mpx (720p) with the
caustic's 12 taps on the 0.14 Mpx ellipse; glass 0.42 Mpx (1080p) or 0.19 Mpx (720p) with about 17 taps and three parchment evaluations a
fragment; drops under 10 kpx; the energy 0.52 Mpx of taps every 12 frames; the pool mask 0.52 Mpx x up to 642 dot products on a cause only.

## What lysa would need

Not measured on lysa (the brief asked what it would need; a probe there runs one at a time and the Board's proof road is the way:
`lysa-headless-board-proof-by-fetch-interception`). Its GPU, from the hive-bench record (lane/hive-bench-lysa 027ad1d0, `HIVE-BENCH.md`):
`ANGLE (Intel, Mesa Intel(R) UHD Graphics (CML GT2), OpenGL 4.6)`, Chrome 151. From the work above and that chip's fill (about 4 Gpx/s of
simple shading, 8 Gtaps/s, 30 GB/s): wave 2.5 ms, parchment 0.4 ms, glass 1 ms, so about 4 ms alive at 1080p and 2.5 ms at 720p, plus 1 to
2 ms for Chrome's compositing of a 4-sample canvas at 1080p; 60 Hz should hold at both sizes, and rest costs nothing. If the measurement says
otherwise, in this order: two wave steps a frame instead of four (or the field at 512 x 256: three quarters of the taps gone), `antialias:
false` on the canvas (the silhouette then aliases), the energy reduction every 24 frames. The estimate is an estimate; the number is lysa's.

## What the WebGPU port changes

1. The wave is a compute pass over a storage texture (`rgba16float`, since `rg16float` is not a storage format: 8 MB for the pair, or two
   `r32float`), four dispatches a frame reading the pool mask as a storage texture; no ping-pong framebuffers, no blit, no float-render extension.
2. The energy is a workgroup reduction into a 2 KB buffer read by `mapAsync`: a promise, not a fence polled every frame.
3. The pool mask is a compute pass with a grid of face centres (the twelve chairs first, then the cells near each), O(texels x 7) instead of
   O(texels x faces): a cause costs 0.5 Mpx x 7 instead of x 642 at the top rung.
4. One render pass for the parchment, the glass and the drops, recorded as a render bundle on a cause; `timestamp-query` at the pass boundaries
   measures the pass (on Metal, inside the command buffer), so the 220 to 270 µs floor goes and the numbers above become real.
5. The face data and centres are storage buffers; the mesh's two shapes stay two vertex buffers with the glide's progress a uniform.
6. The WebGPU canvas keeps no buffer between presents: the dirty-rect saving goes, and the parchment is either redrawn whole each alive frame
   (1 Mpx at 1080p, cheap as a function) or kept in a texture (8 MB) and blitted; the first is the right one on lysa.
7. MSAA 4x on the glass's target is native; the drops can then write depth and be refracted by the glass itself with one more pass.

## Not done, said plainly

- The ripple reads on the glass as a bending of what is seen through the cell and its neighbours (the pictures 2 and 3), and as rings in the
  caustic; it does not read as rings of light on the glass itself. A thicker specular lobe on the bent normal would do it: not tuned.
- The far side's films are seen through the pouch without refraction (four soft taps at the exit point); a drop behind the glass is dimmed to
  28 %, not refracted. The equirect poles smear a ripple in the last rows.
- The chairs take no drops (they are the twelve's); a gold on a held bronze gives it gravity in the model and the page shows that as the well.
- No lysa run, no phone run; the look was judged on these five pictures only, in Chrome, not in the app's WebKit.

## For the inside view (`syrup-inside.html`, the distro-play seat's, on lane/goldberg-gravity; this seat never touches it)

What this page's field and caustics give that an analytic ripple does not, and what they cost, so the inside view can take them or not:

- **The height field (pass a) is better than analytic rings when there is more than one drop, or a watershed.** Any number of drops cost
  the same (4 steps x 0.5 Mpx a frame while alive, 4 MB, nothing at rest); a ripple stops at the seam because the taps into another pool are
  walls (an analytic ring would have to be clipped by the pool's shape, which is not a circle); it reflects off the pool's edge, and the
  viscosity disperses it as syrup does (short waves die first). For one drop's rings seen for a second, an analytic ring is cheaper: no field,
  no mask. The field is in model space on the equirect map, so from inside the pouch the lookup is the same `equirect(dir)`, and the surface
  normal is the same bend, `n - RIPPLE * (gu T + gv B)` with the physical-tap gradient (the longitude tap widened by 1/cos lat): it bends
  Snell's window and the panes seen through the surface alike. To take it: the `WAVE_FS`, `MASK_FS`, `ENERGY_FS` strings, `waveStep`,
  `buildMask`, `energyIssue` / `energyPoll` / `energyArrived`, `clearField`, and the constants `WAVE`, `DROP`, `SUB_MS`, `E_REST`; the scheme's
  edge is in the section above (k 0.36 with visc 0.2 holds, 0.40 explodes; the splat must be written into both channels and zero-mean).
- **The caustics (pass c) are a projection trick, not traced light:** the field's Laplacian at the sphere direction under a floor point, as a
  focus factor `1 - CAUSTIC * lap` (a two-texel stencil, five field taps and five mask taps in `lapAt`), times the cell's amber and the pool's
  thickness. For the inside view, where the sun projects the held panes down into the amber, the same factor can modulate the projected
  picture at the direction where the sun's ray crossed the surface; it will not give the sharp folds a traced caustic gives. If the inside
  view traces the surface analytically, keep its rings and take only `lapAt` for the many-drop case.
- **The pool-id mask is the cheapest way, inside too, to know which pane a direction looks at:** one NEAREST tap of `uMask` at the equirect
  uv gives the home mass (`.r`) and the face id (`.g`); `texelFetch(uFaceData, face)` then gives the amber depth, the well's hue (packed rgb)
  and the moment it set. It is rebuilt only when a gold lands or the swarm expands (0.5 Mpx x up to 642 dot products, on that cause).

## The inside view's Show as a clip (`showFrame`, `?clip=1`, `syrup-inside.clip.mjs`; Oct 14 2026, 07:2x to 07:5x WEST)

distro-play's 05:19 plan for the expansions to Halloween: every expansion a 15-second vertical clip posted with the link. Its proposal for
this one, the Show recorded as an 18 s 1080 x 1920 silent clip, went to the optimism.fit lineage and he started it by 07:27 (the lineage's
ledger, row 14). What landed:

- `window.__lab.showFrame(t, {fps = 30, bands = 8})`: the Show at time t, four samples a pixel. It waits for both pictures (`__lab.ready`
  says whether his X picture and the film's frame arrived), holds the page's own clock from its first call, draws every holder's face into
  the atlas once (the atlas never changes mid-clip), and steps the scene from `begin()` on a grid of 1 / fps with the Show's own beats: a
  later t goes on from the last call's state, an earlier one (or a state anything else touched) replays from the start. The face picks are
  seeded from each beat's own time (`mulberry(42 + ms)`), the button's Show and the clip alike. It draws in eight scissored bands, each
  flushed, and waits for the GPU with a one-pixel read, so its `renderMs` is the frame's real cost.
- `?clip=1`: the note, the numbers and the bar are hidden.
- `syrup-inside.clip.mjs`: the bench's `withPage` road (it now takes the page and its ready expression), each frame captured as PNG and
  piped into ffmpeg: libx264, yuv420p, CRF 18, the BT.709 tags carried on the frames by setparams, +faststart, two threads, nice 19.
- Found on the way and fixed: the face buffer kept the last glow written, so a pane's glow never went fully out, and a replay showed a pane
  bought seconds before at full glow; `render()` now writes the faces once more after the last glow dies.

**The receipt** (`syrup-inside.clip.json`, outside git with the clip in `~/Movies/pouch-clips/`). Where: the new Mac, Chrome for Testing
156.0.8078.4 headless, `ANGLE Metal Renderer: Apple M5 Max`, at load 9 to 15; the serving Mac stood at 88. Predicted from distro-play's
four-sample still (17 to 18 ms at 1024 x 640 on the M4 Max, times 3.2 for the pixels): 55 ms of GPU a frame.

| | run 1 (07:38) | run 2 (07:44, the clip kept) |
| --- | --- | --- |
| GPU a frame, read back, median / p95 / max | 38.3 / 54.1 / 65.4 ms | 38.9 / 54.9 / 66.1 ms |
| the first frame (255 faces into the atlas, the cookie) | 225 ms | 207 ms |
| GPU, all 540 frames | 21.2 s | 21.3 s |
| capture (PNG) a frame, median | 143 ms | 143 ms |
| wall for 540 frames, the encode alongside | 103.5 s | 102.9 s |
| encode: user + sys, max RSS | 47.1 + 0.8 s, 438 MB | 48.2 + 0.8 s, 438 MB |

The clip: 15,841,596 B, 18.000 s, 540 frames, H.264 High 4.0, yuv420p, 1080 x 1920, 30 fps, 7.04 Mb/s, BT.709 matrix, primaries and
transfer, TV range. Run 1 had the same pixels but primaries and transfer "unknown": ffmpeg 9 left out the encoder's own colour flags.

**The same t gives the same picture, proved three ways.** In each run, t = 9 s and t = 0 replayed from the start, the last frame reached
forward again and t = 9 s in one band instead of eight each gave the run's PNG bytes (4 of 4, both runs), and no frame equals the one
before it. **540 of 540 frames are byte-identical between the two runs**, two Chrome sessions six minutes apart. The five looks read back
from the mp4 lie 38.0 to 38.9 dB PSNR from the frames as captured (yuv420p's chroma), and the two runs' read-backs are the same pixels.

**The bands cost** 6 to 8 ms of GPU a frame (at t = 9 s, median of three: one band 36.8 and 39.4 ms, eight 45.1 and 45.6 ms), about 4 % of
the wall: the price of no single draw holding the GPU longer than about 6 ms while a screen shares it. **The capture is three quarters of
the wall** (143 of about 190 ms a frame); if clips become a habit, the next cut is the canvas read back as raw RGBA and piped as rawvideo
(no PNG encode in Chrome, no PNG decode in ffmpeg): not done, not measured.

**The five frames looked at**, read back from the mp4: 1.5 s, under the syrup looking up, the bronze drop in the air inside Snell's window
and the panes projected in the mirror below; 4.0 s, the crowd's drops falling under the sun through a pane, the amber lit gold; 7.5 s, the
surface cutting the frame in two, the meniscus a line of light, held panes in the air above and the amber below; 12.0 s, above, looking down
through the surface, the panes doubled by its reflection; 16.5 s, back under, the gold's ripples bending the leading.

**What is wrong in it:** the teeth distro-play noted on the waterline are in the clip: a comb of dark spikes under the meniscus at 7.5 s,
along a lead at the bottom of 4.0 s, a toothed seam near the bottom of 1.5 s. They are the shader's (the same in the capture and the mp4),
not the encode's, and not fixed here. A lead, unproved: `jit` is the sine hash of `gl_FragCoord`, which loses its randomness at large
coordinates (the clip's rows reach 1920) and sets the nine steps of the shafts. Also the shader's own: at 16.5 s the mirror image meets
the direct view in a seam, because the mirror is drawn softer.

**Not done:** not posted (his); no lysa or phone run (the clip is offline; the live page's cost there is still unmeasured); Chrome, not
the app's WebKit; silent (the film's song is his to add). The inside view calls `createMint`'s `reset`, `expand`, `crowd`, `buy`, `layout`
and `state` only; a lane that changes those reruns the clip's checks.

The road again, on the new Mac: `git archive` of the lab's `syrup-inside.html`, `syrup-inside.clip.mjs`, `syrup-glass.bench.mjs` and
`mint-gravity.mjs`, `app/assembly-geometry.js`, `app/orb.js`, `app/saint-seiya.mp4` and `tools/dead-tasks/bounded.mjs` into a scratch
folder there, then `nice -n 19 node tools/dead-tasks/bounded.mjs 15m node embertide-app/ui/intro/dyson-society/lab/syrup-inside.clip.mjs
--out <dir> --chrome <its Chrome for Testing> --ffmpeg /opt/homebrew/bin/ffmpeg < /dev/null`, the output back by `tar` over ssh, the folder
removed.

## The waterline teeth, mended (`syrup-inside.html`; Oct 14 2026, 07:5x to 09:1x WEST)

The teeth above (a comb under the meniscus at 7.5 s, sawtooth along lead shadows at 4, 7.5 and 16.5 s, a toothed seam with bright spikes
near the bottom of 1.5 s, a dotted line at 12 s) were none of the three suspects. They were the cookie's: the 1024 x 1024 map of the pane
each sunbeam crosses, which the projection reads under the syrup.

**How it was found.** Each variant of the shader is a text edit of the page written beside it in a scratch tree on the new Mac, drawn by
`showFrame(t)` at the five looks through `withPage`; the unchanged page gives PNGs byte-identical to the 07:44 clip's looks, so the probe is
the clip. With `jit` a constant, with no shafts and with 64 shaft steps the teeth stay (not the sine hash, not the shafts); with the cookie at
4096 they are four times smaller; with no leading in the cookie the comb goes; with nothing but black beyond the pouch's rim the 1.5 s
spikes go. A variant that writes its cookie read as a colour (the texel, 31 levels a channel) says where every toothed pixel reads the map:
421 to 470 texels from its centre, whose rim is about 465. There the sun meets the panes at a slant, a lead's 0.012 ramp is a texel or less
across the beams, point samples alias it into a staircase, and the waterline magnifies the map 3 to 50 times (at 1.5 s, 25 to 50 pixels a
texel down the screen). Two more of the cookie's own: a beam that misses the pouch was white (full sun), the bright spikes; and a quad of
texels straddling two panes read the atlas at its coarsest mip by implicit derivatives (its mean colour), the 12 s dots. A 4096 cookie with
the same light, compared region by region, showed teeth nobody had listed (16.5 s, along a shadow under a held pane) and that the rest of
the difference is picture detail.

**The mend** (the cookie pass and the main shader's four cookie reads; nothing else of the page):

- `paneLight`: the cookie reads the atlas by `textureGrad` with its own analytic gradients over the pane (inside a pane, the filtering the
  implicit derivatives gave).
- No shadow edge gets sharper across the beams than a square-on lead's (the sun's disc softens them all alike): `edgeNear` finds the
  nearest edge, the pane across it and both panes' slant; a slanted edge is the closed-form mean of the lead's profile (`leadArea`, the
  integral of the smoothstep) over a box of 0.012 (1 − 1/slant), the same box from both panes so their halves meet; a square-on lead keeps
  the old expression. A beam beyond the rim gives no light: none of them reaches the syrup.
- The cookie keeps its mip levels (`generateMipmap` after each redraw) and the main shader reads it by `textureLod` at
  2 · smoothstep(0.93, 1.0, radius): level 0 everywhere else, which gave frames byte-identical to the old `texture()` read (checked).

Tried and left, each on the five looks: the rim read coarser alone (the lead edges at 0.93 of the radius kept their teeth); a box of one
texel footprint alone (the comb stayed); a wider box per pane (a step where two panes' boxes differ: new teeth); a floor of 4 texels (soft
scallops at 10x); a level from the slant alone (larger teeth: mips rescale a step edge's staircase, they do not soften it); the light faded
by the chord at the rim (darker, the comb stayed).

**The cost** (cost first: predicted the main pass's work unchanged, one length and smoothstep a `lightAt`; the cookie pass on cause only
and about the same; its memory 8.4 to 11.2 MB):

| on the new Mac (M5 Max, Chrome for Testing 156) | before (the 07:44 clip) | after (this clip) |
| --- | --- | --- |
| GPU a frame, read back, median / p95 / max | 38.9 / 54.9 / 66.1 ms | **40.4** / 56.9 / 64.1 ms (+3.9 %; the brief's bound 42.8) |
| the same page old and new in one session, alternating, 60 frames each | old 40.5, 44.0, 55.8 ms | new 40.0, 55.0, 55.6 ms |
| GPU, all 540 frames; the first frame (atlas, cookie) | 21.3 s; 207 ms | 22.3 s; 190 ms |
| the cookie pass alone, `EXT_disjoint_timer_query`, 20 queries, twice | 16.3, 16.5 ms | 15.9, 16.0 ms with its mips |
| the frames that redraw the cookie, above their neighbours | at most 3.1 ms | at most 6.2 ms |
| wall for 540 frames; the capture a frame | 102.9 s; 143 ms | 110.6 s; 146.8 ms |
| the encode: user + sys, max RSS | 48.2 + 0.8 s, 438 MB | 54.0 + 1.1 s, 438 MB |

The new Mac's load went from 9.5 to 22.6 during this clip (not ours: cua-driver, nettop, Brave) and to 26 during the A/B, whose middle pair
drifted with it; the first and last pairs are within 1.3 % of each other. The query's 16 ms is the pass alone at an idle GPU's clock (a
`readPixels` of the canvas does not wait for another framebuffer's draws, and one of the cookie's own read 2 ms); in the clip the frames
that redraw it stand only a few ms above their neighbours, old and new alike.

**The clip** (`~/Movies/pouch-clips/syrup-inside-show-2026-10-14-mended.mp4` on the serving Mac, beside the old one; its frames read back
and its receipt in `syrup-inside-show-2026-10-14-mended-looks/`): rendered from this lane rebased on main 377a54fc (the page's sha256
8bf7b854ba4efdc3…), 15,656,854 B, 18.000 s,
540 frames, H.264 High yuv420p 1080 x 1920 30 fps, BT.709 matrix, primaries and transfer, TV range. The four checks the same bytes (t = 9 s
and t = 0 replayed, the last frame forward, t = 9 s in one band), no frame equal to the one before; the five looks 38.0 to 39.1 dB from the
frames as captured, and those frames byte-identical to the probe's of the same page in another Chrome session.

**Looked at**, each crop old over new at full resolution from the mp4: 7.5 s under the meniscus, the left and right lead shadows; 4.0 s the
lead at the bottom right and the pane's edge at the top left; 1.5 s the seam and the mirror over it; 12 s the waterline seen from above;
16.5 s the seam and the shadow under the held pane at the right. No teeth left: the comb is gone, the shadows' edges are soft lines, the
seam is clean, the dots are gone. Moved elsewhere, by the five looks against the old ones (pixels moved by more than 2 / 8 of 255):
1.5 s 19.7 / 8.8 %, 4 s 8.3 / 3.1 %, 7.5 s 13.0 / 6.6 %, 12 s 2.0 / 0.4 %, 16.5 s 2.4 / 0.4 %, all on slanted panes' lead shadows and the
rim's reads, the frames side by side the same picture.

**Not done:** picture edges inside the projected holders still step a little where the waterline magnifies them (the same root, the cookie's
1024 texels, at a lower contrast; a 2048 cookie would cost 32 MB and four times the pass; a cubic read where magnified, three taps more a
read). At 16.5 s the mirror still meets the direct view in a seam (the mirror drawn softer), as before. No lysa or phone run; Chrome, not the
app's WebKit; not posted (his).

## Financial time on the mint (`mint-clock.mjs`, `mint-clock.html`; Oct 14 2026, 07:20 to 08:3x WEST)

His word, 07:20 WEST, in this lane, on a brief that carried seven calendar dates to Halloween: "now, you think you know what you are going to
work on, but you dont. we are not going to do what you read... instead, the time is not going to be wall-clock time my dude... it is going to
be financial time... you understand what i mean or not?" So no date anywhere. The clock of the mint is its ledger: it ticks when money lands,
a dollar a tick; a gold ($1,000) is a hundred bronzes ($10) of time; a day with no sale is no time at all. The reading below is this seat's,
built in the hour after his word and not corrected by him in it; his three calls stay open on the page, which decides none.

### What it is

- **The log of causes.** The causes are purchases (`{n, kind:'buy', land, metal, paid, t, at}`: the land's id, the metal, what was paid, the
  clock after it, and a wall-clock stamp for the record that nothing reads). An expansion is no cause: it is the clock reaching a mark. The
  land (`mint-gravity.mjs`: gold has gravity, bronze floats) is folded from the log, from genesis to any dollar, and the fold is what the
  slider shows; the test holds the fold equal to the live state at every rung and at the close. Under the holders' gate a vote is a cause of
  its own (`kind:'open'`).
- **The marks.** Rung k+1 opens when the money in equals the worth of rung k's sphere at the floor price of the rung each cell was born in.
  Flat prices: $300 (80 seats), $800 (150), $1,500 (240), $2,400 (350), $3,500 (480), $4,800 (630); the whole sphere at the floor is $6,300.
  Every held cell paid at least the floor, so a floor sold out in bronze opens the next rung at its last seat (proved), and one gold at
  genesis reaches two marks in one cause (30 to 150 seats, picture 2). The last rung opens like the others; the end is the land: nothing left
  to sell.
- **The countdown** counts money to the next mark and the bronzes or golds it is, moved by purchases only; on the top rung, the seats to the
  close and the least money they are. **The axis** is the slider: the rungs are its ticks at their dollars, `now` the needle; a drag folds the
  log to that dollar and shows the land as it stood ("as it stood at $2,480 · 580 causes ago", picture 7), one fold a frame at most. **The
  play** is a crowd to the close (a gold on the frontier every 25 purchases, bronzes on open land at random, deterministic by seed) paced over
  sixty seconds of wall clock with the crowd sixteen times bigger at the end than at the start (a doubling every fifteen seconds: half the
  causes come after 46 s); each purchase is a cause and the clock moves on nothing else. **The close**: on the top rung a refinement step at
  each halving of the land left (inner rings on the open cells, the star a step nearer), the rim flares once at the last seat; visual only.
- **His three calls, shown open, never decided**: the gate (here the clock; the holders' unanimous vote of Sep 9 is the other, a switch on
  the page), the price rise a rung (0 %, the live mint's prices; a select to 100 %, the marks follow it: at 50 % the sphere at the floor is
  $38,310, at 100 % $166,500), real money or reservations (every dollar on the page is nobody's). A change of a parameter is a new genesis
  and the hint says so.
- **At rest, nothing.** `mint-sphere.js` now rests: a frame comes only while a cause is alive (a 1.6 s glide, a holder's 2.1 s on the
  carpet, the radius settling, a film playing on a chair, the 1.2 s flare); the live mint's idle spin is the option `idle`, which the clone
  `mint-gravity.html` asks for and this page never does. No film on this page: the chairs plain, the star his picture (a gold disc offline).

### The cost: before, predicted, measured

**Before** (main 1a782c3a, `mint-gravity.html`): the sphere's loop ran at 60 Hz whenever the page was visible (the clone's idle spin), a
draw every frame at rest: about 2 ms of main thread a frame at 630 cells, 120 ms a second, a tenth of a core and the canvas's composite for
nothing; the land had no log and no clock.

**Predicted**: 0 draws at rest; one draw a cause, coalesced a frame; a fold of a whole arc under 100 ms; Canvas 2D at the top rung well
inside a frame on this Mac, its cliff past 2,000 cells; on lysa's CPU the cliff near the top rung.

**Measured** (the receipt `mint-clock-pictures/mint-clock.bench.json`: the run of 08:04 WEST at load 12, nice 19, under bounded.mjs; Chrome
155 headless, `ANGLE Metal, Apple M4 Max`, the 2D canvas GPU-rastered, the page at 1600 x 1000, the stage 1424 x 900; the browser proved this
run's by its command line):

| | |
|---|---|
| at rest, the sphere's draws in 300 frames | **0** (lysa the same, both runs) |
| a draw at the top rung, 630 cells, main thread (median / p95) | 2.5 / 3.1 ms, at 60 fps |
| 60 fps held to | 3,600 cells (a draw 16.6 ms; from 2,550 the p95 frame is already two vsyncs) |
| two vsyncs a frame (30 fps) from | **3,990 cells** (a draw 15 to 18 ms), through 5,750 |
| three vsyncs (20 fps) from | **6,240 cells** (a draw 28.5 ms): where Canvas 2D is under 30 fps on this Mac |
| the fold (CPU, nice 19, load 25 to 37): a whole arc of 630 causes to the close | 44 to 83 ms; to $4,800 (125 causes, six expansions) 18 to 23 ms; to $800 2 to 3 ms |
| the tests | 17 of 17 (11 new, 6 of the land grab) in 1.1 s |
| the wire | nothing: the page asks no server (his X picture once; the stand-in offline) |
| the bytes | mint-clock.html 25.7 KB, mint-clock.mjs 9.2 KB, mint-sphere.js 30.0 KB, mint-gravity.mjs 11.4 KB; the eight pictures 1.8 MB (JPEG) |

The draw's cost is linear in the cells, about 4 ms a thousand on the main thread with the GPU raster behind it; a frame is a whole number of
vsyncs, so "under 30 fps" is a median past two. The spheres past 630 are the class I Goldbergs `buildAssemblySkin` builds (10(n² − 1), n to
32: 10,230 hexagons); the sweep stops after two capacities past two vsyncs (6,750 here).

**On lysa** (`mint-clock.lysa.mjs`: ONE ssh carrying a tunnel to Chrome's port, a port the OS here says is free and the same number there, and
a reverse tunnel from a random high port there to this tree's door, nothing copied; Chrome 151 headless at 1280 x 720, the stage 1126 x 832; the
browser proved this run's by `Browser.getBrowserCommandLine` under `--enable-automation`; one probe at a time, refused if one of ours runs; lysa's
load 8 to 11 before each, nothing of the run left after, read by `pgrep` with the bracket; the receipts `mint-clock.bench.lysa-gpu-off.json`
and `mint-clock.bench.lysa-gpu-swiftshader.json`; the runner's own log is a log, so outside git: its three lines say lysa's load 11.2 → 30.1
(swiftshader, 07:57), 9.3 → 11.5 and 8.1 → 8.1 (gpu off, 08:00 and 08:04), the ports 59326/23787, 54837/38931, 59405/37900, and `clean` after each):

| lysa with `--disable-gpu` (Skia on the CPU, the software compositor; `2d_canvas: unavailable_software`) | |
|---|---|
| at rest, draws in 300 frames | 0 |
| 30 cells | 16.7 ms a frame (60 fps), the p95 already two vsyncs; a draw 1.3 ms |
| 80 and 150 cells | two vsyncs, 33.3 ms (30 fps); a draw 1.9 and 2.7 ms, with p95 spikes to 600 ms |
| 240 and 350 cells | three vsyncs, 50 ms (20 fps): **under 30 fps from 240 cells**, before the top rung |
| lysa with the WebGL probes' flags (`--use-gl=angle --use-angle=swiftshader`; `2d_canvas: enabled`) | 300 to 333 ms a frame at 30 and 80 cells (3 fps), whatever the count: the frame is SwiftShader's composite of the whole canvas, not the draw; it took lysa's load from 11 to 30 in a minute |

What lysa's numbers are and are not: a headless Chrome there has no GPU, so each frame is a software raster of a million pixels (the stage's
clear, the atmosphere's gradients, the shadow) before any cell; the TV's own kiosk Chrome rasters on the Intel GPU and has no debugging port,
so it was not measured. The draw's main-thread cost on lysa's chip is five to six times this Mac's (1.3 vs 0.2 ms at 30 cells, 5.0 vs 1.1 at
350). If this page must stand on lysa as it is: the atmosphere and the shadow drawn once to an offscreen canvas and blitted, a dirty rectangle
around the sphere, and the per-cell `clip` + `drawImage` replaced by a pre-rendered tile sheet; predicted, not measured.

### The pictures (`mint-clock-pictures/`, 1600 x 1000, each taken at rest; looked at before this was written)

1. genesis: the dodecahedron with its thirty seats open, the clock at $0, "$300 to 80 seats · 30 bronzes or 1 gold", his picture seen through
the open faces. 2. one gold at genesis: $1,000, 150 seats, "it reached the mark of 80 seats and 150 seats". 3. the top rung opens at $4,800:
84 held, 4 gold with their orbits tinted, 546 open, "refinement 0 of 10". 4. the close at level 4: $29,720, 34 seats left, inner rings on the
open cells. 5. the flare at the last seat (the sparkles are the carpet's flashes, the ring on the rim is the flare). 6. closed on the star:
$32,040, 630 held, 26 gold (the plain pentagons are the twelve chairs, not for sale). 7. the slider at $2,500: the land as it stood at $2,480,
580 causes ago, 350 seats and 50 held. 8. his three calls, each marked open, and the log's tail with its stamps.

In the crowd's own arc (seed 7, after one gold at genesis) the money is gold's: 26 gold of 630 holders are $26,000 of $32,040, the clock
reached the top rung's mark at the 125th cause with 505 seats open, and the fill of the top rung is four fifths of the causes. That is financial
time with these prices and this crowd, not a ruling: the rise a rung (his call) is what spaces it, and the page shows that under its select.

### Not done, said plainly

- The tick (a dollar here; a unit sold is the other reading), the marks, the vote, the rise and the crowd are this seat's reading of "financial
  time"; he ruled the clock and nothing else. The page decides none of his three calls.
- No phone, no app WebKit, no kiosk Chrome on lysa; the lysa numbers are a software raster's.
- The fold is from genesis at every drag of the slider (up to 83 ms at the end of a 630-cause arc, twelve drags a second then); snapshots at the
  marks would make it constant and were not needed.
- The hypertrace was not run for earlier words of his on "financial time" (the serving Mac stood at load 88 when the lane began); his line of
  07:20 is first-hand, in this lane's transcript (06:20:25 UTC).
- The pictures are Chrome's, not the app's WebKit; the fonts are the fallback (Google Fonts refused by the bench's door).

## Athena from the Hades disc, and the braindance of the event (Oct 14 2026, 14:2x to 15:1x WEST)

His words, over the page at film 30.0 s: "you see this exact moment where athen is looking down? can you please go find all the time and assets
we excavated from the saint seya hades please dude it is vital i need you to find the athena asset from there and bring it here.. what i want to
see happen here is i want to have athena outside of the dodecahedron using the hades game asset dude please". Then, over the page at 45.4 s:
"start having spatial computing awareness of where the fight is happening... see this momen when the light appears... where is it?? if you want
to make a cinematography replication you need to be able to correctly place athena from the height of where she is and all that dude"; "like
imagine that you are needing to make a 4DGS of the trajectory AKA BRAINDANCE of the event here... there is a reason why i got hades installed
on pelino dude come on..."; "IT IS VECTORIAL SPACES AND NORMAL DISTRIBUTIONS ALL THE WAY DOWN".

### The excavation it stands on
`~/code/the-disc-rigs-2026-10-04` (Oct 4 2026): the disc of Saint Seiya: The Hades (PS2, PAL, SLES-54162) opened to its one CRI AFS archive of
13,208 files, its formats read with evidence (COMMON.md, lanes/who/WHO.md, lanes/gmi/GMI.md, lanes/gai/GAI.md, lanes/container/CONTAINER.md):
CMPS is Okumura LZSS, FJF a flat table, GMI the model with a named joint table and strips of vertices on a 12-joint palette, GAI one clip of
quaternion keys, TIM2/TIM3 the pictures. The game's Athena is character 50, "Saori" (ELF 0x3A84D0): `CHARACTER\E00.GMI` (the body, archive
index 495), `E00H.GMI` (the hair, 496), `ME00.MPL` (574: 8 frames of her lips only; every other key is the rest pose), `TEX\E00.TPL` (783: one
512 x 512 picture, 256 colours) and `TEX\E00_FACE.TPL` (784: six faces for the picture's top-left quarter). The disc image is gone from this
Mac's Downloads and from lysa; it is on pelino, `C:\Embers\pcsx2\SLES_541.62.SaintSeiyaTheHades.iso` (2,101,510,144 B), where the game runs
for the house's rig lanes. The five files were read from it by byte range over ssh (read-only, 1.36 MB in all), and each one's size and
first 16 bytes equal the scout's table (`scout/afs-table.json`).

### The asset: `athena.hades.glb` (660,836 B)
`tools/hades-glb.mjs` reads the five files into one glTF binary: 7,020 vertices, 3,234 triangles, 85 joints as the game has them (a skin with
inverse binds, so a page can still pose her), one 512 x 512 texture with face 3 on it and two more faces (0, 5) beside it for a page to swap,
1.6 m tall with her hem on y = 0, facing +z. Her stance is `athena.hades.stance.json`: arms at her sides, head down 24 degrees, the
film's 28 to 37 s. The tool took 171 ms. 11 tests in `tools/hades-glb.test.mjs` on bytes made there (the disc's files never enter the house).
The .glb is the game's own art: `tools/house-mirror/strip-families.txt` strips `*.hades.glb` before GitHub, like `Fighters/`. It sits in `lab/`
itself, not in a folder of its own: aiolos's `/intro/` door serves three path segments at most (`harmony-aiolos.mjs:2347`), so
`lab/hades-assets/athena.glb` was 404 on 8921 while `lab/athena.hades.glb` is served (proved below); an edit of aiolos for a lab asset would
kickstart Harmony on the new Mac, so none was made. The receipt, read on 8921 after the landing of 0d7a391f (Oct 14 15:2x WEST):
`lab/athena.hades.glb` 200, application/octet-stream, 660,836 B in 3.3 ms; `Range: bytes=0-1023` answered 206 with 1,024 B; the first four
bytes `glTF`; `lab/athena.hades.stance.json` 200, 672 B; `lab/braindance.json` 200, 12,761 B.

### Where the fight is: `braindance.json`, read by `braindance.mjs` (6 tests)
The film is the second Saint Seiya movie, The Heated Battle of the Gods (1988). Dolbar, the master of Asgard, "immobilized" Saori "and put as the
figurehead of the ship on the statue of Odin" (saintseiya.fandom.com); the gold curl beside her face at 33 to 36 s is the ship's prow. The record
puts the fight's ground at the origin (Seiya's feet where the column of light stands at his tag 37.132 s), y up, z towards the statue, and
every actor, light and camera shot of the first 81 s as a track over the film's seconds, each a mean and a sigma in metres, with the frames it
was read from. Two spaces, kept apart on purpose: over Athena's shoulder (28 to 31.5, 36.6 to 37.3, 71 to 73.5 s) the two fighters stand 0.13
to 0.15 of the frame tall at the lower left and the ground is seen at about 40 degrees from above, so she is 14 to 22 m from them, about 11 m
up: mu [3, 11, 14], sigma [3, 4, 5]; the establishing shot (42.6 to 44.5 s) shows the statue on a rock pinnacle through the clouds, 16 Athenas
tall, so there she is a hundred metres up: mu [40, 90, 150], sigma [30, 40, 80]. The light: a thin beam from the sky to the fighters at 36.6 s,
a plane at 37.1 s, the flood at 37.4 s (the column's widths 0.4, 1.5, 6, 40 m); then a star in the sky at her level (42.6 s), the sun, the
Cloth as the golden centaur, the Cloth falling to him (59 s), the dressing in the column (61.8 to 68.5 s), his thanks to her with his arms up
(76 to 80 s). The page's own picture at 30.0 s is the shot "over Athena's shoulder, down at the fight": the camera behind and above her head.
`toPage` turns the arena's metres into a page's units from where the page puts the fight (the dodecahedron) and how big a metre is there.

### Not done, said plainly
- Athena is not on the hero page yet: that page is the unboxing session's (three.js in hero-ab.html, its own worktree); it takes her place
  from `at(bd, 'athena', t)` and the shot from `shotAt`, never from a number of its own.
- Seiya in the Sagittarius Cloth (the disc's character 15) and Ikki (04) are named in the record and not yet read into assets; Dolbar is not
  in the game. The arena's rock and the statue have no asset: the game's stages are the Hades chapter's.
- The sigmas are what the frames allow, not a measurement: a drawn film has no one lens. A better record would come from the game itself on
  pelino, the engine's own matrices read from RAM as the rig lanes did (his tweet of Oct 4: the 07:36 fight drawn from the engine's 60 and 59
  joints), once the event is staged there.

## The unboxing: the hero's box opens at the gold star, the gold cloth inside, Seiya up into it and out as it shuts on the armor (`unboxing.js`; Oct 14 2026, 14:2x to 15:4x WEST)

His words, in the session that set the lane: the box opens "like a box or a lotus" with the gold cloth of Sagittarius inside, "i want to keep
white background and only the dodecahedron faces can carry video signal", "then ofc i want to see saint seya as 3D model going up there",
"it is critical the ux is delightful". Then, over the first cut (15:0x WEST): "the box should open up the first time that the golden
dagysttraisu appears in the sky" (his pick: 42.34 s, frame 1269, the cut to Athena's mountain with the gold star already in the stormy sky;
`braindance.json` reads the same star at 42.6 s) and (15:1x) "the gold centaurus and the moment whrn saint seya gets the armor onto itself is
where you close the thing" (his pick: Seiya rises out of the closing box, the wings spread over it).

### What it does (`unboxing-plan.mjs` beat(), a pure function of the film's second)
- 42.342 s: the box takes the page's sphere's place inside the page's own frame (orbit-kick.js THE HUSH: `decide()` draws the box there and
  hushes the skin), as the sphere: warm-sphere.js's projection, decal(), light, shade and hairlines. Its seams light up (0 to 0.5 s), it turns
  its floor down and leans to the eye, flashes with the film's rays at 43.5 s, the lid breaks away up and back as a halo of film leaning to
  the eye, the five lower petals bloom one after the other (a spring, an eighth past and back), the hairlines go to gold leading, every petal
  keeps the film (in 3D once it moves, read the right way round from behind). On the floor the gold cloth turns while the film shows the sun
  and the centaur in flames (50.05 s).
- 60.0 s a column of gold light; 61.767 s (his conversion tag, read from the Nest) Seiya rises through the floor as a figure of light; the
  cloth lifts into the column and bursts at 63.5 s (the film's); its pieces fly onto him low ones first (64.97 to 67.97 s); he rises out of
  the box at two thirds of his size as the petals fold and the lid comes down under him; shut at 69.67 s with the armor on; the wings spread
  over it at 70.0 s (the film's); he goes up into the light and is gone to a star (71.8 s); the shut box turns home to the page's pose and
  fades over the page's own skin (71.82 to 72.22 s); handed back at 72.27 s. From there the page is A. (If his conversion tag ever falls
  outside the open box, the box closes under the end card instead.)
- The theater's second burst (37.10 s) goes off with its own glass as before and is over at 42.30 s; while the box is out the road says
  `{glass: false}`. The road from A through C to B at his conversion tag left the film's flow; A, C and B are views the panel holds.
- The models: a GLB the lab lists in `lab/unboxing-assets.json` (aiolos serves `/intro/` three folders deep, so `lab/assets/` is 404 on 8921),
  fitted by its bounding box, the cloth broken into pieces where it stands. Until the asset session's land: stand-ins of polished gold.

### The cost, measured (`node unboxing.proof.mjs --out <dir>`; Chrome 155.0.8059.41 headless, ANGLE Metal on the serving Mac's M4 Max, load 6 to 8, nice 19, bounded 7 min; 1440 x 900 at dpr 2; the stand-ins, 27.5k triangles, 92 draw calls)
| window | box draws | by | JS a draw (median / p95) | GPU a draw (median / p95) |
| --- | --- | --- | --- | --- |
| A playing, 20 to 24 s | 0 (canvas hidden) | | | |
| the opening, 42.34 to 46.5 s | 60 a second | the film's frames and the screen's, half each | 0.4 / 0.6 ms | 0.22 / 1.43 ms |
| the box turning, 52 to 57 s | 29.7 a second | the film's frames only | 0.5 / 0.6 ms | 0.23 / 1.16 ms |
| Seiya to the hand-back, 60.5 to 72.6 s | 58.2 a second | 353 film, 355 screen | 0.5 / 0.8 ms | 0.25 / 1.15 ms |
| at rest (the page's Pause), at 55 s and at 25 s | 0 in 3 s (theater 0, page 0) | | | |

The GPU numbers are timer queries, which carry a floor of about 0.2 ms each on ANGLE Metal (see the syrup glass above). The canvas is the box
and what rises from it, 1696 x 1533 device px, not the stage. The hand-over, the stage with the box against the page's own sphere at the same
instant: mean difference 1.37/255 at 42.342 s and 1.40/255 shut and home before the fade; 2.3 and 2.1 % of the sphere's square over 8/255:
the hairlines' outer half on the silhouette, the texture filter, and a wedge of about 50 x 30 device px at one near edge-on vertex, where the
page's painter shows its star through a gap between two faces' flat picture squares and the box shows the face behind. The first sits under
the film's own cut (every face changes in that frame), the second under the 0.4 s fade.

### Athena from the record, and THE CUTS' device (`athena-shot.mjs`; Oct 14 2026, 15:4x to 16:0x WEST)
His words (14:2x to 14:5x WEST): "i want to have athena outside of the dodecahedron using the hades game asset"; "if you want to make a
cinematography replication you need to be able to correctly place athena from the height of where she is". In the record's shots over her
shoulder (28 to 32 s, 36.6 to 38 s, 71 to 74 s) the page's eye stands where the film's camera stands: the arena turned so the shot's camera
looks down the page's axis and its look point is the dodecahedron's centre, scaled so the camera's 20 m to the fight is the page's 4
circumradii (0.2 box radii a metre; the dodecahedron-as-a-fighter scale, 2 r / 1.65 m, puts her 21 radii away, behind the page's eye). The
game's Athena (`athena.hades.glb`, stance baked) stands at the record's mean moved by the least inside her sigma that puts her where the film
has her: 0.61 sigma, (1.5, -1.0, -1.25) m, shown in the panel. The record's column of light rises from the fight's ground as wide as the record
says, and from 6 m its flood is a bloom round the fight. At her cuts, at each burst (theater.js) and at his conversion tag (the box's faces),
THE CUTS' one device: a tenth of a second of the normals pass, a tenth of a flat gold matte, then the picture. Cost (Chrome on the M4 Max, the
real GLBs): her shot 28.3 draws a second, JS 0.3 ms and GPU 0.25 ms a draw at the median; the whole run 0 draws at rest. The asset session's
GLBs replaced the stand-ins (`unboxing-assets.json`).

### The load, without its hiccup (Oct 14 2026, 16:2x to 16:5x WEST)

His words (16:1x WEST, relayed): "why the fuck it got a hiccup when loading the page my dude??". Measured first (`unboxing.proof.mjs --load`,
headless Chrome off every screen, the first 15 s from the first byte): the box was made in the page's first second, in two tasks. The first
was createUnboxing's start (the renderer 12 ms, the gold's studio prefiltered 46 ms, both stand-ins 39 ms). The second was the cloth's GLB
fitted, shattered and dressed (68 ms). Cold, the studio alone is about 400 ms in one task: three's PMREM compiles its GGX filter, a
256-sample loop, as it draws. Metal's shader cache is the system's, so every proof here read warm until `--cold`. And a program compiled in
parallel still pays its Metal pipeline at its first draw: 81 ms at Athena's first frame, cold.

What changed:
- hero-ab.html makes the box 2.5 s after the stage is up, in an idle callback, or at once for a film sought past 25 s.
- unboxing.js gives every step a task of its own: an idle callback within 100 ms, or in WebKit, which has none, right after a frame.
- No stand-in is built for a kind with a listed GLB, and the cloth is shattered in slices.
- The studio is 64 px a face (the same gold: no roughness here reads past mip 6). Its programs and the generator's two filters are compiled
  in parallel and drawn once into a pixel of a half-float target first.
- Every texture is uploaded and every program compiled in parallel (one object a slice), then each of the 73 looks is drawn once into a 1 px
  scissor of the hidden canvas.
- Seiya's floor clip is in his shaders: three's compile() reads the renderer's clipping state, not the material's.

The receipt (this serving Mac, Chrome 155 headless, ANGLE Metal, 1440 x 900 at dpr 2, load 6 to 11, nice 19, bounded, one pass each). Columns:
long tasks over 50 ms (one task seen by the page and its frame counted once); frame gaps over 25 / 34 / 50 ms, timed by `performance.now()`
in each frame callback; the longest gap.

| 15 s | before (1e74ecf0) | after |
|---|---|---|
| warm, the film playing | 1 of 61 ms; 5 / 2 / 1; 63 ms | 0; 3 / 1 / 0; 36 ms |
| warm, the film paused (its own Pause) | 1 of 53 ms; 4 / 2 / 2; 64 ms | 0; 2 / 0 / 0; 30 ms |
| cold, the film playing | 2: 123 and 73 ms; 7 / 2 / 2; 133 ms | 0; 1 / 0 / 0; 27 ms |
| cold, the film paused | 1 of 51 ms; 2 / 2 / 1; 59 ms | 0; 1 / 0 / 0; 27 ms |

- **After:** every gap is in the page's own first 400 ms (warm.html, the theater, the fonts; the same before), and the box starts at 2.7 s.
- **Through the moments (75 s, cold):** before, 2 tasks (104 and 64 ms) and gaps up to 109 ms, with 42 ms at the box's first frames. After,
  no task and nothing over 25 ms after the page's first 240 ms: Athena's cut at 29.56 s, the column, the hand-over, the cloth, the
  knights, Seiya and the pieces all ran clean.
- **Warm, 75 s:** one 27 ms gap at film 28.9 s, the canvas waking for her.
- **The steps:** done by 4.9 s. One task each: the renderer 6 to 16 ms, the prefiltering 5 to 12 ms, a primed look 9 ms at most warm and
  19 ms cold. Measured as wall time (spread over many slices): the studio's programs 67 to 77 ms; 20 to 24 materials' programs 336 to
  411 ms; the shatter about 230 ms.
- **The full proof before the rebase:** the hand-overs 1.72 and 1.80 / 255, 0 draws at rest, JS 0.3 to 0.4 ms and GPU 0.23 to 1.0 ms a
  draw.
- **With the KO edge mounted (25 s, warm):** 0 tasks, no page errors, no gap in its window.
- **Not run:** lysa, WebKit, the new Mac, and a second 7-minute proof after the rebase. Heavy runs go to the new Mac; these were short and
  niced.
- **The receipt on the new Mac (17:4x WEST, main f8b74324, with the theater's buffer made in idle time, bbed2dca):** Chrome for Testing
  headless, ANGLE Metal, M5 Max, load 14 to 19 of 18 cores, 84 s from the first byte with the film playing, through every moment:
  - Warm: 0 long tasks. Frame gaps over 25 ms only in the page's own first 111 ms (41 and 29 ms).
  - Every shader cold: 0 long tasks. Frame gaps only in the first 243 ms (46, 26 and 44 ms).
  - mint-fork's storyboard proof on the same Mac on 6459d399 (16:50 WEST) had: 700 ms at 62.45 s (Seiya's first frame compiling), 417 at
    41.39, 384 at 1.35, 350 at 38.75, 267 at 37.34, 283 at 59.60, and 177 ms of the theater's resize at the first burst (11.14 s, page
    seconds). The two proofs read gaps differently (its screencast against this one's frame callbacks), but nothing over 25 ms is left
    after the page's own first quarter second.

### The empty frames (Oct 14 2026, 17:1x to 17:2x WEST; live on main since 8e1426d2)

His words (17:0x WEST, relayed), over the hero at 51.2 s, the 3D cloth standing in the open box and every face showing the film's centaur in
flames: "do you understand or not that here you gotta start showing the empty frames because the pentagons are showing the golden sagyttarius
shit dude?"; and at 16:4x over the opening: "THE LIGHT IS COMING FROM THE ARMOR ITSELF".
- From the cut to the gold centaur (50.050 s, his "here") the faces keep a gold band of their leading, 0.05 box radii wide, and nothing in it:
  the cloth, Seiya and the page are seen through. They stay empty until the box is shut on the armor (69.67 s), riding the worlds as small
  gold frames. THE CUTS' device (normals, matte) runs on both cuts. `beat().empty` over `at.empty`.
- How long they stay empty is his to see. They are on his canvas "Storyboard" (x 4000, y 1960 to 2900) with three readings:
  - 1, as built: until the shut;
  - 2, `?empty=knights`: to the knights' cut;
  - 3, `?empty=burst`: from the burst's cut, 45.445 s.
- Pictures on the new Mac (Chrome for Testing headless, ANGLE Metal, M5 Max): four runs, no page errors.

### The knights in the frames, and the mask through the transformation (Oct 14 2026, 17:4x to 18:0x WEST)

His words, relayed by mint-fork:
- 17:32 WEST, over the hero at 60.9 s, the empty frames riding the worlds: "dude wtf? each of these frames need to be filled with one of the
  individual segment the knights had... like idk light up one frame at a time sequentially based on when knights appear on the screen...".
- 17:39 WEST, over 58.4 s: "can you do here theather mode?? like... during the transformation i would like to shee the mask mode please
  dude...".

What is built:
- The knights' frames:
  - At each knight's cut a frame lights: Ikki and Shun at 53.053 s, Shiryu at 55.055 s, Hyoga at 57.057 s, until the centaur again at
    59.059 s (cuts.js). It is the unlit frame riding the nearest world.
  - His segment plays live in it, and after the segment it keeps the segment's last frame.
  - That picture is decoded once after load by a hidden helper video (three seeks, a 512 px centre square each, then let go), so a seek
    and a first play show the same picture. No second decoder after that, nothing at rest.
- The mask: from his conversion tag (61.767 s) to the shut on the armor (69.67 s), the twelve frames are windows onto the film behind the
  white page. The picture sits where the theater's C puts it (fit 0.92, centred), with a gold rim round each frame. As it closes, the box is
  one dodecahedron-shaped window, with Seiya's face in the armor at 69 s. It is a mode of the face shader on the film texture the box
  already uploads, so there is no extra pass.
- Open for him, on Storyboard (x 4000, y 6560 to 7700):
  - hold or loop a segment;
  - Ikki and Shun, one frame or two;
  - the knights give way to the mask (as built) or stay (`?knights=stay`);
  - `?mask=off`.

The receipt on the new Mac (Chrome for Testing headless, ANGLE Metal, M5 Max, load 11 to 16):
- Pictures: three runs, no page errors.
- The full proof:
  - hand-overs 1.77 and 1.84/255; 0 draws at rest and in A;
  - the transformation with the mask: JS 0.5 ms and GPU 1.26 ms median a draw (0.4 and 1.18 before);
  - GPU medians there move by about 0.3 ms in windows this change does not touch.
- Load, 15 s: 0 long tasks; the three held pictures 0.3 to 0.6 ms each at 4.9 s.

### The end of it, built and not wired (Oct 14 2026, 17:2x to 17:5x WEST)

His words (17:0x WEST, relayed by mint-fork):
- Over the hero at 92.0 s: "do you understand how at the end of it the dodecahedron needs to be dissolved and new dodecahedron needs to
  form later? you know what this is?? this moment right here".
- Over 102.3 and 107.4 s: "they are when pegasus starts to burn the cosmos and when he starts throwin darts of agents".

What is built (`unboxing-plan.mjs endBeat`, `unboxing.js drawEnd`), shown only with `?end=a|b` (`&burn=`, `&darts=`):
- At the cut the box takes the page's sphere's place, in its own look, and THE CUTS' device runs. Then the box burns away face by face along
  each face's own noise, with a gold edge, into its own dust (2,640 points, each the film's colour where it was).
- The four fallen knights' cosmos comes in from fixed sides of the screen. Each knight's stream makes three faces, which take his colour on
  their edges as they are made again:
  - Ikki: orange, from the left.
  - Shun: pink, from the right.
  - Hyoga: ice blue, from below left.
  - Shiryu: green, from below right.
- The new box is whole in gold leading. At the first keyframe it burns from inside. At the second its twelve faces fly out along their
  normals, one after another, with 140 gold darts radiating from it.
- The canvas covers the whole stage in this window. The sphere is handed back at the cut to the gold debris (108.275 s).

The readings:
- A: it dissolves at 86.753 s and is whole at 93.260 s.
- B: it dissolves at 93.260 s and is whole at the burn.
- The burn: 100.767 or 101.335 s. The darts: 104.771 or 106.773 s.

The moments are his. mint-fork asked him on the canvas; the frames of both readings are on "Storyboard" (x 4000, y 2960 to 4600).

### The worlds hear the film (`orbit-kick.js` reads `satellites-score.js`; Oct 14 2026, 18:3x to 19:2x WEST)

His words, relayed by mint-fork:
- 18:32 WEST: "one thing i really dont like is that the orbiting satellites are not reacting to the music my dude... to what is being
  said... to the growing amounts of energy... you get what i mean or not??"
- 18:34 WEST (quoted in tools/satellites-score.mjs): "eh waht are you waiting to turn them into lyssajusianz trajectories that react to
  the thing dude you get what i mean or not?"

The score is mint-fork's (tools/satellites-score.mjs, lab/satellites-score.js): the soundtrack measured once on the new Mac, and the
spoken lines read off the burned-in subtitles by Apple Vision. I had measured my own (orbit-music.js, never committed); the house keeps
one score, so mine was dropped. The page reads the score at the film's second, as a pure function of it.

What reacts to what:
- **The energy, along the trails.** The score's slow curve, over the film's resting level (0.55 of its range), squared. Each point of a
  trail takes the energy of its own second, so a trail keeps the energy it was flown through:
  - the loop is up to 14 % wider;
  - the swarm turns about the sphere at up to 0.12 radians a second;
  - at the height (95 to 115 s), a trail curls round the sphere and is widest at its head.
  - The turn adds up to a whole number of turns over the film (1), so the loop's seam does not jump.
- **On the whole swarm at once, at the film's second:**
  - what is said: each line leans the swarm out (6 %) and round as it comes, and holds it 3 % wider while it stands. A line under 0.6 s
    after the last lean adds no lean of its own (the subtitle reads flicker);
  - the bass's pulses breathe the loop by up to 4 %;
  - the beats flare each world's dot and ring, and so does the energy.
- **Why not along the trails.** A trail's points are 0.24 s and about 15 px apart. A line's kick drawn along the trails broke them into
  corners in the first pictures (19:05 WEST): 7 % of the loop between two points. The largest bend left is 0.0044 of the loop (2 px),
  where the energy climbs to the burn at 101.7 s.
- **On the page.** The page passes the hearing to `createOrbitKick`, and `?hear=off` gives the kick alone, as before. While the box does
  not hush the skin, the context answers through a lighter prototype: only the members the kick needs. The trail's line width is kept as
  the page sets it, not read back for each of its 1,536 points a frame.

The receipt (`unboxing.proof.mjs --hear` on the new Mac, Chrome for Testing headless, 1440 x 900 at dpr 2). The cost is the sphere's whole
frame (warm.html's animation-frame callbacks), hearing and not, over the same windows of the film, twice each way:

| | hearing | not | added |
|---|---|---|---|
| the narration, quiet, 0.5 to 10.5 s, mean (median, p95) | 1.780 ms (1.8, 2.4), 1,214 frames | 1.665 ms (1.6, 2.2), 1,214 | +0.12 ms |
| the meteors, loud, 99 to 111 s | 1.822 ms (1.9, 2.6), 1,456 | 1.631 ms (1.6, 2.3), 1,456 | +0.19 ms |
| at rest at 105 s (the page's Pause) | 0 frames in 3 s | | 0 |

- The first run, before the line width was kept, added +0.20 and +0.15 ms. The clock is coarsened to 0.1 ms (no isolation), so the
  medians are steps and the means are the numbers.
- The full proof on the same tree:
  - hand-overs 1.76 and 1.38/255 (1.72 and 1.29 before);
  - 0 draws at rest;
  - no page errors;
  - the box's windows as before.
- 20 orbit tests (11 new); 142 of 142 lab tests pass on the new Mac.

The pictures (each instant hearing and with `?hear=off`, the page's motion paused) and the chart of what the worlds read are on
"Storyboard" (x 9200, from y 7908). They hold the film's frames and stay out of git.

### Not done, said plainly
- lysa and WebKit (his Harmony window) not measured; no frame callback is held while the film is paused.
- THE CUTS (`CUTS.md`, landed while this lane worked) asks the hero for one device per moment and a pass shown as the cut; the box's own device
  is the seams' light and the flash with the film's rays. Athena from `braindance.json` is not on the hero page.
## The braindance as a measurement: the engine's own matrices from pelino, asked and not stageable (Oct 14 2026, 15:1x to 15:3x WEST)

The hero session asked (15:1x WEST) for the event measured in the game's own engine, Saint Seiya: The Hades on pelino: the posed world
matrices of every joint of the figures and the camera object, read from EE RAM per frame for a shot staged as the film's 28 to 37 s (Athena
above the fight looking down at Seiya, the light at his feet), keyed by the film's seconds through his tags (`mint/seiya-tags` on the Nest,
rev 1: 10.835, 37.132 and 61.767 s). His line behind it, 14:4x WEST: "there is a reason why i got hades installed on pelino dude come on...".
Read first: `braindance.json`, the section above, the Oct 4 lanes (`~/code/the-rig-2026-10-04/RIG.md`, `~/code/hook-semaphore-2026-10-04/RECEIPT.md`
and `profiles/SLES_541.62.sem`, `~/code/the-painter-2026-10-04/CAMERA.md`, `~/code/the-rig-2026-10-04/scene-id/WORDS.md`,
`~/code/the-disc-rigs-2026-10-04` COMMON, WHO, GMI, GAI, `~/code/disc-chunks-2026-10-04/RECEIPT.md`), his wishes doc (no line of his names Hades,
Athena or this shot; its "braindance" is the recordings view) and the memory on pelino's roads.

### What it costs
- **pelino's GPU.** The game's share is not measurable today because there is no game: the RTX 4090 stood at 34 to 35 %, 2,145 to 2,152 of
  16,376 MiB, 46 C, 10 W of 175 (P8), all of it the desktop's and tv1's glass (`electron.exe` and the shell's processes in `nvidia-smi`'s list),
  read 15:18:31 and 15:20:00 WEST. CPU 1.7 to 7.4 % (`typeperf`, two samples), commit 30.5 of 60.3 GB.
- **A savestate.** One stands on pelino: `C:\Embers\pcsx2\sstates\SLES-54162 (73CEADE3).00.p2s`, 13,976,685 B, Oct 4 07:36, PEGASUS (00)
  against CANCER (36) paused at timer 510 (RIG.md). Loading it needs a running emulator and puts that fight on tv1, his screen. A state with
  Seiya in the Sagittarius Cloth (15) does not exist; it would be made by pad through the game's menus, on his screen.
- **The reads per frame.** The hook's packet 17 is 30 reads, 468 B of RAM, a 493 B packet at 5.4 to 5.8 us median on the emulator thread (the
  Mac, Oct 4, the hook-semaphore RECEIPT); the rig tap 158,660 B a frame at 62 to 64 us. The road pelino's ini actually offers is PINE
  (`EnablePINE = true`, `PINESlot = 28011`, TCP on its loopback): MsgRead64 batches, 8 B a read: a 60-node figure's world matrices are 480
  reads (3,840 B), both figures and the camera object about 1,020 reads a sample, about 9.2 KB asked and 8.2 KB answered; its time on pelino is
  unmeasured (PINE was not up), and PINE reads between the emulator's frames, so a per-frame record wants the game paused or the hook's packet.
- **This lane.** Two bounded ssh reads of pelino (`tools/dead-tasks/bounded.mjs 45`, 9 and 5 s of wall clock, native programs only, nothing
  written there), the dead-tasks dry run (5 s), the tests on this Mac (18, 48 ms at nice 19) and these files. Nothing was started that stays.

### What stands on pelino (read 15:18 to 15:22 WEST; pelino's clock is CEST, one hour ahead)
- **No PCSX2 is running, in any session.** `Win32_Process` with `Name like 'pcsx2%'`: none; `tasklist /V`: no pcsx2 and no window titled
  Saint, SLES or Hades; `netstat -ano`: nothing on 28011. The brief's "the game already runs there" was true on Oct 4; it is not true today.
- The emulator is `C:\Embers\pcsx2\pcsx2-qt.exe` (portable: `portable.ini`), the disc image beside it (`SLES_541.62.SaintSeiyaTheHades.iso`).
  Its `inis\PCSX2.ini` (13,062 B, Oct 4 00:55): `EnablePINE = true`, `PINESlot = 28011`, `AspectRatio = Auto 4:3/3:2`, `Renderer = 14`, and
  **no `Hook*` key**: whether the exe is the hooked build was not read (a hash of it against the landing chain's would say).
- After my reads, `embertide-app/tools/nest-join/dead-tasks/pelino.sh` (dry): "left behind and not called dead: none"; the four dead shells
  of Oct 4, 8 and 12 stand as before, none of them mine.

### What the game can stage, and what it cannot
- **It can stage a fight:** two of the 49 fighters 00..48 (Seiya in the Sagittarius Cloth is 15, `SagittariusSeiya`) on one of ten stages,
  the ELF's list at file offset 0x394AB0 (read on the scout's copy): Palace of Aries (out), Palace of Aries (in), Palace of Gemini, Palace of
  Virgo, Garden of Sal tree, Palace of Athena, Garden of Hades Castle, Nether World, Hades Thrones, Wailing Wall, then Random. The engine holds
  each fighter's skeleton as its own node array (288 B a node: the local 4x4 at +0, the world 4x4 at +64, the parent's index at +164, the name
  at +166) under the root 0x7f44c8 (two u32, one a fighter; the skeleton's node 0 at F+0x380, the placement at F+0x8a30 on the floor y = 0,
  the character's number at F+0x416), and the camera as the object at the pointer 0x4ff850 (V at +0, the eye at +0x80, three angles at +0x90;
  fovy 40 degrees in every recorded fight frame). All of it reads from EE RAM by name and pointer, never by a fixed address: the arrays moved
  between the two recorded fights (RIG.md, CAMERA.md, WORDS.md). 1 game unit = 0.10 m, y down, row vectors.
- **Saori (50, `CHARACTER\E00.GMI`) is no fighter:** no `50.MPL`, no `BS\50.BSB`, no `SKILL\50`, no select name (WHO.md). Her only motion is
  `ME00.MPL`, 8 frames of her lips. Of the disc's 174 story motion files (`SCRIPT\MOTION\STORY_xxxx_NN.FJF`, read in `afs-paths.json`) none
  names her: they name 26 fighters and 55. Her other files are voice lines (`STORY_E00_T17`, `_T23`, `_P03` in scenes 0017, 0023 and 1003;
  `RESE00_NN.ADX` in 22 skill folders) and textures. So no pad press puts her in an arena or above one; whether the story's dialogue draws her
  model in 3D at all is UNPROVEN (no savestate of a story scene exists anywhere, the SCENE lane looked at 200).
- **Dolbar is not on the disc. The column of light is not on the disc.** No stage is Asgard; none has the statue of Odin or the ship's prow.

### Which shot is stageable: none of the film's; the ground half of one, once he has the game up
The shot asked for (28 to 37 s: over Athena's shoulder, 12 m up and 15 m back, 40 degrees down at the two fighters, the beam at Seiya's feet)
is not stageable by reads and a savestate, for four reasons, each enough alone: (1) the engine is not running, and starting it is a window on
tv1, his screen, his word; (2) nothing in the game puts E00 in an arena or above it; (3) the fight camera stands where the engine puts it, at
chest height circling the fighters at fovy 40, and the film's place for it is a write into the camera object, an edit of the game; (4) Dolbar
and the beam do not exist there. What IS stageable once the game is up and a fight with 15 is on: the ground half, Seiya 15 standing at the
origin against any fighter on any of the ten stages, his joints' world matrices and the engine's own camera, read by PINE or the hook's packet.
That is a measurement of Seiya's stance and of the game's shot, not of the film's. So, by the brief's third point: no record was taken, nothing
was edited in the game, nothing was written on pelino, nothing was loaded.

### What is missing, exactly
1. The game running on pelino: his hand, the window is tv1's.
2. A fight with character 15 in it: a savestate or his pad; none exists.
3. A scene with E00 posed: none on the disc beyond her lips. Her place above the arena and the camera over her shoulder are writes into EE RAM.
4. Dolbar and the beam: not in the game; they stay the film's and this record's.

### What the hero page should read
Now, as before: `at(bd, 'athena', t)`, `shotAt(bd, t)`, `placesAt` from `braindance.json`; the record now carries an `engine` block saying it is
a reading of the frames, what the engine half lacks and the road to it (`braindance.test.mjs` pins the block, so whoever lands the measurement
moves that pin on purpose). If he puts the game up and a fight with 15 is staged, the engine record goes beside this one as
`lab/braindance.engine.json`: per film second (his tags on the Nest give the seconds, frames at 59.94 a second from the tagged frame), each
figure's joints by the game's own names (the glb's skin uses them) as world 4x4 in the arena frame (units times 0.10, y turned up, the origin at
Seiya's feet) and the camera's eye, V and fovy, every number with how and when it was read and pelino's load. The page would pose Seiya from it
and keep Athena's place and the film's shot from this record.

## The braindance measured off the film's own rays: keypoints tracked, poses solved (`braindance.solve.mjs`; Oct 14 2026, 15:4x WEST onwards)

His words (Oct 14 2026, 14:4x WEST): "if you want to make a cinematography replication you need to be able to correctly place athena from the
height of where she is"; "a 4DGS of the trajectory AKA BRAINDANCE of the event"; "IT IS VECTORIAL SPACES AND NORMAL DISTRIBUTIONS ALL THE WAY
DOWN"; and at 15:4x: object permanence and non-deformation plus the trajectories of keypoints are the rays that collapse the uncertainty. The
record above (`braindance.json`) holds every mu and sigma as READ by hand off contact sheets. This lane turns the ones the film allows into
MEASUREMENTS: the same keypoints of a rigid body in every frame of a shot (object permanence), the distances between them fixed to the body's
known shape (non-deformation), each frame's pose solved from the 2D marks by its own Gauss-Newton (a PnP solve), the shot's focal length
solved with it, and the covariance of the place read off the solve's normal matrix. The record keeps the hand-read mu and sigma beside the
measured ones; the readers answer the same shape as before.

### Cost first (written before any run)

| what | cost, predicted (this Mac is the serving Mac: everything at nice 19 under `tools/dead-tasks/bounded.mjs`; nothing on NewMac) |
|---|---|
| the frames | `ffmpeg` at the film's own rate (30000/1001 = 29.97 fps, 960 x 540, h264, 4,624 frames in 154.3 s) for the shots worked: Athena over the shoulder 28 to 32 s (120 frames), her face 32 to 36.6 s (138), the column over her shoulder 36.6 to 37.4 s (24) and 71 to 74 s (90), his thanks 76 to 81 s (150), the dressing 61.8 to 69 s (216), the two-shot 19 to 28 s (270); 1,008 frames at most, 1,203 with the three small shots beside them. Decode: about 1 to 4 s of one core for the whole film. PNG for the frames marked by hand only (his three tags and three a shot: about 40 pictures, 100 to 300 KB each); the tracker reads 8-bit gray straight from ffmpeg's pipe (518,400 B a frame, 30 MB a second of film, nothing kept). All of it in the scratchpad; no frame of the film enters git |
| keypoints a frame | by hand: 6 to 12 (a head's crown and chin, the shoulders, the hands, the hem, the prow's curl, a helmet's crest) on about 40 frames; tracked: the same 6 to 12 carried frame to frame by a Lucas-Kanade pyramid tracker of this lane's own (Node, no cv2: `python3 -c "import cv2"` says there is none on this Mac), 15 x 15 windows, 3 levels, about 20 x 3 x 10 x 225 = 135,000 multiply-adds a point a frame, well under 1 ms a frame for 12 points |
| the solves | one Gauss-Newton on 6 pose parameters (a rotation vector and a translation) plus one focal length a shot, 8 to 24 rows of residuals a frame, 10 to 30 iterations: tens of microseconds a frame in V8 (measured below). 1,203 frames: under a second in all. The covariance: the inverse of J^T J scaled by the residual variance, 3 x 3 for the body's place, in metres |
| the machine | this Mac (M4 Max; 1-minute load 6 to 7 at 15:41 WEST), one core at nice 19, under `bounded.mjs 5m`; no GPU, under 300 MB of memory (one frame of gray at a time plus the pictures); NewMac not needed |
| wall clock of the road | the decode and the tracker a few seconds a shot; the hand marks are the time: minutes of looking at pictures a shot |
| money | $0 |
| the TRELLIS road, for comparison (`tools/sagittarius-assets/LANDING.md`) | one asset: picture 12.9 s + cut 0.3 s + TRELLIS.2 load 44.6 s + one seed 78.4 s + the road 32 s = about 2 min 50 s on the new Mac (M5 Max), three seeds about 7 min, 14.9 GB peak, $0.1278 of pictures through MiniRouter; and on the film's own frames it gave plaques 2 to 3.5 % deep (no depth from cel shading, whatever the seed). It makes a SHAPE from one picture; this lane never makes a shape: it takes the shape as known (the 85-joint skeleton, the heights) and measures where it stands. The two are not the same question |
| the engine road, for comparison (the section above) | closed today: no PCSX2 on pelino, no scene with E00, Dolbar not on the disc |

What this lane keeps or breaks of the foundations: one joint minimization per shot (every frame of the shot in one solve for the focal, each
frame's pose its own), the residual as the measure (foundation 6: predicted before used), the sigma as a covariance (his "normal distributions
all the way down"), two spaces kept where the shots disagree (never forced to agree). Breaks nothing at rest: nothing here runs on a glass;
the record is read at a second as before.

### What was run, and what it cost (measured)

`node tools/dead-tasks/bounded.mjs 5m -- node embertide-app/ui/intro/dyson-society/lab/braindance.measure.mjs --track --write` on this Mac at nice 19
(1-minute load 6 to 7): 0.56 s of wall clock, 1.0 s of CPU for the four shots, the 195 tracked frames read from ffmpeg's gray pipe in 0.1 s a shot
(h264 540p decodes at over a thousand frames a second here), nothing written but the record. The contact sheets (8 shots at 3 frames a second,
2.2 s) and 26 full frames (one ffmpeg seek each) live in the scratchpad and nowhere else. A one-start pose solve of 10 points: 369 to 540 us
(the Jacobian is numeric; predicted tens of microseconds, this is more, and 1,203 frames would still be under a second). Money: $0. NewMac: not
touched. Against the TRELLIS road (2 min 50 s and 14.9 GB a shape on the new Mac, $0.13 of pictures): this is a different question answered in a
second, and it says where things stand, not what they look like.

### The film's cuts are not the record's seconds

`ffmpeg -vf "select='gt(scene,0.25)',showinfo"` over the first 82 s (one pass, in the scratchpad: `frames/cuts.txt`): the over-the-shoulder shot
starts at 29.563 s (frame 886), not 28.0; her face at 33.567 (1006), the column over her shoulder at 36.570 (1096), the flood at 37.204, the Cloth
on him at 38.071; the column wide at 71.138, the second over-the-shoulder shot at 72.472 (2172) to 74.975; his thanks at 76.977 (2307) to 80.747.
The record's `t` stays as read (the hero reads `shotAt` by it); each measured shot carries the film's own cut as `measured.t` and `measured.frames`.
The picture is pillarboxed: 796 x 534 inside 960 x 540 (columns 82 to 877, rows 3 to 536), its centre (479.5, 269.5), so the principal point is the
frame's centre.

### The marks (`braindance.marks.json`, 4 shots, 13 hand frames, 2 to 8 keypoints each, read off 3x and 2x crops with a 10 px grid, sigma 3 to 6 px)

| shot (the film's cut) | body | its shape | the anchor of the world |
|---|---|---|---|
| A, over Athena's shoulder, 886 to 1005 | Seiya standing (top, feet); Dolbar standing (top, feet); Athena's head (a ball of 0.11 m: its silhouette's top and left) | 1.65 and 1.9 m upright; the head's radius | Seiya's feet at the origin, the read camera's turn as a prior (+- 15 deg) |
| B, her face, 1006 to 1095 | Athena's face: crown, eyes, nose, mouth, chin | `athena.hades.glb`'s skinned head in the stance (crown (0, 1.60, 0.087), chin (0, 1.373, 0.047), the mouth_up joint, the eyes and nose as the face's front) | her feet and heading as A measured them (yaw +- 30 deg) |
| D, over her shoulder again, 2172 to 2246 | Seiya standing in the column; Athena's head | as A | as A (his track's 0.2 m up in the column as the anchor's sigma) |
| E, his thanks, 2307 to 2419 | Seiya's head in the Sagittarius helmet: the tiara's peak, its brow edge, both side wings, eyes, nose, chin | a head of 0.23 m by proportion (no asset; the helmet's points placed by f2320's own proportions, sizeSigma 15 %) | his feet at the origin, facing the two-shot's side (yaw +- 20 deg, feet +- 0.5 m) |

### What the solves said (the receipt; every number from the run above)

| track or shot | sigma as read (m) | mu as read | mu measured | sigma measured (m) | frames | residual |
|---|---|---|---|---|---|---|
| athena 24 to 81 s (A: 120 frames tracked, drift 7.5 px; D: 56 frames, drift 8.0 px; fused) | 3, 4, 5 | 3, 11, 14 | 5.13, 5.55, 6.79 | 2.09, 1.94, 2.69 | 176 | 7.14 px |
| dolbar 3 to 38 s (A: the hand frames only; the tracker's carry landed 57 px off, so it was not used; drawn 1.11 of his height) | 1.5, 0.1, 1.5 | -2.5, 0, 0.5 | 0.66, 0, -0.32 | 0.14, 0.03, 0.12 | 3 | 0 px (two marks, two unknowns on the ground) |
| shot A, over Athena's shoulder (eye) | 1, 1, 1 | 4.2, 12.2, 15.6 | 4.85, 6.63, 8.65 | 2.79, 2.73, 3.88 | 3 hand, 120 tracked | 8.0 px (Seiya 0.4, her head's outline 8) |
| shot B, her face (eye) | 0.5, 0.3, 0.5 | 1.8, 11.3, 12.6 | 5.29, 6.11, 6.77 | 0.49, 0.18, 0.42 | 3 hand | 18.2 px: OVER the limit, not tracked |
| shot D, over her shoulder again (eye) | 1, 1, 1 | 4.2, 12.2, 15.6 | 5.67, 8.06, 7.44 | 3.20, 2.81, 3.81 | 2 hand, 56 tracked | 5.0 px |
| shot E, his thanks (eye) | 1, 0.3, 1 | 0.5, 1.2, -3 | 0.02, 1.44, -0.96 | 0.63, 0.10, 0.64 | 3 hand | 15.8 px: OVER the limit, not tracked (f2320 5.7, f2360 21.5) |
| the lenses | | fov 40, 30, 40, 35 | A 40 +- 11.3, B 32.2 +- 15.3, D 40 +- 11.3, E 36.8 +- 15.2 | | | the film fixes none of them: A and D have no rigid body of three marks, B and E ran away from their priors (131 deg, 646 +- 621 px) until the prior was tightened to 3 and 5 deg |

The covariance of a place is in two parts, kept apart in the road and added once: the marks' part (random, fused over the frames) and the
systematic part (the lens prior, a drawn figure's size, the anchor's own turn and place: the same error in every frame of a shot, never averaged
away). Athena's full 3 x 3 is in the record (`measured.cov`); its off-diagonals are large: her place is a RAY from the fight, tight across it and
loose along it, as his words said it would be.

### Where the drawn film cheats, said with the residual (never forced to agree)

- **The pair on the ground.** Seiya and Dolbar as one rigid body (Dolbar 2.5 m from Seiya as the two-shot reads) put the camera ON THE GROUND,
  47 degrees off the read turn, at rms 3.9 px: in this frame the two stand 0.65 m apart on one ground line with Dolbar drawn 1.24 times his height
  against Seiya (135 px for 1.9 m, 95 px for 1.65 m). Four marks cannot tell "a camera on the ground" from "a drawn giant", and the ground fills the
  frame above the figures, so the camera looks down. The pair's offset became a measurement (0.66 m, not 2.5) and the pitch stays the read turn as
  a prior: the record keeps both spaces (the two-shot's step and the over-the-shoulder's half step) because the film draws both.
- **Her face is not her game head.** The 1988 face's eyes sit at 52 % of the head's height and 0.07 m apart; the game's skinned head has them at
  43 % and 0.07; the chin, crown and mouth fit to 4 px, the eyes and nose to 15 to 22 px: 14 to 18 px of residual, over his 2 % limit. With a loose
  lens prior the solve bought the eyes with a 131-degree lens; it was pinned to the read 30 +- 3 deg. Shot B's camera (1.1 m from her face, in front and
  left) stands with that residual on it, and is not tracked.
- **His head turns up in his thanks.** f2320 fits the helmet shape to 5.7 px; f2360, the head tilted up, to 21.5 px (the drawn face is redrawn, not
  turned); the lens prior went to 646 +- 621 px until pinned at 35 +- 5 deg. The camera stands 1 m in front of his face at head height (the read
  had it 3 m off: at 3 m his head would be 73 px tall, it is 200), with 15.8 px on it.
- **Two over-the-shoulder shots, two distances.** A puts her head 11.5 m from the fight (Seiya 95 px tall), D 11.7 m (90 px): they agree, and both
  stand 3 to 4 m under the read 11 m of height; the fused place (5.1, 5.6, 6.8) +- (2.1, 1.9, 2.7) is what the hero should use through `placeOf`.
- **The tracker.** Lucas-Kanade over the cel edges carried Seiya (2.2 px of drift over 120 frames) and her head (7.5 and 8.0 px) but lost Dolbar
  (57 px: her hair's strands cross his legs) and Seiya in the column of D (83 px: the beam's flare). Where it lost a body the hand frames stand alone and
  the record says so (`tracker: "lost..."`). The shots are held cels: the trajectories' scatter is 1 to 5 cm, the measurement is the sigma, not the motion.

### For the hero (`athena-shot.mjs` reads `at`, `shotAt`, `columnWidthAt`; nothing it reads changed shape)

- `at(bd, 'athena', t)` and `shotAt(bd, t)` answer exactly as before (the same objects, their `mu`, `sigma`, `look`, `fov`, `t` untouched); each
  now carries a `measured` block beside. `placeOf(track)` and `eyeOf(shot)` (braindance.mjs) give the measured place when there is one and the read
  one otherwise, in one shape: `{mu, sigma, cov, measured}` and `{mu, sigma, cov, look, up, fov, sigmaFov, measured}`.
- If the hero takes the measured values: the over-the-shoulder camera is 11.5 m from the fight and 6.6 m up (the read: 20 m and 12 m), its fov
  40 +- 11; her head 1 m ahead of it, slightly left and below the axis; the film's cut is 29.563 s, not 28.0 (`shot.measured.t`). The camera's `up`
  is measured (a roll of about 20 degrees in A and D).
- Dolbar in the over-the-shoulder frame is 0.66 m from Seiya, image-right (+x), not 2.5 m to -x.

### Not done, said plainly

- The two-shot (19 to 29.6 s), the blast, Ikki, the pinnacle, the sky, the saints, the dressing, Dolbar watching: not marked, not measured; their
  tracks and shots carry no `measured` block and `placeOf` answers the read one.
- The column over her shoulder at his tag 37.132 s (shot C, 1096 to 1114): the fighters are inside the beam (all light) and her head's top is out of
  the frame: no anchor, not measured.
- B and E are over his 2 % limit and were not tracked; their cameras are recorded with the residual on them.
- The tracker is this lane's own (no cv2 on this Mac) and loses small figures under crossing strands and flare; a feature-based carry (corners,
  not windows) would hold Dolbar.
- The frames' hand marks are one reader's (sigma 3 to 6 px as declared); a second reader's marks would measure the reader.
- The record's other shots (her face at the prow, the pinnacle) are not replicated; THE CUTS' macroblocks and tag chips are not done.

## The KO edge: the hero's borders pulse red with Seiya's spasms while Dolbar holds him by the hair (`ko-edge.js`; Oct 14 2026, 15:3x to 16:1x WEST)

His words, over the hero at film 18.1 s: "see this exact moment when he is grabbed by the hair? can you do some radial thing like in call of
duty when you are 1 hit away from KO like pulsating borders or some shit you get what i mean? like..."; then "make sure to DCT align the red
halo with the spasms of saint seya eh". What he means by DCT aligned, in his turns of Oct 12: "the oscillations here are not DCT aligned to the
music tbh... like you know in advance how it is going to oscillate"; "is there really no DCT study on frequencies of songs and climaxes".

### The moments, the film's own frames (30000/1001 fps; each line sits half a frame before its frame)
- frame 540, 18.018 s: Dolbar's gauntlet closes in Seiya's hair (its claws come in at frame 536): the hit. The red comes in at once.
- frame 886, 29.563 s: the cut to over Athena's shoulder (scene score 0.40); he is held off the frame. The red steps down to 0.55 and holds still.
- frame 1096, 36.570 s: the cut to the beam (0.43). The red is gone: the light is the cure. No burst of the theater falls inside (11.044 and
  37.10 s, 5.2 s each).

### The pulse is his body's (`tools/ko-spasms.mjs` writes `ko-spasms.js`)
The film decoded to grey at 240 x 136; for each frame of the hold the AC energy per pixel of the 8 x 8 DCT of its change from the last frame
(Parseval: sum(d^2) - sum(d)^2/64 a block; equal to an explicit orthonormal DCT's AC coefficients squared, tested on 20 random blocks), over the
picture's middle, inside the 4:3 bars and above the burned-in subtitles. The film is drawn on twos to fours: a held drawing measures about 0,
Seiya's drawings 300 to 940 (the yank on fours 18.15 to 18.92 s, his jerks 19.32 and 19.42 s, the scream 21.82 to 22.49 s, his body dropping
22.56 to 23.19 s, the sway 27.39 to 28.90 s), Dolbar's lips over him 153 to 190, the sky's drift under 30. A search of each drawing's best global
shift (plus or minus 20 px) moved none of them: the drop and the sway are drawn, not camera moves. The hold's one cut (frame 571, 19.052 s, 952)
is written as 0. A spasm's strength is its energy over 250, full at 700; the red surges on the frame its drawing lands and falls by e every
0.18 s. 346 frames in 195 to 214 ms after the decode; measured again by the tests off the film, the same 346 numbers.

### The layer
Two canvases of at most 360 px a side, a seeded superellipse vignette whose inner line seeps by value noise, painted once in idle time (7.8 to
10.8 ms). A fixed layer the window's width over the rows of the window the hero section holds: the stage stops short of the window (1,205 of
1,440 px) and the section clips its children at 1,354 px, which the first two proofs showed; refitted on a scroll or a resize while the red is
in. It goes in after the stage's canvases with no z-index: the drawings under the red, the page's controls over it. prefers-reduced-motion keeps
the red and drops the surges and the flash.

### The receipt (the third proof, 16:09 WEST: `ko-edge.proof.mjs` on the new Mac, Chrome for Testing headless, 1440 x 900, main's hero-ab.html with the edge put on from outside)
| | with the edge, playing 17.0 to 23.0 s | without, the same | playing 40 to 44 s | paused 3 s at 22 s |
|---|---|---|---|---|
| the edge's writes / frame callbacks | 126 / 181 | | 0 / 0 | 0 / 0, none waiting |
| style recalcs (ms) | 153 (8.75) | 49 (1.11) | | |
| layouts (ms) | 24 (1.98) | 25 (1.98) | | |
| script / all tasks (ms) | 585.4 / 753.0 | 585.9 / 719.5 | | |

The layer's real box at every picture: [0, 0, 1440, 900] of the 1440 x 900 window. 15 tests, 15 pass. The pictures and a clip of 17.8 to 23.3
s (165 frames) hold the film's frames and stay in the seat's scratchpad, out of git.

### Not done, said plainly
- On the page since the unboxing session's "hero-ab.html mounts THE KO EDGE" (Oct 14 16:5x WEST). Was: not on the page yet; hero-ab.html is the unboxing session's. Its two lines: `import {mountKoEdge} from './ko-edge.js';` and, in ready()
  after createTheater, `mountKoEdge({stage: found.stage, film: found.film});`.
- No lysa run and no WebKit run (his Harmony window); one run each with and without, so the noise of the task time is not separated.
- In her view the red holds still at 0.55: no spasm of his is on the frame there. Whether it should breathe there is his to say.
- braindance.json's shots now stand on the film's measured cuts (d0f9215e): her over-the-shoulder shot from 29.563 s, not 28.0.
