// unboxing-plan.mjs: THE UNBOXING's choreography and the box's hinges, pure functions of the film's second and of the page's own
// dodecahedron (no three.js, no page): what unboxing.js draws and hero-ab.html drives. His words and the moments are in unboxing.js's header.
// `at` is {open, rise, back}: the first time the golden Sagittarius appears in the sky (his word and his pick, 42.34 s: the cut to Athena's
// mountain with the gold star already in the stormy sky), his conversion tag (61.767 s at rev 1), and the page's end card (warm-sphere.js
// SEIYA_MOMENTS.credits, 145.598 s since THE CUT), where the box closes only if his conversion tag does not fall while it is open; otherwise it closes on the
// gold cloth going onto Seiya (his word). A seek, a pause, a loop land on the same picture as a first play.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const ss = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
// the integral of ss(a, b, .) up to x: an angle whose rate grows by a smoothstep turns on without a jump
export const ssInt = (a, b, x) => {
  if (!(x > a)) return 0;
  if (x >= b) return (b - a) / 2 + (x - b);
  const k = (x - a) / (b - a);
  return (b - a) * (k ** 3 - k ** 4 / 2);
};
// a struck spring that starts still and settles at one, the first swing about an eighth past it
export const spring = (x, tau = 0.38, w = 3.95) => x <= 0 ? 0 : 1 - Math.exp(-x / tau) * (Math.cos(w * x) + Math.sin(w * x) / (w * tau));

export const PIECES = 1.75; // seconds after his conversion tag when the cloth bursts onto Seiya (the film: 63.5 s)
export const RAYS = 1.16;   // seconds after the opening when the film's star bursts into rays (43.5 s): the box's flash
export const CLOSE = 5.2;   // seconds after his conversion tag when the box begins to close round him (66.97 s), his legs already dressed
export const SHUT = 2.7;    // seconds after it begins to close when it is shut (69.67 s, the armor on; the wings spread at 70.0 s)
export const END = 5.3;     // seconds after it begins to close when the sphere has its skin back (72.27 s)

/**
 * Everything the box does at the film's second t. a, r: seconds since the opening and since his conversion tag; c: since the box began to
 * close (on the armor when his tag falls while it is open, else under the end card, `at.back`).
 * out: the box is on the page (its skin hushed); mode: what the page's skin does this frame (0 its own, 1 drawn under the fading box,
 * 2 hushed); flow: something moves fast enough to draw on the screen's frames; fade: the box's opacity (it fades over the page's own skin at
 * the end); pres: how far toward its presentation pose (the floor down, leaning toward the eye); k3d: the faces' pictures from the page's
 * flat decal (0) to their own 3D faces (1); lead: hairline (0) to gold leading (1); lid: how far the top has gone (up, back and leaning to
 * the eye: a halo of film behind what stands in the box); lower, upper: how far each petal has opened (a spring, so a little past 1 for a
 * moment); seam: the light through its seams before it opens (the beginning of the opening, seen); bloom: its flash with the film's rays.
 */
