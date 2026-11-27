// An illustrated pair of ladder decisions, followed by individually sealed
// admissions. Capacity creates room; only completed admissions fund the purse.
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const normal=p=>{const d=Math.hypot(...p)||1;return p.map(x=>x/d);};

// Department formation is a separate illustrated decision before either
// capacity ballot. Demand motivates a proposal; it never executes one itself.
export const DEPARTMENT_SECONDS=9;
export const DEPARTMENT_BIRTHS=Object.freeze({
  'child-9':4.55,'child-4':4.8,'child-5':5.05,'leaf-9':7.25,'leaf-5':7.55,
});
export function departmentBallot(local,id='root') {
  const parent=id==='root',start=parent?2.4:5.8,sealAt=parent?4.3:7.0;
  const total=parent?79:30,majority=Math.floor(total/2)+1;
  const releaseAt=parent?4.55:7.25;
  const order=[1,3,11,0,5,9,4,2,6,7,8,10];
  const choices=Array.from({length:12},(_,i)=>{
    const rank=order.indexOf(i),at=start+.18+rank*(sealAt-start-.3)/11;
    return {value:rank<7?'yes':'no',at,landed:local+1e-9>=at};
  });
  const floorChoices=Array.from({length:total},(_,i)=>{
    // Interleaved dissent, with the last affirmative arriving at the seal.
    const yes=i<majority,rank=yes?2*i+1:2*(i-majority);
    const at=start+.2+Math.min(total-1,rank)*(sealAt-start-.2)/(total-1);
    return {value:yes?'yes':'no',at,landed:local+1e-9>=at};
  });
  const sealed=local+1e-9>=sealAt,released=local>=releaseAt;
  return {id,start,sealAt,releaseAt,choices,floorChoices,active:local>=start&&!released,
    sealed,released,verdict:sealed?1:0,floorStart:start+.2,floorEnd:sealAt,
    floorProgress:clamp((local-start-.2)/(sealAt-start-.2)),packetProgress:null,
    chairYes:choices.filter(v=>v.landed&&v.value==='yes').length,
    floorYes:floorChoices.filter(v=>v.landed&&v.value==='yes').length,electorate:total};
}
export function departmentMoment(local) {
  const root=departmentBallot(local),team=departmentBallot(local,'child-9');
  const stage=local<2.4?'demand':local<4.55?'organize-vote':local<5.8?'organize':local<7.25?'delegate-vote':'delegate';
  const voting=stage==='delegate-vote'?team:root;
  const caption=stage==='demand'?'More members bring more work to each department.':
    stage==='organize-vote'?'Both chambers vote to give departments their own teams.':
    stage==='organize'?'A department becomes a chamber. It keeps one voice in the parent.':
    stage==='delegate-vote'?'Its team can vote to delegate work again. The members still decide.':
    'Teams within teams. Each child speaks through one parent pentagon.';
  return {stage,caption,root,team,born:Object.entries(DEPARTMENT_BIRTHS).filter(([,at])=>local>at).map(([id])=>id),
    round:0,expansion:0,capacity:80,occupied:79,payments:0,admitted:0,
    chairYes:voting.chairYes,floorYes:voting.floorYes,electorate:voting.electorate,sealed:voting.sealed};
}

