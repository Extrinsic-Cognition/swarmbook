// dl-her-wishes.test.mjs · HER THREE WISHES: the law (dl-her-wishes.mjs) held to her score, and to the renderer that draws the charge his picture shows (his
// Oct 29 2026 17:29 UTC: "the ones you can see that have a "wish charge" in them"). node --test dl-her-wishes.test.mjs (from embertide-app/ui/intro/dyson-society/app;
// no browser, no network).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as W from './dl-her-wishes.mjs';
import * as SC from '../vendor/embertide-app/ui/intro/room/lyssajudron-score.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LY = fs.readFileSync(path.join(HERE, '../../room/lyssajudron.mjs'), 'utf8');   // her renderer, the one every glass draws her with
const PAGE = fs.readFileSync(path.join(HERE, 'dl-her-colours.js'), 'utf8');   // her making, the mint's mount of her

test('she starts with three of her twelve, the score\'s eye-stalks; the other nine chairs are not hers yet', () => {
  assert.equal(W.TWELVE, SC.SEATS); assert.equal(W.TWELVE, 12);
  assert.deepEqual([...W.CHARGED], [...SC.EYE_SEATS]); assert.deepEqual([...W.CHARGED], [0, 1, 2]); assert.equal(W.WISHES, 3, 'the genie\'s three');
  assert.deepEqual([...W.EMPTY], [3, 4, 5, 6, 7, 8, 9, 10, 11]);
  assert.equal(W.count(), '3/12');
  assert.ok(Object.isFrozen(W.CHARGED) && Object.isFrozen(W.EMPTY));
});

test('the wish charge is what her renderer draws on exactly those three: a pentagon on each eye-stalk, in her eyes\' paint', () => {
  assert.match(LY, /eyes = new T\.InstancedMesh\(new T\.CircleGeometry\(SC\.K \* SC\.CHILD_SCALE \* 0\.8, 5\), new T\.MeshBasicMaterial\(\{[^}]*\}\), EYES\.length\)/, 'a five-sided disc, one an eye');
  assert.match(LY, /export const EYES = SC\.EYE_SEATS;/, 'the eyes are the score\'s eye seats');
  assert.match(LY, /else if \(part === 'eyes'\) \{ put\(irisMat\.color, born\.iris\); put\(eyes\.material\.color, born\.eye\); \}/, 'painted with her eyes');
  // an empty chair (place's gone) is drawn at size 0 with its place on her wire still written: the mint's ghosts and charges ride those matrices
  assert.match(LY, /pl1\.gone \? 0 : /, 'an empty chair: size 0');
  assert.match(LY, /M4\.compose\(V, Q, shared \? [^;]*\); sats\.setMatrixAt\(seat, M4\);/, 'its place written all the same, every seat');
  assert.match(LY, /place: \(seat, p, \{ s = 1, k = 1, gone = false, open = null \} = \{\}\) =>/, 'the seam the mint empties a chair by');
});

test('the mint\'s mount, and only the mint\'s, empties the nine: no other glass draws her otherwise', () => {
  assert.match(PAGE, /const at = shown\(\)\.spent;/, 'the rung on her stand: hers, or the sharer\'s while a friend\'s visit lasts (HER REEL)');
  assert.match(PAGE, /stage\(refs\.stageEl, \{ win, wishes: WISH\.ladder\(at\) \}\)/, 'her making asks for the rung she stands on');
  assert.match(PAGE, /lyssa\.place\(s, null, has \? \{\} : \{ gone: true \}\)/, 'by the renderer\'s own seam, both ways');
  assert.doesNotMatch(LY, /wish/i, 'her renderer knows nothing of wishes: every other glass draws her twelve as before');
});

// HIS LADDER (Oct 29 2026 17:31 UTC): "like gamify the dopamine from starting with 3 pentagons, using all 3 wishes and then unlocking a 4th pentagon and getting 4
// wishes now and so on"
test('his ladder: three pentagons and three wishes; all spent, the fourth comes with four; and so on to her twelve', () => {
  assert.deepEqual(W.ladder(), { pentagons: 3, left: 3, next: 4, seats: [0, 1, 2], lit: [0, 1, 2] }, 'the first rung: her three');
  assert.deepEqual(W.ladder(2), { pentagons: 3, left: 1, next: 4, seats: [0, 1, 2], lit: [2] }, 'a rung spends its pentagons in order');
  assert.deepEqual(W.ladder(3), { pentagons: 4, left: 4, next: 5, seats: [0, 1, 2, 3], lit: [0, 1, 2, 3] }, 'all three spent: the fourth pentagon, four wishes');
  assert.deepEqual(W.ladder(6), { pentagons: 4, left: 1, next: 5, seats: [0, 1, 2, 3], lit: [3] }, 'her six chambers fired: the fourth come, one wish left');
  assert.deepEqual(W.ladder(3 + 4), { pentagons: 5, left: 5, next: 6, seats: [0, 1, 2, 3, 4], lit: [0, 1, 2, 3, 4] });
  const toTwelve = [3, 4, 5, 6, 7, 8, 9, 10, 11].reduce((a, n) => a + n, 0);
  assert.deepEqual(W.ladder(toTwelve - 1), { pentagons: 11, left: 1, next: 12, seats: [...W.ORDER].slice(0, 11), lit: [10] });
  assert.deepEqual(W.ladder(toTwelve), { pentagons: 12, left: 12, next: null, seats: [...W.ORDER], lit: [...W.ORDER] }, 'her twelve, and twelve wishes');
  assert.deepEqual(W.ladder(toTwelve + 99), { pentagons: 12, left: 0, next: null, seats: [...W.ORDER], lit: [] }, 'after the twelfth: his to say');
  for (const x of [-1, 1.5, '3', null, NaN]) assert.deepEqual(W.ladder(x), W.ladder(0), `${x}: none spent`);
  assert.deepEqual([...W.ORDER], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'her three first, then the nine by seat');
  assert.equal(W.count(3), '4/12'); assert.equal(W.count(toTwelve), '12/12');
});

