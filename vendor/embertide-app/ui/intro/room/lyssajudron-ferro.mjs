// lyssajudron-ferro.mjs - HER FERROFLUID (Oct 12 2026 08:4x WEST). His words over the onboarding's well: "can you make it so that the lyssajudron reacts
// like ferrofluid to maggnetic impulses linked to music waves peakes idk you know best, make it wonderful".
// WHAT IT DRAWS: a black liquid sealed under her porcelain (the ghost's own substance: Brock sealed in Nelo Angelo's armour) that a magnet pulls out
// through her tiles on the music. Every tile holds a cluster of Rosensweig peaks (the hexagonal lattice a ferrofluid forms in a field, its twelve
// pentagonal defects her own pentagons): a peak at the tile's centre along its normal and a ring towards its corners (six on a hexagon, five on a
// pentagon), so the spikes never cross her gold seams. At rest the liquid lies under the tiles (every peak's base FERRO.sink of its face's distance:
// hidden, and not drawn at all); on an impulse the peaks rise through the porcelain as glossy cones, sharpen as the field grows, ring as a liquid does
// and sink back. The tile her mouth (the lens) sits on holds none, and her face keeps its tiles nearly still, so Brock stays legible.
// THE IMPULSES are the house's beat (the clock every glass shares: lyssajudron-score.mjs clockOf) while a song plays (the rite's song: its state and the
// instant it took it): a surge on every beat with the bar's accents (the downbeat, the third answering, the first downbeat of four bars the strongest),
// a ripple on the offbeat, the liquid's ring after each surge. The magnet circles her once every eight bars (her light game's cycle): the side facing it
// answers first and highest, the far side a moment later (a wave through the liquid); while her light game plays (TIDE) the peaks roll round her, and
// when the ghost opens its eyes (BROCK) the liquid stands up whole. A pure function of the clock and the song: every glass raises the same spikes at
// the same instant, and a frozen clock holds them.
// COST: 203 peaks on her 32 tiles, ~13.5k vertices and ~24k triangles in one draw, only while a song plays (hidden and untouched at rest). THE SHAPE IS
// RAISED ON THE GPU (Oct 12 2026 20:5x WEST, his "if these are performance fixes, go for it" over the profile of the moment on lysa: the CPU loop over
// the 13.5k vertices took 1.3 ms of every picture there, 40 ms of every second at the song's 30 pictures): once a picture the CPU finds each peak's reach
// and its profile's exponent (203 numbers, FE_TABLE: one texel a peak in a one-row float texture) and the vertex shader raises every vertex from its
// direction, its ring's height and its tangent (FE_SHAPE: the table a ring, as the CPU did). The smoke's occlusion pass draws the well in one plain
// material, which would show the liquid at rest, under the tiles: so the mesh names a black twin raised the same (userData.occluder, well-smoke.mjs
// SELF-DRAWN OCCLUDERS), and her spikes still cut the light's shafts; the shadow modes get depth materials raised the same. The liquid's gloss is the
// well around her as a mirror sees it (her light on the blocks, the pale glass, one window's streak), added as emission: the lamps stand inside her
// and light no outer face of it.
// THE FLUX (his Oct 12 12:4x, over the well: "can you make it as if the ferrofluid was causing magnetic flux that causes the satellites to swooosh?"): the
// liquid's surge is a magnet's pulse, and its flux reaches the twelve a moment after the peaks rise: each child is flung out along the flux (the dipole's
// field, twice as strong on the magnet's axis as on its equator, the near side first) and the twelve are swept round her vertical the way the magnet travels,
// then their wires carry them home like a damped spring (a little past, then still before the next beat). fluxAt is a pure function of the clocks (every
// glass swooshes them alike); the band adds it to its reach and its turn (lyssajudron-band.mjs frame's flux), so a child never leaves its wire.
// WHO MOUNTS IT: the well (well.mjs HER FERROFLUID, its own handle: the band's flux, state()) and, since HER FERROFLUID IN THE COUNCIL (Oct 14 2026 01:4x WEST,
// his "why dont i see the synchronized ferrofluid effect across the screens my dude?"), the Lyssajudron herself for the twin (lyssajudron.mjs `ferro`, default
// true; the well passes false), on the song's word the twin folds (council-song.mjs songStateOf): the same clock, the same songOn, the same spikes at the same instant.
// THE COAT UNDER HER TILES STAYS (his order, Oct 16 2026 15:5x WEST: "i swear to god if you remove the ferrofluids i will kill you, the only thing that needs to happen is
// that the unit0 keeps all it has right now and juse the colored hexagonal faces now become glass... the rest is unchanges as it is"): the flask's landing of 16:08
// (9784f3f55) had cut the liquid under her shell in the shader (a discard where it stood inside the faces) so the fuel showed through the all-glass shell; that hunk is
// reversed here. Through the glass hexagons the black liquid is now seen under the tiles while a song plays, with its peaks through them, as in her well before the flask.
// AND EVERY BOARD CARRIES THIS LAW IN ITS OWN TEXT (Oct 14 2026 02:2x WEST, the same words of his). NestBoard.html, which tv1, the iPad and the Mac's Room tab run
// and which imports nothing, holds FERRO, MESH, surge, accentOf, fieldAt, poleAt, songOn, ferroSpikes, the patch builder, frame() and the vertex-shader law as
// FERRO-CORE (ES5, the 300 es dialect), and her-ferro.test.mjs holds that text to this file within 1e-9: it reads the two GLSL strings, MESH and the table's
// width off this file's own text. A number, frame() or the GLSL changed here is changed there too, then published (embertide-app/tools/publish-board.mjs
// --commit): the test names what differs.
// HIS HAND IS A SECOND MAGNET (Oct 14 2026 03:xx WEST, lane hand-reach; his Oct 13 03:4x "the hand motioncapped by iOS is PERFECT... i need to be able to sync
// that to the nest state"): a glass that takes his hand off the Nest's live stream (wind.hand; tools/embertide-mesh/lib/hand-reach.mjs places it and makes
// the cause) hands frame(c, on, hand) a pole (from her centre to his palm, in her axes), a field (0..1: full with the palm within 20 cm of her surface and the
// packet under 120 ms old, gone past 1.2 m or 1 s) and a pull (his palm's speed): the liquid rises on the side his hand is, the taller of the two magnets'
// peaks standing (handOf, frame), and his motion flings her twelve as the song's surge does (fluxOfHand, fluxSum). No hand: every number as before.
import { buildGoldberg } from '../poleis/orb.js';
import './her-face.js';   // HER FACE, ONE SOURCE (her-face.js): her light game and Brock's acting (tideAt, brockAt) read off globalThis.HER_FACE, as lyssajudron.mjs reads them. Not from lyssajudron.mjs any more: since HER FERROFLUID IN THE COUNCIL (Oct 14 2026) she imports this module (mountFerro), and two modules importing each other leave one empty at evaluation
import * as SC from './lyssajudron-score.mjs';
const HF = globalThis.HER_FACE, tideAt = HF.tideAt, brockAt = HF.brockAt;

