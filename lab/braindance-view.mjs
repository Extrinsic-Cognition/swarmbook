// braindance-view.mjs: THE BRAINDANCE, READY TO DRAW. His words, Oct 14 2026 14:4x WEST: "if you want to make a cinematography replication you
// need to be able to correctly place athena from the height of where she is and all that dude"; "like imagine that you are needing to make a 4DGS
// of the trajectory AKA BRAINDANCE of the event here"; "IT IS VECTORIAL SPACES AND NORMAL DISTRIBUTIONS ALL THE WAY DOWN".
//
// braindance.json is the record (every place a mean and a sigma in the arena's metres, by the film's second) and braindance.mjs reads it. This
// module turns a reading into what a page draws: every entity and light at a second as a Gaussian with its kind, Athena's glb placed where she
// stands and turned to the fight, a camera on one of the film's shots. Pure functions, no three.js and no DOM: a quaternion here is [x, y, z, w]
// as three.js's Quaternion.fromArray reads it, a position [x, y, z]. Every number comes from the record; this file adds none of its own.
//
//   import {sceneAt, placeAthena, cameraFor, pageFrame} from './braindance-view.mjs';
//   sceneAt(bd, t, {space, centre, unit, view}) -> {t, space, shot: {name, mu, sigma, look, fov, position, quaternion}, items: [{name, kind, mu, sigma, look, ...}], turn, up, unit, view}
//   placeAthena(bd, t, {space, centre, unit, view, anchor, assetHeight})
//                                 -> {position, quaternion, scale, mu, sigma, axes, look, gaze: {yaw, pitch}, unit, view, space, pose} for athena.hades.glb, or null
//   cameraFor(shot, {centre, unit, view}) -> {position, quaternion, fov} for a camera on one of the record's shots (fov vertical, degrees)
//   pageFrame(bd, t, {centre, unit, view}) -> how the arena's metres go into the page: {point(p), unit, turn, up, view}
//   engineAt(engine, t)           -> the engine's own layer (braindance.engine.json) at t, when one lands: {t, points, eyes}
//
// Two ways into a page (pageFrame): {centre, unit}, toPage's, the arena's axes kept; or {view: {eye = 4, shot}}, the hero's (athena-shot.mjs's
// frame, the hero seat's ask of Oct 14 16:0x WEST: "the page's eye is the shot's camera, eye = 4, centre = the shot's look"): the arena turned
// so the shot's camera looks down the page's -z from [0, 0, eye] with its look point at the page's origin, and scaled so that distance is eye.
//
// The two spaces (the record's frame.law): 'cinematographic', her track, the place the over-the-shoulder shots give her (28 to 37 s, 71 to 73 s);
// 'establishing', the place the pinnacle shot gives her (42.6 to 44.5 s), kept beside the track and held over its seconds. The shots, the
// fighters and the light are the same record in both: only Athena moves between them.
import {at, shotAt, columnWidthAt, toPage} from './braindance.mjs';

export const SPACES = Object.freeze(['cinematographic', 'establishing']);

/** Athena's place at second t in one of the two spaces: {...her track, mu, sigma, look, space}, or null when she is on no track. */
export function athenaAt(bd, t, space = 'cinematographic') {
  if (!SPACES.includes(space)) throw new Error(`no space "${space}": ${SPACES.join(' or ')}`);
  const track = at(bd, 'athena', t);
  if (!track) return null;
  if (space === 'cinematographic') return {...track, space};
  const e = bd.entities?.athena?.establishing;
  if (!e) return null;
  return {...track, mu: e.mu, sigma: e.sigma, look: e.look ?? track.look, evidence: e.evidence, space};
}

/**
 * How the arena's metres go into a page, one of two ways:
 *   {centre, unit}: toPage's: the arena's axes kept, the fight's ground at centre, unit page units a metre.
 *   {view: {eye = 4, shot}} (or view: true): the page's eye stands where the film's camera stands. The arena is turned so the shot's camera
 *     looks down the page's -z from [0, 0, eye] (its right the page's +x, its up the page's +y: no roll) and its look point sits at the page's
 *     origin, and scaled so the camera's distance to its look is eye: unit = eye / |camera - look| page units a metre (0.2 for the over-the-
 *     shoulder shots at eye 4, the record's 20 m). The same numbers as athena-shot.mjs's toView(p, frameOf(shot), eye). shot: one of the record's
 *     camera list; the shot at t when left out, and then null when no shot holds t.
 * Returns {point(p) -> [x, y, z] in the page, unit, turn ([x, y, z, w]: an arena direction into the page), up (the arena's up in the page),
 * view: {shot: its name, eye} or null}.
 */
