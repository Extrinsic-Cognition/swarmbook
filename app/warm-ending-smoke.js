// THE ENDING GOES UP IN SMOKE (his Oct 12 2026 10:3x WEST, over the world the film hands over to at 48 s: "leave the animation as it is... i am
// talking about the ending only", then "maybe we could start "dissolving" like as if it was smoke the ending image... and as the smoke rises and
// is reactive to the mouse cursor... just remember to make something that is cheap to run and not too compute intensive... be smart... i believe
// in you"). The film is untouched. From the takeover on, the still burns back along a noisy front from the horizon through the far third of the
// plane over about two minutes; what the front takes rises as smoke made of the image's own light, and the pointer stirs it. Unit 0 never goes.
// Cheap by construction:
//   - the front is one field of world position (depth plus value noise), baked once into a half-scale texture, and one clock: each frame
//     reads it once per pixel, a pan or a zoom costs nothing, and the same formula on the CPU tells hit testing which swarms are gone;
//   - the smoke is Stam's stable fluids in Pavel Dobryakov's WebGL form (MIT), as the well's smoke (room/well-smoke.mjs), here in raw WebGL2
//     with no library: a 112-cell grid, a 448 dye, 16 pressure passes; the image enters it from one quarter-scale copy of the world's first
//     tile level, read once from the cache the tiles already filled;
//   - one composite at the panel's pixels paints the ground (#101c1a, the still's own sky) over what is gone and adds the smoke as light;
//   - 30 frames a second while the pointer rests, 60 while it moves; nothing runs while the world is closed, hidden or scrolled away, and the
//     loop stops for good once the front has spent itself and the smoke has cleared. No WebGL2, no half-float target or reduced motion: the
//     still stays as it was.
const SIM = 112, DYE = 448, PRESSURE_ITERATIONS = 16, QUARTER = 4;
export const SMOKE = Object.freeze({
  delay: 1.2,      // seconds after the takeover before the front moves
  tau: 30,         // the front's time constant: it covers 1 - 1/e of its reach in tau seconds, then slows
  reach: 0.3,      // how far it goes, in field units: the horizon is 0.08, a third of the way down the plane 0.28, the frame's foot 0.68
  spent: 4,        // after delay + spent x tau (about two minutes) the front stops giving smoke; the loop ends once the smoke has cleared
  edge: 0.07,      // the front's softness
  release: 1.25,   // how much of the light the front takes becomes smoke
  smolder: 0.25,   // what the front's band keeps giving off per second while it lives
  buoyancy: 55,    // lift per unit of smoke brightness, grid cells per second squared
  curl: 17, velocityDissipation: 0.25, dyeDissipation: 0.4, pressure: 0.8,
  splatForce: 5000, splatRadius: 0.0026,
  glow: 0.85,      // the smoke as light over the image
  grey: 0.65,      // how much of the image's colour the smoke loses: smoke, not fire
  ember: 0.12,     // the front's faint warm line
});
const GROUND = [16 / 255, 28 / 255, 26 / 255];   // the still's sky, sampled from its first tile
const CLEAR_SECONDS = 7;

