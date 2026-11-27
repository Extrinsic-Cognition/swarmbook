// sphere-frame.proof.mjs: THE PICTURE IS THE SAME (Oct 15 2026; his "i want it invariant but way more optimized"). The mint hero's sphere drawn
// by two copies of the page (--a <url> --b <url>: main's and the lane's, or one page with the kernel off and on: --kernel) at the same inputs,
// pixel by pixel. A muted headless Chrome off every screen loads each page with its screen frames held (requestAnimationFrame answers only
// when this proof steps it), pauses the film at --second (default 10), hands the sphere that second (setMoment), steps the same frames with the
// same timestamps, and reads the sphere's canvas. The receipt: pixels differing, the largest channel difference, PSNR; --out <dir> writes the
// two pictures. Nothing is tapped; nothing is sought but the film to --second, with the page's own idle work over first (--settle).
// Run: nice -n 19 node lab/sphere-frame.proof.mjs --a http://127.0.0.1:8932/dyson-society/app/warm.html --b http://127.0.0.1:8931/dyson-society/app/warm.html
import {chromium} from '/opt/node-tools/node_modules/playwright-core/index.mjs';
import {writeFileSync, mkdirSync} from 'node:fs';
const arg = (k, d = null) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const A = arg('--a'), B = arg('--b', A), SECOND = Number(arg('--second', '10')), STEPS = Number(arg('--steps', '30')), OUT = arg('--out'), KERNEL = process.argv.includes('--kernel');
// --settle ms: the page's own idle work (the hero's 3D box is made 2.5 s after its stage is up, in idle time) is over before the proof seeks
const SETTLE = Number(arg('--settle', '7000'));
const browser = await chromium.launch({headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio']});
async function capture(url, kernel) {
  const context = await browser.newContext({viewport: {width: 1280, height: 800}, deviceScaleFactor: 1});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
  await page.addInitScript(() => {
    // the screen's frames are the proof's: queued, run by __step(ts) with the timestamp it gives
    const queue = []; let now = 0;
    window.requestAnimationFrame = (fn) => { queue.push(fn); return queue.length; };
    window.cancelAnimationFrame = (id) => { if (id > 0 && id <= queue.length) queue[id - 1] = null; };
    window.__step = (ts) => { now = ts; const run = queue.splice(0); for (const fn of run) if (fn) fn(ts); return run.length; };
    window.__queued = () => queue.filter(Boolean).length;
    // the page's clock stands still but for the steps
    performance.now = () => now;
  });
  await page.goto(url, {waitUntil: 'load', timeout: 60000});
  await page.waitForTimeout(SETTLE);
  const ok = await page.evaluate(async ({second, kernel}) => {
    const sphere = window.genesisSphere, film = document.getElementById('dl-twelve-film');
    if (!sphere || !film) return {ok: false, why: 'no sphere or film'};
    const mod = await import('./warm-sphere.js?v=rite-1');
    if (kernel !== null) { if (kernel) { const m = await import('./mint-wasm.mjs?v=kernel-1'); mod.useWasm(await m.load()); } else mod.useWasm(null); }
    film.pause();
    await new Promise(r => { if (film.readyState >= 1) r(); else film.addEventListener('loadedmetadata', r, {once: true}); });
    await new Promise(r => { film.addEventListener('seeked', r, {once: true}); film.currentTime = second; setTimeout(r, 3000); });
    sphere.setMoment(second);
    return {ok: true, state: sphere.getViewState()};
  }, {second: SECOND, kernel});
  if (!ok.ok) throw new Error(`${url}: ${ok.why}`);
  // the same frames, the same timestamps, on both pages
  const ran = [];
  for (let i = 1; i <= STEPS; i++) ran.push(await page.evaluate(ts => window.__step(ts), i * 1000 / 60));
  const shot = await page.evaluate(() => {
    const c = document.getElementById('genesis-sphere'), g = c.getContext('2d');
    const d = g.getImageData(0, 0, c.width, c.height);
    return {w: c.width, h: c.height, png: c.toDataURL('image/png'), data: Array.from(d.data)};
  });
  const state = await page.evaluate(() => window.genesisSphere.getViewState());
  await context.close();
  return {...shot, ran, errors, state};
}
const psnr = (a, b) => {
  let se = 0, diff = 0, max = 0;
  for (let i = 0; i < a.length; i += 4) {
    let any = false;
    for (let k = 0; k < 4; k++) { const d = Math.abs(a[i + k] - b[i + k]); if (d) { any = true; se += d * d; if (d > max) max = d; } }
    if (any) diff++;
  }
  const mse = se / a.length;
  return {pixels: diff, max, psnr: mse ? 10 * Math.log10(255 * 255 / mse) : Infinity};
};
const pairs = KERNEL ? [[A, false, 'JS twins'], [A, true, 'the kernel']] : [[A, null, 'A'], [B, null, 'B']];
const [x, y] = await Promise.all([capture(...pairs[0].slice(0, 2)), capture(...pairs[1].slice(0, 2))]);
await browser.close();
if (x.w !== y.w || x.h !== y.h) throw new Error(`the canvases differ in size: ${x.w}x${x.h} and ${y.w}x${y.h}`);
const r = psnr(x.data, y.data);
console.log(`${pairs[0][2]} against ${pairs[1][2]} at the film's ${SECOND} s, ${STEPS} frames stepped (${x.ran.reduce((a, b) => a + b, 0)} / ${y.ran.reduce((a, b) => a + b, 0)} callbacks run): canvas ${x.w}x${x.h}, ${r.pixels} pixels differ (${(100 * r.pixels / (x.w * x.h)).toFixed(3)} %), largest channel difference ${r.max}, PSNR ${r.psnr === Infinity ? 'infinite (identical)' : r.psnr.toFixed(1) + ' dB'}`);
console.log(`  A: kernel ${x.state.kernel ?? 'n/a'}, yaw ${x.state.yaw.toFixed(4)}, moment ${x.state.moment}, errors ${x.errors.length}; B: kernel ${y.state.kernel ?? 'n/a'}, yaw ${y.state.yaw.toFixed(4)}, moment ${y.state.moment}, errors ${y.errors.length}`);
if (x.errors.length || y.errors.length) console.log('  page errors:', [...x.errors, ...y.errors].slice(0, 4));
if (OUT) {
  mkdirSync(OUT, {recursive: true});
  writeFileSync(`${OUT}/a.png`, Buffer.from(x.png.split(',')[1], 'base64'));
  writeFileSync(`${OUT}/b.png`, Buffer.from(y.png.split(',')[1], 'base64'));
  // the difference, as a picture: each differing pixel white where any channel differs, grey by how much, on black
  const diff = await (async () => { const b = await chromium.launch({headless: true}); const p = await b.newPage(); const png = await p.evaluate(({w, h, a, c}) => { const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h; const g = canvas.getContext('2d'); const img = g.createImageData(w, h); for (let i = 0; i < a.length; i += 4) { const d = Math.max(Math.abs(a[i] - c[i]), Math.abs(a[i + 1] - c[i + 1]), Math.abs(a[i + 2] - c[i + 2]), Math.abs(a[i + 3] - c[i + 3])); const v = d ? Math.min(255, 64 + d * 3) : 0; img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255; } g.putImageData(img, 0, 0); return canvas.toDataURL('image/png'); }, {w: x.w, h: x.h, a: x.data, c: y.data}); await b.close(); return png; })();
  writeFileSync(`${OUT}/diff.png`, Buffer.from(diff.split(',')[1], 'base64'));
  console.log(`  pictures in ${OUT}`);
}
