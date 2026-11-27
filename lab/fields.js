// fields.js: THE FIELDS, for the optimism.fit mint hero (hero-ab.html, the Saint Seiya film on the dodecahedron box) and any page holding a
// three.js scene: hair as strands in a flow, light from its source, a silhouette into smoke, water or petals. His words, Oct 14 2026 WEST:
//   16:3x, over the hero at film 32.6 s (Athena from behind, her long violet hair streaming left toward the fight): "i mean dude it'd be cool as
//         hell if you were able to use some houdini shit rendered with the hairs that are flowing like the screenshot,... you get what i mean?"
//   16:3x: "i grew up watching MTV shortcuts creatives, i love them... i have a fetish for houdini and human silhouettes as smoke or water or
//         flowers or idk you get what i mean my dude??"
//   16:4x, over the box open at film 47.2 s, the film's burst on its faces and the gold cloth unlit in the middle: "the light is not on the
//         surfaces projected dude... THE LIGHT IS COMING FROM THE ARMOR ITSELF DUDE COME ON!!!!! ... THAT IS ALL A VECTORIAL FIELD MY DUDE"
// The look is built here, from first principles, on the page's own GPU (never Houdini or another vendor's tool, foundation 5): three fields, each
// a pure function of the film's second (fields-plan.mjs), drawn by whatever renderer holds them.
//
// 1. THE HAIR (createHair). Guide curves grown from her own hair mesh (athena.hades.glb's E00H: the shortest paths over the mesh from her
//    scalp to each lock's tip, extended over her head to the crown), and render strands between them, clumped into locks. Each strand is a
//    chain whose every segment turns from its rest direction toward the FLOW, more the farther down the strand: the flow is the film's own
//    drawn hair, read once off the shot over her shoulder (fields.measure.mjs: its direction in each cell of the face's picture, root to tip,
//    and its sway frame by frame), lifted into 3D through the face's frame (faceFlowFrame), so her strands leave the face where the drawn
//    strands do and stream on toward the fight. The chain is integrated in the vertex shader from the root at every draw (no state), drawn as
//    ribbons tapering to a point, in the film's own paint (its violet, its shade, its dark lines and its pale strands; Kajiya-Kay highlight).
// 2. THE LIGHT FROM ITS SOURCE (createLight). A vector field with its source at the gold cloth's place in 3D: direction away from the cloth,
//    strength falling with distance (1 / (1 + (r / r0)^2)), shaped by the film's own rays (fields-film.mjs BURST: the 16 rays of the burst at
//    45.445 s, each kept at its angle in the picture and leaning out of it, so from the eye they are the film's rays and as the cloth turns they
//    turn in depth). Shown four ways, all of the one field: the beams themselves (camera-facing along each ray, pulses running outward along
//    them, occluded by the box's faces), the hot core, motes carried outward by it, and the flames of the centaur (50.05 s: particles rising
//    off the cloth's own surface in a curl field). FIELD_GLSL lets any surface take its light (the box's petals, lit from inside).
//    Its strength is the film's light (fields-film.mjs LIGHT) and its forms follow the film's cuts (fields-plan.mjs lightAt).
// 3. THE SILHOUETTE (createDissolve). A body's surface sampled by area (its own colours from its texture), a front sweeping across it, the
//    body's own material cut by the same front with a glowing rim (patch), and each released point carried by a curl field: smoke (rising,
//    swelling, greying), water (thrown and falling, droplets) or petals (tumbling, drifting, flowering). At a moment HE picks
//    (fields-plan.mjs DISSOLVE_CANDIDATES lists the ones shown to him; nothing is wired from them). On her (A, at his Aiolos) her whole figure
//    goes with her strands (bindHair): a transformation, his to pick. Nothing here jiggles her body, and the ripple never bends it.
//
// THE LAW: nothing at rest costs anything. No field here schedules a frame, holds a timer or reads the network: a page calls update(t, ...)
// inside its own draw, which it makes only on a cause (the film's frames while it plays, a seek, a drag), and a paused film is no draws at all.
// Every field is a pure function of t, so a seek or a loop lands on the same picture as a first play, on every glass (C-2, C-3).
// COST (per draw; receipts in FIELDS.md): the hair 480 strands x 24 points (23 k vertices, each integrating its chain from the root: about
// 0.27 M chain steps), the light 48 beams + 900 motes + 4,000 flame points, a dissolve 12,000 points of 6 curl steps each; the CPU sets a dozen
// uniforms a draw. lysa's budget (a 2019 Intel laptop GPU) is the `budget` option: 'lysa' halves the strands, the motes and the points.
import * as THREE from 'three';
import {hairAt, flowBytes, HAIR_PAINT, STREAM, growGuides, capOf, extended, strandsOf, lightAt, raysOf, surfaceOf, dissolveAt, rng, screenFlowFrame,
  rippleAt, RIPPLE_SHAPE} from './fields-plan.mjs';
import {windows as portalWindows} from './cubism-window.js';
import {HAIR} from './fields-film.mjs';

export const BUDGETS = Object.freeze({
  full: {strands: 220, motes: 900, flames: 1600, points: {smoke: 3200, water: 9000, petals: 3200}, extraRays: 24},
  lysa: {strands: 110, motes: 450, flames: 700, points: {smoke: 1600, water: 4500, petals: 1600}, extraRays: 12},
});

// ---- GLSL shared by the fields ----
// A divergence-free field: the curl of a vector potential made of sines (two octaves, the second turned), so it swirls without sources or sinks
// (smoke and petals neither bunch up nor thin out on their own), cheap (a few sines a step) and the same on every GPU to a sine's precision.
const CURL = `
vec3 curlOf(vec3 p, float t) {
  vec3 c = vec3(0.0);
  float k = 1.0, amp = 1.0;
  for (int o = 0; o < 2; o++) {
    vec3 q = p * k + vec3(0.31 * t, -0.23 * t, 0.17 * t) * float(o + 1);
    float a = q.y + 1.3, b = q.z + 0.7, cc = q.z + 2.1, d = q.x + 0.4, e = q.x + 3.3, f = q.y + 1.9;
    c += amp * k * vec3(-sin(e) * sin(f) - cos(cc) * cos(d), -sin(a) * sin(b) - cos(e) * cos(f), -sin(cc) * sin(d) - cos(a) * cos(b));
    p = mat3(0.0, 0.8, 0.6, -0.8, 0.36, -0.48, -0.6, -0.48, 0.64) * p;
    k *= 2.17; amp *= 0.45;
  }
  return c;
}
float hash11(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
`;
// THE RIPPLE (fields-plan.mjs rippleAt): her portal's fronts on the stage, bending what they pass, radially from her hair's join: her strands
// (never her body: see createRipple). Stage css px throughout (the window's own geometry); uRippleRect places this canvas in the stage, so a
// vertex's clip position is bent where it stands on the stage. Off (uRipple.w and uRippleWall.y 0), it returns the position as it is.
export const RIPPLE_GLSL = `
uniform vec4 uRipple;       // the join (stage css px), the window's front (px from it), its strength
uniform vec2 uRippleWall;   // the wall of light's front (px; < 0 none), its strength
uniform vec4 uRippleRect;   // this canvas's left, top, width, height in the stage (css px)
uniform vec3 uRippleShape;  // amplitude, width, wavelength (px)
vec2 rippleBendStage(vec2 s) {
  vec2 d = s - uRipple.xy; float l = length(d);
  if (l < 1e-3) return vec2(0.0);
  float u = (l - uRipple.z) / uRippleShape.y, a = uRipple.w * uRippleShape.x * exp(-u * u) * sin((l - uRipple.z) / uRippleShape.z);
  if (uRippleWall.x >= 0.0) { float v = (l - uRippleWall.x) / uRippleShape.y; a += 1.4 * uRippleWall.y * uRippleShape.x * exp(-v * v) * sin((l - uRippleWall.x) / uRippleShape.z); }
  return d / l * a;
}
vec4 rippleBendClip(vec4 clip) {
  if (uRipple.w <= 0.0 && uRippleWall.y <= 0.0) return clip;
  vec2 ndc = clip.xy / clip.w, st = uRippleRect.xy + vec2(ndc.x * 0.5 + 0.5, 0.5 - ndc.y * 0.5) * uRippleRect.zw, b = rippleBendStage(st);
  return vec4(clip.xy + vec2(2.0 * b.x / uRippleRect.z, -2.0 * b.y / uRippleRect.w) * clip.w, clip.zw);
}`;

