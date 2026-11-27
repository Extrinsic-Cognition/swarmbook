// film-matte.swift: THE SACRIFICE'S MATTE, the one who intercepts the hit lifted off the film's frames, for lab/sacrifice.js (his words, Oct 15
// 2026 00:27 WEST, over the hero at about 10.8 s: "i need you to segment out and enhance the sacrifice here again of aiolos one second time:
// (the guy that savees the hit)"; his tag at 10.835 s: "THIS MOMENT IS FUCKING CRITICAL DUDE! THIS IS THE MOMENT OF SACRIFICE!!!!").
// AVAssetImageGenerator takes each frame asked at its own time (no tolerance; frame n at n x 1001 / 30000 s), Apple Vision's
// VNGenerateForegroundInstanceMaskRequest (macOS 14+) lifts the foreground figures of it, and the instance under the point asked (--at x,y,
// fractions of the frame from its top left; the figure's chest, centre-right) is the matte: its soft mask at the frame's size. Per frame it
// writes f<n>.mask.png (8-bit gray, the mask alone: no film pixel in it) and f<n>.cut.png (the frame through the mask, to judge it by eye;
// the film's pixels: keep it out of git), and prints one line: the frame, its second, every instance Vision found (its share of the frame
// and its box) and the one picked.
// WHAT VISION GAVE ON THE SACRIFICE (Oct 15 2026 00:4x WEST, frames 316 to 330 of saint-seiya.mp4 ?v=53561d47): one instance a frame, always
// under the point. On 316 to 318 (he flies in, a motion-blurred streak) that instance is one blob of him, Seiya behind him and the purple cliff
// over his head: no matte of him alone is in those frames. From 319 he stands with his arms spread, ONE HELD CEL to 330 (the same drawing in
// every frame; only the blast's light on him changes): Vision lifts him whole on 319, 320, 322, 323, 327, 328 and 330; takes the cliff over his
// head on 321 and Seiya's hair at his left on 319 to 321; loses his legs to the strike's flash on 324 to 326 and 329 (the box drops to 167
// px tall). So THE MATTE IS THE HELD CEL'S: --union 327,328,330 makes every frame's matte the union of those frames' masks (the clean ones:
// him whole, nothing of Seiya or the cliff), --fill fills the holes a mask leaves inside the figure (the boots' dark), and the frames 316 to
// 318 are left out. Keying by colour was not needed: the bronze, the silver cloth and the pink hair never had to be told from the red.
// --sheet <png> packs the matte(s) into one sprite sheet (a gray+alpha PNG: white, the matte as its alpha, so a page draws it as the silhouette
// and masks with it; the cells the union box of the masks padded by --pad, at --scale of the film's pixels, --cols a row; with --union there
// is one cell, the one matte) and prints the JSON lab/sacrifice.js carries for it. No film pixel is in it.
//   swiftc -O film-matte.swift -o film-matte && ./film-matte saint-seiya.mp4 out/ 319 330 --union 327,328,330 --fill \
//     --sheet ../lab/sacrifice-masks.png --scale 1 --pad 4           [--at 0.68,0.62] [--at 321=0.7,0.6] [--cols 5]
// COST: one frame decode and one Vision request a frame (about 0.25 s each on this Mac); 12 frames for the sacrifice. Run it niced.
import AVFoundation
import Foundation
import ImageIO
import UniformTypeIdentifiers
import Vision

