// hero-mount.js: THE HERO, MOUNTED BY THE PAGE ITSELF. His words, Oct 15 2026 WEST: 01:3x "ON MY PAGE RIGHT NOW THERE IS FUCKING NOTHING ABOUT
// THE SHIT I SPENT SO MUCH FUCKING TIME ON DUDE"; 01:1x "unbelievable you are showing to me a version without all the shit updated... i think
// you hate me"; 00:1x "add all i asked to the version you show me"; and before them "I WANT TO ALWAYS DO QA ON A SINGLE COMULATED VERSION DUDE".
// Everything built for the hero since Oct 14 afternoon was laid into the page's stage from outside, by the lab's wrapper (lab/hero-ab.html,
// app/warm.html in its frame): the page he opens and the page optimism.fit serves had none of it. Now app/warm.html imports this module and
// mounts the hero on its own document, once (mountHero); lab/hero-ab.html is the panel over that same mount and mounts nothing.
//
// mountHero({doc, win, q}) lays on the page's stage, at the page's load and once its sphere (warm.js) and its film (dl-twelve.js) are there,
// what the lab's film view laid, in the same order: the theater's canvas, the box's and the front's after the stage's last canvas, THE FOLD's
// dark after the sphere (the KO edge's opacity goes under it), no card over the hero, the invitation, the song meeting the picture at a tap,
// the satellites (orbit-kick.js, THE HUSH), the theater (BURSTS), the KO edge, Dolbar's raid with its defence, its resistance and its shield,
// the heartbeat, the sacrifice, the golden inversion (BURST_CUT to CENTAUR, INVERSION), and the box (THE UNBOXING, THE FOLD AS ONE WINDOW) in
// the page's idle time; his tags are read once from the Nest (mint/seiya-tags at :8904 on his house's hosts, never on a public one; when it is not there, his conversion tag as at rev 1).
// It returns the page's handle (frozen; window.hero on the page): the mounted objects (theater, unbox, kick, inversion, koEdge), the box's last
// draws (boxLog), mounts (1 once laid; a second call on the same document returns the same handle and lays nothing), the lab's views (view(m),
// hold), his tags (used, rev, tags), moments(), burstAt(t), words (his words and the moments, for the panel), listen(fn) (the panel's ears:
// 'show' m t, 'tags', 'assets' state, 'box' stats) and state().
//
// THE SWITCHES are the lab's: read off the frame's parent when it is a page of the lab on the same site (as app/dl-paywall.js reviewOf reads
// ?paywall=off there), so lab/hero-ab.html keeps ?v=film|a|b|c, ?m=, ?cloth=, ?seiya=, ?empty=, ?end= (&burn=, &darts=), ?mask=, ?knights=,
// ?hear=, ?fold=, ?inversion=, ?her= and ?nest=. The page opened by anyone takes none: the film view, the box's first models, her 3D figure on.
//
// THE VIEWS (the panel's): A, C and B (any m between them: theater.js takes the sphere's own pose, picture and edges and runs m from 0 to 2, the
// sphere's canvas fading over the glass it hands over). "The film" is the default and the page's only view: A, the page's own sphere, with the
// bursts and the unboxing; the road from A through C to B at his conversion tag (c51dbd1a) left the film's flow when the unboxing came. His
// words, Oct 14 2026 12:2x WEST: "show to me what it would look like replaced in the hero... for now we got versionA which is currently there
// centered whitebackground"; then, 12:4x, over C: "think about interpolating these views/modalities... can you keep versionA until the
// conversion moment where we ask money?".
//
// ATHENA (athena-shot.mjs, from the braindance record; his words of Oct 14 14:2x to 14:5x WEST are in its header): in the film's shots over her
// shoulder (28 to 32 s, 36.6 to 38 s with the record's column of light and its flood, 71 to 74 s) the page's eye stands where the film's camera
// stands and the game's Athena stands where the record puts her, moved inside her sigma by the least it takes to be where the film has her
// (the panel says how far). She comes and goes on the film's own cuts, with THE CUTS' device (lab/CUTS.md): the normals, a gold matte, then
// her picture; the same device at each burst and at his conversion tag. His later Oct 15 correction is anime until the mint freeze, then native 3D.
//
// THE UNBOXING (unboxing.js, its header holds his words and the law; unboxing-plan.mjs the choreography). It opens slowly from the gold star to
// the gold centaur (50.05 s; his "also this shit opens up too soon dude", 15:4x, and his pick), and at the film's first cut to the other knights
// (53.053 s) each of its twelve faces becomes one of the twelve worlds on the sphere's Lissajous loop, the film still on it, coming back as the
// box closes on the armor (his "i mean each pentagon face becomes one of them indepently"). His words, Oct 14 2026 15:0x WEST:
// "the box should open up the first time that the golden dagysttraisu appears in the sky" (his pick: 42.34 s, SKY below, the cut to Athena's
// mountain with the gold star already in the sky) and "the gold centaurus and the moment whrn saint seya gets the armor onto itself is where
// you close the thing". So the page's dodecahedron opens like a box and a lotus at the gold star, its petals keeping the film, and the gold
// cloth of Sagittarius stands inside; at his conversion tag on the line of time (the Nest ref mint/seiya-tags, read once at load: the tag
// whose words name the conversion, 61.767 s at rev 1) Seiya rises up into it, the cloth flies onto him, he rises out of it as it shuts on the
// armor (69.7 s), the wings spread over it (70.0 s) and he goes up into the light; the sphere is handed back at 72.3 s. The panel says which
// moments it uses and whose; nothing else is wired from his tags. While the box is out the page's own dodecahedron is hushed and what the
// page draws in front of it goes over the box (orbit-kick.js THE HUSH). The second burst belongs only to Seiya's shots,
// from frame 1141 to the cut back to the wide cliff at frame 1269. Athena's preceding shots stay unobstructed.
//
// THE SLOW-MO, taken out (his words, 13:0x WEST, over A paused at 12.7 s on "Ikki!": "that exact moment where he intercepts the hit needs to
// be slowed down like fucking slow-mo dude"; then, 13:4x, having heard it: "it is awful dude. you cant slow down the audio it morphs like
// shit... but the animation is epic.. cant you just keep the animation ongoing for longer? natural speed... longer duration of the
// animation more fluid..."). The film and its song keep their own speed; the slow motion is the burst's own (theater.js THE BURST), which
// goes off at the cut and unfolds over its `burst` seconds.
//
// THE BURSTS (his words, 13:1x WEST: "can you cast planes that explode out of the dodecahedron in these moments? there is only 2 ones...
// this one and then the golden aiolos athena light-plane... it is delightful if you make shit explode out of it like rays that "mask in"
// aka make visible shit from the background video... consider white background means no mask is making background visible", and over the
// cut to the hit: "these fucking transition points my dude make the dodecahedron go wild light explosions themed geometrical
// hypercomputing"). At the film's transition point in each of his two moments (BURSTS) the theater takes the sphere's place for a burst
// (theater.js THE BURST): the glass blows apart, rays, shock shells and its cast faces fly out, each one a window onto the film behind the
// white page; then it closes and hands the sphere back. The theater's canvas lies over the sphere's for this, its glass the sphere's own.
//
// THE INVERSION OF THE MASK at the golden flash (irradiance.js, its header holds his words; his 22:06 WEST, over the golden starburst on every
// face and the gold cloth inside the glass: "use this fucking flash to cause an inversion of the mask until this point... meaning: stop showing
// what is inside of the dodecahedron glass (start filling it with the liquor we have from benches)..."; 23:38 WEST, over it: "i already said what
// should happen here. you lost that?"). At the film's cut to the white-gold burst of rays (BURST_CUT, 45.445 s, frame 1362) the box's faces stop
// showing the film (its empty frames from the flash, the gold leading with nothing in it, THE CUTS' device on them first) and the glass fills
// with the benches' liquor from its floor; outside it the film is let in where the light from inside has reached, the front expanding at the
// pace of the film's own morpho-field (golden-field.js, measured between the film's cuts at frames 1362 and 1500). It holds until the cut to
// the gold centaur in flames (CENTAUR, 50.050 s), where the empty frames go on as before. Its layer lies under the box, so the box's frames, the
// cloth standing in the liquor and whatever the box draws stay over it, and the twelve on their loop over them. Never at the red burst (11.044 s,
// his 23:05 WEST "who the fuck approved replacing what we had before here?"). ?inversion=off leaves the flash as it was.
//
// THE SATELLITES (his words, 13:4x WEST: "consider i would also love if the lyssajusian unit1s satellite trajectories reacted to changed
// there my dude"): at each burst the twelve worlds on the sphere's Lissajous loop are thrown out by the blast, swing back in past their loop
// and settle on it, and their trails keep the swerve until it leaves the tail (orbit-kick.js).
//
// THE WORLDS HEAR THE FILM (his words, 18:32 WEST: "one thing i really dont like is that the orbiting satellites are not reacting to the
// music my dude... to what is being said... to the growing amounts of energy... you get what i mean or not??"; 18:34: "turn them into
// lyssajusianz trajectories that react to the thing"): the same twelve hear the film's score (satellites-score.js, measured once off its
// soundtrack): the rising energy widens their loop and swirls the swarm round the sphere, each line of the subtitles kicks them out and
// holds them wider while it stands, the bass's pulses breathe the loop and the beats flare the worlds (orbit-kick.js THE WORLDS HEAR THE
// FILM). ?hear=off: the kick alone, as before.
//
// THE FOLD (his words, relayed by mint-fork: 18:47 WEST "AS SOON AS ATHENA FUCKING APPEARS SHE BREACHES THE FABRIC OF SPACETIME", 19:0x
// "UNTIL THE FUCKING WALL OF LIGHT, THE DODECAHEDRON DISAPPEARS, IT IS FOLDED UNTO 1 SINGLE PLANE WHICH IS THE FUCKING PLANE FROM WHICH ATHENA IS
// ALIGNED TO", 19:1x "turn the entire background black there... we saw her fold the dodechadron lik a fukin origami", and his final word,
// 19:19 "interpolate the dodecahedron chosen destination plane for all faces to be folded in that plain hexagomnally... its come and go from
// plane to back again into sphere when wall of lights hits again"; unboxing-plan.mjs foldBeat, cubism.mjs oneCells, ONE and THE ONE PLANE):
// at her cut (29.563 s) the box takes the sphere's place and every face turns and slides onto the face she is aligned to, its corners on hers,
// the nearest first (down by 30.2 s: one pentagon, a window onto the one picture in her plane); that pentagon dissolves into her window, which
// sweeps out from her hair's join past it (30.2 to 30.5 s); then no dodecahedron at all, only her window with the film's drawing in it, in a
// page black edge to edge; at her wall of light (37.132 s) the faces come back out of her plane into the sphere, whole at 38.071 s. His words
// over the hexagonal lattice that stood there before, Oct 15 2026 00:44 WEST: "this grid dude is all absolutely fucked up. you gotta do
// differently. when does it stop being a dodecahedron mask??". ?fold=off leaves her span as before. Her disc portal (cubism-window.js) is
// retired from the page.
//
// NO CARD OVER THE HERO (his words, 13:5x WEST, over the card a tap on a chair opens, "GENESIS VISUALIZATION / One of twelve chairs": "please
// remove shit like this that breakes the immmersion a lot dude"). A tap on the sphere is also how the sound comes on, and warm.js answers a tap
// on a chair with that card (#face-note); with the hero mounted the card is never shown.
//
// THE INVITATION (his words, 13:5x WEST: "also, can you add a float-up bubbly "play with audio on" in the style of dyson society that
// triggers people to play with audio for best immersion???"): while the sound is off, a bubble floats up under the sphere once the hero is
// there, in the page's own Bodoni and gold, a few small bubbles rising off it as it comes; a tap on it is the page's own sound button
// (dl-twelve.js: the song joins the picture at its current second), and once the sound is on, however it came on, it pops and is gone.
// It floats up once and then holds still: nothing at rest costs anything.
//
// THE SOUND COMES IN WHERE THE PICTURE IS (his words, 13:5x WEST, after tapping it: "dude it is fucked up, it is restarting the video when i
// click on it. i dont want it restart, just fucking play the sound do not restart the fucking video"; the rule in full: ~/AGENTS.md and the
// house CLAUDE.md, The rule, item 8). dl-twelve.js toggleSound puts the song at the film's second and keepTime joins the song to the picture
// once it is ready (`joining`); the picture is never sought by a tap. This module sets no picture's time: at a tap on the stage, before
// dl-twelve.js's own, a paused song is put at the picture's second (meet), and the bubble presses the page's button and nothing more.
//
// NOTHING AT REST: no frame loop and no timer of its own; each layer draws on a cause (a presented frame, a seek, a resize) and lets its frame
// callback go at the pause. lab/one-page.proof.mjs counts it on the served page.
import {SPHERE_X} from '../app/sphere-centre.mjs'; import {asksNest} from '../app/dl-twelve-clock.js?v=skip-waits-1';
import {createTheater} from './theater.js';
import {CLEAR as CLEAR_GLASS, readLook} from './glass-look.mjs';
import {createOrbitKick} from './orbit-kick.js';
import {mountAntiSatellites} from './anti-satellites.js';
import {mountHeartbeat} from './heartbeat.js';
import {mountSacrifice} from './sacrifice.js';
import {SEIYA_MOMENTS} from '../app/warm-sphere.js?v=mint-3';
import {mountRite} from './rite-unit1s.js?v=mint-2';
import {CLOSE, SHUT} from './unboxing-plan.mjs';
import {mountKoEdge} from './ko-edge.js';
import {FOLD, PORTAL, SHOTS, HEX, ONE} from './cubism.mjs';
import {mountIrradiance} from './irradiance.js';
import {mountMintLiquor} from '../app/dl-mint-liquor.mjs';
import {mountMintChairs} from '../app/dl-mint-chairs.mjs';
import {FIELD_GOLDEN} from './golden-field.js';
import {SKY_FLIGHT_START, SKY_FLASH} from './sagittarius-flight.mjs';
import {SEIYA_FLIGHT_START, SEIYA_FLIGHT_END} from './seiya-flight.mjs';
import {mountDepth} from '../app/dl-depth.js?v=depth-orbit-1';