// The front: where on the body the dissolve has reached, from 0 (first) to 1 (last), swept along uSweep and frayed by the curl field's noise.
const FRONT = `
uniform vec3 uSweep; uniform vec2 uSpan; uniform float uFray;
float frontOf(vec3 p) {
  float along = (dot(p, uSweep) - uSpan.x) / max(uSpan.y - uSpan.x, 1e-4);
  vec3 q = p * 7.0;
  float n = sin(q.x * 1.3 + sin(q.y * 1.7)) * sin(q.y * 1.1 + sin(q.z * 1.9)) * sin(q.z * 1.5 + sin(q.x * 1.2));
  return clamp(along * (1.0 - uFray) + uFray * (0.5 + 0.5 * n), 0.0, 1.0);
}`;
// ---- 1. THE HAIR ----
const HAIR_VS = `
precision highp float;
precision highp sampler2D;
${RIPPLE_GLSL}
uniform sampler2D uRest;    // K x strands: each point's rest place (her model, metres) and how far down its strand (0 root, 1 tip)
uniform sampler2D uFlow;    // the drawn hair's direction on the face's picture square (r, g: x, y down at 0.5 + 0.5 v), linear
uniform vec4 uGrid;         // the flow grid's u0, v0 and its span in u and v
uniform vec2 uStream;       // the drawn hair's stream (fields-plan.mjs STREAM), where the strands go beyond the film's picture
uniform mat4 uToFlow;       // her model to the face's picture frame (u right, v down, w toward the eye; the square's half side a unit)
uniform mat3 uFromFlow;     // and back, directions only
uniform float uT, uWind, uSway, uDepth, uFlutter, uWidth, uFollow;
attribute float aStrand, aK, aSide;
varying float vS; varying float vSide; varying vec3 vT; varying vec3 vView; varying float vSeed; varying vec3 vModel; varying vec3 vHerView;
#include <clipping_planes_pars_vertex>
vec4 rest(int k) { return texelFetch(uRest, ivec2(k, int(aStrand)), 0); }
vec3 flowDir(vec3 p, float s, float seed) {
  vec4 q = uToFlow * vec4(p, 1.0);
  vec2 st = (q.xy - uGrid.xy) / uGrid.zw;
  vec4 f = texture2D(uFlow, st);
  // inside the picture the drawn hair's own direction where it read hair (its coherence), the stream elsewhere and beyond the picture
  vec2 out2 = max(max(-st, st - 1.0) * uGrid.zw, 0.0);
  float inside = (1.0 - smoothstep(0.0, 0.5, max(out2.x, out2.y))) * f.b;
  vec2 d = normalize(mix(uStream, f.xy * 2.0 - 1.0, inside) + vec2(1e-5, 0.0));
  // the drawn hair's own sway at this frame, and a flutter growing toward the tips (two sines a strand, its own phase)
  float a = atan(d.y, d.x) + uSway + uFlutter * s * (sin(s * 7.0 - uT * 2.6 + seed * 6.283) + 0.5 * sin(s * 13.0 - uT * 4.1 + seed * 17.0));
  return normalize(uFromFlow * normalize(vec3(cos(a), sin(a), uDepth)));
}
void main() {
  int k = int(aK + 0.5);
  float seed = hash11(aStrand + 0.5);
  vec4 r0 = rest(0), r1 = rest(1);
  vec3 p = r0.xyz, dir = normalize(r1.xyz - r0.xyz);
  // the chain, from the root: each segment turns from its rest direction toward the flow, more the farther down the strand
  for (int j = 1; j < 48; j++) {
    if (j > k) break;
    vec4 a = rest(j - 1), b = rest(j);
    vec3 seg = b.xyz - a.xyz;
    float L = length(seg);
    vec3 dr = seg / max(L, 1e-6);
    float w = uWind * uFollow * smoothstep(0.02, 0.5, b.w);
    dir = normalize(mix(dr, flowDir(p, b.w, seed), w));
    p += dir * L;
  }
  float s = rest(k).w;
  vModel = p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  vec3 tRaw = mat3(modelViewMatrix) * dir;
  float scale = length(tRaw);
  vec3 tv = tRaw / max(scale, 1e-6), toEye = normalize(-mvPosition.xyz);
  vec3 side = normalize(cross(tv, toEye) + vec3(1e-5, 0.0, 0.0));
  float taper = (1.0 - s) * (0.45 + 0.55 * (1.0 - s * s)) + 0.04 * (1.0 - s);
  mvPosition.xyz += side * aSide * 0.5 * uWidth * scale * taper;
  vS = s; vSide = aSide; vT = tv; vView = toEye; vSeed = seed; vHerView = mvPosition.xyz;
  gl_Position = rippleBendClip(projectionMatrix * mvPosition);
  #include <clipping_planes_vertex>
}`;
const HAIR_FS = `
precision highp float;
uniform vec3 uMid, uShade, uLine, uPale, uLight;
uniform float uOpacity, uCut, uPass;
uniform vec4 uHerCut[5];   // the face she joins cuts her strands as it cuts her (unboxing.js herCut: planes through the eye, view space; 0 cuts nothing)
varying float vS; varying float vSide; varying vec3 vT; varying vec3 vView; varying float vSeed; varying vec3 vModel; varying vec3 vHerView;
#include <clipping_planes_pars_fragment>
${FRONT}
void main() {
  if (dot(vHerView, uHerCut[0].xyz) < 0.0 && dot(vHerView, uHerCut[1].xyz) < 0.0 && dot(vHerView, uHerCut[2].xyz) < 0.0 && dot(vHerView, uHerCut[3].xyz) < 0.0 && dot(vHerView, uHerCut[4].xyz) < 0.0) discard;
  #include <clipping_planes_fragment>
  if (uCut > -0.5 && frontOf(vModel) < uCut) discard;   // a dissolve bound to her (bindHair) takes her strands with her body
  // THE CUTS' device (lab/CUTS.md), when her body wears it this draw: the strands as their normals, then a flat gold matte
  if (uPass > 1.5) { gl_FragColor = vec4(0.83, 0.64, 0.29, 1.0); return; }
  if (uPass > 0.5) { vec3 nrm = normalize(cross(normalize(vT), vec3(0.0, 0.0, 1.0)) * sign(vSide + 1e-3) + normalize(vView) * 0.6); gl_FragColor = vec4(nrm * 0.5 + 0.5, 1.0); return; }
  vec3 T = normalize(vT), V = normalize(vView), L = normalize(uLight), H = normalize(L + V);
  float th = dot(T, H), tl = dot(T, L);
  float spec = pow(sqrt(max(0.0, 1.0 - th * th)), 90.0);            // Kajiya-Kay: the highlight runs across the strand
  float diff = sqrt(max(0.0, 1.0 - tl * tl));
  // the film's way: two tones, a pale strand where the light runs along it, a dark line at each edge of a lock
  vec3 c = mix(uShade, uMid, smoothstep(0.5, 0.62, diff * (0.85 + 0.3 * vSeed)));
  c = mix(c, uPale, smoothstep(0.55, 0.7, spec) * (0.55 + 0.45 * step(0.62, vSeed)));
  c = mix(c, uLine, smoothstep(0.66, 0.92, abs(vSide)) * 0.9);
  gl_FragColor = vec4(c, uOpacity);
}`;

/**
 * THE HAIR. `pos` and `tris` her hair mesh posed (metres, her model's frame; cubism.fit.mjs hairOf or hairOfModel below), `head` her head
 * joint, `crown` the top of her head. Returns {object (a Mesh, add it where her model is: her strands are in her model's frame), material,
 * uniforms, guides, update(t, {flowFrame?}), setFlowFrame(rowMajor16), dispose()}. Give the material her clipping planes as you give hers.
 */
