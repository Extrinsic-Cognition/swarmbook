// lyssajudron-purse.mjs · WHAT SHE CARRIES (Oct 11 2026 22:xx WEST): the fuel in her unit0, Blobby standing on it, the balance under him, the spend numbers.
//
// His words. Sept 21 03:46: "start drawing a 'liquid line' that is supposed to simulate that there is fuel inside of the unit0 for the blobby polyehdron...
// if there's gasoline in the unit0, the bottom should be darker like as if there was ale in it". Sept 21 06:36: "turn the goldberg surface into a glassy
// thing where i can see inside... show blobby inside of the goldberg with a magic wand, i think we got a wizard blobby". Sept 21 09:59: "start showing the
// balance right below blobby of how much money we got in the router... every time we use tokens i wanna see like in league of legends the DPS or any number
// flashing to screen showing me how much i spent". Sept 21 20:09, when they were gone: "can you tell me why the fuck astra or anyone has demolished the
// fucking shit i had spent time building? the blobby at the center and the gasoline and the mmo shit dps". Oct 11 21:4x: "the floating overlays on both macs
// are old versions of the exact model that is the lyssajudron on lysa... stick to that. there is only 1 anamorphic moving thing".
// Until tonight these four lived only in the old overlay's own painter (harmony-mac/runtime/ui: lyssajudron.js THE FUEL, cloud.js liquid() and glass(),
// blobby.js, overlay.js THE BALANCE AND THE DAMAGE NUMBERS), each overlay from its own machine's burn book. Here they are part of the ONE model: she is
// Harmony's own engine on the one page that every glass and the overlay frame (one.mjs; his 22:1x "do you understand the lyssajudron is this one?"), and
// they are painted in 2D in her own square, over her unit0, as the old painter painted them over this same engine: as layers of the page where a glass
// computes her itself (mountPurse2D), and INTO the engine's canvas on the page that renders her frames for a glass that only paints (mountPurseFrames:
// "lysa just paints to screen what told to paint", so the purse rides in her frames and a painting glass draws nothing of it). The table's three.js
// port (lyssajudron.mjs) carries none of it: it is a port, not her (a first cut of this file put them there too; taken out the same night).
// BLOBBY STANDS INSIDE unit0, ON THE ALE, as the overlay drew him, and not on chair 8 as he rides in Harmony's sky. His words say where the purse's Blobby
// is: "show blobby inside of the goldberg with a magic wand" (Sept 21 06:36), "the blobby at the center and the gasoline" (20:09), the balance "right
// below blobby" (09:59). Chair 8 is where he rides while a Mac's Harmony claims him (his Sept 21 "make blobby teleport with a magic blackhole into a
// whitehole onto its own uniquely assigned unit1"). WHERE HE IS IS ONE FACT ON THE NEST since Oct 12 (his Sept 20 "where does blobby go when i turn off
// the antimirror app? he lives in the fucking nest"): the ref house/blobby (tools/embertide-mesh/lib/house-blobby.mjs: where is 'harmony' while a claim
// stands, 'overlay' when he is home), and the law takes it beside the purse: HE IS DRAWN INSIDE HER unit0 ONLY WHILE NO HARMONY CLAIMS HIM. No ref, or a
// value that is not that ref's: he is drawn, as he always was. While he is away the balance stays and a number rises from the liquid's surface.
// WHILE A HARMONY CLAIMS HIM HE RIDES HIS OWN unit1 HERE TOO, AND HE CROSSES THROUGH THE TWO HOLES (Oct 12 01:xx; until then the one page drew him nowhere
// while claimed, and he came and went in one hard cut). Chair 8 of her unit0 is COLLEGIUM·PONTIFICUM (CHAIR; roma-engine.js CANON): the law says he rides
// it, the host hands that chamber's projected centre and radius in her square as its engine painted it (the engine's own layout and camera, as
// harmony.html's old painter placed him), and both painters put the same wizard on it. THE CROSSING is the old painter's, moved onto the house clock: from
// the first genesis beat at or after the ref's own since_ms, for CROSS_BEATS beats, a black hole takes him where he leaves and a white hole gives him
// where he arrives: the same instants on every glass, by the rule a spend number already follows. A move older than this glass's first picture is at
// rest. With two places a move while a crossing is in the air is the way back: the crossing turns back from that move's own beat.
//
// THE CENTRE OF UNIT0 IS THE SEAT STALLED ON HIS WORD (Oct 23 2026 19:50 WEST, his "the spot at the center must be the golem/totem that is stalled and requires
// decision... you get what i mean? there it is only blobby but we need to redesign that... it has to become spool native, look what we have on pelino displayed
// right now dude"). A seat of the Nexus that has stopped on a question only he can answer says so on its own entry (cua/agents/<seat>.ask: room-board-state.mjs
// askOf, written by the session's own hooks); the Boards' one law orders who waits longest (stalledOf), and the first of them STANDS AT THE CENTRE OF HER UNIT0,
// where Blobby stood: its TOTEM (the seat's disc in the seat's own colour, one-sea.mjs tintOf, with its initials, as the Spool Board seats it), its question under
// it where the balance was, the balance a line lower. Blobby gives it the centre as he gives it to a Harmony's claim: he rides his unit1 (CHAIR) through the two
// holes, and the totem comes in from the white hole at the centre on the same beats; when his word comes the totem leaves through the black hole and Blobby
// comes home. A stall that stood before this glass's first picture is at rest: the totem stands, Blobby rides, nothing is replayed. One stalled seat giving way
// to another (his word to the first, a question from the second) swaps the totem at the centre and moves Blobby not at all. The host hands the law the stalled
// list (stall(list, now), the same list every glass computes from the agents' refs: one.mjs stallPurse); nothing here reads the Nest.
// WHAT IT READS: two values. The Nest ref house/purse (tools/embertide-mesh/lib/house-purse.mjs writes it: the router's posted credit and what calls in
// flight hold, the tank's level, the newest calls with their own ids and times) and the Nest ref house/blobby (where he is). Its host hands each over as
// the Nest's stream delivers it and reads each once at mount. Nothing is invented: no purse, nothing is built and nothing is drawn; no level, no liquid
// (Blobby hangs at the centre, as he did); no posted credit, no balance; no row, no number.
//
// THE LAW (createPurse; pure, lyssajudron-purse.test.mjs holds it):
//   the level is a height: liquidOf(level, R, top) puts the surface between the tank's floor (-R) and its ceiling (the shell's top; the girl's feet where
//   she sits on the crown), linear in the level (the old gauge);
//   a level that changes pours over one bar from the next beat; the first reading stands at rest;
//   a row rises ONCE: from the first beat at or after the row's own time, for POP_BEATS beats, on the GENESIS grid (the one grid every glass has, whatever
//   song its own figure rides): the same instants on every glass, because the row's time and the house clock are the same on every glass. A row is taken
//   once by its id (a replay of the stream, a second read, a later rev that still lists it: nothing); a row whose time is before this glass's first picture
//   never rises (history); one whose rise is already over is at rest;
//   Blobby is in her unless the Nest says a Harmony claims him (house/blobby where: 'harmony'): then he rides his unit1 (CHAIR); a number rises from his
//   feet, and from the liquid's surface while he is away;
//   THE ONE IN THE MIDDLE: at home the one in the flask stands in a round window at her unit0's centre (windowOf: WINDOW.r of its radius), the liquor in
//   front of it under its surface, the balance right under it; on his unit1 he is the sprite he always was;
//   he crosses ONCE per move: from the first beat at or after the move's own time (the ref's since_ms) for CROSS_BEATS beats, the first half where he
//   leaves (the black hole), the second where he arrives (the white hole): crossNote, crossPhase, crossAt. A move from before this glass's first
//   picture, or heard before the glass has a time, or whose crossing is already over, is at rest; a word that names the place he already has (a second
//   Mac's claim, the first of two let go) moves nothing; a move while a crossing is in the air turns it back from its own beat.
//   Every moving thing is a function of the house time handed in: no clock and no timer of its own.
//
// COST: nothing until a purse stands. The law per sample: one level, a few sines: about 2 us. The 2D painter: at rest 20 pictures a second whatever its
// host's rate (one canvas the size of unit0's disc, about 150 css px, and a transform on Blobby and on the balance, moved on the compositor); every
// picture only while a number or a crossing is in the air; a style is written only when it changed. HIS RIDE: nothing while he is home (the host is not
// even asked for his unit1). While a Harmony claims him: one projection and one transform of his layer per paint of the engine (the layout is the
// engine's own, handed by its paint, never computed again), one more drawImage a frame on the page that renders her. It imports the one page's law
// alone (one-law.mjs, already there).
import { GENESIS_MS, GENESIS_BEAT_MS, BEATS_PER_BAR, smooth } from './one-law.mjs';
import { createFuel, REPLAY_CAUSES } from './fuel-fluid.mjs';
import { tintOf } from './one-sea.mjs';   // the house's one name for a seat's colour (the devices' totems, the unit1s' totems, the Spool Board's seats)
import { SETTINGS_REF, moneyShown } from './nest-settings.mjs';   // THE NEST HOLDS THE SETTINGS (Oct 29 2026): house/settings money hides the dollar amounts on every glass

export const PURSE_REF = 'house/purse', PURSE_SCHEMA = 'embertide.purse/v1';   // tools/embertide-mesh/lib/house-purse.mjs's own (the test holds the two together)
export const BLOBBY_REF = 'house/blobby', BLOBBY_SCHEMA = 'embertide.blobby/v1';   // tools/embertide-mesh/lib/house-blobby.mjs's own (held together by the test too)
export const DROPS_REF = 'mint/drops', DROPS_SCHEMA = 'embertide.mint-drops/v1';   // tools/embertide-mesh/lib/mint-drops.mjs's own: the mint's sales as drops (Oct 14 2026)
export const PURSE_REFS = Object.freeze([PURSE_REF, BLOBBY_REF, DROPS_REF, SETTINGS_REF]);   // and the Nest's settings (Oct 29 2026): every host reads them with the purse
// WHO IS IN THE FLASK (Oct 28 2026 20:4x UTC, his words over her flask on his Mac, Blobby in it: "wtf? just focus on the flask dude:... why the fuck dont you make
// arrows to cycle blobby or houndoom or any other shit there? u get what i mean or not?"). Who stands in her unit0 is ONE fact on the Nest, house/flask {schema,
// who, at, by}: every glass that draws the flask wears it (both painters below), and the glass whose hand reaches the flask (the Mac's corner, one-corner.mjs)
// writes it by compare-and-swap at his press on an arrow. The cast is Blobby as the flask has always drawn him (drawBlobby, the default when the Nest says
// nothing), then the party's own portraits (ui/intro/assets/party, one look for the whole party, his Oct 28 word to that lane): Houndoom first after him (his
// words), then the roster's companions and tools that have a face. No portrait of HER: she is one (COMPANION IS ONE), on her perch over the flask.
export const FLASK_REF = 'house/flask', FLASK_SCHEMA = 'embertide.flask/v1', BALL_REF = 'house/ball', BALL_SCHEMA = 'embertide.ball/1', SWALLOW_MS = 1800, SAID_MS = 20000;   // HER BALL SWALLOWS WHAT HE THROWS (Nov 25 2026, his 19:48 UTC "that fucking ball she got is supposed to show the fucking sucking suction shit"): house/ball, the motor's word of each throw ({n, in_at, state, line, part}, embertide-vacuum take.rs ball_value); the swallow lasts SWALLOW_MS from in_at, her line stands SAID_MS from read_at
export const FLASK_CAST = Object.freeze([
  Object.freeze({ id: 'blobby', name: 'Blobby', art: null }),
  Object.freeze({ id: 'houndoom', name: 'Houndoom', art: '../assets/party/houndoom.png' }),
  Object.freeze({ id: 'aiolos', name: 'Aiolos', art: '../assets/party/aiolos-gold-knight.png' }),
  Object.freeze({ id: 'the-eye', name: 'Gorgia', art: '../assets/party/gorgia.png' }),   // the golem "the eye behind you": its id is no seat of a room (the any-room gate)
  Object.freeze({ id: 'winds', name: 'Latios & Latias', art: '../assets/party/winds.png' }),
  Object.freeze({ id: 'lily', name: 'Lily', art: '../assets/party/lily.png' }),
  Object.freeze({ id: 'curiae', name: 'The curiae', art: '../assets/party/curiae.png' }),
]);
export const FLASK_HAND = 'flaskHand';            // the page's dataset key (documentElement.dataset.flaskHand = '1'): a host whose hand reaches the flask; the arrows are drawn only there
export const FLASK_HELD = 'flaskHeld';            // ONLY WHILE SHE HOLDS (his Oct 28 2026 21:1x UTC, "make the arrows appear only when she is on hold"): the host says she holds still (documentElement.dataset.flaskHeld = '1': docked or dropped, not following his pointer, not under his drag); the arrows show then alone (ARROW_RULES, the browser's own selector: nothing at rest)
export const FLASK_ARROW = 'data-flask-arrow';
export const FLASK_WINDOW = 'data-flask-window';   // THE CIRCLE TAKES HIS PRESS (Oct 28 2026 22:1x UTC): his window at home, where his hand reaches the flask: the circle's share of its layer's half side    // an arrow's attribute: -1 or 1; data-flask-next: who comes on it; data-flask-rev: the fact's rev it was drawn under (the write's expect)
/** flaskWhoOf(value): who the Nest's house/flask puts in the flask: one of the cast, else the first (Blobby). Pure. */
export const flaskWhoOf = (value) => { const w = value && typeof value === 'object' && value.schema === FLASK_SCHEMA && typeof value.who === 'string' ? value.who : null; return FLASK_CAST.some((c) => c.id === w) ? w : FLASK_CAST[0].id; };
/** nextWho(id, dir): the one after (dir 1) or before (dir -1) in the cast, round. Pure. */
export const nextWho = (id, dir) => { const n = FLASK_CAST.length, i = Math.max(0, FLASK_CAST.findIndex((c) => c.id === id)); return FLASK_CAST[(((i + (dir < 0 ? -1 : 1)) % n) + n) % n].id; };
/** flaskValue(who, at, by): the fact as a glass writes it. Pure. */
export const flaskValue = (who, at, by) => ({ schema: FLASK_SCHEMA, who, at, by });
const castOf = (who) => FLASK_CAST.find((c) => c.id === who) || FLASK_CAST[0];
const ART = new Map();   // a portrait's picture, decoded once a page: src -> Promise<image | null>
function artOf(doc, cast) {
  const I = doc && doc.defaultView && typeof doc.defaultView.Image === 'function' ? doc.defaultView.Image : null; if (!I || !cast.art) return Promise.resolve(null);
  const src = new URL(cast.art, import.meta.url).href; if (ART.has(src)) return ART.get(src);
  const img = new I(); img.decoding = 'async'; img.src = src;
  const p = (typeof img.decode === 'function' ? img.decode() : new Promise((ok, no) => { img.onload = ok; img.onerror = no; })).then(() => img, () => null); ART.set(src, p); return p;
}
/** drawPortrait(canvas, img): a portrait in the sprite's shape (90 x 78): standing on his feet's row (63 of 78) as Blobby's body does, its pixels kept (a pixel
 *  portrait never smoothed). false when the canvas cannot draw. */
export function drawPortrait(c, img) {
  const x = c?.getContext?.('2d'); if (!x || !img) return false;
  const k = c.width / 90; x.setTransform(k, 0, 0, k, 0, 0); x.clearRect(0, 0, 90, 78);
  const h = 63, w = h * ((img.naturalWidth || img.width || 314) / (img.naturalHeight || img.height || 320));
  x.imageSmoothingEnabled = false; x.drawImage(img, (90 - w) / 2, 0, w, h); return true;
}
/** handOf(doc): the page says his hand reaches the flask (documentElement.dataset.flaskHand = '1', the Mac's corner): the arrows are drawn. */
const handOf = (doc) => { try { return !!(doc && doc.documentElement && doc.documentElement.dataset && doc.documentElement.dataset[FLASK_HAND] === '1'); } catch { return false; } };
export const ARROW_PX = 22;
const WORD_CSS = 'white-space:nowrap;font-weight:700;font-size:11px;line-height:1.2;color:#e8c46a;transform-origin:50% 0;text-shadow:0 0 .1em rgba(0,0,0,.9),0 .083em .167em rgba(0,0,0,.9);';   // THE ASK IS IN THE FLASK: an answer's word under its arrow (only words he acts on)
const ARROW_CSS = `width:${ARROW_PX}px;height:${ARROW_PX}px;transform-origin:50% 50%;border-radius:50%;background:rgba(14,12,10,.62);box-shadow:inset 0 0 0 1px rgba(201,161,74,.8);color:#e8c46a;`
  + `font:700 17px/${ARROW_PX - 1}px -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;text-align:center;user-select:none;-webkit-user-select:none;pointer-events:auto;cursor:pointer;`;
