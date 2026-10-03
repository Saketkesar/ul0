"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Loader2,
  ExternalLink,
  Send,
  Eye,
  Star,
  Layers,
  ShieldCheck,
  RefreshCw,
} from "lucide-react"

export default function SeoDashboardPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitResults, setSubmitResults] = useState<any>(null)

  const [auditUrl, setAuditUrl] = useState("https://ul0.site")
  const [auditing, setAuditing] = useState(false)
  const [auditResults, setAuditResults] = useState<any>(null)

  // 1. Submit All URLs to Search Engines
  const handleSubmitUrls = async () => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/seo/submit", { method: "POST" })
      const data = await res.json()
      setSubmitResults(data)
    } catch (err: any) {
      setSubmitResults({ error: err.message || "Failed to submit" })
    } finally {
      setSubmitting(false)
    }
  }

  // 2. Audit a specific page
  const handleAudit = async (urlToAudit?: string) => {
    const target = urlToAudit || auditUrl
    setAuditing(true)
    try {
      const res = await fetch("/api/seo/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      })
      const data = await res.json()
      setAuditResults(data)
    } catch (err: any) {
      setAuditResults({ error: err.message || "Failed to audit" })
    } finally {
      setAuditing(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 py-8">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Organic Search Engine Optimizer</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Google Search Console &amp; SEO Health
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Monitor indexation, submit sitemaps, test Google rich snippets, and optimize US organic traffic.
              </p>
            </div>

            <Button
              onClick={handleSubmitUrls}
              disabled={submitting}
              className="h-10 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Submitting to Engines...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Ping Search Engines Now
                </>
              )}
            </Button>
          </div>

          {/* Quick Metrics & Config Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Card 1: Google Verification */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Google Verification</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-lg font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span>Verified in &lt;head&gt;</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Verification meta token is configured on all pages. Google Search Console has verified site ownership.
              </p>
            </div>

            {/* Card 2: Sitemap & Robots */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Sitemap Status</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-lg font-bold text-foreground flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <span>85+ URLs Published</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Dynamic sitemap at <code className="text-foreground font-mono">/sitemap.xml</code> with daily recrawl priority.
              </p>
            </div>

            {/* Card 3: Rich Snippet Gold Stars */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Google SERP Snippet</span>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              </div>
              <div className="text-lg font-bold text-foreground flex items-center gap-1.5 text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <span className="text-xs font-bold text-foreground ml-1">4.9 / 5</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                SoftwareApplication Schema active with AggregateRating to trigger gold review stars in Google SERPs.
              </p>
            </div>
          </div>

          {/* Submission Feedback Banner */}
          {submitResults && (
            <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Search Engine Submission Status</span>
              </h3>
              <div className="space-y-2 text-xs">
                {submitResults.results?.map((r: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                    <span className="font-semibold text-foreground">{r.service}</span>
                    <span className="text-[11px] text-muted-foreground">{r.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Page SEO Auditor & SERP Simulator */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span>Live Google SERP Simulator &amp; On-Page Audit</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Inspect how Googlebot sees any page on your website, view your live Google search preview, and find instant CTR improvements.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground text-[11px]">Quick audit:</span>
              <button
                type="button"
                onClick={() => {
                  setAuditUrl("https://ul0.site")
                  handleAudit("https://ul0.site")
                }}
                className="px-2.5 py-1 rounded-lg border border-border hover:bg-accent text-foreground text-[11px] font-medium"
              >
                Homepage (/)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuditUrl("https://ul0.site/backlinks")
                  handleAudit("https://ul0.site/backlinks")
                }}
                className="px-2.5 py-1 rounded-lg border border-border hover:bg-accent text-foreground text-[11px] font-medium"
              >
                Backlinks (/backlinks)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuditUrl("https://ul0.site/tools/pdf-splitter")
                  handleAudit("https://ul0.site/tools/pdf-splitter")
                }}
                className="px-2.5 py-1 rounded-lg border border-border hover:bg-accent text-foreground text-[11px] font-medium"
              >
                PDF Splitter (/tools/pdf-splitter)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuditUrl("https://ul0.site/pricing")
                  handleAudit("https://ul0.site/pricing")
                }}
                className="px-2.5 py-1 rounded-lg border border-border hover:bg-accent text-foreground text-[11px] font-medium"
              >
                Pricing (/pricing)
              </button>
            </div>

            {/* Audit Input Form */}
            <div className="flex gap-2">
              <input
                type="url"
                value={auditUrl}
                onChange={(e) => setAuditUrl(e.target.value)}
                placeholder="https://ul0.site/tools/..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                onClick={() => handleAudit()}
                disabled={auditing}
                className="h-10 px-5 text-xs font-semibold rounded-xl"
              >
                {auditing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run Audit"}
              </Button>
            </div>

            {/* Audit Results */}
            {auditResults && !auditResults.error && (
              <div className="space-y-6 pt-4 border-t border-border animate-in fade-in-50">
                {/* Score Header */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">On-Page SEO Score</h4>
                    <p className="text-xs text-muted-foreground">{auditResults.url}</p>
                  </div>
                  <div className="text-2xl font-black text-primary">
                    {auditResults.score} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
                  </div>
                </div>

                {/* Simulated Google Search Result */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-muted-foreground">Simulated Google Search Result:</div>
                  <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-background shadow-xs max-w-2xl space-y-1.5 font-sans">
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px]">
                        🔗
                      </div>
                      <span className="truncate">{auditResults.checks?.canonical?.value || "https://ul0.site"}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                      {auditResults.checks?.title?.value || "Page Title"}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-amber-500 py-0.5">
                      <div className="flex">
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                        <Star className="h-3 w-3 fill-amber-500" />
                      </div>
                      <span className="text-neutral-600 dark:text-neutral-400 text-[11px]">
                        Rating: 4.9 · 348 reviews · Free · Web app
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                      {auditResults.checks?.description?.value || "Meta description will appear here in Google search results."}
                    </p>
                  </div>
                </div>

                {/* Audit Checklist */}
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Title Tag</span>
                      <span className={auditResults.checks?.title?.ok ? "text-emerald-500" : "text-amber-500"}>
                        {auditResults.checks?.title?.length} chars
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{auditResults.checks?.title?.value}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Meta Description</span>
                      <span className={auditResults.checks?.description?.ok ? "text-emerald-500" : "text-amber-500"}>
                        {auditResults.checks?.description?.length} chars
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{auditResults.checks?.description?.value}</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>H1 Heading</span>
                      <span className={auditResults.checks?.h1?.ok ? "text-emerald-500" : "text-amber-500"}>
                        {auditResults.checks?.h1?.count} H1 tags
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Optimal: Exactly one primary H1</p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>JSON-LD Schema</span>
                      <span className={auditResults.checks?.structuredData?.ok ? "text-emerald-500" : "text-amber-500"}>
                        {auditResults.checks?.structuredData?.ok ? "Active" : "Missing"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">SoftwareApplication &amp; Navigation Schemas</p>
                  </div>
                </div>

                {/* Suggestions */}
                {auditResults.suggestions?.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 space-y-1.5">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Recommended Optimizations:</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 opacity-90">
                      {auditResults.suggestions.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
