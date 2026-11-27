// polis.js: one polis, read whole from the chain and driven by it. The tree
// plays its decisions as they happened; the chambers list their chairs, their
// floor and their treasury; the ledger lists every decision with its verdicts.
// That is the public half, and anyone reads it from the chain.
// The private half comes from the polis's body over one websocket: a hello
// signed by the seat key opens the door if the key holds a seat or a chair in
// the tree, and then the charter and the text of every decision stream down,
// votes and decisions go up. The body cranks by itself. Nothing here is shown
// that the chain did not do or the body did not send.
import { GENERATIONS, RPC, NET, conn, web3, clock, CLASS_NAME, uid, key, readChain, scanBalances, subscribe, subtree, history, sessionOf, mountTree, syncActivity, activityOf, watchClock, riders, facesIn, turnTo } from './tree.js?v=riders-1';
import { isVotingSession } from './activity.js?v=speaker-burst-1';
import { glyphs } from './pantheon.mjs?v=hall-1';
import { membershipForKey, bodyChallenge, canReadPrivate, verifyPrivateText, revokePrivateData } from './polis-access.js';
import { classifyProposal, summarizeProposals, RITE, riteOf, levelOf } from './polis-state.js';
import { mountRoomPlan, readProgram, readPresence } from './room-plan.mjs?v=room-4';
import { riderOf, seatsOf, hexOf, facing, doorOf, firstSeatOf } from './polis-knock.mjs?v=first-seat-1'; import { pictureOf } from './riders.mjs?v=riders-1';

const $ = (id) => document.getElementById(id);
const q = new URLSearchParams(location.search);
const rootId = q.get('civ');
const g = GENERATIONS.find((x) => x.P.PROGRAM_ID.toBase58() === q.get('program')) || GENERATIONS[GENERATIONS.length - 1];
const P = g.P;
let chainVerified = false, membershipReadAt = 0, refreshPending = null, disposed = false, userPaused = false;
let stopClock = null, stopSubscription = null, membershipTimer = null;
let proposalFormScope = null, restoringPage = false;
const enc = new TextEncoder();
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const short = (k) => { const s = typeof k === 'string' ? k : new web3.PublicKey(k).toBase58(); return `${s.slice(0, 4)}…${s.slice(-4)}`; };
const sol = (l) => (Number(l) / 1e9).toFixed(3);
const b64 = (u8) => btoa(String.fromCharCode(...u8));
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const STATE_NAME = ['in session', 'PASSED', 'REJECTED', 'DEADLOCK', 'EXPIRED'];
const titled = (s) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()), chamberName = (id) => { const r = g.registries.get(uid(id)); return r ? (r.name || `chamber ${id}`) : `chamber ${id}`; };
const say = (m) => { $('say').textContent = m; };
// a person reads time, not slots: devnet runs about 400 ms a slot
const SLOT_MS = 400;
const dur = (slots) => {
  const s = Number(slots) * SLOT_MS / 1000;
  if (!Number.isFinite(s)) return `${slots} slots`;
  if (s < 90) return `${Math.max(1, Math.round(s))} s`;
  if (s < 5400) return `${Math.round(s / 60)} min`;
  if (s < 172800) return `${(s / 3600).toFixed(s < 36000 ? 1 : 0)} h`;
  return `${(s / 86400).toFixed(1)} days`;
};
const ago = (slot) => clock.slot === null ? `at slot ${slot}` : `${dur(clock.slot - Number(slot))} ago`;

// ---- the seat: the key that speaks ----
// Where the seat key lives is not decided (the pill on a Mac, a passkey on the
// web). Until it is, a key born in this browser stands in: kept in local
// storage, shown plainly as a stand-in, holding whatever seats were sent to it.
const SEAT_STORE = `poleis-seat-${P.PROGRAM_ID.toBase58()}`;
function seatKey() {
  try { const s = localStorage.getItem(SEAT_STORE); if (s) return nacl.sign.keyPair.fromSecretKey(Uint8Array.from(JSON.parse(s))); } catch { /* no storage: a fresh key each visit */ }
  const kp = nacl.sign.keyPair();
  try { localStorage.setItem(SEAT_STORE, JSON.stringify(Array.from(kp.secretKey))); } catch { /* same */ }
  return kp;
}
const seat = seatKey();
let wallet = null, rider = null, me = new web3.PublicKey(seat.publicKey), identityRevision = 0;
const ownKey = () => rider?.key ?? new web3.PublicKey(seat.publicKey), riding = () => !wallet && !!rider && me.equals(rider.key), hersToSign = () => { if (!rider.sign) throw new Error(THERE); return rider.sign; }, THERE = 'She knocks from the browser you minted her in.';
const watchedWallets = new WeakSet();
const selectedBytes = () => me.toBytes();
/** Where this key sits in the tree, read from the chain: [{ id, seats, chairs: [k] }] for every chamber it is a member of. */
function membership() {
  return membershipForKey(g.registries, subtree(g, rootId), selectedBytes(), {holderKeyKind:P.HOLDER.KEY, slot:clock.slot});
}
const privateOpen = () => !disposed && !document.hidden && canReadPrivate({membership:membership(),chainVerified,
  chainFresh:Date.now()-membershipReadAt < 20000 && clock.slot!==null,
  session:body,key:me.toBase58(),program:P.PROGRAM_ID.toBase58(),root:rootId});
async function signMessage(message) {
  if (!wallet) return riding() ? hersToSign()(message) : nacl.sign.detached(message,seat.secretKey);
  const signer=me.toBase58(), result=await wallet.signMessage(message,'utf8');
  if (me.toBase58()!==signer || !nacl.sign.detached.verify(message,result.signature,selectedBytes())) throw new Error('The selected key did not sign this message.');
  return result.signature;
}
async function signTransaction(tx, expectedKey=me.toBase58()) {
  const provider=wallet;
  if(me.toBase58()!==expectedKey)throw new Error('The selected identity changed before signing.');
  if(provider){
    if(typeof provider.signTransaction!=='function')throw new Error('This wallet cannot sign transactions. Use a wallet that supports transaction signing.');
    const signed=await provider.signTransaction(tx);
    if(disposed || wallet!==provider || me.toBase58()!==expectedKey)throw new Error('The wallet identity changed while signing.');
    return signed;
  }
  if(riding())tx.addSignature(me,await hersToSign()(tx.serializeMessage()));else tx.partialSign({publicKey:me,secretKey:seat.secretKey});return tx;
}

