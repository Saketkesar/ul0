"use client"

import React, { useState } from "react"
import { Search, Loader2, Share2, Globe, AlertTriangle, CheckCircle2, XCircle, Info, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OgData {
  success: boolean
  url: string
  domain: string
  title: string
  description: string
  image: string | null
  siteName: string
  twitterCard: string
  raw: {
    htmlTitle: string
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    ogSiteName: string | null
    twitterTitle: string | null
    twitterDescription: string | null
    twitterImage: string | null
    metaDescription: string | null
  }
}

type TabType = "twitter" | "facebook" | "linkedin" | "discord"

export function OgPreviewClient() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<OgData | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("twitter")

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch("/api/tools/og-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "Failed to inspect OpenGraph tags.")
      }

      setData(json)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const titleLen = data?.title.length || 0
  const descLen = data?.description.length || 0

  return (
    <div className="w-full">
      {/* Input Form */}
      <form onSubmit={handleInspect} className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Globe className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to preview (e.g. github.com, nytimes.com, yoursite.com)"
            className="w-full pl-10 pr-4 py-3 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !url.trim()}
          className="h-auto py-3 px-6 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            "Preview Social Card"
          )}
        </Button>
      </form>

      {/* Preset quick test links */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Try testing:</span>
        <button
          type="button"
          onClick={() => setUrl("https://github.com")}
          className="hover:text-foreground underline decoration-dotted"
        >
          github.com
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => setUrl("https://stripe.com")}
          className="hover:text-foreground underline decoration-dotted"
        >
          stripe.com
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => setUrl("https://ul0.site")}
          className="hover:text-foreground underline decoration-dotted"
        >
          ul0.site
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Section */}
      {data && (
        <div className="mt-8 space-y-8 animate-in fade-in-50 duration-200">
          {/* Tab Bar */}
          <div className="flex border-b border-border gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("twitter")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0 ${
                activeTab === "twitter"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              X / Twitter Card
            </button>
            <button
              onClick={() => setActiveTab("facebook")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0 ${
                activeTab === "facebook"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Facebook Share
            </button>
            <button
              onClick={() => setActiveTab("linkedin")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0 ${
                activeTab === "linkedin"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              LinkedIn Feed
            </button>
            <button
              onClick={() => setActiveTab("discord")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0 ${
                activeTab === "discord"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Discord Embed
            </button>
          </div>

          {/* Social Mockup Container */}
          <div className="p-6 rounded-2xl border border-border bg-card/50 flex justify-center">
            {/* Twitter Card */}
            {activeTab === "twitter" && (
              <div className="w-full max-w-lg rounded-2xl overflow-hidden border border-border bg-black text-white shadow-md">
                {data.image ? (
                  <div className="relative aspect-[1200/628] w-full bg-neutral-900 border-b border-neutral-800 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[1200/628] w-full bg-neutral-900 flex flex-col items-center justify-center text-neutral-500 text-xs">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-40" />
                    <span>No og:image specified</span>
                  </div>
                )}
                <div className="p-3.5 space-y-1">
                  <p className="text-[11px] text-neutral-400 font-mono truncate">{data.domain}</p>
                  <h4 className="text-sm font-bold line-clamp-1 text-neutral-100">{data.title}</h4>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">{data.description}</p>
                </div>
              </div>
            )}

            {/* Facebook Share */}
            {activeTab === "facebook" && (
              <div className="w-full max-w-lg overflow-hidden border border-border bg-[#18191a] text-[#e4e6eb] rounded-xl shadow-md">
                {data.image ? (
                  <div className="aspect-[1.91/1] w-full bg-neutral-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[1.91/1] w-full bg-neutral-900 flex items-center justify-center text-neutral-500 text-xs">
                    No image
                  </div>
                )}
                <div className="p-3 bg-[#242526] space-y-1 border-t border-[#3a3b3c]">
                  <p className="text-[10px] uppercase text-[#b0b3b8] font-medium tracking-wider">{data.domain}</p>
                  <h4 className="text-sm font-semibold line-clamp-1 text-[#e4e6eb]">{data.title}</h4>
                  <p className="text-xs text-[#b0b3b8] line-clamp-1">{data.description}</p>
                </div>
              </div>
            )}

            {/* LinkedIn Feed */}
            {activeTab === "linkedin" && (
              <div className="w-full max-w-lg overflow-hidden border border-border bg-[#1d2226] text-white rounded-xl shadow-md">
                {data.image ? (
                  <div className="aspect-[1.91/1] w-full bg-neutral-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[1.91/1] w-full bg-neutral-900 flex items-center justify-center text-neutral-500 text-xs">
                    No image
                  </div>
                )}
                <div className="p-3 bg-[#1d2226] space-y-1 border-t border-neutral-700">
                  <h4 className="text-sm font-semibold line-clamp-1 text-white">{data.title}</h4>
                  <p className="text-[11px] text-neutral-400 font-mono">{data.domain}</p>
                </div>
              </div>
            )}

            {/* Discord Embed */}
            {activeTab === "discord" && (
              <div className="w-full max-w-lg rounded-lg border-l-4 border-l-blue-500 bg-[#2b2d31] p-4 text-[#dbdee1] space-y-2.5 shadow-md">
                <span className="text-[11px] text-[#949ba4] font-medium">{data.siteName}</span>
                <h4 className="text-sm font-bold text-blue-400 hover:underline cursor-pointer">{data.title}</h4>
                <p className="text-xs text-[#dbdee1] leading-relaxed line-clamp-3">{data.description}</p>
                {data.image && (
                  <div className="rounded-lg overflow-hidden max-w-md max-h-56 mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.image} alt={data.title} className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tag Quality Audit */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              <span>OpenGraph &amp; Twitter Meta Tag Audit</span>
            </h3>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              {/* Title check */}
              <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">og:title</span>
                  {data.raw.ogTitle ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Present ({titleLen} chars)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-500 font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" /> Missing (Using fallback)
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground truncate">{data.title}</p>
                {titleLen > 65 && (
                  <p className="text-[11px] text-amber-500">
                    Recommended length is under 60-65 characters to prevent truncation on mobile.
                  </p>
                )}
              </div>

              {/* Description check */}
              <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">og:description</span>
                  {data.raw.ogDescription ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Present ({descLen} chars)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-500 font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" /> Missing (Using fallback)
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground line-clamp-1">{data.description || "None"}</p>
                {descLen > 160 && (
                  <p className="text-[11px] text-amber-500">
                    Recommended description length is between 80-155 characters.
                  </p>
                )}
              </div>

              {/* Image check */}
              <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">og:image</span>
                  {data.image ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Detected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-destructive font-medium">
                      <XCircle className="h-3.5 w-3.5" /> Not Found
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground truncate">{data.image || "No image tag detected"}</p>
                <p className="text-[11px] text-muted-foreground">Optimal resolution: 1200x630px (1.91:1 ratio).</p>
              </div>

              {/* Twitter card check */}
              <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">twitter:card</span>
                  <span className="font-mono text-primary font-medium">{data.twitterCard}</span>
                </div>
                <p className="text-muted-foreground">
                  {data.twitterCard === "summary_large_image"
                    ? "Full-width hero image preview enabled on X/Twitter."
                    : "Standard compact square thumbnail preview."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
