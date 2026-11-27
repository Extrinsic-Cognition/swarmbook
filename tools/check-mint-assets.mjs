#!/usr/bin/env node
// Verify the private mint handoff from repository bytes, without the Nest or a network.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root = fileURLToPath(new URL('../../../../../', import.meta.url));
const manifest = JSON.parse(fs.readFileSync(new URL('../assets/mint-assets.json', import.meta.url)));
const failures = [], seen = new Set();
let bytes = 0, nativeModels = 0;
for (const entry of manifest.files) {
  if (seen.has(entry.path) || path.isAbsolute(entry.path) || entry.path.split('/').includes('..')) {
    failures.push(`Invalid or duplicate path: ${entry.path}`); continue;
  }
  seen.add(entry.path);
  const file = path.join(root, entry.path);
  try {
    if (fs.lstatSync(file).isSymbolicLink()) throw new Error('asset is a symlink');
    const data = fs.readFileSync(file);
    if (data.length !== entry.bytes) throw new Error('byte length differs');
    if (createHash('sha256').update(data).digest('hex') !== entry.sha256) throw new Error('SHA-256 differs');
    bytes += data.length;
    if (entry.category === 'native-model') {
      if (data.toString('ascii', 0, 4) !== 'glTF' || data.readUInt32LE(8) !== data.length) throw new Error('invalid GLB');
      const document = JSON.parse(data.toString('utf8', 20, 20 + data.readUInt32LE(12)).trim());
      if ([...(document.buffers ?? []), ...(document.images ?? [])].some(item => item.uri)) throw new Error('GLB has an external dependency');
      if (!document.skins?.length || !document.meshes?.length) throw new Error('native model lacks skin or geometry');
      nativeModels++;
    }
  } catch (error) { failures.push(`${entry.path}: ${error.message}`); }
}
if (bytes !== manifest.totalBytes) failures.push('total byte count differs');
if (nativeModels !== 4) failures.push(`Expected four native models; found ${nativeModels}`);
if (failures.length) {
  console.error(failures.join('\n')); process.exitCode = 1;
} else {
  console.log(`PASS: ${seen.size} bundled assets, ${bytes} bytes, four self-contained native GLBs.`);
}
