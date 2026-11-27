// theater.js: THE THEATER's engine, for the lab's theater.html and for the hero in hero-ab.html (his words and the law are in
// theater.html's header). createTheater({canvas, film}) draws the 1986 picture fixed and whole in the canvas, on `wall`, and the twelve
// as a Golden Snitch of glass flying to the light that theater-light.mjs read once from every frame (theater-light.json). Each face of
// the glass is a window onto the film behind it, drawn nearer and panned by the face's tilt. The flight is a pure function of the film's
// second. It draws once per frame the film presents (requestVideoFrameCallback, held only while the film plays and the theater is active),
// once on a seek, a resize or ask(); paused, nothing. The canvas may stand in another same-origin document (the hero's, in a frame): that
// document's own window gives the frames, the pixel ratio and the size. With `clear` the wall is not drawn: around the picture the canvas
// is transparent and the page it stands on shows (the hero's paper); `wall` is then only what the glass shows past the picture's edge.
//
// ONE ROAD THROUGH THREE VIEWS (his words, Oct 14 2026 12:4x WEST, over the hero's C: "think about interpolating these views/modalities...
// can you keep versionA until the conversion moment where we ask money?"). m runs from 0 to 2. 0 is the page's own sphere (A, warm-sphere.js)
// as the page draws it: the film's centre square laid on every face, an eye four circumradii away, its light and its hairline edges, where
// the page has it. 1 is the mask (C, his 12:3x "hide the background there... only show the video throygh the dodechahedron mask"): the
// picture hidden, the glass as large as the sphere, near the middle and leaning REACH of the way toward the light, the only window onto the
// film. 2 is the theater (B): the picture whole, the small glass flying to its light. From A to C the twelve copies of the frame slide into
// the one picture behind the glass, the perspective flattens, the hairlines thicken into gold leading and the glass moves to the mask's place
// and size; from C to B the film opens around the glass from its edge outward while the glass shrinks to the Snitch and takes the whole
// flight. `road(t)` gives m at each draw, with where the page's sphere is and how it is turned (no road: m stays `m`). The glass's place and
// size are the film's second and m alone. On a road its turning is its own: it starts from the sphere's pose, tumbles at a rate that grows
// with m, and below m 0.6 it is drawn back to the sphere's pose, so it lands on the page's sphere whenever the road comes back to A; with no
// road (theater.html) the turning too is a pure function of the film's second.
//
// THE BURST (his words, 13:1x WEST: "can you cast planes that explode out of the dodecahedron in these moments? there is only 2 ones...
// this one and then the golden aiolos athena light-plane... dodecahedron is hologram boundary projectuon but it is delightful if you make
// shit explode out of it like rays that "mask in" aka make visible shit from the background video... consider white background means no
// mask is making background visible", then "these fucking transition points my dude make the dodecahedron go wild light explosions themed
// geometrical hypercomputing"). The road may give a burst ({age, power}: seconds of film since it began): for BURST seconds the glass takes
// the sphere's place (the sphere's own picture, pose and edges, so nothing shows the hand-over), flashes, blows apart into its twelve
// plates with the light inside showing between them, and out of it come twenty rays from its corners, three dodecahedral shock shells and
// its twelve faces cast as planes; every one of them is a window onto the film, fixed behind the page as the theater has it, so where the
// page is white nothing is let in and where the burst passes the film is. Then the plates close and the glass hands the sphere back.
// Then (13:4x, after the slow-mo of the film he heard: "it is awful dude. you cant slow down the audio it morphs like shit... but the
// animation is epic.. cant you just keep the animation ongoing for longer? natural speed... longer duration of the animation more
// fluid...") the film keeps its own speed and the burst is the slow motion: it goes off at once (the flash, the plates parting, the rays
// out) and unfolds over BURST seconds, every piece slowing and none stopped when it fades: the shells and the planes drift on, the planes
// turn as they fly and fade as they come at the eye, the plates draw apart and close again. While a burst lasts and the film plays, the
// theater also draws at the screen's own frames (one every 12 ms at most, the film's last frame behind; not where a draw takes the GPU
// over 8 ms), so the burst moves at the screen's rate, not at the film's 30 frames a second.
// THE BOX OUT (unboxing.js): the road may say {glass: false} for a draw, and then the theater draws no glass of its own (no plates, no light
// between them): the 3D box stands where the sphere was and the burst's rays, shells and planes go off around it.
// THE CUTS (lab/CUTS.md, his "pay attention to his style recurring please? he got predicatble transitions", Oct 14 15:1x WEST): a burst's first
// tenth of a second showed the glass as its normals, the next a flat gold matte, then the picture; the same device as the box's and Athena's.
// NARROWED Oct 17 2026 20:4x WEST, his "it must be a glass i. dont want to seethis it must be transparent" over that pass frozen by the debug start:
// on this glass the passes come only by his word on the Nest (mint/glass pass 'cuts', glass-look.mjs) and only while the film moves; with no word
// the glass is the glass at every frame, and its flashes are light over the film (shine()). The box's and Athena's cuts keep the device.
// THE LIGHT-BOOMERANG (lab/sagittarius-flight.mjs, his Oct 17 2026 01:5x WEST): after the second burst the same glass flies, small, a bolt of
// lightning to the Sagittarius star, the Lyssajudron's 3:2 loop around it, and back; while it flies it keeps the burst's look (the film laid
// on every face, its gold leading lit), its own path is its golden wake and every turn of the bolt flashes it.
// THE SINGULARITY (the same file, his Oct 17 02:2x WEST "add some dmc4 typa shit boss fight idk where the dodecahedron encounters a singularity
// and out of it the golden sgittarius arises"): while it flies, a black hole on the star, come down into the sky: its horizon and gold photon
// ring here, the film around it bent by a point lens and swirled in (bent()); the glass fights it, each hit a shake of the whole picture, a star
// of sparks at the contact and a shock ring of refraction running out; at the finisher the world is pinched into the glass, and at the film's
// golden flash the flash opens out of that point (the rise). The captured hole rides home as the glass's core.
// THE TWELVE (the same file, his Oct 17 04:3x WEST "make it so that the 2nd time the dodecahedron explodes, this one is for good... can you use
// mani faces independently soinf the same thing?" and "ALL THE FUCKING TIMES YOUR ANIMATION IS ABSOLUTELY FUCKING OFFCENTERED"): the second
// burst is final (the road says burst.final), its plates never close, and from its last frame the glass is twelve faces, each its own pane
// (uFace: an affine pentagon a face, far to near, a dark halo under it, a gold streak behind it, the film through it, its gold leading, a hit's
// flash); they close into one glass again at the finisher. DCT-ALIGNED since his Oct 17 20:3x "the dodecaheron faces must begin to be aligned with
// the DCTs of the anime dude the spirit of the music" (lab/twelve-dct.js, tools/twelve-dct.mjs): no ring or fight of their own; they gather on the
// anime's drawings, stand as the glory of its light (the star, where the gold's rays converge), flash where its drawing moves and swell with the
// score, and bring the light down into the glass at the cut; the road's `flight` may name their anchor ({anchor: 'light' | 'centre'}).
// THE GLASS IS TRANSPARENT (glass-look.mjs, his Oct 17 2026 20:4x WEST "it must be a glass i. dont want to seethis it must be transparent", and 20:5x
// "do you understand the anamorphic shadow beef with butterflies"): the glass is the film seen through its faces, its gold leading, its halo; a flash is
// light over that film (shine()); THE CUTS' opaque passes come back only by his word on the Nest (mint/glass, `look`, setLook), and only while the film moves.
import {skyFlight} from './sagittarius-flight.mjs';
// THE TWELVE ON SEIYA (seiya-flight.mjs, his Oct 21 2026 words there): THE TWELVE's law over the cut to Athena's shot; the road's flight names it
// ({law: 'seiya'}) from that cut to the cut to Dolbar, and the theater draws it as it draws THE TWELVE
import {seiyaFlight} from './seiya-flight.mjs';
import {CLEAR, passAt} from './glass-look.mjs';
const REACH = 0.35;
const TRAIL = 16;
const HOME = 8;   // per second at m 0: how fast the glass turns back to the sphere's pose
const BURST = 5.2;   // seconds a burst lasts, at the film's own speed
// how far apart a final burst's plates stand at its last frame (its sep at age BURST, power 1): where THE TWELVE take them when nothing better is
// known (a flight entered without its burst drawn before it)
const SEP_FINAL = 0.34 * (1 - Math.exp(-BURST / 0.28)) + 0.04 * BURST;
// The hero lane's moments (warm-sphere.js SEIYA_MOMENTS and its comment, read off saint-seiya.mp4 ?v=53561d47).
const M = Object.freeze({cosmos: 100.25, flashOn: 105.0, flashPeak: 105.9, flash: 106.5, impact: 112.0});
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ss = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
const mix = (a, b, k) => a + (b - a) * k;
const hash = (n) => { let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };
const median5 = (a, i) => { const w = []; for (let k = i - 4; k <= i; k++) w.push(a[clamp(k, 0, a.length - 1)]); return w.sort((p, q) => p - q)[2]; };

