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
  CheckCircle2,
  Table as TableIcon,
  LayoutGrid,
  FileText,
  CornerDownRight,
  Sparkles,
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
type SnippetTab = "html" | "markdown"
type DirectoryView = "table" | "gallery"

interface BadgeTheme {
  id: string
  name: string
  badgeLabel: string
  tagline: string
  file: string
  width: number
  height: number
  description: string
}

const BADGE_THEMES: BadgeTheme[] = [
  {
    id: "notion-paper",
    name: "Notion Paper",
    badgeLabel: "Default",
    tagline: "Warm paper tone with ink line cat doodle & subtle 1px border",
    file: "/badge/ul0-verified.svg",
    width: 144,
    height: 30,
    description: "Designed to match Notion documents, personal blogs, and clean white/cream portfolios.",
  },
  {
    id: "notion-dark",
    name: "Notion Dark",
    badgeLabel: "Dark Canvas",
    tagline: "Understated charcoal dark mode for dark-themed websites",
    file: "/badge/ul0-verified-dark.svg",
    width: 144,
    height: 30,
    description: "Matte charcoal background with silver-gray ink typography. Perfect for developer portfolios.",
  },
  {
    id: "notion-outline",
    name: "Transparent Outline",
    badgeLabel: "Universal",
    tagline: "Transparent backdrop with fine line border that adapts to any footer",
    file: "/badge/ul0-verified-outline.svg",
    width: 144,
    height: 30,
    description: "Zero background fill. Seamlessly melts into any website footer color without clashing.",
  },
  {
    id: "notion-warm",
    name: "Warm Sepia",
    badgeLabel: "Editorial",
    tagline: "Warm oatmeal book paper aesthetic for writers & documentation",
    file: "/badge/ul0-verified-sakura.svg",
    width: 144,
    height: 30,
    description: "Gentle sepia-toned canvas with soft brown ink. Highly legible and calm.",
  },
  {
    id: "retro88",
    name: "Indie Web 88x31",
    badgeLabel: "Micro Button",
    tagline: "Monochrome retro 88x31 button in clean Notion ink line art",
    file: "/badge/ul0-anime-88x31.svg",
    width: 88,
    height: 31,
    description: "Traditional indie web micro-button dimension, reimagined with minimalist line art.",
  },
  {
    id: "minimal-light",
    name: "Frosted Pill",
    badgeLabel: "Modern Pill",
    tagline: "Crisp white curved pill with neutral gray accents",
    file: "/badge/ul0-verified-light.svg",
    width: 144,
    height: 30,
    description: "Rounded capsule shape for modern SaaS footers and landing pages.",
  },
]

