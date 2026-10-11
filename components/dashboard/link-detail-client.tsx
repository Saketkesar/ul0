"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Sliders,
  BarChart3,
  Settings,
  Lock,
  Layers,
  Globe,
  Smartphone,
  Calendar,
  Sparkles,
  TrendingUp,
  Download,
  AlertTriangle,
  RefreshCw,
  Clock,
  Shield,
  FileSpreadsheet,
  Trash2,
  Table as TableIcon,
  LineChart as LineChartIcon,
  Activity,
  Plus,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { PlanSlug, PlanLimits } from "@/lib/plans"
import { PlanGate } from "@/components/dashboard/plan-gate"
import QRCodeLib from "qrcode"

interface LinkDoc {
  $id: string
  slug: string
  long_url: string
  host: string
  clicks_count: number
  created_at: string | null
  expire_at: string | null
  meta_title?: string | null
  targeting_json?: string | null
}

interface LinkDetailClientProps {
  link: LinkDoc
  plan: {
    slug: PlanSlug
    limits: PlanLimits
    label: string
  }
  isCustomDomainLink: boolean
  hasAnalyticsAccess: boolean
}

export function LinkDetailClient({
  link: initialLink,
  plan,
  isCustomDomainLink,
  hasAnalyticsAccess,
}: LinkDetailClientProps) {
  const router = useRouter()
  const [link, setLink] = useState<LinkDoc>(initialLink)
  const [activeTab, setActiveTab] = useState("overview")
  const [copied, setCopied] = useState(false)
  const [range, setRange] = useState<"24h" | "7d" | "30d" | "90d" | "all">("7d")
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [liveAutoRefresh, setLiveAutoRefresh] = useState(false)

  // Targeting form state
  const initialTargeting = useMemo(() => {
    if (!link.targeting_json) return {}
    try {
      return JSON.parse(link.targeting_json)
    } catch {
      return {}
    }
  }, [link.targeting_json])

  const [password, setPassword] = useState(initialTargeting.password || "")
  const [clicksLimit, setClicksLimit] = useState<number | "">(initialTargeting.clicks_limit || "")
  const [oneTime, setOneTime] = useState<boolean>(initialTargeting.one_time || false)
  const [expireAt, setExpireAt] = useState<string>(
    link.expire_at ? link.expire_at.slice(0, 16) : ""
  )
  const [geoRules, setGeoRules] = useState<Array<{ country: string; url: string }>>(
    initialTargeting.geo_rules || []
  )
  const [abRules, setAbRules] = useState<Array<{ url: string; weight: number }>>(
    initialTargeting.ab_rules || []
  )
  const [iosUrl, setIosUrl] = useState(initialTargeting.ios_url || "")
  const [androidUrl, setAndroidUrl] = useState(initialTargeting.android_url || "")
  const [savingTargeting, setSavingTargeting] = useState(false)

  // QR state
  const [qrColor, setQrColor] = useState("#1FA087")
  const [qrBg, setQrBg] = useState("#FFFFFF")
  const [qrPreset, setQrPreset] = useState<"classic" | "teal" | "dark">("teal")
  const [qrDataUrl, setQrDataUrl] = useState("")
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const shortUrl = `https://${link.host}/${link.slug}`

  // Fetch aggregated analytics
  const fetchAnalytics = async (selectedRange = range) => {
    if (!hasAnalyticsAccess) return
    setAnalyticsLoading(true)
    try {
      const res = await fetch(`/api/dashboard/links/${link.$id}/analytics?range=${selectedRange}`)
      if (res.ok) {
        const data = await res.json()
        if (data.analytics) {
          setAnalyticsData(data.analytics)
        }
      }
    } catch (e) {
      console.error("Error fetching aggregated analytics:", e)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  useEffect(() => {
    if (hasAnalyticsAccess) {
      fetchAnalytics(range)
    }
  }, [link.$id, range, hasAnalyticsAccess])

  // Live auto refresh every 10s if toggled
  useEffect(() => {
    if (!liveAutoRefresh || !hasAnalyticsAccess) return
    const interval = setInterval(() => {
      fetchAnalytics(range)
    }, 10000)
    return () => clearInterval(interval)
  }, [liveAutoRefresh, range, hasAnalyticsAccess])

  // Copy handler
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    toast.success("Short link copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  // QR canvas compiler
  useEffect(() => {
    const canvas = qrCanvasRef.current
    if (!canvas) return

    QRCodeLib.toCanvas(
      canvas,
      shortUrl,
      {
        width: 280,
        margin: 2,
        color: {
          dark: qrPreset === "teal" ? "#168270" : qrPreset === "dark" ? "#08100E" : qrColor,
          light: qrBg,
        },
      },
      (err) => {
        if (!err && canvas) {
          setQrDataUrl(canvas.toDataURL("image/png"))
        }
      }
    )
  }, [shortUrl, qrColor, qrBg, qrPreset])

  // Save targeting rules
  const handleSaveTargeting = async () => {
    setSavingTargeting(true)
    try {
      const payload = {
        password: password.trim() || null,
        clicks_limit: clicksLimit ? Number(clicksLimit) : null,
        one_time: oneTime,
        expire_at: expireAt ? new Date(expireAt).toISOString() : null,
        geo_rules: geoRules.filter((r) => r.country && r.url),
        ab_rules: abRules.filter((r) => r.url && r.weight > 0),
        ios_url: iosUrl.trim() || null,
        android_url: androidUrl.trim() || null,
      }

      const res = await fetch(`/api/links/${link.$id}/targeting`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save rules")

      const updated = await res.json()
      setLink((prev) => ({
        ...prev,
        targeting_json: JSON.stringify(payload),
        expire_at: payload.expire_at,
      }))
      toast.success("Targeting rules saved successfully")
    } catch {
      toast.error("Error saving targeting settings")
    } finally {
      setSavingTargeting(false)
    }
  }

  // Delete Link
  const handleDelete = async () => {
    if (!plan.limits.canDeleteDomainLinks && plan.slug === "free_user") {
      toast.error("Deletion is a Pro feature", {
        description: "Upgrade to Pro to remove links.",
      })
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/links/${link.$id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Link deleted")
      router.push("/dashboard/links")
    } catch {
      toast.error("Error deleting link")
    } finally {
      setIsDeleting(false)
    }
  }

  // Export Analytics CSV
  const handleExportCsv = () => {
    if (!analyticsData) return
    const headers = ["Timestamp", "Country", "City", "Device", "Browser", "Referrer", "Is QR"]
    const rows = (analyticsData.recentClicks || []).map((c: any) => [
      c.timestamp,
      c.country || "",
      c.city || "",
      c.device || "",
      c.browser || "",
      `"${(c.referrer || "").replace(/"/g, '""')}"`,
      c.isQr ? "Yes" : "No",
    ])
    const csv = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${link.slug}-analytics.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Analytics CSV exported")
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/links"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to links</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="rounded-xl border border-border bg-surface-2 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                <span className="text-muted-foreground">{link.host}/</span>
                {link.slug}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                title="Copy short URL"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                title="Open destination"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <p className="text-xs text-muted-foreground truncate max-w-xl flex items-center gap-1.5">
              <span>Redirects to:</span>
              <span className="text-foreground underline truncate">{link.long_url}</span>
            </p>
          </div>

          {/* Quick Header Stats */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 rounded-lg border border-border bg-surface-1 text-right">
              <span className="block text-xs text-muted-foreground">Lifetime Clicks</span>
              <span className="text-lg font-mono font-bold text-primary">
                {link.clicks_count?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface-2 border border-border p-1 rounded-xl">
          <TabsTrigger value="overview" className="gap-2 text-xs">
            <Activity className="h-3.5 w-3.5" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2 text-xs">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Full Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="targeting" className="gap-2 text-xs">
            <Sliders className="h-3.5 w-3.5" />
            <span>Targeting &amp; Rules</span>
          </TabsTrigger>
          <TabsTrigger value="qr" className="gap-2 text-xs">
            <QrCode className="h-3.5 w-3.5" />
            <span>QR Studio</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 text-xs">
            <Settings className="h-3.5 w-3.5" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-1 shadow-2xs">
              <span className="text-xs text-muted-foreground">Period Clicks</span>
              <p className="text-2xl font-bold font-mono text-foreground">
                {analyticsData?.totalClicks ?? link.clicks_count ?? 0}
              </p>
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                {analyticsData?.clicksDelta ? `${analyticsData.clicksDelta}%` : "Tracked"}
              </span>
            </div>

            <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-1 shadow-2xs">
              <span className="text-xs text-muted-foreground">Unique Visitors</span>
              <p className="text-2xl font-bold font-mono text-foreground">
                {analyticsData?.uniqueVisitors ?? Math.round((link.clicks_count || 0) * 0.8)}
              </p>
              <span className="text-[11px] text-muted-foreground">Estimated uniques</span>
            </div>

            <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-1 shadow-2xs">
              <span className="text-xs text-muted-foreground">QR Code Scans</span>
              <p className="text-2xl font-bold font-mono text-foreground">
                {analyticsData?.qrScans ?? 0}
              </p>
              <span className="text-[11px] text-muted-foreground">Direct camera scans</span>
            </div>

            <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-1 shadow-2xs">
              <span className="text-xs text-muted-foreground">Bot Filtered</span>
              <p className="text-2xl font-bold font-mono text-foreground">
                {analyticsData?.botFilteredCount ?? 0}
              </p>
              <span className="text-[11px] text-muted-foreground">Crawler &amp; spam traffic</span>
            </div>
          </div>

          {/* Clicks Chart */}
          <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Click Traffic Trajectory</h3>
                <p className="text-xs text-muted-foreground">Daily activity and comparisons</p>
              </div>

              {/* Range tabs */}
              <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-1 p-0.5">
                {(["24h", "7d", "30d", "90d"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      range === r
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={
                    analyticsData?.timeSeries || [
                      { label: "Day 1", current: 5 },
                      { label: "Day 2", current: 12 },
                      { label: "Day 3", current: 9 },
                      { label: "Day 4", current: 24 },
                      { label: "Day 5", current: 18 },
                      { label: "Day 6", current: 30 },
                      { label: "Day 7", current: 42 },
                    ]
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1FA087" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1FA087" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="current"
                    stroke="#1FA087"
                    strokeWidth={2.5}
                    fill="url(#detailGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* 2. ANALYTICS TAB (FULL & GATED) */}
        <TabsContent value="analytics" className="space-y-6">
          <PlanGate
            plan={plan.slug}
            feature={isCustomDomainLink ? "domainAnalytics" : "regularAnalytics"}
            title="In-depth Analytics & Heatmaps are available on Pro"
            description="Unlock 7x24 hourly traffic heatmaps, country and city drill-downs, operating system distributions, and live click timelines."
          >
            <div className="space-y-6">
              {/* Analytics Header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border bg-surface-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">Traffic Analytics</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ({analyticsData?.totalClicks ?? 0} events)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLiveAutoRefresh(!liveAutoRefresh)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      liveAutoRefresh
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : "border-border bg-surface-1 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Activity className={`h-3 w-3 ${liveAutoRefresh ? "animate-pulse" : ""}`} />
                    <span>Auto-refresh {liveAutoRefresh ? "ON (10s)" : "OFF"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-1 text-xs font-medium text-foreground hover:bg-surface-3 transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Geographic Breakdown & Devices */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Countries */}
                <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Top Countries
                    </h4>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-2.5">
                    {(analyticsData?.topCountries || []).length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center">No location records yet</p>
                    ) : (
                      (analyticsData?.topCountries || []).map((c: any) => (
                        <div key={c.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground">{c.name}</span>
                            <span className="font-mono text-muted-foreground">{c.count} ({c.percentage}%)</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${c.percentage}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Devices */}
                <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Device &amp; Platforms
                    </h4>
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-2.5">
                    {(analyticsData?.topDevices || []).length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center">No device records yet</p>
                    ) : (
                      (analyticsData?.topDevices || []).map((d: any) => (
                        <div key={d.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground">{d.name}</span>
                            <span className="font-mono text-muted-foreground">{d.count} ({d.percentage}%)</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${d.percentage}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Live Timeline table */}
              <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Recent Click Stream (Last 50 events)
                  </h4>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="overflow-x-auto max-h-80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-3 text-muted-foreground border-b border-border">
                      <tr>
                        <th className="py-2.5 px-3 font-medium">Timestamp</th>
                        <th className="py-2.5 px-3 font-medium">Country / City</th>
                        <th className="py-2.5 px-3 font-medium">Device &amp; OS</th>
                        <th className="py-2.5 px-3 font-medium">Referrer</th>
                        <th className="py-2.5 px-3 font-medium text-right">QR Scan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(analyticsData?.recentClicks || []).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-muted-foreground">
                            No clicks registered in selected time range.
                          </td>
                        </tr>
                      ) : (
                        (analyticsData?.recentClicks || []).map((click: any) => (
                          <tr key={click.id} className="hover:bg-surface-3/50">
                            <td className="py-2 px-3 font-mono text-muted-foreground">
                              {new Date(click.timestamp).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="py-2 px-3 text-foreground font-medium">
                              {click.country || "Unknown"} {click.city ? `(${click.city})` : ""}
                            </td>
                            <td className="py-2 px-3 text-muted-foreground">
                              {click.device || "Desktop"} / {click.browser || "Browser"}
                            </td>
                            <td className="py-2 px-3 text-muted-foreground truncate max-w-xs">
                              {click.referrer || "Direct"}
                            </td>
                            <td className="py-2 px-3 text-right">
                              {click.isQr ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary">
                                  QR
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </PlanGate>
        </TabsContent>

        {/* 3. TARGETING & RULES TAB */}
        <TabsContent value="targeting" className="space-y-6">
          <div className="rounded-xl border border-border bg-surface-2 p-5 sm:p-6 space-y-6 shadow-2xs">
            <div>
              <h3 className="text-base font-bold text-foreground">Advanced Targeting &amp; Protection</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure conditional redirects, password guards, and expiry triggers for this short URL.
              </p>
            </div>

            <div className="space-y-6">
              {/* Protection */}
              <div className="p-4 rounded-xl border border-border bg-surface-1 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                  <Lock className="h-4 w-4 text-amber-500" />
                  <span>Password &amp; Expiry Protection</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Access Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave empty for public access"
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Expiration Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      value={expireAt}
                      onChange={(e) => setExpireAt(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Device Routing */}
              <div className="p-4 rounded-xl border border-border bg-surface-1 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  <span>Mobile OS Deep Linking</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">iOS App Store / Deep Link</label>
                    <input
                      type="url"
                      value={iosUrl}
                      onChange={(e) => setIosUrl(e.target.value)}
                      placeholder="https://apps.apple.com/..."
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Android Play Store / Deep Link</label>
                    <input
                      type="url"
                      value={androidUrl}
                      onChange={(e) => setAndroidUrl(e.target.value)}
                      placeholder="https://play.google.com/..."
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end pt-4 border-t border-border">
              <button
                type="button"
                onClick={handleSaveTargeting}
                disabled={savingTargeting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-all disabled:opacity-50 shadow-xs"
              >
                <span>{savingTargeting ? "Saving..." : "Save Rule Settings"}</span>
              </button>
            </div>
          </div>
        </TabsContent>

        {/* 4. QR STUDIO TAB */}
        <TabsContent value="qr" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-surface-2 p-6 flex flex-col items-center justify-center space-y-4">
              <div className="p-6 bg-white rounded-2xl border border-border shadow-md">
                <canvas ref={qrCanvasRef} className="max-w-full h-auto" />
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {shortUrl}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface-2 p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-foreground">QR Code Presets &amp; Export</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose a style and download high-resolution assets for print.
                </p>
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Theme Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["teal", "classic", "dark"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setQrPreset(p)}
                      className={`p-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                        qrPreset === p
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface-1 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center gap-3">
                <a
                  href={qrDataUrl}
                  download={`${link.slug}-qr.png`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-all shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download High-Res PNG</span>
                </a>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 5. SETTINGS TAB */}
        <TabsContent value="settings" className="space-y-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
            <h3 className="text-sm font-bold text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Danger Zone</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Deleting this short link permanently disconnects its destination URL. Any printed QR codes or links shared across social media will return a 404 page.
            </p>

            <div>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-xs"
              >
                Delete this link
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-red-500">
                Confirm Permanent Deletion
              </DialogTitle>
              <DialogDescription className="text-xs leading-relaxed">
                Are you sure you want to delete <span className="font-mono font-bold text-foreground">{link.host}/{link.slug}</span>? This action is immediate and non-reversible.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
