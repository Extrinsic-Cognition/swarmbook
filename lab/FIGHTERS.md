# The fighters from the disc (Oct 14 2026, 15:30 to 16:1x WEST; first landed 15:54)

His words, 14:2x WEST: "i want to have athena outside of the dodecahedron using the hades game asset dude please"; "then ofc i want to see
saint seya as 3D model going up there" (the conversion, his tag 61.767 s); "there is a reason why i got hades installed on pelino dude come on".
Athena landed earlier the same hour (`athena.hades.glb`, LANDING.md's last section). This lane does the same for the three fighters the hero
needs, with the game's own clips on the skin.

| file | who (disc number) | bytes | vertices | triangles | joints | clips |
|---|---|---|---|---|---|---|
| `seiya.hades.glb` | Seiya in the Pegasus Cloth (00) | 2,041,392 | 8,192 | 4,000 | 60 | 73 + face |
| `seiya-sagittarius.hades.glb` | Seiya in the Sagittarius Cloth (15) | 2,053,672 | 8,448 | 3,828 | 68 | 73 + face |
| `ikki.hades.glb` | Ikki in the Phoenix Cloth (04) | 2,030,984 | 8,633 | 4,021 | 68 | 72 + face |

Each is 1.65 m tall standing straight (lab/braindance.json's Seiya), faces +z, y up, and stands on y = 0, the game's own floor. The glbs and
the pictures are the game's art: `tools/house-mirror/strip-families.txt` strips `*.hades.glb` and, from this lane, `fighters-pictures/`
before GitHub. The disc's files were never written into the house.

## The cost line

Before: 2.0 MB a fighter off pelino (the six files named below), one ssh each, a few seconds; the clips' keys from the same bytes;
predicted glbs of about 2 MB (a third of it the clips' accessor index), 4,000 triangles a fighter, a build under a second.

Measured (this Mac, nice 10, while it serves the house):

- **pelino:** 5,991,893 B in three ssh calls of 4.34, 3.57 and 3.76 s wall (pelino's own read 676, 615 and 739 ms; 2.64 MB of base64 a
  fighter on the wire). One more call of 3.43 s read her five files (859,076 B) to prove her road is unchanged. Each answer's size and first
  16 bytes equal the scout's table. Afterwards `embertide-app/tools/nest-join/dead-tasks/pelino.sh` (dry, 1.1 s on pelino) said "would end:
  nothing" and "left behind and not called dead: none". Nothing was written there.
- **the tool:** 145 to 372 ms a fighter over two builds (`hades-glb.mjs`, all clips, one core, the Mac's load moving). A glb's bytes: JSON
  640 to 645 KB (4,199 to 4,225 accessors: two per channel, 2,538 to 2,573 channels), BIN 1.39 to 1.41 MB of which 823 to 826 KB are keys,
  89 to 119 KB the texture PNG, the rest the mesh. The JSON parses in 2 to 3 ms in node.
- **a picture:** 230 ms for a sheet of seven 192 x 320 cells (`hades-picture.mjs`, its own software rasteriser: no window, no GPU).
- **the tests:** 27 in three files, 66 ms (`node --test tools/hades-glb.test.mjs tools/hades-disc-read.test.mjs tools/hades-picture.test.mjs`).
- **three.js:** the hero's own r185 GLTFLoader parses a fighter in 9 to 33 ms in node (`tools/hades-three-check.mjs`).

At rest a glb costs nothing: no clip plays until a page asks for one.

## How each number was read

- **The files** (`tools/hades-disc-read.mjs --who 00|04|15 --out <scratch>`): the archive indices, places and sizes are the brief's, each
  checked against `~/code/the-disc-rigs-2026-10-04/scout/afs-table.json` before the read (index, offset, size, first 16 bytes, all 18 rows equal).
  Read: `NN.gmi` (the body, CMPS: `434d5053` at byte 0), `NNh.gmi` (the hair, plain: `19030420`), `mNN.mpl` (the face clip), `NN.mpl` (the
  motions), `TEX\NN.TPL`, `TEX\NN_FACE.TPL`.
- **The models** (`readGmi`, unchanged): 00 has 10 body groups and 4 hair groups, 04 has 11 and 2, 15 has 17 and 7. The hair is on the body's
  joint table name for name (checked in `build`). Every group's texture slot is 0 and each header's +0x1e says one slot (GMI.md); the CLI
  refuses any other slot.
- **The textures:** each `NN.TPL` is an FJF of two TIM3: a 512 x 512 picture with its own 256 colours (263,232 B) and a 128 x 128 one
  (17,472 B) that no group of these models names (its use is unknown; it is not in the glb). Each `NN_FACE.TPL` is an FJF of seven 256 x 256
  faces with no palette of their own (65,600 B each), on the body's. The glb draws the body picture as it is on the disc: none of the seven
  faces of 00 and 15 equals its top-left quarter (6,494 to 65,526 pixels differ), face 4 of 04 does (0 differ). `--face k` paints face k over
  the quarter and `--faces 2,6` adds others for a page to swap, as for her (each costs a 512 x 512 PNG, about 120 KB).
- **The clips:** `NN.mpl` is an FJF of 73 (00, 15) or 72 (04: no motion 3080) entries with flag 0x4000; its u16 ids, read after the offsets
  and the end word (CONTAINER.md 1.1), are the motion numbers 0, 10, 20 ... 5040. The entries are plain GAI (`18080320` at byte 0 of each),
  not CMPS-wrapped as the brief guessed; the CLI unwraps one if it ever is. `clip()` reads every track of every node (GAI.md "The layout").
- **The animations** (`channels()`): clip node k drives joint k, the names checked; key time / 30 = seconds (GAI.md "The rate": 30 a second
  is likely, not measured); a rotation key as it is, flipped where its dot with the key before is negative (2,234, 2,253 and 2,207 keys:
  the same rotation, and the slerp the engine makes, `func_002AC3A0`); a position key whole, except the waist's x and z, zeroed: the engine
  adds them to the placement and zeroes them in the waist (ELF 0x158B80..0x158C10, disc-chunks RECEIPT), so each clip plays in place and
  `extras.travel[k]` holds the placement's move over clip k in metres ([x, z], glTF axes; clip 01 of Seiya: [0, 3.163]). No move clip has a
  scale track.
- **The scale and the floor:** the rest pose (the game's bind, a T with the waist at the root's origin) is 1.65 m from the feet to the top
  of the hair: 0.09584, 0.09564 and 0.09223 m a game unit (the braindance lane reads the engine's unit as 0.10 m). The floor is y = 0 of the
  root joint: the clips lift the waist 8.1 units above it. At clip 00's first key (the pose the nodes are stored in) the lowest point
  of each figure is 0.7 mm below, 0.7 mm below and 0.2 mm above the floor, and the figures stand 1.335, 1.349 and 1.570 m tall.
- **Two proofs:**
  1. `tools/hades-chunk-check.mjs <glb> ~/code/disc-chunks-2026-10-04/chunks/NN.chunk.json` compares every key of every clip of the glb with
     the Oct 5 decode of the same disc (two decoders agreeing on 2,156,657 keys). 00: 73 clips, 43,868 keys (the RECEIPT's number for
     PEGASUS); 15: 43,695; 04: 43,515. 0 differ: rotations and positions are float32 equal (up to the sign flips above; the waist's y equal),
     and every motion number equals the chunk's code. The face clip: 83, 82 and 85 keys of rotation, position and scale on the six face
     joints, equal to the chunk's face block, and no track on any other joint. Key times are within 6.7e-6 frames (float32 seconds). The source of the glb's keys is
     the disc's own bytes read today; the chunk is the check.
  2. Her road is unchanged: `hades-glb.mjs --disc <her files> --out x.glb --face 3 --faces 0,5 --stance lab/athena.hades.stance.json`
     writes a file byte-identical to `athena.hades.glb` (660,836 B, sha256 171d1d145ae7b510...).

## The pictures (`fighters-pictures/`, drawn from each glb's own bytes by `tools/hades-picture.mjs`)

The rasteriser parses the glb, samples a clip by glTF's LINEAR rule (slerp, lerp), chains the nodes, skins every vertex with world x
inverse bind, and draws the textured triangles with a depth buffer: what a page would draw from the same bytes.

- `seiya.png`, `seiya-sagittarius.png`, `ikki.png`: the bind pose (the T, hanging below the floor line, as the game stores it), the stored
  pose (clip 00's first key), clip 00 at half its length, and clip 01 at 0, 1/4, 1/2 and 3/4. Seen: the Pegasus Cloth in silver and red,
  the gold Sagittarius Cloth with its wings, Ikki's purple Phoenix Cloth; each on the floor line in the stance.
- `*-clips-00-26.png`: clips 00 to 26 at half their length, from the side (yaw -70): the movement block, motions 0 to 260.

What each clip is, the disc does not say (GAI.md: UNKNOWN). By eye in these pictures and by the travel:
- **00 (motion 0): the idle**, the fighting stance, 59 frames (34 for Ikki), no travel, loop word 1. Seiya crouches in it (1.335 m), Ikki
  stands nearly upright (1.570 m).
- **01 (motion 10): a run forward**, 16 frames, 3.16 m of travel a cycle (5.9 m/s at 30 frames a second), loop word 1: the legs cross over
  in the four frames, arms back.
- **No walk at a walking pace among 00 to 26 by eye.** 02 (motion 20) moves back 2.2 m in 18 frames, 03 and 04 (30, 40) step sideways 3.2 m
  in 16, 05 to 08 (50 to 80) are dashes (6.1 to 6.8 m in 19 frames; loop word 0 for 50, 60, 70, unknown for 80), 09 (90) a lunge forward
  (5.0 m in 14 frames). Clips 27 to 72 (motions 1000 to 5040) were not looked at.
- `extras.loops` is the loop word by motion number from the RAM of the four recorded fighters (disc-chunks `out/loops-by-code.json`, 39
  numbers), null for the others: it is not on the disc, UNPROVEN per clip.

## For a page (the unboxing session's hero)

```js
const gltf = await new GLTFLoader().loadAsync('seiya.hades.glb');   // lab/ itself: aiolos serves /intro/a/b/c at most
const mixer = new THREE.AnimationMixer(gltf.scene);
mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, '00.0')).play();   // the idle; '01.10' the run; names = gltf.parser.json.extras.clips
// on a cause: mixer.update(dt) and draw; at rest nothing runs (no clip plays until one is asked)
```

- Names: `extras.clips[k]` = `"<index>.<motion number>"` (`"00.0"` ... `"72.5040"`), `"face"` the MNN.MPL clip, 8 frames, on the six joints
  the engine plays it on (`extras.face_joints`: the mouth and teeth, the ELF's table at 0x3E6F20). The file itself has rotation, position
  and scale tracks on every joint but the root (177 channels for 00); the first build took them all, so a page playing it over the idle
  would have pulled the body; the landed glbs keep the six (18 channels). The idle has no track on those six, so the two play together.
  `extras.frames[k]`, `extras.travel[k]`, `extras.loops[k]`, `extras.rate` (30) go with them.
- The nodes are stored at clip 00's first key, so a page that plays nothing shows the stance, not the T. The POSITION accessor is the bind (the
  T, the waist on the floor, the feet 0.8 m below it), so a box of the geometry alone is wrong; three r185 skins a SkinnedMesh's box with its
  bones (`room/procedural/three.core.js`, `Box3.expandByObject` reads `object.boundingBox`, `SkinnedMesh.computeBoundingBox`). Read through
  the hero's own three and GLTFLoader in node (`tools/hades-three-check.mjs`, 9 to 33 ms a file): 74, 74 and 73 clips, 60, 68 and 68 bones,
  the texture mapped; `Box3.setFromObject(gltf.scene)` straight after the load spans y -0.001 to 1.334 m (Seiya), -0.001 to 1.349 (in the
  Sagittarius Cloth), 0 to 1.570 (Ikki): the stance on the floor. Clip 00 lasts 1.967 s (Ikki's 1.133), clip 01 0.533 s; half way through
  the run three's box spans 0.003 to 1.284 m. So the unboxing's `fitted()` (`unboxing.js:273` at bd63d9a2) fits the stance as it is. Its `shatter()`
  takes meshes that are not skinned only (`unboxing.js:287`): a fighter is one SkinnedMesh and would not break.
- His tag 61.767 s, Seiya rising into the cloth: `seiya-sagittarius.hades.glb` is the game's Seiya already in the gold cloth with wings;
  `seiya.hades.glb` is him in the bronze Pegasus Cloth before it. The hero reads its models from `lab/unboxing-assets.json` (the unboxing
  session's file; at bd63d9a2 `{"cloth": ["cloth-trellis.sagittarius.glb"], "seiya": ["seiya-trellis.sagittarius.glb"]}`, best first):
  a name of these in its `seiya` list is all it takes to load one. Which one stands there is his call and that session's; this lane
  edited none of its files.
- The skin binds 60 or 68 joints with up to two weights a vertex; the material is double-sided, metalness 0, roughness 1 (a .gmi holds no
  material, GMI.md): GLTFLoader makes it a MeshStandardMaterial.

## What is not done, said plainly

- Which clip is which beyond 00 (idle) and 01 (run) is not known; 02 to 26 are read from the travel and the pictures above, 27 to 72 not.
- 30 frames a second is GAI.md's likely rate, not measured; a skill's script can scale it.
- The engine's own head look and face smoother are not in the clips: with the keys alone the head, hair and face groups of PEGASUS miss the
  engine's pose by up to 37 degrees (disc-chunks RECEIPT). The glbs carry the keys alone.
- The hair joints (`h_jnt_hair1..15` of Seiya) carry no keys in any clip; whether the engine simulates them is unproven for these three.
- The 128 x 128 second picture of each TPL is not used here; what it is for is unknown.
- No page loads these files yet (the hero's page is the unboxing session's). three's loader was run in node only: nothing was drawn on a GPU,
  and nothing was measured on lysa or in WebKit.
- The game's skill clips (`SKILL\AA_BB_CC.GAI`, the receivers' clips of a special move) are not read: only each fighter's own NN.mpl.

## Prove it again

```
node embertide-app/ui/intro/dyson-society/tools/hades-disc-read.mjs --who 15 --out <scratch>     # 4 s, read-only, 2.0 MB
node embertide-app/ui/intro/dyson-society/tools/hades-glb.mjs --who 15 --name seiya-sagittarius --disc <scratch> --out <x.glb> --loops ~/code/disc-chunks-2026-10-04/out/loops-by-code.json
node embertide-app/ui/intro/dyson-society/tools/hades-chunk-check.mjs <x.glb> ~/code/disc-chunks-2026-10-04/chunks/15.chunk.json
node embertide-app/ui/intro/dyson-society/tools/hades-picture.mjs <x.glb> --out <x.png> --cells "bind;rest;0@0.5;1@0;1@0.25;1@0.5;1@0.75" --w 192 --h 320
```

Any other fighter is one line more: `hades-disc-read.mjs --who NN --table ~/code/the-disc-rigs-2026-10-04/scout/afs-table.json` (each name at
its lowest index), then the same `hades-glb.mjs --who NN`. lanes/who/WHO.md has the numbers.
