// Original exterior Opus optics from syrup-glass.html. Keep shader bodies identical.
const COMMON = `#version 300 es
precision highp float; precision highp int; precision highp sampler2D;
const float PI = 3.14159265358979;
vec2 equirect(vec3 d) { return vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, asin(clamp(d.y, -1.0, 1.0)) / PI + 0.5); }
vec3 dirOf(vec2 uv) { float lon = (uv.x - 0.5) * 2.0 * PI, lat = (uv.y - 0.5) * PI; float c = cos(lat); return vec3(c * cos(lon), sin(lat), c * sin(lon)); }
const vec3 SIGMA = vec3(0.35, 1.15, 3.3);
const vec3 KEY = vec3(-0.32, 0.7, 0.64);
vec3 env(vec3 d) {
  vec3 sky = mix(mix(vec3(0.30, 0.28, 0.25), vec3(0.74, 0.70, 0.63), smoothstep(-0.9, -0.1, d.y)), vec3(0.99, 0.985, 0.96), smoothstep(0.0, 0.7, d.y));
  float win = smoothstep(0.90, 0.985, dot(d, normalize(vec3(-0.45, 0.55, 0.70))));
  return sky + vec3(1.0, 0.98, 0.93) * win * 0.9;
}
`;
const QUAD_VS = `#version 300 es
out vec2 vUv;
void main() { vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); vUv = p; gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`;

// (a) the wave: h_new = h + (h - h_before)(1 - damp) + k Laplacian(h); a tap into another pool is a wall
const WAVE_FS = COMMON + `
uniform sampler2D uField, uMask; uniform vec2 uTexel; uniform float uK, uDamp, uVisc, uKick, uAbsorb, uSplatAmp; uniform vec4 uSplat;
in vec2 vUv; out vec4 o;
void main() {
  vec2 uv = vUv; float lat = (uv.y - 0.5) * PI; float cl = max(cos(lat), 0.03125);
  vec2 dx = vec2(uTexel.x / cl, 0.0), dy = vec2(0.0, uTexel.y);
  vec2 c = texture(uField, uv).rg; float h = c.r, hp = c.g;
  float pool = texture(uMask, uv).r; vec2 wall = c * (1.0 - uAbsorb);
  vec2 l = texture(uMask, uv - dx).r == pool ? texture(uField, uv - dx).rg : wall;
  vec2 r = texture(uMask, uv + dx).r == pool ? texture(uField, uv + dx).rg : wall;
  vec2 d = texture(uMask, uv - dy).r == pool ? texture(uField, uv - dy).rg : wall;
  vec2 up = texture(uMask, uv + dy).r == pool ? texture(uField, uv + dy).rg : wall;
  vec2 lap2 = l + r + d + up - 4.0 * c;          // .x the Laplacian of h, .y of h before
  float lap = lap2.x, lapV = lap2.x - lap2.y;     // the Laplacian of the velocity
  float v = (h - hp) + 0.25 * uVisc * lapV;       // the velocity as a convex mix with its neighbours': the syrup's viscosity, short waves die first
  float hn = h + v * (1.0 - uDamp) + uK * lap;
  float before = h;
  if (uSplatAmp != 0.0) {                         // the drop: a dip, and the displaced syrup risen in a rim twice as wide, so the splat moves no volume
    float a = acos(clamp(dot(dirOf(uv), uSplat.xyz), -1.0, 1.0)), R = uSplat.w;
    if (a < 2.0 * R) { float w = (a < R ? 0.5 + 0.5 * cos(PI * a / R) : 0.0) - 0.25 * (0.5 + 0.5 * cos(PI * a / (2.0 * R))); hn -= uSplatAmp * w; before -= uSplatAmp * w * (1.0 - uKick); }
  }
  o = vec4(hn, before, 0.0, 0.0);
}`;
// the field's energy, 32 x 32 texels a sum
const ENERGY_FS = COMMON + `
uniform sampler2D uField; in vec2 vUv; out vec4 o;
void main() { ivec2 b = ivec2(gl_FragCoord.xy) * 32; float e = 0.0;
  for (int j = 0; j < 32; j++) for (int i = 0; i < 32; i++) { vec2 c = texelFetch(uField, b + ivec2(i, j), 0).rg; float v = c.r - c.g; e += c.r * c.r + 4.0 * v * v; }
  o = vec4(e, 0.0, 0.0, 1.0); }`;