export const FERRO = Object.freeze({
  accent: Object.freeze([1, 0.42, 0.72, 0.42]),   // the bar's beats: the downbeat surges, the third answers, the second and the fourth lean in
  phrase: 1.25,       // the first downbeat of every four bars
  off: 0.24,          // the offbeat's ripple (the eighth between two beats)
  rise_ms: 26,        // the field's rise after an impulse (a surge peaks ~60 ms after its beat)
  fall: 0.3,          // the field's fall, in beats (most of a surge is gone before the next beat: the beats stay apart)
  ring_hz: 7.5,       // the liquid rings after a surge, this many times a second,
  ring: 0.2,          // this deep, dying twice as fast as the field
  lag_ms: 70,         // the far side of her answers the magnet this much later than the near side
  orbit_bars: 8,      // the magnet circles her once every eight bars
  // his Oct 12 12:3x "can you make the ferrofluid amplitudes much more pronounced please?" over the onboarding's well: reach 0.42/0.28 -> 0.68/0.46 (a
  // tip at most ~1.8 of her radius, short of the twelve's inner edge ~2.1), her face spared 0.55 -> 0.3 (the well's eye looks at her face), the far
  // side's floor 0.3 -> 0.5, the feet a little fatter so the taller peaks stay cones, never hair
  reach: Object.freeze([0.68, 0.46]),   // the peaks' reach above their base, in her radius: a tile's centre, its ring
  sharp: Object.freeze([0.85, 1.9]),    // the profile's exponent, from a weak field (domes) to a full one (cones with hollow flanks, a ferrofluid's)
  sink: 0.965,        // the liquid at rest: every base this fraction of its face's distance from her centre (under the tile)
  ringAt: 0.5,        // the ring's peaks: half way from the tile's centre to its corners
  span: Object.freeze([1.0, 0.7]),      // a peak's foot, in the angle between the centre's peak and the ring's: the feet meet, one black pool a tile
  fade_ms: 900,       // a song starting or stopping: the liquid wakes or settles over this
  far: 0.5,           // the far side's share of the near side's pull (the magnet's wave still reads, the whole of her answers)
  face: 0.3,          // how much of the field her face (towards the lens) is spared, from 44 degrees round the lens to 18
  mouth: 0.906,       // no peak within 25 degrees of the lens (its disc and bezel span ~22): her mouth stays clear
  lens: Object.freeze([0, 0.08, 0.98]),  // the lens's direction from her centre (lyssajudron.mjs: lens at K * (0, 0.08, 0.98))
});
export const FLUX = Object.freeze({
  travel_ms: 45,      // the flux reaches the twelve this long after the liquid's surge: the peaks rise first, then the twelve go
  rise: 0.16,         // a child's swoosh peaks this many beats after the flux reaches it (their mass on their wires)
  damp: 0.6,          // the spring's damping: home ~9 % past, then still before the next beat
  out: 0.22,          // a child flung out at the phrase's one on the magnet's axis, a share of its distance from her (half that on the magnet's equator)
  whip: 0.32,         // the twelve swept round her vertical the magnet's way at the phrase's one, radians (~18 degrees)
});
const MESH = Object.freeze([{ R: 6, S: 16 }, { R: 5, S: 12 }]);   // a peak's patch: rings out to its foot, vertices a ring (the centre's, the ring's)

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const smooth01 = (v) => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** surge(t, beat_ms, fall): the field and the liquid's ring t ms after one impulse of unit strength (the field's peak 1, the ring over it; 0 before it);
 *  fall: the field's fall in beats (the offbeat's ripple falls twice as fast). */
