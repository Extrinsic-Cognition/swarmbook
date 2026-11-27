// hades-disc-read.test.mjs: the PowerShell it sends and the checks on what comes back, on answers made here (nothing reaches pelino).
// node --test tools/hades-disc-read.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {FILES, IMAGE, AFS_AT, filesFromTable, script, encoded, collect} from './hades-disc-read.mjs';

test('the table of the four characters: six files a fighter, five hers, each with its index, place, size and first bytes', () => {
  for (const who of ['00', '04', '15']) {
    assert.deepEqual(Object.keys(FILES[who]), [`${who}.gmi`, `${who}h.gmi`, `m${who}.mpl`, `${who}.mpl`, `tex-${who}.tpl`, `tex-${who}_face.tpl`]);
    assert.equal(FILES[who][`${who}.gmi`][3].slice(0, 8), '434d5053', 'the body is CMPS-wrapped');
    assert.equal(FILES[who][`${who}h.gmi`][3].slice(0, 8), '19030420', 'the hair is a plain .gmi');
  }
  assert.equal(Object.keys(FILES.e00).length, 5);
  assert.equal(AFS_AT, 155023360); assert.ok(IMAGE.endsWith('SLES_541.62.SaintSeiyaTheHades.iso'));
});

test('the script reads a flat list, bounds itself, closes the image in a finally, and holds no backtick and no ampersand', () => {
  const s = script(FILES['00'], 45);
  assert.ok(s.includes('$t = @(246,272078848,79889,248,273207296,102348,'), 'a flat list: a one-entry list of lists would be unrolled');
  assert.ok(s.includes('[System.IO.FileShare]::ReadWrite'), 'PCSX2 holds the file');
  assert.ok(s.includes('-gt 45) { throw'), 'its own time limit');
  assert.ok(/finally \{ \$f\.Close\(\) \}/.test(s));
  assert.ok(!s.includes('`') && !s.includes('&'), 'no backtick (lost in a heredoc), no ampersand (refused by the parser)');
  assert.equal(Buffer.from(encoded(s), 'base64').toString('utf16le'), s, 'UTF-16LE in base64, as -EncodedCommand wants');
});

test('collect joins the pieces of each entry and checks its size and first bytes against the table', () => {
  const body = Buffer.alloc(40, 7); Buffer.from('434d505301000000e493030000000000', 'hex').copy(body);
  const entries = {'x.gmi': [246, 0, 40, body.subarray(0, 16).toString('hex')]};
  const answer = (b) => [`E 246 0 16 ${b.subarray(0, 16).toString('base64')}`, `E 246 16 24 ${b.subarray(16).toString('base64')}`, 'END 12'].join('\r\n');
  const {files, ms} = collect(answer(body), entries);
  assert.ok(files['x.gmi'].equals(body)); assert.equal(ms, 12);
  const wrong = Buffer.from(body); wrong[3] = 0;
  assert.throws(() => collect(answer(wrong), entries), /first bytes 434d5000/);
  assert.throws(() => collect(answer(body).replace('END 12', ''), entries), /no END line/);
  assert.throws(() => collect(answer(body).split('\r\n').slice(1).join('\n'), entries), /24 bytes, the table says 40/);
  assert.throws(() => collect('E 246 0 16 QUJD\nEND 1', entries), /3 bytes decoded, 16 announced/);
});

test('filesFromTable: any other fighter by its names, each at its lowest index (TEX before the TEXH copies)', () => {
  const rows = [[803, 9, 9, '07.tpl', 'b'], [601, 1, 2, '07.tpl', 'a'], [263, 3, 4, '07.gmi', 'c'], [266, 5, 6, '07h.gmi', 'd'], [529, 7, 8, 'm07.mpl', 'e'], [264, 9, 10, '07.mpl', 'f'], [602, 11, 12, '07_FACE.TPL', 'g']];
  const f = filesFromTable(rows, '07');
  assert.deepEqual(f['tex-07.tpl'], [601, 1, 2, 'a']);
  assert.deepEqual(Object.keys(f).sort(), ['07.gmi', '07.mpl', '07h.gmi', 'm07.mpl', 'tex-07.tpl', 'tex-07_face.tpl']);
});
