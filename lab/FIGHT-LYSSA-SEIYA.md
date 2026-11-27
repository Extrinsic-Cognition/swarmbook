# The Lyssajudron against Seiya in the bronze Pegasus Cloth (lane fight-lyssa-seiya, Oct 18 2026)

His words, Oct 18 2026 WEST, in the warden's chat: 06:2x "bronze is the standard saint seya stuff"; 06:3x "do you think you got enough
material to simulate a fight between the lyssajudron and saint-seya bronze?"; then "brother... be resourceful?"; 06:36 "for the lyssajudron
can't you make up some spells? ... in the traces we had there is a shit load of spells names i said exactly in many recordings what were the
controls supposed to be".

The answer is yes, and it stands as a page: `/intro/dyson-society/lab/fight-lyssa-seiya.html` (aiolos, three path levels). One fight from fixed
causes runs 42.04 s of in-game time, 56.29 s on the wall clock, and ends with her gold arrow felling him; his body then goes to the house's
ragdoll. The contact sheet of every hit and of the fall is `lab/fight-pictures/fight-sheet.png`. The page is on no glass and nothing is
deployed; a glass is his to name.

Labels used below: **[recording]** measured from his Oct 4 fight's recordings; **[glb]** measured from `seiya.hades.glb` through the hero's
three.js; **[arithmetic]** computed from measured numbers; **[her code]** a constant of her own modules; **[constant]** a code constant of
this lane; **[choice]** a choice of this lane, said where it is made; **[by eye]**; **[his words]**; **[warden]** the warden's reading.

## The files

| file | what |
|---|---|
| `tools/fight-measure.mjs` | reads the recordings in place and writes `lab/seiya-fight.hades.json` (41 plays, 9 hits, 4 fists, 15 root curves, 13 choices; `--check` re-reads and compares) |
| `tools/fight-bodies.mjs` | poses the glb through three r185 in node and writes `lab/seiya-bodies.hades.json` (12 clips, 348 poses: his box, hands, head, chest and waist each whole frame) |
| `lab/fight-lyssa-seiya.mjs` | the law: `planFight({measured, bodies, causes})` is the whole fight; `stateAt(plan, wall_ms)` is any instant; no clock, random number or fetch |
| `lab/fight-fall.mjs` | his fall: his 18 structural joints given to `games/sims4-nest/program-drive/ragdoll.mjs` (`lab/ragdoll.mjs` and `lab/rig.mjs` are links to it and its `rig.mjs`) |
| `lab/fight-lyssa-seiya.html` | the page: Seiya through three, her body from her own builders, the effects, the two clocks, his hands |
| `lab/fight-lyssa-seiya.test.mjs` | 21 tests: the recording's numbers pinned, the law's purity, determinism and causality, the fall |
| `lab/fight-lyssa-seiya.proof.mjs` | headless Chrome on the new Mac: the whole fight from fixed causes, a frame at every hit and through the fall, the contact sheet |
| `lab/fight-pictures/` | the contact sheet and ten frames of the proof's run (the game's art: stripped before GitHub) |
| `lab/fight-lyssa-seiya.proof.json` | the proof's numbers |

`*.hades.json` and `fight-pictures/` are added to `tools/house-mirror/strip-families.txt` in this lane: numbers and pictures of the game's own
motion and model stay off GitHub, like the `*.hades.glb` they come from.

## The cost line

Before: nothing drew a fight. Predicted: a plan of about 1,000 ticks at a few hundred operations each (a few ms, once per change of causes); a
frame of about 30 draw calls with one skinned mesh of 4,000 triangles; a ragdoll of 18 joints, 8 passes, 120 steps a second.

Measured:

