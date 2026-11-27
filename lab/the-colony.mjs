// the-colony.mjs: THE COLONY, the strike on Dolbar as the most glorious bit, for the hero (app/warm.html). His words, Oct 21 2026 WEST, over
// the strike: "we need the most glorious bit here i would say... i would say make the dodecahedron explode and make anime colonize the screen
// radially from where the dodecahedron explodes? make it timed with the anime... becuase later, after this explosion (eg: this is when swarms
// get radially apart from the dodecahedron as it explodes)".
//
// Then, over the Pegasus on the open shell: "explode the dodecahedron hardest when he starts calling pegasus... you have the old slow growing of
// the goldberg polyehdron unit0 dodecahedron... not now. make it explode and bring saint seya in anime mode, so dodecahedron explodes like
// previous moments in this video": the burst moved from the cut into the meteors on Dolbar (frame 3200) to his call, the shell's slow opening
// before it taken out (warm-cosmos.mjs), the burst harder: the film over the stage in eight frames and a white flash on the call.
//
// THE FILM'S OWN MEASURE, read off saint-seiya.mp4 by ffmpeg's scene score over 0.25 (as lab/cuts.js), 30000/1001 fps, and the soundtrack's:
//   frame 3139, 104.738 s: his call, "Pegasus Ryu Sei Ken!" (its subtitle from frame 3132), his voice coming in on the strongest onset of the
//     strike (satellites-score.js beat 0.95), a frame before the cut into the golden barrage of the meteor punch (BURST);
//   frame 3147, 105.005 s: the next onset in the barrage (beat 0.42), the film over the whole stage (FLASH);
//   frame 3245, 108.275 s: the cut to the meteors streaking over the ground at the two of them (METEORS);
//   frame 3335, 111.278 s: the cut to the hits on Dolbar's armour (HITS);
//   frame 3455, 115.282 s: the cut to Seiya's golden armour and his bow, the strike done (HOME).
//
// At the burst the page's dodecahedron explodes, its panels flung out across the screen (warm-sphere.js drawSkin, the cosmos's burst), the
// film spreads from it, a disc from the sphere's rim to past the stage's corners by the flash (unboxing.js drawColony), its front a ring of
// gold, and the swarms are flung apart over it (warm-sphere.js, all of them in front of the film while it holds). The film holds the whole
// stage through the meteors and the hits; at the cut home it folds back the same way, the disc closing onto the dodecahedron as the panels
// come home and the swarms return to their orbits, landing on the soundtrack's strongest beat 0.5 to 1.2 s after the cut
// (satellites-score.js beat; frame 3483, 116.216 s), where the film dissolves into the dodecahedron's own faces.
//
// Pure: colonyAt(t) is a function of the film's second alone, null outside the colony. COST: a few arithmetic operations a call.
import {scoreAt} from './satellites-score.js';
import {FREEZE} from './mint-freeze-layout.mjs';
import {STRIKE_FLOW, DRAWN} from './strike-flow.js?v=the-cut-1';
import {CHARGE_COLORS} from './charge-colors.js?v=pegasus-blue-1';

const FRAME = 1001 / 30000;
export const COLONY = Object.freeze({burst: 3139, flash: 3147, meteors: 3245, hits: 3335, home: 3455});
const strongest = (from, to) => { let at = from, top = -1; for (let n = from; n <= to; n++) { const b = scoreAt(n * FRAME).beat; if (b > top) { top = b; at = n; } } return at; };
/** the frame the fold home lands on: the strongest onset 0.5 to 1.2 s after the cut home */
export const COLONY_LANDS = strongest(COLONY.home + 15, COLONY.home + 36);
export const COLONY_START = COLONY.burst * FRAME, COLONY_FULL = COLONY.flash * FRAME, COLONY_HOME = COLONY.home * FRAME, COLONY_END = COLONY_LANDS * FRAME;
/** how far the panels fly, in the sphere's radii (past the stage's corners on a wide stage), and how far apart the swarms are flung, a share
 *  of their own distance from the centre */
export const COLONY_REACH = 5.5, COLONY_FLING = 0.6;
const smoother = (x) => { x = Math.max(0, Math.min(1, x)); return x >= 1 - 1e-9 ? 1 : x * x * x * (x * (6 * x - 15) + 10); };
const outCubic = (x) => { x = Math.max(0, Math.min(1, x)); return 1 - (1 - x) ** 3; };

