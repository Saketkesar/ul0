"use client"

import React, { useState } from "react"
import { UL0Icon } from "@/components/ul0-icon"
import { Button } from "@/components/ui/button"

interface Hop {
  hop: number
  url: string
  status: number
  statusText: string
  location?: string
  latencyMs: number
  server?: string
  contentType?: string
}

interface ResultData {
  originalUrl: string
  finalUrl: string
  finalStatus: number
  totalHops: number
  totalTimeMs: number
  hops: Hop[]
}

export function RedirectCheckerClient() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResultData | null>(null)
  const [copied, setCopied] = useState(false)

  const handleTrace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/redirect-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to trace redirects.")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const copyResults = () => {
    if (!result) return
    const text = `Redirect Trace for ${result.originalUrl}\nTotal Hops: ${result.totalHops} (${result.totalTimeMs}ms)\nFinal URL: ${result.finalUrl} (${result.finalStatus})\n\n` +
      result.hops.map(h => `Hop ${h.hop}: ${h.status} -> ${h.location || h.url} (${h.latencyMs}ms)`).join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadge = (status: number) => {
    if (status === 200) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{status} OK</span>
    }
    if (status === 301 || status === 308) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{status} Permanent</span>
    }
    if (status === 302 || status === 307) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">{status} Temporary</span>
    }
    if (status >= 400) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">{status} Error</span>
    }
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-muted text-muted-foreground">{status}</span>
  }

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <form onSubmit={handleTrace} className="rounded-3xl border border-border/60 bg-card p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <UL0Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. bit.ly/3example or https://yourdomain.com/old-page"
              className="w-full h-11 pl-10 pr-4 rounded-full border border-border/60 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 px-6 rounded-full font-semibold shrink-0 cursor-pointer shadow-xs"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <UL0Icon name="loading" size={16} className="animate-spin" />
                <span>Tracing...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Trace Redirects</span>
                <UL0Icon name="arrowright" size={16} />
              </span>
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <UL0Icon name="warning" size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Results Box */}
      {result && (
        <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-xs animate-in fade-in duration-300">
          {/* Header Summary */}
          <div className="p-5 sm:p-6 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                <span>Analysis Complete</span>
                <span>•</span>
                <span className="text-foreground">{result.totalHops} {result.totalHops === 1 ? "Hop" : "Hops"}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-foreground">
                  <UL0Icon name="clock" size={12} />
                  {result.totalTimeMs}ms
                </span>
              </div>
              <p className="text-sm font-bold text-foreground break-all">
                Final Target: <span className="text-primary font-mono text-xs">{result.finalUrl}</span>
              </p>
            </div>

            <Button
              onClick={copyResults}
              variant="outline"
              size="sm"
              className="shrink-0 text-xs gap-1.5 cursor-pointer rounded-full"
            >
              {copied ? <UL0Icon name="check" size={14} /> : <UL0Icon name="copy" size={14} />}
              <span>{copied ? "Copied" : "Copy Trace"}</span>
            </Button>
          </div>

          {/* Hop Timeline */}
          <div className="p-5 sm:p-6 space-y-4">
            {result.hops.map((hop, idx) => (
              <div
                key={idx}
                className="relative flex items-start gap-4 p-4 rounded-2xl border border-border/60 bg-background/50 hover:bg-muted/10 transition-colors"
              >
                {/* Hop Number Pill */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-mono font-bold text-muted-foreground shrink-0 mt-0.5">
                  {hop.hop}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {getStatusBadge(hop.status)}
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <UL0Icon name="clock" size={12} />
                      {hop.latencyMs}ms
                      {hop.server && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <UL0Icon name="server" size={12} />
                            {hop.server}
                          </span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-foreground break-all">
                    {hop.url}
                  </p>

                  {hop.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                      <UL0Icon name="arrowright" size={12} className="shrink-0 text-primary" />
                      <span className="font-mono text-[11px] text-primary break-all">
                        {hop.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