// if the Nest cannot be read: his conversion tag as it stood at rev 1 (made 11:57 WEST)
const AT_REV_1 = [{id: 'mv7zwh1ifk', t: 61.767, text: 'THIS MOMENT IS FUCKING KEY IT IS THE FUCKING CONVERSION MOMENT, THE USER HAS SEEN I'}];
// THE BOX OPENS where he said, the first time the golden Sagittarius appears in the sky: the first frame of the cut to Athena's mountain, the
// gold star already in the stormy sky (saint-seiya.mp4 ?v=53561d47, frame 1269 at 29.97 fps, 42.342 s; his pick, Oct 14 2026 15:0x WEST)
const SKY = {t: 42.342, text: 'the box should open up the first time that the golden dagysttraisu appears in the sky'};
// IT OPENS SLOWLY until the cut from the white flood to the gold centaur in flames (frame 1500, 50.050 s; his "also this shit opens up too
// soon dude" over the box fully open at 47.2 s, then his pick, Oct 14 2026 15:5x WEST: "Star to centaur, slowly")
const CENTAUR = {t: 50.05, text: 'also this shit opens up too soon dude'};
// THE FACES BECOME THE WORLDS at the film's first cut to the other knights (frame 1590, 53.053 s: from the centaur to two knights looking up
// into the light; his words 15:4x WEST, and 15:5x: "i mean each pentagon face becomes one of them indepently")
const KNIGHTS = {t: 53.053, text: 'when it starts inquadrating other knights... the pentagons faces here start being anchored to the lyssajudrean satellites orbiring'};
const ARMOR = 'the gold centaurus and the moment whrn saint seya gets the armor onto itself is where you close the thing dude... omg';
// THE EMPTY FRAMES from the cut to the gold centaur (50.050 s: his "here", said over the hero at 51.2 s, Oct 14 2026 17:0x WEST, the 3D cloth
// standing in the open box while every face showed the film's centaur in flames) until the box is shut on the armor (mint-fork's reading; how
// long they stay empty is his to see: ?empty=knights ends them at the knights' cut, 53.053 s; ?empty=burst begins them at the cut to the
// white-gold burst, 45.445 s, after his 16:4x "THE LIGHT IS COMING FROM THE ARMOR ITSELF"; ?empty=off, never). THE INVERSION (below) empties
// them through its own window, 45.445 to 50.050 s, whatever ?empty says: there the glass stops showing the film (?inversion=off: as before)
const EMPTY = {t: CENTAUR.t, text: 'do you understand or not that here you gotta start showing the empty frames because the pentagons are showing the golden sagyttarius shit dude?'};
const BURST_CUT = 45.445;
// THE INVERSION OF THE MASK (irradiance.js; his 22:06 WEST, the golden starburst on every face and the gold cloth in the glass): from the cut to
// the white-gold burst (frame 1362) to the cut to the gold centaur in flames (frame 1500, CENTAUR); the glass the box's, standing open DROP
// (0.42, unboxing.js) box radii below the sphere's centre, where the light starts from. ?inversion=off: not mounted
const INVERSION = {at: BURST_CUT, until: CENTAUR.t, rest: [0, -0.42], text: 'use this fucking flash to cause an inversion of the mask until this point... meaning: stop showing what is inside of the dodecahedron glass (start filling it with the liquor we have from benches)'};
// THE KNIGHTS IN THE FRAMES (his words, Oct 14 2026 17:32 WEST, over the hero at 60.9 s, the empty frames riding the worlds): one frame lights
// as each knight appears, his segment live in it while it plays, its last picture kept after (the film's own cuts, cuts.js FILM_CUTS):
// Ikki and Shun look up (53.053 s), Shiryu by the water (55.055 s), Hyoga on the ground (57.057 s), until the centaur again (59.059 s)
const SEGMENTS = [{t0: 53.053, t1: 55.055, who: 'Ikki and Shun'}, {t0: 55.055, t1: 57.057, who: 'Shiryu'}, {t0: 57.057, t1: 59.059, who: 'Hyoga'}];
const KNIGHTS_WORDS = 'dude wtf? each of these frames need to be filled with one of the individual segment the knights had... like idk light up one frame at a time sequentially based on when knights appear on the screen...';
// THE MASK through the transformation, his conversion tag to the shut on the armor (his words, 17:39 WEST, over the hero at 58.4 s): the faces
// are windows onto the film behind the white page, as in C. ?mask=off leaves the empty frames; ?knights=stay keeps the knights' pictures in
// their frames while the mask is open (open for him)
const MASK_WORDS = 'can you do here theather mode?? like... during the transformation i would like to shee the mask mode please dude...';
// THE END OF IT (his words, Oct 14 2026 17:0x WEST, over the hero at 92.0 s: "do you understand how at the end of it the dodecahedron needs to be
// dissolved and new dodecahedron needs to form later? you know what this is?? this moment right here"; over 102.3 and 107.4 s: "they are when
// pegasus starts to burn the cosmos and when he starts throwin darts of agents"). BUILT, NOT WIRED: the moments are his, asked by mint-fork on
// his canvas (A: it dissolves at the cut to the knights, 86.753 s, and the new one is whole as Seiya stands alone in gold, 93.260 s; B: it
// dissolves at 93.260 s and the new one forms as he burns his cosmos; the burn 100.767 or 101.335 s, the darts 104.771 or 106.773 s). Only
// ?end=a|b (with &burn= and &darts=) shows it; the page's sphere is handed back at the cut to the gold debris (108.275 s)
const KNIGHTS_CUTS = {ikkiShun: 86.753, hyoga: 88.755, shiryu: 90.757, alone: 93.260, debris: 108.275};
const STOPS = {a: 0, c: 1, b: 2};
// Oct 16, 03:23 WEST: "the dodecahedron exploding not on athena scene but on saint seya".
// Frame 1141 cuts from Athena to Seiya; frame 1269 returns to the cliff. Complete
// the second burst within those shots, including his pointed frame 1203 (40.157s).
// The first sacrifice burst remains unchanged.
// THE TWELVE (his Oct 17 04:3x WEST, "make it so that the 2nd time the dodecahedron explodes, this one is for good"): the second burst is final,
// its plates never close and its twelve faces fly on alone (theater.js, sagittarius-flight.mjs).
const BURSTS = [{t: 11.044, power: 1}, {t: 1141 * 1001 / 30000, until: 1269 * 1001 / 30000, power: 1, final: true}];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ss = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
// THE FOLD AS ONE WINDOW (unboxing-plan.mjs foldBeat; his words 18:47 to 19:19 WEST and Oct 15 00:44 WEST, above): from her cut the faces fold
// onto her one face (down by 30.2 s), that pentagon dissolves into her window (to 30.5 s, ONE.gone), her window alone to the wall of light, and
// back into the sphere from there, in a page gone black; ?fold=off leaves her span as it was
const HER_END = SHOTS.at(-1).frames[1] * 1001 / 30000;   // 38.071 s: her last cut, to the cloth on him; the page's sphere back
// THE LOAD (his words, Oct 14 2026 16:1x WEST: "why the fuck it got a hiccup when loading the page my dude??"; measured by unboxing.proof.mjs
// --load: two tasks of 114 and 69 ms in the page's first second, both the box's setup). The box (three.js, its models) is made LOAD_AFTER_MS
// after the stage is up, in the page's idle time and in steps that yield (unboxing.js), long before its first moment (Athena at 29.6 s); only a
// film sought into a second that needs it sooner starts it at once.
const LOAD_AFTER_MS = 2500, NEEDED_FROM = 25;   // seconds of the film from which the box must be there

