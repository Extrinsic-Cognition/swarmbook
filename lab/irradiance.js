// irradiance.js: THE INVERSION OF THE MASK at the golden flash, for the hero (hero-ab.html). His words, Oct 14 2026 22:06 WEST, his screenshot
// showing the golden starburst on every face of the dodecahedron and the gold cloth inside the glass: "you have it all entirely fucking wrong
// dude... use this fucking flash to cause an inversion of the mask until this point... meaning: stop showing what is inside of the dodecahedron
// glass (start filling it with the liquor we have from benches) and slowly with the same algo as the dolbar swarm write something that directs
// the "expansion" of how fast the outside of the dodecahedron receives ligth irradiated from isnide of the dodecahedron". Then, 23:05 WEST, over
// it built on the wrong flash: "who the fuck approved replacing what we had before here?"; 23:38 WEST, over his page at the golden starburst:
// "i already said what should happen here. you lost that?".
//
// THE FLASH is the mount's, never this file's: `at`, `until` and `field` come from the page that mounts it. It was built first on the hero's
// first burst (11.044 s, Dolbar's red impact, 68f42063), replacing the burst he had approved there, and taken off it (18678802). On the hero
// it is the film's cut to the white-gold burst of rays at 45.445 s (frame 1362 of saint-seiya.mp4 at 30000/1001 fps, hero-ab.html BURST_CUT),
// the gold star over Athena's mountain before it, the box opening (unboxing.js) with the gold cloth inside; it holds until the film's cut to
// the gold centaur in flames at 50.050 s (frame 1500, unboxing-plan's CENTAUR, where the box stands open and the empty frames begin), and goes
// on that cut. Between: the burst to the vortex at 47.6 s, the gold sun shrinking, the cut to the white rays at 49.550 s, the white flood.
// - INSIDE, the film stops: the glass shows the page's clear glass and FILLS WITH THE LIQUOR of the lab's syrup benches (syrup-glass.html,
//   syrup-inside.html: maple syrup, whiskey amber, Beer-Lambert by the syrup's own sigma, 0.35, 1.15 and 3.3 a channel). It is poured at
//   once and slower and slower into the glass's ball, the level the ball's section that holds what is poured (3h² - 2h³ of it), from the
//   bottom of the glass's silhouette to its top in 2 s; its meniscus ripples, harder while it pours, a bright line with a sheen under it;
//   the amber is darker where the path through the ball is longer and deeper down; a soft highlight where the page's key light
//   (-0.32, 0.7, 0.64) meets the glass. THE GLASS is the one drawn there: the page's sphere (genesisSphere's turn, at its centre) or, on the
//   hero, the box as it stands open (`glass`, the box's own turn and place, read off its scene each draw), whose faces the hero empties for
//   the window (its empty frames from the flash: the gold leading, nothing in it), so its frames, the cloth standing in it and anything the
//   box draws (THE FIELDS' light from the armor, fields.js, once mounted) stay over this layer, which lies under the box.
// - OUTSIDE, the film is let in where the light from inside has reached: the whole picture, where the theater puts it (theater-light.json's
//   crop of the film, centred in the stage at hero-ab.html's fit 0.92), inside a region round the glass that EXPANDS from the glass's edge.
//   Its reach in each of 64 directions grows by a base speed (alone it carries every direction past the picture's far corner by 0.75 of the
//   window, so the whole surround is reached) and by the film's own push outward along that direction: THE MORPHO-FIELD, the same algo as
//   the Dolbar swarm (anti-satellites.js), the film's optical flow measured off its frames by tools/morpho-field.mjs (block matching, 20 x 11
//   cells of 12 px over a 240 x 136 decode) for the window's own frames (on the hero lab/golden-field.js, frames 1362 to 1500, between the
//   two cuts). Each film frame, per direction, the flow is read at 8 points along the ray from the glass's edge to the picture's edge, under
//   the very pixels it moves (the stage mapped through the picture onto the decode), and its outward component averaged: the reach takes
//   base + gain x max(0, outward), so where the film pushes outward the light runs ahead and where it pushes inward the base alone carries
//   it (a quarter of each direction's push is shared with each neighbour, so the front is one body). What the golden field says (the tool's
//   summary): the burst's rays shoot out from its light 0.4 to 1.0 px of the decode a frame (outward, over 25 to 55 % of the cells) to 47.5 s,
//   the vortex swirls in at 47.6 s, the sun shrinks almost still, its white rays shoot out at 49.2 and 49.6 s (up to 2.9 px), cuts at 1362,
//   1485, 1492 and 1495. The front is feathered and lit by a gold line where it meets the page; the film near the glass is warmed by its light.
// - A CUT IN AND A CUT OUT (lab/CUTS.md, the rule of one: no dissolves): on at the flash's own frame, the liquor at the glass's floor and the
//   light at its edge; the box's faces take THE CUTS' device there (unboxing-plan.mjs: normals, gold matte, then the empty frame); off on the
//   end's cut. `ease` and `fade` (seconds; 0 on the hero) bring it in and drain it out for a page that wants them.
//
// THE COST. A canvas the stage's size, made when the flash comes and emptied when the window is over (0 x 0, no pixels held outside it). The
// field's bytes decoded once; the reach of the 64 directions over the window's frames integrated once per stage (each direction's 8 bilinear
// reads folded once into fixed weights on the 20 or so cells under its ray; a few ms, done in the page's idle time before the flash and again
// only on a resize). Then irradiancePlan is a lookup and a lerp (about a microsecond; irradiance.test.mjs holds it under 0.3 ms). Inside the
// window each presented film frame draws once: one clear, the film once (drawImage of the theater's crop, clipped to the front), a warm glow,
// six strokes that feather the front and two that light it, the glass's clear fill, the liquor's two fills and its meniscus (two strokes),
// one highlight; the glass's twenty corners projected (a hull of twenty points). Outside the window it only answers the film's timeupdate
// (about four a second while playing) with a comparison; at rest nothing at all: no frame callback waiting (in WebKit a waiting
// requestVideoFrameCallback costs 17 to 24 ms of CPU a second at rest, ko-edge.js), no timer, no requestAnimationFrame; a hidden document
// draws nothing and lets its frame callback go. prefers-reduced-motion: the inversion is a cut, in and out, and it stands still: the glass
// full, the film whole round it, no rise, no ripple, no front (the film in it plays, as the film plays in the sphere).
//
//   import {mountIrradiance} from './irradiance.js';
//   import {FIELD_GOLDEN} from './golden-field.js';
//   mountIrradiance({stage, film, at: 45.445, until: 50.05, field: FIELD_GOLDEN, after: theaterCanvas, glass: () => ({matrix}) | null, rest: [0, -0.42]});
//   -> {destroy, stats, at(t) (the plan at second t for the stage as it is), redraw() (the glass moved: draw the second again), element}
// The canvas goes in right after `after` (else after the stage's last canvas), with no z-index of its own; on the hero after the theater's
// canvas: over the page's sphere and the theater, under the box and what the page draws in front of the box (the twelve on their loop), under
// the page's controls. The plan is pure and tested without a browser (irradiance.test.mjs): irradiancePlan(t, geometry, moment) is a function
// of the film's second, the measured field and the stage alone.

