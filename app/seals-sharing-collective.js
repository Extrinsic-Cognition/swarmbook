// Illustrative collective reuse. The workshop's audience is explicitly consented;
// combining contributions does not publish the result or export a raw trace.
import {EPOCH, SHARING_STORIES as SOURCE_STORIES, sharingState} from './seals-sharing-state.js?v=cognitio-salvata-3';

export {EPOCH};
export const WORKSHOP = Object.freeze({
  id:'atlas-loom-workshop', name:'Atlas + Loom workshop', scope:'workshop',
  collaborators:Object.freeze([
    Object.freeze({id:'atlas',name:'Atlas',rowId:'sources'}),
    Object.freeze({id:'loom',name:'Loom',rowId:'speed'}),
  ]),
});
export const COLLECTIVE_TIME = Object.freeze({travel:.4,receiptDelay:.25,receiptTravel:1.1});
const requiredIds=WORKSHOP.collaborators.map(contributor=>contributor.rowId);
const memberIds=WORKSHOP.collaborators.map(contributor=>contributor.id);
const sourceRows=sharingState(0,SOURCE_STORIES).rows;

// These are scenario consent records, not live signatures. The records travel
// with their stories; passing a different story never looks up authority by ID.
export const SHARING_STORIES=Object.freeze(SOURCE_STORIES.map(story=>{
  if(!requiredIds.includes(story.id))return story;
  const row=sourceRows.find(row=>row.id===story.id);
  return Object.freeze({...story,workshopConsent:Object.freeze({
    audienceId:WORKSHOP.id,collaboratorIds:Object.freeze([...memberIds]),
    sourceId:row.sourceId,crystalId:row.crystalId,
    allowContribution:true,derivedScope:'workshop',signatureValid:true,
  })});
}));

const unique=values=>[...new Set(values)];
const reached=(t,at)=>Number.isFinite(at)&&t>=at;
function audienceBlock(story,row) {
  const consent=story.workshopConsent;
  if(!consent)return 'workshop-consent-missing';
  if(consent.audienceId!==WORKSHOP.id)return 'workshop-audience-mismatch';
  const members=consent.collaboratorIds;
  if(!Array.isArray(members)||members.length!==memberIds.length||
    unique(members).length!==memberIds.length||!memberIds.every(id=>members.includes(id)))return 'workshop-members-mismatch';
  if(consent.sourceId!==row.sourceId||consent.crystalId!==row.crystalId)return 'workshop-source-mismatch';
  if(consent.derivedScope!=='workshop')return 'workshop-scope-mismatch';
  if(consent.allowContribution!==true||consent.signatureValid!==true)return 'workshop-consent-invalid';
  return null;
}

