"use client"

import React, { useState } from "react"
import { Copy, Check, Code, Eye, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MetaTagClient() {
  const [title, setTitle] = useState("UL0 — Fast, Secure Link Management & Analytics")
  const [description, setDescription] = useState(
    "Transform long links into secure, branded short URLs with real-time geographic click tracking and dynamic QR codes."
  )
  const [url, setUrl] = useState("https://ul0.site")
  const [imageUrl, setImageUrl] = useState("https://ul0.site/og-image.png")
  const [siteName, setSiteName] = useState("UL0")
  const [twitterHandle, setTwitterHandle] = useState("@ul0site")
  const [robots, setRobots] = useState("index, follow")
  const [copied, setCopied] = useState(false)
  const [previewTab, setPreviewTab] = useState<"google" | "social">("google")

  const generatedHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:site_name" content="${siteName}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">
<meta property="twitter:site" content="${twitterHandle}">`

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const titleLength = title.length
  const descLength = description.length

  return (
    <div className="grid gap-8 lg:grid-cols-2 items-start">
      {/* Configuration Form */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Page Metadata Builder</span>
        </h3>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-foreground">Page Title</label>
            <span
              className={`font-mono text-[11px] ${
                titleLength > 60 ? "text-amber-500 font-bold" : "text-muted-foreground"
              }`}
            >
              {titleLength}/60 chars
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Acme — The Next-Gen Workspace"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-foreground">Meta Description</label>
            <span
              className={`font-mono text-[11px] ${
                descLength > 160 ? "text-amber-500 font-bold" : "text-muted-foreground"
              }`}
            >
              {descLength}/160 chars
            </span>
          </div>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="A concise summary of your webpage for search engines and social feeds..."
          />
        </div>

        {/* Canonical URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Canonical URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/product"
          />
        </div>

        {/* OG Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Social Share Image URL (1200x630)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/assets/og-image.png"
          />
        </div>

        {/* Site Name & Twitter Handle */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Twitter Handle</label>
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Robots */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Search Engine Robots</label>
          <select
            value={robots}
            onChange={(e) => setRobots(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="index, follow">index, follow (Standard Public Page)</option>
            <option value="noindex, follow">noindex, follow (Hide page, follow links)</option>
            <option value="noindex, nofollow">noindex, nofollow (Private/Admin page)</option>
          </select>
        </div>
      </div>

      {/* Previews and Code Generation */}
      <div className="space-y-6">
        {/* Live Snippet Preview */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">Live Search &amp; Social Preview</h4>
            </div>
            <div className="flex rounded-lg border border-border p-0.5 bg-muted text-xs">
              <button
                type="button"
                onClick={() => setPreviewTab("google")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  previewTab === "google" ? "bg-background text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                }`}
              >
                Google SERP
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("social")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  previewTab === "social" ? "bg-background text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                }`}
              >
                Social Card
              </button>
            </div>
          </div>

          {previewTab === "google" ? (
            <div className="p-4 rounded-xl border border-border bg-background space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Search className="h-3 w-3" />
                <span className="truncate">{url}</span>
              </div>
              <h5 className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
                {title || "Page Title"}
              </h5>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {description || "Meta description will appear here in search engine result pages."}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden bg-background">
              <div className="aspect-[1.91/1] w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = "none"
                    }}
                  />
                ) : (
                  "Image Preview"
                )}
              </div>
              <div className="p-3 space-y-1 border-t border-border">
                <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">
                  {siteName}
                </span>
                <h5 className="text-xs font-bold text-foreground line-clamp-1">{title}</h5>
                <p className="text-[11px] text-muted-foreground line-clamp-1">{description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Copyable HTML Code Block */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">Generated HTML Meta Tags</h4>
            </div>
            <Button
              size="sm"
              onClick={handleCopy}
              className="h-8 text-xs gap-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied HTML!" : "Copy HTML"}
            </Button>
          </div>

          <pre className="p-4 rounded-xl bg-muted/60 text-foreground font-mono text-xs overflow-x-auto leading-relaxed border border-border">
            <code>{generatedHtml}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
