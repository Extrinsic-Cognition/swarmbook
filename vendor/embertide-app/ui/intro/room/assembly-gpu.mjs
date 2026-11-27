/* assembly-gpu.mjs: THE TRADITIONAL ONE ON THE GPU (Oct 12 2026 11:3x WEST). His words, over lysa showing a plain sphere of faces: "ok, but
 * like... you gotta put the traditional lyssajudron there... the one with lyssajuouz curves trajectories for the satellites".
 *
 * The home's left (intro.bundle.js: assembly.js over the engine), the same picture drawn by the GPU: the goldberg of goldbergs (every member a
 * paper panel, the rest dark cells, the twelve pentagon chairs), the twelve worlds on their chairs' loops (the spherical Lissajous
 * 3:2 of W. Erb 2018: four tilted lanes, walked at uniform arc length, 84 s a loop, geostationary in the skin's frame) leaving their 12 s
 * trails, and inside every world its own chambers and agent balls flying its own twelve loops, its lanes inked by depth and by the balls'
 * nearness. The numbers are the bundle's (loopUnitAt, LOOP_RADIUS, TRAIL_MS, discussionPoint, the face light, agentScale, childScale).
 *
 * WHY IT HOLDS ANY NUMBER OF FACES: no cell is a polygon. A sphere is one quad, and its fragment shader finds the cell under the pixel: the
 * icosahedron face by the largest dot, the gnomonic point on that face, the nearest point of the face's triangular lattice (the geodesic's
 * dual, the goldberg G(m,0) with its twelve pentagons at the icosahedron's corners), a canonical id shared by the faces that meet on an edge.
 * A panel is the traditional's paper (its faces' texture array left with the bench, Nov 5 2026: git show acc7338fb:<this file>); seams are anti-aliased and fade
 * when the cells go under a few pixels, and under 2.5 px a cell is drawn at a coarser goldberg an octave at a time (two octaves cross-faded),
 * so a pixel shows one member of the cells it covers: a billion members read as a mosaic that resolves into them as the eye comes closer. A frame costs the pixels the spheres cover, never the members: m is one number per sphere. Four draws
 * a frame (spheres, balls, lanes, trails); lanes and trails are evaluated in the vertex shader from eight texels per curve.
 * cellOf() is the shader's lookup in JS (the same arithmetic): picking, and the tests.
 * THE DIVES (his 12:2x, told that the twelve never touch the skin, their centres 0.9 to 1.0 R0 above it: "add random events that are "traversing events"
 * where an orbiting lyssajudron-satellite enters the unit0 penetrating it and it causes a ripple to be formed when fully traversing the surface"; then 12:4x,
 * over a world sinking slowly through it: "i need to see the unit1s diving into unit0 as if they were fishing flying birds... pelicans diving into the
 * water... rippling when the passthrough the surface"). traverse() makes one world plunge like a gannet (diveAt, the same arithmetic in the trails' shader).
 * It climbs and stalls over its spot with its chambers spread, folds them in like wings and falls, hits the skin at about 3 R0/s, brakes under it and
 * holds, then bursts back out, opens, and climbs to its loop. It flies fast to rejoin its slot: the lag it built is paid back, never flown backwards.
 * Its balls and trail go with it, and the skin's depth hides it under the surface. frame() reports the instants its centre passes the skin, going in and
 * coming out; the page drops its rings there. A dive keeps real time whatever the orbits' pace (its lag is paid back at that pace). */

const TAU = Math.PI * 2, PHI = (1 + Math.sqrt(5)) / 2;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k], unit = (a) => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));

// ---- the icosahedron the engine builds (RQ.buildSkin), its faces outward, its thirty edges, the lattice of each face ----
const RAW = [[0,1,PHI],[0,1,-PHI],[0,-1,PHI],[0,-1,-PHI],[1,PHI,0],[1,-PHI,0],[-1,PHI,0],[-1,-PHI,0],[PHI,0,1],[-PHI,0,1],[PHI,0,-1],[-PHI,0,-1]];
export const ICO = (() => {
  const V = RAW.map(unit), near = (i, j) => Math.abs(dot(sub(RAW[i], RAW[j]), sub(RAW[i], RAW[j])) - 4) < 1e-9;
  const edges = [], eid = new Map(), faces = [];
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) if (near(i, j)) { eid.set(i * 12 + j, edges.length); edges.push([i, j]); }
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) for (let k = j + 1; k < 12; k++) if (near(i, j) && near(j, k) && near(i, k)) {
    let a = i, b = j, c = k; if (dot(cross(sub(V[b], V[a]), sub(V[c], V[a])), V[a]) < 0) [b, c] = [c, b]; faces.push([a, b, c]);
  }
  const E = (x, y) => eid.get(Math.min(x, y) * 12 + Math.max(x, y));
  const FN = new Float32Array(60), G1 = new Float32Array(80), G2 = new Float32Array(80), EB = new Float32Array(60), EC = new Float32Array(60);
  const FV = new Int32Array(80), FE = new Int32Array(80);
  let H = 0, EDGE = 0;
  faces.forEach(([a, b, c], f) => {
    const A = V[a], eb = sub(V[b], A), ec = sub(V[c], A), n = unit([A[0] + V[b][0] + V[c][0], A[1] + V[b][1] + V[c][1], A[2] + V[b][2] + V[c][2]]);
    const g1 = mul(cross(ec, n), 1 / dot(eb, cross(ec, n))), g2 = mul(cross(eb, n), 1 / dot(ec, cross(eb, n)));
    FN.set(n, 3 * f); EB.set(eb, 3 * f); EC.set(ec, 3 * f); G1.set([...g1, dot(A, g1)], 4 * f); G2.set([...g2, dot(A, g2)], 4 * f);
    FV.set([a, b, c, (a < b ? 1 : 0) | (a < c ? 2 : 0) | (b < c ? 4 : 0)], 4 * f); FE.set([E(a, b), E(a, c), E(b, c), 0], 4 * f);
    H = dot(A, n); EDGE = Math.hypot(...eb);
  });
  return { V, faces, edges, FN, G1, G2, EB, EC, FV, FE, H, EDGE };
})();

/** The goldberg G(m,0): how many cells (12 pentagons + 10(m^2 - 1) hexagons), and the frequency that holds `n` hexagons. */
export const cellsOf = (m) => 10 * m * m + 2;
export const frequencyFor = (n) => Math.max(1, Math.ceil(Math.sqrt(Math.max(0, n) / 10 + 1)));
export const SKIN = Object.freeze({ darkA: '#171C17', darkB: '#2F3127', seamDark: '#655F49', seamPanel: '#AE8B43', seamChair: '#AF9964', poolA: '#122C96', poolB: '#407EEC', rim: '#F0CF74', paperA: '#F3EEE4', paperB: '#FBF8F1', unsworn: '#F2EDE4', vacant: '#DCC080', ink: '#171411', loops: ['#AD8543', '#4E8B81', '#B39868', '#718996'] });   // THE FRONT'S PALETTE (the Swarmbook ball's): a chair and a dark cell (darkA to darkB, lit), the seams of land no one holds, of a member's panel and of a chair, a panel's paper, a world's chairs, the ink, the worlds' loops; Harmony's society paints its ball with it (life-menu/society.mjs: THE BALL IS SWARMBOOK'S, Nov 20 2026)

/** The cell under direction d (unit, in the skin's frame) of G(m,0): {id, face, si, ti, seam (lattice units to the nearest seam), centre}. The shader's arithmetic. */
export function cellOf(d, m) {
  const { FN, G1, G2, EB, EC, FV, FE, H } = ICO;
  let f = 0, best = -2;
  for (let i = 0; i < 20; i++) { const k = d[0] * FN[3 * i] + d[1] * FN[3 * i + 1] + d[2] * FN[3 * i + 2]; if (k > best) { best = k; f = i; } }
  const pp = mul(d, H / best);
  const s = m * (pp[0] * G1[4 * f] + pp[1] * G1[4 * f + 1] + pp[2] * G1[4 * f + 2] - G1[4 * f + 3]);
  const t = m * (pp[0] * G2[4 * f] + pp[1] * G2[4 * f + 1] + pp[2] * G2[4 * f + 2] - G2[4 * f + 3]);
  const s0 = Math.floor(s), t0 = Math.floor(t), fs = s - s0, ft = t - t0, up = fs + ft >= 1 ? 1 : 0;
  const q2 = (a, b) => a * a + b * b + a * b, dA = q2(fs - up, ft - up), dB = q2(fs - 1, ft), dC = q2(fs, ft - 1);
  const dn = Math.min(dA, dB, dC), dx = Math.max(dA, dB, dC), dm = dA + dB + dC - dn - dx;
  const [ns, nt] = dn === dA ? [up, up] : dn === dB ? [1, 0] : [0, 1];
  let si = Math.min(Math.max(s0 + ns, 0), m), ti = Math.min(Math.max(t0 + nt, 0), m - si); const ui = m - si - ti;
  const a = FV[4 * f], b = FV[4 * f + 1], c = FV[4 * f + 2], fl = FV[4 * f + 3];
  let id;
  if (si === 0 && ti === 0) id = a;
  else if (ti === 0 && si === m) id = b;
  else if (si === 0 && ti === m) id = c;
  else if (ti === 0) id = 12 + FE[4 * f] * (m - 1) + (fl & 1 ? si : m - si) - 1;
  else if (si === 0) id = 12 + FE[4 * f + 1] * (m - 1) + (fl & 2 ? ti : m - ti) - 1;
  else if (ui === 0) id = 12 + FE[4 * f + 2] * (m - 1) + (fl & 4 ? ti : m - ti) - 1;
  else id = 12 + 30 * (m - 1) + f * ((m - 1) * (m - 2) / 2) + (ti - 1) * (m - 1) - ti * (ti - 1) / 2 + si - 1;
  const centre = unit([0, 1, 2].map((k) => pp[k] + ((si - s) * EB[3 * f + k] + (ti - t) * EC[3 * f + k]) / m));
  return { id, face: f, si, ti, seam: 0.5 * (dm - dn), centre };
}

