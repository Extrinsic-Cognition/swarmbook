// athena-shot.mjs: ATHENA ON THE HERO, placed from the record (braindance.json, read by braindance.mjs), never from a number of the page's
// own. His words, Oct 14 2026 14:2x to 14:5x WEST: "i want to have athena outside of the dodecahedron using the hades game asset"; "start
// having spatial computing awareness of where the fight is happening... if you want to make a cinematography replication you need to be able
// to correctly place athena from the height of where she is"; "like imagine that you are needing to make a 4DGS of the trajectory AKA
// BRAINDANCE of the event here"; "IT IS VECTORIAL SPACES AND NORMAL DISTRIBUTIONS ALL THE WAY DOWN".
//
// THE PAGE'S EYE STANDS WHERE THE FILM'S CAMERA STANDS. In a shot that looks at the fight from over her shoulder (the record's camera within
// reach of her place and looking at the fight's ground: 28 to 32 s, 36.6 to 38 s, 71 to 74 s), the arena is turned so the shot's camera looks
// down the page's own axis (the page's eye on +z, EYE box radii from the sphere's centre; the shot's look point at that centre, where the
// dodecahedron stands for the fight) and scaled so the camera's distance to its look point is the page's EYE: unit = EYE / |camera - look| box
// radii a metre (0.2 at the record's 20 m). Everything in the shot then stands where the film's camera sees it, through the page's own lens.
// Her place is her track's mean moved inside her sigma by the least it takes (its Mahalanobis distance is said with the place, never hidden)
// to stand where the film has her: her whole figure right of the dodecahedron and inside the stage, her head above its centre, in front of the
// eye. The figure faces her track's look (the fight); the game's asset carries her stance (head down, arms at her sides). Outside those
// shots she is not on the page: she comes and goes on the film's own cuts.
import {at, shotAt, columnWidthAt} from './braindance.mjs';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };

export const REACH = 5;     // metres: a camera this close to her place is behind her (her sigma is 3 to 5 m)
export const ON_FIGHT = 3;  // metres: a shot whose look point is this close to the fight's ground looks at the fight
export const SHOULDER = 0.25;   // metres: half her shoulders, for her figure's box on the screen

/** The camera's frame of a shot: its place C, its look point L, the distance D, and its right, up and back (toward the camera) axes in the arena. */
export function frameOf(shot) {
  const C = shot.mu, L = shot.look, D = Math.hypot(...sub(C, L)), back = unit(sub(C, L));
  const right = unit(cross([-back[0], -back[1], -back[2]], [0, 1, 0])), up = cross(right, [-back[0], -back[1], -back[2]]);
  return {C, L, D, right, up, back};
}

/** A point of the arena in the page's view space (box radii; the page's eye at [0, 0, eye]), seen through the shot's frame. */
export function toView(p, frame, eye = 4) {
  const d = sub(p, frame.L), s = eye / frame.D;
  return [dot(d, frame.right) * s, dot(d, frame.up) * s, dot(d, frame.back) * s];
}

/** The shot at second t if it looks at the fight from over her shoulder, with her track: {shot, track} or null. */
export function overShoulder(bd, t) {
  const shot = shotAt(bd, t), track = at(bd, 'athena', t);
  if (!shot || !track) return null;
  return Math.hypot(...sub(shot.mu, track.mu)) <= REACH && Math.hypot(...shot.look) <= ON_FIGHT ? {shot, track} : null;
}

/**
 * Where she stands on the page at second t: null outside her over-the-shoulder shots, else {feet, yaw, unit, frame, swing, sigmas, fits, box,
 * shot}. feet: her feet in the page's view space (box radii); yaw: her turn about the arena's up so she faces her look; unit: box radii a metre;
 * swing: the metres her mean was moved by (x, y, z in the arena) and sigmas its Mahalanobis distance; fits: whether the film's place was found
 * inside two sigmas (else the least-violating place); box: her figure on the screen, css px from the sphere's centre (y down).
 * page: {eye, R (css px a box radius), height (her metres), stage: {left, right, top, bottom} css px from the sphere's centre (y down), margin}.
 */