export function surge(t, beat_ms, fallBeats = FERRO.fall) {
  if (!(t >= 0) || !(beat_ms > 0)) return 0;
  const r = FERRO.rise_ms, fall = fallBeats * beat_ms, at = r * Math.log(1 + fall / r);
  const field = ((1 - Math.exp(-t / r)) * Math.exp(-t / fall)) / ((1 - Math.exp(-at / r)) * Math.exp(-at / fall));
  return t > at ? field + FERRO.ring * Math.exp(-(t - at) / (fall * 0.5)) * Math.sin((2 * Math.PI * FERRO.ring_hz * (t - at)) / 1000) : field;
}
/** accentOf(beat, beats_per_bar): the strength of the impulse on that beat of the grid. */
export function accentOf(beat, bpb = 4) {
  const n = Math.max(1, Math.round(bpb) || 4), i = ((beat % n) + n) % n, bar = Math.floor(beat / n);
  return FERRO.accent[i % FERRO.accent.length] * (i === 0 && ((bar % 4) + 4) % 4 === 0 ? FERRO.phrase : 1);
}
/** fieldAt(clock, lag_ms): the magnet's pull at the clock's instant, lag_ms late: the last three beats and their offbeats, a soft knee over 0.8 (0 to ~1.1). */
export function fieldAt(c, lag_ms = 0) {
  if (!c || !num(c.beat_ms) || !(c.beat_ms > 0) || !num(c.beat) || !num(c.beat_phase)) return 0;
  const B = c.beat_ms, x = c.beat_phase * B - (num(lag_ms) ? lag_ms : 0); let sum = 0;
  for (let j = 0; j < 3; j++) { const t = x + j * B; sum += accentOf(c.beat - j, c.beats_per_bar) * surge(t, B) + FERRO.off * surge(t - B / 2, B, FERRO.fall / 2); }
  return sum <= 0.8 ? Math.max(0, sum) : 0.8 + (sum - 0.8) / (1 + 2 * (sum - 0.8));
}
/** poleAt(clock): where the magnet stands, a unit direction in her own axes: once round her every orbit_bars bars, swaying above and below her equator. */
export function poleAt(c) {
  const bars = c && num(c.bar) && num(c.bar_phase) ? c.bar + c.bar_phase : 0, th = (2 * Math.PI * bars) / FERRO.orbit_bars, ph = 0.45 * Math.sin((Math.PI * bars) / FERRO.orbit_bars);
  return [Math.sin(th) * Math.cos(ph), Math.sin(ph), Math.cos(th) * Math.cos(ph)];
}
/** songOn(song, now_ms): how awake the liquid is, 0..1. song: {state, since_ms} (the rite's song: its state and the stamp of the cause that set it);
 *  a song playing wakes it over fade_ms from that stamp, any other state settles it over the same. */
export function songOn(song, now_ms) {
  if (!song || typeof song !== 'object' || !num(now_ms)) return 0;
  const u = num(song.since_ms) ? smooth01((now_ms - song.since_ms) / FERRO.fade_ms) : 1;
  return song.state === 'playing' ? u : 1 - u;
}

/** handOf(hand): HIS HAND AS A MAGNET (Oct 14 2026, lane hand-reach; tools/embertide-mesh/lib/hand-reach.mjs handCause): a cause { pole: a unit direction
 *  from her centre to his palm in her own axes, field: 0..1 } as frame() and fluxOfHand take it, its pole made unit and its field clamped; null when it is
 *  none (no cause, no pole, a field under 0.002). The song's magnet is poleAt and fieldAt; his hand's is this, and the two stand together in frame(). */
export function handOf(hand) {
  if (!hand || typeof hand !== 'object' || !Array.isArray(hand.pole) || hand.pole.length !== 3 || !hand.pole.every(num) || !num(hand.field)) return null;
  const f = Math.max(0, Math.min(1, hand.field)); if (!(f > 0.002)) return null;
  const l = Math.hypot(hand.pole[0], hand.pole[1], hand.pole[2]); if (!(l > 1e-9)) return null;
  return { pole: [hand.pole[0] / l, hand.pole[1] / l, hand.pole[2] / l], field: f, pull: num(hand.pull) ? Math.max(0, Math.min(1, hand.pull)) : 0 };
}

/** swoosh(t, beat_ms): a child's answer t ms after one flux pulse of unit strength: a damped spring's impulse answer, 1 at FLUX.rise beats, a little past
 *  home after it (FLUX.damp), still before the next beat; 0 before the pulse. */
export function swoosh(t, beat_ms) {
  if (!(t > 0) || !(beat_ms > 0)) return 0;
  const z = FLUX.damp, q = Math.sqrt(1 - z * z), tp = FLUX.rise * beat_ms, b = Math.atan2(q, z) / tp, a = (z / q) * b;   // the peak where tan(b t) = b / a
  return (Math.exp(-a * t) * Math.sin(b * t)) / (Math.exp(-a * tp) * Math.sin(b * tp));
}
/** kickOf(beat, beats_per_bar): the flux's pulse on that beat, the impulse's accent squared and the phrase's one 1: the one and the three carry the twelve,
 *  the two and the four barely stir them, the offbeats not at all (the liquid ripples; the twelve are heavier). */
