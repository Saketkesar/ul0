"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"

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
      <form onSubmit={handleInspect} className="relative flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
            <UL0Icon name="domain" size={18} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to preview (e.g. github.com, nytimes.com, yoursite.com)"
            className="w-full pl-11 pr-4 py-3.5 text-sm bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-2xs"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="h-auto py-3.5 px-7 text-sm font-semibold rounded-full bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground shadow-2xs transition-all cursor-pointer inline-flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <UL0Icon name="loading" animated={true} size={16} />
              <span>Scanning...</span>
            </>
          ) : (
            <span>Preview Social Card</span>
          )}
        </button>
      </form>

      {/* Preset quick test links */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground px-2">
        <span>Try testing:</span>
        <button
          type="button"
          onClick={() => setUrl("https://github.com")}
          className="hover:text-foreground underline decoration-dotted cursor-pointer"
        >
          github.com
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => setUrl("https://stripe.com")}
          className="hover:text-foreground underline decoration-dotted cursor-pointer"
        >
          stripe.com
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => setUrl("https://ul0.site")}
          className="hover:text-foreground underline decoration-dotted cursor-pointer"
        >
          ul0.site
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2.5">
          <UL0Icon name="warning" size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Section */}
      {data && (
        <div className="mt-8 space-y-8 animate-in fade-in-50 duration-200">
          {/* Tab Bar */}
          <div className="flex border-b border-border gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab("twitter")}
              className={`px-4 py-2 text-xs sm:text-sm rounded-full transition-colors shrink-0 cursor-pointer ${
                activeTab === "twitter"
                  ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground font-medium"
              }`}
            >
              X / Twitter Card
            </button>
            <button
              onClick={() => setActiveTab("facebook")}
              className={`px-4 py-2 text-xs sm:text-sm rounded-full transition-colors shrink-0 cursor-pointer ${
                activeTab === "facebook"
                  ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground font-medium"
              }`}
            >
              Facebook Share
            </button>
            <button
              onClick={() => setActiveTab("linkedin")}
              className={`px-4 py-2 text-xs sm:text-sm rounded-full transition-colors shrink-0 cursor-pointer ${
                activeTab === "linkedin"
                  ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground font-medium"
              }`}
            >
              LinkedIn Feed
            </button>
            <button
              onClick={() => setActiveTab("discord")}
              className={`px-4 py-2 text-xs sm:text-sm rounded-full transition-colors shrink-0 cursor-pointer ${
                activeTab === "discord"
                  ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground font-medium"
              }`}
            >
              Discord Embed
            </button>
          </div>

          {/* Social Mockup Container */}
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card/60 flex justify-center shadow-2xs">
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
                    <UL0Icon name="image" size={32} className="mb-2 opacity-40" />
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
              <div className="w-full max-w-lg overflow-hidden border border-border bg-[#18191a] text-[#e4e6eb] rounded-2xl shadow-md">
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
              <div className="w-full max-w-lg overflow-hidden border border-border bg-[#1d2226] text-white rounded-2xl shadow-md">
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
              <div className="w-full max-w-lg rounded-2xl border-l-4 border-l-emerald-500 bg-[#2b2d31] p-4 text-[#dbdee1] space-y-2.5 shadow-md">
                <span className="text-[11px] text-[#949ba4] font-medium">{data.siteName}</span>
                <h4 className="text-sm font-bold text-emerald-400 hover:underline cursor-pointer">{data.title}</h4>
                <p className="text-xs text-[#dbdee1] leading-relaxed line-clamp-3">{data.description}</p>
                {data.image && (
                  <div className="rounded-xl overflow-hidden max-w-md max-h-56 mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.image} alt={data.title} className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tag Quality Audit */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <UL0Icon name="share" animated={true} size={18} />
              <span>OpenGraph &amp; Twitter Meta Tag Audit</span>
            </h3>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              {/* Title check */}
              <div className="p-4 rounded-2xl border border-border bg-background space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">og:title</span>
                  {data.raw.ogTitle ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <UL0Icon name="check" size={14} /> Present ({titleLen} chars)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                      <UL0Icon name="warning" size={14} /> Missing (Using fallback)
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
              <div className="p-4 rounded-2xl border border-border bg-background space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">og:description</span>
                  {data.raw.ogDescription ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <UL0Icon name="check" size={14} /> Present ({descLen} chars)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                      <UL0Icon name="warning" size={14} /> Missing (Using fallback)
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
              <div className="p-4 rounded-2xl border border-border bg-background space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">og:image</span>
                  {data.image ? (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <UL0Icon name="check" size={14} /> Detected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-destructive font-medium">
                      <UL0Icon name="close" size={14} /> Not Found
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground truncate">{data.image || "No image tag detected"}</p>
                <p className="text-[11px] text-muted-foreground">Optimal resolution: 1200x630px (1.91:1 ratio).</p>
              </div>

              {/* Twitter card check */}
              <div className="p-4 rounded-2xl border border-border bg-background space-y-1">
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
