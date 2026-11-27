# THE FIGHT FOR HARLEYQUINTITI: he is Seiya, she is the boss, Harleyquintiti stands behind him (lane/the-fight-for-harleyquintiti, Oct 24 2026 WEST)

His words, WEST: 17:57 "brother... i want to see me fighting as saint seya vs the lyssajudron to protect harleyquintiti ok?"; 18:0x "the fucking
dysonlight iOS app has to be brought into this", over a seat's summary of his law of the split ("the iPad should compute the parabola once ... each
screen just rendering its own view"; his Oct 1 18:52 "KEEP THE GAME ENGINE LOGIC ACROSS ALL DEVICES; THEN JUST WORK ON THE RENDERERS INDIVIDUALLY ON
EACH", Oct 4 16:04 "streaming a larger chunk of information and then streaming only controls/inputs after"). Harleyquintiti is his: Oct 22 22:5x "the
iOS/iPad scans the qr code and he sees harleyquintiti (harley quinn nefertiti)"; Oct 24 10:53 "the right app that does scanning is dysonlight dude... the
ipad is missing entirely harleyquintiti". The fight is the Oct 18 lane's (FIGHT-LYSSA-SEIYA.md, his "do you think you got enough material to simulate a
fight between the lyssajudron and saint-seya bronze?"), turned round: there his hands cast her spells and Seiya replayed his Oct 4 recordings; here his
hands are Seiya's.

## The cost, first

