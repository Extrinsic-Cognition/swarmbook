// dl-her-portrait.js · HER PORTRAIT IS HER DEPOSIT'S HEXAGON, AND EVERYONE'S FACES ARE ON THE SPHERE (Nov 11 2026). His words that day: "we need to find
// a way to turn lyssajudron configs into MMO profile pictures", "can we build it in to our lyssajudron thing? when they buy the hex for min 10 USDC",
// "find a standard come on... we need to get the swarm cult mania pfp going on twitter", "u know what t do"; over a first cut that stood her portrait as a
// chip in the page's corner: "wtf? dude no. we need to think about some shits dude come on"; "i would like to imagine if we were to fill the surface with
// lyssajudron pics of other profiles", "Yes, build it"; over the others drawn from colours alone: "dude, until now there was only mocks... it is only
// internal atm..."; and over all of it laid on a ring of its own on main's old freeze: "what is this? where is this supposed to go? have you been working
// in isolation?".
// WHERE IT GOES: on the hexagon a deposit takes. On the mint page a deposit is a seat (MINT YOUR SWARMY EGG, dl-kit-deposit.js; THE HOUSE HEARS ONCE): its
// drop falls, its spark flies to its hexagon, and the sphere draws that hexagon as a floating bronze or a rising gold (warm-sphere.js). This module only
// gives each of those hexagons its face, through the sphere's own hook (setSeatFace), by the deposit's signature: no cell, order or number of its own.
// A press on someone's face opens their page (/<handle>, their tracenet), when the door's list names one.
// WHAT: at her 'made' (her Continue, dl-her-colours.js) the visitor's Lyssajudron is drawn once more by her own painter (the page's own stageHer), to THE
// STANDARD: her face alone, one pose for everyone (POSE), one flat ground turned from the owner's light, a hexagon with a gold rim. It comes in on the
// visitor's own hexagon (their deposit's signature, said by dl-tank-pouring), its number under it (the deposit's place in the house's list); a press on
// it saves it. The door (worker/space-router-portrait.mjs) gives a pass and Reactor paints that drawing in the painter's frame (dl-her-portrait-frame.html:
// no origin, so its kit sees no wallet, no storage, no page); the painting takes the drawing's place. The house keeps her drawing at once and her painting over it. At her
// entrance, her egg's offer, her landing and 'made' the page reads everyone's faces off the door and each deposit's hexagon takes its painting (or her drawing from its colours).
// COST: nothing until her landing: then one ask of the door (held 20 s) and one picture of about 40 kB a painted hexagon. At 'made': one renderer of hers
// for about 4 s (a 2826 px canvas, let go at once), one PNG and one PUT of about 40 kB; with a pass, one frame, 0.9 MB of kit, one Reactor session of
// about 10 s and one PUT more. No frame of its own: the faces are drawn in the frames the sphere already draws for its seats.
import * as WISH from './dl-her-wishes.mjs';

export const SEEN_EVENT = 'dl-athena', MADE = 'made', POURING = 'dl-tank-pouring', PORTRAIT = 'dl-her-portrait';   // dl-her-colours.js's word, dl-kit-deposit.js's (its detail names the deposit's signature), and this module's own (detail: {url, painted, hexagon})
export const PX = 960, ZOOM = 3.2, POSE = 1794388370885, HOLD_MS = 2200, BORN_MS = 600, PASS_PATH = '/space-router/v1/portrait', RIM = '#f0cf74', OUT = '#0b0a12';
export const REVEAL = Object.freeze({ zoom: 2.2, making: 3.4, tilt: .85, at: [.5, .42], tries: 6, ms: 900, hold: 3500, back: 1400 }), KEEP_PX = 480, WALL = 150, WALL_PX = 320, PARTS = Object.freeze(['base', 'coat', 'gold', 'eyes', 'thruster']);   // the painting the house keeps; the others' faces: how many at most, their side; her five painted parts (her light is the sixth colour)
export const HEX = Object.freeze([[480, 20], [81.6, 250], [81.6, 710], [480, 940], [878.4, 710], [878.4, 250]]);   // point up, inside X's round crop, on a 960 square
export const PROMPT = 'Paint this diagram as the face of a legendary creature, a profile picture: a living machine-jewel, a faceted polyhedral core with one glowing eye in the middle and two eyes beside it. Keep exactly its colours, its shape and the place of every part. Bold, clean, hand-painted game art with strong outlines. The background stays one flat solid colour, exactly the colour it is now: no gradient, no scenery, no glow, no stars.';
const CSS = `.dl-her-pfp{position:fixed;z-index:2147483002;display:block;border-radius:50%;cursor:pointer}.dl-her-pfp[hidden]{display:none}.dl-her-pfp:focus-visible{outline:2px solid ${RIM};outline-offset:2px}:root:has(.dl-her.on) .dl-her-pfp{display:none}`;

