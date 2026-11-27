// unboxing.js: THE UNBOXING, the optimism.fit mint hero's box opened, for hero-ab.html (a lab page, outside the build, worn on no glass).
// His words, Oct 14 2026 WEST, in the session that asked for it: at his paywall tag ("FUCKING EPIC MOMENT WHERE AIOLOS STARTS APPEARING!!!
// THIS IS WHERE WE WANT TO STOP THE VIDEO AND PUT THE PAYWALL ON THE GOLDEN ARMOR DUDE", the Nest's mint/seiya-tags, 37.132 s at rev 1) the
// page's dodecahedron opens like a box and a lotus and the gold cloth of Sagittarius stands inside it, "i want to keep white background and
// only the dodecahedron faces can carry video signal"; at his conversion tag (61.767 s) "then ofc i want to see saint seya as 3D model going
// up there"; and "it is critical the ux is delightful".
//
// THE MOMENTS (unboxing-plan.mjs beat(), a pure function of the film's second), set by his words of 15:0x WEST over the first cut ("you are
// demented... this is all wrongly timed... the beginning of the box opening up is not there... the box should open up the first time that the
// golden dagysttraisu appears in the sky", his pick 42.34 s: the cut to Athena's mountain with the gold star already in the stormy sky; then
// "the gold centaurus and the moment whrn saint seya gets the armor onto itself is where you close the thing dude... omg", his pick: Seiya
// rises out of the closing box and the wings spread over it). At the gold star the box takes the page's sphere's place, pose, look and edges,
// so nothing shows the hand-over (warm-sphere.js: the eye four circumradii away, the centre 55 % across and halfway down, the radius
// renderedRadius of the shorter side, the film's centre square laid flat on each face by decal(), the light (-.32, .7, .64), lit = .31 + .69
// max(0, n.L), shade toward #2f3328 at (1 - lit) / 2, hairlines rgba(151,113,42,.74) .65 css px). Its seams light up first; it turns its
// floor down and leans to the eye, flashes with the film's rays (43.5 s), its lid breaks away and goes up and back, leaning its face of film
// to the eye like a halo, its five lower petals bloom one after the other, the hairlines thicken into gold leading, and every petal keeps the
// film on it, laid on its own face in 3D and read the right way round from behind. On its floor stands the cloth (a GLB the lab lists when
// one is there, else a stand-in of polished gold), turning slowly, while the film shows the gold sun and the centaur in flames. From 60 s a
// column of gold light rises in it (the film's own); at his conversion tag (61.767 s) Seiya rises up through the floor as a figure of light,
// the cloth lifts into the column turning faster, bursts at 63.5 s (the film's) and its pieces fly onto him from the legs up, as in the film;
// as they do he rises up out of the box, the petals fold, the lid comes back down under his feet, and the box is shut when the armor is on
// (69.7 s); the wings spread over it at 70.0 s (the film's); he goes up into the light and is gone to a star, and the shut box turns back into
// the page's sphere and fades over the page's own skin, handed back at 72.3 s. Should his conversion tag fall outside the open box, it closes
// under the end card instead (147.5 s), handed back before the loop.
//
// THE CANVAS: one WebGL2 canvas in the hero's stage, over the theater's, transparent, pointer-events none, sized to the box and what
// rises from it (not the whole stage) at the page's own pixel ratio. It draws on cause: on the film's frames (requestVideoFrameCallback)
// while the film plays and the box is out, on the screen's frames only while something moves fast (beat().flow: the opening, the rise, the
// way back; one every 12 ms at most, none while a draw takes the GPU over 8 ms), once on a seek, a resize, a model loaded, a drag of a paused
// sphere. Paused, nothing. While A is shown it holds no callback and its canvas is cleared and hidden.
//
// THE HAND-OVER: the box takes over and hands back inside the page's own frame. orbit-kick.js hush() asks skin() as the page begins to draw
// its dodecahedron; skin() draws the box there and then, in the same task (so no frame shows both or neither), and answers whether the
// page's own skin is hushed; what the page draws in front of its sphere goes to the front canvas over this one. The page itself is never
// changed. The models' pieces, the sparks and the light are this file's; the faces' film is the page's own <video>, copied once a frame.
import {SPHERE_X} from '../app/sphere-centre.mjs';
import * as THREE from 'three';
import {GLTFLoader} from '../vendor/embertide-app/ui/intro/room/procedural/GLTFLoader.js';
import {buildAssemblySkin} from '../app/assembly-geometry.js';
import {beat, lotus, floorOf, rotate, ss, PIECES, RAYS, KNIGHTS_COSMOS, STREAM, faceStream, squareTo, foldSpin} from './unboxing-plan.mjs';
import {placeAthena, presenceAt, passAt, columnOnPage} from './athena-shot.mjs';
// ATHENA'S CUBIST FIT: her shots, each fitted into place; THE FOLD AS ONE WINDOW (his Oct 15 2026 00:44 WEST: oneCells, every face onto her own
// face; hexFold its flight; ONE its dissolve into her window), THE ONE PLANE and the film's light on her (lab/CUBISM.md, lab/LANDING-THE-FOLD.md)
import {herAt, presenceOf, chooseFace, oneCells, hexFold, ONE, PORTAL, herPlane, planeWindowGeometry, planeUniforms, CUBIST_PLANE_GLSL, joinOnFace,
  herLight, herLightUniforms} from './cubism.mjs';
import {shotAt, columnWidthAt} from './braindance.mjs';
import {registeredFit, patchContinuation, continuationAt, HEAD_MARK} from './athena-continuation.mjs?v=12';
import {LAYERS, matteFrame, MATTE_GLSL} from './athena-layers.mjs?v=1';
import {SAGITTARIUS_END, ANIME_TAIL, tailEase} from './mint-cinematic-score.mjs';
import {colonyAt, chargeAt, colonyPicture} from './the-colony.mjs?v=the-cut-1';
import {HOLD_FRAME, mintState} from '../app/dl-paywall.js?v=climax-1';
import {chairForm} from '../app/mint-chairs.mjs';
import {CLEAR_AT} from './liquor-entry.mjs';
import {createHair, hairOfModel} from './fields.js';
import {screenFlowFrame} from './fields-plan.mjs';
import {pictureViewport, FREEZE} from './mint-freeze-layout.mjs';
import {dressInAnimeGold} from './anime-gold.mjs';
import {HER_LIGHT_GLSL} from './cubism.mjs';

const EYE = 4;   // warm-sphere.js project(): the eye four circumradii from the centre
const LIGHT = new THREE.Vector3(-0.32, 0.7, 0.64);   // drawSkin's light, in the page's view space (x right, y up, z toward the eye)
const TILT = 0.3;    // radians the open box leans its top toward the eye: its floor and petals seen from a little above
const DROP = 0.42;   // box radii the open box sits below the sphere's centre, so the lid and Seiya over it stay under the page's top
const LID = {up: 0.85, back: 0.8, lean: 0.95};   // the open lid: box radii up and back (away from the eye), radians leaning its face to the eye
const LOWER = 0.66, UPPER = 0.86;   // radians the floor's petals and the lid's open (atan(2), 1.107, would lay them flat)
const CLOTH = {height: 1.0, width: 1.12}, SEIYA = {height: 1.85, width: 1.3};   // box radii the models are fitted to
const PX_CAP = 2.6e6;   // device pixels at most in the canvas
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
// THE LOAD'S COST (his "why the fuck it got a hiccup when loading the page my dude??", Oct 14 2026 16:1x WEST): each step of the setup leaves a
// performance measure 'unboxing:<step>', so a reader of the page (unboxing.proof.mjs --load) names the cause of each long task
const timed = (name, fn) => { const t0 = performance.now(); try { return fn(); } finally { performance.measure(`unboxing:${name}`, {start: t0, end: performance.now()}); } };
// the setup goes in the page's idle time, a step at a time (a task each, none of them long): an idle callback, or within 100 ms on a page that is
// never idle (lysa); WebKit has none (his Harmony window): right after a frame, or within 100 ms
const slice = () => new Promise(r => {
  if (globalThis.requestIdleCallback) return void globalThis.requestIdleCallback(() => r(), {timeout: 100});
  let done = false; const go = () => { if (!done) { done = true; r(); } };
  requestAnimationFrame(() => setTimeout(go, 0)); setTimeout(go, 100);
});
const mix = (a, b, k) => a + (b - a) * k;
const hash = (n) => { let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };

// THE FOLD's picture edge: 1 on the film's picture (between its pillarbox bars), falling to 0 over its last 1.5 %, so where her window passes the
// picture's edge the film goes into the page's black (or white) softly, not along a cut
const SOFT_PICTURE_GLSL = `
float softPicture(vec2 tex) {
  vec2 lo = smoothstep(vec2(82.0 / 960.0, 0.0), vec2(82.0 / 960.0 + 0.015, 0.025), tex);
  vec2 hi = 1.0 - smoothstep(vec2(878.0 / 960.0 - 0.015, 0.975), vec2(878.0 / 960.0, 1.0), tex);
  return lo.x * lo.y * hi.x * hi.y;
}`;
// ---- the faces: the page's own dodecahedron, its flat decal, its shade and its hairline ----
const PANEL_VS = `
attribute vec2 decal;     // the face's picture square, -1..1 across and down (warm-sphere.js decal())
attribute vec4 edgeA;     // box radii to four of the face's five edges (> 0 inside)
attribute float edgeB;    // and to the fifth
varying vec2 vDecal; varying vec4 vEdgeA; varying float vEdgeB; varying vec3 vNormal; varying vec3 vView; varying vec3 vWorld;
void main() {
  vDecal = decal; vEdgeA = edgeA; vEdgeB = edgeB; vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal); vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const PANEL_FS = `
uniform sampler2D uFilm;
uniform sampler2D uGuided; uniform float uGuideOn;
vec3 guidedPicture(vec2 tex) {
  vec2 q = clamp(tex, 0.0, 1.0);
  if (uGuideOn < 0.5) return texture2D(uFilm, q).rgb;
  // Native target is linear HDR. Video is already display-encoded; convert the native
  // light once here, retaining highlight detail instead of clipping it in an 8-bit target.
  vec3 x = max(vec3(0.0), texture2D(uGuided, vec2(q.x, 1.0 - q.y)).rgb * 0.72);
  x = clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  return mix(12.92 * x, 1.055 * pow(x, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), x));
}
uniform vec4 uSquare;               // the film's centre square in its texture: u0, v0, du, dv (rows top down, as uploaded)
uniform vec3 uFlat0, uFlat1;        // the page's flat decal of this face: the stage's css px to the picture square (warm-sphere.js decal())
uniform vec3 uCanvas;               // the canvas's top-left in the stage (css px) and its device px per css px
uniform float uHeight;              // the canvas's height in device px
uniform float uK3d, uLead, uBloom, uSeam, uHair, uPass;
uniform float uMode;                // this face: 0 the film laid on it, 1 an empty frame (its gold leading and nothing in it), 2 its knight's held
                                    // picture, 3 a window onto the film behind the white page (THE MASK)
