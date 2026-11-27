// braindance.mjs: THE EVENT IN ONE VECTOR SPACE, SAMPLED BY THE FILM'S SECOND. His words, Oct 14 2026 14:4x WEST: "start having spatial
// computing awareness of where the fight is happening... if you want to make a cinematography replication you need to be able to correctly
// place athena from the height of where she is and all that dude"; "like imagine that you are needing to make a 4DGS of the trajectory AKA
// BRAINDANCE of the event here"; "IT IS VECTORIAL SPACES AND NORMAL DISTRIBUTIONS ALL THE WAY DOWN".
//
// braindance.json is the record: the fight's ground as the origin, every actor, light and camera of the film's first 81 s as tracks over the
// film's seconds, each placement a mean and a sigma in metres (a drawn film gives a ray and a size, not a point: the sigma is what the frames
// allow). This module reads it: what stands where at a second, the shot the camera is in, and the turn from the arena's metres into a page's
// units, so a page replicating a shot (the hero: Athena outside the dodecahedron, above the fight, looking down) takes its places from here
// and never from a number of its own. Nothing here draws or runs on its own: a reader asks at a second and gets places back.
//
//   import {at, shotAt, placesAt, toPage, span} from './braindance.mjs';
//   at(bd, 'athena', 30.0)         -> {mu, sigma, look, pose, t} or null (the track holding that second)
//   shotAt(bd, 30.0)               -> the camera's shot: {name, mu, sigma, look, fov, t}
//   placesAt(bd, 30.0)             -> {athena: {...}, seiya: {...}, ...} of every entity on a track at that second, plus light
//   toPage(place, {centre, unit})  -> the same place in a page's units: centre = where the page puts the fight's ground, unit = page units
//                                      a metre (a dodecahedron of radius r standing for a fighter of 1.65 m: unit = 2 r / 1.65)
//   span(bd)                       -> {from, to} the seconds the record covers (its first and last camera shot)
//   placeOf(track)                 -> {mu, sigma, cov, measured} the place to use: the measured one when the track carries a `measured`
//                                      block (braindance.measure.mjs: mu, sigma and a 3 x 3 cov in metres off the film's own rays), else the
//                                      read mu and sigma (cov diagonal), so a reader never has to know which it got
//   eyeOf(shot)                    -> {mu, sigma, cov, look, up, fov, measured} the same for a camera shot (`measured.eye` when there is one)
//
// Since Oct 14 2026 15:4x WEST a track or a shot may carry `measured` beside its read mu and sigma: {method, frames, residual_px, mu, sigma,
// cov, shots: [{shot, body, frames, t, n, residual_px, drift_px, mu, sigma}]} on a track; {method, frames, t, hand, n, residual_px, eye, sigma,
// cov, look, up, fov, sigmaFov, anchor, tracked} on a shot. The read fields stay as they were; at(), shotAt() and placesAt() answer as before.

/** The track of `name` holding second t, or null. Entities' tracks, and light.column / light.star / light.sun / light.cloth by name. */
export function at(bd, name, t) {
  const tracks = tracksOf(bd, name);
  for (const track of tracks) if (t >= track.t[0] && t < track.t[1]) return track;
  return null;
}

function tracksOf(bd, name) {
  if (name.startsWith('light.')) {
    const l = bd.light?.[name.slice(6)];
    if (!l) return [];
    return Array.isArray(l) ? l : [l.base ? {...l, mu: l.base.mu, sigma: l.base.sigma} : l];
  }
  return bd.entities?.[name]?.tracks ?? [];
}

/** The camera's shot at second t, or null between shots. */
export function shotAt(bd, t) {
  for (const shot of bd.camera ?? []) if (t >= shot.t[0] && t < shot.t[1]) return shot;
  return null;
}

/** Every entity (and light) on a track at second t: {name: track}. */
export function placesAt(bd, t) {
  const out = {};
  for (const name of Object.keys(bd.entities ?? {})) { const track = at(bd, name, t); if (track) out[name] = track; }
  for (const name of Object.keys(bd.light ?? {})) { const track = at(bd, `light.${name}`, t); if (track) out[`light.${name}`] = track; }
  return out;
}

/** The column of light's width at second t (metres), 0 outside its seconds: linear between its listed widths, held after the last. */
export function columnWidthAt(bd, t) {
  const c = bd.light?.column;
  if (!c || t < c.t[0] || t >= c.t[1]) return 0;
  const w = c.width;
  if (t <= w[0][0]) return w[0][1];
  for (let i = 1; i < w.length; i++) if (t <= w[i][0]) { const u = (t - w[i - 1][0]) / (w[i][0] - w[i - 1][0]); return w[i - 1][1] + u * (w[i][1] - w[i - 1][1]); }
  return w.at(-1)[1];
}

/**
 * A place in a page's units: the arena's origin at `centre` (page units), `unit` page units a metre, the arena's axes kept (x right, y up,
 * z towards Athena). Returns {mu, sigma, look} scaled and moved; sigma scaled only.
 */
export function toPage(place, {centre = [0, 0, 0], unit = 1} = {}) {
  const move = (p) => p.map((v, i) => centre[i] + v * unit);
  return {mu: move(place.mu), sigma: place.sigma.map((v) => v * unit), ...(place.look ? {look: move(place.look)} : {})};
}

