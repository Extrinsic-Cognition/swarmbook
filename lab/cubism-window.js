// cubism-window.js: HER PORTAL ON THE HERO, the window into the film's scene that she opens from the alignment of her hair and closes by the
// wall of light at Aiolos. His words, Oct 14 2026 17:19 WEST, verbatim: "before these, the background is white... after these, the background
// ramins white... FOR THE DURATION INBETWEEN THESE, I SAID ALREADY HOW THE "FRAME" AKA "WINDOW INTO THE SCENE" should expand outwards from the
// alignment of athena hair. is that clear? do you know what i mean? it means that athena is basically opening up this portal into spacetiem and
// then SHE IS ALSO CLOSING IT BY WALL OF LIGHT AIOLOS"; and 17:35: build it on the page.
//
// One canvas of its own, put in the hero's stage just before the page's sphere canvas, so the sphere (the box) and her (the box's canvas)
// stand in front of it and the page's white is behind it. From PORTAL.open (29.763 s, the first frame her hair is aligned) it draws the page's
// own <video> (the film's picture, columns 82 to 877) through the joined face's own picture plane at the opening (cubism.mjs portalGeometry:
// so the film's hair runs on under hers), zoomed about her hair's join, inside a disc that opens like a wave and grows to the whole stage by
// 37.1 s; from his Aiolos tag (37.132 s) a wall of light runs out from her and leaves white behind it, closed at 37.6 s. Before and after:
// nothing on it, and no callback held.
// COST: on the film's frames only while the window is open (7.8 s of film): one drawImage of the 960 x 540 video under a transform and a clip,
// and one or two stroked arcs; the geometry once, at the opening (and on a resize). Paused: one draw a seek. At rest: nothing.
//   import {mountCubismWindow} from './cubism-window.js';
//   const win = mountCubismWindow({stage, film, sphere, before});   // stage: #sphere-stage, film: the page's <video>, sphere: genesisSphere,
//                                                                    // before: the sphere's canvas; win.stats, win.destroy()
import {PORTAL, portalWindow, portalGeometry} from './cubism.mjs';
import {buildAssemblySkin} from '../app/assembly-geometry.js';

