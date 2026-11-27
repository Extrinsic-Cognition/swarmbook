// fuel-fluid-gl.mjs · THE FUEL'S PICTURE (Oct 14 2026 19:xx WEST): fuel-fluid.mjs's particles drawn as a liquid in her unit0, with the caustics its own
// surface makes, on a WebGL2 canvas of its own that the purse's 2D painters lay into unit0's disc (lyssajudron-purse.mjs paintAle).
//
// His words (Oct 14 19:08 WEST): "THE FUEL LIKE A FLUID SUBJECT TO CAUSTICS AND PHYSICS LIKE FUCKING VISCOUS GUMMY BEARS AND LIQUIDS IN GENERAL THAT DESCEND
// FROM GRABITY AND HAVE SHADERS". And Sept 21 03:46, the first fuel: "if there's gasoline in the unit0, the bottom should be darker like as if there was ale
// in it". The look is the syrup lab's (dyson-society/lab/syrup-glass.html: Beer-Lambert amber, the Laplacian of the surface as the light's focus), on her.
//
// TWO PASSES, one small canvas (at most SIDE_MAX px a side):
//   (a) the field: every particle splatted as a (1 - q^2)^3 kernel into a FIELD x FIELD texture, additive: R all the liquid, G the gold's share, B the
//       bronze's, A the embers' glow (half-float where the GPU renders it; else 8-bit at a quarter of the weight, read back times four);
//   (b) the liquid: THE BODY below the bulk's own surface, to the glass (surfaceOf: a drop in the air is never the surface), and the field's own drops
//       and splashes where it passes THRESHOLD (smoothed over a pixel); its colour the three liquids' by their shares, each darker with its
//       depth under the surface above it (exp(-depth / absorb): ale amber to brown at the floor, gold honey to deep amber, bronze a pale copper film); a
//       normal from the field's gradient, so a drop is a rounded gummy body with a highlight from the upper left, and each metal's own field gives its
//       drop a normal of its own inside the ale (the gummy bear in the honey: its skin and its highlight); the meniscus a lit line; the caustics
//       from the simulated surface itself: a vertical ray refracts at the surface's slope, and where the surface is concave the rays meet: the intensity
//       is 1 / |1 + k curvature depth| along the ray, bounded, as soft shafts and a brighter net on her floor (the first cut's unbounded focus drew
//       curtains of streaks over the whole tank), so a drop's ripple throws moving light into the liquid and a surface at rest throws none;
//       the embers additive, gold to white at their hearts.
// The surface (its height, slope and curvature in COLS columns) is read on the CPU from the particles, once a picture.
//
// COST: at rest nothing on the GPU: the canvas keeps its picture and paint() draws it again into the 2D painter (one drawImage) as long as the law's
// version and the size are the same. A picture: one points draw of n <= 360 into 96 x 96 texels and one pass over at most 288 x 288 pixels.
export const SIDE_MAX = 288, FIELD = 96, COLS = 48, THRESHOLD = 0.62, KERNEL = 0.17;   // KERNEL: the splat's radius, in disc radii (about 1.5 lattice spacings)

