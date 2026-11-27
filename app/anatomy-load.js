// Seeded illustration of variable transit and a brief local slowdown.
// No real network state; rewind uses the same id to recover the same motion.
const clamp=x=>Math.max(0,Math.min(1,x));
export const LOAD_EPS=1e-9;
function unit(id){
  let hash=2166136261;
  for(const char of String(id)){hash^=char.codePointAt(0);hash=Math.imul(hash,16777619);}
  hash^=hash>>>16;hash=Math.imul(hash,0x7feb352d);hash^=hash>>>15;
  hash=Math.imul(hash,0x846ca68b);hash^=hash>>>16;
  return (hash>>>0)/4294967295;
}
export function loadDelay(id,base=.4,spread=.22){
  if(!Number.isFinite(base)||base<=0||!Number.isFinite(spread)||spread<0||spread>=2*base)
    throw new RangeError('A flight needs a positive bounded duration');
  return base+(unit(id)-.5)*spread;
}
export function flightProgress(local,{id,start,end}){
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)throw new RangeError('A flight must end after it starts');
  if(Number.isNaN(local))return 0;
  if(local+LOAD_EPS>=end)return 1;
  if(local<=start+LOAD_EPS)return 0;
  const u=clamp((local-start)/(end-start));
  const slowAt=.18+unit(id+':position')*.4,width=.14+unit(id+':width')*.1;
  const speed=.2+unit(id+':speed')*.2;
  const slowTravel=Math.max(0,Math.min(width,u-slowAt));
  return (u-(1-speed)*slowTravel)/(1-(1-speed)*width);
}
