#!/usr/bin/env node
// dl-depth.proof.mjs: THE FILM IN DEPTH, proved in a real browser off every screen: a muted headless Chrome opens the served mint at his window's
// shape (--size, the 14-inch's 1512 x 945 by default) with ?depth=test, starts the film before each moment (?debug), and at the moment presses the
// page's own Pause (its control, as his click would), then moves the eye (window.dlDepth.eye, metres in the picture's axes) left and right across EYE_X and shoots the
// picture at each step: the sweep's frames, a GIF of them, and the numbers (each layer's slide in CSS px, the draws, the draw's ms). Then the law of
// rest: the eye straight ahead hides the window and draws nothing; the same eye again draws nothing; the film playing with the eye off the axis draws
// once a presented frame. The page must be served with byte ranges (tools/serve-range or aiolos), never python's http.server (rule 8).
//   nice -n 19 node app/dl-depth.proof.mjs --url http://127.0.0.1:<port>/intro/dyson-society/app/warm.html --out <dir> [--at 65.13,65.60,68.50]
//     [--size 1512x945] [--chrome <path>] [--input mouse|orbit] (explicit manual mouse proof or normal music orbit)
// Exit 0 ran and every check held, 1 a check failed, 2 could not run.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn, execFileSync} from 'node:child_process';
import {contentRect} from './dl-depth.js';

