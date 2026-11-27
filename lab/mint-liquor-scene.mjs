// The original exterior Opus syrup glass, on the existing hero context and clock.
// No purchases, RAF or timers. 1024x512 wave field only after verified mint
// increments; <=518,400 display pixels. The scene sleeps at rest.
// THE TWELVE CHAIRS (his Oct 17 2026 02:3x WEST, over the white seed growing into the 162-face globe: "it needs to remain a fucking
// dodecahedron with a golden sgyttarius statue inside of it and liquor being poured nft mint by nft mint... you get what i mean?", and just
// before: "when you enter the mint mode, you must still be fucking 12 dodecahedrons only... the 12 is gonna be top donors (remember we need to
// fucking stimulate, so remember this is time-limited... only for 7 days this can be purchased and after that the $WARM swarm is geenesissn)").
// So the glass stays the twelve-face seed (mint-gravity.mjs: GP(1,0), the twelve chairs, no hexagon) with its gold leading: its twelve faces
// are the twelve chairs of the seven days. The golden Sagittarius (golden-sagittarius.mjs, the existing TRELLIS study, as a statue: rigid is
// right for a statue) rises inside it out of the hole the glass captured in the fight (sagittarius-flight.mjs THE SINGULARITY), and the
// verified mint count pours in as liquor, a drop from above for each mint, the level the polyhedron's true volume. The 162-face Goldberg stays
// here as form 'swarm': the $WARM swarm's genesis after the seven days, not the entry. His Oct 15 rejection of the Cloth statue was of it
// standing in for the anime's own transformation; this is the statue he asked for now, inside the glass.
// COST (chairs): the statue, 39,932 triangles and 1.39 MB once (cloth-trellis.sagittarius.glb, fetched in an idle moment after the scene is
// made), drawn into a half-float target only while the scene draws (the entry's 5.7 s, a drop, a resize), never at rest.
// THE TWELVE DONORS (his same 02:3x words; the law: app/mint-chairs.mjs): setSeats, beside setSupply, takes the Worker's ranking of the seven
// days' top donors (app/dl-mint-chairs.mjs, through unboxing.js) and fills a chair's face with gold for each: rank 1 the chair that faces the
// eye at the hold's rest, then each next one facing it less (chairOrder). A chair known before the hold comes in with the glass; one taken
// while the glass stands sets in 350 ms with a flash, the stimulus he asked for. The pentagons keep their order and directions on every rung
// (mint-gravity.mjs), so a chair is the same face in the swarm: at the seven days' close unboxing.js hands the glass to form 'swarm' (the $WARM
// swarm's genesis), which grows out of this one where it stands (pose(), setHeld's pose and at) with the statue it adopts (statueAsset()).
// COST (seats): a held chair is one texel row upload (32 KB, both rows) at a change, and 700 ms of frames only when a chair is taken while held.
import {createMint} from './mint-gravity.mjs';
import {liquorEntryMesh} from './liquor-entry-mesh.mjs';
import {liquorEntry,ENTRY_SECONDS,CLEAR_AT,silk} from './liquor-entry.mjs';
import {QUAD_VS,WAVE_FS,ENERGY_FS,MASK_FS,BACK_FS,GLASS_VS,GLASS_FS,BEAD_VS,BEAD_FS} from './syrup-glass-optics.mjs';
import {pictureViewport} from './mint-freeze-layout.mjs';
import {MASK_BACKGROUND} from './sagittarius-flight.mjs';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const FW=1024,FH=512,SUB_MS=1000/240;
const WAVE={k:.36,damp:.012,visc:.2,kick:.3,absorb:.5};
const E_REST=.03,FALL_MS=400,LEVEL_MS=250,ENERGY_EVERY=12,RIPPLE=9,CAUSTIC=90,STAR_R=.34;
const MAX_DROPS=8,SEAT_MS=700,LONG_AGO=-1e9;
const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x);};
const slerp=(a,b,t)=>{const d=clamp(a.reduce((v,x,i)=>v+x*b[i],0),-1,1),th=Math.acos(d);if(th<1e-4)return b.slice();const sn=Math.sin(th),wa=Math.sin((1-t)*th)/sn,wb=Math.sin(t*th)/sn;return a.map((v,i)=>v*wa+b[i]*wb);};
function volumeLevels(faces) {
  const N = 512, bottom = -1.2, top = 1.2, step = (top-bottom)/N;
  function area(y) {
    let poly = [[-2,-2],[2,-2],[2,2],[-2,2]];
    for (const {n,d} of faces) {
      const bound = d-n[1]*y, next = [];
      for (let i=0;i<poly.length;i++) {
        const a=poly[i], b=poly[(i+1)%poly.length];
        const da=n[0]*a[0]+n[2]*a[1]-bound, db=n[0]*b[0]+n[2]*b[1]-bound;
        if (da<=0) next.push(a);
        if ((da<=0)!==(db<=0)) { const t=da/(da-db); next.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]); }
      }
      poly=next; if (!poly.length) return 0;
    }
    return Math.abs(poly.reduce((s,a,i) => { const b=poly[(i+1)%poly.length]; return s+a[0]*b[1]-a[1]*b[0]; },0))/2;
  }
  const cumulative = [0]; let previous = area(bottom), minY = top, maxY = bottom;
  for(let i=1;i<=N;i++) {
    const y=bottom+i*step, next=area(y);
    if(next>0) { minY=Math.min(minY,y); maxY=Math.max(maxY,y); }
    cumulative.push(cumulative[i-1]+(previous+next)*step/2); previous=next;
  }
  const total=cumulative[N];
  return {minY,maxY,at(fraction) {
    if(fraction<=0) return minY-step;
    if(fraction>=1) return maxY+step;
    const wanted=clamp(fraction,0,1)*total;
    let lo=0,hi=N; while(hi-lo>1) { const mid=(lo+hi)>>1; if(cumulative[mid]<wanted)lo=mid;else hi=mid; }
    return bottom+(lo+(wanted-cumulative[lo])/(cumulative[hi]-cumulative[lo]||1))*step;
  }};
}

