// guide.test.mjs: THE WALL LANDS CLEAR (Nov 19 2026, his "do qa, continue. frame by frame until here", over the film's last caption standing on the wall's
// first tile). The last caption has left before the camera lets the wall go; while it reads, the wall stands just past its widest line, inside the window;
// the release is one straight move into the wall's own place, never out of the window. node --test app/guide.test.mjs
import test from 'node:test'; import assert from 'node:assert/strict'; import { readFileSync } from 'node:fs';
import { GATES, gatePose, besideLayoutOf } from './guide.js';
const camera = ({ weight, pan }, W) => { const s = 1 - .18 * weight; return { s, cX: W * (1 - s) / 2 + W * .10 * pan }; };   // assembly.js draw: cameraScale, cameraX

test('the last caption has left by .955, before the camera lets the wall slide into its place', () => {
  assert.equal(GATES.at(-1).to, .97);
  const at = (x) => gatePose(x, GATES.length - 1);
  assert.ok(at(.9).opacity > .99, 'it reads'); assert.ok(at(.955).opacity < .01, 'gone by .955'); assert.equal(at(.97).visible, false);
  const src = readFileSync(new URL('./guide.js', import.meta.url), 'utf8');
  assert.match(src, /const framing=smooth\(x\/\.075\)\*\(1-smooth\(\(x-\.955\)\/\.045\)\);/, 'the release begins at .955');
});
test('beside the last caption the wall stands just past its widest line and inside the window, and the release never leaves it', () => {
  for (const W of [900, 980, 1280, 1440, 1920]) for (const T of [W * .3, W * .36, W * .4]) {
    const left = W * .08, width = W * .84, m = 24, L = besideLayoutOf({ T, left, width, W }), { s, cX } = camera(L, W);
    const l = left * s + cX, r = (left + width) * s + cX;
    if (s > .55 + 1e-9) assert.ok(Math.abs(l - (T + m)) < 1e-6, `W ${W} T ${T}: the wall begins just past the words`);
    assert.ok(r <= W - m + 1e-6, `W ${W} T ${T}: inside the window`); assert.ok(s <= .82 + 1e-9 && s >= .55 - 1e-9);
    for (let f = 0; f <= 1; f += .05) { const c = camera({ weight: f * L.weight, pan: f * L.pan }, W), rr = (left + width) * c.s + c.cX, ll = left * c.s + c.cX;
      assert.ok(rr <= Math.max(W - m, left + width) + 1e-6 && ll >= Math.min(left, T + m) - 1e-6, `W ${W} T ${T} f ${f.toFixed(2)}: the release stays in the window`); }
  }
});
test('the page: the skip steps aside as the wall lands, the night leaves as a dawn, the words read clean', () => {
  const g = readFileSync(new URL('./guide.js', import.meta.url), 'utf8'), css = readFileSync(new URL('./guide.css', import.meta.url), 'utf8'), a = readFileSync(new URL('./assembly.js', import.meta.url), 'utf8');
  assert.match(g, /skip\.style\.opacity=\(1-smooth\(\(x-\.95\)\/\.035\)\)\.toFixed\(3\)/);
  assert.match(css, /mask-image:radial-gradient\(circle at 50% 45%,transparent calc\(var\(--intro-dawn,0\) \* 150vmax - 35vmax\),#000 calc\(var\(--intro-dawn,0\) \* 150vmax\)\)/);
  assert.match(a, /lines\.selectNodeContents\(el\); for \(const q of lines\.getClientRects\(\)\)/, 'a world leaves only from under the words as set');
  assert.match(a, /clamp\(framing\?\.weight\|\|0, 0, 2\)/, 'the camera may hold the wall smaller than its usual framing');
});
