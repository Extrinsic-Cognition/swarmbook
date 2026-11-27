// mint-glass.mjs: THE SHAPES ARE RUST'S (Nov 24 2026; his "Yes, the whole frame", then "Yes, shapes in Rust"). The mint kernel (embertide-mint
// glass.rs) writes the twelve's trails and small bodies as the graphics card's instances; this file draws its buffer with its shader (glass.wgsl,
// handed out by the same .wasm): one write and one draw a pass, no shape worked out here. The layers over the sphere's canvas, in the order they
// stack: the far glass (the pass behind the cage), the middle 2D layer, the near glass (the pass before it), the top 2D layer.
const F = 20;
export async function mountMintGlass(sphere, mint) {
  const W = mint?.exports; if (!W?.mint_glass_wgsl || !navigator.gpu) return null;
  const dev = await (await navigator.gpu.requestAdapter())?.requestDevice(); if (!dev) return null;
  const format = navigator.gpu.getPreferredCanvasFormat(), code = new TextDecoder().decode(new Uint8Array(W.memory.buffer, W.mint_glass_wgsl(), W.mint_glass_wgsl_len()));
  const module = dev.createShaderModule({ code }), over = { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' };
  const pipe = dev.createRenderPipeline({ layout: 'auto', multisample: { count: 4 }, vertex: { module, entryPoint: 'vs', buffers: [{ arrayStride: F * 4, stepMode: 'instance', attributes: [0, 1, 2, 3, 4].map((k) => ({ shaderLocation: k, offset: k * 16, format: 'float32x4' })) }] }, fragment: { module, entryPoint: 'fs', targets: [{ format, blend: { color: over, alpha: over } }] } });
  const ubuf = dev.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  // THE RITE'S UNITS ARE RUST'S: the birds' sheets as the page painted them, each a texture the shader's pictures read (four at most; none: one clear pixel)
  const smp = dev.createSampler({ magFilter: 'linear', minFilter: 'linear' }), tex = (w, h) => dev.createTexture({ size: [w, h], format: 'rgba8unorm', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT }), none = tex(1, 1), sheets = [none, none, none, none];
  let bound = null; const bind = () => (bound ??= dev.createBindGroup({ layout: pipe.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: ubuf } }, { binding: 1, resource: smp }, ...sheets.map((t, k) => ({ binding: 2 + k, resource: t.createView() }))] }));
  if (getComputedStyle(sphere).position === 'static') sphere.style.position = 'relative';
  const style = getComputedStyle(sphere), layers = [];
  for (const kind of ['webgpu', '2d', 'webgpu', '2d']) { const cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); cv.dataset.mintGlass = ''; cv.style.cssText = 'position:absolute;pointer-events:none'; (layers.at(-1)?.cv ?? sphere).after(cv); layers.push({ cv, ctx: cv.getContext(kind), drew: false, ibuf: null }); }
  const [far, mid, near, top] = layers; let msaa = null, opacity = '', view = '';
  for (const g of [far, near]) g.ctx.configure({ device: dev, format, alphaMode: 'premultiplied' });
  return {
    canvas: sphere, mid: mid.ctx, top: top.ctx,
    /** a sheet of sprites the page painted whole (cols tiles a row, each `tile` of its pixels a side), given to the card as sheet k and told to the kernel: true once it stands */
    sheet(k, cv, cols, tile) { if (!(k >= 0 && k < 4) || !W.mint_glass_sheet?.(k, cols, tile, cv.width, cv.height)) return false; const t = tex(cv.width, cv.height); dev.queue.copyExternalImageToTexture({ source: cv }, { texture: t, premultipliedAlpha: true }, [cv.width, cv.height]); if (sheets[k] !== none) sheets[k].destroy(); sheets[k] = t; bound = null; return true; },
    /** before the sphere paints a frame: every layer takes its canvas's size, place and opacity; the 2D layers and the kernel's buffer start empty */
    begin(dpr, width, height) {
      const w = sphere.width, h = sphere.height; W.mint_glass_begin();
      for (const l of layers) if (l.cv.width !== w || l.cv.height !== h) { l.cv.width = w; l.cv.height = h; Object.assign(l.cv.style, { left: sphere.offsetLeft + 'px', top: sphere.offsetTop + 'px', width: width + 'px', height: height + 'px' }); msaa = null; }
      if (style.opacity !== opacity) { opacity = style.opacity; for (const l of layers) l.cv.style.opacity = opacity; }
      if (!msaa) msaa = dev.createTexture({ size: [w, h], sampleCount: 4, format, usage: GPUTextureUsage.RENDER_ATTACHMENT });
      for (const c of [mid.ctx, top.ctx]) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w, h); c.setTransform(dpr, 0, 0, dpr, 0, 0); }
      if (view !== (view = `${width} ${height} ${dpr}`)) dev.queue.writeBuffer(ubuf, 0, new Float32Array([2 / width, 2 / height, dpr, 0]));
    },
    /** the kernel's instances of this pass (0 far, 1 near) drawn on its glass, the buffer emptied for the next; a glass left empty is cleared once */
    draw(i) {
      const g = i ? near : far, n = W.mint_glass_n(); if (!n && !g.drew) return; g.drew = n > 0;
      if (n && (!g.ibuf || g.ibuf.size < n * F * 4)) g.ibuf = dev.createBuffer({ size: n * F * 8, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST });
      if (n) dev.queue.writeBuffer(g.ibuf, 0, W.memory.buffer, W.mint_glass_ptr(), n * F * 4);
      W.mint_glass_begin();
      const enc = dev.createCommandEncoder(), p = enc.beginRenderPass({ colorAttachments: [{ view: msaa.createView(), resolveTarget: g.ctx.getCurrentTexture().createView(), loadOp: 'clear', clearValue: [0, 0, 0, 0], storeOp: 'discard' }] });
      if (n) { p.setPipeline(pipe); p.setBindGroup(0, bind()); p.setVertexBuffer(0, g.ibuf); p.draw(48, n); }
      p.end(); dev.queue.submit([enc.finish()]);
    },
  };
}
