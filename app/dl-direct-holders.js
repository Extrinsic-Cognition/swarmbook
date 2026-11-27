import { twitterName, validateAvatarURL } from './dl-holder-profiles.js';
let sphere = window.genesisSphere, profiles = [], pending = false;
// The ledger's holders orbit the sphere. An empty ledger sets no snapshot: the twelve chairs are the empty ledger, and a snapshot would freeze
// the sphere there for good, the film's Ryu Sei Ken included (his Oct 14 11:3x: the growth is one moment of the film, warm-sphere.js SEIYA_MOMENTS).
// Before this, the empty snapshot was what stopped the illustration's own 28-second clock; the hero has no such clock any more (warm.js).
function paint() { sphere?.setHolders(profiles); }
async function refresh() {
  if (pending || document.hidden) return; pending = true;
  try {
    const response = await fetch('/api/premint/holders', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!response.ok) return;
    const data = await response.json();
    profiles = (data.holders || []).slice(0,150).filter(p => twitterName(p.handle) === p.handle && validateAvatarURL(p.avatarUrl)).map(p => ({ ...p, profileUrl: `https://x.com/${p.handle}` })); paint();
  } catch { /* Keep the last verified view during a temporary outage. */ }
  finally { pending = false; }
}
window.addEventListener('genesis-sphere', e => { sphere = e.detail; paint(); });
window.addEventListener('dl-premint-paid', refresh);
document.addEventListener('visibilitychange', () => { if (!document.hidden) void refresh(); });
void refresh();
