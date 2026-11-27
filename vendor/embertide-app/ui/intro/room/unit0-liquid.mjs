// Unit0's battery. Three small draws, no simulation, render target, texture, timer or network read. The host owns level and time.
// THE COLOUR OF THE LIQUID (his Oct 16 2026 17:17 WEST, over his window's picture of 17:04: "the color that was the hexagons there before needs to become the
// color of the liquid"). The hexagons in that picture that had a colour were her twelve's: their seams burning in their tones (lyssajudron-band.mjs SPECTRUM,
// THE TWELVE PLAY), the teal and mint of the kick's voice the most of them (read off the picture: about 12,900 px of the teal-to-cyan family against 4,300 of
// the blues and violets); her unit0's own tiles in it are grey-ivory porcelain over the black of her ferrofluid, no colour of their own. From 17:2x the liquid
// was that porcelain (INK.ivory, INK.ivoryDeep), the shell's own colour behind a glass of it: a tank that reads as empty, his complaint itself. So the liquid
// is the kick's voice: the volume its teal (SPECTRUM[1] #30a890, chair 4's tone), the surface its mint (SPECTRUM[0] #60d8a8, chair 0's), clear against the
// ivory and the white vinyl of her porcelain on every glass. Literals here (this file imports nothing: the phones' mirror reads it bare); her-fuel.test.mjs
// holds them equal to the band's.
export const LIQUID = Object.freeze({ segments: 24, rings: 10, bubbles: 7, radius: .89, settleMs: 2400, volume: 0x30a890, surface: 0x60d8a8 });
export const fuelLevel = value => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : null;
// The tank is the purse (his Sept 18 2026: "turn the unit0 of every swarm as the "tank fuel""): house/purse's level is what fills unit0 on
// every glass that draws her (the Board, the well, the laptop). Rounded to a thousandth: a call too small to move the liquid moves no glass.
// HIS WORD ON THE TANK (his Oct 16 2026 17:17:32 WEST, over the same picture: "why the fuck is the tank fuel empty? make it 50% full"): one field on the purse,
// `his` = {level, by, at, why}, written by his word (the-one.mjs tank) and carried as it stands by every writer of the purse (house-purse.mjs purseOf). While it
// stands, its level is the tank's on every glass; the purse's own level, money, ledger and burns stand untouched beside it (the burns still bite the surface).
// A word that is not whole (a level outside [0, 1], no by, no ISO 8601 instant for at) is no word: the purse's own level, as before. hisWord is the word as a
// writer carries it (house-purse.mjs purseOf) and RoomState.swift reads it (the iPad's copy of this law); hisLevel is what a glass takes of it.
const INSTANT = /^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d{1,9})?)?(?:Z|[+-]\d\d:\d\d)$/;
export const hisWord = word => word && typeof word === 'object' && typeof word.level === 'number' && Number.isFinite(word.level) && word.level >= 0 && word.level <= 1
  && typeof word.by === 'string' && word.by.length > 0 && word.by.length <= 64 && typeof word.at === 'string' && INSTANT.test(word.at) && Number.isFinite(Date.parse(word.at))
  ? { level: word.level, by: word.by, at: word.at, ...(typeof word.why === 'string' && word.why ? { why: word.why.slice(0, 400) } : {}) } : null;
export const hisLevel = word => hisWord(word)?.level ?? null;
export const PURSE_REF = 'house/purse', PURSE_SCHEMA = 'embertide.purse/v1';
export const purseLevel = value => {
  if (value?.schema !== PURSE_SCHEMA) return null;
  const level = hisLevel(value.his) ?? value.level;
  return typeof level === 'number' && Number.isFinite(level) ? Math.round(Math.max(0, Math.min(1, level)) * 1000) / 1000 : null;
};