export function beat(t, at) {
  if (at.fold && t >= at.fold.start && t < at.fold.back) return foldBeat(t, at.fold);
  const a = t - at.open, risen = at.rise > at.open + 4 && at.rise + CLOSE + END < at.back;   // his conversion tag falls while it is open
  const r = risen ? t - at.rise : -Infinity, c = risen ? r - CLOSE : t - at.back;
  const out = Number.isFinite(t) && a >= 0 && c < END;
  if (!out) return at.end && t >= at.end.dissolve && t < at.end.back ? endBeat(t, at.end) : {out: false, mode: 0, flow: false};
  const fade = 1 - ss(4.85, 5.25, c);
  // the opening, slowly from the gold star to the gold centaur (his pick, 15:5x WEST: "Star to centaur, slowly"; `full` the seconds between):
  // the seams light up first (the box still the page's sphere), the film's star bursts into rays and the box flashes with it, it turns its
  // floor down, the lid breaks away and goes up and back through the rays and the sun, the petals open one after the other and are open
  // only as the centaur appears; the close: the floor's petals fold up first, the lid's fold as it comes back down over the top, then the
  // shut box turns back to the page's sphere and fades over it
  const full = Number.isFinite(at.centaur) && at.centaur > at.open + 3 ? at.centaur - at.open : 7.7;
  const box = {
    pres: ss(0.3, 0.45 * full, a) * (1 - ss(SHUT, SHUT + 2, c)),
    k3d: ss(0.25, 0.9, a) * (1 - ss(4.0, 4.6, c)),
    lead: ss(0.2, 1.6, a) * (1 - ss(3.0, 4.6, c)),
    lid: ss(RAYS - 0.2, full - 0.6, a) * (1 - ss(0.8, SHUT, c)),
    lower: [0, 1, 2, 3, 4].map(k => ss(RAYS + 0.3 + 0.35 * k, full - 0.3 + 0.06 * k, a) * (1 - ss(0.04 * k, 2.4 + 0.04 * k, c))),
    upper: [0, 1, 2, 3, 4].map(k => ss(RAYS + 0.8 + 0.3 * k, full - 0.1 + 0.05 * k, a) * (1 - ss(0.8 + 0.04 * k, 2.55 + 0.03 * k, c))),
    seam: ss(0, 0.5, a) * (1 - ss(RAYS + 0.4, 0.5 * full, a)),
    bloom: a < 3 ? ss(RAYS - 0.2, RAYS, a) * (1 - ss(RAYS, RAYS + 0.9, a)) : 0,
  };
  // THE WORLDS AS FACES (his words, 15:4x WEST: "when it starts inquadrating other knights... the pentagons faces here start being anchored to
  // the lyssajudrean satellites orbiring", "i mean each pentagon face becomes one of them indepently"): from the film's first cut to the other
  // knights (at.knights, 53.053 s) each of the twelve faces leaves the box, one after the other, and becomes one of the twelve worlds on the
  // sphere's Lissajous loop, the film still on it; they come back as the box closes on the armor. worlds[i]: 0 in the box, 1 a world.
  const w = t - at.knights, flies = Number.isFinite(w) && at.knights > at.open + full && (!risen || at.knights < at.rise + CLOSE);
  const worlds = Array.from({length: 12}, (_, i) => flies ? ss(0, 1.5, w - 0.07 * i) * (1 - ss(0, 1.8, c - 0.05 * i)) : 0);
  // the cloth: revealed as the box opens, a small rise and a glint, turning slowly; at his conversion tag it lifts into the light, turning
  // faster, and bursts at PIECES; `pieces` is the burst's age (negative while it is whole)
  const cloth = {
    show: (!risen || r < PIECES) && a >= RAYS - 0.2 && c < 1.3,   // not drawn inside the shut box: it shows as the lid breaks away, goes as it closes
    rise: 0.06 * ss(full - 1, full + 0.5, a) + (risen ? 0.95 * ss(-0.6, 1.6, r) : 0),   // box radii above the floor
    spin: 0.35 * a + (risen ? 2.6 * ssInt(-0.6, PIECES, r) : 0),
    glint: ss(full - 0.25, full + 0.05, a) * (1 - ss(full + 0.05, full + 1.2, a)),   // as the centaur appears
    glow: risen ? ss(-0.6, PIECES, r) : 0,
    pieces: risen && r >= PIECES ? r - PIECES : -1,
  };
  // Seiya: up through the floor of the box, a figure of light that the pieces dress from the legs up; up out of the box as it closes under
  // him, a little smaller, the wings spread over the shut box (the film's, 70.0 s); then up into the light, light himself, and gone to a star
  // (y: box radii his feet stand above the floor; scale: his size)
  const seiya = {
    show: risen && r >= 0 && r < 10,
    y: -2.05 * (1 - ss(0, 2.2, r)) + 1.9 * ss(4.4, 6.8, r) + 0.45 * ss(8.7, 9.9, r) + 0.025 * Math.sin(1.1 * r) * ss(7, 8, r) * (1 - ss(8.6, 9, r)),
    scale: 1 - 0.34 * ss(4.4, 6.8, r) - 0.66 * ss(9.3, 10, r),   // two thirds of his size once out of the box, so the wings stay under the page's top
    glow: Math.min(1, 1 - ss(3.0, 6.8, r) + ss(8.7, 9.6, r)),
    wings: risen ? spring(r - 8.0, 0.45, 3.4) : 0,
    sway: 0.12 * Math.sin(0.31 * r) * ss(7, 8.5, r),
  };
  const column = risen ? ss(-1.8, -0.6, r) * (1 - ss(8.4, 9.6, r)) : 0;
  const flow = (a < 2.2) || (a >= full - 0.4 && a < full + 1.3) || (flies && w >= -0.1) || (risen && r >= -1.9 && r < 10.6) || c >= -0.05;
  // THE EMPTY FRAMES (his words, Oct 14 2026 17:0x WEST, over the hero at 51.2 s, the gold cloth standing in the open box and every face showing
  // the film's centaur in flames: "do you understand or not that here you gotta start showing the empty frames because the pentagons are
  // showing the golden sagyttarius shit dude?"; and at 16:4x over the opening: "THE LIGHT IS COMING FROM THE ARMOR ITSELF"): once the armor
  // stands in the box its picture leaves the faces, which keep their gold leading and nothing in it. at.empty: [from, to] film seconds, to
  // Infinity for until the box is shut on the armor; empty: 1 inside, 0 outside
  const shutAt = risen ? at.rise + CLOSE + SHUT : at.back + SHUT;
  const [e0, e1] = Array.isArray(at.empty) ? [at.empty[0], Math.min(at.empty[1], shutAt)] : [NaN, NaN];
  const empty = t >= e0 && t < e1 ? 1 : 0;
  // THE KNIGHTS IN THE FRAMES (his words, Oct 14 2026 17:32 WEST, over the hero at 60.9 s, the empty frames riding the worlds: "dude wtf? each
  // of these frames need to be filled with one of the individual segment the knights had... like idk light up one frame at a time sequentially
  // based on when knights appear on the screen..."): at.segments [{t0, t1}], the film's shots of the knights (cuts.js); a frame lights with its
  // segment's picture live while it plays and keeps its last picture after. knights[k]: {lit, live}
  const knights = (at.segments ?? []).map(g => ({lit: empty === 1 && t >= g.t0, live: t >= g.t0 && t < g.t1}));
  // THE MASK (his words, 17:39 WEST, over the hero at 58.4 s: "can you do here theather mode?? like... during the transformation i would like
  // to shee the mask mode please dude..."): through the transformation, his conversion tag to the shut on the armor, the faces are windows onto
  // the film behind the white page (hero-ab.html's C: "only show the video throygh the dodechahedron mask")
  const mask = at.mask && risen && r >= 0 && t < shutAt ? 1 : 0;
  // THE CUTS' one device (lab/CUTS.md) at his conversion tag and on both cuts of the empty frames: the box's faces as their normals for a tenth
  // of a second, a flat gold matte for the next, then the picture (or the empty frame)
  const device = (x) => x >= 0 && x < 0.1 ? 1 : x >= 0.1 && x < 0.2 ? 2 : 0;
  const pass = Math.max(risen && r >= 0 ? device(r) : 0, e0 < e1 ? Math.max(device(t - e0), device(t - e1)) : 0);
  return {out, mode: fade < 1 ? 1 : 2, flow, fade, a, r, c, full, ...box, worlds, pass, empty, knights, mask, cloth, seiya, column, columnTop: risen ? ss(-1.8, -0.4, r) : 0};
}

