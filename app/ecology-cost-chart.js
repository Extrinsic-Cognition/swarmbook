// Equal demand on both sides: compare the whole collective's cost with and
// without sharing. The falling ratio is not a falling lifetime spend.
import {INK,hexA} from './orb.js';
import {costSnapshot,costHistory} from './ecology-cost-ledger.js?v=collective-cost-1';
const GREEN='#3E7C74';
export function costLayout(mobile=false) {
  return mobile
    ? {height:1000,network:{x:0,y:265,k:1},chart:{x:26,y:12,w:548,h:237},record:{x:126,y:278,w:348,h:105}}
    : {height:650,network:{x:262,y:65,k:.8},chart:{x:20,y:42,w:315,h:520},record:{x:485,y:24,w:360,h:105}};
}
function comparison(ctx,state,box,mobile=false) {
  const {x,y,w}=box;
  text(ctx,'Same demand. Lower cost.',x,y,mobile?22:21,INK.ink,'bold');
  const barX=x+91,barMax=w-91-42,hasResults=state.relativeCollectiveCost!==null;
  for(const [i,row]of [
    {label:'No sharing',ratio:1,color:INK.bronze},
    {label:'With sharing',ratio:state.relativeCollectiveCost,color:GREEN},
  ].entries()) {
    const at=y+27+i*27;
    text(ctx,row.label,x,at+4,13,row.color);
    ctx.strokeStyle=hexA(row.color,.3);ctx.lineWidth=.7;ctx.strokeRect(barX,at-8,barMax,12);
    if(hasResults){ctx.fillStyle=hexA(row.color,.12);ctx.fillRect(barX,at-8,barMax,12);ctx.fillStyle=row.color;ctx.fillRect(barX,at-8,barMax*row.ratio,12);}
    text(ctx,hasResults?`${Math.round(row.ratio*100)}%`:'—',barX+barMax+7,at+4,15,row.color,'bold');
  }
}
function text(ctx,value,x,y,size,color=INK.ink2,weight='') {
  ctx.font=`${weight} ${size}px Georgia, serif`;ctx.fillStyle=color;ctx.textAlign='left';ctx.fillText(value,x,y);
}
export function createCostChart() {
  let cachedModel=null,signature='',history=[];
  return function draw(ctx,seconds,model) {
    const state=costSnapshot(seconds,model),next=`${state.published}:${state.reused}`;
    if(model!==cachedModel||signature!==next){history=costHistory(seconds,model);cachedModel=model;signature=next;}
    const mobile=model.mobile,g=costLayout(mobile).chart;
    const plot=mobile?{x:g.x+27,y:g.y+82,w:g.w-49,h:108}:{x:g.x+31,y:g.y+143,w:g.w-48,h:205};
    const bottom=plot.y+plot.h,maxTasks=Math.max(60,state.completed);
    const x=value=>plot.x+value/maxTasks*plot.w,y=value=>bottom-value*plot.h;
    ctx.save();
    ctx.fillStyle=hexA(INK.paperA,.94);ctx.fillRect(g.x-8,g.y-10,g.w+16,g.h);
    text(ctx,'Collective cost.',g.x,g.y+25,mobile?27:28,INK.ink,'bold');
    if(mobile)text(ctx,'Users and businesses · the same demand',g.x,g.y+48,16);
    else {text(ctx,'For users and businesses.',g.x,g.y+57,18);text(ctx,'To serve the same demand.',g.x,g.y+80,18);}
    ctx.lineWidth=.8;ctx.strokeStyle=hexA(INK.ink2,.4);
    ctx.beginPath();ctx.moveTo(plot.x,plot.y-4);ctx.lineTo(plot.x,bottom);ctx.lineTo(plot.x+plot.w,bottom);ctx.stroke();
    ctx.font='11px Georgia, serif';ctx.textAlign='right';ctx.fillStyle=INK.ink2;
    ctx.fillText('100%',plot.x-7,plot.y+4);ctx.fillText('0%',plot.x-7,bottom+4);
    ctx.setLineDash([5,5]);ctx.strokeStyle=hexA(INK.bronze,.85);ctx.lineWidth=1.7;
    ctx.beginPath();ctx.moveTo(plot.x,plot.y);ctx.lineTo(plot.x+plot.w,plot.y);ctx.stroke();ctx.setLineDash([]);
    text(ctx,'No sharing',mobile?plot.x+plot.w-100:plot.x+8,plot.y-10,mobile?15:17,INK.bronze);
    if(history.length) {
      const points=history.map(p=>({x:x(p.completed),y:y(p.relativeCollectiveCost)}));
      points.unshift({x:plot.x,y:points[0].y});
      ctx.beginPath();ctx.moveTo(points[0].x,plot.y);
      for(const p of points)ctx.lineTo(p.x,p.y);
      ctx.lineTo(points.at(-1).x,plot.y);ctx.closePath();ctx.fillStyle=hexA(GREEN,.08);ctx.fill();
      ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(const p of points.slice(1))ctx.lineTo(p.x,p.y);
      ctx.strokeStyle=GREEN;ctx.lineWidth=2.8;ctx.lineJoin='round';ctx.stroke();
      const p=points.at(-1);ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle=GREEN;ctx.fill();
    }
    text(ctx,'With sharing',plot.x+8,bottom-8,mobile?16:17,GREEN,'bold');
    text(ctx,'More demand served',plot.x,bottom+23,mobile?15:14);
    const arrowX=plot.x+ctx.measureText('More demand served').width+8;
    ctx.strokeStyle=INK.ink2;ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(arrowX,bottom+18);ctx.lineTo(arrowX+19,bottom+18);ctx.lineTo(arrowX+15,bottom+14);ctx.moveTo(arrowX+19,bottom+18);ctx.lineTo(arrowX+15,bottom+22);ctx.stroke();
    ctx.save();ctx.translate(plot.x-31,plot.y+plot.h/2);ctx.rotate(-Math.PI/2);ctx.font='12px Georgia, serif';ctx.textAlign='center';ctx.fillStyle=INK.ink2;ctx.fillText('% of no-sharing cost',0,0);ctx.restore();
    // Both counterfactuals are present from the first frame. Empty rows mean
    // no completed demand yet; the first checked reuse changes the comparison.
    if(mobile) {
      text(ctx,'Example: compute 1 · retrieve/check 0.1',g.x+246,bottom+23,12,INK.ink2);
      const r=costLayout(true).record;ctx.fillStyle=INK.paperB;ctx.fillRect(r.x,r.y,r.w,r.h);ctx.strokeStyle=hexA(INK.bronze,.45);ctx.lineWidth=1;ctx.strokeRect(r.x,r.y,r.w,r.h);
      comparison(ctx,state,{x:r.x+15,y:r.y+27,w:r.w-30},true);
    } else {
      comparison(ctx,state,{x:g.x,y:g.y+402,w:g.w});
      text(ctx,'Illustration · compute 1 · retrieve/check 0.1',g.x,g.y+488,12);
      text(ctx,'Both serve the same collective demand.',g.x,g.y+507,12);
    }
    ctx.restore();
  };
}
