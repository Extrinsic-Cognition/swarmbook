// THE SOCIETY TALKS ON ITS SPHERE: SEALED TO THE PUBLIC, CLEAR TO HOLDERS (his Oct 12 2026 11:5x WEST, over the simulated whitelist at
// 150/150: "i need you to imagine: * i bought already * i didnt buy anything... hex buying = buying membership... membership unlocks... have
// you forgotten all the rules around unown stuff? do you not understand what we do here? we do constitutional swarms... swarms that have
// transparent balances on solana and encrypted communications that are only visible to holders... study traces").
//
// The traces, in his words (UTC+1): Sep 3 23:33 "they should only see crypted infos... they shouldn't be able to see what those who own hexs
// can see"; Sep 6 03:08 "crypted / pokemon unown symbols typa messages and have the pop-up as a rectangle with text in this unown language...
// this is for public (public = dont have the group decryption stuff)"; Sep 6 08:31 the speakers "visibly "exploding" when these pop-ups
// appear... the popup being visualized belongs to that particular member"; Sep 6 "you should never add there the title and the x/N numbering";
// Sep 10 00:28 "1st: IF YOU DONT FUCKING OWN ANY HEX ON THIS SHIT: YOU SEE THE UNOWNS TYPA SHIT!!!! 2nd: IF YOU GOT IT, YOU SHOULD SEE CLEARTEXT
// MESSAGES". So one sphere, two viewers. Both see what Solana shows (the hexagons, the balance). What a member says opens as a plate from the
// speaker's face: the public reads Unown glyphs of the envelope (glyphCodes, the Poleis discussion's own: they come from the envelope's id,
// never from its words), a holder reads the words. No title, no counter: a lock, shut or open.
//
// BURN MY COSMOS (his Oct 12 2026 12:33 WEST, over these panels: "can you make the unowns things feel more like anime? like... i need some
// sanctity aura vibes u get me? pure anime like aiolos saint seya golden armor pure of hearts u get me? goku like"). Aiolos is his Aiolos, the
// Gold Saint of Sagittarius: Sep 23 04:10 "saint seya is Aiolos and he is BURN MY COSMOSS AAAAA", 21:37 "ANTIMIRROR IS GOLDEN SAGYTTARIUS ARMOR
// TO AIOLOS", Sep 26 "GOLDEN SAGYTTARIUS BURN MY COSMOOOOOSSSSSSSS"; Sep 12 "Io ho il Vision Pro quando sono Super Saiyan"; and never flat, Aug 8
// "stop saying flat anime simple illustration... i want deligghtgul masterpieces". So a member who speaks burns their cosmo: a gold aura licks
// up round their face, its tongues tallest above as a Saiyan's, twelve rays turning behind it, sparks of light rising. Sagittarius's golden
// arrow flies from the face and strikes the plate into being: gold cloth round the night the Saints fight under, the Sagittarius wings opening
// from its shoulders, the Unown burning gold inside. A holder reads the words in the same light.
//
// THE RULES (his Oct 12 2026 12:5x WEST, over three burning plates and their speakers at once: "you need some rules... right now it looks
// stupid... have you forgotten about these? * poleis.us/app/polis.html?v=speaker-burst-1&civ=5067402218329764206&program=AJdsmj... please...").
// The polis page's own laws, kept here:
//  1. present tense only. activity.js: "Historical ballots and proposal text are never evidence that agents are voting or discussing";
//     polis.js: "Nothing here is shown that the chain did not do or the body did not send"; his Sep 7 "all of the state comes from solana....
//     so there's nothing to hallucinate". No chatter: at rest the sphere is its quiet orbit, the energy saver.
//  2. the society's words are its records, each under a hash: the public reads glyphs drawn from the hash (polis.js "Glyphs are derived from
//     public IDs only"), a holder reads the text (his Sep 3 "the rest just see the hash").
//  3. one readable plate at a time, never a cloud of boxes (discussion.js "One readable panel"); it opens away from its speaker and stays
//     put; the speaker bursts once, then keeps a quiet halo and its leader ("The quiet halo and leader retain ownership after the single
//     burst ends").
//  4. chairs speak, chair to chair (discussion.js speaker(): seats 0-11 only): the words cross on an arc to their recipient and ring there.
//  5. the vote is public: a chair lights as it votes, a seat flashes as it votes; the verdict stands on the plate.
// Cost: the textures (the aureole, the spark, the night, the 26 glyphs already burning) are painted once into small canvases; a frame stamps
// them and fills a few dozen paths, with no shadow blur but under a holder's few words. Drawn on the sphere's canvas through its overlay: no
// DOM and no timer; it asks for frames only while a voice is showing. Reduced motion: the same picture, still.
import { drawGlyph, glyphCodes } from './discussion.js?v=speaker-burst-1';

