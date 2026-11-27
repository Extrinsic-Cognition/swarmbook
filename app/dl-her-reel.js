// dl-her-reel.js · HER REEL, the page's half (the law and his words: dl-her-reel.mjs). Oct 29 2026, lane/her-reel-share.
// WHERE: the share at the end of her wish bar (dl-her-colours.js builds it; it stands once a pentagon of his ladder has come). Its press films her reel on
// her making's canvas (room/birth-film.mjs, A REEL OF HER ROOM): cued until the next downbeat, then a ring that fills over the reel's bars; her pentagons
// come in on the beats of its second bar, a ドン each in the reel and a pop of their slot on the bar. At the reel's last downbeat its card slams in over her:
// the reel playing, muted, and its doors: the browser's own share (the file and its words, where the browser shares files: the phones), save (the file,
// its words copied), X (its words and the link to her). No word on any of it: a glyph each, its name for the reader (his Oct 29 06:07 UTC rule).
// ITS WORDS (caption): Harmony's share words for a reel (birth-film.mjs shareTextOf, 'dances'), with her bar as text and the link to her in place of the door.
// THE SHARE INVITES TO SNOWTRACE (his Oct 30 2026 23:29 UTC, over her bar at 4/12: "how do we link it to joining project snowtrace?"): the link rides its words as
// the way in, JOIN, and the card wears the project's name over her reel (SNOWTRACE). A friend who comes in by it makes their Swarmy, walks to her station and its
// trail (the first tracenet), and grants the sharer a wish (dl-her-friends.mjs).
// COST: nothing until the press (this module and birth-film.mjs are loaded by it). While the reel films (about 10 s): birth-film's compositor a picture at 30 a
// second (state().draw_ms), the browser's encoder, one timer a ドン. The reel stays a Blob in this page's memory and goes nowhere but by the visitor's hand on a door.
import * as REEL from './dl-her-reel.mjs';
import { line } from './dl-her-wishes.mjs';
import { songLine, addLine, spotifyLink } from '../vendor/embertide-app/ui/intro/room/birth-film.mjs';
export * from './dl-her-reel.mjs';

/** caption({song, start_ms, spent, link}): the reel's words when shared: what she dances to, her bar (line), where to start the song on Instagram (the song's
 *  time at the reel's first picture: only for a reel cut on the song), its open.spotify.com link, the link to her. */
export const SNOWTRACE = 'Project Snowtrace', JOIN = `Join ${SNOWTRACE}:`;
export function caption({ song = null, start_ms = null, spent = 0, link = null } = {}) {
  const s = songLine(song), lines = [s ? `My Lyssajudron dances to ${s}` : 'My Lyssajudron dances', line(spent)];
  const add = addLine(song, start_ms); if (add) lines.push(add);
  const sp = spotifyLink(song?.track_id); if (sp) lines.push(sp);
  if (link) lines.push(`${JOIN} ${link}`);
  return lines.join('\n');
}

