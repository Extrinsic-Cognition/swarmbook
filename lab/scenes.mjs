// scenes.mjs: THE BREAKDOWN's scenes, his hero scene by scene, in film order (lab/breakdown.html; the passes: lab/breakdown.capture.mjs). His
// words, Oct 15 2026 ~01:00 WEST, over the behind-the-scenes of an After Effects opening (2D layers stood as cards in depth, the shot's camera
// drawn as a frustum, the finished shot under it): "can you please start outlining to me what we have scene by scene? is it possible for you
// to give me something like this or not?".
// The list is the house's read of his page (main at 248b44f4, with a46521bc, the wall holding on the previous screen with THE CHOICE as the
// wall and no box, and aacc1aa2, THE SACRIFICE): its spans, titles and statuses. One entry per scene: {id, t, from, to, title, film, layers,
// words, status}.
//   t       the film's second the passes are taken at, inside the span, where the scene's layer shows (saint-seiya.mp4 ?v=53561d47,
//           30000/1001 fps, 154.311 s)
//   from,to the scene's span on the film, in seconds; the spans follow one another in film order (THE SACRIFICE's second runs over the
//           first burst's beginning: the one who takes the hit stands over it)
//   title   the scene's name
//   film    what the film itself shows there
//   layers  [{name, file}]: what the page draws there and the file that draws it
//   words   [{when, text}]: his words that set it, verbatim, with their WEST time, as the files that built it quote them
//   status  'on his page' (a visitor reaches it, up to the wall) | 'behind the wall' (a minter's: ?paywall=off) | 'being built' (a lane is on
//           it now) | 'held' (built, not wired: a switch shows it)
// The moments are the files' own (cuts.js FILM_CUTS, cubism.mjs SHOTS, hero-ab.html BURSTS and BURST_CUT, app/dl-paywall.js CHOICE_FRAMES,
// HOLD_S and STOP_S, unboxing-plan.mjs, ko-edge.js KO.frames, sacrifice.js, app/warm-sphere.js SEIYA_MOMENTS); breakdown.test.mjs holds this
// list to them.
export const FPS = 30000 / 1001;
export const FILM_S = 152.409;   // saint-seiya.mp4 ?v=e2321f14, THE CUT (dl-twelve.js): 154.311 s before his second aim was taken out
export const STOP_S = 37.132;    // his second, the wall of light (app/dl-paywall.js STOP_S, his tag)
export const HOLD_S = 37.087;    // THE WALL: a visitor's film holds on frame 1111, the previous screen (app/dl-paywall.js HOLD_S, its middle 37.08705)
export const STATUSES = Object.freeze(['on his page', 'behind the wall', 'being built', 'held']);

