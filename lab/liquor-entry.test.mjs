import test from 'node:test';
import assert from 'node:assert/strict';
import {liquorEntry,ENTRY_SECONDS,CLEAR_AT,GROW_AT} from './liquor-entry.mjs';
import {createMint} from './mint-gravity.mjs';
import {liquorEntryMesh} from './liquor-entry-mesh.mjs';

test('the seed becomes completely transparent before any expansion', () => {
  for(let t=0;t<=CLEAR_AT;t+=.01) assert.equal(liquorEntry(t).growth,0);
  assert.deepEqual(liquorEntry(CLEAR_AT),{clarity:1,growth:0,background:1});
  assert.equal(liquorEntry(GROW_AT).growth,0);
  assert.deepEqual(liquorEntry(ENTRY_SECONDS),{clarity:1,growth:1,background:1});
  for(let t=0;t<ENTRY_SECONDS;t+=.01) {
    const a=liquorEntry(t),b=liquorEntry(t+.01);
    for(const key of Object.keys(a)) assert.ok(b[key]>=a[key]&&a[key]>=0&&b[key]<=1);
  }
});

test('material and growth arrive and leave with zero velocity and acceleration', () => {
  const h=.0001;
  for(const [key,start,end] of [['clarity',.15,CLEAR_AT],['growth',GROW_AT,ENTRY_SECONDS]]) {
    for(const t of [start,end]) {
      const a=liquorEntry(t-h)[key],b=liquorEntry(t)[key],c=liquorEntry(t+h)[key];
      assert.ok(Math.abs((c-a)/(2*h))<.00001);
      assert.ok(Math.abs((c-2*b+a)/(h*h))<.01);
    }
  }
});

test('the mesh lies exactly on both polyhedra and shared vertices stay joined during growth', () => {
  const mint=createMint(),seed=mint.layout();
  for(let i=0;i<3;i++)mint.expand();
  const target=mint.layout(),data=liquorEntryMesh(seed.skin,target.skin),shared=new Map();
  const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  const planes=seed.skin.pents.map(f=>({n:f.normal,d:dot(f.normal,f.center)}));
  const faces=[...target.skin.pents,...target.skin.hexes];
  assert.ok(data.length>0&&data.length%42===0);
  for(let i=0;i<data.length;i+=14){
    const a=Array.from(data.slice(i,i+3)),b=Array.from(data.slice(i+3,i+6)),face=faces[data[i+12]];
    assert.ok(a.every(Number.isFinite)&&b.every(Number.isFinite));
    assert.ok(planes.every(p=>dot(p.n,a)<=p.d+1e-6));
    assert.ok(planes.some(p=>Math.abs(dot(p.n,a)-p.d)<1e-6));
    // Goldberg corners lie on the sphere, so its original triangle fans are
    // slightly nonplanar. Preserve those triangles, not an invented face plane.
    assert.ok(face.verts.some((v,k)=>{
      const p=v.map((x,j)=>x-face.center[j]),q=face.verts[(k+1)%face.verts.length].map((x,j)=>x-face.center[j]);
      const n=[p[1]*q[2]-p[2]*q[1],p[2]*q[0]-p[0]*q[2],p[0]*q[1]-p[1]*q[0]];
      return Math.abs(dot(n,b.map((x,j)=>x-face.center[j])))/Math.hypot(...n)<1e-6;
    }));
    const key=b.map(x=>x.toFixed(5)).join(',');
    const previous=shared.get(key);
    if(previous)assert.ok(Math.hypot(...a.map((x,j)=>x-previous[j]))<1e-5,'a shared final vertex must have a shared starting vertex');
    shared.set(key,a);
  }
  for(const face of seed.skin.pents)for(const v of face.verts){
    assert.ok([...shared.values()].some(a=>Math.hypot(...a.map((x,j)=>x-v[j]))<1e-5),'every original corner must survive');
  }
});
