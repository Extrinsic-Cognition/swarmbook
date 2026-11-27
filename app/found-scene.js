// One world-space tree, one camera, one depth-sorted paint list.
// The scene observes the founding model; only its callbacks may change it.
import { skinForRung, rungFor, pointInPoly, shade, INK } from './orb.js';
import { capacityFromDrag } from './found-capacity.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const CAM = 8;
const LIGHT = [0.35, 0.55, -0.75];
const TAU = Math.PI * 2;

export function turn(p, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy;
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  return [x, p[1] * cp - z * sp, p[1] * sp + z * cp];
}

export function linkGrowth(unit, now, reduced = false) {
  if (unit.dying) return reduced ? 0 : Math.pow(1 - clamp((now - unit.dying) / 450, 0, 1), 2);
  if (!unit.born || reduced) return 1;
  return 1 - Math.pow(1 - clamp((now - unit.born) / 700, 0, 1), 3);
}

export function treeExtent(tree, id = tree.root) {
  let extent = 1;
  for (const child of Object.values(tree.units[id].children)) extent = Math.max(extent, 2.1 + 0.5 * treeExtent(tree, child));
  return extent;
}

export function layoutTree(tree, now, reduced = false, extent = treeExtent(tree), spinTime = now, skins = new Map()) {
  const placed = new Map();
  function layout(id, off, scale, spin) {
    const unit = tree.units[id], skin = skins.get(id) ?? skinForRung(rungFor(unit.seats));
    placed.set(id, { id, unit, skin, off, scale, spin });
    for (const [chair, childId] of Object.entries(unit.children)) {
      const child = tree.units[childId];
      const normal = skin.faces[Number(chair)].normal;
      const n = spin ? turn(normal, spin, spin * 0.6) : normal;
      const g = linkGrowth(child, now, reduced);
      const distance = (1.02 + 1.08 * g) * scale;
      const anchor = off.map((v, i) => v + n[i] * distance);
      layout(childId, anchor, scale * 0.5 * Math.max(0.06, g), (childId * 1.7 + Number(chair)) * 0.9 + (reduced ? 0 : spinTime * 0.00045));
    }
  }
  layout(tree.root, [0, 0, 0], 1.12 / extent, 0);
  return placed;
}

export function projectTree(tree, placed, camera, width, height, now, reduced = false, viewScale = 1) {
  const size = Math.min(820, width, height), focal = 0.4 * size * CAM * viewScale;
  const project = p => { const s = focal / (p[2] + CAM); return [width / 2 + p[0] * s, height / 2 - p[1] * s]; };
  const records = [], bodies = [];
  for (const [id, node] of placed) {
    const { off, scale, spin, unit, skin } = node;
    const offR = turn(off, camera.yaw, camera.pitch);
    const radius = scale * focal / (offR[2] + CAM);
    const center = project(offR);
    bodies.push({ id, z: offR[2], radius, center });
    if (radius < 7) {
      records.push({ kind: 'bead', id, z: offR[2], radius, center });
    } else {
      for (const [index, face] of skin.faces.entries()) {
        const world = face.verts.map(p => {
          const q = spin ? turn(p, spin, spin * 0.6) : p;
          return turn(q.map((v, i) => v * scale + off[i]), camera.yaw, camera.pitch);
        });
        const localNormal = spin ? turn(face.normal, spin, spin * 0.6) : face.normal;
        const normal = turn(localNormal, camera.yaw, camera.pitch);
        records.push({ kind: 'face', id, chair: face.chair, index, poly: world.map(project), normal,
          pickable: radius >= 14 && normal[2] < 0,
          bound: face.chair >= 0 && unit.children[face.chair] !== undefined,
          z: world.reduce((sum, p) => sum + p[2], 0) / world.length });
      }
    }
    for (const [chair, childId] of Object.entries(unit.children)) {
      const normal = skin.faces[Number(chair)].normal;
      const n = spin ? turn(normal, spin, spin * 0.6) : normal;
      const g = linkGrowth(tree.units[childId], now, reduced);
      const endpoint = d => turn(off.map((v, i) => v + n[i] * d * scale), camera.yaw, camera.pitch);
      const a = endpoint(1.02), b = endpoint(1.02 + 0.62 * g);
      records.push({ kind: 'link', id, z: (a[2] + b[2]) / 2, a: project(a), b: project(b) });
    }
  }
  records.sort((a, b) => b.z - a.z);
  return { records, bodies };
}