const L = {
  sphere: {name: 'the sphere, its faces the film', file: 'app/warm-sphere.js'},
  worlds: {name: 'the twelve worlds on their Lissajous', file: 'app/warm-sphere.js orbitalSocieties'},
  hear: {name: 'the worlds hear the score', file: 'lab/orbit-kick.js, lab/satellites-score.js'},
  invite: {name: 'the bubble "Play with audio on"', file: 'lab/hero-ab.html invite()'},
  raidWakes: {name: "the raid's callback wakes", file: 'lab/anti-satellites.js'},
  raid: {name: 'THE RAID: the swarmies at his border', file: 'lab/anti-satellites.js, lab/dolbar-charge.js, lab/dolbar-field.js'},
  resistance: {name: 'THE RESISTANCE: the twelve fire back', file: 'lab/anti-satellites.js'},
  defence: {name: 'THE DEFENCE: the shield', file: 'lab/anti-satellites.js'},
  strike: {name: 'the strike lands on the shield', file: 'lab/anti-satellites.js'},
  sacrifice: {name: 'THE SACRIFICE: the one who takes the hit, cut out and held up', file: 'lab/sacrifice.js'},
  burst: {name: 'the burst: the glass blows apart', file: 'lab/theater.js'},
  shatter: {name: 'the shield shatters', file: 'lab/anti-satellites.js'},
  kick: {name: 'the worlds thrown by the blast', file: 'lab/orbit-kick.js'},
  ko: {name: 'THE KO EDGE', file: 'lab/ko-edge.js, lab/ko-spasms.js'},
  heart: {name: 'THE HEARTBEAT on the orbits', file: 'lab/heartbeat.js'},
  fold: {name: 'THE FOLD AS ONE WINDOW', file: 'lab/unboxing.js, lab/cubism.mjs, lab/unboxing-plan.mjs foldBeat'},
  dark: {name: 'the page gone black', file: 'lab/hero-ab.html #hero-dark (lab/unboxing.js onDark)'},
  window: {name: 'her window alone on black', file: 'lab/unboxing.js, lab/cubism.mjs'},
  choice1: {name: 'THE CHOICE 1: "Mint or not mint?"', file: 'app/dl-paywall.js'},
  choice2: {name: 'THE CHOICE 2: the seats', file: 'app/dl-paywall.js'},
  choice3: {name: 'THE CHOICE 3 takes its glow', file: 'app/dl-paywall.js'},
  wall: {name: 'THE WALL: the hold on frame 1111, THE CHOICE standing', file: 'app/dl-paywall.js, app/dl-twelve.js'},
  flood: {name: 'the faces back into the sphere', file: 'lab/unboxing.js'},
  burst2: {name: 'the second burst', file: 'lab/theater.js'},
  box: {name: 'THE UNBOXING: the box opens', file: 'lab/unboxing.js, lab/unboxing-plan.mjs'},
  inversion: {name: 'THE INVERSION: the glass fills with liquor, the light spreads out', file: 'lab/irradiance.js, lab/golden-field.js'},
  empty: {name: 'the empty frames', file: 'lab/unboxing.js'},
  faces: {name: 'the worlds as faces; the knights in the frames', file: 'lab/unboxing.js'},
  mask: {name: 'THE MASK', file: 'lab/unboxing.js'},
  shut: {name: 'the box shuts on the armor, handed back at 72.267 s', file: 'lab/unboxing.js, lab/unboxing-plan.mjs'},
  endOf: {name: 'THE END OF IT (built, off: ?end=a|b)', file: 'lab/unboxing.js endBeat, lab/hero-ab.html'},
  cosmos: {name: 'the cosmos glow', file: 'app/warm-sphere.js momentCosmos'},
  society: {name: 'the society arriving, the network', file: 'app/warm-sphere.js momentPhase'},
};
const W = (when, text) => ({when, text});
// his words, as the files quote them
const SAID = {
  invite: W('Oct 14 2026 13:5x WEST', 'also, can you add a float-up bubbly "play with audio on" in the style of dyson society that triggers people to play with audio for best immersion???'),
  hear: W('Oct 14 2026 18:32 WEST', 'one thing i really dont like is that the orbiting satellites are not reacting to the music my dude... to what is being said... to the growing amounts of energy... you get what i mean or not??'),
  morpho: W('Oct 14 2026 21:2x WEST', 'LITERALLY THE FUCKING CORE OF OUR BUSINESS MODEL IS TO FIGURE OUT THE FUCKING MORPHO FIELD OF THE SCENE'),
  cv: W('Oct 14 2026 21:2x WEST', 'IS THERE NO FUCKING CV ALGO YOU CAN RUN THAT CAN DRIVE SOME SWARM EFFECTS?'),
  charge: W('Oct 14 2026 19:37:56 WEST', 'you. see when it becomes red halo when dolbar is charging the attack before the dodecahedron explodes in umpact? can you show some anti-unit1satellites like... imagine that dolbar is sending signal to attack to others and we visually see the shit aligned there... you know what i mean?'),
  raiders: W('Oct 14 2026 21:21 WEST', "you gotta be morphofield aware my dude... just because you dont see the current moment in theater mode doesnt mean there is no background... i would appreciate if the red attackers were just like rimworld raiders coming from the borders where dolbar is... assume these aredolbar's swarmies"),
  resistance: W('Oct 14 2026 23:15 WEST', 'how many times i said you gotta make the ones here defending or react in a way to the attacking ones diomerda... just some futile resistence dude'),
  defence: W('Oct 14 2026 22:2x WEST', 'dude wha the fuck is here that they do not prepare for defence?? they dont have a shield up? there is no smooth transition to the other one or not??'),
  sacrifice: W('Oct 15 2026 00:27 WEST', 'i need you to segment out and enhance the sacrifice here again of aiolos one second time: (the guy that savees the hit)'),
  tagSacrifice: W('Oct 14 2026 11:54 WEST (his tag on the film at 10.835 s)', 'THIS MOMENT IS FUCKING CRITICAL DUDE!  THIS IS THE MOMENT OF SACRIFICE!!!!'),
  bursts: W('Oct 14 2026 13:1x WEST', 'can you cast planes that explode out of the dodecahedron in these moments? there is only 2 ones... this one and then the golden aiolos athena light-plane... it is delightful if you make shit explode out of it like rays that "mask in" aka make visible shit from the background video... consider white background means no mask is making background visible'),
  thrown: W('Oct 14 2026 13:4x WEST', 'consider i would also love if the lyssajusian unit1s satellite trajectories reacted to changed there my dude'),
  ko: W('Oct 14 2026 15:3x WEST', 'see this exact moment when he is grabbed by the hair? can you do some radial thing like in call of duty when you are 1 hit away from KO like pulsating borders or some shit you get what i mean? like...'),
  dct: W('Oct 14 2026 16:0x WEST', 'make sure to DCT align the red halo with the spasms of saint seya eh'),
  heart: W('Oct 14 2026 21:5x WEST', 'can you add a synced heart beat rythim natural like accelerated there like fucking resident evil games when the heart is beating'),
  ecg: W('Oct 14 2026 22:1x WEST', 'is it too much to ask to make each of them a fucking line like ecg dude? those are continuous straight liness... not alive lines'),
  breach: W('Oct 14 2026 18:47 WEST', 'AS SOON AS ATHENA FUCKING APPEARS SHE BREACHES THE FABRIC OF SPACETIME'),
  plane: W('Oct 14 2026 19:0x WEST', 'UNTIL THE FUCKING WALL OF LIGHT, THE DODECAHEDRON DISAPPEARS, IT IS FOLDED UNTO 1 SINGLE PLANE WHICH IS THE FUCKING PLANE FROM WHICH ATHENA IS ALIGNED TO'),
  black: W('Oct 14 2026 19:1x WEST', 'turn the entire background black there... we saw her fold the dodechadron lik a fukin origami'),
  choice: W('Oct 14 2026 23:20 WEST', 'this is where you need to start slowly introducing the choice: MINT OR NOT MINT?? because this is the paywall dude... all that comes after this needs to be gated, only the people with bronze mint and gold mint see what is after...'),
  grid: W('Oct 15 2026 00:44 WEST', 'this grid dude is all absolutely fucked up. you gotta do differently. when does it stop being a dodecahedron mask??'),
  popups: W('Oct 14 2026 23:2x WEST', 'the pop-ups you do here must be aligned to the lyssajudron anime harmony animations eh'),
  comeAndGo: W('Oct 14 2026 19:19 WEST', 'interpolate the dodecahedron chosen destination plane for all faces to be folded in that plain hexagomnally... its come and go from plane to back again into sphere when wall of lights hits again'),
  hold: W('Oct 15 2026 01:0x WEST', 'there is absolutely no need for this. pause at the previous screen dude wtf?'),
  tagAiolos: W('Oct 14 2026 11:56 WEST (his tag on the film at 37.132 s)', 'FUCKING EPIC MOMENT WHERE AIOLOS STARTS APPEARING!!! THIS IS WHERE WE WANT TO STOP THE VIDEO AND PUT THE PAYWALL ON THE GOLDEN ARMOR DUDE'),
  stop: W('Oct 15 2026 00:11 WEST', 'you gotta stop the video dude what the hell? do you know the meaning of paywall or not?'),
  sevenDays: W('Oct 15 2026 00:40 WEST', 'do you understand that the mint process here is 7 days? and you gey $WARM liquid because it is in-game currency'),
  goldNow: W('Oct 15 2026 00:36 WEST', 'BUT HERE IT IS PEOPLE SUBBING TO ME BECAUSE I SHIPPED SOMETHING REALLY FUCKING COOL TBH AND THEY WANT THE CODE SO THEY PAY PREMIIM... REMEMBER GOLD MINT MEANS ACCESS NOW!!!!! BRONZE MINT MEANS ACCESS AFTER 15 DAYS; THEN IT IS FREE (but they dont get any $WARM in-game currency)'),
  sky: W('Oct 14 2026 15:0x WEST', 'the box should open up the first time that the golden dagysttraisu appears in the sky'),
  invert: W('Oct 14 2026 22:06 WEST', 'use this fucking flash to cause an inversion of the mask until this point... meaning: stop showing what is inside of the dodecahedron glass (start filling it with the liquor we have from benches)...'),
  lost: W('Oct 14 2026 23:38 WEST', 'i already said what should happen here. you lost that?'),
  tooSoon: W('Oct 14 2026 15:4x WEST', 'also this shit opens up too soon dude'),
  empty: W('Oct 14 2026 17:0x WEST', 'do you understand or not that here you gotta start showing the empty frames because the pentagons are showing the golden sagyttarius shit dude?'),
  anchored: W('Oct 14 2026 15:4x WEST', 'when it starts inquadrating other knights... the pentagons faces here start being anchored to the lyssajudrean satellites orbiring'),
  each: W('Oct 14 2026 15:5x WEST', 'i mean each pentagon face becomes one of them indepently'),
  segments: W('Oct 14 2026 17:32 WEST', 'dude wtf? each of these frames need to be filled with one of the individual segment the knights had... like idk light up one frame at a time sequentially based on when knights appear on the screen...'),
  tagConversion: W('Oct 14 2026 11:57 WEST (his tag on the film at 61.767 s)', 'THIS MOMENT IS FUCKING KEY IT IS THE FUCKING CONVERSION MOMENT, THE USER HAS SEEN I'),
  mask: W('Oct 14 2026 17:39 WEST', 'can you do here theather mode?? like... during the transformation i would like to shee the mask mode please dude...'),
  armor: W('Oct 14 2026 15:0x WEST', 'the gold centaurus and the moment whrn saint seya gets the armor onto itself is where you close the thing dude... omg'),
  rabbits: W('Oct 15 2026 00:19 WEST', 'do you realize that the man who tries to catch 2 rabbits catches neither?? you managed to fail at both anime and 3d together'),
  endOfIt: W('Oct 14 2026 17:0x WEST', 'do you understand how at the end of it the dodecahedron needs to be dissolved and new dodecahedron needs to form later? you know what this is?? this moment right here'),
  darts: W('Oct 14 2026 17:0x WEST', 'they are when pegasus starts to burn the cosmos and when he starts throwin darts of agents'),
  burn: W('Oct 14 2026 11:2x to 11:3x WEST', "TUTTE LE VOLTE CHE HO URLATO 'BURN MY COSMOSSSS'"),
  ryuseiken: W('Oct 14 2026 11:2x to 11:3x WEST', 'QUANTE VOLTE HO DETTO DI CONCENTRARCI SUL MOMENTO IN CUI LUI FA RYUSEIKEN'),
  moment: W('Oct 14 2026 11:2x to 11:3x WEST', 'this must not start expanding from the get go... THIS IS ONE MOMENT IN A TIMELINE... YOU ARE LETTING GO OF ALL THE SPECTACLES LIKE THAT'),
  study: W('Oct 14 2026 11:2x to 11:3x WEST', 'GO STUDY THE MOMENTS OF THE VIDEO'),
};