export function BacklinkPageClient({ verifiedSites }: Props) {
  const [sitesList, setSitesList] = useState<VerifiedSite[]>(verifiedSites)
  const [step, setStep] = useState<FormStep>("form")
  const [searchQuery, setSearchQuery] = useState("")
  const [copied, setCopied] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<BadgeTheme>(BADGE_THEMES[0])
  const [snippetTab, setSnippetTab] = useState<SnippetTab>("html")
  const [footerPreviewMode, setFooterPreviewMode] = useState<"light" | "dark">("light")
  const [dirView, setDirView] = useState<DirectoryView>("table")

  // Form fields
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [websiteName, setWebsiteName] = useState("")
  const [websiteDesc, setWebsiteDesc] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [email, setEmail] = useState("")

  // Verification state
  const [verificationToken, setVerificationToken] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Generate dynamic snippet based on chosen theme and token
  const currentToken = verificationToken || "token_id"
  const htmlSnippet = `<a href="https://ul0.site?ref=badge&v=${currentToken}" target="_blank" rel="noopener" title="UL0 — Free URL Shortener & Link Management">\n  <img src="https://ul0.site${selectedTheme.file}" alt="Free URL Shortener & Link Management by ul0" width="${selectedTheme.width}" height="${selectedTheme.height}" style="border:0;display:inline-block;vertical-align:middle" />\n</a>`
  const markdownSnippet = `[![Free URL Shortener & Link Management by ul0](https://ul0.site${selectedTheme.file})](https://ul0.site?ref=badge&v=${currentToken})`

  const currentSnippet = snippetTab === "html" ? htmlSnippet : markdownSnippet

  const copyCode = () => {
    navigator.clipboard.writeText(currentSnippet)
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
        setErrorMessage(data.error || "Registration could not be completed.")
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network connection error.")
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
    <div className="w-full space-y-10 font-sans text-neutral-800 dark:text-neutral-200">
      {/* ──────────────── NOTION PAGE COVER & HEADER ──────────────── */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#191919] overflow-hidden shadow-xs">
        {/* Cover Banner Illustration */}
        <div className="relative w-full h-44 sm:h-64 bg-[#F7F6F3] dark:bg-[#202020] border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <Image
            src="/notion-backlink.png"
            alt="Notion Backlink & Partner Community"
            fill
            className="object-cover object-center opacity-95 dark:opacity-85"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] dark:from-[#191919] via-transparent to-transparent opacity-80" />
        </div>

        {/* Notion Document Content */}
        <div className="p-6 sm:p-10 -mt-10 relative">
          {/* Notion Page Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFFFFF] dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 shadow-sm text-2xl mb-4 select-none">
            🔗
          </div>

          {/* Breadcrumb Path */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
            <span>Workspace</span>
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            <span>SEO &amp; Growth</span>
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">Backlink Directory</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Aesthetic Notion Badges &amp; Free Dofollow Backlinks
          </h1>

          <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
            A quiet, collaborative backlink exchange for indie builders, designers, and creators.
            Add an unobtrusive Notion-styled verification mark to your footer, and receive a permanent dofollow backlink on <strong>ul0.site</strong>.
          </p>

          {/* Notion Properties Grid */}
          <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-neutral-400 dark:text-neutral-500 block text-[11px]">Exchange Status</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#EDF3EC] text-[#2E7444] border border-[#D3E5D2] dark:bg-[#1B2A1E] dark:text-[#88D49E] dark:border-[#27452E] font-medium text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2E7444] dark:bg-[#88D49E]" />
                Active &amp; Open
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-neutral-400 dark:text-neutral-500 block text-[11px]">Badge Weight</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-mono font-medium">
                &lt; 2.5 KB (Zero JS)
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-neutral-400 dark:text-neutral-500 block text-[11px]">Backlink Type</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                Permanent Dofollow
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-neutral-400 dark:text-neutral-500 block text-[11px]">Verification</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                Instant Automated Scan
              </span>
            </div>
          </div>

          {/* Notion Callout Box */}
          <div className="mt-6 p-4 rounded-xl border border-[#E9E9E7] dark:border-[#2E2E2E] bg-[#F7F6F3] dark:bg-[#202020] flex items-start gap-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            <span className="text-base shrink-0 select-none">💡</span>
            <div>
              <strong className="font-semibold text-neutral-900 dark:text-neutral-100 block mb-0.5">
                Zero spam. Zero obnoxious neon widgets.
              </strong>
              Most verification badges scream for attention with high-contrast neon glows and annoying popups. Our Notion badges are designed with paper tones, delicate 1px borders, and hand-drawn ink doodles. They look like a tasteful craftsmanship seal on any footer or documentation page.
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── BADGE PALETTE & LIVE FOOTER SIMULATOR ──────────────── */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#191919] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>Aesthetic Badge Collection</span>
              <span className="text-[11px] font-normal text-neutral-400">({BADGE_THEMES.length} variations)</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Choose the aesthetic style that best fits your design system. Every version verifies instantly.
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Canvas:</span>
            <div className="flex rounded-md border border-neutral-200 dark:border-neutral-700 p-0.5 bg-neutral-100 dark:bg-neutral-800">
              <button
                type="button"
                onClick={() => setFooterPreviewMode("light")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  footerPreviewMode === "light"
                    ? "bg-[#FFFFFF] dark:bg-[#2A2A2A] text-neutral-900 dark:text-neutral-100 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setFooterPreviewMode("dark")}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  footerPreviewMode === "dark"
                    ? "bg-[#FFFFFF] dark:bg-[#2A2A2A] text-neutral-900 dark:text-neutral-100 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGE_THEMES.map((theme) => {
            const isSelected = selectedTheme.id === theme.id
            return (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-neutral-900 dark:border-neutral-100 bg-[#FBFBFA] dark:bg-[#222222] ring-1 ring-neutral-900 dark:ring-neutral-100 shadow-xs"
                    : "border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#1B1B1B] hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                      {theme.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                      {theme.badgeLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {theme.tagline}
                  </p>
                </div>

                {/* Badge Render Box */}
                <div
                  className={`mt-4 p-3 rounded-lg flex items-center justify-center min-h-[52px] border border-neutral-100 dark:border-neutral-800/80 transition-colors ${
                    footerPreviewMode === "light" ? "bg-[#F7F6F3]" : "bg-[#141414]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={theme.file}
                    alt={theme.name}
                    width={theme.width}
                    height={theme.height}
                    className="max-h-8 w-auto object-contain"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Simulated Website Footer Preview */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F7F6F3] dark:bg-[#202020] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span className="font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <span>Preview:</span>
              <span className="text-neutral-500 font-normal">How {selectedTheme.name} settles naturally into a real website footer</span>
            </span>
            <span className="text-[11px] text-neutral-500 font-mono">144 × 30 px</span>
          </div>

          <div
            className={`p-5 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
              footerPreviewMode === "light"
                ? "bg-[#FFFFFF] border-neutral-200 text-neutral-600"
                : "bg-[#191919] border-neutral-800 text-neutral-400"
            }`}
          >
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                © {new Date().getFullYear()} Your Website, Inc. All rights reserved.
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Privacy Policy · Terms of Service · Documentation · Status
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <a
                href="https://ul0.site/backlinks"
                target="_blank"
                rel="noopener"
                className="inline-block hover:opacity-85 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedTheme.file}
                  alt="Verified by ul0"
                  width={selectedTheme.width}
                  height={selectedTheme.height}
                  className="h-7 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── STEP-BY-STEP WORKSPACE: REGISTER & VERIFY ──────────────── */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left: How It Works & Transparency */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#191919] p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>The 3-Step Exchange Process</span>
            </h3>

            <div className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] font-bold">
                  1
                </span>
                <div>
                  <strong className="text-neutral-800 dark:text-neutral-200 block text-xs">Register your URL</strong>
                  Provide your website URL, project title, and what your project does.
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] font-bold">
                  2
                </span>
                <div>
                  <strong className="text-neutral-800 dark:text-neutral-200 block text-xs">Embed the badge snippet</strong>
                  Add the clean 1-line HTML snippet or Markdown into your footer, credits, or README.
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] font-bold">
                  3
                </span>
                <div>
                  <strong className="text-neutral-800 dark:text-neutral-200 block text-xs">Instant verification &amp; publication</strong>
                  Click verify. Our bot scans your page HTML and immediately lists your project with a permanent dofollow link.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#191919] p-6 space-y-3 shadow-xs text-xs">
            <h4 className="font-bold text-neutral-800 dark:text-neutral-200">
              Why Partner With UL0?
            </h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300 mt-0.5 shrink-0" />
                <span>Genuine editorial dofollow link with no redirection hurdles.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300 mt-0.5 shrink-0" />
                <span>Zero intrusive scripts: Pure SVG vector graphic (&lt;2KB).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300 mt-0.5 shrink-0" />
                <span>Crawled continuously by Googlebot, Bingbot, and IndexNow.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300 mt-0.5 shrink-0" />
                <span>Spam-free: Every site is verified live before publication.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Registration / Verification Card */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#191919] p-6 sm:p-8 space-y-6 shadow-xs">
            {step === "form" && (
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Step 1: Website Details
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                    Specify the website where you will place the badge and receive your dofollow backlink.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-neutral-700 dark:text-neutral-300 block">
                    Website URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourdomain.com"
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 font-mono text-xs text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-medium text-neutral-700 dark:text-neutral-300 block">
                      Website Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      placeholder="e.g. Minimalist Tools"
                      className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-xs text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-neutral-700 dark:text-neutral-300 block">
                      Contact Email <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="founder@yourdomain.com"
                      className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-xs text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-neutral-700 dark:text-neutral-300 block">
                    Website Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={websiteDesc}
                    onChange={(e) => setWebsiteDesc(e.target.value)}
                    placeholder="Brief 1-2 sentence description of what your website or product provides..."
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-xs text-neutral-900 dark:text-neutral-100 resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-neutral-700 dark:text-neutral-300 block">
                    Favicon or Logo URL <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://yourdomain.com/favicon.png"
                    className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 font-mono text-xs text-neutral-900 dark:text-neutral-100"
                  />
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                    If omitted, we automatically pull your domain favicon.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-10 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 shadow-xs"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Registering Property...
                    </>
                  ) : (
                    <>
                      <span>Get Badge Snippet &amp; Continue</span>
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Badge Code & Verification Step */}
            {(step === "badge" || step === "verifying" || step === "failed") && (
              <div className="space-y-5">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Step 2: Copy Snippet &amp; Run Verification
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                    Paste this snippet into your website footer or credits, then press Verify.
                  </p>
                </div>

                {/* Snippet Format Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex rounded-md border border-neutral-200 dark:border-neutral-700 p-0.5 bg-neutral-100 dark:bg-neutral-800">
                      <button
                        type="button"
                        onClick={() => setSnippetTab("html")}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          snippetTab === "html"
                            ? "bg-[#FFFFFF] dark:bg-[#2A2A2A] text-neutral-900 dark:text-neutral-100 shadow-xs"
                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                        }`}
                      >
                        HTML Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setSnippetTab("markdown")}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          snippetTab === "markdown"
                            ? "bg-[#FFFFFF] dark:bg-[#2A2A2A] text-neutral-900 dark:text-neutral-100 shadow-xs"
                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                        }`}
                      >
                        Markdown (README)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={copyCode}
                      className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100"
                    >
                      {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-neutral-200 dark:border-neutral-800 select-all whitespace-pre-wrap break-all">
                      <code>{currentSnippet}</code>
                    </pre>
                  </div>
                </div>

                {/* Badge Preview Box */}
                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 text-xs">
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">Selected: {selectedTheme.name}</p>
                    <p className="text-[11px] text-neutral-500">
                      Token embedded: <span className="font-mono">{verificationToken.slice(0, 10)}...</span>
                    </p>
                  </div>
                  <div className="p-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedTheme.file}
                      alt={selectedTheme.name}
                      width={selectedTheme.width}
                      height={selectedTheme.height}
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                </div>

                {step === "failed" && verifyMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs space-y-1">
                    <p className="font-bold">Badge verification not detected</p>
                    <p>{verifyMessage}</p>
                    <p className="text-[11px] opacity-80 pt-1">
                      Check that the badge HTML is deployed to your live site and accessible without authentication or Cloudflare captcha.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleVerify}
                    disabled={step === "verifying"}
                    className="flex-1 h-10 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 shadow-xs"
                  >
                    {step === "verifying" ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Scanning Your Website...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                        {step === "failed" ? "Retry Verification" : "Verify Live Badge"}
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="h-10 px-3 text-xs rounded-lg border-neutral-200 dark:border-neutral-800"
                  >
                    Edit Info
                  </Button>
                </div>
              </div>
            )}

            {/* Verified Celebration */}
            {step === "verified" && (
              <div className="p-6 rounded-xl bg-[#EDF3EC] dark:bg-[#1B2A1E] border border-[#D3E5D2] dark:border-[#27452E] text-neutral-800 dark:text-neutral-200 space-y-3 text-center animate-in zoom-in-95 duration-200">
                <div className="mx-auto w-10 h-10 rounded-full bg-[#D3E5D2] dark:bg-[#27452E] flex items-center justify-center text-lg">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Verification Confirmed! Dofollow Link Published
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
                  {verifyMessage ||
                    "Thank you for being part of our backlink directory. Your website is now permanently listed in our verified showcase below with an editorial dofollow backlink."}
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
                    className="text-xs rounded-lg border-neutral-300 dark:border-neutral-700"
                  >
                    Register Another Website
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ──────────────── NOTION DATABASE DIRECTORY ──────────────── */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#191919] overflow-hidden shadow-xs space-y-0">
        {/* Database Header Bar */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">🗂️</span>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Verified Backlink Partners
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                {sitesList.length}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Curated directory of verified webmasters, indie creators, and open-source projects.
            </p>
          </div>

          {/* View Toggles & Search */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-neutral-200 dark:border-neutral-700 p-0.5 bg-neutral-100 dark:bg-neutral-800">
              <button
                type="button"
                onClick={() => setDirView("table")}
                className={`p-1 rounded text-xs transition-colors ${
                  dirView === "table"
                    ? "bg-[#FFFFFF] dark:bg-[#2A2A2A] text-neutral-900 dark:text-neutral-100 shadow-xs"
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
                title="Table View"
              >
                <TableIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDirView("gallery")}
                className={`p-1 rounded text-xs transition-colors ${
                  dirView === "gallery"
                    ? "bg-[#FFFFFF] dark:bg-[#2A2A2A] text-neutral-900 dark:text-neutral-100 shadow-xs"
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
                title="Gallery View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter partners..."
                className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-md text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
              />
            </div>
          </div>
        </div>

        {/* Directory Content */}
        {filteredSites.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="text-3xl text-neutral-300 dark:text-neutral-600 select-none">📂</div>
            <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {sitesList.length === 0 ? "No verified partners yet" : "No matching partners found"}
            </h4>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm mx-auto">
              {sitesList.length === 0
                ? "Be the first creator to embed a Notion badge and claim your free permanent dofollow backlink above."
                : "Try a different search query to find partners."}
            </p>
          </div>
        ) : dirView === "table" ? (
          /* Table View (Notion Database Table) */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 font-medium text-[11px] bg-neutral-50/50 dark:bg-neutral-850/50">
                  <th className="py-2.5 px-4 font-normal">Name &amp; Backlink</th>
                  <th className="py-2.5 px-4 font-normal">Description</th>
                  <th className="py-2.5 px-4 font-normal">Domain</th>
                  <th className="py-2.5 px-4 font-normal">Status</th>
                  <th className="py-2.5 px-4 font-normal text-right">Listed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredSites.map((site) => (
                  <tr
                    key={site.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group"
                  >
                    {/* Name & Backlink */}
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                          {/* Favicon */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              site.logo_url ||
                              `https://www.google.com/s2/favicons?domain=${getDomain(site.website_url)}&sz=64`
                            }
                            alt={site.website_name}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              ;(e.target as HTMLElement).style.display = "none"
                            }}
                          />
                        </div>
                        <a
                          href={site.website_url}
                          target="_blank"
                          rel="dofollow noopener"
                          className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline flex items-center gap-1"
                        >
                          <span className="truncate max-w-[180px] sm:max-w-[240px]">
                            {site.website_name}
                          </span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400" />
                        </a>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400 max-w-xs truncate">
                      {site.website_description}
                    </td>

                    {/* Domain */}
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                        {getDomain(site.website_url)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#EDF3EC] text-[#2E7444] border border-[#D3E5D2] dark:bg-[#1B2A1E] dark:text-[#88D49E] dark:border-[#27452E]">
                        ✓ Verified
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-right text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                      {site.verified_at
                        ? new Date(site.verified_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Gallery View */
          <div className="p-4 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map((site) => (
              <div
                key={site.id}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#1C1C1C] p-4 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group"
              >
                <div>
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <div className="h-7 w-7 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          site.logo_url ||
                          `https://www.google.com/s2/favicons?domain=${getDomain(site.website_url)}&sz=64`
                        }
                        alt={site.website_name}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          ;(e.target as HTMLElement).style.display = "none"
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <a
                        href={site.website_url}
                        target="_blank"
                        rel="dofollow noopener"
                        className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 hover:underline flex items-center gap-1"
                      >
                        <span className="truncate">{site.website_name}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400" />
                      </a>
                      <p className="text-[11px] font-mono text-neutral-400 truncate">
                        {getDomain(site.website_url)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                    {site.website_description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#EDF3EC] text-[#2E7444] border border-[#D3E5D2] dark:bg-[#1B2A1E] dark:text-[#88D49E] dark:border-[#27452E]">
                    ✓ Verified
                  </span>
                  {site.verified_at && (
                    <span className="text-neutral-400 dark:text-neutral-500 font-mono text-[10px]">
                      {new Date(site.verified_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ──────────────── QUIET NOTION FOOTER NOTE ──────────────── */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#FBFBFA] dark:bg-[#181818] text-center text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
        <p>
          Need assistance or custom embed guidance? Feel free to reach out via our{" "}
          <Link href="/contact" className="text-neutral-800 dark:text-neutral-200 hover:underline font-medium">
            Contact Page
          </Link>{" "}
          or verify domains on our{" "}
          <Link href="/threats" className="text-neutral-800 dark:text-neutral-200 hover:underline font-medium">
            Threat Radar
          </Link>.
        </p>
      </div>
    </div>
  )
}