let FPS = 30000.0 / 1001.0
var args = CommandLine.arguments.dropFirst().map { $0 }
var at = (x: 0.68, y: 0.62), atFor: [Int: (x: Double, y: Double)] = [:]
var sheet: String? = nil, scale = 0.5, pad = 6, cols = 5, union: [Int] = [], fill = false
if let i = args.firstIndex(of: "--fill") { fill = true; args.remove(at: i) }
func take(_ flag: String) -> String? {
  guard let i = args.firstIndex(of: flag), i + 1 < args.count else { return nil }
  let v = args[i + 1]; args.removeSubrange(i...(i + 1)); return v
}
func point(_ s: String) -> (x: Double, y: Double)? {
  let p = s.split(separator: ",").compactMap { Double($0) }
  return p.count == 2 ? (p[0], p[1]) : nil
}
while let v = take("--at") {
  if let eq = v.firstIndex(of: "="), let n = Int(v[..<eq]), let p = point(String(v[v.index(after: eq)...])) { atFor[n] = p }
  else if let p = point(v) { at = p }
}
if let v = take("--sheet") { sheet = v }
if let v = take("--scale"), let d = Double(v) { scale = d }
if let v = take("--pad"), let d = Int(v) { pad = d }
if let v = take("--cols"), let d = Int(v) { cols = max(1, d) }
if let v = take("--union") { union = v.split(separator: ",").compactMap { Int($0) } }
guard args.count >= 4, let from = Int(args[2]), let to = Int(args[3]), from <= to else {
  FileHandle.standardError.write("usage: film-matte <film.mp4> <outdir> <from frame> <to frame> [--at x,y] [--at n=x,y] [--union a,b,c] [--fill] [--sheet out.png --scale 0.5 --pad 6 --cols 5]\n".data(using: .utf8)!)
  exit(2)
}
let out = URL(fileURLWithPath: args[1], isDirectory: true)
try? FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)
let generator = AVAssetImageGenerator(asset: AVURLAsset(url: URL(fileURLWithPath: args[0])))
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero
generator.appliesPreferredTrackTransform = true

