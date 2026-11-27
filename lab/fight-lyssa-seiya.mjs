// fight-lyssa-seiya.mjs: THE LYSSAJUDRON AGAINST SEIYA IN THE BRONZE PEGASUS CLOTH, A LAW OVER CAUSES (lane fight-lyssa-seiya, Oct 18 2026).
// His words, Oct 18 2026 WEST, in the warden's chat: 06:2x "bronze is the standard saint seya stuff"; 06:3x "do you think you got enough material
// to simulate a fight between the lyssajudron and saint-seya bronze?"; then "brother... be resourceful?"; 06:36 "for the lyssajudron can't you make
// up some spells? ... in the traces we had there is a shit load of spells names i said exactly in many recordings what were the controls supposed
// to be" (the warden's word, so her moves are his spells by his names, hypertraced: THE SPELL BOOK in lab/FIGHT-LYSSA-SEIYA.md).
//
// WHAT IT IS: one pure function of the causes. planFight({measured, bodies, causes}) steps the fight tick by tick in its own time (in-game time) and
// returns the plan: Seiya's state at every tick, her spells, every hit, every freeze, the fall. stateAt(plan, wall_ms) reads the plan at any instant
// of the wall clock. No clock is read here, no random number is drawn, nothing is fetched (the test greps for them): the same causes give the same
// fight on every glass, and a cause added at a beat changes nothing before that beat.
//
// THE TWO CLOCKS (plans/the-fight-that-scans-the-room.md, "Two clocks", his Sept 6 to Oct 15 words there): in-game time moves only while the fight
// moves and freezes at every hit, the pose held (TIME FREEZE, his first spell); the wall clock never stops. Every freeze holds a whole number of
// sixteenths of the song's grid, so in-game beats stay on the wall's grid of sixteenths (the music is the ruler).
// HIS HALF, measured (lab/seiya-fight.hades.json, tools/fight-measure.mjs, from the two sessions begun from his Oct 4 07:36:55 savestate; and
// lab/seiya-bodies.hades.json, tools/fight-bodies.mjs, his body through the hero's three): at a distance he does what he did. Each time he stands in
// his stance he takes the recorded choice whose starting distance is nearest the distance to her now (after a hit, one of the two he made right after
// his hit reaction), waits the stance the recording held before it, and plays its clip for as long as the recording played it, at the recorded speed
// (1.2 for the steps), moving by the clip's own root motion (the disc's waist keys) and never closer to her than the recorded contact (8.0 units).
// His meteor (64.4000) lands on the measured line (counter 11.26 at the contact, 20.86 at 66.06 units: the projectile); his punch (59.3040) at
// counter 15.6 when his left fist is within 0.27 m of her centre (how far it was from Cancer's axis when it landed). Hit, he reacts as he reacted to
// the recorded hit of nearest weight (33.1060, its frames and its travel); knocked down, he plays the game's own fall, floor and rise (53.1270,
// 50.1240, 52.1260, as long as the recording held each); felled, his body goes to the ragdoll (lab/fight-fall.mjs).
// HER HALF, his spells (THE SPELL BOOK): the left hand's three-way lever selects, the right hand casts (his Sept 15 19:45 and Sept 18 00:09): a
// cause is {beat, lever, cast}, its spell by SPELLS below (the mapping of spell to move is the warden's reading and this lane's, never his word).
// Her body is her own modules' (lyssajudron-score.mjs: her lanes, her sizes, her bob on the beat and her dip on the downbeat).
//
// THE FIGHT FOR HARLEYQUINTITI (Oct 24 2026; protect: true). His words, WEST: 17:57 "brother... i want to see me fighting as saint seya vs the
// lyssajudron to protect harleyquintiti ok?"; Oct 22 22:5x "the iOS/iPad scans the qr code and he sees harleyquintiti (harley quinn nefertiti)"; Oct 18
// 16:03 "the guy does BURN MY COSMOS RYU SEI KEN PEGASUSSSSS do you understand that is the equivalent of smashing buttons?". The roles turn: HIS hands are
// Seiya's (a tap his meteor, the taps of one beat burning it hotter; a drag toward her his punch; a drag aside his side step; a drag back toward
// Harleyquintiti his back step, the way back to her when his strikes have carried him off), HER spells are her own
// script (HER_LOOP, the default causes looped), and HARLEYQUINTITI stands behind him: her bolt and her twelve fly at Harleyquintiti's chest, and only his
// fist (a strike on her while she flies breaks the bolt) or his body (a strike that meets his box on its way) keeps them off her. She is taken when her
// health is gone; he wins when the Lyssajudron's is. The original fight (protect absent) is unchanged, byte for byte: its tests pin it.
//
// COST: planning a fight of 40 s is about 1,000 ticks of a few hundred multiplications each: a few ms on the new Mac, once per change of causes.
// stateAt is a few lookups and 12 satellites. Nothing runs at rest: a page asks the plan only while it draws.
import * as SC from '../vendor/embertide-app/ui/intro/room/lyssajudron-score.mjs';

const TAU = Math.PI * 2;
const num = (v) => typeof v === 'number' && Number.isFinite(v);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (u) => { const t = clamp(u, 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, k) => a + (b - a) * k;
const mix3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const wrapA = (a) => { const t = (a + Math.PI) % TAU; return (t < 0 ? t + TAU : t) - Math.PI; };

// ---- the clock (code constants unless said) ----
export const CLIP_RATE = 30;                                  // the clips' frames a second: GAI.md's likely rate (hades-glb extras.rate); not measured
export const COUNTER_PER_TICK = 1.2;                          // measured: the play counter's step at each engine tick at speed 1 (seiya-fight clock)
export const TICK_MS = COUNTER_PER_TICK / CLIP_RATE * 1000;  // 40 ms: arithmetic from the two above
export const BEAT_MS = SC.BEAT_MS, BEATS_PER_BAR = SC.BEATS_PER_BAR;   // 600 ms, 4/4: her score's genesis grid (no song on this page)
export const BAR_MS = BEAT_MS * BEATS_PER_BAR, SIXTEENTH_MS = BEAT_MS / 4;
export const GRID = Object.freeze({ epoch_ms: 0, beat_ms: BEAT_MS, beats_per_bar: BEATS_PER_BAR, bpm: 60000 / BEAT_MS, source: 'fight' });
export const clockAt = (g) => SC.clockOf(GRID, g);

// ---- her side: every number a code constant (her score's where it says so) or a choice, labelled ----
export const HER = Object.freeze({
  hp: 100,                    // a new fight's health (the rig lane's semaphore: "starts at 100 in a new fight"); not measured here
  r: SC.K,                    // her body's radius, 0.206 m (lyssajudron-score.mjs K)
  r_sat: SC.R_SAT,            // a satellite's radius, 0.087 m (K x CHILD_SCALE)
  range_u: 16.16,             // a choice: she keeps the farther distance at which he chose his meteor from his stance (rig1 rel 1089, measured)
  bob: SC.BOB_M, dip: SC.DIP_M,   // her bob on the beat and her dip on the downbeat (her score's)
});
// her spells' timing and weight (code constants; on the song's grid as her score moves: a move leaves on a beat and lands on a later one)
export const SPELL = Object.freeze({
  storm: Object.freeze({ every_beats: 0.25, fly_beats: 1, back_beats: 1, grow: 2, damage: 1.88 }),   // damage by analogy: the lightest hit he took in the recordings (run1 rel 651)
  bolt: Object.freeze({ strike_beats: 2, back_beats: 4, damage: 12.51 }),                            // by analogy: the heaviest hit he took (rig1 rel 509, Cancer's throw)
  wind: Object.freeze({ reach_m: 1.2, guard_before_beats: 0.25, guard_after_beats: 1 }),
  blink: Object.freeze({ turn: Math.PI / 3, sink_beats: 0.5, gone_beats: 0.5, rise_beats: 0.5 }),
  armor: Object.freeze({ gild_bars: 1 }),                                                             // then her arrow: the bolt in gold, his health all it takes
  necro: Object.freeze({ fall_beats: 0.5, lie_beats: 1, rise_beats: 0.5 }),
  dice: Object.freeze({ faces: 20 }),
});
export const FREEZE = Object.freeze({ dive: SIXTEENTH_MS, strike: BEAT_MS, knockdown: BAR_MS, finisher: 1500, block: SIXTEENTH_MS });   // the finisher's: boss-intro.mjs BOSS.freeze_ms

/** THE SPELL BOOK as causes: (lever, cast) -> spell. His words name the spells and the hands (lab/FIGHT-LYSSA-SEIYA.md); this table is the lane's. */
export const SPELLS = Object.freeze({
  word: 'summon',                                   // THE MAGIC WORD (his Sept 17 20:01), said once: SUMMONING (his Sept 11 00:20; "Summon Saint Seiya", Oct 2)
  '0:tap': 'wind', '0:drag': 'blink',               // lever 0, the guard: THE KNIGHTIAN WIND (Sept 13 21:25); THE BLACKHOLE INTO A WHITEHOLE (Sept 21 01:12)
  '1:tap': 'postit', '1:drag': 'storm',             // lever 1, the swarm: THE POST-IT (Sept 11); THE SWARMSPELL (Sept 14 19:22 to Sept 15 09:14)
  '2:drag': 'bolt', '2:tap': 'armor',               // lever 2, the gold: the LIGHTNING BOLT light-boomerang (Oct 17 01:5x, 22:24); THE SAGITTARIUS ARMOR (Sept 16 08:06)
  lift: 'dice',                                     // any lever: THE DICE (Sept 23 16:01 "drag on any screen: a spell; lift: the dice")
});
export const NAMES = Object.freeze({
  summon: 'SUMMONING', wind: 'THE KNIGHTIAN WIND', blink: 'THE BLACKHOLE INTO A WHITEHOLE', postit: 'THE POST-IT', storm: 'THE SWARMSPELL',
  bolt: 'LIGHTNING BOLT', armor: 'THE SAGITTARIUS ARMOR', dice: 'THE DICE', freeze: 'TIME FREEZE', necro: 'THE NECROMANCER',
  meteor: 'PEGASUS METEOR (64.4000)', punch: 'THE PUNCH (59.3040)',
});
/** spellOf(cause): the spell a cause casts (null: none). */
export function spellOf(c) {
  if (!c || !num(c.beat)) return null;
  if (c.cast === 'word') return SPELLS.word;
  if (c.cast === 'lift') return SPELLS.lift;
  return SPELLS[`${c.lever}:${c.cast}`] || null;
}
/** THE DICE (his Sept 23 01:29 "chosen deterministically from a variety of pre-cached pre-generated outcomes"): a roll from the count, never random. */
export function dice(count, salt = 0, faces = SPELL.dice.faces) {
  let h = (Math.imul((count | 0) + 0x9e3779b9, 0x85ebca6b) ^ Math.imul((salt | 0) + 0x632be5ab, 0xc2b2ae35)) >>> 0;
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d) >>> 0; h ^= h >>> 15; h = Math.imul(h, 0x846ca68b) >>> 0; h ^= h >>> 16;
  return 1 + ((h >>> 0) % faces);
}