// THE INVITATION (see the header): the bubble, in the page's own type (--serif, Bodoni 72) and gold, and the small bubbles off it
// ([left %, size px, drift px, seconds, delay s])
const RISE = [[16, 5, -8, 2.2, 1.6], [30, 8, 6, 2.6, 1.9], [47, 4, -4, 1.9, 2.3], [63, 7, 10, 2.4, 1.7], [78, 5, -12, 2.1, 2.1], [88, 4, 5, 2.0, 2.5]];
const INVITE_CSS = `
.ds-invite{position:absolute;left:${SPHERE_X * 100}%;bottom:max(8%,64px);z-index:4;display:flex;align-items:center;gap:12px;padding:12px 22px 12px 17px;
  border-radius:999px;border:1px solid rgb(196 163 101 / .6);color:#272b23;font:400 18px/1 var(--serif);letter-spacing:-.01em;white-space:nowrap;cursor:pointer;
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  box-shadow:0 12px 34px rgb(74 58 24 / .13),inset 0 1px 0 #fff,inset 0 -7px 16px rgb(196 163 101 / .12);
  transform:translateX(-50%);animation:ds-invite-up 1.4s cubic-bezier(.2,1.3,.35,1) 1.2s both}
#sphere-stage .ds-invite{background:radial-gradient(130% 160% at 28% 0%,#fffefb 0%,rgb(255 254 251 / .92) 46%,rgb(241 233 212 / .9) 100%)}
.ds-invite em{font-style:italic;color:#a58343}
.ds-invite:hover{border-color:#a88643}
.ds-invite:focus-visible{outline:2px solid #b4944d;outline-offset:4px}
.ds-invite .wave{display:flex;align-items:flex-end;gap:2.5px;height:14px}
.ds-invite .wave i{width:2px;border-radius:1px;background:#a88643}
.ds-invite .wave i:nth-child(1){height:6px}.ds-invite .wave i:nth-child(2){height:14px}.ds-invite .wave i:nth-child(3){height:9px}.ds-invite .wave i:nth-child(4){height:4px}
.ds-invite b{position:absolute;left:var(--l);bottom:55%;width:var(--s);height:var(--s);border-radius:50%;pointer-events:none;opacity:0;
  border:1px solid rgb(196 163 101 / .55);background:radial-gradient(circle at 34% 30%,#fff 0 30%,rgb(255 254 251 / .15) 70%);
  animation:ds-bubble var(--d) cubic-bezier(.25,.6,.4,1) var(--w) both}
@keyframes ds-invite-up{0%{opacity:0;transform:translate(-50%,34px) scale(.86)}60%{opacity:1}100%{opacity:1;transform:translate(-50%,0) scale(1)}}
@keyframes ds-bubble{0%{opacity:0;transform:translate(0,0) scale(.5)}20%{opacity:.95}100%{opacity:0;transform:translate(var(--x),-86px) scale(1.1)}}
.ds-invite.pop{animation:ds-invite-pop .45s cubic-bezier(.3,0,.5,1) both;pointer-events:none}
@keyframes ds-invite-pop{0%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-18px) scale(1.14)}}
@media (prefers-reduced-motion:reduce){.ds-invite,.ds-invite b,.ds-invite.pop{animation-duration:1ms!important;animation-delay:0s!important}}
@media (pointer:coarse){.ds-invite{padding:15px 24px 15px 19px;font-size:19px}}`;
function invite(stage) {
  // The approved invitation belongs to the mint hero, including the Snowtrace page.
  const doc = stage.ownerDocument, sound = stage.querySelector('[data-twelve-sound]');
  if (!sound || sound.getAttribute('aria-pressed') === 'true') return;
  const css = doc.createElement('style'); css.textContent = INVITE_CSS; doc.head.append(css);
  const bubble = doc.createElement('button');
  bubble.type = 'button'; bubble.className = 'ds-invite'; bubble.setAttribute('aria-label', 'Play with audio on: start the Saint Seiya soundtrack');
  bubble.innerHTML = '<span class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>Play with <em>audio</em> on</span>' +
    RISE.map(([l, size, x, d, w]) => `<b aria-hidden="true" style="--l:${l}%;--s:${size}px;--x:${x}px;--d:${d}s;--w:${w}s"></b>`).join('');
  stage.append(bubble);
  const ended = (event) => { if (event.target === bubble && event.animationName === 'ds-invite-pop') bubble.remove(); };
  const watch = new doc.defaultView.MutationObserver(() => {
    if (sound.getAttribute('aria-pressed') !== 'true') return;
    watch.disconnect(); bubble.addEventListener('animationend', ended); bubble.classList.add('pop');
  });
  watch.observe(sound, {attributes: true, attributeFilter: ['aria-pressed']});
  bubble.addEventListener('click', () => { if (sound.getAttribute('aria-pressed') !== 'true') sound.click(); });
}