// ---- the body: one websocket to this polis's container ----
// ?body=ws://host:port/ws names it until the host routes every polis to its own.
let bodyUrl = q.get('body') || '';
const body = {ws:null,pubkey:null,member:null,charter:null,texts:new Map(),state:'none',why:'',pending:new Map(),seq:0,authenticated:false,challenge:null};
// THE ROOM (room-plan.mjs, Oct 12 2026): the society's room, drawn from the program its body sends ({t:'room'}, {t:'presence'}), public to a
// visitor who holds the socket without a seat; the words under it stay the members'. Drawn on cause only; nothing at rest costs anything.
const plan = mountRoomPlan($('room-plan'));
const bodyIn = () => privateOpen() && body.ws?.readyState===1;
const currentSocket = ws => !disposed && !document.hidden && ws===body.ws && ws.readyState===1;
function clearPrivate(reason='',close=true) {
  const socket=body.ws;
  for(const p of body.pending.values()) { clearTimeout(p.timer); p.reject(new Error(reason || 'The room connection closed.')); }
  body.pending.clear();Object.assign(body,revokePrivateData(body));body.ws=null;body.why=reason;
  if(socket && plan) plan.offline(reason);   // the room stands as last seen; a new program redraws it
  if(close && socket) socket.close();
  renderCharter();renderLedger();renderRoom();renderFloor();renderOpen();
}
function validBodyURL(value) {
  const url=new URL(value);
  if(!['ws:','wss:'].includes(url.protocol)||url.username||url.password)throw new Error('Use the ws:// or wss:// address provided by this society.');
  if(location.protocol==='https:'&&url.protocol!=='wss:')throw new Error('This page needs a secure wss:// connection.');
  return url.href;
}
function bodyConnect() {
  if(!bodyUrl || disposed || document.hidden)return;
  clearPrivate();
  let ws;
  try { bodyUrl=validBodyURL(bodyUrl);ws=new WebSocket(bodyUrl); }
  catch(e){body.why=e.message;renderFloor();return;}
  body.ws=ws;body.state='connecting';renderFloor();
  // Preserve the wire order while locally hashing received texts.
  let incoming=Promise.resolve();
  ws.onmessage=ev=>{if(!currentSocket(ws))return;let m;try{m=JSON.parse(ev.data);}catch{return;}
    if(!m || typeof m!=='object' || typeof m.t!=='string')return;
    // An access revocation must not wait behind a slow hash or chain request.
    if(m.t==='refused' && (!m.id || !body.pending.has(m.id))) {clearPrivate(m.why||'This key was not admitted.');return;}
    incoming=incoming.then(()=>bodyMessage(m,ws)).catch(e=>{if(ws===body.ws)clearPrivate(e.message);});};
  ws.onclose=()=>{if(ws===body.ws)clearPrivate('Connection closed. Reconnect to enter. ',false);};
  ws.onerror=()=>{};
}
async function bodyMessage(m,ws) {
  if(!currentSocket(ws))return;
  if(m.t==='room'){const p=readProgram(m.program);if(p&&plan)plan.program(p);return;}   // the room's life: the public half, in any state
  if(m.t==='presence'){const d=readPresence(m);if(d&&plan)plan.presence(d);return;}
  if(m.t==='challenge') {
    if(body.state!=='connecting' || body.challenge)throw new Error('This connection repeated its identity challenge.');
    body.state='authenticating';
    const c=bodyChallenge(m,{program:P.PROGRAM_ID.toBase58(),root:rootId});
    if(!c)throw new Error('This connection belongs to a different society or sent an invalid challenge.');
    await refreshMembership();
    if(!currentSocket(ws))return;
    if(!chainVerified||Date.now()-membershipReadAt>=20000)throw new Error('This key has no seat or chair in this society.');
    if(!membership().length){body.state='visitor';body.why='';renderFloor();return;}   // a visitor keeps the socket for the room's life and never says hello: the words stay closed
    const selected=me.toBase58(), sig=await signMessage(enc.encode(c.signingText));
    if(!currentSocket(ws)||selected!==me.toBase58())return;
    body.pubkey=new web3.PublicKey(c.body);body.challenge=c;
    body.key=selected;body.root=rootId;body.program=P.PROGRAM_ID.toBase58();
    ws.send(JSON.stringify({t:'hello',key:selected,sig:b64(sig)}));
  } else if(m.t==='welcome') {
    if(body.state!=='authenticating'||!body.challenge||m.key!==body.key||m.body!==body.pubkey?.toBase58())throw new Error('The room could not verify this identity.');
    body.state='in';body.authenticated=true;body.member=m.member;body.why='';
    if(!privateOpen())throw new Error('Membership could not be confirmed.');
    renderFloor();renderRoom();renderCharter();renderLedger();renderOpen();
    $('connect-dialog').close();
  } else if(m.t==='charter'||m.t==='text') {
    if(!privateOpen())return;
    if(typeof m.text!=='string' || m.text.length>1048576 || (m.t==='text' && !/^[0-9a-f]{64}$/.test(m.hash)))return;
    // The body can announce a new proposal before the subscription reaches us.
    if(!privateRecordHash(m))await refreshMembership();
    if(!currentSocket(ws)||!privateOpen())return;
    const expected=privateRecordHash(m)?.slice();
    const accepted=await verifyPrivateText(m.text,expected);
    if(!currentSocket(ws)||!privateOpen())return;
    const current=privateRecordHash(m);
    // A charter change or subtree detachment during hashing invalidates this read.
    if(!expected || !current || !same(expected,current))return;
    if(!accepted){body.why='A received text did not match the public record.';renderFloor();return;}
    if(m.t==='charter')body.charter={text:m.text,verified:true,hash:key(expected)};
    else body.texts.set(m.hash,{text:m.text,verified:true,hash:key(expected)});
    renderCharter();renderLedger();renderRoom();
  } else if(m.t==='chain') { await refreshMembership(); if(currentSocket(ws))await refreshAll(); }
  else if(m.t==='landed'||m.t==='refused') {
    const pending=m.id&&body.pending.get(m.id);
    if(pending){clearTimeout(pending.timer);body.pending.delete(m.id);m.t==='landed'?pending.resolve(m):pending.reject(new Error(m.why));}
    else if(m.t==='refused')clearPrivate(m.why||'This key was not admitted.');
  }
}
function privateRecordHash(message) {
  if(message.t==='charter')return g.registries.get(rootId)?.charter;
  const proposal=g.proposals.get(message.hash);
  return proposal && subtree(g,rootId).includes(uid(proposal.origin)) ? proposal.manifest : null;
}
function prunePrivateRecords() {
  const charter=privateRecordHash({t:'charter'});
  if(body.charter && (!charter || body.charter.hash!==key(charter)))body.charter=null;
  for(const [hash,text] of body.texts) {
    const manifest=privateRecordHash({t:'text',hash});
    if(!manifest || text.hash!==key(manifest))body.texts.delete(hash);
  }
}
async function refreshMembership() {
  if(refreshPending)return refreshPending;
  refreshPending=(async()=>{
    try {
      // The shared reader verifies PDAs, replaces a complete snapshot atomically,
      // and merges subscriptions newer than that snapshot. A bare account read
      // can roll a just-observed revocation back to an older RPC value.
      const observed=await readChain();
      if(disposed)return;
      membershipReadAt=observed.scannedAt;
      chainVerified=Number.isFinite(membershipReadAt) && Date.now()-membershipReadAt<20000 && clock.slot!==null;
      prunePrivateRecords();
    }catch{chainVerified=false;}
    if(body.authenticated&&!privateOpen())clearPrivate('Membership is no longer confirmed.');
  })().finally(()=>{refreshPending=null;});
  return refreshPending;
}
/** Send a message the body answers by id, and wait for that answer. */
function ask(msg) {
  return new Promise((resolve, reject) => {
    if (!bodyIn()) { reject(new Error('the body is not in the room')); return; }
    const id = String(++body.seq);
    const timer=setTimeout(() => { if (body.pending.has(id)) { body.pending.delete(id); reject(new Error('the body did not answer')); } }, 60_000);
    body.pending.set(id, { resolve, reject, timer });
    try {body.ws.send(JSON.stringify({ ...msg, id }));}
    catch(error){clearTimeout(timer);body.pending.delete(id);reject(error);}
  });
}

// ---- the head ----
const proposalState = p => classifyProposal({proposal:p,sessions:p.impacted.map(id=>sessionOf(g,p,uid(id))).filter(Boolean),slot:clock.slot,states:P.STATE});
const proposalSummary = () => summarizeProposals({proposals:history(g,rootId),sessionFor:(p,id)=>sessionOf(g,p,id),slot:clock.slot,states:P.STATE});
function renderHead() {
  const r=g.registries.get(rootId);
  if(!r){$('name').textContent='Society unavailable';return;}
  document.title=`Swarmbook · ${r.name||rootId}`;
  $('name').textContent=titled(r.name||`Society ${rootId}`);
  $('desc').textContent=r.desc||'This society has not added a description.';
  const units=subtree(g,rootId), seats=units.reduce((n,id)=>n+Number(g.registries.get(id)?.totalSeats||0),0);
  const cap=units.reduce((n,id)=>n+P.ladderHexagons(g.registries.get(id)?.rung||0),0);
  const treasury=units.reduce((n,id)=>n+(g.balances.get(id)||0),0),summary=proposalSummary(),lv=levelOf(g.registries,units,P.HOLDER.EMPTY);
  $('facts').innerHTML=`<div><strong>${seats} <small>/ ${cap}</small></strong><span>Seats occupied</span></div><div><strong>${lv.held} <small>/ 12</small></strong><span>Chairs held</span></div><div><strong>${lv.levels}</strong><span>${lv.levels===1?'Level':'Levels'}</span></div><div><strong>${sol(treasury)} <small>SOL</small></strong><span>In the treasury</span></div><div><strong>${units.length}</strong><span>${units.length===1?'Chamber':'Chambers'}</span></div>`;   // the level's three numbers first: floor, chairs, levels
  $('n-decisions').textContent=summary.total;
  $('n-label').textContent=`${summary.voting} voting now · ${summary.awaitingSeal} awaiting seal`;
  $('guardian-facts').innerHTML=[`Layout ${g.layout}`,`Root ${esc(rootId)}`,`Program ${P.PROGRAM_ID.toBase58()}`,`RPC ${esc(RPC)}`].map(x=>`<span class="mono">${x}</span>`).join('');
  $('chain-link').href=`https://explorer.solana.com/address/${P.registryPda(BigInt(rootId)).toBase58()}${NET==='devnet'?'?cluster=devnet':''}`;
}

