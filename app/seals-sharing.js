// A collective workshop: permitted memories converge, new work keeps its authors,
// and a completed assembly sends acknowledgments back to its sources.
import {hexA} from './orb.js';
import {TAU,GOLD,BRONZE,DARK,INK2,WORK,PAPER,point,clamp,curve,path,packet,glow,keyGlyph,body,label,tag,dashed,solid,fitScene,clearScene} from './seals-draw.js?v=causal-how-2';
import {productDocument} from './seals-tank.js?v=cognitio-salvata-3';
import {collectiveSharingState,EPOCH} from './seals-sharing-collective.js?v=collective-1';

export function sharingLayout(mobile=false) {
  const m=mobile,w=m?600:1000;
  const sources=[point(m?110:175,m?176:165),point(w/2,m?170:145),point(m?490:825,m?176:165)];
  const workers=[point(m?118:238,m?471:419, m?26:34),point(m?482:762,m?471:419,m?26:34)];
  const folio=point(w/2,m?484:425);
  const rows=sources.map((source,i)=>{
    const side=i===2?1:0,sign=side?-1:1,worker=workers[side];
    return {source,trace:point(source.x+(m?30:46),source.y+3),
      crystal:point(source.x,source.y+(m?47:53)),
      gate:point(side?w-(m?110:218):(m?110:218),m?347:297),
      cache:point(worker.x+sign*(m?39:61),m?391:341),peer:worker,
      inherited:point(folio.x+sign*-54,folio.y-30),addition:point(folio.x+sign*-54,folio.y+36)};
  });
  const workshop={x:w/2,y:m?482:422,rx:m?282:454,ry:m?151:148};
  for(const p of rows) {
    const dx=(p.gate.x-workshop.x)/workshop.rx;
    p.gate.y=workshop.y-workshop.ry*Math.sqrt(Math.max(0,1-dx*dx));
  }
  return {mobile:m,width:w,height:m?710:650,rows,workers,folio,workshop};
}
function route(ctx,p,color=WORK,alpha=.23) {
  ctx.strokeStyle=hexA(color,alpha);ctx.lineWidth=.85;path(ctx,p);ctx.stroke();
}
function flight(ctx,p,t,start,end,color=WORK,kind='card') {
  if(!Number.isFinite(start)||!Number.isFinite(end)||t<start||t>=end||end<=start)return;
  route(ctx,p,color,.6);packet(ctx,p,clamp((t-start)/(end-start)),color,kind);
}
function crystal(ctx,p,alpha=1) {
  ctx.save();ctx.globalAlpha*=alpha;ctx.fillStyle=PAPER;ctx.strokeStyle=WORK;ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(p.x,p.y-12);ctx.lineTo(p.x+8,p.y);ctx.lineTo(p.x,p.y+12);ctx.lineTo(p.x-8,p.y);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(p.x,p.y-12);ctx.lineTo(p.x-3,p.y);ctx.lineTo(p.x,p.y+12);ctx.moveTo(p.x-8,p.y);ctx.lineTo(p.x+8,p.y);ctx.stroke();ctx.restore();
}
function book(ctx,p,count,alpha=1) {
  ctx.save();ctx.globalAlpha*=alpha;ctx.fillStyle=PAPER;ctx.strokeStyle=INK2;ctx.lineWidth=.8;
  ctx.fillRect(p.x-12,p.y-17,24,34);ctx.strokeRect(p.x-12,p.y-17,24,34);
  ctx.beginPath();ctx.moveTo(p.x-7,p.y-17);ctx.lineTo(p.x-7,p.y+17);ctx.stroke();
  for(let i=0;i<count;i++){ctx.beginPath();ctx.moveTo(p.x-3,p.y-12+i*3);ctx.lineTo(p.x+8,p.y-12+i*3);ctx.stroke();}ctx.restore();
}
function check(ctx,p,color=WORK) {
  ctx.save();ctx.fillStyle=PAPER;ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(p.x,p.y,8,0,TAU);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(p.x-3,p.y);ctx.lineTo(p.x-1,p.y+3);ctx.lineTo(p.x+4,p.y-3);ctx.stroke();ctx.restore();
}
function members(center,side,m) {
  // Atlas branches; Loom is a ring of specialists. Neither has a central AI owner.
  const coordinates=side===0?[[-54,-14],[-34,-52],[12,-57],[48,-8],[-42,37],[10,49]]:
    [[-42,-34],[6,-56],[51,-28],[49,22],[1,52],[-45,25]];
  const scale=m?.76:1;
  return coordinates.map(([x,y],i)=>point(center.x+x*scale,center.y+y*scale,(i%3===0?15:10)*scale));
}
function sourceBase(ctx,p,i,m) {
  const local=i===1,rx=local?(m?67:92):(m?93:130),ry=local?(m?52:62):(m?68:77);
  ctx.save();ctx.strokeStyle=hexA(local?BRONZE:WORK,.32);ctx.lineWidth=.85;
  ctx.fillStyle=hexA(local?BRONZE:WORK,.025);ctx.beginPath();ctx.ellipse(p.x,p.y,rx,ry,0,0,TAU);ctx.fill();ctx.stroke();
  ctx.strokeStyle=hexA(local?BRONZE:WORK,.15);ctx.beginPath();ctx.ellipse(p.x,p.y,rx+5,ry+4,0,0,TAU);ctx.stroke();
  if(!local) {
    const stars=[[-.76,-.13],[-.5,-.65],[.22,-.77],[.75,-.27]];
    stars.forEach(([x,y],j)=>{
      const q=point(p.x+x*rx,p.y+y*ry,j===1?10:7);
      route(ctx,curve(q,point(p.x-17,p.y)),BRONZE,.2);body(ctx,q,j===1?1:0,0,j+i);
    });
  }
  ctx.restore();
}
function folio(ctx,g,collective) {
  const p=g.folio,m=g.mobile,w=m?114:132,h=m?156:164;
  ctx.save();
  // The bounded bands preserve each source group; seventeen strokes never spill off the page.
  for(let i=2;i>=0;i--) {
    ctx.fillStyle=PAPER;ctx.strokeStyle=hexA(BRONZE,.35+i*.12);ctx.lineWidth=.9;
    ctx.fillRect(p.x-w/2+i*4,p.y-h/2-i*4,w,h);ctx.strokeRect(p.x-w/2+i*4,p.y-h/2-i*4,w,h);
  }
  tag(ctx,'COMMON WORK',p.x,p.y-h/2+16,'center',.9,m?9:10);
  for(const [i,s] of collective.segments.entries()) {
    const x=p.x+(i?1:-1)*(m?25:29),y=p.y-36;
    label(ctx,i?'II':'I',x,y-10,INK2,'center',11);
    for(let j=0;j<6;j++) {
      ctx.strokeStyle=hexA(WORK,s.inheritedArrived?.95:.13);ctx.lineWidth=1.6;
      ctx.beginPath();ctx.moveTo(x-17,y+j*5);ctx.lineTo(x+(j===5?7:17),y+j*5);ctx.stroke();
    }
    for(let j=0;j<(i?2:3);j++) {
      ctx.strokeStyle=hexA(BRONZE,s.newArrived?.95:.13);ctx.lineWidth=1.6;
      ctx.beginPath();ctx.moveTo(x-17,p.y+19+j*6);ctx.lineTo(x+(j===(i?1:2)?8:17),p.y+19+j*6);ctx.stroke();
    }
  }
  ctx.strokeStyle=hexA(BRONZE,.25);ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(p.x-w/2+14,p.y+8);ctx.lineTo(p.x+w/2-14,p.y+8);ctx.stroke();
  label(ctx,'Atlas × Loom',p.x,p.y+h/2-14,collective.complete?BRONZE:INK2,'center',m?12:14);
  if(collective.complete)check(ctx,point(p.x+w/2,p.y-h/2));
  ctx.restore();
}
function phase(state) {
  const c=state.collective;
  if(c.receiptReceived)return 'Many authors. One shared result.';
  if(c.complete)return 'A shared result. A receipt for every source.';
  if(c.newLayers)return 'Their own work joins what others already learned.';
  if(c.inheritedLayers)return 'Start together, further along.';
  if(state.rows.some(r=>r.verified))return 'Receive. Verify. Build on what came before.';
  if(state.rows.some(r=>r.consented))return 'Useful knowledge travels with permission.';
  return 'Every swarm has something to bring.';
}

