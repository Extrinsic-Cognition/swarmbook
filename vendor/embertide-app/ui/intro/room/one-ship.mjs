// one-ship.mjs · THE SHIP: the room as a vessel, the voyage one cause on the house axis, and its sky through every porthole (Oct 18 2026).
// His link, Oct 18 2026 15:31 WEST, after 15:20 "do you know or not about turning our shit into a submarine?" and 15:29 the projector: "no dude please
// ponder on this: * https://x.com/nomakuro_vrc/status/2111793497082843406", Nomakuro's VRChat world Space Ship & Chill, a cabin ringed by windows on a
// relativistic voyage with a HUD of two clocks. Read and judged in ec-workspace docs/space-ship-and-chill-the-room-as-a-vessel-2026-10-18.md: his room
// has been a vessel since Sept 13 ("THINK OF EMBERTIDE-ZERO AS IF IT WAS THE SOLARIS SPACESHIP"), every screen a window onto one scene since Sept 15
// ("ALL WINDOWS HAVE GOTTA BE WINDOWS ONTO THE SAME FUCKING VIRTUAL REALITY SCENE"), its clocks the speed of causality since Sept 25.
//
// THE VOYAGE is one cause, a field of the sea's own word (room/sea's `voyage`: {to, a, at}; no entity of its own, ORFAM): the relativistic rocket at
// a constant proper acceleration a, turned over half way so it arrives at rest (the world's HUD is this rocket: one acceleration, a / c = 0.1016 per
// second, read off four pairs of its readings). On the word's clock (the house's ms, or the song's own position: one song, one voyage, C-3) the ship's
// proper time is tau = (axis_ms - at) / 1000 and its rapidity phi = a tau / c; the four functions of it, in doubles:
//     gamma = cosh phi    beta = tanh phi    Earth's time t = (c / a) sinh phi    the distance x = (c^2 / a)(cosh phi - 1)
// and the second half mirrored (phi = a (tau_end - tau) / c, t = t_end - (c / a) sinh phi, x = X - (c^2 / a)(cosh phi - 1)). Before `at` and after
// the arrival the ship is PARKED and paints nothing (foundation 3).
// THE SKY is one-sea.mjs's porthole with the sea's plane hit swapped for a sky at infinity in the vessel's frame (the Station's axes). A pixel whose ray
// from the eye leaves theta' off the bow sees the star that sits at rest-frame theta, cos theta = (cos theta' - beta) / (1 - beta cos theta'), its
// light Doppler-shifted by D = 1 / (gamma (1 - beta cos theta')). The shader takes them by the half angle, which float32 keeps at any gamma:
//     tan(theta / 2) = e^phi tan(theta' / 2)        D = (1 + tan^2(theta' / 2)) / (e^-phi + e^phi tan^2(theta' / 2))
// A blackbody at T is seen as the blackbody at T D (I_nu / nu^3 is invariant): a star's flux goes as D^2 and a glow's surface brightness as D^4 (both
// bolometric: the test integrates Planck's law to hold them), and the eye sees the blackbody at T D in its own band (the shader samples it at 610, 550
// and 465 nm, white a 6504 K blackbody). The stars are procedural from a seed (0 bytes, the same integers on every GPU: a mod-289 permutation is exact
// in float32), the 2.7255 K background a glow over the whole sky, the band of the galaxy a glow, and the destination a star dead ahead at its distance
// left. Whether the eye sees the exact law (one bright point ahead and black side windows at high gamma) or a sky capped at a gamma is his call
// (`eye_gamma_max`); the HUD is exact either way.
// Pure: no I/O, no clock, no DOM; f64 throughout. Bad input gives null, never a throw.
import { dot, unit } from './one-law.mjs';

