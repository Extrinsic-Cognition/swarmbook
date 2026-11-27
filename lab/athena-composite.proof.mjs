#!/usr/bin/env node
// Capture the actual moving-shot boundaries and frozen camera poses for visual
// review. Structural checks cannot approve the likeness or the composition.
// One muted, headless browser; local reads only, no lock or payment requests.
import fs from 'node:fs/promises';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {pathToFileURL} from 'node:url';
const {values} = parseArgs({options: {
  url: {type:'string', default:'http://127.0.0.1:9059/intro/dyson-society/app/warm.html'},
  out: {type:'string'}, playwright:{type:'string',default:'playwright'}, chrome:{type:'string'},
}});
if (!values.out) throw new Error('--out is required: these renders must be inspected');
const out = path.resolve(values.out), origin = new URL(values.url).origin;
const report = {url:values.url, visualApproval:false, frames:[], errors:[]};
let browser, context;
const cleanup = async () => { await context?.close().catch(()=>{}); await browser?.close().catch(()=>{}); };
const bound = setTimeout(()=>{console.error('Capture exceeded 240 seconds'); cleanup().finally(()=>process.exit(2));},240000);
for(const signal of ['SIGTERM','SIGINT']) process.once(signal,()=>cleanup().finally(()=>process.exit(2)));
try {
  const {chromium} = await import(values.playwright === 'playwright' ? 'playwright' : pathToFileURL(path.resolve(values.playwright)).href);
  browser = await chromium.launch({headless:true, executablePath:values.chrome, timeout:60000,
    args:['--mute-audio','--disable-background-networking','--disable-sync','--disable-extensions']});
  console.log('Browser ready');
  context = await browser.newContext({viewport:{width:1280,height:1100},deviceScaleFactor:1,reducedMotion:'reduce',serviceWorkers:'block'});
  await context.route('**/*', route => {
    const r=route.request(), u=new URL(r.url());
    return u.origin===origin && !/^\/lock(?:\/|$)/.test(u.pathname) && ['GET','HEAD'].includes(r.method()) ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error' && /shader|WebGL/i.test(m.text())) report.errors.push(m.text().slice(0,1000));});
  await page.goto(values.url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>{
    const u=window.hero?.unbox, s=u?.state;
    return u?.freeze?.ready && s?.athena?.at && !s.athena.at.startsWith('loading') && !s.athena.error
      && s.held?.done===s.held?.want && s.held?.want>0
      && u.scene.getObjectByName('terrain')?.material.uniforms.uMattesReady.value===1;
  },null,{timeout:60000});
  console.log('Assets ready'); await fs.mkdir(out,{recursive:true});
  await page.evaluate(()=>{
    document.querySelector('#motion').setAttribute('aria-pressed','true');
    document.querySelector('#dl-twelve-film').pause(); document.querySelector('#dl-twelve-song').pause();
  });
  const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const capture=async name=>{
    await settle();
    const state=await page.evaluate(()=>({time:document.querySelector('#dl-twelve-film').currentTime,
      freeze:window.hero.unbox.freeze.state(), draws:window.hero.unbox.draws}));
    await page.locator('#hero-box').screenshot({path:path.join(out,`${name}.png`),timeout:20000});
    report.frames.push({name,...state}); console.log(`Captured ${name} at ${state.time.toFixed(4)}`);
  };
  for(const t of [30.35,31.2,33.56,33.58,36.57,37.08]) {
    await page.evaluate(t=>document.querySelector('#dl-twelve-film').currentTime=t,t);
    await page.waitForFunction(t=>{const f=document.querySelector('#dl-twelve-film');return !f.seeking&&Math.abs(f.currentTime-t)<.001;},t);
    await capture(`shot-${t.toFixed(2)}`);
  }
  await page.evaluate(()=>document.querySelector('#dl-twelve-film').currentTime=37.132);
  await page.waitForFunction(()=>window.hero.unbox.freeze.active);
  await capture('freeze-reference');
  for(const [name,pose] of [['blend',{yaw:0,pitch:0,distance:1.26}],['left',{yaw:-.32,pitch:.02,distance:2.1}],['right',{yaw:.32,pitch:.02,distance:2.1}],['wide',{yaw:.55,pitch:.15,distance:4.2}]]) {
    await page.evaluate(p=>{window.hero.unbox.freeze.glide(p);window.hero.unbox.ask();},pose);
    await capture(`freeze-${name}`);
  }
  await page.evaluate(()=>document.querySelector('#dl-twelve-film').currentTime=36.5);
  await page.waitForFunction(()=>!window.hero.unbox.freeze.active);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>document.querySelector('#dl-twelve-film').currentTime=37.132);
  await page.waitForFunction(()=>{const f=window.hero.unbox.freeze.state();return f.active&&f.moved&&!f.entering;},null,{timeout:30000});
  await capture('freeze-entrance');
  for(const [name,pose] of [
    ['world',{target:[0,9,5],yaw:2.7,pitch:-.32,distance:56}],
    ['world-reverse',{target:[-1.5,-.5,-2.8],yaw:2.6,pitch:.12,distance:12}],
    ['world-side',{target:[-1.5,-.5,-2.8],yaw:1.3,pitch:.12,distance:12}],
    ['fighters',{target:[-2.9,-2,-6],yaw:0.65,pitch:-.2,distance:3.6}],
  ]) {
    await page.evaluate(p=>{window.hero.unbox.freeze.glide(p);window.hero.unbox.ask();},pose);
    await capture(`freeze-${name}`);
  }
  report.structuralPass=report.errors.length===0;
} catch(e) {report.error=String(e.stack??e); report.structuralPass=false;}
finally {clearTimeout(bound);await cleanup();await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'athena-composite.json'),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({structuralPass:report.structuralPass,visualApproval:false,frames:report.frames.length,errors:report.errors,error:report.error??null}));
process.exitCode=report.structuralPass?0:1;
