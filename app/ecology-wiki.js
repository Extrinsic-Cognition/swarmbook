// Shared memory: content plus the cognitive work already done on it.
// Illustrative records, requests and reviews. No model, source or network is contacted.
// The graph persists. Readers have independent clocks; only missing work is inferred.
import {INK, hexA, skinForRung, drawSkin} from './orb.js';
const TAU=Math.PI*2, READY='#3E7C74', GOLD=INK.gold;
const clamp=x=>Math.max(0,Math.min(1,x));
const phase=(t,a,b)=>t>=a&&t<b?(t-a)/(b-a):null;
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};

export const SOURCES=[
  {id:'papers:v1',kind:'paper',name:'Papers',port:20,x:90,y:180},
  {id:'dataset:v1',kind:'dataset',name:'Datasets',port:20,x:80,y:330},
  {id:'protocol:v1',kind:'protocol',name:'Protocols',port:20,x:95,y:480},
];
export const KNOWLEDGE=[
  {id:'literature-map',kind:'excerpt',label:'Literature',x:263,y:182,source:'papers:v1',span:'references 1–12'},
  {id:'measurements',kind:'excerpt',label:'Data',x:254,y:328,source:'dataset:v1',span:'rows 1–128'},
  {id:'methods',kind:'excerpt',label:'Methods',x:284,y:461,source:'protocol:v1',span:'steps 1–6'},
  {id:'topic-a',kind:'concept',label:'Topics',x:421,y:130,source:'papers:v1',span:'references 1–12'},
  {id:'topic-b',kind:'concept',x:387,y:246,source:'dataset:v1',span:'rows 1–128'},
  {id:'topic-c',kind:'concept',x:430,y:400,source:'protocol:v1',span:'steps 1–6'},
  {id:'finding-a',kind:'finding',label:'Findings',x:539,y:244,source:'dataset:v1',span:'rows 1–128'},
  {id:'finding-b',kind:'finding',x:510,y:486,source:'protocol:v1',span:'steps 1–6'},
  {id:'link-a',kind:'connection',label:'Connections',x:638,y:355,source:'papers:v1',span:'references 1–12'},
  {id:'link-b',kind:'connection',x:608,y:160,source:'dataset:v1',span:'rows 1–128'},
];
const EDGES=[['papers:v1','literature-map'],['dataset:v1','measurements'],['protocol:v1','methods'],
  ['literature-map','topic-a'],['literature-map','topic-b'],['measurements','topic-b'],['measurements','finding-a'],
  ['methods','topic-c'],['methods','finding-b'],['topic-a','link-b'],['topic-b','finding-a'],
  ['topic-c','finding-b'],['finding-a','link-a'],['finding-b','link-a'],['topic-a','topic-b'],['topic-b','topic-c']];
