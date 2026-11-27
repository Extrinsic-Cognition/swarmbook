// reveal-plan.mjs - THE ROOM SEEN INTO EXISTENCE (Oct 11 2026). His words, 09:4x, after the table stood on lysa: "can you work on some algo where i
// initially see the lyssajudron only and slowly i see the room 'being gaussian splatted into existence' like you know these type effects to represent
// marginal information gain", with four references (a dust ring lit by a point source inside it, an assistant whose body is particles, a room scanned
// into a monochrome mesh, ASCII ember particles).
// WHAT THIS IS. A pure planner: no THREE, no DOM, no clock of its own, no random. The HELD room (twin.mjs heldOf/roomOf: the scored walls cut by their
// openings, the scored things, the floor ring they close) is cut into surface patches, and each patch is a Gaussian belief of where its surface is:
// sigma0 at first (nothing known). The Lyssajudron's three eyes look from her hover once a beat each, each where the MARGINAL INFORMATION GAIN is
// greatest (the greedy next-best view: over the patches in its cone, the sum of 0.5 log2(1 + v / r^2) bits, r the look's noise by distance,
// incidence and the cone's edge), and a look is a Kalman update of every patch in its cone, v' = v r^2 / (v + r^2). The coverage comes first (an unseen
// patch gains the most), the refinement after (each look gains less): the curve of diminishing returns IS the picture (splat-layer.mjs draws each
// patch's belief as splats whose spread is its sigma). A piece (the board, a wall, a thing) locks when the certainty of its patches (bits gained over
// bits needed, area-weighted) reaches LOCK: that beat is its note (twin.mjs), its click (terrain-layer.mjs) and its solid.
// THE RHYTHM. A look is a cause on a beat: step j sounds on beat start + j * stride, its update eases over that one beat. Every quantity is a function of
// the room and the beat index (revealAt, fillPatches): the same room gives the same plan on every glass, a window that returns late finds it done.
// COST. Planned once per compile: the candidate gazes (the patches' directions binned round the eye) and their cones precomputed, then each look updates
// the candidates' gain sums incrementally (a patch's change touches only the cones it is in): a few ms for a room of 2,000 patches. Per sample, a
// texture's worth of patches (fillPatches: one pass, no allocation).

export const REVEAL = Object.freeze({
  cell: 0.3,           // a patch's side (m); widened so a room never cuts into more than `max`
  max: 2400,           // patches at most
  sigma0: 0.5,         // the prior: nothing known, half a metre either way
  lock: 0.06,          // a patch is known under this sigma (m): log2(0.5 / 0.06) = 3.1 bits gained
  r0: 0.03,            // an eye's noise at 1 m, facing it, on its cone's axis (m)
  cone: 0.42,          // an eye's half-angle (rad, ~24 degrees)
  eyeHeight: 2.0,      // the eyes look from this high over the floor: above the room, as the player looks down on the table
  eyes: 3,             // looks per step: the three eye-stalks (lyssajudron.mjs EYES)
  dark: 4,             // beats of her alone before the first look: one bar
  minBeats: 28,        // the reveal is slow on purpose: a quick room is stretched to this many beats (a look every 2nd beat, ...)
  maxSteps: 60,        // looks stop here; a piece not locked by then locks on the last
  pieceLock: 0.86,     // a piece's certainty on its click
  done: 0.95,          // the whole room's certainty at which the looking stops (once every piece is locked)
  bins: [28, 7],       // the candidate gazes: azimuth x elevation bins round the eye
  turn: 0.12,          // an eye prefers to sweep: its score loses this share per half-turn from its last look
});
export const SOLID = Object.freeze([0.5, 0.92]);   // a piece's solid dissolves in from this certainty to that (terrain-layer.mjs), its splats fade as it does

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
export const solidOf = (level) => smooth((level - SOLID[0]) / (SOLID[1] - SOLID[0]));

function inside(ring, x, z) {   // ray casting on the floor ring [[x, z], ...]
  let k = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i], [xj, zj] = ring[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) k = !k;
  }
  return k;
}

