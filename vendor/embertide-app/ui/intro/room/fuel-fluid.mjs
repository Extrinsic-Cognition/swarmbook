// fuel-fluid.mjs · THE FUEL IS A FLUID (Oct 14 2026 19:xx WEST): the fuel in her unit0 as a viscous liquid that the mint's drops fall into and that
// the calls burn, the same on every glass.
//
// His words, Oct 14 2026 19:08 WEST: "the thing missing is that there is no fucking link between the fucking liquor dropping thing logic i. asked to add
// when buying nfts of grabity or floating; AND: THE FUCKING LYSSAJUDRON JUMPING IN FRONT OF ME NOW DUDE... I SHOULD BE SEEING IN THE ANAMORPHIC SHADOW OF
// HIS THERE I SHOULD SEE THE FUCKING FUEL LIKE A FLUID SUBJECT TO CAUSTICS AND PHYSICS LIKE FUCKING VISCOUS GUMMY BEARS AND LIQUIDS IN GENERAL THAT DESCEND
// FROM GRABITY AND HAVE SHADERS". The liquor's law is the mint lab's (dyson-society/lab/mint-gravity.mjs, syrup-glass.html, his Oct 14 03:09 to 05:27:
// a drop is a purchase; gold buys gravity and is a heavy drop that sets as a deep amber well; bronze floats and is a small drop that floats as a pale
// film). The fuel's is the purse's (house/purse: the tank's level, the calls that burn it; lyssajudron-purse.mjs). Until tonight the two never met: the
// lab's pouch fell only on its own buttons, and her fuel was a painted line that sloshed by two sines.
//
// THE LAW (pure; fuel-fluid.test.mjs holds it). A particle fluid in unit0's disc (radius 1, centre 0, y down, gravity down the square): Clavet, Beaudoin
// and Poulin's viscoelastic SPH (2005), the gummy one: gravity, viscosity impulses between approaching pairs, springs inside a gold drop that yield and
// let go, double density relaxation (pressure and near pressure, which makes the surface hold together), the wall of the disc. Three liquids and a fire:
//   fuel   the tank (mass 1, ale): as many particles as the tank's level fills of the disc in the CANONICAL lattice (a level is a height, as the old gauge);
//   gold   a Golden Aiolos sale ($1,000, the hexagon with gravity): a blob of GOLD.n heavy particles (mass GOLD.m) bound by springs, falling from above
//          the surface: it sinks through the fuel and sets at the floor as an amber well;
//   bronze a Bronze sale ($10, the floating hexagon): BRONZE.n light particles (BRONZE.m) that splash and float as a pale film on the top;
//   ember  fuel that burns: when the level falls (the calls spent it) the topmost fuel turns to embers that rise and go out, and every call row lets a
//          few sparks fly from the surface where its id puts them. BURN MY COSMOS is the fuel burning: his Sept 22 "the fuel in the thing there floating".
// A heavier particle moves less under the same pressure (each pair's correction is split by the other's mass): gold goes down, bronze comes up, with no
// rule of its own for either.
//
// THE SAME ON EVERY GLASS (C-2, C-5; the purse's own rule for a rising number): a cause plays from the first genesis beat at or after its own time, in
// fixed steps of STEP_MS, with nothing but + - * / and sqrt on float64 (no sine, no exp, no random: a JS engine's libm may differ in the last bit, IEEE
// arithmetic does not), in one order. So two glasses that heard the same causes hold the same bytes at the same house time, whatever their frame rates.
// A burst of causes is one window: each cause enters at its own beat, and the window ends WINDOW_MS after the last cause's beat, the last EASE_MS of it
// SHOWING the fluid blended to the canonical lattice of what is now in her (gold under fuel under bronze, each row filled from the middle out; the fluid
// itself plays on untouched: THE EASE IS WHAT IS SHOWN, below). AT REST THE
// FLUID IS THAT LATTICE, a function of the composition alone: a glass that loads later draws the same picture, and one that loads inside a window starts
// it from the lattice the window started from and plays it to the house time.
//
// COST: nothing at rest (no step, no allocation; view() hands the same arrays with the same version). Inside a window one step is a grid of cell H over
// at most N_MAX particles and three passes over the pairs: 350 to 610 us a step for 163 to 182 particles on the serving Mac at nice 19 and load 18 (Oct 14
// 19:3x, the lane's harness), so 4 to 7 % of one core while a window plays; a window of 3.6 s is 432 steps.
import { GENESIS_MS, GENESIS_BEAT_MS, smooth } from './one-law.mjs';

