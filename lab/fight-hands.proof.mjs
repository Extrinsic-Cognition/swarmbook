// fight-hands.proof.mjs: SEIYA'S HANDS OFF THE AIR, proved in a real browser (Oct 25 2026; his words, 12:0x WET: "do you know what it fucking means
// to have seya vorpx'd across all devices", then "Yes: build the ear on every glass, so each glass's fight page takes Seiya's hands straight off the
// air at the cause's stamp, with the Nest as the record only"). One headless Chrome off every screen opens the fight page as tv1's frame opens it
// (?for=harleyquintiti&seat=...), served by the house's own range server (tools/serve-range, built here) with embertide-app/ui as its root, the way
// the rite serves /intro/; no Nest (nest=0: the record is not this proof's road). The real ear (pad-kit/wave-ear.mjs) stands on a loopback group
// with a key made here for the proof (never a key of the house), its door to the page on loopback. The proof seals his presses as the pad's sender
// does (the house's milliseconds at the capture), sends each on the wave at its own instant with a copy beside it, and reads the page's own fight.
//   nice -n 19 node lab/fight-hands.proof.mjs [--chrome <path>]
// PASS, all of: the page took every Hand (a copy never twice); every press is the page's at the beat of its cause's stamp; the page's presses and
// its plan's digest equal the fight the same causes give the law in node (fight-hands.mjs: the replica beside it); no cause read unstamped; each
// Hand on the page within 100 ms of its send (the CDP read's own trip included). Exit 0 PASS, 1 a check fails, 2 it could not run; the JSON last.
import fs from 'node:fs';
import os from 'node:os';
import net from 'node:net';
import path from 'node:path';
import crypto from 'node:crypto';
import dgram from 'node:dgram';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as F from './fight-lyssa-seiya.mjs';
import * as H from './fight-hands.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), UI = path.resolve(HERE, '../../..'), HOUSE = path.resolve(UI, '../..');
const EAR = path.join(HOUSE, 'embertide-app/tools/nest-join/jobs/carried/pad/pad-kit/wave-ear.mjs');
const opt = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const PLAYWRIGHT = path.join(os.homedir(), 'Library/Caches/ms-playwright');
const playwrightChromes = () => { let b = []; try { b = fs.readdirSync(PLAYWRIGHT).filter((d) => /^chromium-\d+$/.test(d)); } catch { return []; }
  return b.sort((x, y) => Number(y.slice(9)) - Number(x.slice(9))).flatMap((d) => ['chrome-mac-arm64', 'chrome-mac'].map((s) => path.join(PLAYWRIGHT, d, s, 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'))); };
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', '/Applications/Chromium.app/Contents/MacOS/Chromium', ...playwrightChromes()];
const CHROME = opt('--chrome', process.env.CHROME || CHROMES.find((c) => fs.existsSync(c)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const freePort = () => new Promise((ok, no) => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => ok(p)); }); s.on('error', no); });

// the pad's frame, as embertide-pad frame::seal writes it: `ECPD` 1 | key 32 | class seat capture(u64 LE) v[6](i32 LE) | the signature over all before it
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519'), PUB = publicKey.export({ format: 'der', type: 'spki' }).subarray(12);
const seal = (capture, v) => { const f = Buffer.alloc(135); f.write('ECPD', 0, 'latin1'); f[4] = 1; PUB.copy(f, 5); f[37] = 4; f[38] = 2; f.writeBigUInt64LE(BigInt(capture), 39);
  v.forEach((x, i) => f.writeInt32LE(x, 47 + 4 * i)); crypto.sign(null, f.subarray(0, 71), privateKey).copy(f, 71); return f; };
const hand = (buttons = 0, dpad = 8) => [0x80808080 | 0, dpad << 16, buttons, 1 << 8, 0, 0];

async function main() {
  if (!CHROME) { console.error('no Chrome on this Mac'); return 2; }
  const out = { proof: 'fight-hands', chrome: CHROME, when: new Date().toISOString() }, kids = [];
  const serveSrc = path.join(HOUSE, 'tools/serve-range/serve.c'), serve = path.join(os.tmpdir(), `serve-range-hands-${process.pid}`), SDK265 = '/Library/Developer/CommandLineTools/SDKs/MacOSX26.5.sdk';
  let cc = spawnSync('cc', ['-O2', '-o', serve, serveSrc, '-lpthread']);   // the new Mac's SDK 27 links neither -lpthread nor, some runs, libSystem; 26.5 does (skin-glass.proof.mjs)
  if (cc.status !== 0) cc = spawnSync('cc', ['-O2', '-o', serve, serveSrc]);
  if (cc.status !== 0 && fs.existsSync(SDK265)) cc = spawnSync('cc', ['-O2', '-o', serve, serveSrc], { env: { ...process.env, SDKROOT: SDK265 } });
  if (cc.status !== 0) { console.error('serve-range did not build: ' + String(cc.stderr).slice(0, 300)); return 2; }
  const PORT = await freePort(), UDP = 40000 + Math.floor(Math.random() * 20000), dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'fight-hands-proof-'));
  const server = spawn(serve, ['-p', String(PORT), '-t', '180', '-q', UI], { stdio: ['ignore', 'ignore', 'pipe'] }); kids.push(server);
  let served = ''; server.stderr.on('data', (d) => { served += d; });
  const ear = spawn(process.execPath, [EAR, '--group', `239.42.0.77:${UDP}`, '--iface', '127.0.0.1', '--pin', PUB.toString('hex'), '--sink', 'none', '--page', '127.0.0.1:0'], { stdio: ['ignore', 'ignore', 'pipe'] }); kids.push(ear);
  let earSaid = ''; ear.stderr.on('data', (d) => { earSaid += d; });
  const child = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--window-size=960,540', '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-default-apps',
    '--disable-features=Translate,MediaRouter,OptimizationHints', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
    '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', 'about:blank'], { stdio: 'ignore' }); kids.push(child);
  let ws = null; const udp = dgram.createSocket('udp4');
  const end = async () => { try { ws?.close(); } catch {} try { udp.close(); } catch {} for (const k of kids) { try { k.kill('SIGTERM'); } catch {} }
    for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100); if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} }
    try { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(serve, { force: true }); } catch {} };
  const bound = setTimeout(() => { console.error('150 s passed: ended'); end().then(() => process.exit(2)); }, 150000);
  try {
    for (let i = 0; i < 100 && !/ at http:\/\//.test(served); i++) { await sleep(50); if (server.exitCode !== null) break; }   // the server says where it serves once it does
    if (!/ at http:\/\//.test(served)) throw new Error(`the range server did not serve${server.exitCode !== null ? ` (exit ${server.exitCode})` : ''}: ${served.slice(0, 200)}`);
    let door = null; for (let i = 0; i < 100 && !door; i++) { await sleep(50); const m = /the page door (ws:\/\/\S+)/.exec(earSaid); if (m && /listening on/.test(earSaid)) door = m[1]; }
    if (!door) throw new Error(`the ear opened no door: ${earSaid.slice(0, 300)}`);
    let port = null; for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]); } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json());
    ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map(), errors = [];
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, { resolve, reject, method }); ws.send(JSON.stringify({ id: n, method, params, sessionId })); });
    ws.onmessage = (m) => { const x = JSON.parse(m.data); if (x.id && wait.has(x.id)) { const w = wait.get(x.id); wait.delete(x.id); return x.error ? w.reject(new Error(`${w.method}: ${x.error.message}`)) : w.resolve(x.result); }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 200)); };
    const t = await send('Target.createTarget', { url: 'about:blank', newWindow: true, width: 960, height: 540 });
    const s = (await send('Target.attachToTarget', { targetId: t.targetId, flatten: true })).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable']) await send(m, {}, s);
    const read = async (expr) => JSON.parse((await send('Runtime.evaluate', { expression: `JSON.stringify(${expr})`, returnByValue: true }, s)).result?.value ?? 'null');
    const url = `http://127.0.0.1:${PORT}/intro/dyson-society/lab/fight-lyssa-seiya.html?for=harleyquintiti&seat=proof&nest=0&ear=${encodeURIComponent(door)}`;
    out.url = url; const nav = await send('Page.navigate', { url }, s); if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    let up = null; for (let i = 0; i < 600; i++) { await sleep(100); try { up = await read('window.FIGHT && window.FIGHT.ready ? { ear: window.FIGHT.ear || null } : null'); } catch { up = null; } if (up && up.ear) break; }
    if (!up || !up.ear) throw new Error(`the page did not take the ear's door in 60 s (${JSON.stringify(up)}; errors ${errors.slice(0, 2).join(' | ')})`);
    // his presses, each at its own instant: ✕ opens the fight; △ two beats in; the d-pad's right a beat after; each released 40 ms later
    const law = { measured: JSON.parse(fs.readFileSync(path.join(HERE, 'seiya-fight.hades.json'), 'utf8')), bodies: JSON.parse(fs.readFileSync(path.join(HERE, 'seiya-bodies.hades.json'), 'utf8')) };
    const start = Date.now() + 300, plan = [[0, H.BIT.CROSS, 8], [40, 0, 8]];
    const t0 = start + H.LEAD_MS; plan.push([t0 - start + 2 * F.BEAT_MS + 60, H.BIT.TRIANGLE, 8], [t0 - start + 2 * F.BEAT_MS + 100, 0, 8], [t0 - start + 3 * F.BEAT_MS + 60, 0, 2], [t0 - start + 3 * F.BEAT_MS + 100, 0, 8]);
    const sent = [], lags = []; let seen = 0;
    for (const [dt, buttons, dpad] of plan) {
      const at = start + dt; while (Date.now() < at) await sleep(Math.min(5, at - Date.now()));
      const capture = Date.now(), f = seal(capture, hand(buttons, dpad)); sent.push({ capture, v: hand(buttons, dpad) });
      await new Promise((ok) => udp.send(f, UDP, '127.0.0.1', ok)); await new Promise((ok) => udp.send(f, UDP, '127.0.0.1', ok));   // the wave's copy beside it
      const a = Date.now(); let n = seen; while (n === seen && Date.now() - a < 2000) { n = (await read('window.FIGHT.hands_seen || 0')) || 0; }
      lags.push(Date.now() - capture); seen = n;
    }
    await sleep(200);
    const page = await read('({ fight: window.FIGHT.fight, hands_seen: window.FIGHT.hands_seen || 0, hands: window.FIGHT.hands || 0, unstamped: window.FIGHT.unstamped || 0, digest: window.FIGHT.digest(), ear: window.FIGHT.ear })');
    // the replica beside it: the same causes, the law in node
    let fight = null, prev = null; for (const c of sent) { const r = H.takeHandValue(fight, prev, c, Date.now() + 9999, law); prev = r.cur; if (r.value) fight = r.value; }
    const want = F.planFight({ ...law, protect: true, his: fight.his });
    out.sent = sent.length; out.page = { hands_seen: page.hands_seen, presses: page.fight?.his || null, t0: page.fight?.t0 ?? null, digest: page.digest, unstamped: page.unstamped };
    out.replica = { presses: fight.his, t0: fight.t0, digest: H.digestOf(want) }; out.lag_ms = { each: lags, max: Math.max(...lags) }; out.errors = errors.slice(0, 5);
    const checks = [
      ['every Hand taken once (a copy never twice)', page.hands_seen === sent.length],
      ['the fight opened a beat from the first cause\'s stamp', page.fight && page.fight.t0 === sent[0].capture + H.LEAD_MS],
      ['the page\'s presses are the replica\'s, beat for beat', JSON.stringify(page.fight?.his) === JSON.stringify(fight.his) && fight.his.length === 2],
      ['the page\'s plan is the replica\'s (the digest)', page.digest === H.digestOf(want)],
      ['no cause read unstamped', page.unstamped === 0],
      ['each Hand on the page within 100 ms of its send', Math.max(...lags) < 100],
      ['no error thrown on the page', errors.length === 0],
    ];
    out.checks = checks.map(([what, ok]) => ({ what, ok })); out.pass = checks.every(([, ok]) => ok);
    for (const [what, ok] of checks) console.error(`${ok ? 'green' : 'RED  '} ${what}`);
    console.log(JSON.stringify(out));
    return out.pass ? 0 : 1;
  } catch (e) { out.error = String(e.message || e); console.error(out.error); console.log(JSON.stringify(out)); return 2; }
  finally { clearTimeout(bound); await end(); }
}
main().then((c) => process.exit(c));