// THE FOLD (his words, Oct 14 2026, relayed by mint-fork. 18:47 WEST, over the hero at 30.3 s: "AS SOON AS ATHENA FUCKING APPEARS SHE
// BREACHES THE FABRIC OF SPACETIME (it simply means, the dodecahedron faces dissolve into 1 single window into reality"; 18:4x: "of coruse, the
// fucking face that we start from means all the other faces are folded onto the main plane... you get what i mean?"; 19:0x: "UNTIL THE
// FUCKING WALL OF LIGHT, THE DODECAHEDRON DISAPPEARS, IT IS FOLDED UNTO 1 SINGLE PLANE WHICH IS THE FUCKING PLANE FROM WHICH ATHENA IS ALIGNED
// TO"; 19:1x: "you have the chance to turn the entire background black there... make it fucking immersive... she has fucking tore through
// space and time dude... we saw her fold the dodechadron lik a fukin origami"); and his final word, 19:19: "why the fuck are you trying to
// brusteforce into place a 3D model when you can interpolate the dodecahedron chosen destination plane for all faces to be folded in that plain
// hexagomnally... you get me? its come and go from plane to back again into sphere when wall of lights hits again" (the hero's hypertrace,
// ec-workspace docs/optimism-fit-hero-hypertrace-2026-10-14.md, strikes the hinged fold onto her face and her refit per shot). From her cut the
// box stands where the page's sphere stood (as at the gold star, the page's skin hushed); every face turns and slides from its place on the
// sphere onto the face she is aligned to, its corners on hers (cubism.mjs oneCells, hexAt, hexFold: the nearest first, all down by 30.2 s; the
// hexagonal lattice of cells apart that stood here until his Oct 15 00:44 WEST words is struck), their gold leading the origami's edges, each
// face a window onto the one picture laid in her plane (THE MASK's look); her plane's own window opens from her hair's join and sweeps past the
// one folded pentagon from 30.2 to 30.5 s, its leading melting where the window has reached, so the twelve are one window into reality
// (cubism.mjs ONE, THE ONE PLANE), in a page gone black edge to edge; from 30.5 s no face is drawn; at her wall of light (37.132 s) it runs out
// white from her and every face comes back out of her plane into the sphere, the white back, the sphere whole at 38.071 s and the page's own.
// fold = {start, flat, gone, aiolos, closed, whole, back}: the film's seconds (cubism.mjs FOLD, ONE, PORTAL, HEX; back: her presence's end, the
// hand-back). look: the faces from the page's own look (the film on each) to windows onto her plane's picture, and back; k3d: their pictures
// from the page's flat decal to their own 3D faces, and back; lead: hairline (0) to gold leading (1), the origami's edges both ways; dark: the
// black over the whole page; turn: how far the box has turned her face square to the eye (his 19:34 WEST over the first pictures: "why would you
// use this angle? the dodecahedron has 12 faces dude omg..."); back: how far it has turned back to the page's own pose.
// THE FOLD AS ONE WINDOW (his Oct 15 2026 00:44 WEST, over the hexagonal lattice this plan laid flat from 30.2 s to the wall: "this grid dude is
// all absolutely fucked up. you gotta do differently. when does it stop being a dodecahedron mask??"): the faces fold onto her one face (cubism.mjs
// oneCells), that pentagon dissolves into her window from f.flat to f.gone (her window sweeping past it), and from f.gone to the wall no face
// is drawn at all. faces: whether the box draws its faces at t (false from f.gone to f.aiolos; with no f.gone, always, as before); flow: the
// screen's frames through the come, the dissolve and the go.
export function foldBeat(t, f) {
  const x = t - f.start, whole = f.whole ?? f.back;
  const come = ss(0, 0.12, x) * (1 - ss(f.aiolos - 0.12, f.aiolos, t)), go = ss(f.aiolos, f.aiolos + 0.12, t) * (1 - ss(whole - 0.35, whole, t));
  return {out: true, fold: true, mode: 2, fade: 1, pass: 0, pres: 0, worlds: Array(12).fill(0),
    k3d: ss(0, 0.15, x) * (1 - ss(whole - 0.3, whole, t)), look: ss(0.02, 0.3, x) * (1 - ss(f.aiolos + 0.15, whole - 0.05, t)),
    lead: Math.max(come, go), dark: ss(f.start + 0.05, f.flat, t) * (1 - ss(f.aiolos, f.closed, t)),
    turn: ss(f.start, f.flat, t), back: ss(f.aiolos, whole, t),
    faces: !(t >= f.gone && t < f.aiolos),
    flow: t < Math.max(f.flat + 0.1, (f.gone ?? -Infinity) + 0.05) || t >= f.aiolos - 0.05};
}
// The face's turn that sets its outward normal n on the eye's axis (warm-sphere.js rotate: the yaw about the vertical, then the pitch).
export const squareTo = (n) => ({yaw: Math.atan2(n[0], n[2]), pitch: Math.atan2(n[1], Math.hypot(n[0], n[2]))});
// THE FOLD's turn of the box at second t: from the page's pose at her cut (from) to her face square to the eye (to) as the faces come (s.turn),
// held there, then to the page's own pose of this frame (live) as they go (s.back), so the sphere is whole at the page's own turn when it is
// handed back. Angles the short way round.
export function foldSpin(s, from, to, live = null) {
  const toward = (a, b, k) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * k;
  const yaw = toward(from.yaw, to.yaw, s.turn), pitch = from.pitch + (to.pitch - from.pitch) * s.turn;
  return live && s.back > 0 ? {yaw: toward(yaw, live.yaw, s.back), pitch: pitch + (live.pitch - pitch) * s.back} : {yaw, pitch};
}