const ARROW_STYLE = 'purse-flask-arrows';   // the rules this page needs for them: shown only while she holds (FLASK_HELD), brighter under his pointer (the browser's own :hover, nothing at rest) and under his press ([data-down], one-corner.mjs: on his Mac's overlay a cover takes the hover)
export const ARROW_RULES = '.purse-flask-arrow{opacity:.72;transition:opacity .12s}.purse-flask-arrow:hover,.purse-flask-arrow[data-down]{opacity:1;background:rgba(14,12,10,.82)}'
  + '[data-flask-window][data-down]{filter:brightness(1.15)}'
  + 'html:not([data-flask-held="1"]) .purse-flask-arrow{visibility:hidden!important;pointer-events:none!important}';
function arrowStyle(doc) {
  try { if (!doc.head || (typeof doc.getElementById === 'function' && doc.getElementById(ARROW_STYLE))) return; const st = doc.createElement('style'); st.id = ARROW_STYLE;
    st.textContent = ARROW_RULES; doc.head.append(st); } catch { /* no head */ }
}
/** wearOn(doc, canvas, who, done): the one in the flask on a sprite canvas: Blobby drawn at once; a portrait once decoded (the picture before it stands till
 *  then), done() called when it lands. The caller keeps which it asked for (a later ask wins: an earlier portrait that lands late is not drawn). */
function wearOn(doc, c, who, still, done = null) {
  const cast = castOf(who);
  if (!cast.art) { drawBlobby(c); if (done) done(); return; }
  artOf(doc, cast).then((img) => { if (img && still() && drawPortrait(c, img) && done) done(); }).catch(() => {});
}      // what the one page reads and follows for her (one.mjs): one stream for the three
export const GRID = Object.freeze({ epoch_ms: GENESIS_MS, beat_ms: GENESIS_BEAT_MS, beats_per_bar: BEATS_PER_BAR });   // the purse's instants stand on the genesis grid
export const LEVEL_BEATS = 4;                      // a level change pours over a bar
export const POP_BEATS = 3, POP_STAGGER = 0.25;    // a number rises for three beats (1.8 s; the old painter's 1.7 s); rows of one beat leave a quarter beat apart
export const POPS_MAX = 12, DROP_BEATS = 1;        // twelve numbers in the air at most (the old painter's); the balance's pulse on a drop lasts a beat
export const R_2D = 0.97;                          // the liquid's disc, of unit0's projected radius (cloud.js)
export const PAINT_MS = 50;                        // the 2D painter's cadence: the ale at 20 pictures a second (cloud.js THE CADENCE)
export const MIN_PX = Object.freeze({ balance: 10, held: 9, number: 11 });   // the 2D painter's text is never smaller than this on the glass itself: on a small glass her unit0 is a few pixels wide and the money must still be read
/** Blobby against unit0's radius (the old painter: a 66 x 57 px sprite at .62 in a disc of 60 px): his width and height, his feet's row in the sprite
 *  (blobby.js: 63 of 78), and his height from the feet to the sprite's top. */
export const BLOBBY = Object.freeze({ w: 0.682, h: 0.589, feet: 63 / 78, tall: 0.475 });
/** His own unit1: chair 8 of her unit0 (roma-engine.js CANON.CHILDREN; harmony-aiolos.mjs BLOBBY; his Sept 21 "its own uniquely assigned unit1"). */
export const CHAIR = Object.freeze({ unit0: 'ROMA·0', seat: 8, unit1: 'COLLEGIUM·PONTIFICUM' });
export const TOTEM = Object.freeze({ w: 0.62, tall: 0.62 });   // THE SEAT STALLED ON HIS WORD: its totem at the centre, a disc TOTEM.w of unit0's radius wide (Blobby is .682 of it), its height over its feet
export const ASK_SHOWN = 64;                                   // the question on the glass: this many characters, then an ellipsis (the ref carries ASK_MAX)
/** Blobby on his unit1, against that chamber's projected radius (the old painter's rideFrame: 2.5 radii wide, standing on its top): his width, how far
 *  into its top his feet stand, and how much of him shows while his unit1 passes in front of her unit0. The engine ghosts a chamber there at .16 so that
 *  "unit0 is never hidden" (its xray); his unit1 rides close around her, so he is in front of her for about a third of its loop: at .16 he would be all
 *  but gone for it. He keeps nearly half of himself, and her unit0 with what she carries is still seen through him. */
export const RIDE = Object.freeze({ w: 2.5, sink: 0.1, ghost: 0.45 });
export const CROSS_BEATS = 3;                      // a crossing lasts three beats, as a number's rise: 0.9 s for the hole that takes him and 0.9 s for the hole that gives him (the old painter's .95 s holes, its rider out in .8 s and in in .9 s)
/** A hole at its widest, of his width where it opens (the old painter's 56 and 64 px over a rider of about 38); how far its glow reaches, of its radius;
 *  how far under his feet its middle opens, of his width (on his unit1 that is the unit1's own centre: the old painter's holeAt); and how much of its
 *  radius the black one's dark takes (on his unit1: the unit1 itself, a little over). */
export const HOLE = Object.freeze({ black: 0.75, white: 0.85, glow: 1.6, under: (1 - RIDE.sink) / RIDE.w, dark: 0.58 });
export const INK = Object.freeze({ gold: 0xd8b674, muted: 0x95958e, drop: 0xff7a5c, burn: 0xffb347, astra: 0x55c6cb, sol: 0xc9a3ff });   // ui.css: --gold, --muted, .balance.drop, .burn, .burn.lane-astra, .burn.lane-sol
const num = (v) => typeof v === 'number' && Number.isFinite(v), clamp01 = (v) => Math.max(0, Math.min(1, v));
const byTime = (a, b) => a.at_ms - b.at_ms || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
const beatAfter = (ms) => Math.ceil((ms - GRID.epoch_ms) / GRID.beat_ms), beatTime = (beat) => GRID.epoch_ms + beat * GRID.beat_ms;
// The causal law is ready before a purse can accept causes. Only its painter loads on demand:
// a slow shader import may delay a picture, but cannot turn an active cause into resting composition.
const FLUID = { gl: null, asked: false };
function fluidModules() {
  if (!FLUID.asked) { FLUID.asked = true; import('./fuel-fluid-gl.mjs').then((m) => { FLUID.gl = m; }, () => { FLUID.gl = false; }); }
  return FLUID;
}

/** readPurse(value): the ref's value as a glass reads it: {posted, reserved, level, full, at_ms, burns (oldest first)}; null when it is not a purse. */
export function readPurse(v) {
  if (!v || typeof v !== 'object' || v.schema !== PURSE_SCHEMA) return null;
  const burns = [];
  for (const b of Array.isArray(v.burns) ? v.burns : []) {
    if (!b || typeof b.id !== 'string' || !b.id || !num(b.at_ms) || !num(b.cost_usd) || b.cost_usd < 0) continue;
    burns.push({ id: b.id, at_ms: b.at_ms, cost_usd: b.cost_usd, in: num(b.in) && b.in >= 0 ? b.in : null, lane: typeof b.lane === 'string' ? b.lane.replace(/[^a-z0-9-]/gi, '').toLowerCase() : null });
  }
  burns.sort(byTime);
  return { posted: num(v.posted_usd) && v.posted_usd >= 0 ? v.posted_usd : null, reserved: num(v.reserved_usd) && v.reserved_usd >= 0.01 ? v.reserved_usd : 0,
    level: num(v.level) ? clamp01(v.level) : null, full: num(v.full_usd) ? v.full_usd : null, at_ms: num(v.ledger?.at_ms) ? v.ledger.at_ms : null, burns };
}
/** readBlobby(value): where Blobby is, as the ref house/blobby says it: {where: 'overlay' | 'harmony', mac, since_ms}; null when it is not that ref's value
 *  (no ref, another schema, a place it does not name): then nothing is known against him standing in her. */
export function readBlobby(v) {
  if (!v || typeof v !== 'object' || v.schema !== BLOBBY_SCHEMA || (v.where !== 'harmony' && v.where !== 'overlay')) return null;
  return { where: v.where, mac: typeof v.mac === 'string' ? v.mac : null, since_ms: num(v.since_ms) ? v.since_ms : null };
}
/** readDrops(value): the mint's sales as the ref mint/drops lists them, oldest first: [{id, at_ms, metal: 'gold' | 'bronze', usd}]; [] when it is not that
 *  ref's value. A Golden Aiolos sale is a gold drop (the hexagon with gravity), a Bronze sale a bronze one (the floating hexagon): fuel-fluid.mjs. */
export function readDrops(v) {
  if (!v || typeof v !== 'object' || v.schema !== DROPS_SCHEMA || !Array.isArray(v.drops)) return [];
  const out = []; for (const d of v.drops) if (d && typeof d.id === 'string' && d.id && num(d.at_ms) && (d.metal === 'gold' || d.metal === 'bronze')) out.push({ id: d.id, at_ms: d.at_ms, metal: d.metal, usd: num(d.usd) ? d.usd : null });
  return out.sort(byTime);
}
/** liquidOf(level, R, top): the surface inside unit0 for a tank level in [0, 1]: its height over unit0's centre (the tank's floor at 0, its top at 1,
 *  linear between: the old painter's gauge) and the radius of the disc it cuts there. top: the tank's ceiling over the centre where something sits on the
 *  crown and hides the shell's own top (the girl, on Harmony's engine): a full tank then reaches her feet, so the level can be read on what is seen of
 *  unit0 (with the whole shell as the gauge a tank at 0.78 read as full to the rim). None: the shell's top. null without a level: no level, no liquid. */
export function liquidOf(level, R, top = R) {
  if (!num(level)) return null;
  const l = clamp01(level), cap = Math.min(R, num(top) ? top : R), y = -R + (cap + R) * l;
  return { level: l, y, r: Math.sqrt(Math.max(0, R * R - y * y)) };
}
/** tiltAt(now_ms): the surface's two slopes, a slow slosh (the old painter's .05 sin(t / 1900), and a smaller one across it): the house time's, so the ale
 *  leans the same way on every glass. */
export const tiltAt = (ms) => [0.05 * Math.sin(ms / 1900), 0.03 * Math.sin(ms / 2700 + 1)];
/** THE ONE IN THE MIDDLE (his Oct 28 2026 21:4x UTC, over the flask on his Mac: "brom make the shits 2x large, i cant see them... keep the same bottom and just
 *  grow up", then "or better! why dont you go in otpimsm.fit mint page and you have a look at the liquor thing there? ... a circle in there can be mimicked as
 *  ux for our flask... meaning, imagine if the sprite was just in the "middle" circularly..."): as the mint's flask holds the anime in a circle at its middle
 *  with the liquor in front of him (dyson-society/app/dl-mint-flask.js, THE LIQUOR IN FRONT OF HIM), the one in the flask stands at home in a round window at
 *  her unit0's centre, WINDOW.r of its radius (about twice the sprite that stood on the ale): a portrait's bust fills it, Blobby stands whole in it, its glass
 *  a pale cool blue (the gold of a portrait and the ink of another both stand out on it), its ring gold, and under the liquor's surface he is seen through a
 *  light veil of it (he stays readable: the flask is mostly full). windowOf(rho, top): its centre's height over unit0's centre and its radius: lowered
 *  under a low ceiling (top: something on the crown covers the shell's top, the girl on Harmony's engine; WINDOW.gap of the old pixels under it), kept over
 *  the floor with the balance's room under it (WINDOW.room of them), smaller only where both cannot hold. Pure. */
export const WINDOW = Object.freeze({ r: 0.5, room: 20, gap: 4 });
export function windowOf(rho, top = rho) {
  const u = rho / 60, roof = Math.min(rho, num(top) ? top : rho) - WINDOW.gap * u, floor = -rho + WINDOW.room * u;
  const r = Math.max(0, Math.min(WINDOW.r * rho, (roof - floor) / 2));
  return { y: Math.max(floor + r, Math.min(0, roof - r)), r };
}
export const balanceText = (usd) => (num(usd) ? '$' + usd.toFixed(2) : '');
export const heldText = (usd) => (num(usd) && usd >= 0.01 ? '−$' + usd.toFixed(2) + ' in flight' : '');
/** popText(row): the old painter's damage number: "-$0.13 · 37k" (three decimals under a cent; the tokens in, in thousands from a thousand up). */
export function popText(row) {
  const c = row.cost_usd, t = num(row.in) ? (row.in >= 1000 ? Math.round(row.in / 1000) + 'k' : String(Math.round(row.in))) : '';
  return '-$' + (c < 0.01 ? c.toFixed(3) : c.toFixed(2)) + (t ? ' · ' + t : '');
}
export const popBig = (row) => row.cost_usd >= 0.5;
export const popColor = (row) => (row.lane === 'astra' ? INK.astra : row.lane === 'sol' ? INK.sol : popBig(row) ? INK.drop : INK.burn);
/** popNote(row, rows): the note a row sounds as: from the first genesis beat at or after the row's own time, the rows that share that beat a quarter beat
 *  apart in the order of their times (so every glass gives each the same instant), for POP_BEATS beats. */
export function popNote(row, rows) {
  const beat = beatAfter(row.at_ms), n = rows.filter((x) => beatAfter(x.at_ms) === beat && byTime(x, row) < 0).length;
  return { id: row.id, t0: beatTime(beat + n * POP_STAGGER), len: POP_BEATS * GRID.beat_ms, n, text: popText(row), color: popColor(row), big: popBig(row) };
}
/** popAt(note, now_ms, rho, span): where a rising number is: null before its instant and after its last; else {k, rise (over his feet, in rho's unit),
 *  scale, alpha}. The old painter's keyframes (burn-rise): it appears just under his feet, swells to 1.3 at 14 %, is itself at 30 %, and climbs 52 of the old
 *  pixels; span < 1 shortens the climb (a lid over him). It is whole until 55 % and fades from there: the old one faded all the way up over a dark desktop;
 *  here it rises over ivory, amber and him, and has to be read. */
export function popAt(note, now, rho, span = 1) {
  const k = (now - note.t0) / note.len; if (!(k >= 0) || k >= 1) return null;
  const out = (u) => 1 - (1 - u) * (1 - u); let px, scale;
  if (k < 0.14) { const u = out(k / 0.14); px = -6 + 10 * u; scale = 0.7 + 0.6 * u; }
  else if (k < 0.3) { const u = out((k - 0.14) / 0.16); px = 4 + 6 * u; scale = 1.3 - 0.3 * u; }
  else { const u = out((k - 0.3) / 0.7); px = 10 + 42 * u; scale = 1 - 0.05 * u; }
  return { k, rise: (-6 + (px + 6) * span) * rho / 60, scale, alpha: k < 0.14 ? k / 0.14 : k < 0.55 ? 1 : 1 - (k - 0.55) / 0.45 };
}

// ---- where he rides, and the crossing (his Sept 21 "teleport with a magic blackhole into a whitehole onto its own uniquely assigned unit1") ----
/** placeOf(where, stall): which of his two places a reading of the ref names: 'seat' (his unit1) while a Harmony claims him or a stalled seat stands at the
 *  centre of her unit0 (THE SEAT STALLED ON HIS WORD), else 'home' (inside her unit0). */
export const placeOf = (w, stall = null) => ((w && w.where === 'harmony') || stall ? 'seat' : 'home');
/** initialsOf(name): the two letters a seat's totem carries, as the Spool Board's seats do (the first letter of its first two words). */
export const initialsOf = (name) => String(name || '').split(/[-\s_]+/).map((w) => w[0] || '').join('').slice(0, 2).toUpperCase() || '?';
/** stallOf(list): the seat at the centre, from the law's stalled list (room-board-state.mjs stalledOf: the one that has waited longest first): { seat, name, text, at, blocked, tint, initials } or null. */
export function stallOf(list) {
  const f = Array.isArray(list) && list.length ? list[0] : null;
  if (!f || typeof f.seat !== 'string' || !f.seat || !f.ask || typeof f.ask.text !== 'string' || !f.ask.text || !num(f.ask.at)) return null;
  const name = typeof f.name === 'string' && f.name ? f.name : f.seat;
  const choices = Array.isArray(f.ask.choices) ? f.ask.choices.filter((c) => typeof c === 'string' && c.trim()).map((c) => c.trim()).slice(0, 2) : [];   // THE ASK IS IN THE FLASK: its answers, the arrows' words
  return { seat: f.seat, name, text: f.ask.text, at: f.ask.at, blocked: f.ask.blocked === true, tint: tintOf(f.seat), initials: initialsOf(name), choices };
}
export const askShown = (text) => (typeof text === 'string' && text.length > ASK_SHOWN ? text.slice(0, ASK_SHOWN - 1).trimEnd() + '\u2026' : text || '');
/** bez(x1, y1, x2, y2): a CSS cubic-bezier as a function of its time in [0, 1] (the old painter's own curves), solved by halving: the same on every glass. */
function bez(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  return (u) => {
    if (!(u > 0)) return 0; if (u >= 1) return 1;
    let lo = 0, hi = 1, t = u;
    for (let i = 0; i < 32; i++) { const x = ((ax * t + bx) * t + cx) * t; if (Math.abs(x - u) < 1e-7) break; if (x < u) lo = t; else hi = t; t = (lo + hi) / 2; }
    return ((ay * t + by) * t + cy) * t;
  };
}
const EASE_IN = bez(0.42, 0, 1, 1), EASE_OUT = bez(0, 0, 0.58, 1), RIDER_OUT = bez(0.55, 0, 0.85, 0.35), RIDER_IN = bez(0.22, 0.9, 0.32, 1.18);   // harmony.html: hole-black ease-in, hole-white ease-out, rider-out, rider-in
const GONE = 0.8 / 0.95, WHOLE = 0.9 / 0.95;   // he is gone before the black hole closes, and whole before the white one does (the old painter's .8 and .9 s under holes of .95 s)
/** crossNote(since_ms, from, to): the crossing a move sounds as: from the first genesis beat at or after the move's own time (the ref's since_ms: the
 *  same number on every glass), for CROSS_BEATS beats, from the place he leaves to the place he arrives. turns: the beats at which it turned back. */
