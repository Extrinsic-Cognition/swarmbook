// A native decoder and a frozen surface mask keep the film alive after the
// geometric journey. No scene graph, mesh update or full-screen canvas loop.
export function createEndingFilm(stage,{journey,media,variant,revision,filmSource,volume=.65,onSoundBlocked=()=>{}}) {
  const doc=stage.ownerDocument,view=doc.defaultView;
  const layer=doc.createElement('div');layer.className='galaxy-ending-film';layer.hidden=true;
  layer.setAttribute('aria-hidden','true');
  const base=doc.createElement('img');base.alt='';base.draggable=false;
  const film=doc.createElement('video');film.className='galaxy-ending-projection';
  film.muted=true;film.defaultMuted=true;film.playsInline=true;film.loop=true;film.preload='metadata';film.volume=volume;
  film.setAttribute('muted','');film.setAttribute('playsinline','');film.tabIndex=-1;
  const mask=`url("${media}galaxy-${variant}-film-mask.png?v=${revision}")`;
  const atmosphere='linear-gradient(rgba(255,255,255,var(--horizon-ambient,0)),rgba(255,255,255,var(--horizon-ambient,0)))';
  film.style.maskImage=mask+','+atmosphere;film.style.webkitMaskImage=mask+','+atmosphere;
  layer.append(base,film);journey.after(layer);
  let state={},prepared=false,positioned=false,pending=false,destroyed=false,ticket=0,frame=0;
  let elapsed=0,lastMediaTime=51;
  const listeners=[];
  const on=(object,name,handler)=>{object.addEventListener(name,handler);listeners.push(()=>object.removeEventListener(name,handler));};
  const eligible=()=>!destroyed&&state.completed&&state.wantsPlayback&&state.visible&&!state.hidden&&!state.reduced;
  function fit(){
    const box=journey.getBoundingClientRect(),parent=stage.getBoundingClientRect();
    const ratio=variant==='mobile'?9/16:16/9;
    const width=Math.min(box.width,box.height*ratio),height=width/ratio;
    layer.style.left=`${box.left-parent.left+(box.width-width)/2}px`;
    layer.style.top=`${box.top-parent.top+(box.height-height)/2}px`;
    layer.style.width=`${width}px`;layer.style.height=`${height}px`;
    stage.style.setProperty('--journey-left',layer.style.left);stage.style.setProperty('--journey-top',layer.style.top);
    stage.style.setProperty('--journey-width',`${width}px`);stage.style.setProperty('--journey-height',`${height}px`);
  }
  function reveal(){
    layer.hidden=!(state.completed&&!state.reduced&&positioned&&base.complete&&base.naturalWidth&&film.readyState>=2);
    if(!layer.hidden)stage.dataset.endingFilm='ready';
  }
  function pulse(){
    if(frame||!eligible()||film.paused)return;
    // Begin at exactly the native final frame's intensity; breathe thereafter.
    const now=film.currentTime;
    const delta=now>=lastMediaTime?now-lastMediaTime:Number.isFinite(film.duration)?film.duration-lastMediaTime+now:0;
    elapsed+=Math.min(.2,Math.max(0,delta));lastMediaTime=now;
    const opacity=1-.12*Math.sin(elapsed*.25)**2;
    film.style.opacity=String(opacity);
    const opening=Math.min(1,elapsed/4);
    film.style.setProperty('--horizon-ambient',String(.065*opening*opening*(3-2*opening)));
    stage.dataset.endingFilmTime=film.currentTime.toFixed(2);
    if(film.requestVideoFrameCallback)frame=film.requestVideoFrameCallback(()=>{frame=0;pulse();});
  }
  function stop(){
    ticket++;pending=false;film.pause();
    if(frame&&film.cancelVideoFrameCallback)film.cancelVideoFrameCallback(frame);frame=0;
  }
  function run(){
    reveal();
    if(!eligible()||!positioned){stop();return;}
    film.muted=!state.sound;
    if(!film.paused||pending)return;
    const request=++ticket;pending=true;
    Promise.resolve(film.play()).then(()=>{
      if(request!==ticket||!eligible()){if(!eligible())film.pause();return;}
      reveal();pulse();
    }).catch(error=>{
      if(request!==ticket||!eligible())return;
      // Muted playback remains available if the browser declines audible play.
      if(!film.muted&&error?.name==='NotAllowedError'){
        film.muted=true;onSoundBlocked();
        return film.play().then(()=>{reveal();pulse();}).catch(()=>{});
      }
      stage.dataset.endingFilm='playback-blocked';
    }).finally(()=>{if(request===ticket)pending=false;});
  }
  function prepare(){
    if(prepared||destroyed)return;prepared=true;
    base.src=`${media}galaxy-${variant}-ending-base.png?v=${revision}`;
    film.src=filmSource;
  }
  on(base,'load',reveal);
  on(film,'loadedmetadata',()=>{film.currentTime=Math.min(51,Number.isFinite(film.duration)?film.duration:51);});
  on(film,'seeked',()=>{positioned=true;run();});
  on(film,'canplay',run);on(film,'playing',()=>{reveal();pulse();});
  on(film,'error',()=>{stage.dataset.endingFilm='unavailable';layer.hidden=true;});
  const observer=new view.ResizeObserver(fit);observer.observe(stage);fit();
  return {
    update(next){
      const wasActive=state.completed;state=next;
      if(!state.reduced&&state.visible&&!state.hidden&&state.time>=45.5)prepare();
      if(wasActive&&!state.completed){stop();positioned=false;elapsed=0;lastMediaTime=51;if(film.readyState>0)film.currentTime=51;film.style.opacity='1';film.style.setProperty('--horizon-ambient','0');}
      run();
    },
    destroy(){destroyed=true;stop();observer.disconnect();listeners.forEach(remove=>remove());film.removeAttribute('src');film.load();layer.remove();},
    film,
  };
}