// Glyphs are derived from public IDs only. Private text never enters this markup.
function lockedRecord(id,label) {return `<div class="private-record"><div class="private-record-head"><span>${esc(label)}</span><span aria-hidden="true">◇</span></div>${glyphs(id)}</div>`;}
function renderRoom() {
  const r=g.registries.get(rootId);if(!r)return;
  const open=privateOpen(),mine=membership();
  $('access-badge').textContent=open?'Inside':mine.some(m=>m.chairs.length)?'Member':mine.length?'Rider':knockOf()?'At the door':'Visitor';
  document.body.dataset.access=open?'member':'visitor';
  for(const b of document.querySelectorAll('.member-button'))b.innerHTML=`${open?'Your membership':mine.length?'Open the room':'Enter as a member'} <span aria-hidden="true">↗</span>`;
  $('room-status').textContent=open?'Member connection · texts verified':mine.length?'Your place is confirmed. Connect to read.':'Private words belong to members.';
  if(!open) {
    const records=history(g,rootId).slice(-2).reverse();
    $('room-content').innerHTML=`<div class="room-intro">${glyphs(rootId,1,true)}<h2>A society in its<br>own language.</h2><p>You can see its life from here.<br>Its words open to those who belong.</p></div>${records.map(p=>lockedRecord(key(p.hash),'Private proposal')).join('')}${lockedRecord(key(r.charter),'Founding charter')}<button class="primary-button" data-connect>${mine.length?'Open the room':'Enter as a member'} ↗</button>`;
  } else {
    const entries=history(g,rootId).slice().reverse().filter(p=>body.texts.has(key(p.hash)));
    $('room-content').innerHTML=`<div class="room-intro"><h2>You’re inside.</h2><p>The society’s proposals, in their own words.</p></div>${entries.length?entries.map(p=>`<article class="entry"><div class="meta">${esc(chamberName(p.origin))} · Proposal</div><div class="prose">${esc(body.texts.get(key(p.hash)).text)}</div><div class="row"><span class="chip">${esc(proposalState(p).label)}</span></div></article>`).join(''):'<div class="empty-room"><p>No proposal text has arrived yet.</p></div>'}<p class="locked-note">The conversation feed is not connected yet.</p>`;
  }
  wireConnectButtons();
}
// ---- the charter: its hash on chain for everyone, its text from the body for a member ----
function renderCharter() {
  const r=g.registries.get(rootId);if(!r)return;
  $('guardian-charter').textContent=`Charter hash ${key(r.charter)}`;
  $('charter').innerHTML=privateOpen()&&body.charter?`<div class="prose">${esc(body.charter.text)}</div><p class="locked-note">Verified against the founding record.</p>`:
    `${lockedRecord(key(r.charter),'Founding charter')}<p class="locked-note">${privateOpen()?'Waiting for the society’s charter.':'Members can read the charter.'}</p>${!privateOpen()?'<button class="primary-button" data-connect>Enter to read ↗</button>':''}`;
  wireConnectButtons();
}

// ---- the chambers ----
function renderChambers() {
  const mine = membership();
  const mineOf = (id) => mine.find((m) => m.id === id);
  $('chambers').innerHTML = subtree(g, rootId).map((id) => {
    const r = g.registries.get(id); if (!r) return '';
    const m = mineOf(id);
    const chairs = r.pentagons.map((p, k) => {
      if (p.kind === P.HOLDER.UNIT) return `<div class="chair bound" title="chair ${k + 1}: a crew">${k + 1} · ${esc(chamberName(P.holderUnit(p.holder)))}</div>`;
      if (p.kind === P.HOLDER.KEY) return `<div class="chair${m && m.chairs.includes(k) ? ' mine' : ''}" title="chair ${k + 1} · ${short(p.holder)}">${k + 1}</div>`;
      return `<div class="chair empty">${k + 1}</div>`;
    }).join('');
    const floor = r.holders.length ? r.holders.map((h) => {
      const who = h.kind === P.HOLDER.UNIT ? esc(chamberName(P.holderUnit(h.holder))) : h.kind === P.HOLDER.KEY && same(h.holder, selectedBytes()) ? 'you' : 'a holder';
      const isMe = h.kind === P.HOLDER.KEY && same(h.holder, selectedBytes());
      return `<span class="${isMe ? 'mine' : ''}">${who} · ${h.seats} seat${h.seats === 1n ? '' : 's'}${h.weight !== 1n ? ` × ${h.weight}` : ''}</span>`;
    }).join('') : '<span>no floor: the chairs seal alone</span>';
    const parent = r.level > 0 ? ` · in chair ${r.chairInParent + 1} of ${esc(chamberName(r.parent))}` : '';
    const [gm, gn] = P.LADDER[r.rung] || [1, 0];
    const pool = g.pools?.get(id);
    const spots = pool ? pool.open - pool.filled : 0n;
    const rung = `<span class="mono">G(${gm},${gn}) · ${r.totalSeats} of ${P.ladderHexagons(r.rung)} seats${spots > 0n ? ` · ${spots} at the door, ${sol(pool.price)} SOL a seat` : ''}</span>`;
    return `<div class="chamber">
      <div class="head"><b>${esc(r.name || `chamber ${id}`)}</b><span class="mono">level ${r.level}${parent}</span>${rung}<span class="mono">holds ${sol(g.balances.get(id) || 0)} SOL · may spend ${sol(r.planCap)} SOL per ${dur(r.planPeriod)}, ${sol(r.planSpent)} spent</span><span class="mono">a vote runs ${dur(r.window)} · a codex change ${dur(r.codexWindow)}${r.frozen ? ' · DISSOLVED' : ''}</span></div>
      <div class="chairs">${chairs}</div>
      <div class="floor">${floor}</div>
    </div>`;
  }).join('');
}