/** colonyAt(t): THE COLONY at the film's second t, or null outside it: {spread, burst, gather, fling, flash}, each 0 to 1. spread: the film's disc
 *  from the sphere's rim (0) to the whole stage (1), smootherstep from the burst to the flash, closing again through the fold home; burst:
 *  the panels flung out, an explosion's ease (fast, then slowing) over the first seven tenths of the spread so they stay ahead of the film's
 *  front, home through the fold; gather: the fold home (0 to 1); fling: the swarms flung apart, as the panels. */
export function colonyAt(t) {
  if (!Number.isFinite(t) || t < COLONY_START || t >= COLONY_END) return null;
  const gather = smoother((t - COLONY_HOME) / (COLONY_END - COLONY_HOME));
  const spread = smoother((t - COLONY_START) / (COLONY_FULL - COLONY_START)) * (1 - gather);
  const burst = outCubic((t - COLONY_START) / ((COLONY_FULL - COLONY_START) * 0.7)) * (1 - gather);
  // the call's flash: white at the burst, gone in a third of a second
  return {spread, burst, gather, fling: burst, flash: Math.exp(-(t - COLONY_START) / 0.11)};
}

// THE PICTURE ON THE STAGE: the film while the colony holds, its whole content (without the file's black margins) inside the stage, centred,
// as the anime lead-in fits it (mint-freeze-layout.js pictureViewport; his Oct 21 2026 "also you are zooming in too much... look at the
// mess", over the film covering a tall stage, three times its size and blurred): the file's pixel (x, y) is at (left + x scale, top + y
// scale) on a stage of that width and height (css px). One mapping for the box's pass (unboxing.js drawColony) and the arrows on the film
// (warm-sphere.js THE FLOW).
export function colonyPicture(width, height) {
  const {width: FW, height: FH, content: [px, py, pw, ph]} = FREEZE.picture;
  const scale = Math.min(width / pw, height / ph);
  return {left: (width - pw * scale) / 2 - px * scale, top: (height - ph * scale) / 2 - py * scale, scale, width: FW * scale, height: FH * scale};
}

// THE CHARGE (his Oct 21 2026 WEST, over his golden eyes on the dodecahedron: "i dont like how the most important moment of all when he starts
// burning his cosmos there are no shaders or no effects whatsoever to show the dodecahedron being cherged with the energy of a thousands
// suns... you get what i mean? it should be emanating / irradiating the flames of cosmos being burned..."): from the cut to Seiya lit gold
// (frame 2795, 93.260 s) the page's dodecahedron burns with his cosmos, flames licking out from its rim with rays and a hot core (unboxing.js
// drawCorona), the heat rising act by act on the film's own cuts, his golden eyes (2885, 96.263 s), Dolbar afraid (2975, 99.266 s), "Burn!
// Burn, my cosmos!" (3020, 100.767 s), his Pegasus rising out of his cosmos (3080, 102.769 s), to his call and the explosion (COLONY.burst),
// where the colony takes over; the flames flare on the soundtrack's onsets and bass (satellites-score.js), the heat itself never jumps.
export const CHARGE = Object.freeze({start: 2795, eyes: 2885, dolbar: 2975, burn: 3020, pegasus: 3080});
// the heat reached on each act's cut, eased between (the last, 1, at the explosion)
const HEAT = Object.freeze([[CHARGE.start, 0], [CHARGE.eyes, 0.38], [CHARGE.dolbar, 0.56], [CHARGE.burn, 0.68], [CHARGE.pegasus, 0.86], [COLONY.burst, 1]]);
export const CHARGE_START = CHARGE.start * FRAME;
// THE FLAMES ARE THE ANIME'S COLOUR (his Oct 27 2026 15:2x WET, over the Pegasus faces burning in gold: "i would like to start seeing a blue glow
// radially expand silently here just like warming up to the nuke right after when he goes ballistic... proper coloring synced with the color of the
// anime"): each frame's cosmos colour, measured once off the film (tools/charge-colors.mjs: its saturated light's mean, smoothed within its shot),
// gold on his golden eyes and his "Burn!", Dolbar's dull violet, Pegasus's blue deepening to the explosion; brightened to its own strongest channel
// (the hue and the saturation kept), so a dark shot's colour still lights. THE SWELL: from his Pegasus rising (CHARGE.pegasus) to the explosion
// the glow of that colour spreads out from the rim to past the stage's corners, silent: the flames' flare on the soundtrack fades out as it rises.
const TINTS = (() => { const {hex} = CHARGE_COLORS, n = hex.length / 6, out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const c = [0, 2, 4].map((k) => parseInt(hex.slice(i * 6 + k, i * 6 + k + 2), 16) / 255), m = Math.max(...c, 1e-3);
    out.set(c.map((v) => v / m), i * 3); }
  return out; })();
