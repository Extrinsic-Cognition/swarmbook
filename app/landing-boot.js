// A tiny first-paint hint, not the chain cache. Raw accounts still restore from
// IndexedDB. Only viewport-matched layout dimensions live here.
(() => {
  const html = document.documentElement;
  const key = 'poleis:landing-paint:1:' + JSON.stringify([location.pathname, new URLSearchParams(location.search).get('rpc') || 'https://api.devnet.solana.com']);
  let saved;
  try {
    const value = JSON.parse(localStorage.getItem(key));
    if (value && Number.isFinite(value.at) && Date.now() >= value.at && Date.now() - value.at < 86400000) saved = value;
  } catch { /* storage is optional */ }
  html.dataset.poleisBoot = 'loading';
  if (saved && Math.abs(saved.width - innerWidth) < 2 && Math.abs(saved.height - innerHeight) < 2
    && Number.isFinite(saved.stage) && saved.stage >= innerHeight && saved.stage < 100000) {
    html.style.setProperty('--poleis-boot-stage', saved.stage + 'px');
  }
  const ready = () => { clearTimeout(timeout); html.dataset.poleisBoot = 'ready'; };
  // Failed scripts or an unavailable chain must never leave content concealed.
  const timeout = setTimeout(ready, 4000);
  window.PoleisLandingBoot = {
    ready,
    save() {
      try {
        const root = document.getElementById('assembly');
        localStorage.setItem(key, JSON.stringify({ at: Date.now(), width: innerWidth, height: innerHeight,
          stage: parseFloat(root.style.getPropertyValue('--assembly-stage-height')) }));
      } catch { /* quota/storage denial cannot affect rendering */ }
    },
  };
})();