export const GROWTH_ROUNDS=[
  {voteAt:1.3,expandAt:2.5,expandEnd:3.9,admitAt:4.2,spacing:.24,count:8,electorate:79,from:80,to:110},
  {voteAt:7,expandAt:8.3,expandEnd:9.9,admitAt:10.2,spacing:.25,count:12,electorate:87,from:110,to:150},
];
// The illustrated ballot obeys the wall's leaves-first mandate path. A child
// speaks through exactly one bound parent chair, only when its packet arrives.
export const GROWTH_CHAIR_ORDER=[1,3,11,0,5,9,4];
export const VERDICT_TRAVEL=.4;
const BALLOTS=GROWTH_ROUNDS.map((r,round)=>{
  const offset=r.voteAt-GROWTH_ROUNDS[0].voteAt;
  const rootYes=Object.fromEntries(GROWTH_CHAIR_ORDER.map((id,i)=>[id,r.voteAt+.12+i*.14]));
  const make=(id,parent,chair,sealAt,yesAt,start)=>{
    const choices=Array.from({length:12},(_,i)=>({value:'abstain',at:start+.3+i*.018}));
    const rest=choices.map((_,i)=>i).filter(i=>yesAt[i]==null);
    rest.slice(0,3).forEach((i,k)=>choices[i]={value:'no',at:start+.22+k*.1});
    for(const [i,at] of Object.entries(yesAt))choices[i]={value:'yes',at};
    return {id,parent,chair,round,sealAt,start,choices,floorStart:start+.15,floorEnd:sealAt-.035,
      releaseAt:r.expandEnd+.05,rootSealAt:r.expandAt-.025};
  };
  const leafYes=seal=>Object.fromEntries(GROWTH_CHAIR_ORDER.map((id,i)=>[id,seal-.5+i*.065]));
  const leaf9=make('leaf-9','child-9',9,offset+.98,leafYes(offset+.98),offset+.4);
  const leaf5=make('leaf-5','child-9',5,offset+1.1,leafYes(offset+1.1),offset+.52);
  const nodes={};
  for(const chair of [9,4,5]){
    const seal=rootYes[chair]-VERDICT_TRAVEL,start=seal-.78;
    const yes=leafYes(seal);
    if(chair===9){
      // Reserve these two chairs for the actual child packets.
      delete yes[5]; delete yes[9];
      yes[9]=leaf9.sealAt+VERDICT_TRAVEL;yes[5]=leaf5.sealAt+VERDICT_TRAVEL;
    }
    nodes['child-'+chair]=make('child-'+chair,'root',chair,seal,yes,start);
  }
  const root=make('root',null,null,r.expandAt-.025,rootYes,r.voteAt);
  root.floorStart=r.voteAt+.2;root.floorEnd=root.sealAt;
  return {...nodes,'leaf-9':leaf9,'leaf-5':leaf5,root};
});
export function growthChamberVote(local,id='root') {
  // The next leaves begin before the root's next vote at 7s.
  const round=local>=BALLOTS[1]['leaf-9'].start-.1?1:0;
  const plan=BALLOTS[round][id];
  if(!plan)throw new RangeError('Unknown illustrated chamber: '+id);
  const sealed=local+1e-9>=plan.sealAt,released=local>=plan.releaseAt;
  const choices=plan.choices.map(v=>({...v,landed:local+1e-9>=v.at}));
  return {...plan,choices,sealed,released,verdict:sealed?1:0,
    active:local>=plan.start&&!released,
    floorProgress:clamp((local-plan.floorStart)/(plan.floorEnd-plan.floorStart)),
    packetProgress:sealed&&plan.parent?clamp((local-plan.sealAt)/VERDICT_TRAVEL):null};
}

export function growthMoment(local) {
  local+=1e-9;
  const round=local<7?0:1,r=GROWTH_ROUNDS[round];
  const chairYes=Math.min(7,Math.max(0,Math.floor((local-r.voteAt-.12)/.14)+1));
  const majority=Math.floor(r.electorate/2)+1;
  const floorYes=Math.min(majority,Math.max(0,Math.floor((local-r.voteAt-.2)/((r.expandAt-r.voteAt-.225)/(majority-1)))+1));
  const sealed=chairYes>=7&&floorYes>=majority;
  const expansion=sealed?smooth((local-r.expandAt)/(r.expandEnd-r.expandAt)):0;
  const admitted=Array.from({length:r.count},(_,i)=>r.admitAt+i*r.spacing+.65).filter(at=>local>=at).length;
  const payments=(round?8:0)+admitted;
  const stage=local<1.3?'children':!sealed?'vote':local<r.expandEnd?'expand':admitted<r.count?'admit':'funded';
  const capacity=local>=r.expandAt&&sealed?r.to:r.from;
  const caption=stage==='children'?'Child chambers bring their decisions to the root.':
    stage==='vote'?'The chairs and owners vote to open more seats.':
    stage==='expand'?'The floor expands. Twelve chairs remain.':
    stage==='admit'?'Each new member is admitted by vote. Their payment enters the treasury.':
    'New members have funded the swarm’s treasury.';
  return {round,stage,sealed,chairYes,floorYes,electorate:r.electorate,expansion,
    capacity,occupied:79+payments,payments,admitted,caption};
}

