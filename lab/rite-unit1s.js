// rite-unit1s.js: THE RITE'S UNIT1s, the twelve satellites made proper unit1s while Seiya performs his rite, for the hero (app/warm.html).
// His words, Oct 18 2026 17:0x WEST, over the hero on the rite's shot (Seiya in the Sagittarius cloth, the subtitle "Athena, I thank you for
// bestowing on me this power, for showing your trust in me!"): "bro... when he is performing this rite here... can you check what we dead with
// heartbeat and then align to music movement oscilations trajectories of the hands in the dance he is performing i want you to keep 0 hexagons
// there but i want you to start turning the lyssajusian satellites in proper unit1s satellites... and they need to recursively fractally do the
// thing themselves as well... do you understand what i mean?"
//
// THE SUMMON begins at 76.977 s (frame 2307). The hand shot ends at the cut to Athena at 80.747 s (frame 2420), both read off
// saint-seiya.mp4 by ffmpeg's scene score over 0.25 (as lab/cuts.js FILM_CUTS). That cut ends the hand track, not the summoned swarms:
// his Oct 18 correction, "why the swarms he is summoning disappear?". The twelve grow in over IN seconds, then stay
// through the buildup, meteors and ending. Only a film loop or seek before the summon returns them to the unsummoned state.
// After the cut, the captured gesture becomes a recurring musical motif; it never releases to a motionless offset.
//
// THE RECURSION, his Oct 18 19:40 correction: these Unit1s must have Unit2s and further descendants, like the galaxy journey below.
// Every unit keeps its own body and its own twelve chairs. Descendants emerge from their actual parent, then fly smaller Lissajous loops:
// each is born as its parent's own pentagon on the chair it takes, peeled off and folded shut on its way out (origami.mjs).
// Logarithmic birth offsets give accelerating growth at each generation. The small leaves become birds (THE UNFOLDING); parents never
// dissolve into unrelated particles. The visible budget is twelve families of 1 + 12 + 144 bodies; smaller generations are below this
// hero's detail level.
//
// THE DANCE, his hands: the rite's arms read by eye off the film's frames on a 10 % grid of the picture (82..878 x 4..536 of the 960 x 540
// frame), every 7 or 8 frames from 2307 to 2417; the two hands told apart by the least travel between keys (they cross twice); between keys a
// Catmull-Rom spline on the frame number. Each hand draws a loop of about three seconds: the arms bent at the chest, one across the face,
// crossed over the helmet, up in a V, spread wide, back to the chest. Six of the twelve ride each hand (lanes 0 and 2 the first, lanes 1 and 3
// the second): the loop they fly is moved by the hand's place against the picture's centre, DANCE orbit radii for the picture's full width and
// height (y down on both). The dance is drawn behind each unit1 as a ribbon, the last second of its own path, each sample pulled by its hand
// at its own second (offset(chair, age) with age a share of the sphere's TRAIL seconds), so his hands' turns show as curves. The page's long
// trails keep the Lissajous as it was: laid on their 65 points over 15.5 s, the dance turned his turns into corners and stayed jagged for
// 15 s after the rite (the first rewatch, Oct 18 17:4x WEST). During the summon the orbits use film time, beginning at 30 percent speed.
//
// THE MUSIC, as the heartbeat beats (heartbeat.js): the soundtrack's onsets (satellites-score.js beat) thump the units, a strike swelling them
// by THUMP and falling with DECAY frames. His 19:17 correction: "more about the rythm not just for the first intitial thing". Throughout the
// remaining film, smoothed onsets and bass open the flock, voice banks it, and integrated musical energy advances the gesture and wings.
// This is a continuation of the authored gesture, not a claim to track hands in later shots. One bounded score table, no live audio analysis.
//
// THE BIRTH and THE UNFOLDING, below (his Oct 21 2026 WEST "i think there is a dissonance that could also be a feature later which is birds
// and polyehdrons", then over the drawing of this: "honestly i am impressed. thank you. implement and show me"): the twelve are born of his
// hands as the dodecahedron's own pentagons, each closing into its own dodecahedron (origami.mjs), and the leaves stay gold dodecahedra until
// Pegasus spreads his wings, when they open on their hinges into birds of the same pentagons: one material, the birds a moment of the film.
//
// PURE: riteAt(t) is a function of the film's second alone, asked by the sphere at each of its draws through setRite as setPulse asks the
// heart: a pause holds it, a seek lands on the same dance, and it answers null before the summon, so nothing at rest costs anything. No
// timer, no frame request of its own. COST after summoning: one spline read and a few score reads for the law; O(N) drawing from a fixed
// family tree, capped at 1,884 bodies. Unit1/2 grow their own Goldberg slowly (THE HEXAGONS, below); the Unit3 leaves keep their seeds
// until they unfold (THE UNFOLDING).
//
//   import {mountRite} from './rite-unit1s.js';
//   const rite = mountRite({film, view});   // the hero's film and the page's window (its genesisSphere, setRite)
//   rite.at(t) -> the rite at second t, or null; rite.stats; rite.destroy()
import {SCORE, scoreAt} from './satellites-score.js';
import {colonyAt} from './the-colony.mjs?v=the-cut-1';