const VS_SPLAT = `#version 300 es
in vec2 a_p; in float a_k; in float a_life; uniform float u_size; uniform float u_ember;
out vec4 v_w;
void main() {
  gl_Position = vec4(a_p.x, -a_p.y, 0.0, 1.0);
  bool ember = a_k > 2.5;
  gl_PointSize = ember ? u_size * 0.8 : u_size;
  float life = clamp(a_life / u_ember, 0.0, 1.0);
  v_w = ember ? vec4(0.0, 0.0, 0.0, life) : vec4(1.0, a_k > 0.5 && a_k < 1.5 ? 1.0 : 0.0, a_k > 1.5 && a_k < 2.5 ? 1.0 : 0.0, 0.0);
}`;
const FS_SPLAT = `#version 300 es
precision highp float; in vec4 v_w; uniform float u_gain; out vec4 o;
void main() { vec2 c = gl_PointCoord * 2.0 - 1.0; float q2 = dot(c, c); if (q2 >= 1.0) discard; float w = 1.0 - q2; w = w * w * w; o = v_w * w * u_gain; }`;
const VS_FULL = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }`;
const FS_SHADE = `#version 300 es
precision highp float;
uniform sampler2D u_field; uniform float u_side, u_unscale, u_texel, u_alpha, u_deep, u_time, u_wave; uniform float u_surf[${COLS}], u_slope[${COLS}], u_curv[${COLS}];
out vec4 o;
float col(float x, float a[${COLS}]) { float f = clamp((x * 0.5 + 0.5) * float(${COLS - 1}), 0.0, float(${COLS - 1})); int i = int(floor(f)); int j = min(i + 1, ${COLS - 1}); return mix(a[i], a[j], f - float(i)); }
vec4 field(vec2 uv) { return texture(u_field, uv) * u_unscale; }
void main() {
  vec2 uv = gl_FragCoord.xy / u_side, p = vec2(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0);
  float rr = dot(p, p); if (rr > 1.0) { o = vec4(0.0); return; }   // HER FLASK IS GLASS YOU SEE THROUGH (Nov 19 2026, his "are you kiddin me? this is not a good flask dude... lower opacity ffs"): no discard: a discard here and below left the shell's shoulders dry in steps on every GPU (the field's texture reads after it), a transparent write does not
  vec4 f = field(uv);
  float px = 2.0 / u_side, s0y = col(p.x, u_surf), sy = s0y - u_wave * (sin(p.x * 7.0 + u_time * 1.0471976) + 0.5 * sin(p.x * 13.0 - u_time * 1.5707963)) * smoothstep(-0.97, -0.85, s0y);   // HER LIQUID BREATHES (Nov 19 2026, his "make it sin/cos wave instead of flat so it wiggles a bit"): two sines of the house time on its free surface, both whole in 12 s (u_time is the house time modulo 12 s: the same wave on every glass at the same stamp), none against the glass of a full tank
  // THE BODY: below the bulk's own surface the tank is liquid to the glass (the field alone left the wall dry and scalloped); a drop in the air or a
  // splash over the surface is the field's own (a rounded gummy body)
  float body = smoothstep(-px, px, p.y - sy), drop = smoothstep(${THRESHOLD} - 0.07, ${THRESHOLD} + 0.07, f.r), inside = max(body, drop);
  float glow = smoothstep(0.02, 0.9, f.a);
  if (inside <= 0.0 && glow <= 0.0) { o = vec4(0.0); return; }
  float depth = max(0.0, p.y - sy), r = max(f.r, 1e-3), solid = smoothstep(0.05, 0.4, f.r);
  float wg = clamp(f.g / r, 0.0, 1.0) * solid, wb = clamp(f.b / r, 0.0, 1.0) * solid, wf = max(0.0, 1.0 - wg - wb);
  vec3 ale = mix(vec3(0.97, 0.74, 0.30), vec3(0.22, 0.10, 0.03), 1.0 - exp(-depth * 1.5));        // Beer-Lambert: amber at the top, brown at the floor
  vec3 gold = mix(vec3(1.0, 0.84, 0.36), vec3(0.55, 0.26, 0.02), 1.0 - exp(-depth * 1.2));        // honey, a deep amber well
  vec3 bronze = mix(vec3(0.98, 0.86, 0.70), vec3(0.78, 0.52, 0.34), 1.0 - exp(-depth * 2.5));     // a pale copper film
  vec3 c = ale * wf + gold * wg + bronze * wb;
  // THE GUMMY BODIES: each metal's own field gives its drop a normal, so a gold drop in the ale is a rounded body with its own rim and highlight (the
  // gummy bear in the honey), and the liquid's own field gives a drop in the air its roundness
  vec2 dx = vec2(u_texel, 0.0), dy = vec2(0.0, u_texel);
  vec4 fx = field(uv + dx) - field(uv - dx), fy = field(uv - dy) - field(uv + dy);
  vec3 L = normalize(vec3(-0.5, 0.75, 0.6)), H = normalize(L + vec3(0.0, 0.0, 1.0));
  vec3 nl = normalize(vec3(-fx.r, fy.r, 0.5)), ng = normalize(vec3(-fx.g, fy.g, 0.32)), nb = normalize(vec3(-fx.b, fy.b, 0.45));
  float air = (1.0 - body) * drop;                                                                    // a drop or a splash over the surface
  float specL = pow(max(dot(nl, H), 0.0), 36.0) * air, specG = pow(max(dot(ng, H), 0.0), 28.0) * smoothstep(0.15, 0.6, wg), specB = pow(max(dot(nb, H), 0.0), 22.0) * smoothstep(0.15, 0.6, wb) * 0.6;
  float rimG = clamp(length(vec2(fx.g, fy.g)) * 1.6, 0.0, 1.0) * (1.0 - smoothstep(0.85, 1.0, wg));     // the gold body's edge in the ale: a darker skin
  c *= 0.82 + 0.18 * max(dot(nl, L), 0.0) * air + 0.18 * (1.0 - air);
  c = mix(c, c * vec3(0.62, 0.42, 0.2), rimG * 0.55);
  c += vec3(1.0, 0.95, 0.82) * (specL * 0.9 + specG * 0.85 + specB);
  // THE CAUSTICS of the simulated surface: light straight down refracts at its slope and gathers where it is concave (1 / |1 + k curvature depth| along
  // the refracted ray); soft shafts in the liquid and a brighter net on the floor of her unit0. A flat surface (at rest) throws none.
  float s0 = col(p.x, u_slope), x0 = p.x - 0.6 * s0 * depth, k = col(x0, u_curv);
  float focus = 1.0 / max(0.3, abs(1.0 - 0.6 * k * depth));
  float shafts = smoothstep(1.15, 2.6, focus) * exp(-depth * 1.6) * 0.32, floorNet = smoothstep(1.1, 2.2, focus) * smoothstep(0.86, 0.98, sqrt(rr)) * step(0.0, p.y) * 0.55;
  c += vec3(1.0, 0.88, 0.58) * (shafts + floorNet) * body * (1.0 - 0.6 * wb);
  // the meniscus: a lit line where the liquid meets the air at its top, a little higher at the glass
  float rim = (1.0 - smoothstep(0.0, 1.8 * px + 0.012, abs(p.y - sy))) * body;
  c = mix(c, vec3(1.0, 0.97, 0.86), rim * 0.6);
  float a = inside * max(0.0, mix(u_alpha, u_deep, 1.0 - exp(-depth * 1.5)) - 0.22 * wb);   // its opacity: u_alpha at the surface, u_deep at the floor (the painter's own: the mint's 0.92 throughout, her flask's thinner)
  vec3 ember = mix(vec3(1.0, 0.45, 0.08), vec3(1.0, 0.95, 0.75), smoothstep(0.5, 1.0, f.a)) * glow;
  o = vec4(c * a + ember * 1.25, min(1.0, a + glow * 0.85));   // premultiplied
}`;

/** surfaceOf(view, out): the BULK's top in COLS columns over x in [-1, 1] (disc radii, y down), and its slope and curvature. Each column walks up from
 *  the floor through the particles that cover it while they stand no more than GAP apart: a drop in the air or a splash over a gap is not the surface
 *  (the field draws it). A column no particle reaches stands at the nearest covered column's top (the liquid meets the glass), or at the floor in an empty
 *  tank. Smoothed twice by [1 2 1] / 4. Pure: the test holds it. */
export const GAP = 0.2;
export function surfaceOf(v, out = { surf: new Float32Array(COLS), slope: new Float32Array(COLS), curv: new Float32Array(COLS) }) {
  const s = out.surf, w = 2 / (COLS - 1), raw = new Float32Array(COLS).fill(NaN), ys = out.ys || (out.ys = Array.from({ length: COLS }, () => []));
  for (const a of ys) a.length = 0; let glass = false;
  for (let i = 0; i < v.n; i++) {
    if (v.kind[i] > 2) continue;
    const c0 = Math.max(0, Math.floor((v.x[i] - KERNEL * 0.6 + 1) / w)), c1 = Math.min(COLS - 1, Math.ceil((v.x[i] + KERNEL * 0.6 + 1) / w));
    for (let c = c0; c <= c1; c++) ys[c].push(v.y[i]);
  }
  for (let c = 0; c < COLS; c++) {
    const a = ys[c]; if (!a.length) continue; a.sort((p, q) => q - p);   // the floor first (y down)
    const x = -1 + c * w, floor = Math.sqrt(Math.max(0, 1 - x * x)); if (a[0] < floor - 2 * GAP) continue;   // nothing rests on this column's floor
    let top = a[0]; for (let k = 1; k < a.length && a[k] > top - GAP; k++) top = a[k];
    if (x * x + (top - GAP * 0.55) * (top - GAP * 0.55) > 0.84) { glass = true; continue; } raw[c] = top - KERNEL * 0.55;   // THE GLASS IS NOT A SURFACE (Nov 19 2026, his "wtf is wrong with this flask dude?" over a full flask drawn as fluted curtains): a column whose top particle stands under the shell (a row higher would leave the disc) has no surface of its own: it takes the free surface's beside it, and a tank full to the shell has none at all
  }
  let first = -1, last = -1; for (let c = 0; c < COLS; c++) if (raw[c] === raw[c]) { if (first < 0) first = c; last = c; }
  if (first < 0) raw.fill(glass ? -1 : 1); else { for (let c = 0; c < first; c++) raw[c] = raw[first]; for (let c = last + 1; c < COLS; c++) raw[c] = raw[last]; for (let c = first; c <= last; c++) if (raw[c] !== raw[c]) raw[c] = raw[c - 1]; }
  s.set(raw);
  for (let pass = 0; pass < 2; pass++) { const t = Float32Array.from(s); for (let c = 0; c < COLS; c++) s[c] = (t[Math.max(0, c - 1)] + 2 * t[c] + t[Math.min(COLS - 1, c + 1)]) / 4; }
  for (let c = 0; c < COLS; c++) { const a = s[Math.max(0, c - 1)], b = s[Math.min(COLS - 1, c + 1)]; out.slope[c] = (b - a) / (2 * w); out.curv[c] = (b - 2 * s[c] + a) / (w * w); }
  return out;
}

/** createFluidPainter({ document }) -> { paint(ctx, view, cx, cy, R, scale) -> boolean, state(), stop() }. ctx: a 2D context; (cx, cy, R): unit0's liquid
 *  disc in its px; scale: device pixels per px. false (and nothing drawn) when WebGL2 is not there: the caller paints the old ale. sideMax: the picture's
 *  side at most (SIDE_MAX for her unit0; a larger glass may ask for more: the mint's flask, dyson-society/app/dl-mint-flask.js). */
export function createFluidPainter({ document: doc = globalThis.document, offscreen = null, sideMax = SIDE_MAX, alpha = 0.92, deep = alpha, wave = 0 } = {}) {
  const S = { gl: null, failed: false, canvas: null, side: 0, version: -1, pictures: 0, kept: 0, half: false, prog: null, fbo: null, tex: null, buf: null, vao: null, data: null, surface: null };
  function build() {
    if (S.gl || S.failed) return !!S.gl;
    try {
      const c = offscreen ? offscreen() : doc.createElement('canvas'); c.width = c.height = 8;
      const gl = c.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: true });
      if (!gl) { S.failed = true; return false; }
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      const link = (vs, fs, attrs) => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); attrs.forEach((a, i) => gl.bindAttribLocation(p, i, a)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; };
      const splat = link(VS_SPLAT, FS_SPLAT, ['a_p', 'a_k', 'a_life']), shade = link(VS_FULL, FS_SHADE, []);
      S.half = !!gl.getExtension('EXT_color_buffer_float') || !!gl.getExtension('EXT_color_buffer_half_float');
      const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      if (S.half) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, FIELD, FIELD, 0, gl.RGBA, gl.HALF_FLOAT, null);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, FIELD, FIELD, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {   // a half-float target the GPU will not render to: 8-bit
        S.half = false; gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, FIELD, FIELD, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('no field target');
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      const vao = gl.createVertexArray(), buf = gl.createBuffer(); gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 16, 8);
      gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 16, 12);
      gl.bindVertexArray(null);
      const u = (p, n) => gl.getUniformLocation(p, n);
      S.prog = { splat, shade, uSize: u(splat, 'u_size'), uEmber: u(splat, 'u_ember'), uGain: u(splat, 'u_gain'), uField: u(shade, 'u_field'), uSide: u(shade, 'u_side'), uUnscale: u(shade, 'u_unscale'),
        uTexel: u(shade, 'u_texel'), uAlpha: u(shade, 'u_alpha'), uDeep: u(shade, 'u_deep'), uTime: u(shade, 'u_time'), uWave: u(shade, 'u_wave'), uSurf: u(shade, 'u_surf'), uSlope: u(shade, 'u_slope'), uCurv: u(shade, 'u_curv') };
      Object.assign(S, { gl, canvas: c, tex, fbo, vao, buf, data: new Float32Array(360 * 4) });
      return true;
    } catch (e) { S.failed = true; S.error = String(e && e.message || e).slice(0, 200); return false; }
  }
  function draw(v, side, t = 0) {
    const gl = S.gl, P = S.prog;
    if (S.side !== side) { S.canvas.width = S.canvas.height = side; S.side = side; }
    const n = Math.min(v.n, 360), d = S.data;
    for (let i = 0; i < n; i++) { d[i * 4] = v.x[i]; d[i * 4 + 1] = v.y[i]; d[i * 4 + 2] = v.kind[i]; d[i * 4 + 3] = v.life[i]; }
    gl.bindFramebuffer(gl.FRAMEBUFFER, S.fbo); gl.viewport(0, 0, FIELD, FIELD); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.useProgram(P.splat);
    gl.uniform1f(P.uSize, KERNEL * FIELD); gl.uniform1f(P.uEmber, 1500); gl.uniform1f(P.uGain, S.half ? 1 : 0.25);
    gl.bindVertexArray(S.vao); gl.bindBuffer(gl.ARRAY_BUFFER, S.buf); gl.bufferData(gl.ARRAY_BUFFER, d.subarray(0, n * 4), gl.DYNAMIC_DRAW); gl.drawArrays(gl.POINTS, 0, n);
    gl.bindVertexArray(null); gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.disable(gl.BLEND);
    S.surface = surfaceOf(v, S.surface || undefined);
    gl.viewport(0, 0, side, side); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(P.shade);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, S.tex); gl.uniform1i(P.uField, 0);
    gl.uniform1f(P.uSide, side); gl.uniform1f(P.uUnscale, S.half ? 1 : 4); gl.uniform1f(P.uTexel, 1 / FIELD); gl.uniform1f(P.uAlpha, alpha); gl.uniform1f(P.uDeep, deep); gl.uniform1f(P.uTime, t); gl.uniform1f(P.uWave, wave);
    gl.uniform1fv(P.uSurf, S.surface.surf); gl.uniform1fv(P.uSlope, S.surface.slope); gl.uniform1fv(P.uCurv, S.surface.curv);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    S.pictures++;
  }
  function paint(ctx, v, cx, cy, R, scale = 1, now = 0) {
    if (!v || !(R > 2) || !build()) return false;
    const side = Math.max(16, Math.min(sideMax, Math.round(2 * R * (scale > 0 ? scale : 1))));
    const t = wave ? ((now % 12000) + 12000) % 12000 / 1000 : 0; if (v.version !== S.version || side !== S.side || t !== S.t) { draw(v, side, t); S.version = v.version; S.t = t; } else S.kept++;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(S.canvas, cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
    return true;
  }
  return { paint, state: () => ({ ready: !!S.gl, failed: S.failed, error: S.error || null, half: S.half, side: S.side, pictures: S.pictures, kept: S.kept }),
    stop: () => { try { S.gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch { /* gone */ } S.gl = null; } };
}
