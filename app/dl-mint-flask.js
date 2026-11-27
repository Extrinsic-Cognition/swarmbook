// dl-mint-flask.js · THE FLASK AND HIS GLOW (his Oct 21 2026 WEST, over the stop on THE CLIMAX, the bow at its full bend: "it cant stop like
// this... cant you add some shaders for the glow of him? like... we need to start getting droplets of liquor in the flask here"; before it:
// "you should arrive to the freeze moment with all hexagons unallocated and an empty tank fuel"; his Oct 15 11:29: "THE PRODUCT HERE IS THE
// FUCKING FLASK WITH FUEL MY DUDE").
//
// HIS GLOW (auraOf): the anime's circle drawn through a shader of its own, on a WebGL2 canvas the sphere lays into the circle (warm-sphere.js
// drawMintStar). Where the picture burns (bright and warm: his aura, the armour's light) it wavers in its own heat, his light rises through
// flowing flame with sparks of it, and a bloom breathes about it. Its amount is the crossing's (warm-sphere.js mintCrossAt: it comes in as he
// draws, whole on the stop), its time the page's own: on the stop the film stands and his cosmos burns on.
//
// THE FLASK (the sphere itself, the glass polyhedron): the mint's seats pour into it as liquor, the house's own fluid (room/fuel-fluid.mjs, his
// Oct 14 law: a drop is a purchase; a Golden Aiolos a heavy gummy blob that sinks and sets as a deep amber well, a Bronze Mint a small drop that
// floats as a pale film; room/fuel-fluid-gl.mjs paints it: Beer-Lambert amber and the caustics of its own surface), in the sphere's disc behind
// the anime's circle. THE MINT'S OWN STATE (his "you are supposed to read state about the mint there... when that animation is played by the
// first buyer there are 0 hexs and 0 liquor... but the 10th buyer has to be able to see the previous ones while the scene gets there"): the seats
// paid before this viewer came are in it by the stop, brought in as the scene gets there (the crossing's PRIOR span, on the film's seconds:
// their liquor rising to its level, their hexagons coming in one after another from his circle out), so the first buyer meets an empty glass
// and the tenth meets nine; each seat paid while the viewer waits on the stop falls in as it is counted. A seat is one drop of its metal,
// whatever its price: the level is the seats', never money.
// A SEAT TAKES A HEXAGON (his "you are adding liquor to it without showing hexagons appeating... you get what i mean or not?"): a seat paid on
// the stop lands as a drop, and a spark leaves the liquor where it fell for the seat's hexagon (warm-sphere.js, the next free hexagon from his
// circle out), which appears in the seat's metal as the spark reaches it: one mint, one drop in the flask, one hexagon on the sphere.
//
// COST: nothing before the window: the fluid, its painter and the glow's program are made at the window's first frame. While the window shows:
// one shader pass over the circle (AURA.side px a side at most) and the fluid's picture (kept while it rests) a draw, the sphere drawing at most
// warm-sphere.js HELD_FPS a second on the stop.

import {worldOf} from './dl-mint-ledger.js?v=flask-2';