export function crossNote(since_ms, from, to) { return { since_ms, from, to, t0: beatTime(beatAfter(since_ms)), len: CROSS_BEATS * GRID.beat_ms, turns: [] }; }
/** crossPhase(note, now_ms): how far the crossing is at the house time now: k from 0 (where he leaves) to 1 (where he arrives), forward from its beat and
 *  turned back at each of its turns (a move while it is in the air: with two places that is the way back). over: null while it is in the air or not yet
 *  begun, 'to' once he has arrived, 'from' once a turn brought him back. */
export function crossPhase(c, now) {
  let k = 0, t = c.t0, dir = 1;
  for (const tb of c.turns) { if (tb > now) break; k += dir * (tb - t) / c.len; t = tb; dir = -dir; }
  if (now > t) k += dir * (now - t) / c.len;
  return k >= 1 ? { k: 1, over: 'to' } : k <= 0 && dir < 0 ? { k: 0, over: 'from' } : { k: Math.max(0, k), over: null };
}
/** crossAt(k): the crossing at phase k of [0, 1): its first half is the black hole where he leaves, its second the white hole where he arrives. The hole:
 *  its radius of its widest and its alpha (the old painter's hole-black and hole-white: nothing, widest at 40 %, nothing). Him: his scale, his turn about
 *  his feet (rad) and his alpha (its rider-out: he shrinks to nothing turning a turn and a half; its rider-in: he grows from nothing turning back, a
 *  little past his size, and settles). */
export function crossAt(k) {
  if (k < 0.5) { const u = k / 0.5, e = RIDER_OUT(Math.min(1, u / GONE)), h = u < 0.4 ? EASE_IN(u / 0.4) : 1 - EASE_IN((u - 0.4) / 0.6);
    return { k, half: 'leave', scale: 1 - e, turn: 3 * Math.PI * e, alpha: 1 - e, hole: { kind: 'black', size: h, alpha: h } }; }
  const v = (k - 0.5) / 0.5, e = RIDER_IN(Math.min(1, v / WHOLE)), h = v < 0.4 ? EASE_OUT(v / 0.4) : 1 - EASE_OUT((v - 0.4) / 0.6);
  return { k, half: 'arrive', scale: e, turn: -3 * Math.PI * (1 - e), alpha: clamp01(e), hole: { kind: 'white', size: h, alpha: h } };
}
/** riderOf(f, d, seat): where the one wizard and the one hole stand in the square's px for frame f. d: her unit0's disc there ({x, y, r}); seat: his
 *  unit1's projected disc there as the host's engine painted it ({x, y, r, depth: -1 the near side of its orbit, 1 the far side}), null when the host
 *  hands none. One law for both painters.
 *  -> { blobby: { at: 'home' | 'seat', x, y (his feet), w, h, lean, turn, scale, alpha } | null, hole: { at, kind, x, y, r, R (at its widest), alpha } | null }
 *  HOME: his window (THE ONE IN THE MIDDLE: windowOf; w and h its diameter, x and y its floor's middle, upright: window true); the hole of a crossing opens
 *  behind it, at its centre and of its width (it turns and shrinks into the black hole, grows out of the white one), inside her unit0 (never with its dark under the
 *  shell's floor). SEAT: standing on his unit1, RIDE.w of its radius wide (the old painter's rideFrame); the hole opens on the unit1 itself (its
 *  holeAt): under his feet by the same share of his width. So in both places his feet are in the hole and the rest of him is seen over it. He is seen as
 *  his mount is seen: behind her unit0 he is hidden with it; in front of it he is a ghost (RIDE.ghost), as the engine ghosts his unit1 there so that
 *  unit0 (and what she carries in it) is never hidden. The hole is seen whole wherever it opens: the crossing is never hidden. */
export function riderOf(f, d, seat = null) {
  const c = f.cross, sc = c ? c.scale : 1, turn = c ? c.turn : 0, al = c ? c.alpha : 1; let blobby = null, hole = null, totem = null, totemHole = null;
  if (f.totem && f.totem.alpha > 0) {   // THE SEAT STALLED ON HIS WORD: its totem stands where Blobby stood, on the ale; its hole (the white one it comes from, the black one that takes it) under its feet, inside her unit0
    const t = f.totem, w = TOTEM.w * d.r, h = TOTEM.tall * d.r;
    totem = { seat: t.seat, name: t.name, initials: t.initials, tint: t.tint, blocked: t.blocked, x: d.x, y: d.y - f.feet, w, h, lean: Math.atan(f.tilt[0]) * 0.9, turn: t.turn, scale: t.scale, alpha: t.alpha };
    if (t.hole && t.hole.size > 0) { const R = HOLE[t.hole.kind] * w; totemHole = { at: 'home', kind: t.hole.kind, x: d.x, y: d.y - Math.max(f.feet - HOLE.under * w, -d.r + HOLE.dark * R), r: R * t.hole.size, R, alpha: t.hole.alpha }; }
  }
  if (f.blobby) {
    const r = f.window && num(f.window.r) ? f.window.r : WINDOW.r * d.r, wy = f.feet + r, w = 2 * r; blobby = { at: 'home', x: d.x, y: d.y - f.feet, w, h: w, lean: 0, turn, scale: sc, alpha: al, window: true };
    if (c && c.hole.size > 0) { const R = HOLE[c.hole.kind] * w; hole = { at: 'home', kind: c.hole.kind, x: d.x, y: d.y - Math.max(wy, -d.r + HOLE.dark * R), r: R * c.hole.size, R, alpha: c.hole.alpha }; }   // behind his window, at its centre
  } else if (f.rides && seat && num(seat.x) && num(seat.y) && seat.r > 0.5) {
    const w = RIDE.w * seat.r, h = w * BLOBBY.h / BLOBBY.w, y = seat.y - seat.r * (1 - RIDE.sink);
    const over = 1 - smooth((Math.hypot(seat.x - d.x, y - 0.45 * h - d.y) - d.r) / (0.5 * w));   // 1 while his middle stands over her unit0's disc, 0 clear of it by half his width
    blobby = { at: 'seat', x: seat.x, y, w, h, lean: 0, turn, scale: sc, alpha: al * (seat.depth > 0 ? 1 - over : 1 - over * (1 - RIDE.ghost)) };
    if (c && c.hole.size > 0) { const R = HOLE[c.hole.kind] * w; hole = { at: 'seat', kind: c.hole.kind, x: seat.x, y: seat.y, r: R * c.hole.size, R, alpha: c.hole.alpha }; }
  }
  return { blobby, hole, totem, totemHole };
}

/** createPurse() -> { take(value, {rev, now, ref}), mark(now), frame(now, rho, R), state() }: the law, with no painter.
 *  take: a cause (a ref read or pushed); ref: which of the two it is the value of (PURSE_REF when not said; BLOBBY_REF: where he is); now: the house time,
 *  null before this glass has one (what is read then stands at rest and is history).
 *  mark(now): this glass draws a picture on a real clock: the first one is its mount (rows older than it never rise).
 *  frame(now, rho, R, top, lid): what stands now, lengths in rho's unit (unit0's radius) and heights over unit0's centre, R the liquid's radius, top the
 *  ceiling over his window (windowOf), lid the height the numbers stay under (null: they rise free, out of the shell, as they did). null without a purse.
 *  Its blobby says whether he is drawn inside her unit0, its rides (CHAIR, or null) whether he is drawn on his unit1 (never both: he is one), its cross
 *  what a crossing in the air does to him and which hole is open where he is drawn (crossAt; null at rest), and its from the height a number rises from. */