export function createHair({pos, tris, head = [0, 1.392, 0.007], budget = 'full', count = BUDGETS[budget].strands, K = 24, width = 0.017, seed = 7,
  follow = 0.97, depth = -0.15, flutter = 0.22, extend = 1.4, capMax = 0.11, ripple = null} = {}) {
  const grown = growGuides(pos, tris, {head, K});
  const guides = grown.guides.map((g) => ({...g, points: extended(g.points, extend)}));
  const cap = capOf(tris, grown, {head, capMax});
  const rest = strandsOf(guides, count, {seed, spread: 0.02, clump: 0.85});
  const restTex = new THREE.DataTexture(rest, K, count, THREE.RGBAFormat, THREE.FloatType);
  restTex.minFilter = restTex.magFilter = THREE.NearestFilter; restTex.needsUpdate = true;
  const g = HAIR.grid, flowTex = new THREE.DataTexture(flowBytes(), g.nu, g.nv, THREE.RGBAFormat, THREE.UnsignedByteType);
  flowTex.minFilter = flowTex.magFilter = THREE.LinearFilter; flowTex.wrapS = flowTex.wrapT = THREE.ClampToEdgeWrapping; flowTex.needsUpdate = true;
  // the ribbons: K points a strand, two sides each
  const n = count * K * 2, strand = new Float32Array(n), kk = new Float32Array(n), side = new Float32Array(n), index = [];
  for (let s = 0, v = 0; s < count; s++) for (let k = 0; k < K; k++) for (const sd of [-1, 1]) { strand[v] = s; kk[v] = k; side[v] = sd; v++; }
  for (let s = 0; s < count; s++) for (let k = 0; k < K - 1; k++) { const a = (s * K + k) * 2; index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  geometry.setAttribute('aStrand', new THREE.BufferAttribute(strand, 1)); geometry.setAttribute('aK', new THREE.BufferAttribute(kk, 1));
  geometry.setAttribute('aSide', new THREE.BufferAttribute(side, 1)); geometry.setIndex(index);
  const P = HAIR_PAINT, uniforms = {
    uRest: {value: restTex}, uFlow: {value: flowTex}, uGrid: {value: new THREE.Vector4(g.u0, g.v0, g.nu * g.du, g.nv * g.dv)}, uStream: {value: new THREE.Vector2(...STREAM)},
    uToFlow: {value: new THREE.Matrix4()}, uFromFlow: {value: new THREE.Matrix3()}, uT: {value: 0}, uWind: {value: 0}, uSway: {value: 0},
    uDepth: {value: depth}, uFlutter: {value: flutter}, uWidth: {value: width}, uFollow: {value: follow}, uOpacity: {value: 1},
    uMid: {value: new THREE.Vector3(...P.mid)}, uShade: {value: new THREE.Vector3(...P.shade)}, uLine: {value: new THREE.Vector3(...P.line)},
    uPale: {value: new THREE.Vector3(...P.pale)}, uLight: {value: new THREE.Vector3(-0.32, 0.7, 0.64)},   // the sphere's light (warm-sphere.js drawSkin)
    uCut: {value: -1}, uSweep: {value: new THREE.Vector3(0, -1, 0)}, uSpan: {value: new THREE.Vector2(0, 1)}, uFray: {value: 0.35}, uPass: {value: 0},
    uHerCut: {value: Array.from({length: 5}, () => new THREE.Vector4())},
    ...(ripple ?? createRipple()).uniforms,
  };
  const material = new THREE.ShaderMaterial({vertexShader: CURL + HAIR_VS, fragmentShader: HAIR_FS, uniforms, side: THREE.DoubleSide, clipping: true});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false; mesh.name = 'fields:hair';
  const setFlowFrame = (m) => {
    const M = new THREE.Matrix4().set(...m);
    uniforms.uToFlow.value.copy(M);
    uniforms.uFromFlow.value.setFromMatrix4(M).invert();
  };
  setFlowFrame([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);   // until a face is given: her model's x right, y up as the picture's
  return {
    object: mesh, material, uniforms, guides, strands: count, K, cap,
    /** the game's hair under the strands: keeps its cap and front and hides its long locks (a new index on her mesh; `from` her hair's first
     *  vertex in the mesh, `first` the index entry where her hair's triangles begin: athena.hades.glb 4328 and 5862) */
    keepCap(skinned, {from = 4328, first = 5862} = {}) {
      const g = skinned.geometry, old = g.index.array, idx = new (old.constructor)(first + cap.length);
      idx.set(old.subarray(0, first)); for (let i = 0; i < cap.length; i++) idx[first + i] = cap[i] + from;
      g.setIndex(new THREE.BufferAttribute(idx, 1));
      return {kept: cap.length / 3, of: (old.length - first) / 3};
    },
    /** the field at the film's second t; flowFrame (row-major 16, faceFlowFrame) when the face she is on has turned */
    update(t, {flowFrame = null, wind = null} = {}) {
      const h = hairAt(t);
      if (flowFrame) setFlowFrame(flowFrame);
      uniforms.uT.value = t; uniforms.uWind.value = wind ?? h.wind; uniforms.uSway.value = h.sway;
      return h;
    },
    setFlowFrame,
    dispose() { geometry.dispose(); material.dispose(); restTex.dispose(); flowTex.dispose(); },
  };
}
/**
 * Her game hair in the film's paint: the texels her hair's triangles sample (the box of its uvs) that are her hair's pink or violet take the
 * film's (fields-plan.mjs HAIR_PAINT: the shade, the middle and the pale strands by their light), so the cap kept under the strands is one
 * paint with them. Once, at load: one pass over the box of a 512 x 512 texture. The texture is the model's own (a clone is not made).
 */
export function filmPaint(skinned, {from = 4328, to = 7020} = {}) {
  const g = skinned.geometry, uv = g.attributes.uv, map = [skinned.material].flat()[0]?.map, img = map?.image;
  if (!uv || !img || typeof OffscreenCanvas === 'undefined') return 0;
  let u0 = 1, v0 = 1, u1 = 0, v1 = 0;
  for (let i = from; i < to; i++) { u0 = Math.min(u0, uv.getX(i)); u1 = Math.max(u1, uv.getX(i)); v0 = Math.min(v0, uv.getY(i)); v1 = Math.max(v1, uv.getY(i)); }
  const cv = new OffscreenCanvas(img.width, img.height), cx = cv.getContext('2d', {willReadFrequently: true});
  cx.drawImage(img, 0, 0);
  const row = (v) => Math.round((map.flipY ? 1 - v : v) * img.height), x0 = Math.floor(u0 * img.width), x1 = Math.ceil(u1 * img.width);
  const y0 = Math.max(0, Math.min(row(v0), row(v1)) - 1), y1 = Math.min(img.height, Math.max(row(v0), row(v1)) + 1);
  const d = cx.getImageData(x0, y0, x1 - x0, y1 - y0), px = d.data, P = HAIR_PAINT;
  let n = 0;
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i] / 255, gg = px[i + 1] / 255, b = px[i + 2] / 255, mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
    if (mx - mn < 0.12 || !(b > gg && r > gg)) continue;   // her hair's pink and violet only (red and blue over green)
    const l = 0.299 * r + 0.587 * gg + 0.114 * b, k = Math.min(1, Math.max(0, (l - 0.3) / 0.45));
    const c = k < 0.5 ? P.shade.map((x, j) => x + (P.mid[j] - x) * k * 2) : P.mid.map((x, j) => x + (P.pale[j] - x) * (k - 0.5) * 2 * 0.6);
    px[i] = c[0] * 255; px[i + 1] = c[1] * 255; px[i + 2] = c[2] * 255; n++;
  }
  cx.putImageData(d, x0, y0);
  map.image = cv.transferToImageBitmap(); map.needsUpdate = true;
  return n;
}
/** Her hair mesh out of a loaded model: the vertices from..to of its skinned mesh, posed as it stands, in the model root's frame. */
export function hairOfModel(root, {from = 4328, to = 7020} = {}) {
  let sk = null;
  root.traverse((o) => { if (!sk && (o.isSkinnedMesh || o.isMesh)) sk = o; });
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(), v = new THREE.Vector3(), n = to - from, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { (sk.getVertexPosition ? sk.getVertexPosition(from + i, v) : v.fromBufferAttribute(sk.geometry.attributes.position, from + i)); v.applyMatrix4(sk.matrixWorld).applyMatrix4(inv); pos.set([v.x, v.y, v.z], i * 3); }
  const index = sk.geometry.index.array, tris = [];
  for (let t = 0; t < index.length; t += 3) if (index[t] >= from && index[t] < to && index[t + 1] >= from && index[t + 1] < to && index[t + 2] >= from && index[t + 2] < to) tris.push(index[t] - from, index[t + 1] - from, index[t + 2] - from);
  return {pos, tris: Uint32Array.from(tris)};
}

