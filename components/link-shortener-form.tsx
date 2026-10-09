"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, ExternalLink, Share2, Loader2, Leaf, Zap, Heart, QrCode } from "lucide-react"
import { isValidUrl, validateUrl } from "@/lib/utils/slug"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { LinkResultAd } from "@/components/link-result-ad"
import QRCode from "qrcode"

// Calculate carbon savings from short links
// Average URL: ~75 characters, Short URL: ~20 characters
// Data transfer: ~0.06g CO2 per KB (rough estimate)
const calculateCarbonSaved = (originalUrlLength: number, clicks: number = 100) => {
  const charsSaved = Math.max(0, originalUrlLength - 20)
  const bytesSaved = charsSaved * clicks
  const kbSaved = bytesSaved / 1024
  const co2SavedGrams = kbSaved * 0.06
  return { bytesSaved, co2SavedGrams }
}

// Rotating green facts shown on the card
const GREEN_FACTS = [
  "The internet uses ~416.2 TWh of electricity per year — more than the UK.",
  "Every byte saved reduces data center load and cooling energy worldwide.",
  "Short links load faster on slow networks, lowering device energy use.",
  "A typical data center uses 1–2% of global electricity consumption.",
  "Shorter URLs mean fewer bytes sent across undersea fiber cables.",
  "Link shortening can reduce URL payload size by up to 90%.",
  "Global internet traffic generates ~3.7% of greenhouse gas emissions.",
  "Lighter pages = less GPU rendering = less heat = less fan energy.",
]