export function createPurse() {
  const S = { money: true, srev: null, rev: null, purse: null, mount_ms: null, seen: new Set(), level: null, pour: null, drop: null, pops: [], brev: null, where: null, cross: [],
    fuel: null, composed: false, fuelLevel: null, wantLevel: null, drev: null, early: [], recovery: null, fuelBoundary: null, stall: null, gone: null, who: FLASK_CAST[0].id, named: false, frev: null };   // stall: the seat at the centre (stallOf); gone: the one leaving it while its crossing runs   // fuel: THE FUEL IS A FLUID (fuel-fluid.mjs), composed at rest from the latest level
  // and every sale so far once its module is here (fuelReady); every cause after that plays on its beat
  function fuelReady() {
    if (!S.fuel) S.fuel = createFuel();
    if (S.fuel && !S.composed && S.wantLevel != null) { S.fuel.compose(S.wantLevel, { drops: S.early }); S.composed = true; S.fuelLevel = S.wantLevel; S.early = []; }
    return S.composed ? S.fuel : null;
  }   // cross: the crossings this glass holds, in time: the one in the air (or waiting for its beat) first
  const counts = { takes: 0, replays: 0, popped: 0, history: 0, over: 0, places: 0, crossed: 0, turned: 0, rested: 0, stalls: 0 };
  const levelAt = (now) => (S.pour ? S.pour.from + (S.pour.to - S.pour.from) * smooth((now - S.pour.t0) / S.pour.len) : S.level);
  /** place(value, rev, now): where he is (the ref house/blobby), with its own revisions. Nothing rises and nothing pours for it. A word that names the
   *  place he already has moves nothing. A move sounds as ONE crossing, on its own since_ms (crossNote): at rest instead when this glass has no time yet,
   *  when the move is older than its first picture, or when its crossing is already over on the house clock; a move whose beat comes while a crossing is
   *  in the air turns that crossing back from that beat; one whose beat comes as the last crossing ends begins its own there (the one before it plays out). */
  const live = (now) => { while (S.cross.length && crossPhase(S.cross[0], now).over) S.cross.shift(); return S.cross[0] || null; };   // the crossing in the air at now (or waiting for its beat)
  function place(value, rev, now) {
    if (num(rev) && num(S.brev) && rev <= S.brev) { counts.replays++; return false; }
    if (num(rev)) S.brev = rev; counts.places++;
    const was = placeOf(S.where, S.stall); S.where = readBlobby(value); const is = placeOf(S.where, S.stall); if (is === was) return true;
    moveTo(was, is, S.where ? S.where.since_ms : null, num(now) && S.mount_ms != null ? now : null);
    return true;
  }
  /** moveTo(was, is, since, t): his move from one place to the other sounds as ONE crossing from the first genesis beat at or after `since` (the same number on
   *  every glass); at rest instead when this glass has no time yet (t null), when the move is older than its first picture, or when its crossing is already over
   *  on the house clock; a move whose beat comes while a crossing is in the air turns that crossing back from that beat; one whose beat comes as the last
   *  crossing ends begins its own there (the one before it plays out). */
  function moveTo(was, is, since, t) {
    if (t == null || !num(since) || since < S.mount_ms) { S.cross = []; counts.rested++; return; }   // history: he is where the ref says, and nothing is replayed
    live(t); const tb = beatTime(beatAfter(since)), last = S.cross[S.cross.length - 1], turning = !!last && !crossPhase(last, tb).over;
    if (turning) last.turns.push(Math.max(tb, last.t0, ...last.turns)); else S.cross.push(crossNote(since, was, is));
    const said = S.cross[S.cross.length - 1];
    if (crossPhase(said, t).over) { live(t); counts.rested++; }   // heard after its last instant (or turned back on the beat it began): at rest
    else if (turning) counts.turned++; else counts.crossed++;
  }
  /** stall(list, now): THE SEAT STALLED ON HIS WORD, the host's word of who waits (the law's list, room-board-state.mjs stalledOf; the first is the centre's).
   *  The same centre again moves nothing (false). A seat taking the centre: Blobby leaves for his unit1 and the totem comes in, one crossing from the beat after
   *  the ask's own moment (the same on every glass); the centre freed (his word came): the totem leaves and Blobby comes home, from the beat after `now`; a
   *  stall older than this glass's first picture, or heard with no house time yet, is at rest: the totem stands, he rides, nothing is replayed. One stalled seat
   *  giving way to another swaps the totem and moves him not at all. true when the centre changed. */
  function stall(list, now) {
    const next = stallOf(list), same = (a, b) => (!a && !b) || (!!a && !!b && a.seat === b.seat && a.text === b.text && a.at === b.at && a.blocked === b.blocked);
    if (same(S.stall, next)) return false;
    const t = num(now) && S.mount_ms != null ? now : null, was = placeOf(S.where, S.stall), swap = !!S.stall && !!next && S.stall.seat !== next.seat;
    S.gone = S.stall && !next && t != null ? { ...S.stall, left: t } : null;   // the one that leaves: it goes through the black hole while his crossing home runs; a swap is a cut
    S.stall = next; counts.stalls++;
    const is = placeOf(S.where, S.stall);
    if (is !== was && !swap) moveTo(was, is, next ? next.at : t, t);
    if (!S.cross.length) S.gone = null;   // at rest (history, or no time yet): nothing leaves slowly
    return true;
  }
  /** flask(value, rev): WHO IS IN THE FLASK, the ref house/flask with its own revisions: a replay moves nothing; true when the one in it changed. */
  function flask(value, rev) {
    if (num(rev) && num(S.frev) && rev <= S.frev) { counts.replays++; return false; }
    if (num(rev)) S.frev = rev;
    const w = flaskWhoOf(value), named = !!value && value.schema === FLASK_SCHEMA && value.who === w; if (w === S.who && named === S.named) return false; S.who = w; S.named = named; return true;   // NO ONE STANDS IN A FLASK THE NEST NAMES NO ONE FOR (Nov 19 2026, his "wtf is this shit?" over Blobby in a new person's flask): named says the Nest's house/flask names one of the cast
  }
  /** THE NEST HOLDS THE SETTINGS (Oct 29 2026): his word on the dollar amounts, the same on every glass (nest-settings.mjs money) */
  function settings(value, rev) {
    if (num(rev) && num(S.srev) && rev <= S.srev) { counts.replays++; return false; }
    if (num(rev)) S.srev = rev;
    const m = moneyShown(value); if (m === S.money) return false; S.money = m; return true;
  }
  function take(value, { rev = null, now = null, ref = PURSE_REF } = {}) {
    if (ref === BALL_REF) { const b = value && typeof value === 'object' && value.schema === BALL_SCHEMA && num(value.in_at) ? value : null, moved = JSON.stringify(b) !== JSON.stringify(S.ball || null); S.ball = b; return moved; } if (ref === FLASK_REF) return flask(value, rev);
    if (ref === SETTINGS_REF) return settings(value, rev);
    if (ref === BLOBBY_REF) return place(value, rev, now);
    if (ref === DROPS_REF) return drops(value, rev, now);
    if (num(rev) && num(S.rev) && rev <= S.rev) { counts.replays++; return false; }   // a replay of the stream, or a read no newer than what this glass holds: nothing moves
    if (S.recovery) { pendingRevision(PURSE_REF, rev); return false; }
    const p = readPurse(value), was = S.purse, t = num(now) && S.mount_ms != null ? now : null;   // before this glass's first picture nothing sounds: what it reads then is at rest
    if (p) {
      fluidModules();
      if (!S.composed && p.level != null) { S.wantLevel = p.level; fuelReady(); }
      if (S.composed) {
        if (num(S.fuelBoundary) && num(p.at_ms) && p.at_ms <= S.fuelBoundary && p.level != null && p.level !== S.fuelLevel) {
          S.recovery = { reason: 'checkpoint-conflict', ref: PURSE_REF, rev, cause: { at_ms: p.at_ms, kind: 'level', level: p.level } }; return false;
        }
        const causes = [];
        if (p.level != null && p.level !== S.fuelLevel) causes.push({ at_ms: num(p.at_ms) ? p.at_ms : t, kind: 'level', level: p.level });
        for (const b of p.burns) if (!S.seen.has(b.id) && t != null && b.at_ms >= S.mount_ms) causes.push({ at_ms: b.at_ms, kind: 'burn', id: b.id });
        for (const note of causes) if (!acceptFuel(note, t, PURSE_REF, rev)) return false;
      }
    }
    if (num(rev)) S.rev = rev; counts.takes++;
    S.purse = p;
    if (!p) { S.level = null; S.pour = null; S.drop = null; S.pops = []; return true; }           // the Nest holds no purse: nothing is drawn
    if (p.level == null || t == null || !was || S.level == null) { S.level = p.level; S.pour = null; }   // the first reading stands at rest (a cause already past is at rest)
    else if (p.level !== S.level) { S.pour = { from: levelAt(t), to: p.level, t0: beatTime(beatAfter(t)), len: LEVEL_BEATS * GRID.beat_ms }; S.level = p.level; }
    if (p.level != null) S.wantLevel = p.level; fluidModules(); const fuel = S.composed ? S.fuel : fuelReady();
    if (fuel && p.level != null && !(num(S.fuelBoundary) && num(p.at_ms) && p.at_ms <= S.fuelBoundary)) S.fuelLevel = p.level;   // the tank moved: its top burns, or a top-up pours
    if (t != null && was && num(was.posted) && num(p.posted) && p.posted < was.posted - 0.004) S.drop = { t0: beatTime(beatAfter(t)), len: DROP_BEATS * GRID.beat_ms };   // the balance fell: its pulse, from the next beat
    for (const b of p.burns) {
      if (S.seen.has(b.id)) continue; S.seen.add(b.id);                                             // a row is taken once, by its own id
      if (t == null || b.at_ms < S.mount_ms) { counts.history++; continue; }                        // on the Nest before this glass's first picture: history, never replayed
      const note = popNote(b, p.burns);
      if (t >= note.t0 + note.len) { counts.over++; continue; }                                     // its rise is already over on the house clock: at rest
      S.pops.push(note); counts.popped++;   // and its sparks fly from the fuel
    }
    if (S.pops.length > POPS_MAX) S.pops.splice(0, S.pops.length - POPS_MAX);
    if (S.seen.size > 512) S.seen = new Set(p.burns.map((b) => b.id));                              // only the rows the ref still lists can come again
    return true;
  }
  /** drops(value, rev, now): the mint's sales (the ref mint/drops). Each is taken once by its id: before the fluid is composed it waits to be part of the
   *  composition; a sale older than this glass's first picture is history (in her at rest); a newer one falls from its beat. */
  function drops(value, rev, now) {
    if (num(rev) && num(S.drev) && rev <= S.drev) { counts.replays++; return false; }
    if (S.recovery) { pendingRevision(DROPS_REF, rev); return false; }
    const list = readDrops(value), t = num(now) && S.mount_ms != null ? now : null; fluidModules();
    if (!S.composed) { S.early = list; fuelReady(); if (num(rev)) S.drev = rev; return true; }
    for (const d of list) if (!acceptFuel({ at_ms: d.at_ms, kind: 'drop', id: d.id, metal: d.metal }, t == null || d.at_ms < S.mount_ms ? null : t, DROPS_REF, rev)) return false;
    if (num(rev)) S.drev = rev;
    return true;
  }
  function pendingRevision(ref, rev) {
    if (!num(rev)) return;
    const key = ref === DROPS_REF ? 'dropsRevision' : 'purseRevision';
    S.recovery[key] = Math.max(S.recovery[key] ?? -Infinity, rev);
  }
  function acceptFuel(note, now, ref, rev) {
    if (num(S.fuelBoundary) && num(note.at_ms) && note.at_ms <= S.fuelBoundary) return true;
    if (S.fuel.cause(note, now)) return true;
    const failure = S.fuel.state().recovery;
    if (!failure && num(note.at_ms)) return true; // already accepted; same cause on a newer ref
    S.recovery = { ...(failure || { reason: 'missing-cause-time' }), ref, rev, cause: { ...note } }; pendingRevision(ref, rev);
    return false;
  }
  /** recoverFuel({checkpoint:{rest:true, at_ms, level, drops}, through_ms, causes}, {now}).
   * The host must obtain an authoritative REST checkpoint and a complete ordered causal suffix.
   * This validates shape and temporal coverage, not source authenticity/completeness. No upstream
   * recovery source is wired here. A latest purse level alone is never recovery evidence.
   * bundle.purse={value,rev} and drops_rev explicitly identify the authoritative current refs.
   * Their snapshot is committed only with successful recovery; older rejected refs cannot regress it. */
  function recoverFuel(bundle, { now } = {}) {
    const c = bundle?.checkpoint, list = bundle?.causes, through = bundle?.through_ms;
    const snapshot = bundle?.purse, p = readPurse(snapshot?.value), revision = snapshot?.rev, dropRevision = bundle?.drops_rev;
    if (!p || !Number.isSafeInteger(revision) || revision < 0 || (num(S.rev) && revision < S.rev)
      || (S.recovery?.ref === PURSE_REF && num(S.recovery.rev) && revision < S.recovery.rev)
      || (num(S.recovery?.purseRevision) && revision < S.recovery.purseRevision)
      || (num(S.recovery?.dropsRevision) && (!num(dropRevision) || dropRevision < S.recovery.dropsRevision))
      || (dropRevision != null && (!Number.isSafeInteger(dropRevision) || dropRevision < 0))
      || (num(S.drev) && (!num(dropRevision) || dropRevision < S.drev))
      || (S.recovery?.ref === DROPS_REF && num(S.recovery.rev) && (!num(dropRevision) || dropRevision < S.recovery.rev))) return false;
    if (!S.recovery || !c || c.rest !== true || !num(c.at_ms) || !num(c.level) || c.level < 0 || c.level > 1
      || !Array.isArray(c.drops) || !Array.isArray(list) || list.length > REPLAY_CAUSES || !num(through)
      || !num(now) || c.at_ms > now || through < now) return false;
    const ids = new Set();
    for (const d of c.drops) {
      if (!d || typeof d.id !== 'string' || !d.id || ids.has(d.id) || !['gold', 'bronze'].includes(d.metal)
        || !num(d.at_ms) || d.at_ms > c.at_ms) return false;
      ids.add(d.id);
    }
    const identity = (n) => n.kind + ':' + (num(n.seq) ? 'seq:' + n.seq : n.id || JSON.stringify([n.at_ms, n.level]));
    let last = c.at_ms, seq = -1, level = c.level, previous = null;
    for (const n of list) {
      if (!n || !num(n.at_ms) || n.at_ms <= c.at_ms || n.at_ms < last || n.at_ms > through
        || !['drop', 'level', 'burn'].includes(n.kind) || (n.seq != null && (!Number.isSafeInteger(n.seq) || n.seq < 0))
        || (n.at_ms === last && n.seq != null && n.seq < seq)) return false;
      if (n.kind === 'level') { if (!num(n.level) || n.level < 0 || n.level > 1) return false; if (n.at_ms <= now) level = n.level; }
      else if (typeof n.id !== 'string' || !n.id || (n.kind === 'drop' && !['gold', 'bronze'].includes(n.metal))) return false;
      if (previous && n.at_ms === previous.at_ms && ((previous.seq || 0) > (n.seq || 0)
        || ((previous.seq || 0) === (n.seq || 0) && identity(previous) > identity(n)))) return false;
      seq = n.seq ?? -1; last = n.at_ms; previous = n;
    }
    if (p.level !== level || !num(p.at_ms) || p.at_ms > through || p.burns.some((b) => b.at_ms > through
      || (b.at_ms > c.at_ms && !list.some((n) => n.kind === 'burn' && n.id === b.id && n.at_ms === b.at_ms)))) return false;
    const next = createFuel(); next.compose(c.level, { at_ms: c.at_ms, drops: c.drops });
    for (const n of list) if (!next.cause(n, now) || next.state().recovery) return false;
    next.view(now);
    S.fuel = next; S.composed = true; S.fuelLevel = level; S.wantLevel = level;
    S.fuelBoundary = c.at_ms; S.recovery = null;
    S.rev = revision; S.drev = dropRevision ?? S.drev; S.purse = p; S.level = p.level; S.pour = null; S.drop = null;
    S.seen = new Set(p.burns.map((b) => b.id));
    S.pops = p.burns.filter((b) => S.mount_ms != null && b.at_ms >= S.mount_ms).map((b) => popNote(b, p.burns))
      .filter((n) => now < n.t0 + n.len).slice(-POPS_MAX);
    return true;
  }
  function mark(now) { if (S.mount_ms == null && num(now)) S.mount_ms = now; }
  function frame(now, rho, R = rho * R_2D, top = rho, lid = null) {
    const p = S.purse; if (!num(now) || (!p && !S.stall && !S.gone)) return null;   // THE ASK IS IN THE FLASK (Nov 4 2026): a seat stalled on his word builds the window with no purse on the Nest: no liquid, no balance, its totem and its question
    if (S.pour && now >= S.pour.t0 + S.pour.len) S.pour = null;
    if (S.drop && now >= S.drop.t0 + S.drop.len) S.drop = null;
    const ended = S.pops.filter((n) => now >= n.t0 + n.len); if (ended.length) S.pops = S.pops.filter((n) => now < n.t0 + n.len);
    const u = rho / 60, liq = liquidOf(levelAt(now), R, top), tilt = liq ? tiltAt(now) : [0, 0];
    const win = windowOf(rho, top), feet = win.y - win.r;   // THE ONE IN THE MIDDLE: his feet are his window's floor; the window stands still, as the mint's circle does, and the liquor moves in front of it
    const dk = S.drop && now >= S.drop.t0 ? (now - S.drop.t0) / S.drop.len : null, pulse = dk == null ? 0 : dk < 0.25 ? dk / 0.25 : 1 - (dk - 0.25) / 0.75;
    const text = p ? balanceText(p.posted) : '', heldLine = text ? heldText(p.reserved) : '';
    const under = feet - 11 * u, over = under - 8 * u < -rho, balY = over ? feet + 2 * win.r + 10 * u : under;   // right below him; over his window when the shell's floor leaves no room
    // WHERE HE IS DRAWN: where the ref says (in her unless a Harmony claims him: then on his unit1), and while a crossing is in the air where the crossing
    // has him: where he leaves until the black hole has him, where he arrives from the white hole on; a move heard before its beat leaves him standing.
    // The balance stays where it stood. A number rises from his feet; while he is away, from the liquid's surface (never under the floor he would stand
    // on, never so near the lid that its shortest climb would pass it)
    let at = placeOf(S.where, S.stall), cross = null; const c = live(now);
    if (c && now < c.t0) at = c.from; else if (c) { cross = crossAt(crossPhase(c, now).k); at = cross.half === 'leave' ? c.from : c.to; }
    const here = at === 'home';
    // THE SEAT STALLED ON HIS WORD: the totem at the centre. Standing: whole. Coming in (his crossing home->seat): with the arrive half, from the white hole at
    // the centre, as he arrives on his unit1 from his. Leaving (his crossing seat->home, S.gone): with the leave half, into the black hole at the centre, as he
    // leaves his unit1 into his; gone once the arrive half begins. A stall with no crossing of his (he was away already, or history) stands whole at once.
    if (!c) S.gone = null;
    let totem = null; const who = S.stall || S.gone;
    if (who) {
      const inward = c && c.from === 'home' && c.to === 'seat', outward = c && c.from === 'seat' && c.to === 'home';
      if (S.stall && inward) totem = !cross || cross.half === 'leave' ? null : { ...who, scale: cross.scale, turn: cross.turn, alpha: cross.alpha, hole: cross.hole };
      else if (!S.stall && outward) totem = !cross ? { ...who, scale: 1, turn: 0, alpha: 1, hole: null } : cross.half === 'leave' ? { ...who, scale: cross.scale, turn: cross.turn, alpha: cross.alpha, hole: cross.hole } : null;
      else if (S.stall) totem = { ...who, scale: 1, turn: 0, alpha: 1, hole: null };
      if (!S.stall && !totem) S.gone = null;
    }
    const from = here || !liq ? feet : Math.max(-rho + 4 * u, Math.min(liq.y, num(lid) ? lid - (3 + 0.3 * 58) * u : liq.y));
    const span = num(lid) ? Math.max(0.3, Math.min(1, (lid - 9 * u - (from - 6 * u)) / (58 * u))) : 1;   // a number's middle stays half a line under the lid
    const pops = []; for (const n of S.pops) { const q = popAt(n, now, rho, span); if (q) pops.push({ id: n.id, text: n.text, color: n.color, big: n.big, k: q.k, y: from + q.rise, dx: ((n.n % 3) - 1) * 6 * u, scale: q.scale, alpha: q.alpha, note: n }); }
    return { money: S.money, recovery: !!S.recovery, now, rho, u, level: liq ? liq.level : null, surface: liq ? { y: liq.y, r: liq.r, R } : null, tilt, feet, window: win, fluid: S.recovery || !p ? null : (S.composed ? S.fuel : fuelReady()) ? S.fuel.view(now) : null, R, blobby: here && S.named, rides: here || !S.named ? null : CHAIR, cross, from, totem, ask: S.stall && totem && totem.alpha > 0 ? { text: askShown(S.stall.text), y: balY, blocked: S.stall.blocked } : null, answers: S.stall && totem && totem.alpha > 0 ? S.stall.choices : [], said: !S.stall && S.ball && S.ball.line && num(S.ball.read_at) && now >= S.ball.read_at && now < S.ball.read_at + SAID_MS ? { text: S.ball.line.length > 140 ? S.ball.line.slice(0, 139).trimEnd() + '\u2026' : S.ball.line, y: balY, blocked: false } : null, ball: S.ball || null, balance: text ? { text, y: balY, pulse } : null,
      held: heldLine ? { text: heldLine, y: over ? balY + 13.5 * u : balY - 13.5 * u } : null, pops, ended };
  }
  /** quick(now): a number or a crossing is in the air, or the balance pulses: the painter follows every picture; else its own slow cadence is enough */
  const quick = (now) => !S.recovery && ((!!S.drop && now >= S.drop.t0 && now < S.drop.t0 + S.drop.len) || S.pops.some((n) => now >= n.t0 - 60 && now < n.t0 + n.len + 60)
    || S.cross.some((c) => now >= c.t0 - 60 && !crossPhase(c, now - 60).over) || (S.composed && S.fuel.moving(now)) || (!!S.ball && now >= S.ball.in_at - 60 && now < S.ball.in_at + SWALLOW_MS + 60));   // HER BALL SWALLOWS: every picture while the swallow runs, none after
  return { take, mark, frame, quick, recoverFuel, stall, who: () => S.who, whoRev: () => S.frev,
    stalled: () => S.stall,   // THE ASK IS IN THE FLASK: the seat at the centre with its question and its answers (the painter's arrows take them)
    state: () => ({ money: S.money, flask: { who: S.who, rev: S.frev }, on: !!S.purse, rev: S.rev, mount_ms: S.mount_ms, posted: S.purse ? S.purse.posted : null, reserved: S.purse ? S.purse.reserved : null, level: S.level, pouring: !!S.pour,
      dropsRev: S.drev, fuelLevel: S.fuelLevel, recovery: S.recovery ? { ...S.recovery, cause: { ...S.recovery.cause } } : null, rows: S.purse ? S.purse.burns.length : 0, seen: S.seen.size, inAir: S.pops.length, counts: { ...counts }, fuel: S.composed ? S.fuel.state() : null,
      blobbyAt: { here: !(S.where && S.where.where === 'harmony') && !S.stall, where: S.where ? S.where.where : null, mac: S.where ? S.where.mac : null, since_ms: S.where ? S.where.since_ms : null, rev: S.brev },   // where: null with no ref (he is in her); here: false too while a stalled seat holds the centre
      stall: S.stall ? { seat: S.stall.seat, name: S.stall.name, text: S.stall.text, at: S.stall.at, blocked: S.stall.blocked, choices: S.stall.choices } : null, leaving: S.gone ? S.gone.seat : null,   // THE SEAT STALLED ON HIS WORD: the centre's seat, and the one on its way out
      crossing: S.cross.length ? { from: S.cross[0].from, to: S.cross[0].to, since_ms: S.cross[0].since_ms, t0: S.cross[0].t0, len: S.cross[0].len, turns: [...S.cross[0].turns] } : null, crossings: S.cross.length }) };   // the first crossing this glass holds (in the air, or waiting for its beat) as of its last frame; null at rest
}
const said = (f) => (f ? { now: f.now, level: f.level, surface: f.surface ? { y: f.surface.y, r: f.surface.r } : null, tilt: f.tilt, blobby: f.blobby ? { y: f.feet } : null, rides: f.rides ? f.rides.unit1 : null,
  totem: f.totem ? { seat: f.totem.seat, initials: f.totem.initials, alpha: Math.round(f.totem.alpha * 100) / 100, scale: Math.round(f.totem.scale * 1000) / 1000, hole: f.totem.hole ? f.totem.hole.kind : null } : null, ask: f.ask ? f.ask.text : null,
  cross: f.cross ? { k: f.cross.k, half: f.cross.half, hole: f.cross.hole.kind } : null, balance: f.balance, held: f.held ? f.held.text : null,
  pops: f.pops.map((q) => ({ id: q.id, text: q.text, k: q.k, y: q.y, dx: q.dx, scale: q.scale, alpha: q.alpha })) } : null);