// ---- the bundle's orbit (assembly.js loopUnitAt / loopPoint, the engine's discussionPoint), unchanged ----
const ORBIT_PERIOD = 84000, ARC_STEPS = 1024, ARC = [0], TILTS = [-.34, .68, -.82, .28];
const curveSpeed = (u) => Math.sqrt(4 + 9 * Math.sin(2 * u) ** 2);
for (let i = 1; i <= ARC_STEPS; i++) { const a = (i - 1) * TAU / ARC_STEPS, b = i * TAU / ARC_STEPS; ARC.push(ARC[i - 1] + (b - a) * (curveSpeed(a) + 4 * curveSpeed((a + b) / 2) + curveSpeed(b)) / 6); }
export function phaseAtDistance(turns) {
  const fraction = ((turns % 1) + 1) % 1, distance = fraction * ARC[ARC_STEPS];
  let lo = 0, hi = ARC_STEPS;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ARC[mid] <= distance) lo = mid; else hi = mid; }
  return (lo + (distance - ARC[lo]) / (ARC[hi] - ARC[lo])) * TAU / ARC_STEPS;
}
const lissajousUnit = (u) => { const p = Math.sin(2 * u); return [p * Math.cos(3 * u), Math.cos(2 * u), p * Math.sin(3 * u)]; };
const tiltAz = (p, tilt, az) => { const c = Math.cos(tilt), s = Math.sin(tilt), y = p[1] * c - p[2] * s, z = p[1] * s + p[2] * c, ca = Math.cos(az), sa = Math.sin(az); return [p[0] * ca + z * sa, y, -p[0] * sa + z * ca]; };
/** assembly.js loopUnitAt: chair `chair`'s loop at parameter u, time `at`, lane 0 at radius 1. */
export const loopUnitAt = (chair, u, at) => { const lane = chair % 4; return mul(tiltAz(lissajousUnit(u), TILTS[lane], lane * Math.PI * .43 + at * .000004), (1.94 + lane * .035) / 1.94); };
export const loopPoint = (chair, at) => loopUnitAt(chair, phaseAtDistance(at / ORBIT_PERIOD + chair / 12), at);

// ---- THE DIVE: a gannet's plunge, in R0 and seconds of orbit time ----
// up: how far it climbs over its spot; hang: the climb and stall; fall: from the stall to the skin, under gravity; deep: its centre's lowest, from unit0's
// (deep enough that a whole world goes under); hold: under the surface; rise: from the deep to its loop, bursting out on the way
export const DIVE = Object.freeze({ up: 0.32, hang: 1.0, fall: 0.8, deep: 0.62, hold: 0.4, rise: 2.6 });
// how often a dive begins, ms between two, uniform in [from, to]: 1.75 to 4.7 s, a dive every 3.2 s on average, 18.1 a minute (his 14:2x "can you do 25%
// more frequent dives in general?" over 2.25 to 6 s, 14.5 a minute, which was his 13:0x "please augment 33% the rate of dives in time" over the 3 to 8 s of
// 2c6619aa). The gaps are 22 % shorter, not 20: a third dive while two are in flight waits 250 ms at a time, and at 1.8 to 4.8 s that wait ate 2 of the 25
// points (the home's loop simulated over 4e8 ms with diveAt's 5.04 s a dive: 17.9 a minute, +23 %; 1.75 to 4.7 s gives +25.3 %). The home and the bench both read it.
export const DIVE_GAP = Object.freeze([1750, 4700]);
export const nextDiveGap = () => DIVE_GAP[0] + Math.random() * (DIVE_GAP[1] - DIVE_GAP[0]);
// when the first dive begins, ms after the twelve start flying: at once (his 13:4x "can you decrease the time to first dive in the thing by 50%? i mean in
// the codebase so generally dysolight harmony make it quicker"). It was 2.5 s on the home, so the first splash came 4.3 s after the
// sphere's first frame; the climb and the fall (DIVE.hang + DIVE.fall = 1.8 s) are the bird's own and stay. The home reads it.
export const DIVE_FIRST = 0;
const s3 = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
/** intoAt(ms): THE ONE OF ITS OWN (Nov 4 2026): how far a device's world has come over her `ms` after the house let it in: 0 until her dive in its colour meets the
 *  skin (DIVE.hang + DIVE.fall), 1 once it has risen (DIVE.rise), eased between; a lookup of the time since the cause */
export const intoAt = (ms) => s3((ms / 1000 - DIVE.hang - DIVE.fall) / DIVE.rise);
/** lakeOf(value): THE LAKE, the keeper's enroll/devices as her twelve: the devices in (a Codex task is an agent, lib/entities.mjs SAID_AGENT_KINDS) by their order at
 *  the door (their numbers), five chairs apart, twelve at most -> [{seat, w (the world), hue, at_ms}] */
export const lakeOf = (v) => (v && Array.isArray(v.devices) ? v.devices : []).filter((d) => d && d.state === 'in' && /^\d+$/.test(d.number) && d.face && Number.isInteger(d.face.hue) && d.kind !== 'codex-task' && d.scanned && Number.isFinite(d.scanned.at_ms))   // THE COLOUR COMES AT THE SCAN (Nov 10 2026): in and scanned
  .sort((a, b) => a.number - b.number).slice(0, 12).map((d, i) => ({ seat: d.seat, w: (5 * i) % 12, hue: d.face.hue, at_ms: d.scanned.at_ms }));
/** diveAt(t, shell): a dive t s after it began, for a world whose loop is `shell` R0 from unit0's centre -> {r (its centre's distance from unit0's, R0),
 *  lag (s it is behind its slot on its loop: its speed along the loop is 1 - lag', which never goes under 0), fold (its chambers' reach, 1 at rest), end (s)} */
export function diveAt(t, shell) {
  const { up: H, hang: tA, fall: dB, deep: rMin, hold, rise: dR } = DIVE;
  const rTop = shell + H, g = 2 * (rTop - 1) / (dB * dB), v = g * dB, dC = 2 * (1 - rMin) / v, tS = tA + dB, tH = tS + dC + hold, end = tH + dR;
  if (!(t > 0 && t < end)) return { r: shell, lag: 0, fold: 1, end };
  const LA = 0.375 * tA, LB = LA + 0.875 * dB, LC = LB + dC + hold;
  if (t < tA) { const x = t / tA; return { r: shell + H * s3(x), lag: 0.75 * tA * (x ** 3 - x ** 4 / 2), fold: 1 + 0.12 * s3(x), end }; }   // climbs, slows, spreads
  if (t < tS) { const u = t - tA, y = u / dB; return { r: rTop - 0.5 * g * u * u, lag: LA + dB * (0.75 * y + 0.25 * (y ** 3 - y ** 4 / 2)), fold: 1.12 - 0.72 * s3(u / (0.45 * dB)), end }; }   // folds, falls
  if (t < tH) { const u = Math.min(t - tS, dC); return { r: 1 - (v * u - 0.5 * (v / dC) * u * u), lag: LB + t - tS, fold: 0.4, end }; }   // under: brakes, holds
  const x = (t - tH) / dR, m = 1 - x, B = 12 * LC / dR + 3;                                                   // bursts out, opens, climbs home, catching up
  return { r: rMin + (shell - rMin) * (1 - m ** 3 * (1 + 3 * x)), lag: LC + dR * ((1 - m ** 4) / 4 - B * (x * x / 2 - 2 * x ** 3 / 3 + x ** 4 / 4)), fold: 0.4 + 0.6 * s3((x - 0.22) / 0.4), end };
}
/** aimK(t, shell): HIS CLICK (Oct 12 2026 13:5x, "when i click i want any single unique unit1 to become of the color of the ripple happening and i want to see it
 *  dive where i clicked.. i am clicking and they dive"): how far an aimed dive has left its loop for the clicked point, 0 to 1: it turns to the point over the
 *  hang (there by the stall), falls and rises down that radial, and comes back to its loop over the last 65 % of the rise (the burst out is at 25 to 27 % of it). The same curve in the trail shader. */
export function aimK(t, shell) {
  const { up: H, hang: tA, fall: dB, deep: rMin, hold, rise: dR } = DIVE;
  const rTop = shell + H, g = 2 * (rTop - 1) / (dB * dB), v = g * dB, dC = 2 * (1 - rMin) / v, tH = tA + dB + dC + hold;
  if (!(t > 0 && t < tH + dR)) return 0;
  if (t < tA) return s3(t / tA);
  if (t < tH) return 1;
  return 1 - s3(((t - tH) / dR - .35) / .65);
}
/** slerp(a, b, k): the great-circle turn from unit a to unit b, k of the way */
export const slerp = (a, b, k) => { const d = Math.min(1, Math.max(-1, dot(a, b))); if (k <= 0 || d > .9999) return a; if (k >= 1) return b;
  const th = Math.acos(d), s = Math.sin(th); if (s < 1e-5) return b; const wa = Math.sin((1 - k) * th) / s, wb = Math.sin(k * th) / s;
  return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb]; };
/** the engine's discussionPoint (orbit 2.1, no shift): lane, parameter, time in seconds. */
const discussionPoint = (lane, u, time) => mul(tiltAz(lissajousUnit(u), TILTS[lane], lane * Math.PI * .43 + time * .004), 1.94 + lane * .035);
const seedOf = (name) => Array.from(name).reduce((v, c) => (v * 31 + c.charCodeAt(0)) % 65521, 0) / 65521;

// rotP(p, yaw, pitch) of the engine and rot() of the assembly as a matrix, rows
const turnRows = (yaw, pitch) => { const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch); return [cy, 0, sy, sy * sp, cp, -cy * sp, -sy * cp, sp, cy * cp]; };
const mm = (A, B) => { const C = new Array(9); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) C[3 * r + c] = A[3 * r] * B[c] + A[3 * r + 1] * B[3 + c] + A[3 * r + 2] * B[6 + c]; return C; };
const mv = (M, v) => [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]];
const tiltAzRows = (tilt, az) => { const c = Math.cos(tilt), s = Math.sin(tilt), ca = Math.cos(az), sa = Math.sin(az); return mm([ca, 0, sa, 0, 1, 0, -sa, 0, ca], [1, 0, 0, 0, c, -s, 0, s, c]); };

// ---- the twelve worlds: the bundle's fixture (intro-fixtures.js), geometry only ----
const SOURCE = { G0: { seats: 30, bind: { 2: 'P2', 6: 'P1', 10: 'C1' } }, C1: { seats: 20, bind: {} }, P2: { seats: 20, bind: {} }, P1: { seats: 20, bind: { 5: 'P12', 7: 'P11' } },
  P11: { seats: 20, bind: { 7: 'P111' } }, P12: { seats: 0, bind: {} }, P111: { seats: 0, bind: {} } };
