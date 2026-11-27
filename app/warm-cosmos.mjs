// The same twelve faces cross from a closed vessel into an ignited, open shell.
// All movement is sampled from film time; pause, seek and replay need no simulation history.
const smooth = (a, b, t) => { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
import {colonyAt, COLONY_START} from '../lab/the-colony.mjs?v=the-cut-1';
const REST = Object.freeze({compression: 0, opening: 0, heat: 0, release: 0, burst: 0});

export function cosmosBodyAt(t) {
  // under the end card the vessel closes (145.598 to 148.098 s: 147.5 to 150 before THE CUT, dl-twelve.js)
  if (!Number.isFinite(t) || t <= 100.25 || t >= 148.098) return REST;
  const close = 1 - smooth(145.598, 148.098, t);
  // THE COLONY's burst on his call (lab/the-colony.mjs, his Oct 21 2026 "you have the old slow growing ... not now. make it explode"): the vessel
  // stays clenched and burning from the quote to the call, no slow opening before it; it bursts open there, the strike's pulse with it, and
  // settles into the open, warm shell of the aftermath as the film folds home
  const compression = smooth(100.25, 101.6, t) * (1 - smooth(COLONY_START - 0.1, COLONY_START, t));
  const opening = smooth(COLONY_START, COLONY_START + 0.5, t) * (1 - .28 * smooth(109, 114, t)) * close;
  const heat = smooth(100.25, 102.1, t) * (1 - .7 * smooth(110, 116, t)) * close;
  const release = smooth(COLONY_START, COLONY_START + 1.3, t) * (1 - smooth(COLONY_START + 1.7, COLONY_START + 5.5, t));
  // THE COLONY (lab/the-colony.mjs): the dodecahedron explodes at the meteors' cut, its panels flung out across the screen (warm-sphere.js
  // drawSkin) as the film spreads from it, and comes home as the film folds back
  const burst = colonyAt(t)?.burst ?? 0;
  return {compression, opening, heat, release, burst};
}

/** The cosmos's two scales on a panel: its centre moved out by `centre`, the panel itself drawn at `panel` of its size (cosmosPanels). */
export function cosmosScales(state) {
  return {centre: 1 - .09 * state.compression + .42 * state.opening + .12 * state.release, panel: 1 - .09 * state.compression - .14 * state.opening};
}

// Keep the original packed geometry immutable and the face identities/normals intact.
// The existing JS/WASM projector receives the same input layout and maps film onto the moved panels.
export function cosmosPanels(packed, count, stride, state, out) {
  if (!out || out.length !== packed.length) out = new Float64Array(packed.length);
  out.set(packed);
  const {centre: centreScale, panel: panelScale} = cosmosScales(state);
  for (let f = 0; f < count; f++) {
    const o = f * stride, vertices = packed[o];
    for (let axis = 0; axis < 3; axis++) {
      const centre = packed[o + 4 + axis], moved = centre * centreScale;
      out[o + 4 + axis] = moved;
      for (let v = 0; v < vertices; v++) {
        const at = o + 7 + v * 3 + axis;
        out[at] = moved + (packed[at] - centre) * panelScale;
      }
    }
  }
  return out;
}

// THE FIELD's reach (lab/rite-unit1s.js fieldAt): how far from the centre a skin's panels stand while the cosmos moves them, as a share of the
// sphere's radius: 1 at rest (the vertices on the unit sphere), about 1.24 for the dodecahedron fully open, 1.33 at the strike's pulse. A
// moved vertex stands at centre x c + offset x p (cosmosPanels), so its distance squared is c^2 |centre|^2 + 2cp (centre . offset) +
// p^2 |offset|^2: the three dot products are made once a skin, a vertex each, and each frame asks only the two scales.
const vertexTerms = new WeakMap();
export function cosmosReach(skin, state) {
  let terms = vertexTerms.get(skin);
  if (!terms) {
    const out = [];
    for (const f of [...skin.pents, ...skin.hexes]) {
      const [cx, cy, cz] = f.center;
      for (const [x, y, z] of f.verts) { const ox = x - cx, oy = y - cy, oz = z - cz; out.push(cx * cx + cy * cy + cz * cz, cx * ox + cy * oy + cz * oz, ox * ox + oy * oy + oz * oz); }
    }
    terms = Float64Array.from(out);
    vertexTerms.set(skin, terms);
  }
  const {centre: c, panel: p} = state && state.heat > 0 ? cosmosScales(state) : {centre: 1, panel: 1};   // the panels move only while it burns
  let far = 0;
  for (let i = 0; i < terms.length; i += 3) far = Math.max(far, c * c * terms[i] + 2 * c * p * terms[i + 1] + p * p * terms[i + 2]);
  return Math.sqrt(far);
}