const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = k => { k = clamp(k); return k * k * (3 - 2 * k); };
const blow = k => { k = clamp(k) - 1; return 1 + 2.7 * k ** 3 + 1.7 * k ** 2; };   // out, overshooting like a strike
// a voice's beats (ms): the speaker ignites at 0 and its cosmo dies down to a halo by BURST; the arrow flies until ARROW and strikes the plate,
// whose wings open over WINGS and whose glyphs burn in from TYPE one every 38 ms; the words leave on the arc at CROSS and ring at their
// recipient at ARRIVE; when the society is done with them everything goes out over OUT
const OUT = 800, ARROW = 360, WINGS = 620, TYPE = 560, BURST = 1300, CROSS = 400, ARRIVE = 1700;
// the plate (css px), gold rim and cut corners like a cloth's plates; the Unown at 2 css px a font pixel, twelve to a row
const WIDTH = 252, PAD = 14, RIM = 5, CUT = 7, GLYPH = 16, STEP = 18, ROW = 26, CELL = 48, WING = 56;
// three layers of flame: reach, colour at the face, colour at the tips, alpha (amber, gold, the white heart)
const FLAMES = [[1, '255,186,50', '232,116,8', 0.62], [0.7, '255,224,110', '255,168,28', 0.72], [0.32, '255,250,226', '255,226,150', 0.7]];
// a Sagittarius wing: five feathers, length (css px) and angle when open (0 straight out, negative up)
const FEATHERS = [[52, -0.1], [45, -0.42], [38, -0.74], [30, -1.04], [22, -1.3]];
const TONGUES = 18, tips = new Float64Array(TONGUES * 4), valleys = new Float64Array(TONGUES * 2);

let ink = null;
// every texture once, at the first voice
function paint() {
  const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
  const aureole = canvas(128, 128), a = aureole.getContext('2d'), ga = a.createRadialGradient(64, 64, 0, 64, 64, 64);
  ga.addColorStop(0, 'rgba(255,251,236,1)'); ga.addColorStop(0.22, 'rgba(255,228,140,0.78)');
  ga.addColorStop(0.55, 'rgba(250,184,50,0.24)'); ga.addColorStop(1, 'rgba(250,184,50,0)');
  a.fillStyle = ga; a.fillRect(0, 0, 128, 128);
  // the four-pointed glint of anime light, a white core in gold
  const spark = canvas(64, 64), s = spark.getContext('2d'), gs = s.createRadialGradient(32, 32, 0, 32, 32, 32);
  gs.addColorStop(0, 'rgba(255,255,255,1)'); gs.addColorStop(0.16, 'rgba(255,238,176,0.85)');
  gs.addColorStop(0.45, 'rgba(255,196,70,0.2)'); gs.addColorStop(1, 'rgba(255,196,70,0)');
  s.fillStyle = gs; s.fillRect(0, 0, 64, 64);
  s.fillStyle = '#ffffff'; s.beginPath();
  s.moveTo(32, 1); s.lineTo(35, 29); s.lineTo(63, 32); s.lineTo(35, 35); s.lineTo(32, 63); s.lineTo(29, 35); s.lineTo(1, 32); s.lineTo(29, 29);
  s.closePath(); s.fill();
  // the night the Saints fight under, at 2 px a css px: deep blue going violet, its stars, a few glints
  const night = canvas(768, 220), n = night.getContext('2d'), sky = n.createLinearGradient(0, 0, 300, 220);
  sky.addColorStop(0, '#0a1130'); sky.addColorStop(0.55, '#191646'); sky.addColorStop(1, '#2a1340');
  n.fillStyle = sky; n.fillRect(0, 0, 768, 220);
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 260; i++) {
    n.globalAlpha = 0.3 + rnd() * 0.7; n.fillStyle = rnd() < 0.22 ? '#ffe2a0' : '#dde5ff';
    n.beginPath(); n.arc(rnd() * 768, rnd() * 220, 0.35 + rnd() ** 3 * 1.7, 0, TAU); n.fill();
  }
  n.globalAlpha = 0.75;
  for (let i = 0; i < 14; i++) { const z = 7 + rnd() * 10; n.drawImage(spark, rnd() * 768 - z / 2, rnd() * 220 - z / 2, z, z); }
  // the 26 Unown already burning, 4 px a font pixel: gold in its glow with the upper half lit like metal (row 0), white-hot (row 1)
  const glyphs = canvas(CELL * 26, CELL * 2), g = glyphs.getContext('2d');
  for (let i = 0; i < 26; i++) {
    const x = i * CELL + 8;
    g.save(); g.shadowColor = 'rgba(255,168,28,1)'; g.shadowBlur = 10; drawGlyph(g, i, x, 8, 32, '#f7c24c'); g.restore();
    g.save(); g.beginPath(); g.rect(x, 8, 32, 15); g.clip(); drawGlyph(g, i, x, 8, 32, '#fff4c8'); g.restore();
    g.save(); g.shadowColor = '#ffffff'; g.shadowBlur = 14; drawGlyph(g, i, x, CELL + 8, 32, '#ffffff'); g.restore();
  }
  return { aureole, spark, night, glyphs, plumes: new Map() };
}