const FORMS = [['G0'], ['P1', 'P11', 'P111', 'P12'], ['G0', 'P2', 'P1', 'C1', 'P11', 'P12', 'P111'], ['G0', 'P2', 'C1'], ['P11', 'P111'], ['G0', 'P1', 'P11', 'P111'],
  ['G0', 'P2', 'P1', 'P12'], ['G0', 'C1'], ['G0', 'P2', 'P1', 'C1', 'P11', 'P12'], ['P1', 'P12'], ['G0', 'P1'], ['P1', 'P11']];
export const HOME_SEATS = FORMS.reduce((n, ids) => n + ids.reduce((k, id) => k + SOURCE[id].seats, 0), 0);   // 680: every source seat a panel on the home today
const WORLDS = FORMS.map((ids, w) => {
  const nodes = [], take = (id, depth, parent, seat) => {
    const node = { id, name: `world-${w + 1}/${id}`, depth, parent, seat, seats: SOURCE[id].seats, kids: [] }; nodes.push(node);
    for (const [s, to] of Object.entries(SOURCE[id].bind)) if (ids.includes(to)) node.kids.push(take(to, depth + 1, node, +s));
    return node;
  };
  take(ids[0], 0, null, -1);
  for (const n of nodes) { n.seed = seedOf(n.name); n.bound = new Set(n.kids.map((k) => k.seat)); }
  return nodes;
});