export async function createMintLiquorScene({renderer,canvas,film,stage,getEntryPose=()=>null,isAlive=()=>true,onChange=()=>{},form='chairs',statue:adopted=null}) {
  const chairs=form!=='swarm';
  if(!renderer||!canvas||!stage||!isAlive())throw new Error('Liquid scene has no live renderer');
  const gl=renderer.getContext();
  if(!gl.getExtension('EXT_color_buffer_float'))throw new Error('Liquid waves require float render targets');
  renderer.resetState();gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);gl.disable(gl.SCISSOR_TEST);
  const textures=[],buffers=[],vaos=[],fbos=[],programs=[];
  let disposed=false,active=false,dirty=true,captured=false,renders=0,clock=0,lastTick=null,entry=0;
  let entryPose=null,tracks=liquorEntry(0);
  let W=1,H=1,dropsIssued=0,latestBatch=0,baseline=null;
  let supply={status:'unconfigured',minted:null,capacity:null,slot:null};
  let beads=[],splats=[],rippling=false,energy=0,waveAcc=0,framesSinceEnergy=0,energyFence=null,fenceAge=0,syncReads=0;
  const buffer=()=>{const b=gl.createBuffer();buffers.push(b);return b;};
  const vao=()=>{const v=gl.createVertexArray();vaos.push(v);return v;};
  function signal(){dirty=true;if(!disposed)onChange();}
function compile(type, src, name) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(name + ': ' + gl.getShaderInfoLog(s)); return s; }
function program(vs, fs, name) { const p = gl.createProgram(); const v=compile(gl.VERTEX_SHADER,vs,name+'.vs'), f=compile(gl.FRAGMENT_SHADER,fs,name+'.fs'); gl.attachShader(p,v);gl.attachShader(p,f);gl.deleteShader(v);gl.deleteShader(f); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(name + ': ' + gl.getProgramInfoLog(p)); p.u = new Map(); programs.push(p); return p; }
const u = (p, name) => { if (!p.u.has(name)) p.u.set(name, gl.getUniformLocation(p, name)); return p.u.get(name); };
// Leave the original Opus optics intact. These entry uniforms become identities
// at rest; the held film lives on the seed's faces before they become glass.
const entryVS=GLASS_VS.replace('uniform mat3 uRot;', 'uniform float uOffsetY; uniform mat3 uRot;')
  .replace('uniform mat3 uRot;', 'uniform float uChairs; uniform mat3 uRot;')
  .replace('out float vEdge;', 'out float vEdge; out vec3 vSeed;')
  .replace('vEdge = aEdge;', 'vEdge = mix(mix(1.0, aEdge, uProgress), aEdge, uChairs); vSeed = aA;')
  .replace('gl_Position.x += uOffset * gl_Position.w;', 'gl_Position.x += uOffset * gl_Position.w; gl_Position.y += uOffsetY * gl_Position.w;');
const entryFS=GLASS_FS.replace('uniform sampler2D uStar;', 'uniform sampler2D uHeld; uniform vec4 uRect; uniform vec3 uGround; uniform float uClarity, uAmber, uBackground, uOffsetY; uniform sampler2D uStatue; uniform float uStatueOn, uRise, uCoreR, uCoreA, uLead; uniform float uHeldA, uHandoff, uSeedD; uniform vec3 uSeedN[12]; uniform sampler2D uStar;')
  .replace('in float vEdge;', 'in float vEdge; in vec3 vSeed;')
  .replace('c.x += uOffset * c.w;', 'c.x += uOffset * c.w; c.y += uOffsetY * c.w;')
  .replace('float gold = step(0.95, fd.r)', 'float gold = step(0.95, fd.r) * uAmber')
  .replace('float depth = max(fd.r, 0.0) * setting;', 'float depth = max(fd.r, 0.0) * setting * uAmber;')
  .replace('depthB += 0.25 * max(fb.r, 0.0)', 'depthB += 0.25 * uAmber * max(fb.r, 0.0)')
  .replace('o = vec4(col, 1.0);', `
  // The mask remains a window onto this exact screen pixel throughout the
  // hold. No repeated face videos, central picture discs, or opaque white body.
  // THE TWELVE DONORS: a held chair (its face's r is -1: no liquor film) is a gilded frame round its face and a warm glaze over it, the face
  // still a window onto the statue; a held chair behind is seen through the glass as its glaze. At the genesis' handoff (uHandoff, 1 at the
  // switch and 0 once the globe has grown) the faces and edges are the dodecahedron's own, from each point's seed position.
  float heldF = step(fd.r, -.5), edgeF = vEdge;
  if (uHandoff > 0.) {
    int own = 0; float best = -2.;
    for (int j = 0; j < 12; j++) { float d = dot(vSeed, uSeedN[j]); if (d > best) { best = d; own = j; } }
    float seedEdge = 1.;
    for (int j = 0; j < 12; j++) if (j != own) seedEdge = min(seedEdge, (uSeedD - dot(vSeed, uSeedN[j])) / (uSeedD * .5528));
    heldF = mix(heldF, step(texelFetch(uFaceData, ivec2(own, 0), 0).r, -.5), uHandoff);
    edgeF = mix(vEdge, max(seedEdge, 0.), uHandoff);
  }
  vec3 exitAt = p + tExit * r;
  float heldBack = step(texelFetch(uFaceData, ivec2(int(texture(uMask, equirect(normalize(uRotInv * exitAt))).g + .5), 0), 0).r, -.5);
  vec2 screenUV = (gl_FragCoord.xy/uRes-uRect.xy)/uRect.zw;
  bool inPicture = all(greaterThanEqual(screenUV,vec2(0.))) && all(lessThanEqual(screenUV,vec2(1.)));
  vec3 screenFilm = inPicture ? texture(uHeld, vec2(screenUV.x, 1.-screenUV.y)).rgb : vec3(0.);
  // THE TWELVE CHAIRS: the golden Sagittarius inside, drawn by three at this screen's pixels (linear, premultiplied), a touch of refraction;
  // and the captured hole at the centre, black ringed in gold, closing as the statue rises out of it. The held picture dims behind the statue.
  // the core along the eye's own ray (one circle, as the flight drew it; the faces' refraction would show it three times), then the statue
  // over it, rising out of it
  float pi = dot(vPos, I), coreD = sqrt(max(0.,pp-pi*pi));
  vec3 behind = screenFilm*mix(1.,.72,uRise*uStatueOn*(1.-smoothstep(.42,.6,coreD)));   // dimmed only right behind the statue: the rest a clear window
  behind = mix(behind, behind*vec3(1.06,.97,.8)+vec3(.05,.035,0.), .35*heldBack*uHeldA);   // a held chair behind, through the glass
  behind = mix(behind, vec3(0.), step(coreD,uCoreR)*step(pi,0.)*uCoreA*.92);
  behind += vec3(1.,.8,.42)*exp(-pow((coreD-uCoreR*1.12)/(.06*uCoreR+.004),2.))*step(pi,0.)*uCoreA*.9;
  vec4 st = texture(uStatue, gl_FragCoord.xy/uRes + r.xy*.012) * uStatueOn;
  vec3 sc = st.rgb/max(st.a,1e-3); sc = pow(max(sc/(1.+sc*.5)*1.6,0.),vec3(1./2.2));
  behind = mix(behind, sc, st.a);
  vec3 poured = behind * Tp * Tf;
  float rim = 1.-smoothstep(0.,mix(.035,.05,uChairsF),edgeF);
  col = mix(mix(behind,behind*vec3(1.05,1.,.9)+vec3(.035,.025,0.),uChairsF),poured,uClarity);   // the flight's gold tint at the handoff
  col += uClarity * (vec3(1.,.86,.55)*level + vec3(1.,.97,.9)*spec*.16 + refl*F*.06);
  col = mix(col,mix(vec3(.72,.57,.29),vec3(.86,.68,.32),uChairsF),rim*uLead);
  // the held chair: its glaze, its gilded frame (lit by the key's highlight) as it sets, and the flash of a chair taken while the glass stands
  // (fd.a its moment; a chair held before the hold has none)
  float held = heldF*setting*uHeldA, frame = held*(1.-smoothstep(.06,.13,edgeF));
  col = mix(col, col*vec3(1.06,.97,.8)+vec3(.06,.04,0.), .5*held);
  col = mix(col, mix(vec3(.8,.56,.2),vec3(1.,.86,.5),smoothstep(0.,.13,edgeF))+vec3(1.,.95,.85)*spec*.5, .85*frame);
  col += vec3(1.,.82,.45)*.35*uHeldA*heldF*step(0.,uTime-fd.a)*exp(-(uTime-fd.a)/220.);
  o = vec4(col, 1.0);`).replace('uniform sampler2D uStar;', 'uniform float uChairsF; uniform sampler2D uStar;');