| what | number | where |
|---|---|---|
| the plan of the default fight | 3.1 ms | headless Chrome on the new Mac, `FIGHT.replanMs()` (equal events when planned again) |
| the plan in node | 6.5 to 10.3 ms, 1,052 ticks | the new Mac, node 26, a scratch run |
| one frame drawn, GPU read back | 0.8 ms median, 2.6 ms p95, 40 frames | headless Chrome, ANGLE Metal on the M5 Max, 1280 x 720; a panel's vsync wait is not in it |
| the page ready | 0.62 s | from a local door on the same machine (glb 2.0 MB, the two tables 106 KB, three, her modules) |
| at rest | 0 frames in 1.5 s | the frame loop runs only while the fight plays; it stops at the end, at `?at=` and when the tab hides |
| his fall | 12 to 13 ms for 577 steps (4.8 s) | node on the new Mac, once per fall |
| `fight-measure.mjs` | 0.44 s wall, 0.11 s of CPU, about 12 MB read | the serving Mac, a read, nice 19 |
| `fight-bodies.mjs` | 485 ms | the new Mac |
| the tests | 21 of 21, 182 to 194 ms | the new Mac |

Not measured: lysa, WebKit, the iPad, a phone. Every number above comes from the M5 Max.

## His half: at a distance he does what he did