export const FPS = 30000 / 1001;
export const RITE = Object.freeze({
  from: 2307 / FPS,      // 76.977 s: the cut onto the rite
  to: 2420 / FPS,        // 80.747 s: the cut to Athena
  in: 1.3,              // seconds: readable chunks arrive during the gesture itself
  doubling: 3.4,         // logarithmic chair births: population accelerates within each generation
  maxPerRoot: 157,       // one Unit1, its twelve Unit2s, their 144 Unit3s
  generationDelay: 5,   // a settled child begins summoning its own children
  childIn: .9,          // a child unfolds from its parent's position before reaching its orbit
  handoff: 0.8,          // seconds after the hand shot: introduce the ongoing musical accents
  dance: 0.9,            // orbit radii for the picture's full width or height
  energy: 0.25,          // the share of the dance the rising energy adds
  thump: 0.28,           // a strike swells the units this much
  decay: 2.5,            // frames: a strike falls as exp(-k / decay)
  childScale: 0.42,      // the Lyssajudron's childScale (room/lyssajudron.mjs)
  children: 12,          // a unit1's own unit2s; a unit2's unit3s
  trail: 15.5,           // seconds: the sphere's trail (warm-sphere.js TRAIL_MS)
  centre: Object.freeze([0.5, 0.5]),   // the picture's centre, against which a hand moves its six
});

// his hands, [frame, A x, A y, B x, B y] in the picture's 0..1 (y down); A and B kept apart by continuity through the two crossings
export const HANDS = Object.freeze([
  [2307, .30, .22, .50, .85], [2314, .33, .20, .47, .84], [2321, .28, .15, .42, .58], [2328, .36, .12, .26, .55],
  [2336, .45, .30, .12, .38], [2343, .62, .22, .18, .22], [2351, .72, .10, .32, .08], [2358, .63, .10, .37, .10],
  [2366, .76, .02, .24, .02], [2373, .95, .03, .12, .08], [2381, .93, .20, .07, .22], [2388, .85, .55, .12, .20],
  [2396, .50, .85, .30, .25], [2403, .45, .75, .30, .20], [2411, .30, .60, .35, .10], [2417, .20, .60, .42, .15],
].map((k) => Object.freeze(k)));

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };

// THE HEXAGONS (his Oct 21 2026 WEST, over the rite's satellites: "can you make the satellites in here also expand their hex's in the unit0?
// like.... it never changes... i would like to see it slowly changing", then "dude. not the dodecahedron, keep that at 12. i mean the fucking
// ones"; it replaces his Oct 18 "keep 0 hexagons there"): every unit is its own unit0 and slowly grows its own Goldberg, a rung at a time up
// `ladder` (the hexagons between its twelve pentagons, its chairs, which turn gold as the first hexagons open: warm-sphere.js THE UNITS'
// LADDER); the page's dodecahedron keeps its twelve. A unit's steps fall due at its own ages (`steps` by depth, seconds after its birth), a
// family's later than the chair before it and a unit2's later than its elder sibling (`ripple`, so a step runs round the ring and through a
// swarm), each on the soundtrack's first onset in the `window` seconds after its due second (satellites-score.js beat >= `beat`), or at its
// due second where the music is quiet (snapped to the strong hits alone, 82 steps fell on the one at 100.6 s: a pop, not a slow change),
// opening over `morph` seconds (twice the page's own 1.6), eased in and out. Unit1s climb to 110 hexagons, unit2s (two fifths their size)
// take one step, to 20; the unit3 leaves keep their seeds and wings (twelve faces are subpixel work at their size already).
export const HEXES = Object.freeze({ladder: Object.freeze([0, 20, 30, 80, 110]),
  steps: Object.freeze({1: Object.freeze([7, 18, 32, 50]), 2: Object.freeze([10])}), ripple: 0.3, beat: 0.3, window: 1, morph: 3.2});
// the soundtrack's onsets, seconds ascending (its frames whose onset reaches HEXES.beat), read once
const ONSETS = (() => { const out = []; for (let n = 0; n < SCORE.frames; n++) if (scoreAt(n / SCORE.fps).beat >= HEXES.beat) out.push(n / SCORE.fps); return Float64Array.from(out); })();
const beatAfter = (s) => {
  let lo = 0, hi = ONSETS.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (ONSETS[mid] < s) lo = mid + 1; else hi = mid; }
  return lo < ONSETS.length && ONSETS[lo] - s <= HEXES.window ? ONSETS[lo] : s;
};
const stepsOf = new Map(), NO_STEPS = Object.freeze([]);
/** unitSteps(node, chair): the film's seconds at which unit `node` of the family on the page's chair `chair` begins each of its steps up
 *  HEXES.ladder, ascending (none for a depth without steps). Pure: made once per unit, again if its birth moves. */
