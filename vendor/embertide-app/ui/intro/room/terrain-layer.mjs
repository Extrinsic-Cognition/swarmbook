// terrain-layer.mjs - THE TERRAIN SET (Oct 11 2026, lane TERRAIN of the D&D table). His words: Sept 14 19:49, over the r/DungeonsAndDragons picture
// "Engineered a modular magnetic terrain set": "do you get the 2 fucking tiers i want to be able to switch in and out of?"; Sept 16 11:32 "i need high
// quality dnd dude"; Sept 20 "gold wires above ivory marble"; Oct 4 06:25 "a pokemon secret base level-of-detail reality skinning of my room", procedural,
// never a scripted picture; Oct 11 06:01 "you are forgiving the hackathon submission is around dungeins and dragons" (his typing).
// WHAT STANDS HERE. His scanned room as a modular magnetic terrain set, built from his facts and nothing else: the room's HELD walls (registration
// scored: what the twin hands over in twin.model(), heldOf()), the scored doors and windows on them, the scored things (none in an old scan's shell), and
// the floor ring they close. The floor is a terrain board: ivory marble tiles on a grid fitted to the room's own extent along its longest wall (TILE ~
// 0.45 m, the half-metre squares of his Sept 16 table), each bevelled, its tone, veins and wear a hash of its index, thin bronze grooves between them,
// a kerb round the ring and the board's thickness under it. Each wall is a terrain piece: marble ashlar courses, a gold core showing through every seam
// (his gold wires above ivory marble), uneven chipped tops, a corner post with a gold cap where two walls meet, the door an opening with a gold frame
// piece and threshold, the window an opening with a sill and lintel. The measured line is the piece's INNER face: the body stands behind it, TW thick
// (a toy's chunk, never a fact moved). A wall the eye stands outside of is cut down to a low broken course (the diorama's cutaway, as the stage did).
// No stair, pillar, prop or furniture his scan does not hold is ever drawn; a guess is never a piece.
// THE MAGNET (the rhythm, his Oct 10 22:50 law). Every motion here is a pure function of the twin's clock (the paint detail's clock: now_ms, epoch_ms,
// beat_ms) and the growth's notes (twin.notes(): wall i sounds on downbeat D + i): the board falls over beat D and clicks on D + 1, the tile grid engraves
// itself outward from the Lyssajudron's home over the next beat (each tile lights gold as it locks); wall i falls over beat D + i + 1 and clicks on
// D + i + 2, dips into the magnet and settles in one beat, a gold flash runs along its seams and decays over two; its magnet ghost (the footprint, gold)
// brightens as it falls. A corner post clicks half a beat after the later of its two walls. A thing (scanned rooms only) falls half a beat and clicks on
// its note's off-beat. A window that returns after the notes' time finds every piece at rest (A12). No wall clock, no random (a hash of an index), no
// display-refresh request of its own: the twin samples, this layer moves its pieces in 'paint' and holds the chain ('terrain') only while a piece moves.
// THE CONTRACT WITH twin (TERRAIN's two additions, twin.mjs): twin.model() -> {room, layout, shell} (the held room the stage was drawing) and
// twin.terrain(on) (the stage's floor, walls and things, the twin's wire and rising boxes step aside for the terrain set). Without them the layer reads
// nothing and draws nothing. The rest is the bus every layer uses: twin.THREE, twin.stage.addLayer/removeLayer/touch/setWorldVisible, twin.on('paint' |
// 'scan' | 'wall' | 'thing'), twin.notes(), twin.home(), twin.animate(on, 'terrain').
// COST. Built once per compile (a few ms: ~1k chamfered blocks for a four-wall room, merged into one mesh per wall per cut); per sample a few matrix
// writes and one uniform while a piece moves, a dot product per wall for the cutaway at rest. Draws: the board 3, a wall 2 (marble + gold), a corner 2,
// a thing 2, a glow 1 only while it glows; the stage's own floor, walls, trim and wire (~12 draws) step aside. The shadow map is re-rendered once per
// click (the stage renders it only on a change of its world: one world toggle), never per sample. Hidden: nothing samples, nothing computes.

import { pieceLevel, solidOf } from './reveal-plan.mjs';

export const TILE = 0.45;            // the nominal tile (m): fitted per room so a whole number of tiles spans it
export const TW = 0.3;               // a wall piece's thickness behind its measured inner face
export const COURSE = 0.52;          // a full wall's nominal course height (FIXER, Oct 11: chunky stone; each course its own height by a hash, 0.72 to 1.28 of it)
export const BLOCK = 1.05;           // a block's nominal length (each its own, 0.6 to 1.4 of it, by a hash)
export const LOW = 0.62;             // a cut-away wall's nominal height (the eye stands outside it)
export const SEAM = 0.0075;          // half the gap between two blocks: a dark recessed joint shows in it (FIXER: never gold in every joint)
export const CHAMFER = 0.032;        // every block's bevel
export const RELIEF = 0.014;         // a block may sit up to this far behind the measured face, never proud of it (the stone's relief, a hash per block)
export const JOINT = 0.022;          // how far a joint is recessed behind both faces
export const BOARD = 0.16;           // the board's thickness under the floor
export const DROP = Object.freeze({ board: 0.45, wall: 0.9, corner: 0.6, thing: 0.5 });   // the height a piece falls from (m)
export const FALL = Object.freeze({ board: 1, wall: 1, corner: 0.5, thing: 0.5 });        // its fall, in beats, ending on its click
export const GOLD_GLOW = 0.1, GOLD_FLARE = 1.6, GOLD_DOWNBEAT = 0.32;   // the gold's own warmth, how far a piece's joints flare on its click, and the seams' breath on each downbeat (INTEGRATOR: the magnets hear the bar)
export const JOINT_BREATH = 0.38, JOINT_FLARE = 2.2;                      // FIXER: the dark joints are lit from inside only on the downbeat's breath and a piece's click: the magnet's gold sweeps them, it does not paint them
/** downbeatGlow(clock): the seams' breath, 1 on the downbeat, gone by the end of its beat: a pure function of the bar's phase. */
export const downbeatGlow = (c) => { const u = num(c?.bar_phase) && num(c?.beats_per_bar) ? clamp(c.bar_phase * c.beats_per_bar, 0, 1) : 1; return (1 - u) * (1 - u); };
export const PALETTE = Object.freeze({ ivory: 0xf4e9d3, floor: 0xded1b6, kerb: 0xd6c9ad, kerbSide: 0xb7a88b, groove: 0x4a3a27, gold: 0xd2a64b, glow: 0xffb23e, joint: 0x3a2e22 });
// THE REVEAL (reveal-plan.mjs, his Oct 11 09:4x "slowly i see the room 'being gaussian splatted into existence'"): when the twin hands over a plan
// (twin.reveal()), no piece falls: each stands where it is and its stone dissolves in by its certainty (solidOf(pieceLevel)), a hash of its own
// soft noise against that level (patches of 28 and 10 cm), its edge about to come lit in ember; it clicks gold on its lock beat and casts its shadow from then. One uniform
// array for every piece (uLv, by the piece's index in its geometry's aPiece: the board 0, walls 1..16, corners 17..32, things 33..62, the rest 63),
// one switch (uRv: off once all stands, so a room at rest pays no dissolve).
export const RV = Object.freeze({ board: 0, wall: 1, corner: 17, thing: 33, spare: 63, n: 64 });
const RV_VERT_PARS = 'attribute float aPiece;\nuniform float uLv[64];\nvarying float vRvLv;\nvarying vec3 vRvP;';
const RV_VERT = 'vRvLv = uLv[int(clamp(aPiece, 0.0, 63.0) + 0.5)];\nvRvP = position;';
const RV_FRAG_PARS = `uniform float uRv;
varying float vRvLv;
varying vec3 vRvP;
float rvH(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float rvN(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(rvH(i), rvH(i + vec3(1.0, 0.0, 0.0)), f.x), mix(rvH(i + vec3(0.0, 1.0, 0.0)), rvH(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(rvH(i + vec3(0.0, 0.0, 1.0)), rvH(i + vec3(1.0, 0.0, 1.0)), f.x), mix(rvH(i + vec3(0.0, 1.0, 1.0)), rvH(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z); }`;
const RV_FRAG_CUT = 'float rvV = 0.0;\nif (uRv > 0.5) { rvV = clamp((0.62 * rvN(vRvP * 3.6) + 0.38 * rvN(vRvP * 10.5) - 0.22) / 0.56, 0.0, 1.0); if (rvV >= vRvLv) discard; }';   // a uniform branch: once all stands (uRv 0) no fragment pays the noise   // the stone condenses in soft patches (a 28 cm and a 10 cm noise), never a pixel static
const RV_FRAG_EMBER = 'if (uRv > 0.5 && vRvLv < 0.999) totalEmissiveRadiance += vec3(1.0, 0.42, 0.08) * smoothstep(0.055, 0.0, vRvLv - rvV) * 1.5;';   // the edge about to come burns like an ember

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };

// ---- the hash: every per-piece variation is a function of its index, never a draw ----
const mix32 = (h) => { h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15; h = Math.imul(h, 0x846ca68b); h ^= h >>> 16; return h >>> 0; };
/** hashOf(...keys): a number in [0, 1) from the keys (strings or numbers), the same on every glass. */
export function hashOf(...keys) {
  let h = 0x811c9dc5;
  for (const k of keys) { const s = String(k); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } h = mix32(h ^ 0x2c); }
  return h / 4294967296;
}

