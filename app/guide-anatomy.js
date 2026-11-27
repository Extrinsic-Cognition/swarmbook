// Ordinary live page content. The walkthrough temporarily owns this scene's
// clock during its final reveal; outside that reveal only visible time advances.
import {createAnatomyScene, anatomyMoment, ANATOMY_PHASE_STARTS, ANATOMY_STILL_TIMES} from './anatomy-scene.js?v=artifacts-1';

const REVEAL_SECONDS = 3.6;
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const x = clamp(value); return x * x * (3 - 2 * x); };

export function createAnatomy(host, {reduced = matchMedia('(prefers-reduced-motion: reduce)')} = {}) {
  if (!host) return {prepare: () => false, target: () => 0, render() {}, reset() {}, destroy() {}};
  const doc = host.ownerDocument, win = doc.defaultView;
  const plane = host.querySelector('.anatomy-plane'), canvas = host.querySelector('canvas');
  const scene = createAnatomyScene(canvas);
  const buttons = Array.from(host.querySelectorAll('[data-anatomy-phase]'));
  const captions = Array.from(host.querySelectorAll('[data-anatomy-caption]'));
  const narration = host.querySelector('[data-anatomy-narration]');
  const pause = host.querySelector('[data-anatomy-pause]');
  const floorReadout = host.querySelector('[data-anatomy-floor]');
  const floorCount = floorReadout?.querySelector('[data-floor-count]');
  const floorVote = floorReadout?.querySelector('[data-floor-vote]');
  const fundingReadout = host.querySelector('[data-anatomy-funding]');
  const fundingCount = fundingReadout?.querySelector('[data-funding-count]');
  const gossipReadout = host.querySelector('[data-anatomy-gossip]');
  const gossipDelivered = gossipReadout?.querySelector('[data-gossip-delivered]');
  const gossipStatus = gossipReadout?.querySelector('[data-gossip-status]');
  let elapsed = reduced.matches ? ANATOMY_STILL_TIMES[0] * 1000 : 0;
  let prepared = false, revealProgress = 1, paused = false, dead = false;
  let raf = null, lastTime = null, selected = -1;
  const phaseOf = node => Number(node.dataset.anatomyPhase);
  const validPhase = index => Number.isInteger(index) && index >= 0 && index < ANATOMY_PHASE_STARTS.length;
  const now = () => win.performance?.now?.() ?? performance.now();
  const intersects = () => {
    const box = host.getBoundingClientRect();
    return box.bottom > 0 && box.top < win.innerHeight;
  };
  let visible = intersects();
  const movieOwnsClock = () => prepared && revealProgress < 1;
  const canAnimate = () => !dead && visible && !doc.hidden && !reduced.matches && !paused && !movieOwnsClock();
  const stop = () => {
    if (raf !== null) win.cancelAnimationFrame(raf);
    raf = null; lastTime = null;
  };
  const updateControls = () => {
    for (const button of buttons) button.disabled = movieOwnsClock();
    if (pause) {
      pause.disabled = movieOwnsClock() || reduced.matches;
      pause.textContent = paused ? 'Play' : 'Pause';
      pause.setAttribute('aria-pressed', String(paused));
      pause.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} journey animation`);
    }
  };
  const paint = () => {
    if (dead) return;
    const state = scene.draw(elapsed / 1000, {still: reduced.matches});
    if (!state || !validPhase(state.phase)) return;
    if (state.phase !== selected) {
      selected = state.phase;
      for (const button of buttons) {
        button.setAttribute('aria-pressed', String(phaseOf(button) === selected));
        button.style.setProperty('--anatomy-progress', '0%');
      }
      for (const caption of captions) caption.hidden = Number(caption.dataset.anatomyCaption) !== selected;
      if (floorReadout) floorReadout.hidden = selected !== 2 && selected !== 3;
      if (fundingReadout) fundingReadout.hidden = selected !== 3;
      if (gossipReadout) gossipReadout.hidden = selected !== 4;
    }
    if (typeof state.caption === 'string') {
      const caption = captions.find(node => Number(node.dataset.anatomyCaption) === selected);
      if (caption && caption.textContent !== state.caption) caption.textContent = state.caption;
    }
    if (narration) {
      const hidden = state.phase > 2;
      if (narration.hidden !== hidden) narration.hidden = hidden;
      if (!hidden && typeof state.caption === 'string' && narration.textContent !== state.caption)
        narration.textContent = state.caption;
    }
    if (state.phase === 2 && state.floor) {
      const floor = state.floor;
      const count = `${floor.occupied} / ${floor.capacity}`;
      const vote = floor.removed ? 'Vote passed · seats bought out' : floor.sealed ? 'Vote passed · buyout in progress' :
        floor.chairYes || floor.floorYes ? `${floor.chairYes} / 12 chairs · ${floor.floorYes} / ${floor.capacity} floor` : 'occupied seats';
      if (floorCount && floorCount.textContent !== count) floorCount.textContent = count;
      if (floorVote && floorVote.textContent !== vote) floorVote.textContent = vote;
    }
    if (state.phase === 3 && state.growth) {
      const growth = state.growth;
      const count = `${growth.occupied} / ${growth.capacity}`;
      const vote = growth.stage.endsWith('-vote') ? `${growth.chairYes} / 12 chairs · ${growth.floorYes} / ${growth.electorate} floor` :
        growth.stage === 'demand' ? 'User demand reaches the departments' : growth.stage === 'organize' ? 'Vote passed · departments form teams' :
        growth.stage === 'delegate' ? 'Each team keeps one parent voice' : growth.stage === 'vote' ? `${growth.chairYes} / 12 chairs · ${growth.floorYes} / ${growth.electorate} floor` :
        growth.stage === 'expand' ? 'Vote passed · capacity expands' : growth.stage === 'admit' ? 'New seats · admission payments' :
          growth.stage === 'funded' ? 'Admissions fund the treasury' : 'Child chambers form';
      const funding = `+${growth.payments} payments`;
      if (floorCount && floorCount.textContent !== count) floorCount.textContent = count;
      if (floorVote && floorVote.textContent !== vote) floorVote.textContent = vote;
      if (fundingCount && fundingCount.textContent !== funding) fundingCount.textContent = funding;
    }
    if (state.phase === 4 && state.gossip) {
      const gossip = state.gossip;
      if (gossipDelivered && typeof gossip.readout === 'string' && gossipDelivered.textContent !== gossip.readout) gossipDelivered.textContent = gossip.readout;
      if (gossipStatus && typeof gossip.status === 'string' && gossipStatus.textContent !== gossip.status) gossipStatus.textContent = gossip.status;
    }
    const progress = `${(clamp(state.progress) * 100).toFixed(2)}%`;
    for (const button of buttons) if (phaseOf(button) === selected) button.style.setProperty('--anatomy-progress', progress);
  };
  const frame = stamp => {
    raf = null;
    if (!canAnimate()) { lastTime = null; return; }
    if (lastTime !== null && Number.isFinite(stamp)) elapsed += Math.max(0, Math.min(100, stamp - lastTime));
    lastTime = stamp;
    paint();
    raf = win.requestAnimationFrame(frame);
  };
  const schedule = () => {
    if (canAnimate() && raf === null) { lastTime = now(); raf = win.requestAnimationFrame(frame); }
  };
  const restoreContent = () => {
    host.hidden = false;
    plane.style.opacity = '1'; plane.style.transform = 'none';
    host.setAttribute('aria-hidden', 'false');
  };
  const stillCenter = () => {
    const phase = selected >= 0 ? selected : anatomyMoment(elapsed / 1000).phase;
    elapsed = (ANATOMY_PHASE_STARTS[phase] + ANATOMY_STILL_TIMES[phase]) * 1000;
  };
  const reset = () => {
    if (dead) return;
    stop(); prepared = false; revealProgress = 1;
    if (reduced.matches) stillCenter();
    restoreContent(); updateControls(); paint(); schedule();
  };
  const render = progress => {
    if (dead || !prepared || !Number.isFinite(progress)) return;
    if (doc.hidden || reduced.matches) { reset(); return; }
    revealProgress = clamp(progress);
    elapsed = revealProgress * REVEAL_SECONDS * 1000;
    const reveal = smooth(revealProgress);
    plane.style.opacity = String(smooth(revealProgress / .3));
    plane.style.transform = `translate3d(0,${38 * (1 - reveal)}px,${-420 * (1 - reveal)}px) rotateX(${12 * (1 - reveal)}deg)`;
    host.setAttribute('aria-hidden', String(revealProgress < .2));
    paint();
    if (revealProgress === 1) {
      prepared = false; restoreContent(); updateControls(); schedule();
    }
  };
  const target = () => {
    const box = host.getBoundingClientRect(), height = win.innerHeight;
    const header = doc.querySelector('main > header')?.getBoundingClientRect().height || 0;
    const top = Math.max(header + 24, Math.min(height * .38, height - box.height - 112));
    return Math.max(0, win.scrollY + box.top - top);
  };
  const onEnvironment = () => {
    stop();
    if (movieOwnsClock() && (doc.hidden || reduced.matches)) { reset(); return; }
    if (reduced.matches) stillCenter();
    updateControls();
    if (!movieOwnsClock() && !doc.hidden) paint();
    schedule();
  };
  const setVisible = value => {
    if (visible === value) return;
    visible = value; stop();
    if (visible && !doc.hidden && !movieOwnsClock()) paint();
    schedule();
  };
  const onScroll = () => setVisible(intersects());
  const onResize = () => {
    if (dead) return;
    if (!observer) setVisible(intersects());
    paint(); schedule();
  };
  const handlers = buttons.map(button => {
    const choose = () => {
      const index = phaseOf(button);
      if (dead || movieOwnsClock() || !validPhase(index)) return;
      stop(); elapsed = (ANATOMY_PHASE_STARTS[index] + (reduced.matches ? ANATOMY_STILL_TIMES[index] : 0)) * 1000;
      paint(); schedule();
    };
    button.addEventListener('click', choose);
    return [button, choose];
  });
  const togglePause = () => {
    if (dead || movieOwnsClock() || reduced.matches) return;
    stop(); paused = !paused; updateControls(); paint(); schedule();
  };
  pause?.addEventListener('click', togglePause);
  const observer = typeof win.IntersectionObserver === 'function' ? new win.IntersectionObserver(entries => {
    if (dead) return;
    const entry = entries.find(item => item.target === host);
    if (entry) setVisible(entry.isIntersecting);
  }) : null;
  observer?.observe(host);
  if (!observer) win.addEventListener('scroll', onScroll, {passive: true});
  win.addEventListener('resize', onResize);
  doc.addEventListener('visibilitychange', onEnvironment);
  reduced.addEventListener('change', onEnvironment);
  reset();
  return {
    prepare() {
      if (dead || reduced.matches || doc.hidden) return false;
      stop(); prepared = true; revealProgress = 0; elapsed = 0;
      host.hidden = false; plane.style.opacity = '0'; host.setAttribute('aria-hidden', 'true');
      updateControls(); paint();
      return true;
    },
    target, render, reset,
    destroy() {
      if (dead) return;
      stop(); prepared = false; revealProgress = 1;
      restoreContent(); paint(); dead = true;
      observer?.disconnect();
      if (!observer) win.removeEventListener('scroll', onScroll);
      win.removeEventListener('resize', onResize);
      doc.removeEventListener('visibilitychange', onEnvironment);
      reduced.removeEventListener('change', onEnvironment);
      handlers.forEach(([button, handler]) => button.removeEventListener('click', handler));
      pause?.removeEventListener('click', togglePause);
      scene.destroy();
    },
  };
}