/** patchesOf(R, L, {cell, max}): the held room's surfaces as patches {i, piece, kind, c, n, u, v, hu, hv, area, wall, y}: the floor (cells of a grid
 *  along the longest wall whose centre is inside the ring), each held wall's inner face (cut round its openings), each held thing's top and four sides.
 *  piece: 'board' | 'wall:<id>' | 'thing:<id>'; wall: the wall's index in R.walls (-1 else); y: height over the floor. Only what twin.model() hands over
 *  (HELD, his 01:4x rule): a guess is never a patch. */
export function patchesOf(R, L, { cell = REVEAL.cell, max = REVEAL.max } = {}) {
  if (!R?.walls?.length) return [];
  let c = cell, P = cut(R, L, c);
  for (let k = 0; k < 6 && P.length > max; k++) { c *= Math.sqrt(P.length / max) * 1.03; P = cut(R, L, c); }
  return P.length > max ? P.slice(0, max) : P;
}
function cut(R, L, cell) {
  const P = [], push = (p) => { p.i = P.length; p.area = 4 * p.hu * p.hv; P.push(p); };
  const floor = R.floor;
  // the floor: a grid along the longest wall
  const W = [...R.walls].sort((a, b) => b.len - a.len)[0], U = [W.u[0], W.u[2]], V = [-U[1], U[0]];
  if (Array.isArray(R.ring) && R.ring.length >= 3) {
    const st = R.ring.map(([x, z]) => [x * U[0] + z * U[1], x * V[0] + z * V[1]]);
    const s0 = Math.min(...st.map((p) => p[0])), s1 = Math.max(...st.map((p) => p[0])), t0 = Math.min(...st.map((p) => p[1])), t1 = Math.max(...st.map((p) => p[1]));
    const ns = Math.max(1, Math.round((s1 - s0) / cell)), nt = Math.max(1, Math.round((t1 - t0) / cell)), ds = (s1 - s0) / ns, dt = (t1 - t0) / nt;
    for (let a = 0; a < ns; a++) for (let b = 0; b < nt; b++) {
      const s = s0 + (a + 0.5) * ds, t = t0 + (b + 0.5) * dt, x = U[0] * s + V[0] * t, z = U[1] * s + V[1] * t;
      if (!inside(R.ring, x, z)) continue;
      push({ piece: 'board', kind: 'floor', c: [x, floor, z], n: [0, 1, 0], u: [U[0], 0, U[1]], v: [V[0], 0, V[1]], hu: ds / 2, hv: dt / 2, wall: -1, y: 0 });
    }
  }
  // the walls: each inner face, round its openings (the openings are holes: nothing there to know)
  R.walls.forEach((w, wi) => {
    const h = w.height, cuts = (L?.openings || []).filter((o) => o.wall === w.id).map((o) => {
      const s = (o.at[0] - w.a[0]) * w.u[0] + (o.at[2] - w.a[2]) * w.u[2], y = o.at[1] - w.floor;
      return { s0: s - o.width / 2, s1: s + o.width / 2, y0: y - o.height / 2, y1: y + o.height / 2 };
    });
    const ns = Math.max(1, Math.round(w.len / cell)), ny = Math.max(1, Math.round(h / cell)), ds = w.len / ns, dy = h / ny;
    for (let a = 0; a < ns; a++) for (let b = 0; b < ny; b++) {
      const s = (a + 0.5) * ds, y = (b + 0.5) * dy;
      if (cuts.some((k) => s > k.s0 && s < k.s1 && y > k.y0 && y < k.y1)) continue;
      push({ piece: `wall:${w.id}`, kind: 'wall', c: [w.a[0] + w.u[0] * s, w.floor + y, w.a[2] + w.u[2] * s], n: [w.n[0], 0, w.n[2]], u: [w.u[0], 0, w.u[2]], v: [0, 1, 0], hu: ds / 2, hv: dy / 2, wall: wi, y });
    }
  });
  // the things: each box's top and four sides (its own frame: +x [cos, 0, -sin], +z [sin, 0, cos])
  for (const t of L?.things || []) {
    if (!Array.isArray(t?.at) || !Array.isArray(t?.size)) continue;
    const co = Math.cos(t.yaw || 0), si = Math.sin(t.yaw || 0), ex = [co, 0, -si], ez = [si, 0, co], ey = [0, 1, 0], [hx, hy, hz] = t.size.map((x) => x / 2);
    const faces = [[ey, hy, ex, hx, ez, hz], [ex, hx, ez, hz, ey, hy], [ex.map((x) => -x), hx, ez, hz, ey, hy], [ez, hz, ex, hx, ey, hy], [ez.map((x) => -x), hz, ex, hx, ey, hy]];
    for (const [n, hn, A, ha, B, hb] of faces) {
      const na = Math.max(1, Math.round((2 * ha) / cell)), nb = Math.max(1, Math.round((2 * hb) / cell)), da = (2 * ha) / na, db = (2 * hb) / nb;
      for (let a = 0; a < na; a++) for (let b = 0; b < nb; b++) {
        const sa = -ha + (a + 0.5) * da, sb = -hb + (b + 0.5) * db, c = [0, 1, 2].map((k) => t.at[k] + n[k] * hn + A[k] * sa + B[k] * sb);
        push({ piece: `thing:${t.id}`, kind: 'thing', c, n: [...n], u: [...A], v: [...B], hu: da / 2, hv: db / 2, wall: -1, y: c[1] - floor });
      }
    }
  }
  return P;
}