/** shown(g): what a painter last drew of him and of the hole (riderOf), rounded, for a verifier */
const shown = (g) => (g ? { blobby: g.blobby ? { at: g.blobby.at, x: Math.round(g.blobby.x * 10) / 10, y: Math.round(g.blobby.y * 10) / 10, w: Math.round(g.blobby.w * 10) / 10, scale: Math.round(g.blobby.scale * 1000) / 1000, alpha: Math.round(g.blobby.alpha * 100) / 100 } : null,
  totem: g.totem ? { seat: g.totem.seat, x: Math.round(g.totem.x * 10) / 10, y: Math.round(g.totem.y * 10) / 10, w: Math.round(g.totem.w * 10) / 10, scale: Math.round(g.totem.scale * 1000) / 1000, alpha: Math.round(g.totem.alpha * 100) / 100 } : null,
  totemHole: g.totemHole ? { kind: g.totemHole.kind, r: Math.round(g.totemHole.r * 10) / 10, alpha: Math.round(g.totemHole.alpha * 100) / 100 } : null,
  hole: g.hole ? { at: g.hole.at, kind: g.hole.kind, x: Math.round(g.hole.x * 10) / 10, y: Math.round(g.hole.y * 10) / 10, r: Math.round(g.hole.r * 10) / 10, alpha: Math.round(g.hole.alpha * 100) / 100 } : null } : null);

/** drawBlobby(canvas): the wizard, rastered once: blobby.js's own drawing (the rest body of playroll-ui essenceMaterial.ts, his hat with its gold band,
 *  the wand with its star, one teal twinkle), on a canvas of any size with the sprite's shape (90 x 78). false when the canvas cannot draw. */
export function drawBlobby(c) {
  const x = c?.getContext?.('2d'); if (!x || typeof Path2D !== 'function') return false;
  const k = c.width / 90; x.setTransform(k, 0, 0, k, 0, 0); x.clearRect(0, 0, 90, 78);
  const body = new Path2D('M 11 51 C 9 42 15 35 18 27 C 22 15 33 12 45 12 C 59 12 69 17 73 29 C 76 38 82 45 79 54 C 77 62 62 63 46 63 C 31 63 14 61 11 51 Z');
  const fill = x.createLinearGradient(22, 14, 55, 66); fill.addColorStop(0, '#86d9d7'); fill.addColorStop(0.52, '#55c6cb'); fill.addColorStop(1, '#3e9a9f');
  x.fillStyle = fill; x.fill(body); x.strokeStyle = 'rgba(185,242,237,.38)'; x.lineWidth = 0.8; x.stroke(body);
  x.fillStyle = 'rgba(226,255,246,.24)'; x.beginPath(); x.ellipse(32, 24, 11, 4, -0.32, 0, Math.PI * 2); x.fill();
  for (const ex of [34, 56]) { x.fillStyle = '#203b3b'; x.beginPath(); x.ellipse(ex, 40, 3.5, 5.1, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#e5fff5'; x.beginPath(); x.arc(ex - 0.8, 38.1, 1.1, 0, Math.PI * 2); x.fill(); }
  x.lineJoin = 'round'; x.lineCap = 'round';
  const hat = new Path2D('M 27 19 C 33 15 41 13 47 13 C 49 9 52 4 56 1 C 54 6 54 10 55 14 C 60 15 64 17 66 19 C 60 22 33 22 27 19 Z');
  x.fillStyle = '#284c55'; x.fill(hat); x.strokeStyle = '#1c1a16'; x.lineWidth = 1.2; x.stroke(hat);
  x.fillStyle = '#d8b674'; x.beginPath(); x.moveTo(33, 17.6); x.quadraticCurveTo(46, 14.2, 59, 17.2); x.lineTo(59, 19.6); x.quadraticCurveTo(46, 16.6, 33, 20); x.closePath(); x.fill();
  x.fillStyle = '#fff3c4'; x.beginPath(); x.moveTo(49, 8.5); x.lineTo(50, 10.6); x.lineTo(52.1, 11.4); x.lineTo(50, 12.2); x.lineTo(49, 14.3); x.lineTo(48, 12.2); x.lineTo(45.9, 11.4); x.lineTo(48, 10.6); x.closePath(); x.fill();
  x.strokeStyle = '#1c1a16'; x.lineWidth = 2.6; x.beginPath(); x.moveTo(69, 54); x.lineTo(83, 31); x.stroke();
  x.strokeStyle = '#6b5a3e'; x.lineWidth = 1.1; x.beginPath(); x.moveTo(69.3, 53.4); x.lineTo(82.6, 31.6); x.stroke();
  const star = (sx, sy, R, r, f) => { x.beginPath(); for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + i * Math.PI / 4, d = i % 2 ? r : R; x.lineTo(sx + Math.cos(a) * d, sy + Math.sin(a) * d); } x.closePath(); x.fillStyle = f; x.fill(); x.strokeStyle = '#1c1a16'; x.lineWidth = 0.9; x.stroke(); };
  star(84, 28, 5.4, 2.1, '#f4d35e'); star(77.5, 21.5, 2.4, 0.9, '#55c6cb');
  return true;
}

/** drawTotem(canvas, totem): the stalled seat's totem, rastered once per seat: the Spool Board's seat as a disc, in the seat's own tint (one-sea.mjs tintOf, the
 *  house's one name for its colour), a darker rim, a gold ring (the Board's stalled ring) and its two initials in white, on a square canvas (the sprite's own
 *  90 x 90). false when the canvas cannot draw. */
export function drawTotem(c, t) {
  const x = c?.getContext?.('2d'); if (!x || !t) return false;
  const k = c.width / 90; x.setTransform(k, 0, 0, k, 0, 0); x.clearRect(0, 0, 90, 90);
  const [r, g, b] = Array.isArray(t.tint) && t.tint.length === 3 ? t.tint.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255)) : [120, 120, 120];
  const rgb = (m, a = 1) => `rgba(${Math.round(r * m)},${Math.round(g * m)},${Math.round(b * m)},${a})`;
  x.beginPath(); x.arc(45, 45, 44, 0, Math.PI * 2); x.fillStyle = 'rgba(201,161,74,.9)'; x.fill();   // the gold ring
  const fill = x.createRadialGradient(34, 32, 4, 45, 45, 40); fill.addColorStop(0, rgb(1.25)); fill.addColorStop(0.65, rgb(1)); fill.addColorStop(1, rgb(0.62));
  x.beginPath(); x.arc(45, 45, 38, 0, Math.PI * 2); x.fillStyle = fill; x.fill(); x.strokeStyle = rgb(0.45, 0.9); x.lineWidth = 1.6; x.stroke();
  x.fillStyle = 'rgba(255,255,255,.96)'; x.font = '700 30px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 3; x.fillText(String(t.initials || '?').slice(0, 2), 45, 47); x.shadowColor = 'transparent';
  return true;
}
/** stampTotem(c, img, t): the totem on a 2D context where riderOf puts it: its feet at (t.x, t.y), leaning and turning about them, at its scale and alpha. */
function stampTotem(c, img, t) {
  if (!(t.scale > 0.002) || !(t.alpha > 0.004)) return false;
  c.save(); c.globalAlpha = Math.max(0, Math.min(1, t.alpha)); c.translate(t.x, t.y); c.rotate(t.lean + t.turn); c.scale(t.scale, t.scale); c.drawImage(img, -t.w / 2, -t.h, t.w, t.h); c.restore(); return true;
}

// =====================================================================================================================================================
// THE 2D PAINTER: over Harmony's own engine (one.mjs), as the old overlay painted over the same engine: unit0 seen into (paintInside), the ale inside its
// projected disc (cloud.js liquid(): everything under the surface is ale, amber at the surface and darker toward the bottom, one ink meniscus with a
// glint, sloshing slowly), Blobby standing on it, the sheen of the shell over him (cloud.js glass()), the balance under his feet, the numbers rising from him.
// =====================================================================================================================================================
/** paintInside(ctx, cx, cy, R): unit0 seen into (his "a glassy thing where i can see inside"). The engine's own glass is a lever of the whole instance, so here
 *  her marble stays and the inside is painted over unit0's disc alone: a dim warm depth, thicker at the rim as glass is, her facets still showing through. */
export function paintInside(ctx, cx, cy, R) {
  if (!(R > 2)) return; const g = ctx.createRadialGradient(cx, cy - R * 0.1, R * 0.15, cx, cy, R);
  g.addColorStop(0, 'rgba(24,17,10,.40)'); g.addColorStop(0.7, 'rgba(24,17,10,.50)'); g.addColorStop(1, 'rgba(20,14,8,.66)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
}
/** fluidPainterOf(ctx): the fluid's WebGL2 painter of the document ctx draws in, made once (null where there is no document: the old ale is painted). */
const FLUID_PAINTERS = new WeakMap();
function fluidPainterOf(ctx) {
  const doc = ctx && ctx.canvas && ctx.canvas.ownerDocument; if (!doc || !FLUID.gl) return null;
  let fp = FLUID_PAINTERS.get(doc); if (!fp) { fp = FLUID.gl.createFluidPainter({ document: doc, alpha: 0.4, deep: 0.64, wave: 0.02 });   /* HER FLASK IS GLASS YOU SEE THROUGH: her marble's facets show under the liquid, thinner at the top */ FLUID_PAINTERS.set(doc, fp); }
  return fp;
}
const fluidStateOf = (doc) => { const fp = doc ? FLUID_PAINTERS.get(doc) : null; return fp ? fp.state() : null; };   // the fluid painter's own counters (pictures drawn, kept), for a verifier
const scaleOf = (ctx) => { try { const m = ctx.getTransform(); return Math.max(0.5, Math.hypot(m.a, m.b)); } catch { return 1; } };
/** paintAle(ctx, f, cx, cy): the liquid of frame f on a 2D context, unit0's centre at (cx, cy) px: cloud.js liquid(), its shape and its waves (everything
 *  under the surface is ale, amber at the surface and darker toward the bottom, one ink meniscus with a glint, sloshing slowly). Its colours are stronger
 *  than the old painter's: those lay over glass on a dark desktop; these lie over marble and must read as a level at a glance. */
export function paintAle(ctx, f, cx, cy) {
  if (f.recovery) return 'unavailable'; // never replace missing causal state with the animated fallback
  if (f.fluid && f.fluid.n > 0 && num(f.R) && f.R > 2) { const fp = fluidPainterOf(ctx); if (fp && fp.paint(ctx, f.fluid, cx, cy, f.R, scaleOf(ctx), f.now)) return 'fluid'; }   // THE FUEL IS A FLUID ('fluid': its picture changes only with the law's version)
  const s = f.surface; if (!s || !(s.R > 2) || !(f.level > 0.0005)) return false;
  const R = s.R, ys = cy - s.y, tilt = f.tilt[0], amp = Math.max(0.6, R * 0.035), now = f.now;
  const top = (x) => ys + (x - cx) * tilt + amp * Math.sin(x / (R * 0.35) + now / 420) + amp * 0.5 * Math.sin(x / (R * 0.13) - now / 260);
  const line = (dy) => { ctx.beginPath(); for (let i = 0; i <= 28; i++) { const x = cx - R + 2 * R * i / 28; ctx.lineTo(x, top(x) + dy); } ctx.stroke(); };
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
  const g = ctx.createLinearGradient(0, Math.min(ys, cy + R - 1), 0, cy + R);
  g.addColorStop(0, 'rgba(238,178,66,.80)'); g.addColorStop(0.45, 'rgba(176,110,36,.86)'); g.addColorStop(1, 'rgba(70,38,10,.94)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - R, cy + R + 2);
  for (let i = 0; i <= 28; i++) { const x = cx - R + 2 * R * i / 28; ctx.lineTo(x, top(x)); }
  ctx.lineTo(cx + R, cy + R + 2); ctx.closePath(); ctx.fill();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(52,30,8,.92)'; ctx.lineWidth = Math.max(1.2, 2.2 * f.u); line(0.9 * f.u);          // the meniscus: one ink line
  ctx.strokeStyle = 'rgba(255,246,214,.92)'; ctx.lineWidth = Math.max(0.9, 1.3 * f.u); line(-0.9 * f.u);     // and its glint, on it
  ctx.restore(); return true;
}
/** paintSheen(ctx, cx, cy, r): the shell's sheen over what stands inside (cloud.js glass()): a soft highlight upper left, a fainter one lower right, a thin rim. */
export function paintSheen(ctx, cx, cy, r) {
  if (!(r > 4)) return; const R = r * 0.995, T2 = Math.PI * 2;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, T2); ctx.clip();
  const hl = ctx.createRadialGradient(cx - R * 0.42, cy - R * 0.46, 0, cx - R * 0.42, cy - R * 0.46, R * 0.6);
  hl.addColorStop(0, 'rgba(255,255,255,.26)'); hl.addColorStop(0.45, 'rgba(255,255,255,.08)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hl; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  const lr = ctx.createRadialGradient(cx + R * 0.48, cy + R * 0.52, R * 0.05, cx + R * 0.48, cy + R * 0.52, R * 0.62);
  lr.addColorStop(0, 'rgba(255,255,255,.09)'); lr.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = lr; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  ctx.restore(); ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = Math.max(1, r / 50); ctx.beginPath(); ctx.arc(cx, cy, R - 0.6, 0, T2); ctx.stroke();
}
/** surfOf(f, flat): THE LIQUOR IN FRONT OF HIM, against his window: the surface's height over the window's centre and its slope (none where the ale is the
 *  fluid, whose picture stands still at rest: so does the window), null with no liquid or no window. Pure. */
export const surfOf = (f, flat = false) => (f && f.surface && f.window && num(f.surface.y) ? { y: f.surface.y - f.window.y, slope: flat ? 0 : (f.tilt && num(f.tilt[0]) ? f.tilt[0] : 0) } : null);
/** paintWindow(ctx, cx, cy, r, src, surf, u): THE ONE IN THE MIDDLE on a 2D context: the round window at (cx, cy), r its radius: its pale glass, the one in
 *  it (src {img, bust}: a portrait's bust filling it, its foot on the window's floor; Blobby's sprite standing whole in it; none: the glass alone), the liquor
 *  in front of him under its surface (surf: surfOf; a light amber veil deepening with the depth, its meniscus a lit line, as dl-mint-flask.js draws it), its gold ring. u:
 *  the old pixel (unit0's radius / 60). false when it cannot draw. */
/** paintMouth(ctx, cx, cy, r, k, u): HER BALL SWALLOWS WHAT HE THROWS: the hole at the flask's centre, a dark mouth whose arms turn inward; k null at rest (dim, still), k in [0, 1) while a throw goes in (the arms turn, the rim burns gold, a mote spirals to the middle and is gone). Pure. */ export function paintMouth(ctx, cx, cy, r, k, u = r / 30) { if (!ctx || !(r > 2)) return false; const T2 = Math.PI * 2, on = k != null && k >= 0 && k < 1, e = on ? 1 - (1 - k) * (1 - k) : 0, g = ctx.createRadialGradient(cx, cy, r * 0.04, cx, cy, r); g.addColorStop(0, '#000'); g.addColorStop(0.7, 'rgba(6,4,3,.98)'); g.addColorStop(1, 'rgba(22,13,6,.94)'); ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, T2); ctx.clip(); ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); ctx.lineWidth = Math.max(0.8, 1.1 * u); for (let a = 0; a < (on ? 8 : 5); a++) { ctx.beginPath(); for (let i = 0; i <= 32; i++) { const t = i / 32, rr = r * (1 - 0.92 * t), th = a * T2 / (on ? 8 : 5) + t * (on ? 1.1 : 0.35) * T2 + e * T2 * 1.5; i ? ctx.lineTo(cx + rr * Math.cos(th), cy + rr * Math.sin(th)) : ctx.moveTo(cx + rr * Math.cos(th), cy + rr * Math.sin(th)); } ctx.strokeStyle = 'rgba(216,182,116,' + (on ? 0.62 * (1 - 0.5 * e) : 0.18) + ')'; ctx.stroke(); } if (on) { const rr = r * 0.86 * (1 - e), th = e * T2 * 2.2 - 0.9; ctx.fillStyle = 'rgba(255,236,190,' + (1 - e).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(cx + rr * Math.cos(th), cy + rr * Math.sin(th), Math.max(1, r * 0.13 * (1 - e)), 0, T2); ctx.fill(); } ctx.restore(); ctx.lineWidth = Math.max(1.2, (on ? 2.6 : 1.4) * u); ctx.strokeStyle = on ? 'rgba(232,196,106,' + (0.95 - 0.5 * e).toFixed(3) + ')' : 'rgba(216,182,116,.45)'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, T2); ctx.stroke(); return true; }
export function paintWindow(ctx, cx, cy, r, src, surf, u = r / 30, mouth = null) {
  if (!ctx || !(r > 2)) return false; const T2 = Math.PI * 2; if (mouth) return paintMouth(ctx, cx, cy, r, mouth.k, u);   // HER BALL SWALLOWS: the motor speaks, so the window is the hole
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, T2); ctx.clip();
  const g = ctx.createRadialGradient(cx, cy - 0.35 * r, 0, cx, cy, r);
  g.addColorStop(0, 'rgba(244,248,252,.98)'); g.addColorStop(0.62, 'rgba(206,220,234,.97)'); g.addColorStop(1, 'rgba(120,140,166,.98)'); ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  if (src && src.img) {
    const iw = src.img.naturalWidth || src.img.width || 90, ih = src.img.naturalHeight || src.img.height || 78; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    if (src.bust) { const w = 2.04 * r, h = w * ih / iw; ctx.drawImage(src.img, cx - w / 2, cy + r - h, w, h); }   // the bust's foot on the window's floor, its head under the ring
    else { const h = 1.62 * r, w = h * iw / ih; ctx.drawImage(src.img, cx - w / 2, cy - 0.46 * h, w, h); }      // Blobby whole, his middle at the window's
  }
  if (surf) {
    const ys = (x) => cy - surf.y + (x - cx) * surf.slope, y0 = ys(cx - r), y1 = ys(cx + r);
    if (Math.min(y0, y1) < cy + r) {
      ctx.beginPath(); ctx.moveTo(cx - r, cy + r + 1); ctx.lineTo(cx - r, y0); ctx.lineTo(cx + r, y1); ctx.lineTo(cx + r, cy + r + 1); ctx.closePath();
      const a = ctx.createLinearGradient(0, Math.max(cy - r, Math.min(ys(cx), cy + r - 1)), 0, cy + r);
      a.addColorStop(0, 'rgba(238,178,66,.14)'); a.addColorStop(0.5, 'rgba(176,110,36,.2)'); a.addColorStop(1, 'rgba(70,38,10,.3)');
      ctx.fillStyle = a; ctx.fill();
      ctx.strokeStyle = 'rgba(255,246,214,.9)'; ctx.lineWidth = Math.max(0.8, 1.2 * u); ctx.beginPath(); ctx.moveTo(cx - r, y0); ctx.lineTo(cx + r, y1); ctx.stroke();
    }
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(28,18,6,.5)'; ctx.lineWidth = Math.max(1.2, 2.6 * u); ctx.beginPath(); ctx.arc(cx, cy, r, 0, T2); ctx.stroke();      // its shadow on the shell's glass
  ctx.strokeStyle = 'rgba(232,196,106,.95)'; ctx.lineWidth = Math.max(0.8, 1.3 * u); ctx.beginPath(); ctx.arc(cx, cy, r, 0, T2); ctx.stroke();   // its gold ring
  return true;
}
const BLOB_SRC = new WeakMap();   // a page's Blobby rastered once for his window: document -> canvas | null
/** srcOf(doc, who, done): what his window shows for the one in it: Blobby's sprite at once (returned), a portrait once decoded (null now; done(src) when it
 *  lands). */
