// The Sagittarius window treatment from one-preview/index.html, shown before the Oct 18 03:22 WEST dispatch.
// Its guessed colour depth is preserved: classify 240x135, smooth 5x5, solve seven inverse-projection steps, and float thin flashes separately.
// Every texture uses bottom-left coordinates: flip the video on upload; the two framebuffer textures already have this origin.
// The only geometry adaptation is the mint's existing full-film viewport and content clip, so the underlay and window occupy the same picture.
export const RENDERER = 'smooth-window-v1';
export const LOW = Object.freeze([240, 135]);
const VS = `#version 300 es
out vec2 uv;
void main(){ uv = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); gl_Position = vec4(uv * 2. - 1., 0., 1.); }`;
// PASS 1: the cloth per low texel (1 the cloth, 0 the rest), the max of 16 samples, so the drawing's black lines go with their layer.
const FS_CLASS = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D vid; uniform vec2 tx;
vec3 hsv(vec3 c){
  vec4 K = vec4(0., -1./3., 2./3., -1.);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  return vec3(abs(q.z + (q.w - q.y) / (6. * d + 1e-6)), d / (q.x + 1e-6), q.x);
}
float near(vec2 u){
  vec3 h = hsv(textureLod(vid, u, 0.).rgb); float hue = h.x * 360.;
  return step(26., hue) * step(hue, 70.) * step(.36, h.y) * step(.13, h.z);   // gold, yellow, ochre, its olive shade
}
void main(){
  float n = 0.;
  for (int j = 0; j < 4; j++) for (int i = 0; i < 4; i++) n = max(n, near(uv + (vec2(float(i), float(j)) - 1.5) * .25 * tx));
  o = vec4(n, 0., 0., 1.);
}`;
// PASS 2: a 5x5 blur of the nearness, so the layers slide without tearing.
const FS_BLUR = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D dep; uniform vec2 tx;
void main(){
  float w[5] = float[](1., 4., 6., 4., 1.), s = 0., ws = 0.;
  for (int j = 0; j < 5; j++) for (int i = 0; i < 5; i++) { float k = w[i] * w[j]; s += k * texture(dep, uv + vec2(float(i - 2), float(j - 2)) * tx).r; ws += k; }
  o = vec4(s / ws, 0., 0., 1.);
}`;
// PASS 3: the window. A film point x at depth z stands where the rest eye sees it at x; from his eye now it lands at s. The picture (the cloth at
// the glass, the rest behind it) is solved for x per pixel; the flashes are their own layer in front, a cel: drawn where they land from his eye,
// and where they stood on the picture its surroundings fill in, so a flash is never seen twice.
const FS_VIEW = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D vid, dep;
uniform vec4 clip; uniform vec4 rect; uniform vec2 hm; uniform vec3 eye, eye0, zs;
const vec3 Y = vec3(.2126, .7152, .0722);
uniform vec2 px;   // one film pixel in uv
float sat(vec3 c){ float M = max(c.r, max(c.g, c.b)), m = min(c.r, min(c.g, c.b)); return (M - m) / (M + 1e-6); }
float flashOf(vec2 f){   // bright, pale and thin: both sides of at least one axis must be darker, not just a broad plate's outside edge
  vec3 c = textureLod(vid, f, 0.).rgb; float l = dot(c, Y), l8 = dot(textureLod(vid, f, 3.).rgb, Y);
  float a = smoothstep(.74, .86, l) * (1. - smoothstep(.30, .42, sat(c))) * smoothstep(.07, .15, l - l8);
  if (a <= 0.) return 0.;
  float horizontal = min(l - dot(textureLod(vid, f + vec2(3., 0.) * px, 0.).rgb, Y), l - dot(textureLod(vid, f - vec2(3., 0.) * px, 0.).rgb, Y));
  float vertical = min(l - dot(textureLod(vid, f + vec2(0., 3.) * px, 0.).rgb, Y), l - dot(textureLod(vid, f - vec2(0., 3.) * px, 0.).rgb, Y));
  return a * smoothstep(.07, .15, max(horizontal, vertical));
}
vec3 under(vec2 f){   // the picture under a thin flash: the darkest of its 8 neighbours 4 px out (a thin bright line is gone from all of them)
  vec3 m = vec3(1.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) if (i != 0 || j != 0) m = min(m, textureLod(vid, f + vec2(float(i), float(j)) * 4. * px, 0.).rgb);
  return m;
}
float fillOf(vec2 f){   // the flash and its halo, 2 px out each way
  return max(flashOf(f), max(max(flashOf(f + vec2(2., 0.) * px), flashOf(f - vec2(2., 0.) * px)), max(flashOf(f + vec2(0., 2.) * px), flashOf(f - vec2(0., 2.) * px))));
}
vec2 through(vec2 s, float z){ float k1 = eye.z / (eye.z - z), k0 = eye0.z / (eye0.z - z); return eye0.xy + (eye.xy + (s - eye.xy) / k1 - eye0.xy) * k0; }
bool inside(vec2 f){ return all(greaterThanEqual(f, vec2(0.))) && all(lessThanEqual(f, vec2(1.))); }
void main(){
  if (any(lessThan(uv, clip.xy)) || any(greaterThan(uv, clip.xy + clip.zw))) { o = vec4(0.); return; }
  vec2 f0 = (uv - rect.xy) / rect.zw;
  if (!inside(f0)) { o = vec4(0., 0., 0., 1.); return; }
  vec2 s = (f0 - .5) * 2. * hm, x = s;
  for (int k = 0; k < 7; k++) x = mix(x, through(s, mix(zs.x, zs.y, texture(dep, clamp(x / (2. * hm) + .5, 0., 1.)).r)), .8);
  vec2 fb = x / (2. * hm) + .5;
  float edge = smoothstep(0., .01, min(min(fb.x, 1. - fb.x), min(fb.y, 1. - fb.y)));
  fb = clamp(fb, 0., 1.);
  vec3 base = mix(textureLod(vid, fb, 0.).rgb, under(fb), fillOf(fb)) * edge;
  vec2 ff = through(s, zs.z) / (2. * hm) + .5;
  float a = inside(ff) ? flashOf(ff) : 0.;
  vec3 c = mix(base, textureLod(vid, ff, 0.).rgb, a);
  // Keep the filmed aperture fixed: displaced bright lines cannot tear against its black border.
  vec2 aperture = (uv - clip.xy) / clip.zw;
  float rim = smoothstep(0., .035, min(min(aperture.x, 1. - aperture.x), min(aperture.y, 1. - aperture.y)));
  o = vec4(mix(textureLod(vid, f0, 0.).rgb, c, rim), 1.);
}`;

function program(gl, fs) {
  const p = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, fs]]) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`dl-depth: ${gl.getShaderInfoLog(s)}`);
    gl.attachShader(p, s); gl.deleteShader(s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`dl-depth: ${gl.getProgramInfoLog(p)}`);
  const u = {};
  for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i++) {
    const a = gl.getActiveUniform(p, i); u[a.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, a.name);
  }
  return {p, u};
}

export function createWindowRenderer(gl) {
  const classify = program(gl, FS_CLASS), blur = program(gl, FS_BLUR), view = program(gl, FS_VIEW);
  function texture(filter) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  const video = texture(gl.LINEAR_MIPMAP_LINEAR);
  function target() {
    const t = texture(gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, LOW[0], LOW[1], 0, gl.RED, gl.UNSIGNED_BYTE, null);
    const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('dl-depth: incomplete depth framebuffer');
    return {t, fb};
  }
  const raw = target(), smooth = target();
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  let frame = null, filmW = 960, filmH = 540;
  const stats = {uploads: 0, classifications: 0, blurs: 0, views: 0};
  return {
    upload(film, n) {
      if (frame === n) return;
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, video);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, film); gl.generateMipmap(gl.TEXTURE_2D);
      filmW = film.videoWidth || 960; filmH = film.videoHeight || 540;
      gl.viewport(0, 0, LOW[0], LOW[1]);
      gl.useProgram(classify.p); gl.bindFramebuffer(gl.FRAMEBUFFER, raw.fb);
      gl.uniform1i(classify.u.vid, 0); gl.uniform2f(classify.u.tx, 1 / LOW[0], 1 / LOW[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.useProgram(blur.p); gl.bindFramebuffer(gl.FRAMEBUFFER, smooth.fb);
      gl.bindTexture(gl.TEXTURE_2D, raw.t); gl.uniform1i(blur.u.dep, 0); gl.uniform2f(blur.u.tx, 1 / LOW[0], 1 / LOW[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      frame = n; stats.uploads++; stats.classifications++; stats.blurs++;
    },
    draw({width, height, rect, clip, mmPerDevicePx, eye, depths}) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, width, height); gl.useProgram(view.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, video); gl.uniform1i(view.u.vid, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, smooth.t); gl.uniform1i(view.u.dep, 1);
      // Layout rectangles arrive top-left, while every shader and texture is bottom-left.
      gl.uniform4f(view.u.rect, rect.left / width, (height - rect.top - rect.height) / height, rect.width / width, rect.height / height);
      gl.uniform4f(view.u.clip, clip.left / width, (height - clip.top - clip.height) / height, clip.width / width, clip.height / height);
      gl.uniform2f(view.u.hm, rect.width * mmPerDevicePx / 2, rect.height * mmPerDevicePx / 2);
      gl.uniform2f(view.u.px, 1 / filmW, 1 / filmH);
      gl.uniform3f(view.u.eye, ...eye); gl.uniform3f(view.u.eye0, 0, 0, 550); gl.uniform3f(view.u.zs, ...depths);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.activeTexture(gl.TEXTURE0); stats.views++;
    },
    state: () => ({frame, ...stats}),
    stop() {
      for (const p of [classify, blur, view]) gl.deleteProgram(p.p);
      for (const t of [video, raw.t, smooth.t]) gl.deleteTexture(t);
      for (const fb of [raw.fb, smooth.fb]) gl.deleteFramebuffer(fb);
    },
  };
}
