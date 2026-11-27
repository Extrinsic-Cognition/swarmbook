#!/usr/bin/env node
// Trusted-input acceptance: the native cinematic hold must not trap its webpage.
// Run headless on NewMac against a Range-capable server. Explicit media seeks and
// scroll resets are setup only; wheel, anchor click and touch gestures are native
// browser input. No wallet/checkout action, external request or lock route is used.
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
const url = new URL(values.url), report = {checks: [], inputs: [], errors: [], pass: false};
let browser;
const timer = setTimeout(() => {
  console.error('FAIL: mint page scrolling proof exceeded 180 seconds');
  setTimeout(() => process.exit(2), 5000).unref();
  Promise.resolve(browser?.close()).finally(() => process.exit(2));
}, 180000);
const check = (name, fn) => { fn(); report.checks.push(name); };
const distance = (pose) => Math.hypot(...pose.eye.map((v, i) => v - pose.target[i]));
const samePose = (a, b) => {
  for (const key of ['eye', 'target', 'up']) {
    assert.ok(Math.hypot(...a[key].map((v, i) => v - b[key][i])) < 1e-9, `${key} moved during page scrolling`);
  }
};
const held = (a, b) => {
  assert.equal(a.gate, 'held'); assert.equal(a.active, true);
  for (const key of ['film', 'song']) {
    assert.equal(a[key].paused, true);
    assert.ok(Math.abs(a[key].time - b[key].time) < 1e-7, `${key} moved during page navigation`);
  }
};
async function snapshot(page) {
  return page.evaluate(() => {
    const box = document.querySelector('#hero-box'), title = document.querySelector('#rite');
    const freeze = window.hero.unbox.freeze.state(), rect = title.getBoundingClientRect();
    const media = id => { const v = document.querySelector(id); return {time:v.currentTime, paused:v.paused}; };
    return {x:scrollX, y:scrollY, height:innerHeight, scrollRange:document.scrollingElement.scrollHeight-innerHeight,
      touchAction:getComputedStyle(box).touchAction, pose:freeze.pose, active:freeze.active,
      gate:window.dlTwelve.state().paywall.state, film:media('#dl-twelve-film'), song:media('#dl-twelve-song'),
      restart:(() => { const b=document.querySelector('[data-twelve-restart]'); return b ? {first:b.parentElement.firstElementChild===b, disabled:b.disabled} : null; })(),
      hash:location.hash, title:{top:rect.top, bottom:rect.bottom},
      offset:(parseFloat(getComputedStyle(title).scrollMarginTop)||0)
        +(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0)};
  });
}
async function paint(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function scrollRest(page) {
  await page.evaluate(() => new Promise((resolve,reject) => {
    const start=performance.now(); let y=scrollY, stable=start;
    const sample=now => {
      if (scrollY!==y) { y=scrollY; stable=now; }
      if (now-stable>=180) return resolve();
      if (now-start>4000) return reject(new Error('browser scroll momentum did not settle'));
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }));
}
async function top(page) {
  await page.evaluate(() => window.scrollTo({top:0,left:0,behavior:'instant'}));
  await page.waitForFunction(() => scrollY === 0); await paint(page);
}
async function point(page) {
  const p = await page.evaluate(() => {
    const box = document.querySelector('#hero-box'), r = box.getBoundingClientRect();
    for (const fy of [.45,.35,.55]) for (const fx of [.5,.7,.3]) {
      const x=r.left+r.width*fx, y=r.top+r.height*fy;
      if (x>2 && y>2 && x<innerWidth-2 && y<innerHeight-80 && document.elementFromPoint(x,y)===box) return {x,y};
    }
    return null;
  });
  assert.ok(p, 'no unobstructed native canvas point'); return p;
}
async function prepare(mobile) {
  const context = await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:800},
    hasTouch:mobile, isMobile:mobile, deviceScaleFactor:1, reducedMotion:'reduce', serviceWorkers:'block'});
  await context.route('**/*', route => {
    const request=route.request(), target=new URL(request.url());
    return target.origin===url.origin && !/^\/lock(?:\/|$)/.test(target.pathname) && ['GET','HEAD'].includes(request.method())
      ? route.continue() : route.abort('blockedbyclient');
  });
  const page=await context.newPage(); page.setDefaultTimeout(12000);
  page.on('pageerror', error => report.errors.push(error.message));
  await page.goto(url.href, {waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => {
    const film=document.querySelector('#dl-twelve-film');
    return window.hero?.unbox?.freeze?.ready && film?.seekable.length && film.seekable.end(0)>38;
  }, null, {timeout:45000});
  await page.evaluate(() => {
    document.querySelector('#motion').setAttribute('aria-pressed','true');
    document.querySelector('#dl-twelve-film').pause(); document.querySelector('#dl-twelve-song').pause();
    document.querySelector('#dl-twelve-film').currentTime=37.132;
  });
  await page.waitForFunction(() => {
    const s=window.hero.unbox.freeze.state();
    return s.active && !s.entering && s.transition===null && window.dlTwelve.state().paywall.state==='held';
  });
  await top(page);
  await page.evaluate(() => {
    window.__scrollProofInputs=[];
    for (const type of ['wheel','pointerdown','pointercancel','click']) document.addEventListener(type, event => {
      window.__scrollProofInputs.push({type, trusted:event.isTrusted, pointerType:event.pointerType??null, alt:event.altKey??false});
    }, {capture:true});
  });
  return {context,page};
}
try {
  const {chromium}=await import(values.playwright==='playwright'?'playwright':pathToFileURL(path.resolve(values.playwright)).href);
  browser=await chromium.launch({headless:true,executablePath:values.chrome,timeout:20000,
    args:['--mute-audio','--disable-background-networking','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
  const desktop=await prepare(false), page=desktop.page;
  const original=await snapshot(page); report.desktopBefore=original;
  let p=await point(page); await page.mouse.move(p.x,p.y);
  await page.keyboard.down('Alt');
  try { await page.mouse.wheel(0,-140); } finally { await page.keyboard.up('Alt'); }
  await page.waitForFunction(pose => {
    const now=window.hero.unbox.freeze.state().pose;
    return Math.hypot(...now.eye.map((v,i)=>v-pose.eye[i]))>.001;
  }, original.pose); await paint(page);
  const dolly=await snapshot(page);
  check('Alt-wheel moves the camera without scrolling the page or advancing held media', () => {
    assert.ok(Math.abs(distance(dolly.pose)-distance(original.pose))>.001);
    assert.ok(Math.abs(dolly.y-original.y)<=1 && Math.abs(dolly.x-original.x)<=1);
    assert.deepEqual(dolly.pose.target,original.pose.target); held(dolly,original);
  });
  p=await point(page); await page.mouse.move(p.x,p.y); await page.mouse.wheel(0,300);
  await page.waitForFunction(y=>scrollY>y+60,dolly.y); await paint(page);
  const scrolled=await snapshot(page); report.desktopScrolled=scrolled;
  check('plain wheel scrolls the webpage while camera and held media stay unchanged', () => {
    assert.ok(scrolled.y>dolly.y+60); samePose(scrolled.pose,dolly.pose); held(scrolled,dolly);
  });
  await top(page);
  // THE RESTART took the Continue link's place (Oct 27 2026): the film's own row holds Restart first; a held scene is not restarted by it
  check('Restart stands first in the film\'s row and is disabled while the wall holds', () => {
    assert.ok(scrolled.restart, 'no [data-twelve-restart] in the film\'s row'); assert.equal(scrolled.restart.first, true); assert.equal(scrolled.restart.disabled, true);
  });
  if (values.out) { await mkdir(values.out,{recursive:true}); await page.screenshot({path:path.join(values.out,'mint-page-scrolled.png')}); }
  report.inputs.push(...await page.evaluate(()=>window.__scrollProofInputs)); await desktop.context.close();
  const mobile=await prepare(true), touchPage=mobile.page, touchBefore=await snapshot(touchPage);
  check('the mobile native canvas permits vertical browser panning',()=>assert.equal(touchBefore.touchAction,'pan-y'));
  p=await point(touchPage);
  const cdp=await mobile.context.newCDPSession(touchPage);
  const touch=(x,y)=>[{x,y,id:1,radiusX:6,radiusY:6,force:1}];
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:touch(p.x,p.y)});
  for(let i=1;i<=10;i++) {
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:touch(p.x,p.y-i*24)});
    await touchPage.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await touchPage.waitForFunction(y=>scrollY>y+60,touchBefore.y); await scrollRest(touchPage); await paint(touchPage);
  const touchAfter=await snapshot(touchPage); report.mobile={before:touchBefore,after:touchAfter};
  check('a trusted upward touch swipe scrolls the page without moving the camera or film',()=>{
    assert.ok(touchAfter.y>touchBefore.y+60); samePose(touchAfter.pose,touchBefore.pose); held(touchAfter,touchBefore);
  });
  await top(touchPage); p=await point(touchPage);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:touch(p.x,p.y)});
  for(let i=1;i<=10;i++) {
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:touch(p.x+i*10,p.y+2)});
    await touchPage.waitForTimeout(30);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await paint(touchPage);
  const horizontal=await snapshot(touchPage); report.mobile.horizontal=horizontal;
  check('a deliberate horizontal touch drag still orbits without scrolling or advancing media',()=>{
    assert.ok(Math.hypot(...horizontal.pose.eye.map((v,i)=>v-touchAfter.pose.eye[i]))>.001);
    assert.ok(Math.abs(horizontal.y)<=1); held(horizontal,touchAfter);
  });
  if (values.out) await touchPage.screenshot({path:path.join(values.out,'mint-page-phone.png')});
  report.inputs.push(...await touchPage.evaluate(()=>window.__scrollProofInputs));
  check('wheel, touch and anchor behaviors used trusted browser inputs',()=>{
    assert.ok(report.inputs.some(i=>i.type==='wheel'&&i.trusted&&i.alt));
    assert.ok(report.inputs.some(i=>i.type==='wheel'&&i.trusted&&!i.alt));
    assert.ok(report.inputs.some(i=>i.type==='pointerdown'&&i.pointerType==='touch'&&i.trusted));
    assert.ok(report.inputs.some(i=>i.type==='click'&&i.trusted));
    assert.ok(report.inputs.every(i=>i.trusted));
  });
  check('no page errors',()=>assert.deepEqual(report.errors,[])); report.pass=true;
} catch(error) { report.error=error.stack; process.exitCode=1; }
finally { await browser?.close(); clearTimeout(timer); }
console.log(JSON.stringify(report,null,2));
