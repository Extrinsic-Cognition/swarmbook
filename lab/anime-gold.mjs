// anime-gold.mjs: THE ANIME'S GOLD, one material for the golden Sagittarius Cloth wherever the hero draws it (the freeze's reveal,
// mint-freeze-scene.mjs through golden-sagittarius.mjs; the box, unboxing.js). His words, Oct 16 2026, over the Cloth drawn as polished
// metal with a reflection map: "that awful cheap indian plasticky golden statue". The anime (saint-seiya.mp4, 50 to 70 s) paints the Cloth
// as cels: three tones of gold cut hard by the light (an umber shadow, the gold, a pale gold where the light falls), a white-gold glint in a
// hard band, a warm rim toward the light, ink at the silhouette, and the detail of the piece in paint, not in reflections. So this is a cel
// shader: the asset's own painted albedo (the TRELLIS study's texture) supplies the detail as a grey modulation, the tones are the anime's,
// the light is one direction in view space (the page's drawSkin light, or the beam's), nothing is reflected.
//
// THE COST (foundation 1; ANNEALED.md): no environment map, no PMREM (the old material built a 256 x 128 float reflection and filtered it at
// load, about 22 ms on NewMac), no specular IBL, no second pass: one fragment of two texture-free dot products and one texture read (the
// albedo), cheaper than the standard PBR fragment it replaces. One draw for the whole Cloth (its 39,932 triangles) as before; the outline is
// from the normal (no inverted hull, so no second draw of the mesh).
//
// It keeps three's chunk markers (`#include <common>`, `<project_vertex>`, `<clipping_planes_fragment>`) so unboxing.js's floor clip
// (floorClip's onBeforeCompile replacements) and three's clipping planes apply to it as to any material.
import * as THREE from 'three';

export const ANIME_GOLD = Object.freeze({
  shadow: [0.55, 0.31, 0.06],   // the umber the anime paints into the folds
  mid: [0.95, 0.70, 0.15],      // the gold
  lit: [1.0, 0.90, 0.44],       // where the light falls
  glint: [1.0, 0.985, 0.86],    // the white-gold band
  ink: [0.26, 0.13, 0.02],      // the line at the silhouette
  light: [-0.32, 0.7, 0.64],    // view space (x right, y up, z toward the eye): unboxing.js's LIGHT, the page's drawSkin light
});

const VERTEX = `
#include <common>
#include <clipping_planes_pars_vertex>
varying vec3 vN; varying vec3 vV; varying vec2 vUv2;
void main() {
  vUv2 = uv;
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <begin_vertex>
  #include <project_vertex>
  #include <clipping_planes_vertex>
  vN = normalize(transformedNormal);
  vV = -mvPosition.xyz;
}`;

const FRAGMENT = `
#include <common>
#include <clipping_planes_pars_fragment>
uniform sampler2D map; uniform float uHasMap, uOpacity, uGlow;
uniform vec3 uLight, uShadow, uMid, uLit, uGlint, uInk;
varying vec3 vN; varying vec3 vV; varying vec2 vUv2;
void main() {
  #include <clipping_planes_fragment>
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 V = normalize(vV), L = normalize(uLight), H = normalize(L + V);
  float ndl = dot(n, L), ndv = max(dot(n, V), 0.0);
  // the painted detail of the piece: its albedo's luminance about the texture's own mean, never its hue (the tones are the anime's)
  float paint = 1.0;
  if (uHasMap > 0.5) { vec3 a = texture2D(map, vUv2).rgb; float lum = dot(a, vec3(0.299, 0.587, 0.114)); paint = clamp(0.94 + 0.9 * (lum - 0.6), 0.72, 1.22); }
  // the cels: the shadow, the gold, the lit gold, cut hard (a little softness for the pixel's edge); the lit gold takes most of what faces the light
  float s1 = smoothstep(-0.16, -0.05, ndl), s2 = smoothstep(0.28, 0.37, ndl);
  vec3 color = mix(mix(uShadow, uMid, s1), uLit, s2) * paint;
  // the glint: one hard band where the light's reflection meets the eye
  float band = smoothstep(0.82, 0.87, dot(n, H)) * (0.55 + 0.45 * s2);
  color = mix(color, uGlint, band * 0.9);
  // the rim: the light wraps the edge turned to it
  float rim = pow(1.0 - ndv, 3.0) * smoothstep(-0.25, 0.35, ndl);
  color = mix(color, uGlint, rim * 0.5);
  // the ink: the line at the silhouette, from the normal
  color = mix(color, uInk, smoothstep(0.30, 0.14, ndv) * 0.85);
  // the light from the armor itself: a warm fill the owner raises while it emerges
  color = mix(color, uGlint, uGlow);
  gl_FragColor = vec4(color, uOpacity);
}`;

/**
 * The material: {map (the asset's albedo texture or null), light ([x, y, z] in view space), transparent}. uniforms.uOpacity and uGlow are the
 * owner's to move (the freeze raises both as the Cloth emerges from the light); nothing here moves by itself.
 */
export function animeGoldMaterial({map = null, light = ANIME_GOLD.light, transparent = false, side = THREE.DoubleSide} = {}) {
  const material = new THREE.ShaderMaterial({
    name: 'anime gold',
    uniforms: {
      map: {value: map}, uHasMap: {value: map ? 1 : 0}, uOpacity: {value: 1}, uGlow: {value: 0},
      uLight: {value: new THREE.Vector3(...light).normalize()},
      uShadow: {value: new THREE.Color(...ANIME_GOLD.shadow)}, uMid: {value: new THREE.Color(...ANIME_GOLD.mid)}, uLit: {value: new THREE.Color(...ANIME_GOLD.lit)},
      uGlint: {value: new THREE.Color(...ANIME_GOLD.glint)}, uInk: {value: new THREE.Color(...ANIME_GOLD.ink)},
    },
    vertexShader: VERTEX, fragmentShader: FRAGMENT, side, transparent, clipping: true,
  });
  material.userData.shading = 'anime-gold';
  return material;
}

/** Every mesh of `root` dressed in anime gold (its own albedo kept as the paint); the materials it replaces are disposed. Returns the materials. */
export function dressInAnimeGold(root, options = {}) {
  const made = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    const old = [o.material].flat().filter(Boolean);
    const map = old.find((m) => m?.map)?.map ?? null;
    const material = animeGoldMaterial({...options, map});
    o.material = material; made.push(material);
    for (const m of old) if (m !== material) m.dispose();
  });
  return made;
}
