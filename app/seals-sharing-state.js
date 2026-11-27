// Illustrative TraceNet sequence: preserve privately, consent to export a crystal,
// then retrieve before doing additional work. This model sends no network traffic.
import {EPOCH as SPENDING_EPOCH, PRODUCT_BRANCHES, productState} from './seals-tank.js?v=cognitio-salvata-3';

// Products are already anchored: start promptly, overlap the rows, then hold the result.
export const EPOCH=12, SHARING_INTRO=.15;
export const SHARING_STORIES=Object.freeze([
  {id:'sources',unit:0,offset:0,policy:'share-private',recipientAuthorized:true,humanConsent:true,
    consentSignatureValid:true,artifactSignatureValid:true,integrityValid:true,additionalLayers:3},
  {id:'options',unit:1,offset:.4,policy:'local',recipientAuthorized:false,humanConsent:false,
    consentSignatureValid:false,artifactSignatureValid:true,integrityValid:true,additionalLayers:2},
  {id:'speed',unit:2,offset:.8,policy:'share-public',recipientAuthorized:true,humanConsent:true,
    consentSignatureValid:true,artifactSignatureValid:true,integrityValid:true,additionalLayers:2},
].map(story=>Object.freeze(story)));

// Sharing inherits the completed Spending products, including their worker-output
// identities; a replay never invents a different set of previously purchased work.
const sources=PRODUCT_BRANCHES.map((branch,unit)=>{
  const product=productState(unit,SPENDING_EPOCH-.001);
  return Object.freeze({key:product.key,label:branch.label,complete:product.complete,
    layers:product.count,fragmentIds:Object.freeze(product.arrived.map(fragment=>fragment.id))});
});

function exportBlock(story,source) {
  if(!source.complete)return 'source-incomplete';
  if(!['share-private','share-public'].includes(story.policy))return 'local-policy';
  if(story.policy==='share-private'&&!story.recipientAuthorized)return 'recipient-not-authorized';
  if(!story.humanConsent)return 'consent-withheld';
  if(!story.consentSignatureValid)return 'invalid-human-consent';
  return null;
}

function rowState(story,t) {
  const source=sources[story.unit];
  if(!source)throw new RangeError('Sharing story must reference an existing Spending product');
  const base=SHARING_INTRO+Math.max(0,story.offset??0);
  const sourceId=`product:${source.key}:v1`,traceId=`${story.id}:local-trace`,
    crystalId=`${story.id}:crystal:v1`,derivedId=`${story.id}:derived:v1`;
  const exportReason=exportBlock(story,source),canExport=exportReason===null;
  const verificationReason=!story.artifactSignatureValid?'invalid-artifact-signature':
    !story.integrityValid?'content-hash-mismatch':null;
  const canReuse=canExport&&verificationReason===null;
  const events={sourceReady:0,traceStarted:base,traceSaved:base+.42,
    crystalReady:base+1.05,consentDecision:base+1.6,
    offered:canExport?base+1.82:Infinity,transferStarted:canExport?base+2.05:Infinity,
    received:canExport?base+2.9:Infinity,verificationDecision:canExport?base+3.25:Infinity,
    verified:canReuse?base+3.25:Infinity,reused:canReuse?base+3.85:Infinity,
    workStarted:canReuse?base+4.05:Infinity,workDone:canReuse?base+5.85:Infinity,
    derivedCommitted:canReuse?base+6.3:Infinity,
    receiptSent:canReuse?base+6.6:Infinity,receiptReceived:canReuse?base+8:Infinity};
  const arrived=event=>Number.isFinite(event)&&t>=event;
  const sourceComplete=source.complete&&arrived(events.sourceReady),
    traceSaved=sourceComplete&&arrived(events.traceSaved),crystalReady=traceSaved&&arrived(events.crystalReady),
    consented=canExport&&crystalReady&&arrived(events.consentDecision),
    offered=consented&&arrived(events.offered),received=offered&&arrived(events.received),
    verified=received&&arrived(events.verified),reused=verified&&arrived(events.reused),
    derivedCommitted=reused&&arrived(events.derivedCommitted),
    receivedReceipt=derivedCommitted&&arrived(events.receiptReceived);
  let phase='source';
  if(arrived(events.traceStarted))phase='preserving';
  if(traceSaved)phase='distilling';
  if(crystalReady)phase='consent';
  if(arrived(events.consentDecision)&&!canExport)phase='private';
  if(offered)phase='offering';
  if(offered&&arrived(events.transferStarted))phase='transferring';
  if(received)phase='verifying';
  if(received&&arrived(events.verificationDecision)&&!canReuse)phase='rejected';
  if(verified)phase='retrieving';
  if(reused)phase='inherited';
  if(reused&&arrived(events.workStarted))phase='working';
  if(reused&&arrived(events.workDone))phase='assembling';
  if(derivedCommitted)phase='derived';
  if(derivedCommitted&&arrived(events.receiptSent))phase='receipting';
  if(receivedReceipt)phase='complete';
  const plannedNewLayers=Math.max(0,Math.floor(story.additionalLayers??0)),
    inheritedLayers=reused?source.layers:0,newLayers=derivedCommitted?plannedNewLayers:0;
  return {id:story.id,unit:story.unit,sourceKey:source.key,sourceLabel:source.label,
    sourceId,traceId,crystalId,derivedId,sourceLayers:source.layers,
    sourceFragmentIds:[...source.fragmentIds],policy:story.policy,phase,events,
    sourceComplete,traceSaved,crystalReady,consented,offered,received,verified,reused,
    working:reused&&arrived(events.workStarted)&&!arrived(events.workDone),
    newContributionReady:reused&&arrived(events.workDone),derivedCommitted,receivedReceipt,
    plannedNewLayers,inheritedLayers,newLayers,derivedLayers:inheritedLayers+newLayers,
    inheritedFrom:reused?[crystalId]:[],retainedLocally:traceSaved,rawExported:false,
    exportedArtifact:offered?crystalId:null,
    blockReason:arrived(events.consentDecision)&&exportReason?exportReason:
      received&&arrived(events.verificationDecision)?verificationReason:null,
    receiptScope:'transfer-and-reuse-acknowledgment',correctnessProven:false};
}

export function sharingState(seconds,stories=SHARING_STORIES) {
  const t=Math.max(0,seconds)%EPOCH;
  return {t,rows:stories.map(story=>rowState(story,t))};
}
