# The mint hero's sphere: the frame in Rust, the film once a frame, the draws batched (Oct 15 2026, the cloud seat)

His words, Oct 15 2026: "please focus on the optimism.fit mint page... it is incredibly awfully done... engineering wise... i want it invariant
but way more optimized shit is lagging shit is heavy it is awful do all rust c low wasm".

## What it costs, read first (house/CLAUDE.md: cost first, number first)

The page is `app/warm.html`; its hero is the Saint Seiya sphere (`app/warm-sphere.js`, its film `app/dl-twelve.js`, the lab's mounts over it:
`lab/hero-mount.js`). Measured on this box (a cloud container: Chromium headless 1194 off every screen, a 2D canvas rasterized on the CPU, no
GPU) by `tools/mint-meter.mjs` with a stand-in film (`testsrc2`, VP9, 154.311 s: the real films are not in the GitHub copy and this Chromium
decodes no H.264), six seconds at rest, the main thread's own counters (CDP Performance and Profiler, the 2D calls counted):

| warm.html, before this lane | film 0-12 s (the raid) | film 20-26 s (the strips) | 0-12 s, a phone's viewport |
|---|---|---|---|
| screen frames the sphere drew | 16.5 /s (the film: 30) | 28.5 /s | 14.0 /s |
| main thread busy, of 6 s | 9,897 ms (over the window) | 6,297 ms | 8,251 ms |
| of it JavaScript | 3,317 ms | 5,122 ms | 3,049 ms |
| main thread a frame | 100 ms | 37 ms | 98 ms |
| 2D strokes a second | 15,152 | 6,892 | 12,892 |
| `drawImage(video)` a frame, the sphere's | 13 (the twelve chairs and the star) | 13 | 13 |
| the single heaviest line | `drawPortrait` (the 13 video copies): 2,526 ms of 6 s | 4,330 ms of 6 s | 2,304 ms |

The sphere ran on the screen's frames (60 a second asked) while the film presented 30, drew every orbit trail segment as its own stroke (768 a
pass), every tick of the instrument's rings as its own stroke (96), copied the decoded video frame into thirteen clipped faces at every draw,
and worked the whole frame's geometry (1,536 trail points, 543 ring points, 76 stars, every face turned, lit, projected and sorted) in
JavaScript, with the lab's kick proxying every 2D call on top.

## What this lane does

1. **`house/embertide-mint`, the sphere's frame in Rust** (no_std on wasm32, f64 and libm only, no allocator; on embertide-score's curve and
   arc table and JavaScript-number rules, not a second copy). `law.rs`: warm-assembly.js's loop of the twelve (loopUnitAt, loopPoint),
   warm-sphere.js's rotate, project, POSE/poseAt/handAt, SEIYA_MOMENTS/momentPhase/momentCosmos, the stars' table. `frame.rs`: the frame
   builders, each writing a whole frame's geometry into one flat f64 buffer in a fixed layout: the twelve's trails (12 x 65 points), the
   heartbeat's ECG strips (12 x n samples displaced across the line), the three rings and their 96 ticks, the 76 stars, the faces (turned, lit,
   projected, the twelve's decals, sorted far to near, stable). `ffi.rs`: the doors over two flat f64 buffers (IN, OUT; 32,768 doubles each),
   no bindgen. `build.sh` builds `app/wasm/embertide-mint.wasm` (28,596 bytes, sha256 9a9732c7...). Pinned to the page's JS at 1e-9 two ways:
   `embertide-mint/tests/vectors.rs` over `tests/vectors.json` (`cargo test --release`: 6 laws x 200 vectors, 5 builders x 8 whole buffers,
   118,650 outputs, worst delta 4.5e-13, 118,247 bit-identical) and `app/mint-wasm.test.mjs` under node (the .wasm against the JS twins over
   seeded inputs and every skin the page draws, 0 to 480 hexagons).