// ---- shaders ----
const SPHERE_VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 aCorner;
layout(location=1) in vec4 iSphere;                       // view-space centre, radius
layout(location=2) in vec3 iC0; layout(location=3) in vec3 iC1; layout(location=4) in vec3 iC2;   // skin -> view, by columns
layout(location=5) in vec4 iCell;                          // m, member fraction (a world: its ink), style (0 the skin, 1 a world), seed
uniform vec3 uCam; uniform float uEye; uniform vec2 uView;
out vec2 vPx; flat out vec4 vSphere; flat out vec3 vC0; flat out vec3 vC1; flat out vec3 vC2; flat out vec4 vCell;
void main() {
  float z = iSphere.z + uEye, near = max(z - iSphere.w, 1e-3);
  vec2 c = uCam.xy + vec2(iSphere.x, -iSphere.y) * (uCam.z / z);
  vPx = c + aCorner * (iSphere.w * uCam.z / near * 1.06 + 2.0);
  vSphere = iSphere; vC0 = iC0; vC1 = iC1; vC2 = iC2; vCell = iCell;
  gl_Position = vec4(vPx.x / uView.x * 2.0 - 1.0, 1.0 - vPx.y / uView.y * 2.0, 0.0, 1.0);
}`;
const SPHERE_FS = `#version 300 es
precision highp float; precision highp int;
in vec2 vPx; flat in vec4 vSphere; flat in vec3 vC0; flat in vec3 vC1; flat in vec3 vC2; flat in vec4 vCell;
uniform vec3 uCam; uniform float uEye; uniform vec2 uDepth; uniform float uDpr;
uniform vec3 uFN[20]; uniform vec4 uG1[20]; uniform vec4 uG2[20]; uniform vec3 uEB[20]; uniform vec3 uEC[20]; uniform ivec4 uFV[20]; uniform ivec4 uFE[20];
uniform float uH; uniform float uEdge;
uniform vec3 uDarkA; uniform vec3 uDarkB; uniform vec3 uSeamDark; uniform vec3 uSeamPanel; uniform vec3 uSeamChair; uniform vec3 uPoolA; uniform vec3 uPoolB;
uniform vec3 uPaperA; uniform vec3 uPaperB; uniform vec3 uUnsworn; uniform vec3 uVacant; uniform vec4 uInk;
// THE PLAY, the radial ripples only (his 12:1x "the coloring on the surface of the thing... can you please only keep the radial ripple ones please?"): a ring
// runs out from where a touch fell, 1.1 rad a second, fading as it goes, read at a member's centre so a member lights whole, as a puck of the Exosphere does.
// Nothing else colours the skin: the faces keep their own colours, and with no ring alive the play costs nothing
uniform vec4 uRip[8]; uniform vec3 uRipCol[8]; uniform int uRipN;     // xyz where the touch fell (the skin's frame), w the ring's age (s); its colour
// THE FLOOR IS GIVEN (the Swarmbook front, dyson-society/app/assembly-dive.mjs: the meta swarm's floor is the mints Solana holds): with uFloor on, a member's cell is
// one the page names, never the hash's. uCells: two texels a cell (row 0: xyz its face's right, scaled to its tile, w its tile + 1, 0 for none; row 1: xyz its face's
// up, w 1 where a member holds the cell, 2 where that member is the visitor's own; none: open land, an opening). uFaces: the faces' tiles; uAtlas: its columns, its rows, a tile's hexagon flat to flat in px. A face lies on its cell as a
// sticker, lit with it; a ring tints it less than it tints paper
uniform float uFloor; uniform highp sampler2D uCells; uniform sampler2D uFaces; uniform vec3 uAtlas;
uniform float uSeats[12]; uniform float uFuel;   // THE PANTHEON IS HERS (Nov 22 2026, his "the unit1 satellites of the diving lyssajudron are the houses of the pantheon"): uSeats[i], how far world i has come home to its chair i; uFuel, the flask's level in her (her height, -1 to 1; under -1, none)
out vec4 o;
uint hsh(uint x) { x ^= x >> 16; x *= 0x7feb352du; x ^= x >> 15; x *= 0x846ca68bu; x ^= x >> 16; return x; }
float q2(float a, float b) { return a * a + b * b + a * b; }
vec3 rippleAt(vec3 cc) {                                              // the light the rings give this member
  vec3 g = vec3(0.0);
  for (int i = 0; i < 8; i++) { if (i >= uRipN) break; float a = acos(clamp(dot(cc, uRip[i].xyz), -1.0, 1.0)) - uRip[i].w * 1.1; g += uRipCol[i] * exp(-a * a * 180.0) * exp(-uRip[i].w * 0.75) * 1.6; }
  return g;
}
vec3 emit(vec3 col, vec3 g, float k) {                                // a lit member takes the light's colour, as a puck switches colour; it never just whitens
  float gi = max(g.r, max(g.g, g.b)) * k; if (gi <= 0.002) return col;
  return mix(col, g / max(g.r, max(g.g, max(g.b, 1e-4))) * min(1.0, 0.5 + gi * 0.5), clamp(gi, 0.0, 1.0));
}
vec3 D, DDX, DDY, PP; int F; float BEST, PA, OPEN, LY, GLASS; bool INSIDE;   // OPEN: how far the pixel of the cell just painted is an opening; INSIDE: the far wall, seen from within
// the cell of G(m,0) under this pixel, painted: the member's face (or a dark cell, a chair, a world's paper) and its seam
vec3 paint(float m) {
  int mi = int(m + 0.5); OPEN = 0.0; GLASS = 0.0;
  float s = m * (dot(PP, uG1[F].xyz) - uG1[F].w), t = m * (dot(PP, uG2[F].xyz) - uG2[F].w);
  float s0 = floor(s), t0 = floor(t), fs = s - s0, ft = t - t0, up = step(1.0, fs + ft);
  float dA = q2(fs - up, ft - up), dB = q2(fs - 1.0, ft), dC = q2(fs, ft - 1.0);
  float dn = min(dA, min(dB, dC)), dm = dA + dB + dC - dn - max(dA, max(dB, dC));
  vec2 nc = dn == dA ? vec2(up) : (dn == dB ? vec2(1.0, 0.0) : vec2(0.0, 1.0));
  float seam = 0.5 * (dm - dn);
  int si = clamp(int(s0 + nc.x), 0, mi); int ti = clamp(int(t0 + nc.y), 0, mi - si); int ui = mi - si - ti;
  ivec4 fv = uFV[F]; ivec4 fe = uFE[F];
  int id;
  if (si == 0 && ti == 0) id = fv.x;
  else if (ti == 0 && si == mi) id = fv.y;
  else if (si == 0 && ti == mi) id = fv.z;
  else if (ti == 0) id = 12 + fe.x * (mi - 1) + ((fv.w & 1) != 0 ? si : mi - si) - 1;
  else if (si == 0) id = 12 + fe.y * (mi - 1) + ((fv.w & 2) != 0 ? ti : mi - ti) - 1;
  else if (ui == 0) id = 12 + fe.z * (mi - 1) + ((fv.w & 4) != 0 ? ti : mi - ti) - 1;
  else id = 12 + 30 * (mi - 1) + F * ((mi - 1) * (mi - 2) / 2) + (ti - 1) * (mi - 1) - ti * (ti - 1) / 2 + si - 1;
  vec3 cc = normalize(PP + ((float(si) - s) * uEB[F] + (float(ti) - t) * uEC[F]) / m);
  vec3 cv = cc.x * vC0 + cc.y * vC1 + cc.z * vC2;                  // the cell's own normal, in view: a face is lit flat, as the bundle lights it
  float cellPx = uEdge * pow(BEST, 1.5) / (m * uH) / PA;             // one lattice step (a cell, flat to flat) in pixels
  uint hh = hsh(uint(id) * 2654435761u + uint(vCell.w));
  bool chair = id < 12, given = uFloor > 0.5 && vCell.z < 0.5 && m == vCell.x; vec4 fa = vec4(0.0), fb = vec4(0.0);
  if (given) { fa = texelFetch(uCells, ivec2(id, 0), 0); fb = texelFetch(uCells, ivec2(id, 1), 0); }
  bool panel = !chair && (given ? fb.w > 0.5 : float(hh >> 8u) < vCell.y * 16777216.0);
  float lam = 0.72 + 0.4 * max(0.0, dot(cv, vec3(0.35, 0.55, -0.75))), calm = clamp(m / 6.0, 0.33, 1.0);   // calm: a ring lights a whole cell, so the few large cells of a small skin take it gently (the welcome's skin, past six, as it was)
  vec3 col, seamCol; float seamW, seamA = 1.0;
  if (vCell.z > 0.5) {                                               // a world's chamber: the engine's paper floor, its chairs unsworn and vacant
    col = (chair ? ((id & 1) == 1 ? uUnsworn : uVacant) : (id % 3 == 0 ? uPaperA : uPaperB)) * lam;
    seamCol = uInk.rgb; seamA = uInk.a; seamW = (chair ? 1.6 : 1.1) * vCell.y;
  } else if (panel) {                                                // a member: the traditional's white panel
    col = uPaperB * lam; float rk = 1.0;
    if (fa.w > 0.5 && !INSIDE) {                                     // its face (outside only; from within, its paper back): the tile's hexagon on the cell's, by the gnomonic point of this pixel on the cell's plane
      vec3 tt = D / dot(D, cc) - cc; float sl = fa.w - 1.0;
      vec4 f = textureLod(uFaces, (vec2(mod(sl, uAtlas.x), floor(sl / uAtlas.x)) + clamp(vec2(0.5 + dot(tt, fa.xyz), 0.5 - dot(tt, fb.xyz)), 0.0, 1.0)) / uAtlas.xy, max(0.0, log2(uAtlas.z / cellPx)));
      col = col * (1.0 - f.a) + f.rgb * lam; rk = 0.45;
    }
    if (uRipN > 0) col = emit(col, rippleAt(cc), rk * calm);
    seamCol = uSeamPanel; seamW = 0.85;
    if (fb.w > 1.5 && !INSIDE) { seamCol = vec3(0.941, 0.812, 0.455); seamW = clamp(cellPx * 0.07 / uDpr, 2.2, 7.0); }   // THE VISITOR'S OWN (row 1's w 2): its rim in the mint's gold (dl-her-portrait.js RIM), wide enough to find on a turning ball
  } else {
    col = mix(uDarkA, uDarkB, clamp(0.5 + dot(cv, vec3(-0.25, 0.5, -0.8)) / 1.8, 0.0, 1.0) * 0.78);
    if ((!chair || mi == 1) && uRipN > 0) col = emit(col, rippleAt(cc), chair ? 0.28 : 0.85 * calm);   // a seat no member holds is a puck too, a dimmer one; the twelve chairs stay dark, but on the dodecahedron, where they are the whole skin and take a ring faintly
    seamCol = chair ? uSeamChair : uSeamDark; seamW = chair ? 0.85 : 0.34;
    // OPEN LAND (his Nov 19 2026 "Yes, open them"; Sept 8 "make all the empty hexs transparent... i wanna see a cavity"; Sept 10 allocated ones "should NEVER BE
    // TRANSAPRENT"): a place on the floor no one holds yet is an opening in the frame, its edge alone drawn (a ring lights the edge), the inside seen through it
    if (given && !chair) { OPEN = 1.0; col = vec3(0.0); seamCol = uRipN > 0 ? emit(uSeamDark, rippleAt(cc), 0.85 * calm) : uSeamDark; seamW = 0.9; } if (given && chair && fb.w > 2.5) { col = mix(uPoolA, uPoolB, clamp(0.5 + dot(cv, vec3(-0.25, 0.5, -0.8)) / 1.8, 0.0, 1.0)); seamCol = vec3(0.941, 0.812, 0.455); seamW = clamp(cellPx * 0.07 / uDpr, 2.2, 7.0); }   // A SEALED HOUSE (Nov 20 2026, his "the first pentagon is nefertiti"): a chair a posiverse holds (row 1's w 3), the pool's blue (the mint page's pentagon), the mint's gold seam
    if (chair && vCell.z < 0.5 && uSeats[id] > 0.0) { float k = uSeats[id]; col += mix(uPoolA, uPoolB, clamp(0.5 + dot(cv, vec3(-0.25, 0.5, -0.8)) / 1.8, 0.0, 1.0)) * k * (0.12 + 0.9 * exp(-seam * 5.0)); seamCol = mix(seamCol, vec3(0.941, 0.812, 0.455), k); seamW = mix(seamW, clamp(cellPx * 0.07 / uDpr, 2.2, 7.0), k); } GLASS = 1.0;   // THE PANTHEON IS HERS: a chair its world comes home to wears a sealed house's gold rim, the pool's blue light along it; GLASS: her dark glass, not a member's paper
  }
  if (vCell.z < 0.5 && uFuel > -1.0 && LY < uFuel && (!chair || uSeats[id] <= 0.0)) { seamCol = mix(seamCol, vec3(0.95, 0.74, 0.26), 0.85 * smoothstep(0.0, 0.06, uFuel - LY)); seamW = max(seamW, 1.1); }   // THE FLASK IS HER: under the level her seams carry the amber's light
  float w = seamW * uDpr, we = max(w, 1.0), sc = clamp(we * 0.5 + 0.5 - seam * cellPx, 0.0, 1.0) * (w / we) * seamA * smoothstep(1.5, 4.0, cellPx);
  OPEN *= 1.0 - sc;                                                  // an opening's edge stands, the rest of it is open (its colour comes back premultiplied)
  return mix(col, seamCol, sc);
}
// THE ONE OF ITS OWN (his Nov 4 2026 23:54 UTC, over her turned tangerine: "bro this is wrong... after the scan it needs to go from diving lyssajudron interpolated in
// some creative way into the one of its own"): the device's world over her as its card draws it (seat-world.mjs worldSvg: the hex lattice of cell 0.36 on the angle
// plane round the glass's axis, its dark cells where its number puts them, lit from the upper left, its stroke). A cell is its once the front from her splash, at the
// glass's axis, has passed its centre, and it flashes as it lands. uOwn: its hue (degrees; under 0, none), the front (rad), the flash; uOwnSeed: seedOf(its number)
uniform vec3 uOwn; uniform uint uOwnSeed; uniform float uWas; float ownH;   // MAKE IT YOURS (Nov 5 2026): uWas, the hue it wore before his recolour (under 0, none), its old world beyond the front, never her; ownH, the hue painted
uint mx(uint x) { x ^= 0x9e3779b9u; x = (x ^ (x >> 16)) * 0x85ebca6bu; x = (x ^ (x >> 13)) * 0xc2b2ae35u; return x ^ (x >> 16); }   // seat-world.mjs mix32
vec3 hsl(float s, float l) { vec3 k = mod(vec3(0.0, 8.0, 4.0) + ownH / 30.0, 12.0); return l - s * min(l, 1.0 - l) * clamp(min(k - 3.0, 9.0 - k), -1.0, 1.0); }
float own(vec3 nv, out vec3 col) {                                   // nv: the pixel's normal in view -> 1 where its world has come, and its colour there
  float t = acos(clamp(-nv.z, -1.0, 1.0)), l = length(nv.xy);
  vec2 sh = vec2(float(mx(uOwnSeed)), float(mx(uOwnSeed + 1u))) * (0.3 / 4294967296.0), p = (l > 1e-6 ? vec2(nv.x, -nv.y) * (t / l) : vec2(0.0)) - sh;
  vec3 f = vec3((0.57735027 * p.x - p.y / 3.0) / 0.36, p.y / 0.54, 0.0); f.z = -f.x - f.y;
  vec3 q = round(f), e = abs(q - f);
  if (e.x > e.y && e.x > e.z) q.x = -q.y - q.z; else if (e.y > e.z) q.y = -q.x - q.z;
  vec2 c = vec2(0.62353829 * (q.x + 0.5 * q.y), 0.54 * q.y), d = p - c; c += sh;
  float th = length(c), lit = max(0.0, dot(vec3(th > 1e-6 ? c * (sin(th) / th) : vec2(0.0), cos(th)), normalize(vec3(-0.45, -0.55, 0.7))));
  float edge = 0.31176915 - max(abs(d.x), max(abs(dot(d, vec2(0.5, 0.8660254))), abs(dot(d, vec2(-0.5, 0.8660254))))), z = (uOwn.y - th) / 0.16, come = step(th, uOwn.y); ownH = come > 0.5 || uWas < 0.0 ? uOwn.x : uWas;
  col = mx(uint(int(q.x)) * 73856093u ^ uint(int(q.y)) * 19349663u ^ uOwnSeed * 83492791u) < 730144441u ? hsl(0.45, 0.14 + 0.12 * lit) : hsl(0.62 + 0.18 * lit, 0.46 + 0.34 * lit);
  col = mix(mix(col, hsl(0.3, 0.3), 0.45 * (1.0 - smoothstep(0.02 - PA, 0.02 + PA, edge))), hsl(0.9, 0.92), uOwn.z * exp(-z * z) * come);
  return uWas < 0.0 ? come : 1.0;
}
void main() {
  vec3 ro = vec3(0.0, 0.0, -uEye), rd = normalize(vec3((vPx.x - uCam.x) / uCam.z, (uCam.y - vPx.y) / uCam.z, 1.0));
  vec3 oc = ro - vSphere.xyz;
  float b = dot(oc, rd), h = b * b - (dot(oc, oc) - vSphere.w * vSphere.w);
  vec3 hit = ro + rd * (-b - sqrt(max(h, 0.0)));
  vec3 nv = (hit - vSphere.xyz) / vSphere.w;
  D = normalize(vec3(dot(vC0, nv), dot(vC1, nv), dot(vC2, nv)));
  DDX = dFdx(D); DDY = dFdy(D);
  PA = max(0.5 * (length(DDX) + length(DDY)), 1e-12);               // the pixel's footprint, in radians of this sphere
  float cover = clamp((vSphere.w - length(cross(rd, oc))) * uCam.z / (vSphere.z + uEye) + 0.5, 0.0, 1.0);
  if (h < 0.0 || cover <= 0.0) discard;
  F = 0; BEST = -2.0;                                                // the icosahedron face, the gnomonic point on it
  for (int i = 0; i < 20; i++) { float k = dot(D, uFN[i]); if (k > BEST) { BEST = k; F = i; } }
  PP = D * (uH / BEST); LY = (hit.y - vSphere.y) / vSphere.w;
  // cells under a few pixels are drawn at a coarser goldberg, an octave at a time, the two nearest octaves cross-faded: each pixel shows a
  // member of the cells it covers, so a billion faces read as a mosaic of faces that resolves into them as the eye comes closer, never shimmering
  float m = vCell.x, lod = log2(2.5 / (uEdge * pow(BEST, 1.5) / (m * uH) / PA));
  vec3 col; OPEN = 0.0; INSIDE = false;
  if (uOwn.x >= 0.0 && vCell.z < 0.5 && own(nv, col) > 0.5) {}      // THE ONE OF ITS OWN: where its world has come, it is drawn in her place
  else if (lod <= 0.0) col = paint(m);
  else { float k = floor(lod); col = mix(paint(max(1.0, floor(m / exp2(k)))), paint(max(1.0, floor(m / exp2(k + 1.0)))), lod - k); OPEN = 0.0; }   // cells of a few px: the mosaic, no opening
  float a = 1.0 - OPEN, z = hit.z, af = a, gf = GLASS, liq = 0.0; vec3 amb = vec3(0.0);
  if (uFuel > -1.0 && vCell.z < 0.5) {                               // THE FLASK IS HER (Nov 22 2026): the amber ($WARM's gold, #ebb22c, past the palace's law as the mint's gold seams are) stands in her to its level, level whatever her turn, as thick as the ray's run through it, its top lit where the ray comes down through it
    float Y = vSphere.y + uFuel * vSphere.w, sq = sqrt(max(h, 0.0)), t0 = -b - sq, t1 = -b + sq, tc = abs(rd.y) > 1e-6 ? (Y - ro.y) / rd.y : (ro.y < Y ? 1e9 : -1e9), run = rd.y > 0.0 ? min(t1, tc) - t0 : t1 - max(t0, tc);
    liq = 1.0 - exp(-2.4 * max(run, 0.0) / vSphere.w); amb = mix(vec3(0.62, 0.34, 0.05), vec3(1.0, 0.8, 0.36), clamp(0.22 + 0.5 * float(rd.y < 0.0 && tc > t0 && tc < t1) + 0.35 * smoothstep(Y - 1.2 * vSphere.w, Y, hit.y), 0.0, 1.0)) * (0.55 + 0.45 * clamp(-nv.z, 0.0, 1.0)) + vec3(1.0, 0.95, 0.85) * 0.45 * pow(max(dot(reflect(rd, nv), vec3(-0.38, 0.62, -0.69)), 0.0), 28.0);
  }
  if (OPEN > 0.0) {                                                  // OPEN LAND: the far wall of the shell, seen from within through the opening, faint (as the mint sphere's back faces are);
                                                                     // the depth left open behind it, so a world, a dive or a trail inside or behind her shows through
    vec3 far = ro + rd * (-b + sqrt(max(h, 0.0))), nf = (far - vSphere.xyz) / vSphere.w;
    D = normalize(vec3(dot(vC0, nf), dot(vC1, nf), dot(vC2, nf))); F = 0; BEST = -2.0;
    for (int i = 0; i < 20; i++) { float k = dot(D, uFN[i]); if (k > BEST) { BEST = k; F = i; } }
    PP = D * (uH / BEST); INSIDE = true; LY = (far.y - vSphere.y) / vSphere.w;
    vec3 back = paint(m) * 0.42; float ab = (1.0 - OPEN) * 0.3;
    col += (amb * liq * 0.7 + back * 0.3 * (1.0 - liq)) * (1.0 - a); if (a < 0.5 && liq < 0.5) z = uDepth.x + 1.0 / uDepth.y; a += (1.0 - a) * (liq * 0.45 + (1.0 - liq) * ab);
    if (a < 0.004) discard;                                          // through both walls: whatever stands behind her
  }
  col = mix(col, amb, liq * (0.08 + 0.6 * gf) * af) + vec3(1.0, 0.9, 0.62) * 0.7 * exp(-pow((hit.y - vSphere.y - uFuel * vSphere.w) / (0.012 * vSphere.w), 2.0)) * float(uFuel > -1.0 && vCell.z < 0.5);   // seen through her dark glass (a member's face keeps its own); the level a line of light on her front
  o = vec4(col * cover, a * cover);
  gl_FragDepth = clamp((z - uDepth.x) * uDepth.y, 0.0, 1.0);
}`;
const BALL_VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 aCorner; layout(location=1) in vec4 iBall; layout(location=2) in vec4 iCol;
uniform vec3 uCam; uniform float uEye; uniform vec2 uView; uniform vec2 uDepth;
out vec2 vLocal; flat out vec4 vCol; flat out vec3 vR;
void main() {
  float s = uCam.z / (iBall.z + uEye), r = iBall.w * s, rr = max(r, 0.6);
  vLocal = aCorner * (rr + 1.0); vCol = iCol; vR = vec3(rr, min(1.0, r * r / 0.36), iBall.z);
  vec2 px = uCam.xy + vec2(iBall.x, -iBall.y) * s + vLocal;
  gl_Position = vec4(px.x / uView.x * 2.0 - 1.0, 1.0 - px.y / uView.y * 2.0, clamp((iBall.z - iBall.w - uDepth.x) * uDepth.y, 0.0, 1.0) * 2.0 - 1.0, 1.0);
}`;
const BALL_FS = `#version 300 es
precision highp float;
in vec2 vLocal; flat in vec4 vCol; flat in vec3 vR; uniform float uDpr; out vec4 o;
void main() {
  float r = vR.x, dist = length(vLocal), cover = clamp(r + 0.5 - dist, 0.0, 1.0);
  if (cover <= 0.0) discard;
  vec3 c = vCol.rgb, light = min(c * 1.35, vec3(1.0)), col;
  if (r < 2.5) col = mix(c * 0.55, c * 1.22, clamp(1.0 - dist / max(r - 0.6, 0.3), 0.0, 1.0));   // a speck: the dark rim and the bright middle it rings
  else {                                                               // the shaded ball: the light up and to the right, its rim
    float g = clamp(length(vLocal / r - vec2(0.28, -0.34)) / 1.3, 0.0, 1.0);
    col = g < 0.38 ? mix(vec3(1.0, 0.992, 0.969), light, g / 0.38) : g < 0.78 ? mix(light, c, (g - 0.38) / 0.4) : mix(c, c * 0.6, (g - 0.78) / 0.22);
    col = mix(col, c * 0.55, smoothstep(r - max(1.1 * uDpr, 0.65) - 0.5, r - 0.2, dist));
  }
  float a = cover * vR.y; o = vec4(col * a, a);
}`;
const LINE_VS = `#version 300 es
precision highp float; precision highp int;
layout(location=0) in vec2 aCorner;                              // x: the segment's start (0) or end (1), y: its side
uniform highp sampler2D uCurves; uniform highp sampler2D uArc; uniform int uSeg; uniform int uRow0;
uniform vec3 uCam; uniform float uEye; uniform vec2 uView; uniform vec2 uDepth; uniform float uDpr;
out float vSide; flat out float vHalf; flat out vec4 vCol;
vec3 lis(float u) { float p = sin(2.0 * u); return vec3(p * cos(3.0 * u), cos(2.0 * u), p * sin(3.0 * u)); }
vec3 tiltAz(vec3 p, float tilt, float az) { float c = cos(tilt), s = sin(tilt), y = p.y * c - p.z * s, z = p.y * s + p.z * c, ca = cos(az), sa = sin(az); return vec3(p.x * ca + z * sa, y, -p.x * sa + z * ca); }
float arcU(float turns) { float x = fract(turns) * 1024.0; int i = min(int(x), 1023); return mix(texelFetch(uArc, ivec2(i, 0), 0).r, texelFetch(uArc, ivec2(i + 1, 0), 0).r, x - float(i)); }
float angd(float x) { return abs(x - 6.2831853 * floor(x / 6.2831853 + 0.5)); }
float s3(float x) { x = clamp(x, 0.0, 1.0); return x * x * (3.0 - 2.0 * x); }
vec3 slerp3(vec3 a, vec3 b, float k) {                              // slerp() in JS: the great-circle turn from a to b, k of the way
  float d = clamp(dot(a, b), -1.0, 1.0); if (k <= 0.0 || d > 0.9999) return a; if (k >= 1.0) return b;
  float th = acos(d), s = sin(th); if (s < 1e-5) return b; return (a * sin((1.0 - k) * th) + b * sin(k * th)) / s;
}
float aimK(float t, float shell) {                                  // aimK() in JS: how far an aimed dive (his click) has left its loop for the clicked point
  const float H = ${DIVE.up.toFixed(4)}, TA = ${DIVE.hang.toFixed(4)}, DB = ${DIVE.fall.toFixed(4)}, RMIN = ${DIVE.deep.toFixed(4)}, HOLD = ${DIVE.hold.toFixed(4)}, DR = ${DIVE.rise.toFixed(4)};
  float rTop = shell + H, g = 2.0 * (rTop - 1.0) / (DB * DB), v = g * DB, dC = 2.0 * (1.0 - RMIN) / v, tH = TA + DB + dC + HOLD;
  if (t <= 0.0 || t >= tH + DR) return 0.0;
  if (t < TA) return s3(t / TA);
  if (t < tH) return 1.0;
  return 1.0 - s3(((t - tH) / DR - 0.35) / 0.65);
}
vec2 diveAt(float t, float shell) {                                 // THE DIVE, diveAt() in JS: (its centre's distance from unit0's in R0, s behind its slot)
  const float H = ${DIVE.up.toFixed(4)}, TA = ${DIVE.hang.toFixed(4)}, DB = ${DIVE.fall.toFixed(4)}, RMIN = ${DIVE.deep.toFixed(4)}, HOLD = ${DIVE.hold.toFixed(4)}, DR = ${DIVE.rise.toFixed(4)};
  float rTop = shell + H, g = 2.0 * (rTop - 1.0) / (DB * DB), v = g * DB, dC = 2.0 * (1.0 - RMIN) / v, tS = TA + DB, tH = tS + dC + HOLD;
  if (t <= 0.0 || t >= tH + DR) return vec2(shell, 0.0);
  float LA = 0.375 * TA, LB = LA + 0.875 * DB, LC = LB + dC + HOLD;
  if (t < TA) { float x = t / TA; return vec2(shell + H * s3(x), 0.75 * TA * (x * x * x - 0.5 * x * x * x * x)); }
  if (t < tS) { float u = t - TA, y = u / DB; return vec2(rTop - 0.5 * g * u * u, LA + DB * (0.75 * y + 0.25 * (y * y * y - 0.5 * y * y * y * y))); }
  if (t < tH) { float u = min(t - tS, dC); return vec2(1.0 - (v * u - 0.5 * (v / dC) * u * u), LB + t - tS); }
  float x = (t - tH) / DR, m = 1.0 - x, B = 12.0 * LC / DR + 3.0;
  return vec2(RMIN + (shell - RMIN) * (1.0 - m * m * m * (1.0 + 3.0 * x)), LC + DR * ((1.0 - m * m * m * m) * 0.25 - B * (x * x * 0.5 - x * x * x * 2.0 / 3.0 + x * x * x * x * 0.25)));
}
vec2 proj(vec3 q) { return uCam.xy + vec2(q.x, -q.y) * (uCam.z / (q.z + uEye)); }
void main() {
  int row = uRow0 + gl_InstanceID / uSeg, k = gl_InstanceID % uSeg;
  vec4 r0 = texelFetch(uCurves, ivec2(0, row), 0), r1 = texelFetch(uCurves, ivec2(1, row), 0), r2 = texelFetch(uCurves, ivec2(2, row), 0);
  vec4 r3 = texelFetch(uCurves, ivec2(3, row), 0), r4 = texelFetch(uCurves, ivec2(4, row), 0), r5 = texelFetch(uCurves, ivec2(5, row), 0), r6 = texelFetch(uCurves, ivec2(6, row), 0);
  vec3 la, lb; float w, alpha;
  if (r0.w < 0.5) {                                                  // a lane: its whole loop; ink by depth (front) and by the balls' nearness
    float u0 = float(k) / float(uSeg) * 6.2831853, u1 = float(k + 1) / float(uSeg) * 6.2831853;
    la = lis(u0); lb = lis(u1);
    float za = r3.z + r1.w * dot(r2.xyz, la), zb = r3.z + r1.w * dot(r2.xyz, lb);
    float front = clamp(0.5 - ((za + zb) * 0.5 - r3.z) / (r3.w * 3.5), 0.0, 1.0);
    float dd = min(angd(u0 - r4.x), min(angd(u0 - r4.y), angd(u0 - r4.z))), prox = exp(-dd * dd / 0.12);
    w = (0.8 + front * 0.65 + prox * 0.4) * r2.w; alpha = (0.16 + front * 0.34 + prox * 0.16) * r4.w;
  } else {                                                           // a trail: the last 12 s of a world's flight, thinning and fading to its tail
    float a0 = 1.0 - float(k) / float(uSeg), a1 = 1.0 - float(k + 1) / float(uSeg);
    // a diving world's trail flies its dive: r6.y the dive's age, r6.z the trail's length, both in real s (under 0: no dive); its shell is S over R0 (r1.w / r3.w)
    float shell = r1.w / r3.w, ka = r6.x / r6.z, kz = r4.z / r6.z;  // turns and azimuth a second
    vec2 da = r6.y < 0.0 ? vec2(shell, 0.0) : diveAt(r6.y - a0 * r6.z, shell), db = r6.y < 0.0 ? vec2(shell, 0.0) : diveAt(r6.y - a1 * r6.z, shell);
    la = tiltAz(lis(arcU(r4.w - a0 * r6.x - da.y * ka)), r4.x, r4.y - a0 * r4.z - da.y * kz) * (da.x / shell);
    lb = tiltAz(lis(arcU(r4.w - a1 * r6.x - db.y * ka)), r4.x, r4.y - a1 * r4.z - db.y * kz) * (db.x / shell);
    vec4 r7 = texelFetch(uCurves, ivec2(7, row), 0);                 // HIS CLICK: an aimed dive's point (the skin's frame, r7.xyz) and its flag (r7.w): the streak flies the same turn
    if (r7.w > 0.5 && r6.y >= 0.0) { la = slerp3(la / (da.x / shell), r7.xyz, aimK(r6.y - a0 * r6.z, shell)) * (da.x / shell); lb = slerp3(lb / (db.x / shell), r7.xyz, aimK(r6.y - a1 * r6.z, shell)) * (db.x / shell); }
    w = (0.35 + 1.25 * (1.0 - a1)) * r2.w; alpha = (1.0 - a1) * 0.75;
  }
  vec3 a = r3.xyz + r1.w * vec3(dot(r0.xyz, la), dot(r1.xyz, la), dot(r2.xyz, la)), b = r3.xyz + r1.w * vec3(dot(r0.xyz, lb), dot(r1.xyz, lb), dot(r2.xyz, lb));
  vec2 pa = proj(a), pb = proj(b), dir = pb - pa; float len = length(dir); dir = len > 1e-5 ? dir / len : vec2(1.0, 0.0);
  float wpx = w * uDpr, we = max(wpx, 1.0);
  vHalf = we * 0.5; vSide = aCorner.y * (vHalf + 1.0); vCol = vec4(r5.rgb, alpha * r5.w * wpx / we);
  vec2 p = mix(pa - dir * 0.5, pb + dir * 0.5, aCorner.x) + vec2(-dir.y, dir.x) * vSide;
  gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, clamp((mix(a.z, b.z, aCorner.x) - uDepth.x) * uDepth.y, 0.0, 1.0) * 2.0 - 1.0, 1.0);
}`;
const LINE_FS = `#version 300 es
precision highp float;
in float vSide; flat in float vHalf; flat in vec4 vCol; out vec4 o;
void main() { float a = vCol.a * clamp(vHalf + 0.5 - abs(vSide), 0.0, 1.0); if (a <= 0.002) discard; o = vec4(vCol.rgb * a, a); }`;