// ---- 2. THE LIGHT FROM ITS SOURCE ----
// The field any surface can take: light arriving from the source (view space), falling with distance, brightest where a ray strikes.
export const FIELD_GLSL = `
uniform vec3 uFieldSrc; uniform float uFieldPower, uFieldReach; uniform vec3 uFieldColor; uniform vec4 uFieldRays[16];
vec3 fieldLight(vec3 p, vec3 n) {
  vec3 d = p - uFieldSrc; float r = length(d); vec3 l = d / max(r, 1e-4);
  float fall = 1.0 / (1.0 + (r * r) / (0.08 * uFieldReach * uFieldReach));
  float rays = 0.0;
  for (int i = 0; i < 16; i++) rays += uFieldRays[i].w * smoothstep(0.985, 0.9995, dot(l, uFieldRays[i].xyz));
  return uFieldColor * uFieldPower * fall * (0.25 + 0.75 * max(dot(n, -l), 0.0)) * (0.45 + 1.4 * rays);
}`;
const BEAM_VS = `
uniform float uReach, uGrow, uT, uWidth, uSpin;
attribute vec3 aDir; attribute float aK, aW, aEnd, aSide, aThin;
varying float vEnd; varying float vSide; varying float vK; varying float vThin; varying float vSeed;
${CURL}
void main() {
  float c = cos(uSpin), s = sin(uSpin);
  vec3 dl = vec3(c * aDir.x - s * aDir.y, s * aDir.x + c * aDir.y, aDir.z);   // the rays turn slowly about the picture's axis
  float len = uReach * mix(0.55, 1.0, aK) * mix(1.25, 1.0, 1.0 - aThin) * uGrow;  // in the source's frame
  vec4 at = modelViewMatrix * vec4(dl * len * aEnd, 1.0);
  vec3 dv = normalize(mat3(modelViewMatrix) * dl);
  float scale = length(mat3(modelViewMatrix) * vec3(1.0, 0.0, 0.0));
  vec3 side = normalize(cross(dv, normalize(-at.xyz)) + vec3(0.0, 1e-5, 0.0));
  float w = uWidth * mix(1.0, 0.25, aThin) * (0.6 + 0.12 * aW) * mix(1.0, 0.3, aEnd);
  at.xyz += side * aSide * w * scale;
  vEnd = aEnd; vSide = aSide; vK = aK; vThin = aThin; vSeed = hash11(aK * 91.0 + aW);
  gl_Position = projectionMatrix * at;
}`;
const BEAM_FS = `
uniform float uPower, uT;
varying float vEnd; varying float vSide; varying float vK; varying float vThin; varying float vSeed;
void main() {
  float across = exp(-vSide * vSide * 6.0) * 0.75 + 0.25 * (1.0 - smoothstep(0.55, 1.0, abs(vSide))), core = exp(-vSide * vSide * 40.0);
  float along = (1.0 - smoothstep(0.45, 0.92, vEnd)) / (1.0 + 5.0 * vEnd * vEnd);   // falling with distance from the source
  float pulse = 0.78 + 0.22 * sin(vEnd * 38.0 - uT * 14.0 + vSeed * 6.283);         // the field's flow, outward along the ray
  float k = clamp(1.6 * uPower * mix(0.55, 1.0, vK) * across * along * pulse, 0.0, 1.0);
  vec3 c = mix(vec3(0.86, 0.54, 0.08), vec3(1.0, 0.86, 0.46), core * (1.0 - 0.6 * vEnd));   // amber edges, a gold core: seen on a white page
  gl_FragColor = vec4(c, k * mix(1.0, 0.8, vThin));
}`;
const GLOW_VS = `
uniform float uSize;
varying vec2 vXY;
void main() {
  vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  float scale = length(mat3(modelViewMatrix) * vec3(1.0, 0.0, 0.0));
  mv.xy += position.xy * uSize * scale;
  vXY = position.xy;
  gl_Position = projectionMatrix * mv;
}`;
const GLOW_FS = `
uniform float uPower, uSun;
varying vec2 vXY;
void main() {
  float r = length(vXY);
  float halo = 1.0 / (1.0 + 30.0 * r * r) * (1.0 - smoothstep(0.6, 1.0, r));
  float disc = (1.0 - smoothstep(0.17, 0.2, r)) * uSun;
  float k = clamp(uPower * (halo * 1.1 + disc), 0.0, 1.0);
  vec3 c = mix(vec3(0.9, 0.58, 0.12), vec3(1.0, 0.88, 0.55), clamp(1.0 - r * 3.0, 0.0, 1.0));
  gl_FragColor = vec4(c, k);
}`;
const MOTE_VS = `
uniform float uT, uReach, uPower, uPx, uHeight;
attribute vec3 aDir; attribute vec4 aLife;    // aLife: phase (s), period (s), speed (0..1), size (css px)
varying float vA;
${CURL}
void main() {
  float age = mod(uT - aLife.x, aLife.y), u = age / aLife.y;
  vec3 p = aDir * uReach * (0.08 + 0.92 * (1.0 - exp(-u * 3.0 * (0.6 + aLife.z)))) ;
  p += 0.06 * uReach * curlOf(p * 3.0 + aDir * 5.0, uT) * u;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vA = uPower * smoothstep(0.0, 0.08, u) * (1.0 - smoothstep(0.55, 1.0, u));
  gl_Position = projectionMatrix * mv;
  gl_PointSize = vA > 0.004 ? aLife.w * uPx * (1.0 - 0.5 * u) : 0.0;
}`;
const MOTE_FS = `
varying float vA;
void main() {
  if (vA <= 0.004) discard;
  float r = length(gl_PointCoord - 0.5) * 2.0;
  gl_FragColor = vec4(mix(vec3(0.84, 0.5, 0.08), vec3(1.0, 0.86, 0.5), 1.0 - r), clamp(vA * (1.0 - smoothstep(0.3, 1.0, r)), 0.0, 1.0));
}`;
const FLAME_VS = `
uniform float uT, uFlames, uPx, uHeight, uRise, uSize;
attribute vec3 aNrm; attribute vec4 aLife;   // phase, life (s), seed, size
varying float vU; varying float vA; varying float vSeed;
${CURL}
void main() {
  float age = mod(uT - aLife.x, aLife.y), u = age / aLife.y;
  vec3 p = position + aNrm * 0.03 * u;
  // the fire's field: up (buoyancy, faster as it heats), swirled by the curl field, stepped from the surface
  vec3 q = p;
  for (int i = 0; i < 4; i++) { float h = age / 4.0; q += (vec3(0.0, uRise * (0.4 + 1.2 * u), 0.0) + 0.35 * uRise * curlOf(q * 4.0 + aLife.z * 7.0, uT * 0.7)) * h; }
  vec4 mv = modelViewMatrix * vec4(q, 1.0);
  float scale = length(mat3(modelViewMatrix) * vec3(1.0, 0.0, 0.0));
  vU = u; vSeed = aLife.z;
  // the fire burns at the silhouette (where the surface turns away from the eye) and over the top, so the figure reads inside its flames
  vec3 nv = normalize(normalMatrix * aNrm);
  float rim = 1.0 - abs(nv.z), top = max(nv.y, 0.0);
  vA = uFlames * smoothstep(0.0, 0.12, u) * (1.0 - smoothstep(0.5, 1.0, u)) * clamp(0.12 + 0.9 * rim * rim + 0.4 * top, 0.0, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = vA > 0.004 ? aLife.w * uSize * scale * projectionMatrix[1][1] * uHeight * 0.5 / max(-mv.z, 1e-3) * (0.6 + 0.8 * u * (1.0 - u) * 2.0) : 0.0;
}`;
const FLAME_FS = `
varying float vU; varying float vA; varying float vSeed;
void main() {
  if (vA <= 0.004) discard;
  vec2 q = gl_PointCoord - 0.5; q.y = -q.y;
  // a soft tongue: a vertical ellipse, fuller at its foot, its tip drawn up and swaying with its seed
  q.x += 0.12 * sin(q.y * 6.0 + vSeed * 6.283) * (q.y + 0.5);
  float r = length(vec2(q.x * (2.6 - 1.4 * (q.y + 0.5)), q.y * 1.15)) * 2.0;
  float k = (1.0 - smoothstep(0.2, 1.0, r)) * 0.7;
  vec3 hot = vec3(1.0, 0.84, 0.42), gold = vec3(0.96, 0.6, 0.1), ember = vec3(0.74, 0.24, 0.04);
  vec3 c = vU < 0.35 ? mix(hot, gold, vU / 0.35) : mix(gold, ember, (vU - 0.35) / 0.65);
  gl_FragColor = vec4(c, clamp(k * vA, 0.0, 1.0));
}`;

