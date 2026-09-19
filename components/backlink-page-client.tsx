"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Copy,
  Check,
  Search,
  ExternalLink,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Globe,
  Code2,
  Sparkles,
} from "lucide-react"

export interface VerifiedSite {
  id: string
  website_url: string
  website_name: string
  website_description: string
  logo_url: string | null
  verified_at: string | null
}

interface Props {
  verifiedSites: VerifiedSite[]
}

type FormStep = "form" | "badge" | "verifying" | "verified" | "failed"

export function BacklinkPageClient({ verifiedSites }: Props) {
  const [sitesList, setSitesList] = useState<VerifiedSite[]>(verifiedSites)
  const [step, setStep] = useState<FormStep>("form")
  const [searchQuery, setSearchQuery] = useState("")
  const [copied, setCopied] = useState(false)

  // Form fields
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [websiteName, setWebsiteName] = useState("")
  const [websiteDesc, setWebsiteDesc] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [email, setEmail] = useState("")

  // Response state
  const [badgeCode, setBadgeCode] = useState("")
  const [verificationToken, setVerificationToken] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const copyBadge = () => {
    navigator.clipboard.writeText(badgeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredSites = sitesList.filter((s) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      s.website_name.toLowerCase().includes(q) ||
      s.website_url.toLowerCase().includes(q) ||
      s.website_description.toLowerCase().includes(q)
    )
  })

  // Step 1: Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!websiteUrl.trim() || !websiteName.trim() || !websiteDesc.trim()) return

    setSubmitting(true)
    setErrorMessage("")

    try {
      const fd = new FormData()
      fd.append("website_url", websiteUrl.trim())
      fd.append("website_name", websiteName.trim())
      fd.append("website_description", websiteDesc.trim())
      if (logoUrl.trim()) fd.append("logo_url", logoUrl.trim())
      if (email.trim()) fd.append("owner_email", email.trim())

      const res = await fetch("/api/backlinks/register", { method: "POST", body: fd })
      const data = await res.json()

      if (res.ok && data.success) {
        setBadgeCode(data.badge_code)
        setVerificationToken(data.verification_token)
        if (data.verified) {
          setStep("verified")
          setVerifyMessage("This website is already verified and listed!")
        } else {
          setStep("badge")
        }
      } else {
        setErrorMessage(data.error || "Registration failed.")
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error.")
    } finally {
      setSubmitting(false)
    }
  }

  // Step 2: Verify
  const handleVerify = async () => {
    setStep("verifying")
    setVerifyMessage("")

    try {
      const res = await fetch("/api/backlinks/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      })
      const data = await res.json()

      if (data.verified || data.already_verified) {
        setStep("verified")
        setVerifyMessage(data.message || "Verified!")
        if (data.site) {
          setSitesList((prev) => [
            data.site,
            ...prev.filter((s) => s.id !== data.site.id && s.website_url !== data.site.website_url),
          ])
        }
      } else {
        setStep("failed")
        setVerifyMessage(data.message || data.error || "Badge not found on your site.")
      }
    } catch (err: any) {
      setStep("failed")
      setVerifyMessage(err.message || "Verification failed.")
    }
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  return (
    <div className="space-y-8 font-sans text-neutral-900 dark:text-neutral-100">
      {/* Notion Header */}
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl select-none leading-none" role="img" aria-label="link">
            🔗
          </span>
          <Image
            src="/ul0.png"
            alt="ul0"
            width={70}
            height={24}
            className="h-5 w-auto object-contain dark:invert"
          />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Free Backlink Exchange
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
            Get a free dofollow backlink from ul0.site. Add our badge to your website, verify it, and your site joins the directory below with a real backlink.
          </p>
        </div>

        {/* How it works callout */}
        <div className="flex items-start gap-2.5 p-3 rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
          <span className="text-sm select-none">💡</span>
          <div className="space-y-1">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">How It Works</p>
            <ol className="list-decimal list-inside space-y-0.5 text-neutral-500 dark:text-neutral-400">
              <li>Fill in your website details below</li>
              <li>Copy the ul0 badge HTML snippet</li>
              <li>Paste the badge anywhere on your site</li>
              <li>Click <strong className="text-neutral-700 dark:text-neutral-200">Verify</strong> — once confirmed, your site appears in the directory with a dofollow backlink</li>
            </ol>
          </div>
        </div>
      </div>

      {/* ──────── REGISTRATION FORM ──────── */}
      <div className="space-y-4 max-w-xl">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-neutral-400" />
          Get Your Free Backlink
        </h2>

        {step === "form" && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-neutral-800 dark:text-neutral-200 block">
                Website URL <span className="text-neutral-400">*</span>
              </label>
              <input
                type="text"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full px-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-md focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-neutral-800 dark:text-neutral-200 block">
                Website Name <span className="text-neutral-400">*</span>
              </label>
              <input
                type="text"
                required
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                placeholder="My Awesome Site"
                className="w-full px-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-md focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-neutral-800 dark:text-neutral-200 block">
                What does your website do? <span className="text-neutral-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={websiteDesc}
                onChange={(e) => setWebsiteDesc(e.target.value)}
                placeholder="A free tool for developers to..."
                className="w-full px-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-md focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 resize-none text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-neutral-800 dark:text-neutral-200 block">
                Logo URL <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://yoursite.com/logo.png"
                className="w-full px-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-md focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 font-mono text-xs"
              />
              <p className="text-[11px] text-neutral-400">
                Direct link to your logo image. Use any image host (ImgBB, Cloudinary, your own server).
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-neutral-800 dark:text-neutral-200 block">
                Email <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yoursite.com"
                className="w-full px-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-md focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-xs"
              />
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5 text-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Get Badge & Free Backlink</span>
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Badge Code Step */}
        {(step === "badge" || step === "verifying" || step === "failed") && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-neutral-400" />
                Your Badge HTML — Copy & Paste Into Your Site
              </p>
              <div className="relative">
                <pre className="p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto whitespace-pre-wrap break-all select-all">
                  {badgeCode}
                </pre>
                <button
                  onClick={copyBadge}
                  className="absolute top-2 right-2 p-1.5 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                  title="Copy badge HTML"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-neutral-900 dark:text-neutral-100" />
                  ) : (
                    <Copy className="h-3 w-3 text-neutral-600 dark:text-neutral-300" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-neutral-400">
                Paste this HTML into your website&apos;s footer, sidebar, or any visible page. Then click Verify below.
              </p>
            </div>

            {/* Badge preview */}
            <div className="flex items-center gap-3 p-3 rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] text-neutral-400">Preview:</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/badge/ul0-verified.svg"
                alt="Verified by ul0"
                width={140}
                height={32}
                className="rounded"
              />
            </div>

            {step === "failed" && verifyMessage && (
              <div className="p-2.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300">
                {verifyMessage}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={step === "verifying"}
              className="px-4 py-2 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5 text-xs"
            >
              {step === "verifying" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Checking your website...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{step === "failed" ? "Try Verify Again" : "Verify Badge Placement"}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Verified Success */}
        {step === "verified" && (
          <div className="p-3.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs space-y-1">
            <p className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Verified! Your site is now in the directory 🎉
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              {verifyMessage || "Your website now has a free dofollow backlink from ul0.site. Refresh the page to see it in the directory below."}
            </p>
          </div>
        )}
      </div>

      {/* ──────── VERIFIED SITES DIRECTORY ──────── */}
      <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-neutral-400" />
            Verified Website Directory ({sitesList.length})
          </h2>

          {sitesList.length > 3 && (
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sites..."
                className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-md text-xs focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500"
              />
            </div>
          )}
        </div>

        {filteredSites.length === 0 ? (
          <div className="p-8 text-center rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <Globe className="h-8 w-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-600" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {sitesList.length === 0
                ? "No verified sites yet. Be the first to get listed!"
                : "No sites match your search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map((site) => (
              <div
                key={site.id}
                className="group p-3.5 rounded-md bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  {/* Logo or favicon fallback */}
                  <div className="shrink-0 h-8 w-8 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden">
                    {site.logo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={site.logo_url}
                        alt={site.website_name}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                          ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : (
                      <Globe className="h-4 w-4 text-neutral-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* DOFOLLOW backlink — this is the whole point */}
                    <a
                      href={site.website_url}
                      target="_blank"
                      rel="dofollow noopener"
                      className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline flex items-center gap-1 group-hover:underline"
                    >
                      <span className="truncate">{site.website_name}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <p className="text-[11px] text-neutral-400 font-mono truncate">
                      {getDomain(site.website_url)}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {site.website_description}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] font-medium text-neutral-600 dark:text-neutral-300">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    Verified
                  </span>
                  {site.verified_at && (
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {new Date(site.verified_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notion Footer */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span>ul0 Backlink Exchange</span>
          <span>•</span>
          <Link href="/threats" className="hover:underline">
            Threat Radar
          </Link>
          <span>•</span>
          <Link href="/security" className="hover:underline">
            Security
          </Link>
        </div>
        <p className="font-mono text-[11px]">Free dofollow backlinks from ul0.site</p>
      </div>
    </div>
  )
}