export function pageFrame(bd, t, {centre = [0, 0, 0], unit = 1, view = null} = {}) {
  if (!view) return {point: (p) => toPage({mu: p, sigma: [0, 0, 0]}, {centre, unit}).mu, unit, turn: [0, 0, 0, 1], up: [0, 1, 0], view: null};
  const v = view === true ? {} : view, shot = v.shot ?? shotAt(bd, t);
  if (!shot) return null;
  const eye = v.eye ?? 4, u = eye / Math.hypot(...sub(shot.mu, shot.look)), turn = conj(lookQuaternion(shot.mu, shot.look));
  return {point: (p) => rotate(turn, sub(p, shot.look)).map((x) => x * u), unit: u, turn, up: rotate(turn, [0, 1, 0]), view: {shot: shot.name, eye}};
}

/**
 * Everything the record places at second t, ready to draw. items: one per entity on a track and one per light on its track, each
 * {name, kind, mu, sigma, look, pose, t}; kind is 'athena', 'figure' (a fighter with the record's height in metres), 'group' (the saints: a
 * place, no figure), or the light's own name ('column' with base, top, topSigma and width = columnWidthAt; 'star', 'sun', 'cloth').
 * shot: the camera's shot at t with cameraFor's position, quaternion and fov, or null between shots.
 * centre and unit, or view, as pageFrame put every place in a page's units (mu, look, base, top moved; sigma, height, width scaled; the shot's
 * position and turn too, its mu and look kept in metres); by default the arena's own metres. With a view each sigma's axes are the arena's
 * turned by the result's turn, and the arena's up is the result's up; null when the view asks for the shot at t and none holds t.
 */
export function sceneAt(bd, t, {space = 'cinematographic', centre = [0, 0, 0], unit = 1, view = null} = {}) {
  const f = pageFrame(bd, t, {centre, unit, view});
  if (!f) return null;
  const page = f.point, scale = (v) => (v == null ? v : Array.isArray(v) ? v.map((x) => x * f.unit) : v * f.unit);
  const items = [];
  for (const [name, e] of Object.entries(bd.entities ?? {})) {
    const k = name === 'athena' ? athenaAt(bd, t, space) : at(bd, name, t);
    if (!k) continue;
    items.push({name, kind: name === 'athena' ? 'athena' : Number.isFinite(e.height) ? 'figure' : 'group', mu: page(k.mu), sigma: scale(k.sigma),
      look: k.look ? page(k.look) : null, pose: k.pose ?? null, height: scale(e.height ?? null), asset: e.asset ?? null, t: k.t});
  }
  for (const name of Object.keys(bd.light ?? {})) {
    const k = at(bd, `light.${name}`, t);
    if (!k) continue;
    const item = {name: `light.${name}`, kind: name, mu: page(k.mu), sigma: scale(k.sigma), look: null, pose: k.pose ?? null, t: k.t};
    if (name === 'column') Object.assign(item, {base: page(k.base.mu), top: page(k.top.mu), topSigma: scale(k.top.sigma), width: scale(columnWidthAt(bd, t))});
    items.push(item);
  }
  const shot = shotAt(bd, t), within = view ? {view: {...(view === true ? {} : view), shot: shotOf(bd, t, view)}} : {centre, unit};
  return {t, space, shot: shot ? {...shot, ...cameraFor(shot, within)} : null, items, turn: f.turn, up: f.up, unit: f.unit, view: f.view};
}
const shotOf = (bd, t, view) => (view === true ? null : view.shot) ?? shotAt(bd, t);

