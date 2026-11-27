// dl-twelve.test.mjs: THE SOUND NEVER RESTARTS THE PICTURE (dl-twelve-clock.js, his words in its header: "there's been 10 times i said playing audio would cause replay from the start; every time you fixed that ... i tell you to fix, you tell me you fix, you break again", Oct 14 2026 22:0x WEST). The clock between the mint hero's film and its song, proved without a browser; and the page's own code (dl-twelve.js) proved to seek the picture nowhere but through it. Run: node --test app/dl-twelve.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {clockStep, keepTime, soundIn, pictureIn, resumePicture, cinematicTime, seekableAt, leanRate, DRIFT_LEAN_S, SETTLE_S, LEAN_GAIN, LEAN_MAX, JUMP_S, LEAD_S, LEAD_MIN_S, LEAD_MAX_S, AGAIN_S,
  debugStartOf, debugStartWord, asksNest, startAt, startWhenSeekable, restartTo, BURST2_S, DEBUG_START_S} from './dl-twelve-clock.js';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const DUR = 152.41;   // THE CUT (dl-twelve.js): 154.31 before his second aim was taken out
const ranges = (list) => ({length: list.length, start: (i) => list[i][0], end: (i) => list[i][1]});
/** a stand-in for a media element: its time, readiness and what it can seek to */
const media = (t, {ready = 4, paused = false, seeking = false, seekable = [[0, DUR]], duration = DUR} = {}) => ({
  currentTime: t, readyState: ready, paused, seeking, playbackRate: 1, duration, seekable: ranges(seekable),
});
const STREAM = [[0, 0]];   // what Chrome reports on a server that ignores Range requests (python http.server): every seek lands on 0

test('the tap puts the song at the picture\'s second and never touches the picture', () => {
  const song = media(0), film = media(20.5);
  soundIn(song, film);
  assert.equal(song.currentTime, 20.5, 'the song comes in where the picture is');
  assert.equal(film.currentTime, 20.5, 'the picture is not touched');
  const cold = media(0, {ready: 0}), f2 = media(7.25);
  soundIn(cold, f2);
  assert.equal(cold.currentTime, 7.25, 'a song not loaded yet keeps the second it starts at');
  assert.equal(f2.currentTime, 7.25);
  const unloaded = media(0), f3 = media(0, {ready: 0});
  soundIn(unloaded, f3);
  assert.equal(unloaded.currentTime, 0, 'a picture without metadata has no second to give');
  const stream = media(0, {seekable: STREAM}), f4 = media(12);
  soundIn(stream, f4);
  assert.equal(stream.currentTime, 0, 'a song that cannot be sought is left where it is');
  assert.equal(f4.currentTime, 12, 'and the picture still stands');
});

test('THE REGRESSION: the song at 0 while the picture plays at 20 brings the song to the picture, never the picture to 0', () => {
  const song = media(0), film = media(20), count = {};
  const step = keepTime({song, film, count});
  assert.equal(step.song, 20, 'the song goes to the picture');
  assert.equal(step.film, undefined, 'the picture is not sought');
  assert.equal(film.currentTime, 20, 'the picture holds');
  assert.equal(song.currentTime, 20);
  assert.equal(count.seeks, 1);
  for (const [s, f] of [[0, 3.1], [0.4, 60], [2, 152], [118, 120.01]]) {   // 152: the picture's last second since THE CUT
    const a = media(s), b = media(f);
    const r = clockStep(a, b);
    assert.equal(r.film, undefined, `song ${s} film ${f}: the picture is never sought back by more than ${JUMP_S} s`);
    assert.equal(r.song, f, `song ${s} film ${f}: the song comes to the picture`);
  }
});

test('joining (the first tap) brings the sound to the picture, whatever the gap', () => {
  for (const [s, f] of [[19.2, 20], [0, 20], [20.3, 20], [21.5, 20]]) {
    const song = media(s), film = media(f);
    const step = keepTime({song, film, joining: true, count: {}});
    assert.equal(step.song, f, `song ${s} film ${f}: the song to the picture`);
    assert.equal(step.film, undefined, 'the picture is not sought');
  }
  const song = media(20.01), film = media(20);
  assert.equal(keepTime({song, film, joining: true, count: {}}).why, 'in time', 'already together: nothing to do');
});

