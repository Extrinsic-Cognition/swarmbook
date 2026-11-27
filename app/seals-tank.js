// Users each have a Warden AI. Only their Warden AI sends ballots to governance.
// Human experience teaches the companion; useful products earn payment, and feedback selects the next branch.
// The treasury refills separate fuel tanks in bulk. Each tank streams small payments to working agents.
// Work reservations protect the plan; the visible cash drains only as individual payments leave.
// Balances and traffic are illustrative; no chain transactions are sent from this drawing.
import {INK, hexA} from './orb.js';
import {TAU, GOLD, BRONZE, DARK, INK2, WORK, PAPER, mix, clamp, ease, point, curve, onCurve, path, arrow, glow, packet, roundRect, body, dashed, solid, label, fitScene, clearScene} from './seals-draw.js?v=causal-how-2';

// One plan window, three separately funded children. A child never spends a sibling's cash.
// Independent children start in staggered overlaps; each follows its own returned work.
// The 22-second cadence matches Gossip without speeding up the bodies or breaking arrivals.
export const EPOCH=22, CALLS=7;
export const TANK_TIME={voteStart:1.08,seal:1.72,grant:2.02,open:2.15,fundStart:2.2,fundArrive:3.19,filled:3.49,
  fill:.3,ask:.38,check:.18,inside:.25,call:.55,work:.38,receipt:.6,bind:13.1,gather:13.75,anchor:15};
export const CALL_STARTS=[3.5,3.7,3.9,6.0,7.75,9.0,10.65];
// A quick first result leads into longer, overlapping jobs. Fuel buys many product cycles.
export const WORK_DURATIONS=[.38,2.0,3.1,4.0,.8,1.7,.38];
const tt=TANK_TIME;
export const PAYMENT_LAMPORTS=100_000, AGENTS_PER_TANK=3;
const paymentCache=new Map();
// These are illustrative off-chain payment updates, not individual Solana transactions.
// A reproducible cadence makes replay, pause and skipped frames share the same ledger.
export function paymentSchedule(job) {
  if(job.refused)return [];
  const key=`${job.k}:${job.cost}:${job.sent}:${job.done}`;
  if(paymentCache.has(key))return paymentCache.get(key);
  const count=Math.ceil(job.cost/PAYMENT_LAMPORTS),lastSend=job.done-.28;
  const payments=Array.from({length:count},(_,index)=>{
    const agent=index%AGENTS_PER_TANK;
    const progress=count===1?0:(index+.18*Math.sin(index*2.3+job.k))/(count-1);
    const sent=mix(job.sent,lastSend,clamp(progress));
    return {id:`${job.k}:${index}`,unit:job.i,agent,lamports:Math.min(PAYMENT_LAMPORTS,job.cost-index*PAYMENT_LAMPORTS),
      sent,arrived:sent+.22+agent*.03};
  });
  paymentCache.set(key,payments);return payments;
}
// Illustrative working capital; launch and network fees are separate.
export const OPENING_LAMPORTS=1_000_000_000, PARENT_PLAN_CAP=700_000_000;
export const CHILD_UNITS=[
  {id:0,name:'Child I',budget:200_000_000,planCap:200_000_000,fundStart:2.2,fundArrive:2.86,rung:1},
  {id:1,name:'Child II',budget:300_000_000,planCap:300_000_000,fundStart:2.34,fundArrive:3.03,rung:3},
  {id:2,name:'Child III',budget:200_000_000,planCap:200_000_000,fundStart:2.46,fundArrive:3.19,rung:0},
];
export const BUDGET_LAMPORTS=CHILD_UNITS.reduce((sum,u)=>sum+u.budget,0);
export const CALL_UNITS=[0,1,2,0,1,2,1];
export const CALL_COSTS=[10_000_000,14_000_000,8_000_000,10_000_000,12_000_000,6_000_000,4_000_000];
export function fundingDecisions(units=CHILD_UNITS,planCap=PARENT_PLAN_CAP,opening=OPENING_LAMPORTS) {
  let balance=opening,spent=0;
  return units.map(unit=>{
    const allowed=unit.budget<=balance&&spent+unit.budget<=planCap;
    if(allowed){balance-=unit.budget;spent+=unit.budget;}
    return {...unit,allowed};
  });
}
export function spendingDecisions(units=CHILD_UNITS,costs=CALL_COSTS) {
  const funding=fundingDecisions(units),remaining=units.map(u=>u.budget),spent=units.map(()=>0);
  return CALL_STARTS.map((start,k)=>{
    const i=CALL_UNITS[k],unit=units[i],cost=costs[k],before=remaining[i];
    const reason=!funding[i].allowed||start+tt.ask+tt.check<unit.fundArrive?'unfunded':
      cost>remaining[i]?'cash':spent[i]+cost>unit.planCap?'plan':null;
    if(!reason){remaining[i]-=cost;spent[i]+=cost;}
    return {i,cost,refused:!!reason,reason,before,after:remaining[i]};
  });
}
// Receipt count is only for layout. Local cash and local plan caps admit the work.
export const SERVICE_TIME={request:.8,assemble:.18,deliver:1.3,accept:.45,payment:.65,
  handoff:.15,consumerDelivery:.55,personalDelivery:.22,consumerPayment:.65,remit:.15,
  feedbackTravel:.3,learn:.25,ballotTravel:.7,nextVote:.9,branchDelay:.15,branchTravel:.75};
