// sagittarius-flight.mjs: THE TWELVE, the second burst's dodecahedron blown apart for good, its twelve faces inside the anime's holy moment.
// His words, Oct 17 2026 WEST, in their order (two of his lines are kept by sequence, never one scoped away):
//   01:5x, over the Seiya burst's dodecahedron and the cliff's star: "keep this... fuckign do not disappear it, steer it... make it smaller... make
//   it chaotic until it findally finds a lyssajudrean trajectory to the sagyttarius... LIGHTINING BOLT MAKE THE DODECAHEDRON BE THERE LIKE AS IF IT WAS
//   A LIGHT-BOOMERANG"; 02:2x: "you should not disappear the dodecahedron... add some dmc4 typa shit boss fight idk where the dodecahedron encounters a
//   singularity and out of it the golden sgittarius arises"; 02:3x: the twelve are the top donors' chairs at the mint; 04:3x: "make it so that the 2nd
//   time the dodecahedron explodes, this one is for good... can you use mani faces independently soinf the same thing?" and "ALL THE FUCKING TIMES
//   YOUR ANIMATION IS ABSOLUTELY FUCKING OFFCENTERED... IT FEELS LIKE YOU ARE NOT EVEN TRYING TO DO MOTION GRAPHICS MY DUDE"; 20:3x, over the twelve in
//   a ring fighting a black hole at the picture's middle while the film showed the beam of gold light and the god's statue: "what the fuck is this
//   schizophrenic scene dude? dont you realize that moment is a manifestation of holy divine power? only the pure of heart can weikld such powwr...
//   the dodecaheron faces must begin to be aligned with the DCTs of the anime dude the spirit of the music". DCT aligned, in his own words, is
//   aligned to what the source does, known in advance (Oct 12 21:4x "like you know in advance how it is going to oscillate"; Oct 14 16:0x, the KO
//   edge on Seiya's spasms, tools/ko-spasms.mjs).
// THE LAW NOW: the twelve have no ring, no clock and no fight of their own. Everything they do is read off the anime and the score, measured once
// by tools/twelve-dct.mjs into lab/twelve-dct.js (the film's 8 x 8 DCT: where its gold light is, which way it runs and where it converges, where
// the drawings moved; the song's loudness, attacks and swell), a pure function of the film's second (no clock, no random: the same film, the same
// twelve):
//   THE BOOMERANG (his 22:2x WEST, over the twelve spread across the sky at the cut: "the animation here is so poor... so horrible... no
//     consequential thinking no awareness of the scene.. saint seya is on the ground... the wall of light arrives from the sky... the dodecahedron
//     faces when the scene changes and points to the sky must not be initially in there... they must rapidly but lyssajudrean erratically arrive like
//     a boomerang back to the sky light egg, check the anime dude"): the light came down from the sky on Seiya on the ground (1179 to 1268); at the cut
//     to the sky (1269) no face is in the picture, only the star twinkling; with the anime's own beam, the light rising back from the lower left to
//     the star (its first drawing, 1291, to the star's burst, 1302, both read off the measure), the twelve shoot in from beyond the picture's edge in
//     the beam's measured direction, each on its own erratic path (a boomerang's arc, a 3:2 Lissajous swirl dying as it nears, a spin slowing to its
//     ray), and arrive round the star, the light's egg; the hole opens on it as they arrive.
//   THE GATHERING (the star bursts, 1302, to the fan's fullest): from round the star the twelve open as its glory with the fan's drawings, the twelve
//     go to their seats as the anime's drawings move, their progress the film's own motion (the change's AC energy, summed): still while the star
//     only twinkles, drawn along with the beam, home as the star's first fan of rays opens.
//   THE GLORY (to the score's swell, 1348): the twelve stand as the star's glory, each on the light's own rays: their seats at the angles where the
//     gold light is about the source (the angular quantiles of the measured light, a third of them spread over the directions that stay in the
//     picture), each turned along its ray, breathing with the starburst's light (its throbs, about four a second), each flashing when the drawing
//     moves in its direction; at each throb of the light a ring of it runs out of the star.
//   THE SINGULARITY (02:2x, kept): it stands where the anime's light comes from, the star, as an eclipse: its black horizon on the star's core,
//     its gold photon ring the corona, the sky bent round it; it grows with the light.
//   THE FINISHER (the score's swell begins, 1348, to the cut, 1362): with the music's climax the twelve close into one glass ON THE STAR, a beat
//     before the anime's cut, the horizon captured as its core. They never leave the light while the anime holds it (his 22:3x WEST, over a finisher
//     that brought them down to the middle while the star still blazed at the top: "it makes me fucking mad because you never rewatched it... do you
//     know what is the neuro-spatial differential or not?": the anime is the observation, the twelve the prediction, and the residual between them is
//     what is measured and closed on every frame, lab/twelve-rewatch.proof.mjs). At the cut the anime's light is the golden burst at the middle, and the
//     glass is there with it: a cut moves the light, the glass stays on it.
//   THE RISE (1362, the cut to the golden burst): the gold opens out of the glass at the middle. THE RETURN (to the hold, 1380): the glass grows
//     home at the middle to the pose the mint's entry takes, its faces lit where the burst's rays move; in the mint the twelve are the top donors'
//     chairs and the golden Sagittarius rises out of the core (mint-liquor-scene.mjs).
// THE ANCHOR is the one thing his two lines decide between, shown to him on the Canvas: 'light' (the default: the glory stands on the anime's
// light, the star up and left of the middle, then comes to the middle at the cut) or 'centre' (his 04:3x: the hole stands at the picture's middle
// and the twelve sit about it at the angles where the light is, turned along the rays from the star). The lab's ?twelve=centre shows the second.
// Never out of sight: every face at least FACE_MIN picture heights across, inside the canvas, a dark halo under it.
// Before it: one ring of blades turning about a hole at the middle, five hits evenly through it (Oct 17 04:3x to 20:3x); one small glass flown
// through a bolt (01:5x to 04:3x); the lock's loop round the star (01:5x), and a smooth glide toward the star (Oct 16 04:00).
// COST: a sample is about 12 x 300 float ops (the faces) twice (their velocity) and nothing else; the measure's tracks (12 x 112 numbers) are made
// once at the module's load (under a millisecond). The theater asks one sample a frame while the twelve fly, none at rest.
// THE TWELVE ON SEIYA (seiya-flight.mjs, his Oct 21 2026 words there) fly the same boomerang, gathering and glory on his column of gold, by the
// shapes and helpers exported here for it; nothing here changed for them.
import {pictureViewport} from './mint-freeze-layout.mjs';
import {silk} from './liquor-entry.mjs';
import {TWELVE_DCT} from './twelve-dct.js';