// the pools: every texel of the sphere map takes the nearest face centre; a face's pool is its home mass
const MASK_FS = COMMON + `
uniform sampler2D uCenters; uniform int uFaces; uniform float uInside; in vec2 vUv; out vec4 o;
void main() { vec3 d = dirOf(vUv); float best = -2.0; int bi = 0;
  for (int i = 0; i < 1024; i++) { if (i >= uFaces) break; vec4 c = texelFetch(uCenters, ivec2(i, 0), 0); float t = dot(d, c.xyz); if (t > best) { best = t; bi = i; if (t > uInside) break; } }
  o = vec4(texelFetch(uCenters, ivec2(bi, 0), 0).w, float(bi), 0.0, 0.0); }`;
// (c) the parchment, the pouch's shadow and the caustics under it: a function of the pixel, evaluated by the parchment pass
// at its own pixel and by the glass and the drops at the pixel their refraction lands on (no backdrop texture, no copy pass)
const BACKDROP = `
uniform sampler2D uField, uMask, uFaceData; uniform vec2 uRes, uTexel; uniform vec3 uSphere; uniform mat3 uRotInv; uniform float uLevel, uTime, uCaustic;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float lapAt(vec2 uv) { float lat = (uv.y - 0.5) * PI; float cl = max(cos(lat), 0.03125); vec2 dx = vec2(2.0 * uTexel.x / cl, 0.0), dy = vec2(0.0, 2.0 * uTexel.y);
  float h = texture(uField, uv).r, pool = texture(uMask, uv).r;
  float hl = texture(uMask, uv - dx).r == pool ? texture(uField, uv - dx).r : h, hr = texture(uMask, uv + dx).r == pool ? texture(uField, uv + dx).r : h;
  float hd = texture(uMask, uv - dy).r == pool ? texture(uField, uv - dy).r : h, hu = texture(uMask, uv + dy).r == pool ? texture(uField, uv + dy).r : h;
  return hl + hr + hd + hu - 4.0 * h; }
vec3 backdrop(vec2 px) {
  vec3 paper = vec3(0.957, 0.941, 0.906);
  float grain = (hash(floor(px)) - 0.5) * 0.035;
  vec2 cc = (px - uRes * 0.5) / uRes.y; float vig = 1.0 - 0.3 * dot(cc, cc);
  vec3 col = paper * (vig + grain);
  vec2 sc = vec2(uSphere.x, uSphere.y - uSphere.z * 1.15);
  vec2 e = (px - sc) / (uSphere.z * vec2(1.25, 0.17));
  float rho2 = dot(e, e);
  float shadow = smoothstep(1.0, 0.2, rho2);
  col *= 1.0 - 0.24 * shadow;
  if (rho2 < 1.0) {
    vec3 dw = vec3(e.x, -sqrt(1.0 - rho2), -e.y);
    vec3 dm = uRotInv * dw; vec2 uv = equirect(dm);
    float face = texture(uMask, uv).g; vec4 fd = texelFetch(uFaceData, ivec2(int(face + 0.5), 0), 0);
    float depth = max(fd.r, 0.0) * smoothstep(fd.a, fd.a + 350.0, uTime);
    float lap = lapAt(uv);
    float focus = exp(-rho2 * 2.4) * 0.8 + 0.25 * smoothstep(0.1, 0.0, abs(rho2 - 0.5));
    float pool = max(0.0, uLevel - dw.y);
    vec3 T = exp(-SIGMA * depth * 1.3) * exp(-SIGMA * 0.55 * pool);
    float ripple = clamp(1.0 - uCaustic * lap, 0.0, 3.0);
    col += vec3(1.0, 0.93, 0.78) * focus * T * ripple * 0.26 * smoothstep(1.0, 0.6, rho2);
  }
  return col;
}
`;
const BACK_FS = COMMON + BACKDROP + `
out vec4 o;
void main() { o = vec4(backdrop(gl_FragCoord.xy), 1.0); }`;
// (b) the glass
const GLASS_VS = `#version 300 es
precision highp float;
layout(location=0) in vec3 aA; layout(location=1) in vec3 aB; layout(location=2) in vec3 aNA; layout(location=3) in vec3 aNB; layout(location=4) in float aFace; layout(location=5) in float aEdge;
uniform mat3 uRot; uniform mat4 uVP; uniform float uProgress, uOffset;
out vec3 vPos; out vec3 vN; out vec3 vModel; flat out float vFace; out float vEdge;
void main() { vec3 pm = mix(aA, aB, uProgress); vec3 nm = normalize(mix(aNA, aNB, uProgress));
  vModel = pm; vPos = uRot * pm; vN = uRot * nm; vFace = aFace; vEdge = aEdge;
  gl_Position = uVP * vec4(vPos, 1.0); gl_Position.x += uOffset * gl_Position.w; }`;
