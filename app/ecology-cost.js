// Compute once: a preserved trace, then checked peer-to-peer reuses of that same work.
// The topology comes from Shared memory. These are illustrated events, not measured savings.
// Each author has an independent cadence. Only a particular trace’s dependencies order its events.
// Other computations, requests, transfers and checks overlap; no swarm-wide turn or reset exists.
import {INK, hexA, skinForRung, drawSkin} from './orb.js';
import {floorFor} from './ecology-memory.js?v=glide-2';
import {createCostChart,costLayout} from './ecology-cost-chart.js?v=collective-cost-1';

const TAU=Math.PI*2, GREEN='#3E7C74', GOLD=INK.gold, BRONZE=INK.bronze;
const clamp=x=>Math.max(0,Math.min(1,x));
const TRACE_COLORS=[GOLD,GREEN,BRONZE,'#657E94','#856780'];
export const PACE=.62, SETTLE=.28, RECENT_LIMIT=8;
const QUERY=.32*PACE, HOLD=2.4*PACE;
const phase=(t,start,duration)=>t>=start&&t<start+duration?(t-start)/duration:null;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function measure(points) {
  const cumulative=[0];
  for(let i=1;i<points.length;i++)cumulative.push(cumulative.at(-1)+distance(points[i-1],points[i]));
  return {points,cumulative,length:cumulative.at(-1)};
}
function along(route,t) {
  const at=clamp(t)*route.length;
  let i=1;while(i<route.cumulative.length-1 && route.cumulative[i]<at)i++;
  const a=route.points[i-1],b=route.points[i],local=(at-route.cumulative[i-1])/(route.cumulative[i]-route.cumulative[i-1]||1);
  return {x:a.x+(b.x-a.x)*local,y:a.y+(b.y-a.y)*local};
}
const models=new Map();
export function reusePlan(mobile=false) {
  if(models.has(mobile))return models.get(mobile);
  const floor=floorFor(mobile),routes=new Map();
  for(const from of floor.bodies)for(const to of floor.bodies) {
    if(from.i===to.i)continue;
    const candidates=floor.junctions.map(j=>j.routes[from.i]).filter(r=>r?.to===to.i).sort((a,b)=>a.cum.at(-1)-b.cum.at(-1));
    if(candidates.length)routes.set(`${from.i}:${to.i}`,measure([from,...candidates[0].route,to]));
  }
  const authors=[0,4,1,5,2],starts=[0,0,.65,1.4,2.1].map(t=>t*PACE),periods=[6.7,7.9,8.6,9.3,10.1].map(t=>t*PACE);
  const streams=authors.map((source,index)=>{
    const computeFor=[1.1,1.65,1.25,1.85,1.4][index]*PACE,publishAt=computeFor+.28*PACE;
    // Several recipients ask the author independently. Checked copies supply
    // further peers while unrelated branches and other authors keep moving.
    const targets=floor.bodies.filter(b=>b.i!==source).sort((a,b)=>Number(a.local)-Number(b.local)||routes.get(`${source}:${a.i}`).length-routes.get(`${source}:${b.i}`).length);
    const ready=new Map([[source,publishAt]]),hops=[];
    for(let i=0;i<targets.length;i++) {
      const from=i<3?source:targets[i-3].i,to=targets[i].i,route=routes.get(`${from}:${to}`);
      if(!route||floor.bodies[from].local)throw new Error('A trace needs an existing connection and a permitted supplier.');
      const requestAt=ready.get(from)+(.1+(i%3)*.16)*PACE;
      const queryFor=QUERY+(i%2)*.11*PACE,retrieveFor=(.65+Math.min(1.1,route.length/800))*PACE,checkFor=(.3+((i+index)%3)*.11)*PACE;
      const sendAt=requestAt+queryFor,arriveAt=sendAt+retrieveFor,verifiedAt=arriveAt+checkFor,storedAt=verifiedAt+SETTLE;
      hops.push({from,to,route,requestAt,sendAt,arriveAt,verifiedAt,storedAt,queryFor,retrieveFor,checkFor});ready.set(to,storedAt);
    }
    return {source,index,key:String.fromCharCode(65+index),color:TRACE_COLORS[index],firstAt:starts[index],period:periods[index],computeFor,publishAt,hops,completedAt:Math.max(...hops.map(h=>h.storedAt))};
  });
  const width=mobile?600:1000,height=mobile?710:650;
  const card={x:width/2-(mobile?174:162),y:mobile?13:18,w:mobile?348:324,h:105};
  const model={floor,streams,width,height,mobile,card};models.set(mobile,model);return model;
}
const occurred=(seconds,first,period)=>seconds<first?0:Math.floor((seconds-first)/period)+1;
function storageOffset(stream,peer) {
  return stream.source===peer?stream.publishAt:stream.hops.find(h=>h.to===peer)?.storedAt;
}
function storedRecord(stream,generation,peer) {
  return {id:`${stream.key}${generation+1}`,source:stream.source,key:stream.key,color:stream.color,generation,
    storedAt:stream.firstAt+generation*stream.period+storageOffset(stream,peer),
    kind:stream.source===peer?'authored':'received'};
}
function inputsFor(stream,generation,startAt,model) {
  const own=generation>0?storedRecord(stream,generation-1,stream.source):null;
  const foreign=[];
  for(const other of model.streams) {
    if(other.source===stream.source)continue;
    const at=storageOffset(other,stream.source);if(at===undefined)continue;
    // Strictly earlier deposits are usable. A packet arriving in this same
    // instant is not silently turned into an input to work already starting.
    let latest=Math.ceil((startAt-other.firstAt-at)/other.period)-1;
    if(latest>=0&&storedRecord(other,latest,stream.source).storedAt>=startAt)latest--;
    if(latest>=0)foreign.push(storedRecord(other,latest,stream.source));
  }
  foreign.sort((a,b)=>b.storedAt-a.storedAt||a.id.localeCompare(b.id));
  return [...(own&&own.storedAt<startAt?[own]:[]),...foreign.slice(0,2)];
}
function peerInventory(seconds,peer,model) {
  let authoredCount=0,receivedCount=0;const recent=[];
  for(const stream of model.streams) {
    const at=storageOffset(stream,peer);if(at===undefined)continue;
    const count=occurred(seconds,stream.firstAt+at,stream.period);
    if(stream.source===peer)authoredCount+=count;else receivedCount+=count;
    // Lifetime totals are exact; only a bounded window needs materializing
    // for the top of the pile. Old work remains counted when traffic is culled.
    for(let generation=Math.max(0,count-RECENT_LIMIT);generation<count;generation++)
      recent.push(storedRecord(stream,generation,peer));
  }
  recent.sort((a,b)=>b.storedAt-a.storedAt||a.id.localeCompare(b.id));
  return {id:peer,authoredCount,receivedCount,storedCount:authoredCount+receivedCount,recent:recent.slice(0,RECENT_LIMIT)};
}
export function reuseState(seconds,model) {
  seconds=Math.max(0,seconds);
  let computations=0,reuses=0;const traces=[];
  for(const stream of model.streams) {
    computations+=occurred(seconds,stream.firstAt+stream.computeFor,stream.period);
    for(const h of stream.hops)reuses+=occurred(seconds,stream.firstAt+h.verifiedAt,stream.period);
    if(seconds<stream.firstAt)continue;
    const latest=Math.floor((seconds-stream.firstAt)/stream.period);
    // Keep the preceding generation visible until this author's new work is
    // shared. Historic totals are arithmetic, so long-running pages stay bounded.
    const earliest=Math.max(0,latest-Math.ceil((stream.completedAt+HOLD)/stream.period));
    for(let generation=earliest;generation<=latest;generation++) {
      const startAt=stream.firstAt+generation*stream.period,age=seconds-startAt;
      const hops=stream.hops.map(h=>({...h,query:phase(age,h.requestAt,h.queryFor),retrieval:phase(age,h.sendAt,h.retrieveFor),
        checking:phase(age,h.arriveAt,h.checkFor),verified:age>=h.verifiedAt,stored:age>=h.storedAt,settling:phase(age,h.verifiedAt,SETTLE),arrival:phase(age,h.verifiedAt,.8*PACE)}));
      traces.push({...stream,generation,id:`${stream.key}${generation+1}`,startAt,age,published:age>=stream.publishAt,
        computing:phase(age,0,stream.computeFor),recording:phase(age,stream.computeFor,stream.publishAt-stream.computeFor),
        basedOn:inputsFor(stream,generation,startAt,model),hops});
    }
  }
  return {seconds,traces,computations,reuses,peers:model.floor.bodies.map(b=>peerInventory(seconds,b.i,model))};
}
function strokeRoute(ctx,route,color,width=1,t=1) {
  const {points,cumulative,length}=route,stop=clamp(t)*length;
  ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);
  for(let i=1;i<points.length&&cumulative[i]<stop;i++)ctx.lineTo(points[i].x,points[i].y);
  const end=along(route,t);ctx.lineTo(end.x,end.y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}
