"use client"

import React, { useState } from "react"
import { Search, Loader2, ArrowRight, ShieldCheck, AlertTriangle, ExternalLink, Copy, Check, Globe, Lock, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      <form onSubmit={handleExpand} className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste short link (e.g. bit.ly/3xY..., tinyurl.com/..., t.co/...)"
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
              Expanding...
            </>
          ) : (
            "Expand URL"
          )}
        </Button>
      </form>

      {/* Preset quick test links */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Try testing:</span>
        <button
          type="button"
          onClick={() => setUrl("https://t.co/1P9vP9h7vF")}
          className="hover:text-foreground underline decoration-dotted"
        >
          t.co sample
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => setUrl("https://tinyurl.com/app")}
          className="hover:text-foreground underline decoration-dotted"
        >
          tinyurl.com/app
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6 animate-in fade-in-50 duration-200">
          {/* Safety Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              result.isSafe
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}
          >
            <div className="flex items-center gap-3">
              {result.isSafe ? (
                <ShieldCheck className="h-6 w-6 shrink-0" />
              ) : (
                <ShieldAlert className="h-6 w-6 shrink-0" />
              )}
              <div>
                <h3 className="text-sm font-bold">
                  {result.isSafe ? "Safe Destination Link" : "Caution: Potential Security Risk"}
                </h3>
                <p className="text-xs opacity-90">
                  {result.threatFlag ||
                    (result.isSafe
                      ? "No known phishing signals or malicious redirects detected."
                      : "Unsecured HTTP connection or suspicious domain pattern.")}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-background/50 border border-border">
                {result.hopsCount} {result.hopsCount === 1 ? "Hop" : "Hops"}
              </span>
            </div>
          </div>

          {/* Destination Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.favicon}
                  alt={result.domain}
                  className="h-8 w-8 rounded-lg border border-border bg-muted p-1"
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = "none"
                  }}
                />
                <div>
                  <h4 className="text-base font-bold text-foreground leading-snug">{result.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Globe className="h-3 w-3" />
                    <span>{result.domain}</span>
                    {result.isHttps && (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Lock className="h-2.5 w-2.5" /> HTTPS
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(result.finalUrl)}
                  className="h-8 text-xs gap-1.5 rounded-lg"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy Target"}
                </Button>
                <a
                  href={result.finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Visit Link
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {result.description && (
              <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50 leading-relaxed">
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