// The flight: a spring after the light, over the whole track, in picture heights (x across 0..fa, y down 0..1). Only + - * / and sqrt,
// and an integer hash for the hops, so every engine flies the same path. Two loops; the second is kept, so the end meets the start.
export function fly(track, fa) {
  const n = track.frames, fps = track.fps, sub = 4, dt = 1 / (fps * sub);
  const tx = new Float64Array(n), ty = new Float64Array(n);
  for (let i = 0; i < n; i++) { tx[i] = median5(track.x, i) / 1000 * fa; ty[i] = median5(track.y, i) / 1000; }
  const out = new Float32Array(n * 4);
  let x = 0.5 * fa, y = 0.42, vx = 0, vy = 0, spin = 0, hx = x, hy = y, hop = 0;
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < n; i++) {
    const lit = ss(400, 750, track.s[i]);
    if (i >= hop) {   // with no light it hovers, a hop every 0.5 to 1.3 s near where it is
      hx = clamp(x + (hash(i * 3 + 1) - 0.5) * 0.7, 0.12 * fa, 0.88 * fa); hy = clamp(y + (hash(i * 3 + 2) - 0.5) * 0.5, 0.1, 0.72);
      hop = i + Math.round(fps * (0.5 + 0.8 * hash(i * 3 + 3)));
    }
    const gx = mix(hx, tx[i], lit), gy = mix(hy, ty[i], lit), k = mix(45, 150, lit), c = 2 * 0.7 * Math.sqrt(k);
    for (let s = 0; s < sub; s++) {
      vx += (k * (gx - x) - c * vx) * dt; vy += (k * (gy - y) - c * vy) * dt;
      x += vx * dt; y += vy * dt;
    }
    const speed = Math.sqrt(vx * vx + vy * vy);
    spin += (2.5 + 10 * speed) / fps;
    if (pass === 1) { out[i * 4] = x; out[i * 4 + 1] = y; out[i * 4 + 2] = spin; out[i * 4 + 3] = lit; }
  }
  return out;
}

// The sphere's own dodecahedron (assembly-geometry.js buildAssemblySkin(0)): circumradius one, the twelve face normals the icosahedron's
// corners, each face's centre at the inradius H and its corners RHO from that centre; its twenty corners the icosahedron's face centres.
const PHI = (1 + Math.sqrt(5)) / 2;
const unit3 = (v) => { const l = Math.hypot(...v); return v.map(c => c / l); };
const FACES = [[0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI], [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1]].map(unit3);
const CORNERS = [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
  [0, PHI, 1 / PHI], [0, PHI, -1 / PHI], [0, -PHI, 1 / PHI], [0, -PHI, -1 / PHI], [1 / PHI, 0, PHI], [-1 / PHI, 0, PHI], [1 / PHI, 0, -PHI],
  [-1 / PHI, 0, -PHI], [PHI, 1 / PHI, 0], [PHI, -1 / PHI, 0], [-PHI, 1 / PHI, 0], [-PHI, -1 / PHI, 0]].map(unit3);
const H = 0.7947, RHO = 0.6071;
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
// each face's five corners, in turn around it
const RINGS = FACES.map((n) => {
  const five = CORNERS.filter(v => dot3(v, n) > 0.79), u = unit3(five[0].map((c, i) => c - n[i] * H)), w = cross3(n, u);
  return five.sort((a, b) => Math.atan2(dot3(a, w), dot3(a, u)) - Math.atan2(dot3(b, w), dot3(b, u)));
});
// warm-sphere.js decal(): a face's picture lies on two tangent axes one face-radius long, across = unit(cross([0, 1, 0], n)) (no normal
// here is near the pole) and up = cross(n, across), the picture's top toward up
const ACROSS = FACES.map(([x, , z]) => { const l = Math.hypot(z, x); return [z / l, 0, -x / l]; });
const UP = FACES.map((n, i) => cross3(n, ACROSS[i]));

// turns as row-major 3 x 3 matrices: the sphere's (warm-sphere.js rotate(): the yaw about the vertical, then the pitch) and the glass's tumble
const sphereTurn = (yaw, pitch) => {
  const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  return [c, 0, -s, -s * sp, cp, -c * sp, s * cp, sp, c * cp];
};
function tumble(spin) {
  const a = spin, b = spin * 0.61 + 0.7, c = spin * 0.37 + 1.9;
  const [ca, sa, cb, sb, cc, sc] = [Math.cos(a), Math.sin(a), Math.cos(b), Math.sin(b), Math.cos(c), Math.sin(c)];
  return [cb * cc, sa * sb * cc - ca * sc, ca * sb * cc + sa * sc, cb * sc, sa * sb * sc + ca * cc, ca * sb * sc - sa * cc, -sb, sa * cb, ca * cb];
}
// and as unit quaternions [x, y, z, w]
const quat = ([a, b, c, d, e, f, g, h, i]) => {
  const tr = a + e + i;
  if (tr > 0) { const s = 2 * Math.sqrt(tr + 1); return [(h - f) / s, (c - g) / s, (d - b) / s, s / 4]; }
  if (a > e && a > i) { const s = 2 * Math.sqrt(1 + a - e - i); return [s / 4, (b + d) / s, (c + g) / s, (h - f) / s]; }
  if (e > i) { const s = 2 * Math.sqrt(1 + e - a - i); return [(b + d) / s, s / 4, (f + h) / s, (c - g) / s]; }
  const s = 2 * Math.sqrt(1 + i - a - e); return [(c + g) / s, (f + h) / s, s / 4, (d - b) / s];
};
const turnOf = ([x, y, z, w]) => [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w),
  2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)];
const times = (p, q) => [p[3] * q[0] + p[0] * q[3] + p[1] * q[2] - p[2] * q[1], p[3] * q[1] - p[0] * q[2] + p[1] * q[3] + p[2] * q[0],
  p[3] * q[2] + p[0] * q[1] - p[1] * q[0] + p[2] * q[3], p[3] * q[3] - p[0] * q[0] - p[1] * q[1] - p[2] * q[2]];
const conj = ([x, y, z, w]) => [-x, -y, -z, w];
const unit4 = (q) => { const l = Math.hypot(...q) || 1; return q.map(v => v / l); };
const near4 = (p, q) => Math.abs(p[0] * q[0] + p[1] * q[1] + p[2] * q[2] + p[3] * q[3]);
const toward = (p, q, k) => { const s = p[0] * q[0] + p[1] * q[1] + p[2] * q[2] + p[3] * q[3] < 0 ? -1 : 1; return unit4(p.map((v, i) => v + (s * q[i] - v) * k)); };