export const C = 299792458;                   // m/s
export const YEAR_S = 31557600;               // s: the Julian year, the light-year's (365.25 d)
export const LY_M = C * YEAR_S;               // m: 9.4607304725808e15
export const DAY_S = 86400;
export const T_CMB = 2.7255;                  // K: the cosmic background (Fixsen 2009)
export const WORLD_A_C = 0.1016;              // per second: the world's a / c off its HUD (a = 3.05e7 m/s^2, 3.1 million g, c / a = 9.84 s)
export const PHI_EYE_MAX = 40;                // the most rapidity a shader is handed (e^40 = 2.4e17 is a float32; Andromeda at the world's a turns over at 29.7)
export const SKY_EPS_PHI = 1e-4;              // a sky is painted again once the eye's rapidity moved this much (or a cause of the picture did); less moves no pixel
export const DESTINATIONS = Object.freeze({   // the world's three; ly the distance, T the colour temperature, v_mag the visual magnitude seen from Earth
  proxima: Object.freeze({ name: 'Proxima Centauri', ly: 4.2465, T: 3042, v_mag: 11.13 }),
  betelgeuse: Object.freeze({ name: 'Betelgeuse', ly: 548, T: 3600, v_mag: 0.5 }),       // 548 ly: Joyce et al. 2020 (estimates run 500 to 650)
  andromeda: Object.freeze({ name: 'the Andromeda galaxy', ly: 2.537e6, T: 4500, v_mag: 3.44 }),
});
export const SEAT_RE = /^[A-Za-z0-9_.-]{1,40}$/;

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const fin3 = (p) => Array.isArray(p) && p.length === 3 && p.every(num);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// ---------------------------------------------------------------------------------------------------------------- the four functions

/** THE FOUR FUNCTIONS of the rapidity phi and the proper acceleration a (m/s^2): the Lorentz factor, the speed in c, Earth's seconds and the metres
 *  since departure on the accelerating half. The distance is written 2 sinh^2(phi / 2) (cosh phi - 1 cancels near 0). */
export const gammaOf = (phi) => (num(phi) ? Math.cosh(phi) : null);
export const betaOf = (phi) => (num(phi) ? Math.tanh(phi) : null);
export const earthOf = (phi, a) => (num(phi) && num(a) && a > 0 ? (C / a) * Math.sinh(phi) : null);
export function distanceOf(phi, a) { if (!num(phi) || !num(a) || !(a > 0)) return null; const s = Math.sinh(phi / 2); return (C * C / a) * 2 * s * s; }
/** deficitOf(phi): 1 - beta, kept where beta itself rounds to 1 (phi over 18.7): 2 / (1 + e^(2 phi)). */
export const deficitOf = (phi) => (num(phi) ? 2 / (1 + Math.exp(2 * phi)) : null);
/** acosh(1 + k) for k >= 0, exact near 0. */
export const acosh1p = (k) => Math.log1p(k + Math.sqrt(k * (2 + k)));
/** rapidityOfGamma(gamma), and of a speed beta < 1 (the HUD's readings back to phi). */
export const rapidityOfGamma = (g) => (num(g) && g >= 1 ? acosh1p(g - 1) : null);
export const rapidityOfBeta = (b) => (num(b) && b >= 0 && b < 1 ? Math.atanh(b) : null);

/** planOf(X, a): the voyage of X metres at a, turned over half way: { X, a, phi_mid, tau_mid, tau_end (s aboard), t_mid, t_end (Earth s) } or null. */
export function planOf(X, a) {
  if (!num(X) || !(X > 0) || !num(a) || !(a > 0)) return null;
  const phi_mid = acosh1p(a * X / (2 * C * C)), tau_mid = (C / a) * phi_mid, t_mid = (C / a) * Math.sinh(phi_mid);
  return [phi_mid, tau_mid, t_mid, 2 * tau_mid, 2 * t_mid].every(num) ? { X, a, phi_mid, tau_mid, tau_end: 2 * tau_mid, t_mid, t_end: 2 * t_mid } : null;
}
/** accelerationFor(X, seconds): the a that arrives in that many seconds aboard (the writer's --minutes): a from the plan's own law, by bisection on log a. */
export function accelerationFor(X, seconds) {
  if (!num(X) || !(X > 0) || !num(seconds) || !(seconds > 0)) return null;
  let lo = -40, hi = 80;   // ln a: from 4e-18 to 5.5e34 m/s^2
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2, p = planOf(X, Math.exp(mid)); if (!p) return null; if (p.tau_end > seconds) lo = mid; else hi = mid; }
  return Math.exp((lo + hi) / 2);
}

