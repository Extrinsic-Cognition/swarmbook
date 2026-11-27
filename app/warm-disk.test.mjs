// warm-disk.test.mjs · THE DISK OPENS NOTHING (warm.js onSelect). His word, Oct 30 2026, over the passport and its vow ("Two voices. One vow.", "Selected face
// 145") opened by a tap on the hero's disk: "why the fuck is this appearing when i click the saint seya disk dude?". A tap on one of the disk's hexagons opens
// no passport: the tap is the sound's (dl-twelve.js; rule 8's dl-twelve.proof.mjs --tap sphere). A headless page never reaches the disk's hexagons (during
// the film it is the Saint Seiya dodecahedron, all pentagons), so the source holds the rule.
// node --test warm-disk.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('a tap on the disk\'s hexagon opens no passport; a whitelist slot still opens its bid', () => {
  const warm = readFileSync(new URL('./warm.js', import.meta.url), 'utf8');
  const onSelect = warm.slice(warm.indexOf('onSelect(face) {'), warm.indexOf('} catch (error) {'));
  assert.ok(onSelect.length > 100, 'the disk\'s onSelect is read');
  assert.match(onSelect, /if\(face\.kind === 'hex'\) return;/, 'a hexagon: nothing opens');
  assert.doesNotMatch(onSelect, /openChamber/, 'never the passport from the disk');
  assert.match(onSelect, /window\.takeSlot\(\);return;/, 'the live whitelist\'s slot keeps its own door (dl-slot.js)');
  assert.match(readFileSync(new URL('./warm-entry.mjs', import.meta.url), 'utf8'), /import\('\.\/warm\.js\?v=disk-1'\)/, 'the page takes the new code');
});