export function unitSteps(node, chair = 0) {
  const due = HEXES.steps[node?.depth];
  if (!due) return NO_STEPS;
  const key = chair * 4096 + node.id;
  let kept = stepsOf.get(key);
  if (!kept || kept.born !== node.born) {
    kept = {born: node.born, at: Object.freeze(due.map((age) => beatAfter(node.born + age + HEXES.ripple * (chair + 0.57 * node.chair))))};
    stepsOf.set(key, kept);
  }
  return kept.at;
}
/** hexesAt(node, t, chair): where that unit stands on HEXES.ladder at the film's second t: {level, progress}, level the ladder's index of
 *  the skin it stands on, progress how far it has opened into the next rung (0 at rest, eased in and out over HEXES.morph seconds). */
export function hexesAt(node, t, chair = 0) {
  const at = unitSteps(node, chair);
  if (!at.length || !Number.isFinite(t)) return {level: 0, progress: 0};
  for (let k = 0; k < at.length; k++) {
    if (t < at[k]) return {level: k, progress: 0};
    const progress = ease((t - at[k]) / HEXES.morph);   // a step that rounds to whole stands on its rung
    if (progress < 1) return {level: k, progress};
  }
  return {level: at.length, progress: 0};
}

// THE FIELD (his Oct 21 2026 WEST, over the rite with the units across the dodecahedron's faces: "we gotta figure out what can be done with
// the satellites... because they are in the way of the anime", then "start by adding magnetic repuslion but like... it's ok if there is some
// tiny overlap..."): the page's dodecahedron repels the units that come round in front of it, on the screen, so the film on its faces stays
// clear. A unit in front within `soft` of the rim is pushed out along its line from the centre, a unit deep inside lands on the rim: `rim`
// of the sphere's radius plus `body` of its own (the rest of its body may overlap the faces, his "tiny overlap"); a compact smooth max, so
// past the band nothing moves and the push never folds a path back on itself. The field comes on over `depth` as a unit comes round to the
// front (behind, the faces hide it; at the side it is outside the rim already) and has an eye of `eye` radii at the centre: a unit crossing
// straight through the middle is let through there, fading out from twice that and back in as it leaves (`fade`), so it passes as if
// behind the sphere, never thrown across the rim in plain sight. Families move as one: a child is placed from its pushed parent, then
// pushed itself, and takes its parent's fade. It comes on at the cut to Athena (`from`, frame 2420, his checkpoint: "we have finalized the
// rest of it", over `in` seconds), so the summon before it stays as it was. Pure: a position, a depth, a body, the sphere and the field's
// strength in; a position and a fade out.
export const FIELD = Object.freeze({rim: 0.97, body: 0.45, soft: 0.3, depth: 0.25, eye: 0.12, from: 2420 / FPS, in: 0.8});
/** fieldStrength(t): THE FIELD's strength at the film's second t: 0 to the cut to Athena, 1 from `in` seconds after it, eased between. */
export const fieldStrength = (t) => (Number.isFinite(t) ? ease((t - FIELD.from) / FIELD.in) : 0);
/** fieldAt(out, x, y, zz, body, cx, cy, radius, strength): THE FIELD on a unit at screen (x, y), depth zz (in front when above 0, the
 *  orbits' units), body its radius in px, the sphere at (cx, cy) with that radius, the field at that strength (fieldStrength, 1 when not
 *  said): out[0], out[1] where it is drawn, out[2] its fade (1 seen, 0 gone). Writes into out (no allocation: a frame asks for every unit). */
export function fieldAt(out, x, y, zz, body, cx, cy, radius, strength = 1, field = FIELD) {
  out[0] = x; out[1] = y; out[2] = 1;
  if (!(zz > 0) || !(radius > 0) || !(strength > 0)) return out;
  const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
  const rim = radius * field.rim + Math.max(0, body) * field.body, soft = radius * field.soft;
  if (!(d < rim + soft) || d === 0) { if (d === 0) out[2] = 1 - ease(zz / field.depth) * Math.min(1, strength); return out; }
  const k = Math.max(soft - Math.abs(d - rim), 0), target = Math.max(d, rim) + k * k / (4 * soft);
  const front = ease(zz / field.depth) * Math.min(1, strength), eye = radius * field.eye;
  const to = d + (target - d) * front * ease(d / eye);
  out[0] = cx + dx * to / d; out[1] = cy + dy * to / d; out[2] = 1 - front * (1 - ease(d / (2 * eye)));
  return out;
}
const cr = (p0, p1, p2, p3, u) => 0.5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (3 * p1 - p0 - 3 * p2 + p3) * u * u * u);

/** Stable parent/chair addresses. A child is born after its parent, never after a camera cut or a random respawn. */
export function hierarchyAt(t, rite = RITE) {
  if (!Number.isFinite(t) || t < rite.from) return [];
  const nodes = [{id: 0, parent: null, chair: 0, depth: 1, born: rite.from, amount: amountAt(t, rite), scale: 1}];
  function children(parent) {
    if (parent.depth >= 3) return;
    for (let chair = 0; chair < rite.children; chair++) {
      const born = parent.born + (parent.depth === 1 ? 1.1 : rite.generationDelay) + rite.doubling * Math.log2(chair + 1);
      // Heap addresses are independent of which siblings have already appeared.
      const id = parent.id * rite.children + chair + 1;
      // THE BIRTH: a unit1's first child waits until the twelve are whole
      const amount = ease((t - (parent.depth === 1 ? Math.max(born, BIRTH.closed) : born)) / rite.childIn);
      if (amount <= 0) continue;
      const child = {id, parent: parent.id, chair, depth: parent.depth + 1, born, amount, scale: parent.scale * rite.childScale};
      nodes.push(child); children(child);
    }
  }
  children(nodes[0]);
  return nodes;
}