/**
 * THE LIGHT FROM ITS SOURCE. Returns {object (a Group of the beams, the core and the motes: add it to the scene; update(t, {source, offset})
 * stands it where the source is each draw, turned as the scene is, so from the eye the rays keep the film's angles), flames (Points: after
 * surface(sampleSurface(cloth, n)) add them to that cloth, so they stand on it as it turns), uniforms (FIELD_GLSL's, shared: give them to any
 * surface that takes the field's light), update(t, {height, px, camera, source, offset}), surface(points), dispose()}. `reach`: how far the
 * rays go, in the parent's units.
 */
export function createLight({budget = 'full', reach = 2.5, width = 0.15, core = 1.1, motes = BUDGETS[budget].motes, flames = BUDGETS[budget].flames,
  extraRays = BUDGETS[budget].extraRays, seed = 3} = {}) {
  const group = new THREE.Group(); group.name = 'fields:light';
  const rays = raysOf({extra: extraRays, seed});
  // the beams
  const nb = rays.length, attrs = {aDir: [], aK: [], aW: [], aEnd: [], aSide: [], aThin: []}, index = [];
  rays.forEach((r, i) => {
    for (const [end, side] of [[0, -1], [0, 1], [1, -1], [1, 1]]) {
      attrs.aDir.push(...r.dir); attrs.aK.push(r.k); attrs.aW.push(r.width); attrs.aEnd.push(end); attrs.aSide.push(side); attrs.aThin.push(r.thin ? 1 : 0);
    }
    const a = i * 4; index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  });
  const beamGeo = new THREE.BufferGeometry();
  beamGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nb * 4 * 3), 3));
  for (const [k, v] of Object.entries(attrs)) beamGeo.setAttribute(k, new THREE.BufferAttribute(new Float32Array(v), k === 'aDir' ? 3 : 1));
  beamGeo.setIndex(index);
  const beamU = {uReach: {value: reach}, uGrow: {value: 0}, uT: {value: 0}, uWidth: {value: width}, uSpin: {value: 0}, uPower: {value: 0}};
  const beams = new THREE.Mesh(beamGeo, new THREE.ShaderMaterial({vertexShader: BEAM_VS, fragmentShader: BEAM_FS, uniforms: beamU, transparent: true, depthWrite: false, side: THREE.DoubleSide}));
  beams.frustumCulled = false; beams.renderOrder = 5; group.add(beams);
  // the hot core (and the film's gold sun, 47.6 to 50 s)
  const glowU = {uSize: {value: core}, uPower: {value: 0}, uSun: {value: 0}};
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({vertexShader: GLOW_VS, fragmentShader: GLOW_FS, uniforms: glowU, transparent: true, depthWrite: false}));
  glow.frustumCulled = false; glow.renderOrder = 6; group.add(glow);
  // the motes, carried outward by the field (more along the rays)
  const r = rng(seed + 17), md = new Float32Array(motes * 3), ml = new Float32Array(motes * 4);
  for (let i = 0; i < motes; i++) {
    const ray = rays[Math.floor(r() * Math.min(rays.length, 16))], j = 0.35;
    const d = ray.dir.map((x) => x + (r() - 0.5) * j), l = Math.hypot(...d);
    md.set(d.map((x) => x / l), i * 3); ml.set([r() * 3, 1.4 + 1.6 * r(), r(), 3 + 4 * r()], i * 4);
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(motes * 3), 3));
  moteGeo.setAttribute('aDir', new THREE.BufferAttribute(md, 3)); moteGeo.setAttribute('aLife', new THREE.BufferAttribute(ml, 4));
  const moteU = {uT: {value: 0}, uReach: {value: reach}, uPower: {value: 0}, uPx: {value: 1}, uHeight: {value: 1}};
  const moteMesh = new THREE.Points(moteGeo, new THREE.ShaderMaterial({vertexShader: MOTE_VS, fragmentShader: MOTE_FS, uniforms: moteU, transparent: true, depthWrite: false}));
  moteMesh.frustumCulled = false; moteMesh.renderOrder = 7; group.add(moteMesh);
  // the flames, off a surface (the cloth's, given by surface(): add `flames` to the object whose surface it is, so they stand on it as it turns);
  // until then off a small sphere round the source. Their rise and size follow the surface's height.
  const flameU = {uT: {value: 0}, uFlames: {value: 0}, uPx: {value: 1}, uHeight: {value: 1}, uRise: {value: 0.55}, uSize: {value: 0.09}};
  const flameMat = new THREE.ShaderMaterial({vertexShader: FLAME_VS, fragmentShader: FLAME_FS, uniforms: flameU, transparent: true, depthWrite: false});
  const flameMesh = new THREE.Points(new THREE.BufferGeometry(), flameMat);
  flameMesh.frustumCulled = false; flameMesh.renderOrder = 4; flameMesh.name = 'fields:flames';
  const surface = (pts) => {
    const n = pts.pos.length / 3, life = new Float32Array(n * 4), rf = rng(seed + 29);
    for (let i = 0; i < n; i++) life.set([rf() * 2, 0.55 + 0.6 * rf(), rf(), 0.6 + 0.8 * rf()], i * 4);
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < n; i++) { lo = Math.min(lo, pts.pos[i * 3 + 1]); hi = Math.max(hi, pts.pos[i * 3 + 1]); }
    const tall = Math.max(hi - lo, 1e-3);
    flameU.uRise.value = 0.6 * tall; flameU.uSize.value = 0.13 * tall;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pts.pos, 3)); geo.setAttribute('aNrm', new THREE.BufferAttribute(pts.nrm, 3));
    geo.setAttribute('aLife', new THREE.BufferAttribute(life, 4));
    flameMesh.geometry.dispose(); flameMesh.geometry = geo;
  };
  surface(sphereSurface(flames, 0.25, seed + 5));
  group.add(flameMesh);   // round the source until surface() is given and the page moves it onto the cloth
  // the field's uniforms for surfaces (view space), shared
  const uniforms = {uFieldSrc: {value: new THREE.Vector3()}, uFieldPower: {value: 0}, uFieldReach: {value: reach}, uFieldColor: {value: new THREE.Vector3(1.0, 0.78, 0.36)},
    uFieldRays: {value: Array.from({length: 16}, (_, i) => new THREE.Vector4(...(rays[i]?.dir ?? [0, 0, 1]), rays[i] ? rays[i].k : 0))}};
  const local = rays.slice(0, 16).map((x) => new THREE.Vector3(...x.dir)), tmp = new THREE.Vector3(), q = new THREE.Quaternion();
  return {
    object: group, flames: flameMesh, uniforms, rays, budgetFlames: flames,
    /**
     * The field at the film's second t: height the drawing buffer's height (device px), px device px a css px; camera to put the surfaces'
     * uniforms in view space (the scene's world is the view space when the camera stands at the origin's eye, as unboxing.js's does).
     */
    update(t, {height = 1, px = 1, camera = null, source = null, offset = null} = {}) {
      const L = lightAt(t);
      group.visible = L.on;
      if (source) {   // the field stands where its source is (in the group's parent's frame), turned as that parent is: the rays keep the film's angles
        source.updateWorldMatrix(true, false);
        tmp.set(...(offset ?? [0, 0, 0])).applyMatrix4(source.matrixWorld);
        if (group.parent) { group.parent.updateWorldMatrix(true, false); tmp.applyMatrix4(new THREE.Matrix4().copy(group.parent.matrixWorld).invert()); }
        group.position.copy(tmp); group.updateMatrix();
      }
      const power = L.power;
      beamU.uT.value = t; beamU.uGrow.value = Math.max(L.grow * Math.max(L.burst, L.star), 0.4 * L.flood); beamU.uSpin.value = 0.05 * (t - 45.445);
      beamU.uPower.value = power * Math.max(L.burst, L.star * 0.8, L.flood * 0.6);
      beamU.uWidth.value = width * (L.burst > L.star ? 1 : 0.55);
      beams.visible = beamU.uPower.value > 0.003 && beamU.uGrow.value > 0.003;
      glowU.uPower.value = Math.min(1, power * (0.55 + 0.45 * Math.max(L.burst, L.sun, L.flood, L.flames))); glowU.uSun.value = Math.max(L.sun, L.flood * 0.6);
      moteU.uT.value = t; moteU.uPower.value = power * Math.max(L.burst, L.star * 0.5, L.flames * 0.5); moteU.uPx.value = px; moteU.uHeight.value = height;
      moteMesh.visible = moteU.uPower.value > 0.003;
      flameU.uT.value = t; flameU.uFlames.value = L.flames; flameU.uPx.value = px; flameU.uHeight.value = height;
      flameMesh.visible = L.on && L.flames > 0.003;
      // the surfaces' field, in view space
      group.updateWorldMatrix(true, false);
      tmp.setFromMatrixPosition(group.matrixWorld);
      if (camera) tmp.applyMatrix4(camera.matrixWorldInverse);
      uniforms.uFieldSrc.value.copy(tmp); uniforms.uFieldPower.value = L.on ? power * Math.max(L.burst, L.star, L.sun * 0.7, L.flood, L.flames) : 0;
      group.matrixWorld.decompose(tmp, q, new THREE.Vector3());
      if (camera) q.premultiply(new THREE.Quaternion().setFromRotationMatrix(camera.matrixWorldInverse));
      const c = Math.cos(beamU.uSpin.value), s = Math.sin(beamU.uSpin.value);
      local.forEach((d, i) => { const v = new THREE.Vector3(c * d.x - s * d.y, s * d.x + c * d.y, d.z).applyQuaternion(q); uniforms.uFieldRays.value[i].set(v.x, v.y, v.z, rays[i].k); });
      return L;
    },
    surface,
    dispose() { beamGeo.dispose(); moteGeo.dispose(); flameMesh.geometry.dispose(); for (const m of [beams, glow, moteMesh]) m.material.dispose(); flameMat.dispose(); },
  };
}
/** n points on a sphere of radius r (a stand-in surface for the flames until the cloth's is given). */
function sphereSurface(n, r, seed) {
  const g = rng(seed), pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const z = g() * 2 - 1, a = g() * Math.PI * 2, s = Math.sqrt(1 - z * z), d = [s * Math.cos(a), z, s * Math.sin(a)];
    pos.set(d.map((x) => x * r), i * 3); nrm.set(d, i * 3);
  }
  return {pos, nrm};
}
/**
 * Points on the surface of every mesh under `root`, as it stands (skinned meshes posed), in `frame`'s coordinates (an Object3D; root's own by
 * default): {pos, nrm, col (0..1 rgb from the material's map where it can be read, else its colour; zeros with colours: false)}. For the flames
 * (the cloth, colours: false: no texture is read) and a dissolve.
 */