// ---------------------------------------------------------------------------------------------------------------- the voyage's word

/** voyageOf(value): the word's `voyage` as the law reads it, whole, or null (none, or not one).
 *    to: 'proxima' | 'betelgeuse' | 'andromeda' (DESTINATIONS), or a name of its own with `ly`; ly: light-years (a destination's own when unsaid);
 *    a: m/s^2 > 0; at: the departure on the word's clock (ms: the house's, or the song's own position); bow: the direction of flight, unit, the Station's
 *    axes (-z when unsaid); glasses: the seats that show the sky (none when unsaid); hud: the one seat that shows the HUD (the first glass when
 *    unsaid); seed: the stars (an integer, taken mod 289); eye_gamma_max: the most gamma the sky is drawn at (null: the exact law); alpha: the sky's. */
export function voyageOf(value) {
  if (!value || typeof value !== 'object') return null;
  const dest = typeof value.to === 'string' && Object.prototype.hasOwnProperty.call(DESTINATIONS, value.to) ? DESTINATIONS[value.to] : null;
  const ly = num(value.ly) && value.ly > 0 ? value.ly : dest ? dest.ly : null;
  if (ly == null || !num(value.a) || !(value.a > 0) || !num(value.at)) return null;
  const plan = planOf(ly * LY_M, value.a); if (!plan) return null;
  const glasses = (Array.isArray(value.glasses) ? value.glasses : []).filter((s) => typeof s === 'string' && SEAT_RE.test(s)).slice(0, 16);
  const hud = typeof value.hud === 'string' && SEAT_RE.test(value.hud) ? value.hud : glasses[0] ?? null;
  const name = dest ? dest.name : typeof value.name === 'string' && value.name.trim() ? value.name.trim().slice(0, 60) : typeof value.to === 'string' && SEAT_RE.test(value.to) ? value.to : `${ly} ly`;
  return Object.freeze({
    to: typeof value.to === 'string' ? value.to.slice(0, 40) : null, name, ly, a: value.a, at: value.at,
    bow: (fin3(value.bow) && unit(value.bow)) || [0, 0, -1], glasses: Object.freeze(glasses), hud,
    seed: Number.isSafeInteger(value.seed) ? ((value.seed % 289) + 289) % 289 : 0,
    eye_gamma_max: num(value.eye_gamma_max) && value.eye_gamma_max >= 1 ? value.eye_gamma_max : null,
    alpha: num(value.alpha) ? clamp(value.alpha, 0, 1) : 1,
    T_dest: num(value.T) && value.T > 0 ? value.T : dest ? dest.T : 5000, v_mag: num(value.v_mag) ? value.v_mag : dest ? dest.v_mag : 6,
    ...plan,
  });
}

/** voyageAt(v, axis_ms): the ship at one position of the word's clock (ms) -> { state: 'before' | 'accelerating' | 'decelerating' | 'arrived', parked,
 *  tau (s aboard since departure; negative before it), phi, gamma, beta, deficit (1 - beta), t (Earth s since departure), x (m flown), to_go (m),
 *  left (s aboard to the arrival) } or null. One formula on any clock: the caller hands the axis (one-sea.mjs axisOf). */
