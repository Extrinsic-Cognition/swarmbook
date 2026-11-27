// A film-clock orbit for the Sagittarius window. Reuses the soundtrack score already driving the Lyssajudrean satellites.
// The centre stays fixed. The pointer changes only phase, tilt and a small amplitude factor; it cannot drag the picture's centre.
import {hearAt, throbAt} from '../lab/orbit-kick.js';

export const ORBIT = Object.freeze({start: 1762 * 1001 / 30000, end: 2129 * 1001 / 30000,
  period: 6.8, enter: 1.05, exit: 1.2, maxX: .037, maxY: .020, maxZ: .007, restZ: .55});
export const NEUTRAL = Object.freeze({phase: 0, tilt: 0, amplitude: 1});
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Number.isFinite(v) ? v : 0));
const smooth = (u) => { const x = clamp(u, 0, 1); return x * x * (3 - 2 * x); };
export function steeringOf(x = 0, y = 0) {
  const nx = clamp(x, -1, 1), ny = clamp(y, -1, 1);
  return {phase: nx * .24, tilt: -ny * .10, amplitude: 1 + .06 * (nx * nx + ny * ny) / 2};
}
/** A soft pulse, sampled symmetrically from the existing score rather than accumulated against wall time. */
export function musicAt(t) {
  const [energy, turn] = hearAt(t);
  let pulse = 0, lean = 0;
  const weights = [1, 2, 3, 2, 1];
  for (let i = 0; i < weights.length; i++) {
    const [out, tilt] = throbAt(t + (i - 2) * .1);
    pulse += weights[i] * out / 9; lean += weights[i] * tilt / 9;
  }
  return {energy: clamp(energy / .14, 0, 1), pulse: clamp(pulse / .09, 0, 1), turn, lean};
}
/** Pure: the same film second and controls always produce the same viewpoint, including after a seek or pause. */
export function orbitAt(seconds, controls = NEUTRAL, readMusic = musicAt) {
  const t = Number.isFinite(seconds) ? seconds : 0;
  const envelope = smooth((t - ORBIT.start) / ORBIT.enter) * smooth((ORBIT.end - t) / ORBIT.exit);
  const centre = [0, 0, ORBIT.restZ];
  if (!envelope) return {eye: centre.slice(), centre, envelope: 0, phase: 0, tilt: 0, radii: [0, 0], score: null, seconds: t};
  const score = readMusic(t), energy = clamp(score.energy, 0, 1), pulse = clamp(score.pulse, 0, 1);
  const phase = (t - ORBIT.start) * 2 * Math.PI / ORBIT.period + .45 + clamp(controls.phase, -.24, .24) + .04 * pulse;
  const tilt = .12 + .055 * Math.sin((t - ORBIT.start) * .23) + .055 * Math.sin(score.turn || 0)
    + clamp(controls.tilt, -.1, .1) + clamp(score.lean, -.04, .04);
  const gain = clamp(controls.amplitude, .94, 1.06), breath = 1 + .18 * energy + .07 * pulse;
  let a = .027 * gain * breath, b = .013 * gain * (1 + .12 * energy + .05 * pulse);
  const c = Math.cos(tilt), s = Math.sin(tilt);
  // Bound the entire tilted path, not individual samples: no clipping corners in its trajectory.
  const fit = Math.min(1, ORBIT.maxX / (Math.abs(a * c) + Math.abs(b * s)), ORBIT.maxY / (Math.abs(a * s) + Math.abs(b * c)));
  a *= fit; b *= fit;
  const x = a * (.93 * Math.cos(phase) + .07 * Math.cos(2 * phase + .4));
  const y = b * (.88 * Math.sin(phase) + .12 * Math.sin(1.5 * phase + .3));
  return {eye: [(x * c - y * s) * envelope, (x * s + y * c) * envelope,
    ORBIT.restZ + .0065 * envelope * Math.sin(phase * .5) * (.65 + .35 * pulse)], centre, envelope,
    phase, tilt, radii: [a * envelope, b * envelope], score: {...score, energy, pulse}, seconds: t};
}