// THE CHASE (his Oct 15 2026 16:3x WEST: "why the fuck i am still hearing audio getting async from time to time?"): a drift was caught by a seek, and a seek that costs more than 0.1 s of the song left the picture behind again. A drift is caught by the picture's speed now.
test('a drift of a second or less moves the picture by its speed alone: never a seek, never back', () => {
  for (const gap of [0.05, 0.1, 0.3, 0.5, 0.99, 1.0, -0.05, -0.1, -0.3, -0.7, -1.0]) {
    const s = 20 + gap, r = clockStep(media(s), media(20));
    assert.equal(r.film, undefined, `a gap of ${gap} s: the picture is not sought`);
    assert.equal(r.song, undefined, `a gap of ${gap} s: nor the song`);
    assert.equal(r.rate, leanRate(s - 20), `a gap of ${gap} s: the picture leans`);
    assert.equal(r.why, gap > 0 ? 'behind: the picture speeds up' : 'ahead: the picture slows down');
    assert.ok(gap > 0 ? r.rate > 1 : r.rate < 1, 'toward the song');
  }
  assert.deepEqual(clockStep(media(18.99), media(20)), {song: 20, rate: 1, why: 'the sound jumped back: to the picture'}, 'ahead by more than a second: the song comes');
  assert.equal(clockStep(media(20.03), media(20)).rate, 1, `within ${DRIFT_LEAN_S} s nothing`);
  assert.equal(clockStep(media(20.03), media(20)).why, 'in time');
});

test('the rate is the gap\'s: proportional, bounded, in hundredths; a picture leaning leans until it is back within SETTLE_S', () => {
  assert.equal(leanRate(0), 1);
  assert.equal(leanRate(0.1), 1.15); assert.equal(leanRate(-0.1), 0.85);
  assert.equal(leanRate(0.5), 1 + LEAN_MAX, 'at most LEAN_MAX faster'); assert.equal(leanRate(-0.9), 1 - LEAN_MAX, 'and slower');
  for (let g = -1; g <= 1; g += 0.01) {
    const r = leanRate(g);
    assert.ok(r >= 1 - LEAN_MAX && r <= 1 + LEAN_MAX && Math.abs(r * 100 - Math.round(r * 100)) < 1e-9, `${g}: ${r}`);
    assert.ok(leanRate(g + 0.01) >= r, 'never less for a bigger gap');
  }
  assert.ok(SETTLE_S < DRIFT_LEAN_S && DRIFT_LEAN_S < JUMP_S && LEAN_GAIN > 0 && LEAN_MAX < 1);
  const leaning = media(20); leaning.playbackRate = 1.05;
  assert.equal(clockStep(media(20.03), leaning).rate, leanRate(0.03), 'leaning, 30 ms is not yet in time');
  assert.equal(clockStep(media(20.01), leaning).why, 'in time', `leaning, within ${SETTLE_S} s it is`);
  assert.equal(clockStep(media(20.01), leaning).rate, 1);
});

test('a stall of more than a second: the picture jumps ahead of the song by what a jump costs, learns it where it lands, and jumps at most once a second', () => {
  assert.deepEqual(clockStep(media(23), media(20)), {film: 23 + LEAD_S, lead: LEAD_S, rate: 1, why: 'a stall: the picture jumps ahead of the song'}, 'the picture stalled 3 s');
  const song = media(30), film = media(28.5), count = {};
  assert.equal(keepTime({song, film, count}).film, 30 + LEAD_S);
  assert.deepEqual([film.currentTime, count.seeks, count.jump], [30 + LEAD_S, 1, {at: 30, lead: LEAD_S, landing: true}]);
  song.currentTime = 30.45;   // it landed: the jump cost 0.45 s of the song, 0.25 s more than its lead
  const step = keepTime({song, film, count});
  assert.equal(Math.round(count.lead * 1000), 450, 'the next jump leads by what this one cost');
  assert.equal(count.jump.landing, false);
  assert.equal(step.film, undefined, 'landed 0.25 s behind: a drift, it leans');
  assert.equal(film.playbackRate, leanRate(0.25));
  song.currentTime = 30.8; film.currentTime = 29.5;   // stalled again within a second of the song: no second jump, it leans
  assert.equal(keepTime({song, film, count}).film, undefined);
  assert.equal(film.playbackRate, 1 + LEAN_MAX);
  song.currentTime = 31.2; film.currentTime = 30.1;   // a second on: it may jump, by the lead it learned
  assert.ok(Math.abs(keepTime({song, film, count}).film - 31.65) < 1e-9, 'ahead by the lead it learned');
  assert.equal(count.seeks, 2);
  // the lead is kept between LEAD_MIN_S and LEAD_MAX_S, whatever a landing says
  for (const [landed, want] of [[33.0, LEAD_MAX_S], [31.0, LEAD_MIN_S]]) {
    const c = {jump: {at: 31, lead: 0.2, landing: true}}, s2 = media(landed), f2 = media(31.85);
    keepTime({song: s2, film: f2, count: c}); assert.equal(c.lead, want);
  }
  // where the lead would pass what the film can seek, the jump goes to the song's own second; where that cannot be sought either, it leans
  const end = clockStep(media(150), media(148, {seekable: [[0, 150.1]]}));
  assert.deepEqual([end.film, end.lead], [150, 0]);
  const cannot = clockStep(media(150), media(148, {seekable: [[0, 149]]}));
  assert.deepEqual([cannot.film, cannot.rate], [undefined, 1 + LEAN_MAX]);
  assert.ok(LEAD_MIN_S < LEAD_S && LEAD_S < LEAD_MAX_S && AGAIN_S >= 1);
});

