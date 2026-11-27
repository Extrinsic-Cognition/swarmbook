import './her-face.js';

const FACE = globalThis.HER_FACE;
export const PAINT_REF = FACE.PAINT_REF, LIGHT_REF = FACE.LIGHT_REF;

// A read-side projection of the existing Nest refs. No persistence, clock or
// transport lives here: every renderer applies the same interpretation of them.
export function createAppearanceState() {
  const refs = { paint: null, light: null };
  let current = null;
  function snapshot() {
    if (current) return current;
    const paint = refs.paint?.value, light = refs.light?.value;
    const parts = FACE.paintOf(paint);
    const sameBirth = !(paint?.birth && light?.birth && paint.birth !== light.birth);
    current = Object.freeze({
      parts: Object.freeze(Object.fromEntries(FACE.PAINT_PARTS.map(part => [part, parts?.[part] ?? FACE.BORN_PAINT[part]]))),
      light: (sameBirth ? FACE.lightOf(light) : null) ?? FACE.LIGHT_BORN,
      gaze: FACE.formOf(paint),
      saved: Object.freeze({ paint: Boolean(parts), light: Boolean(sameBirth && FACE.lightOf(light)) }),
      revisions: Object.freeze({ paint: refs.paint?.rev ?? 0, light: refs.light?.rev ?? 0 }),
      seq: Math.max(refs.paint?.seq ?? 0, refs.light?.seq ?? 0),
    });
    return current;
  }
  function take(name, ref) {
    const key = name === PAINT_REF ? 'paint' : name === LIGHT_REF ? 'light' : null;
    if (!key || !ref || !Number.isSafeInteger(ref.rev) || ref.rev < 1 || ref.rev <= (refs[key]?.rev ?? 0)) return false;
    const value = ref.value;
    if (value !== null && (!value || value.schema !== (key === 'paint' ? FACE.PAINT_SCHEMA : FACE.LIGHT_SCHEMA) ||
      (value.golem != null && value.golem !== 'lyssajudron'))) return false;
    // Retain only fields which determine the visible body. A later caller must
    // not mutate a received entry and silently change an already sampled view.
    refs[key] = { rev: ref.rev, seq: Number.isSafeInteger(ref.seq) && ref.seq > 0 ? ref.seq : 0,
      value: value === null ? null : key === 'paint'
        ? { schema: value.schema, parts: FACE.paintOf(value), opened: FACE.formOf(value) !== null, gaze: FACE.formOf(value), birth: value.birth }
        : { schema: value.schema, color: FACE.lightOf(value), birth: value.birth } };
    current = null;
    return true;
  }
  return { take, snapshot, apply(body) {
    const value = snapshot();
    body.paint(value.parts); body.form(value.gaze); body.light?.(value.light);
    return value;
  } };
}