const a = process.argv.slice(2), opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const URL_ = opt('--url'), OUT = opt('--out', path.join(os.tmpdir(), 'dl-depth-proof')), AT = opt('--at', '65.13,65.60,68.50').split(',').map(Number);
const POINTER = opt('--input', 'test') === 'mouse', ORBIT = opt('--input', 'test') === 'orbit';
const [W, H] = opt('--size', '1512x945').split('x').map(Number), EYE_X = [-0.1, -0.06, -0.02, 0.02, 0.06, 0.1, 0.06, 0.02, -0.02, -0.06];
const CHROME = opt('--chrome', path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'));
if (!URL_) { console.error('--url'); process.exit(2); }
fs.mkdirSync(OUT, {recursive: true});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const checks = [];
const check = (ok, what) => { checks.push({ok, what}); console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`); };

async function moment(at, k) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-')), page = new URL(URL_);
  page.searchParams.set('debug', String(Math.max(0, at - 1.2)));
  if (ORBIT) page.searchParams.delete('depth'); else page.searchParams.set('depth', POINTER ? 'mouse' : 'test');
  const child = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${W},${H}`, '--no-first-run', '--autoplay-policy=no-user-gesture-required', 'about:blank'], {stdio: 'ignore'});
  const watchdog = setTimeout(() => child.kill('SIGKILL'), 120000);
  try {
    let port = null; for (let i = 0; i < 150 && !port; i++) { try { port = fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch { await sleep(100); } }
    const t = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((x) => x.type === 'page');
    const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
    let id = 0; const pend = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({id: i, method, params})); });
    const val = async (expression) => (await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true})).result?.result?.value;
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false});
    await send('Page.navigate', {url: page.href});
    for (let i = 0; i < 300; i++) { if (await val('Boolean(window.dlTwelve?.state?.()?.debug?.released && window.dlDepth)')) break; await sleep(100); }
    const film = `document.querySelector('#dl-twelve-film')`;
    for (let i = 0; i < 200; i++) { if ((await val(`${film}?.currentTime ?? 0`)) >= at) break; await sleep(25); }
    const automatic = await val('window.dlDepth.state()');
    // the page's own Pause (its control's click: dl-twelve.js pauses the film and the motion; no sound is touched)
    const press = () => val(`document.querySelector('[data-twelve-pause]').click()`);
    await press(); await sleep(300);
    const paused = await val(`${film}.paused`), tAt = await val(`${film}.currentTime`), n = Math.floor(tAt * 30000 / 1001 + 1e-3);
    check(paused === true, `moment ${k}: the page's Pause held the film at ${tAt.toFixed(3)} s (frame ${n})`);
    const stage = await val(`(() => { const r = document.querySelector('#sphere-stage').getBoundingClientRect(); return {x: r.left, y: r.top, w: r.width, h: r.height}; })()`);
    const rect = contentRect(stage.w, stage.h);
    const driveEye = (x) => POINTER
      ? send('Input.dispatchMouseEvent', {type: 'mouseMoved', x: stage.x + rect.left + (x / .12 + 1) * rect.width / 2, y: stage.y + rect.top + rect.height / 2})
      : val(`window.dlDepth.eye([${x}, 0, 0.55])`);
    const shoot = async (file, sample = false) => {
      const pic = await send('Page.captureScreenshot', {format: 'png', clip: {x: stage.x, y: stage.y, width: stage.w, height: stage.h, scale: 1}});
      fs.writeFileSync(file, Buffer.from(pic.result.data, 'base64'));
      if (!sample) return null;
      // Sample the composited screenshot, not the depth canvas: an opaque sibling can hide a perfectly healthy renderer.
      // The central picture excludes margins, controls and animated dust that could otherwise produce a false pass.
      return val(`(async () => {
        const bytes = Uint8Array.from(atob(${JSON.stringify(pic.result.data)}), c => c.charCodeAt(0));
        const image = await createImageBitmap(new Blob([bytes], {type: 'image/png'}));
        const c = document.createElement('canvas'); c.width = 128; c.height = 80;
        const ctx = c.getContext('2d');
        ctx.drawImage(image, ${rect.left + rect.width * .2}, ${rect.top + rect.height * .2}, ${rect.width * .6}, ${rect.height * .6}, 0, 0, 128, 80);
        image.close(); return Array.from(ctx.getImageData(0, 0, 128, 80).data);
      })()`);
    };
    if (ORBIT) {
      const state = () => val('window.dlDepth.state()');
      const settle = async () => {
        for (let w = 0; w < 100; w++) { if (!(await state()).moving) break; await sleep(25); }
      };
      await settle();
      check(automatic.from === 'orbit' && automatic.trajectory?.kind === 'music-orbit', `moment ${k}: music orbit starts without mouse input`);
      const centre = s => JSON.stringify(s.trajectory?.centre) === '[0,0,0.55]';
      const bounded = s => Math.abs(s.eye[0]) < .05 && Math.abs(s.eye[1]) < .035 && Math.abs(s.eye[2] - .55) < .012;
      let before = await state(); await sleep(450); let after = await state();
      check(after.draws === before.draws && !after.moving, `moment ${k}: paused orbit settles and draws nothing`);
      const steer = async x => {
        await send('Input.dispatchMouseEvent', {type:'mouseMoved', x:stage.x + rect.left + rect.width * x, y:stage.y + rect.top + rect.height * .4});
        await settle(); await sleep(70);
        return state();
      };
      const left = await steer(.08), pixelsL = await shoot(path.join(OUT, `m${k}-steer-left.png`), true);
      const right = await steer(.92), pixelsR = await shoot(path.join(OUT, `m${k}-steer-right.png`), true);
      let delta = 0; for (let p = 0; p < pixelsL.length; p += 4) for (let c = 0; c < 3; c++) delta += Math.abs(pixelsL[p+c]-pixelsR[p+c]);
      const mean = delta / (pixelsL.length / 4 * 3);
      check(centre(left) && centre(right) && bounded(left) && bounded(right), `moment ${k}: mouse bends the orbit around the fixed centre within a 5 cm envelope`);
      check(Math.hypot(...left.eye.map((v,i)=>v-right.eye[i])) > .0003 && mean > .01, `moment ${k}: gentle steering reaches composited picture pixels (mean difference ${mean.toFixed(3)})`);
      check(left.passes.uploads === right.passes.uploads && left.passes.classifications === right.passes.classifications,
        `moment ${k}: pointer steering reuses the frozen frame's depth field`);
      check(await val(`${film}.paused && Math.abs(${film}.currentTime - ${tAt}) < .001`), `moment ${k}: steering never seeks or resumes the film`);
      await steer(.5); await settle();
      const p0 = await state(), f0 = await val(`${film}.currentTime`);
      await press();
      const rows = [];
      for (let i = 0; i < 14; i++) {
        if (i && (await val(`${film}.currentTime`)) > 69.8) break;
        await sleep(80);
        rows.push(await state());
        await shoot(path.join(OUT, `m${k}-${String(i).padStart(2,'0')}.png`));
      }
      const p1 = await state(), f1 = await val(`${film}.currentTime`), frames = (f1-f0)*30000/1001;
      check(f1 > f0 && Math.hypot(...p0.eye.map((v,i)=>v-p1.eye[i])) > .001, `moment ${k}: film advances the orbit with the mouse still`);
      check(rows.every(s => bounded(s) && centre(s)), `moment ${k}: music breathing keeps the ellipse centred and bounded`);
      check(p1.draws-p0.draws >= frames*.6 && p1.draws-p0.draws <= frames+5,
        `moment ${k}: ${p1.draws-p0.draws} depth draws for ${frames.toFixed(1)} film frames`);
      await press(); await settle();
      before = await state(); await sleep(450); after = await state();
      check(before.draws === after.draws && !after.moving, `moment ${k}: pausing again leaves no animation loop running`);
      await val(`${film}.currentTime = 72`); await sleep(400);
      check(!(await state()).visible, `moment ${k}: depth orbit exits with the Sagittarius passage`);
      fs.writeFileSync(path.join(OUT, `m${k}.json`), JSON.stringify({at, automatic, left, right, pixelDifference:mean, rows, frames, draws:p1.draws-p0.draws}, null, 1));
      try { execFileSync('ffmpeg', ['-hide_banner','-loglevel','error','-y','-framerate','8','-i',path.join(OUT,`m${k}-%02d.png`),'-vf','scale=760:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer','-loop','0',path.join(OUT,`m${k}-orbit.gif`)]); } catch(e) { console.log(`no orbit gif: ${e.message}`); }
      return;
    }
    // straight ahead: the page's own picture, the window hidden
    await driveEye(0); await sleep(250);
    let s0 = await val('window.dlDepth.state()'); await shoot(path.join(OUT, `m${k}-rest.png`));
    check(s0.visible === false, `moment ${k}: straight ahead the window is hidden (the page's picture shows)`);
    const rows = [];
    for (const [i, x] of EYE_X.entries()) {
      await driveEye(x);
      for (let w = 0; w < 80; w++) { const s = await val('window.dlDepth.state()'); if (s.visible && s.last && !s.moving && Math.abs(s.eye[0] - x) < 1e-3) break; await sleep(25); }
      await sleep(60);
      const s = await val('window.dlDepth.state()');
      const pixels = await shoot(path.join(OUT, `m${k}-${String(i).padStart(2, '0')}.png`), i === 0 || i === 5);
      rows.push({x, s, pixels});
    }
    const far = rows.find((r) => r.x === 0.1).s, near = rows.find((r) => r.x === -0.1).s;
    check(await val(`${film}.paused && Math.abs(${film}.currentTime - ${tAt}) < 0.001`), `moment ${k}: moving the viewpoint never changes the paused film's time`);
    const left = rows[0].pixels, right = rows[5].pixels;
    let total = 0, changed = 0;
    for (let p = 0; p < left.length; p += 4) {
      const delta = Math.abs(left[p] - right[p]) + Math.abs(left[p + 1] - right[p + 1]) + Math.abs(left[p + 2] - right[p + 2]);
      total += delta; if (delta > 18) changed++;
    }
    const pixelDifference = {mean: total / (left.length / 4 * 3), changedFraction: changed / (left.length / 4)};
    check(pixelDifference.mean > .5 && pixelDifference.changedFraction > .03,
      `moment ${k}: visible film pixels change with the mouse (mean ${pixelDifference.mean.toFixed(2)}, ${(pixelDifference.changedFraction * 100).toFixed(1)}% changed)`);
    if (POINTER) check(far.mode === 'mouse' && far.from === 'mouse', `moment ${k}: explicit manual mouse input works without camera input`);
    check(far.renderer === 'smooth-window-v1' && JSON.stringify(far.depthsMm) === '[-10,4,30]',
      `moment ${k}: the recovered smooth window and separate foreground flashes are active`);
    console.log(`moment ${k} (frame ${n}): eye +10 cm: slides px ${JSON.stringify(far.last?.slidesPx)}; draws ${far.draws}, a draw ${far.ms} ms`);
    check(far.visible && far.draws > 0, `moment ${k}: off the axis the window draws (${far.draws} draws)`);
    const fl = far.last.slidesPx.at(-1)[0] - near.last.slidesPx.at(-1)[0], bk = far.last.slidesPx[0][0] - near.last.slidesPx[0][0];
    check(fl < -30 && bk > 15, `moment ${k}: 20 cm of head: the flashes ${fl.toFixed(1)} px against it, the back ${bk.toFixed(1)} px with it`);
    // the law of rest: the same eye again draws nothing; straight ahead hides
    const d0 = (await val('window.dlDepth.state()')).draws; await driveEye(-0.06); await sleep(400);
    const d1 = (await val('window.dlDepth.state()')).draws;
    check(d1 === d0, `moment ${k}: a still head on a paused film draws nothing (${d1 - d0} draws in 0.4 s)`);
    // playing, off the axis: once a presented frame (the film plays on its own clock)
    await press();
    const p0 = await val('window.dlDepth.state().draws'), f0 = await val(`${film}.currentTime`); await sleep(1500);
    const p1 = await val('window.dlDepth.state().draws'), f1 = await val(`${film}.currentTime`), frames = (f1 - f0) * 30000 / 1001;
    check(f1 > f0 && p1 - p0 >= frames * 0.6 && p1 - p0 <= frames + 3, `moment ${k}: playing, ${p1 - p0} draws for ${frames.toFixed(0)} frames of the film`);
    await driveEye(0);
    for (let w = 0; w < 80; w++) { if (!(await val('window.dlDepth.state().moving'))) break; await sleep(25); }
    check((await val('window.dlDepth.state().visible')) === false, `moment ${k}: straight ahead again, hidden`);
    fs.writeFileSync(path.join(OUT, `m${k}.json`), JSON.stringify({at, frame: n, pixelDifference, rows: rows.map((r) => ({x: r.x, slidesPx: r.s.last?.slidesPx, draws: r.s.draws, ms: r.s.ms})), state: await val('window.dlDepth.state()')}, null, 1));
    // the sweep as a GIF (the picture's band of the stage)
    try {
      execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', '6', '-i', path.join(OUT, `m${k}-%02d.png`), '-vf', 'scale=760:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer', '-loop', '0', path.join(OUT, `m${k}-sweep.gif`)]);
    } catch (e) { console.log(`moment ${k}: no gif (${e.message})`); }
  } finally { clearTimeout(watchdog); try { child.kill('SIGKILL'); } catch {} fs.rmSync(dir, {recursive: true, force: true}); }
}

for (const [k, at] of AT.entries()) await moment(at, k);
const failed = checks.filter((c) => !c.ok).length;
console.log(failed ? `FAIL: ${failed} of ${checks.length} checks` : `PASS: ${checks.length} checks`);
process.exit(failed ? 1 : 0);
