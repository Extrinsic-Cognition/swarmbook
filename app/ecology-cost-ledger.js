// An illustrative accounting comparison, not measured prices or saved compute.
// A published result costs one relative unit. A checked reuse costs one tenth,
// including retrieval and verification, and is assumed to serve a repeated task.
export const COMPUTE_COST=1, REUSE_COST=.1, HISTORY_LIMIT=96;
const occurred=(seconds,first,period)=>seconds<first?0:Math.floor((seconds-first)/period)+1;

export function costSnapshot(seconds,model) {
  seconds=Math.max(0,seconds);
  let published=0,reused=0;
  for(const stream of model.streams) {
    published+=occurred(seconds,stream.firstAt+stream.publishAt,stream.period);
    for(const hop of stream.hops)reused+=occurred(seconds,stream.firstAt+hop.verifiedAt,stream.period);
  }
  const completed=published+reused,withReuseTotal=published*COMPUTE_COST+reused*REUSE_COST,
    recomputeTotal=completed*COMPUTE_COST;
  return {seconds,published,reused,completed,baseline:COMPUTE_COST,
    relativeCollectiveCost:completed?withReuseTotal/recomputeTotal:null,
    average:completed?withReuseTotal/completed:null,withReuseTotal,recomputeTotal};
}

export function costHistory(seconds,model) {
  seconds=Math.max(0,seconds);
  const earlyEnd=Math.min(8,seconds),times=[];
  // Keep the initial descent visible for the whole session. Later samples span
  // the rest of the run; no old generations are enumerated or retained in RAM.
  for(let i=0;i<24;i++)times.push(earlyEnd*i/23);
  if(seconds>8)for(let i=1;i<=72;i++)times.push(8+(seconds-8)*i/72);
  times[times.length-1]=seconds;
  const points=[];
  for(const at of times) {
    const state=costSnapshot(Math.min(seconds,at),model);
    if(!state.completed)continue;
    const point={seconds:state.seconds,completed:state.completed,average:state.average,relativeCollectiveCost:state.relativeCollectiveCost};
    // Repeated samples of the same completed-event count are one point; retain
    // the later timestamp so the final point always represents the exact now.
    if(points.at(-1)?.completed===point.completed)points[points.length-1]=point;
    else points.push(point);
  }
  return points;
}