/** planReveal(R, L, {eye, start, ...REVEAL}) -> the plan: the patches, the looks of every step, each patch's sigma after every step, each piece's
 *  certainty after every step and its lock beat, the room's certainty and bits per step. eye: her home ([x, y, z]; its x and z: the eyes look from
 *  eyeHeight over the floor there); a home outside the room's ring looks from the ring's centre (the walls' inner faces turn toward the inside).
 *  start: the beat of the first look. */
export function planReveal(R, L, opts = {}) {
  const o = { ...REVEAL, ...opts }, P = patchesOf(R, L, o), N = P.length;
  if (!N) return null;
  let E = Array.isArray(o.eye) && o.eye.every(num) ? [o.eye[0], R.floor + o.eyeHeight, o.eye[2]] : [R.centre[0], R.floor + o.eyeHeight, R.centre[2]];
  if (Array.isArray(R.ring) && R.ring.length >= 3 && !inside(R.ring, E[0], E[2])) E = [R.centre[0], E[1], R.centre[2]];
  // each patch seen from the eye: its direction, distance, incidence
  const dir = new Float64Array(N * 3), dist = new Float64Array(N), inc = new Float64Array(N);
  for (const p of P) {
    const d = [p.c[0] - E[0], p.c[1] - E[1], p.c[2] - E[2]], L2 = Math.hypot(d[0], d[1], d[2]) || 1e-6;
    dir[p.i * 3] = d[0] / L2; dir[p.i * 3 + 1] = d[1] / L2; dir[p.i * 3 + 2] = d[2] / L2; dist[p.i] = L2;
    inc[p.i] = -(p.n[0] * d[0] + p.n[1] * d[1] + p.n[2] * d[2]) / L2;   // cos of the angle between its normal and the way back to the eye
  }
  // the candidate gazes: the patches' directions binned round the eye (azimuth x elevation), each bin's mean direction
  const [na, ne] = o.bins, bins = new Map();
  for (let i = 0; i < N; i++) {
    const x = dir[i * 3], y = dir[i * 3 + 1], z = dir[i * 3 + 2];
    const a = Math.min(na - 1, Math.floor(((Math.atan2(x, z) + Math.PI) / (2 * Math.PI)) * na)), e = Math.min(ne - 1, Math.floor(((Math.asin(clamp(y, -1, 1)) + Math.PI / 2) / Math.PI) * ne));
    const k = a * ne + e; let b = bins.get(k); if (!b) bins.set(k, (b = [0, 0, 0, 0])); b[0] += x; b[1] += y; b[2] += z; b[3]++;
  }
  const cands = [...bins.keys()].sort((a, b) => a - b).map((k) => { const b = bins.get(k), l = Math.hypot(b[0], b[1], b[2]) || 1; return [b[0] / l, b[1] / l, b[2] / l]; });
  // each candidate's cone: the facing patches within the half-angle, each with its look's noise r^2
  const cosCone = Math.cos(o.cone), conePatch = [], coneR2 = [], memberOf = Array.from({ length: N }, () => []);
  cands.forEach((g, k) => {
    const ids = [], r2s = [];
    for (let i = 0; i < N; i++) {
      if (inc[i] <= 0.05) continue;   // it turns its back on the eye
      const cosA = g[0] * dir[i * 3] + g[1] * dir[i * 3 + 1] + g[2] * dir[i * 3 + 2]; if (cosA < cosCone) continue;
      const a = Math.acos(clamp(cosA, -1, 1)) / o.cone, r = (o.r0 * dist[i] * (1 + 2 * a * a)) / Math.max(inc[i], 0.25);
      memberOf[i].push(k, ids.length); ids.push(i); r2s.push(r * r);
    }
    conePatch.push(Int32Array.from(ids)); coneR2.push(Float64Array.from(r2s));
  });
  // the pieces: their patches and areas. A patch no eye can see from the hover (its back to it, or in no cone) is not counted in its piece's certainty
  // nor the room's: it locks with its piece (the far side of a box, a face turned to the wall)
  const keys = [...new Set(P.map((p) => p.piece))], pieceOf = new Int32Array(N), areaOf = new Float64Array(keys.length), seeable = new Uint8Array(N);
  for (const p of P) { const k = keys.indexOf(p.piece); pieceOf[p.i] = k; seeable[p.i] = memberOf[p.i].length ? 1 : 0; if (seeable[p.i]) areaOf[k] += p.area; }
  const total = areaOf.reduce((a, b) => a + b, 0);
  // the greedy looks
  const s0 = o.sigma0, v = new Float64Array(N).fill(s0 * s0), need = Math.log(s0 / o.lock), gainOf = (vi, r2) => 0.5 * Math.log2(1 + vi / r2);
  const G = new Float64Array(cands.length);
  for (let k = 0; k < cands.length; k++) { let g = 0; const ids = conePatch[k], r2 = coneR2[k]; for (let m = 0; m < ids.length; m++) g += gainOf(v[ids[m]], r2[m]); G[k] = g; }
  const certainty = (vi) => clamp(Math.log(s0 / Math.sqrt(vi)) / need, 0, 1);
  const sigma = [Float32Array.from(v, (x) => Math.sqrt(x))], levels = [new Float32Array(keys.length)], overall = [0], bits = [0], looks = [], firstStep = new Int16Array(N).fill(-1);
  const lockStep = new Int32Array(keys.length).fill(-1), last = new Array(o.eyes).fill(null);
  for (let j = 0; j < o.maxSteps; j++) {
    const step = [];
    for (let e = 0; e < o.eyes; e++) {
      let best = -1, bestScore = 1e-9;
      for (let k = 0; k < cands.length; k++) {
        if (G[k] <= 1e-9) continue;
        const l = last[e], turn = l ? Math.acos(clamp(l[0] * cands[k][0] + l[1] * cands[k][1] + l[2] * cands[k][2], -1, 1)) / Math.PI : 0, score = G[k] * (1 - o.turn * turn);
        if (score > bestScore) { bestScore = score; best = k; }
      }
      if (best < 0) break;
      const ids = conePatch[best], r2 = coneR2[best]; let got = 0, tw = 0; const target = [0, 0, 0];
      for (let m = 0; m < ids.length; m++) {
        const i = ids[m], old = v[i], nv = (old * r2[m]) / (old + r2[m]), gi = gainOf(old, r2[m]); got += gi;
        target[0] += P[i].c[0] * gi; target[1] += P[i].c[1] * gi; target[2] += P[i].c[2] * gi; tw += gi;
        if (firstStep[i] < 0) firstStep[i] = j;
        const mem = memberOf[i];   // every cone this patch is in: its gain there moves with it
        for (let q = 0; q < mem.length; q += 2) { const kk = mem[q], mm = mem[q + 1], rr = coneR2[kk][mm]; G[kk] += gainOf(nv, rr) - gainOf(old, rr); }
        v[i] = nv;
      }
      last[e] = cands[best];
      step.push({ eye: e, dir: [...cands[best]], target: tw > 0 ? target.map((x) => x / tw) : [E[0] + cands[best][0], E[1] + cands[best][1], E[2] + cands[best][2]], bits: got, patches: ids.length });
    }
    if (!step.length) break;   // nothing left to learn from here
    looks.push(step);
    const sg = Float32Array.from(v, (x) => Math.sqrt(x)), lv = new Float32Array(keys.length); let all = 0;
    for (let i = 0; i < N; i++) { if (!seeable[i]) continue; const q = certainty(v[i]) * P[i].area; lv[pieceOf[i]] += q; all += q; }
    const room = all / (total || 1);
    for (let k = 0; k < keys.length; k++) { lv[k] = areaOf[k] > 0 ? lv[k] / areaOf[k] : room; if (lockStep[k] < 0 && lv[k] >= o.pieceLock) lockStep[k] = j + 1; }   // a piece no eye sees follows the room
    sigma.push(sg); levels.push(lv); overall.push(room); bits.push(step.reduce((a, s) => a + s.bits, 0));
    if (lockStep.every((x) => x >= 0) && overall[overall.length - 1] >= o.done) break;
  }
  const steps = looks.length;
  for (let k = 0; k < keys.length; k++) if (lockStep[k] < 0) lockStep[k] = steps;   // the last step locks what the looking left
  const stride = Math.max(1, Math.ceil(o.minBeats / Math.max(1, steps))), start = num(o.start) ? Math.round(o.start) : 0;
  const beatOfStep = (j) => start + j * stride;
  const pieces = keys.map((key, k) => ({ key, area: areaOf[k], lockStep: lockStep[k], lockBeat: beatOfStep(lockStep[k]) }));
  return { start, stride, steps, end: beatOfStep(steps) + 1, eye: E, sigma0: s0, patches: P, pieceOf, pieces, sigma, levels, overall, bits, looks, firstStep, candidates: cands.length,
    beatOfStep, totalBits: bits.reduce((a, b) => a + b, 0) };
}