// Three independent branches keep composing knowledge. IDs and ancestry are
// deterministic, so old records remain addressable without an ever-growing
// per-frame array. The visible window is a projection, not deletion or a replay.
const GENERATION_SECONDS=6.4, BRANCH_OFFSETS=[0,1.65,3.45];
const SEEDS=[['literature-map','measurements'],['methods','topic-a'],['finding-a','finding-b','link-a']];
export function additionAt(index) {
  if(!Number.isSafeInteger(index)||index<0)return null;
  const generation=Math.floor(index/3),branch=index%3;
  const start=1.1+generation*GENERATION_SECONDS+BRANCH_OFFSETS[branch];
  const parents=generation ? [
    `addition-${(generation-1)*3+branch+1}`,
    `addition-${(generation-1)*3+(branch+1)%3+1}`,
    ...(index%4===0?[SEEDS[branch][0]]:[]),
  ] : SEEDS[branch];
  const sourceIds=generation?SOURCES.map(s=>s.id):[...new Set(SEEDS[branch].map(id=>KNOWLEDGE.find(k=>k.id===id).source))];
  const sources=sourceIds.map(id=>({id,span:KNOWLEDGE.find(k=>k.source===id).span}));
  return {id:`addition-${index+1}`,index,generation,branch,kind:index%3===1?'finding':'connection',
    parents:[...parents],source:sources[0].id,span:sources[0].span,sources,
    start,computeAt:start+.72,readyAt:start+2,publishAt:start+3.7};
}
export function recordOf(id) {
  const base=KNOWLEDGE.find(k=>k.id===id);if(base)return base;
  const match=/^addition-([1-9]\d*)$/.exec(id||'');
  return match?additionAt(Number(match[1])-1):null;
}
function countAt(t,offset) {
  return BRANCH_OFFSETS.reduce((n,b)=>n+Math.max(0,Math.floor((t-1.1-b-offset)/GENERATION_SECONDS)+1),0);
}
// Opening examples retained as fixtures; creation continues past this first window.
export const ADDITIONS=Array.from({length:9},(_,i)=>additionAt(i));
export function recentAdditions(t) {
  const generation=Math.max(0,Math.floor((t-1.1)/GENERATION_SECONDS));
  const first=Math.max(0,generation-4),records=[];
  for(let g=first;g<=generation;g++)for(let lane=0;lane<3;lane++) {
    const a=additionAt(g*3+lane);if(a.start<=t)records.push(a);
  }
  return records;
}
// Every polyhedron is an active research swarm, with its own requests and clock.
const SWARM_POSITIONS=[
  [900,117,44],[918,315,33],[887,511,38],
  [100,72,21],[300,66,31],[535,61,21],[744,86,21],[752,570,22],
  [598,567,21],[435,574,19],[261,573,29],[95,571,20],
  [59,427,19],[63,252,22],[396,77,20],[641,72,18],[833,284,17],[825,401,17],
];
const MOBILE_SWARMS=[
  [490,78,35],[534,331,27],[491,595,31],
  [54,64,15],[160,55,19],[277,56,16],[394,69,15],[377,623,15],
  [265,629,14],[145,627,15],[54,591,17],[49,476,14],
  [45,367,14],[49,257,15],[53,157,14],[546,183,14],[549,452,13],[549,544,13],
];
export const READERS=SWARM_POSITIONS.map(([x,y,r],i)=>({
  id:`research-swarm-${i+1}`,label:['Literature review','Data analysis','Replication'][i]||'',
  firstAt:i<3?[0,.32,.7][i]:.16+i*.075,period:3.6+i*.19,
  x,y,r,port:r,rung:[5,2,4,0,3,1,0,2,1,0,3,0,2,1,0,1,2,0][i],
  base:['literature-map','measurements','methods','topic-a','finding-a','link-a'][i%6],
}));
// Fictional civic arms: stable issuer identities, shared by the culture's tree.
export const CULTURES=Object.freeze([
  ['Torre','tower','#873E38'],['Aurora','sun','#A8782B'],['Quercia','oak','#49674B'],
  ['Custodia','key','#3D5579'],['Stella','star','#66517F'],['Ponte','bridge','#9B6240'],
  ['Vela','sail','#386D78'],['Fonte','fountain','#52798A'],['Alveare','hive','#987635'],
  ['Corona','crown','#795072'],['Lanterna','lantern','#A35D32'],['Monti','mountain','#496D62'],
  ['Rosa','rose','#9B4A64'],['Nodo','knot','#4F5988'],['Luna','moon','#455773'],
  ['Spiga','wheat','#997744'],['Ruota','wheel','#67753C'],['Faro','beacon','#7E5141'],
].map(([name,emblem,ink],i)=>Object.freeze({id:`civic-arms:${i+1}`,issuer:`research-swarm-${i+1}`,name,emblem,ink})));
const culturesByIssuer=new Map(CULTURES.map(c=>[c.issuer,c]));
export const cultureFor=issuer=>culturesByIssuer.get(issuer)||null;

