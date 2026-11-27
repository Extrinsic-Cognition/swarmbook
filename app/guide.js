// The first descent only. Its clock belongs to slope.js; these text planes
// share the same normalized movement as the existing common-chamber sculpture.
const clamp = x => Math.max(0,Math.min(1,x));
const smooth = x => { x=clamp(x); return clamp(x*x*x*(x*(x*6-15)+10)); };
export const GATES = [
  {from:0,to:.21,title:'Project Snowtrace',copy:'Someone has to break the first trail. Test-time compute explores possible solutions, tests ideas and corrects failures. The work should leave a path the next builder can follow.',detail:'Explore → test → learn',flow:'across'},
  {from:.20,to:.41,title:'TRACENET',copy:'Compare methods. Benchmark them. Turn successful reasoning into reusable code. Preserve the behavior while reducing the computation needed to produce it. Spend the next effort where it can still add information.',detail:'Algorithms crystallize → reusable code',flow:'in'},
  {from:.40,to:.61,title:'Reason, then reuse',copy:'At runtime, understand the problem and choose a suitable benchmarked tool from TRACENET. Reuse the precompiled work. Where the trail ends, reason again—and leave a better tool behind.',detail:'Test-time reasoning · precompiled tools',flow:'across'},
  {from:.60,to:.81,title:'A shared frontier',copy:'Many builders explore in parallel. Share chosen methods with sources and benchmarks. Others reuse and improve them. Apply the same optimization to how knowledge itself is created and maintained.',detail:'TRACENET · reuse → refine → contribute',flow:'out'},
  {from:.80,to:.97,title:'Progress compounds',copy:'The ambition: algorithms ossify into the best-known solutions, then improve when a better path is found. PosiVERSE distributes value; NeghiVERSE accumulates it. Less repeated work. More room for discovery.',detail:'The unbearable abundance of synchronicity',flow:'out'},
];

/** A physical text plane: approach, readable passage, then past the camera.
 * Nothing turns on before the first gesture. Text is gone at the wall. */
export function gatePose(x,index) {
  const gate=GATES[index];
  if (!gate || !Number.isFinite(x)) return {visible:false};
  const local=(x-gate.from)/(gate.to-gate.from);
  if (local<=0 || local>=1) return {visible:false};
  const enter=smooth(local/.23), leave=smooth((local-.76)/.24), side=index%2 ? -1 : 1;
  // Enter and leave behind the reading plane; never enlarge text beyond its rail.
  const z=-480*(1-enter)-180*leave;
  return {visible:true,opacity:smooth(local/.14)*(1-smooth((local-.76)/.15)),
    z,x:side*(16*(1-enter)+16*leave),y:-8*(1-enter)-12*leave,
    rotateY:side*(3*(1-enter)-3*leave),rotateX:2*(1-enter)+2*leave,local};
}

/** besideLayoutOf({T, left, width, W}): the camera (assembly.js: scale 1 - .18 weight about the window's middle, then .10 of the width a unit of pan) that sets
 *  the wall, its box [left, left + width] in the window, just past the last caption's widest line T and within the window of width W, a margin each side;
 *  never larger than the usual framing (scale .82), never smaller than .55 (past that the veil keeps the words clear). Pure. */
export function besideLayoutOf({T, left, width, W, m = 24}) {
  const s = Math.max(.55, Math.min(1 - .18, (W - m - (T + m)) / width)), cX = T + m - left * s;
  return {pan: (cX - W * (1 - s) / 2) / (W * .10), weight: (1 - s) / .18};
}

const wire = `<svg class="descent-wire" viewBox="0 0 1600 210" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 10 Q350 50 800 96 Q1250 50 1600 10 M0 32 Q350 72 800 118 Q1250 72 1600 32"/>
  <path d="M160 29V46 M320 47V64 M480 65V82 M640 82V103 M960 82V103 M1120 65V82 M1280 47V64 M1440 29V46"/>
  <path class="descent-diamond" d="M800 86L806 99L800 112L794 99Z M480 61L484 70L480 79L476 70Z M1120 61L1124 70L1120 79L1116 70Z"/>
<circle class="trace-packet" r="8"/><circle class="trace-packet" r="8"/>
</svg>`;

