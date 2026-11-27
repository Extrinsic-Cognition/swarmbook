// dl-hexagon.js: THE HEXAGON PATH (Nov 22 2026, lane/the-hexagon-path). His words, UTC, over red's first press beside blue's: "you cant compare the quality of the pentagon path vs this hexagon
// path... it is so fucking suboptimal dude"; then, over this move filmed on the page: "Yes, build it". The mirror of blue's press (dl-side-press.js), and the whole of red's road on this one page:
//   1. THE PRESS on her red plate while her egg is offered. The words fade, a red night comes up behind the ball, blue leaves as red leaves on blue's press, she steps down, and her egg stays where
//      her hands held it, then lifts. The plate's hexagon goes round the archer, the ball's star circle as it is drawn (roundOf); the egg comes in, and it lands with a swell of light.
//   2. THE DIVE. The ball comes forward, the hexagon's edges pass the glass, its inside darkens, and behind it stands her making, free (dl-athena.js hand: no fall, no flash, nothing made or paid).
//      One egg all the way: this one lands on the egg her making's own entrance shakes, then gives its place to it.
//   3. ENTER THE WORLD. Her making says 'world' here, never 'made' (dl-her-colours.js), so no freeze, no film card and no second drawing of her come. The archer stands close, the hexagon comes back
//      round him; the arrow is let go on a second muted copy of the film, the ball opens into its hexagons, and her face, drawn while she was coloured, lands in the middle, its rim gold.
//   4. TWO PLATES beside the ball, under it on a tall glass: her face on X (a link, opened by the visitor alone), and the ride: Harmony's installer for this desktop once a published release names it (dl-harmony-doors.mjs rideTo), else no link and no press. The page is given back.
// The page's own film and its song are never sought, played or paused here (CLAUDE.md, The rule, 8). Anything missing (reduced motion, a new-tab press, no offer, no ball, no making): the plain link.
// COST: one listener at rest. From the press to her making no script a frame: every layer, the ball in the dive too, is a transform or an opacity on the compositor, and the ball stands undrawn under her
// making. While she is coloured, her portrait's painter (one hidden canvas) draws her face once a colour is let go. Then the sphere's own camera goes out, the film's second copy drives the ball to
// 143.8 s, and nothing runs after it.
import { EGG, ATHENA_POSE } from './dl-athena.mjs';
import { startWhenSeekable } from './dl-twelve-clock.js?v=skip-waits-1';
import { herLink, INTENT } from './dl-her-reel.mjs';

export const WORLD = 'world';   // her making's word when she enters the world on this path (dl-her-colours.js)
/** Every time of the path in ms: from the press, from the dive, from her Enter. */
export const PRESS = Object.freeze({ rim: 120, way: 1300, egg: 1650, land: 1500, dive: 2500 });
export const DIVE = Object.freeze({ pass: 1250, open: 700, hand: 330, dim: 260, clear: 1750, still: 1500, settle: 4350, painter: 6400 });
export const END = Object.freeze({ back: 1080, loose: 1650, out: 2000, face: 3150, plates: 4200 });
export const FILM = Object.freeze({ from: 120.67, to: 143.8 });   // the drawn arrow's frame, and the film's last second here: its golden rays, before the black
const ROUND = 1.4, CLOSE = .47, EGG_IN = 1.18, EGG_HER = .36 * .82, INNER = .375;   // the hexagon's radius round the star's, and close, in the window's smaller side; the egg's height in the hexagon, and in her making (dl-her-entrance.css); her stage's own hexagon
const STAR = .34, RING = .48, TURN = Math.PI / 3;   // the star's circle with no window, in the ball's radius (warm-sphere.js drawStar); the opened ball with its orbits, in the stage's smaller side
const RED = '#ff4a5f', GOLD = '#f0cf74';

