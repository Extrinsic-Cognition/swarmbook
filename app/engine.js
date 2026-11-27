/* ============================ THE ENGINE ============================
 * The animation engine of the observatory, brought across whole by the
 * founder's ruling (2026-09-03: "everything except the animations; the
 * animations were perfect"). Only identifiers the membrane scrub refuses
 * were renamed; nothing in the motion changed. Sessions, particles, absent
 * seats, the bicameral seal (seven of twelve chairs AND the weight
 * majority), verdict packets riding tethers to the parent's bound seat,
 * the LOD bead law, and the seal rite: the blinding flash the instant the
 * root seals, then the spherical blast wave radiating the verdict through
 * every chamber, then the release, every chamber consuming its color back
 * to white in one simultaneous bloom.
 *
 * Everything visual is an option so consumers differ only in config. THE
 * Voting keeps its original full-frame-rate motion while visible. Consumers
 * can now pause an inactive formation for the idle energy-saver scene. The only paint
 * skip is a veiled or offscreen surface, and landings still commit under
 * it: law is not paint.
 *
 * Driven mode (added here): a consumer that knows what really happened
 * calls PoleisEngine.play(inst, events, verdicts) and the engine plays those
 * votes and seals those verdicts instead of inventing a session.
 * ============================================================================ */