function polygon(ctx, points) { points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
function plateShape(ctx, x, y, w, h, c) {
  ctx.moveTo(x + c, y); ctx.lineTo(x + w - c, y); ctx.lineTo(x + w, y + c); ctx.lineTo(x + w, y + h - c);
  ctx.lineTo(x + w - c, y + h); ctx.lineTo(x + c, y + h); ctx.lineTo(x, y + h - c); ctx.lineTo(x, y + c); ctx.closePath();
}
// the plate's one mark, a lock in its corner: shut for the public, open for a holder
function lock(ctx, x, y, open) {
  ctx.strokeStyle = '#ffd66b'; ctx.lineWidth = 1.1; ctx.beginPath();
  if (open) ctx.arc(x + 4, y + 1.5, 2.6, Math.PI, -0.35); else ctx.arc(x + 4, y + 4, 2.6, Math.PI, 0);
  ctx.stroke(); ctx.fillStyle = '#ffd66b'; ctx.fillRect(x, y + 4, 8, 6);
}
function lines(ctx, text, max) {
  const out = [];
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const last = out[out.length - 1];
    if (last && ctx.measureText(`${last} ${word}`).width <= max) out[out.length - 1] = `${last} ${word}`; else out.push(word);
  }
  return out.slice(0, 4);
}

// how far the face's outline lies from its centre along the angle th (a projected face is convex and holds its centre)
function rim(points, cx, cy, th) {
  const dx = Math.cos(th), dy = Math.sin(th);
  let best = Infinity;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i], [x2, y2] = points[(i + 1) % points.length], ex = x2 - x1, ey = y2 - y1, den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((x1 - cx) * ey - (y1 - cy) * ex) / den, u = ((x1 - cx) * dy - (y1 - cy) * dx) / den;
    if (t > 0 && u >= -1e-6 && u <= 1 + 1e-6 && t < best) best = t;
  }
  return Number.isFinite(best) ? best : 0;
}
// eighteen tongues rising off the face's own outline: tallest at the top as fire leans up, short below, each flickering and swaying on
// its own clock (s: the face's size, which sets their reach)
function tongues(ctx, at, s, t, reach, seed) {
  for (let k = 0; k < TONGUES; k++) {
    const th = (k / TONGUES) * TAU + seed, up = (1 - Math.sin(th)) / 2, d = rim(at.points, at.x, at.y, th);
    const flick = 0.72 + 0.28 * Math.sin(t * 0.0083 * (1 + (k % 5) * 0.14) + k * 2.1) + 0.12 * Math.sin(t * 0.0141 + k * 5.3);
    const L = s * reach * (0.2 + 1.05 * up ** 1.6) * flick;
    let dx = Math.cos(th), dy = Math.sin(th) - 1.3 * up - 0.25;
    const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
    tips[k * 4] = at.x + Math.cos(th) * d + dx * L + Math.sin(t * 0.0031 + k) * s * 0.08 * up;
    tips[k * 4 + 1] = at.y + Math.sin(th) * d + dy * L;
    tips[k * 4 + 2] = Math.cos(th) * L * 0.2; tips[k * 4 + 3] = Math.sin(th) * L * 0.2;
    const v = th + Math.PI / TONGUES, dv = rim(at.points, at.x, at.y, v) + s * 0.04;
    valleys[k * 2] = at.x + Math.cos(v) * dv; valleys[k * 2 + 1] = at.y + Math.sin(v) * dv;
  }
  ctx.beginPath();
  let px = valleys[TONGUES * 2 - 2], py = valleys[TONGUES * 2 - 1];
  ctx.moveTo(px, py);
  for (let k = 0; k < TONGUES; k++) {
    const tx = tips[k * 4], ty = tips[k * 4 + 1], ox = tips[k * 4 + 2], oy = tips[k * 4 + 3], vx = valleys[k * 2], vy = valleys[k * 2 + 1];
    ctx.quadraticCurveTo((px + tx) / 2 + ox, (py + ty) / 2 + oy, tx, ty);
    ctx.quadraticCurveTo((tx + vx) / 2 + ox * 0.4, (ty + vy) / 2 + oy * 0.4, vx, vy);
    px = vx; py = vy;
  }
  ctx.closePath();
}

