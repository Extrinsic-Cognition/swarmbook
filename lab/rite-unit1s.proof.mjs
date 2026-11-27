#!/usr/bin/env node
// Summoned units delegate recursively while remaining visible parents. Run off-screen on a byte-range server, never python's http.server.
// node lab/rite-unit1s.proof.mjs --chrome <Chrome executable> --url <normal app/warm.html URL> --out <artifact directory>
// Node 22+; no packages. Pauses through the page's control before test seeks. Never touches sound or calls media.play/pause.
// Saves composited on/off/restored PNGs and a JSON receipt. Exit 0: checks pass; 1: regression; 2: setup/runtime failure.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

const args = process.argv.slice(2), opt = key => { const i = args.indexOf(key); return i < 0 ? null : args[i + 1]; };
const CHROME = opt('--chrome'), URL_ = opt('--url'), OUT = opt('--out');
// 122: THE FORMATION, each swarm a hexagon of birds on its hex; 129.6: THE VOLLEY, the swarms in flight into the sphere's centre
const TIMES = (opt('--at') || '78,85,96,100.25,101.3,103,106.5,108,122,125,129.6,145').split(',').map(Number);
const MUSIC_TIMES = [85, 92, 104.6, 125, 145];   // 104.6: the birds open, the last second before the film takes the stage
const [W, H] = (opt('--size') || '1512x945').split('x').map(Number);
if (!CHROME || !URL_ || !OUT) { console.error('Required: --chrome <executable> --url <warm.html> --out <directory>'); process.exit(2); }
fs.mkdirSync(OUT, {recursive: true});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const checks = [], moments = [], hierarchy = [], music = [], seams = [], bodies = [], timings = [], errors = [];
let riteConfig;
const check = (ok, what) => { checks.push({ok: Boolean(ok), what}); console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`); };

// Installed before modules load: retain the production callback, never substitute a second implementation of the rite.
// Observe five-vertex miniature strokes and four-vertex filled wings, not a runtime's own accounting of expected bodies; and six-vertex
// miniature strokes, the units' own hexagons (THE HEXAGONS), apart from the page's sphere's (its .65 strokes, shellPolygons). THE ORIGAMI
// (origami.mjs): a leaf is a gold pentagon seed (five-vertex strokes) until it opens, then a bird of pentagons over its glass membrane (the
// four-vertex fill). THE FLOW (the-colony.mjs): while the film holds the stage the swarm is light, sprites added on the sphere's canvas
// ('lighter' drawImage, each counted with a small square mask where it lands), its bodies gone into it. THE UNITS' SKINS, BATCHED (warm-sphere.js
// drawMiniature): a unit's faces of one colour go down in one path, so each closed subpath of a path is read as its own polygon; THE BIRDS AS
// SPRITES: a flying bird is one copy off a sheet its drawing was painted on once (the sheet canvas says data-sprite="bird"), counted as its
// wing fill was, its box the mask.
function installProof() {
  const P = window.__riteProof = {sphere: null, rite: null, instrumented: true, collecting: false, polygons: [], shellPolygons: [], contexts: {}, pentagonStrokes: 0, birdFills: 0, hexagonStrokes: 0, arrowImages: 0, marks: [], inFront: false};
  const proto = CanvasRenderingContext2D.prototype, paths = new WeakMap();
  const keep = (name, observe) => {
    const original = proto[name];
    proto[name] = function(...a) { if (P.instrumented) observe.call(this, ...a); return original.apply(this, a); };
  };
  const point = (ctx, x, y) => { const m = ctx.getTransform(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; };
  // a path: its subpaths (each {points, closed}, a moveTo beginning the next) and whether anything in it is curved
  keep('beginPath', function() { paths.set(this, {subs: [], curved: false}); });
  keep('moveTo', function(x, y) { paths.get(this)?.subs.push({points: [point(this, x, y)], closed: false}); });
  keep('lineTo', function(x, y) { const p = paths.get(this); if (p) { if (!p.subs.length) p.subs.push({points: [], closed: false}); p.subs.at(-1).points.push(point(this, x, y)); } });
  keep('closePath', function() { const sub = paths.get(this)?.subs.at(-1); if (sub) sub.closed = true; });
  for (const name of ['arc', 'arcTo', 'ellipse', 'bezierCurveTo', 'quadraticCurveTo', 'rect']) {
    keep(name, function() { const p = paths.get(this); if (p) p.curved = true; });
  }
  const painted = (ctx, kind) => {
    const p = paths.get(ctx);
    if (p && !p.curved) for (const sub of p.subs) polygon(ctx, sub, kind);
  };
  const polygon = (ctx, p, kind) => {
    const c = ctx.canvas, bird = kind === 'birdFills';
    if (P.collecting && c.closest?.('#sphere-stage') && p.closed && Math.abs(ctx.lineWidth - .65) < 1e-6 &&
        ctx.globalAlpha > .01 && (p.points.length === 5 || p.points.length === 6)) {
      const box = c.getBoundingClientRect();
      P.shellPolygons.push(p.points.map(([x, y]) => [x * box.width / c.width, y * box.height / c.height]));
      if (c.id === 'genesis-sphere') P.inFront = true;   // the sphere's own faces: what this frame paints after them is in front
    }
    if (P.collecting && !bird && c.closest?.('#sphere-stage') && p.closed && p.points.length === 6 &&
        Math.abs(ctx.lineWidth - .5) < 1e-6 && ctx.globalAlpha > .001) P.hexagonStrokes++;
    if (!P.collecting || !c.closest?.('#sphere-stage') || !p.closed || p.points.length !== (bird ? 4 : 5) ||
      (!bird && Math.abs(ctx.lineWidth - .5) > 1e-6) || ctx.globalAlpha <= (bird ? .01 : .001)) return;
    const box = c.getBoundingClientRect(), stage = document.querySelector('#sphere-stage').getBoundingClientRect();
    if (!box.width || !box.height || !c.width || !c.height) return;
    P[kind]++;
    const key = c.id || c.className || 'canvas';
    P.contexts[key] ??= {pentagonStrokes: 0, birdFills: 0}; P.contexts[key][kind]++;
    // THE FIELD's reading: each unit pentagon's centre in the canvas's own pixels (as shellPolygons), whether it was painted after the sphere's
    // faces in its frame (the front pass), and how seen it was
    if (!bird && P.marks.length < 20000) {
      let mx = 0, my = 0; for (const [x, y] of p.points) { mx += x; my += y; }
      P.marks.push([mx / p.points.length * box.width / c.width, my / p.points.length * box.height / c.height, P.inFront ? 1 : 0, ctx.globalAlpha]);
    }
    if (P.polygons.length < 6000) P.polygons.push(p.points.map(([x, y]) => [box.left - stage.left + x * box.width / c.width, box.top - stage.top + y * box.height / c.height]));
  };
  keep('clearRect', function() { if (this.canvas?.id === 'genesis-sphere') P.inFront = false; });   // a frame begins: the back pass first
  keep('stroke', function() { painted(this, 'pentagonStrokes'); });
  keep('fill', function() { painted(this, 'birdFills'); });
  keep('drawImage', function(image, ...a) {
    const c = this.canvas;
    // the sphere's own canvas, or the one THE HUSH forwards its near drawing to over the box (orbit-kick.js): any canvas of the stage
    if (!P.collecting || !c?.closest?.('#sphere-stage')) return;
    if (image?.dataset?.sprite === 'bird' && this.globalCompositeOperation === 'source-over' && this.globalAlpha > .01 && a.length === 8) {
      const box = c.getBoundingClientRect(), stage = document.querySelector('#sphere-stage').getBoundingClientRect();
      if (!box.width || !box.height || !c.width || !c.height) return;
      P.birdFills++;
      const key = c.id || c.className || 'canvas';
      P.contexts[key] ??= {pentagonStrokes: 0, birdFills: 0}; P.contexts[key].birdFills++;
      const [, , , , dx, dy, dw, dh] = a;
      if (P.polygons.length < 6000) P.polygons.push([[dx, dy], [dx + dw, dy], [dx + dw, dy + dh], [dx, dy + dh]].map(([x, y]) => point(this, x, y))
        .map(([x, y]) => [box.left - stage.left + x * box.width / c.width, box.top - stage.top + y * box.height / c.height]));
      return;
    }
    if (this.globalCompositeOperation !== 'lighter' || !(this.globalAlpha > .003)) return;
    P.arrowImages++;
    if (P.polygons.length < 6000) {
      const m = this.getTransform(), box = c.getBoundingClientRect(), stage = document.querySelector('#sphere-stage').getBoundingClientRect();
      const x = box.left - stage.left + m.e * box.width / c.width, y = box.top - stage.top + m.f * box.height / c.height;
      P.polygons.push([[x - 6, y - 6], [x + 6, y - 6], [x + 6, y + 6], [x - 6, y + 6]]);
    }
  });
  Object.defineProperty(window, 'genesisSphere', {configurable: true, get: () => P.sphere, set(sphere) {
    P.sphere = sphere;
    if (!sphere?.setRite) return;
    const set = sphere.setRite.bind(sphere);
    sphere.setRite = fn => { if (typeof fn === 'function') P.rite = fn; return set(fn); };
    P.use = fn => { P.active = fn; return set(fn); };
    P.enabled = on => P.use(on ? P.rite : null);
  }});
  P.freeze = () => { P.frozen = P.rite(); };
  // THE FIELD's number: of the unit pentagons painted in front and clearly seen (alpha over .3), the share whose centre lies over the
  // dodecahedron's faces (within .85 of the sphere's painted radius, its centre and radius read off its own painted faces)
  P.overFaces = () => {
    const pts = P.shellPolygons.flat();
    if (!pts.length) return null;
    let cx = 0, cy = 0; for (const [x, y] of pts) { cx += x; cy += y; } cx /= pts.length; cy /= pts.length;
    let r = 0; for (const [x, y] of pts) r = Math.max(r, Math.hypot(x - cx, y - cy));
    const seen = P.marks.filter(m => m[2] === 1 && m[3] > .3), over = seen.filter(m => Math.hypot(m[0] - cx, m[1] - cy) < .85 * r).length;
    return {seen: seen.length, over, share: seen.length ? over / seen.length : 0, radius: r};
  };
  P.paint = async (enabled, musical = null, maxDepth = null) => {
    P.polygons = []; P.shellPolygons = []; P.contexts = {}; P.pentagonStrokes = 0; P.birdFills = 0; P.hexagonStrokes = 0; P.arrowImages = 0; P.marks = []; P.collecting = true;
    P.enabled(enabled);
    if (musical || maxDepth !== null) {
      if (!P.frozen?.flock) throw new Error('No frozen flock for music intervention');
      const flock = {...P.frozen.flock};
      // Preserve ordinary motion and the wing phase: only remove formation gains derived from the score.
      if (musical === 'neutral') Object.assign(flock, {bank: 0, stretch: 1, spread: 1.7 + 2 * flock.refinement});
      const fixed = {...P.frozen, flock};
      // A prefix keeps every surviving parent and its original position. Only suppress the next generation.
      if (maxDepth !== null) fixed.family = P.frozen.family.filter(node => node.depth <= maxDepth);
      P.use(() => fixed);
    }
    P.sphere.redraw();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    P.collecting = false;
    const law = P.active?.(), state = P.sphere.getViewState();
    return {pentagonStrokes: P.pentagonStrokes, birdFills: P.birdFills, hexagonStrokes: P.hexagonStrokes, arrowImages: P.arrowImages, faces: P.overFaces(),
      shellHexagons: P.shellPolygons.filter(q => q.length === 6).length, contexts: P.contexts, polygons: P.polygons,
      law: law && {t: law.t, amount: law.amount, size: law.size, spin: law.spin, children: law.children, hexes: law.hexes, flock: law.flock, family: law.family,
        offsets: [law.offset(0), law.offset(1), law.offset(0, .5)]},
      sphere: {moment: state.moment, phaseTime: state.phaseTime, count: state.count, body: state.body}, shellPolygons: P.shellPolygons};
  };
  P.timeRedraws = async () => {
    const start = performance.now(); P.instrumented = false;
    try {
      for (let i = 0; i < 6; i++) {
        P.sphere.redraw();
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      }
      return {requestedRedraws: 6, wallMs: performance.now() - start};
    } finally { P.instrumented = true; }
  };
  P.compare = async (on, off, restored, polygons) => {
    const read = async data => {
      const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
      const image = await createImageBitmap(new Blob([bytes], {type: 'image/png'}));
      const c = document.createElement('canvas'); c.width = image.width; c.height = image.height;
      const ctx = c.getContext('2d'); ctx.drawImage(image, 0, 0); image.close();
      return {width: c.width, height: c.height, data: ctx.getImageData(0, 0, c.width, c.height).data};
    };
    const [a, b, c] = await Promise.all([read(on), read(off), read(restored)]);
    if (a.width !== b.width || a.height !== b.height || a.width !== c.width || a.height !== c.height) throw new Error('Screenshot dimensions changed');
    const mask = document.createElement('canvas'); mask.width = a.width; mask.height = a.height;
    const ctx = mask.getContext('2d'), rect = document.querySelector('#sphere-stage').getBoundingClientRect();
    ctx.scale(a.width / rect.width, a.height / rect.height); ctx.fillStyle = '#fff';
    for (const points of polygons) {
      ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill();
    }
    const m = ctx.getImageData(0, 0, a.width, a.height).data;
    let pixels = 0, changed = 0, delta = 0, restoredDelta = 0;
    for (let i = 0; i < m.length; i += 4) if (m[i + 3] > 32) {
      let d = 0, r = 0; for (let k = 0; k < 3; k++) { d += Math.abs(a.data[i + k] - b.data[i + k]); r += Math.abs(a.data[i + k] - c.data[i + k]); }
      pixels++; delta += d; restoredDelta += r; if (d > 18) changed++;
    }
    return {maskPixels: pixels, changedPixels: changed, meanDifference: pixels ? delta / (3 * pixels) : 0,
      restoredMeanDifference: pixels ? restoredDelta / (3 * pixels) : 0};
  };
}

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rite-unit1s-'));
let child, socket, timeout, exitCode = 2;
try {
  child = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    `--window-size=${W},${H}`, '--no-first-run', '--autoplay-policy=no-user-gesture-required', 'about:blank'], {stdio: 'ignore'});
  let spawnError; child.on('error', error => { spawnError = error; });
  timeout = setTimeout(() => child.kill('SIGKILL'), 180000);
  let port;
  for (let i = 0; i < 150; i++) {
    if (spawnError) throw spawnError;
    try { port = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]; break; } catch { await sleep(100); }
  }
  if (!port) throw new Error('Chrome did not open its debugging port');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`, {signal: AbortSignal.timeout(5000)})).json();
  const target = targets.find(t => t.type === 'page');
  if (!target) throw new Error('No Chrome page target');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('CDP connection timed out')), 5000);
    socket.onopen = () => { clearTimeout(timer); resolve(); }; socket.onerror = () => { clearTimeout(timer); reject(new Error('CDP connection failed')); };
  });
  let serial = 0; const pending = new Map();
  socket.onmessage = event => {
    const m = JSON.parse(event.data), p = pending.get(m.id);
    if (!p) return; pending.delete(m.id); clearTimeout(p.timer);
    if (m.error) p.reject(new Error(`${p.method}: ${m.error.message}`)); else p.resolve(m.result);
  };
  socket.onclose = () => { for (const p of pending.values()) { clearTimeout(p.timer); p.reject(new Error('CDP closed')); } pending.clear(); };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++serial, timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 15000);
    pending.set(id, {resolve, reject, timer, method}); socket.send(JSON.stringify({id, method, params}));
  });
  const val = async expression => {
    const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result?.value;
  };
  const waitFor = async (expression, label, ms = 20000) => {
    const until = Date.now() + ms;
    while (Date.now() < until) { if (await val(expression)) return; await sleep(100); }
    throw new Error(`Timed out: ${label}`);
  };
  await send('Page.enable');
  await send('Performance.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', {source: `(${installProof.toString()})()`});
  await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false});
  const page = new URL(URL_); page.searchParams.set('debug', 'off'); page.searchParams.delete('depth'); page.hash = 'genesis';
  await send('Page.navigate', {url: page.href});
  const film = `document.querySelector('#dl-twelve-film')`;
  await waitFor(`Boolean(window.dlTwelve && window.__riteProof?.rite && ${film}?.readyState >= 2 && ${film}.duration > ${Math.max(101, ...TIMES)})`, 'normal mint and live rite callback', 45000);
  riteConfig = await val(`import(new URL('../lab/rite-unit1s.js', location.href)).then(m => m.RITE)`);
  if (!(riteConfig?.doubling > 0 && riteConfig?.maxPerRoot > 0 && riteConfig?.in > 0)) throw new Error('Served RITE growth configuration missing');
  check(riteConfig.in <= 1.5 && riteConfig.children === 12 && riteConfig.maxPerRoot === 157,
    'served law reveals chunks during the gesture and budgets persistent Unit1, Unit2 and Unit3 families');
  // The page's own Pause sets both the film and sphere's user-paused state. Direct media.pause would be resumed by sync().
  await val(`document.querySelector('[data-twelve-pause]').scrollIntoView({block:'center', behavior:'instant'})`);
  const pause = await val(`(() => { const b = document.querySelector('[data-twelve-pause]'), r = b.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2; return {pressed:b.getAttribute('aria-pressed') === 'true', x, y, hit:document.elementFromPoint(x,y) === b}; })()`);
  if (!pause.hit) throw new Error('Pause control is not reachable at its centre');
  if (!pause.pressed) {
    await send('Input.dispatchMouseEvent', {type: 'mousePressed', x: pause.x, y: pause.y, button: 'left', clickCount: 1});
    await send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: pause.x, y: pause.y, button: 'left', clickCount: 1});
  }
  await waitFor(`${film}.paused && document.querySelector('[data-twelve-pause]').getAttribute('aria-pressed') === 'true'`, 'page Pause');
  check(true, 'normal mint paused through its own control before any seek');
  await val(`document.querySelector('#sphere-stage').scrollIntoView({block:'start', behavior:'instant'})`);
  const seek = async at => {
    await val(`(() => { const f=${film}; if (!f.paused) throw new Error('Refusing a seek before the page is paused'); f.currentTime=${at}; })()`);
    await waitFor(`${film}.paused && !${film}.seeking && Math.abs(${film}.currentTime-${at}) < .04`, `seek ${at}`);
    await sleep(150);
  };
  const shot = async name => {
    // scrollIntoView respects the page's header padding, leaving part of this viewport-height GPU scene unpainted.
    await val(`(async () => { const r=document.querySelector('#sphere-stage').getBoundingClientRect(); window.scrollTo({left:scrollX,top:scrollY+r.top,behavior:'instant'}); await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); })()`);
    const frame = await val(`(() => { const r=document.querySelector('#sphere-stage').getBoundingClientRect(); return {top:r.top,bottom:r.bottom,height:innerHeight}; })()`);
    if (frame.top < -.5 || frame.bottom > frame.height + .5) throw new Error('Stage outside painted viewport: ' + JSON.stringify(frame));
    const clip = await val(`(() => { const r=document.querySelector('#sphere-stage').getBoundingClientRect(); return {x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height,scale:1}; })()`);
    const {data} = await send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: true, clip});
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(data, 'base64')); return data;
  };
  const probe = async (at, label, expected = true) => {
    await seek(at);
    const on = await val('__riteProof.paint(true)'), onPNG = await shot(`${label}-on`);
    let off, offPNG, restored, restoredPNG;
    try { off = await val('__riteProof.paint(false)'); offPNG = await shot(`${label}-off`); }
    finally { restored = await val('__riteProof.paint(true)'); restoredPNG = await shot(`${label}-restored`); }
    const pixels = await val(`__riteProof.compare(${JSON.stringify(onPNG)},${JSON.stringify(offPNG)},${JSON.stringify(restoredPNG)},${JSON.stringify(on.polygons)})`);
    delete on.polygons; delete off.polygons; delete restored.polygons;
    // THE HEXAGONS by the law itself: every unit's rung (the next one once a step has begun), all twelve families
    // (THE VOLLEY: a swarm delivered into the sphere's centre is no more drawn)
    on.lawHexagons = await val(`import(new URL('../lab/rite-unit1s.js', location.href)).then(({hexesAt, HEXES, volleyLaunch, volleyAt}) => {
      const law = __riteProof.rite?.(); let n = 0;
      if (law && HEXES) for (let chair = 0; chair < 12; chair++) for (const node of law.family) {
        if (!HEXES.steps[node.depth]) continue;
        if (node.depth === 2 && volleyAt(volleyLaunch(node, chair), law.t) >= 1) continue;
        const {level, progress} = hexesAt(node, law.t, chair);
        n += HEXES.ladder[Math.min(HEXES.ladder.length - 1, progress > 0 ? level + 1 : level)];
      }
      return n; })`);
    const held = await val(`${film}.paused && Math.abs(${film}.currentTime-${at}) < .04`);
    check(held, `${label}: comparisons hold the same paused film frame`);
    // THE FLOW: while the film holds the stage and the swarm flies in it, the bodies are light and the twelve wait behind the film
    const flown = await val(`import(new URL('../lab/the-colony.mjs?v=the-cut-1', location.href)).then(m => Boolean(m.colonyAt(${at})) && m.flowAt(${at})?.pull >= 1)`);
    on.flown = flown;
    if (expected && flown) {
      check(on.arrowImages > 0 && off.arrowImages === 0 && restored.arrowImages === on.arrowImages && on.pentagonStrokes === 0 && on.birdFills === 0,
        `${label}: the swarm flies as light over the film and restores (${on.arrowImages} sprites, none without the rite; no body painted)`);
      check(pixels.maskPixels > 50 && pixels.changedPixels >= 12 && pixels.meanDifference > .05 && pixels.meanDifference > pixels.restoredMeanDifference * 2 + .02,
        `${label}: removing the swarm's light changes composited pixels (${pixels.changedPixels} changed; mean ${pixels.meanDifference.toFixed(3)}; restore noise ${pixels.restoredMeanDifference.toFixed(3)})`);
      check(on.hexagonStrokes === 0 && restored.hexagonStrokes === 0, `${label}: the twelve wait behind the film (no unit hexagon painted over it)`);
    } else if (expected) {
      check(on.pentagonStrokes + on.birdFills > 0 && (on.pentagonStrokes > off.pentagonStrokes || on.birdFills > off.birdFills) &&
        restored.pentagonStrokes === on.pentagonStrokes && restored.birdFills === on.birdFills,
        `${label}: bodies paint and restore (${on.pentagonStrokes} pentagon strokes, ${on.birdFills} wing fills; without rite ${off.pentagonStrokes}, ${off.birdFills})`);
      check(pixels.maskPixels > 50 && pixels.changedPixels >= 12 && pixels.meanDifference > .05 && pixels.meanDifference > pixels.restoredMeanDifference * 2 + .02,
        `${label}: removing bodies changes composited body pixels (${pixels.changedPixels} changed; mean ${pixels.meanDifference.toFixed(3)}; restore noise ${pixels.restoredMeanDifference.toFixed(3)})`);
      // THE HEXAGONS: seeds through the hand shot, then the units' own hexagons; the page's dodecahedron keeps its twelve
      // a grown unit paints its near faces only (warm-sphere.js nearOnly): about half of its hexagons at any turn
      const near = on.lawHexagons ? on.hexagonStrokes / on.lawHexagons : 0;
      check(at < 84 ? on.hexagonStrokes === 0 && on.lawHexagons === 0 : on.hexagonStrokes > off.hexagonStrokes && near > .35 && near < .65,
        `${label}: ${at < 84 ? 'the units are seeds' : 'the units paint their own near hexagons'} (${on.hexagonStrokes} strokes of the law's ${on.lawHexagons}; without rite ${off.hexagonStrokes})`);
      // the rite never touches the page's own sphere: the twelve until its own members arrive (its illustration, from 108 s), the same without the rite
      check(on.shellHexagons === off.shellHexagons && restored.shellHexagons === on.shellHexagons && (on.sphere.count > 0 || on.shellHexagons === 0) &&
        restored.hexagonStrokes === on.hexagonStrokes,
        `${label}: the rite leaves the page's sphere its own (${on.sphere.count ? `${on.shellHexagons} hexagons, its ${on.sphere.count} members'` : 'the twelve, no hexagon'}; the same without the rite) and the units' restore`);
    } else {
      check([on, off, restored].every(s => s.pentagonStrokes === 0 && s.birdFills === 0),
        `${label}: seeking before birth clears the recursive bodies`);
    }
    if ([96, 100.25, 106.5, 108, 125, 145].includes(at)) {
      // Informational page-main-thread CPU only. Disable canvas observers; pass-through wrappers and CDP still add overhead.
      const metrics = async () => Object.fromEntries((await send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
      const before = await metrics();
      const sample = await val('__riteProof.timeRedraws()');
      const after = await metrics(), durationsMs = {};
      for (const key of ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration']) durationsMs[key] = (after[key] - before[key]) * 1000;
      timings.push({at, ...sample, durationsMs, taskMsPerRequestedRedraw: durationsMs.TaskDuration / sample.requestedRedraws,
        note: 'Canvas observers disabled; page main-thread CPU includes pass-through wrappers and CDP overhead; informational only.'});
    }
    const row = {at, label, on, off, restored, pixels}; moments.push(row); return row;
  };
  for (const at of TIMES) await probe(at, `t${String(at).replace('.', '-')}`);
  // The central vessel must change geometry, not only report a new effect state or paint a background halo.
  for (const at of [100.25, 101.3, 103, 106.5, 108, 125, 150]) {
    await seek(at);
    const rendered = await val('__riteProof.paint(true)');
    const body = await val(`(async () => {
      const s=genesisSphere.getViewState(), canvas=document.querySelector('#genesis-sphere'), r=canvas.getBoundingClientRect();
      const {buildAssemblySkin}=await import(new URL('./assembly-geometry.js',location.href));
      const {packSkin,jsFrame,FRAME}=await import(new URL('./warm-sphere.js?v=mint-3',location.href));
      const skin=buildAssemblySkin(s.capacity), pack=packSkin(skin), radius=Math.min(r.width,r.height)*s.radius;
      const b=jsFrame.faces(pack.packed,pack.n,s.yaw,s.pitch,r.width*.55,r.height*.5,radius);
      const panels=skin.pents.map((face,i)=>{
        const a=genesisSphere.anchor(face.id), o=i*FRAME.FACE_OUT;
        return {id:face.id,points:a?.points, displacement:a?Math.hypot(a.x-b[o+2],a.y-b[o+3]):null};
      });
      return {state:s.body,panels,radius};
    })()`);
    const painted = body.panels.filter(p => p.points && rendered.shellPolygons.some(q => q.length === p.points.length &&
      q.every((v,i) => Math.hypot(v[0]-p.points[i][0],v[1]-p.points[i][1]) < .01)));
    const displacement = body.panels.reduce((sum,p)=>sum+(p.displacement ?? 0),0)/body.panels.length;
    // THE COLONY (lab/the-colony.mjs): while the film covers the whole stage the box hushes the page's skin under it (orbit-kick.js THE HUSH):
    // no stroke of the vessel is painted there, by design; elsewhere its strokes agree with the projected faces
    const covered = await val(`import(new URL('../lab/the-colony.mjs?v=the-cut-1', location.href)).then(m => (m.colonyAt(${at})?.spread ?? 0) >= 1)`);
    if (covered) check(rendered.shellPolygons.length === 0, `body ${at}: the film covers the stage, the vessel hushed under it (THE COLONY)`);
    else check(painted.length >= 6, `body ${at}: actual central panel strokes agree with projected face geometry`);
    check(at === 100.25 || at === 150 ? displacement < .01 : displacement > body.radius * .012,
      `body ${at}: ${at===100.25||at===150?'closed body restored':'central panels physically move'} (${displacement.toFixed(3)}px)`);
    bodies.push({at,...body,painted:painted.length,displacement});
    await shot(`body-${String(at).replace('.','-')}`);
  }
  const growth = [...moments].sort((a, b) => a.at - b.at);
  for (const row of growth) {
    const f = row.on.law?.flock;
    check(f && Number.isFinite(f.population) && Number.isFinite(f.perRoot) && Number.isFinite(f.refinement) && Number.isFinite(f.scale) &&
      f.perRoot >= 1 && f.perRoot <= riteConfig.maxPerRoot && f.population >= 12 && f.population <= 12 * riteConfig.maxPerRoot && Math.abs(f.population - 12 * f.perRoot) < 1e-7 &&
      f.refinement >= 0 && f.refinement <= 1 && f.scale > 0 && f.scale <= 1,
      `${row.label}: bounded family population is exposed`);
    const family = row.on.law?.family, byId = new Map((family || []).map(node => [node.id, node]));
    check(family?.length > 0 && family.length <= 157 && byId.size === family.length && family.every(node =>
      node.amount >= 0 && node.amount <= 1 && (node.depth === 1 || (byId.has(node.parent) && byId.get(node.parent).depth === node.depth - 1))),
      `${row.label}: visible units retain unique identities and their immediate parents`);
    if (row.at >= 85 && !row.on.flown) check(row.on.pentagonStrokes > row.off.pentagonStrokes,
      `${row.label}: parent dodecahedra remain painted after descendants appear`);
  }
  for (let i = 1; i < growth.length; i++) {
    const previous = growth[i - 1], row = growth[i];
    check(row.on.lawHexagons >= previous.on.lawHexagons,
      `${previous.label} to ${row.label}: the units' hexagons only grow (${previous.on.lawHexagons} to ${row.on.lawHexagons})`);
  }
  {
    const law = t => growth.find(row => row.at === t)?.on.lawHexagons, painted = t => growth.find(row => row.at === t)?.on.hexagonStrokes;
    check(law(85) < law(96) && law(96) < law(125) && law(125) < law(145) && painted(85) < painted(96) && painted(96) < painted(125),
      `the units keep growing hexagons through the film (${[85, 96, 125, 145].map(law).join(', ')} at 85, 96, 125, 145 s; painted ${[85, 96, 125, 145].map(painted).join(', ')})`);
  }
  for (let i = 1; i < growth.length; i++) {
    const previous = growth[i - 1], row = growth[i], a = previous.on.law?.flock, b = row.on.law?.flock;
    check(a && b && b.population >= a.population && b.perRoot >= a.perRoot,
      `${previous.label} to ${row.label}: delegation adds descendants without deleting existing units`);
  }
  if (growth.length > 1) {
    const early = growth[0], late = growth.at(-1);
    check(late.on.birdFills - late.off.birdFills > Math.max(0, early.on.birdFills - early.off.birdFills),
      'late flock paints more visible wing silhouettes than the early chunks');
  }
  const centroid = points => points.reduce((s, p) => [s[0] + p[0] / points.length, s[1] + p[1] / points.length], [0, 0]);
  const geometry = (a, b) => {
    let squared = 0, count = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) for (let j = 0; j < Math.min(a[i].length, b[i].length); j++) {
      squared += (a[i][j][0] - b[i][j][0]) ** 2 + (a[i][j][1] - b[i][j][1]) ** 2; count++;
    }
    return {polygonsA: a.length, polygonsB: b.length, rmsVertexPx: count ? Math.sqrt(squared / count) : 0};
  };
  // Prove each generation on the composite, holding film, music, parent identities and parent poses fixed.
  // This fails a flat particle implementation even if it reports convincing family counters.
  for (const [at, depth] of [[85, 2], [96, 3], [104.6, 3], [125, 3]]) {   // 96: the leaves are gold seeds; 104.6 and 125: birds
    await seek(at); await val('__riteProof.freeze()');
    const on = await val(`__riteProof.paint(true,"actual",${depth})`), onPNG = await shot(`family-${at}-depth${depth}`);
    let lower, lowerPNG, restored, restoredPNG;
    try { lower = await val(`__riteProof.paint(true,"actual",${depth - 1})`); lowerPNG = await shot(`family-${at}-without-depth${depth}`); }
    finally { restored = await val(`__riteProof.paint(true,"actual",${depth})`); restoredPNG = await shot(`family-${at}-restored`); await val('__riteProof.paint(true)'); }
    const bodyPolygons = on.polygons.filter(points => depth === 3 ? points.length === 4 || points.length === 5 : points.length === 5);
    const pixels = await val(`__riteProof.compare(${JSON.stringify(onPNG)},${JSON.stringify(lowerPNG)},${JSON.stringify(restoredPNG)},${JSON.stringify(bodyPolygons)})`);
    const parents = s => s.law.family.filter(node => node.depth < depth);
    check(JSON.stringify(parents(on)) === JSON.stringify(parents(lower)) && JSON.stringify(on.law.flock) === JSON.stringify(lower.law.flock) &&
      await val(`${film}.paused && Math.abs(${film}.currentTime-${at}) < .001`),
      `family ${at}: removing Unit${depth} holds the picture, soundtrack state and parent units fixed`);
    const count = s => depth === 3 ? s.birdFills + s.pentagonStrokes : s.pentagonStrokes;
    check(count(on) > count(lower) && count(restored) === count(on),
      `family ${at}: Unit${depth} adds painted geometry beyond its parents`);
    check(bodyPolygons.length > 0 && pixels.changedPixels >= 12 && pixels.meanDifference > .05 && pixels.meanDifference > pixels.restoredMeanDifference * 2 + .02,
      `family ${at}: Unit${depth} is visible in composited pixels (${pixels.changedPixels} changed; mean ${pixels.meanDifference.toFixed(3)})`);
    check(on.pentagonStrokes > 0 && lower.pentagonStrokes > 0,
      `family ${at}: parent bodies survive the descendant intervention`);
    for (const s of [on, lower, restored]) delete s.polygons;
    hierarchy.push({at, depth, on, lower, restored, pixels});
  }
  for (const at of MUSIC_TIMES) {
    await seek(at); await val('__riteProof.freeze()');
    const on = await val('__riteProof.paint(true,"actual")'), onPNG = await shot(`music-${at}-on`);
    let neutral, neutralPNG, restored, restoredPNG;
    try { neutral = await val('__riteProof.paint(true,"neutral")'); neutralPNG = await shot(`music-${at}-neutral`); }
    finally { restored = await val('__riteProof.paint(true,"actual")'); restoredPNG = await shot(`music-${at}-restored`); await val('__riteProof.paint(true)'); }
    const vertices = geometry(on.polygons, neutral.polygons), restoredVertices = geometry(on.polygons, restored.polygons);
    const pixels = await val(`__riteProof.compare(${JSON.stringify(onPNG)},${JSON.stringify(neutralPNG)},${JSON.stringify(restoredPNG)},${JSON.stringify(on.polygons)})`);
    const invariant = s => ({t:s.law.t, amount:s.law.amount, size:s.law.size, spin:s.law.spin, offsets:s.law.offsets,
      population:s.law.flock.population, perRoot:s.law.flock.perRoot, refinement:s.law.flock.refinement, scale:s.law.flock.scale,
      orbitTime:s.law.flock.orbitTime, phase:s.law.flock.phase, flutter:s.law.flock.flutter, family:s.law.family,
      charge:s.law.flock.charge, release:s.law.flock.release});
    check(JSON.stringify(invariant(on)) === JSON.stringify(invariant(neutral)) && await val(`${film}.paused && Math.abs(${film}.currentTime-${at}) < .001`),
      `music ${at}: intervention holds film time, population, size, hand offsets and orbit clock fixed`);
    check(on.birdFills + on.pentagonStrokes > 0 && neutral.birdFills + neutral.pentagonStrokes > 0 && vertices.rmsVertexPx > .05 && restoredVertices.rmsVertexPx < .001,
      `music ${at}: musical controls move actual painted family vertices (${vertices.rmsVertexPx.toFixed(3)} px RMS; restored ${restoredVertices.rmsVertexPx.toFixed(3)})`);
    check(pixels.changedPixels >= 12 && pixels.meanDifference > .05 && pixels.meanDifference > pixels.restoredMeanDifference * 2 + .02,
      `music ${at}: late music geometry reaches composited pixels (${pixels.changedPixels} changed; mean ${pixels.meanDifference.toFixed(3)})`);
    for (const s of [on, neutral, restored]) delete s.polygons;
    music.push({at, on, neutral, restored, vertices, restoredVertices, pixels});
  }
  // Across the shot boundary compare painted body geometry, not screenshots of the intentional film cut.
  const edge = [];
  for (const at of [riteConfig.to - .001, riteConfig.to + .001]) { await seek(at); edge.push(await val('__riteProof.paint(true)')); }
  const nearest = (a, b) => {
    const targets = b.map(p => ({n:p.length, c:centroid(p)}));
    return a.map(p => { const c=centroid(p); let best=Infinity; for(const q of targets) if(q.n===p.length) best=Math.min(best,Math.hypot(c[0]-q.c[0],c[1]-q.c[1])); return best; });
  };
  const distances = [...nearest(edge[0].polygons, edge[1].polygons), ...nearest(edge[1].polygons, edge[0].polygons)];
  const seam = {at:riteConfig.to, polygonCounts:edge.map(s=>s.polygons.length), maxCentroidPx:Math.max(0,...distances),
    meanCentroidPx:distances.length ? distances.reduce((a,b)=>a+b,0)/distances.length : Infinity, laws:edge.map(s=>s.law)};
  check(distances.length > 0 && seam.meanCentroidPx < .5 && seam.maxCentroidPx < 3,
    `hand-shot seam: painted bodies remain continuous over 2ms (mean ${seam.meanCentroidPx.toFixed(3)}px; max ${seam.maxCentroidPx.toFixed(3)}px)`);
  seams.push(seam);
  const previous = moments.find(m => m.at === 101) || await probe(101, 'seek-reconstruction-reference');
  await probe(70, 'seek-before-birth', false);
  const forward = await probe(101, 'seek-forward-reconstructed');
  check(forward.on.pentagonStrokes === previous.on.pentagonStrokes && forward.on.birdFills === previous.on.birdFills &&
    JSON.stringify(forward.on.law?.flock) === JSON.stringify(previous.on.law?.flock) &&
    JSON.stringify(forward.on.law?.family) === JSON.stringify(previous.on.law?.family),
    'forward seek reconstructs the same parent-child identities, chunks and wings at 101 seconds');
  exitCode = checks.some(c => !c.ok) ? 1 : 0;
} catch (error) { errors.push(error.stack || String(error)); console.error(error.stack || error); }
finally {
  clearTimeout(timeout); try { socket?.close(); } catch {}
  if (child && child.exitCode === null) {
    child.kill('SIGKILL');
    await Promise.race([new Promise(resolve => child.once('exit', resolve)), sleep(1500)]);
  }
  fs.rmSync(profile, {recursive: true, force: true});
  fs.writeFileSync(path.join(OUT, 'receipt.json'), `${JSON.stringify({url: URL_, size: [W, H], riteConfig, checks, moments, hierarchy, music, seams, bodies, timings, errors, exitCode}, null, 2)}\n`);
}
console.log(`${exitCode === 0 ? 'PASS' : 'FAIL'}: ${checks.filter(c => c.ok).length}/${checks.length} checks; ${OUT}`);
process.exit(exitCode);