(function () {
  const RQ = (window.PoleisEngine = {});

  /* ---------- geometry, verbatim from the observatory ---------- */
  RQ.buildSkin = function (dodeca=false) {
    const P = (1 + Math.sqrt(5)) / 2;
    const V = [[0,1,P],[0,1,-P],[0,-1,P],[0,-1,-P],[1,P,0],[1,-P,0],[-1,P,0],[-1,-P,0],[P,0,1],[-P,0,1],[P,0,-1],[-P,0,-1]];
    const d2=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;
    const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const len=a=>Math.hypot(a[0],a[1],a[2]);
    const norm=a=>{const l=len(a)||1;return [a[0]/l,a[1]/l,a[2]/l]};
    const centroid=pts=>{const c=[0,0,0];for(const p of pts){c[0]+=p[0];c[1]+=p[1];c[2]+=p[2]}return c.map(v=>v/pts.length)};
    const adj=V.map(()=>[]);
    for(let i=0;i<12;i++)for(let j=i+1;j<12;j++)if(Math.abs(d2(V[i],V[j])-4)<1e-6){adj[i].push(j);adj[j].push(i);}
    const tris=[];
    for(let i=0;i<12;i++)for(const j of adj[i])if(j>i)for(const k of adj[j])if(k>j&&adj[i].includes(k))tris.push([i,j,k]);
    const tp=(a,b)=>{const A=V[a],B=V[b];return [A[0]+(B[0]-A[0])/3,A[1]+(B[1]-A[1])/3,A[2]+(B[2]-A[2])/3]};
    const orderAround=(pts,axis)=>{
      const n=norm(axis);
      let u=cross(n,[0,0,1]); if(len(u)<1e-6)u=cross(n,[0,1,0]); u=norm(u);
      const w=cross(n,u), c=centroid(pts);
      return pts.slice().sort((p,q)=>{
        const pv=[p[0]-c[0],p[1]-c[1],p[2]-c[2]], qv=[q[0]-c[0],q[1]-c[1],q[2]-c[2]];
        return Math.atan2(dot(pv,w),dot(pv,u))-Math.atan2(dot(qv,w),dot(qv,u));
      });
    };
    let pents=V.map((v,i)=>({verts:orderAround(dodeca
      ? tris.filter(tri=>tri.includes(i)).map(tri=>centroid(tri.map(j=>V[j])))
      : adj[i].map(j=>tp(i,j)),v)}));
    let hexes=dodeca?[]:tris.map(([a,b,c])=>{
      const pts=[tp(a,b),tp(b,a),tp(b,c),tp(c,b),tp(c,a),tp(a,c)];
      return {verts:orderAround(pts,centroid(pts))};
    });
    let maxr=0;
    for(const f of [...pents,...hexes])for(const p of f.verts)maxr=Math.max(maxr,Math.hypot(...p));
    for(const f of [...pents,...hexes]){
      f.verts=f.verts.map(p=>p.map(v=>v/maxr));
      f.center=centroid(f.verts); f.normal=norm(f.center);
    }
    const key=f=>(-f.center[1]*10)+Math.atan2(f.center[2],f.center[0])/10;
    pents=pents.slice().sort((a,b)=>key(a)-key(b));
    hexes=hexes.slice().sort((a,b)=>key(a)-key(b));
    return {pents,hexes};
  };
  const GEO = (RQ.GEO = RQ.buildSkin());

  /* ---------- the ruin's palette ---------- */
  RQ.COLORS = {
    yes:'#29E35A', no:'#EF334F', abstain:'#C9B895', awaiting:'#F4B400',
    unsworn:'#F2EDE4', vacantP:'#DCC080', hexYes:'#D4AF37', hexNo:'#EF334F',
  };
  RQ.VERDICT_COLOR={RATUM:'#29E35A',REIECTUM:'#EF334F',DISSENSIO:'#78EFFF',PENDET:'#C4B9A2'};
  RQ.VOTE_COLOR={yes:RQ.COLORS.yes,no:RQ.COLORS.no,abstain:RQ.COLORS.abstain,absens:'#DFD8C7'};
  /* the floor counts only yes: a seat that said yes is gold, everything else
     (no, silent, unheld) keeps the paper; unheld seats add only a dashed rim */
  RQ.HEX_COLOR={gold:'#F0B90B',red:'#F3EEE4',abstain:'#C9B895',absens:'#F3EEE4',vacant:'#F3EEE4'};
  RQ.V2VOTE={RATUM:'yes',REIECTUM:'no',DISSENSIO:'abstain'};

  /* ---------- DATA: the register and the tree, the full diversity ----------
     The ruin's own grammar (apps/web CONSTITUTIONAL_CURIAE): twelve anchor
     vertices, each with a named epistemic domain. The radix binds all twelve
     on its twelve pentagon seats: the root has no free seats — the polis speaks
     only through its organs; one organ's defection deadlocks the polis. The organ
     trees are ASYMMETRIC on purpose: no chamber is a bare ball, no two trees
     rhyme. */
  /* consumers supply orgs and children; there is no canonical register here */
  RQ.CANON = { ORGS: [], CHILDREN: {} };

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function shade(hex,f){
    const n=parseInt(hex.slice(1),16);
    const r=clamp(((n>>16)&255)*f,0,255),g=clamp(((n>>8)&255)*f,0,255),b=clamp((n&255)*f,0,255);
    return `rgb(${r|0},${g|0},${b|0})`;
  }
  function hexA(hex,a){
    const n=parseInt(hex.slice(1),16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
  }
  function mixHex(a,b,k){
    const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16);
    return '#'+[16,8,0].map(s=>Math.round(((x>>s)&255)*(1-k)+((y>>s)&255)*k).toString(16).padStart(2,'0')).join('');
  }
  const rotP=(p,yaw,pitch)=>{
    const cy=Math.cos(yaw),sy=Math.sin(yaw);
    const x=p[0]*cy+p[2]*sy, z=-p[0]*sy+p[2]*cy, y=p[1];
    const cp=Math.cos(pitch),sp=Math.sin(pitch);
    return [x, y*cp-z*sp, y*sp+z*cp];
  };
  const LIGHT=[0.35,0.55,-0.75];
  const mkRnd=s=>{let x=s;return()=>((x=(x*1103515245+12345)&0x7fffffff)/0x7fffffff)};
  RQ.mkRnd=mkRnd;

  RQ.bootVotes=function(o,hexCount){
    const pv=new Array(12).fill(null), hv=new Array(hexCount==null?20:hexCount).fill(null);
    for(let i=0;i<12;i++){
      const k=(i*5)%12;
      pv[k]= i<o.py?'yes' : i<o.py+o.pn?'no' : i<o.py+o.pn+o.pa?'abstain' : null;
    }
    for(let i=0;i<hv.length;i++){
      const k=(i*7)%hv.length;
      hv[k]= i<o.hy?'gold' : i<o.hy+o.hn?'red' : null;
    }
    return {pv,hv};
  };
  RQ.subtreeOf=function(children,name,depth,parent,seat,out){
    out.push({name,depth,parent,seat});
    for(const c of (children[name]||[]))RQ.subtreeOf(children,c.to,depth+1,name,c.seat,out);
    return out;
  };
  RQ.extentOf=function(children,name,orbit,childScale){
    const ch=children[name]||[];
    if(!ch.length)return 1;
    let m=1;
    for(const c of ch)m=Math.max(m,orbit+childScale*RQ.extentOf(children,c.to,orbit,childScale));
    return m;
  };

  // Every real civilization carries twelve loops, including those whose
  // chair holder is a key or whose chair is vacant. Agent bodies are leaves;
  // only a registered child civilization brings another twelve-loop council.
  RQ.agentExtentOf=function(children,name,orbit,childScale,agentScale){
    let reach=orbit+agentScale;
    for(const c of children[name]||[])reach=Math.max(reach,
      orbit+childScale*RQ.agentExtentOf(children,c.to,orbit,childScale,agentScale));
    return reach;
  };

  /* the phase announcer vocabulary */
  const LEVEL_NAME=['radix','stratum I','stratum II','stratum III','stratum IV','stratum V'];

  /* ---------- ENGINE: mounted instances share one ticker ---------- */
  const INSTANCES=[];
  let tickerOn=false, LASTF=0;
  const page=typeof document==='undefined'?null:document;
  page?.addEventListener('visibilitychange',()=>{
    LASTF=0;
    if(!page.hidden&&!tickerOn&&INSTANCES.some(t=>!t.paused)){
      tickerOn=true;requestAnimationFrame(tick);
    }
  });

  RQ.mount=function(canvas,o){
    o=o||{};
    const orgs = o.orgs || RQ.CANON.ORGS;
    const children = o.children || RQ.CANON.CHILDREN;
    const byName = Object.fromEntries(orgs.map(x=>[x.n,x]));
    const size = o.size || canvas.width || 440;
    const orbit = o.orbit!=null?o.orbit:2.1;
    const childScale = o.childScale!=null?o.childScale:0.5;
    const EXT = RQ.extentOf(children, o.name, orbit, childScale);
    const agentScale=o.agentScale??.11;
    const inst = {
      cv:canvas, ctx:canvas.getContext('2d'), name:o.name,
      orgs, children, byName,
      size, CAM:8, F:0.40*size*8,
      orbit, childScale, agentScale,
      chairs:o.chairs||{},
      discussionFit:Math.min(1,Math.max(EXT,2.6)/RQ.agentExtentOf(children,o.name,orbit,childScale,agentScale)),
      tetherEnd: o.tetherEnd!=null?o.tetherEnd:Math.min(1.64, orbit-childScale-0.03),
      ink: o.inkScale!=null?o.inkScale:1,   /* stroke-weight scale: 1 = album, ~0.45 = talisman */
      beadAt: o.beadAt!=null?o.beadAt:7,
      dpr: !!o.dpr, dprNow:0,
      scale: o.fitReach ? o.fitReach/(0.40*size*EXT) : (o.extentScale!=null?o.extentScale:1.12)/EXT,
      yaw0: o.yaw0!=null?o.yaw0:0.9, spin: o.spin!=null?o.spin:0.00030, pitch:-0.16,
      W: o.W||2600, LAT:150, MEAN:650, PMISS:0.10, PKT:550,
      waveT: o.waveT!=null?o.waveT:4500, waveLead: o.waveLead!=null?o.waveLead:300,
      waveExp: o.waveExp!=null?o.waveExp:0.65,
      flashDur: o.flashDur!=null?o.flashDur:700,
      solvFrac: o.solvFrac!=null?o.solvFrac:0.5, solvDur: o.solvDur!=null?o.solvDur:650,
      idleMin: o.idleMin!=null?o.idleMin:2200, idleRand: o.idleRand!=null?o.idleRand:6500,
      bootDelay: o.bootDelay!=null?o.bootDelay:700,
      fpsCap: o.fpsCap||0,
      veiled: o.veiled||null, cullOffscreen: !!o.cullOffscreen,
      onChip: o.onChip||null, onStatus: o.onStatus||null, onIdle: o.onIdle||null, driven: !!o.driven, forced:null, idleTold:false,
      seed:o.seed!=null?o.seed:1077, rnd: mkRnd(o.seed!=null?o.seed:1077),
      nodes: RQ.subtreeOf(children,o.name,0,null,null,[]),
      /* the skin each chamber wears: from the chain's seat count, or the one fixed skin */
      geo:{}, geoOf: o.geoOf||null,
      st:{}, phase:'idle', tNext:null, t0:0,
      discussion:false, agentVoting:false, agentBallot:null, discussionFrom:0, discussionTo:0, discussionShiftAt:0,
      discussionViewAt:0, discussionViewYaw:0,
      wave:null, flash:null, waveNow:0,
      bursts:[], solvAt:0, solvStarted:false,
      events:[], parts:[], rings:[], animT:0, lastPaint:0, lastStat:'',
    };
    inst.maxD=Math.max(...inst.nodes.map(n=>n.depth));
    inst.maxR=inst.scale*EXT*1.02; /* world radius the IMPERIUM front must reach */
    for(const n of inst.nodes){
      const org=byName[n.name];
      inst.geo[n.name]=(inst.geoOf&&inst.geoOf(n.name))||GEO;
      const b=RQ.bootVotes(org, inst.geo[n.name].hexes.length);
      inst.st[n.name]={pv:b.pv, hv:b.hv, sealed:null, last:org.v==='PENDET'?null:org.v, alba:false};
    }
    if(!inst.dpr){canvas.width=size;canvas.height=size;}
    INSTANCES.push(inst);
    if(!tickerOn){tickerOn=true;requestAnimationFrame(tick);}
    return inst;
  };
  RQ.unmount=function(inst){const i=INSTANCES.indexOf(inst);if(i>=0)INSTANCES.splice(i,1);};
  RQ.setActive=function(inst,active){
    inst.paused=!active;
    if(active&&!tickerOn){tickerOn=true;LASTF=0;requestAnimationFrame(tick);}
  };
  RQ.discussionShiftDuration=8000;
  const inOrbit=t=>t.discussion||t.agentVoting;
  /* THE SWARM RESTS ON ITS CHAIRS (Nov 23 2026; his Sept 25 "anchored to the normals to the pentagon faces", Oct 21 "the unit1s should orbit geostationarily to the pentagons"): snap(t,on,now) eases every body of the orbit from its loop onto the normal of its own chair (on), or lets it go (off: a vote de-anchors it); snapK is how far, 0 the loop, 1 home; a pure reading of the tree's clock. chairHome: that place, r from the parent's centre. */
  RQ.snapDuration=900;
  RQ.snapK=(t,at=t.animT)=>t.snap?t.snap.from+(t.snap.to-t.snap.from)*easeAgent(clamp((at-t.snap.at)/RQ.snapDuration,0,1)):0;
  RQ.snap=function(t,on,now){const to=on?1:0,home=on?homeFit(t):t.snap||{};t.snap={at:t.animT,from:now?to:RQ.snapK(t),to,zoom:home.zoom||1,mid:home.mid||[0,0,0]};};
  /* IT COMES FORWARD AS IT COMES HOME (his "so this?" over a phone's still, the swarm a fifth of its stage): the orbit keeps the tree small to leave room for its loops; home, the loops are gone, so the tree grows until its farthest body, as the eye sees it from where the camera rests, nears the stage's edge (2.4 times at most), eased by the same k. homeFit reads that from the layout it will rest in, and the middle of the whole tree, which comes to the stage's middle with it (a chain hangs off one side of its root). */
  function homeFit(t){const was=t.snap;t.snap={at:t.animT,from:1,to:1,zoom:1,mid:[0,0,0]};const L=RQ.layoutAt(t),{yaw,pitch}=RQ.cameraAt(t),B=t.nodes.map(n=>[L[n.name].off,L[n.name].scale*1.34]);t.snap=was;
    const mid=[0,1,2].map(i=>(Math.min(...B.map(([o,r])=>o[i]-r))+Math.max(...B.map(([o,r])=>o[i]+r)))/2);
    return {mid,zoom:clamp(.9/Math.max(...B.map(([o,r])=>{const p=rotP(o.map((v,i)=>v-mid[i]),yaw,pitch);return (Math.hypot(p[0],p[1])+r)*t.CAM/(p[2]+t.CAM);})),1,2.4)};}
  const chairHome=(t,name,seat,spin,r)=>{const n0=(t.geo[name]||GEO).pents[seat].normal;return (spin?rotP(n0,spin,spin*0.6):n0).map(v=>v*r);};
  RQ.setDiscussion=function(t,active,{preserveBallot=false}={}){
    if(active&&!inOrbit(t)){
      t.discussionViewYaw=RQ.cameraAt(t).yaw;
      t.discussionViewAt=t.animT;
    }
    if(active){
      if(t.wave?.agent){t.wave=null;t.flash=null;}
      t.bursts=t.bursts.filter(b=>!b.agent);
      t.agentVoting=false;if(!preserveBallot)t.agentBallot=null;
    }
    t.discussion=!!active;
  };
  RQ.cameraAt=function(t,at=t.animT){
    return {yaw:inOrbit(t)
      ? t.discussionViewYaw+(at-t.discussionViewAt)*t.spin*.12
      : t.yaw0+at*t.spin, pitch:t.pitch};
  };
  RQ.projectPoint=function(t,point,at=t.animT){
    const {yaw,pitch}=RQ.cameraAt(t,at),p=rotP(point,yaw,pitch),perspective=t.F/(p[2]+t.CAM);
    return [t.size/2+p[0]*perspective,t.size/2-p[1]*perspective,p[2]];
  };
  RQ.shiftDiscussion=function(t){
    // Let each gentle transition finish: a second click cannot reset its velocity.
    if(t.discussionFrom!==t.discussionTo&&t.animT-t.discussionShiftAt<RQ.discussionShiftDuration)return false;
    t.discussionFrom=t.discussionTo;
    t.discussionTo+=Math.PI/6; t.discussionShiftAt=t.animT;
    return true;
  };
  RQ.drawOnce=function(t){paintInst(t,performance.now());};

  // Ballot receipts belong to a chair or a floor face, never to a random
  // particle. Re-reading the same account must not restart any agent.
  const agentVoteKey=(node,kind,i)=>`${node}:${kind}:${i}`;
  const agentChildren=(t,node)=>(t.children[node]||[]).filter(c=>t.agentBallot?.units.has(c.to));
  const agentChild=(t,node,seat)=>agentChildren(t,node).find(c=>c.seat===seat);
  RQ.beginAgentBallot=function(t,{id,units,preview=false}){
    if(t.agentBallot?.id===id){
      for(const name of units||[])if(t.st[name])t.agentBallot.units.add(name);
      t.agentVoting=true;
      return false;
    }
    if(!inOrbit(t)){
      t.discussionViewYaw=RQ.cameraAt(t).yaw;t.discussionViewAt=t.animT;
    }
    t.agentVoting=true;t.discussion=false;
    const participating=new Set((units??t.nodes.map(n=>n.name)).filter(n=>t.st[n]));
    const origin=t.nodes.filter(n=>participating.has(n.name)).sort((a,b)=>a.depth-b.depth)[0]?.name||null;
    t.agentBallot={id,preview,units:participating,origin,waveStarted:false,outcome:null,release:null,
      votes:new Map(),closed:new Set(),terminals:new Set(),verdicts:new Map(),
      resolved:new Set(),resolvedAt:new Map(),events:[],started:t.animT,idleTold:false};
    t.parts=[];t.rings=[];t.events=[];t.wave=null;t.flash=null;t.bursts=[];
    t.waveNow=0;t.solvAt=0;t.solvStarted=false;t.forced=null;t.phase='voting';
    for(const s of Object.values(t.st)){
      s.pv.fill(null);s.hv=s.hv.map(v=>v==='vacant'?'vacant':null);
      s.sealed=null;s.alba=false;
    }
    return true;
  };
  function startAgentReceipt(t,receipt,previous=null){
    const {node,kind,i,reason}=receipt;
    // A late account notification can replace inferred absence, never the
    // other way around. Preserve the body's current location on correction.
    const from=kind==='pent'&&previous?RQ.agentLoopPoint(t,node,i):null;
    const point=kind==='pent'?RQ.agentLoopPoint(t,node,i):null;
    const face=kind==='pent'?RQ.agentFacePoint(t,node,'pent',i):null;
    const angle=point?Math.acos(clamp(point.reduce((sum,v,j)=>sum+v*face[j],0)/(Math.hypot(...point)*Math.hypot(...face)),-1,1)):0;
    const duration=kind==='hex'?850:1100+650*angle/Math.PI+(reason==='vote'?0:350);
    const radiusFrom=previous?(previous.radiusFrom??1)*(1-RQ.agentLoopProgress(t,node,i)):1;
    Object.assign(receipt,{start:t.animT,duration,from,
      radiusFrom,
      hidden:!!previous&&RQ.agentLoopProgress(t,node,i)>=1});
  }
  RQ.receiveAgentVote=function(t,{node,kind,i,v,reason='vote'}){
    const b=t.agentBallot, s=t.st[node];
    if(!b||!b.units.has(node)||!s||!['pent','hex'].includes(kind))return false;
    const faces=kind==='pent'?s.pv:s.hv;
    if(!Number.isInteger(i)||i<0||i>=faces.length||faces[i]==='vacant')return false;
    const key=agentVoteKey(node,kind,i), previous=b.votes.get(key),child=kind==='pent'?agentChild(t,node,i):null;
    // EXPIRED mandates encode ABSTENTIO but mean heard-from absence. A
    // later child account can refine that meaning without inventing a vote.
    const refinement=child&&previous?.v==='abstain'&&v==='absens'&&reason==='expired-child';
    if(previous&&!refinement&&(previous.v===v||previous.reason==='vote'||previous.reason==='expired-child'))return false;
    if(!t.agentVoting){
      t.discussionViewYaw=RQ.cameraAt(t).yaw;t.discussionViewAt=t.animT;
      t.agentVoting=true;t.discussion=false;
    }
    const receipt={node,kind,i,v,reason,start:null,duration:0,from:null,radiusFrom:1,hidden:false};
    if(!child||b.resolved.has(child.to))startAgentReceipt(t,receipt,previous);
    b.votes.set(key,receipt);
    faces[i]=v;b.idleTold=false;
    resolveAgentUnits(t);
    return true;
  };
  RQ.expireAgentUnit=function(t,node,reason='deadline'){
    const b=t.agentBallot,s=t.st[node];if(!b||!b.units.has(node)||!s)return;
    // The parent's direct-vote deadline never expires a child's mandate.
    // That chair can speak after the deadline, once the child has resolved.
    for(let i=0;i<12;i++)if(s.pv[i]===null&&t.chairs[node]?.[i]?.kind!=='vacant'&&!(t.children[node]||[]).some(c=>c.seat===i))
      RQ.receiveAgentVote(t,{node,kind:'pent',i,v:'absens',reason});
    for(let i=0;i<s.hv.length;i++)if(s.hv[i]===null)
      RQ.receiveAgentVote(t,{node,kind:'hex',i,v:'absens',reason});
    b.closed.add(node);
    if(reason==='closed')b.terminals.add(node);
    resolveAgentUnits(t);
  };
  RQ.setAgentVerdict=function(t,node,verdict){
    const b=t.agentBallot;
    if(!b?.units.has(node)||!['RATUM','REIECTUM','DISSENSIO'].includes(verdict))return;
    b.verdicts.set(node,verdict);
    RQ.expireAgentUnit(t,node,'closed');
    if(b.resolved.has(node))t.st[node].sealed=verdict;
  };
  function motionFinished(t,receipt){
    return !!receipt&&Number.isFinite(receipt.start)&&t.animT>=receipt.start+receipt.duration;
  }
  function childrenFinished(t,node){
    const b=t.agentBallot;
    return agentChildren(t,node).every(c=>b.resolved.has(c.to)&&motionFinished(t,b.votes.get(agentVoteKey(node,'pent',c.seat))));
  }
  function resolveAgentUnits(t){
    const b=t.agentBallot;if(!b||b.resolving)return;
    b.resolving=true;
    try{
      // Read observations in any order; present seals from leaves inward.
      // A parent's observed seal cannot skip a missing child account/mandate.
      for(const node of [...t.nodes].sort((a,b)=>b.depth-a.depth)){
        if(!b.terminals.has(node.name)||b.resolved.has(node.name)||!childrenFinished(t,node.name))continue;
        if([...b.votes.values()].some(v=>v.node===node.name&&!motionFinished(t,v)))continue;
        b.resolved.add(node.name);b.resolvedAt.set(node.name,t.animT);
        if(b.verdicts.has(node.name))t.st[node.name].sealed=b.verdicts.get(node.name);
      }
      for(const receipt of b.votes.values())if(receipt.start===null){
        const child=agentChild(t,receipt.node,receipt.i);
        if(child&&b.resolved.has(child.to))startAgentReceipt(t,receipt);
      }
      startAgentWave(t);
      updateAgentRelease(t);
    }finally{b.resolving=false;}
  }
  RQ.agentWaveHold=900;
  function startAgentWave(t){
    const b=t.agentBallot,verdict=b?.verdicts.get(b.origin);
    if(!t.agentVoting||!b||b.waveStarted||!verdict||![...b.units].every(n=>b.resolved.has(n)))return;
    const layout=RQ.layoutAt(t),origin=layout[b.origin];
    if(!origin)return;
    b.waveStarted=true;b.outcome=verdict;
    if(b.release&&!b.release.started)b.release=null; // An observed verdict precedes any scheduled no-outcome release.
    const reach=origin.scale*RQ.agentExtentOf(t.children,b.origin,t.orbit,t.childScale,t.agentScale)*1.05;
    t.flash={born:t.animT,agent:true};
    t.wave={born:t.animT+t.waveLead,col:RQ.VERDICT_COLOR[verdict],v:verdict,
      agent:true,origin:b.origin,reach};
  }
  RQ.agentWaveActive=function(t){
    return !!(t.agentVoting&&t.wave?.agent&&t.animT<t.wave.born+t.waveT+RQ.agentWaveHold);
  };
  // Release is a shared visual rite after consensus, not another vote.
  // Keep receipts and seals intact while the same bodies leave their faces.
  RQ.agentReleaseDuration=2600;
  RQ.agentReleaseHold=1000;
  const releaseStarted=(t,node,at=t.animT)=>!!(t.agentVoting&&t.agentBallot?.release
    &&at>=t.agentBallot.release.born&&t.agentBallot.units.has(node));
  RQ.agentReleaseActive=function(t){
    const r=t.agentBallot?.release;
    return !!(t.agentVoting&&r&&t.animT>=r.born&&t.animT<r.born+r.duration+RQ.agentReleaseHold);
  };
  RQ.agentReleaseProgress=function(t,at=t.animT){
    const r=t.agentBallot?.release;
    return r?easeAgent(clamp((at-r.born)/r.duration,0,1)):0;
  };
  function updateAgentRelease(t){
    const b=t.agentBallot;
    if(!b.release&&!b.events.length&&b.units.size&&[...b.units].every(n=>b.resolved.has(n))){
      // EXPIRED is also released, without inventing an outcome shockwave.
      b.release={born:t.wave?.agent?t.wave.born+t.waveT+RQ.agentWaveHold:t.animT+RQ.agentWaveHold,
        duration:RQ.agentReleaseDuration,started:false};
    }
    const r=b.release;
    if(!r||t.animT<r.born)return;
    if(!r.started){
      r.started=true;
      const layout=RQ.layoutAt(t,r.born);
      for(const name of b.units){
        const own=layout[name].scale;
        t.bursts.push({node:name,born:r.born,dur:t.solvDur,R:own*2.4,own,agent:true});
      }
    }
    t.bursts=t.bursts.filter(burst=>!burst.agent||t.animT<burst.born+burst.dur);
  }
  RQ.agentWaveRadius=function(t,at=t.animT){
    return t.wave?.agent?t.wave.reach*Math.pow(clamp((at-t.wave.born)/t.waveT,0,1),t.waveExp):0;
  };
  function agentWaveCenter(t,at){
    const w=t.wave;
    if(w.centerAt!==at){w.center=RQ.layoutAt(t,at)[w.origin].off;w.centerAt=at;}
    return w.center;
  }
  RQ.agentWaveColorAt=function(t,node,point,at=t.animT){
    const w=t.wave;
    if(!t.agentVoting||!w?.agent||at<w.born||!t.agentBallot?.units.has(node)||releaseStarted(t,node,at))return null;
    const center=agentWaveCenter(t,at),distance=Math.hypot(...point.map((v,i)=>v-center[i]));
    return distance<=RQ.agentWaveRadius(t,at)?w.col:null;
  };
  RQ.scheduleAgentVotes=function(t,events){
    if(!t.agentBallot?.preview)return false;
    t.agentBallot.events=events.map(e=>({...e})).sort((a,b)=>a.t-b.t);
    t.agentBallot.started=t.animT;return true;
  };
  RQ.hasPendingAgentMotion=function(t){
    const b=t.agentBallot;
    return !!b&&([...b.votes.values()].some(v=>!motionFinished(t,v))
      ||[...b.terminals].some(node=>!b.resolved.has(node))
      ||[...b.closed].some(node=>!childrenFinished(t,node))||RQ.agentWaveActive(t)
      ||!!(b.release&&t.animT<b.release.born+b.release.duration+RQ.agentReleaseHold));
  };
  RQ.endAgentBallot=function(t){
    const yaw=RQ.cameraAt(t).yaw;
    t.agentVoting=false;t.phase='idle';
    if(t.wave?.agent){t.wave=null;t.flash=null;}
    t.bursts=t.bursts.filter(b=>!b.agent);
    if(t.agentBallot)t.agentBallot.events=[];
    t.yaw0=yaw-t.animT*t.spin;
  };
  function updateAgentBallot(t){
    const b=t.agentBallot;if(!b)return;
    while(b.events.length&&b.events[0].t<=t.animT-b.started){
      const e=b.events.shift();
      if(e.kind==='deadline')RQ.expireAgentUnit(t,e.node,e.reason||'deadline');
      else if(e.kind==='verdict')RQ.setAgentVerdict(t,e.node,e.v);
      else RQ.receiveAgentVote(t,e);
    }
    resolveAgentUnits(t);
    if(t.onAgentProgress){
      let voted=0,absent=0,pending=0;
      for(const node of b.units)for(let i=0;i<12;i++){
        if(t.chairs[node]?.[i]?.kind==='vacant')continue;
        const receipt=b.votes.get(agentVoteKey(node,'pent',i));
        if(!receipt)pending++;else if(receipt.reason==='vote')voted++;else absent++;
      }
      const unresolved=t.nodes.filter(n=>b.units.has(n.name)&&!b.resolved.has(n.name));
      const depth=unresolved.length?Math.max(...unresolved.map(n=>n.depth)):null;
      const blocked=[...b.votes.values()].filter(v=>v.start===null).length;
      const harmonizing=RQ.agentWaveActive(t),releasing=RQ.agentReleaseActive(t),outcome=b.outcome;
      const key=`${voted}:${absent}:${pending}:${depth}:${blocked}:${outcome}:${harmonizing}:${releasing}`;
      if(key!==b.progressKey){b.progressKey=key;t.onAgentProgress({voted,absent,pending,depth,blocked,outcome,harmonizing,releasing});}
    }
    if(b.units.size&&!b.events.length&&b.closed.size===b.units.size&&!RQ.hasPendingAgentMotion(t)&&!b.idleTold){
      b.idleTold=true;t.onIdle?.();
    }
  }

  function setChip(t,txt){if(t.onChip)t.onChip(txt);}

  function statusText(t,now){
    if(t.phase==='voting'){
      const el=now-t.t0;
      if(el<520)return 'PROPOSITIO · rogatio nova';
      const sOpen=Math.min(Math.floor(el/t.W),t.maxD);
      const depth=t.maxD-sOpen;
      const rem=Math.max(0,(sOpen+1)*t.W-el)/1000;
      return 'SUFFRAGIA · '+LEVEL_NAME[depth]+' · '+rem.toFixed(1)+'s';
    }
    if(t.phase==='imperium')return 'IMPERIUM · edictum radiat';
    if(t.solvStarted&&t.wave)return 'SOLUTIO · in album reditus';
    return 'OTIUM · actum stat';
  }

  /* a new proposal: reset the mosaic, schedule every chamber's votes.
     Leaves-first: deepest stratum opens at t=0, the root last. Bound seats
     never get an ordinary vote; their voice arrives as the child's verdict. */
  function planSession(t,now){
    const rnd=t.rnd;
    t.t0=now; t.events=[]; t.phase='voting';
    t.wave=null; t.flash=null; t.waveNow=0; /* the wipe: white is the first frame of the new propositio */
    t.bursts=[]; t.solvAt=0; t.solvStarted=false;
    setChip(t,'SUFFRAGIUM');
    for(const n of t.nodes){
      const s=t.st[n.name], o=t.byName[n.name];
      if(s.sealed){s.last=s.sealed; s.sealed=null}
      s.pv.fill(null); s.hv.fill(null); s.alba=false;
      const start=(t.maxD-n.depth)*t.W;
      const bound=new Set((t.children[n.name]||[]).map(c=>c.seat));
      const jit=v=>Math.max(0,v+((rnd()*3|0)-1));
      const seats=[]; for(let k=0;k<12;k++)if(!bound.has(k))seats.push(k);
      for(let k=seats.length-1;k>0;k--){const j=(rnd()*(k+1))|0; const q=seats[k];seats[k]=seats[j];seats[j]=q}
      let si=0;
      const pput=(count,v)=>{for(let k=0;k<count&&si<seats.length;k++,si++){
        if(rnd()<t.PMISS)continue; /* a missed vote consumes the seat: absens at close */
        t.events.push({t:start+t.LAT-Math.log(1-rnd())*t.MEAN, node:n.name, kind:'pent', i:seats[si], v});
      }};
      pput(jit(o.py),'yes'); pput(jit(o.pn),'no'); if(o.pa)pput(o.pa,'abstain');
      const H=s.hv.length;
      const hseq=[]; for(let k=0;k<H;k++)hseq.push(k);
      for(let k=H-1;k>0;k--){const j=(rnd()*(k+1))|0; const q=hseq[k];hseq[k]=hseq[j];hseq[j]=q}
      let hi=0;
      const hput=(count,v)=>{for(let k=0;k<count&&hi<H;k++,hi++){
        if(rnd()<t.PMISS)continue;
        t.events.push({t:start+t.LAT-Math.log(1-rnd())*t.MEAN, node:n.name, kind:'hex', i:hseq[hi], v});
      }};
      hput(jit(o.hy),'gold'); hput(jit(o.hn),'red');
      t.events.push({t:start+t.W, node:n.name, kind:'close'});
    }
    t.events.sort((a,b)=>a.t-b.t);
  }

  /* fenestra clausa: the silent go absens, the gate speaks, the chamber seals.
     VII/XII on the seats AND the fasces majority — both arms or no law. */
  function closeNode(t,name,now){
    const s=t.st[name]; if(s.sealed)return;
    for(let i=0;i<12;i++)if(s.pv[i]===null)s.pv[i]='absens';
    for(let i=0;i<s.hv.length;i++)if(s.hv[i]===null)s.hv[i]='absens';
    let yes=0,no=0,gold=0,red=0;
    for(const v of s.pv){if(v==='yes')yes++; else if(v==='no')no++}
    for(const v of s.hv){if(v==='gold')gold++; else if(v==='red')red++}
    const computed= yes>=7&&gold>red ? 'RATUM'
      : (no>=7||(yes<7&&gold<=red)) ? 'REIECTUM' : 'DISSENSIO';
    const verdict=(t.forced&&t.forced[name])||computed;
    s.sealed=verdict;
    const n=t.nodes.find(x=>x.name===name);
    if(n.parent){
      t.parts.push({pkt:true, from:name, toNode:n.parent, seat:n.seat,
        v:RQ.V2VOTE[verdict], vc:RQ.VERDICT_COLOR[verdict], born:now, dur:t.PKT});
    }else{
      /* the radix has spoken: FULGOR blinds the viewport at the seal
         instant, then the IMPERIUM wave is born and radiates the verdict
         spherically through every organ of the polis */
      setChip(t,verdict);
      t.phase='imperium';
      t.flash={born:now};
      t.wave={born:now+t.waveLead, col:RQ.VERDICT_COLOR[verdict], v:verdict};
    }
  }

  /* driven: the consumer hands the engine the votes that landed on chain
     and the verdicts the chain sealed; the engine plays them, nothing else */
  RQ.play=function(t,events,verdicts){
    const now=performance.now();
    t.discussion=false;t.agentVoting=false;t.agentBallot=null;
    t.parts=[]; t.rings=[]; // A new ballot cannot inherit a prior ballot's in-flight votes.
    t.t0=now; t.events=events.slice().sort((a,b)=>a.t-b.t); t.phase='voting';
    t.wave=null; t.flash=null; t.waveNow=0; t.bursts=[]; t.solvAt=0; t.solvStarted=false;
    t.forced=verdicts||{};
    setChip(t,'SUFFRAGIUM');
    for(const n of t.nodes){
      const s=t.st[n.name];
      if(s.sealed){s.last=s.sealed; s.sealed=null}
      s.pv.fill(null); s.hv.fill(null); s.alba=false;
    }
  };
  function update(t,now){
    if(t.discussion)return; // Discussion paints the same solids without casting or sealing votes.
    if(t.phase==='idle'){
      solvoStep(t,now);
      if(t.driven){ if(t.onIdle&&!t.idleTold){t.idleTold=true;t.onIdle();} return; }
      if(t.tNext===null)t.tNext=now+t.bootDelay+t.rnd()*1600;
      if(now>=t.tNext)planSession(t,now);
      return;
    }
    t.idleTold=false;
    if(t.phase==='voting'){
      const el=now-t.t0;
      while(t.events.length&&t.events[0].t<=el){
        const e=t.events.shift();
        if(e.kind==='close')closeNode(t,e.node,now);
        else t.parts.push({node:e.node, kind:e.kind, i:e.i, v:e.v, born:now,
          dur:300+t.rnd()*170, ang:t.rnd()*6.283, elv:(t.rnd()*2-1)*1.1});
      }
    }else if(t.phase==='imperium'){
      /* imperium ends when the front has reached the outermost hamlet and
         every packet has landed; clean-reset law still holds: the tree KEEPS
         the imperial color through otium, the wipe only at next propositio */
      if(!t.parts.length&&t.wave&&now>=t.wave.born+t.waveT+400){
        t.phase='idle'; t.tNext=now+t.idleMin+t.rnd()*t.idleRand;
        t.solvAt=now+(t.tNext-now)*t.solvFrac; t.solvStarted=false;
      }
    }
  }

  /* SOLUTIO: the counter-rite, ONE instant. Halfway through otium every
     chamber detonates its own concentric micro-burst SIMULTANEOUSLY —
     67 shells born on the same frame, each reaching only a little past its
     own chamber. Reach scales with the chamber, so every front crosses its
     own surface at the same normalized beat: the whole tree is consumed
     from verdict color back to white in a single synchronized bloom.
     Paint only: pv/hv/sealed stay untouched, the record is not the color. */
  function nodeScale(t,depth){let s=t.scale;for(let i=0;i<depth;i++)s*=t.childScale;return s}
  function solvoStep(t,now){
    if(t.solvAt&&!t.solvStarted&&t.wave&&now>=t.solvAt){
      t.solvStarted=true;
      for(const n of t.nodes){
        const own=nodeScale(t,n.depth);
        t.bursts.push({node:n.name, born:now, dur:t.solvDur, R:own*2.4, own});
      }
      if(t.tNext!==null)t.tNext=Math.max(t.tNext, now+t.solvDur+900);
    }
    if(!t.solvStarted)return;
    for(let i=t.bursts.length-1;i>=0;i--){
      const b=t.bursts[i], k=(now-b.born)/b.dur;
      const r=b.R*Math.pow(clamp(k,0,1),0.7);
      /* the front exits its own chamber: the color is consumed */
      if(r>=b.own*1.05)t.st[b.node].alba=true;
      if(k>=1)t.bursts.splice(i,1);
    }
    if(t.wave&&!t.bursts.length){
      let all=true;
      for(const n of t.nodes)if(!t.st[n.name].alba){all=false;break}
      if(all)t.wave=null; /* the imperial override released: the polis rests in album */
    }
  }

  /* per-frame layout of every chamber in the subtree (offsets track the spin) */
  function layoutOrg(t,LP,name,offset,scale,spin,at){
    LP[name]={off:offset, scale, spin};
    for(const c of (t.children[name]||[])){
      let relative;
      if(inOrbit(t)){
        // The child body itself follows this curve. Its orbital frame is
        // independent of both the parent's pentagon normal and its axial spin.
        relative=t.agentVoting?RQ.agentLoopPoint(t,name,c.seat,at):RQ.discussionOrbit(t,name,c.to,at);
        const k=RQ.snapK(t,at);if(k)relative=sphericalApproach(relative,chairHome(t,name,c.seat,spin,t.orbit),k);
      }else{
        const n0=(t.geo[name]||GEO).pents[c.seat].normal;
        const nl=spin?rotP(n0,spin,spin*0.6):n0;
        relative=nl.map(v=>v*t.orbit);
      }
      const position=relative.map((v,i)=>offset[i]+v*scale);
      layoutOrg(t,LP,c.to,position,scale*t.childScale,(c.to.length*1.7+c.seat)*0.9+at*(inOrbit(t)?.000065:.00045),at);
    }
  }
  RQ.layoutAt=function(t,at=t.animT){
    const k=inOrbit(t)?RQ.snapK(t,at):0,grow=1+((t.snap?.zoom||1)-1)*k,layout={};layoutOrg(t,layout,t.name,k?t.snap.mid.map(v=>-v*grow*k):[0,0,0],t.scale*(inOrbit(t)?t.discussionFit*grow:1),0,at);return layout;
  };

  /* ---- Raptor 2 (2026-09-06): the paint path keeps every number the old
     path produced, in the same operation order, and deletes the machinery
     around it: no closure per face or per curve segment, no per-frame
     re-derivation of trigonometry that does not change within a frame, no
     comparator sort of tens of thousands of closures. Ledger:
     ec-workspace/docs/poleis-engine-raptor-ledger.md ---- */
  const JOB_FACE=0, JOB_SEG=1, JOB_FN=2;
  const Z_ORIGIN=16, Z_QUANTA=134217728 /* 2^27 per unit of depth: 32 units in 2^32 steps */;
  const grow=a=>{const n=new a.constructor(a.length*2);n.set(a);return n;};
  function scratchOf(t){
    let s=t._raptor;
    if(!s)s=t._raptor={
      n:0, z:new Float64Array(2048), kind:new Uint8Array(2048), ref:new Int32Array(2048),
      keys:new Uint32Array(2048), keys2:new Uint32Array(2048), order:new Int32Array(2048), order2:new Int32Array(2048), counts:new Int32Array(256),
      faceN:0, faceXY:new Float64Array(512*12), facePts:new Uint8Array(512), faceFill:[], faceWear:[], faceLw:new Float64Array(512),
      segN:0, segXY:new Float64Array(4096*4), segColor:[], segW:new Float64Array(4096), segA:new Float64Array(4096),
      fnN:0, fns:[], pt:new Float64Array(3*256), px:new Float64Array(2*256), curve:new Float64Array(3*(RQ.discussionSegments+1)),
    };
    s.n=0;s.faceN=0;s.segN=0;s.fnN=0;
    return s;
  }
  function pushJob(s,z,kind,ref){
    const n=s.n;
    if(n===s.z.length){s.z=grow(s.z);s.kind=grow(s.kind);s.ref=grow(s.ref);s.keys=grow(s.keys);s.keys2=grow(s.keys2);s.order=grow(s.order);s.order2=grow(s.order2);}
    s.z[n]=z;s.kind[n]=kind;s.ref[n]=ref;s.n=n+1;
  }
  function pushFn(s,z,fn){
    if(s.fnN===s.fns.length)s.fns.push(fn);else s.fns[s.fnN]=fn;
    pushJob(s,z,JOB_FN,s.fnN++);
  }
  function faceSlot(s){
    const f=s.faceN;
    if(f===s.facePts.length){s.faceXY=grow(s.faceXY);s.facePts=grow(s.facePts);s.faceLw=grow(s.faceLw);}
    s.faceN=f+1;return f;
  }
  function pushSeg(s,z,ax,ay,bx,by,color,width,alpha){
    const k=s.segN;
    if(k===s.segW.length){s.segXY=grow(s.segXY);s.segW=grow(s.segW);s.segA=grow(s.segA);}
    const o=k*4;s.segXY[o]=ax;s.segXY[o+1]=ay;s.segXY[o+2]=bx;s.segXY[o+3]=by;
    s.segColor[k]=color;s.segW[k]=width;s.segA[k]=alpha;s.segN=k+1;
    pushJob(s,z,JOB_SEG,k);
  }
  /* painter's order: far to near, ties in insertion order, exactly what the
     stable comparator sort produced. Depth becomes a 32-bit quantum and a
     stable LSD radix sort (four byte passes) orders it in linear time. */
  function sortJobs(s){
    const n=s.n, z=s.z, counts=s.counts;
    let keys=s.keys, keys2=s.keys2, order=s.order, order2=s.order2;
    for(let i=0;i<n;i++){
      const q=(Z_ORIGIN-z[i])*Z_QUANTA;
      keys[i]=(q<0?0:q>4294967295?4294967295:q)>>>0;
      order[i]=i;
    }
    for(let shift=0;shift<32;shift+=8){
      counts.fill(0);
      for(let i=0;i<n;i++)counts[(keys[i]>>>shift)&255]++;
      if(n&&counts[(keys[0]>>>shift)&255]===n)continue; /* every key shares this byte: nothing moves */
      let sum=0;
      for(let b=0;b<256;b++){const c=counts[b];counts[b]=sum;sum+=c;}
      for(let i=0;i<n;i++){const k=keys[i], d=counts[(k>>>shift)&255]++;keys2[d]=k;order2[d]=order[i];}
      let tk=keys;keys=keys2;keys2=tk; let to=order;order=order2;order2=to;
    }
    return order;
  }
  /* A SEAT WEARS ITS RIDER (Nov 22 2026, polis.js): t.wear(node, face, its vote, 'hex' or 'pent') -> null, or { img, rim, dim, press }: the standard's square picture
     (dl-her-portrait.js HEX, point up) laid on the hexagon's own corners by the best affine map of the six, its up kept nearest the glass's up; a rim in a
     colour; press, a name RQ.pressAt gives back for a point inside it. No wear, nothing drawn and nothing kept. */
  const CORNERS=[[0,-460],[-398.4,-230],[-398.4,230],[0,460],[398.4,230],[398.4,-230]];
  function wear(t,ctx,p,w){ if(p.length===10){ /* A PENTAGON WEARS ITS NECROMANCER (Nov 23 2026, tree.js): five corners, the person's picture upright on the night, the top of its square (the head) kept */ let cx=0,cy=0,r=0; for(let k=0;k<5;k++){cx+=p[2*k]/5;cy+=p[2*k+1]/5;} for(let k=0;k<5;k++)r+=Math.hypot(p[2*k]-cx,p[2*k+1]-cy)/5; if(w.img){ctx.save();ctx.clip();ctx.fillStyle='#0b1626';ctx.fill();ctx.drawImage(w.img,28,0,200,200,cx-r*1.05,cy-r*.98,r*2.1,r*2.1);ctx.restore();} return; }
    let cx=0,cy=0,area=0,best=null; for(let k=0;k<6;k++){const j=(2*k+2)%12;cx+=p[2*k]/6;cy+=p[2*k+1]/6;area+=p[2*k]*p[j+1]-p[j]*p[2*k+1];}
    if(w.press)(t.presses=t.presses||[]).push({at:Array.from(p),press:w.press});
    if(w.img){
      for(let turn=0;turn<6;turn++){let a=0,b=0,c=0,d=0; for(let k=0;k<6;k++){const i=(area<0?k+turn:11-k+turn)%6,x=p[2*i]-cx,y=p[2*i+1]-cy,h=CORNERS[k];a+=x*h[0];b+=y*h[0];c+=x*h[1];d+=y*h[1];}
        const score=d-Math.abs(c)*.2; if(!best||score>best[0])best=[score,a,b,c,d];}
      const n=3*460*460; ctx.save();ctx.clip();ctx.transform(best[1]/n,best[2]/n,best[3]/n,best[4]/n,cx,cy);ctx.globalAlpha=w.dim||1;ctx.drawImage(w.img,-490,-490,980,980);ctx.restore();
    }
    if(w.rim){ctx.beginPath();for(let k=0;k<6;k++)ctx.lineTo(cx+(p[2*k]-cx)*.91,cy+(p[2*k+1]-cy)*.91);ctx.closePath();ctx.strokeStyle=w.rim;ctx.lineWidth=w.width||3;ctx.stroke();}   /* inside its own edge: the neighbours are painted after it */
  }
  RQ.pressAt=(t,x,y)=>(t.presses||[]).find(({at})=>{let hit=false;for(let i=0,j=10;i<12;j=i,i+=2)if(at[i+1]>y!==at[j+1]>y&&x<(at[j]-at[i])*(y-at[i+1])/(at[j+1]-at[i+1])+at[i])hit=!hit;return hit;})?.press??null;
  function drawJobs(t,s){
    const n=s.n, ctx=t.ctx, order=sortJobs(s); t.presses=null;
    for(let k=0;k<n;k++){
      const i=order[k], kind=s.kind[i], r=s.ref[i];
      if(kind===JOB_FACE){
        const o=r*12, np=s.facePts[r], xy=s.faceXY;
        ctx.beginPath();
        ctx.moveTo(xy[o],xy[o+1]);
        for(let p=1;p<np;p++)ctx.lineTo(xy[o+2*p],xy[o+2*p+1]);
        ctx.closePath();
        ctx.fillStyle=s.faceFill[r]; ctx.fill();
        ctx.lineWidth=s.faceLw[r]; ctx.strokeStyle='rgba(23,20,17,.55)'; ctx.stroke(); if(s.faceWear[r])wear(t,ctx,xy.subarray(o,o+2*np),s.faceWear[r]);
      }else if(kind===JOB_SEG){
        const o=r*4, xy=s.segXY;
        ctx.beginPath();ctx.moveTo(xy[o],xy[o+1]);ctx.lineTo(xy[o+2],xy[o+3]);
        ctx.strokeStyle=s.segColor[r];ctx.lineWidth=s.segW[r];ctx.globalAlpha=s.segA[r];ctx.lineCap='butt';ctx.stroke();ctx.lineCap='round';ctx.globalAlpha=1;   /* THE LOOPS END FLAT (Nov 26 2026): a loop's piece is a straight stroke with flat ends; a round end made every 4.6 px piece a curved path the GPU fills (lysa's wall: 37 fps -> 57) */
      }else s.fns[r]();
    }
    for(let i=0;i<s.fnN;i++)s.fns[i]=null;
    for(let i=0;i<s.faceN;i++)s.faceFill[i]=s.faceWear[i]=null;
    for(let i=0;i<s.segN;i++)s.segColor[i]=null;
    s.n=0;s.faceN=0;s.segN=0;s.fnN=0;
  }
  /* shade() produced one string per face per frame; the integer triple it
     truncates to is the identity of that string, so the triple is the key */
  const SHADE_INT=new Map(), SHADE_STR=new Map();
  function shadeFast(hex,f){
    let n=SHADE_INT.get(hex);
    if(n===undefined){n=parseInt(hex.slice(1),16);SHADE_INT.set(hex,n);}
    const r=clamp(((n>>16)&255)*f,0,255)|0, g=clamp(((n>>8)&255)*f,0,255)|0, b=clamp((n&255)*f,0,255)|0;
    const k=(r<<16)|(g<<8)|b;
    let s=SHADE_STR.get(k);
    if(s===undefined){if(SHADE_STR.size>8192)SHADE_STR.clear();s=`rgb(${r},${g},${b})`;SHADE_STR.set(k,s);}
    return s;
  }
  /* first node of that name, as the linear scan found it; the index follows
     the nodes array identity so a rebuilt tree rebuilds the index */
  function nodeOf(t,name){
    let m=t._nodeIndex;
    if(!m||t._nodeIndexOf!==t.nodes||t._nodeIndexLen!==t.nodes.length){
      m=t._nodeIndex=new Map();
      for(const n of t.nodes)if(!m.has(n.name))m.set(n.name,n);
      t._nodeIndexOf=t.nodes;t._nodeIndexLen=t.nodes.length;
    }
    return m.get(name);
  }
  /* a skin's faces repeat their shared vertices; index them once so a chamber
     transforms each vertex once per frame instead of once per face */
  function skinIndex(G){
    if(G._index)return G._index;
    const faces=[...G.pents,...G.hexes], seen=new Map(), xyz=[], vert=[], start=[];
    for(const f of faces){
      start.push(vert.length);
      for(const p of f.verts){
        const k=p[0]+','+p[1]+','+p[2];
        let i=seen.get(k);
        if(i===undefined){i=xyz.length/3;seen.set(k,i);xyz.push(p[0],p[1],p[2]);}
        vert.push(i);
      }
    }
    start.push(vert.length);
    return G._index={count:xyz.length/3, xyz:Float64Array.from(xyz), vert:Int32Array.from(vert), start:Int32Array.from(start), faces, pents:G.pents.length};
  }

  function drawNode(s,t,LP,name,camYaw,camPitch){
    const ctx=t.ctx, SIZE=t.size, CAM=t.CAM, F=t.F;
    const proj=(p)=>{const s=F/(p[2]+CAM);return [SIZE/2+p[0]*s,SIZE/2-p[1]*s]};
    const {off,scale,spin}=LP[name]; const st=t.st[name];
    const G=t.geo[name]||GEO;
    /* IMPERIUM override: once the blast front has swept past this chamber
       it wears the polis's verdict, whatever its own chamber sealed. SOLUTIO
       (alba) wins over everything: a whitened chamber is at rest. */
    const swept=!t.discussion&&t.wave&&Math.hypot(off[0],off[1],off[2])<=t.waveNow;
    const harmony=RQ.agentWaveColorAt(t,name,off);
    const white=st.alba||releaseStarted(t,name);
    const flat=harmony||(inOrbit(t)||white?null:(swept?t.wave.col:(st.sealed?RQ.VERDICT_COLOR[st.sealed]:null)));
    /* LOD law: a chamber projected under beadAt px is a bead — the deep
       leaves read as dust grains, honestly, not as 32 faces */
    const offR=rotP(off,camYaw,camPitch);
    const nrs=scale*F/(offR[2]+CAM);
    if(!inOrbit(t)&&nrs<t.beadAt){
      const pc=proj(offR);
      const col=flat||'#E6DFCE';
      pushFn(s,offR[2],()=>{
        ctx.beginPath();ctx.arc(pc[0],pc[1],Math.max(1.2,nrs),0,6.283);
        ctx.fillStyle=col;ctx.fill();
        ctx.lineWidth=1;ctx.strokeStyle='rgba(23,20,17,.5)';ctx.stroke();
      });
    }else{
      const ix=skinIndex(G), count=ix.count, xyz=ix.xyz;
      if(s.pt.length<3*count){s.pt=new Float64Array(3*count);s.px=new Float64Array(2*count);}
      const pt=s.pt, px=s.px;
      /* rotP(raised,spin,spin*0.6), then scale+offset, then rotP(q,camYaw,camPitch), then proj:
         the same four steps in the same order, once per shared vertex */
      const cy=Math.cos(camYaw),sy=Math.sin(camYaw),cp=Math.cos(camPitch),sp=Math.sin(camPitch);
      let scy=1,ssy=0,scp=1,ssp=0;
      if(spin){scy=Math.cos(spin);ssy=Math.sin(spin);scp=Math.cos(spin*0.6);ssp=Math.sin(spin*0.6);}
      const spinRot=(p0,p1,p2,out,o)=>{
        if(spin){
          const x=p0*scy+p2*ssy, z=-p0*ssy+p2*scy, y=p1;
          out[o]=x;out[o+1]=y*scp-z*ssp;out[o+2]=y*ssp+z*scp;
        }else{out[o]=p0;out[o+1]=p1;out[o+2]=p2;}
      };
      const tmp=[0,0,0];
      const place=(q0,q1,q2,o)=>{
        q0=q0*scale+off[0];q1=q1*scale+off[1];q2=q2*scale+off[2];
        const x=q0*cy+q2*sy, z=-q0*sy+q2*cy, y=q1;
        const wx=x, wy=y*cp-z*sp, wz=y*sp+z*cp;
        pt[o]=wx;pt[o+1]=wy;pt[o+2]=wz;
        const ps=F/(wz+CAM);
        px[(o/3)*2]=SIZE/2+wx*ps;px[(o/3)*2+1]=SIZE/2-wy*ps;
      };
      for(let v=0;v<count;v++){
        spinRot(xyz[3*v],xyz[3*v+1],xyz[3*v+2],tmp,0);
        place(tmp[0],tmp[1],tmp[2],3*v);
      }
      const lw=(name===t.name?2.2:1.5)*t.ink;
      const faces=ix.faces, vert=ix.vert, start=ix.start;
      for(let fi=0;fi<faces.length;fi++){
        const f=faces[fi], type=fi<ix.pents?'pent':'hex', idx=fi<ix.pents?fi:fi-ix.pents;
        // A floor receipt animates its actual hexagon. There is no free
        // particle with an unrelated impact point or an invented floor seat.
        const receipt=t.agentVoting&&type==='hex'?t.agentBallot.votes.get(agentVoteKey(name,'hex',idx)):null;
        const progress=receipt?clamp((t.animT-receipt.start)/receipt.duration,0,1):0;
        const lift=receipt?Math.sin(Math.PI*progress)*(receipt.reason==='vote'?.16:.08):0;
        const a=start[fi], np=start[fi+1]-a;
        const slot=faceSlot(s), fo=slot*12, fxy=s.faceXY;
        let c0=0,c1=0,c2=0;
        if(lift){
          /* a lifted face leaves the shared vertices: raise, then the same four steps */
          for(let k=0;k<np;k++){
            const p=f.verts[k];
            const r0=p[0]+f.normal[0]*lift, r1=p[1]+f.normal[1]*lift, r2=p[2]+f.normal[2]*lift;
            spinRot(r0,r1,r2,tmp,0);
            const q0=tmp[0]*scale+off[0], q1=tmp[1]*scale+off[1], q2=tmp[2]*scale+off[2];
            const x=q0*cy+q2*sy, z=-q0*sy+q2*cy, y=q1;
            const wx=x, wy=y*cp-z*sp, wz=y*sp+z*cp;
            c0+=wx;c1+=wy;c2+=wz;
            const ps=F/(wz+CAM);
            fxy[fo+2*k]=SIZE/2+wx*ps;fxy[fo+2*k+1]=SIZE/2-wy*ps;
          }
        }else{
          for(let k=0;k<np;k++){
            const v=vert[a+k];
            c0+=pt[3*v];c1+=pt[3*v+1];c2+=pt[3*v+2];
            fxy[fo+2*k]=px[2*v];fxy[fo+2*k+1]=px[2*v+1];
          }
        }
        const ctrZ=c2/np;
        spinRot(f.normal[0],f.normal[1],f.normal[2],tmp,0);
        const nx=tmp[0]*cy+tmp[2]*sy, nz=-tmp[0]*sy+tmp[2]*cy, ny=tmp[1];
        const nw0=nx, nw1=ny*cp-nz*sp, nw2=ny*sp+nz*cp;
        const lam=0.72+0.4*Math.max(0,nw0*LIGHT[0]+nw1*LIGHT[1]+nw2*LIGHT[2]);
        const mandateWaiting=t.agentVoting&&type==='pent'&&t.agentBallot.votes.get(agentVoteKey(name,'pent',idx))?.start===null;
        const base= flat ? flat
          : type==='pent' ? ((!t.discussion&&!white&&!mandateWaiting&&RQ.VOTE_COLOR[st.pv[idx]])||(idx%2?RQ.COLORS.unsworn:RQ.COLORS.vacantP))
          : ((!t.discussion&&!white&&RQ.HEX_COLOR[st.hv[idx]])||(idx%3===0?'#F3EEE4':'#FBF8F1'));
        s.facePts[slot]=np;s.faceFill[slot]=shadeFast(base,lam);s.faceLw[slot]=lw;s.faceWear[slot]=t.wear&&!flat&&nw2<-.06?t.wear(name,idx,st.hv[idx],type):null;
        pushJob(s,ctrZ,JOB_FACE,slot);
      }
    }
    for(const c of (t.children[name]||[])){
      if(!inOrbit(t)||RQ.snapK(t)>.85||(t.agentVoting&&RQ.agentLoopProgress(t,name,c.seat)>.85)){
      const n0=G.pents[c.seat].normal;
      const nl=spin?rotP(n0,spin,spin*0.6):n0;
      const A=rotP([off[0]+nl[0]*1.02*scale,off[1]+nl[1]*1.02*scale,off[2]+nl[2]*1.02*scale],camYaw,camPitch);
      const B=rotP([off[0]+nl[0]*t.tetherEnd*scale,off[1]+nl[1]*t.tetherEnd*scale,off[2]+nl[2]*t.tetherEnd*scale],camYaw,camPitch);
      const pa=proj(A), pb=proj(B);
      const cs=t.st[c.to];
      let tint=cs.sealed?RQ.VERDICT_COLOR[cs.sealed]:cs.last?RQ.VERDICT_COLOR[cs.last]:'#C4B9A2';
      const co=LP[c.to].off;
      if(cs.alba||releaseStarted(t,c.to))tint='#C4B9A2';
      else if(t.wave?.agent)tint=RQ.agentWaveColorAt(t,c.to,co)||tint;
      else if(t.wave&&Math.hypot(co[0],co[1],co[2])<=t.waveNow)tint=t.wave.col;
      const dw=2*t.ink, dash=Math.max(2,Math.round(7*t.ink));
      pushFn(s,(A[2]+B[2])/2,()=>{
        ctx.strokeStyle=tint; ctx.globalAlpha=0.55; ctx.lineWidth=dw;
        ctx.setLineDash([dash,dash]);
        ctx.beginPath();ctx.moveTo(pa[0],pa[1]);ctx.lineTo(pb[0],pb[1]);ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha=1;
      });
      }
      drawNode(s,t,LP,c.to,camYaw,camPitch);
    }
  }

  /* law is not paint: a landing commits whether or not anyone is looking */
  function commitLanding(t,p){
    if(p.pkt){t.st[p.toNode].pv[p.seat]=p.v; return p.vc}
    const s=t.st[p.node];
    if(s.sealed)return '#A79A82'; /* serum: landed after the seal, not counted */
    if(p.kind==='pent')s.pv[p.i]=p.v; else s.hv[p.i]=p.v;
    return p.kind==='pent'?RQ.VOTE_COLOR[p.v]:RQ.HEX_COLOR[p.v];
  }

  // Spherical Lissajous, frequency ratio 3:2, with the pole on the y axis.
  // See W. Erb, https://arxiv.org/abs/1802.06546, section 2.
  // Integer harmonics close the curve. Rigid rotations preserve its sphere,
  // including throughout a change of inclination; no Cartesian morphing.
  const TAU=Math.PI*2;
  const DISCUSSION_COLORS=['#AD8543','#4E8B81','#B39868','#718996'];
  RQ.discussionSegments=256;
  RQ.discussionPeriod=84000;
  function lissajousUnit(u){
    const polar=Math.sin(2*u);
    return [polar*Math.cos(3*u),Math.cos(2*u),polar*Math.sin(3*u)];
  }
  RQ.discussionPoint=function(lane,u,time,shift=0){
    const radius=1.94+lane*.035;
    const tilt=[-.34,.68,-.82,.28][lane%4]+.38*Math.sin(shift);
    const azimuth=lane*Math.PI*.43+time*.004+shift*.6;
    const p=lissajousUnit(u), c=Math.cos(tilt), s=Math.sin(tilt);
    const y=p[1]*c-p[2]*s, z=p[1]*s+p[2]*c;
    const ca=Math.cos(azimuth), sa=Math.sin(azimuth);
    return [(p[0]*ca+z*sa)*radius,y*radius,(-p[0]*sa+z*ca)*radius];
  };

  // One arc-length table serves all rigidly rotated copies. Uniform distance
  // avoids rushing at the equator and hesitating at each polar crossing.
  const ARC_STEPS=1024, ARC=[0];
  const curveSpeed=u=>Math.sqrt(4+9*Math.sin(2*u)**2);
  for(let i=1;i<=ARC_STEPS;i++){
    const a=(i-1)*TAU/ARC_STEPS, b=i*TAU/ARC_STEPS;
    ARC.push(ARC[i-1]+(b-a)*(curveSpeed(a)+4*curveSpeed((a+b)/2)+curveSpeed(b))/6);
  }
  function phaseAtDistance(turns){
    const fraction=((turns%1)+1)%1, distance=fraction*ARC[ARC_STEPS];
    let lo=0, hi=ARC_STEPS;
    while(hi-lo>1){const mid=(lo+hi)>>1;if(ARC[mid]<=distance)lo=mid;else hi=mid;}
    return (lo+(distance-ARC[lo])/(ARC[hi]-ARC[lo]))*TAU/ARC_STEPS;
  }
  function discussionShift(t,at){
    const k=clamp((at-t.discussionShiftAt)/RQ.discussionShiftDuration,0,1);
    const blend=k*k*k*(k*(k*6-15)+10);
    return t.discussionFrom+(t.discussionTo-t.discussionFrom)*blend;
  }
  RQ.discussionLoops=function(t,parent){
    const children=t.children[parent]||[];
    return Array.from({length:12},(_,seat)=>{
      const child=children.find(c=>c.seat===seat)?.to||null;
      const chair=t.chairs[parent]?.[seat];
      return {id:parent+':chair:'+seat,parent,seat,child,
        kind:child?'unit':chair?.kind||'key',holder:chair?.holder||null};
    });
  };
  /* the seed is a pure function of the name; it was re-hashed on every call */
  const SEEDS=new Map();
  const seedOf=parent=>{
    let v=SEEDS.get(parent);
    if(v===undefined){v=Array.from(parent).reduce((v,c)=>(v*31+c.charCodeAt(0))%65521,0)/65521;SEEDS.set(parent,v);}
    return v;
  };
  RQ.discussionLoopPhase=function(t,parent,seat,at=t.animT){
    return phaseAtDistance(at/RQ.discussionPeriod+seat/12+seedOf(parent)*.18);
  };
  RQ.discussionLoopOrbit=function(t,parent,seat,at=t.animT,u){
    const phase=u===undefined?RQ.discussionLoopPhase(t,parent,seat,at):u;
    const depth=nodeOf(t,parent)?.depth||0;
    return RQ.discussionPoint(seat%4,phase,at/1000+depth*.7,discussionShift(t,at))
      .map(v=>v*t.orbit/2.1);
  };
  RQ.agentFacePoint=function(t,node,kind,i){
    const face=(kind==='pent'?t.geo[node]?.pents:t.geo[node]?.hexes)?.[i];
    return face?[0,1,2].map(axis=>face.verts.reduce((sum,p)=>sum+p[axis],0)/face.verts.length):[0,0,0];
  };
  const easeAgent=k=>k*k*k*(k*(k*6-15)+10);
  RQ.agentLoopProgress=function(t,parent,seat,at=t.animT){
    if(!t.agentVoting)return 0;
    const receipt=t.agentBallot?.votes.get(agentVoteKey(parent,'pent',seat));
    const arrival=receipt&&Number.isFinite(receipt.start)?easeAgent(clamp((at-receipt.start)/receipt.duration,0,1)):0;
    return arrival*(releaseStarted(t,parent,at)?1-RQ.agentReleaseProgress(t,at):1);
  };
  function sphericalApproach(a,b,k){
    if(k<=0)return a.slice();if(k>=1)return b.slice();
    const ar=Math.hypot(...a),br=Math.hypot(...b),u=a.map(v=>v/ar),v=b.map(x=>x/br);
    const dot=clamp(u.reduce((sum,x,i)=>sum+x*v[i],0),-1,1),angle=Math.acos(dot);
    let direction;
    if(dot>.9995)direction=u.map((x,i)=>x*(1-k)+v[i]*k);
    else if(dot<-.9995){
      const axis=Math.abs(u[1])<.9?[0,1,0]:[1,0,0];
      const projection=axis.reduce((sum,x,i)=>sum+x*u[i],0);
      let side=v.map((x,i)=>x-u[i]*dot),len=Math.hypot(...side);
      if(len<1e-8){side=axis.map((x,i)=>x-u[i]*projection);len=Math.hypot(...side);}
      direction=u.map((x,i)=>x*Math.cos(angle*k)+side[i]/len*Math.sin(angle*k));
    }else direction=u.map((x,i)=>(x*Math.sin((1-k)*angle)+v[i]*Math.sin(k*angle))/Math.sin(angle));
    const radius=ar+(br-ar)*k,len=Math.hypot(...direction);
    return direction.map(x=>x*radius/len);
  }
  RQ.agentLoopPoint=function(t,parent,seat,at=t.animT){
    const receipt=t.agentVoting&&t.agentBallot?.votes.get(agentVoteKey(parent,'pent',seat));
    const from=receipt?.from||RQ.discussionLoopOrbit(t,parent,seat,at);
    if(!receipt)return from;
    const n=nodeOf(t,parent);
    const spin=n?.parent?(parent.length*1.7+n.seat)*.9+at*.000065:0;
    const child=(t.children[parent]||[]).some(c=>c.seat===seat);
    const point=child?t.geo[parent].pents[seat].normal.map(v=>v*t.orbit):RQ.agentFacePoint(t,parent,'pent',seat);
    const target=spin?rotP(point,spin,spin*.6):point;
    if(releaseStarted(t,parent,at)){
      const r=t.agentBallot.release,k=clamp((at-r.born)/r.duration,0,1);
      const orbit=RQ.discussionLoopOrbit(t,parent,seat,at);
      if(child)return sphericalApproach(target,orbit,easeAgent(k));
      // First emerge along this exact face normal; only then join the live
      // spherical path. Smooth endpoints preserve orbital velocity on exit.
      const radius=Math.hypot(...target),mouth=target.map(v=>v*(radius+.35)/radius);
      return k<.3?sphericalApproach(target,mouth,easeAgent(k/.3))
        :sphericalApproach(mouth,orbit,easeAgent((k-.3)/.7));
    }
    return sphericalApproach(from,target,RQ.agentLoopProgress(t,parent,seat,at));
  };
  function childChair(t,parent,child){
    const binding=(t.children[parent]||[]).find(c=>c.to===child);
    if(!binding)throw new Error('discussion orbit requires a real child');
    return binding.seat;
  }
  RQ.discussionPhase=function(t,parent,child,at=t.animT){
    return RQ.discussionLoopPhase(t,parent,childChair(t,parent,child),at);
  };
  // A child civilization occupies its chair's one loop, with its own mesh.
  // Its path is exactly the same path that a key-held chair would follow.
  RQ.discussionOrbit=function(t,parent,child,at=t.animT,u){
    return RQ.discussionLoopOrbit(t,parent,childChair(t,parent,child),at,u);
  };
  RQ.discussionLoopsAt=function(t,parent,layout=RQ.layoutAt(t),at=t.animT){
    const L=layout[parent];
    return RQ.discussionLoops(t,parent).map(loop=>{
      if(loop.child)return {...loop,...layout[loop.child],shape:'polyhedron',geo:t.geo[loop.child]};
      const progress=RQ.agentLoopProgress(t,parent,loop.seat,at);
      const receipt=t.agentVoting&&t.agentBallot?.votes.get(agentVoteKey(parent,'pent',loop.seat));
      const k=RQ.snapK(t,at),loopAt=t.agentVoting?RQ.agentLoopPoint(t,parent,loop.seat,at):RQ.discussionLoopOrbit(t,parent,loop.seat,at);
      const relative=k?sphericalApproach(loopAt,chairHome(t,parent,loop.seat,L.spin,1.22),k):loopAt;
      const release=t.agentBallot?.release;
      const emerging=receipt&&releaseStarted(t,parent,at);
      const radius=emerging?easeAgent(clamp((at-release.born)/(release.duration*.3),0,1))
        :receipt?.hidden?0:(receipt?.radiusFrom??1)*(1-progress);
      return {...loop,off:relative.map((v,i)=>L.off[i]+v*L.scale),
        scale:L.scale*t.agentScale*radius,progress,receipt,shape:'sphere',geo:null};
    });
  };

  function drawAgent(s,t,loop,yaw,pitch){
    if(loop.scale<.00001)return;
    const ctx=t.ctx, center=rotP(loop.off,yaw,pitch);
    const perspective=t.F/(center[2]+t.CAM);
    const x=t.size/2+center[0]*perspective, y=t.size/2-center[1]*perspective;
    const radius=loop.scale*perspective;
    // One basic agent is a smooth ball. Only a child civilization has a
    // polyhedral skin. The ball keeps its loop's 3D depth and perspective.
    pushFn(s,center[2]-loop.scale,()=>{
      const light=ctx.createRadialGradient(x+radius*.28,y-radius*.34,radius*.04,x,y,radius);
      const route=DISCUSSION_COLORS[loop.seat%4];
      const releasing=releaseStarted(t,loop.parent);
      const color=releasing?mixHex('#FFFDF7',route,easeAgent(clamp((t.animT-t.agentBallot.release.born)/900,0,1)))
        :RQ.agentWaveColorAt(t,loop.parent,loop.off)||(loop.receipt?mixHex(route,RQ.VOTE_COLOR[loop.receipt.v]||route,Math.min(1,(t.animT-loop.receipt.start)/450)):route);
      const colors=['#FFFDF7',shade(color,1.35),color,shade(color,.60)];
      for(const [i,stop] of [0,.38,.78,1].entries())light.addColorStop(stop,colors[i]);
      ctx.beginPath();ctx.arc(x,y,radius,0,TAU);
      ctx.fillStyle=light;ctx.fill();ctx.lineWidth=Math.max(.65,1.1*t.ink);
      ctx.strokeStyle=shade(color,.55);ctx.stroke();
      if(!releasing&&loop.receipt&&loop.receipt.reason!=='vote'){
        ctx.setLineDash([1.5,2]);ctx.strokeStyle=hexA('#8F8777',.7*(1-loop.progress));
        ctx.beginPath();ctx.arc(x,y,radius+2.5*t.ink,0,TAU);ctx.stroke();ctx.setLineDash([]);
      }
    });
  }

  /* the unit curve is sampled on a fixed grid: one table per segment count */
  const LU_TABLES=new Map();
  function lissajousTable(count){
    let LU=LU_TABLES.get(count);
    if(LU)return LU;
    LU=new Float64Array(3*(count+1));
    for(let i=0;i<=count;i++){const u=i*TAU/count,p=lissajousUnit(u);LU[3*i]=p[0];LU[3*i+1]=p[1];LU[3*i+2]=p[2];}
    if(LU_TABLES.size>32)LU_TABLES.clear();
    LU_TABLES.set(count,LU);return LU;
  }
  const TILTS=[-.34,.68,-.82,.28];
  /* |atan2(sin d, cos d)| is the wrapped angular distance; the wrap is
     arithmetic (differs from the trigonometric form only in the last bits) */
  const angDist=d=>Math.abs(d-TAU*Math.round(d/TAU));
  function drawDiscussion(s,t,LP,yaw,pitch){
    const F=t.F, CAM=t.CAM, half=t.size/2, at=t.animT, ink=t.ink;
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
    const shift=discussionShift(t,at), sinShift=Math.sin(shift);
    for(const node of t.nodes){
      const L=LP[node.name], C=rotP(L.off,yaw,pitch);
      const loops=RQ.discussionLoopsAt(t,node.name,LP);
      for(const loop of loops)if(!loop.child)drawAgent(s,t,loop,yaw,pitch);
      const projected=L.scale*F/(C[2]+CAM);
      if(projected<8)continue; // Only ink can fade at small scales; all twelve bodies remain.
      const depth=nodeOf(t,node.name)?.depth||0, time=at/1000+depth*.7;
      const sc=L.scale, ox=L.off[0], oy=L.off[1], oz=L.off[2], Cz=C[2], depthK=node.depth?.72:1;
      const count=t.dprNow&&t.dprNow<1?Math.max(32,Math.ceil(RQ.discussionSegments*t.dprNow/32)*32):RQ.discussionSegments, LUT=lissajousTable(count);   /* THE LOOP IS ITS OWN SIZE (Nov 26 2026): a loop is cut for the pixels it is shown on, its 256 pieces at 440 units, 64 at a 110 px tile (lysa's wall: 19k strokes a frame, her GPU 99.5 % busy) */
      if(s.curve.length<3*(count+1))s.curve=new Float64Array(3*(count+1));
      const curve=s.curve;
      // Four shared spherical curves, three loops per curve. A bound child
      // already draws once in drawNode; a key-held loop draws once above.
      for(let lane=0;lane<4;lane++){
        const color=RQ.agentWaveColorAt(t,node.name,L.off)||DISCUSSION_COLORS[lane];
        const presence=(1-(RQ.agentLoopProgress(t,node.name,lane)+RQ.agentLoopProgress(t,node.name,lane+4)+RQ.agentLoopProgress(t,node.name,lane+8))/3)*(1-RQ.snapK(t,at));
        if(presence<.001)continue;
        const ph0=RQ.discussionLoopPhase(t,node.name,lane), ph1=RQ.discussionLoopPhase(t,node.name,lane+4), ph2=RQ.discussionLoopPhase(t,node.name,lane+8);
        /* RQ.discussionPoint(lane,u,time,shift), then *t.orbit/2.1, then
           *L.scale+L.off, then rotP(yaw,pitch): the same steps in the same
           order for every grid point, with the per-lane trigonometry hoisted */
        const radius=1.94+lane*.035;
        const tilt=TILTS[lane%4]+.38*sinShift;
        const azimuth=lane*Math.PI*.43+time*.004+shift*.6;
        const c=Math.cos(tilt), sn=Math.sin(tilt), ca=Math.cos(azimuth), sa=Math.sin(azimuth);
        for(let i=0;i<=count;i++){
          const p0=LUT[3*i],p1=LUT[3*i+1],p2=LUT[3*i+2];
          const y=p1*c-p2*sn, z=p1*sn+p2*c;
          const v0=(p0*ca+z*sa)*radius, v1=y*radius, v2=(-p0*sa+z*ca)*radius;
          const q0=v0*t.orbit/2.1*sc+ox, q1=v1*t.orbit/2.1*sc+oy, q2=v2*t.orbit/2.1*sc+oz;
          const x=q0*cy+q2*sy, zz=-q0*sy+q2*cy;
          curve[3*i]=x;curve[3*i+1]=q1*cp-zz*sp;curve[3*i+2]=q1*sp+zz*cp;
        }
        for(let i=0;i<count;i++){
          const u=i*TAU/count, o=3*i;
          const ax=curve[o],ay=curve[o+1],az=curve[o+2],bx=curve[o+3],by=curve[o+4],bz=curve[o+5];
          const front=clamp(.5-((az+bz)/2-Cz)/(sc*3.5),0,1);
          const distance=Math.min(angDist(u-ph0),angDist(u-ph1),angDist(u-ph2));
          const proximity=Math.exp(-distance*distance/.12);
          const sA=F/(az+CAM), sB=F/(bz+CAM);
          pushSeg(s,(az+bz)/2,half+ax*sA,half-ay*sA,half+bx*sB,half-by*sB,color,
            (.8+front*.65+proximity*.4)*ink*depthK,(.16+front*.34+proximity*.16)*presence);
        }
      }
    }
  }

  function drawTile(t,now){
    const ctx=t.ctx, SIZE=t.size, CAM=t.CAM, F=t.F;
    const proj=(p)=>{const s=F/(p[2]+CAM);return [SIZE/2+p[0]*s,SIZE/2-p[1]*s]};
    const {yaw,pitch}=RQ.cameraAt(t);
    ctx.clearRect(0,0,SIZE,SIZE);
    /* IMPERIUM front position: blast-decelerating (waveExp<1) — quick out
       of the radix, then a visible crawl through the orbits toward the
       hamlets; clamps at maxR and holds imperial through all of otium */
    t.waveNow=t.wave?.agent?RQ.agentWaveRadius(t):t.wave?t.maxR*Math.pow(clamp((now-t.wave.born)/t.waveT,0,1),t.waveExp):0;
    const LP=RQ.layoutAt(t);
    const s=scratchOf(t);
    drawNode(s,t,LP,t.name,yaw,pitch);
    if(inOrbit(t))drawDiscussion(s,t,LP,yaw,pitch);
    drawJobs(t,s);
    t.onSceneFrame?.(t,LP);
    if(inOrbit(t)){
      if(t.agentVoting){drawReleaseEffects(t,LP,t.animT);drawVerdictEffects(t,LP,t.animT);}
      return;
    }

    /* particles: born on the containing sphere (1.7x), law commits at 1.02x.
       Verdict packets ride from the sealed child to the parent's bound seat. */
    for(let k=t.parts.length-1;k>=0;k--){
      const p=t.parts[k], kk=(now-p.born)/p.dur;
      let A,B,scl,col;
      if(p.pkt){
        const Lf=LP[p.from], Lt=LP[p.toNode];
        const n0=(t.geo[p.toNode]||GEO).pents[p.seat].normal;
        const nl=Lt.spin?rotP(n0,Lt.spin,Lt.spin*0.6):n0;
        B=[Lt.off[0]+nl[0]*1.02*Lt.scale, Lt.off[1]+nl[1]*1.02*Lt.scale, Lt.off[2]+nl[2]*1.02*Lt.scale];
        const d=[B[0]-Lf.off[0],B[1]-Lf.off[1],B[2]-Lf.off[2]];
        const dl=Math.hypot(d[0],d[1],d[2])||1;
        A=[Lf.off[0]+d[0]/dl*1.05*Lf.scale, Lf.off[1]+d[1]/dl*1.05*Lf.scale, Lf.off[2]+d[2]/dl*1.05*Lf.scale];
        scl=Lt.scale; col=p.vc;
      }else{
        const L=LP[p.node];
        const dir=[Math.cos(p.elv)*Math.cos(p.ang), Math.sin(p.elv), Math.cos(p.elv)*Math.sin(p.ang)];
        A=[L.off[0]+dir[0]*1.7*L.scale, L.off[1]+dir[1]*1.7*L.scale, L.off[2]+dir[2]*1.7*L.scale];
        B=[L.off[0]+dir[0]*1.02*L.scale, L.off[1]+dir[1]*1.02*L.scale, L.off[2]+dir[2]*1.02*L.scale];
        scl=L.scale; col=p.kind==='pent'?RQ.VOTE_COLOR[p.v]:RQ.HEX_COLOR[p.v];
      }
      const Br=rotP(B,yaw,pitch);
      const rs=scl*F/(Br[2]+CAM);
      const P=r=>{
        const w=[A[0]+(B[0]-A[0])*r, A[1]+(B[1]-A[1])*r, A[2]+(B[2]-A[2])*r];
        const rw=rotP(w,yaw,pitch);
        return proj(rw);
      };
      if(kk>=1){
        const q=P(1);
        col=commitLanding(t,p);
        t.rings.push({x:q[0],y:q[1],col,rs,born:now});
        t.parts.splice(k,1); continue;
      }
      const a=P(kk), b=P(Math.max(0,kk-0.18));
      ctx.strokeStyle=col; ctx.globalAlpha=p.pkt?.5:.22; ctx.lineWidth=(p.pkt?2:1.2)*t.ink;
      ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(a[0],a[1]);ctx.stroke();
      ctx.globalAlpha=p.pkt?1:.9;
      ctx.fillStyle=col;
      ctx.beginPath();ctx.arc(a[0],a[1],Math.max(1.8*t.ink,rs*0.05),0,6.283);ctx.fill();
      ctx.globalAlpha=1;
    }
    for(let k=t.rings.length-1;k>=0;k--){
      const r=t.rings[k], kr=(now-r.born)/240;
      if(kr>=1){t.rings.splice(k,1);continue}
      ctx.strokeStyle=r.col; ctx.globalAlpha=.4*(1-kr); ctx.lineWidth=2*t.ink;
      ctx.beginPath();ctx.arc(r.x,r.y,Math.max(2,r.rs*(0.14+kr*0.4)),0,6.283);ctx.stroke();
      ctx.globalAlpha=1;
    }

    drawReleaseEffects(t,LP,now);

    drawVerdictEffects(t,LP,now);
  }

  function drawReleaseEffects(t,LP,now){
    const ctx=t.ctx,SIZE=t.size,CAM=t.CAM,F=t.F;
    const {yaw,pitch}=RQ.cameraAt(t);
    const proj=p=>{const s=F/(p[2]+CAM);return [SIZE/2+p[0]*s,SIZE/2-p[1]*s]};
    /* SOLUTIO shells: the micro-bursts of the release, parchment glass with
       a white rim, each centered on its detonating chamber */
    for(const b of t.bursts){
      const L=LP[b.node]; if(!L)continue;
      const bk=clamp((now-b.born)/b.dur,0,1);
      if(bk<=0||bk>=1)continue;
      const r=b.R*Math.pow(bk,0.7);
      const C=rotP(L.off,yaw,pitch);
      const pc=proj(C), prs=Math.max(1.5,r*F/(C[2]+CAM));
      if(b.agent){
        const glow=ctx.createRadialGradient(pc[0],pc[1],0,pc[0],pc[1],Math.max(1.5,b.own*1.8*F/(C[2]+CAM)));
        const flash=Math.sin(Math.PI*Math.pow(bk,.6));
        glow.addColorStop(0,`rgba(255,255,255,${(.95*flash).toFixed(3)})`);
        glow.addColorStop(.55,`rgba(255,255,255,${(.8*flash).toFixed(3)})`);
        glow.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle=glow;ctx.beginPath();
        ctx.arc(pc[0],pc[1],Math.max(1.5,b.own*1.8*F/(C[2]+CAM)),0,TAU);ctx.fill();
      }
      const g=ctx.createRadialGradient(pc[0],pc[1],prs*0.62,pc[0],pc[1],prs);
      g.addColorStop(0,'rgba(0,0,0,0)');
      g.addColorStop(0.7,`rgba(255,255,255,${(0.30*(1-bk)).toFixed(3)})`);
      g.addColorStop(1,hexA('#C4B9A2',0.28*(1-bk)));
      ctx.fillStyle=g;
      ctx.beginPath();ctx.arc(pc[0],pc[1],prs,0,6.283);ctx.fill();
      ctx.strokeStyle='#FFFFFF'; ctx.globalAlpha=0.7*(1-bk);
      ctx.lineWidth=Math.max(0.8,2.2*t.ink);
      ctx.beginPath();ctx.arc(pc[0],pc[1],prs,0,6.283);ctx.stroke();
      ctx.strokeStyle='rgba(23,20,17,.35)'; ctx.globalAlpha=(1-bk);
      ctx.lineWidth=Math.max(0.5,0.8*t.ink);
      ctx.beginPath();ctx.arc(pc[0],pc[1],prs*1.02,0,6.283);ctx.stroke();
      ctx.globalAlpha=1;
    }

  }

  // Shared with the original formation: the final flash and expanding
  // verdict shell still run after the orbital voting bodies have painted.
  function drawVerdictEffects(t,LP,now){
    const ctx=t.ctx,SIZE=t.size,CAM=t.CAM,F=t.F;
    const {yaw,pitch}=RQ.cameraAt(t);
    const center=t.wave?.agent?rotP(LP[t.wave.origin].off,yaw,pitch):[0,0,0];
    const perspective=F/(center[2]+CAM);
    const cx=SIZE/2+center[0]*perspective,cy=SIZE/2-center[1]*perspective;
    /* IMPERIUM shell: the visible spherical front, verdict-colored glass
       with a white-hot rim, drawn only while the blast is still travelling */
    if(t.wave){
      const wk=clamp((now-t.wave.born)/t.waveT,0,1);
      if(wk>0&&wk<1){
        const rs=t.waveNow*perspective;
        const g=ctx.createRadialGradient(cx,cy,Math.max(0,rs*0.80),cx,cy,rs);
        g.addColorStop(0,'rgba(0,0,0,0)');
        g.addColorStop(0.72,hexA(t.wave.col,0.10*(1-wk*0.5)));
        g.addColorStop(1,hexA(t.wave.col,0.34*(1-wk*0.55)));
        ctx.fillStyle=g;
        ctx.beginPath();ctx.arc(cx,cy,rs,0,6.283);ctx.fill();
        ctx.strokeStyle=t.wave.col; ctx.globalAlpha=0.65*(1-wk*0.7);
        ctx.lineWidth=Math.max(1,(5-3.5*wk)*t.ink*2);
        ctx.beginPath();ctx.arc(cx,cy,rs,0,6.283);ctx.stroke();
        ctx.strokeStyle='#FFFFFF'; ctx.globalAlpha=0.35*(1-wk);
        ctx.lineWidth=Math.max(0.6,1.6*t.ink);
        ctx.beginPath();ctx.arc(cx,cy,rs*0.985,0,6.283);ctx.stroke();
        ctx.globalAlpha=1;
      }
    }

    /* FULGOR: the seal instant blinds the viewport, white-hot core tinted
       with the verdict, risen in a blink and decaying like an afterimage */
    if(t.flash){
      const fk=(now-t.flash.born)/t.flashDur;
      if(fk>=1)t.flash=null;
      else{
        const a=fk<0.16?fk/0.16:Math.pow(1-(fk-0.16)/0.84,1.7);
        const span=t.wave?.agent&&t.wave.origin!==t.name?t.wave.reach*perspective:SIZE;
        const R=span*(0.42+0.5*fk);
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,R);
        g.addColorStop(0,`rgba(255,255,255,${(0.95*a).toFixed(3)})`);
        g.addColorStop(0.45,hexA(t.wave?t.wave.col:'#FFFFFF',0.55*a));
        g.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle=g; ctx.fillRect(0,0,SIZE,SIZE);
        if(t.veil!==false&&(!t.wave?.agent||t.wave.origin===t.name)){   /* the flat veil over the square; a consumer on a dark page sets veil:false and keeps the core and the ring */
          ctx.fillStyle=`rgba(255,255,255,${(0.50*a).toFixed(3)})`;
          ctx.fillRect(0,0,SIZE,SIZE);
        }
      }
    }
  }

  function paintInst(t,now){
    t.lastPaint=now;
    /* a face seen edge-on is a sliver with knife corners: miter joins would
       throw spikes past the silhouette, round joins keep the rim clean */
    t.ctx.lineJoin='round'; t.ctx.lineCap='round';
    if(t.dpr){
      const d=Math.max(1,window.devicePixelRatio||1), k=Math.min(t.size,t.cv.getBoundingClientRect().width||t.size)*d/t.size;   /* THE TILE IS ITS OWN SIZE (Nov 26 2026): its bitmap the size it is shown at (its box after the wall's own scale) times the pixel ratio, never its 440 units at a 120 px tile (lysa's wall: 2.4 fps) */
      if(Math.abs(k-t.dprNow)>.02){t.dprNow=k;t.cv.width=Math.round(t.size*k);t.cv.height=Math.round(t.size*k);}
      t.ctx.setTransform(t.dprNow,0,0,t.dprNow,0,0);
    }
    drawTile(t,now);
  }

  function tick(now){
    if(page?.hidden){tickerOn=false;LASTF=0;return;}
    if(LASTF&&now-LASTF>2500){
      /* resumed from suspension: abort mid-flight sessions cleanly instead
         of draining them into an instant pathological seal */
      for(const t of INSTANCES){
        if(!t.driven&&t.phase!=='idle'){
          t.events.length=0; t.parts.length=0; t.rings.length=0;
          t.wave=null; t.flash=null; t.waveNow=0;
          t.phase='idle'; t.tNext=now+900+t.rnd()*2600;
          const lv=t.st[t.name].sealed||t.st[t.name].last;
          setChip(t,lv||'PENDET');
        }
      }
    }
    // Real receipt timestamps still reconcile against now. Visual orbits and
    // authored ballot motion must never catch up an entire sleep in one frame.
    const dt=LASTF?Math.max(0,Math.min(100,now-LASTF)):0;
    LASTF=now;
    for(const t of INSTANCES){
      if(t.paused)continue;
      if(!t.agentVoting)update(t,now);
      t.animT+=dt;
      if(t.agentVoting)updateAgentBallot(t);
      let veiled=t.veiled?t.veiled():false;
      if(!veiled&&t.cullOffscreen){
        const rect=t.cv.getBoundingClientRect();
        veiled=!(rect.bottom>-60&&rect.top<innerHeight+60);
      }
      if(veiled&&!t.discussion){
        /* unseen: the session continues, landings commit, nothing paints */
        for(let k=t.parts.length-1;k>=0;k--){
          const p=t.parts[k];
          if((now-p.born)/p.dur>=1){commitLanding(t,p); t.parts.splice(k,1)}
        }
        t.rings.length=0;
      }else if(!veiled&&(!t.fpsCap||now-t.lastPaint>=t.fpsCap)){
        paintInst(t,now);
      }
      if(t.onStatus){
        const stx=statusText(t,now);
        if(stx!==t.lastStat){t.lastStat=stx;t.onStatus(stx);}
      }
    }
    if(INSTANCES.some(t=>!t.paused))requestAnimationFrame(tick);
    else{tickerOn=false;LASTF=0;}
  }
})();