// warm-sphere.js rotate(): the yaw about the vertical, then the pitch
// THE END OF IT (his words, Oct 14 2026 17:0x WEST, relayed by mint-fork, over the hero at 92.0 s: "do you understand how at the end of it the
// dodecahedron needs to be dissolved and new dodecahedron needs to form later? you know what this is?? this moment right here"; over 102.3 and
// 107.4 s: "do you understand how critical these 2 keyframes are in our narrative? they are when pegasus starts to burn the cosmos and when he
// starts throwin darts of agents"). The knights who fell give Seiya their cosmos (his Oct 12 "what Goku does when all characters are doing
// sphere genkidama to help him sharing resources"): the box burns away, the knights' four streams of cosmos come in and gather into a new
// box, it ignites from inside at the burn ("what happens to $WARM tokens and how they become liquidity/ai-credits for agents") and its faces
// fly out as darts with a hundred more ("ANTIMIRROR WORKS FOR YOU, INFINITE COPIES OF YOU", Sept 28). BUILT, NOT WIRED: the moments are his
// (end = {dissolve, whole, burn, darts, back, streams: [four starts]}, set only by hero-ab.html's ?end=a|b).
export const KNIGHTS_COSMOS = Object.freeze([
  {name: 'Ikki', tint: [1.0, 0.42, 0.12]},     // the Phoenix's flame
  {name: 'Shun', tint: [1.0, 0.5, 0.78]},      // Andromeda's pink
  {name: 'Hyoga', tint: [0.62, 0.86, 1.0]},    // the Swan's ice
  {name: 'Shiryu', tint: [0.3, 0.92, 0.5]},    // the Dragon's green
]);
export const STREAM = 2.6;   // seconds a knight's stream takes to reach the box
export const DISSOLVE = 1.7; // seconds a face takes to burn away (they go one after another, 0.06 s apart)
/** Which knight's stream each of the twelve faces is made of: three faces each, the faces nearest the side the stream comes from. */
export const faceStream = (i) => Math.floor(i / 3);
export function endBeat(t, end) {
  const d = t - end.dissolve, b = t - end.burn, k = t - end.darts;
  // the faces: burned away from the cut (one after another), then made again by their knight's stream as it arrives, whole by `whole`
  const gone = Array.from({length: 12}, (_, i) => {
    // a face is made again only once it has burned away (so each is gone for a moment), as its knight's stream arrives
    const go = ss(0, DISSOLVE, d - 0.06 * i), burnt = end.dissolve + 0.06 * i + DISSOLVE;
    const arrive = Math.max((end.streams?.[faceStream(i)] ?? end.dissolve) + STREAM * 0.55 + 0.12 * (i % 3), burnt + 0.25);
    const form = ss(arrive, Math.max(arrive + 0.6, end.whole - 0.05 * (11 - i)), t);
    return go * (1 - form);
  });
  // the darts: each face flies out along its normal from the second keyframe, one after another; dart[i] its age in seconds (< 0 not yet)
  const dart = Array.from({length: 12}, (_, i) => k - 0.035 * i);
  const burn = ss(-0.15, 0.5, b) * (1 - ss(1.2, 2.2, k));   // the light from inside, from the first keyframe until the darts are away
  const streams = (end.streams ?? []).map(s0 => t - s0);
  const flow = (d >= 0 && d < DISSOLVE + 1.4) || streams.some(x => x >= -0.1 && x < STREAM + 0.8) || (t >= end.whole - 0.6 && t < end.whole + 0.4) ||
    (b >= -0.2 && b < 1.6) || (k >= -0.2 && k < 2.4);
  const device = (x) => x >= 0 && x < 0.1 ? 1 : x >= 0.1 && x < 0.2 ? 2 : 0;
  return {out: true, end: true, mode: 2, flow, fade: 1, gone, dart, burn, streams, d, b, k,
    lead: 0.6 * ss(end.whole - 1.2, end.whole, t) + 0.4 * burn, seam: burn, bloom: ss(-0.05, 0.05, b) * (1 - ss(0.05, 0.9, b)) + ss(-0.05, 0.05, k) * (1 - ss(0.05, 0.7, k)),
    pass: device(d), pres: 0, k3d: 0, empty: 0, worlds: Array(12).fill(0), lower: Array(5).fill(0), upper: Array(5).fill(0), lid: 0};
}