function srcOf(doc, who, done) {
  const cast = castOf(who); if (!doc || typeof doc !== 'object') return null;
  if (!cast.art) { let c = BLOB_SRC.get(doc); if (c === undefined) { try { c = doc.createElement('canvas'); c.width = 270; c.height = 234; if (!drawBlobby(c)) c = null; } catch { c = null; } BLOB_SRC.set(doc, c); } return c ? { who, img: c, bust: false } : null; }
  artOf(doc, cast).then((img) => { if (img) done({ who, img, bust: true }); }).catch(() => {}); return null;
}
/** windowOn(ctx, b, src, surf, u): his window on a 2D context where riderOf puts it (its floor's middle at (b.x, b.y)), turning about its centre, at his
 *  scale and alpha. */
function windowOn(c, b, src, surf, u) {
  if (!(b.scale > 0.002) || !(b.alpha > 0.004)) return false;
  c.save(); c.globalAlpha = Math.max(0, Math.min(1, b.alpha)); c.translate(b.x, b.y - b.h / 2); c.rotate(b.turn); c.scale(b.scale, b.scale); const ok = paintWindow(c, 0, 0, b.w / 2, src, surf, u); c.restore(); return ok;
}
/** paintHole(ctx, x, y, r, kind): one hole of the crossing, r its radius now: the old painter's two (harmony.html hole-black: ink to a little over half
 *  its radius; hole-white: white to two fifths, warm to four fifths, gone at its rim), each inside its glow, which reaches HOLE.glow radii (its
 *  box-shadow). The old black one lay over Harmony's ivory; here the glass is black or the desktop shows through, so its dark is ringed by a hot rim and
 *  reads as a hole on any ground. The purse's gold stands for the page's accent. The caller sets the alpha. false when there is nothing to paint. */
export function paintHole(ctx, x, y, r, kind) {
  if (!(r > 0.5)) return false; const G = r * HOLE.glow, T2 = Math.PI * 2;
  const halo = ctx.createRadialGradient(x, y, r * 0.5, x, y, G);
  halo.addColorStop(0, 'rgba(216,182,116,0)'); halo.addColorStop(0.42, kind === 'white' ? 'rgba(255,214,130,.5)' : 'rgba(216,182,116,.42)'); halo.addColorStop(1, 'rgba(216,182,116,0)');
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, G, 0, T2); ctx.fill();
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  if (kind === 'white') { g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.42, 'rgba(255,255,255,1)'); g.addColorStop(0.78, 'rgba(255,226,160,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)'); }
  else { g.addColorStop(0, 'rgba(10,9,8,1)'); g.addColorStop(HOLE.dark, 'rgba(10,9,8,1)'); g.addColorStop(HOLE.dark + 0.07, 'rgba(255,240,205,.96)'); g.addColorStop(HOLE.dark + 0.17, 'rgba(244,190,92,.8)'); g.addColorStop(1, 'rgba(216,150,60,0)'); }   // its dark, the hot rim, the rim's own fall
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, T2); ctx.fill(); return true;
}
/** stamp(ctx, img, b): the wizard on a 2D context where riderOf puts him: his feet at (b.x, b.y), leaning and turning about them, at his scale and alpha. */
function stamp(c, img, b) {
  if (!(b.scale > 0.002) || !(b.alpha > 0.004)) return false;
  c.save(); c.globalAlpha = Math.max(0, Math.min(1, b.alpha)); c.translate(b.x, b.y); c.rotate(b.lean + b.turn); c.scale(b.scale, b.scale); c.drawImage(img, -b.w / 2, -b.h * BLOBBY.feet, b.w, b.h); c.restore(); return true;
}
const css = (n) => '#' + n.toString(16).padStart(6, '0');
const mixCss = (a, b, k) => { const c = (sh) => Math.round(((a >> sh) & 255) + (((b >> sh) & 255) - ((a >> sh) & 255)) * k); return `rgb(${c(16)},${c(8)},${c(0)})`; };
/** textsOf(f, d, zoom): every line of text of frame f, where it stands in the square's px (d: unit0's disc there) and how large: the balance right under
 *  his feet (over his hat when the floor leaves no room) with what is in flight beyond it, and each number in the air. zoom: how many pixels of the glass one
 *  pixel of the square is: a line grows to keep MIN_PX on the glass, and what grew is set that much farther. One law for both painters.
 *  -> [{ id, kind: 'balance' | 'held' | 'number', text, px, x, y, scale, alpha, color, weight }]; the ask's w: the width it wraps in, her square's (THE QUESTION STAYS ON THE GLASS) */
export function textsOf(f, d, zoom = 1) {
  const z = Math.max(1e-3, num(zoom) && zoom > 0 ? zoom : 1), grown = (px, min) => Math.max(1, min / (px * f.u * z)), out = [];
  const ask = f.ask && f.ask.text ? f.ask : f.said && f.said.text ? f.said : null, ga = ask ? grown(11, MIN_PX.balance) : 1;   // THE SEAT STALLED ON HIS WORD: its question takes the balance's line; the balance stands a line under it
  const over0 = (f.balance ? f.balance.y : f.feet + 1) > f.feet, tall = f.totem ? TOTEM.tall : f.window && num(f.window.r) ? 2 * f.window.r / f.rho : BLOBBY.tall;
  if (ask) {
    const askY = ask === f.said ? -(f.rho + (10 + 7 * ga) * f.u) : over0 ? f.feet + tall * f.rho + (3 + 7 * ga) * f.u : f.feet - (4 + 7 * ga) * f.u;   // HER BALL SWALLOWS: her line of a throw stands under the ball, never on the balance
    out.push({ id: 'ask', kind: 'ask', text: ask.text, px: 11 * f.u * ga, x: d.x, y: d.y - askY, scale: 1, alpha: f.totem ? Math.max(0, Math.min(1, f.totem.alpha)) : 1, color: css(INK.gold), weight: 700, w: Math.round(2 * Math.max(d.r, d.x)) });
  }
  if (f.balance && f.money !== false) {   // his word hides the dollar amounts (house/settings money): the balance, what is held, the numbers
    const gb = grown(12, MIN_PX.balance), gh = grown(11, MIN_PX.held), over = f.balance.y > f.feet, way = over ? 1 : -1, pulse = Math.round(f.balance.pulse * 8) / 8;
    const balY = (over ? f.feet + tall * f.rho + (3 + 7 * gb) * f.u : f.feet - (4 + 7 * gb) * f.u) + (ask && ask !== f.said ? way * (7 * ga + 6.5 * gb) * f.u : 0);
    out.push({ id: 'balance', kind: 'balance', text: f.balance.text, px: 12 * f.u * gb, x: d.x, y: d.y - balY, scale: 1 + 0.35 * f.balance.pulse, alpha: 1, color: pulse > 0 ? mixCss(INK.gold, INK.drop, pulse) : css(INK.gold), weight: 700 });
    if (f.held) out.push({ id: 'held', kind: 'held', text: f.held.text, px: 11 * f.u * gh, x: d.x, y: d.y - (balY + way * (7 * gb + 6.5 * gh) * f.u), scale: 1, alpha: 1, color: css(INK.muted), weight: 600 });
  }
  for (const q of f.money === false ? [] : f.pops) { const px = q.big ? 18 : 14, gp = grown(px, MIN_PX.number);
    out.push({ id: q.id, kind: 'number', text: q.text, px: px * f.u * gp, x: d.x + q.dx * gp, y: d.y - (f.from + (q.y - f.from) * gp), scale: q.scale, alpha: q.alpha, color: css(q.color), weight: 800 }); }   // from: his feet, or the liquid's surface while he is away
  return out;
}

/** mountPurse2D({ document, box, before, disc, seat, dpr, zoom, law }) -> { take(value, {rev, now}), mark(now), sample(now, real), ride(), state(), stop() }.
 *  box: her own square (the element that holds the engine's canvas; what is added here is moved and scaled with it); before: an element of the box the disc's
 *  layers go under (the girl on the crown stays over them; the text goes over everything); disc(): unit0's projected centre and radius in the box's own px
 *  ({x, y, r, top?}: top is the height over the centre left free under whatever sits on the crown; none: the radius), null while it has none; zoom(): how
 *  many pixels of the glass one pixel of the box is (the host scales her square into its picture): the
 *  text keeps MIN_PX on the glass; law: a createPurse() to share (a page with two roads to her picture has one purse and a painter on each). take() is the
 *  cause; mark(now) says the page has the house time (its first is this glass's mount); sample(now) paints, once per picture of the host while she is shown.
 *  seat(unit1): that chamber's projected centre and radius in the box's own px, as the host's engine last painted it ({x, y, r, depth}: riderOf), null
 *  while it has none; asked only while the law says he rides it. ride(): the host's engine painted her again: while he stands on his unit1 his layer
 *  follows it (one projection, one transform, no sample of the law); the host calls it from the engine's own paint, so he never trails his mount.
 *  asks: false on a glass whose own box says the seat's question (a phone): the totem stands alone. */