export function kickOf(beat, bpb = 4) { const a = accentOf(beat, bpb) / (FERRO.accent[0] * FERRO.phrase); return a * a; }
/** pullAt(clock, lag_ms): the flux's swoosh at the clock's instant, lag_ms late: the last three beats' pulses through the spring (0 at rest, ~1 at the
 *  phrase's one, a little below 0 as it overshoots home). */
export function pullAt(c, lag_ms = 0) {
  if (!c || !num(c.beat_ms) || !(c.beat_ms > 0) || !num(c.beat) || !num(c.beat_phase)) return 0;
  const B = c.beat_ms, x = c.beat_phase * B - (num(lag_ms) ? lag_ms : 0); let sum = 0;
  for (let j = 0; j < 3; j++) sum += kickOf(c.beat - j, c.beats_per_bar) * swoosh(x + j * B, B);
  return sum;
}
/** fluxAt(clock, on, place) -> {out, turn, pull}: her ferrofluid's pull on the twelve at the clock's instant (the song's: the liquid's), as strong as her
 *  liquid is (on: the well's songOn times the song's intensity, as her peaks); place: the clock that placed the twelve on their wires (the score's
 *  satelliteAt), the song's own when none. out[seat]: how far each child is flung out along the flux, a share of its distance from her (the dipole's
 *  field on its direction from her, sqrt(1 + 3 cos^2) / 2: 1 on the magnet's axis, 1/2 on its equator; the side facing the magnet first, as her peaks);
 *  turn: the twelve swept round her vertical the way the magnet travels (radians, + as the band's turn). All 0 while no song plays. */
export function fluxAt(clock, on = 0, place = null) {
  const out = new Float64Array(SC.SEATS), w = num(on) ? Math.max(0, Math.min(1, on)) : 0;
  if (!(w > 0.002) || !clock) return { out, turn: 0, pull: 0 };
  const pole = poleAt(clock), pc = place || clock, pull = pullAt(clock, FLUX.travel_ms);
  for (let s = 0; s < SC.SEATS; s++) {
    const d = unit(SC.satelliteAt(s, pc)), c = dot(d, pole), toward = (1 + c) / 2;
    out[s] = FLUX.out * w * (Math.sqrt(1 + 3 * c * c) / 2) * pullAt(clock, FLUX.travel_ms + FERRO.lag_ms * (1 - toward));
  }
  return { out, turn: FLUX.whip * w * Math.hypot(pole[0], pole[2]) * pull, pull };
}
/** fluxOfHand(hand, place) -> {out, turn, pull}: HIS HAND'S FLUX on the twelve, in fluxAt's units: his palm's motion (hand.pull, pullAt's units) flings each child
 *  out along the dipole's field about his hand's pole (sqrt(1 + 3 cos^2) / 2, as the song's magnet does) by FLUX.out times the hand's field, and sweeps the
 *  twelve round her vertical by FLUX.whip times the same; place: the clock that placed the twelve (satelliteAt). All 0 with no hand, no place or a still hand.
 *  A glass adds it to fluxAt's (fluxSum) and hands the band one flux. */
export function fluxOfHand(hand, place = null) {
  const out = new Float64Array(SC.SEATS), h = handOf(hand);
  if (!h || !place || !(h.pull > 0.002)) return { out, turn: 0, pull: 0 };
  for (let s = 0; s < SC.SEATS; s++) { const d = unit(SC.satelliteAt(s, place)), c = dot(d, h.pole); out[s] = FLUX.out * h.field * (Math.sqrt(1 + 3 * c * c) / 2) * h.pull; }
  return { out, turn: FLUX.whip * h.field * Math.hypot(h.pole[0], h.pole[2]) * h.pull, pull: h.pull };
}
/** HER SPELL'S FLUX ON THE TWELVE (lane the-two-hands-cast, Oct 24 2026; his Sept 14 19:44 "I CAN CAST SPELLS WHERE THE SWARM MOVES TO TOPOLOGICAL PLACES UNTIL
 *  DONE", Oct 18 06:36 "for the lyssajudron can't you make up some spells?"): a cast on the Nest (spell.cast, spell-book.mjs castOf: { spell, at_ms }) moves her
 *  twelve on every glass the same way for its beats, in fluxAt's units, by the house clock (at_ms the cast's instant, now_ms the glass's): THE SWARMSPELL flings
 *  them all out and sweeps them round for a bar; the BOLT strikes along one side for two beats; THE KNIGHTIAN WIND is a gust (a turn, little fling) for a beat
 *  and a quarter; THE BLACKHOLE pulls them in and turns them the other way; THE SAGITTARIUS ARMOR holds them out and gilds (`gold` 0..1, for a band that takes
 *  it) for a bar; THE POST-IT and the DICE are a touch and a tumble; SUMMONING a rise. Every number here is the lane's choice until his hand; every spell's
 *  envelope is one shape (SPELL_ENV: in over a sixth, out over the last third). After its beats a spell is nothing: a glass holds no cause. */