// ---- the ledger ----
function describe(p) {
  if (!P.payloadParse) return { d: { cls: p.cls }, kind: `${CLASS_NAME[p.cls] || 'a'} decision`, text: '' };   // the older program's client reads no payload: its societies' pages stopped here
  const d = P.payloadParse(p.payload, p.origin);
  const k = `${d.cls}:${d.kind}`, K = P.KIND, C = P.CLASS;
  const door = k === `${C.CODEX}:${K.CODEX_LADDER}` && d.mode === 1;
  const kind = door ? 'the door' : P.kindName(d);
  const text = (() => {
    switch (k) {
      case `${C.TREASURY}:${K.TREASURY_BUDGET}`: return `${sol(d.amount)} SOL ${p.executed?'executed':'proposed'}`;
      case `${C.TREASURY}:${K.TREASURY_TRANSFER}`: return `${sol(d.amount)} SOL to ${chamberName(d.dest)}`;
      case `${C.TREASURY}:${K.TREASURY_DIVIDEND}`: return `${sol(d.amount)} SOL to the floor by weight`;
      case `${C.TREASURY}:${K.TREASURY_CONTRACT}`: return `${sol(d.amount)} SOL escrow ${p.executed?'executed':'proposed'}`;
      case `${C.TREASURY}:${K.TREASURY_ALLOWANCE}`: return `${sol(d.cap)} SOL per ${dur(d.period)}`;
      case `${C.CODEX}:${K.CODEX_NAME}`: return `“${d.name}”${d.desc ? `, ${d.desc}` : ''}`;
      case `${C.CODEX}:${K.CODEX_PLAN}`: return `${sol(d.cap)} SOL per ${dur(d.period)}`;
      case `${C.CODEX}:${K.CODEX_WINDOW}`: return `a vote runs ${dur(d.window)}, a codex change ${dur(d.codexWindow)}`;
      case `${C.CODEX}:${K.CODEX_DIVIDEND_POLICY}`: return `${Number(d.bps) / 100}% of income per ${dur(d.period)}`;
      case `${C.CODEX}:${K.CODEX_CRANK_TIP}`: return `${d.tip} lamports per act`;
      case `${C.CODEX}:${K.CODEX_FOUND}`: return `“${d.spec.name}” in chair ${d.spec.chair + 1}, ${d.spec.founders.length} founders`;
      case `${C.CODEX}:${K.CODEX_UPGRADE}`: return 'new code for the program';
      case `${C.CODEX}:${K.CODEX_UPGRADE_AUTHORITY}`: return d.newAuthority ? 'handed to another key' : 'burned: nobody can change the code again';
      case `${C.SEAT}:${K.SEAT_RECALL}`: return `chair ${d.chair + 1}`;
      case `${C.SEAT}:${K.SEAT_ATTACH}`: return `chair ${d.chair + 1}, a term of ${dur(d.term)}${d.retainer ? `, retainer ${sol(d.retainer)} SOL` : ''}`;
      case `${C.SIGNAL}:${K.SIGNAL_SALE_DEFAULTS}`: return `reserve ${d.reserve}, deposit ${d.deposit}`;
      case `${C.CODEX}:${K.CODEX_LADDER}`: return door ? `the next rung's spots open to knocks at ${sol(d.reserve)} SOL a seat` : `a sale of the next rung's seats, reserve ${sol(d.reserve)} SOL`;
      case `${C.SEAT}:${K.SEAT_ADMIT}`: return p.executed?'one new rider admitted':'admit one new rider';
      case `${C.SEAT}:${K.SEAT_REFUSE}`: return p.executed?'admission refused; deposit returned':'refuse admission and return the deposit';
      case `${C.SIGNAL}:${K.SIGNAL_WEIGHT}`: return `× ${d.weight}`;
      default: return '';
    }
  })();
  return { d, kind, text };
}
function renderLedger() {
  const h=history(g,rootId).slice().reverse(),open=privateOpen();
  $('ledger').innerHTML=h.length?h.map(p=>{
    const {kind,text}=describe(p),hh=key(p.hash),t=open?body.texts.get(hh):null,state=proposalState(p);
    return `<article class="entry" data-h="${hh}"><div class="what">${esc(kind)}${text?`: ${esc(text)}`:''}</div><div class="meta">Opened ${ago(p.opened)}</div><div class="row verdicts"><span class="chip">${esc(state.label)}</span></div>${t?`<div class="prose">${esc(t.text)}</div>`:!open?lockedRecord(hh,'Proposal text'):'<p class="note">Waiting for the proposal text.</p>'}</article>`;
  }).join(''):'<p class="note">The society has not opened a proposal yet.</p>';
}
// Clock ticks only update verdict labels; leave any opened memo and in-flight
// text read attached to its original DOM node.
function refreshLedgerActivity() {
  for (const entry of $('ledger').querySelectorAll('.entry[data-h]')) {
    const p = g.proposals.get(entry.dataset.h);
    if (p) entry.querySelector('.verdicts').innerHTML = `<span class="chip">${esc(proposalState(p).label)}</span>`;
  }
}

// ---- in session: the votes; the body cranks ----
// a chamber's vote as it stands: its twelve chairs in their order, its floor in its holders' order, each as wide as the seats it holds
const voice = (v) => (v === P.VOTE.PRO ? 'yes' : v === P.VOTE.CONTRA ? 'no' : v === P.VOTE.ABSTENTIO ? 'abstain' : '');
const bar = (who, cells, pro, of) => `<div class="bar"><span>${who}</span><i>${cells.map(([v, n]) => `<u class="${v}" style="flex:${n}"></u>`).join('')}</i><b>${pro} of ${of}</b></div>`;
const bars = (r, s) => { const lit = r.pentagons.map((c, k) => [c, k]).filter(([c]) => c.kind === P.HOLDER.KEY || c.kind === P.HOLDER.UNIT);
  return bar('Chairs', lit.map(([, k]) => [voice(s.chairVoice(k)), 1]), s.pentPro, lit.length) + (r.holders.length ? bar('Riders', r.holders.map((h, k) => [voice(s.holderVoice(k)), h.seats]), s.hexPro, s.activeWeight || r.totalSeats) : ''); };
function renderOpen() {
  const mine = membership();
  const units = subtree(g, rootId);
  const rows = [];
  for (const p of history(g, rootId)) {
    const { kind, text } = describe(p);
    const live = !p.executed && units.some((id) => isVotingSession(sessionOf(g, p, id), P.STATE.VOTING, clock.slot));
    const awaiting = !p.executed && units.some((id) => sessionOf(g, p, id)?.state === P.STATE.VOTING);
    const passed = proposalState(p).executionReady;
    if (!live && !passed && !awaiting) continue;
    const said = /^(admit|refuse) /.test(text) ? text : `${kind}${text ? `: ${text}` : ''}`;
    const parts = [`<div class="what">${esc(said[0].toUpperCase() + said.slice(1))}${p.consent ? ' · consent asked' : ''}</div>`];
    for (const id of p.impacted.map(uid)) {
      const s = sessionOf(g, p, id), r = g.registries.get(id); if (!s || !r) continue;
      const m = mine.find((x) => x.id === id), left = clock.slot === null ? null : Number(s.deadline) - clock.slot;
      const state = s.state === P.STATE.VOTING ? left === null ? 'activity unavailable' : left >= 0 ? `${dur(left)} left` : 'window ended · awaiting seal' : STATE_NAME[s.state];
      parts.push(`<div class="meta">${units.length > 1 ? `<b>${esc(titled(chamberName(id)))}</b> · ` : ''}${state === state.toUpperCase() ? state.toLowerCase() : state}</div>${m || id === uid(p.origin) ? bars(r, s) : ''}`);
      const k = m ? r.holders.findIndex((h) => h.kind === P.HOLDER.KEY && same(h.holder, selectedBytes())) : -1, said = m ? voice(k >= 0 ? s.holderVoice(k) : s.chairVoice(m.chairs[0])) : '';   // the chain counts a key's voice once: what it said stands in place of the buttons
      if (!p.executed && isVotingSession(s, P.STATE.VOTING, clock.slot) && m) parts.push(said ? `<div class="votes said">You said ${said}</div>` : `<div class="votes">${[['yes', P.VOTE.PRO], ['no', P.VOTE.CONTRA], ['abstain', P.VOTE.ABSTENTIO]].map(([w, v]) => `<button class="${w}" data-vote="${key(p.hash)}|${id}|${v}">${w}</button>`).join('')}</div>`);
    }
    if (passed) parts.push('<div class="note">passed: the body executes it</div>');
    rows.push(`<div class="entry">${parts.join('')}</div>`);
  }
  $('current-section').hidden=!rows.length;
  $('open').innerHTML = rows.join('');
  for (const b of $('open').querySelectorAll('button[data-vote]')) b.onclick = () => act(b, async () => {
    const [h, id, choice] = b.dataset.vote.split('|'), p = g.proposals.get(h), c = Number(choice), sig = await signMessage(P.voteEnvelope(p.hash, BigInt(id), c));   // A RIDER STEERS (Nov 22 2026): signed by the key that holds the seat; the body carries it when in, else this page does (attest asks no host: anyone may carry a signed vote, ix/proposal.rs), the key paying its own fee
    return bodyIn() ? (await ask({ t: 'vote', hash: h, unit: id, choice: c, sig: b64(sig) })).sig : (await ensureLamports(20_000n), sendMine(P.attestBatch(me, p.hash, BigInt(id), [{ voter: me, choice: c, signature: sig }])));
  }, 'the vote landed');
}
async function act(button, fn, done) {
  const label = button.textContent; button.disabled = true; button.textContent = 'signing…';
  try { const sig = await fn(); say(`${done} · ${sig.slice(0, 12)}…`); await refreshAll(); } catch (e) { say(`refused: ${e.message}`); button.disabled = false; button.textContent = label; }
}

