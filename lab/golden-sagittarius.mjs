// The existing Sagittarius Cloth, loaded for the frozen-film reveal and drawn as the anime's gold (anime-gold.mjs: cels, a hard glint, ink
// at the silhouette; the asset's painted albedo as the detail). Until Oct 16 2026 it was polished metal under a built reflection map, which
// read as a trophy (his words, over it: "that awful cheap indian plasticky golden statue"). This is the previously reviewed TRELLIS study
// (seed 7), not a recovered film volume or the Hades character already wearing the armour. Its geometry, texture, dimensions and silhouette
// are unchanged. The cinematic owner supplies the camera, position, visibility, opacity, glow and time. No renderer, timer or animation loop
// here, and no environment map: the cel shader lights from one direction in view space.
import {GLTFLoader} from '../vendor/embertide-app/ui/intro/room/procedural/GLTFLoader.js';
import {dressInAnimeGold, ANIME_GOLD} from './anime-gold.mjs';

export const GOLDEN_ARMOR = Object.freeze({
  file: 'cloth-trellis.sagittarius.glb',
  kind: 'winged Sagittarius Cloth in its centaur-and-bow form',
  provenance: 'Existing TRELLIS.2 seed-7 study from a shaded reference illustration; not native game geometry or multiview anime reconstruction',
  shading: 'anime-gold',
  triangles: 39932,
  bytes: 1393024,
  height: 1.5997270345687866,
});

export async function createGoldenArmor({THREE, renderer, isAlive = () => true, light = ANIME_GOLD.light} = {}) {
  const started = performance.now();
  // a literal address, so the optimism.fit build (tools/page-files.mjs) finds the file when the mint's glass asks for the statue
  const asset = await new GLTFLoader().loadAsync(new URL('./cloth-trellis.sagittarius.glb', import.meta.url).href);
  const root = new THREE.Group();
  root.name = 'Sagittarius Cloth';
  root.add(asset.scene);
  const geometries = new Set(), textures = new Set();
  root.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    for (const material of [object.material].flat().filter(Boolean)) {
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  // the anime's gold in place of the asset's PBR material (disposed by it); the albedo texture stays, as the paint
  const materials = new Set(dressInAnimeGold(root, {light, transparent: true}));
  for (const material of materials) material.forceSinglePass = true;
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    root.removeFromParent();
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    const bitmaps = new Set();
    for (const texture of textures) {
      const images = [texture.source?.data ?? texture.image].flat();
      for (const image of images) if (typeof image?.close === 'function') bitmaps.add(image);
    }
    textures.forEach(texture => texture.dispose());
    bitmaps.forEach(bitmap => bitmap.close());
  };
  if (!isAlive()) { dispose(); throw new Error('The Sagittarius reveal was cancelled during load'); }
  root.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(root);
  const size = bounds.getSize(new THREE.Vector3()), centre = bounds.getCenter(new THREE.Vector3());
  const metadata = {...GOLDEN_ARMOR, elapsedMs: performance.now() - started,
    size: size.toArray(), centre: centre.toArray(), drawCalls: 1,
    reflectionSize: null, idleWork: 0,
    animated: false, expectedTarget: [0, size.y * 0.5, 0]};
  root.userData.provenance = GOLDEN_ARMOR.provenance;

  /** the Cloth's presence: opacity (0 unseen, 1 whole) and glow (0 its gold, 1 all light), the owner's to move each draw */
  const present = (opacity, glow = 0) => {
    for (const material of materials) {
      material.uniforms.uOpacity.value = opacity; material.uniforms.uGlow.value = glow;
      material.depthWrite = opacity > 0.98;
    }
  };

  return {
    root, bounds, size, centre, metadata, dispose, materials, present,
    // The Cloth is a rigid source study with no wing joints. The owner moves the
    // camera around it; no invented wing deformation is added to this asset.
    update() {},
    // Fit all of the bow and wings, including portrait, without changing the model.
    fitDistance(fovDegrees, aspect, yaw = 0, padding = 1.15) {
      const halfFov = fovDegrees * Math.PI / 360;
      const width = Math.abs(Math.cos(yaw)) * size.x + Math.abs(Math.sin(yaw)) * size.z;
      const depth = Math.abs(Math.sin(yaw)) * size.x + Math.abs(Math.cos(yaw)) * size.z;
      return Math.max(size.y, width / Math.max(aspect, 0.1)) * padding / (2 * Math.tan(halfFov)) + depth / 2;
    },
  };
}

export const createGoldenSagittarius = createGoldenArmor;
