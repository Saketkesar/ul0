"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  DollarSign,
  TrendingUp,
  Eye,
  MousePointerClick,
  Link2,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Layers,
  Sparkles,
  Globe,
  BarChart3,
  Calendar,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react"
import type { MonetizedLink } from "@/lib/appwrite/monetized-links"

interface Props {
  initialLinks: MonetizedLink[]
  userEmail: string
}

interface AdsterraStats {
  summary: {
    totalRevenue: number
    totalImpressions: number
    totalClicks: number
    avgCpm: number
    overallCtr: number
    todayRevenue: number
    todayImpressions: number
  }
  daily: Array<{
    date: string
    impression: number
    clicks: number
    ctr: number
    cpm: number
    revenue: number
  }>
  countries: Array<{
    country: string
    impression: number
    clicks: number
    cpm: number
    revenue: number
  }>
  lastUpdated: string
}

const AVAILABLE_BLOGS = [
  { slug: "best-url-shorteners-2026", title: "10 Best URL Shorteners of 2026 (Free & Paid)" },
  { slug: "how-to-track-link-clicks-free", title: "How to Track Link Clicks for Free (Beginner Guide)" },
  { slug: "link-shortening-best-practices-2026", title: "Link Shortening Best Practices in 2026" },
  { slug: "custom-domain-short-links-guide", title: "How to Setup Custom Branded Short Domains" },
  { slug: "qr-code-marketing-guide", title: "The Ultimate QR Code Marketing Strategy Guide" },
  { slug: "split-expenses-friends-app", title: "How to Split Group Trip Expenses Without Awkward Math" },
  { slug: "pomodoro-technique-productivity-guide", title: "Mastering the Pomodoro Technique for Deep Work" },
  { slug: "wifi-qr-code-business-guide", title: "How to Create Instant Wi-Fi QR Codes for Your Business" },
  { slug: "short-links-instagram-bio", title: "Optimizing Your Instagram Bio Links for Maximum Conversions" },
  { slug: "affiliate-link-shortener-usa", title: "Top Affiliate Link Shorteners for US Creators" },
  { slug: "free-link-management-for-companies", title: "Enterprise Link Management on Zero Budget" },
  { slug: "tinyurl-alternative", title: "Best Free TinyURL Alternatives with Custom Aliases" },
  { slug: "url-shortener-seo-impact", title: "Do Short URLs Hurt or Help Your SEO Ranking?" },
  { slug: "bitly-alternative-free", title: "Free Bitly Alternatives with Unlimited Clicks & No Expiry" },
]