function text(ctx,value,x,y,size=16,color=INK.ink2,align='center',weight='') {
  ctx.font=`${weight} ${size}px Georgia, serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y);
}
// Every peer keeps a stack beside its body. The footer counts all retained work;
// older sheets form a bound foundation when the visible stack reaches its limit.
export function pileLayout(model,body,count=0) {
  const side=body.x<model.width*.46?-1:1, x=body.x+side*(model.mobile?77:96);
  const visible=Math.min(count,12), foundation=Math.min(9,Math.max(0,count-12)*2);
  return {x,baseY:body.y+29,topY:body.y+29-foundation-Math.max(0,visible-1)*3.4,
    width:model.mobile?43:51,height:model.mobile?28:30,visible,foundation};
}
function sheet(ctx,p,record,alpha=1) {
  ctx.save();ctx.globalAlpha*=alpha;
  const w=p.width,h=p.height;
  ctx.fillStyle=INK.paperB;ctx.strokeStyle=record.kind==='received'?GREEN:record.color;
  ctx.lineWidth=1.1;ctx.beginPath();ctx.rect(p.x-w/2,p.y-h,w,h);ctx.fill();ctx.stroke();
  ctx.strokeStyle=hexA(record.color,.75);ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(p.x-w/2+7,p.y-h+7);ctx.lineTo(p.x+w/2-7,p.y-h+7);ctx.stroke();
  text(ctx,record.id,p.x,p.y-6,12,record.color,'center','bold');ctx.restore();
}
export function createCostScene(canvas) {
  const ctx=canvas.getContext('2d'),skins=[skinForRung(0),skinForRung(1)];
  let model,backdrop,layout,scale=1,dpr=1,origin=null,offset=0,staticSeconds=null;
  const chart=createCostChart();
  function networkTransform(c) {const n=layout.network;c.setTransform(dpr*scale*n.k,0,0,dpr*scale*n.k,dpr*scale*n.x,dpr*scale*n.y);}
  const sprites=new Map();
  function glow(p,r,color,alpha=.2) {
    if(alpha<=0)return;
    if(!sprites.has(color)) {
      const sprite=document.createElement('canvas');sprite.width=sprite.height=96;
      const c=sprite.getContext('2d'),g=c.createRadialGradient(48,48,0,48,48,48);
      g.addColorStop(0,hexA(color,1));g.addColorStop(.4,hexA(color,.35));g.addColorStop(1,hexA(color,0));
      c.fillStyle=g;c.fillRect(0,0,96,96);sprites.set(color,sprite);
    }
    ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(sprites.get(color),p.x-r,p.y-r,r*2,r*2);ctx.restore();
  }
  function resize(mobile=false) {
    const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
    model=reusePlan(mobile);layout=costLayout(mobile);dpr=Math.min(globalThis.devicePixelRatio||1,1.5);scale=rect.width/model.width;
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    backdrop=document.createElement('canvas');backdrop.width=canvas.width;backdrop.height=canvas.height;
    const c=backdrop.getContext('2d');networkTransform(c);c.lineCap='round';c.lineJoin='round';
    // The mature mycelial floor is cached. Concurrent traces light their own routes.
    for(const branch of model.floor.branches) {
      if(branch.points.length<2)continue;
      c.beginPath();c.moveTo(branch.points[0].x,branch.points[0].y);
      for(const p of branch.points.slice(1))c.lineTo(p.x,p.y);
      c.strokeStyle=hexA(BRONZE,branch.gen===0?.22:.12);c.lineWidth=Math.max(.4,1.1-branch.gen*.23);c.stroke();
    }
    for(const j of model.floor.junctions) {
      c.beginPath();c.moveTo(j.bridge[0].x,j.bridge[0].y);c.lineTo(j.bridge[1].x,j.bridge[1].y);
      c.strokeStyle=hexA(BRONZE,.3);c.lineWidth=.7;c.stroke();
    }
    for(const u of model.floor.units) {
      c.beginPath();c.arc(u.x,u.y,u.kind==='child'?1.7:2.6,0,TAU);
      c.fillStyle=INK.paperB;c.fill();c.strokeStyle=hexA(BRONZE,.5);c.lineWidth=.8;c.stroke();
    }
    const y=model.mobile?651:581;
    text(c,'new results',model.width*.35,y+25,model.mobile?20:17,BRONZE);
    text(c,'checked reuses',model.width*.65,y+25,model.mobile?20:17,GREEN);
  }
  function packet(route,t,trace,color,query=false) {
    if(t===null)return;
    for(let k=5;k>=0;k--) {
      const at=t-k*.017;if(at<0)continue;
      const p=along(route,query?1-at:at);
      if(k===0) {
        glow(p,query?10:22,query?GREEN:color,query?.18:.35);
        if(query) {ctx.beginPath();ctx.arc(p.x,p.y,3,0,TAU);ctx.fillStyle=INK.paperB;ctx.fill();ctx.strokeStyle=GREEN;ctx.lineWidth=1.2;ctx.stroke();}
        else {
          const r=model.mobile?12:10;
          ctx.fillStyle=INK.paperB;ctx.fillRect(p.x-r,p.y-r-1,r*2,r*2+2);
          ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.strokeRect(p.x-r,p.y-r-1,r*2,r*2+2);
          text(ctx,trace,p.x,p.y+4,model.mobile?13:11,color);
        }
      } else {ctx.beginPath();ctx.arc(p.x,p.y,1.8-k*.2,0,TAU);ctx.fillStyle=hexA(query?GREEN:color,1-k/6);ctx.fill();}
    }
  }
  function record(state) {
    const {mobile}=model,{x,y,w,h}=layout.record;
    ctx.fillStyle=hexA(INK.paperB,.96);ctx.strokeStyle=hexA(BRONZE,.45);ctx.lineWidth=1;
    ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);
    const builtOn=state.traces.some(t=>t.published&&t.generation>0);
    const title=builtOn?'03 · Build on earlier work':state.reuses?'02 · Reuse the saved work':'01 · Create useful work';
    text(ctx,title,x+18,y+26,mobile?22:21,INK.ink,'left');
    const records=state.traces.filter(t=>t.published&&t.generation>0).sort((a,b)=>(b.startAt+b.publishAt)-(a.startAt+a.publishAt)).slice(0,2);
    if(!builtOn){
      text(ctx,state.reuses?'Retrieve and check the useful steps.':'Agents compute and preserve results.',x+18,y+55,mobile?17:16,INK.ink2,'left');
      text(ctx,state.reuses?'Each arrival adds to the pile.':'The saved work is ready to travel.',x+18,y+79,mobile?17:16,GREEN,'left');
    }
    for(const [i,t] of records.entries()) {
      const row=y+51+i*(mobile?23:21);
      text(ctx,t.id,x+18,row,mobile?18:16,t.color,'left','bold');
      const ancestry=t.basedOn.length?'builds on '+t.basedOn.map(p=>p.id).join(' + '):'first contribution';
      text(ctx,ancestry,x+60,row,mobile?16:15,INK.ink2,'left');
    }
  }
  function pile(body,memory,seconds) {
    const p=pileLayout(model,body,memory.storedCount),{width,height}=p;
    // The foundation never disappears when old active packets are culled.
    if(p.foundation) {
      ctx.fillStyle=INK.paperB;ctx.strokeStyle=hexA(BRONZE,.65);ctx.lineWidth=1;
      ctx.fillRect(p.x-width/2,p.baseY-p.foundation,width,p.foundation);
      ctx.strokeRect(p.x-width/2,p.baseY-p.foundation,width,p.foundation);
      for(let i=1;i<3;i++) {ctx.beginPath();ctx.moveTo(p.x-width/2,p.baseY-i*3);ctx.lineTo(p.x+width/2,p.baseY-i*3);ctx.stroke();}
    }
    for(let i=0;i<p.visible;i++) {
      const record=memory.recent[p.visible-1-i]||{id:'',kind:'received',color:BRONZE};
      // All saved sheets stay below the newest one; only the top carries its ID.
      sheet(ctx,{x:p.x+(i%2?1:-1),y:p.baseY-p.foundation-i*3.4,width,height},
        i===p.visible-1?record:{...record,id:''});
    }
    if(!memory.storedCount) {
      ctx.setLineDash([3,4]);ctx.strokeStyle=hexA(BRONZE,.3);ctx.lineWidth=.8;
      ctx.strokeRect(p.x-width/2,p.baseY-height,width,height);ctx.setLineDash([]);
    }
    const fresh=memory.recent[0];
    if(fresh&&seconds-fresh.storedAt<.45)glow({x:p.x,y:p.topY-height/2},40,GREEN,.2*(1-(seconds-fresh.storedAt)/.45));
    text(ctx,`${memory.storedCount} saved`,p.x,p.baseY+23,model.mobile?14:15,memory.storedCount?GREEN:INK.ink2);
  }
  function deposit(body,memory,record,progress) {
    if(progress===null)return;
    const p=pileLayout(model,body,memory.storedCount+1),u=clamp(progress),v=u*u*(3-2*u);
    const targetY=p.topY,bend=body.i===0?23:-31;
    const q={x:body.x+(p.x-body.x)*v,y:body.y+(targetY-body.y)*v+Math.sin(Math.PI*u)*bend,width:p.width,height:p.height};
    ctx.beginPath();ctx.moveTo(body.x,body.y);ctx.quadraticCurveTo((body.x+p.x)/2,body.y+bend*1.35,p.x,targetY);
    ctx.strokeStyle=hexA(record.color,.3);ctx.lineWidth=.8;ctx.stroke();
    sheet(ctx,q,record);
  }
  function render(milliseconds,reduced=false) {
    if(!model)return;
    if(origin===null)origin=milliseconds;
    const elapsed=Math.max(0,milliseconds-origin)/1000;
    let seconds=elapsed+offset;
    if(reduced) {
      if(staticSeconds===null)staticSeconds=Math.max(seconds,12);
      seconds=staticSeconds;
    } else if(staticSeconds!==null) {offset=staticSeconds-elapsed;seconds=staticSeconds;staticSeconds=null;}
    const state=reuseState(seconds,model),{width,height,mobile,floor}=model;
    const spin=reduced?0:seconds;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(backdrop,0,0);
    networkTransform(ctx);ctx.lineCap='round';ctx.lineJoin='round';
    for(const trace of state.traces)for(const h of trace.hops) {
      if(h.verified) {
        const fade=clamp(1-(trace.age-h.verifiedAt)/HOLD);
        if(fade>0)strokeRoute(ctx,h.route,hexA(trace.color,.35*fade),1.25);
      }
      if(h.query!==null) {
        strokeRoute(ctx,h.route,hexA(GREEN,.3),1);packet(h.route,h.query,trace.id,trace.color,true);
      }
      if(h.retrieval!==null) {
        strokeRoute(ctx,h.route,hexA(trace.color,.7),1.5,h.retrieval);packet(h.route,h.retrieval,trace.id,trace.color);
      }
    }
    for(const b of floor.bodies) {
      const author=model.streams.find(t=>t.source===b.i);
      const working=state.traces.find(t=>t.source===b.i&&t.computing!==null);
      const checks=state.traces.flatMap(t=>t.hops.filter(h=>h.to===b.i&&h.checking!==null).map(h=>({trace:t,hop:h})));
      const transfers=state.traces.flatMap(t=>t.hops.filter(h=>(h.from===b.i||h.to===b.i)&&(h.query!==null||h.retrieval!==null)));
      const memory=state.peers.find(p=>p.id===b.i),held=memory.recent;
      const r=(mobile?22:29),busy=!!working;
      if(busy)glow(b,r*2.4,author.color,.23);
      if(held.length)glow(b,r*2.4,held[0].color,.12);
      if(checks.length)glow(b,r*2.4,GREEN,.28);
      ctx.save();drawSkin(ctx,skins[author?1:0],[b.x,b.y],r,{yaw:b.i*.8+spin*(busy?.35:.065),pitch:.24},()=>null,{ink:.5,beadAt:1});ctx.restore();
      if(busy) {
        ctx.beginPath();ctx.arc(b.x,b.y,r+9,-Math.PI/2,-Math.PI/2+TAU*working.computing);
        ctx.strokeStyle=author.color;ctx.lineWidth=2.5;ctx.stroke();
        for(let i=0;i<6;i++) {const a=spin*2+i*TAU/6,p={x:b.x+Math.cos(a)*(r+14),y:b.y+Math.sin(a)*(r+14)};glow(p,6,author.color,.32);}
      }
      for(const [i,{trace,hop}] of checks.entries()) {
        ctx.beginPath();ctx.arc(b.x,b.y,r+13+i*4,-Math.PI/2,-Math.PI/2+TAU*hop.checking);
        ctx.strokeStyle=trace.color;ctx.lineWidth=1.5;ctx.stroke();
      }
      pile(b,memory,seconds);
      // Verification finishes first. The same card then visibly lands in memory.
      for(const trace of state.traces) {
        if(trace.source===b.i)deposit(b,memory,{...trace,kind:'authored'},trace.recording);
        for(const hop of trace.hops)if(hop.to===b.i)
          deposit(b,memory,{...trace,kind:'received'},hop.settling);
      }
      if(!reduced)for(const trace of state.traces)for(const hop of trace.hops)if(hop.to===b.i&&hop.arrival!==null) {
        ctx.beginPath();ctx.arc(b.x,b.y,r+9+hop.arrival*19,0,TAU);ctx.strokeStyle=hexA(trace.color,(1-hop.arrival)*.55);ctx.lineWidth=1;ctx.stroke();
      }
      if(b.local) {ctx.beginPath();ctx.arc(b.x,b.y,r+6,0,TAU);ctx.strokeStyle=hexA(INK.ink2,.65);ctx.lineWidth=.8;ctx.stroke();}
      const sending=transfers.some(h=>h.from===b.i),receiving=transfers.some(h=>h.to===b.i);
      const label=busy?(working.basedOn.length?'Adding work':'Computing')
        :checks.length?'Checking':receiving?'Retrieving':sending?'Sharing':held.length?'Work saved':'';
      if(label) {
        const size=mobile?16:15,y=b.y+r+23;
        ctx.font=`${size}px Georgia, serif`;const tw=ctx.measureText(label).width;
        ctx.fillStyle=hexA(INK.paperA,.92);ctx.fillRect(b.x-tw/2-5,y-size,tw+10,size+5);
        text(ctx,label,b.x,y,size,busy?author.color:GREEN);
      }
    }
    const y=mobile?651:581;
    text(ctx,String(state.peers.reduce((total,p)=>total+p.authoredCount,0)),width*.35,y,mobile?36:32,INK.ink,'center','bold');
    text(ctx,String(state.reuses),width*.65,y,mobile?36:32,GREEN,'center','bold');
    ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0);
    record(state);chart(ctx,seconds,model);
  }
  function restart(milliseconds) {origin=milliseconds;offset=0;staticSeconds=null;}
  return {resize,render,restart};
}
