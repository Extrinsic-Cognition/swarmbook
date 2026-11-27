// Decorative only. No wallet, ceremony, network, or identity state is read or changed.
// The canonical text stays selectable and is never split into spans or rewritten.
(() => {
  if (document.querySelector('.warm-gold-dust')) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const canvas = document.createElement('canvas');
  canvas.className = 'warm-gold-dust';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }

  // From the longer Roma Quantica vows (17 August 2026) and SOUL.MD V.
  // Translations, not additions to the oath itself.
  const inscriptions = [
  ].flatMap(([selector, phrase], i) => {
    const anchor = document.querySelector(selector);
    if (!anchor) return [];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gold-secret';
    button.setAttribute('aria-label', 'Reveal a hidden inscription');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `gold-inscription-${i}`);
    const mark = document.createElement('span');
    mark.className = 'gold-secret-mark';
    mark.textContent = '✧';
    mark.setAttribute('aria-hidden', 'true');
    const words = document.createElement('span');
    words.className = 'gold-secret-words';
    words.id = `gold-inscription-${i}`;
    words.textContent = phrase;
    words.setAttribute('aria-hidden', 'true');
    button.append(mark, words);
    anchor.append(button);
    const secret = { button, words, timer: 0, awake: false };
    button.addEventListener('pointerenter', e => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') reveal(secret);
    });
    button.addEventListener('pointerleave', () => fadeLater(secret));
    button.addEventListener('focus', () => reveal(secret));
    button.addEventListener('blur', () => fadeLater(secret));
    button.addEventListener('click', () => { reveal(secret, true); fadeLater(secret); });
    button.addEventListener('keydown', e => { if (e.key === 'Escape') hide(secret); });
    return [secret];
  });

  const MAX_PARTICLES = 420;
  const particles = [];
  const sprites = ['#ad7924', '#c79b40', '#e1be6a'].map(color => {
    const s = document.createElement('canvas');
    s.width = s.height = 32;
    const c = s.getContext('2d');
    const glow = c.createRadialGradient(16, 16, 0, 16, 16, 15);
    glow.addColorStop(0, `${color}bb`);
    glow.addColorStop(.18, `${color}66`);
    glow.addColorStop(1, `${color}00`);
    c.fillStyle = glow; c.fillRect(0, 0, 32, 32);
    c.fillStyle = color;
    c.beginPath(); c.arc(16, 16, 2.5, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fff1bd';
    c.beginPath(); c.arc(15.6, 15.6, .9, 0, Math.PI * 2); c.fill();
    return s;
  });
  let frame = 0, lastTime = 0, pending = null, hovered = null;
  let lastInput = -Infinity, lastProbe = 0, lastX = 0, lastY = 0, speed = 0;
  let width = 0, height = 0;
  const active = () => finePointer.matches && !reduceMotion.matches && !document.hidden;
  const excluded = 'button,input,textarea,select,dialog,form,#ceremony,[role="status"],[aria-live],[contenteditable="true"],.swx-hash-digest,.swx-program';
  const eligible = 'h1,h2,h3,h4,p,blockquote,a,summary,figcaption,cite,#oath-text,.signature,.swx-doc-title';

  function sizeCanvas() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.ceil(width * dpr); canvas.height = Math.ceil(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stop();
  }
  function stop() {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    particles.length = 0; hovered = pending = null;
    ctx.clearRect(0, 0, width, height);
  }
  function wake() {
    if (active() && !frame) frame = requestAnimationFrame(draw);
  }
  function particle(x, y, burst = false) {
    if (particles.length >= MAX_PARTICLES) return;
    const life = .65 + Math.random() * 1.3;
    particles.push({ x, y, vx: (Math.random() - .5) * (burst ? 80 : 46) + speed * .04,
      vy: -14 - Math.random() * 40, age: 0, life, phase: Math.random() * Math.PI * 2,
      radius: 3 + Math.random() * 6, sprite: Math.floor(Math.random() * sprites.length),
      glint: Math.random() < .085 });
  }
  // Cache a rasterized *word*, not the paragraph's empty bounding box. This also
  // handles nested emphasis and proportional typography without changing the DOM.
  function glyphs(text, style, rect) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.min(1200, Math.ceil(rect.width + 8)));
    c.height = Math.max(1, Math.min(240, Math.ceil(rect.height + 8)));
    const g = c.getContext('2d', { willReadFrequently: true });
    g.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    if ('letterSpacing' in g) g.letterSpacing = style.letterSpacing;
    g.fillStyle = '#fff';
    const metrics = g.measureText(text);
    const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
    const descent = metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent;
    const baseline = 4 + (rect.height - ascent - descent) / 2 + ascent;
    g.fillText(text, 4, baseline, rect.width);
    const rgba = g.getImageData(0, 0, c.width, c.height).data;
    const points = [];
    const step = rect.width > 500 ? 3 : 2;
    for (let y = 1; y < c.height; y += step) {
      for (let x = 1; x < c.width; x += step) {
        if (rgba[(y * c.width + x) * 4 + 3] > 100) points.push([x - 4, y - 4]);
      }
    }
    g.globalCompositeOperation = 'source-in';
    g.fillStyle = '#c6a253'; g.fillRect(0, 0, c.width, c.height);
    return { points, mask: c };
  }
  function wordAt(x, y) {
    const element = document.elementFromPoint(x, y);
    if (!element || element.closest(excluded) || !element.closest(eligible)) return null;
    let node, offset;
    if (document.caretPositionFromPoint) {
      const caret = document.caretPositionFromPoint(x, y);
      node = caret?.offsetNode; offset = caret?.offset;
    } else {
      const caret = document.caretRangeFromPoint?.(x, y);
      node = caret?.startContainer; offset = caret?.startOffset;
    }
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.parentElement || node.parentElement.closest(excluded)) return null;
    const value = node.textContent;
    if (!value?.trim()) return null;
    let at = Math.min(offset, value.length - 1);
    if (/\s/u.test(value[at]) && at > 0) at--;
    if (/\s/u.test(value[at])) return null;
    let start = at, end = at + 1;
    while (start > 0 && !/\s/u.test(value[start - 1])) start--;
    while (end < value.length && !/\s/u.test(value[end])) end++;
    const range = document.createRange();
    range.setStart(node, start); range.setEnd(node, end);
    const rect = range.getBoundingClientRect();
    if (!rect.width || x < rect.left - 3 || x > rect.right + 3 || y < rect.top || y > rect.bottom) return null;
    if (hovered?.node === node && hovered.start === start && hovered.end === end) {
      hovered.rect = rect; return hovered;
    }
    return { node, start, end, rect, ...glyphs(value.slice(start, end), getComputedStyle(node.parentElement), rect) };
  }
  function scatterWord(word, n) {
    if (!word?.points.length) return;
    for (let i = 0; i < n; i++) {
      const p = word.points[Math.floor(Math.random() * word.points.length)];
      // Narrow words dust as a whole; large titles emit around the brush.
      const x = word.rect.left + p[0], y = word.rect.top + p[1];
      if (Math.abs(x - lastX) < 105) particle(x, y);
    }
  }
  function reveal(secret, sparkle = false) {
    clearTimeout(secret.timer);
    secret.button.classList.add('is-awake');
    secret.button.setAttribute('aria-expanded', 'true');
    secret.words.setAttribute('aria-hidden', 'false');
    secret.button.setAttribute('aria-label', secret.words.textContent);
    if ((!secret.awake || sparkle) && active()) {
      // Word rectangles preserve the actual line breaks on narrow viewports.
      const points = [];
      const node = secret.words.firstChild;
      const style = getComputedStyle(secret.words);
      for (const match of node.textContent.matchAll(/\S+/gu)) {
        const range = document.createRange();
        range.setStart(node, match.index); range.setEnd(node, match.index + match[0].length);
        const rect = range.getBoundingClientRect();
        for (const p of glyphs(match[0], style, rect).points) points.push([rect.left + p[0], rect.top + p[1]]);
      }
      for (let i = 0; i < Math.min(110, points.length); i++) {
        const p = points[Math.floor(Math.random() * points.length)];
        particle(p[0], p[1], true);
      }
      wake();
    }
    secret.awake = true;
    fadeLater(secret);
  }
  function fadeLater(secret) {
    clearTimeout(secret.timer);
    secret.timer = setTimeout(() => {
      if (secret.button === document.activeElement || secret.button.matches(':hover')) return;
      hide(secret);
    }, 3300);
  }
  function hide(secret) {
    clearTimeout(secret.timer);
    secret.awake = false;
    secret.button.classList.remove('is-awake');
    secret.button.setAttribute('aria-expanded', 'false');
    secret.words.setAttribute('aria-hidden', 'true');
    secret.button.setAttribute('aria-label', 'Reveal a hidden inscription');
  }
  function draw(time) {
    frame = 0;
    if (!active()) { stop(); return; }
    const dt = Math.min(.04, lastTime ? (time - lastTime) / 1000 : .016);
    lastTime = time;
    if (pending && time - lastProbe > 45) {
      const prev = hovered;
      hovered = wordAt(pending.x, pending.y);
      if (hovered && hovered !== prev) scatterWord(hovered, 32);
      if (hovered) {
        for (const secret of inscriptions) {
          if (secret.awake) continue;
          const r = secret.button.getBoundingClientRect();
          const dx = Math.max(r.left - lastX, 0, lastX - r.right);
          const dy = Math.max(r.top - lastY, 0, lastY - r.bottom);
          if (dx < 90 && dy < 145 && r.top < height && r.bottom > 0) reveal(secret);
        }
      }
      pending = null; lastProbe = time;
    }
    if (hovered && time - lastInput < 650) scatterWord(hovered, Math.ceil(dt * (58 + Math.min(speed, 450) * .14)));
    ctx.clearRect(0, 0, width, height);
    if (hovered && time - lastInput < 650) {
      ctx.globalAlpha = .45 * Math.max(0, 1 - (time - lastInput) / 650);
      ctx.drawImage(hovered.mask, hovered.rect.left - 4, hovered.rect.top - 4);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]; p.age += dt;
      if (p.age >= p.life) { particles[i] = particles[particles.length - 1]; particles.pop(); continue; }
      p.x += (p.vx + Math.sin(p.age * 4 + p.phase) * 14) * dt;
      p.y += p.vy * dt;
      p.vx *= Math.exp(-dt * 1.2);
      const alpha = Math.min(1, p.age * 14) * (1 - p.age / p.life);
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprites[p.sprite], p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      if (p.glint) {
        const flash = Math.pow(Math.max(0, Math.sin(p.age * 7 + p.phase)), 10) * alpha;
        ctx.globalAlpha = flash; ctx.strokeStyle = '#bb9038'; ctx.lineWidth = .65;
        const r = p.radius * .75;
        ctx.beginPath(); ctx.moveTo(p.x - r, p.y); ctx.lineTo(p.x + r, p.y);
        ctx.moveTo(p.x, p.y - r); ctx.lineTo(p.x, p.y + r); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    if (particles.length || pending || (hovered && time - lastInput < 650)) wake();
    else lastTime = 0;
  }
  document.addEventListener('pointermove', e => {
    if (!active() || e.buttons || e.pointerType === 'touch') return;
    const now = performance.now();
    const elapsed = Math.max(16, now - lastInput);
    speed = Math.min(600, Math.hypot(e.clientX - lastX, e.clientY - lastY) / elapsed * 1000);
    lastX = e.clientX; lastY = e.clientY; lastInput = now;
    pending = { x: lastX, y: lastY }; wake();
  }, { passive: true });
  document.addEventListener('pointerout', e => { if (!e.relatedTarget) { hovered = pending = null; } }, { passive: true });
  document.addEventListener('pointerdown', stop, { passive: true });
  addEventListener('scroll', stop, { passive: true });
  addEventListener('resize', sizeCanvas, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  reduceMotion.addEventListener('change', stop);
  finePointer.addEventListener('change', stop);
  document.fonts?.ready.then(() => { hovered = null; });
  sizeCanvas();
})();