// Integrate once, never t * a changing frequency: every seek reconstructs the same continuous phase.
// Five small arrays (185 KB) replace per-draw audio analysis or simulation history.
const MUSIC = Object.fromEntries(['phase', 'pulse', 'bass', 'voice', 'energy'].map(k => [k, new Float64Array(SCORE.frames)]));
for (let i = 1; i < SCORE.frames; i++) {
  for (const k of ['pulse', 'bass', 'voice', 'energy']) {
    const value = SCORE.values[k === 'pulse' ? 'beat' : k][i] / 255;
    const previous = MUSIC[k][i - 1], seconds = k === 'pulse' ? (value > previous ? .045 : .18) : .16;
    MUSIC[k][i] = previous + (value - previous) * (1 - Math.exp(-1 / (FPS * seconds)));
  }
  MUSIC.phase[i] = MUSIC.phase[i - 1] + (.85 + .55 * MUSIC.energy[i] + 1.5 * MUSIC.pulse[i]) / FPS;
}

/** Full-film musical movement, sampled on the picture's clock even when muted or seeking. */
export function musicAt(t) {
  const f = clamp(Number.isFinite(t) ? t * FPS : 0, 0, SCORE.frames - 1), i = Math.floor(f), j = Math.min(i + 1, SCORE.frames - 1);
  const at = k => MUSIC[k][i] + (MUSIC[k][j] - MUSIC[k][i]) * (f - i);
  return {phase: at('phase'), pulse: at('pulse'), bass: at('bass'), voice: at('voice'), energy: at('energy')};
}

/** handsAt(frame): [[A x, A y], [B x, B y]] at a (fractional) frame of the film, the keys' Catmull-Rom; the ends hold their first and last key. */
export function handsAt(frame) {
  const K = HANDS, n = K.length;
  if (frame <= K[0][0]) return [[K[0][1], K[0][2]], [K[0][3], K[0][4]]];
  if (frame >= K[n - 1][0]) return [[K[n - 1][1], K[n - 1][2]], [K[n - 1][3], K[n - 1][4]]];
  let i = 0; while (i < n - 2 && K[i + 1][0] <= frame) i++;
  const k0 = K[Math.max(0, i - 1)], k1 = K[i], k2 = K[i + 1], k3 = K[Math.min(n - 1, i + 2)], u = (frame - k1[0]) / (k2[0] - k1[0]);
  const at = (c) => cr(k0[c], k1[c], k2[c], k3[c], u);
  return [[at(1), at(2)], [at(3), at(4)]];
}

// THE BIRTH (his Oct 21 2026 WEST, "let's think of how it begins because we never thoroughly walked through the path of when saint seya
// starts oscillating hands... i think we should work on what the polyhedrons look like", and the drawing he answered "implement and show
// me"): the twelve are not faded in, they are born of the dodecahedron and his hands, a step of his dance each.
//   the chest (his hands gather, under the film's landing until 77.4 s): twelve sparks run in from round the stage onto the twelve faces
//     (`spark`: from, over; each six of a hand a little after the one before);
//   across the face: each face's own pentagon lifts off the dodecahedron (`peel`, over `peelOver`, `stagger` between the six of a hand, the
//     first of them first) and joins its hand;
//   crossed over the helmet, up in the V: the six of a hand ride it as one stream, each `lag` seconds behind the one before along his
//     hand's own path (HANDS, laid over the stage by the sphere), so the two streams draw his X and his V;
//   spread wide: each flies out to its own orbit (`spread`, over `spreadOver`, a stagger apart);
//   back to the chest: on its orbit each pentagon folds shut into its own dodecahedron (`close`, over `closeOver`, origami.mjs), the last
//     closed (`closed`) before the cut to Athena.
// Their first children wait for that (hierarchyAt), so nothing is born of a unit before it is whole.
export const BIRTH = Object.freeze({spark: 77.4, sparkOver: 0.22, peel: 77.62, peelOver: 0.5, stagger: 0.06, lag: 0.085,
  spread: 79.25, spreadOver: 0.62, close: 79.9, closeOver: 0.55, closed: 79.9 + 5 * 0.05 + 0.55});
/** birthAt(chair, t): where unit1 `chair` (its hand chair % 2, its place in the hand's stream chair >> 1) is in THE BIRTH at second t, or
 *  null once it has closed (and before the summon): spark (0 to 1, its run onto its face), peel (0 to 1 off the face onto its hand),
 *  ride (the picture's [x, y] of its hand `lag` seconds per place behind), orbit (0 to 1 out to its orbit), fold (0 to 1 shut). */
