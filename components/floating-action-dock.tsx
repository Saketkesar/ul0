"use client"

import React, { useState } from "react"
import Link from "next/link"
import QRCode from "qrcode"
import { toast } from "sonner"
import { useAuth } from "@clerk/nextjs"
import { validateUrl } from "@/lib/utils/slug"
import { UL0Icon } from "./ul0-icon"

interface CreatedResult {
  slug: string
  shortUrl: string
  id: string
  longUrl: string
  isAnonymous: boolean
  qrPngUrl: string
  qrSvgString: string
}

export function FloatingActionDock() {
  const { isSignedIn } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"link" | "qr">("link")
  const [longUrl, setLongUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimatingEco, setIsAnimatingEco] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CreatedResult | null>(null)
  const [copied, setCopied] = useState(false)

  const handleOpenTab = (tab: "link" | "qr") => {
    if (isOpen && activeTab === tab) {
      setIsOpen(false)
    } else {
      setActiveTab(tab)
      setIsOpen(true)
      setError(null)
    }
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
    setResult(null)

    let trimmed = longUrl.trim()
    if (!trimmed) {
      setError("Please paste or type a URL.")
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
        throw new Error(data.error || "Failed to process request.")
      }

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

      await new Promise((resolve) => setTimeout(resolve, 900))

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
      toast.success(activeTab === "qr" ? "QR code created" : "Short link created")
    } catch (err: any) {
      setError(err.message || "An error occurred.")
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
    <>
      {/* 1. RIGHT-SIDE EXPANDABLE POPUP CARD (Requested by User) */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[430px] max-h-[85vh] overflow-y-auto rounded-3xl border border-border/90 bg-card/98 backdrop-blur-md p-5 sm:p-6 shadow-2xl z-50 text-left transition-all animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="dialog"
          aria-label="Quick Action Card"
        >
          {/* Header Row: ul0.site Logo + Tabs + Close Button */}
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-border/60">
            {/* Logo */}
            <div className="flex items-center gap-1 select-none shrink-0">
              <span className="font-extrabold text-lg tracking-tight text-[#1B685C] dark:text-[#3DDBB8]">
                ul0<span className="text-[#3DDBB8] dark:text-[#87D474]">.site</span>
              </span>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-muted/70 p-1 rounded-2xl border border-border/50">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("link")
                  setError(null)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "link"
                    ? "bg-[#E6F8F4] dark:bg-[#1B685C]/30 text-[#1B685C] dark:text-[#3DDBB8] shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UL0Icon name="link" size={14} />
                <span>Short Link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("qr")
                  setError(null)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "qr"
                    ? "bg-[#E6F8F4] dark:bg-[#1B685C]/30 text-[#1B685C] dark:text-[#3DDBB8] shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UL0Icon name="qr" size={14} />
                <span>QR Code</span>
              </button>
            </div>

            {/* Red / Muted Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 rounded-full flex items-center justify-center text-red-500/80 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
              title="Close"
              aria-label="Close"
            >
              <UL0Icon name="close" size={14} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="pt-4 space-y-3.5">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                {activeTab === "link" ? "Shorten a URL" : "Generate a QR Code"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeTab === "link" ? "Enter your URL destination" : "Enter destination URL or content"}
              </p>
            </div>

            {/* Input */}
            <div className="relative flex items-center w-full rounded-2xl border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all overflow-hidden shadow-2xs">
              <input
                type="text"
                inputMode="url"
                value={longUrl}
                onChange={(e) => {
                  setLongUrl(e.target.value)
                  setError(null)
                }}
                placeholder="https://example.com/my-long-url"
                className="w-full bg-transparent px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                required
                autoFocus
              />

              {!longUrl && (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-full bg-muted/80 transition-colors mr-2.5 cursor-pointer shrink-0"
                >
                  Paste
                </button>
              )}
            </div>

            {/* Customize Alias */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <div className="h-5 w-5 rounded-md bg-muted flex items-center justify-center text-primary">
                  <UL0Icon name="settings" size={13} />
                </div>
                <span>Customize alias</span>
                <UL0Icon name={showOptions ? "arrowup" : "arrowdown"} size={11} />
              </button>

              {showOptions && (
                <div className="mt-2.5 p-3 rounded-2xl bg-muted/50 border border-border/60 space-y-2 animate-in fade-in duration-150">
                  <label className="block text-[11px] font-medium text-muted-foreground">
                    Custom path on ul0.site
                  </label>
                  <div className="flex items-center rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-within:border-primary">
                    <span className="text-muted-foreground font-mono select-none pr-1">ul0.site/</span>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) =>
                        setCustomSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-_]/g, "")
                            .slice(0, 32)
                        )
                      }
                      placeholder="custom-alias"
                      className="w-full bg-transparent font-mono focus:outline-none placeholder:text-muted-foreground/40"
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
                <UL0Icon name="warning" size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !longUrl.trim()}
              className="w-full py-3 px-5 rounded-2xl bg-[#1B685C] hover:bg-[#16564C] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isLoading || isAnimatingEco ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Synthesizing clean link...</span>
                </>
              ) : (
                <span>{activeTab === "link" ? "Shorten URL" : "Generate QR Code"}</span>
              )}
            </button>
          </form>

          {/* Result Card */}
          {result && (
            <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-3.5 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-11 w-11 rounded-lg border border-border bg-white p-0.5 shrink-0 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={result.qrPngUrl} alt="QR Code" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">
                      {result.shortUrl.replace(/^https?:\/\//, "")}
                    </div>
                    <div className="text-[10px] text-muted-foreground">0 clicks • paperless redirect</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(result.shortUrl)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground cursor-pointer shadow-2xs"
                  >
                    <UL0Icon name={copied ? "check" : "copy"} size={12} />
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <Link
                    href={isSignedIn ? "/dashboard/links" : `${result.shortUrl}+`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-2xs hover:opacity-90"
                  >
                    <UL0Icon name="chartline" size={12} />
                    <span>Stats</span>
                  </Link>
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={downloadSvg}
                    className="hover:text-foreground inline-flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <UL0Icon name="download" size={12} />
                    <span>SVG</span>
                  </button>
                  <a
                    href={result.qrPngUrl}
                    download={`ul0-${result.slug}.png`}
                    className="hover:text-foreground inline-flex items-center gap-1 font-medium"
                  >
                    <UL0Icon name="download" size={12} />
                    <span>PNG</span>
                  </a>
                </div>

                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground inline-flex items-center gap-1 font-medium"
                >
                  <UL0Icon name="external" size={12} />
                  <span>Test</span>
                </a>
              </div>

              {/* Environmental Impact Note */}
              <div className="pt-2 border-t border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-950/20 rounded-lg p-2.5 flex items-start gap-2">
                <div className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <UL0Icon name="sparkles" size={14} />
                </div>
                <p className="text-[10px] text-emerald-800/90 dark:text-emerald-300/90 leading-tight">
                  <strong>100% Paperless:</strong> Thank you for saving trees and cutting print carbon with UL0.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. RIGHT-SIDE FLOATING ACTION DOCK (PINNED TO BOTTOM-RIGHT) */}
      <div
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 p-2 pl-4 rounded-full bg-[#1B685C] text-white shadow-xl hover:shadow-2xl transition-all duration-200 select-none animate-in fade-in slide-in-from-bottom-4 border-2 border-white/20"
        role="region"
        aria-label="Quick Actions Dock"
      >
        <span className="text-xs sm:text-sm font-bold tracking-tight pr-1">Start now:</span>
        <button
          type="button"
          onClick={() => handleOpenTab("link")}
          className={`h-9 w-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-xs cursor-pointer ${
            isOpen && activeTab === "link"
              ? "bg-[#3DDBB8] text-[#061814] ring-2 ring-white"
              : "bg-white text-[#1B685C] hover:bg-neutral-100"
          }`}
          title="Shorten a link"
          aria-label="Shorten a link"
        >
          <UL0Icon name="link" size={18} />
        </button>
        <button
          type="button"
          onClick={() => handleOpenTab("qr")}
          className={`h-9 w-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-xs cursor-pointer ${
            isOpen && activeTab === "qr"
              ? "bg-[#3DDBB8] text-[#061814] ring-2 ring-white"
              : "bg-white text-[#1B685C] hover:bg-neutral-100"
          }`}
          title="Generate dynamic QR code"
          aria-label="Generate dynamic QR code"
        >
          <UL0Icon name="qr" size={18} />
        </button>
      </div>
    </>
  )
}