uniform sampler2D uHeld;            // its knight's picture: his segment's last frame, the file's centre square
uniform vec4 uPic, uCrop;           // the window: the film's picture on the stage (css px x, y, w, h) and inside the film's texture (u, v, du, dv)
uniform float uGone, uSeed, uBurn;  // THE END OF IT: how far this face has burned away (0 whole, 1 gone), its own noise, the light from inside
uniform vec3 uEdge;                 // the colour of the edge where it burns away or is made again (gold; a knight's cosmos)
uniform float uFold, uDark;         // THE FOLD: the page's look (0) to a window onto the one picture in her plane (1); the page gone black (0..1)
${CUBIST_PLANE_GLSL}
${SOFT_PICTURE_GLSL}
uniform vec3 uLight;
varying vec2 vDecal; varying vec4 vEdgeA; varying float vEdgeB; varying vec3 vNormal; varying vec3 vView; varying vec3 vWorld;
float hash3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise3(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash3(i), hash3(i + vec3(1.0, 0.0, 0.0)), f.x), mix(hash3(i + vec3(0.0, 1.0, 0.0)), hash3(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(hash3(i + vec3(0.0, 0.0, 1.0)), hash3(i + vec3(1.0, 0.0, 1.0)), f.x), mix(hash3(i + vec3(0.0, 1.0, 1.0)), hash3(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
void main() {
  // as the page's sphere (uK3d 0): the picture square laid flat, nothing past it (there the page shows the face it drew before, the one
  // behind), the face's own outward normal; as a box (uK3d > 0): the picture on the face in 3D, turned round to read from behind
  bool front = gl_FrontFacing, sphere = uK3d <= 0.0;
  vec2 css = vec2(gl_FragCoord.x, uHeight - gl_FragCoord.y) / uCanvas.z + uCanvas.xy, laid = vec2(dot(uFlat0, vec3(css, 1.0)), dot(uFlat1, vec3(css, 1.0)));
  if (sphere && max(abs(laid.x), abs(laid.y)) > 1.0) discard;
  vec2 d = mix(laid, vDecal, uK3d);
  if (!front && !sphere) d.x = -d.x;
  vec3 film = uMode > 1.5 && uMode < 2.5 ? texture2D(uHeld, clamp(d * 0.5 + 0.5, 0.0, 1.0)).rgb : texture2D(uFilm, uSquare.xy + clamp(d * 0.5 + 0.5, 0.0, 1.0) * uSquare.zw).rgb;
  vec3 n = normalize(vNormal) * (front || sphere ? 1.0 : -1.0), v = normalize(vView);
  // THE CUTS' device (lab/CUTS.md): for a tenth of a second the faces as their normals, for the next a flat gold matte, then the picture
  if (uPass > 1.5) { gl_FragColor = vec4(0.83, 0.64, 0.29, 1.0); return; }
  if (uPass > 0.5) { gl_FragColor = vec4(n * 0.5 + 0.5, 1.0); return; }
  float lit = clamp(0.31 + 0.69 * max(dot(n, uLight), 0.0), 0.0, 1.0);
  vec3 col = mix(film, vec3(0.184, 0.2, 0.157), (1.0 - lit) * 0.5);     // the sphere's shade, #2f3328 at (1 - lit) / 2
  float spec = max(dot(reflect(-uLight, n), v), 0.0);
  col += vec3(1.0, 0.95, 0.85) * pow(spec, 40.0) * 0.28 * uLead;          // the open panes catch the light
  col = mix(col, vec3(1.0, 0.96, 0.86), clamp(uBloom * 0.65, 0.0, 1.0));  // the burst's flash
  // the edge: the page's hairline (uHair css px wide, centred on the edge, this face's half) thickening into gold leading
  float e = min(min(min(vEdgeA.x, vEdgeA.y), min(vEdgeA.z, vEdgeA.w)), vEdgeB);
  // THE EMPTY FRAMES: the armor stands in the box, so its picture is not on the faces: the leading alone, a gold frame with nothing in it
  vec3 frameGold = vec3(0.86, 0.66, 0.3) * (0.72 + 0.7 * pow(spec, 8.0));
  if (uMode > 0.5 && uMode < 1.5) {
    if (e > 0.05) discard;
    gl_FragColor = vec4(frameGold, 1.0);
    return;
  }
  // THE MASK: a window onto the film behind the page, the picture where the page would show it (the theater's C), flat, the page's white past
  // its edge; the frame's gold round it
  if (uMode > 2.5) {
    vec2 q = (css - uPic.xy) / uPic.zw;
    vec3 seen = q.x < 0.0 || q.y < 0.0 || q.x > 1.0 || q.y > 1.0 ? vec3(0.976, 0.965, 0.937) : texture2D(uFilm, uCrop.xy + q * uCrop.zw).rgb;
    gl_FragColor = vec4(mix(seen, frameGold, 1.0 - smoothstep(0.026, 0.04, e)), 1.0);
    return;
  }
  float px = e / max(fwidth(e), 1e-6), wide = 0.5 * uHair * uCanvas.z;
  float hair = clamp(min(px + 0.5, wide) - max(px - 0.5, 0.0), 0.0, 1.0);
  float lead = 1.0 - smoothstep(0.026, 0.04, e);
  float k = mix(hair * 0.74, lead, uLead);
  vec3 gold = mix(vec3(0.592, 0.443, 0.165), vec3(0.86, 0.66, 0.3) * (0.72 + 0.7 * pow(spec, 8.0)), uLead);
  col = mix(col, gold, k);
  // the light inside coming through the seams before the box opens: a white-gold line along every edge, widening
  float seam = (1.0 - smoothstep(0.004 + 0.03 * uSeam, 0.012 + 0.06 * uSeam, e)) * uSeam;
  col = mix(col, vec3(1.0, 0.93, 0.7), clamp(seam, 0.0, 1.0));
  // THE END OF IT: the face burns away, and is made again by a knight's cosmos, along its own noise, the edge alight; at the burn the light
  // comes from inside it
  if (uGone > 0.0) {
    float n = 0.62 * noise3(vec3(vDecal * 2.6, uSeed * 7.0)) + 0.38 * noise3(vec3(vDecal * 6.5, uSeed * 7.0 + 3.0)), cut = uGone * 1.08 - 0.04;
    if (n < cut) discard;
    col = mix(col, uEdge * 1.25, 1.0 - smoothstep(0.0, 0.07, n - cut));
  }
  col = mix(col, vec3(1.0, 0.93, 0.74), 0.5 * uBurn);
  // THE FOLD: the face a window onto the one picture laid in her plane (the eye's ray through it met with her plane: the picture holds and the
  // faces move over it, THE MASK's look), past the picture's edge the page (white, then black); its gold leading the origami's edges, melted
  // where her plane's window has reached, outward from her hair's join (THE FOLD AS ONE WINDOW: the one folded pentagon dissolves into her window
  // from 30.2 to 30.5 s, the window sweeping past its farthest corner, cubism.mjs ONE); from Aiolos her wall of light white over it
  if (uFold > 0.0) {
    vec2 p0 = herPlaneUV0(vWorld), uv = uHerJoin + (p0 - uHerJoin) / uHerZoom, tex = vec2((480.0 + 270.0 * uv.x) / 960.0, 270.0 * (uv.y + 1.0) / 540.0);
    float dj = length(p0 - uHerJoin), melt = uHerWall < 0.0 ? 1.0 - smoothstep(uHerR - ${ONE.band.toFixed(3)}, uHerR, dj) : 0.0;
    vec3 seen = mix(mix(vec3(0.976, 0.965, 0.937), vec3(0.0), uDark), guidedPicture(tex), softPicture(tex));
    if (uHerWall >= 0.0) seen = mix(seen, vec3(1.0, 0.985, 0.95), 1.0 - smoothstep(uHerWall - 0.08, uHerWall, dj));
    col = mix(col, mix(seen, frameGold, (1.0 - smoothstep(0.026, 0.04, e)) * uLead * (1.0 - melt)), uFold);
  }
  gl_FragColor = vec4(col, 1.0);
}`;
// THE ONE PLANE (cubism.mjs): her plane's window, a quad over the whole canvas whose every fragment is read where the eye's ray through it meets
// her plane: inside the window's radius from her hair's join the one picture (past its edge the page), a gold rim at the window's edge where
// it cuts the film's drawing, and from Aiolos the wall of light running out from her, white behind it. The rim is drawn on the picture only
// (THE FOLD AS ONE WINDOW, his Oct 15 2026 00:44 WEST over the thin gold arc of this window crossing the black and the picture: "this grid
// dude is all absolutely fucked up. you gotta do differently. when does it stop being a dodecahedron mask??"; her hair's join stands outside
// the film's frame, so a rim all round drew a gold ring round black from 29.8 s and a gold arc swinging through the black to 36 s)
const PLANE_VS = `
varying vec3 vWorld;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const PLANE_FS = `
uniform sampler2D uFilm;
uniform sampler2D uGuided; uniform float uGuideOn;
vec3 guidedPicture(vec2 tex) {
  vec2 q = clamp(tex, 0.0, 1.0);
  if (uGuideOn < 0.5) return texture2D(uFilm, q).rgb;
  // Native target is linear HDR. Video is already display-encoded; convert the native
  // light once here, retaining highlight detail instead of clipping it in an 8-bit target.
  vec3 x = max(vec3(0.0), texture2D(uGuided, vec2(q.x, 1.0 - q.y)).rgb * 0.72);
  x = clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  return mix(12.92 * x, 1.055 * pow(x, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), x));
}
uniform float uDark, uLayer;
${MATTE_GLSL}
${CUBIST_PLANE_GLSL}
${SOFT_PICTURE_GLSL}
varying vec3 vWorld;
void main() {
  vec3 r = vWorld - cameraPosition;
  float den = dot(uHerN, r);
  if (abs(den) < 1e-6 || -(dot(uHerN, cameraPosition) + uHerD) / den <= 0.0) discard;   // a ray that meets her plane behind the eye
  float d = length(herPlaneUV0(vWorld) - uHerJoin), aa = max(fwidth(d), 1e-4);
  float inside = 1.0 - smoothstep(uHerR - aa, uHerR + aa, d);
  if (inside <= 0.0) discard;
  vec2 tex = herPictureUV(vWorld);
  float onPicture = softPicture(tex);
  vec3 col = mix(mix(vec3(0.976, 0.965, 0.937), vec3(0.0), uDark), guidedPicture(tex), onPicture);
  col = mix(col, vec3(0.86, 0.66, 0.3), 0.85 * smoothstep(uHerR - 5.0 * aa, uHerR - aa, d) * onPicture);
  if (uHerWall >= 0.0) col = mix(col, vec3(1.0, 0.985, 0.95), 1.0 - smoothstep(uHerWall - 8.0 * aa, uHerWall, d));
  float weight = layerWeight(shotMattes(tex), uLayer);
  // Premultiplied sum, not three normal-alpha overlaps: the partition sums to
  // the source exactly, including fractional strand edges. Empty space belongs
  // to terrain alone. The three pieces can be inspected independently.
  weight = mix(uLayer < 0.5 ? 1.0 : 0.0, weight, onPicture);
  float alpha = inside * weight;
  if (alpha < 0.001) discard;
  gl_FragColor = vec4(col * alpha, alpha);
}`;

// ---- light: the column, the sparks, the wings of light, the aura on a figure ----
const COLUMN_VS = `
varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
void main() { vPos = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); vNormal = normalize(normalMatrix * normal); vView = -mv.xyz; gl_Position = projectionMatrix * mv; }`;
const COLUMN_FS = `
uniform float uK, uTop, uT;
varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
void main() {
  float y = vPos.y;                                   // 0 at the floor, 1 at the column's top
  if (y > uTop) discard;
  float facing = abs(dot(normalize(vNormal), normalize(vView)));
  float core = pow(facing, 1.6);
  float a = atan(vPos.x, vPos.z);
  float streak = 0.72 + 0.28 * sin(a * 7.0 + y * 9.0 - uT * 2.3) * sin(a * 3.0 - y * 5.0 + uT * 1.1);
  float k = uK * core * streak * (1.0 - smoothstep(0.55, 1.0, y)) * smoothstep(0.0, 0.05, y) * (1.0 - smoothstep(uTop - 0.12, uTop, y));
  k *= gl_FrontFacing ? 0.32 : 0.9;
  vec3 c = mix(vec3(1.0, 0.74, 0.26), vec3(1.0, 0.97, 0.86), core * core);
  gl_FragColor = vec4(c, clamp(k * 0.62, 0.0, 1.0));
}`;
const FLOOR_FS = `
uniform float uK; varying vec2 vUv;
void main() { float r = length(vUv - 0.5) * 2.0; float k = uK * (1.0 - smoothstep(0.0, 1.0, r)); gl_FragColor = vec4(mix(vec3(1.0, 0.78, 0.3), vec3(1.0, 0.98, 0.9), 1.0 - r), clamp(k * 0.8, 0.0, 1.0)); }`;
const UV_VS = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SPARK_VS = `
attribute vec3 velocity; attribute vec3 born;        // born: the film's second it flies, its life in seconds, its size in css px
uniform float uT, uPx;
varying float vA; varying float vHot;
void main() {
  float age = uT - born.x, life = born.y;
  vA = age >= 0.0 && age < life ? pow(1.0 - age / life, 1.5) : 0.0;
  vHot = vA;
  vec3 p = position + velocity * (1.0 - exp(-max(age, 0.0) * 2.4)) / 2.4 + vec3(0.0, -0.12 * age * age, 0.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = vA > 0.0 ? born.z * uPx * (0.55 + 0.45 * vA) : 0.0;
}`;
const SPARK_FS = `
varying float vA; varying float vHot;
void main() {
  if (vA <= 0.0) discard;
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float k = (1.0 - smoothstep(0.35, 1.0, r)) * vA;
  gl_FragColor = vec4(mix(vec3(0.95, 0.66, 0.18), vec3(1.0, 0.97, 0.86), (1.0 - r) * vHot), clamp(k, 0.0, 1.0));
}`;
// THE END OF IT's particles: each flies a quadratic curve from `position` past `ctrl` to `to` from second born.x for born.y seconds, born.z css
// px, born.w 1: fading as it goes (the dust, the darts), 0: fading in and absorbed where it arrives (a knight's stream). decal.z 1: its colour
// is the film's at decal.xy on its face (the box's own picture dissolving into dust)
const COSMOS_VS = `
attribute vec3 ctrl; attribute vec3 to; attribute vec3 tint; attribute vec4 born; attribute vec3 decal;
uniform float uT, uPx; uniform sampler2D uFilm; uniform vec4 uSquare;
varying vec3 vTint; varying float vA;
void main() {
  float u = (uT - born.x) / born.y, k = clamp(u, 0.0, 1.0), e = k * k * (3.0 - 2.0 * k);
  vec3 p = mix(mix(position, ctrl, e), mix(ctrl, to, e), e);
  vA = u >= 0.0 && u < 1.0 ? (born.w > 0.5 ? (1.0 - k) * smoothstep(0.0, 0.06, k) : smoothstep(0.0, 0.12, k) * (1.0 - smoothstep(0.82, 1.0, k))) : 0.0;
  vTint = decal.z > 0.5 ? mix(texture2D(uFilm, uSquare.xy + clamp(decal.xy * 0.5 + 0.5, 0.0, 1.0) * uSquare.zw).rgb, vec3(1.0, 0.86, 0.5), 0.35) : tint;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = vA > 0.0 ? born.z * uPx : 0.0;
}`;
const COSMOS_FS = `
varying vec3 vTint; varying float vA;
void main() {
  if (vA <= 0.0) discard;
  float r = length(gl_PointCoord - 0.5) * 2.0, k = (1.0 - smoothstep(0.45, 1.0, r)) * vA;
  gl_FragColor = vec4(mix(vTint, vec3(1.0, 0.98, 0.92), (1.0 - r) * (1.0 - r) * 0.6), clamp(k * 1.15, 0.0, 1.0));
}`;
const FEATHER_FS = `
uniform float uK; varying vec2 vUv;
void main() {
  float x = (vUv.x - 0.5) * 2.0, y = vUv.y;               // across the feather, along it from the shoulder
  float w = sin(3.14159 * pow(y, 0.7)) * (1.0 - 0.35 * y); // a feather's outline, pointed at its tip
  float edge = 1.0 - smoothstep(w * 0.75, w, abs(x));
  float k = uK * edge * smoothstep(0.0, 0.08, y);
  vec3 c = mix(vec3(1.0, 0.76, 0.28), vec3(1.0, 0.97, 0.88), (1.0 - abs(x) / max(w, 1e-3)) * (1.0 - y * 0.6));
  gl_FragColor = vec4(c, clamp(k * 0.72, 0.0, 1.0));
}`;
const AURA_VS = `
varying vec3 vNormal; varying vec3 vView;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal); vView = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}`;
const AURA_FS = `
uniform float uFill, uRim, uClip;
uniform vec4 uFloor;   // the floor he rises through, in view space (n, constant): what is under it is not drawn (uClip 1, his aura)
varying vec3 vNormal; varying vec3 vView;
void main() {
  if (uClip > 0.5 && dot(vec4(-vView, 1.0), uFloor) < 0.0) discard;
  float f = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
  float k = uFill + uRim * pow(f, 2.2);
  gl_FragColor = vec4(mix(vec3(1.0, 0.8, 0.36), vec3(1.0, 0.98, 0.9), uFill), clamp(k, 0.0, 1.0));
}`;

// ---- the stand-ins, until the lab lists a cloth and a Seiya: polished gold, made of a few smooth solids ----
function goldOf(tone = 1) {
  return new THREE.MeshStandardMaterial({color: new THREE.Color().setRGB(1.0 * tone, 0.73 * tone, 0.32 * tone), metalness: 1, roughness: 0.19, envMapIntensity: 1.25});
}
// a capsule from a to b
function limb(a, b, r, material) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B);
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(1e-3, len), 6, 14), material);
  mesh.position.copy(A).add(B).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  return mesh;
}
function ball(at, r, material, scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), material);
  mesh.position.set(...at); mesh.scale.set(...scale);
  return mesh;
}
function tube(points, r, material) {
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), 32, r, 10, false), material);
}
// a wing: a fan of feathers from its root, each a flattened capsule; `spread(k)` turns them from folded (0) to open (1)
function wing(side, material, {count = 8, length = 0.5, root = [0, 0, 0]} = {}) {
  const group = new THREE.Group(), feathers = [];
  group.position.set(...root);
  for (let i = 0; i < count; i++) {
    const L = length * (0.55 + 0.45 * Math.sin(Math.PI * (i + 0.6) / (count + 0.2)));
    const pivot = new THREE.Group(), feather = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, L, 4, 8), material);
    feather.position.y = L / 2 + 0.02; feather.scale.z = 0.32;
    pivot.add(feather); group.add(pivot); feathers.push(pivot);
  }
  return {group, spread(k) {
    feathers.forEach((pivot, i) => {
      const u = i / (feathers.length - 1);
      const folded = 2.95 - 0.2 * u, open = 0.35 + 1.25 * u;   // radians from straight up, outward: down along the back, then fanned
      pivot.rotation.set(0, side * mix(0.15, 0.55, k), -side * mix(folded, open, k));
    });
  }};
}
// the gold cloth of Sagittarius in its object form: a centaur drawing his bow, winged; facing +z, standing on y = 0, `scale` box radii a unit;
// each part (the body, a leg, the tail, the torso, the head, an arm, the bow, the arrow, a wing) baked where it stands, so it can fly
function standInCloth(scale = 0.78) {
  const gold = goldOf(), dark = goldOf(0.72), root = new THREE.Group(), raw = [];
  const part = (name, ...meshes) => { const g = new THREE.Group(); g.name = name; meshes.forEach(m => g.add(m)); root.add(g); raw.push(g); return g; };
  part('body', limb([0, 0.52, -0.22], [0, 0.54, 0.2], 0.135, gold), ball([0, 0.57, 0.22], 0.14, gold, [1, 1, 1.15]));
  for (const [x, z, lift] of [[0.075, 0.2, 1], [-0.075, 0.22, 0], [0.07, -0.21, 0], [-0.07, -0.2, 0.3]]) {
    const knee = [x, 0.27 + 0.06 * lift, z + 0.06 * lift], hoof = [x, 0.03 + 0.14 * lift, z + 0.13 * lift];
    part('leg', limb([x, 0.47, z], knee, 0.042, gold), limb(knee, hoof, 0.03, gold), ball(hoof, 0.036, dark, [1, 0.7, 1.2]));
  }
  part('tail', tube([[0, 0.56, -0.34], [0, 0.6, -0.48], [0, 0.42, -0.6], [0, 0.25, -0.62]], 0.028, gold));
  part('torso', limb([0, 0.66, 0.26], [0, 0.88, 0.3], 0.085, gold), limb([-0.12, 0.92, 0.29], [0.12, 0.92, 0.29], 0.05, dark));
  part('head', ball([0, 1.04, 0.31], 0.064, gold), limb([0, 1.08, 0.28], [0, 1.16, 0.16], 0.016, dark));
  part('bow arm', limb([0.12, 0.92, 0.29], [0.06, 0.93, 0.55], 0.032, gold),
    tube(Array.from({length: 9}, (_, i) => { const a = (i / 8 - 0.5) * 2.1; return [0.06, 0.93 + 0.36 * Math.sin(a), 0.6 - 0.16 * (1 - Math.cos(a))]; }), 0.016, gold));
  part('string arm', limb([-0.12, 0.92, 0.29], [0.04, 0.93, 0.26], 0.032, gold),
    tube([[0.06, 1.25, 0.47], [0.05, 0.93, 0.26], [0.06, 0.61, 0.47]], 0.004, dark));
  part('arrow', limb([0.05, 0.93, 0.22], [0.05, 0.93, 0.86], 0.007, gold),
    (() => { const head = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.07, 12), gold); head.position.set(0.05, 0.93, 0.89); head.rotation.x = Math.PI / 2; return head; })());
  for (const side of [1, -1]) {
    const w = wing(side, gold, {count: 7, length: 0.42, root: [side * 0.05, 0.9, 0.2]});
    w.spread(0.82); part('wing', w.group);
  }
  root.scale.setScalar(scale); root.updateMatrixWorld(true);
  const out = new THREE.Group(), parts = raw.map(g => {
    const baked = new THREE.Group(); baked.name = g.name;
    g.traverse(o => { if (o.isMesh) baked.add(new THREE.Mesh(o.geometry.clone().applyMatrix4(o.matrixWorld), o.material)); });
    out.add(baked);
    return baked;
  });
  return {root: out, parts};
}
// Seiya in the gold cloth: a dressed mannequin, facing +z, feet on y = 0, 1.85 tall, his wings folded until they spread
function standInSeiya() {
  const gold = goldOf(), dark = goldOf(0.7), root = new THREE.Group();
  const add = (...meshes) => meshes.forEach(m => root.add(m));
  add(limb([-0.09, 0.98, 0], [0.09, 0.98, 0], 0.1, dark), new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.026, 10, 32), gold));
  root.children.at(-1).position.y = 1.06; root.children.at(-1).rotation.x = Math.PI / 2;
  add(limb([0, 1.12, 0], [0, 1.38, 0], 0.135, gold), ball([0, 1.37, 0.035], 0.17, gold, [1, 0.8, 0.66]));
  for (const s of [1, -1]) {
    add(ball([s * 0.22, 1.47, 0], 0.09, gold, [1.25, 0.8, 1.05]));
    add(limb([s * 0.22, 1.43, 0], [s * 0.29, 1.18, 0.02], 0.05, dark), limb([s * 0.29, 1.18, 0.02], [s * 0.31, 0.95, 0.07], 0.046, gold), ball([s * 0.31, 0.92, 0.08], 0.05, dark));
    add(limb([s * 0.09, 0.93, 0], [s * 0.1, 0.52, 0.02], 0.072, gold), limb([s * 0.1, 0.52, 0.02], [s * 0.1, 0.1, 0], 0.056, gold), limb([s * 0.1, 0.04, -0.02], [s * 0.1, 0.04, 0.12], 0.042, dark));
  }
  add(limb([0, 1.54, 0], [0, 1.6, 0], 0.05, dark), ball([0, 1.72, 0.01], 0.11, gold), new THREE.Mesh(new THREE.TorusGeometry(0.113, 0.017, 8, 40), gold));
  const band = root.children.at(-1); band.position.set(0, 1.75, 0.0); band.rotation.set(Math.PI / 2 - 0.22, 0, 0);
  add(limb([0, 1.82, 0.05], [0, 1.9, -0.14], 0.02, gold));
  const wings = [1, -1].map(side => wing(side, gold, {count: 8, length: 0.62, root: [side * 0.07, 1.42, -0.12]}));
  wings.forEach(w => root.add(w.group));
  return {root, wings};
}

// ---- a model the lab lists: fitted, and the cloth in pieces ----
function fitted(object, {height, width}) {
  const holder = new THREE.Group(), offset = new THREE.Group();
  holder.add(offset); offset.add(object);
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object), size = box.getSize(new THREE.Vector3()), centre = box.getCenter(new THREE.Vector3());
  const s = Math.min(height / Math.max(size.y, 1e-6), width / Math.max(size.x, size.z, 1e-6));
  offset.position.set(-centre.x, -box.min.y, -centre.z); holder.scale.setScalar(s);
  holder.updateMatrixWorld(true);
  return holder;
}
// The cloth breaks where it is: its triangles shared among `count` seeds spread over it (farthest first), each share a piece turning
// about its own centre. `h` is how high the piece sat (0 at the floor, 1 at the top), so the legs' pieces dress his legs first.
async function shatter(holder, count = 14, pause = async () => {}) {
  await pause();
  holder.updateMatrixWorld(true);
  const meshes = []; holder.traverse(o => { if (o.isMesh && !o.isSkinnedMesh) meshes.push(o); });
  const baked = [];
  for (const m of meshes) {
    baked.push({g: (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()).applyMatrix4(m.matrixWorld), material: Array.isArray(m.material) ? m.material[0] : m.material});
    await pause();
  }
  const cents = [];
  for (const {g} of baked) { const p = g.attributes.position.array; for (let i = 0; i < p.length; i += 9) cents.push((p[i] + p[i + 3] + p[i + 6]) / 3, (p[i + 1] + p[i + 4] + p[i + 7]) / 3, (p[i + 2] + p[i + 5] + p[i + 8]) / 3); }
  const n = cents.length / 3, stride = Math.max(1, Math.floor(n / 3000)), seeds = [], far = new Float64Array(n).fill(Infinity);
  let pick = 0;
  for (let s = 0; s < Math.min(count, n); s++) {
    seeds.push([cents[pick * 3], cents[pick * 3 + 1], cents[pick * 3 + 2]]);
    let best = -1;
    for (let i = 0; i < n; i += stride) {
      const d = (cents[i * 3] - seeds[s][0]) ** 2 + (cents[i * 3 + 1] - seeds[s][1]) ** 2 + (cents[i * 3 + 2] - seeds[s][2]) ** 2;
      if (d < far[i]) far[i] = d;
      if (far[i] > best) { best = far[i]; pick = i; }
    }
  }
  await pause();
  const box = new THREE.Box3().setFromObject(holder), low = box.min.y, tall = Math.max(box.max.y - box.min.y, 1e-6), pieces = [];
  let tri = 0;
  for (const {g, material} of baked) {
    const tris = g.attributes.position.count / 3, owner = new Int32Array(tris);
    await pause();
    for (let t = 0; t < tris; t++, tri++) {
      let best = 0, bd = Infinity;
      for (let s = 0; s < seeds.length; s++) { const d = (cents[tri * 3] - seeds[s][0]) ** 2 + (cents[tri * 3 + 1] - seeds[s][1]) ** 2 + (cents[tri * 3 + 2] - seeds[s][2]) ** 2; if (d < bd) { bd = d; best = s; } }
      owner[t] = best;
    }
    for (let s = 0; s < seeds.length; s++) {
      if (s % 4 === 0) await pause();
      const mine = []; for (let t = 0; t < tris; t++) if (owner[t] === s) mine.push(t);
      if (!mine.length) continue;
      const piece = new THREE.BufferGeometry();
      for (const [name, attr] of Object.entries(g.attributes)) {
        const k = attr.itemSize, out = new attr.array.constructor(mine.length * 3 * k);
        mine.forEach((t, j) => out.set(attr.array.subarray(t * 3 * k, t * 3 * k + 3 * k), j * 3 * k));
        piece.setAttribute(name, new THREE.BufferAttribute(out, k, attr.normalized));
      }
      piece.computeBoundingBox();
      const c = piece.boundingBox.getCenter(new THREE.Vector3());
      piece.translate(-c.x, -c.y, -c.z);
      pieces.push({mesh: new THREE.Mesh(piece, material), home: c, h: (c.y - low) / tall});
    }
  }
  return pieces;
}
// points on a figure's surface, low to high, in its fitted frame: where the pieces land
function surface(holder, count = 480) {
  holder.updateMatrixWorld(true);
  const pts = [], v = new THREE.Vector3();
  holder.traverse(o => {
    if (!o.isMesh) return;
    const p = o.geometry.attributes.position, step = Math.max(1, Math.floor(p.count / count));
    for (let i = 0; i < p.count; i += step) pts.push(v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld).clone());
  });
  return pts.sort((a, b) => a.y - b.y);
}
// The GLBs the lab holds for the box. aiolos serves /intro/ three folders deep at most (harmony-aiolos.mjs, the /intro/ door; main 0d7a391f),
// so on his Harmony a GLB sits in lab/ itself and is listed in lab/unboxing-assets.json; a scratch server may serve lab/assets/index.json.
// Either is {cloth: [...], seiya: [...]} (file names relative to the list, best first) or a plain list of names that start cloth or seiya.
async function readAssets(base) {
  const lists = {cloth: [], seiya: []}, name = (e) => typeof e === 'string' ? e : e?.file ?? e?.src ?? e?.name ?? null;
  for (const list of ['unboxing-assets.json', 'assets/index.json']) {
    try {
      const at = new URL(list, base), r = await fetch(at, {cache: 'no-store'});
      if (!r.ok) continue;
      const j = await r.json();
      const entries = Array.isArray(j) ? j.map(e => [null, name(e)]) : [...(j.cloth ?? []).map(e => ['cloth', name(e)]), ...(j.seiya ?? []).map(e => ['seiya', name(e)])];
      for (const [given, file] of entries) {
        if (typeof file !== 'string' || !/\.glb$/i.test(file)) continue;
        const leaf = file.split('/').pop(), kind = given ?? (/^cloth/i.test(leaf) ? 'cloth' : /^seiya/i.test(leaf) ? 'seiya' : null);
        if (kind) lists[kind].push(new URL(file, at).href);
      }
      if (lists.cloth.length || lists.seiya.length) break;
    } catch { /* not there: the next list, or the stand-ins */ }
  }
  return lists;
}

