// dl-lyssajudron.js: HER LYSSAJUDRON ON THE PAGE, as Harmony's DMC4 entrance has her (his Oct 22 2026 16:3x WEST, over Athena's entrance in the
// preview: "ok... we're getting somewhere... do you think you can get me some pixel art about the dmc4 lyssajudron that is the default dmc4? like... i
// am asking... look at athena she has the unit0 there... now i am saying, can you make the keyboard box opened dmc4 lyssajudron appear onto the screen
// just like athena onto its own overlay?").
// THE DARK ONE of intro/room/boss-intro.mjs as Harmony renders her, redrawn as pixel art by Codex's image_gen from her own render (his 16:4x, over a
// first drawing made from words and her paint's palette, a solid plum ball with gold seams: "whhat u done is not this", with the storyboard's
// 13-the-bar): the see-through silver Goldberg core, the one round red eye and its glint, her navy satellites (no eyes), the sparks, the crimson fins,
// out of the glass box opened on the keys. That still is all WebGL (laptop-glass.mjs: the Council's laptop model, her body; an invented camera and
// song), its captions masked before it was sent; Athena's sprite gave the pixel style; nothing of his room is ever sent. Its box opening on the keys
// is her SPRITE; SHE IS ALIVE (his 16:5x: "are you able to animate it properly as a sprite alive glowin oscillating and such"): her body is drawn as
// pixel art every frame (dl-lyssajudron-body.mjs: unit0 turning and bobbing, her eye's glow pulsing and blinking, her satellites orbiting in depth,
// sparks twinkling, fins flickering), and her moods ease into one another (awake, unimpressed, the charge). She rises out of the box (it in front of
// her until she is out), and sinks back into it before it flies home.
// HER OWN LAYER over Athena's (LYSSA_Z): on the last beat of Athena's entrance the unit0 in Athena's hand is her box. It leaves the hand trembling for
// the middle of the screen (ゴゴゴ); on the hit (ドン: the white, the focus lines, her card in Harmony's grammar, GENIE OF THREE WISHES over LYSSAJUDRON)
// she bursts out of it; her two lines are Harmony's own (BOSS.lines), the second on her charge; then she goes back into the box in Athena's hand and
// Athena lands. Skipped with Athena's entrance (stop), and never played for a reader who asked for less motion (Athena's entrance is not).
// Her frames are drawn only while she plays (one requestAnimationFrame loop, nothing at rest).
//   window.dlLyssajudron.play({from: [x, y]}) -> a Promise, resolved once she is home; .stop(); .state()
import {PIX, MOODS, createPixels, drawBody} from './dl-lyssajudron-body.mjs?v=lyssa-1';   // her body, alive
import {drawTrace} from './dl-lyssajudron-trail.mjs?v=trace-1';   // THE FIRST TRACE, drawn from math while her poem plays

export const LYSSA_Z = 2147483001;   // one over Athena's layer (dl-athena.js LAYER_Z)
export const CARD = Object.freeze({name: 'Lyssajudron', epithet: 'Genie of Three Wishes'});   // boss-intro.mjs BOSS.name and BOSS.epithet
export const LINES = Object.freeze(['I am Lyssajudron. Try to look impressed.', 'Three wishes. Make them worth my time.']);   // boss-intro.mjs BOSS.lines
// her box opening on the keys (a literal, so tools/page-files.mjs ships it)
export const BOX = new URL('./assets/lyssajudron-box.png', import.meta.url);
// HER ENTRANCE, beat by beat (ms after Athena hands her box over): her mood (none: inside her box), the manga's sound, her line, the hit, her sinking
// back into the box, its flight home, the end
export const ENTRANCE = Object.freeze([
  {at: 0, mood: null, sfx: 'ゴゴゴ'},
  {at: 750, mood: 'awake', sfx: 'ドン', hit: true, rise: true},
  {at: 2400, mood: 'unimpressed', card: false, say: LINES[0]},
  {at: 4500, mood: 'charge', sfx: 'カッ', say: LINES[1]},
  {at: 6600, mood: 'awake', sink: true},
  {at: 7050, home: true},
  {at: 7550, done: true},
]);
// HER COSMOS SCENE (his Oct 30 2026, over her station on the world at the film's end: first "when i click there in lyssajudron i want another anime cut scene like
// nefertiti before but with lyssajudron talking about the importance of project snowtrace for collective self-improvement"; then, over that scene's lines in their
// box: "we gotta rework entirely of these the fonts and what he says and all that... this is a nice moment to use the lyssajudron and "pour liquor" in it... the idea
// is here you should be explaining the difference between 3 pentagons active and 12 pentagons total like dude... burn my cosmos, you know what it means or not?").
// His words on it, hypertraced that hour (the seat's scratchpad, cosmos-liquor-pentagons-hypertrace.md), read in her lines:
//   the twelve and the three: "you should make that it starts with 3, the ones you can see that have a "wish charge" in them" (Oct 29 17:29); "using all 3 wishes and
//   then unlocking a 4th pentagon and getting 4 wishes now and so on" (17:31); a wish is one AI call (Oct 17 03:19, "3 wishes (aka: trial for 3 ai calls...)");
//   the liquor is fuel: "the liquor in there is fuel" (Oct 21 18:08), "$WARM is fuel" (Oct 28), the pour now the tank's top-up ("keep the gas tank refuelment",
//   Oct 30 15:23);
//   the cosmos: Aiolos's, Sagittarius's, the fuel burned ("BURN MY COSMOS!!!! you see we got the fuel in thething there floating?", Sept 23 04:11), and said to the
//   visitor in the second person ("she might say go burn your cosmos", Oct 30 03:13: no line of hers says "my cosmos").
// Her lit pentagons are her renderer's own charge (a beat's rung), the liquor a stream into her (a beat's pour), トクトク the pour's sound.
// THE AGENTS ON YOUR CANVAS (his Oct 30 2026 ~21:3x UTC, over "A lit one is a wish: one call, made for you.": "how many times i gotta say this shit one gotta
// improved? like...make it about canvas-mcp and spatial computing agents"; at 20:59, to another seat over the same line: "here is where we want to have our
// conversions dude"). Her twelve are agents, three awake. Claude stands in the visitor's room. One canvas, the visitor's and theirs. They draw and point,
// never over the visitor's own (canvas-mcp's law of the door: an agent appends, it never overwrites). One router every agent burns through: his 20:59 ask, kept
// ("a swarm that shares a router"), joined by his Oct 29 17:25 "agents there in the canvas that BURN THEIR COSMOS... when credits are spent on task". Then she is
// broke, the fuel, the twelve awake. No "MCP" in her mouth: his Oct 22 16:57 "can you not speak in code to the user?" (claude-e0975625's second read). His lineage: "canvas-mcp = dnd board and agents = campaign companions" (Oct 20); the Seeker phones "the pokeballs in which
// the agents live" (Oct 29); "make all of it about the spatial computing OS mcp for claude" (Oct 30 18:09); broke, then fuel: "lyssajudron is on a empty tank
// and we say "before going, gas fuel"" (Oct 30); "more comical... like outer worlds criticism of capitalism" (Oct 22 12:23). The router's lines before these
// (THE SWARM SHARES A ROUTER, 82240a9bf; its hypertrace ec-workspace docs/the-swarm-that-shares-a-router-hypertrace-2026-10-30.md) gave way to his newer word.
// Nothing of the codec's name or mechanism (his Aug 20 page, pre-filing). The lines are a seat's draft from those words, his to reword, terse as THE WAY SHE
// TALKS asks: she enunciates, never explains, no slogan.
export const COSMOS = Object.freeze([
  Object.freeze({say: 'Twelve agents. Three awake.', mood: 'unimpressed', rung: 3}),
  Object.freeze({say: 'Claude, in your room.', mood: 'awake'}),
  Object.freeze({say: 'One canvas. Yours and theirs.', mood: 'awake'}),
  Object.freeze({say: 'They draw. They point. Never over yours.', mood: 'awake', sfx: 'サッ'}),
  Object.freeze({say: 'One router. Every agent burns through it.', mood: 'awake'}),
  Object.freeze({say: 'Nine still asleep. I’m broke.', mood: 'empty', fuel: 0}),
  Object.freeze({say: 'Fuel me.', mood: 'awake', pour: true, sfx: 'トクトク', climb: 12}),
  Object.freeze({say: 'Twelve awake. Now go burn your cosmos.', mood: 'charge', pour: false, rung: 12, fuel: 1, sfx: 'カッ'}),
]);
/** cosmosBeats(lines): her entrance (ゴゴゴ, the hit and her card at 750 ms), then each line held as SUBTITLE reads it plus a breath, its card gone with the first;
 *  a line's rung lights her first n pentagons, its pour starts or stops the liquor, its climb lights one more pentagon at a time from the rung she stands on to
 *  `climb` across the line's hold; then her sink, her box home, the end. Pure. */