const CSS = `
/* HER REEL STANDS IN THE MIDDLE (his Oct 30 2026, over her reel's card: "u never checked if the video worked or was trash?"): the card stood in her making's first
   column, which HER CREATOR STANDS SYMMETRIC gave to her line "Give me my colours.", so it stood small over her words in a corner; it stands over the whole of
   her making now, in its middle, on its own night */
.dl-her-reel{position:fixed;inset:0;z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;min-height:0;pointer-events:auto}
.dl-her-reel::before{content:'';position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse at 50% 48%,rgba(5,6,9,.9),rgba(5,6,9,.78) 62%,rgba(5,6,9,.66));pointer-events:none}
.dl-her-reel[hidden]{display:none}
.dl-her-reel video{display:block;height:min(74vh,calc(100% - 128px));max-width:100%;aspect-ratio:9/16;object-fit:contain;background:#0e0e12;border:3px solid #111;border-radius:4px;
  box-shadow:0 0 0 3px #faf8f1,0 24px 60px rgba(0,0,0,.6)}
.dl-her-reel-name{margin:0;color:#f7dc8c;font:800 12px/1 var(--sans,'DM Sans',system-ui,sans-serif);letter-spacing:.34em;text-transform:uppercase;text-shadow:0 0 14px #e7b85a88}
.dl-her-reel-doors{display:flex;gap:12px}
.dl-her .dl-her-reel-door{display:grid;place-items:center;width:48px;height:48px;padding:0;border:3px solid #111;border-radius:50%;background:#faf8f1;color:#111;
  font:700 21px/1 system-ui,-apple-system,sans-serif;text-decoration:none;cursor:pointer;box-shadow:0 0 0 3px #fbf9f3;touch-action:manipulation}
.dl-her .dl-her-reel-door:hover{background:#fff}
.dl-her .dl-her-reel-door.done{background:#f7dc8c}
.dl-her-reel-door svg{width:22px;height:22px}
.dl-her-reel-door:focus-visible{outline:2px solid #faf8f1;outline-offset:4px}
.dl-her-reel.on{animation:dl-her-reel-in .52s cubic-bezier(.2,1.5,.35,1) both}
@keyframes dl-her-reel-in{from{opacity:0;transform:scale(.62)}}
@media (max-width:760px){.dl-her .dl-her-reel video{height:min(66vh,calc(100% - 120px))}.dl-her .dl-her-reel-door{width:44px;height:44px}}
@media (prefers-reduced-motion:reduce){.dl-her-reel.on{animation:none}}
`;

/** mountHerReel({win, doc, host, button, film, share, clipboard}): her reel's maker in her making's layer (host), its press the share (button).
 *  make's her: her stand (canvas, on, places); grid: () -> the grid to cut on (dl-her-reel.mjs reelGrid); song, lyrics: the reel's words (songOf, lyricsOf);
 *  pentagons, eyes: what it counts in; spent, link: her bar and the link to her, for its words; key: what it is of (the same key, the reel made already).
 *  -> {make({her, grid, song, lyrics, pentagons, eyes, spent, link, key, onShot}), open(), close(), stop(), state()} */
