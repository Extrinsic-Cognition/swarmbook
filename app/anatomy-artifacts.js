// Persistent records beside the local journal. Arrival reveals a record;
// publication changes an adopted copy, while replication only adds a copy.
import {wikiMoment} from './anatomy-wiki.js';
import {lightconeMoment} from './anatomy-lightcone.js?v=artifacts-1';

export function artifactMoment(local,wiki=wikiMoment(local),feed=lightconeMoment(local)) {
  const received=new Map(feed.events.map(event=>[event.id,event]));
  const record=(item,prefix)=>({...item,arrivedAt:received.get(prefix+item.id).arrivedAt});
  return {
    evidence:wiki.evidence.filter(e=>received.has('evidence-'+e.id)).map(e=>record(e,'evidence-')),
    reports:wiki.reports.filter(r=>received.has('report-'+r.id)).map(r=>record(r,'report-')),
    concept:received.has('proposal')?{
      ...wiki.concept,arrivedAt:received.get('proposal').arrivedAt,
      version:received.has('adoption-p1')?2:1,
      seals:wiki.polises.filter(p=>received.has('adoption-'+p.id)).map(p=>({
        id:p.id,name:p.name,arrivedAt:received.get('adoption-'+p.id).arrivedAt,
      })),
      challenged:received.has('challenge'),challengeAt:received.get('challenge')?.arrivedAt,
    }:null,
    copies:wiki.polises.map(p=>({id:p.id,rootId:p.rootId,version:p.adoptedVersion,
      adopted:p.adopted,publishAt:p.publishAt,
      received:p.receivedVersions.length>0,receivedAt:p.receivedVersions[0]?.end,
    })),
  };
}