const FPS = 30000 / 1001;
export const SKY_FLIGHT_START = 1269 / FPS;
export const SKY_FLASH = 1362 / FPS;              // the cut to the golden burst
export const SKY_HOLD = 1380.5 / FPS;
export const MASK_BACKGROUND = .42;
// past the hold the glass stays on the hold's pose: the film can run a few frames past 1380 before the hold catches it (90 ms seen under load,
// frame 1383), and the glass must not vanish in them; the mint's entry takes over as soon as the hold has the picture
export const HOLD_GRACE = .5;
export const HIT = Object.freeze({stop: .07});    // the finisher's hit-stop: the glass holds as it closes
export const FIN_HIT = SKY_FLASH - .1;            // the twelve close into one glass, a beat before the cut
const FIN_STOP = FIN_HIT + HIT.stop;              // its hit-stop over, the horizon closes into the glass
// THE COMPOSITION (picture heights): the glory's radius about the light, the ring's about the middle when the anchor is the centre; each face's
// circumradius, the glass's when the twelve close into it and when it is home; the least a face is ever across
export const CENTER = Object.freeze([.5, .5]);
export const GLORY = .22, RING = .3, FACE = .05, SMALL = .072, HOME_R = .1, FACE_MIN = .04;
export const TILT = .5, DEPTH = .35, FALL = .12, RH = .016, RH_LIGHT = .022, LENS = 1.6, CORE = .36, RISE_SPEED = 3;
// the glory's two tiers, its rays long and short in turn (of the glory's radius), and the least turn between two seats (radians)
export const TIERS = Object.freeze([.82, 1.32]);
const GAP = .24;
export const ANCHORS = Object.freeze(['light', 'centre']);
const mix = (a, b, k) => a + (b - a) * k;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
export const hash = (n) => { let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };
// THE BOOMERANG's shape (picture heights): the twelve stand RING_IN round the star when they arrive; each flies a boomerang's arc ARC wide and a 3:2
// Lissajous swirl SWIRL wide, both dying as it nears; it starts its flight BEYOND past the canvas's edge, the twelve spread SPREAD across the beam
export const RING_IN = .06;
export const ARC = .16, SWIRL = .065, BEYOND = .14, SPREAD = .3;
export const at2 = (a, b, k) => [mix(a[0], b[0], k), mix(a[1], b[1], k)];

export const STRIDE = .2;
const MAX_TURN = .12;
// the picture's width over its height (every span's measure is of the same picture)
const ASPECT = TWELVE_DCT.aspect;

/** Where the twelve sit about a point in a frame: twelve clockwise angles (radians from twelve o'clock, y down), the angular quantiles of the light
 *  about it (`share`, twelve sectors), half the weight spread over the sectors whose direction keeps a face at `radius` inside the picture, then
 *  each at least GAP from the one before it (a glory's rays, not a heap); counted from `from` (radians), the direction with no light in it, so no
 *  seat hops across the count's start. */
