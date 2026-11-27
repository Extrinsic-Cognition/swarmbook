import {createEndingFilm} from './warm-ending-film.js?v=film-score-1';
import {createGalaxyAfterglow} from './warm-galaxy-afterglow.js?v=film-horizon-1';
import {createJourneySoundtrack} from './warm-journey-soundtrack.js?v=audio-carry-1';

// The movie contains the geometry. Only these small presentation cues run here.
export const JOURNEY_SECONDS = 51;
const FUTURE_AT = 49.2;
const AFTERGLOW_PREFETCH_AT = 45.5;
const FILM_VOLUME = .65;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const smooth = x => { x = clamp(x, 0, 1); return x*x*(3-2*x); };
const blend = (from, to, amount) => '#'+[0,1,2].map(i => Math.round(
  parseInt(from.slice(1+i*2,3+i*2),16)*(1-amount)+parseInt(to.slice(1+i*2,3+i*2),16)*amount
).toString(16).padStart(2,'0')).join('');

export function journeyCue(seconds) {
  return {final:clamp(Number(seconds)||0,0,JOURNEY_SECONDS)>=FUTURE_AT};
}

export function initializeGalaxyPlayer(root) {
  if(root.dataset.galaxyPlayerInitialized==='true')return;
  const stage=root.querySelector('.galaxy-theater');
  const viewport=root.querySelector('.galaxy-viewport');
  if(!stage||!viewport)return;
  const doc=root.ownerDocument;
  const heroToggle=doc.querySelector(`[data-galaxy-toggle="${root.id}"]`);
  let video=root.querySelector('[data-galaxy-video]');
  if(!video) {
    const canvas=root.querySelector('canvas');
    video=doc.createElement('video');
    video.setAttribute('data-galaxy-video','');
    video.className='galaxy-video';
    video.setAttribute('aria-label',canvas?.getAttribute('aria-label')||'From Claudio to a galaxy of swarms');
    if(canvas)canvas.replaceWith(video);else stage.prepend(video);
  }
  const controls=root.querySelector('.galaxy-controls');
  const future=root.querySelector('.galaxy-future');
  const range=controls?.querySelector('input[type="range"]');
  const status=root.querySelector('[data-galaxy-status]');
  const pause=root.querySelector('[data-galaxy-pause]');
  const replay=root.querySelector('[data-galaxy-replay]');
  const sound=root.querySelector('[data-galaxy-sound]');
  const worldSound=root.querySelector('[data-ww-sound]');
  if(!controls||!future||!range||!pause||!replay||!sound)return;
  let fullscreen=root.querySelector('[data-galaxy-fullscreen]');
  if(!fullscreen) {
    fullscreen=doc.createElement('button');fullscreen.type='button';
    fullscreen.setAttribute('data-galaxy-fullscreen','');fullscreen.textContent='Full screen';
    controls.append(fullscreen);
  }
  let start=root.querySelector('[data-galaxy-start]');
  if(!start) {
    start=doc.createElement('button');start.type='button';start.className='galaxy-start';
    start.setAttribute('data-galaxy-start','');start.textContent='Play journey';start.hidden=true;
    stage.append(start);
  }
  const mobile=matchMedia('(max-width:700px)').matches;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const variant=mobile?'mobile':'desktop';
  const media=root.dataset.galaxyMedia||'./warm-media/film-mothership-1/';
  const revision='film-mothership-1';
  const openingPoster=`${media}galaxy-${variant}-poster.jpg?v=${revision}`;
  const finalPoster=`${media}galaxy-${variant}-still.jpg?v=${revision}`;
  const soundStart=doc.createElement('button');
  soundStart.type='button';soundStart.className='galaxy-sound-start';
  soundStart.textContent='Enable sound';soundStart.hidden=true;
  soundStart.setAttribute('data-galaxy-sound-start','');
  soundStart.setAttribute('aria-label','Enable the film soundtrack');stage.append(soundStart);
  const listeners=[];
  let visible=false,wantsPlayback=!reduced.matches,staticEnding=reduced.matches;
  let surfaceSuspended=root.dataset.surface==='state';
  let surfaceMode=surfaceSuspended?'state':'film';
  let surfaceFading=false,surfaceFadeFrame=0,surfaceFadeTicket=0;
  let completed=false,blocked=false,failed=false,destroyed=false,pendingSeek=null;
  let soundEnabled=true,soundNeedsGesture=false,playRequest=0,playPending=false;
  let frame=0,hideTimer=0,lastReveal=0,lastCue='',lastTheme=-1;
  let keyboardMode=false,dragging=false,sourceAssigned=false;
  let afterglow=null,afterglowLoading=false,pageSuspended=false;
  const afterglowAbort=new AbortController();
  const soundtrack=createJourneySoundtrack(root,{
    source:'./warm-media/fantasia-1/fantasia-soundtrack.m4a?v=audio-carry-1',volume:FILM_VOLUME,
    onSoundBlocked:()=>{soundEnabled=false;soundNeedsGesture=true;updateSoundButton();sync();}
  });
  const endingFilm=createEndingFilm(stage,{journey:video,media,variant,revision,
    filmSource:'./warm-media/fantasia-1/fantasia-projection.mp4',volume:FILM_VOLUME,
    onSoundBlocked:()=>{soundEnabled=false;soundNeedsGesture=true;updateSoundButton();sync();}});
  const on=(element,event,handler,options)=>{
    element.addEventListener(event,handler,options);
    listeners.push(()=>element.removeEventListener(event,handler,options));
  };
  const position=()=>staticEnding||completed?JOURNEY_SECONDS:
    clamp(pendingSeek??video.currentTime??0,0,JOURNEY_SECONDS);
  const canRun=()=>!surfaceSuspended&&!surfaceFading&&!destroyed&&visible&&!doc.hidden&&wantsPlayback&&!staticEnding&&!completed;
  function syncAfterglow(t=position()) {
    const state=()=>({active:!staticEnding&&(completed||position()>=JOURNEY_SECONDS),
      visible:visible&&!destroyed&&!surfaceSuspended,reduced:reduced.matches,hidden:doc.hidden||pageSuspended||!wantsPlayback});
    if(!afterglow&&!afterglowLoading&&!destroyed&&!surfaceSuspended&&visible&&!doc.hidden&&!pageSuspended&&
       !reduced.matches&&!staticEnding&&t>=AFTERGLOW_PREFETCH_AT){
      afterglowLoading=true;
      fetch(`${media}galaxy-${variant}-electric.json?v=${revision}`,{signal:afterglowAbort.signal})
        .then(response=>{if(!response.ok)throw Error('Electric field unavailable');return response.json();})
        .then(data=>{
          if(destroyed)return;
          afterglow=createGalaxyAfterglow(stage,{data,video});
          root.dataset.galaxyAfterglow='ready';afterglow.update(state());
        }).catch(error=>{
          if(error.name!=='AbortError')root.dataset.galaxyAfterglow='unavailable';
        });
    }
    afterglow?.update(state());
  }
  const stopFrames=()=>{
    if(frame&&video.cancelVideoFrameCallback)video.cancelVideoFrameCallback(frame);
    frame=0;
  };
  function updateSoundButton() {
    video.muted=true;
    for(const button of [sound,worldSound].filter(Boolean)){
      button.textContent=soundEnabled?'Sound on':soundNeedsGesture?'Enable sound':'Sound off';
      button.setAttribute('aria-pressed',String(soundEnabled));
      button.setAttribute('aria-label',soundEnabled?'Mute the Fantasia soundtrack':'Enable the Fantasia soundtrack');
    }
    soundStart.hidden=!soundNeedsGesture||staticEnding;
  }
  function sync(seconds=position()) {
    const t=staticEnding||completed?JOURNEY_SECONDS:clamp(seconds,0,JOURNEY_SECONDS);
    const cue=journeyCue(t),key=JSON.stringify(cue);
    if(key!==lastCue) {
      future.hidden=!cue.final;future.inert=!cue.final;
      stage.classList.toggle('has-future',cue.final);lastCue=key;
    }
    const theme=Math.round(smooth((t-36.5)/7)*100);
    if(theme!==lastTheme) {
      stage.style.setProperty('--galaxy-ink',blend('#2B2620','#ece5cf',theme/100));
      stage.style.setProperty('--galaxy-gold',blend('#C99B3F','#d9c184',theme/100));
      stage.style.setProperty('--galaxy-back',blend('#faf9f5','#101c1a',theme/100));
      lastTheme=theme;
    }
    soundStart.hidden=!soundNeedsGesture||staticEnding;
    range.value=String(t);
    range.setAttribute('aria-valuetext',`${Math.round(t)} of ${JOURNEY_SECONDS} seconds`);
    if(status)status.textContent=`${String(Math.floor(t)).padStart(2,'0')} / 51`;
    pause.textContent=completed?(wantsPlayback?'Pause':'Play'):video.paused||staticEnding?'Play':'Pause';
    pause.setAttribute('aria-label',completed?(wantsPlayback?'Pause the background film':'Play the background film'):video.paused||staticEnding?'Play the journey':'Pause the journey');
    pause.setAttribute('aria-pressed',String(completed?wantsPlayback:!video.paused&&!staticEnding));
    if(heroToggle) {
      const stopped=video.paused||staticEnding||completed;
      heroToggle.textContent=completed?'↺':stopped?'▷':'Ⅱ';
      heroToggle.setAttribute('aria-label',completed?'Replay the journey':stopped?'Play the journey':'Pause the journey');
      heroToggle.setAttribute('aria-pressed',String(stopped));
    }
    root.dataset.time=t.toFixed(2);
    syncAfterglow(t);
    endingFilm.update({time:t,completed,wantsPlayback,visible,reduced:reduced.matches||staticEnding,hidden:doc.hidden||pageSuspended||surfaceSuspended,sound:false});
    soundtrack.update({time:surfaceMode==='world'?48:t,freeRunning:surfaceMode==='world'||completed,
      playing:surfaceMode==='world'||completed?wantsPlayback:!video.paused&&!staticEnding,
      visible,hidden:doc.hidden||pageSuspended||surfaceMode==='state'||destroyed,
      sound:soundEnabled,rate:surfaceMode==='world'||completed?1:video.playbackRate});
  }
  function followFrames() {
    if(frame||!video.requestVideoFrameCallback||video.paused||!canRun())return;
    frame=video.requestVideoFrameCallback((_,metadata)=>{
      frame=0;if(destroyed)return;
      sync(metadata.mediaTime);followFrames();
    });
  }
  function showControls() {
    if(destroyed||surfaceMode!=='film')return;
    stage.classList.add('galaxy-controls-visible');
    clearTimeout(hideTimer);
    hideTimer=setTimeout(()=>{
      if(dragging||(keyboardMode&&controls.contains(doc.activeElement)))return;
      stage.classList.remove('galaxy-controls-visible');
    },2400);
  }
  function retryButton(show,error=false) {
    start.hidden=!show;start.textContent=error?'Try again':'Play journey';
    start.setAttribute('aria-label',error?'Reload and play the journey':'Play the journey');
  }
  function pauseForEnvironment() {
    playRequest++;playPending=false;video.pause();stopFrames();sync();
  }
  function ensureSource() {
    if(sourceAssigned)return;
    sourceAssigned=true;video.src=`${media}galaxy-${variant}.mp4?v=${revision}`;
  }
  function requestPlay() {
    syncAfterglow();
    if(completed)sync();
    if(!canRun()||blocked||playPending||!video.paused)return;
    ensureSource();
    const ticket=++playRequest;playPending=true;
    // Start both within the same gesture. The soundtrack owns audible autoplay
    // fallback; the muted picture can continue when sound needs permission.
    const playback=video.play();sync();
    Promise.resolve(playback).then(()=>{
      if(ticket!==playRequest||!canRun()){if(!canRun())video.pause();return;}
      retryButton(false);sync();followFrames();
    }).catch(error=>{
      if(ticket!==playRequest||!canRun()||error?.name==='AbortError')return;
      blocked=true;failed=error?.name!=='NotAllowedError';
      retryButton(true,failed);sync();
    }).finally(()=>{if(ticket===playRequest)playPending=false;});
  }
  function seek(seconds) {
    const target=clamp(seconds,0,JOURNEY_SECONDS);
    pendingSeek=target;
    if(video.readyState>0) {
      const duration=Number.isFinite(video.duration)?video.duration:JOURNEY_SECONDS;
      video.currentTime=Math.min(target,duration);pendingSeek=null;
    }
    sync(target);
  }
  function leaveStill() {
    if(!staticEnding)return;
    staticEnding=false;root.classList.remove('galaxy-reduced-motion');
    video.poster=openingPoster;seek(0);
  }
  function playFromGesture(restart=false) {
    leaveStill();blocked=false;wantsPlayback=true;
    ensureSource();
    if(failed){failed=false;video.load();}
    if(restart||completed||video.ended){completed=false;seek(0);}
    if(soundNeedsGesture){soundEnabled=true;soundNeedsGesture=false;updateSoundButton();}
    requestPlay();showControls();
  }
  function togglePlayback() {
    if(completed){wantsPlayback=!wantsPlayback;sync();showControls();return;}
    if(video.paused||staticEnding||completed){playFromGesture();return;}
    wantsPlayback=false;playRequest++;playPending=false;video.pause();sync();showControls();
  }
  function toggleSound() {
    soundEnabled=!soundEnabled;soundNeedsGesture=false;
    if(surfaceMode==='world'&&soundEnabled)wantsPlayback=true;
    updateSoundButton();sync();requestPlay();showControls();
  }
  async function toggleFullscreen() {
    try {
      if(doc.fullscreenElement===viewport)await doc.exitFullscreen();
      else if(viewport.requestFullscreen)await viewport.requestFullscreen();
      else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();
    } catch { /* Keep playback available when the browser declines fullscreen. */ }
    showControls();
  }

  root.dataset.galaxyPlayerInitialized='true';root.dataset.galaxyVideoVariant=variant;
  root.classList.add('galaxy-ready','galaxy-video-player');
  root.classList.toggle('galaxy-reduced-motion',staticEnding);
  controls.hidden=false;controls.inert=false;controls.removeAttribute('aria-hidden');
  controls.setAttribute('aria-label','Journey playback controls');
  root.querySelector('[data-galaxy-activity]')?.setAttribute('hidden','');
  range.min='0';range.max=String(JOURNEY_SECONDS);range.step='0.1';
  video.muted=true;video.defaultMuted=true;video.volume=FILM_VOLUME;video.playsInline=true;video.preload='metadata';
  video.controls=false;video.setAttribute('playsinline','');video.setAttribute('muted','');
  video.setAttribute('preload','metadata');video.dataset.fps=mobile?'30':'60';
  video.poster=staticEnding?finalPoster:openingPoster;
  stage.tabIndex=0;stage.setAttribute('aria-label','Journey. Space to play or pause; arrow keys to seek.');
  fullscreen.hidden=!viewport.requestFullscreen&&!video.webkitEnterFullscreen;
  fullscreen.setAttribute('aria-label','Enter full screen');
  fullscreen.setAttribute('aria-pressed','false');
  updateSoundButton();sync();

  on(root,'warm:surface-change',event=>{
    surfaceMode=event.detail?.mode||'film';
    if(surfaceMode!=='film'){
      clearTimeout(hideTimer);stage.classList.remove('galaxy-controls-visible','galaxy-keyboard-controls');
    }
    const leaving=['state','world'].includes(event.detail?.mode),duration=reduced.matches?0:Number(event.detail?.fadeMs)||0;
    const fadeTicket=++surfaceFadeTicket;
    if(surfaceFadeFrame)cancelAnimationFrame(surfaceFadeFrame);surfaceFadeFrame=0;surfaceFading=false;
    if(!duration){surfaceSuspended=leaving;video.volume=FILM_VOLUME;endingFilm.film.volume=FILM_VOLUME;if(leaving)pauseForEnvironment();else{sync();requestPlay();}return;}
    const levels=[video.volume,endingFilm.film.volume],began=performance.now();
    if(leaving)surfaceFading=true;
    else{surfaceSuspended=false;video.volume=0;endingFilm.film.volume=0;sync();requestPlay();}
    function fade(now){
      if(destroyed||fadeTicket!==surfaceFadeTicket)return;
      const t=clamp((now-began)/duration,0,1),amount=smooth(t);
      video.volume=leaving?levels[0]*(1-amount):FILM_VOLUME*amount;
      endingFilm.film.volume=leaving?levels[1]*(1-amount):FILM_VOLUME*amount;
      if(t<1){surfaceFadeFrame=requestAnimationFrame(fade);return;}
      surfaceFadeFrame=0;surfaceFading=false;surfaceSuspended=leaving;
      if(leaving)pauseForEnvironment();
    }
    surfaceFadeFrame=requestAnimationFrame(fade);
  });
  on(video,'loadedmetadata',()=>{if(pendingSeek!==null)seek(pendingSeek);sync();});
  on(video,'canplay',()=>{sync();requestPlay();});
  on(video,'timeupdate',()=>sync());
  on(video,'playing',()=>{retryButton(false);sync();followFrames();});
  on(video,'pause',()=>{stopFrames();sync();});
  on(video,'seeking',()=>{stopFrames();sync();});
  on(video,'seeked',()=>{sync();followFrames();});
  on(video,'ratechange',()=>sync());
  on(video,'ended',()=>{completed=true;wantsPlayback=true;stopFrames();sync();root.dataset.galaxyCompleted='true';root.dispatchEvent(new CustomEvent('galaxy-completed',{bubbles:true}));});   // THE PROFESSOR SENDS YOU TO THE FILM FIRST (dl-space-router.js FILM_DONE): the page hears the film's end; the film itself is as it was
  on(video,'error',()=>{failed=true;blocked=true;stopFrames();retryButton(true,true);sync();});
  on(video,'click',togglePlayback);
  if(heroToggle)on(heroToggle,'click',()=>completed?playFromGesture(true):togglePlayback());
  on(pause,'click',togglePlayback);on(replay,'click',()=>playFromGesture(true));
  on(start,'click',()=>playFromGesture());on(sound,'click',toggleSound);
  if(worldSound)on(worldSound,'click',toggleSound);
  on(soundStart,'click',()=>{soundEnabled=false;toggleSound();});
  on(fullscreen,'click',toggleFullscreen);
  on(range,'input',()=>{
    const target=Number(range.value);leaveStill();completed=false;wantsPlayback=false;
    playRequest++;playPending=false;video.pause();seek(target);showControls();
  });
  on(stage,'pointermove',()=>{const now=performance.now();if(now-lastReveal>120){lastReveal=now;showControls();}});
  on(stage,'pointerenter',showControls);
  on(doc,'pointerdown',event=>{
    keyboardMode=false;stage.classList.remove('galaxy-keyboard-controls');
    if(stage.contains(event.target)){
      dragging=event.target===range;showControls();
    }else if(!dragging)stage.classList.remove('galaxy-controls-visible');
  });
  on(doc.defaultView,'pointerup',()=>{if(dragging){dragging=false;showControls();}});
  on(doc.defaultView,'pointercancel',()=>{dragging=false;showControls();});
  on(doc,'keydown',event=>{
    if(event.key==='Tab'||stage.contains(event.target)) {
      keyboardMode=true;stage.classList.add('galaxy-keyboard-controls');
    }
  });
  on(stage,'touchstart',showControls,{passive:true});on(stage,'focusin',showControls);
  on(controls,'pointerleave',showControls);on(controls,'focusout',showControls);
  on(stage,'keydown',event=>{
    if(event.target!==stage&&event.target!==video)return;
    if(event.key===' '||event.key.toLowerCase()==='k'){event.preventDefault();togglePlayback();}
    else if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();leaveStill();completed=false;seek(position()+(event.key==='ArrowRight'?5:-5));showControls();
    } else if(event.key.toLowerCase()==='m'){event.preventDefault();toggleSound();}
    else if(event.key.toLowerCase()==='f'){event.preventDefault();toggleFullscreen();}
  });
  on(doc,'fullscreenchange',()=>{
    const active=doc.fullscreenElement===viewport;
    fullscreen.textContent=active?'Exit full screen':'Full screen';
    fullscreen.setAttribute('aria-label',active?'Exit full screen':'Enter full screen');
    fullscreen.setAttribute('aria-pressed',String(active));showControls();
  });
  on(doc,'visibilitychange',()=>{if(doc.hidden)pauseForEnvironment();else{sync();requestPlay();}});
  on(reduced,'change',()=>{
    if(!reduced.matches)return;
    wantsPlayback=false;staticEnding=true;completed=false;pendingSeek=null;
    pauseForEnvironment();video.poster=finalPoster;video.load();
    root.classList.add('galaxy-reduced-motion');retryButton(false);sync();
  });
  const observer=new IntersectionObserver(([entry])=>{
    visible=entry.isIntersecting&&entry.intersectionRatio>=.12;
    if(visible){sync();requestPlay();}else pauseForEnvironment();
  },{threshold:[0,.12]});observer.observe(viewport);
  const preloadObserver=new IntersectionObserver(([entry])=>{
    if(entry.isIntersecting&&!staticEnding){ensureSource();preloadObserver.disconnect();}
  },{rootMargin:'300px 0px',threshold:0});preloadObserver.observe(viewport);
  function destroy() {
    if(destroyed)return;
    destroyed=true;playRequest++;clearTimeout(hideTimer);stopFrames();
    surfaceFadeTicket++;if(surfaceFadeFrame)cancelAnimationFrame(surfaceFadeFrame);surfaceFadeFrame=0;
    afterglowAbort.abort();afterglow?.destroy();endingFilm.destroy();soundtrack.destroy();
    observer.disconnect();preloadObserver.disconnect();listeners.splice(0).forEach(remove=>remove());
    video.pause();soundStart.remove();
  }
  on(doc.defaultView,'pagehide',event=>{
    surfaceFadeTicket++;if(surfaceFadeFrame)cancelAnimationFrame(surfaceFadeFrame);surfaceFadeFrame=0;surfaceFading=false;
    pageSuspended=true;syncAfterglow();
    if(event.persisted)pauseForEnvironment();else destroy();
  });
  on(doc.defaultView,'pageshow',event=>{pageSuspended=false;if(event.persisted){sync();requestPlay();}});
  return {destroy,video};
}

if(typeof document!=='undefined') {
  document.querySelectorAll('[data-warm-galaxy]').forEach(initializeGalaxyPlayer);
}
