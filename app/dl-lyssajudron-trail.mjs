// dl-lyssajudron-trail.mjs: THE FIRST TRACE, drawn from math while the Lyssajudron says her poem (his Oct 30 2026 ~23:2x UTC, over her station's scene: "focus on
// the geometry dude... i need to have the lyssajudron there be a poet... i need delicious outlining of the first tracenet + finally link to it"; his Oct 12 "i dont
// like generated images... i like math"). Project Snowtrace's own image, his since Sept 19: "a leader is tracing a path in the snow the others can follow" (Oct 22
// 15:03), "crystals of compute are frozen computations" (Oct 12 19:13), "every problem is solved only once" (Oct 17 03:28).
// The geometry, in the screen's own units (x by its width, y by its height), the same for every visitor:
//   the snow: a hexagonal lattice of points, faint;
//   the trail: a Catmull-Rom spline through STATIONS, outlined from its first point to its last as the first walker breaks it;
//   the steps: footprints on either side of the trail, laid as the outline passes them;
//   the crystals: a hexagon outlined edge by edge where a step answered something (CRYSTALS, fractions of the trail's length), then frozen;
//   the pack: the others, walking the trail in its prints.
// Pure parts (spline, lengthOf, pointAt, lattice, footprints, hexagon, crystalsOn, packAt) are tested in dl-lyssajudron.test.mjs; drawTrace paints one frame of a
// phase on a 2D context, called only while her poem plays (nothing at rest).

export const STATIONS = Object.freeze([[.30, .79], [.38, .71], [.44, .74], [.52, .61], [.60, .64], [.67, .51], [.74, .53], [.81, .41], [.88, .38], [.94, .29]]);   // clear of her words under it
export const CRYSTALS = Object.freeze([.16, .36, .55, .74, .93]);   // where a step answered something, along the trail's length
export const PACK = 18;   // the others who walk it
export const GOLD = '#f0cf74', ICE = 'rgba(190,255,228,', SNOW = 'rgba(214,226,255,';