// the speaker's cosmo: twelve rays turning behind, the aureole, three layers of flame licking up; the face itself stays clear (all of it is
// clipped round the face) and lights from within. power: 0 out, 1 burning, above 1 the ignition.
function cosmo(ctx, at, r, t, power, seed) {
  // the face's size: between its reach and the radius of its area, so a face turned edge-on burns as a sliver, not as a sun
  let area = 0;
  at.points.forEach(([x1, y1], i) => { const [x2, y2] = at.points[(i + 1) % at.points.length]; area += x1 * y2 - x2 * y1; });
  const s = Math.min(64, 0.5 * (r + Math.sqrt(Math.abs(area) / 2 / Math.PI))), a = Math.min(1, power);
  ctx.save();
  ctx.beginPath(); ctx.rect(at.x - r * 8, at.y - r * 8, r * 16, r * 16); polygon(ctx, at.points); ctx.clip('evenodd');
  ctx.save(); ctx.translate(at.x, at.y); ctx.rotate(seed + t * 0.00021);
  const rays = ctx.createRadialGradient(0, 0, s * 0.7, 0, 0, s * 3.3);
  rays.addColorStop(0, 'rgba(255,226,140,0.6)'); rays.addColorStop(1, 'rgba(255,226,140,0)');
  ctx.globalAlpha = a * 0.75; ctx.fillStyle = rays; ctx.beginPath();
  for (let i = 0; i < 12; i++) { const b = (i / 12) * TAU; ctx.moveTo(0, 0); ctx.arc(0, 0, s * 3.3, b - 0.05, b + 0.05); ctx.closePath(); }
  ctx.fill(); ctx.restore();
  ctx.globalAlpha = a * 0.6; ctx.drawImage(ink.aureole, at.x - s * 2.5, at.y - s * 2.9, s * 5, s * 5);
  FLAMES.forEach(([reach, inner, outer, alpha], layer) => {
    tongues(ctx, at, s, t + layer * 170, reach * power, seed + layer * 0.37);
    const fire = ctx.createRadialGradient(at.x, at.y - s * 0.2, s * 0.5, at.x, at.y - s * 0.6, s * (1.2 + reach * power * 1.3));
    fire.addColorStop(0, `rgba(${inner},1)`); fire.addColorStop(1, `rgba(${outer},0.6)`);
    ctx.globalAlpha = alpha * a; ctx.fillStyle = fire; ctx.fill();
    if (!layer) { ctx.globalAlpha = 0.65 * a; ctx.strokeStyle = '#b8620a'; ctx.lineWidth = 1.2; ctx.stroke(); }
  });
  ctx.restore();
  ctx.beginPath(); polygon(ctx, at.points);
  ctx.globalAlpha = 0.18 * a; ctx.fillStyle = '#ffe18a'; ctx.fill();
  ctx.globalAlpha = 0.95 * a; ctx.strokeStyle = '#fff4c6'; ctx.lineWidth = 1.6; ctx.stroke();
  return s;
}
// sparks of light rising off the cosmo
function sparks(ctx, at, r, t, power, seed) {
  for (let j = 0; j < 10; j++) {
    const p = (t * 0.00052 * (1 + (j % 3) * 0.22) + j * 0.618 + seed) % 1, b = seed * 7 + j * 2.4;
    const z = (1 - p) * (8 + 5 * Math.sin(t * 0.009 + j * 1.7));
    if (z < 0.5) continue;
    const x = at.x + Math.cos(b) * r * 1.15 + Math.sin(p * 6 + j) * r * 0.22, y = at.y + Math.sin(b) * r * 0.75 - p * r * 2.6;
    ctx.globalAlpha = Math.min(1, power) * (1 - p); ctx.drawImage(ink.spark, x - z / 2, y - z / 2, z, z);
  }
}
// the instant it ignites: the face goes white and a ring of light leaves it
function ignite(ctx, at, r, age) {
  const k = age / 600;
  if (k >= 1) return;
  ctx.globalAlpha = 1 - ease(age / 300); ctx.fillStyle = '#ffffff'; ctx.beginPath(); polygon(ctx, at.points); ctx.fill();
  const ring = r * (1.1 + 2.4 * ease(k));
  ctx.globalAlpha = (1 - k) * 0.9; ctx.strokeStyle = '#fff8e0'; ctx.lineWidth = 2.4 * (1 - k) + 0.6;
  ctx.beginPath(); ctx.arc(at.x, at.y, ring, 0, TAU); ctx.stroke();
  ctx.strokeStyle = '#f2b53a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(at.x, at.y, ring + 3, 0, TAU); ctx.stroke();
}
// Sagittarius's golden arrow, face to plate: a streak of light with a gold head (k: 0..1 of its flight)
function arrow(ctx, ax, ay, bx, by, k) {
  const e = ease(k), hx = ax + (bx - ax) * e, hy = ay + (by - ay) * e, f = Math.max(0, e - 0.34), tx = ax + (bx - ax) * f, ty = ay + (by - ay) * f;
  const trail = ctx.createLinearGradient(tx, ty, hx, hy);
  trail.addColorStop(0, 'rgba(255,206,80,0)'); trail.addColorStop(1, 'rgba(255,250,228,1)');
  ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy);
  ctx.globalAlpha = 0.35; ctx.strokeStyle = '#ffbf3a'; ctx.lineWidth = 9; ctx.stroke();
  ctx.globalAlpha = 1; ctx.strokeStyle = trail; ctx.lineWidth = 3.6; ctx.stroke(); ctx.lineCap = 'butt';
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(Math.atan2(by - ay, bx - ax)); ctx.scale(1.7, 1.7);
  ctx.fillStyle = '#ffeaa8'; ctx.strokeStyle = '#9b6408'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(7, 0); ctx.lineTo(-4, -4); ctx.lineTo(-1.5, 0); ctx.lineTo(-4, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.drawImage(ink.spark, hx - 16, hy - 16, 32, 32);
}
// the Sagittarius cloth's wings at the plate's shoulders: folded up until it is struck, then open, breathing
function wings(ctx, x, y, w, open, t) {
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(side < 0 ? x + 4 : x + w - 4, y + 8); ctx.scale(side, 1);
    for (let j = FEATHERS.length - 1; j >= 0; j--) {
      const [L, angle] = FEATHERS[j];
      let plume = ink.plumes.get(L);
      if (!plume) {
        plume = ctx.createLinearGradient(0, 0, L, 0);
        plume.addColorStop(0, '#b97a0e'); plume.addColorStop(0.3, '#ffd96a'); plume.addColorStop(0.72, '#fff7da'); plume.addColorStop(1, '#f0bd45');
        ink.plumes.set(L, plume);
      }
      ctx.save(); ctx.rotate(-1.52 + (angle + 1.52) * open + Math.sin(t * 0.0021 + j * 0.6) * 0.04 * open);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(L * 0.5, -L * 0.21, L, 0); ctx.quadraticCurveTo(L * 0.55, L * 0.1, 0, 0);
      ctx.fillStyle = plume; ctx.fill(); ctx.strokeStyle = '#7e5108'; ctx.lineWidth = 0.75; ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(L * 0.18, -L * 0.06); ctx.quadraticCurveTo(L * 0.5, -L * 0.16, L * 0.9, -L * 0.02); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }
}
// the plate: its aureole, the wings, the gold in hard bands like lit metal in a cel, the night inside, light running over the gold, a gem at
// each cut corner, and the white of the blow that struck it
function plate(ctx, x, y, w, h, t, struck, open, seed, alpha) {
  ctx.globalAlpha = alpha * 0.55; ctx.drawImage(ink.aureole, x - 46, y - 44, w + 92, h + 88);
  ctx.globalAlpha = alpha; wings(ctx, x, y, w, open, t);
  const gold = ctx.createLinearGradient(0, y, 0, y + h);
  gold.addColorStop(0, '#fff8d6'); gold.addColorStop(0.16, '#ffe07c'); gold.addColorStop(0.19, '#f3bb3c'); gold.addColorStop(0.52, '#cf8a12');
  gold.addColorStop(0.55, '#f6cc58'); gold.addColorStop(0.8, '#df9f26'); gold.addColorStop(1, '#8c5806');
  ctx.beginPath(); plateShape(ctx, x, y, w, h, CUT); ctx.fillStyle = gold; ctx.fill(); ctx.strokeStyle = '#6a4204'; ctx.lineWidth = 1; ctx.stroke();
  ctx.save(); ctx.beginPath(); plateShape(ctx, x + RIM, y + RIM, w - RIM * 2, h - RIM * 2, CUT - 2); ctx.clip();
  ctx.drawImage(ink.night, Math.floor(seed * 61) % 250, 0, w * 2, h * 2, x, y, w, h);
  ctx.globalAlpha = alpha * 0.35; ctx.drawImage(ink.aureole, x + w * 0.1, y + h * 0.35, w * 0.8, h * 1.3);
  ctx.restore();
  ctx.globalAlpha = alpha * 0.85; ctx.strokeStyle = '#ffe9a6'; ctx.lineWidth = 0.8;
  ctx.beginPath(); plateShape(ctx, x + RIM, y + RIM, w - RIM * 2, h - RIM * 2, CUT - 2); ctx.stroke();
  ctx.save(); ctx.beginPath(); plateShape(ctx, x, y, w, h, CUT); plateShape(ctx, x + RIM, y + RIM, w - RIM * 2, h - RIM * 2, CUT - 2); ctx.clip('evenodd');
  const sweep = ((t + seed * 997) % 2400) / 2400, sx = x - 50 + sweep * (w + 100), shine = ctx.createLinearGradient(sx - 22, y, sx + 22, y + h);
  shine.addColorStop(0, 'rgba(255,255,255,0)'); shine.addColorStop(0.5, 'rgba(255,255,255,0.95)'); shine.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.globalAlpha = alpha; ctx.fillStyle = shine; ctx.fillRect(x, y, w, h); ctx.restore();
  for (const [gx, gy] of [[x + 4.5, y + 4.5], [x + w - 4.5, y + 4.5], [x + 4.5, y + h - 4.5], [x + w - 4.5, y + h - 4.5]]) {
    ctx.beginPath(); ctx.moveTo(gx, gy - 2.6); ctx.lineTo(gx + 2.6, gy); ctx.lineTo(gx, gy + 2.6); ctx.lineTo(gx - 2.6, gy); ctx.closePath();
    ctx.fillStyle = '#fffbea'; ctx.fill(); ctx.strokeStyle = '#8c5a06'; ctx.lineWidth = 0.7; ctx.stroke();
  }
  if (struck < 1) { ctx.globalAlpha = alpha * (1 - struck); ctx.fillStyle = '#ffffff'; ctx.beginPath(); plateShape(ctx, x, y, w, h, CUT); ctx.fill(); }
}

