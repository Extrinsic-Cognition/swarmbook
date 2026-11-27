// fields-plan.mjs: THE FIELDS' plan, pure (no three.js, no page, no clock of its own): what fields.js draws at the film's second, and the
// strands grown from a hair mesh. His words and the law are in fields.js's header; the film's readings are fields-film.mjs (fields.measure.mjs).
// Everything here is a function of the film's second t and of fixed data, so a seek, a pause or a loop lands on the same picture as a first play
// and every glass draws the same thing at the same second (C-2, C-3: the song is the program, the film's second is the beat).
//
//   hairAt(t)            -> {on, wind, sway}: her strands stream toward the fight in the shot over her shoulder (29.563 to 33.567 s)
//   flowAt(u, v)         -> [x, y] the drawn hair's direction at the face's picture square (u, v): root to tip, picture frame (y down)
//   growGuides(pos, tris)-> the guide curves of a hair mesh: shortest paths over the mesh from its scalp to each lock's tip, resampled
//   capOf(tris, grown)   -> the game's hair kept under the strands: its cap and its front (the strands take over the long locks)
//   strandsOf(guides, n) -> n strands of K points between neighbouring guides, clumped to them (Float32Array n x K x 4)
//   lightAt(t)           -> {on, power, star, burst, sun, flood, flames, grow}: the light from the cloth, by the film's own light and cuts
//   raysOf()             -> the burst's rays, as the film draws them (fields-film.mjs BURST), as directions in the source's frame
//   surfaceOf(pos, tris, n) -> n points on a mesh's surface by area, with their normals and barycentric source
//   dissolveAt(t, at)    -> {on, progress}: a silhouette going to smoke, water or petals from the moment `at` he picks
//   rippleAt(t, portal)  -> her portal's fronts (the window's from her hair's join, the wall of light's), for RIPPLE_GLSL's bend
import {HAIR, SWAY, BURST, LIGHT} from './fields-film.mjs';
import {rotate, frameOf as faceFrameOf, PORTAL, portalWindow} from './cubism.mjs';

export const FPS = 30000 / 1001;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const ss = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
const frameOf = (t) => Math.round(t * FPS);

// ---- the film's cuts this plan stands on (cuts.js FILM_CUTS, ffmpeg's scene score; never braindance.json's camera list) ----
export const CUTS = Object.freeze({
  shoulder: [29.563, 33.567],   // over Athena's shoulder, down at the fight: her hair streams left toward it (frames 886 to 1005)
  // every shot of the film over her shoulder, her hair streaming left toward the fight in each (read by eye at 36.8, 37.3, 37.6, 72.6, 73.0 and
  // 74.5 s; 71.138 to 72.472 s is Seiya in the light, though braindance.json keeps her on the page there)
  shoulders: [[29.563, 33.567], [36.570, 38.071], [72.472, 74.975]],
  star: 42.342,                 // to Athena's mountain, the gold star already in the stormy sky (his "the box should open up" pick)
  rays: 43.5,                   // the star bursts into rays (unboxing-plan.mjs RAYS after the opening); no cut, the shot runs on
  burst: 45.445,                // to the white-gold burst of rays
  sun: 49.55,                   // to the gold sun, white rays then the white flood
  centaur: 50.05,               // to the gold centaur in flames
  knights: 53.053,              // to the knights looking up into the light: the flames are over
});

// ---- 1. THE HAIR ----
/**
 * Her strands at second t: on through each shot over her shoulder and half a second either side (so they are there at the cut), the wind
 * full inside the shot (the drawn hair streams toward the fight in all three) and easing to rest outside it; sway: the drawn hair's own swing
 * at that frame in the shot it was read off (fields-film.mjs SWAY, radians), 0 elsewhere.
 */