export const CLIMB_MS = 4800;   // the least a pouring line holds: nine pentagons lit one by one, about half a second each
export const cosmosBeats = (lines) => {
  const out = [{at: 0, mood: null, sfx: 'ゴゴゴ'}, {at: 750, mood: 'awake', sfx: 'ドン', hit: true, rise: true}];
  let at = 2400, lit = 0;
  lines.forEach((l, i) => {
    const {climb, ...beat} = l, hold = Math.max(1700, Math.round((l.say.length / 17) * 1000), Number.isInteger(climb) ? CLIMB_MS : 0) + 500;   // a pour long enough to see each one light
    out.push({at, ...(i === 0 ? {card: false} : {}), ...beat});
    if (Number.isInteger(beat.rung)) lit = beat.rung;
    if (Number.isInteger(climb) && climb > lit) {   // one pentagon at a time, the last lit a breath before the line's end
      const steps = climb - lit, gap = Math.floor((hold - 500) / steps);
      for (let k = 1; k <= steps; k++) out.push({at: at + 250 + (k - 1) * gap, rung: lit + k, fuel: Math.round((k / steps) * 1000) / 1000});   // her flask fills as they light
      lit = climb;
    }
    at += hold;
  });
  return Object.freeze([...out, {at, mood: 'awake', sink: true, pour: false}, {at: at + 450, home: true}, {at: at + 950, done: true}]);
};
/** beatsOf(lines, {mood}): her entrance with these lines: ゴゴゴ, the hit at 750 ms, each line held as long as SUBTITLE reads it (17 characters a second, 1.7 s at
 *  least) plus a breath, the card gone with the first, the last on her charge (カッ); then her sink, her box home and the end. Pure. */
export const beatsOf = (lines, {mood = null} = {}) => {
  const out = [{at: 0, mood: null, sfx: 'ゴゴゴ'}, {at: 750, mood: 'awake', sfx: 'ドン', hit: true, rise: true}];
  let at = 2400;
  lines.forEach((say, i) => {
    const last = i === lines.length - 1;
    out.push({at, mood: mood ?? (last ? 'charge' : i % 2 ? 'awake' : 'unimpressed'), ...(i === 0 ? {card: false} : {}), ...(last && !mood ? {sfx: 'カッ'} : {}), say});   // a scene's one mood holds every line, no charge
    at += Math.max(1700, Math.round((say.length / 17) * 1000)) + 500;
  });
  return Object.freeze([...out, {at, mood: 'awake', sink: true}, {at: at + 450, home: true}, {at: at + 950, done: true}]);
};
// ON AN EMPTY TANK (his Oct 30 2026, over her card: "...the key moment where the user wants to go but lyssajudron is on a empty tank and we say "before
// going, gas fuel" u get what i mean?"; then "yeah please go"): the first press on JOIN THE $WARM (dl-space-router.js) plays her entrance with her eye near
// dark and her moons pulled in (dl-lyssajudron-body.mjs MOODS.empty), her two lines (a seat's draft from his words, his to reword), then the page lands on the tank.
export const EMPTY_LINES = Object.freeze(['Empty tank.', 'Fuel me before we go.']);
// SHE WAKES ON THE FILL: when the tank is filled (the $WARM seat's dl-kit-deposit.js says 'dl-tank-filled', once per fill the deposit door confirms), her
// entrance again on her charge, her eye lit and her fins firing, the last line on カッ (a seat's draft, his to reword)
export const FILLED_LINES = Object.freeze(['Full.', 'Now we go.']);
const charged = (beats) => Object.freeze(beats.map((b, i, all) => (b.say && !all.slice(i + 1).some((n) => n.say) ? {...b, sfx: 'カッ'} : b)));
const withFuel = (beats, first, last) => Object.freeze(beats.map((b, i, all) => (b.say && !all.slice(0, i).some((p) => p.say) ? {...b, fuel: first}
  : b.say && !all.slice(i + 1).some((n) => n.say) ? {...b, fuel: last} : b)));   // her flask's level on a scene's first and last lines