/** the anime's cosmos colour at frame f, brightened to its strongest channel: [r, g, b], 0 to 1 */
export function tintAt(f) {
  const n = TINTS.length / 3, i = Math.max(0, Math.min(n - 1, Math.round(f) - CHARGE_COLORS.from));
  return [TINTS[i * 3], TINTS[i * 3 + 1], TINTS[i * 3 + 2]];
}
/** THE SWELL at frame f: 0 before his Pegasus rises, smootherstep to 1 at the explosion */
export const swellAt = (f) => smoother((f - CHARGE.pegasus) / (COLONY.burst - CHARGE.pegasus));
/** chargeAt(t): THE CHARGE at the film's second t, or null outside it: {heat, pulse, tint, swell}: heat 0 to 1, rising act by act (smootherstep
 *  between the cuts); pulse 0 to 1, the soundtrack's onset or its bass at that second, the flames' flare, fading as the swell rises (silent);
 *  tint, the anime's colour of that frame (tintAt); swell 0 to 1 (swellAt). */
export function chargeAt(t) {
  if (!Number.isFinite(t) || t < CHARGE_START || t >= COLONY_START) return null;
  const f = t / FRAME;
  let i = 0; while (i < HEAT.length - 2 && f >= HEAT[i + 1][0]) i++;
  const [f0, h0] = HEAT[i], [f1, h1] = HEAT[i + 1];
  const heat = h0 + (h1 - h0) * smoother((f - f0) / (f1 - f0)), s = scoreAt(t), swell = swellAt(f);
  return {heat, pulse: Math.min(1, Math.max(s.beat, s.bass * 0.7)) * (1 - 0.85 * swell), tint: tintAt(f), swell};
}


// THE FLOW (his Oct 21 2026 WEST, over the swarm in a ring over the barrage and the impact: "this is shit. why are you not tracing over the frames
// of the anime the directions that are already drawns... look how pegasus is emanating/irradiating out disks and you have swarm satellites idle...
// and look at dolbar with lines going inside of him and shitshow of swarm satellites in a totally irrelevant formation"; then, over the arrows as
// one funnel into Dolbar and a curtain down his armour, "the swarmies are too opaque..."; and before it all, "keep the 12 unit1 satellites
// steady and have unit2s be the arrows and unit3s and so on"): the arrows, the unit2s and the unit3s (the twelve unit1s stay steady), run over
// the lines each shot of the strike draws, where it draws them, measured off the film by tools/strike-flow.mjs (lab/strike-flow.js: the point
// the shot's lines meet or the way its parallels run, and every fifth of a second where its lines are drawn, by angle round the point or by
// lane across the picture). The way along them is the story's: out of the point the barrage's lines meet, as Pegasus throws out his disks;
// along Dolbar's speed lines into the point they meet, his chest, spent there in a flash; over the meteors' wide shot along its streaks, from
// Seiya's side to Dolbar's (`toward`); down the lines on his armour, a share of them (`strike`) spent on it in a flash as the meteors strike.
// Each arrow runs its path again and again, `rate` times a second, faster or slower by up to a quarter, its phase its own; each time round it
// takes a line drawn when it set out (a draw weighed by where that fifth of a second draws its lines, never under `floor` of their mean, so no
// way is quite empty), so the stream follows the film's drawings as they change, and no two arrows share a pattern (each draw its own hash: the
// golden draws of the first flow laid the swarm in rings and diagonal rows). Its path stays on the picture: out of the point it sets out
// `near` it and is gone `over` past the picture's edge; into it, it comes from `over` past the edge and is spent `core` from the point; along
// the parallels, edge to edge (shares of the picture's height). It comes in `appear` seconds after the film's own cut, is pulled from where the
// burst flung it into the stream over `pull`, and comes home to its family as the film folds back.
export const FLOW = Object.freeze({
  barrage: Object.freeze({way: 'out', rate: 1.5, floor: 0.5}),
  impact: Object.freeze({way: 'in', rate: 1.3, floor: 0.15}),
  meteors: Object.freeze({way: 'along', toward: Object.freeze([1, 0]), rate: 0.8, floor: 0.08}),
  hits: Object.freeze({way: 'along', toward: Object.freeze([0, 1]), rate: 1.1, floor: 0.15, strike: 0.3}),
  near: 0.05, over: 0.06, core: Object.freeze([0.03, 0.12]), appear: 0.08, pull: Object.freeze({after: 0.05, over: 0.35}), hit: 0.12,
});
const SHOT_ORDER = ['barrage', 'impact', 'meteors', 'hits'];
/** flowAt(t): THE FLOW at the film's second t, or null outside the colony: {shot, pull, since}: the shot's name, how far the arrows are pulled
 *  into it (0 to 1: in after the burst, out with the fold home), the seconds since its cut. */