/**
 * Athena's glb (athena.hades.glb: hem on y = 0, facing +z, assetHeight metres tall, 1.6 by its extras) placed at second t: the top of her head
 * at the record's mu (anchor 'head', the default: the record's own reading, braindance.test.mjs's "the camera is behind and above her head"
 * with the over-the-shoulder camera 1.2 m above her mu, and the film at 30.0 s, which looks down on her hair; with her feet at mu that camera
 * stands at her chest, braindance-pictures/frames/30.0-over-her-shoulder-feet-at-mu.png), or her feet or her middle there ('feet', 'centre');
 * upright, her front turned to look, the fight. The stance in the glb holds her head 24 degrees down; gaze.pitch says how far below her
 * horizon the fight is from the top of her head, so a page knows what the stance leaves.
 * centre and unit as toPage (the arena's origin at centre, unit page units a metre), or view as pageFrame (the page's eye where the shot's
 * camera stands: the hero's frame). Returns null when she is on no track at t, or when the view asks for the shot at t and none holds it.
 *   position: where the glb's origin goes (page units)       quaternion: [x, y, z, w], a turn about the arena's up (then the view's turn)
 *   scale: unit x her height in the record / assetHeight    mu, sigma, look: her Gaussian and the fight in page units; axes: the turn of
 *   her sigma's axes in the page ([0, 0, 0, 1] without a view)   unit: page units a metre   view: {shot, eye} or null
 */
export function placeAthena(bd, t, {space = 'cinematographic', centre = [0, 0, 0], unit = 1, view = null, anchor = 'head', assetHeight} = {}) {
  const a = athenaAt(bd, t, space);
  if (!a) return null;
  const f = pageFrame(bd, t, {centre, unit, view});
  if (!f) return null;
  const height = bd.entities.athena.height;
  const lift = {feet: 0, centre: height / 2, head: height}[anchor];
  if (lift === undefined) throw new Error(`no anchor "${anchor}": feet, centre or head`);
  const look = a.look ?? [0, 0, 0];
  const feet = [a.mu[0], a.mu[1] - lift, a.mu[2]];
  const yaw = Math.atan2(look[0] - feet[0], look[2] - feet[2]);   // a turn about y by yaw takes +z to (sin yaw, 0, cos yaw)
  const top = feet[1] + height;
  const pitch = Math.atan2(top - look[1], Math.hypot(look[0] - feet[0], look[2] - feet[2]));
  return {position: f.point(feet), quaternion: qmul(f.turn, [0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)]),
    scale: f.unit * height / (assetHeight ?? height), mu: f.point(a.mu), sigma: a.sigma.map((x) => x * f.unit), axes: f.turn, look: f.point(look),
    gaze: {yaw: yaw * 180 / Math.PI, pitch: pitch * 180 / Math.PI}, unit: f.unit, view: f.view, space: a.space, pose: a.pose ?? null, anchor};
}

/**
 * A camera on one of the record's shots: at the shot's mu, looking at its look, no roll (its x axis level), fov as the record gives it (read as
 * three.js's vertical fov, degrees; the film is 960 x 540, 16:9). In a page's units with centre and unit as toPage: the turn does not change.
 * With view as pageFrame (its shot this one when left out): the camera of the view's own shot stands at [0, 0, eye] looking down -z, unturned.
 */
export function cameraFor(shot, {centre = [0, 0, 0], unit = 1, view = null} = {}) {
  if (view) {
    const f = pageFrame(null, null, {view: {...(view === true ? {} : view), shot: (view === true ? null : view.shot) ?? shot}});
    return {position: f.point(shot.mu), quaternion: qmul(f.turn, lookQuaternion(shot.mu, shot.look)), fov: shot.fov};
  }
  const p = toPage({mu: shot.mu, sigma: shot.sigma ?? [0, 0, 0], look: shot.look}, {centre, unit});
  return {position: p.mu, quaternion: lookQuaternion(p.mu, p.look), fov: shot.fov};
}

/** The turn of a camera at eye looking at target with up kept up: its -z towards the target, as three.js's Object3D.lookAt turns a camera. */
export function lookQuaternion(eye, target, up = [0, 1, 0]) {
  let z = unit3(sub(eye, target));
  if (!z) throw new Error('a camera cannot look at its own place');
  let x = unit3(cross(up, z));
  if (!x) { z = unit3(Math.abs(up[2]) === 1 ? [z[0] + 1e-4, z[1], z[2]] : [z[0], z[1], z[2] + 1e-4]); x = unit3(cross(up, z)); }   // three's own nudge
  const y = cross(z, x);
  return quatFromBasis(x, y, z);
}