/** groundOf(light): a portrait's ground, the owner's light turned 150 degrees at one saturation and one lightness for everyone */
export function groundOf(hex) {
  const n = parseInt(String(hex || '#888888').replace('#', ''), 16) || 0, r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), ch = mx - Math.min(r, g, b);
  const h = ch === 0 ? 0 : mx === r ? ((g - b) / ch) % 6 : mx === g ? (b - r) / ch + 2 : (r - g) / ch + 4;
  return `hsl(${Math.round(((h * 60 + 150) % 360 + 360) % 360)} 55% 60%)`;
}
/** cutHex(picture): the standard's cut, a canvas: the picture inside the hexagon, its gold rim, the dark outside (out null: nothing outside, for a cell) */
export function cutHex(src, doc = document, px = PX, out = OUT) {
  const c = doc.createElement('canvas'), g = c.getContext('2d'), k = px / 960, path = () => { g.beginPath(); HEX.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x * k, y * k)); g.closePath(); };
  c.width = c.height = px; if (out) { g.fillStyle = out; g.fillRect(0, 0, px, px); } g.save(); path(); g.clip(); g.drawImage(src, 0, 0, px, px); g.restore();
  path(); g.strokeStyle = RIM; g.lineWidth = 16 * k; g.stroke(); return c;
}   /* THE ANGEL'S CUT (Nov 22 2026, THE EMPTY SCREENS SAY ONE STEP; seen on Harmony's Nucleus and its empty Characters): the standard's picture holds her face at a third of her frame, and its foot reaches the top of her thruster, lit white by her blaze and cut by the hexagon. cutFace is cutHex with her face FACE.zoom times closer about FACE.at (her eye's middle, as the empty screens' design cut her), so the hexagon holds her face alone; the standard's own picture and every other cut stand as they were */ export const FACE = Object.freeze({ zoom: 1.515, at: [.5, .396] }); export function cutFace(src, doc = document, px = PX, out = OUT) { const z = doc.createElement('canvas'), w = px / FACE.zoom; z.width = z.height = px; z.getContext('2d').drawImage(src, (px - w) * FACE.at[0], (px - w) * FACE.at[1], w, w, 0, 0, px, px); return cutHex(z, doc, px, out); }
const seedHex = (c, doc) => { const cv = doc.createElement('canvas'), g = cv.getContext('2d'), rg = g.createRadialGradient?.(32, 32, 4, 32, 32, 32); cv.width = cv.height = 64; if (rg?.addColorStop) { rg.addColorStop(0, c?.base || '#F6EFE1'); rg.addColorStop(.55, c?.coat || c?.light || '#C9A14A'); rg.addColorStop(1, groundOf(c?.light)); } g.fillStyle = rg || groundOf(c?.light); g.fillRect(0, 0, 64, 64); return cv; };
export async function stageHers(first, { win = window, doc = document, stage = null, px = PX } = {}) {
  const dp = px <= WALL_PX ? 160 : px, big = Math.round(dp * ZOOM), side = Math.min(3000, Math.max(384, px <= WALL_PX ? big : Math.round(big * .92))), host = doc.createElement('div'), sleep = (ms) => new Promise((ok) => win.setTimeout(ok, ms)), tick = () => Promise.race([new Promise((ok) => win.requestAnimationFrame(ok)), sleep(24)]);
  host.style.cssText = `position:fixed;left:0;top:0;width:${side}px;height:${side}px;opacity:0;pointer-events:none;z-index:-1;contain:strict`; host.setAttribute('aria-hidden', 'true'); doc.body.append(host);
  let T = POSE - 9500, her = null; const stop = () => { try { her?.stop?.(); } catch {} host.remove(); };
  try { stage ??= (await import('./dl-her-colours.js?v=her-3')).stageHer; her = await stage(host, { win, wishes: WISH.ladder(0), houseNow: () => T }); if (px <= WALL_PX) her.sharp?.(1); her.play?.(true); for (let k = 0; k < 3; k++) { T += 700; await tick(); } her.paint(first); for (let k = 0; k < 2; k++) { T += 700; await tick(); } T = POSE; await tick(); } catch (e) { stop(); throw e; }
  return { stop, rest: (still = true) => her.play?.(!still), draw(st) { her.paint(st); const pic = her.picture(big), c = doc.createElement('canvas'), g = c.getContext('2d'); c.width = c.height = dp; g.fillStyle = groundOf(st.light); g.fillRect(0, 0, dp, dp); g.drawImage(pic, (big - dp) / 2, (big - dp) / 2, dp, dp, 0, 0, dp, dp); return c; } };
}
export async function drawHers(list, { each = null, ...o } = {}) {
  const h = await stageHers(list[0], o), out = []; try { for (const [i, st] of list.entries()) { const c = h.draw(st); out.push(c); each?.(c, i); if (list.length > 1 && (i + 1) % 6 === 0) await new Promise((ok) => (o.win ?? window).setTimeout(ok, 0)); } return out; } finally { h.stop(); }
}
/** drawHer(st): her drawing for one config, a PX canvas */
export const drawHer = (st, o) => { const key = JSON.stringify([st.parts, st.painted, st.light]); if (last.key !== key) { last = { key, drawn: drawHers([st], o).then((l) => l[0]) }; last.drawn.catch(() => { last = {}; }); } return last.drawn; }; let last = {};   // the last drawing is kept: her face on the mint's stage (dl-mint-hexagon.js) and her hexagon's picture are one drawing
/** paintHer(drawing, pass): Reactor's painting of her drawing, an ImageBitmap, made in the painter's frame and nowhere else; the frame leaves with its answer */
export function paintHer(drawn, jwt, { win = window, doc = document, ms = 45000 } = {}) {
  return new Promise((ok, no) => {
    const f = doc.createElement('iframe'), end = (fn, v) => { win.clearTimeout(t); win.removeEventListener('message', on); f.remove(); fn(v); }, t = win.setTimeout(() => end(no, new Error('the painter did not answer')), ms);
    async function on(e) {
      if (e.source !== f.contentWindow) return; const d = e.data || {};
      try {
        if (d.her === 'ready') { const picture = await win.createImageBitmap(drawn); f.contentWindow.postMessage({ her: 'paint', jwt, prompt: PROMPT, hold: HOLD_MS, px: PX, picture }, '*', [picture]); }
        else if (d.her === 'painted') end(ok, await win.createImageBitmap(d.blob)); else if (d.her === 'failed') end(no, new Error(String(d.why).slice(0, 160)));
      } catch (er) { end(no, er); }
    }
    win.addEventListener('message', on); f.setAttribute('sandbox', 'allow-scripts'); f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
    f.style.cssText = 'position:fixed;left:0;top:0;width:4px;height:4px;border:0;opacity:0;pointer-events:none;z-index:-1'; f.src = new URL('./dl-her-portrait-frame.html', import.meta.url).href; doc.body.append(f);
  });
}
/** frameOf(hexagon): the transform [a, b, c, d, e, f] that lays the standard's 960 picture, centred, on a hexagon's own corners ({x, y, points} as it
 *  stands on the screen): its top corner on the highest corner, its right side on the side next to it, so the picture's rim is the hexagon's edge. Pure. */