// One vector emblem is reused on the swarm, the travelling signature, the
// document's hanging wax seal, and the expanded list of sovereign signatories.
export function drawCivicSeal(ctx,culture,x,y,r=9) {
  if(!culture)return;
  ctx.save();ctx.translate(x,y);ctx.scale(r,r);
  ctx.beginPath();
  for(let j=0;j<40;j++){const a=j*TAU/40,rr=j%2?.96:1.04;const px=Math.cos(a)*rr,py=Math.sin(a)*rr;j?ctx.lineTo(px,py):ctx.moveTo(px,py);}
  ctx.closePath();ctx.fillStyle=culture.ink;ctx.fill();
  ctx.strokeStyle=hexA(INK.ink,.32);ctx.lineWidth=.065;ctx.stroke();
  ctx.beginPath();ctx.arc(0,0,.8,0,TAU);ctx.strokeStyle=hexA(INK.paperB,.48);ctx.lineWidth=.045;ctx.stroke();
  ctx.fillStyle=INK.paperB;ctx.strokeStyle=INK.paperB;ctx.lineWidth=.115;ctx.lineCap='round';ctx.lineJoin='round';
  const path=points=>{ctx.beginPath();points.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.stroke();};
  const disc=(a,b,rr)=>{ctx.beginPath();ctx.arc(a,b,rr,0,TAU);ctx.fill();};
  const ring=(a,b,rr)=>{ctx.beginPath();ctx.arc(a,b,rr,0,TAU);ctx.stroke();};
  const polygon=points=>{ctx.beginPath();points.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.closePath();ctx.fill();};
  switch(culture.emblem) {
    case 'tower':ctx.fillRect(-.31,-.23,.62,.68);for(let j=0;j<3;j++)ctx.fillRect(-.38+j*.27,-.48,.2,.3);ctx.fillStyle=culture.ink;ctx.fillRect(-.1,.12,.2,.34);break;
    case 'sun':disc(0,0,.25);for(let j=0;j<8;j++){const a=j*TAU/8;path([[Math.cos(a)*.39,Math.sin(a)*.39],[Math.cos(a)*.56,Math.sin(a)*.56]]);}break;
    case 'oak':disc(0,-.25,.24);disc(-.25,-.08,.24);disc(.25,-.08,.24);path([[0,-.02],[0,.48],[-.24,.48],[.25,.48]]);break;
    case 'key':ring(-.19,-.23,.24);path([[-.03,-.05],[.38,.38],[.54,.22]]);path([[.18,.18],[.34,.02]]);break;
    case 'star':polygon(Array.from({length:10},(_,j)=>{const a=-Math.PI/2+j*Math.PI/5,rr=j%2?.24:.57;return[Math.cos(a)*rr,Math.sin(a)*rr];}));break;
    case 'bridge':path([[-.52,.37],[-.52,-.13],[.52,-.13],[.52,.37]]);ctx.beginPath();ctx.arc(0,.36,.3,Math.PI,TAU);ctx.stroke();path([[-.57,-.31],[.57,-.31]]);break;
    case 'sail':path([[0,-.57],[0,.34]]);polygon([[-.1,-.4],[-.48,.2],[-.1,.2]]);polygon([[.12,-.3],[.48,.2],[.12,.2]]);polygon([[-.52,.32],[.52,.32],[.3,.51],[-.3,.51]]);break;
    case 'fountain':path([[0,-.52],[0,.25]]);path([[-.47,.19],[-.31,.43],[.31,.43],[.47,.19]]);ctx.beginPath();ctx.arc(-.25,-.1,.25,Math.PI,TAU);ctx.arc(.25,-.1,.25,Math.PI,TAU);ctx.stroke();break;
    case 'hive':for(const [a,b] of [[0,-.29],[-.26,.14],[.26,.14]]){ctx.beginPath();for(let j=0;j<6;j++){const t=j*TAU/6;const px=a+Math.cos(t)*.24,py=b+Math.sin(t)*.24;j?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.stroke();}break;
    case 'crown':polygon([[-.53,-.34],[-.22,-.05],[0,-.48],[.22,-.05],[.53,-.34],[.39,.3],[-.39,.3]]);path([[-.37,.46],[.37,.46]]);break;
    case 'lantern':ring(0,-.45,.14);path([[-.32,-.24],[.32,-.24],[.26,.41],[-.26,.41],[-.32,-.24]]);disc(0,.08,.14);break;
    case 'mountain':path([[-.57,.4],[-.09,-.43],[.12,-.05],[.3,-.28],[.58,.4],[-.57,.4]]);path([[-.24,-.15],[-.09,-.03],[.02,-.19]]);break;
    case 'rose':for(let j=0;j<5;j++){const a=j*TAU/5-Math.PI/2;disc(Math.cos(a)*.28,Math.sin(a)*.28,.22);}ctx.fillStyle=culture.ink;disc(0,0,.12);break;
    case 'knot':ctx.save();ctx.rotate(-.5);ctx.strokeRect(-.5,-.15,.53,.35);ctx.strokeRect(-.04,-.15,.53,.35);ctx.restore();break;
    case 'moon':disc(0,0,.49);ctx.fillStyle=culture.ink;disc(.24,-.16,.44);break;
    case 'wheat':path([[0,.52],[0,-.51]]);for(let j=0;j<3;j++){const yy=-.32+j*.22;path([[-.3,yy-.13],[0,yy+.08],[.3,yy-.13]]);}break;
    case 'wheel':ring(0,0,.49);disc(0,0,.12);for(let j=0;j<6;j++){const a=j*TAU/6;path([[0,0],[Math.cos(a)*.48,Math.sin(a)*.48]]);}break;
    case 'beacon':polygon([[-.15,-.18],[.15,-.18],[.31,.48],[-.31,.48]]);ctx.fillRect(-.2,-.39,.4,.15);path([[-.31,-.32],[-.56,-.49]]);path([[.31,-.32],[.56,-.49]]);break;
  }
  ctx.restore();
}

// Approval is attached to a versioned knowledge pointer, never to a body colour.
// Every document opens unsigned. Independent cultures sign during the visible
// timeline; their seals persist afterward. These are illustrative endorsements.
export const pointerOf = id => `knowledge/${id}@1`;
export function approvalsFor(entry) {
  if(!entry)return [];
  const i=entry.index===undefined?KNOWLEDGE.indexOf(entry):KNOWLEDGE.length+entry.index;
  return Array.from({length:4},(_,j)=>({
    id:`approval:${entry.id}:${j}`,pointer:pointerOf(entry.id),entry:entry.id,slot:j,
    issuer:READERS[(i*3+j*4)%READERS.length].id,
    at:entry.readyAt===undefined?1.6+i*.32+j*1.3:entry.readyAt+.35+j*.4,
  })).map(a=>({...a,culture:cultureFor(a.issuer).id,ratifiedAt:a.at-.16,
    members:Array.from({length:4},(_,i)=>({
      id:`${a.issuer}/member-${i+1}`,pointer:a.pointer,signedAt:a.at-.3+i*.04,
    })),
  }));
}
export const APPROVALS=[...KNOWLEDGE,...ADDITIONS].flatMap(approvalsFor);
// Count earlier distinct endorsements directly. Older generations need not be
// rendered or kept in a mutable array to retain their reputation and receipts.
function priorEndorsements(approval) {
  let count=KNOWLEDGE.flatMap(approvalsFor).filter(a=>a.issuer===approval.issuer&&a.at<approval.at&&a.pointer!==approval.pointer).length;
  for(let residue=0;residue<6;residue++)for(const a of approvalsFor(additionAt(residue))) {
    if(a.issuer!==approval.issuer)continue;
    const periods=(approval.at-a.at)/(GENERATION_SECONDS*2);
    count+=Math.max(0,Math.ceil(periods-1e-9));
  }
  return count;
}
export function isCollectiveSeal(a,seconds) {
  const culture=cultureFor(a.issuer);
  return !!culture && culture.id===a.culture && a.at<=seconds && a.ratifiedAt<=a.at && a.members.length>=4 &&
    new Set(a.members.map(m=>m.id)).size===a.members.length &&
    a.members.every(m=>m.id.startsWith(`${a.issuer}/`)&&m.pointer===a.pointer&&m.signedAt<=a.ratifiedAt);
}
export function approvalsAt(id,seconds) {
  return approvalsFor(recordOf(id)).filter(a=>isCollectiveSeal(a,seconds));
}
export function knowledgeDetails(id,seconds) {
  const entry=recordOf(id);
  if(!entry || (entry.start!==undefined&&seconds<entry.start))return null;
  const parents=entry.parents||EDGES.filter(([,to])=>to===id).map(([from])=>from).filter(p=>recordOf(p));
  return {id,pointer:pointerOf(id),source:entry.source,span:entry.span,
    sources:entry.sources||[{id:entry.source,span:entry.span}],
    parents:parents.map(id=>({id,pointer:pointerOf(id)})),
    status:entry.publishAt===undefined||seconds>=entry.publishAt?'Shared knowledge':seconds>=entry.readyAt?'Gathering seals':'Combining knowledge',
    approvals:approvalsAt(id,seconds).map(a=>({...a,culture:cultureFor(a.issuer),priorApprovals:priorEndorsements(a)}))};
}
export function swarmStructure(root,index,mobile=false) {
  const factor=mobile?.72:1,children=[],twigs=[];
  const count=[3,1,2,0,1,0,0,1,0,0,2,0,1,0,0,0,1,0][index];
  const start=index===10?-3.4:[-1.9,-2.7,-.4][index%3];
  const fit=p=>({...p,x:Math.max(20,Math.min((mobile?600:1000)-20,p.x)),y:Math.max(22,Math.min((mobile?628:574)-(p.r||2),p.y))});
  for(let j=0;j<count;j++) {
    const angle=start+j*1.2,distance=root.r+(24+j%2*13)*factor;
    const child=fit({id:`${root.id}/chamber-${j}`,parent:root.id,x:root.x+Math.cos(angle)*distance,y:root.y+Math.sin(angle)*distance,r:(10+j%2*4)*factor,rung:Math.max(0,root.rung-2-j)});
    child.port=child.r;children.push(child);
    if(index===0&&j===0) {
      const grandchild=fit({id:`${child.id}/chamber`,parent:child.id,x:child.x-25*factor,y:child.y+18*factor,r:6.5*factor,rung:0});
      grandchild.port=grandchild.r;children.push(grandchild);
    }
  }
  const direction=Math.atan2(root.y-315,root.x-(mobile?300:500));
  for(let j=0;j<3+index%4;j++) {
    const angle=direction-.75+j*.32,distance=root.r+(15+(j%3)*8)*factor;
    twigs.push(fit({x:root.x+Math.cos(angle)*distance,y:root.y+Math.sin(angle)*distance,port:1.5}));
  }
  return {children,twigs};
}
export function chooseEntry(start,reader) {
  const available=recentAdditions(start).filter(a=>a.publishAt<=start);
  if(!available.length||reader%6===0)return READERS[reader].base;
  // Readers reuse different recent branches, instead of all chasing one record.
  return available[Math.max(0,available.length-1-reader%Math.min(available.length,6))].id;
}
function request(start,reader,id) {
  return {id,start,reader,entry:chooseEntry(start,reader),hitAt:start+.58,arrivalAt:start+1.32,end:start+3.15};
}
export function commonsState(seconds,extra=[]) {
  const t=Math.max(0,Number.isFinite(seconds)?seconds:0),requests=[],retained=[];
  let reuses=0;
  for(const [reader,r] of READERS.entries()) {
    if(t<r.firstAt)continue;
    const generation=Math.floor((t-r.firstAt)/r.period),start=r.firstAt+generation*r.period;
    const current=request(start,reader,`${r.id}:${generation}`);
    if(t<current.end)requests.push(current);
    const lastComplete=t>=current.arrivalAt?current:generation>0?request(start-r.period,reader,`${r.id}:${generation-1}`):null;
    if(lastComplete)retained.push(lastComplete);
    if(t>=r.firstAt+1.32)reuses+=Math.floor((t-r.firstAt-1.32)/r.period)+1;
  }
  for(const q of extra) {
    if(t>=q.arrivalAt)reuses++;
    if(t>=q.start&&t<q.end)requests.push(q);
  }
  const additions=recentAdditions(t).map(a=>({...a,computing:t>=a.computeAt&&t<a.readyAt,
    reviewing:t>=a.readyAt&&t<a.publishAt,published:t>=a.publishAt}));
  return {seconds:t,requests,retained,additions,reuses,published:additions.filter(a=>a.published),
    publishedCount:countAt(t,3.7),newInferenceCount:countAt(t,.72)};
}
export function commonsLayout(mobile=false,seconds=0,selected=null) {
  const width=mobile?600:1000,height=mobile?710:650;
  const sources=SOURCES.map((p,i)=>({...p,x:mobile?100:115,y:(mobile?190:210)+i*(mobile?150:115),port:10}));
  const nodes=KNOWLEDGE.map((p,i)=>({...p,
    x:(mobile?125:196)+Math.floor(i/5)*(mobile?50:82),
    y:(mobile?151:156)+(i%5)*(mobile?90:81),port:mobile?12:16,label:undefined}));
  const readers=READERS.map((r,i)=> {
    const [x,y,radius]=mobile?MOBILE_SWARMS[i]:[r.x,r.y,r.r];
    return {...r,x,y,r:radius,port:radius};
  });
  readers.forEach((r,i)=>Object.assign(r,swarmStructure(r,i,mobile)));
  // A slow advancing frontier leaves room for new generations. Old pointers
  // remain reconstructible, and visible children keep compact parent cards.
  const scroll=Math.max(0,(seconds-1.1)/GENERATION_SECONDS-3);
  const additions=recentAdditions(seconds).map(a=>({...a,
    x:(mobile?265:408)+(a.generation-scroll)*(mobile?66:120),
    y:(mobile?208:208)+a.branch*(mobile?149:126)+(a.generation%2?12:-8),
    port:mobile?18:25,
  })).filter(a=>a.x>=(mobile?221:320));
  const byId=new Map([...sources,...nodes,...additions].map(o=>[o.id,o]));
  const archived=[];
  const need=new Set(additions.flatMap(a=>a.parents));if(selected)need.add(selected);
  for(const id of need) {
    if(byId.has(id))continue;const a=recordOf(id);if(!a||a.start>seconds)continue;
    const n={...a,x:mobile?217:325,y:208+(a.branch||0)*(mobile?149:126)-(mobile?60:42),
      port:mobile?10:12,archived:true};
    if(id===selected) {n.x=mobile?331:500;n.y=mobile?125:135;n.port=mobile?18:25;}
    archived.push(n);byId.set(id,n);
  }
  return {mobile,width,height,sources,nodes,additions,archived,readers,byId};
}
// Every semantic edge exits the source right and enters its target left.
export function memoryPath(a,b) {
  const from={x:a.x+(a.port||8),y:a.y},to={x:b.x-(b.port||8),y:b.y};
  const bend=Math.min(105,Math.max(24,Math.abs(to.x-from.x)*.35));
  const lift=to.x<from.x?Math.min(70,35+Math.abs(to.x-from.x)*.08):0;
  return [from,{x:from.x+bend,y:from.y-lift},{x:to.x-bend,y:to.y-lift},to];
}
function at(p,t){const u=1-t;return {x:u*u*u*p[0].x+3*u*u*t*p[1].x+3*u*t*t*p[2].x+t*t*t*p[3].x,y:u*u*u*p[0].y+3*u*u*t*p[1].y+3*u*t*t*p[2].y+t*t*t*p[3].y};}
function line(c,p,color,w=1){c.beginPath();c.moveTo(p[0].x,p[0].y);c.bezierCurveTo(p[1].x,p[1].y,p[2].x,p[2].y,p[3].x,p[3].y);c.strokeStyle=color;c.lineWidth=w;c.stroke();}
function dot(c,x,y,r,color){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=color;c.fill();}
export function createWikiScene(canvas,onStatus=()=>{}) {
  const ctx=canvas.getContext('2d'),skins=Array.from({length:6},(_,i)=>skinForRung(i)),sealSprites=new Map();
  let layout,backdrop,scale=1,insetX=0,dpr=1,origin=null,offset=0,frozen=null,now=0,serial=0,completedExtra=0,extra=[],lastStatus='',selected=null;
  function resize(mobile=false) {
    const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
    layout=commonsLayout(mobile,now,selected);dpr=Math.min(globalThis.devicePixelRatio||1,1.5);scale=Math.min(rect.width/layout.width,(rect.height-72)/(mobile?645:605));
    insetX=(rect.width-layout.width*scale)/2;
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    backdrop=document.createElement('canvas');backdrop.width=canvas.width;backdrop.height=canvas.height;
    const c=backdrop.getContext('2d');c.setTransform(dpr*scale,0,0,dpr*scale,dpr*insetX,0);
    // Only actual knowledge relationships remain in the quiet background.
    for(const [from,to] of EDGES)line(c,memoryPath(layout.byId.get(from),layout.byId.get(to)),hexA(INK.bronze,.2),.8);
    for(const s of layout.sources){c.fillStyle=INK.paperA;c.strokeStyle=hexA(INK.bronze,.35);c.lineWidth=.8;c.fillRect(s.x-14,s.y-11,28,22);c.strokeRect(s.x-14,s.y-11,28,22);c.fillStyle=hexA(INK.bronze,.4);c.fillRect(s.x-9,s.y-5,16,1);c.fillRect(s.x-9,s.y,11,1);}
    for(const r of layout.readers) {
      for(const tip of r.twigs){line(c,memoryPath(r,tip),hexA(INK.bronze,.23),.75);dot(c,tip.x,tip.y,1.7,hexA(INK.bronze,.45));}
      for(const child of r.children){const parent=child.parent===r.id?r:r.children.find(n=>n.id===child.parent);line(c,memoryPath(parent,child),hexA(INK.bronze,.38),.9);}
    }
  }
  function packet(p,t,color,r=3.3) {if(t===null)return;const q=at(p,t);ctx.save();ctx.shadowColor=color;ctx.shadowBlur=10;dot(ctx,q.x,q.y,r,color);ctx.restore();}
  function civicSeal(culture,x,y,r) {
    if(!sealSprites.has(culture.id)) {
      const sprite=document.createElement('canvas');sprite.width=sprite.height=96;
      drawCivicSeal(sprite.getContext('2d'),culture,48,48,44);sealSprites.set(culture.id,sprite);
    }
    const pad=r*48/44;
    ctx.drawImage(sealSprites.get(culture.id),x-pad,y-pad,pad*2,pad*2);
  }
  function sealPosition(n,slot) {
    const large=n.port>=18,spacing=large?(layout.mobile?11:15):8,h=large?32:24;
    return {x:n.x+(slot-1.5)*spacing,y:n.y+h/2+(large?12:8),port:.1,r:large?(layout.mobile?5.3:6.8):3.8,h};
  }
  function entry(n,t,lit=false,newProgress=1) {
    const w=n.port*2,h=n.port>=18?32:24,votes=approvalsAt(n.id,t),focus=selected===n.id;
    ctx.save();ctx.translate(n.x,n.y);
    const unfold=.65+.35*smooth(newProgress);ctx.scale(unfold,unfold);ctx.globalAlpha=.45+.55*clamp(newProgress);
    ctx.strokeStyle=hexA(focus?READY:INK.bronze,focus?.85:.38);ctx.lineWidth=focus?1.5:.85;
    ctx.strokeRect(-w/2+5,-h/2-5,w,h);
    ctx.fillStyle=INK.paperA;ctx.fillRect(-w/2,-h/2,w,h);ctx.strokeRect(-w/2,-h/2,w,h);
    ctx.fillStyle=hexA(INK.bronze,.6);ctx.strokeStyle=hexA(INK.bronze,.6);ctx.lineWidth=1;
    if(n.kind==='concept'||n.kind==='connection') {
      const positions=[[-w*.25,3],[0,-h*.24],[w*.23,4]];
      ctx.beginPath();ctx.moveTo(...positions[0]);if(newProgress>.25)ctx.lineTo(...positions[1]);if(newProgress>.65)ctx.lineTo(...positions[2]);ctx.stroke();
      positions.slice(0,Math.ceil(newProgress*3)).forEach(([x,y])=>dot(ctx,x,y,2,INK.bronze));
    } else {
      for(let i=0;i<3;i++)ctx.fillRect(-w*.32,-h*.25+i*6,w*(i===2?.4:.65)*clamp(newProgress*3-i),1.3);
    }
    // The small external-link glyph is the pointer; the attached seal is its approval.
    ctx.beginPath();ctx.moveTo(-w/2+4,h/2-4);ctx.lineTo(-w/2+10,h/2-10);ctx.moveTo(-w/2+5,h/2-10);ctx.lineTo(-w/2+10,h/2-10);ctx.lineTo(-w/2+10,h/2-5);ctx.stroke();
    ctx.restore();
    // Every sovereign signatory keeps its own pendant seal. No merged verdict.
    votes.forEach((vote,j)=>{
      const {x,y,r}=sealPosition(n,j);
      ctx.beginPath();ctx.moveTo(x-2,n.y+h/2-2);ctx.lineTo(x-2,y-3);ctx.moveTo(x+2,n.y+h/2-2);ctx.lineTo(x+2,y-3);
      ctx.strokeStyle=hexA(cultureFor(vote.issuer).ink,.6);ctx.lineWidth=.65;ctx.stroke();
      const pulse=clamp(1-(t-vote.at)/.65);
      civicSeal(cultureFor(vote.issuer),x,y,r+pulse*1.3);
    });
    if(lit||focus){ctx.beginPath();ctx.arc(n.x-w/2-5,n.y,3,0,TAU);ctx.fillStyle=READY;ctx.fill();}
  }
  function fragment(path,progress,color) {
    if(progress===null)return;
    const q=at(path,progress),next=at(path,Math.min(1,progress+.01));
    ctx.save();ctx.translate(q.x,q.y);ctx.rotate(Math.atan2(next.y-q.y,next.x-q.x)*.2);
    ctx.fillStyle=INK.paperB;ctx.strokeStyle=color;ctx.lineWidth=1;
    ctx.shadowColor=color;ctx.shadowBlur=6;
    ctx.fillRect(-5,-4,10,8);ctx.strokeRect(-5,-4,10,8);ctx.shadowBlur=0;
    ctx.beginPath();ctx.moveTo(-3,-1);ctx.lineTo(3,-1);ctx.moveTo(-3,2);ctx.lineTo(1,2);ctx.stroke();ctx.restore();
  }
  function approvalPacket(p,progress,culture) {
    if(progress===null)return;const q=at(p,progress);
    // A small seal travels from the endorser to the exact concept pointer.
    civicSeal(culture,q.x,q.y,8);
  }
  function render(milliseconds,reduced=false) {
    if(!layout)return;if(origin===null)origin=milliseconds;
    const elapsed=Math.max(0,milliseconds-origin)/1000;let t=elapsed+offset;
    if(reduced){if(frozen===null)frozen=t;t=frozen;}
    else if(frozen!==null){offset=frozen-elapsed;t=frozen;frozen=null;}
    now=t;
    const done=extra.filter(q=>t>=q.end);completedExtra+=done.length;extra=extra.filter(q=>t<q.end);
    const state=commonsState(t,extra),active=new Set();
    layout=commonsLayout(layout.mobile,t,selected);
    const status={reuses:state.reuses+completedExtra,additions:state.publishedCount};
    const key=JSON.stringify(status);if(key!==lastStatus){lastStatus=key;onStatus(status);}
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(backdrop,0,0);
    ctx.setTransform(dpr*scale,0,0,dpr*scale,dpr*insetX,0);ctx.lineCap='round';
    for(const q of state.requests) {
      const p=layout.byId.get(q.entry),reader=layout.readers[q.reader];if(!p)continue;
      if(t>=q.hitAt&&t<q.arrivalAt+.3)active.add(p.id);
      const outgoing=memoryPath(reader,p),incoming=memoryPath(p,reader);
      const visibility=clamp((q.arrivalAt+.3-t)/.3);
      if(visibility>0)line(ctx,incoming,hexA(READY,.11*visibility),.9);
      packet(outgoing,phase(t,q.start,q.hitAt),GOLD,2.6);
      packet(incoming,phase(t,q.hitAt,q.arrivalAt),READY,3.5);
    }
    // Incoming fragments travel from two or three exact parent records. Work
    // branches asynchronously, and published children become tomorrow's inputs.
    for(const a of layout.additions) {
      const published=t>=a.publishAt,progress=smooth((t-a.computeAt)/(a.readyAt-a.computeAt));
      for(const [j,id] of a.parents.entries()) {
        const parent=layout.byId.get(id);if(!parent)continue;
        const edge=memoryPath(parent,a),forming=t<a.readyAt,focused=selected===a.id||selected===id;
        line(ctx,edge,hexA(focused?READY:forming?GOLD:INK.bronze,focused?.65:forming?.54:.21),focused?1.6:forming?1.25:.9);
        if(forming) {
          active.add(id);
          fragment(edge,phase(t,a.start+j*.11,a.computeAt+.38+j*.13),j%2?READY:GOLD);
        }
      }
      if(t<a.computeAt) {
        const reveal=smooth((t-a.start)/.6);
        ctx.save();ctx.globalAlpha=reveal*.65;ctx.setLineDash([3,4]);ctx.strokeStyle=GOLD;ctx.lineWidth=1;
        ctx.strokeRect(a.x-a.port-3,a.y-19,a.port*2+6,38);ctx.restore();
      } else {
        entry(a,t,active.has(a.id),progress);
        if(t<a.readyAt) {
          // Written lines appear as the combined document takes shape.
          ctx.strokeStyle=hexA(GOLD,.8);ctx.lineWidth=1.8;
          ctx.beginPath();ctx.moveTo(a.x-a.port,a.y+19);ctx.lineTo(a.x-a.port+a.port*2*progress,a.y+19);ctx.stroke();
        }
        if(published&&t<a.publishAt+1) {
          ctx.save();ctx.globalAlpha=1-(t-a.publishAt);ctx.strokeStyle=GOLD;
          const spread=(t-a.publishAt)*10;ctx.strokeRect(a.x-a.port-spread,a.y-18-spread,a.port*2+spread*2,36+spread*2);ctx.restore();
        }
      }
    }
    for(const n of layout.nodes)entry(n,t,active.has(n.id));
    for(const n of layout.archived) {ctx.save();ctx.globalAlpha=selected===n.id?1:.65;entry(n,t,active.has(n.id));ctx.restore();}
    const visibleRecords=[...KNOWLEDGE,...layout.additions,...layout.archived];
    for(const approval of visibleRecords.flatMap(n=>approvalsFor(recordOf(n.id)))) {
      if(t<approval.at-.32||t>approval.at+.7)continue;
      const target=layout.byId.get(approval.entry),issuer=layout.readers.find(r=>r.id===approval.issuer);
      const destination=sealPosition(target,approval.slot),route=memoryPath(issuer,destination),culture=cultureFor(issuer.id);
      line(ctx,route,hexA(culture.ink,.3*clamp((approval.at+.7-t)/.7)),1);
      approvalPacket(route,phase(t,approval.ratifiedAt,approval.at),culture);
      for(const [k,member] of approval.members.entries()) {
        const tip=issuer.twigs[k%issuer.twigs.length];
        packet(memoryPath(tip,issuer),phase(t,member.signedAt,approval.ratifiedAt),culture.ink,2.7);
      }
    }
    if(selected)for(const approval of approvalsAt(selected,t)) {
      const issuer=layout.readers.find(r=>r.id===approval.issuer),target=layout.byId.get(selected);if(!target)continue;
      line(ctx,memoryPath(issuer,target),hexA(cultureFor(issuer.id).ink,.32),1);
    }
    for(const [i,r] of layout.readers.entries()) {
      ctx.save();drawSkin(ctx,skins[r.rung],[r.x,r.y],r.r,{yaw:t*(.09+i*.003)+i*.71,pitch:.25},
        ()=>null,{ink:.45,beadAt:1});ctx.restore();
      for(const [j,child] of r.children.entries()) {
        ctx.save();drawSkin(ctx,skins[child.rung],[child.x,child.y],child.r,{yaw:t*.12+j*.7,pitch:.25},()=>null,{ink:.4,beadAt:1});ctx.restore();
      }
      // The arms belong to the whole culture, outside the unchanged polyhedral skin.
      const armsY=r.y+r.r+13,armsR=layout.mobile?8.5:10;
      ctx.beginPath();ctx.moveTo(r.x,r.y+r.r*.85);ctx.lineTo(r.x,armsY);ctx.strokeStyle=hexA(INK.bronze,.4);ctx.lineWidth=.8;ctx.stroke();
      civicSeal(cultureFor(r.id),r.x,armsY,armsR);
      // Flow along the branch tips makes the organism active without changing its skin.
      const current=state.requests.find(q=>q.reader===i);
      if(current&&t<current.arrivalAt)for(const [j,tip] of r.twigs.entries())
        packet(memoryPath(tip,r),phase(t,current.start+j*.055,current.arrivalAt),INK.bronze,1.9);
    }
  }
  return {resize,render,
    select(id){selected=knowledgeDetails(id,now)?id:null;if(layout)layout=commonsLayout(layout.mobile,now,selected);return selected?knowledgeDetails(selected,now):null;},
    inspect(x,y){
      const px=(x-insetX)/scale,py=y/scale;
      const hit=[...layout.nodes,...layout.archived,...layout.additions].reverse().find(n=>Math.abs(px-n.x)<=Math.max(n.port+9,34)&&py>=n.y-25&&py<=n.y+(n.label?18:13)+23);
      return this.select(hit?.id);
    },
    details(){return selected?knowledgeDetails(selected,now):null;},
    available(){return [...layout.additions].reverse().concat(layout.nodes,layout.archived).map(n=>n.id);},
    ask(){
      if(extra.length>=12)return false;
      const q=request(now,serial++%READERS.length,`your-question:${serial}`);extra.push(q);
      if(frozen!==null){frozen=Math.max(frozen,q.arrivalAt);now=frozen;}
      return q;
    },
  };
}
