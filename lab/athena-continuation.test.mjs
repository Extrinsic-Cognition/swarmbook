import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildAssemblySkin} from '../app/assembly-geometry.js';
import {herPlane, pictureAtRay, project, squareAt} from './cubism.mjs';
import {registeredFit, carryPoint, continuationAt, HEAD_MARK} from './athena-continuation.mjs';

const faces = buildAssemblySkin(0).pents;
test('native silhouette retains its film coordinates through every face, rotation and zoom', () => {
  for (let root = 0; root < faces.length; root++) {
    const fit = registeredFit(faces, root);
    for (const point of [[.2, .3, .5], [-.1, -.7, 1.1], [.8, -.5, -.2]]) {
      const expected = squareAt(...project(point, [0, 0], 1), fit.decal);
      for (const yaw of [0, .7, 2.3]) for (const zoom of [1, 2, 4]) {
        const plane = herPlane(faces[root], {yaw, pitch: -.12}), join = [.815, -.556];
        const p = carryPoint(point, fit, plane, {join, zoom});
        const actual = pictureAtRay(p, plane, {join, z: zoom});
        assert.ok(Math.abs(actual.u - expected[0]) < 1e-9);
        assert.ok(Math.abs(actual.v - expected[1]) < 1e-9);
      }
    }
  }
});

test('the recovered camera joins the cranium mark, not the rig neck', () => {
  const record = JSON.parse(readFileSync(new URL('./braindance.json',import.meta.url)));
  const fit = registeredFit(faces,9,record), M = fit.matrix, head = [0,1.52,.02];
  const p = [0,1,2].map(i=>M[i*4]*head[0]+M[i*4+1]*head[1]+M[i*4+2]*head[2]+M[i*4+3]);
  const uv = squareAt(...project(p,[0,0],1),fit.decal);
  assert.ok(uv.every((x,i)=>Math.abs(x-HEAD_MARK[i]) < 1e-10));
  assert.deepEqual(registeredFit(faces,2,record),fit,'changing the carrying face must not change her camera');
});

test('no stray back-view figure during the face closeup or before the plane joins', () => {
  for(const t of [0,29.9,33.567,34,36.5,37.6,38.1]) assert.equal(continuationAt(t),0);
  for(const t of [30.5,32.5,36.8,37.13]) assert.equal(continuationAt(t),1);
  assert.ok(continuationAt(30.35)>0 && continuationAt(30.35)<1);
  assert.ok(continuationAt(37.4)>0 && continuationAt(37.4)<1);
});