/** The default causes: a fixed script of his hands for the proof (beats from the fight's first downbeat). Each one names the spell it casts. */
export const DEFAULT_CAUSES = Object.freeze([
  { beat: 0, cast: 'word' },                               // THE MAGIC WORD: SUMMONING, Seiya at his place
  { beat: 6, lever: 0, cast: 'tap' },                      // THE KNIGHTIAN WIND: her guard on the downbeat of bar 2
  { beat: 10, lever: 1, cast: 'tap' },                     // THE POST-IT on his place
  { beat: 12, lever: 1, cast: 'drag' },                    // THE SWARMSPELL: the twelve dive at the post-it
  { beat: 19, lever: 0, cast: 'drag', dir: 1 },            // THE BLACKHOLE INTO A WHITEHOLE: she blinks round him
  { beat: 22, cast: 'lift' },                              // THE DICE: the roll orders the next storm
  { beat: 23, lever: 2, cast: 'drag' },                    // LIGHTNING BOLT: the boomerang at him
  { beat: 33, lever: 1, cast: 'drag' },                    // THE SWARMSPELL again
  { beat: 42, lever: 0, cast: 'tap' },                     // THE KNIGHTIAN WIND
  { beat: 47, lever: 2, cast: 'drag' },                    // LIGHTNING BOLT
  { beat: 55, lever: 2, cast: 'tap' },                     // THE SAGITTARIUS ARMOR: gold, then her arrow
].map(Object.freeze));

// ---- THE FIGHT FOR HARLEYQUINTITI: her, his hands, her loop (every number a choice of this lane unless labelled) ----
export const HARLEY = Object.freeze({
  name: 'HARLEYQUINTITI',
  hp: 100,          // a choice: her health on the scale of theirs
  behind_m: 1.2,    // a choice: she stands this far behind him on the summoning line, so at the start he stands between her and the Lyssajudron
  chest_m: 1.18,    // a choice: her chest's height, 0.74 of the 1.6 m her body is drawn at (athena.hades.glb extras.height)
  r_m: 0.3,         // a choice: a strike within this of her chest reaches her
  finisher: 50,     // a choice: the gold arrow takes half her health (on him it takes all of his, as in the original fight)
});
/** His hands in the protect fight: a press is {beat, move, dir?, by}; the page stamps it on the next beat as her casts are. */
export const MOVES = Object.freeze({ meteor: 'PEGASUS RYU SEI KEN', punch: 'THE PUNCH (59.3040)', step: 'THE SIDE STEP', back: 'THE BACK STEP' });
export const COSMOS = Object.freeze({ per_tap: 0.25, max: 2 });     // a choice: each further tap of the same beat burns the meteor a quarter hotter, at most twice
export const BOSS = Object.freeze({ hp: 300 });   // a choice: in the protect fight she is a boss of three bars (his Oct 14 23:30 "like dmc4 boss fight"), so smashing alone does not end her before her spells come
export const STEP_TICKS = 6;      // a choice: a side step plays its clip (03.30 or 04.40) for 6 ticks at the recorded 1.2 (the receipt measures the metres)
export const LATE_BEATS = 4;      // a choice: a press made while he cannot move waits for his stance this long, then it is lost
/** HER_LOOP: her spells after the summoning, looped (a choice: the default causes from beat 6 to 55, every 16 bars). */
export const HER_LOOP = Object.freeze({ from_beat: 6, every_beats: 64 });
/** herScript(until_beat): the summoning at beat 0, then her loop of the default causes until that beat (pure). */
export function herScript(until_beat = 120) {
  const out = [DEFAULT_CAUSES[0]], part = DEFAULT_CAUSES.filter((c) => c.beat >= HER_LOOP.from_beat);
  for (let k = 0; ; k++) {
    const shift = k * HER_LOOP.every_beats; if (part[0].beat + shift > until_beat) break;
    for (const c of part) if (c.beat + shift <= until_beat) out.push(Object.freeze({ ...c, beat: c.beat + shift, loop: k }));
  }
  return Object.freeze(out);
}
/** A fixed script of his hands for the proof (beats from the fight's first downbeat), the lane's and not his: from beat 13 four taps a beat (the cosmos at
 *  1.75), a back step to her on every seventh beat, a punch on every thirteenth. Searched among 96 such hands (3 to 5 taps, a punch every 11 to 17 beats
 *  or none, a back step every 5 to 9 beats or none, a start at beat 8 or 13) for a win that shows the protecting and keeps him near her: with it his body
 *  stops 23 of her strikes, his meteor breaks 2 bolts, 15 reach Harleyquintiti, he stays 3.53 m from her on average (8.09 at most; without the back step
 *  7.89 and 18.35), and he wins at 53.00 s with her at 71.8 (FIGHT-FOR-HARLEYQUINTITI.md, the search). 39 of the 96 win. */
export const HIS_SCRIPT = Object.freeze((() => {
  const out = [];
  for (let b = 13; b < 170; b++) {
    if (b % 7 === 0) out.push({ beat: b, move: 'back' }); else if (b % 13 === 0) out.push({ beat: b, move: 'punch' }); else for (let i = 0; i < 4; i++) out.push({ beat: b, move: 'meteor' });
  }
  return out.map((c) => Object.freeze({ ...c, by: 'script' }));
})());
const moveOf = (c) => (c && num(c.beat) && MOVES[c.move] ? c.move : null);