// the front, shared by the GPU (every pixel) and the CPU (hit testing): an integer hash, so both sides agree
const NOISE = `
uint hash2(uvec2 q) { q *= uvec2(1597334673u, 3812015801u); return (q.x ^ q.y) * 1597334673u; }
float cell(ivec2 c) { return float(hash2(uvec2(c)) >> 8u) / 16777216.0; }
float vnoise(vec2 p) { vec2 i = floor(p), f = p - i, u = f * f * (3.0 - 2.0 * f); ivec2 c = ivec2(i);
  return mix(mix(cell(c), cell(c + ivec2(1, 0)), u.x), mix(cell(c + ivec2(0, 1)), cell(c + ivec2(1, 1)), u.x), u.y); }
float fbm(vec2 p) { return 0.55 * vnoise(p) + 0.3 * vnoise(p * 2.03 + 17.1) + 0.15 * vnoise(p * 4.11 + 41.7); }
uniform vec3 uCore; uniform vec2 uDepth;
float threshold(vec2 w) {
  float depth = clamp((w.y - uDepth.x) / (uDepth.y - uDepth.x), 0.0, 1.0);
  return 0.6 * depth + 0.22 * (fbm(w / 90.0 + 64.0) - 0.5) + 0.08 + 1.2 * (1.0 - smoothstep(uCore.z * 0.98, uCore.z * 1.4, length(w - uCore.xy)));
}`;
const FRONT = `uniform sampler2D uThr; uniform vec4 uBounds; uniform vec2 uSize; uniform float uK; uniform vec2 uB; uniform float uP; uniform float uEdge;
vec2 worldOf(vec2 uv) { return (vec2(uv.x * uSize.x, (1.0 - uv.y) * uSize.y) - uB) / uK; }
float thrAt(vec2 w) { return texture(uThr, (w - uBounds.xy) / uBounds.zw).r; }
float gone(float thr, float p) { return smoothstep(thr - uEdge, thr, p); }`;
const cell = (x, y) => (Math.imul(Math.imul(x, 1597334673) ^ Math.imul(y, 3812015801 | 0), 1597334673) >>> 8) / 16777216;
function vnoise(px, py) {
  const ix = Math.floor(px), iy = Math.floor(py), fx = px - ix, fy = py - iy, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const top = cell(ix, iy) + (cell(ix + 1, iy) - cell(ix, iy)) * ux, bottom = cell(ix, iy + 1) + (cell(ix + 1, iy + 1) - cell(ix, iy + 1)) * ux;
  return top + (bottom - top) * uy;
}
const fbm = (x, y) => .55 * vnoise(x, y) + .3 * vnoise(x * 2.03 + 17.1, y * 2.03 + 17.1) + .15 * vnoise(x * 4.11 + 41.7, y * 4.11 + 41.7);
const smoothstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