export const FPS = 30000 / 1001;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ss = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const step = (a, b, x) => (b > a ? ss(a, b, x) : x >= b ? 1 : 0);   // a smoothstep, or a cut where the span is none
const TAU = Math.PI * 2;

export const IRRADIANCE = Object.freeze({
  ease: 0,                 // seconds: it comes in over this long from the flash (0: a cut on the film's own cut, CUTS.md)
  fill: 2.0,               // seconds: the liquor rises from the bottom of the glass to its top, poured at once and slower and slower
  fade: 0,                 // seconds: before the window's end it goes over this long, the liquor draining (0: it holds until the cut)
  base: 0.75,              // THE BASE SPEED: alone it carries every direction past the picture's far corner by this share of the window,
                           // (far corner - glass's edge) / (0.75 x the window) px a second
  gain: 1,                 // THE FIELD'S GAIN: the share of the film's own outward motion (px a second on the stage) the light takes as speed
  directions: 64,          // round the glass, from +x turning toward +y (down the page)
  samples: 8,              // flow reads along each direction's ray, from the glass's edge to the picture's edge
  share: 0.25,             // the share of a direction's push given to each of its two neighbours (the front stays one body)
  crop: Object.freeze([82, 4, 796, 532]),   // the picture in the film's px (theater-light.json crop) of the film's size below
  size: Object.freeze([960, 540]),          // the film's px (theater-light.json size)
  fit: 0.92,               // hero-ab.html createTheater({fit}): the picture's share of the stage's height (or width, if narrower)
  sphere: 0.2,             // the sphere's radius as a share of its canvas's shorter side when the page gives none (warm-sphere.js)
  sigma: Object.freeze([0.35, 1.15, 3.3]),  // the syrup's absorption a channel, per radius of path (syrup-glass.html, syrup-inside.html SIGMA)
  syrup: 0.5,              // radii of syrup per radius of chord through the glass's ball: how deep the amber reads
});

/**
 * THE MOMENT, from the mount: {at, until} film seconds (the flash's cut and the end's) and the morpho-field measured over its frames. Frozen,
 * with its span; throws on a moment that is not one (no default: the flash is the page's to name).
 */
const MOMENTS = new WeakMap();
export function momentOf({at, until, field} = {}) {
  if (!(Number.isFinite(at) && Number.isFinite(until) && until > at)) throw new Error(`irradiance: a moment needs at < until (film seconds), not ${at} to ${until}`);
  if (!(field && typeof field.flow === 'string' && Number.isInteger(field.from) && field.to > field.from)) throw new Error('irradiance: a moment needs its morpho-field (tools/morpho-field.mjs)');
  let byField = MOMENTS.get(field);
  if (!byField) MOMENTS.set(field, (byField = new Map()));
  const key = `${at}|${until}`;
  let out = byField.get(key);
  if (!out) byField.set(key, (out = Object.freeze({at, until, span: until - at, field})));
  return out;
}

/** The film's frames the moment shows: the first presented at or after `at`, the last before `until` (a frame shows from n / FPS on). */
export function framesOf({at, until}) {
  return [Math.ceil(at * FPS - 1e-9), Math.ceil(until * FPS - 1e-9) - 1];
}

