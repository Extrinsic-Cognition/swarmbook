// Confirmed pre-mint buyers, supplied by the chain/profile reader. This layer
// owns no clock, wallet, network feed, event listeners or animation loop.
const TAU = Math.PI * 2;
export const MAX_HOLDER_PROFILES = 150;
const TILE_SIZE = 96;
const HEX_HEIGHT = Math.sqrt(3) / 2;
const LANES = [
  {radius: 1.52, tilt: .93, roll: -.58, speed: .031},
  {radius: 1.84, tilt: 1.10, roll: .18, speed: -.024},
  {radius: 2.16, tilt: .76, roll: .76, speed: .018},
];
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const finite = (n, fallback = 0) => Number.isFinite(n) ? n : fallback;

function hexagon(ctx, x, y, radius) {
  const half = radius / 2, height = radius * HEX_HEIGHT;
  ctx.beginPath(); ctx.moveTo(x + radius, y);
  ctx.lineTo(x + half, y + height); ctx.lineTo(x - half, y + height);
  ctx.lineTo(x - radius, y); ctx.lineTo(x - half, y - height);
  ctx.lineTo(x + half, y - height); ctx.closePath();
}

function hash(text) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 16777619);
  value ^= value >>> 16; value = Math.imul(value, 0x7feb352d);
  value ^= value >>> 15; value = Math.imul(value, 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
}

/** The identity alone chooses the lane and phase: adding buyers never reseats anyone. */
export function holderOrbitSeed(id) {
  const key = String(id);
  return {lane: hash(key) % LANES.length, phase: hash(`phase:${key}`) / 4294967296 * TAU};
}

function frameGeometry({center, radius, width, height, clock, yaw, pitch} = {}, count) {
  width = Math.max(0, finite(width)); height = Math.max(0, finite(height));
  if (!count || width < 8 || height < 8) return null;
  const cx = finite(center?.[0], width * .55), cy = finite(center?.[1], height * .5);
  const diameter = Math.min(
    clamp(40 - Math.log2(Math.max(1, count / 12)) * 5, 22, 40),
    Math.max(12, Math.min(width, height) * .105),
  );
  const room = Math.max(0, Math.min(cx, width - cx, cy, height - cy) - diameter / 2 - 5);
  // Orthographic orbits have a fixed bound at every angle. Reserve room for the
  // entire portrait, including on a narrow screen whose body sits at the sphere's centre (sphere-centre.mjs SPHERE_X).
  const scale = Math.min(Math.max(0, finite(radius)), room / LANES[2].radius);
  return {cx, cy, diameter, scale, radius: Math.max(0, finite(radius)),
    clock: finite(clock), yaw: finite(yaw), pitch: finite(pitch)};
}

function position(laneIndex, phase, frame) {
  const lane = LANES[laneIndex];
  const a = phase + frame.clock * lane.speed;
  const x = Math.cos(a), y = Math.sin(a) * Math.cos(lane.tilt), z = Math.sin(a) * Math.sin(lane.tilt);
  const cr = Math.cos(lane.roll), sr = Math.sin(lane.roll);
  const xx = x * cr - y * sr, yy = x * sr + y * cr;
  const c = Math.cos(frame.yaw), s = Math.sin(frame.yaw), cp = Math.cos(frame.pitch), sp = Math.sin(frame.pitch);
  const rx = xx * c - z * s, rz = xx * s + z * c;
  const ry = yy * cp - rz * sp, depth = yy * sp + rz * cp;
  return {x: frame.cx + rx * lane.radius * frame.scale,
    y: frame.cy - ry * lane.radius * frame.scale,
    z: depth * lane.radius, front: depth >= 0};
}

/** Pure geometry; all coordinates/radii are CSS pixels and clock is seconds. */
export function holderOrbitGeometry(profiles, frame) {
  const members = Array.isArray(profiles) ? profiles.slice(0, MAX_HOLDER_PROFILES) : [];
  const layout = frameGeometry(frame, members.length);
  if (!layout) return [];
  return members.map(profile => {
    const seed = holderOrbitSeed(profile.id);
    return {...position(seed.lane, seed.phase, layout), ...seed, profile,
      diameter: layout.diameter * (.94 + .06 * Math.max(0, Math.sin(seed.phase)))};
  }).sort((a, b) => a.z - b.z || String(a.profile.id).localeCompare(String(b.profile.id)));
}

/**
 * Call draw(front:false) before the body and draw(front:true) after it, with the
 * same frame. Pass reduced:true for reduced motion OR a paused clock so a newly
 * received buyer is immediately visible. The parent owns all animation.
 */