export function voyageAt(v, axis_ms) {
  if (!v || !num(axis_ms)) return null;
  const tau = (axis_ms - v.at) / 1000, ca = C / v.a;
  let state, phi, t, x;
  if (tau < 0) { state = 'before'; phi = 0; t = 0; x = 0; }
  else if (tau >= v.tau_end) { state = 'arrived'; phi = 0; t = v.t_end; x = v.X; }
  else if (tau < v.tau_mid) { state = 'accelerating'; phi = tau / ca; t = earthOf(phi, v.a); x = distanceOf(phi, v.a); }
  else { state = 'decelerating'; phi = (v.tau_end - tau) / ca; t = v.t_end - earthOf(phi, v.a); x = v.X - distanceOf(phi, v.a); }
  return { state, parked: state === 'before' || state === 'arrived', tau, phi, gamma: Math.cosh(phi), beta: Math.tanh(phi), deficit: deficitOf(phi), t, x,
    to_go: Math.max(0, v.X - x), left: Math.max(0, v.tau_end - Math.max(0, tau)) };
}
/** The four functions of one cause and the house axis: the voyage's word and a position of its clock (ms). */
export const gammaAt = (v, axis_ms) => voyageAt(v, axis_ms)?.gamma ?? null;
export const betaAt = (v, axis_ms) => voyageAt(v, axis_ms)?.beta ?? null;
export const earthAt = (v, axis_ms) => voyageAt(v, axis_ms)?.t ?? null;
export const distanceAt = (v, axis_ms) => voyageAt(v, axis_ms)?.x ?? null;
/** eyePhiOf(v, phi): the rapidity the sky is drawn at: the law's, or capped at eye_gamma_max (his call), and never over PHI_EYE_MAX (float32). */
export const eyePhiOf = (v, phi) => (!num(phi) ? null : Math.min(phi, v && v.eye_gamma_max ? rapidityOfGamma(v.eye_gamma_max) : Infinity, PHI_EYE_MAX));

// ---------------------------------------------------------------------------------------------------------------- the sky's law, per direction

/** skyOf(phi, tq): the law for a ray seen aboard theta' off the bow, given by tq = tan(theta' / 2) (0 at the bow, Infinity at the stern): { T: tan(theta / 2)
 *  of the rest frame's angle, cos_t, sin_t, D (the Doppler factor) }. The shader's own words, in doubles. */
export function skyOf(phi, tq) {
  if (!num(phi) || !(tq >= 0)) return null;
  const e = Math.exp(phi), ie = Math.exp(-phi);
  if (tq === Infinity) return { T: Infinity, cos_t: -1, sin_t: 0, D: ie };
  const T = e * tq, t2 = tq * tq, u = T > 1 ? 1 / T : T, u2 = u * u;
  return { T, cos_t: T > 1 ? (u2 - 1) / (u2 + 1) : (1 - u2) / (1 + u2), sin_t: (2 * u) / (1 + u2), D: (1 + t2) / (ie + e * t2) };
}
/** The textbook forms the half-angle ones are held to: the rest frame's cos theta and the Doppler factor from cos theta' (the brief's own words). */
export const restCosOf = (beta, cos_tp) => (cos_tp - beta) / (1 - beta * cos_tp);
export const dopplerOf = (gamma, beta, cos_tp) => 1 / (gamma * (1 - beta * cos_tp));
/** seenAtOf(phi, theta): where aboard (theta', rad off the bow) a star at rest-frame theta is seen: tan(theta' / 2) = e^-phi tan(theta / 2). */
export const seenAtOf = (phi, theta) => (num(phi) && num(theta) ? 2 * Math.atan(Math.exp(-phi) * Math.tan(theta / 2)) : null);
/** halfTanOf(d, bow): tan(theta' / 2) of a unit ray against the bow, by |d - bow| / |d + bow| (no cancellation at the bow or the stern). */
export function halfTanOf(d, bow) {
  if (!fin3(d) || !fin3(bow)) return null;
  const m = Math.hypot(d[0] - bow[0], d[1] - bow[1], d[2] - bow[2]), p = Math.hypot(d[0] + bow[0], d[1] + bow[1], d[2] + bow[2]);
  return p > 0 ? m / p : Infinity;
}
/** restDirOf(d, bow, phi): the rest frame's direction of the star a unit ray d sees aboard (the Station's axes), and its D: { dir, D, T, tq }. */
export function restDirOf(d, bow, phi) {
  const tq = halfTanOf(d, bow), s = tq == null ? null : skyOf(phi, tq); if (!s) return null;
  const k = dot(d, bow), perp = [d[0] - k * bow[0], d[1] - k * bow[1], d[2] - k * bow[2]];
  const e = unit(perp) || unit(Math.abs(bow[0]) < 0.9 ? [0, -bow[2], bow[1]] : [-bow[2], 0, bow[0]]) || [1, 0, 0];
  return { dir: [s.cos_t * bow[0] + s.sin_t * e[0], s.cos_t * bow[1] + s.sin_t * e[1], s.cos_t * bow[2] + s.sin_t * e[2]], D: s.D, T: s.T, tq };
}