/** The glass's edge in sphere radii: the page's dodecahedron (circumradius one) seen from its eye four circumradii away never reaches past 4 / sqrt(15). */
export const EDGE = 4 / Math.sqrt(15);

/** The theater's picture in a stage of width x height px: {x, y, w, h}, centred, its height `fit` of the stage's (theater.js: hd = min(1, aspect / FA) * fit). */
export function pictureOf(width, height, irr = IRRADIANCE) {
  const fa = irr.crop[2] / irr.crop[3], h = Math.min(1, width / height / fa) * irr.fit * height, w = h * fa;
  return {x: (width - w) / 2, y: (height - h) / 2, w, h};
}

// THE GLASS: the sphere's own dodecahedron (assembly-geometry.js buildAssemblySkin(0), theater.js's CORNERS and FACES): circumradius one, its
// twenty corners, its twelve faces' normals (the icosahedron's corners), each face's five corners in turn round it, and its thirty edges
const PHI = (1 + Math.sqrt(5)) / 2;
const unit3 = (v) => { const l = Math.hypot(...v); return v.map((c) => c / l); };
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const CORNERS = Object.freeze([[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
  [0, PHI, 1 / PHI], [0, PHI, -1 / PHI], [0, -PHI, 1 / PHI], [0, -PHI, -1 / PHI], [1 / PHI, 0, PHI], [-1 / PHI, 0, PHI], [1 / PHI, 0, -PHI],
  [-1 / PHI, 0, -PHI], [PHI, 1 / PHI, 0], [PHI, -1 / PHI, 0], [-PHI, 1 / PHI, 0], [-PHI, -1 / PHI, 0]].map((v) => Object.freeze(unit3(v))));
const FACES = [[0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI], [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1]].map(unit3);
const INRADIUS = 0.7947;
const RINGS = FACES.map((n) => {
  const five = CORNERS.map((v, i) => [v, i]).filter(([v]) => dot3(v, n) > 0.79);
  const u = unit3(five[0][0].map((c, i) => c - n[i] * INRADIUS)), w = cross3(n, u);
  return five.sort(([a], [b]) => Math.atan2(dot3(a, w), dot3(a, u)) - Math.atan2(dot3(b, w), dot3(b, u))).map(([, i]) => i);
});
const EDGES = (() => {
  const out = new Map();
  RINGS.forEach((ring, f) => ring.forEach((a, k) => {
    const b = ring[(k + 1) % 5], key = Math.min(a, b) * 32 + Math.max(a, b), e = out.get(key) ?? {a: Math.min(a, b), b: Math.max(a, b), faces: []};
    e.faces.push(f); out.set(key, e);
  }));
  return [...out.values()];
})();

/** The convex hull of points [[x, y]...], in turn round it (Andrew's monotone chain). */
function hullOf(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]), turn = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const q of p) { while (lower.length >= 2 && turn(lower.at(-2), lower.at(-1), q) <= 0) lower.pop(); lower.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (upper.length >= 2 && turn(upper.at(-2), upper.at(-1), q) <= 0) upper.pop(); upper.push(q); }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

/**
 * The glass as it is drawn, seen from the page's eye four circumradii away on +z (warm-sphere.js project(): x R 4 / (4 - z) from the eye's
 * axis, y up), `eye` [x, y] that axis on the stage and `radius` the circumradius in px. `pose` is the page's sphere's turn {yaw, pitch}
 * (warm-sphere.js rotate(); its rest pose when left out), the glass at the eye's axis; or the box's {matrix} (unboxing.js: its group's world
 * matrix, sixteen numbers column-major as three.js keeps them, in circumradii: its turn and its place). Returns {corners: the twenty on the
 * page, hull: its silhouette, convex, in turn round it, centre: its centre on the page, edges: [[x0, y0, x1, y1]...] those of the faces turned
 * to the eye (the page's own rule, a face's normal z over -0.02)}. Pure.
 */
export function glassOutline(pose, [ex, ey], radius) {
  const m = pose?.matrix;
  let place, turn;
  if (m && m.length >= 16 && Array.from(m).every(Number.isFinite)) {
    place = ([x, y, z]) => [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]];
    turn = ([x, y, z]) => [m[0] * x + m[4] * y + m[8] * z, m[1] * x + m[5] * y + m[9] * z, m[2] * x + m[6] * y + m[10] * z];
  } else {
    const yaw = Number.isFinite(pose?.yaw) ? pose.yaw : -0.32, pitch = Number.isFinite(pose?.pitch) ? pose.pitch : -0.12;
    const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    turn = ([x0, y0, z0]) => { const x = x0 * c - z0 * s, z = x0 * s + z0 * c; return [x, y0 * cp - z * sp, y0 * sp + z * cp]; };
    place = turn;
  }
  const seen = ([x, y, z]) => { const k = (radius * 4) / (4 - z); return [ex + x * k, ey - y * k]; };
  const corners = CORNERS.map((p) => seen(place(p))), centre = seen(place([0, 0, 0]));
  const front = FACES.map((n) => turn(n)[2] > -0.02), edges = [];
  for (const e of EDGES) if (front[e.faces[0]] || front[e.faces[1]]) edges.push([...corners[e.a], ...corners[e.b]]);
  return {corners, hull: hullOf(corners), centre, edges};
}

