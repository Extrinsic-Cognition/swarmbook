#!/usr/bin/env node
// dl-handoff.proof.mjs: HER CARD AND HER CODE COME UP, proved in a real browser (dl-handoff.js, the page's half of her step out; his Oct 24 2026
// 18:3x WEST: "she appears when i scan the qr code dude on optimism.fit mint page... the dysonlight app on the iphone dude..."). A muted headless
// Chrome, off every screen, opens the mint on her road (?handoff=lan: tools/mint-dev.mjs --lan --nest <url> --glass <seat> sends / there and names
// the house on /dev/lan; its --start <s>, the page's ?debug=<s>, starts the film short of her stop), presses nothing, and waits for her landing
// (dl-athena.js's landed: her card comes up by itself, as it does for him). Then it reads her card (her perch, her own pixels on it, a whole number
// of screen pixels per card pixel), its code and its line, takes a picture of the glass, and reads the code back from that picture with Apple's
// Vision (tools/embertide-mesh/projector-scan/vision.mjs: the reader the iPad's walk and the Viewer run, of the iPhone camera's own family).
//   nice -n 19 node app/dl-handoff.proof.mjs --url <the page on her road> [--house <host:port> --glass <seat> [--pick <folder>]] [--screenshot <png>]
//     [--limit 180] [--chrome <path>] [--width 1512] [--height 982] [--scale 2]
// HER CARD IS THE PICK'S (Nov 2 2026): --pick <folder> holds a pick as tools/embertide-mesh/onboarding-pick.mjs makes one: warden.json (character/warden's
// value) and its pictures (<sha256>.png). This proof then answers the page's house questions from it, as the house would: /dev/lan names --house and --glass,
// the house's Nest answers character/warden, and the pictures stand beside the page as the pick lays them (left-bodies/<sha256>.mjs); the Nest's blob door
// stays refused, as the real Nest refuses a caller off its Mac. PASS then also needs the card to be the pick's: its perch and her sprite read off that road,
// checked by their hash, and the code naming them (k=, h=). Without --pick the code names no card of its own (the product's). --pick-face <png> makes that
// folder here from a face (tools/her-card.mjs makeCard, room/character-fact.mjs wardenPick: the pick tool's own makers; needs magick), so the lander proves it.
// The glass: 1512 x 982 at 2 is the new Mac's own (the glass the card sits on, --glass newmac). The Chrome: as dl-twelve.proof.mjs finds it.
// PASS, all of: she landed and her card came up with nothing pressed; her perch and her own pixels on it; the card at a whole number of screen
// pixels per card pixel; the code drawn; its link opens DysonLight with this visit and round; with --house and --glass the link names that Nest,
// that glass and the card's place on the glass as measured here (without them: a house named only when the page has one); and Vision reads that
// same link off the picture. Exit 0 on PASS, 1 on FAIL, 2 when it could not run. Requests leave only to the page's own origin (Fetch interception):
// the house's Nest the page would hear her words on is refused here and counted (refused), so nothing reaches the live house. It ends everything it
// started (the Chrome by pid, its profile folder; the picture stays only where --screenshot puts it) and gives itself --limit seconds.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };
const URL_ = opt('--url', null), HOUSE = opt('--house', null), GLASS = opt('--glass', null), SHOT = opt('--screenshot', null), PICK_FACE = opt('--pick-face', null);
const LIMIT_S = Number(opt('--limit', '180')), W = Number(opt('--width', '1512')), H = Number(opt('--height', '982')), SCALE = Number(opt('--scale', '2'));
const PLAYWRIGHT = path.join(os.homedir(), 'Library/Caches/ms-playwright');
/** the Playwright Chromes for Testing in this user's cache, newest build first (as dl-twelve.proof.mjs finds them) */
function playwrightChromes(root = PLAYWRIGHT) {
  let builds = [];
  try { builds = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)); } catch { return []; }
  return builds.sort((a, b) => Number(b.slice(9)) - Number(a.slice(9))).flatMap((d) => ['chrome-mac-arm64', 'chrome-mac']
    .map((sub) => path.join(root, d, sub, 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')));
}
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', '/Applications/Chromium.app/Contents/MacOS/Chromium', ...playwrightChromes()];
const CHROME = opt('--chrome', process.env.CHROME || CHROMES.find(c => fs.existsSync(c)));
const VISION = new URL('../../../../../tools/embertide-mesh/projector-scan/vision.mjs', import.meta.url);   // the house root, from app/
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
/** pickOfFace(face) -> folder: a pick made here from a face as onboarding-pick.mjs makes one (the card by makeCard, the entry by wardenPick), in a scratch folder */
async function pickOfFace(face) {
  const {makeCard} = await import(new URL('../tools/her-card.mjs', import.meta.url).href), {wardenPick} = await import(new URL('../../room/character-fact.mjs', import.meta.url).href);
  const folder = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'dl-handoff-pick-')), made = makeCard({face, out: path.join(folder, 'made')});
  const sha = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex'), card = {sprite: sha(made.sprite), perch: sha(made.perch), card: sha(made.card)};
  for (const k of ['sprite', 'perch', 'card']) fs.copyFileSync(made[k], path.join(folder, `${card[k]}.png`));
  fs.writeFileSync(path.join(folder, 'warden.json'), JSON.stringify(wardenPick({name: path.basename(face, '.png'), face: sha(face), at: Date.now(), card})));
  return folder;
}
/** pickFrom(folder): a pick's folder read: its entry (warden.json), its card, and each picture's laid module by its sha256 (left-body.mjs moduleOf) */
async function pickFrom(folder) {
  const {moduleOf} = await import(new URL('../../../../../tools/embertide-mesh/left-body.mjs', import.meta.url).href);
  const value = JSON.parse(fs.readFileSync(path.join(folder, 'warden.json'), 'utf8')), card = value?.card;
  if (!card || !card.card || !card.sprite || !card.perch) throw new Error(`${folder}/warden.json names no card`);
  const modules = new Map();
  for (const sha of [card.card, card.sprite, card.perch]) modules.set(sha, moduleOf(fs.readFileSync(path.join(folder, `${sha}.png`)), sha, 'warden: card'));
  return {value, card, modules};
}