export const WARDENS=Array.from({length:3},(_,i)=>({id:`warden-${i+1}`,principal:`user-${i+1}`}));
export const PRODUCT_BRANCHES=[
  {key:'sources',label:'Better sources',kind:0},
  {key:'options',label:'More options',kind:1},
  {key:'speed',label:'Faster answers',kind:2},
];
// An illustrative, unanimous outcome, not a live quality score or a rule equating money with preference.
export const PRODUCT_FEEDBACK=WARDENS.map(g=>({principal:g.principal,useful:true,next:'sources'}));
export const SERVICE_ORDERS=[
  {source:0,name:'Research',unit:0,calls:[0,3],lamports:400_000_000},
  {source:1,name:'Analysis',unit:1,calls:[1,4,6],lamports:500_000_000},
  {source:2,name:'Review',unit:2,calls:[2,5],lamports:300_000_000},
];
export function serviceOrder(k,t,review=PRODUCT_FEEDBACK[k]) {
  const order=SERVICE_ORDERS[k],jobs=order.calls.map(i=>tankCall(i,t));
  const accepted=jobs[0].start,request=accepted-SERVICE_TIME.request;
  const product=productState(order.unit,t,jobs);
  const ready=product.readyAt,dispatch=ready+SERVICE_TIME.assemble;
  const warden=WARDENS[k];
  if(review.principal!==warden.principal)throw new Error('Feedback belongs to a different principal');
  const delivered=dispatch+SERVICE_TIME.deliver,consumerDispatch=delivered+SERVICE_TIME.handoff,
    wardenReceived=consumerDispatch+SERVICE_TIME.consumerDelivery,
    consumerReceived=wardenReceived+SERVICE_TIME.personalDelivery,
    feedback=consumerReceived+SERVICE_TIME.accept,feedbackAt=feedback+SERVICE_TIME.feedbackTravel,
    evaluated=feedbackAt+SERVICE_TIME.learn,pay=review.useful?evaluated+.1:Infinity,
    sale=pay+SERVICE_TIME.consumerPayment,remit=sale+SERVICE_TIME.remit,settled=remit+SERVICE_TIME.payment,
    ballot=evaluated+.45,feedbackArrived=ballot+SERVICE_TIME.ballotTravel;
  const intent=.1+k*.1,intentArrived=intent+.2,demand=intentArrived+.12,demandArrived=demand+.4,price=order.lamports*2;
  const phase=t<request?'pending':t<accepted?'requesting':t<ready?'working':t<dispatch?'assembling':
    t<delivered?'delivering':t<consumerDispatch?'received':t<consumerReceived?'fulfilling':
    t<pay?'using':t<sale?'customer-paying':t<remit?'sold':t<settled?'paying':'paid';
  return {...order,k,jobs,product,warden,review,request,accepted,ready,dispatch,delivered,consumerDispatch,wardenReceived,consumerReceived,pay,sale,remit,settled,
    feedback,feedbackAt,evaluated,ballot,feedbackArrived,intent,intentArrived,demand,demandArrived,price,phase};
}
// Completed work becomes persistent product layers; a payment alone produces no artifact.
export function productFragments(job,payments=paymentSchedule(job)) {
  if(job.refused)return [];
  return Array.from({length:AGENTS_PER_TANK},(_,agent)=>{
    const own=payments.filter(p=>p.agent===agent&&p.lamports>0);
    if(!own.length)return null;
    const sent=Math.max(job.done,...own.map(p=>p.arrived))+agent*.04;
    return {id:`work-${job.k}-${agent}`,job:job.k,unit:job.i,agent,product:PRODUCT_BRANCHES[job.i].key,
      sent,arrived:sent+.6+agent*.06};
  }).filter(Boolean);
}
export function productState(unit,t,jobs=CALL_STARTS.map((_,k)=>tankCall(k,t))) {
  const own=jobs.filter(j=>j.i===unit&&!j.refused),fragments=own.flatMap(j=>productFragments(j));
  const arrived=fragments.filter(f=>t>=f.arrived),total=fragments.length;
  const readyAt=total?Math.max(...own.map(j=>j.booked),...fragments.map(f=>f.arrived)):Infinity;
  return {key:PRODUCT_BRANCHES[unit].key,unit,fragments,arrived,count:arrived.length,total,readyAt,
    complete:total>0&&arrived.length===total&&t>=readyAt};
}
// Fees are derived from delivered services, never emitted by an unrelated timer.
export const INFLOWS=SERVICE_ORDERS.map((_,k)=>{
  const order=serviceOrder(k,0);
  return {source:order.source,order:k,start:order.remit,arrival:order.settled,lamports:order.lamports};
});
export function consumerEconomy(t,reviews=PRODUCT_FEEDBACK) {
  const orders=SERVICE_ORDERS.map((_,k)=>serviceOrder(k,t,reviews[k]));
  const sent=orders.filter(o=>t>=o.pay).reduce((sum,o)=>sum+o.price,0);
  const inFlight=orders.filter(o=>t>=o.pay&&t<o.sale).reduce((sum,o)=>sum+o.price,0);
  const sales=orders.filter(o=>t>=o.sale).reduce((sum,o)=>sum+o.price,0);
  const remitted=orders.filter(o=>t>=o.remit).reduce((sum,o)=>sum+o.lamports,0);
  return {sent,inFlight,sales,retained:sales-remitted};
}
export function wardenBallots(t,reviews=PRODUCT_FEEDBACK) {
  return WARDENS.map((warden,k)=>{
    const o=serviceOrder(k,t,reviews[k]);
    return {sender:warden.id,principal:warden.principal,
      initialArrived:t>=o.demandArrived,arrived:t>=o.feedbackArrived,
      choice:t>=o.evaluated?o.review.next:null,learned:t>=o.evaluated};
  });
}
export function demandState(t,reviews=PRODUCT_FEEDBACK) {
  const orders=SERVICE_ORDERS.map((_,k)=>serviceOrder(k,t,reviews[k])),ballots=wardenBallots(t,reviews);
  const initial=orders.filter(o=>t>=o.demandArrived).length;
  const repeat=ballots.filter(b=>b.arrived).length;
  const support=PRODUCT_BRANCHES.map(branch=>ballots.filter(b=>b.arrived&&b.choice===branch.key).length);
  const selected=repeat===WARDENS.length&&Math.max(...support)>WARDENS.length/2?PRODUCT_BRANCHES[support.indexOf(Math.max(...support))]:null;
  const nextVote=Math.max(...orders.map(o=>o.feedbackArrived))+.4;
  const nextProgress=selected?clamp((t-nextVote)/SERVICE_TIME.nextVote):0,
    branchStart=nextVote+SERVICE_TIME.nextVote+SERVICE_TIME.branchDelay,branchArrived=branchStart+SERVICE_TIME.branchTravel;
  return {initial,repeat,support,ballots,nextVote,nextProgress,nextPriority:selected?.label??null,selected:selected?.key??null,
    branchStart,branchArrived,published:!!selected&&t>=branchArrived};
}
export function treasuryState(seconds) {
  const t=Math.max(0,seconds)%EPOCH;
  const received=INFLOWS.filter(f=>t>=f.arrival).reduce((sum,f)=>sum+f.lamports,0);
  const inFlight=INFLOWS.filter(f=>t>=f.start&&t<f.arrival).reduce((sum,f)=>sum+f.lamports,0);
  const grants=fundingDecisions().filter(u=>u.allowed);
  const allocated=grants.filter(u=>t>=u.fundStart).reduce((sum,u)=>sum+u.budget,0);
  const transferring=grants.filter(u=>t>=u.fundStart&&t<u.fundArrive).reduce((sum,u)=>sum+u.budget,0);
  return {opening:OPENING_LAMPORTS,received,inFlight,allocated,transferring,balance:OPENING_LAMPORTS+received-allocated};
}

export function tankCall(k,t) {
  const start=CALL_STARTS[k],askAt=start+tt.ask,decision=askAt+tt.check,
    sent=decision+tt.inside,received=sent+tt.call,done=received+WORK_DURATIONS[k],booked=done+tt.receipt;
  const {refused,cost,i,reason}=spendingDecisions()[k];
  const phase=t<start?'pending':t<askAt?'asking':t<decision?'checking':refused?(t<decision+tt.ask?'returning':'refused'):
    t<sent?'authorizing':t<received?'calling':t<done?'working':t<booked?'receipting':'booked';
  return {k,i,reason,start,askAt,decision,sent,received,done,booked,refused,cost,phase};
}
export function childCash(i,t,jobs=CALL_STARTS.map((_,k)=>tankCall(k,t))) {
  const unit=fundingDecisions()[i],funded=unit.allowed&&t>=unit.fundArrive?unit.budget:0;
  const active=jobs.filter(j=>j.i===i&&!j.refused&&t>=j.decision);
  const reserved=active.reduce((sum,j)=>sum+j.cost,0);
  const payments=active.flatMap(paymentSchedule),emissions=payments.filter(p=>t>=p.sent),arrivals=payments.filter(p=>t>=p.arrived);
  const emitted=emissions.reduce((sum,p)=>sum+p.lamports,0),paid=arrivals.reduce((sum,p)=>sum+p.lamports,0);
  const authorizing=reserved-emitted,inFlight=emitted-paid;
  // Available excludes commitments; physical balance still includes unsent reserved cash.
  const remaining=funded-reserved,planRemaining=unit.planCap-reserved,balance=funded-emitted;
  const earnings=Array.from({length:AGENTS_PER_TANK},(_,agent)=>arrivals.filter(p=>p.agent===agent).reduce((sum,p)=>sum+p.lamports,0));
  const fuel=clamp((t-unit.fundArrive)/tt.fill)*balance/unit.budget;
  return {...unit,funded,reserved,remaining,planRemaining,authorizing,inFlight,paid,balance,emitted,
    emittedCount:emissions.length,arrivedCount:arrivals.length,earnings,fuel};
}
// Totals are for the public ledger only; no purchase is authorized against this aggregate.
export function posiverseCash(t,jobs=CALL_STARTS.map((_,k)=>tankCall(k,t))) {
  return CHILD_UNITS.map((_,i)=>childCash(i,t,jobs)).reduce((totals,child)=>{
    for(const key of Object.keys(totals))totals[key]+=child[key];return totals;
  },{funded:0,reserved:0,remaining:0,authorizing:0,inFlight:0,paid:0});
}
const sol=lamports=>lamports===0?'0 SOL':`${(lamports/1e9).toFixed(4).replace(/\.?0+$/,'')} SOL`;