func png(_ image: CGImage, _ url: URL) -> Bool {
  guard let file = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil) else { return false }
  CGImageDestinationAddImage(file, image, nil)
  return CGImageDestinationFinalize(file)
}
func gray(_ bytes: [UInt8], _ w: Int, _ h: Int) -> CGImage? {
  guard let provider = CGDataProvider(data: Data(bytes) as CFData) else { return nil }
  return CGImage(width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 8, bytesPerRow: w, space: CGColorSpaceCreateDeviceGray(),
    bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.none.rawValue), provider: provider, decode: nil, shouldInterpolate: false, intent: .defaultIntent)
}
/// gray with alpha: white, the mask as its alpha (two channels: the PNG is the mask's own size and no more)
func grayAlpha(_ alpha: [UInt8], _ w: Int, _ h: Int) -> CGImage? {
  var bytes = [UInt8](repeating: 255, count: w * h * 2)
  for i in 0..<(w * h) { bytes[i * 2 + 1] = alpha[i] }
  guard let provider = CGDataProvider(data: Data(bytes) as CFData) else { return nil }
  return CGImage(width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 16, bytesPerRow: w * 2, space: CGColorSpaceCreateDeviceGray(),
    bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.last.rawValue), provider: provider, decode: nil, shouldInterpolate: false, intent: .defaultIntent)
}
func rgba(_ bytes: [UInt8], _ w: Int, _ h: Int) -> CGImage? {
  guard let provider = CGDataProvider(data: Data(bytes) as CFData) else { return nil }
  return CGImage(width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: w * 4, space: CGColorSpaceCreateDeviceRGB(),
    bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.last.rawValue), provider: provider, decode: nil, shouldInterpolate: false, intent: .defaultIntent)
}
/// the frame's pixels as RGBA, row by row from the top
func pixels(_ image: CGImage) -> [UInt8] {
  let w = image.width, h = image.height
  var bytes = [UInt8](repeating: 0, count: w * h * 4)
  bytes.withUnsafeMutableBytes { raw in
    guard let ctx = CGContext(data: raw.baseAddress, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4, space: CGColorSpaceCreateDeviceRGB(),
      bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else { return }
    ctx.draw(image, in: CGRect(x: 0, y: 0, width: w, height: h))
  }
  return bytes
}
/// a one-component pixel buffer read as rows from the top: (width, height, value at x, y in 0...1)
func plane(_ buffer: CVPixelBuffer) -> (w: Int, h: Int, at: (Int, Int) -> Double) {
  CVPixelBufferLockBaseAddress(buffer, .readOnly)
  let w = CVPixelBufferGetWidth(buffer), h = CVPixelBufferGetHeight(buffer), stride = CVPixelBufferGetBytesPerRow(buffer)
  let base = CVPixelBufferGetBaseAddress(buffer)!
  let format = CVPixelBufferGetPixelFormatType(buffer)
  if format == kCVPixelFormatType_OneComponent32Float {
    let f = base.assumingMemoryBound(to: UInt8.self)
    return (w, h, { x, y in Double(UnsafeRawPointer(f + y * stride + x * 4).load(as: Float.self)) })
  }
  let b = base.assumingMemoryBound(to: UInt8.self)
  return (w, h, { x, y in Double(b[y * stride + x]) / 255 })
}

struct Matte { let n: Int; var mask: [UInt8]; let w: Int; let h: Int; var box: (x0: Int, y0: Int, x1: Int, y1: Int)?; let pix: [UInt8] }
/// the box of the mask's pixels at or over half, or nil
func boxOf(_ mask: [UInt8], _ W: Int, _ H: Int) -> (x0: Int, y0: Int, x1: Int, y1: Int)? {
  var bx0 = W, by0 = H, bx1 = -1, by1 = -1
  for y in 0..<H { for x in 0..<W where mask[y * W + x] >= 128 { bx0 = min(bx0, x); by0 = min(by0, y); bx1 = max(bx1, x); by1 = max(by1, y) } }
  return bx1 >= 0 ? (bx0, by0, bx1, by1) : nil
}
/// THE FILL: a dark pixel of the mask that no path of dark pixels joins to the frame's border is a hole inside the figure (the boots' dark,
/// a fold): it is filled. A flood from the border over the dark pixels; what it does not reach is filled.
func fillHoles(_ mask: inout [UInt8], _ W: Int, _ H: Int) -> Int {
  var seen = [Bool](repeating: false, count: W * H), stack: [Int] = []
  let dark = mask.map { $0 < 128 }
  for x in 0..<W { for y in [0, H - 1] { let i = y * W + x; if dark[i] && !seen[i] { seen[i] = true; stack.append(i) } } }
  for y in 0..<H { for x in [0, W - 1] { let i = y * W + x; if dark[i] && !seen[i] { seen[i] = true; stack.append(i) } } }
  while let i = stack.popLast() {
    let x = i % W, y = i / W
    for (dx, dy) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
      let nx = x + dx, ny = y + dy
      if nx < 0 || ny < 0 || nx >= W || ny >= H { continue }
      let j = ny * W + nx
      if dark[j] && !seen[j] { seen[j] = true; stack.append(j) }
    }
  }
  var filled = 0, holes: [Int] = []
  for i in 0..<(W * H) where dark[i] && !seen[i] { mask[i] = 255; filled += 1; holes.append(i) }
  // the soft ring the mask's edge left round each hole (values between): closed within 3 px of a filled pixel
  for i in holes { let x = i % W, y = i / W
    for dy in -3...3 { for dx in -3...3 where dx * dx + dy * dy <= 9 {
      let nx = x + dx, ny = y + dy
      if nx >= 0 && ny >= 0 && nx < W && ny < H && !dark[ny * W + nx] { mask[ny * W + nx] = 255 }
    } } }
  return filled
}
var mattes: [Matte] = []
for n in from...to {
  let t = Double(n) / FPS
  let time = CMTime(value: CMTimeValue(n) * 1001, timescale: 30000)
  var actual = CMTime.zero
  guard let image = try? generator.copyCGImage(at: time, actualTime: &actual) else { print("f\(n)\t\(String(format: "%.3f", t))\tno frame"); continue }
  let W = image.width, H = image.height
  let handler = VNImageRequestHandler(cgImage: image, options: [:])
  let request = VNGenerateForegroundInstanceMaskRequest()
  do { try handler.perform([request]) } catch { print("f\(n)\t\(String(format: "%.3f", t))\tVision failed: \(error)"); continue }
  guard let found = request.results?.first else { print("f\(n)\t\(String(format: "%.3f", t))\tno foreground"); continue }
  // every instance: its share of the frame and its box, read off the label plane (0 is the background)
  let labels = plane(found.instanceMask)
  var count = [Int](repeating: 0, count: 256), x0 = [Int](repeating: Int.max, count: 256), y0 = [Int](repeating: Int.max, count: 256), x1 = [Int](repeating: -1, count: 256), y1 = [Int](repeating: -1, count: 256)
  for y in 0..<labels.h { for x in 0..<labels.w {
    let v = Int(labels.at(x, y) * 255 + 0.5)
    count[v] += 1; x0[v] = min(x0[v], x); y0[v] = min(y0[v], y); x1[v] = max(x1[v], x); y1[v] = max(y1[v], y)
  } }
  let p = atFor[n] ?? at
  let px = min(labels.w - 1, max(0, Int(p.x * Double(labels.w)))), py = min(labels.h - 1, max(0, Int(p.y * Double(labels.h))))
  var picked = Int(labels.at(px, py) * 255 + 0.5)
  let total = Double(labels.w * labels.h), sx = Double(W) / Double(labels.w), sy = Double(H) / Double(labels.h)
  var words: [String] = []
  for v in found.allInstances.sorted() where count[v] > 0 {
    words.append(String(format: "#%d %.1f%% [%d,%d %dx%d]%@", v, 100 * Double(count[v]) / total, Int(Double(x0[v]) * sx), Int(Double(y0[v]) * sy),
      Int(Double(x1[v] - x0[v] + 1) * sx), Int(Double(y1[v] - y0[v] + 1) * sy), v == picked ? " <- at the point" : ""))
  }
  if picked == 0 {   // the point is on the background: the largest instance whose box holds the point's column, else none
    var best = 0, bestCount = 0
    for v in found.allInstances where count[v] > bestCount && x0[v] <= px && px <= x1[v] { best = v; bestCount = count[v] }
    picked = best
    if picked != 0 { words.append("the point is on the background: #\(picked) taken, the largest under it") }
  }
  guard picked != 0, let soft = try? found.generateScaledMaskForImage(forInstances: IndexSet(integer: picked), from: handler) else {
    print("f\(n)\t\(String(format: "%.3f", t))\t\(found.allInstances.count) instances: \(words.joined(separator: "; "))\tNONE PICKED")
    continue
  }
  let m = plane(soft)
  var mask = [UInt8](repeating: 0, count: W * H)
  var bx0 = W, by0 = H, bx1 = -1, by1 = -1
  for y in 0..<H { for x in 0..<W {
    let v = min(1, max(0, m.at(min(m.w - 1, x * m.w / W), min(m.h - 1, y * m.h / H))))
    mask[y * W + x] = UInt8(v * 255 + 0.5)
    if v >= 0.5 { bx0 = min(bx0, x); by0 = min(by0, y); bx1 = max(bx1, x); by1 = max(by1, y) }
  } }
  let box: (x0: Int, y0: Int, x1: Int, y1: Int)? = bx1 >= 0 ? (bx0, by0, bx1, by1) : nil
  mattes.append(Matte(n: n, mask: mask, w: W, h: H, box: box, pix: pixels(image)))
  let share = Double(count[picked]) / total
  print("f\(n)\t\(String(format: "%.3f", t))\t\(found.allInstances.count) instances: \(words.joined(separator: "; "))\tpicked #\(picked) \(String(format: "%.1f%%", 100 * share))" +
    (box.map { " box [\($0.x0),\($0.y0) \($0.x1 - $0.x0 + 1)x\($0.y1 - $0.y0 + 1)]" } ?? " empty"))
}

