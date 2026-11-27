#!/usr/bin/env node
// Independent acceptance proof: Dolbar keeps the dodecahedron; Athena begins
// fullscreen at source frame 886. Run on NewMac against a Range-capable server.
// Setup seeks are explicit. No checkout, wallet, or transaction is exercised.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';

const {values} = parseArgs({options: {
  url: {type: 'string'}, chrome: {type: 'string'},
  playwright: {type: 'string', default: 'playwright'}, out: {type: 'string'},
}});
assert.ok(values.url, '--url is required');
const url = new URL(values.url), report = {checks: [], frames: [], errors: [], pass: false};
let browser;
const timer = setTimeout(() => {
  console.error('FAIL: Dolbar/Athena proof exceeded 150 seconds');
  setTimeout(() => process.exit(2), 5000).unref();
  Promise.resolve(browser?.close()).finally(() => process.exit(2));
}, 150000);
const check = (name, fn) => { fn(); report.checks.push(name); };
try {
  const {chromium} = await import(values.playwright === 'playwright' ? 'playwright' : pathToFileURL(path.resolve(values.playwright)).href);
  browser = await chromium.launch({headless: true, executablePath: values.chrome,
    args: ['--mute-audio', '--disable-background-networking', '--disable-background-timer-throttling', '--disable-renderer-backgrounding']});
  const context = await browser.newContext({viewport: {width: 1280, height: 800}, reducedMotion: 'reduce', serviceWorkers: 'block'});
  await context.route('**/*', route => {
    const request = route.request(), target = new URL(request.url());
    return target.origin === url.origin && !/^\/lock(?:\/|$)/.test(target.pathname) && ['GET', 'HEAD'].includes(request.method())
      ? route.continue() : route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && /shader|WebGL|THREE\./i.test(message.text())) report.errors.push(message.text());
  });
  page.setDefaultTimeout(12000);
  await page.goto(url.href, {waitUntil: 'domcontentloaded'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => {
    const film = document.querySelector('#dl-twelve-film');
    return window.hero?.unbox?.freeze?.ready && film?.seekable.length && film.seekable.end(0) > 38;
  },
    null, {timeout: 45000});
  await page.evaluate(() => {
    document.querySelector('#motion')?.setAttribute('aria-pressed', 'true');
    document.querySelector('#dl-twelve-film').pause();
    document.querySelector('#dl-twelve-song').pause();
  });
  async function snapshot() {
    return page.evaluate(() => {
      const film = document.querySelector('#dl-twelve-film'), stage = document.querySelector('#sphere-stage');
      const sphere = document.querySelector('#genesis-sphere'), box = document.querySelector('#hero-box');
      const header = document.querySelector('.hero-copy');
      const rect = element => { const r = element.getBoundingClientRect(); return {left:r.left, top:r.top, width:r.width, height:r.height}; };
      const visible = element => {
        for (let node = element; node instanceof Element; node = node.parentElement) {
          const css = getComputedStyle(node);
          if (node.hidden || css.display === 'none' || css.visibility === 'hidden' || Number(css.opacity) === 0) return false;
        }
        return true;
      };
      return {time:film.currentTime, frame:Math.floor(film.currentTime * 30000 / 1001 + 1e-6),
        stage:rect(stage), header:rect(header), viewport:{width:innerWidth,height:innerHeight}, sphereVisible:visible(sphere),
        boxVisible:visible(box), box:rect(box), mode:window.hero.state().boxLast?.mode,
        shotLayers:box.dataset.shotLayers, freeze:window.hero.unbox.freeze.state(), paywall:window.dlTwelve.state().paywall.state};
    });
  }
  async function seek(frame) {
    const time = (frame + .5) * 1001 / 30000;
    await page.evaluate(time => { document.querySelector('#dl-twelve-film').currentTime = time; }, time);
    await page.waitForFunction(time => {
      const film = document.querySelector('#dl-twelve-film');
      return !film.seeking && Math.abs(film.currentTime-time) < .001;
    }, time);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const state = await snapshot(); report.frames.push(state); return state;
  }
  function anime(state) {
    assert.equal(state.mode, 'anime'); assert.equal(state.shotLayers, 'anime');
    assert.equal(state.sphereVisible, false); assert.equal(state.boxVisible, true);
    assert.ok(Math.abs(state.stage.width-state.viewport.width) <= 2, 'anime must span viewport width');
    assert.ok(Math.abs(state.stage.height-state.viewport.height) <= 2, 'anime must span viewport height');
    assert.ok(Math.abs(state.stage.left) <= 2, 'anime must span the full page width');
    assert.ok(state.header.height > 0 && state.header.top >= -2, 'Society header must remain visible above the scene');
    assert.ok(Math.abs(state.stage.top-state.header.top-state.header.height) <= 2, 'scene must follow the established header');
    for (const key of ['left', 'top', 'width', 'height']) {
      assert.ok(Math.abs(state.box[key]-state.stage[key]) <= 2, `anime canvas ${key} must match fullscreen stage`);
    }
  }
  async function still(name) {
    if (!values.out) return;
    await mkdir(values.out, {recursive:true});
    await page.screenshot({path:path.join(values.out, `${name}.png`)});
  }
  const before = await seek(885);
  check('last Dolbar frame retains the sphere', () => { assert.equal(before.sphereVisible,true); assert.notEqual(before.mode,'anime'); });
  await still('dolbar-last');
  const first = await seek(886);
  check('first Athena frame is fullscreen anime without moving the established header', () => {
    anime(first);
    assert.ok(Math.abs(first.stage.top-before.stage.top) <= 2, 'Athena cut must not move the scene or header');
  });
  await still('athena-first');
  const second = await seek(887);
  check('second Athena frame stays fullscreen', () => anime(second));
  const reverse = await seek(885);
  check('backward seek restores Dolbar and the sphere', () => assert.equal(reverse.sphereVisible,true));
  await seek(882);
  report.playback = await page.evaluate(() => new Promise((resolve,reject) => {
    const film = document.querySelector('#dl-twelve-film'), samples = [];
    let callback;
    const bound = setTimeout(() => { film.pause(); film.cancelVideoFrameCallback(callback); reject(new Error('playback did not cross Athena cut')); },5000);
    const sample = (_,frame) => {
      const index = Math.round(frame.mediaTime * 30000 / 1001);
      // The page paints the video cause in its animation-frame callback. Read
      // after that queued paint, not between media delivery and the draw.
      requestAnimationFrame(() => {
      const sphere = document.querySelector('#genesis-sphere'), box = document.querySelector('#hero-box');
      const sphereStyle = getComputedStyle(sphere), boxStyle = getComputedStyle(box);
      samples.push({frame:index, mode:window.hero.state().boxLast?.mode,
        sphereVisible:sphereStyle.visibility !== 'hidden' && Number(sphereStyle.opacity) > 0,
        boxVisible:!box.hidden && boxStyle.visibility !== 'hidden' && Number(boxStyle.opacity) > 0});
      if (index >= 889) { clearTimeout(bound); film.pause(); resolve(samples); }
      else callback = film.requestVideoFrameCallback(sample);
      });
    };
    callback = film.requestVideoFrameCallback(sample);
    film.play().catch(error => { clearTimeout(bound); film.cancelVideoFrameCallback(callback); reject(error); });
  }));
  check('natural playback hands Athena to anime on its first observed frame', () => {
    const athena = report.playback.filter(sample => sample.frame >= 886);
    assert.ok(athena.length > 0);
    assert.ok(athena.every(sample => sample.mode === 'anime' && sample.boxVisible && !sample.sphereVisible), JSON.stringify(report.playback));
    // boxLast is the last draw, not a current-visibility signal: on rewind the
    // renderer clears/hides without emitting another historical draw record.
    assert.ok(report.playback.filter(sample => sample.frame < 886).every(sample => sample.sphereVisible && !sample.boxVisible));
  });
  const closeup = await seek(1006);
  check('Athena close-up remains fullscreen anime', () => anime(closeup));
  await page.setViewportSize({width:390,height:844});
  const phone = await seek(887);
  check('portrait resize preserves fullscreen Athena', () => anime(phone));
  await still('athena-portrait');
  await page.evaluate(() => { document.querySelector('#dl-twelve-film').currentTime = 37.132; });
  await page.waitForFunction(() => window.hero.unbox.freeze.active && window.dlTwelve.state().paywall.state === 'held');
  const held = await snapshot(); report.frames.push(held);
  check('fullscreen handoff preserves reconstructed mint hold at frame 1111', () => {
    assert.equal(held.frame,1111); assert.equal(held.freeze.active,true); assert.equal(held.mode,'mint-freeze');
  });
  check('no script or shader errors', () => assert.deepEqual(report.errors, []));
  report.pass = true;
} catch (error) { report.error = error.stack; process.exitCode = 1; }
finally { await browser?.close(); clearTimeout(timer); }
console.log(JSON.stringify(report,null,2));
