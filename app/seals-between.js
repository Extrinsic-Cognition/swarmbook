// A gossip ecosystem, drawn from one deterministic clock. Positions, permission
// changes, recipient activation and acknowledgments share the same journeys.
import {hexA} from './orb.js';
import {TAU,GOLD,BRONZE,DARK,INK2,WORK,PAPER,mix,clamp,ease,point,curve,onCurve,path,glow,keyGlyph,body,label,tag,clearScene} from './seals-draw.js?v=causal-how-2';

export const CYCLE=26,MODEL_EVERY=CYCLE,PLAYBACK_RATE=2.5;
export const LEVELS=[
  {id:'L-0',name:'Local',where:'your machine',label:'C3 · private'},
  {id:'L-1',name:'Privileged',where:'your master claw',label:'C2 · branch'},
  {id:'L-N',name:'Contextual',where:'a swarm’s claws',label:'C1 · hive'},
  {id:'L-P',name:'Public',where:'anyone can read',label:'C0 · public'},
];
export const MEMBRANE_TIME={born:.6,gate1:2.4,pass1:3.4,gate2:5.2,pass2:6.2,gate3:8,refused:8.9,consent:10,pass3:11,intruder:20,stopped:22,rest:24};
const mt=MEMBRANE_TIME,REFUSED='#B0413E';
export function membraneState(seconds) {
  seconds=Math.max(0,seconds);const cycle=Math.floor(seconds/CYCLE),t=seconds%CYCLE;
  const phase=t<mt.born?'pending':t<mt.gate1?'rising':t<mt.pass1?'summarizing':t<mt.gate2?'rising':t<mt.pass2?'tokenizing'
    :t<mt.gate3?'rising':t<mt.refused?'refusing':t<mt.consent?'waiting':t<mt.pass3?'publishing':t<mt.intruder?'published'
    :t<mt.stopped?'intruding':t<mt.rest?'stopped':'rest';
  const level=t<mt.pass1?0:t<mt.pass2?1:t<mt.pass3?2:3;
  const receipts=(t>=mt.pass1?1:0)+(t>=mt.pass2?1:0)+(t>=mt.pass3?1:0),refusals=(t>=mt.refused?1:0)+(t>=mt.stopped?1:0);
  return {seconds,cycle,t,phase,level,label:LEVELS[level].label,receipts,refusals,receiptsTotal:cycle*3+receipts,refusalsTotal:cycle*2+refusals};
}
export const SWARMS=[
  {id:'archive',name:'The Archive',formation:'Cellular peers',rung:1},
  {id:'mnemosyne',name:'Mnemosyne',formation:'A branching memory',rung:2},
  {id:'observatory',name:'The Observatory',formation:'Twin working circles',rung:1},
  {id:'atelier',name:'The Atelier',formation:'An open constellation',rung:0},
  {id:'relay',name:'The Relay',formation:'A chain of specialists',rung:1},
];
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const lerp=(a,b,t)=>point(mix(a.x,b.x,t),mix(a.y,b.y,t));
export function boundaryPoint(s,toward,factor=1) {
  const dx=toward.x-s.x,dy=toward.y-s.y;
  const k=factor/Math.sqrt(dx*dx/(s.rx*s.rx)+dy*dy/(s.ry*s.ry));
  return point(s.x+dx*k,s.y+dy*k);
}
function anglePoint(s,a,f=1) {return point(s.x+s.rx*f*Math.cos(a),s.y+s.ry*f*Math.sin(a));}
export function ecosystemLayout(mobile=false) {
  const frames=mobile?[[137,145,110,78],[300,355,135,98],[463,145,110,78],[137,563,110,78],[463,563,110,78]]
    :[[160,172,132,98],[500,322,168,123],[840,172,132,98],[160,469,132,98],[840,469,132,98]];
  const swarms=SWARMS.map((s,i)=>({...s,x:frames[i][0],y:frames[i][1],rx:frames[i][2],ry:frames[i][3],nodes:[],edges:[]}));
  for(const [i,s] of swarms.entries()) {
    const add=(x,y,r=8)=>{const n={...point(s.x+x*s.rx,s.y+y*s.ry,r),id:`${s.id}-${s.nodes.length}`};s.nodes.push(n);return s.nodes.length-1;};
    const edge=(a,b)=>s.edges.push([a,b]);
    // All work units stay outside the small private source pocket. Each colony
    // has its own topology; the contour colour describes access, not allegiance.
    if(i===1) {
      for(let k=0;k<3;k++) {
        const a=-.65+k*TAU/3,root=add(Math.cos(a)*.46,Math.sin(a)*.46,12);
        for(let j=-1;j<=1;j++) {const b=a+j*.36,n=add(Math.cos(b)*.81,Math.sin(b)*.8,7.5);edge(root,n);if(j>-1)edge(n-1,n);}
      }
      edge(0,4);edge(4,8);
    } else if(i===0) {
      for(let k=0;k<8;k++){const a=k*TAU/8+.12;add(Math.cos(a)*.76,Math.sin(a)*.75,k%3?8:11);if(k)edge(k-1,k);}edge(7,0);edge(1,3);edge(4,6);
    } else if(i===2) {
      for(let group=0;group<2;group++)for(let k=0;k<4;k++) {const a=k*TAU/4+.4,n=add((group? .49:-.49)+Math.cos(a)*.25,Math.sin(a)*.62,k?7:11);if(k)edge(n-1,n);}
      edge(3,0);edge(7,4);edge(1,7);
    } else if(i===3) {
      const xy=[[-.76,.12],[-.5,-.63],[.02,-.81],[.68,-.45],[.8,.25],[.3,.76],[-.37,.69],[-.5,.04]];
      xy.forEach(([x,y],j)=>{add(x,y,j%3?8:11);if(j)edge(j-1,j);});edge(7,0);edge(2,7);
    } else {
      const xy=[[-.77,-.3],[-.4,-.58],[.02,-.7],[.47,-.48],[.77,-.08],[.53,.54],[.04,.72],[-.5,.53]];
      xy.forEach(([x,y],j)=>{add(x,y,j%3?8:11);if(j)edge(j-1,j);});edge(1,7);edge(3,5);
    }
  }
  // These six rails are peers talking to peers. No public hub has authority.
  const pairs=[[1,0],[1,2],[0,3],[2,4],[3,4]];
  const routes=pairs.map(([a,b],i)=>{
    const from=swarms[a],to=swarms[b];let out=boundaryPoint(from,to),gate=boundaryPoint(to,from),bend=0;
    if(i===2||i===3) {const sign=i===2?-1:1;out=anglePoint(from,sign<0?2.28:.86);gate=anglePoint(to,sign<0?4.0:5.42);bend=sign<0?32:-32;}
    if(i===4) {out=anglePoint(from,.48);gate=anglePoint(to,Math.PI-.48);bend=mobile?25:34;}
    const inner=lerp(to,gate,.83);
    return {id:`${a}-${b}`,a,b,from,to,out,gate,inner,rail:curve(out,gate,bend)};
  });
  for(const s of swarms) {
    s.localRails=s.edges.filter(([a,b])=>Array.from({length:21},(_,k)=>lerp(s.nodes[a],s.nodes[b],k/20)).every(p=>Math.hypot((p.x-s.x)/s.rx,(p.y-s.y)/s.ry)>.57));
  }
  const source=swarms[1],toward=swarms[0];
  const gates=[.25,.56,1].map(f=>boundaryPoint(source,toward,f));
  return {mobile,width:mobile?600:1000,height:mobile?710:650,swarms,routes,source,gates};
}
// A forwarded projection is already public; admission never relabels it as
// private or gives it authority to issue instructions. Every receiving gate checks.
export function gossipJourneys(g) {
  return g.routes.map((r,i)=>{
    const sentAt=[11,11.7,15.5,16.2,20][i],travel=[1.8,1.8,2,2,2][i];
    const gateAt=sentAt+travel,decisionAt=gateAt+.9,arrivedAt=decisionAt+.55;
    return {...r,sentAt,gateAt,decisionAt,arrivedAt,receiptSentAt:arrivedAt+.25,receiptArrivedAt:arrivedAt+.25+travel+.55,duplicate:i===4};
  });
}
export function gossipHopState(h,t) {
  if(t<h.sentAt)return {phase:'pending',p:h.out};
  if(t<h.gateAt)return {phase:'travelling',p:onCurve(h.rail,(t-h.sentAt)/(h.gateAt-h.sentAt))};
  if(t<h.decisionAt)return {phase:'checking',p:h.gate};
  if(h.duplicate)return {phase:'duplicate',p:h.gate};
  if(t<h.arrivedAt)return {phase:'admitting',p:lerp(h.gate,h.inner,ease((t-h.decisionAt)/(h.arrivedAt-h.decisionAt)))};
  return {phase:'arrived',p:h.inner};
}
export function featuredTrace(t,g) {
  const p=[g.source,...g.gates];
  const starts=[mt.born,mt.pass1,mt.pass2],ends=[mt.gate1,mt.gate2,mt.gate3],passes=[mt.pass1,mt.pass2,mt.pass3];
  if(t<mt.born)return {p:p[0],level:0,checking:false};
  for(let i=0;i<3;i++) {
    if(t<ends[i])return {p:lerp(p[i],p[i+1],(t-starts[i])/(ends[i]-starts[i])),level:i,checking:false};
    if(t<passes[i])return {p:p[i+1],level:i,checking:true};
  }
  return {p:p[3],level:3,checking:false};
}
export function ecosystemState(seconds,g) {
  const s=membraneState(seconds),journeys=gossipJourneys(g),arrived=journeys.filter(h=>!h.duplicate&&s.t>=h.arrivedAt);
  return {...s,journeys,arrived,acknowledged:journeys.filter(h=>!h.duplicate&&s.t>=h.receiptArrivedAt),trace:featuredTrace(s.t,g)};
}
const PHASE_COPY=[
  [0,'A private beginning.','Each swarm keeps its own sources, working circles and boundaries.'],
  [2.4,'Useful context, with less exposure.','A summary crosses the first gate. The private source stays home.'],
  [5.2,'Only what the next circle needs.','The second gate minimizes the projection for the swarm.'],
  [8,'A boundary is a decision.','No consent, no publication. The projection waits at its own gate.'],
  [10,'Consent opens this crossing.','One permitted projection can leave. The source remains private.'],
  [12,'Gossip travels between peers.','Receiving swarms check the projection before admitting or forwarding it.'],
  [17,'Knowledge travels. Receipts return.','Each peer acknowledges its own crossing along the route it used.'],
  [20,'Shared knowledge is not authority.','An untrusted instruction is stopped at the receiving boundary.'],
  [24,'Many formations. The same discipline.','Sources stay. Projections travel. A receipt records the crossing.'],
];
export function createBetweenScene(canvas) {
  const ctx=canvas.getContext('2d');let view,g,base;
  const ellipse=(c,s,f,color,alpha,w=1)=>{c.strokeStyle=hexA(color,alpha);c.lineWidth=w;c.beginPath();c.ellipse(s.x,s.y,s.rx*f,s.ry*f,0,0,TAU);c.stroke();};
  function card(c,p,color=GOLD,size=1) {
    c.save();c.translate(p.x,p.y);c.fillStyle=PAPER;c.strokeStyle=color;c.lineWidth=1.2;
    c.beginPath();c.rect(-6*size,-4.5*size,12*size,9*size);c.fill();c.stroke();
    c.beginPath();c.moveTo(-3*size,-1*size);c.lineTo(3*size,-1*size);c.moveTo(-3*size,2*size);c.lineTo(1*size,2*size);c.stroke();c.restore();
  }
  function gate(c,p,s,color=BRONZE,open=false,emphasis=0) {
    const angle=Math.atan2(p.y-s.y,p.x-s.x);c.save();c.translate(p.x,p.y);c.rotate(angle);
    c.strokeStyle=hexA(color,emphasis?.95:.65);c.lineWidth=emphasis?2:1.3;c.lineCap='round';
    c.beginPath();c.moveTo(0,-10);c.lineTo(0,open?-5:-2);c.moveTo(0,open?5:2);c.lineTo(0,10);c.stroke();
    c.restore();if(emphasis)glow(c,p,20,color,.17);
  }
  function drawBase(c) {
    const mobile=g.mobile,small=mobile?15:10;
    // The public commons is negative space, not a super-swarm owning everyone.
    tag(c,'L-P  /  PUBLIC COMMONS',g.width/2,mobile?12:32,'center',.72,mobile?12:10);
    if(!mobile)label(c,'A society of swarms.',g.width/2,mobile?53:62,DARK,'center',mobile?26:24);
    if(!mobile)label(c,'Distinct formations. Their own boundaries.',g.width/2,mobile?80:86,INK2,'center',mobile?16:12);
    for(const r of g.routes) {c.strokeStyle=hexA(BRONZE,.3);c.lineWidth=1;path(c,r.rail);c.stroke();}
    for(const [i,s] of g.swarms.entries()) {
      // Translucent precincts preserve the site's existing gold / bronze / teal grammar.
      c.save();
      for(const [f,color,alpha] of [[1,WORK,.035],[.56,BRONZE,.05],[.25,GOLD,.09]]) {
        c.fillStyle=hexA(color,alpha);c.beginPath();c.ellipse(s.x,s.y,s.rx*f,s.ry*f,0,0,TAU);c.fill();
      }
      ellipse(c,s,1,WORK,.4,1.1);ellipse(c,s,.97,WORK,.13,.6);
      ellipse(c,s,.56,BRONZE,.35,.8);ellipse(c,s,.25,GOLD,.6,1);
      for(const [a,b] of s.edges) {c.strokeStyle=hexA(BRONZE,.29);c.lineWidth=.7;c.beginPath();c.moveTo(s.nodes[a].x,s.nodes[a].y);c.lineTo(s.nodes[b].x,s.nodes[b].y);c.stroke();}
      for(const [k,n] of s.nodes.entries())body(c,n,k%5===0?1:0,0,i*.8+k*.37,{ink:.5});
      body(c,point(s.x,s.y,i===1?23:17),s.rung,0,.45+i*.7,{ink:.65});
      // A source is kept inside every private pocket, including after export.
      card(c,point(s.x+12,s.y+8),BRONZE,.7);
      const nameY=s.y-s.ry-24;
      tag(c,`${['I','II','III','IV','V'][i]}  /  ${s.name}`,s.x,nameY,'center',.95,mobile?16:13);
      if(!mobile)label(c,s.formation,s.x,nameY+(mobile?21:17),INK2,'center',small);
      if(i===1) {
        label(c,'C3',s.x+15,s.y+31,BRONZE,'center',mobile?14:10);
        label(c,'C2',s.x+s.rx*.47,s.y+13,BRONZE,'center',mobile?14:10);
        label(c,'C1',s.x+s.rx*.85,s.y+13,WORK,'center',mobile?14:10);
      }
      c.restore();
    }
    for(const r of g.routes){gate(c,r.out,r.from);gate(c,r.gate,r.to);}
    g.gates.forEach(p=>gate(c,p,g.source));
    // Small instruments sit beside the hero colony, never on top of a route.
    if(!mobile)label(c,'LOCAL → PRIVILEGED → CONTEXTUAL',g.source.x,g.source.y+g.source.ry+20,INK2,'center',mobile?14:10);
  }
  function resize(mobile) {
    g=ecosystemLayout(mobile);const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height){view=null;return;}
    const dpr=Math.min(globalThis.devicePixelRatio||1,2),scale=Math.min(rect.width/g.width,rect.height/g.height);
    const w=Math.round(rect.width*dpr),h=Math.round(rect.height*dpr);
    if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;
    view={dpr,scale,x:(rect.width-g.width*scale)/2,y:(rect.height-g.height*scale)/2};
    // Cache the detailed Goldberg geometry; only traffic and small signals are
    // painted each frame. No secondary RAF, wall clock, resize loop or 3-D churn.
    base=canvas.ownerDocument?.createElement('canvas')||null;
    if(base){base.width=w;base.height=h;const c=base.getContext('2d');clearScene(c,base,view);drawBase(c);}
  }
  function render(ms,reduced=false) {
    if(!g||!view)return;
    const seconds=reduced?24.8:ms*PLAYBACK_RATE/1000,s=ecosystemState(seconds,g),t=s.t;
    clearScene(ctx,canvas,view);
    if(base) {ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(base,0,0);ctx.restore();}else drawBase(ctx);
    // Local work proceeds independently. Each packet stays inside its own
    // contextual precinct and has a short, readable journey between two peers.
    if(!reduced)for(const [i,swarm] of g.swarms.entries()) {
      for(let lane=0;lane<2;lane++) {
        const time=(seconds+i*1.17+lane*2.2)%5.5;if(time>2.8)continue;
        if(!swarm.localRails.length)continue;
        const [a,b]=swarm.localRails[(i+lane*3)%swarm.localRails.length],p=lerp(swarm.nodes[a],swarm.nodes[b],time/2.8);
        ctx.fillStyle=hexA(WORK,.65);ctx.beginPath();ctx.arc(p.x,p.y,2,0,TAU);ctx.fill();
      }
    }
    // Admission state, route packet, receipt and recipient glow all use the
    // same events. Receipts retrace the exact admitted path in reverse.
    for(const h of s.journeys) {
      const hs=gossipHopState(h,t),active=t>=h.sentAt&&t<h.receiptArrivedAt+.6;
      if(t>=h.sentAt) {ctx.strokeStyle=hexA(WORK,h.duplicate?.2:active?.55:.28);ctx.lineWidth=active?1.4:.9;path(ctx,h.rail);ctx.stroke();}
      if(['travelling','checking','admitting'].includes(hs.phase)) {
        glow(ctx,hs.p,15,WORK,.2);card(ctx,hs.p,WORK,1);
        if(hs.phase==='checking')gate(ctx,h.gate,h.to,WORK,false,1);
      }
      if(t>=h.decisionAt&&!h.duplicate)gate(ctx,h.gate,h.to,WORK,true,active?1:0);
      if(t>=h.arrivedAt&&!h.duplicate) {
        glow(ctx,h.inner,19,WORK,.18);card(ctx,h.inner,WORK,.8);
      }
      if(t>=h.receiptSentAt&&t<h.receiptArrivedAt&&!h.duplicate) {
        const u=(t-h.receiptSentAt)/(h.receiptArrivedAt-h.receiptSentAt);
        const p=u<.18?lerp(h.inner,h.gate,u/.18):onCurve(h.rail,1-(u-.18)/.82);
        card(ctx,p,BRONZE,.72);
      }
      if(h.duplicate&&t>=h.decisionAt) {
        gate(ctx,h.gate,h.to,WORK,false,1);
        if(!g.mobile&&t<24.8)label(ctx,'Already received',h.gate.x-(g.mobile?4:18),h.gate.y+(g.mobile?22:21),WORK,'right',g.mobile?16:12);
      }
    }
    // The featured derivative travels continuously and waits exactly on each
    // source boundary. Its C-label changes at the decision, not at a later node.
    if(t<mt.pass3) {
      const tr=s.trace;glow(ctx,tr.p,21,GOLD,.25);card(ctx,tr.p,GOLD,1.15);
      if(!g.mobile)label(ctx,LEVELS[tr.level].label,tr.p.x+(g.mobile?18:17),tr.p.y-(g.mobile?19:16),BRONZE,'left',g.mobile?17:12);
    }
    const passes=[mt.pass1,mt.pass2,mt.pass3],starts=[mt.gate1,mt.gate2,mt.gate3];
    g.gates.forEach((p,i)=>{
      const checking=t>=starts[i]&&t<passes[i],passed=t>=passes[i],waiting=i===2&&t>=mt.refused&&t<mt.consent;
      gate(ctx,p,g.source,waiting?REFUSED:passed?WORK:GOLD,passed,checking?1:0);
      if(passed) {
        const u=clamp((t-passes[i])/1.25);card(ctx,lerp(p,g.source,ease(u)),BRONZE,.66);
      }
    });
    if(t>=mt.refused&&t<mt.pass3) {
      const p=g.gates[2];
      if(t<mt.consent&&!g.mobile)label(ctx,'Consent required',p.x+(g.mobile?4:0),p.y-(g.mobile?29:26),REFUSED,'center',g.mobile?17:12);
      else if(t>=mt.consent){keyGlyph(ctx,p.x,p.y-25,g.mobile?29:23,WORK);if(!g.mobile)label(ctx,'Consented',p.x,p.y-46,WORK,'center',g.mobile?17:12);}
    }
    if(t>=mt.pass3&&!g.mobile) {
      const p=g.gates[2];label(ctx,'C0 · permitted projection',p.x-5,p.y-(g.mobile?24:22),WORK,'center',g.mobile?16:11);
    }
    // An instruction approaches an actual outside boundary, stops there and
    // returns. It is never drawn inside a protected ring or treated as a command.
    if(t>=mt.intruder) {
      const target=g.swarms[2],gateP=anglePoint(target,-.6),outside=lerp(target,gateP,1.34);
      const u=t<mt.stopped?(t-mt.intruder)/(mt.stopped-mt.intruder):1-clamp((t-mt.stopped-1)/1.2);
      const p=lerp(outside,gateP,clamp(u));card(ctx,p,REFUSED,.85);gate(ctx,gateP,target,REFUSED,false,t>=mt.stopped?1:0);
      if(t>=mt.stopped) {
        if(!g.mobile)label(ctx,'Cannot act',gateP.x-6,gateP.y-22,REFUSED,'right',g.mobile?17:12);
        ctx.strokeStyle=REFUSED;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(gateP.x-4,gateP.y-4);ctx.lineTo(gateP.x+4,gateP.y+4);ctx.moveTo(gateP.x+4,gateP.y-4);ctx.lineTo(gateP.x-4,gateP.y+4);ctx.stroke();
      }
    }
    // A single line lives inside the common stage; every lens keeps the same footer.
    const copy=[...PHASE_COPY].reverse().find(c=>t>=c[0])||PHASE_COPY[0];
    label(ctx,copy[1],g.width/2,g.mobile?683:617,DARK,'center',g.mobile?20:20);

  }
  return {resize,render};
}