export function hairAt(t) {
  const shot = Number.isFinite(t) ? CUTS.shoulders.find(([a, b]) => t >= a - 0.5 && t < b + 0.5) : null;
  if (!shot) return {on: false, wind: 0, sway: 0};
  const [a, b] = shot, wind = ss(a - 0.5, a, t) * (1 - ss(b, b + 0.5, t));
  const n = frameOf(t) - 886;
  return {on: true, wind, sway: n >= 0 && n < SWAY.length ? SWAY[n] : 0, shot};
}
/** The drawn hair's direction at the picture square's (u, v): bilinear over the measured grid (clamped at its edge), unit, root to tip. */
export function flowAt(u, v, field = HAIR) {
  const g = field.grid, x = clamp((u - g.u0) / g.du - 0.5, 0, g.nu - 1), y = clamp((v - g.v0) / g.dv - 0.5, 0, g.nv - 1);
  const i = Math.min(g.nu - 2, Math.floor(x)), j = Math.min(g.nv - 2, Math.floor(y)), fx = x - i, fy = y - j;
  let sx = 0, sy = 0;
  for (const [di, dj, w] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
    const a = field.a[(j + dj) * g.nu + i + di];
    sx += w * Math.cos(a); sy += w * Math.sin(a);
  }
  const l = Math.hypot(sx, sy) || 1;
  return [sx / l, sy / l];
}
/**
 * The face's picture frame for her strands: her model (metres) to the picture square of the face she is on (u right, v down, w toward the
 * eye; the square's half side one unit), as a row-major 4x4, shifted in u and v so her head joint stands at the film's head (anchor: null for
 * the face's own frame). modelToView is her model to the page's view space (cubism.mjs place().matrix);
 * the face turns with the sphere (spin {yaw, pitch}), so the frame is taken again at each draw that turns it.
 */
export function faceFlowFrame(face, spin, modelToView, {head = [0, 1.392, 0.007], anchor = HAIR.head} = {}) {
  const f = faceFrameOf(face), r = f.rho, at = (v) => rotate(v, spin.yaw, spin.pitch);
  const A = at(f.across), U = at(f.up), N = at(f.n), C = at(f.C);
  const F = [A.map((x) => x / r), U.map((x) => -x / r), N.map((x) => x / r)], M = modelToView;
  const out = new Array(16).fill(0);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) out[i * 4 + j] = F[i][0] * M[j] + F[i][1] * M[4 + j] + F[i][2] * M[8 + j];
    out[i * 4 + 3] -= F[i][0] * C[0] + F[i][1] * C[1] + F[i][2] * C[2];
  }
  out[15] = 1;
  // the field is read round HER head: her head joint lands where the film's head is (fields-film.mjs HAIR.head), so each strand reads the
  // drawn hair's direction at the same place relative to the head it grows from (the cubist fit joins her hair at the face's edge, not her head)
  if (anchor) for (let i = 0; i < 2; i++) out[i * 4 + 3] += anchor[i] - (out[i * 4] * head[0] + out[i * 4 + 1] * head[1] + out[i * 4 + 2] * head[2] + out[i * 4 + 3]);
  return out;
}
/**
 * The screen's frame for her strands, the screenshot's composition laid round her own head as the eye sees her: her model (metres) to the
 * film's picture frame (u right, v down, w toward the eye) by the page's own axes, scaled so her head is the film's head's size (k picture
 * units a page unit: the film's head and hair 0.9 units wide over her model's 0.26 m at her scale) and shifted so her head joint stands where
 * the film's head is. modelToWorld: her model to the scene the eye looks down -z in (cubism.mjs place().matrix, or her spot's matrix).
 * Row-major 4x4. Unlike faceFlowFrame, it does not follow the face she is joined to (on a face at the sphere's silhouette the picture's
 * left runs into the depth): her locks stream across the screen as the drawn ones do, toward the box where the fight is drawn.
 */
export function screenFlowFrame(modelToWorld, {head = [0, 1.392, 0.007], anchor = HAIR.head, width = 0.9, model = 0.26} = {}) {
  const M = modelToWorld, scale = Math.hypot(M[0], M[4], M[8]), k = width / (model * scale), F = [k, -k, k];
  const out = new Array(16).fill(0);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) out[i * 4 + j] = F[i] * M[i * 4 + j];
  out[15] = 1;
  for (let i = 0; i < 2; i++) out[i * 4 + 3] += anchor[i] - (out[i * 4] * head[0] + out[i * 4 + 1] * head[1] + out[i * 4 + 2] * head[2] + out[i * 4 + 3]);
  return out;
}
/**
 * The drawn hair's stream: the mean direction (root to tip, picture frame) of the cells that read hair in the streaming part of the shot (left of
 * u 0.3, below the square's middle), weighted by their coherence. Beyond the picture the strands follow it: the film shows the hair as far as
 * its frame, and the stream is where it goes on.
 */
