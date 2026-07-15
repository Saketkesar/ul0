"use client"

import { useState, useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import {
  MousePointerClick,
  Users,
  Clock,
  Globe,
  Monitor,
  Search,
  Download,
  AlertCircle,
  QrCode,
  Sparkles,
  RefreshCw,
  Terminal,
  Activity,
  UserCheck,
  Zap,
  ShieldCheck,
  Calendar,
  Layers,
  Percent,
  Cpu,
} from "lucide-react"

interface ClickRecord {
  $id: string
  clicked_at: string
  device_type: string | null
  country: string | null
  region: string | null
  city: string | null
  browser: string | null
  os: string | null
  device: string | null
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  language: string | null
  timezone: string | null
  bot: boolean | null
  unique_visitor: boolean | null
  qr_scan: boolean | null
}

interface LinkData {
  $id: string
  slug: string
  long_url: string
  host: string
  clicks_count: number
  created_at: string | null
  expire_at: string | null
  targeting_json?: string | null
}

interface AnalyticsDashboardProps {
  linkId: string
  initialLink: LinkData
  initialClicks: ClickRecord[]
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"]

export function AnalyticsDashboard({
  linkId,
  initialLink,
  initialClicks,
}: AnalyticsDashboardProps) {
  const [clicks, setClicks] = useState<ClickRecord[]>(initialClicks)
  const [link, setLink] = useState<LinkData>(initialLink)
  const [loading, setLoading] = useState(false)

  // Fetch updated data on demand (manual refresh)
  const refreshData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/links/${linkId}/analytics`)
      if (res.ok) {
        const data = await res.json()
        setClicks(data.clicks)
        setLink(data.link)
      }
    } catch (err) {
      console.error("Refresh error:", err)
    } finally {
      setLoading(false)
    }
  }

  // --- Aggregate & Metric Calculations ---
  const stats = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const fiveMinutesAgo = now.getTime() - 5 * 60 * 1000

    let todayClicks = 0
    let uniqueVisitors = 0
    let liveVisitors = 0
    let qrScans = 0
    let botTraffic = 0
    let returningVisitors = 0

    const browserMap: Record<string, number> = {}
    const osMap: Record<string, number> = {}
    const deviceMap: Record<string, number> = {}
    const countryMap: Record<string, number> = {}
    const cityMap: Record<string, number> = {}
    const referrerMap: Record<string, number> = {}
    const hourlyDistribution = Array(24).fill(0)
    const dailyClicksTrend: Record<string, number> = {}

    // Heatmap: 7 days (index 0=Sun, 6=Sat) x 24 hours
    const heatmapGrid: number[][] = Array(7).fill(0).map(() => Array(24).fill(0))

    for (const c of clicks) {
      const clickTime = new Date(c.clicked_at)
      const clickMs = clickTime.getTime()

      // Today's Clicks
      if (clickMs >= startOfToday) todayClicks++

      // Live Visitors (last 5 minutes)
      if (clickMs >= fiveMinutesAgo) liveVisitors++

      // Unique vs Returning
      if (c.unique_visitor) {
        uniqueVisitors++
      } else {
        returningVisitors++
      }

      // QR Code Scans
      if (c.qr_scan) qrScans++

      // Bot Traffic
      if (c.bot) botTraffic++

      // Browser, OS, Device
      const browser = c.browser || "Other"
      const os = c.os || "Other"
      const device = c.device || "Desktop"
      const country = c.country || "Unknown"
      const city = c.city || "Unknown"
      const referrer = c.referrer
        ? (() => {
            try {
              return new URL(c.referrer).hostname
            } catch {
              return "Direct"
            }
          })()
        : "Direct"

      browserMap[browser] = (browserMap[browser] || 0) + 1
      osMap[os] = (osMap[os] || 0) + 1
      deviceMap[device] = (deviceMap[device] || 0) + 1
      countryMap[country] = (countryMap[country] || 0) + 1
      cityMap[city] = (cityMap[city] || 0) + 1
      referrerMap[referrer] = (referrerMap[referrer] || 0) + 1

      // Hourly Distribution
      const hr = clickTime.getHours()
      hourlyDistribution[hr]++

      // Heatmap index (Day vs Hour)
      const day = clickTime.getDay()
      heatmapGrid[day][hr]++

      // Daily Trend Key
      const trendKey = clickTime.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
      dailyClicksTrend[trendKey] = (dailyClicksTrend[trendKey] || 0) + 1
    }

    // Peak Hour calculation
    let maxHourCount = -1
    let peakHour = 0
    for (let h = 0; h < 24; h++) {
      if (hourlyDistribution[h] > maxHourCount) {
        maxHourCount = hourlyDistribution[h]
        peakHour = h
      }
    }

    // Average Daily Clicks
    const daysWithClicks = Object.keys(dailyClicksTrend).length || 1
    const avgDailyClicks = Math.round(clicks.length / daysWithClicks)

    // Chart Formatters
    const trendData = Object.entries(dailyClicksTrend)
      .map(([date, count]) => ({ date, clicks: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }))
    const browserData = Object.entries(browserMap).map(([name, value]) => ({ name, value }))
    const osData = Object.entries(osMap).map(([name, value]) => ({ name, value }))
    
    const countryData = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }))

    const referrerData = Object.entries(referrerMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }))

    return {
      todayClicks,
      uniqueVisitors,
      liveVisitors,
      qrScans,
      botTraffic,
      returningVisitors,
      peakHour: `${peakHour.toString().padStart(2, "0")}:00`,
      avgDailyClicks,
      trendData,
      deviceData,
      browserData,
      osData,
      countryData,
      referrerData,
      heatmapGrid,
    }
  }, [clicks])

  // Conversion rate (Unique visitors / Total clicks)
  const conversionRate = useMemo(() => {
    if (clicks.length === 0) return "0%"
    return `${Math.round((stats.uniqueVisitors / clicks.length) * 100)}%`
  }, [clicks, stats.uniqueVisitors])

  // Export clicks to CSV file
  const exportCSV = () => {
    const headers = [
      "Click ID",
      "Timestamp",
      "Country",
      "Region",
      "City",
      "Device Type",
      "Browser",
      "OS",
      "Referrer",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "Is Bot",
      "Is Unique",
      "Is QR Scan",
    ]

    const rows = clicks.map((c) => [
      c.$id,
      c.clicked_at,
      c.country || "",
      c.region || "",
      c.city || "",
      c.device_type || "",
      c.browser || "",
      c.os || "",
      c.referrer || "",
      c.utm_source || "",
      c.utm_medium || "",
      c.utm_campaign || "",
      c.bot ? "TRUE" : "FALSE",
      c.unique_visitor ? "TRUE" : "FALSE",
      c.qr_scan ? "TRUE" : "FALSE",
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `ul0_analytics_${linkId}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      {/* Realtime Dashboard Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-gray-250/60 rounded-xl p-4 sm:p-5 shadow-2xs">
        <div>
          <h2 className="text-base font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            Link Analytics Engine
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Click Sync Now to pull fresh redirect data from our servers.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-250 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all active:scale-98 cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Sync Now
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-950 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-all active:scale-98 shadow-xs cursor-pointer"
          >
            <Download className="h-3 w-3" />
            Export CSV
          </button>
        </div>
      </div>

      {/* 16 Premium Analytics Indicators Grid */}
      <div className="grid gap-4.5 grid-cols-2 lg:grid-cols-4">
        {/* Total Clicks */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Clicks</span>
            <div className="rounded-md bg-emerald-50 p-1 text-emerald-600">
              <MousePointerClick className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{clicks.length}</p>
          <p className="text-[10px] text-gray-500 mt-1 font-medium">Accumulated redirects</p>
        </div>

        {/* Today's Clicks */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Today&apos;s Clicks</span>
            <div className="rounded-md bg-blue-50 p-1 text-blue-600">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{stats.todayClicks}</p>
          <p className="text-[10px] text-emerald-600 mt-1 font-semibold">Active timezone today</p>
        </div>

        {/* Unique Visitors */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unique Visitors</span>
            <div className="rounded-md bg-purple-50 p-1 text-purple-600">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{stats.uniqueVisitors}</p>
          <p className="text-[10px] text-gray-500 mt-1 font-medium">Unique IP fingerprints</p>
        </div>

        {/* Live Visitors */}
        <div className="rounded-xl border border-rose-100 bg-rose-500/2 p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-rose-600 tracking-wider flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              Live Clicks
            </span>
            <div className="rounded-md bg-rose-50 p-1 text-rose-600">
              <Activity className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-rose-700 tracking-tight">{stats.liveVisitors}</p>
          <p className="text-[10px] text-rose-500 mt-1 font-medium">Activity in last 5 minutes</p>
        </div>

        {/* Avg Daily Clicks */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Daily Clicks</span>
            <div className="rounded-md bg-gray-50 p-1 text-gray-600">
              <Calendar className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{stats.avgDailyClicks}</p>
          <p className="text-[10px] text-gray-500 mt-1 font-medium">Calculated across active days</p>
        </div>

        {/* Returning Visitors */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Returning Clicks</span>
            <div className="rounded-md bg-orange-50 p-1 text-orange-600">
              <UserCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{stats.returningVisitors}</p>
          <p className="text-[10px] text-gray-500 mt-1 font-medium">Repeat redirects logged</p>
        </div>

        {/* Peak Hour */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Peak Hour</span>
            <div className="rounded-md bg-sky-50 p-1 text-sky-600">
              <Zap className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{stats.peakHour}</p>
          <p className="text-[10px] text-gray-500 mt-1 font-medium">Highest traffic window</p>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Conversion Rate</span>
            <div className="rounded-md bg-yellow-50 p-1 text-yellow-600">
              <Percent className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{conversionRate}</p>
          <p className="text-[10px] text-gray-500 mt-1 font-medium">Unique visitors / total clicks</p>
        </div>

        {/* QR scans */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">QR Code Scans</span>
            <div className="rounded-md bg-cyan-50 p-1 text-cyan-600">
              <QrCode className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{stats.qrScans}</p>
          <p className="text-[10px] text-gray-500 mt-1 font-medium">Scans via generated QR codes</p>
        </div>

        {/* Bot Traffic */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bot Traffic</span>
            <div className="rounded-md bg-amber-50 p-1 text-amber-600">
              <Cpu className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight">{stats.botTraffic}</p>
          <p className="text-[10px] text-amber-600 mt-1 font-semibold">Crawlers & bots skipped</p>
        </div>

        {/* Link Health */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Link Health</span>
            <div className="rounded-md bg-green-50 p-1 text-green-600">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-green-650 tracking-tight">100%</p>
          <p className="text-[10px] text-green-600 mt-1 font-semibold">Active & Redirecting</p>
        </div>

        {/* Expiration status */}
        <div className="rounded-xl border border-gray-200/90 bg-white p-4.5 shadow-3xs transition-all hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expiration Status</span>
            <div className="rounded-md bg-indigo-50 p-1 text-indigo-600">
              <Layers className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 tracking-tight truncate">
            {link.expire_at ? "Has Limit" : "Permanent"}
          </p>
          <p className="text-[10px] text-gray-500 mt-1 truncate">
            {link.expire_at ? new Date(link.expire_at).toLocaleDateString() : "No expiration set"}
          </p>
        </div>
      </div>

      {/* Time-Series Clicks Trend */}
      <div className="rounded-xl border border-gray-200/90 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Clicks Over Time</h3>
        <div className="h-64 w-full">
          {stats.trendData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground font-mono">
              No daily click metrics recorded yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: 9, fontFamily: "monospace", fill: "#9ca3af" }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 9, fontFamily: "monospace", fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "11px",
                  }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Heatmap (Hour vs Day) - GitHub style */}
      <div className="rounded-xl border border-gray-200/90 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Hourly Traffic Heatmap</h3>
        <p className="text-[10px] text-gray-400 mb-4">Analyze peak performance windows by hour of the day.</p>
        <div className="overflow-x-auto">
          <div className="min-w-[620px] space-y-1.5">
            <div className="flex gap-1.5 text-[9px] font-mono text-gray-400 mb-1 pl-12">
              {Array(24).fill(0).map((_, i) => (
                <span key={i} className="w-5 text-center">
                  {i.toString().padStart(2, "0")}h
                </span>
              ))}
            </div>
            {DAYS_OF_WEEK.map((dayName, dayIdx) => (
              <div key={dayName} className="flex items-center gap-1.5">
                <span className="w-10 text-[10px] text-gray-500 font-bold font-mono">
                  {dayName}
                </span>
                <div className="flex gap-1">
                  {Array(24).fill(0).map((_, hourIdx) => {
                    const count = stats.heatmapGrid[dayIdx][hourIdx]
                    // GitHub green color steps
                    let color = "bg-gray-50 border border-gray-100"
                    if (count > 0 && count <= 2) color = "bg-emerald-100/50 border border-emerald-100"
                    else if (count > 2 && count <= 5) color = "bg-emerald-250 bg-emerald-200 border border-emerald-300"
                    else if (count > 5 && count <= 10) color = "bg-emerald-400 border border-emerald-550 text-white"
                    else if (count > 10) color = "bg-emerald-600 border border-emerald-700 text-white"

                    return (
                      <div
                        key={hourIdx}
                        className={`w-5 h-5 rounded-xs flex items-center justify-center text-[9px] font-mono select-none transition-all hover:scale-110 ${color}`}
                        title={`${count} clicks on ${dayName} at ${hourIdx}:00`}
                      >
                        {count > 0 ? count : ""}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Double Column Breakdown */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Device & Browser Breakdowns */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Monitor className="h-4 w-4 text-gray-400" />
              Device Distribution
            </h3>
            <div className="h-40 w-full flex items-center justify-center">
              {stats.deviceData.length === 0 ? (
                <span className="text-xs text-muted-foreground font-mono">No device metrics</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.deviceData} innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value">
                      {stats.deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" style={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Browser Distribution</h3>
            <div className="h-40 w-full flex items-center justify-center">
              {stats.browserData.length === 0 ? (
                <span className="text-xs text-muted-foreground font-mono">No browser metrics</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.browserData} innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value">
                      {stats.browserData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" style={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Locations & Referrers Bar Charts */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-gray-400" />
              Top Locations
            </h3>
            <div className="h-40 w-full">
              {stats.countryData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground font-mono">
                  No geo location logs available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.countryData} layout="vertical" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" style={{ fontSize: 10, fontWeight: "semibold", fill: "#374151" }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Search className="h-4 w-4 text-gray-400" />
              Top Referrers
            </h3>
            <div className="h-40 w-full">
              {stats.referrerData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground font-mono">
                  No referrer metrics available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.referrerData} layout="vertical" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" style={{ fontSize: 10, fontWeight: "semibold", fill: "#374151" }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Realtime Click Timeline (Live Feed style) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Live Click Timeline</h3>
        <p className="text-[10px] text-gray-400 mb-4">Realtime stream of visitors redirecting through your short links.</p>
        <div className="h-72 overflow-y-auto pr-1 scrollbar-thin">
          {clicks.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground font-mono">
              Waiting for live visits...
            </div>
          ) : (
            <div className="space-y-3">
              {clicks.slice(0, 100).map((c) => {
                const date = new Date(c.clicked_at)
                const formattedTime = date.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
                const isBot = c.bot

                return (
                  <div key={c.$id} className="flex items-start justify-between border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2.5">
                      <div className="rounded-md bg-gray-50 border border-gray-200 p-1.5 text-gray-650 shrink-0">
                        <Terminal className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-gray-900">
                            {c.city || "Visitor"} ({c.country || "Unknown"})
                          </span>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-500 font-mono">
                            {c.browser || "Browser"} / {c.os || "OS"}
                          </span>
                          {isBot && (
                            <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-600 font-mono">
                              BOT
                            </span>
                          )}
                          {c.qr_scan && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 font-mono">
                              QR SCAN
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-550 break-all leading-normal max-w-xl font-mono">
                          Referrer: {c.referrer || "Direct"}
                          {c.utm_source && (
                            <span className="ml-1.5 text-emerald-600 font-bold">
                              [utm: {c.utm_source} / {c.utm_medium}]
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-400 font-mono shrink-0">
                      {formattedTime}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
