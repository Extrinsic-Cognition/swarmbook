// Frame 1111 of the source film, not the earlier shoulder shot's camera.
// These are registration observations and explicit priors, not a recovered Asgard set.
export const FREEZE = Object.freeze({
  frame: 1111, second: 1111.5 * 1001 / 30000,
  picture: {width: 960, height: 540, content: [82, 3, 796, 534]},
  fov: 40,
  athena: {height: 1.6, head: [0, 1.52, -0.02], pixel: [735, 65], depth: 0.90,
    // Posed GLB vertices after the scene's half-turn, rounded outwards; never used to resize the asset.
    bounds: {min: [-0.317633, -0.000001, -0.208184], max: [0.317633, 1.600001, 0.533570]}},
  seiya: {height: 1.65, top: [228, 195], feet: [233, 326]},
  column: {foot: [260, 350], radius: 0.055, height: 18},
  missing: ['Native Dolbar asset (authored reconstruction used)', 'Native Asgard asset (authored reconstruction used)', 'film-matched Athena hair pose', 'film-matched Seiya costume'],
});
const add = (a, b) => a.map((x, i) => x + b[i]);
const scale = (a, s) => a.map(x => x * s);
const sub = (a, b) => add(a, scale(b, -1));
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);

// Fit the complete artwork, excluding the black bars baked into the source.
// This returns the full encoded-frame rectangle so both the anime shader and
// the held-frame texture keep their existing UVs and land at identical pixels.
export function pictureViewport(width, height) {
  const {width: sourceWidth, height: sourceHeight, content: [x, y, w, h]} = FREEZE.picture;
  const scale = Math.min(width / w, height / h);
  return {left: (width - w * scale) / 2 - x * scale,
    top: (height - h * scale) / 2 - y * scale,
    width: sourceWidth * scale, height: sourceHeight * scale};
}

export function freezeLayout() {
  const f = 270 / Math.tan(FREEZE.fov * Math.PI / 360);
  // Elevation is a prior. Two fighter endpoints cannot recover a unique camera.
  const forward = [0, -0.5, -Math.sqrt(0.75)], right = [1, 0, 0], up = [0, Math.sqrt(0.75), -0.5];
  const ray = ([x, y]) => add(forward, add(scale(right, (x - 480) / f), scale(up, (270 - y) / f)));
  const eye = sub(FREEZE.athena.head, scale(ray(FREEZE.athena.pixel), FREEZE.athena.depth));
  const at = (pixel, depth) => add(eye, scale(ray(pixel), depth));
  // Preserve the asset's 1.65 m height. Solve its depth from the observed vertical span.
  const vFeet = (270 - FREEZE.seiya.feet[1]) / f, vTop = (270 - FREEZE.seiya.top[1]) / f;
  const depth = FREEZE.seiya.height * (up[1] - vTop * forward[1]) / (vTop - vFeet);
  const seiya = at(FREEZE.seiya.feet, depth), floor = seiya[1];
  const columnRay = ray(FREEZE.column.foot);
  const column = at(FREEZE.column.foot, (floor - eye[1]) / columnRay[1]);
  const project = point => {
    const d = sub(point, eye), z = dot(d, forward);
    return [480 + f * dot(d, right) / z, 270 - f * dot(d, up) / z];
  };
  return {reference: {eye, target: add(eye, scale(forward, 1.2)), up},
    athena: [0, 0, 0], seiya, column, floor, project, ray, at};
}

// The exact captured frame owns the initial view; movement reveals solid characters and terrain.
// World navigation uses physical vertical, full turns and the connected terrain's collision surface.
export const HOLD = Object.freeze({
  reveal: [0.01, 0.12],            // metres over which one silhouette replaces the other
  hair: [2, 8],                    // degrees about her head; turning and travelling drive the same replacement
  limits: {yaw: [-Math.PI, Math.PI], pitch: [-0.38, 0.95]},
  distance: [0.35, 64],
  // Pull from the exact 1.2 m reference orbit to 2.1 m: the complete head and shoulders fit beside the fight.
  // A 4.2 m inspection orbit contains the full posed bounds; the finite entrance then rests (zero draws).
  entrance: {delay: 0.25, duration: 1.4, yaw: 0.11, pitch: 0.025, distance: 1.75},
});

const angleBetween = (a, b) => {
  const c = dot(a, b) / Math.max(1e-12, Math.hypot(...a) * Math.hypot(...b));
  return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
};
const smooth = (lo, hi, x) => { const k = Math.max(0, Math.min(1, (x - lo) / (hi - lo))); return k * k * (3 - 2 * k); };

// One replacement amount owns both silhouettes. A push must never expose a full native body
// while leaving opaque drawn hair above it. Either travel or turn can complete the replacement.
export function holdWeights(pose, reference, head = FREEZE.athena.head) {
  const travel = Math.hypot(...sub(pose.eye, reference.eye)) + Math.hypot(...sub(pose.target, reference.target));
  const turned = angleBetween(sub(pose.eye, head), sub(reference.eye, head));
  const reveal = Math.max(smooth(...HOLD.reveal, travel), smooth(...HOLD.hair, turned));
  return {travel, turned, reveal, hair: 1 - reveal}; // hair is the remaining source-picture fraction, not a separate card
}

export const easeInOut = k => { const x = Math.max(0, Math.min(1, k)); return x < .5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2; };