export function streamOf(field = HAIR) {
  const g = field.grid;
  let sx = 0, sy = 0;
  for (let i = 0; i < g.nu * g.nv; i++) {
    const u = g.u0 + (i % g.nu + 0.5) * g.du, v = g.v0 + (Math.floor(i / g.nu) + 0.5) * g.dv, c = field.c[i];
    if (!(c > 0) || u >= 0.3 || v <= 0) continue;
    sx += c * Math.cos(field.a[i]); sy += c * Math.sin(field.a[i]);
  }
  const l = Math.hypot(sx, sy) || 1;
  return [sx / l, sy / l];
}
export const STREAM = Object.freeze(streamOf());
/** The flow grid as RGBA bytes (nu x nv, rows top down): r, g the direction (x, y down) at 0.5 + 0.5 v, b the coherence; for a GPU texture. */
export function flowBytes(field = HAIR) {
  const g = field.grid, out = new Uint8Array(g.nu * g.nv * 4);
  for (let i = 0; i < g.nu * g.nv; i++) {
    const a = field.a[i];
    out[i * 4] = Math.round((0.5 + 0.5 * Math.cos(a)) * 255); out[i * 4 + 1] = Math.round((0.5 + 0.5 * Math.sin(a)) * 255);
    out[i * 4 + 2] = Math.round(clamp(field.c[i], 0, 1) * 255); out[i * 4 + 3] = 255;
  }
  return out;
}
/** The film's hair, read off the shot (cubism.mjs's violet, sampled at 29.8, 31.0, 32.6 and 33.4 s): its middle, its shade, its dark
 *  lines and its pale strands, as 0..1 rgb. */
const PAINT = {mid: [143, 97, 153], shade: [130, 97, 116], line: [81, 41, 84], pale: [230, 207, 208]};
export const HAIR_PAINT = Object.freeze(Object.fromEntries(Object.entries(PAINT).map(([k, c]) => [k, Object.freeze(c.map((x) => +(x / 255).toFixed(4)))])));

/** A seeded random (mulberry32), so the strands and the particles are the same on every glass. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const lerp3 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

/**
 * THE GUIDES of a hair mesh (positions in metres, triangles as vertex indices; her E00H as the asset stands): its vertices welded where they
 * coincide (the game's strips repeat them), the mesh's edges a graph, and from the scalp (the welded vertices within `scalp` m of the head
 * joint and above it) the shortest paths over the mesh (Dijkstra) to every vertex. A lock's tip is a vertex farther along the mesh than every
 * neighbour of it and at least `minLength` from the scalp; its guide is its path back to the scalp, root first, resampled to K points by arc
 * length and smoothed (its ends kept). The guides come sorted by their tip's angle round the head (seen from above), so neighbours in the
 * list are neighbours on her head.
 */
