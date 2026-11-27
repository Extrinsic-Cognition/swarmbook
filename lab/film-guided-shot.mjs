// Read-only direction for the extracted asset. All time is the source film's time.
import {SHOTS, shotOf} from './cubism.mjs';
import {eyeOf} from './braindance.mjs';

export function guidedShot(record, t) {
  const index = shotOf(t);
  if (index < 0) return null;
  const track = record.entities?.athena?.tracks?.[0];
  const anchor = track?.measured?.shots?.find(s => s.shot === 'A');
  const shoulder = record.camera?.find(s => s.name === SHOTS[0].name);
  const face = record.camera?.find(s => s.name === SHOTS[1].name);
  // The column returns to the shoulder camera. Its unmeasured prior is not a new camera.
  const camera = eyeOf(index === 1 ? face : shoulder);
  if (!anchor || !camera?.measured || !camera.up) return null;
  return {
    index, frame: Math.floor(t * 30000 / 1001 + 1e-6),
    camera, feet: anchor.mu, yaw: Math.PI,
    // braindance.measure.mjs applies the -1.49 m head-to-feet offset before writing this mu.
    start: SHOTS[index].frames[0] * 1001 / 30000,
    end: SHOTS[index].frames[1] * 1001 / 30000,
  };
}

// A late download may join only at a cut. A paused film never acquires a new actor mid-shot.
export function makeShotAdmission() {
  let shot = null, admitted = false;
  return (plan, ready) => {
    if (!plan) { shot = null; admitted = false; return false; }
    if (shot !== plan.index) { shot = plan.index; admitted = ready; }
    return admitted;
  };
}

// An authored 3D interpretation of the film's staging, deliberately not a pixel fit.
// The same elevated actor, shoulder / face / light-column cuts and one source clock.
export function stageDirection(plan,t) {
  const p=plan.feet, add=(v)=>v.map((x,i)=>x+p[i]);
  const u=Math.max(0,Math.min(1,(t-plan.start)/(plan.end-plan.start)));
  const ease=u*u*(3-2*u),face=plan.index===1;
  const gold=plan.index===2?Math.min(1,Math.max(0,(t-plan.start)/.65)):0;
  return {
    eye:add(face?[.65-.08*ease,1.48,-1.13+.04*ease]:[-1.5+.18*ease,2.8,3.3-.2*ease]),
    look:face?add([0,1.35,0]):[2.4,3.2,3.5],
    fov:face?34:48,
    head:-.06-.08*(face?ease:0),chest:.012*Math.sin(t*1.4),wind:face?.7:1.25,
    gold,width:.25+gold*1.15,
  };
}
