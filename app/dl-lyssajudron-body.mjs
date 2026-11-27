// dl-lyssajudron-body.mjs: HER BODY ALIVE, the DMC4 Lyssajudron drawn as pixel art every frame (his Oct 22 2026 16:5x WEST, over her redrawn sprite:
// "are you able to animate it properly as a sprite alive glowin oscillating and such"). Her render's own shape (the storyboard's 13-the-bar; the house
// builds her body on a Goldberg polyhedron, poleis/orb.js buildGoldberg): unit0, a see-through silver truncated icosahedron turning slowly and bobbing;
// her one red eye, its glow pulsing, blinking now and then, half-lidded when she is unimpressed; six navy satellites orbiting her in depth, in front
// and behind; sparks twinkling round them; crimson fins flickering under her like a flame. THE CHARGE swells her, blazes her eye and flings her
// satellites and sparks outward.
// Drawn small (PIX) into its own pixels (no canvas path, so nothing is smoothed): spans for the faces, Bresenham for the seams, the see-through glass
// as a checkerboard (pixel art's own transparency), a dark outline round the bodies as Athena's sprite has, the sparks and the glow after it. Shown large
// with image-rendering: pixelated. Pure: soccer() and drawBody(px, t, mood) write a Uint32 buffer; nothing here touches a page.
export const PIX = 150;   // her drawing's side in pixels (room round her for the charge's flung satellites)
export const CORE_R = 26;   // unit0's radius in those pixels
const PHI = (1 + Math.sqrt(5)) / 2;
// her palette, read off her render and its redrawing (assets/lyssajudron-burst.png)
export const INK = Object.freeze({
  outline: 0x0a0910, glassDark: 0x22232c, glass: 0x3d4150, glassLit: 0x7f8597, seam: 0xcfd3de, seamBack: 0x4a4f62,
  navy: 0x1d1f4a, navyLit: 0x2f3478, periwinkle: 0x6762d4, lavender: 0x8f8af0, lavenderLit: 0xc2bfff,
  socket: 0x17171d, iris: 0xff2438, irisDeep: 0xa3101f, pupil: 0x0d0a0c, glint: 0xffffff, lid: 0x2a2b33, lidRim: 0x6b6f80,
  fin: 0xe3173a, finDeep: 0x8e0f25, finLit: 0xff6a7f, sparks: [0x2fd6b4, 0x7dffc4, 0xff6fcf, 0xb48cff, 0xf4f2ff]});
// her moods: how open her eye is, how bright its glow, how far her satellites fly, how fast her sparks stream, how large she is
export const MOODS = Object.freeze({
  awake: {lid: 0, glow: 0.6, spread: 1, stream: 0, swell: 1},
  unimpressed: {lid: 0.48, glow: 0.35, spread: 0.92, stream: 0, swell: 1},
  charge: {lid: 0, glow: 1, spread: 1.3, stream: 1, swell: 1.18},
  empty: {lid: 0.62, glow: 0.06, spread: 0.78, stream: 0, swell: 0.93},   // ON AN EMPTY TANK (dl-lyssajudron.js SCENES.empty): her eye near dark, her moons pulled in
});

/** soccer(): the truncated icosahedron, Goldberg GP(1,1): 60 unit vertices and 32 faces (12 pentagons, 20 hexagons), each a loop of vertex indices
 *  counter-clockwise seen from outside, with its centre's direction. Pure. */
