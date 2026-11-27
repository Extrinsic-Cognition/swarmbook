import { buildAssemblySkin } from './assembly-geometry.js?v=journey-8';
import { assemblyViewport, assemblyBounds } from './assembly-layout.js';

const TAU = Math.PI * 2, clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const smooth = n => { n = clamp(n); return clamp(n * n * n * (n * (n * 6 - 15) + 10)); };
const phase = (p, a, b) => smooth((p - a) / (b - a));
const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const mul = (p, s) => p.map(v => v * s);
const add = (a, b) => a.map((v, i) => v + b[i]);
const rot = (p, yaw, pitch = 0) => {
  const x = p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw), z = -p[0] * Math.sin(yaw) + p[2] * Math.cos(yaw);
  return [x, p[1] * Math.cos(pitch) - z * Math.sin(pitch), p[1] * Math.sin(pitch) + z * Math.cos(pitch)];
};
const center = vertices => vertices.reduce((s, p) => add(s, mul(p, 1 / vertices.length)), [0, 0, 0]);

// A bounded 3:2 excursion in the travel lane. Position, velocity and
// acceleration return to zero at both ends, so every world still lands exactly
// on its original tile. Scroll owns the phase: reversing retraces the same path.
export function transitEnvelope(k) {
  k = clamp(k);
  return 64 * k ** 3 * (1 - k) ** 3;
}
export function lissajousTransit(k, offset = 0) {
  const envelope = transitEnvelope(k);
  return [Math.sin(3 * Math.PI * k + offset), Math.sin(2 * Math.PI * k + offset),
    Math.cos(2 * Math.PI * k + offset)].map(v => v * envelope);
}

// The orbit of the twelve: the spherical Lissajous the engine flies a chair's loop on (ratio 3:2,
// W. Erb 2018, section 2), four tilted lanes, the twelve spread along it by chair, walked at
// uniform arc length. A world docks from its pentagon's normal into its chair's loop and stays in
// orbit: the default of the chamber is motion, as it is at every depth below it.
const ORBIT_PERIOD = 84000, ARC_STEPS = 1024, ARC = [0];
const curveSpeed = u => Math.sqrt(4 + 9 * Math.sin(2 * u) ** 2);
for (let i = 1; i <= ARC_STEPS; i++) {
  const a = (i - 1) * TAU / ARC_STEPS, b = i * TAU / ARC_STEPS;
  ARC.push(ARC[i - 1] + (b - a) * (curveSpeed(a) + 4 * curveSpeed((a + b) / 2) + curveSpeed(b)) / 6);
}
const phaseAtDistance = turns => {
  const fraction = ((turns % 1) + 1) % 1, distance = fraction * ARC[ARC_STEPS];
  let lo = 0, hi = ARC_STEPS;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ARC[mid] <= distance) lo = mid; else hi = mid; }
  return (lo + (distance - ARC[lo]) / (ARC[hi] - ARC[lo])) * TAU / ARC_STEPS;
};
const lissajousUnit = u => { const polar = Math.sin(2 * u); return [polar * Math.cos(3 * u), Math.cos(2 * u), polar * Math.sin(3 * u)]; };
/** The point of chair `chair`'s loop at curve parameter `u`, at time `at` (the lane's azimuth drifts), lane 0 at radius 1. */
export function loopUnitAt(chair, u, at) {
  const lane = chair % 4;
  const radius = (1.94 + lane * .035) / 1.94, tilt = [-.34, .68, -.82, .28][lane], azimuth = lane * Math.PI * .43 + at * .000004;
  const p = lissajousUnit(u), c = Math.cos(tilt), sn = Math.sin(tilt);
  const y = p[1] * c - p[2] * sn, z = p[1] * sn + p[2] * c, ca = Math.cos(azimuth), sa = Math.sin(azimuth);
  return [(p[0] * ca + z * sa) * radius, y * radius, (-p[0] * sa + z * ca) * radius];
}
/** Where chair `chair`'s world is at time `at`: along its loop at uniform arc length, the twelve spread by chair. */
export function loopPoint(chair, at) {
  return loopUnitAt(chair, phaseAtDistance(at / ORBIT_PERIOD + chair / 12), at);
}
// the four lanes wear the engine's four discussion colours; the loops sit where the engine's do, at about
// 1.9 skin radii, the skin giving them their air as it docks. A loop is never drawn whole: a world leaves
// the last TRAIL_MS of its path behind it, fading and thinning toward the tail, like a trail in an atmosphere
const LOOP_COLORS = ['#AD8543', '#4E8B81', '#B39868', '#718996'], LOOP_RADIUS = 1.9, TRAIL_MS = 12000, TRAIL_STEPS = 90;
/** The engine's approach between two points about one center: along the great circle, the radius eased between. */
function approach(a, b, k) {
  if (k <= 0) return a; if (k >= 1) return b;
  const ar = Math.hypot(...a), br = Math.hypot(...b), u = mul(a, 1 / ar), v = mul(b, 1 / br);
  const dot = clamp(u[0] * v[0] + u[1] * v[1] + u[2] * v[2], -1, 1), angle = Math.acos(dot);
  const dir = angle < .002 || angle > Math.PI - .002 ? mix(u, v, k) : u.map((x, i) => (x * Math.sin((1 - k) * angle) + v[i] * Math.sin(k * angle)) / Math.sin(angle));
  const len = Math.hypot(...dir) || 1, r = ar + (br - ar) * k;
  return mul(dir, r / len);
}
const rgb = hex => [16, 8, 0].map(shift => parseInt(hex.slice(1), 16) >> shift & 255);
const tint = (a, b, k) => `rgb(${mix(rgb(a), rgb(b), clamp(k)).map(Math.round).join(',')})`;