// THE HELD CEL (--union): every frame's matte becomes the union of the masks of the frames named, the clean ones
if !union.isEmpty, let first = mattes.first {
  let W = first.w, H = first.h
  var u = [UInt8](repeating: 0, count: W * H), found: [Int] = []
  for m in mattes where union.contains(m.n) { found.append(m.n); for i in 0..<(W * H) { u[i] = max(u[i], m.mask[i]) } }
  guard found.count == union.count else { print("the union asks for frames not matted: \(union.filter { !found.contains($0) })"); exit(1) }
  for k in mattes.indices { mattes[k].mask = u; mattes[k].box = boxOf(u, W, H) }
  print("the held cel: the union of \(found) is the matte of every frame" + (first.box.map { _ in "" } ?? ""))
}
if fill {
  for k in mattes.indices {
    let n = fillHoles(&mattes[k].mask, mattes[k].w, mattes[k].h)
    mattes[k].box = boxOf(mattes[k].mask, mattes[k].w, mattes[k].h)
    if union.isEmpty || k == 0 { print("f\(mattes[k].n): \(n) hole pixels filled") }
  }
}
for m in mattes {
  if let g = gray(m.mask, m.w, m.h) { _ = png(g, out.appendingPathComponent("f\(m.n).mask.png")) }
  var cut = m.pix
  for i in 0..<(m.w * m.h) { cut[i * 4 + 3] = m.mask[i] }
  if let c = rgba(cut, m.w, m.h) { _ = png(c, out.appendingPathComponent("f\(m.n).cut.png")) }
}
if let b = mattes.first?.box, !union.isEmpty { print("the matte's box [\(b.x0),\(b.y0) \(b.x1 - b.x0 + 1)x\(b.y1 - b.y0 + 1)]") }

