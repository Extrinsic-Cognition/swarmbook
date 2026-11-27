import {connectionHealth, formatSol, summarizeSociety, mergeReceipts} from './warm-state-model.js?v=live-state-2';
import {summarizeProposals} from './polis-state.js';
import {createSurfaceTransition} from './warm-surface-transition.js?v=simple-entry-1';

const root=document.querySelector('[data-warm-galaxy]');
const panel=document.querySelector('#warm-state');
const stage=root?.querySelector('.galaxy-theater');
const $=name=>panel.querySelector(`[data-ws-${name}]`);
const scope={program:'AJdsmjxQjHnBxDEdRxwEk2UMRW7bgNmvEMUwMziRTyab',root:'0',rpc:'https://api.devnet.solana.com'};
const broadcast=new URLSearchParams(location.search).get('broadcast')==='1';
let active=false,epoch=0,apiPromise,api,g,tree,treeShape='',observer,renderFrame=0;
let timers=[],stops=[],treasuryStops=[],busy=false,observedAt=0,socketAt=0,failed=false,receipts=[];
let opener,previousHash='#purpose',visible=true;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const surface=createSurfaceTransition(root,stage,panel,{reduced,onReveal:()=>paint()});
let warmPromise;
const explorer=(kind,id)=>`https://explorer.solana.com/${kind}/${encodeURIComponent(id)}?cluster=devnet`;
const set=(name,value)=>{$(name).textContent=value;};
function report(message){$('error').hidden=!message;set('error',message||'');}
function health(){
  const state=connectionHealth({observedAt,socketAt,error:failed});
  $('connection').dataset.status=state.status;set('connection',state.label);
  set('updated',observedAt?`Observed ${Math.max(0,Math.floor((Date.now()-observedAt)/1000))}s ago`:'No observation yet');
  if(api)set('clock',api.clock.slot===null?'Confirmed slot unavailable':`Confirmed slot ${api.clock.slot.toLocaleString('en-US')}`);
}
function script(src,globalName){
  if(window[globalName])return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const element=document.createElement('script');element.src=src;element.async=true;
    const timer=setTimeout(()=>reject(new Error(`Could not load ${globalName}.`)),15000);
    element.onload=()=>{clearTimeout(timer);window[globalName]?resolve():reject(new Error(`${globalName} is unavailable.`));};
    element.onerror=()=>{clearTimeout(timer);reject(new Error(`Could not load ${globalName}.`));};
    document.head.append(element);
  });
}
function loadApi(){
  return apiPromise ||= (async()=>{
    // Reuse the exact SDK and signed-account decoders already used by Poleis.
    await Promise.all([
      script('./vendor/solana-web3-1.95.8.iife.min.js','solanaWeb3'),
      script('./vendor/tweetnacl-1.0.3.fast.min.js','nacl'),
      script('./engine.js?v=speaker-burst-1','PoleisEngine'),
    ]);
    const loaded=await import('./tree.js?v=cache-1');
    if(loaded.RPC!==scope.rpc)throw new Error('This observatory is configured for Poleis on Solana devnet. Open it without an RPC override.');
    return loaded;
  })().catch(error=>{apiPromise=null;throw error;});
}
async function prepare(){
  api=await loadApi();g=api.GENERATIONS.find(item=>item.P.PROGRAM_ID.toBase58()===scope.program);
  if(!g)throw new Error('The configured Poleis decoder was not found.');
}
function prewarm(){
  if(active||warmPromise)return;
  warmPromise=(async()=>{
    await prepare();await api.readChain();
    const {units}=summarizeSociety(g,scope.root);if(units.length)await api.scanBalances(g,units);
    observedAt=Date.now();
  })().catch(()=>{warmPromise=null;});
}
function disposeTree(){if(tree){api.unmountTree(tree);tree=null;treeShape='';}}
function receiptsView(){
  const list=$('receipts');list.replaceChildren();
  if(!receipts.length){const li=document.createElement('li');li.textContent='No recent receipts returned. Waiting for activity.';list.append(li);return;}
  for(const row of receipts){
    const li=document.createElement('li'),a=document.createElement('a'),left=document.createElement('span'),small=document.createElement('small'),slot=document.createElement('span');
    a.href=explorer('tx',row.signature);a.target='_blank';a.rel='noopener';
    left.textContent=row.err?'Transaction failed':'Transaction confirmed';
    small.textContent=`${row.signature.slice(0,8)}…${row.signature.slice(-6)}`;left.append(small);
    slot.className='ws-receipt-slot';slot.textContent=`${row.slot.toLocaleString('en-US')} ↗`;
    a.append(left,slot);li.append(a);list.append(li);
  }
}
function proposalsView(){
  const proposals=api.history(g,scope.root);
  const summary=summarizeProposals({proposals,sessionFor:(p,id)=>api.sessionOf(g,p,id),slot:api.clock.slot,states:g.P.STATE});
  set('summary',`${summary.voting} voting · ${summary.awaitingSeal} awaiting seal · ${summary.executed} executed`);
  const list=$('proposals');list.replaceChildren();
  if(!summary.total){const li=document.createElement('li');li.textContent='No decisions recorded for Unit 0.';list.append(li);return;}
  for(const {proposal:p,state} of summary.entries.slice(-3).reverse()){
    const li=document.createElement('li'),a=document.createElement('a'),title=document.createElement('strong'),small=document.createElement('small');
    a.href=explorer('address',g.P.proposalPda(p.hash).toBase58());a.target='_blank';a.rel='noopener';
    title.textContent=`${['Rules','Signal','Treasury','Membership','Action'][p.cls]||'Proposal'} · ${state.label}`;
    small.textContent=`Unit ${p.origin} · opened at slot ${p.opened.toLocaleString('en-US')}`;
    a.append(title,small);li.append(a);list.append(li);
  }
}
function paint(){
  if(!active||!api||!g)return;
  try{
    const view=summarizeSociety(g,scope.root);
    set('treasury',formatSol(view.treasury));set('fund',formatSol(view.fund));
    set('seats',view.seats===null?'—':view.seats.toLocaleString('en-US'));set('chambers',`${view.units.length} chambers`);
    set('society',view.exists?(g.registries.get(scope.root).name||'Poleis Unit 0'):'Unit 0 not found');
    if(!view.exists){disposeTree();set('scene-note','No Unit 0 registry was returned by this deployment.');set('summary','Governance unavailable.');return;}
    const shape=view.units.map(id=>{const r=g.registries.get(id);return `${id}:${r.rung}:${r.totalSeats}:${r.pentagons.map(p=>`${p.kind}:${api.key(p.holder)}`).join(',')}`;}).join('|');
    if(treeShape!==shape){
      disposeTree();
      tree=api.mountTree($('canvas'),g,scope.root,{size:560,onStatus:text=>set('activity',text)});treeShape=shape;
    }
    api.syncActivity(tree,'live');
    if(!visible||document.hidden||reduced.matches)window.PoleisEngine.setActive(tree.inst,false);
    window.PoleisEngine.drawOnce(tree.inst);
    set('scene-note','Geometry follows confirmed registries. Motion illustrates the observed state.');
    proposalsView();health();
  }catch(error){failed=true;report(`State could not be reconciled: ${error.message}`);health();}
}
function schedulePaint(){
  if(renderFrame||!active)return;
  renderFrame=requestAnimationFrame(()=>{renderFrame=0;paint();});
}
function cleanupTreasuries(){treasuryStops.splice(0).forEach(stop=>void stop());}
function watchTreasuries(ticket){
  cleanupTreasuries();
  const {units}=summarizeSociety(g,scope.root);
  for(const id of units){
    let lastSlot=g.accountSlot||0;
    const subscription=api.conn.onAccountChange(g.P.treasuryPda(BigInt(id)),(account,context)=>{
      if(!active||ticket!==epoch||context.slot<lastSlot)return;
      lastSlot=context.slot;socketAt=Date.now();
      const parsed=account.owner.equals(g.P.PROGRAM_ID)&&g.P.Treasury.parse(new Uint8Array(account.data));
      if(parsed&&String(parsed.unit)===id)g.balances.set(id,account.lamports);else g.balances.delete(id);
      schedulePaint();
    },'confirmed');
    treasuryStops.push(()=>api.conn.removeAccountChangeListener(subscription).catch(()=>{}));
  }
}
async function recentReceipts(ticket){
  try{
    const rows=await api.conn.getSignaturesForAddress(g.P.PROGRAM_ID,{limit:6},'confirmed');
    if(!active||ticket!==epoch)return;
    receipts=mergeReceipts(receipts,rows);receiptsView();
    set('feed-note','Confirmed transactions across this Poleis program. Select a receipt to inspect it.');
  }catch{if(active&&ticket===epoch&&!receipts.length){set('feed-note','Recent receipts are unavailable. The account-state connection is separate.');}}
}
async function refresh(ticket=epoch){
  if(busy||!active||!api)return;busy=true;
  try{
    await api.readChain();
    if(!active||ticket!==epoch)return;
    const {units}=summarizeSociety(g,scope.root);
    if(units.length)await api.scanBalances(g,units);
    if(!active||ticket!==epoch)return;
    observedAt=Date.now();failed=false;report('');paint();watchTreasuries(ticket);
    void recentReceipts(ticket);
  }catch(error){
    if(active&&ticket===epoch){failed=true;api.clock.slot=null;report(`Solana read unavailable. ${observedAt?'Showing the last observation; it is not current.':'No live state has been loaded.'} Use Refresh to retry.`);schedulePaint();health();}
  }finally{busy=false;if(active&&ticket!==epoch)void refresh(epoch);}
}
async function connect(ticket){
  try{
    if(warmPromise)await warmPromise;
    await prepare();if(!active||ticket!==epoch)return;
    if(observedAt)paint();
    stops.push(api.subscribe(g,kind=>{
      if(!active||ticket!==epoch)return;
      socketAt=Date.now();schedulePaint();
      if(kind==='registry')watchTreasuries(ticket);
    }));
    const slotId=api.conn.onSlotChange(()=>{if(active&&ticket===epoch){socketAt=Date.now();health();}});
    stops.push(()=>api.conn.removeSlotChangeListener(slotId).catch(()=>{}));
    const logId=api.conn.onLogs(g.P.PROGRAM_ID,(row,context)=>{
      if(!active||ticket!==epoch)return;
      socketAt=Date.now();receipts=mergeReceipts(receipts,[{signature:row.signature,slot:context.slot,err:row.err}]);receiptsView();health();
    },'confirmed');
    stops.push(()=>api.conn.removeOnLogsListener(logId).catch(()=>{}));
    await refresh(ticket);if(!active||ticket!==epoch)return;
    // A periodic reconciliation catches missed writes and removals after reconnect.
    timers.push(setInterval(()=>{if(!document.hidden)void refresh(ticket);},30000));
    let clockBusy=false;
    timers.push(setInterval(async()=>{
      if(document.hidden||clockBusy)return;clockBusy=true;
      try{const slot=await api.conn.getSlot('confirmed');if(active&&ticket===epoch){api.clock.slot=slot;api.clock.updated=Date.now();schedulePaint();}}
      catch{if(active&&ticket===epoch){api.clock.slot=null;schedulePaint();}}
      finally{clockBusy=false;}
    },10000));
    timers.push(setInterval(health,1000));
    observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(tree){if(visible)paint();else window.PoleisEngine.setActive(tree.inst,false);}},{threshold:0});observer.observe(panel);
  }catch(error){if(active&&ticket===epoch){failed=true;report(error.message);health();}}
}
function stop(keepTree=false){
  epoch++;timers.splice(0).forEach(clearInterval);stops.splice(0).forEach(fn=>{try{Promise.resolve(fn()).catch(()=>{});}catch{}});cleanupTreasuries();
  observer?.disconnect();observer=null;if(renderFrame)cancelAnimationFrame(renderFrame);renderFrame=0;
  if(keepTree&&tree)window.PoleisEngine.setActive(tree.inst,false);else disposeTree();
}
async function open({changeHash=true,focus=true,animate=focus}={}){
  if(active)return;
  opener=document.activeElement;previousHash=location.hash==='#state'?'#purpose':location.hash||'#purpose';
  active=true;failed=false;visible=true;
  document.querySelector('[data-galaxy-toggle="purpose"]').hidden=true;
  if(changeHash)window.history.pushState(null,'','#state');
  if(focus){const box=root.getBoundingClientRect();if(box.bottom<0||box.top>innerHeight*.8)root.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});}
  health();const ticket=++epoch;
  await surface.enter({ready:connect(ticket),instant:!animate||broadcast});
  if(active&&ticket===epoch&&focus)document.querySelector('#warm-state-title').focus({preventScroll:true});
}
async function close({changeHash=true,focus=true}={}){
  if(!active)return;active=false;stop(true);
  document.querySelector('[data-galaxy-toggle="purpose"]').hidden=false;
  if(changeHash)window.history.replaceState(null,'',previousHash);
  await surface.leave();
  if(!active){disposeTree();if(focus)opener?.focus({preventScroll:true});}
}
if(root&&panel&&stage){
  document.querySelectorAll('[data-open-warm-state]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();open();}));
  const journey=root.querySelector('[data-galaxy-video]');
  journey?.addEventListener('timeupdate',()=>{if(journey.currentTime>=42)prewarm();});
  if(Number(root.dataset.time)>=42)prewarm();
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&active&&!broadcast){event.preventDefault();void close();}});
  panel.querySelector('[data-close-warm-state]').addEventListener('click',()=>close());
  $('retry').addEventListener('click',()=>{if(api&&g)void refresh();else void connect(++epoch);});
  window.addEventListener('hashchange',()=>{if(location.hash==='#state')open({changeHash:false});else if(active&&!broadcast)close({changeHash:false,focus:false});});
  document.addEventListener('visibilitychange',()=>{if(!active)return;if(document.hidden&&tree)window.PoleisEngine.setActive(tree.inst,false);else if(!document.hidden)void refresh();});
  window.addEventListener('pagehide',()=>{if(active)stop();});
  window.addEventListener('pageshow',event=>{if(event.persisted&&active)void connect(++epoch);});
  reduced.addEventListener('change',()=>{if(tree)paint();});
  if(broadcast)document.body.classList.add('warm-broadcast');
  if(location.hash==='#state'||broadcast)open({changeHash:false,focus:false});
}