// ---- THE KNOCK STANDS ON THE SWARM: the free seats at a door are rimmed red on the ball itself, a press on one, or on the door under it, asks for a seat ----
const knockOf = () => { for (const id of subtree(g, rootId)) { const k = g.knocks?.get(`${id}|${me.toBase58()}`); if (k) return k; } return null; };
const free = (id) => { const pool = g.pools?.get(id), r = g.registries.get(id); return pool && r && !r.frozen ? Number(pool.open - pool.filled) : 0; };
let worn = new Map(), face = null, doorSaid = '';   // what each chamber's hexagons wear, read once a refresh: the visitor's own seats, and the free ones at its door
function renderDoor() {
  const units = subtree(g, rootId), mine = membership(), k = knockOf(), at = units.find((id) => free(id) > 0), n = units.reduce((a, id) => a + free(id), 0);
  const left = k && clock.slot !== null ? Number(k.slot + g.registries.get(uid(k.unit)).codexWindow) - clock.slot : null;
  const sale = g.sales.get(rootId), first = firstSeatOf({ ratified: g.configs.get(rootId)?.mode !== P.MODE.GENESIS, sale, slot: clock.slot, bid: bidOf(), won: !!sale?.board.some((e) => e.bidder.equals(me) && e.nonce === 0n), held: mine.length > 0, seats: Number(g.registries.get(rootId)?.totalSeats ?? 0), sol, when: (s) => `about ${new Date(Date.now() + (Number(s) - clock.slot) * SLOT_MS).toISOString().slice(11, 16)} UTC` });   // A NEWBORN HAS A DOOR TO ITS FIRST SEAT: its genesis sale's door stands where the knock does until it is ratified
  const html = first || doorOf({ member: mine.length > 0, knock: k, left, unit: k && uid(k.unit), at, seats: n, sol, dur });
  const wears = units.map((id) => [`u${id}`, seatsOf(g.registries.get(id), id, mine.length || k ? 0 : free(id), (h) => h.kind === P.HOLDER.KEY && same(h.holder, selectedBytes()))]);
  const here = [...(g.knocks?.values() || [])].filter((x) => units.includes(uid(x.unit))).slice(0, 4).map((x) => x.key.toBase58()), hers = riding() ? me.toBase58() : null;
  const waiting = here.map((k, i) => { const r = riders.of(k), src = k === hers ? rider.face : r?.src, she = `class="her" style="--i:${i}${src ? `;background-image:url(${src})` : ''}"`; return r?.page ? `<a ${she} href="${r.page}" aria-label="${r.page.slice(1)}"></a>` : `<i ${she}></i>`; }).join('');
  const said = JSON.stringify([html, wears, waiting, me.toBase58(), !!tree]); if (said === doorSaid) return; doorSaid = said;   // painted on a change alone: a tick that changes nothing paints nothing
  const typed = $('first-bid')?.value; $('doors').innerHTML = html; if (typed && $('first-bid')) $('first-bid').value = typed; $('ring').innerHTML = waiting; worn = new Map(wears); riders.ask(here);
  $('door-pill').innerHTML = at && !mine.length && !k ? `<button class="door" data-door="${at}">Knock ↗</button>` : '';
  for (const b of document.querySelectorAll('[data-door]')) b.onclick = () => openKnock(b.dataset.door); if (knocked && units.includes(knocked) && free(knocked) > 0 && !mine.length && !k) { openKnock(knocked); knocked = ''; }
  for (const b of document.querySelectorAll('#doors [data-withdraw]')) b.onclick = () => withdrawAt(b); for (const b of document.querySelectorAll('#doors [data-first]')) b.onclick = () => act(b, () => firstAt(b.dataset.first), 'the chain holds it'); wireConnectButtons();
  if (tree) { faceIt(); window.PoleisEngine.drawOnce(tree.inst); }
}
// The society turns to the visitor what is theirs, or who rides it (polis-knock.mjs facing). Once for each.
let faced = '', knocked = /^#knock=(\d+)$/.exec(location.hash)?.[1] ?? '';   // knocked: the knock a rider comes back to from the mint, opened once
function faceIt() { const at = facing(worn.get(`u${rootId}`), facesIn(tree)); if (faced !== `${rootId}:${at}` && turnTo(tree, at)) faced = `${rootId}:${at}`; }
function openKnock(id) {
  const pool = g.pools.get(id), n = free(id), press = $('knock-press'), able = riding() || !!wallet, away = riding() && !rider.sign, r = g.registries.get(id); if (!pool || !n || !r) return;
  $('knock-name').textContent = chamberName(id); $('knock-price').textContent = `${sol(pool.price)} SOL`; $('knock-her').style.backgroundImage = riding() ? `url(${rider.face})` : '';
  $('knock-ask').textContent = `${riding() ? 'Your Lyssajudron' : wallet ? 'Your wallet' : 'A minted Lyssajudron'} asks for ${n === 1 ? 'the last seat' : `one of ${n} seats`}. Both chambers answer.`;
  $('knock-note').textContent = away ? THERE : `Refused or unanswered in ${dur(r.codexWindow)}, it comes home.`; press.disabled = away; press.textContent = able ? 'Knock ↗' : 'Mint yours ↗';
  press.onclick = () => { if (!able) { const her = $('knock-her').getBoundingClientRect(); try { sessionStorage.setItem('dl-knock', JSON.stringify({ href: `${location.pathname}${location.search}#knock=${id}`, name: chamberName(id), at: Date.now(), from: [her.x + her.width / 2, her.y + her.height / 2, her.height * .479] })); } catch { /* the wall is the way back */ } location.href = './warm.html?door=deposit'; return; }   // THE HEXAGON'S OWN MINT (dl-mint-hexagon.js), and back here from it
    void act(press, async () => { const sig = await knockAt(BigInt(id)); $('knock-dialog').close(); return sig; }, 'the knock is on the chain').then(() => { if ($('knock-dialog').open) $('knock-note').textContent = $('say').textContent; }); };
  $('knock-dialog').showModal();
}
// ---- the door's keys: knock with this key, and take the deposit back if the polis keeps you waiting ----
// the knocks at a chamber, as options for an admission or a refusal
function knockPicker() {
  const origin = uid($('p-origin')?.value ?? rootId);
  const knocks = [...(g.knocks?.values() || [])].filter((k) => uid(k.unit) === origin);
  return knocks.length
    ? `<select id="f-key">${knocks.map((k) => `<option value="${k.key.toBase58()}">${short(k.key.toBase58())} · ${sol(k.deposit)} SOL since slot ${k.slot}</option>`).join('')}</select>`
    : '<input id="f-key" placeholder="a knocker\'s key (nobody is knocking here)">';
}
function renderDoors() {
  const rows = [];
  for (const id of subtree(g, rootId)) {
    const pool = g.pools?.get(id); const r = g.registries.get(id);
    const mine = g.knocks?.get(`${id}|${me.toBase58()}`);
    if (mine) {
      const wait = r ? Number(mine.slot + r.codexWindow) : null;
      const ready = wait !== null && clock.slot !== null && clock.slot >= wait;
      rows.push(`<div class="row"><span>knocking at ${esc(chamberName(id))} · ${sol(mine.deposit)} SOL in escrow since slot ${mine.slot}</span>${ready ? `<button data-withdraw="${id}">take the deposit back</button>` : `<span class="note">the chamber has until slot ${wait} to answer</span>`}</div>`);
    } else if (pool && pool.open > pool.filled && r && !r.frozen) {
      rows.push(`<div class="row"><span>${esc(chamberName(id))} · ${pool.open - pool.filled} spot${pool.open - pool.filled === 1n ? '' : 's'} at the door, ${sol(pool.price)} SOL a seat</span><button data-knock="${id}">knock</button></div>`);
    }
  }
  return rows.length ? `<div class="doors">${rows.join('')}</div>` : '';
}
// this key pays its own way: on devnet and localnet the faucet tops it up, elsewhere it must be funded
async function ensureLamports(needed) {
  const have = BigInt(await conn.getBalance(me, 'confirmed'));
  if (have >= needed) return;
  if (NET !== 'devnet' && NET !== 'localnet') throw new Error(`fund ${me.toBase58()} with ${sol(needed - have)} SOL first`);
  // the public faucet is rate-limited and often refuses: say what to send where, and to which key
  try {
    const sig = await conn.requestAirdrop(me, Number(needed - have) + 10_000_000);
    await conn.confirmTransaction(sig, 'confirmed');
  } catch (e) {
    // on devnet the public faucet is often dry or rate-limited by source; https://faucet.solana.com pays any address against a GitHub login
    const source = NET === 'devnet' ? 'at https://faucet.solana.com, which pays any address against a GitHub login,' : 'from the local faucet';
    throw new Error(`the ${NET} faucet refused this key (${e.message}). Fund ${me.toBase58()} with ${sol(needed - have + 10_000_000n)} SOL ${source} then press again`);
  }
}
async function sendMine(ixs) {
  const signer=me.toBase58();
  const tx = new web3.Transaction().add(...ixs);
  tx.feePayer = me;
  tx.recentBlockhash = (await conn.getLatestBlockhash('confirmed')).blockhash;
  const signed = await signTransaction(tx,signer);
  const sig = await conn.sendRawTransaction(signed.serialize(), { skipPreflight: false });
  await conn.confirmTransaction(sig, 'confirmed');
  return sig;
}
async function knockAt(unit) {
  const pool = g.pools.get(uid(unit)); const r = g.registries.get(uid(unit));
  if (!pool || pool.open <= pool.filled) throw new Error('no spot at this door');
  // the price, one holder row's rent, the knock's own rent, and a fee
  const row = BigInt(await conn.getMinimumBalanceForRentExemption(57));
  const own = BigInt(await conn.getMinimumBalanceForRentExemption(P.Knock.SIZE));
  await ensureLamports(pool.price + row + own + 20_000n);
  if (r.frozen) throw new Error('this chamber is dissolved');
  const sig = await sendMine([P.knock(me, unit)]);
  await readChain(); // the knock is a new account: read it back before the panel redraws
  return sig;
}
// the first seat's acts (polis-knock.mjs firstSeatOf): a sealed bid's price and salt kept in this browser's own seat store beside its key, so that this browser reveals it; settle and ratify are anyone's
const BIDS = `${SEAT_STORE}-bids`, bids = () => { try { return JSON.parse(localStorage.getItem(BIDS)) || {}; } catch { return {}; } }, bidOf = () => bids()[`${rootId}|${me.toBase58()}`] ?? null;
async function firstAt(a) { const u = BigInt(rootId), s = g.sales.get(rootId), b = bidOf(), price = a === 'bid' ? BigInt(Math.round(Number($('first-bid').value) * 1e9)) : BigInt(b?.price ?? 0), salt = a === 'bid' ? crypto.getRandomValues(new Uint8Array(32)) : Uint8Array.from(b?.salt ?? []);
  if (a === 'bid') { if (!(price >= s.reserve && price <= s.deposit)) throw new Error(`a bid is ${sol(s.reserve)} to ${sol(s.deposit)} SOL`); localStorage.setItem(BIDS, JSON.stringify({ ...bids(), [`${rootId}|${me.toBase58()}`]: { price: `${price}`, salt: [...salt] } })); }   // kept before it is sent: a bid this browser cannot reveal is a deposit lost
  await ensureLamports(a === 'bid' ? s.deposit + 3_000_000n : 2_000_000n); const sig = await sendMine([a === 'bid' ? P.commitSeatBid(me, u, 0n, 0n, await P.seatCommitment(price, 0n, salt, me)) : a === 'reveal' ? P.revealSeatBid(me, u, 0n, 0n, price, salt) : a === 'settle' ? P.settleSeats(me, u, 0n) : a === 'claim' ? P.claimSeat(me, u, 0n, 0n, u) : P.ratifyGenesis(me, u)]); await readChain(); return sig; }
