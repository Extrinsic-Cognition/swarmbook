import * as THREE from '../vendor/embertide-app/ui/intro/room/procedural/three.module.js';

// Static presentation geometry. The host draws on input, with no model-owned clock.
// Screen coordinates and key landings share this one physical laptop transform.
export function createLaptop({ rows = [] } = {}) {
  const group = new THREE.Group(); group.name = 'tracenet-laptop';
  const geometries = new Set(), materials = new Set(), textures = new Set();
  const keys = new Map(), geometryCache = new Map();
  const keepGeometry = value => (geometries.add(value), value);
  const keepMaterial = value => (materials.add(value), value);
  const keepTexture = value => (textures.add(value), value);
  const pbr = properties => keepMaterial(new THREE.MeshStandardMaterial(properties));
  const basic = properties => keepMaterial(new THREE.MeshBasicMaterial(properties));
  const metal = pbr({ color: 0x10191c, roughness: .61, metalness: .46 });
  const edge = pbr({ color: 0x27383b, roughness: .5, metalness: .55 });
  const inset = pbr({ color: 0x070e18, roughness: .8, metalness: .2 });
  const rubber = pbr({ color: 0x070b12, roughness: .94 });
  const cap = pbr({ color: 0x546368, roughness: .72, metalness: .05, emissive: 0x143033, emissiveIntensity: .09 });
  const darkCap = pbr({ color: 0x202d31, roughness: .7, metalness: .08 });
  const accentCap = pbr({ color: 0x48605e, roughness: .64, metalness: .12 });
  const cyan = basic({ color: 0x75f2ff, toneMapped: false });
  const softCyan = basic({ color: 0x79c6cb, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const violet = basic({ color: 0xa5c0b7, transparent: true, opacity: .12, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });

  function roundShape(width, height, radius) {
    const x = -width / 2, y = -height / 2, r = Math.min(radius, width / 2, height / 2);
    const shape = new THREE.Shape();
    shape.moveTo(x + r, y); shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  }
  function prism(width, depth, height, radius = .1, bevel = .035) {
    const cacheKey = [width, depth, height, radius, bevel].join(':');
    if (geometryCache.has(cacheKey)) return geometryCache.get(cacheKey);
    const b = Math.min(bevel, height * .45);
    const geometry = keepGeometry(new THREE.ExtrudeGeometry(roundShape(width - b * 2, depth - b * 2, radius), {
      depth: height - b * 2, bevelEnabled: b > 0, bevelSegments: 2,
      steps: 1, bevelSize: b, bevelThickness: b, curveSegments: 4,
    }));
    geometry.center(); geometry.rotateX(-Math.PI / 2);
    geometryCache.set(cacheKey, geometry); return geometry;
  }
  function mesh(parent, geometry, material, x = 0, y = 0, z = 0, shadows = true) {
    const item = new THREE.Mesh(geometry, material); item.position.set(x, y, z);
    item.castShadow = shadows; item.receiveShadow = shadows; parent.add(item); return item;
  }
  function slab(parent, width, depth, height, material, x, y, z, radius = .1, bevel = .035) {
    return mesh(parent, prism(width, depth, height, radius, bevel), material, x, y, z);
  }
  function surface(parent, width, height, material, x, y, z) {
    return mesh(parent, keepGeometry(new THREE.PlaneGeometry(width, height)), material, x, y, z, false);
  }

  // Two chamfered shells, visible thickness, a dark seam, and an actual connected hinge.
  slab(group, 12, 8, .28, metal, 0, -.015, 0, .3, .055);
  slab(group, 11.94, 7.94, .075, edge, 0, .145, 0, .29, .018);
  slab(group, 11.82, 7.82, .035, metal, 0, .2, 0, .27, .008);
  slab(group, 11.9, 7.9, .035, inset, 0, -.13, 0, .28, .008);
  for (const x of [-4.9, 4.9]) for (const z of [-3.1, 3.1]) {
    slab(group, 1.25, .3, .065, rubber, x, -.175, z, .13, .012);
  }
  const hingeGeometry = keepGeometry(new THREE.CylinderGeometry(.22, .22, 2.05, 16));
  hingeGeometry.rotateZ(Math.PI / 2);
  for (const x of [-4.25, 4.25]) mesh(group, hingeGeometry, edge, x, .25, -3.73);
  slab(group, 6.1, .3, .17, inset, 0, .25, -3.72, .08, .025);

  const lid = new THREE.Group(); lid.name = 'hinged-display';
  lid.position.set(0, .3, -3.75); lid.rotation.x = -.18; group.add(lid);
  const lidShell = slab(lid, 11.8, 6.8, .22, metal, 0, 3.4, 0, .25, .04);
  lidShell.rotation.x = Math.PI / 2;
  const lidTrim = slab(lid, 11.65, 6.65, .035, edge, 0, 3.4, .115, .21, .009);
  lidTrim.rotation.x = Math.PI / 2;
  const bezel = slab(lid, 11.49, 6.49, .03, inset, 0, 3.4, .137, .18, .007);
  bezel.rotation.x = Math.PI / 2;
  const screenGroup = new THREE.Group(); screenGroup.name = 'screen-plane';
  screenGroup.position.set(0, 3.6, .17); lid.add(screenGroup);
  // The live HTML screen sits behind the WebGL layer. This depth-writing alpha
  // aperture lets foreground characters occlude it correctly in the same camera.
  surface(screenGroup, 10.9, 5.8, basic({ color: 0x000000, opacity: 0, blending: THREE.NoBlending }), 0, 0, -.005);
  const screen = { group: screenGroup, width: 10.9, height: 5.8, center: new THREE.Vector3(0, 3.6, .17), lid };
  const webcam = mesh(lid, keepGeometry(new THREE.SphereGeometry(.036, 8, 6)), cyan, 0, 6.65, .16, false);
  webcam.scale.z = .25;

  // A single glyph atlas avoids one image allocation or texture switch per key.
  const entries = rows.flat().map(item => typeof item === 'string' ? { key: item, label: item } : item);
  const glyphs = entries.map(item => item.label ?? item.key);
  glyphs.push('DYSON / TRACENET');
  const tile = 128, columns = 8, atlasRows = Math.ceil(glyphs.length / columns);
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  let legendMap = null;
  if (canvas) {
    canvas.width = tile * columns; canvas.height = tile * atlasRows;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      glyphs.forEach((label, index) => {
        const x = (index % columns + .5) * tile, y = (Math.floor(index / columns) + .5) * tile;
        ctx.font = `${label.length > 6 ? 14 : label.length > 1 ? 29 : 53}px ui-monospace, monospace`;
        ctx.fillStyle = '#c5d7c9';
        ctx.shadowColor = '#b8e0da'; ctx.shadowBlur = 15; ctx.fillText(label, x, y);
        ctx.shadowBlur = 0; ctx.fillStyle = '#cfddd2'; ctx.fillText(label, x, y);
      });
      legendMap = keepTexture(new THREE.CanvasTexture(canvas));
      legendMap.colorSpace = THREE.SRGBColorSpace;
    }
  }
  const legendMaterial = basic({ map: legendMap, color: legendMap ? 0xffffff : 0x9defff, transparent: true, alphaTest: .04, toneMapped: false, depthWrite: false });
  function legend(parent, index, width, height, x, y, z, horizontal = true) {
    if (!legendMap) return null;
    const geometry = keepGeometry(new THREE.PlaneGeometry(width, height));
    const uv = geometry.attributes.uv;
    const col = index % columns, row = Math.floor(index / columns);
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (col + uv.getX(i)) / columns, 1 - (row + 1 - uv.getY(i)) / atlasRows);
    const item = mesh(parent, geometry, legendMaterial, x, y, z, false);
    if (horizontal) item.rotation.x = -Math.PI / 2;
    return item;
  }
  legend(lid, glyphs.length - 1, 1.8, .25, 0, .36, .16, false);

  slab(group, 10.98, 4.55, .06, inset, 0, .21, -.97, .22, .014);
  let glyphIndex = 0;
  rows.forEach((row, rowIndex) => {
    const items = row.map(item => typeof item === 'string' ? { key: item, label: item } : item);
    const total = items.reduce((sum, item) => sum + (item.width ?? 1), 0);
    const gap = .105, unit = (10.5 - (items.length - 1) * gap) / total;
    let cursor = -5.25;
    items.forEach(item => {
      const width = unit * (item.width ?? 1), x = cursor + width / 2, z = -2.75 + rowIndex * 1.08;
      const keyGroup = new THREE.Group(); keyGroup.name = `key-${item.key}`; keyGroup.position.set(x, .26, z); group.add(keyGroup);
      const glow = slab(keyGroup, width + .045, .965, .025, rowIndex === 2 ? violet : softCyan, 0, .025, 0, .11, .008);
      glow.castShadow = false; glow.receiveShadow = false;
      slab(keyGroup, width - .025, .9, .34, item.accent === 'teal' ? accentCap : item.accent === 'dark' ? darkCap : cap, 0, .22, 0, .1, .055);
      // The slightly inset top catches the screen light separately from the broad sculpted bevel.
      slab(keyGroup, width - .115, .79, .026, item.accent === 'teal' ? accentCap : item.accent === 'dark' ? darkCap : cap, 0, .397, -.012, .09, .01);
      legend(keyGroup, glyphIndex++, Math.min(width - .12, item.label?.length > 2 ? width * .75 : .57), .57, 0, .415, -.035);
      const landing = { group: keyGroup, topY: .675, x, z, width, depth: .9, baseY: .26 };
      keyGroup.userData.key = item.key; keys.set(item.key, landing);
      cursor += width + gap;
    });
  });

  // The generous palm rest and inset trackpad make the silhouette unmistakably a laptop.
  slab(group, 3.64, 1.76, .025, edge, 0, .228, 2.43, .16, .007);
  slab(group, 3.58, 1.7, .03, pbr({ color: 0x1b2b3b, roughness: .54, metalness: .46 }), 0, .24, 2.43, .15, .007);
  const trackGlow = slab(group, 3.05, .014, .007, softCyan, 0, .259, 3.16, .005, .002);
  trackGlow.castShadow = false;
  // Speaker perforations share one geometry and one draw call.
  const holeGeometry = keepGeometry(new THREE.CircleGeometry(.022, 6)); holeGeometry.rotateX(-Math.PI / 2);
  const speakers = new THREE.InstancedMesh(holeGeometry, inset, 100); const matrix = new THREE.Matrix4();
  for (let i = 0; i < 100; i++) {
    const side = i < 50 ? -1 : 1, j = i % 50;
    matrix.makeTranslation(side * (4.08 + (j % 10) * .105), .239, 1.8 + Math.floor(j / 10) * .12);
    speakers.setMatrixAt(i, matrix);
  }
  group.add(speakers);
  // A small prism mark, glowing on the palm rest rather than more interface copy.
  const mark = mesh(group, keepGeometry(new THREE.OctahedronGeometry(.16)), cyan, 4.95, .29, 3.05, false);
  mark.scale.y = .13; mark.rotation.y = Math.PI / 4;
  for (const x of [-5.92, 5.92]) {
    const port = slab(group, .045, .63, .075, inset, x, .02, 2.4, .02, .01);
    port.castShadow = false;
  }

  // One shadow-casting key light. Remaining light is cheap fill and monitor bounce.
  const moon = new THREE.DirectionalLight(0x7397b2, .8); moon.position.set(-12, 8, -8);
  moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024);
  moon.shadow.camera.left = -9; moon.shadow.camera.right = 9;
  moon.shadow.camera.top = 10; moon.shadow.camera.bottom = -9;
  moon.shadow.camera.near = .5; moon.shadow.camera.far = 40;
  moon.shadow.normalBias = .035; moon.shadow.bias = -.00025; moon.shadow.radius = 3;
  group.add(moon); group.add(moon.target);
  const sky = new THREE.HemisphereLight(0x79909a, 0x080b11, .22); group.add(sky);
  const screenLight = new THREE.PointLight(0xa0d4ca, 32, 13, 2); screenLight.position.set(0, 3.15, -2.45); group.add(screenLight);
  const candle = new THREE.PointLight(0xffbb74, 18, 11, 2); candle.position.set(-4, 2.3, 1); group.add(candle);

  const floor = mesh(group, keepGeometry(new THREE.PlaneGeometry(110, 110)), pbr({ color: 0x17181a, roughness: .92, metalness: 0 }), 0, -.212, 0, false);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
  // A broad optical pool gives the dark desk contact without a post-processing pass.
  if (canvas) {
    const glowCanvas = document.createElement('canvas'); glowCanvas.width = glowCanvas.height = 128;
    const ctx = glowCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(85,139,133,.13)'); gradient.addColorStop(.45, 'rgba(47,77,87,.05)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
      const texture = keepTexture(new THREE.CanvasTexture(glowCanvas)); texture.colorSpace = THREE.SRGBColorSpace;
      const pool = surface(group, 24, 16, basic({ map: texture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), 0, -.205, -.3);
      pool.rotation.x = -Math.PI / 2;
    }

    // A window outside the frame leaves its four panes across the desk. It is
    // baked once into the scene, not a particle system or an idle animation.
    const windowCanvas = document.createElement('canvas'); windowCanvas.width = 256; windowCanvas.height = 512;
    const wc = windowCanvas.getContext('2d');
    if (wc) {
      wc.shadowColor = '#89abc6'; wc.shadowBlur = 18; wc.fillStyle = '#7897ad';
      for (const x of [26, 138]) for (const y of [28, 270]) wc.fillRect(x, y, 85, 208);
      const texture = keepTexture(new THREE.CanvasTexture(windowCanvas)); texture.colorSpace = THREE.SRGBColorSpace;
      const light = surface(group, 11, 25, basic({ map: texture, transparent: true, opacity: .14, depthWrite: false, blending: THREE.AdditiveBlending }), -10, -.201, -5);
      light.rotation.set(-Math.PI / 2, 0, -.42);
    }
  }
  group.updateMatrixWorld(true);
  return { group, keys, screen, dispose() {
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const texture of textures) texture.dispose();
    moon.shadow.dispose(); speakers.dispose(); group.removeFromParent(); group.clear();
  } };
}