// ---------------------------------------------------------------------------------------------------------------- the light: Planck's law

export const C2 = 0.014387769;                // m K: Planck's second radiation constant, h c / k
export const H = 6.62607015e-34, KB = 1.380649e-23, SIGMA = 5.670374419e-8;
export const WAVES_NM = Object.freeze([610, 550, 465]);   // the eye's three samples (near sRGB's primaries' dominant wavelengths)
export const KS = Object.freeze(WAVES_NM.map((nm) => C2 / (nm * 1e-9)));   // c2 / lambda, K
export const T_WHITE = 6504;                  // K: the blackbody the three samples call white
export const WHITE = Object.freeze(KS.map((k) => Math.expm1(k / T_WHITE)));
/** bandOf(T): a blackbody at T in the eye's three samples, each over a 6504 K blackbody's at its wavelength ([1, 1, 1] at 6504 K):
 *  (e^(c2 / lambda T_white) - 1) / (e^(c2 / lambda T) - 1); 0 where none of it reaches the band (the background at rest). */
export function bandOf(T) { if (!num(T) || !(T > 0)) return [0, 0, 0]; return KS.map((k, i) => { const x = k / T; return x > 700 ? 0 : WHITE[i] / Math.expm1(x); }); }
/** planckOf(lambda_m, T): Planck's spectral radiance B_lambda(T), W / (m^2 sr m). */
export function planckOf(lambda, T) { if (!(lambda > 0) || !(T > 0)) return 0; const x = C2 / (lambda * T); return x > 700 ? 0 : (2 * H * C * C) / lambda ** 5 / Math.expm1(x); }
/** bolometricOf(T): the radiance of a blackbody summed over every wavelength, sigma T^4 / pi (W / m^2 sr). */
export const bolometricOf = (T) => (num(T) && T > 0 ? (SIGMA * T ** 4) / Math.PI : 0);
/** What the law says a Doppler factor does to a blackbody, bolometric: a glow's surface brightness times D^4, a star's flux times D^2 (its solid
 *  angle shrinks as 1 / D^2). The test integrates planckOf at T D to hold both. */
export const glowGainOf = (D) => D ** 4;
export const starGainOf = (D) => D ** 2;

// ---------------------------------------------------------------------------------------------------------------- the stars, procedural from a seed

/** THE STARS: N x N cells on each face of a cube, near equal-angle (the warp below), at most one star a cell, its place jittered inside the cell's inner
 *  part (so its image never crosses its cell: one cell read a pixel), its magnitude from the counts of a Euclidean sky (N(<m) ~ 10^(0.6 m)), its
 *  temperature from 3000 to 30000 K, mostly cool. F0: the flux of magnitude 0 in the unit of the shader's light (a 6504 K blackbody's radiance times a
 *  steradian; Vega's disc of 3.2 mas at 9600 K gives 2.9e-15). The band of the galaxy: a glow across the map's equator, its surface brightness the Milky
 *  Way's own (about 20.5 magnitudes a square arcsecond), so at rest it lies under the faintest star's image and lights up only as D lifts it. */
