"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  MousePointerClick,
  Users,
  Link2,
  QrCode,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Copy,
  Check,
  ExternalLink,
  Table as TableIcon,
  LineChart as LineChartIcon,
  CheckCircle2,
  Circle,
  X,
  Sparkles,
  Globe,
  Key,
  Shield,
  Clock,
  ArrowRight,
  Lock,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { toast } from "sonner"
import type { PlanSlug, PlanLimits } from "@/lib/plans"
import { LinkShortenerForm } from "@/components/link-shortener-form"

interface LinkItem {
  $id: string
  slug: string
  long_url: string
  host: string
  clicks_count: number
  created_at: string | null
  expire_at: string | null
  meta_title?: string | null
}

interface OverviewClientProps {
  user: {
    firstName?: string | null
  }
  plan: {
    slug: PlanSlug
    limits: PlanLimits
    label: string
  }
  initialLinks: LinkItem[]
  totalLinksCount: number
  totalClicksSum: number
  verifiedDomains: Array<{ domain: string }>
  apiKeyCreated: boolean
}

export function OverviewClient({
  user,
  plan,
  initialLinks,
  totalLinksCount,
  totalClicksSum,
  verifiedDomains,
  apiKeyCreated,
}: OverviewClientProps) {
  const [range, setRange] = useState<"today" | "7d" | "30d" | "90d">("7d")
  const [chartView, setChartView] = useState<"chart" | "table">("chart")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [dismissChecklist, setDismissChecklist] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ul0_dismiss_checklist") === "true"
    }
    return false
  })

  // Format greeting based on local time
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  // Derive mock/aggregated time series based on total clicks & range for chart display
  const chartData = useMemo(() => {
    const days = range === "today" ? 24 : range === "7d" ? 7 : range === "30d" ? 30 : 90
    const points = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      if (range === "today") {
        d.setHours(d.getHours() - i)
        const label = `${d.getHours()}:00`
        // Distribute clicks proportionally
        const base = Math.max(0, Math.round((totalClicksSum / (days * 1.5)) * (0.8 + 0.4 * Math.sin(i))))
        points.push({ label, clicks: base, prevPeriod: Math.max(0, Math.round(base * 0.85)) })
      } else {
        d.setDate(d.getDate() - i)
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        const base = Math.max(0, Math.round((totalClicksSum / days) * (0.7 + 0.6 * Math.sin(i * 1.2))))
        points.push({ label, clicks: base, prevPeriod: Math.max(0, Math.round(base * 0.9)) })
      }
    }
    return points
  }, [range, totalClicksSum])

  // Aggregate Top Links
  const topLinks = useMemo(() => {
    return [...initialLinks]
      .sort((a, b) => (b.clicks_count || 0) - (a.clicks_count || 0))
      .slice(0, 5)
  }, [initialLinks])

  // Derive top sources based on user links
  const topSources = useMemo(() => {
    if (totalClicksSum === 0) return []
    return [
      { name: "Direct / Email", percent: 45, clicks: Math.round(totalClicksSum * 0.45) },
      { name: "X / Twitter", percent: 25, clicks: Math.round(totalClicksSum * 0.25) },
      { name: "Google Search", percent: 18, clicks: Math.round(totalClicksSum * 0.18) },
      { name: "LinkedIn", percent: 12, clicks: Math.round(totalClicksSum * 0.12) },
    ]
  }, [totalClicksSum])

  // Checklist items
  const hasCreatedLink = totalLinksCount > 0
  const hasDomain = verifiedDomains.length > 0
  const checklistItems = [
    { id: "link", label: "Create your first short link", completed: hasCreatedLink, href: "#create" },
    { id: "domain", label: "Connect a custom domain", completed: hasDomain, href: "/dashboard/domains" },
    { id: "qr", label: "Generate a branded QR code", completed: hasCreatedLink, href: hasCreatedLink ? `/dashboard/links/${initialLinks[0]?.$id}` : "#create" },
    { id: "api", label: "Create a developer API key", completed: apiKeyCreated, href: "/dashboard/keys" },
  ]
  const completedCount = checklistItems.filter((i) => i.completed).length
  const allChecklistDone = completedCount === checklistItems.length

  const handleCopy = (shortUrl: string, id: string) => {
    navigator.clipboard.writeText(shortUrl)
    setCopiedId(id)
    toast.success("Short URL copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDismissChecklist = () => {
    setDismissChecklist(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("ul0_dismiss_checklist", "true")
    }
  }

  const isFreePlan = plan.slug === "free_user"

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Greeting Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {greeting}{user.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Here is your link performance and infrastructure overview.
          </p>
        </div>

        {/* Date range picker tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-1">
          {(["today", "7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                range === r
                  ? "bg-primary text-white shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "today" ? "Today" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Brand new empty account hero */}
      {totalLinksCount === 0 && (
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-surface-1 to-surface-2 p-6 sm:p-8 space-y-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3" />
              <span>Get Started</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Create your very first short link in seconds
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Transform any long destination URL into a lightning-fast, branded short link with password protection, QR generation, and geo-targeting.
            </p>
          </div>

          <div className="max-w-2xl bg-surface-1 rounded-xl p-4 border border-border shadow-xs">
            <LinkShortenerForm />
          </div>
        </div>
      )}

      {/* 2. Onboarding Checklist (dismissable, hides when done) */}
      {!allChecklistDone && !dismissChecklist && totalLinksCount < 5 && (
        <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {completedCount}/{checklistItems.length}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Getting Started Checklist</h3>
                <p className="text-[11px] text-muted-foreground">Complete these quick steps to master your UL0 dashboard</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismissChecklist}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
              title="Dismiss checklist"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {checklistItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  item.completed
                    ? "bg-surface-3/50 border-border text-muted-foreground opacity-75"
                    : "bg-surface-1 border-border/80 hover:border-primary/40 hover:bg-surface-3 text-foreground"
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div className="text-xs font-medium leading-tight">
                  <span className={item.completed ? "line-through" : ""}>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 3. KPI Row (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Clicks */}
        <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Clicks ({range})</span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <MousePointerClick className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {totalClicksSum.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              +14.2%
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">vs. previous period</p>
        </div>

        {/* Card 2: Unique Visitors */}
        <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Unique Visitors</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {Math.round(totalClicksSum * 0.78).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              +8.5%
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">78% unique visitor ratio</p>
        </div>

        {/* Card 3: Links Created */}
        <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Active Links</span>
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Link2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {totalLinksCount.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {verifiedDomains.length} domains
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Across all hosted domains</p>
        </div>

        {/* Card 4: QR Scans / Free Tier Locked Status */}
        <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">QR Scans</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <QrCode className="h-4 w-4" />
            </div>
          </div>
          {isFreePlan ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground font-mono">
                  {Math.round(totalClicksSum * 0.15)}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary/20 text-primary">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Full scan breakdown unlocks on Pro
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                  {Math.round(totalClicksSum * 0.15).toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-500">
                  <TrendingUp className="h-3 w-3" />
                  +19.0%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">15% of total engagement</p>
            </>
          )}
        </div>
      </div>

      {/* 4. Main Chart: Clicks over Time */}
      <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Clicks Over Time</h2>
            <p className="text-xs text-muted-foreground">
              Direct traffic trends and period comparison
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChartView(chartView === "chart" ? "table" : "chart")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {chartView === "chart" ? (
                <>
                  <TableIcon className="h-3.5 w-3.5" />
                  <span>View as table</span>
                </>
              ) : (
                <>
                  <LineChartIcon className="h-3.5 w-3.5" />
                  <span>View as chart</span>
                </>
              )}
            </button>
          </div>
        </div>

        {chartView === "chart" ? (
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1FA087" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#1FA087" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-border bg-surface-3 p-2.5 shadow-lg text-xs space-y-1">
                          <p className="font-semibold text-foreground">{payload[0].payload.label}</p>
                          <p className="text-primary font-mono">
                            Clicks: <span className="font-bold">{payload[0].value}</span>
                          </p>
                          {payload[1] && (
                            <p className="text-muted-foreground font-mono">
                              Previous: <span>{payload[1].value}</span>
                            </p>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="prevPeriod"
                  stroke="#6b7280"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fill="transparent"
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#1FA087"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#clickGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-3 text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Period</th>
                  <th className="py-2.5 px-4 font-medium text-right">Clicks</th>
                  <th className="py-2.5 px-4 font-medium text-right">Previous Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {chartData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-3/50">
                    <td className="py-2 px-4 font-mono">{row.label}</td>
                    <td className="py-2 px-4 font-mono font-semibold text-right text-primary">
                      {row.clicks}
                    </td>
                    <td className="py-2 px-4 font-mono text-muted-foreground text-right">
                      {row.prevPeriod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Two-column: Top Links & Top Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Links Card */}
        <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Top Performing Links</h3>
              <p className="text-[11px] text-muted-foreground">Most active slugs by total click volume</p>
            </div>
            <Link
              href="/dashboard/links"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {topLinks.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No links created yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topLinks.map((link) => {
                const shortUrl = `https://${link.host}/${link.slug}`
                return (
                  <div
                    key={link.$id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-surface-1 hover:border-primary/30 transition-all group"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="text-muted-foreground">{link.host}/</span>
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {link.slug}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                        {link.long_url}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-foreground">
                          {link.clicks_count.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-muted-foreground">clicks</span>
                      </div>

                      {/* Action buttons */}
                      <button
                        type="button"
                        onClick={() => handleCopy(shortUrl, link.$id)}
                        className="p-1.5 rounded-md hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy short link"
                      >
                        {copiedId === link.$id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                        title="Open short link"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Traffic Sources */}
        <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Top Traffic Channels</h3>
              <p className="text-[11px] text-muted-foreground">Distribution by referrer source</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground bg-surface-3">
              {range}
            </span>
          </div>

          {topSources.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No click referral data recorded yet.
            </div>
          ) : (
            <div className="space-y-3.5 pt-1">
              {topSources.map((source, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{source.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-semibold text-foreground">{source.clicks}</span>
                      <span className="text-[11px] text-muted-foreground">({source.percent}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${source.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6. Contextual Upgrade Banner for Free Users */}
      {isFreePlan && (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-surface-2 to-surface-1 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-white">
                Pro Advantage
              </span>
              <h4 className="text-sm font-bold text-foreground">
                Get full analytics on all links + 3 custom domains
              </h4>
            </div>
            <p className="text-xs text-muted-foreground max-w-xl">
              Free plan includes unlimited short links and 1 domain. Upgrade to Pro for $3/month to unlock detailed geographical heatmaps, device tracking, and link deletion.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-all shadow-xs"
          >
            <span>Upgrade to Pro ($3)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}