export const STEP_MS = 1000 / 120, STEP_S = STEP_MS / 1000;   // the law's step: 120 a second on every glass, whatever it paints at
export const REPLAY_CHECKPOINTS = 32, REPLAY_CAUSES = 256;
export const WINDOW_MS = 3600, EASE_MS = 900;                  // a window lasts this long after its last cause's beat; its last EASE_MS settle to the lattice
export const N_MAX = 360;                                      // particles at most, embers included (the lattice holds about 300: the liquor makes room for itself)
export const H = 0.22, SPACING = 0.11, RIM = 0.03;             // interaction radius, the lattice's spacing (H / 2: one ring of neighbours), the wall's skin
export const G = 9;                                            // gravity, disc radii a second squared: a drop falls the disc in about 0.65 s
// THE REST DENSITY IS THE LATTICE'S OWN (Oct 14 2026 20:4x WEST, the proof's pictures): the density (sum of (1 - r / H)^2 over the neighbours) of a particle
// inside the canonical lattice, so the picture at rest is the fluid's own equilibrium and a window starts from no pressure at all. The first cut had 1,
// about 0.62 of it: every window opened with the whole tank erupting to fill her unit0 (0.74 of the disc read as liquid at rest, 0.94 a second into a
// sale, 0.91 for a call's sparks alone), and settled back only at the ease.
const latticeDensity = (s, h) => { let rho = 0; for (const r of [s, s * Math.sqrt(3), 2 * s]) if (r < h) rho += 6 * (1 - r / h) * (1 - r / h); return rho; };
export const RHO0 = latticeDensity(SPACING, H), K = 1200, K_NEAR = 900;   // rest density (1.6077), stiffness, near stiffness: stiff enough that gravity squeezes
                                                               // the moving fluid's surface less than a third of a lattice row under the rest one (the proof's harness)
export const TENSION = 0.5;                                    // how much of a thinned particle's pull (pressure under the rest density) holds the surface
export const MAX_SHIFT = SPACING * 0.35;                       // the most the relaxation moves a particle in one step
export const KIND = Object.freeze({ fuel: 0, gold: 1, bronze: 2, ember: 3 });
export const MASS = Object.freeze([1, 2.2, 0.42, 0.1]);
export const VISC = Object.freeze([4, 16, 5, 0]);              // sigma, the linear viscosity of each liquid (a pair takes the mean): ale, honey, a thin film
export const GOLD = Object.freeze({ n: 16, m: 2.2, spring: 2600, yieldAt: 0.12, plastic: 1.6, hold_ms: 2200, fade_ms: 700 });   // a gummy blob: springs that yield, then let go
export const BRONZE = Object.freeze({ n: 5, m: 0.42 });
export const LIQUOR_MAX = 112;                                 // the liquor's particles at most: a newer drop takes the place of the oldest of its metal
export const EMBER = Object.freeze({ life_ms: 1500, rise: 1.4, sparks: 3 });

const fin = (v) => typeof v === 'number' && Number.isFinite(v);
const beatAfter = (ms) => Math.ceil((ms - GENESIS_MS) / GENESIS_BEAT_MS), beatTime = (b) => GENESIS_MS + b * GENESIS_BEAT_MS;
/** hash01(s): FNV-1a of a string, in [0, 1): where a drop falls and a spark flies, from its own id, the same on every glass */
export function hash01(s) { let h = 0x811c9dc5; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0) / 4294967296; }

/** lattice(): the canonical slots, bottom row first and each row from the middle out: [{x, y}] inside the disc's skin. Built once. */
let LATTICE = null;
export function lattice() {
  if (LATTICE) return LATTICE;
  const out = [], dy = SPACING * 0.8660254037844386, lim = 1 - RIM;
  for (let row = 0; ; row++) {
    const y = lim - SPACING * 0.5 - row * dy; if (y < -lim) break;
    const off = row % 2 ? SPACING * 0.5 : 0, slots = [];
    for (let k = -10; k <= 10; k++) { const x = off + k * SPACING; if (x * x + y * y <= (lim - SPACING * 0.35) * (lim - SPACING * 0.35)) slots.push({ x, y }); }
    slots.sort((a, b) => (Math.abs(a.x) - Math.abs(b.x)) || (a.x - b.x));
    out.push(...slots);
  }
  return (LATTICE = out);
}
/** fuelCount(level, top): the fuel particles a tank level holds: the lattice's slots under the surface the old gauge puts at that level (the floor at
 *  y = 1, the ceiling at y = -top, top in disc radii: 1 for the shell's top), in an empty tank. A level is a height, never a count of its own. */