export function flowAt(t) {
  const c = colonyAt(t);
  if (!c) return null;
  const pull = smoother((t - COLONY_START - FLOW.pull.after) / FLOW.pull.over) * (1 - c.gather);
  const f = t / FRAME;
  let shot = null;
  for (const name of SHOT_ORDER) if (f >= STRIKE_FLOW[name].from && f < STRIKE_FLOW[name].to + 1) shot = name;
  if (!shot) shot = f >= STRIKE_FLOW.hits.to + 1 ? 'hits' : 'barrage';   // the call's frame before the barrage, the fold after the hits
  return {shot, pull, since: t - STRIKE_FLOW[shot].from * FRAME};
}
const fade = (x, a, b) => { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
// an arrow's draws: a 32-bit hash of its index, its round and what is drawn (lowbias32), 0 to 1
const mix = (x) => { x = Math.imul(x ^ (x >>> 16), 0x7feb352d); x = Math.imul(x ^ (x >>> 15), 0x846ca68b); return (x ^ (x >>> 16)) >>> 0; };
const drawOf = (index, round, what) => mix(mix(index * 8 + what + 1) ^ Math.imul(round + 1, 0x9e3779b9)) / 4294967296;
// each shot's windows as running sums of their weights, `floor` of their mean under every bin
const CDF = Object.freeze(Object.fromEntries(SHOT_ORDER.map((name) => [name, Object.freeze(STRIKE_FLOW[name].drawn.map((row) => {
  const w = [...row].map(Number), floor = FLOW[name].floor * (w.reduce((a, b) => a + b, 0) / w.length || 1), sums = new Float64Array(w.length + 1);
  for (let b = 0; b < w.length; b++) sums[b + 1] = sums[b] + Math.max(w[b], floor);
  return sums;
}))])));
/** where a draw u (0 to 1) falls in a window's running sums, in bins (0 to bins, continuous) */
function pick(sums, u) {
  const goal = u * sums[sums.length - 1];
  let lo = 0, hi = sums.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (sums[mid] <= goal) lo = mid; else hi = mid; }
  return lo + (goal - sums[lo]) / ((sums[lo + 1] - sums[lo]) || 1);
}
// the picture in the file's pixels, and its centre (the lanes' origin, tools/strike-flow.mjs)
const [PX, PY, PW, PH] = FREEZE.picture.content, CX = PX + PW / 2, CY = PY + PH / 2;
/** how far from (x, y), inside the picture, its edge is along (dx, dy) */
const toEdge = (x, y, dx, dy) => Math.min(dx > 1e-9 ? (PX + PW - x) / dx : dx < -1e-9 ? (PX - x) / dx : Infinity, dy > 1e-9 ? (PY + PH - y) / dy : dy < -1e-9 ? (PY - y) / dy : Infinity);
/** where the line through (x, y) along (dx, dy) is inside the picture: [from, to] along it, from (x, y) */
function span(x, y, dx, dy) {
  let lo = -Infinity, hi = Infinity;
  for (const [p, d, a, b] of [[x, dx, PX, PX + PW], [y, dy, PY, PY + PH]]) {
    if (Math.abs(d) < 1e-9) { if (p < a || p > b) return [0, 0]; continue; }
    const t0 = (a - p) / d, t1 = (b - p) / d; lo = Math.max(lo, Math.min(t0, t1)); hi = Math.min(hi, Math.max(t0, t1));
  }
  return hi > lo ? [lo, hi] : [0, 0];
}
/** flowPoint(index, t, shot, since): the index-th arrow (0 to 1871) at the film's second t in THE FLOW's shot: {x, y, dx, dy, speed, alpha, hit,
 *  glow} in the file's pixels: where it is, the way it is going (a unit vector), how fast (pixels a second), how seen it is (it fades in as it
 *  sets out and after the cut, out as it leaves the picture or is spent), spent on a point, its flash there (0 to 1), and its own brightness
 *  (0.2 to 1: most faint, a few bright, as the film's own meteors; a swarm all as bright was a blizzard of glitter over the meteors' sky). */
