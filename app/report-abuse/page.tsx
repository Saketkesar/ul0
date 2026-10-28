"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Flag, CheckCircle2, AlertTriangle, Shield, Clock } from "lucide-react"
import Link from "next/link"

function ReportAbuseContent() {
  const searchParams = useSearchParams()
  const [shortUrl, setShortUrl] = useState("")
  const [reason, setReason] = useState("phishing")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const urlParam = searchParams.get("url")
    if (urlParam) {
      setShortUrl(urlParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shortUrl.trim()) {
      setError("Please enter the short link URL in question.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/report-abuse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shortUrl: shortUrl.trim(),
          reason,
          description: description.trim(),
          email: email.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit abuse report.")
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl py-12 sm:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border border-border bg-muted/40 text-muted-foreground">
          <Flag className="h-3 w-3 text-destructive" />
          <span>Trust &amp; Safety</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Report an Abusive or Malicious Short Link
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          We maintain zero tolerance for phishing, malware, scam redirects, and illegal content.
          Verified malicious links are deactivated immediately.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">Report Received</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Our automated scanning pipeline and safety reviewers have logged this report for{" "}
              <strong className="font-mono text-foreground">{shortUrl}</strong>. Confirmed policy
              violations will be neutralized.
            </p>
          </div>
          <div className="pt-2">
            <Button
              onClick={() => {
                setSubmitted(false)
                setShortUrl("")
                setDescription("")
              }}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Report another link
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="shortUrl" className="text-xs font-semibold text-foreground">
              Short Link in Question <span className="text-destructive">*</span>
            </label>
            <Input
              id="shortUrl"
              type="text"
              value={shortUrl}
              onChange={(e) => setShortUrl(e.target.value)}
              placeholder="https://ul0.site/r/example or slug"
              className="font-mono text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reason" className="text-xs font-semibold text-foreground">
              Violation Category <span className="text-destructive">*</span>
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="phishing">Phishing / Deceptive clone of a legitimate site</option>
              <option value="malware">Malware / Virus distribution</option>
              <option value="scam">Scam / Financial fraud / Counterfeit</option>
              <option value="spam">Spam / Unsolicited bulk messaging</option>
              <option value="illegal">Illegal content or copyright violation</option>
              <option value="other">Other policy violation</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-semibold text-foreground">
              Additional Details (optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurs when visiting the link or provide the destination URL if known."
              rows={3}
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-foreground">
              Your Email Address (optional, for follow-up only)
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="text-xs"
            />
          </div>

          <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Review time: usually under 2 hours for high-risk phishing</span>
            </div>
            <Button type="submit" size="sm" disabled={loading} className="text-xs w-full sm:w-auto">
              {loading ? "Submitting..." : "Submit Abuse Report"}
            </Button>
          </div>
        </form>
      )}

      {/* Safety Policy summary */}
      <div className="rounded-lg border border-border bg-muted/20 p-5 space-y-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-primary" />
          Automated Threat Screening
        </span>
        <p className="leading-relaxed">
          Every destination URL shortened on UL0 is evaluated against public threat feeds and blocklists.
          If you are a security researcher, law enforcement agency, or domain registrar, you may also email
          direct urgent takedown requests to <strong className="text-foreground font-mono">abuse@ul0.site</strong>.
        </p>
      </div>
    </div>
  )
}

export default function ReportAbusePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center text-xs text-muted-foreground">Loading...</div>}>
          <ReportAbuseContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
