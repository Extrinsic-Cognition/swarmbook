// Illustrated Polis I journal. Each row appears when its final packet lands.
// Knowledge may precede its journal flight; nothing waits invisibly after landing.
import { wikiMoment, WIKI_DURATION } from './anatomy-wiki.js';
import { loadDelay, flightProgress, LOAD_EPS } from './anatomy-load.js';
const deep=x=>{if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.values(x).forEach(deep);Object.freeze(x);}return x;};
const truth=wikiMoment(WIKI_DURATION),raw=[],flights=new Map();
const session=id=>truth.sessions.find(s=>s.id===id);
const center=node=>({node,port:'center'}),observer=center('p1-root'),intake={node:'journal',port:'intake'};
const verdictColor={1:'pass',2:'reject',3:'split'},verdictName={1:'passed',2:'rejected',3:'split'};
function addFlight(leg,eventId,color){
  if(!flights.has(leg.id)){
    const {id,kind,from,to,start,end}=leg;
    flights.set(id,{id,eventId,kind,color,from,to,start,end});
  }
  return flights.get(leg.id);
}
function fly(id,kind,from,to,start,eventId,color,base=.4,spread=.22){
  return addFlight({id,kind,from,to,start,end:start+loadDelay(id,base,spread)},eventId,color);
}
function emit(event){
  raw.push({sourceIds:[],sourceRefs:[],causes:[],sessionId:null,parent:null,chair:null,
    delivery:'local',observerHops:0,observerPath:['p1-root'],observerEndpoint:observer,
    observedAt:event.occurredAt,flightIds:[],...event});
}
// Shared physical legs are registered once. Remote child mandates do not invent
// extra journal rows for an observer that has not received those local records.
for(const s of truth.sessions)if(s.mandate)
  addFlight(s.mandate,s.polisId==='p1'?'verdict-'+s.id:null,verdictColor[s.verdict]);
for(const p of truth.polises)if(p.adopted)addFlight(p.publication,'adoption-'+p.id,'pass');
for(const r of truth.replicas)addFlight({...r,from:{node:r.from+'-root',port:'publication'},to:{node:r.to+'-root',port:'replica'}},r.id,'evidence');

for(const [index,e] of truth.evidence.entries())emit({id:'evidence-'+e.id,kind:'evidence',polisId:'p1',
  title:e.title,body:'Illustrative measurement record',color:'evidence',occurredAt:e.at,
  observerEndpoint:{node:'p1-root',port:'source',index},sourceIds:[e.id],sourceRefs:e.sourceRefs});
for(const [index,report] of truth.reports.entries())emit({id:'report-'+report.id,kind:'interpretation',polisId:'p1',
  title:report.agent+' · '+report.interpretation.stance,body:report.title,color:report.interpretation.stance,
  occurredAt:report.readyAt,observerEndpoint:{node:'p1-root',port:'agent',index},
  sourceIds:[report.id,report.interpretationId,...report.evidenceIds],sourceRefs:report.sourceRefs,
  causes:report.evidenceIds.map(id=>'evidence-'+id)});
emit({id:'proposal',kind:'interpretation',polisId:'p1',occurredAt:3,color:'amend',
  title:'Qualified revision proposed',body:truth.concept.proposed.claim,
  sourceIds:[truth.revision.id,...truth.revision.reportIds],sourceRefs:truth.revision.sourceRefs,
  causes:truth.reports.map(r=>'report-'+r.id)});