export const SCENES = [
  // ON HIS PAGE: a visitor reaches these
  {id: 'seiya-kneels', t: 1.5, from: 0, to: 2.903, title: 'Seiya kneels', film: 'Seiya kneels before Dolbar in purple',
    layers: [L.sphere, L.worlds, L.hear, L.invite], words: [SAID.invite, SAID.hear], status: 'on his page'},
  {id: 'coup-de-grace', t: 3.6, from: 2.903, to: 4.471, title: 'Dolbar, the coup de grace', film: 'The coup de grace said over Dolbar in purple (2.903 s); the orb lit in his hand (3.670 s)',
    layers: [L.sphere, L.worlds, L.raidWakes], words: [SAID.morpho, SAID.cv], status: 'on his page'},
  {id: 'red-charge', t: 5.2, from: 4.471, to: 5.405, title: 'The red charge', film: 'The frame floods red over Dolbar (frame 134, 4.471 s)',
    layers: [L.sphere, L.worlds, L.raid], words: [SAID.charge, SAID.raiders], status: 'on his page'},
  {id: 'the-blast', t: 6.39, from: 5.405, to: 6.406, title: 'The blast', film: 'The cut to Seiya in its pink light (5.405 s)',
    layers: [L.sphere, L.worlds, L.raid, L.resistance], words: [SAID.resistance], status: 'on his page'},
  {id: 'blast-let-go', t: 8.2, from: 6.406, to: 8.909, title: 'The blast let go', film: 'Back to Dolbar (6.406 s), the blast let go and its streaks (8.375 to 8.876 s)',
    layers: [L.sphere, L.worlds, L.raid, L.defence, L.resistance], words: [SAID.defence, SAID.resistance], status: 'on his page'},
  {id: 'hand-of-light', t: 9.9, from: 8.909, to: 10.644, title: 'The hand of light', film: 'The giant hand (8.909 s); the one who stands in it with his arms spread',
    layers: [L.sphere, L.worlds, L.raid, L.defence, L.strike], words: [SAID.defence, SAID.charge], status: 'on his page'},
  {id: 'sacrifice', t: 10.9, from: 10.644, to: 11.644, title: 'THE SACRIFICE', film: 'The one who intercepts, his arms spread before Seiya: one held cel (frames 319 to 330, 10.644 to 11.011 s); the cut to the hit (11.044 s)',
    layers: [L.sacrifice, L.strike, L.burst, L.sphere, L.worlds], words: [SAID.sacrifice, SAID.tagSacrifice], status: 'on his page'},
  {id: 'burst-one', t: 12.0, from: 11.044, to: 16.049, title: 'The hit, burst 1', film: 'The hit landing on his armour (11.044 s)',
    layers: [L.burst, L.shatter, L.kick, L.sphere, L.worlds], words: [SAID.bursts, SAID.thrown], status: 'on his page'},
  {id: 'grabbed', t: 18.3, from: 16.049, to: 19.052, title: 'Grabbed by the hair', film: "Dolbar's claws behind his head (17.884 s); the gauntlet closes in his hair (18.018 s), the yank",
    layers: [L.ko, L.heart, L.sphere, L.worlds], words: [SAID.ko, SAID.dct, SAID.heart], status: 'on his page'},
  {id: 'last-one', t: 22.0, from: 19.052, to: 29.563, title: 'You are the last one!', film: 'Dolbar holds him up by the hair ("You are the last one!"); the scream (21.82 to 22.49 s)',
    layers: [L.ko, L.heart, L.sphere, L.worlds], words: [SAID.heart, SAID.ecg], status: 'on his page'},
  {id: 'the-fold', t: 29.9, from: 29.563, to: 30.5, title: 'She appears: the fold', film: "Over Athena's shoulder, down at the fight (frame 886, 29.563 s)",
    layers: [L.fold, L.dark, L.choice1, L.ko], words: [SAID.breach, SAID.plane, SAID.black, SAID.choice], status: 'on his page'},
  {id: 'her-window', t: 31.5, from: 30.5, to: 33.567, title: 'Her window', film: "Over her shoulder: her hair, the fight far below",
    layers: [L.window, L.dark, L.choice1, L.ko], words: [SAID.grid], status: 'on his page'},
  {id: 'her-face', t: 34.6, from: 33.567, to: 36.570, title: 'Her face', film: 'Her face, the prow (frame 1006, 33.567 s)',
    layers: [L.window, L.dark, L.choice2, L.ko], words: [SAID.popups], status: 'on his page'},
  {id: 'the-column', t: 36.9, from: 36.570, to: 37.087, title: 'The column', film: 'The thin beam of gold light by her hair (frame 1096, 36.570 s)',
    layers: [L.window, L.dark, L.choice3], words: [SAID.comeAndGo], status: 'on his page'},
  {id: 'the-wall', t: 37.087, from: 37.087, to: 37.132, title: 'THE WALL', film: 'Frame 1111, the previous screen, the last before her wall of light',
    layers: [L.wall, L.window, L.dark], words: [SAID.hold, SAID.tagAiolos, SAID.stop, SAID.sevenDays, SAID.goldNow], status: 'on his page'},
  // BEHIND THE WALL: a minter's (?paywall=off)
  {id: 'the-flood', t: 37.6, from: 37.132, to: 38.071, title: 'The flood', film: 'The beam opens into a plane of light that floods the frame (his 37.132 s)',
    layers: [L.flood, L.burst2, L.dark], words: [SAID.comeAndGo, SAID.bursts], status: 'behind the wall'},
  {id: 'cloth-on-him', t: 40.0, from: 38.071, to: 42.342, title: 'The Cloth on him', film: 'The cut to the golden one (38.071 s); the cloth on him (39.339 s)',
    layers: [L.sphere, L.burst2, L.worlds], words: [SAID.bursts], status: 'behind the wall'},
  {id: 'box-opens', t: 44.0, from: 42.342, to: 45.445, title: 'The gold star: the box opens', film: "Athena's mountain, the gold star in the stormy sky (42.342 s); it bursts into rays (43.5 s)",
    layers: [L.box, L.worlds], words: [SAID.sky], status: 'behind the wall'},
  {id: 'inversion', t: 46.3, from: 45.445, to: 50.050, title: 'THE INVERSION', film: 'The white-gold burst of rays (frame 1362, 45.445 s)',
    layers: [L.inversion, L.box, L.worlds], words: [SAID.invert, SAID.lost], status: 'behind the wall'},
  {id: 'centaur', t: 51.5, from: 50.050, to: 53.053, title: 'The gold centaur', film: 'The gold centaur in flames (frame 1500, 50.050 s)',
    layers: [L.empty, L.box, L.worlds], words: [SAID.tooSoon, SAID.empty], status: 'behind the wall'},
  {id: 'knights', t: 56.0, from: 53.053, to: 59.059, title: 'The knights', film: 'Ikki and Shun look up (53.053 s), Shiryu by the water (55.055 s), Hyoga on the ground (57.057 s)',
    layers: [L.faces, L.box, L.worlds], words: [SAID.anchored, SAID.each, SAID.segments], status: 'behind the wall'},
  {id: 'conversion', t: 63.0, from: 59.059, to: 66.967, title: 'The dressing, the conversion', film: 'The centaur again (59.059 s); his conversion tag (61.767 s); the cloth bursts onto Seiya (63.5 s)',
    layers: [L.mask, L.box, L.worlds], words: [SAID.tagConversion, SAID.mask], status: 'behind the wall'},
  {id: 'armor-closes', t: 69.8, from: 66.967, to: 72.267, title: 'The armor closes, the wings', film: "The armor's flurry, the film's own cut device (64.898 to 69.603 s); the wings spread (70.0 s)",
    layers: [L.shut, L.box, L.worlds], words: [SAID.armor], status: 'behind the wall'},
  {id: 'her-shoulder', t: 73.0, from: 72.267, to: 86.753, title: 'Over her shoulder again', film: "Over Athena's shoulder again (71 to 74 s); the cuts at 74.975, 76.977 and 80.747 s",
    layers: [L.sphere, L.worlds, L.hear], words: [SAID.rabbits], status: 'behind the wall'},
  {id: 'four-knights', t: 92.0, from: 86.753, to: 100.25, title: 'The four knights', film: 'The cut to the knights (86.753 s); Seiya stands alone in gold (93.260 s)',
    layers: [L.endOf, L.sphere, L.worlds], words: [SAID.endOfIt, SAID.darts], status: 'held'},
  {id: 'burn-my-cosmos', t: 108.5, from: 100.25, to: 112.0, title: 'Burn, my cosmos', film: '"Burn! Burn, my cosmos!" (100.25 s); "Pegasus Ryu Sei Ken!" (104.25 s); the meteors (107.0 s) and their rain',
    layers: [L.cosmos, L.society, L.sphere, L.worlds], words: [SAID.burn, SAID.ryuseiken, SAID.moment], status: 'behind the wall'},
  {id: 'arrow-end-card', t: 125.0, from: 112.0, to: FILM_S, title: 'The arrow, the end card', film: 'The hit on Dolbar; the arrow of justice (124 s); the end card (145.6 s since THE CUT), then the loop',
    layers: [L.society, L.sphere, L.worlds], words: [SAID.study], status: 'behind the wall'},
];