const VS = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }`;
const FS = `#version 300 es
precision highp float;
uniform sampler2D uFilm;
uniform vec2 uRes, uC, uLight, uTrail[${TRAIL}];
uniform vec3 uN[12], uTx[12], uTy[12], uWall;   // the faces' normals; per face, the sphere's picture on it: canvas point to film texture
uniform vec4 uPic;   // the picture in the film's texture: u0, v0, du, dv
uniform vec4 uFrame;
uniform float uFlight, uAligned, uOutside;
// THE SINGULARITY: the hole (xy its centre, z its horizon, w its lens radius, canvas heights); its swirl (radians at the horizon), the pinch
// (canvas heights) and its photon ring's strength; the hits' shock rings (xy centre, z radius, w push); the rise (xy the point the flash is born
// from, z how far its circle has run, w 1 while it runs); the shake; the sparks (xy, strength, turn); the
// captured hole inside the glass (its radius in glass radii, how much); the dark halo behind the flying glass
uniform vec4 uSing, uShock[3], uReveal, uSpark[2];
uniform vec3 uSingFx;
uniform vec2 uShake, uCore;
uniform float uHalo;
// THE TWELVE: whether the faces fly on their own; per face, far to near, three vec4: its centre and its velocity (canvas heights, a second); its
// two axes on the canvas (its local x, and its local y toward a corner, a circumradius long); its normal and its glow
uniform float uFree;
uniform vec4 uFace[36];
uniform float uAspect, uHd, uFa, uR, uLit, uCosmos, uFlash, uShowLight, uVignette, uClear;
uniform float uLook, uLead, uMask, uPersp, uGlass, uGlow, uWake, uIris, uIrisSoft, uHair, uPx;
// the burst: how strong now, how far the plates stand apart, the bloom; its rays (direction on the canvas, how much each shows), how
// long and wide; its three shells' sizes and strength; its twelve cast planes, five corners each, two corners to a vec4, and how much each shows
uniform float uBurst, uSep, uBloom, uRayLen, uRayW, uShellA, uPlaneA, uPass;
uniform vec3 uRays[20], uShells;
uniform vec4 uPlanes[30];
uniform float uPlaneK[12];
out vec4 o;
const float H = ${H}, PANE = 0.8944;   // the inradius of a dodecahedron of circumradius one; how a face's edge distance shows across the next
const vec3 KEY = vec3(-0.4, 0.7, 0.6), SUN = vec3(-0.32, 0.7, 0.64);   // the theater's key light; the sphere's light (warm-sphere.js drawSkin)
// a regular pentagon of circumradius one, corner 0 up: its inradius, and its five edges' outward normals
const float INR = 0.80902;
const vec2 EDGE[5] = vec2[5](vec2(0.58779, 0.80902), vec2(0.95106, -0.30902), vec2(0.0, -1.0), vec2(-0.95106, -0.30902), vec2(-0.58779, 0.80902));
// the picture, whole in the canvas: a point of the canvas (in canvas heights, centred, y up) to the picture's 0..1, and how far past its edge
vec2 pic(vec2 p) { return vec2(p.x / (uHd * uFa), p.y / uHd) + 0.5; }
float past(vec2 q) { vec2 e = abs(q - 0.5) * 2.0; return smoothstep(0.996, 1.004, max(e.x, e.y)); }
vec3 film(vec2 p) {
  if(uFlight > .5) {
    vec2 q=(vec2(p.x/uAspect+.5,p.y+.5)-uFrame.xy)/uFrame.zw;
    return any(lessThan(q,vec2(0.))) || any(greaterThan(q,vec2(1.))) ? vec3(0.) : texture(uFilm,q).rgb;
  }
  vec2 q = pic(p); return mix(texture(uFilm, uPic.xy + clamp(q, 0.0, 1.0) * uPic.zw).rgb, uWall, past(q));
}
// THE SINGULARITY's hold on the picture: where a point of the canvas reads the film. The shocks push it out and back as they pass; the hole
// is a point lens (the source at r - rE^2 / r, so the sky folds round it into an Einstein ring), its picture swirled in more the nearer it is,
// and at the finisher the whole world is drawn in to the point (the pinch). The rise, the film's flash opening out of that point, is drawn in main.
vec2 bent(vec2 p) {
  for (int i = 0; i < 3; i++) {
    if (uShock[i].w <= 0.0) continue;
    vec2 d = p - uShock[i].xy; float r = length(d), x = (r - uShock[i].z) / (0.012 + 0.08 * uShock[i].z);
    p -= d / max(r, 1e-5) * uShock[i].w * x * exp(-x * x);
  }
  if (uSing.z > 0.0 || uSingFx.y > 0.0) {
    vec2 d = p - uSing.xy; float r = max(length(d), 1e-5), ang = uSingFx.x * uSing.z * uSing.z / (r * r), c = cos(ang), s = sin(ang);
    d = mat2(c, s, -s, c) * d * (1.0 - uSing.w * uSing.w / (r * r)) * (1.0 + uSingFx.y / r);
    p = uSing.xy + d;
  }
  return p;
}
// lays a colour of alpha k over what is there (straight alpha)
void over(inout vec3 col, inout float a, vec3 c, float k) { float n = k + a * (1.0 - k); col = n > 0.0 ? (c * k + col * a * (1.0 - k)) / n : c; a = n; }
// THE GLASS IS TRANSPARENT (glass-look.mjs, his Oct 17 20:4x): a flash on the glass is light over the film seen through it, the film brightened by k
// and a little warm light added, never a mix toward a colour of its own: its lines still show at the flash's peak
vec3 shine(vec3 seen, float k) { return seen * (1.0 + 1.3 * k) + vec3(1.0, 0.95, 0.84) * 0.28 * k; }
bool enter(vec3 ro, vec3 rd, out float tin, out int fin) {
  float tout = 1e9; tin = -1e9; fin = 0;
  for (int i = 0; i < 12; i++) {
    float dn = dot(uN[i], rd), on = dot(uN[i], ro);
    if (abs(dn) < 1e-7) { if (on > H) return false; continue; }
    float t = (H - on) / dn;
    if (dn < 0.0) { if (t > tin) { tin = t; fin = i; } } else tout = min(tout, t);
  }
  return tin < tout;
}
// the glass blown apart: each face its own plate, pushed out along its normal by uSep; the nearest plate the ray meets from the front
bool plates(vec3 ro, vec3 rd, out float tHit, out int fHit) {
  tHit = 1e9; fHit = -1;
  for (int i = 0; i < 12; i++) {
    float dn = dot(uN[i], rd);
    if (dn > -1e-6) continue;
    float t = (H + uSep - dot(uN[i], ro)) / dn;
    if (t <= 0.0 || t >= tHit) continue;
    vec3 x0 = ro + rd * t - uN[i] * uSep;   // where on its face it was
    float s2 = -1e9;
    for (int j = 0; j < 12; j++) if (j != i) s2 = max(s2, dot(uN[j], x0));
    if (s2 <= H) { tHit = t; fHit = i; }
  }
  return fHit >= 0;
}
// a shock shell: the dodecahedron s times the glass around it, seen parallel; how far a canvas point is from its nearest front and back
// edge (canvas heights), or -1 off it
vec2 shell(vec2 p, float s) {
  vec2 q = (p - uC) / (uR * s);
  if (dot(q, q) >= 1.0) return vec2(-1.0);
  vec3 ro = vec3(q, 2.0);
  float tin = -1e9, tout = 1e9; int fin = 0, fout = 0;
  for (int i = 0; i < 12; i++) {
    float dn = -uN[i].z, on = dot(uN[i], ro);
    if (abs(dn) < 1e-7) { if (on > H) return vec2(-1.0); continue; }
    float t = (H - on) / dn;
    if (dn < 0.0) { if (t > tin) { tin = t; fin = i; } } else if (t < tout) { tout = t; fout = i; }
  }
  if (tin >= tout) return vec2(-1.0);
  vec3 f = vec3(q, 2.0 - tin), b = vec3(q, 2.0 - tout);
  float sf = -1e9, sb = -1e9;
  for (int i = 0; i < 12; i++) { if (i != fin) sf = max(sf, dot(uN[i], f)); if (i != fout) sb = max(sb, dot(uN[i], b)); }
  return vec2(H - sf, H - sb) / PANE * uR * s;
}
vec2 corner(int i) { vec4 v = uPlanes[i >> 1]; return (i & 1) == 0 ? v.xy : v.zw; }
void main() {
  vec2 p = vec2((gl_FragCoord.x / uRes.x - 0.5) * uAspect, gl_FragCoord.y / uRes.y - 0.5);
  p = p * (1.0 - 1.6 * length(uShake)) + uShake;   // the hits' shake: the whole picture, a little nearer so no edge shows
  vec2 pf = uFlight > 0.5 ? bent(p) : p;            // where this point reads the film
  float dc = length(p - uC);
  // the wall: the film where it is open, from the glass outward (uIris; past every corner, all of it), else the wall or the page's paper
  float open = 1.0 - smoothstep(uIris - uIrisSoft, uIris, dc);
  vec3 col = mix(uWall, film(pf), open);
  float a = mix(1.0, (1.0 - past(pic(p))) * open, uClear);
  if(uFlight>.5){col=mix(uWall,film(pf),uOutside);a=1.;}
  // the hole: its horizon black, its photon ring gold with a crimson glow about it (the boss); the shocks' fronts; the sparks of the last hit
  if (uSing.z > 0.0) {
    float rs = length(p - uSing.xy), rh = uSing.z;
    float ring = exp(-pow((rs - rh * 1.1) / (rh * 0.1 + 1.5 * uPx), 2.0)), glow = exp(-pow((rs - rh * 1.1) / (rh * 0.8), 2.0));
    col = mix(col, vec3(0.0), 1.0 - smoothstep(rh * 0.93, rh * 1.01, rs));
    col += (vec3(1.0, 0.82, 0.45) * ring + vec3(0.6, 0.1, 0.06) * glow * 0.45) * uSingFx.z;
  }
  for (int i = 0; i < 3; i++) if (uShock[i].w > 0.0) {
    float x = (length(p - uShock[i].xy) - uShock[i].z) / (0.004 + 0.02 * uShock[i].z);
    col += vec3(1.0, 0.86, 0.55) * exp(-x * x) * min(1.0, uShock[i].w * 40.0) * 0.5;
  }
  for (int i = 0; i < 2; i++) if (uSpark[i].z > 0.0) {
    vec2 d = p - uSpark[i].xy; float r = length(d);
    if (r < 0.2) {
      float spoke = pow(abs(cos((atan(d.y, d.x) + uSpark[i].w) * 4.0)), 60.0) * (1.0 - smoothstep(0.0, 0.03 + 0.15 * uSpark[i].z, r));
      col += vec3(1.0, 0.9, 0.62) * (spoke + exp(-r * r / (0.0003 + 0.002 * uSpark[i].z))) * uSpark[i].z;
    }
  }
  // the rise: inside a circle running out from the point where the hole closed, the film's flash; outside it the dark; a hot front and a bloom
  if (uReveal.w > 0.0) {
    float rr = length(p - uReveal.xy), R = uReveal.z;
    col *= 1.0 - smoothstep(R - 0.035, R, rr);
    col += vec3(1.0, 0.86, 0.52) * exp(-pow((rr - R) / 0.012, 2.0)) * 0.9 + vec3(1.0, 0.95, 0.8) * exp(-rr * rr / (0.002 + 0.12 * R * R)) * exp(-R * 4.0);
  }
  // a dark halo behind the flying glass, so the bright film never swallows it
  if (uHalo > 0.0) col *= 1.0 - 0.42 * uHalo * (1.0 - smoothstep(uR * 0.95, uR * 1.4, dc));
  // its wake: bold at the glass, thin and gone behind it (only the Snitch has one)
  if (uWake > 0.0) {
    float wake = 0.0;
    for (int i = 0; i < ${TRAIL - 1}; i++) {
      vec2 s0 = uTrail[i], ba = uTrail[i + 1] - s0, pa = p - s0;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-9), 0.0, 1.0), k = (float(i) + h) / ${(TRAIL - 1).toFixed(1)};
      float w = uR * mix(0.34, 0.02, k);
      wake = max(wake, (1.0 - smoothstep(w * 0.35, w, length(pa - ba * h))) * (1.0 - k));
    }
    over(col, a, vec3(1.0, 0.84, 0.42), wake * 0.8 * uWake);
  }
  float spread = mix(2.0 + 2.5 * uCosmos, 1.25 + 0.8 * uCosmos, uMask) + 1.6 * uBloom;
  float glow = (uGlow * (0.08 + 0.3 * uLit + 0.75 * uCosmos + 0.6 * uFlash) + 1.2 * uBloom) * exp(-pow(dc / (uR * spread), 2.0));
  if (uClear > 0.5) over(col, a, vec3(1.0, 0.8, 0.4), clamp(glow, 0.0, 1.0)); else col += vec3(1.0, 0.74, 0.3) * glow;
  // THE BURST: every piece of it a window onto the film behind the page
  if (uBurst > 0.0) {
    vec3 shown = film(pf) * 1.12 + vec3(0.05, 0.04, 0.0);
    // rays out of the twenty corners, a hot line down each
    vec2 dir = (p - uC) / max(dc, 1e-6);
    float rays = 0.0, hot = 0.0;
    for (int i = 0; i < 20; i++) {
      float along = dot(dir, uRays[i].xy);
      if (along <= 0.0) continue;
      float across = length(dir - uRays[i].xy * along), len = uRayLen * uRays[i].z, w = uRayW * (0.55 + 0.45 * uRays[i].z);
      float reach = (1.0 - smoothstep(len * 0.6, len, dc)) * smoothstep(uR * 0.55, uR * 0.95, dc);
      rays = max(rays, (1.0 - smoothstep(w * 0.45, w, across)) * reach);
      hot = max(hot, (1.0 - smoothstep(0.0, w * 0.16, across)) * reach * (1.0 - dc / max(len, 1e-6)));
    }
    over(col, a, shown, rays * uBurst);
    over(col, a, vec3(1.0, 0.94, 0.74), clamp(hot, 0.0, 1.0) * uBurst);
    // three shock shells, the twelve's edges blown out wider and wider, their bodies a glimpse of the film
    for (int k = 0; k < 3; k++) {
      if (uShells[k] <= 0.0) continue;
      vec2 e = shell(p, uShells[k]);
      if (e.x < 0.0) continue;
      float ak = uShellA * (1.0 - 0.28 * float(k));
      over(col, a, shown, 0.22 * ak);
      float line = max(1.0 - smoothstep(uPx * 0.6, uPx * 2.2, e.x), 0.45 * (1.0 - smoothstep(uPx * 0.6, uPx * 2.2, e.y)));
      over(col, a, vec3(1.0, 0.9, 0.6), line * ak);
    }
    // its twelve faces cast out as planes, each a window with a gold rim
    for (int i = 0; i < 12; i++) {
      float pk = uPlaneA * uPlaneK[i];
      if (pk <= 0.0) continue;
      float inside = 1e9;
      for (int k = 0; k < 5; k++) {
        vec2 c0 = corner(i * 5 + k), e = corner(i * 5 + (k + 1) % 5) - c0;
        inside = min(inside, (e.x * (p.y - c0.y) - e.y * (p.x - c0.x)) / max(length(e), 1e-9));
      }
      if (inside <= 0.0) continue;
      over(col, a, shown, 0.9 * pk);
      over(col, a, vec3(0.88, 0.7, 0.34), pk * (1.0 - smoothstep(uPx, uPx * 3.5, inside)));
    }
  }
  // THE TWELVE: each face its own pane, far to near. Under it a dark halo (the bright film never swallows it) and behind it a gold streak
  // where it just was; the pane a window onto the film behind, panned by its tilt, gold glass with its key light's glint, the hold's one
  // window when they are home (uAligned), a hit's flash, its gold leading; the captured core seen through the glass they closed into.
  if (uFree > 0.5) {
    bool onGlass = false;
    for (int i = 0; i < 12; i++) {
      vec4 F0 = uFace[i * 3], F1 = uFace[i * 3 + 1], F2 = uFace[i * 3 + 2];
      vec2 d = p - F0.xy, ax = F1.xy, ay = F1.zw;
      float size = max(length(ax), length(ay));
      if (size <= 0.0) continue;
      col *= 1.0 - 0.3 * (1.0 - smoothstep(size * 0.8, size * 1.7, length(d)));
      vec2 tail = -F0.zw * 0.05; float tl = dot(tail, tail);
      if (tl > size * size * 0.09) {
        float h = clamp(dot(d, tail) / tl, 0.0, 1.0), w = size * 0.42 * (1.0 - h) + uPx;
        over(col, a, vec3(1.0, 0.84, 0.45), (1.0 - smoothstep(w * 0.35, w, length(d - tail * h))) * (1.0 - h) * 0.7);
      }
      float det = ax.x * ay.y - ax.y * ay.x;
      if (abs(det) < size * size * 0.03) continue;   // seen edge on
      vec2 l = vec2(d.x * ay.y - d.y * ay.x, ax.x * d.y - ax.y * d.x) / det;
      if (dot(l, l) > 1.2) continue;
      float e = -1e9;
      for (int k = 0; k < 5; k++) e = max(e, dot(l, EDGE[k]));
      float rim = INR - e, px = uPx * size / abs(det);   // from its edge in its own radii; a canvas pixel there
      if (rim < -px) continue;
      vec3 n = F2.xyz;
      float key = max(dot(reflect(vec3(0.0, 0.0, -1.0), n), normalize(KEY)), 0.0);
      vec3 pane = film(pf + n.xy * size * 0.35) * vec3(1.16, 0.98, 0.64) + vec3(0.06, 0.045, 0.0)
        + vec3(1.0, 0.95, 0.85) * (pow(key, 20.0) * 0.6 + pow(1.0 - abs(n.z), 3.0) * 0.22);
      pane = mix(pane, film(pf) * vec3(1.05, 1.0, 0.9) + vec3(0.035, 0.025, 0.0), uAligned);
      pane = shine(pane, clamp(F2.w * 0.7, 0.0, 1.0));
      vec3 leading = vec3(0.78, 0.6, 0.27) * (0.75 + 0.5 * pow(key, 8.0)) + vec3(1.0, 0.85, 0.5) * F2.w;
      pane = mix(pane, leading, 1.0 - smoothstep(0.075, 0.075 + 1.5 * px, rim));
      over(col, a, pane, smoothstep(-px, px, rim));
      onGlass = true;
    }
    if (onGlass && uCore.y > 0.0) {
      float rc = length(p - uC) / uR, ring = exp(-pow((rc - uCore.x * 1.12) / (0.07 + 1.5 * uPx / uR), 2.0));
      col = mix(col, vec3(0.0), (1.0 - smoothstep(uCore.x * 0.9, uCore.x, rc)) * uCore.y * 0.92);
      col += vec3(1.0, 0.8, 0.42) * ring * uCore.y * 0.8;
    }
  }
  // the glass, seen from an eye 1 / uPersp circumradii away (the sphere's four; in the theater a parallel view); in a burst, its plates
  vec2 q = (p - uC) / uR;
  vec3 ro = vec3(q * (1.0 - 2.0 * uPersp), 2.0), rd = vec3(q * uPersp, -1.0);
  float bound = 1.0 / (1.0 - uPersp * uPersp) + 0.01;
  float tin, tp; int fin, fp;
  bool solid = uGlass > 0.0 && dot(q, q) < bound && enter(ro, rd, tin, fin);
  bool plate = uSep > 0.0 ? uGlass > 0.0 && dot(q, q) < bound * (1.0 + uSep) * (1.0 + uSep) && plates(ro, rd, tp, fp) : solid;
  if (plate) {
    if (uSep > 0.0) { tin = tp; fin = fp; }
    vec3 n = uN[fin], at = ro + rd * tin, x0 = at - n * uSep;
    // A: the film's centre square laid on the face as the sphere lays it; C and B: a window onto the film behind, drawn nearer and panned by the tilt
    vec2 p0 = uSep > 0.0 ? uC + uR * x0.xy / (1.0 - x0.z * uPersp) : p;   // where this point of the plate sat on the sphere
    vec2 laid = vec2(dot(uTx[fin], vec3(p0, 1.0)), dot(uTy[fin], vec3(p0, 1.0)));
    vec2 qw = pic(uC + (p - uC) * mix(0.55, 0.86, uMask) - n.xy * uR * mix(0.85, 0.28, uMask));
    vec3 seen = mix(texture(uFilm, mix(laid, uPic.xy + clamp(qw, 0.0, 1.0) * uPic.zw, uLook)).rgb, uWall, past(qw) * uLook);
    float lit = clamp(0.31 + 0.69 * max(dot(n, SUN), 0.0), 0.0, 1.0), key = max(dot(reflect(normalize(rd), n), normalize(KEY)), 0.0);
    vec3 asSphere = mix(seen, vec3(0.184, 0.2, 0.157), (1.0 - lit) * 0.5);   // the sphere's shade, #2f3328 at (1 - lit) / 2
    vec3 asGlass = mix(seen, seen * vec3(1.18, 0.98, 0.62) + vec3(0.07, 0.05, 0.0), mix(0.5, 0.18, uMask))
      + vec3(1.0, 0.95, 0.85) * (pow(key, 24.0) * 0.7 + pow(1.0 - n.z, 3.0) * 0.22);
    vec3 face = shine(mix(asSphere, asGlass, uLook), clamp(uFlash * 0.7 + uBloom * 0.65, 0.0, 1.0));
    // THE CUTS' device at a burst's first frames (lab/CUTS.md): only by his word on the Nest (mint/glass pass 'cuts', glass-look.mjs passAt) and
    // only while the film moves through them; with no word the glass stays the glass
    if (uPass > 0.5) face = uPass > 1.5 ? vec3(0.83, 0.64, 0.29) : n * 0.5 + 0.5;
    // the edges: the sphere's hairline (0.65 css px, half on each face) thickening into the gold leading; a burst lights them
    float s2 = -1e9;
    for (int i = 0; i < 12; i++) if (i != fin) s2 = max(s2, dot(uN[i], x0));
    float d = (H - s2) / PANE, zs = 1.0 - at.z * uPersp, hair = 0.5 * uHair / uR * zs, px = uPx / uR * zs, kl = max(uLead, uBurst * 0.6);
    float lead = 1.0 - smoothstep(mix(hair - 0.5 * px, 0.035, kl), mix(hair + 0.5 * px, 0.065, kl), d);
    vec3 leading = mix(vec3(0.592, 0.443, 0.165), vec3(0.78, 0.6, 0.27) * (0.7 + 0.5 * pow(key, 8.0)), uLead) + vec3(1.0, 0.85, 0.5) * uBurst * 0.8;
    vec3 pane=mix(face,leading,lead*mix(.74,1.,kl));
    // One spatially registered image: the flying mask restores its original
    // opacity, instead of stamping another copy onto each face.
    pane=mix(pane,mix(film(pf)*vec3(1.05,1.0,0.9)+vec3(0.035,0.025,0.0),leading,lead*.85),uAligned);
    // the captured hole, its core seen through the faces: black, ringed in gold
    if (uCore.y > 0.0) {
      float rc = length(p - uC) / uR, ring = exp(-pow((rc - uCore.x * 1.12) / (0.07 + 1.5 * uPx / uR), 2.0));
      pane = mix(pane, vec3(0.0), (1.0 - smoothstep(uCore.x * 0.9, uCore.x, rc)) * uCore.y * 0.92);
      pane += vec3(1.0, 0.8, 0.42) * ring * uCore.y * 0.8;
    }
    over(col, a, pane, uGlass);
  } else if (solid) {
    // between the plates: the light inside, the film through it
    vec3 inner = shine(film(pf) * 1.35 + 0.08, 0.35 + 0.5 * exp(-dot(q, q) * 1.6));
    over(col, a, inner, uGlass);
  }
  // the light the decoder read in this frame, when asked
  float ring = abs(length(p - uLight) - 0.03);
  over(col, a, vec3(1.0), uShowLight * (1.0 - smoothstep(0.0012, 0.0028, ring)));
  vec2 v = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - uVignette * smoothstep(0.25, 0.75, dot(v, v) * 2.2);
  o = vec4(col * a, a);
}`;

export async function createTheater({canvas, film, wall = [0.043, 0.039, 0.035], clear = false, vignette = 0.22, fit = 1, m = 2, road = null, active = true, onDraw = null, look = CLEAR} = {}) {
  const view = canvas.ownerDocument.defaultView;
  const track = await fetch(new URL('./theater-light.json', import.meta.url)).then(r => r.json());
  const CROP = track.crop, FA = CROP[2] / CROP[3], flight = fly(track, FA);
  // where the glass is at second t: the flight between its two frames
  const at = (t) => {
    const n = track.frames, f = clamp(t * track.fps, 0, n - 1.001), i = Math.floor(f), k = f - i, j = Math.min(n - 1, i + 1);
    const g = (o) => mix(flight[i * 4 + o], flight[j * 4 + o], k);
    return {x: g(0), y: g(1), spin: g(2), lit: g(3), light: [track.x[i] / 1000 * FA, track.y[i] / 1000]};
  };
  // the sphere's picture on a face: the file's centre square (warm-sphere.js drawPortrait), in the texture (its rows flipped)
  const [fw, fh] = track.size, side = Math.min(fw, fh);
  const SQ = {x: (fw - side) / 2 / fw, w: side / fw, top: 1 - (fh - side) / 2 / fh, h: side / fh};
  // with no road, the sphere stands where the page puts it: 55 % across, a fifth of the shorter side, turning slowly
  const rest = (t, aspect) => ({c: [0.05 * aspect, 0], r: 0.2 * Math.min(1, aspect), yaw: -0.32 + 0.12 * t, pitch: -0.12});

  const gl = canvas.getContext('webgl2', {antialias: false, alpha: clear, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'high-performance'});
  const shader = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog); gl.bindVertexArray(gl.createVertexArray());
  const U = {};
  for (const name of ['uFilm', 'uRes', 'uC', 'uLight', 'uTrail', 'uN', 'uTx', 'uTy', 'uWall', 'uPic', 'uAspect', 'uHd', 'uFa', 'uR', 'uLit', 'uCosmos',
    'uFlash', 'uShowLight', 'uVignette', 'uClear', 'uLook', 'uLead', 'uMask', 'uPersp', 'uGlass', 'uGlow', 'uWake', 'uIris', 'uIrisSoft', 'uHair', 'uPx',
    'uBurst', 'uSep', 'uBloom', 'uRayLen', 'uRayW', 'uShellA', 'uPlaneA', 'uRays', 'uShells', 'uPlanes', 'uPlaneK', 'uPass',
    'uFrame','uFlight','uAligned','uOutside','uSing','uSingFx','uShock','uReveal','uShake','uSpark','uCore','uHalo','uFree','uFace'])
    U[name] = gl.getUniformLocation(prog, name);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  // until the film has a frame its picture is the wall, so nothing shows that the film did not
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([...wall.map(c => Math.round(c * 255)), 255]));
  gl.uniform1i(U.uFilm, 0);
  // Every copy states the texture whole (texImage2D, never a sub-image): a film can say it holds data before it has a frame to give (the
  // hero's, hidden and paused at its first second, did), and a sub-image copy into what that first copy left fails on every frame after.
  const upload = () => {
    if (film.readyState < 2 || !film.videoWidth) return;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, film);
    gl.generateMipmap(gl.TEXTURE_2D);
  };

  // the GPU's own time for a draw, read back a few frames later
  const timer = gl.getExtension('EXT_disjoint_timer_query_webgl2');
  const queries = []; let gpuUs = null;
  const readTimes = () => {
    while (queries.length && gl.getQueryParameter(queries[0], gl.QUERY_RESULT_AVAILABLE)) {
      const q = queries.shift();
      if (!gl.getParameter(timer.GPU_DISJOINT_EXT)) gpuUs = gl.getQueryParameter(q, gl.QUERY_RESULT) / 1000;
      gl.deleteQuery(q);
    }
  };

  // each draw's faces: their normals, and the sphere's picture on each (canvas point to texture, two rows of three)
  const normals = new Float32Array(36), laidX = new Float32Array(36), laidY = new Float32Array(36);
  const rays = new Float32Array(60), planes = new Float32Array(120), seenK = new Float32Array(12);
  const turnBy = (R, [x, y, z]) => [R[0] * x + R[1] * y + R[2] * z, R[3] * x + R[4] * y + R[5] * z, R[6] * x + R[7] * y + R[8] * z];
  const lay = (R, c, r, persp) => {
    const seen = ([x, y, z]) => { const k = r / (1 - z * persp); return [c[0] + x * k, c[1] + y * k]; };
    FACES.forEach((n, i) => {
      normals.set(turnBy(R, n), i * 3);
      // warm-sphere.js decal(): the picture's square spans the face's centre plus or minus its two axes, the screen's affine fit at the centre
      const centre = n.map(v => v * H), o = seen(turnBy(R, centre));
      const ax = seen(turnBy(R, centre.map((v, j) => v + ACROSS[i][j] * RHO))), ay = seen(turnBy(R, centre.map((v, j) => v - UP[i][j] * RHO)));
      const xx = ax[0] - o[0], xy = ax[1] - o[1], yx = ay[0] - o[0], yy = ay[1] - o[1], det = xx * yy - yx * xy;
      if (Math.abs(det) < 1e-12) { laidX.fill(0, i * 3, i * 3 + 3); laidY.fill(0, i * 3, i * 3 + 3); return; }
      const a1 = SQ.w / 2 * yy / det, a2 = -SQ.w / 2 * yx / det, b1 = SQ.h / 2 * xy / det, b2 = -SQ.h / 2 * xx / det;
      laidX.set([a1, a2, SQ.x + SQ.w / 2 - a1 * o[0] - a2 * o[1]], i * 3);
      laidY.set([b1, b2, SQ.top - SQ.h / 2 - b1 * o[0] - b2 * o[1]], i * 3);
    });
  };
  // the burst's rays (out of the corners, as the glass is turned) and cast planes (the faces flown out `go` circumradii, grown `grow` times,
  // each turned about its own normal by `spin`, half one way and half the other)
  const burstOut = (R, c, r, persp, go, grow, spin) => {
    CORNERS.forEach((v, i) => { const [x, y] = turnBy(R, v), l = Math.hypot(x, y) || 1; rays.set([x / l, y / l, Math.min(1, l)], i * 3); });
    RINGS.forEach((ring, i) => {
      const n = FACES[i], turn = spin * (i % 2 ? 1 : -1) * (0.7 + 0.6 * hash(i + 7)), cs = Math.cos(turn), sn = Math.sin(turn);
      const pts = ring.map(v => {
        const d = v.map((x, j) => x - n[j] * H), e = cross3(n, d);   // the corner from the face's centre, and it a quarter turn on
        return turnBy(R, n.map((x, j) => x * (H + go) + (d[j] * cs + e[j] * sn) * grow));
      });
      // a plane coming at the eye fades before it gets there, and one past it is not drawn
      seenK[i] = ss(0.3, 0.55, Math.min(...pts.map(([, , z]) => 1 - z * persp)));
      if (!seenK[i]) { planes.fill(c[0], i * 10, i * 10 + 10); return; }
      let flat = pts.map(([x, y, z]) => { const k = r / (1 - z * persp); return [c[0] + x * k, c[1] + y * k]; });
      const area = flat.reduce((s, [x0, y0], k) => { const [x1, y1] = flat[(k + 1) % 5]; return s + x0 * y1 - x1 * y0; }, 0);
      if (area < 0) flat = flat.reverse();   // counter-clockwise, as the shader asks
      planes.set(flat.flat(), i * 10);
    });
  };

  let showLight = 0, draws = 0, asked = false, held = clamp(Number(m) || 0, 0, 2), bursting = false;
  let turned = null, phase = 0, tWas = null, clockWas = 0, flightOrigin = null, lastGlass = null;
  let presented = null, frame = 1 / 30;   // the last presented frame's mediaTime while the film plays (none held, seeking or asleep), and the film's frame
  const trail = new Float32Array(TRAIL * 2), shockBuf = new Float32Array(12), sparkBuf = new Float32Array(8), faceBuf = new Float32Array(144);
  // shown: the second of the frame this draw shows (a presented frame's mediaTime, the frame upload() has just taken). The clock reads off it either
  // way (17 ms short to 25 ms ahead, the wall lane's measure; his 22:5x WEST over the twelve against the anime: "you are still moving in lead vs in
  // time... fucking watch the thing frame by frame"), so everything the film's second places is placed at the shown frame's second. A draw between
  // frames (the burst's flow) reads the clock but stays inside the frame on show, never behind it nor into the next (at the cut to the burst a draw at
  // the clock put the glass back on the star a frame after it had gone); a held film's draw reads the clock, which is then its frame
  const draw = (shown) => {
    const w = canvas.width, h = canvas.height;
    if (!active || !w || !h) return;
    const aspect = w / h, hd = Math.min(1, aspect / FA) * fit, playhead = film.currentTime || 0;
    const t = Number.isFinite(shown) ? shown : presented === null || film.paused ? playhead : Math.min(Math.max(playhead, presented + 1e-3), presented + frame - 1e-3);
    const now = at(t), way = road ? road(t) : null;
    const mm = clamp(Number.isFinite(way?.m) ? way.m : held, 0, 2), A = way?.a ?? rest(t, aspect);
    // THE TWELVE take the glass as the final burst left it a frame before (its place, size, turn, eye and how far its plates stood apart)
    if(!way?.flight)flightOrigin=null;
    else if(!flightOrigin)flightOrigin=lastGlass&&Math.abs(t-lastGlass.t)<.5?{...lastGlass}:{c:[...A.c],r:A.r,q:turned?[...turned]:quat(sphereTurn(A.yaw,A.pitch)),persp:0,sep:SEP_FINAL};
    const fly=way?.flight?.law==='seiya'?seiyaFlight:skyFlight;   // the road's law: THE TWELVE ON SEIYA (hero-mount.js SEIYA_TWELVE), else THE TWELVE
    const flight=way?.flight?fly(t,w,h,flightOrigin,typeof way.flight==='object'?way.flight:undefined):null;   // the road's anchor for THE TWELVE (hero-mount.js TWELVE)
    const ka = Math.min(mm, 1), kb = Math.max(0, mm - 1);
    const cosmos = t < M.cosmos || t >= M.impact + 2 ? 0 : t < M.flash ? ss(M.cosmos, M.flash, t) : t < M.impact ? 1 : 1 - ss(M.impact, M.impact + 2, t);
    const flash = ss(M.flashOn, M.flashPeak, t) * (1 - ss(M.flashPeak, M.flash + 0.1, t));
    const rMask = (0.27 + 0.03 * now.lit + 0.06 * cosmos + 0.03 * flash) * hd, rSnitch = (0.034 + 0.012 * now.lit + 0.075 * cosmos + 0.02 * flash) * hd;
    // picture heights (x from the left, y from the top) to the canvas (centred, y up), drawn `reach` of the way from the picture's middle;
    // the glass never leaves the canvas
    const place = (x, y, reach, r) => {
      const mx = aspect / 2 - r * 1.4, my = 0.5 - r * 1.4;
      x = FA / 2 + reach * (x - FA / 2); y = 0.5 + reach * (y - 0.5);
      return [clamp((x / FA - 0.5) * hd * FA, -mx, mx), clamp((0.5 - y) * hd, -my, my)];
    };
    // where the glass is and how large: the film's second and m
    let r, c, reach;
    if (mm <= 1) {
      const k = ss(0.1, 0.85, ka), [x, y] = place(now.x, now.y, REACH, rMask);
      r = mix(A.r, rMask, k); c = [mix(A.c[0], x, k), mix(A.c[1], y, k)]; reach = REACH;
    } else {
      const k = ss(0, 0.8, kb), buzz = 0.0035 * hd * kb;   // the snitch's hum while it hovers
      r = mix(rMask, rSnitch, k); reach = mix(REACH, 1, k); c = place(now.x, now.y, reach, r);
      c[0] += buzz * Math.sin(t * 58.4); c[1] += buzz * Math.cos(t * 44.6);
    }
    if(flight){r=flight.r;c=flight.c;reach=1;}
    // how it is turned: with no road, a pure function of the film's second (the tumble at m's rate); on a road, from the sphere's pose,
    // tumbling as fast as m asks and drawn home to the sphere below m 0.6
    const rate = mm <= 1 ? 0.35 * ss(0.08, 0.9, ka) : mix(0.35, 1, ss(0, 1, kb));
    const home = quat(sphereTurn(A.yaw, A.pitch)), clock = view.performance.now(), step = tWas === null ? 0 : t - tWas;
    const pull = road && !flight ? 1 - ss(0, 0.6, mm) : 0, dt = film.paused ? Math.min(0.1, (clock - clockWas) / 1000) : clamp(step, 0, 0.1);
    if(flight) turned=flight.q??flightOrigin.q;
    else if (!road) turned = quat(tumble(now.spin * rate));
    else if (!turned || mm <= 0) turned = home;
    else if (step > 0 && step <= 0.1) {
      const next = phase + rate * (now.spin - at(tWas).spin);
      turned = unit4(times(times(quat(tumble(next)), conj(quat(tumble(phase)))), turned)); phase = next;
    }
    if (pull > 0) turned = toward(turned, home, 1 - Math.exp(-HOME * pull * dt));
    tWas = t; clockWas = clock;
    const R = turnOf(turned), persp = mm <= 1 ? 0.25 * (1 - ss(0.1, 0.8, ka)) : 0;
    lay(R, c, r, persp);
    // the burst: its strength, how far apart the plates stand, the flash, the glass held over the sphere while it lasts. Each piece goes
    // at once and slows (rise), most with a drift on top that keeps it moving until it has faded
    const age = Number.isFinite(way?.burst?.age) ? way.burst.age : -1, power = way?.burst?.power ?? 1, live = age >= 0 && age < BURST;
    const final = way?.burst?.final === true;   // THE TWELVE's burst: its plates never close again
    const rise = (tau) => 1 - Math.exp(-Math.max(0, age) / tau);
    const energy = live ? power * ss(0, 0.05, age) * (1 - ss(BURST - 1.8, BURST, age)) : 0;
    const sep = live ? power * (0.34 * rise(0.28) + 0.04 * age) * (final ? 1 : 1 - ss(BURST - 2.6, BURST - 0.6, age)) : 0;
    const bloom = live ? power * ss(0, 0.04, age) * (1 - ss(0.04, 1.0, age)) : 0;
    const held4 = live ? ss(0, 0.02, age) * (final ? 1 : 1 - ss(BURST - 0.25, BURST, age)) : 0;
    if (!flight) lastGlass = {t, c: [...c], r, q: [...turned], persp, sep: final && live ? sep : 0};
    if (live) burstOut(R, c, r, persp, 3.2 * rise(1.1) + 0.22 * age, 1 + 1.4 * rise(1.3), 0.9 * rise(1.5) + 0.12 * age);
    bursting = live || Boolean(flight);
    if (!flight) {   // THE TWELVE draw their own streaks (uFace): no wake while they fly
      for (let i = 0; i < TRAIL; i++) { const back = at(Math.max(0, t - i / 30)), [x, y] = place(back.x, back.y, reach, r); trail[i * 2] = x; trail[i * 2 + 1] = y; }
      trail[0] = c[0]; trail[1] = c[1];
    }
    // THE TWELVE, far to near, three vec4 a face (zeros when nothing flies: the shader then never asks)
    faceBuf.fill(0);
    if (flight) flight.faces.map((f, i) => i).sort((i, j) => flight.faces[i].z - flight.faces[j].z).forEach((i, k) => {
      const f = flight.faces[i];
      faceBuf.set([f.c[0], f.c[1], f.vel[0], f.vel[1], f.ax[0], f.ax[1], f.ay[0], f.ay[1], f.n[0], f.n[1], f.n[2], f.glow], k * 12);
    });
    const closed = flight && (flight.phase === 'finisher' || flight.phase === 'return');   // the twelve one glass again
    // the film opens around the glass from C to B: from under its edge out past the canvas's farthest corner
    const soft = mix(0.02, 0.3, kb) * hd;
    const far = Math.max(...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => Math.hypot(sx * aspect / 2 - c[0], sy * 0.5 - c[1])));
    const iris = kb > 0 ? mix(r * 0.9, far + soft, ss(0.05, 0.9, kb)) : 0;
    const t0 = view.performance.now(), q = timer ? gl.createQuery() : null;
    if (timer) { readTimes(); gl.beginQuery(timer.TIME_ELAPSED_EXT, q); }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h); gl.uniform1f(U.uAspect, aspect); gl.uniform1f(U.uHd, hd); gl.uniform1f(U.uFa, FA);
    gl.uniform4f(U.uPic, CROP[0] / fw, 1 - (CROP[1] + CROP[3]) / fh, CROP[2] / fw, CROP[3] / fh);
    gl.uniform3f(U.uWall, wall[0], wall[1], wall[2]); gl.uniform1f(U.uVignette, vignette); gl.uniform1f(U.uClear, clear ? 1 : 0);
    const rect=flight?.picture;
    gl.uniform1f(U.uFlight,flight?1:0);gl.uniform1f(U.uAligned,flight?.aligned??0);gl.uniform1f(U.uOutside,flight?.outside??1);
    gl.uniform4f(U.uFrame,rect?rect.left/w:0,rect?1-(rect.top+rect.height)/h:0,rect?rect.width/w:1,rect?rect.height/h:1);
    // THE SINGULARITY (zeros when nothing flies: bent() is then never asked, and every term below is off)
    const S=flight?.sing, sp=flight?.sparks, rv=flight?.reveal, core=flight?.core;
    shockBuf.fill(0); (flight?.shocks??[]).slice(0,3).forEach((k,i)=>shockBuf.set([k.c[0],k.c[1],k.r,k.a],i*4));
    gl.uniform4f(U.uSing,S?S.c[0]:0,S?S.c[1]:0,S?S.rh:0,S?S.lens:0); gl.uniform3f(U.uSingFx,S?S.swirl:0,S?S.pinch:0,S?S.ring:0);
    gl.uniform4fv(U.uShock,shockBuf); gl.uniform4f(U.uReveal,rv?rv.s[0]:0,rv?rv.s[1]:0,rv?rv.r:0,rv?1:0);
    sparkBuf.fill(0); (sp??[]).slice(0,2).forEach((k,i)=>sparkBuf.set([k.c[0],k.c[1],k.a,k.rot],i*4));
    gl.uniform2f(U.uShake,flight?flight.shake[0]:0,flight?flight.shake[1]:0); gl.uniform4fv(U.uSpark,sparkBuf);
    gl.uniform2f(U.uCore,core?core.r:0,core?core.a:0); gl.uniform1f(U.uHalo,0);
    gl.uniform1f(U.uFree,flight?1:0); gl.uniform4fv(U.uFace,faceBuf);
    gl.uniform2f(U.uC, c[0], c[1]); gl.uniform1f(U.uR, r); gl.uniform2fv(U.uTrail, trail);
    gl.uniform3fv(U.uN, normals); gl.uniform3fv(U.uTx, laidX); gl.uniform3fv(U.uTy, laidY);
    gl.uniform1f(U.uLook, mm <= 1 ? ss(0.12, 0.92, ka) : 1); gl.uniform1f(U.uLead, flight ? 1 : mm <= 1 ? ss(0.25, 0.85, ka) : 1);
    gl.uniform1f(U.uMask, mm <= 1 ? 1 : 1 - ss(0, 1, kb)); gl.uniform1f(U.uPersp, persp);
    gl.uniform1f(U.uGlass, way?.glass === false || flight ? 0 : way?.keepGlass?1:Math.max(ss(0, 0.05, ka), held4)); gl.uniform1f(U.uGlow, flight ? (closed ? 1 : 0) : mm <= 1 ? ss(0.2, 0.9, ka) : 1); gl.uniform1f(U.uWake, flight ? 0 : ss(0.55, 1, kb));
    gl.uniform1f(U.uIris, iris); gl.uniform1f(U.uIrisSoft, soft);
    gl.uniform1f(U.uHair, 0.65 / Math.max(1, canvas.clientHeight)); gl.uniform1f(U.uPx, 1 / h);
    gl.uniform1f(U.uBurst, energy); gl.uniform1f(U.uSep, sep); gl.uniform1f(U.uBloom, flight ? (closed ? flight.bloom : 0) : bloom);
    const pass = live && way?.glass !== false ? passAt(age, {look, moving: !film.paused}) : 0;
    gl.uniform1f(U.uPass, pass);
    gl.uniform1f(U.uRayLen, r * (1.1 + 16 * rise(0.55))); gl.uniform1f(U.uRayW, 0.05 * (1 + 0.5 * rise(1.6)));
    gl.uniform1f(U.uShellA, energy * (1 - ss(1.2, BURST - 0.4, age))); gl.uniform1f(U.uPlaneA, energy * (1 - ss(1.8, BURST - 0.3, age)));
    // the three shells, a beat apart, each out at once and then slower and slower, never still
    gl.uniform3f(U.uShells, ...[0, 1, 2].map(k => {
      const s = age - 0.15 * k;
      return live && s > 0 ? 1 + (0.9 + 1.2 * k) * (1 - Math.exp(-s / (0.9 + 0.35 * k))) + (0.12 + 0.06 * k) * s : 0;
    }));
    gl.uniform3fv(U.uRays, rays); gl.uniform4fv(U.uPlanes, planes); gl.uniform1fv(U.uPlaneK, seenK);
    const [lx, ly] = place(now.light[0], now.light[1], reach, r); gl.uniform2f(U.uLight, lx, ly); gl.uniform1f(U.uShowLight, showLight);
    gl.uniform1f(U.uLit, now.lit); gl.uniform1f(U.uCosmos, cosmos); gl.uniform1f(U.uFlash, flash);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (timer) { gl.endQuery(timer.TIME_ELAPSED_EXT); queries.push(q); }
    draws++;
    onDraw?.({t, m: mm, burst: energy, pass, look: look.pass, lit: now.lit, w, h, draws,flight:flight?{target:flight.target,shrink:flight.shrink,outside:flight.outside,phase:flight.phase,wake:flight.wake,hits:flight.hits,
        anchor:flight.anchor,light:[.5+flight.light[0]*h/w,.5+flight.light[1]],
        hole:flight.sing?flight.sing.rh:0,core:flight.core.a,c:[...flight.c],r:flight.r,
        // THE TWELVE as drawn, in the pose's terms (x across the canvas, y up it, s a face's circumradius in canvas heights), and the centre
        center:[.5+flight.center[0]*h/w,.5+flight.center[1]],faces:flight.faces.map(f=>[.5+f.c[0]*h/w,.5+f.c[1],f.s])}:null,
      pose: {x: .5+c[0]*h/w, y: .5+c[1], radiusHeight: r*4/Math.sqrt(15), yaw: A.yaw, pitch: A.pitch,quaternion:[...turned],background:[...wall]},
      cpuMs: view.performance.now() - t0, gpuUs, paused: film.paused});
    // the film at rest and the glass still turning home: one frame more, until it is there
    if (film.paused && pull > 0 && near4(turned, home) < 0.99999) ask();
    keepFlowing();
  };
  const ask = () => { if (!asked && active) { asked = true; view.requestAnimationFrame(() => { asked = false; draw(); }); } };

  // The drawing buffer's size: the canvas's box, or, while it is hidden (display: none: the hero keeps it so until a burst or its view wakes
  // it), the box of what it stands in, which it fills. So the buffer is made in an idle moment after the page's load, never in the frame that
  // shows it: made there, at the first burst, it was 177 ms of one ResizeObserver callback on the new Mac (mint-fork's storyboard.proof.mjs,
  // main 6459d399, Chrome 156, Oct 14 2026 16:36 WEST).
  const size = () => {
    const dpr = Math.min(view.devicePixelRatio || 1, 2), box = canvas.clientWidth || canvas.clientHeight ? canvas : canvas.parentElement;
    let w = Math.round((box?.clientWidth ?? 0) * dpr), h = Math.round((box?.clientHeight ?? 0) * dpr);
    const cap = 2.4e6; if (w * h > cap) { const s = Math.sqrt(cap / (w * h)); w = Math.round(w * s); h = Math.round(h * s); }
    if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; }
    ask();
  };
  const resize = new view.ResizeObserver(size);
  resize.observe(canvas);

  // The film's frames are the clock of the picture: one draw per frame it presents, none while it rests. While a burst is live, the
  // screen's frames between them too (flow): one every 12 ms at most, the film's last frame behind, none where a draw takes the GPU over 8 ms.
  let callback = 0, flowing = 0, drawnAt = -1;
  const hasCallback = typeof film.requestVideoFrameCallback === 'function';
  // the presented frame's second: its mediaTime is the frame's start to the microsecond (a hair under it, or over), so a millisecond into the frame, where
  // a cue on the frame's own start (the anime's cut, a wall) finds the frame on its side of it; `frame` the least step seen between two presented frames
  const onFrame = (now, meta) => {
    callback = 0; upload();
    const m = meta?.mediaTime;
    if (Number.isFinite(m)) { const step = presented === null ? 0 : m - presented; if (step > 2e-3 && step < frame) frame = step; presented = m; }
    draw(Number.isFinite(m) ? m + 1e-3 : undefined); drawnAt = now;
    if (active && !film.paused) callback = film.requestVideoFrameCallback(onFrame);
  };
  function keepFlowing() { if (bursting && !flowing && active && hasCallback && !film.paused) flowing = view.requestAnimationFrame(flow); }
  function flow(now) {
    flowing = 0;
    if (now - drawnAt >= 12 && !(gpuUs > 8000) && active && !film.paused) { draw(); drawnAt = now; }
    keepFlowing();
  }
  const loop = () => { if (!active || film.paused) return; upload(); draw(); view.requestAnimationFrame(loop); };
  const start = () => { if (!active || film.paused) return; if (hasCallback) { if (!callback) callback = film.requestVideoFrameCallback(onFrame); } else view.requestAnimationFrame(loop); };
  const stop = () => {
    if (callback) { film.cancelVideoFrameCallback(callback); callback = 0; }
    if (flowing) { view.cancelAnimationFrame(flowing); flowing = 0; }
  };
  const onPause = () => { presented = null; stop(); ask(); }, onData = () => { if (active) upload(); ask(); }, onSeeking = () => { presented = null; };
  film.addEventListener('play', start); film.addEventListener('pause', onPause); film.addEventListener('seeking', onSeeking);
  film.addEventListener('loadeddata', onData); film.addEventListener('seeked', onData);
  active = Boolean(active);
  if (active) { upload(); start(); }
  // sized now when it shows, else in an idle moment; then its stage is watched too, so it keeps its size while hidden (an observer reports a
  // box as soon as it watches it: watching the stage at once would make the buffer in the page's loading frames)
  const keep = () => { size(); if (canvas.parentElement) resize.observe(canvas.parentElement); };
  if (canvas.clientWidth) keep();
  else if (view.requestIdleCallback) view.requestIdleCallback(keep, {timeout: 2000});
  else view.setTimeout(keep, 200);

  return {
    at, track, ask, burst: BURST,
    setShowLight(value) { showLight = value ? 1 : 0; ask(); },
    // the glass's look (glass-look.mjs: the page's one read of mint/glass at its load); a held film is drawn once again under it, a playing one at its next frame
    get look() { return look; },
    setLook(next) { look = next && typeof next === 'object' ? next : CLEAR; ask(); },
    // an inactive theater holds no frame callback, draws nothing and leaves its canvas empty; it takes the sphere's pose again when it wakes
    setActive(value) {
      value = Boolean(value);
      if (value === active) return;
      active = value;
      if (active) { turned = null; tWas = null; flightOrigin=null; lastGlass=null; upload(); start(); ask(); }
      else { stop(); presented = null; gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); }
    },
    destroy() {
      active = false; stop(); resize.disconnect();
      film.removeEventListener('play', start); film.removeEventListener('pause', onPause); film.removeEventListener('seeking', onSeeking);
      film.removeEventListener('loadeddata', onData); film.removeEventListener('seeked', onData);
    },
  };
}