// ---- his half: the measured law, read once from the two files ----
/** lawOf(measured, bodies): the numbers the fight uses, each from the measured files (the tests pin them to the recordings). */
export function lawOf(measured, bodies) {
  if (measured?.v !== 'seiya-fight/1' || bodies?.v !== 'seiya-bodies/1') throw new Error('lawOf: the measured files are not the ones this law reads');
  const M = measured.units.m_per_u;
  const hitsOn = (who) => measured.hits.filter((h) => h.victim === who);
  const meteorHits = hitsOn('CANCER').filter((h) => h.attacker.code === 4000);
  const near = meteorHits.reduce((a, h) => (h.dist_before_u < a.dist_before_u ? h : a)), far = meteorHits.reduce((a, h) => (h.dist_before_u > a.dist_before_u ? h : a));
  const punchHit = hitsOn('CANCER').find((h) => h.attacker.code === 3040);
  const punchFist = measured.fists.find((f) => f.code === 3040), meteorFist = measured.fists.find((f) => f.code === 4000 && f.counter === near.attacker.counter);
  const contact_u = measured.contact_u;
  // how far his striking hand was from Cancer's axis when it landed (Cancer then stood at the distance of the frame before: the contact)
  const reachOf = (fist, hand, d_u) => Math.hypot(d_u * M - fist[hand][0], fist[hand][1]);
  const chain = (code) => measured.plays.find((p) => p.run === 'rig1' && p.code === code && p.rel >= 141 && p.rel <= 280);
  const fall = chain(1270), floor = chain(1240), rise = chain(1260);
  // how long he held his stance before a choice: the median over his choices from the stance (a stance under two ticks was a press held through his rise,
  // rig1's TRIANGLE at rel 267 before the meteor at 279); right after a hit reaction he moved at once (run1 rel 673 and 815: no stance between)
  const calm = measured.chose.filter((c) => c.after === 0 && c.idle_frames >= 2 * measured.clock.frames_per_tick).map((c) => c.idle_frames);
  const stance_ticks = median(calm) / measured.clock.frames_per_tick;
  return Object.freeze({
    M, contact_m: contact_u * M, start_m: measured.runs.run1.start.dist_u * M, hp: 100, stance_ticks, stance_n: calm.length,
    choices: measured.chose.map((c) => Object.freeze({ ...c, d_m: c.dist0_u * M, ticks: c.frames / measured.clock.frames_per_tick,
      idle_ticks: c.after === 1060 ? 0 : stance_ticks, sp: measured.plays.find((p) => p.run === c.run && p.rel === c.rel).sp })),
    meteor: Object.freeze({ clip: 64, c0: near.attacker.counter, d0_u: near.dist_before_u, c1: far.attacker.counter, d1_u: far.dist_before_u,
      v_u: (far.dist_before_u - near.dist_before_u) / (far.attacker.counter - near.attacker.counter),
      damage: near.damage, damage_striking: meteorHits.reduce((a, h) => Math.min(a, h.damage), Infinity), hand: 'rhand',
      reach_m: reachOf(meteorFist, 'rhand_m', near.dist_before_u) }),
    punch: Object.freeze({ clip: 59, c: punchHit.attacker.counter, damage: punchHit.damage, hand: 'lhand', reach_m: reachOf(punchFist, 'lhand_m', punchHit.dist_before_u) }),
    // his reactions to Cancer's hits, each with its frames and travel; the jump at the hit frame only where he stood in his stance the frame before
    // (run1 773 and 861: 0.22 m); at 651 he was in his back step (2.20), so its 0.33 m was partly his own step and it is not used as a knock
    reactions: hitsOn('PEGASUS').filter((h) => h.reaction.code === 1060).map((h) => Object.freeze({ damage: h.damage, ticks: h.reaction.frames / measured.clock.frames_per_tick,
      travel_m: h.reaction.travel_u * M, jump_m: h.victim_before?.code === 0 ? h.jump_u * M : 0, rel: h.rel, before: h.victim_before?.code ?? null })),
    down: Object.freeze([
      { clip: 53, ticks: fall.frames / 2, travel_m: fall.travel_u * M, away: true },
      { clip: 50, ticks: floor.frames / 2, travel_m: 0, away: true },
      { clip: 52, ticks: rise.frames / 2, travel_m: 0, away: true, root: true },
    ].map(Object.freeze)),
    her_reaction: Object.freeze({ jump_m: near.jump_u * M, travel_m: near.reaction.travel_u * M, ticks: near.reaction.frames / 2 }),
    blends: measured.blends, root: measured.root, bodies: bodies.clips,
  });
}
function median(a) { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0; }

/** rootAt(L, clip, c): the clip's root motion at counter c in his own frame [x, z] metres (the disc's waist keys, glTF axes); a loop adds its laps. */
export function rootAt(L, clip, c) {
  const r = L.root[clip]; if (!r) return [0, 0];
  const len = r.len, laps = r.loops && c > len ? Math.floor(c / len) : 0, f = r.loops && c > len ? c - laps * len : Math.min(c, r.t[r.t.length - 1]);
  const t = r.t, v = r.xz_m;
  let i = 0; while (i < t.length - 2 && t[i + 1] <= f) i++;
  const u = t[i + 1] > t[i] ? clamp((f - t[i]) / (t[i + 1] - t[i]), 0, 1) : 0, end = v[v.length - 1];
  return [lerp(v[i][0], v[i + 1][0], u) + laps * end[0], lerp(v[i][1], v[i + 1][1], u) + laps * end[1]];
}
/** bodyAt(L, clip, c, mark): a mark of his body ('box' or a joint: lhand rhand head chest waist) at counter c, in his frame (the glb through three). */
export function bodyAt(L, clip, c, mark) {
  const b = L.bodies[clip]; if (!b) return null;
  const len = b.len, f = b.loops ? ((c % len) + len) % len : clamp(c, 0, len), i = Math.min(Math.floor(f), len - 1), u = f - i, rows = b[mark];
  return rows[i].map((x, k) => lerp(x, rows[i + 1][k], u));
}
// his frame to the world's: he faces +z at yaw 0, as three turns a model by rotation.y
export const toWorld = (p, yaw, o) => [o[0] + p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw), o[1] + p[1], o[2] - p[0] * Math.sin(yaw) + p[2] * Math.cos(yaw)];
const toLocal = (w, yaw, o) => { const dx = w[0] - o[0], dz = w[2] - o[2]; return [dx * Math.cos(yaw) - dz * Math.sin(yaw), w[1], dx * Math.sin(yaw) + dz * Math.cos(yaw)]; };
const sphereInBox = (p, r, b) => Math.hypot(p[0] - clamp(p[0], b[0], b[3]), p[1] - clamp(p[1], b[1], b[4]), p[2] - clamp(p[2], b[2], b[5])) <= r;

// ---- her body in time ----
/** baseAt(P, g): her place on the floor [x, z]: the last go of her station moves, eased (from a beat to the next: her score's go-to, at the beat). */
function baseAt(P, g) {
  let s = P.goes[0];
  for (const x of P.goes) { if (x.g0 > g) break; s = x; }
  return s.g1 > s.g0 ? [lerp(s.from[0], s.to[0], smooth((g - s.g0) / (s.g1 - s.g0))), lerp(s.from[1], s.to[1], smooth((g - s.g0) / (s.g1 - s.g0)))] : [s.to[0], s.to[1]];
}
const hoverAt = (P, g) => { const c = clockAt(g); return P.hover - HER.bob * Math.cos(TAU * c.beat_phase) - HER.dip * SC.dipAt(c); };
/** the boomerang's way (his Oct 17 01:5x "chaotic until it findally finds a lyssajudrean trajectory", 22:24 "rapidly but lyssajudrean erratically
 *  arrive like a boomerang back"): out along a 3:2 Lissajous swirl about the straight line that dies as it nears the target, back on the mirror swirl. */