// THE CHASE as a model, to the frame: the song runs on; the picture runs at its rate, a stall freezes it, and a seek freezes it for what the decoder takes from the keyframe before the target (this film's keyframes, saint-seiya.mp4 ?v=53561d47; 3 ms a frame and 30 ms to start, a loaded Mac's: the seeks of Oct 15 2026 16:0x WEST cost 113 to 686 ms). The clock looks at each frame the picture presents (30 a second).
const KEYFRAMES = [0, 2.9029, 5.4054, 6.4064, 8.4084, 9.3760, 11.0444, 16.0494, 18.9189, 27.2606, 29.5629, 33.5669, 36.5699];
function chase(look, {stallAt = 21, stall = 0.4, seconds = 9, msPerFrame = 3} = {}) {
  const song = {currentTime: stallAt - 1, paused: false, readyState: 4, seeking: false, playbackRate: 1, duration: DUR, seekable: ranges([[0, DUR]])};
  let f = song.currentTime, seekLeft = 0, target = 0, stallLeft = 0, stalled = false;
  const film = {readyState: 4, paused: false, playbackRate: 1, duration: DUR, seekable: ranges([[0, DUR]]),
    get currentTime() { return f; }, set currentTime(v) { target = v; seekLeft = 0.03 + Math.round((v - Math.max(...KEYFRAMES.filter((k) => k <= v))) * 30000 / 1001) * msPerFrame / 1000; },
    get seeking() { return seekLeft > 0; }};
  const dt = 1001 / 30000, count = {}, out = {seeks: 0, frozen: 0, worst: 0, inTime: null};
  for (let n = 0; n * dt < seconds; n++) {
    song.currentTime += dt;
    if (seekLeft > 0) { out.frozen += dt; seekLeft -= dt; if (seekLeft <= 0) f = target; }
    else if (stallLeft > 0) stallLeft -= dt;
    else if (!stalled && song.currentTime >= stallAt) { stalled = true; stallLeft = stall - dt; }
    else f += film.playbackRate * dt;
    const gap = Math.abs(song.currentTime - f);
    if (stalled) { out.worst = Math.max(out.worst, gap); if (gap <= DRIFT_LEAN_S) out.inTime ??= song.currentTime - stallAt; else out.inTime = null; }
    if (seekLeft <= 0 && stallLeft <= 0) { const was = film.seeking; look({song, film, count}); if (!was && film.seeking) out.seeks++; }
  }
  return out;
}
// the law before this one (dl-twelve-clock.js at 161f3364): past 0.1 s the picture was sought to the song's second
const before = ({song, film}) => {
  const gap = song.currentTime - film.currentTime;
  if (Math.abs(gap) <= 0.045) film.playbackRate = 1;
  else if (gap < -1) song.currentTime = film.currentTime;
  else if (Math.abs(gap) > 0.1) { film.currentTime = song.currentTime; film.playbackRate = 1; }
  else film.playbackRate = 1 + Math.sign(gap) * 0.03;
};

test('THE CHASE: a 0.4 s stall where the keyframes are far apart sent the old law seeking after the song for seconds; the picture\'s speed catches it with no seek', () => {
  const old = chase(before), now = chase(keepTime);
  assert.ok(old.seeks >= 8, `the old law sought ${old.seeks} times`);
  assert.ok(old.frozen >= 2, `the picture frozen ${old.frozen.toFixed(2)} s by its seeks`);
  assert.ok(old.worst > 0.4, `and fell up to ${old.worst.toFixed(2)} s behind, further than the stall itself`);
  assert.equal(now.seeks, 0, 'the speed alone: no seek');
  assert.equal(now.frozen, 0, 'never frozen by the clock');
  assert.ok(now.worst <= 0.4 + 0.035, `never further behind than the stall (${now.worst.toFixed(3)} s)`);
  assert.ok(now.inTime !== null && now.inTime < 4, `back within ${DRIFT_LEAN_S} s of the song ${now.inTime?.toFixed(2)} s after the stall, and staying`);
});