export function growGuides(pos, tris, {head = [0, 1.392, 0.007], scalp = 0.16, minLength = 0.22, K = 24, smooth = 3, weld = 1e-5} = {}) {
  const n = pos.length / 3, id = new Int32Array(n), keys = new Map(), at = [];
  for (let i = 0; i < n; i++) {
    const p = [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]], k = p.map((x) => Math.round(x / weld)).join(',');
    if (!keys.has(k)) { keys.set(k, at.length); at.push(p); }
    id[i] = keys.get(k);
  }
  const m = at.length, nbr = Array.from({length: m}, () => new Map());
  for (let t = 0; t < tris.length; t += 3) for (const [a, b] of [[tris[t], tris[t + 1]], [tris[t + 1], tris[t + 2]], [tris[t + 2], tris[t]]]) {
    const i = id[a], j = id[b];
    if (i === j) continue;
    const d = len(sub(at[i], at[j]));
    nbr[i].set(j, d); nbr[j].set(i, d);
  }
  // Dijkstra from the scalp (a binary heap of [distance, vertex])
  const dist = new Float64Array(m).fill(Infinity), from = new Int32Array(m).fill(-1), heap = [];
  const push = (d, v) => { heap.push([d, v]); let c = heap.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (heap[p][0] <= heap[c][0]) break; [heap[p], heap[c]] = [heap[c], heap[p]]; c = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let c = 0; for (;;) { const l = 2 * c + 1, r = l + 1; let s = c; if (l < heap.length && heap[l][0] < heap[s][0]) s = l; if (r < heap.length && heap[r][0] < heap[s][0]) s = r; if (s === c) break; [heap[s], heap[c]] = [heap[c], heap[s]]; c = s; } } return top; };
  let roots = 0;
  for (let i = 0; i < m; i++) if (len(sub(at[i], head)) < scalp && at[i][1] >= head[1]) { dist[i] = 0; push(0, i); roots++; }
  if (!roots) throw new Error('growGuides: no scalp within reach of the head joint');
  while (heap.length) {
    const [d, v] = pop();
    if (d > dist[v]) continue;
    for (const [w, e] of nbr[v]) if (d + e < dist[w]) { dist[w] = d + e; from[w] = v; push(d + e, w); }
  }
  // the tips: farther along the mesh than every neighbour, and long enough to be a lock
  const tips = [];
  for (let i = 0; i < m; i++) {
    if (!(dist[i] >= minLength) || !Number.isFinite(dist[i])) continue;
    let top = true;
    for (const [w] of nbr[i]) if (dist[w] > dist[i]) { top = false; break; }
    if (top) tips.push(i);
  }
  const guides = tips.map((tip) => {
    const path = [];
    for (let v = tip; v >= 0; v = from[v]) path.push(at[v]);
    path.reverse();
    const pts = smoothed(resample(path, K), smooth);
    return {points: pts, length: dist[tip], tip: at[tip], root: pts[0], azimuth: Math.atan2(at[tip][0] - head[0], -(at[tip][2] - head[2]))};
  });
  guides.sort((a, b) => a.azimuth - b.azimuth);
  return {guides, welded: m, scalp: roots, edges: nbr.reduce((s, x) => s + x.size, 0) / 2, id, dist, at};
}
/**
 * The game's hair to keep under the strands (hair-local triangles): its cap, every triangle within `capMax` m of the scalp along the mesh, and
 * its front (the bangs and the locks by her face, more than `front` radians round from the back), where no strand grows. The rest, the long locks
 * down her back, the strands take over. grown: growGuides's answer for the same mesh.
 */
export function capOf(tris, grown, {head = [0, 1.392, 0.007], capMax = 0.11, front = 100 * Math.PI / 180} = {}) {
  const keep = [];
  for (let t = 0; t < tris.length; t += 3) {
    const w = [tris[t], tris[t + 1], tris[t + 2]].map((v) => grown.id[v]);
    const near = w.every((x) => grown.dist[x] < capMax);
    const c = w.reduce((s, x) => [s[0] + grown.at[x][0] / 3, s[1] + grown.at[x][1] / 3, s[2] + grown.at[x][2] / 3], [0, 0, 0]);
    const round = Math.abs(Math.atan2(c[0] - head[0], -(c[2] - head[2])));
    if (near || round > front) keep.push(tris[t], tris[t + 1], tris[t + 2]);
  }
  return Uint32Array.from(keep);
}
/** A guide grown on past its tip along its last direction, to `factor` times its length (the wind's hair is longer than the game's sheet). */
export function extended(points, factor = 1.4) {
  if (!(factor > 1)) return points;
  const n = points.length, a = points[n - 2], b = points[n - 1], d = sub(b, a), l = len(d) || 1, u = d.map((x) => x / l);
  let total = 0;
  for (let i = 1; i < n; i++) total += len(sub(points[i], points[i - 1]));
  const more = total * (factor - 1), steps = Math.max(2, Math.round(n * (factor - 1)));
  const out = points.map((p) => [...p]);
  for (let i = 1; i <= steps; i++) out.push(b.map((x, j) => x + u[j] * more * i / steps));
  return resample(out, n);
}
/** A polyline resampled to K points equally spaced along its length. */
export function resample(path, K) {
  const acc = [0];
  for (let i = 1; i < path.length; i++) acc.push(acc[i - 1] + len(sub(path[i], path[i - 1])));
  const total = acc[acc.length - 1], out = [];
  for (let k = 0, j = 0; k < K; k++) {
    const s = total * k / (K - 1);
    while (j < path.length - 2 && acc[j + 1] < s) j++;
    const seg = acc[j + 1] - acc[j] || 1;
    out.push(lerp3(path[j], path[Math.min(j + 1, path.length - 1)], clamp((s - acc[j]) / seg, 0, 1)));
  }
  return out;
}
/** Laplacian smoothing, `passes` times, the two ends held. */
export function smoothed(pts, passes = 3) {
  let p = pts.map((x) => [...x]);
  for (let s = 0; s < passes; s++) p = p.map((x, i) => (i === 0 || i === p.length - 1 ? x : lerp3(x, lerp3(p[i - 1], p[i + 1], 0.5), 0.5)));
  return p;
}
/**
 * The strands: n strands of K points (x, y, z, s with s 0 at the root to 1 at the tip), each between two neighbouring guides (blended across)
 * and clumped to them: a strand starts up to `spread` m off its blend across the scalp and gathers toward it down its length (the drawn
 * locks), its length 82 to 100 % of its guides'. Seeded, so every glass grows the same strands.
 */
