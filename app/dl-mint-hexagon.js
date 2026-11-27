// dl-mint-hexagon.js: THE HEXAGON'S OWN MINT, stop 8 of the red road (Nov 22 2026, lane/the-hexagon-is-minted). His words, UTC: Oct 21 17:06 "i would like the dodecahedron there to start doing
// goldberg expansion as the mints are happening on solana"; 19:40 "when that animation is played by the first buyer there are 0 hexs and 0 liquor... but the 10th buyer has to be able to see the
// previous ones"; Nov 22 14:03 "snowtracers aka eligible tracenettters gotta mint the tracenet thing"; 14:08 "you should only allow the gold radial exp bar for people that minted their
// lyssajudrons"; then, over this road filmed on this page's own ball (Canvas, "Mint your hexagon"): "Yes, build it".
// WHERE: the mint page's deposit door (warm.html?door=deposit: html[data-hexmint], said by the page's first script), which the knock, the front, the board, the rules and X's and Stripe's roads back all
// open. The money, X and every answer stay dl-kit-deposit.js's: this module draws what they mean on the page's one ball and asks for nothing.
//   1. The ball as the mints made it: closed, the archer holding his arrow on its twelve, while none stands; else its first places, each holder's face on theirs. Before it her hexagon, as the knock
//      shows it, come from where the knock stood it: her face once her painter has drawn the colours this browser holds, her default Lyssajudron till then, never a blank (his Nov 23 13:10 UTC).
//   2. The door's own press and its two roads, as plates (dl-mint-hexagon.css). X first: no price stands before it.
//   3. dl-tank-pouring: what was paid pours into her hexagon's foot and climbs her rim. dl-tank-filled: the rim closes, the arrow is let go on a second muted copy of the film, the ball opens, the place the
//      land law gives her lights, the ball turns, she lands on it. Her number in the list, SNOWTRACER, and the gold ring of who minted, three pentagons lit, the fourth dark (embertide-scene gold.rs).
//   4. Two plates: the knock she came from (polis.js leaves it in this tab), or the wall; and her page. Her picture goes to the house by the page's own portrait (dl-her-portrait.js make). A person whose
//      colours are not in this browser is given their making once it has landed. A person who minted before stands landed at once.
// The page's own film and its song are never sought, played or paused here (CLAUDE.md, The rule, 8). Reduced motion: each state stands at once.
// COST: nothing on a page that is not the door. At rest nothing runs: no frame, no timer; the ball draws on a cause. While it moves, one drawing a frame of what stands over the ball, and the ball's own.
import { buildAssemblySkin } from './assembly-geometry.js';
import { worldOf, FILM_FRONT } from './dl-mint-ledger.js?v=flask-2';
import { DROPS_PATH } from './dl-kit-deposit.mjs';
import { frameOf, cutHex, drawHer, PORTRAIT } from './dl-her-portrait.js?v=portrait-4';
import { startWhenSeekable } from './dl-twelve-clock.js?v=skip-waits-1';

const TAU = Math.PI * 2, clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), seg = (t, a, d) => clamp((t - a) / d), mix = (a, b, k) => a + (b - a) * k, outC = (k) => 1 - (1 - k) ** 3, inOut = (k) => (k < .5 ? 4 * k ** 3 : 1 - (2 - 2 * k) ** 3 / 2), back = (k, s) => 1 + (s + 1) * (k - 1) ** 3 + s * (k - 1) ** 2;
/** Every time of the road in ms: from her coming, from the pour, and from the opening. */
export const T = Object.freeze({ come: 700, face: 620, climb: 4200, close: 520, grow: 1500, fly: 1600, land: 2850, number: 3100, stamp: 3360, pull: 4200, ring: 5000, pents: 5650, next: 6270, ends: 6300, rest: 7600 });
export const FILM = Object.freeze({ still: 143.81, from: 128.7, loose: 130.83, to: 131.1 });   // the sphere's second with no cosmos; the arrow at the archer's eye, its release (as she lands), and the last frame of it
/** The gold ring's law, as Harmony draws it (embertide-scene spool_glass.rs LAP, lit_at; gold.rs): its track's two ends in degrees, its radius in the ball's, the lit three's places, the next one's. */
export const RING = Object.freeze({ from: 46, to: 314, r: 166 / 150, lit: [90, 270, 106], at: 208 / 150, next: 323.5, pent: .4 / 150, dark: .46 / 150 });
const PENT = [[0, -44], [41.85, -13.6], [25.86, 35.6], [-25.86, 35.6], [-41.85, -13.6]], FACE = [[0, -34.2], [33.48, -9.88], [20.69, 29.48], [-20.69, 29.48], [-33.48, -9.88]], BLANK = '#f1ede2', GOLD = '#f0cf74', HER_DEFAULT = './assets/her-default.jpg';

