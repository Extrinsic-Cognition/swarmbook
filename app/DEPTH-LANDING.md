# THE FILM IN DEPTH: the landing receipt (Oct 18 2026)

## Music-shaped elliptical motion (Oct 18 follow-up)

His new direction: "can you make the trajectory follow a lyssajudrean elliptic instead of making it concentrate on the mouse".
This explicitly retunes the recovered preview's motion. The film now carries a shallow, tilted elliptical path with a 3:2 harmonic,
soft entrance and exit over the Sagittarius passage, and a fixed centre. Mouse movement changes its phase, tilt and amplitude slightly;
it never becomes the centre or the destination. Fresh head tracking still leads when available.

The path samples the existing soundtrack score through `hearAt` and a softened `throbAt`: slow energy opens the ellipse and bass/speech
accents give it a small breath. It follows the displayed film's seconds, including when sound is muted. There is no new audio context,
media element, live vision pass or optical-flow estimator. Five score samples plus a few trigonometric operations are added per film frame.
The gold depth classifier and projection are retained. A narrow blend to the original picture fixes bright-edge tearing at the aperture;
a paired-neighbour flash test rejects broad pale cloth edges. The rim adds one texture sample per pixel; the flash guard adds four samples
only when the prior flash criteria survive (at most 24 per view pixel), with no new pass or texture. Smaller excursions reduce internal distortion.

Automatic motion stops for reduced-motion preference. Pointer input can select a still viewpoint in that mode. Pausing settles the viewpoint
and then stops drawing; hidden, offscreen and out-of-passage states cancel pending work. The normal URL proof is now `--input orbit`;
`--input mouse` explicitly requests the legacy direct-pointer mode. The module cache chain is `society-depth-orbit-1` -> `depth-orbit-1`.

Validation on NewMac, headless Chrome for Testing 156, Range-capable server on port 18763:
- Integrated runtime `b0f0ac336`: 44/44 focused depth, film-clock and entry tests pass, including natural scene entry without a pointer or seek.
- `app/dl-depth.proof.mjs --input orbit --at 62.9,65.6,68.5 --size 839x1053`: 36/36 checks pass. The ordinary URL starts motion by itself;
  trusted mouse movements alter composited pixels while keeping paused film time fixed and reusing the depth field.
- Playback: 80 draws for 80.0 film frames, 79 for 78.3, and 40 for 39.7. Each paused settled interval records zero draws.
  CPU submission samples are 0.0-0.2 ms; GPU completion time is not measured. Music motion adds no independent animation clock.
- Sound proofs on the same runtime before the shader-only refinement: button 7/7 and sphere 7/7, no browser errors and no picture restart.
  A probe aimed at the sphere during the full-frame Sagittarius shot was invalid because that target is hidden there; the normal visible-sphere
  proof passes. The first orbit proof also exceeded the scene end during its last capture; its bounded capture was corrected and all checks rerun.
- Rendered stills at 62.9, 65.6 and 68.5 seconds were inspected. The aperture is clean and broad pale armour is less eroded. Fine lightning-edge
  ripples remain in the colour-derived depth; this is a retuned cinematic treatment, not a reconstructed 3D scene or live optical flow.
- Independent source review checked activation, film-frame pacing, finite settling, camera priority, reduced motion and bounded excursion.

The target at a given film second is deterministic; the rendered eye eases toward it and becomes identical after settling.
Live camera input is not proven here. Public publication is outside this local preview change.

## Recovered preview (Oct 18 follow-up)

The surviving source is TOTEM's `scratchpad/one-preview/index.html`, from Claude session
`bd4fbc1f-cf79-4092-828b-bd41f0fe4b8c`. SHA-256: `479231f74427307f684eadfef76f83286cf9bcec94e12c972305202ec0ebecf8`.
The raw session's line 21006 describes that preview at 03:21 WEST: lightning in front, cloth at the screen, rest behind,
mouse standing in for the silent Eye. At line 21010, 03:22:57 WEST, he selects: "Yes: send the 3DS head-tracked depth brief
to BRAND now, ahead of the cloth cutting". The detailed brief at line 21043 describes this source and then proposes offline
layers. That later proposal is the assistant's; the current four-rigid-layer renderer is not the preview described before his selection.

The recovered rendering settings are a 240 x 135 gold classifier, a 5 x 5 smoothed depth field from -10 to +4 mm,
a separate thin-flash layer at +30 mm, and seven inverse-projection steps. Rest distance is 550 mm, mouse reach is 120/80 mm,
and the source's 3D slider defaults to 1. Movement eases by 25% per animation frame until within 0.2 mm, then stops.
These are recovered source defaults, not a claim that a particular slider value was explicitly approved.

