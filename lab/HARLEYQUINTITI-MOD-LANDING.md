# HARLEYQUINTITI, MODDED FROM SAORI'S OWN BODY (lane/harleyquintiti-mod, Oct 24 2026 21:xx WEST, seat TOTEM 3Ds)

His words, WEST: Oct 24 21:0x, over her pixel sheet and Saori's four views: "i am disappointed in that... look how rich we spent in making the dyson
society mint good man? ... the iOS app is the spatial bubble in which harley quinn titti is and i am motioncapped as seya and i am fighting lyssajudron
as i scan the qr codes to sync the room... look how she look like a nun, bro u gotta edit the model to make her mod like it is her descendant nefertiti
the nestal nymph". Oct 22 17:29: "nefertiti is the harley quinn there and she is a nestal nymph descendant of athena"; 17:07: "think like athena
platinum". Her lineage: ec-workspace `docs/harleyquintiti-nefertiti-athena-hypertrace-2026-10-24.md`.

## What it does

`tools/harleyquintiti-mod.mjs` rebuilds Athena from `assets/native-source` exactly as `hades-glb.mjs` builds `lab/athena.hades.glb` (the test checks the
bytes), then mods her, deterministic, and writes `lab/harleyquintiti.hades.glb`:

| part | what she is now | how |
|---|---|---|
| stance | the golden apple up at her right shoulder, her left hand on her hip, her chin up | `HQ_STANCE`, measured by seat db3c3e4b |
| face | wide eyes (face 4) on her map, laughing (2) and closed (5) beside it; blue eyes, the diamond under her left eye, a grin | painted on the disc's own faces |
| hair | platinum, lavender at the roots, pink on her right, ice blue on her left; the back hair to mid back | three UV islands of the disc's hair strip, by side (her UVs mirror left and right) |
| pigtails | two, tied high, waving to her chest, pink-tipped and ice-tipped, ice clips at their roots | new geometry on the head joint |
| circlet | platinum round her brow, an ice crystal at its front | new geometry on the head joint |
| chiton | the gown drawn up above the knee (0.6 m) and its flare eased, frost on it, an ice trim at the hem, a lining | each skirt vertex moved by its skirt weight, carried back through its own skin blend |
| legs | from under the chiton to the floor, gold sandal straps | new geometry on the lower body (the disc's figure had no legs) |
| apple | golden, honeycombed, a stem and a leaf, in her right hand | new geometry on the right hand |

The map grows to 1024 x 512: the disc's 512 x 512 on the left (its UVs halved), the islands on the right. 8,702 vertices, 5,742 triangles, 85 joints,
1,238,380 B in the first bake (a1279b82…); since his "bruv" over the first bake beside his sheet (Oct 24 22:1x WEST) the second: white as his
sheet has her (lavender only at the crown, the tips' colour from the middle of the strand, her bangs white, the side colour only below her chin), the
pigtails slim at the tie in S-curls with a twisting lock and a rosette of ice, the circlet a tiara across her brow (not a halo), a brighter apple with
a fine honeycomb, a wider grin, the brooch at her left shoulder, her long hair waved: 9,202 vertices, 6,478 triangles, 1,218,824 B, sha256
`73222f9c…`; then every tube-built part wound counter-clockwise seen from where its normals point (seat db3c3e4b counted 2,873 of 6,478
triangles against their normals: a doubleSided renderer, SceneKit or three.js, lit them as back faces, dark): 35 of 6,478 now (0.54%, the disc's own
elbows and a few waved strands; main's athena.hades.glb has 10 of 3,234), held at 1% by the test; 1,218,824 B, sha256
`7145a8175ddce394d1655f2500fd17e174a04d403fe08fa066d743f5e55e1f45`.

`lab/fight-lyssa-seiya.html?for=harleyquintiti` loads her as she is: the harlequin shader (red and black diamonds), the lowered arms and the blue
Egyptian crown it put on Saori are gone (two seats had read her name as a costume).

## The cost

| what | cost | measured |
|---|---|---|
| the bake | one build from the disc and three maps painted | 0.47 to 0.5 s of node, this Mac |
| the file | 1.24 MB beside athena.hades.glb (0.66 MB) | the bytes |
| a page | one more fetch and parse of a skinned GLB where Saori's was | the fight page, served |
| at rest | nothing | the code |

## The proofs (this Mac, node 26.7.0, nice 19)

- `node --test tools/harleyquintiti-mod.test.mjs`: 5 of 5, twice (the base byte for byte; the bake the same bytes and the same as the lab file; 85 joints
  and every added vertex on one joint; the 1024 x 512 map and every UV inside it; her feet at y 0, the hem at 0.6 m, her top at about 1.6 m).
- The fight page on the lane's tree served by `tools/serve-range` (root `embertide-app/ui`): titled "Seiya for Harleyquintiti", both GLBs 200, no
  resource failed, her body behind Seiya with the apple (the preview pane, 21:5x).
- Rule 8 on the served mint page of this tree: `node --test app/dl-twelve.test.mjs` 17 of 17; `node app/dl-twelve.proof.mjs --url
  http://127.0.0.1:9061/intro/dyson-society/app/warm.html --tap button` PASS and `--tap sphere` PASS.

## What is not done

- Her legs are plain tubes and her feet small; her pigtails are smooth tubes, not curls; the grin is painted, the mouth's joints are untouched.
- The iPad: seat db3c3e4b's lane/harleyquintiti-walks-with-him reads these bytes with its own glTF reader (HarleyBody) and points the walk at them.
- His picture wins: any change he asks for is one constant or one part in `harleyquintiti-mod.mjs`, then one bake.
