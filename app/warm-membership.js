import {buildAssemblySkin} from './assembly-geometry.js';

const MAX_CAPACITY = 10230;
const compareId = (a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// Two seeded hashes turn an immutable mint ID into a direction on the sphere.
// Allocation uses that direction, rather than the order returned by a provider.
function hash(id, seed) {
  let h = seed >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  return h >>> 0;
}

function direction(id) {
  const z = 2 * hash(id, 2166136261) / 4294967296 - 1;
  const angle = 2 * Math.PI * hash(id, 0x9e3779b9) / 4294967296;
  const radius = Math.sqrt(Math.max(0, 1 - z * z));
  return [radius * Math.cos(angle), radius * Math.sin(angle), z];
}

function nearestFreeFace(skin, used, normal) {
  let winner = -1, score = -Infinity;
  for (let i = 0; i < skin.hexes.length; i++) {
    if (used.has(i)) continue;
    const candidate = dot(skin.hexes[i].normal, normal);
    if (candidate > score) { score = candidate; winner = i; }
  }
  if (winner < 0) throw new RangeError('Membership exceeds available hexagons');
  used.add(winner);
  return winner;
}

/**
 * A pure layout for confirmed memberships. `id` must be the stable mint identity,
 * not its current owner's key. Capacity is an actual closed Goldberg skin size.
 *
 * Initial reads do not fabricate arrivals. Later new IDs emit `isNew` once; a
 * refresh retains `born` and resets that flag. A renderer may animate using born.
 * `fromFace` is the previous face only when the skin changes; otherwise null.
 * Geometry never interprets these records as economic or chain confirmation.
 */
export function buildMembershipLayout(previous, snapshot, now = 0) {
  if (!snapshot || !Array.isArray(snapshot.seats)) throw new TypeError('seats must be an array');
  const {capacity, seats} = snapshot;
  if (!Number.isInteger(capacity) || capacity < 0 || capacity > MAX_CAPACITY) {
    throw new RangeError(`capacity must be an integer between 0 and ${MAX_CAPACITY}`);
  }
  if (!Number.isFinite(now) || now < 0) throw new RangeError('now must be a nonnegative finite time');
  if (seats.length > capacity) throw new RangeError('Membership exceeds capacity');
  if (previous != null && !(previous.slots instanceof Map)) throw new TypeError('previous must be a membership layout');
  const ids = new Set();
  for (const seat of seats) {
    if (!seat || typeof seat.id !== 'string' || !seat.id.trim()) throw new TypeError('Each seat needs a nonempty stable string id');
    if (ids.has(seat.id)) throw new TypeError(`Duplicate membership id: ${seat.id}`);
    ids.add(seat.id);
  }

  const unchangedSkin = previous != null && previous.capacity === capacity;
  const skin = unchangedSkin ? previous.skin : buildAssemblySkin(capacity);
  if (skin.hexes.length !== capacity) throw new RangeError(`${capacity} is not a closed Goldberg capacity; next is ${skin.hexes.length}`);
  const ordered = [...seats].sort(compareId);
  const slots = new Map(), used = new Set();

  // Existing identities claim their faces before new arrivals. This is also the
  // deterministic tie order for nearest-free assignment during a topology change.
  for (const seat of ordered) {
    const old = previous?.slots.get(seat.id);
    if (!old) continue;
    const faceIndex = unchangedSkin ? old.faceIndex : nearestFreeFace(skin, used, old.face.normal);
    used.add(faceIndex);
    slots.set(seat.id, {
      seat, face: skin.hexes[faceIndex], faceIndex,
      fromFace: unchangedSkin ? null : old.face,
      born: old.born, isNew: false,
    });
  }
  for (const seat of ordered) {
    if (slots.has(seat.id)) continue;
    const faceIndex = nearestFreeFace(skin, used, direction(seat.id));
    slots.set(seat.id, {
      seat, face: skin.hexes[faceIndex], faceIndex, fromFace: null,
      born: now, isNew: previous != null,
    });
  }

  return {
    skin, capacity, count: seats.length, slots,
    // Metadata/owner changes do not masquerade as new mint identities.
    fingerprint: JSON.stringify([capacity, ordered.map(seat => seat.id)]),
  };
}