The earlier range-only repair and its verification below are historical. They exposed the rigid-layer cutout artifacts and
were not merged on their own. The repair now restores the recovered smooth-window treatment to the existing film and retains
automatic mouse fallback, fresh-camera priority, the depth canvas above the opaque film pass, and the existing media clock.
The colour-derived depth remains an approximation: it can bend edges and place pale cloth regions too far back.

Validation on `2d82121eb`, NewMac, Chrome for Testing 156, `tools/serve-range` on port 18763:
- `node --test app/dl-depth.test.mjs app/dl-twelve.test.mjs app/warm-entry.test.mjs`: 38/38 pass.
- `app/dl-depth.proof.mjs --input mouse --at 62.9,65.6,68.5 --size 839x1053`: 33/33 pass on the ordinary URL.
  Composited picture differences across the paused pointer sweep average 15.32, 18.22 and 9.60 RGB levels; film time stays fixed.
  The 20 cm sweep moves the flashes -57.7 px and the back +17.9 px. Each still-pointer check records zero draws;
  playback records 45 draws for 44 film frames. Sampled CPU submission time is 0.1 ms; GPU completion time is not measured.
- `app/dl-twelve.proof.mjs --tap button` and `--tap sphere`: 7/7 each, zero browser errors; neither tap restarts the picture.
- Independent source review checked the original shaders, coordinate registration, defaults, camera reference and finite easing.
  It caught and fixed an immediate hide on pointer exit: the window now eases back to centre, then sleeps.
- Screenshots at 62.9 and 65.6 seconds were inspected. The rigid cutout holes are gone; the recovered classifier's bright-edge
  distortion remains, especially at large pointer offsets. This restores the earlier treatment, not reconstructed scene geometry.

Live camera tracking is not proven by this receipt; browser verification used the automatic mouse fallback, and camera selection,
reference reset and return to rest were exercised by unit tests. The original 3D slider's default of one is retained without adding a new control.
The cache chain is `society-depth-window-1` -> `depth-window-1`. No playback or audio code changed.

## Restore the existing viewing range (Oct 18 follow-up)

His correction: "it is not the glass configuration i approved", clarified as "Golden Sagittarius depth effect".
The preceding mouse fix had also reduced the synthetic viewpoint from +/-12/8 cm to +/-3/2 cm without a request to retune it.
That reduction is reverted. Automatic mouse fallback, camera freshness priority, the visible stacking fix and framebuffer Y correction remain.
The four fixed depth planes, 55 cm viewing distance and layer asset remain those of the carried branch. This restores the prior numerical
configuration; it does not establish that the four-layer candidate matches his earlier visual approval, which still needs its source record.

NewMac validation on `338ad008d`: `node --test app/dl-depth.test.mjs app/dl-twelve.test.mjs app/warm-entry.test.mjs` passes 35/35.
The normal-URL pointer proof passes 30/30 at 62.9, 65.6 and 68.5 seconds, including visible picture changes at fixed film time.
The restored +/-10 cm sweep moves the foreground -57.7 px and background +41.8 px across its full span; mean picture-region RGB
differences are 32.34, 32.31 and 37.23. Still-pointer checks report zero redraws. Both real-browser sound proofs,
`app/dl-twelve.proof.mjs --tap button` and `--tap sphere`, pass 7/7 on the same commit and Range-capable server.
These checks prove operation and sound continuity, not a match to his approved appearance. The older reduced-range receipt below is historical.
Visual inspection of the restored +10 cm frame at 62.9 seconds shows pronounced cutout boundaries and background-fill artifacts.
The range restoration remains on its repair branch, unmerged: stronger movement is not a sufficient visual repair.

## Automatic mouse fallback (Oct 18 correction)

His words in the mint preview: "arent you supposed to use mouse as a fallback?" The ordinary local page previously selected Eye-only mode,
so its depth canvas stayed hidden at 62.9 seconds when no `eye-mac` body arrived. Mouse control existed only behind `?depth=mouse`.

The ordinary local page now uses the mouse while the Eye has no fresh body. A fresh body takes priority; the existing two-second freshness
timeout restores the latest pointer position without requiring another mouse move. Pointer leave clears only the pointer, and touch scrolling
does not control depth. Public pages use the mouse without connecting to the house. Explicit `eye`, `mouse`, `test`, and `off` modes remain.
No new timer, camera request, media seek, or rendering loop was added. The mouse follows the same four-layer projection and frame callbacks.
`dl-depth.proof.mjs --input mouse` exercises the normal URL through trusted browser pointer movement, without a depth override.