/** The seconds the record covers: from the first camera shot to the end of the last. */
export function span(bd) {
  const shots = bd.camera ?? [];
  return shots.length ? {from: Math.min(...shots.map((s) => s.t[0])), to: Math.max(...shots.map((s) => s.t[1]))} : {from: 0, to: 0};
}

/** The place a reader should use: the measured one when the track has it, else the read one, in one shape. */
export function placeOf(track) {
  if (!track) return null;
  const m = track.measured;
  if (m && three(m.mu) && three(m.sigma)) return {mu: m.mu, sigma: m.sigma, cov: m.cov ?? diagonal(m.sigma), measured: true, residual_px: m.residual_px, frames: m.frames};
  return {mu: track.mu, sigma: track.sigma, cov: diagonal(track.sigma), measured: false};
}

/** The camera's eye of a shot, measured when it is, else as read: {mu, sigma, cov, look, up, fov, measured}. */
export function eyeOf(shot) {
  if (!shot) return null;
  const m = shot.measured;
  if (m && three(m.eye) && three(m.sigma)) return {mu: m.eye, sigma: m.sigma, cov: m.cov ?? diagonal(m.sigma), look: m.look ?? shot.look, up: m.up ?? null, fov: m.fov ?? shot.fov, sigmaFov: m.sigmaFov ?? null, measured: true, residual_px: m.residual_px, frames: m.n};
  return {mu: shot.mu, sigma: shot.sigma, cov: diagonal(shot.sigma), look: shot.look, up: null, fov: shot.fov, sigmaFov: null, measured: false};
}

const three = (v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);
const diagonal = (s) => [[s[0] * s[0], 0, 0], [0, s[1] * s[1], 0], [0, 0, s[2] * s[2]]];
/** What is wrong with a measured block (a track's or a shot's), as problems to list. */
function checkMeasured(m, where, placeKey) {
  const out = [];
  if (!three(m[placeKey]) || !three(m.sigma)) out.push(`${where}: measured ${placeKey} and sigma of three`);
  if (!Array.isArray(m.cov) || m.cov.length !== 3 || !m.cov.every((row) => three(row))) out.push(`${where}: measured cov is not 3 x 3`);
  else for (let i = 0; i < 3; i++) { if (m.cov[i][i] < 0) out.push(`${where}: measured cov has a negative variance`); for (let j = 0; j < i; j++) if (Math.abs(m.cov[i][j] - m.cov[j][i]) > 1e-6) out.push(`${where}: measured cov is not symmetric`); }
  if (!(m.frames >= 1 || m.n >= 1)) out.push(`${where}: measured from no frames`);
  if (!(m.residual_px >= 0)) out.push(`${where}: measured without its residual`);
  if (!m.method) out.push(`${where}: measured without a method`);
  return out;
}

/** What is wrong with a record: [] when nothing. Shots must not overlap or leave a gap; every track needs a mu and a sigma of three; a measured block, where there is one, a mu, a sigma, a 3 x 3 cov, its frames and its residual. */
export function check(bd) {
  const problems = [];
  const shots = [...(bd.camera ?? [])].sort((a, b) => a.t[0] - b.t[0]);
  for (let i = 0; i < shots.length; i++) {
    const s = shots[i];
    if (!(s.t[1] > s.t[0])) problems.push(`shot ${s.name}: its seconds ${s.t} do not rise`);
    if (!three(s.mu) || !three(s.sigma) || !three(s.look) || !(s.fov > 0)) problems.push(`shot ${s.name}: mu, sigma, look of three and a fov`);
    if (i && Math.abs(shots[i - 1].t[1] - s.t[0]) > 1e-9) problems.push(`shots ${shots[i - 1].name} and ${s.name}: ${shots[i - 1].t[1]} to ${s.t[0]} is a gap or an overlap`);
    if (s.measured) problems.push(...checkMeasured(s.measured, `shot ${s.name}`, 'eye'));
  }
  for (const [name, e] of Object.entries(bd.entities ?? {})) {
    const tracks = [...(e.tracks ?? [])].sort((a, b) => a.t[0] - b.t[0]);
    for (let i = 0; i < tracks.length; i++) {
      const k = tracks[i];
      if (!three(k.mu) || !three(k.sigma)) problems.push(`${name} track ${i}: mu and sigma of three`);
      if (!(k.t?.[1] > k.t?.[0])) problems.push(`${name} track ${i}: its seconds ${k.t} do not rise`);
      if (i && tracks[i - 1].t[1] > k.t[0] + 1e-9) problems.push(`${name} tracks ${i - 1} and ${i} overlap`);
      if (!k.evidence) problems.push(`${name} track ${i}: no evidence`);
      if (k.measured) problems.push(...checkMeasured(k.measured, `${name} track ${i}`, 'mu'));
    }
  }
  const c = bd.light?.column;
  if (c) {
    if (!three(c.base?.mu) || !three(c.top?.mu)) problems.push('the column needs a base and a top');
    for (let i = 1; i < (c.width ?? []).length; i++) if (!(c.width[i][0] > c.width[i - 1][0])) problems.push('the column widths must be listed by rising seconds');
  }
  return problems;
}
