// The HOW scenes and their timed underlines share one visible-time clock.
// A completed scene hands off to the next; manual visits retain unfinished work.
import {createTankScene,EPOCH as SPENDING_EPOCH} from './seals-tank.js?v=caption-1';
import {createSharingScene} from './seals-sharing.js?v=collective-1';
import {EPOCH as SHARING_EPOCH} from './seals-sharing-state.js?v=cognitio-salvata-3';
import {createBetweenScene,CYCLE,PLAYBACK_RATE} from './seals-between.js?v=gossip-ecosystem-1';
import {createHowArrivalScene} from './how-arrival.js?v=doors-2';

export const SEAL_MODES = [
  {key:'tank', duration:SPENDING_EPOCH*1000, title:'Cash is the sandbox.',
    intro:'One Warden per paying user. Wardens vote; approved budgets fund the work.',
    caption:'Fund in bulk. Pay continuously. Settle in batches.',
    legend:[['bulk','Treasury refill'],['','Micropayment'],['call','Work'],['receipt','Receipt'],['refused','Out of cash']]},
  {key:'membrane', duration:SHARING_EPOCH*1000, title:'Cognitio salvata.',
    intro:'Swarms bring what they have learned, add their own work, and build together. Every contribution keeps its authorship.',
    caption:'Knowledge carries forward. New work joins it. Authorship stays.',
    legend:[['call','Saved work'],['','New work'],['root','Consent'],['receipt','Acknowledgment'],['refused','Kept local']]},
  {key:'between', duration:CYCLE*1000/PLAYBACK_RATE, title:'The membrane.',
    intro:'Many swarms. Their own formations, their own boundaries. Useful context travels by consent; private sources stay home.',
    caption:'Private by source. Public by projection. Governed by receipts.',
    legend:[['','Source projection'],['call','Admitted gossip'],['receipt','Returning receipt'],['refused','Held at a gate']]},
];