export function tankState(seconds) {
  const t=Math.max(0,seconds)%EPOCH, jobs=CALL_STARTS.map((_,k)=>tankCall(k,t));
  const authorized=jobs.filter(j=>!j.refused&&t>=j.decision).length;
  const booked=jobs.filter(j=>!j.refused&&t>=j.booked).length;
  const cash=posiverseCash(t,jobs);
  const children=CHILD_UNITS.map((_,i)=>childCash(i,t,jobs));
  return {t,jobs,payments:jobs.flatMap(paymentSchedule),products:CHILD_UNITS.map((_,i)=>productState(i,t,jobs)),cash,children,demand:demandState(t),consumers:consumerEconomy(t),orders:SERVICE_ORDERS.map((_,k)=>serviceOrder(k,t)),treasury:treasuryState(seconds),seal:clamp((t-tt.voteStart)/(tt.seal-tt.voteStart)),open:clamp((t-tt.grant)/(tt.open-tt.grant)),
    pull:clamp((t-tt.fundStart)/(tt.fundArrive-tt.fundStart)),calls:jobs.filter(j=>t>=j.start).length,
    authorized,booked,refused:jobs.filter(j=>j.refused&&t>=j.decision).length,
    fuel:children.reduce((sum,c)=>sum+c.fuel*c.budget,0)/BUDGET_LAMPORTS,gather:clamp((t-tt.bind)/(tt.gather-tt.bind)),
    bind:clamp((t-tt.gather)/(tt.anchor-tt.gather)),resting:t>=tt.anchor};
}

// A sentence advances with completed handoffs, never with individual pulses.
export function spendingCaption(state) {
  if(state.demand.published)return 'Experience guides the next improvement.';
  if(state.orders.every(order=>state.t>=order.consumerReceived))return 'People try the work. Wardens learn.';
  if(state.products.every(product=>product.complete))return 'Completed products return to their users.';
  if(state.children.some(child=>child.emittedCount>0))return 'Small payments sustain the work.';
  if(state.open===1)return 'Approved budgets fund each child swarm.';
  return 'Every user guides their own Warden.';
}

// The tank note describes the whole paid work window, including the quiet
// instants between payment packets. It changes only when a job starts or ends.
export function tankStreamActive(state,unit) {
  return state.jobs.some(job=>job.i===unit&&!job.refused&&state.t>=job.sent&&state.t<job.done);
}

function track(parts) {
  const samples=[{p:parts[0].a,at:0}];let length=0;
  for(const part of parts)for(let i=1;i<=64;i++) {
    const p=onCurve(part,i/64),last=samples.at(-1).p;
    length+=Math.hypot(p.x-last.x,p.y-last.y);samples.push({p,at:length});
  }
  return {parts,samples,length};
}
function atTrack(route,t) {
  const at=clamp(t)*route.length,samples=route.samples;
  let lo=0,hi=samples.length-1;
  while(hi-lo>1){const mid=(lo+hi)>>1;if(samples[mid].at<at)lo=mid;else hi=mid;}
  const a=samples[lo],b=samples[hi],u=(at-a.at)/(b.at-a.at||1);
  return point(mix(a.p.x,b.p.x,u),mix(a.p.y,b.p.y,u));
}
function drawTrack(ctx,route,alpha) {
  ctx.strokeStyle=hexA(WORK,alpha);ctx.lineWidth=1;
  for(const part of route.parts){path(ctx,part);ctx.stroke();}
}
function trackPacket(ctx,route,t,kind,color=WORK) {
  const p=atTrack(route,t),tail=atTrack(route,t-14/route.length);
  packet(ctx,curve(tail,p),1,color,kind);
}
function workSheet(ctx,p,type,scale=1) {
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(scale,scale);
  ctx.fillStyle=PAPER;ctx.strokeStyle=WORK;ctx.lineWidth=1.1;
  ctx.beginPath();ctx.rect(-8,-11,16,22);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(-4,-6);ctx.lineTo(4,-6);ctx.stroke();
  if(type===1){for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-4+i*4,6);ctx.lineTo(-4+i*4,3-i*3);ctx.stroke();}}
  else {for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-4,-1+i*4);ctx.lineTo(i===2?1:4,-1+i*4);ctx.stroke();}}
  ctx.restore();
}

export function wardenPairLayout(mobile=false) {
  const users=WARDENS.map((g,i)=>({...point((mobile?128:150)+i*(mobile?66:96),42,10),id:g.principal}));
  const wardens=WARDENS.map((g,i)=>({...point(users[i].x,106,12),...g}));
  const personalPaths=users.map((p,i)=>curve(point(p.x,p.y+15),point(wardens[i].x,wardens[i].y-wardens[i].r-4)));
  return {users,wardens,personalPaths};
}
export function wardenVotePaths(wardens,voteY=180) {
  return wardens.map(g=>{
    const a=point(g.x,g.y+g.r),b=point(g.x,voteY);
    const route=track([curve(a,b)]);
    return {...route,a,b,sender:g.id};
  });
}

// Distinct right-edge lanes keep working agents visibly connected to their own product.
export function productWorkRoutes(workers,products,mobile=false) {
  return workers.map((row,unit)=>row.map((worker,agent)=>{
    const product=products[unit],lane=(mobile?568:950)+unit*(mobile?10:16),top=26+unit*6;
    const a=point(worker.x,worker.y-worker.r),feedY=worker.y-17;
    const bend=point(lane,feedY-10),corner=point(lane-10,top),b=point(product.x+18,product.y);
    const route=track([
      {a,c:point(a.x,feedY),d:point(lane,feedY),b:bend},
      {a:bend,c:point(lane,feedY-35),d:point(lane,top),b:corner},
      {a:corner,c:point(product.x+44,top),d:point(product.x+40,product.y),b},
    ]);
    return {...route,a,b,unit,agent,product:product.key};
  }));
}
export function productDocument(ctx,p,state) {
  const n=state.count;
  ctx.save();ctx.strokeStyle=hexA(n?WORK:INK2,n?.8:.38);ctx.lineWidth=1;
  // Older layers stay behind the current page; every line on it is an arrived contribution.
  for(let layer=Math.min(3,Math.floor(n/3));layer>0;layer--) {
    ctx.fillStyle=PAPER;ctx.beginPath();ctx.rect(p.x-18+layer*2,p.y-20-layer*2,36,40);ctx.fill();ctx.stroke();
  }
  ctx.fillStyle=hexA(PAPER,n?.95:.5);ctx.beginPath();ctx.rect(p.x-18,p.y-20,36,40);ctx.fill();ctx.stroke();
  if(!n){dashed(ctx,2,3);ctx.beginPath();ctx.moveTo(p.x-11,p.y+12);ctx.lineTo(p.x+11,p.y+12);ctx.stroke();solid(ctx);}
  ctx.strokeStyle=WORK;ctx.lineWidth=1.4;
  for(let i=0;i<n;i++) {
    const y=p.y-13+i*3;
    ctx.beginPath();ctx.moveTo(p.x-11,y);ctx.lineTo(p.x+(i%3===2?5:11),y);ctx.stroke();
  }
  ctx.restore();
}

