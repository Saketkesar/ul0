"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"

interface ExpanderResult {
  success: boolean
  originalUrl: string
  finalUrl: string
  domain: string
  title: string
  description: string
  favicon: string
  hopsCount: number
  isHttps: boolean
  isSafe: boolean
  threatFlag: string | null
}

export function UrlExpanderClient() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ExpanderResult | null>(null)
  const [copied, setCopied] = useState(false)

  const handleExpand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/url-expander", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to expand URL.")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full">
      {/* Input Form */}
      <form onSubmit={handleExpand} className="relative flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
            <UL0Icon name="search" size={18} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste short link (e.g. bit.ly/3xY..., tinyurl.com/..., t.co/...)"
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
              <span>Expanding...</span>
            </>
          ) : (
            <span>Expand URL</span>
          )}
        </button>
      </form>

      {/* Preset quick test links */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground px-2">
        <span>Try testing:</span>
        <button
          type="button"
          onClick={() => setUrl("https://t.co/1P9vP9h7vF")}
          className="hover:text-foreground underline decoration-dotted cursor-pointer"
        >
          t.co sample
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => setUrl("https://tinyurl.com/app")}
          className="hover:text-foreground underline decoration-dotted cursor-pointer"
        >
          tinyurl.com/app
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2.5">
          <UL0Icon name="warning" size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6 animate-in fade-in-50 duration-200">
          {/* Safety Status Banner */}
          <div
            className={`p-5 rounded-3xl border flex items-center justify-between gap-4 ${
              result.isSafe
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <UL0Icon
                name={result.isSafe ? "shield" : "warning"}
                animated={true}
                size={32}
                className="shrink-0"
              />
              <div>
                <h3 className="text-sm font-bold">
                  {result.isSafe ? "Safe Destination Link" : "Caution: Potential Security Risk"}
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  {result.threatFlag ||
                    (result.isSafe
                      ? "No known phishing signals or malicious redirects detected."
                      : "Unsecured HTTP connection or suspicious domain pattern.")}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-background/60 border border-border">
                {result.hopsCount} {result.hopsCount === 1 ? "Hop" : "Hops"}
              </span>
            </div>
          </div>

          {/* Destination Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.favicon}
                  alt={result.domain}
                  className="h-9 w-9 rounded-xl border border-border bg-muted p-1"
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = "none"
                  }}
                />
                <div>
                  <h4 className="text-base font-bold text-foreground leading-snug">{result.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <UL0Icon name="domain" size={14} />
                    <span>{result.domain}</span>
                    {result.isHttps && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <UL0Icon name="lock" size={12} /> HTTPS
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.finalUrl)}
                  className="h-9 px-3.5 text-xs font-semibold rounded-full border border-border bg-surface-2 hover:bg-muted text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UL0Icon name={copied ? "check" : "copy"} size={14} />
                  <span>{copied ? "Copied" : "Copy Target"}</span>
                </button>
                <a
                  href={result.finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <span>Visit Link</span>
                  <UL0Icon name="external" size={14} />
                </a>
              </div>
            </div>

            {result.description && (
              <p className="text-xs text-muted-foreground bg-muted/40 p-3.5 rounded-2xl border border-border/60 leading-relaxed">
                {result.description}
              </p>
            )}

            {/* Path breakdown */}
            <div className="pt-4 border-t border-border space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Shortened Source</span>
                <span className="font-mono truncate max-w-[280px] sm:max-w-md">{result.originalUrl}</span>
              </div>
              <div className="flex items-center justify-between text-foreground">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-primary">Final Destination</span>
                <span className="font-mono font-medium truncate max-w-[280px] sm:max-w-md text-emerald-600 dark:text-emerald-400">
                  {result.finalUrl}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
