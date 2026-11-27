#!/usr/bin/env node
// rewatch.proof.mjs: THE REWATCH. His words, Oct 17 2026 22:3x WEST, over the twelve drawn in the picture's middle while the anime's star
// blazed at the top: "it makes me fucking mad because you never rewatched it... do you know what is the neuro-spatial differential or not?",
// then "then fucking do that before submitting me results porcoddio". No result on the hero goes to him before this has been run and looked at.
// The neuro-spatial differential, as he holds it: observation minus prediction. Here the anime is the observation, the twelve the prediction.
//   1. A muted headless Chrome, off every screen, at his window's shape (--size, his preview pane by default), opens the served page at
//      ?debug=<from - 1> and, from --from to --to, takes the composited glass, each shot with the film's second the theater drew
//      (hero.state().last.t before and after it), the twelve's own word (last.flight) and the canvas's place on the page. FRAME BY FRAME:
//      --rate 0.1 slows the film to a tenth once the debug start lets it go, so every frame stands about a third of a second and gets its
//      own shot (a screenshot takes 0.1 to 0.2 s; at the film's own rate the shots fall every 3 to 6 frames).
//   2. Beside each shot, the film frame it shows, FOUND BY LOOKING, never by the clock (his 22:5x WEST: "you are still moving in lead vs in
//      time... fucking watch the thing frame by frame, run vision on the fucking frames"): the page's picture, where the shots show it, against
//      each film frame near the theater's clock, both 96 x 64 grey, the share of pixels within 24 of each other. window is the frames the
//      theater drew from just before the shot to just after it: a shot taken by the clock alone is off by up to that much (the first sheets'
//      fault), and a lag of the twelve behind the picture smaller than it cannot be seen here. One row a frame: the best-matched shot of each.
//      Measured on that frame: the anime's light (the centroid of its hottest pixels inside the crop; none when nothing burns), the
//      twelve's light and their faces' centroid (theater.js state: canvas heights centred, y up), all in the picture's 0..1 as the shots show
//      it, and how many faces stand inside the picture. d_light and d_faces: the anime's light to the twelve's and to their faces' centre, in
//      picture heights.
//   3. Out: page-NNN.png, pair-FFFF.png (frame FFFF: the page | the anime, marks on these copies only, never on the page: cyan the anime's
//      light, magenta the twelve's light, yellow their faces' centroid), sheet-K.png (the frames --frames names, or the nearest to --at's
//      seconds; two pairs a row, three rows a sheet), frames.json, differential.json and the table on stdout. Judged by eye, sheet by sheet,
//      before anything goes to him.
//   nice -n 19 node lab/rewatch.proof.mjs --url http://127.0.0.1:<port>/intro/dyson-society/app/warm.html --out <dir>
//     [--from 42.2] [--to 45.6] [--rate 0.1] [--size 839x1053] [--film app/saint-seiya.mp4] [--at s,s,...] [--frames 1290-1303] [--chrome <path>]
//   nice -n 19 node lab/rewatch.proof.mjs --in <a run's out dir>    (the pairs, the sheets and the table again, from shots already taken)
// The page must be served with byte ranges (tools/serve-range, aiolos), never python's http.server (the house's rule 8). Requests leave only
// to the page's own origin and its Nest. It ends its Chrome and its profile and gives itself 120 s for the shots (longer by the slowing).
// COST: one Chrome for half a minute (frame by frame, about 40 s for the 3.4 s), then ffmpeg a few calls a shot; run it on the new Mac, niced.
// Exit 0 ran, 2 could not run.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn, execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const URL_ = opt('--url', ''), FROM = Number(opt('--from', '42.2')), TO = Number(opt('--to', '45.6')), IN = opt('--in', '');
const OUT = IN || opt('--out', ''), FILM = opt('--film', path.join(here, '../app/saint-seiya.mp4'));
const [W0, H0] = opt('--size', '839x1053').split('x').map(Number);
const RATE = Number(opt('--rate', '1')), FRAMES = opt('--frames', '');
const AT = opt('--at', '42.30,42.40,42.55,42.75,43.00,43.30,43.60,43.90,44.20,44.50,44.80,45.00,45.15,45.30,45.40,45.50').split(',').map(Number);
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// the picture's crop in the film's pixels (theater-light.json), the film's frame rate
const [CX, CY, CW, CH] = JSON.parse(fs.readFileSync(path.join(here, 'theater-light.json'), 'utf8')).crop, FA = CW / CH, FPS = 30000 / 1001;