// the hero's stage, its sphere's canvas and its film: there once warm.js has made the sphere and dl-twelve.js the film
const heroOf = (doc) => {
  const stage = doc?.getElementById('sphere-stage'), sphere = doc?.getElementById('genesis-sphere'), film = doc?.getElementById('dl-twelve-film');
  return stage && sphere && film ? {stage, sphere, film} : null;
};
// the colour the stage stands on: the first ancestor with a background of its own
const groundOf = (el) => {
  for (const view = el.ownerDocument.defaultView; el; el = el.parentElement) {
    const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(view.getComputedStyle(el).backgroundColor);
    if (m && (m[4] === undefined || Number(m[4]) > 0.5)) return [m[1], m[2], m[3]].map(v => Number(v) / 255);
  }
  return [0.914, 0.898, 0.851];
};

/** The lab's switches: the address of the frame's parent when it is a page of the lab on the same site (lab/hero-ab.html), else none (the page
 *  as everyone meets it). As app/dl-paywall.js reviewOf reads ?paywall=off there. */
export function switchesOf(win) {
  try {
    if (!win || win.parent === win) return new URLSearchParams();
    const at = win.parent.location;   // a parent of another site throws here
    return /\/lab\//.test(at.pathname) ? new URLSearchParams(at.search) : new URLSearchParams();
  } catch { return new URLSearchParams(); }
}