export function birthAt(chair, t) {
  if (!Number.isFinite(t) || t < RITE.from) return null;
  const k = chair >> 1, B = BIRTH, fold = ease((t - (B.close + k * 0.05)) / B.closeOver);
  if (fold >= 1) return null;
  return {hand: chair % 2, rank: k,
    spark: clamp((t - (B.spark + k * 0.02)) / B.sparkOver),
    peel: ease((t - (B.peel + k * B.stagger)) / B.peelOver),
    ride: handsAt((t - (k + 1) * B.lag) * FPS)[chair % 2],
    orbit: ease((t - (B.spread + k * 0.05)) / B.spreadOver),
    fold};
}

// THE UNFOLDING (his "there is a dissonance that could also be a feature later which is birds and polyehdrons"): the leaves keep their gold
// seeds through the cosmos' build-up and open into birds on one beat of the film, Pegasus spreading his wings out of Seiya's cosmos (frame
// 3100, 103.437 s: the cut from his head to his body as the wings come up; he takes flight at 3110), as a wave from the dodecahedron out
// (`ripple` seconds from its middle to the swarm's edge), each opening over `over` seconds (origami.mjs: the wings beat from half way). A
// leaf born after the beat opens as it is born. The unit1s and unit2s stay polyhedra: they grow their hexagons.
export const UNFOLD = Object.freeze({at: 3100 / FPS, ripple: 0.4, over: 0.7});
/** unfoldAt(node, t, wave): how far leaf `node` has opened into its bird at second t, 0 to 1 (0 for a parent); wave its place in the wave,
 *  0 at the dodecahedron and 1 at the swarm's edge (the sphere's reading; the family's order when not said). */
export function unfoldAt(node, t, wave = null) {
  if (node?.depth !== 3 || !Number.isFinite(t)) return 0;
  const w = clamp(Number.isFinite(wave) ? wave : (node.id % 12) / 12);
  return ease((t - Math.max(UNFOLD.at + UNFOLD.ripple * w, node.born + RITE.childIn * 0.5)) / UNFOLD.over);
}

// THE PULL (his Oct 21 2026 WEST, over Seiya drawing the golden arrow: "when he starts drawing the arrow, can you please make all the swarms
// aggregate to their closest hex? like... i want them when he starts drawin to get gravitationally/magnetically attracted to their closest
// hexs (ofc make the hexs well balanced..) and the unit1s should orbit geostationarily to the pentagons"). From the cut to the draw (frame
// 3540, 118.118 s, his hand at the quiver) every unit falls onto its place on the page's sphere as a stone falls, the square of the time
// over its own fall (`fall`: the shortest, and the most a unit's own hash adds), and is caught there as by a magnet (it runs `snap` of the
// way past and rings back in over `settle` seconds). Each unit1 takes a geostationary post `altitude` radii over a pentagon and turns with
// the sphere; each swarm (a unit2 with its unit3s, which draw in round it by `gather` of their orbit) takes a hex `hover` radii over it.
// Balanced (pullPlan): the twelve take the twelve pentagons one each, the nearest as a whole, and each unit1's twelve swarms take the hexes
// round its pentagon, one hex a swarm, the nearest as a whole to their homes (`ring` radians out from the pentagon, their chairs' turn
// round it), so no hex is crowded and none is far; a sphere with fewer hexes than swarms gives each hex as few as it can.
export const PULL = Object.freeze({at: 3540 / FPS, fall: Object.freeze([0.45, 0.4]), snap: 0.07, settle: 0.32, altitude: 0.38, hover: 0.07, gather: 0.55});
const mix32 = (x) => { x = Math.imul(x ^ (x >>> 16), 0x7feb352d); x = Math.imul(x ^ (x >>> 15), 0x846ca68b); return (x ^ (x >>> 16)) >>> 0; };
/** pullFall(node, chair): the seconds unit `node` of family `chair` takes to fall onto its place from the cut to the draw. */
export function pullFall(node, chair) {
  return PULL.fall[0] + PULL.fall[1] * (node.depth === 1 ? (chair % 6) / 6 : mix32(chair * 157 + node.id + 1) / 4294967296);
}
/** pullAt(node, chair, t): how far that unit has fallen onto its place at second t: 0 before the draw, the square of its time over its
 *  fall to 1, then a little past and back as it is caught (above 1 for a moment), 1 after. */
export function pullAt(node, chair, t) {
  if (!node || !Number.isFinite(t) || t < PULL.at) return 0;
  const fall = pullFall(node, chair), tau = t - PULL.at;
  if (tau < fall) return (tau / fall) ** 2;
  const after = tau - fall;
  return 1 + PULL.snap * Math.sin(after / PULL.settle * Math.PI * 2) * Math.exp(-after / (PULL.settle * 0.35));
}
/** pairs(cost, n, m): the assignment of n rows to n of m columns (n <= m) of least total cost (cost row by row, n x m), as Int32Array;
 *  the Hungarian method, deterministic: a tie goes to the lower column. */
