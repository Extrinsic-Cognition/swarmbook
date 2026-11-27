// The anime is direction: blocking, cuts and light, never a silhouette mask.
// Native Hades rigs in an authored rocky stage. The scenery is a reconstruction,
// not extracted film geometry. One target on the hero's renderer, no second clock.
import * as THREE from 'three';
import {GLTFLoader} from '../vendor/embertide-app/ui/intro/room/procedural/GLTFLoader.js';
import {guidedShot, makeShotAdmission, stageDirection} from './film-guided-shot.mjs?v=stage-3';

const W = 1280, H = 720;
export function createGuidedAthena({renderer, source, record, onReady}) {
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(43, W / H, .03, 160);
  scene.background = new THREE.Color('#142a36');
  scene.fog = new THREE.FogExp2('#193b49', .027);
  const target = new THREE.WebGLRenderTarget(W, H, {depthBuffer: true, type: THREE.HalfFloatType});
  target.texture.colorSpace = THREE.NoColorSpace;
  const admit = makeShotAdmission(), owned = new Set(), materials = new Set(), textures = new Set();
  let disposed = false, readyToPaint = false, last = NaN, lastTexture = source;
  let model = null, fighter = null, lastCalls = 0, lastTriangles = 0;
  const hair = [], joints = new Map();
  const rest = o => ({node:o, q:o.quaternion.clone()});
  const own = x => { owned.add(x); return x; };
  const mat = x => { materials.add(x); return x; };
  const matte = (color) => mat(new THREE.MeshLambertMaterial({color, flatShading:true}));
  const rock = matte('#62818c'), ledgeRock = matte('#789aa5');
  const gold = mat(new THREE.MeshStandardMaterial({color:'#c4a461', roughness:.73, metalness:.25}));
  const mesh = (geo, material, xyz, scale, parent = scene) => {
    const m = new THREE.Mesh(own(geo), material); if(xyz) m.position.set(...xyz); if(scale) m.scale.set(...scale); parent.add(m); return m;
  };
  // These planes and silhouettes have depth in metres; they remain when no movie pixels are sampled.
  mesh(new THREE.CylinderGeometry(19,22,1.3,48), rock, [0,-.7,0]);
  const seam = mat(new THREE.LineBasicMaterial({color:'#66818a',transparent:true,opacity:.23}));
  const seams=[];
  for(let i=-12;i<=12;i+=3) {
    seams.push(i,.001,-16,i,.001,15, -16,.001,i,16,.001,i);
  }
  const lineGeo = own(new THREE.BufferGeometry()); lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(seams,3));
  scene.add(new THREE.LineSegments(lineGeo,seam));
  const rim = mat(new THREE.MeshBasicMaterial({color:'#789da0',transparent:true,opacity:.23,side:THREE.DoubleSide}));
  const ring = mesh(new THREE.RingGeometry(3.9,3.93,64),rim,[0,.012,0]); ring.rotation.x=-Math.PI/2;
  // Fixed seeded rock formations, not a simulation or per-frame reconstruction.
  for(let i=0;i<22;i++) {
    const a=i*2.39996, radius=16+(i%4)*1.8, h=3+(i*7%11);
    const m=mesh(new THREE.IcosahedronGeometry(1,1),i%2?rock:ledgeRock,[Math.cos(a)*radius,h*.5-1,Math.sin(a)*radius],[2.8+(i%3),h*.72,2.7]);
    m.rotation.y=a*.7;
  }
  const anchor = guidedShot(record,30)?.feet ?? [4.879,4.875,7.651];
  const platform = new THREE.Group(); platform.position.fromArray(anchor); scene.add(platform);
  mesh(new THREE.CylinderGeometry(1.1,2,4.9,7),ledgeRock,[0,-2.51,1],[1,1,1.6],platform);
  mesh(new THREE.BoxGeometry(2.5,.18,2.8),rock,[0,-.10,1.05],null,platform);
  mesh(new THREE.BoxGeometry(2.55,.035,2.85),gold,[0,-.015,1.05],null,platform);
  // The gilded prow curl from the reference, modelled as a continuous tube.
  const curlPoints=[];
  for(let i=0;i<26;i++) {const a=-.5+i/25*Math.PI*1.75, r=.48*(1-i/42);curlPoints.push(new THREE.Vector3(.52,1.05+Math.sin(a)*r,.32+Math.cos(a)*r));}
  curlPoints.unshift(new THREE.Vector3(.52,.03,.18),new THREE.Vector3(.52,.75,.18));
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curlPoints),48,.047,6,false),gold,null,null,platform);
  // Baked contact shade costs one quad. No continuously recomputed shadow maps.
  const shade = mat(new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,
    vertexShader:'varying vec2 p;void main(){p=uv*2.-1.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec2 p;void main(){float a=.48*(1.-smoothstep(.08,1.,length(p)));gl_FragColor=vec4(.02,.03,.05,a);}' }));
  for(const pos of [[anchor[0],anchor[1]+.008,anchor[2]],[0,.02,0]]) {const s=mesh(new THREE.PlaneGeometry(1.6,1.2),shade,pos);s.rotation.x=-Math.PI/2;}
  scene.add(new THREE.HemisphereLight('#dfeefa','#59647a',2.6));
  const faceKey=new THREE.DirectionalLight('#fff1dc',1.6);faceKey.position.set(4,10,-5);scene.add(faceKey);
  const moon=new THREE.DirectionalLight('#b5e1f0',2.0);moon.position.set(-8,13,8);scene.add(moon);
  const rimLight=new THREE.DirectionalLight('#b8a7ee',1.2);rimLight.position.set(8,9,-6);scene.add(rimLight);
  const glow = new THREE.PointLight('#ffda83',0,35,1.2);glow.position.set(0,5,0);scene.add(glow);
  const key = new THREE.DirectionalLight('#ffe5ad',0);key.position.set(-3,8,-3);scene.add(key);
  // The light column is a volume with world-space depth; its film-time envelope also lights the rigs.
  const beamMat = mat(new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,
    uniforms:{power:{value:0}},
    vertexShader:'varying vec2 p;void main(){p=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform float power;varying vec2 p;void main(){float a=pow(abs(cos(p.x*6.283185)),3.)*.2+.06;gl_FragColor=vec4(1.,.72,.28,a*power);}' }));
  const beam=mesh(new THREE.CylinderGeometry(1,1,32,40,1,true),beamMat,[0,16,0]);
  const coreMat=mat(new THREE.MeshBasicMaterial({color:'#fff5ce',transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
  const core=mesh(new THREE.CylinderGeometry(.16,.16,32,20,1,true),coreMat,[0,16,0]);
  const halo=mesh(new THREE.RingGeometry(.65,1.1,64),coreMat,[0,.04,0]);halo.rotation.x=-Math.PI/2;
  const motesGeo=own(new THREE.BufferGeometry()),motesPos=[];
  for(let i=0;i<90;i++){const a=i*2.39996; const r=.4+(i%13)/6; motesPos.push(Math.cos(a)*r,(i%23)*.65,Math.sin(a)*r);}
  motesGeo.setAttribute('position',new THREE.Float32BufferAttribute(motesPos,3));
  const motesMat=mat(new THREE.PointsMaterial({color:'#ffe9a7',size:.045,transparent:true,opacity:0,depthWrite:false}));
  const motes=new THREE.Points(motesGeo,motesMat);scene.add(motes);
  const gradient = new THREE.DataTexture(new Uint8Array([80,165,235,255]),4,1,THREE.RedFormat);
  gradient.minFilter=gradient.magFilter=THREE.NearestFilter;gradient.needsUpdate=true;textures.add(gradient);
  function looks(root) {
    root.traverse(o=>{
      if(!o.isMesh)return;
      own(o.geometry);
      const originals=Array.isArray(o.material)?o.material:[o.material];
      const next=originals.map(original=>{
        if(original.map)textures.add(original.map);materials.add(original);
        return mat(new THREE.MeshToonMaterial({map:original.map,gradientMap:gradient,color:'#fff3ff',side:THREE.DoubleSide}));
      });
      o.material=Array.isArray(o.material)?next:next[0];o.frustumCulled=false;
    });
  }
  const loader=new GLTFLoader();
  const ready=Promise.all([
    loader.loadAsync(new URL('./athena.hades.glb',import.meta.url).href),
    loader.loadAsync(new URL('./seiya.hades.glb',import.meta.url).href).catch(()=>null),
  ]).then(async ([athena,seiya])=>{
    model=athena.scene;looks(model);scene.add(model);
    model.traverse(o=>{if(o.isBone){joints.set(o.name,rest(o));if(o.name.startsWith('h_jnt_hair'))hair.push(rest(o));}});
    if(seiya){fighter=seiya.scene;looks(fighter);fighter.position.set(0,0,0);fighter.rotation.y=.65;scene.add(fighter);}
    if(disposed){release();return;}
    pose(guidedShot(record,30),30);
    await renderer.compileAsync(scene,camera);
    if(!disposed){readyToPaint=true;onReady?.();}
  }).catch(error=>console.warn('Native Athena unavailable; keeping the film.',error));
  const axis=new THREE.Vector3(0,0,1),q=new THREE.Quaternion();
  function turn(name,angle){const b=joints.get(name);if(b)b.node.quaternion.copy(b.q).multiply(q.setFromAxisAngle(axis,angle));}
  function pose(plan,t){
    const d=stageDirection(plan,t);
    camera.position.fromArray(d.eye);camera.up.set(0,1,0);camera.fov=d.fov;
    camera.lookAt(new THREE.Vector3(...d.look));camera.updateProjectionMatrix();
    model.position.fromArray(plan.feet);model.rotation.y=plan.yaw;
    turn('h_jnt_head',d.head);turn('h_jnt_ubody',d.chest);
    // Deterministic rig offsets from bind: no integration, no accumulating drift when seeking.
    for(let i=0;i<hair.length;i++){
      const b=hair[i],root=/hair(1|2|3|4|5|8|36)$/.test(b.node.name);
      b.node.quaternion.copy(b.q).multiply(q.setFromAxisAngle(axis,(root?.055:.018)*Math.sin(t*1.25-i*.47)*d.wind));
    }
    beam.visible=core.visible=halo.visible=motes.visible=d.gold>0;
    beam.scale.set(d.width,1,d.width);core.scale.set(d.width,1,d.width);halo.scale.setScalar(d.width*1.3);
    beamMat.uniforms.power.value=d.gold;coreMat.opacity=.54*d.gold;motesMat.opacity=.65*d.gold;
    motes.rotation.y=t*.13;glow.intensity=d.gold*13;key.intensity=d.gold*3;
    scene.fog.color.set(d.gold>.5?'#544b36':'#193b49');
  }
  function release(){for(const g of owned)g.dispose();for(const m of materials)m.dispose();for(const t of textures)t.dispose();}
  return {
    ready,
    frame(t){
      const plan=guidedShot(record,t);
      if(!admit(plan,readyToPaint)){last=NaN;return source;}
      if(t===last)return lastTexture;
      const started=performance.now();pose(plan,t);
      const previous=renderer.getRenderTarget(),tone=renderer.toneMapping,exposure=renderer.toneMappingExposure,clear=renderer.getClearColor(new THREE.Color()),alpha=renderer.getClearAlpha();
      try {
        renderer.setRenderTarget(target);renderer.toneMapping=THREE.NoToneMapping;
        renderer.render(scene,camera);lastCalls=renderer.info.render.calls;lastTriangles=renderer.info.render.triangles;
      } finally {renderer.setRenderTarget(previous);renderer.toneMapping=tone;renderer.toneMappingExposure=exposure;renderer.setClearColor(clear,alpha);}
      this.lastCost={cpuMs:performance.now()-started,calls:lastCalls,triangles:lastTriangles};
      last=t;lastTexture=target.texture;return lastTexture;
    },
    lastCost:null,
    dispose(){disposed=true;target.dispose();release();},
  };
}
