import AppKit
import Foundation

/// Full-frame 9:16 caption plate (Apple SD Gothic Neo). Used because this
/// Homebrew ffmpeg has overlay but no drawtext — capcut-cli render cannot burn
/// Korean text itself.

struct Opts {
  var text = ""
  var badge: String?
  var out = ""
  var width = 1080
  var height = 1920
  /// Distance from the frame bottom to the caption pill (AppKit Y).
  /// 720 sits above Naver Clip + Shopping Connect product card (~30% chrome).
  var safeBottom = 720
}

func parseArgs() -> Opts {
  var opts = Opts()
  var args = Array(CommandLine.arguments.dropFirst())
  while !args.isEmpty {
    let key = args.removeFirst()
    guard key.hasPrefix("--"), !args.isEmpty else { continue }
    let value = args.removeFirst()
    switch key {
    case "--text": opts.text = value
    case "--badge": opts.badge = value
    case "--out": opts.out = value
    case "--width": opts.width = Int(value) ?? opts.width
    case "--height": opts.height = Int(value) ?? opts.height
    case "--safe-bottom": opts.safeBottom = Int(value) ?? opts.safeBottom
    default: break
    }
  }
  return opts
}

func font(named names: [String], size: CGFloat) -> NSFont {
  for name in names {
    if let found = NSFont(name: name, size: size) { return found }
  }
  return NSFont.boldSystemFont(ofSize: size)
}

func wrapLine(_ text: String, font: NSFont, maxWidth: CGFloat) -> String {
  let attrs: [NSAttributedString.Key: Any] = [.font: font]
  var lines: [String] = []
  var current = ""
  for ch in text {
    let trial = current + String(ch)
    let width = NSAttributedString(string: trial, attributes: attrs).size().width
    if width > maxWidth && !current.isEmpty {
      lines.append(current)
      current = String(ch)
    } else {
      current = trial
    }
  }
  if !current.isEmpty { lines.append(current) }
  return lines.joined(separator: "\n")
}

func drawPill(text: String, font: NSFont, in ctx: NSGraphicsContext, origin: NSPoint) -> NSSize {
  let paragraph = NSMutableParagraphStyle()
  paragraph.alignment = .center
  paragraph.lineSpacing = 4
  let attrs: [NSAttributedString.Key: Any] = [
    .font: font,
    .foregroundColor: NSColor.white,
    .paragraphStyle: paragraph,
  ]
  let attr = NSAttributedString(string: text, attributes: attrs)
  let textSize = attr.size()
  let padX: CGFloat = 22
  let padY: CGFloat = 12
  let box = NSRect(
    x: origin.x,
    y: origin.y,
    width: ceil(textSize.width) + padX * 2,
    height: ceil(textSize.height) + padY * 2
  )
  NSColor.black.withAlphaComponent(0.55).setFill()
  NSBezierPath(roundedRect: box, xRadius: 14, yRadius: 14).fill()
  attr.draw(at: NSPoint(x: box.minX + padX, y: box.minY + padY - 1))
  return box.size
}

let opts = parseArgs()
guard !opts.text.isEmpty, !opts.out.isEmpty else {
  FileHandle.standardError.write(Data("usage: render-caption-plate.swift --text <s> --out <png> [--badge <s>] [--safe-bottom 720]\n".utf8))
  exit(2)
}

guard let rep = NSBitmapImageRep(
  bitmapDataPlanes: nil,
  pixelsWide: opts.width,
  pixelsHigh: opts.height,
  bitsPerSample: 8,
  samplesPerPixel: 4,
  hasAlpha: true,
  isPlanar: false,
  colorSpaceName: .deviceRGB,
  bytesPerRow: 0,
  bitsPerPixel: 0
) else {
  FileHandle.standardError.write(Data("failed to allocate bitmap\n".utf8))
  exit(1)
}
rep.size = NSSize(width: opts.width, height: opts.height)

guard let ctx = NSGraphicsContext(bitmapImageRep: rep) else {
  FileHandle.standardError.write(Data("failed to create graphics context\n".utf8))
  exit(1)
}
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = ctx
ctx.imageInterpolation = .high

NSColor.clear.setFill()
NSRect(x: 0, y: 0, width: opts.width, height: opts.height).fill()

let captionFont = font(
  named: ["AppleSDGothicNeo-Bold", "Apple SD Gothic Neo Bold", "AppleSDGothicNeo-SemiBold"],
  size: 52
)
let wrapped = wrapLine(opts.text, font: captionFont, maxWidth: CGFloat(opts.width) - 96)
let captionSize = NSAttributedString(
  string: wrapped,
  attributes: [.font: captionFont]
).size()
let captionOrigin = NSPoint(
  x: max(24, (CGFloat(opts.width) - (captionSize.width + 44)) / 2),
  y: CGFloat(opts.safeBottom)
)
_ = drawPill(text: wrapped, font: captionFont, in: ctx, origin: captionOrigin)

if let badge = opts.badge, !badge.isEmpty {
  let badgeFont = font(
    named: ["AppleSDGothicNeo-Medium", "Apple SD Gothic Neo Medium", "AppleSDGothicNeo-Bold"],
    size: 22
  )
  _ = drawPill(
    text: badge,
    font: badgeFont,
    in: ctx,
    origin: NSPoint(x: 24, y: CGFloat(opts.height) - 72)
  )
}

NSGraphicsContext.restoreGraphicsState()

guard let png = rep.representation(using: .png, properties: [:]) else {
  FileHandle.standardError.write(Data("failed to encode PNG\n".utf8))
  exit(1)
}

do {
  try png.write(to: URL(fileURLWithPath: opts.out))
} catch {
  FileHandle.standardError.write(Data("write failed: \(error)\n".utf8))
  exit(1)
}
