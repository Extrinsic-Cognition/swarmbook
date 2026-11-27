# Native Saint Seiya source assets

This directory contains the 23 native mesh, texture and motion chunks needed to rebuild the four `lab/*.hades.glb` models. They were read from **Saint Seiya: The Hades**, PS2 PAL, **SLES-54162**, from `DATA/AFSDATA.AFS` at disc byte 155,023,360. The archive indices, offsets, byte lengths and first 16 bytes are recorded in `tools/hades-disc-read.mjs` (`FILES`). The chunks total 6,850,969 bytes. No full disc image is needed for regeneration.

The user explicitly requested these decompiled assets and their sources in the private repository handoff on October 15, 2026. They remain third-party game art. This inclusion is scoped to this handoff; the house's general mirror filtering and exclusions for room data and secrets remain in force.

## Rebuild and verify

From the `embertide-app/ui/intro/dyson-society` directory, using Node.js 20 or newer:

```sh
node tools/rebuild-native-assets.mjs --out /tmp/saint-seiya-rebuild
```

Choose a new output directory whose parent already exists. The command refuses to overwrite any existing directory, verifies all 23 chunks against the extraction table, rebuilds all four models, then compares their SHA-256 hashes and bytes with the bundled GLBs. It uses Node built-ins only: no package installation, SSH, Pelino, emulator, external folders or network. It also works from another working directory when invoked by the script's full path. The original `lab` models stay untouched. Four rebuilt models total 6,786,884 bytes.

The source converter remains available for intentional changes; for example, change a copied Athena stance JSON and pass it to `tools/hades-glb.mjs --stance`. The verification wrapper deliberately fails when the result differs from the bundled models. Do not replace the bundled models merely to silence that comparison.

## Exact conversion settings

| Model | Native files | Scale and pose | Textures and motion |
| --- | --- | --- | --- |
| `athena.hades.glb` | `e00.gmi`, `e00h.gmi`, `me00.mpl`, `tex-e00.tpl`, `tex-e00_face.tpl` | 1.6 m posed height; hem at y=0; `lab/athena.hades.stance.json` applied to the first keys of `me00.mpl` | Face 3; embedded alternate faces 0 and 5; 85 joints; no animation clips |
| `seiya.hades.glb` | `00.gmi`, `00h.gmi`, `m00.mpl`, `00.mpl`, `tex-00.tpl`, `tex-00_face.tpl` | 1.65 m rest height; initial pose 0; game-root floor | Original body texture (`--face none`); all 73 native body clips plus face clip; 60 joints |
| `ikki.hades.glb` | `04.gmi`, `04h.gmi`, `m04.mpl`, `04.mpl`, `tex-04.tpl`, `tex-04_face.tpl` | 1.65 m rest height; initial pose 0; game-root floor | Original body texture; all 72 native body clips plus face clip; 68 joints |
| `seiya-sagittarius.hades.glb` | `15.gmi`, `15h.gmi`, `m15.mpl`, `15.mpl`, `tex-15.tpl`, `tex-15_face.tpl` | 1.65 m rest height; initial pose 0; game-root floor | Original body texture; all 73 native body clips plus face clip; 68 joints |

All conversion scales preserve the native proportions. The metre heights are explicit scene calibration choices, not dimensions supplied by the game. Fighter waist travel is separated from the in-place clips and preserved in GLB extras. Animations use the native motion numbers; names do not claim to identify actions that have not been verified.

`loops-by-code.json` is captured game-RAM metadata for 39 motion numbers across four recorded fighters; it is not a disc chunk. Missing loop classifications remain `null`. Passing this bundled file is necessary to reproduce the fighters' GLB extras exactly.

The GLBs embed their geometry, skeletons, textures and animations and can be imported directly into a compatible editor. The separately named TRELLIS models are generated assets, not these native extractions. These four native models do not include Dolbar or the Asgard environment; those remain missing from the mint-freeze reconstruction.

## Verified SHA-256

| Bundled GLB | SHA-256 |
| --- | --- |
| `athena.hades.glb` | `171d1d145ae7b5106145fa3dccc4120061ec85a127987f466fa6ab5c2151078a` |
| `seiya.hades.glb` | `7ac9dfcb06023c30542580421fe468eb32f6bf74630ff37869792b39025753b5` |
| `ikki.hades.glb` | `bbde1b0bbf7fb02d5da190f6efc7bfc2f8c081db172a6c59455fb11c363e60c0` |
| `seiya-sagittarius.hades.glb` | `0902e89fba293b1c1f57328de0734fb052fe42407b1d5da919e33c889a59f977` |

All four were regenerated from this directory and verified byte-identical on October 15, 2026. Rebuilding proves the native asset package is reproducible; it does not establish that the current 3D composition matches the anime frame. See `lab/MINT-FREEZE.md` for that visual QA status.
