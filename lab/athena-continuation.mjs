// Transport the recovered fit through the SAME picture projection as the film.
// The original fit was measured against an affine face decal, at its recorded
// camera. Rotating that fit with the unfolding face changes its silhouette.
// Instead retain that camera, recover picture coordinates, then carry the rays
// through the current window. Depth along each ray survives. No second renderer.
import {FIT, classOf, matrixOf, decalOf, project, squareAt, CUBIST_PLANE_GLSL, ONE, PORTAL, shotOf} from './cubism.mjs';
import {HAIR} from './fields-film.mjs';
export const HEAD_MARK = Object.freeze([...HAIR.head]);

export function registeredFit(faces, root, record = null) {
  if (record) {
    const shot = record.camera.find(s => s.name === "over Athena's shoulder, down at the fight").measured;
    const feet = record.entities.athena.tracks[0].measured.shots.find(s => s.shot === 'A').mu;
    const norm = v => { const n = Math.hypot(...v); return v.map(x => x / n); };
    const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const back = norm(shot.eye.map((x,i) => x-shot.look[i]));
    const right = norm(cross(shot.up,back)), up = cross(back,right);
    const f = 1 / Math.tan(shot.fov * Math.PI / 360), rows = [right,up,back];
    const matrix = rows.flatMap((r,i) => {
      const k = i < 2 ? f/4 : 1;
      return [-r[0]*k,r[1]*k,-r[2]*k,r.reduce((s,x,j)=>s+x*(feet[j]-shot.eye[j]),0)*k+(i===2?4:0)];
    }).concat([0,0,0,1]);
    // The recovered GLB's head BONE is at 1.392 m (the neck). The film mark
    // is the cranium, at 1.52 m in this rig; joining those different landmarks
    // was the remaining duplicated cap above the source picture.
    const head = [0,1.52,.02], p = [0,1,2].map(i => matrix[i*4]*head[0]+matrix[i*4+1]*head[1]+matrix[i*4+2]*head[2]+matrix[i*4+3]);
    const anchor = project(p,[0,0],1), scale = 1;
    const offset = HAIR.head.map((x,i) => x-scale*anchor[i]);
    // Only the translation is registered: the measured camera retains its lens,
    // elevation and the body's depth. The head anchor is measured in the film.
    return {matrix, uvX:[scale,0,offset[0]],uvY:[0,scale,offset[1]],
      decal:[1/scale,0,0,1/scale,-offset[0]/scale,-offset[1]/scale]};
  }
  const fit = FIT.classes[classOf(faces[root])];
  const face = faces.find(f => f.id === fit.face);
  const spin = {yaw: fit.yawDeg * Math.PI / 180, pitch: FIT.pitch};
  const decal = decalOf(face, spin, [0, 0], 1);
  const [a, b, c, d, x, y] = decal, det = a * d - b * c;
  return {
    matrix: matrixOf(fit.local, face, spin),
    uvX: [d / det, -c / det, (c * y - d * x) / det],
    uvY: [-b / det, a / det, (b * x - a * y) / det],
    decal,
  };
}

export function continuationAt(t) {
  const ease = (a,b) => { const k = Math.max(0,Math.min(1,(t-a)/(b-a))); return k*k*(3-2*k); };
  const shot = shotOf(t);
  return shot === 0 ? ease(ONE.melt,ONE.gone) : shot === 2 ? 1-ease(PORTAL.aiolos,PORTAL.closed) : 0;
}

// Reference implementation for projection tests, independent of THREE/WebGL.
export function carryPoint(point, fit, plane, {join = [0, 0], zoom = 1} = {}) {
  const uv = squareAt(...project(point, [0, 0], 1), fit.decal);
  const q = uv.map((v, i) => join[i] + (v - join[i]) * zoom);
  const p = plane.C.map((v, i) => v + plane.rho * (plane.across[i] * q[0] - plane.up[i] * q[1]));
  const depth = (4 - point[2]) / 4;
  return p.map((v, i) => (i === 2 ? 4 : 0) + (v - (i === 2 ? 4 : 0)) * depth);
}

const VERTEX = `
${CUBIST_PLANE_GLSL}
uniform vec3 uFitX, uFitY;
uniform float uContinuation;
varying vec3 vContinuationWorld;
vec3 continueAthena(vec3 p) {
  vec2 screen = vec2(p.x, -p.y) * 4.0 / (4.0 - p.z);
  vec2 uv = vec2(dot(uFitX, vec3(screen, 1.0)), dot(uFitY, vec3(screen, 1.0)));
  uv = uHerJoin + (uv - uHerJoin) * uHerZoom;
  vec3 plane = uHerC + uHerRho * (uHerAcross * uv.x - uHerUp * uv.y);
  return mix(p, vec3(0.0, 0.0, 4.0) + (plane - vec3(0.0, 0.0, 4.0)) * ((4.0 - p.z) / 4.0), uContinuation);
}
`;
const FRAGMENT = `
${CUBIST_PLANE_GLSL}
uniform float uContinuation;
uniform float uContinuationReveal;
uniform vec2 uContinuationSize;
varying vec3 vContinuationWorld;
float continuationAlpha() {
  vec2 edge = min(gl_FragCoord.xy, uContinuationSize-gl_FragCoord.xy);
  return uContinuation < 0.5 ? 1.0 : uContinuationReveal * smoothstep(0.0, 36.0, min(edge.x,edge.y));
}
void cutContinuation() {
  if (uContinuation < 0.5) return;
  vec2 uv = herPictureUV(vContinuationWorld);
  float d = length(herPlaneUV0(vContinuationWorld) - uHerJoin);
  // Inside the growing window the original drawing owns the pixels. Outside it
  // the native mesh continues. The closing light removes BOTH on the same front.
  if (uHerWall >= 0.0 && d < uHerWall) discard;
  if (herInPicture(uv) > 0.5) discard;
}
`;

export function patchContinuation(shader, uniforms, {hair = false} = {}) {
  Object.assign(shader.uniforms, uniforms);
  shader.vertexShader = shader.vertexShader.replace('void main() {', VERTEX + '\nvoid main() {');
  const projectChunk = hair ? 'gl_Position = rippleBendClip(projectionMatrix * mvPosition);' : '#include <project_vertex>';
  const start = hair ? '' : '#include <project_vertex>\n';
  shader.vertexShader = shader.vertexShader.replace(projectChunk, start + `
    vec3 continuedWorld = continueAthena((cameraMatrixWorld * mvPosition).xyz);
    vContinuationWorld = continuedWorld;
    mvPosition = viewMatrix * vec4(continuedWorld, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  `);
  // cameraMatrixWorld is supplied explicitly: it is not a THREE shader builtin.
  shader.vertexShader = 'uniform mat4 cameraMatrixWorld;\n' + shader.vertexShader;
  shader.fragmentShader = shader.fragmentShader.replace('void main() {', FRAGMENT + '\nvoid main() {\n  cutContinuation();');
  if (hair) shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4(c, uOpacity);', 'gl_FragColor = vec4(c, uOpacity * continuationAlpha());');
  else shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', '#include <opaque_fragment>\n gl_FragColor.a *= continuationAlpha();');
}
