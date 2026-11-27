import { watchAppearance, readAppearance } from './tracenet-appearance.mjs';
import { watchFuel } from './tracenet-fuel.mjs';

// A presentation of the profile, not a second Nest or a simulation of agent work.
// Only deliberate input animates; every hop finishes and releases its animation.
export const KEY_ROWS = Object.freeze([
  [...'QWERTYUIOP', { key: 'Backspace', label: '⌫', width: 1.3, accent: 'dark' }],
  [...'ASDFGHJKL', { key: 'Enter', label: '↵', width: 2.3, accent: 'teal' }],
  [{ key: 'Shift', label: 'shift', width: 1.3, accent: 'dark' }, ...'ZXCVBNM', ',', '.', '?'],
  [{ key: 'Escape', label: 'esc', accent: 'dark' }, { key: 'Control', label: 'ctrl', accent: 'dark' }, { key: 'Alt', label: 'alt', accent: 'dark' }, { key: ' ', label: 'SPACE', width: 6, accent: 'teal' }, { key: 'ArrowLeft', label: '←' }, { key: 'ArrowRight', label: '→' }],
]);
export function applyKey(text, key, shifted = false) {
  if (key === 'Backspace') return [...text].slice(0, -1).join('');
  if (key === 'Escape') return '';
  if ([...key].length !== 1) return text;
  return (text + (shifted ? key.toUpperCase() : key.toLowerCase())).slice(-70);
}