/** The windows mounted on this page (a reader, the proof, takes their stats). */
export const windows = [];
export function mountCubismWindow({stage, film, sphere, before}) {
  const doc = stage.ownerDocument, view = doc.defaultView, pents = buildAssemblySkin(0).pents;
  const canvas = doc.createElement('canvas');
  canvas.id = 'hero-cubism-window'; canvas.setAttribute('aria-hidden', 'true');
  // under the sphere: the page lays its sphere canvas out in flow (.sphere-stage canvas), and a positioned canvas would paint over it; the
  // stage made its own stacking context, this canvas at z-index -1 paints above the page's white and below everything in the stage
  Object.assign(canvas.style, {position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '-1', cursor: 'auto'});
  if (view.getComputedStyle(stage).position === 'static') stage.style.position = 'relative';
  stage.style.isolation = 'isolate';
  stage.insertBefore(canvas, before ?? stage.firstChild);
  const ctx = canvas.getContext('2d');
  const stats = {draws: 0, ms: 0, last: null, geometry: null, waiting: false};
  let geo = null, W = 1, H = 1, dpr = 1, callback = 0, drawn = false;
  const size = () => {
    const b = canvas.getBoundingClientRect();
    W = Math.max(1, b.width); H = Math.max(1, b.height); dpr = Math.min(view.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    geo = null;
  };
  // the opening's geometry, from the sphere as it is at the first draw inside the window's span (the sphere's canvas fills the stage)
  const geometry = () => {
    const v = sphere.getViewState(), R = v.radius * Math.min(W, H), g = portalGeometry(pents, {yaw: v.yaw, pitch: v.pitch}, [W * 0.55, H * 0.5], R, W, H);
    stats.geometry = {origin: g.origin.map((x) => +x.toFixed(1)), zFull: +g.zFull.toFixed(2), reach: Math.round(g.reach), face: g.face};
    return g;
  };
  const inSpan = (t) => t >= PORTAL.open && t < PORTAL.closed;
  function draw() {
    const t = film.currentTime || 0;
    if (!inSpan(t)) { if (drawn) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); drawn = false; } geo = null; return; }
    if (!(film.readyState >= 2) || !film.videoWidth) return;
    const t0 = view.performance.now();
    geo ??= geometry();
    const {origin: o, D0, U0, U1} = geo, w = portalWindow(t, geo.reach, geo.zFull), z = w.z;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (w.r > 0 && w.wall < w.r) {
      ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.beginPath(); ctx.arc(o[0], o[1], w.r, 0, 2 * Math.PI);
      if (w.wall > 0) ctx.arc(o[0], o[1], w.wall, 0, 2 * Math.PI, true);   // behind the wall of light: white again
      ctx.clip('evenodd');
      // the picture square's (u, v) to the stage: her hair's join fixed, the face's decal zoomed by z about it
      ctx.transform(z * D0[0], z * D0[1], z * D0[2], z * D0[3], o[0] + z * (D0[4] - o[0]), o[1] + z * (D0[5] - o[1]));
      const k = film.videoWidth / 960, side = film.videoHeight;   // the file's columns 82..877 are the picture, between its pillarbox bars
      ctx.drawImage(film, 82 * k, 0, 796 * k, side, U0, -1, U1 - U0, 2);
      ctx.restore();
      ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (t < PORTAL.grown) {   // the window's front: bright while it opens (the wave), faint while it grows
        ctx.strokeStyle = `rgba(255, 226, 160, ${t < PORTAL.waveEnd + 0.3 ? 0.8 : 0.35})`; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(o[0], o[1], w.r, 0, 2 * Math.PI); ctx.stroke();
      }
      if (w.wall >= 0) {   // the wall of light, running out from her
        const g = ctx.createRadialGradient(o[0], o[1], Math.max(0, w.wall - 60), o[0], o[1], w.wall + 60);
        g.addColorStop(0, 'rgba(255, 247, 225, 0)'); g.addColorStop(0.5, 'rgba(255, 247, 225, 1)'); g.addColorStop(1, 'rgba(255, 247, 225, 0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o[0], o[1], w.wall + 60, 0, 2 * Math.PI); ctx.arc(o[0], o[1], Math.max(0, w.wall - 60), 0, 2 * Math.PI, true); ctx.fill('evenodd');
      }
      ctx.restore();
    }
    drawn = true; stats.draws++; stats.ms += view.performance.now() - t0; stats.last = {t, r: Math.round(w.r), z: +z.toFixed(2), wall: Math.round(w.wall)};
  }
  // causes: the film's frames while it plays inside the span (a callback held only then), a seek, a pause, a resize
  const hasCallback = typeof film.requestVideoFrameCallback === 'function';
  const onFrame = () => { callback = 0; stats.waiting = false; draw(); chain(); };
  function chain() {
    const t = film.currentTime || 0;
    if (!film.paused && hasCallback && !callback && (inSpan(t) || (t >= PORTAL.open - 0.5 && t < PORTAL.closed))) { callback = film.requestVideoFrameCallback(onFrame); stats.waiting = true; }
  }
  const stop = () => { if (callback) { film.cancelVideoFrameCallback(callback); callback = 0; stats.waiting = false; } };
  const onPlay = () => chain(), onPause = () => { stop(); draw(); }, onSeeked = () => { draw(); chain(); }, onTime = () => chain();
  film.addEventListener('play', onPlay); film.addEventListener('pause', onPause); film.addEventListener('seeked', onSeeked); film.addEventListener('timeupdate', onTime);
  const resized = new view.ResizeObserver(() => { size(); draw(); });
  resized.observe(stage);
  size(); draw(); chain();
  const handle = {
    canvas, stats, draw,
    destroy() {
      stop(); resized.disconnect();
      film.removeEventListener('play', onPlay); film.removeEventListener('pause', onPause); film.removeEventListener('seeked', onSeeked); film.removeEventListener('timeupdate', onTime);
      canvas.remove();
      windows.splice(windows.indexOf(handle), 1);
    },
  };
  windows.push(handle);
  return handle;
}