const VERT = `#version 300 es
in vec2 aPosition; uniform vec2 texelSize; out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
void main() { vUv = aPosition * 0.5 + 0.5; vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y); gl_Position = vec4(aPosition, 0.0, 1.0); }`;
const FRAG = body => `#version 300 es
precision highp float; precision highp int; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB; out vec4 fragColor;
${body}`;
const PROGRAMS = {
  splat: `uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
void main() { vec2 p = vUv - point; p.x *= aspectRatio; fragColor = vec4(texture(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0); }`,
  // dye also thins out near the top and the sides, so smoke leaves the glass instead of pooling at its edge
  advect: `uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation; uniform float fade;
void main() { vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize; vec4 r = texture(uSource, coord) / (1.0 + dissipation * dt);
  float keep = (1.0 - smoothstep(0.78, 1.0, vUv.y)) * smoothstep(0.0, 0.05, vUv.x) * (1.0 - smoothstep(0.95, 1.0, vUv.x));
  fragColor = mix(r, r * pow(max(keep, 1e-4), dt * 6.0), fade); }`,
  divergence: `uniform sampler2D uVelocity;
void main() { float L = texture(uVelocity, vL).x, R = texture(uVelocity, vR).x, T = texture(uVelocity, vT).y, B = texture(uVelocity, vB).y; vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x; if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y; fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0); }`,
  curl: `uniform sampler2D uVelocity;
void main() { float L = texture(uVelocity, vL).y, R = texture(uVelocity, vR).y, T = texture(uVelocity, vT).x, B = texture(uVelocity, vB).x; fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0); }`,
  vorticity: `uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main() { float L = texture(uCurl, vL).x, R = texture(uCurl, vR).x, T = texture(uCurl, vT).x, B = texture(uCurl, vB).x, C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L)); force /= length(force) + 0.0001; force *= curl * C; force.y *= -1.0;
  fragColor = vec4(clamp(texture(uVelocity, vUv).xy + force * dt, -1000.0, 1000.0), 0.0, 1.0); }`,
  pressure: `uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main() { float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  fragColor = vec4((L + R + B + T - texture(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0); }`,
  gradient: `uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main() { float L = texture(uPressure, vL).x, R = texture(uPressure, vR).x, T = texture(uPressure, vT).x, B = texture(uPressure, vB).x;
  fragColor = vec4(texture(uVelocity, vUv).xy - vec2(R - L, T - B), 0.0, 1.0); }`,
  scale: `uniform sampler2D uTexture; uniform float value; void main() { fragColor = value * texture(uTexture, vUv); }`,
  // once: the front's field over the world's bounds, row 0 at the bounds' top (the readers use the same convention)
  bake: `${NOISE}
uniform vec4 uBounds; void main() { fragColor = vec4(threshold(uBounds.xy + vUv * uBounds.zw), 0.0, 0.0, 1.0); }`,
  // where the front passes, the light above the ground leaves the image and enters the dye
  source: `${FRONT}
uniform sampler2D uSource; uniform sampler2D uImage; uniform float uPPrev; uniform float uRelease; uniform float uSmolder;
void main() { vec2 w = worldOf(vUv); float thr = thrAt(w), g = gone(thr, uP);
  float amount = max(g - gone(thr, uPPrev), 0.0) * uRelease + g * (1.0 - g) * 4.0 * uSmolder;
  vec3 light = max(texture(uImage, (w - uBounds.xy) / uBounds.zw).rgb - vec3(0.063, 0.11, 0.102), 0.0);
  fragColor = vec4(texture(uSource, vUv).rgb + light * amount, 1.0); }`,
  // smoke is warm: the brighter it is, the faster it rises
  lift: `uniform sampler2D uVelocity; uniform sampler2D uDye; uniform float uBuoyancy; uniform float dt;
void main() { float lum = dot(texture(uDye, vUv).rgb, vec3(0.3, 0.55, 0.15)); fragColor = vec4(texture(uVelocity, vUv).xy + vec2(0.0, uBuoyancy * lum * dt), 0.0, 1.0); }`,
  // the ground over what is gone (inside the 4x lens, the world point the lens shows), the smoke as light, a faint line where it burns
  composite: `${FRONT}
uniform sampler2D uDye; uniform sampler2D uImage; uniform vec3 uGround; uniform vec4 uLens; uniform float uLensZoom; uniform vec4 uLabel; uniform float uGlow; uniform float uGrey; uniform float uEmber;
void main() { vec2 s = vec2(vUv.x * uSize.x, (1.0 - vUv.y) * uSize.y), sw = s; float keep = 0.0;
  if (uLens.w > 0.5) { vec2 d = s - uLens.xy; float l = length(d);
    if (l < uLens.z) sw = uLens.xy + d / uLensZoom; else if (l < uLens.z + 6.0) keep = 1.0;
    if (s.x > uLabel.x && s.x < uLabel.z && s.y > uLabel.y && s.y < uLabel.w) keep = 1.0; }
  vec2 w = (sw - uB) / uK; float g = gone(thrAt(w), uP) * (1.0 - keep);
  // the warm line only where there was light to burn: never in the empty sky the front also crosses
  float content = smoothstep(0.03, 0.2, dot(max(texture(uImage, (w - uBounds.xy) / uBounds.zw).rgb - uGround, 0.0), vec3(0.3, 0.55, 0.15)));
  vec3 smoke = texture(uDye, vUv).rgb; smoke = mix(smoke, vec3(dot(smoke, vec3(0.3, 0.55, 0.15))), uGrey) * uGlow;
  fragColor = vec4(uGround * g + smoke + vec3(0.92, 0.74, 0.42) * g * (1.0 - g) * 4.0 * uEmber * content, g); }`,
};

// the still at a quarter of world scale, from the first tile level (pinned and fetched first by the tiles, so this reads the cache)
async function quarterStill(manifestUrl, variant) {
  const manifest = await fetch(manifestUrl).then(r => { if (!r.ok) throw new Error(`manifest ${r.status}`); return r.json(); });
  const config = manifest.variants[variant], bounds = config.bounds, level = [...config.levels].sort((a, b) => a.scale - b.scale)[0];
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(bounds.width / QUARTER); canvas.height = Math.ceil(bounds.height / QUARTER);
  const ctx = canvas.getContext('2d'), k = 1 / (level.scale * QUARTER);
  ctx.fillStyle = '#101c1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const jobs = [];
  for (let row = 0; row < level.rows; row++) for (let col = 0; col < level.cols; col++) {
    const url = new URL(level.path.replaceAll('{x}', col).replaceAll('{y}', row), new URL(manifestUrl, location.href)).href;
    jobs.push(fetch(url).then(r => { if (!r.ok) throw new Error(`tile ${r.status}`); return r.blob(); }).then(createImageBitmap).then(image => {
      ctx.drawImage(image, col * level.tileSize * k, row * level.tileSize * k, image.width * k, image.height * k); image.close?.();
    }));
  }
  await Promise.all(jobs);
  return { canvas, bounds };
}