export function soccer() {
  const norm = (p) => { const l = Math.hypot(p[0], p[1], p[2]); return [p[0] / l, p[1] / l, p[2] / l]; };
  const key = (p) => p.map((x) => (Math.abs(x) < 1e-9 ? 0 : x).toFixed(5)).join(',');
  const evenPerms = ([a, b, c]) => [[a, b, c], [b, c, a], [c, a, b]];
  const signed = (p) => { const out = []; for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) out.push([p[0] * sx, p[1] * sy, p[2] * sz]); return out; };
  const unique = (list) => { const seen = new Map(); for (const p of list) seen.set(key(p), p); return [...seen.values()]; };
  const V = unique([[0, 1, 3 * PHI], [1, 2 + PHI, 2 * PHI], [PHI, 2, 2 * PHI + 1]].flatMap((b) => evenPerms(b).flatMap(signed))).map(norm);
  const centres = [...unique(evenPerms([0, 1, PHI]).flatMap(signed)).map((c) => [norm(c), 5]),
    ...unique([...signed([1, 1, 1]), ...evenPerms([0, PHI, 1 / PHI]).flatMap(signed)]).map((c) => [norm(c), 6])];   // the hexagons: the icosahedron's faces
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const faces = centres.map(([c, n]) => {
    const near = V.map((v, i) => [dot(v, c), i]).sort((a, b) => b[0] - a[0]).slice(0, n).map(([, i]) => i);
    const u = norm(cross(c, Math.abs(c[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), w = cross(c, u);
    return {c, loop: near.sort((a, b) => Math.atan2(dot(V[a], w), dot(V[a], u)) - Math.atan2(dot(V[b], w), dot(V[b], u)))};
  });
  return {V, faces};
}
const BALL = soccer();

const rotation = (ax, ay, az) => {   // Rz * Ry * Rx, as rows
  const [ca, sa, cb, sb, cc, sc] = [Math.cos(ax), Math.sin(ax), Math.cos(ay), Math.sin(ay), Math.cos(az), Math.sin(az)];
  return [[cc * cb, cc * sb * sa - sc * ca, cc * sb * ca + sc * sa], [sc * cb, sc * sb * sa + cc * ca, sc * sb * ca - cc * sa], [-sb, cb * sa, cb * ca]];
};
const turn = (R, p) => [R[0][0] * p[0] + R[0][1] * p[1] + R[0][2] * p[2], R[1][0] * p[0] + R[1][1] * p[1] + R[1][2] * p[2], R[2][0] * p[0] + R[2][1] * p[1] + R[2][2] * p[2]];
const LIGHT = (() => { const l = [-0.5, 0.62, 0.6], n = Math.hypot(...l); return l.map((x) => x / n); })();
// a seeded random, so her satellites and sparks keep their places from frame to frame (and in a test)
const seeded = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
const R0 = seeded(7);
export const SATELLITES = Object.freeze(Array.from({length: 6}, (_, i) => Object.freeze({
  r: 1.62 + R0() * 0.5, tilt: (i % 2 ? 1 : -1) * (0.62 + R0() * 0.3), phase: (i / 6) * Math.PI * 2 + R0() * 0.4, speed: 0.32 + R0() * 0.22, size: 0.3 + R0() * 0.08,
  spin: 0.5 + R0()})));   // tilted enough that a satellite passing in front of her goes above or below her eye, never across it
export const SPARKS = Object.freeze(Array.from({length: 46}, () => Object.freeze({
  r: 1.15 + R0() * 1.35, a: R0() * Math.PI * 2, h: -0.9 + R0() * 1.8, speed: 0.25 + R0() * 0.6, tw: R0() * 6.283, ink: Math.floor(R0() * 5), big: R0() < 0.22})));

/** createPixels(side): her buffer: the RGBA bytes a page puts on its canvas, a Uint32 view of them (0xAABBGGRR), and the bodies' mask (for the outline). */
export function createPixels(side = PIX) {
  const bytes = new Uint8ClampedArray(side * side * 4);
  return {side, bytes, u32: new Uint32Array(bytes.buffer), body: new Uint8Array(side * side)};
}
const abgr = (rgb, a = 255) => ((a << 24) | ((rgb & 0xff) << 16) | (rgb & 0xff00) | ((rgb >> 16) & 0xff)) >>> 0;

function rasterizer(px) {
  const {side, u32, body} = px;
  const put = (x, y, rgb, isBody = true) => { if (x < 0 || y < 0 || x >= side || y >= side) return; const i = y * side + x; u32[i] = abgr(rgb); if (isBody) body[i] = 1; };
  const span = (pts, rgb, dither = false, isBody = true) => {   // a filled polygon, scanline by scanline; dither: every other pixel (the glass)
    let y0 = Infinity, y1 = -Infinity;
    for (const [, y] of pts) { if (y < y0) y0 = y; if (y > y1) y1 = y; }
    for (let y = Math.max(0, Math.ceil(y0)); y <= Math.min(side - 1, Math.floor(y1)); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
        if ((ay <= y && by > y) || (by <= y && ay > y)) xs.push(ax + ((y - ay) / (by - ay)) * (bx - ax));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.max(0, Math.ceil(xs[k])); x <= Math.min(side - 1, Math.floor(xs[k + 1])); x++) if (!dither || ((x + y) & 1) === 0) put(x, y, rgb, isBody);
    }
  };
  const line = (x0, y0, x1, y1, rgb, isBody = true) => {   // Bresenham
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (let n = 0; n < 512; n++) { put(x0, y0, rgb, isBody); if (x0 === x1 && y0 === y1) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; } }
  };
  const disc = (cx, cy, r, rgb, isBody = true, keep = () => true) => {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy); if (d <= r && keep(x, y, d)) put(x, y, rgb, isBody);
    }
  };
  return {put, span, line, disc};
}