export function mountHerReel({ win = window, doc = document, host, button, film = () => import('../vendor/embertide-app/ui/intro/room/birth-film.mjs'), share = win.navigator, clipboard = win.navigator?.clipboard } = {}) {
  if (!doc.getElementById('dl-her-reel-css')) { const s = doc.createElement('style'); s.id = 'dl-her-reel-css'; s.textContent = CSS; doc.head.append(s); }
  const S = { filming: false, cued: false, rolling: false, dead: false, blob: null, url: null, mime: null, key: null, caption: '', bars: 0, shots: 0, eyes: false,
    opened: 0, shared: 0, saved: 0, posted: 0, why: null, film: null, timers: [], rec: null };
  let card = null, video = null, doors = null;
  const after = (at, fn) => { S.timers.push(win.setTimeout(() => { if (!S.dead) fn(); }, Math.max(0, at - win.Date.now()))); };
  const motion = () => !win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const ext = () => (/mp4/.test(S.mime || '') ? 'mp4' : 'webm');
  const fileOf = () => new win.File([S.blob], `${REEL.REEL.file}.${ext()}`, { type: (S.mime || 'video/mp4').split(';')[0] });
  const filesShared = (f) => { try { return typeof share?.share === 'function' && !!share.canShare?.({ files: [f] }); } catch { return false; } };

  async function make(o) {
    if (S.filming || S.dead || !o?.her?.canvas) return;
    if (S.blob && S.key === o.key) { open(); return; }   // the same her, rung and song: the reel made already
    S.filming = true; S.why = null; S.shots = 0; S.eyes = false; button.classList.add('cued'); S.cued = true;
    try {
      const F = await film(), g0 = o.grid(); if (S.dead) return;
      if (!g0) throw new Error('no clock to cut her reel on');
      S.bars = REEL.reelBars(o.pentagons, g0.beats_per_bar);
      S.her = o.her; o.her.sharp?.(REEL.sharpOf(o.her.canvas.clientHeight, win.devicePixelRatio || 1));   // HER REEL SHARP: drawn at the reel's own height while it films
      S.rec = F.mountBirthFilm({ source: o.her.canvas, well: { on: (ev, fn) => o.her.on(ev, fn), places: () => o.her.places(), state: () => ({}) }, grid: o.grid,
        song: o.song, lyrics: o.lyrics, reel: { bars: S.bars, layouts: REEL.REEL.pages }, ground: REEL.REEL.ground, now: () => win.Date.now(), doc, win, onReady: (blob, st) => ready(blob, st, o) });
      const check = (tries) => {   // the reel's first downbeat: an armed reel starts on its first picture past a bar's end; its pentagons are timed from that bar
        if (S.dead || !S.rec) return;
        if (!S.rec.started()) { const g = o.grid(); if (g && tries > 0) after(F.downbeatAtOrAfter(g, win.Date.now() + 20) + 120, () => check(tries - 1)); return; }
        const g = o.grid(), st = S.rec.state(), d0 = g ? F.beatOf(g, st.start.house_ms)?.downbeat_ms : null; if (!Number.isFinite(d0)) return;
        const bar_ms = g.beat_ms * (g.beats_per_bar || 4), plan = REEL.countUp(d0, g, o.pentagons, o.eyes);
        button.classList.remove('cued'); S.cued = false; S.rolling = true; button.style.setProperty('--reel-ms', `${Math.round(S.bars * bar_ms)}ms`);
        button.style.setProperty('--reel-at', `${-Math.max(0, Math.round(win.Date.now() - d0))}ms`); button.classList.add('rolling');
        for (const s of plan.shots) after(s.at, () => { S.rec?.shot(s.k, s.fx, s.fy, { on: true }); S.shots++; o.onShot?.(s.k); });
        if (plan.eyes_at != null) after(plan.eyes_at, () => { S.rec?.eyes(); S.eyes = true; });
      };
      after(F.downbeatAtOrAfter(g0, win.Date.now() + 20) + 120, () => check(3));
    } catch (e) { S.filming = false; S.why = String(e?.message || e).slice(0, 160); calm(); }
  }
  function calm() { button.classList.remove('cued', 'rolling'); S.cued = false; S.rolling = false; try { S.her?.sharp?.(0); } catch { /* her canvas gone */ } S.her = null; }   // her glass's own pixels again
  function ready(blob, st, o) {
    if (S.dead) return; S.filming = false; calm(); for (const t of S.timers) win.clearTimeout(t); S.timers = [];
    S.film = { mime: st.mime, bytes: st.bytes, pictures: st.pictures, pictures_a_s: st.pictures_a_s, draw_ms: st.draw_ms, draw_max_ms: st.draw_max_ms, source_ms: st.source_ms,
      direct: st.direct, duration_ms: st.duration_ms, start: st.start, end: st.end, grid: st.grid_at_start, words: st.words, shots: st.shots, eyes: st.eyes, reason: st.reason, errors: st.errors, why: st.why };
    S.rec = null;
    if (!blob || !blob.size) { S.why = st.why?.[0] || 'no reel'; return; }
    if (S.url) win.URL.revokeObjectURL(S.url);
    S.blob = blob; S.mime = blob.type || st.mime; S.url = win.URL.createObjectURL(blob); S.key = o.key;
    S.caption = caption({ song: o.song, start_ms: st.grid_at_start?.source === 'song' ? st.start?.song_ms ?? null : null, spent: o.spent, link: o.link }); open();   // "start at" only for a reel cut on the song
  }
  function build() {
    card = doc.createElement('div'); card.className = 'dl-her-reel'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Her reel'); card.hidden = true;
    video = doc.createElement('video'); video.muted = true; video.loop = true; video.playsInline = true; video.autoplay = true; video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
    doors = doc.createElement('div'); doors.className = 'dl-her-reel-doors';
    const door = (key, label, tag = 'button') => { const b = doc.createElement(tag); b.className = `dl-her-reel-door ${key}`; if (tag === 'button') b.type = 'button';
      b.setAttribute('aria-label', label); b.title = label; b.innerHTML = REEL.GLYPH[key]; return b; };
    const shareB = door('share', 'Share her reel'), saveB = door('save', 'Save her reel'), xA = door('x', 'Post her on X', 'a'), shutB = door('shut', 'Close');
    xA.target = '_blank'; xA.rel = 'noopener noreferrer';
    shareB.addEventListener('click', async () => {   // the browser's own share: the file and its words (Instagram, TikTok, X, Messages on the phones)
      const data = { files: [fileOf()], text: S.caption };
      try { await share.share(data); S.shared++; shareB.classList.add('done'); } catch (e) { if (e?.name !== 'AbortError') S.why = String(e?.message || e).slice(0, 120); }
    });
    saveB.addEventListener('click', () => {   // the file to the visitor's own disk, its words on the clipboard for the post they make of it
      const a = doc.createElement('a'); a.href = S.url; a.download = `${REEL.REEL.file}.${ext()}`; doc.body.append(a); a.click(); a.remove(); S.saved++;
      Promise.resolve(clipboard?.writeText?.(S.caption)).then(() => saveB.classList.add('done'), () => saveB.classList.add('done'));
    });
    xA.addEventListener('click', () => { S.posted++; });
    shutB.addEventListener('click', () => close());
    card.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
    const name = doc.createElement('p'); name.className = 'dl-her-reel-name'; name.textContent = SNOWTRACE;   // the project her reel invites into: a name, no line
    doors.append(shareB, saveB, xA, shutB); card.append(name, video, doors); host.append(card);
  }
  function open() {
    if (S.dead || !S.blob) return; if (!card) build();
    const shareB = doors.querySelector('.share'), xA = doors.querySelector('.x');
    shareB.hidden = !filesShared(fileOf()); for (const d of doors.children) d.classList.remove('done');
    xA.href = `${REEL.INTENT}?${new URLSearchParams({ text: S.caption })}`;
    if (video.src !== S.url) video.src = S.url;
    card.hidden = false; card.classList.remove('on'); if (motion()) { void card.offsetWidth; card.classList.add('on'); }
    try { const p = video.play(); p?.catch?.(() => {}); } catch { /* a glass that will not play it shows its first picture */ }
    S.opened++; (shareB.hidden ? doors.querySelector('.save') : shareB).focus?.({ preventScroll: true });
  }
  function close() { if (!card || card.hidden) return; card.hidden = true; try { video.pause(); } catch { /* gone */ } button.focus?.({ preventScroll: true }); }
  function stop() {
    S.dead = true; for (const t of S.timers) win.clearTimeout(t); S.timers = []; calm();
    try { S.rec?.stop(); } catch { /* gone */ } S.rec = null;
    try { video?.pause(); video?.removeAttribute('src'); } catch { /* gone */ } card?.remove(); card = video = doors = null;
    if (S.url) { win.URL.revokeObjectURL(S.url); S.url = null; } S.blob = null;
  }
  return { make, open, close, stop,
    state: () => ({ filming: S.filming, cued: S.cued, rolling: S.rolling, bars: S.bars, shots: S.shots, eyes: S.eyes, key: S.key, caption: S.caption,
      reel: S.blob ? { bytes: S.blob.size, mime: S.mime, file: `${REEL.REEL.file}.${ext()}` } : null, card: !!card && !card.hidden, share: !!doors && !doors.querySelector('.share').hidden,
      opened: S.opened, shared: S.shared, saved: S.saved, posted: S.posted, film: S.film, why: S.why }) };
}
