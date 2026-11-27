// A frozen movie needs only its exported electric rails, never the simulation
// or Goldberg meshes. All coordinates below remain in the movie's source space.
const TAU = Math.PI * 2;
const AGE_LIMIT = 6.3;
const ORIGIN = 29.5;
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { value = clamp(value); return value * value * (3 - 2 * value); };
const span = (value, start, end) => smooth((value - start) / (end - start));

/**
 * data: the variant's galaxy-*-electric.json, fetched by the player.
 * video: the existing movie, whose contain/center layout the overlay follows.
 * update({active, visible, reduced, hidden}) pauses without advancing offscreen;
 * active:false clears and resets the effect for replay or seeking.
 */
export function createGalaxyAfterglow(stage, {data, video}) {
  if (data?.version !== 1 || !(data.width > 0 && data.height > 0) || !video) {
    throw new TypeError('Galaxy afterglow requires final geometry and its video.');
  }
  const doc = stage.ownerDocument, view = doc.defaultView;
  const canvas = doc.createElement('canvas');
  canvas.className = 'galaxy-afterglow';
  canvas.dataset.elapsed = '0.00'; canvas.dataset.frames = '0';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;pointer-events:none;z-index:1;display:none;';
  // Immediately after the movie, below the existing HTML heading and controls.
  if (video.parentElement === stage) video.after(canvas);
  else stage.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return {update() {}, destroy() {}}; }

  const seeds = new Map(data.seeds.map(seed => [Math.round((seed.start - ORIGIN) / data.period), seed.radius]));
  const routes = data.routes.map(route => {
    const path = new view.Path2D();
    path.moveTo(...route.a); path.bezierCurveTo(...route.b, ...route.c, ...route.d);
    return {...route, path, logDistance: Math.log(Math.max(1, route.distance))};
  });
  const human = data.humanBloom;
  const humanOutline = human?.outline?.map(p => p.slice());
  if (humanOutline?.length === 7 && humanOutline[0].every((v, i) => v === humanOutline[6][i])) humanOutline.pop();
  const validOutlineCount=human?.kind==='world'?humanOutline?.length>=6:humanOutline?.length===6;
  const humanBloom = validOutlineCount && humanOutline.every(p => p.length === 2 && p.every(Number.isFinite)) &&
    human.center?.length === 2 && human.center.every(Number.isFinite) && human.radius > 0 ? human : null;
  const edges = humanBloom ? humanOutline.map((a, i) => {
    const b = humanOutline[(i + 1) % humanOutline.length];
    return {a, b, length: Math.hypot(b[0] - a[0], b[1] - a[1])};
  }) : [];
  const perimeter = edges.reduce((sum, edge) => sum + edge.length, 0);
  const sparkles = Array.from({length: 110}, (_, j) => ({
    angle: j * 2.399963,
    radius: Math.exp(Math.sin(j * 12.37) * .028),
    size: .55 + Math.abs((Math.sin(j * 78.23) * 43758.5453) % 1) * 1.25,
  }));
  const cosine = Math.cos(-data.turn), sine = Math.sin(-data.turn);
  const planeX=data.planeCx??data.cx,planeY=data.planeCy??data.cy,planeTilt=data.planeTilt??.57;
  const project = (radius, angle) => {
    const x = Math.cos(angle) * radius * data.projectionScale;
    const y = Math.sin(angle) * radius * planeTilt * data.projectionScale;
    return [planeX + x * cosine - y * sine, planeY + x * sine + y * cosine];
  };
  const state = {active: false, visible: false, reduced: false, hidden: doc.hidden};
  let destroyed = false, raf = 0, elapsed = 0, last = 0, paintedAt = -Infinity;
  let frames = 0, reportedAt = -Infinity, attenuation = null;
  let width = 0, height = 0, scale = 1, offsetX = 0, offsetY = 0, dpr = 1;

  function resize() {
    if (destroyed) return;
    const box = video.getBoundingClientRect(), parent = stage.getBoundingClientRect();
    const nextDpr = Math.min(2, view.devicePixelRatio || 1);
    canvas.style.left = `${box.left - parent.left - stage.clientLeft + stage.scrollLeft}px`;
    canvas.style.top = `${box.top - parent.top - stage.clientTop + stage.scrollTop}px`;
    canvas.style.width = `${box.width}px`; canvas.style.height = `${box.height}px`;
    if (width === box.width && height === box.height && dpr === nextDpr) return;
    width = box.width; height = box.height; dpr = nextDpr;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    scale = Math.min(width / data.width, height / data.height);
    offsetX = (width - data.width * scale) / 2;
    offsetY = (height - data.height * scale) / 2;
    paintedAt = -Infinity; attenuation = null;
    if (eligible()) draw();
  }

  function wavesAt(clock) {
    const waves = [];
    const first = Math.max(0, Math.ceil((clock - ORIGIN - AGE_LIMIT) / data.period));
    const lastWave = Math.floor((clock - ORIGIN) / data.period);
    for (let i = first; i <= lastWave; i++) {
      const age = clock - (ORIGIN + i * data.period);
      const radius = ((seeds.get(i) ?? data.nextRadius) + 260) * Math.exp(age * .82) - 260;
      waves.push({age, radius, logRadius: Math.log(radius), alpha: span(age, 0, .3) * (1 - span(age, 4.7, AGE_LIMIT))});
    }
    return waves;
  }

  function propagation(waves, clock, fade) {
    ctx.save();
    // The original dense body occludes propagation. Its perspective silhouette
    // is r * 4/sqrt(15), exactly as in warm-dense-goldberg.js.
    ctx.beginPath(); ctx.rect(0, 0, data.width, data.height);
    ctx.moveTo(data.cx + data.coreRadius * 4 / Math.sqrt(15), data.cy);
    ctx.arc(data.cx, data.cy, data.coreRadius * 4 / Math.sqrt(15), 0, TAU);
    ctx.clip('evenodd');
    for (const wave of waves) {
      const alpha = wave.alpha * fade;
      for (let trail = 0; trail < 3; trail++) {
        const radius = wave.radius * (1 - trail * .035) * data.projectionScale;
        ctx.beginPath();
        ctx.ellipse(planeX, planeY, radius, radius * planeTilt, -data.turn, 0, TAU);
        ctx.strokeStyle = data.gold; ctx.lineWidth = trail ? .45 : 1;
        ctx.globalAlpha = alpha * (trail ? .045 : .19); ctx.stroke();
      }
      for (let j = 0; j < sparkles.length; j++) {
        const item = sparkles[j], p = project(wave.radius * item.radius, item.angle);
        if (p[0] < -4 || p[0] > data.width + 4 || p[1] < -4 || p[1] > data.height + 4) continue;
        const shimmer = .45 + .55 * Math.sin(clock * 3.5 + j * 2.1) ** 2;
        ctx.globalAlpha = alpha * shimmer * .85; ctx.fillStyle = data.gold;
        ctx.fillRect(p[0] - item.size / 2, p[1] - item.size / 2, item.size, item.size);
        if (j % 9 === 0) {
          ctx.globalAlpha *= .5;
          ctx.fillRect(p[0] - 3, p[1] - .4, 6, .8); ctx.fillRect(p[0] - .4, p[1] - 3, .8, 6);
        }
      }
      for (let j = 0; j < 18; j++) {
        const angle = j * 2.399963 + wave.age * .015;
        ctx.beginPath();
        for (let k = 0; k < 5; k++) {
          const q = project(wave.radius * (.955 + k * .015), angle + (k % 2 ? 1 : -1) * .006);
          if (k) ctx.lineTo(...q); else ctx.moveTo(...q);
        }
        ctx.strokeStyle = j % 3 ? data.gold : data.teal; ctx.lineWidth = .85;
        ctx.globalAlpha = alpha * (.5 + .5 * Math.sin(clock * 2 + j) ** 2) * .48; ctx.stroke();
      }
    }
    ctx.restore();
  }

  function outlinePoint(distance) {
    distance = ((distance % perimeter) + perimeter) % perimeter;
    for (const edge of edges) {
      if (distance <= edge.length) {
        const u = distance / edge.length;
        return [edge.a[0] + (edge.b[0] - edge.a[0]) * u, edge.a[1] + (edge.b[1] - edge.a[1]) * u];
      }
      distance -= edge.length;
    }
    return humanOutline[0];
  }

  // Split at actual projected vertices so a packet follows the membrane exactly,
  // including when its tail crosses a corner or wraps around the first edge.
  function outlineStroke(start, length) {
    let distance = ((start % perimeter) + perimeter) % perimeter, edgeIndex = 0;
    while (edgeIndex < edges.length - 1 && distance >= edges[edgeIndex].length) distance -= edges[edgeIndex++].length;
    ctx.beginPath(); ctx.moveTo(...outlinePoint(start));
    while (length > 1e-6) {
      const edge = edges[edgeIndex], step = Math.min(length, edge.length - distance);
      const u = (distance + step) / edge.length;
      ctx.lineTo(edge.a[0] + (edge.b[0] - edge.a[0]) * u, edge.a[1] + (edge.b[1] - edge.a[1]) * u);
      length -= step; distance = 0; edgeIndex = (edgeIndex + 1) % edges.length;
    }
    ctx.stroke();
  }

  function railPoint(route, u) {
    const v = 1 - u;
    return [v ** 3 * route.a[0] + 3 * v * v * u * route.b[0] + 3 * v * u * u * route.c[0] + u ** 3 * route.d[0],
      v ** 3 * route.a[1] + 3 * v * v * u * route.b[1] + 3 * v * u * u * route.c[1] + u ** 3 * route.d[1]];
  }

  function humanPropagation(clock, fade) {
    const period = data.period, cycle = (clock - ORIGIN) / period;
    const breath = .65 + .35 * Math.sin(Math.PI * cycle) ** 2;
    for (let i = 0; i < 2; i++) {
      const head = (cycle / 3 + i * .5) * perimeter, tail = perimeter * .085;
      ctx.strokeStyle = i ? data.teal : data.gold; ctx.lineWidth = 1;
      ctx.globalAlpha = fade * breath * .18; outlineStroke(head - tail, tail);
      ctx.lineWidth = 1.25; ctx.globalAlpha = fade * breath * .55;
      outlineStroke(head - tail * .2, tail * .2);
      const p = outlinePoint(head);
      ctx.fillStyle = i ? data.teal : data.gold; ctx.globalAlpha = fade * breath * .8;
      ctx.fillRect(p[0] - 1, p[1] - 1, 2, 2);
    }
    const clearance = p => span(Math.hypot(p[0] - humanBloom.center[0], p[1] - humanBloom.center[1]), humanBloom.radius * .48, humanBloom.radius * .62);
    for (const route of routes) {
      // Stable cohorts take turns; the same rails recur without a global wave.
      const shifted = cycle - (route.id * .61803398875 % 1), burst = Math.floor(shifted);
      const age = (shifted - burst) * period;
      if (((burst + route.id) % 3 + 3) % 3 || age > .85) continue;
      const light = span(age, 0, .14) * (1 - span(age, .62, .85));
      const forward = (burst + route.id) % 2 === 0, u = clamp(age / .85);
      const tail = Math.max(0, u - .14), opacity = fade * route.alpha * light;
      ctx.strokeStyle = route.id % 3 ? data.gold : data.teal; ctx.lineWidth = 1;
      for (let j = 0; j < 4; j++) {
        const a = tail + (u - tail) * j / 4, b = tail + (u - tail) * (j + 1) / 4;
        const p = railPoint(route, forward ? a : 1 - a), q = railPoint(route, forward ? b : 1 - b);
        ctx.globalAlpha = opacity * (.13 + j * .09) * clearance([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]);
        ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke();
      }
      const p = railPoint(route, forward ? u : 1 - u);
      ctx.fillStyle = route.id % 3 ? data.gold : data.teal; ctx.globalAlpha = opacity * .7 * clearance(p);
      ctx.fillRect(p[0] - 1.2, p[1] - .6, 2.4, 1.2);
    }
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!width || !height) return;
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offsetX, dpr * offsetY);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, data.width, data.height); ctx.clip();
    const clock = data.time + elapsed, waves = humanBloom ? null : wavesAt(clock), fade = smooth(elapsed / .5);
    if (humanBloom) humanPropagation(clock, fade);
    else {
      propagation(waves, clock, fade);
      for (const route of routes) {
      let light = 0;
      for (const wave of waves) light += Math.exp(-((route.logDistance - wave.logRadius) ** 2) / .014) * wave.alpha;
      light = Math.min(1, light); if (light < .035) continue;
      ctx.globalAlpha = fade * route.alpha * light * .55;
      ctx.strokeStyle = route.id % 3 ? data.gold : data.teal; ctx.lineWidth = 1.1; ctx.stroke(route.path);
      const u = (clock * .8 + route.id * .61803398875) % 1, v = 1 - u;
      const x = v ** 3 * route.a[0] + 3 * v * v * u * route.b[0] + 3 * v * u * u * route.c[0] + u ** 3 * route.d[0];
      const y = v ** 3 * route.a[1] + 3 * v * v * u * route.b[1] + 3 * v * u * u * route.c[1] + u ** 3 * route.d[1];
      ctx.globalAlpha = fade * route.alpha * light * .9 * smooth(u / .12) * (1 - smooth((u - .88) / .12));
      ctx.fillStyle = data.gold; ctx.fillRect(x - 1.5, y - .55, 3, 1.1);
      }
    }
    // Keep the HTML ending readable without changing a pixel of the movie.
    if (!attenuation) {
      attenuation = ctx.createLinearGradient(0, 0, 0, data.height * .85);
      attenuation.addColorStop(0, 'rgba(0,0,0,.4)');
      attenuation.addColorStop(1, 'rgba(0,0,0,1)');
    }
    ctx.globalCompositeOperation = 'destination-in'; ctx.globalAlpha = 1;
    ctx.fillStyle = attenuation; ctx.fillRect(0, 0, data.width, data.height);
    ctx.restore();
    frames++;
  }

  function eligible() { return !destroyed && state.active && state.visible && !state.reduced && !state.hidden && !doc.hidden; }
  function stop() { if (raf) view.cancelAnimationFrame(raf); raf = 0; last = 0; }
  function tick(now) {
    raf = 0; if (!eligible()) { last = 0; return; }
    if (last) elapsed += Math.min(.1, Math.max(0, (now - last) / 1000));
    last = now;
    if (now - paintedAt >= 1000 / 30 - .5) {
      draw(); paintedAt = now;
      if (now - reportedAt >= 250) {
        canvas.dataset.elapsed = elapsed.toFixed(2); canvas.dataset.frames = String(frames); reportedAt = now;
      }
    }
    raf = view.requestAnimationFrame(tick);
  }
  function update(next = {}) {
    if (destroyed) return;
    Object.assign(state, next);
    if (!state.active) {
      elapsed = 0; paintedAt = -Infinity; reportedAt = -Infinity;
      canvas.dataset.elapsed = '0.00';
    }
    canvas.style.display = state.active && !state.reduced ? 'block' : 'none';
    if (eligible()) { if (!raf) { last = 0; raf = view.requestAnimationFrame(tick); } }
    else stop();
  }
  // The parent may also suspend for pagehide/BFCache. A document event must
  // not clear that explicit suspension before the matching pageshow.
  const onVisibility = () => update();
  const onResize = () => resize();
  const observer = new view.ResizeObserver(onResize);
  observer.observe(stage); observer.observe(video);
  view.addEventListener('resize', onResize); doc.addEventListener('visibilitychange', onVisibility);
  resize();
  return {
    update,
    destroy() {
      if (destroyed) return;
      destroyed = true; stop(); observer.disconnect();
      view.removeEventListener('resize', onResize); doc.removeEventListener('visibilitychange', onVisibility);
      canvas.remove();
    },
  };
}