function boomerang(from, to, u, phase = 0) {
  const out = u <= 0.5, k = out ? smooth(u / 0.5) : smooth((u - 0.5) / 0.5), a = out ? from : to, b = out ? to : from;
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d) || 1, f = [d[0] / L, d[1] / L, d[2] / L];
  let s = [f[2], 0, -f[0]]; const ls = Math.hypot(...s) || 1; s = [s[0] / ls, 0, s[2] / ls];
  const up = [f[1] * s[2] - f[2] * s[1], f[2] * s[0] - f[0] * s[2], f[0] * s[1] - f[1] * s[0]];
  const w = (out ? 1 - k : k) * (1 - (out ? 1 - k : k)) * 4, amp = 0.28 * L * w * (out ? 1 : 0.6), th = TAU * k + phase;
  const x = Math.sin(3 * th) * amp, y = Math.sin(2 * th) * amp * 0.6;
  return [a[0] + d[0] * k + s[0] * x + up[0] * y, a[1] + d[1] * k + s[1] * x + up[1] * y, a[2] + d[2] * k + s[2] * x + up[2] * y];
}
/** chestAt(P, g): his chest joint in the world at in-game time g (his clip's frame through the glb's table). */
export function chestAt(P, g) { const s = seiyaAt(P, g); return toWorld(bodyAt(P.L, s.clip, s.c, 'chest'), s.yaw, [s.x, 0, s.z]); }
/** herAt(P, g): her body at in-game time g: centre [x, y, z], yaw, scale (a black hole takes her to 0), gold (0..1), down (0..1). */
export function herAt(P, g) {
  const b = baseAt(P, g), y = hoverAt(P, g);
  let p = [b[0], y, b[1]], scale = 1, gold = 0, down = 0, hole = null;
  for (const s of P.spells) {
    if (s.kind === 'bolt' && g >= s.g0 && g < s.g2) {
      const u = (g - s.g0) / (s.g2 - s.g0), target = P.protect ? P.harley.chest : s.target && g >= s.g1 ? s.target : chestAt(P, Math.min(g, s.g1));
      if (s.broken != null && g >= s.broken) p = mix3(s.breakAt, [b[0], y, b[1]], smooth((g - s.broken) / BEAT_MS));
      else p = boomerang(u <= 0.5 ? s.from : [b[0], y, b[1]], target, u, s.phase);
    }
    if (s.kind === 'blink' && g >= s.g0 && g < s.g3) {
      if (g < s.g1) { scale = 1 - smooth((g - s.g0) / (s.g1 - s.g0)); hole = { kind: 'black', at: [s.from[0], y, s.from[2]], open: 1 - scale }; }
      else if (g < s.g2) { scale = 0; hole = { kind: 'black', at: [s.from[0], y, s.from[2]], open: 1 - smooth((g - s.g1) / (s.g2 - s.g1)) }; }
      else { scale = smooth((g - s.g2) / (s.g3 - s.g2)); hole = { kind: 'white', at: [s.to[0], y, s.to[1]], open: 1 - scale }; }
    }
    if (s.kind === 'armor' && g >= s.g0) gold = Math.max(gold, smooth((g - s.g0) / (s.g1 - s.g0)));
    if (s.kind === 'necro' && g >= s.g0 && g < s.g3) {
      const floorY = HER.r * 0.9, at = s.at;
      if (g < s.g1) { const k = smooth((g - s.g0) / (s.g1 - s.g0)); p = [at[0], lerp(at[1], floorY, k), at[2]]; down = k; }
      else if (g < s.g2) { p = [at[0], floorY, at[2]]; down = 1; }
      else { const k = 1 - smooth((g - s.g2) / (s.g3 - s.g2)); p = [at[0], lerp(at[1], floorY, k), at[2]]; down = k; }   // the rise is the fall replayed backward
    }
  }
  const sp = seiyaAt(P, g), yaw = SC.yawToward(p, [sp.x, 0, sp.z]) ?? 0;
  return { p, yaw, scale, gold, down, hole };
}
/** satsAt(P, g, her): her twelve: on their lanes (her score's satelliteAt), or diving in a storm; each [x, y, z, scale] and its state. */
export function satsAt(P, g, her = herAt(P, g)) {
  const clock = clockAt(g), out = [];
  for (let seat = 0; seat < SC.SEATS; seat++) {
    const home = SC.worldOf(SC.satelliteAt(seat, clock), her.p, her.yaw).map((v, i) => (i === 1 ? v : v));
    let p = [her.p[0] + (home[0] - her.p[0]) * her.scale, her.p[1] + (home[1] - her.p[1]) * her.scale, her.p[2] + (home[2] - her.p[2]) * her.scale], scale = her.scale, state = 'lane';
    for (const s of P.spells) {
      if (s.kind !== 'storm') continue;
      const d = s.dives[seat]; if (!d) continue;
      const cut = d.cut ?? null, e1 = cut ?? d.g1, e2 = cut !== null ? cut + (d.g2 - d.g1) : d.g2;   // a dive his body stopped turns back from where it met him
      if (g < d.g0 || g >= e2) continue;
      if (g < e1) { const u = (g - d.g0) / (d.g1 - d.g0); p = boomerang(d.from, d.homing && !P.protect ? chestAt(P, g) : d.target, u * 0.5, d.phase); scale = lerp(1, SPELL.storm.grow, smooth(u)); state = 'dive'; }
      else { const u = (g - e1) / (e2 - e1); p = mix3(cut !== null ? d.cutAt : d.target, home, smooth(u)); scale = lerp(SPELL.storm.grow, 1, smooth(u)); state = 'back'; }
    }
    out.push({ seat, p, scale, state });
  }
  return out;
}

// ---- Seiya in time ----
/** seiyaAt(P, g): his state between two ticks: place, yaw, clip and counter, the clip he blends from, health. */
export function seiyaAt(P, g) {
  const k = clamp(Math.floor(g / TICK_MS), 0, P.ticks.length - 1), a = P.ticks[k], b = P.ticks[Math.min(k + 1, P.ticks.length - 1)], u = clamp(g / TICK_MS - k, 0, 1);
  const sameClip = b.clip === a.clip && b.c >= a.c;
  return { x: lerp(a.x, b.x, u), z: lerp(a.z, b.z, u), yaw: a.yaw + wrapA(b.yaw - a.yaw) * u, clip: a.clip, c: sameClip ? lerp(a.c, b.c, u) : a.c,
    from: a.from, fc: a.fc, w: a.blend > 0 ? clamp(lerp(a.w, b.clip === a.clip ? b.w : 1, u), 0, 1) : 1, hp: a.hp, mode: a.mode, fallen: a.fallen };
}

