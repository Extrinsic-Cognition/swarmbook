# HER THREE WISHES: her making starts with the three of her twelve that carry a wish charge (Oct 29 2026, lane/her-three-wishes, claude-16e5b1b6)

**His words,** Oct 29 2026 UTC, over a screenshot of "Give me my colours." (her Goldberg ball with its eye, her twelve unit1s round it, a grey pentagon
inside a few of them):
- 17:29: "u been following what i said about the 12 things here or not dude? you should make that it starts with 3, the ones you can see that have a
  "wish charge" in them... you get what i mean or not? gamify this shit dude please..."
- 17:31 (to claude-1a67b2d3): "like gamify the dopamine from starting with 3 pentagons, using all 3 wishes and then unlocking a 4th pentagon and getting 4
  wishes now and so on... you get what i mean or not?"

**His lineage** (`tools/hypertrace/hypertrace.py`, both Macs, his typed lines only): Sept 24 18:03 "i want harmony to feel like a inventory or a menu for
real life... cyberpunk or watchdogs or XCOM"; Oct 13 04:52 "he is the genie that can grant 3 wishes"; Oct 17 03:19 "nefertiit comes and offers 3 wishes
(aka: trial for 3 ai calls before quitting)"; Oct 21 12:05 "keep the 12 unit1 satellites steady"; Oct 27 03:26 "the entire point of gamification of spending
with the mmo effects". The governance seat's §12 (`docs/governance-over-the-alien-technology-the-pedigree-hypertrace-2026-10-29.md`) reads the same lines
as the money: the wishes are inference sponsored as CAC.

## What stood (main 450b57a94)

- Her making drew her as every glass does: unit0 and all twelve unit1s.
- His "wish charge" is the eye-stalks' pentagon. `room/lyssajudron.mjs` draws `eyes`, a five-sided disc (`CircleGeometry(..., 5)`), on each of the score's
  `EYE_SEATS` (0, 1, 2). It is painted with her eyes. Out of the box her eyes are bare vinyl, `#9E9E99`, so his picture showed three grey pentagons. A
  pentagon seen at a slant reads as a triangle.
- Nothing on her making counted anything. There was no inventory and no wish.

## What changes

- **The law** (`app/dl-her-wishes.mjs`, new, pure): she starts with `CHARGED`, the score's eye seats (0, 1, 2), one wish in each. The other nine chairs
  are not hers yet. **His ladder** (17:31): a rung of n pentagons holds n wishes. When all n are spent, the next pentagon comes with n + 1 wishes, up to her
  twelve. `ladder(spent)` gives the rung, the wishes left and the next pentagon; `slots()` gives the bar; `count()` gives `3/12`.
- **The mint's mount of her** (`app/dl-her-colours.js` `stageHer`, the new option `wishes`): the nine chairs are emptied through the renderer's own seam,
  `place(seat, null, {gone: true})` (HER UNIT1 AWAY). Nothing of them is drawn. Two instanced draws ride her twelve's own
  instance matrices, shared with the satellites, so no matrix is copied a frame:
  - **the nine ghosts:** the satellites' own Goldberg geometry, drawn as its seams and a faint rim in her gold paint. They turn as a free unit1 turns.
  - **her three charges:** a gold halo behind each of her three. It breathes on her beat by her glow's law (0.45 + 0.45 (1 - beat_phase)^2).
  An empty chair keeps its place on her wire (the renderer writes its matrix at size 0), so the ghosts stand where the unit1s would.
- **Her wish bar** (over her, under "Give me my colours."), an MMO slot bar in her entrance's grammar: boss-intro.mjs THE BAR has her three wishes as three
  gold thirds. The slots:
  - three gold slots holding her pentagon in her eyes' paint;
  - the 4th slot, a faint gold pentagon: the one his ladder brings when the three wishes are spent;
  - eight dark slots with a dashed ring;
  - the count, `3/12`.
  The three charges light one after another as her making opens. Paint her eyes and the pentagons on her, and on the bar, take that paint. No word on it:
  a count and a state (his Oct 29 06:07 rule).
- **Not changed:** `room/lyssajudron.mjs` (every other glass draws her twelve as before; `dl-her-wishes.test.mjs` fails the day her renderer names a wish),
  her refs for the key, the drum, the field, the song, Continue, and her picture in the kit. The picture now shows her three, the ghosts and her charges.

## Cost

- While her making is open: two instanced draws more, two uniforms written a frame, no matrix copied (the shared instance buffer the renderer already
  uploads), and 39 DOM nodes built once with her making. Measured below.
- At rest (her making closed or hidden): nothing. Her frames stop with the page's visibility as before, and on close the ghosts' and charges' materials and
  the halo's quad are let go with her.