const MOUNTED = Symbol.for('dyson-society.hero');   // the document's own handle: one mount a document

/** Mounts the hero on the page's own document, once; returns its handle (also window.hero). See the header. */
export function mountHero({doc = globalThis.document, win = doc?.defaultView ?? globalThis.window, q = switchesOf(win)} = {}) {
  if (doc[MOUNTED]) return doc[MOUNTED];
  // His Oct 15 sequence: anime until the mint freeze, then native 3D. The off switch is diagnostic.
  const freezeSpace = q.get('freeze') !== 'off' && new URLSearchParams(win.location.search).get('freeze') !== 'off';
  const NEST = (q.get('nest') || `${win.location.protocol}//${win.location.hostname}:8904`).replace(/\/$/, '');
  const inverted = () => q.get('inversion') !== 'off';
  const endOf = () => {
    const v = q.get('end'); if (v !== 'a' && v !== 'b') return null;
    const burn = Number(q.get('burn')) || 100.767, darts = Number(q.get('darts')) || 104.771, K = KNIGHTS_CUTS;
    return v === 'a' ? {reading: 'A', dissolve: K.ikkiShun, whole: K.alone, burn, darts, back: K.debris, streams: [K.ikkiShun, K.ikkiShun + 0.4, K.hyoga, K.shiryu]}
      : {reading: 'B', dissolve: K.alone, whole: burn, burn, darts, back: K.debris, streams: [K.alone + 0.6, K.alone + 1.2, K.alone + 1.8, K.alone + 2.4]};
  };
  const emptyWindow = () => {
    const v = q.get('empty'), his = v === 'off' ? null : v === 'knights' ? [EMPTY.t, KNIGHTS.t] : v === 'burst' ? [BURST_CUT, Infinity] : [EMPTY.t, Infinity];
    if (!inverted()) return his;
    // THE INVERSION empties the faces from its flash (the glass stops showing the film, his 22:06 WEST); his empty frames go on after it as he set them
    return his ? [Math.min(his[0], INVERSION.at), Math.max(his[1], INVERSION.until)] : [INVERSION.at, INVERSION.until];
  };

  let hold = q.has('m') ? clamp(Number(q.get('m')) || 0, 0, 2) : STOPS[q.get('v')] ?? null;   // null: the film
  let tags = [], rev = null, used = null;   // his tags, the ref's rev, the one the unboxing uses ({conversion})
  let hero = null, theater = null, canvas = null, kick = null, unbox = null, shownA = 1, stillA = false, last = null, boxLast = null;   // last: the theater's last draw, boxLast: the box's
  let darken = null, koEdge = null;   // THE FOLD's dark over the hero alone, and the KO edge it covers (set once the stage is found)
  let inversion = null, boxGroup = null;   // THE INVERSION's layer (irradiance.js), and the box's group its glass is read off
  let mounts = 0;
  const ears = new Set();   // the panel's (lab/hero-ab.html listen): what it shows of the mount; none on the page itself
  const tell = (...said) => { for (const fn of ears) { try { fn(...said); } catch (error) { console.warn('hero-mount: a listener failed', error); } } };
  // the box's glass for the inversion: its group's world matrix (its turn and its place), read off its scene at each draw while it is out; none
  // while the page's own sphere is drawn (a held view, or before the box is made)
  const glassOfBox = () => {
    if (!unbox?.out) return null;
    if (!boxGroup) unbox.scene?.traverse((o) => { if (!boxGroup && o.isMesh && o.material?.uniforms?.uMode) boxGroup = o.parent; });
    return boxGroup ? {matrix: boxGroup.matrixWorld.elements} : null;
  };

  // The film's view is A (with the bursts and the box); A, C and B as held by the panel.
  const mAt = (t) => hold ?? 0;
  const foldOf = () => q.get('fold') === 'off' ? null : {start: FOLD.start, flat: FOLD.flat, gone: ONE.gone, aiolos: PORTAL.aiolos, closed: PORTAL.closed, whole: HEX.whole, back: HER_END};
  // THE UNBOXING's moments: the gold star in the sky (his word), his conversion tag, and the page's end card (where it closes only if his
  // conversion tag does not fall while it is open; otherwise it shuts on the armor, his word, unboxing-plan.mjs CLOSE and SHUT)
  const momentsOf = ({conversion}) => ({open: SKY.t, centaur: CENTAUR.t, knights: KNIGHTS.t, rise: conversion?.t ?? NaN, back: SEIYA_MOMENTS.credits, empty: emptyWindow(), end: endOf(), segments: SEGMENTS, mask: q.get('mask') !== 'off', knightsStay: q.get('knights') === 'stay', fold: foldOf()});
  // the burst going on at second t ({age, power}), and whether one is near enough for the theater to be awake for it
  const burstEnd = b => b.until ?? b.t + (theater?.burst ?? 0);
  const burstAt = (t) => {
    const b = BURSTS.find(b => t >= b.t && t < burstEnd(b));
    return b ? {age: (t-b.t) * (b.until ? theater.burst/(b.until-b.t) : 1), power: b.power, final: b.final === true} : null;
  };
  // Do not reveal even an intact seed during the Athena shot as an early wakeup.
  const burstNear = (t) => BURSTS.some(b => t >= b.t - (b.until ? 0 : .4) && t < burstEnd(b));
  const seiyaBurst = (t) => freezeSpace && t >= BURSTS[1].t && t < burstEnd(BURSTS[1]);
  // THE TWELVE end at the cut to the burst (his Oct 18 2026 00:5x WEST, over a pause on the burst: "why the fuck when i pause on any fucking frame,
  // regardless of the previous frame i see this shit?"): from frame 1362 no glass and no hole on the burst, playing or paused; the anime alone
  const skyFlight = t => freezeSpace && hold === null && t >= SKY_FLIGHT_START && t < SKY_FLASH;
  // THE TWELVE's anchor (sagittarius-flight.mjs, his Oct 17 20:3x "aligned with the DCTs of the anime" beside his 04:3x "OFFCENTERED"): the anime's light,
  // or with the lab's ?twelve=centre the picture's middle; the road hands it to the theater while the twelve fly
  const TWELVE = Object.freeze({anchor: q.get('twelve') === 'centre' ? 'centre' : 'light'});
  // THE TWELVE ON SEIYA (seiya-flight.mjs, his Oct 21 2026 WEST words in its header: "as soon as athena is the scene maker... i want the faces to
  // asseble around saint seya there", then "why are you not using the same exact formula used before?... we go back to the dodecahedron in the next
  // scene after athena"): THE TWELVE's own law from the cut to Athena's shot, the column of gold on him (frame 2172): in down the column, round him,
  // his glory, closed into one glass on him a beat before the cut to Dolbar (2247); Dolbar's shot is the anime alone ("i dont want to see dolbar in
  // the dodecahedron": the fullscreen anime to mint-cinematic-score.mjs SAGITTARIUS_END) and the page's dodecahedron comes back at the rite (2307).
  // The theater wakes before the cut, as before a burst, so the twelve fly from its first frame
  const seiyaFlight = t => freezeSpace && hold === null && t >= SEIYA_FLIGHT_START && t < SEIYA_FLIGHT_END;
  const seiyaNear = t => freezeSpace && hold === null && t >= SEIYA_FLIGHT_START - .4 && t < SEIYA_FLIGHT_END;
  const SEIYA_TWELVE = Object.freeze({anchor: 'light', law: 'seiya'});
  const stackBurst = (t) => {
    const on = (seiyaBurst(t) || skyFlight(t) || seiyaFlight(t)) && !unbox?.freeze?.active;
    canvas.style.zIndex = on ? '1' : '';
    canvas.dataset.sourceBurst = on && seiyaBurst(t) ? 'seiya' : '';
    canvas.dataset.skyFlight = on && skyFlight(t) ? 'true' : '';
    canvas.dataset.seiyaFlight = on && seiyaFlight(t) ? 'true' : '';
  };

  // where the page's sphere is and how it is turned, in the theater's canvas (canvas heights, centred, y up): warm-sphere.js draw() puts its
  // centre 55 % across and halfway down, its radius `radius` of the shorter side
  const poseOfA = () => {
    const s = win.genesisSphere?.getViewState?.(), box = canvas.getBoundingClientRect(), view = hero.sphere.getBoundingClientRect();
    if (!s || !box.width || !box.height) return null;
    const x = view.left + view.width * SPHERE_X, y = view.top + view.height * 0.5;
    return {c: [((x - box.left) / box.width - 0.5) * box.width / box.height, 0.5 - (y - box.top) / box.height],
      r: Math.min(view.width, view.height) * s.radius / box.height, yaw: s.yaw, pitch: s.pitch};
  };
  // The sphere's canvas fades out over the glass it hands over when the panel holds C or B, and holds still there so the glass takes a pose
  // that stays put. In the film it keeps turning (the box keeps its turn). The page's own pause (#motion) is left as he set it.
  const showA = (m, t) => {
    const shown = 1 - ss(0.03, 0.3, Math.min(m, 1));
    if (shown !== shownA) { shownA = shown; hero.sphere.style.opacity = shown >= 1 ? '' : shown.toFixed(3); }
    const still = hold !== null && hold >= 1;
    if (still !== stillA) {
      stillA = still;
      const motion = doc.getElementById('motion');
      win.genesisSphere?.setPaused?.(still || motion?.getAttribute('aria-pressed') === 'true');
    }
  };
  // what the panel shows of the road (lab/hero-ab.html); nothing listens on the page itself
  const show = (m, t) => { if (ears.size) tell('show', m, t); };
  // each draw of the theater asks the road where it is; while the box is out the burst goes off with no glass of the theater's own
  const road = (t) => {
    const m = mAt(t);
    stackBurst(t);
    showA(m, t); show(m, t); kick?.at(t);
    if (m <= 0 && !burstNear(t) && !skyFlight(t) && !seiyaNear(t)) queueMicrotask(sync);
    return {m, a: poseOfA(), burst: burstAt(t), flight: skyFlight(t) ? TWELVE : seiyaFlight(t) && SEIYA_TWELVE, keepGlass:seiyaBurst(t),
      glass: seiyaBurst(t) || skyFlight(t) || seiyaFlight(t) || !(hold === null && unbox?.wants(t))};
  };
  // the theater wakes when the view leaves A or a burst is near, and sleeps when neither is; near the box's moments the page's skin asks the
  // box whether to draw (orbit-kick.js THE HUSH), and the page is asked for a frame when the box must come out or go back
  function sync() {
    if (!theater) return;
    const t = hero.film.currentTime, m = mAt(t);
    stackBurst(t);
    showA(m, t); kick?.at(t);
    if (!unbox && t >= NEEDED_FROM) startBox();
    if (unbox) {
      unbox.setEnabled(hold === null);
      kick?.hush(unbox.near(t) || unbox.out ? unbox.skin : null);
      unbox.sync(t);
    }
    if (!unbox?.freeze?.active && (m > 0 || burstNear(t) || skyFlight(t) || seiyaNear(t))) { canvas.hidden = false; theater.setActive(true); }
    else { theater.setActive(false); canvas.hidden = true; }
    show(m, t);
  }

  async function readTags() {
    if (!q.get('nest') && !asksNest(win.location.hostname)) { tags = AT_REV_1; rev = null; } else try {   /* THE PUBLIC PAGE ASKS NO HOUSE PORT (the live walk of Nov 12 2026 08:37 UTC: optimism.fit:8904 asked, 5 s to its timeout, on every visit): his Nest is his house's door, read on his house's hosts or a ?nest= he names; optimism.fit takes rev 1's words at once */
      const r = await fetch(`${NEST}/nest/ref/mint/seiya-tags`, {cache: 'no-store', signal: AbortSignal.timeout(5000)});
      const body = await r.json();
      if (!r.ok || !Array.isArray(body?.ref?.value?.tags)) throw new Error(`the Nest answered ${r.status}`);
      tags = body.ref.value.tags.filter(tag => Number.isFinite(tag.t)).sort((a, b) => a.t - b.t); rev = body.ref.rev ?? null;
    } catch (error) { console.warn(`hero-mount: his tags were not read from ${NEST}`, error); tags = AT_REV_1; rev = null; }
    used = {conversion: tags.find(tag => /conversion/i.test(tag.text ?? '')) ?? null};
    tell('tags'); sync();
  }
  const boxLog = [];   // the box's last draws, for a reader (unboxing.proof.mjs)
  const showBox = (s) => {
    boxLast = s; boxLog.push(s); if (boxLog.length > 6000) boxLog.splice(0, 1000);
    if (s.reason !== 'film' && s.reason !== 'screen') inversion?.redraw();   // the box drew on a cause (a seek, its take-over): the inversion's glass with it
    tell('box', s);
  };
  const tagsRead = readTags();
  // THE GLASS'S LOOK (glass-look.mjs, his Oct 17 2026 20:4x to 21:1x WEST: transparent always, his to set from the Canvas): read once at the load, the
  // lab's ?glass= first, then the page's, then the Nest's mint/glass on his house's doors; the theater takes it when it is made or when the read lands
  let glassLook = CLEAR_GLASS;
  readLook({search: q.has('glass') ? `glass=${q.get('glass')}` : win.location.search, hostname: win.location.hostname, protocol: win.location.protocol,
    webdriver: Boolean(win.navigator?.webdriver), fetch: win.fetch?.bind(win), nest: q.get('nest') || null})
    .then((look) => { glassLook = look; theater?.setLook(look); });

  // the box: made in the page's idle time once its first frames are out (THE LOAD, above), never in its load
  const later = (ms) => new Promise(r => win.setTimeout(r, ms));
  const idle = () => new Promise(r => (win.requestIdleCallback ? win.requestIdleCallback(() => r(), {timeout: 1500}) : win.setTimeout(r, 1)));
  let makeBox = null, boxing = null;
  const startBox = () => { if (!boxing && makeBox) boxing = makeBox(); return boxing; };

  async function ready(found) {
    if (hero) return;
    hero = found; mounts++;
    canvas = doc.createElement('canvas');
    canvas.id = 'hero-theater'; canvas.setAttribute('aria-hidden', 'true'); canvas.hidden = true;
    Object.assign(canvas.style, {position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none'});
    if (win.getComputedStyle(found.stage).position === 'static') found.stage.style.position = 'relative';
    // over the page's sphere: the glass covers the sphere exactly where it takes its place (a burst, C, B), and its rings and stars stay seen
    // around it; over the theater's, the box (unboxing.js), and over the box, what the page draws in front of its sphere while the box is out
    found.sphere.after(canvas);
    const box3d = doc.createElement('canvas'), front = doc.createElement('canvas');
    box3d.id = 'hero-box'; front.id = 'hero-front';
    for (const c of [box3d, front]) { c.setAttribute('aria-hidden', 'true'); Object.assign(c.style, {position: 'absolute', left: '0', top: '0', pointerEvents: 'none'}); }
    Object.assign(front.style, {width: '100%', height: '100%'});
    canvas.after(box3d); box3d.after(front);
    // THE FOLD's dark (his Oct 14 2026 19:1x WEST: "turn the entire background black there... make it fucking immersive"), ON THE HERO ALONE
    // (his Oct 15 2026 02:2x WEST, over his page gone black at her shot: "why the fuck are you making the ENTIRE PAGE BLACK?!??! JUST FOCUS ON
    // THE  HERO SECTION, DONT CAUSE MAYHEM DIOCANE"; then 02:5x WEST, over the wall with the title row black too: "the top bar here must remain
    // white diocane. i said only the hero dude"). It was a fixed layer over the whole window, then the hero section's box with its title row.
    // Its box is now the hero block's alone (#oath-sphere: the rows the sphere, its film and the choice stand in), the section's whole width;
    // the top bar (the title and its line) stays on the page's paper above it, the mint and all below it are never touched. It is in the
    // page's flow, so a scroll carries it with the hero; it is fitted when the black comes in and on a resize while it is in. Right after the
    // page's own sphere, so the sphere goes under it and the theater's burst and the box stay over it; what the page draws in front of its
    // sphere (its near rings and worlds, on `front`) goes as the black comes; shown only while the box says so (unboxing.js onDark), never at rest
    const dark = doc.createElement('div');
    dark.id = 'hero-dark'; dark.setAttribute('aria-hidden', 'true');
    Object.assign(dark.style, {position: 'absolute', left: '0', top: '0', width: '0', height: '0', background: '#000', pointerEvents: 'none', opacity: '0', display: 'none'});
    found.sphere.after(dark);
    // THE FILM IN DEPTH (dl-depth.js; his Oct 18 2026 WEST, 01:55: "trying to provoke some depth effect with the camera where based on head moving aroudn we
    // can cause nintendo 3Ds typa shit", 03:04: "why the hell dont we make it likd nintendo 3Ds my dude?"): the cloth's sequence as layers his head moves,
    // over the box's opaque fullscreen anime pass, under the foreground; hidden whenever nothing would slide
    if (freezeSpace) mountDepth({stage: found.stage, film: found.film, after: box3d, q: new URLSearchParams(win.location.search), win, doc});
    const section = found.stage.closest('.genesis') ?? found.stage, block = found.stage.closest('.oath-sphere') ?? found.stage;
    let darkOn = false;
    const fitDark = () => {
      const s = found.stage.getBoundingClientRect(), g = section.getBoundingClientRect(), b = block.getBoundingClientRect();
      Object.assign(dark.style, {left: `${Math.round(g.left - s.left)}px`, top: `${Math.round(b.top - s.top)}px`, width: `${Math.round(g.width)}px`, height: `${Math.round(Math.max(0, b.height))}px`});
    };
    win.addEventListener('resize', () => { if (darkOn) fitDark(); }, {passive: true});
    // the KO edge's red goes under the black too (it is mounted after the dark layer, so the black alone never covered it)
    darken = (k) => { const on = k > 0; if (on && !darkOn) fitDark(); darkOn = on; dark.style.display = on ? '' : 'none'; dark.style.opacity = on ? k.toFixed(3) : '0'; front.style.opacity = on ? (1 - k).toFixed(3) : ''; if (koEdge) koEdge.element.style.opacity = on ? (1 - k).toFixed(3) : ''; };
    const quiet = doc.createElement('style'); quiet.textContent = '#face-note{display:none!important}'; doc.head.append(quiet);
    invite(found.stage);
    const song = found.stage.querySelector('#dl-twelve-song');
    const meet = () => { if (song?.paused && found.film.readyState >= 1 && !win.dlTwelve?.state?.().cinematic?.active) song.currentTime = found.film.currentTime; };
    for (const type of ['pointerup', 'click']) found.stage.addEventListener(type, meet, true);   // before dl-twelve.js's own
    kick = createOrbitKick({canvas: found.sphere, film: found.film, bursts: BURSTS, front, hear: q.get('hear') !== 'off'});
    theater = await createTheater({canvas, film: found.film, wall: groundOf(found.stage), clear: true, vignette: 0, fit: 0.92, active: false, road, look: glassLook, onDraw: (s) => { last = s; }});
    if (theater.look !== glassLook) theater.setLook(glassLook);   // the read landed while the theater was being made
    koEdge = mountKoEdge({stage: found.stage, film: found.film});   // THE KO EDGE (ko-edge.js, its lane's two lines: LANDING.md), after the stage's last canvas
    mountAntiSatellites({stage: found.stage, film: found.film, worlds: () => kick?.worlds ?? []});   // DOLBAR'S CHARGE, 4.471 to 11.044 s (anti-satellites.js, ANTI-SATELLITES.md; its two lines), after the stage's last canvas
    mountHeartbeat({film: found.film, view: found.stage.ownerDocument.defaultView});   // THE HEARTBEAT on the Lissajous orbits and the sphere's size, the hit (18.018 s) to the beam (36.570 s) (heartbeat.js)
    mountRite({film: found.film, view: found.stage.ownerDocument.defaultView});   // The hands summon the twelve at 76.977 s; their recursive swarms persist after the hand shot.
    mountSacrifice({stage: found.stage, film: found.film});   // THE SACRIFICE, the one who intercepts cut out of the film and standing large for one second, 10.644 to 11.644 s (sacrifice.js, SACRIFICE.md; its two lines), after the raid's canvas
    // THE INVERSION OF THE MASK at the golden flash, 45.445 to 50.050 s (irradiance.js, golden-field.js): its layer right after the theater's, under the box
    if (!freezeSpace && inverted()) inversion = mountIrradiance({stage: found.stage, film: found.film, at: INVERSION.at, until: INVERSION.until, field: FIELD_GOLDEN, after: canvas, edges: false, glass: glassOfBox, rest: INVERSION.rest});
    const mintSupply = freezeSpace ? mountMintLiquor({doc, win}) : null;
    const mintChairs = freezeSpace ? mountMintChairs({doc, win}) : null;   // THE TWELVE DONORS: the Worker's ranking for the glass's chairs
    for (const type of ['timeupdate', 'seeked', 'play', 'pause']) found.film.addEventListener(type, sync);
    sync();
    let foldShown = false;
    makeBox = async () => {
      await tagsRead;
      const t0 = performance.now();
      const {createUnboxing} = await import('./unboxing.js?v=climax-1');
      performance.measure('unboxing:import three.js and the box', {start: t0, end: performance.now()});
      // Oct 15 evening: the rigid Cloth was rejected. Keep the original anime
      // transformation after the brief freeze, then return its moving mask.
      // Native model studies remain available only outside the public sequence.
      unbox = await createUnboxing({canvas: box3d, film: found.film, sphere: win.genesisSphere, stage: found.stage, at: momentsOf(used),
        getEntryPose: () => {
          if(last?.flight && Math.abs(last.t-found.film.currentTime)<.25)return {...last.pose,sourceTime:last.t,outside:last.flight.outside};
          if(last?.pose&&last.m===0&&last.t>=BURSTS[1].t&&last.t<=burstEnd(BURSTS[1])+.4)return {...last.pose,sourceTime:last.t};
          const s=win.genesisSphere?.getViewState?.(),bounds=found.stage.getBoundingClientRect(),source=found.sphere.getBoundingClientRect();
          return s&&bounds.width&&bounds.height?{x:(source.left+source.width*SPHERE_X-bounds.left)/bounds.width,
            y:1-(source.top+source.height*.5-bounds.top)/bounds.height,
            radiusHeight:Math.min(source.width,source.height)*s.radius/bounds.height*4/Math.sqrt(15),
            yaw:s.yaw,pitch:s.pitch,sourceTime:found.film.currentTime}:null;
        },
        pick: {cloth: q.get('cloth'), seiya: q.get('seiya')}, her: false, freezeSpace, mintSupply, mintChairs, onDraw: showBox, onAssets: (s) => tell('assets', s),
        worlds: () => kick?.worlds ?? [], hideWorlds: (on) => kick?.hideWorlds(on), onDark: (k) => darken?.(k),
        onFold: (on) => { if (foldShown === on) return; foldShown = on;
          found.sphere.style.visibility = front.style.visibility = on ? 'hidden' : ''; }});
      tell('assets', unbox.state);
      sync();
    };
    later(LOAD_AFTER_MS).then(idle).then(startBox);
  }

  // the page's handle: frozen, the mounted objects through getters (lab/hero-ab.html's panel reaches them through its frame's window)
  const handle = Object.freeze({
    get mounts() { return mounts; },
    get theater() { return theater; }, get unbox() { return unbox; }, get kick() { return kick; }, get inversion() { return inversion; }, get koEdge() { return koEdge; },
    boxLog,
    get hold() { return hold; },
    /** the panel's views: m from 0 (A) through 1 (C) to 2 (B), or null: the film */
    view(m) { hold = m === null ? null : clamp(Number(m) || 0, 0, 2); sync(); theater?.ask(); unbox?.ask(); return hold; },
    get used() { return used; }, get rev() { return rev; }, get tags() { return tags; },
    get inverted() { return inverted(); },
    get glass() { return glassLook; },
    moments: () => momentsOf(used ?? {}),
    burstAt,
    words: Object.freeze({SKY, CENTAUR, KNIGHTS, ARMOR, EMPTY, INVERSION, SEGMENTS, KNIGHTS_WORDS, MASK_WORDS, BURSTS, STOPS, CLOSE, SHUT}),
    /** fn(kind, ...): 'show' (m, t), 'tags', 'assets' (the box's models' state), 'box' (its draw's stats); returns the way to stop listening */
    listen(fn) { ears.add(fn); return () => ears.delete(fn); },
    state: () => ({hold, used, rev, tags: tags.length, m: hero ? mAt(hero.film.currentTime) : null, kick: kick?.on ?? null, hushed: kick?.hushed ?? null,
      box: unbox ? {out: unbox.out, draws: unbox.draws, models: {cloth: unbox.state.cloth.at, seiya: unbox.state.seiya.at}} : null, last, boxLast}),
  });
  doc[MOUNTED] = handle;
  win.hero = handle;   // for a reader in the console, the lab's panel and the proofs
  doc.dispatchEvent?.(new win.CustomEvent('dl-hero-mounted'));   // the panel's word: the page's entry imports this mount (warm-entry.mjs), which can end after the frame's load

  // at the page's load (as the lab's frame mounted it), once the sphere and the film are there
  const go = () => {
    if (!doc.documentElement) return; // the lab may have replaced its iframe while modules loaded
    const found = heroOf(doc);
    if (found) { ready(found); return; }
    const watch = new win.MutationObserver(() => { const found = heroOf(doc); if (found) { watch.disconnect(); ready(found); } });
    watch.observe(doc.documentElement, {childList: true, subtree: true});
  };
  if (doc.readyState === 'complete') go(); else win.addEventListener('load', go, {once: true});
  return handle;
}
