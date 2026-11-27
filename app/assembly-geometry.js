import {buildGoldberg, goldbergFor} from './orb.js';

const MAX_FREQUENCY = 32;
const MAX_HEXES = 10 * (MAX_FREQUENCY ** 2 - 1);

/**
 * Adapt the established subdivided-icosahedron skin to the assembly renderer.
 * Return {pents, hexes}; every face has {verts, center, normal, id}.
 * Corners lie on the unit sphere and adjacent faces share corner objects.
 * Centers are polygon centroids; original outward normals and chair order stay.
 * The smallest goldberg on the class I and class II families that holds
 * `minHexes`, up to 10,230 hexagons: the sphere is the G(m,n) of its floor.
 * Nonnegative fractional minimums round up; invalid/oversized inputs throw.
 */
export function buildAssemblySkin(minHexes = 320, lattice = null) {   // lattice: [m, n] when a drawing that shares this skin asks for its own goldberg (assembly-dive.mjs: G(m, 0))
  if (typeof minHexes !== 'number' || !Number.isFinite(minHexes) || minHexes < 0 || minHexes > MAX_HEXES) {
    throw new RangeError(`minHexes must be a finite number between 0 and ${MAX_HEXES}`);
  }
  const skin = buildGoldberg(...(lattice || goldbergFor(Math.ceil(minHexes))));
  const corners = new Map();
  const sharedCorner = point => {
    // The source recomputes a triangle's centroid identically for each incident
    // face. Join those exact values without rounding or moving any coordinates.
    const key = point.join(',');
    if (!corners.has(key)) corners.set(key, point);
    return corners.get(key);
  };
  const pents = [], hexes = [];
  for (const source of skin.faces) {
    const verts = source.verts.map(sharedCorner);
    const isPent = source.chair >= 0;
    const face = {
      verts,
      center: [0, 1, 2].map(axis => verts.reduce((sum, point) => sum + point[axis], 0) / verts.length),
      normal: source.normal,
      id: isPent ? `pent:${source.chair}` : `hex:${hexes.length}`,
    };
    (isPent ? pents : hexes).push(face);
  }
  return {pents, hexes};
}
