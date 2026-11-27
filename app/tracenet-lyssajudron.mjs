import * as THREE from '../vendor/embertide-app/ui/intro/room/procedural/three.module.js';
import { mountLyssajudron } from '../vendor/embertide-app/ui/intro/room/lyssajudron.mjs';
import { genesisClock, GENESIS_MS } from '../vendor/embertide-app/ui/intro/room/lyssajudron-score.mjs';

// A profile portrait of the canonical body, inside the laptop's existing renderer.
// Its pose is sampled once; key hops move the portrait, never the Nest entity.
export function createProfileLyssajudron({ appearance } = {}) {
  const group = new THREE.Group(), holder = new THREE.Group();
  group.add(holder); holder.scale.setScalar(2.65);
  const clock = genesisClock(GENESIS_MS);
  const twin = { THREE, host: null,
    stage: { addLayer: object => holder.add(object), removeLayer: object => holder.remove(object), touch() {} },
    clock: () => clock, animate() {}, work: () => ({ paintMsPerBeat: 0 }), requestPaint() {},
    place: () => null, ghost: () => null, glasses: () => [], camera: () => null };
  const body = mountLyssajudron(twin, { document: null, council: false, ferro: false, breath: false, wasm: false, samplesPerBeat: 0 });
  body.sample({ clock });
  for (const root of holder.children) {
    root.position.y = .52 - body.body()[1];
    // The same portrait adapter used by the well: its floor belongs to the host.
    for (const child of root.children) {
      if (child.isMesh && !child.isInstancedMesh && ['CircleGeometry', 'RingGeometry'].includes(child.geometry?.type)) child.visible = false;
    }
  }
  holder.rotation.y = -.24; holder.rotation.x = -.18;
  const lamp = new THREE.PointLight(0xe9f2f8, 2.1, 4, 2);
  lamp.position.set(0, 1.25, .2); group.add(lamp);
  function apply(value) {
    if (!value) return;
    body.paint(value.parts); body.form(value.gaze);
    body.light?.(value.light);
    lamp.color.set(value.light);
    holder.traverse(node => { if (node.userData.part === 'light' && node.material?.color) node.material.color.set(value.light); });
    body.sample({ clock });
  }
  apply(appearance);
  return { group, appearance: apply, fuel: level => body.fuel(level), slosh: (seconds, energy) => body.slosh(seconds, energy), dispose() {
    const resources = new Set();
    holder.traverse(node => {
      if (node.geometry) resources.add(node.geometry);
      for (const material of Array.isArray(node.material) ? node.material : node.material ? [node.material] : []) {
        resources.add(material); if (material.map) resources.add(material.map);
      }
    });
    body.stop(); for (const resource of resources) resource.dispose(); group.removeFromParent();
  } };
}
