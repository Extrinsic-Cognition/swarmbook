#!/usr/bin/env node
// Bounded offscreen asset review. Run on NewMac, never the serving Mac.
// node golden-sagittarius.proof.mjs --tree <checkout> --out <scratch folder>
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

const arg = (key, fallback) => { const i = process.argv.indexOf(key); return i < 0 ? fallback : process.argv[i + 1]; };
const tree = path.resolve(arg('--tree', '.')), out = path.resolve(arg('--out', path.join(os.tmpdir(), 'golden-armor-review')));
const chrome = arg('--chrome', path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'));
const root = path.join(tree, 'embertide-app/ui');
fs.mkdirSync(out, {recursive: true});
const html = `<!doctype html><html><head><style>html,body{margin:0;overflow:hidden;background:#080d16}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/intro/room/procedural/three.module.js"}}</script></head><body>
<script type="module">
import * as THREE from 'three';
import {createGoldenArmor} from '/intro/dyson-society/lab/golden-sagittarius.mjs';
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(1);
renderer.setSize(innerWidth,innerHeight); renderer.toneMapping=THREE.NeutralToneMapping;
renderer.toneMappingExposure=1.05; document.body.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x080d16);
const camera=new THREE.PerspectiveCamera(36,innerWidth/innerHeight,.025,50);
scene.add(new THREE.HemisphereLight(0xc6d9ff,0x29211b,.4));
const key=new THREE.DirectionalLight(0xffe3aa,2.6);key.position.set(-2,3,4);scene.add(key);
const rim=new THREE.DirectionalLight(0xc1d8ff,1.1);rim.position.set(3,2,-3);scene.add(rim);
const target=new THREE.WebGLRenderTarget(64,64);target.viewport.set(3,5,48,42);target.scissor.set(7,9,32,30);target.scissorTest=true;renderer.setRenderTarget(target);
const raster=()=>({target:renderer.getRenderTarget()===target,viewport:Array.from(renderer.getContext().getParameter(renderer.getContext().VIEWPORT)),scissor:Array.from(renderer.getContext().getParameter(renderer.getContext().SCISSOR_BOX)),autoClear:renderer.autoClear,xr:renderer.xr.enabled});
const before=raster();
const armor=await createGoldenArmor({THREE,renderer});scene.add(armor.root);
const after=raster();renderer.setRenderTarget(null);target.dispose();
let frames=0;
window.armorView=(yaw=0,width=innerWidth,height=innerHeight)=>{
 renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();
 const distance=armor.fitDistance(camera.fov,camera.aspect,yaw,1.08);
 camera.position.set(Math.sin(yaw)*distance,armor.centre.y+distance*.13,Math.cos(yaw)*distance);camera.lookAt(armor.centre);
 renderer.render(scene,camera);frames++;
 const projected=[];
 for(const x of [armor.bounds.min.x,armor.bounds.max.x]) for(const y of [armor.bounds.min.y,armor.bounds.max.y]) for(const z of [armor.bounds.min.z,armor.bounds.max.z]) projected.push(new THREE.Vector3(x,y,z).project(camera).toArray());
 return {frames,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,projected};
};
window.armorBench=()=>{const samples=[],pixel=new Uint8Array(4),gl=renderer.getContext();for(let i=0;i<30;i++){const t=performance.now();renderer.render(scene,camera);gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);samples.push(performance.now()-t);}samples.sort((a,b)=>a-b);return {medianMs:samples[15],p95Ms:samples[28]};};
window.armorDispose=()=>{armor.dispose();renderer.render(scene,camera);return {...renderer.info.memory};};
window.armorState=()=>({frames,metadata:armor.metadata,stateRestored:JSON.stringify(before)===JSON.stringify(after),memory:{...renderer.info.memory}});
window.armorView(.4);window.armorReady=true;
</script></body></html>`;
const requested = [];
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  requested.push(pathname);
  if (pathname === '/') { res.writeHead(200, {'content-type': 'text/html'}); res.end(html); return; }
  if (pathname === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  const file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (error, body) => {
    if (error) { res.writeHead(404); res.end(); return; }
    const type = /\.m?js$/.test(file) ? 'text/javascript' : 'model/gltf-binary';
    res.writeHead(200, {'content-type': type, 'cache-control': 'no-store'}); res.end(body);
  });
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port, profile = fs.mkdtempSync(path.join(os.tmpdir(), 'golden-armor-chrome-'));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const child = spawn(chrome, ['--headless=new', '--remote-debugging-port=0', '--remote-allow-origins=*',
  `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--disable-extensions',
  '--disable-sync', '--disable-component-update', '--disable-background-networking', '--mute-audio',
  '--window-size=1000,900', `--host-resolver-rules=MAP * 127.0.0.1:${port}`, 'about:blank'], {stdio:'ignore',detached:true});
const kill = () => { try { process.kill(-child.pid, 'SIGKILL'); } catch {} };
process.once('exit', kill);
let socket;
const watchdog = setTimeout(() => { console.error('Armor proof exceeded 120 seconds'); kill(); process.exit(2); }, 120000);
try {
  let debugPort;
  for (let i = 0; !debugPort && i < 200; i++) {
    try { debugPort = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch { await sleep(100); }
  }
  if (!debugPort) throw new Error('Chrome did not start');
  const version = await (await fetch(`http://127.0.0.1:${debugPort}/json/version`)).json();
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0; const pending = new Map(), errors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (pending.has(message.id)) {
      const call = pending.get(message.id); pending.delete(message.id);
      message.error ? call.reject(new Error(message.error.message)) : call.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
    else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(a => a.value ?? a.description).join(' '));
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    pending.set(++id, {resolve,reject}); socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  const {targetId} = await send('Target.createTarget', {url:'about:blank'});
  const {sessionId} = await send('Target.attachToTarget', {targetId,flatten:true});
  const call = (method, params) => send(method, params, sessionId);
  const evaluate = async expression => {
    const response = await call('Runtime.evaluate', {expression,returnByValue:true,awaitPromise:true});
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
    return response.result.value;
  };
  await call('Runtime.enable'); await call('Page.enable');
  await call('Emulation.setDeviceMetricsOverride', {width:1000,height:900,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate', {url:`http://127.0.0.1:${port}/`});
  for (let i = 0; !(await evaluate('Boolean(window.armorReady)')) && i < 200; i++) {
    if (errors.length) throw new Error(errors.join('\n'));
    await sleep(100);
  }
  if (!(await evaluate('Boolean(window.armorReady)'))) throw new Error('Armor load did not finish');
  const report = {state:await evaluate('armorState()'),views:[],errors,requested};
  for (const [name,yaw,width,height] of [['front',0,1000,900],['three-quarter',.65,1000,900],['side',1.57,1000,900],['back',3.14,1000,900],['portrait',.4,390,844]]) {
    await call('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:false});
    const state = await evaluate(`armorView(${yaw},${width},${height})`);
    const screenshot = await call('Page.captureScreenshot', {format:'png'});
    fs.writeFileSync(path.join(out, `${name}.png`), Buffer.from(screenshot.data,'base64'));
    report.views.push({name,...state});
  }
  report.bench = await evaluate('armorBench()');
  const first = await evaluate('armorState().frames'); await sleep(1500);
  report.idleFrames = (await evaluate('armorState().frames')) - first;
  report.afterDispose = await evaluate('armorDispose()');
  report.pass = !errors.length && report.state.stateRestored && report.idleFrames === 0
    && report.views.every(view => view.calls === 1 && view.triangles === 39932
      && view.projected.every(p => Math.abs(p[0]) < 1 && Math.abs(p[1]) < 1));
  fs.writeFileSync(path.join(out,'proof.json'), JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
  if (!report.pass) process.exitCode = 1;
} finally {
  clearTimeout(watchdog); socket?.close(); kill(); server.close();
  await sleep(150); fs.rmSync(profile,{recursive:true,force:true});
}
