const TAU = Math.PI * 2;

// The orbit of the twelve: the spherical Lissajous the engine flies a chair's loop on (ratio 3:2,
// W. Erb 2018, section 2), four tilted lanes, the twelve spread along it by chair, walked at
// uniform arc length. A world docks from its pentagon's normal into its chair's loop and stays in
// orbit: the default of the chamber is motion, as it is at every depth below it.
const ORBIT_PERIOD = 84000, ARC_STEPS = 1024, ARC = [0];
const curveSpeed = u => Math.sqrt(4 + 9 * Math.sin(2 * u) ** 2);
for (let i = 1; i <= ARC_STEPS; i++) {
  const a = (i - 1) * TAU / ARC_STEPS, b = i * TAU / ARC_STEPS;
  ARC.push(ARC[i - 1] + (b - a) * (curveSpeed(a) + 4 * curveSpeed((a + b) / 2) + curveSpeed(b)) / 6);
}
const phaseAtDistance = turns => {
  const fraction = ((turns % 1) + 1) % 1, distance = fraction * ARC[ARC_STEPS];
  let lo = 0, hi = ARC_STEPS;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ARC[mid] <= distance) lo = mid; else hi = mid; }
  return (lo + (distance - ARC[lo]) / (ARC[hi] - ARC[lo])) * TAU / ARC_STEPS;
};
const lissajousUnit = u => { const polar = Math.sin(2 * u); return [polar * Math.cos(3 * u), Math.cos(2 * u), polar * Math.sin(3 * u)]; };
/** The point of chair `chair`'s loop at curve parameter `u`, at time `at` (the lane's azimuth drifts), lane 0 at radius 1. */
export function loopUnitAt(chair, u, at) {
  const lane = chair % 4;
  const radius = (1.94 + lane * .035) / 1.94, tilt = [-.34, .68, -.82, .28][lane], azimuth = lane * Math.PI * .43 + at * .000004;
  const p = lissajousUnit(u), c = Math.cos(tilt), sn = Math.sin(tilt);
  const y = p[1] * c - p[2] * sn, z = p[1] * sn + p[2] * c, ca = Math.cos(azimuth), sa = Math.sin(azimuth);
  return [(p[0] * ca + z * sa) * radius, y * radius, (-p[0] * sa + z * ca) * radius];
}
/** Where chair `chair`'s world is at time `at`: along its loop at uniform arc length, the twelve spread by chair. */
export function loopPoint(chair, at) {
  return loopUnitAt(chair, phaseAtDistance(at / ORBIT_PERIOD + chair / 12), at);
}