test('THE CHASE, a stall of 1.5 s: one jump ahead of the song, then its speed; the old law chased', () => {
  const old = chase(before, {stall: 1.5}), now = chase(keepTime, {stall: 1.5});
  assert.ok(old.seeks >= 5, `the old law sought ${old.seeks} times`);
  assert.equal(now.seeks, 1, 'one jump');
  assert.ok(now.frozen < 0.6, `frozen ${now.frozen.toFixed(2)} s, by that jump alone`);
  assert.ok(now.inTime !== null && now.inTime < 5, `back within ${DRIFT_LEAN_S} s ${now.inTime?.toFixed(2)} s after the stall, and staying`);
  // and on a quick decoder (0.4 ms a frame, this Mac at load 70) the speed does it all the same
  const quick = chase(keepTime, {msPerFrame: 0.4});
  assert.deepEqual([quick.seeks, quick.frozen], [0, 0]);
});

test('on a server that ignores Range requests nothing is sought: the picture holds and the clock says so', () => {
  assert.equal(seekableAt(media(0, {seekable: STREAM}), 20), false);
  assert.equal(seekableAt(media(0), 20), true);
  assert.equal(seekableAt({currentTime: 0}, 20), true, 'a stand-in without seekable is taken as seekable');
  const song = media(0, {seekable: STREAM}), film = media(20, {seekable: STREAM}), count = {};
  const step = keepTime({song, film, count});
  assert.equal(step.held, true);
  assert.equal(film.currentTime, 20, 'the picture holds');
  assert.equal(song.currentTime, 0, 'the sound runs where it is');
  assert.equal(count.held, 1);
  const drift = clockStep(media(20.5, {seekable: STREAM}), media(20, {seekable: STREAM}));
  assert.equal(drift.film, undefined, 'a drift: the picture leans, here as everywhere');
  assert.equal(drift.rate, leanRate(0.5));
  const stall = clockStep(media(23, {seekable: STREAM}), media(20, {seekable: STREAM}));
  assert.deepEqual([stall.film, stall.rate], [undefined, 1 + LEAN_MAX], 'a stall it cannot jump: the picture leans at its fastest');
});

test('the loop\'s seam: one wrapped and the other about to, both go on by themselves', () => {
  assert.deepEqual(clockStep(media(0.2), media(DUR - 0.2)), {why: 'seam'});
  assert.deepEqual(clockStep(media(DUR - 0.3), media(0.1)), {why: 'seam'});
  assert.equal(clockStep(media(0.2), media(60)).song, 60, 'the song at its start with the picture mid-film is not the seam');
});

test('the clock waits while the two cannot be compared, and writes nothing then', () => {
  const count = {};
  assert.equal(keepTime({song: media(0, {paused: true}), film: media(20), count}), null, 'the song paused');
  assert.equal(keepTime({song: media(0, {ready: 1}), film: media(20), count}), null, 'the song not ready');
  assert.equal(keepTime({song: media(0, {seeking: true}), film: media(20), count}), null, 'the song seeking');
  const film = media(20, {seeking: true});
  assert.equal(keepTime({song: media(0), film, count}), null, 'the picture seeking');
  assert.equal(film.currentTime, 20);
  assert.deepEqual(count, {}, 'nothing counted');
});

test('the picture\'s first data with the sound already on: it starts at the song\'s second, forward only', () => {
  const a = media(5), f1 = media(0);
  pictureIn(a, f1); assert.equal(f1.currentTime, 5);
  const b = media(0), f2 = media(3);
  pictureIn(b, f2); assert.equal(f2.currentTime, 3, 'never back');
  const c = media(5, {seekable: STREAM}), f3 = media(0, {seekable: STREAM});
  pictureIn(c, f3); assert.equal(f3.currentTime, 0, 'not where it cannot go');
});