// Minimum total angular travel gives every inherited hexagon one distinct
// destination. Chairs are pinned by chair number. These are illustration IDs,
// independent of geometry-array order or any live holder registry.
function assign(cost) {
  if (!cost.length) return new Int32Array(0);
  const n=cost.length,m=cost[0].length,u=new Float64Array(n+1),v=new Float64Array(m+1),p=new Int32Array(m+1),way=new Int32Array(m+1);
  for(let i=1;i<=n;i++) {
    p[0]=i;let j0=0;
    const min=new Float64Array(m+1).fill(Infinity),used=new Uint8Array(m+1);
    do {
      used[j0]=1;const i0=p[j0];let delta=Infinity,j1=0;
      for(let j=1;j<=m;j++)if(!used[j]) {
        const cur=cost[i0-1][j-1]-u[i0]-v[j];
        if(cur<min[j]){min[j]=cur;way[j]=j0;}
        if(min[j]<delta){delta=min[j];j1=j;}
      }
      for(let j=0;j<=m;j++)if(used[j]){u[p[j]]+=delta;v[j]-=delta;}else min[j]-=delta;
      j0=j1;
    }while(p[j0]);
    do {const j1=way[j0];p[j0]=p[j1];j0=j1;}while(j0);
  }
  const result=new Int32Array(n);for(let j=1;j<=m;j++)if(p[j])result[p[j]-1]=j-1;
  return result;
}
function align(points,target) {
  let best=Infinity,offset=0;
  for(let i=0;i<points.length;i++) {
    const cost=target.reduce((sum,q,k)=>sum+q.reduce((s,x,j)=>s+(x-points[(k+i)%points.length][j])**2,0),0);
    if(cost<best){best=cost;offset=i;}
  }
  return target.map((_,k)=>points[(k+offset)%points.length]);
}
export function growthTransition(from,to,round) {
  const oldHex=from.filter(f=>f.chair<0),nextHex=to.filter(f=>f.chair<0);
  const assignment=assign(oldHex.map(a=>nextHex.map(b=>1-dot(a.normal,b.normal))));
  const inherits=new Map(Array.from(assignment,(j,i)=>[j,oldHex[i]]));
  let nextId=Math.max(...from.map(f=>f.index))+1;
  const faces=to.filter(f=>f.chair>=0).map(f=>{
    const old=from.find(a=>a.chair===f.chair);
    return {...f,index:old.index,born:old.born??-1,start:align(old.verts,f.verts),startNormal:old.normal};
  });
  nextHex.forEach((f,j)=>{
    const old=inherits.get(j);
    if(old)faces.push({...f,index:old.index,born:old.born??-1,start:align(old.verts,f.verts),startNormal:old.normal});
    else {
      // New cells open from an inherited boundary, with zero initial area.
      // This illustrates changing adjacency; it is not an on-chain embedding.
      let best=-Infinity,edge;
      for(const a of from)for(let k=0;k<a.verts.length;k++) {
        const endpoints=[a.verts[k],a.verts[(k+1)%a.verts.length]];
        const score=dot(normal(mix(...endpoints,.5)),f.normal);
        if(score>best){best=score;edge=endpoints;}
      }
      const middle=mix(...edge,.5);
      const start=f.verts.map(p=>mix(...edge,clamp(.5+dot(p.map((x,i)=>x-middle[i]),edge[1].map((x,i)=>x-edge[0][i]))/edge[1].reduce((s,x,i)=>s+(x-edge[0][i])**2,0))));
      faces.push({...f,index:nextId++,born:round,start,startNormal:normal(middle)});
    }
  });
  const destination=faces.map(({start,startNormal,...f})=>f);
  return {from,to:destination,at(progress){
    if(progress<=0)return from;
    if(progress>=1)return destination;
    return faces.map(f=>({...f,verts:f.verts.map((v,i)=>mix(f.start[i],v,progress)),normal:normal(mix(f.startNormal,f.normal,progress))}));
  }};
}
