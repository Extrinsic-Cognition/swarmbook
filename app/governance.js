// Two views of one illustrated vote: the branches, radially, and the whole as
// rings (adapted from Roma Quantica's Graphus and Rosa). Every polis is one
// hexagon, the floor, filling with the stake of its seats to a line at half,
// ringed by twelve pentagons, the chairs, each the colour of its vote; a gold
// ring when seven are green. Both, and the polis seals. A polis with no floor
// yet shows the hexagon dashed. A child sits in the chair that faces it.
// This module has no wallet, network, or governance execution side effects.
import {NODES, DURATION, LADDER_NAMES, snapshot, sessionEvents} from './governance-session.mjs?v=25500';
import {skinForRung} from './orb.js';

const root = document.querySelector('[data-governance]');
if (root) {
  const NS = 'http://www.w3.org/2000/svg';
  const tree = root.querySelector('[data-governance-tree]');
  const body = root.querySelector('[data-governance-body]');
  const play = root.querySelector('[data-governance-play]');
  const replay = root.querySelector('[data-governance-replay]');
  const slider = root.querySelector('[data-governance-time]');
  const name = root.querySelector('[data-governance-name]');
  const tally = root.querySelector('[data-governance-tally]');
  const verdict = root.querySelector('[data-governance-verdict]');
  const example = root.querySelector('[data-governance-example]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const C = {paper:'#F5F0E3', line:'#B0A48C', bronze:'#8A6B3F', gold:'#C99B3F', ink:'#2B2620',
    yes:'#29E35A', no:'#EF334F', abstain:'#C9B895', await:'#E8DFC8', uncast:'#F5F0E3',
    approved:'#29E35A', rejected:'#EF334F', split:'#78EFFF', pending:'#EFE8D6',
    neutral:'#CCC0A4', leaningYes:'#7BC98A', leaningNo:'#DB7A78'};
  const LABELS = {G0:'Swarm', C1:'Counsel', P2:'Research', P1:'Build', P11:'Systems', P12:'Design', P111:'Tools'};
  const VERDICTS = {approved:'Approved', rejected:'Rejected', split:'Chambers differ'};
  const MARKS = {approved:'✓', rejected:'×', split:'≠'};
  // The branches, radially: unit 0 at the centre, every generation on its own
  // ring, siblings at one distance; the same angles as the rings view.
  const CENTRE = [400,310], RADII = [0,175,275,395], SCALE = [1.35,1,.82,.72];
  const HEX = 22, PENT = 7, RING = 40;
  const chairAngle = i => i*Math.PI/6;
  const POS = {};
  const spans = {G0:[0, Math.PI * 2]};
  const nodeRefs = {}, edgeRefs = {};
  let selected = 'G0', time = reduced.matches ? 14500 : 0, scenario = 0;
  let paused = reduced.matches, visible = false, frame = null, last = 0;
  let state = snapshot(time, scenario), disposed = false, suspended = false;
  const events = new AbortController();
  const on = (target, type, handler) => target.addEventListener(type, handler, {signal:events.signal});
  const set = (el, key, value) => {const text=String(value); if(el.getAttribute(key)!==text)el.setAttribute(key,text);};
  const content = (el, text) => {if(el.textContent!==text)el.textContent=text;};
  function svg(tag, attrs={}, parent) {
    const el=document.createElementNS(NS,tag);
    Object.entries(attrs).forEach(([key,value])=>set(el,key,value));
    if(parent)parent.append(el);
    return el;
  }
  const pt = (x,y) => `${x.toFixed(1)},${y.toFixed(1)}`;
  const regular = (cx,cy,r,n,rot) => Array.from({length:n},(_,i)=>{const a=rot+i*2*Math.PI/n;return pt(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}).join(' ');
  function assignSpans(id) {
    const node=NODES.find(n=>n.id===id), children=Object.values(node.bindings);
    if(!children.length)return;
    const [a,b]=spans[id], step=(b-a)/children.length;
    children.forEach((child,i)=>{spans[child]=[a+i*step,a+(i+1)*step];assignSpans(child);});
  }
  assignSpans('G0');
  for(const node of NODES) {
    if(node.depth===0){POS[node.id]=CENTRE;continue;}
    const [a,b]=spans[node.id],angle=(a+b)/2,r=RADII[node.depth];
    POS[node.id]=[CENTRE[0]+Math.cos(angle)*r,CENTRE[1]+Math.sin(angle)*r];
  }
  const defs=svg('defs',{},tree);
  const edges=svg('g',{'aria-hidden':'true'},tree);
  const waveDisc=svg('circle',{cx:CENTRE[0],cy:CENTRE[1],r:0,fill:C.split,'fill-opacity':0,'aria-hidden':'true','pointer-events':'none'},tree);
  const waveRing=svg('circle',{cx:CENTRE[0],cy:CENTRE[1],r:0,fill:'none',stroke:C.split,'stroke-width':3,'stroke-opacity':0,'aria-hidden':'true','pointer-events':'none'},tree);
  const treeNodes=svg('g',{},tree);
  // The propagation, at the engine's pace: the ring is born after the root's seal, reaches the
  // farthest chamber in 4.5 seconds, holds, and the tint lets go over the release.
  const WAVE={lead:450,travel:4500,hold:900,release:2600,exp:.65};
  const REACH=Math.max(...NODES.map(n=>Math.hypot(POS[n.id][0]-CENTRE[0],POS[n.id][1]-CENTRE[1])))+RING*SCALE[3]+PENT*SCALE[3]+30;
  const packets=svg('g',{'aria-hidden':'true'},tree);
  function selectable(group,id) {
    set(group,'class','governance-node'); set(group,'role','button'); set(group,'tabindex','0');
    set(group,'data-chamber',id); set(group,'aria-pressed',id===selected);
    const select=()=>{selected=id;render();};
    on(group,'click',select);
    on(group,'keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select();}});
  }
  let clipSeq=0;
  // The floor: one hexagon that fills from the bottom, yes green then no red,
  // with a dashed line at half. No floor yet: the hexagon dashed and empty.
  function floor(group,cx,cy,r,ghost) {
    const points=regular(cx,cy,r,6,Math.PI/6);
    if(ghost) {
      const outline=svg('polygon',{points,fill:'none',stroke:C.line,'stroke-width':1.2,'stroke-dasharray':'3 3'},group);
      return {outline,ghost:true};
    }
    const id=`floor-${++clipSeq}`;
    svg('polygon',{points},svg('clipPath',{id},defs));
    svg('polygon',{points,fill:C.paper},group);
    const liquid=svg('g',{'clip-path':`url(#${id})`},group);
    const top=cy-r,bottom=cy+r,height=bottom-top;
    const layers=['yes','no'].map(v=>svg('rect',{x:cx-r-2,width:r*2+4,y:bottom,height:0,fill:C[v]},liquid));
    svg('line',{x1:cx-r-2,x2:cx+r+2,y1:cy,y2:cy,stroke:C.bronze,'stroke-width':1,'stroke-dasharray':'2 2'},liquid);
    const outline=svg('polygon',{points,fill:'none',stroke:C.line,'stroke-width':1.3},group);
    return {outline,layers,bottom,height,ghost:false};
  }
  for(const node of NODES) {
    const [x,y]=POS[node.id], k=SCALE[node.depth], h=HEX*k, p=PENT*k, ring=RING*k;
    if(node.parent) {
      const [px,py]=POS[node.parent], parent=NODES.find(n=>n.id===node.parent), pk=SCALE[parent.depth];
      const chair=Number(Object.entries(parent.bindings).find(([,child])=>child===node.id)[0]);
      const a=chairAngle(chair), from=[px+Math.cos(a)*(RING*pk+PENT*pk+3),py+Math.sin(a)*(RING*pk+PENT*pk+3)];
      const dx=from[0]-x,dy=from[1]-y,d=Math.hypot(dx,dy);
      const start=[x+dx/d*(ring+p+3),y+dy/d*(ring+p+3)];
      const line=svg('path',{d:`M${pt(...start)} L${pt(...from)}`,fill:'none',stroke:C.line,'stroke-width':1.2,'stroke-dasharray':'3 6'},edges);
      edgeRefs[node.id]={line,start,end:from};
    }
    const group=svg('g',{},treeNodes);selectable(group,node.id);
    const title=svg('title',{},group);
    svg('circle',{cx:x,cy:y,r:ring+p+9,class:'selection'},group);
    const seven=svg('circle',{cx:x,cy:y,r:ring,fill:'none',stroke:C.gold,'stroke-width':1.6*k,visibility:'hidden'},group);
    const hex=floor(group,x,y,h,!node.seats);
    const bound=new Set(Object.keys(node.bindings).map(Number));
    const pents=Array.from({length:12},(_,i)=>{
      const a=chairAngle(i),cx=x+Math.cos(a)*ring,cy=y+Math.sin(a)*ring;
      return svg('polygon',{points:regular(cx,cy,p,5,a),fill:C.uncast,stroke:bound.has(i)?C.gold:C.bronze,'stroke-width':bound.has(i)?1.5*k:.9*k},group);
    });
    // The wave's tint: the same shapes again, in the verdict's colour, faded in as the ring passes.
    const burst=svg('circle',{cx:x,cy:y,r:0,fill:'none',stroke:C.gold,'stroke-width':2*k,'stroke-opacity':0,'pointer-events':'none'},group);
    const tint=svg('g',{'pointer-events':'none',opacity:0},group);
    svg('polygon',{points:regular(x,y,h,6,Math.PI/6),fill:C.split},tint);
    for(let i=0;i<12;i++){const a=chairAngle(i);svg('polygon',{points:regular(x+Math.cos(a)*ring,y+Math.sin(a)*ring,p,5,a),fill:C.split},tint);}
    const label=svg('text',{x,y:y+ring+p+(node.depth===0?26:20),class:node.depth===0?'node-name node-name--root':'node-name'},group);content(label,LABELS[node.id]);
    const mark=svg('text',{x:x+ring*.78,y:y-ring*.78,class:'node-status'},group);
    nodeRefs[node.id]={group,title,hex,pents,seven,label,mark,tint,burst,x,y,ring,p,h,dist:Math.hypot(x-CENTRE[0],y-CENTRE[1])};

  }
  const packetPool=Array.from({length:48},()=>svg('circle',{r:2.8,visibility:'hidden'},packets));
  try {
    const bb=treeNodes.getBBox();
    if(bb.width>0)set(tree,'viewBox',`${(bb.x-12).toFixed(0)} ${(bb.y-12).toFixed(0)} ${(bb.width+24).toFixed(0)} ${(bb.height+24).toFixed(0)}`);
  } catch {}
  function render() {
    state=snapshot(time,scenario);
    for(const node of NODES) {
      const s=state.nodes[node.id], ref=nodeRefs[node.id];
      const color=s.verdict?C[s.verdict]:null;
      s.seats.forEach((v,i)=>set(ref.pents[i],'fill',v==='await'?C.await:v?C[v]:C.uncast));
      const headsPass=s.yes>=7;
      set(ref.seven,'visibility',headsPass?'visible':'hidden');
      if(color)set(ref.seven,'stroke',color);else set(ref.seven,'stroke',C.gold);
      if(!ref.hex.ghost) {
        const noShare=Math.max(0,1-s.ratio-s.members.filter(v=>v===null).length/node.seats);
        const yesH=ref.hex.height*s.ratio,noH=ref.hex.height*noShare;
        set(ref.hex.layers[0],'y',ref.hex.bottom-yesH);set(ref.hex.layers[0],'height',yesH);
        set(ref.hex.layers[1],'y',ref.hex.bottom-yesH-noH);set(ref.hex.layers[1],'height',noH);
        const stakePass=s.ratio>=.51;
        set(ref.hex.outline,'stroke',color||(stakePass?C.gold:C.line));set(ref.hex.outline,'stroke-width',color||stakePass?2:1.3);
      } else set(ref.hex.outline,'stroke',color||C.line);
      content(ref.mark,s.verdict?MARKS[s.verdict]:'');
      const description=`${LABELS[node.id]}, ${LADDER_NAMES[node.rung]}. ${s.yes} of 12 chairs approve, seven needed. ${node.seats?`${Math.round(s.ratio*100)} percent of stake approves, more than half needed.`:'No floor yet, so the chairs decide.'} ${VERDICTS[s.verdict]||'Awaiting votes'}.`;
      set(ref.group,'aria-pressed',node.id===selected);set(ref.group,'aria-label',description);content(ref.title,description);
      set(ref.group,'data-verdict',s.verdict||'pending');
      if(edgeRefs[node.id]) {
        set(edgeRefs[node.id].line,'stroke',s.verdict?C[s.verdict]:C.line);
        set(edgeRefs[node.id].line,'stroke-opacity',s.verdict?1:.8);
      }
    }
    // The propagation mirrors the engine's wave when the body is there: its birth, its
    // progress and its release, read from the instance, so both sides move as one.
    // Without a body (no engine, reduced motion) the vote's clock stands in.
    let alive=false, travel=0, letGo=0, waveColor=C.split;
    if(inst) {
      const w=inst.wave;
      if(w&&w.agent&&inst.agentVoting&&inst.animT>=w.born) {
        alive=true;travel=Math.min(1,Math.max(0,(inst.animT-w.born)/inst.waveT));
        letGo=E.agentReleaseProgress(inst);waveColor=w.col||waveColor;
      }
    } else {
      const sealedAt=state.nodes.G0.sealedAt, rootVerdict=state.nodes.G0.verdict;
      const born=sealedAt===null?null:sealedAt+WAVE.lead;
      if(born!==null&&time>=born) {
        alive=true;travel=Math.min(1,Math.max(0,(time-born)/WAVE.travel));
        letGo=Math.min(1,Math.max(0,(time-(born+WAVE.travel+WAVE.hold))/WAVE.release));
        waveColor=rootVerdict?C[rootVerdict]:C.split;
      }
    }
    // The release: the engine's small burst at every chamber, and the votes let go of their
    // colour on the engine's release curve, so both sides go white at the same instant.
    let burstK=null;
    if(inst) {
      const rel=inst.agentBallot&&inst.agentBallot.release;
      if(rel&&rel.started&&inst.animT>=rel.born)burstK=Math.min(1,Math.max(0,(inst.animT-rel.born)/inst.solvDur));
    } else if(letGo>0) burstK=Math.min(1,letGo*4);
    const keep=1-letGo;
    const radius=alive?REACH*Math.pow(travel,inst?inst.waveExp:WAVE.exp):0;
    set(waveDisc,'r',radius);set(waveDisc,'fill',waveColor);set(waveDisc,'fill-opacity',alive?.07*(1-travel)*(1-letGo):0);
    set(waveRing,'r',radius);set(waveRing,'stroke',waveColor);set(waveRing,'stroke-opacity',alive&&travel<1?.9*(1-travel*.6):0);
    for(const node of NODES) {
      const ref=nodeRefs[node.id], reached=alive&&ref.dist<=radius;
      const strength=reached?.85*keep:0;
      set(ref.tint,'opacity',strength.toFixed(3));
      if(reached)for(const shape of ref.tint.children)set(shape,'fill',waveColor);
      if(edgeRefs[node.id]&&reached&&strength>0){set(edgeRefs[node.id].line,'stroke',waveColor);set(edgeRefs[node.id].line,'stroke-opacity',1);}
      // let go: the votes fade with the engine's release, the marks and the gold with them
      const fade=keep.toFixed(3);
      for(const pent of ref.pents)set(pent,'fill-opacity',fade);
      if(!ref.hex.ghost)for(const layer of ref.hex.layers)set(layer,'fill-opacity',fade);
      set(ref.seven,'stroke-opacity',fade);set(ref.mark,'opacity',fade);
      if(letGo>0){set(ref.hex.outline,'stroke',C.line);set(ref.hex.outline,'stroke-width',1.3);if(edgeRefs[node.id]){set(edgeRefs[node.id].line,'stroke',C.line);set(edgeRefs[node.id].line,'stroke-opacity',.8);}}
      if(burstK!==null&&burstK<1){set(ref.burst,'r',ref.ring*(.6+1.8*burstK));set(ref.burst,'stroke-opacity',(.8*(1-burstK)).toFixed(3));}
      else set(ref.burst,'stroke-opacity',0);
    }
    state.packets.forEach((packet,i)=>{
      if(i>=packetPool.length)return;
      const dot=packetPool[i],k=(time-packet.start)/(packet.end-packet.start);
      let x,y;
      if(packet.kind==='child') {
        const path=edgeRefs[packet.from];
        x=path.start[0]+(path.end[0]-path.start[0])*k;
        y=path.start[1]+(path.end[1]-path.start[1])*k;
      } else {
        const ref=nodeRefs[packet.to];
        if(packet.kind==='seat') {
          const a=chairAngle(packet.index),d=ref.ring+ref.p+(1-k)*26;
          x=ref.x+Math.cos(a)*d;y=ref.y+Math.sin(a)*d;
        } else {
          const a=Math.PI/12+packet.index*Math.PI/10,d=ref.h*.9+(1-k)*(ref.ring-ref.h*.9);
          x=ref.x+Math.cos(a)*d;y=ref.y+Math.sin(a)*d;
        }
      }
      set(dot,'cx',x);set(dot,'cy',y);set(dot,'r',packet.kind==='child'?4:2.6);
      set(dot,'fill',C[packet.vote]||C.gold);set(dot,'visibility','visible');
    });
    for(let i=state.packets.length;i<packetPool.length;i++)set(packetPool[i],'visibility','hidden');
    const s=state.nodes[selected], selectedNode=NODES.find(node=>node.id===selected);
    content(name,LABELS[selected]);
    content(tally,selectedNode.seats?`${s.yes} of 12 · ${Math.round(s.ratio*100)}%`:`${s.yes} of 12 · no floor yet`);
    content(verdict,VERDICTS[s.verdict]||'Awaiting votes');
    content(example,`Illustrated vote · ${scenario+1} / 3`);
    slider.value=String(Math.round(time));
    slider.style.setProperty('--progress',`${time/DURATION*100}%`);
    set(slider,'aria-valuetext',`${(time/1000).toFixed(1)} seconds of ${DURATION/1000}. ${state.phase==='sealed'?VERDICTS[state.nodes.G0.verdict]:'Voting from the outer branches inward'}.`);
    play.disabled=reduced.matches;
    content(play,paused?'Play':'Pause');
    set(play,'aria-label',`${paused?'Play':'Pause'} governance illustration`);
    root.dataset.time=time.toFixed(0);root.dataset.scenario=String(scenario);root.dataset.playing=String(!paused);
  }
  // The whole: the same seven chambers as one body with its crews in orbit,
  // drawn by the wall's engine and driven by the same illustrated vote: the
  // agents arrive, the leaves seal first, the verdict's wave runs out from the
  // origin and recolours the tree, and the bodies leave their faces.
  const E=window.PoleisEngine;
  let inst=null, ballotSeq=0;
  if(body&&E) {
    const orgs=NODES.map(n=>({n:LABELS[n.id],d:'',v:'PENDET',py:0,pn:0,pa:0,hy:0,hn:0}));
    const children={}, chairs={}, rungOf={}, skins={};
    for(const n of NODES) {
      const ch=Object.entries(n.bindings).map(([seat,to])=>({seat:Number(seat),to:LABELS[to]}));
      if(ch.length)children[LABELS[n.id]]=ch;
      chairs[LABELS[n.id]]=Array.from({length:12},(_,i)=>({kind:n.bindings[i]?'unit':'key',holder:`${n.id}:${i}`}));
      rungOf[LABELS[n.id]]=n.rung;
    }
    const EXT=E.extentOf(children,'Swarm',2.1,.5);
    inst=E.mount(body,{name:'Swarm',orgs,children,chairs,size:560,extentScale:1.12*Math.min(1,EXT/2.6),orbit:2.1,childScale:.5,tetherEnd:1.64,
      yaw0:.9,spin:.0003,seed:1077,cullOffscreen:true,driven:true,dpr:true,
      geoOf:name=>{const r=rungOf[name];if(!skins[r]){const sk=skinForRung(r);skins[r]={pents:sk.faces.slice(0,12),hexes:sk.faces.slice(12)};}return skins[r];}});
    E.setActive(inst,false);
  }
  const VERDICT_CODE={approved:'RATUM',rejected:'REIECTUM',split:'DISSENSIO'};
  function bodyEvents(from, futureOnly=false) {
    const events=[];
    for(const e of sessionEvents(scenario)) {
      if(futureOnly&&e.end<=from)continue;
      const t=Math.max(0,e.end-from);
      if(e.kind==='member')events.push({t,node:LABELS[e.to],kind:'hex',i:e.index,v:e.vote==='yes'?'gold':'red'});
      else events.push({t,node:LABELS[e.to],kind:'pent',i:e.index,v:e.vote});
    }
    const final=snapshot(DURATION,scenario);
    for(const n of NODES) {
      const s=final.nodes[n.id];
      if(s.verdict&&(!futureOnly||s.sealedAt>from))events.push({t:Math.max(0,s.sealedAt-from)+150,node:LABELS[n.id],kind:'verdict',v:VERDICT_CODE[s.verdict]});
    }
    return events;
  }
  function beginBody() {
    E.beginAgentBallot(inst,{id:`illustrated:${scenario}:${++ballotSeq}`,units:NODES.map(n=>LABELS[n.id]),preview:true});
  }
  function paintBodySnapshot(from) {
    if(!inst||disposed)return;
    E.setActive(inst,false);
    beginBody();
    E.scheduleAgentVotes(inst,bodyEvents(from,true));
    const still=snapshot(from,scenario);
    // The snapshot already knows which votes arrived. Complete those receipts
    // immediately, leaves first, so a still never needs a burst of catch-up RAF.
    for(const n of [...NODES].sort((a,b)=>b.depth-a.depth)) {
      const s=still.nodes[n.id],node=LABELS[n.id];
      for(const [kind,votes] of [['pent',s.seats],['hex',s.members]])votes.forEach((v,i)=>{
        if(!v||v==='await')return;
        E.receiveAgentVote(inst,{node,kind,i,v:kind==='hex'?(v==='yes'?'gold':'red'):v});
        const receipt=inst.agentBallot.votes.get(`${node}:${kind}:${i}`);
        if(receipt)receipt.start=inst.animT-receipt.duration;
      });
      if(s.verdict)E.setAgentVerdict(inst,node,VERDICT_CODE[s.verdict]);
    }
    // Anchor the shared aftermath to the selected vote time. A static seal
    // does not hold a blinding flash or replay earlier arrivals when resumed.
    inst.flash=null;inst.bursts=[];
    if(inst.wave?.agent) {
      inst.wave.born=inst.animT+still.nodes.G0.sealedAt+150+inst.waveLead-from;
      const release=inst.agentBallot.release;
      if(release) {
        release.born=inst.wave.born+inst.waveT+E.agentWaveHold;
        release.started=inst.animT>=release.born;
      }
    }
    E.drawOnce(inst);
  }
  function startBody(from=0) {
    if(!inst||disposed)return;
    if(reduced.matches){paintBodySnapshot(from);return;}
    beginBody();E.scheduleAgentVotes(inst,bodyEvents(from));
  }
  root.governanceBody=()=>inst;
  // Ordinary scrubbing can show the arrivals. Reduced motion paints the
  // selected snapshot immediately, using the same records as the branches.
  let scrubTimer=null, catchUpTimer=null, bodySeekPending=false;
  function clearBodyTimers() {
    clearTimeout(scrubTimer);clearTimeout(catchUpTimer);
    scrubTimer=null;catchUpTimer=null;
  }
  function syncBody() {if(inst)E.setActive(inst,!disposed&&!suspended&&!document.hidden&&visible&&!reduced.matches&&(catchUpTimer!==null||!paused));}
  function settleBodySeek() {
    if(!bodySeekPending||!inst||disposed||suspended||document.hidden||!visible)return;
    clearBodyTimers();paintBodySnapshot(time);bodySeekPending=false;render();
  }
  function scrubBody() {
    if(!inst||disposed)return;
    clearBodyTimers();bodySeekPending=true;syncBody();
    if(reduced.matches){settleBodySeek();return;}
    if(suspended||document.hidden||!visible)return;
    scrubTimer=setTimeout(()=>{
      scrubTimer=null;
      startBody(time);
      catchUpTimer=setTimeout(()=>{catchUpTimer=null;settleBodySeek();syncBody();},1800);
      syncBody();
    },180);
  }
  function stop() {if(frame!==null)cancelAnimationFrame(frame);frame=null;last=0;}
  function queue() {if(!disposed&&!suspended&&!paused&&visible&&!document.hidden&&!reduced.matches&&frame===null)frame=requestAnimationFrame(tick);}
  function tick(now) {
    frame=null;
    if(paused||!visible||document.hidden||disposed||suspended||reduced.matches){last=0;return;}
    if(last)time+=Math.min(now-last,100);
    last=now;
    if(time>DURATION){time=0;scenario=(scenario+1)%3;startBody(0);}
    render();
    queue();
  }
  on(play,'click',()=>{if(reduced.matches)return;settleBodySeek();paused=!paused;stop();render();queue();syncBody();});
  on(replay,'click',()=>{clearBodyTimers();bodySeekPending=false;time=0;paused=reduced.matches;stop();startBody(0);render();queue();syncBody();});
  on(slider,'input',()=>{paused=true;time=Number(slider.value);stop();scrubBody();render();});
  on(slider,'change',()=>{scrubBody();});
  on(document,'visibilitychange',()=>{stop();if(document.hidden)clearBodyTimers();else settleBodySeek();queue();syncBody();});
  on(reduced,'change',()=>{clearBodyTimers();bodySeekPending=false;paused=true;time=14500;stop();paintBodySnapshot(time);render();syncBody();});
  on(window,'resize',()=>{if(inst&&!disposed&&!document.hidden&&!suspended&&(paused||reduced.matches))E.drawOnce(inst);});
  const observer=new IntersectionObserver(entries=>{
    const was=visible;visible=entries.some(e=>e.isIntersecting);stop();
    if(!visible)clearBodyTimers();else settleBodySeek();
    queue();if(visible&&!was&&inst&&!inst.agentBallot)startBody(time);syncBody();
  },{threshold:.08});
  observer.observe(root.querySelector('.governance-pair'));
  on(window,'pagehide',event=>{suspended=true;stop();clearBodyTimers();syncBody();if(!event.persisted){disposed=true;observer.disconnect();events.abort();if(inst){E.unmount(inst);inst=null;}}});
  on(window,'pageshow',()=>{suspended=false;stop();settleBodySeek();queue();syncBody();});
  if(reduced.matches)paintBodySnapshot(time);
  render();
}
