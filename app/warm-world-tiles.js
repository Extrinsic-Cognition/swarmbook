// Lossless scene tiles are rendered once offline. The viewport and its lens
// share this bounded cache; neither needs to redraw the world geometry.
const CACHE_BYTES = 64 * 1024 * 1024;
const MAX_IN_FLIGHT = 12;   // 2026-09-11: HTTP/2 to the worker, tiles are 17 KB median; four in flight left the lens waiting on latency
const MAX_ATTEMPTS = 2;
const finite = value => Number.isFinite(value);

function normalizeVariant(manifest, name) {
  if (manifest.version !== 1) throw new Error('Unsupported world tile manifest');
  const value = manifest.variants?.[name];
  if (!value || !finite(value.width) || !finite(value.height) || value.width <= 0 || value.height <= 0)
    throw new Error(`Missing world tile variant: ${name}`);
  const bounds = value.bounds || { x: 0, y: 0, width: value.width, height: value.height };
  if (![bounds.x, bounds.y, bounds.width, bounds.height].every(finite) || bounds.width <= 0 || bounds.height <= 0)
    throw new Error('Invalid world tile bounds');
  const levels = [...(value.levels || [])].sort((a, b) => a.scale - b.scale);
  if (!levels.length) throw new Error('World tiles have no resolution levels');
  levels.forEach((level, index) => {
    if (!finite(level.scale) || level.scale <= 0 ||
        ![level.width, level.height, level.tileSize, level.cols, level.rows].every(Number.isInteger) ||
        Math.min(level.width, level.height, level.tileSize, level.cols, level.rows) <= 0 ||
        level.cols !== Math.ceil(level.width / level.tileSize) ||
        level.rows !== Math.ceil(level.height / level.tileSize) ||
        Math.abs(level.width - bounds.width * level.scale) > 1 ||
        Math.abs(level.height - bounds.height * level.scale) > 1 ||
        !level.path?.includes('{x}') || !level.path.includes('{y}') ||
        (index && levels[index - 1].scale === level.scale))
      throw new Error('Invalid world tile resolution level');
    if (Math.min(level.width, level.tileSize) * Math.min(level.height, level.tileSize) * 4 > CACHE_BYTES)
      throw new Error('A world tile exceeds the decoded cache budget');
  });
  // Keep a complete, inexpensive fallback resident while fine tiles arrive.
  if (levels[0].width * levels[0].height * 4 > CACHE_BYTES / 4)
    throw new Error('World tile fallback is too large');
  return { ...value, bounds, levels };
}

