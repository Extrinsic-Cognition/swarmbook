// mint-sphere.js: the optimism.fit mint's sphere, cloned for his land grab (Oct 14 2026 04:5x WEST: "you must start from the
// dodecahedron clone of what we got in the optimism.fit saint seya"). The body is app/warm-sphere.js as it stood on Oct 14, in
// the mode the live mint runs (confirmed, capacity 0): the dodecahedron with the film on the twelve pentagons, the star seen
// through every open face, the atmosphere, the instrument rings, the growth morph (an inherited face travels to its new face,
// a new face opens from an edge) and the red carpet's flashes, line for line. What is new is only the land: a holder's face
// laid on their hexagon inside their metal's rim (gold glows: it has gravity), a gold's well in its tone, new land white where
// it is born, the coin flips as strokes on the axis of the two masses they chose between, the frontier's white dots. The
// layout comes from mint-gravity.mjs; this file draws it and turns it. A lab renderer, not in the build (the build copies
// app/, js/, skills/ and submission/); a landing folds these paints back into warm-sphere.js as hooks, never keeps a copy.
// Since Oct 14 07:xx (mint-clock.html, financial time) it RESTS: a frame comes only while a cause is alive (a glide, a holder on
// the carpet, the radius settling, a film playing on a chair or the star, the close's flare), and nothing at rest costs anything;
// the live mint's idle spin is the option `idle` (mint-gravity.html, the clone, asks for it). `setRefine` is the close, visual
// only; `drawNow` and `stats` are for the bench.
import {SPHERE_X} from '../app/sphere-centre.mjs';
const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;
const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
const mediaReady = media => media instanceof HTMLVideoElement
  ? media.readyState >= 2 && media.videoWidth > 0
  : media instanceof HTMLCanvasElement ? media.width > 0 : Boolean(media?.complete && media.naturalWidth);
function drawPortrait(ctx, media, x, y, width, height) {
  if (media instanceof HTMLVideoElement) {
    const side = Math.min(media.videoWidth, media.videoHeight);
    ctx.drawImage(media, (media.videoWidth - side) / 2, (media.videoHeight - side) / 2, side, side, x, y, width, height);
  } else ctx.drawImage(media, x, y, width, height);
}

function rotate(p, yaw, pitch) {
  const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x = p[0] * c - p[2] * s, z = p[0] * s + p[2] * c;
  return [x, p[1] * cp - z * sp, p[1] * sp + z * cp];
}

function inside(point, polygon) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [x, y] = polygon[i], [xx, yy] = polygon[j];
    if ((y > point[1]) !== (yy > point[1]) && point[0] < (xx - x) * (point[1] - y) / (yy - y) + x) result = !result;
  }
  return result;
}

function path(ctx, points) {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
}

const unit = p => { const length = Math.hypot(...p) || 1; return p.map(x => x / length); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const blend = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
function alignCorners(source, target) {
  let best = Infinity, offset = 0;
  for (let shift = 0; shift < source.length; shift++) {
    const cost = target.reduce((sum, p, i) => sum + p.reduce((d, x, axis) => d + (x - source[(i + shift) % source.length][axis]) ** 2, 0), 0);
    if (cost < best) { best = cost; offset = shift; }
  }
  return target.map((_, i) => source[(i + offset) % source.length]);
}

// warm-sphere.js's morphPlan, unchanged: inherited polygons travel to their new faces (here every cell of land is inherited
// by its id, so bronze glides and gold holds); a face nobody inherited opens from the nearest existing edge.
export function morphPlan(previous, next) {
  const oldFaces = [...previous.skin.pents, ...previous.skin.hexes];
  const used = new Set(), pinned = new Map();
  for (const [id, slot] of next.slots) {
    const old = previous.slots.get(id);
    if (old) { pinned.set(slot.faceIndex, old.face); used.add(old.face.id); }
  }
  const startFor = (face, index) => {
    let from = index < 0 ? previous.skin.pents.find(old => old.id === face.id) : pinned.get(index);
    if (!from && index >= 0) {
      from = previous.skin.hexes.filter(old => !used.has(old.id)).sort((a, b) => dot(b.normal, face.normal) - dot(a.normal, face.normal))[0];
      if (from) used.add(from.id);
    }
    if (from) return {face, start: alignCorners(from.verts, face.verts), startNormal: from.normal};
    let score = -Infinity, edge = [face.center, face.center];
    for (const old of oldFaces) for (let i = 0; i < old.verts.length; i++) {
      const a = old.verts[i], b = old.verts[(i + 1) % old.verts.length];
      const candidate = dot(unit(blend(a, b, .5)), face.normal);
      if (candidate > score) { score = candidate; edge = [a, b]; }
    }
    const middle = blend(...edge, .5), direction = edge[1].map((x, i) => x - edge[0][i]);
    const length = dot(direction, direction) || 1;
    const start = face.verts.map(p => blend(...edge, clamp(.5 + dot(p.map((x, i) => x - middle[i]), direction) / length)));
    return {face, start, startNormal: unit(middle)};
  };
  const pents = next.skin.pents.map(face => startFor(face, -1));
  const hexes = next.skin.hexes.map(startFor);
  return progress => {
    if (progress >= 1) return next.skin;
    const interpolate = ({face, start, startNormal}) => {
      const verts = face.verts.map((point, i) => blend(start[i], point, progress));
      return {...face, verts, normal: unit(blend(startNormal, face.normal, progress)), center: [0, 1, 2].map(axis => verts.reduce((sum, point) => sum + point[axis], 0) / verts.length)};
    };
    return {pents: pents.map(interpolate), hexes: hexes.map(interpolate)};
  };
}

const METAL = {gold: {rim: '#c9a227', glow: '#ffe3a1', fill: '#dcb867'}, bronze: {rim: '#b87333', glow: '#e9b48a', fill: '#c99a6e'}};
const tone = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };

export function createMintSphere(canvas, {onFace = () => {}, portraitOf = () => null, idle = false} = {}) {
  const ctx = canvas.getContext('2d', {alpha: true});
  if (!ctx) throw new Error('The mint sphere needs a 2D canvas');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = media.matches, paused = false, inView = true, destroyed = false;
  let width = 1, height = 1, frame = 0, lastTime = null, clock = 0;
  let yaw = -.32, pitch = -.12, renderedRadius = .2, growth = null, pointer = null, hitFaces = [];
  let refine = {level: 0, closed: false}, flareAt = null, draws = 0, frames = 0;
  let layout = {skin: {pents: [], hexes: []}, rung: 0, capacity: 0, count: 0, slots: new Map(), byFace: [], cellAngle: 1.1};
  const arrivalsAt = new Map();   // holder id:metal -> the clock time they walk onto the sphere
  const arrivalOf = holder => arrivalsAt.get(holder.id + ':' + holder.metal) ?? -10;
  const chairs = Array(12).fill(null);
  let star = null;
  const stars = Array.from({length: 76}, (_, i) => ({
    x: (Math.sin(i * 127.1 + 38.2) * 43758.5453) % 1,
    y: (Math.sin(i * 311.7 + 13.9) * 9631.131) % 1,
    size: i % 13 === 0 ? 1.25 : .45 + i % 3 * .2,
  }));

  function beginGrowth(previous, next) {
    growth = {at: clock, duration: 1.6, progress: 0, applied: 0, tilt: 0, shape: morphPlan(previous, next)};
  }

  function resize() {
    if (destroyed) return;
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    requestFrame();
  }

  function project(p, center, radius) {
    const scale = radius * 4 / (4 - p[2]);
    return [center[0] + p[0] * scale, center[1] - p[1] * scale];
  }

  function atmosphere(center, radius) {
    const glow = ctx.createRadialGradient(center[0], center[1], radius * .15, center[0], center[1], radius * 1.85);
    glow.addColorStop(0, '#fffefa00'); glow.addColorStop(.56, '#dbb66512'); glow.addColorStop(1, '#c3aa6500');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    ctx.save(); ctx.translate(center[0], center[1] + radius * 1.15); ctx.scale(1, .13);
    const shadow = ctx.createRadialGradient(0, 0, radius * .1, 0, 0, radius * 1.25);
    shadow.addColorStop(0, '#39443724'); shadow.addColorStop(.55, '#70776110'); shadow.addColorStop(1, '#70776100');
    ctx.fillStyle = shadow; ctx.beginPath(); ctx.arc(0, 0, radius * 1.25, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save();
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i], x = (s.x + 1) % 1 * width, y = (s.y + 1) % 1 * height;
      const distance = Math.hypot(x - center[0], y - center[1]);
      const alpha = .13 + .13 * (.5 + .5 * Math.sin(clock * .18 + i));
      if (distance < radius * .8) continue;
      ctx.fillStyle = `rgba(133,112,71,${alpha * .9})`;
      ctx.beginPath(); ctx.arc(x, y, s.size, 0, TAU); ctx.fill();
      if (s.size > 1) {
        ctx.strokeStyle = 'rgba(103,124,112,.19)'; ctx.lineWidth = .6;
        ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke();
      }
    }
    ctx.restore();
  }

  function instrument(center, radius, front) {
    ctx.save();
    const rings = [
      {r: 1.3, tilt: .98, roll: -.2, color: 'rgba(132,111,63,.21)'},
      {r: 1.58, tilt: .36, roll: .26, color: 'rgba(103,120,102,.11)'},
      {r: 1.44, tilt: 1.13, roll: .82, color: 'rgba(71,128,125,.14)'},
    ];
    for (const [index, ring] of rings.entries()) {
      ctx.strokeStyle = ring.color; ctx.lineWidth = index === 0 ? .7 : .55;
      ctx.beginPath(); let pen = false;
      for (let i = 0; i <= 180; i++) {
        const a = i / 180 * TAU;
        const p = rotate([Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0], ring.roll + yaw * .13, ring.tilt);
        if ((p[2] > 0) !== front) { pen = false; continue; }
        const [x, y] = project(p, center, radius);
        pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true;
      }
      ctx.stroke();
      if (front) continue;
      for (let j = 0; j < 72; j++) {
        if (index !== 0 && j % 6) continue;
        const a = j / 72 * TAU, long = j % 6 === 0;
        const p = rotate([Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0], ring.roll + yaw * .13, ring.tilt);
        const q = rotate([Math.cos(a) * (ring.r + (long ? .036 : .014)), Math.sin(a) * (ring.r + (long ? .036 : .014)), 0], ring.roll + yaw * .13, ring.tilt);
        const pp = project(p, center, radius), qq = project(q, center, radius);
        ctx.beginPath(); ctx.moveTo(...pp); ctx.lineTo(...qq); ctx.stroke();
      }
    }
    ctx.restore();
  }

  // A face's own square as the screen sees it (warm-sphere.js's decal): a picture laid on the face turns with the sphere.
  function decal(face, spin, center, radius) {
    const n = face.normal, across = unit(cross(Math.abs(n[1]) > .95 ? [1, 0, 0] : [0, 1, 0], n)), up = cross(n, across);
    const rho = Math.hypot(...face.verts[0].map((v, i) => v - face.center[i]));
    const at = p => project(rotate(p, spin.yaw, spin.pitch), center, radius);
    const m = at(face.center), x = at(face.center.map((c, i) => c + across[i] * rho)), y = at(face.center.map((c, i) => c - up[i] * rho));
    return [x[0] - m[0], x[1] - m[1], y[0] - m[0], y[1] - m[1], m[0], m[1]];
  }

  // The one at the centre: the star, seen through every face still open; as holders take the faces the sphere closes on it.
  function drawStar(center, radius, alpha) {
    if (!mediaReady(star)) return;
    const r = radius * (.34 + .03 * refine.level), [x, y] = center;   // the close: the star nearer at each refinement step
    ctx.save(); ctx.globalAlpha = alpha;
    const light = ctx.createRadialGradient(x, y, r * .9, x, y, radius * .98);
    light.addColorStop(0, 'rgba(255,233,178,.75)'); light.addColorStop(.45, 'rgba(244,206,128,.28)'); light.addColorStop(1, 'rgba(244,206,128,0)');
    ctx.fillStyle = light; ctx.beginPath(); ctx.arc(x, y, radius * .98, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip(); drawPortrait(ctx, star, x - r, y - r, r * 2, r * 2); ctx.restore();
    ctx.strokeStyle = '#d9b46a'; ctx.lineWidth = 1.4; ctx.shadowColor = '#ffe0a0'; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  function inset(points, middle, color, alpha) {
    const ring = points.map(([x, y]) => [lerp(x, middle[0], .055), lerp(y, middle[1], .055)]);
    ctx.save(); ctx.globalAlpha = alpha * .48; ctx.strokeStyle = color; ctx.lineWidth = .7; path(ctx, ring); ctx.stroke(); ctx.restore();
  }

  function drawSkin(skin, center, radius, spin, alpha = 1) {
    const faces = [...skin.pents.map(face => ({face, index: -1})), ...skin.hexes.map((face, index) => ({face, index}))]
      .map(item => ({...item, normal: rotate(item.face.normal, spin.yaw, spin.pitch)}))
      .sort((a, b) => a.normal[2] - b.normal[2]);
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const light = [-.32, .7, .64], seed = skin.hexes.length === 0, rung = layout.rung;
    let starBehind = true;
    for (const item of faces) {
      const {face, index, normal} = item, front = normal[2] > -.02;
      if (starBehind && front) { drawStar(center, radius, alpha); starBehind = false; }
      const pentagon = index < 0, slot = pentagon ? null : layout.byFace[index];
      const holder = slot?.holder && clock >= arrivalOf(slot.holder) ? slot.holder : null;
      const points = face.verts.map(p => project(rotate(p, spin.yaw, spin.pitch), center, radius));
      const middle = project(rotate(face.center, spin.yaw, spin.pitch), center, radius);
      const rho = Math.hypot(...face.verts[0].map((v, i) => v - face.center[i])), cellPx = rho * radius;
      const lit = clamp(.31 + .69 * Math.max(0, dot(normal, light)));
      ctx.globalAlpha = alpha * (front ? 1 : .15);
      if (pentagon) {
        // one of the twelve chairs: the film on the pentagon, shaded on the side the panels around it are shaded
        const person = front ? chairs[Number(face.id.split(':')[1])] : null, portrait = mediaReady(person) ? person : null;
        ctx.fillStyle = seed
          ? `rgb(${Math.round(192 + 56 * lit)},${Math.round(195 + 53 * lit)},${Math.round(185 + 56 * lit)})`
          : `rgb(${Math.round(148 + 83 * lit)},${Math.round(131 + 78 * lit)},${Math.round(86 + 70 * lit)})`;
        path(ctx, points);
        if (portrait) {
          ctx.save(); ctx.clip(); ctx.transform(...decal(face, spin, center, radius)); drawPortrait(ctx, portrait, -1, -1, 2, 2); ctx.restore();
          ctx.save(); ctx.globalAlpha *= (1 - lit) * .5; ctx.fillStyle = '#2f3328'; path(ctx, points); ctx.fill(); ctx.restore();
          path(ctx, points);
        } else if (!seed) ctx.fill();
        ctx.strokeStyle = front ? 'rgba(151,113,42,.74)' : 'rgba(91,109,88,.28)'; ctx.lineWidth = .65; ctx.stroke();
        if (front && radius > 90 && !seed) inset(points, middle, '#f5e6bf', alpha);
      } else if (holder) {
        // a holder: their face laid on their hexagon, inside their metal's rim; a gold's light falls on the land around it
        const metal = METAL[holder.metal], age = clock - arrivalOf(holder), forming = ease(age / 1.7), tile = portraitOf(holder);
        if (holder.metal === 'gold' && front) {
          const halo = ctx.createRadialGradient(middle[0], middle[1], cellPx * .5, middle[0], middle[1], cellPx * 3.4);
          halo.addColorStop(0, 'rgba(233,194,120,.42)'); halo.addColorStop(1, 'rgba(233,194,120,0)');
          ctx.save(); ctx.globalAlpha = alpha * forming; ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(...middle, cellPx * 3.4, 0, TAU); ctx.fill(); ctx.restore();
        }
        path(ctx, points);
        if (tile && front) {
          ctx.save(); ctx.clip(); ctx.transform(...decal(face, spin, center, radius)); ctx.drawImage(tile, -1, -1, 2, 2); ctx.restore();
          ctx.save(); ctx.globalAlpha *= (1 - lit) * .45; ctx.fillStyle = '#2f3328'; path(ctx, points); ctx.fill(); ctx.restore();
          path(ctx, points);
        } else { ctx.fillStyle = metal.fill; ctx.fill(); }
        ctx.strokeStyle = front ? metal.rim : tone(metal.rim, .5);
        ctx.lineWidth = holder.metal === 'gold' ? Math.max(1.6, cellPx * .17) : Math.max(1.1, cellPx * .1);
        if (holder.metal === 'gold' && front) { ctx.shadowColor = metal.glow; ctx.shadowBlur = 12; }
        ctx.stroke(); ctx.shadowBlur = 0;
        if (front && radius > 90) inset(points, middle, '#ffffff', alpha);
        if (front && age < 2.1) {
          ctx.save(); ctx.globalAlpha = alpha * (1 - ease(age / 2.1)); ctx.strokeStyle = holder.metal === 'gold' ? '#b38325' : '#a0612b';
          ctx.lineWidth = 1.7; ctx.shadowColor = metal.glow; ctx.shadowBlur = 17; path(ctx, points); ctx.stroke(); ctx.restore();
        }
      } else {
        // open land: an opening in the frame (the star shows through); a gold's well tints it; new land is white where it is born
        const age = slot ? rung - slot.born : 9, newborn = age < 4 ? 1 - age / 4 : 0;
        path(ctx, points);
        if (slot?.well) { ctx.fillStyle = tone(slot.well, front ? .3 + .14 * lit : .12); ctx.fill(); }
        if (newborn > 0) { ctx.save(); ctx.globalAlpha *= newborn * (front ? .5 : .2); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.restore(); }
        ctx.strokeStyle = slot?.well ? tone(slot.well, front ? .78 : .3) : front ? 'rgba(69,78,65,.40)' : 'rgba(91,109,88,.28)';
        ctx.lineWidth = .65; ctx.stroke();
        if (front && refine.level > 0) {
          // the close (visual only): one inner ring more on the land left at each halving of it, converging on the star
          ctx.save(); ctx.strokeStyle = 'rgba(217,180,106,.6)'; ctx.lineWidth = .6;
          for (let k = 1; k <= refine.level; k++) { const f = k / (refine.level + 1); path(ctx, points.map(([x, y]) => [lerp(x, middle[0], f), lerp(y, middle[1], f)])); ctx.stroke(); }
          ctx.restore();
        }
        if (front && slot?.flip && slot.axis) {
          // the coin flip: a stroke on the axis of the two masses this land chose between, bold on the rung it was born
          const [a, b] = slot.axis, n = face.normal, ab = b.map((x, i) => x - a[i]), along = dot(ab, n);
          const t = unit(ab.map((x, i) => x - along * n[i])), reach = Math.min(rho * .55, 13 / Math.max(1, radius));
          const p0 = project(rotate(face.center.map((c, i) => c - t[i] * reach), spin.yaw, spin.pitch), center, radius);
          const p1 = project(rotate(face.center.map((c, i) => c + t[i] * reach), spin.yaw, spin.pitch), center, radius);
          const bold = slot.born === rung;
          ctx.save(); ctx.globalAlpha = alpha * (bold ? .86 : .6); ctx.strokeStyle = '#26281f';
          ctx.lineWidth = bold ? Math.min(4.5, Math.max(1.8, cellPx * .2)) : Math.min(1.6, Math.max(.8, cellPx * .07));
          ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); ctx.stroke(); ctx.restore();
        }
        if (front && slot?.frontier) {
          ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#26281f'; ctx.lineWidth = .9;
          ctx.beginPath(); ctx.arc(...middle, Math.max(2.4, cellPx * .26), 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
        }
      }
      if (front && alpha > .7) hitFaces.push({points, face, index, slot, depth: normal[2]});
    }
    ctx.restore();
  }

  // The red carpet (warm-sphere.js): a holder walks in on their turn and the flashes go off where they land, gone in under a second.
  function arrivals(center, radius) {
    ctx.save();
    for (const slot of layout.byFace) {
      if (!slot?.holder) continue;
      const age = clock - arrivalOf(slot.holder);
      if (age < 0 || age > .7) continue;
      if (rotate(slot.face.normal, yaw, pitch)[2] < .05) continue;
      const at = project(rotate(slot.face.center, yaw, pitch), center, radius);
      for (let k = 0; k < 3; k++) {
        const t = (age - k * .11) / .34;
        if (t < 0 || t > 1) continue;
        const a = slot.faceIndex * 2.399963 + k * 2.1, d = radius * (.03 + .03 * k);
        const x = at[0] + Math.cos(a) * d, y = at[1] + Math.sin(a) * d, s = (radius * .028 + 2) * (1 - t * .5);
        ctx.globalAlpha = 1 - t;
        const core = ctx.createRadialGradient(x, y, 0, x, y, s * 2.2);
        core.addColorStop(0, 'rgba(255,255,255,1)'); core.addColorStop(.3, 'rgba(255,226,150,.75)'); core.addColorStop(1, 'rgba(255,226,150,0)');
        ctx.fillStyle = core; ctx.beginPath(); ctx.arc(x, y, s * 2.2, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(170,128,46,.9)'; ctx.lineWidth = .9; ctx.shadowColor = '#ffe3a1'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(x - s * 3, y); ctx.lineTo(x + s * 3, y); ctx.moveTo(x, y - s * 3); ctx.lineTo(x, y + s * 3);
        ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x - s, y + s); ctx.lineTo(x + s, y - s); ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
    ctx.restore();
  }

  function draw() {
    draws++;
    ctx.clearRect(0, 0, width, height);
    const center = [width * SPHERE_X, height * .5];
    const radius = Math.min(width, height) * renderedRadius;
    hitFaces = [];
    atmosphere(center, radius); instrument(center, radius, false);
    drawSkin(growth ? growth.shape(growth.progress) : layout.skin, center, radius, {yaw, pitch});
    instrument(center, radius, true); arrivals(center, radius);
    if (flareAt != null) {
      // the close: the rim flares once as the last seat is taken (1.2 s), then the sphere stands closed on its star
      const a = (clock - flareAt) / 1.2;
      if (a < 1) { ctx.save(); ctx.globalAlpha = 1 - a; ctx.strokeStyle = '#ffe3a1'; ctx.lineWidth = 3 + 30 * a; ctx.shadowColor = '#ffe3a1'; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(center[0], center[1], radius * (1 + .25 * a), 0, TAU); ctx.stroke(); ctx.restore(); }
    }
    hitFaces.sort((a, b) => a.depth - b.depth);
  }

  // the sphere grows with its floor: the seed at a fifth of the stage, the full society at a third, a step nearer at each refinement
  function targetRadius() { return .2 + .12 * Math.sqrt(Math.min(1, layout.capacity / 240)) + .012 * refine.level; }
  // what keeps frames coming: a glide, a holder on the carpet, the radius settling, a film playing on a chair or the star, the close's
  // flare; or the clone's idle spin. With none of these the loop ends, and nothing draws until a cause asks (requestFrame).
  function alive() {
    if (idle || growth || renderedRadius !== targetRadius()) return true;
    if (flareAt != null && clock - flareAt < 1.2) return true;
    for (const slot of layout.byFace) if (slot?.holder && clock - arrivalOf(slot.holder) < 2.1) return true;
    const playing = m => m instanceof HTMLVideoElement && !m.paused && !m.ended;
    return playing(star) || chairs.some(playing);
  }

  function canAnimate() { return !destroyed && !paused && !reduced && inView && !document.hidden; }
  function requestFrame() { if (!destroyed && !frame) frame = requestAnimationFrame(tick); }
  function tick(timestamp) {
    frame = 0; frames++;
    if (destroyed) return;
    const dt = lastTime == null ? 0 : Math.min(.05, (timestamp - lastTime) / 1000);
    lastTime = timestamp;
    if (canAnimate()) { clock += dt; if (idle && !pointer) yaw += dt * .12; }
    const target = targetRadius();
    const catchup = reduced || paused || !inView || document.hidden ? 1 : 1 - Math.exp(-dt * 2.8);
    if (growth) {
      const p = reduced ? 1 : ease((clock - growth.at) / growth.duration);
      if (canAnimate() && !pointer) {
        yaw += (p - growth.applied) * 1.05;
        const tilt = .12 * Math.sin(p * Math.PI);
        pitch += tilt - growth.tilt; growth.tilt = tilt;
      } else if (pointer) growth.tilt = .12 * Math.sin(p * Math.PI);
      growth.progress = p; growth.applied = p;
      if (p >= 1) growth = null;
    }
    renderedRadius = lerp(renderedRadius, target, catchup);
    if (Math.abs(renderedRadius - target) < 2e-4) renderedRadius = target;
    draw();
    if (canAnimate() && alive()) frame = requestAnimationFrame(tick);
    else lastTime = null;
  }

  function pointerDown(event) {
    if (event.button !== 0) return;
    pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false};
    canvas.setPointerCapture?.(event.pointerId);
  }
  function pointerMove(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    if (Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 5) pointer.moved = true;
    yaw += dx * .006; pitch = clamp(pitch + dy * .004, -1.35, 1.35);
    pointer.x = event.clientX; pointer.y = event.clientY;
    requestFrame();
  }
  function pointerUp(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const wasClick = !pointer.moved;
    pointer = null;
    if (!wasClick) return;
    const bounds = canvas.getBoundingClientRect(), point = [event.clientX - bounds.left, event.clientY - bounds.top];
    const hit = [...hitFaces].reverse().find(face => inside(point, face.points));
    if (!hit) return;
    onFace(hit.index < 0 ? {kind: 'pent', chair: Number(hit.face.id.split(':')[1])} : {kind: 'hex', index: hit.index, slot: hit.slot});
  }
  function pointerCancel() { pointer = null; }
  function keyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') { yaw = -.32; pitch = -.12; }
    else if (event.key === 'ArrowLeft') yaw -= .14;
    else if (event.key === 'ArrowRight') yaw += .14;
    else pitch = clamp(pitch + (event.key === 'ArrowUp' ? -.1 : .1), -1.35, 1.35);
    requestFrame();
  }
  function visibility() {
    if (!canAnimate() && frame) { cancelAnimationFrame(frame); frame = 0; lastTime = null; }
    else if (canAnimate()) requestFrame();
  }
  function motionChange(event) { reduced = event.matches; visibility(); requestFrame(); }
  const resizeObserver = new ResizeObserver(resize);
  const intersection = new IntersectionObserver(entries => { inView = entries[0]?.isIntersecting !== false; visibility(); }, {rootMargin: '40px'});
  resizeObserver.observe(canvas); intersection.observe(canvas);
  document.addEventListener('visibilitychange', visibility);
  media.addEventListener('change', motionChange);
  canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', pointerCancel);
  canvas.addEventListener('lostpointercapture', pointerCancel); canvas.addEventListener('keydown', keyDown);
  resize();

  return {
    /** The land as mint-gravity.mjs lays it; a new floor grows into place (1.6 s), new holders walk the carpet in turn. */
    setLayout(next, {initial = false} = {}) {
      const fresh = [];
      for (const slot of next.byFace) if (slot?.holder && !arrivalsAt.has(slot.holder.id + ':' + slot.holder.metal)) fresh.push(slot);
      fresh.sort((a, b) => rotate(b.face.normal, yaw, pitch)[2] - rotate(a.face.normal, yaw, pitch)[2]);
      const step = fresh.length > 1 && canAnimate() ? Math.min(.22, 1.5 / fresh.length) : 0;
      fresh.forEach((slot, i) => arrivalsAt.set(slot.holder.id + ':' + slot.holder.metal, initial ? -10 : clock + i * step));
      if (!initial && next.capacity !== layout.capacity) beginGrowth(layout, next); else if (initial) growth = null;
      layout = next; requestFrame();
    },
    resetArrivals() { arrivalsAt.clear(); },
    setChairs(sources = []) { for (let i = 0; i < 12; i++) chairs[i] = sources[i] || null; requestFrame(); },
    setStar(source) { star = source || null; requestFrame(); },
    setPaused(value) { paused = Boolean(value); visibility(); requestFrame(); },
    redraw() { requestFrame(); },
    /** the close (visual only): `level` inner rings on the land left and the star nearer; `closed` flares the rim once */
    setRefine(next) {
      const was = refine; refine = {level: next?.level || 0, closed: Boolean(next?.closed)};
      if (refine.closed && !was.closed) flareAt = clock; else if (!refine.closed) flareAt = null;
      if (refine.level !== was.level || refine.closed !== was.closed) requestFrame();
    },
    /** one draw now, for a bench: the ms this thread spent issuing it */
    drawNow() { const t0 = performance.now(); draw(); return performance.now() - t0; },
    /** the bench's counters: draws made, frames ticked, whether anything keeps frames coming */
    stats() { return {draws, frames, alive: alive(), yaw, pitch, radius: renderedRadius}; },
    getViewState() { return {yaw, pitch, radius: renderedRadius, rung: layout.rung, capacity: layout.capacity, count: layout.count, growing: Boolean(growth), growthProgress: growth ? growth.progress : 1, paused}; },
    destroy() {
      destroyed = true; if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect(); intersection.disconnect();
      document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', motionChange);
      canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', pointerCancel);
      canvas.removeEventListener('lostpointercapture', pointerCancel); canvas.removeEventListener('keydown', keyDown);
    },
  };
}