export function createSealsPage(doc, win, factories=[createTankScene,createSharingScene,createBetweenScene]) {
  const $=id=>doc.getElementById(id), reduced=win.matchMedia('(prefers-reduced-motion: reduce)'), narrow=win.matchMedia('(max-width: 620px)');
  const plate=doc.querySelector('.plate'), buttons=[...doc.querySelectorAll('.lenses button[data-lens]')];
  const pauseButton=$('scene-pause'), replayButton=$('scene-replay');
  const scenes=factories.map((factory,i)=>factory($(`${SEAL_MODES[i].key}-canvas`)));
  const times=[0,0,0], sizing=[];
  let active=0, paused=false, visible=false, disposed=false, raf=null, last=null;
  function legend(node,mode) {
    node.replaceChildren();
    for(const [kind,text] of mode.legend) {
      const item=doc.createElement('span');item.className=kind;
      const icon=doc.createElement('i');icon.setAttribute('aria-hidden','true');
      item.append(icon,doc.createTextNode(text));node.append(item);
    }
  }
  // The tallest real copy reserves each grid track, as on the WHY page.
  for(const mode of SEAL_MODES) {
    const heading=doc.createElement('div'),title=doc.createElement('h2');title.textContent=mode.title;heading.append(title);
    const intro=doc.createElement('p');intro.textContent=mode.intro;
    const caption=doc.createElement('p');caption.textContent=mode.caption;
    const key=doc.createElement('div');key.className='key';legend(key,mode);
    for(const node of [heading,intro,caption,key]) {
      node.classList.add('scene-sizer');node.setAttribute('aria-hidden','true');node.inert=true;sizing.push(node);
    }
    doc.querySelector('.hero').append(heading,intro);
    doc.querySelector('.lens-caption-stack').append(caption);
    doc.querySelector('.legend-stack').append(key);
  }
  const runnable=()=>!disposed&&visible&&!doc.hidden&&!paused&&!reduced.matches;
  function paint() {
    scenes[active].render(times[active],reduced.matches);
    const progress=reduced.matches?1:Math.min(1,times[active]/SEAL_MODES[active].duration);
    buttons[active].style.setProperty('--lens-progress',String(progress));

  }
  function controls() {
    pauseButton.disabled=reduced.matches;
    replayButton.disabled=reduced.matches;
    pauseButton.textContent=paused?'Play':'Pause';
    pauseButton.setAttribute('aria-pressed',String(paused));
    pauseButton.setAttribute('aria-label',`${paused?'Play':'Pause'} animation`);
  }
  function stop() { if(raf!==null)win.cancelAnimationFrame(raf);raf=null;last=null; }
  function frame(now) {
    raf=null;if(!runnable()){last=null;return;}
    if(last!==null)times[active]+=Math.max(0,now-last);
    if(times[active]>=SEAL_MODES[active].duration) {
      times[active]=SEAL_MODES[active].duration;
      const next=(active+1)%scenes.length;
      // Even after a delayed frame, show the next scene from its beginning.
      times[next]=0;select(next);return;
    }
    last=now;paint();raf=win.requestAnimationFrame(frame);
  }
  function schedule() { if(runnable()&&raf===null){last=win.performance.now();raf=win.requestAnimationFrame(frame);} }
  function select(index,byUser=false) {
    if(disposed||!Number.isInteger(index)||!SEAL_MODES[index])return;
    stop();active=index;const mode=SEAL_MODES[index];plate.dataset.lens=mode.key;
    if(times[active]>=mode.duration)times[active]=0;
    for(const other of SEAL_MODES)$(`${other.key}-canvas`).hidden=other.key!==mode.key;
    $('scene-title').textContent=mode.title;$('scene-intro').textContent=mode.intro;
    $('lens-caption').setAttribute('aria-live',byUser?'polite':'off');$('lens-caption').textContent=mode.caption;
    legend($('scene-legend'),mode);
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.lens)===index)));
    scenes[active].resize(narrow.matches);paint();controls();schedule();
  }
  function replay() { if(disposed)return;stop();times[active]=0;scenes[active].resize(narrow.matches);paint();schedule(); }
  function togglePause() { if(disposed||reduced.matches)return;stop();paused=!paused;controls();schedule(); }
  function resize() { if(disposed)return;scenes[active].resize(narrow.matches);paint(); }
  function environment() { stop();if(disposed)return;controls();paint();schedule(); }
  const handlers=buttons.map(button=>{const choose=()=>select(Number(button.dataset.lens),true);button.addEventListener('click',choose);return [button,choose];});
  const view=new win.IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);visible?schedule():stop();});
  const size=new win.ResizeObserver(resize);view.observe(plate);size.observe(plate);
  const onPageHide=event=>{stop();if(!event.persisted)destroy();};
  function destroy() {
    if(disposed)return;stop();disposed=true;view.disconnect();size.disconnect();
    reduced.removeEventListener('change',environment);narrow.removeEventListener('change',resize);doc.removeEventListener('visibilitychange',environment);
    win.removeEventListener('pagehide',onPageHide);win.removeEventListener('pageshow',environment);
    pauseButton.removeEventListener('click',togglePause);replayButton.removeEventListener('click',replay);
    for(const [button,choose] of handlers)button.removeEventListener('click',choose);
    for(const node of sizing)node.remove();
  }
  pauseButton.addEventListener('click',togglePause);replayButton.addEventListener('click',replay);
  reduced.addEventListener('change',environment);narrow.addEventListener('change',resize);doc.addEventListener('visibilitychange',environment);
  win.addEventListener('pagehide',onPageHide);win.addEventListener('pageshow',environment);
  select(win.location?.hash==='#membrane'?2:win.location?.hash==='#sharing'?1:0);
  return {select,replay,togglePause,destroy};
}
// The two doors are illustrations, painted on resize only. They add no animation loop.
export function mountDoors(doc,win) {
  const canvases=[['arrival-solo','solo'],['arrival-team','team']].map(([id,kind])=>[doc.getElementById(id),kind]);
  if(canvases.some(([canvas])=>!canvas)||!win.ResizeObserver)return null;
  const doors=canvases.map(([canvas,kind])=>createHowArrivalScene(canvas,kind));
  const size=new win.ResizeObserver(()=>{for(const door of doors){door.resize();door.render(0,true);}});
  for(const [canvas] of canvases)size.observe(canvas);
  return {doors,destroy(){size.disconnect();}};
}
if(typeof document!=='undefined'){createSealsPage(document,window);mountDoors(document,window);}