test('the bar: twelve slots, her three charged in her eyes\' paint, the next pentagon\'s slot, the chairs not hers yet; a spent wish dims its pentagon', () => {
  const s = W.slots('#ABCDEF');
  assert.equal(s.length, 12); assert.deepEqual(s.map((x) => x.seat), [...W.ORDER]);
  assert.equal(s.map((x) => x.state[0]).join(''), 'cccneeeeeeee', 'three charged, the fourth next, eight empty');
  assert.ok(s.slice(0, 3).every((x) => x.colour === '#ABCDEF')); assert.ok(s.slice(3).every((x) => x.colour === null));
  assert.equal(W.slots('#ABCDEF', 1).map((x) => x.state[0]).join(''), 'sccneeeeeeee', 'one wish spent: its pentagon dims, still hers');
  assert.equal(W.slots('#ABCDEF', 3).map((x) => x.state[0]).join(''), 'ccccneeeeeee', 'all three spent: four charged, the fifth next');
  assert.deepEqual(W.slots().slice(0, 3).map((x) => x.colour), [null, null, null], 'no paint given: none said');
});

test('nothing of her wishes is kept in the browser: the level is the door\'s, in the app; the page reads no count of the colours\' law', () => {
  assert.equal('keep' in W || 'kept' in W || 'KEEP_KEY' in W, false, 'no keep of the count in the law');
  assert.doesNotMatch(PAGE.replace(/^\s*\/\/.*$/gm, ''), /WISH\.kept?\(|dl\.her\.wishes/, 'nor in her page');
});

// THE WISH IS A CALL (lane/the-wish-is-a-call; his Nov 1 2026 02:11 UTC "* 3 wishes as CAC * social proof as K-factor"): the house pays her three and one a friend
// born; a wish as the door takes it
test('THE WISH IS A CALL, IN THE APP: the house owes her three and one for each friend born in the app; a wish is its words in one line; the words a key proves, bound to a window', async () => {
  assert.equal(W.WISH_PATH, '/space-router/v1/wish'); assert.equal(W.HELLO_PATH, '/space-router/v1/wish/hello'); assert.equal(W.APP_PATH, '/wish'); assert.equal(W.BRIDGE, 'dysonlight');
  assert.deepEqual([W.onHouse(), W.onHouse(0), W.onHouse(2), W.onHouse(-1), W.onHouse(1.5), W.onHouse('3')], [3, 3, 5, 3, 3, 3]);
  assert.equal(W.wishOf('  a plan\n\tfor  my week  '), 'a plan for my week');
  assert.equal(W.wishOf('x'.repeat(W.WISH_CHARS + 9)).length, W.WISH_CHARS);
  assert.deepEqual([W.wishOf(''), W.wishOf(null), W.wishOf(undefined), W.wishOf('   ')], ['', '', '', '']);
  // the words: the law's name, the act, the window, then the friend (hello) or the wish as sent; the same on the page and at the door
  assert.equal(W.helloData(2989999, 'AB12CD34EF'), 'optimism.fit/wish/v1\nhello\n2989999\nAB12CD34EF');
  assert.equal(W.helloData(2989999, null), 'optimism.fit/wish/v1\nhello\n2989999\n'); assert.equal(W.helloData(2989999, 'not a code'), W.helloData(2989999, null), 'no friend but a her code');
  assert.equal(W.wishData(2989999, 'a plan'), 'optimism.fit/wish/v1\nwish\n2989999\na plan');
  assert.equal(W.windowOf(W.WINDOW_MS * 7 + 1), 7); assert.deepEqual(W.windowsAt(W.WINDOW_MS * 7 + 1), [6, 7, 8], 'a phone a little behind or ahead');
  // Apple's key id (base64, the guide's sample) as the door names it; her code drawn from the key's digest; the door into the app and its friend
  assert.equal(W.keyOf('zgSY9YSD+7TaDXssY6WlOPVS1K3Lmk+pFhlcSWE+ZV0='), 'zgSY9YSD-7TaDXssY6WlOPVS1K3Lmk-pFhlcSWE-ZV0');
  assert.equal(W.keyOf('zgSY9YSD-7TaDXssY6WlOPVS1K3Lmk-pFhlcSWE-ZV0'), 'zgSY9YSD-7TaDXssY6WlOPVS1K3Lmk-pFhlcSWE-ZV0', 'already the door\'s name');
  assert.deepEqual([W.keyOf('short'), W.keyOf(null), W.keyOf('x'.repeat(44))], ['', '', '']);
  const d = new Uint8Array(32).map((_, i) => i * 7), code = W.codeOfDigest(d);
  assert.equal(code, '07ENW3AHRZ', 'each of the first ten bytes, its low five bits, a letter of the Society\'s alphabet'); assert.match(code, /^[0-9A-HJKMNP-TV-Z]{10}$/, 'a her code');
  assert.deepEqual([W.appLink('AB12CD34EF'), W.appLink(null), W.appLink('nope')], ['/wish?friend=AB12CD34EF', '/wish', '/wish']);
});
