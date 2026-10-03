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
  Heart,
  Eye,
  CheckCircle2,
  Layers,
  Palette,
  Laptop,
  CheckCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface BadgeTheme {
  id: string
  name: string
  emoji: string
  tagline: string
  file: string
  width: number
  height: number
  bgClass: string
}

const BADGE_THEMES: BadgeTheme[] = [
  {
    id: "midnight",
    name: "Midnight Chibi",
    emoji: "🌙",
    tagline: "Dark lo-fi anime cat with emerald border",
    file: "/badge/ul0-verified.svg",
    width: 154,
    height: 34,
    bgClass: "bg-slate-900 border-emerald-500/40",
  },
  {
    id: "sakura",
    name: "Sakura Kawaii",
    emoji: "🌸",
    tagline: "Pastel pink & sweet chibi blush",
    file: "/badge/ul0-verified-sakura.svg",
    width: 154,
    height: 34,
    bgClass: "bg-pink-50 dark:bg-pink-950/40 border-pink-400/40",
  },
  {
    id: "light",
    name: "Frosted Glass",
    emoji: "☁️",
    tagline: "Minimalist aesthetic for light sites",
    file: "/badge/ul0-verified-light.svg",
    width: 154,
    height: 34,
    bgClass: "bg-white border-slate-300",
  },
  {
    id: "retro88",
    name: "Retro 88x31",
    emoji: "👾",
    tagline: "Iconic indie web pixel button",
    file: "/badge/ul0-anime-88x31.svg",
    width: 88,
    height: 31,
    bgClass: "bg-neutral-950 border-emerald-400",
  },
]