const entryBeadVS=BEAD_VS.replace('uniform float uOffset;', 'uniform float uOffset, uOffsetY;')
  .replace('gl_Position.x += uOffset * gl_Position.w;', 'gl_Position.x += uOffset * gl_Position.w; gl_Position.y += uOffsetY * gl_Position.w;');
const P = {wave: program(QUAD_VS, WAVE_FS, 'wave'), energy: program(QUAD_VS, ENERGY_FS, 'energy'), mask: program(QUAD_VS, MASK_FS, 'mask'), back: program(QUAD_VS, BACK_FS, 'back'), glass: program(entryVS, entryFS, 'glass'), bead: program(entryBeadVS, BEAD_FS, 'bead')};

let textureBytes = 0;
function tex2(w, h, internal, format, type, filter, wrapS, wrapT, data = null, bytes = 0) {
  const t = gl.createTexture(); textures.push(t); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  textureBytes += w * h * bytes; return t;
}
function fbo(t) { const f = gl.createFramebuffer(); fbos.push(f); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('framebuffer incomplete'); gl.bindFramebuffer(gl.FRAMEBUFFER, null); return f; }
const field = [0, 1].map(() => tex2(FW, FH, gl.RG16F, gl.RG, gl.HALF_FLOAT, gl.LINEAR, gl.REPEAT, gl.CLAMP_TO_EDGE, null, 4));
const fieldFbo = field.map(fbo); let cur = 0;
const mask = tex2(FW, FH, gl.RG16F, gl.RG, gl.HALF_FLOAT, gl.NEAREST, gl.REPEAT, gl.CLAMP_TO_EDGE, null, 4), maskFbo = fbo(mask);
const energyTex = tex2(32, 16, gl.RGBA32F, gl.RGBA, gl.FLOAT, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, null, 16), energyFbo = fbo(energyTex);
const centers = tex2(1024, 1, gl.RGBA32F, gl.RGBA, gl.FLOAT, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, null, 16);
const faceData = tex2(1024, 1, gl.RGBA32F, gl.RGBA, gl.FLOAT, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, null, 16);
const star = tex2(1, 1, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, new Uint8Array([230, 200, 140, 255]), 4);
const pbo = buffer(); gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo); gl.bufferData(gl.PIXEL_PACK_BUFFER, 32 * 16 * 16, gl.STREAM_READ); gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
const quadVao = vao();
const meshVao = vao(), meshBuf = buffer(); let meshCount = 0;
const beadVao = vao(), beadCorner = buffer(), beadInst = buffer();
gl.bindVertexArray(beadVao);
gl.bindBuffer(gl.ARRAY_BUFFER, beadCorner); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, beadInst);
for (const [loc, size, off] of [[1, 3, 0], [2, 2, 12], [3, 1, 20], [4, 1, 24]]) { gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 28, off); gl.vertexAttribDivisor(loc, 1); }
gl.bindVertexArray(null);