export function LinkShortenerForm() {
  const { isSignedIn } = useAuth()
  const [result, setResult] = useState<{ id?: string; slug?: string } | null>(null)
  const [longUrl, setLongUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animStep, setAnimStep] = useState(0) // 0=idle 1=compressing 2=done
  const [displayUrl, setDisplayUrl] = useState("") // animated URL display
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [carbonSaved, setCarbonSaved] = useState<{ bytesSaved: number; co2SavedGrams: number } | null>(null)
  const [factIndex, setFactIndex] = useState(0)
  const [cooldown, setCooldown] = useState(0)
  const [isIndia, setIsIndia] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [typedUrl, setTypedUrl] = useState("")
  const [showCheckmark, setShowCheckmark] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [isGeneratingQr, setIsGeneratingQr] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrCopied, setQrCopied] = useState(false)
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Trigger input shake for errors
  const triggerError = (msg: string) => {
    setError(msg)
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 300)
  }

  // Detect Indian users
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      const isIndianTz = tz && (tz === "Asia/Kolkata" || tz === "Asia/Calcutta")
      const locale = navigator.language || ""
      const isIndianLocale = locale.toLowerCase().includes("-in") || locale.toLowerCase() === "hi"
      if (isIndianTz || isIndianLocale) {
        setIsIndia(true)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  // Countdown timer for rate limit
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0 }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldown])

  // Rotate green facts every 4 seconds when card is visible
  useEffect(() => {
    if (!carbonSaved) return
    const t = setInterval(() => setFactIndex((i) => (i + 1) % GREEN_FACTS.length), 4000)
    return () => clearInterval(t)
  }, [carbonSaved])

  // 19.2 Delight Animation: Fast compression and typing reveal sequence (<700ms)
  const runDelightAnimation = (originalUrl: string, finalShortUrl: string) => {
    setIsAnimating(true)
    setAnimStep(1)
    setDisplayUrl(originalUrl)
    setTypedUrl("")
    setShowCheckmark(false)

    // Phase 1: 0-250ms "compress" long URL down
    let len = originalUrl.length
    const shrinkInterval = setInterval(() => {
      len = Math.max(0, len - Math.ceil(originalUrl.length / 8))
      setDisplayUrl(originalUrl.slice(0, len) + (len > 0 ? "…" : ""))

      if (len <= 0) {
        clearInterval(shrinkInterval)
        setAnimStep(2)

        // Phase 2: 250-500ms fast type-in of short URL (stagger ~16ms/char)
        let charIndex = 0
        const typeInterval = setInterval(() => {
          charIndex++
          setTypedUrl(finalShortUrl.slice(0, charIndex))

          if (charIndex >= finalShortUrl.length) {
            clearInterval(typeInterval)
            // Phase 3: Reveal checkmark
            setShowCheckmark(true)
            setTimeout(() => {
              setIsAnimating(false)
              setAnimStep(0)
            }, 300)
          }
        }, 16)
        animRef.current = typeInterval
      }
    }, 28)
    animRef.current = shrinkInterval
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShortUrl(null)
    setCarbonSaved(null)
    setShowQr(false)
    setQrDataUrl(null)
    setFactIndex(0)

    const trimmedUrl = longUrl.trim()
    if (!trimmedUrl) {
      triggerError("Please enter a destination URL")
      return
    }

    const validation = validateUrl(trimmedUrl)
    if (!validation.valid) {
      triggerError(validation.error || "Please enter a valid URL (e.g. https://example.com)")
      return
    }

    processShorten(trimmedUrl)
  }

  const processShorten = async (targetUrl: string) => {
    setIsLoading(true)
    setIsAnimating(true)
    const startTime = Date.now()
    const originalLength = targetUrl.length

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl: targetUrl, customSlug: customSlug.trim() || undefined }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL")
      }

      // Ensure the link generation WebP animation (/ulo_4k.webp) is visible for at least 1800ms
      const elapsed = Date.now() - startTime
      if (elapsed < 1800) {
        await new Promise((r) => setTimeout(r, 1800 - elapsed))
      }

      const resultShortUrl = `${window.location.origin}/r/${data.slug}`
      setShortUrl(resultShortUrl)
      setResult(data)

      const savings = calculateCarbonSaved(originalLength)
      setCarbonSaved(savings)

      setLongUrl("")
      setCustomSlug("")
      setShowCheckmark(true)
    } catch (err) {
      triggerError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
      setIsAnimating(false)
    }
  }

  const handleGenerateQr = async () => {
    if (!shortUrl) return
    setShowQr(true)
    setIsGeneratingQr(true)
    const startTime = Date.now()
    try {
      const url = await QRCode.toDataURL(shortUrl, {
        width: 360,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#168270",
          light: "#ffffff",
        },
      })
      // Ensure the QR code generation WebP animation (/ulo_qr_logo.webp) displays for at least 1500ms
      const elapsed = Date.now() - startTime
      if (elapsed < 1500) {
        await new Promise((r) => setTimeout(r, 1500 - elapsed))
      }
      setQrDataUrl(url)
    } catch (err) {
      console.error("QR code generation error:", err)
    } finally {
      setIsGeneratingQr(false)
    }
  }

  const copyToClipboard = async () => {
    if (shortUrl) {
      try {
        await navigator.clipboard.writeText(shortUrl)
        if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
          navigator.vibrate(10)
        }
      } catch {
        // Fallback
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }

  const shareUrl = async () => {
    if (shortUrl && navigator.share) {
      await navigator.share({ url: shortUrl })
    }
  }

  // Slug input handler: strip anything that looks like a URL
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    // Block protocol schemes and common URL characters
    if (raw.includes("://") || raw.includes(".com") || raw.includes(".in") || raw.includes(".net") || raw.includes(".org")) {
      triggerError("Custom slug should be a short word like 'my-link', not a full URL")
      return
    }
    setError(null)
    setCustomSlug(raw.replace(/[^a-zA-Z0-9-_]/g, ""))
  }

  return (
    <>
      <div className="mx-auto w-full max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className={`relative flex flex-col gap-2 sm:flex-row sm:gap-3 transition-transform ${isShaking ? "animate-input-shake" : ""}`}>
            <div className="relative flex-1">
              <Input
                type="url"
                placeholder="Paste your long URL here..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="h-11 w-full text-base sm:h-12 border-border focus-visible:ring-primary focus-visible:border-primary"
                required
              />
              {/* 2px teal sweep line during loading */}
              {isLoading && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary overflow-hidden rounded-b">
                  <div className="h-full bg-emerald-400 animate-line-sweep" />
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading || cooldown > 0}
              className="h-11 px-6 sm:h-12 sm:px-8 bg-primary hover:bg-[#136759] text-white font-medium active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
                  <span>Compressing</span>
                </span>
              ) : cooldown > 0 ? (
                `Wait ${cooldown}s`
              ) : (
                "Shorten URL"
              )}
            </Button>
          </div>

          {/* Custom slug row */}
          <div>
            <div className="flex items-center gap-0 rounded-lg border border-border bg-muted/40 overflow-hidden focus-within:ring-2 focus-within:ring-ring transition-all">
              <span className="shrink-0 select-none px-3 py-2 text-xs font-mono text-muted-foreground border-r border-border bg-muted whitespace-nowrap">
                ul0.site/r/
              </span>
              <input
                id="customSlug"
                type="text"
                placeholder="your-slug  (letters, numbers, dashes)"
                value={customSlug}
                onChange={handleSlugChange}
                className="flex-1 bg-transparent px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 outline-none"
                autoComplete="off"
                spellCheck={false}
                maxLength={50}
              />
              {customSlug && (
                <button
                  type="button"
                  onClick={() => { setCustomSlug(""); setError(null) }}
                  className="px-2 py-2 text-muted-foreground hover:text-foreground text-xs transition-colors"
                  aria-label="Clear custom slug"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground/60 pl-1">
              Only letters, numbers and dashes. Leave blank for a random slug.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        {/* Link Generation WebP Animation (/ulo_4k.webp) */}
        {(isLoading || isAnimating) && (
          <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-primary/25 bg-card/95 p-6 shadow-sm text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden bg-background/80 border border-border/80 p-3 flex items-center justify-center shadow-inner">
              <img
                src="/ulo_4k.webp"
                alt="Generating Link Animation"
                className="w-full h-auto max-h-36 object-contain"
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
              <Zap className="h-4 w-4 animate-bounce text-primary" />
              <span>Compressing & Generating Short Link...</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Generating your fast edge redirect URL
            </p>
            <div className="mt-3 w-full max-w-xs h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-line-sweep" />
            </div>
          </div>
        )}

        {/* Result card */}
        {shortUrl && !isLoading && !isAnimating && (
          <>
            <Card className="mt-4 border-primary/25 bg-primary/5 sm:mt-6 animate-card-rise shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Your short link:</span>
                  </p>
                  {/* SVG animated stroke checkmark per master.txt Section 19.2 */}
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <svg className="h-4 w-4 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" className="animate-stroke-check" />
                    </svg>
                    <span>Ready</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <code className="flex-1 truncate rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-mono font-semibold text-primary sm:text-sm">
                    {shortUrl}
                  </code>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={copyToClipboard}
                      className={`h-9 px-3.5 gap-1.5 text-xs font-medium transition-all cursor-pointer shadow-xs ${
                        copied
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : "bg-primary hover:bg-[#136759] text-white active:scale-95"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-8 gap-1 text-xs sm:h-9 sm:text-sm bg-transparent"
                    >
                      <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Open</span>
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGenerateQr}
                      className="h-8 gap-1.5 text-xs sm:h-9 sm:text-sm bg-transparent hover:bg-primary/10 border-primary/30 text-primary font-medium"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>{showQr ? "QR Code" : "Get QR Code"}</span>
                    </Button>
                    {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={shareUrl}
                        className="h-8 gap-1 text-xs sm:h-9 sm:text-sm bg-transparent"
                      >
                        <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Share</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Integrated QR Code Generation Block (/ulo_qr_logo.webp) */}
                {showQr && (
                  <div className="mt-4 rounded-xl border border-primary/20 bg-background/80 p-4 animate-in fade-in duration-300">
                    {isGeneratingQr ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <img
                          src="/ulo_qr_logo.webp"
                          alt="Generating QR Code Animation"
                          className="w-36 h-36 object-contain mb-2"
                        />
                        <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                          <span>Generating Vector QR Code...</span>
                        </p>
                      </div>
                    ) : qrDataUrl ? (
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="p-2 bg-white rounded-lg border border-border shadow-xs">
                          <img
                            src={qrDataUrl}
                            alt="Short URL QR Code"
                            className="w-32 h-32 object-contain"
                          />
                        </div>
                        <div className="flex-1 space-y-2 text-center sm:text-left">
                          <p className="text-xs font-semibold text-foreground">
                            High-Resolution Vector QR Code
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Scan with any smartphone camera to open <code className="text-primary font-mono">{shortUrl}</code>
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                            <Button
                              size="sm"
                              onClick={() => {
                                const link = document.createElement("a")
                                link.download = `ulo-qr-${result?.slug || "code"}.png`
                                link.href = qrDataUrl
                                link.click()
                              }}
                              className="h-8 text-xs bg-primary hover:bg-[#136759] text-white"
                            >
                              Download PNG
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                const blob = await fetch(qrDataUrl).then(r => r.blob())
                                await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
                                setQrCopied(true)
                                setTimeout(() => setQrCopied(false), 1600)
                              }}
                              className="h-8 text-xs bg-transparent"
                            >
                              {qrCopied ? "Copied Image!" : "Copy Image"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Environmental Impact Stats */}
                {factIndex !== null && (
                  <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <div className="flex gap-2">
                      <Leaf className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <p
                        key={factIndex}
                        className="text-[11px] text-muted-foreground leading-relaxed italic animate-in fade-in duration-700"
                      >
                        {GREEN_FACTS[factIndex]}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pro Custom Domain Teaser (High Intent Conversion Prompt) */}
            <div className="mt-4 rounded-xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      Pro Upgrade
                    </span>
                    <p className="text-sm font-semibold text-foreground">
                      Want short links using your own domain?
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connect <code className="text-primary font-mono">link.yourbrand.com</code>, track device/country analytics, and edit link destinations anytime.
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="shrink-0 self-start rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:-translate-y-0.5 sm:self-auto"
                >
                  Upgrade for $2/mo →
                </Link>
              </div>
            </div>

            {/* Sponsored Advertisement after link creation */}
            <LinkResultAd />

            {/* Standalone Supporters Progress Widget with matching theme colors */}
            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/8 via-emerald-500/5 to-transparent p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-emerald-500 animate-pulse" />
                    <p className="text-sm font-semibold text-foreground">
                      ul0 is free forever. Support the project?
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Help us cover domain and infrastructure costs (Target: {isIndia ? "₹10,000" : "$100"}).
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-muted border border-border/40">
                      <div className="h-full w-[2%] rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {isIndia ? "₹0 / ₹10,000" : "$0 / $100"} supported
                    </span>
                  </div>
                </div>
                <Link
                  href="/donate"
                  className="shrink-0 self-start rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 sm:self-auto"
                >
                  Support Now
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
