import * as THREE from '../vendor/embertide-app/ui/intro/room/procedural/three.module.js';
import { createLaptop } from './tracenet-laptop-model.mjs';
import { planeMatrix, jumpPoint } from './tracenet-projection.mjs';
import { createProfileLyssajudron } from './tracenet-lyssajudron.mjs';
import { LIQUID, fuelLevel } from '../vendor/embertide-app/ui/intro/room/unit0-liquid.mjs';

// Local presentation only. The GPU sleeps once a deliberate camera move or hop ends.
export function mountLaptop({ doc, win, host, screenElement, rows, appearance, onKey, onActor, onAvailabilityChange, onEnter, controls = {} }) {
  const surface = doc.createElement('div'); surface.className = 'tn-render-surface';
  host.prepend(surface);
  let renderer;
  // TO THE BONE (his Oct 23 2026 16:3x WEST, "why the fuck those scenes are so fucking laggy? strip them to the bone"): one pixel a CSS pixel (it was 1.75: 2520 x 1575
  // in a 1440 x 900 window), no multisampling, no tone mapping, no shadow maps (the actors keep their painted shadows); it still draws only on a cause.
  try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' }); }
  catch (error) { surface.remove(); throw error; }
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-label', 'Your Lyssajudron on a laptop at night. Fuel level unavailable. Select a key to make it type.');
  canvas.setAttribute('role', 'img'); canvas.tabIndex = 0; canvas.dataset.renderer = 'webgl';
  surface.append(canvas);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
  const laptop = createLaptop({ rows }); scene.add(laptop.group);
  const actors = [], jobs = new Set(), disposables = [];
  let frame = 0, stopped = false, active = true, reading = false, available = true, width = 1, height = 1;
  let yaw = -.36, pitch = .7, drag = null, level = null, sloshAt = null, sloshEnergy = 1;   // her unit0's fuel (the purse's level) and the settle after it moved or a piranha bit it
  const focus = new THREE.Vector3(-.25, 1.05, -1.25);
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
  const shadowCanvas = doc.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 64;
  const shadowContext = shadowCanvas.getContext('2d');
  const gradient = shadowContext.createRadialGradient(32, 32, 2, 32, 32, 31);
  gradient.addColorStop(0, '#000c'); gradient.addColorStop(1, '#0000');
  shadowContext.fillStyle = gradient; shadowContext.fillRect(0, 0, 64, 64);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas); disposables.push(shadowTexture);

  const lyssajudron = createProfileLyssajudron({ appearance });
  {
    const sprite = lyssajudron.group, size = [1, 1];
    sprite.userData.actor = 0;
    const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: .65 });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .75), shadowMaterial); shadow.rotation.x = -Math.PI / 2;
    scene.add(sprite, shadow);
    actors[0] = { sprite, shadow, key: 'G', size };
    disposables.push(shadowMaterial, shadow.geometry);
    place(0, 'G'); invalidate();
  }

  function keyOf(key) { return laptop.keys.get(key.toUpperCase()) ?? laptop.keys.get(key); }
  function destination(key) { const item = keyOf(key); return item ? new THREE.Vector3(item.x, item.topY + .02, item.z) : null; }
  function place(index, key) {
    const actor = actors[index], to = destination(key); if (!actor || !to) return;
    actor.key = key; actor.sprite.position.copy(to); actor.shadow.position.set(to.x, to.y + .008, to.z);
    invalidate();
  }
  function updateCamera() {
    const aspect = width / height;
    // Frame the inhabitants and keys. The case and lid may leave the shot.
    const radius = 15.5 * Math.max(1, .98 / aspect);
    camera.aspect = aspect; camera.updateProjectionMatrix();
    camera.position.set(focus.x + Math.sin(yaw) * Math.cos(pitch) * radius,
      focus.y + Math.sin(pitch) * radius, focus.z + Math.cos(yaw) * Math.cos(pitch) * radius);
    camera.lookAt(focus); camera.rotateZ(-.075); camera.updateMatrixWorld();
  }
  function projectScreen() {
    if (reading) return;
    const { group, width: sw, height: sh } = laptop.screen;
    const points = [[-1, 1], [1, 1], [1, -1], [-1, -1]].map(([x, y]) => {
      const p = new THREE.Vector3(x * sw / 2, y * sh / 2, 0);
      group.localToWorld(p); p.project(camera);
      return { x: (p.x + 1) * width / 2, y: (1 - p.y) * height / 2 };
    });
    const matrix = planeMatrix(points, 1000, 540);
    if (matrix) screenElement.style.transform = `matrix3d(${matrix.join(',')})`;
  }
  function draw(now) {
    frame = 0; if (stopped || !active || !available || doc.hidden) return;
    for (const job of [...jobs]) if (job.tick(now)) { jobs.delete(job); job.resolve(true); }
    if (sloshAt !== null) {   // the fuel settles for LIQUID.settleMs after a level change, a hop or a bite, then the GPU sleeps again
      sloshAt ||= now;
      const elapsed = now - sloshAt, t = Math.min(1, elapsed / LIQUID.settleMs);
      lyssajudron.slosh(elapsed / 1000, reduced.matches ? 0 : (1 - t) ** 2 * sloshEnergy);
      if (t >= 1 || reduced.matches) { sloshAt = null; sloshEnergy = 1; }
    }
    for (const actor of actors) actor.sprite.rotation.z = actor.sprite.userData.tilt || 0;
    scene.updateMatrixWorld(true); projectScreen(); renderer.render(scene, camera);
    if (jobs.size || sloshAt !== null) invalidate();
  }
  function invalidate() { if (!frame && !stopped && active && available && !doc.hidden) frame = win.requestAnimationFrame(draw); }
  function hop(index, key, instant = false) {
    const actor = actors[index], to = destination(key), cap = keyOf(key);
    if (!actor || !to) return Promise.resolve(true);
    const from = actor.sprite.position.clone(); actor.key = key;
    if (instant || reduced.matches) { place(index, key); return Promise.resolve(true); }
    if (level > 0) { sloshAt = 0; sloshEnergy = 1; }   // her hop shakes the fuel in her unit0
    return new Promise(resolve => {
      let start = null; const capY = cap.group.position.y;
      const job = { resolve, tick(now) {
        start ??= now; const elapsed = now - start;
        if (elapsed <= 350) {
          const t = elapsed / 350, p = jumpPoint(from, to, t);
          actor.sprite.position.set(p.x, p.y, p.z); actor.sprite.userData.tilt = Math.sin(t * Math.PI) * -.11;
          actor.shadow.position.set(p.x, to.y + .008, p.z); actor.shadow.material.opacity = .65 - Math.sin(t * Math.PI) * .35;
        } else {
          const t = Math.min(1, (elapsed - 350) / 150), squash = Math.sin(t * Math.PI);
          cap.group.position.y = capY - .13 * squash;
          actor.sprite.position.copy(to); actor.sprite.position.y -= .13 * squash;
          actor.sprite.scale.set(actor.size[0] * (1 + .13 * squash), actor.size[1] * (1 - .14 * squash), 1);
          actor.sprite.userData.tilt = 0;
        }
        if (elapsed >= 500) { cap.group.position.y = capY; actor.sprite.scale.set(...actor.size, 1); return true; }
        return false;
      }, cancel() { cap.group.position.y = capY; actor.sprite.userData.tilt = 0; actor.sprite.scale.set(...actor.size, 1); place(index, key); } };
      jobs.add(job); invalidate();
    });
  }
  function cancel() { for (const job of jobs) { job.cancel(); job.resolve(false); } jobs.clear(); if (sloshAt !== null) { sloshAt = null; sloshEnergy = 1; lyssajudron.slosh(0, 0); } invalidate(); }
  function hitNode(event) {
    const rect = canvas.getBoundingClientRect(); pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects([...actors.filter(Boolean).map(actor => actor.sprite), ...[...laptop.keys.values()].map(key => key.group)], true)[0];
    if (!hit) return null;
    let node = hit.object;
    while (node && node.userData.actor === undefined && node.userData.key === undefined) node = node.parent;
    return node;
  }
  function pick(event) {
    const node = hitNode(event);
    if (node?.userData.actor !== undefined) onActor(node.userData.actor);
    else if (node?.userData.key !== undefined) onKey(node.userData.key);
  }
  const down = event => {
    if (event.button !== 0 || !active || !available || reading || event.target.closest('.tn-scene-controls')) return;
    if (event.target.closest('.tn-monitor') && hitNode(event)?.userData.actor === undefined) return;
    event.preventDefault(); event.stopPropagation(); canvas.focus({ preventScroll: true });
    drag = { x: event.clientX, y: event.clientY, yaw, pitch, moved: false }; host.setPointerCapture(event.pointerId);
  };
  const move = event => {
    if (!drag) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 5) drag.moved = true;
    if (!drag.moved) return;
    yaw = THREE.MathUtils.clamp(drag.yaw + dx * .00065, -.43, -.29);
    pitch = THREE.MathUtils.clamp(drag.pitch + dy * .0005, .66, .74); updateCamera(); invalidate();
  };
  const up = event => { if (!drag) return; if (!drag.moved) pick(event); drag = null; };
  const abortDrag = () => { drag = null; };
  host.addEventListener('pointerdown', down, true); host.addEventListener('pointermove', move);
  host.addEventListener('pointerup', up); host.addEventListener('pointercancel', abortDrag);
  const resize = () => { width = host.clientWidth; height = host.clientHeight; renderer.setSize(width, height); updateCamera(); invalidate(); };
  const observer = new win.ResizeObserver(resize); observer.observe(host);
  const readButton = controls.readButton ?? doc.getElementById('tn-open-screen');
  const enterLabel = readButton.textContent;
  const browsing = [...screenElement.querySelectorAll('.tn-screen-tabs, .tn-screen-content')];
  function readScreen() {
    if (onEnter) { onEnter(); return; }
    reading = !reading; doc.body.classList.toggle('is-reading', reading); readButton.textContent = reading ? 'Back to the night' : 'Enter Tracenet';
    for (const region of browsing) region.inert = !reading;
    readButton.setAttribute('aria-expanded', String(reading));
    if (reading) { screenElement.style.transform = ''; screenElement.focus({ preventScroll: true }); }
    invalidate();
  }
  readButton.addEventListener('click', readScreen);
  const enterScreen = () => { if (!reading && available) readScreen(); };
  screenElement.addEventListener('click', enterScreen);
  const skipLink = controls.skipLink ?? doc.querySelector('.tn-skip'); skipLink?.addEventListener('click', enterScreen);
  const reset = () => { yaw = -.36; pitch = .7; updateCamera(); invalidate(); };
  const resetButton = controls.resetButton ?? doc.getElementById('tn-reset-camera'); resetButton?.addEventListener('click', reset);
  const visibility = () => { if (doc.hidden) { cancel(); if (frame) win.cancelAnimationFrame(frame); frame = 0; } else invalidate(); };
  doc.addEventListener('visibilitychange', visibility);
  const keyboard = controls.keyboard ?? doc.querySelector('.tn-keyboard');
  const closeReading = () => { reading = false; doc.body.classList.remove('is-reading'); readButton.textContent = enterLabel; readButton.setAttribute('aria-expanded', 'false'); };
  const contextLost = event => {
    event.preventDefault(); available = false; cancel(); closeReading();
    if (frame) win.cancelAnimationFrame(frame); frame = 0;
    doc.body.classList.remove('is-spatial'); screenElement.style.transform = ''; keyboard.inert = false;
    for (const region of browsing) region.inert = false;
    onAvailabilityChange?.(false);
  };
  const contextRestored = () => { available = true; doc.body.classList.add('is-spatial'); keyboard.inert = true; for (const region of browsing) region.inert = true; onAvailabilityChange?.(true); resize(); };
  canvas.addEventListener('webglcontextlost', contextLost); canvas.addEventListener('webglcontextrestored', contextRestored);
  doc.body.classList.add('is-spatial'); keyboard.inert = true; for (const region of browsing) region.inert = true; resize();
  return { get available() { return available; }, enter: enterScreen, place, hop, cancel,
    setActive(value) { active = value !== false; if (!active) { cancel(); drag = null; if (frame) win.cancelAnimationFrame(frame); frame = 0; } else invalidate(); },
    appearance(value) { lyssajudron.appearance(value); invalidate(); },
    fuel(value, bite = 0) {   // the purse's level (0 to 1) as the liquid in her unit0; null: unknown, no liquid drawn. bite: a fresh burn's energy (THE PIRANHAS) — it moves the surface even when the level's thousandth did not move
      const next = fuelLevel(value), energy = fuelLevel(bite) ?? 0;
      if (next === level && energy <= 0) return;
      const moved = next !== level; level = next;
      if (moved) {
        lyssajudron.fuel(level);
        canvas.setAttribute('aria-label', `Your Lyssajudron on a laptop at night. ${level === null ? 'Fuel level unavailable.' : level === 0 ? 'Unit0 is empty.' : 'Unit0 holds its fuel as liquid.'} Select a key to make it type.`);
      }
      if (level > 0 && !reduced.matches) { sloshAt = 0; sloshEnergy = Math.max(moved ? 1 : 0, energy); }
      else { sloshAt = null; sloshEnergy = 1; lyssajudron.slosh(0, 0); }
      invalidate();
    }, stop() {
    stopped = true; cancel(); if (frame) win.cancelAnimationFrame(frame); observer.disconnect();
    doc.removeEventListener('visibilitychange', visibility); readButton.removeEventListener('click', readScreen);
    screenElement.removeEventListener('click', enterScreen); skipLink?.removeEventListener('click', enterScreen);
    host.removeEventListener('pointerdown', down, true); host.removeEventListener('pointermove', move);
    host.removeEventListener('pointerup', up); host.removeEventListener('pointercancel', abortDrag);
    resetButton?.removeEventListener('click', reset);
    lyssajudron.dispose(); laptop.dispose(); for (const resource of disposables) resource.dispose(); renderer.dispose(); surface.remove();
    doc.body.classList.remove('is-spatial', 'is-reading'); screenElement.style.transform = ''; keyboard.inert = false;
    for (const region of browsing) region.inert = false;
  } };
}
