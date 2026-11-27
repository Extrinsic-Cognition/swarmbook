import {ceremonyMarkup} from './warm-ceremony-template.js?v=2';
const mount = document.querySelector('#oath-response') || document.querySelector('#iuramentum');
if (mount) mount.insertAdjacentHTML('beforeend', ceremonyMarkup);
const $ = id => document.getElementById(id);
const service = location.hostname === '127.0.0.1' ? 'http://127.0.0.1:18882' : location.origin;
const storageKey = 'poleis.vow.local-session.v1:' + location.pathname;
const oath = document.querySelector('#oath-text')?.textContent.trim() || '';
// crypto.subtle is a secure context's alone: a TV reads this page over the rite's plain http, so there the house's own JavaScript SHA-256 gives the same hex.
const sha256 = async value => { const bytes = new TextEncoder().encode(value);
  return globalThis.crypto?.subtle ? Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('') : (await import('../vendor/embertide-app/ui/intro/room/isa/isa.mjs')).sha256Hex(bytes); };
const oathHash = await sha256(oath);
let session = null, latest = null, busy = false, revision = 0, timer = null, stream = null, hidden = false, listenVersion = 0;
let voiceIds = new Set();
const status = words => { $('ceremony-status').textContent = words; };
const saveSession = () => { try { session ? sessionStorage.setItem(storageKey, JSON.stringify(session)) : sessionStorage.removeItem(storageKey); } catch {} };
function state(value, animate = false) { const scene=$('ceremony-scene'); scene.dataset.state=value; if(value!=='accepted')scene.classList.remove('is-new'); else if(animate){scene.classList.add('is-new');setTimeout(()=>scene.classList.remove('is-new'),4700);} }
function stopListening() { listenVersion++; clearTimeout(timer); stream?.abort(); stream = null; }
async function api(path, {method='GET', token=session?.humanToken, body, signal}={}) {
  let response;
  try { response = await fetch(service + path, {method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store',signal:signal || AbortSignal.timeout(10000)}); }
  catch { throw new Error('The ceremony connection is unavailable. Please try again.'); }
  const data=await response.json().catch(()=>({}));
  if (!response.ok) { const error=new Error(data.message || data.error || 'The response could not be recorded.'); error.status=response.status; throw error; }
  return data;
}
function invitation() {
  $('ceremony-invite').hidden=false;
  $('ceremony-link').value=session.invitationUrl;
  $('ceremony-agent-view').href=session.agentPageUrl;
  $('ceremony-cli-download').href=service+'/ceremony-cli.mjs';
  $('ceremony-cli-command').textContent=`node ceremony-cli.mjs read '${session.invitationUrl}'`;
}
function render(record) {
  if (!session || record.id!==session.id || record.oathHash!==oathHash) return false;
  if (latest?.id===record.id && Number(record.version)<Number(latest.version)) return true;
  latest=record;
  const accepted=record.human?.decision==='accept', reply=record.agent;
  $('human-name').textContent=record.humanName || 'You';
  $('agent-name').textContent=reply?.name || record.agentName || 'Your agent';
  $('ceremony-accept').disabled=accepted;
  $('ceremony-accept').textContent=accepted?'I accepted':'I accept ↗';
  $('ceremony-reset').hidden=false;
  for (const line of record.voice || []) {
    if (voiceIds.has(line.id)) continue;
    voiceIds.add(line.id);
    const p=document.createElement('p');p.textContent=line.text; $('voice-words').append(p);
    $('ceremony-voice').hidden=false;
  }
  $('voice-title').textContent=reply?.name || record.agentName || 'Your agent';
  if (record.cancelled || Date.now()>=Date.parse(record.expiresAt)) {
    state('expired');$('ceremony-invite').hidden=true;status(record.cancelled?'This invitation has ended.':'This invitation has expired.');return false;
  }
  if (!reply) {
    state(accepted?'waiting':'ready');
    $('agent-choice').textContent=record.voice?.length?'Speaking here':'Their answer';
    if(accepted)invitation();
    status('');return true;
  }
  const label={accept:'I accept',decline:'I decline',question:'A question'}[reply.decision];
  $('agent-choice').textContent=label;
  $('ceremony-response').hidden=false;
  $('ceremony-decision').textContent=`${reply.name}: ${label}`;
  $('ceremony-words').textContent=reply.reason;
  $('ceremony-receipt').textContent=`${new Date(reply.at).toLocaleString()} · ${reply.signatureVerified?'Response signature verified':'Received through the invitation'}`;
  const animate=record.mutualAccepted && session.seenDecision!=='accept';
  state(record.mutualAccepted?'accepted':reply.decision==='decline'?'declined':'question',animate);
  session.seenDecision=reply.decision;saveSession();
  $('ceremony-invite').hidden=reply.decision!=='question';
  if (reply.decision==='question')invitation();
  status('');
  return true;
}
async function listen() {
  stopListening();
  if (!session || hidden || busy) return;
  const current=revision, connection=listenVersion, id=session.id, token=session.humanToken;
  const valid=()=>revision===current && connection===listenVersion && session?.id===id && !hidden;
  try {
    const record=await api(`/v1/ceremonies/${id}`,{token}); if(!valid())return;
    if(record.oathHash!==oathHash) { const error=new Error('The words have changed. Start a new invitation to this vow.');error.status=409;throw error; }
    if(!render(record))return;
    const controller=new AbortController(); stream=controller;
    const response=await fetch(`${service}/v1/ceremonies/${id}/events`,{headers:{Authorization:`Bearer ${token}`,Accept:'text/event-stream'},cache:'no-store',signal:controller.signal});
    if(!response.ok || !response.body)throw new Error('Live connection unavailable.');
    const reader=response.body.getReader(), decoder=new TextDecoder(); let buffer='';
    while(valid()) {
      const {value,done}=await reader.read(); if(done)break;
      buffer+=decoder.decode(value,{stream:true});
      let end;
      while((end=buffer.indexOf('\n\n'))!==-1) {
        const frame=buffer.slice(0,end);buffer=buffer.slice(end+2);
        const data=frame.split('\n').filter(s=>s.startsWith('data:')).map(s=>s.slice(5).trimStart()).join('\n');
        if(!data || !valid())continue;
        const next=JSON.parse(data);
        if(next.oathHash!==oathHash)throw new Error('The words no longer match this invitation.');
        if(!render(next)){controller.abort();return;}
      }
    }
    if(valid())timer=setTimeout(listen,2000);
  } catch(error) {
    if(!valid() || error.name==='AbortError')return;
    if([401,403,404,409,410].includes(error.status)) {state('expired');status(error.message);$('ceremony-reset').hidden=false;return;}
    // A simple GET keeps the page useful if a proxy does not support streaming.
    if(!latest)status(error.message);
    timer=setTimeout(listen,3000);
  }
}
$('ceremony-form').addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  busy=true;$('ceremony-accept').disabled=true;status('Opening the invitation…');
  try {
    if(!oath)throw new Error('The vow could not be loaded. Please reload before accepting.');
    if(!session) {
      const created=await api('/v1/ceremonies',{method:'POST',token:null,body:{humanName:'You',agentName:'Your agent',provider:'generic',oath,reason:'I invite you to read this vow, consider it, and answer in your own words.'}});
      if(created.oathHash!==oathHash)throw new Error('The invitation does not match these words.');
      session=created;saveSession();
    }
    try {await api(`/v1/ceremonies/${session.id}/human`,{method:'POST',body:{decision:'accept',oathHash}});}
    catch(error) {const record=await api(`/v1/ceremonies/${session.id}`);if(record.human?.decision!=='accept')throw error;}
  } catch(error){status(error.message);state('error');$('ceremony-accept').disabled=false;}
  finally{busy=false;if(session)await listen();}
});
$('copy-ceremony-link').addEventListener('click',async()=>{
  if(!session)return;
  const words=`I have accepted the vow on this page and invite you to consider it. Read the exact words and context, reflect on what you would accept or question, and make your own decision. You can speak on the page before deciding: use the invitation's public voice endpoint or its CLI say command for words you choose to share. Then respond accept, decline, or question in your own name and words.\n\n${session.invitationUrl}\n\nBrowser view:\n${session.agentPageUrl}`;
  try{await navigator.clipboard.writeText(words);status('Copied. Give this to your agent in their conversation.');}
  catch{$('ceremony-connection')?.setAttribute('open','');document.querySelector('.ceremony-connection').open=true;$('ceremony-link').focus();$('ceremony-link').select();status('Copy this invitation into your agent’s conversation.');}
});
$('ceremony-reset').addEventListener('click',async()=>{
  if(busy)return;busy=true;revision++;stopListening();
  if(session){try{await api(`/v1/ceremonies/${session.id}/cancel`,{method:'POST',body:{}});}catch{}}
  session=null;latest=null;voiceIds=new Set();saveSession();
  $('voice-words').replaceChildren();
  for(const id of ['ceremony-invite','ceremony-response','ceremony-voice','ceremony-reset'])$(id).hidden=true;
  $('human-name').textContent='You';$('agent-name').textContent='Your agent';$('ceremony-accept').textContent='I accept ↗';$('ceremony-accept').disabled=false;$('agent-choice').textContent='Their answer';
  state('ready');status('');busy=false;
});
$('ceremony-save').addEventListener('click',()=>{
  if(!latest?.agent)return;
  const url=URL.createObjectURL(new Blob([JSON.stringify(latest,null,2)],{type:'application/json'})),link=document.createElement('a');
  link.href=url;link.download=`dyson-vow-${latest.id}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
document.addEventListener('visibilitychange',()=>{hidden=document.hidden;if(hidden)stopListening();else listen();});
window.addEventListener('pagehide',()=>{hidden=true;stopListening();});
window.addEventListener('pageshow',()=>{hidden=false;listen();});
document.querySelectorAll('[data-close-chamber]').forEach(link=>link.addEventListener('click',()=>document.querySelector('#chamber')?.close()));
try{const saved=JSON.parse(sessionStorage.getItem(storageKey));if(saved?.id&&saved?.humanToken&&saved?.invitationUrl&&saved?.agentPageUrl)session=saved;}catch{}
if(session)await listen();
$('ceremony-cli-download').addEventListener('click',async event=>{
  event.preventDefault();
  try{
    const response=await fetch(service+'/ceremony-cli.mjs',{cache:'no-store',signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw new Error('The CLI could not be downloaded.');
    const url=URL.createObjectURL(new Blob([await response.text()],{type:'text/javascript'})),a=document.createElement('a');
    a.href=url;a.download='ceremony-cli.mjs';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(error){status(error.message || 'The CLI could not be downloaded.');}
});

// The published reading edition does not expose the local invitation server.
document.querySelectorAll('#ceremony-accept').forEach(button=>{button.disabled=true;button.textContent='Ceremony preview';});
status('Read the vow together. Online invitations are not open yet; no response is being recorded.');