const EYE = [0, 0, 4], SIL = Math.tan(Math.asin(0.25));
let yaw = -0.32, pitch = -0.12, rot = null, rotInv = null, vp = null;
function perspective(fovy, aspect, near, far) { const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]); }
function camera() {
  const growth=tracks.growth;
  const fromYaw=entryPose?.yaw??-.32,fromPitch=entryPose?.pitch??-.12;
  yaw=fromYaw+Math.atan2(Math.sin(-.32-fromYaw),Math.cos(-.32-fromYaw))*growth;
  pitch=fromPitch+(-.12-fromPitch)*growth;
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  // rows of R = Rx(pitch) * Ry(yaw), as mint-sphere's rotate(): x' = x cy - z sy, z' = x sy + z cy; y'' = y cp - z' sp, z'' = y sp + z' cp
  let R = [[cy, 0, -sy], [-sp * sy, cp, -sp * cy], [cp * sy, sp, cp * cy]];
  if(entryPose?.quaternion){
    // Preserve the flying mask's full three-axis turn (yaw/pitch alone loses roll).
    const from=entryPose.quaternion;
    const a=-.32/2,b=-.12/2;
    let to=[Math.sin(b)*Math.cos(a),-Math.cos(b)*Math.sin(a),-Math.sin(b)*Math.sin(a),Math.cos(b)*Math.cos(a)];
    if(from.reduce((v,x,i)=>v+x*to[i],0)<0)to=to.map(x=>-x);
    const q=from.map((v,i)=>v+(to[i]-v)*growth),norm=Math.hypot(...q)||1;
    const [x,y,z,w]=q.map(v=>v/norm);
    R=[[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],
      [2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],
      [2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]];
  }
  rot = new Float32Array([R[0][0], R[1][0], R[2][0], R[0][1], R[1][1], R[2][1], R[0][2], R[1][2], R[2][2]]);
  rotInv = new Float32Array([R[0][0], R[0][1], R[0][2], R[1][0], R[1][1], R[1][2], R[2][0], R[2][1], R[2][2]]);
  const fov = 2 * Math.atan(SIL / (2*sphere()[2]/H)), pr = perspective(fov, W / H, 1, 12);
  // the view translates by -4 along z: VP = P * T, so VP's last column is P * (0, 0, -4, 1)
  vp = pr.slice(); vp[12] = pr[12] - 4 * pr[8]; vp[13] = pr[13] - 4 * pr[9]; vp[14] = pr[14] - 4 * pr[10]; vp[15] = pr[15] - 4 * pr[11];
}
const rotate = p => [rot[0] * p[0] + rot[3] * p[1] + rot[6] * p[2], rot[1] * p[0] + rot[4] * p[1] + rot[7] * p[2], rot[2] * p[0] + rot[5] * p[1] + rot[8] * p[2]];
const unrotate = p => [rotInv[0] * p[0] + rotInv[3] * p[1] + rotInv[6] * p[2], rotInv[1] * p[0] + rotInv[4] * p[1] + rotInv[7] * p[2], rotInv[2] * p[0] + rotInv[5] * p[1] + rotInv[8] * p[2]];


  // the chairs: the seed is the glass (rung 0, twelve faces); the swarm: three rungs up, 162 faces
  const mint=createMint(),seed=mint.layout();if(!chairs)for(let i=0;i<3;i++)mint.expand();
  const layout=mint.layout(),faces=[...layout.skin.pents,...layout.skin.hexes];
  camera();
  const levels=volumeLevels(faces.map(f=>({n:rotate(f.normal),d:f.normal.reduce((v,x,i)=>v+x*f.center[i],0)})));
  let levelShown=levels.minY-.01,levelTarget=levelShown;
  const C=new Float32Array(4096),D=new Float32Array(4096);
  // Count-only receipts have no holder identity or Bronze/Gold attribution.
  // An amber pane is an aggregate visual unit, never an asserted ticket class.
  const order=layout.skin.hexes.map((f,i)=>i).sort((a,b)=>(a*67)%150-(b*67)%150);
  const litFaces=new Set(),seats=new Set();
  // THE CHAIRS A RANK HOLDS: the pentagons by how squarely each faces the eye at the hold's rest (this camera at creation), rank 1 the most
  const chairOrder=seed.skin.pents.map((f,i)=>({i,z:rotate(f.normal)[2]})).sort((a,b)=>b.z-a.z||a.i-b.i).map(c=>c.i);
  // THE GENESIS' HANDOFF: the seed's planes (model space) for the dodecahedron's own faces and edges while the swarm grows out of the chairs
  const seedN=new Float32Array(seed.skin.pents.flatMap(f=>f.normal)),seedD=seed.skin.pents[0].normal.reduce((v,x,i)=>v+x*seed.skin.pents[0].center[i],0);
  let handoff=false;
  const seatSince=new Float64Array(12).fill(LONG_AGO);let seatUntil=LONG_AGO,seatsAnswer={status:'unknown',held:0},seatsGiven={status:'unknown',held:[]};
  function uploadFaces(){
    faces.forEach((f,i)=>{
      const pool=i<12?i:Number(layout.byFace[i-12].home.slice(layout.byFace[i-12].home.indexOf(':')+1));   // 'chair:N' or 'gold:N' (mint-gravity.mjs): the number after the colon; slice(6) read 'gold:12' as 2 (Oct 17 2026)
      C.set(f.normal,i*4);C[i*4+3]=pool;
      // the twelve chairs are clear until a top donor holds one (setSeats), in the chairs and in the swarm alike: a pentagon is a chair
      D[i*4]=i<12?(seats.has(i)?-1:0):litFaces.has(i-12)?.18:0;   // a held chair is -1: a gilded frame, never a liquor film
      D[i*4+1]=pool;D[i*4+2]=0;D[i*4+3]=i<12?seatSince[i]:LONG_AGO;
    });
    gl.bindTexture(gl.TEXTURE_2D,centers);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,1024,1,gl.RGBA,gl.FLOAT,C);
    gl.bindTexture(gl.TEXTURE_2D,faceData);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,1024,1,gl.RGBA,gl.FLOAT,D);
    return faces.length;
  }
  function populate(){
    const fraction=supply.minted==null?0:clamp(supply.minted/supply.capacity,0,1);
    litFaces.clear();for(let j=0;j<Math.round(fraction*order.length);j++)litFaces.add(order[j]);
    uploadFaces();
  }
function buildMask() {
  const n = uploadFaces();
  gl.bindFramebuffer(gl.FRAMEBUFFER, maskFbo); gl.viewport(0, 0, FW, FH); gl.useProgram(P.mask);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, centers); gl.uniform1i(u(P.mask, 'uCenters'), 0);
  gl.uniform1i(u(P.mask, 'uFaces'), n); gl.uniform1f(u(P.mask, 'uInside'), Math.cos(0.38 * layout.cellAngle));
  gl.bindVertexArray(quadVao); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
function uploadMesh() {
  const data = liquorEntryMesh(seed.skin,layout.skin);
  gl.bindVertexArray(meshVao); gl.bindBuffer(gl.ARRAY_BUFFER, meshBuf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  for (const [loc, size, off] of [[0, 3, 0], [1, 3, 12], [2, 3, 24], [3, 3, 36], [4, 1, 48], [5, 1, 52]]) { gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 56, off); }
  gl.bindVertexArray(null); meshCount = data.length/14; return data.byteLength;
}
function waveStep(splat) {
  const next = 1 - cur;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fieldFbo[next]); gl.viewport(0, 0, FW, FH); gl.useProgram(P.wave);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, field[cur]); gl.uniform1i(u(P.wave, 'uField'), 0);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, mask); gl.uniform1i(u(P.wave, 'uMask'), 1);
  gl.uniform2f(u(P.wave, 'uTexel'), 1 / FW, 1 / FH); gl.uniform1f(u(P.wave, 'uK'), WAVE.k); gl.uniform1f(u(P.wave, 'uDamp'), WAVE.damp); gl.uniform1f(u(P.wave, 'uVisc'), WAVE.visc); gl.uniform1f(u(P.wave, 'uKick'), WAVE.kick); gl.uniform1f(u(P.wave, 'uAbsorb'), WAVE.absorb);
  gl.uniform1f(u(P.wave, 'uSplatAmp'), splat ? splat.amp : 0); gl.uniform4f(u(P.wave, 'uSplat'), ...(splat ? splat.dir : [0, 1, 0]), splat ? splat.radius : 0);
  gl.bindVertexArray(quadVao); gl.drawArrays(gl.TRIANGLES, 0, 3); cur = next; gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