/** revealAt(plan, bt): where the plan is at the absolute beat bt (float, the twin's grid): {x: the step position (float), j: the step whose update eases
 *  now, e: that ease (0..1 over the step's first beat), overall: the room's certainty, stands: the share of it that stands solid, light: the table's
 *  light (0.03 while nothing stands, 1 when all does), looking: a look sounds now, done}. */
export function revealAt(plan, bt) {
  if (!plan || !num(bt)) return { x: -1, j: -1, e: 0, overall: 0, stands: 1, light: 1, looking: false, done: true, before: false };
  const x = (bt - plan.start) / plan.stride;
  if (x < 0) return { x, j: -1, e: 0, overall: 0, stands: 0, light: 0.03, looking: false, done: false, before: true };
  const j = Math.min(plan.steps - 1, Math.floor(x)), e = x >= plan.steps ? 1 : smooth(bt - plan.beatOfStep(j)), o0 = plan.overall[j], o1 = plan.overall[j + 1] ?? o0;
  const overall = o0 + (o1 - o0) * e, done = bt >= plan.end + 2, L0 = plan.levels[j], L1 = plan.levels[j + 1] || L0;
  let solid = 0, area = 0;   // the light follows what stands: the pieces' solids, area-weighted (the room stays a cloud in the dark until its stone condenses)
  for (let k = 0; k < plan.pieces.length; k++) { const p = plan.pieces[k], l = bt >= p.lockBeat + 1 ? 1 : L0[k] + (L1[k] - L0[k]) * e; solid += solidOf(l) * p.area; area += p.area; }
  const stands = area > 0 ? solid / area : overall;
  return { x, j, e, overall, stands, light: 0.03 + 0.97 * smooth(stands), looking: x < plan.steps, done, before: false };
}
/** pieceLevel(plan, key, bt): a piece's certainty at bt (1 for a piece the plan does not know: it stands). */
export function pieceLevel(plan, key, bt) {
  if (!plan) return 1; const k = plan.pieces.findIndex((p) => p.key === key); if (k < 0) return 1;
  const r = revealAt(plan, bt); if (r.before) return 0; if (r.x >= plan.steps) return Math.max(plan.levels[plan.steps][k], bt >= plan.pieces[k].lockBeat ? 1 : 0);
  const a = plan.levels[r.j][k], b = plan.levels[r.j + 1][k], l = a + (b - a) * r.e;
  return bt >= plan.pieces[k].lockBeat + 1 ? Math.max(l, 1) : l;   // a locked piece stands whole a beat after its click
}
/** fillPatches(plan, bt, out): each patch's state as 4 bytes (RGBA) into out (a Uint8Array of 4 * patches at least): R its sigma over sigma0, G the
 *  flash of the bits its last looks gained (decaying over two beats), B seen (eased in on its first look), A its piece's solid (solidOf). */