// Pick the surface actually painted on top, including hexagons that occlude
// another chamber's pentagon. The face and hit test share projected vertices.
export function pickSurface(records, x, y) {
  for (let i = records.length - 1; i >= 0; i--) {
    const record = records[i];
    if (record.kind === 'face' && pointInPoly(x, y, record.poly)) return record;
    if (record.kind === 'bead' && Math.hypot(x - record.center[0], y - record.center[1]) < Math.max(10, record.radius)) return record;
  }
  return null;
}


const morphOrigins = new WeakMap();
export function morphSkin(from, to, t) {
  if (t >= 1 || from === to) return to;
  let targets = morphOrigins.get(from);
  if (!targets) { targets = new WeakMap(); morphOrigins.set(from, targets); }
  let radii = targets.get(to);
  if (!radii) {
    const planes = from.faces.map(face => ({ normal: face.normal, distance: face.normal.reduce((sum, n, i) => sum + n * face.verts[0][i], 0) }));
    radii = to.faces.map(face => face.verts.map(v => {
      let radius = 1;
      for (const plane of planes) {
        const dot = plane.normal.reduce((sum, n, i) => sum + n * v[i], 0);
        if (dot > 1e-8) radius = Math.min(radius, plane.distance / dot);
      }
      return radius;
    }));
    targets.set(to, radii);
  }
  return { ...to, faces: to.faces.map((face, fi) => ({ ...face, verts: face.verts.map((v, vi) => {
    const radius = radii[fi][vi];
    return v.map(x => x * (radius + (1 - radius) * t));
  }) })) };
}

