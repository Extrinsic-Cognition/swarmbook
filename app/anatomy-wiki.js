// Local illustration only: no live measurements, network writes, or cryptography.
// Observations remain unchanged; ordinary GVS governs adoption of interpretations.
import { ANATOMY_CHAMBERS } from './anatomy-chambers.js';
import { LADDER, hexagonsOf } from './orb.js';
import { loadDelay, flightProgress } from './anatomy-load.js';
const freeze=Object.freeze,clamp=x=>Math.max(0,Math.min(1,x));
const deep=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(deep);freeze(value);}return value;};
export const WIKI_DURATION=22,WIKI_PACKET_SECONDS=.4;
export const WIKI_EVIDENCE=deep([
  {id:'E1',title:'100 jobs · 124 → 91 Wh',illustrative:true,sourceRefs:['illustration:run/baseline','illustration:run/optimized'],
    measurements:[{condition:'baseline',jobs:100,energyWh:124},{condition:'optimized',jobs:100,energyWh:91}],at:.2},
  {id:'E2',title:'Hot run · 100 jobs · 139 Wh',illustrative:true,sourceRefs:['illustration:run/hot'],
    measurements:[{condition:'hot',jobs:100,energyWh:139}],at:.5},
]);
export const WIKI_PERSPECTIVES=deep([
  {id:'I1',stance:'support',title:'Lower energy in this run',evidenceIds:['E1'],claim:'124 → 91 Wh in matched runs'},
  {id:'I2',stance:'amend',title:'Narrow the claim',evidenceIds:['E1','E2'],claim:'Qualify by operating conditions'},
  {id:'I3',stance:'amend',title:'Check the sample',evidenceIds:['E1','E2'],claim:'Replication still needed',uncertainty:'Single runs; no error bounds'},
  {id:'I4',stance:'challenge',title:'Heat reverses the result',evidenceIds:['E2'],claim:'139 Wh contradicts universality'},
]);
export const WIKI_REPORTS=deep(WIKI_PERSPECTIVES.map((interpretation,i)=>({
  id:'R'+(i+1),agentId:'agent-'+(i+1),agent:'Agent '+(i+1),batchId:'batch-cooling-01',title:interpretation.title,
  interpretationId:interpretation.id,interpretation,evidenceIds:interpretation.evidenceIds,
  sourceRefs:[...new Set(interpretation.evidenceIds.flatMap(id=>WIKI_EVIDENCE.find(e=>e.id===id).sourceRefs))],readyAt:1.1+i*.27,
})));
const CONCEPT=deep({id:'cooling-efficiency',title:'Cooling efficiency',name:'Cooling efficiency',priorVersion:1,
  proposedVersion:2,evidenceIds:['E1','E2']});
export const WIKI_VERSIONS=deep([
  {id:'cooling-efficiency-v1',conceptId:CONCEPT.id,version:1,claim:'Energy effect unresolved',
    qualification:'Measurements awaiting interpretation',evidenceIds:['E1','E2']},
  {id:'cooling-efficiency-v2',conceptId:CONCEPT.id,version:2,claim:'Lower energy under normal load',
    qualification:'Hot-run exception retained',evidenceIds:['E1','E2'],revisionId:'cooling-v2-manifest'},
]);
const VERDICT_CHOICE={1:'yes',2:'no',3:'abstain'};
const DEFINITIONS=[
  {id:'p1',name:'Polis I'}, {id:'p2',name:'Polis II'}, {id:'p3',name:'Polis III'},
];
const DECISIONS={'p1-root':[1,12.2],'p1-a':[1,10.15],'p1-b':[2,8.7],'p1-c':[1,9.4],
  'p1-leaf':[1,7.8],'p1-leaf5':[1,8.15],'p2-root':[3,12.6],'p2-a':[1,10.45],
  'p2-b':[3,9.2],'p3-root':[1,13],'p3-a':[1,10.75],'p3-b':[1,9.6]};