export function seatsOf(share, about, radius, from = 0) {
  const seen = share.map((_, k) => {
    const a = (k + .5) * Math.PI / 6, u = about[0] * ASPECT + radius * Math.sin(a), v = about[1] - radius * Math.cos(a);
    return u > .06 && u < ASPECT - .06 && v > .06 && v < .94 ? 1 : 0;
  });
  const light = share.map((v, k) => v * seen[k]), lt = light.reduce((a, b) => a + b, 0), st = seen.reduce((a, b) => a + b, 0) || 1;
  const w = light.map((v, k) => (lt > 0 ? .5 * v / lt : 0) + (lt > 0 ? .5 : 1) * seen[k] / st);
  // the density over the turn from `from`, clockwise: the rest of its own sector, the eleven after it, then the first part of its own; each piece
  // its sector's weight spread evenly over it
  const step = Math.PI / 6, f = ((from % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI), k0 = Math.min(11, Math.floor(f / step)), pieces = [];
  pieces.push({a: f, span: (k0 + 1) * step - f, w: w[k0] * ((k0 + 1) * step - f) / step});
  for (let q = 1; q < 12; q++) pieces.push({a: (k0 + q) * step, span: step, w: w[(k0 + q) % 12]});
  pieces.push({a: k0 * step + 2 * Math.PI, span: f - k0 * step, w: w[k0] * (f - k0 * step) / step});
  const out = [];
  for (let j = 0; j < 12; j++) {
    const target = (j + .5) / 12; let acc = 0, q = 0;
    while (q < pieces.length - 1 && acc + pieces[q].w < target) { acc += pieces[q].w; q++; }
    out.push(pieces[q].a + pieces[q].span * clamp01((target - acc) / (pieces[q].w || 1)));
  }
  // the gap: inside the turn the seats span (their first to their last), each at least GAP after the one before, pushed both ways
  const lo = out[0], hi = out[11], gap = Math.min(GAP, (hi - lo) / 11);
  for (let j = 1; j < 12; j++) out[j] = Math.max(out[j], out[j - 1] + gap);
  out[11] = Math.min(out[11], hi);
  for (let j = 10; j >= 0; j--) out[j] = Math.min(out[j], out[j + 1] - gap);
  out[0] = Math.max(out[0], lo);
  return out.map((a) => a % (2 * Math.PI));
}
// THE GLASS: the sphere's own dodecahedron (theater.js, assembly-geometry.js): circumradius one, the twelve face normals the icosahedron's
// corners, each face's centre at the inradius H and its corners RHO from it. Each face's frame: z its normal, y toward one of its corners (a
// regular pentagon is the same turned a fifth, so any corner will do), x = y × z.
const PHI = (1 + Math.sqrt(5)) / 2, H = .7947, RHO = .6071;
const unit3 = (v) => { const l = Math.hypot(...v) || 1; return v.map(c => c / l); };
const cross3 = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const dot3 = (a, b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const FACES = Object.freeze([[0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI], [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1]].map(unit3));
const CORNERS = [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
  [0, PHI, 1 / PHI], [0, PHI, -1 / PHI], [0, -PHI, 1 / PHI], [0, -PHI, -1 / PHI], [1 / PHI, 0, PHI], [-1 / PHI, 0, PHI], [1 / PHI, 0, -PHI],
  [-1 / PHI, 0, -PHI], [PHI, 1 / PHI, 0], [PHI, -1 / PHI, 0], [-PHI, 1 / PHI, 0], [-PHI, -1 / PHI, 0]].map(unit3);
// quaternions [x, y, z, w], as theater.js turns the glass (its turnOf is the same rotation)
export const qmul = (p, q) => [p[3]*q[0]+p[0]*q[3]+p[1]*q[2]-p[2]*q[1], p[3]*q[1]-p[0]*q[2]+p[1]*q[3]+p[2]*q[0],
  p[3]*q[2]+p[0]*q[1]-p[1]*q[0]+p[2]*q[3], p[3]*q[3]-p[0]*q[0]-p[1]*q[1]-p[2]*q[2]];
export const qaxis = ([x, y, z], a) => { const s = Math.sin(a / 2); return [x*s, y*s, z*s, Math.cos(a / 2)]; };
const unit4 = (q) => { const l = Math.hypot(...q) || 1; return q.map(v => v / l); };
export const qnlerp = (p, q, k) => { const s = p[0]*q[0]+p[1]*q[1]+p[2]*q[2]+p[3]*q[3] < 0 ? -1 : 1; return unit4(p.map((v, i) => v + (s*q[i] - v)*k)); };
export function qrot([x, y, z, w], [vx, vy, vz]) {
  const tx = 2*(y*vz - z*vy), ty = 2*(z*vx - x*vz), tz = 2*(x*vy - y*vx);
  return [vx + w*tx + (y*tz - z*ty), vy + w*ty + (z*tx - x*tz), vz + w*tz + (x*ty - y*tx)];
}
const qOfColumns = (ex, ey, ez) => {   // the rotation whose columns are ex, ey, ez
  const [a, b, c, d, e, f, g, h, i] = [ex[0], ey[0], ez[0], ex[1], ey[1], ez[1], ex[2], ey[2], ez[2]], tr = a + e + i;
  if (tr > 0) { const s = 2 * Math.sqrt(tr + 1); return [(h - f) / s, (c - g) / s, (d - b) / s, s / 4]; }
  if (a > e && a > i) { const s = 2 * Math.sqrt(1 + a - e - i); return [s / 4, (b + d) / s, (c + g) / s, (h - f) / s]; }
  if (e > i) { const s = 2 * Math.sqrt(1 + e - a - i); return [(b + d) / s, s / 4, (f + h) / s, (c - g) / s]; }
  const s = 2 * Math.sqrt(1 + i - a - e); return [(c + g) / s, (f + h) / s, s / 4, (d - b) / s];
};
const FRAMES = FACES.map((n) => {
  const corner = CORNERS.filter(v => dot3(v, n) > .79).sort((a, b) => b[1] - a[1] || b[0] - a[0])[0], up = unit3(corner.map((c, j) => c - n[j] * H));
  return qOfColumns(cross3(up, n), up, n);
});
// the glass's own turn while it holds the hole and comes home: a tumble on the finisher's time, slowing to the hold
const glassTurn = (spin) => qmul(qaxis([0, 1, 0], spin), qaxis([1, 0, 0], .45 + .25 * Math.sin(spin * .7)));

/** Picture fractions (u right, v down, of the film's active picture) to the canvas (canvas heights, centred, y up). */
export function canvasOf(picture, width, height, [u, v]) {
  return [(picture.left+(82+796*u)/960*picture.width-width/2)/height, .5-(picture.top+(4+532*v)/540*picture.height)/height];
}

// The burst's plates, where the flight takes them: each face pushed out along its normal to H + sep (circumradii), seen as theater.js draws
// them (an eye 1 / persp circumradii away), and which seat each takes: the plates in clockwise order about the burst's glass go to the seats in
// clockwise order, so no two paths cross at the start. Kept per flight (the origin object) and canvas size, made once a flight.
const STARTS = new WeakMap();
export function startsOf(origin, width, height) {
  let byKey = STARTS.get(origin);
  if (!byKey) STARTS.set(origin, byKey = new Map());
  const key = `${width}x${height}`;
  if (byKey.has(key)) return byKey.get(key);
  const q0 = origin.q ?? [0, 0, 0, 1], sep = origin.sep ?? 0, persp = origin.persp ?? 0;
  const faces = FACES.map((n, i) => {
    const x = qrot(q0, n.map(v => v * (H + sep))), k = 1 / (1 - persp * x[2]);
    return {c: [origin.c[0] + origin.r * x[0] * k, origin.c[1] + origin.r * x[1] * k], s: origin.r * RHO * k, q: qmul(q0, FRAMES[i]), z: origin.r * x[2]};
  });
  const clockwise = (c) => { const a = Math.PI / 2 - Math.atan2(c[1] - origin.c[1], c[0] - origin.c[0]); return ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); };
  const order = faces.map((f, i) => i).sort((a, b) => clockwise(faces[a].c) - clockwise(faces[b].c));
  const seatOf = new Array(12);
  order.forEach((face, seat) => { seatOf[face] = seat; });
  const out = {faces, seatOf};
  byKey.set(key, out);
  return out;
}

/** THE TWELVE's law over one span of the film: its measure (lab/twelve-dct.js's shape) and its plan, the moments the measure alone does not say:
 *  {start, cut (seconds), hold (seconds, the sky's; the cut if none), after ('return': the glass comes home past the cut, as the sky's; 'none': no
 *  flight from the cut), hole (the singularity on the light), entry ([first, last] sector the twelve come in from), boom ({LIGHT, F0, N, firstAfter}
 *  -> {beam, arrive, from}: the span's indices of the light's first drawing and of the twelve's arrival, and the frame the boomerang starts at),
 *  fullest ({LIGHT, CHANGE, F0, N, ARRIVE_I} -> the index the gathering's clock ends at), finishFrom ({F0, N, SWELL, GATHERED_N} -> the frame from which the
 *  score's floor and its climax are read), latestFinish (seconds, optional: the climax no later)}. The same law for every span: THE TWELVE (the sky,
 *  below) and THE TWELVE ON SEIYA (seiya-flight.mjs). */
export function twelveLaw(M, plan) {
  const START = plan.start, FLASH = plan.cut, HOLD = plan.hold ?? plan.cut, AFTER = plan.after ?? 'return', HOLE = plan.hole !== false;
  const FIN_HIT = FLASH - .1, FIN_STOP = FIN_HIT + HIT.stop;   // the twelve close into one glass a beat before the cut, then its hit-stop
  // THE MEASURE, read once (lab/twelve-dct.js, tools/twelve-dct.mjs): per frame of the film from 1269, the light's source (picture fractions), its
  // gold, the drawing's motion, the score; and per twelve sectors about the source and about the middle, where the light is and where it moved
  const ASPECT = M.aspect, F0 = M.from, N = M.rows.length;
  const CUT = M.cuts.filter((n) => n > F0)[0] ?? Infinity;   // the shot's cut inside the span: 1362
  const col = (k) => M.rows.map((r) => r[k]);
  const digitsOf = (s) => [...s].map((c) => Number(c) / 9);
  const LIGHT = col(2).map((v) => v / 10), CHANGE = col(3), DB = col(6).map((v) => v / 10), ONSET = col(7), SWELL = col(8).map((v) => v / 10);
  const SECT = {light: M.rows.map((r) => digitsOf(r[9])), centre: M.rows.map((r) => digitsOf(r[11]))};
  const MOVES = {light: M.rows.map((r) => digitsOf(r[10])), centre: M.rows.map((r) => digitsOf(r[12]))};
  const frameOf = (t) => t * FPS - F0;   // the span's frame index of second t (fractional)
  const shotOf = (i) => (F0 + i < CUT ? 0 : 1);
  // within one shot only: a frame's neighbours across a cut are another picture
  const near = (i, d) => { const j = Math.max(0, Math.min(N - 1, i + d)); return shotOf(j) === shotOf(i) ? j : i; };

  // the source, held where the light is too faint to say (the star barely twinkling) and steady between drawings: a median over thirteen frames
  // weighted by each frame's gold, then a nine-frame triangle (a step of the light's place becomes a glide of a quarter of a second); picture fractions
  // (u across, v down)
  const SOURCE = (() => {
    const raw = M.rows.map((r) => [r[0] / 1000 / ASPECT, r[1] / 1000]), out = [];
    for (let i = 0; i < N; i++) {
      const take = (k) => { const w = []; for (let d = -6; d <= 6; d++) { const j = near(i, d); w.push([raw[j][k], LIGHT[j] + 1e-3]); }
        w.sort((a, b) => a[0] - b[0]); const half = w.reduce((s, x) => s + x[1], 0) / 2; let acc = 0; for (const [v, wt] of w) { acc += wt; if (acc >= half) return v; } return w.at(-1)[0]; };
      out.push([take(0), take(1)]);
    }
    return Object.freeze(out.map((p, i) => { let s = [0, 0], w = 0; for (let d = -4; d <= 4; d++) { const j = near(i, d), k = 5 - Math.abs(d); s = [s[0] + out[j][0] * k, s[1] + out[j][1] * k]; w += k; }
      return Object.freeze([s[0] / w, s[1] / w]); }));
  })();
  // the gold's level, 0 to 1 of the starburst's brightest before the cut, and the drawing's strength, 0 to 1 (600 of AC energy a pixel is full)
  const LEVEL = LIGHT.map((v) => clamp01(v / Math.max(...LIGHT.filter((_, i) => F0 + i < CUT))));
  const DRAWN = CHANGE.map((v) => clamp01(v / 600));
  // THE THROBS: the frames where the light jumps by 3 or more of the measure's units (a new, brighter drawing of the rays), never at a cut
  const THROBS = Object.freeze(LIGHT.map((v, i) => (i > 0 && F0 + i !== CUT && v - LIGHT[i - 1] >= 3 ? (F0 + i) / FPS : null)).filter((x) => x !== null));
  // THE GATHERING's clock: the film's own motion (the change's AC energy), summed from the cut until it reaches its sum at the fan's fullest (the light's
  // brightest before the fan draws back, frame 1310); no frame moves the twelve more than STRIDE of their way (the fan's last drawing, a third of it,
  // goes over two frames: a glide, never a jump), the rest carried to the frame after
  // THE BOOMERANG's moments, read off the measure: the beam's first drawing after the cut (the first frame whose gold reaches half a unit: 1291) and its
  // arrival at the star (the first frame after it whose gold reaches 3: the star bursts, 1302)
  const firstAfter = (from, test) => { for (let i = 0; i < N; i++) if (F0 + i > from && test(i)) return i; return null; };
  const {beam: BEAM_I, arrive: ARRIVE_I, from: BOOM_FROM} = plan.boom({LIGHT, F0, N, firstAfter});
  const FULLEST = plan.fullest({LIGHT, CHANGE, F0, N, ARRIVE_I});
  const BOOM_START = BOOM_FROM / FPS, BOOM_END = (F0 + ARRIVE_I) / FPS;
  const SING_OPEN = BOOM_END;   // the hole opens on the light as the twelve arrive round it
  // the beam's direction below the star (clockwise from twelve o'clock, y down): the light's sectors about the source over the beam's frames, those from
  // four to ten o'clock (the beam's foot, not its head in the sky), their light-weighted mean direction
  const ENTRY = (() => {
    let x = 0, y = 0;
    for (let i = BEAM_I; i < ARRIVE_I; i++) for (let k = plan.entry[0]; k <= plan.entry[1]; k++) { const a = (k + .5) * Math.PI / 6, w = SECT.light[i][k]; x += w * Math.sin(a); y += w * Math.cos(a); }
    return ((Math.atan2(x, y) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  })();
  const MOTION = (() => {   // the gathering's clock from the twelve's arrival round the star to the fan's fullest
    let sum = 0; for (let i = ARRIVE_I + 1; i <= FULLEST; i++) sum += CHANGE[i];
    const out = [0]; let carry = 0;
    for (let i = 1; i < N; i++) { const want = (i > ARRIVE_I && i <= FULLEST ? CHANGE[i] / sum : 0) + carry, step = Math.min(want, STRIDE); carry = want - step; out.push(Math.min(1, out[i - 1] + step)); }
    return out;
  })();
  const GATHERED = (F0 + MOTION.findIndex((v) => v >= 1 - 1e-12)) / FPS;
  /** The gathering's progress at second t, 0 to 1: the anime's motion summed from the twelve's arrival round the star, each frame's share spread over
   *  the frame that lands it (at most STRIDE a frame). It holds while a drawing holds. */
  function gatheredAt(t) {
    const x = Math.max(0, Math.min(N - 1, frameOf(t))), i = Math.floor(x), next = Math.min(N - 1, i + 1);
    return clamp01(MOTION[i] + (x - i) * (MOTION[next] - MOTION[i]));
  }
  // THE SCORE: its swell (320 to 2560 Hz) from its floor over the starburst to its peak after; the climax begins when it is 6 dB over its floor
  const FINISH_FROM = plan.finishFrom({F0, N, SWELL, GATHERED_N: Math.round(GATHERED * FPS)});
  const SWELL_FLOOR = Math.min(...SWELL.filter((_, i) => F0 + i >= FINISH_FROM && F0 + i < CUT));
  // (a plan's `latestFinish`, seconds: the climax no later than that, so the twelve have the finisher's time to close before the cut)
  const FINISH = Math.min(plan.latestFinish ?? Infinity, (() => { for (let i = 0; i < N; i++) if (F0 + i >= FINISH_FROM && SWELL[i] >= SWELL_FLOOR + 6) return (F0 + i) / FPS; return FLASH - .3; })());
  const SWELL_PEAK = Math.max(...SWELL.filter((_, i) => (F0 + i) / FPS >= FINISH));
  const RISEN = SWELL.map((v, i) => ((F0 + i) / FPS < FINISH ? 0 : clamp01((v - SWELL_FLOOR) / (SWELL_PEAK - SWELL_FLOOR))));
  const ONSET_MED = [...ONSET].sort((a, b) => a - b)[N >> 1], ONSET_TOP = [...ONSET].sort((a, b) => a - b)[Math.floor(N * .95)];
  const ATTACK = ONSET.map((v) => clamp01((v - ONSET_MED) / Math.max(1, ONSET_TOP - ONSET_MED)));
  const SCORE = Object.freeze({db: Object.freeze(DB), floor: SWELL_FLOOR, peak: SWELL_PEAK});

  // each face's flash, per sector about the anchor: the drawing's strength where it moved, falling by e in FALL (ko-edge.js's envelope)
  const pulsesOf = (moves) => {
    const keep = Math.exp(-1 / (FPS * FALL)), out = [];
    for (let i = 0; i < N; i++) out.push(moves[i].map((m, k) => Math.max(m * DRAWN[i], i > 0 ? out[i - 1][k] * keep : 0)));
    return out;
  };
  const PULSE = {light: pulsesOf(MOVES.light), centre: pulsesOf(MOVES.centre)};
  // the light's sectors, steadied over five frames of the shot (a triangle), for the seats
  const steady = (sect) => sect.map((_, i) => { const s = new Array(12).fill(0); let w = 0; for (let d = -2; d <= 2; d++) { const j = near(i, d), k = 3 - Math.abs(d); for (let q = 0; q < 12; q++) s[q] += sect[j][q] * k; w += k; } return s.map((v) => v / w); });
  const STEADY = {light: steady(SECT.light), centre: steady(SECT.centre)};

  /** A sampled track at second t: linear between the span's frames, held at its ends. */
  const sample = (track, t, f = (a, b, k) => mix(a, b, k)) => {
    const x = Math.max(0, Math.min(N - 1, frameOf(t))), i = Math.floor(x), j = Math.min(N - 1, i + 1), k = x - i;
    return shotOf(i) === shotOf(j) ? f(track[i], track[j], k) : track[i];   // across a cut each shot holds its own value until the cut's frame begins
  };
  const sampleVec = (track, t) => sample(track, t, (a, b, k) => a.map((v, q) => mix(v, b[q], k)));
  /** A pulse at second t: the frame's own at its second, and between frames the last one falling (a drawing lands on its frame, never between). */
  const pulseAt = (track, t) => {
    const x = Math.max(0, Math.min(N - 1, frameOf(t))), i = Math.floor(x), dt = (x - i) / FPS;
    return track[i].map((v) => v * Math.exp(-dt / FALL));
  };

  // THE SEATS, made once: per frame and anchor the twelve angles (the light steadied over five frames, counted from the side with no light: twelve
  // o'clock above the star, or the side of the middle away from the star), then each seat steadied over nine frames of its shot and never turned
  // more than MAX_TURN a frame, so a seat glides when the light's spread changes at once (the fan drawing back, the starburst opening)
  const SEATS = Object.fromEntries(['light', 'centre'].map((anchor) => {
    const raw = SOURCE.map((src, i) => {
      const about = anchor === 'light' ? src : CENTER, radius = anchor === 'light' ? GLORY : RING;
      const away = anchor === 'light' ? 0 : Math.atan2(CENTER[0] * ASPECT - src[0] * ASPECT, -(CENTER[1] - src[1]));   // the middle's side away from the star
      return seatsOf(STEADY[anchor][i], about, radius, away);
    });
    const unwrap = (j) => { const out = [raw[0][j]]; for (let i = 1; i < N; i++) { let a = raw[i][j]; while (a - out[i - 1] > Math.PI) a -= 2 * Math.PI; while (a - out[i - 1] < -Math.PI) a += 2 * Math.PI; out.push(a); } return out; };
    const seats = Array.from({length: 12}, (_, j) => {
      const a = unwrap(j), s = a.map((_, i) => { let v = 0, w = 0; for (let d = -4; d <= 4; d++) { const k = near(i, d), q = 5 - Math.abs(d); v += a[k] * q; w += q; } return v / w; });
      for (let pass = 0; pass < 2; pass++) for (let i = 1; i < N; i++) {   // forward, then backward: the turn a frame bounded both ways
        const prev = pass ? N - i : i - 1, cur = pass ? N - i - 1 : i;
        if (shotOf(prev) === shotOf(cur)) s[cur] = Math.max(s[prev] - MAX_TURN, Math.min(s[prev] + MAX_TURN, s[cur]));
      }
      return s;
    });
    return [anchor, Array.from({length: N}, (_, i) => seats.map((s) => s[i]))];
  }));
  /** Where the twelve sit at second t about the anchor: twelve angles, clockwise from twelve o'clock (y down), steadied (see SEATS). */
  const seatsAt = (t, anchor = 'light') => sampleVec(SEATS[anchor], t);

  /** The anime's light at second t: its source as measured and steadied (picture fractions), the light's level (0..1), the score's swell risen
   *  (0..1) and attack (0..1). For a reader (the proofs) and the law below. */
  function lightAt(t) {
    return {source: sampleVec(SOURCE, t), level: sample(LEVEL, t), risen: sample(RISEN, t), attack: sample(ATTACK, t)};
  }
  /** Kept for readers of the film's light: the light's measured source at t (picture fractions). */
  const skyTarget = (t) => lightAt(Math.max(START, Math.min(HOLD, t))).source;

  /** The flight at the film's second t, or null outside it: {c (the formation's centre, canvas heights, centred, y up), r (its radius: the burst's
   *  glass, the glory, the glass the twelve close into), q (the glass's turn once they have closed, else null), faces (twelve, in the glass's order:
   *  {c, z, s (circumradius), q, ax ([x, y] of its local x axis on the canvas, s long), ay (its corner's axis), n (its normal), glow, seat, vel}),
   *  phase ('gather', 'glory', 'finisher', 'return'), anchor, light (the anime's source on the canvas), sing (the hole: {c, rh, lens, swirl, pinch,
   *  ring} or null), shocks ([{c, r, a}], the latest three), shake ([x, y]), sparks ([]), reveal ({s, r, far} or null), core ({r, a}: the captured
   *  hole inside the glass, in glass radii), hits (the light's throbs passed, and the finisher), aligned, outside, ...}. `origin` is the glass as the
   *  burst left it ({c, r, q: its turn, sep: how far its plates stood apart, persp}), the same object for the whole flight; `anchor` 'light' or
   *  'centre' (see the header). */
  function skyFlight(t, width, height, origin, {anchor = 'light'} = {}) {
    if(t<START || (AFTER==='none'?t>=FLASH:t>HOLD+HOLD_GRACE) || !width || !height || !origin)return null;
    t=Math.min(t,HOLD);
    const how=ANCHORS.includes(anchor)?anchor:'light';
    const now=pose(t,width,height,origin,how), was=Math.max(START,t-1/120), before=pose(was,width,height,origin,how), dt=t-was;
    now.faces.forEach((f,i)=>{const b=before.faces[i].c;f.vel=dt>0?[(f.c[0]-b[0])/dt,(f.c[1]-b[1])/dt]:[0,0];});
    return now;
  }

  function pose(t, width, height, origin, anchor) {
    const age=t-START, picture=pictureViewport(width,height), ph=picture.height*534/540/height;
    const C=canvasOf(picture,width,height,CENTER), {faces:starts,seatOf}=startsOf(origin,width,height), light=lightAt(Math.min(t,FLASH-.001));
    const S=canvasOf(picture,width,height,light.source);
    // the formation's centre while the twelve stand in the anime's light: the source (or the middle with the anchor centre), to the cut; after it the
    // anime's light is the golden burst at the middle
    const fin=clamp01((t-FINISH)/(FIN_HIT-FINISH));
    const O0=anchor==='light'?S:C, O=O0, G=(s)=>s<FLASH&&anchor==='light'?canvasOf(picture,width,height,lightAt(s).source):C;
    const R=(anchor==='light'?GLORY:RING)*ph;
    // the glory's twelve seats at second u (made once a second asked): each its angle (clockwise from twelve o'clock, y down on the picture, so y up
    // here), place, size and turn along its ray, and its sector's flash
    const made=new Map();
    const glory=(j,u)=>{
      u=Math.min(u,FINISH);
      if(!made.has(u)){
        const L=lightAt(u), src=canvasOf(picture,width,height,L.source), about=anchor==='light'?L.source:CENTER, ctr=anchor==='light'?src:C;
        const seats=seatsAt(u,anchor), share=sampleVec(STEADY[anchor],u), flash=pulseAt(PULSE[anchor],u);
        made.set(u,seats.map((a,j)=>{
          const sector=Math.min(11,Math.floor((((a%(2*Math.PI))+2*Math.PI)%(2*Math.PI))/(Math.PI/6))), s=share[sector], p=flash[sector];
          const rho=R*TIERS[j%2]*(.88+.24*L.level)*(.9+.2*s), c=[ctr[0]+rho*Math.sin(a),ctr[1]+rho*Math.cos(a)];
          // along its ray: the direction from the anime's light to the face (in the glory about the light, its own angle), a corner pointing out
          const ray=anchor==='light'?Math.PI/2-a:Math.atan2(c[1]-src[1],c[0]-src[0]), z=DEPTH*(s-.5), k=4/(4-z);
          const q=qmul(qaxis([0,0,1],ray-Math.PI/2),qaxis([1,0,0],-TILT*(.7+.3*p)));
          return {c,s:FACE*ph*k,q,z:z*R,pulse:p};
        }));
      }
      return made.get(u)[j];
    };
    const glassR=(s)=>s<FLASH?SMALL*ph:mix(SMALL*ph,HOME_R*ph,silk((s-FLASH)/(HOLD-FLASH)));
    // the glass the twelve close into, on the anime's light (the star until the cut, the middle after it): its turn from the finisher on, slowing from
    // the flash to stand still at the hold
    const spinAt=(s)=>{const u=Math.max(0,Math.min(s,FLASH)-FINISH)-clamp01((s-FIN_HIT)/HIT.stop)*HIT.stop, a=1.6*u;
      return s<=FLASH?a:a+1.6*(HOLD-FLASH)*(1-Math.pow(1-clamp01((s-FLASH)/(HOLD-FLASH)),2))/2;};
    const inGlass=(i,s)=>{const g=glassTurn(spinAt(s)),r=glassR(s),x=qrot(g,FACES[i]),o=G(s);return {c:[o[0]+r*H*x[0],o[1]+r*H*x[1]],s:r*RHO,q:qmul(g,FRAMES[i]),z:r*H*x[2]};};
    // the score's lift on every face: its attacks, and its swell from the climax on
    const lift=.25*light.attack+.45*light.risen;
    let phase, bloom=0, aligned=0, outside=1, core={r:CORE,a:0}, reveal=null, r, c=O, q=null;
    const gathered=gatheredAt(t);
    // THE BOOMERANG: the beam's direction on the canvas (y up), the star where the twelve arrive, and each face's place round it (its glory seat's
    // angle at the arrival, RING_IN out) with its turn along its ray
    const beam=[Math.sin(ENTRY),Math.cos(ENTRY)], side=[-beam[1],beam[0]], seats0=seatsAt(BOOM_END,anchor);
    const ringOf=(j,u)=>{const a=seats0[j], src=canvasOf(picture,width,height,lightAt(Math.min(u,BOOM_END)).source);
      return {c:[src[0]+RING_IN*ph*Math.sin(a),src[1]+RING_IN*ph*Math.cos(a)],s:FACE*ph,q:qmul(qaxis([0,0,1],-a),qaxis([1,0,0],-TILT)),z:0};};
    // where it starts: the twelve spread across the beam at the star, each carried along the beam past the canvas's edge from its own place, its
    // pentagon and its halo clear of it, then staggered: off the canvas at every shape (his pane's portrait put three below the picture, Oct 17 22:4x)
    const S0=canvasOf(picture,width,height,lightAt(BOOM_START).source), hw=width/height/2, clear=2.5*FACE*ph;
    const exit=(p)=>Math.max(0,Math.min(beam[0]<0?(p[0]+hw+clear)/-beam[0]:beam[0]>0?(hw+clear-p[0])/beam[0]:Infinity,
      beam[1]<0?(p[1]+.5+clear)/-beam[1]:beam[1]>0?(.5+clear-p[1])/beam[1]:Infinity));
    const entryOf=(j)=>{const lat=(j-5.5)/5.5*SPREAD*ph, p=[S0[0]+side[0]*lat,S0[1]+side[1]*lat], far=exit(p)+(BEYOND+.12*hash(j*7+1))*ph;
      return [p[0]+beam[0]*far,p[1]+beam[1]*far];};
    const flightOf=(j,u)=>{   // u 0..1 over the beam's rise: fast in, slowing as it comes home round the star
      const e=1-Math.pow(1-u,1.7), from=entryOf(j), to=ringOf(j,BOOM_START+u*(BOOM_END-BOOM_START)), arc=(j%2?1:-1)*ARC*ph*(.7+.6*hash(j*7+2))*Math.sin(Math.PI*e);
      const W=2*Math.PI*(.5+.25*hash(j*7+3)), sw=SWIRL*ph*(.7+.6*hash(j*7+4))*Math.sin(Math.PI*u), ph3=2*Math.PI*hash(j*7+5), ph2=2*Math.PI*hash(j*7+6);
      const base=at2(from,to.c,e), dir=[to.c[0]-from[0],to.c[1]-from[1]], l=Math.hypot(...dir)||1, nrm=[-dir[1]/l,dir[0]/l];
      const spin=(j%2?1:-1)*5*Math.PI*(1-e);
      return {c:[base[0]+nrm[0]*arc+sw*Math.sin(3*W*u+ph3),base[1]+nrm[1]*arc+sw*Math.sin(2*W*u+ph2)],s:FACE*ph*(1.25-.25*e),
        q:qnlerp(qmul(qaxis([0,0,1],spin),to.q),to.q,e*e),z:0};
    };
    const boom=clamp01((t-BOOM_START)/(BOOM_END-BOOM_START));
    const faces=starts.map((start,i)=>{
      const j=seatOf[i];
      let f, glow=0;
      if(t<BOOM_END){
        // THE BOOMERANG: out of the picture until the beam rises, then in with it, home round the star; a flash on each of the beam's drawings
        f=flightOf(j,boom);
        glow=t<BOOM_START?0:.7*Math.max(...pulseAt(PULSE[anchor],t));
      } else if(t<GATHERED){
        // the gathering: as the fan's drawings move (its summed motion, no ease of its own: the film paces it), from round the star to its seat,
        // turning to its ray on the way
        const st=glory(j,t), from=ringOf(j,t), p=gathered;
        f={c:at2(from.c,st.c,p),s:mix(from.s,st.s,p),q:qnlerp(from.q,st.q,p),z:mix(from.z,st.z,p)};
        glow=st.pulse*p;
      } else if(t<FINISH){
        f=glory(j,t); glow=f.pulse;
      } else if(t<FIN_HIT){
        // the finisher: the glory as the climax begins, closing into its place in the glass on the star (the star where it stands now)
        const from=glory(j,FINISH), to=inGlass(i,t), e=fin*fin*fin, o=G(t), o0=G(FINISH), carried=[from.c[0]+o[0]-o0[0],from.c[1]+o[1]-o0[1]];
        f={c:at2(carried,to.c,e),s:mix(from.s,to.s,silk(fin)),q:qnlerp(from.q,to.q,silk(fin)),z:mix(from.z,to.z,e)};
        glow=Math.max(from.pulse*(1-fin),.5*fin);
      } else f=inGlass(i,t);
      if(t>=FLASH){   // the glass home: its faces lit where the burst's rays move, gently
        const k=Math.min(11,Math.floor(((Math.atan2(f.c[0]-C[0],f.c[1]-C[1])+2*Math.PI)%(2*Math.PI))/(Math.PI/6)));
        glow=Math.max(glow,.35*pulseAt(PULSE.centre,t)[k]);
      }
      glow=clamp01(glow+lift*(t<FIN_HIT?1:.4));
      const ax=qrot(f.q,[1,0,0]), ay=qrot(f.q,[0,1,0]), n=qrot(f.q,[0,0,1]);
      return {c:f.c,z:f.z,s:f.s,q:f.q,ax:[ax[0]*f.s,ax[1]*f.s],ay:[ay[0]*f.s,ay[1]*f.s],n,glow,seat:j};
    });
    if(t<BOOM_END){
      phase='boomerang';
      const k=1-Math.pow(1-boom,1.7);
      c=at2(origin.c,S,k); r=mix(origin.r,RING_IN*ph,k);
      bloom=Math.max(...faces.map(f=>f.glow))*.6;
    } else if(t<GATHERED){
      phase='gather';
      const k=gathered;
      c=at2(S,O,k); r=mix(RING_IN*ph,R,k);
      bloom=Math.max(...faces.map(f=>f.glow))*.6;
    } else if(t<FINISH){
      phase='glory'; r=R*(.88+.24*light.level);
      bloom=Math.max(...faces.map(f=>f.glow))*.6;
    } else if(t<FLASH){
      phase='finisher';
      r=mix(R,SMALL*ph,silk(fin));
      if(t>=FIN_HIT){q=glassTurn(spinAt(t));c=G(t);}
      bloom=t>=FIN_HIT?1.3*Math.exp(-(t-FIN_HIT)/.09):0;
      core={r:CORE,a:silk((t-FIN_STOP)/(FLASH-FIN_STOP))};
      if(t>=FIN_HIT)faces.forEach(f=>{f.glow=Math.max(f.glow,Math.exp(-(t-FIN_HIT)/.09));});
    } else {
      phase='return'; c=C;
      const k=clamp01((t-FLASH)/(HOLD-FLASH));
      r=glassR(t); q=glassTurn(spinAt(t));
      aligned=silk((k-.55)/.45); outside=mix(1,MASK_BACKGROUND,silk((k-.35)/.65));
      bloom=Math.exp(-(t-FLASH)/.12);
      core={r:CORE,a:1};
      // the rise: the film's golden flash opens out of the middle, a circle of it running out with the flash's shock (RISE_SPEED picture
      // heights a second) until it has passed the canvas's farthest corner; outside it, for those frames, the dark
      const far=Math.hypot(width/height/2+Math.abs(C[0]),.5+Math.abs(C[1])), Rr=RISE_SPEED*ph*(t-FLASH);
      reveal=Rr<far+.05?{s:C,r:Rr,far}:null;
    }
    // the hole, while it is out in the world: where the anime's light comes from, an eclipse of it, growing with the light; in the finisher it closes
    // into the glass there
    let sing=null;
    if(HOLE&&t>=SING_OPEN&&t<FLASH){
      const close=1-silk((t-FIN_STOP)/(FLASH-.01-FIN_STOP)), rh=(RH+RH_LIGHT*light.level)*ph*silk((t-SING_OPEN)/.9)*close;
      const pinch=t<FIN_STOP?0:.3*ph*silk((t-FIN_STOP)/(FLASH-FIN_STOP)), flash=Math.max(...faces.map(f=>f.glow));
      sing={c:G(t),rh,lens:LENS*rh,swirl:1.2+1.6*light.risen,pinch,ring:(.85+.5*flash+.5*light.risen)*silk((t-SING_OPEN)/.5)};
    }
    // the light's throbs: a ring of it out of the anime's light at each; the finisher's out of the glass on the star and the rise's out of the middle,
    // each with a shake
    const throb=THROBS.filter(ts=>t>=ts&&t<ts+.6).map((ts,n)=>({ts,i:n,c:canvasOf(picture,width,height,lightAt(ts).source),a:.016,v:.8,life:.6,shake:0}));
    const impacts=[...throb,
      {ts:FIN_HIT,i:5,c:G(FIN_HIT),a:.03,v:1,life:.7,shake:.012},
      {ts:FLASH,i:6,c:C,a:.04,v:RISE_SPEED,life:.6,shake:.01}].filter(m=>t>=m.ts&&t<m.ts+m.life);
    const rhAt=(ts)=>(RH+RH_LIGHT*lightAt(ts).level)*ph;
    const shocks=impacts.slice(-3).reverse().map(m=>({c:m.c,r:(m.ts===FLASH?0:m.ts===FIN_HIT?SMALL*ph:rhAt(m.ts))+m.v*ph*(t-m.ts),a:m.a*ph*Math.exp(-(t-m.ts)/(m.life/2))}));
    const shake=[0,0];
    for(const m of impacts){const d=t-m.ts;if(d>.45||!m.shake)continue;const k=m.shake*Math.exp(-d/.1);shake[0]+=k*Math.sin(37*d+1.3*m.i);shake[1]+=k*Math.cos(29*d+.7*m.i);}
    // inside the canvas, every face whole once the twelve are home round the star (never while they fly in from beyond its edge)
    for(const f of faces){
      const e=1.05*f.s, w=t<BOOM_END?0:t<GATHERED?gathered:1;
      const k=[Math.max(-width/height/2+e,Math.min(width/height/2-e,f.c[0])),Math.max(-.5+e,Math.min(.5-e,f.c[1]))];
      f.c=at2(f.c,k,w);
    }
    const travel=t<FLASH?clamp01(age/(FLASH-START)):1;
    return {c,r,q,faces,age,phase,anchor,light:t<FLASH?S:canvasOf(picture,width,height,lightAt(t).source),target:O,center:sing?sing.c:C,shrink:silk(age/.32),travel,picture,outside,aligned,wake:0,bloom,sing,shocks,shake,
      sparks:[],reveal,core,hits:THROBS.filter(ts=>t>=ts).length+(t>=FIN_HIT?1:0),halo:1,spin:spinAt(t)};
  }

  /** Its wake, for a reader: where the formation's centre was at t, t - dt, ... (out.length / 2 points, x y pairs); the faces draw their own
   *  streaks (theater.js uFace), so the theater does not ask for it. */
  function flightTrail(t, width, height, origin, out, dt = 1/45, opts) {
    const n=out.length/2;
    for(let i=0;i<n;i++){
      const f=skyFlight(Math.max(START,t-i*dt),width,height,origin,opts), c=f?f.c:origin.c;
      out[i*2]=c[0]; out[i*2+1]=c[1];
    }
    return out;
  }

  return Object.freeze({start: START, cut: FLASH, hold: HOLD, SOURCE, THROBS, BOOM_START, BOOM_END, SING_OPEN, ENTRY, GATHERED, FINISH, FIN_HIT, SCORE,
    gatherFrames: FULLEST - ARRIVE_I, gatheredAt, seatsAt, lightAt, target: skyTarget, flight: skyFlight, trail: flightTrail});
}

// THE TWELVE over the Sagittarius's span (his Oct 17 words in the header), its moments read off its measure as they always were
const SKY = twelveLaw(TWELVE_DCT, {start: SKY_FLIGHT_START, cut: SKY_FLASH, hold: SKY_HOLD, after: 'return', hole: true,
  entry: [4, 9],   // the beam's foot below the star, from four to ten o'clock (not its head in the sky)
  // the beam's first drawing after the cut (the first frame whose gold reaches half a unit: 1291) and its arrival at the star (the first frame after
  // it whose gold reaches 3: the star bursts, 1302)
  boom: ({LIGHT, F0, firstAfter}) => { const beam = firstAfter(F0, (i) => LIGHT[i] >= .5), arrive = firstAfter(F0 + beam, (i) => LIGHT[i] >= 3); return {beam, arrive, from: F0 + beam - .5}; },
  // the fan's fullest: the light's brightest from 1300, before the fan draws back (1320)
  fullest: ({LIGHT, F0, N}) => { let best = -1, at = 0; for (let i = 0; i < N && F0 + i < 1320; i++) if (F0 + i >= 1300 && LIGHT[i] > best) { best = LIGHT[i]; at = i; } return at; },
  finishFrom: () => 1320,   // the score's floor over the starburst, from 1320
});
export const {SOURCE, THROBS, BOOM_START, BOOM_END, SING_OPEN, ENTRY, GATHERED, FINISH, SCORE, gatherFrames: SKY_GATHER_FRAMES} = SKY;
export const gatheredAt = SKY.gatheredAt, seatsAt = SKY.seatsAt, lightAt = SKY.lightAt, skyTarget = SKY.target, skyFlight = SKY.flight, flightTrail = SKY.trail;