/** The rotation whose columns are x, y, z, as [x, y, z, w] (three.js's Quaternion.setFromRotationMatrix). */
export function quatFromBasis(x, y, z) {
  const [m11, m21, m31] = x, [m12, m22, m32] = y, [m13, m23, m33] = z, trace = m11 + m22 + m33;
  if (trace > 0) { const s = 0.5 / Math.sqrt(trace + 1); return [(m32 - m23) * s, (m13 - m31) * s, (m21 - m12) * s, 0.25 / s]; }
  if (m11 > m22 && m11 > m33) { const s = 2 * Math.sqrt(1 + m11 - m22 - m33); return [0.25 * s, (m12 + m21) / s, (m13 + m31) / s, (m32 - m23) / s]; }
  if (m22 > m33) { const s = 2 * Math.sqrt(1 + m22 - m11 - m33); return [(m12 + m21) / s, 0.25 * s, (m23 + m32) / s, (m13 - m31) / s]; }
  const s = 2 * Math.sqrt(1 + m33 - m11 - m22); return [(m13 + m31) / s, (m23 + m32) / s, 0.25 * s, (m21 - m12) / s];
}

/** a then b as one turn: b first, then a (three.js's multiplyQuaternions(a, b)). */
export function qmul(a, b) {
  const [ax, ay, az, aw] = a, [bx, by, bz, bw] = b;
  return [aw * bx + ax * bw + ay * bz - az * by, aw * by - ax * bz + ay * bw + az * bx, aw * bz + ax * by - ay * bx + az * bw, aw * bw - ax * bx - ay * by - az * bz];
}

/** v turned by the quaternion q ([x, y, z, w]). */
export function rotate(q, v) {
  const [qx, qy, qz, qw] = q, [vx, vy, vz] = v;
  const tx = 2 * (qy * vz - qz * vy), ty = 2 * (qz * vx - qx * vz), tz = 2 * (qx * vy - qy * vx);
  return [vx + qw * tx + qy * tz - qz * ty, vy + qw * ty + qz * tx - qx * tz, vz + qw * tz + qx * ty - qy * tx];
}

/**
 * The engine's own layer (lab/braindance.engine.json, the measured session's, when the event is staged in the game): its sample nearest t, read
 * without assuming more of its shape than the note promises (per film second, each figure's joints by the game's names as world 4 x 4 in the
 * arena frame, and the camera's eye). {t, points: [{figure, joint, p}], eyes: [[x, y, z]]}, or null when the record has no sample.
 * Accepts samples as an array of {t, ...} or an object keyed by the second; the figures under `figures` or at the sample's top; a joint's 4 x 4
 * is 16 numbers, column-major (its translation 12, 13, 14), at any depth under its figure; the eye at camera.eye.
 */
export function engineAt(engine, t) {
  const list = Array.isArray(engine?.samples) ? engine.samples
    : engine?.samples && typeof engine.samples === 'object' ? Object.entries(engine.samples).map(([k, v]) => ({t: Number(k), ...v})) : [];
  const usable = list.filter((s) => Number.isFinite(s?.t));
  if (!usable.length) return null;
  const s = usable.reduce((best, x) => (Math.abs(x.t - t) < Math.abs(best.t - t) ? x : best));
  const points = [], eyes = [];
  const walk = (v, figure, joint) => {
    if (Array.isArray(v) && v.length === 16 && v.every(Number.isFinite)) points.push({figure, joint, p: [v[12], v[13], v[14]]});
    else if (v && typeof v === 'object') for (const [k, w] of Object.entries(v)) walk(w, figure, k);
  };
  const figures = s.figures && typeof s.figures === 'object' ? s.figures
    : Object.fromEntries(Object.entries(s).filter(([k]) => k !== 't' && k !== 'camera'));
  for (const [figure, v] of Object.entries(figures)) walk(v, figure, figure);
  const eye = s.camera?.eye;
  if (Array.isArray(eye) && eye.length === 3 && eye.every(Number.isFinite)) eyes.push(eye);
  return {t: s.t, points, eyes};
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const conj = (q) => [-q[0], -q[1], -q[2], q[3]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit3 = (v) => { const n = Math.hypot(v[0], v[1], v[2]); return n > 1e-12 ? [v[0] / n, v[1] / n, v[2] / n] : null; };
