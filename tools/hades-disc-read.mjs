#!/usr/bin/env node
// hades-disc-read.mjs: ONE FIGHTER'S FILES OFF THE HADES DISC ON PELINO, read-only, into a folder of this Mac's (his words, Oct 14 2026 14:2x WEST:
// "there is a reason why i got hades installed on pelino dude come on"). The disc image is only on pelino since Oct 14
// (C:\Embers\pcsx2\SLES_541.62.SaintSeiyaTheHades.iso, 2,101,510,144 B; PCSX2 holds it, so it is opened with FileShare ReadWrite). Its AFS
// archive DATA/AFSDATA.AFS starts at image byte 155,023,360; each entry below is [archive index, offset in the archive, size, first 16 bytes]
// as the Oct 4 scout's table holds it (~/code/the-disc-rigs-2026-10-04/scout/afs-table.json, 13,208 entries).
//
//   node hades-disc-read.mjs --who 00 --out <dir>   [--host pelino] [--limit 60] [--table afs-table.json]
//
// One ssh, one PowerShell given as -EncodedCommand (UTF-16LE, base64: fed on stdin PowerShell drops its loops), which seeks and reads each
// entry, prints it as base64 lines 'E <index> <at> <n> <b64>' (256 KB a line) and bounds itself (it throws past --limit seconds; the ssh
// child is killed at --limit + 10). Nothing is written on pelino and nothing stays there. Every file's size and first 16 bytes are checked
// against the table before it is written here, under the names hades-glb.mjs reads: NN.gmi, NNh.gmi, mNN.mpl, NN.mpl, tex-NN.tpl,
// tex-NN_face.tpl. The files are third-party game assets. The Oct 15 2026 user-authorized private handoff bundles these 23 chunks in
// assets/native-source; its rebuild command needs no SSH or disc. This is a scoped exception, not a change to the general mirror policy.
// COST: 2.0 MB a fighter (2.7 MB of base64 on the wire), one ssh (about 5 to 15 s here).
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';

export const IMAGE = 'C:\\Embers\\pcsx2\\SLES_541.62.SaintSeiyaTheHades.iso', AFS_AT = 155023360;

/** The entries of the four characters read so far: [index, archive offset, size, first 16 bytes hex] per file name. */
export const FILES = {
  '00': {'00.gmi': [246, 272078848, 79889, '434d505301000000e493030000000000'], '00h.gmi': [248, 273207296, 102348, '19030420cc8f01001000000000000000'],
    'm00.mpl': [525, 336179200, 12992, '464a46000100004020000000c0320000'], '00.mpl': [247, 272160768, 1045344, '464a460049000040d0010000403e0000'],
    'tex-00.tpl': [585, 337068032, 280720, '464a4600020000001000000050040400'], 'tex-00_face.tpl': [586, 337350656, 459264, '464a4600070000004000000080000100']},
  '04': {'04.gmi': [263, 277428224, 87544, '434d50530100000054f9030000000000'], '04h.gmi': [266, 278583296, 103672, '19030420f89401001000000000000000'],
    'm04.mpl': [529, 336240640, 14656, '464a4600010000402000000040390000'], '04.mpl': [264, 277516288, 1063104, '464a460048000040c001000020400000'],
    'tex-04.tpl': [601, 342556672, 280720, '464a4600020000001000000050040400'], 'tex-04_face.tpl': [602, 342839296, 459264, '464a4600070000004000000080000100']},
  '15': {'15.gmi': [310, 291698688, 91628, '434d5053010000008433040000000000'], '15h.gmi': [312, 292861952, 85884, '190304207c4f01001000000000000000'],
    'm15.mpl': [540, 336406528, 14608, '464a4600010000402000000010390000'], '15.mpl': [311, 291790848, 1070272, '464a460049000040d0010000c03f0000'],
    'tex-15.tpl': [645, 357928960, 280720, '464a4600020000001000000050040400'], 'tex-15_face.tpl': [646, 358211584, 459264, '464a4600070000004000000080000100']},
  'e00': {'e00.gmi': [495, 334485504, 62596, '434d50530100000038da020000000000'], 'e00h.gmi': [496, 334548992, 121856, '1903042000dc01001000000000000000'],
    'me00.mpl': [574, 336916480, 17728, '464a4600010000402000000040450000'],
    'tex-e00.tpl': [783, 401276928, 263248, '464a4600010000001000000000000000'], 'tex-e00_face.tpl': [784, 401541120, 393648, '464a4600060000003000000070000100']},
};

/** Any other character's files from the scout's table: each name at its lowest index (CHARACTER\TEX comes before the TEXH low copies). */
export function filesFromTable(rows, who) {
  const want = {[`${who}.gmi`]: `${who}.gmi`, [`${who}h.gmi`]: `${who}h.gmi`, [`m${who}.mpl`]: `m${who}.mpl`, [`${who}.mpl`]: `${who}.mpl`,
    [`${who}.tpl`]: `tex-${who}.tpl`, [`${who}_face.tpl`]: `tex-${who}_face.tpl`};
  const out = {};
  for (const [index, offset, size, name, head] of [...rows].sort((a, b) => a[0] - b[0])) {
    const file = want[String(name).toLowerCase()];
    if (file && !out[file]) out[file] = [index, offset, size, head];
  }
  return out;
}

