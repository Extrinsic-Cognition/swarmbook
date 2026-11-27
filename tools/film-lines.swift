// film-lines.swift: THE FILM'S SPOKEN LINES, read off its burned-in subtitles by Apple Vision, for tools/satellites-score.mjs --subtitles.
// His words, Oct 14 2026 18:32 WEST: the satellites must react "to what is being said". The sound alone misses a shout under the music
// ("Pegasus Ryu Sei Ken!", 104.25 to 106 s), so the words' own clock is read where the film writes it: the bottom of its picture.
// AVAssetImageGenerator takes the frame at each step (no tolerance), the bottom `band` of the picture is cropped, and a VNRecognizeTextRequest
// (accurate, with language correction) reads it. Prints one line a read: seconds, a tab, the text read (empty when none).
// The text is the film's: keep the output out of git; satellites-score.mjs keeps only each line's times and weight.
//   swiftc -O film-lines.swift -o film-lines && ./film-lines saint-seiya.mp4 [step 0.25] [band 0.24] > lines.tsv
// COST: 618 reads at 0.25 s over the 154.3 s film, each a frame decode and one Vision request; run it on the new Mac.
import AVFoundation
import Foundation
import Vision

let args = CommandLine.arguments
guard args.count >= 2 else { FileHandle.standardError.write("usage: film-lines <film.mp4> [step] [band]\n".data(using: .utf8)!); exit(2) }
let step = args.count > 2 ? Double(args[2]) ?? 0.25 : 0.25
let band = args.count > 3 ? Double(args[3]) ?? 0.24 : 0.24
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let generator = AVAssetImageGenerator(asset: asset)
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero
generator.appliesPreferredTrackTransform = true
let duration = CMTimeGetSeconds(asset.duration)
var t = 0.0
while t < duration {
  var text = ""
  if let image = try? generator.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 30000), actualTime: nil) {
    let top = Int(Double(image.height) * (1 - band))
    if let crop = image.cropping(to: CGRect(x: 0, y: top, width: image.width, height: image.height - top)) {
      let request = VNRecognizeTextRequest()
      request.recognitionLevel = .accurate
      request.usesLanguageCorrection = true
      try? VNImageRequestHandler(cgImage: crop, options: [:]).perform([request])
      text = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator: " ")
    }
  }
  print(String(format: "%.3f\t", t) + text.replacingOccurrences(of: "\t", with: " "))
  t += step
}