export function sampleSurface(root, n, {frame = root, seed = 11, colours = true} = {}) {
  root.updateMatrixWorld(true); frame.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(frame.matrixWorld).invert(), meshes = [];
  root.traverse((o) => { if (o.isMesh && o.geometry?.attributes?.position && o.visible !== false && !o.name.startsWith('fields:')) meshes.push(o); });
  const pos = [], tris = [], uv = [], owner = [];
  const v = new THREE.Vector3();
  for (const m of meshes) {
    const g = m.geometry, base = pos.length / 3, count = g.attributes.position.count, toFrame = new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld);
    for (let i = 0; i < count; i++) {
      if (m.isSkinnedMesh) m.getVertexPosition(i, v); else v.fromBufferAttribute(g.attributes.position, i);
      v.applyMatrix4(toFrame); pos.push(v.x, v.y, v.z);
      uv.push(g.attributes.uv ? g.attributes.uv.getX(i) : 0, g.attributes.uv ? g.attributes.uv.getY(i) : 0);
    }
    const idx = g.index ? g.index.array : Array.from({length: count}, (_, i) => i);
    for (let t = 0; t + 2 < idx.length; t += 3) { tris.push(base + idx[t], base + idx[t + 1], base + idx[t + 2]); owner.push(meshes.indexOf(m)); }
  }
  const S = surfaceOf(Float32Array.from(pos), Uint32Array.from(tris), n, {seed}), col = new Float32Array(n * 3);
  if (!colours) return {pos: S.pos, nrm: S.nrm, col};   // the flames take their own fire's colours: no texture read
  const readers = meshes.map((m) => pixelsOf(m.material));
  for (let k = 0; k < n; k++) {
    const t = S.tri[k], [a, b, c] = [tris[t * 3], tris[t * 3 + 1], tris[t * 3 + 2]], [bu, bv] = [S.bary[k * 2], S.bary[k * 2 + 1]];
    const U = uv[a * 2] * (1 - bu - bv) + uv[b * 2] * bu + uv[c * 2] * bv, V = uv[a * 2 + 1] * (1 - bu - bv) + uv[b * 2 + 1] * bu + uv[c * 2 + 1] * bv;
    col.set(readers[owner[t]](U, V), k * 3);
  }
  return {pos: S.pos, nrm: S.nrm, col};
}
/** A material's colour at a uv: its map's pixel when the image can be drawn (an ImageBitmap or an image), else its colour. */
function pixelsOf(material) {
  const m = [material].flat()[0], base = m?.color ? [m.color.r, m.color.g, m.color.b] : [0.8, 0.8, 0.8], img = m?.map?.image;
  if (!img || typeof OffscreenCanvas === 'undefined' || !(img.width > 0)) return () => base;
  try {
    const cv = new OffscreenCanvas(img.width, img.height), cx = cv.getContext('2d', {willReadFrequently: true});
    cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, img.width, img.height).data, flip = m.map.flipY;
    return (u, v) => {
      const x = Math.min(img.width - 1, Math.max(0, Math.floor((u - Math.floor(u)) * img.width)));
      const yy = (v - Math.floor(v)) * img.height, y = Math.min(img.height - 1, Math.max(0, Math.floor(flip ? img.height - 1 - yy : yy)));
      const o = (y * img.width + x) * 4;
      return [d[o] / 255, d[o + 1] / 255, d[o + 2] / 255];
    };
  } catch { return () => base; }
}

// ---- THE RIPPLE (fields-plan.mjs rippleAt; the cubist-fit session's yes of Oct 14 2026 18:4x WEST) ----
/**
 * Her portal's fronts as a field that bends what they pass on the stage: HER STRANDS ONLY. Her body's surface and her dress (one mesh, one
 * material) never bend: the ruling on her (she is Saori, 13: no jiggle of her body, nothing that sexualizes her; relayed 18:5x WEST, and the
 * coordinator at 19:05 WEST: the ripple on her strands only is right). So there is no patch for a material here. Returns {uniforms (her
 * strands take them; a shader that reads the film by its stage position may include RIPPLE_GLSL and call rippleBendStage),
 * update(t, {geometry, rect})}. geometry: the window's,
 * {origin, reach, zFull} (cubism-window.js stats.geometry: the fronts are then cubism.mjs PORTAL's), or {origin, r, k, wall, kWall} with the
 * fronts given by the window's owner (the box's fold window, his 18:47 WEST, once it lands); null before a window opens. rect: this canvas in
 * the stage, css px. It draws nothing (the window draws its line) and asks for no frame.
 */
export function createRipple({shape = RIPPLE_SHAPE} = {}) {
  const uniforms = {uRipple: {value: new THREE.Vector4(0, 0, 0, 0)}, uRippleWall: {value: new THREE.Vector2(-1, 0)},   // a Vector4's w is 1 by default: off is 0
    uRippleRect: {value: new THREE.Vector4(0, 0, 1, 1)}, uRippleShape: {value: new THREE.Vector3(...shape)}};
  const off = {on: false, r: 0, k: 0, wall: -1, kWall: 0};
  return {
    uniforms,
    update(t, {geometry = null, rect = null} = {}) {
      const R = !geometry ? off : Number.isFinite(geometry.r)
        ? {on: true, r: geometry.r, k: geometry.k ?? 1, wall: geometry.wall ?? -1, kWall: geometry.kWall ?? 0}
        : rippleAt(t, geometry);
      uniforms.uRipple.value.set(geometry?.origin?.[0] ?? 0, geometry?.origin?.[1] ?? 0, R.r, R.on ? R.k : 0);
      uniforms.uRippleWall.value.set(R.wall, R.on ? R.kWall : 0);
      if (rect) uniforms.uRippleRect.value.set(rect.left, rect.top, Math.max(1, rect.width), Math.max(1, rect.height));
      return R;
    },
  };
}