/** flightOf(points): a regular hexagon as the group draws it: its middle, its radius, and its turn from point up, the shortest, in degrees. Pure. */
export function flightOf(points) {
  const [x, y] = [0, 1].map((k) => points.reduce((s, p) => s + p[k], 0) / points.length), r = points.reduce((s, p) => s + Math.hypot(p[0] - x, p[1] - y), 0) / points.length;
  const off = Math.atan2(points[0][1] - y, points[0][0] - x) + Math.PI / 2, turn = off - TURN * Math.round(off / TURN - 1e-9);
  return { x, y, r, turn: turn * 180 / Math.PI };
}
/** roundOf(view, cam, box, wide): the circle the sphere draws its star in, on the window: `wide` its share of the ball's radius while the mint window is whole. Pure. */
export function roundOf(view, cam, box, wide) {
  const cross = view?.mint?.cross ?? 0;
  return { x: box.left + box.width * (.5 + cam.x), y: box.top + box.height * (.5 + cam.y), r: Math.min(box.width, box.height) * view.radius * cam.zoom * (STAR + (wide - STAR) * cross) };
}
/** stageOf(w, h, plate): where the ending stands on a stage of w by h: the ball's middle, its camera, her face's radius, and the plates beside it or under it. Pure. */
export function stageOf(w, h, plate) {
  const under = w < 700 || w < 1.25 * h, small = Math.min(w, h), ring = under ? Math.min(.45 * w, .3 * h) : Math.min(.4 * h, w / 2 - plate - .022 * w - 40), y = under ? .38 : .46;
  return { under, x: w / 2, y: h * y, ring, face: ring * (under ? .52 : .45), camera: { zoom: ring / (RING * small), x: 0, y: y - .5 } };
}
/** past(w, h): the radius at which a hexagon's edges are all outside a window of w by h. Pure. */
export const past = (w, h) => .6 * Math.hypot(w, h) / Math.cos(TURN / 2);
/** postOf(st, spent): X's own compose door with the link to her, the page's own word for her; nothing is sent until the visitor posts. Pure. */
export const postOf = (st, spent = 0) => `${INTENT}?${new URLSearchParams({ text: herLink(st, spent) })}`;