export function strandsOf(guides, n, {seed = 7, spread = 0.012, clump = 0.8} = {}) {
  const G = guides.length, K = guides[0].points.length, out = new Float32Array(n * K * 4), r = rng(seed);
  for (let s = 0; s < n; s++) {
    const q = (s + r()) / n * (G - 1), i = Math.min(G - 2, Math.floor(q)), b = ss(0, 1, q - i), A = guides[i].points, B = guides[Math.min(i + 1, G - 1)].points;
    const off = [(r() - 0.5) * 2 * spread, (r() - 0.5) * spread, (r() - 0.5) * 2 * spread], keep = 0.82 + 0.18 * r();
    for (let k = 0; k < K; k++) {
      const u = k / (K - 1), x = u * keep, j = Math.min(K - 2, Math.floor(x * (K - 1))), f = x * (K - 1) - j;
      const a = lerp3(A[j], A[j + 1], f), c = lerp3(B[j], B[j + 1], f), p = lerp3(a, c, b), g = 1 - clump * u;
      out.set([p[0] + off[0] * g, p[1] + off[1] * g, p[2] + off[2] * g, u], (s * K + k) * 4);
    }
  }
  return out;
}

// ---- 2. THE LIGHT FROM ITS SOURCE ----
/** The film's light amount at second t (fields-film.mjs LIGHT, linear between its tenths; 0 outside its windows). */
export function filmLight(t) {
  for (const w of LIGHT) {
    const x = (t - w.from) / w.dt;
    if (x < 0 || x > w.light.length - 1) continue;
    const i = Math.min(w.light.length - 2, Math.floor(x)), f = x - i;
    return w.light[i] * (1 - f) + w.light[i + 1] * f;
  }
  return 0;
}
/**
 * The light from the cloth at second t, by the film's own cuts and light (its amount 0 to about 0.7):
 * star: the gold star's thin rays, from its flash (43.2 s) growing to the cut to the burst; burst: the burst's wide rays shooting out at its
 * cut (45.445 s) and holding while the film holds them, falling as the film's sun shrinks; sun: the gold core alone; flood: the white flood
 * (49.55 to 50.05); flames: the centaur's flames from his cut (50.05 s) to the knights' (53.053 s). grow: how far the rays have shot out
 * (0..1). power: the field's strength, the film's light carried up to 1 at its brightest.
 */
export function lightAt(t) {
  const c = CUTS;
  if (!(Number.isFinite(t) && t >= c.star && t < c.knights + 0.6)) return {on: false, power: 0, star: 0, burst: 0, sun: 0, flood: 0, flames: 0, grow: 0};
  const film = filmLight(t), power = clamp(film / 0.19, 0, 1.6);
  const star = t < c.burst ? ss(43.15, c.rays, t) : 0;
  const burst = t >= c.burst && t < c.sun ? 1 - ss(47.6, 48.6, t) : 0;
  const sun = t >= 47.6 && t < c.centaur ? ss(47.6, 48.0, t) : 0;
  const flood = t >= c.sun && t < c.centaur ? ss(c.sun, 49.9, t) * (1 - ss(49.98, c.centaur + 0.02, t)) : 0;
  const flames = t >= c.centaur - 0.05 ? ss(c.centaur - 0.05, c.centaur + 0.35, t) * (1 - ss(c.knights, c.knights + 0.6, t)) : 0;
  const grow = t < c.burst ? ss(43.15, 43.9, t) : ss(c.burst, c.burst + 0.35, t);
  return {on: true, power: t < c.burst ? Math.max(power, 0.35 * star) : Math.max(power, 0.6 * flames), star, burst, sun, flood, flames, grow};
}
/**
 * The burst's rays as the film draws them (fields-film.mjs BURST, 16 read off frames 1362 to 1429), lifted into 3D in the source's frame: each
 * ray keeps the film's angle in the picture's plane (x right, y up, z toward the eye) and leans out of it by a seeded angle (up to `lean`
 * radians), so from the eye at the burst's cut they read as the film's rays and the box's turn shows them in depth. {dir, k, width} each.
 */