// before the page's own code: her moments as dl-athena.js tells them (SEEN_EVENT), each with this document's clock
const SEEN = `(() => { const seen = []; window.__dlSeen = seen;
  document.addEventListener('dl-athena', (e) => seen.push({type: e.detail?.type, at: Math.round(performance.now())}), true); })()`;
// her card as the glass shows it: the page's own state (window.dlHandoff), and what is drawn
const READ = `(() => {
  const h = window.dlHandoff, st = h ? h.state() : null, layer = document.querySelector('.dl-handoff'), card = document.querySelector('.dl-handoff-card');
  const perch = card?.querySelector('img'), her = card?.querySelector('canvas'), svg = document.querySelector('.dl-handoff-code svg');
  const film = document.getElementById('dl-twelve-film'), r = card?.getBoundingClientRect();
  let herPixels = 0;
  if (her && her.width && her.height) { try { const d = her.getContext('2d').getImageData(0, 0, her.width, her.height).data; for (let i = 3; i < d.length; i += 4) if (d[i]) herPixels++; } catch {} }
  return JSON.stringify({mounted: Boolean(h), open: Boolean(st?.open), on: Boolean(layer?.classList.contains('on')), opacity: layer ? getComputedStyle(layer).opacity : null,
    link: st?.link ?? null, visit: st?.visit ?? null, round: st?.round ?? null, left: st?.left ?? null, house: st?.house ?? null, seen: window.__dlSeen || [],
    film: film ? +film.currentTime.toFixed(3) : null, perch: Boolean(perch?.complete && perch.naturalWidth > 0), perchW: perch?.naturalWidth || 0,
    picked: st?.picked ?? null, perchSrc: perch?.currentSrc || perch?.src || null,
    herPixels, svg: Boolean(svg && svg.getBoundingClientRect().width > 0), line: document.querySelector('.dl-handoff-side p')?.textContent ?? null,
    rect: r ? {x: r.left, y: r.top, w: r.width, h: r.height} : null, view: {w: innerWidth, h: innerHeight}, dpr: devicePixelRatio, title: document.title});
})()`;

