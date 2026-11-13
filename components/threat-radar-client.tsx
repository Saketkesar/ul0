"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { UL0Icon } from "@/components/ul0-icon"

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
  basinFormUuid?: string
}

export function ThreatRadarClient({
  threats,
  blacklistedDomains,
  basinFormUuid = "16f38d46e9f3",
}: Props) {
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
      formData.append("phishing_url", phishingUrl.trim())
      formData.append("target_brand", targetBrand.trim())
      formData.append("reporter_contact", reporterEmail.trim())
      formData.append("notes", notes.trim())
      formData.append("submitted_at", new Date().toISOString())
      formData.append("source", "ul0.site/threats")

      if (proofFile) {
        formData.append("proof_image", proofFile)
      }

      // First try internal API route, fallback to direct UseBasin POST
      let response = await fetch("/api/report-phishing", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        // Fallback directly to UseBasin endpoint
        response = await fetch(`https://usebasin.com/f/${basinFormUuid}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        })
      }

      if (response.ok) {
        setSubmitStatus("success")
        setPhishingUrl("")
        setTargetBrand("")
        setReporterEmail("")
        setNotes("")
        setProofFile(null)
      } else {
        const data = await response.json().catch(() => ({}))
        setErrorMessage(data.error || "Submission failed. Please try again.")
        setSubmitStatus("error")
      }
    } catch (err: any) {
      console.error("Phishing submission error:", err)
      setErrorMessage(err.message || "Network error. Please try again.")
      setSubmitStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 font-sans text-neutral-900 dark:text-neutral-100">
      {/* Notion Header */}
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UL0Icon name="shield" animated={true} size={28} className="text-primary shrink-0" />
            <Image
              src="/ul0.png"
              alt="ul0"
              width={70}
              height={24}
              className="h-5 w-auto object-contain dark:invert"
            />
          </div>

          {/* Notion View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-full border border-border text-xs">
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-3 py-1 rounded-full transition-all font-semibold cursor-pointer ${
                activeTab === "directory"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Banned Links ({threats.length})
            </button>
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-3 py-1 rounded-full transition-all font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === "submit"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UL0Icon name="plus" size={12} />
              <span>Submit Phishing</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Blocked Phishing Links &amp; Scam Directory
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Registry of malicious links intercepted and neutralized by ul0. Zero traffic, zero redirects, and zero backlink equity passed to scammers.
          </p>
        </div>

        {/* Callout Box */}
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-surface-2 border border-border text-xs text-muted-foreground">
          <UL0Icon name="info" size={16} className="mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              Zero Backlink Protection
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Target URLs are defanged text without clickable hyperlinks. Search bots do not pass PageRank or Domain Rating (DR) to attackers.
            </p>
          </div>
        </div>
      </div>

      {/* TAB 1: NOTION DATABASE TABLE */}
      {activeTab === "directory" && (
        <div className="space-y-5">
          {/* Permanently Blocked Root Domains */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Permanently Banned Root Domains ({blacklistedDomains.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {blacklistedDomains.map((domain) => (
                <div
                  key={domain}
                  className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5"
                >
                  <span>*.{domain.replace(".", "[.]")}</span>
                  <span className="text-[10px] text-neutral-500 uppercase">banned</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 max-w-sm">
              <UL0Icon name="search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search slug, brand or domain..."
                className="w-full pl-9 pr-3.5 py-2 bg-card border border-border rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
              />
            </div>

            <span className="text-xs text-muted-foreground font-mono">
              {filteredThreats.length} item{filteredThreats.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Clean Table */}
          <div className="border border-border rounded-3xl overflow-hidden bg-card shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-2 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3.5 w-36">Short Link</th>
                    <th className="py-2.5 px-3.5">Defanged Destination (No Backlink)</th>
                    <th className="py-2.5 px-3.5 w-32">Spoofed Brand</th>
                    <th className="py-2.5 px-3.5 w-24">Status</th>
                    <th className="py-2.5 px-3.5 w-28 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredThreats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground text-xs">
                        No blocked links match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredThreats.map((threat) => (
                      <tr
                        key={threat.id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        {/* Short Link */}
                        <td className="py-3 px-3.5 font-mono font-bold text-foreground">
                          <Link
                            href={`/r/${threat.slug}`}
                            target="_blank"
                            className="hover:underline"
                          >
                            ul0.site/{threat.slug}
                          </Link>
                        </td>

                        {/* Defanged Target URL: NO <a> tag, zero backlink */}
                        <td className="py-3 px-3.5 font-mono text-muted-foreground max-w-md">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate select-all" title={threat.defangedUrl}>
                              {threat.defangedUrl}
                            </span>
                            <button
                              onClick={() => copyText(threat.id, threat.defangedUrl)}
                              className="shrink-0 p-1.5 hover:bg-surface-2 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title="Copy defanged text"
                            >
                              <UL0Icon name={copiedId === threat.id ? "check" : "copy"} size={12} />
                            </button>
                          </div>
                        </td>

                        {/* Spoofed Brand */}
                        <td className="py-2.5 px-3 text-neutral-800 dark:text-neutral-200">
                          <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px]">
                            {threat.spoofedBrand}
                          </span>
                        </td>

                        {/* Status: pure neutral gray badge */}
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                            BLOCKED
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-2.5 px-3 text-right text-neutral-400 font-mono text-[11px]">
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

      {/* TAB 2: NOTION REPORT FORM (UseBasin) */}
      {activeTab === "submit" && (
        <div className="space-y-4 max-w-xl">
          {/* Notion Callout Box */}
          <div className="p-3.5 rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Submit a Phishing Link</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Found a scam or fake login page? Submit it with proof to protect others. Reports are sent directly to our private review team via Basin and will not be displayed on the public list until verified and blocked.
            </p>
          </div>

          {submitStatus === "success" && (
            <div className="p-3.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs space-y-1">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Report Submitted! Verification Pending
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                Thank you for keeping the web safe. Our security review team will inspect the proof and disable the scam.
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-3.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-800 dark:text-neutral-200">
              <p className="font-semibold">Submission failed</p>
              <p className="text-neutral-500 dark:text-neutral-400">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
            {/* Phishing Link */}
            <div className="space-y-1">
              <label className="font-medium text-neutral-800 dark:text-neutral-200 block">
                Phishing / Scam Link <span className="text-neutral-400">*</span>
              </label>
              <input
                type="text"
                required
                value={phishingUrl}
                onChange={(e) => setPhishingUrl(e.target.value)}
                placeholder="https://scam-domain.com/login or short link"
                className="w-full px-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-md focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 font-mono text-xs"
              />
              <p className="text-[11px] text-neutral-400">
                The fake login, scam website, or suspicious short link.
              </p>
            </div>

            {/* Target Brand */}
            <div className="space-y-1">
              <label className="font-medium text-neutral-800 dark:text-neutral-200 block">
                Brand Being Spoofed
              </label>
              <input
                type="text"
                value={targetBrand}
                onChange={(e) => setTargetBrand(e.target.value)}
                placeholder="e.g. Telegram, Libero Mail, PayPal, Bank"
                className="w-full px-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-md focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-xs"
              />
            </div>

            {/* Proof Screenshot Upload */}
            <div className="space-y-1">
              <label className="font-medium text-neutral-800 dark:text-neutral-200 block">
                Proof Screenshot / Image
              </label>
              <div className="flex items-center gap-2.5">
                <label className="cursor-pointer px-4 py-2 bg-surface-2 hover:bg-muted border border-border rounded-full font-semibold text-foreground flex items-center gap-2 transition-colors text-xs shadow-2xs">
                  <UL0Icon name="upload" size={14} />
                  <span className="truncate max-w-[200px]">
                    {proofFile ? proofFile.name : "Attach Screenshot"}
                  </span>
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
                    className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Remove file"
                  >
                    <UL0Icon name="close" size={14} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Upload screenshot showing fake login, phishing message, or impersonation.
              </p>
            </div>

            {/* Reporter Contact */}
            <div className="space-y-1">
              <label className="font-medium text-neutral-800 dark:text-neutral-200 block">
                Your Contact (Optional)
              </label>
              <input
                type="text"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="email@example.com or @telegram"
                className="w-full px-3.5 py-2 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-xs shadow-2xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Optional. We will notify you once the link is neutralized.
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="font-medium text-neutral-800 dark:text-neutral-200 block">
                Additional Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Where did you receive this link? (Telegram group, SMS, email phishing...)"
                className="w-full px-3.5 py-2 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none text-xs shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground font-semibold transition-opacity flex items-center justify-center gap-2 text-xs shadow-2xs cursor-pointer"
            >
              {submitting ? (
                <>
                  <UL0Icon name="loading" animated={true} size={14} />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Phishing Report</span>
                  <UL0Icon name="arrowright" size={12} />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Notion Footer */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-400">
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
        <p className="font-mono text-[11px]">ul0 Security Radar</p>
      </div>
    </div>
  )
}
