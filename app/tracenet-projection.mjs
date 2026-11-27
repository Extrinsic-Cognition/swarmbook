// A planar browser surface projected through the same camera as the laptop lid.
// Corners are top-left, top-right, bottom-right, bottom-left in viewport pixels.
export function planeMatrix(corners, width, height) {
  const [p, q, r, s] = corners;
  const dx1 = q.x - r.x, dx2 = s.x - r.x, dx3 = p.x - q.x + r.x - s.x;
  const dy1 = q.y - r.y, dy2 = s.y - r.y, dy3 = p.y - q.y + r.y - s.y;
  const determinant = dx1 * dy2 - dx2 * dy1;
  if (Math.abs(determinant) < 1e-8 || width <= 0 || height <= 0) return null;
  const g = (dx3 * dy2 - dx2 * dy3) / determinant;
  const h = (dx1 * dy3 - dx3 * dy1) / determinant;
  return [(q.x - p.x + g * q.x) / width, (q.y - p.y + g * q.y) / width, 0, g / width,
    (s.x - p.x + h * s.x) / height, (s.y - p.y + h * s.y) / height, 0, h / height,
    0, 0, 1, 0, p.x, p.y, 0, 1];
}

export function jumpPoint(from, to, progress) {
  const t = Math.min(1, Math.max(0, progress));
  const travel = t * t * (3 - 2 * t);
  return { x: from.x + (to.x - from.x) * travel,
    y: from.y + (to.y - from.y) * travel + Math.sin(t * Math.PI) * 1.35,
    z: from.z + (to.z - from.z) * travel };
}