function clearField() { for (const f of fieldFbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); } gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
function energyIssue(sync) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, energyFbo); gl.viewport(0, 0, 32, 16); gl.useProgram(P.energy);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, field[cur]); gl.uniform1i(u(P.energy, 'uField'), 0);
  gl.bindVertexArray(quadVao); gl.drawArrays(gl.TRIANGLES, 0, 3);
  framesSinceEnergy = 0;
  if (sync) { const out = new Float32Array(32 * 16 * 4); gl.readPixels(0, 0, 32, 16, gl.RGBA, gl.FLOAT, out); gl.bindFramebuffer(gl.FRAMEBUFFER, null); energyArrived(out); return; }
  gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo); gl.readPixels(0, 0, 32, 16, gl.RGBA, gl.FLOAT, 0); gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
  energyFence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0); fenceAge = 0; gl.flush(); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
function energyPoll() {
  if (!energyFence) return;
  const st = gl.clientWaitSync(energyFence, 0, 0);
  if (st === gl.TIMEOUT_EXPIRED && ++fenceAge < 30) return;
  if(st===gl.TIMEOUT_EXPIRED||st===gl.WAIT_FAILED){gl.deleteSync(energyFence);energyFence=null;return;}
  gl.deleteSync(energyFence); energyFence = null; fenceAge = 0;
  const out = new Float32Array(32 * 16 * 4); gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo); gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, out); gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
  energyArrived(out);
}
function energyArrived(out) { let e = 0; for (let i = 0; i < out.length; i += 4) e += out[i]; energy = e; if (e < E_REST && !splats.length) { rippling = false; clearField(); } }

