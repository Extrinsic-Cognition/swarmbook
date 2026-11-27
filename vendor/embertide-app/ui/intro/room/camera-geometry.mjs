// Camera geometry shared by the Board diagnostics and the glass projection.
// R maps Station vectors into OpenCV camera coordinates: right, down, forward.
// Constant work per changed camera; no timers, reads or invented optics/depth.
const finite = (v) => typeof v === 'number' && Number.isFinite(v);
const vec3 = (v) => Array.isArray(v) && v.length === 3 && v.every(finite);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (v) => { const n = Math.hypot(...v); return n > 1e-12 ? v.map((x) => x / n) : null; };

/** Accept a finite, proper, approximately orthonormal world-to-camera rotation. */
export function isCameraRotationMatrix(R) {
  // R is inverted by its transpose below. Percent-scale skew is not rotation
  // uncertainty: it changes the rays. Allow only numerical serialization error.
  const tolerance = 1e-5;
  return Array.isArray(R) && R.length === 3 && R.every(vec3)
    && R.every((row) => Math.abs(dot(row, row) - 1) <= tolerance)
    && Math.abs(dot(R[0], R[1])) <= tolerance && Math.abs(dot(R[0], R[2])) <= tolerance && Math.abs(dot(R[1], R[2])) <= tolerance
    && Math.abs(dot(R[0], cross(R[1], R[2])) - 1) <= tolerance;
}

/** Full physical frame. A supplied invalid R never downgrades to legacy yaw.
 * right is CAMERA right; a screen facing its viewer uses -right, up, forward. */
export function cameraFrameOf(camera) {
  if (!camera || typeof camera !== 'object') return null;
  const c = vec3(camera.C) ? camera.C : vec3(camera.position) ? camera.position : null;
  if (!c) return null;
  let R;
  if ('R' in camera) {
    if (!isCameraRotationMatrix(camera.R)) return null;
    R = camera.R.map((row) => row.slice());
  } else {
    let forward = vec3(camera.forward) ? unit(camera.forward) : null;
    if (!forward) {
      if ('forward' in camera || !finite(camera.yaw)) return null;
      const yaw = camera.yaw, pitch = finite(camera.pitch) ? camera.pitch : 0;
      forward = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)];
    }
    const upHint = vec3(camera.up) ? camera.up : [0, 1, 0];
    const right = unit(cross(forward, upHint));
    if (!right) return null;
    const up = unit(cross(right, forward));
    R = [right, up.map((x) => -x), forward];
  }
  return { c: c.slice(), right: R[0].slice(), up: R[1].map((x) => -x), forward: R[2].slice(), R };
}

/** The existing camera wire carries K as {fx,fy,cx,cy} plus width/height,
 * or [fx,fy,cx,cy,width,height]. No FOV/aspect-ratio substitution. */
export function cameraIntrinsicsOf(camera) {
  if (!camera || typeof camera !== 'object') return null;
  // Wind's k is calibrated directly in image shares. [0,1] is that coordinate
  // domain's boundary, not an invented pixel width or sensor aspect ratio.
  if (!('K' in camera)) {
    const k = camera.lens?.k ?? camera.k;
    if (!Array.isArray(k) || k.length !== 4 || !k.every(finite) || !(k[0] > 0 && k[1] > 0)) return null;
    return { fx: k[0], fy: k[1], cx: k[2], cy: k[3], width: 1, height: 1, domain: 'normalized' };
  }
  const raw = camera?.K;
  const v = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? [raw.fx, raw.fy, raw.cx, raw.cy, camera.width, camera.height] : null;
  if (!v || v.length !== 6 || !v.every(finite)) return null;
  const [fx, fy, cx, cy, width, height] = v;
  if (!(fx > 0 && fy > 0 && width > 0 && height > 0)) return null;
  return { fx, fy, cx, cy, width, height, domain: 'pixels' };
}

/** Four image-boundary corners on a plane at an explicitly supplied forward
 * depth (metres), in pixel order top-left, top-right, bottom-right, bottom-left.
 * The plane is a diagnostic cut through the optical cone, not measured depth. */
export function cameraFrustumOf(camera, depthM) {
  const frame = cameraFrameOf(camera), K = cameraIntrinsicsOf(camera);
  if (!frame || !K || !finite(depthM) || !(depthM > 0)) return null;
  const corners = [[0, 0], [K.width, 0], [K.width, K.height], [0, K.height]].map(([u, v]) => {
    const x = (u - K.cx) / K.fx, y = (v - K.cy) / K.fy;
    return frame.c.map((c, i) => c + depthM * (frame.right[i] * x - frame.up[i] * y + frame.forward[i]));
  });
  return { c: frame.c, corners, depth_m: depthM, K };
}