/**
 * canvas: the 3D canvas in the stage; film: the page's <video>; sphere: the page's genesisSphere; stage: the sphere's stage element;
 * at: {open, centaur, knights, rise, back} (film seconds); pick: {cloth, seiya} asset URLs asked for in the URL (or null); onDraw(stats),
 * onAssets(state); worlds(): the page's twelve worlds of its last frame ({x, y, r} css px, orbit-kick.js), hideWorlds(on): their dots off;
 * her: whether her 3D figure (and with it the record's column of light) is on the page at all (false: the record is read, her model is not
 * loaded, nothing of hers draws; THE FOLD and her window stay). freezeSpace: the private navigable view of the existing mint hold.
 */
export async function createUnboxing({canvas, film, sphere, stage, at, pick = {}, onDraw = null, onAssets = null, worlds: worldsOf = null, hideWorlds = null, onDark = null, onFold = null, her = true, nativeStudy = false, freezeSpace = false, mintSupply = null, mintChairs = null, getEntryPose = () => null}) {
  const doc = canvas.ownerDocument, view = doc.defaultView;
  // the draws' state: whether the box is out and may come out, its draws, the GPU's last time, the frame callbacks it holds
  let out = false, enabled = false, draws = 0, gpuMs = null, shownAt = 1, lastPose = '', callback = 0, flowing = 0, drawnAt = -1, asked = false, darkAt = 0;
  let bd = null, athena = null, athenaOn = false, placed = null, placedKey = '';   // the record, her model, whether she is on the page, her place
  let freeze = null, freezeHeld = false, freezeChanging = false, freezeRestore = null, destroyed = false, stopSupply = null, stopChairs = null, genesisJob = null;
  function shown() { return out || athenaOn || Boolean(freeze?.active); }   // the canvas is awake only while one of its scenes is on the page
  const animeLeadIn = t => freezeSpace && at.fold && t >= at.fold.start && t < SAGITTARIUS_END;
  // THE TAIL (mint-cinematic-score.mjs ANIME_TAIL; his Oct 21 2026 WEST "make the tranistion between dolbar and the dodecahedron smoother... time the
  // transition to the frame perfectly and add some ease-in/out"): from the cut to the rite's own frame to the soundtrack's beat after it, the fullscreen
  // picture eases down onto the page's dodecahedron and dissolves into it, the black easing out to the page's paper (drawAnime); the page's skin is
  // drawn under it (mode 1), on the screen's frames (flow)
  const animeTail = t => freezeSpace && at.fold && t >= SAGITTARIUS_END && t < SAGITTARIUS_END + ANIME_TAIL;
  // THE COLONY (lab/the-colony.mjs; his Oct 21 2026 WEST "make the dodecahedron explode and make anime colonize the screen radially from where
  // the dodecahedron explodes? make it timed with the anime"): from the cut into the meteors on Dolbar the film spreads from the page's
  // dodecahedron over the whole stage, holds it through the strike and folds back into it (drawColony); the page's skin, bursting, is drawn
  // under it and its swarm in front of it (mode 1), on the screen's frames (flow)
  const animeColony = t => freezeSpace && at.fold && colonyAt(t) !== null;
  // THE CHARGE (lab/the-colony.mjs chargeAt; his Oct 21 2026 WEST "it should be emanating / irradiating the flames of cosmos being burned"): from
  // the cut to Seiya lit gold to the explosion the page's dodecahedron burns with his cosmos (drawCorona), its skin under the flames and its
  // swarm in front of them (mode 1), on the screen's frames (flow)
  const animeCorona = t => freezeSpace && at.fold && chargeAt(t) !== null;
  const beatAt = (t) => {
    const value = beat(t, at);
    // Keep the source drawing intact through the complete Cloth transformation
    // and Seiya's descent. The sphere resumes only after that source sequence.
    // THE COLONY over the whole stage hushes the page's skin under it (orbit-kick.js THE HUSH, mode 2: its flung faces cost nothing unseen);
    // while the film spreads or folds back the skin draws under it (mode 1)
    if (animeColony(t)) return {...value, out:true, mode: colonyAt(t).spread >= 1 ? 2 : 1, flow:true};
    return animeLeadIn(t) ? {...value, out:true, mode:2} : animeTail(t) || animeCorona(t) ? {...value, out:true, mode:1, flow:true} : value;
  };
  await slice();   // not in the task that evaluated three.js
  const renderer = timed('renderer', () => new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: 'high-performance'}));
  renderer.setPixelRatio(1); renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.05;
  const gl = renderer.getContext();
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera();
  camera.position.set(0, 0, EYE); camera.updateMatrixWorld(true);
  await slice();
  scene.environment = await studio(renderer);
  await slice();
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.0); sun.position.copy(LIGHT).multiplyScalar(6); scene.add(sun);
  const sky = new THREE.HemisphereLight(0xfff6e8, 0x3a2d1a, 0.55); scene.add(sky);
  // THE FOLD's light on her is the film's own, measured (cubism.mjs FILM_LIGHT, herLight: her looks' patch, compiled at load), not a light of
  // the scene's: the page's sun and sky stay as they are, so no light is added to every lit look's program

  // the film, copied as the page's <video> presents each frame (raw GL: the video is another document's, and three's checks are this one's)
  const filmTex = gl.createTexture(), film3 = new THREE.ExternalTexture(filmTex);
  gl.bindTexture(gl.TEXTURE_2D, filmTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([233, 229, 217, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.generateMipmap(gl.TEXTURE_2D);
  renderer.resetState();
  const square = new THREE.Vector4(0, 0, 1, 1);
  let copied = -1;
  const upload = () => {
    if (film.readyState < 2 || !film.videoWidth) return;
    gl.bindTexture(gl.TEXTURE_2D, filmTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, film);
    gl.generateMipmap(gl.TEXTURE_2D);
    renderer.resetState();
    const w = film.videoWidth, h = film.videoHeight, side = Math.min(w, h);   // warm-sphere.js drawPortrait: the file's centre square
    square.set((w - side) / 2 / w, (h - side) / 2 / h, side / w, side / h);
    copied = film.currentTime;
  };

  // October 15, 17:32: the Athena lead-in is the intact anime, then a glow into
  // the native mint scene. A single screen-aligned pass replaces the old fold,
  // circular aperture and gold rim; it uses the existing uploaded video texture.
  const animeScene = new THREE.Scene(), animeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  // uAlpha and uCrop: 1 and the whole file but in THE TAIL, where the picture alone (its content, without the file's black margins: x0, y0, width,
  // height of the file, from its top) dissolves into the page's dodecahedron (premultiplied, over a clear canvas)
  const animeMaterial = new THREE.ShaderMaterial({depthTest: false, depthWrite: false, toneMapped: false, transparent: true, premultipliedAlpha: true,
    uniforms: {uFilm: {value: film3}, uAlpha: {value: 1}, uCrop: {value: new THREE.Vector4(0, 0, 1, 1)}},
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
    fragmentShader: 'uniform sampler2D uFilm; uniform float uAlpha; uniform vec4 uCrop; varying vec2 vUv; void main(){gl_FragColor=vec4(texture2D(uFilm,vec2(uCrop.x+vUv.x*uCrop.z,uCrop.y+(1.0-vUv.y)*uCrop.w)).rgb*uAlpha,uAlpha);}'});
  const animeGeometry = new THREE.PlaneGeometry(2, 2);
  animeScene.add(new THREE.Mesh(animeGeometry, animeMaterial));
  // THE COLONY's pass: one quad over the whole canvas; the film covering the stage (uPic: the file's rectangle, device px from the top left),
  // inside a disc (uMask: its centre, radius and soft edge, device px) whose front is a ring of gold (uRing); premultiplied, over a clear canvas
  const colonyScene = new THREE.Scene();
  const colonyMaterial = new THREE.ShaderMaterial({depthTest: false, depthWrite: false, toneMapped: false, transparent: true, premultipliedAlpha: true,
    uniforms: {uFilm: {value: film3}, uPic: {value: new THREE.Vector4(0, 0, 1, 1)}, uMask: {value: new THREE.Vector4(0, 0, 0, 1)},
      uSize: {value: new THREE.Vector2(1, 1)}, uRing: {value: 0}, uAlpha: {value: 1}, uFlash: {value: 0}},
    vertexShader: 'void main(){gl_Position=vec4(position.xy,0.0,1.0);}',
    fragmentShader: `uniform sampler2D uFilm; uniform vec4 uPic, uMask; uniform vec2 uSize; uniform float uRing, uAlpha, uFlash;
void main(){
  vec2 p = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y), q = (p - uPic.xy) / uPic.zw;
  vec3 film = (q.x < 0.0 || q.y < 0.0 || q.x > 1.0 || q.y > 1.0) ? vec3(0.0) : texture2D(uFilm, q).rgb;
  float d = distance(p, uMask.xy), inside = 1.0 - smoothstep(uMask.z - uMask.w, uMask.z, d);
  float ring = uRing * exp(-pow((d - (uMask.z - 0.5 * uMask.w)) / (0.45 * uMask.w), 2.0));
  // the call's flash: the disc white-hot and a white bloom round its front, gone in a third of a second
  float bloom = uFlash * exp(-max(d - uMask.z, 0.0) / (2.5 * uMask.w));
  float a = clamp(max(max(inside, ring * 0.85), bloom * 0.9), 0.0, 1.0) * uAlpha;
  vec3 col = mix(film, vec3(1.0, 0.84, 0.42), clamp(ring, 0.0, 1.0) * 0.9);
  col = mix(col, vec3(1.0, 0.98, 0.92), clamp(uFlash * 0.85 + bloom * 0.5, 0.0, 1.0));
  gl_FragColor = vec4(col * a, a);
}`});
  colonyScene.add(new THREE.Mesh(animeGeometry, colonyMaterial));
  // THE CHARGE's pass: one quad over the whole canvas, the flames of his cosmos round the page's dodecahedron (uDisc: its centre and its shell's
  // reach, device px); tongues of fire flowing out along rays (noise read on the rim's circle, so no seam), a halo hugging the rim, slow rays,
  // the charge glowing through the faces; uTime the film's second (a pause holds them, a seek lands on the same flames)
  const coronaScene = new THREE.Scene();
  const coronaMaterial = new THREE.ShaderMaterial({depthTest: false, depthWrite: false, toneMapped: false, transparent: true, premultipliedAlpha: true,
    uniforms: {uSize: {value: new THREE.Vector2(1, 1)}, uDisc: {value: new THREE.Vector3(0, 0, 1)}, uTime: {value: 0}, uHeat: {value: 0}, uPulse: {value: 0},
      uTint: {value: new THREE.Vector3(1, 0.76, 0.26)}, uSwell: {value: 0}, uReach: {value: 3}},
    vertexShader: 'void main(){gl_Position=vec4(position.xy,0.0,1.0);}',
    fragmentShader: `uniform vec2 uSize; uniform vec3 uDisc, uTint; uniform float uTime, uHeat, uPulse, uSwell, uReach;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + vec2(17.1, 9.2); a *= 0.5; } return v; }
void main(){
  vec2 p = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y) - uDisc.xy;
  float d = length(p) / uDisc.z, ang = atan(p.y, p.x), out1 = d - 1.0;
  // the angle on the rim's circle at a fixed scale (broad tongues, no seam) and the flow outward along a second axis of the noise, so the
  // tongues rise and sway without the flow thinning them to hairs
  float sway = 0.035 * sin(uTime * 1.3 + d * 3.0);
  vec2 c = vec2(cos(ang + sway), sin(ang + sway));
  float flow = uTime * 1.25;
  float n = fbm(c * 2.3 + vec2(0.0, d * 1.7 - flow));
  float m = fbm(c * 4.6 + vec2(d * 2.6 - flow * 1.35, 3.1));
  float tongue = (0.15 + 1.0 * uHeat + 0.35 * uPulse) * (0.3 + 1.4 * n * n + 0.3 * m);
  float flame = (out1 > 0.0 ? 1.0 - smoothstep(0.0, tongue, out1) : smoothstep(0.8 - 0.12 * uHeat, 1.0, d)) * (0.6 + 0.4 * m);
  float rays = pow(max(0.0, sin(ang * 18.0 + 2.5 * fbm(c * 3.0 + vec2(uTime * 0.1)))), 16.0) * smoothstep(0.95, 1.05, d) * exp(-max(out1, 0.0) * 1.6) * uHeat * 0.75;
  float halo = exp(-max(out1, 0.0) * (5.0 - 2.5 * uHeat)) * smoothstep(0.7, 1.0, d) * (0.35 + 0.4 * uPulse);
  float core = (1.0 - smoothstep(0.0, 1.0, d)) * 0.08 * uHeat;
  float k = clamp(flame * (0.3 + 0.7 * uHeat) + halo * uHeat + rays * 0.8 + core, 0.0, 1.0);
  // THE FLAMES ARE THE ANIME'S COLOUR (the-colony.mjs tintAt): deep where the fire is thin, the film's own colour in its body, near white where
  // it is hottest
  vec3 col = mix(pow(uTint, vec3(1.8)), uTint, smoothstep(0.15, 0.6, k));
  col = mix(col, mix(uTint, vec3(1.0), 0.8), smoothstep(0.65, 1.0, k));
  float a = k * (0.7 + 0.3 * uPulse);
  // THE SWELL (the-colony.mjs swellAt): the glow of that colour spreading out from the rim, its front at 1 + swell of the way to the stage's
  // farthest corner (uReach, in the rim's radii), soft and still: no noise, no flare
  float front = 1.0 + uSwell * (uReach - 1.0);
  float glow = uSwell * (1.0 - smoothstep(front * 0.55, front, d)) * smoothstep(0.85, 1.05, d) * 0.55;
  glow += uSwell * uSwell * exp(-pow((d - front) / (0.12 * front), 2.0)) * 0.35;
  vec3 gcol = mix(uTint, vec3(1.0), 0.35);
  float ga = clamp(glow, 0.0, 1.0) * (1.0 - a);
  gl_FragColor = vec4(col * a + gcol * ga, a + ga);
}`});
  coronaScene.add(new THREE.Mesh(animeGeometry, coronaMaterial));
  const animeRect = () => {
    const {width, height} = stage.getBoundingClientRect();
    return pictureViewport(width, height);
  };
  // THE COLONY (animeColony): the film covering the stage (its content, without the file's black margins, as large as the stage's larger side
  // needs, centred) inside a disc from the page's dodecahedron's rim (centred 55 % across and halfway down, as warm-sphere.js draws it) to
  // past the stage's farthest corner, spread k of the way, its front a ring of gold; folding back the same way, dissolving into the
  // dodecahedron's own faces over the fold's last three tenths. The page's paper stays (no black), its sphere and front shown.
  function drawColony(reason) {
    const start = view.performance.now(), c = colonyAt(film.currentTime), bounds = stage.getBoundingClientRect();
    if (!c) return;
    const dpr = Math.min(view.devicePixelRatio || 1, 2, Math.sqrt(2.6e6 / Math.max(1, bounds.width * bounds.height)));
    const w = Math.max(1, Math.round(bounds.width * dpr)), h = Math.max(1, Math.round(bounds.height * dpr));
    const v = sphere.getViewState(), pic = colonyPicture(bounds.width, bounds.height);   // the whole picture inside the stage, as the lead-in fits it
    const cx = bounds.width * SPHERE_X, cy = bounds.height * 0.5, R = v.radius * Math.min(bounds.width, bounds.height), soft = Math.max(12, R * 0.12);
    const corner = Math.max(Math.hypot(cx, cy), Math.hypot(bounds.width - cx, cy), Math.hypot(cx, bounds.height - cy), Math.hypot(bounds.width - cx, bounds.height - cy));
    const r = R + (corner + soft - R) * c.spread, e = Math.max(0, Math.min(1, (c.gather - 0.7) / 0.3)), alpha = 1 - e * e * (3 - 2 * e);
    colonyMaterial.uniforms.uPic.value.set(pic.left * dpr, pic.top * dpr, pic.width * dpr, pic.height * dpr);
    colonyMaterial.uniforms.uMask.value.set(cx * dpr, cy * dpr, r * dpr, soft * dpr);
    colonyMaterial.uniforms.uSize.value.set(w, h);
    colonyMaterial.uniforms.uRing.value = 0.9; colonyMaterial.uniforms.uAlpha.value = alpha; colonyMaterial.uniforms.uFlash.value = c.flash;
    Object.assign(canvas.style, {left: '0px', top: '0px', width: `${bounds.width}px`, height: `${bounds.height}px`, opacity: '1'});
    if (canvas.width !== w || canvas.height !== h) renderer.setSize(w, h, false);
    renderer.setRenderTarget(null); renderer.setScissorTest(false); renderer.setViewport(0, 0, w, h);
    renderer.setClearColor(0x000000, 0); renderer.clear(true, true, true);
    renderer.autoClear = false; renderer.render(colonyScene, animeCamera); renderer.autoClear = true;
    rectR = 0; rectWhole = false; // another scene must place its own viewport when this span ends
    if (darkAt !== 0) { darkAt = 0; onDark?.(0); }
    canvas.hidden = false; canvas.dataset.shotLayers = 'anime'; canvas.dataset.guidedAsset = 'source';
    onFold?.(false); draws++;
    sphere.redraw?.();   // the page's bursting dodecahedron under the film and its swarm over it draw this frame too
    lastPose = `${v.yaw},${v.pitch},${v.radius}`;
    onDraw?.({t: film.currentTime, reason, draws, cpuMs: view.performance.now() - start, gpuMs: null,
      calls: 1, triangles: 2, w, h, flow: true, mode: 'anime-colony', colony: c, paused: film.paused, athena: false});
  }
  // THE CHARGE (animeCorona): the flames of his cosmos round the page's dodecahedron, centred on it (55 % across and halfway down, as
  // warm-sphere.js draws it) at its shell's reach (the cosmos's compression and opening, warm-cosmos.mjs, read off the page's view), the heat
  // and the flare of THE CHARGE's law; the page's paper stays, its sphere under the flames and its front over them
  function drawCorona(reason) {
    const start = view.performance.now(), c = chargeAt(film.currentTime), bounds = stage.getBoundingClientRect();
    if (!c) return;
    const dpr = Math.min(view.devicePixelRatio || 1, 2, Math.sqrt(2.6e6 / Math.max(1, bounds.width * bounds.height)));
    const w = Math.max(1, Math.round(bounds.width * dpr)), h = Math.max(1, Math.round(bounds.height * dpr));
    const v = sphere.getViewState(), b = v.body || {};
    const R = v.radius * Math.min(bounds.width, bounds.height) * (1 - .09 * (b.compression || 0) + .24 * (b.opening || 0) + .1 * (b.release || 0));
    coronaMaterial.uniforms.uSize.value.set(w, h);
    coronaMaterial.uniforms.uDisc.value.set(bounds.width * SPHERE_X * dpr, bounds.height * 0.5 * dpr, R * dpr);
    coronaMaterial.uniforms.uTime.value = film.currentTime; coronaMaterial.uniforms.uHeat.value = c.heat; coronaMaterial.uniforms.uPulse.value = c.pulse;
    const cx = bounds.width * SPHERE_X, cy = bounds.height * 0.5, corner = Math.max(Math.hypot(cx, cy), Math.hypot(bounds.width - cx, cy), Math.hypot(cx, bounds.height - cy), Math.hypot(bounds.width - cx, bounds.height - cy));
    coronaMaterial.uniforms.uTint.value.set(...c.tint); coronaMaterial.uniforms.uSwell.value = c.swell; coronaMaterial.uniforms.uReach.value = Math.max(1.2, corner / Math.max(1, R));
    Object.assign(canvas.style, {left: '0px', top: '0px', width: `${bounds.width}px`, height: `${bounds.height}px`, opacity: '1'});
    if (canvas.width !== w || canvas.height !== h) renderer.setSize(w, h, false);
    renderer.setRenderTarget(null); renderer.setScissorTest(false); renderer.setViewport(0, 0, w, h);
    renderer.setClearColor(0x000000, 0); renderer.clear(true, true, true);
    renderer.autoClear = false; renderer.render(coronaScene, animeCamera); renderer.autoClear = true;
    rectR = 0; rectWhole = false; // another scene must place its own viewport when this span ends
    if (darkAt !== 0) { darkAt = 0; onDark?.(0); }
    canvas.hidden = false; canvas.dataset.shotLayers = 'cosmos'; canvas.dataset.guidedAsset = 'source';
    onFold?.(false); draws++;
    sphere.redraw?.();   // the page's dodecahedron under the flames and its swarm over them draw this frame too
    lastPose = `${v.yaw},${v.pitch},${v.radius}`;
    onDraw?.({t: film.currentTime, reason, draws, cpuMs: view.performance.now() - start, gpuMs: null,
      calls: 1, triangles: 2, w, h, flow: true, mode: 'cosmos-charge', charge: c, paused: film.paused, athena: false});
  }
  function drawAnime(reason) {
    const start = view.performance.now(), bounds = stage.getBoundingClientRect(), whole = animeRect(), k = animeTail(film.currentTime) ? tailEase(film.currentTime) : 0;
    const dpr = Math.min(view.devicePixelRatio || 1, 2, Math.sqrt(2.6e6 / Math.max(1, bounds.width * bounds.height)));
    const w = Math.max(1, Math.round(bounds.width * dpr)), h = Math.max(1, Math.round(bounds.height * dpr));
    // THE TAIL (animeTail): the picture alone (FREEZE.picture's content, without the file's black margins) from the stage's whole down onto the
    // page's dodecahedron, centred on it (55 % across and halfway down the stage, as warm-sphere.js draws it) and as tall as its diameter, k of the
    // way (the tail's ease); it dissolves over the second half of the way (opaque until 0.35); the canvas round it clear, the page's black (onDark)
    // easing out over the page's paper and its dodecahedron under it
    const v = sphere.getViewState(), {width: FW, height: FH, content: [px, py, pw, ph]} = FREEZE.picture;
    let rect = whole, crop = [0, 0, 1, 1];
    if (k > 0) {
      const R = v.radius * Math.min(bounds.width, bounds.height), s = 1 + ((2 * R * FH / ph) / whole.height - 1) * k;
      const cx = whole.left + whole.width / 2 + (bounds.width * SPHERE_X - whole.left - whole.width / 2) * k, cy = whole.top + whole.height / 2 + (bounds.height * 0.5 - whole.top - whole.height / 2) * k;
      const W2 = whole.width * s, H2 = whole.height * s, L2 = cx - W2 / 2, T2 = cy - H2 / 2;
      rect = {left: L2 + W2 * px / FW, top: T2 + H2 * py / FH, width: W2 * pw / FW, height: H2 * ph / FH};
      crop = [px / FW, py / FH, pw / FW, ph / FH];
    }
    animeMaterial.uniforms.uCrop.value.set(...crop);
    const fade = k > 0.35 ? (k - 0.35) / 0.65 : 0, alpha = 1 - fade * fade * (3 - 2 * fade), dark = 1 - k;
    Object.assign(canvas.style, {left: '0px', top: '0px', width: `${bounds.width}px`, height: `${bounds.height}px`, opacity: '1'});
    if (canvas.width !== w || canvas.height !== h) renderer.setSize(w, h, false);
    renderer.setRenderTarget(null); renderer.setScissorTest(false); renderer.setViewport(0, 0, w, h);
    renderer.setClearColor(0x000000, k > 0 ? 0 : 1); renderer.clear(true, true, true);
    animeMaterial.uniforms.uAlpha.value = alpha;
    renderer.setViewport(rect.left * dpr, (bounds.height - rect.top - rect.height) * dpr, rect.width * dpr, rect.height * dpr);
    renderer.autoClear = false; renderer.render(animeScene, animeCamera); renderer.autoClear = true;
    renderer.setViewport(0, 0, w, h);
    rectR = 0; rectWhole = false; // another scene must place its own viewport when this span ends
    if (darkAt !== dark) { darkAt = dark; onDark?.(dark); }
    canvas.hidden = false; canvas.dataset.shotLayers = 'anime'; canvas.dataset.guidedAsset = 'source';
    onFold?.(k <= 0); draws++;
    if (k > 0) sphere.redraw?.();   // the page's dodecahedron under the tail draws this frame too
    lastPose = `${v.yaw},${v.pitch},${v.radius}`;
    onDraw?.({t: film.currentTime, reason, draws, cpuMs: view.performance.now() - start, gpuMs: null,
      calls: 1, triangles: 2, w, h, flow: k > 0, mode: k > 0 ? 'anime-tail' : 'anime', tail: k, paused: film.paused, athena: false});
  }

  // ---- the box ----
  const faces = buildAssemblySkin(0).pents;
  const H = Math.hypot(...faces[0].center), RHO = Math.hypot(...faces[0].verts[0].map((v, i) => v - faces[0].center[i]));   // 0.7947, 0.6071
  const box = new THREE.Group(), inner = new THREE.Group(), heaven = new THREE.Group(), upright = new THREE.Group();
  box.add(inner); scene.add(box); heaven.add(upright); scene.add(heaven);
  let guided = null;
  const shared = {uGuided: {value: film3}, uGuideOn: {value: 0}, uFilm: {value: film3}, uSquare: {value: square}, uCanvas: {value: new THREE.Vector3(0, 0, 1)}, uHeight: {value: 1},
    uK3d: {value: 0}, uLead: {value: 0}, uBloom: {value: 0}, uSeam: {value: 0}, uPass: {value: 0}, uBurn: {value: 0}, uHair: {value: 0.65}, uLight: {value: LIGHT.clone().normalize()},
    uPic: {value: new THREE.Vector4(0, 0, 1, 1)}, uCrop: {value: new THREE.Vector4(82 / 960, 4 / 540, 796 / 960, 532 / 540)},
    // THE FOLD and THE ONE PLANE (cubism.mjs planeUniforms): the faces' and her plane's window's
    uFold: {value: 0}, uDark: {value: 0}, uHerN: {value: new THREE.Vector3(0, 0, 1)}, uHerD: {value: 0}, uHerC: {value: new THREE.Vector3()},
    uHerAcross: {value: new THREE.Vector3(1, 0, 0)}, uHerUp: {value: new THREE.Vector3(0, 1, 0)}, uHerRho: {value: 1}, uHerJoin: {value: new THREE.Vector2()},
    uHerZoom: {value: 1}, uHerR: {value: 0}, uHerWall: {value: -1},
    uMattes: {value: film3}, uMatteFrame: {value: -1}, uMattesReady: {value: 0}};
  const panels = faces.map((f, i) => {
    const n = f.normal, across = new THREE.Vector3(n[2], 0, -n[0]).normalize(), N = new THREE.Vector3(...n), up = N.clone().cross(across);
    const C = new THREE.Vector3(...f.center), corners = f.verts.map(v => new THREE.Vector3(...v));
    const pts = [C, ...corners], pos = [], nor = [], dec = [], ea = [], eb = [];
    // the edges' inward normals in the face's plane
    const edges = corners.map((p, k) => { const q = corners[(k + 1) % 5], m = N.clone().cross(q.clone().sub(p)).normalize(); if (m.dot(C.clone().sub(p)) < 0) m.negate(); return {p, m}; });
    const put = (P) => {
      pos.push(P.x, P.y, P.z); nor.push(N.x, N.y, N.z);
      const r = P.clone().sub(C); dec.push(r.dot(across) / RHO, -r.dot(up) / RHO);
      const e = edges.map(({p, m}) => P.clone().sub(p).dot(m));
      ea.push(e[0], e[1], e[2], e[3]); eb.push(e[4]);
    };
    for (let k = 0; k < 5; k++) { put(pts[0]); put(pts[1 + k]); put(pts[1 + (k + 1) % 5]); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('decal', new THREE.Float32BufferAttribute(dec, 2)); g.setAttribute('edgeA', new THREE.Float32BufferAttribute(ea, 4));
    g.setAttribute('edgeB', new THREE.Float32BufferAttribute(eb, 1));
    const material = new THREE.ShaderMaterial({vertexShader: PANEL_VS, fragmentShader: PANEL_FS, side: THREE.DoubleSide,
      uniforms: {...shared, uFlat0: {value: new THREE.Vector3()}, uFlat1: {value: new THREE.Vector3()}, uGone: {value: 0}, uSeed: {value: i + 1}, uEdge: {value: new THREE.Vector3(1, 0.8, 0.4)}, uMode: {value: 0}, uHeld: {value: null}}});
    const mesh = new THREE.Mesh(g, material);
    mesh.matrixAutoUpdate = false; mesh.frustumCulled = false;
    box.add(mesh);
    return {mesh, C, across, up, N, corners, spin: new THREE.Vector3(hash(i * 5 + 1) - 0.5, hash(i * 5 + 2) - 0.5, hash(i * 5 + 3) - 0.5).normalize()};
  });
  // THE ONE PLANE: her plane's window, a quad over the whole canvas behind everything (6 box radii behind the sphere's centre: a fragment reads
  // her plane along its own eye ray, so the quad's depth changes nothing of the picture), depth-tested so her body and the folding faces stand
  // in front of it; it blends, so it is drawn after them, the first of the blended
  const window1 = new THREE.Group();
  const layerMeshes = LAYERS.map((name, i) => {
    const material = new THREE.ShaderMaterial({vertexShader: PLANE_VS, fragmentShader: PLANE_FS,
      uniforms: {...shared, uLayer: {value: i}}, transparent: true, depthTest: true, depthWrite: false,
      blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor});
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(120,120), material);
    mesh.name = name; mesh.position.z = -6 + i*0.05; mesh.renderOrder = -3+i;
    mesh.frustumCulled = false; window1.add(mesh); return mesh;
  });
  window1.visible = false; scene.add(window1);
  const matteTexture = new THREE.TextureLoader().load(new URL('./athena-layer-mattes.png?v=2',import.meta.url).href,
    tex => { tex.flipY = false; tex.colorSpace = THREE.NoColorSpace; tex.generateMipmaps = false;
      tex.minFilter = tex.magFilter = THREE.LinearFilter;
      shared.uMattes.value = tex; shared.uMattesReady.value = 1; ask(); }, undefined,
    error => console.warn('Athena layer mattes unavailable; keeping source picture',error));
  let layerView = 'all';

  await slice();
  // ---- light and the inner things: the column, its floor glow, the sparks, the wings of light ----
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1, 64, 12, true).translate(0, 0.5, 0),
    new THREE.ShaderMaterial({vertexShader: COLUMN_VS, fragmentShader: COLUMN_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: {uK: {value: 0}, uTop: {value: 0}, uT: {value: 0}}}));
  column.scale.set(1, 3.3, 1); column.renderOrder = 2; upright.add(column);
  // (its place on the floor is set once the floor's depth H is known, below)
  const glow = new THREE.Mesh(new THREE.CircleGeometry(0.75, 48).rotateX(-Math.PI / 2),
    new THREE.ShaderMaterial({vertexShader: UV_VS, fragmentShader: FLOOR_FS, transparent: true, depthWrite: false, uniforms: {uK: {value: 0}}}));
  glow.renderOrder = 1; inner.add(glow);
  column.position.y = -H; glow.position.y = -H + 0.004;
  const sparkUniforms = {uT: {value: 0}, uPx: {value: 1}};
  const sparkMaterial = new THREE.ShaderMaterial({vertexShader: SPARK_VS, fragmentShader: SPARK_FS, transparent: true, depthWrite: false, uniforms: sparkUniforms});
  const sparks = (parent, list) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(list.flatMap(s => s.at), 3));
    g.setAttribute('velocity', new THREE.Float32BufferAttribute(list.flatMap(s => s.v), 3));
    g.setAttribute('born', new THREE.Float32BufferAttribute(list.flatMap(s => [s.t, s.life, s.size]), 3));
    const points = new THREE.Points(g, sparkMaterial); points.frustumCulled = false; points.renderOrder = 4;
    parent.add(points);
    return points;
  };
  // the opening's sparks, out of the box's thirty edges as the burst goes off
  const edgeMids = [];
  faces.forEach(f => f.verts.forEach((p, k) => { const q = f.verts[(k + 1) % 5], m = p.map((v, i) => (v + q[i]) / 2); if (!edgeMids.some(e => Math.hypot(e[0] - m[0], e[1] - m[1], e[2] - m[2]) < 1e-6)) edgeMids.push(m); }));
  sparks(box, Array.from({length: 120}, (_, i) => {
    const m = edgeMids[i % edgeMids.length], l = Math.hypot(...m), sp = 0.8 + 1.6 * hash(i * 7 + 1);
    return {at: m, v: m.map((v, k) => v / l * sp + (hash(i * 7 + 2 + k) - 0.5) * 0.8), t: at.open + RAYS - 0.05 + 0.08 * hash(i * 7 + 5), life: 0.9 + 0.9 * hash(i * 7 + 6), size: 2.2 + 2.6 * hash(i * 7 + 9)};
  }));
  const lightWings = [1, -1].map(side => {
    const group = new THREE.Group(), feathers = [];
    const material = new THREE.ShaderMaterial({vertexShader: UV_VS, fragmentShader: FEATHER_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: {uK: {value: 0}}});
    for (let i = 0; i < 9; i++) {
      const L = 0.62 + 0.5 * Math.sin(Math.PI * (i + 0.5) / 9.5), pivot = new THREE.Group(), feather = new THREE.Mesh(new THREE.PlaneGeometry(0.17, L), material);
      feather.position.y = L / 2; feather.renderOrder = 3; pivot.add(feather); group.add(pivot); feathers.push(pivot);
    }
    return {group, material, side, set(k) {
      material.uniforms.uK.value = k;
      group.visible = k > 0.002;
      feathers.forEach((pivot, i) => { const u = i / 8; pivot.rotation.set(0, side * mix(0.1, 0.45, k), -side * mix(2.95 - 0.2 * u, 0.25 + 1.35 * u, Math.min(k, 1.06))); });
    }};
  });

  // ---- THE END OF IT's particles (unboxing-plan.mjs endBeat), made only when hero-ab.html's ?end=a|b gives at.end: the box's own picture as
  // dust as it burns away, the four knights' streams of cosmos gathering into the new box, and the darts (a hundred, and the faces' own trails)
  const cosmosUniforms = {uT: {value: 0}, uPx: sparkUniforms.uPx, uFilm: shared.uFilm, uSquare: shared.uSquare};
  const cosmosMaterial = new THREE.ShaderMaterial({vertexShader: COSMOS_VS, fragmentShader: COSMOS_FS, transparent: true, depthWrite: false, uniforms: cosmosUniforms});
  const cosmos = (n, fill) => {
    const a = {position: 3, ctrl: 3, to: 3, tint: 3, born: 4, decal: 3}, arrays = Object.fromEntries(Object.entries(a).map(([k, w]) => [k, new Float32Array(n * w)]));
    for (let i = 0; i < n; i++) { const q = fill(i); for (const [k, w] of Object.entries(a)) arrays[k].set(q[k] ?? (k === 'tint' ? [1, 0.86, 0.5] : [0, 0, 0, 0].slice(0, w)), i * w); }
    const g = new THREE.BufferGeometry();
    for (const [k, w] of Object.entries(a)) g.setAttribute(k, new THREE.BufferAttribute(arrays[k], w));
    const pts = new THREE.Points(g, cosmosMaterial); pts.frustumCulled = false; pts.renderOrder = 5; pts.visible = false; box.add(pts);
    return pts;
  };
  const V3 = (v) => [v.x, v.y, v.z];
  const endAt = at.end ?? null, ends = [];
  // where each knight's stream comes from, on the screen (the page's view space: x right, y up, z to the eye), aimed into the box's frame at
  // the box's takeover (aimStreams): Ikki from the left, Shun from the right, Hyoga from below on the left, Shiryu from below on the right
  const SIDES = [[-1, 0.25, 0.35], [1, 0.3, 0.35], [-0.75, -0.85, 0.45], [0.75, -0.85, 0.45]].map(v => new THREE.Vector3(...v).normalize());
  let streamPts = null;
  const STREAM_N = 500;
  if (endAt) {
    // the dust: 220 points on each face, its colour the film's there, leaving as the face burns away
    ends.push(cosmos(12 * 220, (n) => {
      const i = Math.floor(n / 220), f = panels[i], k = Math.floor(hash(n * 13 + 1) * 5), r1 = hash(n * 13 + 2), r2 = hash(n * 13 + 3);
      const [u, v] = r1 + r2 > 1 ? [1 - r1, 1 - r2] : [r1, r2];
      const P = f.C.clone().addScaledVector(f.corners[k].clone().sub(f.C), u).addScaledVector(f.corners[(k + 1) % 5].clone().sub(f.C), v), off = P.clone().sub(f.C);
      const h = hash(n * 13 + 4), swirl = f.across.clone().multiplyScalar((hash(n * 13 + 5) - 0.5) * 0.9).addScaledVector(f.up, (hash(n * 13 + 6) - 0.5) * 0.9);
      return {position: V3(P), ctrl: V3(P.clone().addScaledVector(f.N, 0.35).add(swirl.clone().multiplyScalar(0.5))), to: V3(P.clone().addScaledVector(f.N, 0.9 + 0.8 * h).add(swirl)),
        born: [endAt.dissolve + 0.06 * i + 1.5 * hash(n * 13 + 7), 1.1 + 0.9 * hash(n * 13 + 8), 2.6 + 2.8 * hash(n * 13 + 9), 1],
        decal: [off.dot(f.across) / RHO, -off.dot(f.up) / RHO, 1]};
    }));
    // the knights' streams: 500 points each, a ribbon to the rims of their three faces (unboxing-plan.mjs faceStream), from their side
    streamPts = cosmos(4 * STREAM_N, (n) => {
      const j = Math.floor(n / STREAM_N), m = n % STREAM_N, f = panels[3 * j + (m % 3)], k = Math.floor(hash(n * 17 + 1) * 5), u = hash(n * 17 + 2);
      const edge = f.corners[k].clone().lerp(f.corners[(k + 1) % 5], u).lerp(f.C, 0.06 + 0.1 * hash(n * 17 + 3));
      return {position: V3(edge.clone().multiplyScalar(6)), ctrl: V3(edge.clone().multiplyScalar(2.5)), to: V3(edge), tint: KNIGHTS_COSMOS[j].tint,
        born: [(endAt.streams?.[j] ?? endAt.dissolve) + 2.2 * m / STREAM_N + 0.1 * hash(n * 17 + 4), STREAM * (0.75 + 0.25 * hash(n * 17 + 5)), 5 + 4 * hash(n * 17 + 6), 0]};
    });
    ends.push(streamPts);
    // the darts: a hundred and forty, six points each (a streak), out from the box in every direction; and each face's own trail
    ends.push(cosmos(140 * 8 + 12 * 24, (n) => {
      if (n < 140 * 8) {
        const m = Math.floor(n / 8), j = n % 8, z = 2 * hash(m * 7 + 1) - 1, a = 2 * Math.PI * hash(m * 7 + 2), q = Math.sqrt(1 - z * z), dir = new THREE.Vector3(q * Math.cos(a), z, q * Math.sin(a));
        return {position: V3(dir.clone().multiplyScalar(0.25)), ctrl: V3(dir.clone().multiplyScalar(2.5)), to: V3(dir.clone().multiplyScalar(9)), tint: [1, 0.68, 0.16],
          born: [endAt.darts + 0.75 * hash(m * 7 + 3) + 0.014 * j, 0.55 + 0.25 * hash(m * 7 + 4), 8 - 0.7 * j, 1]};
      }
      const r = n - 140 * 8, i = Math.floor(r / 24), j = r % 24, f = panels[i];
      return {position: V3(f.C), ctrl: V3(f.C.clone().addScaledVector(f.N, 3)), to: V3(f.C.clone().addScaledVector(f.N, 10)), tint: [1, 0.72, 0.22],
        born: [endAt.darts + 0.035 * i + 0.018 * j, 0.8, 7 - 0.2 * j, 1]};
    }));
  }
  // the streams come from fixed sides of the screen: their start and bend, in the box's frame as it is turned when it takes over
  const aimStreams = (q) => {
    if (!streamPts) return;
    const inv = q.clone().invert(), g = streamPts.geometry, P = g.attributes.position, Cc = g.attributes.ctrl, T = g.attributes.to, to = new THREE.Vector3();
    const sides = SIDES.map(v => v.clone().applyQuaternion(inv));
    for (let n = 0; n < P.count; n++) {
      const j = Math.floor(n / STREAM_N), side = sides[j], h = hash(n * 19 + 1), wave = Math.sin(n * 0.05 + j) * 0.35;
      const across = new THREE.Vector3(-side.y, side.x, 0.3).normalize().multiplyScalar((hash(n * 19 + 2) - 0.5) * 0.45 + wave);
      to.fromBufferAttribute(T, n);
      P.setXYZ(n, ...V3(side.clone().multiplyScalar(5.2 + 0.3 * h).add(across)));
      Cc.setXYZ(n, ...V3(side.clone().multiplyScalar(2.0).add(across.clone().multiplyScalar(1.3)).addScaledVector(to, 0.3)));
    }
    P.needsUpdate = true; Cc.needsUpdate = true;
  };

  // ---- THE KNIGHTS IN THE FRAMES (unboxing-plan.mjs beat().knights): each knight's frame keeps his segment's last picture once it has
  // played. The picture is the same whatever came before (a seek, a first play): a hidden helper film seeks to each segment's last frame once,
  // in idle time after the load, its centre square is drawn into a 512 px canvas, and the helper is let go (no second decoder after that)
  const segments = at.segments ?? [], held = segments.map(() => {
    const c = doc.createElement('canvas'); c.width = c.height = 512;
    const tex = new THREE.CanvasTexture(c); tex.flipY = false;
    return {canvas: c, tex, ready: false};
  });
  const knightFace = segments.map(() => -1);   // the face each knight lights (chosen as he appears)
  const fillHeld = async () => {
    if (!held.length) return;
    state.held = {want: held.length, done: 0, error: null};
    const v = doc.createElement('video');
    v.muted = true; v.preload = 'auto'; v.playsInline = true; v.src = film.currentSrc || film.src;
    try {
      if (v.readyState < 2) await new Promise((ok, no) => { v.addEventListener('loadeddata', ok, {once: true}); v.addEventListener('error', () => no(new Error('the helper film did not load')), {once: true}); });
      for (const [k, g] of segments.entries()) {
        await slice();
        v.currentTime = Math.max(0, g.t1 - 0.05);   // his segment's last frame, a frame and a half before the cut
        await new Promise((ok) => v.addEventListener('seeked', ok, {once: true}));
        timed(`a knight's picture held (${k + 1})`, () => {
          const w = v.videoWidth, h = v.videoHeight, side = Math.min(w, h);
          held[k].canvas.getContext('2d').drawImage(v, (w - side) / 2, (h - side) / 2, side, side, 0, 0, 512, 512);
          held[k].tex.needsUpdate = true; renderer.initTexture(held[k].tex); held[k].ready = true;
        });
        state.held.done++;
      }
    } catch (error) { console.warn('unboxing: the knights\' pictures were not held', error); state.held.error = String(error?.message ?? error); }
    finally { v.removeAttribute('src'); v.load(); }
    onAssets?.(state); ask();
  };

  await slice();
  // ---- the cloth and Seiya: a GLB the lab lists, else a stand-in, each made in idle time (no stand-in is made for a kind that has a GLB) ----
  // seiyaSpot stands at his centre (so he shrinks about it), seiyaBody half his height below it, at his feet
  const clothSpot = new THREE.Group(), seiyaSpot = new THREE.Group(), seiyaBody = new THREE.Group(), piecesSpot = new THREE.Group();
  inner.add(clothSpot); inner.add(piecesSpot); upright.add(seiyaSpot); seiyaSpot.add(seiyaBody); seiyaBody.position.y = -SEIYA.height / 2;
  // the floor Seiya rises through (the world's, set at each draw) and the same in view space for the shaders: what is under it is not drawn.
  // In the shaders, not three's clipping planes: a program three compiles before its first frame (warm(), below) is then the one it draws with
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), floorView = {value: new THREE.Vector4(0, 1, 0, 1e6)};
  const auraMaterial = (clipped) => new THREE.ShaderMaterial({vertexShader: AURA_VS, fragmentShader: AURA_FS, transparent: true, depthWrite: false,
    depthFunc: THREE.LessEqualDepth, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4,
    uniforms: {uFill: {value: 0}, uRim: {value: 0}, uClip: {value: clipped ? 1 : 0}, uFloor: floorView}});
  // a figure dressed in light: every mesh of it drawn again over itself in an unlit gold (uFill all over, uRim at its silhouette)
  const aura = (holder, clipped) => {
    const material = auraMaterial(clipped);
    const meshes = []; holder.traverse(o => { if (o.isMesh) meshes.push(o); });
    for (const o of meshes) { const a = new THREE.Mesh(o.geometry, material); a.renderOrder = 2; o.add(a); }
    return material.uniforms;
  };
  const floorClip = (shader) => {
    shader.uniforms.uFloor = floorView;
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vFloorView;')
      .replace('#include <project_vertex>', '#include <project_vertex>\n\tvFloorView = mvPosition.xyz;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec4 uFloor;\nvarying vec3 vFloorView;')
      .replace('#include <clipping_planes_fragment>', 'if (dot(vec4(vFloorView, 1.0), uFloor) < 0.0) discard;\n\t#include <clipping_planes_fragment>');
  };
  const clip = (holder) => holder.traverse(o => { if (o.isMesh) for (const m of [o.material].flat()) { m.onBeforeCompile = floorClip; m.needsUpdate = true; } });
  // THE ANIME'S GOLD on the cloth (anime-gold.mjs: cels, a hard glint, ink at the silhouette, lit from the page's light), in place of the
  // polished metal under the studio's reflection that read as a trophy (his words, Oct 16 2026: "that awful cheap indian plasticky golden
  // statue"); the studio's environment still lights Seiya
  const polish = (holder) => dressInAnimeGold(holder, {light: LIGHT.toArray()});
  const state = {cloth: {lists: [], at: 'loading', error: null, tris: 0}, seiya: {lists: [], at: 'loading', error: null, tris: 0}};
  let cloth = null, seiya = null;   // what stands in each spot
  const triangles = (o) => { let n = 0; o.traverse(m => { if (m.isMesh) n += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; }); return Math.round(n); };
  let clothMade = 0;   // the cloth last asked for: a shatter still running for an older one is dropped
  const setCloth = async (made, label) => {
    const mine = ++clothMade;
    let holder, pieces = [];
    if (made.parts) {   // the stand-in: a whole one stands, a second one's parts are the pieces
      holder = made.root;
      pieces = standInCloth().parts.map(part => {
        const c = new THREE.Box3().setFromObject(part).getCenter(new THREE.Vector3()), piece = new THREE.Group();
        part.position.copy(c).negate(); piece.add(part);
        return {mesh: piece, home: c, h: c.y / CLOTH.height};
      });
    } else { holder = fitted(made, CLOTH); polish(holder); }
    clothSpot.clear(); piecesSpot.clear();
    clothSpot.add(holder);
    state.cloth.at = label; state.cloth.tris = triangles(holder);   // its own, before its aura is drawn over it
    cloth = {holder, pieces: [], aura: aura(holder, false)};
    onAssets?.(state); ask();
    // its pieces (they fly at 63.5 s): from the GLB in slices, in idle time
    if (!made.parts) {
      const t0 = performance.now();
      state.cloth.shattering = true;
      try { pieces = await shatter(holder, 14, slice); } catch (error) { console.warn('unboxing: the cloth stands whole (it did not break into pieces)', error); }
      performance.measure('unboxing:cloth shattered, in slices', {start: t0, end: performance.now()});
      if (mine === clothMade) state.cloth.shattering = false;
    }
    if (mine !== clothMade) return;
    pieces.forEach((p, i) => {
      p.mesh.visible = false;
      p.spin = new THREE.Vector3(hash(i * 3 + 1) - 0.5, hash(i * 3 + 2) - 0.5, hash(i * 3 + 3) - 0.5).normalize();
      p.dir = p.home.clone().setY(p.home.y - CLOTH.height * 0.5).normalize();
      piecesSpot.add(p.mesh);
    });
    cloth.pieces = pieces;
    targets(); ask();
  };
  const setSeiya = (made, label) => {
    seiyaBody.clear();
    const holder = made.wings ? made.root : fitted(made, SEIYA);
    holder.updateMatrixWorld(true);
    const points = surface(holder), tris = triangles(holder);
    clip(holder);
    seiyaBody.add(holder);
    lightWings.forEach(w => { w.group.position.set(w.side * 0.06, SEIYA.height * 0.74, -0.1); seiyaBody.add(w.group); });
    seiya = {holder, wings: made.wings ?? null, aura: aura(holder, true), points};
    state.seiya.at = label; state.seiya.tris = tris;
    targets(); onAssets?.(state); ask();
  };
  // where each piece lands on him (a point of his at its own height, low pieces first), and the sparks: the cloth's burst (in the inner frame,
  // on its axis), each landing and the wings' spreading (on him, so they go where he goes)
  let burstSparks = null, hisSparks = null, goneSparks = null;
  function targets() {
    if (!cloth || !seiya) return;
    const pts = seiya.points, mine = [], burst = [];
    cloth.pieces.forEach((p, i) => {
      const k = clamp(Math.round(clamp(p.h, 0, 1) * (pts.length - 1) + (hash(i * 11) - 0.5) * pts.length * 0.06), 0, pts.length - 1);
      p.target = pts[k]; p.land = 1.45 + 3.0 * clamp(p.h, 0, 1);
      for (let j = 0; j < 7; j++) mine.push({at: [p.target.x, p.target.y, p.target.z], v: [hash(i * 31 + j) - 0.5, hash(i * 31 + j + 9) * 0.6, hash(i * 31 + j + 17) - 0.5].map(v => v * 1.1),
        t: at.rise + PIECES + p.land, life: 0.5 + 0.4 * hash(i * 31 + j + 5), size: 2 + 2 * hash(i * 31 + j + 7)});
    });
    for (let j = 0; j < 80; j++) {
      const side = j % 2 ? 1 : -1;
      mine.push({at: [side * 0.1, SEIYA.height * 0.74, -0.1], v: [side * (0.6 + 1.4 * hash(j * 3)), 0.6 * (hash(j * 3 + 1) - 0.3), -0.3 * hash(j * 3 + 2)],
        t: at.rise + 8.0 + 0.4 * hash(j * 3 + 4), life: 0.8 + 0.6 * hash(j * 3 + 5), size: 2 + 2.5 * hash(j * 3 + 6)});
    }
    const c = [0, -H + beatAt(at.rise + PIECES).cloth.rise + CLOTH.height * 0.5, 0];
    for (let j = 0; j < 140; j++) burst.push({at: c, v: [hash(j * 5 + 1) - 0.5, hash(j * 5 + 2) - 0.35, hash(j * 5 + 3) - 0.5].map(v => v * 3.2),
      t: at.rise + PIECES + 0.03 * hash(j), life: 0.7 + 0.8 * hash(j * 5 + 4), size: 2.4 + 2.8 * hash(j * 5 + 6)});
    // and gone to a star: where his centre is as he vanishes
    const end = beatAt(at.rise + 9.95).seiya, star = [0, -H + end.y + SEIYA.height / 2 * Math.max(end.scale, 0.05), 0], gone = [];
    for (let j = 0; j < 90; j++) gone.push({at: star, v: [hash(j * 7 + 1) - 0.5, hash(j * 7 + 2) - 0.2, hash(j * 7 + 3) - 0.5].map(v => v * 2.4),
      t: at.rise + 9.8 + 0.2 * hash(j * 7 + 4), life: 0.6 + 0.7 * hash(j * 7 + 5), size: 2 + 2.6 * hash(j * 7 + 6)});
    for (const old of [burstSparks, hisSparks, goneSparks]) if (old) { old.parent?.remove(old); old.geometry.dispose(); }
    burstSparks = sparks(inner, burst); hisSparks = sparks(seiyaBody, mine); goneSparks = sparks(upright, gone);
  }
  // WARM: every texture the scene holds uploaded and every program it draws compiled (in parallel, off this thread) in idle time, so no first
  // frame (Athena's cut, the hand-over at the gold star, the cloth, Seiya) waits for either; again whenever a model comes in
  let warmed = Promise.resolve();
  const uploaded = new WeakSet(), sent = new WeakSet();
  const warm = () => (warmed = warmed.then(async () => {
    await slice();
    const textures = new Set();
    scene.traverse(o => { for (const m of [o.material ?? []].flat()) for (const v of Object.values(m)) if (v?.isTexture && v.image && !v.isRenderTargetTexture) textures.add(v); });
    for (const tex of textures) { if (!uploaded.has(tex)) { timed('a texture uploaded', () => renderer.initTexture(tex)); uploaded.add(tex); await slice(); } }
    // one object (with what hangs on it) a slice: three writes a program's source as it compiles it, a few ms a program
    const objects = [], seen = new Set();
    scene.traverse(o => { if ((o.isMesh || o.isPoints || o.isLine) && o.material) for (const m of [o.material].flat()) if (!sent.has(m) && !seen.has(m)) { seen.add(m); objects.push(o); } });
    const t0 = performance.now(), pending = [];
    for (const o of [...new Set(objects)]) { await slice(); pending.push(timed('a figure\'s programs sent to compile', () => renderer.compileAsync(o, camera, scene))); }
    for (const m of seen) sent.add(m);
    await Promise.all(pending);
    if (seen.size) performance.measure(`unboxing:programs compiled in parallel (${seen.size} materials)`, {start: t0, end: performance.now()});
    await prime();
  }).catch(error => console.warn('unboxing: warming up', error)));
  // PRIMED: each figure's look drawn once, a pixel of it, into the hidden canvas, a slice each: Metal makes the pipeline of a program and the
  // canvas's formats at its first draw. A stand-in of each (its geometry, its material, its skeleton) on a stage with the scene's lights and
  // environment, so the program is the one the scene draws with
  const primed = new Set(), stage3 = new THREE.Scene();
  stage3.add(sun.clone(), sky.clone());
  const prime = async () => {
    const looks = [];
    scene.traverse(o => {
      if (!(o.isMesh || o.isPoints) || !o.material) return;
      const all = athena && athena.meshes.includes(o) ? [passMaterials.normals, passMaterials.matte, athena.own[athena.meshes.indexOf(o)]] : [o.material];
      // only a look whose program has been compiled in parallel and awaited (sent): drawn before that, its first draw would compile it here, on
      // this thread (Athena's looks, cold: 62 to 74 ms, the Athena session's receipt on main 61538611); the next warm() primes the rest
      for (const m of all.flat()) { const key = `${o.geometry.uuid}|${m.uuid}`; if (sent.has(m) && !primed.has(key)) looks.push({o, m, key}); }
    });
    for (const {o, m, key} of looks) {
      await slice();
      if (shown()) return;   // the canvas is in use: these are made at their first draws, or by the next warm()
      if (primed.has(key)) continue;
      timed('a look primed', () => {
        const proxy = o.isSkinnedMesh ? new THREE.SkinnedMesh(o.geometry, m) : o.isPoints ? new THREE.Points(o.geometry, m) : new THREE.Mesh(o.geometry, m);
        if (o.isSkinnedMesh) proxy.bind(o.skeleton, o.bindMatrix);
        proxy.frustumCulled = false;
        stage3.environment = scene.environment; stage3.add(proxy);
        renderer.setScissorTest(true); renderer.setScissor(0, 0, 1, 1);
        renderer.render(stage3, camera);
        renderer.setScissorTest(false); stage3.remove(proxy);
      });
      primed.add(key);
    }
    if (!shown()) clear();
  };
  const cache = new Map(), loader = new GLTFLoader();
  const load = (url) => {
    if (!cache.has(url)) { const t0 = performance.now(); cache.set(url, loader.loadAsync(url).then(g => { performance.measure(`unboxing:glb ${url.split('/').pop()} (fetch and parse)`, {start: t0, end: performance.now()}); return g.scene; })); }
    return cache.get(url);
  };
  async function choose(kind, url) {
    const s = state[kind];
    if (!url) { await slice(); timed(`${kind} stand-in`, () => kind === 'cloth' ? setCloth(standInCloth(), 'stand-in') : setSeiya(standInSeiya(), 'stand-in')); s.error = null; return; }
    s.at = `loading ${url.split('/').pop()}`; onAssets?.(state);
    try {
      const sceneOf = (await load(url)).clone(true);
      await slice();
      timed(`${kind} fitted, auras`, () => kind === 'cloth' ? setCloth(sceneOf, url.split('/').pop()) : setSeiya(sceneOf, url.split('/').pop()));
      s.error = null;
    } catch (error) {
      console.warn(`unboxing: ${url} did not load`, error);
      s.error = `${url.split('/').pop()}: ${error?.message ?? error}`;
      await slice();
      kind === 'cloth' ? setCloth(standInCloth(), 'stand-in') : setSeiya(standInSeiya(), 'stand-in');
    }
    onAssets?.(state);
    warm();
  }
  // the models: read where the lab lists them, then each made in its own idle time (started once the box itself is set up, at the end)
  const loadModels = async () => {
    if (freezeSpace) {
      // The public film has the real animated Cloth and Seiya. Neither the
      // rejected TRELLIS statues nor the fallback mannequins belong over it.
      state.cloth.at = state.seiya.at = 'source-film';
      onAssets?.(state);
      await fillHeld();
      return;
    }
    const lists = await readAssets(new URL('./', import.meta.url));
    state.cloth.lists = lists.cloth; state.seiya.lists = lists.seiya; onAssets?.(state);
    const want = (kind) => pick[kind] ? new URL(pick[kind], new URL('./', import.meta.url)).href : lists[kind][0] ?? null;
    await choose('cloth', want('cloth'));
    await choose('seiya', want('seiya'));
    await warmed;
    await fillHeld();
  };

  // ---- ATHENA (athena-shot.mjs: placed from the record, braindance.json), the record's column of light and its flood ----
  // the arena (the record's metres) seen through the shot's camera from the page's eye: S x the camera's axes x (p - look)
  const arena = new THREE.Group(), athenaSpot = new THREE.Group(), herKeep = {};
  arena.matrixAutoUpdate = false; athenaSpot.matrixAutoUpdate = false; scene.add(arena, athenaSpot); arena.visible = false; athenaSpot.visible = false;
  // ATHENA'S CUBIST FIT (cubism.mjs): the face she joins cuts her, in her own shader (three's clipping is off on this renderer: a clipped
  // material would compile twice). Its five edges' planes pass through the eye, so in the camera's space each is its normal alone; inside the
  // face is behind all five. At load the planes are zero and cut nothing, so her looks are compiled and primed with this in them.
  const herCut = {value: Array.from({length: 5}, () => new THREE.Vector4())};
  const continuation = Object.fromEntries(Object.entries(shared).filter(([k]) => k.startsWith('uHer')));
  Object.assign(continuation, {uFitX: {value: new THREE.Vector3()}, uFitY: {value: new THREE.Vector3()},
    uContinuation: {value: 0}, uContinuationReveal: {value: 0}, uContinuationSize: {value: new THREE.Vector2(1,1)}, cameraMatrixWorld: {value: camera.matrixWorld}});
  let hair = null;
  // THE FILM'S LIGHT ON HER (cubism.mjs herLightUniforms: her luminance onto the drawn hair's, its tone on her hair-coloured parts, the gold at
  // her edge, from the bins measured off the film): the holders her lit looks share, set at each draw of hers
  const herLit = Object.fromEntries(Object.entries(herLightUniforms(0)).map(([k, x]) => [k, {value: Array.isArray(x) ? new THREE.Vector3(...x) : x}]));
  const herClip = (shader) => {
    patchContinuation(shader, continuation);
    shader.uniforms.uHerCut = herCut;
    // declared just before main(): MeshNormalMaterial's fragment shader has no #include <common> (the first cut of this failed to compile there)
    shader.vertexShader = shader.vertexShader.replace('void main() {', 'varying vec3 vHerView;\nvoid main() {')
      .replace('#include <project_vertex>', '#include <project_vertex>\n\tvHerView = mvPosition.xyz;');
    shader.fragmentShader = shader.fragmentShader.replace('void main() {', 'uniform vec4 uHerCut[5];\nvarying vec3 vHerView;\nvoid main() {')
      .replace('#include <clipping_planes_fragment>', 'if (uContinuation < 0.5 && dot(vHerView, uHerCut[0].xyz) < 0.0 && dot(vHerView, uHerCut[1].xyz) < 0.0 && dot(vHerView, uHerCut[2].xyz) < 0.0 && dot(vHerView, uHerCut[3].xyz) < 0.0 && dot(vHerView, uHerCut[4].xyz) < 0.0) discard;\n\t#include <clipping_planes_fragment>');
  };
  const herLook = (shader) => { herClip(shader); herLight(shader, herLit); };
  const beamMaterial = new THREE.ShaderMaterial({vertexShader: COLUMN_VS, fragmentShader: COLUMN_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: {uK: {value: 0}, uTop: {value: 1}, uT: {value: 0}}});
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 64, 12, true).translate(0, 0.5, 0), beamMaterial);
  beam.renderOrder = 2; beam.frustumCulled = false; arena.add(beam);
  // the flood: the film's frames go white from 37.4 s; on the page a bloom of that light round the fight's place, gone before any edge of the
  // canvas (uAt: the place in the canvas's 0..1, uReach: how far it reaches across the canvas's shorter side)
  const flood = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({transparent: true, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `uniform float uK, uReach; uniform vec2 uAt, uAspect; varying vec2 vUv;
      void main() {
        vec2 d = (vUv - uAt) * uAspect; vec2 e = min(vUv, 1.0 - vUv) * uAspect;
        float k = uK * (1.0 - smoothstep(0.1 * uReach, uReach, length(d))) * smoothstep(0.0, 0.22, min(e.x, e.y));
        gl_FragColor = vec4(mix(vec3(1.0, 0.86, 0.55), vec3(1.0, 0.98, 0.92), k), k);
      }`, uniforms: {uK: {value: 0}, uReach: {value: 1}, uAt: {value: new THREE.Vector2(0.5, 0.5)}, uAspect: {value: new THREE.Vector2(1, 1)}}}));
  flood.renderOrder = 9; flood.frustumCulled = false; scene.add(flood); flood.visible = false;
  state.athena = {at: 'loading', error: null, swing: null};
  // her three looks for THE CUTS' device: the asset's own, its normals, a flat gold matte (programs compiled at load, so a cut never waits)
  const passMaterials = {normals: new THREE.MeshNormalMaterial({side: THREE.DoubleSide}), matte: new THREE.MeshBasicMaterial({color: new THREE.Color().setRGB(0.83, 0.64, 0.29), side: THREE.DoubleSide})};
  fetch(new URL('./braindance.json', import.meta.url), {cache: 'no-store'}).then(r => r.ok ? r.json() : Promise.reject(new Error(`braindance.json ${r.status}`)))
    .then(async (record) => {
      bd = record;
      // The study does not match the source camera, silhouette or light yet. It must
      // never replace the film in the public journey (his Oct 15 continuity correction).
      if (nativeStudy) {
        const {createGuidedAthena} = await import('./film-guided-athena.js?v=stage-4');
        guided = createGuidedAthena({renderer, source: film3, record, onReady: () => ask()});
      }
      if (!her) { state.athena = {at: 'off', error: null, swing: null}; onAssets?.(state); return; }   // her figure is not on this page
      const asset = bd.entities?.athena?.asset;
      if (!asset) throw new Error('the record names no asset for her');
      const holder = await load(new URL(`./${asset}`, import.meta.url).href);
      const meshes = []; holder.traverse(o => { if (o.isMesh) { o.frustumCulled = false; meshes.push(o); } });
      athena = {holder, meshes, own: meshes.map(m => m.material)};
      athenaSpot.add(holder);
      hair = createHair({...hairOfModel(holder), count: 110, K: 24, width: 0.06, flutter: 0.08, extend: 1.1});
      hair.keepCap(meshes.find(m => m.isSkinnedMesh) ?? meshes[0]);
      athenaSpot.add(hair.object);
      Object.assign(hair.uniforms, herLit);
      hair.material.onBeforeCompile = shader => {
        patchContinuation(shader, continuation, {hair: true});
        Object.assign(shader.uniforms, herLit);
        shader.fragmentShader = shader.fragmentShader.replace('void main() {', HER_LIGHT_GLSL + '\nvoid main() {')
          .replace('gl_FragColor = vec4(c, uOpacity * continuationAlpha());', `
            vec3 normal = normalize(cross(normalize(vT), vec3(0.0, 0.0, 1.0)) + normalize(vView));
            vec3 linear = pow(c, vec3(2.2));
            c = pow(max(herFilmLit(linear, normal, normalize(vView)), vec3(0.0)), vec3(1.0 / 2.2));
            gl_FragColor = vec4(c, uOpacity * continuationAlpha());`);
      };
      // her cut, and on her lit looks the film's light (cubism.mjs herLight; her normals and her matte have no lights and keep their own),
      // compiled with her looks below with uHerFilm 0, so nothing compiles at her cut
      for (const m of [...athena.own, passMaterials.normals, passMaterials.matte]) { m.onBeforeCompile = herLook; m.transparent = true; m.depthWrite = false; m.needsUpdate = true; }
      // her three looks compiled in parallel, off this thread, one after another, each awaited; only then may they be primed (sent)
      const t0 = performance.now();
      for (const look of [passMaterials.normals, passMaterials.matte, null]) {
        await slice();
        meshes.forEach((m, i) => { m.material = look ?? athena.own[i]; });
        await renderer.compileAsync(athenaSpot, camera, scene);
      }
      for (const m of [...athena.own, passMaterials.normals, passMaterials.matte]) sent.add(m);
      performance.measure('unboxing:athena: her three looks compiled in parallel', {start: t0, end: performance.now()});
      state.athena.at = asset; onAssets?.(state);
      warm();
    })
    .catch((error) => { console.warn('unboxing: Athena is not on the page', error); state.athena = {at: 'none', error: String(error?.message ?? error), swing: null}; onAssets?.(state); });
  // she is on the page during the record's over-the-shoulder shots, and the canvas wakes half a second before so her cut lands on the film's frame
  // her shots from the alignment to the wall of light (cubism.mjs SHOTS: over her shoulder, her face, the column), on the film's own cuts
  const athenaAt = (t) => bd && athena ? presenceOf(t) : null;
  const athenaNear = (t) => Boolean(bd && athena && (presenceOf(t) || presenceOf(t + 0.5)));

  // ---- where the box stands on the page ----
  let W = 1, Hs = 1, rect = {left: 0, top: 0, width: 1, height: 1}, dpr = 1, rectR = 0, rectWhole = false;
  const measure = () => {
    const b = stage.getBoundingClientRect(); W = Math.max(1, b.width); Hs = Math.max(1, b.height);
    // THE MASK's picture on the stage, where the theater shows the film (its C: fit 0.92, the 1986 picture's 796 x 532 inside the file, centred)
    const FA = 796 / 532, h = Math.min(1, W / Hs / FA) * 0.92 * Hs;
    shared.uPic.value.set((W - h * FA) / 2, (Hs - h) / 2, h * FA, h);
  };
  // the canvas covers the box and what rises from it, and Athena where the record puts her (2.6 box radii each side, 3.0 above the centre,
  // 2.2 below), inside the stage, at the page's pixel ratio up to PX_CAP
  const place = (R, whole = false) => {
    rectR = R; rectWhole = whole;
    const cx = W * SPHERE_X, cy = Hs * 0.5;
    const left = whole ? 0 : clamp(cx - 2.6 * R, 0, W), top = whole ? 0 : clamp(cy - 3.0 * R, 0, Hs);
    const right = whole ? W : clamp(cx + 2.6 * R, 0, W), bottom = whole ? Hs : clamp(cy + 2.2 * R, 0, Hs);
    rect = {left, top, width: Math.max(1, right - left), height: Math.max(1, bottom - top)};
    Object.assign(canvas.style, {left: `${left}px`, top: `${top}px`, width: `${rect.width}px`, height: `${rect.height}px`});
    dpr = Math.min(view.devicePixelRatio || 1, 2);
    if (rect.width * rect.height * dpr * dpr > PX_CAP) dpr = Math.sqrt(PX_CAP / (rect.width * rect.height));
    const w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) renderer.setSize(w, h, false);
    shared.uCanvas.value.set(left, top, w / rect.width); shared.uHeight.value = h;
    sparkUniforms.uPx.value = w / rect.width;
  };
  // the page's projection (warm-sphere.js project(): x R 4 / (4 - z) from the centre, y up) as a camera for this canvas
  const project = (R) => {
    const cx = W * SPHERE_X - rect.left, cy = Hs * 0.5 - rect.top, n = athenaOn ? 0.05 : 0.4, f = 14;   // she stands half a box radius from the eye
    camera.projectionMatrix.set(
      2 * R * EYE / rect.width, 0, 1 - 2 * cx / rect.width, 0,
      0, 2 * R * EYE / rect.height, 2 * cy / rect.height - 1, 0,
      0, 0, -(f + n) / (f - n), -2 * f * n / (f - n),
      0, 0, -1, 0);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  };
  // a point of the box's view space on the stage, in css px (warm-sphere.js project())
  const onStage = (p, R) => { const k = R * EYE / (EYE - p.z); return [W * SPHERE_X + p.x * k, Hs * 0.5 - p.y * k]; };

  // ---- the box's turn: the page's sphere's, toward the presentation pose (floor down, leaning to the eye) ----
  const qOf = (yaw, pitch) => {
    const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().set(c, 0, -s, 0, -s * sp, cp, -c * sp, 0, s * cp, sp, c * cp, 0, 0, 0, 0, 1));
  };
  const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0);
  let cap = null;   // the page's sphere at the moment the box took over: its turn, its radius, the floor and the turn that sets it down
  const capture = (v) => {
    const floor = floorOf(faces, v.yaw, v.pitch), plan = lotus(faces, floor);
    const down = new THREE.Vector3(...rotate(faces[floor].normal, v.yaw, v.pitch));
    cap = {yaw: v.yaw, q0: qOf(v.yaw, v.pitch), align: new THREE.Quaternion().setFromUnitVectors(down, new THREE.Vector3(0, -1, 0)),
      R: v.radius * Math.min(W, Hs), plan, top: new THREE.Vector3(...faces[plan.top].normal)};
    inner.quaternion.setFromUnitVectors(Y, cap.top); upright.quaternion.copy(inner.quaternion);
    place(Math.max(cap.R, v.radius * Math.min(W, Hs)));
  };

  // ---- one draw ----
  const timer = gl.getExtension('EXT_disjoint_timer_query_webgl2'), queries = [];
  const readTimes = () => {
    while (queries.length && gl.getQueryParameter(queries[0], gl.QUERY_RESULT_AVAILABLE)) {
      const q = queries.shift();
      if (!gl.getParameter(timer.GPU_DISJOINT_EXT)) gpuMs = gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6;
      gl.deleteQuery(q);
    }
  };
  const T1 = new THREE.Matrix4(), T2 = new THREE.Matrix4(), RM = new THREE.Matrix4(), V = new THREE.Vector3(), Q = new THREE.Quaternion(), ZERO = new THREE.Vector3();
  const hinge = (out, p, axis, angle, lift) => {
    T1.makeTranslation(p[0] + lift.x, p[1] + lift.y, p[2] + lift.z); RM.makeRotationAxis(V.set(...axis), angle); T2.makeTranslation(-p[0], -p[1], -p[2]);
    return out.multiplyMatrices(T1, RM).multiply(T2);
  };
  // THE WORLDS AS FACES (unboxing-plan.mjs worlds): each face flies from its place in the box to one of the page's twelve worlds and rides it,
  // a small pentagon of film facing the eye and turning slowly, its world's dot off the page and its trail behind it; it flies back as the box
  // closes. Which world is whose is settled once, nearest first, and each world is followed from frame to frame by the nearest.
  let riding = null, followed = null;
  const WORLD_FACE = 0.17;   // box radii from a world-face's centre to its corners (the box's own faces: RHO, 0.607)
  // the page draws its far worlds before its skin and its near ones after, so inside its own frame (the box taking over there) the list is half
  // a frame: the twelve are taken only from a whole one, and a part only moves the ones it holds
  const follow = () => {
    const list = (worldsOf?.() ?? []).map(w => ({x: w.x, y: w.y, r: w.r}));
    if (!followed) return (followed = list.length >= 12 ? list : null);
    if (!list.length) return followed;
    const next = followed.map(() => null), used = new Set(), pairs = [];
    followed.forEach((a, i) => list.forEach((b, j) => pairs.push([Math.hypot(a.x - b.x, a.y - b.y), i, j])));
    pairs.sort((m, n) => m[0] - n[0]);
    for (const [, i, j] of pairs) if (!next[i] && !used.has(j)) { next[i] = list[j]; used.add(j); }
    return (followed = next.map((w, i) => w ?? followed[i]));
  };
  const centreOf = new THREE.Vector3(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), sa = new THREE.Vector3(), pa = new THREE.Vector3();
  function toWorlds(t, s, R) {
    if (!s.worlds.some(k => k > 0)) { if (riding) { riding = null; followed = null; hideWorlds?.(false); } return; }
    const list = follow();
    if (!list?.length) return;   // not a whole frame of worlds yet: the faces wait in the box
    if (!riding) {   // each face to the nearest free world, from where they are on the screen now
      const at = panels.map(p => onStage(p.C.clone().applyMatrix4(p.mesh.matrix).applyMatrix4(box.matrix), R)), pairs = [];
      at.forEach((f, i) => list.forEach((w, j) => pairs.push([Math.hypot(f[0] - w.x, f[1] - w.y), i, j])));
      pairs.sort((m, n) => m[0] - n[0]);
      riding = panels.map(() => -1); const used = new Set();
      for (const [, i, j] of pairs) if (riding[i] < 0 && !used.has(j)) { riding[i] = j; used.add(j); }
    }
    hideWorlds?.(s.worlds.reduce((m, k) => m + k, 0) / 12 > 0.6);
    const boxInv = box.matrix.clone().invert(), eye = new THREE.Vector3(0, 0, EYE);
    panels.forEach((p, i) => {
      const k = s.worlds[i], w = list[riding[i]];
      if (!(k > 0) || !w) return;
      // the world where the page draws it: its dot's radius is 1.8 x its perspective 4 / (4 - z)
      const z = clamp(4 - 4 / Math.max(0.3, w.r / 1.8), -2.5, 2.5);
      const P = new THREE.Vector3((w.x - W * SPHERE_X) * (EYE - z) / (EYE * R), -(w.y - Hs * 0.5) * (EYE - z) / (EYE * R), z);
      const toEye = eye.clone().sub(P).normalize(), n = p.N.clone();
      const qWorld = new THREE.Quaternion().setFromAxisAngle(toEye, 0.4 * t + 1.7 * i).multiply(new THREE.Quaternion().setFromUnitVectors(n, toEye));
      // in the box's frame: from its hinge place (centre, turn, size 1) to the world's (P, turned to the eye, WORLD_FACE / RHO)
      p.mesh.matrix.decompose(pa, qa, sa);
      const from = p.C.clone().applyMatrix4(p.mesh.matrix), to = P.clone().applyMatrix4(boxInv);
      qb.copy(box.quaternion).invert().multiply(qWorld);
      const e = k * k * (3 - 2 * k), size = mix(1, WORLD_FACE / RHO, e);
      centreOf.lerpVectors(from, to, e); qa.slerp(qb, e);
      p.mesh.matrix.compose(centreOf, qa, new THREE.Vector3(size, size, size)).multiply(new THREE.Matrix4().makeTranslation(-p.C.x, -p.C.y, -p.C.z));
    });
  }
  // the page's flat decal of each face where it now is (while the faces show the page's own look)
  function flatDecals(R) {
    for (const p of panels) {
      const mw = p.mesh.matrixWorld, c = p.C.clone().applyMatrix4(mw), m = onStage(c, R);
      const ax = onStage(p.C.clone().addScaledVector(p.across, RHO).applyMatrix4(mw), R), ay = onStage(p.C.clone().addScaledVector(p.up, -RHO).applyMatrix4(mw), R);
      const a = ax[0] - m[0], b = ay[0] - m[0], c2 = ax[1] - m[1], d = ay[1] - m[1], det = a * d - b * c2 || 1e-9;
      const i00 = d / det, i01 = -b / det, i10 = -c2 / det, i11 = a / det;
      p.mesh.material.uniforms.uFlat0.value.set(i00, i01, -(i00 * m[0] + i01 * m[1]));
      p.mesh.material.uniforms.uFlat1.value.set(i10, i11, -(i10 * m[0] + i11 * m[1]));
    }
  }
  // THE END OF IT (unboxing-plan.mjs endBeat): the box where the page's sphere is, as the page draws it, burning away into its own dust; the
  // knights' streams made into the new box, face by face, each face's burning edge in its knight's colour; the light from inside at the burn;
  // the faces flown out as darts at the second keyframe
  const EDGE_GOLD = [1, 0.8, 0.4], T3 = new THREE.Matrix4(), S3 = new THREE.Matrix4();
  function drawEnd(t, s, v, R) {
    box.quaternion.copy(qOf(v.yaw, v.pitch)); box.position.set(0, 0, 0); box.updateMatrix();
    inner.visible = false; heaven.visible = false;
    for (const e of ends) e.visible = true;
    panels.forEach((p, i) => {
      const u = p.mesh.material.uniforms, age = s.dart[i];
      u.uGone.value = age > 1 ? 1 : s.gone[i];
      u.uEdge.value.set(...(s.d > 1.8 ? KNIGHTS_COSMOS[faceStream(i)].tint : EDGE_GOLD));
      p.mesh.matrix.identity();
      if (age > 0) {   // out along its normal, faster and faster, turning, a little smaller
        const go = 8 * age * age + 1.5 * age, k = 1 - 0.4 * ss(0, 0.8, age);
        T3.makeTranslation(p.C.x + p.N.x * go, p.C.y + p.N.y * go, p.C.z + p.N.z * go);
        p.mesh.matrix.multiplyMatrices(T3, RM.makeRotationAxis(p.spin, 4 * age)).multiply(S3.makeScale(k, k, k)).multiply(T2.makeTranslation(-p.C.x, -p.C.y, -p.C.z));
      }
      p.mesh.matrixWorldNeedsUpdate = true;
    });
    box.updateMatrixWorld(true);
    flatDecals(R);
    shared.uK3d.value = 0; shared.uLead.value = s.lead; shared.uBloom.value = s.bloom; shared.uSeam.value = s.seam; shared.uPass.value = s.pass;
    shared.uBurn.value = s.burn;
    for (const p of panels) p.mesh.material.uniforms.uMode.value = 0;
    cosmosUniforms.uT.value = t;
  }
  // THE FOLD AS ONE WINDOW (his Oct 15 2026 00:44 WEST, over the lattice this drew: "this grid dude is all absolutely fucked up. you gotta do
  // differently. when does it stop being a dodecahedron mask??"; unboxing-plan.mjs foldBeat, cubism.mjs oneCells, hexFold, ONE and
  // planeUniforms): the box at the page's pose of her cut; every face turns and slides onto her own face, its corners on hers, the nearest
  // first, a window onto the one picture in her plane, all down by 30.2 s (the origami closed onto one pentagon); from 30.2 to 30.5 s her
  // plane's window sweeps out from her hair's join past that pentagon and its leading melts; from 30.5 s to the wall no face is drawn (her
  // window alone, the box's group off: no draw of theirs at all); from her wall of light they come back out of her plane into the sphere
  let folded = null, foldNow = false;   // {root, cells, from, to, join, geom}: settled once at the take-over, for the whole span (one plane); whether this draw folds
  // the angle (his 19:34 WEST, over the box seat's first pictures, her window seen at a steep angle on the face turned to the right: "why would
  // you use this angle? the dodecahedron has 12 faces dude omg..."): no face of the twelve stands square to the eye at every turn of the page
  // (the most square is up to 37 degrees off), so as the faces come her face turns to the eye, square by the time they have landed, and the
  // lattice lies flat facing him; she turns with it, so her fit on it holds; as they go the box turns back to the page's own pose of that
  // frame (unboxing-plan.mjs foldSpin), so the sphere is whole where the page's own stands when it is handed back
  const spinAt = (t, live) => foldSpin(beatAt(t), folded.from, folded.to, live);
  // her window's reach and zoom (cubism.mjs planeWindowGeometry), the zoom held to the film's own resolution: its picture no taller than 0.9 of
  // the stage, about its 532 rows here, so the film stays sharp and her window hangs in the black (his 19:1x) instead of a blur over the stage
  const windowOf = (plane, join) => {
    const geom = planeWindowGeometry(plane, join, [W * SPHERE_X, Hs * 0.5], cap.R, W, Hs), tall = 2 * plane.rho * cap.R * EYE / (EYE - H);
    return {...geom, zFull: Math.max(1, Math.min(geom.zFull, 0.9 * Hs / tall))};
  };
  // her plane is chosen once, at the take-over, from the page's pose (chooseFace, as her fit chose it), and so are the faces' cells (oneCells:
  // every face onto her own face, the nearest first, microseconds, never searched again) and her hair's join (her one placement, the shoulder
  // shot's fit: nothing refits her per shot)
  const settleFold = (v) => {
    const from = {yaw: v.yaw, pitch: v.pitch}, root = chooseFace(faces, from), to = squareTo(faces[root].normal), plane = herPlane(faces[root], to);
    const join = [...HEAD_MARK]; // the film's measured cranium, shared with her native registration
    folded = {root, cells: timed('the fold\'s cells', () => oneCells(faces, root)), from, to, join, geom: windowOf(plane, join)};
    herKeep.face = root; herKeep.spin = to;
  };
  function drawFold(t, s, v, R) {
    const spin = spinAt(t, v);
    box.quaternion.copy(qOf(spin.yaw, spin.pitch)); box.position.set(0, 0, 0); box.updateMatrix();
    inner.visible = false; heaven.visible = false;
    for (const e of ends) e.visible = false;
    // from 30.5 s to the wall of light no face is drawn (unboxing-plan.mjs foldBeat s.faces): the box's whole group is off, so not one draw of
    // its faces (nor of the opening's sparks it carries) is made; only her window and, on ?her=on, her figure
    const drawn = s.faces !== false;
    box.visible = drawn && layerView === 'all';
    if (drawn) {
      const {poses} = hexFold(faces, folded.root, t, folded.cells);
      panels.forEach((p, i) => {
        p.mesh.visible = true; p.mesh.matrix.set(...poses[i]); p.mesh.matrixWorldNeedsUpdate = true;
        p.mesh.material.uniforms.uMode.value = 0; p.mesh.material.uniforms.uGone.value = 0;
      });
    } else for (const p of panels) p.mesh.visible = false;
    box.updateMatrixWorld(true);
    if (drawn && s.k3d < 1) flatDecals(R);
    const u = planeUniforms(herPlane(faces[folded.root], spin), folded.geom, t);
    shared.uHerN.value.set(...u.uHerN); shared.uHerD.value = u.uHerD; shared.uHerC.value.set(...u.uHerC); shared.uHerAcross.value.set(...u.uHerAcross);
    shared.uHerUp.value.set(...u.uHerUp); shared.uHerRho.value = u.uHerRho; shared.uHerJoin.value.set(...u.uHerJoin); shared.uHerZoom.value = u.uHerZoom;
    shared.uHerR.value = u.uHerR; shared.uHerWall.value = u.uHerWall;
    shared.uK3d.value = s.k3d; shared.uLead.value = s.lead * 0.12; shared.uBloom.value = 0; shared.uSeam.value = 0; shared.uPass.value = 0; shared.uBurn.value = 0;
    // The source cut starts ONE projection immediately. Crossfading twelve
    // repeated complete pictures into it caused the doubled head and rectangle.
    shared.uFold.value = t < PORTAL.aiolos ? 1 : s.look; shared.uDark.value = s.dark;
    shared.uMatteFrame.value = matteFrame(t);
    layerMeshes.forEach(mesh => { mesh.visible = layerView === 'all' || mesh.name === layerView; });
    canvas.dataset.shotLayers = shared.uMattesReady.value ? 'athena-hair,fighters,terrain' : 'loading';
    window1.visible = u.uHerR > 0;
  }
  // each face's mode (unboxing.js PANEL_FS uMode): the film laid on it, an empty frame, its knight's picture, or a window onto the film. A knight
  // lights the unlit face riding the nearest world (the largest) as he appears; a seek back before him frees it
  function faceModes(t, s) {
    (s.knights ?? []).forEach((kn, k) => {
      if (!kn.lit) { knightFace[k] = -1; return; }
      if (knightFace[k] >= 0) return;
      let best = -1, size = -1;
      panels.forEach((_, i) => {
        if (knightFace.includes(i)) return;
        const r = riding && followed ? followed[riding[i]]?.r ?? 0 : 0;
        if (r > size) { size = r; best = i; }
      });
      knightFace[k] = best;
    });
    panels.forEach((p, i) => {
      const k = knightFace.indexOf(i), kn = k >= 0 ? s.knights[k] : null, u = p.mesh.material.uniforms;
      let mode = s.empty ? 1 : 0;
      if (kn?.lit) mode = kn.live ? 0 : held[k]?.ready ? 2 : 1;
      if (s.mask && !(at.knightsStay && kn?.lit)) mode = 3;
      u.uMode.value = mode; u.uHeld.value = k >= 0 && held[k]?.ready ? held[k].tex : null;
    });
  }
  // the box (when it is out) at second t, with the page's sphere as it is (v)
  function drawBox(t, s, v, R) {
    // the turn: the page's, toward the presentation pose, which keeps turning with the page's yaw
    const qLive = qOf(v.yaw, v.pitch);
    const qPres = new THREE.Quaternion().setFromAxisAngle(X, TILT).multiply(Q.setFromAxisAngle(Y, v.yaw - cap.yaw)).multiply(cap.align).multiply(cap.q0);
    box.quaternion.slerpQuaternions(qLive, qPres, s.pres);
    box.position.set(0, -DROP * s.pres, 0);
    heaven.quaternion.copy(qPres); heaven.position.set(0, -DROP, 0);
    // where the eye is from the box's floor (the inner frame: y up the box's axis): the lid goes away from it, the figures face it
    const qInner = box.quaternion.clone().multiply(inner.quaternion), toEye = new THREE.Vector3(0, 0, 1).applyQuaternion(qInner.clone().invert());
    const face = Math.atan2(toEye.x, toEye.z), level = new THREE.Vector3(toEye.x, 0, toEye.z).normalize();
    const faceUp = Math.atan2(...(() => { const e = new THREE.Vector3(0, 0, 1).applyQuaternion(qPres.clone().multiply(upright.quaternion).invert()); return [e.x, e.z]; })());
    // the hinges: the floor's petals on the floor; the lid (the top and its petals) up, back from the eye and leaning its face to it
    const lidAt = cap.top.clone().multiplyScalar(H), lidGo = new THREE.Vector3(0, LID.up, 0).addScaledVector(level, -LID.back).multiplyScalar(s.lid).applyQuaternion(inner.quaternion);
    const lean = new THREE.Vector3(0, 1, 0).cross(level).normalize().applyQuaternion(inner.quaternion);
    const lid = new THREE.Matrix4().makeTranslation(lidAt.x + lidGo.x, lidAt.y + lidGo.y, lidAt.z + lidGo.z)
      .multiply(new THREE.Matrix4().makeRotationAxis(lean, LID.lean * s.lid)).multiply(new THREE.Matrix4().makeTranslation(-lidAt.x, -lidAt.y, -lidAt.z));
    panels.forEach(p => p.mesh.matrix.identity());
    cap.plan.lower.forEach((h, k) => hinge(panels[h.i].mesh.matrix, h.p, h.axis, LOWER * s.lower[k], ZERO));
    cap.plan.upper.forEach((h, k) => { const m = panels[h.i].mesh.matrix; hinge(m, h.p, h.axis, UPPER * s.upper[k], ZERO); m.premultiply(lid); });
    panels[cap.plan.top].mesh.matrix.copy(lid);
    box.updateMatrix();
    toWorlds(t, s, R);
    for (const p of panels) p.mesh.matrixWorldNeedsUpdate = true;
    box.updateMatrixWorld(true); heaven.updateMatrixWorld(true);
    if (s.k3d < 1) flatDecals(R);
    for (const p of panels) p.mesh.material.uniforms.uGone.value = 0;
    inner.visible = true; for (const e of ends) e.visible = false; shared.uBurn.value = 0;
    shared.uK3d.value = s.k3d; shared.uLead.value = s.lead; shared.uBloom.value = s.bloom; shared.uSeam.value = s.seam; shared.uPass.value = s.pass;
    faceModes(t, s);
    // the cloth: on the floor, turning; then up into the light, and in pieces
    const c = s.cloth;
    clothSpot.visible = c.show;
    clothSpot.position.set(0, -H + c.rise, 0); clothSpot.rotation.set(0, face - 0.6 + c.spin, 0);
    if (cloth) { cloth.aura.uFill.value = 0.55 * c.glow * c.glow + 0.35 * c.glint; cloth.aura.uRim.value = 0.25 + 0.6 * c.glow + 0.5 * c.glint; }
    // Seiya (in heaven: the presentation pose whatever the box does, so the shut box can turn home under him), facing the eye, at his centre
    const z = s.seiya, size = Math.max(z.scale, 1e-3);
    seiyaSpot.visible = z.show;
    seiyaSpot.position.set(0, -H + z.y + SEIYA.height / 2 * size, 0); seiyaSpot.rotation.set(0, faceUp + z.sway, 0); seiyaSpot.scale.setScalar(size);
    seiyaSpot.updateMatrix(); seiyaBody.updateMatrix();
    const onHim = seiyaSpot.matrix.clone().multiply(seiyaBody.matrix);   // his fitted frame in the upright one (= the inner one while the box is open)
    if (seiya) {
      seiya.aura.uFill.value = 0.88 * z.glow * z.glow;
      seiya.aura.uRim.value = 0.3 + 0.7 * z.glow;
      seiya.wings?.forEach(w => w.spread(Math.min(z.wings, 1.04)));
      lightWings.forEach(w => w.set(seiya.wings ? 0.55 * z.wings : z.wings));
    }
    // the floor he rises through, in the world: the presentation's, so it never cuts him once the box turns home
    upright.updateMatrixWorld(true);
    const floorAt = new THREE.Vector3(0, -H, 0).applyMatrix4(upright.matrixWorld), up = new THREE.Vector3(0, 1, 0).transformDirection(upright.matrixWorld);
    floorPlane.setFromNormalAndCoplanarPoint(up, floorAt.addScaledVector(up, -0.002));
    const fv = floorPlane.clone().applyMatrix4(camera.matrixWorldInverse); floorView.value.set(fv.normal.x, fv.normal.y, fv.normal.z, fv.constant);
    // the pieces: out with the burst, then each onto him, low ones first, shrinking into him as it lands
    if (cloth) {
      const age = c.pieces, then = beatAt(at.rise + PIECES).cloth, turn = new THREE.Quaternion().setFromAxisAngle(Y, face - 0.6 + then.spin);
      const base = new THREE.Vector3(0, -H + then.rise, 0);
      for (const p of cloth.pieces) {
        const live = age >= 0 && age < p.land;
        p.mesh.visible = live;
        if (!live) continue;
        const start = p.home.clone().applyQuaternion(turn).add(base), dir = p.dir.clone().applyQuaternion(turn);
        const thrown = start.addScaledVector(dir, 0.55 * (1 - Math.exp(-age / 0.22)));
        const goal = p.target.clone().applyMatrix4(onHim);
        const u = ss(0.6, p.land, age), bend = thrown.clone().lerp(goal, 0.5).add(new THREE.Vector3(0, 0.35 * (1 - p.h), 0));
        p.mesh.position.copy(age < 0.6 ? thrown : thrown.clone().multiplyScalar((1 - u) ** 2).addScaledVector(bend, 2 * u * (1 - u)).addScaledVector(goal, u * u));
        p.mesh.quaternion.setFromAxisAngle(p.spin, age * (5 - 3.5 * u)).multiply(turn);
        p.mesh.scale.setScalar(1 - 0.75 * u * u);
      }
    }
    // the light
    column.material.uniforms.uK.value = s.column;
    column.material.uniforms.uTop.value = s.columnTop; column.material.uniforms.uT.value = t;
    column.visible = s.column > 0.002;
    const lit = Math.max(s.column, 0.7 * s.seam + 0.6 * s.bloom);   // the floor glows with the light inside as the box opens, and under the column
    glow.visible = lit > 0.002; glow.material.uniforms.uK.value = lit;
  }
  // Athena (and the record's column and flood) at second t, through the shot's camera
  function drawAthena(t, R) {
    const presence = athenaAt(t), foldOn = foldNow;
    arena.visible = Boolean(presence); flood.visible = false; athenaSpot.visible = Boolean(presence);
    if (!presence) return false;
    const stageBox = {left: -W * SPHERE_X, right: W * 0.45, top: -Hs * 0.5, bottom: Hs * 0.5};
    const key = `${presence.start}|${Math.round(R)}|${Math.round(W)}|${Math.round(Hs)}|${shotAt(bd, t)?.name}`;
    if (key !== placedKey) {
      placed = placeAthena(bd, t, {eye: EYE, R, stage: stageBox}); placedKey = key;
      state.athena.swing = placed && {shot: placed.shot, metres: placed.swing.map(v => +v.toFixed(2)), sigmas: +placed.sigmas.toFixed(2), fits: placed.fits};
      onAssets?.(state);
    }
    // ATHENA'S CUBIST FIT (cubism.mjs): her shot's fitted pose on the face she joins (picked at the shot's cut), turning with the sphere; the
    // face's edges cut her (herClip), so inside it the film's picture of her and outside it her body in 3D
    // in THE FOLD: one plane and one placement through the whole span (his 19:19 WEST: "why the fuck are you trying to brusteforce into place
    // a 3D model"): the face the fold settled, the shoulder shot's fit on it, turning with the box (cubism.mjs herAt onePlane; hidden in her face
    // shot, where the window shows her own face), lit by the film's own light (cubism.mjs herLight, the measured bins)
    let on;
    if (foldOn) {
      herKeep.face = folded.root; herKeep.spin = spinAt(t, sphere.getViewState());
      on = herAt(t, faces, herKeep.spin, herKeep, undefined, {onePlane: true});
      if (on) {
        const fit = folded.registered ??= registeredFit(faces, folded.root, bd);
        on.matrix = fit.matrix;
        continuation.uFitX.value.set(...fit.uvX); continuation.uFitY.value.set(...fit.uvY);
      }
    }
    else on = herAt(t, faces, sphere.getViewState(), herKeep);
    continuation.uContinuation.value = foldOn ? 1 : 0;
    continuation.uContinuationReveal.value = continuationAt(t);
    continuation.uContinuationSize.value.set(canvas.width, canvas.height);
    const L = herLightUniforms(t);
    for (const k in L) { if (herLit[k].value?.isVector3) herLit[k].value.set(...L[k]); else herLit[k].value = L[k]; }
    if (!foldOn) herLit.uHerFilm.value = 0;
    if (!on) { arena.visible = false; athenaSpot.visible = false; return false; }
    athenaSpot.matrix.set(...on.matrix); athenaSpot.matrixWorldNeedsUpdate = true;
    on.planes.forEach((q, i) => herCut.value[i].set(q[0], q[1], q[2], 0));
    // the record's arena (its column of light) where the shot looks at the fight
    if (placed) {
      const {frame, unit: s} = placed, r = frame.right, u = frame.up, b = frame.back, L = frame.L;
      const dotL = (a) => a[0] * L[0] + a[1] * L[1] + a[2] * L[2];
      arena.matrix.set(s * r[0], s * r[1], s * r[2], -s * dotL(r), s * u[0], s * u[1], s * u[2], -s * dotL(u), s * b[0], s * b[1], s * b[2], -s * dotL(b), 0, 0, 0, 1);
      arena.matrixWorldNeedsUpdate = true;
    } else arena.visible = false;
    // THE CUTS' device on her cut: her normals, then a flat gold matte, then her own picture
    const pass = foldOn ? 0 : passAt(t - presence.start);
    athena.meshes.forEach((m, i) => { m.material = pass === 1 ? passMaterials.normals : pass === 2 ? passMaterials.matte : athena.own[i]; });
    if (hair) { hair.update(t, {flowFrame: screenFlowFrame(on.matrix)}); hair.uniforms.uPass.value = pass; }
    canvas.dataset.continuation = foldOn ? 'registered-native' : 'face-native';
    // the record's column of light out of the fight's ground, as wide as the record says at t; past the camera's reach it is the flood
    const col = foldOn ? null : columnOnPage(bd, t, EYE);   // in THE FOLD the window shows the film's own column
    beam.visible = Boolean(col);
    if (col) {
      const radius = Math.min(col.metres / 2, 12);
      beam.position.set(...bd.light.column.base.mu); beam.scale.set(radius, bd.light.column.top?.mu?.[1] ?? 60, radius);
      beamMaterial.uniforms.uK.value = 1; beamMaterial.uniforms.uT.value = t;
      flood.visible = false;   // her wall of light (THE FOLD's, or the theater's burst) closes the scene from Aiolos: the record's flood is out
    }
    return true;
  }
  function draw(reason) {
    syncFreeze();
    if (freeze?.active) {
      const start = view.performance.now();
      freeze.draw(); draws++;
      onFold?.(true);
      onDraw?.({t: film.currentTime, reason: `mint-freeze:${reason}`, draws, cpuMs: view.performance.now() - start, gpuMs: null,
        calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, w: canvas.width, h: canvas.height,
        flow: freeze.needsFrame, mode: 'opus-liquor', paused: film.paused, athena: false});
      return;
    }
    if (animeLeadIn(film.currentTime) || animeTail(film.currentTime)) { drawAnime(reason); return; }
    if (animeColony(film.currentTime)) { drawColony(reason); return; }
    if (animeCorona(film.currentTime)) { drawCorona(reason); return; }
    // Fullscreen anime clears opaque. The returning masks are an alpha overlay
    // on the page again, including when the freeze saved the anime pass's state.
    renderer.setClearColor(0x000000, 0);
    const t0 = view.performance.now(), t = film.currentTime || 0, s = beatAt(t), boxOut = out && cap && s.out;
    const v = sphere.getViewState(), Rlive = v.radius * Math.min(W, Hs), foldOn = Boolean(boxOut && s.fold && folded);
    const R = foldOn ? cap.R : boxOut ? mix(Rlive, cap.R, s.pres) : Rlive;
    const whole = Boolean(boxOut && (s.end || s.fold));   // the end's darts fly over the whole stage, and her plane's window covers it
    if (Math.abs(R - rectR) > 0.06 * rectR || whole !== rectWhole) place(R, whole);
    project(R);
    box.visible = Boolean(boxOut); heaven.visible = Boolean(boxOut); arena.visible = false; athenaSpot.visible = false; beam.visible = false; flood.visible = false;
    window1.visible = false; shared.uFold.value = 0;
    const picture = foldOn && guided ? guided.frame(t) : film3;
    shared.uGuided.value = picture; shared.uGuideOn.value = picture === film3 ? 0 : 1;
    canvas.dataset.guidedAsset = picture === film3 ? 'source' : 'athena.hades.glb';
    if (picture !== film3 && guided.lastCost) canvas.dataset.guidedCost = JSON.stringify(guided.lastCost);
    if (!foldOn) for (const p of panels) p.mesh.visible = true;
    if (boxOut) (foldOn ? drawFold : s.end ? drawEnd : drawBox)(t, s, v, R);
    // THE FOLD's dark: the page behind gone black edge to edge (the page's own layer, hero-ab.html), set only when it changes
    const dark = foldOn ? s.dark : 0;
    if (dark !== darkAt) { darkAt = dark; onDark?.(dark); }
    foldNow = foldOn;
    const her = athenaOn && layerView === 'all' && drawAthena(t, R);
    if (!boxOut && !her) { arena.visible = false; athenaSpot.visible = false; flood.visible = false; clear(); lastPose = `${v.yaw},${v.pitch},${v.radius}`; return; }
    sparkUniforms.uT.value = t;
    // the fade over the page's own skin at the end (only the box is on this canvas then; with Athena on it the box hands back at once)
    const fade = boxOut && !her ? s.fade : 1;
    if (fade !== shownAt) { shownAt = fade; canvas.style.opacity = fade >= 1 ? '' : fade.toFixed(3); }
    const q = timer ? gl.createQuery() : null;
    if (timer) { readTimes(); gl.beginQuery(timer.TIME_ELAPSED_EXT, q); }
    renderer.render(scene, camera);
    onFold?.(foldOn); // only after this renderer has painted the replacement
    if (timer) { gl.endQuery(timer.TIME_ELAPSED_EXT); queries.push(q); }
    draws++;
    lastPose = `${v.yaw},${v.pitch},${v.radius}`;
    const ms = view.performance.now() - t0;
    if (ms > 12) performance.measure(`unboxing:a draw of ${ms.toFixed(0)} ms at ${t.toFixed(2)} s (${reason})`, {start: t0, end: t0 + ms});   // a first frame that waited
    onDraw?.({t, reason, draws, cpuMs: ms, gpuMs, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
      w: canvas.width, h: canvas.height, flow: s.flow, mode: s.mode, paused: film.paused, athena: her});
  }

  // ---- causes ----
  const hasCallback = typeof film.requestVideoFrameCallback === 'function';
  // screen frames: while the box moves fast, and in Athena's cut (its passes) and the record's column (36.6 to 38 s)
  const fast = (t) => !animeLeadIn(t) && (beatAt(t).flow || Boolean(athenaOn && bd && (columnWidthAt(bd, t) > 0 || (athenaAt(t) && t - athenaAt(t).start < 0.3))));
  const onFrame = (now) => { callback = 0; if (!shown()) return; upload(); draw('film'); drawnAt = now; chain(); };
  function chain() { if (shown() && !film.paused && hasCallback && !callback) callback = film.requestVideoFrameCallback(onFrame); keepFlowing(); }
  function keepFlowing() { if (shown() && !film.paused && !flowing && fast(film.currentTime)) flowing = view.requestAnimationFrame(flow); }
  function flow(now) {
    flowing = 0;
    if (!shown() || film.paused) return;
    if (now - drawnAt >= 12 && !(gpuMs > 8)) { draw('screen'); drawnAt = now; }
    keepFlowing();
  }
  const stop = () => {
    if (callback) { film.cancelVideoFrameCallback(callback); callback = 0; }
    if (flowing) { view.cancelAnimationFrame(flowing); flowing = 0; }
  };
  function ask() { if (!asked && shown()) { asked = true; view.requestAnimationFrame(() => { asked = false; if (shown()) { if (copied !== film.currentTime) upload(); draw('asked'); } }); } }
  const clear = () => { renderer.setClearColor(0x000000, 0); renderer.clear(true, true, true); };
  const sleep = () => {
    stop();
    if (freeze?.active) { canvas.hidden = false; ask(); return; }
    clear(); canvas.hidden = true; canvas.style.opacity = ''; shownAt = 1; riding = null; followed = null; hideWorlds?.(false);
  };
  const takeOver = (v) => {
    capture(v);
    const s = beatAt(film.currentTime);
    if (s.end) aimStreams(qOf(v.yaw, v.pitch));
    if (s.fold) settleFold(v); else folded = null;
    out = true; canvas.hidden = false; upload(); draw('hand-over'); chain();
  };
  const handBack = () => {
    onFold?.(false);
    out = false; cap = null; folded = null; riding = null; followed = null; knightFace.fill(-1); hideWorlds?.(false);
    if (darkAt) { darkAt = 0; onDark?.(0); }
    if (shown()) ask(); else sleep();
    onDraw?.({t:film.currentTime, reason:'source-return', draws, mode:0,
      calls:0, triangles:0, paused:film.paused, athena:false});
  };
  // Athena comes on (or goes) on the film's frames: the canvas wakes half a second before her cut and draws her from the cut's frame on
  const athenaSync = (t) => {
    const want = enabled && athenaNear(t);
    if (want === athenaOn) return;
    athenaOn = want;
    if (athenaOn) { canvas.hidden = false; placedKey = ''; upload(); ask(); chain(); }
    else if (!out) sleep();
    else ask();
  };
  // This is a view of the existing paywall state, never a second gate. Pausing elsewhere, a receipt notification, or merely seeing the
  // choice cannot enter it. A seek must finish decoding the held frame before the frame becomes the navigable scene.
  const atMintHold = () => Boolean(!destroyed && enabled && film.paused && !film.seeking && film.readyState >= 2
    && Math.floor(film.currentTime * 30000 / 1001 + 1e-6) === HOLD_FRAME
    && view.dlTwelve?.state?.().cinematic?.active === true);
  function saveFreezeSurface() {
    freezeRestore = {
      attributes: [...canvas.attributes].map(({name, value}) => [name, value]),
      size: renderer.getSize(new THREE.Vector2()), pixelRatio: renderer.getPixelRatio(),
      clearColor: renderer.getClearColor(new THREE.Color()), clearAlpha: renderer.getClearAlpha(),
      viewport: renderer.getViewport(new THREE.Vector4()), scissor: renderer.getScissor(new THREE.Vector4()),
      scissorTest: renderer.getScissorTest(), target: renderer.getRenderTarget(),
      toneMapping: renderer.toneMapping, exposure: renderer.toneMappingExposure, outputColorSpace: renderer.outputColorSpace,
      autoClear: renderer.autoClear,
    };
  }
  function restoreFreezeSurface() {
    const saved = freezeRestore;
    freezeRestore = null;
    if (!saved) return;
    const names = new Set(saved.attributes.map(([name]) => name));
    for (const {name} of [...canvas.attributes]) if (!names.has(name)) canvas.removeAttribute(name);
    for (const [name, value] of saved.attributes) canvas.setAttribute(name, value);
    renderer.setPixelRatio(saved.pixelRatio); renderer.setSize(saved.size.x, saved.size.y, false);
    renderer.setClearColor(saved.clearColor, saved.clearAlpha); renderer.setRenderTarget(saved.target);
    renderer.setViewport(saved.viewport); renderer.setScissor(saved.scissor); renderer.setScissorTest(saved.scissorTest);
    renderer.toneMapping = saved.toneMapping; renderer.toneMappingExposure = saved.exposure;
    renderer.outputColorSpace = saved.outputColorSpace; renderer.autoClear = saved.autoClear;
    // The next ordinary draw must recompute its own viewport even if its radius did not change during the hold.
    rectR = 0; rectWhole = false; placedKey = ''; measure();
    canvas.hidden = !(out || athenaOn);
  }
  function syncFreeze() {
    if (!freeze || freezeChanging) return;
    const held = atMintHold();
    if (held === freezeHeld) return;
    freezeHeld = held; freezeChanging = true;
    try {
      if (held) saveFreezeSurface();
      freeze.setHeld(held);
      if (held) stage.dataset.mintScene = 'liquor';
      else delete stage.dataset.mintScene;
      if (held && freeze.active) {
        stop(); canvas.hidden = false;
        const dark = 1;
        if (dark !== darkAt) { darkAt = dark; onDark?.(dark); }
        view.dlTwelve?.wakeLiquor?.();
      }
      if (!held) restoreFreezeSurface();
    } finally { freezeChanging = false; }
  }
  // Invert the very same film-to-plane mapping as PLANE_FS. Coordinates describe the complete 960 x 540 source frame, including its
  // pillarboxes; using a fresh centered rectangle here would visibly move the image when the hold becomes spatial.
  function freezePictureRect() {
    if (freezeSpace) return animeRect();
    if (!folded || !cap) return null;
    const spin = spinAt(film.currentTime, sphere.getViewState());
    const u = planeUniforms(herPlane(faces[folded.root], spin), folded.geom, film.currentTime);
    const pixel = (x, y) => {
      const px = u.uHerJoin[0] + ((x - 480) / 270 - u.uHerJoin[0]) * u.uHerZoom;
      const py = u.uHerJoin[1] + (y / 270 - 1 - u.uHerJoin[1]) * u.uHerZoom;
      return onStage(new THREE.Vector3(...u.uHerC)
        .addScaledVector(new THREE.Vector3(...u.uHerAcross), px * u.uHerRho)
        .addScaledVector(new THREE.Vector3(...u.uHerUp), -py * u.uHerRho), cap.R);
    };
    const corners = [[0, 0], [960, 0], [960, 540], [0, 540]].map(([x, y]) => pixel(x, y));
    const xs = corners.map(p => p[0]), ys = corners.map(p => p[1]);
    const left = Math.min(...xs), top = Math.min(...ys);
    return {left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top, corners};
  }
  const onPlay = () => { syncFreeze(); ask(); chain(); };
  const onPause = () => { stop(); syncFreeze(); ask(); };
  const onSeeking = () => { syncFreeze(); ask(); };
  const onSeeked = () => { syncFreeze(); if (shown()) { upload(); ask(); } };
  film.addEventListener('play', onPlay); film.addEventListener('pause', onPause);
  film.addEventListener('seeking', onSeeking); film.addEventListener('seeked', onSeeked);
  // The wall hides its choice before playback resumes. The observer runs at that task's microtask checkpoint, before another paint;
  // play/seeking handlers and every draw also check the authoritative state, so a navigation frame cannot survive an opened gate.
  const choice = doc.querySelector('#dl-paywall-choice');
  const freezeWatch = freezeSpace && choice ? new view.MutationObserver(() => { syncFreeze(); ask(); }) : null;
  freezeWatch?.observe(choice, {attributes: true, attributeFilter: ['hidden', 'data-stage']});
  const resized = new view.ResizeObserver(() => {
    measure(); placedKey = '';
    if (folded) folded.geom = windowOf(herPlane(faces[folded.root], folded.to), folded.join);
    if (freeze?.active) { freeze.resize(); ask(); }
    else if (shown()) { place(rectR || cap?.R || 1); ask(); }
  });
  resized.observe(stage);
  measure();
  canvas.hidden = true;
  loadModels();
  // THE TWELVE DONORS' GLASS (mint-liquor-scene.mjs; the law: app/mint-chairs.mjs): the twelve chairs through the seven days, their top donors
  // in gold (mintChairs, the Worker's ranking, read at the load and at a cause); the $WARM swarm's genesis once the days have closed, on his
  // launch day's window (dl-paywall.js mintState) read at this load and again at each answer of the chairs' reader: never a timer at rest.
  const genesisDue = () => chairForm(mintState(Date.now()).phase) === 'swarm';
  const makeGlass = (form, statue = () => null) => import('./mint-liquor-scene.mjs?v=opus-liquor-4').then(({createMintLiquorScene}) => createMintLiquorScene({renderer, canvas, film, stage,
    getEntryPose, form, statue: statue(),
    isAlive: () => !destroyed,
    onChange: () => { if (!destroyed && !freezeChanging) { syncFreeze(); ask(); view.dlTwelve?.wakeLiquor?.(); } },
  }));
  // THE GENESIS: the glass becomes the $WARM swarm where it stands. The swarm's glass grows out of this one's pose (from the clear seed,
  // CLEAR_AT, so only the growth plays) with its statue and the supply and chairs this one last took; this one is let go. The proof's fixture
  // (mint-opus-liquor.proof.mjs) makes the same call.
  function genesis() {
    if (!freezeSpace || destroyed) return Promise.resolve(false);
    return genesisJob ??= (async () => {
      const was = freeze;
      if (!was || was.state().form === 'swarm') return false;
      const next = await makeGlass('swarm', () => was.statueAsset());
      if (destroyed || freeze !== was) { next.dispose(); return false; }
      const held = was.active, at = Math.min(was.state().entry, CLEAR_AT), pose = was.pose(), {supply, seats, level} = was.handover();
      freezeChanging = true;
      try {
        freeze = next; was.dispose();
        next.setSupply(supply); next.setSeats(seats);
        if (held) next.setHeld(true, {pose, at, level});
      } finally { freezeChanging = false; }
      ask(); view.dlTwelve?.wakeLiquor?.();
      return true;
    })().catch(error => { if (!destroyed) console.warn('mint-liquor: the swarm could not grow; the twelve chairs stay', error); return false; })
      .finally(() => { genesisJob = null; });
  }
  if (freezeSpace) {
    void makeGlass(genesisDue() ? 'swarm' : 'chairs').then(instance => {
      if (destroyed) { instance.dispose(); return; }
      freeze = instance;
      stopSupply = mintSupply?.listen(value => freeze?.setSupply(value)) ?? null;
      stopChairs = mintChairs?.listen(value => { freeze?.setSeats(value); if (genesisDue()) void genesis(); }) ?? null;
      syncFreeze(); ask();
    }).catch(error => { if (!destroyed) console.warn('mint-liquor: the flash remains in place because its glass could not load', error); });
  }

  return {
    renderer, scene, state,
    get out() { return out; },
    get athena() { return athenaOn; },
    get freeze() { return freeze; },
    /** THE GENESIS (mint-chairs.mjs chairForm): the twelve chairs become the $WARM swarm where they stand; called when the seven days have closed */
    genesis,
    get draws() { return draws; },
    /** THE WORLDS AS FACES, for a reader: which world each face rides (-1: none) and the worlds followed */
    get riding() { return riding && {faces: [...riding], worlds: (followed ?? []).length}; },
    /** whether the box is (or should be) on the page at second t, given the box is enabled */
    wants: (t) => enabled && beatAt(t).out,
    /** near the box's window: the hush must be on to take over or hand back on the page's frame */
    near: (t) => enabled && (beatAt(t).out || (t >= at.open - 0.6 && t < at.open) || Boolean(at.end && t >= at.end.dissolve - 0.6 && t < at.end.dissolve) ||
      Boolean(at.fold && t >= at.fold.start - 0.6 && t < at.fold.start)),
    /** the film flow is on (the box and Athena may come out) or not (A, C, B held): off hands back at the page's next frame */
    setEnabled(value) { enabled = Boolean(value); syncFreeze(); },
    /**
     * THE HAND-OVER, asked by orbit-kick.js as the page begins to draw its skin, inside the page's draw: takes over (draws the box at the
     * page's own pose of this frame) or hands back, and answers 0, 1 or 2 (see orbit-kick.js THE HUSH).
     */
    skin() {
      syncFreeze();
      if (freeze?.active) return beatAt(film.currentTime).mode;
      const t = film.currentTime, s = beatAt(t), want = enabled && s.out;
      // out, and a seek between THE FOLD and the box's own window: taken over again at this frame's pose
      if (want && (!out || Boolean(s.fold) !== Boolean(folded))) takeOver(sphere.getViewState());
      else if (!want && out) handBack();
      else if (out && film.paused) {   // a paused film, a sphere turned by hand: the box follows it in the page's frame
        const v = sphere.getViewState(), pose = `${v.yaw},${v.pitch},${v.radius}`;
        // in THE FOLD the box holds her one plane and reads the page's pose only on the way back into the sphere: no draw for the page's turn
        if (pose !== lastPose && (!s.fold || s.back > 0)) draw('page');
      }
      return out ? s.mode : 0;
    },
    /** at each of the page's causes (timeupdate, seeked, play, pause): the page draws a frame when the box must come out or go back;
     *  Athena comes and goes by herself */
    sync(t) { syncFreeze(); if (this.wants(t) !== out) sphere.redraw(); athenaSync(t); if (shown() && !film.paused) chain(); },
    choose,
    ask,
    layers(name = 'all') { layerView = LAYERS.includes(name) ? name : 'all'; ask(); },
    destroy() {
      matteTexture.dispose(); hair?.dispose?.(); destroyed = true; syncFreeze(); stopSupply?.(); void mintSupply?.destroy(); stopChairs?.(); mintChairs?.destroy?.(); freeze?.dispose(); freeze = null; freezeWatch?.disconnect(); onFold?.(false);
      delete stage.dataset.mintScene;
      out = false; athenaOn = false; sleep(); film.removeEventListener('play', onPlay); film.removeEventListener('pause', onPause);
      film.removeEventListener('seeking', onSeeking); film.removeEventListener('seeked', onSeeked);
      resized.disconnect(); guided?.dispose(); renderer.dispose();
      animeGeometry.dispose(); animeMaterial.dispose(); colonyMaterial.dispose(); coronaMaterial.dispose();
    },
  };
}