export const STARS = Object.freeze({ N: 64, p: 0.6, inner: 0.2, m_max: 6, m_min: -1.5, T_lo: 3000, T_hi: 30000, F0: 2.9e-15, T_glow: 5000, band_w: 0.16, band_mag_arcsec2: 20.5 });
export const ARCSEC2_SR = (Math.PI / 648000) ** 2;   // a square arcsecond in steradians
/** bandGlowOf(): the band's surface brightness at rest in the green sample, the shader's unit a steradian. */
export const bandGlowOf = () => (STARS.F0 * 10 ** (-0.4 * STARS.band_mag_arcsec2)) / ARCSEC2_SR;
export const perm = (x) => ((34 * x + 1) * x) % 289;   // Ashima's permutation of 0..288: every product under 2^24, so float32 gives the same integers
/** THE CUBE'S WARP: u = s (a - b |s|), within 0.005 of the equal-angle map 4 atan(s) / pi (its cells within 1.4 of each other in solid angle) for one
 *  multiply-add on a GPU, where atan is a long polynomial (lysa's Intel GPU read the sky at twice the sea with two of them a pixel); its inverse one square root. */
export const WARP = Object.freeze({ a: 1.3476, b: 0.3476 });
export const warpOf = (s) => s * (WARP.a - WARP.b * Math.abs(s));
export const unwarpOf = (u) => (Math.sign(u) * (WARP.a - Math.sqrt(WARP.a * WARP.a - 4 * WARP.b * Math.abs(u)))) / (2 * WARP.b);
/** cellOf(m): the cube face and cell of a unit direction of the star map: { f (0..5), i, j, u, v (the warped face coordinates, -1..1), A, U, V (the face's
 *  axes) }; the shader's own branches. */
export function cellOf(m, N = STARS.N) {
  if (!fin3(m)) return null;
  const ax = Math.abs(m[0]), ay = Math.abs(m[1]), az = Math.abs(m[2]);
  let f, A, U, V;
  if (ax >= ay && ax >= az) { f = m[0] > 0 ? 0 : 1; A = [Math.sign(m[0]) || 1, 0, 0]; U = [0, 0, 1]; V = [0, 1, 0]; }
  else if (ay >= az) { f = m[1] > 0 ? 2 : 3; A = [0, Math.sign(m[1]) || 1, 0]; U = [1, 0, 0]; V = [0, 0, 1]; }
  else { f = m[2] > 0 ? 4 : 5; A = [0, 0, Math.sign(m[2]) || 1]; U = [1, 0, 0]; V = [0, 1, 0]; }
  const ma = dot(m, A); if (!(ma > 0)) return null;
  const u = warpOf(dot(m, U) / ma), v = warpOf(dot(m, V) / ma);
  return { f, i: clamp(Math.floor((u + 1) * 0.5 * N), 0, N - 1), j: clamp(Math.floor((v + 1) * 0.5 * N), 0, N - 1), u, v, A, U, V };
}
/** starOf(f, i, j, seed): the cell's star, as the shader draws it, or null: { su, sv (its place, warped face coordinates), m (magnitude), T (K), F (flux, the
 *  shader's unit), dir (unit, the map's frame) }. The integers are the shader's: perm and mod 289, exact in float32 on every GPU. */
