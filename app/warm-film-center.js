// THE FILM, CENTRED (Guido, Sept 27 2026: "dont you see the video's shifted towards north?"). See warm-film-center.css for the
// measurement. The ride is a function of the film's own clock, nothing else: a tenth of the theater's height until 20 s, eased to
// nothing by 24 s (the drawing reaches the frame's last row at 24.5 s), nothing after. Only the desktop film was measured, so the
// mobile film rides nothing. Written as pixels on the viewport, so the controls can stay where the viewport's bottom is.
(() => {
  const root = document.querySelector('.warm-galaxy.hero-journey'); if (!root) return;
  const view = root.querySelector('.galaxy-viewport'), theater = root.querySelector('.galaxy-theater'), video = root.querySelector('[data-galaxy-video]');
  if (!view || !theater || !video) return;
  const SHIFT = 0.10, HOLD = 20, DONE = 24;
  const measured = () => { const s = video.currentSrc || video.getAttribute('src') || video.getAttribute('poster') || ''; return !/galaxy-mobile/.test(s); };
  const at = (t) => { if (!measured()) return 0; if (!(t > HOLD)) return SHIFT; if (t >= DONE) return 0; const k = (t - HOLD) / (DONE - HOLD); return SHIFT * (1 - k * k * (3 - 2 * k)); };
  // THE STRIP'S PAPER IS THE FILM'S OWN, AS THE BROWSER DRAWS IT. A fixed hex, and then a median of a squeezed row, both left a seam
  // (two to three levels off in the blue); what holds is the frame's top rows at its two corners, read pixel for pixel, never scaled, and the value most
  // pixels share in each channel (the mode: a line of the drawing crossing the rows changes nothing). From the playing film, or from
  // the poster while nothing has played. Twice a second at most, two 96 px slices.
  const dot = document.createElement('canvas');
  const ink = dot.getContext('2d', { willReadFrequently: true });
  let poster = null, paperAt = 0;
  const median = (src, w, h) => {
    try {
      // the two top corners, never the top centre: the film opens on Claudio's glow, which reaches the centre of the first rows
      const cols = Math.min(96, w >> 2), rows = Math.max(8, Math.round(h * .04)); dot.width = cols * 2; dot.height = rows;
      ink.drawImage(src, 0, 0, cols, rows, 0, 0, cols, rows); ink.drawImage(src, w - cols, 0, cols, rows, cols, 0, cols, rows);
      const d = ink.getImageData(0, 0, cols * 2, rows).data, out = [];
      for (let k = 0; k < 3; k++) { const hist = new Uint32Array(256); for (let i = k; i < d.length; i += 4) hist[d[i]]++; let best = 0; for (let v = 1; v < 256; v++) if (hist[v] > hist[best]) best = v; out.push(best); }
      view.style.setProperty('--film-paper', `rgb(${out[0]} ${out[1]} ${out[2]})`);
    } catch { /* a frame that cannot be read keeps the last paper */ }
  };
  const paper = (force) => {
    const now = performance.now(); if (!force && now - paperAt < 500) return; paperAt = now;
    if (video.readyState >= 2 && video.videoWidth) return median(video, video.videoWidth, video.videoHeight);
    const src = video.getAttribute('poster'); if (!src) return;
    if (!poster) { poster = new Image(); poster.onload = () => median(poster, poster.naturalWidth, poster.naturalHeight); poster.src = src; }
    else if (poster.complete && poster.naturalWidth) median(poster, poster.naturalWidth, poster.naturalHeight);
  };
  let last = -1, raf = 0;
  const write = () => {
    if (at(video.currentTime) > 0) paper(false);
    const px = Math.round(theater.clientHeight * at(video.currentTime) * 10) / 10;
    if (px === last) return; last = px;
    view.style.setProperty('--film-shift-px', px + 'px'); view.classList.toggle('film-shifted', px > 0.5);
  };
  const loop = () => { write(); raf = video.paused || video.ended ? 0 : requestAnimationFrame(loop); };
  const kick = () => { write(); if (!raf && !video.paused && !video.ended) raf = requestAnimationFrame(loop); };
  view.classList.add('film-centered'); paper(true);
  for (const e of ['loadeddata', 'seeked', 'playing']) video.addEventListener(e, () => paper(true));
  for (const e of ['play', 'playing', 'pause', 'seeking', 'seeked', 'timeupdate', 'loadedmetadata', 'loadeddata', 'ended', 'emptied']) video.addEventListener(e, kick);
  addEventListener('resize', write); document.addEventListener('fullscreenchange', write);
  if ('ResizeObserver' in window) new ResizeObserver(write).observe(theater);
  write();
})();
