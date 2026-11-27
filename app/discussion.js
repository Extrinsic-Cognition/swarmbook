import { POEMS } from './poems.js?v=speaker-burst-1';
import { poemGlyph, poetryDisplay } from './poetry.js?v=speaker-burst-1';
import { buildPoetrySchedule, poetryAt } from './poetry-clock.js?v=speaker-burst-1';
// Live envelopes never inspect content. The poetry study follows an absolute
// clock: loading, hiding, or repainting a tile cannot restart its recitation.
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = k => k * k * (3 - 2 * k);
const INK = '#3F5147', GOLD = '#9B793D', PAPER = '#F8F3E7';
// A bounded shell of sparks, shared by every speaker. Positions are projected
// through the same camera as the bodies; nothing is added to the voting state.
const SPEAKER_SPARKS = Array.from({ length: 18 }, (_, i) => {
  const y = 1 - 2 * (i + .5) / 18, r = Math.sqrt(1 - y * y), a = i * 2.399963;
  return [Math.cos(a) * r, y, Math.sin(a) * r];
});
const hash = value => { let h = 2166136261; for (const c of value) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
export function glyphCodes(id) {
  let h = hash(String(id));
  return Array.from({ length: 24 }, () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) % ALPHABET.length; });
}
function speaker(input, instance) {
  if (!input || typeof input.node !== 'string' || !instance.st[input.node]
    || !Number.isInteger(input.seat) || input.seat < 0 || input.seat > 11) return null;
  const chair = instance.chairs[input.node]?.[input.seat];
  if (!chair || chair.kind === 'vacant') return null;
  return { node: input.node, seat: input.seat };
}
export function publicEnvelope(input, instance) {
  if (!input || input.publicMetadata !== true || typeof input.id !== 'string' || !input.id.length || input.id.length > 160) return null;
  const from = speaker(input, instance); if (!from) return null;
  const out = { id: input.id, ...from };
  if (input.to !== undefined) { const to = speaker(input.to, instance); if (!to) return null; out.to = to; }
  return out;
}
// Original Gold/Silver Unown font, A–Z in the source's row-major tile order.
// Source: pret/pokegold@656583c939d30f920a316177311a502dd222b57c,
// gfx/font/unown_font.png (24×72, 8×8 tiles; the final diamond is not a letter).
// PNG SHA-256: c7f498d4b086776c00d80252bfcf558fde42f5200fb2e6b69dd146ff6a829163
// These masks preserve the original pixels; only their ink color is themed.
export const ALPHABET = [
  { name: 'A', rows: [0x00, 0x10, 0x38, 0x44, 0x44, 0x38, 0x28, 0x6c] },
  { name: 'B', rows: [0x00, 0x38, 0x44, 0x54, 0x44, 0x38, 0x44, 0x38] },
  { name: 'C', rows: [0x00, 0x38, 0x54, 0xba, 0xae, 0xb8, 0x44, 0x38] },
  { name: 'D', rows: [0x00, 0x1c, 0x32, 0x4a, 0x4a, 0x32, 0x02, 0x1c] },
  { name: 'E', rows: [0x00, 0x0e, 0x38, 0x44, 0x56, 0x44, 0x38, 0x0e] },
  { name: 'F', rows: [0x00, 0x70, 0x8e, 0xaa, 0x8c, 0x70, 0x20, 0xd8] },
  { name: 'G', rows: [0x00, 0x28, 0x38, 0x44, 0x44, 0x38, 0x60, 0x1c] },
  { name: 'H', rows: [0x00, 0x44, 0xba, 0xc6, 0xd6, 0xc6, 0xba, 0x44] },
  { name: 'I', rows: [0x00, 0x10, 0x38, 0x44, 0x54, 0x44, 0x38, 0x10] },
  { name: 'J', rows: [0x00, 0x38, 0x44, 0x54, 0x44, 0x38, 0x10, 0x60] },
  { name: 'K', rows: [0x00, 0x20, 0x76, 0x88, 0xa8, 0x88, 0x76, 0x20] },
  { name: 'L', rows: [0x00, 0x38, 0x44, 0x54, 0x44, 0x38, 0x10, 0x1c] },
  { name: 'M', rows: [0x00, 0x44, 0x38, 0x54, 0xaa, 0xaa, 0x92, 0x44] },
  { name: 'N', rows: [0x00, 0x00, 0xd2, 0xba, 0xaa, 0xba, 0x96, 0x00] },
  { name: 'O', rows: [0x00, 0x38, 0x44, 0xba, 0xaa, 0xba, 0x44, 0x38] },
  { name: 'P', rows: [0x00, 0x38, 0x44, 0x54, 0x44, 0x78, 0x40, 0x40] },
  { name: 'Q', rows: [0x00, 0x70, 0x88, 0xa8, 0x88, 0x72, 0x12, 0x0c] },
  { name: 'R', rows: [0x00, 0x38, 0x44, 0x54, 0x44, 0x78, 0x4c, 0x40] },
  { name: 'S', rows: [0x00, 0x78, 0x80, 0xb8, 0x44, 0x3a, 0x02, 0x3c] },
  { name: 'T', rows: [0x00, 0x7c, 0x10, 0x38, 0x44, 0x54, 0x44, 0x38] },
  { name: 'U', rows: [0x00, 0x38, 0x44, 0x44, 0x38, 0x54, 0x92, 0x7c] },
  { name: 'V', rows: [0x00, 0x44, 0x7c, 0x24, 0x38, 0x44, 0x44, 0x38] },
  { name: 'W', rows: [0x00, 0x10, 0x54, 0x38, 0x44, 0x54, 0x44, 0x38] },
  { name: 'X', rows: [0x00, 0xc6, 0x38, 0x44, 0x54, 0x44, 0x38, 0xc6] },
  { name: 'Y', rows: [0x00, 0x44, 0x38, 0x44, 0x44, 0x38, 0x10, 0x38] },
  { name: 'Z', rows: [0x20, 0x10, 0x38, 0x44, 0x44, 0x38, 0x10, 0x08] }
];
function traceGlyph(path, glyph) {
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8;) {
    if (!(glyph.rows[y] & (0x80 >> x))) { x++; continue; }
    const from = x;
    while (x < 8 && glyph.rows[y] & (0x80 >> x)) x++;
    path.rect(from, y, x - from, 1);
  }
}
// Build 26 reusable paths once. No sprite loading, pixel decoding, or shape
// construction on animation frames; the fallback supports simple canvases.
const GLYPH_PATHS = typeof Path2D === 'function' ? ALPHABET.map(glyph => {
  const path = new Path2D(); traceGlyph(path, glyph); return path;
}) : null;
export function drawGlyph(ctx, code, x, y, size, color = INK) {
  const index = ((code % ALPHABET.length) + ALPHABET.length) % ALPHABET.length;
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 8, size / 8); ctx.fillStyle = color;
  if (GLYPH_PATHS) ctx.fill(GLYPH_PATHS[index]);
  else { ctx.beginPath(); traceGlyph(ctx, ALPHABET[index]); ctx.fill(); }
  ctx.restore();
}
export class DiscussionLayer {
  constructor(canvas, engine, instance, options = {}) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.engine = engine; this.instance = instance;
    this.active = false; this.preview = false; this.reduced = false; this.destroyed = false;
    this.messages = []; this.seen = new Set(); this.serial = 0; this.nextAt = 0;
    this.seed = hash(instance.name + ':' + instance.seed + ':' + instance.yaw0);
    this.now = options.now || (() => Date.now());
    this.schedule = options.schedule || buildPoetrySchedule(POEMS, { channel: `${instance.name}:${instance.seed}` });
    canvas.setAttribute('aria-hidden', 'true');
  }
  set({ active, preview = false, reduced = false }) {
    const changed = this.active !== active || this.preview !== preview;
    this.active = !!active; this.preview = !!preview; this.reduced = !!reduced;
    if (changed) { this.messages = []; this.nextAt = 0; this.clear(); }
  }
  receive(envelopes) {
    if (!this.active || this.preview || this.destroyed || !Array.isArray(envelopes)) return 0;
    let count = 0;
    for (const input of envelopes.slice(0, 128)) {
      const event = publicEnvelope(input, this.instance);
      if (!event || this.seen.has(event.id) || this.seen.size >= 2048 || this.messages.length >= 8) continue;
      if (this.reduced) this.messages = [];
      this.seen.add(event.id); this.messages.push({ ...event, born: this.instance.animT, codes: glyphCodes(event.id) }); count++;
    }
    return count;
  }
  previewEvent(at = this.now()) {
    const current = poetryAt(at, this.schedule);
    if (!current) { this.messages = []; this.nextAt = 0; return; }
    if (this.messages[0]?.id === current.slotKey) return this.messages[0];
    const voices = [];
    for (const node of this.instance.nodes) for (let seat = 0; seat < 12; seat++) {
      const v = speaker({ node: node.name, seat }, this.instance); if (v) voices.push(v);
    }
    if (!voices.length) return;
    const route = hash(`${this.seed}:${current.slotKey}`), i = route % voices.length;
    const from = voices[i], to = voices[(i + 1 + (route >>> 8) % Math.max(1, voices.length - 1)) % voices.length];
    const codes = Array.from(current.lines.join('')).map(poemGlyph).filter(code => code !== null);
    const message = { ...current, id: current.slotKey, ...from, ...(voices.length > 1 ? { to } : {}), born: current.startedAt, codes };
    this.messages = [message]; this.nextAt = current.endsAt; this.serial++;
    return message;
  }
  loop(who, layout) {
    const loops = this.engine.discussionLoopsAt(this.instance, who.node, layout);
    return loops.find(loop => loop.seat === who.seat);
  }
  point(who, layout) { return this.loop(who, layout)?.off; }
  drawSpeaker(ctx, t, loop, center, elapsed, alpha) {
    const unit = clamp(t.size / 440, .86, 1.25), project = p => this.engine.projectPoint(t, p);
    const perspective = t.F / (center[2] + t.CAM);
    let radius = Math.max(1, loop.scale * perspective);
    const faces = [];
    if (loop.geo) {
      const spin = loop.spin || 0, cy = Math.cos(spin), sy = Math.sin(spin), cp = Math.cos(spin * .6), sp = Math.sin(spin * .6);
      for (const face of [...loop.geo.pents, ...loop.geo.hexes]) {
        const points = face.verts.map(v => {
          const x = v[0] * cy + v[2] * sy, z = -v[0] * sy + v[2] * cy;
          const q = project([x, v[1] * cp - z * sp, v[1] * sp + z * cp].map((n, i) => loop.off[i] + n * loop.scale));
          radius = Math.max(radius, Math.hypot(q[0] - center[0], q[1] - center[1]));
          return q;
        });
        faces.push(points);
      }
    }
    const circle = r => { ctx.beginPath(); ctx.arc(center[0], center[1], r, 0, Math.PI * 2); };
    ctx.save(); ctx.globalAlpha = alpha;
    // The quiet halo and leader retain ownership after the single burst ends.
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.2 * unit;
    circle(radius + 4 * unit); ctx.stroke();
    if (this.reduced || elapsed >= 1000) { ctx.restore(); return; }
    const k = clamp(elapsed / 1000), spread = 1 - (1 - k) ** 3, fade = (1 - k) ** 1.5;
    const flash = 1 - ease(clamp(elapsed / 380));
    if (flash > 0) {
      const glowRadius = radius + (9 + spread * 9) * unit;
      const glow = ctx.createRadialGradient(center[0], center[1], radius * .4, center[0], center[1], glowRadius);
      glow.addColorStop(0, '#FFFFFF'); glow.addColorStop(.4, '#FFFCECDD'); glow.addColorStop(1, '#E2BD6800');
      ctx.globalAlpha = alpha * flash; ctx.fillStyle = glow; circle(glowRadius); ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      if (faces.length) for (const points of faces) {
        ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
        ctx.closePath(); ctx.fill();
      } else { circle(radius); ctx.fill(); }
    }
    ctx.globalAlpha = alpha * fade;
    const shell = radius + (5 + spread * 32) * unit;
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.6 * unit; circle(shell); ctx.stroke();
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 1.2 * unit; circle(shell - 2 * unit); ctx.stroke();
    const reach = (radius + (8 + spread * 37) * unit) / perspective;
    for (const direction of SPEAKER_SPARKS) {
      const end = project(loop.off.map((v, i) => v + direction[i] * reach));
      const start = project(loop.off.map((v, i) => v + direction[i] * reach * (.72 + .2 * k)));
      ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5 * unit; ctx.beginPath();
      ctx.moveTo(start[0], start[1]); ctx.lineTo(end[0], end[1]); ctx.stroke();
      ctx.fillStyle = '#FFFDF3'; ctx.beginPath(); ctx.arc(end[0], end[1], (1.8 - k) * unit, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  clear() { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
  paint(t, layout) {
    if (this.destroyed || !this.active) return;
    const dpr = Math.max(1, t.dprNow || 1), size = t.size;
    if (this.canvas.width !== size * dpr || this.canvas.height !== size * dpr) {
      this.canvas.width = size * dpr; this.canvas.height = size * dpr;
    }
    const ctx = this.ctx; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size, size);
    const at = this.preview ? this.now() : t.animT;
    if (this.preview) {
      const previous = this.messages[0];
      if (!previous || at < previous.startedAt || at >= previous.endsAt) this.previewEvent(at);
    } else this.messages = this.messages.filter(m => at - m.born < 5200);
    // One readable panel at tile scale; no cloud of overlapping dialog boxes.
    const message = this.messages[0]; if (!message) return;
    const age = this.reduced ? 1500 : at - message.born;
    const alpha = this.reduced || message.poem ? 1 : ease(clamp(age / 330)) * ease(clamp((5200 - age) / 700));
    const sender = this.loop(message, layout); if (!sender) return;
    const from = sender.off;
    // Appearance is cosmetic and local. Never restart or delay a scheduled
    // passage when a visitor joins midway through it or a tile becomes visible.
    message.appearedAt ??= t.animT;
    // A motion preference change cannot replay an already visible message.
    if (this.reduced) message.burstSuppressed = true;
    const arrival = message.burstSuppressed ? 1000 : Math.max(0, t.animT - message.appearedAt);
    const project = p => this.engine.projectPoint(t, p);
    const a = project(from), to = message.to && this.point(message.to, layout);
    ctx.save(); ctx.globalAlpha = alpha;
    this.drawSpeaker(ctx, t, sender, a, arrival, alpha);
    if (to) {
      const scale = layout[t.name].scale;
      const control = from.map((v, i) => (v + to[i]) / 2 + (i === 1 ? scale * .65 : i === 2 ? scale * .45 : 0));
      const p = k => project(from.map((v, i) => (1 - k) ** 2 * v + 2 * (1 - k) * k * control[i] + k * k * to[i]));
      ctx.strokeStyle = '#A8916260'; ctx.lineWidth = .7; ctx.setLineDash([2, 5]); ctx.beginPath();
      for (let i = 0; i <= 32; i++) { const q = p(i / 32); i ? ctx.lineTo(...q.slice(0, 2)) : ctx.moveTo(...q.slice(0, 2)); } ctx.stroke(); ctx.setLineDash([]);
      const k = this.reduced ? .55 : clamp((age - 350) / 2800), q = p(ease(k));
      if (message.codes.length) drawGlyph(ctx, message.codes[0], q[0] - 7, q[1] - 7, 14, GOLD);
      if (k >= 1) { const b = project(to); ctx.beginPath(); ctx.arc(b[0], b[1], 5 + (1 - clamp((age - 3150) / 1500)) * 10, 0, Math.PI * 2); ctx.stroke(); }
    }
    const unit = clamp(size / 440, .86, 1.25), width = 244 * unit, height = (message.poem ? 112 : 110) * unit;
    // Open away from the speaker so the paper cannot hide its arrival burst.
    message.corner ??= { left: a[0] >= size / 2, top: a[1] >= size * .52 };
    const x = message.corner.left ? 12 : size - width - 12;
    const y = message.corner.top ? 58 : size - height - 48;
    const attachX = clamp(a[0], x + 12, x + width - 12), attachY = a[1] < y ? y : a[1] > y + height ? y + height : y + height / 2;
    const arriving = this.reduced ? 0 : 1 - clamp(arrival / 1000);
    ctx.strokeStyle = arriving ? GOLD : '#9B793D85'; ctx.lineWidth = .75 + arriving * 1.2;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(attachX, attachY); ctx.stroke();
    ctx.shadowColor = '#58442622'; ctx.shadowBlur = 12 * unit; ctx.shadowOffsetY = 4;
    ctx.fillStyle = PAPER; ctx.fillRect(x, y, width, height); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.strokeStyle = '#A08B66'; ctx.lineWidth = .8; ctx.strokeRect(x, y, width, height);
    ctx.strokeStyle = '#C9BA9C'; ctx.strokeRect(x + 3, y + 3, width - 6, height - 6);
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1;
    for (const [cx, cy, sx, sy] of [[x,y,1,1],[x+width,y,-1,1],[x,y+height,1,-1],[x+width,y+height,-1,-1]]) {
      ctx.beginPath();ctx.moveTo(cx+sx*2,cy+sy*11);ctx.lineTo(cx+sx*2,cy+sy*2);ctx.lineTo(cx+sx*11,cy+sy*2);ctx.stroke();
    }
    ctx.textAlign = 'left';
    if (!message.poem) {
      ctx.fillStyle = '#847456'; ctx.font = `600 ${8.5 * unit}px Georgia`;
      ctx.fillText('SUB SIGILLO', x + 11 * unit, y + 14 * unit, width - 24 * unit);
      ctx.beginPath(); ctx.arc(x + width - 14 * unit, y + 10 * unit, 2.5 * unit, Math.PI, 0); ctx.stroke();
      ctx.strokeRect(x + width - 18 * unit, y + 10 * unit, 8 * unit, 6 * unit);
      ctx.strokeStyle = '#D4C7AE'; ctx.beginPath(); ctx.moveTo(x + 10, y + 21 * unit); ctx.lineTo(x + width - 10, y + 21 * unit); ctx.stroke();
    }
    if (message.poem) {
      // Floating verse stays anonymous: no title, collection label, or counter.
      // The whole passage is present throughout its reading window. A slow
      // typewriter would consume time budgeted for actually reading the verse.
      for (const [row, line] of message.lines.entries()) {
        const visible = Array.from(line);
        if (poetryDisplay.words) {
          ctx.fillStyle = INK; ctx.font = `${12 * unit}px Georgia`;
          ctx.fillText(visible.join(''), x + 11 * unit, y + (29 + row * 24) * unit, width - 22 * unit);
        } else for (const [column, char] of visible.entries()) {
          const gx = x + (11 + column * 8.5) * unit, gy = y + (16 + row * 24) * unit, code = poemGlyph(char);
          if (code !== null) drawGlyph(ctx, code, gx, gy, 8 * unit, INK);
          else if (char.trim()) { ctx.fillStyle = INK; ctx.font = `${10 * unit}px Georgia`; ctx.fillText(char, gx, gy + 9 * unit); }
        }
      }
    } else {
      const count = this.reduced ? 24 : Math.min(24, Math.floor(Math.max(0, age - 220) / 38));
      for (let i = 0; i < count; i++) drawGlyph(ctx, message.codes[i], x + (11 + i % 12 * 18.5) * unit, y + (29 + Math.floor(i / 12) * 29) * unit, 19 * unit, INK);
    }
    if (!message.poem) {
      ctx.fillStyle = '#8C806A'; ctx.font = `${7.5 * unit}px Georgia`;
      ctx.fillText('PUBLIC VIEW / CONTENT SEALED', x + 11 * unit, y + height - 9 * unit);
    }
    ctx.restore();
  }
  destroy() { this.destroyed = true; this.active = false; this.messages = []; this.seen.clear(); this.clear(); }
}