**The recordings and what they are.** Two sessions, both begun from **his own savestate** of the fight he paused on Oct 4 at 07:36:55 WEST
(PEGASUS Seiya against CANCER Deathmask), then continued under the rig lane's button scripts, with Cancer played by the game. These are run1
(898 frames, `script-1.json`) and rig1 (1,177 frames, `trace/rig1/script.jsonl`). The thin-engine lane exported them per frame on Oct 4
(`~/code/thin-engine-2026-10-04/lanes/chunk/out/rec-run1.json`, `rec-rig1.json`, and Seiya's world matrices `rec-*-p1.world.f32`). They are
read in place; their sha256 are in `seiya-fight.hades.json` `made.inputs`. So "what he did" is Seiya's moves in those sessions. Before rel 0
the fight was his own hands; after it, the scripts' presses. The receipt says which is which wherever it matters.

| number | value | source |
|---|---|---|
| his health and Cancer's at the savestate | 50.06 and 67.68, both runs | [recording] rel 0 |
| the distance between them at the savestate | 19.39 units = 1.858 m | [recording]; m: [arithmetic] at 0.09584 m a unit (lab/FIGHTERS.md, from the glb's 1.65 m rest pose) |
| the engine's tick | every 2nd recorded frame; the counter +1.2 a tick (597 ticks), +1.44 at the steps' speed 1.2 (52) | [recording] |
| a tick in ms | 40 ms | [arithmetic] 1.2 / 30 frames a second; 30 a second is GAI.md's likely clip rate, not measured |
| the contact (the bodies never closer, no throw holding them) | 8.0 units = 0.767 m | [recording] both runs |
| the farthest apart, no throw | 109.44 units | [recording] |
| the meteor (clip 64, code 4000) lands near | counter 11.2558 at 8.0 units, twice (rig1 rel 297 and 1107) | [recording] |
| the meteor lands far | counter 20.8557 at 66.06 units (run1 rel 333, distance the frame before the hit) | [recording] |
| the meteor's line | 6.048 units a clip frame (0.580 m, 17.4 m/s at 30 a second) | [arithmetic] from the two readings |
| the meteor's damage | 4.55 (rig1 297, run1 333); 3.69 when Cancer was striking (rig1 1107, Cancer in 3030); in this fight 3.69 while a storm or a bolt of hers is in flight | [recording] |
| the punch (clip 59, code 3040) lands | counter 15.5998 at the contact (run1 rel 413), 11.58 of damage | [recording] |
| the punch's fist | his LEFT hand, 0.501 m ahead, 0.907 m high: 0.266 m from Cancer's axis when it landed | [recording] world matrices; reach [arithmetic] |
| the meteor's fist | his right hand, 0.651 m ahead, 0.935 m high at counter 11.26 | [recording] |
| the same fists from the glb | within 1 cm of the recording at all 4 hit frames (the meteor's within 3 mm; the punch's 5.3 mm is the table's lerp between whole frames) | [glb] vs [recording], a test |
| the root motion of his 15 clips | the disc's waist keys; each ends within 1 mm of the glb's `extras.travel` | [recording] (`disc-chunks` 00.chunk.json) vs [glb] |
| his reactions to Cancer's hits | 33.1060 each time: 1.88 of damage, 22 frames, 0.39 units of travel (he was in his back step); 6.11, 42 frames, 8.03 units; 5.66, 37 frames, 8.01 units | [recording] run1 651, 773, 861 |
| the knock at a hit's frame | 2.26 and 2.25 units (0.22 m), only where he stood in his stance the frame before | [recording] run1 773, 861 |
| his knock-down | 53.1270 82 frames (he staggers, falls to his knees and face down), 50.1240 26 frames on the floor, 52.1260 28 frames rising | [recording] rel 141, 223, 249; what each is [by eye] in the glb's pictures |
| the travel of the knock-down | 18.49 units (1.77 m) away while 53.1270 played | [recording] (Cancer's special carried him; used here as the push of her bolt) |
| his choices | 13: the punch at 8.0 units (2), the meteor at 13.02, 16.16, 87.66, the back step at 16.95, 26.66 (and 15.99 after a hit), the side step 30 at 30.38 (40 at 25.74 after a hit), the run at 71.19 and 92.80, 3020 at 108.07 | [recording] plays that began from his stance |
| the stance before a calm choice | median 39 recorded frames over 10 choices (19.5 ticks, 0.78 s) | [recording]; a 2-frame stance (rig1 279) was a press held through his rise and is left out |
| right after a hit reaction | he moved at once (2 of 2) | [recording] run1 673, 815 |
| the presses | TRIANGLE: 64.4000 (2 and 3 frames after); CIRCLE: 59.3040 (2, 2); CROSS in the round: 57.3020; RIGHT: 1.10; LEFT: 2.20; UP: 3.30; DOWN: 4.40 | [recording] |
| his box, hands, chest | for each whole frame of the 12 clips the fight plays | [glb] through three r185 |
| his health in this fight | 100 | [constant] a new fight's (the rig lane's semaphore says a new fight starts at 100; not measured here) |

**The law.** Each time he stands in his stance he takes the recorded choice whose starting distance is nearest the distance to her now. After a hit
reaction, he takes one of the two choices he made right after his reactions. He holds his stance for the measured median, then plays the choice's
clip for as long as the recording played it, at the recorded speed. He moves by the clip's own root motion and never comes closer to her than the
contact. He always faces her. His meteor lands on the first tick its counter reaches the measured line at her distance. His punch lands if his left
fist is within the measured 0.266 m of her centre at counter 15.6, and misses otherwise. Hit by her, he reacts as he reacted to the recorded hit of
nearest weight. Knocked down, he plays the game's own fall, floor and rise, as long as the recording held each. Felled, he goes to the ragdoll.

**Where the recording is silent:** clips 27 to 72 he never played in these sessions, and 3020 never hit (it was thrown at 108 units). In this
fight 3020 never hurts. SQUARE changed no clip within 40 frames, so his guard is not read. The frame a strike's hurt box opens is not in the RAM
words read; only the frame the health dropped is. Blends: the engine's blend into each clip as recorded (16 into the stance, 8 into the strikes
and steps, 4 into the run, 32 into the knock-down, 0 into a reaction) becomes a crossfade of length/2.4 ticks [arithmetic]; how the engine blends
was never proven (the rig lane's open item).

## Her half: his spells, by his names

**THE SPELL BOOK** (the warden's hypertrace of his recordings, Oct 18 06:36 WEST; his words verbatim, WEST; "in the fight" is the warden's reading):

1. **TIME FREEZE**, his first spell. Sep 16 07:04: "1. time freeze (just take pictures to add to your library) -> if you take a picture nobody can
   tell [WHAT WE DO THEN IS, WITH SPATIAL INDEXING BASICALLY WE TRIANGULATE ALL FUCKING IMAGES AND WE START BUILDING AN HOLOGRAM]". Sep 18 11:49:
   "time freeze is to set up your shot and then you can record and stop and record and stop like kids do on tiktok". Sep 18 16:08: "they can
   literally freeze time and fix posture of actors as they are acting". Oct 15 18:31: "freeze time in the anime - move around the trajectory".
   In the fight [warden]: every hit freezes in-game time (the two-clock law), and the freeze is hers.
2. **THE SWARMSPELL** (the Goldberg enchanter). Sep 14 19:22: "DEVO INIZIARE A Craftare uno spell... ho bisogno nella mano destra di avere lo
   sciame lissajous". 19:44: "I WANT MY FUCKING SWARM TO BE FOLLOWING ME AND I CAN CAST SPELLS WHERE THE SWARM MOVES TO TOPOLOGICAL PLACES UNTIL
   DONE". 21:36: "1 HAND I GOT THE DIGITAL REPLICA, 1 HAND I GOT THE SWARMSPELL, IN THE HEAD THE VISION PRO, IN THE ROOM THE GORGIA EYE". Sep 15
   09:14: "SPAWN IT WITH THE GOLDBERG ENCHANTER... TURN THE GOLDBERG THING INTO A SPELLCASTER". Her storm, his Oct 14 17:15 (the brief): "you see how
   the unit1 satellites start to become larger around the time saint seya does a ryu sei kei shit storm of punches? ... we have the divers that by
   diving cause wripples that are colored".
3. **THE KNIGHTIAN WIND.** Sep 13 21:25: "they are different surfaces of casting the 'KNIGHTIAN WIND' spell". Sep 13 08:06: "i want popsicles to be
   able to feel my knightian wind". [warden]: her push, the thruster's gust on the downbeat (her guard and her shove).
4. **THE BLACKHOLE INTO A WHITEHOLE** (her blink). Sep 21 01:12: "make blobby teleport with a magic blackhole into a whitehole onto its own
   uniquely assigned unit1". Oct 17 03:2x: "the dodecahedron encounters a singularity and out of it the golden sagittarius arises".
5. **SUMMONING.** Sep 11 00:20 (voice): "Summoning ghost, summoning demon, summoning quello che ti pare"; 13:50: "every companion, basically, has a
   summoning interface"; Sep 27 21:31: "the golems are totems... i want to be able to summon my totems"; Oct 2 (the kimi tape): "Summon Saint Seiya".
6. **THE NECROMANCER** (her rise). Sep 16 08:55: "do you know what, in the lore we have, is the necromancer spell?"; Sep 12 13:48: "the necromancer is
   the seat, the tenant, the unit of control"; Sep 16 06:06: "SUMMON THE FUCKING TRACES RESURRECT THE DEAD NEFERTITI".
7. **THE SAGITTARIUS ARMOR** (her gold form, the finisher). Sep 16 08:06: "i need to trigger and activate the sagyttarius armor ASAP"; Sep 23 22:37:
   "ANTIMIRROR IS GOLDEN SAGYTTARIUS ARMOR TO AIOLOS".
8. **THE POST-IT** (her mark). Sep 11: "If this was a world in which I could cast and leave things where I wanted them... I need to be able to leave
   the post-its"; "ci slappo un post-it".
9. **THE DICE.** Sep 23 16:01: "drag on any screen: a spell; lift: the dice". Sep 23 01:29: "in many D&Ds there is the roll of the dice moment...
   like in baldurs gate 3... OUR METHOD IS COMPATIBLE WITH TRAJECTORIES BEING PRE-COMPUTED... chosen deterministically from a variety of pre-cached
   pre-generated outcomes".
10. **THE MAGIC WORD.** Sep 17 20:01: "there is gotta be a magic word that turns all screens into that thing".
11. Her bolt (the brief): Oct 17 01:5x "make it chaotic until it findally finds a lyssajudrean trajectory to the sagyttarius... LIGHTINING BOLT
    MAKE THE DODECAHEDRON BE THERE LIKE AS IF IT WAS A LIGHT-BOOMERANG"; 22:24 "rapidly but lyssajudrean erratically arrive like a boomerang back";
    02:2x "add some dmc4 typa shit boss fight idk where the dodecahedron encounters a singularity".

**THE CONTROLS** (his words, WEST): Sep 18 00:09 "i have spells in my right arm and i got other things depending on the spell selected on the left
hand"; Sep 15 19:45 "WHEN I AM CASTING SPELLS: WHEN I LOOK AT MY LEFT HAND, I WANNA SEE A MAGIC LEVER I CAN SWITCH 3 WAYS, LIKE THE SAME WAY I USE
CLUTCH AND RIGHT HAND WHEN DRIVING... HERE I CAN BE DRUNK AS FUCK"; 20:48 "with my left hand in VR when i look at my left hand i unlock 2
directions, left right and up down... when left/right it's decided already, when up down i want you to also have the cost"; Sep 14 19:22 and Sep 15
09:09 "I WANT TO SEE THE LISSAJOUS SWARM IN MY HAND"; Sep 12 12:43 (voice) "Popsicles is currently the phone in my left hand, and it has always been
like that"; Sep 15 14:44 "THE RED-PHONE WITH RIGHT-HAND SPELLCASTER IN THE EMBERTIDE-MESH SYNCED"; Sep 23 16:01 drag is a cast, lift is the dice;
Sep 6 17:21 "i need a fucking joystick on the left"; Oct 6 22:28 "buttons: return to frozen camera trajectory, freeze time, activate gravity / fly
without gravity, 2 joysticks to move position and view/camera"; Oct 4 02:55 "the gamepad is a UDP broadcaster... every screen replays actions
locally".

**The lane's table** [choice], never his word: a cause is `{beat, lever, cast}` on the song's grid; the left hand's three-way lever selects, the
right hand's cast fires. Lever 1, the guard: a tap is THE KNIGHTIAN WIND, a drag is THE BLACKHOLE INTO A WHITEHOLE. Lever 2, the swarm: a tap is
THE POST-IT, a drag is THE SWARMSPELL. Lever 3, the gold: a drag is the LIGHTNING BOLT, a tap is THE SAGITTARIUS ARMOR. A lift on any lever is THE
DICE. The fight's first cause is THE MAGIC WORD, and it is SUMMONING. On the page: keys 1, 2 and 3 set the lever, a drag or a tap on the glass
casts, space lifts. Since lane the-two-hands-cast (Oct 24 2026, `room/THE-TWO-HANDS-CAST-LANDING.md`) his hands cast on the Nest itself: aiolos reads the
phone's wind.hand (the left hand's pointing is the lever, the right hand's pinch the cast; `room/hand-cast.mjs`) and writes a spell.cast cause by the one
book (`room/spell-book.mjs`, this table moved there), which every glass that draws her paints; this page keeps its keys and its glass, a lab, not a glass of the house.

**Her numbers.**

| number | value | source |
|---|---|---|
| her grid | 600 ms a beat, 4/4 (genesis: no song on this page) | [her code] lyssajudron-score.mjs |
| her body, a satellite | radius 0.206 m; 0.087 m | [her code] K, R_SAT |
| her bob and dip | 0.05 m a beat, 0.03 m on the downbeat | [her code] |
| her height in the fight | 0.926 m, his strikes' measured fist height | [choice] from [recording] |
| her range from him | 16.16 units (1.549 m), re-taken on every beat over one beat | [choice]: the farther distance he threw his meteor from (rig1 1089) |
| her health | 100 | [constant] |
| a dive of the storm | one every sixteenth, flies one beat, returns one; grows to 2x; 1.88 of damage | [constant]; 2x [his words] "start to become larger"; 1.88 by analogy, the lightest hit he took (run1 651) |
| the bolt | leaves on a downbeat, strikes 2 beats later, back by the next downbeat; 12.51 of damage | [constant]; 12.51 by analogy, the heaviest hit he took (rig1 509) |
| THE SAGITTARIUS ARMOR | gold over one bar, then her arrow (the bolt in gold) takes all his health | [constant] |
| THE KNIGHTIAN WIND | the gust on the next downbeat; guard from a sixteenth before it to a beat after; shoves within 1.2 m | [constant] |
| THE BLACKHOLE INTO A WHITEHOLE | sinks half a beat, gone half a beat, rises half a beat, 60 degrees round him | [constant] |
| THE NECROMANCER | falls half a beat, lies a beat, rises by her fall replayed backward | [constant] |
| THE DICE | a d20 from the cause's count and beat by an integer hash; it orders the next storm's dives | [constant]; never `Math.random` |
| the freezes | a dive a sixteenth (150 ms), a strike a beat (600 ms), the knock-down a bar (2.4 s), her arrow 1.5 s | [constant]; 1.5 s is boss-intro.mjs BOSS.freeze_ms |
| her ranks | the style meter's words (D Dull. ... SSS SSSovereign!!!) | [her code] boss-intro.mjs BOSS.ranks; +1 a spell that lands, +1/3 a dive, +2 the arrow, 0 at his hit [constant] |
| her body | pentagons, hexagons, wires, eyes, flame from room/lyssajudron.mjs (goldbergGeometry, porcelain, INK), score's lanes, band's tones | [her code] |

Her body's hexagons are porcelain here. Her twin draws them as glass since Oct 16, with her tank inside; the tank is not on this page.

## The two clocks

This follows plans/the-fight-that-scans-the-room.md, "Two clocks", and his words there. In-game time moves only while the fight moves. It freezes
at every hit with the pose held, and the wall clock runs on. Every freeze lasts a whole number of sixteenths, so in-game beats stay on the wall's
grid of sixteenths, as the music ruler asks. During a freeze the camera turns slowly round the held moment (his Oct 15 18:31 "freeze time in the
anime - move around the trajectory"). The recording shows no hit-stop at the meteor's hit: dt read 2.40 on both sides at rig1 297 [recording].
So the freeze is his law, not the game's.

## The fight the default causes give

Eleven causes (`DEFAULT_CAUSES`): the magic word; the wind; a post-it; a storm; a blink; the dice; a bolt; a second storm; the wind; a bolt; the
armor. What follows from them, read off the plan:

- 0.00 s: SUMMONING. He stands at his savestate's 1.86 m while the ring rises through one bar.
- 3.56 s: his first meteor lands (-4.55). At 5.12 s her wind holds his second and shoves him back. At 7.44 s his third lands.
- 6.60 s: the post-it rides his chest. From 8.40 to 10.05 s the twelve dive at it, 12 of 12 (-1.88 each), each a coloured ripple in its tone.
- 12.0 to 12.9 s: the black hole, then the white hole round him. 13.20 s: the dice roll 17 and order the next storm.
- 14.92 s: his meteor breaks her first bolt in flight (-3.69). Three more land, at 16.48, 18.04 and 19.60 s.
- From 21.00 to 22.65 s: the second storm, 12 of 12.
- 25.60 to 28.72 s: three meteors land. Her wind's gust at 26.40 s holds none of them; the guard window missed his timing.
- 30.00 s: her bolt lands (-12.51). He falls, lies and rises (53.1270, 50.1240, 52.1260).
- 33.00 s: THE SAGITTARIUS ARMOR. She turns gold. Two more meteors land on her.
- 37.12 s: his punch misses (his fist is not within 0.266 m of her). 37.20 s: her arrow lands. He falls on the ragdoll and lies where he fell.
- The end: in-game 42.04 s, wall 56.29 s. She has 51.7 of her health left, he has 0.

Counts: 22 moves of his, 11 meteors on her, 24 dives on him, 1 block, 1 broken bolt, 1 missed punch, 38 freezes. Her THE NECROMANCER is in the law
but this fight does not reach it: his punch never landed.

## The proof (headless Chrome on the new Mac)

```
node embertide-app/ui/intro/dyson-society/lab/fight-lyssa-seiya.proof.mjs --tree <checkout> --out <folder>
```

A node door over the checkout's `embertide-app/ui` serves the page; it follows links in the folder, as aiolos does. Chrome for Testing runs
headless, so no window opens on any screen. The proof loads `fight-lyssa-seiya.html?play=0` and reads the plan. It draws the summoning, every hit
and the block at mid-freeze, the post-it, the gusts, the blink's two holes, the bolts in flight, the armor and five instants of the fall. It
saves each frame and has the page lay all 54 out as one contact sheet. PASS requires: no page error, her win, the fall present, every frame saved,
the sheet written, and 0 frames drawn in 1.5 s at rest. Result: PASS (`lab/fight-lyssa-seiya.proof.json`). The renderer was ANGLE Metal on the
Apple M5 Max. One console line came from three ("PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.").

Run again from a fresh checkout of the lane at `34d68becf` on the new Mac (Oct 18 2026 14:1x WEST, load 7 to 10). `fight-bodies.mjs --check` was
EQUAL (496 ms), the tests 21 of 21 (190 ms), the proof PASS (a frame 0.9 ms median, 2.2 ms p95, the plan 3.1 ms, 0 at rest, the page ready in
0.61 s). Its contact sheet is byte-identical to the committed one (sha256 `5767ad8bb0c591a5...`): the same causes gave the same pixels. Then the
new Mac's scratch was removed: three worktrees and their folders, with 0 Chrome profiles, 0 processes and 0 worktrees of this lane left.

Seen in the pictures [by eye]: Seiya in the Pegasus Cloth in every cell; his meteor's fist at her; the post-it on his chest; the twelve grown,
open in their tones and diving, with coloured ripples; the black hole's orange rim and the white hole; the gold streak of her arrow; his body
thrown back and lying under her gold. Two faults the first sheet showed are fixed in this lane. The camera trailed by 2 s and cut him at the edge.
After a drawn fall, the root bone stayed where he fell (no clip has a track on it), so the sheet, drawn after the fall's frames, lost him.

## Corrections to what this lane was handed

- **53.1270 is his knock-down, not an entrance.** The pictures show the stagger, the knees and the fall face down, then 50.1240 lying and
  52.1260 rising. The CROSS at rel 115 was the press that left his pause menu, and the game resumed the knock-down Cancer's special had begun before
  his pause.
- **"His own fight, played by him"**: the recordings begin at his savestate. After rel 0 the presses are the rig lane's scripts. His hands are in
  the state at rel 0 (the healths, the places, the knock-down under way).
- **The meteor's far reading** is 66.06 units on the frame before the hit. At the hit's frame Cancer had dashed 7.01 units closer (he was in
  50, a dash), so the line through 59.13 (5.1 units a frame) is the dash's, not the meteor's. This lane's line uses the frame before: 6.048.

## Not done, said plainly

- Nothing is on a glass and nothing is on the Nest. The fight's causes are local to the page: no Nest ref, no signature, no swarmclock stamp.
  Every glass that runs the page with the same causes plans the same fight, but nothing tells two glasses the same causes yet, and a freeze is not
  a Nest freeze. Which glass shows it, and when, is his.
- His hands are the page's keyboard and pointer. The red phone, the Mac eye's hand pose and the iPad do not reach it.
- Nothing ran on lysa, in WebKit or on a phone.
- The fight is decided by doubles and `Math.sin`. Two engines plan the same fight unless a hit falls within an ulp of its edge; this is not
  proven on WebKit.
- Her moves have no recording to measure. Their timings and weights are the constants above, and her storm's 1.88 and her bolt's 12.51 are
  analogies.
- His side is limited to what the two sessions show: 15 of his 73 clips, no guard, no throw of his own, no special beyond the meteor, 3020
  harmless, and the head look and face smoother of the engine not run (the glb carries the keys alone, lab/FIGHTERS.md).
- The ragdoll steps his 18 structural joints. Hair, face, fingertips, shoulder plates and IK nodes ride their parents as the fall began. The
  limits and radii are by eye.
- THE NECROMANCER, the punch landing and the run are in the law but not in this fight.
- No sound and no film are on this page, so The rule's item 8 (the sound never restarts the picture) does not bind it.

## Prove it again

```
node embertide-app/ui/intro/dyson-society/tools/fight-measure.mjs --check          # on the Mac holding ~/code/thin-engine-2026-10-04 (a read, under 1 s)
node embertide-app/ui/intro/dyson-society/tools/fight-bodies.mjs --check           # the new Mac, 0.5 s
node --test --test-force-exit --test-timeout=120000 embertide-app/ui/intro/dyson-society/lab/fight-lyssa-seiya.test.mjs
node embertide-app/ui/intro/dyson-society/lab/fight-lyssa-seiya.proof.mjs --tree <checkout> --out <folder>
```

Tests and the proof run on the new Mac only, under `tools/dead-tasks/bounded.mjs`, at nice 19. The commits that ran them are in the lane's log.