function backdropUniforms(p) {
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, field[cur]); gl.uniform1i(u(p, 'uField'), 0);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, mask); gl.uniform1i(u(p, 'uMask'), 1);
  gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, faceData); gl.uniform1i(u(p, 'uFaceData'), 2);
  gl.uniform2f(u(p, 'uRes'), W, H); gl.uniform2f(u(p, 'uTexel'), 1 / FW, 1 / FH); gl.uniform3f(u(p, 'uSphere'), ...sphere());
  gl.uniformMatrix3fv(u(p, 'uRotInv'), false, rotInv); gl.uniform1f(u(p, 'uLevel'), levelShown); gl.uniform1f(u(p, 'uTime'), clock); gl.uniform1f(u(p, 'uCaustic'), CAUSTIC);
}

  // A held anime frame supplies the center and the finite optical handoff.
  const heldCanvas=stage.ownerDocument.createElement('canvas');heldCanvas.width=960;heldCanvas.height=540;
  const hx=heldCanvas.getContext('2d',{alpha:false});
  const heldTexture=tex2(1,1,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,gl.LINEAR,gl.CLAMP_TO_EDGE,gl.CLAMP_TO_EDGE,new Uint8Array([255,245,215,255]),4);
  const overlay=program(QUAD_VS,`#version 300 es
precision highp float;in vec2 vUv;uniform sampler2D uHeld;uniform vec4 uRect;uniform vec3 uGround;uniform float uAlpha;out vec4 o;
void main(){vec2 p=(vUv-uRect.xy)/uRect.zw;bool inside=p.x>=0.&&p.x<=1.&&p.y>=0.&&p.y<=1.;vec3 frame=inside?texture(uHeld,vec2(p.x,1.-p.y)).rgb:vec3(0.);o=vec4(mix(uGround,frame,uAlpha),1.);}`, 'held-frame');
  let sourceRect=[0,0,1,1],waveUntil=0;
  function captureFilm(){
    if(captured||!hx||!(film?.readyState>=2&&film.videoWidth>0))return;
    try{
      hx.drawImage(film,0,0,960,540);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
      gl.bindTexture(gl.TEXTURE_2D,heldTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,heldCanvas);
      gl.bindTexture(gl.TEXTURE_2D,star);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,heldCanvas);
      captured=true;signal();
    }catch{/* Retain the neutral center until a decoded source frame is readable. */}
  }
  // THE STATUE: the golden Sagittarius, loaded in an idle moment once the scene is made (chairs only), drawn by three into a half-float
  // target the size of this canvas at each draw while it shows; it rises out of the core over RISE seconds of the entry.
  const RISE=[.35,1.65],STATUE_H=1.12,CORE_R=.36;   // 1.12 high: its wings and hooves stay inside every face plane (inradius .795) at any turn
  // the swarm keeps the statue too: at the genesis it adopts the chairs' own (no second fetch), and stands in the globe that grew around it
  let statue=null,statueState='loading',statueRT=null,THREEm=null,statueCam=null,statueScene=null,statueHolder=null;
  const idle=()=>new Promise(r=>{const v=stage.ownerDocument.defaultView;if(v?.requestIdleCallback)v.requestIdleCallback(()=>r(),{timeout:1500});else setTimeout(r,200);});
  function mountStatue(THREE,asset){
    THREEm=THREE;statue=asset;
    statueScene=new THREE.Scene();statueHolder=new THREE.Group();statueScene.add(statueHolder);
    const scale=STATUE_H/asset.size.y;asset.root.scale.setScalar(scale);asset.root.position.copy(asset.centre).multiplyScalar(-scale);
    statueHolder.add(asset.root);
    statueCam=new THREE.PerspectiveCamera();statueCam.matrixAutoUpdate=false;
    statueRT=new THREE.WebGLRenderTarget(W,H,{type:THREE.HalfFloatType,samples:4});
    // its programs compiled now, in this idle moment, for the target it draws into: never a compile in the frame it first shows
    const target=renderer.getRenderTarget();renderer.setRenderTarget(statueRT);renderer.compile(statueScene,statueCam);renderer.setRenderTarget(target);renderer.resetState();
    statueState='ready';signal();
  }
  async function loadStatue(){
    try{
      await idle(); if(disposed)return;
      const [THREE,{createGoldenArmor}]=await Promise.all([import('three'),import('./golden-sagittarius.mjs')]);
      if(disposed)return;
      const asset=await createGoldenArmor({THREE,renderer,isAlive:()=>!disposed&&isAlive()});
      if(disposed){asset.dispose();return;}
      mountStatue(THREE,asset);
    }catch(error){statueState='failed';console.warn('mint-liquor: the golden Sagittarius could not load; the glass stays empty',error);}
  }
  const rise=()=>silk((entry-RISE[0])/(RISE[1]-RISE[0]));
  function drawStatue(){
    if(statueState!=='ready'||rise()<=0)return null;
    const THREE=THREEm,k=rise();
    if(statueRT.width!==W||statueRT.height!==H)statueRT.setSize(W,H);
    // stands upright in the world, centred in the glass, a three-quarter turn to the eye; grows out of the core
    statueHolder.scale.setScalar(Math.max(1e-3,k));statueHolder.rotation.y=-.42-.9*(1-k);statueHolder.updateMatrixWorld(true);
    const s=sphere(),P=new THREE.Matrix4().makeTranslation(2*s[0]/W-1,2*s[1]/H-1,0).multiply(new THREE.Matrix4().fromArray(vp));
    statueCam.projectionMatrix.copy(P);statueCam.projectionMatrixInverse.copy(P).invert();
    const target=renderer.getRenderTarget(),clear=renderer.getClearColor(new THREE.Color()),alpha=renderer.getClearAlpha(),auto=renderer.autoClear;
    renderer.setRenderTarget(statueRT);renderer.setClearColor(0x000000,0);renderer.autoClear=true;renderer.render(statueScene,statueCam);
    renderer.setRenderTarget(target);renderer.setClearColor(clear,alpha);renderer.autoClear=auto;renderer.resetState();
    return renderer.properties.get(statueRT.texture).__webglTexture??null;
  }
  function sphere(){
    const k=tracks.growth,from=entryPose??{x:.55,y:.5,radiusHeight:.2*Math.min(W,H)/H*4/Math.sqrt(15)};
    return [W*(from.x+(.55-from.x)*k),H*(from.y+(.5-from.y)*k),
      from.radiusHeight*H+(Math.min(.34*H,.38*W)-from.radiusHeight*H)*k];
  }
  function stopWaves(){
    rippling=false;splats=[];waveAcc=0;
    if(energyFence){gl.deleteSync(energyFence);energyFence=null;}
    clearField();
  }
  function applySupply(snapshot={}){
    if(disposed)return;
    const status=['live','stale','unknown','unconfigured'].includes(snapshot.status)?snapshot.status:'unknown';
    const valid=status==='live'&&Number.isSafeInteger(snapshot.minted)&&snapshot.minted>=0&&Number.isSafeInteger(snapshot.capacity)&&snapshot.capacity>0&&snapshot.minted<=snapshot.capacity&&Number.isSafeInteger(snapshot.slot)&&snapshot.slot>=0;
    if(!valid){
      if(supply.status===status&&baseline===null)return;
      const nextStatus=status==='live'?'unknown':status;
      supply=nextStatus==='stale'?{...supply,status:nextStatus}:{status:nextStatus,minted:null,capacity:null,slot:null};
      baseline=null;latestBatch=0;beads=[];stopWaves();
      if(nextStatus!=='stale'){levelShown=levelTarget=levels.minY-.01;populate();}
      signal();return;
    }
    if(supply.slot!=null&&snapshot.slot<supply.slot)return;
    if(supply.minted!=null&&snapshot.minted<supply.minted)return;
    if(supply.status==='live'&&supply.minted===snapshot.minted&&supply.capacity===snapshot.capacity){supply={...supply,slot:snapshot.slot};baseline={...supply};return;}
    const continuous=baseline&&baseline.capacity===snapshot.capacity&&snapshot.minted>=baseline.minted&&snapshot.slot>=baseline.slot;
    const delta=continuous?snapshot.minted-baseline.minted:0;
    supply={status:'live',minted:snapshot.minted,capacity:snapshot.capacity,slot:snapshot.slot};baseline={...supply};
    levelTarget=levels.at(snapshot.minted/snapshot.capacity);latestBatch=delta;
    if(!continuous){levelShown=levelTarget;beads=[];stopWaves();}
    populate();
    if(delta>0){
      const count=Math.min(MAX_DROPS,delta);
      if(chairs){
        // THE POUR: each verified mint a drop of liquor falling from above into the glass, onto the level; aggregate, no holder named
        for(let i=0;i<count;i++){const k=dropsIssued+i,a=k*2.39996,w=.16*Math.sqrt(((k*5)%7+1)/7);beads.push({x:w*Math.cos(a),z:w*Math.sin(a),t0:clock+i*140,pour:true});}
      }else{
        // Pick visible shell directions for the aggregate receipt. No fabricated ownership.
        const visible=faces.slice(12).filter(f=>{const w=rotate(f.normal);return w[2]>.2&&w[1]<.6&&w[1]>-.5;});
        for(let i=0;i<count;i++)beads.push({to:visible[(dropsIssued+i)%visible.length].normal.slice(),t0:clock+i*110});
      }
      beads=beads.slice(-MAX_DROPS);dropsIssued+=count;
    }
    signal();
  }
  function setSupply(snapshot={}){
    // Feed callbacks can arrive outside the hero draw. Invalidate THREE's state
    // cache around raw GL uploads so subsequent source frames keep their bindings.
    if(disposed)return;
    renderer.resetState();
    gl.disable(gl.SCISSOR_TEST);gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);
    try{applySupply(snapshot);}finally{renderer.resetState();}
  }
  // THE TWELVE DONORS: the ranking as dl-mint-chairs.mjs hands it ({status:'live', held:[{rank, usd, ...}]}); anything else holds no chair
  function applySeats(answer={}){
    const held=answer?.status==='live'&&Array.isArray(answer.held)?answer.held:[];
    seatsGiven=answer??{status:'unknown',held:[]};
    let n=0;while(n<held.length&&n<12&&held[n]?.rank===n+1)n++;
    seatsAnswer={status:answer?.status==='live'?'live':'unknown',held:n};
    const next=new Set(chairOrder.slice(0,n));
    if(next.size===seats.size&&[...next].every(i=>seats.has(i)))return;
    // a chair taken while the glass stands sets with its flash; one held before the hold (or during its entry) comes in with the glass
    const taking=active&&entry>=ENTRY_SECONDS;
    for(const i of next)if(!seats.has(i)){seatSince[i]=taking?clock:LONG_AGO;if(taking)seatUntil=Math.max(seatUntil,clock+SEAT_MS);}
    for(const i of seats)if(!next.has(i))seatSince[i]=LONG_AGO;
    seats.clear();for(const i of next)seats.add(i);
    uploadFaces();signal();
  }
  function setSeats(answer={}){
    if(disposed)return;
    renderer.resetState();
    gl.disable(gl.SCISSOR_TEST);gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);
    try{applySeats(answer);}finally{renderer.resetState();}
  }
  const POUR_MS=560;
  function motion(){return entry<ENTRY_SECONDS||beads.length>0||rippling||Math.abs(levelTarget-levelShown)>.0002||clock<seatUntil;}
  function resize(){
    if(disposed)return;
    const rect=stage.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height);
    const r=pictureViewport(w,h);sourceRect=[r.left/w,1-(r.top+r.height)/h,r.width/w,r.height/h];
    const scale=Math.min(1,Math.sqrt(518400/(w*h)),960/Math.max(w,h));
    const nw=Math.max(1,Math.round(w*scale)),nh=Math.max(1,Math.round(h*scale));
    if(nw!==W||nh!==H){W=nw;H=nh;camera();signal();}
    if(active){
      if(renderer.getPixelRatio()!==1)renderer.setPixelRatio(1);
      if(canvas.width!==W||canvas.height!==H){renderer.setSize(W,H,false);signal();}
      Object.assign(canvas.style,{left:'0px',top:'0px',width:`${w}px`,height:`${h}px`,opacity:'1',pointerEvents:'none'});
      canvas.hidden=false;canvas.removeAttribute('aria-hidden');canvas.setAttribute('role','img');
      canvas.setAttribute('aria-label',chairs?'A clear glass dodecahedron, the twelve chairs, with the golden Sagittarius standing inside. A gold chair is a top donor of the seven days.':'A clear faceted glass globe, the $WARM swarm grown out of the twelve chairs, with the golden Sagittarius standing inside.');
    }
  }
  // held from the film's hold; `pose` and `at` when the glass takes over from another one where it stands (the genesis: unboxing.js)
  function setHeld(value,{pose=null,at=0,level=null}={}){
    if(disposed||Boolean(value)===active)return;
    active=Boolean(value);lastTick=null;
    if(active){
      entry=clamp(at,0,ENTRY_SECONDS);tracks=liquorEntry(entry);entryPose=pose??getEntryPose();handoff=!chairs&&Boolean(pose);
      if(handoff&&Number.isFinite(level))levelShown=level;   // the level eases from where the chairs held it to the swarm's own volume
      captureFilm();resize();camera();signal();
    }
  }
  // where this glass stands now, as an entry pose (the camera's turn as a quaternion, the rows of R): what the next glass grows from
  function pose(){
    const s=sphere(),R=[0,1,2].map(i=>[rot[i],rot[3+i],rot[6+i]]),tr=R[0][0]+R[1][1]+R[2][2];
    let q;
    if(tr>0){const k=.5/Math.sqrt(tr+1);q=[(R[2][1]-R[1][2])*k,(R[0][2]-R[2][0])*k,(R[1][0]-R[0][1])*k,.25/k];}
    else if(R[0][0]>R[1][1]&&R[0][0]>R[2][2]){const k=2*Math.sqrt(1+R[0][0]-R[1][1]-R[2][2]);q=[.25*k,(R[0][1]+R[1][0])/k,(R[0][2]+R[2][0])/k,(R[2][1]-R[1][2])/k];}
    else if(R[1][1]>R[2][2]){const k=2*Math.sqrt(1+R[1][1]-R[0][0]-R[2][2]);q=[(R[0][1]+R[1][0])/k,.25*k,(R[1][2]+R[2][1])/k,(R[0][2]-R[2][0])/k];}
    else{const k=2*Math.sqrt(1+R[2][2]-R[0][0]-R[1][1]);q=[(R[0][2]+R[2][0])/k,(R[1][2]+R[2][1])/k,.25*k,(R[1][0]-R[0][1])/k];}
    return {x:s[0]/W,y:s[1]/H,radiusHeight:s[2]/H,yaw,pitch,quaternion:q,background:entryPose?.background,outside:entryPose?.outside,sourceTime:entryPose?.sourceTime};
  }
  function tick(seconds){
    if(disposed||!active||!Number.isFinite(seconds))return;
    const dt=lastTick==null?0:clamp((seconds-lastTick)*1000,0,100);lastTick=seconds;
    if(!motion())return;
    clock+=dt;entry=Math.min(ENTRY_SECONDS,entry+dt/1000);
    tracks=liquorEntry(entry);camera();
    renderer.resetState();gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);gl.disable(gl.SCISSOR_TEST);
    energyPoll();
    beads=beads.filter(b=>{
      if(clock-b.t0<(b.pour?POUR_MS:FALL_MS))return true;
      const to=b.pour?(()=>{const v=unrotate([b.x,Math.max(levels.minY,levelShown),b.z]),l=Math.hypot(...v)||1;return v.map(x=>x/l);})():b.to;
      splats.push({dir:to,radius:.45*(b.pour?.5:layout.cellAngle),amp:.35});rippling=true;waveUntil=clock+7000;return false;
    });
    levelShown+=(levelTarget-levelShown)*(1-Math.exp(-dt/LEVEL_MS));if(Math.abs(levelTarget-levelShown)<.0002)levelShown=levelTarget;
    if(rippling||splats.length){
      waveAcc+=dt;const n=Math.min(8,Math.floor(waveAcc/SUB_MS));waveAcc-=n*SUB_MS;
      for(let i=0;i<n;i++)waveStep(splats.shift()||null);
      if(++framesSinceEnergy>=ENERGY_EVERY&&!energyFence)energyIssue(false);
      if(clock>=waveUntil)stopWaves();
    }
    const mouth=unrotate([0,1,0]);
    beads.forEach(b=>{if(clock<b.t0)return;
      if(b.pour){const t=clamp((clock-b.t0)/POUR_MS,0,1);b.pos=[b.x,1.55+(Math.max(levels.minY,levelShown)-1.55)*t*t,b.z];b.stretch=1+.9*t;return;}
      const t=ease((clock-b.t0)/FALL_MS),lift=1.04+.22*Math.sin(Math.PI*t);b.pos=rotate(slerp(mouth,b.to,t)).map(x=>x*lift);b.stretch=1+.35*Math.sin(Math.PI*t);});
    renderer.resetState();signal();
  }
  function draw(){
    if(disposed||!active||!isAlive()||!dirty)return false;
    resize();captureFilm();renderer.resetState();
    const statueTex=drawStatue();
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,W,H);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);gl.disable(gl.SCISSOR_TEST);
    const ground=entryPose?.background??[.914,.898,.851];
    // Keep the same backing and opacity as the preceding mask. A new paper
    // texture or shadow here would jump across the entire held picture.
    if(captured){
      gl.useProgram(overlay);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,heldTexture);gl.uniform1i(u(overlay,'uHeld'),0);
      gl.uniform4f(u(overlay,'uRect'),...sourceRect);gl.uniform1f(u(overlay,'uAlpha'),entryPose?.outside??MASK_BACKGROUND);
      gl.uniform3f(u(overlay,'uGround'),...ground);gl.bindVertexArray(quadVao);gl.drawArrays(gl.TRIANGLES,0,3);
    }else{gl.useProgram(P.back);backdropUniforms(P.back);gl.bindVertexArray(quadVao);gl.drawArrays(gl.TRIANGLES,0,3);}
    gl.useProgram(P.glass);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);backdropUniforms(P.glass);
    gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,star);gl.uniform1i(u(P.glass,'uStar'),3);
    gl.uniformMatrix3fv(u(P.glass,'uRot'),false,rot);gl.uniformMatrix4fv(u(P.glass,'uVP'),false,vp);
    gl.uniform3f(u(P.glass,'uEye'),...EYE);gl.uniform1f(u(P.glass,'uRipple'),RIPPLE);
    gl.uniform1f(u(P.glass,'uOffset'),2*sphere()[0]/W-1);gl.uniform1f(u(P.glass,'uOffsetY'),2*sphere()[1]/H-1);
    gl.uniform1f(u(P.glass,'uProgress'),tracks.growth);gl.uniform1f(u(P.glass,'uClarity'),tracks.clarity);gl.uniform1f(u(P.glass,'uAmber'),tracks.growth);
    gl.uniform1f(u(P.glass,'uBackground'),tracks.background);gl.uniform4f(u(P.glass,'uRect'),...sourceRect);
    gl.uniform3f(u(P.glass,'uGround'),...ground);
    gl.activeTexture(gl.TEXTURE4);gl.bindTexture(gl.TEXTURE_2D,heldTexture);gl.uniform1i(u(P.glass,'uHeld'),4);
    gl.activeTexture(gl.TEXTURE5);gl.bindTexture(gl.TEXTURE_2D,statueTex??heldTexture);gl.uniform1i(u(P.glass,'uStatue'),5);
    gl.uniform1f(u(P.glass,'uStatueOn'),statueTex?1:0);gl.uniform1f(u(P.glass,'uRise'),rise());
    // the handoff: the chairs' look (their leading, tint and held gold, the amber at once) easing into the swarm's as the globe grows
    const k=handoff?1-tracks.growth:0;
    gl.uniform1f(u(P.glass,'uChairs'),chairs?1:0);gl.uniform1f(u(P.glass,'uChairsF'),chairs?1:k);gl.uniform1f(u(P.glass,'uLead'),chairs?.85:.18+.67*k);
    gl.uniform1f(u(P.glass,'uHeldA'),handoff?1:tracks.growth);gl.uniform1f(u(P.glass,'uHandoff'),k);
    gl.uniform3fv(u(P.glass,'uSeedN'),seedN);gl.uniform1f(u(P.glass,'uSeedD'),seedD);
    gl.uniform1f(u(P.glass,'uCoreR'),CORE_R);gl.uniform1f(u(P.glass,'uCoreA'),1-silk((entry-.45)/1.35));
    gl.uniform1f(u(P.glass,'uStarR'),STAR_R);gl.uniform1f(u(P.glass,'uHasStar'),0);
    gl.bindVertexArray(meshVao);gl.drawArrays(gl.TRIANGLES,0,meshCount);gl.disable(gl.CULL_FACE);
    const shown=beads.filter(b=>b.pos);
    if(shown.length){
      const inst=new Float32Array(shown.length*7);shown.forEach((b,i)=>inst.set([...b.pos,.034,.034*b.stretch,0,1],i*7));
      gl.bindBuffer(gl.ARRAY_BUFFER,beadInst);gl.bufferData(gl.ARRAY_BUFFER,inst,gl.DYNAMIC_DRAW);
      gl.useProgram(P.bead);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);backdropUniforms(P.bead);
      gl.uniformMatrix4fv(u(P.bead,'uVP'),false,vp);gl.uniform1f(u(P.bead,'uOffset'),2*sphere()[0]/W-1);gl.uniform1f(u(P.bead,'uOffsetY'),2*sphere()[1]/H-1);gl.uniform3f(u(P.bead,'uEye'),...EYE);
      gl.bindVertexArray(beadVao);gl.drawArraysInstanced(gl.TRIANGLE_STRIP,0,4,shown.length);gl.disable(gl.BLEND);
    }
    gl.bindVertexArray(null);renderer.resetState();canvas.dataset.mintLiquor=chairs?'twelve-chairs':'opus-glass';dirty=false;renders++;return true;
  }
  // what the glass that takes over (the genesis) carries on: the supply and the chairs as this one last took them
  const handover=()=>({supply:{...supply},seats:seatsGiven,level:levelShown});
  // the statue, loaded, for the glass that takes over (the genesis): it is that glass's from then, this one's dispose leaves it
  let handed=false;
  function statueAsset(){if(statueState!=='ready'||!statue)return null;handed=true;return {THREE:THREEm,asset:statue};}
  function dispose(){
    if(disposed)return;disposed=true;active=false;if(energyFence)gl.deleteSync(energyFence);
    for(const t of textures)gl.deleteTexture(t);for(const b of buffers)gl.deleteBuffer(b);for(const v of vaos)gl.deleteVertexArray(v);for(const f of fbos)gl.deleteFramebuffer(f);for(const p of programs)gl.deleteProgram(p);
    statueRT?.dispose();if(!handed)statue?.dispose();statue=null;statueRT=null;
    renderer.resetState();beads=[];splats=[];
  }
  buildMask();uploadMesh();clearField();resize();renderer.resetState();
  if(adopted?.asset&&adopted.THREE)mountStatue(adopted.THREE,adopted.asset);else void loadStatue();
  return {ready:true,get active(){return active;},get needsFrame(){return !disposed&&active&&(dirty||motion());},setHeld,setSupply,setSeats,pose,statueAsset,handover,tick,draw,resize,dispose,
    state:()=>({active,needsFrame:!disposed&&active&&(dirty||motion()),mode:chairs?'twelve-chairs':'opus-glass',form:chairs?'chairs':'swarm',
      statue:{state:statueState,rise:rise(),triangles:statue?.metadata.triangles??0,adopted:Boolean(adopted?.asset)},chairsHeld:seats.size,
      chairs:chairOrder.filter(i=>seats.has(i)),chairOrder:[...chairOrder],seats:{...seatsAnswer,setting:clock<seatUntil},supply:{...supply},fraction:supply.minted==null?null:supply.minted/supply.capacity,
      level:levelShown,volumeMapping:'numerical convex-polyhedron volume',faces:faces.length,foundingFrameCaptured:captured,drops:beads.length,ripples:rippling?1:0,dropsIssued,latestBatch,
      entry,entryDuration:ENTRY_SECONDS,entryBlendDuration:CLEAR_AT,entryBlend:tracks.clarity,entryTracks:{...tracks},entryPose,
      renders,meshTriangles:meshCount/3,size:[W,H],sphere:sphere(),field:[FW,FH],energy,syntheticPurchases:false,holderIdentities:false})};
}
