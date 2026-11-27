# THE FLAMES ARE THE ANIME'S COLOUR, AND THE SWELL BEFORE THE EXPLOSION (Oct 27 2026)

Lane `lane/the-flames-take-the-animes-colour`, cut from origin/main, Oct 27 2026 15:2x to 15:4x WET, seat claude-32dd11de on the new Mac.

## His words

Oct 27 2026 15:2x WET, over a screenshot of the hero at his Pegasus rising (the dodecahedron's faces Pegasus blue, the corona round it gold
flames): "i would like to start seeing a blue glow radially expand silently here just like warming up to the nuke right after when he goes
ballistic u get what i mean or not? like i would like to see proper coloring synced with the color of the anime".

## Before

THE CHARGE (`lab/the-colony.mjs` chargeAt, `lab/unboxing.js` drawCorona, frames 2795 to 3139, 93.26 to 104.74 s): flames of one fixed palette,
orange to gold to cream (`vec3(0.95, 0.52, 0.10)` ... `vec3(1.0, 0.95, 0.80)`), whatever the film showed: gold flames round Pegasus blue.

## The change

1. **The film's colours, measured once** (`tools/charge-colors.mjs` writes `lab/charge-colors.js`): each frame of the charge decoded to the picture
   alone at 80 x 53; its cosmos colour, the mean of its pixels weighed by saturation squared times value (the lit, saturated light leads; ink and
   paper weigh nothing), smoothed over 5 frames within its shot (a cut: the frames' mean absolute difference past 38). The cuts it found are the
   law's own acts (2885, 2975, 3020, 3080) and the flash cuts between. Read: 2795 #8c7540, his golden eyes 2885 #ddc553, Dolbar 2975 #494759,
   "Burn!" 3020 #c18d2a, Pegasus 3080 #487ebc, the explosion 3139 #1d458e.
2. **The flames take that colour** (`the-colony.mjs` tintAt, brightened to its strongest channel so a dark shot still lights; the corona's shader:
   the colour deepened where the fire is thin, itself in its body, near white where hottest).
3. **The swell** (`the-colony.mjs` swellAt, the shader's glow): from his Pegasus rising (3080, 102.77 s) to the explosion (3139), smootherstep 0 to
   1: a soft glow of that colour spreads from the rim to past the stage's farthest corner (uReach, the corner in the rim's radii), with a gentle
   front; silent: the flames' flare on the soundtrack fades by 85 % as it rises. The explosion (THE COLONY) takes over at 3139 unchanged.

## Cost

- At rest: nothing. Per corona frame: three uniforms more, a lookup in a 345-entry table, two exp and two smoothstep a pixel in the one pass.
- The measure: one ffmpeg decode of 345 frames at 80 x 53, 0.14 s wall on the new Mac, run once; `lab/charge-colors.js` is 2.3 KB.

## Proofs (the new Mac, nice 19)

- `node --test lab/the-colony.test.mjs app/warm-cosmos.test.mjs lab/rite-unit1s.test.mjs`: 45 of 45 (one new: gold on his eyes, blue on Pegasus
  deepening to the explosion, every tint at its strongest channel 1, the swell 0 to 1 from Pegasus to the explosion, the flare at most 15 % at the
  swell's top, chargeAt null from the explosion; the tool's three pure functions).
- `lab/fields.test.mjs`, `lab/irradiance.test.mjs`, `lab/one-page.test.mjs`, `lab/unboxing-plan.test.mjs`: 4 reds, all main's own (the same four
  red on main's checkout: THE GOLDEN FLASH ONLY, warm.html's entry, the build's shipped files, the tracenet's).
- Rule 8 (a change under the mint's lab): `node --test app/dl-twelve.test.mjs` 19 of 19 and `app/dl-twelve.proof.mjs --url
  http://127.0.0.1:8988/app/warm.html --tap button` PASS and `--tap sphere` PASS, both on this lane's own tree served by `tools/serve-range` (the
  first hand at 15:36 WET was refused for naming only the proof in its commit).
- Seen in a browser on the served page (`?debug=99.5`): at 103.67 s the corona Pegasus blue, its glow spread wide past the swarm; at 106.68 s the
  explosion's flash, gold-white as before.

## Not done here

- The explosion's own ring (THE COLONY's front, `vec3(1.0, 0.84, 0.42)`) stays gold: the nuke is gold-white in the film too (the frames after
  3139). His word if it should take the film's colour as well.
- The module stamp `the-colony.mjs?v=the-cut-1` is kept (four importers share it): JS is not served immutable (`_headers`), so a deploy reaches a
  returning visitor at his next load.