export function mountPurse2D({ document: doc, box, before = null, disc, seat = null, dpr = 1, zoom = null, law: given = null, asks = true } = {}) {
  const law = given || createPurse(), S = { built: false, shown: false, key: '', sheen: '', painted: -Infinity, sampled: -Infinity, at: '', dirty: false, blobAt: 'home', disc: null, rider: null, holeKind: '', holeR: 0, holeSide: 0, holed: false, last: null, paints: 0, samples: 0, kept: 0, rides: 0, holes: 0, wore: null, worn: null, arrowsKey: '', src: null, winSize: '', winKey: '', winRatio: '', windows: 0 };
  const put = (el, prop, v) => { const k = '$' + prop; if (el[k] !== v) { el[k] = v; el.style[prop] = v; } };   // a style is written when it changed, never again
  S.totems = 0; S.totemOf = '';
  let ale = null, ax = null, blob = null, glass = null, gx = null, hole = null, hx = null, bal = null, heldEl = null, air = null, totem = null, askEl = null, arrows = null, words = null; const spans = new Map();   // totem: THE SEAT STALLED ON HIS WORD, one layer drawn once per seat
  const TEXT = 'white-space:nowrap;line-height:1.17;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;';
  const HALO = 'text-shadow:0 0 .1em rgba(0,0,0,.9),0 .083em .167em rgba(0,0,0,.9),0 0 .5em rgba(0,0,0,.6);';   // ui.css's two shadows (1 px 2 px and 6 px at 12 px), kept in proportion to the text, and a close edge: here the money stands over ivory and amber, not over a dark desktop
  const layer = (tag, css) => { const el = doc.createElement(tag); el.setAttribute('aria-hidden', 'true'); el.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;will-change:transform;' + css; return el; };   // will-change: what moves here moves on the compositor, nothing is painted again for a move
  function build() {
    S.built = true;
    ale = layer('canvas', 'display:none'); ale.id = 'purse-ale'; ax = ale.getContext('2d');
    blob = layer('canvas', 'display:none;width:90px;height:78px;transform-origin:50% ' + (BLOBBY.feet * 100).toFixed(2) + '%'); blob.id = 'purse-blobby'; blob.width = 270; blob.height = 234; if (!drawBlobby(blob)) blob = null;   // the sprite's own 90 x 78: his size is his transform's
    S.blobAt = 'home'; if (blob) blob.style.transformOrigin = '50% 50%';   // at home he is his window (THE ONE IN THE MIDDLE), sized by windowAt
    glass = layer('canvas', 'display:none'); glass.id = 'purse-sheen'; gx = glass.getContext('2d');
    for (const el of [ale, blob, glass]) if (el) box.insertBefore(el, before && before.parentNode === box ? before : null);
    bal = layer('div', 'display:none;font-weight:700;letter-spacing:.02em;color:' + css(INK.gold) + ';' + HALO + TEXT); bal.id = 'purse-balance';
    heldEl = layer('div', 'display:none;font-weight:600;color:' + css(INK.muted) + ';' + HALO + TEXT); heldEl.id = 'purse-held';
    air = layer('div', 'display:none'); air.id = 'purse-numbers'; box.append(bal, heldEl, air);
    S.wore = null; wear();   // WHO IS IN THE FLASK: the one the Nest names, from the first picture
    if (handOf(doc)) {   // the arrows, only where his hand reaches the flask (the Mac's corner says so on the page): over the flask's glass, under the girl and the money
      arrows = [-1, 1].map((dir) => { const a = layer('div', 'display:none;' + ARROW_CSS); a.id = dir < 0 ? 'purse-flask-prev' : 'purse-flask-next'; a.className = 'purse-flask-arrow';
        a.setAttribute(FLASK_ARROW, String(dir)); a.setAttribute('role', 'button'); a.textContent = dir < 0 ? '\u2039' : '\u203a'; box.insertBefore(a, bal); return a; });
      words = [-1, 1].map((dir) => { const w = layer('div', 'display:none;' + WORD_CSS); w.id = dir < 0 ? 'purse-flask-no' : 'purse-flask-yes'; w.className = 'purse-flask-arrow purse-flask-word'; box.insertBefore(w, bal); return w; });   // THE ASK IS IN THE FLASK: each arrow's answer under it, shown with the arrows
      arrowStyle(doc); S.arrowsKey = ''; label();
    }
  }
  /** wear(): THE ONE IN THE FLASK: whoever the law's house/flask names, once per change: at home his window shows it (THE ONE IN THE MIDDLE: Blobby at once,
   *  a portrait once decoded, the window painted again at the next picture); on his unit1 the sprite wears it (Blobby at once, a portrait once decoded). */
  function wear() {
    const who = law.who(); if (!blob || who === S.wore) return;
    S.wore = who; label();
    if (S.blobAt !== 'home') { wearOn(doc, blob, who, () => S.wore === who, () => { S.worn = who; }); if (!castOf(who).art) S.worn = who; return; }
    const at = srcOf(doc, who, (src) => { if (S.wore === who) { S.src = src; S.winKey = ''; S.dirty = true; } }); if (at) { S.src = at; S.winKey = ''; }
  }
  /** look(at): HE IS ONE LAYER with two looks: at home his window (THE ONE IN THE MIDDLE), on his unit1 the sprite he always was; laid again when he crosses. */
  function look(at) {
    S.winSize = ''; S.winKey = ''; S.winRatio = ''; S.wore = null;
    if (at === 'home') blob.style.transformOrigin = '50% 50%';
    else if (typeof blob.removeAttribute === 'function') blob.removeAttribute(FLASK_WINDOW);   // on his unit1 the sprite is no circle to press
    else { blob.width = 270; blob.height = 234; blob.style.width = '90px'; blob.style.height = '78px'; blob.style.transformOrigin = '50% ' + (BLOBBY.feet * 100).toFixed(2) + '%'; }
    wear();
  }
  /** windowAt(b, surf, u): his window at home: its raster laid when its size changes, painted again only when what it shows changes (the one in it, the
   *  liquor's surface against it: still at rest where the ale is the fluid), moved by its transform alone (a crossing's turn and scale, about its centre). */
  function windowAt(b, surf, u) {
    const r = b.w / 2, side = Math.ceil(2 * r + 2 * Math.max(1.2, 2.6 * u)), size = side + ':' + dpr;
    if (size !== S.winSize) { S.winSize = size; S.winKey = ''; blob.width = Math.round(side * dpr); blob.height = Math.round(side * dpr); blob.style.width = side + 'px'; blob.style.height = side + 'px'; }
    const ratio = (r / (side / 2)).toFixed(4); if (arrows && ratio !== S.winRatio) { S.winRatio = ratio; blob.setAttribute(FLASK_WINDOW, ratio); }   // THE CIRCLE TAKES HIS PRESS: where his hand reaches the flask, the circle's share of the layer
    const mo = S.ball ? { k: num(S.ball.in_at) && S.now >= S.ball.in_at && S.now < S.ball.in_at + SWALLOW_MS ? (S.now - S.ball.in_at) / SWALLOW_MS : null } : null, src = S.src, a = surf ? Math.abs(surf.slope) * r : 0, line = !surf ? 'dry' : surf.y - a >= r ? 'over' : surf.y + a <= -r ? 'under' : (Math.round(surf.y * 4) / 4) + ':' + surf.slope.toFixed(3);   // the last one landed stands till the next is decoded; a window wholly under the liquor, or wholly over it, is one picture whatever the swell
    const key = [size, r.toFixed(2), src ? src.who : '-', line, mo ? (mo.k == null ? 'mouth' : 'mouth' + Math.round(mo.k * 48)) : ''].join('|');
    if (key !== S.winKey) { S.winKey = key; const x = blob.getContext('2d'); if (x) { x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, side, side); if (paintWindow(x, side / 2, side / 2, r, src, surf, u, mo)) { S.windows++; if (src && !mo) S.worn = src.who; } } }
    put(blob, 'transform', `translate(${(b.x - side / 2).toFixed(1)}px, ${(b.y - b.h / 2 - side / 2).toFixed(1)}px) rotate(${b.turn.toFixed(3)}rad) scale(${b.scale.toFixed(4)})`);
  }
  /** label(): each arrow says who comes on it and the rev it was drawn under (the corner's write takes both), once per change of the one in it.
   *  THE ASK IS IN THE FLASK (Nov 4 2026, his "it gotta be the flask... our holy historical singleton"): while the seat at the centre offers him answers, the arrows
   *  are his answer instead: › the seat's pick (its first), ‹ the other; each carries the seat, its ask's moment and the two words (data-flask-answer, -seat, -ask,
   *  -choices; the corner's press writes the answer road with them), and its word stands under it. The cast's cycle comes back when the question leaves. */
  function label() {
    if (!arrows) return; const who = law.who(), rev = law.whoRev(), st = typeof law.stalled === 'function' ? law.stalled() : null, answers = st && Array.isArray(st.choices) && st.choices.length ? st.choices : null;
    if (blob) { blob.setAttribute('data-flask-next', nextWho(who, 1)); blob.setAttribute('data-flask-rev', String(num(rev) ? rev : 0)); }   // THE CIRCLE TAKES HIS PRESS: his window brings the next one in, as › does
    const drop = (el, k) => el.setAttribute(k, '');   // none is an empty word (the corner reads '' as none; a stand-in page may have no removeAttribute)
    for (const a of arrows) {
      const dir = a.id === 'purse-flask-prev' ? -1 : 1, i = dir < 0 ? 1 : 0, word = answers && typeof answers[i] === 'string' ? answers[i] : null; a.setAttribute('data-flask-rev', String(num(rev) ? rev : 0));
      if (word) { a.setAttribute('data-flask-answer', String(i)); a.setAttribute('data-flask-seat', st.seat); a.setAttribute('data-flask-ask', String(st.at)); a.setAttribute('data-flask-choices', JSON.stringify(answers)); drop(a, 'data-flask-next'); a.setAttribute('aria-label', word); a.setAttribute('title', word); }
      else { const next = nextWho(who, dir); for (const k of ['data-flask-answer', 'data-flask-seat', 'data-flask-ask', 'data-flask-choices']) drop(a, k); a.setAttribute('data-flask-next', next); a.setAttribute('aria-label', (dir < 0 ? 'Back to ' : 'Next: ') + castOf(next).name); a.setAttribute('title', castOf(next).name); }
    }
    if (words) for (const w of words) { const word = answers ? answers[w.id === 'purse-flask-no' ? 1 : 0] : null; if (w.textContent !== (word || '')) w.textContent = word || ''; put(w, 'visibility', word && S.arrowsKey ? 'inherit' : 'hidden'); }
    S.answersKey = answers ? st.seat + '@' + st.at + '|' + answers.join('|') : '';
  }
  function show(on) { if (S.shown === on) return; S.shown = on; for (const el of [ale, blob, glass, bal, heldEl, air, totem, askEl, ...(arrows || []), ...(words || [])]) if (el) el.style.display = on ? 'block' : 'none'; if (!on) unhole(); }
  /** standTotem(g): THE SEAT STALLED ON HIS WORD: the totem at the centre, one layer, drawn once per seat (its tint and initials) and then moved by its transform alone */
  function standTotem(g) {
    const t = g.totem;
    if (!t) { if (totem) put(totem, 'visibility', 'hidden'); return; }
    if (!totem) { totem = layer('canvas', 'width:90px;height:90px;transform-origin:50% 100%'); totem.id = 'purse-totem'; totem.width = 270; totem.height = 270; S.totemOf = ''; box.insertBefore(totem, glass); }   // made the first time a seat stalls: over the ale, under the sheen (he and it are never at the centre together); a glass where none stalls has no such layer
    const key = t.seat + '|' + t.initials + '|' + (t.tint || []).map((v) => v.toFixed(3)).join(',');
    if (key !== S.totemOf) { S.totemOf = drawTotem(totem, t) ? key : ''; S.totems++; }
    put(totem, 'visibility', 'inherit'); put(totem, 'opacity', t.alpha.toFixed(2));
    put(totem, 'transform', `translate(${(t.x - 45).toFixed(1)}px, ${(t.y - 90).toFixed(1)}px) rotate(${(t.lean + t.turn).toFixed(3)}rad) scale(${(t.scale * t.w / 90).toFixed(4)}, ${(t.scale * t.h / 90).toFixed(4)})`);
  }
  const under = () => (before && before.parentNode === box ? before : bal);   // what stands on his unit1 lies over her and under the girl
  const unhole = () => { if (hole) { hole.remove(); hole = hx = null; S.holeKind = ''; } };
  const seatOf = (f) => (f.rides && typeof seat === 'function' ? seat(f.rides.unit1) : null);
  /** stand(g): the one wizard and the hole on his unit1, where riderOf puts them. He is ONE layer, so he is never in two places: inside her unit0 it lies
   *  under the shell's sheen, on his unit1 over her and under the girl. His place, his size and his turn are one transform and one opacity (the
   *  compositor's): nothing is painted again for a move. The hole on his unit1 is a layer of its own UNDER his (he is seen whole in front of the hole
   *  that takes him and of the hole that gives him), there for the crossing alone, painted once per hole and then scaled; the hole inside her unit0 is
   *  painted with the ale, under him too (sample). */
  function stand(g, surf = null, u = 1) {
    S.rider = g; const b = g.blobby; wear(); placeArrows(g);
    if (blob && !b) put(blob, 'visibility', 'hidden');   // a Harmony claims him and the host hands no unit1: drawn nowhere, as before
    else if (blob) {
      if (b.at !== S.blobAt) { S.blobAt = b.at; box.insertBefore(blob, b.at === 'home' ? glass : under()); if (hole) box.insertBefore(hole, b.at === 'seat' ? blob : under()); look(b.at); }
      put(blob, 'visibility', 'inherit'); put(blob, 'opacity', b.alpha.toFixed(2));
      if (b.at === 'home') windowAt(b, surf, u);
      else put(blob, 'transform', `translate(${(b.x - 45).toFixed(1)}px, ${(b.y - 63).toFixed(1)}px) rotate(${(b.lean + b.turn).toFixed(3)}rad) scale(${(b.scale * b.w / 90).toFixed(4)})`);
    }
    const h = g.hole && g.hole.at === 'seat' ? g.hole : null; if (!h) return unhole();
    if (!hole) { hole = layer('canvas', 'transform-origin:50% 50%'); hole.id = 'purse-hole'; hx = hole.getContext('2d'); box.insertBefore(hole, blob && S.blobAt === 'seat' ? blob : under()); }
    if (h.kind !== S.holeKind) {   // one picture per hole, at its widest; its opening and closing are its transform's
      const side = Math.ceil(2 * HOLE.glow * h.R) + 2; S.holeKind = h.kind; S.holeR = h.R; S.holeSide = side; S.holes++;
      hole.width = Math.round(side * dpr); hole.height = Math.round(side * dpr); hole.style.width = side + 'px'; hole.style.height = side + 'px';
      if (hx) { hx.setTransform(dpr, 0, 0, dpr, 0, 0); hx.clearRect(0, 0, side, side); paintHole(hx, side / 2, side / 2, h.R, h.kind); }
    }
    put(hole, 'opacity', h.alpha.toFixed(2)); put(hole, 'transform', `translate(${(h.x - S.holeSide / 2).toFixed(1)}px, ${(h.y - S.holeSide / 2).toFixed(1)}px) scale(${(h.r / S.holeR).toFixed(4)})`);
  }
  /** placeArrows(b): the two arrows inside the flask's glass, either side of the one in it at his middle's height, scaled with her unit0 (his box is
   *  scaled with her square by the host; at home his window's middle: THE ONE IN THE MIDDLE); hidden while he is not home (he rides his unit1, a seat stalls at the centre) or there is no disc. */
  function placeArrows(g) {
    if (!arrows) return; const d = S.disc, b = g && g.blobby, t = g && g.totem, on = !!(d && d.r > 4 && (t || (b && b.at === 'home' && !S.ball)));   // HER BALL SWALLOWS: with the motor speaking the arrows are his answers alone, never a cast to cycle   // THE ASK IS IN THE FLASK: beside the totem at the centre too, where they are his answer
    if (!on) { for (const a of [...arrows, ...(words || [])]) put(a, 'visibility', 'hidden'); S.arrowsKey = ''; return; }
    const y = b && b.at === 'home' ? (b.window ? b.y - b.h / 2 : b.y - b.h * 0.42 * (num(b.scale) ? b.scale : 1)) : t.y - t.h / 2, dx = d.r * 0.76, k = Math.max(0.55, Math.min(1.6, d.r / 64)), key = [d.x, d.y, y, dx, k].map((v) => v.toFixed(1)).join(':');
    if (key === S.arrowsKey) return; S.arrowsKey = key;
    for (const a of arrows) { const x = d.x + (a.id === 'purse-flask-prev' ? -dx : dx); put(a, 'visibility', 'inherit'); put(a, 'transform', `translate(${(x - ARROW_PX / 2).toFixed(1)}px, ${(y - ARROW_PX / 2).toFixed(1)}px) scale(${k.toFixed(3)})`); }
    if (words) for (const w of words) { const x = d.x + (w.id === 'purse-flask-no' ? -dx : dx); put(w, 'transform', `translate(${x.toFixed(1)}px, ${(y + ARROW_PX * k / 2 + 3 * k).toFixed(1)}px) translate(-50%, 0) scale(${k.toFixed(3)})`); put(w, 'visibility', w.textContent ? 'inherit' : 'hidden'); }   // THE ASK IS IN THE FLASK: its word under each arrow
  }
  function fit(d) {   // the disc's layers stand on the disc: one small canvas each, sized to it
    const pad = 3, side = Math.ceil(2 * (d.r + pad)), left = Math.round(d.x - side / 2), top = Math.round(d.y - side / 2), key = side + ':' + left + ':' + top;
    if (key !== S.key) { S.key = key; for (const c of [ale, glass]) { c.width = Math.round(side * dpr); c.height = Math.round(side * dpr); c.style.width = side + 'px'; c.style.height = side + 'px'; c.style.transform = `translate(${left}px, ${top}px)`; } S.sheen = ''; S.painted = -Infinity; }
    return { side, left, top };
  }
  function sample(now, real = true) {
    if (!num(now)) return null;
    if (real) law.mark(now);
    const d = typeof disc === 'function' ? disc() : null, where = d && d.r > 4 ? d.x.toFixed(1) + ':' + d.y.toFixed(1) + ':' + d.r.toFixed(1) + ':' + (num(d.top) ? d.top.toFixed(1) : '') : '';
    // THE CADENCE (cloud.js's, Sept 26: its loop repainted at display rate and cost the GPU 17 to 27 %): at rest the purse moves at 20 pictures a second,
    // whatever the host's rate (a painting glass runs at 60); every picture only while a number or a crossing is in the air or the balance pulses, and at
    // once on a cause. While he rides his unit1 at rest the host's engine moves his layer from its own paint (ride()), not this sample.
    // Asked first: between two of its pictures a call costs the disc and one string.
    if (where && S.last && S.shown && !S.dirty && where === S.at && now >= S.sampled && now - S.sampled < PAINT_MS && !law.quick(now)) { S.kept++; return S.last; }
    const f = where ? law.frame(now, d.r, d.r * R_2D, num(d.top) ? d.top : d.r, num(d.top) && d.top < d.r ? d.top : null) : null;
    if (!f || f.recovery) { if (S.built) { show(false); for (const [, el] of spans) el.remove(); spans.clear(); } S.last = null; return null; }
    if (!S.built) build();
    show(true);
    S.sampled = now; S.at = where; S.samples++; S.now = now; S.ball = f.ball || null;
    const { side, left, top } = fit(d), cx = d.x - left, cy = d.y - top;
    // WHERE HE IS DRAWN (house/blobby): inside her unit0, or on his unit1 while a Harmony claims him, on this glass as on every other; and the hole of a crossing
    const g = riderOf(f, d, seatOf(f)), hh = g.hole && g.hole.at === 'home' ? g.hole : g.totemHole; S.disc = d; stand(g, surfOf(f, S.aleIs === 'fluid'), f.u); standTotem(g);
    { const st = typeof law.stalled === 'function' ? law.stalled() : null, key = f.answers && f.answers.length && st ? st.seat + '@' + st.at + '|' + f.answers.join('|') : ''; if (key !== (S.answersKey || '')) label(); }   // THE ASK IS IN THE FLASK: the arrows take the answers the moment the totem stands, give them back when it leaves   // the hole inside her unit0: his, or the totem's
    // the ale: never more than 20 times a second even while a number rises; every picture only while a hole is open inside her unit0 (painted with the ale:
    // on it, under him, never past the shell), and once more when that hole is gone
    // NOTHING AT REST (Oct 14 2026 20:5x WEST, the fuel-fluid proof: at rest this canvas was painted again 13 to 14 times a second, clearRect, the inside's
    // gradient and the fluid's kept picture, 0.2 to 0.4 k operations in 5 s, for a picture that had not changed): the fluid's picture changes only with its
    // law's version, so while the fluid is what fills her unit0 the ale is painted again only when that version moves (or a cause, a hole, a new size). The
    // old sloshing ale, where there is no WebGL2, keeps its cadence: its waves are a function of the time.
    const fv = f.fluid && f.fluid.n > 0 ? f.fluid.version : null, still = S.aleIs === 'fluid' && fv != null && fv === S.fluidV && S.painted > -Infinity && !(f.level > 0.0005 && f.level < 0.999);   // HER LIQUID BREATHES: a free surface waves, so it is painted at the old ale's cadence (PAINT_MS) while she is shown; an empty or a full tank stands still
    if (S.dirty || (!still && now - S.painted >= PAINT_MS) || now < S.painted || hh || S.holed || (S.aleIs === 'fluid' && fv !== S.fluidV)) {
      ax.setTransform(dpr, 0, 0, dpr, 0, 0); ax.clearRect(0, 0, side, side); paintInside(ax, cx, cy, d.r * R_2D); S.aleIs = paintAle(ax, f, cx, cy); S.fluidV = fv; S.painted = now; S.dirty = false; S.paints++;
      if (hh) { ax.save(); ax.beginPath(); ax.arc(cx, cy, d.r * 0.995, 0, Math.PI * 2); ax.clip(); ax.globalAlpha = Math.max(0, Math.min(1, hh.alpha)); paintHole(ax, hh.x - left, hh.y - top, hh.r, hh.kind); ax.restore(); S.holes++; }
      S.holed = !!hh;
      const sk = cx.toFixed(1) + ':' + cy.toFixed(1) + ':' + d.r.toFixed(1); if (sk !== S.sheen) { S.sheen = sk; gx.setTransform(dpr, 0, 0, dpr, 0, 0); gx.clearRect(0, 0, side, side); paintSheen(gx, cx, cy, d.r); }
    }
    const texts = textsOf(f, d, typeof zoom === 'function' ? zoom() : 1), live = new Set();
    const line = (el, t) => {   // one line of text, its middle where the law puts it
      if (!t) { put(el, 'visibility', 'hidden'); return; }
      if (el.textContent !== t.text) el.textContent = t.text; put(el, 'visibility', 'inherit'); put(el, 'fontSize', t.px.toFixed(2) + 'px'); put(el, 'color', t.color); if (t.kind === 'ask') { put(el, 'opacity', t.alpha.toFixed(2)); put(el, 'maxWidth', t.w + 'px'); }
      put(el, 'transform', `translate(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px) translate(-50%, -50%) scale(${t.scale.toFixed(3)})`); };
    line(bal, texts.find((t) => t.kind === 'balance')); line(heldEl, texts.find((t) => t.kind === 'held'));
    const askT = asks ? texts.find((t) => t.kind === 'ask') : null;   // THE SEAT STALLED ON HIS WORD: its question, made the first time a seat stalls on this glass, over the numbers' layer; THE QUESTION STAYS ON THE GLASS (Nov 4 2026, his "wtf is this?" over it cut by the screen's edge): it wraps inside her square
    if (askT && !askEl) { askEl = layer('div', 'font-weight:700;letter-spacing:.01em;color:' + css(INK.gold) + ';' + HALO + TEXT + 'white-space:normal;text-align:center;width:max-content'); askEl.id = 'purse-ask'; box.insertBefore(askEl, air); }
    if (askEl) line(askEl, askT);
    for (const t of texts) { if (t.kind !== 'number') continue; live.add(t.id); let el = spans.get(t.id);
      if (!el) { el = doc.createElement('span'); el.textContent = t.text; el.style.cssText = 'position:absolute;left:0;top:0;will-change:transform,opacity;font-weight:800;color:' + t.color + ';' + HALO + TEXT; air.append(el); spans.set(t.id, el); }
      put(el, 'fontSize', t.px.toFixed(2) + 'px'); put(el, 'opacity', t.alpha.toFixed(2));
      put(el, 'transform', `translate(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px) translate(-50%, -50%) scale(${t.scale.toFixed(3)})`); }
    for (const [id, el] of spans) if (!live.has(id)) { el.remove(); spans.delete(id); }
    S.last = f; return f;
  }
  return {
    take: (value, o) => { const moved = law.take(value, o); if (moved) { S.dirty = true; if (o && o.ref === FLASK_REF) wear(); } else if (o && o.ref === FLASK_REF) label(); return moved; }, mark: (now) => law.mark(now), sample,
    touch() { S.dirty = true; },   // a cause was taken on a law this painter shares: its next picture repaints the ale at once
    /** ride(): the host's engine painted her again. While he stands on his unit1 his layer (and the hole open there) follows it: one projection, one
     *  transform; the law's last frame stands. While he is home nothing is asked and nothing is written. true when he was moved. */
    ride() { const f = S.last; if (!f || !f.rides || !S.shown || !S.disc) return false; stand(riderOf(f, S.disc, seatOf(f))); S.rides++; return true; },
    state: () => ({ ...law.state(), painter: '2d', built: S.built, shown: S.shown, paints: S.paints, fluid: fluidStateOf(doc), samples: S.samples, kept: S.kept, rides: S.rides, holes: S.holes, blobby: !!blob, wears: S.wore, worn: S.worn, look: S.blobAt === 'home' ? 'window' : 'sprite', windows: S.windows, arrows: !!arrows, numbers: spans.size, totems: S.totems, drawn: said(S.last), rider: shown(S.rider) }),
    /** its layers leave the page; the law keeps what it holds, and the next sample builds them again (a glass that goes to painting frames and comes back) */
    stop() { unhole(); for (const el of [ale, blob, glass, bal, heldEl, air, totem, askEl, ...(arrows || []), ...(words || [])]) if (el) el.remove(); spans.clear(); ale = blob = glass = bal = heldEl = air = totem = askEl = arrows = words = null; S.answersKey = ''; S.totemOf = ''; S.wore = null; S.arrowsKey = ''; S.winSize = ''; S.winKey = ''; S.winRatio = '';
      S.built = false; S.shown = false; S.key = ''; S.sheen = ''; S.at = ''; S.blobAt = 'home'; S.disc = null; S.rider = null; S.holed = false; S.painted = -Infinity; S.sampled = -Infinity; S.last = null; },
  };
}