export function collectiveSharingState(seconds,stories=SHARING_STORIES) {
  const base=sharingState(seconds,stories),{t,rows}=base;
  const segments=[];
  for(const contributor of WORKSHOP.collaborators) {
    const indexes=stories.flatMap((story,i)=>story.id===contributor.rowId?[i]:[]);
    if(!indexes.length)continue;
    const i=indexes[0],story=stories[i],row=rows[i];
    // Repeated copies of one record are one contribution. Conflicting records
    // with one ID cannot let an admitted copy conceal a denial.
    const ambiguous=indexes.some(j=>JSON.stringify(stories[j])!==JSON.stringify(story));
    const authorizationBlock=ambiguous?'ambiguous-contribution':audienceBlock(story,row);
    const audienceAuthorized=authorizationBlock===null;
    const authorized=audienceAuthorized&&Number.isFinite(row.events.offered);
    const inheritedArrival=authorized?row.events.reused+COLLECTIVE_TIME.travel:Infinity;
    const newArrival=authorized?row.events.derivedCommitted+COLLECTIVE_TIME.travel:Infinity;
    const inheritedArrived=authorized&&row.reused&&reached(t,inheritedArrival);
    const newArrived=inheritedArrived&&row.derivedCommitted&&reached(t,newArrival);
    const newIds=Array.from({length:row.plannedNewLayers},(_,k)=>`${row.derivedId}:${contributor.id}:work-${k}`);
    const sourceFragmentIds=unique(row.sourceFragmentIds);
    const workshopArtifactId=`${WORKSHOP.id}:collective:v1`;
    segments.push({
      rowId:row.id,contributorId:contributor.id,contributorName:contributor.name,
      contributor:{...contributor},audienceId:WORKSHOP.id,scope:'workshop',
      sourceId:row.sourceId,sourceKey:row.sourceKey,sourceLabel:row.sourceLabel,
      traceId:row.traceId,crystalId:row.crystalId,derivedId:row.derivedId,
      sourceFragmentIds,newContributionIds:newIds,
      inheritedArrival,newArrival,inheritedArrived,newArrived,
      inheritedCount:inheritedArrived?sourceFragmentIds.length:0,
      newCount:newArrived?newIds.length:0,
      inheritedLayers:inheritedArrived?sourceFragmentIds.length:0,
      newLayers:newArrived?newIds.length:0,
      plannedInheritedLayers:sourceFragmentIds.length,plannedNewLayers:newIds.length,
      authorized,audienceAuthorized,authorizationBlock,blockReason:authorizationBlock??row.blockReason,
      paths:{
        inherited:[row.crystalId,`${WORKSHOP.id}:gate:${contributor.id}`,`${contributor.id}:verified-cache`,workshopArtifactId],
        new:[`${contributor.id}:workers`,row.derivedId,workshopArtifactId],
        receipt:[workshopArtifactId,`${WORKSHOP.id}:gate:${contributor.id}`,row.crystalId],
      },
    });
  }
  const allPresent=requiredIds.every(id=>segments.some(segment=>segment.rowId===id));
  const authorized=allPresent&&segments.every(segment=>segment.authorized);
  const plannedReady=authorized&&segments.every(segment=>Number.isFinite(segment.inheritedArrival)&&Number.isFinite(segment.newArrival));
  const completeAt=plannedReady?Math.max(...segments.flatMap(segment=>[segment.inheritedArrival,segment.newArrival])):Infinity;
  const complete=plannedReady&&segments.every(segment=>segment.inheritedArrived&&segment.newArrived)&&reached(t,completeAt);
  const receiptSentAt=completeAt+COLLECTIVE_TIME.receiptDelay;
  const receiptReceivedAt=receiptSentAt+COLLECTIVE_TIME.receiptTravel;
  const receiptSent=complete&&reached(t,receiptSentAt),receivedReceipt=receiptSent&&reached(t,receiptReceivedAt);
  const inheritedSegments=segments.filter(segment=>segment.inheritedArrived);
  const newSegments=segments.filter(segment=>segment.newArrived);
  const sourceFragmentIds=unique(inheritedSegments.flatMap(segment=>segment.sourceFragmentIds));
  const newContributionIds=unique(newSegments.flatMap(segment=>segment.newContributionIds));
  const missingContributors=requiredIds.filter(id=>!segments.some(segment=>segment.rowId===id));
  return {...base,collective:{
    id:`${WORKSHOP.id}:collective:v1`,name:'Built together',audienceId:WORKSHOP.id,
    audience:{id:WORKSHOP.id,name:WORKSHOP.name,collaboratorIds:[...memberIds]},
    scope:'workshop',derivedScope:'workshop',publiclyShared:false,rawExported:false,
    collaborators:WORKSHOP.collaborators.map(contributor=>({...contributor})),
    segments,authorized,allPresent,missingContributors,
    excludedRowIds:unique(rows.filter(row=>!requiredIds.includes(row.id)).map(row=>row.id)),
    sourceIds:unique(inheritedSegments.map(segment=>segment.sourceId)),
    inheritedFrom:unique(inheritedSegments.map(segment=>segment.crystalId)),
    sourceFragmentIds,newContributionIds,
    inheritedLayers:sourceFragmentIds.length,newLayers:newContributionIds.length,
    totalLayers:sourceFragmentIds.length+newContributionIds.length,
    complete,completeAt,committedAt:completeAt,receiptSentAt,receiptReceivedAt,
    receiptSent,receiptReceived:receivedReceipt,receivedReceipt,
    receiptScope:'collective-contribution-and-reuse-acknowledgment',correctnessProven:false,
    phase:receivedReceipt?'complete':receiptSent?'receipting':complete?'assembled':
      sourceFragmentIds.length||newContributionIds.length?'assembling':'awaiting-contributions',
  }};
}
