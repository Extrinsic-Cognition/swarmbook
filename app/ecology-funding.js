// Reciprocal exchange between swarms. Illustrative, with no live economic activity.
// A payment funds child units; completed work is saved, copied and used in return.
import {skinForRung, drawSkin, INK, hexA} from './orb.js';

const TAU=Math.PI*2, WORK='#3E7C74';
const clamp=x=>Math.max(0,Math.min(1,x));
const point=(x,y,r=0)=>({x,y,r});
export const EXCHANGE=Object.freeze({pay:1.35,allocate:2.35,work:3.85,collect:4.5,publish:5.6,reuse:6.75,apply:7.6,period:8.6});
const phases=[['payment',0,EXCHANGE.pay],['allocation',EXCHANGE.pay,EXCHANGE.allocate],
  ['working',EXCHANGE.allocate,EXCHANGE.work],['collection',EXCHANGE.work,EXCHANGE.collect],
  ['publication',EXCHANGE.collect,EXCHANGE.publish],['retrieval',EXCHANGE.publish,EXCHANGE.reuse],
  ['applying',EXCHANGE.reuse,EXCHANGE.apply],['settled',EXCHANGE.apply,EXCHANGE.period]];
export function exchangeAt(seconds) {
  const t=Math.max(0,seconds),cycle=Math.floor(t/EXCHANGE.period),age=t-cycle*EXCHANGE.period;
  const builder=cycle%2,buyer=1-builder;
  const [phase,start,end]=phases.find(([,a,b])=>age>=a&&age<b)||phases[7];
  const products=[Math.floor(cycle/2),Math.ceil(cycle/2)];
  if(age>=EXCHANGE.apply) products[buyer]++;
  return {cycle,age,builder,buyer,phase,progress:clamp((age-start)/(end-start)),
    knowledgeCount:cycle+Number(age>=EXCHANGE.publish),products};
}
function onCurve(e,t) {
  const u=1-t;
  return point(u*u*u*e.a.x+3*u*u*t*e.c.x+3*u*t*t*e.d.x+t*t*t*e.b.x,
    u*u*u*e.a.y+3*u*u*t*e.c.y+3*u*t*t*e.d.y+t*t*t*e.b.y);
}
function curve(a,b,c,d) {
  const e={a,b,c:c||point(a.x+(b.x-a.x)/3,a.y+(b.y-a.y)/3),d:d||point(a.x+(b.x-a.x)*2/3,a.y+(b.y-a.y)*2/3)};
  e.points=Array.from({length:49},(_,i)=>onCurve(e,i/48));return e;
}
function boundary(a,b) {
  const d=Math.hypot(b.x-a.x,b.y-a.y)||1;
  return point(a.x+(b.x-a.x)/d*a.r,a.y+(b.y-a.y)/d*a.r);
}
export function fundingLayout(mobile=false) {
  const width=mobile?600:1000,height=mobile?710:600;
  const roots=mobile?[[190,182,66],[404,478,66]]:[[270,290,77],[730,290,77]];
  const children=mobile?[
    [[80,119,23],[73,245,23],[242,297,24],[61,64,11,0],[46,304,10,1]],
    [[529,472,25],[478,573,24],[300,590,23],[558,408,11,0],[542,605,11,1]]
  ]:[
    [[105,240,30],[137,400,27],[298,429,30],[148,158,16,0],[73,434,13,1]],
    [[895,240,30],[863,400,27],[702,429,30],[854,151,17,0],[927,434,13,1]]
  ];
  const swarms=roots.map(([x,y,r],i)=>{
    const root=point(x,y,r),units=children[i].map(([cx,cy,cr,parent],j)=>({...point(cx,cy,cr),parent:parent??-1,rung:[2,1,0,0,1][j]}));
    for(const unit of units){const parent=unit.parent<0?root:units[unit.parent];unit.route=curve(boundary(parent,unit),boundary(unit,parent));}
    return {root,children:units,rung:i?4:3,
      product:mobile?(i?point(400,389):point(278,188)):point(i?632:368,288),
      title:mobile?(i?point(410,660):point(185,36)):point(i?750:250,77),
      status:mobile?(i?point(410,687):point(185,59)):point(i?750:250,535)};
  });
  const knowledge=mobile?point(418,238,28):point(500,410,31);
  const money=mobile?curve(point(160,244),point(339,479),point(18,355),point(149,510)):
    curve(point(306,220),point(694,220),point(365,127),point(635,127));
  const publish=mobile?[
    curve(point(248,152),point(406,206),point(309,98),point(388,146)),
    curve(point(447,424),point(430,271),point(532,352),point(530,283))
  ]:[
    curve(point(337,334),point(465,410),point(385,362),point(411,397)),
    curve(point(663,334),point(535,410),point(615,362),point(589,397))
  ];
  return {width,height,mobile,swarms,knowledge,money,publish,
    moneyLabel:mobile?point(96,383):point(500,119),
    knowledgeLabel:mobile?point(434,326):point(500,486)};
}
function line(ctx,e,color,width=1) {
  ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.bezierCurveTo(e.c.x,e.c.y,e.d.x,e.d.y,e.b.x,e.b.y);
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}
function label(ctx,text,p,size=18,color=INK.ink2) {
  ctx.font=`${size}px Georgia, serif`;ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(text,p.x,p.y);
}
function arrow(ctx,e,t,reverse,color) {
  const p=onCurve(e,t),q=onCurve(e,clamp(t+(reverse?-.015:.015))),a=Math.atan2(q.y-p.y,q.x-p.x);
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);ctx.beginPath();ctx.moveTo(-5,-3);ctx.lineTo(0,0);ctx.lineTo(-5,3);
  ctx.strokeStyle=color;ctx.lineWidth=1;ctx.stroke();ctx.restore();
}
export function createFundingScene(canvas) {
  const ctx=canvas.getContext('2d'),skins=Array.from({length:5},(_,i)=>skinForRung(i)),glows=new Map();
  let model,scale=1,dpr=1,offsetX=0,offsetY=0,backdrop,origin=null;
  function glow(p,r,color,alpha) {
    if(alpha<=0)return;
    if(!glows.has(color)) {
      const sprite=document.createElement('canvas');sprite.width=sprite.height=128;
      const c=sprite.getContext('2d'),g=c.createRadialGradient(64,64,0,64,64,64);
      g.addColorStop(0,hexA(color,1));g.addColorStop(.3,hexA(color,.4));g.addColorStop(1,hexA(color,0));
      c.fillStyle=g;c.fillRect(0,0,128,128);glows.set(color,sprite);
    }
    ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(glows.get(color),p.x-r,p.y-r,r*2,r*2);ctx.restore();
  }
  function resize(mobile=false) {
    const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
    model=fundingLayout(mobile);dpr=Math.min(globalThis.devicePixelRatio||1,2);
    scale=Math.min(rect.width/model.width,rect.height/model.height);
    offsetX=(rect.width-model.width*scale)/2;offsetY=(rect.height-model.height*scale)/2;
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    backdrop=document.createElement('canvas');backdrop.width=canvas.width;backdrop.height=canvas.height;
    const c=backdrop.getContext('2d');c.setTransform(dpr*scale,0,0,dpr*scale,dpr*offsetX,dpr*offsetY);
    for(const swarm of model.swarms)for(const child of swarm.children)line(c,child.route,hexA(INK.bronze,.35),.9);
    line(c,model.money,hexA(INK.gold,.3),1);
    for(const path of model.publish)line(c,path,hexA(WORK,.3),1);
    label(c,'Money',model.moneyLabel,mobile?22:21,INK.bronze);
    label(c,'Shared knowledge',model.knowledgeLabel,mobile?21:20,WORK);
    label(c,'Keep it. Build on it.',point(model.knowledgeLabel.x,model.knowledgeLabel.y+24),mobile?16:15,INK.ink2);
    // Warm up cached light sprites once, never allocate them on a moving frame.
    for(const color of [WORK,INK.gold])glow(point(-100,-100),1,color,.01);
  }
  function card(p,size=14,opacity=1) {
    ctx.save();ctx.globalAlpha=opacity;ctx.fillStyle=INK.paperB;ctx.strokeStyle=WORK;ctx.lineWidth=1.2;
    ctx.fillRect(p.x-size*.7,p.y-size,size*1.4,size*2);ctx.strokeRect(p.x-size*.7,p.y-size,size*1.4,size*2);
    ctx.fillStyle=WORK;for(let j=0;j<3;j++)ctx.fillRect(p.x-size*.45,p.y-size*.5+j*size*.36,size*(j===2?.6:.9),1.3);
    ctx.restore();
  }
  function packet(e,progress,color,reverse=false,isWork=false) {
    for(let k=3;k>=0;k--) {
      const f=progress-k*.028;if(f<0||f>1)continue;
      const p=onCurve(e,reverse?1-f:f);
      if(!k){glow(p,15,color,.22);if(isWork){card(p,7);continue;}}
      ctx.beginPath();ctx.arc(p.x,p.y,k?2-k*.3:4,0,TAU);ctx.fillStyle=hexA(color,1-k*.22);ctx.fill();
    }
  }
  function body(p,rung,t,seed,activity=0) {
    glow(p,p.r*2.1,WORK,.055+activity*.15);
    ctx.save();drawSkin(ctx,skins[rung],[p.x,p.y],p.r,{yaw:seed+t*.045,pitch:.23+Math.sin(seed)*.1},
      f=>f.chair>=0?INK.vacant:'#FFFDF7',{ink:.6,beadAt:1});ctx.restore();
  }
  function activity(p,progress,color=WORK) {
    ctx.beginPath();ctx.arc(p.x,p.y,p.r+7,-Math.PI/2,-Math.PI/2+TAU*clamp(progress));
    ctx.strokeStyle=hexA(color,.78);ctx.lineWidth=1.7;ctx.stroke();
  }
  function archive(count) {
    const p=model.knowledge;
    // Empty shelf is legible before any work; retrieval never removes its original.
    ctx.save();ctx.beginPath();ctx.ellipse(p.x,p.y+25,41,10,0,0,TAU);ctx.strokeStyle=hexA(WORK,.22);ctx.lineWidth=1;ctx.stroke();
    if(count){for(let k=Math.min(count,4)-1;k>=0;k--)card(point(p.x+k*4,p.y-k*4),23);}
    else {ctx.setLineDash([3,5]);ctx.strokeRect(p.x-16,p.y-23,32,44);ctx.setLineDash([]);}
    ctx.restore();
  }
  const statusFor=(s,i)=>{
    if(i===s.buyer) return s.phase==='payment'?'Commission work':s.phase==='retrieval'?'Receive a copy':s.phase==='applying'||s.phase==='settled'?'Put it to use':'Await the result';
    return ({payment:'Payment arrives',allocation:'Fund child units',working:'Independent work',collection:'Bring results together',publication:'Save the work',retrieval:'The original stays',applying:'Ready to build again',settled:'Ready to build again'})[s.phase];
  };
  function restart(milliseconds){origin=milliseconds;}
  function render(milliseconds,reduced=false) {
    if(!model)return;if(origin===null)origin=milliseconds;
    const seconds=Math.max(0,(milliseconds-origin)/1000),t=reduced?0:seconds;
    const s=exchangeAt(reduced?EXCHANGE.apply+.2:seconds),p=s.progress;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(backdrop,0,0);
    ctx.setTransform(dpr*scale,0,0,dpr*scale,dpr*offsetX,dpr*offsetY);
    // The same relationship reverses. Colours describe what travels, never the kind of swarm.
    for(const f of [.31,.69])arrow(ctx,model.money,f,s.buyer===1,hexA(INK.bronze,.65));
    model.publish.forEach((e,i)=>arrow(ctx,e,.5,i===s.buyer,hexA(WORK,.65)));
    if(s.phase==='payment'&&!reduced){line(ctx,model.money,hexA(INK.gold,.52),1.4);packet(model.money,p,INK.gold,s.buyer===1);}
    if(s.phase==='publication'&&!reduced){line(ctx,model.publish[s.builder],hexA(WORK,.6),1.4);packet(model.publish[s.builder],p,WORK,false,true);}
    if(s.phase==='retrieval'&&!reduced){line(ctx,model.publish[s.buyer],hexA(WORK,.6),1.4);packet(model.publish[s.buyer],p,WORK,true,true);}
    model.swarms.forEach((swarm,i)=>{
      const building=i===s.builder,working=building&&s.phase==='working';
      // Main branches have separate allocations and finish at different times.
      for(let j=0;j<swarm.children.length;j++) {
        const child=swarm.children[j];
        if(building&&j<3&&!reduced) {
          if(s.phase==='allocation')packet(child.route,clamp(p*1.35-j*.15),INK.gold);
          if(s.phase==='collection')packet(child.route,clamp(p*1.35-j*.15),WORK,true,true);
          if(working&&j<2) {
            const grandchild=swarm.children[j+3];
            line(ctx,grandchild.route,hexA(WORK,.45),1);
            const local=clamp(p*(1.4-j*.18));
            if(local<1)packet(grandchild.route,local<.5?local*2:(local-.5)*2,WORK,local>=.5,true);
          }
        }
        body(child,child.rung,t,i*1.7+j*.74,working?Math.max(0,1-p):0);
        if(j<3) {
          if(working)activity(child,clamp(p*(1.4-j*.18)));
          if(building&&s.age>=EXCHANGE.pay&&s.age<EXCHANGE.collect) {
            const funded=s.phase==='allocation'?(p*1.35-j*.15>=1?3:0):3;
            const spent=s.phase==='working'?Math.floor(clamp(p*(1.4-j*.18))*3):s.age>=EXCHANGE.work?3:0;
            for(let k=0;k<3;k++) {ctx.fillStyle=k<funded-spent?INK.gold:hexA(INK.bronze,.16);ctx.fillRect(child.x-10+k*8,child.y+child.r+10,5,3);}
          }
        }
      }
      body(swarm.root,swarm.rung,t,i*1.7+.4,working?.6:0);
      if(i===s.buyer&&s.phase==='applying'&&!reduced)activity(swarm.root,p);
      if(s.products[i]){card(swarm.product,13);if(s.phase==='settled'&&i===s.buyer)glow(swarm.product,24,WORK,.12);}
      label(ctx,building?'Build & earn':'Pay for work',swarm.title,model.mobile?24:25,building?WORK:INK.bronze);
      label(ctx,reduced?(building?'Work out · money in':'Money out · work in'):statusFor(s,i),swarm.status,model.mobile?16:17);
    });
    archive(s.knowledgeCount);
  }
  return {resize,render,restart};
}