export function fillPatches(plan, bt, out, solids = null) {
  const N = plan.patches.length, r = revealAt(plan, bt);
  if (r.before) { out.fill(0, 0, N * 4); for (let i = 0; i < N; i++) out[i * 4] = 255; return r; }
  const after = r.x >= plan.steps, j = r.j, S0 = plan.sigma[after ? plan.steps : j], S1 = after ? S0 : plan.sigma[j + 1], e = after ? 1 : r.e, inv = 1 / plan.sigma0;
  const bj = plan.beatOfStep(j), dtj = bt - bj, dtp = bt - plan.beatOfStep(j - 1), Sp = j > 0 ? plan.sigma[j - 1] : null;
  const k1 = Math.exp(-1.6 * Math.max(0, dtj)), k0 = Math.exp(-1.6 * Math.max(0, dtp));
  const solid = solids || plan.pieces.map((p) => solidOf(pieceLevel(plan, p.key, bt)));
  for (let i = 0; i < N; i++) {
    const s = S0[i] + (S1[i] - S0[i]) * e, f0 = plan.firstStep[i];
    const g1 = after ? 0 : Math.log2(S0[i] / Math.max(1e-6, S1[i])) * k1 * Math.min(1, e * 4), g0 = Sp && !after ? Math.log2(Sp[i] / Math.max(1e-6, S0[i])) * k0 : 0;
    const seen = f0 < 0 ? 0 : f0 < j ? 1 : f0 === j ? e : after ? 1 : 0;
    out[i * 4] = Math.round(clamp(s * inv, 0, 1) * 255); out[i * 4 + 1] = Math.round(clamp((g0 + g1) / 2.2, 0, 1) * 255);
    out[i * 4 + 2] = Math.round(clamp(seen, 0, 1) * 255); out[i * 4 + 3] = Math.round(clamp(solid[plan.pieceOf[i]], 0, 1) * 255);
  }
  return r;
}
/** looksAt(plan, bt): the looks sounding now (the step whose beat this is), each with its fade (1 on the beat, 0 a beat later). */
export function looksAt(plan, bt) {
  const r = revealAt(plan, bt); if (r.before || r.x >= plan.steps) return [];
  const t = bt - plan.beatOfStep(r.j); if (t < 0 || t >= 1) return [];
  return plan.looks[r.j].map((l) => ({ ...l, fade: (1 - t) * (1 - t), beat: plan.beatOfStep(r.j) }));
}
/** lockBeats(plan): each piece's click beat by its key. */
export const lockBeats = (plan) => new Map((plan?.pieces || []).map((p) => [p.key, p.lockBeat]));