export function createTankScene(canvas) {
  const ctx = canvas.getContext('2d');
  let width = 1000, height = 650, view = null, model = null;
  function resize(mobile) {
    width = mobile ? 600 : 1000; height = mobile ? 710 : 650;
    view=fitScene(canvas,mobile);if(!view)return;

    const m = mobile;
    // landscape: a left-to-right story; portrait: the same story, taller, the treasury high and the book low
    const treasury = point(m ? 162 : 250, m ? 366 : 320, m ? 36 : 52);
    const enterprises=(m?[[194,548,22,1],[56,328,21,0],[52,497,25,3]]:[[295,500,30,1],[70,320,24,0],[88,486,36,3]])
      .map(([x,y,r,rung],i)=>({...point(x,y,r),rung,phase:i*1.8}));
    const feePaths=enterprises.map((source,i)=>{
      if(i===0) {
        const lane=m?244:374;
        return {a:point(source.x+source.r,source.y-4),c:point(lane,source.y-55),
          d:point(lane,treasury.y+25),b:point(treasury.x+treasury.r,treasury.y)};
      }
      const dx=treasury.x-source.x,dy=treasury.y-source.y,length=Math.hypot(dx,dy);
      return curve(point(source.x+dx/length*source.r,source.y+dy/length*source.r),
        point(treasury.x-dx/length*treasury.r,treasury.y-dy/length*treasury.r),(i-1)*12);
    });
    // Aligned ballot columns join a horizontal approval rail.
    const seal = point(m ? 250 : 335, 208);
    const gate = point(m ? 250 : 335, m ? 300 : 320);
    const rooms=CHILD_UNITS.map((unit,i)=>({x:m?282:430,y:(m?190:196)+i*(m?145:135),w:m?174:268,h:m?124:120}));
    const tanks=rooms.map(room=>({x:room.x+(m?63:91),y:room.y+28,w:m?98:158,h:72}));
    const agents=rooms.map((room,i)=>({...point(room.x+(m?25:35),room.y+64,m?17:25),rung:CHILD_UNITS[i].rung}));
    const providers=agents.map(a=>point(m?530:842,a.y,m?10:12));
    const workers=providers.map(p=>Array.from({length:AGENTS_PER_TANK},(_,i)=>point(p.x+(i===1?12:-10),p.y+(i-1)*24,m?7:9)));
    const paymentPaths=tanks.map((tank,i)=>workers[i].map((worker,k)=>curve(
      point(tank.x+tank.w,tank.y+tank.h/2+(k-1)*7),point(worker.x-worker.r,worker.y),(k-1)*11)));
    const books=providers.map(p=>({x:m?492:754,y:p.y+40,w:m?60:88}));
    const branches=PRODUCT_BRANCHES.map((b,i)=>({...point((m?346:570)+i*(m?92:155),66,20),...b}));
    const productRoutes=productWorkRoutes(workers,branches,m);
    const chainY=m?678:622;
    // One parent gate bounds the allocation; each outgoing branch belongs to one child.
    const junction=point(m?255:391,treasury.y);
    gate.y=treasury.y;
    const pullPath=curve(point(treasury.x+treasury.r,treasury.y),junction);
    const approvalPath=curve(seal,point(gate.x,gate.y));
    const fundingPaths=tanks.map((tank,i)=>track([
      pullPath,
      {a:junction,c:point(junction.x+12,junction.y),d:point(tank.x-12,tank.y+4),b:point(tank.x+5,tank.y+4)},
    ]));
    const callPaths=providers.map((p,i)=>curve(point(tanks[i].x+tanks[i].w,tanks[i].y+tanks[i].h/2),point(p.x-p.r,p.y)));
    const agentPaths=agents.map((a,i)=>curve(point(a.x+a.r,a.y),point(tanks[i].x,tanks[i].y+tanks[i].h/2)));
    const internalPaths=tanks.map((tank,i)=>({a:agentPaths[i].b,c:point(tank.x+16,tank.y-4),d:point(tank.x+tank.w-16,tank.y-4),b:callPaths[i].a}));
    const localJobs=CHILD_UNITS.map((_,i)=>CALL_STARTS.map((_,k)=>tankCall(k,0)).filter(j=>j.i===i&&!j.refused));
    const receiptPoint=k=>{const i=CALL_UNITS[k],book=books[i];return point(book.x,book.y+localJobs[i].findIndex(j=>j.k===k)*6.4);};
    const receiptPaths=CALL_STARTS.map((_,k)=>curve(point(providers[CALL_UNITS[k]].x,providers[CALL_UNITS[k]].y+providers[CALL_UNITS[k]].r),receiptPoint(k),12));
    const anchorPaths=books.map((book,i)=>{
      const lane=m?565+i*9:903+i*22;
      return track([{a:point(book.x+book.w,book.y+8),c:point(lane,book.y+8),d:point(lane,chainY-35),b:point(m?526+i*14:lane,chainY)}]);
    });
    const busY=m?636:602,elbow=point(m?165:205,busY),left=m?8:16,corner=point(left,busY-28);
    const returnBranches=enterprises.map((e,i)=>{
      if(i===0) {
        const port=point(e.x+e.r+11,e.y),lane=m?250:377;
        return [{a:elbow,c:point(lane,busY),d:point(lane,e.y+36),b:port}];
      }
      const end=point(e.x-e.r-11,e.y),turn=point(left,e.y+34);
      return [{a:elbow,c:point(left+45,busY),d:point(left,busY),b:corner},curve(corner,turn),
        {a:turn,c:point(left,e.y),d:point(end.x,e.y),b:end}];
    });
    const requestTracks=SERVICE_ORDERS.map(order=>{
      const branch=returnBranches[order.source],a=agents[order.unit];
      return track([...branch.toReversed().map(p=>({a:p.b,c:p.d,d:p.c,b:p.a})),
        {a:elbow,c:point(a.x-55,busY),d:point(a.x,a.y+65),b:point(a.x,a.y+a.r)}]);
    });
    const serviceTracks=SERVICE_ORDERS.map(order=>{
      const product=branches[order.unit],from=point(product.x-18,product.y),lane=m?475:731;
      const turn=point(product.x-54,130),down=point(lane,160);
      return track([
        {a:from,c:point(turn.x,from.y),d:point(turn.x,110),b:turn},
        {a:turn,c:point(turn.x,145),d:point(lane,130),b:down},
        {a:down,c:point(lane,220),d:point(lane,busY),b:point(lane-10,busY)},
        {a:point(lane-10,busY),c:point(lane-50,busY+8),d:point(m?300:390,busY+12),b:elbow},
        ...returnBranches[order.source],
      ]);
    });
    const {users:consumers,wardens,personalPaths}=wardenPairLayout(m);
    const demandPaths=wardenVotePaths(wardens);
    const branchPaths=branches.map(b=>curve(seal,point(b.x,b.y+b.r),-12));
    const deliveryTracks=wardens.map((c,i)=>{
      const e=enterprises[i],port=point(c.x-c.r,c.y);
      if(i===0) {
        const from=point(e.x+e.r+11,e.y),lane=m?270:402,upper=point(lane,134);
        return track([{a:from,c:point(lane,e.y),d:point(lane,220),b:upper},
          {a:upper,c:point(lane,86),d:point(c.x-30,86),b:port}]);
      }
      const from=point(e.x-e.r-11,e.y),turn=point(left,132);
      return track([{a:from,c:point(left,e.y),d:point(left,e.y-20),b:point(left,e.y-32)},
        curve(point(left,e.y-32),turn),{a:turn,c:point(c.x*.4,turn.y),d:point(c.x-30,turn.y),b:port}]);
    });
    const purchaseTracks=deliveryTracks.map(route=>track(route.parts.toReversed().map(p=>({a:p.b,c:p.d,d:p.c,b:p.a}))));
    model = {consumers,wardens,personalPaths,branches,branchPaths,productRoutes,demandPaths,deliveryTracks,purchaseTracks,requestTracks,serviceTracks,enterprises,feePaths,approvalPath,internalPaths,mobile:m,treasury,seal,gate,rooms,tanks,fundingPaths,providers,workers,paymentPaths,agents,books,localJobs,receiptPoint,chainY,pullPath,callPaths,receiptPaths,agentPaths,anchorPaths};
  }
  function render(milliseconds, reduced = false) {
    if (!model || !view) return;
    const seconds = reduced ? EPOCH-1 : milliseconds / 1000;
    const s = tankState(seconds);
    clearScene(ctx,canvas,view);
    ctx.save();ctx.globalAlpha=reduced?1:Math.min(1,s.t/.35,(EPOCH-s.t)/.7);
    // Keep the complete diagram proportional while reserving the same single
    // caption slot as Sharing. Settlement remains part of the inset diagram.
    const diagramScale=.91;
    ctx.translate(width*(1-diagramScale)/2,4);ctx.scale(diagramScale,diagramScale);
    const {treasury,seal,gate,rooms,tanks,fundingPaths,providers,workers,paymentPaths,agents,books,localJobs,receiptPoint,chainY,pullPath,callPaths,receiptPaths,agentPaths,anchorPaths,mobile,approvalPath,internalPaths,enterprises,feePaths,requestTracks,serviceTracks,consumers,wardens,personalPaths,branches,branchPaths,productRoutes,demandPaths,deliveryTracks,purchaseTracks}=model;

    // the chain: a line under everything; only the pull and the root ever touch it
    ctx.strokeStyle = hexA(INK2, .4); ctx.lineWidth = .8; solid(ctx);
    ctx.beginPath(); ctx.moveTo(40, chainY); ctx.lineTo(width - 40, chainY); ctx.stroke();

    // Each enclosure contains one paying person and their own Warden, never a shared AI pool.
    for(const user of consumers) {
      const w=mobile?56:64;
      ctx.fillStyle=hexA(PAPER,.28);ctx.strokeStyle=hexA(BRONZE,.22);ctx.lineWidth=.8;
      roundRect(ctx,user.x-w/2,24,w,106,18);ctx.fill();ctx.stroke();
    }
    // The personal channel never reaches governance: the warden learns here, then signs its own ballot.
    for(const order of s.orders) {
      const c=consumers[order.source],g=wardens[order.source],personal=personalPaths[order.source],demand=demandPaths[order.source],delivery=deliveryTracks[order.source];
      ctx.strokeStyle=hexA(WORK,.3);ctx.lineWidth=1.1;path(ctx,personal);ctx.stroke();
      if(s.t>=order.intent&&s.t<order.intentArrived)packet(ctx,personal,(s.t-order.intent)/(order.intentArrived-order.intent),WORK,'hollow');
      if(s.t>=order.wardenReceived&&s.t<order.consumerReceived)
        packet(ctx,personal,1-(s.t-order.wardenReceived)/SERVICE_TIME.personalDelivery,WORK,'card',1,-1);
      if(s.t>=order.feedback&&s.t<order.feedbackAt)
        packet(ctx,personal,(s.t-order.feedback)/SERVICE_TIME.feedbackTravel,WORK,'hollow');
      if(s.t>=order.feedbackAt&&s.t<order.evaluated) {
        glow(ctx,g,25,WORK,.22);
        ctx.strokeStyle=WORK;ctx.lineWidth=2;ctx.beginPath();ctx.arc(g.x,g.y,g.r+4,-Math.PI/2,-Math.PI/2+TAU*(s.t-order.feedbackAt)/SERVICE_TIME.learn);ctx.stroke();
      }
      const initial=s.t>=order.demand&&s.t<order.demandArrived;
      const returning=s.t>=order.ballot&&s.t<order.feedbackArrived;
      if(initial||returning) {
        ctx.strokeStyle=hexA(BRONZE,.3);ctx.lineWidth=1;
        for(const part of demand.parts){path(ctx,part);ctx.stroke();}
        const at=initial?(s.t-order.demand)/(order.demandArrived-order.demand):(s.t-order.ballot)/SERVICE_TIME.ballotTravel;
        trackPacket(ctx,demand,at,'card',BRONZE);
      }
      for(const arrive of [order.demandArrived,order.feedbackArrived])
        if(s.t>=arrive&&s.t<arrive+.5)glow(ctx,demand.b,22,WORK,.25*clamp(1-(s.t-arrive)/.5));
      if(s.t>=order.consumerDispatch)drawTrack(ctx,delivery,s.t<order.wardenReceived?.42:.1);
      if(s.t>=order.consumerDispatch&&s.t<order.wardenReceived) {
        const at=(s.t-order.consumerDispatch)/SERVICE_TIME.consumerDelivery;
        trackPacket(ctx,delivery,at,'card');workSheet(ctx,atTrack(delivery,at),order.k);
      }
      if(s.t>=order.pay&&s.t<order.sale) {
        trackPacket(ctx,purchaseTracks[order.source],(s.t-order.pay)/SERVICE_TIME.consumerPayment,'dot',GOLD);
      }
      if(s.t>=order.sale&&s.t<order.sale+.5)glow(ctx,enterprises[order.source],30,GOLD,.25*clamp(1-(s.t-order.sale)/.5));
    }

    // Work leaves its paid agents and sediments into the matching product, one arrival at a time.
    for(const product of s.products)for(const route of productRoutes[product.unit]) {
      const active=product.fragments.filter(f=>f.agent===route.agent&&s.t>=f.sent&&s.t<f.arrived);
      if(active.length) {
        // Only the currently used lane lights; a paper stroke makes crossings read as overpasses.
        ctx.strokeStyle=hexA(PAPER,.85);ctx.lineWidth=3.5;
        for(const part of route.parts){path(ctx,part);ctx.stroke();}
        drawTrack(ctx,route,.62);
      } else if(product.count>0)drawTrack(ctx,route,.08);
      for(const f of active) {
        const at=(s.t-f.sent)/(f.arrived-f.sent),p=atTrack(route,at);
        trackPacket(ctx,route,at,'card',WORK);
        workSheet(ctx,p,product.unit,.72);
        if(s.t<f.sent+.18)glow(ctx,workers[f.unit][f.agent],18,WORK,.2);
      }
    }
    for(const [i,b] of branches.entries()) {
      const product=s.products[i],chosen=s.demand.selected===b.key,committed=chosen&&s.demand.published;
      if(chosen) {
        ctx.strokeStyle=hexA(WORK,committed?.4:.2);ctx.lineWidth=committed?1.4:.8;
        path(ctx,branchPaths[i]);ctx.stroke();
      }
      productDocument(ctx,b,product);
      for(const f of product.arrived)if(s.t<f.arrived+.35)
        glow(ctx,b,32,WORK,.22*clamp(1-(s.t-f.arrived)/.35));
      if(committed) {
        ctx.strokeStyle=WORK;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(b.x-24,b.y+26);ctx.lineTo(b.x+24,b.y+26);ctx.stroke();
      }
      label(ctx,b.label,b.x,b.y+34,product.count?WORK:INK2,'center',mobile?13:15);
      const status=committed?'Improve next':product.count?`${product.count} layer${product.count===1?'':'s'}`:s.jobs.some(j=>j.i===i&&s.t>=j.received)?'Building':'Awaiting work';
      label(ctx,status,b.x,b.y+54,committed?WORK:INK2,'center',mobile?11:13);
      if(chosen&&s.t>=s.demand.branchStart&&s.t<s.demand.branchArrived)
        packet(ctx,branchPaths[i],(s.t-s.demand.branchStart)/(s.demand.branchArrived-s.demand.branchStart),BRONZE,'card');
    }

    // Requests and fulfilled services use the outside return rail, keeping the spending paths clear.
    for(const order of s.orders) {
      const request=requestTracks[order.k],service=serviceTracks[order.k];
      if(order.phase==='requesting') {
        drawTrack(ctx,request,.36);trackPacket(ctx,request,(s.t-order.request)/SERVICE_TIME.request,'hollow');
      }
      if(s.t>=order.accepted&&s.t<order.accepted+.6)
        glow(ctx,agents[order.unit],25,WORK,.3*clamp(1-(s.t-order.accepted)/.6));
      if(s.t>=order.dispatch)drawTrack(ctx,service,order.phase==='delivering'?.46:.1);
      if(order.phase==='assembling')glow(ctx,branches[order.unit],34,WORK,.22);
      if(order.phase==='delivering') {
        const p=(s.t-order.dispatch)/SERVICE_TIME.deliver;
        trackPacket(ctx,service,p,'card');workSheet(ctx,atTrack(service,p),order.k);
      }
      if(s.t>=order.delivered) {
        const target=service.parts.at(-1).b;
        workSheet(ctx,target,order.k);
        if(s.t<order.pay)glow(ctx,target,26,WORK,.28*clamp(1-(s.t-order.delivered)/SERVICE_TIME.accept));
      }
    }

    // The upstream economy remains visible throughout the budget's work cycle.
    for(const route of feePaths) {
      ctx.strokeStyle=hexA(BRONZE,.3);ctx.lineWidth=.9;path(ctx,route);ctx.stroke();arrow(ctx,route,hexA(BRONZE,.55),.52);
    }
    for(const flow of INFLOWS) {
      const route=feePaths[flow.source];
      if(s.t>=flow.start&&s.t<flow.arrival) {
        packet(ctx,route,(s.t-flow.start)/(flow.arrival-flow.start),GOLD);
        glow(ctx,enterprises[flow.source],enterprises[flow.source].r*1.5,GOLD,.17*clamp(1-(s.t-flow.start)/.4));
      }
      if(s.t>=flow.arrival&&s.t<flow.arrival+.7)glow(ctx,route.b,24,GOLD,.35*clamp(1-(s.t-flow.arrival)/.7));
    }

    // the pipe from the treasury to the tank, and the gate on it that the seal opens
    ctx.strokeStyle = hexA(BRONZE, .45); ctx.lineWidth = .85; path(ctx, pullPath); ctx.stroke(); arrow(ctx, pullPath, hexA(BRONZE, .7), .8);
    const open = ease(s.open);
    // The gate opens after the approval reaches it.
    ctx.strokeStyle = hexA(DARK, .7); ctx.lineWidth = 1.6;
    for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(gate.x,gate.y+side*(2+16*open));ctx.lineTo(gate.x,gate.y+side*22);ctx.stroke();}
    const vote=s.demand.repeat>0?s.demand.nextProgress:s.seal;
    // Every ballot stays in its Warden AI's column and lights only on arrival.
    const firstVote=demandPaths[0].b,lastVote=demandPaths.at(-1).b;
    ctx.strokeStyle=hexA(BRONZE,.35);ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(firstVote.x,seal.y);ctx.lineTo(lastVote.x,seal.y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(seal.x,seal.y);ctx.lineTo(gate.x,gate.y-14);ctx.stroke();
    for(const [k,route] of demandPaths.entries()) {
      const slot=route.b,lit=s.demand.repeat>0?s.demand.ballots[k].arrived:s.demand.ballots[k].initialArrived;
      ctx.strokeStyle=hexA(BRONZE,.2);ctx.lineWidth=.8;
      ctx.beginPath();ctx.moveTo(route.a.x,route.a.y);ctx.lineTo(slot.x,slot.y-10);ctx.stroke();
      ctx.strokeStyle=hexA(lit?GOLD:BRONZE,lit?.8:.3);
      ctx.beginPath();ctx.moveTo(slot.x,slot.y+10);ctx.lineTo(slot.x,seal.y);ctx.stroke();
      ctx.fillStyle=lit?GOLD:PAPER;ctx.strokeStyle=hexA(BRONZE,.7);ctx.lineWidth=1;
      roundRect(ctx,slot.x-9,slot.y-9,18,18,3);ctx.fill();ctx.stroke();
      if(lit) {
        ctx.strokeStyle=INK.ink;ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(slot.x-4,slot.y);ctx.lineTo(slot.x-1,slot.y+3);ctx.lineTo(slot.x+5,slot.y-4);ctx.stroke();
      }
    }
    const approved=ease(clamp(vote*1.15-.15));
    if(approved>0) {
      ctx.strokeStyle=hexA(GOLD,.9);ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(firstVote.x,seal.y);ctx.lineTo(mix(firstVote.x,lastVote.x,approved),seal.y);ctx.stroke();
    }
    if(vote>=1)glow(ctx,seal,18,GOLD,.12);

    // Each room holds a distinct chamber, cash balance and spending plan.
    for(const [i,room] of rooms.entries()) {
      const tank=tanks[i],child=s.children[i];
      ctx.strokeStyle=hexA(INK2,.42);ctx.lineWidth=.8;dashed(ctx,2,4);
      roundRect(ctx,room.x,room.y,room.w,room.h,13);ctx.stroke();solid(ctx);
      for(const part of fundingPaths[i].parts.slice(1)) {
        ctx.strokeStyle=hexA(BRONZE,.35);ctx.lineWidth=.9;path(ctx,part);ctx.stroke();
      }
      roundRect(ctx,tank.x,tank.y,tank.w,tank.h,9);
      ctx.fillStyle=hexA(PAPER,.95);ctx.fill();ctx.strokeStyle=hexA(DARK,.55);ctx.lineWidth=1;ctx.stroke();
      const capY=tank.y+10,fuelH=(tank.h-16)*child.fuel;
      if(fuelH>0){ctx.save();roundRect(ctx,tank.x+3,tank.y+3,tank.w-6,tank.h-6,7);ctx.clip();
        ctx.fillStyle=hexA(GOLD,.28);ctx.fillRect(tank.x,tank.y+tank.h-3-fuelH,tank.w,fuelH);ctx.restore();}
      ctx.strokeStyle=hexA(BRONZE,.45);ctx.lineWidth=.65;dashed(ctx,2,4);
      ctx.beginPath();ctx.moveTo(tank.x+7,capY);ctx.lineTo(tank.x+tank.w-7,capY);ctx.stroke();solid(ctx);
      label(ctx,`${child.name} · fuel tank`,room.x+room.w/2,room.y+13,INK2,'center',mobile?13:17);
      label(ctx,sol(child.balance),tank.x+tank.w/2,tank.y+36,INK.ink,'center',mobile?16:21);
      const streaming=tankStreamActive(s,i);
      const note=s.t<child.fundArrive?'Awaiting refill':child.balance===0?'Out of fuel':streaming?(mobile?'Streaming':`Streaming ${sol(PAYMENT_LAMPORTS)}`):(mobile?'Ready':'Ready to stream');
      label(ctx,note,tank.x+tank.w/2,tank.y+59,child.balance===0?INK.ink2:INK.bronze,'center',13);
      label(ctx,`Own budget · ${sol(child.budget)}`,room.x+room.w/2,room.y+room.h-7,INK2,'center',mobile?11:13);
      if(s.t>=child.fundStart&&s.t<child.fundArrive) {
        const parcel=atTrack(fundingPaths[i],(s.t-child.fundStart)/(child.fundArrive-child.fundStart));
        glow(ctx,parcel,27,GOLD,.34);ctx.fillStyle=GOLD;ctx.strokeStyle=BRONZE;ctx.lineWidth=1;
        ctx.beginPath();ctx.arc(parcel.x,parcel.y,8,0,TAU);ctx.fill();ctx.stroke();
        label(ctx,sol(child.budget),parcel.x,parcel.y-20,BRONZE,'center',mobile?12:15);
      }
      if(s.t>=child.fundArrive&&s.t<child.fundArrive+.65)
        glow(ctx,agentPaths[i].b,22,GOLD,.3*clamp(1-(s.t-child.fundArrive)/.65));
      ctx.strokeStyle=hexA(WORK,.3);ctx.lineWidth=.8;path(ctx,agentPaths[i]);ctx.stroke();
      if(child.funded&&child.balance===0) {
        const prepaid=s.payments.some(p=>p.unit===i&&s.t>=p.sent&&s.t<p.arrived);
        if(!prepaid){const port=callPaths[i].a;ctx.strokeStyle=DARK;ctx.lineWidth=1.8;
          ctx.beginPath();ctx.moveTo(port.x+3,port.y-7);ctx.lineTo(port.x+3,port.y+7);ctx.stroke();}
      }
    }
    if(s.t>=tt.seal&&s.t<tt.grant)packet(ctx,approvalPath,(s.t-tt.seal)/(tt.grant-tt.seal),GOLD,'card');
    // Tracks are quiet; only a travelling signal illuminates its own route.
    for(const [i,cp] of callPaths.entries()) {
      ctx.strokeStyle=hexA(WORK,.18);ctx.lineWidth=.8;path(ctx,cp);ctx.stroke();arrow(ctx,cp,hexA(WORK,.45),.65);

    }
    // Tiny payment pulses fan out to individual agents, with credit only on arrival.
    for(const [i,row] of workers.entries())for(const [agent,p] of row.entries()) {
      const route=paymentPaths[i][agent];
      ctx.strokeStyle=hexA(GOLD,.3);ctx.lineWidth=.85;path(ctx,route);ctx.stroke();
      const landed=s.payments.filter(update=>update.unit===i&&update.agent===agent&&s.t>=update.arrived&&s.t<update.arrived+.12);
      if(landed.length)glow(ctx,p,p.r*2.8,GOLD,.24);
      ctx.fillStyle=PAPER;ctx.strokeStyle=WORK;ctx.lineWidth=1.2;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,TAU);ctx.fill();ctx.stroke();
      ctx.fillStyle=WORK;ctx.beginPath();ctx.arc(p.x,p.y,2.1,0,TAU);ctx.fill();
      if(!mobile)label(ctx,sol(s.children[i].earnings[agent]),p.x+p.r+7,p.y,INK2,'left',12);
    }
    for(const update of s.payments) {
      if(s.t<update.sent||s.t>=update.arrived)continue;
      const route=paymentPaths[update.unit][update.agent],progress=(s.t-update.sent)/(update.arrived-update.sent);
      const p=onCurve(route,progress),tail=onCurve(route,Math.max(0,progress-.035));
      ctx.strokeStyle=hexA(GOLD,.8);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(tail.x,tail.y);ctx.lineTo(p.x,p.y);ctx.stroke();
      ctx.fillStyle=GOLD;ctx.beginPath();ctx.arc(p.x,p.y,1.9,0,TAU);ctx.fill();
    }
    for(const j of s.jobs) {
      if(j.phase==='pending')continue;
      const {i}=j, ingress=agentPaths[i].b;
      if(j.phase==='asking')packet(ctx,agentPaths[i],(s.t-j.start)/tt.ask,WORK);
      if(j.phase==='checking') {
        packet(ctx,agentPaths[i],1,WORK);glow(ctx,ingress,20,WORK,.25);
        ctx.strokeStyle=WORK;ctx.lineWidth=2;ctx.beginPath();ctx.arc(ingress.x,ingress.y,10,-Math.PI/2,-Math.PI/2+TAU*(s.t-j.askAt)/tt.check);ctx.stroke();
      }
      if(j.refused) {
        if(s.t>=j.decision&&s.t<j.decision+tt.ask+.5) {
          ctx.strokeStyle=DARK;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ingress.x-10,ingress.y);ctx.lineTo(ingress.x+10,ingress.y);ctx.stroke();
          if(j.phase==='returning')packet(ctx,agentPaths[i],1-(s.t-j.decision)/tt.ask,WORK,'dot',1,-1);
          else glow(ctx,agents[i],20,WORK,.25*clamp(1-(s.t-j.decision-tt.ask)/.5));
        }
        continue;
      }
      if(j.phase==='authorizing')packet(ctx,internalPaths[i],(s.t-j.decision)/tt.inside,WORK);
      if(j.phase==='calling')packet(ctx,callPaths[i],(s.t-j.sent)/tt.call,WORK,'hollow');
      if(j.phase==='working') {
        glow(ctx,providers[i],providers[i].r*2.5,WORK,.3);
        ctx.strokeStyle=WORK;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(providers[i].x,providers[i].y,providers[i].r+5,-Math.PI/2,-Math.PI/2+TAU*(s.t-j.received)/(j.done-j.received));ctx.stroke();
      }
      // A card emerges from the provider only after the working arc completes.
      const target=receiptPoint(j.k),rp=receiptPaths[j.k];
      if(j.phase==='receipting'){ctx.strokeStyle=hexA(BRONZE,.25);ctx.lineWidth=.8;path(ctx,rp);ctx.stroke();packet(ctx,rp,(s.t-j.done)/tt.receipt,BRONZE,'card');}
      if(j.phase==='booked'&&s.t<j.booked+.5)glow(ctx,target,20,BRONZE,.3*clamp(1-(s.t-j.booked)/.5));
    }

    // Every child gets its own returned receipts and seals its own book independently.
    for(const [i,book] of books.entries()) {
      const booked=localJobs[i].filter(j=>s.t>=j.booked);
      const last=Math.max(...localJobs[i].map(j=>j.booked));
      const gather=clamp((s.t-last-.5)/.65),bind=clamp((s.t-last-1.15)/1.25);
      for(const [row,j] of booked.entries()) {
        const y=book.y+row*6.4;
        ctx.strokeStyle=hexA(BRONZE,.7);ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(book.x,y);
        ctx.lineTo(book.x+book.w*(.58+row*.1)*ease((s.t-j.booked)/.35),y);ctx.stroke();
      }
      label(ctx,mobile?`${booked.length} receipt${booked.length===1?'':'s'}`:`${s.children[i].arrivedCount} paid · ${booked.length} receipt${booked.length===1?'':'s'}`,book.x+book.w/2,book.y+28,INK2,'center',mobile?14:13);
      if(gather>0&&gather<1)for(const j of booked)
        packet(ctx,curve(receiptPoint(j.k),anchorPaths[i].parts[0].a),gather,BRONZE,'card');
      if(bind>0){const root=atTrack(anchorPaths[i],bind);
        ctx.strokeStyle=hexA(BRONZE,.15);ctx.lineWidth=.8;for(const part of anchorPaths[i].parts){path(ctx,part);ctx.stroke();}
        ctx.fillStyle=PAPER;ctx.strokeStyle=BRONZE;ctx.lineWidth=1;
        ctx.beginPath();ctx.rect(root.x-4,root.y-4,8,8);ctx.fill();ctx.stroke();}
    }

    for(const [i,c] of consumers.entries()) {
      ctx.save();ctx.translate(c.x,c.y);ctx.strokeStyle=INK2;ctx.fillStyle=PAPER;ctx.lineWidth=1.2;
      ctx.beginPath();ctx.arc(0,-5,5,0,TAU);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(-10,12);ctx.quadraticCurveTo(-10,2,0,2);ctx.quadraticCurveTo(10,2,10,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
      const order=s.orders[i];
      const g=wardens[i];
      ctx.fillStyle=PAPER;ctx.strokeStyle=BRONZE;ctx.lineWidth=1.2;
      ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,TAU);ctx.fill();ctx.stroke();
      label(ctx,'AI',g.x,g.y,BRONZE,'center',10);
      if(s.t>=order.evaluated) {
        ctx.strokeStyle=hexA(WORK,.6);ctx.lineWidth=1.4;
        ctx.beginPath();ctx.arc(g.x,g.y,g.r+4,.15,TAU-.15);ctx.stroke();
      }
      if(s.t>=order.consumerReceived)workSheet(ctx,point(c.x-18,c.y+3),i,.55);
      if(s.t>=order.consumerReceived&&s.t<order.feedbackAt)glow(ctx,c,23,WORK,.2);
      if(s.t>=order.feedback) {
        const text=order.review.useful?'Useful':'Needs work';
        ctx.save();ctx.font=`${mobile?10:12}px Georgia, "Iowan Old Style", serif`;
        const w=ctx.measureText(text).width+8;
        ctx.fillStyle=PAPER;ctx.beginPath();ctx.rect(c.x-w/2,137,w,16);ctx.fill();ctx.restore();
        label(ctx,text,c.x,145,WORK,'center',mobile?10:12);
      }
    }

    // the bodies last, so nothing paints over them
    for(const [i,enterprise] of enterprises.entries()) {
      // Different chamber structures, with the shared parchment skin kept intact.
      const children=i===1?[]:i===0?[[.9,-.5,.3]]:[[-.88,-.95,.28],[.87,.9,.23]];
      for(const [dx,dy,scale] of children) {
        const child=point(enterprise.x+enterprise.r*dx*1.35,enterprise.y+enterprise.r*dy*1.35,enterprise.r*scale);
        ctx.strokeStyle=hexA(BRONZE,.45);ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(enterprise.x,enterprise.y);ctx.lineTo(child.x,child.y);ctx.stroke();
        body(ctx,child,0,seconds,enterprise.phase+.8);
      }
      body(ctx,enterprise,enterprise.rung,seconds,enterprise.phase);
    }
    body(ctx, treasury, 3, seconds, .4);
    // Each child keeps a recognisable chamber structure, rather than sharing one orchestrator.
    for(const [i,a] of agents.entries()) {
      const moons=i===1?[[-.8,.95,.33],[.6,1.1,.27]]:i===0?[[.1,1.3,.3]]:[];
      for(const [dx,dy,scale] of moons){const satellite=point(a.x+dx*a.r,a.y+dy*a.r,a.r*scale);
        ctx.strokeStyle=hexA(BRONZE,.5);ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(satellite.x,satellite.y);ctx.stroke();
        body(ctx,satellite,0,seconds,i+.8);}
      body(ctx,a,a.rung,seconds,i*.9);
    }
    // the tags, in scene units, beside what they name; a little larger in portrait, where the plate is smaller
    const T = (text, x, y, align) => label(ctx, text, x, y, INK2, align, mobile ? 18 : 17);
    label(ctx,'Users',mobile?16:26,42,INK2,'left',mobile?15:18);
    label(ctx,'Own Warden',mobile?16:26,106,INK2,'left',mobile?13:14);
    label(ctx,'One Warden per paying user',(consumers[0].x+consumers.at(-1).x)/2,10,INK2,'center',mobile?13:14);
    label(ctx,'…',consumers.at(-1).x+(mobile?38:45),77,INK2,'center',18);
    label(ctx,'Products',mobile?438:725,10,INK2,'center',mobile?16:18);
    ctx.strokeStyle=hexA(BRONZE,.22);ctx.lineWidth=.8;
    for(const [x1,x2] of mobile?[[310,574]]:[[512,948]]) {
      ctx.beginPath();ctx.moveTo(x1,150);ctx.lineTo(x2,150);ctx.stroke();
    }
    T('Enterprises',mobile?65:88,mobile?264:245);
    for(const order of s.orders) {
      const e=enterprises[order.source];
      const status=order.phase==='pending'?'':order.phase==='requesting'?'Requested':
        ['working','assembling','delivering'].includes(order.phase)?'Working':
        ['received','fulfilling','using','customer-paying'].includes(order.phase)?'Serving':order.phase==='paying'?'Paying swarm':'Earned';
      label(ctx,order.name,e.x,e.y+e.r+18,INK2,'center',mobile?16:16);
      if(status)label(ctx,order.phase==='paid'?`+${sol(order.price)}`:status,e.x,e.y+e.r+37,order.phase==='paying'||order.phase==='paid'?BRONZE:WORK,'center',mobile?13:14);
    }
    T('Public treasury',treasury.x,treasury.y+treasury.r+24);
    label(ctx,sol(s.treasury.balance),treasury.x,treasury.y+treasury.r+51,DARK,'center',mobile?21:23);
    label(ctx,s.treasury.received>0?`Earned ${sol(s.treasury.received)}`:`Example · ${sol(OPENING_LAMPORTS)} at start`,treasury.x,treasury.y+treasury.r+76,INK2,'center',mobile?14:14);
    label(ctx,s.demand.repeat>0?'Vote again':'Votes',mobile?16:26,firstVote.y,INK2,'left',mobile?14:17);
    const voteCaption=s.demand.repeat>0
      ?s.demand.nextProgress===1?'Sealed':`${s.demand.repeat>=wardens.length?'N':s.demand.repeat} / N wardens`
      :mobile?'Charter':'Within the charter';
    label(ctx,voteCaption,(firstVote.x+lastVote.x)/2,seal.y+26,s.demand.repeat>0?WORK:INK2,'center',mobile?13:14);
    label(ctx,'Bulk refills',mobile?367:564,173,BRONZE,'center',mobile?16:18);
    label(ctx,'Agents',mobile?536:863,173,INK2,'center',mobile?16:18);
    if(!mobile)label(ctx,`${sol(PAYMENT_LAMPORTS)} per payment`,828,196,BRONZE,'center',13);
    T('Solana · batched settlement',width-40,chainY+18,'right');
    ctx.restore();
    label(ctx,spendingCaption(s),width/2,mobile?671:619,DARK,'center',mobile?17:22);
  }
  return {resize, render};
}
