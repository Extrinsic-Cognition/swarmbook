# HER CARD IS THE PICK'S (lane `lane/her-other-faces-read-the-pick`, Nov 1 2026 23:50 to Nov 2 01:3x UTC, seat claude-e29053c1)

His words: Nov 1 2026 23:10:44 UTC, "dude, assume that everything was built for a general png or whatever, then replace those general values with neferittis'
ones... u get me? do backup of what we got, replace or whaytever then put the image back as if i selected it in my onboarding". THE WARDEN IS PICKED
(`lane/the-warden-is-picked`, cf7db8c18, in the line) made her face the account's pick on the Chamber and the Canvas; three faces still read the file
(`assets/her-sprite.png`): the hand-off page's card, the phone's card and her AR body, and the tool that makes the card. At 23:50:03 UTC he started this lane
("Do this task here"); at 00:08:20 and 00:08:32 UTC, mid-lane: "before you continue mocking. consider also the claw riders stuff please", "the posters
propagand claw riders". This lane stacks on `lane/the-warden-is-picked`.

**The numbers first** (the new Mac; his pick read off his Nest, newmac's peer, read only):

| what | before | once this lands |
|---|---|---|
| where her card's face comes from | the file: `her-sprite.png`, made once from `athena.png` | in the house, the account's pick: the card made from the picked PNG at the pick, its three pictures named by sha256 in `character/warden` |
| the card made for his pick, against today's | | **0 pixels differ** (sprite, perch, card: `magick compare -metric AE` 0, 0, 0) |
| the card made for her art (the product's, the public mint's) | | 0 pixels differ from the committed assets; the same face makes the same bytes, run after run |
| another face | no road | its own card, the face fitted into her box (a whole number of its pixels when it fits), on the team's Claw Riders poster (THE POSTERS) |
| the code the phone reads | `s r n g c` | in the house with the pick's card: `+ k` (the card ARKit holds) `+ h` (the sprite she walks out as), by sha256 |
| the phone's reference image and her AR body | the app's `her-card.png` and `her-sprite.png` | the pictures `k` and `h` name, through the Nest's blob door or the module beside the rite, checked by sha256; else the app's own |
| DysonLight | | compiles (`harmony-clip/build.sh`, unsigned, the lander's road): **BUILD SUCCEEDED**, the four changed files compiled, 0 warnings in them |

Cost: at the pick, the card's make (ImageMagick, **0.36 s** on the black card; **0.54 s** on the poster, THE POSTERS), three more PUTs (on the poster
1,355,348 bytes: card 625,623, perch 649,550, sprite 80,175) and four modules laid (about 1.8 MB for the card's three). On the page, only on the house's road: one read of `character/warden` and two pictures at the card's open, each
checked by its sha256. On the phone: two GETs a picture at most (the Nest's door, which refuses a phone, then the module beside the rite), once a code read.
Nothing at rest anywhere. The public mint (optimism.fit, no house) reads nothing new and shows the product's card, as before.

## The road (the general PNG; his values put back as his pick)

1. **The card is made for any face.** `tools/her-card.mjs` exports `makeCard({face, out})` and `fitOf`: the face fitted into `CARD.her`'s box (a whole
   number of times its own pixels when that fits, else shrunk; standing on the box's floor), thinned at the bottom as hers is, the unit1s seeded afresh for
   each card. Its art (`athena.png`) is the default, so the product's card is the card made for her. The PNGs carry no date or time chunk, so the same face
   gives the same bytes, and a sha256 names a card.
2. **The pick makes the account's card.** `tools/embertide-mesh/onboarding-pick.mjs` makes the card from the picked image (when `magick` is here; `--no-card`
   skips it), puts its three pictures on the Nest by sha256, names them in the entry (`character/warden.card = {sprite, perch, card}`,
   `room/character-fact.mjs cardOf`), and lays the image and the three pictures beside the page (`left-body.mjs lay`: `left-bodies/<sha256>.mjs`, out of
   git). A Nest blob is read by its own Mac only (the privacy hold), so the laid module is the road every other glass takes, as every body's is.
   `--lay` lays the standing pick on another Mac from its own Nest: the Mac whose rite serves the phones.
3. **The page shows it.** `app/dl-handoff.js`, on the house's road only: it reads `character/warden` (the character's law, imported there and only there), takes
   the card's perch and her sprite from the Nest's blob door or the module beside the page, keeps them only when they hash right, draws them, and names the
   card in the code (`app/dl-handoff.mjs clipLink`: `k=`, `h=`). No pick, or a picture neither road gives: the product's card, and the code names none.
4. **The phone tracks the same bytes.** `harmony-clip/Shared/Handoff.swift` reads `k` and `h`, fetches both through `House.picture` (the Nest's door, then
   the module beside the rite; the bytes checked by SHA256) before it reads the glass, so the stage looks for the card the page shows; `Card.load(width:picture:)`
   makes ARKit's reference from it; her AR body wears the sprite (`ARHandoffView.swift plane(width:height:sprite:)`). A picture the road does not give leaves
   the app's own card, and the glass says why.

## The proofs (new Mac)

- `embertide-app/ui/intro/dyson-society/tools/her-card.test.mjs` 3 of 3 (new): the fit; her art makes the product's card pixel for pixel; the same face the
  same bytes; another face its own card, standing in her box; THE PLATE (the three calls, riders by default; CLAW RIDERS in gold above her; two teams'
  plates differ only at the foot and on the team's line; a team the maker does not know is refused).
- `tools/embertide-mesh/onboarding-pick.test.mjs` 3 of 3 against a scratch Nest: the pick as before, and HER CARD IS THE PICK'S (the three pictures on the
  Nest by sha256 and named in the entry with whose plate it is; laid beside the page with the image, in a scratch folder, never the tree; the same image
  makes the same card and lays nothing twice; another team, another card around the same sprite; an unknown team writes nothing; `--lay` lays the standing
  pick from the Nest).
- `embertide-app/ui/intro/room/character-fact.test.mjs` 6 of 6 (the warden's card read whole or not at all, with its team when it is an id; a seat has none).
- `app/dl-handoff.test.mjs` 10 of 10 (the code names the pick's card by sha256, no pick or a broken one names none; the phone reads `k` and `h`; the plate's
  bands inside the card, the title above her, the foot after her Lyssajudron's last pixel).
- `app/dl-handoff.proof.mjs`, headless Chrome off every screen, the lane's tree served by `tools/serve-range` at
  `warm.html?debug=104&handoff=lan`:
  - with `--house 10.0.0.2:8904 --glass glass-a --pick <his pick's folder>` (his pick's image and the card made from it; the proof answers the page's house
    questions from the folder and keeps refusing the Nest's blob door, as the real Nest refuses a caller off its Mac): **PASS, 9 of 9**, the new check
    green ("the card is the pick's: its perch and her sprite read beside the page, checked by their hash, and the code names them (k=, h=)"), and Apple's
    Vision reads back the link carrying `k` and `h`;
  - with `--pick-face app/assets/athena.png` (the proof makes the pick itself with the pick tool's own makers, so the lander proves the road): **PASS, 9 of
    9** in 35 s, the scratch pick ended with it; the card it made is byte for byte his pick's (`k=0e4d3883…`, the same sha256);
  - with no house: **PASS, 9 of 9** ("the code names no card of its own (the product's card)").
- Rule 8 (this lane changes `dyson-society/app/`): `node --test app/dl-twelve.test.mjs` and `nice -n 19 node app/dl-twelve.proof.mjs --url <the page served by
  tools/serve-range> --tap button` and `--tap sphere`: the test **21 of 21**; on `warm.html` **PASS both** ("the sound came in where the picture was, and
  the picture never went back"); on `warm.html?handoff=lan` `--tap sphere` **PASS**, and `--tap button` could not run ("the button is off screen at (1147.9,
  1346.6): a tap there would hit nothing"), the same on main 205fe1c3e: main's own (on the hand-off road the sound button stands below the glass at
  1512 x 982), none of this lane's.
- THE PLATE, again in the real browser on the lane's tree (serve-range): the hand-off proof with `--pick-face app/assets/athena.png` **PASS, 9 of 9** (the
  card's place on the glass 243,125,317,749 per mille, the taller plate at a whole number of screen pixels per card pixel; the code names the plate,
  `k=515fd709…`) and with no house **PASS, 9 of 9**; rule 8 again (the plate changes `app/assets/`): `dl-twelve.test.mjs` 21 of 21, `--tap button` PASS
  (the film at 6.06 s at the tap, never below it, the song within 0.15 s at the end, no seek back), `--tap sphere` PASS (6.04 s).
- DysonLight: `harmony-clip/build.sh` on the lane's tree, the built pieces linked from the lander's `clip-pieces` as the lander links them: BUILD SUCCEEDED.
  Nothing installed: the phone takes it from main through the lander's road.
- On the committed lane: `tools/any-room/any-room.test.mjs` **12 of 12** (THE ACID: every touched file carries none of his room),
  `tests/the-law-is-the-gate.test.mjs` 7 of 7, `tools/journey-walks/new-user.test.mjs` 8 of 8, `tests/entities.test.mjs` 7 of 7,
  `tests/no-page-of-its-own.test.mjs` 3 of 3, `tests/the-pixel-is-a-lookup.test.mjs` 3 of 3; and the 15 test files that import a changed module, green
  (`dl-handoff`, `dl-space-router.scene`, `her-card`, `canvas-party`, `chamber-party`, `the-room` 33, `character-fact`, `glb-write`, `horde-glb`,
  `nefertitidudron-glb`, `totem-glb`, `session-parts` 47, `harmony-leave-thing`, `leave-thing-ar`, `onboarding-pick`).

## THE PLATE (Nov 2 2026 00:32:04 UTC, his "Build the plate"; refused at 00:45:11 UTC, THE POSTERS below replaces it)

His Oct 26 2026 15:11 UTC line holds this lane's frame: "claw-riders is the MMO where each user has a nefertiti and a fuel tank". The three recruitment
posters of Sept 14 (CARRY THE LIGHT HOME, RIDE WITH THE SWARM, JOIN THE RIDERS; black and gold, the three-claw sigil, the golden armor) are the three teams
a new rider picks as a starter (`docs/claw-riders-gamified-hypertrace-2026-10-18.md`, section 1 of the brainstorm), and "Claw Riders is the DND propaganda
template" (Oct 18). Mid-lane, at 00:08 UTC, he asked to consider them ("the posters propagand claw riders"); the mock he was shown laid her card as a Claw
Riders plate, his Nefertiti under each team; at 00:32:04 UTC he answered "Build the plate".

- **The law** (`app/dl-handoff.mjs CARD`): 480 x 736 (was 480 x 660), with a `title` band (y 18, 68 high) and a `foot` band (y 626, 92 high); she and her
  Lyssajudron stand 70 px lower (her at y 94, the body at y 253, its last pixel row ending at 612, before the foot). `her-card.json` carries the bands; the
  phone reads what it read (`Card.swift`: width, height, her, physical_m), so no Swift moved for the plate.
- **The maker** (`tools/her-card.mjs`): CLAW RIDERS in the house's Bodoni (`ui/intro/fonts/BodoniModa.ttf`; every glyph's edge thresholded, hard pixels as
  the rest of the card) over a gold rule; the three-claw sigil from straight lines and the team's motto at the foot; the team's colour on the inner line;
  the unit1s fall between the bands. `TEAMS`: riders (JOIN THE RIDERS, blue), swarm (RIDE WITH THE SWARM, red), light (CARRY THE LIGHT HOME, yellow): the
  posters' three calls, the three birds' colours. `--team`, riders by default: the recruiting call, the plate of a rider who has picked no starter.
- **The pick names whose plate it is**: `character/warden.card.team` (`cardOf`), `--team` on `onboarding-pick.mjs`. His team is not picked (his Oct 17 Zapdos
  line is the dodecahedron's flight, never a starter), so his plate says JOIN THE RIDERS until the welcome's starter names his team (the player's birth).
- **The product's card is the riders' plate**: `app/assets/her-card.png`, `her-perch.png` and `her-card.json` made again (her sprite's bytes unchanged, 0
  pixels apart). It is the public mint's card at its next deploy (his press) and the App Clip's at the lander's next cut.
- Numbers: the plate made in **0.21 s** (card 100,403 bytes, perch 13,300, sprite 80,175); his pick's plate and the product's, 0 pixels apart (card and
  perch); two teams' plates differ only at the foot and on the team's line, every other pixel one (`tools/her-card.test.mjs` THE PLATE).

## THE POSTERS (Nov 2 2026, his "wtf dude? that is not the clawriders posters wtf are you doing?" at 00:45:11 UTC; "this one is best" at 01:13:52 UTC)

He refused THE PLATE on sight: a black card with CLAW RIDERS in small Bodoni is not his posters. The 00:13 mock had the same fault, the seat's: it drew a
plate of its own instead of his paintings. The mock that followed (inline, and on the Canvas's Claude page: `harmony-claude:widget-61a5b9b5…`, seq 134328)
laid his three posters with their heroes painted out under her (her pixels, the road for any face), and her painted into each in the gold armour (a model
call at every pick); he picked her pixels on his posters, "this one is best".

- **The plates** (`tools/claw-riders/{riders,light,swarm}.png`, 480 x 720; 637,355, 647,457 and 610,300 bytes): his Sept 14 recruitment posters
  (`claw-riders-20260914-03`, `-01`, `-02`.png in the reconstructions' `vendor/`, 1024 x 1536), each sent once at 832 x 1248 (the editor's one-megapixel
  cap) to `bfl/flux-kontext-pro` through MiniRouter's `/v1/images/edits` with its hero painted out (the prompts below), then Lanczos to the card's size,
  every chunk but the pixels stripped. CLAW RIDERS, the world, the sigil, the call and EMBERTIDE-0 are the poster's own paint. Made once: a pick calls no
  model, and no picture leaves the house to make a card.
- **The law** (`app/dl-handoff.mjs CARD`): 480 x 720, the posters' 2:3 (was 480 x 736); her at y 82 (her face in the riders' eclipse), her Lyssajudron at
  y 241 (its last pixel row ends at 601), `motto.y` 604 where the poster's painted call begins (JOIN THE RIDERS the highest, at about 606); `title` and
  `foot` gone, the poster paints them. Her Lyssajudron's claws stand over the sigil of the light's and the swarm's posters, as in the mock he picked. The
  phone reads width, height, her, physical_m: no Swift moved.
- **The maker** (`tools/her-card.mjs`): the team's plate, her Lyssajudron at three times its pixels, the face's sprite: two composites. Gone: the black
  ground, the frames, the unit1s and their seeded draw, the Bodoni words, the drawn sigil (151 lines to 96). `TEAMS` name each poster's plate.
- **The product's card is the riders' poster**: `her-card.png` 625,623 bytes (was 100,403), `her-perch.png` 649,550 (was 13,300), `her-card.json` with the
  new law; her sprite's bytes unchanged (0 pixels apart). The App Clip carries the card: 525 KB more in it.
- **His pick, made again on the poster** (as on his Nov 1 23:10 word): `character/warden` rev 4 (seq 135944) on newmac's peer, card `d7e031ce…`, perch
  `45777089…`, sprite `25ecbc4f…`, team riders, her face and her birth unchanged; the card and perch are the product's, sha256 for sha256. Rev 3 is kept under
  `~/.embertide/backups/the-warden-is-picked-2026-11-01T23-37-47Z/onboarding-pick-2026-11-02T01-22-35-522Z`.
- **Numbers**: the card made in **0.54 s** (`makeCard`, median of 5, the proofs running beside it; the black card's was 0.21 s: the painted plate's PNG
  compresses slower); on every poster each of the card's pixels is either exactly hers or exactly the poster's (`tools/her-card.test.mjs` THE POSTERS);
  the three posters make three cards around one sprite.
- **Cost**: six edits at $0.042, **$0.252** on the purse's burn line (`~/.embertide/minirouter-burn.jsonl`, by claude-e29053c1): the three plates kept, the
  three paintings of her in the gold the mock's other row, not kept. MiniRouter answered 503 `images_unavailable` three times in six minutes (two calls at
  once are refused); a 400 for a poster over one megapixel was booked at no cost.
- **The proofs** (new Mac): `tools/her-card.test.mjs` 3 of 3, `app/dl-handoff.test.mjs` 10 of 10, `room/character-fact.test.mjs` 6 of 6,
  `onboarding-pick.test.mjs` 3 of 3, and the 8 test files that import a changed module green (`canvas-party` 6, `chamber-party` 6, `the-room` 33,
  `session-parts` 47); the gates: `any-room` 12 (the acid on the lane's committed files), the law 7, new-user 8, entities 7, no-page-of-its-own 3,
  pixel-lookup 3; the hand-off proof 9 of 9 with a pick made from her art (`k=d7e031ce…`) and 9 of 9 with no house; rule 8: `dl-twelve.test.mjs` 21 of 21,
  `dl-twelve.proof.mjs --tap button` PASS (6.10 s) and `--tap sphere` PASS (6.01 s) on `warm.html` served by serve-range.

The prompts, one call each (the poster at 832 x 1248 as the image):

- riders (`claw-riders-20260914-03`): "Remove the central armored rider completely, together with the big flag, its flagpole and the book they hold. Keep
  everything else exactly as it is: the "CLAW RIDERS" title at the top, the "JOIN THE RIDERS" line and "EMBERTIDE-0" at the bottom with its thin rules, the
  black eclipse with its golden corona, the glowing constellation wings, the ranks of armored riders with their banners on both sides, the floating dark
  diamonds, the spires of the city, the clouds and the dark rocky ground. Where the rider and the flag stood, continue the eclipse, the night sky and the
  clouds naturally, and leave the rocky ledge in the centre empty. Same painted style, same colours, same framing and size."
- light (`claw-riders-20260914-01`): "Remove the two central figures completely: the armored knight and the dark-haired woman he carries with her book, his
  cape and her robe. Keep everything else exactly as it is: the "CLAW RIDERS" title at the top with the star between the words, the two huge golden
  claw-shaped arcs, the starry night with its stars and the planets, the floating castles and the clouds on both sides, the dark rocks, the golden
  three-claw sigil, "CARRY THE LIGHT HOME" and "EMBERTIDE-0" with its rule and star at the bottom. Where the figures were, continue the starry sky between
  the golden arcs and leave the rock ledge empty. Same painted style, same colours, same framing and size."
- swarm (`claw-riders-20260914-02`): "Remove the rider (the woman in gold armor holding a flag on a spear) and the giant black-and-gold armored eagle she
  rides, with its wings, head and claws, completely. Keep everything else exactly as it is: the "CLAW RIDERS" title at the top, the swarm of small golden
  arrow-shaped ships, the constellation and the moon, the curve of the planet with its clouds and light, the floating dark spires, the golden three-claw
  sigil, "RIDE WITH THE SWARM" and "EMBERTIDE-0" at the bottom. Where the eagle and the rider were, continue the starry space, the swarm and the planet's
  clouds naturally. Same painted style, same colours, same framing and size."

## What waits

- **The team from the welcome**: the starter is the player's choice (the player's birth, a later lane); until then `--team` is the pick's hand.
- **The lay on the rite's Mac, after the landing.** His pick was made again with this lane's tool, on his Nov 1 23:10 word ("as if i selected it in my
  onboarding"): rev 2 at 00:29 UTC (the card, `0e4d3883…`), rev 3 at 00:41 UTC on the riders' plate (seq 133093), then rev 4 at 01:22 UTC on the riders'
  poster (seq 135944, newmac's peer: card `d7e031ce…`, perch `45777089…`, sprite `25ecbc4f…`, team riders; her face and her birth unchanged), each rev
  before it kept under `~/.embertide/backups/the-warden-is-picked-2026-11-01T23-37-47Z/`. The station holds rev 4 by the mesh and the sprite (pulled at
  rev 2); its Nest still answers 404 for the poster's card and perch at 01:2x UTC, as it did for the plate's at 00:4x (its peer link to the new Mac down:
  "The operation was aborted due to timeout", `up: false`). Left once this lands: `node tools/embertide-mesh/onboarding-pick.mjs --lay` on the old Mac,
  whose rite serves the phones (no magick needed: the bytes come from its own Nest, once its peer link has carried them; `--lay` names the picture it still
  lacks). Until then the page and the phone show the product's card, the riders' poster: for his pick the same bytes.
- **ImageMagick at a user's pick.** The card is made with `magick`; on a machine without it the pick names no card and the product's card stands. A maker
  in the house's own code (no outside tool) is the step for any user's machine.
- **Her name**: the trainer's row is still `harmony:nefertiti` in the directory, and the party's seating rule still matches her name.