// THE FIELD, decoded once a field: [vx, vy] px a frame of the decode by cell, frame-major then row-major
const DECODED = new WeakMap();
function flowOf(field) {
  let out = DECODED.get(field);
  if (!out) {
    const s = atob(field.flow);
    out = new Int8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = (s.charCodeAt(i) << 24) >> 24;
    DECODED.set(field, out);
  }
  return out;
}

/**
 * THE REACH for one stage and one moment, integrated once from its field (memoized: a resize makes another): geometry {centre: [x, y] (where
 * the light starts: the glass's centre), radius (the glass's circumradius, px), width, height (the stage's, px)}. Returns {table:
 * Float32Array(steps x directions), the reach of each direction in px from the centre at each film frame since the flash, steps, edge (the
 * glass's edge, where every reach starts), far (the picture's far corner from the centre), base (px a second), picture}. Step i holds the
 * reach at the flash's second + i / FPS; between step i - 1 and i the film shows frame round(at x FPS) + i, and that frame's flow (its motion
 * from the frame before) is what pushes. Pure.
 */
const TABLES = new WeakMap();
export function reachFor({centre: [cx, cy], radius: r, width: W, height: H}, moment, irr = IRRADIANCE) {
  const {at, span, field} = momentOf(moment);
  let memo = TABLES.get(field);
  if (!memo) TABLES.set(field, (memo = new Map()));
  const key = [cx, cy, r, W, H].map((v) => Math.round(v)).join('|') + `|${at}|${span}` + (irr === IRRADIANCE ? '' : JSON.stringify(irr));
  const hit = memo.get(key);
  if (hit) return hit;
  const D = irr.directions, S = irr.samples, steps = Math.ceil(span * FPS) + 1, picture = pictureOf(W, H, irr);
  const [X0, Y0, CW, CH] = irr.crop, [FW, FH] = irr.size, [DW, DH] = field.decode, [COLS, ROWS] = field.grid, [OX, OY] = field.origin;
  const cell = field.cell, PER = COLS * ROWS * 2, flow = flowOf(field), frames = field.to - field.from;
  // the stage's px a px of the decode, across and down (the picture's px a film px, the film's px a decode px)
  const sx = (picture.w / CW) * (FW / DW), sy = (picture.h / CH) * (FH / DH);
  const edge = r * EDGE, corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b]) => Math.hypot(picture.x + a * picture.w - cx, picture.y + b * picture.h - cy));
  const far = Math.max(...corners), base = Math.max(0, far - edge) / (irr.base * span);
  // per direction its reads: S points from the glass's edge to where its ray leaves the picture, each read between its four nearest cells'
  // centres (anti-satellites.js flowAt); the mean of their outward parts is a fixed weighing of the cells under the ray, summed here once:
  // for each cell a weight on its vx and one on its vy (a flow of (vx, vy) px of the decode moves the stage (vx sx, vy sy) px)
  const lists = [], start = new Int32Array(D + 1);
  for (let d = 0; d < D; d++) {
    const a = (d / D) * TAU, ux = Math.cos(a), uy = Math.sin(a), weigh = new Map();
    let t0 = edge, t1 = Infinity;
    for (const [p, u, lo, hi] of [[cx, ux, picture.x, picture.x + picture.w], [cy, uy, picture.y, picture.y + picture.h]]) {
      if (Math.abs(u) < 1e-9) { if (p < lo || p > hi) t1 = -Infinity; continue; }
      const e0 = (lo - p) / u, e1 = (hi - p) / u;
      t0 = Math.max(t0, Math.min(e0, e1)); t1 = Math.min(t1, Math.max(e0, e1));
    }
    if (t1 > t0) for (let j = 0; j < S; j++) {
      const t = t0 + ((j + 0.5) / S) * (t1 - t0), px = cx + ux * t, py = cy + uy * t;
      // the stage's point to the decode: through the picture onto the film's crop, the film onto the decode
      const fx = ((X0 + ((px - picture.x) / picture.w) * CW) / FW) * DW, fy = ((Y0 + ((py - picture.y) / picture.h) * CH) / FH) * DH;
      const u = clamp((fx - OX) / cell - 0.5, 0, COLS - 1), v = clamp((fy - OY) / cell - 0.5, 0, ROWS - 1);
      const c0 = Math.min(Math.floor(u), COLS - 2), r0 = Math.min(Math.floor(v), ROWS - 2), wa = u - c0, wb = v - r0;
      for (const [dc, dr, w] of [[0, 0, (1 - wa) * (1 - wb)], [1, 0, wa * (1 - wb)], [0, 1, (1 - wa) * wb], [1, 1, wa * wb]]) {
        if (!w) continue;
        const idx = ((r0 + dr) * COLS + c0 + dc) * 2, had = weigh.get(idx) ?? 0;
        weigh.set(idx, had + w / S);
      }
    }
    for (const [idx, w] of weigh) lists.push([idx, w * ux * sx, w * uy * sy]);
    start[d + 1] = lists.length;
  }
  const cellAt = Int32Array.from(lists, (l) => l[0]), onX = Float32Array.from(lists, (l) => l[1]), onY = Float32Array.from(lists, (l) => l[2]);
  const table = new Float32Array(steps * D), push = new Float32Array(D), first = Math.round(at * FPS);
  table.fill(edge, 0, D);
  for (let i = 1; i < steps; i++) {
    const k = first + i - field.from, live = k >= 0 && k < frames, F = k * PER;
    for (let d = 0; d < D; d++) {
      let sum = 0;
      if (live) for (let m = start[d], end = start[d + 1]; m < end; m++) sum += flow[F + cellAt[m]] * onX[m] + flow[F + cellAt[m] + 1] * onY[m];
      push[d] = Math.max(0, sum);   // px a frame outward on the stage, never inward
    }
    for (let d = 0; d < D; d++) {
      const shared = (1 - 2 * irr.share) * push[d] + irr.share * (push[(d + D - 1) % D] + push[(d + 1) % D]);
      table[i * D + d] = table[(i - 1) * D + d] + base / FPS + irr.gain * shared;
    }
  }
  const out = Object.freeze({table, steps, edge, far, base, picture: Object.freeze(picture)});
  if (memo.size > 3) memo.delete(memo.keys().next().value);
  memo.set(key, out);
  return out;
}