export function flowPoint(index, t, shot, since) {
  const S = STRIKE_FLOW[shot], law = FLOW[shot], rows = CDF[shot];
  const period = 1 / (law.rate * (0.75 + 0.5 * drawOf(index, 0, 0)));
  const run = since / period + drawOf(index, 0, 1), round = Math.floor(run), s = run - round;
  // the line it took when it set out on this round, drawn in that window of the film
  const set = Math.max(0, since - s * period), rowAt = rows[Math.min(rows.length - 1, Math.floor(set / (DRAWN.window * FRAME)))];
  const at = pick(rowAt, drawOf(index, round, 2)) / DRAWN.bins, appear = fade(since, 0, FLOW.appear), over = FLOW.over * PH, glow = 0.2 + 0.8 * drawOf(index, 0, 6) ** 3;
  if (law.way === 'out' || law.way === 'in') {
    const a = at * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a), [fx, fy] = S.focus, edge = toEdge(fx, fy, dx, dy) + over;
    if (law.way === 'out') {
      const r0 = FLOW.near * PH, r = r0 + (edge - r0) * s ** 1.5;
      return {x: fx + dx * r, y: fy + dy * r, dx, dy, speed: 1.5 * (edge - r0) * Math.sqrt(s) / period, alpha: appear * fade(s, 0, 0.1) * (1 - fade(r, edge - 2 * over, edge)), hit: 0, glow};
    }
    const core = (FLOW.core[0] + (FLOW.core[1] - FLOW.core[0]) * drawOf(index, round, 3)) * PH, arrive = 1 - FLOW.hit, g = Math.min(1, s / arrive);
    const r = edge - (edge - core) * g ** 1.25;
    return {x: fx + dx * r, y: fy + dy * r, dx: -dx, dy: -dy, speed: s < arrive ? 1.25 * (edge - core) * g ** 0.25 / (arrive * period) : 0,
      alpha: appear * fade(s, 0, 0.08) * (1 - fade(s, arrive - 0.03, arrive)), hit: appear * (s < arrive ? fade(s, arrive - FLOW.hit / 2, arrive) : 1 - fade(s, arrive, 1)), glow};
  }
  let ax = Math.cos(S.along), ay = Math.sin(S.along);
  if (ax * law.toward[0] + ay * law.toward[1] < 0) { ax = -ax; ay = -ay; }
  const q = S.lanes[0] + (S.lanes[1] - S.lanes[0]) * at, x0 = CX - Math.sin(S.along) * q, y0 = CY + Math.cos(S.along) * q;
  const [t0, t1] = span(x0, y0, ax, ay), from = t0 - over, length = t1 + over - from;
  const end = law.strike && drawOf(index, round, 4) < law.strike ? 0.3 + 0.55 * drawOf(index, round, 5) : 1, d = from + length * Math.min(s, end);
  return {x: x0 + ax * d, y: y0 + ay * d, dx: ax, dy: ay, speed: s < end ? length / period : 0,
    alpha: appear * fade(s, 0, 0.06) * (end < 1 ? 1 - fade(s, end - 0.02, end) : 1 - fade(s, 0.94, 1)),
    hit: end < 1 ? appear * (s < end ? fade(s, end - FLOW.hit / 2, end) : 1 - fade(s, end, end + FLOW.hit)) : 0, glow};
}
