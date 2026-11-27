import { poemPages } from './poetry.js?v=speaker-burst-1';
import { POEMS } from './poems.js?v=speaker-burst-1';

export const POETRY_HOUR_MS = 3_600_000;
export const POETRY_COLUMNS = 26;
export const POETRY_ROWS = 4;
export const POETRY_WORDS_PER_MINUTE = 240;
export const POETRY_MIN_PAGE_MS = 3_000;
export const POETRY_PAGE_BREATH_MS = 500;

/** Prepare immutable pages once. A longer collection expands to whole UTC hours. */
export function buildPoetrySchedule(poems = [], { channel = '' } = {}) {
  if (!Array.isArray(poems)) throw new TypeError('Poems must be an array');
  const ids = new Set();
  let baseDuration = 0, pageCount = 0;
  const entries = poems.map(source => {
    if (!source || typeof source.id !== 'string' || !source.id || typeof source.body !== 'string') {
      throw new TypeError('Each poem needs a stable string id and body');
    }
    if (ids.has(source.id)) throw new Error('Poem ids must be unique');
    ids.add(source.id);
    const poem = Object.freeze({ id: source.id, title: source.title ?? source.id, body: source.body });
    let poemDuration = 0;
    const pages = poemPages(poem, POETRY_COLUMNS, POETRY_ROWS).map(sourceLines => {
      const lines = Object.freeze([...sourceLines]);
      const text = lines.join(' ').trim(), words = text ? text.split(/\s+/u).length : 0;
      const duration = Math.max(POETRY_MIN_PAGE_MS, words * 60_000 / POETRY_WORDS_PER_MINUTE + POETRY_PAGE_BREATH_MS);
      poemDuration += duration;
      return Object.freeze({ lines, words, baseDuration: duration });
    });
    baseDuration += poemDuration; pageCount += pages.length;
    return Object.freeze({ poem, pages: Object.freeze(pages), baseDuration: poemDuration });
  });
  const cycleDuration = Math.max(1, Math.ceil(baseDuration / POETRY_HOUR_MS)) * POETRY_HOUR_MS;
  if (!Number.isSafeInteger(baseDuration) || !Number.isSafeInteger(cycleDuration)) {
    throw new RangeError('Poetry schedule exceeds the supported clock range');
  }
  return Object.freeze({
    entries: Object.freeze(entries), poemCount: entries.length, pageCount,
    baseDuration, cycleDuration, scale: baseDuration ? cycleDuration / baseDuration : 1,
    channel: String(channel),
  });
}

// Cache only derived slot boundaries, never playback progress. Independent
// builds, tabs, and reloads produce the same order from the same UTC cycle.
const cycleCache = new WeakMap();
function hash(text) {
  let value = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 0x01000193);
  value = Math.imul(value ^ (value >>> 16), 0x85ebca6b);
  value = Math.imul(value ^ (value >>> 13), 0xc2b2ae35);
  return (value ^ (value >>> 16)) >>> 0;
}
function slotsFor(schedule, cycleStart) {
  const cached = cycleCache.get(schedule);
  if (cached?.cycleStart === cycleStart) return cached.slots;
  const order = schedule.entries.map(entry => ({ entry, rank: hash(JSON.stringify([schedule.channel, cycleStart, entry.poem.id])) }));
  order.sort((a, b) => a.rank - b.rank || (a.entry.poem.id < b.entry.poem.id ? -1 : a.entry.poem.id > b.entry.poem.id ? 1 : 0));
  const slots = [];
  let cumulative = 0, offset = 0;
  for (let poemOrdinal = 0; poemOrdinal < order.length; poemOrdinal++) {
    const { poem, pages } = order[poemOrdinal].entry;
    for (let page = 0; page < pages.length; page++) {
      cumulative += pages[page].baseDuration;
      // Rounding cumulative boundaries distributes breathing time uniformly
      // (within one millisecond) and leaves no gap at the end of the cycle.
      const end = slots.length + 1 === schedule.pageCount ? schedule.cycleDuration : Math.round(cumulative * schedule.scale);
      slots.push(Object.freeze({ poem, page, pageCount: pages.length, lines: pages[page].lines,
        start: offset, end, ordinal: slots.length, poemOrdinal }));
      offset = end;
    }
  }
  cycleCache.set(schedule, { cycleStart, slots });
  return slots;
}

export const POETRY_SCHEDULE = buildPoetrySchedule(POEMS);

/** Read a half-open page interval from a UTC epoch timestamp. Indices are zero-based. */
export function poetryAt(timestampMs, schedule = POETRY_SCHEDULE) {
  if (typeof timestampMs !== 'number' || !Number.isFinite(timestampMs) || !schedule?.pageCount) return null;
  const cycleDuration = schedule.cycleDuration;
  const cycleStart = Math.floor(timestampMs / cycleDuration) * cycleDuration;
  if (!Number.isSafeInteger(cycleStart) || !Number.isSafeInteger(cycleStart + cycleDuration)) return null;
  const elapsed = timestampMs - cycleStart, slots = slotsFor(schedule, cycleStart);
  let low = 0, high = slots.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (elapsed < slots[middle].end) high = middle;
    else low = middle + 1;
  }
  const slot = slots[low];
  if (!slot) return null;
  const startedAt = cycleStart + slot.start, endsAt = cycleStart + slot.end;
  return {
    poem: slot.poem, page: slot.page, pageCount: slot.pageCount, lines: slot.lines,
    slotKey: JSON.stringify([schedule.channel, cycleStart, slot.poem.id, slot.page]),
    startedAt, endsAt, age: timestampMs - startedAt, duration: slot.end - slot.start,
    ordinal: slot.ordinal, poemOrdinal: slot.poemOrdinal, cycleStart, cycleDuration,
  };
}
