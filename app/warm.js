import {createGenesisSphere, useWasm, useGlass} from './warm-sphere.js?v=mint-3';   // setHeld: the paywall's still sphere (dl-paywall.js); setPulse: the heartbeat (lab/heartbeat.js)
import {renderPassport} from './warm-passport.js?v=ivory-rite-2';
import {resolveGenesisStatus} from './warm-launch-state.js?v=opening-20260914';
const $ = selector => document.querySelector(selector);
const dialog = $('#chamber');
let opener = null, paused = false;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const names = {seed:'THE SEED',arrival:'THE RECOGNITION',society:'THE FIRST SOCIETY',network:'ONE LAW AT EVERY SCALE'};
let sphere, passport, selectedFace = null;
const openChamber = source => {
  opener = source || document.activeElement;
  passport?.destroy();
  passport = renderPassport($('#passport-display'),{faceIndex:selectedFace,preview:true});
  if(typeof dialog.showModal === 'function') {dialog.showModal(); document.body.style.overflow='hidden';sphere?.setPaused(true);} else location.hash='rite';
};
try {
  sphere = createGenesisSphere($('#genesis-sphere'), {
    showSeatIndex: false,
    // no growth on the page's clock: the twelve chairs hold until the film's Ryu Sei Ken (dl-twelve.js setMoment; warm-sphere.js SEIYA_MOMENTS)
    automatic: false,
    onHolderSelect(profile) { window.open(profile.profileUrl, '_blank', 'noopener,noreferrer'); },
    onHoldersChange(profiles) {
      const links = document.getElementById('holder-profiles');
      if (!links) return;
      links.replaceChildren(...profiles.map(profile => {
        const link = document.createElement('a');
        link.href = profile.profileUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.textContent = `@${profile.handle}`;
        link.setAttribute('aria-label', `@${profile.handle} on X. Public profile supplied by this reservation's wallet; X account ownership is not verified.`);
        return link;
      }));
    },
    onScene(scene) {
      $('#sphere-caption').textContent = names[scene] || names.seed;
      document.querySelectorAll('[data-scene]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scene === scene)));
    },
    onAdmission() { $('#arrival-receipt').hidden = false; },
    onSelect(face) {
      if (!face) { $('#face-note').hidden = true; return; }
      // a hexagon of the live whitelist is a slot: it opens the bid (dl-slot.js), not the passport preview
      if(face.kind === 'hex' && window.takeSlot && sphere?.getViewState?.().mode === 'confirmed') {window.takeSlot();return;}
      // THE DISK OPENS NOTHING (his Oct 30 2026, over the passport and its vow opened by a tap on the hero's disk: "why the fuck is this appearing when i click the saint
      // seya disk dude?"): a tap on a hexagon of the disk opens no passport; the tap is the sound's (dl-twelve.js, rule 8's --tap sphere), nothing else
      if(face.kind === 'hex') return;
      $('#face-note').hidden = false;
      $('#face-title').textContent = face.title;
      $('#face-detail').textContent = face.detail;
    }
  });
} catch (error) {
  $('#sphere-caption').textContent = 'THE GENESIS';
  $('#visual-status').textContent = 'VISUALIZATION UNAVAILABLE';
  $('#genesis-sphere').setAttribute('aria-label','The genesis visualization is unavailable. The rite and founding information remain below.');
  console.error('Genesis visualization:', error);
}
// the whitelist reader (dl-whitelist.js) feeds this sphere the chain's slots
if (sphere) { window.genesisSphere = sphere; dispatchEvent(new CustomEvent('genesis-sphere', {detail: sphere})); }
// THE FRAME IN RUST (mint-wasm.mjs, house/embertide-mint): the kernel's bytes fetched once, off the page's load; the sphere draws from its own
// JS twins until they land, and for ever where they cannot (an old engine, a refused fetch): the same picture either way
if (sphere) import('./mint-wasm.mjs?v=glass-1').then(m => m.load({url: './wasm/embertide-mint.wasm?v=glass-1'})).then(kernel => { if (useWasm(kernel)) sphere.redraw(); return kernel; })
  .then(kernel => import('./mint-glass.mjs?v=glass-1').then(g => g.mountMintGlass($('#genesis-sphere'), kernel)).then(g => { if (useGlass(g)) sphere.redraw(); }).catch(() => {}))   // THE SHAPES ARE RUST'S
  .catch(error => console.warn('the mint kernel did not load; the sphere draws from its own JS', error));
document.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => {
  $('#face-note').hidden = true;
  sphere?.setScene(button.dataset.scene);
}));
$('#motion').addEventListener('click', () => {
  paused = !paused; sphere?.setPaused(paused);
  $('#motion').setAttribute('aria-pressed',String(paused));
  $('#motion').setAttribute('aria-label',paused ? 'Resume motion' : 'Pause motion');
  $('#motion').textContent = paused ? '▷' : 'Ⅱ';
});
$('#reset-view').addEventListener('click', () => sphere?.resetView());
$('#close-face').addEventListener('click', () => { $('#face-note').hidden = true; });
for (const button of document.querySelectorAll('[data-enter]')) button.addEventListener('click', () => openChamber(button));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click',event => {if(event.target === dialog) {const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=> {document.body.style.overflow=''; sphere?.setPaused(paused); opener?.focus({preventScroll:true});});
$('#preview-arrival').addEventListener('click',()=>{
  $('#arrival-receipt').hidden=true;dialog.close();
  paused=false;$('#motion').setAttribute('aria-pressed','false');$('#motion').setAttribute('aria-label','Pause motion');$('#motion').textContent='Ⅱ';
  sphere?.setPaused(false);document.getElementById('oath-sphere').scrollIntoView({behavior:reduce.matches?'instant':'smooth'});
  sphere?.previewAdmission(selectedFace);
});
$('#return-passport').addEventListener('click',()=>openChamber($('#return-passport')));
$('#close-receipt').addEventListener('click',()=>{$('#arrival-receipt').hidden=true;});
// Only a surface showing launch status needs the launch-status reader.
if ($('#mint-status') && $('#mint-foot')) fetch('./warm-genesis.json',{cache:'no-store',signal:AbortSignal.timeout(8000)})
 .then(r=> {if(!r.ok)throw new Error('Genesis status unavailable');return r.json();})
 .then(config=> {const state=resolveGenesisStatus(config);$('#mint-status').textContent=state.title;if(state.error)$('#mint-foot').textContent='Opening details are being verified. Minting remains closed.';})
 .catch(()=>{$('#mint-foot').textContent='Opening status is unavailable. Minting remains closed.';});
window.addEventListener('pagehide',()=>sphere?.setPaused(true));
window.addEventListener('pageshow',()=>sphere?.setPaused(paused));