const MANDATES=deep(Object.fromEntries(ANATOMY_CHAMBERS.filter(body=>body.parent).map(body=>{
  const id='mandate-'+body.id,start=DECISIONS[body.id][1];
  return [body.id,{id,kind:'mandate',from:{node:body.id,port:'center'},
    to:{node:body.parent,port:'chair',index:body.chair},start,end:start+loadDelay(id)}];
})));
/** Ordinary equal-weight GVS: seven chairs AND a strict active-floor majority. */
export function wikiVerdict(choices,floorChoices){
  const chairs=choices.filter(v=>v.value==='yes').length;
  const floor=floorChoices.filter(v=>v.value==='yes').length;
  const council=chairs>=7,owners=floor*2>floorChoices.length;
  return council&&owners?1:council||owners?3:2;
}
const plans=ANATOMY_CHAMBERS.map(body=>{
  const {id}=body,[result,sealAt]=DECISIONS[id],pi=DEFINITIONS.findIndex(p=>p.id===body.polisId);
  const start=5+pi*.15+(body.parent?(body.id.includes('leaf')?.1:.3):0);
  const children=ANATOMY_CHAMBERS.filter(child=>child.parent===id);
  const bound=children.map(child=>({child:child.id,chair:child.chair,
    value:VERDICT_CHOICE[DECISIONS[child.id][0]],at:MANDATES[child.id].end}));
  const yesTarget=result===1?7:result===3?6:4;
  let needed=yesTarget-bound.filter(v=>v.value==='yes').length;
  const choices=Array.from({length:12},(_,chair)=>{
    const mandate=bound.find(v=>v.chair===chair);
    if(mandate)return {value:mandate.value,at:mandate.at,child:mandate.child};
    return {value:needed-->0?'yes':chair%2?'no':'abstain',at:start+.2+(sealAt-start-.32)*chair/11};
  });
  const capacity=hexagonsOf(...LADDER[body.rung]),occupied=id==='p1-root'?99:capacity;
  const floorCount=occupied,floorStart=start+.15,floorEnd=sealAt-.08;
  const floorYes=result===2?Math.floor(floorCount*.4):floorCount===20?12:Math.floor(floorCount/2)+1;
  const floorChoices=Array.from({length:floorCount},(_,seat)=>({seat,weight:1,value:seat<floorYes?'yes':'no',at:floorStart+(floorEnd-floorStart)*seat/(floorCount-1)}));
  return {...body,
    ...(body.parent?{mandate:MANDATES[id]}:{}),
    sessionId:'vote-'+id,revisionId:'cooling-v2-manifest',start,sealAt,releaseAt:21,
    choices,floorChoices,floorCount,activeFloorWeight:floorCount,floorStart,floorEnd,
    capacity,occupied,
    result:wikiVerdict(choices,floorChoices),bound};
});
deep(plans);
export const WIKI_REVISION=deep({id:'cooling-v2-manifest',conceptId:CONCEPT.id,version:2,snapshotId:WIKI_VERSIONS[1].id,batchId:'batch-cooling-01',
  evidenceIds:WIKI_EVIDENCE.map(e=>e.id),reportIds:WIKI_REPORTS.map(r=>r.id),perspectiveIds:WIKI_PERSPECTIVES.map(i=>i.id),
  sessionIds:plans.map(s=>s.sessionId),sourceRefs:WIKI_EVIDENCE.flatMap(e=>e.sourceRefs),
  governance:'ordinary GVS',requiresUniversalConsent:false,illustrative:true});
const REPLICAS=deep([{from:'p1',to:'p2',version:2,start:14.2,manifestId:WIKI_REVISION.id},
  {from:'p1',to:'p3',version:2,start:15,manifestId:WIKI_REVISION.id},
  {from:'p3',to:'p2',version:2,start:16.2,manifestId:WIKI_REVISION.id}].map((r,i)=>{
    const id='replica-'+i;
    return {...r,id,kind:'replica',end:r.start+loadDelay(id,.8,.3),snapshotId:WIKI_VERSIONS[1].id};
  }));