- On the wire: one 4.2 KB module more (`dl-her-wishes.mjs`, 4,218 bytes), found by `tools/page-files.mjs` through the static import.

## Measured

All of it on this lane's tree, rebased on main a3f571239, on the new Mac. The page was served by `tools/serve-range` alone (206), as the lander's
gate serves it. Every browser was a headless Chrome off every screen.

- **Seen, before the hand.** Her making at 1440x900 and at 673x873 (the phone's single column): three charged of twelve. Her three stand with their grey
  pentagons and gold halos, the nine ghosts ride her wires, and the bar reads three gold slots, the 4th slot's faint pentagon, eight dark slots and 3/12. No
  error was thrown and the console said none at either size. Painted by the die: the pentagons, on her and on the bar, took her eyes' paint, and the ghosts
  took her gold. Through the walk from SKIP TO THE MINT to the kit, her picture in the kit, Your Swarmy, shows her three, the ghosts and her charges.
- **Her proof** (`app/dl-her-colours.proof.mjs`): 16 of 16. Its four new checks:
  - her renderer's own state holds the nine chairs (3 to 11) as gone, and the mount holds 9 ghosts and 3 charges;
  - the bar reads `cccneeeeeeee` and 3/12, its charges in her eyes' paint;
  - the GPU took every shader;
  - once the die paints her eyes, the bar's charges take that paint.
  The shader check is not empty: with one ghost shader broken on purpose, it FAILED, and it passed again on the real one.
- **The law and the bar** (`node --test`): `dl-her-wishes.test.mjs` 5 of 5:
  - the three are the score's eye seats;
  - the charge is the renderer's five-sided eye disc in her eyes' paint, and an empty chair is drawn at size 0 with its place written, read out of
    `room/lyssajudron.mjs`;
  - only the mint's mount empties chairs;
  - his ladder, rung by rung to her twelve;
  - the bar's states.
  `dl-her-colours.test.mjs` 10 of 10, one new: on a bare DOM the stage is asked for [0, 1, 2], and the bar shows three charged, the 4th next, eight empty and
  3/12, in her eyes' paint before and after the die.
- **The suites,** `node --test` over the app's 51 files: 402 of 405. The three reds are main's own: dl-athena's THE DEPTH, warm-sphere-moment's "her cut",
  dl-paywall's Harmony ice and accent tokens. They were red again with main's own files put back in this tree (57 of 60 in those three files), and none of
  them reads a file this lane touches.
- **The other proofs that walk her making:** `dl-her-song.proof.mjs` 12 of 12, and 12 of 12 with `--phone`. `dl-path-to-the-kit.proof.mjs` 26 of 26, real
  presses from SKIP TO THE MINT through her making to the kit, at 1440x900 and 673x873.
- **The cost, timed** (scratch bench, her stand-in driven 300 frames by hand, the GPU made to finish by one `readPixels`; 900x860 css px at 2x, 1800x1720 px;
  median of 7 runs each). Her twelve as on every glass: 0.171 ms a frame. Her three with the nine ghosts and her three charges: 0.169 ms. That is no
  difference above the runs' spread (0.150 to 0.181 ms). The nine hollow shells cost what the nine solid unit1s did. All 341 frames rendered. The renderer
  samples at most 18 times a beat, which it did 3 times here, so this is the render's cost. That is the part the wish layer adds to.
- **The site's build** (`tools/page-files.mjs` pageFiles): it reaches `dl-her-wishes.mjs`, with nothing missing.
- **Rule 8,** on this lane's page served with byte ranges:
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS. The film never went below its second at the tap (6.05 s).
  - The same with `--tap sphere`: PASS (6.05 s).

## Edges, said

- **Spending a wish was not built here.** In his lore a wish is one of the trial's AI calls, and the Space Router's door spends it. Since
  lane/her-wishes-unlock (`HER-WISHES-SPENT-LANDING.md`), a chamber that fires on her making spends one, and the fourth pentagon comes in her entrance's slam.
- **A pentagon beyond her three** has no disc in her renderer, which draws `eyes` only on the three eye seats. The 4th rung on her body (seat 3 out of its
  ghost, its halo on) works through `wishes`, but its pentagon would show only on the bar until her renderer, or the mint's mount, draws one there.
- **After the twelfth** (`ladder` at her twelve with all twelve wishes spent): his to say.
- **Her wishes stay on the page.** They are not in her two refs, so the key does not carry them to the Nest yet (the plan's lane 4).
- **The cache word** `?v=her-1` in `warm-entry.mjs` is untouched (another seat holds that file). The page and the dev road answer no-cache. optimism.fit
  takes the new file by its own headers at the deploy.
- **Not deployed.** optimism.fit takes this at his word.