async function main() {
  if (!URL_) { console.error('--url <the page on her road> is required'); return 2; }
  if (Boolean(HOUSE) !== Boolean(GLASS)) { console.error('--house and --glass go together (the code names both or neither)'); return 2; }
  const made = PICK_FACE ? await pickOfFace(path.resolve(PICK_FACE)).catch((e) => { console.error(String(e?.message || e)); return null; }) : null;
  if (PICK_FACE && !made) return 2;
  const PICK = opt('--pick', made);
  if (PICK && !HOUSE) { console.error('--pick is the house\'s: name it with --house and --glass'); return 2; }
  const pick = PICK ? await pickFrom(PICK).catch((e) => { console.error(String(e?.message || e)); return null; }) : null;
  if (made) process.on('exit', () => { try { fs.rmSync(made, {recursive: true, force: true}); } catch {} });   // the scratch pick ends with the proof
  if (PICK && !pick) return 2;
  if (!CHROME) { console.error('no Chrome on this Mac'); return 2; }
  const origin = new URL(URL_).origin;
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'dl-handoff-proof-'));
  const child = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${W},${H}`, '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions',
    '--disable-default-apps', '--disable-features=Translate,MediaRouter,OptimizationHints', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', 'about:blank'], {stdio: 'ignore'});
  let ws = null;
  const end = async () => {
    try { ws?.close(); } catch {}
    try { child.kill('SIGTERM'); } catch {}
    for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
    if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} await sleep(200); }
    try { fs.rmSync(dir, {recursive: true, force: true}); } catch {}
  };
  const bound = setTimeout(() => { console.error(`${LIMIT_S} s passed: ended`); end().then(() => process.exit(2)); }, LIMIT_S * 1000);
  const onSig = () => end().then(() => process.exit(2)); process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  const out = {url: URL_, house: HOUSE, glass: GLASS, chrome: CHROME, glassSize: {w: W, h: H, scale: SCALE}, when: new Date().toISOString()};
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json());
    ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map(), errors = [], refused = {}; let atDoor = false;
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    ws.onmessage = m => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const url = x.params.request.url, door = url.startsWith(origin + '/lock/');   // his door: never asked (dl-twelve.proof.mjs, NEVER AT HIS DOOR)
        const laid = pick && /\/intro\/room\/left-bodies\/([0-9a-f]{64})\.mjs$/.exec(new URL(url).pathname);
        const answer = !pick ? null   // --pick: the house's answers, as the house would give them
          : url === origin + '/dev/lan' ? ['application/json', JSON.stringify({nest: `http://${HOUSE}`, glass: GLASS})]
          : url === `http://${HOUSE}/nest/ref/character/warden` ? ['application/json', JSON.stringify({name: 'character/warden', ref: {value: pick.value, rev: 1}})]
          : laid && url.startsWith(origin + '/') && pick.modules.has(laid[1]) ? ['text/javascript', pick.modules.get(laid[1])] : null;
        if (answer) {
          send('Fetch.fulfillRequest', {requestId: x.params.requestId, responseCode: 200, responseHeaders: [{name: 'content-type', value: answer[0]}, {name: 'access-control-allow-origin', value: '*'}],
            body: Buffer.from(answer[1]).toString('base64')}, x.sessionId).catch(() => {});
          return;
        }
        const ok = !door && (url.startsWith(origin + '/') || url.startsWith('data:') || url.startsWith('blob:'));
        if (door) atDoor = true;
        if (ok) send('Fetch.continueRequest', {requestId: x.params.requestId}, x.sessionId).catch(() => {});
        else { const o = new URL(url).origin; refused[o] = (refused[o] || 0) + 1; send('Fetch.failRequest', {requestId: x.params.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 200));
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable']) await send(m, {}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: SCALE, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s); await send('Page.bringToFront', {}, s).catch(() => {});
    await send('Page.addScriptToEvaluateOnNewDocument', {source: SEEN}, s);
    const read = async (expr) => JSON.parse((await send('Runtime.evaluate', {expression: expr, returnByValue: true}, s)).result?.value ?? 'null');
    const t0 = Date.now(), nav = await send('Page.navigate', {url: URL_}, s); if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    let st = null, upAt = null;
    for (;;) {   // her landing, nothing pressed: the card up, its code drawn, her pixels on it, the layer whole (its fade in is .45 s)
      await sleep(250);
      if (atDoor) throw new Error(`${origin} answered with the house's lock: its Touch ID was never asked; prove on the same tree served by tools/serve-range`);
      try { st = await read(READ); } catch { st = null; }
      if (st?.title === 'DysonLight · Harmony') throw new Error(`${origin} answered with the house's lock (DysonLight · Harmony)`);
      if (st?.open && upAt === null) upAt = Date.now();
      if (st?.open && st.on && st.svg && st.herPixels > 0 && st.opacity === '1') break;
      if (Date.now() - t0 > (LIMIT_S - 20) * 1000) throw new Error(`her card did not come up within ${LIMIT_S - 20} s (the film at ${st?.film} s, her moments ${JSON.stringify((st?.seen || []).map((e) => e.type))}): start the film short of her stop (?debug=<s>, mint-dev --start)`);
    }
    const shot = await send('Page.captureScreenshot', {format: 'png'}, s);
    const picture = SHOT || path.join(dir, 'glass.png');
    fs.writeFileSync(picture, Buffer.from(shot.data, 'base64'));
    const {readCodes} = await import(VISION.href);
    const [seen] = readCodes([picture]);
    const codes = (seen?.codes || []).map((c) => c.text);
    const u = (() => { try { return new URL(st.link); } catch { return null; } })(), q = u ? Object.fromEntries(u.searchParams) : {};
    const mille = (v, d) => Math.max(0, Math.min(1000, Math.round((v / d) * 1000)));   // the card's place as this proof measures it, per mille of the glass
    const place = st.rect ? [mille(st.rect.x, st.view.w), mille(st.rect.y, st.view.h), mille(st.rect.w, st.view.w), mille(st.rect.h, st.view.h)].join(',') : null;
    const scale = st.perchW && st.rect ? (st.rect.w * st.dpr) / st.perchW : 0;
    const landed = st.seen.find((e) => e.type === 'landed');
    const houseCheck = HOUSE
      ? [`the code names the house: Nest ${HOUSE}, glass ${GLASS}, the card's place on it (${place})`, q.n === HOUSE && q.g === GLASS && q.c === place && st.house?.glass === GLASS]
      : ['the code names a house only when the page has one', st.house?.nest ? Boolean(q.n && q.g && q.c === place) : !q.n && !q.g && !q.c];
    const checks = {
      'she landed, and her card came up by itself (nothing pressed)': Boolean(landed) && st.open && st.on,
      'her perch on the card': st.perch,
      'her own pixels on the card (a first round: she has not left it)': st.herPixels > 0 && st.left === false,
      'the card at a whole number of screen pixels per card pixel': scale >= 1 && Math.abs(scale - Math.round(scale)) < 1e-6,
      'the code drawn beside her': st.svg,
      'the code opens DysonLight with this visit and round': u?.protocol === 'dysonlight:' && q.s === st.visit && q.r === String(st.round),
      [houseCheck[0]]: houseCheck[1],
      ...(pick ? {'the card is the pick\'s: its perch and her sprite read beside the page, checked by their hash, and the code names them (k=, h=)':
          st.picked?.card === pick.card.card && st.picked?.sprite === pick.card.sprite && q.k === pick.card.card && q.h === pick.card.sprite && /^blob:/.test(st.perchSrc || '')}
        : {'the code names no card of its own (the product\'s card)': !q.k && !q.h}),
      "the code read back off the picture by Apple's Vision is the page's link": codes.includes(st.link),
    };
    Object.assign(out, {link: st.link, read: codes, line: st.line, house_seen: st.house, card: {rect: st.rect, view: st.view, dpr: st.dpr, scale, place, herPixels: st.herPixels},
      moments: st.seen, film_at_card: st.film, card_up_ms: upAt ? upAt - t0 : null, picture: SHOT ? picture : null, refused, errors: errors.slice(0, 5), checks,
      pass: Object.values(checks).every(Boolean)});
  } catch (e) { out.error = String(e?.message || e); }
  clearTimeout(bound); await end();
  console.log(JSON.stringify(out, null, 1));
  if (out.error) return 2;
  for (const [what, ok] of Object.entries(out.checks)) console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`);
  console.log(out.pass ? `PASS: her card and her code came up on her landing, and the code reads back as ${out.link}` : 'FAIL');
  return out.pass ? 0 : 1;
}
main().then(code => process.exit(code));
