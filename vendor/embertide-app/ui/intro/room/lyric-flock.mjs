// lyric-flock.mjs · THE LYRIC FLOCK (Oct 13 2026 01:2x WEST). His words: "what if we mixed butterflies hyperefficient flying with lyrics karaoke flying
// through spatial computing environment". The song's words ride the house's butterflies through the room: each word of the line being sung on one
// butterfly of the flock (room/butterflies, NestBoard.html BUTTERFLY-CORE: the flight law stands, the words only ride it), dim until it is sung, lit
// while it is, the line fading out when the next begins. The same word on the same butterfly at the same instant on every glass, with no message
// between glasses: which butterfly carries a word is a hash of (the track, the line, the word), and when it is sung is a closed form of the song's place
// on the house clock (the lyrics ear's lines, activity/spotify/lyrics, embertide.lyrics/v0; the card's own position on the glass page).
//
// THE LAW is the text between LYRIC-FLOCK-CORE-BEGIN and -END below: pure (no DOM, no clock of its own), written in the Board's own dialect (var and
// function, nothing newer) because NestBoard.html carries it WORD FOR WORD in THE BUTTERFLIES: the iPad bundles that page and imports nothing, and
// flock-ar.mjs (the phone's AR flock on the glass page) runs the page's copy, read from the very text it already reads for the butterflies' law, so the
// words add no request. lyric-flock.test.mjs fails on one byte of drift between the two copies.
//   carriersOf(trackId, lineIndex, wordCount, flockSize) -> one butterfly index per word
//   wordTimes(line, nextLineT_ms, words) -> each word's onset (ms of the song)
//   lyricState(lyrics, elapsed_ms, flockSize[, last]) -> null | {lineIndex, t_on, t_off, words: [{text, t_on, carrier}], lit, fade, prev, keep}
// lfLineAt is lyrics-ear.mjs's lineAt, the same rule word for word: that file imports node:fs at its top and no glass can load it, so the rule is
// carried here and the test proves it equal to the ear's and to the card's (secret-base-live.html NowPlaying.lineAt) on every case it draws.
// COST: a line's words, onsets and carriers once per line (16 words at most); a frame, one binary search over the lines and a scan of 16 onsets.

  // LYRIC-FLOCK-CORE-BEGIN (pure: no DOM, no clock of its own; lyric-flock.mjs exports this very text, NestBoard.html carries it word for word, lyric-flock.test.mjs holds them equal)
  var LF = { schema: 'embertide.lyrics/v0', words: 16, chars: 32, tail_ms: 4000, fade_ms: 600, sung: .9, unit_ms: 120, weight: 2 };
  // the same 32 bits on every glass and in every engine: FNV-1a over the string's UTF-16 units, then murmur3's finalizer (the low bits spread too)
  function lfHash(s) {
    var h = 2166136261; s = String(s);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    h ^= h >>> 16; h = Math.imul(h, 0x85EBCA6B); h ^= h >>> 13; h = Math.imul(h, 0xC2B2AE35); h ^= h >>> 16;
    return h >>> 0;
  }
  function lfRest(text) { return !/\S/.test(text == null ? '' : String(text)); }   // an empty line is a rest: a line too, with no words
  // a line's words as they are sung: split on white space; more than LF.words are folded into LF.words labels (neighbours joined), each at most LF.chars
  function lfWords(text) {
    var all = String(text == null ? '' : text).split(/\s+/), w = [], out = [];
    for (var i = 0; i < all.length; i++) if (all[i]) w.push(all[i]);
    if (w.length <= LF.words) { for (var j = 0; j < w.length; j++) out.push(w[j].slice(0, LF.chars)); return out; }
    for (var k = 0; k < LF.words; k++) out.push(w.slice(Math.floor(k * w.length / LF.words), Math.floor((k + 1) * w.length / LF.words)).join(' ').slice(0, LF.chars));
    return out;
  }
  // lyrics-ear.mjs lineAt, the same rule: the index of the line being sung at e (the last whose time has come), -1 before the first
  function lfLineAt(lines, e) {
    if (!Array.isArray(lines) || typeof e !== 'number' || !isFinite(e)) return -1;
    var lo = 0, hi = lines.length - 1, at = -1;
    while (lo <= hi) { var mid = (lo + hi) >> 1; if (lines[mid].t_ms <= e) { at = mid; lo = mid + 1; } else hi = mid - 1; }
    return at;
  }
  // the song's place AS IT IS HEARD at `now` on the house clock: position + (now - stamp) while playing, the position alone otherwise, LESS `hear`, the
  // hold (the station's aligned_delay_ms: a sample captured at the Mac sounds in the room that much later, on every speaker, the Mac's own included);
  // never under 0, never past its length; null when unknown (the card's elapsedAt, the same rule; the Board's composer hands {state, position_ms,
  // stamp_ms, duration_ms} and hear_ms). THE WORDS LAGGED BY THE HOLD (Oct 15 2026, his "the lyrics of the spotify sessions are completely fucking out
  // of sync with the real actual playback of the words"): until this every glass lit a word at Spotify's own place, 0.7 to 1.8 s before the sound.
  function lyricElapsed(song, now, hear) {
    if (!song || typeof song !== 'object' || typeof song.position_ms !== 'number' || !isFinite(song.position_ms)) return null;
    var e = song.position_ms + (song.state === 'playing' && typeof song.stamp_ms === 'number' && isFinite(song.stamp_ms) ? Math.max(0, now - song.stamp_ms) : 0);
    e = Math.max(0, e - (typeof hear === 'number' && isFinite(hear) && hear > 0 ? hear : 0));
    return typeof song.duration_ms === 'number' && isFinite(song.duration_ms) ? Math.min(e, song.duration_ms) : e;
  }
  // -> one butterfly per word (its index in the flock bfEval flies), from the hash of (track, line, word): no butterfly twice in a line, one in each
  // stretch of the flock (the words spread through it). With 2 * LF.words butterflies or more a line rides every other one, by its parity, so the line
  // before, still fading, never shares a butterfly with it. A word past the flock's size has none (-1 in lyricState).
  function carriersOf(trackId, lineIndex, wordCount, flockSize) {
    var n = Math.floor(Number(flockSize)), k = Math.floor(Number(wordCount)), out = [];
    if (!(n > 0) || !(k > 0)) return out;
    var two = n >= 2 * LF.words ? 2 : 1, par = two === 2 ? Math.abs(Math.floor(Number(lineIndex)) || 0) % 2 : 0, m = two === 2 ? (n - par + 1) >> 1 : n;
    var key = String(trackId) + '\u0001' + lineIndex, rot = lfHash(key) % m;
    k = Math.min(k, m);
    for (var w = 0; w < k; w++) {
      var lo = Math.floor(w * m / k), hi = Math.floor((w + 1) * m / k);
      out.push(((lo + lfHash(key + '\u0001' + w) % (hi - lo) + rot) % m) * two + par);
    }
    return out;
  }
  // -> each word's onset (ms of the song) inside its line, spread by its length (karaoke's trick: LRCLIB times lines, not words). A word weighs its
  // letters and LF.weight more (a short word still takes a moment); the words are sung over LF.sung of the line's span and never slower than LF.unit_ms
  // a unit (a line held long is not stretched); the first word at the line's own time.
  function wordTimes(line, nextLineT_ms, words) {
    var t0 = line && typeof line.t_ms === 'number' ? line.t_ms : NaN, n = Array.isArray(words) ? words.length : 0, out = [];
    if (!n || !isFinite(t0)) return out;
    var end = typeof nextLineT_ms === 'number' && isFinite(nextLineT_ms) ? nextLineT_ms : t0 + LF.tail_ms, wt = [], total = 0;
    for (var i = 0; i < n; i++) { var x = String(words[i]).replace(/[\s!-\/:-@\[-`{-~‐-⁞]/g, '').length + LF.weight; wt.push(x); total += x; }
    var sung = Math.min(Math.max(0, end - t0) * LF.sung, total * LF.unit_ms), at = 0;
    for (var j = 0; j < n; j++) { out.push(Math.round(t0 + sung * at / total)); at += wt[j]; }
    return out;
  }
  // line s as the flock carries it: {lineIndex, t_on, t_off, words: [{text, t_on, carrier}]}, or null for a rest. It ends where the next line begins;
  // the last ends at the song's length, or LF.tail_ms after it begins when the length is unknown.
  function lyricLine(lyrics, s, flockSize) {
    var lines = lyrics.lines, line = lines[s], words = line ? lfWords(line.text) : [];
    if (!words.length) return null;
    var d = lyrics.duration_ms, next = s + 1 < lines.length ? lines[s + 1].t_ms : typeof d === 'number' && isFinite(d) && d > line.t_ms ? d : line.t_ms + LF.tail_ms;
    var on = wordTimes(line, next, words), by = carriersOf(lyrics.track_id, s, words.length, flockSize), out = [];
    for (var w = 0; w < words.length; w++) out.push({ text: words[w], t_on: on[w], carrier: w < by.length ? by[w] : -1 });
    return { lineIndex: s, t_on: line.t_ms, t_off: next, words: out };
  }
  // The words at one instant of the song (elapsed_ms: its place, as the card has it). null without synced words (status found) or before the first line
  // that has words; else {lineIndex, t_on, t_off, words, lit: the word being sung (-1 once the line is over), fade: 0..1 after the line ends (a rest or
  // the song's end follows it), prev: the line before, {lineIndex, t_off, words, fade}, fading out over LF.fade_ms once this one began (else null),
  // keep: what the next frame reuses}. Hand back the answer of the frame before as `last`: while the line stands its words, onsets and carriers are kept.
  function lyricState(lyrics, elapsed_ms, flockSize, last) {
    if (!lyrics || typeof lyrics !== 'object' || lyrics.status !== 'found' || lyrics.synced !== true || !Array.isArray(lyrics.lines)) return null;
    var lines = lyrics.lines, e = elapsed_ms, i = lfLineAt(lines, e);
    if (i < 0) return null;
    var k = last && last.keep, same = !!k && k.of === lyrics && k.n === flockSize && k.i === i, cur = same ? k.cur : null, before = same ? k.before : null;
    if (!same) {
      var s = i; while (s >= 0 && lfRest(lines[s].text)) s--;   // a rest: the worded line before it fades out
      if (s < 0) return null;
      cur = lyricLine(lyrics, s, flockSize);
      before = s === i && s > 0 && !lfRest(lines[s - 1].text) ? lyricLine(lyrics, s - 1, flockSize) : null;
    }
    var fade = e < cur.t_off ? 0 : Math.min(1, (e - cur.t_off) / LF.fade_ms), lit = -1, pf = before ? (e - cur.t_on) / LF.fade_ms : 1;
    if (e < cur.t_off) for (var w = cur.words.length - 1; w >= 0; w--) if (cur.words[w].t_on <= e) { lit = w; break; }
    return { lineIndex: cur.lineIndex, t_on: cur.t_on, t_off: cur.t_off, words: cur.words, lit: lit, fade: fade,
      prev: before && pf < 1 ? { lineIndex: before.lineIndex, t_off: before.t_off, words: before.words, fade: Math.max(0, pf) } : null,
      keep: { of: lyrics, n: flockSize, i: i, cur: cur, before: before } };
  }
  // LYRIC-FLOCK-CORE-END

export { LF, lfHash, lfRest, lfWords, lfLineAt, lyricElapsed, carriersOf, wordTimes, lyricLine, lyricState };
