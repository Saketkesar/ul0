"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Lock,
  Unlock,
  AlertTriangle,
  Link2,
  QrCode,
  Sparkles,
  Loader2,
} from "lucide-react"
import Link from "next/link"

interface RedirectHop {
  url: string
  status: number
  host: string
}

interface ExpandResult {
  originalUrl: string
  finalUrl: string
  isHttps: boolean
  hopsCount: number
  redirectChain: RedirectHop[]
  domain: string
  isSuspicious: boolean
  securityWarnings: string[]
  trustScore: number
}

export default function UrlExpanderPage() {
  const [inputUrl, setInputUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ExpandResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleExpand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputUrl.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl.trim() }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to inspect URL")
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || "An error occurred while checking this link.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePreset = (url: string) => {
    setInputUrl(url)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
              <ShieldCheck className="h-4 w-4" />
              Free Link Safety &amp; Unshortener Tool
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              URL Expander &amp; Link Safety Checker
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
              Unshorten any Bitly, TinyURL, or shortened link to reveal its true final destination, inspect the redirect chain, and check security safety before clicking.
            </p>
          </div>

          {/* Search Box Card */}
          <Card className="border-border bg-card/80 shadow-md">
            <CardContent className="p-5 sm:p-7">
              <form onSubmit={handleExpand} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Paste short link here (e.g. bit.ly/xyz or ul0.site/r/...)"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="pl-10 h-11 text-sm bg-background"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading || !inputUrl.trim()} className="h-11 px-6 font-semibold">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inspecting...
                      </>
                    ) : (
                      "Expand & Inspect"
                    )}
                  </Button>
                </div>

                {/* Example shortener presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <span>Try examples:</span>
                  <button
                    type="button"
                    onClick={() => handlePreset("https://ul0.site/split")}
                    className="rounded bg-muted px-2 py-0.5 hover:bg-accent text-foreground transition-colors"
                  >
                    ul0.site/split
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreset("https://t.co/example")}
                    className="rounded bg-muted px-2 py-0.5 hover:bg-accent text-foreground transition-colors"
                  >
                    t.co shortener
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreset("https://bit.ly/4example")}
                    className="rounded bg-muted px-2 py-0.5 hover:bg-accent text-foreground transition-colors"
                  >
                    bit.ly link
                  </button>
                </div>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Panel */}
          {result && (
            <div className="mt-8 space-y-6 animate-in fade-in duration-300">
              <Card className="border-border overflow-hidden">
                <div className={`p-4 border-b ${result.isSuspicious ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    {result.isSuspicious ? (
                      <ShieldAlert className="h-5 w-5 text-rose-500" />
                    ) : (
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    )}
                    <span className="font-semibold text-sm">
                      {result.isSuspicious ? "Warning: Potential Phishing or High-Risk Destination" : "Verified Destination Resolved"}
                    </span>
                  </div>
                  <Badge variant={result.isSuspicious ? "destructive" : "secondary"} className="text-xs">
                    Trust Score: {result.trustScore}/100
                  </Badge>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Final Destination Highlight */}
                  <div>
                    <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Final Target Destination
                    </span>
                    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                      <div className="break-all font-mono text-sm font-semibold text-foreground">
                        {result.finalUrl}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(result.finalUrl)}
                          className="h-8 gap-1.5 text-xs"
                        >
                          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          {copied ? "Copied" : "Copy"}
                        </Button>
                        <a
                          href={result.finalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Visit <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Security Attributes Grid */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        {result.isHttps ? <Lock className="h-4 w-4 text-emerald-500" /> : <Unlock className="h-4 w-4 text-rose-500" />}
                        Protocol Security
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {result.isHttps ? "HTTPS Encrypted" : "Unencrypted HTTP"}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="text-xs text-muted-foreground mb-1">Resolved Domain</div>
                      <div className="text-sm font-bold text-foreground truncate font-mono">
                        {result.domain}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="text-xs text-muted-foreground mb-1">Total Redirect Hops</div>
                      <div className="text-sm font-bold text-foreground">
                        {result.hopsCount} {result.hopsCount === 1 ? "direct request" : "redirect hops"}
                      </div>
                    </div>
                  </div>

                  {/* Warnings if any */}
                  {result.securityWarnings && result.securityWarnings.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                      <div className="font-semibold flex items-center gap-1.5 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Safety Warnings Detected:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 pt-1">
                        {result.securityWarnings.map((warn, i) => (
                          <li key={i}>{warn}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Visual Redirect Chain */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Redirect Chain Trace</h3>
                    <div className="space-y-2 font-mono text-xs">
                      {result.redirectChain.map((hop, index) => (
                        <div key={index} className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-background">
                          <span className="rounded bg-muted px-1.5 py-0.5 font-bold text-foreground">
                            #{index + 1}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-semibold ${hop.status >= 200 && hop.status < 300 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'}`}>
                            HTTP {hop.status}
                          </span>
                          <span className="break-all text-muted-foreground flex-1">
                            {hop.url}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Related Tools */}
                  <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">What would you like to do next?</span>
                    <div className="flex gap-2">
                      <Link href="/" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
                        <Link2 className="h-3.5 w-3.5" /> Shorten on ul0
                      </Link>
                      <span className="text-muted-foreground">•</span>
                      <Link href={`/qr-code-generator?url=${encodeURIComponent(result.finalUrl)}`} className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
                        <QrCode className="h-3.5 w-3.5" /> Make QR Code
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Educational Content & FAQ */}
          <div className="mt-16 space-y-10 text-muted-foreground text-sm leading-relaxed border-t border-border pt-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Why Use a URL Expander Before Clicking?</h2>
              <p>
                Shortened URLs created on platforms like Bitly, TinyURL, or t.co conceal the real target destination. While this is great for clean character counts in tweets and marketing emails, malicious actors frequently abuse URL shorteners to mask phishing websites, credential harvest pages, and malware downloads.
              </p>
              <p className="mt-2">
                The <strong>ul0 URL Expander</strong> sends a lightweight HTTP request from our edge servers to trace the exact server-side HTTP 301, 302, and 307 redirect hops without executing client-side scripts, protecting you from malicious browser exploits.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2">1. Reveal Hidden Destinations</h3>
                <p className="text-xs text-muted-foreground">
                  See where the link takes you before loading it in your browser. Verify the root domain and ensure it matches the expected sender.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2">2. Uncover Multi-Hop Redirects</h3>
                <p className="text-xs text-muted-foreground">
                  Spammers often chain multiple shorteners together (e.g. Shortener A → Shortener B → Scam Site). Our expander reveals the full hop history.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2">3. Verify HTTPS Encryption</h3>
                <p className="text-xs text-muted-foreground">
                  Check whether the target destination uses TLS encryption (HTTPS) or transmits data in plain text unencrypted HTTP.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2">4. Free &amp; Unlimited</h3>
                <p className="text-xs text-muted-foreground">
                  Check as many links as you need with zero registration required. Perfect for cyber-security analysts, marketers, and everyday browsing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