/** condensePlan(keys, start, {stride}): THE HAND-OFF FROM THE FIRE (fire-layer.mjs, twin.mjs scheduleCondense): once his phone's walk has burned the room in
 *  and the Mac's compile lands, the held pieces condense into stone one a beat, in the order given (the most burned first), each over its own beat, and
 *  click on the next. A plan of the same shape as planReveal's (revealAt, pieceLevel and the terrain read it alike), with no patches and no looks: the
 *  information was the phone's, this is only where it settles. */
export function condensePlan(keys, start, { stride = 1 } = {}) {
  const K = keys.length, steps = Math.max(1, K), s0 = num(start) ? Math.round(start) : 0;
  const levels = Array.from({ length: steps + 1 }, (_, j) => Float32Array.from(keys, (_, k) => (j > k ? 1 : 0)));
  const pieces = keys.map((key, k) => ({ key, area: 1, lockStep: k + 1, lockBeat: s0 + (k + 1) * stride }));
  const overall = Array.from({ length: steps + 1 }, (_, j) => Math.min(1, j / Math.max(1, K)));
  return { start: s0, stride, steps, end: s0 + steps * stride + 1, eye: null, sigma0: REVEAL.sigma0, patches: [], pieceOf: new Int32Array(0), pieces, sigma: [], levels, overall,
    bits: [], looks: Array.from({ length: steps }, () => []), firstStep: new Int16Array(0), candidates: 0, beatOfStep: (j) => s0 + j * stride, totalBits: 0, condense: true };
}