const CHALLENGE=deep({id:'challenge-heat-02',reportId:'R4',perspectiveId:'I4',evidenceIds:['E1','E2'],
  sourceRefs:WIKI_EVIDENCE.flatMap(e=>e.sourceRefs),title:'Retest the heat exception',at:18.2,changesEvidence:false});
export function wikiMoment(local){
  const at=Math.max(0,Number.isFinite(local)?local:0);
  const sessions=plans.map(plan=>{
    const choices=plan.choices.map(v=>({...v,landed:at+1e-9>=v.at}));
    const floorChoices=plan.floorChoices.map(v=>({...v,landed:at+1e-9>=v.at}));
    const sealed=at+1e-9>=plan.sealAt,released=at>=plan.releaseAt;
    return {...plan,choices,floorChoices,sealed,released,active:at>=plan.start&&!released,
      verdict:sealed?plan.result:0,floorProgress:clamp((at-plan.floorStart)/(plan.floorEnd-plan.floorStart)),
      packetProgress:sealed&&plan.mandate?flightProgress(at,plan.mandate):null};
  });
  const polises=DEFINITIONS.map(p=>{
    const root=sessions.find(s=>s.id===p.id+'-root'),id='publication-'+p.id;
    const publication={id,kind:'publication',from:{node:root.id,port:'center'},to:{node:root.id,port:'publication'},
      start:root.sealAt,end:root.sealAt+loadDelay(id)};
    const publishAt=root.result===1?publication.end:null;
    const adopted=publishAt!==null&&at+1e-9>=publishAt,adoptedVersion=adopted?2:1;
    const adoptedSnapshot=WIKI_VERSIONS[adoptedVersion-1];
    return {id:p.id,name:p.name,rootId:root.id,version:adoptedVersion,adoptedVersion,adopted,publishAt,
      snapshotId:adoptedSnapshot.id,adoptedSnapshot,
      result:root.sealed?(root.result===1?'accepted':root.result===3?'split':'rejected'):'pending',verdict:root.verdict,
      publication:{...publication,published:adopted},
      receivedVersions:REPLICAS.filter(r=>r.to===p.id&&r.end<=at).map(r=>({...r,adoption:false})),
      dissent:sessions.filter(s=>s.polisId===p.id&&s.sealed&&s.result!==1).map(s=>({sessionId:s.sessionId,verdict:s.result})),
    };
  });
  const acceptedBy=polises.filter(p=>p.adopted).map(p=>p.id);
  const stage=at<3?'evidence':at<5?'proposal':at<12?'voting':at<14?'sealing':at<18?'replication':at<20.8?'challenge':'closing';
  const caption=stage==='evidence'?'Measured evidence, distinct interpretations':
    stage==='proposal'?'Four reports propose a qualified revision.':
    stage==='voting'?'Chambers vote; child verdicts reach their parent seats.':
    stage==='sealing'?'Polises decide adoption; a vote does not prove a measurement.':
    stage==='replication'?'Revision accepted by I and III; II receives it but keeps v1.':
    stage==='challenge'?'Accepted versions retain the heat exception and dissent.':
    'Evidence and dissent remain available for the next review.';
  return deep({illustrative:true,stage,caption,status:caption,batch:{id:'batch-cooling-01',agents:4,reports:4},
    evidence:WIKI_EVIDENCE,reports:WIKI_REPORTS.map(r=>({...r,ready:at>=r.readyAt})),perspectives:WIKI_PERSPECTIVES,
    concept:{...CONCEPT,version:polises[0].adoptedVersion,adoptedSnapshot:polises[0].adoptedSnapshot,
      snapshotId:polises[0].snapshotId,proposed:WIKI_VERSIONS[1],acceptedBy,revisionId:WIKI_REVISION.id},
    revision:WIKI_REVISION,polises,sessions,replicas:REPLICAS,challenge:{...CHALLENGE,active:at>=CHALLENGE.at},
    readout:at<3?'4 agents · 1 batch':acceptedBy.length?`${acceptedBy.length} polises accepted · dissent retained`:
      at<5?'4 reports · 1 proposed revision':at<12?'12 chambers · concurrent votes':'Root verdicts arriving',
  });
}
