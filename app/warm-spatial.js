const root=document.querySelector('[data-warm-galaxy]'),viewport=root.querySelector('.galaxy-viewport'),film=root.querySelector('[data-galaxy-video]'),stage=root.querySelector('.galaxy-theater'),panel=document.querySelector('#warm-world');
const $=key=>panel.querySelector(`[data-ww-${key}]`),canvas=$('canvas'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let ctx=canvas.getContext('2d'),tiles=null,smoke=null;
let active=false,readyPromise,scene,data,base,baseView={zoom:1,x:0,y:0},view={...baseView},selected=null,hover=null,target=null,mode='explore',autoUsed=false;
let width=1280,height=720,scale=1,ox=0,oy=0,raf=0,renderTimer=0,drag=null,mission=null,intersecting=true,opening=false,openEpoch=0;
let lens=null;
let stations=[];
let mintEntry=false;   // the root label is the call to action: the live scene stays, the chain observatory takes Unit 0's place
const lensCanvas=document.createElement('canvas'),lensCtx=lensCanvas.getContext('2d');
lensCanvas.className='ww-lens';lensCanvas.setAttribute('data-ww-lens','');lensCanvas.setAttribute('aria-hidden','true');lensCanvas.hidden=true;canvas.after(lensCanvas);
const LENS_ZOOM=4;
let missions=[];const STORAGE='dyson-spatial-assignments-v1';
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'[]');if(Array.isArray(saved))missions=saved.filter(m=>m?.schema==='dyson.spatial-assignment/v1'&&typeof m.objective==='string'&&m.target?.at?.length===2&&m.target.at.every(Number.isFinite)&&m.source?.at?.length===2&&m.source.at.every(Number.isFinite)).slice(-12);}catch{}
const name=n=>n?.kind==='station'?n.name:n?.id===0?'Unit 0 · The Dyson Society':`${n?.relation==='chamber'?'Chamber':n?.relation==='department'?'Department':'Swarm'} ${n?.id}`;
const node=id=>data?.nodes.find(n=>n.id===id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function notify(text){$('notice').textContent=text;$('notice').hidden=!text;}
async function prepare(){
  if(readyPromise)return readyPromise;
  readyPromise=(async()=>{
    const mobile=root.dataset.galaxyVideoVariant==='mobile';width=mobile?450:1280;height=mobile?800:720;
    try{
      const {createWorldTiles}=await import('./warm-world-tiles.js?v=lossless-2');
      tiles=await createWorldTiles({manifestUrl:new URL('./warm-media/world-lossless-2/manifest.json',import.meta.url).href,
        variant:mobile?'mobile':'desktop',onUpdate:schedule});
      data=tiles.data;base=true;root.dataset.spatialRenderer='lossless-tiles';
      // THE ENDING GOES UP IN SMOKE (his Oct 12 2026 10:3x WEST): the still dissolves into rising smoke the pointer stirs (warm-ending-smoke.js)
      if(!reduced.matches)try{const {createEndingSmoke}=await import('./warm-ending-smoke.js?v=4');
        smoke=createEndingSmoke({panel,after:lensCanvas,manifestUrl:new URL('./warm-media/world-lossless-2/manifest.json',import.meta.url).href,
          variant:mobile?'mobile':'desktop',nodes:data.nodes,frameHeight:height,getView:smokeView,canRun:()=>active&&!document.hidden&&intersecting});
      }catch(error){panel.dataset.smoke=`off: ${error.message||error}`;}
    }catch(error){
      // A failed image request must not disable selection or the existing world.
      root.dataset.spatialTileError=String(error.message||error);
      const {createSpatialScene}=await import('./warm-spatial-scene.js?v=mothership-1');
      base=document.createElement('canvas');scene=createSpatialScene(base,{width,height,pixelRatio:1.5});
      data=scene.render(48);root.dataset.spatialRenderer='geometry-fallback';
    }
    baseView={zoom:1,x:0,y:0};
    // Embertide Stations (added 2026-09-11 night): places on this world you can enter. stations.json beside this file.
    try{const sj=await fetch(new URL('./stations.json',import.meta.url).href,{cache:'no-store'}).then(r=>r.ok?r.json():null);
      const anchor=data.nodes.find(n=>n.id===0)?.at||[width/2,height/2];
      stations=(sj?.stations||[]).map(st=>({...st,kind:'station',pathText:st.path||'',at:[anchor[0]+(st.offset?.[0]||0),anchor[1]+(st.offset?.[1]||0)],r:st.r||10,society:-1,path:[],children:[]}));
      for(const st of stations){
        const el=document.createElement('div');el.className='ww-label ww-label-station';el.setAttribute('role','button');el.tabIndex=0;el.dataset.station=st.id;if(st.call){el.title=st.call;el.setAttribute('aria-label',st.call);}
        const kicker=document.createElement('span');kicker.textContent=(st.kicker||'STATION 0');const title=document.createElement('strong');title.textContent=st.title||'the room';el.append(kicker,title);
        el.addEventListener('click',()=>pick(st));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(st);}});
        $('root-label').after(el);st.label=el;
      }
      root.dataset.spatialStations=String(stations.length);
    }catch(e){root.dataset.spatialStationError=String(e.message||e);}
    root.dataset.spatialNodes=String(data.nodes.length);return data;
  })().catch(error=>{readyPromise=null;throw error;});
  return readyPromise;
}
function fit(){
  const rect=panel.getBoundingClientRect();if(!rect.width||!rect.height)return;
  const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);lensCanvas.width=canvas.width;lensCanvas.height=canvas.height;lensCtx.setTransform(dpr,0,0,dpr,0,0);
  scale=Math.min(rect.width/width,rect.height/height);ox=(rect.width-width*scale)/2;oy=(rect.height-height*scale)/2;draw();
}
const smokeView=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;return{width:w,height:h,k:scale*view.zoom,b:[ox+view.x*scale,oy+view.y*scale],lens:lens&&!drag&&active?{x:lens[0],y:lens[1],r:Math.min(112,w*.25,h*.25),zoom:LENS_ZOOM}:null};};
const screen=p=>[ox+(p[0]*view.zoom+view.x)*scale,oy+(p[1]*view.zoom+view.y)*scale];
const world=p=>[((p[0]-ox)/scale-view.x)/view.zoom,((p[1]-oy)/scale-view.y)/view.zoom];
function local(event){const r=canvas.getBoundingClientRect();return[event.clientX-r.left,event.clientY-r.top];}
function hit(p){
  let winner=null,best=Infinity;
  for(const st of stations){const q=screen(st.at),r=Math.max(9,st.r*view.zoom*scale);if(Math.hypot(q[0]-p[0],q[1]-p[1])<=r+4)return st;}
  for(const n of data?.nodes||[]){if(smoke?.gone(n.at))continue;const q=screen(n.at),r=n.r*view.zoom*scale,d=Math.hypot(q[0]-p[0],q[1]-p[1]);
    if(d<=Math.max(7,r+3)){const score=n.id===0?10000+d:d/Math.max(5,r);if(score<best){best=score;winner=n;}}
  }return winner;
}
function schedule(){smoke?.wake();if(active&&!document.hidden&&intersecting&&!raf)raf=requestAnimationFrame(()=>{raf=0;draw();if(mission?.status==='running')schedule();});}
function refreshGeometry(){
  if(tiles){schedule();return;}
  clearTimeout(renderTimer);renderTimer=setTimeout(()=>{if(!active||!scene)return;try{data=scene.render(48,{...view});baseView={...view};schedule();}catch(e){notify(`Scene could not redraw: ${e.message}`);}},220);
}
function ring(n,color='#e5c985',extra=0){
  if(!n)return;const p=screen(n.at),r=Math.max(8,n.r*view.zoom*scale+extra);
  ctx.strokeStyle=color;ctx.lineWidth=1.15;ctx.beginPath();ctx.arc(...p,r,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<4;i++){const a=i*Math.PI/2;ctx.beginPath();ctx.moveTo(p[0]+Math.cos(a)*(r+3),p[1]+Math.sin(a)*(r+3));ctx.lineTo(p[0]+Math.cos(a)*(r+9),p[1]+Math.sin(a)*(r+9));ctx.stroke();}
}
function label(text,p,color='#ead7a4'){
  ctx.font='11px system-ui';const w=ctx.measureText(text).width;ctx.fillStyle='#10241eeb';ctx.fillRect(p[0]-w/2-9,p[1]-17,w+18,25);ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(text,p[0],p[1]);
}
function route(a,b,bend=0){const dx=b[0]-a[0],dy=b[1]-a[1];return[a,[a[0]+dx*.3-dy*bend,a[1]+dy*.3+dx*bend],[a[0]+dx*.7-dy*bend,a[1]+dy*.7+dx*bend],b];}
function along(path,t){const q=1-t;return[0,1].map(i=>q*q*q*path[0][i]+3*q*q*t*path[1][i]+3*q*t*t*path[2][i]+t*t*t*path[3][i]);}
function stroke(path,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(...path[0]);ctx.bezierCurveTo(...path[1],...path[2],...path[3]);ctx.stroke();}
function drawMission(m,now,update=true){
  const adapt=end=>node(end.nodeId)?.at||[end.at[0]*width/(m.scene?.width||width),end.at[1]*height/(m.scene?.height||height)];
  const a=screen(adapt(m.source)),b=screen(adapt(m.target)),live=m.status==='running',elapsed=(now-m.started)/1000;
  const iteration=live?Math.min(m.iterations,Math.floor(elapsed/1.15)+1):m.completedIterations||0;
  const path=route(a,b,.09);stroke(path,live?'#d5b873b0':'#cdb67b45',1.2);
  if(live){
    for(let i=0;i<18;i++){
      const travel=((elapsed*.46+i/18)%1),branch=route(a,b,Math.sin(i*2.4)*.11),p=along(branch,travel);
      ctx.fillStyle=i%4?'#efcb78':'#8ec9b1';ctx.beginPath();ctx.arc(...p,i%4?1.5:2.2,0,Math.PI*2);ctx.fill();
      if(i%3===0)stroke(branch,'#d4c18a12',.6);
    }
    const pulse=12+((elapsed*.7)%1)*15;ctx.strokeStyle='#e2c47b90';ctx.beginPath();ctx.arc(...b,pulse,0,Math.PI*2);ctx.stroke();
    label(`REHEARSAL · ${iteration} / ${m.iterations}`, [b[0],b[1]-35]);
    if(update){
      $('phase').textContent=`LOCAL REHEARSAL · ${iteration} / ${m.iterations}`;$('progress').style.width=`${100*Math.min(1,elapsed/(m.iterations*1.15))}%`;
      m.completedIterations=iteration;
      if(elapsed>=m.iterations*1.15){m.status='rehearsed';m.finished=new Date().toISOString();save();updateMission();}
    }
  }else{ctx.strokeStyle='#d4bf88aa';ctx.beginPath();ctx.arc(...b,9,0,Math.PI*2);ctx.stroke();}
}
function setLens(p){lens=p;lensCanvas.hidden=!p;panel.classList.toggle('has-pixel-lens',!!p);schedule();}
function drawLens(now){
  const w=canvas.clientWidth,h=canvas.clientHeight;lensCtx.clearRect(0,0,w,h);
  if(!lens||drag||!active)return;
  const [x,y]=lens,r=Math.min(112,w*.25,h*.25);
  lensCtx.save();lensCtx.beginPath();lensCtx.arc(x,y,r,0,Math.PI*2);lensCtx.clip();
  lensCtx.fillStyle='#101c1a';lensCtx.fillRect(x-r,y-r,2*r,2*r);
  lensCtx.imageSmoothingEnabled=true;lensCtx.imageSmoothingQuality='high';
  if(tiles){
    // Same world point, four times the optical scale, native detail tiles.
    tiles.paint(lensCtx,{scale:scale*view.zoom*LENS_ZOOM,
      x:x+(ox+view.x*scale-x)*LENS_ZOOM,y:y+(oy+view.y*scale-y)*LENS_ZOOM,
      rect:{x:x-r,y:y-r,width:2*r,height:2*r},pixelRatio:lensCanvas.width/w,priority:10});
    const mainContext=ctx;ctx=lensCtx;ctx.save();
    try{
      ctx.translate(x*(1-LENS_ZOOM),y*(1-LENS_ZOOM));ctx.scale(LENS_ZOOM,LENS_ZOOM);
      drawDecorations(now,false);
    }finally{ctx.restore();ctx=mainContext;}
  }else{
    lensCtx.drawImage(canvas,0,0,canvas.width,canvas.height,x-x*LENS_ZOOM,y-y*LENS_ZOOM,w*LENS_ZOOM,h*LENS_ZOOM);
  }
  lensCtx.restore();
  lensCtx.save();lensCtx.strokeStyle='#eed69a';lensCtx.lineWidth=1.5;lensCtx.shadowColor='#000b';lensCtx.shadowBlur=14;
  lensCtx.beginPath();lensCtx.arc(x,y,r,0,Math.PI*2);lensCtx.stroke();lensCtx.shadowBlur=0;
  lensCtx.strokeStyle='#162a24';lensCtx.lineWidth=4;lensCtx.beginPath();lensCtx.arc(x,y,r+3,0,Math.PI*2);lensCtx.stroke();
  lensCtx.strokeStyle='#eed69aaa';lensCtx.lineWidth=1;
  for(let i=0;i<4;i++){const a=i*Math.PI/2;lensCtx.beginPath();lensCtx.moveTo(x+Math.cos(a)*5,y+Math.sin(a)*5);lensCtx.lineTo(x+Math.cos(a)*14,y+Math.sin(a)*14);lensCtx.stroke();}
  lensCtx.fillStyle='#0d201bea';lensCtx.fillRect(x-18,y+r-29,36,21);lensCtx.fillStyle='#ead7a4';lensCtx.font='11px system-ui';lensCtx.textAlign='center';lensCtx.fillText('4×',x,y+r-14);
  lensCtx.restore();
}
function draw(){
  if(!active||!base||!data)return;
  const r=panel.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height);ctx.fillStyle='#101c1a';ctx.fillRect(0,0,r.width,r.height);
  if(tiles){
    tiles.beginFrame();
    tiles.paint(ctx,{scale:scale*view.zoom,x:ox+view.x*scale,y:oy+view.y*scale,
      rect:{x:0,y:0,width:r.width,height:r.height},pixelRatio:canvas.width/r.width,priority:1});
  }else{
    const z=view.zoom/baseView.zoom;
    ctx.drawImage(base,ox+(view.x-baseView.x*z)*scale,oy+(view.y-baseView.y*z)*scale,width*scale*z,height*scale*z);
  }
  const rootNode=node(0),p=screen(rootNode.at),rr=rootNode.r*view.zoom*scale;
  const rootLabel=$('root-label');rootLabel.style.left=`${p[0]}px`;rootLabel.style.top=`${p[1]-rr*.82}px`;rootLabel.hidden=p[0]<-80||p[0]>r.width+80||p[1]-rr>r.height;
  for(const st of stations){if(!st.label)continue;const q=screen(st.at);st.label.style.left=`${q[0]}px`;st.label.style.top=`${q[1]}px`;st.label.hidden=q[0]<-80||q[0]>r.width+80||q[1]<-30||q[1]>r.height+10;}
  const now=performance.now();drawDecorations(now);
  drawLens(now);tiles?.endFrame();smoke?.render();
  root.dataset.spatialView=JSON.stringify(view);
}
function drawDecorations(now,update=true){
  if(selected&&selected.kind==='station'){ring(selected,'#ffdb8c',5);}
  else if(selected){
    const n=node(selected.id),family=data.nodes.filter(c=>c.society===n.society&&c.id!==n.id);
    for(const c of family.slice(0,36)){const a=screen(n.at),b=screen(c.at);ctx.strokeStyle='#dec38940';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();ring(c,'#c7c48b8a',2);}
    ring(n,'#ffdb8c',5);
  }
  if(hover&&!lens&&hover.id!==selected?.id){ring(hover,'#f5e4b2',4);const p=screen(hover.at);label(name(hover),[p[0],p[1]-Math.max(14,hover.r*view.zoom*scale)-15]);}
  for(const m of missions)drawMission(m,now,update);
  if(target&&!mission){const p=screen(target.at);ctx.strokeStyle='#e0c17c';ctx.beginPath();ctx.arc(...p,13,0,Math.PI*2);ctx.stroke();if(selected)stroke(route(screen(selected.at),p,.09),'#dbbf79aa');label(target.nodeId===null?'YOUR TARGET':name(node(target.nodeId)),[p[0],p[1]-26]);}
}
function setMode(next){mode=next;panel.dataset.mode=next;$('hint').textContent=next==='target'?'Point anywhere in the world, or choose another swarm.':'';schedule();}
// THE ENCOUNTER (his Oct 22 2026 13:5x WEST, over STATION 0 · the room: "can you replace station0 there with "Encountering the Lyssajudron" or whatever
// the fuck the dmc4 tagline we used on harmony app is... people gotta click that and they will be directed to the harmony app"): a station with a
// `harmony` door (stations.json) opens Harmony: Harmony's own page for her (DOORS.her: the box, her boss card) where this origin serves it (his
// house's doors, Harmony's window), else the installer a published release names for this desktop (nestos-release.json, the seat card's doors),
// else its panel (optimism.fit serves no Harmony page, and the installer stays unpublished until his release). One HEAD on a press, nothing at rest.
const desktop=()=>{const ua=navigator.userAgentData,p=ua?.platform||navigator.platform||'';return ua?.mobile||/android|iphone|ipad|ipod/i.test(navigator.userAgent)?null:/mac/i.test(p)?'macos':/win/i.test(p)?'windows':/linux/i.test(p)?'linux':null;};
async function doorOf(st){
  const her=new URL(st.harmony,location.href);
  try{if((await fetch(her,{method:'HEAD',cache:'no-store'})).ok)return her.href;}catch{}
  try{const {installLinks,MANIFEST}=await import('./dl-seat-card.mjs?v=society-1'),r=await fetch(new URL(MANIFEST,import.meta.url),{cache:'no-store'}),os=desktop();
    return(r.ok&&os?installLinks(await r.json()).find(d=>d.platform===os)?.href:null)??null;}catch{return null;}
}
async function enter(st){const door=await doorOf(st);if(door)location.assign(door);else select(st);}
// HER COSMOS SCENE (his Oct 30 2026 "when i click there in lyssajudron i want another anime cut scene like nefertiti before..."; then "...use the lyssajudron and
// "pour liquor" in it... explaining the difference between 3 pentagons active and 12 pentagons total... burn my cosmos"): her station plays her cutscene out of its
// own card (her player imported once, at the first press); never back on this panel after it (his "you cant get back here dude").
// THE POET AND THE FIRST TRACE (his Oct 30 2026 ~23:2x UTC "focus on the geometry dude... i need to have the lyssajudron there be a poet... i need delicious outlining of
// the first tracenet + finally link to it"): her station plays SCENES.poem, the first trace drawn from math as she says it, its one press the trail itself; the tank's
// card (#refuel) is gone since his "remove this shit dude".
async function encounter(st){
  panel.scrollIntoView({block:'start',behavior:'auto'});   // A SCENE OWNS THE SCREEN: the world flush at the top, nothing of the hero above it
  try{await import('./dl-lyssajudron.js?v=share-1');const r=st.label?.getBoundingClientRect?.();
    await window.dlLyssajudron?.play({scene:'poem',from:r?.width?[r.left+r.width/2,r.top+r.height/2]:null});}catch{}
}
const pick=n=>{if(n?.kind==='station'&&n.harmony)void encounter(n);else select(n);};
function select(n){
  if(!n)return;
  if(n.kind==='station'){
    if(mission?.status==='running'){mission.status='stopped';save();}selected=n;target=null;mission=null;setMode('explore');$('inspector').hidden=false;$('form').hidden=true;$('mission').hidden=true;
    $('name').textContent=n.name;$('path').textContent=n.pathText||'EMBERTIDE / STATION';$('members').textContent=n.members||'A station: a trace that became a place.';
    $('children').replaceChildren();if(n.harmony&&n.call){const h=document.createElement('button');h.textContent=`⇲ ${n.call}`;h.addEventListener('click',()=>void enter(n));$('children').appendChild(h);}   // THE ENCOUNTER's door to Harmony, after her scene
    for(const e of n.enter||[]){const b=document.createElement('button');b.textContent=`⇲ ${e.label}`;b.addEventListener('click',()=>{window.open(e.url,'_blank','noopener');});$('children').appendChild(b);}
    schedule();return;
  }if(mission?.status==='running'){mission.status='stopped';save();}selected=n;target=null;mission=null;setMode('explore');$('inspector').hidden=false;$('form').hidden=true;$('mission').hidden=true;
  $('name').textContent=name(n);$('path').textContent=n.id===0?'META-SWARM / ROOT':`SOCIETY ${n.society} / ${n.path.map(id=>`UNIT ${id}`).join(' / ')}`;
  $('members').textContent=n.id===0?'The shared world of swarms. Select a family to descend into its work.':`${n.children.length} child chambers · identity retained from the film.`;
  $('children').replaceChildren();for(const id of n.children.slice(0,5)){const c=node(id);if(!c)continue;const b=document.createElement('button');b.textContent=`↳ ${name(c)}`;b.addEventListener('click',()=>{select(c);focus(c);});$('children').append(b);}
  schedule();
}
function moveCamera(next){view={...next,zoom:1};schedule();refreshGeometry();}
function focus(n){
  const members=n.kind==='station'?[n]:data.nodes.filter(c=>c.society===n.society),points=members.length<50&&n.id!==0?members:[n];
  const minX=Math.min(...points.map(p=>p.at[0]-p.r)),maxX=Math.max(...points.map(p=>p.at[0]+p.r));
  const minY=Math.min(...points.map(p=>p.at[1]-p.r)),maxY=Math.max(...points.map(p=>p.at[1]+p.r));
  const zoom=1;
  moveCamera({zoom,x:width*.39-(minX+maxX)/2*zoom,y:height*.52-(minY+maxY)/2*zoom});
}
function chooseTarget(p,n){target={nodeId:n?.id??null,at:n?.at.slice()||world(p)};setMode('explore');$('form').hidden=false;$('objective').focus({preventScroll:true});$('hint').textContent='The target is anchored. Give this assignment an objective.';schedule();}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(missions.slice(-12)));}catch{notify('Browser storage is unavailable. Export the assignment to keep it.');}}
function updateMission(){if(!mission)return;$('mission').hidden=false;$('form').hidden=true;$('phase').textContent=mission.status==='running'?'LOCAL REHEARSAL':mission.status==='stopped'?'REHEARSAL STOPPED':'REHEARSAL SAVED';$('result').textContent=mission.status==='running'?mission.objective:`${mission.objective} · ${mission.completedIterations||0} visual iterations. No agents dispatched.`;$('cancel').hidden=mission.status!=='running';$('export').hidden=mission.status==='running';}
$('form').addEventListener('submit',e=>{
  e.preventDefault();if(!selected||!target)return;const objective=$('objective').value.trim(),iterations=Number($('budget').value);if(!objective||!Number.isInteger(iterations)||iterations<1||iterations>50)return;
  if(mission?.status==='running')mission.status='stopped';
  mission={schema:'dyson.spatial-assignment/v1',id:crypto.randomUUID(),created:new Date().toISOString(),source:{nodeId:selected.id,societyId:selected.society,at:selected.at.slice(),path:selected.path},target:{...target},objective,iterations,status:'running',execution:'local-visual-rehearsal',agentDispatch:false,started:performance.now(),completedIterations:0,scene:{revision:'film-horizon-1',time:48,width,height}};
  missions.push(mission);missions=missions.slice(-12);updateMission();schedule();
  if(reduced.matches){mission.completedIterations=iterations;mission.status='rehearsed';save();updateMission();schedule();}
});
$('cancel').addEventListener('click',()=>{if(mission){mission.status='stopped';save();updateMission();schedule();}});
$('export').addEventListener('click',()=>{if(!mission)return;const blob=new Blob([JSON.stringify(mission,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`dyson-assignment-${mission.id}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('direct').addEventListener('click',()=>{if(mission?.status==='running'){mission.status='stopped';save();}target=null;mission=null;$('form').hidden=true;$('mission').hidden=true;setMode('target');canvas.focus({preventScroll:true});});
$('focus').addEventListener('click',()=>{if(selected)focus(selected);});
$('dismiss').addEventListener('click',()=>{$('inspector').hidden=true;selected=null;hover=null;target=null;setMode('explore');canvas.focus({preventScroll:true});});
$('home').addEventListener('click',()=>{moveCamera({zoom:1,x:0,y:0});});
async function enterMint(){
  if(mintEntry||!active)return;mintEntry=true;
  try{
    // Unit 0's place in the base frame, taken from the current geometry before the renderer switches.
    const n0=node(0),core=data?.core?.core,anchor=(n0&&n0.at.every(Number.isFinite))?n0.at:(Array.isArray(core)&&core.every(Number.isFinite))?core:[width*.5,height*.76];
    if(!scene){const {createSpatialScene}=await import('./warm-spatial-scene.js?v=mothership-1');base=document.createElement('canvas');scene=createSpatialScene(base,{width,height,pixelRatio:1.5});}
    tiles?.suspend();tiles=null;root.dataset.spatialRenderer='geometry-live';
    const from={zoom:1,x:Number.isFinite(view.x)?view.x:0,y:Number.isFinite(view.y)?view.y:0};
    view={...from};data=scene.render(48,{...view});baseView={...view};schedule();
    const zoom=1;
    const to={zoom,x:width*.5-anchor[0]*zoom,y:height*.56-anchor[1]*zoom};
    await new Promise(done=>{const t0=performance.now();(function step(t){const u=clamp((t-t0)/1400,0,1),e=u*u*(3-2*u);view={zoom:1,x:from.x+(to.x-from.x)*e,y:from.y+(to.y-from.y)*e};schedule();if(u<1)requestAnimationFrame(step);else done();})(t0);});
    data=scene.render(48,{...view});baseView={...view};schedule();
  }catch(e){notify(`The live scene could not start: ${e.message}`);}
  document.querySelector('.mast [data-open-warm-state]')?.click();
}
$('root-label').setAttribute('role','button');$('root-label').tabIndex=0;$('root-label').addEventListener('click',()=>{void enterMint();});$('root-label').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();void enterMint();}});
canvas.addEventListener('pointerdown',e=>{if(e.button!==0&&e.button!==2)return;setLens(null);canvas.setPointerCapture(e.pointerId);drag={start:local(e),view:{...view},moved:false};});
canvas.addEventListener('pointermove',e=>{const p=local(e);smoke?.pointer(p);if(drag){const dx=p[0]-drag.start[0],dy=p[1]-drag.start[1];if(Math.hypot(dx,dy)>4)drag.moved=true;if(drag.moved){view={...drag.view,x:drag.view.x+dx/scale,y:drag.view.y+dy/scale};schedule();}}else{hover=hit(p);setLens(e.pointerType==='touch'?null:p);schedule();}});
canvas.addEventListener('pointerup',e=>{if(!drag)return;const was=drag;drag=null;if(was.moved){refreshGeometry();return;}const p=local(e),n=hit(p);setLens(e.pointerType==='touch'?null:p);if(mode==='target'||e.button===2&&selected)chooseTarget(p,n);else if(n)pick(n);});
canvas.addEventListener('pointercancel',()=>{drag=null;});canvas.addEventListener('contextmenu',e=>e.preventDefault());canvas.addEventListener('pointerleave',()=>{smoke?.pointer(null);setLens(null);if(!drag){hover=null;schedule();}});
canvas.addEventListener('dblclick',e=>{if(mode==='target')return;const n=hit(local(e));if(n){select(n);focus(n);}});
canvas.addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();moveCamera({...view,x:view.x+(e.key==='ArrowLeft'?50:e.key==='ArrowRight'?-50:0),y:view.y+(e.key==='ArrowUp'?50:e.key==='ArrowDown'?-50:0)});}
  else if(e.key.toLowerCase()==='n'){const candidates=data.nodes.filter(n=>{const p=screen(n.at);return !smoke?.gone(n.at)&&p[0]>0&&p[0]<canvas.clientWidth&&p[1]>0&&p[1]<canvas.clientHeight;}).sort((a,b)=>b.r-a.r).slice(0,20);const next=candidates[(candidates.findIndex(n=>n.id===hover?.id)+1)%candidates.length];if(next){e.preventDefault();hover=next;schedule();}}
  else if(e.key==='Enter'&&hover){e.preventDefault();if(mode==='target')chooseTarget(screen(hover.at),hover);else pick(hover);}
  else if(e.key==='Home'){e.preventDefault();moveCamera({zoom:1,x:0,y:0});}
  else if(e.key==='Escape'){setMode('explore');$('inspector').hidden=true;selected=null;target=null;schedule();}
});
async function open({automatic=false}={}){
  if(active||opening)return;opening=true;autoUsed=true;const ticket=++openEpoch;
  // Freeze the exact takeover pose while the geometry becomes available.
  root.dispatchEvent(new CustomEvent('warm:surface-change',{detail:{mode:'world'}}));
  if(film.readyState>0){film.currentTime=48;film.pause();}
  try{
    await prepare();if(ticket!==openEpoch)return;active=true;opening=false;panel.hidden=false;root.dataset.worldOpen='true';stage.inert=true;
    document.querySelector('[data-galaxy-toggle="purpose"]').hidden=true;
    if(!automatic&&location.hash!=='#world')history.pushState(null,'','#world');
    notify('');fit();smoke?.start();if(!automatic)canvas.focus({preventScroll:true});
  }catch(e){if(ticket!==openEpoch)return;opening=false;panel.hidden=false;notify(`Could not reconstruct the scene: ${e.message}`);}
}
function close(){
  setLens(null);tiles?.suspend();smoke?.stop();
  if(!active&&!opening)return;openEpoch++;active=false;opening=false;panel.hidden=true;delete root.dataset.worldOpen;stage.inert=false;clearTimeout(renderTimer);cancelAnimationFrame(raf);raf=0;
  document.querySelector('[data-galaxy-toggle="purpose"]').hidden=false;
  if(mission?.status==='running'){mission.status='stopped';save();updateMission();}
  root.dispatchEvent(new CustomEvent('warm:surface-change',{detail:{mode:'film'}}));
}
$('film').addEventListener('click',()=>{close();history.replaceState(null,'','#purpose');});
$('chain').addEventListener('click',()=>{close();document.querySelector('.mast [data-open-warm-state]').click();});
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await viewport.requestFullscreen();}catch{}fit();});
document.querySelectorAll('[data-enter-warm-world]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();void open();}));
document.querySelectorAll('[data-open-warm-state]').forEach(b=>b.addEventListener('click',()=>{if(mintEntry)return;if(active||opening)close();},{capture:true}));
film.addEventListener('timeupdate',()=>{if(film.currentTime<46&&!active)autoUsed=false;if(film.currentTime>=43&&!readyPromise)void prepare().catch(()=>{});if(film.currentTime>=48&&!active&&!autoUsed&&!document.hidden)void open({automatic:true});});
window.addEventListener('hashchange',()=>{if(location.hash==='#world'){mintEntry=false;void open();}else if(location.hash==='#state'&&mintEntry){/* the observatory over the live world */}else if(active||opening){mintEntry=false;close();}});
new ResizeObserver(()=>{if(active)fit();}).observe(viewport);
new IntersectionObserver(([entry])=>{intersecting=entry.isIntersecting;if(intersecting)schedule();else{tiles?.suspend();cancelAnimationFrame(raf);raf=0;}},{threshold:.05}).observe(viewport);
document.addEventListener('visibilitychange',()=>{if(document.hidden){setLens(null);tiles?.suspend();cancelAnimationFrame(raf);raf=0;if(mission?.status==='running'){mission.status='stopped';save();updateMission();}}else schedule();});
window.addEventListener('pagehide',()=>{tiles?.suspend();if(mission?.status==='running'){mission.status='stopped';save();}});
root.spatialStudy={door:id=>{const st=stations.find(s=>s.id===id);return st?.harmony?doorOf(st):Promise.resolve(null);},snapshot:()=>({smoke:smoke?.state()??null,active,mode,stations:stations.map(s=>({id:s.id,at:s.at.slice()})),view:{...view},hover:hover?.id??null,lens:lens?{at:lens.slice(),zoom:LENS_ZOOM,radius:Math.min(112,canvas.clientWidth*.25,canvas.clientHeight*.25)}:null,selected:selected?.id??null,target,mission,tiles:tiles?.snapshot()??null,renderer:root.dataset.spatialRenderer,geometry:data?{width,height,nodes:data.nodes}:null})};
if(location.hash==='#world')void open();