export const SPELL_FLUX = Object.freeze({
  storm: Object.freeze({ beats: 4, out: 0.9, turn: 2.0, pull: 1, every: 0.25 }), bolt: Object.freeze({ beats: 2, out: 1.2, turn: 0, pull: 1, side: 1 }),
  wind: Object.freeze({ beats: 1.25, out: 0.3, turn: 1.5, pull: 0.6 }), blink: Object.freeze({ beats: 1.5, out: -0.8, turn: -1.0, pull: 0.8 }),
  armor: Object.freeze({ beats: 4, out: 0.5, turn: 0.3, pull: 1, gold: 1 }), postit: Object.freeze({ beats: 0.5, out: 0.2, turn: 0, pull: 0.3 }),
  dice: Object.freeze({ beats: 1, out: 0.6, turn: 3.0, pull: 0.7, tumble: 1 }), summon: Object.freeze({ beats: 2, out: 0.7, turn: 0.5, pull: 0.8 }),
  necro: Object.freeze({ beats: 2, out: -0.5, turn: 0.4, pull: 0.5 }), freeze: Object.freeze({ beats: 1, out: 0, turn: 0, pull: 0 }),
});
export const SPELL_ENV = Object.freeze({ in: 1 / 6, out: 1 / 3 });
/** spellU(cast, now_ms, beat_ms) -> 0..1 how far through its beats a cast is at now_ms, or null when none, before it, past it, or the clock is not a clock. */
export function spellU(cast, now_ms, beat_ms) {
  if (!cast || typeof cast !== 'object' || !num(cast.at_ms) || !num(now_ms) || !num(beat_ms) || !(beat_ms > 0)) return null;
  const sh = SPELL_FLUX[cast.spell]; if (!sh) return null;
  const u = (now_ms - cast.at_ms) / (beat_ms * sh.beats); return u >= 0 && u <= 1 ? u : null;
}
/** spellEnv(u): the one envelope, 0..1: in over SPELL_ENV.in, full, out over the last SPELL_ENV.out. */
export function spellEnv(u) { return smooth01(u / SPELL_ENV.in) * (1 - smooth01((u - (1 - SPELL_ENV.out)) / SPELL_ENV.out)); }
/** fluxOfSpell(cast, now_ms, beat_ms, place) -> {out, turn, pull, gold, spell, u} in fluxAt's units, or null when the cast is none or over (nothing at rest). */
export function fluxOfSpell(cast, now_ms, beat_ms, place = null) {
  const u = spellU(cast, now_ms, beat_ms); if (u === null) return null;
  const sh = SPELL_FLUX[cast.spell], env = spellEnv(u), out = new Float64Array(SC.SEATS);
  const pulse = sh.every ? 0.5 + 0.5 * Math.max(0, Math.cos(2 * Math.PI * (u * sh.beats) / sh.every)) : 1;   // THE SWARMSPELL beats every quarter (the fight's every_beats)
  for (let s = 0; s < SC.SEATS; s++) {
    const k = sh.side ? (s % 2 === 0 ? 1 : 0.25) : sh.tumble ? (s % 3 === 0 ? 1 : 0.35) : 1;
    out[s] = FLUX.out * sh.out * env * pulse * k;
  }
  return { out, turn: FLUX.whip * sh.turn * env * (sh.every ? u : 1), pull: sh.pull * env, gold: (sh.gold || 0) * env, spell: cast.spell, u };
}
/** fluxSum(a, b): two fluxes as one (the song's and his hand's): the flings added seat by seat, the turns added, the pull the greater; either may be null. */
export function fluxSum(a, b) {
  if (!a) return b; if (!b) return a;
  const out = new Float64Array(SC.SEATS); for (let s = 0; s < SC.SEATS; s++) out[s] = (a.out ? a.out[s] : 0) + (b.out ? b.out[s] : 0);
  return { out, turn: (a.turn || 0) + (b.turn || 0), pull: Math.max(a.pull || 0, b.pull || 0) };
}

/** ferroSpikes(skin, {lens}): her peaks, a cluster a tile: {axis, span (rad), base (her radius), kind (0 the tile's centre, 1 its ring), seed, face};
 *  none under her mouth (the lens straddles two hexagons' seam: no peak within FERRO.mouth of it). skin: orb.js buildGoldberg(1, 1) (unit0's), each face {normal, verts} on the unit skin. */