/** The PowerShell that reads them: a flat list (a one-entry list of lists would be unrolled), no backtick, no '&'. */
export function script(entries, limitS = 60) {
  const flat = Object.values(entries).flatMap(([i, o, n]) => [i, o, n]).join(',');
  return [
    "$ErrorActionPreference = 'Stop'",
    `$t = @(${flat})`,
    '$w = [Diagnostics.Stopwatch]::StartNew()',
    `$f = [System.IO.File]::Open('${IMAGE}', [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)`,
    'try {',
    '  for ($j = 0; $j -lt $t.Count; $j += 3) {',
    '    $i = $t[$j]; $n = [int]$t[$j + 2]; $buf = New-Object byte[] $n; $got = 0',
    `    [void]$f.Seek([int64]${AFS_AT} + [int64]$t[$j + 1], [System.IO.SeekOrigin]::Begin)`,
    '    while ($got -lt $n) { $r = $f.Read($buf, $got, $n - $got); if ($r -le 0) { break }; $got += $r',
    `      if ($w.Elapsed.TotalSeconds -gt ${limitS}) { throw 'past the limit' } }`,
    '    for ($at = 0; $at -lt $got; $at += 262144) { $k = [Math]::Min(262144, $got - $at)',
    "      [Console]::Out.WriteLine('E ' + $i + ' ' + $at + ' ' + $k + ' ' + [Convert]::ToBase64String($buf, $at, $k)) }",
    "    if ($got -eq 0) { [Console]::Out.WriteLine('E ' + $i + ' 0 0 ') }",
    '  }',
    '} finally { $f.Close() }',
    "[Console]::Out.WriteLine('END ' + [int]$w.Elapsed.TotalMilliseconds)",
  ].join('\n');
}
export const encoded = (text) => Buffer.from(text, 'utf16le').toString('base64');

/** The answer's lines -> {file name: Buffer}, each checked against its entry's size and first 16 bytes; throws on any difference. */
export function collect(text, entries) {
  const parts = new Map();
  let end = null;
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith('END ')) { end = Number(line.slice(4)); continue; }
    const m = /^E (\d+) (\d+) (\d+) ?(.*)$/.exec(line);
    if (!m) continue;
    const [, index, at, n, b64] = m, bytes = Buffer.from(b64, 'base64');
    if (bytes.length !== Number(n)) throw new Error(`entry ${index} at ${at}: ${bytes.length} bytes decoded, ${n} announced`);
    if (!parts.has(Number(index))) parts.set(Number(index), []);
    parts.get(Number(index)).push([Number(at), bytes]);
  }
  if (end === null) throw new Error('the answer has no END line: the read did not finish');
  const files = {};
  for (const [file, [index, , size, head]] of Object.entries(entries)) {
    const got = (parts.get(index) || []).sort((a, b) => a[0] - b[0]);
    const b = Buffer.concat(got.map(([, x]) => x));
    if (b.length !== size) throw new Error(`${file} (entry ${index}): ${b.length} bytes, the table says ${size}`);
    if (b.subarray(0, 16).toString('hex') !== head) throw new Error(`${file} (entry ${index}): first bytes ${b.subarray(0, 16).toString('hex')}, the table says ${head}`);
    files[file] = b;
  }
  return {files, ms: end};
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
  const who = String(arg('--who', '')).toLowerCase(), out = arg('--out'), host = arg('--host', 'pelino'), limitS = Number(arg('--limit', 60));
  const entries = FILES[who] ?? (arg('--table') ? filesFromTable(JSON.parse(fs.readFileSync(arg('--table'), 'utf8')), who) : null);
  if (!who || !out || !entries || Object.keys(entries).length < 5) {
    console.error('node hades-disc-read.mjs --who 00|04|15|e00 --out <dir> [--host pelino] [--limit 60] [--table afs-table.json for any other]');
    process.exit(2);
  }
  const t0 = performance.now();
  const child = spawn('ssh', ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', host, 'powershell', '-NoProfile', '-EncodedCommand', encoded(script(entries, limitS))],
    {stdio: ['ignore', 'pipe', 'pipe'], timeout: (limitS + 10) * 1000, killSignal: 'SIGKILL'});
  const chunks = [], err = [];
  child.stdout.on('data', (c) => chunks.push(c));
  child.stderr.on('data', (c) => err.push(c));
  child.on('close', (code, sig) => {
    const text = Buffer.concat(chunks).toString('latin1');
    try {
      const {files, ms} = collect(text, entries);
      fs.mkdirSync(out, {recursive: true});
      for (const [name, b] of Object.entries(files)) fs.writeFileSync(path.join(out, name), b);
      console.log(JSON.stringify({who, out, files: Object.fromEntries(Object.entries(files).map(([k, b]) => [k, b.length])),
        bytes: Object.values(files).reduce((a, b) => a + b.length, 0), wire: text.length, pelino_ms: ms, ms: Math.round(performance.now() - t0), code, sig}));
    } catch (e) {
      console.error(`${e.message} (ssh exit ${code}${sig ? ', ' + sig : ''}; stderr: ${Buffer.concat(err).toString('latin1').slice(0, 400)})`);
      process.exit(1);
    }
  });
}
