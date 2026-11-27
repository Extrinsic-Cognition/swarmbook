#!/usr/bin/env node
// Reproduce the four native GLBs from the bundled chunks into a new scratch directory. No packages, network or disc required.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {FILES} from './hades-disc-read.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(project, 'assets/native-source');
const specs = [
  {name: 'athena', who: 'e00', height: '1.6'},
  {name: 'seiya', who: '00', height: '1.65'},
  {name: 'ikki', who: '04', height: '1.65'},
  {name: 'seiya-sagittarius', who: '15', height: '1.65'},
];
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const usage = 'node tools/rebuild-native-assets.mjs --out <new-scratch-directory>';

try {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    console.log(`${usage}\nThe directory must not exist. Its parent must exist. All four outputs are checked against lab/*.hades.glb.`);
    process.exit(0);
  }
  if (args.length !== 2 || args[0] !== '--out' || !args[1]) throw new Error(usage);
  const out = path.resolve(args[1]);
  if (fs.existsSync(out)) throw new Error(`Output directory already exists; choose a new scratch directory: ${out}`);
  const started = performance.now();
  let sourceFiles = 0;
  for (const spec of specs) {
    for (const [file, [, , size, head]] of Object.entries(FILES[spec.who])) {
      const bytes = fs.readFileSync(path.join(source, file));
      if (bytes.length !== size || bytes.subarray(0, 16).toString('hex') !== head) throw new Error(`Source chunk does not match the extraction table: ${file}`);
      sourceFiles++;
    }
  }
  fs.mkdirSync(out); // Exclusive directory creation prevents overwriting the bundled assets or an earlier rebuild.
  const models = [];
  for (const {name, who, height} of specs) {
    const file = `${name}.hades.glb`, destination = path.join(out, file), athena = who === 'e00';
    const options = [path.join(project, 'tools/hades-glb.mjs'), '--disc', source, '--out', destination,
      '--who', who, '--name', name, '--height', height, '--face', athena ? '3' : 'none', '--clips', athena ? 'none' : 'all'];
    if (athena) options.push('--faces', '0,5', '--stance', path.join(project, 'lab/athena.hades.stance.json'));
    else options.push('--pose', '0', '--loops', path.join(source, 'loops-by-code.json'));
    const run = spawnSync(process.execPath, options, {encoding: 'utf8', timeout: 30000, maxBuffer: 4 * 1024 * 1024});
    if (run.error || run.status !== 0) throw new Error(`${name}: ${run.error?.message || run.stderr || `converter exited ${run.status}`}`);
    const actual = fs.readFileSync(destination), bundled = fs.readFileSync(path.join(project, 'lab', file));
    const actualHash = sha256(actual), bundledHash = sha256(bundled);
    if (!actual.equals(bundled)) throw new Error(`${file} differs from the bundled model: rebuilt ${actualHash}, bundled ${bundledHash}. Outputs remain in ${out}.`);
    models.push({file, bytes: actual.length, sha256: actualHash, byteIdentical: true});
  }
  console.log(JSON.stringify({out, sourceFiles, models, elapsedMs: Math.round(performance.now() - started)}, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