export function createFoundingScene(canvas, { tree, selected, onSelect, onChair, onHover, onFrame, onBeginCapacity, onCapacity, onEndCapacity, canEdit = () => true, viewScale = () => 1, still = false, dark = false }) {
  const ctx = canvas.getContext('2d'), host = canvas.parentElement;
  const motion = still ? { matches: true, addEventListener() {} } : matchMedia('(prefers-reduced-motion: reduce)');   // still: drawn on cause alone, as for reduced motion (the wall's wish card: nothing at rest costs anything)
  const events = new AbortController(), options = { signal: events.signal };
  const camera = { yaw: 0.6, pitch: -0.16 };
  let width = 1, height = 1, dpr = 1, raf = 0, lastStamp = null;
  let now = performance.now(), autoSpinAt = 0, pointer = null, hover = null;
  let records = [], bodies = [], disposed = false, visible = true;
  let extent = treeExtent(tree), pointerPosition = null;
  let spinTime = now;
  const transitions = new Map();

  function fit() {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    dpr = Math.min(2.5, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    invalidate();
  }

  function setHover(next) {
    const chair = next?.kind === 'face' && next.pickable && next.chair >= 0 ? next : null;
    if (hover?.id !== chair?.id || hover?.chair !== chair?.chair || hover?.bound !== chair?.bound) onHover(chair);
    hover = chair;
    canvas.style.cursor = pointer?.edit ? 'ew-resize' : pointer ? 'grabbing' : chair ? 'ew-resize' : 'grab';
  }

  function paint() {
    const id = selected();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height); if (dark && bodies[0]) { const b = bodies[0]; ctx.save(); ctx.strokeStyle = 'rgba(240,207,116,.2)'; ctx.lineWidth = 1; ctx.setLineDash([4, 6]); for (const [rx, ry, rot] of [[1.55, .72, -.38], [1.48, .66, .52]]) { ctx.beginPath(); ctx.ellipse(b.center[0], b.center[1], b.radius * rx, b.radius * ry, rot, 0, TAU); ctx.stroke(); } ctx.restore(); }
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const record of records) {
      if (record.kind === 'link') {
        ctx.strokeStyle = INK.tether; ctx.globalAlpha = 0.55; ctx.lineWidth = 2; ctx.setLineDash([7, 7]);
        ctx.beginPath(); ctx.moveTo(...record.a); ctx.lineTo(...record.b); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha = 1;
      } else if (record.kind === 'bead') {
        ctx.beginPath(); ctx.arc(...record.center, Math.max(1.2, record.radius), 0, TAU);
        ctx.fillStyle = '#E6DFCE'; ctx.fill(); ctx.lineWidth = 1;
        ctx.strokeStyle = record.id === id ? INK.gold : INK.line; ctx.stroke();
      } else {
        const hot = hover && record.id === hover.id && record.chair === hover.chair;
        const base = hot ? (record.bound ? '#DE8A7E' : '#F4B400')
          : dark ? (record.chair >= 0 ? (record.chair % 2 ? '#3a2f1c' : '#4a3b20') : (record.index % 3 ? '#141b28' : '#101622'))
          : record.chair >= 0 ? (record.chair % 2 ? INK.unsworn : INK.vacant) : (record.index % 3 ? INK.paperB : INK.paperA);
        const lam = 0.72 + 0.4 * Math.max(0, record.normal.reduce((sum, n, i) => sum + n * LIGHT[i], 0));
        ctx.beginPath(); record.poly.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath();
        ctx.fillStyle = shade(base, lam); ctx.fill();
        ctx.lineWidth = dark ? 1.15 : record.id === tree.root ? 2.2 : 1.5; ctx.strokeStyle = dark ? 'rgba(240,207,116,.52)' : 'rgba(23,20,17,.55)'; ctx.stroke();
      }
    }
    const body = bodies.find(body => body.id === id);
    if (body) {
      ctx.beginPath(); ctx.arc(...body.center, Math.max(body.radius * 1.14, body.radius + 5), 0, TAU);
      ctx.strokeStyle = INK.gold; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 5]); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
  }

  function frame(stamp) {
    raf = 0;
    if (disposed || document.hidden || !visible) { lastStamp = null; return; }
    const delta = lastStamp === null ? 0 : Math.min(50, Math.max(0, stamp - lastStamp));
    lastStamp = stamp;
    if (!motion.matches) { now += delta; if (!pointer?.edit) spinTime += delta; }
    onFrame(now, motion.matches);
    const target = treeExtent(tree);
    extent = motion.matches ? target : extent + (target - extent) * (1 - Math.exp(-delta / 180));
    if (Math.abs(extent - target) < 0.001) extent = target;
    if (!motion.matches && !pointer && now > autoSpinAt) camera.yaw += delta * 0.000096;
    const skins = new Map();
    for (const unit of Object.values(tree.units)) {
      const target = skinForRung(rungFor(unit.seats));
      let change = transitions.get(unit.id);
      if (!change) { change = { target, shown: target, from: target, at: now }; transitions.set(unit.id, change); }
      if (change.target !== target) { change.from = change.shown; change.target = target; change.at = now; }
      const t = motion.matches ? 1 : clamp((now - change.at) / 260, 0, 1);
      change.shown = t >= 1 ? target : morphSkin(change.from, target, 1 - Math.pow(1 - t, 3));
      skins.set(unit.id, change.shown);
    }
    for (const id of transitions.keys()) if (!tree.units[id]) transitions.delete(id);
    const placed = layoutTree(tree, now, motion.matches, extent, spinTime, skins);
    ({ records, bodies } = projectTree(tree, placed, camera, width, height, now, motion.matches, viewScale()));
    if (!pointer && pointerPosition) setHover(pickSurface(records, ...pointerPosition));
    paint();
    if (!motion.matches) invalidate();
  }
  function invalidate() {
    if (!disposed && !document.hidden && visible && !raf) raf = requestAnimationFrame(frame);
  }
  function pause() { if (raf) cancelAnimationFrame(raf); raf = 0; lastStamp = null; }
  function position(event) { const rect = canvas.getBoundingClientRect(); return [event.clientX - rect.left, event.clientY - rect.top]; }

  canvas.addEventListener('pointerdown', event => {
    if (pointer || !canEdit() || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const hit = pickSurface(records, ...position(event));
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false };
    if (hit?.kind === 'face' && hit.pickable && hit.chair >= 0 && onBeginCapacity) {
      pointer.edit = onBeginCapacity(hit.id, hit.chair);
      pointer.blocked = !pointer.edit;
    }
    canvas.setPointerCapture(event.pointerId); canvas.focus({ preventScroll: true });
    setHover(null); invalidate();
  }, options);
  canvas.addEventListener('pointermove', event => {
    if (pointer && pointer.id !== event.pointerId) return;
    pointerPosition = position(event);
    if (pointer) {
      const distance = event.clientX - pointer.startX;
      if (Math.hypot(distance, event.clientY - pointer.startY) > 3) pointer.moved = true;
      if (pointer.edit) {
        const capacity = capacityFromDrag(pointer.edit.seats, distance, Math.min(44, Math.max(28, width / 9)));
        // A tap on an existing arbitrary seat count only selects it.
        if (pointer.moved) onCapacity(pointer.edit, capacity);
      } else if (!pointer.blocked) {
        camera.yaw += (event.clientX - pointer.x) * 0.006;
        camera.pitch = clamp(camera.pitch - (event.clientY - pointer.y) * 0.004, -1.2, 1.2);
      }
      pointer.x = event.clientX; pointer.y = event.clientY; autoSpinAt = now + 2500;
    } else setHover(pickSurface(records, ...pointerPosition));
    invalidate();
  }, options);
  canvas.addEventListener('pointerup', event => {
    if (pointer?.id !== event.pointerId) return;
    const released = pointer; pointer = null; autoSpinAt = now + 2500;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (released.edit) {
      const distance = event.clientX - released.startX;
      if (Math.abs(distance) > 3) onCapacity(released.edit, capacityFromDrag(released.edit.seats, distance, Math.min(44, Math.max(28, width / 9))));
      onEndCapacity(released.edit, false);
    }
    else if (!released.moved && !released.blocked) {
      const hit = pickSurface(records, ...position(event));
      if (hit?.kind === 'face' && hit.pickable && hit.chair >= 0) onChair?.(hit.id, hit.chair);
      else onSelect(hit?.id ?? tree.root);
    }
    pointerPosition = event.pointerType === 'touch' ? null : position(event);
    setHover(null); invalidate();
  }, options);
  function cancelPointer(event) {
    if (event && pointer?.id !== event.pointerId) return;
    const cancelled = pointer; pointer = null;
    if (cancelled?.edit) onEndCapacity(cancelled.edit, true);
    if (cancelled && canvas.hasPointerCapture(cancelled.id)) canvas.releasePointerCapture(cancelled.id);
    pointerPosition = null; autoSpinAt = now + 2500; setHover(null); invalidate();
  }
  canvas.addEventListener('pointercancel', cancelPointer, options);
  canvas.addEventListener('lostpointercapture', cancelPointer, options);
  canvas.addEventListener('pointerleave', () => { pointerPosition = null; if (!pointer) setHover(null); invalidate(); }, options);
  canvas.addEventListener('keydown', event => {
    const moves = { ArrowLeft: [-0.12, 0], ArrowRight: [0.12, 0], ArrowUp: [0, 0.08], ArrowDown: [0, -0.08] };
    if (moves[event.key]) {
      event.preventDefault(); const [yaw, pitch] = moves[event.key];
      camera.yaw += yaw; camera.pitch = clamp(camera.pitch + pitch, -1.2, 1.2); autoSpinAt = now + 2500; invalidate();
    } else if (event.key === 'Escape') { if (pointer) cancelPointer(); else onSelect(tree.root); invalidate(); }
  }, options);
  const resizer = new ResizeObserver(fit); resizer.observe(host);
  const observer = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? false;
    if (visible) invalidate(); else { cancelPointer(); pause(); }
  });
  observer.observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelPointer(); pause(); } else invalidate();
  }, options);
  window.addEventListener('blur', () => cancelPointer(), options);
  window.addEventListener('pagehide', () => { cancelPointer(); pause(); }, options);
  window.addEventListener('pageshow', () => invalidate(), options);
  motion.addEventListener('change', () => { pause(); invalidate(); }, options);
  fit();
  return {
    now: () => now,
    invalidate,
    destroy() { cancelPointer(); disposed = true; pause(); events.abort(); resizer.disconnect(); observer.disconnect(); },
  };
}
