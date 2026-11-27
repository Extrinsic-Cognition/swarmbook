// Keep the outgoing scene on screen until the incoming scene can take its place.
// Geometry is a visual handoff; it does not turn illustrated members into real ones.
export function createSurfaceTransition(root,stage,panel,{reduced,onReveal=()=>{}}){
  const viewport=root.querySelector('.galaxy-viewport');
  const backdrop=document.createElement('div');backdrop.className='ws-backdrop';backdrop.setAttribute('aria-hidden','true');panel.prepend(backdrop);
  const notice=document.createElement('p');notice.className='warm-arrival-status';notice.hidden=true;notice.setAttribute('role','status');notice.textContent='Opening the society…';viewport.append(notice);
  let serial=0,animations=[],settle=null,waitingTimer=0;
  const scene=(mode,fadeMs=0)=>root.dispatchEvent(new CustomEvent('warm:surface-change',{detail:{mode,fadeMs}}));
  function clear(){
    serial++;clearTimeout(waitingTimer);animations.splice(0).forEach(animation=>animation.cancel());
    notice.hidden=true;root.removeAttribute('aria-busy');
    viewport.style.removeProperty('height');viewport.style.removeProperty('min-height');
    stage.style.removeProperty('height');panel.style.removeProperty('height');
  }
  function finish(mode){
    clear();settle=null;root.dataset.surface=mode;root.dataset.crossing=mode;
    stage.hidden=mode==='state';stage.inert=mode==='state';stage.toggleAttribute('aria-hidden',mode==='state');
    panel.hidden=mode!=='state';panel.inert=mode!=='state';
    scene(mode);if(mode==='state')onReveal();
  }
  function animate(element,frames,duration,delay=0){
    if(!element)return;
    const animation=element.animate(frames,{duration,delay,fill:'both',easing:'ease-in-out'});animation.id='warm-crossing';animations.push(animation);return animation;
  }
  function background(){
    const variant=root.dataset.galaxyVideoVariant||'desktop';
    const media=root.dataset.galaxyMedia||'./warm-media/film-score-1/';
    backdrop.style.backgroundImage=`linear-gradient(180deg,rgba(12,30,28,.97) 10%,rgba(12,30,28,.96) 55%,rgba(12,30,28,.90)),url("${media}galaxy-${variant}-ending-base.png")`;
  }
  async function enter({ready=Promise.resolve(),instant=false}={}){
    if(settle)finish(settle);
    clear();const ticket=serial;settle='state';background();
    if(instant||reduced.matches){finish('state');return;}
    root.dataset.crossing='waiting';root.setAttribute('aria-busy','true');notice.hidden=true;
    waitingTimer=setTimeout(()=>{if(serial===ticket)notice.hidden=false;},200);
    // Slow RPC must not strand someone behind the doorway; the same landscape
    // remains underneath the explicit Connecting state if it is not ready yet.
    let deadline;
    await Promise.race([Promise.resolve(ready).catch(()=>{}),new Promise(resolve=>{deadline=setTimeout(resolve,1800);})]);
    clearTimeout(deadline);clearTimeout(waitingTimer);
    if(serial!==ticket)return;
    notice.hidden=true;root.removeAttribute('aria-busy');
    const before=viewport.getBoundingClientRect();
    stage.style.height=`${before.height}px`;
    root.dataset.surface='state';root.dataset.crossing='entering';
    stage.hidden=false;stage.inert=true;stage.setAttribute('aria-hidden','true');panel.hidden=false;panel.inert=true;
    const after=viewport.getBoundingClientRect();panel.style.height=`${after.height}px`;
    viewport.style.minHeight='0';viewport.style.height=`${before.height}px`;
    onReveal();
    scene('state',350);
    animate(viewport,[{height:`${before.height}px`},{height:`${after.height}px`}],650);
    animate(stage,[{opacity:1},{opacity:0}],650);
    animate(panel,[{opacity:0},{opacity:1}],650);
    const completed=animations.map(animation=>animation.finished.catch(()=>{}));
    await Promise.all(completed);
    if(serial===ticket)finish('state');
  }
  async function leave({instant=false}={}){
    const wasWaiting=root.dataset.crossing==='waiting';
    if(settle)finish(settle);
    clear();const ticket=serial;settle='film';
    if(instant||reduced.matches||wasWaiting){finish('film');return;}
    const before=viewport.getBoundingClientRect();
    root.dataset.surface='film';stage.hidden=false;stage.inert=true;panel.hidden=false;panel.inert=true;root.dataset.crossing='leaving';
    const after=viewport.getBoundingClientRect();
    stage.style.height=`${after.height}px`;panel.style.height=`${before.height}px`;
    viewport.style.minHeight='0';viewport.style.height=`${before.height}px`;
    animate(viewport,[{height:`${before.height}px`},{height:`${after.height}px`}],650);
    animate(panel,[{opacity:1},{opacity:0}],650);
    animate(stage,[{opacity:0},{opacity:1}],650);
    scene('film',350);
    await Promise.all(animations.map(animation=>animation.finished.catch(()=>{})));
    if(serial===ticket)finish('film');
  }
  reduced.addEventListener('change',()=>{if(reduced.matches&&settle)finish(settle);});
  // A rotated display should settle into its responsive layout, not retain an
  // old portrait stage size or leave a half-transparent layer intercepting input.
  window.addEventListener('resize',()=>{if(settle&&root.dataset.crossing!=='waiting')finish(settle);});
  return {enter,leave,finish};
}