export const AURA = Object.freeze({side: 768});
export const FLASK = Object.freeze({fill: .965, sideMax: 640});
export const POUR = Object.freeze({replay_ms: 600, replay_max_ms: 7200, poll_ms: 30000, demo_ms: 4000, demo_more: 24, most: 150, lead_ms: 3000});   /* lead_ms: THE DROP FALLS ON EVERY FLASK AT ONCE (his Nov 11 2026 08:10:10 UTC "solana txns landing therefore drops of liquors falling at the same time for the devices there"): a seat that names its block's time (at_ms) falls lead_ms after it, on the house's beat, so every device that heard of it inside the lead lands it on the same beat; one that hears later lands it at once. The door's list is pushed, never read on a timer (dl-drops-live.mjs, THE HOUSE SAYS IT AT ONCE). */
// a drop falls about fall_ms from the beat that starts it to the liquor; its spark takes spark_ms to its hexagon
export const SEAT = Object.freeze({fall_ms: 320, spark_ms: 520});
// the crossing's span (warm-sphere.js mintCrossAt, 0 to 1) over which the seats paid before the viewer came come in: after the vessel's last rung
export const PRIOR = Object.freeze({from: .2, to: .92});
/** The crossing's point at which the i-th of n seats paid before the viewer came comes in: one after another over PRIOR's span. Pure. */
export function priorAt(i, n) {
  return n > 1 ? PRIOR.from + (PRIOR.to - PRIOR.from) * i / (n - 1) : PRIOR.from;
}
/** How far their liquor has risen to its level at the crossing's point k, 0 to 1, eased. Pure. */
export function priorRise(k) {
  const u = Math.max(0, Math.min(1, (k - PRIOR.from) / (PRIOR.to - PRIOR.from)));
  return u * u * (3 - 2 * u);
}

/** The drops of the chain's seats (dl-mint-ledger.js readSeats: {signature, tier}, in the chain's order): one a seat, its id its signature. Pure. */
export function seatDrops(seats) {
  return (Array.isArray(seats) ? seats : []).slice(0, POUR.most).map((s) => ({id: s.signature, metal: s.tier === 'gold' ? 'gold' : 'bronze', ...(Number.isFinite(s.at_ms) ? {at: s.at_ms + POUR.lead_ms} : {})}));
}
/** When each of n drops falls, from `start` (ms): one every POUR.replay_ms, all of them inside POUR.replay_max_ms. Pure. */
export function pourTimes(n, start) {
  const step = n > 0 ? Math.min(POUR.replay_ms, POUR.replay_max_ms / n) : 0;
  return Array.from({length: Math.max(0, n)}, (_, i) => Math.round(start + i * step));
}
/** When a drop poured at `at` (ms) lands: the fluid starts it at the first beat of the house's grid (epoch, beat ms) at or after `at` (room/
 *  fuel-fluid.mjs beatAfter), and it falls SEAT.fall_ms. Pure. */