const withdrawAt = (b) => act(b, async () => { const sig = await sendMine([P.withdrawKnock(me, BigInt(b.dataset.withdraw))]); g.knocks.delete(`${b.dataset.withdraw}|${me.toBase58()}`); return sig; }, 'the deposit came home');
window.addEventListener('poleis:knocks', () => renderFloor());

// ---- the floor: the seat, the door, and a decision put to the tree ----
function renderFloor() {
  $('seat').innerHTML=`<div class="mono">${me.toBase58()}</div><p class="note">${wallet?'Connected wallet':riding()?'Your flask':'Browser identity'} · ${esc(body.state)}</p>${renderDoors()}`;
  $('identity-status').textContent=`${wallet?'Wallet':riding()?'Your flask':'Browser identity'} ${short(me.toBase58())}`;
  $('body-status').textContent=body.why || (body.state==='in'?'Connected.':body.state==='connecting'?'Verifying your membership…':'');
  for (const b of $('seat').querySelectorAll('[data-knock]')) b.onclick = () => act(b, () => knockAt(BigInt(b.dataset.knock)), 'the knock is on the chain');
  renderDoor();
  for (const b of $('seat').querySelectorAll('[data-withdraw]')) b.onclick = () => withdrawAt(b);
  const mine = membership();
  $('membership').textContent = mine.length
    ? `this key holds ${mine.map((m) => `${m.seats ? `${m.seats} seat${m.seats === 1 ? '' : 's'}` : ''}${m.seats && m.chairs.length ? ' and ' : ''}${m.chairs.length ? `chair${m.chairs.length === 1 ? '' : 's'} ${m.chairs.map((k) => k + 1).join(', ')}` : ''} in ${chamberName(m.id)}`).join('; ')}`
    : `This identity holds no seat or chair here.`;
  renderRoom();
  if (!mine.length || !bodyIn()) { $('propose').innerHTML = ''; proposalFormScope = null; return; }
  // Public refreshes do not replace a member's in-progress proposal. A change
  // of identity or available chambers starts a new form; private drafts never
  // carry across identities or a revoked connection.
  const formScope = `${me.toBase58()}|${mine.map(m => m.id).join(',')}`;
  if (proposalFormScope === formScope && $('p-send')) return;
  proposalFormScope = formScope;
  $('propose').innerHTML = `
    <label for="p-origin">put to</label><select id="p-origin">${mine.map((m) => `<option value="${m.id}">${esc(chamberName(m.id))} and every crew below it (${subtree(g, m.id).length} chamber${subtree(g, m.id).length === 1 ? '' : 's'})</option>`).join('')}</select>
    <label for="p-kind">what</label><select id="p-kind"><option value="budget">a budget: pay lamports out of the treasury</option><option value="name">the name and description</option><option value="door">the door: open the next rung's spots to knocks</option><option value="admit">admit a knocker to a seat</option><option value="refuse">refuse a knocker</option><option value="plan">the plan: what may leave the treasury per period</option><option value="sale">sale defaults for the next seats</option></select>
    <div id="p-fields"></div>
    <label for="p-text">the text · hashed into the manifest on chain, kept by the body</label><textarea id="p-text" placeholder="what this is and why the tree should say yes"></textarea>
    <div class="check"><input type="checkbox" id="p-consent"><label for="p-consent" style="margin:0">consent: every chamber must pass it, not only the chairs' count</label></div>
    <div class="note" id="p-bill"></div>
    <div class="row"><button id="p-send">put it to the tree</button></div>`;
  const fields = {
    budget: `<label for="f-address">to</label><input id="f-address" placeholder="a Solana address"><label for="f-amount">SOL</label><input id="f-amount" type="number" min="0" step="0.001" value="0.01">`,
    name: `<label for="f-name">name</label><input id="f-name" maxlength="32"><label for="f-desc">description</label><input id="f-desc" maxlength="96">`,
    plan: `<label for="f-cap">SOL per period</label><input id="f-cap" type="number" min="0" step="0.001" value="1"><label for="f-period">period in slots</label><input id="f-period" type="number" min="1" value="1000000">`,
    door: `<label for="f-price">SOL a seat</label><input id="f-price" type="number" min="0" step="0.001" value="0.05">`,
    admit: `<label for="f-key">the knocker</label>${knockPicker()}`,
    refuse: `<label for="f-key">the knocker</label>${knockPicker()}`,
    sale: `<label for="f-reserve">reserve, lamports</label><input id="f-reserve" type="number" min="0" value="1000000"><label for="f-deposit">deposit, lamports</label><input id="f-deposit" type="number" min="0" value="5000000">`,
  };
  const showFields = () => { $('p-fields').innerHTML = fields[$('p-kind').value]; bill(); };
  let billRevision = 0;
  const bill = async () => {
    const target = $('p-bill'), revision = ++billRevision;
    const n = subtree(g, $('p-origin').value).length;
    try {
      const rent = await conn.getMinimumBalanceForRentExemption(1024) + n * await conn.getMinimumBalanceForRentExemption(P.Session.SIZE);
      if (disposed || $('p-bill') !== target || revision !== billRevision) return;
      target.textContent = `the bill: ${sol(rent)} SOL of rent for the ballot boxes from this key (back when they close); the body pays the fee`;
    } catch {
      if (!disposed && $('p-bill') === target && revision === billRevision) target.textContent = 'Rent estimate unavailable. Try again before submitting.';
    }
  };
  $('p-kind').onchange = showFields; $('p-origin').onchange = bill; showFields();
  $('p-send').onclick = () => act($('p-send'), putDecision, 'the decision is on the chain');
}
async function putDecision() {
  const signer=me.toBase58(),socket=body.ws;
  if(!bodyIn())throw new Error('Connect to the society before proposing.');
  const origin = BigInt($('p-origin').value);
  const kind = $('p-kind').value;
  const lamports = (id) => BigInt(Math.round(Number($(id).value) * 1e9));
  const payload = kind === 'budget' ? P.Payload.budget(origin, new web3.PublicKey($('f-address').value.trim()), lamports('f-amount'))
    : kind === 'name' ? P.Payload.name(origin, $('f-name').value.trim(), $('f-desc').value.trim())
    : kind === 'plan' ? P.Payload.plan(origin, lamports('f-cap'), BigInt($('f-period').value))
    : kind === 'door' ? P.Payload.door(origin, lamports('f-price'))
    : kind === 'admit' ? P.Payload.admit(origin, new web3.PublicKey($('f-key').value.trim()), BigInt(rootId))
    : kind === 'refuse' ? P.Payload.refuse(origin, new web3.PublicKey($('f-key').value.trim()))
    : P.Payload.saleDefaults(origin, BigInt($('f-reserve').value), BigInt($('f-deposit').value));
  const text = $('p-text').value.trim();
  if (!text) throw new Error('say what this is: the text is the manifest');
  const consent = $('p-consent').checked;
  const impacted = subtree(g, uid(origin)).map(BigInt);
  const manifest = await P.sha256(enc.encode(text));
  const nonce = BigInt(Date.now());
  const hash = await P.proposalHash(P.classByte(payload, consent), origin, manifest, await P.payloadHash(payload), nonce);
  // the seat signs the propose, the body pays the fee and lands it, and keeps the text under the hash
  const tx = new web3.Transaction().add(P.propose(me, hash, manifest, payload, impacted, BigInt(rootId), consent));
  tx.feePayer = body.pubkey;
  tx.recentBlockhash = (await conn.getLatestBlockhash('confirmed')).blockhash;
  if(!bodyIn() || body.ws!==socket)throw new Error('The society connection changed before signing.');
  const signed = await signTransaction(tx,signer);
  if(!bodyIn() || body.ws!==socket)throw new Error('The society connection changed while signing.');
  const wire = signed.serialize({ requireAllSignatures: false, verifySignatures: false });
  return (await ask({ t: 'propose', text, tx: b64(new Uint8Array(wire)) })).sig;
}