export function pairs(cost, n, m) {
  if (!(n <= m)) throw new Error('pairs: more rows than columns');
  const u = new Float64Array(n + 1), v = new Float64Array(m + 1), p = new Int32Array(m + 1), way = new Int32Array(m + 1);
  const minv = new Float64Array(m + 1), used = new Uint8Array(m + 1);
  for (let i = 1; i <= n; i++) {
    p[0] = i; let j0 = 0; minv.fill(Infinity); used.fill(0);
    do {
      used[j0] = 1; const i0 = p[j0]; let delta = Infinity, j1 = 0;
      for (let j = 1; j <= m; j++) if (!used[j]) {
        const cur = cost[(i0 - 1) * m + j - 1] - u[i0] - v[j];
        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
      }
      for (let j = 0; j <= m; j++) if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta;
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
  }
  const out = new Int32Array(n).fill(-1);
  for (let j = 1; j <= m; j++) if (p[j]) out[p[j] - 1] = j - 1;
  return out;
}
/** pullPlan(homes, pents, hexes): THE PULL's places. homes: the twelve unit1s' directions from the sphere's centre as the draw begins (their
 *  orbits' points); pents: the twelve pentagons ({normal, verts}); hexes: the hexes ({center}). Returns {posts: the pentagon each unit1
 *  takes, swarms: the hex each swarm takes (unit1 chair x 12 + unit2 chair)}. Pure: the same sphere, the same plan. */
export function pullPlan(homes, pents, hexes) {
  const unitOf = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const P = pents.map((p) => unitOf(p.normal)), H = hexes.map((h) => unitOf(h.center));
  const near = new Float64Array(144);
  for (let i = 0; i < 12; i++) for (let k = 0; k < 12; k++) near[i * 12 + k] = 1 - dot(unitOf(homes[i]), P[k]);
  const posts = pairs(near, 12, 12);
  // each swarm's home: round its unit1's pentagon, as far out as that pentagon's own twelve nearest hexes, its chair's turn round it
  const take = Math.max(1, Math.ceil(144 / Math.max(1, H.length))), m = H.length * take, cost = new Float64Array(144 * m);
  for (let i = 0; i < 12; i++) {
    const k = posts[i], n = P[k], c = pents[k].verts.reduce((s, v) => [s[0] + v[0] / 5, s[1] + v[1] / 5, s[2] + v[2] / 5], [0, 0, 0]);
    const toward = unitOf(pents[k].verts[0].map((v, j) => v - c[j])), side = [n[1] * toward[2] - n[2] * toward[1], n[2] * toward[0] - n[0] * toward[2], n[0] * toward[1] - n[1] * toward[0]];
    const ring = H.map((h) => Math.acos(Math.max(-1, Math.min(1, dot(h, n))))).sort((a, b) => a - b).slice(0, 12);
    const out = ring.length ? ring.reduce((a, b) => a + b, 0) / ring.length : 0.3;
    for (let c2 = 0; c2 < 12; c2++) {
      const a = c2 * Math.PI * 2 / 12, home = unitOf([0, 1, 2].map((j) => n[j] * Math.cos(out) + (toward[j] * Math.cos(a) + side[j] * Math.sin(a)) * Math.sin(out)));
      for (let h = 0; h < m; h++) cost[(i * 12 + c2) * m + h] = 1 - dot(home, H[h % H.length]) + (h >= H.length ? 1e-6 * Math.floor(h / H.length) : 0);
    }
  }
  const swarms = Int32Array.from(pairs(cost, 144, m), (h) => h % H.length);
  return {posts, swarms};
}

// THE FORMATION and THE VOLLEY (his Oct 21 2026 WEST, over the swarms caught on their hexes with their birds a cloud round each: "can you
// please... make them go into formation when the arrow is ready to be drawn... when the arrow is shot you gotta deliver from the hexagons from
// the surface to the center of the polyhedron sphere").
// THE FORMATION: once its unit2 is caught on its hex (THE PULL), a swarm's twelve leaves leave their orbits round it for twelve places on the
// hex's own outline (warm-sphere.js formSlotsOf: its six corners and the middles of its six edges, drawn in to `reach` of the way from its
// centre), from `after` seconds after the catch (before it: the leaves fly in as their unit2 falls) and over `over` seconds; there they turn
// to face the sphere's centre, beat their wings as one and fold to `size`: each swarm a hexagon of birds round its unit2, every bird on the
// sphere aimed at its heart, whole before the arrow is fully drawn (frame 3616, 120.654 s: dl-paywall.js DRAWN_FRAME, where the page freezes
// until the mint is over: THE GRACE, warm-sphere.js). THE DRAW: through THE AIM's close-up (frames 3740 to 3825, 124.79 to 127.63 s:
// the arrow drawn in the aura and pointed at the viewer) the formation rises `draw` radii more over its hexes, as a bowstring is drawn, and
// holds there to the loose.
export const FORM = Object.freeze({after: -0.25, over: 0.5, reach: 0.74, size: 0.82, aim: 3740 / FPS, drawn: 3825 / FPS, draw: 0.06});
/** formAt(caught, t): how far a swarm caught on its hex at second `caught` stands in its formation at second t, 0 to 1. */
export function formAt(caught, t) {
  if (!Number.isFinite(caught) || !Number.isFinite(t)) return 0;
  return ease((t - caught - FORM.after) / FORM.over);
}
/** formLift(t): how high the formation stands over its hexes at second t, in the sphere's radii: the pull's hover, drawn up through THE AIM. */
export function formLift(t) {
  return PULL.hover + (Number.isFinite(t) ? FORM.draw * ease((t - FORM.aim) / (FORM.drawn - FORM.aim)) : 0);
}
// THE VOLLEY: at THE LOOSE (frame 3856, 128.662 s: his profile, the golden streak across his cheek) the swarms are shot from their hexes into
// the sphere's centre, each swarm at most `stagger` seconds after the loose (its own hash), its unit2 at the head and each of its leaves `lag`
// later than the one before it, so a swarm flies as an arrow, its birds the fletching. A unit's flight takes `flight` seconds: it springs off
// its place over the first `release` of it and flies on at one speed into the centre, folding into it over the last `absorb` (smaller,
// fainter) and gone there: delivered. The core takes them in as light (volleyCore) from the first that folds into it to `fade` seconds after
// the last, all of it before THE ARROW COMES (frame 3931, 131.165 s). The twelve unit1s stay on their posts over the pentagons.
export const VOLLEY = Object.freeze({at: 3856 / FPS, stagger: 0.5, lag: 0.025, flight: 1.1, release: 0.15, absorb: 0.25, fade: 0.25});
/** volleyLaunch(node, chair): the second swarm `node` (a unit2) of family `chair` leaves its hex. Pure. */
export function volleyLaunch(node, chair) {
  return VOLLEY.at + VOLLEY.stagger * mix32(chair * 157 + node.id + 11) / 4294967296;
}
/** volleyAt(launch, t): a unit's flight at second t, launched at second `launch`, as a share of its flight's seconds: 0 before, 1 at the centre. */
export function volleyAt(launch, t) {
  if (!Number.isFinite(launch) || !Number.isFinite(t) || t <= launch) return 0;
  return (t - launch) / VOLLEY.flight;
}
/** volleyPath(f): the share of the way from its place to the centre a unit has flown at flight f: springing off over `release`, then at one speed. */
export function volleyPath(f) {
  if (!(f > 0)) return 0;
  if (f >= 1) return 1;
  const a = VOLLEY.release, v = 1 / (1 - a / 2);
  return f < a ? v * f * f / (2 * a) : v * (f - a / 2);
}
/** volleySeen(f): how much of a unit is seen at flight f: whole until it folds into the core over the last `absorb`, nothing once delivered. */
export function volleySeen(f) {
  return f >= 1 ? 0 : 1 - ease((f - (1 - VOLLEY.absorb)) / VOLLEY.absorb);
}
/** volleyCore(t): the light the sphere's core takes in at second t, 0 to 1: from the first unit folding into it to `fade` after the last. */
export function volleyCore(t) {
  if (!Number.isFinite(t)) return 0;
  const first = VOLLEY.at + VOLLEY.flight * (1 - VOLLEY.absorb), last = VOLLEY.at + VOLLEY.stagger + 12 * VOLLEY.lag + VOLLEY.flight;
  return ease((t - first) / 0.2) * (1 - ease((t - last) / VOLLEY.fade));
}

/** The summoned bodies persist across camera cuts; seeking before their birth resets them deterministically. */
export function amountAt(t, rite = RITE) {
  if (!Number.isFinite(t) || t < rite.from) return 0;
  return ease((t - rite.from) / rite.in);
}

/** Exponential population, coarse-to-fine bodies. One deterministic state for play, pause, seek and loop. */
export function orbitTimeAt(t, rite = RITE) {
  const age = Math.max(0, t - rite.from);
  return t - .7 * 2.2 * (1 - Math.exp(-age / 2.2));
}

export function flockAt(t, rite = RITE, family = hierarchyAt(t, rite)) {
  const perRoot = Math.max(1, family.reduce((total, node) => total + node.amount, 0));
  const refinement = ease((t - 84) / 24);
  const music = musicAt(t), phase = music.phase - musicAt(rite.from).phase;
  const release = ease((t - 107) / 3), charge = ease((t - 100.25) / 6.25) * (1 - release);
  return {perRoot, population: 12 * perRoot, refinement, scale: perRoot ** -.62,
    spread: Math.min(5, (1.7 + 2 * refinement) * (1 + .3 * music.pulse + .12 * music.bass)), phase: phase * .6,
    bank: .5 * (music.voice - music.bass) + .45 * music.pulse,
    stretch: 1 + .3 * music.energy + .35 * music.pulse,
    flutter: phase * 5 + music.pulse * .8,
    charge, release, orbitTime: orbitTimeAt(t, rite)};
}

export function validFlock(f) {
  return f && ['perRoot', 'scale', 'refinement', 'spread', 'phase', 'bank', 'stretch', 'flutter', 'charge', 'release'].every(k => Number.isFinite(f[k])) &&
    f.perRoot >= 1 && f.perRoot <= RITE.maxPerRoot && f.scale > 0 && f.scale <= 1 &&
    f.refinement >= 0 && f.refinement <= 1 && f.spread >= 0 && f.spread <= 5 &&
    Math.abs(f.bank) <= 1 && f.stretch >= 1 && f.stretch <= 2 && f.charge >= 0 && f.charge <= 1 && f.release >= 0 && f.release <= 1;
}

/** thumpAt(t): the soundtrack's onset strength at t with each strike falling over `decay` frames, 0 to 1. */
export function thumpAt(t, rite = RITE) {
  if (!Number.isFinite(t) || t < 0) return 0;
  const beat = SCORE.values.beat, f = t * FPS, i = Math.floor(f);
  let best = 0;
  for (let k = 0; k <= 10; k++) {
    const j = i - k; if (j < 0 || j >= SCORE.frames) continue;
    best = Math.max(best, beat[j] / 255 * Math.exp(-(f - j) / rite.decay));
  }
  return best;
}

/** energyAt(t): the soundtrack's slow rising energy at t, 0 to 1. */
export function energyAt(t) {
  if (!Number.isFinite(t) || t < 0) return 0;
  const v = SCORE.values.energy, f = t * FPS, i = Math.floor(f);
  if (i >= SCORE.frames - 1) return v[SCORE.frames - 1] / 255;
  return (v[i] + (v[i + 1] - v[i]) * (f - i)) / 255;
}

/** Original hand path through the shot, then its music-driven, seamless back-and-forth motif throughout the film. */
export function danceAt(hand, t, rite = RITE) {
  // Population has a slower entrance; the captured hand gesture keeps its own original envelope.
  const summoned = Number.isFinite(t) && t >= rite.from ? ease((t - rite.from) / .4) : 0;
  if (summoned === 0) return [0, 0];
  const music = musicAt(t), mix = ease((t - rite.to) / rite.handoff);
  const phase = (music.phase - musicAt(rite.to).phase) * .65;
  // Starts at the held LAST key, with zero velocity. A wrap to the first key would jump both hands.
  const u = (1 + Math.cos(phase)) / 2;
  const frame = t <= rite.to ? t * FPS : HANDS[0][0] + (HANDS.at(-1)[0] - HANDS[0][0]) * u;
  const h = handsAt(frame)[hand];
  const energy = energyAt(Math.min(t, rite.to)) * (1 - mix) + music.energy * mix;
  const k = rite.dance * (1 - rite.energy + rite.energy * energy) * summoned * (1 + mix * (.3 * music.pulse + .15 * music.bass));
  return [(h[0] - rite.centre[0]) * k, (h[1] - rite.centre[1]) * k];
}

/** riteAt(t): what the sphere draws with at the film's second t, or null before the summon. offset(chair, age) is the dance of the trail's
 *  point `age` (0 now, 1 its tail) of chair `chair` (lanes 0 and 2 ride hand A, lanes 1 and 3 hand B). */
export function riteAt(t, rite = RITE) {
  const amount = amountAt(t, rite);
  if (amount === 0) return null;
  const thump = thumpAt(t, rite);
  // Both passes and all six chairs sharing a hand reuse each ribbon sample.
  const offsets = new Map();
  const family = hierarchyAt(t, rite);
  return {
    t, amount, thump, size: 1 + rite.thump * thump, childScale: rite.childScale, children: rite.children, hexes: HEXES,
    colony: colonyAt(t),   // THE COLONY (the-colony.mjs): while it holds, the whole swarm over the film, flung apart; null outside it
    family, flock: flockAt(t, rite, family),
    spin: (t - rite.from) * 0.6,
    offset: (chair, age = 0) => {
      let pair = offsets.get(age);
      if (!pair) { pair = [danceAt(0, t - age * rite.trail, rite), danceAt(1, t - age * rite.trail, rite)]; offsets.set(age, pair); }
      return pair[chair % 2];
    },
  };
}

export function mountRite({film, view, rite = RITE} = {}) {
  let asked = 0, given = null;
  // own: the sphere's own second for the film's, when it has one (warm-sphere.js THE MINT WINDOW: the swarm comes to rest on the drawn arrow)
  const fn = (own) => { asked++; return riteAt(typeof own === 'function' ? own(film.currentTime) : film.currentTime, rite); };
  // the sphere may come after the hero's mount: given on the first of the film's events that finds it, as the heart is (heartbeat.js)
  const give = () => {
    const sphere = view.genesisSphere;
    if (!sphere?.setRite || given === sphere) return;
    sphere.setRite(fn); given = sphere;
    for (const type of ['play', 'timeupdate', 'seeked']) film.removeEventListener(type, give);
  };
  for (const type of ['play', 'timeupdate', 'seeked']) film.addEventListener(type, give);
  give();
  return {
    at: (t) => riteAt(t, rite),
    get stats() { return {asked, given: Boolean(given)}; },
    destroy() {
      for (const type of ['play', 'timeupdate', 'seeked']) film.removeEventListener(type, give);
      if (given?.setRite) given.setRite(null);
      given = null;
    },
  };
}
