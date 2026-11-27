// Resting sculptures at the end of the road. The caller owns time and visibility.
import {skinForRung, drawSkin, INK, hexA} from './orb.js';

const TAU = Math.PI * 2;
const WIDTH = 500;
const HEIGHT = 300;
const faceColor = face => face.chair >= 0 ? INK.vacant : '#FFFDF7';
const turn = (x, y, z, yaw, pitch) => {
  const a = x * Math.cos(yaw) - z * Math.sin(yaw);
  const b = x * Math.sin(yaw) + z * Math.cos(yaw);
  return [a, y * Math.cos(pitch) - b * Math.sin(pitch), y * Math.sin(pitch) + b * Math.cos(pitch)];
};

export function createArrivalScene(canvas, kind) {
  const ctx = canvas.getContext('2d');
  const shared = skinForRung(5);
  const small = skinForRung(1);
  let pixelWidth = 0;
  let pixelHeight = 0;

  function resize() {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(box.width * dpr));
    const height = Math.max(1, Math.round(box.height * dpr));
    if (width !== pixelWidth || height !== pixelHeight) {
      pixelWidth = canvas.width = width;
      pixelHeight = canvas.height = height;
    }
  }

  function atmosphere(x, y, radius) {
    const halo = ctx.createRadialGradient(x, y, radius * .15, x, y, radius);
    halo.addColorStop(0, hexA(INK.gold, .055));
    halo.addColorStop(1, hexA(INK.gold, 0));
    ctx.fillStyle = halo;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function bead(x, y, radius, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const lamp = ctx.createRadialGradient(x - radius * .3, y - radius * .4, radius * .05, x, y, radius);
    lamp.addColorStop(0, '#FFF1C9');
    lamp.addColorStop(.35, '#D8B974');
    lamp.addColorStop(1, INK.bronze);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fillStyle = lamp;
    ctx.fill();
    ctx.strokeStyle = hexA(INK.bronze, .52);
    ctx.lineWidth = .55;
    ctx.stroke();
    ctx.restore();
  }

  function body(skin, x, y, radius, yaw, pitch) {
    ctx.save();
    drawSkin(ctx, skin, [x, y], radius, {yaw, pitch}, faceColor, {ink: .55});
    ctx.restore();
  }

  // An authored growth history, stable across visits. Branches mature at
  // different rates: all twelve root chairs have children, but their chambers
  // differ in floor size, physical size, depth, and number of descendants.
  const growth = [
    {chair: 0, x: 138, y: 68, radius: 27, rung: 3, children: [
      {dx: -58, dy: -15, radius: 14, rung: 1, children: [{dx: -29, dy: -23, radius: 8.5, rung: 0}]},
      {dx: -31, dy: 43, radius: 10, rung: 0}, {dx: 16, dy: -44, radius: 10, rung: 2},
    ]},
    {chair: 1, x: 353, y: 42, radius: 11, rung: 0},
    {chair: 2, x: 163, y: 252, radius: 21, rung: 2, children: [
      {dx: -40, dy: 14, radius: 9, rung: 0}, {dx: 37, dy: 18, radius: 8, rung: 1},
    ]},
    {chair: 3, x: 351, y: 238, radius: 28, rung: 4, children: [
      {dx: 52, dy: 9, radius: 13, rung: 2, children: [
        {dx: 34, dy: 20, radius: 8, rung: 0}, {dx: 27, dy: -24, radius: 8.5, rung: 1},
      ]},
      {dx: 3, dy: 49, radius: 7.5, rung: 0}, {dx: -47, dy: 23, radius: 9, rung: 1},
    ]},
    {chair: 4, x: 209, y: 219, radius: 13, rung: 0, children: [
      {dx: 36, dy: 25, radius: 9, rung: 1},
    ]},
    {chair: 5, x: 203, y: 75, radius: 17, rung: 2, children: [
      {dx: 2, dy: -41, radius: 9, rung: 0}, {dx: 37, dy: -11, radius: 9, rung: 1},
    ]},
    {chair: 6, x: 315, y: 188, radius: 12, rung: 1, children: [
      {dx: -31, dy: 26, radius: 8, rung: 0},
    ]},
    {chair: 7, x: 292, y: 77, radius: 22, rung: 3, children: [
      {dx: 12, dy: -51, radius: 11, rung: 0}, {dx: 45, dy: 7, radius: 9, rung: 1},
    ]},
    {chair: 8, x: 422, y: 130, radius: 30, rung: 5, children: [
      {dx: 46, dy: -25, radius: 10, rung: 0}, {dx: 48, dy: 22, radius: 9, rung: 1},
      {dx: 4, dy: 51, radius: 12, rung: 2, children: [
        {dx: 26, dy: 26, radius: 8, rung: 0}, {dx: 53, dy: 16, radius: 7.5, rung: 0},
      ]},
    ]},
    {chair: 9, x: 333, y: 133, radius: 15, rung: 0},
    {chair: 10, x: 157, y: 163, radius: 20, rung: 1, children: [
      {dx: -30, dy: 41, radius: 8, rung: 0},
    ]},
    {chair: 11, x: 74, y: 181, radius: 13, rung: 2, children: [
      {dx: -45, dy: -3, radius: 10, rung: 1}, {dx: -29, dy: 36, radius: 8, rung: 0},
    ]},
  ];

  function join(t) {
    const root = {x: 250, y: 150, z: 0, radius: 48, skin: shared, yaw: .405 + t * .017, pitch: .005};
    const units = [root], branches = [];
    atmosphere(root.x, root.y, 166);

    function grow(spec, parent, index, depth) {
      const rootChair = depth === 1 ? parent.skin.faces.find(f => f.chair === spec.chair) : null;
      const n = rootChair && turn(...rootChair.normal, parent.yaw, parent.pitch);
      const unit = {
        x: spec.x ?? parent.x + spec.dx, y: spec.y ?? parent.y + spec.dy,
        z: n ? n[2] * 90 : parent.z + Math.sin(index * 2.4 + depth) * 18,
        radius: spec.radius, skin: skinForRung(spec.rung),
        yaw: parent.yaw + .39 + index * .73, pitch: Math.sin(index * 1.7 + depth) * .7,
      };
      // Each connector belongs to a distinct pentagon, even in smaller branches.
      const dx = unit.x - parent.x, dy = parent.y - unit.y, dz = unit.z - parent.z;
      const length = Math.hypot(dx, dy, dz);
      const used = parent.usedChairs || (parent.usedChairs = new Set());
      const candidates = parent.skin.faces.filter(f => f.chair >= 0 && !used.has(f.chair)).map(face => {
        const normal = turn(...face.normal, parent.yaw, parent.pitch);
        return {face, normal, score: (normal[0] * dx + normal[1] * dy + normal[2] * dz) / length};
      });
      const socket = rootChair
        ? {face: rootChair, normal: n}
        : candidates.sort((a, b) => b.score - a.score)[0];
      used.add(socket.face.chair);
      const perspective = 3.2 / (3.2 - socket.normal[2]);
      branches.push({parent, unit, normal: socket.normal,
        x: parent.x + parent.radius * socket.normal[0] * perspective,
        y: parent.y - parent.radius * socket.normal[1] * perspective,
      });
      units.push(unit);
      (spec.children || []).forEach((child, childIndex) => grow(child, unit, childIndex, depth + 1));
    }
    growth.forEach(spec => grow(spec, root, spec.chair, 1));

    function branch(b) {
      const distance = Math.hypot(b.unit.x - b.x, b.unit.y - b.y);
      const stop = Math.max(0, 1 - b.unit.radius * 1.06 / distance);
      const dx = (b.unit.x - b.x) * stop, dy = (b.unit.y - b.y) * stop;
      const reach = Math.min(18, Math.hypot(dx, dy) * .3);
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.bezierCurveTo(b.x + b.normal[0] * reach, b.y - b.normal[1] * reach,
        b.x + dx * .72, b.y + dy * .72, b.x + dx, b.y + dy);
      ctx.strokeStyle = hexA(INK.bronze, b.normal[2] < 0 ? .28 : .48);
      ctx.lineWidth = b.parent === root ? .85 : .65;
      ctx.stroke();
    }
    // Body and branch layers preserve the visible face attachments. A rear
    // socket disappears behind its parent; a front one emerges from its face.
    const layers = units.map(unit => ({z: unit.z, unit}));
    branches.forEach(b => layers.push({z: b.parent.z + (b.normal[2] < 0 ? -.01 : .01), branch: b}));
    layers.sort((a, b) => a.z - b.z);
    for (const layer of layers) {
      if (layer.branch) branch(layer.branch);
      else {
        const u = layer.unit;
        body(u.skin, u.x, u.y, u.radius, u.yaw, u.pitch);
      }
    }
  }

  function found(t) {
    const cx = 250, cy = 150;
    atmosphere(cx, cy, 143);
    const points = [];
    const bands = [
      {yaw: -.45, pitch: .48, radius: 107},
      {yaw: .82, pitch: -.61, radius: 99},
      {yaw: 1.74, pitch: .86, radius: 104},
    ];
    for (let band = 0; band < bands.length; band++) {
      const b = bands[band];
      const at = angle => {
        const v = turn(Math.cos(angle) * b.radius, Math.sin(angle) * b.radius, 0, b.yaw, b.pitch);
        return {x: cx + v[0], y: cy - v[1], z: v[2]};
      };
      // Back and front contours retain their spatial distinction on parchment.
      for (let front = 0; front < 2; front++) {
        ctx.beginPath();
        let open = false;
        for (let i = 0; i <= 144; i++) {
          const p = at(i / 144 * TAU);
          if ((p.z >= 0) === !!front) {
            if (open) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
            open = true;
          } else open = false;
        }
        ctx.strokeStyle = hexA(INK.bronze, front ? .25 : .11);
        ctx.lineWidth = front ? .7 : .6;
        ctx.stroke();
      }
      for (let member = 0; member < 4; member++) {
        const p = at(member / 4 * TAU + band * .43 + .26 + t * .025);
        points.push({...p, radius: 2.75 + (p.z + 110) / 220 * 1.1});
      }
    }
    points.sort((a, b) => a.z - b.z);
    points.filter(p => p.z < 0).forEach(p => bead(p.x, p.y, p.radius, .78));
    body(small, cx, cy, 45, -.38 + t * .016, .29);
    points.filter(p => p.z >= 0).forEach(p => bead(p.x, p.y, p.radius));
  }

  function render(milliseconds = 0, reduced = false, active = false) {
    if (!ctx) return;
    if (!pixelWidth || !pixelHeight) resize();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, pixelWidth, pixelHeight);
    const scale = Math.min(pixelWidth / WIDTH, pixelHeight / HEIGHT);
    ctx.setTransform(scale, 0, 0, scale, (pixelWidth - WIDTH * scale) / 2, (pixelHeight - HEIGHT * scale) / 2);
    ctx.lineCap = 'round';
    const t = reduced || !active ? 0 : milliseconds / 1000;
    if (kind === 'join') join(t); else found(t);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  return {resize, render};
}