export function raysOf({lean = 0.55, seed = 3, extra = 0} = {}) {
  const r = rng(seed), out = BURST.rays.map(([deg, k, w]) => {
    const a = deg * Math.PI / 180, z = (r() - 0.5) * 2 * lean;
    return {dir: [Math.cos(a) * Math.cos(z), -Math.sin(a) * Math.cos(z), Math.sin(z)], k, width: w};
  });
  for (let i = 0; i < extra; i++) {   // thin rays between the film's: the star's many lines
    const a = r() * Math.PI * 2, z = (r() - 0.5) * 2 * lean;
    out.push({dir: [Math.cos(a) * Math.cos(z), -Math.sin(a) * Math.cos(z), Math.sin(z)], k: 0.25 + 0.35 * r(), width: 1.5, thin: true});
  }
  return out;
}

// ---- THE RIPPLE (the cubist-fit session's yes, 18:4x WEST: her portal's front as a field) ----
// His 16:58 WEST "imagine that seeing athena from that perspective ripples a wave through the fabric of spacetime", and 17:19 WEST "the
// "FRAME" AKA "WINDOW INTO THE SCENE" should expand outwards from the alignment of athena hair... SHE IS ALSO CLOSING IT BY WALL OF LIGHT
// AIOLOS". The fronts are her portal's own (cubism.mjs portalWindow, from her hair's join): the window's, 2,600 stage px a second for 0.1 s from
// PORTAL.open, then growing to the stage's far corner by PORTAL.grown; the wall of light's, from PORTAL.aiolos to PORTAL.closed. The bend
// where a front passes is the cubist storyboard's (cubism.storyboard.mjs: 18 px x exp(-(u / 60)^2) x sin(u / 13), u px past the front).
export const RIPPLE_SHAPE = Object.freeze([18, 60, 13]);   // amplitude, width, wavelength (stage css px)
/**
 * The ripple at second t, on the portal's geometry (reach and zFull: cubism.mjs portalGeometry, as the window takes them at its opening):
 * {on, r (the window's front, px from the join), k (its strength: strong while it opens, easing to 0.35 as it grows; gone once grown),
 * wall (the wall of light's front, px; -1 before Aiolos), kWall}. Nothing outside PORTAL.open to PORTAL.closed.
 */
export function rippleAt(t, {reach = 1, zFull = 1} = {}) {
  if (!(Number.isFinite(t) && t >= PORTAL.open && t < PORTAL.closed)) return {on: false, r: 0, k: 0, wall: -1, kWall: 0};
  const w = portalWindow(t, reach, zFull);
  const k = (0.35 + 0.65 * (1 - ss(PORTAL.waveEnd, PORTAL.waveEnd + 0.4, t))) * (1 - ss(PORTAL.grown - 0.3, PORTAL.grown, t));
  const kWall = w.wall >= 0 ? 1 - ss(PORTAL.closed - 0.08, PORTAL.closed, t) : 0;
  return {on: true, r: w.r, k, wall: w.wall, kWall};
}
/** The bend at a stage point (css px) as RIPPLE_GLSL computes it: [dx, dy] px, radial from the origin. For tests and 2D readers. */
export function rippleBend(x, y, origin, R, shape = RIPPLE_SHAPE) {
  const dx = x - origin[0], dy = y - origin[1], l = Math.hypot(dx, dy);
  if (!R.on || l < 1e-3) return [0, 0];
  const bump = (u, k) => k * shape[0] * Math.exp(-((u / shape[1]) ** 2)) * Math.sin(u / shape[2]);
  const a = bump(l - R.r, R.k) + (R.wall >= 0 ? bump(l - R.wall, 1.4 * R.kWall) : 0);
  return [dx / l * a, dy / l * a];
}

// ---- 3. THE SILHOUETTE DISSOLVING ----
/**
 * n points on a mesh's surface (positions, triangles), each triangle by its area: {pos (n x 3), nrm (n x 3), tri (n), bary (n x 2)}. Seeded.
 */