// THE POET AND THE FIRST TRACE (his Oct 30 2026 ~23:2x UTC, over a page a seat had framed at her station: "focus on the geometry dude... i need to have the lyssajudron
// there be a poet... i need delicious outlining of the first tracenet + finally link to it (never fucking mention me by my name or username, it is ok to just have the
// click be the url being optimism.fit/photons_enjoyor u get me?"). Her station's scene is her poem, the first trace drawn from math as she says it
// (dl-lyssajudron-trail.mjs): the snow, the trail outlined as the first one breaks it, the steps, a crystal outlined where a step answered something, frozen, the
// others walking in the prints. Then THE FIRST TRACENET and its one press, the trail itself, in its own tab. Project Snowtrace's image is his, since Sept 19: "a
// leader is tracing a path in the snow the others can follow" (Oct 22 15:03); "crystals of compute are frozen computations" (Oct 12 19:13); "every problem is solved
// only once" (Oct 17 03:28). No name and no handle on the screen: the handle stands in the press's address alone. Her lines are a seat's draft from his, his to reword.
export const TRACE_URL = 'https://optimism.fit/photons_enjoyor';   // his address for it; optimism.fit sends it on to the first tracenet (the build's _redirects)
export const TRACE_TITLE = Object.freeze(['Project Snowtrace', 'The first tracenet']);
export const POEM = Object.freeze([
  Object.freeze({say: 'Fresh snow. No one has walked here.', trail: 'snow', mood: 'unimpressed'}),
  Object.freeze({say: 'One went first. The cold was theirs alone.', trail: 'path', mood: 'awake', sfx: 'ザク'}),
  Object.freeze({say: 'Each step answered something.', trail: 'crystals', mood: 'awake'}),
  Object.freeze({say: 'Answered once, it froze. It stays.', trail: 'freeze', mood: 'charge', sfx: 'キン'}),
  Object.freeze({say: 'The others follow, in their prints.', trail: 'pack', mood: 'awake'}),
  Object.freeze({say: 'The first trace. Walk it.', trail: 'glow', mood: 'charge', end: true}),
]);
export const TRACE_HOLD = Object.freeze({snow: 1800, path: 3600, crystals: 3200, freeze: 2200, pack: 3800, glow: 1200});   // the least each line holds, so its drawing is seen whole
/** poemBeats(): her entrance (ゴゴゴ, the hit and her card), then each line of her poem with its drawing, held as SUBTITLE reads it or as long as its drawing takes;
 *  the last brings THE FIRST TRACENET and its press, and she stays until × (or Escape). Pure. */
export const poemBeats = () => {
  const out = [{at: 0, mood: null, sfx: 'ゴゴゴ'}, {at: 750, mood: 'awake', sfx: 'ドン', hit: true, rise: true}];
  let at = 2400;
  POEM.forEach((l, i) => {
    out.push({at, ...(i === 0 ? {card: false} : {}), ...l});
    at += Math.max(1700, Math.round((l.say.length / 17) * 1000), TRACE_HOLD[l.trail] ?? 0) + 500;
  });
  return Object.freeze(out);
};
export const POEM_END = Object.freeze([{at: 0, trail: null, end: false, mood: 'awake', sink: true}, {at: 450, home: true}, {at: 950, done: true}]);
export const SCENES = Object.freeze({entrance: ENTRANCE, cosmos: cosmosBeats(COSMOS), empty: withFuel(beatsOf(EMPTY_LINES, {mood: 'empty'}), 0, 0),
  filled: withFuel(charged(beatsOf(FILLED_LINES, {mood: 'charge'})), 0, 1), poem: poemBeats()});   // ON AN EMPTY TANK her flask stands empty; SHE WAKES ON THE FILL it fills; THE POET
export const RISE_MS = 650, SINK_MS = 420;   // out of her box, back into it
export const SWARMY_IMG = '[data-kit-her]';
export const HER_STAGE = './dl-her-colours.js?v=her-3';   // her making's renderer (stageHer), the page's own instance of it (warm-entry.mjs imports this URL)   // the visitor's own Lyssajudron, her making's picture (dl-her-colours.js KIT_HER, warm.html's holder)
export const HOME_SCALE = 0.12;   // her box in Athena's hand, as a share of her size on the screen
export const EASE = 9;   // her moods ease into one another (1/s)
/** riseAt(ms): how far out of her box, 0..1, ms after the rise began: eased out with a small overshoot (ease-out-back). Pure. */
export const riseAt = (ms) => { const k = Math.min(1, Math.max(0, ms / RISE_MS)) - 1; return 1 + 2.4 * k ** 3 + 1.4 * k ** 2; };