export async function createWorldTiles({ manifestUrl, variant = 'desktop', onUpdate = () => {} }) {
  const baseUrl = new URL(manifestUrl, globalThis.location?.href || 'http://localhost/').href;
  const readJSON = async url => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`World tile request failed (${response.status}): ${url}`);
    return response.json();
  };
  const manifest = await readJSON(baseUrl);
  const config = normalizeVariant(manifest, variant);
  const { levels, bounds } = config;
  const geometryPromise = readJSON(new URL(config.geometry, baseUrl).href);
  // Observe this immediately even if a fallback request fails first.
  geometryPromise.catch(() => {});
  const entries = new Map();
  const jobs = new Map();
  let desired = new Map(), nextDesired = new Map();
  let decodedBytes = 0, reservedBytes = 0, clock = 0;
  let collecting = false, suspended = false, destroyed = false, initializing = true;
  let requests = 0, failures = 0, evictions = 0, peakDecodedBytes = 0;
  let resolveFallback, rejectFallback;
  const fallbackReady = new Promise((resolve, reject) => { resolveFallback = resolve; rejectFallback = reject; });
  let fallbackRemaining = levels[0].cols * levels[0].rows;

  function getEntry(levelIndex, col, row) {
    const key = `${levelIndex}/${col}/${row}`;
    if (entries.has(key)) return entries.get(key);
    const level = levels[levelIndex];
    const width = Math.min(level.tileSize, level.width - col * level.tileSize);
    const height = Math.min(level.tileSize, level.height - row * level.tileSize);
    const entry = {
      key, levelIndex, col, row, width, height, bytes: width * height * 4,
      url: new URL(level.path.replaceAll('{x}', col).replaceAll('{y}', row), baseUrl).href,
      pinned: levelIndex === 0, state: 'idle', attempts: 0, image: null, used: 0, job: null
    };
    entries.set(key, entry);
    return entry;
  }

  function release(entry) {
    if (!entry.image) return;
    entry.image.close();
    entry.image = null;
    decodedBytes -= entry.bytes;
    entry.state = 'idle';
    evictions++;
  }

  function makeRoom(bytes) {
    if (decodedBytes + reservedBytes + bytes <= CACHE_BYTES) return true;
    // Current target tiles are protected. If two simultaneous views exceed
    // the budget, the lower-priority view retains its low-resolution fallback
    // instead of constantly evicting and downloading the other view's tiles.
    const candidates = [...entries.values()]
      .filter(entry => entry.image && !entry.pinned && !desired.has(entry.key))
      .sort((a, b) => a.used - b.used);
    for (const entry of candidates) {
      release(entry);
      if (decodedBytes + reservedBytes + bytes <= CACHE_BYTES) return true;
    }
    return false;
  }

  function announce() {
    if (!destroyed && !suspended && !initializing) {
      try { onUpdate(); } catch (error) { globalThis.console?.error('World tile update failed', error); }
    }
  }

  async function load(entry) {
    const job = { controller: new AbortController(), entry, reserved: true };
    jobs.set(entry.key, job); entry.job = job; entry.state = 'loading';
    entry.attempts++; requests++;
    reservedBytes += entry.bytes;
    let image;
    try {
      const response = await fetch(entry.url, { signal: job.controller.signal });
      if (!response.ok) throw new Error(`Tile HTTP ${response.status}`);
      image = await createImageBitmap(await response.blob());
      if (image.width !== entry.width || image.height !== entry.height)
        throw new Error('World tile dimensions differ from manifest');
      if (destroyed || suspended || job.controller.signal.aborted || entry.job !== job) {
        image.close(); image = null;
        entry.attempts = Math.max(0, entry.attempts - 1);
        entry.state = 'idle';
        return;
      }
      entry.image = image; image = null;
      entry.state = 'loaded'; entry.used = ++clock;
      entry.attempts = 0;
      reservedBytes -= entry.bytes; job.reserved = false;
      decodedBytes += entry.bytes;
      peakDecodedBytes = Math.max(peakDecodedBytes, decodedBytes);
      if (entry.pinned && --fallbackRemaining === 0) resolveFallback();
      announce();
    } catch (error) {
      image?.close();
      if (job.controller.signal.aborted || destroyed || suspended) {
        entry.attempts = Math.max(0, entry.attempts - 1);
        entry.state = 'idle';
      } else {
        failures++;
        entry.state = entry.attempts < MAX_ATTEMPTS ? 'queued' : 'failed';
        if (entry.state === 'failed') {
          entry.error = String(error.message || error);
          if (entry.pinned) rejectFallback(new Error(`World tile fallback could not load: ${entry.error}`));
          announce();
        }
      }
    } finally {
      if (job.reserved) reservedBytes -= entry.bytes;
      jobs.delete(entry.key); entry.job = null;
      if (entry.state === 'idle' && desired.has(entry.key) && !destroyed && !suspended) entry.state = 'queued';
      pump();
    }
  }

  function pump() {
    if (destroyed || suspended || collecting) return;
    const queue = [...desired.entries()]
      .map(([key, priority]) => ({ entry: entries.get(key), priority }))
      .filter(({ entry }) => entry.state === 'queued' || entry.state === 'idle')
      .sort((a, b) => Number(b.entry.pinned) - Number(a.entry.pinned) || b.priority - a.priority);
    for (const { entry } of queue) {
      if (jobs.size >= MAX_IN_FLIGHT) break;
      if (!makeRoom(entry.bytes)) continue;
      void load(entry);
    }
  }

  function suspend() {
    suspended = true; collecting = false;
    desired.clear(); nextDesired.clear();
    for (const job of jobs.values()) job.controller.abort();
    for (const entry of entries.values()) if (entry.state === 'queued') entry.state = 'idle';
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true; suspend();
    for (const entry of entries.values()) release(entry);
  }

  const allFallback = levels[0];
  for (let row = 0; row < allFallback.rows; row++) {
    for (let col = 0; col < allFallback.cols; col++) {
      const entry = getEntry(0, col, row);
      entry.state = 'queued'; desired.set(entry.key, Infinity);
    }
  }
  pump();
  let data;
  try {
    [data] = await Promise.all([geometryPromise, fallbackReady]);
  } catch (error) {
    destroy(); throw error;
  }
  initializing = false; desired.clear();

  function visibleTiles(levelIndex, region) {
    const level = levels[levelIndex];
    const left = Math.max(0, Math.floor((region.x - bounds.x) * level.scale / level.tileSize));
    const top = Math.max(0, Math.floor((region.y - bounds.y) * level.scale / level.tileSize));
    const right = Math.min(level.cols - 1, Math.ceil((region.x + region.width - bounds.x) * level.scale / level.tileSize) - 1);
    const bottom = Math.min(level.rows - 1, Math.ceil((region.y + region.height - bounds.y) * level.scale / level.tileSize) - 1);
    const result = [];
    for (let row = top; row <= bottom; row++)
      for (let col = left; col <= right; col++) result.push(getEntry(levelIndex, col, row));
    return result;
  }

  function beginFrame() {
    if (destroyed) return;
    suspended = false; collecting = true; nextDesired = new Map();
  }

  function paint(ctx, { scale, x = 0, y = 0, rect, pixelRatio = 1, priority = 0 }) {
    if (destroyed || suspended || !finite(scale) || scale <= 0 ||
        !finite(pixelRatio) || pixelRatio <= 0 || ![x, y, rect?.x, rect?.y, rect?.width, rect?.height].every(finite) ||
        rect.width <= 0 || rect.height <= 0) return;
    const startX = Math.max(bounds.x, (rect.x - x) / scale);
    const startY = Math.max(bounds.y, (rect.y - y) / scale);
    const endX = Math.min(bounds.x + bounds.width, (rect.x + rect.width - x) / scale);
    const endY = Math.min(bounds.y + bounds.height, (rect.y + rect.height - y) / scale);
    if (endX <= startX || endY <= startY) return;
    const region = { x: startX, y: startY, width: endX - startX, height: endY - startY };
    const density = scale * pixelRatio;
    let chosen = levels.findIndex(level => level.scale >= density);
    if (chosen < 0) chosen = levels.length - 1;
    let targets = visibleTiles(chosen, region);
    // An unusually large viewport must not request an uncacheable full level.
    const fallbackBytes = allFallback.width * allFallback.height * 4;
    while (chosen > 0 && targets.reduce((bytes, entry) => bytes + entry.bytes, fallbackBytes) > CACHE_BYTES) {
      chosen--; targets = visibleTiles(chosen, region);
    }
    const wants = collecting ? nextDesired : desired;
    for (const entry of targets) {
      wants.set(entry.key, Math.max(wants.get(entry.key) ?? -Infinity, finite(priority) ? priority : 0));
      if (entry.image) entry.used = ++clock;
    }
    ctx.save(); ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.width, rect.height); ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    for (let index = 0; index <= chosen; index++) {
      const level = levels[index];
      for (const entry of visibleTiles(index, region)) {
        if (!entry.image) continue;
        entry.used = ++clock;
        const left = x + (bounds.x + entry.col * level.tileSize / level.scale) * scale;
        const top = y + (bounds.y + entry.row * level.tileSize / level.scale) * scale;
        ctx.drawImage(entry.image, 0, 0, entry.width, entry.height, left, top,
          entry.width * scale / level.scale, entry.height * scale / level.scale);
      }
    }
    ctx.restore();
    if (!collecting) pump();
  }

  function endFrame() {
    if (destroyed || suspended || !collecting) return;
    collecting = false; desired = nextDesired; nextDesired = new Map();
    for (const entry of entries.values()) {
      if (entry.pinned) continue;
      if (!desired.has(entry.key)) {
        if (entry.state === 'queued') entry.state = 'idle';
        if (entry.state === 'loading') entry.job.controller.abort();
      }
    }
    pump();
  }

  function snapshot() {
    return {
      variant, width: config.width, height: config.height, bounds: { ...bounds },
      maxDecodedBytes: CACHE_BYTES, decodedBytes, reservedBytes, peakDecodedBytes,
      inFlight: jobs.size, queued: [...desired.keys()].filter(key => ['queued', 'idle'].includes(entries.get(key)?.state)).length,
      loaded: [...entries.values()].filter(entry => entry.image).map(entry => entry.key),
      desired: [...desired.keys()], failed: [...entries.values()].filter(entry => entry.state === 'failed').map(entry => entry.key),
      requests, failures, evictions, suspended, destroyed,
      levels: levels.map(level => level.scale)
    };
  }

  return { data, beginFrame, paint, endFrame, suspend, destroy, snapshot };
}
