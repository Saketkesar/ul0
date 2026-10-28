"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CopyField } from "@/components/copy-field"
import {
  Link2,
  QrCode,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  ShieldCheck,
  Flag,
  ArrowRight,
  Check,
} from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CreatedLinkResult | null>(null)

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
        color: { dark: "#0B1412", light: "#FFFFFF" },
      })

      const qrSvg = await QRCode.toString(data.shortUrl, {
        type: "svg",
        margin: 2,
        color: { dark: "#0B1412", light: "#FFFFFF" },
      })

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
    <div className="w-full max-w-2xl mx-auto space-y-4 text-left">
      {/* Creator Box */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
        {/* Mode Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-md bg-muted/40 border border-border/60 w-fit">
          <button
            type="button"
            onClick={() => {
              setActiveTab("link")
              setError(null)
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === "link"
                ? "bg-background text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Short link</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("qr")
              setError(null)
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === "qr"
                ? "bg-background text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>QR code</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
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
                placeholder="Paste destination URL (e.g. https://example.com/very/long/url)"
                className="h-11 sm:h-12 text-xs sm:text-sm font-sans bg-background pr-16"
                required
                autoFocus
              />
              {!longUrl && (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/50 border border-border/60 transition-colors"
                >
                  Paste
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 sm:h-12 px-5 font-semibold text-xs shrink-0"
            >
              {isLoading ? "Creating..." : activeTab === "qr" ? "Generate QR" : "Shorten link"}
            </Button>
          </div>

          {/* Collapsed Options Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Customize alias and options</span>
              {showOptions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {showOptions && (
              <div className="mt-2.5 p-3 rounded-md border border-border bg-muted/20 space-y-2">
                <label className="text-xs font-medium text-foreground">Custom back-half alias</label>
                <div className="flex items-center rounded-md border border-border bg-background overflow-hidden">
                  <span className="px-3 py-1.5 text-xs font-mono text-muted-foreground border-r border-border bg-muted/40 select-none">
                    ul0.site/r/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) =>
                      setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))
                    }
                    placeholder="custom-name"
                    maxLength={40}
                    className="flex-1 px-3 py-1.5 text-xs font-mono bg-transparent outline-none text-foreground placeholder:text-muted-foreground/40"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <span>Letters, numbers, and hyphens only.</span>
                  <Link href="/custom-domain-landing" className="text-primary hover:underline font-medium">
                    Connect custom domain free →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-destructive font-medium">{error}</p>}
        </form>

        {/* Inline Result Card (No Modal, Under 10s creation) */}
        {result && (
          <div className="pt-2 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                {activeTab === "qr" ? "QR Code & Link Ready" : "Short Link Created"}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">307 Temporary Redirect</span>
            </div>

            {/* Short URL CopyField */}
            <CopyField value={result.shortUrl} label="Short URL" />

            {/* QR Code Container */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-lg border border-border bg-muted/20">
              <div className="p-2 rounded-md border border-border bg-white shrink-0">
                <img
                  src={result.qrPngUrl}
                  alt={`QR code for ${result.shortUrl}`}
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Printable Vector QR Code</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    High-contrast dynamic code. Scans to <span className="font-mono">{result.shortUrl}</span>.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <a
                    href={result.qrPngUrl}
                    download={`ul0-${result.slug}.png`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-border bg-card hover:bg-muted text-[11px] font-medium text-foreground transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download PNG</span>
                  </a>
                  <button
                    type="button"
                    onClick={downloadSvg}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-border bg-card hover:bg-muted text-[11px] font-medium text-foreground transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download SVG</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Link Preview & Abuse report links */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
              <div className="flex items-center gap-3">
                <a
                  href={`${result.shortUrl}+`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Inspect preview</span>
                </a>
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Test redirect</span>
                </a>
              </div>
              <Link
                href={`/report-abuse?url=${encodeURIComponent(result.shortUrl)}`}
                className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
              >
                <Flag className="h-3 w-3" />
                <span>Report abuse</span>
              </Link>
            </div>

            {/* Anonymous Claim Prompt */}
            {result.isAnonymous && !isSignedIn && (
              <div className="p-3 rounded-md border border-primary/20 bg-primary/5 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>Created as an anonymous link. Log in or create an account to claim it and track analytics.</span>
                <Link
                  href="/sign-up"
                  className="text-primary hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
                >
                  <span>Claim link</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Free Plan Exact Limits - 3 plain bullet points */}
      <div className="rounded-lg border border-border/80 bg-muted/20 px-4 py-3 text-xs text-muted-foreground space-y-1">
        <div className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
          Included on Free Plan ($0 forever)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Check className="h-3 w-3 text-primary shrink-0" />
            <span>Unlimited links on ul0.site</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3 w-3 text-primary shrink-0" />
            <span>1 custom domain connection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3 w-3 text-primary shrink-0" />
            <span>Real-time click analytics &amp; QR</span>
          </div>
        </div>
      </div>
    </div>
  )
}