// =====================================================================================================================================================
// THE PURSE IN HER FRAMES (the render road). His 22:3x word: "newmac computes pixels evolutions according to nest logic, and lysa just paints to screen what
// told to paint". A glass that only blits her frames draws nothing of its own, so on the page that renders her the purse is painted INTO the engine's
// canvas after the engine's paint and before the frame is taken: it rides in the frame, under the girl the painting glass lays over it. One function paints
// it all on a 2D context, with the same law and the same places as the painter above. Its text is drawn once per line as a small picture and reused.
// COST, on the rendering machine only: one drawImage a frame of a picture 3.4 r by 2.5 r; that picture is painted 20 times a second at rest (two gradient
// fills, two strokes, Blobby, the sheen, each line of text), every frame only while a number or a crossing is in the air. While a Harmony claims him he is
// not in that picture: he is stamped on his unit1 where the engine painted it, one more drawImage a frame, and the hole of a crossing there with him.
// =====================================================================================================================================================
/** mountPurseFrames({ document, law }) -> { take(value, {rev, now}), mark(now), paint(ctx, disc, now, zoom, scale, seat), state(), stop() }.
 *  paint(): ctx is the engine canvas's own context with one unit a pixel of her square (the host saves, sets that and restores); disc as mountPurse2D's
 *  ({x, y, r, top?} in the square's px); now: the house time the frame is for; zoom: how large the square is painted on the glass; scale: the canvas's
 *  own pixels per pixel of the square; seat(unit1): as mountPurse2D's (his unit1 as the engine painted THIS frame), asked only while he rides it. null
 *  with no purse. */
export function mountPurseFrames({ document: doc, law: given = null } = {}) {
  const law = given || createPurse(), S = { paints: 0, fulls: 0, rides: 0, totems: 0, windows: 0, src: null, srcWho: null, last: null, rider: null, blob: undefined, probe: undefined, layer: null, lx: null, box: null, at: '', painted: -Infinity, dirty: false }, inked = new Map();
  const canvasOf = (w, h) => { const c = doc.createElement('canvas'); c.width = w; c.height = h; return c; };
  const blobby = () => {   // the one in the flask (WHO IS IN THE FLASK): Blobby rastered at once, a portrait once decoded (the next frame takes it)
    if (S.blob === undefined) { let c = null; try { c = canvasOf(270, 234); } catch { c = null; } S.blob = c && drawBlobby(c) ? c : null; S.blobWho = FLASK_CAST[0].id; }
    const who = law.who(); if (S.blob && who !== S.blobWho) { S.blobWho = who; wearOn(doc, S.blob, who, () => S.blobWho === who, () => { S.dirty = true; }); }
    return S.blob;
  };
  const winSrc = () => {   // THE ONE IN THE MIDDLE: what his window shows (Blobby at once, a portrait once decoded: the next frame takes it)
    const who = law.who(); if (who !== S.srcWho) { S.srcWho = who; S.src = srcOf(doc, who, (src) => { if (S.srcWho === who) { S.src = src; S.dirty = true; } }); }
    return S.src;
  };
  const totems = new Map(), totemOf = (t) => { const key = t.seat + '|' + t.initials; let c = totems.get(key); if (c !== undefined) return c; try { c = canvasOf(270, 270); } catch { c = null; } c = c && drawTotem(c, t) ? c : null; totems.set(key, c); if (totems.size > 16) totems.delete(totems.keys().next().value); return c; };   // THE SEAT STALLED ON HIS WORD: one picture per seat
  const fontOf = (t, px) => `${t.weight} ${px}px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`;
  function ink(t) {   // a line of text as a small picture at twice its size: drawn once for its words, size and colour, reused on every frame it stays the same
    const px = Math.max(6, Math.round(t.px * 2) / 2), key = t.text + '|' + px + '|' + t.color + '|' + t.weight; let e = inked.get(key); if (e) return e;
    if (S.probe === undefined) { try { S.probe = canvasOf(4, 4).getContext('2d'); } catch { S.probe = null; } }
    if (!S.probe) return null;
    S.probe.font = fontOf(t, px); const pad = Math.ceil(px * 0.7), w = Math.ceil(S.probe.measureText(t.text).width) + 2 * pad, h = Math.ceil(px * 1.2) + 2 * pad, c = canvasOf(w * 2, h * 2), x = c.getContext('2d'); if (!x) return null;
    x.scale(2, 2); x.font = fontOf(t, px); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = t.color;
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = px; x.shadowOffsetY = 0; x.fillText(t.text, w / 2, h / 2);                     // the painter's halo: 0 0 .5em rgba(0,0,0,.6)
    x.shadowColor = 'rgba(0,0,0,.9)'; x.shadowBlur = px * 0.34; x.shadowOffsetY = px * 0.166; x.fillText(t.text, w / 2, h / 2);     // 0 .083em .167em rgba(0,0,0,.9)
    x.shadowBlur = px * 0.2; x.shadowOffsetY = 0; x.fillText(t.text, w / 2, h / 2);                                                // the close edge
    x.shadowColor = 'transparent'; x.shadowBlur = 0; x.fillText(t.text, w / 2, h / 2);
    e = { c, w, h }; inked.set(key, e); if (inked.size > 32) inked.delete(inked.keys().next().value); return e;
  }
  /** draw(c, f, d, zoom): the whole purse of frame f on a 2D context whose unit is a pixel of her square */
  function draw(c, f, d, zoom) {
    paintInside(c, d.x, d.y, d.r * R_2D); const ale = paintAle(c, f, d.x, d.y);
    const g = riderOf(f, d, null);   // inside her unit0 only (his window, THE ONE IN THE MIDDLE): while a Harmony claims him (house/blobby) he is stamped on his unit1, in paint()
    const hh = g.hole && g.hole.at === 'home' ? g.hole : g.totemHole;   // the hole that opens inside her unit0: his, or the totem's (THE SEAT STALLED ON HIS WORD)
    if (hh) { c.save(); c.beginPath(); c.arc(d.x, d.y, d.r * 0.995, 0, Math.PI * 2); c.clip(); c.globalAlpha = Math.max(0, Math.min(1, hh.alpha)); paintHole(c, hh.x, hh.y, hh.r, hh.kind); c.restore(); }   // on the ale, under him, never past the shell
    if (g.totem) { const tc = totemOf(g.totem); if (tc && stampTotem(c, tc, g.totem)) S.totems++; }
    if (g.blobby && windowOn(c, g.blobby, winSrc(), surfOf(f, ale === 'fluid'), f.u)) S.windows++;
    S.rider = g; paintSheen(c, d.x, d.y, d.r);
    for (const t of textsOf(f, d, zoom)) { const e = ink(t); if (!e) continue; c.save(); c.globalAlpha = Math.max(0, Math.min(1, t.alpha)); c.translate(t.x, t.y); c.scale(t.scale, t.scale); c.drawImage(e.c, -e.w / 2, -e.h / 2, e.w, e.h); c.restore(); }
  }
  // THE CADENCE, here too: the purse is painted into a small picture of its own (her unit0 and the room its text takes: 3.4 r by 2.5 r) at 20 times a
  // second at rest, every frame only while a number is in the air or the balance pulses, and at once on a cause; every frame of hers then takes ONE
  // drawImage of that picture. Measured before it (the whole purse drawn into every frame at 60 f/s): 1.2 ms of the renderer's main thread a frame.
  function paint(ctx, d, now, zoom = 1, scale = 1, seat = null) {
    if (!ctx || !d || !(d.r > 4) || !num(now)) { S.last = null; return null; }
    law.mark(now);
    const k = num(scale) && scale > 0 ? scale : 1, where = d.x.toFixed(1) + ':' + d.y.toFixed(1) + ':' + d.r.toFixed(1) + ':' + (num(d.top) ? d.top.toFixed(1) : '') + ':' + (+zoom).toFixed(3) + ':' + k;
    if (S.dirty || !S.layer || where !== S.at || now < S.painted || now - S.painted >= PAINT_MS || law.quick(now)) {
      const f = law.frame(now, d.r, d.r * R_2D, num(d.top) ? d.top : d.r, num(d.top) && d.top < d.r ? d.top : null); S.dirty = false;
      if (!f || f.recovery) { S.last = null; S.at = ''; return null; }
      const x0 = Math.floor(d.x - 1.7 * d.r), y0 = Math.floor(d.y - 1.3 * d.r), w = Math.ceil(3.4 * d.r), h = Math.ceil(2.5 * d.r);
      if (!S.layer) { try { S.layer = canvasOf(8, 8); S.lx = S.layer.getContext('2d', { willReadFrequently: true }); } catch { S.layer = null; } if (!S.lx) { S.layer = null; return null; } }   // kept in memory: it is drawn into a canvas that is read back every frame
      if (S.layer.width !== Math.ceil(w * k) || S.layer.height !== Math.ceil(h * k)) { S.layer.width = Math.ceil(w * k); S.layer.height = Math.ceil(h * k); }
      const c = S.lx; c.setTransform(k, 0, 0, k, -x0 * k, -y0 * k); c.clearRect(x0, y0, w, h); c.globalAlpha = 1;
      draw(c, f, d, zoom); S.box = [x0, y0, w, h]; S.at = where; S.painted = now; S.last = f; S.fulls++;
    }
    if (!S.last) return null;
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    ctx.drawImage(S.layer, S.box[0], S.box[1], S.box[2], S.box[3]);
    if (S.last.rides && typeof seat === 'function') {   // HE RIDES HIS unit1: stamped where the engine painted it in this frame, with the hole a crossing opens there
      const g = riderOf(S.last, d, seat(S.last.rides.unit1)), b = g.blobby ? blobby() : null; S.rider = g;
      if (g.hole) { ctx.globalAlpha = Math.max(0, Math.min(1, g.hole.alpha)); paintHole(ctx, g.hole.x, g.hole.y, g.hole.r, g.hole.kind); ctx.globalAlpha = 1; }   // under him
      if (b && stamp(ctx, b, g.blobby)) S.rides++;
    }
    ctx.restore(); S.paints++; return S.last;
  }
  return { take: (value, o) => { const moved = law.take(value, o); if (moved) S.dirty = true; return moved; }, mark: (now) => law.mark(now), paint, touch() { S.dirty = true; },
    state: () => ({ ...law.state(), painter: 'frames', paints: S.paints, fulls: S.fulls, rides: S.rides, totems: S.totems, windows: S.windows, blobby: !!S.blob, inks: inked.size, drawn: said(S.last), rider: shown(S.rider) }),
    stop() { inked.clear(); totems.clear(); S.blob = undefined; S.src = null; S.srcWho = null; S.last = null; S.rider = null; S.layer = null; S.lx = null; S.at = ''; } };
}
