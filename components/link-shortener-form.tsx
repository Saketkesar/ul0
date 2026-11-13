"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  Copy,
  BarChart2,
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
  const [copied, setCopied] = useState(false)

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
        color: { dark: "#0B1736", light: "#FFFFFF" },
      })

      const qrSvg = await QRCode.toString(data.shortUrl, {
        type: "svg",
        margin: 2,
        color: { dark: "#0B1736", light: "#FFFFFF" },
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
    <div className="w-full max-w-2xl mx-auto space-y-6 text-center">
      {/* Main Cute Clean Input Bar matching UL0Homecuteclean.png */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center w-full bg-white dark:bg-[#0F1E36] rounded-full border border-black/10 dark:border-white/10 p-1.5 sm:p-2 shadow-xs hover:border-[#EE6123]/50 focus-within:border-[#EE6123] focus-within:ring-4 focus-within:ring-[#EE6123]/10 transition-all">
          {/* Link Icon */}
          <div className="pl-3 sm:pl-4 text-muted-foreground shrink-0">
            <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
            placeholder="Paste your long link here"
            className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            required
            autoFocus
          />

          {/* Paste shortcut button if empty */}
          {!longUrl && (
            <button
              type="button"
              onClick={handlePaste}
              className="hidden sm:inline-flex items-center text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-full bg-muted/60 transition-colors mr-2 cursor-pointer"
            >
              Paste
            </button>
          )}

          {/* Orange Pill Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full px-5 sm:px-7 py-2.5 sm:py-3 bg-[#EE6123] text-white font-semibold text-xs sm:text-sm hover:bg-[#EE6123]/90 active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? "Shortening..." : "Shorten"}
          </button>
        </div>
      </form>

      {/* Trust checkmarks under input bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-[#EE6123]" />
          <span>No sign-up</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-[#EE6123]" />
          <span>Free QR included</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-[#EE6123]" />
          <span>Click stats</span>
        </span>
      </div>

      {/* Collapsed Options Toggle */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="h-3 w-3" />
          <span>Customize alias</span>
          {showOptions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {showOptions && (
          <div className="mt-3 p-3 max-w-md mx-auto rounded-xl border border-border bg-card text-left space-y-2">
            <label className="text-xs font-medium text-foreground">Custom back-half alias</label>
            <div className="flex items-center rounded-lg border border-border bg-background overflow-hidden">
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
                className="flex-1 bg-transparent px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/5 text-xs text-destructive text-center max-w-md mx-auto">
          {error}
        </div>
      )}

      {/* Result Card: Cute Clean Card Matching UL0Homecuteclean.png */}
      {result && (
        <div className="relative mt-6 max-w-xl mx-auto rounded-2xl border border-border/80 bg-white dark:bg-[#0F1E36] p-4 sm:p-5 shadow-xs text-left transition-all">
          {/* Top-left sticker */}
          <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-[#EE6123]/10 border border-[#EE6123]/30 text-[#EE6123] text-[10px] font-bold tracking-tight select-none">
            no sign-up ↗
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            {/* Left: QR Thumbnail & Link Info */}
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-border bg-white p-1 shrink-0">
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
                  0 clicks • Ready to share
                </div>
              </div>
            </div>

            {/* Right: Copy & Stats Action Pills */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleCopy(result.shortUrl)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <Link
                href={isSignedIn ? "/dashboard/links" : `${result.shortUrl}+`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B1736] dark:bg-white text-white dark:text-[#0B1736] hover:bg-[#0B1736]/90 text-xs font-semibold transition-all shadow-2xs"
              >
                <BarChart2 className="h-3.5 w-3.5" />
                <span>Stats</span>
              </Link>
            </div>
          </div>

          {/* Expandable Extra Actions */}
          <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={downloadSvg}
                className="hover:text-foreground inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3 w-3" />
                <span>Download SVG QR</span>
              </button>
              <a
                href={result.qrPngUrl}
                download={`ul0-${result.slug}.png`}
                className="hover:text-foreground inline-flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                <span>PNG</span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground inline-flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Test redirect</span>
              </a>
              <Link
                href={`/report-abuse?url=${encodeURIComponent(result.shortUrl)}`}
                className="hover:text-destructive text-[11px]"
              >
                Report
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