/** 1. The shots: the composited glass from FROM to TO, each with the theater's second and the twelve's word. */
async function shots() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rewatch-'));
  const page = new URL(URL_); page.searchParams.set('debug', String(Math.max(2, FROM - 1)));
  const child = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${W0},${H0}`,
    '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', 'about:blank'], {stdio: 'ignore'});
  const end = () => { try { child.kill('SIGKILL'); } catch { /* gone */ } try { fs.rmSync(dir, {recursive: true, force: true}); } catch { /* gone */ } };
  const limit = Math.max(120, (TO - FROM) / RATE + 90);
  const deadline = setTimeout(() => { console.error(`rewatch: no end in ${limit} s`); end(); process.exit(2); }, limit * 1000);
  try {
    let port = null;
    for (let i = 0; i < 150 && !port; i++) { try { port = fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch { await sleep(100); } }
    if (!port) throw new Error('Chrome did not open its debugging port');
    const target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const pending = new Map();
    ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({id: i, method, params})); });
    const value = async (expression) => (await send('Runtime.evaluate', {expression, returnByValue: true})).result?.result?.value;
    await send('Emulation.setDeviceMetricsOverride', {width: W0, height: H0, deviceScaleFactor: 1, mobile: false});
    await send('Page.enable');
    await send('Page.navigate', {url: page.href});
    let debug = null;
    for (let i = 0; i < 400 && !debug; i++) { debug = await value('window.dlTwelve?.state?.()?.debug?.released ? window.dlTwelve.state().debug : null'); if (!debug) await sleep(100); }
    if (!debug) throw new Error('the debug start never released (no hero on this page?)');
    if (RATE !== 1) await value(`(() => { const v = document.querySelector('video'); if (v) v.playbackRate = ${RATE}; return v ? v.playbackRate : null; })()`);
    const READ = `(() => { const v = document.querySelector('video'), L = window.hero?.state?.()?.last, c = document.getElementById('hero-front');
      const b = c ? c.getBoundingClientRect() : null;
      return {v: v ? v.currentTime : null, t: L ? L.t : null, flight: L ? L.flight ?? null : null, canvas: b ? [b.x, b.y, b.width, b.height] : null}; })()`;
    const frames = [];
    for (let guard = 0; guard < 20000 && frames.length < 900; guard++) {
      const s = await value(READ);
      if (!s || s.t === null || !s.canvas) { await sleep(30); continue; }
      if (s.t >= TO || (s.v ?? 0) >= TO + 0.3) break;
      if (s.t < FROM) { await sleep(20); continue; }
      const shot = await send('Page.captureScreenshot', {format: 'png'});
      const after = await value('window.hero?.state?.()?.last?.t ?? null');
      const n = String(frames.length).padStart(3, '0');
      fs.writeFileSync(path.join(OUT, `page-${n}.png`), Buffer.from(shot.result.data, 'base64'));
      frames.push({n, t: s.t, t_after: after, v: s.v, canvas: s.canvas, flight: s.flight});
    }
    if (!frames.length) throw new Error(`no frame between ${FROM} and ${TO} s`);
    fs.writeFileSync(path.join(OUT, 'frames.json'), JSON.stringify({url: page.href, size: [W0, H0], rate: RATE, debug, frames}, null, 1));
    console.log(`rewatch: ${frames.length} shots, ${frames[0].t.toFixed(3)} to ${frames.at(-1).t.toFixed(3)} s, at ${W0}x${H0}`);
  } finally { clearTimeout(deadline); end(); }
}

/** 2 and 3. The film frame each shot shows, found by looking; one row a frame; the differential measured; the pairs and the sheets drawn. */
function compose() {
  const ff = (a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...a], {maxBuffer: 256 << 20});
  const run = JSON.parse(fs.readFileSync(path.join(OUT, 'frames.json'), 'utf8')), [W, H] = run.size, GW = 199, GH = 133, SW = 96, SH = 64;
  // a frame of the film by its number: ffmpeg seeks to half a frame before it and takes the first frame at or after (frame f starts at f / FPS);
  // frames as they are (-fps_mode passthrough): ffmpeg 9 otherwise repeats the first frame of a run to hold its rate, and every frame after it
  // reads one late (on the new Mac the sky cut's first frame, 1269, read as Seiya on the ground)
  const at = (fr) => ((fr - 0.5) / FPS).toFixed(5), anime = (fr, k, size) => ff(['-ss', at(fr), '-i', FILM, '-frames:v', String(k), '-fps_mode', 'passthrough',
    '-vf', `crop=${CW}:${CH}:${CX}:${CY},scale=${size},format=gray`, '-f', 'rawvideo', '-']);
  // the film's frames over the whole stretch, read once: 96 x 64 grey to match by, 199 x 133 grey to find the light in
  const tMin = Math.min(...run.frames.map((f) => Math.min(f.t, f.t_after ?? f.t))), tMax = Math.max(...run.frames.map((f) => Math.max(f.t, f.t_after ?? f.t)));
  const LO = Math.max(0, Math.floor(tMin * FPS) - 8), K = Math.ceil(tMax * FPS) + 5 - LO;
  const small = anime(LO, K, `${SW}:${SH}`), big = anime(LO, K, `${GW}:${GH}`), have = Math.min(small.length / (SW * SH), big.length / (GW * GH));
  // THE PICTURE'S BAND on the page, read off the shots themselves: the longest run of rows that are not black, then its columns; the median
  // over the shots where it stands out (a shot on the burst's black finds none and is skipped), forty shots at most
  const runOf = (a, thr) => { let best = [0, -1], s0 = -1; a.forEach((v, i) => { if (v > thr) { if (s0 < 0) s0 = i; if (i - s0 > best[1] - best[0]) best = [s0, i]; } else s0 = -1; }); return best; };
  const step = Math.max(1, Math.floor(run.frames.length / 40));
  const bands = run.frames.filter((_, i) => i % step === 0).map((f) => {
    const g = ff(['-i', path.join(OUT, `page-${f.n}.png`), '-vf', 'format=gray', '-f', 'rawvideo', '-']), rows = new Array(H).fill(0), cols = new Array(W).fill(0);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) rows[y] += g[y * W + x] / W;
    const [y0, y1] = runOf(rows, 14);
    if (y1 - y0 < H * 0.25) return null;
    for (let y = y0; y <= y1; y++) for (let x = 0; x < W; x++) cols[x] += g[y * W + x] / (y1 - y0 + 1);
    const [x0, x1] = runOf(cols, 8);
    return x1 - x0 < W * 0.4 ? null : [x0, y0, x1 - x0 + 1, y1 - y0 + 1];
  }).filter(Boolean);
  if (!bands.length) throw new Error('no shot shows the picture: the band could not be read');
  const med = (i) => bands.map((b) => b[i]).sort((a, b) => a - b)[bands.length >> 1], BAND = [0, 1, 2, 3].map(med);
  // THE FRAME A SHOT SHOWS, found by looking: the page's band against each film frame from 6 before the theater's draws around the shot to 3
  // after, both 96 x 64 grey; the share of pixels within 24 of each other (the twelve cover some of the picture, the rest is the film's own).
  // The anime holds a drawing two or three frames, and looking cannot tell the frames of a hold apart: every frame within 0.02 of the best is
  // the same picture, and of those the frame inside the draws' window wins, then the nearest to the draw after the shot
  const matchFrame = (f) => {
    const w0 = Math.floor(Math.min(f.t, f.t_after ?? f.t) * FPS), w1 = Math.floor(Math.max(f.t, f.t_after ?? f.t) * FPS);
    const page = ff(['-i', path.join(OUT, `page-${f.n}.png`), '-vf', `crop=${BAND[2]}:${BAND[3]}:${BAND[0]}:${BAND[1]},scale=${SW}:${SH},format=gray`, '-f', 'rawvideo', '-']);
    const seen = [];
    for (let fr = Math.max(LO, w0 - 6); fr <= Math.min(LO + have - 1, w1 + 3); fr++) {
      const o = (fr - LO) * SW * SH; let ok = 0;
      for (let i = 0; i < SW * SH; i++) if (Math.abs(page[i] - small[o + i]) <= 24) ok++;
      seen.push({frame: fr, score: ok / (SW * SH), near: (fr >= w0 && fr <= w1 ? 0 : 1000) + Math.abs(fr - w1)});
    }
    const top = Math.max(...seen.map((c) => c.score)), best = seen.filter((c) => c.score >= top - 0.02).sort((a, b) => a.near - b.near)[0];
    return {frame: best.frame, score: best.score, window: [w0, w1]};
  };
  // the anime's light in frame fr: the centroid of the pixels within 6 of the frame's hottest, inside the crop; none when max < 200
  const animeLight = (fr) => {
    const o = (fr - LO) * GW * GH; let max = 0;
    for (let i = 0; i < GW * GH; i++) if (big[o + i] > max) max = big[o + i];
    if (max < 200) return {max, u: null, v: null};
    let sx = 0, sy = 0, n = 0;
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (big[o + y * GW + x] >= max - 6) { sx += x + 0.5; sy += y + 0.5; n++; }
    return {max, u: sx / n / GW, v: sy / n / GH};
  };
  const [bx, by, bw, bh] = BAND, ph = bh;   // the picture on the page, css px, as the shots show it
  const fromPicture = (u, v) => [bx + u * bw, by + v * bh], toPicture = ([x, y]) => [(x - bx) / bw, (y - by) / bh];
  const all = run.frames.map((f) => {
    const m = matchFrame(f), [cx, cy, cw, ch] = f.canvas;
    const fromState = (x, y) => [cx + x * cw, cy + (1 - y) * ch];   // theater.js: light = [.5 + L.x * h / w, .5 + L.y] (canvas heights, y up)
    const a = animeLight(m.frame), fl = f.flight;
    const A = a.u === null ? null : fromPicture(a.u, a.v), L = fl?.light ? fromState(fl.light[0], fl.light[1]) : null;
    const faces = (fl?.faces || []).map(([x, y]) => fromState(x, y));
    const C = faces.length ? [faces.reduce((s, q) => s + q[0], 0) / faces.length, faces.reduce((s, q) => s + q[1], 0) / faces.length] : null;
    const inPicture = faces.filter((q) => { const [u, v] = toPicture(q); return u >= 0 && u <= 1 && v >= 0 && v <= 1; }).length;
    const d = (p, q) => (p && q ? +(Math.hypot(p[0] - q[0], p[1] - q[1]) / ph).toFixed(3) : null), r3 = (p) => (p ? toPicture(p).map((x) => +x.toFixed(3)) : null);
    return {n: f.n, frame: m.frame, t: +(m.frame / FPS).toFixed(3), window: m.window, in_window: m.frame >= m.window[0] && m.frame <= m.window[1],
      match: +m.score.toFixed(3), phase: fl?.phase ?? null, anchor: fl?.anchor ?? null, faces: faces.length, faces_in_picture: inPicture,
      anime_light: a.u === null ? null : [+a.u.toFixed(3), +a.v.toFixed(3)], anime_max: a.max, twelve_light: r3(L), faces_centre: r3(C),
      d_light: d(A, L), d_faces: d(A, C), marks: {A, L, C}};
  });
  // one row a frame: of the shots that show it, the best matched
  const byFrame = new Map();
  for (const r of all) if (!byFrame.has(r.frame) || r.match > byFrame.get(r.frame).match) byFrame.set(r.frame, r);
  const rows = [...byFrame.values()].sort((a, b) => a.frame - b.frame);
  const box = (p, color, s = 16) => (p ? `,drawbox=x=${Math.round(p[0] - s / 2)}:y=${Math.round(p[1] - s / 2)}:w=${s}:h=${s}:color=${color}@1:t=4` : '');
  for (const r of rows) {
    const ah = Math.round(W / FA), top = Math.round((H - ah) / 2), am = r.anime_light ? [r.anime_light[0] * W, top + r.anime_light[1] * ah] : null;
    ff(['-i', path.join(OUT, `page-${r.n}.png`), '-ss', at(r.frame), '-i', FILM, '-frames:v', '1', '-fps_mode', 'passthrough', '-filter_complex',
      `[0:v]format=rgb24${box(r.marks.A, 'cyan')}${box(r.marks.L, 'magenta')}${box(r.marks.C, 'yellow')}[p];` +
      `[1:v]crop=${CW}:${CH}:${CX}:${CY},scale=${W}:${ah},pad=${W}:${H}:0:${top}:black,format=rgb24${box(am, 'cyan')}[a];[p][a]hstack=inputs=2,scale=${W}:-2`,
      '-y', path.join(OUT, `pair-${String(r.frame).padStart(4, '0')}.png`)]);
  }
  // the sheets: the frames --frames names (a-b, or a,b,c), else the frame nearest each of --at's seconds
  const named = FRAMES ? FRAMES.split(',').flatMap((p) => { const [a, b] = p.split('-').map(Number); return b ? Array.from({length: b - a + 1}, (_, i) => a + i) : [a]; }) : null;
  const pick = [...new Set(named ? named.map((fr) => rows.find((r) => r.frame === fr)).filter(Boolean).map((r) => r.frame)
    : AT.map((s) => rows.reduce((b, r) => (Math.abs(r.t - s) < Math.abs(b.t - s) ? r : b), rows[0]).frame))], sheets = [];
  for (let k = 0; k * 6 < pick.length; k++) {
    const part = pick.slice(k * 6, k * 6 + 6), cells = [...part, ...Array(6 - part.length).fill(null)];
    const inputs = cells.flatMap((fr) => (fr ? ['-i', path.join(OUT, `pair-${String(fr).padStart(4, '0')}.png`)] : ['-f', 'lavfi', '-i', `color=c=white:s=${W}x${Math.round(H / 2)}`]));
    ff([...inputs, '-filter_complex', cells.map((_, i) => `[${i}:v]scale=${W}:${Math.round(H / 2)},setsar=1[s${i}]`).join(';') + ';' +
      cells.map((_, i) => `[s${i}]`).join('') + 'xstack=inputs=6:layout=0_0|w0_0|0_h0|w0_h0|0_h0+h1|w0_h0+h1:fill=white', '-frames:v', '1', '-y', path.join(OUT, `sheet-${k}.png`)]);
    sheets.push({sheet: `sheet-${k}.png`, frames: part});
  }
  const inWin = all.filter((r) => r.match >= 0.8), held = inWin.filter((r) => r.in_window).length;
  fs.writeFileSync(path.join(OUT, 'differential.json'), JSON.stringify({band: BAND, crop: [CX, CY, CW, CH], size: [W, H], rate: run.rate ?? 1,
    shots: all.length, frames: rows.length, well_matched: inWin.length, inside_window: held, sheets, rows: rows.map(({marks, ...r}) => r)}, null, 1));
  console.log(`the picture's band on the page: ${BAND.join(' ')} (x y w h, from ${bands.length} shots); ${all.length} shots, ${rows.length} frames; ` +
    `of the ${inWin.length} well-matched shots (0.8 or more), ${held} show a frame inside the theater's draws around them`);
  console.log('frame  t       window      match  phase     faces in-pic  anime light    twelve light   faces centre   d_light d_faces');
  for (const r of rows) console.log(`${String(r.frame).padEnd(6)} ${r.t.toFixed(3).padEnd(7)} ${`${r.window[0]}-${r.window[1]}`.padEnd(10)}${r.in_window ? ' ' : '*'} ${r.match.toFixed(2).padStart(5)}  ${String(r.phase).padEnd(9)} ${String(r.faces).padStart(5)} ${String(r.faces_in_picture).padStart(6)}  ${JSON.stringify(r.anime_light).padEnd(14)} ${JSON.stringify(r.twelve_light).padEnd(14)} ${JSON.stringify(r.faces_centre).padEnd(14)} ${String(r.d_light).padStart(7)} ${String(r.d_faces).padStart(7)}`);
  console.log('sheets:', sheets.map((s) => `${s.sheet} (frames ${s.frames.join(', ')})`).join('; '));
}

try {
  if (!OUT || (!IN && (!URL_ || !CHROME))) { console.error('usage: rewatch.proof.mjs --url <the served mint page> --out <dir> [--from s] [--to s] [--rate r] [--size WxH] [--frames a-b] | --in <dir>'); process.exit(2); }
  fs.mkdirSync(OUT, {recursive: true});
  if (!IN) await shots();
  compose();
} catch (e) { console.error('rewatch:', e.message); process.exit(2); }