export function createEndingSmoke({ panel, after, manifestUrl, variant, nodes, frameHeight, getView, canRun }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'ww-smoke'; canvas.setAttribute('aria-hidden', 'true'); canvas.hidden = true;
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  const say = text => { panel.dataset.smoke = text; };
  if (!gl) { say('off: no webgl2'); return null; }
  gl.getExtension('EXT_color_buffer_float'); gl.getExtension('EXT_color_buffer_half_float');
  function renderable(internal, format) {
    const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, 4, 4, 0, format, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.deleteFramebuffer(fbo); gl.deleteTexture(texture);
    return ok;
  }
  const pick = (...options) => options.find(([internal, format]) => renderable(internal, format));
  const R = pick([gl.R16F, gl.RED], [gl.RG16F, gl.RG], [gl.RGBA16F, gl.RGBA]), RG = pick([gl.RG16F, gl.RG], [gl.RGBA16F, gl.RGBA]), RGBA = pick([gl.RGBA16F, gl.RGBA]);
  if (!R || !RG || !RGBA) { say('off: no half-float target'); return null; }

  const vert = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vert, VERT); gl.compileShader(vert);
  if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(vert));
  const programs = {};
  for (const [name, body] of Object.entries(PROGRAMS)) {
    const frag = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(frag, FRAG(body)); gl.compileShader(frag);
    if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) throw new Error(`${name}: ${gl.getShaderInfoLog(frag)}`);
    const program = gl.createProgram(); gl.attachShader(program, vert); gl.attachShader(program, frag);
    gl.bindAttribLocation(program, 0, 'aPosition'); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`${name}: ${gl.getProgramInfoLog(program)}`);
    const uniforms = {};
    for (let i = 0, n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i < n; i++) {
      const uniform = gl.getActiveUniform(program, i).name; uniforms[uniform] = gl.getUniformLocation(program, uniform);
    }
    programs[name] = { program, uniforms };
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
  gl.disable(gl.BLEND);

  const unit = (texture, id) => { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return { unit: id }; };
  function use(name, values) {
    const { program, uniforms } = programs[name]; gl.useProgram(program);
    for (const [key, value] of Object.entries(values)) {
      const at = uniforms[key]; if (at == null) continue;
      if (value.unit !== undefined) gl.uniform1i(at, value.unit);
      else if (typeof value === 'number') gl.uniform1f(at, value);
      else if (value.length === 2) gl.uniform2f(at, value[0], value[1]);
      else if (value.length === 3) gl.uniform3f(at, value[0], value[1], value[2]);
      else gl.uniform4f(at, value[0], value[1], value[2], value[3]);
    }
    return uniforms;
  }
  function target(w, h, [internal, format]) {
    const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    return { texture, fbo, w, h, texel: [1 / w, 1 / h] };
  }
  function twin(w, h, format) {
    let a = target(w, h, format), b = target(w, h, format);
    return { get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; }, texel: a.texel, all: () => [a, b] };
  }
  function blit(out) {
    if (out) { gl.viewport(0, 0, out.w, out.h); gl.bindFramebuffer(gl.FRAMEBUFFER, out.fbo); }
    else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }
  const grid = (base, aspect) => aspect >= 1 ? [Math.round(base * aspect), base] : [base, Math.round(base / aspect)];
  let velocity, dye, pressure, divergence, curl, aspect = 1;
  function allocate() {
    for (const t of [velocity?.all(), dye?.all(), pressure?.all(), [divergence], [curl]].flat().filter(Boolean)) { gl.deleteTexture(t.texture); gl.deleteFramebuffer(t.fbo); }
    const [sw, sh] = grid(SIM, aspect), [dw, dh] = grid(DYE, aspect);
    velocity = twin(sw, sh, RG); dye = twin(dw, dh, RGBA); pressure = twin(sw, sh, R); divergence = target(sw, sh, R); curl = target(sw, sh, R);
  }

  // the world: Unit 0 never goes; the front runs from the highest swarm (the horizon) to the frame's bottom edge
  const root = nodes.find(n => n.id === 0);
  const core = [root.at[0], root.at[1], root.r], depth = [Math.min(...nodes.map(n => n.at[1])), frameHeight];
  let image = null, bounds = null, field = null, imageReady = false;
  quarterStill(manifestUrl, variant).then(still => {
    bounds = [still.bounds.x, still.bounds.y, still.bounds.width, still.bounds.height];
    image = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, still.canvas);
    const [bw, bh] = [Math.ceil(bounds[2] / 2), Math.ceil(bounds[3] / 2)];
    field = target(bw, bh, R); use('bake', { uBounds: bounds, uCore: core, uDepth: depth }); blit(field);
    imageReady = true; wake();
  }).catch(error => say(`off: ${error.message || error}`));

  let started = false, running = false, spent = false, frame = 0, last = 0, clock = 0, p = 0, pPrev = 0, quiet = 0, lastMove = -1e9;
  const timer = gl.getExtension('EXT_disjoint_timer_query_webgl2'); let query = null, steps = 0, gpuMs = null;   // the GPU's own clock, every 30th step
  let pointer = null; const splats = [];
  const progress = t => SMOKE.reach * (1 - Math.exp(-Math.max(0, t - SMOKE.delay) / SMOKE.tau));
  const end = SMOKE.delay + SMOKE.spent * SMOKE.tau;
  function shared(view) { return { uSize: [view.width, view.height], uK: view.k, uB: view.b, uBounds: bounds, uThr: unit(field.texture, 2), uEdge: SMOKE.edge, uP: p }; }
  function fit(view) {
    const ratio = Math.min(devicePixelRatio || 1, 2) * .5, w = Math.max(1, Math.round(view.width * ratio)), h = Math.max(1, Math.round(view.height * ratio));
    if (canvas.width !== w || canvas.height !== h || !velocity) {
      canvas.width = w; canvas.height = h; aspect = view.width / Math.max(1, view.height); allocate();
    }
  }
  function step(dt, view) {
    const live = clock < end;
    pPrev = p; if (live) p = progress(clock);
    const texel = velocity.texel;
    for (const s of splats.splice(0, 6)) {
      const dx = s.dx / view.width * (aspect < 1 ? aspect : 1), dy = -s.dy / view.height / (aspect > 1 ? aspect : 1);
      use('splat', { uTarget: unit(velocity.read.texture, 0), aspectRatio: aspect, point: [s.x / view.width, 1 - s.y / view.height],
        color: [dx * SMOKE.splatForce, dy * SMOKE.splatForce, 0], radius: SMOKE.splatRadius * (aspect > 1 ? aspect : 1) });
      blit(velocity.write); velocity.swap();
    }
    use('source', { ...shared(view), uSource: unit(dye.read.texture, 0), uImage: unit(image, 1), uPPrev: pPrev,
      uRelease: SMOKE.release, uSmolder: live ? SMOKE.smolder * dt : 0 });
    blit(dye.write); dye.swap();
    use('lift', { uVelocity: unit(velocity.read.texture, 0), uDye: unit(dye.read.texture, 1), uBuoyancy: SMOKE.buoyancy, dt });
    blit(velocity.write); velocity.swap();
    use('curl', { texelSize: texel, uVelocity: unit(velocity.read.texture, 0) }); blit(curl);
    use('vorticity', { texelSize: texel, uVelocity: unit(velocity.read.texture, 0), uCurl: unit(curl.texture, 1), curl: SMOKE.curl, dt });
    blit(velocity.write); velocity.swap();
    use('divergence', { texelSize: texel, uVelocity: unit(velocity.read.texture, 0) }); blit(divergence);
    use('scale', { uTexture: unit(pressure.read.texture, 0), value: SMOKE.pressure }); blit(pressure.write); pressure.swap();
    const at = use('pressure', { texelSize: texel, uDivergence: unit(divergence.texture, 0) });
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) { gl.uniform1i(at.uPressure, unit(pressure.read.texture, 1).unit); blit(pressure.write); pressure.swap(); }
    use('gradient', { texelSize: texel, uPressure: unit(pressure.read.texture, 0), uVelocity: unit(velocity.read.texture, 1) });
    blit(velocity.write); velocity.swap();
    use('advect', { texelSize: texel, uVelocity: unit(velocity.read.texture, 0), uSource: unit(velocity.read.texture, 0), dt, dissipation: SMOKE.velocityDissipation, fade: 0 });
    blit(velocity.write); velocity.swap();
    use('advect', { texelSize: texel, uVelocity: unit(velocity.read.texture, 0), uSource: unit(dye.read.texture, 1), dt, dissipation: SMOKE.dyeDissipation, fade: 1 });
    blit(dye.write); dye.swap();
  }
  function composite(view = getView()) {
    if (!velocity || !imageReady) return;
    const lens = view.lens;
    use('composite', { ...shared(view), uDye: unit(dye.read.texture, 0), uImage: unit(image, 1), uGround: GROUND, uGlow: SMOKE.glow, uGrey: SMOKE.grey, uEmber: spent ? 0 : SMOKE.ember,
      uLens: lens ? [lens.x, lens.y, lens.r, 1] : [0, 0, 0, 0], uLensZoom: lens ? lens.zoom : 1,
      uLabel: lens ? [lens.x - 18, lens.y + lens.r - 29, lens.x + 18, lens.y + lens.r - 8] : [0, 0, 0, 0] });
    blit(null);
  }
  function loop(now) {
    frame = 0;
    if (!started || !canRun()) { running = false; say(started ? 'resting' : 'off'); return; }
    const moving = now - lastMove < 1500;
    if (!last || now - last >= (moving ? 0 : 1000 / 30 - 3)) {
      const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60; last = now; clock += dt;
      const view = getView(); fit(view);
      if (query && gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
        if (!gl.getParameter(timer.GPU_DISJOINT_EXT)) gpuMs = gl.getQueryParameter(query, gl.QUERY_RESULT) / 1e6; gl.deleteQuery(query); query = null;
      }
      const timing = timer && !query && steps++ % 30 === 0; if (timing) { query = gl.createQuery(); gl.beginQuery(timer.TIME_ELAPSED_EXT, query); }
      step(dt, view); composite(view); if (timing) gl.endQuery(timer.TIME_ELAPSED_EXT);
      if (clock >= end) quiet += dt;
      if (quiet >= CLEAR_SECONDS) {   // spent: the front stays where it stopped, the smoke is gone, nothing more to draw each frame
        spent = true; running = false; for (const t of dye.all()) { gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo); gl.clear(gl.COLOR_BUFFER_BIT); }
        composite(view); say('spent'); return;
      }
    }
    frame = requestAnimationFrame(loop);
  }
  function wake() {
    if (!started || running || spent || !imageReady || !canRun()) return;
    running = true; last = 0; say('running'); frame = requestAnimationFrame(loop);
  }
  after.after(canvas);
  return {
    start() {
      if (started) return;
      started = true; spent = false; clock = 0; p = 0; pPrev = 0; quiet = 0; pointer = null; splats.length = 0;
      if (velocity) for (const t of [velocity.all(), dye.all(), pressure.all()].flat()) { gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo); gl.clear(gl.COLOR_BUFFER_BIT); }
      canvas.hidden = false; wake();
    },
    stop() {
      started = false; running = false; cancelAnimationFrame(frame); frame = 0; canvas.hidden = true; say('off');
    },
    wake,
    // the world drew (a pan, a zoom, the lens): the ground follows it at once, even when the loop is resting or spent
    render() { if (started && !canvas.hidden && velocity) { fit(getView()); composite(); } },
    pointer(point) {
      if (!point) { pointer = null; return; }
      if (pointer && (point[0] !== pointer[0] || point[1] !== pointer[1]) && splats.length < 24)
        splats.push({ x: point[0], y: point[1], dx: point[0] - pointer[0], dy: point[1] - pointer[1] });
      pointer = point; lastMove = performance.now(); wake();
    },
    // the CPU twin of the front, for hit testing: a swarm the front has taken can no longer be selected
    gone([x, y]) {
      if (!started || p <= 0) return false;
      const d = Math.min(1, Math.max(0, (y - depth[0]) / (depth[1] - depth[0])));
      const thr = .6 * d + .22 * (fbm(x / 90 + 64, y / 90 + 64) - .5) + .08 + 1.2 * (1 - smoothstep(core[2] * .98, core[2] * 1.4, Math.hypot(x - core[0], y - core[1])));
      return smoothstep(thr - SMOKE.edge, thr, p) > .5;
    },
    state: () => ({ started, running, spent, clock: +clock.toFixed(2), progress: +p.toFixed(3), gpuMs: gpuMs === null ? (timer ? 'pending' : 'no timer') : +gpuMs.toFixed(3), canvas: [canvas.width, canvas.height], grid: velocity ? [velocity.read.w, velocity.read.h] : null, dye: dye ? [dye.read.w, dye.read.h] : null }),
  };
}