export function AdsPageClient({ initialLinks, userEmail }: Props) {
  const [links, setLinks] = useState<MonetizedLink[]>(initialLinks)
  const [stats, setStats] = useState<AdsterraStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  // Form State
  const [title, setTitle] = useState("")
  const [targetUrl, setTargetUrl] = useState("")
  const [totalSteps, setTotalSteps] = useState(3)
  const [customSlug, setCustomSlug] = useState("")
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Fetch Adsterra Stats
  useEffect(() => {
    async function loadStats() {
      try {
        setLoadingStats(true)
        const res = await fetch("/api/monetized-links/stats")
        if (res.ok) {
          const data = await res.json()
          if (data.success) {
            setStats(data)
          }
        }
      } catch (err) {
        console.error("Failed to load Adsterra stats:", err)
      } finally {
        setLoadingStats(false)
      }
    }
    loadStats()
  }, [])

  const handleCopy = (slug: string, id: string) => {
    const url = `https://ul0.site/m/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !targetUrl.trim()) return

    setCreating(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const res = await fetch("/api/monetized-links/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          target_url: targetUrl.trim(),
          total_steps: totalSteps,
          custom_slug: customSlug.trim() || undefined,
          selected_blogs: selectedBlogs.length > 0 ? selectedBlogs : undefined,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setLinks((prev) => [data.link, ...prev])
        setTitle("")
        setTargetUrl("")
        setCustomSlug("")
        setSelectedBlogs([])
        setSuccessMessage(`Monetized link created: https://ul0.site/m/${data.link.slug}`)
      } else {
        setErrorMessage(data.error || "Failed to create monetized link.")
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error.")
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this monetized link?")) return
    try {
      const res = await fetch(`/api/monetized-links/${id}`, { method: "DELETE" })
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.$id !== id))
      }
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const toggleBlogSelection = (slug: string) => {
    setSelectedBlogs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug)
      } else {
        if (prev.length >= totalSteps) return prev
        return [...prev, slug]
      }
    })
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ──────── HEADER ──────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Private Adsterra Publisher Engine
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Authorized: {userEmail}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1.5">
            Monetized Multi-Step Links &amp; Earnings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create high-CPM interstitial links with multi-step blog unlockers and track real-time Adsterra revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors"
          >
            ← Main Dashboard
          </Link>
        </div>
      </div>

      {/* ──────── ADSTERRA EARNINGS STATS ──────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-500" />
            Adsterra Publisher Performance
          </h2>
          {stats && (
            <span className="text-[11px] text-muted-foreground font-mono">
              Last synced: {new Date(stats.lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>

        {loadingStats ? (
          <div className="p-8 rounded-xl border border-border bg-card/50 flex items-center justify-center gap-2 text-muted-foreground text-xs">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
            <span>Fetching live stats from Adsterra API...</span>
          </div>
        ) : stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Total Revenue</span>
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-emerald-500 font-mono">
                ${stats.summary.totalRevenue.toFixed(3)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Today: <strong className="text-foreground">${stats.summary.todayRevenue.toFixed(3)}</strong>
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Total Impressions</span>
                <Eye className="h-4 w-4 text-sky-500" />
              </div>
              <p className="text-2xl font-bold text-foreground font-mono">
                {stats.summary.totalImpressions.toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Today: <strong className="text-foreground">{stats.summary.todayImpressions.toLocaleString()}</strong>
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Average CPM</span>
                <TrendingUp className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold text-foreground font-mono">
                ${stats.summary.avgCpm.toFixed(3)}
              </p>
              <p className="text-[11px] text-muted-foreground">Revenue per 1,000 views</p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>Total Clicks &amp; CTR</span>
                <MousePointerClick className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-foreground font-mono">
                {stats.summary.totalClicks}{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  ({stats.summary.overallCtr}%)
                </span>
              </p>
              <p className="text-[11px] text-muted-foreground">Direct ad engagement</p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-border bg-card text-xs text-muted-foreground">
            No stats available from Adsterra yet.
          </div>
        )}

        {/* Country Breakdown Badges */}
        {stats && stats.countries.length > 0 && (
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium flex items-center gap-1 mr-1">
              <Globe className="h-3.5 w-3.5" /> Top Countries:
            </span>
            {stats.countries.slice(0, 8).map((c, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-card border border-border text-[11px] font-mono"
              >
                {c.country}: {c.impression} views (${parseFloat(String(c.revenue || 0)).toFixed(3)})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ──────── CREATE MONETIZED LINK FORM ──────── */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1 border-b border-border pb-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-500" />
            Create Multi-Step Monetized Link
          </h2>
          <p className="text-xs text-muted-foreground">
            When users click this link, they will pass through your chosen number of blog pages with ads and 10s unlock timers before reaching the destination.
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-5 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">
                Link Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Marvel Avengers 4K Movie Direct Download"
                className="w-full px-3.5 py-2 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-muted-foreground">
                Displayed in the progress banner and unlock header.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">
                Target Destination URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-3.5 py-2 rounded-lg bg-background border border-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-muted-foreground">
                The final URL the user receives after unlocking all steps.
              </p>
            </div>
          </div>

          {/* Number of Steps Selector (2 to 10) */}
          <div className="space-y-2">
            <label className="font-semibold text-foreground block">
              Number of Interstitial Blog Steps:{" "}
              <span className="text-emerald-500 font-bold font-mono text-sm">
                {totalSteps} Steps
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTotalSteps(num)}
                  className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium font-mono transition-all ${
                    totalSteps === num
                      ? "bg-emerald-500 border-emerald-500 text-black font-bold shadow-sm"
                      : "border-border bg-background hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {num} {num === 10 ? "Steps (Max)" : "Steps"}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Higher steps = more ad impressions &amp; higher earnings per visitor. (Recommended: 3 to 5 steps).
            </p>
          </div>

          {/* Custom Slug */}
          <div className="space-y-1.5 max-w-sm">
            <label className="font-semibold text-foreground block">
              Custom Alias <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 rounded-l-lg border border-r-0 border-border bg-muted/40 text-muted-foreground font-mono text-xs">
                ul0.site/m/
              </span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="avengers-hd"
                className="flex-1 px-3 py-2 rounded-r-lg bg-background border border-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Optional Blog Topic Customizer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-foreground block">
                Assign Specific Blogs ({selectedBlogs.length}/{totalSteps} Selected)
              </label>
              {selectedBlogs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedBlogs([])}
                  className="text-[11px] text-emerald-500 hover:underline"
                >
                  Clear (Auto-Assign)
                </button>
              )}
            </div>
            <div className="max-h-36 overflow-y-auto p-3 rounded-lg border border-border bg-muted/20 space-y-1.5">
              {AVAILABLE_BLOGS.map((b) => {
                const isSelected = selectedBlogs.includes(b.slug)
                return (
                  <div
                    key={b.slug}
                    onClick={() => toggleBlogSelection(b.slug)}
                    className={`p-2 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/40 text-foreground"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="truncate">{b.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">
                      {isSelected ? "Selected" : "+ Select"}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="text-[11px] text-muted-foreground">
              If left unselected, our engine automatically selects diverse, high-retention blogs for each step.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={creating}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Monetized Link...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Create Multi-Step Monetized Link</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* ──────── CREATED MONETIZED LINKS DIRECTORY ──────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
            <Link2 className="h-4 w-4 text-emerald-500" />
            Your Monetized Links ({links.length})
          </h2>
        </div>

        {links.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card/40">
            <Link2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-semibold text-foreground">No monetized links created yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first multi-step link above to start monetizing your downloads and content.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => {
              const conversion =
                link.views > 0
                  ? Math.round((link.completed_unlocks / link.views) * 100)
                  : 0
              return (
                <div
                  key={link.$id}
                  className="p-5 rounded-xl border border-border bg-card hover:border-border/80 transition-all space-y-3.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate">
                        {link.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">
                        Target: {link.target_url}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono font-bold shrink-0">
                      {link.total_steps} Steps
                    </span>
                  </div>

                  {/* Link Box */}
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border flex items-center justify-between gap-2 font-mono text-xs">
                    <span className="truncate text-foreground font-medium">
                      https://ul0.site/m/{link.slug}
                    </span>
                    <button
                      onClick={() => handleCopy(link.slug, link.$id)}
                      className="p-1.5 rounded bg-background hover:bg-muted border border-border text-foreground transition-colors shrink-0"
                      title="Copy link"
                    >
                      {copiedId === link.$id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border text-center text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Views</p>
                      <p className="font-bold text-foreground font-mono">{link.views}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Completed</p>
                      <p className="font-bold text-emerald-500 font-mono">
                        {link.completed_unlocks}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Unlock Rate</p>
                      <p className="font-bold text-foreground font-mono">{conversion}%</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                    <a
                      href={`/m/${link.slug}?step=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:underline flex items-center gap-1 text-[11px] font-medium"
                    >
                      <span>Test Unlock Flow</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      onClick={() => handleDelete(link.$id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      title="Delete link"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