export function placeAthena(bd, t, page) {
  const found = overShoulder(bd, t);
  if (!found) return null;
  const {shot, track} = found, frame = frameOf(shot), eye = page.eye ?? 4, s = eye / frame.D, height = page.height ?? bd.entities?.athena?.height ?? 1.6;
  const margin = page.margin ?? 0.04 * page.R, near = 0.25;
  const screen = (p) => { const v = toView(p, frame, eye), z = eye - v[2], k = page.R * eye / z; return {x: v[0] * k, y: -v[1] * k, z}; };
  const figure = (base) => {
    const pts = [];
    for (const h of [0, 0.5, 1]) for (const w of [-1, 1]) pts.push(screen([base[0] + frame.right[0] * w * SHOULDER, base[1] + h * height, base[2] + frame.right[2] * w * SHOULDER]));
    return {left: Math.min(...pts.map((p) => p.x)), right: Math.max(...pts.map((p) => p.x)), top: Math.min(...pts.map((p) => p.y)), bottom: Math.max(...pts.map((p) => p.y)),
      head: pts.filter((_, i) => i >= 4).reduce((a, p) => a + p.y, 0) / 2, near: Math.min(...pts.map((p) => p.z))};
  };
  // what the film shows: right of the dodecahedron (its circumradius on the screen, about R), inside the stage, the head above its centre
  const violation = (b) => Math.max(0, page.R * 1.05 + margin - b.left) + Math.max(0, b.right - (page.stage.right - margin)) +
    Math.max(0, page.stage.top + margin - b.top) + Math.max(0, b.bottom - (page.stage.bottom - margin)) + Math.max(0, b.head) +
    (b.near < near ? 1e6 : 0);
  let best = null;
  const step = 0.25, reach = 2;
  for (let i = -reach / step; i <= reach / step; i++) for (let j = -reach / step; j <= reach / step; j++) for (let k = -reach / step; k <= reach / step; k++) {
    const m = Math.hypot(i * step, j * step, k * step);
    if (m > reach) continue;
    const delta = [i * step * track.sigma[0], j * step * track.sigma[1], k * step * track.sigma[2]], base = [track.mu[0] + delta[0], track.mu[1] + delta[1], track.mu[2] + delta[2]];
    const b = figure(base), v = violation(b);
    if (!best || v < best.v - 1e-9 || (Math.abs(v - best.v) <= 1e-9 && m < best.m)) best = {v, m, delta, base, b};
  }
  const look = track.look ?? frame.L, yaw = Math.atan2(look[0] - best.base[0], look[2] - best.base[2]);
  return {feet: toView(best.base, frame, eye), yaw, unit: s, frame, swing: best.delta, sigmas: best.m, fits: best.v === 0, box: best.b, shot: shot.name, height};
}

/**
 * Her presence on the page: the run of over-the-shoulder shots holding second t, as {start, end} (28 to 32 s, 36.6 to 38 s, 71 to 74 s at
 * the record's first cut), or null. She comes in on the film's cut at its start and goes on the cut at its end.
 */
export function presenceAt(bd, t) {
  if (!overShoulder(bd, t)) return null;
  const shots = [...(bd.camera ?? [])].sort((a, b) => a.t[0] - b.t[0]);
  let i = shots.findIndex((x) => t >= x.t[0] && t < x.t[1]), start = shots[i].t[0], end = shots[i].t[1];
  for (let k = i - 1; k >= 0 && overShoulder(bd, shots[k].t[0]); k--) start = shots[k].t[0];
  for (let k = i + 1; k < shots.length && overShoulder(bd, shots[k].t[0]); k++) end = shots[k].t[1];
  return {start, end};
}

/** THE CUTS' one device (lab/CUTS.md): the first frames of a cut show the render passes as they are; 1 the normals, 2 a flat gold matte, 0 the picture. */
export const passAt = (age) => age >= 0 && age < 0.1 ? 1 : age >= 0.1 && age < 0.2 ? 2 : 0;

/** The record's column of light at second t, in the shot's frame: {base (page view space), width (box radii), up (the arena's up in the page)} or null. */
export function columnOnPage(bd, t, eye = 4) {
  const w = columnWidthAt(bd, t), found = overShoulder(bd, t);
  if (!(w > 0) || !found) return null;
  const frame = frameOf(found.shot), base = bd.light.column.base.mu, s = eye / frame.D;
  return {base: toView(base, frame, eye), width: w * s, metres: w, up: [frame.right[1], frame.up[1], frame.back[1]], top: (bd.light.column.top?.mu?.[1] ?? 60) * s};
}
