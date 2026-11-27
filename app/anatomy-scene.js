// An exploded view of one real Goldberg: every face keeps its source identity.
// The five beats illustrate identity, anatomy, decisions, and peer memory.
import {skinForRung, rotate, shade, INK as ORB_INK} from './orb.js'; const INK = {...ORB_INK, ink: '#FBF6EA', ink2: '#B8B2A8'}; // the hero journey stands on the holy page's dark ground (swarmbook-front.css): its words in ivory
import {growthMoment, growthTransition, growthChamberVote, GROWTH_ROUNDS, departmentMoment, departmentBallot, DEPARTMENT_SECONDS, DEPARTMENT_BIRTHS} from './anatomy-growth.js?v=departments-1';
import {wikiMoment} from './anatomy-wiki.js';
import {lightconeMoment, lightconeFlights, lightconeEvents} from './anatomy-lightcone.js?v=artifacts-1';
import {artifactMoment} from './anatomy-artifacts.js?v=artifacts-1';
import {flightProgress, LOAD_EPS} from './anatomy-load.js';
import {ANATOMY_CHAMBERS} from './anatomy-chambers.js';

const TAU=Math.PI*2;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;
const lerp=(a,b,t)=>a.map((x,i)=>mix(x,b[i],t));
const scale=(p,s)=>p.map(x=>x*s);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const unit=p=>scale(p,1/(Math.hypot(...p)||1));
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const envelope=(t,start,end,attack=.8,release=.8)=>smooth((t-start)/attack)*(1-smooth((t-end)/release));
const spring=t=>{t=clamp(t);return t===0?0:t===1?1:1-Math.exp(-6*t)*Math.cos(8*t);};
const COLORS=['#C99B3F','#3E7C74','#759AA8'];
// engine.js HEX_COLOR.gold: floor assent is distinct from monetary gold.
const FLOOR_YES='#F0B90B';

export const ANATOMY_PHASE_STARTS=[0,6,24,34,59];
export const ANATOMY_PHASE_DURATIONS=[6,18,10,25,22];
export const ANATOMY_CYCLE=81;
export const ANATOMY_STILL_TIMES=[4.03,14.5,8.4,23.2,18.4];
export function anatomyMoment(seconds) {
  const time=((seconds%ANATOMY_CYCLE)+ANATOMY_CYCLE)%ANATOMY_CYCLE;
  const phase=ANATOMY_PHASE_STARTS.findLastIndex(start=>time>=start),local=time-ANATOMY_PHASE_STARTS[phase];
  return {phase,progress:local/ANATOMY_PHASE_DURATIONS[phase],time,local};
}

// The loop is a horizontal page turn, never a contraction of the wiki bodies.
export function anatomyTransition(seconds) {
  const {phase,local}=anatomyMoment(seconds);
  const start=phase===4?20.8:Infinity;
  if(local<start)return null;
  const duration=ANATOMY_PHASE_DURATIONS[phase]-start;
  const progress=smooth((local-start)/duration);
  return {from:phase,to:0,progress,outgoing:progress,incoming:progress-1};
}

// Illustrative proposals, not live chain state. All times are seconds within
// the 18-second Who decides phase. Separate hashes/rounds never revise a vote.
// Current contract: docs/protocol-contract.md:161-192; proposal.rs:360-410,
// 442-480. Seven of twelve chairs AND PRO > half active floor weight.
// Two proposals only: a blocked removal, then one approved ladder step.
// Thirty existing seats vote; new capacity never adds votes to that ballot. INK.verdict: 0 pending, 1 passed, 2 rejected,
// 3 deadlock. The historical ET/SUMMA blend is not used.
const GOVERNANCE_CHAIR_ORDER=[5,4,1,3,11,0,2,6,7,8,10,9];
const GOVERNANCE_ROUNDS=[
  {id:'governance-I',label:'Remove a member',start:1.8,end:6.4,sealAt:4.8,
    chairYes:7,floorYes:12,chairFrom:1.98,chairTo:4.2,floorFrom:2.02,floorTo:4.5},
  {id:'governance-II',label:'Expand the floor · by consent',start:7,end:Infinity,sealAt:10.2,
    chairYes:7,floorYes:18,chairFrom:7.18,chairTo:9.8,floorFrom:7.22,floorTo:10.1},
];
const governanceEase=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const governanceLerp=(a,b,t)=>a+(b-a)*t;

// Keep planned values available for moving vote packets. Only `landed` voices
// count or paint a face; an unlanded no is not a rejection of a chamber.
function governanceChoices(time,total,yes,from,to,order=null,source='direct') {
  const indices=order||Array.from({length:total},(_,i)=>i);
  return Array.from({length:total},(_,index)=>{
    const rank=indices.indexOf(index);
    const at=governanceLerp(from,to,rank/Math.max(1,total-1));
    return {index,value:rank<yes?'yes':'no',at,landed:time>=at,source};
  });
}

// Alternate positive/negative voices, ending on the final positive voice.
// This makes the floor's independent sum visible throughout each round.
function governanceFloorChoices(time,total,yes,from,to) {
  const order=[],positive=Array.from({length:yes},(_,i)=>i);
  const negative=Array.from({length:total-yes},(_,i)=>yes+i);
  while(positive.length>1||negative.length){
    if(negative.length)order.push(negative.shift());
    if(positive.length>1)order.push(positive.shift());
  }
  if(positive.length)order.push(positive.shift());
  const voices=governanceChoices(time,total,total,from,to,order);
  return voices.map(v=>({...v,value:v.index<yes?'yes':'no'}));
}

function governanceTally(choices) {
  return choices.filter(v=>v.landed&&v.value==='yes').length;
}

function governanceBallot(time,chairs,floor,sealAt,active) {
  const chairYes=governanceTally(chairs),floorYes=governanceTally(floor);
  const chairPass=chairYes>=7,floorPass=floorYes*2>floor.length;
  const sealed=active&&time>=sealAt;
  const verdict=!sealed?0:chairPass&&floorPass?1:chairPass||floorPass?3:2;
  return {active,voting:active&&!sealed,chairChoices:chairs,floorChoices:floor,
    chairYes,floorYes,chairTotal:12,floorTotal:floor.length,
    chairPass,floorPass,chairStatus:chairPass?'yes':sealed?'no':'pending',
    floorStatus:floorPass?'yes':sealed?'no':'pending',sealed,verdict,
    deadline:sealAt,sealAt};
}

export function governanceMoment(local) {
  // Normalize sub-nanosecond modulo drift so exact event frames count once.
  const time=Number.isFinite(local)?Math.round(Math.max(0,local)*1e9)/1e9:0;
  const round=GOVERNANCE_ROUNDS.find(r=>time>=r.start&&time<r.end)||null;
  const second=round===GOVERNANCE_ROUNDS[1];
  const chairs=round?governanceChoices(time,12,round.chairYes,round.chairFrom,
    round.chairTo,GOVERNANCE_CHAIR_ORDER):[];
  const floor=round?governanceFloorChoices(time,30,round.floorYes,round.floorFrom,round.floorTo):[];
  const ballot=governanceBallot(time,chairs,floor,round?.sealAt??null,!!round);
  // Expansion changes available places, never the sealed electorate or either gate.
  const expansion=second&&ballot.sealed&&ballot.verdict===1?governanceEase((time-11.1)/3.1):0;
  const fold=governanceEase((time-15.8)/.8);
  const sphereReturn=governanceEase((time-10.5)/.6);
  const resetStart=time>=6.4&&time<7?6.4:null;
  const stage=time<1.8?'opening':resetStart!==null?'reset':time>=15.8?'fold':
    expansion>0?'expansion':ballot.sealed?'sealed':'voting';
  const newMembers=Math.min(47,Math.max(0,Math.floor((time-15.8)/.8*47+1e-8)));
  const caption=time>=15.8?'Later, more members have taken their places. Both chambers still decide.':
    expansion>0?'More hexagons only by consent. Every chamber seals, both halves of each. Growth dilutes everyone, so everyone signs.':
    second&&ballot.sealed?'Every chamber approves. The floor can expand.':
    second?'The next proposal opens more places. Every chamber votes, both halves of each.':
    round&&ballot.sealed?'The principals approve. The members refuse. No one is removed.':
    round?'The chairs and members vote on the same proposal.':
    'Two chambers count their votes. A decision needs both.';
  return {...ballot,floorTotal:30,local:time,illustrative:true,proposalId:round?.id??null,
    label:round?.label??'',round:round?GOVERNANCE_ROUNDS.indexOf(round)+1:null,
    stage,opening:governanceEase(time/1.8),reset:resetStart===null?0:
      governanceEase((time-resetStart)/.6),fold,sphereReturn,expansion,ballotOpacity:1-sphereReturn,
    capacity:30+50*expansion,newMembers,occupied:30+newMembers,thresholds:{chairs:7,chairTotal:12,
      floorFraction:.5,floorStrict:true,floorWeight:'active',equalWeights:true},
    caption};
}

// An illustrative equal-weight floor. Jet needs both chambers to seal, pays
// the holder at the last clearing price, and removes holdings, not capacity.
const ARRIVALS=[.16,.68,1.2];
const CHAIR_VOTES=[2.75,3.06,3.21,3.56,3.94,4.13,4.62];
const CHAIR_ORDER=[5,9,4,1,3,11,0];
const FLOOR_VOTES=Array.from({length:41},(_,i)=>2.7+i*.065);
const SEAL_AT=FLOOR_VOTES.at(-1),BUYOUT_AT=6.7;
export function floorMoment(local) {
  const arrived=ARRIVALS.filter(at=>local>=at+.85).length;
  const chairYes=CHAIR_VOTES.filter(at=>local>=at).length;
  const floorYes=FLOOR_VOTES.filter(at=>local>=at).length;
  const sealed=chairYes>=7&&floorYes>40,removed=sealed&&local>=BUYOUT_AT;
  const stage=local<2.4?'admission':!sealed?'vote':!removed?'buyout':'removed';
  const occupied=77+arrived-(removed?1:0);
  const caption=stage==='admission'?'A key holds a seat, whether it belongs to a human or an AI.':
    stage==='vote'?'The collective votes on who keeps their seats. Both chambers must approve.':
    stage==='buyout'?'The vote passes. The treasury buys out the holder’s seat.':
    'The seats are vacated. Their owner is paid; capacity stays the same.';
  return {occupied,capacity:80,chairYes,floorYes,sealed,removed,stage,caption};
}

// Curves and moving agents use the same point function, so no ball leaves its wire.
function orbit(chair,t) {
  const a=t+chair*TAU/12;
  const latitude=.68*Math.sin(3*a+chair*.31);
  return rotate([Math.cos(2*a)*Math.cos(latitude),Math.sin(latitude),Math.sin(2*a)*Math.cos(latitude)],chair*.43,chair*.19);
}

