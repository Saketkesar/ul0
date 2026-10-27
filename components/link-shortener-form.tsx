"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Copy,
  Check,
  ExternalLink,
  QrCode,
  ArrowRight,
  SlidersHorizontal,
  Download,
  Share2,
  Trash2,
  Link2,
  Clock,
  ChevronDown,
  ChevronUp,
  Globe,
} from "lucide-react"
import { validateUrl } from "@/lib/utils/slug"
import QRCode from "qrcode"
import Link from "next/link"

interface RecentLink {
  id: string
  slug: string
  shortUrl: string
  longUrl: string
  createdAt: number
}

const STORAGE_KEY = "ul0_recent_links_v2"

export function LinkShortenerForm() {
  const [longUrl, setLongUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [slug, setSlug] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [recentLinks, setRecentLinks] = useState<RecentLink[]>([])
  const [copiedRecentId, setCopiedRecentId] = useState<string | null>(null)
  const [activeQrModal, setActiveQrModal] = useState<string | null>(null)
  const [modalQrUrl, setModalQrUrl] = useState<string | null>(null)

  // Load recent links from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setRecentLinks(JSON.parse(stored))
      }
    } catch {}
  }, [])

  // Save recent links
  const saveRecentLink = (newLink: RecentLink) => {
    try {
      setRecentLinks((prev) => {
        const filtered = prev.filter((item) => item.slug !== newLink.slug)
        const updated = [newLink, ...filtered].slice(0, 5)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    } catch {}
  }

  const clearRecentLinks = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setRecentLinks([])
    } catch {}
  }

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
    setShortUrl(null)
    setShowQr(false)
    setQrDataUrl(null)

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
      setError(validation.error || "Please enter a valid URL.")
      return
    }

    setIsLoading(true)

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

      const generatedShortUrl = `${window.location.origin}/r/${data.slug}`
      setShortUrl(generatedShortUrl)
      setSlug(data.slug)

      // Generate QR code instantly
      try {
        const qr = await QRCode.toDataURL(generatedShortUrl, {
          width: 320,
          margin: 1,
          color: { dark: "#18181b", light: "#ffffff" },
        })
        setQrDataUrl(qr)
      } catch {}

      // Save to recent links
      saveRecentLink({
        id: data.id || data.slug,
        slug: data.slug,
        shortUrl: generatedShortUrl,
        longUrl: trimmed,
        createdAt: Date.now(),
      })

      setLongUrl("")
      setCustomSlug("")
      setShowOptions(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while shortening.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string, isRecentId?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if (isRecentId) {
        setCopiedRecentId(isRecentId)
        setTimeout(() => setCopiedRecentId(null), 1500)
      } else {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }
    } catch {}
  }

  const openQrForRecent = async (url: string, id: string) => {
    try {
      const qr = await QRCode.toDataURL(url, {
        width: 320,
        margin: 1,
        color: { dark: "#18181b", light: "#ffffff" },
      })
      setModalQrUrl(qr)
      setActiveQrModal(id)
    } catch {}
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 text-left">
      {/* Main Notion-Style Shortener Box */}
      <div className="rounded-xl border border-border/90 bg-card p-4 sm:p-6 shadow-xs space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Main Input Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                inputMode="url"
                value={longUrl}
                onChange={(e) => {
                  setLongUrl(e.target.value)
                  setError(null)
                }}
                placeholder="Paste a long link (e.g. https://example.com/very/long/url)"
                className="h-11 sm:h-12 text-sm sm:text-base border-border bg-background pr-16 focus-visible:ring-1 focus-visible:ring-foreground"
                required
              />
              {!longUrl && (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/60 border border-border/60 transition-colors cursor-pointer"
                >
                  Paste
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 sm:h-12 px-6 font-medium text-sm bg-foreground text-background hover:bg-foreground/90 transition-all cursor-pointer shrink-0"
            >
              {isLoading ? "Shortening..." : "Shorten URL"}
            </Button>
          </div>

          {/* Toggle for Custom Alias / Advanced options */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Customize link (custom back-half / alias)</span>
              {showOptions ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>

            {showOptions && (
              <div className="mt-2.5 p-3 rounded-lg border border-border/80 bg-muted/30 space-y-2 animate-in fade-in duration-150">
                <div className="text-xs font-medium text-foreground">Custom back-half alias:</div>
                <div className="flex items-center rounded-md border border-border bg-background overflow-hidden focus-within:ring-1 focus-within:ring-foreground">
                  <span className="px-3 py-1.5 text-xs font-mono text-muted-foreground border-r border-border bg-muted/40 select-none">
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
                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-transparent outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Letters, numbers, and dashes only.</span>
                  <Link
                    href="/custom-domain-landing"
                    className="text-foreground hover:underline inline-flex items-center gap-1"
                  >
                    <span>Use your own domain free</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        </form>

        {/* Immediate Result Card */}
        {shortUrl && (
          <div className="mt-4 rounded-lg border border-border bg-muted/20 p-4 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                Shortened URL
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                Permanent 301 Redirect
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <code className="flex-1 truncate rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm font-mono font-semibold text-foreground">
                {shortUrl}
              </code>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleCopy(shortUrl)}
                  className={`h-9 px-3.5 text-xs font-medium cursor-pointer transition-colors ${
                    copied
                      ? "bg-emerald-600 text-white hover:bg-emerald-600"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 text-xs border-border hover:bg-muted"
                >
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    <span>Open</span>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQr(!showQr)}
                  className="h-9 text-xs border-border hover:bg-muted"
                >
                  <QrCode className="h-3.5 w-3.5 mr-1" />
                  <span>QR Code</span>
                </Button>
              </div>
            </div>

            {/* QR Code Reveal */}
            {showQr && qrDataUrl && (
              <div className="p-4 rounded-md border border-border bg-background flex flex-col sm:flex-row items-center gap-4 animate-in fade-in duration-150">
                <div className="p-2 rounded border border-border bg-white shrink-0">
                  <img src={qrDataUrl} alt="QR Code" className="w-28 h-28 object-contain" />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="text-xs font-semibold text-foreground">
                    Dynamic Vector QR Code
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">
                    Scan with any phone camera to visit <span className="font-mono">{shortUrl}</span>.
                    Free to print on menus, packaging, and flyers.
                  </div>
                  <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                    <a
                      href={qrDataUrl}
                      download={`ul0-${slug || "qr"}.png`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download PNG</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Links History (Notion style table) */}
      {recentLinks.length > 0 && (
        <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Recent Shortened Links</span>
            </div>
            <button
              onClick={clearRecentLinks}
              className="text-[11px] text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="divide-y divide-border border border-border/80 rounded-lg overflow-hidden bg-background">
            {recentLinks.map((item) => (
              <div
                key={item.slug}
                className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-semibold text-foreground hover:underline truncate"
                    >
                      {item.shortUrl}
                    </a>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate max-w-xs sm:max-w-md">
                    {item.longUrl}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopy(item.shortUrl, item.id)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Copy short URL"
                  >
                    {copiedRecentId === item.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => openQrForRecent(item.shortUrl, item.id)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="View QR Code"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                  </button>

                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Open destination"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Modal for Recent Links */}
      {activeQrModal && modalQrUrl && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="rounded-xl border border-border bg-card p-5 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground font-mono">QR Code</span>
              <button
                onClick={() => setActiveQrModal(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-3 bg-white rounded border border-border flex justify-center">
              <img src={modalQrUrl} alt="QR Code" className="w-48 h-48 object-contain" />
            </div>
            <div className="flex gap-2">
              <a
                href={modalQrUrl}
                download="ul0-qr.png"
                className="flex-1 py-2 text-center text-xs font-medium rounded bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                Download PNG
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveQrModal(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
