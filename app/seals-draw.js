// The drawing grammar the three seals lenses share, in the idiom of the road page's studies:
// thin bronze lines, gold packets with a soft glow, parchment bodies from orb.js, one accent per meaning.
import {INK, hexA, skinForRung, drawSkin} from './orb.js';

export const TAU = Math.PI * 2;
export const GOLD = '#F0CF74', BRONZE = '#C9A14A', DARK = '#FBF6EA', INK2 = '#B8B2A8', WORK = '#407EEC', PAPER = INK.paperB; // the holy page's ground is dark (holy.css): ivory words, the film's gold, the pool's blue for work
export const mix = (a, b, t) => a + (b - a) * t;
export const clamp = t => Math.max(0, Math.min(1, t));
export const ease = t => { t = clamp(t); return t * t * (3 - 2 * t); };
export const point = (x, y, r = 0) => ({x, y, r});
export function curve(a, b, bend = 0) {
  const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
  return {a, b, c: point(a.x + dx * .34 - dy / l * bend, a.y + dy * .34 + dx / l * bend), d: point(a.x + dx * .72 - dy / l * bend, a.y + dy * .72 + dx / l * bend)};
}
export function onCurve(e, t) {
  const u = 1 - t;
  return point(u*u*u*e.a.x + 3*u*u*t*e.c.x + 3*u*t*t*e.d.x + t*t*t*e.b.x, u*u*u*e.a.y + 3*u*u*t*e.c.y + 3*u*t*t*e.d.y + t*t*t*e.b.y);
}
export function path(ctx, e) { ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.bezierCurveTo(e.c.x, e.c.y, e.d.x, e.d.y, e.b.x, e.b.y); }
export function arrow(ctx, e, color, at = .53) {
  const p = onCurve(e, at), q = onCurve(e, Math.min(1, at + .01));
  ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(q.y - p.y, q.x - p.x));
  ctx.beginPath(); ctx.moveTo(-5, -2.4); ctx.lineTo(0, 0); ctx.lineTo(-5, 2.4);
  ctx.strokeStyle = color; ctx.lineWidth = .8; ctx.stroke(); ctx.restore();
}
export function glow(ctx, p, r, color, alpha) {
  if (alpha <= 0) return;
  const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
  g.addColorStop(0, hexA(color, alpha)); g.addColorStop(1, hexA(color, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, TAU); ctx.fill();
}
/** A packet on a curve at t in (0,1): a filled dot (money, a trace) or a small card (work, a receipt). */
export function packet(ctx, e, t, color, kind = 'dot', alphaIn = 1, direction = 1) {
  if (t < 0 || t > 1) return null;
  const p = onCurve(e, t), q = onCurve(e, Math.min(1, t + .02));
  ctx.save(); ctx.globalAlpha = alphaIn;
  const tail=onCurve(e,clamp(t-.08*direction));
  ctx.strokeStyle=hexA(color,.65);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(p.x,p.y);ctx.stroke();
  glow(ctx, p, kind === 'dot' ? 16 : 13, color, .22);
  ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(q.y - p.y, q.x - p.x));
  ctx.fillStyle = kind === 'dot' ? color : PAPER; ctx.strokeStyle = color; ctx.lineWidth = 1;
  if (kind === 'card') { ctx.beginPath(); ctx.rect(-5, -4, 10, 8); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(2, 0); ctx.stroke(); }
  else if(kind==='root'){ctx.beginPath();ctx.rect(-5,-5,10,10);ctx.fillStyle=hexA(GOLD,.35);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-2,-2);ctx.lineTo(2,2);ctx.moveTo(2,-2);ctx.lineTo(-2,2);ctx.stroke();}
  else if (kind === 'hollow') { ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, TAU); ctx.fillStyle = PAPER; ctx.fill(); ctx.stroke(); }
  else { ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, TAU); ctx.fill(); }
  ctx.restore();
  return p;
}
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
/** A key: a ring and a shaft with two teeth. `notch` varies the teeth so a rotated key reads as a different key. */
export function keyGlyph(ctx, x, y, size, color, notch = 0, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.fillStyle = PAPER; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  const r = size * .24, left = x - size * .5;
  ctx.beginPath(); ctx.arc(left + r, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(left + r, y, r * .38, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(left + 2 * r, y); ctx.lineTo(x + size * .5, y); ctx.stroke();
  const teeth = [[.66, .84], [.6, .9], [.72, .94]][notch % 3];
  for (const [i, at] of teeth.entries()) { const h = size * (i ? .2 : .28); ctx.beginPath(); ctx.moveTo(left + size * at, y); ctx.lineTo(left + size * at, y + h); ctx.stroke(); }
  ctx.restore();
}
/** A parchment body: a Goldberg skin at rest, slowly turning. `flat` paints every face one color (a model, not a polis). */
export function body(ctx, p, rung, seconds, phase = 0, opts = {}) {
  ctx.save();
  drawSkin(ctx, skinForRung(rung), [p.x, p.y], p.r, {yaw: phase + seconds * .026, pitch: .22 + Math.sin(seconds * .09 + phase) * .07}, () => null, {ink: .55, beadAt: 1, ...opts});
  ctx.restore();
}
export function label(ctx, text, x, y, color = INK2, align = 'center', size = 11) {
  ctx.save(); ctx.font = `${size}px Georgia, "Iowan Old Style", serif`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y); ctx.restore();
}
/** A small uppercase tag in scene units: it scales with the plate and stays beside the thing it names. */
export function tag(ctx, text, x, y, align = 'center', alpha = .95, size = 10) {
  ctx.save(); ctx.font = `${size}px Georgia, "Iowan Old Style", serif`; ctx.fillStyle = hexA(INK2, alpha); ctx.textAlign = align; ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${(size * .16).toFixed(1)}px`;
  ctx.fillText(text.toUpperCase(), x, y); ctx.restore();
}
export function dashed(ctx, on = 3, off = 4) { ctx.setLineDash([on, off]); }
export function solid(ctx) { ctx.setLineDash([]); }

/** Fit a common logical stage without stretching or repainting the bitmap on every tab click. */
export function fitScene(canvas, mobile) {
  const width=mobile?600:1000,height=mobile?710:650,rect=canvas.getBoundingClientRect();
  if(!rect.width||!rect.height)return null;
  const dpr=Math.min(globalThis.devicePixelRatio||1,2),scale=Math.min(rect.width/width,rect.height/height);
  const w=Math.round(rect.width*dpr),h=Math.round(rect.height*dpr);
  if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;
  return {width,height,dpr,scale,x:(rect.width-width*scale)/2,y:(rect.height-height*scale)/2};
}
export function clearScene(ctx,canvas,view) {
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.setTransform(view.dpr*view.scale,0,0,view.dpr*view.scale,view.x*view.dpr,view.y*view.dpr);
}
