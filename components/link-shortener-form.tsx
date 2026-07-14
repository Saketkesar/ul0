"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, ExternalLink, Share2, Loader2, Leaf, Zap } from "lucide-react"
import { isValidUrl } from "@/lib/utils/slug"
import dynamic from "next/dynamic"
import type { AdBannerProps } from "@/components/ad-banner"

const AdBanner = dynamic<AdBannerProps>(
  () => import("@/components/ad-banner").then((m) => m.AdBanner),
  { ssr: false }
)

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
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  // Link compression animation
  const runAnimation = (originalUrl: string, finalShortUrl: string) => {
    setIsAnimating(true)
    setAnimStep(1)
    setDisplayUrl(originalUrl)

    // Phase 1: shrink the displayed URL character by character
    let len = originalUrl.length
    const shrinkInterval = setInterval(() => {
      len = Math.max(0, len - Math.ceil(originalUrl.length / 18))
      setDisplayUrl(originalUrl.slice(0, len) + (len > 0 ? "…" : ""))
      if (len <= 0) {
        clearInterval(shrinkInterval)
        // Phase 2: expand the short URL
        setDisplayUrl("")
        let idx = 0
        const growInterval = setInterval(() => {
          idx++
          setDisplayUrl(finalShortUrl.slice(0, idx))
          if (idx >= finalShortUrl.length) {
            clearInterval(growInterval)
            setAnimStep(2)
            setTimeout(() => {
              setIsAnimating(false)
              setAnimStep(0)
            }, 600)
          }
        }, 35)
        animRef.current = growInterval
      }
    }, 40)
    animRef.current = shrinkInterval
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShortUrl(null)
    setCarbonSaved(null)
    setFactIndex(0)

    if (!isValidUrl(longUrl)) {
      if (longUrl.startsWith("http://")) {
        setError("Only HTTPS links are accepted. Please use https:// instead.")
      } else if (!longUrl.startsWith("https://")) {
        setError("Please include https:// at the start of your URL (e.g. https://example.com)")
      } else {
        setError("Please enter a valid URL (e.g. https://example.com)")
      }
      return
    }

    processShorten()
  }

  const processShorten = async () => {
    setIsLoading(true)
    const originalLength = longUrl.length
    const urlForAnimation = longUrl

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, customSlug: customSlug || undefined }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL")
      }

      const resultShortUrl = `${window.location.origin}/r/${data.slug}`
      setShortUrl(resultShortUrl)

      const savings = calculateCarbonSaved(originalLength)
      setCarbonSaved(savings)

      setLongUrl("")
      setCustomSlug("")

      // Run the animation after state is set
      setTimeout(() => runAnimation(urlForAnimation, resultShortUrl), 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
      setError("Custom slug should be a short word like 'my-link', not a full URL")
      return
    }
    setError(null)
    setCustomSlug(raw.replace(/[^a-zA-Z0-9-_]/g, ""))
  }

  return (
    <>
      <div className="mx-auto w-full max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Input
              type="url"
              placeholder="Paste your long URL here..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="h-11 flex-1 text-base sm:h-12"
              required
            />
            <Button type="submit" disabled={isLoading || cooldown > 0} className="h-11 px-6 sm:h-12 sm:px-8">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="sm:hidden">...</span>
                  <span className="hidden sm:inline">Shortening...</span>
                </>
              ) : cooldown > 0 ? (
                `Wait ${cooldown}s`
              ) : (
                "Shorten"
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

        {/* Link compression animation */}
        {isAnimating && (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>{animStep === 1 ? "Compressing link…" : "Done!"}</span>
            </div>
            <code
              className={`text-sm font-mono transition-all duration-300 text-center break-all leading-relaxed ${
                animStep === 1
                  ? "text-muted-foreground line-through decoration-primary/60"
                  : "text-primary font-semibold"
              }`}
            >
              {displayUrl || "\u00a0"}
            </code>
            {animStep === 1 && (
              <div className="w-full max-w-xs h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-[shrink_1.5s_linear_forwards]" />
              </div>
            )}
          </div>
        )}

        {/* Result card */}
        {shortUrl && !isAnimating && (
          <Card className="mt-4 border-primary/20 bg-primary/5 sm:mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <CardContent className="p-3 sm:p-4">
              <p className="mb-2 text-xs font-medium text-foreground sm:text-sm">Your short link:</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <code className="flex-1 truncate rounded bg-background px-2 py-1.5 text-xs font-medium text-primary sm:px-3 sm:py-2 sm:text-sm">
                  {shortUrl}
                </code>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="h-8 gap-1 text-xs sm:h-9 sm:text-sm bg-transparent"
                  >
                    {copied ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
                    {copied ? "Copied" : "Copy"}
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

              {/* Carbon Savings Display */}
              {carbonSaved && carbonSaved.bytesSaved > 0 && (
                <div className="mt-3 pt-3 border-t border-primary/10">
                  <div className="rounded-lg border border-green-500/25 bg-green-500/6 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" />
                      <span className="text-[11px] font-bold text-green-700 dark:text-green-300 tracking-widest uppercase">
                        Green Link
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-2 mb-2.5">
                      <div className="rounded-md bg-background/60 px-2 py-1.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Bytes saved / 100 clicks</p>
                        <p className="text-sm font-bold text-foreground">{carbonSaved.bytesSaved.toLocaleString()}</p>
                      </div>
                      <div className="rounded-md bg-background/60 px-2 py-1.5 text-center">
                        <p className="text-[10px] text-muted-foreground">CO₂ reduced</p>
                        <p className="text-sm font-bold text-foreground">{carbonSaved.co2SavedGrams.toFixed(3)}g</p>
                      </div>
                    </div>

                    {/* Rotating fact */}
                    <p
                      key={factIndex}
                      className="text-[11px] text-muted-foreground leading-relaxed italic animate-in fade-in duration-700"
                    >
                      {GREEN_FACTS[factIndex]}
                    </p>
                  </div>
                </div>
              )}
              {/* Adsterra Banner Ad — shown after link is created */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground/50 text-center mb-1">Advertisement</p>
                <AdBanner slot={2} type="small" />
              </div>
          </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