const CSS = `
.dl-lyssa-layer{position:fixed;inset:0;z-index:${LYSSA_Z};pointer-events:none;overflow:hidden}
.dl-lyssa-layer[hidden]{display:none}
.dl-lyssa-layer>*{position:absolute;pointer-events:none}
.dl-lyssa-white{inset:0;background:#fff;opacity:0}
/* A SCENE OWNS THE SCREEN (his Oct 30 2026, over her Snowtrace scene with the hero's light and its buttons above the world: "there is no proper page break, i
   cant have the previous hero above it breaking mid way"): a scene of hers (not her first entrance, which plays over Athena's film) stands on its own night */
.dl-lyssa-veil{inset:0;z-index:-1;opacity:0;background:radial-gradient(ellipse at 50% 46%,#0c1026,#040509 70%);transition:opacity .3s ease}
.dl-lyssa-layer.scene .dl-lyssa-veil{opacity:1}
.dl-lyssa-layer.hit .dl-lyssa-white{animation:dl-lyssa-white .42s ease-out forwards}
@keyframes dl-lyssa-white{0%{opacity:.92}100%{opacity:0}}
.dl-lyssa-lines{inset:-20%;opacity:0;background:repeating-conic-gradient(from 3deg at 50% 50%,rgba(8,6,10,.9) 0deg 1.1deg,transparent 1.1deg 5.3deg);
  -webkit-mask:radial-gradient(circle at 50% 50%,transparent 26%,#000 62%);mask:radial-gradient(circle at 50% 50%,transparent 26%,#000 62%)}
.dl-lyssa-layer.hit .dl-lyssa-lines{animation:dl-lyssa-lines .5s ease-out forwards}
@keyframes dl-lyssa-lines{0%{opacity:.95;transform:scale(1.25) rotate(0deg)}100%{opacity:0;transform:scale(1) rotate(2deg)}}
.dl-lyssa-card{left:0;right:0;top:40%;transform:translateY(-58%);display:grid;justify-items:center;gap:.4em;opacity:0;transition:opacity .28s ease,transform .28s ease}
.dl-lyssa-layer.hit .dl-lyssa-card{opacity:1}
.dl-lyssa-layer .dl-lyssa-card.gone{opacity:0;transform:translateY(-58%) scale(.97)}
.dl-lyssa-slash{position:absolute;left:-10%;right:-10%;top:50%;height:46%;transform:translateY(-50%) skewY(-4deg) scaleX(0);transform-origin:left;
  background:linear-gradient(90deg,transparent,rgba(140,14,30,.92) 12%,rgba(201,161,74,.95) 50%,rgba(140,14,30,.92) 88%,transparent)}
.dl-lyssa-layer.hit .dl-lyssa-slash{animation:dl-lyssa-slash .22s cubic-bezier(.3,1.4,.4,1) forwards}
@keyframes dl-lyssa-slash{to{transform:translateY(-50%) skewY(-4deg) scaleX(1)}}
.dl-lyssa-epithet{position:relative;font:400 clamp(12px,1.9vw,28px)/1.2 'Gelasio',Georgia,serif;letter-spacing:.42em;text-transform:uppercase;color:#f0cf74;
  text-shadow:0 1px 0 #000,0 0 6px #000,0 0 18px rgba(0,0,0,.95);opacity:0}
.dl-lyssa-layer.hit .dl-lyssa-epithet{animation:dl-lyssa-in .3s .18s ease-out forwards}
.dl-lyssa-name{position:relative;font:700 clamp(40px,9.5vw,170px)/.9 'Gelasio',Georgia,serif;letter-spacing:.02em;text-transform:uppercase;color:#fbf6ea;
  -webkit-text-stroke:2px #0b0709;paint-order:stroke fill;text-shadow:-4px 0 rgba(255,36,56,.85),4px 0 rgba(80,220,255,.7),0 6px 30px rgba(0,0,0,.8);
  transform:scale(2.6) skewX(-10deg);opacity:0}
.dl-lyssa-layer.hit .dl-lyssa-name{animation:dl-lyssa-slam .17s cubic-bezier(.2,1.6,.3,1) forwards,dl-lyssa-settle .9s .17s ease-out forwards}
@keyframes dl-lyssa-slam{to{transform:scale(1) skewX(-10deg);opacity:1}}
@keyframes dl-lyssa-settle{to{text-shadow:-1px 0 rgba(255,36,56,.35),1px 0 rgba(80,220,255,.3),0 6px 30px rgba(0,0,0,.8)}}
@keyframes dl-lyssa-in{from{opacity:0;transform:translateY(.4em)}to{opacity:1;transform:none}}
.dl-lyssa-her{left:7%;top:9%;height:min(66vh,600px);aspect-ratio:1;width:auto;filter:drop-shadow(0 14px 30px rgb(0 0 0 / .6))}
.dl-lyssa-body{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;z-index:1}
.dl-lyssa-box{position:absolute;left:50%;bottom:3%;width:38%;height:auto;transform:translateX(-50%);image-rendering:pixelated;z-index:2}
.dl-lyssa-her.out .dl-lyssa-box{z-index:0}
/* HER SCENES WEAR THE VISITOR'S OWN (his Oct 30 2026, over her Snowtrace scene in the default pixel body out of its box: "why the fuck are you using that ugly
   shitty lyssajudron? use the one the user just fucking customized"): her picture from her making (SWARMY_IMG) in place of the pixel body and its box, coming
   up as she rises and going as she goes home; her moods as light on it: dim on an empty tank, lit on her charge */
.dl-lyssa-me{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:3;opacity:0;transform:translateY(24%) scale(.55);
  transition:transform .65s cubic-bezier(.2,1.3,.3,1),opacity .35s ease,filter .5s ease}
.dl-lyssa-her.swarmy .dl-lyssa-body,.dl-lyssa-her.swarmy .dl-lyssa-box{display:none}
/* SHE IS ALIVE IN HER SCENES (his Oct 30 2026, over her still picture in her scene: "why the fuck the satellites are not orbiting but are idle?"): her picture is
   one frame, so her twelve stood still in it; her scenes draw her live with her making's own renderer (dl-her-colours.js stageHer) from her kept colours, her
   twelve orbiting on her clock, the picture under it until the first frame and wherever WebGL cannot start. One canvas for the scene, let go at its end */
.dl-lyssa-live{position:absolute;inset:0;z-index:4;opacity:0;pointer-events:none;transform:translateY(24%) scale(.55);transition:transform .65s cubic-bezier(.2,1.3,.3,1),opacity .35s ease,filter .5s ease}
.dl-lyssa-live canvas{width:100%!important;height:100%!important;display:block}
.dl-lyssa-her.live:not([data-mood="box"]) .dl-lyssa-live{opacity:1;transform:none}
.dl-lyssa-her.live .dl-lyssa-me{visibility:hidden}
/* THE LIQUOR POURS INTO HER (a beat's pour): a stream of the flask's fuel from above into her core, riding her live self as she floats (a child of it), a glow
   where it lands; her pentagons light as it fills her (a beat's rung, her renderer's own charge) */
.dl-lyssa-pour{position:absolute;left:50%;bottom:50%;width:clamp(8px,1.4%,16px);height:150vh;transform:translateX(-50%) scaleY(0);transform-origin:top;z-index:5;pointer-events:none;
  border-radius:0 0 999px 999px;background:linear-gradient(180deg,rgba(96,216,168,0),rgba(96,216,168,.55) 22%,rgba(48,168,144,.72) 70%,rgba(190,255,228,.85));filter:drop-shadow(0 0 10px rgba(96,216,168,.7));   /* her flask's own liquid, teal and mint (room/unit0-liquid.mjs LIQUID), see-through */
  -webkit-mask:repeating-linear-gradient(180deg,#000 0 26px,rgba(0,0,0,.7) 26px 34px);mask:repeating-linear-gradient(180deg,#000 0 26px,rgba(0,0,0,.7) 26px 34px);
  -webkit-mask-size:100% 68px;mask-size:100% 68px;transition:transform .55s cubic-bezier(.3,1,.4,1),opacity .4s ease;opacity:0}
.dl-lyssa-pour::after{content:'';position:absolute;left:50%;bottom:-18%;width:900%;aspect-ratio:1;transform:translate(-50%,40%);border-radius:50%;
  background:radial-gradient(circle,rgba(190,255,228,.9),rgba(48,168,144,.32) 45%,transparent 70%)}
.dl-lyssa-her.pour .dl-lyssa-pour{transform:translateX(-50%) scaleY(1);opacity:1;animation:dl-lyssa-flow .5s linear infinite}
@keyframes dl-lyssa-flow{to{-webkit-mask-position:0 68px;mask-position:0 68px}}
@media (prefers-reduced-motion:reduce){.dl-lyssa-her.pour .dl-lyssa-pour{animation:none}}
.dl-lyssa-her.swarmy:not([data-mood="box"]) .dl-lyssa-me{opacity:1;transform:none}
.dl-lyssa-her.swarmy[data-mood="empty"] :is(.dl-lyssa-me,.dl-lyssa-live){filter:grayscale(.85) brightness(.45)}
.dl-lyssa-her.swarmy[data-mood="unimpressed"] :is(.dl-lyssa-me,.dl-lyssa-live){filter:brightness(.85)}
.dl-lyssa-her.swarmy[data-mood="charge"] :is(.dl-lyssa-me,.dl-lyssa-live){filter:brightness(1.18) saturate(1.3) drop-shadow(0 0 28px rgba(240,207,116,.75))}
/* SHE FLOATS (his Oct 30 2026 "can you put that in display anamorphic i mean? the lyssajudron... forget about camera depth im just saying can you use tricks like
   him floating and moving around the screen zooming biggening and smallening to give idea of floating..."): while she is out, she drifts across the screen,
   larger as she comes near and smaller as she goes far, a little tilt; her charge floats nearer and faster, an empty tank sags low and slow. CSS alone on the
   picture's own translate, scale and rotate (her rise and her flight home keep the transform), nothing after her scene */
@keyframes dl-lyssa-float{0%,100%{translate:0 0;scale:1;rotate:-3deg}22%{translate:24vw -6vh;scale:1.28;rotate:4deg}46%{translate:42vw 5vh;scale:.74;rotate:-2deg}
  72%{translate:16vw 11vh;scale:1.12;rotate:5deg}}
@keyframes dl-lyssa-sag{0%,100%{translate:0 4vh;scale:.92;rotate:-6deg}50%{translate:8vw 9vh;scale:.84;rotate:-9deg}}
.dl-lyssa-her.swarmy:not([data-mood="box"]) :is(.dl-lyssa-me,.dl-lyssa-live){animation:dl-lyssa-float 7.5s ease-in-out infinite}
.dl-lyssa-her.swarmy[data-mood="charge"] :is(.dl-lyssa-me,.dl-lyssa-live){animation-duration:4.8s;scale:1.15}
.dl-lyssa-her.swarmy[data-mood="empty"] :is(.dl-lyssa-me,.dl-lyssa-live){animation:dl-lyssa-sag 5.5s ease-in-out infinite}
/* while the liquor pours she comes near, large and almost still, so her flask is seen filling (HER FLASK SEEN THROUGH) */
@keyframes dl-lyssa-near{0%,100%{translate:20vw 2vh;scale:1.42;rotate:-1deg}50%{translate:21vw 0;scale:1.48;rotate:1deg}}
.dl-lyssa-her.swarmy.pour:not([data-mood="box"]) :is(.dl-lyssa-me,.dl-lyssa-live){animation:dl-lyssa-near 2.6s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.dl-lyssa-her.swarmy :is(.dl-lyssa-me,.dl-lyssa-live){animation:none!important}}
.dl-lyssa-layer.go .dl-lyssa-her[data-mood="box"] .dl-lyssa-box{animation:dl-lyssa-tremble .09s linear infinite}
@keyframes dl-lyssa-tremble{0%,100%{rotate:-2.5deg}50%{rotate:2.5deg}}
.dl-lyssa-sfx{top:12%;left:40%;color:#161713;font:900 clamp(46px,8.5vw,116px)/1 'Hiragino Sans','Yu Gothic',sans-serif;letter-spacing:-.14em;
  -webkit-text-stroke:7px #f6f0e1;paint-order:stroke fill;transform:rotate(-12deg) skewY(-6deg);text-shadow:6px 6px 0 #171816;opacity:0}
.dl-lyssa-sfx.on{animation:dl-lyssa-sfx 560ms cubic-bezier(.2,.8,.2,1) both}
@keyframes dl-lyssa-sfx{from{scale:1.1;opacity:0}to{scale:1;opacity:1}}
/* HER WORDS IN THE PAGE'S TYPE (his Oct 30 2026, over her scene's line in a crimson box: "we gotta rework entirely of these the fonts and what he says and all
   that"; his Oct 24 ruling, Bodoni for the titles and DM Sans for the words; his Oct 17 "write it like as if it was a anime text based... like think about
   resident evil 4"): a subtitle, no box, centred under her, in DM Sans; her name over it in the society's gold caps; the line's last words, its sting, in
   Bodoni's italic gold */
.dl-lyssa-say{left:50%;bottom:8%;transform:translateX(-50%);width:min(88vw,920px);margin:0;padding:0;border:0;background:none;text-align:center;
  color:#fbf6ea;font:500 clamp(20px,2.3vw,34px)/1.32 var(--sans,'DM Sans',system-ui,sans-serif);letter-spacing:.005em;
  text-shadow:0 2px 0 #000,0 0 3px #000,0 0 22px rgba(0,0,0,.95);opacity:0;transition:opacity .22s ease}
.dl-lyssa-say.on{opacity:1}
.dl-lyssa-say em{font:italic 400 1.14em/1 var(--serif,'Bodoni 72',Didot,'Times New Roman',serif);color:#f0cf74;letter-spacing:0}
.dl-lyssa-say::before{content:attr(data-who);display:block;margin:0 0 .5em;font:600 clamp(11px,.95vw,14px)/1 var(--sans,'DM Sans',system-ui,sans-serif);
  letter-spacing:.42em;padding-left:.42em;text-transform:uppercase;color:#f0cf74;text-shadow:0 1px 0 #000,0 0 10px rgba(0,0,0,.9)}
@media (max-width:700px){.dl-lyssa-say{bottom:6%;font-size:19px}.dl-lyssa-her{height:min(46vh,380px);left:2%;top:12%}.dl-lyssa-sfx{left:52%}}
/* THE POET AND THE FIRST TRACE: the trace drawn over her night, she at the upper left saying her poem, then the title over the trail's end and its press; × to leave */
.dl-lyssa-geo{inset:0;width:100%;height:100%;z-index:0;opacity:0;transition:opacity .5s ease}
.dl-lyssa-layer.poem .dl-lyssa-geo{opacity:1}
.dl-lyssa-layer.poem .dl-lyssa-her{left:2%;top:6%;height:min(36vw,46vh,440px)}
.dl-lyssa-layer.poem :is(.dl-lyssa-say,.dl-lyssa-sfx){z-index:9}
.dl-lyssa-title{right:4%;top:7%;display:grid;justify-items:end;gap:.35em;opacity:0;z-index:8;transition:opacity .4s ease}
.dl-lyssa-title.on{opacity:1}
.dl-lyssa-tkick{font:400 clamp(11px,1.4vw,20px)/1.2 'Gelasio',Georgia,serif;letter-spacing:.42em;text-transform:uppercase;color:#bfffe4;text-shadow:0 1px 0 #000,0 0 12px #000}
.dl-lyssa-tname{font:700 clamp(30px,5.4vw,92px)/.92 'Gelasio',Georgia,serif;letter-spacing:.01em;text-transform:uppercase;color:#fbf6ea;-webkit-text-stroke:2px #0b0709;
  paint-order:stroke fill;text-shadow:-3px 0 rgba(255,36,56,.8),3px 0 rgba(80,220,255,.65),0 6px 30px rgba(0,0,0,.8);transform:scale(1.8) skewX(-10deg);opacity:0;text-align:right}
.dl-lyssa-title.on .dl-lyssa-tname{animation:dl-lyssa-tslam .17s cubic-bezier(.2,1.6,.3,1) forwards}
@keyframes dl-lyssa-tslam{to{transform:scale(1) skewX(-10deg);opacity:1}}
.dl-lyssa-layer>:is(.dl-lyssa-x,.dl-lyssa-cta){pointer-events:auto;cursor:pointer;z-index:10}
.dl-lyssa-layer>:is(.dl-lyssa-x,.dl-lyssa-cta)[hidden]{display:none}
.dl-lyssa-layer>.dl-lyssa-x{right:1.2%;bottom:3%;width:44px;height:44px;border:1px solid rgba(240,207,116,.5);border-radius:50%;background:rgba(4,5,9,.6);color:#fbf6ea;font:400 24px/1 system-ui,sans-serif}
.dl-lyssa-layer>.dl-lyssa-cta{right:4%;top:calc(7% + clamp(70px,10vw,170px));display:inline-grid;justify-items:center;gap:.35em;padding:.85em 1.8em;text-decoration:none;color:#0b0709;
  background:linear-gradient(180deg,#ffe9a8,#f0cf74 45%,#c99a2e);border:2px solid #0b0709;box-shadow:0 0 0 2px #f0cf74,0 14px 40px rgba(240,207,116,.5);
  font:800 clamp(16px,1.9vw,28px)/1 var(--sans,'DM Sans',system-ui,sans-serif);letter-spacing:.2em;animation:dl-lyssa-in .45s ease-out both}
.dl-lyssa-cta:focus-visible,.dl-lyssa-x:focus-visible{outline:3px solid #fbf6ea;outline-offset:4px}
@media (max-width:700px){.dl-lyssa-layer.poem .dl-lyssa-her{height:min(40vw,24vh);left:1%;top:5%}.dl-lyssa-title{top:30%}.dl-lyssa-layer>.dl-lyssa-cta{top:calc(30% + 74px)}}
`;