// ---- The view follows observations, never a visitor's choice of a study. ----
let tree=null;
function applyMotionPolicy() {
  if (!tree) return;
  const reduced = tree.scene.reduced?.matches === true;
  const rest=tree.mode==='idle'&&!replay;if(rest!==(tree.inst.snap?.to===1))window.PoleisEngine.snap(tree.inst,rest,reduced);   // THE SWARM RESTS ON ITS CHAIRS: at rest every body eases onto its chair's normal; anything that moves lets it go
  const homing=rest&&window.PoleisEngine.snapK(tree.inst)<1;if(homing&&!tree.homing)tree.homing=setTimeout(()=>{tree.homing=null;applyMotionPolicy();},window.PoleisEngine.snapDuration+80);
  const on = !disposed && !restoringPage && !document.hidden && !userPaused && (tree.mode==='voting'||tree.mode==='discussion'&&!reduced||homing);
  window.PoleisEngine.setActive(tree.inst, on); if (!on && tree.lit !== false) window.PoleisEngine.drawOnce(tree.inst); tree.lit = on; renderRite();   // NOTHING AT REST COSTS ANYTHING: the quiet orbit drew 600 frames in 10 s; it is now one still
}
// THE SWARM PLAYS ITS VOTE (his Nov 23 2026 12:24 UTC "the voting resolution radial waves... then resets in white bursts cycling"): the record plays from the chain by tree.js playNext, its
// latest RECORD ballots one after another, leaves first, then the page rests; a vote that lands plays as it lands, ending the replay; ▷ plays it again. RITE names the five phases from the engine.
let replay=null; const RECORD=7;
function syncLive(){if(!tree)return;const m=activityOf(g,rootId).mode;if(replay&&m!=='voting'||!replay&&m==='idle'&&tree.mode==='idle'&&(!tree.liveBallot||tree.liveBallot.ended)){applyMotionPolicy();return;}replay=null;syncActivity(tree,'live');applyMotionPolicy();}   // at rest the clock's tick changes nothing: no scene set, no wake of the engine
function playRecord(){const n=history(g,rootId).length;if(!tree||!n||activityOf(g,rootId).mode==='voting')return;replay={left:Math.min(n,RECORD)};tree.at=n-1-replay.left;syncActivity(tree,'voting');applyMotionPolicy();updateActivity();}
function renderRite(){if(!tree||!$('rite'))return;const h=history(g,rootId),p=replay?h[tree.at]:tree.liveBallot?.p,r=riteOf({mode:tree.mode,...(tree.mode==='voting'?tree.rite:{}),executed:p?.executed}),rest=!replay&&tree.mode!=='voting'&&!userPaused;
  $('rite').innerHTML=RITE.map((n,i)=>`<li${i===r.at?` class="on" data-v="${r.name}"`:i>=2&&i<r.at?' class="done"':''}${i===1?' title="the talk between ballots has no store yet"':''}><span>${i===r.at?r.name:n}</span></li>`).join('');
  $('motion-toggle').textContent=rest?'▷':userPaused?'▷':'Ⅱ';$('motion-toggle').setAttribute('aria-label',rest?'Play the record':userPaused?'Resume visualizer':'Pause visualizer');}