// The environment the gold reflects: a warm room, dark below, with a key light up and to the left toward the eye (the sphere's own light),
// a rim behind, a strip on the far side and a bar overhead. Rendered once into a prefiltered map of 64 px a face: the gold's roughness (0.12 at
// the least, polish() below; Seiya's roughness map times 0.45 is 0.135 at the least) never reads a sharper level (three's roughnessToMip:
// mip = -2 log2(1.16 r), 6 = 64 px from r = 0.108). Its programs are compiled first, in parallel and off this thread (KHR_parallel_shader_compile),
// as the prefiltering draws them (into a target): the studio's own, the generator's backdrop and its two filters, a blur and the GGX convolution,
// whose 256-sample loop is about 400 ms of a cold compile on a Mac's Metal, all of it in one task when the generator compiles it as it draws.
// Then each is drawn once into a pixel of the targets the generator draws into, a slice each (Metal makes a pipeline for a program and a
// target's formats at its first draw: 56 ms of the prefiltering's task, cold, without these). Measured by unboxing.proof.mjs --load.
async function studio(renderer, size = 64) {
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(8, 48, 24), new THREE.ShaderMaterial({side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 vDir; void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `varying vec3 vDir; void main() {
      float y = vDir.y; vec3 low = vec3(0.07, 0.05, 0.035), horizon = vec3(0.78, 0.7, 0.58), high = vec3(1.15, 1.1, 1.02);
      gl_FragColor = vec4(y < 0.0 ? mix(horizon * 0.5, low, smoothstep(0.0, 0.45, -y)) : mix(horizon, high, smoothstep(0.0, 0.8, y)), 1.0); }`})));
  const panel = (w, h, at, k) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({color: new THREE.Color(k, k * 0.96, k * 0.88), side: THREE.DoubleSide}));
    m.position.set(...at); m.lookAt(0, 0, 0); scene.add(m);
  };
  panel(3.2, 2.2, [-2.4, 4.6, 4.2], 9);
  panel(1.2, 4.2, [5.6, 1.4, -3.0], 5);
  panel(1.0, 3.2, [-6.0, 0.4, -1.8], 2.6);
  panel(5.0, 0.5, [0.4, 6.4, -1.2], 3.5);
  const pmrem = new THREE.PMREMGenerator(renderer), eye = new THREE.PerspectiveCamera(90, 1, 0.1, 100);
  const backdrop = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({side: THREE.BackSide}));   // as the generator's own backdrop
  // the targets it draws into: half floats, its cube map with a depth buffer, its ping-pong without
  const deep = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType}), flat = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType, depthBuffer: false});
  const draws = [[scene, deep], [backdrop, deep]];
  // the generator's filters for a size are made by its _allocateTargets (three r185's PMREMGenerator), and fromScene keeps them for that size;
  // with another three they are left to it (compiled as it draws)
  let made = null;
  if (typeof pmrem._setSize === 'function' && typeof pmrem._allocateTargets === 'function') {
    pmrem._setSize(size); made = pmrem._allocateTargets();
    const plane = pmrem._lodMeshes?.[0]?.geometry;
    if (plane) for (const filter of [pmrem._blurMaterial, pmrem._ggxMaterial]) if (filter) { const m = new THREE.Mesh(plane, filter); draws.push([m, flat], [m, deep]); }
  }
  const t0 = performance.now(), was = renderer.getRenderTarget(), pending = [];
  for (const o of new Set(draws.map(d => d[0]))) {
    await slice();
    timed('studio, a program sent to compile', () => { renderer.setRenderTarget(deep); pending.push(renderer.compileAsync(o, eye)); renderer.setRenderTarget(was); });
  }
  await Promise.all(pending);
  performance.measure('unboxing:studio, its programs compiled in parallel', {start: t0, end: performance.now()});
  for (const [o, into] of draws) {
    await slice();
    timed('studio, a pipeline made', () => { renderer.setRenderTarget(into); renderer.render(o, eye); renderer.setRenderTarget(was); });
  }
  made?.dispose(); deep.dispose(); flat.dispose(); backdrop.geometry.dispose(); backdrop.material.dispose();
  await slice();
  return timed('studio, prefiltered once', () => { const env = pmrem.fromScene(scene, 0.025, 0.1, 100, {size}).texture; pmrem.dispose(); return env; });
}