export function createSharingScene(canvas) {
  const ctx=canvas.getContext('2d');let g,view,base,teams;
  function drawBase(c) {
    const m=g.mobile;
    for(const [i,p] of g.rows.entries())sourceBase(c,p.source,i,m);
    const a=g.workshop;
    c.save();c.strokeStyle=hexA(BRONZE,.36);c.lineWidth=.8;dashed(c,3,5);
    c.beginPath();c.ellipse(a.x,a.y,a.rx,a.ry,0,0,TAU);c.stroke();solid(c);
    tag(c,'THE SHARED WORKSHOP',g.width/2,m?323:281,'center',.95,m?12:13);
    c.restore();
    teams.forEach((peers,side)=>{
      const center=g.workers[side];
      c.save();c.strokeStyle=hexA(WORK,.16);c.lineWidth=.75;
      c.beginPath();c.ellipse(center.x,center.y,m?69:93,m?73:87,side?-.22:.2,0,TAU);c.stroke();
      peers.forEach((q,i)=>{
        route(c,curve(q,side?peers[(i+1)%peers.length]:i%2?peers[i-1]:center),WORK,.27);
      });
      body(c,center,side?1:2,0,side+1);peers.forEach((p,i)=>body(c,p,i%3===0?1:0,0,i*.7+side));c.restore();
    });
  }
  function resize(mobile) {
    g=sharingLayout(mobile);view=fitScene(canvas,mobile);if(!view)return;
    teams=g.workers.map((p,i)=>members(p,i,mobile));
    base=canvas.ownerDocument?.createElement('canvas')||null;
    if(base){base.width=canvas.width;base.height=canvas.height;const c=base.getContext('2d');clearScene(c,base,view);drawBase(c);}
  }
  function render(milliseconds,reduced=false) {
    if(!g||!view)return;
    const state=collectiveSharingState(reduced?EPOCH-.001:milliseconds/1000),{t,collective}=state,m=g.mobile;
    clearScene(ctx,canvas,view);
    if(base){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(base,0,0);ctx.restore();}else drawBase(ctx);
    // Authored products remain in their own colonies, including the unshared one.
    state.rows.forEach((row,i)=>{
      const p=g.rows[i],local=i===1,e=row.events,source=point(p.source.x-(local?12:16),p.source.y+3);
      tag(ctx,local?'PRIVATE ARCHIVE':i===0?'I / RESEARCH COMMONS':'II / TOOLMAKERS',p.source.x,m?82:61,'center',.95,m?10:12);
      productDocument(ctx,source,{count:row.sourceLayers});book(ctx,p.trace,row.traceSaved?row.sourceLayers:0,row.traceSaved?1:.35);
      route(ctx,curve(point(source.x+18,source.y),point(p.trace.x-12,p.trace.y)),INK2,.25);
      flight(ctx,curve(source,p.trace),t,e.traceStarted,e.traceSaved,INK2);
      if(!local) {
        route(ctx,curve(p.trace,p.crystal),WORK,.18);flight(ctx,curve(p.trace,p.crystal),t,e.traceSaved,e.crystalReady);
        crystal(ctx,p.crystal,row.crystalReady?1:.18);
      }
      label(ctx,row.sourceLabel,p.source.x,m?111:88,local?INK2:WORK,'center',m?15:21);
      if(local) {
        keyGlyph(ctx,p.source.x,p.source.y+(m?66:79),m?17:21,BRONZE);
        label(ctx,'Stays local',p.source.x,p.source.y+(m?88:103),INK2,'center',m?13:15);
        return;
      }
      const side=i===0?0:1,s=collective.segments.find(s=>s.rowId===row.id);
      const permitted=!!s?.authorized,gate=p.gate,center=g.workers[side];
      const toGate=curve(p.crystal,gate,side?-6:6),fromGate=curve(gate,p.cache,side?6:-6),intake=curve(p.cache,center),inherit=curve(center,p.inherited,side?-16:16),add=curve(center,p.addition,side?25:-25);
      if(row.consented&&permitted){route(ctx,toGate,WORK,.28);route(ctx,fromGate,WORK,.28);}
      const gateAt=e.transferStarted+(e.received-e.transferStarted)*.48;
      if(permitted){flight(ctx,toGate,t,e.transferStarted,gateAt);flight(ctx,fromGate,t,gateAt,e.received);}
      // Consent belongs to these named participants, not to all future recipients.
      ctx.save();ctx.fillStyle=PAPER;ctx.beginPath();ctx.arc(gate.x,gate.y,14,0,TAU);ctx.fill();
      keyGlyph(ctx,gate.x,gate.y,m?18:23,row.consented&&permitted?GOLD:INK2);ctx.restore();
      label(ctx,i===0?'Workshop consent':'Public contribution',gate.x+(side?-17:17),gate.y+(m?-16:-13),INK2,side?'right':'left',m?11:12);
      if(row.received&&permitted)crystal(ctx,p.cache);
      if(row.verified&&permitted){check(ctx,point(p.cache.x+(side?-16:16),p.cache.y-9));route(ctx,intake,WORK,.25);route(ctx,inherit,WORK,.25);}
      if(permitted){flight(ctx,intake,t,e.verified,e.reused);flight(ctx,inherit,t,e.reused,s.inheritedArrival);}
      if(row.working&&permitted) {
        const elapsed=t-e.workStarted;
        teams[side].forEach((q,j)=>{
          const u=(elapsed*1.8-j*.18)%1;if(u<0)return;
          const dest=side?teams[side][(j+1)%teams[side].length]:center;
          packet(ctx,curve(q,dest),u,BRONZE,'dot',.7);
        });
        const progress=clamp(elapsed/(e.workDone-e.workStarted));
        ctx.strokeStyle=BRONZE;ctx.lineWidth=1.7;ctx.beginPath();ctx.arc(center.x,center.y,center.r+5,-Math.PI/2,-Math.PI/2+TAU*progress);ctx.stroke();
      }
      if(permitted){route(ctx,add,BRONZE,s.newArrived?.35:.12);flight(ctx,add,t,e.derivedCommitted,s.newArrival,BRONZE);}
      tag(ctx,side?'LOOM':'ATLAS',center.x,m?568:524,'center',.98,m?13:15);
      label(ctx,s?.newArrived?`${side?2:3} new contributions`:row.working?'Making new work':'A swarm of contributors',center.x,m?590:547,s?.newArrived?BRONZE:INK2,'center',m?11:13);
      // Only the committed joint result acknowledges its sources, through the same gate.
      if(collective.complete) {
        const start=collective.receiptSentAt,end=collective.receiptReceivedAt,one=start+(end-start)*.43,two=start+(end-start)*.69;
        flight(ctx,curve(p.addition,p.cache,side?13:-13),t,start,one,BRONZE,'root');
        flight(ctx,curve(p.cache,gate,side?-6:6),t,one,two,BRONZE,'root');
        flight(ctx,curve(gate,p.crystal,side?6:-6),t,two,end,BRONZE,'root');
        if(collective.receiptReceived)check(ctx,point(p.crystal.x+(side?-17:17),p.crystal.y),BRONZE);
      }
    });
    folio(ctx,g,collective);
    const countY=m?599:555;
    label(ctx,`${collective.inheritedLayers} reused · ${collective.newLayers} new`,g.folio.x,countY,collective.complete?WORK:INK2,'center',m?16:19);
    if(!m)label(ctx,'Authorship carried forward',g.folio.x,578,INK2,'center',13);
    label(ctx,phase(state),g.width/2,m?671:619,DARK,'center',m?17:22);
  }
  return {resize,render};
}