export function fuelCount(level, top = 1) {
  if (!fin(level) || level <= 0) return 0;
  const ys = 1 - Math.min(1, level) * (1 + (fin(top) ? top : 1)); let n = 0;
  for (const s of lattice()) if (s.y >= ys) n++;
  return n;
}
export const capacity = () => lattice().length;   // the slots of the disc: what her unit0 holds when full

/** createFuel() -> { compose, cause, view, moving, state }. One per page: both painters of a page share it (the purse's law holds it). */
export function createFuel() {
  const P = { n: 0, x: new Float64Array(N_MAX), y: new Float64Array(N_MAX), px: new Float64Array(N_MAX), py: new Float64Array(N_MAX), vx: new Float64Array(N_MAX),
    vy: new Float64Array(N_MAX), kind: new Uint8Array(N_MAX), life: new Float64Array(N_MAX), drop: new Int32Array(N_MAX) };
  const S = { comp: { fuel: 0, gold: [], bronze: [] }, at: null, win: null, queue: [], version: 0, steps: 0, springs: [], seen: new Set(), top: 1, view: null, history: [], checkpoints: [], recovery: null };
  // comp: what is in her at rest (fuel: a count; gold, bronze: the drops' ids, oldest first). win: the window being played {t0, end, step, from} or null.
  const total = (c) => c.fuel + c.gold.length * GOLD.n + c.bronze.length * BRONZE.n;
  function layout(c) {   // the canonical picture of a composition: gold, then fuel, then bronze, slot by slot from the floor up
    const L = lattice(); let k = 0; P.n = 0;
    const put = (kind, count, id) => { for (let i = 0; i < count && k < L.length && P.n < N_MAX; i++, k++) { const j = P.n++; P.x[j] = P.px[j] = L[k].x; P.y[j] = P.py[j] = L[k].y; P.vx[j] = P.vy[j] = 0; P.kind[j] = kind; P.life[j] = 0; P.drop[j] = id; } };
    c.gold.forEach((id, i) => put(KIND.gold, GOLD.n, i + 1)); put(KIND.fuel, c.fuel, 0); c.bronze.forEach((id, i) => put(KIND.bronze, BRONZE.n, -(i + 1)));
    S.springs = []; S.version++;
  }
  function trimLiquor(c) {   // the liquor keeps LIQUOR_MAX particles at most: the oldest drop of the newcomer's metal makes room
    while (c.gold.length * GOLD.n + c.bronze.length * BRONZE.n > LIQUOR_MAX && (c.gold.length || c.bronze.length)) (c.gold.length * GOLD.n >= c.bronze.length * BRONZE.n ? c.gold : c.bronze).shift();
    while (total(c) > capacity() && c.fuel > 0) c.fuel--;
  }
  /** compose(level, {top, drops}): what is in her when nothing is playing (a glass's first reading, or the state a window must start from). */
  function compose(level, { top = 1, drops = [], at_ms = null } = {}) {
    S.win = null; S.queue = []; S.history = []; S.checkpoints = []; S.recovery = null; S.seen.clear(); S.at = fin(at_ms) ? at_ms : null;
    S.top = fin(top) ? top : 1;
    const c = { fuel: fuelCount(level, S.top), gold: [], bronze: [] };   // every drop the reading lists, in its order: they are what is in her (and history)
    for (const d of drops) { if (!d || !d.id) continue; S.seen.add(d.id); (d.metal === 'gold' ? c.gold : c.bronze).push(d.id); }
    trimLiquor(c); S.comp = c; layout(c); checkpoint(fin(at_ms) ? at_ms : -Infinity);
  }
  const cloneComp = (c) => ({ fuel: c.fuel, gold: [...c.gold], bronze: [...c.bronze] });
  const fields = ['x', 'y', 'px', 'py', 'vx', 'vy', 'kind', 'life', 'drop'];
  const key = (n) => n.kind + ':' + (fin(n.seq) ? 'seq:' + n.seq : n.id || JSON.stringify([n.at_ms, n.level]));
  const order = (a, b) => a.t0 - b.t0 || a.at_ms - b.at_ms || ((a.seq || 0) - (b.seq || 0)) || (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0);
  function checkpoint(time) {
    if (S.checkpoints.at(-1)?.time === time) return;
    S.checkpoints.push({ time, n: P.n, comp: cloneComp(S.comp), win: S.win ? { ...S.win } : null,
      springs: S.springs.map((s) => ({ ...s })), arrays: fields.map((k) => P[k].slice(0, P.n)) });
    if (S.checkpoints.length > REPLAY_CHECKPOINTS) {
      S.checkpoints.shift(); S.history = S.history.filter((n) => n.t0 >= S.checkpoints[0].time);
    }
  }
  function rewind(t0) {
    let index = S.checkpoints.length - 1;
    while (index >= 0 && S.checkpoints[index].time > t0) index--;
    if (index < 0) return false;
    const c = S.checkpoints[index]; P.n = c.n;
    fields.forEach((k, i) => P[k].set(c.arrays[i]));
    S.comp = cloneComp(c.comp); S.win = c.win ? { ...c.win } : null;
    S.springs = c.springs.map((s) => ({ ...s }));
    S.queue = S.history.filter((n) => n.t0 >= c.time).sort(order);
    S.checkpoints.length = index + 1; S.at = null; S.version++;
    return true;
  }
  /** A late cause replays from an exact retained pre-cause checkpoint. compose(..., {at_ms})
   * installs an authoritative REST snapshot boundary; history before it is unavailable.
   * false plus state().recovery requests recovery, never fabricates the missing trajectory. */
  function cause(note, now = null) {
    if (!note || !fin(note.at_ms) || !['drop', 'level', 'burn'].includes(note.kind)) return false;
    if (note.kind === 'level' && !fin(note.level)) return false;
    if (note.seq != null && (!Number.isSafeInteger(note.seq) || note.seq < 0)) return false;
    const id = key(note);
    if (S.history.some((n) => key(n) === id) || (note.kind === 'drop' && (!note.id || S.seen.has(note.id)))) return false;
    const t0 = beatTime(beatAfter(note.at_ms)), n = { ...note, t0 };
    const boundary = S.checkpoints[0]?.time ?? -Infinity;
    if (t0 < boundary || S.history.length >= REPLAY_CAUSES) {
      S.recovery = { reason: t0 < boundary ? 'history-unavailable' : 'history-capacity', at_ms: note.at_ms, boundary_ms: boundary }; return false;
    }
    if (note.kind === 'drop') S.seen.add(note.id);
    // Before any timed execution, legacy callers may seed known historical composition.
    if (!S.history.length && S.at == null && (!fin(now) || now >= t0 + WINDOW_MS)) {
      applyAtRest(n); S.checkpoints = []; checkpoint(boundary); return true;
    }
    if (!S.checkpoints.length) checkpoint(-Infinity);
    S.history.push(n); S.history.sort(order);
    const present = S.at;
    if (present != null && t0 <= present) {
      rewind(t0); play(present);
    } else { S.queue.push(n); S.queue.sort(order); }
    return true;
  }
  function applyAtRest(n) {
    const c = S.comp;
    if (n.kind === 'drop') { (n.metal === 'gold' ? c.gold : c.bronze).push(n.id); trimLiquor(c); }
    else if (n.kind === 'level') c.fuel = fuelCount(n.level, S.top);
    if (!S.win) layout(c);
  }
  // ---- one step of the law (gravity, viscosity, springs, relaxation, wall), every particle in index order ----
  const cell = H, grid = new Map();
  function neighbours() {
    grid.clear();
    for (let i = 0; i < P.n; i++) { if (P.kind[i] === KIND.ember || !(P.x[i] * P.x[i] + P.y[i] * P.y[i] < 9)) continue; const k = (Math.floor((P.x[i] + 2) / cell) * 64 + Math.floor((P.y[i] + 2) / cell)); let b = grid.get(k); if (!b) grid.set(k, (b = [])); b.push(i); }
  }
  function forPairs(fn) {
    for (let i = 0; i < P.n; i++) {
      if (P.kind[i] === KIND.ember || !(P.x[i] * P.x[i] + P.y[i] * P.y[i] < 9)) continue;
      const cx = Math.floor((P.x[i] + 2) / cell), cy = Math.floor((P.y[i] + 2) / cell);
      for (let gx = cx - 1; gx <= cx + 1; gx++) for (let gy = cy - 1; gy <= cy + 1; gy++) {
        const b = grid.get(gx * 64 + gy); if (!b) continue;
        for (const j of b) { if (j <= i) continue; const dx = P.x[j] - P.x[i], dy = P.y[j] - P.y[i], r2 = dx * dx + dy * dy; if (r2 >= H * H || r2 < 1e-12) continue; const r = Math.sqrt(r2); fn(i, j, dx / r, dy / r, r, 1 - r / H); }
      }
    }
  }
  const rho = new Float64Array(N_MAX), rhoN = new Float64Array(N_MAX), dX = new Float64Array(N_MAX), dY = new Float64Array(N_MAX);
  function step(ms) {
    const dt = STEP_S, n = P.n;
    for (let i = 0; i < n; i++) {
      if (P.kind[i] === KIND.ember) { P.vy[i] -= EMBER.rise * dt * 3; P.vx[i] *= 0.985; continue; }
      P.vy[i] += G * dt;
    }
    neighbours();
    forPairs((i, j, ux, uy, r, q) => {   // viscosity: an approaching pair loses part of its inward speed, split by mass
      const u = (P.vx[i] - P.vx[j]) * ux + (P.vy[i] - P.vy[j]) * uy; if (u <= 0) return;
      const sigma = (VISC[P.kind[i]] + VISC[P.kind[j]]) * 0.5, I = dt * q * (sigma * u + 0.3 * u * u), mi = MASS[P.kind[i]], mj = MASS[P.kind[j]], w = 1 / (mi + mj);
      P.vx[i] -= I * ux * mj * w; P.vy[i] -= I * uy * mj * w; P.vx[j] += I * ux * mi * w; P.vy[j] += I * uy * mi * w;
    });
    for (let i = 0; i < n; i++) { P.px[i] = P.x[i]; P.py[i] = P.y[i]; P.x[i] += P.vx[i] * dt; P.y[i] += P.vy[i] * dt; }
    for (let s = S.springs.length - 1; s >= 0; s--) {   // the gold blob's springs: elastic, yielding, gone after the drop's hold
      const sp = S.springs[s]; if (ms >= sp.until || sp.L > H * 0.9) { S.springs.splice(s, 1); continue; }   // over, or yielded past the reach of a pair: broken
      const i = sp.i, j = sp.j, dx = P.x[j] - P.x[i], dy = P.y[j] - P.y[i], r = Math.sqrt(dx * dx + dy * dy); if (r < 1e-9) continue;
      const d = GOLD.yieldAt * sp.L; if (r > sp.L + d) sp.L += dt * GOLD.plastic * (r - sp.L - d); else if (r < sp.L - d) sp.L -= dt * GOLD.plastic * (sp.L - d - r);
      const fade = sp.until - ms < GOLD.fade_ms ? (sp.until - ms) / GOLD.fade_ms : 1;   // the blob lets go over its last fade_ms, never at once
      const D = dt * dt * GOLD.spring * fade * (1 - sp.L / H) * (sp.L - r) * 0.5, ux = dx / r, uy = dy / r;
      P.x[i] -= D * ux; P.y[i] -= D * uy; P.x[j] += D * ux; P.y[j] += D * uy;
    }
    neighbours(); rho.fill(0, 0, n); rhoN.fill(0, 0, n);
    forPairs((i, j, ux, uy, r, q) => { const q2 = q * q, q3 = q2 * q; rho[i] += q2; rho[j] += q2; rhoN[i] += q3; rhoN[j] += q3; });
    dX.fill(0, 0, n); dY.fill(0, 0, n);
    forPairs((i, j, ux, uy, r, q) => {   // double density relaxation: each pair is pushed apart (or drawn together) by its pressures, the heavier moving less
      const pi = K * (rho[i] - RHO0), pj = K * (rho[j] - RHO0), p = (pi > 0 ? pi : pi * TENSION) + (pj > 0 ? pj : pj * TENSION), pn = K_NEAR * (rhoN[i] + rhoN[j]), D = dt * dt * (p * q + pn * q * q) * 0.25;
      const mi = MASS[P.kind[i]], mj = MASS[P.kind[j]], w = 2 / (mi + mj);
      dX[i] -= D * ux * mj * w; dY[i] -= D * uy * mj * w; dX[j] += D * ux * mi * w; dY[j] += D * uy * mi * w;
    });
    for (let i = 0; i < n; i++) {   // applied together, never more than MAX_SHIFT a step: a crowded particle eases out over a few steps instead of flying
      const d2 = dX[i] * dX[i] + dY[i] * dY[i]; if (d2 > MAX_SHIFT * MAX_SHIFT) { const k = MAX_SHIFT / Math.sqrt(d2); dX[i] *= k; dY[i] *= k; }
      P.x[i] += dX[i]; P.y[i] += dY[i];
    }
    const lim = 1 - RIM;
    for (let i = 0; i < n; i++) {   // the wall: back inside the disc, its tangential speed rubbed a little; then the velocity from the move
      if (P.kind[i] !== KIND.ember) { const r2 = P.x[i] * P.x[i] + P.y[i] * P.y[i]; if (r2 > lim * lim) { const r = Math.sqrt(r2), k = lim / r; P.x[i] *= k; P.y[i] *= k; P.px[i] += (P.x[i] - P.px[i]) * 0.1; P.py[i] += (P.y[i] - P.py[i]) * 0.1; } }
      P.vx[i] = (P.x[i] - P.px[i]) / dt; P.vy[i] = (P.y[i] - P.py[i]) / dt;
      if (P.vx[i] > 8) P.vx[i] = 8; else if (P.vx[i] < -8) P.vx[i] = -8; if (P.vy[i] > 8) P.vy[i] = 8; else if (P.vy[i] < -8) P.vy[i] = -8;
    }
    for (let i = n - 1; i >= 0; i--) if (P.kind[i] === KIND.ember) { P.life[i] -= STEP_MS; if (P.life[i] <= 0 || P.y[i] < -1.3) remove(i); }
    S.steps++;
  }
  function remove(i) { const last = --P.n; if (i !== last) { for (const a of [P.x, P.y, P.px, P.py, P.vx, P.vy, P.kind, P.life, P.drop]) a[i] = a[last]; for (const sp of S.springs) { if (sp.i === last) sp.i = i; if (sp.j === last) sp.j = i; } } S.springs = S.springs.filter((sp) => sp.i < P.n && sp.j < P.n && sp.i !== sp.j); }
  function add(kind, x, y, vx, vy, id, life = 0) { if (P.n >= N_MAX) return -1; const j = P.n++; P.x[j] = P.px[j] = x; P.y[j] = P.py[j] = y; P.vx[j] = vx; P.vy[j] = vy; P.kind[j] = kind; P.life[j] = life; P.drop[j] = id; return j; }
  function surfaceY() { let y = 1; for (let i = 0; i < P.n; i++) if (P.kind[i] !== KIND.ember && P.y[i] < y) y = P.y[i]; return y; }
  // ---- what a cause does when its beat comes inside a window ----
  function enter(n, ms) {
    const c = S.comp;
    if (n.kind === 'drop') {
      const gold = n.metal === 'gold', spec = gold ? GOLD : BRONZE, kind = gold ? KIND.gold : KIND.bronze;
      (gold ? c.gold : c.bronze).push(n.id); const before = c.gold.length * GOLD.n + c.bronze.length * BRONZE.n; trimLiquor(c);
      if (c.gold.length * GOLD.n + c.bronze.length * BRONZE.n < before) retire(kind);   // the oldest of its metal leaves as embers
      const sx = (hash01(n.id) - 0.5) * 0.9, top = Math.max(-0.72, surfaceY() - 0.42), lim = 0.72;
      const cx = sx * sx + top * top > lim * lim ? sx * lim / Math.sqrt(sx * sx + top * top) : sx, cy = sx * sx + top * top > lim * lim ? top * lim / Math.sqrt(sx * sx + top * top) : top;
      const tag = gold ? 1000 + c.gold.length : -1000 - c.bronze.length, made = [];
      for (let k = 0; k < spec.n; k++) {   // a hexagonal blob, the rings from its centre out
        const ring = k === 0 ? 0 : k < 7 ? 1 : 2, a = ring === 0 ? 0 : ring === 1 ? (k - 1) : (k - 7) * 0.6 + 0.5, s = SPACING * 0.9 * ring;
        const ox = ring === 0 ? 0 : s * HEX[Math.floor(a) % 6][0] + (a % 1) * s * (HEX[(Math.floor(a) + 1) % 6][0] - HEX[Math.floor(a) % 6][0]);
        const oy = ring === 0 ? 0 : s * HEX[Math.floor(a) % 6][1] + (a % 1) * s * (HEX[(Math.floor(a) + 1) % 6][1] - HEX[Math.floor(a) % 6][1]);
        const j = add(kind, cx + ox, cy + oy, 0, gold ? 1.2 : 0.6, tag); if (j >= 0) made.push(j);
      }
      if (gold) for (let a = 0; a < made.length; a++) for (let b = a + 1; b < made.length; b++) {
        const i = made[a], j = made[b], dx = P.x[j] - P.x[i], dy = P.y[j] - P.y[i], r = Math.sqrt(dx * dx + dy * dy);
        if (r < H) S.springs.push({ i, j, L: r, until: ms + GOLD.hold_ms });
      }
    } else if (n.kind === 'level') {
      const want = fuelCount(n.level, S.top), have = c.fuel;
      c.fuel = want; trimLiquor(c);
      if (c.fuel < have) for (let k = have - c.fuel; k > 0; k--) burnTop();   // the tank fell: its topmost fuel burns
      else for (let k = 0; k < c.fuel - have; k++) { const x = ((k % 5) - 2) * SPACING * 0.5, y = -0.85 + Math.floor(k / 5) * SPACING * 0.6; add(KIND.fuel, x, Math.min(y, surfaceY() - 0.2), 0, 1.5, 0); }   // a top-up pours
    } else if (n.kind === 'burn') {
      const x0 = (hash01(n.id) - 0.5) * 1.2, y0 = surfaceY();
      for (let k = 0; k < EMBER.sparks; k++) { const h = hash01(n.id + ':' + k); add(KIND.ember, x0 + (h - 0.5) * 0.12, y0, (h - 0.5) * 0.8, -1.2 - h * 0.8, 0, EMBER.life_ms * (0.7 + 0.3 * h)); }
    }
    S.version++;
  }
  function burnTop() {   // the fuel particle nearest the top (the first in index order on a tie) becomes an ember
    let best = -1; for (let i = 0; i < P.n; i++) if (P.kind[i] === KIND.fuel && (best < 0 || P.y[i] < P.y[best])) best = i;
    if (best < 0) return; P.kind[best] = KIND.ember; P.life[best] = EMBER.life_ms; P.vy[best] = -1.2; P.drop[best] = 0;
  }
  function retire(kind) {   // a drop's place taken: as many particles of its metal as one drop holds turn to embers, the highest first
    const want = kind === KIND.gold ? GOLD.n : BRONZE.n;
    for (let k = 0; k < want; k++) { let best = -1; for (let i = 0; i < P.n; i++) if (P.kind[i] === kind && (best < 0 || P.y[i] < P.y[best])) best = i; if (best < 0) break; P.kind[best] = KIND.ember; P.life[best] = EMBER.life_ms; P.vy[best] = -1; }
  }
  // THE EASE IS WHAT IS SHOWN, NEVER A FORCE (Oct 14 2026 20:4x WEST): over a window's last EASE_MS the picture is blended from the fluid toward its slots in
  // the composition's lattice (kind by kind, the lowest particle to the lowest slot), while the fluid itself plays on untouched; at the window's end the
  // lattice stands exactly. The first cut pulled the particles themselves to their slots, through one another, and the pressure answered: fuel thrown
  // 0.4 to 0.5 of a radius over the surface in the last half second of every window, a call's sparks alone included.
  const BX = new Float64Array(N_MAX), BY = new Float64Array(N_MAX);
  function blend(e) {
    const L = lattice(), slots = { [KIND.gold]: [], [KIND.fuel]: [], [KIND.bronze]: [] }; let s = 0;
    const take = (kind, count) => { for (let i = 0; i < count && s < L.length; i++, s++) slots[kind].push(L[s]); };
    take(KIND.gold, S.comp.gold.length * GOLD.n); take(KIND.fuel, S.comp.fuel); take(KIND.bronze, S.comp.bronze.length * BRONZE.n);
    for (let i = 0; i < P.n; i++) { BX[i] = P.x[i]; BY[i] = P.y[i]; }
    for (const kind of [KIND.gold, KIND.fuel, KIND.bronze]) {   // row by row from the floor: the lowest particles take the lowest row, left to right
      const idx = []; for (let i = 0; i < P.n; i++) if (P.kind[i] === kind) idx.push(i);
      idx.sort((a, b) => (P.y[b] - P.y[a]) || (P.x[a] - P.x[b]) || (a - b));
      const sl = slots[kind]; let r = 0;
      for (let s0 = 0; s0 < sl.length && r < idx.length;) {
        let s1 = s0 + 1; while (s1 < sl.length && sl[s1].y === sl[s0].y) s1++;
        const row = sl.slice(s0, s1).sort((a, b) => a.x - b.x), mine = idx.slice(r, r + row.length).sort((a, b) => (P.x[a] - P.x[b]) || (a - b));
        for (let k = 0; k < mine.length; k++) { const i = mine[k], t = row[k]; BX[i] = P.x[i] + (t.x - P.x[i]) * e; BY[i] = P.y[i] + (t.y - P.y[i]) * e; }
        r += mine.length; s0 = s1;
      }
    }
  }
  /** play(now): the window up to the house time now, in fixed steps from its first beat; nothing when no window is open and no cause is due */
  function play(now) {
    if (!fin(now)) return false;
    if (S.at != null && now < S.at) return false;   // the house time never runs back here: a picture for an earlier time shows the later state
    S.at = now;
    while (true) {
      if (!S.win) {
        if (!S.queue.length || S.queue[0].t0 > now) return false;
        const first = S.queue[0]; S.win = { t0: first.t0, step: 0, end: first.t0 + WINDOW_MS }; layout(S.comp);
      }
      const W = S.win;
      while (true) {
        const ms = W.t0 + W.step * STEP_MS; if (ms > now) return true;
        if (S.queue.length && S.queue[0].t0 <= ms) checkpoint(ms);
        while (S.queue.length && S.queue[0].t0 <= ms) { const n = S.queue.shift(); enter(n, ms); W.end = Math.max(W.end, n.t0 + WINDOW_MS); }
        if (ms >= W.end) { layout(S.comp); S.win = null; break; }   // the window is over: the lattice, exactly
        step(ms);
        W.step++;
      }
    }
  }
  /** view(now): the fluid at the house time now, for a painter: {n, x, y, kind, life, version, moving, steps} (the arrays are the law's own: read, never kept) */
  function view(now) {
    const moving = play(now);
    if (moving) S.version++;
    const W = S.win, easeFrom = W ? W.end - EASE_MS : Infinity, t = fin(now) && S.at != null ? S.at : now;   // the ease: what is shown of the window's last EASE_MS
    if (W && t >= easeFrom && !S.queue.some((q) => q.t0 < W.end)) { blend(smooth((t - easeFrom) / EASE_MS)); return { n: P.n, x: BX, y: BY, kind: P.kind, life: P.life, version: S.version, moving, steps: S.steps }; }
    return { n: P.n, x: P.x, y: P.y, kind: P.kind, life: P.life, version: S.version, moving, steps: S.steps };
  }
  return { compose, cause, view, moving: (now) => !!S.win || (S.queue.length > 0 && fin(now) && S.queue[0].t0 <= now + STEP_MS),
    state: () => ({ n: P.n, comp: { fuel: S.comp.fuel, gold: S.comp.gold.length, bronze: S.comp.bronze.length }, window: S.win ? { t0: S.win.t0, end: S.win.end, step: S.win.step } : null,
      queued: S.queue.length, retainedCauses: S.history.length, checkpoints: S.checkpoints.length, recovery: S.recovery ? { ...S.recovery } : null, steps: S.steps, version: S.version, springs: S.springs.length }) };
}
const HEX = [[1, 0], [0.5, 0.8660254037844386], [-0.5, 0.8660254037844386], [-1, 0], [-0.5, -0.8660254037844386], [0.5, -0.8660254037844386]];
