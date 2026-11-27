import test from 'node:test';
import assert from 'node:assert/strict';
import { planeMatrix, jumpPoint } from './tracenet-projection.mjs';

test('the interactive display lands on all four corners through a perspective camera', () => {
  const corners = [{x:491,y:76},{x:921,y:168},{x:881,y:344},{x:495,y:275}];
  const m = planeMatrix(corners, 1000, 540);
  for (const [i, [x, y]] of [[0,0],[1000,0],[1000,540],[0,540]].entries()) {
    const w = m[3] * x + m[7] * y + m[15];
    assert.ok(Math.abs((m[0]*x+m[4]*y+m[12])/w-corners[i].x)<1e-8);
    assert.ok(Math.abs((m[1]*x+m[5]*y+m[13])/w-corners[i].y)<1e-8);
  }
});

test('an edge-on or zero-sized display produces no invalid CSS transform', () => {
  const edge = [0,1,2,3].map(x => ({x,y:0}));
  assert.equal(planeMatrix(edge,1000,540),null);
  assert.equal(planeMatrix([{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}],0,540),null);
});

test('a jump leaves and lands at the key coordinates with height between them', () => {
  const from = {x:-3,y:.675,z:-2}, to = {x:2,y:.675,z:1};
  assert.deepEqual(jumpPoint(from,to,0),from);
  const end = jumpPoint(from,to,1); assert.ok(Math.abs(end.y-to.y)<1e-10);
  assert.equal(end.x,to.x); assert.equal(end.z,to.z);
  assert.ok(jumpPoint(from,to,.5).y>from.y+1);
  assert.deepEqual(jumpPoint(from,to,-1),from);
});
