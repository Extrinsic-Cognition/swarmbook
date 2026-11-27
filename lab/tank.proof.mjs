#!/usr/bin/env node
// tank.proof.mjs: THE TANK in the syrup glass (syrup-glass.html, tank-law.mjs), seen: a muted headless Chromium off every screen opens the served
// page with the tank on and a Nest that is not there (?nest=http://127.0.0.1:1), so nothing of the purse is drawn until a reading is HANDED IN through
// the page's own seam (window.__syrup.tank.take, as the Nest's stream would hand it); no live Nest, nothing leaves but to the page's origin. Then, on
// the page's own deterministic clock (hold, advance, draw): a purse at rest (the balance under the pouch, no number); a call that drank (a new burn
// row: the number flying from the surface, the sparks, the sip, the level falling, the balance's pulse); a sale (a drop falls); rest again (nothing
// drawn). Pictures in --out; the receipt printed as JSON. Exit 0 on PASS, 1 on FAIL, 2 when it could not run.
//   node lab/tank.proof.mjs --url http://127.0.0.1:8923/embertide-app/ui/intro/dyson-society/lab/syrup-glass.html --out <dir> [--playwright <path>] [--chrome <path>]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';

const {values: v} = parseArgs({options: {url: {type: 'string'}, out: {type: 'string'}, playwright: {type: 'string', default: 'playwright'}, chrome: {type: 'string'}}});
if (!v.url) { console.error('--url is required'); process.exit(2); }
const page0 = new URL(v.url); page0.searchParams.set('tank', '1'); page0.searchParams.set('nest', 'http://127.0.0.1:1'); page0.searchParams.set('seed', '7');
const OUT = v.out ? path.resolve(v.out) : null; if (OUT) fs.mkdirSync(OUT, {recursive: true});
const report = {url: page0.href, quality: null, checks: [], pictures: [], errors: [], pass: false};
const check = (name, fn) => { fn(); report.checks.push(name); };
const T = () => Date.now();
let browser;
const bound = setTimeout(() => { report.errors.push('150 s passed'); finish(2); }, 150000);
async function finish(code) { clearTimeout(bound); try { await browser?.close(); } catch {} console.log(JSON.stringify(report, null, 1)); process.exit(code); }
try {
  const pw = await import(v.playwright === 'playwright' ? 'playwright' : pathToFileURL(path.resolve(v.playwright)).href);
  const chromium = pw.chromium ?? pw.default?.chromium;
  browser = await chromium.launch({headless: true, executablePath: v.chrome, args: ['--mute-audio', '--enable-unsafe-swiftshader']});
  const context = await browser.newContext({viewport: {width: 1280, height: 720}, deviceScaleFactor: 1, serviceWorkers: 'block'});
  await context.route('**/*', route => new URL(route.request().url()).origin === page0.origin ? route.continue() : route.abort('blockedbyclient'));
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_BLOCKED_BY_CLIENT|ERR_CONNECTION|Failed to load resource/.test(m.text())) report.errors.push(m.text().slice(0, 300)); });
  await page.goto(page0.href, {waitUntil: 'load'});
  await page.waitForFunction(() => window.__syrup && window.__syrup.tank, null, {timeout: 20000});
  await page.evaluate(() => window.__syrup.ready);
  const shot = async (name) => { if (!OUT) return; const file = path.join(OUT, `${name}.png`); await page.screenshot({path: file}); report.pictures.push(file); };
  const ev = (js) => page.evaluate(js);
  const stats = () => ev('window.__syrup.stats()');
  const dom = () => ev(`(() => ({hidden: document.getElementById('tank').hidden, balance: document.getElementById('balance').textContent, pops: [...document.querySelectorAll('.pop')].map(p => p.textContent), pulse: document.getElementById('balance').classList.contains('drop')}))()`);
  report.quality = await ev('window.__syrup.info().quality');   // auto: lean on a coarse pointer or four cores or fewer (this box), full on a Mac
  await ev('window.__syrup.hold(true)');
  await ev('window.__syrup.expand()'); await ev('window.__syrup.advance(1800)'); await ev('window.__syrup.draw()');
  const none = await dom();
  check('no purse on the Nest: nothing of the tank is drawn', () => { assert.equal(none.hidden, true); assert.equal(none.balance, ''); assert.deepEqual(none.pops, []); });
  await shot('0-no-purse');
  // a purse at rest: the level the purse's, the balance under the pouch, the burns already on the Nest history
  const t0 = T();
  const purse = (over = {}) => ({schema: 'embertide.purse/v1', posted_usd: 315.67, reserved_usd: 0, full_usd: 400, level: 0.62, ledger: {at_ms: t0, source: 'ledger', mac: 'mac'}, burns: [{id: 'mac-old', at_ms: t0 - 120000, cost_usd: 0.021, in: 3100, lane: 'sol'}], ...over});
  const took = await page.evaluate((value) => window.__syrup.tank.take('house/purse', {value, rev: 1}), purse());
  await ev('window.__syrup.advance(2200)'); await ev('window.__syrup.draw()');   // the level pours to the purse's over LEVEL_MS (e-folds of 250 ms): still by 1.6 s
  const rest = await dom(), s1 = await stats();
  check('a purse at rest: the balance stands under the pouch, the level is the purse\'s, no number flies for a burn already on the Nest', () => {
    assert.equal(took, true); assert.equal(rest.hidden, false); assert.match(rest.balance, /\$315\.67/); assert.match(rest.balance, /at rest/); assert.deepEqual(rest.pops, []);
    assert.equal(s1.tank.level, 0.62); assert.equal(s1.tank.counts.history, 1); assert.equal(s1.sparks, 0); assert.equal(s1.animating, false);
  });
  await shot('1-the-tank-at-rest');
  // a call drank: a new burn row at this instant
  const t1 = T();
  const drank = await page.evaluate((value) => window.__syrup.tank.take('house/purse', {value, rev: 2}), purse({posted_usd: 315.66, level: 0.60, burns: [{id: 'mac-old', at_ms: t0 - 120000, cost_usd: 0.021, in: 3100, lane: 'sol'}, {id: 'mac-new', at_ms: t1 - 40, cost_usd: 0.009425, in: 1757, lane: 'fable'}]}));
  // the number's flight is the compositor's, on the wall clock: its picture first, before the page's clock is advanced (a slow software GL
  // would spend the flight on the wave's steps); the sparks and the sip are the page's own clock's: their picture after
  await page.waitForTimeout(260);
  const mid = await dom();
  await shot('2-a-call-drinks');
  await ev('window.__syrup.advance(260)'); await ev('window.__syrup.draw()');
  const s2 = await stats();
  check('a call drank: the number flies from the surface with its cost, its lane and its tokens; sparks rise; the surface takes a sip; the level falls; the balance pulses', () => {
    assert.equal(drank, true);
    assert.equal(mid.pops.length, 1); assert.match(mid.pops[0], /−\$0\.0094/); assert.match(mid.pops[0], /fable/); assert.match(mid.pops[0], /1\.8k in/);
    assert.match(mid.balance, /\$315\.66/); assert.match(mid.balance, /burn \$0\.0094\/min · 1 call\b/); assert.equal(mid.pulse, true);   // the old row is two minutes gone: outside the rate's minute
    assert.ok(s2.sparks > 0, `sparks in the air: ${s2.sparks}`); assert.equal(s2.rippling, true); assert.equal(s2.tank.level, 0.60); assert.equal(s2.tank.counts.burns, 1);
    assert.equal(s2.animating, true);
  });
  await shot('3-sparks-rising');
  // a sale: a gold drop on mint/drops
  const sold = await page.evaluate((value) => window.__syrup.tank.take('mint/drops', {value, rev: 1}), {schema: 'embertide.mint-drops/v1', drops: [{id: 'sale-1', at_ms: T() - 10, metal: 'gold', usd: 1000}]});
  const s3 = await stats();
  check('a sale is a gold drop into the pouch', () => { assert.equal(sold, true); assert.equal(s3.beads, 1); assert.equal(s3.tank.counts.drops, 1); });
  await ev('window.__syrup.advance(300)'); await ev('window.__syrup.draw()');
  await shot('4-a-sale-falls');
  await ev('window.__syrup.advance(900)'); await ev('window.__syrup.draw()');
  await shot('5-the-sale-set');
  // a replay of the stream moves nothing
  const replay = await page.evaluate((value) => window.__syrup.tank.take('house/purse', {value, rev: 2}), purse({burns: [{id: 'mac-new', at_ms: t1 - 40, cost_usd: 0.009425, in: 1757, lane: 'fable'}]}));
  check('a replay of the ref (a rev no newer than the one held) moves nothing', () => assert.equal(replay, false));
  // rest: the sparks gone, the ripples still by the clock (the lives are the quality's: lean's are longer, LIFE_MS), the number gone from the
  // page; then no draws. The page is held, so its clock is advanced here until it is at rest (bounded), never waited on.
  let waited = 0;
  for (; waited < 20000; waited += 500) { await ev('window.__syrup.advance(500)'); if (!(await stats()).animating) break; }
  report.restAfterMs = waited; await ev('window.__syrup.draw()');
  await page.waitForTimeout(1900);
  const s4 = await stats(), end = await dom();
  const restDraws = await ev('window.__syrup.benchRest(60)');
  check('at rest again: no sparks, no ripple, the number gone, and the page draws nothing', () => {
    assert.equal(s4.sparks, 0); assert.equal(s4.rippling, false); assert.equal(s4.animating, false); assert.deepEqual(end.pops, []);
    assert.equal(restDraws.draws, 0);
  });
  await shot('6-at-rest');
  check('no script or shader errors', () => assert.deepEqual(report.errors, []));
  report.pass = true;
  await finish(0);
} catch (error) { report.errors.push(error.stack || String(error)); await finish(1); }
