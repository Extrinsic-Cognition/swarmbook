// line-of-time.mjs: the pure half of line-of-time.html, his tags on the mint's Saint Seiya film (Oct 14 2026 11:4x WEST), so a test holds
// what decides his words' fate: the value written to the Nest, the merge of two copies, the time a tag lands on. No DOM, no clock of its own.

/** The value the Nest holds at mint/seiya-tags: the film's cut (v, the first 8 hex of its sha256), its length, and his tags, five fields each. */
export const shape = (tags, {v, duration}) => ({
  film: 'app/saint-seiya.mp4', v, duration: Math.round(duration * 1000) / 1000,
  tags: tags.map(({id, t, text, made, edited}) => ({id, t, text, made, edited})),
});

/** A second of the film, inside it, to the millisecond: where a tag lands. */
export const at = (t, duration) => Math.round(Math.min(Math.max(Number(t) || 0, 0), duration) * 1000) / 1000;

/** 107.04 → "1:47.04" (rounded to the hundredth first, so 59.999 is "1:00.00", never "0:60.00"). */
export const clock = t => {
  const cs = Math.round(Math.max(0, Number(t) || 0) * 100), m = Math.floor(cs / 6000);
  return `${m}:${((cs - m * 6000) / 100).toFixed(2).padStart(5, '0')}`;
};

/** Two copies of his tags (this page's and the Nest's): each id once, the later edit wins, an id deleted here stays deleted; by time. */
export function merge(mine, theirs, gone = new Set()) {
  const ok = tag => tag && typeof tag.id === 'string' && Number.isFinite(tag.t) && !gone.has(tag.id);
  const by = new Map();
  for (const tag of theirs || []) if (ok(tag)) by.set(tag.id, tag);
  for (const tag of mine || []) {
    if (!ok(tag)) continue;
    const held = by.get(tag.id);
    if (!held || (tag.edited || 0) >= (held.edited || 0)) by.set(tag.id, tag);
  }
  return [...by.values()].sort((a, b) => a.t - b.t || (a.made || 0) - (b.made || 0));
}

/** One frame before or after t, aimed a millisecond into the frame so the picture shown is that frame's, inside the film. */
export const frameStep = (t, dir, fps, duration) => Math.min(Math.max((Math.round(t * fps) + dir) / fps + 0.001, 0), duration);

/** The detail lane's ticks for a window of `span` seconds over `width` px: minor ticks 8 px apart or more, labels 70 px apart or more. */
const STEPS = [0.5, 1, 2, 5, 10, 15, 30, 60];
export const ticks = (span, width) => {
  const pps = width / span;
  return {minor: STEPS.find(s => s * pps >= 8) ?? 60, label: STEPS.find(s => s * pps >= 70) ?? 60};
};

/** The moments a seat wired into the hero on its own reading (warm-sphere.js SEIYA_MOMENTS, f7396871), read from that file's text: [{t, what}].
 *  None once his tags replace them. */
const WHAT = {cosmos: 'gold burn begins', flash: 'burn full', meteors: 'growth begins', impact: 'whole network', credits: 'back to the twelve'};
export function guessesIn(source) {
  const m = /SEIYA_MOMENTS\s*=\s*Object\.freeze\((\{[^}]*\})\)/.exec(source || '');
  if (!m) return [];
  let moments;
  try { moments = JSON.parse(m[1].replace(/([A-Za-z_]\w*)\s*:/g, '"$1":')); } catch { return []; }
  return Object.entries(moments).filter(([, t]) => Number.isFinite(t)).map(([k, t]) => ({t, what: WHAT[k] || k})).sort((a, b) => a.t - b.t);
}