test('the page\'s sound code seeks the picture nowhere but through the clock', () => {
  const twelve = readFileSync(here('./dl-twelve.js'), 'utf8');
  assert.match(twelve, /import \{keepTime as keepClock, soundIn, pictureIn, debugStartOf, debugStartWord, asksNest, startAt, startWhenSeekable, restartTo, DEBUG_START_S\} from '\.\/dl-twelve-clock\.js\?v=skip-waits-1';/, 'the clock, with its stamp');
  assert.deepEqual([...twelve.matchAll(/film\.currentTime\s*=([^;]+);/g)].map(m => m[1].trim()), ['HOLD_S'], 'only pin the exact flash frame; sound controls never seek the picture (the Restart seeks through the clock, restartTo)');
  assert.doesNotMatch(twelve, /song\.currentTime\s*=[^=]/, 'nor the song: the clock does');
  assert.match(twelve, /soundIn\(song, cinematic.active \? \{currentTime: cinematic.t, readyState: film.readyState\} : film\);/, 'the tap: the sound comes in at the picture');
  assert.match(twelve, /film\.addEventListener\('loadeddata', \(\) => \{ if \(soundOn && !songBroken && !cinematic.active\) pictureIn\(song, film\);/, 'the picture\'s first data: forward only');
  assert.match(twelve, /if \(keepClock\(\{song, film, joining, count\}\)\) joining = false;/, 'the clock\'s hand on each frame');
  assert.doesNotMatch(twelve, /DRIFT_LEAN_S|SETTLE_S|LEAN_GAIN|LEAN_MAX|LEAD_S|AGAIN_S|playbackRate\s*=[^=]/, 'the numbers, and the picture\'s speed, live in the clock');
  const html = readFileSync(here('./warm.html'), 'utf8');
  assert.match(html, /<script type="module" src="\.\/warm-entry\.mjs\?v=[\w-]+"><\/script>/, 'the page uses its explicit entry loader');
  assert.match(readFileSync(here('./warm-entry.mjs'), 'utf8'), /import\('\.\/dl-twelve\.js\?v=seen-once-1'\)/,
    'the introduction loads this cut of the sound code, not a cached one');
  const hero = readFileSync(here('../lab/hero-ab.html'), 'utf8');
  const seeks = [...hero.matchAll(/film\.currentTime\s*=(?!=)\s*([^;\n]*)/g)].map(m => m[1].trim());
  assert.deepEqual(seeks, ['t'], 'the hero lab seeks the picture only to his keyframe (seek(t))');
});

test('THE DEBUG START: ?debug, or the Nest\'s word on his doors, puts both at the second burst\'s first frame at their first load, forward only, never where they cannot go', () => {
  assert.equal(debugStartOf(''), undefined, 'the address says nothing: the Nest\'s word may decide');
  for (const off of ['?debug=off', '?debug=0', '?debug=false', '?debug=no']) assert.equal(debugStartOf(off), null, off);
  for (const on of ['?debug', '?debug=', '?debug=burst2', '?debug=1', '?debug=on', '?freeze=off&debug=burst2']) assert.equal(debugStartOf(on), DEBUG_START_S, on);
  assert.equal(debugStartOf('?debug=46'), 46, 'a second of his choosing');
  assert.equal(+DEBUG_START_S.toFixed(3), 38.076, 'inside the golden one\'s first frame (frame 1141 begins at 38.0714 s), never the shot before it');
  assert.ok(DEBUG_START_S > BURST2_S && DEBUG_START_S < BURST2_S + 1001 / 30000, 'within frame 1141');
  assert.equal(debugStartWord({start: 'burst2', by: 'claude', at: 1}), DEBUG_START_S, 'the word');
  assert.equal(debugStartWord({start: 46}), 46);
  for (const none of [null, undefined, {}, {start: null}, {start: ''}, {start: 'off'}, {start: 0}, {start: false}, 'burst2']) assert.equal(debugStartWord(none), null, JSON.stringify(none));
  for (const door of ['127.0.0.1', 'localhost', '192.168.8.164', '192.168.8.188', '10.0.0.7', '172.20.1.2', 'guidos-macbook-pro-2.local']) assert.equal(asksNest(door), true, door);
  for (const pub of ['optimism.fit', 'www.optimism.fit', 'optimism-fit.pages.dev', '172.32.0.1', '8.8.8.8', '']) assert.equal(asksNest(pub), false, pub);
  assert.match(readFileSync(here('../lab/hero-mount.js'), 'utf8'), /const BURSTS = \[\{t: 11\.044, power: 1\}, \{t: 1141 \* 1001 \/ 30000, until:/,
    'the second burst is still the hero\'s own (lab/hero-mount.js BURSTS[1].t)');
  const at = DEBUG_START_S;
  const film = media(0), song = media(0);
  assert.equal(startAt(film, at), true); assert.equal(film.currentTime, at, 'the picture starts there');
  assert.equal(startAt(song, at), true); assert.equal(song.currentTime, at, 'and the song');
  const later = media(50);
  assert.equal(startAt(later, at), false); assert.equal(later.currentTime, 50, 'never back');
  const stream = media(0, {seekable: STREAM});
  assert.equal(startAt(stream, at), false); assert.equal(stream.currentTime, 0, 'nothing sought on a server that ignores Range');
  assert.equal(startAt(media(0), NaN), false);
  const twelve = readFileSync(here('./dl-twelve.js'), 'utf8');
  assert.match(twelve, /const asked = debugStartOf\(location\.search\);/, 'the page reads its own address first');
  assert.match(twelve, /else if \(asked === undefined && asksNest\(location\.hostname\) && !navigator\.webdriver\) \{\s*fetch\(`\$\{location\.protocol\}\/\/\$\{location\.hostname\}:8904\/nest\/ref\/mint\/debug-start`/,
    'the word only when the address says nothing, only on his doors, never in a proof\'s browser');
  assert.match(twelve, /if \(debugAt !== null \|\| soundOn\) return;/, 'never after the first tap');
  assert.match(twelve, /const canAttend = \(\) => !debugHold && !document\.hidden && inView && !suspended && !userPaused\(\);/,
    'the page holds at the explosion\'s first frame while the hero loads (his 04:2x: "start the page when i reefresh it there")');
  assert.match(twelve, /heroUp = \(\) => Boolean\(window\.hero\?\.theater && window\.hero\?\.unbox\)/, 'until the hero\'s theater and box are up');
  assert.match(twelve, /if \(heroUp\(\)\) release\('hero'\); else if \(performance\.now\(\) - t0 > 20000\) release\('time'\);/, 'twenty seconds at most');
  assert.match(twelve, /prime\('debug'\); sync\(\);/, 'then it plays at once');
  assert.match(twelve, /count\.debug\[name\] = startAt\(media, debugAt\)/, 'and seeks only through the clock');
  assert.match(twelve, /if \(media\.readyState >= 1\) go\(\); else media\.addEventListener\('loadedmetadata', go, \{once:true\}\);/, 'once, at the first load');
  assert.doesNotMatch(twelve, /dl-debug-start|createElement\('div'\)|textContent = `DEBUG/, 'and no banner over the hero (his Oct 17 2026 22:0x WEST: "remove that ugly debug banner")');
});


test('cinematic return advances only the picture to the continuous clock and restores its normal speed', () => {
  const film = media(37.08705); film.playbackRate = 1.25;
  resumePicture(film, 45.68705);
  assert.equal(film.currentTime, 45.68705);
  assert.equal(film.playbackRate, 1);
  resumePicture(film, 37);
  assert.equal(film.currentTime, 45.68705, 'never return to the held picture or restart');
  const stream = media(37.08705, {seekable: STREAM});
  resumePicture(stream, 45.68705);
  assert.equal(stream.currentTime, 37.08705, 'cannot seek outside available media');
  resumePicture(film, NaN);
  assert.equal(film.currentTime, 45.68705);
});


test('a buffering soundtrack holds cinematic time; only silent mode advances by elapsed time', () => {
  const song = media(40, {ready: 1, paused: true});
  assert.equal(cinematicTime(40, song, true, 3), 40, 'buffering never pushes the reveal ahead');
  song.currentTime = 40.04; song.readyState = 4;
  assert.equal(cinematicTime(40, song, true, .016), 40.04);
  song.currentTime = 39.99;
  assert.equal(cinematicTime(40, song, true, .016), 40, 'clock jitter cannot rewind the camera');
  assert.equal(cinematicTime(40, song, false, .016), 40.016);
});


test('a sound tap during the silent reveal waits for the correct audio range', () => {
  const song = media(0, {seekable: [[0, 10]]}), picture = media(41);
  assert.equal(soundIn(song, picture), false, 'caller keeps the join pending');
  assert.equal(song.currentTime, 0);
  assert.equal(picture.currentTime, 41, 'reveal never rewinds to unloaded sound');
  song.seekable = ranges([[0, DUR]]);
  assert.equal(soundIn(song, picture), true);
  assert.equal(song.currentTime, 41, 'progress joins at the held cinematic second');
});

// THE RESTART AND THE STORY THAT WAITS (his Oct 27 2026 14:5x WET, over the hero's bar: "can we make it so that the video pauses whenever a user scrolls down? so they dont lose track of the story... why the fuck continue here is not like sound on and pause? make it same style as them and on the left and make it 'Restart' so people can restart by clicking it").
test('THE RESTART: both media to their first frame through the clock, inside the seekable ranges; the page wires the button first in the film\'s row, in place of Continue', () => {
  const film = media(42), song = media(42);
  assert.equal(restartTo(film), true); assert.equal(film.currentTime, 0, 'the picture from its first frame');
  assert.equal(restartTo(song), true); assert.equal(song.currentTime, 0, 'and the song with it');
  assert.equal(restartTo(media(12), 3), true, 'or a second');
  const stream = media(30, {seekable: STREAM});
  assert.equal(restartTo(stream), true); assert.equal(stream.currentTime, 0, 'on a server that ignores Range (seekable [0, 0]) the first frame is the one second a seek can reach');
  assert.equal(restartTo(media(30, {seekable: STREAM}), 3), false, 'and no other');
  assert.equal(restartTo(media(5), -1), false); assert.equal(restartTo(media(5), NaN), false);
  const twelve = readFileSync(here('./dl-twelve.js'), 'utf8');
  assert.match(twelve, /const restart = stage\.querySelector\('\[data-twelve-restart\]'\);/, 'the button is the stage\'s');
  assert.match(twelve, /count\.restart = \{film: restartTo\(film\), song: soundOn && !songBroken \? restartTo\(song\) : null\};/, 'the seek is the clock\'s, the song only when it is on');
  assert.match(twelve, /if \(wall\.holds\(\)\) \{ showState\(\); return; \}/, 'nothing while the wall holds the drawn arrow');
  assert.match(twelve, /if \(restart\) restart\.disabled = wall\.holds\(\);/, 'and the button says so');
  assert.match(twelve, /if \(userPaused\(\)\) motion\.click\(\);\s*moment\(\); sphere\.redraw\(\); sync\(\);/, 'a paused film plays again from the start');
  const html = readFileSync(here('./warm.html'), 'utf8');
  assert.match(html, /<div class="dl-twelve-controls" role="group" aria-label="Film controls"><button type="button" data-twelve-restart aria-controls="dl-twelve-film" aria-label="Restart the film from its first frame">Restart<\/button><button type="button" data-twelve-sound/,
    'Restart first in the row, the same style as Sound and Pause (dl-twelve.css: every button of the row)');
  assert.doesNotMatch(html, /cinematic-continue/, 'the Continue link is gone');
  assert.doesNotMatch(readFileSync(here('./warm-fullframe.css'), 'utf8'), /cinematic-continue/, 'and its style with it');
});
test('THE FILM PLAYS ON A SCROLL (his Nov 20 2026): no wheel or finger puts the film away; off screen it rests by inView; never the scroll event', () => {
  const twelve = readFileSync(here('./dl-twelve.js'), 'utf8');
  assert.doesNotMatch(twelve, /storyAway|storyWaits|storyReturns|addEventListener\('wheel'|addEventListener\('touchmove'/, 'a scroll pauses nothing');
  assert.match(twelve, /const canAttend = \(\) => !debugHold && !document\.hidden && inView && !suspended && !userPaused\(\);/, 'what rests the film: hidden, off screen, suspended, his Pause');
  assert.doesNotMatch(twelve, /addEventListener\('scroll'/, 'never the page\'s own scroll');
});

// SKIP TO THE MINT (his Oct 28 2026 03:5x WET: "so people cant skip video?"; "put a visible Skip to the mint on the film from its first second; it jumps the film to the drawn arrow and opens the card at once, her explainer skipped"): a seen pill beside the film's row, shown only while the wall will hold; a press seeks the film (and the song when it is on) just before the arrow through the clock, and tells her (SKIP_EVENT) so her entrance's frames load at once. THE SKIP KEEPS HER (his Oct 29 2026 16:2x UTC): the skip passes the film alone, three seconds before the arrow; her entrance and her making play.
test('SKIP TO THE MINT: seen from the first second, toward the stop only; the film to just before the arrow through the clock; her word sent', () => {
  const html = readFileSync(here('./warm.html'), 'utf8'), twelve = readFileSync(here('./dl-twelve.js'), 'utf8'), css = readFileSync(here('./dl-twelve.css'), 'utf8');
  assert.match(html, /aria-label="Pause the film and motion">Pause<\/button><\/div><button type="button" class="dl-twelve-skip" data-twelve-skip hidden aria-label="Skip the film to the trail">Skip to the trail ›<\/button>/, 'beside the row, never inside its hover');
  // CLEAR THE MINT (lane/clear-the-mint, his Oct 30 2026 03:21:04 UTC "Yes, clear it"): the skip went to $WARM; THE FIRST TRACENET (his ~22:4x) sends it to the trail; the film's own row says film, never mint
  assert.match(twelve, /pause\.setAttribute\('aria-label', userPaused\(\) \? 'Resume the film and motion' : 'Pause the film and motion'\);/);
  assert.match(html, /dl-twelve\.css\?v=readable-1/);
  assert.match(css, /#sphere-stage \.dl-twelve-skip \{position:absolute;left:16px;top:14px;/, 'seen in the film\'s upper left');
  assert.match(twelve, /const skip = stage\.querySelector\('\[data-twelve-skip\]'\);/);
  assert.match(twelve, /if \(skip\) skip\.hidden = wall\.holds\(\) \|\| !windowAhead\(\) \|\| skipped;/, 'toward the stop only, once');
  assert.match(twelve, /const SKIP_BEFORE_S = 3;/); assert.match(twelve, /const at = Math\.max\(0, FREEZE_S - SKIP_BEFORE_S\);/);
  assert.match(twelve, /count\.skip\.film = startWhenSeekable\(film, at, late\('film'\)\); count\.skip\.song = soundOn && !songBroken \? startWhenSeekable\(song, at, late\('song'\)\) : null;/,
    'through the clock, waiting for the film when it cannot be sought yet');
  assert.match(twelve, /late = \(name\) => \(put\) => \{ count\.skip\[name\] = put; sphere\.redraw\(\); \};/, 'the late answer said in its state; the seek\'s own seeked moves the page');
  assert.match(twelve, /document\.dispatchEvent\(new CustomEvent\(SKIP_EVENT, \{detail: \{at: count\.skip\.at\}\}\)\);/);
  assert.match(twelve, /import \{SKIP_EVENT, ASK_EVENT\} from '\.\/dl-athena\.mjs';/, 'one name, the law\'s, and its question asked of her');
  // THE SKIP ASKS FIRST (his Oct 29 2026 20:45:41 UTC): a press asks her; the skip runs only on her question's Skip, or at once on a page without her
  assert.match(twelve, /if \(skip\) skip\.addEventListener\('click', askToSkip\);/);
  assert.match(twelve, /detail: \{go: skipToMint, from: skip\}\}\)\)\) skipToMint\(\); \};/);
});

// A SKIP THAT WAITS FOR THE FILM (lane/a-skip-waits-for-the-film, Oct 29 2026): measured in headless Chrome on the page served with byte ranges, SKIP TO THE MINT stood 0.3 s after load while the film had no metadata (readyState 0, seekable empty); a press then found startAt refused (count.skip.film false), the skip hidden as done, and the film playing on from 0: no stop, no entrance of hers. The press now waits for the film's metadata.
test('a skip pressed before the film can be sought waits for its metadata, once, and lands there; never outside the seekable ranges', () => {
  const at = 117.65;   // the skip's own second: three seconds before the drawn arrow (frame 3616)
  const ready = media(12);
  assert.equal(startWhenSeekable(ready, at), true); assert.equal(ready.currentTime, at, 'a film that can be sought: there at once');
  const past = media(130);
  assert.equal(startWhenSeekable(past, at), true); assert.equal(past.currentTime, 130, 'already past it: nothing sought, never back');
  const stream = media(3, {seekable: STREAM});
  assert.equal(startWhenSeekable(stream, at), false); assert.equal(stream.currentTime, 3, 'a server that ignores Range: nothing sought, as startAt');
  // the film's first moments: no metadata, no seekable range; the press waits for loadedmetadata, once
  const early = {...media(0, {ready: 0, seekable: []}), heard: [], addEventListener(type, f, o) { this.heard.push([type, o]); this.go = f; }};
  const said = [];
  assert.equal(startAt(early, at), false, 'what the press found before this lane: refused, and lost');
  assert.equal(startWhenSeekable(early, at, (put) => said.push(put)), 'waiting');
  assert.deepEqual(early.heard, [['loadedmetadata', {once: true}]], 'one wait, on the film\'s own metadata: no timer');
  assert.equal(early.currentTime, 0, 'nothing sought while it cannot be');
  Object.assign(early, {readyState: 1, seekable: ranges([[0, DUR]])}); early.go();
  assert.deepEqual(said, [true]); assert.equal(early.currentTime, at, 'its metadata in: the film is put where the press asked');
  const narrow = {...media(0, {ready: 0, seekable: []}), addEventListener(type, f) { this.go = f; }}, heard = [];
  startWhenSeekable(narrow, at, (put) => heard.push(put)); Object.assign(narrow, {readyState: 1, seekable: ranges([[0, 50]])}); narrow.go();
  assert.deepEqual([heard, narrow.currentTime], [[false], 0], 'metadata in but the second outside the seekable ranges: nothing sought, rule 5');
});
test('HER OFFER IS ONCE A BROWSER (his Nov 26 2026 "after the first visit, you dont show her saying take this egg anymore... that appearance of her is once per cookie"): the mint opened plain by a browser that saw her offer goes to Societies before anything plays; a door with its own address still opens the mint; her offer writes the cookie', () => { const page = readFileSync(here('./warm.html'), 'utf8'); assert.match(page, /if \(\/\(\?:\^\|;\\s\*\)am-intro=1\(\?:;\|\$\)\/\.test\(document\.cookie\) && !location\.search && \['', '#purpose'\]\.includes\(location\.hash\)\) location\.replace\('\.\/index\.html'\);/); assert.ok(page.indexOf('am-intro=1') < page.indexOf('<body'), 'in the head, before the film or her'); assert.doesNotMatch(readFileSync(here('./dl-twelve.js'), 'utf8'), /am-intro/, 'the film is never sought for it'); assert.match(readFileSync(here('./dl-athena.js'), 'utf8'), /if \(on\) try \{ doc\.cookie = 'am-intro=1; max-age=31536000; path=\/; samesite=lax'; \}/); });