/** spline(points, per): a Catmull-Rom spline through the points (its ends held), `per` samples between each pair. Pure. */
export function spline(points, per = 24) {
  const p = points, out = [];
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((d) => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)));
    }
  }
  out.push([...p.at(-1)]);
  return out;
}
/** lengthOf(path): the cumulative lengths of a polyline, its total last. Pure. */
export function lengthOf(path) {
  const acc = [0];
  for (let i = 1; i < path.length; i++) acc.push(acc[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
  return acc;
}
/** pointAt(path, acc, s): the point and the unit tangent at the fraction s (0..1) of the path's length. Pure. */
export function pointAt(path, acc, s) {
  const want = Math.min(1, Math.max(0, s)) * acc.at(-1);
  let i = 1; while (i < acc.length - 1 && acc[i] < want) i++;
  const a = path[i - 1], b = path[i], seg = acc[i] - acc[i - 1] || 1, k = (want - acc[i - 1]) / seg;
  const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
  return {x: a[0] + dx * k, y: a[1] + dy * k, tx: dx / n, ty: dy / n};
}
/** lattice(w, h, step): the snow, a hexagonal lattice of points over w × h, `step` apart. Pure. */
export function lattice(w, h, step) {
  const out = [], rh = step * Math.sqrt(3) / 2;
  for (let r = 0, y = step / 2; y < h; r++, y += rh) for (let x = (r % 2 ? step / 2 : 0) + step / 2; x < w; x += step) out.push([x, y]);
  return out;
}
/** footprints(path, acc, gap, side): the steps along the path, `gap` apart (in the path's units), alternating `side` either side of it: [{s, x, y, a}]. Pure. */
export function footprints(path, acc, gap, side) {
  const out = [], total = acc.at(-1);
  for (let d = gap / 2, i = 0; d < total; d += gap, i++) {
    const s = d / total, p = pointAt(path, acc, s), o = (i % 2 ? 1 : -1) * side;
    out.push({s, x: p.x - p.ty * o, y: p.y + p.tx * o, a: Math.atan2(p.ty, p.tx)});
  }
  return out;
}
/** hexagon(cx, cy, r): a crystal's six corners, flat side down. Pure. */
export const hexagon = (cx, cy, r) => Array.from({length: 6}, (_, i) => [cx + r * Math.cos(Math.PI / 6 + i * Math.PI / 3), cy + r * Math.sin(Math.PI / 6 + i * Math.PI / 3)]);
/** crystalsOn(path, acc, lift): each crystal's centre, lifted off the trail on its outer side by `lift`. Pure. */
export const crystalsOn = (path, acc, lift) => CRYSTALS.map((s) => { const p = pointAt(path, acc, s); return {s, x: p.x + p.ty * lift, y: p.y - p.tx * lift}; });
/** packAt(t, n): where each of the n others stands along the trail (0..1) t seconds after they set out, each a little behind the last, none past its end. Pure. */
export const packAt = (t, n = PACK) => Array.from({length: n}, (_, i) => Math.min(1, Math.max(0, (t - i * 0.32) / 6.5)));

const ease = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - (1 - k) ** 3);
/** drawTrace(ctx, w, h, phase, since, now): one frame of THE FIRST TRACE in css pixels. phase: 'snow' (the lattice comes), 'path' (the trail outlined, its prints laid),
 *  'crystals' (a hexagon outlined edge by edge at each answer), 'freeze' (they freeze: ice within, a ring of light), 'pack' (the others walk it), 'glow' (all of it lit).
 *  `since` is when the phase began (s); each phase holds what the ones before it drew. */
export function drawTrace(ctx, w, h, phase, since, now) {
  const ORDER = ['snow', 'path', 'crystals', 'freeze', 'pack', 'glow'], at = ORDER.indexOf(phase), t = Math.max(0, now - since);
  const k = (name, dur) => (ORDER.indexOf(name) < at ? 1 : name === phase ? ease(t / dur) : 0);
  const path = spline(STATIONS.map(([x, y]) => [x * w, y * h])), acc = lengthOf(path), m = Math.min(w, h);
  ctx.clearRect(0, 0, w, h);
  // the snow
  const snow = k('snow', 1.2);
  if (snow > 0) { ctx.fillStyle = `${SNOW}${(0.16 * snow).toFixed(3)})`; for (const [x, y] of lattice(w, h, Math.max(22, m / 26))) { ctx.beginPath(); ctx.arc(x, y, 1.1, 0, Math.PI * 2); ctx.fill(); } }
  // the trail and its prints, as far as the outline has come
  const drawn = k('path', 3.4), lit = phase === 'glow' ? ease(t / 1.2) : 0;
  if (drawn > 0) {
    const upto = drawn * acc.at(-1);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = GOLD; ctx.lineWidth = Math.max(2, m / 380) * (1 + lit * 0.6);
    ctx.shadowColor = GOLD; ctx.shadowBlur = 10 + lit * 18; ctx.beginPath(); ctx.moveTo(path[0][0], path[0][1]);
    for (let i = 1; i < path.length && acc[i] <= upto; i++) ctx.lineTo(path[i][0], path[i][1]);
    const tip = pointAt(path, acc, drawn); ctx.lineTo(tip.x, tip.y); ctx.stroke();
    if (drawn < 1) { ctx.fillStyle = '#fff'; ctx.shadowBlur = 22; ctx.beginPath(); ctx.arc(tip.x, tip.y, Math.max(3, m / 220), 0, Math.PI * 2); ctx.fill(); }   // the one who goes first
    ctx.restore();
    ctx.fillStyle = `${SNOW}0.55)`;
    for (const f of footprints(path, acc, m / 34, m / 120)) {
      if (f.s > drawn) break;
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.a); ctx.beginPath(); ctx.ellipse(0, 0, m / 150, m / 300, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }
  // the crystals: outlined edge by edge, then frozen
  const grow = k('crystals', 3), frozen = k('freeze', 1.6);
  if (grow > 0) {
    const r = Math.max(10, m / 34);
    crystalsOn(path, acc, r * 1.9).forEach((c, i, all) => {
      const mine = Math.min(1, Math.max(0, grow * all.length - i)), hex = hexagon(c.x, c.y, r), edges = mine * 6;
      if (mine <= 0) return;
      ctx.save(); ctx.strokeStyle = `${ICE}${(0.75 + 0.25 * lit).toFixed(2)})`; ctx.lineWidth = Math.max(1.5, m / 520); ctx.shadowColor = '#bfffe4'; ctx.shadowBlur = 8 + 14 * frozen;
      if (frozen > 0) { ctx.fillStyle = `${ICE}${(0.22 * frozen).toFixed(3)})`; ctx.beginPath(); hex.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(hex[0][0], hex[0][1]);
      for (let e = 0; e < 6 && e < edges; e++) { const a = hex[e], b = hex[(e + 1) % 6], q = Math.min(1, edges - e); ctx.lineTo(a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q); }
      ctx.stroke();
      if (frozen > 0) { ctx.strokeStyle = `${ICE}${(0.5 * frozen * (1 - ease((t % 2.4) / 2.4))).toFixed(3)})`; ctx.beginPath(); ctx.arc(c.x, c.y, r * (1.2 + 0.8 * ease((t % 2.4) / 2.4)), 0, Math.PI * 2); ctx.stroke(); }
      const foot = pointAt(path, acc, c.s); ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(foot.x, foot.y); ctx.lineTo(c.x, c.y); ctx.stroke(); ctx.setLineDash([]);   // its step
      ctx.restore();
    });
  }
  // the pack: the others, walking in its prints
  if (at >= ORDER.indexOf('pack')) {
    const walked = phase === 'pack' ? t : 9 + t;
    ctx.save(); ctx.fillStyle = '#fbf6ea'; ctx.shadowColor = '#fbf6ea'; ctx.shadowBlur = 6;
    for (const s of packAt(walked)) { if (s <= 0) continue; const p = pointAt(path, acc, s); ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(2, m / 300), 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
}