// ---- the plan ----
/** planFight({measured, bodies, causes, ticks}): the whole fight as a plan (see the header). */
export function planFight({ measured, bodies, causes, his = HIS_SCRIPT, protect = false, max_ticks = protect ? 3000 : 1500 } = {}) {
  if (causes === undefined) causes = protect ? herScript(Math.ceil(max_ticks * TICK_MS / BEAT_MS)) : DEFAULT_CAUSES;
  const L = lawOf(measured, bodies);
  const hover = (measured.fists.reduce((s, f) => s + (f.code === 3040 ? f.lhand_m[2] : f.rhand_m[2]), 0) / measured.fists.length);   // a choice: his fists' measured height
  const P = { L, hover, ticks: [], goes: [], spells: [], events: [], freezes: [], causes: [...causes].filter((c) => spellOf(c)).sort((a, b) => a.beat - b.beat), end: null };
  if (protect) {   // THE FIGHT FOR HARLEYQUINTITI: her place behind him on the summoning line; his presses in the order he made them (a stable sort by beat)
    P.protect = true; P.his = [...(his || [])].filter((c) => moveOf(c)).map((c, i) => ({ c, i })).sort((a, b) => a.c.beat - b.c.beat || a.i - b.i).map((x) => x.c);
    const x = -L.start_m - HARLEY.behind_m; P.harley = { at: [x, 0, 0], chest: [x, HARLEY.chest_m, 0] };
  }
  const range = HER.range_u * L.M;
  // the summoning: she at the origin, he at the distance his savestate held (run1 and rig1 rel 0: 19.39 units), along -x
  const S = { x: -L.start_m, z: 0, yaw: Math.PI / 2, clip: 0, c: 0, sp: 1, mode: 'summoned', until: Math.round(BAR_MS / TICK_MS), after: 0, hp: L.hp,
    from: null, fc: 0, blend: 0, w: 1, play: null, struck: false, react: null, down: null, fallen: null, wait: 0 };
  P.goes.push({ g0: 0, g1: 0, from: [0, 0], to: [0, 0] });
  const addGo = (go) => { let i = P.goes.length; while (i > 0 && P.goes[i - 1].g0 > go.g0) i--; P.goes.splice(i, 0, go); };
  const H = { hp: P.protect ? BOSS.hp : HER.hp, rank: 0, postit: null, nextOrder: null, busyUntil: -Infinity, downUntil: -Infinity };
  const Q = { hp: HARLEY.hp };   // Harleyquintiti (the protect fight)
  let ci = 0, count = 0, hi = 0;
  const snap = (k) => P.ticks.push(P.protect ? { k, x: S.x, z: S.z, yaw: S.yaw, clip: S.clip, c: S.c, from: S.from, fc: S.fc, blend: S.blend, w: S.w, hp: S.hp, mode: S.mode, her_hp: H.hp, rank: H.rank, fallen: S.fallen, harley_hp: Q.hp }
    : { k, x: S.x, z: S.z, yaw: S.yaw, clip: S.clip, c: S.c, from: S.from, fc: S.fc, blend: S.blend, w: S.w, hp: S.hp, mode: S.mode, her_hp: H.hp, rank: H.rank, fallen: S.fallen });
  const ev = (e) => { P.events.push(e); return e; };
  const freeze = (g, hold, why) => { P.freezes.push({ g, hold, why }); };
  const her = (g) => herAt(P, g);
  const seiyaPoint = () => [S.x, 0, S.z];
  const setClip = (clip, sp = 1) => {
    const key = `${clip}.${L.root[clip]?.code ?? ''}`, bl = L.blends[`${L.root[clip]?.name ?? ''}`] || L.blends[key] || [0];
    const b = Math.max(...bl);   // the engine's blend into this clip as recorded (units of its dt: 2.4 a tick)
    S.from = S.clip; S.fc = S.c; S.blend = b / 2.4; S.w = b > 0 ? 0 : 1;   // the crossfade lasts blend / 2.4 ticks
    S.clip = clip; S.c = 0; S.sp = sp;
  };
  const choose = (d_m, after) => {
    const pool = L.choices.filter((c) => (after === 1060 ? c.after === 1060 : c.after === 0));
    let best = null, bestD = Infinity;
    for (const c of pool) { const dd = Math.abs(c.d_m - d_m); if (dd < bestD - 1e-12) { best = c; bestD = dd; } }
    return best;
  };
  const distToHer = (g) => { const h = her(g); return Math.hypot(h.p[0] - S.x, h.p[2] - S.z); };
  const hitHim = (g, damage, kind, at) => {
    S.hp = Math.max(0, S.hp - damage); H.rank = Math.min(6, H.rank + (kind === 'dive' ? 0.34 : kind === 'finisher' ? 2 : 1));
    const h = her(g), away = Math.atan2(S.x - h.p[0], S.z - h.p[2]);
    if (kind === 'finisher' && S.hp <= 0) {
      S.mode = 'fallen'; S.fallen = { g, dir: away, from_clip: S.clip, from_c: S.c };
      ev({ g, kind: 'hit', who: 'her', what: kind, name: NAMES.armor, damage, at, his_hp: S.hp, her_hp: H.hp });
      ev({ g, kind: 'fall', who: 'seiya', dir: away, at: [S.x, 0, S.z] });
      freeze(g, FREEZE.finisher, 'finisher'); return;
    }
    if (kind === 'bolt' || kind === 'finisher') {
      S.mode = 'down'; S.down = { step: 0, t: 0, away }; setClip(L.down[0].clip, 1);
      freeze(g, FREEZE.knockdown, kind);
    } else {
      const row = L.reactions.reduce((a, r) => (Math.abs(r.damage - damage) < Math.abs(a.damage - damage) ? r : a));
      S.mode = 'react'; S.react = { t: 0, ticks: Math.round(row.ticks), travel: row.travel_m, away, row: row.rel };
      S.x += Math.sin(away) * row.jump_m; S.z += Math.cos(away) * row.jump_m;
      setClip(33, 1);
      freeze(g, kind === 'dive' ? FREEZE.dive : FREEZE.strike, kind);
    }
    ev({ g, kind: 'hit', who: 'her', what: kind, name: kind === 'dive' ? NAMES.storm : kind === 'finisher' ? NAMES.armor : NAMES.bolt, damage, at, his_hp: S.hp, her_hp: H.hp, rank: H.rank });
  };
  const hitHer = (g, damage, what, at) => {
    const h = her(g), guard = P.spells.find((s) => s.kind === 'wind' && g >= s.guard0 && g < s.guard1);
    if (guard) {   // THE KNIGHTIAN WIND holds it: no harm, and he is shoved back by her gust
      ev({ g, kind: 'block', who: 'seiya', what, name: NAMES.wind, at });
      const away = Math.atan2(S.x - h.p[0], S.z - h.p[2]), row = L.reactions.reduce((a, r) => (r.travel_m > a.travel_m ? r : a));
      S.mode = 'react'; S.react = { t: 0, ticks: Math.round(row.ticks), travel: row.travel_m, away, row: row.rel }; setClip(33, 1);
      freeze(g, FREEZE.block, 'block'); return;
    }
    H.hp = Math.max(0, H.hp - damage); H.rank = 0;
    for (const s of P.spells) if (s.kind === 'bolt' && g >= s.g0 && g < s.g1 && s.broken == null) { s.broken = g; s.breakAt = h.p.slice(); s.hit = false; ev({ g, kind: 'broken', who: 'seiya', what: s.gold ? 'finisher' : 'bolt' }); }
    ev({ g, kind: 'hit', who: 'seiya', what, name: NAMES[what], damage, at, his_hp: S.hp, her_hp: H.hp });
    if (what === 'punch') {   // knocked down, she rises by THE NECROMANCER: her fall replayed backward from the last count, never a reset
      const n = SPELL.necro, s = { kind: 'necro', g0: g, at: h.p.slice() };
      s.g1 = g + n.fall_beats * BEAT_MS; s.g2 = s.g1 + n.lie_beats * BEAT_MS; s.g3 = s.g2 + n.rise_beats * BEAT_MS; P.spells.push(s);
      H.downUntil = s.g3; addGo({ g0: g, g1: g, from: [h.p[0], h.p[2]], to: [h.p[0], h.p[2]] }); ev({ g: s.g2, kind: 'cast', spell: 'necro', name: NAMES.necro });
      freeze(g, FREEZE.strike, 'punch');
    } else {   // the meteor pushes her back as it pushed Cancer (rig1 rel 297: the jump at the hit, then the reaction's travel)
      const b = baseAt(P, g), away = Math.atan2(h.p[0] - S.x, h.p[2] - S.z), back = L.her_reaction.jump_m + L.her_reaction.travel_m;
      addGo({ g0: g, g1: g + L.her_reaction.ticks * TICK_MS, from: b, to: [b[0] + Math.sin(away) * back, b[1] + Math.cos(away) * back] });
      freeze(g, FREEZE.strike, what);
    }
  };
  // HARLEYQUINTITI STRUCK (the protect fight): her health, the freeze, and her taking
  const hitHarley = (g, damage, what, at) => {
    Q.hp = Math.max(0, Q.hp - damage); H.rank = Math.min(6, H.rank + (what === 'dive' ? 0.34 : 1));
    ev({ g, kind: 'hit', who: 'her', on: 'harley', what, name: what === 'dive' ? NAMES.storm : what === 'finisher' ? NAMES.armor : NAMES.bolt, damage, at, harley_hp: Q.hp, his_hp: S.hp, her_hp: H.hp, rank: H.rank });
    freeze(g, what === 'dive' ? FREEZE.dive : what === 'finisher' ? FREEZE.finisher : FREEZE.strike, `${what}:harley`);
    if (Q.hp <= 0 && !P.taken) { P.taken = { g, what }; ev({ g, kind: 'taken', who: 'her', on: 'harley', at }); }
  };
  // HIS PRESS, taken in his stance (the protect fight): the meteor (the taps of its beat burn it), the punch, the side step
  const ticksOf = (clip) => { const t = L.choices.filter((c) => c.clip === clip).map((c) => c.ticks); return Math.max(1, Math.round(median(t))); };
  const act = (c, g) => {
    const move = moveOf(c);
    if (move === 'meteor') {
      let n = 1; while (hi < P.his.length && moveOf(P.his[hi]) === 'meteor' && P.his[hi].beat === c.beat) { hi++; n++; }
      S.cosmos = Math.min(COSMOS.max, 1 + COSMOS.per_tap * (n - 1));
      setClip(L.meteor.clip, 1); S.play = { choice: { clip: L.meteor.clip, code: 4000 }, t: 0, ticks: ticksOf(L.meteor.clip) };
      ev({ g, kind: 'act', who: 'seiya', move, name: MOVES.meteor, n, cosmos: S.cosmos, beat: c.beat, by: c.by || 'his hand' });
    } else if (move === 'punch') {
      S.cosmos = 1; setClip(L.punch.clip, 1); S.play = { choice: { clip: L.punch.clip, code: 3040 }, t: 0, ticks: ticksOf(L.punch.clip) };
      ev({ g, kind: 'act', who: 'seiya', move, name: MOVES.punch, beat: c.beat, by: c.by || 'his hand' });
    } else if (move === 'back') {   // the recorded back step (02.20, LEFT on his pad), at its recorded 1.2: away from her along the line, toward Harleyquintiti
      S.cosmos = 1; setClip(2, 1.2); S.play = { choice: { clip: 2, code: 20 }, t: 0, ticks: STEP_TICKS };
      ev({ g, kind: 'act', who: 'seiya', move, name: MOVES.back, beat: c.beat, by: c.by || 'his hand' });
    } else {
      const clip = c.dir === -1 ? 4 : 3; S.cosmos = 1; setClip(clip, 1.2); S.play = { choice: { clip, code: clip === 3 ? 30 : 40 }, t: 0, ticks: STEP_TICKS };
      ev({ g, kind: 'act', who: 'seiya', move, name: MOVES.step, dir: clip === 3 ? 1 : -1, beat: c.beat, by: c.by || 'his hand' });
    }
    S.struck = move === 'step' || move === 'back'; S.mode = 'move';
  };
  // a cause, at its beat
  const cast = (c, g) => {
    const spell = spellOf(c), n = count++, beat = c.beat;
    const nextBeat = (Math.floor(g / BEAT_MS + 1e-9) + 1) * BEAT_MS, nextBar = (Math.floor(g / BAR_MS + 1e-9) + 1) * BAR_MS;
    if (g < H.downUntil && spell !== 'summon') { ev({ g, kind: 'lost', spell, name: NAMES[spell], count: n }); return; }
    const e = ev({ g, kind: 'cast', spell, name: NAMES[spell], count: n, beat, lever: c.lever ?? null, cast: c.cast, by: c.by || 'script' });
    const h = her(g);
    if (spell === 'summon') { ev({ g, kind: 'summon', who: 'seiya', at: [S.x, 0, S.z] }); return; }
    if (spell === 'dice') { e.roll = dice(n, beat); H.nextOrder = e.roll; return; }
    if (spell === 'wind') {
      const g0 = nextBar; P.spells.push({ kind: 'wind', g0, guard0: g0 - SPELL.wind.guard_before_beats * BEAT_MS, guard1: g0 + SPELL.wind.guard_after_beats * BEAT_MS, count: n }); return;
    }
    if (spell === 'postit') { const at = nextBeat; P.spells.push({ kind: 'postit', g0: at, count: n, pending: true }); return; }
    if (spell === 'blink') {
      const g0 = nextBeat, s = { kind: 'blink', g0, g1: g0 + SPELL.blink.sink_beats * BEAT_MS, count: n, dir: c.dir === -1 ? -1 : 1 };
      s.g2 = s.g1 + SPELL.blink.gone_beats * BEAT_MS; s.g3 = s.g2 + SPELL.blink.rise_beats * BEAT_MS;
      const b = baseAt(P, g0), ang = Math.atan2(b[0] - S.x, b[1] - S.z) + s.dir * SPELL.blink.turn;
      s.from = [b[0], 0, b[1]]; s.to = [S.x + Math.sin(ang) * range, S.z + Math.cos(ang) * range];
      P.spells.push(s); addGo({ g0: s.g2, g1: s.g2, from: s.to, to: s.to }); return;
    }
    if (spell === 'storm') {
      const post = P.spells.find((s) => s.kind === 'postit' && !s.used && s.g0 <= nextBeat), g0 = nextBeat;
      const order = Array.from({ length: SC.SEATS }, (_, i) => i);
      if (H.nextOrder) { const r = H.nextOrder; order.sort((a, b2) => dice(r, a) - dice(r, b2) || a - b2); H.nextOrder = null; }
      const s = { kind: 'storm', g0, count: n, post: post || null, dives: new Array(SC.SEATS) };
      if (post) post.used = g0;
      order.forEach((seat, i) => {
        const d0 = g0 + i * SPELL.storm.every_beats * BEAT_MS;
        s.dives[seat] = { g0: d0, g1: d0 + SPELL.storm.fly_beats * BEAT_MS, g2: d0 + (SPELL.storm.fly_beats + SPELL.storm.back_beats) * BEAT_MS, from: null, target: null, phase: seat * 0.7, hit: null, seat };
      });
      P.spells.push(s); return;
    }
    if (spell === 'bolt' || spell === 'armor') {
      const gold = spell === 'armor', g0 = gold ? nextBar + SPELL.armor.gild_bars * BAR_MS : nextBar;
      if (gold) P.spells.push({ kind: 'armor', g0: nextBar, g1: nextBar + SPELL.armor.gild_bars * BAR_MS, count: n });
      P.spells.push({ kind: 'bolt', gold, g0, g1: g0 + SPELL.bolt.strike_beats * BEAT_MS, g2: g0 + SPELL.bolt.back_beats * BEAT_MS, count: n, from: null, target: null, phase: n * 0.9, hit: null });
      return;
    }
  };

  S.yaw = Math.atan2(0 - S.x, 0 - S.z); snap(0);
  for (let k = 0; k < max_ticks; k++) {
    const g = k * TICK_MS, g1 = g + TICK_MS;
    // causes whose beat has come
    while (ci < P.causes.length && P.causes[ci].beat * BEAT_MS <= g + 1e-9) cast(P.causes[ci++], g);
    // her station on every beat: at her range from him along the line from him to her, reached by the next beat (a move leaves on a beat and lands on the next)
    if (k > 0 && Math.abs(g / BEAT_MS - Math.round(g / BEAT_MS)) < 1e-9 && !P.spells.some((s) => (s.kind === 'blink' || s.kind === 'necro') && g >= s.g0 && g < s.g3)) {
      const b = baseAt(P, g), d = Math.hypot(b[0] - S.x, b[1] - S.z) || 1;
      addGo({ g0: g, g1: g + BEAT_MS, from: b, to: [S.x + (b[0] - S.x) / d * range, S.z + (b[1] - S.z) / d * range] });
    }
    // spells that start now: their places, fixed when they leave
    for (const s of P.spells) {
      if (s.kind === 'postit' && s.pending && g >= s.g0) { s.pending = false; s.at = toWorld(bodyAt(L, S.clip, S.c, 'chest'), S.yaw, [S.x, 0, S.z]); ev({ g, kind: 'mark', spell: 'postit', at: s.at }); }
      if (s.kind === 'bolt' && !s.from && g >= s.g0) { const h = her(g - 1e-6); s.from = h.p.slice(); }
      if (s.kind === 'storm') for (const d of s.dives) if (d && !d.from && g >= d.g0) {
        const h = her(g), home = SC.worldOf(SC.satelliteAt(d.seat, clockAt(g)), h.p, h.yaw);
        d.from = home;
        const ch = bodyAt(L, S.clip, S.c, 'chest');
        d.target = P.protect ? P.harley.chest.slice() : toWorld(ch, S.yaw, [S.x, 0, S.z]); d.homing = !!s.post;
      }
    }
    // HIS HANDS (the protect fight): a press whose beat has come is taken in his stance; one older than LATE_BEATS while he could not move is lost
    if (P.protect) {
      while (hi < P.his.length && P.his[hi].beat * BEAT_MS <= g + 1e-9 && g - P.his[hi].beat * BEAT_MS > LATE_BEATS * BEAT_MS) { const c = P.his[hi++]; ev({ g, kind: 'lost', who: 'seiya', move: c.move, beat: c.beat, by: c.by || 'his hand' }); }
      if (S.mode === 'stance' && hi < P.his.length && P.his[hi].beat * BEAT_MS <= g + 1e-9) act(P.his[hi++], g);
    }
    // HIS STEP
    const h = her(g), dHer = Math.hypot(h.p[0] - S.x, h.p[2] - S.z);
    if (S.mode !== 'fallen') S.yaw = Math.atan2(h.p[0] - S.x, h.p[2] - S.z);
    if (S.blend > 0) S.w = Math.min(1, S.w + 1 / S.blend);
    const before = S.c, clipBefore = S.clip;
    if (S.mode === 'summoned') { S.c += COUNTER_PER_TICK; if (--S.until <= 0) { S.mode = 'stance'; S.wait = 0; S.after = 0; } }
    else if (S.mode === 'stance') {
      S.c += COUNTER_PER_TICK;
      if (P.protect) { /* his stance waits for his hand: nothing is chosen for him */ }
      else if (S.wait === 0) { const c = choose(dHer, S.after); S.wait = Math.max(1, Math.round(c.idle_ticks)); S.pendingAfter = S.after; }
      if (!P.protect && --S.wait <= 0) {
        const c = choose(dHer, S.pendingAfter); S.after = 0;
        S.play = { choice: c, t: 0, ticks: Math.max(1, Math.round(c.ticks)) }; S.struck = false; S.mode = 'move'; setClip(c.clip, c.sp);
        ev({ g, kind: 'move', who: 'seiya', clip: c.clip, code: c.code, d_m: dHer, chose: `${c.run}:${c.rel}`, chose_d_m: c.d_m });
      }
    } else if (S.mode === 'move') {
      S.c += COUNTER_PER_TICK * S.sp; S.play.t++;
      if (S.play.t >= S.play.ticks) { S.mode = 'stance'; setClip(0, 1); S.wait = 0; }
    } else if (S.mode === 'react') {
      S.c += COUNTER_PER_TICK; S.react.t++;
      const step = S.react.travel / S.react.ticks; S.x += Math.sin(S.react.away) * step; S.z += Math.cos(S.react.away) * step;
      if (S.react.t >= S.react.ticks) { S.mode = 'stance'; setClip(0, 1); S.wait = 0; S.after = 1060; }
    } else if (S.mode === 'down') {
      const st = L.down[S.down.step]; S.c += COUNTER_PER_TICK; S.down.t++;
      if (st.travel_m) { const step = st.travel_m / st.ticks; S.x += Math.sin(S.down.away) * step; S.z += Math.cos(S.down.away) * step; }
      if (S.down.t >= Math.round(st.ticks)) {
        S.down.step++; S.down.t = 0;
        if (S.down.step >= L.down.length) { S.mode = 'stance'; setClip(0, 1); S.wait = 0; S.after = 0; }
        else setClip(L.down[S.down.step].clip, 1);
      }
    } else if (S.mode === 'fallen') { /* his body is the ragdoll's from here (lab/fight-fall.mjs) */ }
    // the root motion of his clip (the disc's waist keys), turned to where he faces; the loops add their laps
    if (S.clip === clipBefore && (S.mode === 'move' || (S.mode === 'down' && L.down[S.down.step]?.root))) {
      const r0 = rootAt(L, S.clip, before), r1 = rootAt(L, S.clip, S.c), dx = r1[0] - r0[0], dz = r1[1] - r0[1];
      S.x += dx * Math.cos(S.yaw) + dz * Math.sin(S.yaw); S.z += -dx * Math.sin(S.yaw) + dz * Math.cos(S.yaw);
    }
    // HIS STRIKES ON HER (only while she is there: a black hole takes her out of reach)
    const present = h.scale > 0.5 && h.down < 0.5;
    if (S.mode === 'move' && !S.struck && present) {
      if (S.clip === L.meteor.clip) {
        const d_u = Math.hypot(h.p[0] - S.x, h.p[2] - S.z) / L.M, cHit = L.meteor.c0 + Math.max(0, d_u - L.meteor.d0_u) / L.meteor.v_u;
        const fist = bodyAt(L, S.clip, Math.max(S.c, L.meteor.c0), L.meteor.hand), facing = Math.abs(wrapA(Math.atan2(h.p[0] - S.x, h.p[2] - S.z) - S.yaw));
        if (S.c >= cHit && Math.abs(h.p[1] - fist[1]) <= HER.r + L.meteor.reach_m && facing < Math.PI / 6) {
          S.struck = true; const busy = P.spells.some((s) => (s.kind === 'storm' && s.dives.some((d) => d && g >= d.g0 && g < d.g2)) || (s.kind === 'bolt' && g >= s.g0 && g < s.g2));
          hitHer(g, (busy ? L.meteor.damage_striking : L.meteor.damage) * (P.protect ? S.cosmos || 1 : 1), 'meteor', h.p.slice());
        }
      }
      if (S.clip === L.punch.clip && before < L.punch.c && S.c >= L.punch.c) {
        S.struck = true;
        const fist = toWorld(bodyAt(L, S.clip, L.punch.c, L.punch.hand), S.yaw, [S.x, 0, S.z]);
        if (Math.hypot(fist[0] - h.p[0], fist[1] - h.p[1], fist[2] - h.p[2]) <= L.punch.reach_m) hitHer(g, L.punch.damage, 'punch', fist);
        else ev({ g, kind: 'miss', who: 'seiya', what: 'punch', at: fist });
      }
    }
    // HER STRIKES ON HARLEYQUINTITI (the protect fight): each dive and her bolt fly at Harleyquintiti's chest; one that meets his box on its way (his body
    // between them, not down) strikes him and turns back from there; one that reaches her chest strikes her. His fist on her while she is the bolt breaks it
    // (hitHer, unchanged). The wind and the post-it are hers as before; the post-it marks Harleyquintiti.
    if (P.protect && !P.taken) {
      const box = S.mode === 'fallen' ? null : bodyAt(L, S.clip, S.c, 'box'), stands = box && S.mode !== 'down';
      const meets = (p, r) => stands && sphereInBox(toLocal(p, S.yaw, [S.x, 0, S.z]), r, box);
      for (const s of P.spells) {
        if (s.kind === 'storm') for (const d of s.dives) {
          if (!d || !d.from || d.hit !== null || g1 <= d.g0) continue;
          const u = clamp((g1 - d.g0) / (d.g1 - d.g0), 0, 1), p = boomerang(d.from, d.target, u * 0.5, d.phase), r = HER.r_sat * lerp(1, SPELL.storm.grow, smooth(u));
          if (meets(p, r)) {
            d.hit = 'seiya'; d.cut = g1; d.cutAt = p;
            ev({ g: g1, kind: 'dive', who: 'her', on: 'seiya', seat: d.seat, at: p.slice(), count: s.count }); hitHim(g1, SPELL.storm.damage, 'dive', p.slice());
          } else if (d.g1 <= g1) {
            d.hit = 'harley'; ev({ g: d.g1, kind: 'dive', who: 'her', on: 'harley', seat: d.seat, at: d.target.slice(), count: s.count }); hitHarley(d.g1, SPELL.storm.damage, 'dive', d.target.slice());
          }
        }
        if (s.kind === 'bolt' && s.from && s.hit === null && s.broken == null && g1 > s.g0) {
          const u = clamp((g1 - s.g0) / (s.g2 - s.g0), 0, 0.5), p = boomerang(s.from, P.harley.chest, u, s.phase);
          if (g1 < s.g1 && meets(p, HER.r)) {
            s.hit = 'seiya'; s.broken = g1; s.breakAt = p; s.target = p.slice();
            hitHim(g1, s.gold ? S.hp : SPELL.bolt.damage, s.gold ? 'finisher' : 'bolt', p.slice());
          } else if (s.g1 <= g1) {
            s.hit = 'harley'; s.target = P.harley.chest.slice();
            hitHarley(s.g1, s.gold ? HARLEY.finisher : SPELL.bolt.damage, s.gold ? 'finisher' : 'bolt', P.harley.chest.slice());
          }
        }
        if (s.kind === 'wind' && !s.done && s.g0 > g - 1e-9 && s.g0 <= g1) {
          s.done = true; ev({ g: s.g0, kind: 'gust', who: 'her', name: NAMES.wind, at: h.p.slice() });
          if (dHer <= SPELL.wind.reach_m && (S.mode === 'stance' || S.mode === 'move')) {
            const away = Math.atan2(S.x - h.p[0], S.z - h.p[2]), row = L.reactions.reduce((a, r) => (r.travel_m > a.travel_m ? r : a));
            S.mode = 'react'; S.react = { t: 0, ticks: Math.round(row.ticks), travel: row.travel_m, away, row: row.rel }; setClip(33, 1);
            ev({ g: s.g0, kind: 'shove', who: 'her', at: [S.x, 0, S.z] });
          }
        }
      }
    }
    // HER STRIKES ON HIM: a satellite or her body meets his box (the glb's, through three, at his frame now), grown by its radius
    if (S.mode !== 'fallen' && !P.protect) {
      const box = bodyAt(L, S.clip, S.c, 'box');
      for (const s of P.spells) {
        if (s.kind === 'storm') for (const d of s.dives) {
          if (!d || d.hit !== null || !(d.g1 > g && d.g1 <= g1)) continue;
          if (d.homing) d.target = toWorld(bodyAt(L, S.clip, S.c, 'chest'), S.yaw, [S.x, 0, S.z]);
          const local = toLocal(d.target, S.yaw, [S.x, 0, S.z]), r = HER.r_sat * SPELL.storm.grow;
          d.hit = S.mode !== 'down' && sphereInBox(local, r, box);
          ev({ g: d.g1, kind: d.hit ? 'dive' : 'ripple', who: 'her', seat: d.seat, at: d.target.slice(), count: s.count });
          if (d.hit) hitHim(d.g1, SPELL.storm.damage, 'dive', d.target.slice());
        }
        if (s.kind === 'bolt' && s.hit === null && s.broken == null && s.g1 > g && s.g1 <= g1) {
          s.target = toWorld(bodyAt(L, S.clip, S.c, 'chest'), S.yaw, [S.x, 0, S.z]);
          const local = toLocal(s.target, S.yaw, [S.x, 0, S.z]);
          s.hit = S.mode !== 'down' && sphereInBox(local, HER.r, box);
          if (s.hit) hitHim(s.g1, s.gold ? S.hp : SPELL.bolt.damage, s.gold ? 'finisher' : 'bolt', s.target.slice());
          else ev({ g: s.g1, kind: 'miss', who: 'her', what: s.gold ? 'finisher' : 'bolt', at: s.target.slice() });
        }
        if (s.kind === 'wind' && !s.done && s.g0 > g - 1e-9 && s.g0 <= g1) {
          s.done = true; ev({ g: s.g0, kind: 'gust', who: 'her', name: NAMES.wind, at: h.p.slice() });
          if (dHer <= SPELL.wind.reach_m && (S.mode === 'stance' || S.mode === 'move')) {
            const away = Math.atan2(S.x - h.p[0], S.z - h.p[2]), row = L.reactions.reduce((a, r) => (r.travel_m > a.travel_m ? r : a));
            S.mode = 'react'; S.react = { t: 0, ticks: Math.round(row.ticks), travel: row.travel_m, away, row: row.rel }; setClip(33, 1);
            ev({ g: s.g0, kind: 'shove', who: 'her', at: [S.x, 0, S.z] });
          }
        }
      }
    }
    // never closer to her than the contact (the bodies' push-apart in the recordings), unless she is the bolt: last in the tick (a strike may have broken a bolt), against where she is at its end
    const bolting = P.spells.some((s) => s.kind === 'bolt' && g1 >= s.g0 && g1 < s.g2 && s.broken == null);
    if (!bolting && S.mode !== 'fallen') {
      const h1 = her(g1), dx = S.x - h1.p[0], dz = S.z - h1.p[2], d = Math.hypot(dx, dz);
      if (d < L.contact_m && d > 1e-9) { S.x = h1.p[0] + dx / d * L.contact_m; S.z = h1.p[2] + dz / d * L.contact_m; }
    }
    snap(k + 1);
    if (S.fallen && g - S.fallen.g >= 2 * BAR_MS) { P.end = P.protect ? { g: g1, winner: 'Lyssajudron', fall: S.fallen, harley: Q.hp } : { g: g1, winner: 'Lyssajudron', fall: S.fallen }; break; }
    if (P.protect && P.taken && g - P.taken.g >= BAR_MS) { P.end = { g: g1, winner: 'Lyssajudron', taken: true, harley: 0 }; break; }
    if (H.hp <= 0) { P.end = P.protect ? { g: g1, winner: 'Seiya', protected: true, harley: Q.hp } : { g: g1, winner: 'Seiya' }; break; }
  }
  if (!P.end) P.end = P.protect ? { g: (P.ticks.length - 1) * TICK_MS, winner: null, protected: Q.hp > 0, harley: Q.hp } : { g: (P.ticks.length - 1) * TICK_MS, winner: null };
  P.events.sort((a, b) => a.g - b.g);
  P.freezes.sort((a, b) => a.g - b.g);
  // the wall clock: in-game time plus every hold before it
  let acc = 0; for (const f of P.freezes) { f.w = f.g + acc; acc += f.hold; }
  P.wall_ms = P.end.g + acc;
  return P;
}

