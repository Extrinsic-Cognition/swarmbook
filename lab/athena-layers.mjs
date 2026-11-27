// One decoded picture, three disjoint source mattes. No additional video clock.
export const LAYERS = Object.freeze(['terrain', 'fighters', 'athena-hair']);
export function matteFrame(t) {
  const f = Math.floor(t * 30000 / 1001 + 0.001);
  if (f >= 886 && f < 1006) return f - 886;
  if (f >= 1096 && f < 1127) return f - 1096 + 120;
  if (f >= 1006 && f < 1096) return -2;
  return -1;
}
export const MATTE_GLSL = `
uniform sampler2D uMattes;
uniform float uMatteFrame, uMattesReady;
vec3 shotMattes(vec2 tex) {
  if (uMatteFrame < -1.5) return vec3(1.0, 0.0, 0.0);
  if (uMattesReady < 0.5 || uMatteFrame < 0.0) return vec3(0.0, 0.0, 1.0);
  vec2 cell = vec2(mod(uMatteFrame,16.0),floor(uMatteFrame/16.0));
  vec2 pixel = clamp(tex,vec2(0.0),vec2(1.0)) * vec2(319.0,179.0) + 0.5;
  vec3 m = texture2D(uMattes, (cell*vec2(320.0,180.0)+pixel)/vec2(5120.0,1800.0)).rgb;
  return m / max(dot(m,vec3(1.0)),0.0001);
}
float layerWeight(vec3 m, float layer) {
  return layer < 0.5 ? m.b : layer < 1.5 ? m.g : m.r;
}
`;