export function starOf(f, i, j, seed = 0, N = STARS.N) {
  if (![f, i, j, seed].every(Number.isInteger)) return null;
  let a = perm((i + seed) % 289); a = perm((a + j) % 289); a = perm((a + f) % 289);
  if (!(a < STARS.p * 289)) return null;
  const b = perm((a + i + 1) % 289), c = perm((b + j + 2) % 289), d = perm((c + f + 3) % 289), e = perm((d + 5) % 289), h = perm((e + 7) % 289);
  const su = -1 + ((i + STARS.inner + (1 - 2 * STARS.inner) * (b / 288)) * 2) / N, sv = -1 + ((j + STARS.inner + (1 - 2 * STARS.inner) * (c / 288)) * 2) / N;
  const mag = Math.max(STARS.m_min, STARS.m_max + Math.log10((d * 289 + e + 0.5) / 83521) / 0.6), T = STARS.T_lo + (STARS.T_hi - STARS.T_lo) * ((h + 0.5) / 289) ** 4;   // two of them for the magnitude: 83,521 steps reach -1.5
  const cell = { 0: [[1, 0, 0], [0, 0, 1], [0, 1, 0]], 1: [[-1, 0, 0], [0, 0, 1], [0, 1, 0]], 2: [[0, 1, 0], [1, 0, 0], [0, 0, 1]], 3: [[0, -1, 0], [1, 0, 0], [0, 0, 1]], 4: [[0, 0, 1], [1, 0, 0], [0, 1, 0]], 5: [[0, 0, -1], [1, 0, 0], [0, 1, 0]] }[f];
  if (!cell) return null;
  const [A, U, V] = cell, s = unwarpOf(su), t = unwarpOf(sv);
  return { su, sv, m: mag, T, F: STARS.F0 * 10 ** (-0.4 * mag), dir: unit([A[0] + s * U[0] + t * V[0], A[1] + s * U[1] + t * V[1], A[2] + s * U[2] + t * V[2]]) };
}
/** meanGlowOf(): the stars' mean radiance over the sky at rest, in the green sample (what they add up to where a pixel holds many of them): the stars a
 *  steradian times their mean flux, from the same distribution (the magnitude 6 + log10(h) / 0.6 of a uniform h, its mean flux 3 F0 10^-2.4, less 2 % by the cap at -1.5). */
export const meanGlowOf = () => (STARS.p * 6 * STARS.N * STARS.N) / (4 * Math.PI) * 3 * STARS.F0 * 10 ** (-0.4 * STARS.m_max);
/** rotationOf(seed): the star map's turn against the Station's axes (rows of a 3 x 3 rotation), from the seed alone: the same sky for the same seed. */
export function rotationOf(seed = 0) {
  const s = Number.isSafeInteger(seed) ? ((seed % 289) + 289) % 289 : 0, h = (k) => perm((perm((s + k) % 289) + k) % 289) / 289;
  const a = 2 * Math.PI * h(11), b = Math.acos(1 - 2 * h(23)), g = 2 * Math.PI * h(37);   // z-y-z Euler angles: a turn of the whole sphere
  const [ca, sa, cb, sb, cg, sg] = [Math.cos(a), Math.sin(a), Math.cos(b), Math.sin(b), Math.cos(g), Math.sin(g)];
  return [[ca * cb * cg - sa * sg, -ca * cb * sg - sa * cg, ca * sb], [sa * cb * cg + ca * sg, -sa * cb * sg + ca * cg, sa * sb], [-sb * cg, sb * sg, cb]];
}
/** destinationOf(v, st, phi_eye): the destination's light seen aboard, dead ahead: its visual flux from Earth scaled by (X / distance left)^2 (never
 *  nearer than X / 1e6), turned by the bow's Doppler factor e^phi into the eye's band as any star's: F c(T D) / (c_G(T) D^2). [r, g, b], the shader's unit. */
export function destinationOf(v, st, phi_eye) {
  if (!v || !st || !num(phi_eye)) return [0, 0, 0];
  const r = Math.max(st.to_go, v.X * 1e-6), F = STARS.F0 * 10 ** (-0.4 * v.v_mag) * (v.X / r) ** 2, D = Math.exp(phi_eye), g = bandOf(v.T_dest)[1];
  const seen = bandOf(v.T_dest * D); return g > 0 ? seen.map((c) => (F * c) / (g * D * D)) : [0, 0, 0];
}

// ---------------------------------------------------------------------------------------------------------------- the HUD: text from the same functions

