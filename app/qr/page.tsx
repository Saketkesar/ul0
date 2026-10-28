"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CopyField } from "@/components/copy-field"
import {
  QrCode,
  Download,
  Link2,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react"
import QRCode from "qrcode"
import { toast } from "sonner"

export default function QrPage() {
  const [content, setContent] = useState("https://ul0.site")
  const [fgColor, setFgColor] = useState("#0B1412")
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M")
  const [qrSize, setQrSize] = useState(400)
  const [isTrackable, setIsTrackable] = useState(false)
  const [trackableShortUrl, setTrackableShortUrl] = useState<string | null>(null)
  const [isCreatingTrackable, setIsCreatingTrackable] = useState(false)
  const [qrPngUrl, setQrPngUrl] = useState<string>("")
  const [qrSvgString, setQrSvgString] = useState<string>("")

  // Calculate approximate contrast ratio
  const calculateLuminance = (hex: string) => {
    const clean = hex.replace("#", "")
    if (clean.length !== 6) return 0.5
    const r = parseInt(clean.substring(0, 2), 16) / 255
    const g = parseInt(clean.substring(2, 4), 16) / 255
    const b = parseInt(clean.substring(4, 6), 16) / 255
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lumFg = calculateLuminance(fgColor)
  const lumBg = calculateLuminance(bgColor)
  const contrastRatio =
    (Math.max(lumFg, lumBg) + 0.05) / (Math.min(lumFg, lumBg) + 0.05)
  const isLowContrast = contrastRatio < 3.0

  // Regenerate QR on parameters change
  useEffect(() => {
    const targetContent = trackableShortUrl || content
    if (!targetContent.trim()) return

    try {
      QRCode.toDataURL(targetContent, {
        width: qrSize,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: { dark: fgColor, light: bgColor },
      }).then(setQrPngUrl)

      QRCode.toString(targetContent, {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: { dark: fgColor, light: bgColor },
      }).then(setQrSvgString)
    } catch (err) {
      console.error("QR generation error:", err)
    }
  }, [content, fgColor, bgColor, errorLevel, qrSize, trackableShortUrl])

  const handleCreateTrackable = async () => {
    if (!content.trim()) return
    setIsCreatingTrackable(true)

    try {
      let target = content.trim()
      if (!/^https?:\/\//i.test(target)) {
        target = `https://${target}`
      }

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl: target }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create trackable link")

      setTrackableShortUrl(data.shortUrl)
      setIsTrackable(true)
      toast.success("Trackable short link created for QR code")
    } catch (err: any) {
      toast.error(err.message || "Failed to create trackable link")
    } finally {
      setIsCreatingTrackable(false)
    }
  }

  const downloadSvg = () => {
    if (!qrSvgString) return
    const blob = new Blob([qrSvgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ul0-qr.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
          {/* Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Vector QR Code Studio
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Create high-resolution PNG and SVG vector QR codes. Processed client-side in your browser.
            </p>
          </div>

          {/* Working Tool Above The Fold */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls Column (7 cols) */}
            <div className="lg:col-span-7 rounded-lg border border-border bg-card p-5 sm:p-6 space-y-5">
              {/* Target Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Target URL or Content
                </label>
                <Input
                  type="text"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                    setTrackableShortUrl(null)
                    setIsTrackable(false)
                  }}
                  placeholder="https://example.com/menu or your message"
                  className="font-mono text-xs"
                />
              </div>

              {/* Trackable Link Button */}
              <div className="p-3.5 rounded-md border border-border bg-muted/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">Dynamic Trackable QR</h4>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      Points your code to a short link so you can update the destination anytime without reprinting.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={isTrackable ? "secondary" : "outline"}
                    size="sm"
                    onClick={handleCreateTrackable}
                    disabled={isCreatingTrackable || !content.trim()}
                    className="text-xs shrink-0"
                  >
                    {isCreatingTrackable ? "Connecting..." : isTrackable ? "Connected" : "Make Trackable"}
                  </Button>
                </div>
                {trackableShortUrl && (
                  <CopyField value={trackableShortUrl} label="Short Link" size="sm" />
                )}
              </div>

              {/* Color Customization */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Foreground Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-8 w-10 rounded border border-border cursor-pointer bg-transparent"
                    />
                    <Input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-8 w-10 rounded border border-border cursor-pointer bg-transparent"
                    />
                    <Input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Error Correction Level */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Error Correction</label>
                  <select
                    value={errorLevel}
                    onChange={(e) => setErrorLevel(e.target.value as any)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="L">Level L (7% recovery, best density)</option>
                    <option value="M">Level M (15% recovery, recommended)</option>
                    <option value="Q">Level Q (25% recovery, high durability)</option>
                    <option value="H">Level H (30% recovery, maximum safety)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Export Resolution</label>
                  <select
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value={300}>300 x 300 px (Digital / Screen)</option>
                    <option value={600}>600 x 600 px (Standard Print)</option>
                    <option value={1200}>1200 x 1200 px (High-DPI Packaging)</option>
                  </select>
                </div>
              </div>

              {/* Contrast Warning */}
              {isLowContrast && (
                <div className="p-3 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>
                    Contrast ratio is {contrastRatio.toFixed(1)}:1 (minimum 3:1 recommended). Low contrast can prevent phone cameras from scanning.
                  </span>
                </div>
              )}
            </div>

            {/* Right Preview Column (5 cols) */}
            <div className="lg:col-span-5 rounded-lg border border-border bg-card p-5 sm:p-6 space-y-5 text-center">
              <div className="text-xs font-semibold text-foreground text-left">Real-Time Vector Preview</div>

              <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg border border-border">
                {qrPngUrl ? (
                  <img
                    src={qrPngUrl}
                    alt="Generated QR code"
                    className="w-52 h-52 object-contain rounded"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-xs text-muted-foreground font-mono">
                    Generating...
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="w-full text-xs font-semibold gap-1.5"
                    disabled={!qrPngUrl}
                  >
                    <a href={qrPngUrl} download="ul0-qr.png">
                      <Download className="h-3.5 w-3.5" />
                      <span>Download PNG</span>
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadSvg}
                    disabled={!qrSvgString}
                    className="w-full text-xs font-semibold gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download SVG</span>
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  SVG format scales infinitely without pixelation. Ideal for Adobe Illustrator, menus, and billboards.
                </p>
              </div>
            </div>
          </div>

          {/* Explanatory Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Print &amp; Vector Clarity</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When printing QR codes on business cards, menus, or posters, always prefer vector SVG
                exports to avoid fuzzy edges caused by raster image scaling.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Error Correction Levels</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Level M (15%) is optimal for digital displays. Level H (30%) is recommended for outdoor
                surfaces or stickers that may suffer from scratches, dirt, or partial occlusion.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Static vs Dynamic Codes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Static codes encode the full raw URL directly and cannot be modified. Dynamic codes route
                through a short link, allowing you to update the destination URL without reprinting.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