The first pointer proof passed its state checks while the actual picture did not change: the opaque `hero-box` anime pass covered the depth
canvas. Depth now sits immediately above that pass, below the existing foreground and controls. The proof compares the composited screenshot's
central picture at opposite pointer positions with film time fixed, so renderer counters alone cannot certify this again. Visual inspection also
found the background pyramid was sampled upside down; only its framebuffer lookup is now Y-flipped. Pointer travel is limited to a synthetic
viewpoint of +/-3 cm horizontally and +/-2 cm vertically to limit artifacts from the four coarse layers; actual Eye measurements are unchanged.

NewMac validation on `e03d1f8c0`: the 35 focused depth, film-clock and entry tests pass. The normal-URL mouse proof passes 30/30 checks at
62.9, 65.6 and 68.5 seconds, including visible screenshot differences and unchanged paused film time. Across the +/-2.5 cm pointer sweep,
the foreground moves 14.4 px against a 10.5 px background movement; the picture-region mean RGB differences are 13.29, 16.83 and 9.75.
Each still-pointer check records zero redraws; playback records 45 draws for 44 film frames. Screenshots were inspected, not just counters.
Both trusted sound taps (button and sphere) pass 7/7 on `53e9fd286`, after the composition and framebuffer fixes; the later change only reduces
pointer travel. Live camera tracking is still unproved. This is the existing four-layer effect during 58.8–71.0 seconds, not reconstructed 3D.

The original landing receipt follows; its Eye-only default and stamps are superseded by the correction above.

His words, WEST: 01:55 "trying to provoke some depth effect with the camera where based on head moving aroudn we can cause nintendo 3Ds typa
shit"; 03:04 "why the hell dont we make it likd nintendo 3Ds my dude?"; 16:30, over his pane on the cloth sequence: "do you think i built the
depth version of this one because i am retarded? why the fuck is that not put here my dude?". The lane was parked on his 04:0x tap; this is
its carry over main (`lane/the-film-in-depth-carried`, 94a05685f over main 18e318b9d).

**What it does:**
- Over the cloth sequence (58.8 to 71.0 s, frames 1762 to 2128), the picture is four layers cut offline: the back, his body, the cloth and
  the flashes (`app/saint-seiya.layers.bin`, 3,171,786 B, stripped before GitHub like the film).
- His head is the eye of an off-axis window: the near layers slide against the far ones.
- Where the head comes from: the Eye on a house page; `?depth=mouse` (the pointer); `?depth=test`; `?depth=off`.
- Straight ahead, with no head, or outside the span, the canvas is hidden and the page's own picture shows.
- It never seeks, plays or pauses the film or the song (rule 8).

**Cost, measured on the new Mac** (headless Chrome for Testing 156, served by tools/serve-range, 206):
- A draw takes 0.2 to 0.4 ms (two passes).
- Playing with the eye off the axis: 45 draws for 44 film frames.
- At rest: 0. A still head on a paused film draws nothing in 0.4 s, and straight ahead the window is hidden.
- lysa: not measured.

**Proofs, on the carried tree, against main on the same machine:**
- `node --test` over app/, lab/one-page and lab/sagittarius-flight: carry 309 of 313, main 302 of 305.
  - The reds on both are main's own and the same by name: one-page's file list, a tracenet's walks, her cut's pose, the build's files.
  - The carry's one other red was its strip test reading `tools/house-mirror/strip-families.txt`, which the test archive lacked. With the file
    beside the tree, `app/dl-depth.test.mjs` passes 8 of 8.
- Rule 8:
  - `node --test app/dl-twelve.test.mjs` passes 17 of 17.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the served carry> --tap button`: PASS.
  - `--tap sphere`: PASS. The sound came in where the picture was, and the picture never went back.
- `app/dl-depth.proof.mjs` passes 21 of 21 at frames 1952, 1966 and 2053:
  - The page's own Pause holds the film.
  - The window is hidden straight ahead.
  - 20 cm of head moves the flashes -57.7 px and the back +41.8 px.
  - A still head on a paused film draws 0.
  - Playing: 45 draws for 44 frames.

**Not proven:**
- His live head. The Eye app runs on the serving Mac, but no `wind.body` reached the Nest in its last 20,000 entries at 16:4x WEST. On his
  pane the window stays hidden until the Eye sees him; `?depth=mouse` drives it by the pointer meanwhile.

**Stamps:** warm.html asks for `warm-entry.mjs?v=society-depth-1`; warm-entry.mjs asks for `hero-mount.js?v=depth-1`; hero-mount.js asks for
`dl-depth.js?v=depth-1`. A landing that moves warm.html's stamp first (the flask lane) makes this a one-line re-carry.