export function rotate(p, yaw, pitch) {
  const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x = p[0] * c - p[2] * s, z = p[0] * s + p[2] * c;
  return [x, p[1] * cp - z * sp, p[1] * sp + z * cp];
}
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (v) => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
const same = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) < 1e-9;

/** The face that looks most downward when the sphere is turned by (yaw, pitch): the box's floor. */
export const floorOf = (faces, yaw, pitch) => faces.reduce((best, f, i) => rotate(f.normal, yaw, pitch)[1] < rotate(faces[best].normal, yaw, pitch)[1] ? i : best, 0);

/**
 * The box as a lotus on face `floor` of the page's dodecahedron (assembly-geometry.js buildAssemblySkin(0)): its top (the opposite face),
 * the five petals hinged on the floor's edges and the five hinged on the top's (the lid), each in turn round the floor. A petal turns by an
 * angle about its hinge {p, axis}, axis oriented so that a positive angle opens it: atan(2) (the dihedral's supplement) lays it flat.
 */
export function lotus(faces, floor) {
  const nb = faces[floor].normal, top = faces.findIndex(f => dot(f.normal, nb) < -0.99);
  const u = unit(cross(Math.abs(nb[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], nb)), w = cross(nb, u);
  const ring = (centre) => faces.map((f, i) => ({i, hinge: f.verts.filter(v => faces[centre].verts.some(q => same(v, q)))}))
    .filter(({i, hinge}) => i !== centre && hinge.length === 2)
    .map(({i, hinge: [p, q]}) => {
      let axis = unit([q[0] - p[0], q[1] - p[1], q[2] - p[2]]);
      if (dot(cross(axis, faces[i].normal), faces[centre].normal) < 0) axis = axis.map(x => -x);
      return {i, p, axis, angle: Math.atan2(dot(faces[i].center, w), dot(faces[i].center, u))};
    })
    .sort((m, n) => m.angle - n.angle);
  return {floor, top, lower: ring(floor), upper: ring(top)};
}

/** v turned by angle about the unit axis (Rodrigues), about the origin. */
export function turnAbout(v, axis, angle) {
  const c = Math.cos(angle), s = Math.sin(angle), k = dot(axis, v) * (1 - c), x = cross(axis, v);
  return [v[0] * c + x[0] * s + axis[0] * k, v[1] * c + x[1] * s + axis[1] * k, v[2] * c + x[2] * s + axis[2] * k];
}