// ---- THE FIELDS MOUNTED IN A BOX'S SCENE (the unboxing session's shape, its message of Oct 14 2026 18:1x WEST) ----
/**
 * The light from the cloth and her strands, mounted in one call in the scene that draws the box: `cloth` is the group the cloth stands in, or a
 * function returning it when it is made after the faces (the field's source is its centre, `clothOffset` in its frame). Returns:
 *   uniforms                 FIELD_GLSL's, for the faces that take the field's light (Object.assign them into the faces' shared uniforms)
 *   cloth(holder)            once a cloth stands in that group: the flames on its own surface (no texture read)
 *   athena(holder, spot, {cut}) once she is loaded and in her spot: her strands grown from her hair, her long locks hidden under them, her cap in
 *                            the film's paint; before the page's compile step, so their program is compiled with hers; cut: the page's uniform
 *                            of the five planes the face she joins cuts her by ({value: [vec4 x 5]}, view space), shared with her strands
 *   glow(t)                  the field's strength at t (0..1.6), for the cloth's own aura
 *   update(t, beat, {height, px, box, rect})  inside each draw, after the box and Athena have been placed for it: the light stands at the
 *                            cloth while the box is out (box) and the cloth is shown (beat.cloth.show); her strands follow her spot and her
 *                            clipping, read the flow round her head on the screen, and wear THE CUTS' look her body wears that draw; the ripple
 *                            takes her portal's fronts on her strands only (the window's geometry, `portal`; on this canvas: rect, css px in
 *                            the stage). `portal` returns the window's geometry: by default her disc's (cubism-window.js); the box's fold window
 *                            (his 18:47 WEST) passes its own, its fronts given ({origin, r, k, wall, kWall}), once it lands. Nothing touches her
 *                            body or her dress.
 * Nothing here schedules a frame. All of it is a function of t: a seek lands on the same picture.
 */
export function mountFields({scene, camera, cloth, budget = 'full', clothOffset = [0, 0.55, 0], reach = undefined,
  portal = () => portalWindows.find((w) => w.stats.geometry)?.stats.geometry ?? null} = {}) {
  const light = createLight({budget, ...(reach ? {reach} : {})}), ripple = createRipple();
  scene.add(light.object);
  const source = () => (typeof cloth === 'function' ? cloth() : cloth);   // a function when the group is made after the faces (unboxing.js)
  let hair = null, herMesh = null, herSpot = null;
  const shown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
  return {
    light, ripple, uniforms: light.uniforms,
    get hair() { return hair; },
    cloth(holder) { light.surface(sampleSurface(holder, light.budgetFlames, {frame: holder, colours: false})); holder.add(light.flames); },
    athena(holder, spot, {cut = null} = {}) {
      const meshes = []; holder.traverse((o) => { if (o.isMesh) meshes.push(o); });
      herMesh = meshes.find((m) => m.isSkinnedMesh) ?? meshes[0]; herSpot = spot;
      hair = createHair({...hairOfModel(holder), budget, ripple});
      if (cut) hair.uniforms.uHerCut = cut;   // her cut's own uniform, shared: the page moves it, her strands follow
      hair.keepCap(herMesh); filmPaint(herMesh);
      const m = [herMesh.material].flat()[0];
      hair.material.clippingPlanes = m.clippingPlanes ?? null; hair.material.clipIntersection = Boolean(m.clipIntersection);
      spot.add(hair.object);
      return hair;
    },
    glow(t) { const L = lightAt(t); return L.on ? L.power * Math.max(L.burst, L.star, L.sun, L.flood, L.flames) : 0; },
    update(t, beat, {height = 1, px = 1, box = true, rect = null} = {}) {
      const L = light.update(t, {height, px, camera, source: source(), offset: clothOffset});
      ripple.update(t, {geometry: portal?.() ?? null, rect});
      if (!(box && beat?.out && beat?.cloth?.show)) light.object.visible = false;
      let h = null;
      if (hair) {
        h = hairAt(t);
        hair.object.visible = shown(herSpot);
        if (hair.object.visible) {
          const m = [herMesh.material].flat()[0];
          if (hair.material.clippingPlanes !== (m.clippingPlanes ?? null)) { hair.material.clippingPlanes = m.clippingPlanes ?? null; hair.material.clipIntersection = Boolean(m.clipIntersection); }
          hair.uniforms.uPass.value = m.isMeshNormalMaterial ? 1 : m.isMeshBasicMaterial ? 2 : 0;
          herSpot.updateWorldMatrix(true, false);
          hair.update(t, {flowFrame: screenFlowFrame(herSpot.matrixWorld.clone().transpose().elements)});
        }
      }
      return {light: L, hair: h};
    },
  };
}

// ---- 3. THE SILHOUETTE ----
const DUST_VS = `
uniform float uT, uAt, uDuration, uLife, uPx, uHeight, uSize, uStyle;
uniform vec3 uWind, uUp;
attribute vec3 aNrm; attribute vec3 aCol; attribute float aSeed;
varying float vA; varying vec3 vCol; varying float vAge; varying float vSpin; varying float vTumble; varying float vSeed; varying vec2 vDir; varying float vStretch;
${CURL}
${FRONT}
// where a released point is, age seconds after its release: six steps through its style's field
vec3 carry(vec3 p, float age) {
  float h = age / 6.0;
  vec3 v0 = aNrm * (uStyle > 0.5 && uStyle < 1.5 ? 0.9 : 0.25) + uWind * 0.3;
  for (int i = 0; i < 6; i++) {
    float tt = h * float(i);
    vec3 f;
    if (uStyle < 0.5) f = uUp * (0.16 + 0.3 * tt) + uWind * 0.55 + 0.34 * curlOf(p * 2.2 + aSeed * 9.0, uT * 0.5);          // smoke: rises, swirls
    else if (uStyle < 1.5) f = v0 - uUp * 2.6 * tt + 0.08 * curlOf(p * 3.0 + aSeed * 9.0, uT);                              // water: thrown, falls
    else f = uWind * 0.85 - uUp * 0.16 + 0.42 * curlOf(p * 1.6 + aSeed * 9.0, uT * 0.4);                                    // petals: drift, flutter
    p += f * h;
  }
  return p + aNrm * 0.02 * (1.0 - exp(-age * 6.0));
}
void main() {
  float rel = uAt + uDuration * frontOf(position), age = uT - rel;
  vAge = age / uLife; vSeed = aSeed;
  vec3 p = age > 0.0 ? carry(position, age) : position;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float scale = length(mat3(modelViewMatrix) * vec3(1.0, 0.0, 0.0));
  vA = age > 0.0 ? smoothstep(0.0, 0.08, vAge) * (1.0 - smoothstep(0.45, 1.0, vAge)) : 0.0;
  vCol = aCol; vSpin = aSeed * 6.283 + age * (1.5 + 3.0 * aSeed); vTumble = cos(age * (2.0 + 2.0 * aSeed) + aSeed * 9.0);
  gl_Position = projectionMatrix * mv;
  // water is drawn along its own motion on the screen (where it was a twentieth of a second before)
  vDir = vec2(1.0, 0.0); vStretch = 1.0;
  if (uStyle > 0.5 && uStyle < 1.5 && age > 0.06) {
    vec4 was = projectionMatrix * modelViewMatrix * vec4(carry(position, age - 0.05), 1.0);
    vec2 d = gl_Position.xy / gl_Position.w - was.xy / was.w;
    float l = length(d * uHeight);
    if (l > 1e-4) { vDir = normalize(vec2(d.x, -d.y)); vStretch = clamp(1.0 + l * 0.12, 1.0, 3.2); }
  }
  float grow = uStyle < 0.5 ? 0.6 + 2.8 * vAge : uStyle < 1.5 ? 0.9 - 0.4 * vAge : 1.0;
  gl_PointSize = vA > 0.004 ? uSize * grow * vStretch * (0.6 + 0.8 * aSeed) * scale * projectionMatrix[1][1] * uHeight * 0.5 / max(-mv.z, 1e-3) : 0.0;
}`;
const DUST_FS = `
uniform float uStyle; uniform vec3 uTintA, uTintB;
varying float vA; varying vec3 vCol; varying float vAge; varying float vSpin; varying float vTumble; varying float vSeed; varying vec2 vDir; varying float vStretch;
void main() {
  if (vA <= 0.004) discard;
  vec2 q = gl_PointCoord - 0.5;
  float k; vec3 c;
  if (uStyle < 0.5) {            // smoke: a soft puff, the body's colour going to its smoke
    float r = length(q) * 2.0;
    k = (1.0 - smoothstep(0.0, 1.0, r)) * 0.42;
    c = mix(vCol, mix(uTintA, uTintB, vSeed), smoothstep(0.0, 0.45, vAge));
  } else if (uStyle < 1.5) {     // water: a drop drawn along its motion, its light on it
    vec2 a = vec2(dot(q, vDir), dot(q, vec2(-vDir.y, vDir.x))) * 2.0;
    float r = length(vec2(a.x, a.y * vStretch));
    k = 1.0 - smoothstep(0.6, 0.95, r);
    c = mix(mix(vCol, uTintA, smoothstep(0.0, 0.3, vAge)), uTintB, smoothstep(0.2, 0.9, 1.0 - r) * 0.7);
    c = mix(c, vec3(0.2, 0.32, 0.5), smoothstep(0.6, 0.9, r) * 0.6);   // its dark rim, as a drawn drop
  } else {                       // petals: a petal turning and tumbling
    float cs = cos(vSpin), sn = sin(vSpin);
    vec2 p = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y) * 2.0;
    p.x /= max(abs(vTumble), 0.25);
    float w = 0.55 * sin(3.14159 * clamp(p.y * 0.5 + 0.5, 0.0, 1.0));
    k = (1.0 - smoothstep(w * 0.8, w, abs(p.x))) * step(abs(p.y), 1.0);
    c = mix(mix(vCol, uTintA, smoothstep(0.0, 0.25, vAge)), uTintB, smoothstep(0.2, 0.9, abs(p.x) / max(w, 1e-3)) * 0.6);
    c *= 0.82 + 0.18 * vTumble;
  }
  gl_FragColor = vec4(c, clamp(k * vA, 0.0, 1.0));
}`;
export const TINTS = Object.freeze({
  smoke: [[0.42, 0.38, 0.45], [0.72, 0.7, 0.74]],
  water: [[0.55, 0.72, 0.92], [0.85, 0.93, 1.0]],
  petals: [[0.86, 0.6, 0.86], [0.55, 0.32, 0.6]],        // her violet's petals; a gold body takes GOLD_PETALS
  goldSmoke: [[0.95, 0.72, 0.3], [1.0, 0.9, 0.62]],
  goldPetals: [[0.98, 0.78, 0.32], [0.76, 0.5, 0.12]],
});
const STYLE = {smoke: 0, water: 1, petals: 2};

