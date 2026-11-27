#!/usr/bin/env node
// breakdown.proof.mjs: THE BREAKDOWN page (breakdown.html) proved in a muted headless Chrome over CDP, off every screen. His words are in the
// page's header. On a served tree (serve-range or aiolos; never python's http.server):
//   nice -n 19 node lab/breakdown.proof.mjs --url http://127.0.0.1:8995/intro/dyson-society/lab/breakdown.html [--scenes burst-one,her-window,inversion] [--out <dir>]
// - each scene opened by its address (?scene=<id>): no page error; a picture mid-swing (its far turn, 6 s in) for the first, and one at rest
//   for each (the swing ended on its turn: the cards in depth with the frustum above, the page at that second below);
// - AT REST: once the swing has ended, 3 s with no requestAnimationFrame, no setTimeout, no setInterval and no frame drawn (counted from
//   before the page's first line);
// - the keys: → opens the next scene; Space plays (the next one 3 s on), Space again pauses, the swing ends on its next turn, then rest again;
//   a drag turns the view (frames while it moves) and nothing runs after it;
// - a phone (390 x 844): no sideways scroll, a picture.
// Writes <out>/breakdown.proof.json and the pictures (they hold the film's frames: <out> is under lab/breakdown-pictures/, gitignored).
// COST: one Chrome for about a minute; niced.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {launch, pageOf, allowed} from './breakdown.capture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const URL_ = opt('--url', 'http://127.0.0.1:8995/intro/dyson-society/lab/breakdown.html');
const SCENES = opt('--scenes', 'burst-one,her-window,inversion').split(',');
const OUT = path.resolve(opt('--out', path.join(HERE, 'breakdown-pictures', 'proof')));
const CHROME = opt('--chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
const [W, H] = opt('--size', '1440x900').split('x').map(Number);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// before the page's first line: count what could run at rest
const COUNT = `(() => { const c = window.__count = {raf: 0, timeout: 0, interval: 0};
  const raf = window.requestAnimationFrame.bind(window), st = window.setTimeout.bind(window), si = window.setInterval.bind(window);
  window.requestAnimationFrame = (f) => { c.raf++; return raf(f); };
  window.setTimeout = (f, ms, ...a) => { c.timeout++; return st(f, ms, ...a); };
  window.setInterval = (f, ms, ...a) => { c.interval++; return si(f, ms, ...a); }; })();`;

async function main() {
  fs.mkdirSync(OUT, {recursive: true});
  const out = {at: new Date().toISOString(), url: URL_, scenes: [], errors: [], refused: [], rest: [], keys: null, drag: null, phone: null};
  const chrome = await launch(CHROME, [W, H]);
  const bound = setTimeout(() => { chrome.end().then(() => process.exit(2)); }, 300000);
  try {
    const page = await pageOf(chrome.ws, [W, H]);
    const origin = new URL(URL_).origin;
    page.on('Fetch.requestPaused', (p, sid) => {
      const ok = allowed(p.request.url, origin, p.request.method);
      if (!ok) out.refused.push(`${p.request.method} ${p.request.url.slice(0, 140)}`);
      page.send(ok ? 'Fetch.continueRequest' : 'Fetch.failRequest', ok ? {requestId: p.requestId} : {requestId: p.requestId, errorReason: 'BlockedByClient'}, sid).catch(() => {});
    });
    page.on('Runtime.exceptionThrown', (p) => out.errors.push(String(p?.exceptionDetails?.exception?.description || p?.exceptionDetails?.text).slice(0, 300)));
    page.on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error') out.errors.push(`console.error: ${p.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300)}`); });
    for (const m of ['Page.enable', 'Runtime.enable']) await page.send(m);
    await page.send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]});
    await page.send('Page.addScriptToEvaluateOnNewDocument', {source: COUNT});
    await page.send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false});
    const shot = async (name) => { const p = path.join(OUT, name); fs.writeFileSync(p, Buffer.from((await page.send('Page.captureScreenshot', {format: 'png'})).data, 'base64')); return p; };
    const state = () => page.ev(`({scene: window.breakdown?.scene, frames: window.breakdown?.frames, swinging: window.breakdown?.swinging, playing: window.breakdown?.playing, count: {...window.__count},
      img: document.getElementById('composite')?.complete && document.getElementById('composite')?.naturalWidth > 0, scroll: document.documentElement.scrollWidth, inner: innerWidth})`);
    const settled = async (max = 20000) => { const t0 = Date.now(); let s; while (Date.now() - t0 < max) { s = await state(); if (s.scene && !s.swinging && s.img) return s; await sleep(250); } return s; };
    const rest = async (label) => {
      const a = await state(); await sleep(3000); const b = await state();
      const r = {label, raf: b.count.raf - a.count.raf, timeout: b.count.timeout - a.count.timeout, interval: b.count.interval - a.count.interval, frames: b.frames - a.frames};
      r.ok = !r.raf && !r.timeout && !r.interval && !r.frames;
      out.rest.push(r); return r;
    };
    const open = async (url) => { await page.ev('window.__left = true').catch(() => {}); await page.send('Page.navigate', {url}); for (let i = 0; i < 150; i++) { await sleep(150); if (await page.ev(`!window.__left && Boolean(window.breakdown)`).catch(() => false)) return; } };
    for (const [i, id] of SCENES.entries()) {
      const url = `${URL_}?scene=${encodeURIComponent(id)}`;
      await open(url);
      const opened = await state();
      if (i === 0) { await sleep(6000); out.scenes.push({id, mid: await shot(`${id}-mid-swing.png`)}); }
      const s = await settled();
      const pic = await shot(`${id}-at-rest.png`);
      const r = await rest(`${id} at rest`);
      out.scenes.push({id, opened: opened.scene, scene: s.scene, picture: pic, frames: s.frames, rest: r});
      console.log(`${id}: opened ${opened.scene}, at rest after ${s.frames} frames; 3 s at rest: raf ${r.raf}, timeout ${r.timeout}, interval ${r.interval}, frames ${r.frames} (${r.ok ? 'ok' : 'NOT AT REST'})`);
    }
    // the keys: → , Space (plays), Space (pauses), then rest
    const key = async (key, code, keyCode) => { for (const type of ['keyDown', 'keyUp']) await page.send('Input.dispatchKeyEvent', {type, key, code, windowsVirtualKeyCode: keyCode, text: type === 'keyDown' && key === ' ' ? ' ' : undefined}); };
    const before = (await state()).scene;
    await key('ArrowRight', 'ArrowRight', 39); await sleep(300);
    const right = (await state()).scene;
    await key(' ', 'Space', 32); await sleep(3600);
    const played = await state();
    await key(' ', 'Space', 32); await sleep(200);
    const paused = await state();
    const after = await settled(15000);
    const r2 = await rest('after play and pause');
    out.keys = {before, right, played: played.scene, playing: played.playing, pausedPlaying: paused.playing, settledSwinging: after.swinging, rest: r2};
    console.log(`keys: ${before} → ${right}; Space played to ${played.scene} (playing ${played.playing}); Space paused (playing ${paused.playing}); rest: raf ${r2.raf}, frames ${r2.frames} (${r2.ok ? 'ok' : 'NOT AT REST'})`);
    // a drag over the top half
    const f0 = (await state()).frames;
    const box = await page.ev(`(() => { const r = document.getElementById('top').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
    await page.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: box[0], y: box[1], button: 'left', clickCount: 1});
    for (let k = 1; k <= 8; k++) { await page.send('Input.dispatchMouseEvent', {type: 'mouseMoved', x: box[0] - k * 18, y: box[1] + k * 4, button: 'left', buttons: 1}); await sleep(40); }
    await page.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: box[0] - 144, y: box[1] + 32, button: 'left', clickCount: 1});
    await sleep(300);
    const dragged = (await state()).frames - f0;
    const r3 = await rest('after a drag');
    out.drag = {frames: dragged, rest: r3, picture: await shot('after-a-drag.png')};
    console.log(`drag: ${dragged} frames while it moved; rest: raf ${r3.raf}, frames ${r3.frames} (${r3.ok ? 'ok' : 'NOT AT REST'})`);
    // a phone
    await page.send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 2, mobile: true});
    await open(`${URL_}?scene=${encodeURIComponent(SCENES[0])}`);
    const ph = await settled();
    out.phone = {scrollWidth: ph.scroll, innerWidth: ph.inner, sideways: ph.scroll > ph.inner, picture: await shot('phone-390x844.png')};
    console.log(`phone: scrollWidth ${ph.scroll} for a window of ${ph.inner} (${ph.scroll > ph.inner ? 'SIDEWAYS SCROLL' : 'no sideways scroll'})`);
  } catch (error) { out.errors.push(String(error?.stack || error).slice(0, 500)); console.error(String(error?.stack || error)); }
  clearTimeout(bound);
  await chrome.end();
  fs.writeFileSync(path.join(OUT, 'breakdown.proof.json'), JSON.stringify(out, null, 1));
  const ok = !out.errors.length && out.rest.length && out.rest.every((r) => r.ok) && out.phone && !out.phone.sideways && out.keys?.right !== out.keys?.before;
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${out.errors.length} page errors, ${out.rest.filter((r) => r.ok).length} of ${out.rest.length} rests at rest; ${out.refused.length} requests refused; ${path.join(OUT, 'breakdown.proof.json')}`);
  return ok ? 0 : 1;
}
main().then((code) => process.exit(code), (error) => { console.error(String(error?.stack || error)); process.exit(1); });
