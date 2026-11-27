import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {guidedShot,stageDirection,makeShotAdmission} from './film-guided-shot.mjs';
const record=JSON.parse(readFileSync(new URL('./braindance.json',import.meta.url)));
test('the native sequence keeps the source cut frames and ends exactly at the next cut',()=>{
  assert.equal(guidedShot(record,885*1001/30000),null);
  assert.equal(guidedShot(record,886*1001/30000).index,0);
  assert.equal(guidedShot(record,1006*1001/30000).index,1);
  assert.equal(guidedShot(record,1096*1001/30000).index,2);
  assert.equal(guidedShot(record,1141*1001/30000),null);
});
test('Athena keeps one measured feet anchor across the three directed shots',()=>{
  for(const t of [30,35,37])assert.deepEqual(guidedShot(record,t).feet,[4.879,4.875,7.651]);
});
test('late asset load never changes a held shot; the next cut admits it',()=>{
  const admit=makeShotAdmission();assert.equal(admit({index:0},false),false);
  assert.equal(admit({index:0},true),false);assert.equal(admit({index:1},true),true);
  assert.equal(admit(null,true),false);assert.equal(admit({index:0},true),true);
});
test('rig and light are pure samples of film time, including backward seeks',()=>{
  const sample=t=>stageDirection(guidedShot(record,t),t);
  const held=sample(37.08705);sample(37.9);sample(30);assert.deepEqual(sample(37.08705),held);
  assert.equal(sample(35).gold,0);assert.ok(held.gold>0);
  for(const t of [29.563,31,33.567,35,36.57,37.08705]){
    const d=sample(t);assert.ok([...d.eye,...d.look,d.head,d.chest,d.wind,d.gold,d.width].every(Number.isFinite));
  }
});
