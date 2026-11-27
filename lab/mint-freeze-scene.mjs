// The picture holds briefly while the anime soundtrack continues. Athena, her
// hair, the fighters and the summit remain the source drawing. The original
// animated transformation resumes after this bounded camera movement.
// Authored camera over the intact source drawing, not a recovered 4D set. Transport owns
// time: no timers, game controls, audio calls or idle animation callbacks here.
import * as THREE from 'three';
import {FREEZE} from './mint-freeze-layout.mjs';
import {cinematicScore, CINEMATIC} from './mint-cinematic-score.mjs';

export async function createMintFreezeScene({renderer, canvas, film, stage, pictureRect, isAlive = () => true, onChange = () => {}}) {
  const doc = stage.ownerDocument;
  if (!isAlive()) throw new Error('Cinematic closed before initialization');
  const heldPicture = doc.createElement('canvas'); heldPicture.width = 960; heldPicture.height = 540;
  const context = heldPicture.getContext('2d', {alpha: false});
  const frame = new THREE.CanvasTexture(heldPicture);
  for (const texture of [frame]) {
    texture.colorSpace = THREE.NoColorSpace; texture.generateMipmaps = false;
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  }
  const backdrop = new THREE.Scene();
  const flatCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({depthTest: false, depthWrite: false, toneMapped: false,
    uniforms: {uFrame: {value: frame},
      uRect: {value: new THREE.Vector4(0, 0, 1, 1)}, uPan: {value: new THREE.Vector2()},
      uSpatial: {value: 0}, uZoom: {value: 1}, uExit: {value: 0}},
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
    fragmentShader: `
      uniform sampler2D uFrame;
      uniform vec4 uRect;
      uniform vec2 uPan;
      uniform float uSpatial, uZoom, uExit;
      varying vec2 vUv;
      void main() {
        vec2 uv = (vUv - uRect.xy) / uRect.zw;
        // Keep the drawing whole: the previous layer fills left visible
        // cutout seams. This is a bounded image move, not a 3D reconstruction.
        uv = (uv - vec2(0.5)) / uZoom + vec2(0.5) + uPan;
        bool inside = uv.x >= 82.0/960.0 && uv.x <= 878.0/960.0 && uv.y >= 3.0/540.0 && uv.y <= 537.0/540.0;
        vec3 exact = inside ? texture2D(uFrame, uv).rgb : vec3(0.0);
        if (uSpatial <= 0.0) { gl_FragColor=vec4(exact,1.0); return; }
        // Leave through the source's wall of light, then rejoin the film.
        vec3 color = mix(exact,vec3(1.0,0.975,0.86),uExit);
        gl_FragColor=vec4(color,1.0);
      }`});
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material); backdrop.add(quad);
  let active = false, disposed = false, captured = false, elapsed = 0, renders = 0, rect = null, completed = false;
  let score = cinematicScore(0), lastTick = NaN;

  function resize() {
    if (!active || disposed) return;
    const box = stage.getBoundingClientRect();
    const width = Math.max(1, box.width), height = Math.max(1, box.height);
    rect = pictureRect?.() ?? {left: 0, top: 0, width, height};
    const dpr = Math.min(doc.defaultView.devicePixelRatio || 1, 2, Math.sqrt(2.6e6 / (width * height)));
    if (renderer.getPixelRatio() !== 1) renderer.setPixelRatio(1);
    const w = Math.round(width * dpr), h = Math.round(height * dpr);
    if (canvas.width !== w || canvas.height !== h) renderer.setSize(w, h, false);
    Object.assign(canvas.style, {left:'0px',top:'0px',width:`${width}px`,height:`${height}px`,opacity:'1',pointerEvents:'none',cursor:'default'});
    canvas.hidden = false; canvas.removeAttribute('aria-hidden');
    canvas.setAttribute('role','img'); canvas.setAttribute('aria-label','A brief camera movement through Athena’s frozen anime drawing.');
    material.uniforms.uRect.value.set(rect.left/width, 1-(rect.top+rect.height)/height,rect.width/width,rect.height/height);
  }
  function setHeld(value) {
    if (disposed || Boolean(value) === active) return;
    active = Boolean(value); elapsed = 0; lastTick = NaN; completed = false; score = cinematicScore(0);
    if (active) {
      context.drawImage(film, 0, 0, 960, 540); frame.needsUpdate = true; captured = true; resize();
    }
  }
  function tick(mediaClockSeconds) {
    if (!active || disposed || !Number.isFinite(mediaClockSeconds)) return;
    const next = Math.max(0, Math.min(CINEMATIC.duration, mediaClockSeconds-CINEMATIC.start));
    if (next === lastTick) return;
    lastTick = elapsed = next; score = cinematicScore(elapsed); completed = elapsed >= CINEMATIC.duration;
    onChange();
  }
  function draw() {
    if (!active || disposed || !captured) return;
    resize();
    const old = {autoClear:renderer.autoClear,scissorTest:renderer.getScissorTest(),
      viewport:renderer.getViewport(new THREE.Vector4()), scissor:renderer.getScissor(new THREE.Vector4())};
    const screen = renderer.getSize(new THREE.Vector2());
    try {
      renderer.setViewport(0,0,screen.x,screen.y); renderer.setScissorTest(false); renderer.autoClear = false;
      renderer.clear(true,true,true);
      material.uniforms.uPan.value.set(...score.pan);
      material.uniforms.uSpatial.value = score.spatial; material.uniforms.uZoom.value = score.zoom;
      material.uniforms.uExit.value = score.exit;
      renderer.render(backdrop,flatCamera);
      canvas.dataset.mintFreeze = 'cinematic'; renders++;
    } finally {
      renderer.autoClear=old.autoClear; renderer.setViewport(old.viewport); renderer.setScissor(old.scissor); renderer.setScissorTest(old.scissorTest);
    }
  }
  function dispose() {
    if (disposed) return; disposed=true; active=false;
    frame.dispose(); material.dispose(); quad.geometry.dispose();
  }
  // Compile the single source composite before its first visible frame.
  try {
    await renderer.compileAsync(backdrop,flatCamera);
    if (!isAlive()) throw new Error('Cinematic closed during shader compilation');
  } catch (error) { dispose(); throw error; }
  return {ready:true,get active(){return active;},setHeld,tick,draw,resize,dispose,
    state:()=>({active,frame:FREEZE.frame,elapsed,duration:CINEMATIC.duration,completed,renders,
      mode:'anime-source-camera',pose:{eye:[...score.pan,score.zoom],target:[0,0,0]},
      score,rect,assets:['decoded anime frame 1111'],
      reconstruction:'intact source drawing and authored image movement; no recovered hidden geometry'})};
}
