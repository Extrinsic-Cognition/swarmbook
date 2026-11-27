// swarm-glass.mjs: THE WALL RIDES THE GRAPHICS CARD (Nov 24 2026; his "is resting the thing to do here? ... do SOTA", "Yes, the real wall", and for these
// lines "Yes, pass +120"). The loader of embertide-swarm-glass (Rust: the ball's mesh, where every body of a tile in quiet orbit is at an instant, the three
// passes' shaders): it asks the module, copies and draws. No law and no picture of its own. The engine stays each tile's clock and its every other state:
// while a tile rests in its quiet orbit the engine is veiled (it paints nothing) and this draws it; a ballot, a forum or a turn of the loops is the engine's.
import { LADDER, rungFor } from './orb.js';
const attrs = (first, sizes) => { let at = 0; return { arrayStride: sizes.reduce((a, b) => a + b, 0) * 4, attributes: sizes.map((n, i) => { const a = { shaderLocation: first + i, offset: at, format: n === 1 ? 'float32' : `float32x${n}` }; at += n * 4; return a; }) }; };
export async function mountGlass(wasm, E = window.PoleisEngine) {
  const dev = await (await navigator.gpu?.requestAdapter())?.requestDevice(); if (!dev) return null;   // no graphics card to ask: the engine draws, as before
  const X = (await WebAssembly.instantiateStreaming(fetch(wasm))).instance.exports, format = navigator.gpu.getPreferredCanvasFormat();
  const f32 = () => new Float32Array(X.memory.buffer), u8 = () => new Uint8Array(X.memory.buffer);
  const blend = { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' }, alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' } };
  const pass = (k, buffers, write, cullMode) => { const module = dev.createShaderModule({ code: new TextDecoder().decode(u8().slice(X.swarm_wgsl(k), X.swarm_wgsl(k) + X.swarm_wgsl_len(k))) });
    return dev.createRenderPipeline({ layout: 'auto', multisample: { count: 4 }, primitive: { topology: 'triangle-list', cullMode, frontFace: 'cw' }, depthStencil: { format: 'depth24plus', depthWriteEnabled: write, depthCompare: 'less-equal' },
      vertex: { module, entryPoint: 'vs', buffers }, fragment: { module, entryPoint: 'fs', targets: [{ format, blend }] } }); };
  const inst = (first, sizes) => ({ ...attrs(first, sizes), stepMode: 'instance' });
  const P = [pass(0, [attrs(0, [3, 3, 1, 1, 2, 3, 1]), inst(7, [4, 3, 4, 2, 1])], true, 'back'), pass(1, [inst(0, [4, 4, 4, 4, 2])], false, 'none'), pass(2, [inst(0, [4, 1, 4, 2])], true, 'none')];
  const ubuf = dev.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST }), smp = dev.createSampler({ magFilter: 'linear', minFilter: 'linear' });
  const only = P.slice(1).map((p) => dev.createBindGroup({ layout: p.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: ubuf } }] }));
  const skins = new Map(), tiles = new Map(), pictures = [], targets = new Map(), blank = document.createElement('canvas'); let pics = null;
  const skin = (m, n) => { const k = m * 16 + n; if (!skins.has(k)) { const count = X.swarm_ball(m, n), at = X.swarm_ball_ptr() / 4, buf = dev.createBuffer({ size: count * 56, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST }); dev.queue.writeBuffer(buf, 0, f32(), at, count * 14); skins.set(k, { buf, count }); } return skins.get(k); };
  // every picture a face wears, a layer of one texture; it doubles when they outgrow it, and every tile is told again
  const layer = (img) => { let k = pictures.indexOf(img); if (k >= 0) return k; k = pictures.push(img) - 1;
    if (!pics || k >= pics.depthOrArrayLayers) { pics = dev.createTexture({ size: [256, 256, Math.max(8, pictures.length * 2)], format: 'rgba8unorm', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT }); pictures.forEach((p, j) => paint(p, j)); for (const e of tiles.values()) e.bind = null; } else paint(img, k);
    return k; };
  const paint = (img, k) => { const c = new OffscreenCanvas(256, 256); c.getContext('2d').drawImage(img, 0, 0, 256, 256); dev.queue.copyExternalImageToTexture({ source: c }, { texture: pics, origin: [0, 0, k] }, [256, 256]); };
  /** say(t): the tile's tree and what its faces wear, as the engine holds them now (at its mount, and when its riders' faces come in) */
  function say(t) { const e = tiles.get(t), I = t.inst; if (!e) return;
    e.nodes = I.nodes.map((n) => { const r = t.g.registries.get(n.name.slice(1)), [m, k] = LADDER[Number.isInteger(r.rung) && r.rung < LADDER.length ? r.rung : rungFor(Number(r.totalSeats))];
      return { name: n.name, parent: I.nodes.findIndex((x) => x.name === n.parent), seat: n.seat ?? 0, swarms: (I.children[n.name] || []).reduce((b, c) => b | 1 << c.seat, 0), skin: skin(m, k), hexes: I.geo[n.name].hexes.length }; });
    const px = new Uint8Array(642 * e.nodes.length); layer(blank);   // layer 0: so the texture stands before any face comes in
    e.nodes.forEach((n, row) => { for (let i = 0; i < 12 + n.hexes; i++) { const w = I.wear?.(n.name, i < 12 ? i : i - 12, i < 12 ? null : I.st[n.name].hv[i - 12], i < 12 ? 'pent' : 'hex'), img = w?.img ?? w?.rest?.img; if (img) px[row * 642 + i] = Math.min(126, layer(img)) + (i < 12 ? 129 : 1); } });
    e.wears?.destroy(); e.wears = dev.createTexture({ size: [642, e.nodes.length], format: 'r8uint', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST }); dev.queue.writeTexture({ texture: e.wears }, px, { bytesPerRow: 642 }, [642, e.nodes.length]); e.bind = null; }
  /** tile(t): a tile of the wall takes a glass over its engine's canvas; from then on the engine asks at each of its ticks whether it is veiled */
  function tile(t) { const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;pointer-events:none;visibility:hidden'; t.inst.cv.after(cv); const ctx = cv.getContext('webgpu'); ctx.configure({ device: dev, format, alphaMode: 'premultiplied' });
    tiles.set(t, { cv, ctx, buf: dev.createBuffer({ size: 4 * 64 * (14 + 72 + 132) + 16, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST }) }); say(t); t.inst.veiled = () => draw(t); }
  function drop(t) { const e = tiles.get(t); if (!e) return; tiles.delete(t); e.buf.destroy(); e.wears?.destroy(); e.cv.remove(); t.inst.veiled = null; }
  /** draw(t): asked by the engine's tick. -> true when the glass drew the tile (the engine then paints nothing), false when the tile is the engine's */
  function draw(t) { const e = tiles.get(t), I = t.inst, src = I.cv, box = src.getBoundingClientRect(), S = src.offsetWidth;
    const mine = t.scene.mode === 'idle' && I.discussion && !I.agentVoting && !I.discussionTo && !E.snapK(I) && S > 0;
    if (e.on !== mine) { e.on = mine; e.cv.style.visibility = mine ? 'visible' : 'hidden'; src.style.visibility = mine ? 'hidden' : 'visible'; if (!mine) I.lastPaint = 0; }
    if (!mine) return false; if (box.bottom < -60 || box.top > innerHeight + 60) return true;
    const px = Math.round(S * Math.min(2, devicePixelRatio)); if (e.cv.width !== px) { e.cv.width = e.cv.height = px; e.cv.style.left = src.offsetLeft + 'px'; e.cv.style.top = src.offsetTop + 'px'; e.cv.style.width = e.cv.style.height = S + 'px'; }
    if (!targets.has(px)) targets.set(px, ['depth24plus', format].map((f) => dev.createTexture({ size: [px, px], sampleCount: 4, format: f, usage: GPUTextureUsage.RENDER_ATTACHMENT }).createView()));
    e.bind ||= dev.createBindGroup({ layout: P[0].getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: ubuf } }, { binding: 1, resource: e.wears.createView() }, { binding: 2, resource: pics.createView({ dimension: '2d-array' }) }, { binding: 3, resource: smp }] });
    X.swarm_tree_clear(); for (const n of e.nodes) { const at = X.swarm_name_ptr(), m = u8(); for (let i = 0; i < n.name.length; i++) m[at + i] = n.name.charCodeAt(i); X.swarm_node(n.parent, n.seat, n.name.length, n.swarms); }
    const { yaw, pitch } = E.cameraAt(I), len = X.swarm_frame(I.animT, yaw, pitch, S, 0), at = X.swarm_frame_ptr() / 4, o = f32(), nn = o[at], nb = o[at + 1], [depth, color] = targets.get(px);
    dev.queue.writeBuffer(ubuf, 0, new Float32Array([2 / S, 2 / S, px / S, 0])); dev.queue.writeBuffer(e.buf, 0, o, at, len);
    const enc = dev.createCommandEncoder(), p = enc.beginRenderPass({ colorAttachments: [{ view: color, resolveTarget: e.ctx.getCurrentTexture().createView(), loadOp: 'clear', clearValue: [0, 0, 0, 0], storeOp: 'discard' }], depthStencilAttachment: { view: depth, depthLoadOp: 'clear', depthClearValue: 1, depthStoreOp: 'discard' } });
    p.setPipeline(P[0]); p.setBindGroup(0, e.bind); p.setVertexBuffer(1, e.buf, 16); e.nodes.forEach((n, i) => { p.setVertexBuffer(0, n.skin.buf); p.draw(n.skin.count, 1, 0, i); });
    p.setPipeline(P[2]); p.setBindGroup(0, only[1]); p.setVertexBuffer(0, e.buf, 16 + nn * 344); p.draw(6, nb);
    p.setPipeline(P[1]); p.setBindGroup(0, only[0]); p.setVertexBuffer(0, e.buf, 16 + nn * 56); p.draw(1536, nn * 4);
    p.end(); dev.queue.submit([enc.finish()]); return true; }
  return { tile, say, drop };
}
