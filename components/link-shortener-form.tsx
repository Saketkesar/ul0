"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { UL0Icon } from "@/components/ul0-icon"
import { validateUrl } from "@/lib/utils/slug"
import QRCode from "qrcode"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"

interface CreatedLinkResult {
  slug: string
  shortUrl: string
  id: string
  longUrl: string
  isAnonymous: boolean
  qrPngUrl: string
  qrSvgString: string
}

export function LinkShortenerForm() {
  const { isSignedIn } = useAuth()
  const [activeTab, setActiveTab] = useState<"link" | "qr">("link")
  const [longUrl, setLongUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimatingEco, setIsAnimatingEco] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CreatedLinkResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [faviconError, setFaviconError] = useState(false)

  // Extract domain for instant favicon detection
  const detectedDomain = React.useMemo(() => {
    try {
      const trimmed = longUrl.trim()
      if (!trimmed || trimmed.length < 3) return null
      const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
      const u = new URL(withProto)
      if (u.hostname && u.hostname.includes(".")) {
        return u.hostname
      }
    } catch {}
    return null
  }, [longUrl])

  useEffect(() => {
    setFaviconError(false)
  }, [detectedDomain])

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.tab) {
        setActiveTab(e.detail.tab)
      }
    }
    window.addEventListener("ul0:set-tab", handler)
    return () => window.removeEventListener("ul0:set-tab", handler)
  }, [])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setLongUrl(text.trim())
        setError(null)
      }
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    let trimmed = longUrl.trim()
    if (!trimmed) {
      setError("Please paste or type a URL to shorten.")
      return
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`
    }

    const validation = validateUrl(trimmed)
    if (!validation.valid) {
      setError(validation.error || "Please enter a valid HTTP or HTTPS URL.")
      return
    }

    setIsLoading(true)
    setIsAnimatingEco(true)

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          longUrl: trimmed,
          customSlug: customSlug.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to shorten URL.")
      }

      // Generate both PNG and SVG vector formats
      const qrPng = await QRCode.toDataURL(data.shortUrl, {
        width: 360,
        margin: 2,
        color: { dark: "#0B1A17", light: "#FFFFFF" },
      })

      const qrSvg = await QRCode.toString(data.shortUrl, {
        type: "svg",
        margin: 2,
        color: { dark: "#0B1A17", light: "#FFFFFF" },
      })

      // Allow the eco synthesis animation to finish smoothly
      await new Promise((resolve) => setTimeout(resolve, 1100))

      setResult({
        slug: data.slug,
        shortUrl: data.shortUrl,
        id: data.id,
        longUrl: trimmed,
        isAnonymous: Boolean(data.isAnonymous),
        qrPngUrl: qrPng,
        qrSvgString: qrSvg,
      })

      setLongUrl("")
      setCustomSlug("")
      setShowOptions(false)
      toast.success(activeTab === "qr" ? "QR code and short link created" : "Short link created")
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
      setIsAnimatingEco(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  const downloadSvg = () => {
    if (!result) return
    const blob = new Blob([result.qrSvgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ul0-${result.slug}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-xl mx-auto text-center transition-all duration-300">
      {/* Bitly & Bharpai-Inspired Tactile Card with ul0.site Logo */}
      <div className="relative w-full rounded-3xl border border-border/80 bg-card/95 backdrop-blur-md p-5 sm:p-7 shadow-xl text-left transition-all">
        {/* Header Row: ul0.site Logo + Tabs */}
        <div className="flex items-center justify-between gap-2 pb-5 border-b border-border/60">
          {/* ul0.site Logo */}
          <div className="flex items-center gap-1.5 select-none shrink-0">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#1B685C] dark:text-[#3DDBB8]">
              ul0<span className="text-[#3DDBB8] dark:text-[#87D474]">.site</span>
            </span>
          </div>

          {/* Navigation Tabs: Short Link vs QR Code */}
          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-2xl border border-border/50">
            <button
              type="button"
              onClick={() => {
                setActiveTab("link")
                setError(null)
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "link"
                  ? "bg-[#E6F8F4] dark:bg-[#1B685C]/30 text-[#1B685C] dark:text-[#3DDBB8] shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UL0Icon name="link" size={16} />
              <span>Short Link</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("qr")
                setError(null)
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "qr"
                  ? "bg-[#E6F8F4] dark:bg-[#1B685C]/30 text-[#1B685C] dark:text-[#3DDBB8] shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UL0Icon name="qr" size={16} />
              <span>QR Code</span>
            </button>
          </div>
        </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="pt-5 space-y-4">
            {/* Shortener Bar from media_1795507655990_4beaca73.png:
                Sleek rounded-full pill with mint border, instant favicon on left, input, Paste button, divider, and Electric Mint Shorten button */}
            <div className="relative flex items-center w-full rounded-full border-2 border-[#3DDBB8] bg-white dark:bg-[#0B1A17] p-1.5 sm:p-2 shadow-md transition-all ring-4 ring-[#3DDBB8]/15 focus-within:ring-[#3DDBB8]/30">
              {/* Left icon / instant Favicon */}
              <div className="pl-2 sm:pl-3 pr-1 shrink-0 flex items-center justify-center">
                {detectedDomain && !faviconError ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${detectedDomain}&sz=64`}
                    alt={detectedDomain}
                    onError={() => setFaviconError(true)}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-contain shadow-2xs animate-in zoom-in-75 duration-150"
                  />
                ) : (
                  <div className="text-[#1B685C] dark:text-[#3DDBB8]">
                    <UL0Icon name={activeTab === "qr" ? "qr" : "link"} size={20} />
                  </div>
                )}
              </div>

              {/* URL Input */}
              <input
                type="text"
                inputMode="url"
                value={longUrl}
                onChange={(e) => {
                  setLongUrl(e.target.value)
                  setError(null)
                }}
                placeholder="https://example.com/your-very-long-link"
                className="w-full bg-transparent px-2.5 py-2 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
                required
                autoFocus
              />

              {/* Paste Button */}
              <button
                type="button"
                onClick={handlePaste}
                className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground px-2 sm:px-3 py-1 transition-colors cursor-pointer shrink-0 select-none"
              >
                Paste
              </button>

              {/* Divider */}
              <div className="h-5 w-px bg-border shrink-0 mx-1 select-none" />

              {/* Shorten Button in Electric Mint */}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-1.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#3DDBB8] hover:bg-[#32CBA8] text-[#0B1A17] font-bold text-sm sm:text-base transition-all shrink-0 cursor-pointer shadow-sm active:scale-95 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-[#0B1A17] border-t-transparent rounded-full" />
                ) : (
                  <>
                    <span>{activeTab === "qr" ? "Generate" : "Shorten"}</span>
                    <span className="font-bold">→</span>
                  </>
                )}
              </button>
            </div>

            {/* Sub-options Under the Bar: @ Custom alias & QR Code toggle (matching media_1795507655990_4beaca73.png) */}
            <div className="flex items-center justify-center gap-6 pt-1 text-xs sm:text-sm font-medium text-muted-foreground">
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className={`inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer ${
                  showOptions ? "text-[#1B685C] dark:text-[#3DDBB8] font-bold" : ""
                }`}
              >
                <span className="font-mono text-base leading-none">@</span>
                <span>Custom alias</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab(activeTab === "qr" ? "link" : "qr")
                  setError(null)
                }}
                className={`inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer ${
                  activeTab === "qr" ? "text-[#1B685C] dark:text-[#3DDBB8] font-bold" : ""
                }`}
              >
                <UL0Icon name="qr" size={15} />
                <span>QR code</span>
              </button>
            </div>

            {/* Expanded Custom Alias Panel */}
            {showOptions && (
              <div className="mt-2 p-3.5 rounded-2xl border border-border bg-muted/30 text-left space-y-2 animate-in fade-in-50 duration-150">
                <label className="text-xs font-semibold text-foreground">Custom back-half alias</label>
                <div className="flex items-center rounded-xl border border-border bg-background overflow-hidden shadow-2xs">
                  <span className="px-3.5 py-2 text-xs font-mono font-semibold text-muted-foreground border-r border-border bg-muted/40 select-none">
                    ul0.site/r/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) =>
                      setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))
                    }
                    placeholder="my-custom-name"
                    maxLength={40}
                    className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm font-mono text-foreground focus:outline-none"
                  />
                </div>
              </div>
            )}
          </form>

          {/* Eco Loading Animation on Creation */}
          {isAnimatingEco && (
            <div className="mt-4 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20 text-center space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin">
                  <UL0Icon name="refresh" size={18} className="text-emerald-600 dark:text-emerald-400" />
                </span>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Connecting to Green Digital Infrastructure...
                </span>
              </div>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                Generating paperless redirect &amp; vector QR matrix
              </p>
            </div>
          )}

          {/* Error Notice */}
          {error && (
            <div className="mt-4 p-3 rounded-2xl border border-destructive/30 bg-destructive/5 text-xs text-destructive text-center">
              {error}
            </div>
          )}

          {/* Result Card with Environmental Impact Message */}
          {result && (
            <div className="relative mt-6 rounded-2xl border border-border bg-background p-4 sm:p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* QR Preview & Short URL */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="h-14 w-14 rounded-xl border border-border bg-white p-1 shrink-0 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.qrPngUrl}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-bold text-foreground truncate">
                      {result.shortUrl.replace(/^https?:\/\//, "")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      0 clicks • 100% paperless redirect
                    </div>
                  </div>
                </div>

                {/* Copy & Stats Action Pills */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopy(result.shortUrl)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
                  >
                    <UL0Icon name={copied ? "check" : "copy"} size={14} />
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <Link
                    href={isSignedIn ? "/dashboard/links" : `${result.shortUrl}+`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold transition-all shadow-2xs"
                  >
                    <UL0Icon name="chartline" size={14} />
                    <span>Stats</span>
                  </Link>
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={downloadSvg}
                    className="hover:text-foreground inline-flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <UL0Icon name="download" size={14} />
                    <span>Download SVG</span>
                  </button>
                  <a
                    href={result.qrPngUrl}
                    download={`ul0-${result.slug}.png`}
                    className="hover:text-foreground inline-flex items-center gap-1.5 font-medium"
                  >
                    <UL0Icon name="download" size={14} />
                    <span>PNG</span>
                  </a>
                </div>

                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground inline-flex items-center gap-1.5 font-medium"
                >
                  <UL0Icon name="external" size={14} />
                  <span>Test redirect</span>
                </a>
              </div>

              {/* ENVIRONMENTAL IMPACT MESSAGE (Requested by User) */}
              <div className="pt-3 border-t border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-950/20 rounded-xl p-3.5 text-left flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <UL0Icon name="sparkles" size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    100% Paperless • Positive Environmental Impact
                  </h4>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed">
                    Every digital short link &amp; QR code saves paper and eliminates physical print waste. Thank you for protecting the planet with UL0&apos;s clean, serverless infrastructure.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  )
}