const HEX = Array.from({ length: 6 }, (_, i) => [Math.sin(i * TURN), -Math.cos(i * TURN)]), PAD = 1.24;
/** lineOf(name, radius, width, colour): one drawn hexagon, point up, `radius` px: a line `width` px wide and its light, as strokes of it: painted once, then only moved. */
export function lineOf(name, radius, width, colour) {
  const points = HEX.map((p) => p.map((v) => (v * radius).toFixed(1)).join(',')).join(' '), side = 2 * PAD * radius;
  const stroke = (k, a) => `<polygon points="${points}" stroke="${colour}" stroke-width="${(width * k).toFixed(2)}" stroke-opacity="${a}"/>`;
  const light = name === 'glyph' ? '' : Array.from({ length: 14 }, (_, i) => stroke(13 * (1 - i / 14) ** 1.6 + 1, .012 + .004 * i)).join('');
  return `<svg class="${name}" viewBox="${-side / 2} ${-side / 2} ${side} ${side}" style="width:${side}px;height:${side}px;margin:${-side / 2}px" fill="${name === 'dark' ? '#0b0710' : 'none'}" stroke-linejoin="round">${name === 'dark' ? `<polygon points="${points}"/>` : light + stroke(1, 1)}</svg>`;
}
/** at(x, y, turn, scale): where the group of drawn hexagons stands. Pure. */
export const at = (x, y, turn, scale) => `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${turn.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

// the pieces the path stands on, the page's own instances: the ball, her portrait's painter, her making's renderer, the swarm's rite
const PIECES = () => Promise.all([import('./warm-sphere.js?v=mint-3'), import('./dl-her-portrait.js?v=portrait-4'), import('./dl-her-colours.js?v=her-3'), import('../lab/rite-unit1s.js?v=mint-2')])
  .then(([ball, portrait, making, rite]) => ({ ball, portrait, making, rite }));
export function mountHexagon({ win = window, doc = document, pieces = PIECES } = {}) {
  const root = doc.documentElement, $ = (sel) => doc.querySelector(sel), S = { stage: null, log: [], why: null }, left = [], timers = [];
  let mods = null, t0 = 0, zooming = null, painter = null, face = null, faceKey = '', film = null, land = null;
  const note = (what) => S.log.push([what, Math.round(win.performance.now() - t0)]);
  const enter = (stage) => { S.stage = root.dataset.hexagon = stage; note(stage); };
  const later = (ms, fn) => timers.push(win.setTimeout(fn, ms));
  const make = (tag, cls, into = doc.body) => { const el = doc.createElement(tag); el.className = cls; el.setAttribute('aria-hidden', 'true'); into.append(el); left.push(el); return el; };
  const anim = (el, frames, ms, o = {}) => el.animate(frames, { duration: ms, fill: 'both', ...o });
  const show = (el, frames, ms, o) => el && anim(el, frames.map((opacity) => ({ opacity })), ms, o);
  // while her egg is still hers to take back (the press to the hand-over) nothing under the move hears a scroll, a finger or a key: her entrance would read on, or ask
  const quiet = (e) => { if (e.metaKey || e.ctrlKey || e.altKey) return; e.stopImmediatePropagation(); e.preventDefault(); };
  const hush = (on) => { for (const type of ['wheel', 'touchmove', 'keydown']) win[on ? 'addEventListener' : 'removeEventListener'](type, quiet, { capture: true, passive: false }); };
  function undo() {   // back by the browser before her egg was handed over: the split as she left it
    for (const t of timers.splice(0)) win.clearTimeout(t); for (const el of left.splice(0)) el.remove();
    zooming?.cancel(); hush(false); root.removeAttribute('data-hexagon'); S.stage = null; win.genesisSphere?.setPaused?.(false); win.genesisSphere?.camera?.(null);
  }
  const ready = () => (mods ??= pieces().then((m) => (mods = m), (e) => { S.why = String(e?.message ?? e); mods = null; }));   // asked for as she offers her egg, when the page holds them all
  doc.addEventListener('dl-athena', (e) => { if (e.detail?.type === 'egg') void ready(); else if (e.detail?.type === WORLD) world(); });
  win.addEventListener('pageshow', (e) => { if (e.persisted && (S.stage === 'go' || S.stage === 'in' || S.stage === 'deep')) undo(); });

  // ---- 1. the press ----
  doc.addEventListener('click', (e) => {
    const plate = e.target?.closest?.('a.dl-flask-plate[data-side="flask"]'); if (!plate || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (S.stage) { e.preventDefault(); return; }
    const ball = win.genesisSphere, canvas = doc.getElementById('genesis-sphere'), stage = doc.getElementById('sphere-stage'), hers = $('.dl-athena-portrait'), glyph = $('#dl-sides .flask polygon'), m = glyph?.getScreenCTM?.();
    const asked = root.hasAttribute('data-egg-offered') && root.dataset.herMaking === 'waiting' && !win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (!asked || !win.dlAthena?.hand || !win.DL_HER || !mods?.ball || !ball?.camera || !canvas || !stage || !m || !hers?.animate) return;
    e.preventDefault(); t0 = win.performance.now(); S.log.length = 0;
    const w = win.innerWidth, h = win.innerHeight, from = flightOf([...glyph.points].map((p) => { const q = p.matrixTransform(m); return [q.x, q.y]; }));
    const round = roundOf(ball.getViewState(), ball.cameraState(), canvas.getBoundingClientRect(), mods.ball.MINT_WINDOW.star);
    const hex = ROUND * round.r, close = CLOSE * Math.min(w, h), zoom = close / hex, thick = Math.min(1, Math.max(.6, close / 420));
    make('i', 'dl-hexagon-night', stage); stage.prepend(left.at(-1));
    const rim = make('div', 'dl-hexagon-rim');
    rim.innerHTML = lineOf('dark', close, 0, '') + lineOf('glyph', close, 1.6 * close / from.r, '#fff') + lineOf('far', close, 4 * thick * zoom, RED) + lineOf('swell', close, 10 * thick * zoom, '#ff8a6a') + lineOf('near', close, 5 * thick, RED);
    const line = (name) => rim.querySelector(`.${name}`);
    // her egg, laid over the one in her hands: drawn at the size it has in her making, so it is sharp all the way
    const pr = hers.getBoundingClientRect(), [bx, by, bw, bh] = EGG.box, kx = pr.width / ATHENA_POSE[0], ky = pr.height / ATHENA_POSE[1], tall = EGG_HER * h;
    const hands = { x: pr.left + (bx + bw / 2) * kx, y: pr.top + (by + bh / 2) * ky, k: bh * ky / tall };
    const egg = make('div', 'dl-hexagon-egg'), src = EGG.src.href, broad = tall * bw / bh;
    egg.style.cssText = `width:${broad}px;height:${tall}px;margin:${-tall / 2}px ${-broad / 2}px`;
    egg.innerHTML = `<img src="${src}" alt=""><img class="lit" src="${src}" alt="">`;
    const eggAt = (x, y, k, turn = 0) => ({ transform: at(x, y, turn, k) }), held = EGG_IN * hex / tall;
    const way = [hands.x + (round.x - hands.x) * .35 - 24 * Math.min(1, w / 1440), hands.y + (round.y - hands.y) * .7, (hands.k + held) / 2, -8];
    anim(egg, [{ ...eggAt(hands.x, hands.y, hands.k), offset: 0 },
      { ...eggAt(hands.x, hands.y + 8, hands.k * .97), offset: .26, easing: 'cubic-bezier(.3,.1,.2,1)' },
      { ...eggAt(...way), offset: .64, easing: 'cubic-bezier(.4,0,.2,1)' },
      { ...eggAt(round.x, round.y, held), offset: 1 }], PRESS.egg);
    anim(rim, [{ transform: at(from.x, from.y, from.turn, from.r / close) }, { transform: at(round.x, round.y, 0, 1 / zoom) }], PRESS.way, { delay: PRESS.rim, easing: 'cubic-bezier(.5,0,.15,1)' });
    const red = { delay: PRESS.rim + 250, easing: 'linear' }, lands = { delay: PRESS.land, easing: 'ease-out' };
    show(line('glyph'), [1, 1, 0], 900, red); show(line('far'), [0, 1], 800, red);
    show(line('swell'), [0, .95, 0], 620, lands); show(egg.querySelector('.lit'), [0, 1, 0], 700, lands); show(line('dark'), [0, .5], 900, lands);
    hush(true); enter('go'); later(PRESS.land, () => enter('in')); later(PRESS.egg + 60, warm);
    later(PRESS.dive, () => dive({ ball, canvas, rim, line, egg, eggAt, w, h, round, close, zoom, held, thick }));
  });

  async function warm() {   // her making's renderer made once, small and unseen, while nothing of the ball moves: what it compiles is there when her making opens in the dive
    const host = make('div', 'dl-hexagon-warm');
    try { (await mods.making.stageHer(host, { win })).stop(); } catch (e) { S.why = String(e?.message ?? e); }
    host.remove();
  }
  // ---- 2. the dive, and her making behind the hexagon ----
  function dive({ ball, canvas, rim, line, egg, eggAt, w, h, round, close, zoom, held, thick }) {
    enter('deep'); const ms = DIVE.pass, easing = 'cubic-bezier(.6,0,.25,1)', gone = past(w, h) * 1.08 / close;
    // the ball comes forward as one layer, nothing drawn on the way; once the inside is dark the sphere's own camera stands there and the layer is let go, in one frame
    ball.setPaused?.(true);
    zooming = anim(canvas, [{ transform: 'scale(1)' }, { transform: `scale(${zoom})` }], ms + 100, { easing: 'cubic-bezier(.65,0,.35,1)' });
    later(DIVE.still, () => { ball.camera({ zoom, ms: 0 }); ball.redraw(); win.requestAnimationFrame(() => zooming.cancel()); });
    anim(rim, [{ transform: at(round.x, round.y, 0, 1 / zoom) }, { transform: at(round.x, round.y, 0, gone) }], ms, { easing });
    show(line('near'), [0, 1], ms * .3); show(line('far'), [1, 0], ms * .4, { delay: ms * .2 }); show(line('dark'), [.5, .62], ms * .6);
    const hold = DIVE.open + DIVE.hand + DIVE.dim + 200, there = eggAt(w / 2, h / 2, 1);   // the move stands on at its end while her making is built: one that ends there falls back to the press's size until the page is free
    egg.style.transform = there.transform; anim(egg, [{ ...eggAt(round.x, round.y, held), easing: 'cubic-bezier(.5,0,.2,1)' }, { ...there, offset: DIVE.open / hold }, there], hold);
    later(DIVE.open, () => {
      hush(false); land = { zoom, close, thick, y: round.y, shift: 0 }; doc.addEventListener('pointerup', prepare, { once: true });
      win.dlAthena.hand(); enter('her');
      // her making's own egg comes up under this one, the same place and the same size, and this one's light leaves it: one egg, both clocks started in one frame
      show(egg, [1, 0], DIVE.dim, { delay: DIVE.hand }).onfinish = () => egg.remove();
      const stage = $('.dl-her-stage'); if (!stage) return;
      const x = stage.offsetLeft + stage.offsetWidth / 2, y = stage.offsetTop + stage.offsetHeight / 2;
      root.dataset.herSeat = ''; root.style.setProperty('--her-seat-x', `${x.toFixed(1)}px`); root.style.setProperty('--her-seat-y', `${y.toFixed(1)}px`);
      const inner = make('div', 'dl-hexagon-inner'); inner.innerHTML = lineOf('near', INNER * Math.min(w, h), 2.5 * thick, RED); inner.style.transform = at(x, y, 30, 1); $('.dl-her-veil').after(inner);
      const up = Math.max(y, close * 1.04) - round.y; if (up > -40) return;   // on a tall glass her stage stands above the ball's middle: as she settles there the archer comes behind her, his hexagon's room kept over him
      land.y += up; land.shift = up / canvas.clientHeight;
      later(DIVE.settle, () => { ball.setPaused?.(false); ball.setHeld?.(false); ball.camera({ zoom, y: land.shift, ms: 1050 }); });
      later(DIVE.settle + 1200, () => { ball.setHeld?.(true); ball.setPaused?.(true); });
    });
    later(DIVE.clear, () => { show(rim, [1, 0], 500).onfinish = () => rim.remove(); });
    later(DIVE.painter, prepare);
  }
  // her face, drawn while she is coloured: her portrait's own painter staged once, and one drawing after each colour is let go; and the film's second copy, loaded to the drawn arrow
  const coloured = () => { const st = win.DL_HER?.state?.(); return st?.whole ? st : null; };
  function prepare() {
    if (film) return;
    film = make('video', ''); film.muted = film.defaultMuted = true; film.playsInline = true; film.preload = 'auto'; film.hidden = true;
    film.src = doc.getElementById('dl-twelve-film')?.currentSrc ?? ''; startWhenSeekable(film, FILM.from);
    for (const type of ['pointerup', 'keyup', 'input']) doc.addEventListener(type, draw, true);
    const st = win.DL_HER.state().st, all = { ...st, painted: [...mods.portrait.PARTS], light: st.light ?? '#ffffff' };   // staged as one whole, so her eyes stand open whatever is coloured yet
    painter = mods.portrait.stageHers(all, { win, doc, px: 640 }).then((p) => { p.rest(); return p; }, (e) => { S.why = String(e?.message ?? e); return null; });
    draw();
  }
  let drawing = 0, queue = Promise.resolve();
  const frames = (n) => new Promise((ok) => { const next = () => (n-- > 0 ? win.requestAnimationFrame(next) : ok()); next(); });
  function draw() { win.clearTimeout(drawing); if (S.stage === 'her') drawing = win.setTimeout(paint, 700); }
  const paint = () => (queue = queue.then(async () => {   // one drawing at a time, of her as she is coloured now
    const p = await painter, st = coloured()?.st, key = st && JSON.stringify([st.parts, st.light]); if (!p || !st || key === faceKey) return;
    faceKey = key; p.rest(false); await frames(3);
    face = mods.portrait.cutHex(p.draw(st), doc, 640, null); p.rest(); note('her face');   // she stands at her portrait's instant for the picture, then rests again
  }).catch((e) => { S.why = String(e?.message ?? e); }));

  // ---- 3. Enter the world ----
  function world() {
    if (S.stage !== 'her' || !land) return;
    enter('world'); win.clearTimeout(drawing); prepare();
    for (const t of timers.splice(0)) win.clearTimeout(t);   // an Enter before her entrance was over: what it left to do is done
    for (const el of left) if (el.matches('.dl-hexagon-rim,.dl-hexagon-egg,.dl-hexagon-warm')) el.remove();
    for (const type of ['pointerup', 'keyup', 'input']) doc.removeEventListener(type, draw, true);
    const ball = win.genesisSphere, stage = doc.getElementById('sphere-stage'), w = stage.clientWidth, h = stage.clientHeight, pad = stage.getBoundingClientRect().top, her = win.DL_HER.state(), { close, thick, y: y0 } = land;
    // from here the ball is the ending's alone: the wall's word and the page's film, which stand where they stood, no longer move it
    const own = {}; for (const k of ['setMoment', 'setMintWindow', 'setHeld', 'setStar', 'setChairs']) { own[k] = ball[k]; ball[k] = () => {}; }
    own.setHeld(true); ball.setPaused?.(true); ball.camera({ zoom: land.zoom, x: 0, y: land.shift, ms: 0 });
    later(END.back, () => { delete root.dataset.herSeat; root.style.removeProperty('--her-seat-x'); root.style.removeProperty('--her-seat-y'); });   // her making's dark ground leaves as it stood
    const layer = make('div', 'dl-hexagon-end', stage.parentElement); layer.removeAttribute('aria-hidden'); layer.style.top = `${stage.offsetTop - pad}px`;
    const plates = make('div', 'dl-hexagon-plates', layer); plates.removeAttribute('aria-hidden'); plates.innerHTML = platesOf(postOf(her.st, her.wishes?.spent ?? 0)); void import('./dl-harmony-doors.mjs?v=doors-2').then((m) => m.rideTo(plates.querySelector?.('[data-harmony-ride]'), { win })).catch(() => null);   // THE RIDE: the installer a published release names for this desktop, read once the plates are laid
    const lay = () => { const n = stageOf(stage.clientWidth, stage.clientHeight, Math.max(...[...plates.children].map((p) => p.offsetWidth))); return { ...n, y: n.y + pad }; };   // the layer stands from the window's own top: the stage begins a little under it
    const stand = (n) => { layer.dataset.under = String(n.under); layer.style.height = `${stage.clientHeight + pad}px`; layer.style.setProperty('--y', `${n.y}px`); layer.style.setProperty('--ring', `${n.ring}px`); };
    const s = lay(), k = s.face / close; stand(s);
    // the hexagon comes back from past the glass round him, holds, and goes with the ball to its place, its red turning gold
    const rim = make('div', 'dl-hexagon-rim', layer), out = { delay: END.loose, easing: 'cubic-bezier(.65,0,.35,1)' };
    rim.innerHTML = lineOf('near', close, 5 * thick, RED) + lineOf('gold', close, 5 * thick / k, GOLD);
    anim(rim, [{ transform: at(w / 2, y0, 0, past(w, h) * 1.15 / close) }, { transform: at(w / 2, y0, 0, 1) }], END.back, { easing: 'cubic-bezier(.2,0,.15,1)' });
    later(END.loose - 60, () => anim(rim, [{ transform: at(w / 2, y0, 0, 1) }, { transform: at(s.x, s.y, 0, k) }], END.out, { ...out, delay: 60 }));
    show(rim.querySelector('.near'), [1, .9, 0], END.out, out); show(rim.querySelector('.gold'), [0, .55, 1], END.out, out);
    later(60, paint);   // a colour given just before the press: the painting under way is this one's
    // the light of the arrow let go, whole on the frame the swarm goes home to the hexagons
    const flare = make('div', 'dl-hexagon-flare', layer); flare.style.setProperty('--at', `${y0}px`);
    anim(flare, [{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 0 }], 760, { delay: END.loose - 120, easing: 'ease-out' }).onfinish = () => flare.remove();
    later(500, () => ball.setPaused?.(false));   // her making gone, his glow burns on while the hexagon holds
    later(END.loose, () => { loose(ball, own); ball.camera({ ...s.camera, ms: END.out }); });
    later(END.face, async () => {
      await paint(); later(1200, async () => (await painter)?.stop()); if (!face) return;
      const el = make('div', 'dl-hexagon-face', layer), d = 2 * s.face * 960 / 920; el.style.cssText = `width:${d}px;height:${d}px;margin:${-d / 2}px`; el.append(face);
      anim(el, [{ opacity: 0, transform: at(s.x, s.y, 0, 2.6), easing: 'cubic-bezier(.2,1.3,.3,1)' }, { opacity: 1, offset: .12 }, { opacity: 1, transform: at(s.x, s.y, 0, 1) }], 1050);
      note('face');
    });
    later(END.plates, () => { plates.classList.add('on'); root.dataset.onTrack = ''; note('plates'); });   // THE ENDING IS THE PAGE (his Nov 26 2026 "why the fuck is this fucked up? it shouldnt scroll dude..."): the plates are its doors, and the page is held at its top (html[data-on-track]), first visit or not; it was given back here and a scroll showed the cream page under the hero
    win.addEventListener('resize', () => {   // a turned phone, a window pulled: the ending stands again where this glass has room for it
      const n = lay(), el = layer.querySelector('.dl-hexagon-face'); stand(n); ball.camera({ ...n.camera, ms: 0 });
      for (const [e, size] of [[rim, n.face / close], [el, n.face / s.face]]) {
        for (const a of e?.getAnimations() ?? []) a.cancel();
        if (e) { e.style.opacity = 1; e.style.transform = at(n.x, n.y, 0, size); }
      }
    });
  }
  function loose(ball, own) {   // the arrow is let go: the film's second copy in the star and in the twelve, the sphere on its seconds, to the golden rays
    const on = film?.readyState >= 2, rest = () => { film?.pause(); own.setHeld(true); for (const t of timers.splice(0)) win.clearTimeout(t); if (S.stage === 'world') enter('rest'); };
    const still = () => { own.setMoment(FILM.from + 3); later(8000, rest); };   // the film never came: the ball opens all the same, then rests
    own.setHeld(false); own.setMintWindow(false); note('arrow');
    if (!on) return still();
    own.setStar(film); own.setChairs(Array(12).fill(film)); mods.rite.mountRite({ film, view: { genesisSphere: ball } });   // the swarm is the film's too: it is loosed with the arrow, into her face
    const step = (t) => { own.setMoment(Math.max(FILM.from, t)); ball.redraw(); if (t >= FILM.to || film.ended) return rest(); ask(); };
    const ask = () => (film.requestVideoFrameCallback ? film.requestVideoFrameCallback((_, f) => step(f.mediaTime)) : win.requestAnimationFrame(() => step(film.currentTime)));
    ask(); film.play().catch(still); later(45000, rest);   // a film that stalls on the way rests where it stands
  }
  // ---- 4. the two plates: the split's own lettering and slashes; the ride is Harmony's installer once a published release names it (rideTo; the mint page's own doors stay commented out by his Oct 30 word) ----
  const words = (name, stamp) => `<i class="slash"></i><span class="lift"><span class="name">${name}</span><span class="stamp">${stamp}</span></span>`;
  const platesOf = (post) => `<a class="dl-flask-plate l" href="${post.replace(/&/g, '&amp;')}" target="_blank" rel="noopener">${words('Post your face', 'on 𝕏')}</a>`
    + `<a class="dl-flask-plate r" data-harmony-ride aria-disabled="true">${words('Ride', 'download Harmony')}</a>`;
  return (win.dlHexagon = { undo, state: () => ({ ...S, log: [...S.log], face: !!face, film: film ? { t: film.currentTime, paused: film.paused, ready: film.readyState } : null }) });
}
if (typeof window !== 'undefined' && typeof document !== 'undefined') mountHexagon();