/**
 * THE SILHOUETTE INTO SMOKE, WATER OR PETALS. `body` a loaded model as it stands (sampled once, here: n points by area, its own colours),
 * `at` the moment (film seconds; his pick), `style` 'smoke' | 'water' | 'petals', `sweep` the direction the front travels in the body's frame
 * (default down from the head), `wind` (body frame) what carries it. Returns {object (Points in the body's frame: add it to the body's parent
 * with the body's transform, or to the body itself), patch(material) (cuts the body's own material by the same front, a glowing rim at it),
 * update(t, {height}), dispose()}.
 */
const SIZES = {smoke: 0.075, water: 0.03, petals: 0.05};   // metres in the body's frame: a puff, a drop, a petal
export function createDissolve(body, {at, style = 'smoke', tint = null, budget = 'full', count = BUDGETS[budget].points[style] ?? 4000, duration = 1.6,
  life = 2.4, sweep = [0, -1, 0], wind = [-0.5, 0.15, 0], size = SIZES[style] ?? 0.04, fray = 0.35, seed = 11} = {}) {
  const S = sampleSurface(body, count, {seed}), n = S.pos.length / 3, seeds = new Float32Array(n), r = rng(seed + 3);
  for (let i = 0; i < n; i++) seeds[i] = r();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(S.pos, 3)); geo.setAttribute('aNrm', new THREE.BufferAttribute(S.nrm, 3));
  geo.setAttribute('aCol', new THREE.BufferAttribute(S.col, 3)); geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  // the front's span along the sweep, over the body's points
  const sw = new THREE.Vector3(...sweep).normalize();
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < n; i++) { const d = S.pos[i * 3] * sw.x + S.pos[i * 3 + 1] * sw.y + S.pos[i * 3 + 2] * sw.z; lo = Math.min(lo, d); hi = Math.max(hi, d); }
  const [ta, tb] = tint ?? TINTS[style];
  const uniforms = {uT: {value: 0}, uAt: {value: at}, uDuration: {value: duration}, uLife: {value: life}, uPx: {value: 1}, uHeight: {value: 1}, uSize: {value: size},
    uStyle: {value: STYLE[style] ?? 0}, uWind: {value: new THREE.Vector3(...wind)}, uUp: {value: new THREE.Vector3(0, 1, 0)},
    uSweep: {value: sw}, uSpan: {value: new THREE.Vector2(lo, hi)}, uFray: {value: fray},
    uTintA: {value: new THREE.Vector3(...ta)}, uTintB: {value: new THREE.Vector3(...tb)}};
  const material = new THREE.ShaderMaterial({vertexShader: DUST_VS, fragmentShader: DUST_FS, uniforms, transparent: true, depthWrite: false});
  const points = new THREE.Points(geo, material);
  points.frustumCulled = false; points.renderOrder = 8; points.name = 'fields:dissolve'; points.visible = false;
  // the body's own material, cut by the front: uCut runs ahead of the points by the front's width, so the surface goes as its dust leaves
  const cut = {uCut: {value: -1}, uRim: {value: new THREE.Vector3(1.0, 0.82, 0.45)}, uSweep: uniforms.uSweep, uSpan: uniforms.uSpan, uFray: uniforms.uFray,
    uToBody: {value: new THREE.Matrix4()}};
  const patched = [];
  function patch(material, mesh = null) {
    for (const m of [material].flat()) {
      if (!m || m.userData.fieldsDissolve) continue;
      m.userData.fieldsDissolve = true;
      const before = m.onBeforeCompile;
      m.onBeforeCompile = (sh, r) => {
        before?.call(m, sh, r);
        Object.assign(sh.uniforms, cut);
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform mat4 uToBody;\nvarying vec3 vBody;')
          .replace('#include <project_vertex>', '#include <project_vertex>\nvBody = (uToBody * vec4(transformed, 1.0)).xyz;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>\nuniform float uCut; uniform vec3 uRim;\nvarying vec3 vBody;\n${FRONT}`)
          .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nfloat fieldsFront = frontOf(vBody);\nif (fieldsFront < uCut) discard;')
          .replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.rgb = mix(gl_FragColor.rgb, uRim, (1.0 - smoothstep(0.0, 0.04, fieldsFront - uCut)) * step(-0.5, uCut));');
      };
      m.customProgramCacheKey = () => `fields-dissolve|${before ? String(before).length : 0}`;
      m.needsUpdate = true;
      patched.push({m, mesh});
    }
  }
  const toBody = new THREE.Matrix4(), inv = new THREE.Matrix4();
  return {
    object: points, uniforms, patch, count: n, at,
    /** her strands go with her body: the hair's front is this dissolve's (createHair in the same frame as `body`) */
    bindHair(hair) { for (const k of ['uSweep', 'uSpan', 'uFray', 'uCut']) hair.uniforms[k] = cut[k]; hair.material.uniforms = hair.uniforms; },
    /** the dissolve at the film's second t; height the drawing buffer's height (device px) */
    update(t, {height = 1} = {}) {
      const d = dissolveAt(t, uniforms.uAt.value, {duration, linger: life});
      uniforms.uT.value = t; uniforms.uHeight.value = height;
      points.visible = d.on && t >= uniforms.uAt.value;
      // the front on the body: the points leave where frontOf < (t - at) / duration
      cut.uCut.value = t < uniforms.uAt.value ? -1 : (t - uniforms.uAt.value) / duration;
      body.updateWorldMatrix(true, false); inv.copy(body.matrixWorld).invert();
      for (const {mesh} of patched) if (mesh) { mesh.updateWorldMatrix(true, false); toBody.multiplyMatrices(inv, mesh.matrixWorld); cut.uToBody.value.copy(toBody); }
      return d;
    },
    /** a new moment (his pick) without sampling again */
    setAt(t) { uniforms.uAt.value = t; },
    dispose() { geo.dispose(); material.dispose(); },
  };
}