export function frameOf({ x, y, points }) {
  let top = 0; points.forEach((p, i) => { if (p[1] < points[top][1]) top = i; });
  const at = (k) => points[(top + k + 6) % 6], mid = (p, q) => [(p[0] + q[0]) / 2 - x, (p[1] + q[1]) / 2 - y], m1 = mid(at(1), at(2)), m2 = mid(at(-1), at(-2)), B = m1[0] > m2[0] ? m1 : m2, A = [at(0)[0] - x, at(0)[1] - y];
  return [B[0] / 398.4, B[1] / 398.4, -A[0] / 460, -A[1] / 460, x, y];
}
/** mountHerPortrait(): hears the deposit, the sphere, her landing and her 'made'; -> {make(), fill(), state()} */
export function mountHerPortrait({ win = window, doc = document, fetcher = (...a) => win.fetch(...a), draw = drawHer, drawMany = drawHers, hold = stageHers, paint = paintHer,
  load = (url) => new Promise((ok, no) => { const im = new win.Image(); im.onload = () => ok(im); im.onerror = () => no(new Error('no picture')); im.src = url; }), now = () => win.performance.now() } = {}) {
  const flaskSeat = async () => { try { const s = await win.DL_FLASK_SEAT?.(); return s ? { 'x-seat': s } : {}; } catch { return {}; } }; const S = { signature: null, made: 0, url: null, painted: false, why: null, n: null, shown: false, own: null, wall: 0, count: null, wallWhy: null, kept: null, keptWhy: null }; const faces = new Map();   // faces: a deposit's signature -> its face, a tile
  let filling = false, a = null, sphere = win.genesisSphere ?? null, bornAt = null, down = null, rest = null, looked = 0, aim = 0, tries = 0, live = null, seen = '', seatAt = null, coming = false, bloomRaf = 0; const pages = new Map(), stood = new Map(), bornWall = new Map(), seeds = new Map();
  const give = () => sphere?.setSeatFace?.(face), bloom = () => { bloomRaf = 0; if (!bornWall.size) return; const t = now(); for (const [id, at] of bornWall) if (t - at >= 360) { bornWall.delete(id); seeds.delete(id); } give(); if (bornWall.size && typeof win.requestAnimationFrame === 'function') bloomRaf = win.requestAnimationFrame(bloom); }, root = doc.documentElement ?? { dataset: {}, style: { setProperty() {}, removeProperty() {} } }, back = () => { if (rest) sphere?.camera?.({ ...rest, ms: REVEAL.back }); rest = null; aim = 0; if (seatAt) { seatAt = null; delete root.dataset.herSeat; root.style.removeProperty('--her-seat-x'); root.style.removeProperty('--her-seat-y'); } };
  function face(ctx, seat) {   // the sphere's hook: a seat's hexagon as it stands this frame (a bronze's floating plate, a gold's top) takes its face
    const tile = faces.get(seat.id); if (!tile) return; const mine = seat.id === S.signature, wb = bornWall.get(seat.id), raw = mine && bornAt != null ? Math.min(1, (now() - bornAt) / BORN_MS) : wb != null ? Math.min(1, Math.max(0, (now() - wb) / 360)) : 1, k = raw >= 1 ? 1 : 1 - (1 - raw) ** 3, [x, y] = seat.mid, sd = k < 1 ? seeds.get(seat.id) : null;
    ctx.save(); ctx.transform(...frameOf({ x, y, points: seat.points })); if (sd) { ctx.globalAlpha = seat.show; ctx.drawImage(sd, -PX / 2, -PX / 2, PX, PX); } ctx.globalAlpha = seat.show * k; ctx.drawImage(tile, -PX / 2, -PX / 2, PX, PX); ctx.restore();
    if (!mine) { if (pages.has(seat.id)) stood.set(seat.id, seat.points); return; } S.shown = true; { const xs = seat.points.map((q) => q[0]), ys = seat.points.map((q) => q[1]); S.own = [Math.round(Math.max(...xs) - Math.min(...xs)), Math.round(Math.max(...ys) - Math.min(...ys)), Math.round(x), Math.round(y)]; }   /* her own hexagon as it stands this frame: its width, its height, its middle */
    const key = S.made + (live ? .5 : 0); if (seat.center && sphere?.camera && (looked !== key || aim === key)) { const c = doc.getElementById('genesis-sphere'), w = c?.clientWidth, h = c?.clientHeight, cs = sphere.cameraState?.();   /* THE CAMERA COMES TO HER FACE: the land law seats a deposit at the rim, edge-on and under the freeze's own pictures; the sphere is turned until her hexagon leans REVEAL.tilt from the visitor, and brought near, to the middle of the page; it goes back when her painting has stood */
      if (w && h && cs && !cs.moving) { const [cx, cy] = seat.center, b = c.getBoundingClientRect?.(), m = live && b ? doc.querySelector?.('.dl-her-stage')?.getBoundingClientRect?.() : null, zoom = m ? REVEAL.making : REVEAL.zoom, tx = m ? (m.left + m.width / 2 - b.left) * w / b.width : w * REVEAL.at[0], ty = m ? (m.top + m.height / 2 - b.top) * w / b.width : h * REVEAL.at[1];   /* in her making: behind her own body as she is coloured, nearer, so she stands inside her hexagon; after it: the middle of the page */
        if (looked !== key) { looked = aim = key; tries = 0; const dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy) || 1, R = seat.radius || r, t0 = Math.asin(Math.min(1, r / R)), first = !rest, d = first ? Math.max(0, t0 - REVEAL.tilt) : 0, q = (d ? R * Math.sin(t0 - d) / r : 1) * zoom / cs.zoom;   /* the sphere is turned once, at the first coming: a seat's plate floats off the sphere, so its lean cannot be read again from where it stands */
          rest ??= { zoom: cs.zoom, x: cs.x, y: cs.y, yaw: cs.yaw, pitch: cs.pitch }; sphere.camera({ zoom, yaw: cs.yaw + d * dx / r, pitch: cs.pitch - d * dy / r, x: cs.x + (tx - dx * q - cx) / w, y: cs.y + (ty - dy * q - cy) / h, ms: REVEAL.ms }); }
        else if (tries < REVEAL.tries && Math.hypot(tx - x, ty - y) > 6) { tries++; sphere.camera({ x: cs.x + (tx - x) / w, y: cs.y + (ty - y) / h, ms: 300 }); } } }   /* once it stands: the last of the way, measured; again while her seat is still coming to its place, REVEAL.tries times at most */
    if (live || seatAt) { const b = doc.getElementById('genesis-sphere')?.getBoundingClientRect?.(), q = b ? b.width / (doc.getElementById('genesis-sphere').clientWidth || b.width) : 1, at = b ? `${(100 * (b.left + x * q) / (win.innerWidth || b.width)).toFixed(1)}% ${(100 * (b.top + y * q) / (win.innerHeight || b.height)).toFixed(1)}%` : null;   /* HER SEAT IS SAID TO THE PAGE while the camera holds it (html[data-her-seat], --her-seat-x, --her-seat-y: the deposit lane's sheet opens her making's dark ground onto it) */
      if (at && at !== seatAt) { seatAt = at; root.dataset.herSeat = ''; root.style.setProperty('--her-seat-x', at.split(' ')[0]); root.style.setProperty('--her-seat-y', at.split(' ')[1]); } }
    if (k < 1) { ctx.save(); ctx.beginPath(); seat.points.forEach((q, i) => ctx[i ? 'lineTo' : 'moveTo'](q[0], q[1])); ctx.closePath(); ctx.globalAlpha = (1 - k) * seat.show; ctx.strokeStyle = '#fff6d8'; ctx.lineWidth = 2 + 8 * (1 - k); ctx.shadowColor = RIM; ctx.shadowBlur = 26 * (1 - k); ctx.stroke(); ctx.restore(); }   /* it comes in on a flash of the rim's gold */
    if (S.n) { const low = Math.max(...seat.points.map((q) => q[1])); ctx.save(); ctx.globalAlpha = seat.show * k; ctx.font = '600 10px "DM Sans", system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; try { ctx.letterSpacing = '3px'; } catch { /* an older canvas: its own spacing */ }
      ctx.fillStyle = '#7d5f1f'; ctx.fillText(`HEXAGON ${S.n}`, x + 1.5, low + 5); ctx.restore(); }   /* its number under it, in the freeze's small gold capitals */
    const c = doc.getElementById('genesis-sphere'), box = c?.getBoundingClientRect?.(); if (!a || !box) return;   /* the door over it: a press saves her portrait */
    const q = box.width / (c.clientWidth || box.width), r = Math.hypot(seat.points[0][0] - x, seat.points[0][1] - y) * q * 0.86; a.hidden = false; a.style.left = `${box.left + x * q - r}px`; a.style.top = `${box.top + y * q - r}px`; a.style.width = a.style.height = `${2 * r}px`;
  }
  function show(c, painted, n) {
    cutHex(c, doc).toBlob((blob) => {
      if (!blob || n !== S.made) return; if (S.url) win.URL.revokeObjectURL(S.url); S.url = win.URL.createObjectURL(blob); S.painted = painted;
      if (!a) { if (!doc.getElementById('dl-her-pfp-css')) { const s = doc.createElement('style'); s.id = 'dl-her-pfp-css'; s.textContent = CSS; doc.head.append(s); }
        a = doc.createElement('a'); a.className = 'dl-her-pfp'; a.hidden = true; doc.body.append(a); }
      a.href = S.url; a.download = S.n ? `swarmy-${S.n}.png` : 'swarmy.png'; a.setAttribute('aria-label', `${S.n ? `Your hexagon, number ${S.n}` : 'Your hexagon'}. Save your Swarmy's portrait.`); a.dataset.painted = String(painted);
      if (S.signature) { faces.set(S.signature, cutHex(c, doc, PX, null)); bornAt = now(); give(); win.setTimeout?.(give, BORN_MS + 60); }   // on the visitor's own hexagon; one more frame when it has come in
      doc.dispatchEvent(new win.CustomEvent(PORTRAIT, { detail: { url: S.url, painted, hexagon: S.n, signature: S.signature, picture: S.signature ? `${PASS_PATH}/${S.signature}` : null } }));   /* picture: where the house serves this deposit's painting once it is kept (a profile's picture) */
    }, 'image/png');
  }
  /* HER COLOURS ARE GIVEN INSIDE HER OWN HEXAGON (his Nov 11 2026, relayed by the deposit's seat: "i like the lyssajudron color thing, i think tbh we need to reconcile that and the hexs stuff", then "Yes, build it" on that seat's mock): when her making opens for a visitor whose deposit has a seat, her own painter is staged once more, small, and kept; her face stands on her seat as she is now and is drawn again at each colour; the camera comes to it and stays through her colouring; her 'made' starts from there */
  const leave = () => { const l = live; live = null; seen = ''; void l?.then((h) => h.stop(), () => {}); };
  function recolour() { const m = win.DL_HER?.state?.(), st = m?.st, key = st ? JSON.stringify([st.parts, st.painted, st.light]) : ''; if (!live) return; if (m?.open === false) { leave(); back(); return; } if (!st || key === seen) return; seen = key;
    void live.then((h) => { if (!live) return; faces.set(S.signature, cutHex(h.draw(st), doc, KEEP_PX, null)); bornAt ??= now(); give(); }, () => {}); }
  function come(left = 120) { if (left === 120) { if (coming) return; coming = true; } const m = win.DL_HER?.state?.(); if (live || !S.signature || S.made || left <= 0) { coming = false; return; } if (!m?.open || !m.st) { win.setTimeout?.(() => come(left - 1), 250); return; } coming = false;   /* her making opens a moment after its word: asked again for 30 s at most */
    live = hold(m.st, { win, doc, px: KEEP_PX }); void live.then((h) => { h.rest?.(); recolour(); }, (e) => { live = null; S.why = String(e?.message || e).slice(0, 160); }); }
  async function fill() {
    if (filling) return; filling = true; S.wallWhy = null;
    try { const r = await fetcher(PASS_PATH), b = r.ok ? await r.json().catch(() => null) : null; if (Number.isInteger(b?.count)) S.count = b.count;
      const list = (b?.hexagons || []).filter((h) => typeof h?.signature === 'string' && !faces.has(h.signature) && (typeof h.colours?.light === 'string' || typeof h.picture === 'string')).slice(0, WALL), drawn = [];
      for (const h of b?.hexagons || []) if (typeof h?.signature === 'string' && typeof h.handle === 'string' && /^[A-Za-z0-9_-]{1,32}$/.test(h.handle)) pages.set(h.signature, h.handle);
      const seat = (h, picture, flush = true, anim = true) => { if (h.signature === S.signature && S.url) return; if (anim && typeof win.requestAnimationFrame === 'function') bornWall.set(h.signature, now() + Math.min(240, faces.size * 10)); faces.set(h.signature, cutHex(picture, doc, WALL_PX, null)); S.wall = faces.size; if (flush) (bornWall.size && !bloomRaf && typeof win.requestAnimationFrame === 'function' ? bloom() : give()); };
      if (typeof win.requestAnimationFrame === 'function') { for (const h of list) if (h.colours) { const sd = cutHex(seedHex(h.colours, doc), doc, 96, null); seeds.set(h.signature, sd); faces.set(h.signature, sd); } if (faces.size) give(); }
      await Promise.all(list.map((h) => (typeof h.picture === 'string' ? Promise.resolve(load(h.picture)).then((im) => seat(h, im, false), () => drawn.push(h)) : void drawn.push(h)))); if (faces.size) (bornWall.size && !bloomRaf && typeof win.requestAnimationFrame === 'function' ? bloom() : give());
      if (drawn.length) await drawMany(drawn.map((h) => ({ parts: Object.fromEntries(PARTS.map((k) => [k, h.colours[k]])), painted: [...PARTS], light: h.colours.light, gaze: null, sel: 'light' })), { win, doc, px: WALL_PX, each: (c, i) => seat(drawn[i], c, (i + 1) % 6 === 0 || i === drawn.length - 1) });
    } catch (e) { S.wallWhy = String(e?.message || e).slice(0, 160); } finally { filling = false; }
  }
  const keep = (c) => new Promise((ok) => { const small = doc.createElement('canvas'); small.width = small.height = KEEP_PX; small.getContext('2d').drawImage(c, 0, 0, KEEP_PX, KEEP_PX);   // the house keeps her picture (her drawing, then her painting over it), for everyone's sphere and her profile
    small.toBlob((blob) => { if (!blob) return ok(); flaskSeat().then((x) => fetcher(`${PASS_PATH}/${S.signature}`, { method: 'PUT', headers: { 'content-type': 'image/jpeg', ...x }, body: blob })).then(async (r) => { const b = await r.json().catch(() => null); if (r.ok) S.kept = b?.picture ?? null; S.keptWhy = r.ok ? null : String(b?.error?.message || `not kept (${r.status})`).slice(0, 160); }, (e) => { S.keptWhy = String(e?.message || e).slice(0, 160); }).then(ok); }, 'image/jpeg', 0.86); });
  async function make() {
    const st = win.DL_HER?.state?.().st, n = ++S.made; leave(); if (!st) { S.why = 'no colours'; return; } S.why = null; S.shown = false; if (a) a.hidden = true;
    try {
      const pass = S.signature ? flaskSeat().then((x) => fetcher(PASS_PATH, { method: 'POST', headers: { 'content-type': 'application/json', ...x }, body: JSON.stringify({ signature: S.signature, colours: { light: st.light, ...st.parts }, name: (() => { try { return win.localStorage.getItem('dl.her.born') ?? undefined; } catch { return undefined; } })() }) })).then(async (r) => ({ ok: r.ok, status: r.status, body: await r.json().catch(() => null) })).catch((e) => ({ ok: false, status: 0, body: { error: { message: String(e?.message || e) } } })) : null;
      const drawn = await draw(st, { win, doc }), p = await pass; if (n !== S.made) return;
      S.n = Number.isInteger(p?.body?.hexagon) ? p.body.hexagon : null; show(drawn, false, n); void fill(); const held = p && S.n ? keep(drawn) : Promise.resolve();   // her drawing is her picture at once: a profile's picture never waits on the painter
      if (!p) { S.why = 'no deposit in this visit'; return; }   // her drawing is made and can be saved; it has no hexagon to stand on
      if (!p.ok || !p.body?.jwt) { S.why = String(p.body?.error?.message || `no pass (${p.status})`).slice(0, 160); return; }
      const painted = await paint(drawn, p.body.jwt, { win, doc }); if (n !== S.made) return; show(painted, true, n); void held.then(() => keep(painted));
    } catch (e) { S.why = String(e?.message || e).slice(0, 160); } finally { win.setTimeout?.(() => { if (n === S.made) back(); }, S.painted ? REVEAL.hold : 2 * REVEAL.hold); }
  }
  doc.addEventListener('click', (e) => {   // a press on someone's face opens their page (their tracenet, /<handle>); a press on a link or a button is that link's or button's
    if (!stood.size || e.target?.closest?.('a,button,[role=button],input,textarea,form,label') || (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5)) return;   /* a drag turns the sphere and opens nothing */ const c = doc.getElementById('genesis-sphere'), box = c?.getBoundingClientRect?.(); if (!box) return;
    const q = (c.clientWidth || box.width) / box.width, x = (e.clientX - box.left) * q, y = (e.clientY - box.top) * q, inside = (pts) => { let on = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) if ((pts[i][1] > y) !== (pts[j][1] > y) && x < (pts[j][0] - pts[i][0]) * (y - pts[i][1]) / (pts[j][1] - pts[i][1]) + pts[i][0]) on = !on; return on; };
    for (const [id, pts] of stood) if (inside(pts)) { win.location.assign(`/${pages.get(id)}`); return; }
  });
  doc.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; }, true); for (const t of ['pointerup', 'keyup', 'input']) doc.addEventListener(t, () => { if (live) for (const ms of [60, 400, 1000, 2000, 3200]) win.setTimeout?.(recolour, ms); }, true);   /* a colour is given by a press, a key or the die (which paints for a moment): her seat is asked again after each */
  doc.addEventListener(POURING, (e) => { if (typeof e.detail?.signature === 'string') S.signature = e.detail.signature; });
  doc.addEventListener(SEEN_EVENT, (e) => { if (e.detail?.type === MADE) void make(); else if (['entered', 'egg', 'landed'].includes(e.detail?.type)) void fill(); if (e.detail?.type === 'landed' || e.detail?.type === 'given') come(); });   // 'entered', 'egg': the swarm's faces are there while she speaks of the swarm (her twelve lines, about 32 s) and while the visitor pays
  win.addEventListener?.('genesis-sphere', (e) => { sphere = e.detail; if (faces.size) give(); });
  doc.addEventListener('dl-tank-filled', () => come());
  return { make, fill, state: () => ({ ...S, live: !!live, seat: seatAt, pages: [...stood].map(([id, points]) => ({ handle: pages.get(id), points })) }) };   // pages: the faces that lead to a page, where each stood in the last frame
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') window.DL_HER_PORTRAIT = mountHerPortrait();
