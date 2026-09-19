"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Copy,
  Check,
  Search,
  ExternalLink,
  UploadCloud,
  FileText,
  AlertCircle,
  PlusCircle,
  Shield,
  ArrowRight,
  Loader2,
} from "lucide-react"

export interface BlockedThreatItem {
  id: string
  slug: string
  shortUrl: string
  defangedUrl: string
  rawDomain: string
  threatCategory: string
  spoofedBrand: string
  genuineUrl: string
  dateBlocked: string
  threatScore: number
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM"
}

interface Props {
  threats: BlockedThreatItem[]
  blacklistedDomains: string[]
  basinFormKey?: string
}

export function ThreatRadarClient({ threats, blacklistedDomains, basinFormKey = "894e4c18a932fbc39c3ed893a8b8d5e7" }: Props) {
  const [activeTab, setActiveTab] = useState<"directory" | "submit">("directory")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Report Form State
  const [phishingUrl, setPhishingUrl] = useState("")
  const [targetBrand, setTargetBrand] = useState("")
  const [reporterEmail, setReporterEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const filteredThreats = threats.filter((t) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      t.slug.toLowerCase().includes(q) ||
      t.rawDomain.toLowerCase().includes(q) ||
      t.defangedUrl.toLowerCase().includes(q) ||
      t.spoofedBrand.toLowerCase().includes(q)
    )
  })

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phishingUrl.trim()) return

    setSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("phishing_url", phishingUrl)
      formData.append("target_brand", targetBrand)
      formData.append("reporter_contact", reporterEmail)
      formData.append("notes", notes)
      formData.append("submitted_at", new Date().toISOString())
      formData.append("source", "ul0.site/threats")

      if (proofFile) {
        formData.append("proof_image", proofFile)
      }

      const res = await fetch(`https://usebasin.com/f/${basinFormKey}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })

      if (res.ok) {
        setSubmitStatus("success")
        setPhishingUrl("")
        setTargetBrand("")
        setReporterEmail("")
        setNotes("")
        setProofFile(null)
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data.error || "Submission failed. Please try again.")
        setSubmitStatus("error")
      }
    } catch (err: any) {
      console.error("Basin submit error:", err)
      setErrorMessage(err.message || "Network error. Please try again.")
      setSubmitStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Notion-style Page Header with Logo & Icon */}
      <div className="space-y-4 border-b border-border pb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none" role="img" aria-label="shield">
              🛡️
            </span>
            <Image
              src="/ul0.png"
              alt="ul0"
              width={64}
              height={22}
              className="h-5 w-auto object-contain opacity-80 dark:invert"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-muted/50 rounded-lg border border-border/60 text-xs">
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === "directory"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Blocked Links ({threats.length})
            </button>
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "submit"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5 text-muted-foreground" />
              Report Phishing (+ Karma)
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Blocked Phishing Links &amp; Scam Domains
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
            Public directory of deceptive links intercepted and disabled by ul0. All destinations are defanged and blocked from redirecting users.
          </p>
        </div>

        {/* Notion Callout Box */}
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-muted/40 border border-border/80 text-xs text-muted-foreground">
          <span className="text-base select-none mt-0.5">ℹ️</span>
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">Zero Backlink Protection</p>
            <p className="leading-relaxed">
              Scam URLs are displayed as defanged plain text with no active hyperlinks. Search engines do not pass Domain Rating (DR) or link equity to attackers.
            </p>
          </div>
        </div>
      </div>

      {/* TAB 1: NOTION-STYLE DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Permanently Blocked Root Domains */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Permanently Banned Root Domains ({blacklistedDomains.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {blacklistedDomains.map((domain) => (
                <div
                  key={domain}
                  className="px-2.5 py-1 rounded bg-muted/60 border border-border/70 text-xs font-mono text-foreground flex items-center gap-2"
                >
                  <span>*.{domain.replace(".", "[.]")}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-sans">banned</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by slug, brand or domain..."
                className="w-full pl-8 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <span className="text-xs text-muted-foreground font-mono">
              {filteredThreats.length} item{filteredThreats.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Notion Database Table View */}
          <div className="border border-border rounded-lg overflow-hidden bg-background shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-medium">
                    <th className="py-2.5 px-3.5 w-36">Short Link</th>
                    <th className="py-2.5 px-3.5">Defanged Malicious Destination</th>
                    <th className="py-2.5 px-3.5 w-32">Spoofed Brand</th>
                    <th className="py-2.5 px-3.5 w-24">Status</th>
                    <th className="py-2.5 px-3.5 w-28 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredThreats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground text-xs">
                        No blocked links match your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredThreats.map((threat) => (
                      <tr key={threat.id} className="hover:bg-muted/20 transition-colors">
                        {/* Short Link */}
                        <td className="py-2.5 px-3.5 font-mono font-medium text-foreground">
                          <Link
                            href={`/r/${threat.slug}`}
                            target="_blank"
                            className="hover:underline text-foreground"
                          >
                            ul0.site/{threat.slug}
                          </Link>
                        </td>

                        {/* Defanged Destination (Pure text - NO <a> tag, zero backlink) */}
                        <td className="py-2.5 px-3.5 font-mono text-muted-foreground max-w-md">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate select-all" title={threat.defangedUrl}>
                              {threat.defangedUrl}
                            </span>
                            <button
                              onClick={() => copyText(threat.id, threat.defangedUrl)}
                              className="shrink-0 p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy defanged text"
                            >
                              {copiedId === threat.id ? (
                                <Check className="h-3 w-3 text-foreground" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Spoofed Brand */}
                        <td className="py-2.5 px-3.5 text-foreground">
                          <span className="px-2 py-0.5 rounded bg-muted/60 text-[11px] font-medium border border-border/50">
                            {threat.spoofedBrand}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3.5 font-mono">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                            BLOCKED
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-2.5 px-3.5 text-right text-muted-foreground font-mono text-[11px]">
                          {threat.dateBlocked}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NOTION-STYLE REPORT FORM (UseBasin) */}
      {activeTab === "submit" && (
        <div className="space-y-6 max-w-2xl">
          <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-1">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <span>✨</span> Submit a Phishing Link &amp; Earn Good Karma
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Found a deceptive link targeting innocent users? Submit it below with a screenshot. All submissions go directly to our security review inbox for immediate blacklisting.
            </p>
          </div>

          {submitStatus === "success" && (
            <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs space-y-1">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Report Received! Good Karma Earned 🌟
              </p>
              <p className="text-muted-foreground">
                Thank you for helping keep the internet safe. Our security team will review and block this domain across the platform.
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400">
              <p className="font-semibold">Submission failed</p>
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {/* Phishing URL */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground block">
                Phishing / Scam Link <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phishingUrl}
                onChange={(e) => setPhishingUrl(e.target.value)}
                placeholder="https://scam-site.click/login or short link"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Enter the short link or destination phishing URL you encountered.
              </p>
            </div>

            {/* Target Brand */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground block">
                Brand Being Spoofed / Targeted
              </label>
              <input
                type="text"
                value={targetBrand}
                onChange={(e) => setTargetBrand(e.target.value)}
                placeholder="e.g. Telegram, Libero Mail, PayPal, Google, Bank"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Proof Image Upload */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground block">
                Proof Screenshot / Image
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-3 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg font-medium text-foreground flex items-center gap-2 transition-colors">
                  <UploadCloud className="h-4 w-4 text-muted-foreground" />
                  <span>{proofFile ? proofFile.name : "Attach Screenshot"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProofFile(e.target.files[0])
                      }
                    }}
                  />
                </label>
                {proofFile && (
                  <button
                    type="button"
                    onClick={() => setProofFile(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Upload a screenshot showing the fake login, message, or redirect.
              </p>
            </div>

            {/* Reporter Contact / Email (Optional) */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground block">
                Your Contact / Handle (Optional)
              </label>
              <input
                type="text"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="email@example.com or @telegram_handle"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground"
              />
              <p className="text-[11px] text-muted-foreground">
                Optional. If you want updates when the scam is neutralized.
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground block">
                Additional Notes / Context
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Where did you find this link? (Telegram group, SMS, email phishing...)"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-foreground text-background font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Submitting to Basin...</span>
                </>
              ) : (
                <>
                  <span>Submit Phishing Report (+ Karma 🌟)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Clean Notion footer notes */}
      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>ul0 Trust &amp; Safety</span>
          <span>•</span>
          <Link href="/security" className="hover:underline">
            Security Architecture
          </Link>
          <span>•</span>
          <Link href="/report-abuse" className="hover:underline">
            Report Abuse
          </Link>
        </div>
        <p className="font-mono text-[11px]">Powered by ul0 Anti-Phishing Guard</p>
      </div>
    </div>
  )
}