// THE SHEET: the masks of every frame (with --union, the one matte), each in a cell the size of the union box (padded), scaled, in rows of `cols`
if let sheet = sheet, let first = mattes.first {
  let W = first.w, H = first.h
  let cellsOf = union.isEmpty ? mattes : [first]
  var ux0 = W, uy0 = H, ux1 = -1, uy1 = -1
  for m in mattes { if let b = m.box { ux0 = min(ux0, b.x0); uy0 = min(uy0, b.y0); ux1 = max(ux1, b.x1); uy1 = max(uy1, b.y1) } }
  guard ux1 >= 0 else { print("no mask to pack"); exit(1) }
  ux0 = max(0, ux0 - pad); uy0 = max(0, uy0 - pad); ux1 = min(W - 1, ux1 + pad); uy1 = min(H - 1, uy1 + pad)
  let bw = ux1 - ux0 + 1, bh = uy1 - uy0 + 1
  let cw = Int((Double(bw) * scale).rounded(.up)), ch = Int((Double(bh) * scale).rounded(.up))
  let cols = min(cols, cellsOf.count), rows = (cellsOf.count + cols - 1) / cols
  let SW = cw * cols, SH = ch * rows
  var bytes = [UInt8](repeating: 0, count: SW * SH)
  for (k, m) in cellsOf.enumerated() {
    let cx = (k % cols) * cw, cy = (k / cols) * ch
    for y in 0..<ch { for x in 0..<cw {
      // the mean of the film pixels under this cell pixel (a box filter: a half-res cell averages 2 x 2)
      let fx0 = ux0 + Int(Double(x) / scale), fx1 = min(ux1, ux0 + Int(Double(x + 1) / scale) - 1)
      let fy0 = uy0 + Int(Double(y) / scale), fy1 = min(uy1, uy0 + Int(Double(y + 1) / scale) - 1)
      var sum = 0, cnt = 0
      for fy in fy0...max(fy0, fy1) { for fx in fx0...max(fx0, fx1) { sum += Int(m.mask[fy * W + fx]); cnt += 1 } }
      bytes[(cy + y) * SW + cx + x] = UInt8(sum / max(1, cnt))
    } }
  }
  guard let g = grayAlpha(bytes, SW, SH), png(g, URL(fileURLWithPath: sheet)) else { print("the sheet was not written"); exit(1) }
  let size = (try? FileManager.default.attributesOfItem(atPath: sheet)[.size] as? Int) ?? 0
  let frames = mattes.map { String($0.n) }.joined(separator: ", ")
  print("sheet \(sheet): \(SW)x\(SH), \(size) bytes, \(cellsOf.count) cell(s) of \(cw)x\(ch) in rows of \(cols)")
  print("{\"film\": [\(W), \(H)], \"frames\": [\(frames)], \"box\": [\(ux0), \(uy0), \(bw), \(bh)], \"scale\": \(scale), \"cells\": \(cellsOf.count), \"cols\": \(cols), \"cell\": [\(cw), \(ch)], \"sheet\": [\(SW), \(SH)]}")
}
