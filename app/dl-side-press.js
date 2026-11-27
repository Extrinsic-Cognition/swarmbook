// dl-side-press.js: FROM NEFERTITI TO BLUE (Nov 22 2026, lane/from-nefertiti-to-blue). His words, UTC, over the road's stills: "you gotta make sure it is aligned with what the user is left at from the
// nefertiti introduction... she introduces red and blue... you gotta make sure the polyhedron the drawing tension of saint seya the swarms and all are aligned dude...". A press on her blue plate stays on
// the page 1.75 s: the night comes up behind the ball, red leaves, she steps down, and her blue pentagon goes down onto the ball's front pentagon (dl-paywall.css html[data-chose]). Then the visit goes on
// to the plate's own address, as it did, and the ball as it stood is handed over as one picture (BRIDGE), which that page lays at its first paint until its own ball stands on the same place
// (after-the-mint.html, after-the-mint-tree.mjs). Nothing is kept: the picture is taken out as it is read. Anything missing (reduced motion, no sphere, no glyph, a new-tab press, no store): the plain
// link. Cost (measured Nov 22 2026, a hidden Chrome at 2x, 390x844 and 1440x900): one listener; on the press no script a frame (her pentagon is the svg's own animation, the rest is opacity and transform),
// then one picture of the canvas, a JPEG over the night: 12 ms on a phone, 29 to 48 ms on a wide screen, taken once everything stands still. The same picture as a WebP held the page 250 ms and 1,256 ms
// (his "it is a bit clunky and laggy when the move happens"). The film and its sound are never touched.
export const BRIDGE = 'am-bridge', GO_MS = 1750, WAIT_S = .12, WAY_S = 1.25, NIGHT = '#0e1c2d';
const middle = (pts) => [0, 1].map((k) => pts.reduce((s, p) => s + p[k], 0) / pts.length), turn = (pts) => pts.reduce((s, p, i) => { const n = pts[(i + 1) % pts.length]; return s + p[0] * n[1] - n[0] * p[1]; }, 0), said = (pts) => pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
/** pairOf(from, to): the corners of `to` in the order that takes `from` there with the least turn, wound the same way. Pure. */
export function pairOf(from, to) {
  const t = turn(from) * turn(to) < 0 ? [...to].reverse() : to, [fx, fy] = middle(from), [tx, ty] = middle(t), at = Math.atan2(from[0][1] - fy, from[0][0] - fx), off = t.map((p) => Math.abs(Math.atan2(Math.sin(Math.atan2(p[1] - ty, p[0] - tx) - at), Math.cos(Math.atan2(p[1] - ty, p[0] - tx) - at)))), k = off.indexOf(Math.min(...off));
  return from.map((_, i) => t[(k + i) % t.length]);
}
/** pentOf(from, to): her pentagon, from the split's glyph onto the ball's front pentagon, white to the ball's blue: the svg's own animation, no script a frame. Pure. */
export const pentOf = (from, to) => { const way = (name, values) => `<animate attributeName="${name}" values="${values}" begin="${WAIT_S}s" dur="${WAY_S}s" calcMode="spline" keyTimes="0;1" keySplines=".5 0 .15 1" fill="freeze"/>`; return `<polygon points="${said(from)}" stroke="#fff" stroke-width="1.6">${way('points', `${said(from)};${said(to)}`)}${way('stroke', '#fff;#4080ec')}${way('stroke-width', '1.6;4')}</polygon>`; };
/** frontOf(sphere): the ball's pentagon that faces the eye the most ({points, z}), or null. */
export const frontOf = (sphere) => Array.from({length: 12}, (_, i) => sphere?.anchor?.(`pent:${i}`)).filter((a) => a?.z > 0 && a.points?.length === 5).sort((a, b) => b.z - a.z)[0] ?? null;

export function mountSidePress({win = window, doc = document} = {}) {
  const root = doc.documentElement, left = [], undo = () => { root.removeAttribute('data-chose'); for (const el of left.splice(0)) el.remove(); };
  doc.addEventListener('click', (e) => {
    const plate = e.target?.closest?.('a.dl-stake-plate[data-side="pool"]'); if (!plate || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;
    if (root.hasAttribute('data-chose')) { e.preventDefault(); return; }
    const canvas = doc.getElementById('genesis-sphere'), stage = doc.getElementById('sphere-stage'), glyph = doc.querySelector('#dl-sides .pool polygon'), m = glyph?.getScreenCTM?.(), front = frontOf(win.genesisSphere); if (!canvas || !stage || !m || !front) return;
    e.preventDefault();
    const box = canvas.getBoundingClientRect(), q = box.width / (canvas.clientWidth || box.width), from = [...glyph.points].map((p) => { const r = p.matrixTransform(m); return [r.x, r.y]; }), to = pairOf(from, front.points.map(([x, y]) => [box.left + x * q, box.top + y * q]));
    const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'), night = doc.createElement('i'); svg.setAttribute('class', 'dl-side-pent'); svg.setAttribute('aria-hidden', 'true'); svg.innerHTML = pentOf(from, to); night.className = 'dl-side-night'; stage.prepend(night); doc.body.append(svg); left.push(svg, night); root.dataset.chose = 'pool';
    win.setTimeout(() => { hand(canvas, front.points); win.location.href = plate.href; }, GO_MS);
  });
  function hand(canvas, points) {   // the ball as it stands over the night, her pentagon on it: one picture for the next page's first paint, taken with everything still
    try {
      const k = canvas.width / canvas.clientWidth, copy = doc.createElement('canvas'), c = copy.getContext('2d'); copy.width = canvas.width; copy.height = canvas.height; c.fillStyle = NIGHT; c.fillRect(0, 0, copy.width, copy.height); c.drawImage(canvas, 0, 0);
      c.beginPath(); points.forEach(([x, y], i) => c[i ? 'lineTo' : 'moveTo'](x * k, y * k)); c.closePath(); Object.assign(c, {strokeStyle: 'rgba(64,128,236,.95)', lineWidth: 4 * k, lineJoin: 'round', shadowColor: 'rgba(64,128,236,.9)', shadowBlur: 10 * k}); c.stroke();
      win.sessionStorage.setItem(BRIDGE, copy.toDataURL('image/jpeg', .9));
    } catch { /* no store, no room: the next page brings its own ball in */ }
  }
  win.addEventListener('pageshow', (e) => { if (e.persisted) undo(); });   // back from the side: the split as she left it
  return {undo};
}
if (typeof window !== 'undefined' && typeof document !== 'undefined') mountSidePress();