// ---- the board ----
/** tileFrameOf(room): the tile grid in the room's own frame: U along its longest held wall, V into the room, the origin at the ring's corner in that
 *  frame, the tile size fitted so a whole number of tiles spans the ring each way (each in [0.25, 0.5] m for any room over half a metre). */
export function tileFrameOf(R) {
  const w = [...R.walls].sort((a, b) => b.len - a.len)[0];
  const U = [w.u[0], w.u[2]], V = [w.n[0], w.n[2]];
  const pu = R.ring.map(([x, z]) => x * U[0] + z * U[1]), pv = R.ring.map(([x, z]) => x * V[0] + z * V[1]);
  const u0 = Math.min(...pu), u1 = Math.max(...pu), v0 = Math.min(...pv), v1 = Math.max(...pv);
  const fit = (L) => { const n = Math.max(1, Math.round(L / TILE)); return { n, t: L / n }; };
  const A = fit(u1 - u0), B = fit(v1 - v0);
  return { O: [u0 * U[0] + v0 * V[0], u0 * U[1] + v0 * V[1]], U, V, T: [A.t, B.t], n: [A.n, B.n], extent: [u1 - u0, v1 - v0] };
}
const areaOf = (ring) => { let a = 0; for (let i = 0; i < ring.length; i++) { const p = ring[i], q = ring[(i + 1) % ring.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
/** outlineOf(ring, d): the ring pushed outward by d (each edge moved along its outward normal, consecutive edges met at their mitre; a mitre is
 *  capped at 3 d so a sharp corner never spikes). */
export function outlineOf(ring, d) {
  const n = ring.length, ccw = areaOf(ring) > 0, out = [];
  const lines = ring.map((p, i) => { const q = ring[(i + 1) % n], dx = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dx, dz) || 1, nx = (ccw ? dz : -dz) / L, nz = (ccw ? -dx : dx) / L;
    return { p: [p[0] + nx * d, p[1] + nz * d], dir: [dx / L, dz / L], nrm: [nx, nz] }; });
  for (let i = 0; i < n; i++) {
    const A = lines[(i - 1 + n) % n], B = lines[i], den = A.dir[0] * B.dir[1] - A.dir[1] * B.dir[0], corner = ring[i];
    let p;
    if (Math.abs(den) < 1e-6) p = [corner[0] + B.nrm[0] * d, corner[1] + B.nrm[1] * d];
    else { const t = ((B.p[0] - A.p[0]) * B.dir[1] - (B.p[1] - A.p[1]) * B.dir[0]) / den; p = [A.p[0] + A.dir[0] * t, A.p[1] + A.dir[1] * t]; }
    const k = Math.hypot(p[0] - corner[0], p[1] - corner[1]); if (k > 3 * d) p = [corner[0] + (p[0] - corner[0]) * 3 * d / k, corner[1] + (p[1] - corner[1]) * 3 * d / k];
    out.push(p);
  }
  return out;
}

// ---- the walls ----
/** openingsOn(wall, layout): the held openings cut in this wall, in its own frame: s along it from a, y above its floor. */
export function openingsOn(w, L) {
  return (L?.openings || []).filter((o) => o.wall === w.id).map((o) => {
    const s = (o.at[0] - w.a[0]) * w.u[0] + (o.at[2] - w.a[2]) * w.u[2], y = o.at[1] - w.floor;
    return { id: o.id, role: o.role, s0: clamp(s - o.width / 2, 0, w.len), s1: clamp(s + o.width / 2, 0, w.len), y0: clamp(y - o.height / 2, 0, w.height), y1: clamp(y + o.height / 2, 0, w.height) };
  }).filter((o) => o.s1 - o.s0 > 0.05 && o.y1 - o.y0 > 0.05);
}
/** coursesOf(wall, H, low): the courses [y0, y1] up the piece: a full wall's each its own height by a hash of its index (the last takes the rest; a sliver
 *  joins the one under it), a cut-away wall's two even courses to about LOW. */
export function coursesOf(w, H, low = false) {
  if (low) { const n = Math.max(1, Math.round(H / (LOW / 2))), ch = H / n; return Array.from({ length: n }, (_, c) => [c * ch, (c + 1) * ch]); }
  const out = []; let y = 0;
  for (let c = 0; y < H - 1e-6 && c < 64; c++) { let h = COURSE * (0.72 + 0.56 * hashOf(w.id, 'course', c)); if (H - (y + h) < COURSE * 0.45) h = H - y; out.push([y, Math.min(H, y + h)]); y += h; }
  return out;
}
/** breachOf(wall, H, keep): a long full wall's broken stretch (the reference's ruined top): [s0, s1] along it where the top course is gone and the one under
 *  it broken, a hash of the wall; never over a door or a hung glass (`keep`), never on a wall under 3 m; null when none. */
export function breachOf(w, keep = []) {
  if (w.len < 3) return null;
  const L = Math.min(BLOCK * (1.4 + 0.8 * hashOf(w.id, 'breach', 'len')), 0.35 * w.len), s0 = 0.5 + (w.len - 1 - L) * hashOf(w.id, 'breach', 'at'), s1 = s0 + L;
  return keep.some(([a, b]) => s1 > a && s0 < b) ? null : [s0, s1];
}
/** wallPlan(wall, openings, {low, keep}): the piece as boxes in the wall's frame (s along it, y up from its floor, t outward from its measured inner face):
 *  `blocks` (marble, each with its tone, SEAM apart, its inner face at most RELIEF behind the measured line, never proud of it), `joints` (dark strips IN
 *  the gaps between them, JOINT behind both faces), `gold` (the door's frame and threshold, the window's sill and lintel, the coping on the top's whole
 *  blocks). FIXER (Oct 11, the judge: "a white subway-tile bathroom"): chunky stone, every course and block its own size by a hash; the top broken (a
 *  block cut to a stump or chipped by a hash, a breached stretch on a long wall) except over a door and a hung glass (`keep`: [s0, s1] along it, the doors
 *  are kept by themselves). Low (cut away): two courses to about LOW, broken. A block never stands in an opening. */
export function wallPlan(w, openings = [], { low = false, keep = [] } = {}) {
  const H = low ? Math.min(LOW, w.height) : w.height, courses = coursesOf(w, H, low), nC = courses.length;
  const kept = [...keep, ...openings.filter((o) => o.role === 'door').map((o) => [o.s0 - 0.3, o.s1 + 0.3])], keepAt = (a, b) => kept.some(([k0, k1]) => b > k0 && a < k1);
  const breach = low ? null : breachOf(w, kept), inBreach = (a, b) => !!breach && b > breach[0] && a < breach[1];
  const blocks = [], joints = [], gold = [];
  courses.forEach(([cy0, cy1], c) => {
    const top = c === nC - 1, under = c === nC - 2;
    const here = openings.filter((o) => o.y0 < cy1 - 1e-6 && o.y1 > cy0 + 1e-6);
    const xs = [...new Set([0, w.len, ...here.flatMap((o) => [o.s0, o.s1])])].sort((a, b) => a - b);
    const off = hashOf(w.id, 'bond', c) * BLOCK;   // each course's joints fall where its own hash puts them (no running bond: stone, not brick)
    const cuts = []; for (let x = -off, k = 0; x < w.len + BLOCK; k++) { cuts.push(x); x += BLOCK * (0.6 + 0.8 * hashOf(w.id, c, k)); }
    for (let i = 0; i < xs.length - 1; i++) {
      const p = xs[i], q = xs[i + 1]; if (q - p < 0.02) continue;
      const over = here.filter((o) => o.s0 <= p + 1e-6 && o.s1 >= q - 1e-6);
      let ys = [[cy0, cy1]];   // the course's free height in this stretch: the openings over it taken out
      for (const o of over) ys = ys.flatMap(([a, b]) => [[a, Math.min(b, o.y0)], [Math.max(a, o.y1), b]]).filter(([a, b]) => b - a > 0.035);
      for (const [ya, yb] of ys) {
        const inner = cuts.filter((x) => x > p + 0.18 && x < q - 0.18), ends = [p, ...inner, q], row = [];
        for (let j = 0; j < ends.length - 1; j++) {
          const s0 = ends[j], s1 = ends[j + 1], key = `${c}:${Math.round(s0 * 1000)}`, h1 = hashOf(w.id, key, 'tone'), h2 = hashOf(w.id, key, 'chip'), h3 = hashOf(w.id, key, 'deep');
          const atTop = top && yb >= cy1 - 1e-6, guarded = keepAt(s0, s1);
          let y1 = yb;
          if (low && atTop) y1 = yb * (0.62 + 0.38 * h2);   // a cut wall broken
          else if (atTop && !guarded && inBreach(s0, s1)) { row.push(null); continue; }   // the breach: the top course gone
          else if (under && !guarded && inBreach(s0, s1) && yb >= cy1 - 1e-6) y1 = ya + (yb - ya) * (0.35 + 0.45 * h3);   // and the course under it broken
          else if (atTop && !guarded) y1 = h2 < 0.34 ? ya + (yb - ya) * (0.22 + 0.4 * h3) : h2 < 0.6 ? yb - (0.05 + 0.1 * h3) : yb;   // the top: a stump, a chip, or whole
          if (y1 - ya < 0.04) { row.push(null); continue; }
          const b = { s0: s0 + SEAM, s1: s1 - SEAM, y0: ya + SEAM, y1: y1 - (y1 < yb - 1e-6 || top ? 0 : SEAM), t0: RELIEF * hashOf(w.id, key, 'relief'), t1: TW, tone: h1, worn: hashOf(w.id, key, 'worn') < 0.12, whole: atTop && y1 >= yb - 1e-6 && !low };
          blocks.push(b); row.push(b);
          if (b.whole && b.s1 - b.s0 > 0.12) gold.push({ s0: b.s0 + 0.045, s1: b.s1 - 0.045, y0: b.y1 - 0.002, y1: b.y1 + 0.011, t0: TW / 2 - 0.016, t1: TW / 2 + 0.016 });   // the coping: a gold wire along the top's whole blocks (his gold wires above ivory marble)
        }
        for (const b of row) if (b) joints.push({ s0: b.s0 - SEAM, s1: b.s1 + SEAM, y0: ya - SEAM, y1: ya + SEAM, t0: JOINT, t1: TW - JOINT });   // the bed joint under each block that stands, never laid bare across a breach (the judge: a dark trench)   // the bed joint under the course, dark, recessed
        for (let j = 0; j < row.length - 1; j++) { const A = row[j], B = row[j + 1]; if (A && B) joints.push({ s0: A.s1, s1: B.s0, y0: ya + SEAM, y1: Math.min(A.y1, B.y1) - 0.012, t0: JOINT, t1: TW - JOINT }); }   // the head joints between two blocks
      }
    }
  });
  for (const o of openings) {   // the frame pieces, gold, proud of both faces; clipped to the piece's own height
    const P = 0.035, J = 0.07;
    if (o.role === 'door') {
      const jt = Math.min(o.y1, H); if (jt > 0.05) { gold.push({ s0: o.s0 - J, s1: o.s0 + 0.02, y0: 0, y1: jt, t0: -P, t1: TW + P }, { s0: o.s1 - 0.02, s1: o.s1 + J, y0: 0, y1: jt, t0: -P, t1: TW + P }); }
      if (o.y1 + 0.1 <= H + 1e-6) gold.push({ s0: o.s0 - J, s1: o.s1 + J, y0: o.y1, y1: o.y1 + 0.1, t0: -P, t1: TW + P });
      gold.push({ s0: o.s0, s1: o.s1, y0: 0, y1: 0.014, t0: -0.02, t1: TW + 0.02 });   // the threshold
    } else {
      if (o.y0 > 0.06 && o.y0 <= H + 1e-6) gold.push({ s0: o.s0 - 0.06, s1: o.s1 + 0.06, y0: o.y0 - 0.055, y1: o.y0, t0: -0.045, t1: TW + 0.045 });   // the sill
      if (o.y1 + 0.08 <= H + 1e-6) gold.push({ s0: o.s0 - 0.05, s1: o.s1 + 0.05, y0: o.y1, y1: o.y1 + 0.08, t0: -P, t1: TW + P });             // the lintel
    }
  }
  return { blocks, joints, gold, height: H, breach };
}
/** jointsOf(room): where two held walls meet (their ends within 30 cm): the corner post's centre (outside both inner faces), its two walls. */
export function jointsOf(R) {
  const out = [], near = (p, q) => Math.hypot(p[0] - q[0], p[2] - q[2]) < 0.3;
  R.walls.forEach((A, i) => R.walls.forEach((B, j) => {
    if (j <= i) return;
    for (const pa of [A.a, A.b]) for (const pb of [B.a, B.b]) if (near(pa, pb)) {
      const p = [(pa[0] + pb[0]) / 2, (pa[2] + pb[2]) / 2], c = [p[0] - (A.n[0] + B.n[0]) * TW / 2, p[1] - (A.n[2] + B.n[2]) * TW / 2];
      out.push({ id: `${A.id}+${B.id}`, walls: [A.id, B.id], at: c, floor: Math.min(A.floor, B.floor), height: Math.max(A.height, B.height) });
    }
  }));
  return out;
}

// ---- the held things, sculpted by kind (FIXER, Oct 11: "the held sofa is a labelled white box, a floor plan rather than a terrain piece") ----
/** kindOf(name): the catalogue's piece for a held thing's name: 'sofa' | 'bed' | 'chair' | 'table' | 'shelf', else 'block' (the marble block of before). */
export const kindOf = (name) => { const k = String(name || '').toLowerCase(); return /sofa|couch|settee/.test(k) ? 'sofa' : /\bbed/.test(k) ? 'bed' : /chair|stool/.test(k) ? 'chair' : /table|desk/.test(k) ? 'table' : /shel|book|cabinet|wardrobe|dresser|cupboard/.test(k) ? 'shelf' : 'block'; };
const segDist = (p, a, b) => { const ex = b[0] - a[0], ez = b[1] - a[1], L = ex * ex + ez * ez, k = L > 0 ? clamp(((p[0] - a[0]) * ex + (p[1] - a[1]) * ez) / L, 0, 1) : 0; return Math.hypot(p[0] - a[0] - ex * k, p[1] - a[1] - ez * k); };
const edgeDist = (ring, p) => Math.min(...ring.map((a, i) => segDist(p, a, ring[(i + 1) % ring.length])));
/** thingPlan(thing, ring): a held thing as its catalogue piece INSIDE its scored box (the box is the fact; the piece is how a terrain set sculpts it: never a
 *  prop his scan does not hold, L2), in the thing's own frame (s along its own x, y from its centre, t along its own z): `blocks` (marble, each its tone and
 *  bevel) and `gold`. A sofa: a plinth, two arms, a back, a seat's base, its seat and back cushions (two or three by its length), gold on the plinth and the
 *  arms; a table: a top on four legs, a gold apron; a chair: a seat on four legs and a back; a shelf: its sides, top, foot, back and shelves with gold
 *  lips; a bed: a base, a mattress, a headboard, two pillows. The back (a bed's head) stands against the nearer edge of his floor (`ring`). */
export function thingPlan(t, ring = []) {
  const [sx, sy, sz] = t.size, kind = kindOf(t.kind), c = Math.cos(t.yaw || 0), sn = Math.sin(t.yaw || 0), at = t.at;
  const swap = sz > sx, L = swap ? sz : sx, D = swap ? sx : sz, H = sy, yb = -sy / 2;
  const world = (u, v) => { const [a, b] = swap ? [v, u] : [u, v]; return [at[0] + a * c + b * sn, at[2] - a * sn + b * c]; };
  const near = (u, v) => (ring.length >= 3 ? edgeDist(ring, world(u, v)) : 0);
  const bv = kind === 'bed' ? 1 : near(0, D / 2) <= near(0, -D / 2) ? 1 : -1, bu = kind === 'bed' ? (near(L / 2, 0) <= near(-L / 2, 0) ? 1 : -1) : 1;
  const box = (u0, u1, y0, y1, v0, v1, extra = {}) => { const [U0, U1] = bu > 0 ? [u0, u1] : [-u1, -u0], [V0, V1] = bv > 0 ? [v0, v1] : [-v1, -v0];
    return swap ? { s0: V0, s1: V1, y0, y1, t0: U0, t1: U1, ...extra } : { s0: U0, s1: U1, y0, y1, t0: V0, t1: V1, ...extra }; };
  const blocks = [], gold = [], tone = (k) => 0.35 + 0.6 * hashOf(t.id, 'tone', k);
  if (kind === 'sofa') {
    const aw = clamp(0.13 * L, 0.12, 0.22), bd = clamp(0.24 * D, 0.14, 0.26), base = 0.09, seat = Math.min(0.42, H * 0.5), arm = Math.min(H * 0.66, seat + 0.2), ui = L / 2 - aw;
    blocks.push(box(-L / 2 + 0.04, L / 2 - 0.04, yb, yb + base, -D / 2 + 0.04, D / 2 - 0.04, { tone: 0.1, chamfer: 0.01 }));   // the plinth
    blocks.push(box(-L / 2, -ui, yb + base, yb + arm, -D / 2, D / 2, { tone: tone('arm'), chamfer: 0.05 }), box(ui, L / 2, yb + base, yb + arm, -D / 2, D / 2, { tone: tone('arm'), chamfer: 0.05 }));   // the arms
    blocks.push(box(-ui, ui, yb + base, yb + H, D / 2 - bd, D / 2, { tone: tone('back'), chamfer: 0.045 }));   // the back
    blocks.push(box(-ui, ui, yb + base, yb + seat - 0.12, -D / 2 + 0.02, D / 2 - bd, { tone: 0.2, chamfer: 0.015 }));   // the seat's base
    const n = 2 * ui > 1.3 ? 3 : 2, gap = 0.025, cw = (2 * ui - gap * (n + 1)) / n;
    for (let k = 0; k < n; k++) { const u0 = -ui + gap + k * (cw + gap);
      blocks.push(box(u0, u0 + cw, yb + seat - 0.12, yb + seat, -D / 2 + 0.035, D / 2 - bd - 0.012, { tone: tone(`seat${k}`), chamfer: 0.05 }));   // a seat cushion
      blocks.push(box(u0, u0 + cw, yb + seat + 0.005, yb + H - 0.07, D / 2 - bd - 0.14, D / 2 - bd - 0.006, { tone: tone(`rest${k}`), chamfer: 0.055 })); }   // a back cushion
    gold.push(box(-L / 2 + 0.06, L / 2 - 0.06, yb + 0.032, yb + 0.052, -D / 2 + 0.028, -D / 2 + 0.042));   // the plinth's gold band, in front
    for (const [a, b] of [[-L / 2 + 0.014, -L / 2 + 0.04], [L / 2 - 0.04, L / 2 - 0.014]]) gold.push(box(a, b, yb + arm - 0.002, yb + arm + 0.01, -D / 2 + 0.035, D / 2 - 0.035));   // the arms' piping: a gold wire on their outer edge
  } else if (kind === 'table') {
    const top = Math.min(0.05, H * 0.1), leg = clamp(Math.min(L, D) * 0.08, 0.045, 0.08), inset = 0.05;
    blocks.push(box(-L / 2, L / 2, yb + H - top, yb + H, -D / 2, D / 2, { tone: tone('top'), chamfer: 0.012 }));
    for (const su of [-1, 1]) for (const sv of [-1, 1]) { const uc = su * (L / 2 - inset - leg / 2), vc = sv * (D / 2 - inset - leg / 2); blocks.push(box(uc - leg / 2, uc + leg / 2, yb, yb + H - top, vc - leg / 2, vc + leg / 2, { tone: 0.3, chamfer: 0.008 })); }
    for (const sv of [-1, 1]) gold.push(box(-L / 2 + inset, L / 2 - inset, yb + H - top - 0.024, yb + H - top, sv * (D / 2 - inset) - 0.008, sv * (D / 2 - inset) + 0.008));   // the apron's gold
  } else if (kind === 'chair') {
    const seat = Math.min(0.46, H * 0.5), st = 0.045, leg = clamp(Math.min(L, D) * 0.09, 0.035, 0.06), bd = 0.06;
    blocks.push(box(-L / 2, L / 2, yb + seat - st, yb + seat, -D / 2, D / 2, { tone: tone('seat'), chamfer: 0.012 }));
    for (const su of [-1, 1]) for (const sv of [-1, 1]) { const uc = su * (L / 2 - leg), vc = sv * (D / 2 - leg); blocks.push(box(uc - leg / 2, uc + leg / 2, yb, yb + seat - st, vc - leg / 2, vc + leg / 2, { tone: 0.3, chamfer: 0.006 })); }
    blocks.push(box(-L / 2, L / 2, yb + seat, yb + H - 0.014, D / 2 - bd, D / 2, { tone: tone('back'), chamfer: 0.02 }));
    gold.push(box(-L / 2 + 0.02, L / 2 - 0.02, yb + H - 0.014, yb + H, D / 2 - bd + 0.01, D / 2 - 0.01));
  } else if (kind === 'shelf') {
    const th = 0.035, n = Math.max(2, Math.min(6, Math.round(H / 0.38)));
    blocks.push(box(-L / 2, -L / 2 + th, yb, yb + H, -D / 2, D / 2, { tone: 0.45, chamfer: 0.01 }), box(L / 2 - th, L / 2, yb, yb + H, -D / 2, D / 2, { tone: 0.45, chamfer: 0.01 }));
    blocks.push(box(-L / 2 + th, L / 2 - th, yb + H - th, yb + H, -D / 2, D / 2, { tone: 0.5, chamfer: 0.008 }), box(-L / 2 + th, L / 2 - th, yb, yb + 0.08, -D / 2, D / 2, { tone: 0.2, chamfer: 0.008 }));
    blocks.push(box(-L / 2 + th, L / 2 - th, yb + 0.08, yb + H - th, D / 2 - 0.02, D / 2, { tone: 0.1, chamfer: 0 }));   // the back
    for (let k = 1; k < n; k++) { const y = yb + 0.08 + (H - 0.08 - th) * k / n;
      blocks.push(box(-L / 2 + th, L / 2 - th, y - th / 2, y + th / 2, -D / 2 + 0.012, D / 2 - 0.02, { tone: tone(`shelf${k}`), chamfer: 0.006 }));
      gold.push(box(-L / 2 + th, L / 2 - th, y - th / 2 + 0.006, y + th / 2 - 0.006, -D / 2 + 0.004, -D / 2 + 0.012)); }   // a shelf's gold lip
  } else if (kind === 'bed') {
    const base = H * 0.32, mat = H * 0.58, head = 0.08, pw = Math.min(0.7, (D - 0.12) / 2);
    blocks.push(box(-L / 2, L / 2 - head, yb, yb + base, -D / 2, D / 2, { tone: 0.25, chamfer: 0.015 }));
    blocks.push(box(-L / 2 + 0.03, L / 2 - head - 0.02, yb + base, yb + mat, -D / 2 + 0.03, D / 2 - 0.03, { tone: 0.9, chamfer: 0.05 }));
    blocks.push(box(L / 2 - head, L / 2, yb, yb + H - 0.014, -D / 2, D / 2, { tone: tone('head'), chamfer: 0.02 }));   // the headboard
    for (const sv of [-1, 1]) { const vc = sv * (pw / 2 + 0.03); blocks.push(box(L / 2 - head - 0.44, L / 2 - head - 0.06, yb + mat, yb + Math.min(H - 0.02, mat + 0.1), vc - pw / 2, vc + pw / 2, { tone: 0.97, chamfer: 0.045 })); }
    gold.push(box(L / 2 - head + 0.012, L / 2 - 0.012, yb + H - 0.014, yb + H, -D / 2 + 0.02, D / 2 - 0.02));
  } else {
    blocks.push(box(-L / 2, L / 2, yb, yb + H, -D / 2, D / 2, { tone: hashOf(t.id, 'tone'), chamfer: CHAMFER * 1.4 }));
    if (L > 0.16 && D > 0.16) { const i0 = 0.06, b = 0.022, y0 = yb + H - 0.004, y1 = yb + H + 0.005;   // the inlay: a thin gold band inset on its top (INTEGRATOR)
      gold.push(box(-L / 2 + i0, L / 2 - i0, y0, y1, -D / 2 + i0, -D / 2 + i0 + b), box(-L / 2 + i0, L / 2 - i0, y0, y1, D / 2 - i0 - b, D / 2 - i0), box(-L / 2 + i0, -L / 2 + i0 + b, y0, y1, -D / 2 + i0 + b, D / 2 - i0 - b), box(L / 2 - i0 - b, L / 2 - i0, y0, y1, -D / 2 + i0 + b, D / 2 - i0 - b)); }
  }
  return { kind, blocks, gold, back: { u: bu, v: bv, swap } };
}
/** restOf(thing, ring, at): where a mini set down on a held thing rests (THE ANCHOR, Oct 11): the world height of the highest of its sculpted blocks over
 *  `at` (its own centre when none is given): a sofa's seat cushion, a table's top, a bed's mattress, a block's top; its box's top when no block is under. */
export function restOf(t, ring = [], at = null) {
  const P = thingPlan(t, ring), c = Math.cos(t.yaw || 0), sn = Math.sin(t.yaw || 0), dx = (at ? at[0] : t.at[0]) - t.at[0], dz = (at ? at[2] : t.at[2]) - t.at[2];
  const s = dx * c - dz * sn, v = dx * sn + dz * c;   // into its own frame (thingPlan's world(): x = s c + t sn, z = -s sn + t c)
  let top = -Infinity; for (const b of P.blocks) if (s >= b.s0 && s <= b.s1 && v >= b.t0 && v <= b.t1) top = Math.max(top, b.y1);
  return t.at[1] + (Number.isFinite(top) ? top : t.size[1] / 2);
}

// ---- the magnet: a pure function of the beats since the piece's click ----
/** magnetAt(x, {fall, drop}): x = beats since the click (negative while it falls). -> {visible, y (m over its rest), ghost (0..1, the footprint while
 *  it falls), flash (0..1, the seam's gold from the click), moving}. Before the fall: not there. At x >= 2: at rest, exactly. */
export function magnetAt(x, { fall = 1, drop = DROP.wall } = {}) {
  if (!num(x) || x < -fall) return { visible: false, y: 0, ghost: 0, flash: 0, moving: num(x) };
  if (x < 0) { const u = (x + fall) / fall; return { visible: true, y: drop * (1 - u * u), ghost: 0.15 + 0.85 * u * u, flash: 0, moving: true }; }
  const A = drop * 0.06, y = x < 1 ? -A * Math.exp(-5 * x) * Math.sin(2.6 * Math.PI * x) : 0;   // into the magnet, a small bounce, settled
  const flash = x < 2 ? Math.exp(-2.2 * x) * (1 - x / 2) : 0;
  return { visible: true, y, ghost: 0, flash, moving: x < 2 };
}
/** clicksOf(room, notes): each piece's click beat from the growth's notes: the board on D + 1, wall i on its note's beat + 2, a corner half a beat
 *  after the later of its walls, a thing on its note's beat + 1/2. A piece with no note is at rest (its click long past). */
export function clicksOf(R, notes = [], joints = []) {
  const wallNotes = notes.filter((n) => n.kind === 'wall'), D = wallNotes.length ? Math.min(...wallNotes.map((n) => n.beat)) : null;
  const past = -1e9, walls = new Map(), things = new Map(), corners = new Map();
  for (const w of R.walls) { const n = wallNotes.find((x) => x.id === w.id); walls.set(w.id, n ? n.beat + 2 : past); }
  for (const n of notes) if (n.kind === 'thing') things.set(n.id, n.beat + 0.5);
  for (const j of joints) corners.set(j.id, Math.max(walls.get(j.walls[0]) ?? past, walls.get(j.walls[1]) ?? past) + 0.5);
  return { board: D == null ? past : D + 1, walls, things, corners };
}

// ---- the shaders: one pass, no texture ----
const NOISE = `
float tgH21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float tgH31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float tgN2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(tgH21(i), tgH21(i + vec2(1.0, 0.0)), f.x), mix(tgH21(i + vec2(0.0, 1.0)), tgH21(i + vec2(1.0, 1.0)), f.x), f.y); }
float tgN3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(tgH31(i), tgH31(i + vec3(1,0,0)), f.x), mix(tgH31(i + vec3(0,1,0)), tgH31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(tgH31(i + vec3(0,0,1)), tgH31(i + vec3(1,0,1)), f.x), mix(tgH31(i + vec3(0,1,1)), tgH31(i + vec3(1,1,1)), f.x), f.y), f.z); }
float tgVein(vec3 w){ float n = tgN3(w * 2.3) * 0.6 + tgN3(w * 5.1) * 0.3 + tgN3(w * 12.0) * 0.1;
  float v = abs(sin(dot(w, vec3(1.9, 0.8, 1.4)) * 2.4 + n * 6.5)); return 1.0 - smoothstep(0.0, 0.1, v); }
`;
const TILE_COLOR = `
vec2 tRel = vTgW - uO;
vec2 tQ = vec2(dot(tRel, uU), dot(tRel, uV)) / uT;
vec2 tId = floor(tQ), tF = fract(tQ);
vec2 tC = uO + ((tId.x + 0.5) * uT.x) * uU + ((tId.y + 0.5) * uT.y) * uV;
float tD = length(tC - uHome);
float tShown = step(tD, uReveal);
float tGlow = tShown * step(uReveal, 999.0) * exp(-pow((uReveal - tD) / 0.55, 2.0));
vec2 tDm = min(tF, 1.0 - tF) * uT;
float tE = min(tDm.x, tDm.y) + (tgN2(vTgW * 21.0) - 0.5) * 0.008;
float tH1 = tgH21(tId + 0.5), tH2 = tgH21(tId + 31.7), tH3 = tgH21(tId + 77.1);
float tGroove = tShown * (1.0 - smoothstep(0.007, 0.013, tE));
float tBevelX = clamp((tE - 0.011) / 0.06, 0.0, 1.0), tBevel = tShown * (1.0 - tBevelX) * step(0.0, 0.071 - tE);
vec2 tCorner = vec2(step(0.5, tH3), step(0.5, fract(tH3 * 7.13)));
float tChip = tShown * step(0.78, tH2) * (1.0 - smoothstep(0.035, 0.085, length((tF - tCorner) * uT) + (tgN2(vTgW * 40.0) - 0.5) * 0.03));
vec3 tTone = mix(vec3(0.8), vec3(1.06), tH1) * mix(vec3(1.0), vec3(1.035, 1.0, 0.93), tH2) * (tH3 > 0.88 ? 0.88 : 1.0);
float tMott = 0.9 + 0.12 * tgN2(vTgW * 3.7 + tH1 * 23.0) + 0.07 * (tgN2(vTgW * 13.0 + tH2 * 7.0) - 0.5);
float tPits = 1.0 - 0.14 * smoothstep(0.74, 0.92, tgN2(vTgW * 57.0 + tH3 * 5.0));
float tAO = 1.0;
for (int i = 0; i < 16; i++) { if (i >= uNW) break; vec4 s = uWalls[i]; vec2 ab = s.zw - s.xy; float h = clamp(dot(vTgW - s.xy, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  float d = length(vTgW - s.xy - ab * h); tAO *= 1.0 - 0.5 * exp(-d / 0.2); }
vec3 tStone = tTone * tMott * tPits * (1.0 - 0.28 * tChip) * (1.0 - 0.1 * tBevel * tBevel);
diffuseColor.rgb *= mix(vec3(0.95), tStone, tShown) * tAO;
diffuseColor.rgb = mix(diffuseColor.rgb, uGroove * tAO, tGroove);
`;
const TILE_NORMAL = `
{ vec2 tG = (tDm.x < tDm.y) ? vec2(tF.x < 0.5 ? -1.0 : 1.0, 0.0) : vec2(0.0, tF.y < 0.5 ? -1.0 : 1.0);
  vec2 tGw = tG.x * uU + tG.y * uV; float tK = max(1.5 * pow(tBevel, 1.6), tChip * 0.6);
  normal = normalize((viewMatrix * vec4(normalize(vec3(tGw.x * tK, 1.0, tGw.y * tK)), 0.0)).xyz); }
`;
const MARBLE_COLOR = `
vec3 mP = vTgR + uSeed + vColor.rgb * 41.0;
float mM = tgN3(mP * 3.1) * 0.66 + tgN3(mP * 9.3) * 0.34;
float mVein = smoothstep(0.95, 0.995, 1.0 - abs(2.0 * tgN3(mP * 1.7 + mM * 1.6) - 1.0));
diffuseColor.rgb *= (0.91 + 0.11 * mM) * (1.0 - mVein * 0.07);
diffuseColor.rgb *= mix(0.62, 1.0, smoothstep(0.0, 0.5, vTgR.y - uFloorY));
`;
// FIXER (Oct 11): the stone's tooth: the surface's normal bent by a three-octave height (three.js perturbNormalArb, in one pass, no texture), so a block reads
// as hewn stone under the key, never a glazed tile; the veins above at a third of their ink (the judge saw "dark vein splotches like stains").
const MARBLE_NORMAL = `
{ vec3 mQ = (vTgR + uSeed) * 2.6; float mH = tgN3(mQ) * 0.7 + tgN3(mQ * 2.3) * 0.3;
  vec3 mSx = normalize(dFdx(-vViewPosition)), mSy = normalize(dFdy(-vViewPosition)), mR1 = cross(mSy, normal), mR2 = cross(normal, mSx);
  float mDet = dot(mSx, mR1) * faceDirection; vec2 mD = vec2(dFdx(mH), dFdy(mH)) * uBump;
  normal = normalize(abs(mDet) * normal - sign(mDet) * (mD.x * mR1 + mD.y * mR2)); }
`;

/** mountTerrain(twin, {THREE?}) -> {sample(detail), state(), stop()}. Returns at once; draws nothing until the twin hands over a held room. */
export function mountTerrain(twin, { THREE = null } = {}) {
  const T = THREE || twin?.THREE, stage = twin?.stage;
  const S = { flares: [], key: '', built: null, phase: null, notes: null, dirty: true, claimed: false, holding: false, clicked: new Set(), samples: 0, builds: 0, shadowRefreshes: 0, lastC: null, cut: '' };
  const offs = [], on = (ev, fn) => { if (typeof twin?.on !== 'function') return; const off = twin.on(ev, fn); offs.push(typeof off === 'function' ? off : () => twin.off?.(ev, fn)); };
  const call = (f) => { try { return f(); } catch { return null; } };
  if (!T || !stage || typeof stage.addLayer !== 'function') return { sample() {}, state: () => ({ built: false, reason: 'no stage' }), stop() {} };

  const root = new T.Group(); root.name = 'terrain'; stage.addLayer(root);
  const RVU = { uLv: { value: new Float32Array(RV.n).fill(1) }, uRv: { value: 0 } };   // THE REVEAL's levels, shared by every material here
  const withReveal = (sh) => {
    Object.assign(sh.uniforms, RVU);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>\n${RV_VERT_PARS}`).replace('#include <begin_vertex>', `#include <begin_vertex>\n${RV_VERT}`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>\n${RV_FRAG_PARS}`).replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>\n${RV_FRAG_CUT}`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n${RV_FRAG_EMBER}`);
  };
  const revealing = (m, key) => { m.onBeforeCompile = withReveal; m.customProgramCacheKey = () => key; return m; };   // a plain material of this layer, with the dissolve
  const lin = (hex) => new T.Color(hex);   // three.js keeps material colours linear: a hex is read as sRGB
  // ---- the materials, made once ----
  const marbleUniforms = (seed, bump = 1.3) => ({ uFloorY: { value: 0 }, uSeed: { value: new T.Vector3(seed * 7.1, seed * 3.3, seed * 5.7) }, uBump: { value: bump } });
  function marble(opts, uniforms, cacheKey) {
    const chunk = opts.vertexColors ? MARBLE_COLOR : MARBLE_COLOR.replace(' + vColor.rgb * 41.0', '');
    const m = new T.MeshStandardMaterial({ roughness: 0.5, metalness: 0, ...opts });
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, uniforms);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vTgR;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvTgR = position;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>\nvarying vec3 vTgR;\nuniform float uFloorY;\nuniform vec3 uSeed;\nuniform float uBump;\n${NOISE}`).replace('#include <color_fragment>', `#include <color_fragment>\n${chunk}`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${MARBLE_NORMAL}`);
      withReveal(sh);
    };
    m.customProgramCacheKey = () => cacheKey;
    return m;
  }
  const wallU = marbleUniforms(0), kerbU = marbleUniforms(1, 1.2);
  const M = {
    wall: marble({ color: 0xffffff, vertexColors: true, roughness: 0.66 }, wallU, 'terrain-marble-v3'),
    kerb: marble({ color: PALETTE.kerb, roughness: 0.62 }, kerbU, 'terrain-kerb-v3'),
    kerbSide: revealing(new T.MeshStandardMaterial({ color: PALETTE.kerbSide, roughness: 0.8, metalness: 0 }), 'terrain-rv-kerbside'),
    gold: revealing(new T.MeshStandardMaterial({ color: PALETTE.gold, metalness: 0.5, roughness: 0.32, emissive: PALETTE.glow, emissiveIntensity: GOLD_GLOW }), 'terrain-rv-gold'),
    joint: revealing(new T.MeshStandardMaterial({ color: PALETTE.joint, metalness: 0, roughness: 0.95, emissive: PALETTE.glow, emissiveIntensity: 0 }), 'terrain-rv-joint'),   // FIXER: the joints dark, lit from inside only by the magnet's breath and click
  };
  const tileU = { uO: { value: new T.Vector2() }, uU: { value: new T.Vector2(1, 0) }, uV: { value: new T.Vector2(0, 1) }, uT: { value: new T.Vector2(TILE, TILE) }, uHome: { value: new T.Vector2() },
    uReveal: { value: 1e4 }, uGroove: { value: lin(PALETTE.groove) }, uGold: { value: lin(PALETTE.glow) }, uWalls: { value: Array.from({ length: 16 }, () => new T.Vector4()) }, uNW: { value: 0 } };
  M.tiles = new T.MeshStandardMaterial({ color: PALETTE.floor, roughness: 0.58, metalness: 0, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  M.tiles.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, tileU);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vTgW;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvTgW = (modelMatrix * vec4(transformed, 1.0)).xz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>\nvarying vec2 vTgW;\nuniform vec2 uO, uU, uV, uT, uHome;\nuniform float uReveal;\nuniform vec3 uGroove, uGold;\nuniform vec4 uWalls[16];\nuniform int uNW;\n${NOISE}`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n${TILE_COLOR}`).replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${TILE_NORMAL}`)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uGold * tGlow * 0.95;');
    withReveal(sh);
  };
  M.tiles.customProgramCacheKey = () => 'terrain-tiles-v2';
  const flareGold = () => { const m = revealing(M.gold.clone(), 'terrain-rv-gold'); S.flares.push(m); return m; };   // a piece's own gold: its frame and coping flare on its click (one material per piece: no draw added)
  const flareJoint = () => { const m = revealing(M.joint.clone(), 'terrain-rv-joint'); S.flares.push(m); return m; };   // FIXER: a piece's own dark joints, swept gold on its click and the downbeat
  const glowMat = () => new T.MeshBasicMaterial({ color: 0xffffff, vertexColors: true, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -6 });

  // ---- the geometry: chamfered boxes into one buffer per piece ----
  const POLY = new Map();
  function polysOf(chamfer) {   // a chamfered unit box's faces in [-1, 1]^3 with the bevel `chamfer` of the half size (cached by the rounded ratio triple)
    return (h, c) => {
      const k = [h[0] - c, h[1] - c, h[2] - c], P = [];
      for (let a = 0; a < 3; a++) for (const s of [-1, 1]) { const b = (a + 1) % 3, d = (a + 2) % 3; P.push([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sb, sd]) => { const v = [0, 0, 0]; v[a] = s * h[a]; v[b] = sb * k[b]; v[d] = sd * k[d]; return v; })); }
      if (!chamfer || c <= 0) return P;
      for (let a = 0; a < 3; a++) { const b = (a + 1) % 3, d = (a + 2) % 3;
        for (const sa of [-1, 1]) for (const sb of [-1, 1]) P.push([[0, -1], [0, 1], [1, 1], [1, -1]].map(([x, sd]) => { const v = [0, 0, 0]; if (x === 0) { v[a] = sa * h[a]; v[b] = sb * k[b]; } else { v[a] = sa * k[a]; v[b] = sb * h[b]; } v[d] = sd * k[d]; return v; })); }
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) { const s = [sx, sy, sz]; P.push([0, 1, 2].map((a) => { const v = [s[0] * k[0], s[1] * k[1], s[2] * k[2]]; v[a] = s[a] * h[a]; return v; })); }
      return P;
    };
  }
  POLY.set(true, polysOf(true)); POLY.set(false, polysOf(false));
  const Acc = () => ({ p: [], n: [], c: [] });
  /** a box with extents {s0..s1, y0..y1, t0..t1} in the frame F = {o, ex, ey, ez} (world = o + ex s + ey y + ez t), chamfered, coloured */
  function addBox(acc, F, e, chamfer, col) {
    const h = [(e.s1 - e.s0) / 2, (e.y1 - e.y0) / 2, (e.t1 - e.t0) / 2]; if (h.some((v) => v <= 1e-5)) return;
    const c = Math.min(chamfer, h[0] * 0.45, h[1] * 0.45, h[2] * 0.45), m = [(e.s0 + e.s1) / 2, (e.y0 + e.y1) / 2, (e.t0 + e.t1) / 2];
    const W = (v) => [F.o[0] + F.ex[0] * (m[0] + v[0]) + F.ey[0] * (m[1] + v[1]) + F.ez[0] * (m[2] + v[2]), F.o[1] + F.ex[1] * (m[0] + v[0]) + F.ey[1] * (m[1] + v[1]) + F.ez[1] * (m[2] + v[2]), F.o[2] + F.ex[2] * (m[0] + v[0]) + F.ey[2] * (m[1] + v[1]) + F.ez[2] * (m[2] + v[2])];
    const ctr = W([0, 0, 0]);
    for (const poly of POLY.get(c > 0)(h, c)) {
      let pts = poly.map(W);
      const a = pts[0], b = pts[1], d = pts[2], u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      let nrm = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; const L = Math.hypot(...nrm); if (L < 1e-12) continue; nrm = nrm.map((x) => x / L);
      const cen = pts.reduce((s, q) => [s[0] + q[0] / pts.length, s[1] + q[1] / pts.length, s[2] + q[2] / pts.length], [0, 0, 0]);
      if ((cen[0] - ctr[0]) * nrm[0] + (cen[1] - ctr[1]) * nrm[1] + (cen[2] - ctr[2]) * nrm[2] < 0) { pts = pts.reverse(); nrm = nrm.map((x) => -x); }
      for (let i = 1; i < pts.length - 1; i++) for (const q of [pts[0], pts[i], pts[i + 1]]) { acc.p.push(q[0], q[1], q[2]); acc.n.push(nrm[0], nrm[1], nrm[2]); acc.c.push(col[0], col[1], col[2]); }
    }
  }
  const pieceAttr = (g, piece) => { g.setAttribute('aPiece', new T.Float32BufferAttribute(new Float32Array(g.attributes.position.count).fill(piece), 1)); return g; };   // THE REVEAL: whose level this geometry dissolves by
  function geometryOf(groups, piece = RV.spare) {   // [[acc, materialIndex], ...] -> one BufferGeometry with its groups
    const g = new T.BufferGeometry(), p = [], n = [], c = []; let start = 0;
    for (const [acc, mi] of groups) { const count = acc.p.length / 3; if (!count) continue; p.push(...acc.p); n.push(...acc.n); c.push(...acc.c); g.addGroup(start, count, mi); start += count; }
    g.setAttribute('position', new T.Float32BufferAttribute(p, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(n, 3)); g.setAttribute('color', new T.Float32BufferAttribute(c, 3));
    g.computeBoundingSphere(); return pieceAttr(g, piece);
  }
  const IVORY = lin(PALETTE.ivory), WHITE = [1, 1, 1];
  const toneOf = (b) => { const k = (0.86 + 0.18 * b.tone) * (b.worn ? 0.84 : 1), warm = (b.tone - 0.5) * 0.07; return [IVORY.r * k * (1 + warm), IVORY.g * k, IVORY.b * k * (1 - warm * 1.6)]; };   // FIXER: each stone its own tone, a little wider apart
  const wallFrame = (w) => ({ o: [w.a[0], w.floor, w.a[2]], ex: w.u, ey: [0, 1, 0], ez: [-w.n[0], 0, -w.n[2]] });
  function pieceMesh(plan, F, gold = M.gold, joint = M.joint, piece = RV.spare) {
    const marbleAcc = Acc(), jointAcc = Acc(), goldAcc = Acc();
    for (const b of plan.blocks) addBox(marbleAcc, F, b, CHAMFER, toneOf(b));
    for (const k of plan.joints) addBox(jointAcc, F, k, 0, WHITE);
    for (const g of plan.gold) addBox(goldAcc, F, g, 0.008, WHITE);
    const mesh = new T.Mesh(geometryOf([[marbleAcc, 0], [jointAcc, 1], [goldAcc, 2]], piece), [M.wall, joint, gold]); mesh.castShadow = true; mesh.receiveShadow = true; return mesh;
  }
  function glowMesh(quads, y) {   // flat gold quads on the board: [[corners x4 as [x, z]], strength]
    const acc = Acc();
    for (const [q, k] of quads) for (const i of [0, 1, 2, 0, 2, 3]) { acc.p.push(q[i][0], y, q[i][1]); acc.n.push(0, 1, 0); acc.c.push(k, k * 0.8, k * 0.45); }
    const m = new T.Mesh(geometryOf([[acc, 0]]), glowMat()); m.visible = false; m.renderOrder = 3; return m;
  }
  const footQuads = (w) => { const P = (s, t) => [w.a[0] + w.u[0] * s - w.n[0] * t, w.a[2] + w.u[2] * s - w.n[2] * t];
    return [[[P(-0.06, -0.06), P(w.len + 0.06, -0.06), P(w.len + 0.06, TW + 0.06), P(-0.06, TW + 0.06)], 0.32], [[P(-0.04, -0.035), P(w.len + 0.04, -0.035), P(w.len + 0.04, 0.004), P(-0.04, 0.004)], 1], [[P(-0.04, TW - 0.004), P(w.len + 0.04, TW - 0.004), P(w.len + 0.04, TW + 0.035), P(-0.04, TW + 0.035)], 1]]; };

  // ---- the build: once per held room ----
  function dispose() {
    if (!S.built) return;
    root.traverse((o) => { if (o.isMesh) { o.geometry?.dispose(); if (o.material && !Object.values(M).includes(o.material) && !Array.isArray(o.material)) o.material.dispose(); } });
    for (const m of S.flares.splice(0)) m.dispose();
    root.clear(); S.built = null; S.clicked.clear(); S.cut = '';
  }
  /** hungOn(wall, glasses): the stretches [s0, s1] of this wall a placed glass hangs on (its centre within 20 cm of the wall's line), with 20 cm round it. */
  function hungOn(w, glasses = []) {
    const out = [];
    for (const g of glasses) {
      const p = g?.pose?.position; if (!Array.isArray(p)) continue;
      const s = (p[0] - w.a[0]) * w.u[0] + (p[2] - w.a[2]) * w.u[2], d = Math.abs((p[0] - w.a[0]) * w.n[0] + (p[2] - w.a[2]) * w.n[2]), half = (g.pose.size?.[0] ?? 0.6) / 2;
      if (d < 0.2 && s > -half && s < w.len + half) out.push([s - half - 0.2, s + half + 0.2]);
    }
    return out;
  }
  function build(R, L, shell, glasses = []) {
    dispose(); S.builds++;
    const F = tileFrameOf(R), outline = outlineOf(R.ring, TW + 0.02), home = call(() => twin.home?.()) || { position: [0, R.floor, 0] };
    wallU.uFloorY.value = R.floor; kerbU.uFloorY.value = R.floor;
    tileU.uO.value.set(...F.O); tileU.uU.value.set(...F.U); tileU.uV.value.set(...F.V); tileU.uT.value.set(...F.T); tileU.uHome.value.set(home.position[0], home.position[2]);
    R.walls.slice(0, 16).forEach((w, i) => tileU.uWalls.value[i].set(w.a[0], w.a[2], w.b[0], w.b[2])); tileU.uNW.value = Math.min(16, R.walls.length);
    const reach = Math.max(...R.ring.map(([x, z]) => Math.hypot(x - home.position[0], z - home.position[2]))) + Math.hypot(...F.T);
    // the board: the kerb slab under the ring pushed out under the walls, the tiles on the ring
    const board = new T.Group(), flat = R.ring.length < 3 || Math.abs(areaOf(R.ring)) < 0.05; board.name = 'terrain-board';   // a lone wall closes no floor: no board, the wall stands alone
    if (!flat) {
      const slabShape = new T.Shape(outline.map(([x, z]) => new T.Vector2(x, -z))); slabShape.holes.push(new T.Path(R.ring.map(([x, z]) => new T.Vector2(x, -z))));
      const slab = new T.ExtrudeGeometry(slabShape, { depth: BOARD - 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 1, curveSegments: 1 });
      slab.rotateX(-Math.PI / 2); slab.translate(0, R.floor - BOARD + 0.02, 0); pieceAttr(slab, RV.board);
      const slabMesh = new T.Mesh(slab, [M.kerb, M.kerbSide]); slabMesh.receiveShadow = true; slabMesh.castShadow = true; board.add(slabMesh);
      const tiles = new T.Mesh(pieceAttr(new T.ShapeGeometry(new T.Shape(R.ring.map(([x, z]) => new T.Vector2(x, -z)))).rotateX(-Math.PI / 2), RV.board), M.tiles); tiles.position.y = R.floor + 0.0006; tiles.receiveShadow = true; board.add(tiles);
    }
    root.add(board);
    // the walls, each a piece with its full and its cut-away body, its glow on the board
    const walls = R.walls.map((w, wi) => {
      const ops = openingsOn(w, L), F = wallFrame(w), g = new T.Group(), gold = flareGold(), joint = flareJoint(), piece = wi < 16 ? RV.wall + wi : RV.spare; g.name = `terrain-wall-${w.id}`;
      const keep = hungOn(w, glasses);   // FIXER: no broken top over a glass hung on this wall
      const full = pieceMesh(wallPlan(w, ops, { keep }), F, gold, joint, piece), low = pieceMesh(wallPlan(w, ops, { low: true }), F, gold, joint, piece); low.visible = false; g.add(full, low); root.add(g);
      const glow = glowMesh(footQuads(w), R.floor + 0.004); root.add(glow);
      return { id: w.id, w, g, full, low, glow, gold, joint, near: false, piece };
    });
    // the corner posts: marble, a gold cap; full when either wall stands full
    const corners = jointsOf(R).map((j, ci) => {
      const piece = ci < 16 ? RV.corner + ci : RV.spare, A = R.walls.find((w) => w.id === j.walls[0]), F = { o: [j.at[0], j.floor, j.at[1]], ex: A.u, ey: [0, 1, 0], ez: [-A.n[0], 0, -A.n[2]] }, half = TW / 2 + 0.035, g = new T.Group(), gold = flareGold();
      const post = (H) => { const marbleAcc = Acc(), goldAcc = Acc(), tone = hashOf(j.id, 'tone');
        addBox(marbleAcc, F, { s0: -half, s1: half, y0: 0, y1: H, t0: -half, t1: half }, CHAMFER * 1.3, toneOf({ tone, worn: false }));
        addBox(goldAcc, F, { s0: -half + 0.03, s1: half - 0.03, y0: H - 0.005, y1: H + 0.035, t0: -half + 0.03, t1: half - 0.03 }, 0.01, WHITE);
        const m = new T.Mesh(geometryOf([[marbleAcc, 0], [goldAcc, 1]], piece), [M.wall, gold]); m.castShadow = true; m.receiveShadow = true; return m; };   // the corner's gold cap stays (the judge: gold on the caps and the door frame)
      const full = post(j.height + 0.05), low = post(Math.min(LOW, j.height) + 0.06); low.visible = false; g.add(full, low); root.add(g);
      return { id: j.id, j, g, full, low, gold, piece };
    });
    // the held things (a scanned room's; an old scan's shell has none): each sculpted by its kind inside its scored box (thingPlan), its glow under it
    const things = (L.things || []).map((t, ti) => {
      const c = Math.cos(t.yaw || 0), s = Math.sin(t.yaw || 0), F = { o: t.at, ex: [c, 0, -s], ey: [0, 1, 0], ez: [s, 0, c] }, [sx, sy, sz] = t.size, marbleAcc = Acc(), goldAcc = Acc();
      const plan = thingPlan(t, R.ring);
      for (const b of plan.blocks) addBox(marbleAcc, F, b, b.chamfer ?? CHAMFER * 1.4, toneOf({ tone: b.tone ?? hashOf(t.id, 'tone'), worn: false }));
      for (const g of plan.gold) addBox(goldAcc, F, g, 0.004, WHITE);
      const piece = ti < 30 ? RV.thing + ti : RV.spare, m = new T.Mesh(geometryOf([[marbleAcc, 0], [goldAcc, 1]], piece), [M.wall, M.gold]); m.castShadow = true; m.receiveShadow = true; const g = new T.Group(); g.add(m); root.add(g);
      const P = (a, b) => [t.at[0] + a * c + b * s, t.at[2] - a * s + b * c], e = 0.07;
      const glow = glowMesh([[[P(-sx / 2 - e, -sz / 2 - e), P(sx / 2 + e, -sz / 2 - e), P(sx / 2 + e, sz / 2 + e), P(-sx / 2 - e, sz / 2 + e)], 0.6]], t.at[1] - sy / 2 + 0.004); root.add(glow);
      return { id: t.id, t, g, glow, mesh: m, piece };
    });
    S.built = { R, L, shell, F, board, walls, corners, things, reach, joints: corners.map((c) => c.j) };
    S.dirty = true;
  }

  // ---- the claim: the stage's own floor and walls, the wire and the rising boxes step aside while the terrain stands ----
  function claim(on) {
    if (S.claimed === on) return;
    S.claimed = on;
    if (typeof twin.terrain === 'function') call(() => twin.terrain(on)); else call(() => stage.setWorldVisible?.(!on));
  }
  function refreshShadows() { if (!S.claimed || typeof stage.setWorldVisible !== 'function') return; stage.setWorldVisible(true); stage.setWorldVisible(false); S.shadowRefreshes++; }   // the stage renders its shadow map only on a change of its world: one toggle, the world stays hidden
  function hold(on) { if (S.holding === on) return; S.holding = on; call(() => twin.animate?.(on, 'terrain')); }
  function revealClicks(B, plan) {   // THE REVEAL: each piece clicks on the beat its certainty locks (reveal-plan.mjs lockBeat); a corner half a beat after the later of its walls
    const at = (key) => plan.pieces.find((p) => p.key === key)?.lockBeat ?? plan.end;
    const walls = new Map(B.walls.map((P) => [P.id, at(`wall:${P.id}`)])), things = new Map(B.things.map((P) => [P.id, at(`thing:${P.id}`)])), corners = new Map();
    for (const j of B.joints) corners.set(j.id, Math.max(walls.get(j.walls[0]) ?? plan.end, walls.get(j.walls[1]) ?? plan.end) + 0.5);
    return { board: at('board'), walls, things, corners };
  }

  // ---- the sample: every piece placed by the clock ----
  function sample(detail = {}) {
    const clock = detail.clock || call(() => twin.clock?.()); S.samples++;
    const model = call(() => twin.model?.()), R = model?.room, L = model?.layout;
    const glasses = (call(() => twin.glasses?.()) || []).filter((g) => g?.pose?.position);   // FIXER: a glass hung on a wall keeps its stretch of the top whole
    const key = R && L ? `${L.sig}|${!!model.shell}|${R.walls.map((w) => w.id).join(',')}|${glasses.map((g) => `${g.seat}:${g.pose.position.map((v) => Math.round(v * 100)).join(',')}`).join(';')}` : '';
    if (key !== S.key) { S.key = key; if (R && L) build(R, L, !!model.shell, glasses); else dispose(); claim(!!S.built); }
    const B = S.built; if (!B || !clock || !num(clock.now_ms) || !num(clock.beat_ms) || !num(clock.epoch_ms)) { hold(false); return false; }
    const plan = call(() => twin.reveal?.())?.plan || null; if (plan !== S.plan) { S.plan = plan; S.dirty = true; }
    if (S.dirty || !S.notes) { S.notes = call(() => twin.notes?.()) || []; S.clicks = plan ? revealClicks(B, plan) : clicksOf(B.R, S.notes, B.joints); S.dirty = false; }
    const K = S.clicks, bt = (clock.now_ms - clock.epoch_ms) / clock.beat_ms, C = detail.camera?.C || call(() => twin.camera?.()?.C) || null, breath = GOLD_GLOW + GOLD_DOWNBEAT * downbeatGlow(clock);
    let changed = false, moving = false, clicked = false;
    const click = (id, at) => { if (bt >= at && !S.clicked.has(id)) { S.clicked.add(id); clicked = true; } };
    // THE REVEAL: a piece stands where it is, its solid its certainty's (no fall); its footprint's gold grows with the certainty, its click flashes on its lock
    const rv = (key, at) => { const lvl = pieceLevel(plan, key, bt), sol = solidOf(lvl), x = bt - at, fl = x >= 0 && x < 2 ? Math.exp(-2.2 * x) * (1 - x / 2) : 0;
      return { visible: sol > 0.002 || fl > 0.004, y: 0, ghost: lvl * 0.6 * (1 - sol), flash: fl, moving: false, solid: sol }; };
    const lv = RVU.uLv.value, live = !!plan && bt < plan.end + 2; lv[RV.spare] = 1;
    if (RVU.uRv.value !== (live ? 1 : 0)) { RVU.uRv.value = live ? 1 : 0; changed = true; }
    const setLv = (i, v) => { if (lv[i] !== v) { lv[i] = v; changed = true; } };
    const shadowAt = (meshes, on) => { for (const m of meshes) if (m && m.castShadow !== on) { m.castShadow = on; changed = true; } };
    // the board and its tiles
    const mb = plan ? rv('board', K.board) : magnetAt(bt - K.board, { fall: FALL.board, drop: DROP.board }), rx = bt - K.board;
    setLv(RV.board, plan ? mb.solid : 1); shadowAt(B.board.children.filter((m) => m.geometry?.type !== 'ShapeGeometry'), !plan || mb.solid >= 0.98);   // the slab casts once it stands (the tiles never: they would shade themselves)
    if (B.board.visible !== mb.visible || B.board.position.y !== mb.y) { B.board.visible = mb.visible; B.board.position.y = mb.y; changed = true; }
    const reveal = rx < 0 ? -1 : rx < 1 ? B.reach * smooth(rx) : 1e4;
    if (tileU.uReveal.value !== reveal) { tileU.uReveal.value = reveal; changed = true; }
    moving ||= mb.moving || (rx >= 0 && rx < 1); click('board', K.board);
    // the walls: the drop, the glow, the cutaway (the eye outside a wall's inner face sees its low broken course)
    const nearOf = (w) => !!C && (C[0] - w.mid[0]) * w.n[0] + (C[2] - w.mid[2]) * w.n[2] < 0;
    for (const P of B.walls) {
      const at = K.walls.get(P.id) ?? -1e9, m = plan ? rv(`wall:${P.id}`, at) : magnetAt(bt - at, { fall: FALL.wall, drop: DROP.wall }), near = nearOf(P.w);
      setLv(P.piece, plan ? m.solid : 1); shadowAt([P.full, P.low], !plan || m.solid >= 0.98); P.solid = plan ? m.solid : 1;
      if (P.g.visible !== m.visible || P.g.position.y !== m.y || P.near !== near) { P.g.visible = m.visible; P.g.position.y = m.y; P.near = near; P.full.visible = !near; P.low.visible = near; changed = true; }
      const op = Math.max(m.ghost * 0.55, m.flash), show = op > 0.004, flare = breath + GOLD_FLARE * m.flash, seam = JOINT_BREATH * downbeatGlow(clock) + JOINT_FLARE * m.flash;
      if (P.gold.emissiveIntensity !== flare) { P.gold.emissiveIntensity = flare; changed = true; }
      if (P.joint.emissiveIntensity !== seam) { P.joint.emissiveIntensity = seam; changed = true; }
      if (P.glow.visible !== show || (show && P.glow.material.opacity !== op)) { P.glow.visible = show; P.glow.material.opacity = op; changed = true; }
      moving ||= m.moving; click(`wall:${P.id}`, at);
    }
    for (const P of B.corners) {
      const at = K.corners.get(P.id) ?? -1e9, full = P.j.walls.every((id) => !(B.walls.find((x) => x.id === id)?.near));
      let m = magnetAt(bt - at, { fall: FALL.corner, drop: DROP.corner });
      if (plan) { const ws = P.j.walls.map((id) => B.walls.find((x) => x.id === id)?.solid ?? 1), sol = Math.min(...ws), x = bt - at, fl = x >= 0 && x < 2 ? Math.exp(-2.2 * x) * (1 - x / 2) : 0; m = { visible: sol > 0.002 || fl > 0.004, y: 0, flash: fl, moving: false, solid: sol }; }   // a corner stands as sure as the less sure of its walls
      setLv(P.piece, plan ? m.solid : 1); shadowAt([P.full, P.low], !plan || m.solid >= 0.98);   // INTEGRATOR: full only where both its walls stand full (the near corner never towers over the table's 3/4 view)
      if (P.g.visible !== m.visible || P.g.position.y !== m.y || P.full.visible !== full) { P.g.visible = m.visible; P.g.position.y = m.y; P.full.visible = full; P.low.visible = !full; changed = true; }
      const flare = breath + GOLD_FLARE * m.flash; if (P.gold.emissiveIntensity !== flare) { P.gold.emissiveIntensity = flare; changed = true; }
      moving ||= m.moving; click(`corner:${P.id}`, at);
    }
    for (const P of B.things) {
      const at = K.things.get(P.id) ?? -1e9, m = plan ? rv(`thing:${P.id}`, at) : magnetAt(bt - at, { fall: FALL.thing, drop: DROP.thing }), op = Math.max(m.ghost * 0.5, m.flash), show = op > 0.004;
      setLv(P.piece, plan ? m.solid : 1); shadowAt([P.mesh], !plan || m.solid >= 0.98);
      if (P.g.visible !== m.visible || P.g.position.y !== m.y) { P.g.visible = m.visible; P.g.position.y = m.y; changed = true; }
      if (P.glow.visible !== show || (show && P.glow.material.opacity !== op)) { P.glow.visible = show; P.glow.material.opacity = op; changed = true; }
      moving ||= m.moving; click(`thing:${P.id}`, at);
    }
    const pending = moving || live || bt < Math.max(K.board + 1, ...[...K.walls.values(), ...K.corners.values(), ...K.things.values()].map((x) => x + 2));
    hold(pending);
    if (clicked) refreshShadows();
    if (changed) call(() => stage.touch());
    return changed;
  }

  on('paint', (d) => sample(d));
  on('scan', (d) => { S.phase = d?.phase ?? null; S.dirty = true; });
  on('wall', () => { S.dirty = true; }); on('thing', () => { S.dirty = true; });
  return {
    sample,
    state: () => ({ built: !!S.built, phase: S.phase, claimed: S.claimed, holding: S.holding, samples: S.samples, builds: S.builds, shadowRefreshes: S.shadowRefreshes,
      walls: S.built?.walls.length ?? 0, corners: S.built?.corners.length ?? 0, things: S.built?.things.length ?? 0, tiles: S.built ? [...S.built.F.n] : null, tile: S.built ? S.built.F.T.map((v) => +v.toFixed(4)) : null,
      cut: S.built ? S.built.walls.filter((w) => w.near).map((w) => w.id) : [], reveal: tileU.uReveal.value, dissolve: S.plan ? { on: RVU.uRv.value, board: RVU.uLv.value[RV.board], walls: (S.built?.walls || []).map((w) => RVU.uLv.value[w.piece]), things: (S.built?.things || []).map((t) => RVU.uLv.value[t.piece]) } : null, clicks: S.clicks ? { board: S.clicks.board, walls: Object.fromEntries(S.clicks.walls), corners: Object.fromEntries(S.clicks.corners) } : null }),
    stop() {
      for (const off of offs.splice(0)) call(off);
      hold(false); claim(false); dispose(); stage.removeLayer?.(root);
      for (const m of Object.values(M)) m.dispose?.();
    },
  };
}