/** The liquor's level `age` seconds after the flash in a window of `span` seconds, 0 (the glass's bottom) to 1 (its top): poured into a ball,
 *  drained over the window's last `fade` seconds (none: it holds until the end's cut). Pure. */
export function levelAt(age, span, irr = IRRADIANCE) {
  if (!(age >= 0 && age < span)) return 0;
  const poured = 1 - (1 - clamp(age / irr.fill)) ** 2, left = 1 - step(span - irr.fade, span, age), v = Math.min(poured, left);
  return v >= 1 ? 1 : v <= 0 ? 0 : 0.5 - Math.sin(Math.asin(1 - 2 * v) / 3);   // the section h of a ball holding v of it: 3h² - 2h³ = v
}

const off = (D) => ({on: false, k: 0, age: 0, level: 0, reach: new Float32Array(D), alpha: 0});

/**
 * THE PLAN at the film's second t for a stage (geometry {centre: [x, y], radius, width, height} in px) and a moment ({at, until, field}): {on,
 * k (the share of the window gone, 0..1), age (seconds since the flash), level (the liquor's, 0..1), reach: Float32Array(64) (the light's reach
 * in each direction, px from the centre; direction d at 2 pi d / 64 from +x toward +y), alpha (0..1)}; all zero and off outside [at, until).
 * Reduced: on and still, the glass full, every reach past the picture's far corner, alpha 1 (a cut in and a cut out). Pure (memoized: a lookup
 * and a lerp a call).
 */
export function irradiancePlan(t, geometry, moment, irr = IRRADIANCE, {reduced = false} = {}) {
  const D = irr.directions, m = momentOf(moment);
  if (!(t >= m.at && t < m.until) || !(geometry?.radius > 0)) return off(D);   // the window as the mount reads it
  const age = Math.max(0, Math.min(t - m.at, m.span * (1 - 1e-12))), plan = reachFor(geometry, m, irr), reach = new Float32Array(D), k = age / m.span;
  if (reduced) return {on: true, k, age, level: 1, reach: reach.fill(plan.far + geometry.radius), alpha: 1};
  const f = Math.min(age * FPS, plan.steps - 1.000001), i = Math.floor(f), a = f - i, T = plan.table;
  for (let d = 0, j = i * D; d < D; d++, j++) reach[d] = T[j] + (T[j + D] - T[j]) * a;
  const alpha = step(0, irr.ease, age) * (1 - step(m.span - irr.fade, m.span, age));
  return {on: true, k, age, level: levelAt(age, m.span, irr), reach, alpha};
}

// the syrup's amber along a chord through the glass's ball, by the share of its radius from the centre (Beer-Lambert, the bench's sigma)
const amber = (rho, irr) => {
  const chord = 2 * Math.sqrt(Math.max(0, 1 - rho * rho)) * irr.syrup, lit = [0.985, 0.95, 0.88], glow = [34, 16, 2];
  return `rgb(${irr.sigma.map((s, c) => Math.round(Math.min(255, 255 * lit[c] * Math.exp(-s * chord) + glow[c] * (1 - rho)))).join(',')})`;
};
const FEATHER = [0.36, 0.28, 0.2, 0.13, 0.07, 0.025];   // the front's feather strokes, in sphere radii wide

/**
 * Paint one plan on a 2D context in the stage's css px (the caller clears it and sets the pixel ratio): the film where the light has reached
 * (`film` drawn from the theater's crop to the picture, clipped to the front; nothing of it when the film has no frame yet), its warmth near
 * the glass, the front feathered and lit, then the glass (`glass`, glassOutline's; the page's sphere at the geometry's centre when none)
 * emptied and its liquor, meniscus and highlight, and its gold edges when `edges` (on the hero the box draws its own frames over it).
 * `still`: no ripple. Returns the glass.
 */