export function createAssembly(root, engine = window.PoleisEngine, dive = null) {   // dive: THE DIVING ONE IN THE HERO (assembly-dive.mjs), or none: this drawing alone, as it was
  if (!root) return { setMembers() {}, setFloor() {}, setFaces() {}, destroy() {} };
  const canvas = root.querySelector('#assembly-canvas'), ctx = canvas.getContext('2d');
  const stage = root.querySelector('.assembly-stage'), wall = root.querySelector('#wall');
  const header = root.ownerDocument.querySelector('main > header');
  const why = root.ownerDocument.querySelector('.hero .why');
  const heroTransition = root.ownerDocument.querySelector('.hero .numbers');
  const founding = wall.querySelector('.wish-card'), motion = matchMedia('(prefers-reduced-motion: reduce)');
  let records = [], origins = [], signature = null, skin = buildAssemblySkin(0), floor = null, held = new Map(), faces = null;   // THE BALL IS SOLANA'S STATE: floor, the mints' (swarmbook-floor.mjs); held, a hexagon of its skin -> its mint; faces, the faces' hook
  const ghosts = [];                                                  // the diving one's worlds on chairs no society takes: their veils under the film's words
  const stood = []; let shot = [1, 0, 0], home = null, aim = null, down = null, hoverChair = null, activeChair = null; const SIGNS = [...'♈♉♊♋♌♍♎♏♐♑♒♓'].map(s => `${s}\uFE0E`);   // THE HEX IS A PAGE: held faces, camera, spin aim, 1:1 hovered/active house chair
  let width = 1, height = 1, dpr = 1, visible = false, dead = false, raf = null, progress = 0, previous = 0, arrival = 1, lastSkin = -1e9;
  // Animation time belongs to visible playback, never the age of the page.
  let orbitTime = 0, spinAngle = 0, centerY = 0;
  let cameraFraming = null, cameraRelease = null;
  let scrollStart = 0, scrollLength = 1;
  const saved = new Map();
  const remember = el => { if (!saved.has(el)) saved.set(el, { transform: el.style.transform, zIndex: el.style.zIndex, willChange: el.style.willChange, visibility: el.style.visibility, pointerEvents: el.style.pointerEvents }); };
  const restore = el => { const style = saved.get(el); if (style) Object.assign(el.style, style); };
  const queue = () => { if (!dead && raf === null && visible && !document.hidden) raf = requestAnimationFrame(frame); };

  function measure(snap = false) {
    if (dead) return;
    // CSS transforms do not change grid layout. Remove only our transforms
    // while measuring so repeated resizes can never accumulate displacement.
    records.forEach(r => restore(r.el));
    const viewport = assemblyViewport(innerHeight, header?.getBoundingClientRect().height || 0);
    height = viewport.height; width = Math.max(1, innerWidth);
    centerY = height * .44;
    if (why && heroTransition) {
      // Preserve the 15% tighter sculpture placement independently of the
      // invitations' visual offsets around the dusk boundary.
      const whyLayoutCenter = heroTransition.getBoundingClientRect().top - why.getBoundingClientRect().height / 2;
      const distance = root.getBoundingClientRect().top + centerY - whyLayoutCenter;
      centerY -= distance * .15;
    }
    // The band is the first viewport of the stage: the whole chamber sits at the
    // top of the journey and the wall flows under it (under reduced motion the
    // stylesheet pushes the wall below the band, so the viewport is set first).
    root.style.setProperty('--assembly-viewport', `${height}px`);
    const wallHeight = wall.offsetTop + wall.offsetHeight;
    const stageHeight = Math.max(height, wallHeight);
    root.style.setProperty('--assembly-stage-height', `${stageHeight}px`);
    root.style.setProperty('--assembly-pin-top', `${viewport.pinTop}px`);
    const box = stage.getBoundingClientRect(), viewTop = box.top;
    const viewLeft = canvas.getBoundingClientRect().left;
    origins = records.map(r => {
      const tile = r.el.getBoundingClientRect(), source = r.inst.cv.getBoundingClientRect();
      return { x: tile.left - viewLeft, y: tile.top - viewTop, cx: source.left - viewLeft + source.width / 2,
        cy: source.top - viewTop + source.height / 2, side: source.width,
        localX: source.left - tile.left + source.width / 2,
        localY: source.top - tile.top + source.height / 2 };
    });
    dpr = Math.min(2, devicePixelRatio || 1);
    const pixelsWide = Math.round(width * dpr), pixelsHigh = Math.round(height * dpr);
    if (canvas.width !== pixelsWide) canvas.width = pixelsWide;
    if (canvas.height !== pixelsHigh) canvas.height = pixelsHigh;
    updateScrollBounds();
    if (snap) progress = targetProgress();
    // ResizeObserver runs before paint; reapply poses in this same callback.
    present(); queue();
  }
  // The stage pins below the header, where the visible viewport begins;
  // the scroll that follows releases the twelve into the wall (progress 1 -> 0).
  function updateScrollBounds() {
    const bounds = assemblyBounds(root, stage);
    scrollStart = bounds.start;
    scrollLength = bounds.length;
  }
  const targetProgress = () => motion.matches ? 1 : 1 - clamp((scrollY - scrollStart) / scrollLength);
  const onScroll = () => { updateScrollBounds(); queue(); };
  const onResize = () => { measure(); };
  const onMotion = () => { measure(true); };

  function setMembers(nextRecords) {
    // Keep the actual tile and canvas identities, including when a refreshed
    // chain snapshot replaces a tree with the same public key.
    for (const r of records) if (!nextRecords.some(n => n.el === r.el)) { restore(r.el); saved.delete(r.el); }
    const next = nextRecords.map(r => r.key).join('|'), same = next === signature && nextRecords.every((r, i) => r.inst === records[i]?.inst && r.el === records[i]?.el);
    records = nextRecords;
    records.forEach(r => remember(r.el));
    if (same) return;
    const firstLayout = signature === null;
    signature = next;
    dive?.chairs(records.length);
    root.dataset.ready = 'true';   // the chamber stands before any society is read, with or without the diving one (no WebGL2): Why never lies on the wall's heading
    // A refreshed wall updates the current pose; only the first layout joins
    // the scroll position immediately. Keep an in-progress scroll easing intact.
    measure(firstLayout); queue();
  }
  // THE BALL IS SOLANA'S STATE (Nov 19 2026, his "you over there got a fucking static unit0... you forgot that the hexagon count and the hexagon IDs are supposed to
  // live on solana dude", then "Yes, rebuild it"): the ball is the meta swarm's floor, the mints Solana holds (swarmbook-floor.mjs): the dodecahedron with no mint,
  // one hexagon a Lyssajudron minted, each wearing its holder's face. The wall's worlds fly round it; none of their cells is on it any more.
  function setFloor(next) {
    floor = next; skin = buildAssemblySkin(floor.capacity); held = new Map(floor.held.map(h => [h.face, h]));
    // THE BALL COMES ROUND TO YOUR OWN: the first floor that holds the visitor's hexagon turns the skin until it faces the eye at the chamber's top (the frame eases
    // it there; under reduced motion, where the skin does not turn, it stands so)
    if (floor.mine && home === null) { const n = skin.hexes[floor.mine.face].normal; home = aim = Math.atan2(n[0], -n[2]) - .85; }
    dive?.floor(floor);
    canvas.setAttribute('aria-label', `The meta swarm's sphere: ${floor.count} Lyssajudron${floor.count === 1 ? '' : 's'} minted, ${floor.capacity} places on its floor, twelve chairs.`);
    queue();
  }
  function setFaces(hook) { faces = hook; dive?.faces(hook); queue(); }

  // the twelve orbit whenever the chamber shows
  const skinAlive = () => !motion.matches && records.length > 0 && progress > .5;

  function draw(p, repaint = true) {
    if (repaint) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height); }
    if (!floor || !records.length) return;
    const reduced = motion.matches, gather = phase(p, 0, .38), dock = phase(p, .5, .94), sphereIn = phase(p, .2, .66);
    // Text gets one side and the complete sculpture gets the other.
    // This one uniform camera applies equally to live tiles and their flying faces.
    const framing = !reduced && p > 0 ? cameraFraming : null;
    const cameraScale=1-(width<=720?.46:.18)*clamp(framing?.weight||0, 0, 2);   // past 1 only while the last caption holds the wall beside it (guide.js)
    const cameraX=width*(1-cameraScale)/2+width*(width<=720?.20:.10)*(framing?.pan||0), cameraY=centerY*(1-cameraScale);
    if (repaint) ctx.setTransform(dpr*cameraScale,0,0,dpr*cameraScale,dpr*cameraX,dpr*cameraY);
    // Leave room for the larger source worlds during transit, then let the
    // common surface grow as those worlds settle around its silhouette.
    // the chamber comes to the foreground as the story arrives from under the hero: a touch of zoom, the ring included
    const measure = (1.66 + .374 * dock) * Math.min(1, width / (height * (1.52 - .42 * dock))), lens = height * 1.35 * (.9 + .1 * arrival), camera = 9;
    // the worlds keep their measure; the skin itself docks smaller so its twelve loops have the engine's air around it
    const radius = measure * (1 - .34 * dock);
    // the skin turns on its own once docked, at the rate a polis turns in its tile; the scroll brings it round first
    const at = orbitTime;
    // Blend angular velocity while docking, not accumulated page time. Otherwise
    // the same scroll produces more complete turns the longer the tab is open.
    const yaw = -.2 + phase(p, .08, .94) * 1.05 + (reduced ? home ?? 0 : spinAngle), pitch = -.13 + .12 * Math.sin(p * Math.PI);
    const turn = v => rot(v, yaw, pitch);
    // THE CAPTION READS CLEAN (Nov 19 2026, his frame by frame QA of the film): a world that comes under a caption of the film leaves it in a quarter
    // second and comes back as quickly once clear, so no world ever stands as a grey ghost under the words; read off the planes guide.js poses this frame
    // (their box on screen, their opacity), in the canvas's coordinates
    const veils = [];
    if (root.dataset.descent === 'playing') {
      const box = canvas.getBoundingClientRect(), lines = root.ownerDocument.createRange();
      for (const plane of root.querySelectorAll('.descent-gate')) {
        const seen = plane.style.visibility !== 'hidden' ? +plane.style.opacity || 0 : 0, words = seen > .02 && plane.querySelector('.descent-words');
        if (!words) continue;
        let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;                 // the words as set, line by line, not the rail's box
        for (const el of words.querySelectorAll('h2, p, .descent-detail')) { lines.selectNodeContents(el); for (const q of lines.getClientRects()) if (q.width >= 1) { l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); } }
        if (r > l) veils.push({ l: l - box.left, t: t - box.top, r: r - box.left, b: b - box.top, a: seen });
      }
    }
    const veilOf = (r, x, y, radius) => {
      let under = 0;
      for (const c of veils) { const dx = Math.max(c.l - 12 - x, 0, x - c.r - 12), dy = Math.max(c.t - 12 - y, 0, y - c.b - 12); if (dx * dx + dy * dy < radius * radius) under = Math.max(under, c.a); }
      const now = previous || 0, dt = r.veilAt == null ? 1e9 : clamp(now - r.veilAt, 0, 64), step = dt / 260; r.veilAt = now;   // the frame's own clock
      r.veil = r.veil == null ? under : r.veil + clamp(under - r.veil, -step, step);
      return smooth(r.veil);
    };
    // THE DIVING ONE draws the ball at this pose, at this orbit time and turn, for as long as the chamber shows it (its light sphereIn, its trails' with the dock),
    // and hands back where each of her worlds is (seat); handed: how far the page's worlds stand in for hers (0 while hers fly, 1 once they are handed over; 1 with no diving one)
    if (dive && !reduced) dive.draw({ x: width / 2 * cameraScale + cameraX, y: centerY * cameraScale + cameraY, lens: lens * cameraScale, radius, at, yaw, pitch }, p, { ball: sphereIn, trails: dock * sphereIn });
    const hers = dive && !reduced && dive.on(), handed = hers ? 1 - dive.shown(p) : 1;
    const perspective = q => { const s = lens / (camera + q[2]); return [width / 2 + q[0] * s, centerY - q[1] * s, q[2], s]; };
    const project = v => perspective(turn(v));
    const poses = records.map((r, i) => {
      const origin = origins[i];
      // the twelve are the chairs of the goldberg of goldbergs: the first of the wall's order is chair one.
      // A world arrives on the normal of its pentagon, as a crew hangs on its chair on every other page,
      // and docks from there into its chair's loop, the same spherical Lissajous the engine flies below.
      // The loops are geostationary: they live in the skin's frame and turn with it, the worlds along them.
      // Under reduced motion a world rests on its normal. ONE FLIGHT ALL THE WAY DOWN: with the diving one, a world is where hers is, a dive in flight included
      const pent = skin.pents[i % skin.pents.length];
      const anchor = turn(mul(pent.normal, radius * LOOP_RADIUS));
      const seat = reduced ? anchor : turn(hers ? mul(dive.seat(i), radius) : mul(loopPoint(i, at), radius * LOOP_RADIUS));
      const orbit = seat;
      const destination = orbit;
      const point = perspective(approach(anchor, orbit, dock));
      // Existing canvas pixels stay live throughout; this is a DOM transform,
      // never another mount, bitmap copy, or reconstructed miniature.
      const side = (1 - gather) * origin.side + gather * measure * (1.02 - .64 * dock) * point[3];
      // a world on the far side is smaller and behind the skin; none leaves the stage whatever the turn
      // the band of numbers lives in the lowest part of the stage: no world lands on it. With the diving one a world in her chamber flies her whole loop,
      // as hers does (under the bar, over the numbers), and the stage's edge takes it in only as it docks
      const free = hers ? dock : 0;
      const px = point[0] + (clamp(point[0], side * .6, width - side * .6) - point[0]) * (1 - free), py = point[1] + (clamp(point[1], side * .6, height * .84 - side * .6) - point[1]) * (1 - free);
      const drift = lissajousTransit(gather, i * 2.399963);
      const travel = Math.min(width * .035, height * .055);
      const cx = origin.cx * (1 - gather) + px * gather + drift[0] * travel;
      const cy = origin.cy * (1 - gather) + py * gather + drift[1] * travel * .65;
      const scale = side / Math.max(1, origin.side);
      if (p === 0 || reduced) { restore(r.el); r.el.style.removeProperty('--veil'); r.veil = 0; }
      else {
        // written only on change: the skin repaints every frame, the tiles do not move at the pin
        const shownScale=scale*cameraScale, shownX=cx*cameraScale+cameraX, shownY=cy*cameraScale+cameraY;
        const transform = `translate(${shownX - origin.localX * shownScale - origin.x}px, ${shownY - origin.localY * shownScale - origin.y}px) scale(${shownScale})`;
        // behind her, or under her skin on a dive: the page's skin (z 2) hides it. Unseen while her canvas shows whole, so no press finds a world that is not drawn
        const zIndex = (point[2] > 0 || Math.hypot(...seat) < radius) && sphereIn > .6 ? '1' : '4', willChange = p < 1 ? 'transform' : '', veil = veilOf(r, shownX, shownY, side * shownScale * .4).toFixed(3);
        const visibility = '';   // THE SWARMS WEAR THEIR OWN FACES (his Nov 26 2026): the wall's worlds are drawn on her flight from the top, never her blank stand-ins
        if (r.el.style.visibility !== visibility) { r.el.style.visibility = visibility; r.el.style.pointerEvents = visibility ? 'none' : ''; }   // a world not drawn takes no press (its voting canvas is visible on its own: scenes.css), so a press on her ball never opens a polis nobody sees
        if (r.el.style.getPropertyValue('--veil') !== veil) r.el.style.setProperty('--veil', veil);
        if (hers && i < 12) dive.veils[i] = +veil;                     // her world on this chair leaves the words as this one does
        if (r.el.style.transform !== transform) r.el.style.transform = transform;
        if (r.el.style.zIndex !== zIndex) r.el.style.zIndex = zIndex;
        if (r.el.style.willChange !== willChange) r.el.style.willChange = willChange;
      }
      return { cx, cy, side, point, destination, pent };
    });
    // her worlds on the chairs no society takes leave the words too, until they are home
    if (hers) for (let i = records.length; i < 12; i++) {
      const ghost = ghosts[i] || (ghosts[i] = {}), point = perspective(turn(mul(dive.seat(i), radius))), side = measure * (1.02 - .64 * dock) * point[3] * cameraScale;
      dive.veils[i] = veilOf(ghost, point[0] * cameraScale + cameraX, point[1] * cameraScale + cameraY, side * .4);
    }
    // Orbital transforms stay on the display clock even when the expensive
    // settled skin is painted less often. The film always paints both together.
    if (!repaint) return;
    const jobs = []; stood.length = 0; shot = [cameraScale, cameraX, cameraY];
    const polygon = (points, fill, stroke, alpha = 1, line = .65, face = null) => {
      jobs.push({ z: points.reduce((s, v) => s + v[2], 0) / points.length, points, fill, stroke, alpha, line, face });
    };
    const line = (points, stroke, alpha = 1, weight = .6) => {
      jobs.push({ z: points.reduce((s, v) => s + v[2], 0) / points.length, points, stroke, alpha, line: weight });
    };
    const faceColor = vertices => {
      const normal = turn(center(vertices)), light = clamp(.5 + (-normal[0] * .25 + normal[1] * .5 - normal[2] * .8) / (radius * 1.8)) * .78;
      return `rgb(${mix(rgb('#171C17'), rgb('#2F3127'), light).map(Math.round).join(',')})`;
    };
    const panelFill = (base, face) => {
      // The same paper material and directional light as the source engine.
      const n = turn(face.normal), light = .72 + .4 * Math.max(0, n[0] * .35 + n[1] * .55 - n[2] * .75);
      return `rgb(${rgb(base).map(v => Math.min(255, Math.floor(v * light))).join(',')})`;
    };
    if (sphereIn > 0) {
      const light = ctx.createRadialGradient(width * .5, centerY, 0, width * .5, centerY, Math.min(width, height) * .53);
      light.addColorStop(0, `rgba(203,167,81,${.10 * sphereIn})`); light.addColorStop(1, 'rgba(192,158,76,0)');
      ctx.fillStyle = light; ctx.fillRect(0, 0, width, height);
      // With the diving one the ball, its faces and the trails are hers for as long as the chamber shows them. Without her the page draws the same floor:
      // a held hexagon is paper and wears its holder's face (the faces' own hook, on the side that faces the eye), the open land dark, the twelve chairs
      if (!hers) {
        skin.hexes.forEach((face, idx) => {
          const mint = held.get(idx), inside = turn(face.normal)[2] > 0, own = mint && mint === floor.mine && !inside, vertices = face.verts.map(v => mul(v, mint ? radius * 1.004 : radius));   // inside: the far wall, seen from within through the openings; the visitor's own: its rim in the mint's gold
          // OPEN LAND (his "Yes, open them"): a place no one holds yet is an opening in the frame, its edge alone drawn; a held hexagon is never open (his Sept 10)
          polygon(vertices.map(project), mint ? (inside ? '#5F5C55' : panelFill('#FBF8F1', face)) : null, own ? '#F0CF74' : mint ? '#AE8B43' : '#655F49', sphereIn * (inside ? .3 : 1), own ? 5 : mint ? .85 : inside ? .5 : .9, mint && !inside ? mint : null);   // the far wall faint, as on her skin
        });
        skin.pents.forEach(face => {
          const vertices = face.verts.map(v => mul(v, radius * 1.002));
          polygon(vertices.map(project), faceColor(vertices), '#AF9964', sphereIn * (turn(face.normal)[2] > 0 ? .3 : 1), .85);
        });
        // the trails: the path each world has just flown, in the skin's frame so it turns with the skin, sorted
        // with the skin so a stretch behind it passes behind. Age fades it and thins it; nothing flies, nothing is drawn.
        if (!reduced && dock > 0) poses.forEach((pose, i) => {
          let prev = null;
          for (let k = 0; k <= TRAIL_STEPS; k++) {
            const age = 1 - k / TRAIL_STEPS;
            const q = project(mul(loopPoint(i, at - age * TRAIL_MS), radius * LOOP_RADIUS));
            if (prev) line([prev, q], LOOP_COLORS[i % 4], (1 - age) * .75 * dock * sphereIn, .35 + 1.25 * (1 - age));
            prev = q;
          }
        });
      }
    }
    jobs.sort((a, b) => b.z - a.z);
    ctx.lineJoin = 'round';
    for (const job of jobs) {
      ctx.globalAlpha = job.alpha; ctx.beginPath();
      job.points.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]));
      if (job.fill) { ctx.closePath(); ctx.fillStyle = job.fill; ctx.fill(); }
      ctx.strokeStyle = job.stroke; ctx.lineWidth = job.line; ctx.stroke();
      if (job.face) { stood.push([job.face, job.points]); if (faces) { faces(ctx, { id: job.face.signature, show: job.alpha, points: job.points, mid: [0, 1].map(k => job.points.reduce((s, q) => s + q[k], 0) / job.points.length) }); if (job.face === floor.mine) ctx.stroke(); } }   // its rim again, over its face
    }
    ctx.globalAlpha = 1; if (sphereIn > .15 && dock > .25) { ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; for (const face of skin.pents) { const ch = +face.id.slice(5), nz = turn(face.normal)[2]; if (nz >= -.06) continue; const vis = clamp((-nz - .06) / .38) * sphereIn * dock, isHov = ch === hoverChair, isAct = ch === activeChair, isSeal = floor.sealed?.includes(ch), mid = project(mul(face.normal, radius * 1.005)); if (isHov || isAct) { const pts = face.verts.map(v => project(mul(v, radius * 1.003))); ctx.save(); ctx.globalAlpha = vis; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = isHov ? 'rgba(240,207,116,.28)' : 'rgba(240,207,116,.18)'; ctx.fill(); ctx.strokeStyle = isHov ? '#fff6d8' : '#f0cf74'; ctx.lineWidth = isHov ? 2.6 : 2; ctx.shadowColor = '#f0cf74'; ctx.shadowBlur = isHov ? 16 : 10; ctx.stroke(); ctx.restore(); } const fs = clamp(mid[3] * radius * .24 * (isHov || isAct ? 1.18 : 1), 13, 36); ctx.globalAlpha = vis * (isHov || isAct ? 1 : isSeal ? .96 : .62); ctx.font = `600 ${fs.toFixed(1)}px "Apple Symbols","Segoe UI Symbol","Noto Sans Symbols 2",sans-serif`; ctx.lineWidth = Math.max(2, fs * .14); ctx.strokeStyle = 'rgba(7,12,22,.78)'; ctx.strokeText(SIGNS[ch], mid[0], mid[1]); ctx.fillStyle = isHov ? '#fff6d8' : isAct || isSeal ? '#f0cf74' : '#e6d39a'; ctx.fillText(SIGNS[ch], mid[0], mid[1]); } ctx.restore(); }
  }

  function frame(now) {
    raf = null; if (dead || !visible || document.hidden) { previous = 0; return; }
    const target = targetProgress();
    const dt = previous ? clamp(now - previous, 0, 64) : 16; previous = now;
    // slope.js has already eased cinematic scroll. A second low-pass here
    // would make the sculpture lag behind its captions and then catch up.
    const cinematic = root.dataset.descent === 'playing';
    const requestedFraming = cinematic ? root.descentFraming : null;
    if (motion.matches) { cameraFraming = null; cameraRelease = null; }
    else if (requestedFraming) { cameraFraming = { ...requestedFraming }; cameraRelease = null; }
    else if (cameraFraming) {
      // Reversing or escaping the film gives the camera back gently; the hand
      // takes over scroll immediately without a sudden scale/position change.
      if (!cameraRelease) cameraRelease = { ...cameraFraming, elapsed: 0 };
      cameraRelease.elapsed += dt;
      const remaining = 1 - smooth(cameraRelease.elapsed / 420);
      cameraFraming = remaining > 0 ? { weight: cameraRelease.weight * remaining, pan: cameraRelease.pan * remaining } : null;
      if (!cameraFraming) cameraRelease = null;
    }
    progress = motion.matches || cinematic ? target : progress + (target - progress) * (1 - Math.exp(-dt / 85));
    if (Math.abs(progress - target) < .0001) progress = target;
    if (!motion.matches) {
      orbitTime += dt * (dive ? dive.pace(progress) : 1);           // the diving one's pace at the top, the page's once the journey starts
      spinAngle = (spinAngle + dt * .00012 * phase(progress, .5, .94)) % TAU;
      if (aim !== null) { const d = Math.atan2(Math.sin(aim - spinAngle), Math.cos(aim - spinAngle)); spinAngle += d * (1 - Math.exp(-dt / 260)); if (Math.abs(d) < .004) aim = null; }
    }
    // Keep the live worlds fluid at display rate. Only a settled skin can
    // take the lighter transform-only frame, never an authored descent.
    if (!cinematic && !cameraRelease && progress === target && aim === null && hoverChair === null && now - lastSkin < 30) { present(false); queue(); return; }
    lastSkin = now; present();
    // the skin lives while the chamber shows and any polis in it is awake; it is still at the wall, offscreen, and under reduced motion
    if (Math.abs(progress - target) > .0001 || cameraRelease || skinAlive()) queue();
  }

  function present(repaint = true) {
    // arrival: the story's top rising from the bottom of the viewport to its upper part; 1 once the stage is pinned or passed
    arrival = motion.matches ? 1 : clamp(.35 + (height - root.getBoundingClientRect().top) / (height * .55));
    root.style.setProperty('--assembly-arrival', arrival.toFixed(5));
    root.style.setProperty('--assembly-progress', progress.toFixed(5));
    root.style.setProperty('--assembly-chrome', motion.matches ? '1' : (1 - phase(progress, 0, .16)).toFixed(5));
    root.style.setProperty('--assembly-reveal', phase(progress, .15, .38).toFixed(5));
    root.style.setProperty('--assembly-text', tint('#2B2620', '#F5F0E3', phase(progress, .08, .35)));
    if (founding) founding.inert = !motion.matches && progress > .05;
    root.dataset.phase = progress === 0 ? 'wall' : progress < .45 ? 'gathering' : progress < .8 ? 'assembling' : 'whole';
    draw(progress, repaint);
  }
  // THE HEX IS A PAGE (Nov 19 2026, his "the swarmbook is made by many pages... that hex is a page"): a press on a held hexagon's face opens its holder's page
  // (floor.pageOf: /<handle>, their tracenet; the visitor's own with no page yet, her making). A drag, or a press on a link, a button or a world in front of the
  // ball, is that thing's own; the hand shows only over a face that leads somewhere. The diving one says which hexagon is under the point; without her the faces
  // are found where the page last drew them
  const inside = (pts, x, y) => { let on = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) if ((pts[i][1] > y) !== (pts[j][1] > y) && x < (pts[j][0] - pts[i][0]) * (y - pts[i][1]) / (pts[j][1] - pts[i][1]) + pts[i][0]) on = !on; return on; };
  const pageAt = e => {
    const tile = e.target?.closest?.('.tile');                       // a world in front of the ball is its own; one behind it is under the ball
    if (!floor || (tile ? tile.style.zIndex !== '1' : e.target?.closest?.('a,button,[role=button],input,textarea,form,label'))) return null;
    const box = canvas.getBoundingClientRect(), x = (e.clientX - box.left - shot[1]) / shot[0], y = (e.clientY - box.top - shot[2]) / shot[0];
    const h = dive && !motion.matches && dive.on() ? dive.at(e.clientX, e.clientY) : stood.find(f => inside(f[1], x, y))?.[0];
    return (h && floor.pageOf(h)) || null;
  };
  const onDown = e => { down = [e.clientX, e.clientY]; };
  const onPress = e => { const page = down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5 ? null : pageAt(e); if (page) { e.preventDefault(); location.assign(page); } else if ((!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) <= 5) && dive?.hit && !e.target?.closest?.('a,button,[role=button],input,textarea,form,label,.tile,.unit0-drawer')) { const u = dive.hit(e.clientX, e.clientY); if (u) { e.preventDefault(); dispatchEvent(new CustomEvent('unit0-pantheon', { detail: u })); } } };   // never the link of a world behind it too
  const onHover = e => { const cursor = pageAt(e) ? 'pointer' : ''; if (stage.style.cursor !== cursor) stage.style.cursor = cursor; }; const onHouse = e => { const d = e.detail || {}; if (d.from === '3d') return; if ('hover' in d) hoverChair = d.hover; if ('active' in d) activeChair = d.active; if (Number.isInteger(d.spin)) { const f = skin.pents.find(p => p.id === `pent:${d.spin}`); if (f) aim = Math.atan2(f.normal[0], -f.normal[2]) - .85; } queue(); };
  root.addEventListener('pointerdown', onDown); root.addEventListener('click', onPress); root.addEventListener('pointermove', onHover); addEventListener('unit0-house', onHouse); const tip = root.querySelector('#unit0-tip'), setHover3d = ch => { if (hoverChair === ch) return; hoverChair = ch; dispatchEvent(new CustomEvent('unit0-house', { detail: { hover: ch, from: '3d' } })); queue(); }, hideTip = () => { if (tip) tip.hidden = true; setHover3d(null); }; const onUnit0 = e => { const u = dive?.hit && !e.target?.closest?.('a,button,[role=button],input,textarea,form,label,.tile,.unit0-drawer') ? dive.hit(e.clientX, e.clientY) : null; setHover3d(u?.chair ?? null); if (!stage.style.cursor && u) stage.style.cursor = 'pointer'; if (!tip) return; const p = pageAt(e); if (!u && !p) { tip.hidden = true; return; } tip.hidden = false; tip.style.left = `${e.clientX}px`; tip.style.top = `${e.clientY}px`; tip.innerHTML = p ? `<b>Rider</b>Open Tracenet ↗` : u.chair !== null ? `<b>${SIGNS[u.chair]}</b>Open Meta Swarm` : `<b>Meta Swarm</b>Open Pantheon`; }; root.addEventListener('pointermove', onUnit0); root.addEventListener('pointerleave', hideTip);
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onResize);
  motion.addEventListener('change', onMotion);
  const onVisibility = () => {
    previous = 0;
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
    queue();
  };
  document.addEventListener('visibilitychange', onVisibility);
  const resize = new ResizeObserver(onResize); resize.observe(wall);
  if (header) resize.observe(header);
  const observer = new IntersectionObserver(entries => {
    const next = entries.some(entry => entry.isIntersecting);
    if (next !== visible) previous = 0;
    visible = next;
    if (visible) { measure(true); queue(); }
    else if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
  });
  root.dataset.ready = 'true';   // the chamber stands from the start, chain read or not (THE DIVING ONE COMES BACK: as her ball held it before)
  observer.observe(root); measure();
  return { setMembers, setFloor, setFaces, destroy() {
    if (dead) return;
    dead = true; if (raf !== null) cancelAnimationFrame(raf);
    removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); removeEventListener('unit0-house', onHouse); motion.removeEventListener('change', onMotion);
    root.removeEventListener('pointerdown', onDown); root.removeEventListener('click', onPress); root.removeEventListener('pointermove', onHover); root.removeEventListener('pointermove', onUnit0); root.removeEventListener('pointerleave', hideTip);
    document.removeEventListener('visibilitychange', onVisibility);
    resize.disconnect(); observer.disconnect(); records.forEach(r => restore(r.el)); saved.clear();
    if (founding) founding.inert = false;
    for (const key of ['progress', 'chrome', 'reveal', 'arrival', 'text', 'stage-height', 'pin-top', 'viewport']) root.style.removeProperty(`--assembly-${key}`);
    delete root.dataset.phase; root.dataset.ready = 'false'; ctx.clearRect(0, 0, canvas.width, canvas.height);
  } };
}
