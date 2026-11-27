import test from 'node:test';
import assert from 'node:assert/strict';
import { mountComputer } from './tracenet-computer.mjs';

// A controllable compositor: finishing or cancelling a hop advances its actual
// promise chain, without wall-clock sleeps, a browser process, or a renderer.
function fixture({ reduced = false } = {}) {
  const active = new Set(), created = [], timers = new Map();
  let timerId = 0;
  class Element extends EventTarget {
    children = []; dataset = {}; textContent = ''; hidden = false;
    style = { setProperty() {} };
    classes = new Set();
    classList = { add: value => this.classes.add(value), remove: value => this.classes.delete(value) };
    append(...children) { this.children.push(...children); }
    setAttribute(name, value) { this[name] = value; }
    querySelector(selector) { return selector === '.tn-actor-body' ? this.body : null; }
    querySelectorAll() { return []; }
    getBoundingClientRect() { return { left: 20, top: 20, width: 50, height: 50 }; }
    click() { this.dispatchEvent(new Event('click')); }
    animate() {
      let resolve, reject;
      const animation = {
        finished: new Promise((yes, no) => { resolve = yes; reject = no; }),
        finish() { active.delete(animation); resolve(); },
        cancel() { active.delete(animation); reject(new Error('cancelled')); },
      };
      active.add(animation); created.push(animation); return animation;
    }
  }
  const ids = ['tn-computer', 'tn-keys', 'tn-typed', 'tn-cast', 'tn-lyssajudron',
    'tn-projects', 'tn-projects-section', 'tn-drops-section', 'tn-mode-projects', 'tn-mode-traces', 'tn-margaret'];
  const elements = new Map(ids.map(id => [id, new Element()]));
  for (const id of ['tn-lyssajudron']) elements.get(id).body = new Element();
  const doc = new EventTarget();
  Object.assign(doc, { hidden: false, getElementById: id => elements.get(id), createElement: () => new Element(), querySelector: () => null });
  const media = new EventTarget(); media.matches = reduced;
  const win = new EventTarget();
  Object.assign(win, {
    location: { hostname: 'optimism.fit', hash: '' }, matchMedia: () => media,
    setTimeout(fn) { timers.set(++timerId, fn); return timerId; }, clearTimeout(id) { timers.delete(id); },
  });
  const computer = mountComputer({ doc, win, profile: null });
  const buttons = elements.get('tn-keys').children.flatMap(row => row.children);
  const click = key => buttons.find(button => button.dataset.key === key).click();
  const hardware = (key, shiftKey = false) => {
    const event = new Event('keydown', { cancelable: true }); Object.assign(event, { key, shiftKey }); doc.dispatchEvent(event);
  };
  async function drain() {
    // Three keys need six animations. The bound also detects an accidental idle loop.
    for (let i = 0; i < 60; i++) {
      for (const animation of [...active]) animation.finish();
      await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    }
    assert.equal(active.size, 0, 'all compositor work is finite');
  }
  return { doc, win, media, click, hardware, drain, active, created, timers, computer,
    output: () => elements.get('tn-typed').textContent };
}

test('rapid key presses all land in order without an idle timer', async () => {
  const f = fixture();
  f.click('Q'); f.click('W'); f.click('E');
  assert.equal(f.output(), '', 'a key types when its character lands');
  await f.drain();
  assert.equal(f.output(), 'qwe');
  assert.equal(f.created.length, 6, 'one jump and landing per key');
  assert.equal(f.timers.size, 0, 'the welcome cannot overwrite deliberate input');
  f.computer.stop();
});

test('physical Shift applies only to its key even when several keys await landing', async () => {
  const f = fixture();
  f.hardware('Shift', true); f.hardware('H', true); f.hardware('i', false);
  await f.drain();
  assert.equal(f.output(), 'Hi');
  f.hardware('j', false); await f.drain();
  assert.equal(f.output(), 'Hij');
  f.computer.stop();
});

test('reduced motion types every queued key without creating an animation', async () => {
  const f = fixture({ reduced: true });
  f.click('Q'); f.click('W'); f.click('E'); await f.drain();
  assert.equal(f.output(), 'qwe'); assert.equal(f.created.length, 0);
  f.computer.stop();
});

test('hiding the page cancels an airborne key and its queue; visible input resumes', async () => {
  const f = fixture();
  f.click('Q'); f.click('W');
  f.doc.hidden = true; f.doc.dispatchEvent(new Event('visibilitychange'));
  await f.drain(); assert.equal(f.output(), '');
  f.doc.hidden = false; f.doc.dispatchEvent(new Event('visibilitychange'));
  f.click('E'); await f.drain(); assert.equal(f.output(), 'e');
  f.computer.stop();
});

test('a cached pagehide cancels motion while retaining keyboard input after Back', async () => {
  const f = fixture(); f.hardware('q');
  const hide = new Event('pagehide'); Object.assign(hide, { persisted: true }); f.win.dispatchEvent(hide);
  await f.drain(); assert.equal(f.output(), '');
  f.hardware('e'); await f.drain(); assert.equal(f.output(), 'e');
  f.computer.stop();
});
