// The two doors at the end of HOW: SOLO and TEAM. Resting sculptures in the
// grammar of the WHY doors, painted on resize only. The caller owns visibility.
import {skinForRung, drawSkin, INK, hexA} from './orb.js';

const TAU = Math.PI * 2;
const WIDTH = 500;
const HEIGHT = 300;
const turn = (x, y, z, yaw, pitch) => {
  const a = x * Math.cos(yaw) - z * Math.sin(yaw);
  const b = x * Math.sin(yaw) + z * Math.cos(yaw);
  return [a, y * Math.cos(pitch) - b * Math.sin(pitch), y * Math.sin(pitch) + b * Math.cos(pitch)];
};

export function createHowArrivalScene(canvas, kind) {
  const ctx = canvas.getContext('2d');
  const human = skinForRung(1); // a small polis: the human's own unit
  const agent = skinForRung(0); // the dodecahedron: one agent
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

  // A human is a unit with exactly one chair taken: the pentagon facing the
  // viewer is painted bronze. Agents are plain dodecahedra.
  function body(skin, x, y, radius, yaw, pitch, taken = 0) {
    const front = skin.faces.filter(f => f.chair >= 0)
      .map(f => ({chair: f.chair, z: turn(...f.normal, yaw, pitch)[2]}))
      .sort((a, b) => b.z - a.z).slice(0, taken).map(f => f.chair);
    const paint = face => face.chair >= 0 ? (front.includes(face.chair) ? INK.bronze : INK.vacant) : '#FFFDF7';
    ctx.save();
    drawSkin(ctx, skin, [x, y], radius, {yaw, pitch}, paint, {ink: .55});
    ctx.restore();
  }

  // A tether from one body to another, stopping at both surfaces, with a trace
  // bead on its way home when asked.
  function tether(a, b, front, beadAt = -1, width = .7) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const length = Math.hypot(dx, dy);
    if (!length) return;
    const ux = dx / length, uy = dy / length;
    const x0 = a.x + ux * (a.radius + 2), y0 = a.y + uy * (a.radius + 2);
    const x1 = b.x - ux * (b.radius + 2), y1 = b.y - uy * (b.radius + 2);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = hexA(INK.bronze, front ? .48 : .26);
    ctx.lineWidth = width;
    ctx.stroke();
    if (beadAt >= 0) bead(x0 + (x1 - x0) * beadAt, y0 + (y1 - y0) * beadAt, 2.5, front ? 1 : .7);
  }

  function orbit(cx, cy, band, angle) {
    const v = turn(Math.cos(angle) * band.radius, Math.sin(angle) * band.radius, 0, band.yaw, band.pitch);
    return {x: cx + v[0], y: cy - v[1], z: v[2]};
  }

  function ring(cx, cy, band, front) {
    ctx.beginPath();
    let open = false;
    for (let i = 0; i <= 144; i++) {
      const p = orbit(cx, cy, band, i / 144 * TAU);
      if ((p.z >= 0) === !!front) {
        if (open) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
        open = true;
      } else open = false;
    }
    ctx.strokeStyle = hexA(INK.bronze, front ? .22 : .1);
    ctx.lineWidth = front ? .7 : .6;
    ctx.stroke();
  }

  // SOLO: one human, its agents in orbit, every trace coming home to one memory.
  function solo(t) {
    const core = {x: 250, y: 150, radius: 50};
    atmosphere(core.x, core.y, 150);
    const bands = [
      {yaw: -.35, pitch: .55, radius: 118, count: 4, phase: .3},
      {yaw: 1.25, pitch: -.5, radius: 100, count: 2, phase: 1.1},
    ];
    const agents = [];
    bands.forEach((band, b) => {
      for (let i = 0; i < band.count; i++) {
        const p = orbit(core.x, core.y, band, i / band.count * TAU + band.phase + t * .02);
        agents.push({...p, radius: 8.5 + (p.z + band.radius) / (band.radius * 2) * 2.5,
          yaw: .4 + i * .9 + b, pitch: .2 + i * .5, beadAt: .3 + ((i * 7 + b * 3) % 5) / 10});
      }
    });
    agents.sort((a, b) => a.z - b.z);
    const back = agents.filter(a => a.z < 0), front = agents.filter(a => a.z >= 0);
    bands.forEach(band => ring(core.x, core.y, band, false));
    for (const a of back) { tether(core, a, false, a.beadAt); body(agent, a.x, a.y, a.radius, a.yaw, a.pitch); }
    body(human, core.x, core.y, core.radius, -.38 + t * .016, .29, 1);
    bands.forEach(band => ring(core.x, core.y, band, true));
    for (const a of front) { tether(core, a, true, a.beadAt); body(agent, a.x, a.y, a.radius, a.yaw, a.pitch); }
  }

  // TEAM: several humans, each with its own agents and its own memory, and a
  // shared field between them where only the approved traces meet.
  function team(t) {
    const field = {x: 250, y: 152, radius: 50};
    atmosphere(field.x, field.y, 160);
    const humans = [
      {x: 118, y: 90, radius: 31, yaw: .2, pitch: .3},
      {x: 382, y: 90, radius: 31, yaw: 1.1, pitch: .25},
      {x: 250, y: 246, radius: 31, yaw: 2.3, pitch: .35},
    ];
    // the shared field: a dashed circle with the traces the team approved
    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(field.x, field.y, field.radius, 0, TAU);
    ctx.strokeStyle = hexA(INK.bronze, .5);
    ctx.lineWidth = .8;
    ctx.stroke();
    ctx.restore();
    const shared = [[-17, -10], [14, -19], [21, 12], [-7, 18], [2, -1], [-22, 9]];
    shared.forEach(([dx, dy], i) => bead(field.x + dx, field.y + dy, 2.6 + (i % 2) * .5));
    humans.forEach((h, k) => {
      // the human's own agents, kept on the far side from the field
      const away = Math.atan2(h.y - field.y, h.x - field.x);
      const band = {yaw: away, pitch: .5, radius: 52};
      const mine = [-.55, .55].map((spread, i) => {
        const p = orbit(h.x, h.y, band, away + spread + t * .02);
        return {...p, radius: 8.5, yaw: .5 + i + k, pitch: .3 + i * .4, beadAt: .45 + i * .2};
      }).sort((a, b) => a.z - b.z);
      for (const a of mine.filter(a => a.z < 0)) { tether(h, a, false, a.beadAt, .6); body(agent, a.x, a.y, a.radius, a.yaw, a.pitch); }
      body(human, h.x, h.y, h.radius, h.yaw + t * .012, h.pitch, 1);
      for (const a of mine.filter(a => a.z >= 0)) { tether(h, a, true, a.beadAt, .6); body(agent, a.x, a.y, a.radius, a.yaw, a.pitch); }
      // the crossing into the field, receipted
      const dx = field.x - h.x, dy = field.y - h.y, length = Math.hypot(dx, dy);
      const ux = dx / length, uy = dy / length;
      const x0 = h.x + ux * (h.radius + 2), y0 = h.y + uy * (h.radius + 2);
      const x1 = field.x - ux * (field.radius + 1), y1 = field.y - uy * (field.radius + 1);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = hexA(INK.bronze, .48);
      ctx.lineWidth = .8;
      ctx.stroke();
      ctx.save();
      ctx.translate(x1, y1);
      ctx.rotate(Math.atan2(uy, ux));
      ctx.fillStyle = '#FBF8F1';
      ctx.strokeStyle = hexA(INK.bronze, .8);
      ctx.lineWidth = .8;
      ctx.beginPath();
      ctx.rect(-4, -3, 8, 6);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
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
    if (kind === 'team') team(t); else solo(t);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  return {resize, render};
}
