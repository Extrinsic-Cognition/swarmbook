// film-frames.swift: THE FILM'S FRAMES at the seconds asked, as small JPEGs, to read a shot by eye (first for THE FOLD, Oct 14 2026: where
// the fight is in "over Athena's shoulder, down at the fight", 29.563 to 33.567 s, so the window can follow it; his words, 18:47 WEST: "THE
// DODECAHEDRON IS VISUALLY SEEN TO BE SHRINKING AND FOLLOWING THE BATTLE").
// AVAssetImageGenerator with no tolerance (the exact frame at each second), scaled to `width` px wide; one file a second asked, named by its
// milliseconds, and one line printed for each: seconds, a tab, the file. The pictures are the film's: keep them out of git.
//   swiftc -O film-frames.swift -o film-frames && ./film-frames saint-seiya.mp4 out/ 29.4 38.2 0.2 [width 480]
// COST: one frame decode and one JPEG a second asked (45 for 29.4 to 38.2 s at 0.2 s); run it on the new Mac.
import AVFoundation
import Foundation
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count >= 6, let t0 = Double(args[3]), let t1 = Double(args[4]), let step = Double(args[5]), step > 0 else {
  FileHandle.standardError.write("usage: film-frames <film.mp4> <outdir> <t0> <t1> <step> [width]\n".data(using: .utf8)!); exit(2)
}
let width = args.count > 6 ? Double(args[6]) ?? 480 : 480
let out = URL(fileURLWithPath: args[2], isDirectory: true)
try? FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)
let generator = AVAssetImageGenerator(asset: AVURLAsset(url: URL(fileURLWithPath: args[1])))
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width: width, height: width)
var k = 0
while t0 + Double(k) * step <= t1 + 1e-9 {
  let t = t0 + Double(k) * step
  k += 1
  guard let image = try? generator.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 30000), actualTime: nil) else { continue }
  let name = String(format: "%06d.jpg", Int((t * 1000).rounded()))
  guard let file = CGImageDestinationCreateWithURL(out.appendingPathComponent(name) as CFURL, UTType.jpeg.identifier as CFString, 1, nil) else { continue }
  CGImageDestinationAddImage(file, image, [kCGImageDestinationLossyCompressionQuality: 0.85] as CFDictionary)
  if CGImageDestinationFinalize(file) { print(String(format: "%.3f\t", t) + name) }
}