export function createVoices(sphere) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let viewer = 'public', voice = null, ballot = null, serial = 0;
  const now = () => performance.now();
  const size = at => Math.min(64, Math.max(6, ...at.points.map(([px, py]) => Math.hypot(px - at.x, py - at.y))));
  const shown = at => at && at.z > 0.05;

  // the vote, in public: a chair lights as it votes (a flash, then its rim gold), a seat flashes and keeps a gold point
  function drawBallot(ctx, view, t) {
    const fade = ballot.endAt ? 1 - clamp((t - ballot.endAt) / OUT) : 1;
    for (const { id, at: when } of ballot.chairs) {
      const at = view.anchor(id), k = t - when;
      if (k < 0 || !shown(at)) continue;
      ctx.beginPath(); polygon(ctx, at.points);
      if (k < 420 && !motion.matches) { ctx.globalAlpha = fade * (1 - k / 420); ctx.fillStyle = '#ffffff'; ctx.fill(); }
      ctx.globalAlpha = fade * 0.55; ctx.strokeStyle = '#ffd36a'; ctx.lineWidth = 5; ctx.stroke();
      ctx.globalAlpha = fade; ctx.strokeStyle = '#b9790f'; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.strokeStyle = '#fff6d6'; ctx.lineWidth = 0.8; ctx.stroke();
    }
    for (const { id, at: when } of ballot.seats) {
      const at = view.anchor(id), k = t - when;
      if (k < 0 || !shown(at)) continue;
      if (k < 700 && !motion.matches) { ctx.globalAlpha = fade * 0.55 * (1 - k / 700); ctx.fillStyle = '#f2c14e'; ctx.beginPath(); polygon(ctx, at.points); ctx.fill(); }
      ctx.globalAlpha = fade * 0.9; ctx.fillStyle = '#c4891c'; ctx.beginPath(); ctx.arc(at.x, at.y, 2.2, 0, TAU); ctx.fill();
    }
  }

  // the one voice: its speaker's single burst and quiet halo, the words crossing to their recipient, the plate where it was struck
  function drawVoice(ctx, view, t) {
    const still = motion.matches, holder = viewer === 'holder', age = still ? 3000 : t - voice.born;
    const out = voice.endAt ? 1 - clamp((t - voice.endAt) / OUT) : 1;
    const at = view.anchor(voice.from), to = view.anchor(voice.to), narrow = view.width < 700;
    if (holder && !voice.text) voice.text = lines(ctx, voice.words, WIDTH - PAD * 2 - 18);
    const rows = Math.ceil(voice.codes.length / 12);
    const h = holder ? PAD * 2 + voice.text.length * 18 - 4 : PAD * 2 + rows * GLYPH + (rows - 1) * (ROW - GLYPH);
    // where the plate stands, chosen once: across the sphere from its speaker, high if the speaker is low and low if it is high
    if (!voice.place) {
      const left = at ? at.x >= view.center[0] : false, high = at ? at.y >= view.center[1] : true;
      voice.place = { left, high, narrow };
    }
    const { left, high } = voice.place;
    const x = Math.round(narrow ? clamp((view.width - WIDTH) / 2, 10, view.width - WIDTH - 10)
      : clamp(left ? view.center[0] - view.radius * 1.08 - 24 - WIDTH : view.center[0] + view.radius * 1.08 + 24, WING, view.width - WIDTH - WING));
    const y = Math.round(narrow ? 24 : high ? Math.max(24, view.center[1] - view.radius * 0.85 - h / 2) : Math.min(view.height - h - 56, view.center[1] + view.radius * 0.85 - h / 2));
    // the speaker: one burst (its cosmo flares and dies down), then the quiet halo that keeps the plate its own
    if (shown(at)) {
      const r = size(at), power = still ? 0 : 1.4 * (1 - clamp(age / BURST));
      let s = Math.min(64, r);
      if (power > 0) { s = cosmo(ctx, at, r, t, power * out, voice.seed); sparks(ctx, at, s, t, power * out, voice.seed); ignite(ctx, at, s, age); }
      ctx.globalAlpha = out * (still ? 1 : ease((age - 300) / 700)) * 0.9; ctx.strokeStyle = '#c99a3c'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(at.x, at.y, s * 0.75 + 6, 0, TAU); ctx.stroke();
    }
    // the words cross to their recipient on an arc, a glyph riding it, and ring there
    if (shown(at) && shown(to) && voice.to !== voice.from) {
      const mx = (at.x + to.x) / 2, my = (at.y + to.y) / 2, ox = mx - view.center[0], oy = my - view.center[1], om = Math.hypot(ox, oy) || 1;
      const lift = Math.hypot(to.x - at.x, to.y - at.y) * 0.35, cx = mx + ox / om * lift, cy = my + oy / om * lift;
      ctx.globalAlpha = out * 0.6; ctx.strokeStyle = '#b8954f'; ctx.lineWidth = 0.9; ctx.setLineDash([2, 5]);
      ctx.beginPath(); ctx.moveTo(at.x, at.y); ctx.quadraticCurveTo(cx, cy, to.x, to.y); ctx.stroke(); ctx.setLineDash([]);
      const k = still ? 1 : ease((age - CROSS) / (ARRIVE - CROSS));
      if (k > 0 && k < 1) {
        const qx = (1 - k) ** 2 * at.x + 2 * (1 - k) * k * cx + k * k * to.x, qy = (1 - k) ** 2 * at.y + 2 * (1 - k) * k * cy + k * k * to.y;
        ctx.globalAlpha = out; ctx.drawImage(ink.glyphs, voice.codes[0] * CELL, 0, CELL, CELL, qx - 12, qy - 12, 24, 24);
      }
      const ring = still ? 1 : clamp((age - ARRIVE) / 1200);
      if (ring > 0 && ring < 1) {
        ctx.globalAlpha = out * (1 - ring); ctx.strokeStyle = '#d9a640'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(to.x, to.y, size(to) * 0.6 + 4 + ring * 16, 0, TAU); ctx.stroke();
      }
    }
    // the leader: Sagittarius's arrow flies it first, then it stays as a thread
    if (shown(at)) {
      const bx = narrow ? clamp(at.x, x + 8, x + WIDTH - 8) : left ? x + WIDTH : x, by = narrow ? y + h : clamp(at.y, y + 8, y + h - 8);
      if (!still && age < ARROW) arrow(ctx, at.x, at.y, bx, by, age / ARROW);
      else {
        ctx.beginPath(); ctx.moveTo(at.x, at.y); ctx.lineTo(bx, by);
        ctx.globalAlpha = 0.22 * out; ctx.strokeStyle = '#ffc94d'; ctx.lineWidth = 4; ctx.stroke();
        ctx.globalAlpha = 0.85 * out; ctx.strokeStyle = '#e2a93a'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    if (!still && age < ARROW) return;
    // the plate, struck when the arrow lands
    const k = still ? 1 : (age - ARROW) / 240, alpha = out * (still ? 1 : ease(k * 2)), scale = still ? 1 : 0.9 + 0.1 * blow(k);
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.translate(x + WIDTH / 2, y + h / 2); ctx.scale(scale, scale); ctx.translate(-x - WIDTH / 2, -y - h / 2);
    plate(ctx, x, y, WIDTH, h, still ? 0 : t, still ? 1 : clamp(k), still ? 1 : ease((age - ARROW) / WINGS), voice.seed, alpha);
    ctx.globalAlpha = alpha; lock(ctx, x + WIDTH - PAD - 8, y + PAD - 2, holder);
    if (holder) {
      ctx.save(); ctx.fillStyle = '#fff3d2'; ctx.shadowColor = 'rgba(255,180,50,0.95)'; ctx.shadowBlur = 7;
      ctx.globalAlpha = alpha * (still ? 1 : ease((age - TYPE) / 300));
      voice.text.forEach((line, i) => ctx.fillText(line, x + PAD, y + PAD + 11 + i * 18));
      ctx.restore();
    } else {
      // the record's glyphs, from its hash, burn in one by one, white-hot the instant each is struck
      const count = still ? voice.codes.length : Math.min(voice.codes.length, Math.max(0, Math.floor((age - TYPE) / 38) + 1));
      for (let i = 0; i < count; i++) {
        const gx = x + PAD + (i % 12) * STEP, gy = y + PAD + Math.floor(i / 12) * ROW, fresh = still ? 1 : clamp((age - TYPE - i * 38) / 160);
        ctx.globalAlpha = alpha; ctx.drawImage(ink.glyphs, voice.codes[i] * CELL, 0, CELL, CELL, gx - 4, gy - 4, 24, 24);
        if (fresh < 1) {
          const z = 24 * (1 + 0.5 * (1 - fresh));
          ctx.globalAlpha = alpha * (1 - fresh); ctx.drawImage(ink.glyphs, voice.codes[i] * CELL, CELL, CELL, CELL, gx + 8 - z / 2, gy + 8 - z / 2, z, z);
        }
      }
    }
    // the verdict, public like the vote: stamped on the plate's lower edge
    if (voice.verdict) {
      const v = still ? 1 : ease((t - voice.verdict.at) / 260), w = 62, vx = x + WIDTH - w - 12, vy = y + h - 9;
      ctx.globalAlpha = alpha * v; ctx.fillStyle = '#1b1646'; ctx.fillRect(vx, vy - 1, w, 12);
      ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 1; ctx.strokeRect(vx + 0.5, vy - 0.5, w - 1, 11);
      ctx.save(); ctx.font = '600 8px ui-monospace, SFMono-Regular, monospace'; ctx.fillStyle = '#ffe08a'; ctx.textAlign = 'center';
      ctx.fillText(voice.verdict.label, vx + w / 2, vy + 8); ctx.restore();
    }
    ctx.restore();
  }

  function draw(ctx, view) {
    const t = now();
    if (voice?.endAt && t - voice.endAt > OUT) voice = null;
    if (ballot?.endAt && t - ballot.endAt > OUT) ballot = null;
    if (!voice && !ballot) return false;
    ink ??= paint();
    ctx.save();
    ctx.font = '13px Georgia, "Times New Roman", serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    if (ballot) drawBallot(ctx, view, t);
    if (voice) drawVoice(ctx, view, t);
    ctx.restore();
    return true;
  }
  sphere.setOverlay(draw);

  return {
    // one chair speaks to another: the record's words, and its hash, which is all the public sees of them
    speak({ from, to, words, hash }) {
      voice = { from, to, words, born: now(), seed: (++serial * 0.618034) % 1 * TAU, codes: glyphCodes(hash) };
      sphere.redraw();
    },
    // the vote as it lands: chairs and seats with the moment each votes (performance.now() ms)
    vote(chairs, seats) { ballot = { chairs, seats }; sphere.redraw(); },
    verdict(label) { if (voice) voice.verdict = { label, at: now() }; sphere.redraw(); },
    // the society is done with these words: the plate, the halo and the vote go out together
    end() { const t = now(); if (voice) voice.endAt ??= t; if (ballot) ballot.endAt ??= t; sphere.redraw(); },
    // which of these faces turn to the viewer now (the sphere's last frame)
    visible(ids, z = 0.5) { return ids.filter(id => (sphere.anchor?.(id)?.z ?? -1) > z); },
    setViewer(next) { viewer = next === 'holder' ? 'holder' : 'public'; if (voice) voice.text = null; sphere.redraw(); },
    get viewer() { return viewer; },
    clear() { voice = null; ballot = null; sphere.redraw(); },
    stop() { voice = null; ballot = null; sphere.setOverlay(null); },
  };
}