export function ferroSpikes(skin = buildGoldberg(1, 1), { lens = FERRO.lens } = {}) {
  const L = unit(lens), out = [];
  skin.faces.forEach((f, fi) => {
    const n = unit(f.normal), h = dot(f.verts[0], n), k = f.verts.length;
    const c = f.verts.reduce((a, v) => [a[0] + v[0] / k, a[1] + v[1] / k, a[2] + v[2] / k], [0, 0, 0]);
    const ring = f.verts.map((v) => unit([c[0] + FERRO.ringAt * (v[0] - c[0]), c[1] + FERRO.ringAt * (v[1] - c[1]), c[2] + FERRO.ringAt * (v[2] - c[2])]));
    const d = Math.acos(Math.min(1, Math.max(-1, dot(n, ring[0])))), base = FERRO.sink * h;
    const put = (axis, kind, i) => { if (dot(axis, L) <= FERRO.mouth) out.push({ axis, span: FERRO.span[kind] * d, base, kind, seed: seedOf(fi, i), face: fi }); };
    put(n, 0, 0); ring.forEach((a, i) => put(a, 1, i + 1));
  });
  return out;
}
function seedOf(face, i) { let h = Math.imul((face * 16 + i) ^ 0x9e3779b9, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

// the liquid's gloss: the well around her as a mirror sees it (view space: +y up the glass, +z towards the eye)
const FE_ENV_GLSL = `
vec3 feEnv(vec3 R) {
  vec3 walls = uFeLight * (0.16 + 0.95 * smoothstep(-0.35, 1.0, R.y));
  float glass = smoothstep(0.5, 0.95, R.z), streak = smoothstep(0.86, 0.99, dot(R, normalize(vec3(-0.45, 0.62, 0.64))));
  return walls + vec3(1.0, 0.96, 0.9) * (0.4 * glass + 2.2 * streak);
}`;
// THE SHAPE, RAISED IN THE VERTEX SHADER: a vertex is its direction (the `normal` attribute: its peak's axis turned out to its ring), its ring's height
// up the profile (fu.x: 1 at the tip, 0 at the foot; fu.y: 1 at the tip and the foot, where the flank lies flat) and its tangent towards the axis (ftan);
// its peak's numbers this picture are a texel of the table (fsp: which): x the reach H (her radius), y the profile's exponent p, z the span, w the base.
// r = base + H u^p; the normal N = r n + r'(theta) t with r' = -H p u^(p-1) / span (the flank leans away from the peak). A vertex of another object drawn
// in a material that carries this (the smoke's plain material never does: the twin is its own mesh) would have fu = 0 and stay where it is.
const FE_VERT_DECL = `uniform sampler2D uFeTab; uniform float uFeN; uniform float uFeRadius;
attribute vec3 ftan; attribute vec2 fu; attribute float fsp;`;
const FE_SHAPE = `vec4 fe = texture2D(uFeTab, vec2((fsp + 0.5) / uFeN, 0.5));
  float feProf = fu.x <= 0.0 ? 0.0 : pow(fu.x, fe.y), feR = fe.w + fe.x * feProf;
  float feDr = (fu.y > 0.5 || fu.x <= 0.0) ? 0.0 : -(fe.x * fe.y * pow(fu.x, fe.y - 1.0)) / fe.z;`;
/** shapeIn(uniforms) -> (shader, withNormal) => void: an onBeforeCompile hand that raises the peaks in any of three.js's materials (the liquid's standard
 *  material with its normal; the plain, depth and distance materials with the position alone). uniforms: {uFeTab, uFeN, uFeRadius}, shared by reference. */
export function shapeIn(uniforms) {
  return (sh, withNormal) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>\n${FE_VERT_DECL}`)
      .replace('#include <beginnormal_vertex>', withNormal ? `${FE_SHAPE}\n  vec3 objectNormal = normalize(feR * normal + feDr * ftan);` : '#include <beginnormal_vertex>')
      .replace('#include <begin_vertex>', `${withNormal ? '' : FE_SHAPE}\n  vec3 transformed = normal * (feR * uFeRadius);`);
  };
}
/** shapedVertex(out, v, attrs, tab, radius): FE_SHAPE in JS, for proofs: vertex v's place {p} and normal {n} given the geometry's attributes
 *  ({normal, ftan, fu, fsp}: their arrays) and the table (Float32Array, 4 a peak), her radius. */
export function shapedVertex(out, v, { normal, ftan, fu, fsp }, tab, radius) {
  const o = v * 3, i = fsp[v] * 4, H = tab[i], p = tab[i + 1], span = tab[i + 2], base = tab[i + 3], u = fu[v * 2], edge = fu[v * 2 + 1] > 0.5;
  const prof = u <= 0 ? 0 : Math.pow(u, p), r = base + H * prof, dr = edge || u <= 0 ? 0 : -(H * p * Math.pow(u, p - 1)) / span;
  const nx = r * normal[o] + dr * ftan[o], ny = r * normal[o + 1] + dr * ftan[o + 1], nz = r * normal[o + 2] + dr * ftan[o + 2], l = Math.hypot(nx, ny, nz) || 1;
  out.p = [normal[o] * r * radius, normal[o + 1] * r * radius, normal[o + 2] * r * radius]; out.n = [nx / l, ny / l, nz / l]; return out;
}
/** ferroMaterial(THREE, light, shape): the liquid: near black, glossy, its reflections the well's (light: a THREE.Color held by reference, her light's hue);
 *  shape: shapeIn(...)'s hand, raising the peaks (none: the geometry as it is). */
export function ferroMaterial(T, light = null, shape = null) {
  const m = new T.MeshStandardMaterial({ color: 0x07070a, roughness: 0.13, metalness: 0 });
  m.userData.light = light && light.isColor ? light : new T.Color(0xffc98a);
  m.onBeforeCompile = (sh) => {
    if (shape) shape(sh, true);
    sh.uniforms.uFeLight = { value: m.userData.light };
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>\nuniform vec3 uFeLight;\n${FE_ENV_GLSL}`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
  { vec3 feN = normalize(normal), feV = normalize(vViewPosition), feR = reflect(-feV, feN);
    float feF = 0.04 + 0.96 * pow(1.0 - clamp(dot(feN, feV), 0.0, 1.0), 5.0);
    totalEmissiveRadiance += feEnv(feR) * mix(0.2, 1.0, feF); }`);
  };
  m.customProgramCacheKey = () => (shape ? 'lyssa-ferro-3-gpu' : 'lyssa-ferro-2');
  return m;
}

/** mountFerro(THREE, {radius, light, skin}) -> {mesh, frame(clock, on), vertex(v), state(), dispose()}. The mesh goes on her body (its own axes, her radius
 *  `radius`); frame() shapes the liquid for the clock's instant with the song's wakefulness `on` (songOn), or hides it when on is 0; vertex(v) is vertex v
 *  as the GPU raises it this picture ({p, n}: for proofs). */
export function mountFerro(T, { radius = 1, light = null, skin = null } = {}) {
  const spikes = ferroSpikes(skin || buildGoldberg(1, 1)), NS = spikes.length, TW = 256;   // the table: a texel a peak, one row
  let nv = 0, ni = 0; for (const s of spikes) { const { R, S } = MESH[s.kind]; s.v0 = nv; nv += 1 + R * S; ni += 3 * S * (2 * R - 1); }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), ftan = new Float32Array(nv * 3), fu = new Float32Array(nv * 2), fsp = new Float32Array(nv), idx = nv < 65536 ? new Uint16Array(ni) : new Uint32Array(ni);
  let w = 0;
  spikes.forEach((s, si) => {   // a polar patch round the peak's axis: the tip, then R rings of S vertices out to its foot; at rest every vertex lies at its base (under the tile)
    const { R, S } = MESH[s.kind], a = s.axis, e1 = unit(Math.abs(a[1]) < 0.9 ? cross(a, [0, 1, 0]) : cross(a, [1, 0, 0])), e2 = cross(a, e1), rest = s.base * radius;
    nor.set(a, s.v0 * 3); pos[s.v0 * 3] = a[0] * rest; pos[s.v0 * 3 + 1] = a[1] * rest; pos[s.v0 * 3 + 2] = a[2] * rest; fu[s.v0 * 2] = 1; fu[s.v0 * 2 + 1] = 1; fsp[s.v0] = si;   // the tip: its normal the axis's
    for (let j = 1; j <= R; j++) {
      const th = (s.span * j) / R, ct = Math.cos(th), st = Math.sin(th), u = 1 - j / R;
      for (let q = 0; q < S; q++) {
        const ps = (2 * Math.PI * q) / S, v = s.v0 + 1 + (j - 1) * S + q, o = v * 3, rd = [Math.cos(ps) * e1[0] + Math.sin(ps) * e2[0], Math.cos(ps) * e1[1] + Math.sin(ps) * e2[1], Math.cos(ps) * e1[2] + Math.sin(ps) * e2[2]];
        nor[o] = ct * a[0] + st * rd[0]; nor[o + 1] = ct * a[1] + st * rd[1]; nor[o + 2] = ct * a[2] + st * rd[2];
        pos[o] = nor[o] * rest; pos[o + 1] = nor[o + 1] * rest; pos[o + 2] = nor[o + 2] * rest;
        ftan[o] = st * a[0] - ct * rd[0]; ftan[o + 1] = st * a[1] - ct * rd[1]; ftan[o + 2] = st * a[2] - ct * rd[2];   // towards the axis along the sphere (-d dir/d theta)
        fu[v * 2] = u; fu[v * 2 + 1] = j === R ? 1 : 0; fsp[v] = si;   // the foot (under the tile) lies flat
      }
    }
    const ring = (j, q) => s.v0 + 1 + (j - 1) * S + (q % S);
    for (let q = 0; q < S; q++) { idx[w++] = s.v0; idx[w++] = ring(1, q); idx[w++] = ring(1, q + 1); }
    for (let j = 1; j < R; j++) for (let q = 0; q < S; q++) { const a0 = ring(j, q), a1 = ring(j, q + 1), b0 = ring(j + 1, q), b1 = ring(j + 1, q + 1); idx[w++] = a0; idx[w++] = b0; idx[w++] = b1; idx[w++] = a0; idx[w++] = b1; idx[w++] = a1; }
  });
  const geo = new T.BufferGeometry();
  geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('normal', new T.BufferAttribute(nor, 3)); geo.setAttribute('ftan', new T.BufferAttribute(ftan, 3));
  geo.setAttribute('fu', new T.BufferAttribute(fu, 2)); geo.setAttribute('fsp', new T.BufferAttribute(fsp, 1)); geo.setIndex(new T.BufferAttribute(idx, 1));
  // FE_TABLE: each peak's reach and exponent this picture (x, y), its span and its base (z, w: written once); a float texel a peak, read in the vertex shader
  const tab = new Float32Array(TW * 4), tex = new T.DataTexture(tab, TW, 1, T.RGBAFormat, T.FloatType);
  tex.minFilter = T.NearestFilter; tex.magFilter = T.NearestFilter; tex.generateMipmaps = false; tex.needsUpdate = true;
  spikes.forEach((s, i) => { tab[i * 4 + 2] = s.span; tab[i * 4 + 3] = s.base; });
  const FU = { uFeTab: { value: tex }, uFeN: { value: TW }, uFeRadius: { value: radius } }, shape = shapeIn(FU);
  const mat = ferroMaterial(T, light, shape), mesh = new T.Mesh(geo, mat);
  mesh.name = 'ferro'; mesh.frustumCulled = false; mesh.raycast = () => {}; mesh.renderOrder = 5; mesh.visible = false;   // never a hand's target: a pick goes through to her
  // the black twin for the smoke's occlusion picture (SELF-DRAWN OCCLUDERS, well-smoke.mjs: drawn at the mesh's place, after the plain pass), and the depth
  // materials the shadow modes draw her liquid with (well-shadow.mjs: the blaze is a point light, MeshDistanceMaterial), all raised the same
  const black = new T.Mesh(geo, new T.MeshBasicMaterial({ color: 0x000000, fog: false })); black.material.onBeforeCompile = (sh) => shape(sh, false); black.material.customProgramCacheKey = () => 'lyssa-ferro-black-1';
  black.name = 'ferro-occluder'; black.frustumCulled = false; black.raycast = () => {}; black.matrixAutoUpdate = false; mesh.userData.occluder = black;
  mesh.customDepthMaterial = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking }); mesh.customDepthMaterial.onBeforeCompile = (sh) => shape(sh, false); mesh.customDepthMaterial.customProgramCacheKey = () => 'lyssa-ferro-depth-1';
  mesh.customDistanceMaterial = new T.MeshDistanceMaterial(); mesh.customDistanceMaterial.onBeforeCompile = (sh) => shape(sh, false); mesh.customDistanceMaterial.customProgramCacheKey = () => 'lyssa-ferro-distance-1';
  const L = unit(FERRO.lens);
  const S0 = { field: 0, on: 0, shaped: 0, peak: 0, hand: 0 };
  /** frame(c, on, hand): the liquid shaped for the clock's instant, as awake as the song keeps it (on: songOn) and as HIS HAND keeps it (hand: handOf's cause,
   *  lib/hand-reach.mjs handCause; null: none). Two magnets: the song's circles her on the beat (poleAt, fieldAt); his hand stands where his palm is and pulls
   *  by its field, the near side first and highest and the far side FERRO.far of it, as the song's does; at each peak the taller of the two stands. With no
   *  hand every number is as it was (her-ferro.test.mjs holds the Board's twin to this to 1e-9); with no song and a hand the liquid wakes for the hand alone. */
  function frame(c, on, hand = null) {
    S0.on = num(on) ? Math.max(0, Math.min(1, on)) : 0; const h = handOf(hand); S0.hand = h ? h.field : 0;
    if ((!(S0.on > 0.002) && !h) || !c) { if (mesh.visible) mesh.visible = false; S0.field = 0; S0.peak = 0; return false; }
    const pole = poleAt(c), bars = num(c.bar) && num(c.bar_phase) ? c.bar + c.bar_phase : 0, tide = tideAt(bars), ghost = brockAt(c).ghost;
    let fieldSum = 0, peak = 0;
    for (let i = 0; i < NS; i++) {
      const s = spikes[i], toward = (1 + dot(s.axis, pole)) / 2, gain = FERRO.far + (1 - FERRO.far) * toward * Math.sqrt(toward);
      let F = fieldAt(c, FERRO.lag_ms * (1 - toward) + 12 * s.seed);
      if (tide > 0) { const az = Math.atan2(s.axis[0], s.axis[2]); F = F * (1 - 0.45 * tide) + 0.7 * tide * (0.5 + 0.5 * Math.sin(2 * Math.PI * 2 * bars - 2 * az)); }   // the light game: the peaks roll round her
      if (ghost > 0) F = Math.max(F, 0.95 * ghost);   // the ghost opens its eyes: the liquid stands up whole
      const spare = 1 - FERRO.face * smooth01((dot(s.axis, L) - 0.72) / 0.23); let H = FERRO.reach[s.kind] * S0.on * F * gain * spare * (0.85 + 0.3 * s.seed), Fx = F;
      if (h) { const th = (1 + dot(s.axis, h.pole)) / 2, Fh = h.field * (FERRO.far + (1 - FERRO.far) * th * Math.sqrt(th)), Hh = FERRO.reach[s.kind] * Fh * spare * (0.85 + 0.3 * s.seed); if (Hh > H) { H = Hh; Fx = Fh; } }   // HIS HAND: the second magnet; the taller peak stands
      tab[i * 4] = H; tab[i * 4 + 1] = FERRO.sharp[0] + (FERRO.sharp[1] - FERRO.sharp[0]) * Math.min(1, Fx);   // its reach and its profile's exponent: the GPU raises its vertices from these
      fieldSum += Fx; if (H > peak) peak = H;
    }
    tex.needsUpdate = true;
    S0.field = fieldSum / NS; S0.peak = peak; S0.shaped++; if (!mesh.visible) mesh.visible = true;
    return true;
  }
  const attrs = { normal: nor, ftan, fu, fsp };
  return {
    mesh, frame, vertex: (v) => shapedVertex({}, v, attrs, tab, radius),
    state: () => ({ peaks: NS, vertices: nv, triangles: ni / 3, on: Math.round(S0.on * 1000) / 1000, hand: Math.round(S0.hand * 1000) / 1000, field: Math.round(S0.field * 1000) / 1000, reach: Math.round(S0.peak * 1000) / 1000, shaped: S0.shaped, shown: mesh.visible, placed: 'on the GPU' }),   // hand: HIS HAND's field on the liquid this picture (0: none)
    dispose() { mesh.parent?.remove(mesh); geo.dispose(); mat.dispose(); black.material.dispose(); mesh.customDepthMaterial.dispose(); mesh.customDistanceMaterial.dispose(); tex.dispose(); },
  };
}
