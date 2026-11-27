// Public observations only: absence and a failed read are never zero balances.
export const READ_FRESH_MS = 45000;
export function connectionHealth({now=Date.now(), observedAt=0, socketAt=0, error=false}={}) {
  if(!observedAt)return {status:error?'error':'connecting',label:error?'Connection unavailable':'Connecting'};
  if(error||now-observedAt>READ_FRESH_MS)return {status:'stale',label:'Last known state'};
  return now-socketAt<15000?{status:'live',label:'Solana connected'}:{status:'polling',label:'Polling Solana'};
}
export function formatSol(value) {
  if(value===null||value===undefined)return '—';
  const n=BigInt(value), whole=n/1000000000n, fraction=(n%1000000000n).toString().padStart(9,'0');
  return `${whole.toLocaleString('en-US')}.${fraction.slice(0,4)}`;
}
export function collectUnits(g, root='0') {
  if(!g.registries.has(root))return [];
  const seen=new Set(), pending=[root];
  while(pending.length){
    const id=pending.pop(); if(seen.has(id))throw new Error('The registry graph contains a cycle.');
    const r=g.registries.get(id);if(!r)throw new Error('The registry graph is incomplete.');
    seen.add(id);
    for(const p of r.pentagons)if(p.kind===g.P.HOLDER.UNIT)pending.push(String(g.P.holderUnit(p.holder)));
  }
  return [...seen];
}
export function summarizeSociety(g, root='0') {
  const units=collectUnits(g,root);
  const balancesKnown=units.length>0&&units.every(id=>g.balances.has(id));
  return {units,exists:units.length>0,seats:units.length?units.reduce((n,id)=>n+BigInt(g.registries.get(id).totalSeats),0n):null,
    treasury:balancesKnown?units.reduce((n,id)=>n+BigInt(g.balances.get(id)),0n):null,
    fund:g.fund?.lamports??null};
}
export function mergeReceipts(previous, incoming, limit=6) {
  const bySignature=new Map(previous.map(row=>[row.signature,row]));
  for(const row of incoming)if(typeof row.signature==='string'&&/^[1-9A-HJ-NP-Za-km-z]{64,100}$/.test(row.signature)&&Number.isSafeInteger(row.slot)){
    bySignature.set(row.signature,{...bySignature.get(row.signature),...row});
  }
  return [...bySignature.values()].sort((a,b)=>b.slot-a.slot||a.signature.localeCompare(b.signature)).slice(0,limit);
}