export function surfaceOf(pos, tris, n, {seed = 11} = {}) {
  const T = tris.length / 3, cum = new Float64Array(T);
  const P = (i) => [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]];
  let total = 0;
  for (let t = 0; t < T; t++) {
    const a = P(tris[t * 3]), b = P(tris[t * 3 + 1]), c = P(tris[t * 3 + 2]), u = sub(b, a), v = sub(c, a);
    total += 0.5 * len([u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]);
    cum[t] = total;
  }
  const r = rng(seed), out = {pos: new Float32Array(n * 3), nrm: new Float32Array(n * 3), tri: new Uint32Array(n), bary: new Float32Array(n * 2), area: total};
  for (let k = 0; k < n; k++) {
    const x = r() * total;
    let lo = 0, hi = T - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < x) lo = mid + 1; else hi = mid; }
    let u = r(), v = r();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const a = P(tris[lo * 3]), b = P(tris[lo * 3 + 1]), c = P(tris[lo * 3 + 2]), e1 = sub(b, a), e2 = sub(c, a);
    const p = [a[0] + e1[0] * u + e2[0] * v, a[1] + e1[1] * u + e2[1] * v, a[2] + e1[2] * u + e2[2] * v];
    const nn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], l = len(nn) || 1;
    out.pos.set(p, k * 3); out.nrm.set(nn.map((x) => x / l), k * 3); out.tri[k] = lo; out.bary.set([u, v], k * 2);
  }
  return out;
}
/** The styles a silhouette can go to (his "human silhouettes as smoke or water or flowers"). */
export const STYLES = Object.freeze(['smoke', 'water', 'petals']);
/**
 * The dissolve at second t from the moment `at` he picks: progress 0 (whole) to 1 (all of it released) over `duration` seconds, and on while
 * anything of it is still in the air (`linger` seconds after). The front itself (where on the body it has reached) is fields.js's, on the GPU.
 */
export function dissolveAt(t, at, {duration = 1.6, linger = 2.4} = {}) {
  if (!(Number.isFinite(t) && Number.isFinite(at)) || t < at - 0.05 || t > at + duration + linger) return {on: false, progress: t > at ? 1 : 0};
  return {on: true, progress: clamp((t - at) / duration, 0, 1)};
}
/**
 * The moments shown to him for the silhouette (his pick decides; nothing is wired from these): each a second on the film's own cuts, what is on
 * screen, whose body and which style the picture shows.
 */
// A stands at his tag "Aiolos" (37.132 s, mint/seiya-tags), where his 17:19 WEST "SHE IS ALSO CLOSING IT BY WALL OF LIGHT AIOLOS" puts the wall of
// light running out from her; his 17:35 WEST words keep her on the page from her alignment through her face shot to that wall (CUBISM.md HER
// SHOTS), so she does not go at the cut to her face (33.567 s, this lane's first reading, withdrawn). A is a transformation of her whole figure and
// his to pick: the ruling on her (she is Saori, 13) is no jiggle of her body and nothing that sexualizes her, and does not take A from his choices
// (the coordinator, Oct 14 2026 19:05 WEST; this lane withdrew A at 19:01 and restored it). In THE FOLD as the hero's hypertrace reads his 19:19
// WEST words, the faces come back from her plane into the sphere when the wall of light hits (37.132 s), whole by 38.071 s, and she leaves on that
// cut: A's front (1.6 s) is 59 % across her then. That is his to weigh (FIELDS.md, his canvas), not a reason to drop it.
export const DISSOLVE_CANDIDATES = Object.freeze([
  {id: 'athena-aiolos', at: 37.132, body: 'athena', style: 'petals', what: "his tag Aiolos, the wall of light from her closing the window: her body and her strands to violet petals on that light"},
  {id: 'seiya-light', at: 71.572, body: 'seiya', style: 'smoke', what: 'he goes up into the light and is gone to a star (the cut at 71.572 s): his silhouette to gold smoke'},
  {id: 'sacrifice-water', at: 11.044, body: 'ikki', style: 'water', what: 'the hit lands on the one standing in the blast with his arms spread (the cut at 11.044 s): his silhouette to water'},
].map((c) => Object.freeze(c)));

/** Whether any field has something to draw at second t (a page's draw asks before it wakes for them). */
export const anyAt = (t, {dissolve = null} = {}) => hairAt(t).on || lightAt(t).on || Boolean(dissolve && dissolveAt(t, dissolve.at, dissolve).on);