/** asked(location): whether this visit is the mint's own stage: the deposit door, no Harmony's ask to spend, no house's address. Pure. */
export const asked = ({ search = '', hash = '' } = {}) => { const q = new URLSearchParams(search); return q.get('door') === 'deposit' && !q.has('grant') && !/^#house=/.test(hash); };
/** stageOf(w, h): the ball's middle and its radius in each state, and her hexagon's radius before it, in css px. Pure. */
export const stageOf = (w, h) => { const under = w < 700 || w < 1.45 * h, s = Math.min(w, h); return under ? { under, x: w / 2, y: .4 * h, ask: .37 * s, near: .44 * s, end: .32 * s, face: .225 * w } : { under, x: w / 2, y: .44 * h, ask: .288 * s, near: .39 * s, end: .28 * s, face: .158 * s }; };
/** rotated(p, yaw, pitch): a direction of the ball as the sphere turns it (warm-sphere.js rotate): x right, y up, z to the eye. Pure. */
export const rotated = ([a, b, c], yaw, pitch) => { const x = a * Math.cos(yaw) - c * Math.sin(yaw), z = a * Math.sin(yaw) + c * Math.cos(yaw); return [x, b * Math.cos(pitch) - z * Math.sin(pitch), b * Math.sin(pitch) + z * Math.cos(pitch)]; };
/** poseOf(face, [x, y]): the ball's turn that brings a hexagon to (x, y) of its disc, the least pitch, and how far from upright it then stands, in radians (its corner nearest the top). Pure. */
export function poseOf({ center, verts }, [wx, wy]) {
  const len = Math.hypot(...center), p = center.map((v) => v / len), wz = Math.sqrt(Math.max(0, 1 - wx * wx - wy * wy)), m = Math.hypot(wy, wz); if (Math.abs(p[1]) > m + 1e-9) return null;
  const a = Math.atan2(wz, wy), k = Math.acos(clamp(p[1] / m, -1, 1)), pitch = [a + k, a - k].map((q) => Math.atan2(Math.sin(q), Math.cos(q))).sort((q, r) => Math.abs(q) - Math.abs(r))[0];
  const zz = -wy * Math.sin(pitch) + wz * Math.cos(pitch), yaw = Math.atan2(p[0], p[2]) - Math.atan2(wx, zz), mid = rotated(center, yaw, pitch);
  const roll = verts.map((v) => { const q = rotated(v, yaw, pitch); return Math.atan2(q[0] - mid[0], q[1] - mid[1]); }).sort((q, r) => Math.abs(q) - Math.abs(r))[0];
  return { yaw, pitch, roll };
}
const both = (l) => [...l, ...l.filter(([x]) => x).map(([x, y]) => [-x, y])], NEAR = { wide: both([[.48, .14], [.4, .2], [.34, .28], [.54, .06], [.44, 0], [.2, .32], [0, .36], [.3, -.16], [0, -.3]]), under: both([[0, .34], [0, .42], [.14, .36], [.28, .3], [0, -.2], [0, -.4]]) };   // the last of each: where a place near the ball's pole can be brought
const FAR = { wide: [[.62, .34], [.66, .24], [.56, .44], [.7, .14], [.5, .5], [.6, .04], [.46, .36], [.2, .5], [0, .5], [.5, -.2], [.3, -.36], [0, -.4]], under: [[.4, .52], [.3, .58], [.5, .44], [.12, .6], [.56, .34], [0, .5], [.4, -.2], [0, -.4]] };
/** posesOf(face, under): where her hexagon stands as she lands and at rest: of the places kept for each, the one that stands her most upright and nearest the first, on one side of the ball. Pure. */
export function posesOf(face, under) {
  const best = (list) => list.map((at) => ({ at, ...poseOf(face, at) })).filter((p) => p.roll !== undefined && Math.abs(p.pitch) < 1.3).map((p) => ({ ...p, cost: Math.abs(p.roll) + .45 * Math.hypot(Math.abs(p.at[0]) - Math.abs(list[0][0]), p.at[1] - list[0][1]) })).sort((a, b) => a.cost - b.cost)[0] ?? { at: [0, 0], yaw: 0, pitch: 0, roll: 0 };
  const key = under ? 'under' : 'wide', near = best(NEAR[key]), side = near.at[0] < 0 ? -1 : 1; return { side, near, far: best(FAR[key].map(([x, y]) => [x * side, y])) };
}
/** climbOf(ms, full): how much of her rim the fuel has climbed, `ms` after the pour: it waits under the top until what was paid is counted (`full`: ms since). Pure. */
export const climbOf = (ms, full) => { const up = .92 * outC(seg(ms, 0, T.climb)); return full === null ? up : mix(up, 1, inOut(seg(full, 0, T.close))); };
/** backOf(kept, location): the knock this visit came from ({ href, name }), if this tab keeps one that leads to a society's page of this site; else the wall. Pure. */
export function backOf(kept, loc) {
  try { const k = JSON.parse(kept), u = new URL(k.href, loc.href); if (u.origin === loc.origin && /\/polis\.html$/.test(u.pathname) && /^#knock=\d+$/.test(u.hash) && typeof k.name === 'string') return { href: u.pathname + u.search + u.hash, name: k.name.slice(0, 40) }; } catch { /* none kept */ }
  return { href: './index.html#wall', name: 'choose a swarm' };
}
const plate = (doc, cls, name, stamp) => { const a = doc.createElement('a'); a.className = `dl-flask-plate ${cls}`; a.innerHTML = '<i class="slash" aria-hidden="true"></i><span class="lift"><span class="name"></span><span class="stamp"></span></span>'; a.querySelector('.name').textContent = name; a.querySelector('.stamp').textContent = stamp; return a; };
const hexPath = (g, r) => { g.beginPath(); for (let i = 0; i < 6; i++) g[i ? 'lineTo' : 'moveTo'](r * Math.sin(i * TAU / 6), -r * Math.cos(i * TAU / 6)); g.closePath(); }, poly = (g, pts, s = 1) => { g.beginPath(); pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x * s, y * s)); g.closePath(); };
const flaskStore = (win, key) => new Promise((ok) => { try { const o = win.indexedDB.open('dl-flask'); o.onupgradeneeded = () => o.transaction.abort(); o.onerror = () => ok(null); o.onsuccess = () => { try { const r = o.result.transaction('keys').objectStore('keys').get(key); r.onsuccess = () => { o.result.close(); ok(r.result ?? null); }; r.onerror = () => ok(null); } catch { ok(null); } }; } catch { ok(null); } });

export function mountMint({ win = window, doc = document, fetcher = (...a) => win.fetch(...a), draw = drawHer, cut = cutHex, load = (src) => new Promise((ok, no) => { const m = new win.Image(); m.onload = () => ok(m); m.onerror = no; m.src = src; }) } = {}) {
  const root = doc.documentElement, S = { at: {}, seats: [], mine: null, face: null, floor: null, pose: null, film: null, frame: 0, still: !!win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches, why: null };
  if (root.dataset.hexmint === undefined) return null;
  let G = null, canvas = null, own = null, faceOf = null, layer = null, label = null, skin = null, sprite = null, shown = null;
  const now = () => win.performance.now(), since = (k) => (S.at[k] === undefined ? -1 : now() - S.at[k]), whole = () => { const s = win.DL_HER?.state?.(); return s?.whole ? s.st : null; };
  const ours = () => { if (root.dataset.herMaking === 'waiting') root.dataset.herMaking = 'mint'; }; ours();   // a fill opens no making of its own here (dl-her-colours.js hears 'given' only while it waits): hers is opened once her hexagon has landed
  const seatsNow = (mine) => (mine && !S.seats.some((s) => s.signature === mine) ? [...S.seats, { signature: mine, slot: S.seats.length + 1, tier: 'bronze' }] : S.seats);
  const lay = () => { const w = worldOf(S.at.open === undefined ? S.seats.filter((s) => s.signature !== S.mine) : seatsNow(S.mine), FILM_FRONT); S.floor = { capacity: w.capacity, at: [...w].map(([signature, h]) => ({ signature, face: h.face })), n: new Map(seatsNow(S.mine).map((s, i) => [s.signature, s.slot ?? i + 1])) }; if (own && S.at.open === undefined) own.setSnapshot({ capacity: w.capacity, seats: [] }); wake(); };
  const me = () => S.floor?.at.find((h) => h.signature === S.mine)?.face ?? null;
  const wake = (ms = 60) => { S.until = Math.max(S.until ?? 0, now() + ms); if (!S.frame && G) { own.setHeld(false); S.frame = win.requestAnimationFrame(step); } };
  function step() { S.frame = 0; frame(); if (now() < S.until) S.frame = win.requestAnimationFrame(step); else { own.setHeld(true); G.redraw(); } }
  const film = () => (S.at.open === undefined ? doc.getElementById('dl-twelve-film') : S.film), moved = () => own?.setMoment(FILM.still + 1e-4 * (S.tick = (S.tick ?? 0) + 1));   // the sphere stages a film's frame once a second it is told (warm-sphere.js stagedFilm): a hair more says the film has moved
  const view = () => stageOf(canvas.clientWidth, canvas.clientHeight);

  function frame() {   // where everything stands now: the camera, the film's copy, the words
    const v = view(), o = since('open'), gone = S.still && o >= 0 ? 1e6 : o, z1 = inOut(seg(gone, 0, T.grow)), z2 = inOut(seg(gone, T.fly - 100, T.land - T.fly + 300)), z3 = inOut(seg(gone, T.pull, 1350)), st = G.getViewState(), small = Math.min(canvas.clientWidth, canvas.clientHeight);
    const R = mix(mix(mix(v.ask, v.ask * 1.06, z1), v.near, z2), v.end, z3), P = S.pose, turn = (to, from) => Math.atan2(Math.sin(to - from), Math.cos(to - from));
    const yaw = P ? mix(turn(P.near.yaw, st.yaw) * z2, turn(P.far.yaw, st.yaw), z3) : 0, pitch = P ? mix((P.near.pitch - st.pitch) * z2, P.far.pitch - st.pitch, z3) : 0;
    own.camera({ zoom: R / Math.max(1e-6, st.radius * small), x: 0, y: v.y / canvas.clientHeight - .5, yaw, pitch, ms: 0 }); G.redraw();
    if (film()?.paused === false) moved(); if (S.film && gone >= T.land - (FILM.loose - FILM.from) * 1000 && !S.loosed) { S.loosed = true; loose(S.film); }
    for (const [k, t] of [['number', T.number], ['stamp', T.stamp], ['ends', T.ends]]) if (gone >= t && layer.dataset[k] === undefined && (k === 'ends' || S.floor?.n.get(S.mine))) { layer.dataset[k] = ''; if (k === 'number') label.firstChild.textContent = `Hexagon ${S.floor.n.get(S.mine)}`; if (k === 'ends') void ends(); }
    if (gone >= T.land && layer.dataset.landed === undefined) layer.dataset.landed = '';
  }
  // ---- what stands over the ball, in its own frame (warm-sphere.js setOverlay) ----
  function over(g, o) {
    const [cx, cy] = o.center, R = o.radius, v = view(), t = now(), open = S.still && S.at.open !== undefined ? 1e6 : since('open'), hex = (f) => o.anchor(`hex:${f}`), mine = me(); shown = { cx, cy, R }; g.save();
    for (const h of S.floor?.at ?? []) { const a = hex(h.face); if (!a || a.z < .02 || h.signature === S.mine) continue; g.save(); g.globalAlpha = clamp(a.z * 5); poly(g, a.points); g.fillStyle = '#cfc3a4'; g.fill(); g.restore(); faceOf?.(g, { id: h.signature, points: a.points, mid: [a.x, a.y], show: clamp(a.z * 5) }); g.save(); g.globalAlpha = .1 + .2 * seg(open, 0, 1200); poly(g, a.points); g.fillStyle = '#0d070f'; g.fill(); g.restore(); }
    if (open >= 0) for (let i = 0, k = seg(open, 500, 1100); i < (S.floor?.capacity ?? 0); i++) { const a = hex(i); if (!a || a.z < -.35) continue; g.globalAlpha = .9 * k * (a.z > 0 ? .62 : .16); poly(g, a.points); g.strokeStyle = 'rgba(240,207,116,.62)'; g.lineWidth = 1.1; g.stroke(); } g.globalAlpha = 1;
    const seat = open >= 0 && mine !== null ? hex(mine) : null, landed = open >= T.land;
    if (seat && !landed && seat.z > -.1) { g.save(); g.globalAlpha = seg(open, 350, 700) * clamp((seat.z + .1) * 4); poly(g, seat.points); g.fillStyle = '#f6f2ea'; g.shadowColor = GOLD; g.shadowBlur = 20; g.fill(); g.restore(); }
    const pour = since('pour'), dim = pour >= 0 ? seg(pour, 0, 500) * (1 - seg(open, -1, 400)) : 0; if (dim > 0) { const q = g.createRadialGradient(cx, cy, R * .2, cx, cy, R * 1.5); q.addColorStop(0, `rgba(13,7,15,${.74 * dim})`); q.addColorStop(.7, `rgba(13,7,15,${.66 * dim})`); q.addColorStop(1, 'rgba(13,7,15,0)'); g.fillStyle = q; g.beginPath(); g.arc(cx, cy, R * 1.5, 0, TAU); g.fill(); }
    ring(g, cx, cy, R, open); hers(g, { v, cx, cy, R, open, seat, landed, pour });
    const answer = seg(open, T.land, 1000); if (answer > 0 && answer < 1) for (let i = 0; i < 12; i++) { const a = o.anchor(`pent:${i}`); if (!a || a.z < .02) continue; g.globalAlpha = .75 * Math.sin(Math.PI * Math.min(1, answer * 1.3)) * (1 - answer) * clamp(a.z * 3); poly(g, a.points); g.fillStyle = '#ffeab0'; g.fill(); }
    g.restore(); words(seat, v); return false;
  }
  function ring(g, cx, cy, R, open) {   // the gold ring of who minted
    const k = inOut(seg(open, T.ring, 900)); if (k <= 0) return; const r = R * RING.r, a = (d) => (d - 90) * TAU / 360, on = (d, q) => [q * Math.sin(d * TAU / 360), -q * Math.cos(d * TAU / 360)], head = mix(a(RING.from), a(RING.to), k);
    g.save(); g.translate(cx, cy); g.lineCap = 'round'; for (const [w, c] of [[R * .1, 'rgba(240,207,116,.07)'], [R * .047, 'rgba(240,207,116,.16)'], [1.6, 'rgba(240,207,116,.62)']]) { g.beginPath(); g.arc(0, 0, r, a(RING.from), head); g.strokeStyle = c; g.lineWidth = w; g.stroke(); }
    if (k < 1) glint(g, r * Math.cos(head), r * Math.sin(head), 34, .95);
    const n = seg(open, T.next, 420); if (n > 0) { const [x, y] = on(RING.next, r), s = R * RING.dark; g.save(); g.globalAlpha = n; g.translate(x, y); poly(g, PENT, s); g.fillStyle = 'rgba(18,10,20,.92)'; g.fill(); g.strokeStyle = 'rgba(240,207,116,.7)'; g.lineWidth = 1.6; g.stroke(); g.fillStyle = GOLD; g.font = `600 ${Math.round(26 * s)}px Gelasio,Georgia,serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('IV', 0, 1.5 * s); g.restore(); }
    RING.lit.forEach((d, i) => { const q = seg(open, T.pents + 210 * i, 420); if (q <= 0) return; const [x, y] = on(d, R * RING.at), s = R * RING.pent * back(q, 2.2); g.save(); g.globalAlpha = clamp(q * 3); if (q < 1) glint(g, x, y, 120 * R * RING.pent, .75 * (1 - q)); g.translate(x, y);
      const c = g.createLinearGradient(-44 * s, -44 * s, 44 * s, 44 * s); for (const [at, col] of [[0, '#fff4c9'], [.35, '#f3d27a'], [.7, '#c8962f'], [1, '#7a5413']]) c.addColorStop(at, col); poly(g, PENT, s); g.fillStyle = c; g.shadowColor = 'rgba(240,207,116,.65)'; g.shadowBlur = 16; g.fill(); g.shadowBlur = 0; const f = g.createLinearGradient(0, -34 * s, 0, 30 * s); for (const [at, col] of [[0, '#f9e29a'], [.45, '#e9c062'], [1, '#b98424']]) f.addColorStop(at, col); poly(g, FACE, s); g.fillStyle = f; g.fill(); g.restore(); });
    g.restore();
  }
  function glint(g, x, y, r, alpha) {   // one drawn light, laid where it is asked
    if (!sprite) { sprite = doc.createElement('canvas'); sprite.width = sprite.height = 64; const c = sprite.getContext('2d'), q = c.createRadialGradient(32, 32, 0, 32, 32, 32); q.addColorStop(0, 'rgba(255,246,214,1)'); q.addColorStop(.32, 'rgba(250,206,110,.5)'); q.addColorStop(1, 'rgba(240,190,96,0)'); c.fillStyle = q; c.fillRect(0, 0, 64, 64); }
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha *= alpha; g.drawImage(sprite, x - r, y - r, 2 * r, 2 * r); g.restore();
  }
  function hers(g, { v, cx, cy, R, open, seat, landed, pour }) {   // her hexagon: before the ball, beside it as it opens, on its place
    const come = S.still ? 1 : seg(since('come'), 0, T.come), F = v.face, side = S.pose?.side ?? 1, lift = inOut(seg(open, -120, 1250)), kf = inOut(seg(open, T.fly, T.land - T.fly));
    const aside = v.under ? [cx + side * .24 * canvas.clientWidth, cy + R * 1.02 + .06 * canvas.clientHeight] : [cx + side * R * 1.34, cy + R * .34], s = (F / 460) * mix(1, v.under ? .62 : .78, lift), x = mix(cx, aside[0], lift), y = mix(cy, aside[1], lift) - Math.sin(Math.PI * lift) * 26;
    let M = [s, 0, 0, s, x, y]; if (seat && kf > 0) { const N = frameOf(seat), arc = Math.sin(Math.PI * kf); M = M.map((q, i) => mix(q, N[i], kf) * (i < 4 ? 1 + .16 * arc : 1)); M[5] -= arc * (v.under ? 40 : 74); }
    const alpha = landed ? clamp((seat?.z ?? 0) * 6) : 1; if (alpha <= 0) return; const lit = landed ? .5 * (1 - seg(open, T.land, 900)) + .22 : .95;
    g.save(); g.transform(...M); g.globalAlpha = lit * come * alpha; const q = g.createRadialGradient(0, 0, 150, 0, 0, 720); q.addColorStop(0, 'rgba(240,207,116,.5)'); q.addColorStop(.5, 'rgba(214,44,62,.22)'); q.addColorStop(1, 'rgba(214,44,62,0)'); g.fillStyle = q; g.beginPath(); g.arc(0, 0, 720, 0, TAU); g.fill();
    const face = S.face ? (S.still ? 1 : seg(since('face'), 0, T.face)) : 0; g.globalAlpha = alpha; if (face < 1) { hexPath(g, 460); g.fillStyle = BLANK; g.fill(); } if (face > 0) { g.globalAlpha = alpha * face; g.drawImage(S.face, -480, -480, 960, 960); g.globalAlpha = alpha; }
    if (landed) { g.save(); g.globalAlpha = .9 * alpha * seg(open, T.land + 250, 900); hexPath(g, 462); g.strokeStyle = '#ffe9ae'; g.lineWidth = 15; g.lineJoin = 'round'; g.shadowColor = '#ffd676'; g.shadowBlur = 30; g.stroke(); g.restore(); }
    const k = pour >= 0 && open < 900 ? climbOf(pour, S.at.full === undefined ? null : since('full')) : 0;   // the fuel: up both sides of her rim, closed at the top
    if (k > 0) { const P = [[0, 460], [398.4, 230], [398.4, -230], [0, -460]], len = k * 3; g.globalAlpha = 1 - seg(open, 0, 900); g.lineJoin = g.lineCap = 'round'; g.beginPath(); for (const w of [1, -1]) { g.moveTo(0, 460); for (let i = 0; i < 3 && i < len; i++) { const e = clamp(len - i); g.lineTo(w * mix(P[i][0], P[i + 1][0], e), mix(P[i][1], P[i + 1][1], e)); } } g.shadowColor = '#ffd879'; g.shadowBlur = 40; g.strokeStyle = '#ffe7a6'; g.lineWidth = 30; g.stroke(); g.shadowBlur = 0; g.strokeStyle = '#fffaf0'; g.lineWidth = 10; g.stroke(); }
    g.restore();
    if (pour >= 0 && open < 0 && !S.still) { const bx = canvas.clientWidth / 2, by = canvas.clientHeight * (v.under ? .8 : .872), fx = x, fy = y + F * .99, full = S.at.full === undefined ? 0 : seg(since('full'), 0, T.close); g.save(); for (let i = 0; i < 120; i++) { const r1 = (i * .6180339887) % 1, r2 = (i * .7548776662) % 1, r3 = (i * .569840291) % 1, born = pour - 1500 * r1; if (born < 0) continue; const q = (born % 1500) / 1500, e = q * q * (2.2 - 1.2 * q); g.globalAlpha = Math.min(1, 5 * q) * Math.min(1, 6 * (1 - q)) * (1 - full); glint(g, mix(bx + (r2 - .5) * (v.under ? 230 : 430), fx, 1 - (1 - e) ** 1.7), by + 8 - (by - fy) * e, (2.6 + 4.6 * r3) * (v.under ? .85 : 1), 1); } g.restore(); glint(g, fx, fy, F * .5, .6 * Math.min(1, pour / 500) * (1 - full)); }
    const c = seg(open, -60, 820); if (open >= 0 && c < 1) { g.save(); g.translate(x, y); g.globalAlpha = (1 - c) ** 1.6; hexPath(g, F * (1 + 2.3 * outC(c))); g.strokeStyle = '#fff0c2'; g.lineWidth = 12 * (1 - c) + 1; g.shadowColor = GOLD; g.shadowBlur = 30; g.stroke(); g.restore(); }
    const d = seg(open, T.land - 40, 900); if (seat && d > 0 && d < 1) { g.save(); g.transform(...frameOf(seat)); g.globalAlpha = (1 - d) ** 1.4; hexPath(g, 460 * (1 + 1.5 * outC(d))); g.strokeStyle = '#fff6d8'; g.lineWidth = 60 * (1 - d) + 4; g.shadowColor = GOLD; g.shadowBlur = 40; g.stroke(); g.globalAlpha = .85 * (1 - d) ** 3; hexPath(g, 460); g.fillStyle = '#fff6d8'; g.fill(); g.restore(); }
  }
  function words(seat) { if (!label || !seat) return; const b = canvas.getBoundingClientRect(), low = Math.max(...seat.points.map((p) => p[1])); label.style.transform = `translate(${(b.left + seat.x).toFixed(1)}px,${(b.top + low + 8).toFixed(1)}px) translateX(-50%)`; label.style.visibility = seat.z > .08 ? '' : 'hidden'; }

  // ---- the page's words ----
  async function paint() {   // her face: the house's picture of her, or her painter's drawing of the colours this browser holds; till one comes, her default Lyssajudron (S.hers false), never a blank
    const st = whole(), hers = !!(S.picture || st); if (S.face && (S.hers || !hers)) return; try { const f = cut(S.picture ? await load(S.picture) : st ? await draw(st, { win, doc }) : await load(HER_DEFAULT), doc, 640, null); if (S.hers) return; S.at.face = S.face ? now() - T.face : now(); S.face = f; S.hers = hers; root.dataset.hexmintFace = ''; wake(T.face + 60); } catch (e) { S.why = String(e?.message ?? e).slice(0, 120); }
  }
  function pouring(sig) { if (S.at.pour !== undefined || S.at.open !== undefined) return; S.mine = sig ?? S.mine; S.at.pour = now(); root.dataset.hexmint = 'pour'; ours(); prepare(); wake(T.climb + 200); }
  function prepare() { if (S.film || S.still) return; const f = S.film = doc.createElement('video'); f.muted = f.defaultMuted = true; f.playsInline = true; f.preload = 'auto'; f.src = doc.getElementById('dl-twelve-film')?.currentSrc ?? ''; startWhenSeekable(f, FILM.from); }
  function filled(sig) { if (S.at.open !== undefined || S.at.full !== undefined) return; S.mine = sig ?? S.mine; if (S.at.pour === undefined) S.at.pour = now(); S.at.full = now(); wake(T.close + 1300); const at = now(), late = new Promise((ok) => win.setTimeout(ok, S.still ? 0 : 1200)); void Promise.race([list(), late]).then(() => win.setTimeout(opens, S.still ? 0 : Math.max(0, T.close - (now() - at)))); }   // her place is the list's, read once more
  function loose(f) { const stop = (t) => { if (t < FILM.to && f.requestVideoFrameCallback) return void f.requestVideoFrameCallback((_, m) => stop(m.mediaTime)); f.pause(); if (f.currentTime > FILM.to + .1) f.currentTime = FILM.to; moved(); wake(); }; f.play?.().catch?.(() => {}); stop(FILM.from); }   // the second copy alone, to its last golden frame
  const list = () => fetcher(`${DROPS_PATH}?after=0`).then((r) => r.json()).then((j) => { for (const d of j?.drops ?? []) if (!S.seats.some((s) => s.signature === d.signature)) S.seats.push({ signature: d.signature, slot: d.n, tier: d.tier === 'gold' ? 'gold' : 'bronze' }); }).catch(() => {});
  function place() { lay(); skin = buildAssemblySkin(S.floor.capacity); const f = me(); S.pose = f === null ? null : posesOf(skin.hexes[f], view().under); own.setSnapshot({ capacity: S.floor.capacity, seats: [] }); }   // the floor with her on it, and the turn that brings her place to the eye
  function opens() {   // the rim is closed: the ball opens, her place lights, she lands
    S.at.open = now(); root.dataset.hexmint = 'open'; place();
    if (S.film?.readyState >= 2) { own.setStar(S.film); own.setChairs(Array(12).fill(S.film)); } wake(S.still ? 300 : T.rest);
  }
  function stands(sig, picture) {   // this person minted before: landed at once
    S.mine = sig; S.picture = picture ?? null; S.still = true; S.at.pour = S.at.full = now(); opens(); void paint(); wake(200);
  }
  async function ends() {   // the two ways on; her picture to the house; or her making, for who has no colours here
    const b = backOf(read('dl-knock'), win.location), x = String(await flaskStore(win, 'handle') ?? await flaskStore(win, 'x') ?? '').replace(/^@/, ''); if (layer.querySelector('.dl-flask-plate')) return;
    if (/^[A-Za-z0-9_-]{1,32}$/.test(x)) { const p = plate(doc, 'blue l', 'Your page', `${win.location.hostname.replace(/^www\./, '')}/${x}`); p.href = `/${x}`; layer.append(p); } const k = plate(doc, 'r', 'Knock', b.name); k.href = b.href; layer.append(k); root.dataset.hexmint = 'rest';
    if (S.stood) return; if (whole()) { root.dataset.herMaking = 'made'; doc.dispatchEvent(new win.CustomEvent('dl-mint-made')); win.DL_HER_PORTRAIT?.make?.(); } else { root.dataset.herMaking = 'waiting'; win.DL_HER?.open?.('stop'); }
  }
  const read = (k) => { try { return win.sessionStorage.getItem(k); } catch { return null; } };
  doc.addEventListener('dl-tank-pouring', (e) => pouring(e.detail?.signature)); doc.addEventListener('dl-tank-filled', (e) => filled(e.detail?.signature));
  doc.addEventListener('dl-mint-hers', (e) => { const h = e.detail; if (!h?.counted || !h.colours) return; S.stood = true; if (G) stands(h.signature, h.picture); else S.stand = h; });
  doc.addEventListener(PORTRAIT, async (e) => { try { S.face = cut(await load(e.detail.url), doc, 640, null); S.hers = true; S.at.face = now() - (root.dataset.hexmintFace === undefined ? 0 : T.face); root.dataset.hexmintFace = ''; wake(T.face + 60); } catch { /* the drawing stands */ } });

  function begin(ball) {
    if (G || !(canvas = doc.getElementById('genesis-sphere'))) return; G = ball; own = {}; for (const k of ['setMoment', 'setMintWindow', 'setHeld', 'setStar', 'setChairs', 'setPaused', 'setRite', 'setPulse', 'setPour', 'setOverlay', 'setSeatFace', 'setSnapshot', 'setScene', 'camera', 'resetView']) { own[k] = (G[k] ?? (() => {})).bind(G); G[k] = () => {}; }   // from here the ball is the mint's alone: the wall's word, the page's film and the other scenes move it no more
    G.setStar = (s) => { if (S.at.open === undefined) own.setStar(s); }; G.setChairs = (l) => { if (S.at.open === undefined) own.setChairs(l); }; G.setSeatFace = (f) => { faceOf = f; wake(); }; G.setPour = (l) => { const d = l.filter((s) => s.order == null); if (S.at.open === undefined && d.length > S.seats.length) { S.seats = d; lay(); } };   // a mint the page hears while this one waits (dl-mint-pour.js)
    own.setMintWindow(false); own.setPaused(false); own.setRite(null); own.setPulse(null); own.setSeatFace(null); own.setPour([]); own.setMoment(FILM.still); own.setOverlay(over);
    layer = doc.createElement('div'); layer.className = 'hexmint'; label = doc.createElement('p'); label.className = 'hexmint-number'; label.setAttribute('role', 'status'); label.innerHTML = '<b></b><span>SnowTracer</span>'; layer.append(label); const rays = doc.createElement('i'); rays.className = 'hexmint-rays'; rays.setAttribute('aria-hidden', 'true'); (doc.getElementById('sphere-stage') ?? doc.body).prepend(rays); doc.body.append(layer);
    S.at.come = now(); root.dataset.hexmintOn = ''; ours(); lay(); wake(T.come + 400); if (S.stand) stands(S.stand.signature, S.stand.picture);
    for (const k of ['seeked', 'loadeddata', 'playing', 'pause']) doc.addEventListener(k, (e) => { if (S.at.open !== undefined || e.target?.id !== 'dl-twelve-film') return; moved(); wake(k === 'playing' ? 3400 : 400); win.setTimeout(moved, 200); }, true);   /* the page's film as the wall plays it to the drawn arrow and holds it, on the twelve */ win.addEventListener('resize', () => { if (S.pose && skin && me() !== null) S.pose = posesOf(skin.hexes[me()], view().under); wake(200); });
    void list().then(() => { if (S.at.open === undefined) lay(); else if (S.still) { place(); wake(300); } });
    const tries = (n) => { if (S.hers || n <= 0) return; void paint(); if (!S.hers) win.setTimeout(() => tries(n - 1), 900); }; tries(8);   // her making's module is the page's and may come after this one
  }
  if (win.genesisSphere) begin(win.genesisSphere); else win.addEventListener('genesis-sphere', (e) => begin(e.detail), { once: true });
  return (win.dlMintHexagon = { begin, state: () => ({ ...S, film: S.film ? { t: S.film.currentTime, paused: S.film.paused } : null, face: !!S.face, shown, number: label?.firstChild?.textContent ?? null }) });
}
if (typeof window !== 'undefined' && typeof document !== 'undefined') mountMint();