// THE PIRANHAS (his Sept 24 2026 18:51, "the tank fuel showing minirouter live"; Sept 28 21:56, "THE MMO LIKE ANIMATION OF TANK FUEL BEING
// SLOWLY DEPLETED LIKE FUCKIN PIRANHAS"; Oct 15 11:29, "The Lyssajudron spends that fuel to act ... the fuel level and expenditure make its
// available power and actual consumption tangible"): the purse's burns are the minirouter's live spend, and each new one takes a visible bite
// out of the liquid — the level steps down and the surface thrashes with the bite's size, then settles (the hosts' settle, LIQUID.settleMs).
// Only sanitized numbers and words cross; the last 64 burns bound every host's memory.
export const BURNS_MAX = 64, BITE_FLOOR_USD = 0.0001;
export const purseBurns = value => {
  if (value?.schema !== PURSE_SCHEMA || !Array.isArray(value.burns)) return Object.freeze([]);
  const burns = [];
  for (const b of value.burns) {
    if (!b || typeof b !== 'object' || !Number.isFinite(b.cost_usd) || b.cost_usd < 0 || !Number.isFinite(b.at_ms)) continue;
    burns.push(Object.freeze({ id: typeof b.id === 'string' && b.id ? b.id : `${b.at_ms}:${b.cost_usd}`,
      at_ms: b.at_ms, cost_usd: b.cost_usd, lane: typeof b.lane === 'string' ? b.lane : null }));
  }
  return Object.freeze(burns.slice(-BURNS_MAX));
};
// The bite's slosh energy, log-scaled over the spend: a $0.0001 floor ripples (.15), a $1 burn thrashes (1); pinned by unit0-liquid.test.mjs.
export const biteEnergy = costUsd => {
  if (typeof costUsd !== 'number' || !Number.isFinite(costUsd) || costUsd <= 0) return 0;
  const decades = (Math.log10(Math.max(costUsd, BITE_FLOOR_USD)) + 4) / 4;
  return Math.round(Math.max(.15, Math.min(1, .15 + .85 * decades)) * 1000) / 1000;
};

// The visible fill is a volume fraction, not a linear height in a sphere.
export function fuelHeight(level) {
  const f = fuelLevel(level);
  if (f === null) return null;
  if (f === 0 || f === 1) return f * 2 - 1;
  let lo = -1, hi = 1;
  for (let i = 0; i < 24; i++) {
    const y = (lo + hi) / 2, v = (2 + 3 * y - y * y * y) / 4;
    if (v < f) lo = y; else hi = y;
  }
  return (lo + hi) / 2;
}

export function glassShell(source) {
  const material = source.clone();
  material.color = source.color;
  material.emissive = source.emissive;
  material.userData = { ...source.userData };
  material.transparent = true; material.depthWrite = false;
  material.onBeforeCompile = shader => {
    source.onBeforeCompile(shader);
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
      float tankRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.0);
      diffuseColor.a *= mix(0.10 + 0.32 * tankRim, 1.0, lyWire);   // times the material's opacity: a host that fades her (the Board behind a glass) fades the glass too
      #include <opaque_fragment>`);
  };
  material.customProgramCacheKey = () => `${source.customProgramCacheKey()}-tank-glass-1`;
  return material;
}