const pad = (n, w = 2) => String(Math.floor(n)).padStart(w, '0');
/** gammaText(gamma): 5.369, 282.0, 3.96e4. */
export function gammaText(g) { if (!num(g)) return '?'; if (g < 10) return g.toFixed(3); if (g < 1000) return g.toPrecision(4); return g.toExponential(2).replace('e+', 'e'); }
/** ratioText(gamma): what one second aboard is on Earth, as the world's HUD says it: 5.4 s, 4.7 min, 11.0 h, 69.0 d, 4.0 y. */
export function ratioText(g) {
  if (!num(g)) return '?';
  if (g < 60) return `${g.toFixed(1)} s`; if (g < 3600) return `${(g / 60).toFixed(1)} min`; if (g < DAY_S) return `${(g / 3600).toFixed(1)} h`;
  if (g < YEAR_S) return `${(g / DAY_S).toFixed(1)} d`; const y = g / YEAR_S; return y < 1000 ? `${y.toPrecision(y < 10 ? 2 : 3)} y` : `${y.toExponential(2).replace('e+', 'e')} y`;
}
/** cText(deficit): the speed as a percent of c, its nines kept where beta rounds to 1: 98.25, 99.998..., 99.9999999999999997... (then 1 - beta beside it). */
export function cText(deficit) {
  if (!num(deficit) || deficit < 0 || deficit > 1) return '?';
  const d = 100 * deficit; if (d >= 0.01) return (100 - d).toFixed(2);
  const m = Math.floor(-Math.log10(d)), digit = Math.max(0, Math.min(9, Math.floor((10 ** -m - d) * 10 ** (m + 1))));
  return m <= 14 ? `99.${'9'.repeat(m)}${digit}…` : `99.${'9'.repeat(12)}… (1 − β = ${deficit.toExponential(2).replace('e-', 'e−')})`;
}
/** countdownText(s): the time left aboard: 06:01, 1:02:03, 3 d 04:05, 3.5 y. */
export function countdownText(s) {
  if (!num(s) || s < 0) return '?';
  if (s < 3600) return `${pad(s / 60)}:${pad(s % 60)}`; if (s < DAY_S) return `${Math.floor(s / 3600)}:${pad((s % 3600) / 60)}:${pad(s % 60)}`;
  if (s < 100 * DAY_S) return `${Math.floor(s / DAY_S)} d ${pad((s % DAY_S) / 3600)}:${pad((s % 3600) / 60)}`; return `${(s / YEAR_S).toFixed(1)} y`;
}
/** lisbonOf(ms): his clock's offset at a UTC instant: WEST (+1 h) from the last Sunday of March 01:00 UTC to the last Sunday of October 01:00 UTC, else WET. */
export function lisbonOf(ms) {
  const y = new Date(ms).getUTCFullYear(), last = (mo) => { const e = Date.UTC(y, mo + 1, 0, 1); return e - new Date(e).getUTCDay() * DAY_S * 1000; };
  return ms >= last(2) && ms < last(9) ? { off_ms: 3600000, zone: 'WEST' } : { off_ms: 0, zone: 'WET' };
}
/** dateText(ms): Earth's calendar at a UTC instant, on his clock: 2026-10-18 16:42 WEST; past the calendar's reach (275,000 years) the year alone. */
export function dateText(ms) {
  if (!num(ms)) return '?';
  if (Math.abs(ms) > 8.6e15) return `year ${Math.floor(1970 + ms / (YEAR_S * 1000)).toLocaleString('en-US')}`;
  const z = lisbonOf(ms), d = new Date(ms + z.off_ms);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} ${z.zone}`;
}
/** hudOf(v, st, base_ms): the HUD's four lines, every number from the four functions: where to, the phase and the countdown; gamma and one second
 *  aboard on Earth; the percent of c; Earth's date (base_ms: the departure's instant on Earth's calendar, plus Earth's time since). null when parked. */
export function hudOf(v, st, base_ms) {
  if (!v || !st || st.parked) return null;
  return [`${v.name} · ${st.state} · arrival in ${countdownText(st.left)}`, `γ ${gammaText(st.gamma)} · 1 s aboard = ${ratioText(st.gamma)} on Earth`,
    `${cText(st.deficit)} % of c`, `Earth ${num(base_ms) ? dateText(base_ms + st.t * 1000) : '?'}`];
}