export function paintIrradiance(g, {plan: p, geometry, glass = null, pose = null, film = null, irr = IRRADIANCE, still = false, edges = true}) {
  const [cx, cy] = geometry.centre, r = geometry.radius, D = p.reach.length, picture = pictureOf(geometry.width, geometry.height, irr);
  const fx = new Float64Array(D), fy = new Float64Array(D);
  for (let d = 0; d < D; d++) { const a = (d / D) * TAU; fx[d] = cx + Math.cos(a) * p.reach[d]; fy[d] = cy + Math.sin(a) * p.reach[d]; }
  const front = () => {   // a closed curve through the 64 reaches' midpoints
    g.beginPath();
    g.moveTo((fx[D - 1] + fx[0]) / 2, (fy[D - 1] + fy[0]) / 2);
    for (let d = 0; d < D; d++) { const e = (d + 1) % D; g.quadraticCurveTo(fx[d], fy[d], (fx[d] + fx[e]) / 2, (fy[d] + fy[e]) / 2); }
    g.closePath();
  };
  g.lineJoin = 'round';
  // THE LIGHT OUTSIDE: the film where the light from inside has reached, in the theater's picture
  if (film && film.readyState >= 2 && film.videoWidth > 0) {
    const kx = film.videoWidth / irr.size[0], ky = film.videoHeight / irr.size[1], [X0, Y0, CW, CH] = irr.crop;
    g.save();
    front(); g.clip();
    g.drawImage(film, X0 * kx, Y0 * ky, CW * kx, CH * ky, picture.x, picture.y, picture.w, picture.h);
    // lit from inside: the film warmed near the glass, less and less outward
    const warm = g.createRadialGradient(cx, cy, r * EDGE, cx, cy, r * 3.2);
    warm.addColorStop(0, 'rgba(255,214,150,0.42)'); warm.addColorStop(0.35, 'rgba(255,206,140,0.14)'); warm.addColorStop(1, 'rgba(255,200,130,0)');
    g.globalCompositeOperation = 'screen'; g.fillStyle = warm; g.fillRect(picture.x, picture.y, picture.w, picture.h);
    g.restore();
    // the front feathered: its last tenth of a radius lets the page through more and more
    g.save();
    g.globalCompositeOperation = 'destination-out'; g.strokeStyle = 'rgba(0,0,0,0.3)';
    front();
    for (const w of FEATHER) { g.lineWidth = Math.max(1, w * r); g.stroke(); }
    g.restore();
    // where the light meets the page, a gold line (inside the picture: past its edge there is no film to light)
    g.save();
    g.beginPath(); g.rect(picture.x, picture.y, picture.w, picture.h); g.clip();
    front();
    g.strokeStyle = 'rgba(255,226,160,0.22)'; g.lineWidth = 7; g.stroke();
    g.strokeStyle = 'rgba(201,160,82,0.85)'; g.lineWidth = 1.2; g.stroke();
    g.restore();
  }
  // THE LIQUOR: the glass emptied of the film, filled from its bottom
  const seen = glass ?? glassOutline(pose, geometry.centre, r), hull = seen.hull, [gx, gy] = seen.centre;
  let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity;
  for (const [x, y] of hull) { top = Math.min(top, y); bottom = Math.max(bottom, y); left = Math.min(left, x); right = Math.max(right, x); }
  const R = r * EDGE, x0 = left - 2, x1 = right + 2;
  g.save();
  g.beginPath(); hull.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.clip();
  // clear glass on the page's paper, a touch darker and warmer toward its rim
  const clear = g.createRadialGradient(gx - 0.18 * r, gy - 0.22 * r, r * 0.1, gx, gy, R);
  clear.addColorStop(0, 'rgb(253,251,245)'); clear.addColorStop(0.7, 'rgb(246,241,229)'); clear.addColorStop(1, 'rgb(226,216,194)');
  g.fillStyle = clear; g.fillRect(x0, top - 2, x1 - x0, bottom - top + 4);
  if (p.level > 0) {
    const stirred = p.age < irr.fill ? 1 : Math.exp(-(p.age - irr.fill) / 0.9), amp = still ? 0 : r * (0.006 + 0.03 * stirred);
    const level = bottom + amp - p.level * (bottom - top + 2 * amp);   // at 1 the waves' troughs clear the top, at 0 their crests the bottom
    const wave = (x) => amp * (0.65 * Math.sin((x - gx) / (r * 0.29) + p.age * 3.1) + 0.35 * Math.sin((x - gx) / (r * 0.12) - p.age * 5.3 + 1.3));
    const surface = (close) => {
      g.beginPath();
      for (let j = 0; j <= 28; j++) { const x = x0 + (j / 28) * (x1 - x0), y = level + wave(x); if (j) g.lineTo(x, y); else g.moveTo(x, y); }
      if (close) { g.lineTo(x1, bottom + 2); g.lineTo(x0, bottom + 2); g.closePath(); }
    };
    // the amber: darker where the way through the ball is longer
    const syrup = g.createRadialGradient(gx, gy, 0, gx, gy, R);
    for (const rho of [0, 0.35, 0.6, 0.8, 0.92, 0.98, 1]) syrup.addColorStop(rho, amber(rho, irr));
    surface(true); g.fillStyle = syrup; g.fill();
    // and deeper down: the light from the surface dies as it goes
    const deep = g.createLinearGradient(0, level, 0, bottom);
    deep.addColorStop(0, 'rgb(255,255,255)'); deep.addColorStop(1, 'rgb(176,138,108)');
    g.globalCompositeOperation = 'multiply'; g.fillStyle = deep; g.fill();
    g.globalCompositeOperation = 'source-over';
    // the meniscus: its sheen and its bright line
    surface(false);
    g.strokeStyle = 'rgba(255,236,190,0.28)'; g.lineWidth = 4; g.stroke();
    g.strokeStyle = 'rgba(255,224,150,0.9)'; g.lineWidth = 1.3; g.stroke();
  }
  // the key light's highlight on the glass (the half-way between the page's light and the eye)
  const hx = gx - 0.18 * R, hy = gy - 0.39 * R, shine = g.createRadialGradient(hx, hy, 0, hx, hy, r * 0.42);
  shine.addColorStop(0, 'rgba(255,255,255,0.55)'); shine.addColorStop(0.5, 'rgba(255,255,255,0.14)'); shine.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = shine; g.fillRect(x0, top - 2, x1 - x0, bottom - top + 4);
  g.restore();
  // the sphere's gold edges over it (warm-sphere.js's pentagon hairline colour, a little bolder); the box draws its own frames
  if (edges) {
    g.beginPath();
    for (const [ax, ay, bx, by] of seen.edges) { g.moveTo(ax, ay); g.lineTo(bx, by); }
    g.strokeStyle = 'rgba(151,113,42,0.74)'; g.lineWidth = 0.9; g.stroke();
  }
  return seen;
}

