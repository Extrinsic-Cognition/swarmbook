import { DiscussionLayer } from './discussion.js?v=speaker-burst-1';
// Quiet orbital geometry is the shared baseline; discussion adds public envelopes.
export class ActivityScene {
  constructor(canvas) {
    this.original = canvas;
    this.host = document.createElement('div'); this.host.className = 'activity-scene';
    canvas.before(this.host); this.host.append(canvas); canvas.classList.add('voting-canvas');
    canvas.setAttribute('role', 'img');
    this.overlay = document.createElement('canvas'); this.overlay.className = 'discussion-messages';
    this.overlay.setAttribute('aria-hidden', 'true'); this.host.append(this.overlay);
    this.legend = document.createElement('div'); this.legend.className = 'scene-legend'; this.host.append(this.legend);
    this.mode = null; this.instance = null; this.preview = false;
    this.poetryTimer = null;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
    this.onMotion = () => { if (this.mode) this.set(this.mode, this.preview, this.discussion); };
    this.reduced.addEventListener('change', this.onMotion);
  }
  bind(instance) {
    this.instance = instance;
    this.messages = new DiscussionLayer(this.overlay, window.PoleisEngine, instance);
    instance.onSceneFrame = (t, layout) => {
      this.messages.paint(t, layout);
      // Reduced motion stops geometric animation, not the shared text clock.
      // Wake once at a page boundary; ordinary rendering keeps its own cadence.
      if (this.mode === 'discussion' && this.preview && this.reduced.matches && this.messages.nextAt) {
        this.clearPoetryTimer();
        this.poetryTimer = setTimeout(() => {
          this.poetryTimer = null;
          if (this.instance && this.mode === 'discussion' && this.preview && this.reduced.matches) window.PoleisEngine.drawOnce(this.instance);
        }, Math.max(16, this.messages.nextAt - this.messages.now()));
      }
    };
    instance.onAgentProgress = ({ voted, absent, pending, depth, blocked, outcome, harmonizing, releasing }) => {
      if (this.mode !== 'voting') return;
      const verdict = { RATUM: 'PASSED', REIECTUM: 'REJECTED', DISSENSIO: 'DEADLOCK' }[outcome];
      this.voteLegend = releasing ? 'the chambers brighten · agents return to orbit'
        : harmonizing && verdict ? `${verdict} · outcome resounds through the tree`
        : (depth !== null && depth !== undefined ? `resolving level ${depth} · ` : '')
        + `${voted} chair vote${voted === 1 ? '' : 's'}`
        + (pending ? ` · ${pending} awaiting votes` : '') + (blocked ? ` · ${blocked} waiting for children` : '')
        + (absent ? ` · ${absent} absent` : '');
      this.legend.textContent = this.voteLegend;
    };
  }
  set(mode, preview = false, discussion = null) {
    this.clearPoetryTimer();
    this.mode = mode; this.preview = preview; this.discussion = discussion;
    this.host.dataset.scene = mode; this.host.dataset.preview = String(preview);
    this.original.setAttribute('aria-hidden', 'false');
    this.original.setAttribute('aria-label', mode === 'discussion'
      ? preview ? 'Discussion study: complete poems travel between orbiting agents on an hourly clock. Reloading resumes the current passage. Use Show words or Read the poems for the original text.'
        : 'Public discussion: sealed message panels contain symbolic glyphs; private message contents are unavailable. Each sender keeps its orbit and identity.'
      : mode === 'idle' ? 'Quiet orbit: twelve agentic loops around every civilization; no discussion traffic or voting activity'
      : 'Voting: confirmed votes reach their own chairs and floor seats; child chambers resolve before their parents, the recorded outcome resounds through the tree, then every participating chamber brightens and its agents return to orbit');
    this.legend.textContent = mode === 'discussion' ? preview ? 'the sending · each poem, beginning to end' : 'public view · the words remain sealed' : mode === 'idle' ? 'quiet orbit · energy saver' : this.voteLegend || 'deepest chambers first · the origin resolves last';
    if (!this.instance) return;
    const engine = window.PoleisEngine;
    engine.setDiscussion(this.instance, mode !== 'voting', { preserveBallot: mode === 'idle' });
    this.messages.set({ active: mode === 'discussion', preview, reduced: this.reduced.matches });
    if (mode === 'discussion' && !preview) this.messages.receive(discussion?.envelopes);
    engine.setActive(this.instance, mode === 'voting' || !this.reduced.matches);
    if (mode !== 'voting' && this.reduced.matches) engine.drawOnce(this.instance);
  }
  clearPoetryTimer() { if (this.poetryTimer !== null) { clearTimeout(this.poetryTimer); this.poetryTimer = null; } }
  destroy() {
    this.clearPoetryTimer();
    if (this.instance) { this.instance.onAgentProgress = null; this.instance.onSceneFrame = null; }
    this.messages?.destroy();
    this.reduced.removeEventListener('change', this.onMotion);
    this.host.before(this.original); this.host.remove();
  }
}

export const sceneFromLocation = () => {
  const scene = new URLSearchParams(location.search).get('scene');
  return ['voting', 'discussion', 'idle'].includes(scene) ? scene : 'live';
};
