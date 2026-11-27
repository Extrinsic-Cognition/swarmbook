# THE GLASS IS TRANSPARENT, ALWAYS, AND ITS LOOK IS HIS (Oct 17 2026, 20:4x to 21:3x WEST)

His words (WEST), over the debug start's still of the mint hero (two screenshots: the dodecahedron as flat opaque faces, periwinkle toward the
eye, then mint, blue, purple and magenta, over Seiya in the gold):

- 20:4x: "why the fuck is it like this at the beginning and is not like glass?"; "it must be a glass i. dont want to seethis it must be transparent"
- 20:5x, told the fix was queued as a lane: "are you kidding me? what do i gotta do to be able to edit this manually? do you understand the
  anamorphic shadow beef with butterflies i was telling you about or not??"
- 21:1x: "it is a massive failure if i cant edit in my canvas-mcp my dude" (the Canvas)

## The cause (read on main 63c39ecd1)

THE CUTS' device (`lab/CUTS.md`, his Oct 14 "predictable transitions") drew a burst's first tenth of a second as the glass's normals and the
next tenth as a flat gold matte (`lab/theater.js` uPass, the shader's `n * 0.5 + 0.5` and `vec3(0.83, 0.64, 0.29)`), judged by the film's second
alone. The debug start (`app/dl-twelve-clock.js` rule 7, the Nest's word mint/debug-start on his doors) holds the film 5 ms into the second burst
(frame 1141) until the hero is up, so the tenth-of-a-second flash stood as a still for the whole load: the picture he sent.

## The law now

- The glass is a shadow, as the butterflies' and the one overlay's shadows are (`docs/inverse-anamorphic-butterflies-on-the-sleepy-ipad-hypertrace-2026-10-14.md`,
  `room/ONE-OVERLAY-LANDING.md`): the film seen through its faces, its gold leading, its dark halo, its refraction. No fill or flat colour of its
  own, not as a still and not as a flash.
- A flash on the glass (the burst's bloom, the cosmos flash, a hit on one of THE TWELVE, the light between the plates) is light over the film seen
  through it: the shader's `shine()` brightens the film and adds a little warm light, never a mix toward a colour of its own; the film's lines
  still show at the flash's peak.
- THE CUTS' opaque passes come back on this glass only by his word, and then only while the film moves through the burst's first fifth of a
  second (`lab/glass-look.mjs` passAt); a held film (the debug hold, a pause) shows the glass. The box's and Athena's cuts are not in his word
  and keep their device.

## His hand on it, from the Canvas

- The look is the Nest's entry `mint/glass` `{pass: 'none' | 'cuts', by, at}`. The page reads it once at its load (`lab/hero-mount.js` readLook)
  on his house's doors only (loopback, the LAN, a .local name: `asksNest`), never in a browser under automation; `?glass=none|cuts` on the
  page's address wins (a proof's word). With no word, and on optimism.fit, the glass is transparent.
- Three hands of the serving Mac (`tools/embertide-mesh/house-hands.mjs`, his Canvas's hands bar) set it with one fixed word each
  (`tools/mint-glass.mjs`, compare-and-set; the same word again writes nothing):
  - `oldmac.mint.glass.clear` "Mint glass: transparent always"
  - `oldmac.mint.glass.cuts` "Mint glass: the CUTS flash at each burst"
  - `oldmac.mint.glass.status` "Mint glass: what the Nest says" (reads only)
  They reach his hands bar once this lane is landed and the serving Mac's hands runner publishes again (the landing window does it). Any
  other value is his to type (`mint/glass` holds `pass` alone today).
- Read live at 21:2x WEST: `mint/glass` holds no word (null), so his doors show the transparent glass from the landing on.

## Receipt (the new Mac, lysergic_ratata@guidos-macbook-pro-2.local, node v26.11.0, nice 19, every run under tools/dead-tasks/bounded.mjs)

Scratch worktrees under `~/c4-scratch/twelve-dct`: the lane and main 63c39ecd1 side by side, each served by `tools/serve-range` (206 on the
film's ranges), Chrome for Testing headless off every screen; requests to any other origin refused (the Nest's reads among them).

`lab/glass-look.proof.mjs` (new): the mint page with `?debug`, the theater's draws logged with the pass each used, read off the renderer itself
(the uniform uPass of its WebGL program), and the glass's middle pictured at the hold (a disc of a quarter of its radius, read off the
composited page: its texture as a luminance high pass, its mean colour).

| run | pass at the hold (age 0.006, held 614 to 620 ms) | the glass's middle at the hold | passes drawn as the burst plays (38.08 to 38.30 s) | verdict |
|---|---|---|---|---|
| main 63c39ecd1, no word | 1 (the normals) | mean (145, 143, 253), texture 0: the flat periwinkle he sent | 1, 1, 1, 1, 2, 2, 2, 0, 0, 0 | FAIL |
| the lane, no word | 0 | mean (184, 172, 131), texture 6.52: the film through the glass | 0 in every draw | PASS |
| the lane, `--glass cuts` (his word) | 0 (held) | mean (184, 172, 131), texture 6.53 | 0, 0 (held), then 1, 1, 2, 2, 2, 0, 0, 0 while it plays | PASS |

Rule 8 (house CLAUDE.md), on the lane's page served by tools/serve-range:
- `node --test app/dl-twelve.test.mjs`: 17 of 17.
- `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS, the tap at 6.07 s, the film at 10.12 s after 4 s, the song 0.010 s
  behind it; `--tap sphere`: PASS, the tap at 6.05 s.

Tests: `lab/glass-look.test.mjs` (new) 7 of 7; `tools/embertide-mesh/tests/house-hands.test.mjs` 9 of 9 (main 8 of 8, one case added);
`tests/landing-window.test.mjs` 9 of 9; `life-menu/hands-bar.test.mjs` 4 of 4; `lab/sagittarius-flight.test.mjs` 11 of 11. The dyson-society
suite, file by file: the lane 689 of 698, main 681 of 690, the same seven failing tests by name on both (warm-sphere-moment 1, breakdown 3,
heartbeat 9, irradiance 16, ko-edge 9, one-page 8 and 9: main's own). `lab/one-page.test.mjs` 6 now names the page's second read at its load
(the glass's look) beside his tags'.

## Cost

One GET of a ~150 B ref at the page's load on his doors (none on optimism.fit, none under automation); no follow, no timer, nothing at rest.
Per draw a comparison or two (passAt) and, in the shader, one multiply-add where a mix was (`shine()`). A hand's press: one GET and at most one
~150 B ref write. One module of 4.9 kB on the page (`lab/glass-look.mjs`).

## What stands

- The look holds one field (`pass`). More of the glass's look as his to edit (its gold tint, its leading) is his word to give.
- The press reaches his hands bar only after the landing and the hands runner's republish; until then `mint/glass` can be written by anyone
  who types the ref (`{"pass": "cuts"}` or `{"pass": "none"}`).