/** inGame(P, w): the in-game time at wall time w, and the freeze holding it (null when the fight moves). */
export function inGame(P, w) {
  let acc = 0;
  for (const f of P.freezes) {
    if (w < f.w) break;
    if (w < f.w + f.hold) return { g: f.g, freeze: f, held_ms: w - f.w };
    acc += f.hold;
  }
  return { g: Math.min(w - acc, P.end.g), freeze: null, held_ms: 0 };
}
/** wallOf(P, g): the wall time at which in-game time g is first reached. */
export function wallOf(P, g) { let acc = 0; for (const f of P.freezes) { if (f.g >= g) break; acc += f.hold; } return g + acc; }

/** harleyAt(P, t, g): Harleyquintiti's health at in-game time g: the tick's, or a strike's on her inside that tick (as stateAt reads theirs). */
function harleyAt(P, t, g) {
  let v = t.harley_hp;
  for (const e of P.events) { if (e.g > g + 1e-9) break; if (e.kind === 'hit' && e.on === 'harley' && e.g >= t.k * TICK_MS - 1e-9 && num(e.harley_hp)) v = e.harley_hp; }
  return v;
}
/** stateAt(P, w): everything a glass draws at wall time w (pure). */
export function stateAt(P, w) {
  const { g, freeze, held_ms } = inGame(P, w), her = herAt(P, g), sats = satsAt(P, g, her), seiya = seiyaAt(P, g);
  const recent = P.events.filter((e) => e.g <= g && g - e.g < BAR_MS);
  const hits = P.events.filter((e) => e.kind === 'hit' && e.g <= g);
  const lastCast = [...P.events].reverse().find((e) => e.kind === 'cast' && e.g <= g) || null;
  const t = P.ticks[clamp(Math.floor(g / TICK_MS), 0, P.ticks.length - 1)];
  const marks = P.spells.filter((s) => s.kind === 'postit' && !s.pending && s.at && g >= s.g0 && !(s.used && g >= s.used + BEAT_MS)).map(() => chestAt(P, g));
  const ripples = P.events.filter((e) => (e.kind === 'dive' || e.kind === 'ripple') && e.g <= g && g - e.g < BEAT_MS).map((e) => ({ at: e.at, seat: e.seat, age: (g - e.g) / BEAT_MS, hit: e.kind === 'dive' }));
  const gusts = P.events.filter((e) => e.kind === 'gust' && e.g <= g && g - e.g < BEAT_MS).map((e) => ({ at: e.at, age: (g - e.g) / BEAT_MS }));
  const bolting = P.spells.find((s) => s.kind === 'bolt' && g >= s.g0 && g < s.g2) || null;
  const summon = g < BAR_MS ? { at: [P.ticks[0].x, 0, P.ticks[0].z], k: g / BAR_MS } : null;
  // the health as the last strike left it: a strike inside the tick (and a freeze holds its strike's own instant) reads its own numbers, so a bar drops as
  // the strike lands, not a tick later after the freeze has held (Oct 24 2026: before, every bar showed the health from before a hit through its whole freeze)
  const hp = { seiya: t.hp, her: t.her_hp };
  for (const e of P.events) {
    if (e.g > g + 1e-9) break;
    if (e.kind !== 'hit' || e.g < t.k * TICK_MS - 1e-9) continue;
    if (num(e.his_hp)) hp.seiya = e.his_hp; if (num(e.her_hp)) hp.her = e.her_hp; 
  }
  const out = { w, g, freeze, held_ms, her, sats, seiya, hp, rank: t.rank, recent, hits: hits.length, lastCast, marks, ripples, gusts,
    bolt: bolting ? { gold: bolting.gold, from: bolting.from, target: bolting.target } : null, summon, clock: clockAt(g), end: g >= P.end.g - 1e-9 ? P.end : null };
  if (P.protect) {   // Harleyquintiti: her place, her health, the last strike on her within a beat (a flash), taken
    const struck = [...P.events].reverse().find((e) => e.kind === 'hit' && e.on === 'harley' && e.g <= g && g - e.g < BEAT_MS) || null;
    const hq = harleyAt(P, t, g); out.hp.harley = hq; out.harley = { at: P.harley.at, chest: P.harley.chest, hp: hq, struck: struck ? { what: struck.what, age: (g - struck.g) / BEAT_MS } : null, taken: !!(P.taken && g >= P.taken.g) };
    out.lastAct = [...P.events].reverse().find((e) => e.kind === 'act' && e.g <= g) || null;
  }
  return out;
}