| what | before | measured | where |
|---|---|---|---|
| a plan of the protect fight (about 1,150 ticks, 53 s in-game) | the default fight 2.9 to 3.3 ms | 3.7 to 4.7 ms | headless Chrome on the new Mac (M5 Max), `FIGHT.replanMs()` |
| the same in node | - | 6 to 14 ms | the serving Mac at nice 19, a scratch run (no suite there) |
| one frame, GPU read back, 1280 x 720 | 1.0 ms median, 1.7 p95 | 1.1 to 1.5 ms median, 1.7 to 2.0 p95 | headless Chrome, ANGLE Metal; Harleyquintiti is one more skinned mesh (Athena's, 660 KB) |
| the page ready | 0.49 to 0.62 s | 0.55 to 0.72 s | a local door on the new Mac |
| at rest | 0 frames in 1.5 s | 0 frames in 1.5 s | the loop runs only while a fight plays |
| a press, on the Nest | - | one GET and one compare-and-set POST of `fight/harleyquintiti` (a press is about 45 bytes; a 50 s fight at four taps a beat is about 18 KB), then one plan on every glass that shows the page | predicted from the shapes, not timed on the LAN |
| the DysonLight app with its Fight glass | 208: 208 sources, 39.3 s | 209: 210 sources, compile rc 0 in 38.63 s, exe sha256 64d644b60cfa2b5f..., unsigned | the new Mac, `remote-build/compile.py` over 208's pack with the lane's 7 iPad files laid over |

Not measured: the iPad drawing the fight (WebKit on the A-series GPU), lysa, a TV; a press across two glasses on the live Nest (below, what is left).

## What it is, in the law (`lab/fight-lyssa-seiya.mjs`, `planFight({ ..., protect: true, his })`)

- **Harleyquintiti** stands 1.2 m behind Seiya on the summoning line (`HARLEY`, every number a choice of this lane): health 100, her chest 1.18 m up,
  a strike within 0.3 m of it reaches her, the gold arrow takes half her health.
- **His hands are Seiya's** (`MOVES`, a press `{beat, move, dir?, by}` stamped on the next beat): `meteor` plays his recorded PEGASUS METEOR (64.4000);
  the taps of one beat burn it hotter by a quarter each, at most twice (`COSMOS`: his Oct 18 "smashing buttons"); `punch` his recorded punch (59.3040,
  its own 2.32 m lunge); `step` his recorded side steps (03.30 and 04.40, UP and DOWN on his pad: 1.38 m round her, his bearing turned 0.88 rad, his
  distance to her moved 0.10 to 0.15 m, measured); `back` his recorded back step (02.20, LEFT on his pad: away from her along the line, toward
  Harleyquintiti). A press is taken in his stance; one older than 4 beats while he could not move is lost. With no press his stance waits: nothing is
  chosen for him.
- **Her spells are her own** (`herScript`: the default causes from beat 6 to 55, looped every 16 bars after the summoning), and every bolt and dive
  flies at Harleyquintiti's chest. One that meets his box on its way (his body between them, not down) strikes him and turns back from there; one that
  reaches her chest strikes her; his meteor on her while she is the bolt breaks it (the Oct 18 law, unchanged). In the protect fight she has three
  bars (`BOSS.hp` 300: his Oct 14 23:30 "like dmc4 boss fight"), so smashing alone does not end her before her spells come.
- **The end**: she is taken when her health is gone (a bar later the Lyssajudron wins); he falls to the gold arrow on his own body (two bars later the
  Lyssajudron wins); he wins when the Lyssajudron's health is gone, Harleyquintiti protected.
- **One fix to both fights** (`stateAt`): a strike inside the tick now reads its own health numbers, so a bar drops as the strike lands. Before, every
  bar showed the health from before a hit through its whole freeze (a freeze holds the strike's own instant). The default fight's plan is unchanged:
  102 events, 42.04 s in-game, 56.29 s on the wall, as its receipt says (its test and its proof hold it).

## The search for a fair fight (node, the serving Mac at nice 19, milliseconds each)

1. Her health at 100: 118 of 120 scripted hands won (a tap rhythm of 1 to 3 beats, 2 to 8 taps, a punch every 7 beats or none, a side step or none),
   in 13 to 16 s, before her first storm reached anyone: no fight. Her three bars at 300: 26 of 120 won, only the hands that press every beat.
2. A hand that shows the protecting, among 270 (3 to 5 taps, a punch every 9 to 17 beats or none, a start at beat 3, 8 or 13, every beat or every
   second, a side step or none): 95 won; the best of them drifted up to 18.35 m from her (7.89 on average): every lunge carries the fight forward.
3. With the back step, among 96 (as above, plus a back step every 5 to 9 beats or none): 39 won. The proof's hand (`HIS_SCRIPT`, the lane's, not his):
   from beat 13 four taps a beat, a back step every 7th, a punch every 13th. **His body stops 21 dives and 2 bolts, his meteor breaks 2 bolts, 15
   strikes reach Harleyquintiti, he stays 3.53 m from her on average (8.09 at most), and he wins at 53.00 s in-game, 86.00 s on the wall, with her at
   71.8 and himself at 35.5.** With no hand at all his body stops her first storm, her blink opens the line, and she is taken at 50.32 s.

## The page (`lab/fight-lyssa-seiya.html?for=harleyquintiti`)

- **Harleyquintiti's body**: Athena's from the Hades disc (`lab/athena.hades.glb`, 1.6 m, the one a saint protects), dressed as Harley Quinn in a
  shader on her own material (red and black diamonds below the neck, the halves swapped at her middle line; her pigtails dyed pink and blue), crowned
  as Nefertiti (the tall flat-topped blue cap, its gold bands and the cobra at her brow), her arms lowered from the disc's rest pose once at load. Her
  bar (the harlequin stripes) under the two; a glow on her chest while a strike on her is fresh; taken, she sinks. The camera frames all three.
- **His hands**: a tap the meteor, a drag up the punch, aside a side step (the way his drag went on that glass), down the back step; space, P or the
  up arrow, the arrows on a keyboard.
- **ONE FIGHT ON THE NEST** (the law he pasted: the cause computed once, every glass a painter): the ref `fight/harleyquintiti` holds
  `{schema, t0 on the house clock, his presses, by, digest, end}`. His first press on a glass begins a fight a beat later; each later press is a
  compare-and-set of that ref (at most 4 tries). The glass that pressed plans it once and writes its plan's digest and end beside the presses; every
  glass that shows the page follows the ref on the Nest's stream, plans the same presses by the same law (the same bytes from the same door), paints its
  own view at `houseNow - t0` (`room/house-clock.mjs`: two trips on `/nest/head`'s `server_ms` at load, the stream's beats after), and says on its
  line whether its plan's digest is the writer's. With no fight on the Nest a glass plays its own copy of the scripted fight, unsynced. `?nest=0`: no
  Nest (the proof).
- **Rule 9 (the spatial rite) and this lane**: one fight on the Nest is a shared fight across the glasses that show this page, before the room is
  scanned. It is shared causes, never a shared picture (each glass paints its own view), it begins only on his press, and only a glass opened on this
  page follows it; a glass with no fight plays its own unsynced copy, as the rite asks of her before the scan. His hand decides whether that is right.

## The DysonLight app (iPad 209)

`harmony-ipad-zero/HarmonyZero/Sources/Fight/FightPage.swift` (pure: the fight's address on the station's rite door, `?for=harleyquintiti&seat=ipad`,
by SpoolPage's law), `Fight/FightGlass.swift` (the deck's Fight surface in `HousePageWeb`, the one web view law of the house's pages: a non-persistent
store, the page's own address admitted, the scroll off; with no station named, two lines say so), `Life/HarmonyShell.swift` (`ConsoleMode.fight`,
"Fight", `figure.martial.arts`, beside the Spool: the deck draws one key per mode), `Front/SimsFront.swift` (the switch), `gen_project.py` 209 (208 is
main's; 206 and 207 are never reused). The rite's intro door already serves the page and its bodies to every glass (measured on 192.168.8.164:8903:
the page 200 in 6 ms, `seiya.hades.glb` 2.0 MB in 10 ms, `athena.hades.glb` 0.66 MB in 6 ms), and its glass script sends the page's Nest calls and
stream to the Nest the glass reads the Mac by, so the iPad's press reaches the same `fight/harleyquintiti` as every other glass. Never bundled.

## Proofs (the new Mac, node v26.11.0, off every screen; nothing on the serving Mac but scratch plans)

- `node --test lab/fight-lyssa-seiya.test.mjs`: **30 of 30** in 359 ms (21 of the Oct 18 lane, 9 new: the default fight untouched, her loop, the same
  presses give the same fight and a press changes nothing before its beat, no hand loses her, the scripted hand's numbers above, the cosmos and a late
  press, the side step round her, the back step toward her, her place and her health in `stateAt`).
- `node lab/fight-lyssa-seiya.proof.mjs --tree <lane> --for harleyquintiti`: **pass**: Seiya wins at 53.00 s in-game, 86.00 s on the wall, 19 frames
  saved and laid on the contact sheet (`fight-pictures/harley-sheet.jpg`, eight of them as JPEG), a frame 1.5 ms median, 2.0 p95, the plan 4.7 ms and the
  same plan again, 0 frames at rest, 0 errors, the page ready in 0.64 s (`fight-for-harleyquintiti.proof.json`).
- The same proof without `--for`: **pass**, the default fight as before (42.04 s, 56.29 s, 54 frames).
- `harmony-ipad-zero/tests/run-tests.sh` (zsh, the Command Line Tools' compiler): **972 passed, 0 failed** (with the fight's address: the rite's
  intro door, a bracketed IPv6 host, no glass named), record wire 46 of 46, record slice 27 of 27, 49 s.
- The whole DysonLight app: `remote-build/compile.py` over 208's pack with this lane's 7 iPad files laid over: rc 0, 38.63 s, 210 sources,
  CFBundleVersion 209, the fight's address in the executable (exe sha256 64d644b60cfa2b5f...), unsigned, in a scratch folder (nothing of it in the tree).
- **Rule 8** (the sound never restarts the picture: this lane changes files under the mint's `lab/`), Oct 24 2026 on the new Mac, on main 5daf7bc1e
  merged with this lane and THE IPAD SIGNS WITH THE LIVE KEY:
  - `node --test app/dl-twelve.test.mjs`: **17 of 17**.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <app/warm.html served by tools/serve-range on that tree> --tap button`: **PASS** in 11 s, "the
    sound came in where the picture was, and the picture never went back". The server answered 200 for the page and 206 to a range of it.
  - `--tap sphere`: **PASS** in 11 s, the same four lines.
  - The gate's own 147 test files for this lane, on the same tree: no red that main does not show. `breakdown`, `irradiance`, `ko-edge`, `one-page`
    and `sacrifice` in `lab/` are red on main too.
  - The fight proof again on that tree: **pass**: 53.00 s in-game, 86.00 s on the wall, 19 frames, a frame 1.3 ms median and 1.7 ms p95.

## What is left, and what is his

- **Not run before the landing**: a press on one glass and the same fight on a second, on the live Nest through the rite's door (the rite serves main;
  this page reaches the glasses only once the lane lands). After the landing: two headless pages on the new Mac at
  `http://192.168.8.164:8903/intro/dyson-society/lab/fight-lyssa-seiya.html?for=harleyquintiti&seat=proof-a` and `seat=proof-b`, a press on one, the
  digest and the frame on both.
- **The iPad**: the lander follows a landing that raises the build with the cut on the new Mac, the signature here and the install over the cable once
  his hand rests on every glass (THE-LANDER-LANDS-THE-IPAD-LANDING.md). A lane that lands 209 before this one makes this one 210.
- **His**: the deck's Fight key on the iPad, a tap to summon Seiya, then his hands. A TV shows the fight only on his word for that glass (no face for
  it is in this lane).

## THE FALL IS INSIDE THE DOOR (Oct 24 2026, read live after the landing)

- **The landing.** This lane was merged into main by hand at 19:48:03 WEST (`204663091`), by its seat, on his word ("Yes, land when green"), ahead
  of the lander's queue. Only the lander merges into main, and the seat asked him without saying so. The rest of this fix goes by hand to the
  lander.
- **What was read.** The page on the rite's door, `192.168.8.164:8903`, is the one every glass and the DysonLight app's Fight key load. In headless
  Chrome on the new Mac it reached readyState complete, but `window.FIGHT` never came in 20 s. The rite answered 404 for `lab/ragdoll.mjs` and
  `lab/rig.mjs`. Both were links into `games/sims4-nest/program-drive`, and the intro door serves only a file whose real path is inside the intro
  folder. So `fight-fall.mjs` failed, and the page's whole module graph with it.
- **The Oct 18 page had the same fault.** It ran only on aiolos, which follows links. The seat's word to him that the first version plays at :8903
  was wrong: it had checked that the page answers 200, not that it runs.
- **The change.** The two files move into `lab/`. `program-drive` keeps links to them, so there is one copy still. Node resolves a link to its
  real path, and `ragdoll.mjs` imports only `./rig.mjs`, beside it.
- **Proofs** (the new Mac):
  - `fight-served.test.mjs` (new): 2 of 2 on the lane. On main's tree it is red, naming the two links (`lab/rig.mjs` and `lab/ragdoll.mjs` ->
    `games/sims4-nest/program-drive/`).
  - `program-drive.test.mjs`: 15 of 15 through the links.
  - `fight-lyssa-seiya.test.mjs`: 30 of 30.
  - Rule 8: `dl-twelve.test.mjs` 17 of 17. `dl-twelve.proof.mjs` with `--tap button` and with `--tap sphere`: PASS, 11 s each, on `app/warm.html`
    served by `tools/serve-range`.
- **The iPad** holds 209 since 19:57:23 WEST (THE-IPAD-SIGNS-WITH-THE-LIVE-KEY-LANDING.md). Its Fight key shows the fight once this lane lands.
- **Left:** two glasses on one fight through the rite and the Nest, after this lane lands.

## The second hand (Oct 25 2026, 07:1x to 07:4x WET)

The first hand (queue line 515, Oct 24 20:01 WEST) was never gated: at 00:25 WET the lander's cursor was moved from line 502 to 597 on his word to another
seat, and the promised walk-back never came, so 95 hands sat "passed over" with no verdict (lander state.json, `seat` and `warden` notes). Handed again at
07:11, the gate refused it in 86 s for two things of this lane's own making, neither the page's: (1) `fight-served.test.mjs` still expected the page to fetch
`athena.hades.glb`; since 489e87d3b (Oct 24 21:47 WEST) her body is `harleyquintiti.hades.glb`, so on the merged tree the test was red (139 of 146 green, the
6 others main's own). It now accepts either name for her. (2) The fight proof was handed as `fight-lyssa-seiya.proof.mjs --tree .` with no `@folder`: the
lander runs a proof from its script's own folder, so `--tree .` was the lab, its door served `lab/embertide-app/ui` (nothing), and the page never came ("the
page did not get ready: not ready", 31.5 s, no console error). The proof is handed as `@embertide-app/ui ... --tree ../..` this time; the page itself was
not at fault. On main tonight `lab/ragdoll.mjs` and `lab/rig.mjs` are still links and the live rite (192.168.8.164:8903) answers 404 for both while the page
and its bodies answer 200: his iPad's 221 (cut from main at 02:54) opens a Fight page that cannot load its fall until this lands.
