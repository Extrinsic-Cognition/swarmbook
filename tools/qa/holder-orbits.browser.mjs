// Isolated browser QA with labelled synthetic holders; never submits a transaction.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath, pathToFileURL} from 'node:url';
const {chromium} = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const root = fileURLToPath(new URL('../../', import.meta.url));
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.mp4':'video/mp4','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg'};
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root)) {res.writeHead(403).end();return;}
  if (pathname === '/app/saint-seiya.mp4' && !fs.existsSync(file) && process.env.MINT_QA_FILM_PATH) file = process.env.MINT_QA_FILM_PATH;
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {res.writeHead(404).end();return;}
  const size = fs.statSync(file).size, range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  const headers = {'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
  if (range) {
    const start = Number(range[1]), end = Math.min(range[2]?Number(range[2]):size-1,size-1);
    res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${size}`});fs.createReadStream(file,{start,end}).pipe(res);
  } else {res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(file).pipe(res);}
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({headless:true});
const result = {fixture:'Synthetic portraits, no purchases',cases:[],errors:[]};
try {
  const page = await browser.newPage({viewport:{width:1360,height:1080}});
  page.on('pageerror',error=>result.errors.push(error.message));
  await page.route('**/dl-whitelist.js*',route=>route.fulfill({contentType:'text/javascript',body:`if(window.genesisSphere)window.genesisSphere.setSnapshot({capacity:0,seats:[]});else addEventListener('genesis-sphere',e=>e.detail.setSnapshot({capacity:0,seats:[]}),{once:true});`}));
  await page.route('**/*',route=>{
    const u=new URL(route.request().url());
    if (u.origin===origin || ['data:','blob:'].includes(u.protocol) || u.hostname==='fonts.googleapis.com' || u.hostname==='fonts.gstatic.com') return route.fallback();
    return route.abort();
  });
  await page.goto(`${origin}/app/warm.html#oath-sphere`);
  await page.waitForFunction(()=>window.genesisSphere?.getViewState().mode==='confirmed');
  await page.locator('#sphere-stage').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('#dl-twelve-film')?.readyState>=2);
  await page.evaluate(()=>{
    const stage=document.querySelector('#sphere-stage');
    const label=document.createElement('div');label.textContent='ORBIT PREVIEW · SAMPLE PORTRAITS · NO PURCHASES';
    label.style.cssText='position:absolute;top:18px;left:0;right:0;text-align:center;font:10px monospace;letter-spacing:.14em;color:#877449';stage.append(label);
    window.fixtureProfiles=n=>Array.from({length:n},(_,i)=>{
      const hue=(i*137.508)%360;
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="hsl(${hue} 28% 70%)"/><circle cx="48" cy="38" r="19" fill="hsl(${hue+20} 30% 88%)"/><path d="M15 96v-13c0-39 66-39 66 0v13" fill="hsl(${hue+30} 30% 33%)"/><path d="M29 35c-4-27 44-31 39 4-8-20-28-13-39-4" fill="hsl(${hue+30} 20% 24%)"/></svg>`;
      return {id:`synthetic-reservation-${i}`,bidder:'fixture',handle:`sample_${i+1}`,profileUrl:`https://x.com/sample_${i+1}`,avatarUrl:`data:image/svg+xml,${encodeURIComponent(svg)}`};
    });
  });
  for (const count of [0,1,12,150]) {
    const state=await page.evaluate(count=>{window.genesisSphere.setHolders(window.fixtureProfiles(count));return window.genesisSphere.getViewState();},count);
    assert.equal(state.holderCount,count);assert.equal(state.capacity,0);
    assert.equal(await page.locator('#holder-profiles a').count(),count);
    result.cases.push({count,capacity:state.capacity,links:count});
  }
  const timing=await page.evaluate(async()=>{
    const samples=[];let previous=null;
    await new Promise(resolve=>{const step=t=>{if(previous!==null)samples.push(t-previous);previous=t;if(samples.length<90)requestAnimationFrame(step);else resolve();};requestAnimationFrame(step);});
    samples.sort((a,b)=>a-b);return {median:samples[45],p95:samples[85]};
  });
  result.frameIntervalMs=timing;
  await page.evaluate(()=>window.genesisSphere.setHolders(window.fixtureProfiles(24)));
  await page.waitForTimeout(1400);
  await page.locator('#sphere-stage').screenshot({path:'/tmp/dyson-orbits-desktop.png'});
  await page.locator('[data-twelve-pause]').click({force:true});
  assert.equal(await page.locator('#motion').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#dl-twelve-film').evaluate(video=>video.paused),true);
  await page.locator('[data-twelve-sound]').click({force:true});
  assert.equal(await page.locator('#dl-twelve-film').evaluate(video=>video.muted),false);
  await page.locator('[data-twelve-pause]').click({force:true});
  await page.waitForFunction(()=>!document.querySelector('#dl-twelve-film').paused);
  await page.locator('.mint-dock .gold-button').click();
  assert.equal(await page.locator('#slot-dialog').evaluate(dialog=>dialog.open),true);
  assert.equal(await page.locator('#slot-twitter').count(),1);
  await page.locator('#slot-dialog .dialog-close').click();
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('#sphere-stage').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.locator('#sphere-stage').screenshot({path:'/tmp/dyson-orbits-mobile.png'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.locator('#holder-profiles a').first().focus();
  const keyboard=await page.locator('#holder-profiles a').first().evaluate(a=>({w:a.getBoundingClientRect().width,clip:getComputedStyle(a).clipPath}));
  assert.ok(keyboard.w>30);assert.equal(keyboard.clip,'none');
  result.keyboard=keyboard;
  assert.deepEqual(result.errors,[]);
  result.pass=true;
} finally {await browser.close();server.close();console.log(JSON.stringify(result));}