export function createDescent(root,{reduced=matchMedia('(prefers-reduced-motion: reduce)'),dev=false,repeat=false,onRepeatChange=()=>{},outro=null}={}) {
  const scene=root?.querySelector('.descent');
  if (!scene) return {eligible:()=>false,repeatEnabled:()=>false,begin(){},render(){},end(){},setSkip(){},setReplay(){},destroy(){}};
  const doc=root.ownerDocument, head=doc.querySelector('main > header');
  const skip=scene.querySelector('.descent-skip');
  const panel=doc.querySelector('.descent-dev'), repeatButton=panel?.querySelector('.descent-repeat');
  const replayButton=panel?.querySelector('.descent-replay'), status=panel?.querySelector('.descent-dev-status');
  let consumed=false,running=false,skipAction=()=>{},replayAction=()=>{},reviewAction=()=>{},lastReadable=-1,besideLayout=null;
  let repeating=dev&&repeat;
  const eligible=({replay=false}={})=>(!consumed||repeating||replay)&&!reduced.matches&&root.dataset.ready==='true';
  const updateControls=()=>{
    if(!panel)return;
    panel.hidden=!dev;
    if(!dev)return;
    repeatButton.setAttribute('aria-pressed',String(repeating));
    repeatButton.textContent=`Dev · repeat: ${repeating?'ON':'OFF'}`;
    replayButton.disabled=!eligible({replay:true});
    status.textContent=reduced.matches?'Reduced motion is on.':root.dataset.ready!=='true'?'Waiting for the sphere…':running?'Playing · scroll up to exit.':repeating?'Every downward pass plays the movie.':consumed?'Finished · watch again or turn repeat on.':'First descent ready.';
  };
  const onRepeat=()=>{repeating=!repeating;updateControls();onRepeatChange(repeating);};
  const onReplay=()=>{if(eligible({replay:true})){if(reviewSelect)reviewSelect.value='';replayAction();}};
  // The existing local preview controls can hold every authored step for review.
  let reviewSelect=null,reviewLabel=null;
  const onReview=()=>{if(reviewSelect.value===''){onReplay();return;}const index=Number(reviewSelect.value);if(GATES[index])reviewAction(index,(GATES[index].from+GATES[index].to)/2);};
  if(dev&&panel){
    reviewLabel=doc.createElement('label');reviewLabel.className='descent-review';reviewLabel.textContent='Preview step ';
    reviewSelect=doc.createElement('select');reviewSelect.setAttribute('aria-label','Preview introduction step');
    reviewSelect.innerHTML='<option value="">Watch animation</option>'+GATES.map((gate,i)=>`<option value="${i}">${i+1}. ${gate.title}</option>`).join('');
    reviewSelect.addEventListener('change',onReview);reviewLabel.appendChild(reviewSelect);panel.appendChild(reviewLabel);
  }
  if(dev){repeatButton?.addEventListener('click',onRepeat);replayButton?.addEventListener('click',onReplay);}
  const Observer=doc.defaultView?.MutationObserver;
  const readyObserver=dev&&Observer?new Observer(updateControls):null;
  readyObserver?.observe(root,{attributes:true,attributeFilter:['data-ready']});
  if(dev)reduced.addEventListener?.('change',updateControls);
  const rails=[];
  const planes=GATES.map((gate,index)=>{
    const rail=doc.createElement('div');rail.className='descent-rail';rail.dataset.side=index%2?'right':'left';rails.push(rail);
    const plane=doc.createElement('div'); plane.className='descent-gate'; plane.dataset.gate=String(index);
    plane.setAttribute('aria-hidden','true');
    // Fixed authored strings only; no chain/account content enters this markup.
    plane.innerHTML=`<div class="descent-depth">${wire}</div><div class="descent-words"><h2>${gate.title}</h2><div class="descent-caption"><p>${gate.copy}</p>${gate.detail?`<span class="descent-detail">${gate.detail}</span>`:''}</div></div>`;
    rail.appendChild(plane);scene.appendChild(rail);return plane;
  });
  const packets=planes.map(plane=>Array.from(plane.querySelectorAll('.trace-packet')));
  const hide=()=>{ scene.dataset.active='false';scene.setAttribute('aria-hidden','true');skip.hidden=true;for(const p of planes){p.style.visibility='hidden';p.setAttribute('aria-hidden','true');} };
  const updateHead=()=>scene.style.setProperty('--descent-head',`${Math.max(0,(head?.getBoundingClientRect().bottom||0)-scene.getBoundingClientRect().top)+28}px`);
  const onSkip=()=>skipAction();skip.addEventListener('click',onSkip);
  hide();updateControls();
  return {
    eligible,
    repeatEnabled:()=>repeating,
    begin(){
      outro?.reset();delete root.dataset.descentPart;running=true;root.dataset.descent='playing';scene.dataset.active='true';scene.setAttribute('aria-hidden','false');skip.style.opacity='';skip.style.pointerEvents='';
      skip.hidden=false;lastReadable=-1;besideLayout=null;updateHead();updateControls();
    },
    render(x){
      if(!running)return;
      scene.dataset.progress=clamp(x).toFixed(4);
      // The phone camera makes one lateral lane for the current caption. Its
      // scale holds while reading, and the pan changes in the gaps between gates.
      // THE WALL LANDS CLEAR (Nov 19 2026, his "do qa, continue. frame by frame until here" over the last caption standing on the wall's first tile): the last
      // caption has left by .955 (its gate ends at .97), and only then does the camera let the wall slide into its own place
      const framing=smooth(x/.075)*(1-smooth((x-.955)/.045));
      skip.style.opacity=(1-smooth((x-.95)/.035)).toFixed(3);skip.style.pointerEvents=x>.97?'none':'';   // nothing to skip once the wall is landing
      let side=1;
      for(let i=1;i<GATES.length;i++)side+=2*(i%2?-1:1)*smooth((x-(GATES[i].from-.025))/.05);
      // THE WALL ASSEMBLES BESIDE THE LAST CAPTION: while it reads, the camera holds the wall a little smaller and further from it, so no tile stands
      // under its words; released with the framing once it has left (on a phone the lane is too narrow: the veil in assembly.js keeps the words clear)
      const W=doc.defaultView.innerWidth, beside=(W>720?1:0)*smooth((x-(GATES[4].from-.025))/.05);
      let weight=framing, pan=framing*side;
      if(beside>0){
        // the scale and pan that put the wall's left edge just past the last caption's widest line (measured as set, while it reads, then held so the release
        // is one straight move into the wall's place), within the window; assembly.js's camera: scale 1 - .18 weight about the window's middle, .10 of the width a unit of pan
        if(x<.93||!besideLayout){
          const wall=root.querySelector('#wall')?.getBoundingClientRect(), lines=doc.createRange();
          let T=-Infinity; for(const el of planes[4].querySelectorAll('h2, p, .descent-detail')){lines.selectNodeContents(el);for(const q of lines.getClientRects())if(q.width>=1)T=Math.max(T,q.right);}
          if(wall&&wall.width>0&&T>0)besideLayout=besideLayoutOf({T,left:wall.left,width:wall.width,W});
        }
        if(besideLayout){weight=framing*(1+(besideLayout.weight-1)*beside); pan=framing*(side+(besideLayout.pan-side)*beside);}
      }
      root.descentFraming={weight,pan};
      // Change material in the gap between the last two captions, not through readable text: a dawn from the chamber's heart outward (guide.css
      // masks the night by --intro-dawn), never the whole night thinned to grey at once.
      const daylight=smooth((x-.785)/.03);
      scene.style.setProperty('--descent-day',`${(daylight*100).toFixed(2)}%`);
      root.style.setProperty('--intro-night',String(1-daylight));root.style.setProperty('--intro-dawn',daylight.toFixed(4));
      let readable=-1;
      planes.forEach((plane,index)=>{
        const pose=gatePose(x,index);
        plane.style.visibility=pose.visible?'visible':'hidden';
        if(!pose.visible)return;
        plane.style.opacity=pose.opacity.toFixed(4);
        plane.style.transform=`translate3d(${pose.x.toFixed(2)}px,${pose.y.toFixed(2)}px,${pose.z.toFixed(2)}px) rotateY(${pose.rotateY.toFixed(2)}deg) rotateX(${pose.rotateX.toFixed(2)}deg)`;
        // Illustrative packets share the film's clock and show the direction of flow.
        packets[index].forEach((packet,j)=>{
          const k=(pose.local*3+j*.5)%1, flow=GATES[index].flow;
          const px=flow==='out'?800+(j?-1:1)*760*k:flow==='in'?800+(j?-1:1)*760*(1-k):40+1520*k;
          packet.setAttribute('cx',px.toFixed(2));packet.setAttribute('cy',(10+86*(1-Math.abs(px-800)/800)).toFixed(2));
        });
        if(pose.opacity>.8 && pose.local>.18 && pose.local<.85)readable=index;
      });
      if(readable!==lastReadable){planes.forEach((plane,i)=>plane.setAttribute('aria-hidden',String(i!==readable)));lastReadable=readable;}
    },
    prepareOutro(){
      if(running&&root.dataset.descentPart==='anatomy')return true;
      if(!running||!outro?.prepare?.())return false;
      root.dataset.descentPart='anatomy';root.descentFraming=null;
      scene.dataset.active='false';scene.setAttribute('aria-hidden','true');
      // The original skip control follows the film beyond the pinned scene.
      if(doc.body){doc.body.appendChild(skip);skip.dataset.outro='true';skip.textContent='Finish walkthrough ↓';skip.style.opacity='';skip.style.pointerEvents='';}
      updateControls();return true;
    },
    outroTarget:()=>outro.target(),
    renderOutro:p=>outro.render(p),
    end({completed=false}={}){
      consumed=true;running=false;root.dataset.descent='done';root.descentFraming=null;
      if(completed)outro?.render(1);else outro?.reset();
      hide();delete root.dataset.descentPart;
      if(skip.dataset.outro){scene.appendChild(skip);delete skip.dataset.outro;skip.textContent='Skip to the civilizations ↓';}
      skip.style.opacity='';skip.style.pointerEvents='';
      updateControls();
    },
    setSkip(fn){skipAction=typeof fn==='function'?fn:()=>{};},
    setReplay(fn){replayAction=typeof fn==='function'?fn:()=>{};},
    setReview(fn){reviewAction=typeof fn==='function'?fn:()=>{};},
    reviewing(index){if(status)status.textContent=`Reviewing step ${index+1} of ${GATES.length} · held for inspection.`;},
    resize:updateHead,
    destroy(){
      outro?.destroy();running=false;root.descentFraming=null;hide();skip.removeEventListener('click',onSkip);rails.forEach(r=>r.remove());
      reviewSelect?.removeEventListener('change',onReview);reviewLabel?.remove();
      readyObserver?.disconnect();reduced.removeEventListener?.('change',updateControls);
      repeatButton?.removeEventListener('click',onRepeat);replayButton?.removeEventListener('click',onReplay);
      if(panel)panel.hidden=true;
    },
  };
}