export function createUnit0Liquid(T, radius) {
  const group = new T.Group(); group.name = 'unit0-fuel'; group.visible = false;
  const r = radius * LIQUID.radius;
  const uniforms = { uTankTime: { value: 0 }, uTankBubblePhase: { value: 0 }, uTankEnergy: { value: 0 }, uTankHeight: { value: 0 } };
  const sideGeo = new T.BufferGeometry(), topGeo = new T.CircleGeometry(1, LIQUID.segments);
  const positions = new Float32Array((LIQUID.rings + 1) * (LIQUID.segments + 1) * 3), indices = [];
  for (let j = 0; j < LIQUID.rings; j++) for (let i = 0; i < LIQUID.segments; i++) {
    const a = j * (LIQUID.segments + 1) + i, b = a + LIQUID.segments + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  sideGeo.setAttribute('position', new T.BufferAttribute(positions, 3)); sideGeo.setIndex(indices);
  const sideMat = new T.MeshStandardMaterial({ color: LIQUID.volume, roughness: .22, metalness: .12, emissive: 0x0f3b31, emissiveIntensity: .35, transparent: true, opacity: .88, depthWrite: false });   // the volume: the kick's teal, deeper, as the ale was darker at the floor
  const topMat = new T.MeshStandardMaterial({ color: LIQUID.surface, roughness: .17, metalness: .25, emissive: 0x1d5c48, emissiveIntensity: .25, side: T.DoubleSide, transparent: true, opacity: .9, depthWrite: false });   // the surface: the kick's mint
  topMat.forceSinglePass = true;
  topMat.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vTankUV;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvTankUV = position.xy;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      varying vec2 vTankUV; uniform float uTankTime; uniform float uTankEnergy;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float wave = sin(vTankUV.x * 11.0 + vTankUV.y * 8.0 - uTankTime * 5.0);
        float ring = pow(max(0.0, sin(length(vTankUV) * 23.0 - uTankTime * 4.0)), 12.0);
        totalEmissiveRadiance += vec3(0.20, 0.50, 0.40) * (ring + wave * 0.12) * uTankEnergy;
        totalEmissiveRadiance += vec3(0.26, 0.62, 0.50) * smoothstep(0.9, 1.0, length(vTankUV));`);
  };
  topMat.customProgramCacheKey = () => 'unit0-liquid-surface-2';
  const side = new T.Mesh(sideGeo, sideMat), top = new T.Mesh(topGeo, topMat);
  side.name = 'fuel-volume'; top.name = 'fuel-surface';
  side.renderOrder = 2; top.renderOrder = 3;
  top.rotation.x = -Math.PI / 2;
  group.add(side, top);
  const bubbleGeo = new T.BufferGeometry(), seeds = new Float32Array(LIQUID.bubbles * 3);
  for (let i = 0; i < LIQUID.bubbles; i++) seeds.set([i * 2.39996, (i + .5) / LIQUID.bubbles, .48 + (i % 3) * .15], i * 3);
  bubbleGeo.setAttribute('position', new T.BufferAttribute(seeds, 3));
  const bubbleMat = new T.ShaderMaterial({ uniforms, transparent: true, depthWrite: false,
    vertexShader: `uniform float uTankBubblePhase; uniform float uTankHeight;
      void main() {
        float t = fract(position.y + uTankBubblePhase);
        float y = mix(-0.98, uTankHeight - 0.035, t);
        float radial = sqrt(max(0.0, 1.0 - y * y)) * position.z;
        vec3 p = vec3(cos(position.x) * radial, y, sin(position.x) * radial) * ${r.toFixed(8)};
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = clamp(34.0 / max(0.1, -mv.z), 3.0, 6.0);
      }`,
    fragmentShader: `void main() {
      float d = length(gl_PointCoord - 0.5) * 2.0;
      if (d > 1.0) discard;
      float rim = smoothstep(0.4, 0.8, d) * (1.0 - smoothstep(0.8, 1.0, d));
      gl_FragColor = vec4(0.86, 1.0, 0.94, rim * 0.9 + (1.0 - d) * 0.3);
    }` });
  const bubbles = new T.Points(bubbleGeo, bubbleMat); bubbles.name = 'fuel-bubbles'; bubbles.frustumCulled = false; bubbles.renderOrder = 4;
  group.add(bubbles);
  let level = null;
  function fill(value) {
    const next = fuelLevel(value); if (next === level) return false;
    level = next; group.visible = next !== null && next > 0;
    if (!group.visible) return true;
    const h = fuelHeight(next); uniforms.uTankHeight.value = h;
    let k = 0;
    for (let j = 0; j <= LIQUID.rings; j++) {
      const y = -1 + (h + 1) * j / LIQUID.rings, width = Math.sqrt(Math.max(0, 1 - y * y));
      for (let i = 0; i <= LIQUID.segments; i++) {
        const angle = i / LIQUID.segments * Math.PI * 2;
        positions[k++] = Math.cos(angle) * width * r;
        positions[k++] = y * r;
        positions[k++] = Math.sin(angle) * width * r;
      }
    }
    sideGeo.attributes.position.needsUpdate = true; sideGeo.computeVertexNormals(); sideGeo.computeBoundingSphere();
    top.position.y = h * r; top.scale.setScalar(Math.sqrt(Math.max(0, 1 - h * h)) * r);
    top.visible = next < 1; bubbles.visible = next > .04;
    return true;
  }
  function frame(seconds = 0, energy = 0) {
    const t = Number.isFinite(seconds) ? seconds : 0, e = fuelLevel(energy) ?? 0;
    // Keep epoch-scale host clocks out of GPU floats. Both phases wrap exactly.
    uniforms.uTankTime.value = t % (Math.PI * 2);
    uniforms.uTankBubblePhase.value = (t * .13) % 1;
    uniforms.uTankEnergy.value = e;
    group.rotation.set(Math.sin(t * 4.6) * .15 * e, 0, Math.sin(t * 5.3 + .8) * .22 * e);
  }
  return { group, fill, frame, state: () => ({ level, energy: uniforms.uTankEnergy.value, draws: group.visible ? 1 + Number(top.visible) + Number(bubbles.visible) : 0,
    vertices: positions.length / 3 + topGeo.attributes.position.count + LIQUID.bubbles }),
    dispose() { for (const value of [sideGeo, topGeo, bubbleGeo, sideMat, topMat, bubbleMat]) value.dispose(); group.removeFromParent(); } };
}