export function landOf(at, epoch, beat) {
  return epoch + Math.ceil((at - epoch) / beat) * beat + SEAT.fall_ms;
}
const HOUSE = /^(localhost|127\.\d+\.\d+\.\d+|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$|\.(localhost|local)$/i;
/** HIS REVIEW: ?pour=N on the house's own doors (as dl-paywall.js reviewOf's ?paywall=off): N seats of the lab's own (dl-mint-ledger.js
 *  reviewSeats) stand in for the chain's; the site itself never. */
export function reviewPourOf(win) {
  try {
    if (!win || !HOUSE.test(win.location.hostname)) return null;
    const word = new URLSearchParams(win.location.search).get('pour'), n = word ? Number(word) : NaN;
    return Number.isInteger(n) && n >= 0 && n <= POUR.most ? n : null;
  } catch { return null; }
}

const VS = `#version 300 es
out vec2 v_uv;
void main() { vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); v_uv = p; gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`;
// his light: bright and warm (the aura's gold, the armour's highlights), not the dark cloth or the night; it rises (v up) through flowing flame.
// THE LIQUOR IN FRONT OF HIM (his "can you make the anime behind the liquor?"): the flask's surface (room/fuel-fluid-gl.mjs surfaceOf, in the
// flask's disc, y down; u_reach: this circle's radius in that disc) crosses the circle, and under it he is seen through the liquor: the view
// bent by the surface's slope and drawn a little toward it (a liquid magnifies), amber deepening with the depth (Beer-Lambert), the caustics
// its surface throws, its meniscus a lit line; his fire burns above it, not in it.
const FS = `#version 300 es
precision highp float;
uniform sampler2D u_frame; uniform float u_time, u_amount, u_reach, u_wet;
uniform float u_surf[48], u_slope[48], u_curv[48];
in vec2 v_uv; out vec4 o;
float hash(vec2 p) { p = fract(p * vec2(234.34, 435.345)); p += dot(p, p + 34.23); return fract(p.x * p.y); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + 7.31; a *= 0.5; } return s; }
float lightOf(vec3 c) { float l = dot(c, vec3(0.299, 0.587, 0.114)), warm = c.r + 0.5 * c.g - 1.2 * c.b; return smoothstep(0.42, 0.9, l) * smoothstep(0.2, 0.8, warm); }
vec3 at(vec2 uv) { return texture(u_frame, clamp(uv, 0.0, 1.0)).rgb; }
float col(float x, float a[48]) { float f = clamp((x * 0.5 + 0.5) * 47.0, 0.0, 47.0); int i = int(floor(f)); int j = min(i + 1, 47); return mix(a[i], a[j], f - float(i)); }
void main() {
  vec2 uv = v_uv; float t = u_time, k = u_amount;
  // the liquor: where this point stands against the flask's surface (d > 0 under it)
  vec2 pf = vec2((uv.x - 0.5) * 2.0 * u_reach, (0.5 - uv.y) * 2.0 * u_reach);
  float sy = col(pf.x, u_surf), d = pf.y - sy, depth = max(d, 0.0) * u_wet, under = smoothstep(0.0, 0.01, d) * u_wet;
  float slope = col(pf.x, u_slope), surfV = 0.5 - sy / (2.0 * u_reach);
  vec2 bent = vec2(uv.x + slope * depth * 0.05 + sin(pf.y * 36.0 + pf.x * 9.0 - t * 1.6) * 0.003, surfV + (uv.y - surfV) * 0.92);
  vec2 q = mix(uv, bent, under);
  // the heat over him: the picture wavers where it burns
  float here = lightOf(at(q));
  vec2 heat = vec2(fbm(q * 7.0 + vec2(0.0, -t * 1.3)), fbm(q * 7.0 + vec2(5.2, 1.7 - t * 1.3))) - 0.5;
  vec3 base = at(q + heat * 0.016 * here * k * (1.0 - under));
  // his cosmos rising: the light under a point carried up to it through swaying flame
  float rise = 0.0, w = 0.0;
  for (int i = 1; i <= 10; i++) {
    float fi = float(i), sway = fbm(vec2(q.x * 4.0 + fi * 0.37, q.y * 3.0 - t * 1.7)) - 0.5, kk = 1.0 - fi / 11.0;
    rise += lightOf(at(q + vec2(sway * 0.05, -fi * 0.017))) * kk; w += kk;
  }
  rise /= w;
  // the flame licks up off his light into what is darker above it (where he already burns it adds little: he stays himself)
  float flame = max(0.0, rise - 0.75 * here) * smoothstep(0.42, 0.8, fbm(vec2(q.x * 5.5, q.y * 2.2 - t * 2.1)) + 0.3 * rise);
  // the glow about him, breathing
  float breath = 0.82 + 0.18 * sin(t * 1.9) * sin(t * 0.73 + 1.3);
  vec3 bloom = vec3(0.0);
  for (int i = 0; i < 12; i++) { float a = float(i) * 0.5235988; vec3 s = at(q + vec2(cos(a), sin(a)) * 0.032); bloom += s * lightOf(s); }
  bloom /= 12.0;
  // sparks of it, rising out of where he burns
  vec2 g = vec2(q.x * 26.0, q.y * 18.0 - t * 2.4), id = floor(g), f = fract(g) - 0.5, off = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
  float spark = step(0.88, hash(id)) * smoothstep(0.12, 0.0, length((f - off * 0.6) * vec2(1.0, 0.7))) * smoothstep(0.12, 0.45, rise) * (0.6 + 0.4 * sin(t * 9.0 + hash(id + 1.3) * 40.0));
  vec3 fire = mix(vec3(1.0, 0.5, 0.1), vec3(1.0, 0.93, 0.7), smoothstep(0.2, 0.7, flame));
  // laid on as light is (screen): nothing burns past white; under the liquor his fire is drowned
  vec3 add = clamp((fire * flame * 1.1 + bloom * (1.0 - 0.6 * here) * 0.3 * breath + vec3(1.0, 0.93, 0.7) * spark * 0.8) * k * (1.0 - 0.85 * under), 0.0, 1.0);
  vec3 c = 1.0 - (1.0 - base) * (1.0 - add);
  // seen through the liquor: amber deepening with the depth, the caustics of its surface, its meniscus a lit line
  vec3 amber = mix(vec3(1.0, 0.9, 0.7), vec3(0.6, 0.32, 0.07), 1.0 - exp(-depth * 1.8));
  c = mix(c, c * amber * 1.06 + amber * 0.06, under);
  float bend = col(pf.x - 0.6 * slope * depth, u_curv), focus = 1.0 / max(0.3, abs(1.0 - 0.6 * bend * depth));
  c += vec3(1.0, 0.88, 0.58) * smoothstep(1.15, 2.6, focus) * exp(-depth * 1.6) * 0.3 * under;
  c = mix(c, vec3(1.0, 0.97, 0.86), (1.0 - smoothstep(0.0, 0.012, abs(d))) * u_wet * 0.6);
  o = vec4(min(c, vec3(1.0)), 1.0);
}`;

/** createMintFlask({requestFrame, doc}) -> {aura, open, setSeats, paint, moving, state}: THE FLASK AND HIS GLOW for one sphere. */
export function createMintFlask({requestFrame = () => {}, doc = globalThis.document} = {}) {
  const G = {gl: null, failed: false, error: null, canvas: null, tex: null, u: null, key: null, side: 0};
  /** auraOf(frame, key, amount, seconds, side, reach): the circle's picture (frame: the film's staged square, a canvas; key: its frame) with his
   *  glow at `amount`, at the page's `seconds`, `side` px a side (AURA.side at most), the flask's liquor in front of him where its surface (as the
   *  last paint left it) crosses the circle (reach: the circle's radius in the flask's disc radii); null with no WebGL2 (the sphere then draws the
   *  frame itself). */
  function aura(frame, key, amount, seconds, side, reach = 1) {
    if (!frame || !build()) return null;
    const gl = G.gl, s = Math.max(16, Math.min(AURA.side, Math.round(side)));
    if (G.side !== s) { G.canvas.width = G.canvas.height = s; G.side = s; }
    gl.bindTexture(gl.TEXTURE_2D, G.tex);
    if (key !== G.key) { gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, frame); G.key = key; }
    gl.viewport(0, 0, s, s); gl.uniform1f(G.u.time, seconds % 3600); gl.uniform1f(G.u.amount, amount); gl.uniform1f(G.u.reach, reach);
    gl.uniform1f(G.u.wet, F.wet ? 1 : 0);
    if (F.wet) { gl.uniform1fv(G.u.surf, F.eff.surf); gl.uniform1fv(G.u.slope, F.eff.slope); gl.uniform1fv(G.u.curv, F.eff.curv); }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return G.canvas;
  }
  function build() {
    if (G.gl || G.failed) return Boolean(G.gl);
    try {
      const canvas = doc.createElement('canvas'); canvas.width = canvas.height = 8;
      const gl = canvas.getContext('webgl2', {alpha: false, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true});
      if (!gl) { G.failed = true; return false; }
      const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      const prog = gl.createProgram(); gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);
      const tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
      for (const [p, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, p, v);
      gl.uniform1i(gl.getUniformLocation(prog, 'u_frame'), 0);
      gl.bindVertexArray(gl.createVertexArray());
      const u = (name) => gl.getUniformLocation(prog, name);
      Object.assign(G, {gl, canvas, tex, u: {time: u('u_time'), amount: u('u_amount'), reach: u('u_reach'), wet: u('u_wet'), surf: u('u_surf'), slope: u('u_slope'), curv: u('u_curv')}});
      return true;
    } catch (error) { G.failed = true; G.error = String(error?.message || error).slice(0, 200); return false; }
  }

  // THE FLASK: the house's fluid and its painter, loaded at the window's first frame
  const F = {fuel: null, painter: null, surfaceOf: null, hash01: null, grid: null, loading: null, failed: false, opened: null, last: -Infinity,
    chain: [], poured: new Set(), list: [], world: null, worldOf: -1, still: false, view: null, surface: undefined, wet: false, rise: 1, line: 1,
    eff: {surf: new Float32Array(48), slope: new Float32Array(48), curv: new Float32Array(48)}};
  function load() {
    if (F.loading || F.failed) return;
    F.loading = Promise.all([import('../vendor/embertide-app/ui/intro/room/fuel-fluid.mjs'), import('../vendor/embertide-app/ui/intro/room/fuel-fluid-gl.mjs'), import('../vendor/embertide-app/ui/intro/room/one-law.mjs')]).then(([law, gl, one]) => {
      // the seats paid before the viewer came, at rest in it (gold under, bronze over, the fluid's own lattice); none: an empty tank
      const prior = seatDrops(F.chain);
      F.fuel = law.createFuel(); F.fuel.compose(0, {drops: prior});
      prior.forEach((d, i) => { F.poured.add(d.id); F.list.push({id: d.id, metal: d.metal, prior: true, k: priorAt(i, prior.length)}); });
      F.painter = gl.createFluidPainter({document: doc, sideMax: FLASK.sideMax}); F.surfaceOf = gl.surfaceOf; F.hash01 = law.hash01;
      F.grid = {epoch: one.GENESIS_MS, beat: one.GENESIS_BEAT_MS};
      pour(Date.now()); requestFrame();
    }, () => { F.failed = true; });
  }
  // the seats paid on the stop fall: each as it is counted (after any still to fall); still (reduced motion): they are simply in it
  function pour(now) {
    if (F.opened === null || !F.fuel) return;
    const drops = seatDrops(F.chain).filter((d) => !F.poured.has(d.id));
    if (!drops.length) return;
    const times = pourTimes(drops.length, Math.max(now, F.opened, F.last + POUR.replay_ms));
    drops.forEach((d, i) => {
      F.poured.add(d.id);
      if (F.still) F.fuel.cause({kind: 'drop', id: d.id, metal: d.metal, at_ms: now});
      else F.fuel.cause({kind: 'drop', id: d.id, metal: d.metal, at_ms: d.at ? Math.max(now, d.at) : times[i]}, now);
      // its seat: where its drop falls (the fluid's own line for it, enter()), when it lands, when its hexagon appears
      const land = F.still ? now : landOf(d.at ? Math.max(now, d.at) : times[i], F.grid.epoch, F.grid.beat);
      F.list.push({id: d.id, metal: d.metal, x: (F.hash01(d.id) - .5) * .9, land, appear: F.still ? now : land + SEAT.spark_ms});
    });
    F.last = times.at(-1);
    requestFrame();
  }
  return {
    aura,
    /** the scene is on its way to the window: the flask is made with the seats paid so far in it (they come in with the crossing) */
    prepare() { load(); },
    /** the window has opened on this page (the stop): from now each seat counted falls in */
    open(now = Date.now(), {still = false} = {}) { if (F.opened !== null) return; F.opened = now; F.still = still; load(); pour(now); },
    /** the chain's seats (dl-mint-ledger.js: every one paid so far, in the chain's order): any new ones fall (once the window is open) */
    setSeats(seats, now = Date.now()) {
      if (!Array.isArray(seats) || seats.length < F.chain.length) return;   // the chain only grows
      F.chain = seats.slice();
      pour(now);
    },
    /** the chain's seats as every ball folds them (dl-mint-ledger.js worldOf, FOLLOW THE COUNT): signature -> {face, metal, home, anchored, level}, its rung and capacity on it */
    world(front) {
      if (F.worldOf !== F.chain.length) { F.world = worldOf(F.chain, front); F.worldOf = F.chain.length; }
      return F.world;
    },
    /** the liquor in the sphere's disc (cx, cy, R in px, scale its device pixels a px), at `alpha`, and its surface kept for his glow (aura);
     *  whether anything was drawn */
    paint(ctx, cx, cy, R, alpha = 1, scale = 1, now = Date.now(), rise = 1) {
      F.wet = false;
      if (!F.fuel || !F.painter || !(alpha > 0) || !(rise > 0)) return false;
      const view = F.fuel.view(now);
      if (!view || !view.n) return false;
      F.view = view; F.surface = F.surfaceOf(view, F.surface); F.wet = true; F.rise = Math.min(1, rise);
      // rising to its level: the liquor shows below a line that climbs from the floor to its own surface (and his circle's shader with it)
      const top = Math.min(...F.surface.surf);
      F.line = F.rise < 1 ? 1 - (1 - top + .03) * F.rise : -Infinity;
      for (let c = 0; c < 48; c++) {
        const cut = F.surface.surf[c] < F.line;
        F.eff.surf[c] = cut ? F.line : F.surface.surf[c]; F.eff.slope[c] = cut ? 0 : F.surface.slope[c]; F.eff.curv[c] = cut ? 0 : F.surface.curv[c];
      }
      ctx.save(); ctx.globalAlpha = Math.min(1, alpha);
      if (F.rise < 1) { ctx.beginPath(); ctx.rect(cx - R, cy + F.line * R, 2 * R, (1 - F.line) * R + 2); ctx.clip(); }
      const drawn = F.painter.paint(ctx, view, cx, cy, R, scale);
      ctx.restore();
      return drawn;
    },
    /** the liquor over the anime's circle (cx, cy, r) where it is in the air above its surface (a drop falling in front of him); under the
     *  surface the circle's own shader shows him through it (aura) */
    paintAbove(ctx, cx, cy, R, r, alpha = 1, scale = 1) {
      if (!F.wet || !F.view || !(alpha > 0) || F.rise < 1) return false;   // rising, nothing is in the air
      const surf = F.surface.surf, n = surf.length;
      ctx.save(); ctx.globalAlpha = Math.min(1, alpha);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
      ctx.beginPath(); ctx.moveTo(cx - R, cy - R);
      for (let c = 0; c < n; c++) ctx.lineTo(cx + (-1 + 2 * c / (n - 1)) * R, cy + surf[c] * R);
      ctx.lineTo(cx + R, cy - R); ctx.closePath(); ctx.clip();
      const drawn = F.painter.paint(ctx, F.view, cx, cy, R, scale);
      ctx.restore();
      return drawn;
    },
    /** the seats in it, in their order: those paid before the viewer came {id, metal, prior: true, k (the crossing's point it comes in at)},
     *  then those paid on the stop {id, metal, x (its drop's line in the flask's disc), land (ms), appear (ms: its hexagon)} */
    seats: () => F.list,
    /** the liquor's surface over x (the flask's disc, y down), as the last paint left it; the floor with none */
    surfaceAt(x) {
      if (!F.wet) return 1;
      const surf = F.surface.surf, f = Math.max(0, Math.min(surf.length - 1, (x * .5 + .5) * (surf.length - 1))), i = Math.floor(f), j = Math.min(surf.length - 1, i + 1);
      return surf[i] + (surf[j] - surf[i]) * (f - i);
    },
    /** whether the liquor is falling or settling at `now` */
    moving: (now = Date.now()) => Boolean(F.fuel?.moving(now)),
    state: () => ({glow: Boolean(G.gl), glowFailed: G.failed, glowError: G.error, opened: F.opened, poured: F.poured.size, moving: Boolean(F.fuel?.moving(Date.now())) || F.list.some((l) => l.appear > Date.now()), seats: F.chain.length, lands: F.list.filter((l) => l.land).map((l) => [l.id, l.land]),
      fluid: Boolean(F.fuel), painter: F.painter?.state?.() ?? null}),
  };
}
