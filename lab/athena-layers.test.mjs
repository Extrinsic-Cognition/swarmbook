import {test} from 'node:test';
import assert from 'node:assert/strict';
import {matteFrame, LAYERS} from './athena-layers.mjs';

test('mattes are locked to the exact decoded frame, including scrubbing across cuts', () => {
  const seconds = f => f*1001/30000;
  for (let f=886; f<1006; f++) assert.equal(matteFrame(seconds(f)),f-886);
  for (let f=1096; f<1127; f++) assert.equal(matteFrame(seconds(f)),f-1096+120);
  assert.equal(matteFrame(seconds(1006)),-2); // face shot belongs to Athena
  assert.equal(matteFrame(seconds(885)),-1);
  assert.equal(matteFrame(seconds(1127)),-1);
  assert.equal(matteFrame(seconds(886)),0); // return seek has no history
});

test('three premultiplied layers reproduce the picture without dark strand seams', () => {
  assert.deepEqual(LAYERS,['terrain','fighters','athena-hair']);
  for (const [a,f] of [[0,0],[1,0],[0,1],[.37,.18],[.9,.1]]) {
    const masks=[1-a-f,f,a], rgb=[.32,.71,.55];
    const rebuilt=rgb.map(c=>masks.reduce((s,m)=>s+c*m,0));
    rebuilt.forEach((c,i)=>assert.ok(Math.abs(c-rgb[i])<1e-12));
  }
});
