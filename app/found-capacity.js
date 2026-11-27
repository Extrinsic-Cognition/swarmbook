import { LADDER, hexagonsOf, rungFor } from './orb.js';

export const CAPACITIES = LADDER.map(pair => hexagonsOf(...pair));
export function capacityFromDrag(seats, distance, step = 44) {
  const rung = Math.max(0, Math.min(CAPACITIES.length - 1, rungFor(seats) + Math.round(distance / step)));
  return CAPACITIES[rung];
}

// A press starts a reversible edit. Releasing keeps it; cancellation restores
// both the old capacity and topology, including when the pointer leaves the tab.
export function beginCapacityEdit(tree, parentId, chair, now, nextId, maxDepth = 5) {
  const parent = tree.units[parentId];
  if (!parent || parent.dying) return null;
  let id = parent.children[chair], created = false;
  if (id === undefined) {
    if (parent.level >= maxDepth || Object.keys(parent.children).length >= 12 - parent.founders || Object.keys(tree.units).length >= 12) return null;
    id = nextId(); created = true;
    tree.units[id] = { id, name: `chamber ${id}`, parent: parentId, chair, level: parent.level + 1, seats: 0, founders: 7, children: {}, born: now, dying: 0 };
    parent.children[chair] = id;
  }
  if (tree.units[id].dying) return null;
  return { id, parentId, chair, created, seats: tree.units[id].seats };
}
export function cancelCapacityEdit(tree, edit) {
  if (edit.created) { delete tree.units[edit.parentId].children[edit.chair]; delete tree.units[edit.id]; }
  else tree.units[edit.id].seats = edit.seats;
}

// The program seats founder keys first. The preview's attachment points map
// to the remaining on-chain chair slots; capacities are the actual ladder.
export function foundingPlan(tree) {
  const units = Object.values(tree.units).filter(u => !u.dying).sort((a, b) => a.level - b.level || a.id - b.id);
  if (units.length > 12) throw new Error('A founding can contain up to twelve chambers.');
  const encoder = new TextEncoder();
  const plans = units.map(u => {
    if (!u.name.trim()) throw new Error('Give every chamber a name.');
    if (encoder.encode(u.name).length > 64) throw new Error('Chamber names must fit in 64 UTF-8 bytes.');
    if (!Number.isInteger(u.founders) || u.founders < 7 || u.founders + Object.keys(u.children).length > 12) throw new Error(`${u.name}: founders and satellites must fit the twelve chairs.`);
    if (!Number.isInteger(u.seats) || u.seats < 0 || u.seats > 150) throw new Error('Floor capacity must be between 0 and 150.');
    const root = u.id === tree.root;
    const rung = Math.max(root ? 1 : 0, rungFor(u.seats));
    const parent = root ? null : tree.units[u.parent];
    const siblings = parent ? Object.keys(parent.children).map(Number).sort((a, b) => a - b) : [];
    return { ...u, children: { ...u.children }, rung, capacity: CAPACITIES[rung], chainChair: root ? null : parent.founders + siblings.indexOf(u.chair) };
  });
  return { units: plans, root: plans.find(u => u.id === tree.root), expansions: plans.filter(u => u.id !== tree.root).flatMap(u => Array.from({ length: u.rung }, (_, i) => ({ id: u.id, rung: i + 1, capacity: CAPACITIES[i + 1] }))) };
}
// The chain keeps a swarm's name in 64 UTF-8 bytes and its description in 128: cut by bytes, never inside a character.
export const NAME_BYTES = 64, DESC_BYTES = 128;
export function fitBytes(s, max) { const enc = new TextEncoder(); let out = '', n = 0; for (const ch of String(s ?? '')) { if ((n += enc.encode(ch).length) > max) break; out += ch; } return out; }
// The wall's wish card hands the founding page its sentence, name and room in the fragment, which no server reads.
export const wishHash = ({ wish, name, room }) => '#' + new URLSearchParams({ wish: fitBytes(wish, DESC_BYTES), name: fitBytes(name, NAME_BYTES), room: String(room | 0) });
export function readWish(hash) { const q = new URLSearchParams(String(hash).replace(/^#/, '')), wish = fitBytes(q.get('wish')?.trim(), DESC_BYTES); return wish ? { wish, name: fitBytes(q.get('name'), NAME_BYTES), room: CAPACITIES[Math.max(0, Math.min(CAPACITIES.length - 1, Number(q.get('room')) | 0))] } : null; }