/**
 * createAssemblyGPU(canvas, {law, dpr}) -> {renderer, setMembers(n), lake(cols), frame(now, {zoom}) -> {members, m, cellPx}, info()}.
 * law(hex) -> hex: the page's colour law (the palace: HarmonyIce.hex); lake(cols) gives world w a colour of its own past it, cols[w] ([r, g, b]).
 */
export function createAssemblyGPU(canvas, { law = (c) => c, dpr = Math.min(2, globalThis.devicePixelRatio || 1) } = {}) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true, depth: true, powerPreference: 'high-performance' });
  if (!gl) throw new Error('no WebGL2');
  const dbg = gl.getExtension('WEBGL_debug_renderer_info'), renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const program = (vs, fs) => { const p = gl.createProgram(); gl.attachShader(p, shader(gl.VERTEX_SHADER, vs)); gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i).name.replace(/\[0\]$/, ''); u[name] = gl.getUniformLocation(p, name); } return { p, u }; };
  const SPH = program(SPHERE_VS, SPHERE_FS), BALL = program(BALL_VS, BALL_FS), LINE = program(LINE_VS, LINE_FS);
  const rgb = (hex) => { const n = parseInt(law(hex).slice(1, 7), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };

  // the quad every instance draws, and the instanced buffers
  const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const segQuad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, segQuad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -1, 1, -1, 0, 1, 1, 1]), gl.STATIC_DRAW);
  const vaoOf = (corner, inst, layout) => { const v = gl.createVertexArray(); gl.bindVertexArray(v); gl.bindBuffer(gl.ARRAY_BUFFER, corner); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    if (inst) { gl.bindBuffer(gl.ARRAY_BUFFER, inst); const stride = layout.reduce((a, n) => a + n, 0) * 4; let off = 0;
      layout.forEach((n, i) => { gl.enableVertexAttribArray(i + 1); gl.vertexAttribPointer(i + 1, n, gl.FLOAT, false, stride, off); gl.vertexAttribDivisor(i + 1, 1); off += n * 4; }); }
    gl.bindVertexArray(null); return v; };
  const sphereBuf = gl.createBuffer(), ballBuf = gl.createBuffer();
  const sphereVao = vaoOf(quad, sphereBuf, [4, 3, 3, 3, 4]), ballVao = vaoOf(quad, ballBuf, [4, 4]), lineVao = vaoOf(segQuad, null);
  const SPH_F = 17, MAX_SPH = 64, sphereData = new Float32Array(MAX_SPH * SPH_F), MAX_BALL = 1024, ballData = new Float32Array(MAX_BALL * 8);
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuf); gl.bufferData(gl.ARRAY_BUFFER, sphereData.byteLength, gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, ballBuf); gl.bufferData(gl.ARRAY_BUFFER, ballData.byteLength, gl.DYNAMIC_DRAW);

  // the curves: 8 texels a curve (lanes first, then the twelve trails); the arc table: u at uniform arc length, 1025 samples
  const MAX_CURVE = 256, curveData = new Float32Array(MAX_CURVE * 8 * 4);
  const curveTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, curveTex); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, 8, MAX_CURVE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  const arc = new Float32Array(1025); for (let i = 0; i <= 1024; i++) arc[i] = i === 1024 ? TAU : phaseAtDistance(i / 1024);
  const arcTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, arcTex); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R32F, 1025, 1); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 1025, 1, gl.RED, gl.FLOAT, arc);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const ripData = new Float32Array(32), ripCol = new Float32Array(24);   // the rings, eight at most

  // the palace's colours of the bundle's painters
  const C = Object.fromEntries(Object.entries(SKIN).map(([k, v]) => [k, Array.isArray(v) ? v.map(rgb) : rgb(v)]));   // SKIN, the front's palette (its export above)
  gl.useProgram(SPH.p);
  const U = SPH.u;
  gl.uniform3fv(U.uFN, ICO.FN); gl.uniform4fv(U.uG1, ICO.G1); gl.uniform4fv(U.uG2, ICO.G2); gl.uniform3fv(U.uEB, ICO.EB); gl.uniform3fv(U.uEC, ICO.EC);
  gl.uniform4iv(U.uFV, ICO.FV); gl.uniform4iv(U.uFE, ICO.FE); gl.uniform1f(U.uH, ICO.H); gl.uniform1f(U.uEdge, ICO.EDGE);
  gl.uniform3fv(U.uDarkA, C.darkA); gl.uniform3fv(U.uDarkB, C.darkB); gl.uniform3fv(U.uSeamDark, C.seamDark); gl.uniform3fv(U.uSeamPanel, C.seamPanel); gl.uniform3fv(U.uSeamChair, C.seamChair); gl.uniform3fv(U.uPoolA, C.poolA); gl.uniform3fv(U.uPoolB, C.poolB);
  gl.uniform3fv(U.uPaperA, C.paperA); gl.uniform3fv(U.uPaperB, C.paperB); gl.uniform3fv(U.uUnsworn, C.unsworn); gl.uniform3fv(U.uVacant, C.vacant); gl.uniform4f(U.uInk, ...C.ink, 0.5);
  // become(own, k): THE ONE OF ITS OWN, a device's world over her k of the way (0 hers, 1 its, the twelve home under her skin): own {hue, seed (seat-world.mjs seedOf of
  // its number), col (its dive's colour, [r, g, b]), was (MAKE IT YOURS: the hue it wore before his recolour, whose world stands beyond the front)}, or null: hers again
  // only: the worlds that go home (else all twelve): the Swarmbook front sends home only the chairs no society of its wall takes (dyson-society/app/assembly-dive.mjs)
  let into = null;
  const become = (own, k = 1, only = null) => { into = own ? { k, col: own.col, was: Number.isInteger(own.was) && k < 1 ? own.was : null, only: only ? new Set(only) : null } : null; gl.useProgram(SPH.p); gl.uniform3f(U.uOwn, own ? own.hue : -1, 2 * k, .55 * (1 - k)); gl.uniform1f(U.uWas, into && into.was !== null ? into.was : -1); if (own) gl.uniform1ui(U.uOwnSeed, own.seed >>> 0); };
  become(null);
  // THE FLOOR IS GIVEN (SPHERE_FS): setFloor(rows, n): the skin's n cells as the page names them, a Float32Array of 8 n (the n texels of row 0, then of row 1), or
  // none: the hash's rule again. setFaces(picture, cols, rows, px): the faces' tiles, a canvas of cols by rows tiles, px a tile's hexagon flat to flat
  const cellsTex = gl.createTexture(), facesTex = gl.createTexture(), nearest = () => { gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); };
  const setFloor = (rows = null, n = 1) => { gl.useProgram(SPH.p); gl.uniform1f(U.uFloor, rows ? 1 : 0); gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, cellsTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, rows ? n : 1, 2, 0, gl.RGBA, gl.FLOAT, rows || new Float32Array(8)); nearest(); gl.activeTexture(gl.TEXTURE0); };
  const setFaces = (picture = null, cols = 1, rows = 1, px = 1) => { gl.useProgram(SPH.p); gl.uniform3f(U.uAtlas, cols, rows, px); gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, facesTex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);         // a tile's clear corners never darken its rim
    if (picture) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, picture); else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.activeTexture(gl.TEXTURE0); };
  gl.uniform1i(U.uCells, 3); gl.uniform1i(U.uFaces, 4); setFloor(); setFaces();
  gl.useProgram(LINE.p); gl.uniform1i(LINE.u.uCurves, 1); gl.uniform1i(LINE.u.uArc, 2);

  let members = HOME_SEATS, mRoot = frequencyFor(HOME_SEATS), frac = 1, worldM = [];
  function setMembers(n) {
    members = Math.max(0, Math.round(n)); mRoot = frequencyFor(members); frac = mRoot > 1 ? Math.min(1, members / (cellsOf(mRoot) - 12)) : 0;
    const k = Math.max(1, members / HOME_SEATS);                     // the worlds' floors grow with the society
    worldM = WORLDS.map((nodes) => nodes.map((n) => frequencyFor(n.seats * k)));
  }
  setMembers(HOME_SEATS);

  let last = 0, at = 0, spin = 0, cam = null, pace = 1;
  const WORLD_K = 0.085, LOOP_RADIUS = 1.9, SEAT_R = 1.32, TRAIL_MS = 12000, LANE_SEG = 96, TRAIL_SEG = 90, NO_DIVE = [-1, TRAIL_MS / 1000, 0];
  // THE DIVES: each the world, when it began (orbit ms), its shell (R0), its end (s); every world's centre's distance last frame (R0), and how far it has gone home
  const dives = new Array(12).fill(null), lastView = new Array(12).fill(null), lastR = new Array(12).fill(2), home = new Array(12).fill(0), seats = new Float32Array(12); let diveId = 0, lakes = [];   // THE LAKE: lake(cols)
  const shellOf = (w) => LOOP_RADIUS * (1.94 + (w % 4) * .035) / 1.94;
  /** traverse(w?, {dir, col, t0}): world w dives now (from t0, ms on the frame's clock, a cause's own instant), else a free one that will stall where the glass sees its fall
   *  from the side (30 to 70 degrees off its axis: at the orbits' pace a world flies on a long way while it climbs, so its stall is foreseen); at most two at once. -> {id, w} or null
   *  HIS CLICK (Oct 12 2026 13:5x, "when i click i want any single unique unit1 to become of the color of the ripple happening and i want to see it dive where i
   *  clicked.. you get me? i am clicking and they dive"): dir = the clicked point (the skin's frame), col = that ripple's colour [r,g,b]. The free world nearest
   *  the point at the stall dives into it wearing that colour (aimK: it turns to the point over the hang, falls down its radial, comes back over the rise);
   *  a click is never refused for the two in flight: any free world goes, twelve clicks in the air at most. */
  function traverse(w = null, { dir = null, col = null, t0 = null } = {}) {
    if (seats.some((s) => s > 0) || (!dir && dives.filter((d) => d && (d.t0 === null || (last - d.t0) / 1000 < d.end)).length >= 2)) return null;   // none dives while the twelve are at their chairs
    const stallAt = at + pace * 1000 * DIVE.hang * (1 - .375), T = turnRows(.85 + spin + DIVE.hang * .12, -.13);   // the orbit time and the skin's turn at the stall
    const free = [...Array(12).keys()].filter((i) => !dives[i] && (!into || (into.only ? !into.only.has(i) : into.k < 1))), off = (i) => { const v = mv(T, loopPoint(i, stallAt)); return -v[2] / Math.hypot(v[0], v[1], v[2]); };
    if (w == null && dir) { let best = -2; for (const i of free) { const d = dot(unit(loopPoint(i, stallAt)), dir); if (d > best) { best = d; w = i; } } if (w == null) return null; }   // his click: the nearest free world
    else if (w == null) { const side = free.filter((i) => off(i) > .34 && off(i) < .87), front = free.filter((i) => off(i) > 0), pool = side.length ? side : front.length ? front : free;
      if (!pool.length) return null; w = pool[Math.floor(Math.random() * pool.length)]; } else if (dives[w]) return null;
    const shell = shellOf(w); dives[w] = { id: ++diveId, w, t0: t0 ?? (last > 0 ? last : null), shell, end: diveAt(0, shell).end, dir: dir ? unit(dir) : null, col: col ? [col[0], col[1], col[2]] : null };   // t0 in real ms: a dive keeps a gannet's time at any orbit pace;
    // asked before the first frame (the first dive at once, DIVE_FIRST), it begins with that frame: `last` is still 0 and the bird would be born as old as the page
    return { id: diveId, w };
  }
  /**
   * frame(now, {zoom, speed, play, area, at, turn, r0}): one frame. speed: the orbits' pace (1 the bundle's 84 s a loop). area: the box she stands in, canvas px (else the home's). at: the orbits' time (ms),
   * turn: [yaw, pitch] of her skin and r0: her radius, as a page that draws her with its own picture holds them (the Swarmbook front's hero, dyson-society/app/assembly-dive.mjs), else her own;
   * veil: twelve numbers, how far each world has gone into its point (0 whole, 1 gone: under the page's words, as its own worlds go), its trail drawn still; trails: how
   * strongly the twelve trails are drawn (1 whole, 0 none). play (null: the traditional as it is):
   * {ripples: [{dir (where the touch fell, the skin's frame), age (s), col [r,g,b]}]}, the first eight drawn. scene (THE PANTHEON IS HERS): {fuel, seat}, the flask's amber in her and her twelve at their chairs, each 0 to 1.
   * Returns what the skin shows, and crossings: [{id, w, kind ('in' as a diver's centre passes under the skin, 'out' as it passes back out), dir (the skin's frame)}].
   */
  function frame(now, { zoom = 1, speed = 1, play = null, area: given = null, at: held = null, turn = null, r0 = null, veil = null, trails = 1, scene = null } = {}) {
    const dt = last ? Math.min(64, Math.max(0, now - last)) : 16; last = now; at = Number.isFinite(held) ? held : at + dt * speed; pace = speed; spin = (spin + dt * .00012) % TAU;
    for (const d of dives) if (d && d.t0 === null) d.t0 = now;   // a dive asked before any frame begins now
    const W = canvas.width, Hh = canvas.height, portrait = W < 760 * dpr && Hh > W * .85;
    const area = given || (portrait ? { x: 0, y: 0, w: W, h: Hh * .55 } : { x: 0, y: 0, w: W * .58, h: Hh });
    const cx = area.x + area.w / 2, cy = area.y + area.h * .48, lens = area.h * 1.35 * zoom, eye = 9;
    const R0 = r0 > 0 ? r0 : Math.min(1.5, 2 * area.w / Math.max(1, area.h)) * .82, zr = R0 * 2.6;
    const TURN = turn ? turnRows(turn[0], turn[1]) : turnRows(.85 + spin, -.13);
    // spheres: the skin, then every chamber of every world
    const sph = [];
    const pushSphere = (c, r, Rrows, m, f, style, seed) => sph.push({ z: c[2], v: [c[0], c[1], c[2], r, Rrows[0], Rrows[3], Rrows[6], Rrows[1], Rrows[4], Rrows[7], Rrows[2], Rrows[5], Rrows[8], m, f, style, seed] });
    pushSphere([0, 0, 0], R0, TURN, mRoot, frac, 0, 0);
    let nb = 0, nc = 0;
    const curve = (rows, S, ink, Cc, sc, r4, col, alpha, r6 = 0, dv = NO_DIVE, aim = null) => { const o = nc++ * 32;   // aim: an aimed dive's point (r7.xyz) and flag (r7.w) for the trail
      curveData.set([rows[0], rows[1], rows[2], ink < 0 ? 1 : 0, rows[3], rows[4], rows[5], S, rows[6], rows[7], rows[8], Math.abs(ink), Cc[0], Cc[1], Cc[2], sc, ...r4, ...col, alpha, r6, dv[0], dv[1], dv[2], ...(aim ? [aim[0], aim[1], aim[2], 1] : [0, 0, 0, 0])], o); };
    const crossings = [];
    const pxOf = (c, r) => r * lens / (c[2] + eye);
    for (let w = 0; w < 12; w++) {
      const dv = dives[w], tD = dv ? (now - dv.t0) / 1000 : 0, D = dv ? diveAt(tD, dv.shell) : null, here = D ? at - D.lag * speed * 1000 : at;   // a diver: where it is on its loop
      // HIS CLICK: an aimed dive leaves its loop for the clicked point (aimK, slerp) and wears the ripple's colour (tint) on its loops, balls and trail
      const lp = loopPoint(w, here), aim = D && dv.dir ? slerp(unit(lp), dv.dir, aimK(tD, dv.shell)) : null, on = aim ? mul(aim, R0 * D.r) : mul(lp, R0 * LOOP_RADIUS * (D ? D.r / dv.shell : 1));
      const sk = (seats[w] = scene ? s3((scene.seat - w / 24) * 2.2) : 0), up = mv(TURN, sk > 0 ? mul(slerp(unit(on), ICO.V[w], sk), Math.hypot(...on) * (1 - sk) + R0 * SEAT_R * sk) : on);   // THE PANTHEON IS HERS: world w comes home to its chair w, round her, never through her
      // THE ONE OF ITS OWN: as its world comes over her, the twelve go home into her in its colour, the nearest the glass's axis first, folding their wings as they fall;
      // home, a world is under her skin and drawn no more. MAKE IT YOURS: at his recolour the twelve are home already; only the diver rises out of her first, in its new colour
      const law = into && (!into.only || into.only.has(w)) ? s3((into.k - Math.acos(-up[2] / Math.hypot(...up)) / TAU) / .5) : 0, h = (home[w] = into && into.was !== null ? (dv ? Math.max(law, 1 - s3(tD / .6)) : 1) : law), fold = (D ? D.fold : 1) * (1 - .6 * h);
      const tint = h > 0 ? into.col : dv && dv.col ? dv.col : null, centre = mul(up, 1 - .6 * h), k = R0 * WORLD_K * (veil ? 1 - Math.min(1, Math.max(0, veil[w] || 0)) : 1);   // veil: gone into its point under a page's words
      lastView[w] = centre;
      if (h >= 1) continue;
      const Wc = turnRows(w * .0175 + at * .000036 + w * 2.399963, .32);   // the world's own camera, turning as its tile turns
      const off = new Map();
      if (k > 0) WORLDS[w].forEach((node, j) => {
        let o = [0, 0, 0], sc = 1;
        if (node.parent) {                                             // a child flies its chair's loop round its parent, at half its size
          const p = off.get(node.parent), q = discussionPoint(node.seat % 4, phaseAtDistance(at / ORBIT_PERIOD + node.seat / 12 + node.parent.seed * .18), at / 1000 + node.parent.depth * .7);
          sc = p.sc * .5; o = [p.o[0] + q[0] * p.sc * fold, p.o[1] + q[1] * p.sc * fold, p.o[2] + q[2] * p.sc * fold];
        }
        off.set(node, { o, sc });
        const c = mv(Wc, o).map((v, i) => centre[i] + v * k), r = sc * k, spinN = node.depth ? (node.name.length * 1.7 + node.seat) * .9 + at * .000065 : 0;
        pushSphere(c, r, node.depth ? mm(Wc, turnRows(spinN, spinN * .6)) : Wc, worldM[w][j], Math.min(1, pxOf(c, r) / 88), 1, 0);
        const time = at / 1000 + node.depth * .7, ph = (seat) => phaseAtDistance(at / ORBIT_PERIOD + seat / 12 + node.seed * .18);
        if (pxOf(c, r) >= 8 && nc + 4 <= MAX_CURVE - 12) for (let lane = 0; lane < 4; lane++)
          curve(mm(Wc, tiltAzRows(TILTS[lane], lane * Math.PI * .43 + time * .004)), (1.94 + lane * .035) * r * fold, (node.depth ? .72 : 1) * Math.min(1, pxOf(c, r) / 88 * 1.6), c, r,
            [ph(lane), ph(lane + 4), ph(lane + 8), 1], tint || lakes[w] || C.loops[lane], 1);
        for (let seat = 0; seat < 12 && nb < MAX_BALL; seat++) if (!node.bound.has(seat)) {
          const p = mv(Wc, discussionPoint(seat % 4, ph(seat), time)).map((v, i) => c[i] + v * r * fold), col = tint || lakes[w] || C.loops[seat % 4];
          ballData.set([p[0], p[1], p[2], r * .11, col[0], col[1], col[2], 1], 8 * nb++);
        }
      });
      const r = Math.hypot(...centre) / R0, id = dv ? dv.id : 0;       // its body passes the skin (a dive, or its fall home): the splash going in, the burst coming out
      if (lastR[w] > 1 && r <= 1) crossings.push({ id, w, kind: 'in', dir: aim || unit(lp), col: tint || lakes[w] });     // an aimed dive splashes at the clicked point, in its colour
      else if (lastR[w] < 1 && r >= 1) crossings.push({ id, w, kind: 'out', dir: aim || unit(lp), col: tint || lakes[w] });
      lastR[w] = r;
      if (dv && (now - dv.t0) / 1000 > dv.end + TRAIL_MS / 1000 / Math.max(speed, .05)) dives[w] = null;   // done once its trail has climbed out too
    }
    const lanes = nc;
    for (let w = 0; w < 12; w++) { const lane = w % 4, s = 1 - .6 * home[w];   // a trail goes home with its world, fading
      curve(TURN, s * R0 * LOOP_RADIUS * (1.94 + lane * .035) / 1.94, -1, [0, 0, 0], s * R0, [TILTS[lane], lane * Math.PI * .43 + at * .000004, TRAIL_MS * .000004, at / ORBIT_PERIOD + w / 12],
        (home[w] > 0 && into.col) || (dives[w] && dives[w].col) || lakes[w] || C.loops[lane], (1 - home[w]) * trails * (1 - seats[w]), TRAIL_MS / ORBIT_PERIOD,
        dives[w] ? [(now - dives[w].t0) / 1000, TRAIL_MS / 1000 / Math.max(speed, .05), 0] : NO_DIVE, dives[w] ? dives[w].dir : null); }
    sph.sort((a, b) => b.z - a.z);
    sph.forEach((s, i) => sphereData.set(s.v, i * SPH_F));
    // draw
    gl.viewport(0, 0, W, Hh); gl.clearColor(0, 0, 0, 0); gl.clearDepth(1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const common = (u) => { if (u.uCam) gl.uniform3f(u.uCam, cx, cy, lens); if (u.uEye) gl.uniform1f(u.uEye, eye); if (u.uView) gl.uniform2f(u.uView, W, Hh);
      if (u.uDepth) gl.uniform2f(u.uDepth, -zr, 1 / (2 * zr)); if (u.uDpr) gl.uniform1f(u.uDpr, dpr); };
    gl.useProgram(SPH.p); common(SPH.u); gl.uniform1fv(SPH.u.uSeats, seats); gl.uniform1f(SPH.u.uFuel, scene && scene.fuel > 0 ? -1 + 1.72 * Math.min(1, scene.fuel) : -2);
    const rips = ((play && play.ripples) || []).slice(0, 8);
    rips.forEach((r, i) => { ripData.set([r.dir[0], r.dir[1], r.dir[2], r.age], 4 * i); ripCol.set(r.col, 3 * i); });
    gl.uniform1i(SPH.u.uRipN, rips.length); if (rips.length) { gl.uniform4fv(SPH.u.uRip, ripData); gl.uniform3fv(SPH.u.uRipCol, ripCol); }
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, sphereData, 0, sph.length * SPH_F);
    gl.depthMask(true); gl.bindVertexArray(sphereVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, sph.length);
    gl.useProgram(BALL.p); common(BALL.u);
    gl.bindBuffer(gl.ARRAY_BUFFER, ballBuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, ballData, 0, nb * 8);
    gl.bindVertexArray(ballVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, nb);
    gl.useProgram(LINE.p); common(LINE.u); gl.depthMask(false);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, curveTex); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 8, nc, gl.RGBA, gl.FLOAT, curveData, 0);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, arcTex); gl.activeTexture(gl.TEXTURE0);
    gl.bindVertexArray(lineVao);
    if (lanes) { gl.uniform1i(LINE.u.uSeg, LANE_SEG); gl.uniform1i(LINE.u.uRow0, 0); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, lanes * LANE_SEG); }
    gl.uniform1i(LINE.u.uSeg, TRAIL_SEG); gl.uniform1i(LINE.u.uRow0, lanes); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 12 * TRAIL_SEG);
    gl.depthMask(true); gl.bindVertexArray(null);
    // what the skin shows: a cell at the front, in px, at this zoom
    cam = { cx, cy, lens, eye, R0, TURN };
    const frontPx = R0 * lens / (eye - R0), cellPx = ICO.EDGE / (mRoot * ICO.H) * frontPx * 0.92;
    return { members, m: mRoot, cells: cellsOf(mRoot), cellPx, spheres: sph.length, balls: nb, lanes, R0px: frontPx, crossings, cx, cy };
  }
  /** pick(x, y) in canvas px -> {dir (the skin's frame), id (the member's cell), m} or null off the skin: O(1), the shader's own lookup (cellOf) */
  function pick(x, y) {
    if (!cam) return null;
    const rd = unit([(x - cam.cx) / cam.lens, (cam.cy - y) / cam.lens, 1]), ro = [0, 0, -cam.eye], b = dot(ro, rd), h = b * b - (dot(ro, ro) - cam.R0 * cam.R0);
    if (h < 0) return null;
    const t = -b - Math.sqrt(h), n = [rd[0] * t / cam.R0, (rd[1] * t) / cam.R0, (ro[2] + rd[2] * t) / cam.R0], T = cam.TURN;
    const d = unit([T[0] * n[0] + T[3] * n[1] + T[6] * n[2], T[1] * n[0] + T[4] * n[1] + T[7] * n[2], T[2] * n[0] + T[5] * n[1] + T[8] * n[2]]);
    return { dir: d, id: cellOf(d, mRoot).id, m: mRoot };
  }
  /** the skin's direction that faces the viewer `ms` from now: her turn goes on, so a dive aimed there meets the glass's axis when it lands */
  const front = (ms = 0) => { const T = turnRows(.85 + spin + ms * .00012, -.13); return unit([-T[6], -T[7], -T[8]]); };
  return { gl, renderer, setMembers, setFloor, setFaces, frame, pick, front, traverse, become, lake: (cols) => { lakes = Array.isArray(cols) ? cols : []; }, info: () => ({ members, m: mRoot, cells: cellsOf(mRoot), frac, seats: Array.from(seats), home: home.filter((h) => h >= 1).length,
    dives: dives.filter(Boolean).map((d) => { const v = lastView[d.w]; const D = diveAt((last - d.t0) / 1000, d.shell); return { id: d.id, w: d.w, t0: d.t0, shell: d.shell, dir: d.dir, col: d.col, r: D.r, lag: D.lag, fold: D.fold, px: v && cam ? [cam.cx + v[0] * cam.lens / (v[2] + cam.eye), cam.cy - v[1] * cam.lens / (v[2] + cam.eye)] : null }; }) }) };
}