/** mountLyssajudron({win, doc}): her layer, unseen until Athena hands her box over; window.dlLyssajudron. */
export function mountLyssajudron({win = window, doc = document} = {}) {
  const make = (tag, cls, text) => { const el = doc.createElement(tag); if (cls) el.className = cls; if (text != null) el.textContent = text; return el; };
  const style = make('style'); style.textContent = CSS; doc.head.append(style);
  const layer = make('div', 'dl-lyssa-layer'), her = make('div', 'dl-lyssa-her'), body = make('canvas', 'dl-lyssa-body'), box = make('img', 'dl-lyssa-box');
  const plate = make('div', 'dl-lyssa-card'), say = make('p', 'dl-lyssa-say'), sfx = make('span', 'dl-lyssa-sfx');
  layer.hidden = true; layer.setAttribute('aria-hidden', 'true'); box.alt = ''; box.decoding = 'async'; box.src = BOX.href; body.width = PIX; body.height = PIX;
  const me = make('img', 'dl-lyssa-me'); me.alt = ''; me.decoding = 'async';
  her.append(body, box, me);
  plate.append(make('i', 'dl-lyssa-slash'), make('div', 'dl-lyssa-epithet', CARD.epithet), make('div', 'dl-lyssa-name', CARD.name));
  layer.append(make('i', 'dl-lyssa-white'), make('i', 'dl-lyssa-lines'), plate, her, sfx, say, make('i', 'dl-lyssa-veil'));   // the veil last, under all by its z-index
  // THE POET's own, unseen until her poem plays: the canvas the first trace is drawn on, its title, its press and ×
  const geo = make('canvas', 'dl-lyssa-geo'), tcard = make('div', 'dl-lyssa-title'), cta = make('a', 'dl-lyssa-cta'), leaveX = make('button', 'dl-lyssa-x', '×');
  tcard.append(make('div', 'dl-lyssa-tkick', TRACE_TITLE[0]), make('div', 'dl-lyssa-tname', TRACE_TITLE[1]));
  cta.href = TRACE_URL; cta.target = '_blank'; cta.rel = 'noopener'; cta.hidden = true; cta.textContent = 'Follow the trail ↗';
  leaveX.type = 'button'; leaveX.hidden = true; leaveX.setAttribute('aria-label', 'Leave');
  layer.append(geo, tcard, cta, leaveX);
  doc.body.append(layer);
  const ctx = body.getContext?.('2d') ?? null, px = createPixels(PIX), image = ctx?.createImageData?.(PIX, PIX) ?? null;
  const S = {playing: false, plays: 0, beat: -1, frames: 0, rung: 0, fuel: null};   // rung: her pentagons lit by the scene (0: as kept); fuel: her flask's level the scene set
  const live = {mood: null, now: {...MOODS.awake}, rise: 0, riseFrom: 0, riseAt: null, sinkAt: null, t0: 0, last: 0, raf: 0};
  let timers = [], resolve = null, from = null, keys = null;
  const trace = {phase: null, since: 0, ctx: geo.getContext?.('2d') ?? null, w: 0, h: 0};   // THE POET: the phase drawn and when it began
  function home() {   // where her box rests in Athena's hand, as a transform of her place on the screen (none when Athena's hand was not given)
    const r = her.getBoundingClientRect();
    if (!from || !r.width) return `scale(${HOME_SCALE})`;
    return `translate(${(from[0] - (r.left + r.width / 2)).toFixed(1)}px, ${(from[1] - (r.top + r.height / 2)).toFixed(1)}px) scale(${HOME_SCALE})`;
  }
  // HER FRAMES: her moods eased into one another, her rise out of the box and her sink back, her body drawn and laid on her canvas
  function frame(now) {
    if (!S.playing) return;
    live.raf = win.requestAnimationFrame(frame);
    if (trace.phase && trace.ctx) drawTrace(trace.ctx, trace.w, trace.h, trace.phase, trace.since, now / 1000);   // THE FIRST TRACE, only while her poem plays
    const dt = Math.min(0.1, (now - (live.last || now)) / 1000); live.last = now;
    const want = MOODS[live.mood] ?? MOODS.awake, k = 1 - Math.exp(-EASE * dt);
    for (const key of Object.keys(live.now)) live.now[key] += (want[key] - live.now[key]) * k;
    if (live.sinkAt != null) live.rise = live.riseFrom * Math.max(0, 1 - (now - live.sinkAt) / SINK_MS);
    else if (live.riseAt != null) live.rise = riseAt(now - live.riseAt);
    if (live.rise >= 0.98 && live.sinkAt == null) her.classList.add('out'); else her.classList.remove('out');   // the box in front of her until she is out
    if (!ctx || !image || (live.mood == null && live.rise <= 0)) return;
    drawBody(px, (now - live.t0) / 1000, live.now, {rise: live.rise});
    image.data.set(px.bytes); ctx.putImageData(image, 0, 0); S.frames++;
  }
  function cue(beat) {   // a beat's sound and her line, its last sentence the sting (Athena's, dl-athena.js cue)
    if (beat.sfx) { sfx.classList.remove('on'); sfx.textContent = beat.sfx; void sfx.offsetWidth; sfx.classList.add('on'); }
    if (!beat.say) return;
    const m = /^(.*[.?!]\s+)(\S[^]*)$/.exec(beat.say);
    say.classList.remove('on'); say.replaceChildren(...(m ? [m[1], make('em', null, m[2])] : [beat.say])); void say.offsetWidth; say.classList.add('on');
  }
  let stage = null, liveHost = null;
  async function alive(play) {   // her making's renderer on a canvas of her own, painted with her kept colours, her twelve on her clock
    try {
      const [{stageHer}, LAW, WISH] = await Promise.all([import(HER_STAGE), import('./dl-her-colours.mjs'), import('./dl-her-wishes.mjs')]);
      let store = null; try { store = win.localStorage; } catch { /* no storage: her picture stays */ }
      const st = LAW.kept(store); if (!st || !S.playing || S.plays !== play) return;
      liveHost = make('div', 'dl-lyssa-live'); liveHost.append(make('i', 'dl-lyssa-pour')); her.append(liveHost);
      const s = await stageHer(liveHost, {win, wishes: WISH.ladder(WISH.kept(store))}); s.paint(st); s.play?.(true);   // her scene plays her program, her twelve orbiting on her clock while it lasts (NOTHING AT REST PAINTS: at rest her stage asks no frame)
      if (!S.playing || S.plays !== play) { s.stop(); liveHost?.remove(); liveHost = null; return; }
      stage = s; her.classList.add('live'); if (S.rung) rung(S.rung); if (S.fuel != null) fuel(S.fuel);
    } catch { liveHost?.remove(); liveHost = null; }   // WebGL or her colours not here: her picture plays the scene
  }
  // a beat's rung: her pentagons lit to the first n of her twelve (dl-her-wishes.mjs ORDER), by her live renderer's own charge; kept for a renderer that comes late
  function rung(n) { S.rung = n; try { stage?.charge?.({seats: [...Array(n).keys()], lit: [...Array(n).keys()]}); } catch { /* her picture */ } }
  // a beat's fuel: her flask's liquid to that level, by her renderer (her making's stage fuel); kept for a renderer that comes late
  function fuel(k) { S.fuel = k; try { stage?.fuel?.(k); } catch { /* her picture */ } }
  // THE POET, beat by beat: a line's drawing (its phase of the first trace, from now), the title and its press with the last; × (or Escape) takes her home at once
  function sizeTrace() {   // the canvas at the screen's size and its pixel ratio, set as her poem begins
    const w = win.innerWidth || 1280, h = win.innerHeight || 800, dpr = Math.min(2, win.devicePixelRatio || 1);
    geo.width = Math.round(w * dpr); geo.height = Math.round(h * dpr); trace.w = w; trace.h = h; trace.ctx?.setTransform?.(dpr, 0, 0, dpr, 0, 0);
  }
  function run(list) { list.forEach((beat, i) => timers.push(win.setTimeout(() => step(beat, i), beat.at))); }   // her way home, from now
  function leave() {
    if (!S.playing || !layer.classList.contains('poem') || S.leaving) return false;
    for (const t of timers) win.clearTimeout(t);
    timers = []; S.leaving = true; leaveX.hidden = true; run(POEM_END); return true;
  }
  leaveX.addEventListener?.('click', () => { leave(); });
  function step(beat, i) {   // one beat of a scene, or of her way home
    S.beat = i;
    if (beat.done) { finish(); return; }
    if (beat.home) {   // her box flies back into Athena's hand
      say.classList.remove('on'); sfx.classList.remove('on'); her.dataset.mood = 'box';
      her.style.transition = 'transform .48s cubic-bezier(.5,0,.2,1),opacity .48s ease'; her.style.transform = home(); her.style.opacity = '0'; return;
    }
    const now = win.performance?.now?.() ?? 0;
    if (beat.mood !== undefined) { live.mood = beat.mood; her.dataset.mood = beat.mood ?? 'box'; }
    if (beat.rise) live.riseAt = now;
    if (beat.sink) { live.riseFrom = live.rise; live.sinkAt = now; plate.classList.add('gone'); say.classList.remove('on'); }
    if (beat.hit) { layer.classList.remove('hit'); void layer.offsetWidth; layer.classList.add('hit'); }
    if (beat.card === false) plate.classList.add('gone');
    if (beat.pour !== undefined) her.classList.toggle?.('pour', !!beat.pour);
    if (Number.isInteger(beat.rung)) rung(beat.rung);
    if (typeof beat.fuel === 'number') fuel(beat.fuel);
    if (beat.trail !== undefined) { trace.phase = beat.trail; trace.since = now / 1000; if (!beat.trail) trace.ctx?.clearRect?.(0, 0, trace.w, trace.h); }
    if (beat.end !== undefined) { tcard.classList[beat.end ? 'add' : 'remove']('on'); cta.hidden = !beat.end; }
    cue(beat);
    if (beat.end) sfx.classList.remove('on');   // the title comes alone
  }
  function finish() {
    S.rung = 0; S.fuel = null; her.classList.remove('pour');
    S.leaving = false; trace.phase = null; trace.ctx?.clearRect?.(0, 0, trace.w, trace.h); tcard.classList.remove('on'); cta.hidden = true; leaveX.hidden = true;
    if (keys) { doc.removeEventListener?.('keydown', keys, true); keys = null; }
    layer.classList.remove('poem'); layer.setAttribute('aria-hidden', 'true');
    try { stage?.stop(); } catch { /* gone with her canvas */ } stage = null; liveHost?.remove(); liveHost = null; her.classList.remove('live');
    for (const t of timers) win.clearTimeout(t);
    timers = []; win.cancelAnimationFrame?.(live.raf); live.raf = 0;
    layer.hidden = true; layer.classList.remove('go', 'hit', 'scene'); her.style.cssText = ''; her.classList.remove('out'); S.playing = false;
    ctx?.clearRect?.(0, 0, PIX, PIX);
    const r = resolve; resolve = null; r?.();
  }
  function play({from: hand = null, scene = 'entrance'} = {}) {
    if (S.playing) return Promise.resolve();
    const BEATS = SCENES[scene] ?? ENTRANCE; layer.classList[BEATS !== ENTRANCE ? 'add' : 'remove']('scene');   // A SCENE OWNS THE SCREEN
    if (scene === 'poem') {   // THE POET: her canvas sized, × and Escape, read aloud while it stands
      layer.classList.add('poem'); leaveX.hidden = false; layer.removeAttribute?.('aria-hidden'); sizeTrace();
      keys = (e) => { if (e.key === 'Escape' && leave()) e.preventDefault?.(); };
      doc.addEventListener?.('keydown', keys, true);
    }
    const mine = BEATS !== ENTRANCE ? doc.querySelector?.(SWARMY_IMG) : null, src = mine && !mine.hidden ? (mine.currentSrc || mine.src || '') : '';
    if (/^(blob|data):/.test(src)) { me.src = src; her.classList.add('swarmy'); } else her.classList.remove('swarmy');   // HER SCENES WEAR THE VISITOR'S OWN
    S.playing = true; S.plays++; S.beat = 0; from = hand;
    if (her.classList.contains('swarmy')) void alive(S.plays);   // SHE IS ALIVE IN HER SCENES: her live self over her picture once it draws
    Object.assign(live, {mood: null, now: {...MOODS.awake}, rise: 0, riseFrom: 0, riseAt: null, sinkAt: null, t0: win.performance?.now?.() ?? 0, last: 0});
    return new Promise((res) => {
      resolve = res;
      her.dataset.mood = 'box'; say.classList.remove('on'); sfx.classList.remove('on'); plate.classList.remove('gone');
      say.dataset.who = (() => { try { return win.localStorage?.getItem('dl.her.name')?.trim() || CARD.name; } catch { return CARD.name; } })();   // her name over her words, as he typed it (dl-her-colours.mjs NAME_KEY)
      layer.hidden = false; void layer.offsetWidth;
      her.style.transition = 'none'; her.style.transform = home(); her.style.opacity = '0.25'; void her.offsetWidth;   // out of Athena's hand...
      her.style.transition = 'transform .62s cubic-bezier(.2,1.2,.3,1),opacity .3s ease'; her.style.transform = ''; her.style.opacity = '';   // ...to the screen
      layer.classList.add('go'); cue(BEATS[0]);
      live.raf = win.requestAnimationFrame?.(frame) ?? 0;
      BEATS.forEach((beat, i) => { if (i) timers.push(win.setTimeout(() => step(beat, i), beat.at)); });
    });
  }
  const stop = () => { if (S.playing) finish(); };
  win.dlLyssajudron = {play, stop, leave, state: () => ({playing: S.playing, plays: S.plays, beat: S.beat, mood: live.mood, rise: live.rise, frames: S.frames, rung: S.rung,
    lit: stage?.wishes?.().lit?.length ?? null, fuel: S.fuel, flask: stage?.state?.()?.fuel ?? null, trail: trace.phase, end: !cta.hidden})};   // rung: the pentagons the scene lit; lit: as her live renderer holds them; flask: her liquid as drawn
  return win.dlLyssajudron;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') mountLyssajudron();