2. **`app/warm-sphere.js` draws from the frame, from either builder.** `jsFrame` holds the JS twins (the same layouts, the same operation order:
   the reference the kernel is pinned to, and the fallback where the bytes cannot load or a skin passes 1,024 faces); `useWasm(mint)` swaps the
   kernel in (`app/mint-wasm.mjs` loads it once, off the page's load: `app/warm.js`). The drawing reads the buffer and only issues draws:
   - the trails of one age wear one alpha and width, so the three chairs of a lane at that age go down in one path: 256 strokes a pass where 768
     went, the oldest first as before; the lab's kick (orbit-kick.js) still bends every moveTo and lineTo by the width it reads;
   - the instrument's ticks are one path a ring: 3 strokes where 96 went;
   - **the film once a frame**: the decoded frame's centre square is painted once per presented frame (keyed on the film's second the sphere was
     handed, setMoment) into a staging canvas at least as large as a chair shows on the glass (`stageSide`, 270 px here; 64-px steps, 1,024 at
     most), and the twelve and the star are drawn from that bitmap: one copy of a video frame a frame where thirteen went;
   - **the film is the clock of the picture**: while the film plays, each frame it presents asks the sphere for a draw (dl-twelve.js
     `sphere.redraw()`) and the sphere draws then and not on the screen's own frames in between (two draws of one decoded frame on a 60 Hz
     glass, four on a 120 Hz iPad); a film that stops asking (a stall, a pause) hands the frames back to the screen within 250 ms, and the
     sphere's clock (`clock += dt`) keeps the same time, so the orbits move as they did, sampled at the film's 30 frames instead of the glass's.
   `getViewState()` now says `kernel` (the bytes draw it), `stageSide`, and `strip` (the ECG's samples and whether the last draw built it).

## The picture is the same: the receipt (`lab/sphere-frame.proof.mjs`)

Two copies of the page (main's, this lane's) loaded with their screen frames held and stepped by the proof with the same timestamps, the film
paused at one second, the sphere handed that second, 30 frames stepped, the sphere's canvas read pixel by pixel (1071 x 832):

| | the kernel against the JS twins (this lane) | main against this lane, 10 s | 20 s (the strips, the kick's wake) | 33 s (the fold: the skin hushed) |
|---|---|---|---|---|
| pixels differing | **0 of 891,072** | 17,068 (1.9 %) | 17,636 (2.0 %) | 28,367 (3.2 %) |
| largest channel difference | 0 | 85 | 86 | 255 |
| PSNR | identical | 50.6 dB | 49.6 dB | 46.9 dB |

Where main and the lane differ (`--out` writes a.png, b.png and diff.png): inside the twelve faces, on the stand-in's hard edges (its test
pattern resampled twice, 960 to 270 to the face, where it was resampled once; the real film has no such edges), and along the trails where
two translucent segments cross (one path per age composites a crossing once where two strokes composited it twice). Nothing else moves: the
rings, the ticks, the stars, the shadow, the faces' edges and shading are the same bytes. The same page against itself: 0 pixels, every time.

## The numbers after, the same meter, the same box

| warm.html, this lane | film 0-12 s (the raid) | film 20-26 s (the strips) | 0-12 s, a phone's viewport |
|---|---|---|---|
| screen frames the sphere drew | 22.0 /s (+33 %) | 29.8 /s = the film's 30 | 22.3 /s (+59 %) |
| main thread busy, of 6 s | 9,161 ms | 4,777 ms (-24 %), 1.4 s idle | 9,710 ms |
| of it JavaScript | 1,249 ms (-62 %) | 1,191 ms (-77 %) | 1,049 ms (-66 %) |
| main thread a frame | 69 ms (-31 %) | 27 ms (-27 %) | 72 ms (-26 %) |
| 2D strokes a second | 12,456 (the sphere's own 566 a frame are 290; the rest the raid's) | 4,431 (149 a frame, all the sphere's) | 12,639 |
| `drawImage(video)` a frame, the sphere's | 1 | 1 | 1 |
| the sphere's heaviest line | `stagedFilm` (the one video copy): 470 ms of 6 s | 570 ms | 320 ms |

What stands between this box and 30 frames a second in the raid (0-12 s) is `(program)`: the CPU rasterization of the 2D canvas, 5.8 s of 6,
the raid's own layer included (anti-satellites.js: 270 strokes and 30 sprites a frame of its own). A glass with a GPU rasterizes elsewhere;
this box has none, so its frame time overstates every stroke and understates nothing: on a GPU glass the JavaScript share (-62 % to -77 %)
weighs more, and the film-clock halving of draws weighs on every glass. The hedonic numbers, the ones that count, are the house's to read
where he stands (lysa, the phones, the Mac): `nice -n 19 node tools/mint-meter.mjs --url http://127.0.0.1:8921/intro/dyson-society/app/warm.html`
on aiolos, and `--mobile`, `--seek 20`.

## Proof

- `cargo test --release` in `embertide-mint`: 2 passed (the laws, the frame), the vectors regenerated by `node tests/gen-vectors.mjs`.
- `node --test app/*.test.mjs lab/*.test.mjs`: 382 tests, 370 pass, 6 fail: the same six as main before this lane (the GLB models and a mount
  check that need files not in the GitHub copy); `app/mint-wasm.test.mjs` 5 of 5; `lab/heartbeat.test.mjs`'s two pins of the trace's text
  moved to the lines that hold it now (jsFrame.trace and the strips' loop), its intent unchanged.
- `lab/sphere-frame.proof.mjs`: the table above; `--kernel` compares the twins and the bytes on one page.
- Not run here, the house's to prove: the real film (the twelve's pictures resampled from a soft frame), the lab's models (the box, the fold:
  their GLBs are not in this copy, so the hush was proved with the box empty), a glass with a GPU (lysa, a phone, the Mac), the kick's bursts
  at 11.044 and 37.10 s seen by eye, optimism.fit's own headers on `app/wasm/*.wasm` (served as application/wasm by the asset worker;
  `_headers` leaves it revalidated, so a new build is seen at the next visit).

## What is left on the hot path, ranked by this meter

1. The 2D canvas's rasterization of ~290 strokes, ~90 fills and 14 bitmap copies a frame (the sphere's), plus the lab layers' own: the next
   move is the renderer (WebGL2 on cause, the frame's buffer as its vertex data, the film as one texture sampled thirteen times), behind the
   same `useWasm`-style swap and the same pixel proof; a session of its own.
2. anti-satellites.js's raid (0-12 s): 270 strokes, 30 sprites and `sacrifice.prepare` (180 ms of 6 s) a frame on its own layer.
3. orbit-kick.js: a JS getter or setter between the page and every 2D call while the kick is near (100 ms of 6 s); its law would be one line of
   the kernel's trails (`project(p, center, orbitalRadius * (1 + out))`, its own header says so).
4. The page's 3.4 MB of script (three.js 650 KB, warm-spatial-scene.js 405 KB, the lab 550 KB, @solana/web3.js from a CDN): time to the first
   picture on a phone, not frame time.