export function BacklinkPageClient({ verifiedSites }: Props) {
  const [sitesList, setSitesList] = useState<VerifiedSite[]>(verifiedSites)
  const [step, setStep] = useState<FormStep>("form")
  const [searchQuery, setSearchQuery] = useState("")
  const [copied, setCopied] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<BadgeTheme>(BADGE_THEMES[0])
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "slate">("dark")

  // Form fields
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [websiteName, setWebsiteName] = useState("")
  const [websiteDesc, setWebsiteDesc] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [email, setEmail] = useState("")

  // Response state
  const [verificationToken, setVerificationToken] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Generate dynamic snippet based on chosen theme and token
  const currentToken = verificationToken || "sample_token"
  const currentBadgeCode = `<a href="https://ul0.site/backlinks?ref=badge&v=${currentToken}" target="_blank" rel="noopener">\n  <img src="https://ul0.site${selectedTheme.file}" alt="Verified by ul0" width="${selectedTheme.width}" height="${selectedTheme.height}" style="border:0;display:inline-block;vertical-align:middle" />\n</a>`

  const copyBadge = () => {
    navigator.clipboard.writeText(currentBadgeCode)
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
        setVerificationToken(data.verification_token)
        if (data.verified) {
          setStep("verified")
          setVerifyMessage("This website is already verified and listed in our directory!")
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
    <div className="w-full space-y-12">
      {/* ──────────────── HERO SECTION ──────────────── */}
      <div className="relative text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-xs">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Indie Web &amp; Aesthetic Backlink Exchange</span>
          <span className="text-pink-500">🌸</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Cute Anime Badges &amp; Free Dofollow Backlinks
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Add an ultra-cute, unobtrusive anime-style verification badge to your website. It blends naturally into your footer or sidebar without annoying visitors — and in return, you get an immediate, permanent dofollow backlink from <strong>ul0.site</strong>!
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border shadow-xs text-foreground">
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            100% Free Forever
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border shadow-xs text-foreground">
            <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
            Cute &amp; Non-Intrusive
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border shadow-xs text-foreground">
            <Code2 className="h-3.5 w-3.5 text-blue-500" />
            Clean Lightweight SVG (&lt;2KB)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border shadow-xs text-foreground">
            <Globe className="h-3.5 w-3.5 text-purple-500" />
            Permanent Dofollow Link
          </span>
        </div>
      </div>

      {/* ──────────────── BADGE CUSTOMIZER & SHOWCASE ──────────────── */}
      <div className="rounded-3xl border border-border bg-card/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <span>Choose Your Aesthetic Badge Theme</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pick the badge that best matches your website&apos;s vibe. All versions pass verification instantly!
            </p>
          </div>

          {/* Background Tester */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground self-start sm:self-auto">
            <span>Preview on:</span>
            <div className="flex rounded-lg border border-border p-0.5 bg-muted">
              <button
                type="button"
                onClick={() => setPreviewBg("dark")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  previewBg === "dark" ? "bg-slate-900 text-white shadow-xs" : "hover:text-foreground"
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setPreviewBg("slate")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  previewBg === "slate" ? "bg-slate-700 text-white shadow-xs" : "hover:text-foreground"
                }`}
              >
                Slate
              </button>
              <button
                type="button"
                onClick={() => setPreviewBg("light")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  previewBg === "light" ? "bg-white text-slate-900 shadow-xs" : "hover:text-foreground"
                }`}
              >
                Light
              </button>
            </div>
          </div>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BADGE_THEMES.map((theme) => {
            const isSelected = selectedTheme.id === theme.id
            return (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/40 shadow-sm"
                    : "border-border bg-background/50 hover:border-border/80 hover:bg-background"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base">{theme.emoji}</span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary px-1.5 py-0.5 rounded-full bg-primary/10">
                        <Check className="h-3 w-3" /> Selected
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{theme.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{theme.tagline}</p>
                </div>

                {/* Badge Render Box */}
                <div
                  className={`mt-4 p-3 rounded-xl flex items-center justify-center min-h-[50px] transition-colors ${
                    previewBg === "dark"
                      ? "bg-neutral-950"
                      : previewBg === "slate"
                      ? "bg-slate-800"
                      : "bg-slate-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={theme.file}
                    alt={theme.name}
                    width={theme.width}
                    height={theme.height}
                    className="max-h-9 w-auto object-contain drop-shadow-xs"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Simulated Website Footer Preview */}
        <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <Laptop className="h-3.5 w-3.5 text-primary" />
              How It Looks On A Real Website Footer:
            </span>
            <span className="text-[11px] text-emerald-500 font-medium">✓ Clean &amp; Unobtrusive</span>
          </div>

          <div
            className={`p-5 rounded-xl border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
              previewBg === "dark"
                ? "bg-slate-950 text-slate-400"
                : previewBg === "slate"
                ? "bg-slate-900 text-slate-300"
                : "bg-white text-slate-500"
            }`}
          >
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-xs font-medium text-foreground">
                © {new Date().getFullYear()} Your Website. All rights reserved.
              </p>
              <p className="text-[11px] text-muted-foreground">
                Privacy • Terms • Built with care for creators.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground hidden md:inline">partner badge:</span>
              <a href="https://ul0.site/backlinks" target="_blank" rel="noopener" className="inline-block hover:opacity-90 transition-opacity">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedTheme.file}
                  alt="Verified by ul0"
                  width={selectedTheme.width}
                  height={selectedTheme.height}
                  className="h-8 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── STEP-BY-STEP EXCHANGE WORKSPACE ──────────────── */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left: How It Works & Perks */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>How The Exchange Works</span>
            </h3>

            <div className="space-y-3.5 text-xs text-muted-foreground">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                  1
                </span>
                <div>
                  <strong className="text-foreground block text-xs">Register your site</strong>
                  Submit your URL, website name, and a short description of what you do.
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                  2
                </span>
                <div>
                  <strong className="text-foreground block text-xs">Copy your cute badge code</strong>
                  Paste the 1-line HTML snippet into your footer, sidebar, or credits page.
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                  3
                </span>
                <div>
                  <strong className="text-foreground block text-xs">Instant verification &amp; dofollow link</strong>
                  Click verify. Our bot instantly confirms badge placement, and your site is published below with a permanent dofollow backlink!
                </div>
              </div>
            </div>
          </div>

          {/* Why ul0 backlinks? */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Why Partner With UL0?
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Real dofollow link without redirect wrappers or nofollow tags.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Indexed daily by Googlebot, Bingbot, and IndexNow.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Zero spam guarantee — every submission is screened.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Loved by indie hackers, anime fans, and creative bloggers.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Registration / Verification Card */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            {step === "form" && (
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div className="border-b border-border pb-3">
                  <h3 className="text-base font-bold text-foreground">Step 1: Your Website Details</h3>
                  <p className="text-muted-foreground text-xs">
                    Tell us where to send your permanent dofollow backlink.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground block">
                    Website URL <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs text-foreground"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground block">
                      Website Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      placeholder="e.g. Pixel Forge Studio"
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground block">
                      Your Email <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@yourwebsite.com"
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground block">
                    Website Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={websiteDesc}
                    onChange={(e) => setWebsiteDesc(e.target.value)}
                    placeholder="Briefly describe what your site does (e.g. Free developer tools, tech blog, SaaS app, creative portfolio)..."
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs text-foreground resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground block">
                    Logo or Favicon URL <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://yourwebsite.com/logo.png"
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs text-foreground"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Leave blank to automatically use your domain&apos;s standard favicon.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering Website...
                    </>
                  ) : (
                    <>
                      <span>Get Cute Badge &amp; Free Backlink</span>
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Badge Code & Verification Step */}
            {(step === "badge" || step === "verifying" || step === "failed") && (
              <div className="space-y-5 animate-in fade-in-50 duration-200">
                <div className="border-b border-border pb-3">
                  <h3 className="text-base font-bold text-foreground">Step 2: Copy &amp; Verify Your Badge</h3>
                  <p className="text-muted-foreground text-xs">
                    Paste this snippet into your website footer or sidebar, then click Verify below!
                  </p>
                </div>

                {/* Snippet Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-primary" />
                      HTML Embed Snippet ({selectedTheme.name}):
                    </span>
                    <button
                      type="button"
                      onClick={copyBadge}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied!" : "Copy Code"}
                    </button>
                  </div>

                  <div className="relative">
                    <pre className="p-4 rounded-2xl bg-muted/60 text-foreground font-mono text-[11px] overflow-x-auto leading-relaxed border border-border select-all whitespace-pre-wrap break-all">
                      <code>{currentBadgeCode}</code>
                    </pre>
                  </div>
                </div>

                {/* Selected Preview Box */}
                <div className="p-4 rounded-2xl border border-border bg-background flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">Your Selected Badge</p>
                    <p className="text-[11px] text-muted-foreground">
                      Theme: {selectedTheme.name} ({selectedTheme.emoji})
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedTheme.file}
                      alt={selectedTheme.name}
                      width={selectedTheme.width}
                      height={selectedTheme.height}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                </div>

                {step === "failed" && verifyMessage && (
                  <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <p className="font-bold">Verification Incomplete</p>
                    <p>{verifyMessage}</p>
                    <p className="text-[11px] opacity-80 pt-1">
                      Tip: Make sure the badge is live in your HTML source and accessible without a login or Cloudflare block page.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleVerify}
                    disabled={step === "verifying"}
                    className="flex-1 h-11 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  >
                    {step === "verifying" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning Your Website...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {step === "failed" ? "Retry Verification" : "Verify Badge Placement"}
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="h-11 px-4 text-xs rounded-xl"
                  >
                    Edit Info
                  </Button>
                </div>
              </div>
            )}

            {/* Verified Celebration */}
            {step === "verified" && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-3 text-center animate-in zoom-in-95 duration-200">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-2xl">
                  🎉
                </div>
                <h4 className="text-base font-bold text-foreground">
                  Verification Successful! Your Backlink Is Live
                </h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {verifyMessage ||
                    "Thank you for being part of our indie web partnership! Your website is now permanently listed in our verified showcase below with a genuine dofollow backlink."}
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStep("form")
                      setWebsiteUrl("")
                      setWebsiteName("")
                      setWebsiteDesc("")
                    }}
                    className="text-xs rounded-xl"
                  >
                    Register Another Website
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ──────────────── VERIFIED DIRECTORY SHOWCASE ──────────────── */}
      <div className="space-y-6 border-t border-border pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Verified Partner Directory ({sitesList.length})</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Curated showcase of verified webmasters, indie hackers, and creative blogs.
            </p>
          </div>

          {sitesList.length > 2 && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search verified sites..."
                className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>

        {filteredSites.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-card border border-border space-y-3">
            <Globe className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <h4 className="text-sm font-bold text-foreground">
              {sitesList.length === 0 ? "No verified partners yet!" : "No websites found"}
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {sitesList.length === 0
                ? "Be the very first indie creator to add a cute badge and claim a free permanent dofollow backlink!"
                : "No verified websites match your search query."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map((site) => (
              <div
                key={site.id}
                className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    {/* Logo / Favicon */}
                    <div className="shrink-0 h-10 w-10 rounded-xl bg-muted border border-border/80 flex items-center justify-center overflow-hidden p-1">
                      {site.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={site.logo_url}
                          alt={site.website_name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            ;(e.target as HTMLElement).style.display = "none"
                          }}
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${getDomain(site.website_url)}&sz=64`}
                          alt={site.website_name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            ;(e.target as HTMLElement).style.display = "none"
                          }}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Dofollow Backlink */}
                      <a
                        href={site.website_url}
                        target="_blank"
                        rel="dofollow noopener"
                        className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                      >
                        <span className="truncate">{site.website_name}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">
                        {getDomain(site.website_url)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {site.website_description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Partner
                  </span>
                  {site.verified_at && (
                    <span className="text-[10px] text-muted-foreground font-mono">
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

      {/* ──────────────── FOOTER SUB-CALLOUT ──────────────── */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-pink-500/5 p-6 sm:p-8 text-center space-y-3">
        <h3 className="text-lg font-bold text-foreground flex items-center justify-center gap-2">
          <span>Spread The Love Across The Indie Web</span>
          <span className="text-pink-500">🌸</span>
        </h3>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Questions or need help verifying your badge? Reach out anytime via our{" "}
          <Link href="/contact" className="text-primary hover:underline font-medium">
            Contact Support
          </Link>{" "}
          or inspect links on the{" "}
          <Link href="/threats" className="text-primary hover:underline font-medium">
            Threat Radar
          </Link>.
        </p>
      </div>
    </div>
  )
}