export function createHolderOrbits({requestFrame = () => {}} = {}) {
  let profiles = [], destroyed = false, hits = [], lastClock = null;
  const arrivals = new Map(), pictures = new Map();

  function release(entry) {
    if (entry.image) {
      entry.image.onload = entry.image.onerror = null;
      entry.image.removeAttribute('src');
      entry.image = null;
    }
    entry.tile = null;
  }

  function load(url) {
    if (pictures.has(url)) return;
    const entry = {image: null, tile: null, state: 'loading'};
    pictures.set(url, entry);
    const image = entry.image = new Image();
    image.decoding = 'async'; image.crossOrigin = 'anonymous'; image.referrerPolicy = 'no-referrer';
    const current = () => !destroyed && pictures.get(url) === entry;
    image.onerror = () => {
      if (!current()) return;
      entry.state = 'failed'; release(entry); requestFrame();
    };
    image.onload = () => {
      if (!current()) return;
      try {
        if (!image.naturalWidth || !image.naturalHeight) throw new Error('empty image');
        const tile = document.createElement('canvas'); tile.width = tile.height = TILE_SIZE;
        const ctx = tile.getContext('2d', {alpha: false});
        if (!ctx) throw new Error('no image context');
        const side = Math.min(image.naturalWidth, image.naturalHeight);
        ctx.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side,
          0, 0, TILE_SIZE, TILE_SIZE);
        release(entry); entry.tile = tile; entry.state = 'ready';
      } catch { release(entry); entry.state = 'failed'; }
      requestFrame();
    };
    image.src = url;
  }

  function setProfiles(next) {
    if (destroyed) return;
    const unique = new Map();
    for (const profile of Array.isArray(next) ? next : []) {
      if (!profile || typeof profile.id !== 'string' || !profile.id || unique.has(profile.id)) continue;
      unique.set(profile.id, profile);
      if (unique.size === MAX_HOLDER_PROFILES) break;
    }
    profiles = [...unique.values()]; hits = [];
    for (const id of arrivals.keys()) if (!unique.has(id)) arrivals.delete(id);
    for (const profile of profiles) if (!arrivals.has(profile.id)) arrivals.set(profile.id, lastClock);
    const urls = new Set(profiles.map(profile => profile.avatarUrl).filter(url => typeof url === 'string' && url));
    for (const [url, entry] of pictures) if (!urls.has(url)) { release(entry); pictures.delete(url); }
    for (const url of urls) load(url);
    requestFrame();
  }

  function draw(ctx, frame) {
    if (destroyed) return;
    const front = Boolean(frame.front);
    if (!front) hits = [];
    lastClock = finite(frame.clock);
    const layout = frameGeometry(frame, profiles.length);
    if (!layout) return;
    const points = holderOrbitGeometry(profiles, frame);
    ctx.save();
    // Three quiet ecliptics, painted in the same depth halves as their buyers.
    ctx.strokeStyle = 'rgba(163,127,59,.13)'; ctx.lineWidth = .65;
    for (let lane = 0; lane < LANES.length; lane++) {
      let previous = position(lane, 0, layout);
      ctx.beginPath();
      for (let i = 1; i <= 96; i++) {
        const point = position(lane, i / 96 * TAU, layout);
        if (point.front === front && previous.front === front) {
          ctx.moveTo(previous.x, previous.y); ctx.lineTo(point.x, point.y);
        }
        previous = point;
      }
      ctx.stroke();
    }
    for (const point of points) {
      if (point.front !== front) continue;
      const {profile, x, y} = point;
      if (arrivals.get(profile.id) === null) arrivals.set(profile.id, lastClock);
      const age = Math.max(0, lastClock - arrivals.get(profile.id));
      const t = frame.reduced ? 1 : clamp(age / 1.1, 0, 1);
      const fade = .35 + .65 * t * t * (3 - 2 * t);
      const entry = pictures.get(profile.avatarUrl), tile = entry?.tile;
      const radius = point.diameter / 2 * (.88 + .12 * t);
      ctx.save(); ctx.globalAlpha *= (front ? .98 : .66) * fade;
      if (tile) {
        hexagon(ctx, x, y, radius);
        ctx.fillStyle = '#f7f4ea'; ctx.fill();
        ctx.save(); ctx.clip(); ctx.drawImage(tile, x - radius, y - radius, radius * 2, radius * 2); ctx.restore();
        ctx.strokeStyle = front ? 'rgba(151,112,40,.66)' : 'rgba(151,112,40,.38)';
        ctx.lineWidth = .85; ctx.stroke();
      } else {
        // Failed or still loading: an honest neutral point, never another face.
        ctx.fillStyle = '#b6985c'; hexagon(ctx, x, y, 2.2); ctx.fill();
      }
      ctx.restore();
      hits.push({profile, x, y, radius: tile ? radius : 4, front,
        cx: layout.cx, cy: layout.cy, bodyRadius: layout.radius * 1.34});
    }
    ctx.restore();
  }

  function hitTest(x, y) {
    if (destroyed || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    for (let i = hits.length - 1; i >= 0; i--) {
      const hit = hits[i];
      // The actual dodecahedron occludes the back paint. Its perspective bound
      // is conservative here: never allow an invisible buyer through the body.
      if (!hit.front && Math.hypot(x - hit.cx, y - hit.cy) <= hit.bodyRadius) continue;
      const dx = Math.abs(x - hit.x), dy = Math.abs(y - hit.y);
      if (dy <= hit.radius * HEX_HEIGHT && HEX_HEIGHT * dx + dy / 2 <= hit.radius * HEX_HEIGHT) return hit.profile;
    }
    return null;
  }

  return {setProfiles, draw, hitTest, get count() { return profiles.length; },
    destroy() {
      if (destroyed) return;
      destroyed = true; profiles = []; hits = []; arrivals.clear();
      for (const entry of pictures.values()) release(entry);
      pictures.clear();
    }};
}