const GLASS_FS = COMMON + BACKDROP + `
uniform sampler2D uStar; uniform mat3 uRot; uniform mat4 uVP; uniform vec3 uEye;
uniform float uRipple, uOffset, uStarR, uHasStar;
in vec3 vPos; in vec3 vN; in vec3 vModel; flat in float vFace; in float vEdge; out vec4 o;
vec3 unpackHue(float h) { float r = floor(h / 65536.0), g = floor((h - r * 65536.0) / 256.0), b = h - r * 65536.0 - g * 256.0; return vec3(r, g, b) / 255.0; }
vec2 screenOf(vec3 p) { vec4 c = uVP * vec4(p, 1.0); c.x += uOffset * c.w; return c.xy / c.w * 0.5 + 0.5; }
void main() {
  vec3 dm = normalize(vModel); vec2 uv = equirect(dm);
  float lat = (uv.y - 0.5) * PI; float cl = max(cos(lat), 0.03125);
  vec2 dx = vec2(uTexel.x / cl, 0.0), dy = vec2(0.0, uTexel.y);
  float gu = texture(uField, uv + dx).r - texture(uField, uv - dx).r;
  float gv = texture(uField, uv + dy).r - texture(uField, uv - dy).r;
  vec3 T = normalize(vec3(-dm.z, 0.0, dm.x)); vec3 B = cross(T, dm);
  vec4 fd = texelFetch(uFaceData, ivec2(int(vFace + 0.5), 0), 0);
  float gold = step(0.95, fd.r), setting = smoothstep(fd.a, fd.a + 350.0, uTime);
  float depth = max(fd.r, 0.0) * setting;
  float edge = 1.0 - smoothstep(0.0, 0.22, vEdge);
  vec3 ns = normalize(vPos);
  vec3 n0 = normalize(mix(normalize(vN), ns, 0.22 + 0.45 * gold * setting));
  vec3 n = normalize(n0 - uRipple * (uRot * (gu * T + gv * B)));
  vec3 I = normalize(vPos - uEye);
  float cosT = max(0.0, dot(-I, n));
  float F = 0.04 + 0.96 * pow(1.0 - cosT, 5.0);
  float film = depth * (1.0 + 1.3 * edge);
  vec3 Tf = exp(-SIGMA * film * 0.9 / max(cosT, 0.2));
  vec3 well = unpackHue(fd.b); float hasWell = step(0.5, fd.b);
  Tf *= mix(vec3(1.0), well * 0.55 + 0.45, 0.14 * hasWell * (1.0 - step(0.01, depth)));
  vec3 r = refract(I, n, 1.0 / 1.5); vec3 r2 = refract(r, ns, 1.5); r = (dot(r2, r2) > 0.0) ? r2 : r;
  vec3 p = vPos; float pr = dot(p, r), pp = dot(p, p);
  float tExit = -pr + sqrt(max(0.0, pr * pr - (pp - 1.0)));
  vec3 a = normalize(uEye); float ra = dot(r, a);
  float tDisc = (ra < -1e-4) ? -dot(p, a) / ra : 1e9;
  vec3 hit = p + tDisc * r; vec2 disc = hit.xy;
  float dr = length(disc) / uStarR;
  bool onStar = tDisc < tExit && dr < 1.0 && uHasStar > 0.5;
  float tHit = onStar ? tDisc : tExit;
  float len;
  if (abs(r.y) < 1e-5) len = (p.y < uLevel) ? tHit : 0.0;
  else { float tL = (uLevel - p.y) / r.y; len = (r.y < 0.0) ? max(0.0, tHit - max(tL, 0.0)) : clamp(tL, 0.0, tHit); }
  vec3 Tp = exp(-SIGMA * 0.75 * len);
  vec3 halo = vec3(1.0, 0.91, 0.70) * (0.3 * smoothstep(1.9, 0.9, dr) + 0.06);
  vec3 inner;
  if (onStar) { vec2 suv = vec2(disc.x, -disc.y) / (2.0 * uStarR) + 0.5; inner = texture(uStar, suv).rgb * 1.05 + halo * 0.15; }
  else {
    vec3 qw = p + tExit * r; vec2 uvB = equirect(normalize(uRotInv * qw));
    float depthB = 0.0;   // the far cell's film, seen through the pouch: four taps so it reads soft, not as confetti
    for (int k = 0; k < 4; k++) { vec2 j = vec2(k < 2 ? -1.5 : 1.5, (k & 1) == 0 ? -1.5 : 1.5) * uTexel;
      vec4 fb = texelFetch(uFaceData, ivec2(int(texture(uMask, uvB + j).g + 0.5), 0), 0); depthB += 0.25 * max(fb.r, 0.0) * smoothstep(fb.a, fb.a + 350.0, uTime); }
    vec3 Tb = mix(vec3(1.0), exp(-SIGMA * depthB * 1.2), 0.5);
    vec2 s0 = gl_FragCoord.xy / uRes, dS = screenOf(qw + r * 1.2) - s0;
    vec3 bg = vec3(backdrop(clamp(s0 + dS * 0.985, 0.0, 1.0) * uRes).r, backdrop(clamp(s0 + dS, 0.0, 1.0) * uRes).g, backdrop(clamp(s0 + dS * 1.015, 0.0, 1.0) * uRes).b);
    inner = bg * Tb + halo * 0.5 * (1.0 - depthB * 0.6);
  }
  vec3 through = inner * Tp * Tf;
  vec3 refl = env(reflect(I, n));
  vec3 H = normalize(normalize(KEY) - I); float nh = max(dot(n, H), 0.0);
  float spec = pow(nh, 260.0) * 1.1 + pow(nh, 22.0) * 0.07;
  vec3 col = through * (1.0 - F) + refl * F + vec3(1.0, 0.97, 0.9) * spec;
  float level = exp(-pow((vPos.y - uLevel) / 0.012, 2.0)) * step(-1.0, uLevel) * 0.55;
  col += vec3(1.0, 0.86, 0.55) * level;
  col = mix(col, col * 0.6 + vec3(0.03), (1.0 - smoothstep(0.0, 0.035, vEdge)) * 0.55);
  col += vec3(1.0, 0.72, 0.30) * 0.1 * gold * setting * smoothstep(0.3, 1.0, vEdge);
  float flash = (fd.a > 0.0 && uTime > fd.a) ? exp(-(uTime - fd.a) / 120.0) : 0.0;
  col += vec3(1.0, 0.95, 0.8) * flash * 0.25 * step(0.01, fd.r);
  col = mix(col, vec3(1.0), max(-fd.r, 0.0) * 0.12);
  o = vec4(col, 1.0);
}`;
// (d) the drops
const BEAD_VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 aCorner; layout(location=1) in vec3 aCenter; layout(location=2) in vec2 aSize; layout(location=3) in float aMetal; layout(location=4) in float aAlpha;
uniform mat4 uVP; uniform float uOffset; uniform vec3 uEye; uniform vec2 uRes;
out vec2 vUv; out float vMetal; out float vAlpha; out float vHidden; out float vPx;
void main() {
  vec3 pw = aCenter + vec3(aCorner.x * aSize.x, aCorner.y * aSize.y, 0.0) * 1.2;
  vUv = aCorner * 1.2; vMetal = aMetal; vAlpha = aAlpha;
  vec3 d = aCenter - uEye; float L = length(d); d /= L;
  float b = dot(uEye, d), c = dot(uEye, uEye) - 1.0, disc = b * b - c;
  float t = (disc > 0.0) ? (-b - sqrt(disc)) : 1e9;
  vHidden = (t > 0.0 && t < L - aSize.x) ? 1.0 : 0.0;
  vec4 c0 = uVP * vec4(aCenter, 1.0), c1 = uVP * vec4(aCenter + vec3(aSize.x, 0.0, 0.0), 1.0);
  vPx = abs(c1.x / c1.w - c0.x / c0.w) * 0.5 * uRes.x;
  gl_Position = uVP * vec4(pw, 1.0); gl_Position.x += uOffset * gl_Position.w; }`;
const BEAD_FS = COMMON + BACKDROP + `
in vec2 vUv; in float vMetal; in float vAlpha; in float vHidden; in float vPx; out vec4 o;
void main() {
  float d2 = dot(vUv, vUv); if (d2 > 1.0) discard;
  float z = sqrt(1.0 - d2); vec3 n = vec3(vUv, z);
  float F = 0.04 + 0.96 * pow(1.0 - z, 5.0);
  vec2 s0 = gl_FragCoord.xy / uRes, off = -n.xy * vPx * 0.6 / uRes;
  vec3 bg = backdrop(clamp(s0 + off, 0.0, 1.0) * uRes);
  float thick = 2.0 * z * mix(0.35, 1.6, vMetal);
  vec3 T = exp(-SIGMA * thick);
  vec3 refl = env(reflect(vec3(0.0, 0.0, -1.0), n));
  vec3 H = normalize(normalize(KEY) + vec3(0.0, 0.0, 1.0)); float spec = pow(max(dot(n, H), 0.0), 120.0);
  vec3 col = bg * T * (1.0 - F) + refl * F + spec * 0.9;
  col += vec3(1.0, 0.75, 0.35) * vMetal * 0.12 * (1.0 - d2);
  float aa = smoothstep(1.0, 0.86, d2);
  o = vec4(col, aa * vAlpha * mix(1.0, 0.28, vHidden)); }`;


export {QUAD_VS, WAVE_FS, ENERGY_FS, MASK_FS, BACK_FS, GLASS_VS, GLASS_FS, BEAD_VS, BEAD_FS};