/** drawBall(draw, at, radius, R, look): one Goldberg ball: its back seams dim, its faces as glass (lit by LIGHT, the glass dithered over the seams behind
 *  it), its front seams bright. look: the core's silver or a satellite's navy. */
function drawBall(draw, [cx, cy], radius, R, look) {
  const P = BALL.V.map((v) => { const p = turn(R, v); return [cx + p[0] * radius, cy - p[1] * radius, p[2]]; });
  const faces = BALL.faces.map((f) => ({f, n: turn(R, f.c)})).sort((a, b) => a.n[2] - b.n[2]);
  if (look.glass) for (const {f, n} of faces) if (n[2] <= 0) {   // behind: the seams through the glass (the core's alone: a satellite is solid)
    const pts = f.loop.map((i) => P[i]);
    draw.span(pts, look.back, false);
    for (let k = 0; k < pts.length; k++) draw.line(pts[k][0], pts[k][1], pts[(k + 1) % pts.length][0], pts[(k + 1) % pts.length][1], look.seamBack);
  }
  for (const {f, n} of faces) if (n[2] > 0) {
    const pts = f.loop.map((i) => P[i]), lit = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2];
    draw.span(pts, lit > 0.72 ? look.lit : look.face, look.glass && lit <= 0.72);   // a face toward the light shines whole; the rest of the core is glass
    for (let k = 0; k < pts.length; k++) draw.line(pts[k][0], pts[k][1], pts[(k + 1) % pts.length][0], pts[(k + 1) % pts.length][1], look.seam);
  }
}
const CORE = Object.freeze({glass: true, back: INK.glassDark, face: INK.glass, lit: INK.glassLit, seam: INK.seam, seamBack: INK.seamBack});
const MOON = Object.freeze({glass: false, face: INK.navy, lit: INK.navyLit, seam: INK.periwinkle});

/** blinkAt(t): her eye's lid from a blink (0 open, 1 shut): a blink of 0.14 s every 3.7 s, a second one sometimes after it. Pure. */
export function blinkAt(t) {
  const k = t % 3.7, b = (c) => { const d = Math.abs(k - c); return d < 0.07 ? 1 - d / 0.07 : 0; };
  return Math.max(b(3.2), Math.floor(t / 3.7) % 3 === 1 ? b(3.45) : 0);
}

/** drawBody(px, t, mood, {rise}): her, alive, at t seconds, into the buffer: cleared, the bodies, the outline, then the sparks and her eye's glow.
 *  rise: 0..1 out of her box (0: inside it, unseen below the drawing's floor; 1: at rest). Returns the buffer. */
