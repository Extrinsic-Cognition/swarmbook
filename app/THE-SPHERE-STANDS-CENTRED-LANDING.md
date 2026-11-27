# THE SPHERE STANDS CENTRED (Oct 27 2026)

Lane `lane/the-sphere-stands-centred`, cut from origin/main, Oct 27 2026 17:4x WET, seat claude-32dd11de on the new Mac.

His words, 17:3x WET, over the stop on a 676 px window: "also see the polyhedron structure is off-centered... left is more distant than right check margins".

Measured before (the page served from the house, the stop at 120.67 s): at 676 x 865 the shell's radius 216 px, its centre at 372 px (55 % across)
instead of 338: 155 px of margin on the left, 88 on the right. At 1440 x 900: 504 against 360. The 55 % stood in ten places in six files (the
sphere `app/warm-sphere.js`, its flames, colony and charge in `lab/unboxing.js` (six places), the satellites `lab/orbit-kick.js` and
`lab/anti-satellites.js`, the sacrifice `lab/sacrifice.js`, the hero's mount `lab/hero-mount.js` with the sound invitation's `left:55%`, the lab's
`lab/mint-sphere.js`), from when the title stood beside the sphere; the title is a bar above it now.

The change: one constant, `app/sphere-centre.mjs` `SPHERE_X = 0.5`, imported by every layer that draws round the sphere, so they never split again;
the cubism proof (it runs in the page) and three test fixtures (orbit-kick, sacrifice) take the same centre.

After: 676 x 865, margins 122 and 122, the invitation centred at 338; 1440 x 900, 540 and 540.

Proofs (the new Mac, nice 19): every suite that reads the six files, 26 files: no red that main does not have (the ten on both: main's own, among
them THE GOLDEN FLASH ONLY, the build's shipped files, the hero mounts the sacrifice "with two lines"). Rule 8: `node --test app/dl-twelve.test.mjs`
green and `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button` PASS, `--tap sphere` PASS, on this lane's tree served by
`tools/serve-range`.