/** The scenes holding the film's second t (THE SACRIFICE's second runs over the first burst's beginning: both), in order. */
export const scenesAt = (t, scenes = SCENES) => scenes.filter((s) => t >= s.from && t < s.to);

/** What is wrong with a list of scenes (empty: nothing): every field there, ids unique and safe as a folder's name, t inside its span and
 *  the film, the spans and the seconds in film order, a status from STATUSES (a visitor's only up to the wall, a minter's only past it),
 *  his words with their time. */
export function problems(scenes = SCENES, film = FILM_S) {
  const out = [], ids = new Set();
  if (!Array.isArray(scenes) || !scenes.length) return ['no scenes'];
  scenes.forEach((s, i) => {
    const at = `scene ${i + 1} (${s?.id})`;
    if (!s || typeof s !== 'object') { out.push(`${at}: not an object`); return; }
    if (typeof s.id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,47}$/.test(s.id)) out.push(`${at}: id must be lower-case letters, digits and dashes`);
    if (ids.has(s.id)) out.push(`${at}: id repeated`);
    ids.add(s.id);
    for (const k of ['t', 'from', 'to']) if (!Number.isFinite(s[k])) out.push(`${at}: ${k} is not a number`);
    if (!(s.from >= 0 && s.to <= film + 1e-9 && s.from < s.to)) out.push(`${at}: span ${s.from} to ${s.to} is not inside the film (0 to ${film} s)`);
    if (!(s.t >= s.from && s.t < s.to && s.t >= 0 && s.t < film)) out.push(`${at}: t ${s.t} is not inside its span and the film`);
    for (const k of ['title', 'film']) if (typeof s[k] !== 'string' || !s[k].trim()) out.push(`${at}: ${k} is empty`);
    if (!Array.isArray(s.layers) || !s.layers.length || s.layers.some((l) => typeof l?.name !== 'string' || typeof l?.file !== 'string' || !l.name || !l.file)) out.push(`${at}: layers must be [{name, file}]`);
    if (!Array.isArray(s.words) || !s.words.length || s.words.some((w) => typeof w?.text !== 'string' || !w.text || typeof w?.when !== 'string' || !/WEST/.test(w.when))) out.push(`${at}: words must be [{when (with WEST), text}]`);
    if (!STATUSES.includes(s.status)) out.push(`${at}: status ${JSON.stringify(s.status)} is not one of ${STATUSES.join(', ')}`);
    if (s.status === 'on his page' && !(s.t <= HOLD_S + 1e-6)) out.push(`${at}: 'on his page' past the wall (${HOLD_S} s): a visitor never reaches ${s.t} s`);
    if (s.status === 'behind the wall' && !(s.t > HOLD_S + 1e-6)) out.push(`${at}: 'behind the wall' before it (${HOLD_S} s)`);
    const prev = scenes[i - 1];
    if (prev && !(s.from >= prev.from)) out.push(`${at}: begins (${s.from}) before ${prev.id} begins (${prev.from})`);
    if (prev && !(s.t > prev.t)) out.push(`${at}: t ${s.t} is not after ${prev.id}'s ${prev.t}`);
  });
  return out;
}
