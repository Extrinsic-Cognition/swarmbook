// Shared by the wall and society pages. Draw only on load and resize.
(() => {
  const canvas = document.getElementById('mesh');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const draw = () => {
    const dpr = devicePixelRatio || 1;
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    // Keep the wall's geometry, origin, ink and opacity unchanged.
    const radius = 88, dx = radius * Math.sqrt(3), dy = radius * 1.5;
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--line').trim();
    ctx.strokeStyle = ink || '#C4B9A2'; ctx.globalAlpha = .35; ctx.lineWidth = 2;
    for (let row = -1; row * dy < innerHeight + radius; row++) {
      for (let col = -1; col * dx < innerWidth + radius; col++) {
        const cx = col * dx + (row % 2 ? dx / 2 : 0), cy = row * dy;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = Math.PI / 6 + k * Math.PI / 3;
          const x = cx + radius * Math.cos(a), y = cy + radius * Math.sin(a);
          k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.closePath(); ctx.stroke();
      }
    }
  };
  addEventListener('resize', draw);
  draw();
})();