export function drawBody(px, t, mood = MOODS.awake, {rise = 1} = {}) {
  const {side, u32, body} = px, m = {...MOODS.awake, ...mood};
  u32.fill(0); body.fill(0);
  const draw = rasterizer(px);
  const rest = side * 0.46, bob = Math.sin(t * 2.3) * 1.6, swell = m.swell * (1 + Math.sin(t * 1.7) * 0.012);
  const cx = side / 2, cy = rest + bob + (1 - rise) * side * 1.05, R = CORE_R * swell;   // at rise 0 all of her is under the drawing's floor, in her box
  const Rc = rotation(0.35 + Math.sin(t * 0.6) * 0.12, t * 0.55, 0.12);
  // her satellites, each on its own tilted orbit; those behind her first
  const moons = SATELLITES.map((s, i) => {
    const a = s.phase + t * s.speed * (1 + m.stream * 1.6), r = R * s.r * m.spread;
    const p = [Math.cos(a) * r, Math.sin(a) * r * Math.sin(s.tilt), Math.sin(a) * r * Math.cos(s.tilt)];
    return {s, i, x: cx + p[0], y: cy - p[1] - Math.sin(a * 2 + i) * 1.2, z: p[2]};
  });
  // her fins, under her, pointing down and to the left, flickering
  const fins = () => [[-0.32, 0.86, -0.95, 1.62, 0.1], [0.02, 0.92, -0.38, 1.85, 1.7], [0.3, 0.84, 0.05, 1.5, 3.1]].forEach(([x0, y0, x1, y1, ph]) => {
    const flick = 1 + Math.sin(t * 11 + ph) * 0.12 + Math.sin(t * 17.3 + ph * 2) * 0.06 + m.stream * 0.25;
    const a = [cx + x0 * R - R * 0.14, cy + y0 * R], b = [cx + x0 * R + R * 0.16, cy + y0 * R - R * 0.04];
    const tip = [cx + (x0 + (x1 - x0) * flick) * R, cy + (y0 + (y1 - y0) * flick) * R];
    draw.span([a, b, tip], INK.fin); draw.line(a[0], a[1], tip[0], tip[1], INK.finLit); draw.line(b[0], b[1], tip[0], tip[1], INK.finDeep);
  });
  const moonR = (s) => R * s.size;
  const moon = (mo) => {   // a satellite: its ball, and the glint on its upper left
    const r = moonR(mo.s) * (1 + mo.z / (R * 6));
    drawBall(draw, [mo.x, mo.y], r, rotation(t * mo.s.spin, t * mo.s.spin * 0.7, mo.i), MOON);
    draw.put(Math.round(mo.x - r * 0.45), Math.round(mo.y - r * 0.5), INK.lavenderLit); draw.put(Math.round(mo.x - r * 0.45) + 1, Math.round(mo.y - r * 0.5), INK.lavenderLit);
  };
  for (const mo of moons.filter((q) => q.z < 0).sort((a, b) => a.z - b.z)) moon(mo);
  fins();
  drawBall(draw, [cx, cy], R, Rc, CORE);
  // her eye, the front of her, always toward whoever looks
  const ex = cx, ey = cy + R * 0.08, er = R * 0.36, lid = Math.min(1, Math.max(m.lid, blinkAt(t)));
  draw.disc(ex, ey, er, INK.socket);
  draw.disc(ex, ey, er * 0.78, INK.iris, true, (x, y, d) => d > er * 0.3);
  draw.disc(ex, ey, er * 0.78, INK.irisDeep, true, (x, y, d) => d > er * 0.62);
  draw.disc(ex, ey, er * 0.32, INK.pupil);
  draw.put(Math.round(ex - er * 0.42), Math.round(ey - er * 0.42), INK.glint); draw.put(Math.round(ex - er * 0.42) + 1, Math.round(ey - er * 0.42), INK.glint);
  if (lid > 0.02) {   // the lid comes down from above the eye
    const edge = ey - er + 2 * er * lid;
    draw.disc(ex, ey, er, INK.lid, true, (x, y) => y + 0.5 < edge);
    draw.line(ex - er * 0.86, Math.round(edge) - 1, ex + er * 0.86, Math.round(edge) - 1, INK.lidRim);
  }
  for (const mo of moons.filter((q) => q.z >= 0).sort((a, b) => a.z - b.z)) moon(mo);
  // the outline: every empty pixel beside a body's
  const out = abgr(INK.outline);
  for (let y = 0; y < side; y++) for (let x = 0; x < side; x++) {
    const i = y * side + x; if (body[i]) continue;
    if ((x > 0 && body[i - 1] === 1) || (x < side - 1 && body[i + 1] === 1) || (y > 0 && body[i - side] === 1) || (y < side - 1 && body[i + side] === 1)) { u32[i] = out; body[i] = 2; }
  }
  // her sparks, after the outline: they glow; on the charge they stream outward
  for (const s of SPARKS) {
    const a = s.a + t * s.speed, r = R * (s.r + m.stream * ((t * 0.9 + s.tw) % 1.6)), tw = Math.sin(t * 5 + s.tw);
    if (tw < -0.55) continue;   // a twinkle off
    const x = Math.round(cx + Math.cos(a) * r), y = Math.round(cy + s.h * R * 0.9 - Math.sin(a) * r * 0.32), ink = INK.sparks[s.ink];
    draw.put(x, y, ink, false);
    if (s.big && tw > 0.2) { draw.put(x + 1, y, ink, false); draw.put(x, y + 1, ink, false); draw.put(x + 1, y + 1, ink, false); }
  }
  // her eye's glow: a ring of red, every other pixel, pulsing with her
  const pulse = m.glow * (0.55 + 0.45 * Math.sin(t * 3.4)), ring = er * (1.12 + pulse * 0.28);
  if (lid < 0.9) for (let k = 0; k < 64; k++) {
    const a = (k / 64) * Math.PI * 2, x = Math.round(ex + Math.cos(a) * ring), y = Math.round(ey + Math.sin(a) * ring);
    if (((x + y) & 1) === 0 && pulse > 0.25) { const i = y * side + x; if (x >= 0 && y >= 0 && x < side && y < side && body[i] !== 1) u32[i] = abgr(INK.iris, Math.round(120 + 135 * pulse)); }
  }
  return px;
}