for(const s of truth.sessions.filter(s=>s.polisId==='p1')){
  const id='verdict-'+s.id,name=s.id.endsWith('root')?'I root':s.id.includes('leaf')?'I leaf '+(s.id.endsWith('5')?'5':'9'):'I child '+s.id.at(-1).toUpperCase();
  const observerPath=[s.id];let ancestor=s;
  while(ancestor.parent){observerPath.push(ancestor.parent);ancestor=session(ancestor.parent);}
  let endpoint=observer,observedAt=s.sealAt;
  const flightIds=[];
  if(s.mandate){
    flightIds.push(s.mandate.id);endpoint=s.mandate.to;observedAt=s.mandate.end;
    // The child vote already landed on this chair. The onward message reports
    // that result; it is not another parent-chair vote or the parent's own seal.
    if(endpoint.node!=='p1-root'){
      const relay=fly('relay-'+s.id,'relay',endpoint,observer,observedAt,id,verdictColor[s.verdict]);
      flightIds.push(relay.id);endpoint=relay.to;observedAt=relay.end;
    }
  }
  emit({id,kind:'verdict',polisId:s.polisId,sessionId:s.id,parent:s.parent,chair:s.chair,
    childId:s.parent?s.id:null,mandateAt:s.mandate?.end??null,
    observerPath,observerHops:observerPath.length-1,delivery:s.parent?'received':'local',
    observedAt,observerEndpoint:endpoint,flightIds,occurredAt:s.sealAt,title:name+' · '+verdictName[s.verdict],
    body:s.parent?`Parent chair ${s.chair} received ${ {1:'yes',2:'no',3:'abstain'}[s.verdict]}`:'Local seal · chairs and floor',
    color:verdictColor[s.verdict],verdict:s.verdict,
    sourceIds:[s.sessionId,s.revisionId,...(s.parent?[session(s.parent).sessionId]:[])],sourceRefs:truth.revision.sourceRefs,
    causes:['proposal',...s.bound.map(b=>'verdict-'+b.child)]});
}
for(const p of truth.polises){
  const root=session(p.rootId);
  if(p.id!=='p1'){
    const id='verdict-'+root.id,notification=fly('notify-'+id,'notice',center(root.id),observer,root.sealAt,id,verdictColor[root.verdict]);
    emit({id,kind:'verdict',polisId:p.id,sessionId:root.id,
      occurredAt:root.sealAt,observedAt:notification.end,observerHops:1,observerPath:[root.id,'p1-root'],delivery:'received',flightIds:[notification.id],
      title:p.name+' reports '+verdictName[root.verdict],body:root.verdict===3?'Split · prior version held':'Remote root verdict received',color:verdictColor[root.verdict],
      verdict:root.verdict,sourceIds:[root.sessionId,truth.revision.id],causes:['proposal']});
  }
  if(p.adopted){
    const id='adoption-'+p.id,flightIds=[p.publication.id];
    let endpoint=p.publication.to,observedAt=p.publishAt;
    if(p.id!=='p1'){
      const notification=fly('notify-'+id,'notice',endpoint,observer,observedAt,id,'pass');
      flightIds.push(notification.id);endpoint=notification.to;observedAt=notification.end;
    }
    emit({id,kind:'adoption',polisId:p.id,sessionId:root.id,occurredAt:p.publishAt,
      observedAt,observerEndpoint:endpoint,flightIds,observerHops:p.id==='p1'?0:1,
      observerPath:p.id==='p1'?['p1-root']:[root.id,'p1-root'],delivery:p.id==='p1'?'local':'received',
      title:p.name+' adopted qualified v2',body:'Adoption does not prove the data',color:'pass',snapshotId:p.snapshotId,
      sourceIds:[truth.revision.id,p.snapshotId],sourceRefs:truth.revision.sourceRefs,causes:['verdict-'+root.id]});
  }
}
for(const r of truth.replicas){
  const id=r.id,receiver={node:r.to+'-root',port:'replica'},ack=fly('ack-'+id,'ack',receiver,observer,r.end,id,'evidence');
  emit({id,kind:'receipt',polisId:r.to,sessionId:receiver.node,fromPolisId:r.from,occurredAt:r.end,
    observedAt:ack.end,observerHops:1,observerPath:[receiver.node,'p1-root'],delivery:'received',flightIds:[r.id,ack.id],
    title:(r.to==='p2'?'II':'III')+' received '+(r.from==='p1'?'I':'III')+'’s revision',
    body:r.to==='p2'?'Still v1 · receipt is not adoption':'Receipt adds no new adoption',color:'receipt',
    snapshotId:r.snapshotId,adoption:false,sourceIds:[r.manifestId,r.snapshotId],
    causes:['adoption-'+r.from]});
}
emit({id:'challenge',kind:'challenge',polisId:'p1',occurredAt:truth.challenge.at,
  title:truth.challenge.title,body:'Same evidence · dissent retained',color:'challenge',
  sourceIds:[truth.challenge.id,truth.challenge.reportId,truth.challenge.perspectiveId,...truth.challenge.evidenceIds],
  sourceRefs:truth.challenge.sourceRefs,causes:['report-'+truth.challenge.reportId,'adoption-p1','verdict-p1-b']});

// Resolve causality before launching a journal packet. Arrival itself reveals
// the row; there is no reading-slot timer or pending row after the packet lands.
const rawById=new Map(raw.map(e=>[e.id,e])),complete=new Map(),visiting=new Set();
function finish(id){
  if(complete.has(id))return complete.get(id);
  const event=rawById.get(id);
  if(!event||visiting.has(id))throw new Error('Invalid lightcone cause: '+id);
  visiting.add(id);
  const causes=event.causes.map(finish),start=Math.max(event.observedAt,...causes.map(e=>e.arrivedAt));
  const journal=fly('journal-'+id,'journal',event.observerEndpoint,intake,start,id,event.color,.42,.22);
  const result={...event,flightIds:[...event.flightIds,journal.id],journalFlightId:journal.id,
    arrivedAt:journal.end,presentAt:journal.end,observerPolisId:'p1',observerSessionId:'p1-root',illustrative:true};
  visiting.delete(id);complete.set(id,result);return result;
}
export const lightconeEvents=deep(raw.map(e=>finish(e.id)).sort((a,b)=>a.arrivedAt-b.arrivedAt||a.id.localeCompare(b.id)));
const proposal=complete.get('proposal');
truth.polises.forEach((p,index)=>fly('proposal-'+p.id,'proposal',{node:'artifact',port:'revision'},center(p.rootId),
  proposal.arrivedAt+.10+index*.10,proposal.id,'amend',.55,.18));
export const lightconeFlights=deep([...flights.values()].sort((a,b)=>a.start-b.start||a.id.localeCompare(b.id)));
export function lightconeMoment(local){
  const at=Math.min(WIKI_DURATION,Math.max(0,Number.isFinite(local)?local:0));
  const events=lightconeEvents.filter(e=>e.arrivedAt<=at+LOAD_EPS);
  const inFlight=lightconeFlights.filter(f=>f.start<=at+LOAD_EPS&&at+LOAD_EPS<f.end).map(f=>({...f,progress:flightProgress(at,f)}));
  return deep({local:at,observerPolisId:'p1',observerSessionId:'p1-root',illustrative:true,events,timeline:events,visible:events.slice(-5),
    pendingCount:0,inFlight,inFlightCount:inFlight.length,latest:events.at(-1)||null});
}