export function createAnatomyScene(canvas) {
  const ctx=canvas.getContext('2d');
  // Cache skins and each face's local basis once, never construct geometry in RAF.
  const skins=new Map();
  for(const rung of [0,1,2,3,4,5]) {
    const skin=skinForRung(rung);
    skins.set(rung,skin.faces.map((f,index)=>{
      const u=unit(cross(f.normal,Math.abs(f.normal[2])>.9?[0,1,0]:[0,0,1]));
      const v=cross(f.normal,u);
      const center=scale(f.verts.reduce(add,[0,0,0]),1/f.verts.length);
      return {...f,index,flat:f.verts.map(p=>{const d=p.map((x,i)=>x-center[i]);return [dot(d,u),dot(d,v),0];})};
    }));
  }
  // Seed the introductory world with thirty holdings. The approved ladder
  // step is rung 2 to rung 3 (30 to 80), preserving the later eighty-place floor. Canonical destination
  // IDs keep its inherited faces intact when it grows into the later floor.
  const seed=skins.get(2),target=skins.get(3);
  const introGrowth=growthTransition(seed,target.map(f=>({...f,targetIndex:f.index})),-2);
  const introIdentity=new Map(introGrowth.to.filter(f=>f.index<seed.length).map(f=>[f.index,f.targetIndex]));
  const introFaces=seed.map(f=>({...f,index:introIdentity.get(f.index)}));
  const introAt=p=>p<=0?introFaces:p>=1?target:introGrowth.at(p).map(f=>({...f,index:f.targetIndex}));
  const augurFaceId=introIdentity.get(22),augurFace=introFaces.find(f=>f.index===augurFaceId);
  const governanceFlat=new Map(target.map(face=>{
    const normalize=points=>{const radius=Math.max(...points.map(p=>Math.hypot(p[0],p[1])));return points.map(p=>scale(p,1/radius));};
    const destination=normalize(face.flat),prior=introFaces.find(f=>f.index===face.index);
    let source=prior?normalize(prior.flat):destination;
    const original=source;
    if(prior){
      // Cyclic alignment changes vertex order, never the source polygon. This
      // prevents the seed-to-target face basis from jumping at expansion start.
      const rotations=source.map((_,i)=>source.map((_,j)=>source[(j+i)%source.length]));
      const cost=points=>points.reduce((sum,p,i)=>sum+Math.hypot(p[0]-destination[i][0],p[1]-destination[i][1])**2,0);
      source=rotations.sort((a,b)=>cost(a)-cost(b))[0];
    }
    return [face.index,{source,destination,original}];
  }));

  // Densify the member bank in place. Existing votes remain spread over the
  // same footprint; new places open between them rather than appending a block.
  const governanceSlots=[],governanceBirth=[],available=new Set(Array.from({length:80},(_,i)=>i));
  for(let i=0;i<30;i++) {
    const px=(i%6)/5,py=Math.floor(i/6)/4;
    const slot=[...available].sort((a,b)=>
      Math.hypot(a%10/9-px,Math.floor(a/10)/7-py)-Math.hypot(b%10/9-px,Math.floor(b/10)/7-py))[0];
    governanceSlots.push(slot);governanceBirth.push(i);available.delete(slot);
  }
  for(const slot of available) {
    governanceSlots.push(slot);
    governanceBirth.push(Array.from({length:30},(_,i)=>i).sort((a,b)=>
      Math.hypot(governanceSlots[a]%10-slot%10,Math.floor(governanceSlots[a]/10)-Math.floor(slot/10))-
      Math.hypot(governanceSlots[b]%10-slot%10,Math.floor(governanceSlots[b]/10)-Math.floor(slot/10)))[0]);
  }

  const floorFaces=skins.get(3).filter(f=>f.chair<0);
  const ordered=[...floorFaces].sort((a,b)=>rotate(b.normal,.28,-.18)[2]-rotate(a.normal,.28,-.18)[2]);
  const expelled=ordered[0].index;
  // Choose real front-facing sockets. Identity is their source face index.
  const inheritedIntroIds=new Set(introFaces.map(f=>f.index));
  const newIntroHexes=ordered.filter(f=>!inheritedIntroIds.has(f.index)&&f.index!==expelled);
  const arrivals=[newIntroHexes[2].index,newIntroHexes[5].index,newIntroHexes[8].index];
  const voters=ordered.filter(f=>f.index!==expelled).slice(0,41).map(f=>f.index);
  let growthPlans=null,growthAdmissions=null,growthElectorates=null;
  function prepareGrowth() {
    if(growthPlans)return;
    const first=growthTransition(skins.get(3),skins.get(4),0);
    const second=growthTransition(first.to,skins.get(5),1);
    growthPlans=[first,second];
    growthAdmissions=new Map();
    growthPlans.forEach((plan,round)=>{
      const spec=GROWTH_ROUNDS[round];
      const available=plan.to.filter(f=>f.born===round).sort((a,b)=>rotate(b.normal,.28,-.18)[2]-rotate(a.normal,.28,-.18)[2]);
      available.slice(0,spec.count).forEach((f,i)=>growthAdmissions.set(f.index,spec.admitAt+i*spec.spacing));
    });
    growthElectorates=growthPlans.map((plan,round)=>plan.from
      .filter(f=>f.chair<0&&f.index!==expelled&&(f.born==null||f.born<0||growthAdmissions.get(f.index)+.65<GROWTH_ROUNDS[round].voteAt))
      .sort((a,b)=>rotate(b.normal,.28,-.18)[2]-rotate(a.normal,.28,-.18)[2])
      .slice(0,Math.floor(GROWTH_ROUNDS[round].electorate/2)+1).map(f=>f.index));
  }
  prepareGrowth();
  // The grown surface is carried into the next scene with its inherited IDs.
  // A vacant holding cannot acquire an owner merely because the camera moves.
  const matureFaces=growthPlans[1].to;
  const matureVacancies=new Set(matureFaces.filter(f=>f.chair<0&&
    (f.index===expelled||f.born>=0&&!(16>=growthAdmissions.get(f.index)+.65))).map(f=>f.index));
  const matureFloorIds=matureFaces.filter(f=>f.chair<0&&!matureVacancies.has(f.index)).map(f=>f.index);
  const rootSpec=ANATOMY_CHAMBERS.find(s=>s.growthId==='root');
  const growthSpecs=ANATOMY_CHAMBERS.filter(s=>s.growthId);
  let width=0,height=0,W=960,H=450,small=false,dead=false;

  // Positions change; ancestry, skin, spin and orbital clocks do not.
  function growthBodies(t) {
    const poses=small?[
      [184,226,82*Math.sqrt(150/80)],[378,152,36],[186,367,22],
      [250,59,21],[423,246,17],[424,58,13],
    ]:[
      [380,230,108*Math.sqrt(150/80)],[708,145,52],[387,399,25],
      [432,43,22],[846,240,24],[843,59,20],
    ];
    return growthSpecs.map((body,i)=>{
      const [x,y,r]=poses[i],root=i===0,leaf=i>=4;
      return {...body,x,y,r,yaw:root?.28+.32*Math.sin(t*TAU/18):leaf?t*.21:-t*.18+i-1,
        pitch:root?-.18+.08*Math.sin(t*.5):leaf?.4:.2-(i-1)*.2,
        t:root?t:leaf?t+body.chair:t+i-1};
    });
  }
  function gossipBodies(local,t) {
    // Begin the camera move in the last beat of growth, settle before reports
    // are proposed. This same function runs on both sides of the phase seam.
    const progress=smooth((local+.9)/2.3),inherited=growthBodies(t);
    const targets=small?[
      [88,302,29],[164,283,16],[65,389,14],[70,256,12],[177,343,10],[176,251,10],
      [287,300,25],[249,261,13],[317,390,14],
      [412,293,22],[443,379,15],[359,391,11],
    ]:[
      [536,175,56],[675,100,28],[398,318,28],[554,38,24],[733,180,17],[725,40,16],
      [849,244,43],[901,111,25],[914,376,24],
      [665,337,34],[788,411,23],[490,408,17],
    ];
    return {progress,nodes:ANATOMY_CHAMBERS.map((body,i)=>{
      const [x,y,r]=targets[i],previous=inherited.find(n=>n.id===body.id);
      if(previous)return {...previous,x:mix(previous.x,x,progress),y:mix(previous.y,y,progress),r:mix(previous.r,r,progress)};
      // Visiting polises arrive as complete families from outside the window.
      return {...body,x:x+W*(1-progress),y,r,yaw:t*.09+i*.8,pitch:.16*Math.sin(t*.15+i),t:t+i};
    })};
  }
  function drawTreasury(payments,progress=0) {
    const [x,y]=small?[409,326]:[830,360],px=x+W*progress;
    wire([[px-33,y-10],[px-25,y+17],[px+25,y+17],[px+33,y-10]],INK.bronze,1.1);
    wire([[px-33,y-10],[px+33,y-10]],'#C99B3F66',.8);
    for(let i=0;i<payments;i++)ball([px-20+(i%5)*10,y+11-Math.floor(i/5)*7],3.4,INK.gold);
  }

  function fit() {
    // clientWidth excludes the cinematic parent's perspective transform.
    const displayWidth=canvas.clientWidth||canvas.getBoundingClientRect().width;
    small=displayWidth<580;W=small?480:960;H=small?420:450;
    if(canvas.style&&canvas.style.aspectRatio!==`${W} / ${H}`)canvas.style.aspectRatio=`${W} / ${H}`;
    const dpr=Math.min(2,globalThis.devicePixelRatio||1);
    const w=Math.max(1,Math.round(displayWidth*dpr)),h=Math.round(w*H/W);
    if(w!==width||h!==height){width=w;height=h;canvas.width=w;canvas.height=h;}
    ctx.setTransform(width/W,0,0,height/H,0,0);
  }

  function polygon(points,fill,stroke=INK.line,lineWidth=.7) {
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.stroke();}
  }
  function wire(points,color,lineWidth=.7) {
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.stroke();
  }
  function ball(p,r,color) {
    if(r<.15)return;
    const g=ctx.createRadialGradient(p[0]-r*.32,p[1]-r*.4,0,p[0],p[1],r);
    g.addColorStop(0,'#FFFFFF');g.addColorStop(.28,shade(color,1.22));g.addColorStop(1,shade(color,.65));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(p[0],p[1],r,0,TAU);ctx.fill();
    ctx.strokeStyle=shade(color,.65);ctx.lineWidth=.6;ctx.stroke();
  }

  function chamber({x,y,r,rung,yaw,pitch,t,phase,local,root=false,childSockets=[],facesOverride=null,growth=null,treasury=null,ballot=null,vacantFaces=null,floorFaceIds=null,orbitRoot=root,agentReveal=1,intro=false,principalView=null,chairPorts=null,facePorts=null}) {
    const project=p=>{const s=r*4/(4-p[2]);return [x+p[0]*s,y-p[1]*s,p[2]];};
    const faces=facesOverride||skins.get(rung),shell=[],chairs=new Map(),sockets=new Map();
    const explode=phase===0&&root||!!principalView?.unfold;
    const agentVisibility=agentReveal*(1-(principalView?.amount||0));
    const floor=phase===1&&root;
    const vote=floor?floorMoment(local):growth;
    const voting=floor||!!growth;
    const chairOrder=growth?[1,3,11,0,5,9,4]:CHAIR_ORDER;
    const round=growth?GROWTH_ROUNDS[growth.round]:null;
    const growthVoters=growth?growthElectorates[growth.round]:[];
    const yesFaces=growth?growthVoters:voters;
    const centers=new Map();
    const floorIds=ballot&&(!root||!growth)?(floorFaceIds||faces.filter(f=>f.chair<0).map(f=>f.index)):[];
    const localFloorYes=ballot?Math.min(Math.floor(floorIds.length/2)+1,
      Math.max(0,Math.floor(ballot.floorProgress*Math.floor(floorIds.length/2))+1)):0;
    const flat=ballot?.sealed&&!ballot.released?INK.verdict[ballot.verdict]:null;
    const choiceOf=id=>ballot?.active&&ballot.choices[id]?.landed?ballot.choices[id].value:null;
    for(const f of faces) {
      const n=rotate(f.normal,yaw,pitch),original=f.verts.map(p=>rotate(p,yaw,pitch));
      let points=original,normal=n;
      if(f.chair>=0) {
        const lift=principalView?.unfold??(explode?envelope(local,.16+f.chair*.045,(intro?3.6:4.85)+f.chair*.025,.85,intro?.55:.72):0);
        const angle=-Math.PI/2+f.chair*TAU/12;
        const target=[Math.cos(angle)*(small?1.94:2.05),Math.sin(angle)*(small?1.36:1.31),.6];
        // The same pentagon turns toward the reader as it leaves its socket.
        const flat=f.flat.map(p=>add(target,scale(p,1.13)));
        points=points.map((p,i)=>lerp(p,flat[i],lift));normal=unit(lerp(n,[0,0,1],lift));
        const center=lerp(n,target,lift);
        chairs.set(f.chair,{center,point:project(center),lift});sockets.set(f.chair,project(n));
        chairPorts?.set(f.chair,{point:project(center),socket:project(n),lift});
        if(lift>.01) {
          wire([project(n),project(center)],'#C99B3F55');
          polygon(original.map(project),null,'#A08B6655',.5);
        }
      }
      let vacant=!!vacantFaces?.has(f.index);
      if(root&&f.chair<0) {
        const admission=arrivals.indexOf(f.index);
        const entering=floor&&admission>=0;
        // Occupancy changes within the same shell. A removed seat is not
        // silently re-minted, and none of the inherited white faces fade out.
        vacant=(phase===0&&admission>=0&&(!intro||local>=4.6))||(phase===2&&f.index===expelled);
        if(growth&&f.born>=0)vacant=!(local+1e-9>=growthAdmissions.get(f.index)+.65);
        if(entering) {
          const land=smooth((local-ARRIVALS[admission])/.85);
          if(land<1) {
            const side=admission===1?1:-1;
            const offset=[side*(1-land)*(small?2.65:3.3),(.55-admission*.5)*(1-land),.45*(1-land)];
            const flying=original.map(p=>add(p,offset));
            shell.push({type:'face',points:flying.map(project),z:2.8,fill:'#FBF8F1',normal:n});
            wire([project(n),project(add(n,offset))],'#C99B3F55',.7);
            vacant=true;
          }
        }
        if(floor&&f.index===expelled) {
          const depart=smooth((local-BUYOUT_AT)/1.6);
          const hover=envelope(local,2.1,BUYOUT_AT,.4,.4)*.16;
          points=original.map(p=>add(p,[depart*4.1,depart*-.45,hover]));
          if(vote.removed) {
            vacant=true;
            shell.push({type:'face',points:points.map(project),z:3.2,fill:'#FBF8F1',normal:n,stroke:INK.bronze,lineWidth:1.3});
            // The gold payment accompanies the bought-out holding.
            const paid=project(add(n,[depart*4.1,depart*-.45,.1]));
            shell.push({type:'ball',point:paid,z:3.3,r:3.4,color:INK.gold});
            points=original;
          }
        }
      }
      centers.set(f.index,project(points.reduce(add,[0,0,0]).map(v=>v/points.length)));
      facePorts?.set(f.index,{face:f,point:centers.get(f.index),points:points.map(project),normal:n});
      const light=.82+.23*Math.max(0,normal[0]*.35+normal[1]*.55+normal[2]*.75);
      const agreed=voting&&(f.chair>=0?chairOrder.indexOf(f.chair)>=0&&chairOrder.indexOf(f.chair)<vote.chairYes:yesFaces.indexOf(f.index)>=0&&yesFaces.indexOf(f.index)<vote.floorYes);
      const disputed=floor&&f.index===expelled&&local>=2.4&&!vote.removed;
      const chairChoice=f.chair>=0?choiceOf(f.chair):null;
      const floorChoice=ballot?.floorChoices?.[floorIds.indexOf(f.index)];
      const floorAgreed=ballot?.active&&(root&&growth?agreed:ballot.floorChoices?!!floorChoice&&floorChoice.landed&&floorChoice.value==='yes':local>=ballot.floorStart&&floorIds.indexOf(f.index)<localFloorYes);
      const floorAgainst=ballot?.active&&floorChoice?.landed&&floorChoice.value==='no';
      const base=flat||(f.chair>=0?(chairChoice?INK[chairChoice]:floor&&agreed?INK.yes:INK.vacant):floorAgainst?INK.no:floorAgreed||floor&&agreed?FLOOR_YES:INK.paperB);
      shell.push({type:'face',points:points.map(project),z:points.reduce((s,p)=>s+p[2],0)/points.length,
        // An empty socket has only its rim: the far shell stays visible through it.
        fill:vacant?null:shade(base,light),normal,
        stroke:disputed?INK.no:vacant?'#B0A48C':INK.line,lineWidth:disputed?1.6:.7});
    }
    const orbitScale=orbitRoot?1.65:1.5;
    for(let id=0;id<12;id++) {
      const choice=choiceOf(id);
      const color=choice?INK[choice]:floor&&CHAIR_ORDER.indexOf(id)>=0&&CHAIR_ORDER.indexOf(id)<vote.chairYes?INK.yes:COLORS[id%3],chair=chairs.get(id);
      const affirmative=chairOrder.indexOf(id);
      const transfer=ballot&&local>=ballot.start?smooth((local-ballot.choices[id].at+.24)/.24)*(1-smooth((local-ballot.releaseAt)/.35)):growth&&affirmative>=0?smooth((local-round.voteAt-.12-affirmative*.14+.35)/.35)*(1-smooth((local-round.expandEnd)/.5)):explode?smooth((local-1.8-id*.12)/.9)*(1-smooth((local-4.9-id*.025)/.7)):
        floor&&affirmative>=0?smooth((local-CHAIR_VOTES[affirmative]+.5)/.5)*(1-smooth((local-7.8)/.8)):0;
      const occupied=childSockets.includes(id);
      // Three lanes stay visible; all twelve agents move on their own paths.
      if(id<3) {
        let segment=[],back=null;
        for(let j=0;j<=100;j++) {
          const p=project(scale(orbit(id,j*TAU/100),orbitScale));
          const behind=p[2]<0;
          if(back!==null&&back!==behind) {
            const line={type:'wire',points:segment.concat([p]),z:back?-3:3,color:color+Math.round((back?32:56)*agentVisibility).toString(16).padStart(2,'0')};shell.push(line);segment=[segment.at(-1),p];
          } else segment.push(p);
          back=behind;
        }
        if(segment.length>1)shell.push({type:'wire',points:segment,z:back?-3:3,color:color+Math.round((back?32:56)*agentVisibility).toString(16).padStart(2,'0')});
      }
      if(occupied)continue;
      const from=scale(orbit(id,t*.32),orbitScale),to=add(chair.center,[0,0,.055]);
      const position=lerp(from,to,transfer),point=project(position);
      shell.push({type:'ball',point,z:position[2],r:(orbitRoot?4.2:2.1)*4/(4-position[2])*agentVisibility,color});
      if(!principalView&&transfer>.98&&chair.lift>.2) {
        const pulse=(local-1.8-id*.12-.9)*2;
        if(pulse>0&&pulse<1)shell.push({type:'pulse',point:chair.point,z:3,pulse});
      }
    }
    if(floor) {
      const hub=project([0,-.1,1.1]);
      // Each ballot starts at the actual owner hexagon, rather than at an
      // unconnected particle emitter. The selected holder votes against.
      for(let i=0;i<voters.length;i++) {
        const arrival=FLOOR_VOTES[i],p=(local-arrival+.38)/.38;
        if(p<=0||p>=1)continue;
        const origin=centers.get(voters[i]);
        shell.push({type:'wire',points:[origin,hub],z:3,color:FLOOR_YES+'77'});
        shell.push({type:'ball',point:lerp(origin,hub,p),r:1.8,z:3.1,color:FLOOR_YES});
      }
      if(local>=2.4&&!vote.removed) {
        const against=centers.get(expelled),p=clamp((local-2.6)/.45);
        if(p>0&&p<1){shell.push({type:'wire',points:[against,hub],z:3,color:INK.no+'88'});shell.push({type:'ball',point:lerp(against,hub,p),r:2,z:3.1,color:INK.no});}
      }
      if(vote.sealed) {
        const pulse=(local-SEAL_AT)/.75;
        if(pulse<1)shell.push({type:'seal',point:[x,y],z:4,pulse,r,color:INK.verdict[1]});
        const pay=clamp((local-5.65)/(BUYOUT_AT-5.65));
        if(pay>0&&pay<1) {
          const to=centers.get(expelled);
          shell.push({type:'wire',points:[hub,to],z:3,color:'#C99B3FCC'});
          shell.push({type:'ball',point:lerp(hub,to,smooth(pay)),r:4,z:3.1,color:INK.gold});
        }
      }
    }
    if(growth) {
      const hub=project([0,-.1,1.13]);
      const majority=Math.floor(round.electorate/2)+1;
      for(let i=0;i<growthVoters.length;i++) {
        const at=round.voteAt+.2+i*(round.expandAt-round.voteAt-.225)/(majority-1);
        const p=(local-at+.28)/.28;
        if(p<=0||p>=1)continue;
        const origin=centers.get(growthVoters[i]);
        shell.push({type:'wire',points:[origin,hub],z:3,color:FLOOR_YES+'77'});
        shell.push({type:'ball',point:lerp(origin,hub,p),r:2,z:3.1,color:FLOOR_YES});
      }
      if(growth.sealed) {
        const pulse=(local-round.expandAt+.025)/.65;
        if(pulse>0&&pulse<1)shell.push({type:'seal',point:[x,y],z:4,pulse,r,color:INK.verdict[1]});
      }
      // Every admission has its own approval pulse, then a payment crossing
      // into the purse. Empty cells gain their solid face only on completion.
      for(const [id,at] of growthAdmissions) {
        const center=centers.get(id),p=(local-at)/.65;
        if(!center||p<-.38||p>1)continue;
        const waiting=[center[0]+(center[0]>x?1:-1)*(small?34:62),center[1]-36];
        if(p<0) {
          const approach=clamp((p*.65+.38)/.38);
          shell.push({type:'ball',point:lerp(waiting,center,approach),z:4,r:3,color:COLORS[id%3]});
        } else {
          if(p<.4) {
            // An individual seal has two arcs: chairs and floor.
            for(let i=0;i<12;i++) {
              const a=i*TAU/12;
              shell.push({type:'ball',point:[center[0]+Math.cos(a)*11,center[1]+Math.sin(a)*11],z:4,r:i<7?1.5:1,color:i<7?INK.yes:INK.tether});
            }
            const floorOrigin=hub;
            const ballot=lerp(floorOrigin,center,clamp(p/.25));
            shell.push({type:'wire',points:[floorOrigin,center],z:4,color:FLOOR_YES+'77'});
            shell.push({type:'ball',point:ballot,z:4.1,r:2.5,color:FLOOR_YES});
            shell.push({type:'pulse',point:center,z:4,pulse:p/.4,color:INK.verdict[1]});
          }
          if(p>.25&&treasury) {
            const travel=smooth((p-.25)/.75);
            const point=lerp(center,treasury,travel);
            point[1]-=Math.sin(travel*Math.PI)*(small?28:46);
            shell.push({type:'wire',points:[center,treasury],z:4,color:'#C99B3F25'});
            shell.push({type:'ball',point,z:4.1,r:4,color:INK.gold});
          }
        }
      }
    }
    if(ballot&&(!root||!growth)){
      // Local owner votes stay gold; sealed chamber bodies and mandate packets
      // use verdict green. Every event is tied to an actual chair or hexagon.
      const hub=project([0,0,1.08]);
      const majority=ballot.floorChoices?.length??Math.floor(floorIds.length/2)+1;
      for(let i=0;i<majority;i++){
        const floorChoice=ballot.floorChoices?.[i];
        if(floorChoice&&floorChoice.value!=='yes')continue;
        const at=floorChoice?.at??mix(ballot.floorStart,ballot.floorEnd,i/Math.max(1,majority-1));
        const p=(local-at+.18)/.18,from=centers.get(floorIds[i]);
        if(from&&p>0&&p<1)shell.push({type:'ball',point:lerp(from,hub,p),z:3.1,r:1.4,color:FLOOR_YES});
      }
      const pulse=(local-ballot.sealAt)/.45;
      if(pulse>=0&&pulse<1)shell.push({type:'seal',point:[x,y],z:4,pulse,r,color:INK.verdict[ballot.verdict]});
    }
    if(ballot?.released){
      // The wall's synchronized return to white is paint only, not a new vote.
      const pulse=(local-ballot.releaseAt)/.4;
      if(pulse>=0&&pulse<1)shell.push({type:'seal',point:[x,y],z:4,pulse,r,color:INK.paperB});
    }
    shell.sort((a,b)=>a.z-b.z);
    for(const item of shell) {
      if(item.type==='face')polygon(item.points,item.fill,item.stroke||INK.line,r<40?.5:item.lineWidth||.7);
      else if(item.type==='ball')ball(item.point,item.r,item.color);
      else if(item.type==='wire')wire(item.points,item.color,r<40?.45:.65);
      else if(item.type==='seal') {
        ctx.beginPath();ctx.arc(...item.point,item.r*(1.08+item.pulse*.85),0,TAU);
        ctx.strokeStyle=`rgba(255,255,255,${1-item.pulse})`;ctx.lineWidth=4*(1-item.pulse);ctx.stroke();
        ctx.beginPath();ctx.arc(...item.point,item.r*(1.05+item.pulse*.72),0,TAU);
        ctx.strokeStyle=(item.color||INK.gold)+Math.round(178*(1-item.pulse)).toString(16).padStart(2,'0');ctx.lineWidth=1.5;ctx.stroke();
      } else {
        ctx.beginPath();ctx.arc(...item.point.slice(0,2),8+item.pulse*14,0,TAU);
        ctx.strokeStyle=(item.color||INK.gold)+Math.round(178*(1-item.pulse)).toString(16).padStart(2,'0');ctx.lineWidth=1;ctx.stroke();
      }
    }
    return sockets;
  }

  function principalText(value,x,y,size=13.5,align='center') {
    ctx.font=`${size}px Georgia,serif`;ctx.textAlign=align;ctx.fillStyle=INK.ink2;
    ctx.fillText(value,x,y);
  }
  function drawGovernance(local,t) {
    const state=governanceMoment(local),open=state.opening*(1-state.sphereReturn);
    const focus=state.sphereReturn*(1-state.fold);
    const pentCenter=small?125:354,hexCenter=small?345:681;
    const cx=mix(W/2,(pentCenter+hexCenter)/2,focus),cy=mix(small?226:230,small?132:156,focus);
    const r=mix(small?82:108,mix(small?58:70,small?76:94,state.expansion),focus);
    const yaw=.28+.32*Math.sin(t*TAU/18),pitch=-.18+.08*Math.sin(t*.5);
    const project=p=>{const k=r*4/(4-p[2]);return [cx+p[0]*k,cy-p[1]*k,p[2]];};
    const expansion=state.expansion;
    if(local>=16.6) {
      chamber({x:cx,y:cy,r,rung:3,yaw,pitch,t,phase:0,local:local-12,root:true,
        intro:true,facesOverride:introAt(expansion)});
      return {governance:state,docking:{planet:'augur-civ-0:0',rung:expansion?3:2,faceId:augurFaceId,landed:true,expansion},caption:state.caption};
    }
    const pentY=small?49:42,hexY=pentY;
    const centers=new Map(),shell=[];
    const members=introFaces.filter(f=>f.chair<0);
    const castAt=choice=>state.active&&choice?.landed;
    const surface=introAt(expansion);
    const allMembers=skins.get(3).filter(f=>f.chair<0);
    const memberRank=new Map(members.map((f,i)=>[f.index,i]));
    const newFaces=allMembers.filter(f=>!memberRank.has(f.index));
    newFaces.forEach((f,i)=>memberRank.set(f.index,members.length+i));
    const laterAdmissions=newFaces.filter(f=>!arrivals.includes(f.index));
    for(const face of surface) {
      const isChair=face.chair>=0,index=isChair?face.chair:memberRank.get(face.index);
      const inherited=isChair||index<members.length;
      const col=index%4,row=Math.floor(index/4);
      // Both vote banks keep the same footprint as the member surface grows.
      const oldMember=i=>small?[269+(i%6)*31,70+Math.floor(i/6)*31]:[571+(i%6)*39,72+Math.floor(i/6)*38];
      const newMember=i=>small?[263+(i%10)*19,65+Math.floor(i/10)*20]:[560+(i%10)*25,66+Math.floor(i/10)*25];
      const oldIndex=governanceBirth[index];
      const oldTarget=oldMember(oldIndex),newTarget=newMember(governanceSlots[index]);
      const target=isChair?(small?[65+col*40,88+row*44]:[274+col*53,91+row*60]):lerp(oldTarget,newTarget,expansion);
      const radius=isChair?(small?17:25):mix(small?14:17,small?8.5:11,expansion)*(inherited?1:expansion);
      const basis=governanceFlat.get(face.index),flat=expansion<=0?basis.original:basis.source.map((p,i)=>lerp(p,basis.destination[i],expansion));
      const original=face.verts.map(v=>project(rotate(v,yaw,pitch)));
      const points=original.map((point,i)=>lerp(point,[target[0]+flat[i][0]*radius,target[1]-flat[i][1]*radius,1],open));
      const center=points.reduce((a,p)=>add(a,scale(p,1/points.length)),[0,0,0]);
      centers.set(`${isChair?'chair':'floor'}:${index}`,center);
      const choice=(isChair?state.chairChoices:state.floorChoices)?.[index];
      const votedColor=castAt(choice)?choice.value==='yes'?(isChair?INK.yes:FLOOR_YES):choice.value==='no'?INK.no:INK.abstain:
        isChair?INK.vacant:INK.paperB;
      const baseColor=isChair?INK.vacant:INK.paperB;
      const color='#'+[1,3,5].map(i=>Math.round(mix(parseInt(votedColor.slice(i,i+2),16),parseInt(baseColor.slice(i,i+2),16),state.sphereReturn)).toString(16).padStart(2,'0')).join('');
      const n=unit(lerp(rotate(face.normal,yaw,pitch),[0,0,1],open));
      const light=.82+.23*Math.max(0,n[0]*.35+n[1]*.55+n[2]*.75);
      shell.push({type:'face',points,z:mix(original.reduce((sum,p)=>sum+p[2],0)/original.length,1,open),
        color:!inherited&&!(laterAdmissions.findIndex(f=>f.index===face.index)>=0&&laterAdmissions.findIndex(f=>f.index===face.index)<state.newMembers)?null:shade(color,light),stroke:face.index===augurFaceId&&open>.9?INK.bronze:INK.line});
    }
    // The landing's twelve loops rejoin the same body when this explanation closes.
    for(let id=0;id<12;id++) {
      const color=COLORS[id%3];
      const orbitVisibility=(1-open)*(1-focus);
      if(id<3&&orbitVisibility>0) {
        let segment=[],back=null;
        for(let j=0;j<=100;j++) {
          const p=project(scale(orbit(id,j*TAU/100),1.65)),behind=p[2]<0;
          if(back!==null&&back!==behind) {
            shell.push({type:'wire',points:segment.concat([p]),z:back?-3:3,color:color+Math.round((back?32:56)*orbitVisibility).toString(16).padStart(2,'0')});
            segment=[segment.at(-1),p];
          }else segment.push(p);
          back=behind;
        }
        if(segment.length>1)shell.push({type:'wire',points:segment,z:back?-3:3,color:color+Math.round((back?32:56)*orbitVisibility).toString(16).padStart(2,'0')});
      }
      // Match the inherited choreography at both seams, including agents
      // returning from their principals while the floor begins to grow.
      const oldLocal=t-6,transfer=smooth((oldLocal-1.8-id*.12)/.9)*(1-smooth((oldLocal-4.9-id*.025)/.7));
      const face=introFaces.find(f=>f.chair===id),to=add(rotate(face.normal,yaw,pitch),[0,0,.055]);
      const p=lerp(scale(orbit(id,t*.32),1.65),to,transfer),point=project(p);
      shell.push({type:'ball',point,z:p[2],r:4.2*4/(4-p[2])*orbitVisibility,color});
    }
    shell.sort((a,b)=>a.z-b.z);
    for(const item of shell) {
      if(item.type==='face')polygon(item.points,item.color,item.stroke,.7);
      else if(item.type==='wire')wire(item.points,item.color,.65);
      else ball(item.point,item.r,item.color);
    }
    if(local<1.8&&open<.97)return {governance:state,docking:{planet:'augur-civ-0:0',rung:expansion?3:2,faceId:augurFaceId,landed:true,expansion},caption:state.caption};
    // Retire the completed ballot before the enlarged body settles into Membership.
    ctx.save();ctx.globalAlpha*=1-smooth((local-15.8)/.28);
    const tallyY=small?228:294,gate=[(pentCenter+hexCenter)/2,small?285:355];
    const tallyP=[pentCenter,tallyY],tallyH=[hexCenter,tallyY];
    principalText('12 principals',pentCenter,pentY,small?17:19);
    principalText(`${Math.round(state.capacity)} hexagons`,hexCenter,hexY,small?17:19);
    principalText(`${state.chairYes} / 12`,pentCenter,tallyY,small?19:28);
    principalText(`${Math.round(state.floorYes/state.floorTotal*100)}%`,hexCenter,tallyY,small?19:28);
    principalText('SUM · 7 needed',pentCenter,tallyY+(small?18:24),13.5);
    principalText(state.sealed&&state.verdict===1?`${state.floorYes}/${state.floorTotal} · sealed vote`:'SUM · more than half',hexCenter,tallyY+(small?18:24),13.5);
    // Each side collects its own votes. The gate never substitutes one total for the other.
    const voteWire=(choices,kind,to,color)=>{
      for(const [i,choice] of choices.entries()) {
        const progress=(local-choice.at+.25)/.25;
        if(!state.active||choice.source==='child'||progress<=0||progress>=1)continue;
        const origin=centers.get(`${kind}:${i}`),target=[to[0],to[1]-14,0];
        wire([origin,target],color+'66',.6);
        ball(lerp(origin,target,progress),small?1.8:2.5,choice.value==='yes'?color:INK.no);
      }
    };
    voteWire(state.chairChoices,'chair',tallyP,INK.yes);
    voteWire(state.floorChoices,'floor',tallyH,FLOOR_YES);
    const rail=(from,passed)=>{
      const elbow=[from[0],gate[1]],end=[gate[0]+(from[0]<gate[0]?-21:21),gate[1]];
      wire([[from[0],from[1]+(small?23:31)],elbow,end],passed?INK.yes:INK.tether,passed?1.7:1);
    };
    rail(tallyP,state.chairPass);rail(tallyH,state.floorPass);
    principalText('AND',gate[0],gate[1]-15,13.5);
    const approved=state.sealed&&state.verdict===1;
    // Two independent leaves stay across the exit until both have passed.
    wire([[gate[0]-19,gate[1]-3],[gate[0]-7,gate[1]+(approved?-11:12)]],state.chairPass?INK.yes:INK.bronze,2);
    wire([[gate[0]+19,gate[1]-3],[gate[0]+7,gate[1]+(approved?-11:12)]],state.floorPass?INK.yes:INK.bronze,2);
    const result=state.sealed?(approved?(state.proposalId==='governance-II'?'Every chamber approves':'Both approve'):'Split decision · no action'):'Waiting for both';
    if(state.sealed)polygon([[gate[0],gate[1]+15],[gate[0]+3,gate[1]+18],[gate[0],gate[1]+21],[gate[0]-3,gate[1]+18]],INK.verdict[state.verdict],INK.line,.5);
    ctx.fillStyle=INK.ink2;
    ctx.font=`${small?13.5:17}px Georgia,serif`;ctx.textAlign='center';ctx.fillText(result,gate[0],gate[1]+39);
    principalText(state.label,gate[0],small?29:21,13.5);
    ctx.restore();
    return {governance:state,docking:{planet:'augur-civ-0:0',rung:expansion?3:2,faceId:augurFaceId,landed:true,expansion},caption:state.caption};
  }

  // The wiki contains concepts and provenance. Polyhedra remain governing bodies.
  function drawGossip(local,t) {
    const state=wikiMoment(local),layout=gossipBodies(local,t);
    const open=smooth((local-.35)/.9),nodes=layout.nodes;
    const byId=new Map(nodes.map(n=>[n.id,n]));
    const sessions=state.sessions,sessionById=new Map(sessions.map(s=>[s.id,s]));
    // Retain the grown floor's light while the camera reframes its family.
    const home=byId.get(rootSpec.id),halo=ctx.createRadialGradient(home.x,home.y,home.r*.25,home.x,home.y,home.r*2.45);
    halo.addColorStop(0,'#C99B3F12');halo.addColorStop(1,'#C99B3F00');
    ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    const EVIDENCE='#759AA8',PERSPECTIVE=INK.gold;
    const alpha=x=>Math.round(255*clamp(x)).toString(16).padStart(2,'0');
    const label=(text,x,y,size=16,color=INK.ink,align='left')=>{
      ctx.font=`${size}px Georgia,serif`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(text,x,y);
    };
    const diamond=(x,y,r,color,hollow=false)=>polygon([[x,y-r],[x+r,y],[x,y+r],[x-r,y]],hollow?INK.paperB:color,color,1);
    // Directed semantic paths always leave a source's right edge and enter its
    // target's left edge. Return citations do not imply a causal vote loop.
    const path=(a,b)=>{
      const bend=Math.max(24,Math.abs(b[0]-a[0])*.35);
      const p=[a,[Math.min(W-6,a[0]+bend),a[1]],[Math.max(6,b[0]-bend),b[1]],b];
      return Array.from({length:25},(_,i)=>{const u=i/24,v=1-u;return [0,1].map(k=>v*v*v*p[0][k]+3*v*v*u*p[1][k]+3*v*u*u*p[2][k]+u*u*u*p[3][k]);});
    };
    const feed=lightconeMoment(local),artifacts=artifactMoment(local,state,feed);
    const stream=small?{x:8,w:226,top:51,bottom:205,step:55,slots:3,port:[234,183]}:
      {x:14,w:310,top:84,bottom:254,step:63,slots:3,port:[324,232]};
    const rack=small?{x:258,top:54,concept:[344,159,124,74]}:{x:14,top:319,concept:[198,344,126,90]};
    const copyBoxes=new Map(nodes.filter(n=>!n.parent).map(n=>[n.id,small?
      [n.x-n.r-56,n.y-20,50,32]:[n.x-n.r-96,n.y-6,72,47]]));
    const revisionPort=[rack.concept[0]+rack.concept[2],rack.concept[1]+rack.concept[3]/2];
    const socketById=new Map();
    const colorOf=e=>({evidence:EVIDENCE,receipt:EVIDENCE,support:PERSPECTIVE,
      amend:PERSPECTIVE,challenge:INK.no,pass:INK.yes,reject:INK.no,split:INK.verdict[3]})[e.color]||PERSPECTIVE;
    // Walk the actual tree, attaching each edge to its bound pentagon. The
    // growth tree keeps the same DFS paint order, including both grandchildren.
    function paintBody(node,parentSockets=null) {
      const ballot=sessionById.get(node.id),children=nodes.filter(n=>n.parent===node.id);
      const inheritedRoot=node.id===rootSpec.id;
      if(parentSockets){
        const socket=parentSockets.get(node.chair),center=[node.x,node.y];
        const color=ballot.sealed?INK.verdict[ballot.verdict]:INK.tether;
        wire([socket,center],color+'A0',node.growthId?.startsWith('leaf') ? .8 : 1);
      }
      const sockets=chamber({...node,phase:3,local,childSockets:children.map(n=>n.chair),ballot,
        ...(inheritedRoot?{facesOverride:matureFaces,vacantFaces:matureVacancies,floorFaceIds:matureFloorIds,orbitRoot:true}:{})});
      socketById.set(node.id,sockets);
      children.forEach(child=>paintBody(child,sockets));
      const origin=sessionById.get(node.polisId+'-root');
      const wave=(local-origin.sealAt-.3)/1.2;
      if(!node.parent&&origin.sealed&&wave>=0&&wave<1){
        ctx.beginPath();ctx.arc(node.x,node.y,node.r+wave*(small?100:180),0,TAU);
        ctx.strokeStyle=INK.verdict[origin.verdict]+alpha((1-wave)*.45);ctx.lineWidth=2;ctx.stroke();
      }
      if(ballot.sealed&&origin.sealed&&ballot.verdict!==origin.verdict)
        diamond(node.x+node.r+6,node.y,4.5,INK.verdict[ballot.verdict]);
      if(!node.parent&&open>0){
        const baseline=node.y+node.r*(small?1.15:1.7)+(small?15:16),polis=state.polises.find(p=>p.rootId===node.id);
        label(polis.name,node.x,baseline,small?16:17,INK.ink+alpha(open),'center');
        const caption=polis.adopted?'v2 accepted':ballot.sealed?(ballot.verdict===1?'publishing v2':ballot.verdict===3?'split · v1 kept':'rejected · v1 kept'):'revision under vote';
        label(local<5?'one batch':caption,node.x,baseline+(small?16:18),small?14:13,INK.ink2+alpha(open),'center');
      }
    }
    nodes.filter(n=>!n.parent).forEach(n=>paintBody(n));
    if(layout.progress<1)drawTreasury(20,layout.progress);
    // Every moving packet and row consumes the same immutable flight schedule.
    // A journal leg is a visible projection of a received record, never a vote.
    const endpoint=port=>{
      if(port.node==='journal')return stream.port;
      if(port.node==='artifact')return revisionPort;
      const node=byId.get(port.node);
      if(!node)throw new Error(`Unknown flight endpoint ${port.node}`);
      if(port.port==='chair')return socketById.get(node.id).get(port.index);
      if(port.port==='publication'||port.port==='replica'){
        const [x,y,w,h]=copyBoxes.get(node.id);
        return port.port==='publication'?[x+w,y+h/2]:[x+8,y+h-4];
      }
      if(port.port==='source')return [node.x-node.r*.8,node.y-node.r*.78-(port.index||0)*11];
      if(port.port==='agent'){
        // The reporting agent's actual orbit, with its persistent body clock.
        const p=scale(orbit(port.index,node.t*.32),node.id===rootSpec.id?1.65:1.5);
        const factor=node.r*4/(4-p[2]);return [node.x+p[0]*factor,node.y-p[1]*factor];
      }
      return [node.x,node.y];
    };
    // The document trail survives the scrolling journal. These are the records
    // being discussed, with references and seals, rather than another event list.
    function folio(box,color,arrivedAt=-1) {
      const [x,y,w,h]=box,fold=Math.min(8,w*.16),age=local-arrivedAt;
      const glow=arrivedAt>=0?1-clamp(age/.7):0;
      polygon([[x+3,y-3],[x+w+2,y-3],[x+w+2,y+h-3],[x+3,y+h-3]],INK.paperB,INK.line,.6);
      polygon([[x,y],[x+w/2,y],[x+w-fold,y],[x+w,y+fold],
        [x+w,y+h/2],[x+w,y+h],[x+w/2,y+h],[x,y+h]],INK.paperB,color, .85+glow*.8);
      wire([[x+w-fold,y],[x+w-fold,y+fold],[x+w,y+fold]],color,.7);
      if(glow>0)wire([[x,y+h],[x+w*glow,y+h]],color,2);
    }
    function docText(value,x,y,size,color=INK.ink,maxWidth=200) {
      ctx.font=`${size}px Georgia,serif`;ctx.textAlign='left';ctx.fillStyle=color;
      ctx.fillText(value,x,y,maxWidth);
    }
    function seal(x,y,name,at) {
      const age=local-at,press=1+.18*Math.sin(clamp(age/.28)*Math.PI);
      ctx.beginPath();ctx.arc(x,y,6.5*press,0,TAU);ctx.fillStyle=INK.yes;ctx.fill();
      ctx.strokeStyle=INK.ink2;ctx.lineWidth=.6;ctx.stroke();
      ctx.font='9px Georgia,serif';ctx.textAlign='center';ctx.fillStyle=INK.ink;ctx.fillText(name,x,y+3);
    }
    function drawArtifacts() {
      if(open<=0)return;
      ctx.save();ctx.globalAlpha=open;
      const {x,top}=rack;
      const evidenceBoxes=small?[[x,top+14,72,36],[x,top+59,72,36]]:
        [[x,top+10,70,43],[x,top+66,70,43]];
      const reportBoxes=small?[[344,top+14,55,36],[413,top+14,55,36],[344,top+59,55,36],[413,top+59,55,36]]:
        [[101,top+13,39,36],[148,top+13,39,36],[101,top+69,39,36],[148,top+69,39,36]];
      docText('Evidence',x,top,small?14:13,EVIDENCE,80);
      docText('Reports',small?344:101,top,small?14:13,INK.bronze,85);
      if(!small)docText('Shared concept',198,top,13,INK.bronze,126);
      for(const report of artifacts.reports) {
        const index=Number(report.id.slice(1))-1,b=reportBoxes[index];
        for(const id of report.evidenceIds) {
          if(!artifacts.evidence.some(e=>e.id===id))continue;
          const source=evidenceBoxes[Number(id.slice(1))-1];
          wire(path([source[0]+source[2],source[1]+source[3]/2],[b[0],b[1]+b[3]/2]),EVIDENCE+'55',.65);
        }
        if(artifacts.concept) {
          const c=rack.concept;
          wire(path([b[0]+b[2],b[1]+b[3]/2],[c[0],c[1]+c[3]/2]),INK.gold+'60',.65);
        }
      }
      artifacts.evidence.forEach(e=>{
        const box=evidenceBoxes[Number(e.id.slice(1))-1],[x,y,w]=box;
        folio(box,EVIDENCE,e.arrivedAt);
        docText(e.id+' · measured',x+5,y+13,small?11:10,EVIDENCE,w-9);
        docText(e.id==='E1'?'124 to 91 Wh':'139 Wh · hot',x+5,y+28,small?13:12,INK.ink,w-9);
      });
      artifacts.reports.forEach(r=>{
        const box=reportBoxes[Number(r.id.slice(1))-1],[x,y,w]=box;
        const color=r.interpretation.stance==='challenge'?INK.no:INK.bronze;
        folio(box,color,r.arrivedAt);
        docText(r.id+' · agent',x+4,y+14,small?13:11,color,w-8);
        docText(r.evidenceIds.join('+'),x+4,y+28,small?11:10,INK.ink2,w-8);
      });
      if(artifacts.concept) {
        const c=artifacts.concept,[x,y,w,h]=rack.concept;
        folio(rack.concept,INK.bronze,c.arrivedAt);
        docText(c.version===2?'Accepted v2':'Proposed v2',x+7,y+17,small?15:14,INK.ink,w-14);
        docText('Lower energy',x+7,y+34,small?13:12,INK.ink2,w-14);
        docText('under normal load',x+7,y+48,small?12:11,INK.ink2,w-14);
        if(!small)docText('Heat exception kept',x+7,y+63,11,c.challenged?INK.no:INK.ink2,w-14);
        if(c.challenged)wire([[x+4,y+4],[x+4,y+h-4]],INK.no,1.8);
        c.seals.forEach((s,i)=>seal(x+15+i*21,y+h-10,s.id==='p1'?'I':'III',s.arrivedAt));
        if(!c.seals.length)docText('awaiting seals',x+7,y+h-8,small?11:10,INK.bronze,w-14);
      }
      for(const copy of artifacts.copies) {
        const box=copyBoxes.get(copy.rootId),[x,y,w,h]=box,node=byId.get(copy.rootId);
        // The publication lands on the folio's right edge; a replica lands on
        // its lower left edge. Receipt never changes the adopted-version title.
        wire([[x+w,y+h/2],[node.x-node.r*.9,node.y]],INK.bronze+'60',.65);
        folio(box,copy.adopted?INK.bronze:INK.line,copy.adopted?copy.publishAt:-1);
        docText('Cooling · v'+copy.version,x+5,y+13,small?11:12,INK.ink,w-10);
        wire([[x+6,y+19],[x+w-10,y+19]],INK.line,.75);
        if(copy.adopted)seal(x+w-11,y+h-10,copy.id==='p1'?'I':'III',copy.publishAt);
        else if(!small)docText('local version',x+5,y+31,10,INK.ink2,w-10);
        if(copy.received) {
          const pulse=1-clamp((local-copy.receivedAt)/.6);
          docText('v2 copy',x+5,y+h-5,small?9:10,EVIDENCE,w-22);
          wire([[x+3,y+h],[x+w*(.6+.4*pulse),y+h]],EVIDENCE,1.2);
        }
      }
      ctx.restore();
    }

    drawArtifacts();
    const eventsById=new Map(lightconeEvents.map(e=>[e.id,e]));
    const flights=lightconeFlights.filter(leg=>local+LOAD_EPS>=leg.start&&local<=leg.end+.26+LOAD_EPS);
    for(const leg of flights){
      const from=endpoint(leg.from),to=endpoint(leg.to),color=colorOf(leg);
      const points=leg.kind==='mandate'||leg.kind==='publication'?[from,to]:path(from,to);
      const after=Math.max(0,local-leg.end),opacity=(1-after/.26)*Math.max(.25,open);
      wire(points,color+alpha(.48*opacity),leg.kind==='journal'?1.2:1);
      if(local<=leg.end+LOAD_EPS){
        const u=flightProgress(local,leg),v=u*(points.length-1),i=Math.floor(v);
        const at=lerp(points[i],points[Math.min(points.length-1,i+1)],v-i);
        if(['proposal','replica','publication'].includes(leg.kind)){
          folio([at[0]-8,at[1]-10,16,20],color);
          wire([[at[0]-4,at[1]-2],[at[0]+4,at[1]-2]],color,.7);
          wire([[at[0]-4,at[1]+2],[at[0]+2,at[1]+2]],color,.7);
        }
        const notice=['journal','relay','notice','ack'].includes(leg.kind);
        diamond(at[0],at[1],leg.kind==='journal'?4.3:4,color,notice);
        const event=eventsById.get(leg.eventId);
        const tag=event?.id.startsWith('evidence-')||event?.id.startsWith('report-')?event.sourceIds[0]:
          leg.kind==='ack'?'ACK':leg.kind==='relay'?'relay':null;
        if(tag)label(tag,at[0]+7,at[1]-7,small?14:11,color);
      }else{
        // Arrival visibly lands at the endpoint on dropped as well as exact frames.
        const u=after/.26;
        diamond(to[0],to[1],4.3+u*6,color+alpha((1-u)*open),true);
      }
    }
    if(open<=0)return state;
    // The observer's past opens above the newest arrival. No second playback
    // queue can hide a landed record or delay it behind an unrelated timer.
    const text=(value,x,y,size,color,maxWidth=stream.w-40)=>{
      ctx.font=`${size}px Georgia,serif`;ctx.textAlign='left';ctx.fillStyle=color;
      ctx.fillText(value,x,y,maxWidth);
    };
    const center=stream.x+stream.w/2;
    const topInset=small?44:34;
    const left=[[stream.x,stream.bottom+14],[stream.x+topInset,stream.top]];
    const right=[[stream.x+stream.w,stream.bottom+14],[stream.x+stream.w-topInset,stream.top]];
    polygon([left[0],left[1],right[1],right[0]],INK.paperB+alpha(.21*open),null);
    for(const rail of [left,right]){
      wire(rail,INK.gold+alpha(.42*open),.8);
      const outer=rail.map(([x,y])=>[x+(x<center?-6:6),y]);
      wire(outer,INK.gold+alpha(.15*open),.65);
    }
    // Make room as the packet approaches, so a burst never stacks new text
    // over an older row. No future record is shown before its arrival.
    const lift=e=>smooth((local-e.arrivedAt+.18)/.18);
    const shift=lightconeEvents.reduce((sum,e)=>sum+lift(e),0);
    for(let i=0;i<7;i++){
      const u=((i+shift)/7)%1,y=mix(stream.bottom+12,stream.top,u);
      const inset=topInset*u;
      wire([[stream.x+inset,y],[stream.x+stream.w-inset,y-4]],INK.gold+alpha(.10*open*(1-u)),.7);
    }
    if(small){
      text('Cooling efficiency',14,23,22,INK.ink+alpha(open),250);
      text('LOCAL LIGHTCONE',282,22,14,INK.bronze+alpha(open),185);
    }else{
      text('LOCAL LIGHTCONE',24,29,12,INK.bronze+alpha(open));
      text('Cooling efficiency',24,57,27,INK.ink+alpha(open));
    }
    // Clip only the feed; the right-hand chamber geometry never inherits it.
    ctx.save();ctx.beginPath();ctx.rect(stream.x,stream.top,stream.w,stream.bottom-stream.top);ctx.clip();
    const rows=feed.timeline.slice(-(stream.slots+1));
    for(const e of rows){
      const pos=lightconeEvents.indexOf(e);
      const depth=lightconeEvents.slice(pos+1).reduce((sum,next)=>sum+lift(next),0);
      const enter=clamp(spring((local-e.presentAt)/.24));
      const y=stream.bottom-50-depth*stream.step;
      const topFade=clamp((y-stream.top+12)/25),a=open*(.35+.65*enter)*topFade;
      if(a<.005||y+53<stream.top)continue;
      const inset=10+Math.min(depth,stream.slots)*4;
      const x=stream.x+inset+(1-enter)*14;
      const width=stream.w-inset*2;
      const color=colorOf(e),strong=depth<1.6?1:.77;
      // A short lit edge gives each entry a source color without recoloring
      // the evidence to match an opinion or a successful vote.
      polygon([[x-3,y-3],[x+width,y-3],[x+width-3,y+50],[x-3,y+50]],INK.paperB+alpha(a*(depth<.8?.8:.36)),null);
      wire([[x-5,y],[x-5,y+43]],color+alpha(a*.8),1.6);
      const metadata=e.kind==='interpretation'&&e.id.startsWith('report-')?e.title:
        e.kind==='evidence'?`MEASURED · ${e.sourceIds[0]}`:
        e.kind==='challenge'?'AGENT IV · CHALLENGE':
        e.kind==='adoption'?'VERSION ACCEPTED':e.kind==='verdict'?'CHAMBER VERDICT':
        e.childId?'CHILD MANDATE':e.kind==='receipt'?'REPLICA RECEIPT':'PROPOSED REVISION';
      const title=e.kind==='interpretation'&&e.id.startsWith('report-')?e.body:e.title;
      const detail=e.kind==='interpretation'&&e.id.startsWith('report-')?
        `${e.sourceIds[0]} · ${e.sourceIds.filter(id=>/^E\d/.test(id)).join(' + ')} cited`:
        e.kind==='evidence'?'Illustrated measurement record':e.body;
      text(metadata,x+3,y+10,small?15:12,color+alpha(a),width-55);
      text(`${e.arrivedAt.toFixed(1)}s`,x+width-33,y+10,small?13:11,INK.ink2+alpha(a),33);
      text(title,x+3,y+29,small?20:18,INK.ink+alpha(a*strong),width-5);
      text(detail,x+3,y+46,small?16:13,INK.ink2+alpha(a*strong),width-5);
    }
    ctx.restore();
    const frontierY=small?227:280;
    wire([[stream.x,frontierY-10],[stream.x+stream.w,frontierY-10]],INK.gold+alpha(.45*open),.8);
    ball([stream.x+5,frontierY-2],2.5*open,feed.latest?colorOf(feed.latest):INK.gold);
    text('Polis I · received here',stream.x+17,frontierY+2,small?14:13,INK.ink2+alpha(open),small?155:220);
    if(feed.inFlightCount)text(`${feed.inFlightCount} in flight`,stream.x+stream.w-(small?54:84),frontierY+2,small?12:12,INK.bronze+alpha(open),small?54:84);
    return state;
  }

  function drawIdentity(local,t) {
    const alpha=x=>Math.round(clamp(x)*255).toString(16).padStart(2,'0');
    const beat=t*TAU/60;
    const page=small?[207,99]:[219,230],r=small?47:76,half=Math.sqrt(3)*r/2;
    const closing=smooth((local-4.05)/.35);
    const hinge=page[0]-half,opening=smooth((local-.12)/1.05)*(1-closing),angle=opening*Math.PI*.94;
    const points=Array.from({length:6},(_,i)=>[page[0]+r*Math.sin(i*TAU/6),page[1]-r*Math.cos(i*TAU/6)]);
    const text=(value,x,y,size,color=INK.ink)=>{
      ctx.font=`${size}px Georgia,serif`;ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(value,x,y);
    };
    const hex=(x,y,size)=>Array.from({length:6},(_,i)=>[x+size*Math.sin(i*TAU/6),y-size*Math.cos(i*TAU/6)]);
    const mark=(x,y,size,color=INK.bronze)=>{
      // The same six-sided bearer mark stays on the passport and every visa.
      polygon(hex(x,y,size),INK.paperB,color,1);
      wire([[x-size*.48,y+size*.24],[x,y-size*.47],[x+size*.48,y+size*.24]],color,.9);
      wire([[x,y-size*.47],[x,y+size*.52]],color,.8);
    };
    const curve=(a,b,bend)=>Array.from({length:41},(_,i)=>{
      const u=i/40,v=1-u;
      return [v*v*v*a[0]+3*v*v*u*(a[0]+bend)+3*v*u*u*(b[0]-bend*.45)+u*u*u*b[0],
        v*v*v*a[1]+3*v*v*u*(a[1]-25)+3*v*u*u*(b[1]+25)+u*u*u*b[1]];
    });
    // A civilization is a solar system: its star and several distinct worlds.
    // Unequal capacities and tilted orbital planes avoid cloned little balls.
    const poses=small?[
      [42,42,25,17,-.3],[364,75,59,26,.22],[411,229,39,25,-.4],
      [287,338,53,24,.3],[84,327,49,24,-.35],[212,232,46,23,-.45],
    ]:[
      [449,88,75,35,-.3],[758,75,94,29,.16],[869,246,63,43,-.4],
      [689,354,87,36,.3],[432,346,64,30,-.35],[633,212,81,36,-.45],
    ];
    const names=['Research','Build','Trade','Explore','Create','Learn'];
    const families=[[2,1,3],[3,1,2,1],[2,4],[4,2,1,3,1],[1,3,2],[3,1,2,4]];
    const systems=poses.map(([x,y,rx,ry,tilt],i)=>{
      const launch=.95+i*.38,arrivalAt=launch+.62+(i%3)*.09;
      const opening=smooth((local-arrivalAt)/.36);
      const orbit=(j,u)=>{
        const ellipse=j===0?1:.55+.14*j;
        const a=u+(.42+i*.71+j*TAU/families[i].length);
        const ox=Math.cos(a)*rx*ellipse,oy=Math.sin(a)*ry*ellipse;
        return [x+ox*Math.cos(tilt)-oy*Math.sin(tilt),y+ox*Math.sin(tilt)+oy*Math.cos(tilt)];
      };
      const planets=families[i].map((rung,j)=>({
        rung,point:orbit(j,beat*(j%2?1:-1)),r:(small?7:11)+(j===0?(small?3:5):((i+j)%3)*1.5),
        yaw:beat*(j%2?1:-1)+i*.6+j,pitch:.2*Math.sin(beat+i+j),
      }));
      return {id:'augur-civ-'+i,name:names[i],x,y,rx,ry,tilt,orbit,planets,launch,arrivalAt,open:opening};
    });
    const focus=smooth((local-4.4)/1.6),landing=smooth((local-4.4)/.95),landed=local+LOAD_EPS>=5.35;
    const selected=systems[0].planets[0],center=lerp(selected.point,[W/2,small?226:230],focus);
    const zoom=mix(1,(small?82:108)/selected.r,focus);
    const body={x:center[0],y:center[1],r:selected.r*zoom,rung:2,
      yaw:mix(selected.yaw,.28+.32*Math.sin(t*TAU/18),focus),
      pitch:mix(selected.pitch,-.18+.08*Math.sin(t*.5),focus)};
    const view=p=>[center[0]+(p[0]-selected.point[0])*zoom,center[1]+(p[1]-selected.point[1])*zoom];
    const faceProject=v=>{const p=rotate(v,body.yaw,body.pitch),z=body.r*4/(4-p[2]);return [body.x+p[0]*z,body.y-p[1]*z];};
    const seat=augurFace.verts.map(faceProject);
    const docking={planet:'augur-civ-0:0',rung:2,faceId:augurFaceId,landingAt:5.35,landed,progress:landing,focus,body,seat};
    ctx.save();ctx.globalAlpha=1-focus;
    // A sparse, slowly turning star field. No new random layout on each frame.
    for(let i=0;i<44;i++){
      const x=12+((i*137.31)%(W-24)),y=16+((i*71.17)%(H-32));
      const glow=.12+.12*(.5+.5*Math.sin(beat*2+i));
      wire([view([x-1.2,y]),view([x+1.2,y])],INK.bronze+alpha(glow),.6);
      if(i%5===0)wire([view([x,y-1.2]),view([x,y+1.2])],INK.bronze+alpha(glow),.6);
    }
    const passportPort=[page[0]+half*.78,page[1]-r*.06];
    // Requests follow the same passport out. Doors respond to their arrival,
    // rather than all destinations lighting merely because an identity exists.
    for(const system of systems){
      const target=system.planets[0].point,route=curve(passportPort,target,small?35:90);
      wire(route.map(view),INK.gold+alpha(.10+system.open*.3),.85);
      const progress=clamp((local-system.launch)/(system.arrivalAt-system.launch));
      if(local>=system.launch&&local<=system.arrivalAt){
        const at=progress*(route.length-1),n=Math.floor(at),p=lerp(route[n],route[Math.min(n+1,route.length-1)],at-n);
        const atView=view(p);mark(atView[0],atView[1],(small?5.5:7.5)*zoom,INK.bronze);
      }
    }
    const planet=p=>{
      const project=v=>{const scale=p.r*4/(4-v[2]);return view([p.point[0]+v[0]*scale,p.point[1]-v[1]*scale]);};
      const faces=skins.get(p.rung).map(f=>{
        const verts=f.verts.map(v=>rotate(v,p.yaw,p.pitch)),n=rotate(f.normal,p.yaw,p.pitch);
        return {points:verts.map(project),z:verts.reduce((s,v)=>s+v[2],0)/verts.length,n,chair:f.chair};
      }).sort((a,b)=>a.z-b.z);
      for(const f of faces){
        const light=.82+.23*Math.max(0,f.n[0]*.35+f.n[1]*.55+f.n[2]*.75);
        polygon(f.points,shade(f.chair>=0?INK.vacant:INK.paperB,light),INK.line,small?.4:.55);
      }
    };
    for(const [i,system] of systems.entries()){
      const {x,y,rx,ry,tilt,planets,open}=system;
      const [vx,vy]=view([x,y]);
      const aura=ctx.createRadialGradient(vx,vy,0,vx,vy,rx*zoom*1.1);
      aura.addColorStop(0,'#C99B3F'+alpha(.10+open*.12));aura.addColorStop(1,'#C99B3F00');
      ctx.fillStyle=aura;ctx.fillRect(vx-rx*zoom*1.2,vy-rx*zoom*1.2,rx*zoom*2.4,rx*zoom*2.4);
      for(let j=0;j<planets.length;j++){
        const ring=Array.from({length:81},(_,k)=>system.orbit(j,k*TAU/80));
        wire(ring.map(view),COLORS[(i+j)%3]+alpha(.17+open*.13),.65);
      }
      // The star is distinct from its polygonal worlds, with a rotating corona.
      const sr=(small?3.6:5.8)*(1+.07*Math.sin(beat*3+i));
      for(let k=0;k<8;k++){
        const a=k*TAU/8+beat,inside=sr*1.45,out=sr*(k%2?2:2.8);
        wire([view([x+Math.cos(a)*inside,y+Math.sin(a)*inside]),view([x+Math.cos(a)*out,y+Math.sin(a)*out])],INK.gold+'77',.7);
      }
      ball(view([x,y]),sr*zoom,INK.gold);
      planets.filter(p=>p!==selected).forEach(planet);
      if(open>0){
        const [gx,gy]=view(planets[0].point),size=planets[0].r*zoom*1.5;
        // Six leaves open radially from an admitted world's threshold.
        const rim=hex(gx,gy,size);
        for(let k=0;k<6;k++){
          const a=rim[k],b=rim[(k+1)%6],mid=[(a[0]+b[0])/2-gx,(a[1]+b[1])/2-gy];
          const offset=scale(mid,open*.32),edge=[add(a,offset),add(b,offset)];
          wire(edge,INK.gold+alpha(.28+.6*open),1.2);
        }
        mark(gx+size*.82,gy-size*.82,small?4.5:6,INK.bronze);
        const pulse=clamp((local-system.arrivalAt)/.75);
        if(pulse<1){ctx.beginPath();ctx.arc(gx,gy,size*(1+.8*pulse),0,TAU);ctx.strokeStyle=INK.gold+alpha((1-pulse)*.7);ctx.lineWidth=1;ctx.stroke();}
      }
      const labelY=y+Math.abs(rx*Math.sin(tilt))+Math.abs(ry*Math.cos(tilt))+(small?19:23);
      const labelPos=view([x,labelY]);text(system.name,...labelPos,small?15:17,open>.5?INK.bronze:INK.ink2);
    }
    ctx.restore();
    // The same illumination is carried into the next phase with the world.
    const halo=ctx.createRadialGradient(body.x,body.y,body.r*.25,body.x,body.y,body.r*2.45);
    halo.addColorStop(0,'#C99B3F'+alpha(.07*focus));halo.addColorStop(1,'#C99B3F00');
    ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    // The selected world's actual face is vacant until the bearer settles.
    chamber({...body,t,phase:3,local,facesOverride:introFaces,orbitRoot:true,
      vacantFaces:landed?null:new Set([augurFaceId]),agentReveal:focus});
    if(local>=4.4){
      // Close the book into its six-sided cover, then rotate that same face
      // into its destination vertices. There is no separate icon at touchdown.
      const area=vertices=>vertices.reduce((sum,p,i)=>{const q=vertices[(i+1)%vertices.length];return sum+p[0]*q[1]-q[0]*p[1];},0);
      // Screen-facing surface order is reversed relative to the flat cover.
      // Align winding before corner matching so the passport never folds through itself.
      const from=area(points)*area(seat)<0?[...points].reverse():points;
      let offset=0,cost=Infinity;
      for(let k=0;k<6;k++){
        const next=seat.reduce((sum,q,j)=>sum+(q[0]-from[(j+k)%6][0])**2+(q[1]-from[(j+k)%6][1])**2,0);
        if(next<cost){cost=next;offset=k;}
      }
      const flying=seat.map((to,i)=>lerp(from[(i+offset)%6],to,landing));
      const normal=rotate(augurFace.normal,body.yaw,body.pitch);
      const light=.82+.23*Math.max(0,normal[0]*.35+normal[1]*.55+normal[2]*.75);
      const ink=shade(INK.paperB,light);
      const targetRgb=ink.match(/\d+/g).map(Number),coverRgb=[221,208,173];
      const surface=`rgb(${targetRgb.map((v,i)=>Math.round(mix(coverRgb[i],v,landing))).join(',')})`;
      if(!landed)polygon(flying,surface,landing>.9?INK.line:INK.bronze,mix(1.4,.7,landing));
      const center=flying.reduce((a,p)=>[a[0]+p[0]/6,a[1]+p[1]/6],[0,0]);
      const badge=(small?14:22)*(1-landing)+(small?3:4)*landing;
      const memory=1-smooth((local-5.35)/.5);
      if(memory>0){ctx.save();ctx.globalAlpha=memory;mark(center[0],center[1],badge);ctx.restore();}
      return {identity:true,passport:{sides:6,opening:0,center},docking,systems:systems.map(s=>({id:s.id,planets:s.planets.length,arrivalAt:s.arrivalAt,open:s.open})),
        caption:landed?'The chairs need the members. The members need the chairs.':'Your Augur settles into a hexagon of this world.'};
    }
    // The passport has a hexagonal silhouette even when closed. Its left
    // edge is a real hinge; the cover opens to a second six-sided page.
    polygon(points.map(([x,y])=>[x+3,y+4]),'#D9CEB7',INK.bronze,.7);
    polygon(points,INK.paperB,INK.bronze,1.4);
    polygon(points.map(([x,y])=>[page[0]+(x-page[0])*.89,page[1]+(y-page[1])*.89]),null,'#C99B3F66',.65);
    mark(page[0],page[1]-r*.13,r*.30);
    text('AUGUR',page[0],page[1]+r*.35,small?13:18,INK.bronze);
    text('PASSPORT',page[0],page[1]+r*.57,small?9:11,INK.ink2);
    const pageProject=([x,y])=>[hinge+(x-hinge)*Math.cos(angle),y+(x-hinge)*Math.sin(angle)*.14];
    const cover=points.map(pageProject);
    polygon(cover,opening<.53?'#DDD0AD':INK.paperB,INK.bronze,1.4);
    const coverCenter=pageProject(page);
    if(opening<.48){
      const markPoints=hex(page[0],page[1],r*.34).map(pageProject);
      polygon(markPoints,null,INK.bronze,1.2);
      const spine=[pageProject([page[0]-r*.16,page[1]+r*.43]),pageProject([page[0]+r*.16,page[1]+r*.43])];
      wire(spine,INK.bronze,1.2);
    }else if(opening>.67){
      const cw=Math.abs(Math.cos(angle));
      mark(coverCenter[0],coverCenter[1]-r*.20,r*.18*cw);
      for(let k=0;k<4;k++)wire([[coverCenter[0]-r*.31*cw,coverCenter[1]+r*(.13+k*.11)],
        [coverCenter[0]+r*(k===3?.12:.31)*cw,coverCenter[1]+r*(.13+k*.11)]],INK.tether,.85);
      text('IDENTITY',coverCenter[0],coverCenter[1]-r*.49,small?8:10,INK.ink2);
    }
    wire([[hinge,page[1]-r*.5],[hinge,page[1]+r*.5]],INK.bronze,1.4);
    const labelX=small?174:160,labelY=small?181:365;
    text('Augur passport',labelX,labelY,small?23:28);
    return {identity:true,passport:{sides:6,opening,center:page},docking,systems:systems.map(s=>({id:s.id,planets:s.planets.length,arrivalAt:s.arrivalAt,open:s.open})),
      caption:'Your agent can work for you. Its journey begins with your Augur passport.'};
  }
  function drawPhase(publicPhase,local,t) {
    const text=(value,x,y,size,color=INK.ink,align='center')=>{
      ctx.font=`${size}px Georgia,serif`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(value,x,y);
    };
    if(publicPhase===0)return drawIdentity(local,t);
    if(publicPhase===1)return drawGovernance(local,t);
    // Chamber internals keep their original local phases and timings.
    const phase=publicPhase-1;
    if(phase===3){const gossip=drawGossip(local,t);return {gossip,caption:gossip.caption};}
    const department=phase===2?departmentMoment(local):null;
    const formation=department&&local<DEPARTMENT_SECONDS;
    const departmentLocal=local;
    if(phase===2)local=Math.max(0,local-DEPARTMENT_SECONDS);
    const growth=phase===2?(formation?department:growthMoment(local)):null;
    if(growth&&local>=15.1){
      drawGossip(local-16,t);
      return {growth,caption:growth.caption};
    }
    if(growth)prepareGrowth();
    const branch=phase===2?smooth((departmentLocal-.05)/.85):0;
    const roleReveal=0;
    const cx=W/2-branch*(small?56:100)+roleReveal*(small?65:135),cy=small?226:230;
    const floorSize=growth?mix(GROWTH_ROUNDS[growth.round].from,GROWTH_ROUNDS[growth.round].to,growth.expansion):80;
    const r=(small?82:108)*mix(1,Math.sqrt(floorSize/80),branch)*(1-roleReveal*(small?.29:.20));
    const treasury=growth?(small?[409,326]:[830,360]):null;
    const yaw=.28+.32*Math.sin(t*TAU/18),pitch=-.18+.08*Math.sin(t*.5);
    // A soft light under the geometry, never a transparency applied to its faces.
    const halo=ctx.createRadialGradient(cx,cy,r*.25,cx,cy,r*2.45);
    halo.addColorStop(0,'#C99B3F12');halo.addColorStop(1,'#C99B3F00');
    ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    const childSockets=department?[9,4,5].filter(chair=>department.born.includes('child-'+chair)):[];
    const introductory=phase===0,expansion=introductory?smooth((local-4.6)/1.4):0;
    const growingFaces=growth?growthPlans[growth.round].at(growth.expansion):introductory?introAt(expansion):null;
    const rootBallot=growth?(formation?department.root:growthChamberVote(local)):null;
    const facePorts=formation?new Map():null;
    const principalPorts=introductory?new Map():null;
    const sockets=chamber({x:cx,y:cy,r,rung:3,yaw,pitch,t,phase,local:formation?departmentLocal:local,root:true,childSockets,facesOverride:growingFaces,growth:formation?null:growth,treasury,ballot:rootBallot,intro:introductory,facePorts,floorFaceIds:formation?floorFaces.filter(f=>f.index!==expelled).map(f=>f.index):null,
      principalView:introductory?{amount:roleReveal}:null,chairPorts:principalPorts});
    const principals=null;
    if(branch>.001) {
      // Different capacities, scales, directions and birth times, connected to real chairs.
      const family=growthBodies(t);
      const children=family.filter(n=>n.parent===rootSpec.id);
      for(const [i,child] of children.entries()) {
        const birth=smooth((departmentLocal-DEPARTMENT_BIRTHS[child.growthId])/.85);
        const socket=sockets.get(child.chair),to=[child.x,child.y];
        const reveal=smooth((departmentLocal-.12-i*.09)/.8);
        const center=lerp(socket,to,reveal);
        // A department is first the parent's pentagonal role, with its own
        // incoming work. The same role unfolds into a team only after a seal.
        if(formation&&birth<1&&reveal>0){
          const radius=(small?18:26)*reveal;
          const plate=Array.from({length:5},(_,j)=>{
            const a=-Math.PI/2+j*TAU/5;return [center[0]+Math.cos(a)*radius,center[1]+Math.sin(a)*radius];
          });
          ctx.save();ctx.globalAlpha=1-birth;
          wire([socket,center],INK.tether+'88',.8);
          polygon(plate,INK.vacant,INK.bronze,.8);
          ball([center[0],center[1]],small?2.6:3.5,COLORS[i]);
          ctx.restore();
        }
        if(formation&&i===0){
          text('Service department',child.x,child.y+(small?54:80),small?13:17,INK.bronze);
          if(departmentLocal>=4.55)text('One parent voice',child.x,child.y+(small?71:100),small?11:13.5,INK.ink2);
          // Work comes from actual occupied member faces. Deterministic travel
          // jitter changes the queue only when the matching packet arrives.
          const sources=[...facePorts.values()].filter(p=>p.face.chair<0&&p.face.index!==expelled&&p.normal[2]>.05);
          let delivered=0;
          for(let k=0;k<22;k++){
            const launch=.18+k*.075+(k%3)*.018,travel=.42+(k%4)*.06;
            const p=(departmentLocal-launch)/travel;
            if(p>=1)delivered++;
            if(p<=0||p>=1||!sources.length)continue;
            const from=sources[(k*7)%sources.length].point;
            wire([from,center],'#759AA83D',.65);
            ball(lerp(from,center,p),small?1.6:2.3,COLORS[2]);
          }
          if(departmentLocal<2.4)text(`${delivered} requests received`,child.x,child.y+(small?72:101),small?11:13.5,INK.ink2);
        }
        if(birth<=.001)continue;
        const childBallot=formation?(i===0?department.team:null):growthChamberVote(local,child.growthId);
        const tint=childBallot?.sealed&&!childBallot.released?INK.verdict[childBallot.verdict]:INK.tether;
        wire([socket,center],tint+'A0',1);
        const sub=chamber({x:center[0],y:center[1],r:child.r*birth,rung:child.rung,yaw:child.yaw,pitch:child.pitch,t:child.t,phase:2,local:formation?departmentLocal:local,ballot:childBallot,
          childSockets:i===0?[9,5].filter(chair=>department.born.includes('leaf-'+chair)):[]});
        if(childBallot?.packetProgress!=null&&childBallot.packetProgress<1){
          ball(lerp(center,socket,childBallot.packetProgress),4,INK.verdict[childBallot.verdict]);
        }
        if(i!==0)continue;
        const buds=family.filter(n=>n.parent===child.id);
        for(const bud of buds) {
          const grow=smooth((departmentLocal-DEPARTMENT_BIRTHS[bud.growthId])/.85);
          if(grow<=.001)continue;
          const origin=sub.get(bud.chair),at=lerp(origin,[bud.x,bud.y],grow);
          const budBallot=formation?null:growthChamberVote(local,bud.growthId);
          const color=budBallot?.sealed&&!budBallot.released?INK.verdict[budBallot.verdict]:INK.tether;
          wire([origin,at],color+'A0',.8);
          chamber({x:at[0],y:at[1],r:bud.r*grow,rung:bud.rung,yaw:bud.yaw,pitch:bud.pitch,t:bud.t,phase:2,local,ballot:budBallot});
          if(budBallot?.packetProgress!=null&&budBallot.packetProgress<1){
            ball(lerp(at,origin,budBallot.packetProgress),2.5,INK.verdict[budBallot.verdict]);
          }
        }
      }
    }
    if(formation){
      const heading=department.stage==='demand'?'More users. More work.':department.stage==='organize-vote'?'Proposal: form department teams':
        department.stage==='organize'?'A department gets its own team':department.stage==='delegate-vote'?'The team votes to delegate':'The same rule, one level deeper';
      text(heading,small?22:36,small?25:30,small?16:21,INK.ink,'left');
      if(department.stage.endsWith('vote')){
        text(`${department.chairYes} / 12 principals`,small?22:36,small?49:58,small?13:17,INK.yes,'left');
        text(`AND ${department.floorYes} / ${department.electorate} members`,small?22:36,small?69:81,small?13:17,FLOOR_YES,'left');
      }
    }
    if(rootBallot?.sealed&&!rootBallot.released){
      // The root's sealed decision radiates through the entire tree, as on the wall.
      const p=((formation?departmentLocal:local)-rootBallot.sealAt-.05)/.95;
      if(p>0&&p<1){
        const radius=mix(r*.3,small?300:560,p);
        ctx.beginPath();ctx.arc(cx,cy,radius,0,TAU);
        ctx.strokeStyle=INK.verdict[1]+Math.round(170*(1-p)).toString(16).padStart(2,'0');ctx.lineWidth=2;ctx.stroke();
      }
    }
    if(growth&&!formation)drawTreasury(growth.payments);
    const floor=phase===1?floorMoment(local):null;
    return {floor,growth,department,principals,...(introductory?{docking:{planet:'augur-civ-0:0',rung:expansion?3:2,faceId:augurFaceId,landed:true,expansion},caption:'A principal can be a human, an AI, or a whole civilization.'}:{caption:floor?.caption||growth?.caption})};
  }
  function draw(seconds,{still=false}={}) {
    const moment=anatomyMoment(seconds);
    if(dead)return moment;
    const local=still?ANATOMY_STILL_TIMES[moment.phase]:moment.local;
    // Longer explanation time does not rewind later planets or their packet clocks.
    const choreographyLocal=moment.phase===1?(local<16.6?local*4.6/16.6:local-12):local;
    const t=[0,6,12,22,47][moment.phase]+choreographyLocal;
    fit();ctx.clearRect(0,0,W,H);ctx.lineJoin='round';ctx.lineCap='round';
    const transition=still?null:anatomyTransition(seconds);
    let detail;
    if(transition){
      // Keep the complete outgoing composition. No shrink, regroup or fading
      // sockets: both scenes translate left-to-right through the canvas edge.
      const fixedLocal=20.8;
      ctx.save();ctx.translate(W*transition.outgoing,0);
      detail=drawPhase(transition.from,fixedLocal,t);ctx.restore();
      ctx.save();ctx.translate(W*transition.incoming,0);
      drawPhase(transition.to,0,t-DEPARTMENT_SECONDS);ctx.restore();
    }else detail=drawPhase(moment.phase,local,t);
    return {...moment,...detail,transition};
  }
  return {draw,destroy(){dead=true;skins.clear();}};
}