/**
 * Put the inversion on the hero's stage, driven by its film, for the moment the page names: {stage, film, at, until (film seconds: the flash's
 * cut and the end's), field (its morpho-field), glass (optional: () => {matrix} for a glass drawn by another canvas, the box's, read at each
 * draw, or null for the page's own sphere), rest ([x, y] circumradii from the eye's axis, y up: where that glass stands, where the light
 * starts from; [0, 0] for the page's sphere), after (the element the layer goes after; else the stage's last canvas), edges (draw the
 * glass's gold edges: false where the glass draws its own)}. Returns {destroy, stats, at, redraw, element}.
 */
export function mountIrradiance({stage, film, at, until, field, glass = null, rest = [0, 0], after = null, edges = true, sphere = null, sphereCanvas = null, irr = IRRADIANCE, reduced} = {}) {
  const moment = momentOf({at, until, field});
  const doc = stage.ownerDocument, view = doc.defaultView;
  const still = reduced ?? Boolean(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  if (view.getComputedStyle(stage).position === 'static') stage.style.position = 'relative';
  const canvases = [...stage.children].filter((el) => el.tagName === 'CANVAS');
  const page = sphereCanvas ?? stage.querySelector?.('#genesis-sphere') ?? canvases[0] ?? null;
  const handleOf = () => sphere ?? view.genesisSphere ?? null;
  const layer = doc.createElement('canvas');
  layer.id = 'hero-irradiance';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, {position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', pointerEvents: 'none', visibility: 'hidden'});
  layer.width = 0; layer.height = 0;
  const anchor = after ?? canvases.at(-1) ?? null;
  if (anchor) anchor.after(layer); else stage.append(layer);

  // the boxes, read when the flash comes and on a resize while it is in: the layer's css size and the sphere canvas's place in it
  let box = null, ctx = null, dpr = 1;
  const measure = () => {
    const l = layer.getBoundingClientRect(), s = page?.getBoundingClientRect?.() ?? l;
    return {w: Math.max(1, l.width), h: Math.max(1, l.height), sx: s.left - l.left, sy: s.top - l.top, sw: Math.max(1, s.width), sh: Math.max(1, s.height)};
  };
  const fit = () => {
    box = measure();
    dpr = Math.min(view.devicePixelRatio || 1, 2);
    const W = Math.round(box.w * dpr), H = Math.round(box.h * dpr);
    if (layer.width !== W || layer.height !== H) { layer.width = W; layer.height = H; }
    ctx = layer.getContext('2d');
  };
  const empty = () => { if (layer.width || layer.height) { layer.width = 0; layer.height = 0; } ctx = null; };
  // the stage as the plan takes it: the eye's axis where warm-sphere.js draw() puts the sphere's centre (55 % across and halfway down its
  // canvas), the radius `radius` of the shorter side; the glass the page's sphere there (its turn the page's) or the one `glass` gives, the
  // light starting where that glass stands (`rest`)
  const seenGlass = () => { try { const g = glass?.(); return g?.matrix ? g : null; } catch { return null; } };
  const stageFrame = (b = box, other = seenGlass()) => {
    const s = handleOf()?.getViewState?.(), r = Math.min(b.sw, b.sh) * (Number.isFinite(s?.radius) ? s.radius : irr.sphere);
    const eye = [b.sx + b.sw * 0.55, b.sy + b.sh * 0.5], [rx, ry] = other ? rest : [0, 0];
    return {centre: [eye[0] + rx * r, eye[1] - ry * r], radius: r, width: b.w, height: b.h, eye, pose: other ?? {yaw: s?.yaw, pitch: s?.pitch}};
  };

  let waiting = null, frames = 0, draws = 0, drawMs = 0, drawMax = 0, shown = false, last = null, said = '', readyMs = null, boxGlass = 0;
  const inside = (t) => t >= moment.at && t < moment.until;
  const near = (t) => t >= moment.at - 1 && t < moment.until + 0.25;
  const draw = (t) => {
    const t0 = view.performance.now(), geometry = stageFrame(), p = irradiancePlan(t, geometry, moment, irr, {reduced: still}), g = ctx;
    const outline = glassOutline(geometry.pose, geometry.eye, geometry.radius);
    if (geometry.pose.matrix) boxGlass++;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, layer.width, layer.height);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintIrradiance(g, {plan: p, geometry, glass: outline, film, irr, still, edges});
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    // the fade is the compositor's: one opacity, the sphere canvas's own with it (the panel's C and B fade the page's sphere)
    const own = page?.style?.opacity, kept = own === '' || own == null || !Number.isFinite(Number(own)) ? 1 : clamp(Number(own));
    layer.style.opacity = (p.alpha * kept).toFixed(3);
    draws++;
    const ms = view.performance.now() - t0;
    drawMs += ms; drawMax = Math.max(drawMax, ms);
    let lo = Infinity, hi = 0;
    for (const v of p.reach) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    last = {t, k: p.k, level: p.level, alpha: p.alpha, reach: [lo, hi], glass: geometry.pose.matrix ? 'given' : 'page', centre: outline.centre.map((v) => Math.round(v * 10) / 10)};
  };
  const apply = (t) => {
    if (!inside(t)) {
      if (shown) { shown = false; said = ''; layer.style.visibility = 'hidden'; empty(); }
      return;
    }
    if (doc.hidden) return;   // a hidden page draws nothing; it is drawn again when it shows
    const key = String(Math.floor(t * FPS + 0.5));   // the frame whose half-frame span holds t
    if (shown && key === said) return;   // the same frame drawn already (a timeupdate after the frame callback)
    if (!shown) { shown = true; fit(); layer.style.visibility = 'visible'; }
    said = key;
    draw(t);
  };
  const framed = typeof film.requestVideoFrameCallback === 'function';
  const ask = () => { if (waiting === null && !doc.hidden && framed) waiting = film.requestVideoFrameCallback(onFrame); };
  const stop = () => { if (waiting !== null) { film.cancelVideoFrameCallback?.(waiting); waiting = null; } };
  function onFrame(now, meta) {
    waiting = null; frames++;
    apply(meta?.mediaTime ?? film.currentTime);
    if (!film.paused && near(film.currentTime)) ask();
  }
  // while the film plays its presented frames draw (each at its own mediaTime); a timeupdate then only arms them, and hides the layer past
  // the window: drawn from a timeupdate half a frame early, a frame's own callback would find it said and the film outside would lag a frame
  const onTime = () => { const t = film.currentTime; if (film.paused || !framed || !inside(t)) apply(t); if (!film.paused && near(t)) ask(); else if (film.paused) stop(); };
  const onPause = () => { stop(); apply(film.currentTime); };
  const onSeek = () => { said = ''; onTime(); };
  const onShow = () => { if (doc.hidden) stop(); else { said = ''; onTime(); } };
  const on = {play: onTime, playing: onTime, timeupdate: onTime, seeked: onSeek, pause: onPause, ended: onPause, emptied: onPause};
  for (const [type, fn] of Object.entries(on)) film.addEventListener(type, fn);
  doc.addEventListener?.('visibilitychange', onShow);
  // in idle time: the reach for this stage (a few ms of integration, never on a frame of the window), made again when the stage is resized;
  // for the glass that will stand there at the flash (the one `glass` gives, at `rest`, when the page gives one)
  const ready = () => {
    try {
      fit();
      const t0 = view.performance.now();
      reachFor(stageFrame(box, glass ? {matrix: null} : null), moment, irr);
      readyMs = view.performance.now() - t0;
      if (!shown) empty();
    } catch {}
  };
  const idle = () => { if (view.requestIdleCallback) view.requestIdleCallback(ready, {timeout: 4000}); else view.setTimeout(ready, 0); };
  const resized = typeof view.ResizeObserver === 'function' ? new view.ResizeObserver(() => { if (shown) { fit(); said = ''; apply(film.currentTime); } else idle(); }) : null;
  resized?.observe(stage);
  idle();
  onTime();

  const handle = {
    at: (t) => irradiancePlan(t, stageFrame(box ?? measure()), moment, irr, {reduced: still}),
    /** the glass moved without a film frame (the box drew on a seek or took over): the second is drawn again, if it is inside the window;
     *  while the film plays its next presented frame draws it */
    redraw() { said = ''; if (film.paused || !framed) apply(film.currentTime); },
    get stats() { return {draws, frames, drawMs, drawMax, readyMs, waiting: waiting !== null, shown, reduced: still, pixels: [layer.width, layer.height], boxGlass, last, moment: [moment.at, moment.until], field: [field.from, field.to]}; },
    element: layer,
    destroy() {
      stop();
      for (const [type, fn] of Object.entries(on)) film.removeEventListener(type, fn);
      doc.removeEventListener?.('visibilitychange', onShow);
      resized?.disconnect();
      layer.remove();
      empty();
    },
  };
  layer.irradiance = handle;   // for a reader (a proof): the page's line keeps no name for it
  return handle;
}