export function mountComputer({ doc, win, profile, handle, fetcher = win.fetch?.bind(win) }) {
  const el = id => doc.getElementById(id), host = el('tn-computer');
  if (!host) return null;
  const keys = el('tn-keys'), output = el('tn-typed'), cast = el('tn-cast');
  const actors = ['tn-lyssajudron'].map(el);
  const buttons = new Map(), positions = new Map(), animations = new Set();
  const media = win.matchMedia?.('(prefers-reduced-motion: reduce)');
  let sequence = 0, turn = 0, shifted = false, selected = 0, disposed = false;
  let inputQueue = [], inputToken = null;
  let spatial = null, fuel = null;   // fuel: the purse's level for her unit0 (null: unknown, no liquid)
  let appearance = readAppearance({});
  const appearanceRequest = new AbortController();
  for (const row of KEY_ROWS) {
    const line = doc.createElement('div'); line.className = 'tn-key-row';
    for (const entry of row) {
      const item = typeof entry === 'string' ? { key: entry, label: entry } : entry;
      const button = doc.createElement('button'); button.type = 'button'; button.className = 'tn-key';
      button.textContent = item.label; button.dataset.key = item.key;
      button.setAttribute('aria-label', item.key === ' ' ? 'Space' : item.key);
      if (item.width) button.style.setProperty('--key-width', item.width);
      if (item.accent) button.dataset.accent = item.accent;
      if (item.label.length > 1) button.dataset.small = '';
      button.addEventListener('click', () => press(item.key));
      buttons.set(item.key, button); line.append(button);
    }
    keys.append(line);
  }
  const point = key => {
    const target = buttons.get(key.toUpperCase()) ?? buttons.get(key);
    if (!target) return null;
    const b = target.getBoundingClientRect(), c = cast.getBoundingClientRect();
    return { x: b.left - c.left + b.width * .57, y: b.top - c.top + b.height * .67, target };
  };
  function place(actor, key) {
    if (spatial?.available) spatial.place(actors.indexOf(actor), key);
    const p = point(key); if (!p) return;
    actor.style.left = `${p.x}px`; actor.style.top = `${p.y}px`;
    positions.set(actor, { ...p, key });
  }
  function cancel() {
    sequence++; inputQueue = []; inputToken = null;
    spatial?.cancel();
    for (const animation of animations) animation.cancel();
    animations.clear();
    for (const button of buttons.values()) button.classList.remove('is-down');
  }
  async function motion(node, frames, duration) {
    if (media?.matches || typeof node.animate !== 'function') return;
    const animation = node.animate(frames, { duration, easing: 'cubic-bezier(.2,.65,.4,1)' });
    animations.add(animation);
    try { await animation.finished; } catch { /* A new input can cancel the previous hop. */ }
    finally { animations.delete(animation); animation.cancel(); }
  }
  async function hop(actor, key, token, caseValue = shifted) {
    if (spatial?.available) {
      const landed = await spatial.hop(actors.indexOf(actor), key, media?.matches);
      if (!landed || token !== sequence || disposed) return false;
      output.textContent = applyKey(output.textContent, key, caseValue);
      return true;
    }
    const before = positions.get(actor), after = point(key);
    if (!after || disposed) return false;
    place(actor, key);
    const dx = (before?.x ?? after.x) - after.x, dy = (before?.y ?? after.y) - after.y;
    await motion(actor, [
      { transform: `translate(calc(-50% + ${dx}px), calc(-100% + ${dy}px)) rotate(-4deg)` },
      { transform: `translate(calc(-50% + ${dx / 2}px), calc(-100% + ${dy / 2 - 38}px)) rotate(5deg)`, offset: .48 },
      { transform: 'translate(-50%, -100%) rotate(0deg)' },
    ], 310);
    if (token !== sequence || disposed) return false;
    after.target.classList.add('is-down');
    output.textContent = applyKey(output.textContent, key, caseValue);
    await motion(actor.querySelector('.tn-actor-body'), [
      { transform: 'translateY(0) scale(1)' }, { transform: 'translateY(6px) scale(1.1,.88)', offset: .4 }, { transform: 'translateY(0) scale(1)' },
    ], 160);
    after.target.classList.remove('is-down');
    return token === sequence;
  }
  async function type(text, actor = null) {
    cancel(); const token = sequence;
    output.textContent = '';
    if (doc.hidden) { output.textContent = text; return; }
    if (media?.matches) { output.textContent = text; return; }
    for (const key of text) {
      if (!(await hop(actor ?? actors[turn++ % actors.length], key, token))) break;
    }
  }
  function chooseProject(delta = 0, open = false) {
    spatial?.enter?.();
    const choices = [...el('tn-projects').querySelectorAll('.tn-project-open')];
    if (!choices.length) return;
    selected = (selected + delta + choices.length) % choices.length;
    choices[selected].focus({ preventScroll: true });
    if (open) choices[selected].click();
  }
  function press(key, caseValue = shifted) {
    if (key === 'Shift') { shifted = !shifted; buttons.get('Shift').setAttribute('aria-pressed', String(shifted)); return; }
    if (key === 'ArrowLeft' || key === 'ArrowRight') { chooseProject(key === 'ArrowLeft' ? -1 : 1); return; }
    if (key === 'Enter') { chooseProject(0, true); return; }
    if (key === 'Control' || key === 'Alt') return;
    if (key === 'Escape') { cancel(); output.textContent = ''; return; }
    if (inputToken !== sequence) {
      cancel(); inputToken = sequence;
    }
    inputQueue.push({ key, caseValue });
    if (inputQueue.length > 1) return;
    const token = sequence;
    void (async () => {
      while (inputQueue.length && token === sequence) {
        if (!(await hop(actors[turn++ % actors.length], inputQueue[0].key, token, inputQueue[0].caseValue))) return;
        inputQueue.shift();
      }
      if (token === sequence) inputToken = null;
    })();
  }
  actors[0].addEventListener('click', () => { void type('lyssajudron', actors[0]); });
  place(actors[0], 'G');
  const resize = () => { cancel(); for (const actor of actors) place(actor, positions.get(actor)?.key ?? 'G'); };
  const observer = typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(resize) : null;
  observer?.observe(keys);
  const visibility = () => { if (doc.hidden) cancel(); };
  doc.addEventListener('visibilitychange', visibility);
  const reduced = () => { if (media.matches) cancel(); };
  media?.addEventListener?.('change', reduced);
  const hardware = event => {
    if (event.ctrlKey || event.altKey || event.metaKey || doc.querySelector('dialog[open]') || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName) || event.target?.isContentEditable) return;
    if (event.key === ' ' && event.target?.tagName === 'BUTTON') return;
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
    const key = event.key.length === 1 ? event.key.toUpperCase() : event.key;
    if (!buttons.has(key)) return;
    // Native Enter on an already-focused button remains a native click.
    if (event.key === 'Enter' && event.target?.tagName === 'BUTTON') return;
    event.preventDefault(); press(key, event.shiftKey);
  };
  doc.addEventListener('keydown', hardware);
  // Load one renderer; it sleeps between deliberate inputs.
  if (win.WebGL2RenderingContext && el('tn-open-screen')) {
    void import('./tracenet-laptop.mjs').then(({ mountLaptop }) => {
      if (disposed) return;
      cancel();
      spatial = mountLaptop({ doc, win, host, screenElement: el('tn-monitor'), rows: KEY_ROWS, appearance,
        onKey: press, onActor: index => { void type('lyssajudron', actors[index]); },
        onAvailabilityChange: available => { if (available) observer?.disconnect(); else { observer?.observe(keys); resize(); } } });
      observer?.disconnect();
      spatial.fuel(fuel);
    }).catch(() => { /* The functional HTML computer remains usable without WebGL. */ }).finally(() => { doc.documentElement.classList.remove('tn-booting'); });
  }
  // The owner view follows canonical changes on the room's existing stream.
  const appearanceWatch = watchAppearance({ handle, hostname: win.location.hostname, fetcher, signal: appearanceRequest.signal, onChange(value) {
    if (disposed) return;
    appearance = value;
    spatial?.appearance(value);
    actors[0].style.setProperty('--lyssa-base', value.parts.base);
    actors[0].style.setProperty('--lyssa-edge', value.parts.gold);
    host.dataset.appearance = value.source;
    const swatches = el('tn-trait-swatches');
    if (swatches) {
      swatches.replaceChildren();
      for (const trait of value.attributes) {
        const item = doc.createElement('li'), dot = doc.createElement('i'), label = doc.createElement('span');
        label.textContent = trait.trait_type;
        if (/^#[0-9a-f]{6}$/i.test(trait.value)) { dot.style.backgroundColor = trait.value; item.title = trait.value; }
        else { dot.textContent = '◡'; item.title = trait.value; }
        item.append(dot, label); swatches.append(item);
      }
      el('tn-trait-state').textContent = value.source === 'local' ? 'Saved in your Nest' : 'Original appearance';
    }
  } });
  // Her unit0 is the tank: the owner view fills it from house/purse on the same stream (tracenet-fuel.mjs); a visitor's stays unknown.
  const fuelWatch = watchFuel({ handle, hostname: win.location.hostname, fetcher, signal: appearanceRequest.signal, onChange(value, bite = 0) {
    if (disposed) return;
    fuel = value; spatial?.fuel(value, bite);
  } });
  const traits = el('tn-traits-dialog');
  el('tn-traits')?.addEventListener('click', () => traits.showModal());
  el('tn-traits-close')?.addEventListener('click', () => traits.close());
  el('tn-save-traits')?.addEventListener('click', () => {
    const metadata = { name: 'Lyssajudron', description: 'Lyssajudron appearance. Metadata only; this file is not a minted NFT.', attributes: appearance.attributes };
    const url = win.URL.createObjectURL(new Blob([JSON.stringify(metadata, null, 2) + '\n'], { type: 'application/json' }));
    const link = doc.createElement('a'); link.href = url; link.download = 'lyssajudron-traits.json'; link.click();
    win.URL.revokeObjectURL(url);
  });
  const stop = () => {
    disposed = true; appearanceWatch.stop(); fuelWatch.stop(); appearanceRequest.abort(); cancel(); observer?.disconnect();
    spatial?.stop();
    doc.removeEventListener('keydown', hardware); doc.removeEventListener('visibilitychange', visibility);
    media?.removeEventListener?.('change', reduced);
  };
  win.addEventListener('pagehide', event => { if (event.persisted) cancel(); else stop(); });
  return { stop, type };
}
