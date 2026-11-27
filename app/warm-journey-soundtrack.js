// One audio clock spans the film and its interactive continuation. The visual
// media stay muted, so freezing or replacing a picture cannot cut the music.
export function createJourneySoundtrack(root,{source,volume=.65,onSoundBlocked=()=>{}}) {
  const audio=root.ownerDocument.createElement('audio');
  audio.dataset.galaxySoundtrack='';audio.preload='metadata';
  audio.loop=true;audio.volume=volume;audio.hidden=true;root.append(audio);
  let state={},loaded=false,played=false,pending=false,destroyed=false,blocked=false,ticket=0;
  let targetTime=0;
  const listeners=[];
  const on=(event,handler)=>{audio.addEventListener(event,handler);listeners.push(()=>audio.removeEventListener(event,handler));};
  const canRun=()=>!destroyed&&state.playing&&state.visible&&!state.hidden;
  // A seek lands only inside the seekable ranges (a host that ignores Range offers [0,0]). Aimed
  // outside, it lands at their edge and ends in a fresh canplay, whose run() aims again: a seek
  // loop with no timer, 56k seeks a second on a page at rest (Oct 12 2026). Aim only where it can go.
  const reachable=t=>{const r=audio.seekable;for(let i=0;i<r.length;i++)if(t>=r.start(i)&&t<=r.end(i))return true;return false;};
  function align() {
    if(audio.readyState===0||state.freeRunning&&played)return;
    const duration=Number.isFinite(audio.duration)?audio.duration:Infinity;
    const target=Math.min(targetTime,Math.max(0,duration-.05));
    if(Math.abs(audio.currentTime-target)>.3&&reachable(target))audio.currentTime=target;
  }
  function stop() {
    if(pending){ticket++;pending=false;}
    if(!audio.paused)audio.pause();
  }
  function run() {
    if(!canRun()){stop();return;}
    if(!loaded){loaded=true;audio.src=source;}
    align();
    if(pending||blocked||!audio.paused||audio.error)return;
    const request=++ticket;pending=true;
    Promise.resolve(audio.play()).then(()=>{
      if(request!==ticket||!canRun()){if(!canRun())audio.pause();return;}
      played=true;root.dataset.soundtrack='playing';
    }).catch(error=>{
      if(request!==ticket||!canRun()||error?.name==='AbortError')return;
      if(error?.name==='NotAllowedError'){
        blocked=true;root.dataset.soundtrack='needs-gesture';
        if(state.sound)onSoundBlocked();
      }else root.dataset.soundtrack='unavailable';
    }).finally(()=>{
      if(request!==ticket)return;
      pending=false;
    });
  }
  on('loadedmetadata',()=>{align();run();});
  on('canplay',run);
  on('error',()=>{root.dataset.soundtrack='unavailable';});
  return {
    update(next) {
      if(next.sound&&!state.sound)blocked=false;
      state=next;targetTime=Number(state.time)||0;
      audio.muted=!state.sound;audio.playbackRate=state.rate||1;
      align();run();
    },
    destroy() {
      destroyed=true;stop();listeners.splice(0).forEach(remove=>remove());
      audio.removeAttribute('src');audio.load();audio.remove();
    },
    audio,
  };
}