function mountOrb() {
  if(!g.registries.has(rootId))return;
  tree=mountTree($('orb'),g,rootId,{size:760,
    onChip:()=>{},onStatus:()=>{},onDecision:()=>{if(replay&&replay.left--<=0){replay=null;syncActivity(tree,'live');applyMotionPolicy();}updateActivity();},onActivity:()=>updateActivity(),onFaces:()=>{renderDoor();faceIt();}});
  tree.inst.veil=false;const ridden=tree.inst.wear;tree.inst.wear=(node,i,vote,type)=>type==='pent'?ridden(node,i,vote,type):hexOf(worn.get(node),i,vote,tree.inst.agentVoting,face)??ridden(node,i,vote);renderDoor();
  const at=e=>{const r=$('orb').getBoundingClientRect(),side=Math.min(r.width,r.height),k=tree.inst.size/side;return window.PoleisEngine.pressAt(tree.inst,(e.clientX-r.left-(r.width-side)/2)*k,(e.clientY-r.top-(r.height-side)/2)*k);};
  $('orb').onclick=e=>{const id=at(e);if(id?.[0]==='/')location.href=id;else if(id)openKnock(id);};$('orb').onpointermove=e=>{$('orb').style.cursor=at(e)?'pointer':'';};
  // tree.js can enter a scene from its own settling timer. Apply this page's
  // motion policy to that path too, without changing the shared renderer.
  const setScene = tree.scene.set.bind(tree.scene);
  tree.scene.set = (...args) => { setScene(...args); applyMotionPolicy(); };
  const told = tree.inst.onAgentProgress; tree.inst.onAgentProgress = (s) => { told?.(s); const of = tree.inst.agentBallot, was = tree.rite?.of === of ? tree.rite : null, shown = was?.shown || s.harmonizing || s.releasing; tree.rite = { ...s, outcome: s.outcome || was?.outcome, releasing: s.releasing || (shown && !s.harmonizing), shown, of }; renderRite(); };   // a verdict once shown holds until the next ballot
  syncLive();if(!tree.scene.reduced?.matches)playRecord();
}
function updateActivity() {
  if(!g.registries.has(rootId))return;
  const summary=proposalSummary(),unknown=clock.slot===null;
  const label=unknown?'Connection uncertain':replay?'Playing its record':summary.voting?'Voting now':tree?.mode==='discussion'?'In conversation':summary.awaitingSeal?'Awaiting a seal':'At rest';
  $('activity-label').textContent=label;
  document.querySelector('.presence').dataset.state=unknown?'unknown':summary.voting?'voting':'idle';
  $('world-caption').textContent=unknown?'Activity will resume when the connection returns.':summary.voting?'The chambers are deciding. Votes arrive as they are confirmed.':summary.awaitingSeal?'The voting window has ended. The society has not sealed its decision.':'No vote is open. The society is at rest.';
  const h=history(g,rootId),p=replay?h[tree?.at]:tree?.liveBallot?.p,k=p&&key(p.hash);if(p)$('world-caption').innerHTML=`<span class="plate-at">${h.indexOf(p)+1} / ${h.length}</span> ${privateOpen()&&body.texts.has(k)?esc(body.texts.get(k).text):glyphs(k,16)}`;   // its plate: the hash in unowns, the words only to a verified holder
  $('status').textContent=unknown?`${NET} · Connection uncertain`:`${NET} · Updated ${new Date(clock.updated).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
}
async function refreshAll() {
  if(disposed)return;
  try{clock.slot=await conn.getSlot('confirmed');clock.updated=Date.now();}catch{clock.slot=null;}
  if(disposed)return;
  prunePrivateRecords();
  if(body.authenticated&&!privateOpen())clearPrivate('Membership verification needs a fresh connection.');
  renderHead();renderCharter();renderChambers();renderLedger();renderOpen();renderFloor();
  syncLive();updateActivity();
}
function wireConnectButtons(){for(const button of document.querySelectorAll('[data-connect]'))button.onclick=()=>{$('body-address').value=bodyUrl;$('connect-dialog').showModal();};}
$('close-connect').onclick=()=>$('connect-dialog').close();
$('connect-dialog').addEventListener('click',e=>{if(e.target===$('connect-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('use-browser').onclick=async()=>{identityRevision++;clearPrivate();wallet=null;me=ownKey();await refreshMembership();if(disposed)return;renderFloor();renderChambers();};
$('wallet-connect').onclick=async()=>{
  const provider=window.phantom?.solana||window.solana;
  if(!provider?.connect||!provider?.signMessage){$('identity-status').textContent='No Solana wallet is available in this browser. Open this page in your wallet browser, or use an existing browser identity below.';return;}
  const request=++identityRevision;
  try{
    const result=await provider.connect();
    if(disposed||document.hidden||request!==identityRevision)return;
    clearPrivate();wallet=provider;me=new web3.PublicKey(result.publicKey);
    if(!watchedWallets.has(provider)){
      const changed=()=>{if(wallet!==provider)return;identityRevision++;clearPrivate('Your wallet identity changed or disconnected. Connect again to enter.');wallet=null;me=ownKey();renderFloor();renderChambers();};
      provider.on?.('accountChanged',changed);provider.on?.('disconnect',changed);watchedWallets.add(provider);
    }
    await refreshMembership();
    if(disposed||document.hidden||request!==identityRevision||wallet!==provider)return;
    renderFloor();renderChambers();
    $('identity-status').textContent=membership().length?`${short(me.toBase58())} · Membership confirmed`:`${short(me.toBase58())} · No seat or chair in this society`;
  }catch(e){if(request===identityRevision&&!disposed)$('identity-status').textContent=e.message||'The wallet connection was cancelled.';}
};
$('body-form').onsubmit=async e=>{e.preventDefault();try{bodyUrl=validBodyURL($('body-address').value.trim());await refreshMembership();bodyConnect();}catch(err){$('body-status').textContent=err.message;}};
for(const b of document.querySelectorAll('[data-close]'))b.onclick=()=>b.closest('dialog').close();
for(const tab of document.querySelectorAll('[data-tab]')){
  const select=()=>{for(const t of document.querySelectorAll('[data-tab]')){const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;$('panel-'+t.dataset.tab).hidden=!selected;}};
  tab.onclick=select;
  tab.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...document.querySelectorAll('[data-tab]')],at=tabs.indexOf(tab),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(at+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;tabs[next].click();tabs[next].focus();};
}
$('motion-toggle').onclick=()=>{if(tree&&!replay&&tree.mode!=='voting'&&!userPaused)return playRecord();userPaused=!userPaused;$('motion-toggle').setAttribute('aria-pressed',String(userPaused));applyMotionPolicy();};
wireConnectButtons();
function startLiveObservers() {
  if(disposed||stopClock||stopSubscription||membershipTimer)return;
  stopClock=watchClock(()=>{if(disposed||restoringPage)return;renderHead();refreshLedgerActivity();renderOpen();renderDoor();if(body.authenticated&&!privateOpen())clearPrivate('The connection needs to verify membership again.');syncLive();updateActivity();});
  stopSubscription=subscribe(g,async kind=>{
    if(disposed||restoringPage)return;
    if(kind==='registry'){
      if(body.authenticated&&!membership().length)clearPrivate('This key no longer holds a seat or chair here.');
      prunePrivateRecords();renderCharter();renderLedger();renderRoom();
      await refreshMembership();if(disposed||restoringPage)return;
      if(tree&&subtree(g,rootId).length!==tree.units){location.reload();return;}
    }
    await refreshAll();
  });
  membershipTimer=setInterval(async()=>{if(disposed||restoringPage||document.hidden||(!wallet&&!body.authenticated))return;await refreshMembership();if(disposed||restoringPage)return;renderFloor();renderCharter();renderLedger();},10000);
}
function stopLiveObservers() {
  stopClock?.();stopClock=null;
  stopSubscription?.();stopSubscription=null;
  clearInterval(membershipTimer);membershipTimer=null;
}
(async()=>{
  if(!rootId||!/^\d+$/.test(rootId)){document.documentElement.dataset.noSociety='';$('name').textContent='Choose a society';$('status').textContent='Open a society from the wall.';return;}
  try{
    rider=await riderOf({idb:indexedDB,subtle:crypto.subtle,PublicKey:web3.PublicKey}).catch(()=>null);me=ownKey();$('browser-key').textContent=me.toBase58();
    if(rider)pictureOf(rider.face).then(c=>{face=c;if(tree)window.PoleisEngine.drawOnce(tree.inst);},()=>{});
    await refreshMembership();if(disposed)return;
    if(!chainVerified)throw new Error('The chain connection is unavailable. Reload to try again.');
    await scanBalances(g,subtree(g,rootId));await refreshAll();mountOrb();
    startLiveObservers();if(bodyUrl)bodyConnect();
  }catch(e){chainVerified=false;$('status').textContent=`Unable to read the society: ${e.message}`;$('activity-label').textContent='Connection unavailable';}
})();
document.addEventListener('visibilitychange',()=>{if(document.hidden){applyMotionPolicy();if(body.ws||body.authenticated)clearPrivate('Reconnect to read the room.');}else if(!disposed&&!restoringPage){syncLive();refreshAll();if(bodyUrl&&!body.ws&&!wallet&&!membership().length)bodyConnect();}});   // a visitor comes back to the room's life; a member reconnects by hand, as before
window.addEventListener('pagehide',()=>{
  disposed=true;identityRevision++;stopLiveObservers();
  if(body.ws||body.authenticated)clearPrivate('Reconnect to read the room.');
  applyMotionPolicy();
});
window.addEventListener('pageshow',async event=>{
  if(!event.persisted)return;
  restoringPage=true;disposed=false;applyMotionPolicy();
  try{
    const observed=await readChain();membershipReadAt=observed.scannedAt;chainVerified=Date.now()-membershipReadAt<20000;
    if(tree&&subtree(g,rootId).length!==tree.units){disposed=true;location.reload();return;}
    await scanBalances(g,subtree(g,rootId));await refreshAll();startLiveObservers();
  }catch{disposed=true;location.reload();}
  finally{restoringPage=false;if(!disposed){syncLive();updateActivity();}}
});
