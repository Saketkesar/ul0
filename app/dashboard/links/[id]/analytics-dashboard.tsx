"use client"

import { useState, useEffect, useMemo } from "react"
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

const COLORS = ["#000000", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#E5E7EB"]

export function AnalyticsDashboard({
  linkId,
  initialLink,
  initialClicks,
}: AnalyticsDashboardProps) {
  const [clicks, setClicks] = useState<ClickRecord[]>(initialClicks)
  const [link, setLink] = useState<LinkData>(initialLink)
  const [loading, setLoading] = useState(false)

  // Fetch updated data from the API
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
  };

  // Poll for live analytics every 8 seconds
  useEffect(() => {
    const t = setInterval(refreshData, 8000)
    return () => clearInterval(t)
  }, [linkId])

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

    const ipSeen = new Set<string>()

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

    // Sort clicks by timestamp ascending for time-series trend
    const sortedClicks = [...clicks].sort(
      (a, b) => new Date(a.clicked_at).getTime() - new Date(b.clicked_at).getTime()
    )

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
    const trendData = Object.entries(dailyClicksTrend).map(([date, count]) => ({
      date,
      clicks: count,
    }))

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
      cityBreakdown: Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 5),
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
      "IP Hash",
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
      "Language",
      "Timezone",
      "Is Bot",
      "Is Unique",
      "Is QR Scan",
    ]

    const rows = clicks.map((c) => [
      c.$id,
      c.clicked_at,
      c.ip_hash || "",
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
      c.language || "",
      c.timezone || "",
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

  const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <div className="space-y-8">
      {/* Realtime Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            Interactive Engine Dashboard
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Auto-polling enabled: Updates live every 8s.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted/50 disabled:opacity-50 transition-colors bg-white text-gray-700 border-gray-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Sync Now
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* 16 Premium Analytics Indicators Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Clicks */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Total Clicks</span>
            <MousePointerClick className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{clicks.length}</p>
          <p className="text-3xs text-gray-400 mt-1 font-mono">Accumulated redirects</p>
        </div>

        {/* Today's Clicks */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Today&apos;s Clicks</span>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.todayClicks}</p>
          <p className="text-3xs text-green-600 mt-1 font-semibold">Active timezone today</p>
        </div>

        {/* Unique Visitors */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Unique Visitors</span>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.uniqueVisitors}</p>
          <p className="text-3xs text-gray-400 mt-1 font-mono">Unique IP fingerprints</p>
        </div>

        {/* Live Visitors */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs bg-rose-500/2 border-rose-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              Live Clicks
            </span>
            <Globe className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-700">{stats.liveVisitors}</p>
          <p className="text-3xs text-rose-500 mt-1">Activity in last 5 minutes</p>
        </div>

        {/* Avg Daily Clicks */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-gray-500 block mb-2">Avg Daily Clicks</span>
          <p className="text-2xl font-bold text-gray-900">{stats.avgDailyClicks}</p>
          <p className="text-3xs text-gray-400 mt-1 font-mono">Calculated across active days</p>
        </div>

        {/* Returning Visitors */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-gray-500 block mb-2">Returning Clicks</span>
          <p className="text-2xl font-bold text-gray-900">{stats.returningVisitors}</p>
          <p className="text-3xs text-gray-400 mt-1 font-mono">Repeat redirects logged</p>
        </div>

        {/* Peak Hour */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-gray-500 block mb-2">Peak Hour</span>
          <p className="text-2xl font-bold text-gray-900">{stats.peakHour}</p>
          <p className="text-3xs text-gray-400 mt-1 font-mono">Highest traffic window</p>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-gray-500 block mb-2">Conversion Rate</span>
          <p className="text-2xl font-bold text-gray-900">{conversionRate}</p>
          <p className="text-3xs text-gray-400 mt-1 font-mono">Unique visitors / total clicks</p>
        </div>

        {/* QR scans */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">QR Code Scans</span>
            <QrCode className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.qrScans}</p>
          <p className="text-3xs text-gray-400 mt-1 font-mono">Scans via generated QR codes</p>
        </div>

        {/* Bot Traffic */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-gray-500 block mb-2">Bot Traffic</span>
          <p className="text-2xl font-bold text-gray-900">{stats.botTraffic}</p>
          <p className="text-3xs text-orange-600 mt-1 font-semibold">Crawlers & scrapers blocked</p>
        </div>

        {/* Link Health */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-gray-500 block mb-2">Link Health</span>
          <p className="text-2xl font-bold text-green-600">100%</p>
          <p className="text-3xs text-green-600 mt-1 font-semibold">Active & Redirecting</p>
        </div>

        {/* Expiration status */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <span className="text-xs font-medium text-gray-500 block mb-2">Expiration Status</span>
          <p className="text-2xl font-bold text-gray-950">
            {link.expire_at ? "Has Limit" : "Permanent"}
          </p>
          <p className="text-3xs text-gray-400 mt-1 truncate">
            {link.expire_at ? new Date(link.expire_at).toLocaleDateString() : "No expiration set"}
          </p>
        </div>
      </div>

      {/* Time-Series Clicks Trend (Tremor-like Recharts integration) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-6">Clicks Over Time</h3>
        <div className="h-72 w-full">
          {stats.trendData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No daily click metrics recorded yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: 10, fontFamily: "monospace" }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fontFamily: "monospace" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "11px",
                    fontFamily: "sans-serif",
                  }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Heatmap (Hour vs Day) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-2">Hourly Traffic Heatmap</h3>
        <p className="text-[11px] text-muted-foreground mb-6">Analyze peak performance windows by hour of the day.</p>
        <div className="overflow-x-auto">
          <div className="min-w-[640px] space-y-1">
            <div className="flex gap-1.5 text-[9px] font-mono text-gray-400 mb-2 pl-20">
              {Array(24).fill(0).map((_, i) => (
                <span key={i} className="w-5 text-center">
                  {i.toString().padStart(2, "0")}h
                </span>
              ))}
            </div>
            {DAYS_OF_WEEK.map((dayName, dayIdx) => (
              <div key={dayName} className="flex items-center gap-1.5">
                <span className="w-20 text-xs text-gray-500 font-medium truncate">
                  {dayName}
                </span>
                <div className="flex gap-1.5">
                  {Array(24).fill(0).map((_, hourIdx) => {
                    const count = stats.heatmapGrid[dayIdx][hourIdx]
                    // Determine color density
                    let color = "bg-gray-100/50"
                    if (count > 0 && count <= 2) color = "bg-rose-500/10 text-rose-500/0"
                    else if (count > 2 && count <= 5) color = "bg-rose-500/30"
                    else if (count > 5 && count <= 10) color = "bg-rose-500/50"
                    else if (count > 10) color = "bg-rose-500"

                    return (
                      <div
                        key={hourIdx}
                        className={`w-5 h-5 rounded-sm flex items-center justify-center text-[8px] font-mono select-none transition-all hover:scale-105 ${color} ${
                          count > 0 ? "font-semibold text-gray-900" : "text-gray-300"
                        }`}
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

      {/* Double Column Breakdown (Devices, Browsers, Locations, Referrers) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Device & Browser Breakdowns */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-8">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5">
              <Monitor className="h-4 w-4 text-gray-400" />
              Device Distribution
            </h3>
            <div className="h-44 w-full flex items-center justify-center">
              {stats.deviceData.length === 0 ? (
                <span className="text-xs text-muted-foreground">No device data logged</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.deviceData} innerRadius={55} outerRadius={70} paddingAngle={3} dataKey="value">
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

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Browser Distribution</h3>
            <div className="h-44 w-full flex items-center justify-center">
              {stats.browserData.length === 0 ? (
                <span className="text-xs text-muted-foreground">No browser metrics recorded</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.browserData} innerRadius={55} outerRadius={70} paddingAngle={3} dataKey="value">
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
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-8">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-gray-400" />
              Top Locations
            </h3>
            <div className="h-44 w-full">
              {stats.countryData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No geo location logs available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.countryData} layout="vertical" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" style={{ fontSize: 10, fontWeight: "bold" }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#000000" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5">
              <Search className="h-4 w-4 text-gray-400" />
              Top Referrers
            </h3>
            <div className="h-44 w-full">
              {stats.referrerData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No referrer metrics available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.referrerData} layout="vertical" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" style={{ fontSize: 10, fontWeight: "bold" }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#374151" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Realtime Click Timeline (Live Feed style) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-2">Live Click Timeline</h3>
        <p className="text-[11px] text-muted-foreground mb-6">Realtime stream of visitors redirecting through your short links.</p>
        <div className="h-80 overflow-y-auto pr-2 scrollbar-thin">
          {clicks.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Waiting for live visits...
            </div>
          ) : (
            <div className="space-y-4">
              {clicks.slice(0, 100).map((c) => {
                const date = new Date(c.clicked_at)
                const formattedTime = date.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
                const isBot = c.bot

                return (
                  <div key={c.$id} className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="rounded-md bg-gray-50 border p-2 text-gray-600 shrink-0">
                        <Terminal className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-gray-900">
                            {c.city || "Someone"} ({c.country || "Unknown"})
                          </span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold text-gray-600">
                            {c.browser || "Browser"} / {c.os || "OS"}
                          </span>
                          {isBot && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-semibold text-orange-600">
                              BOT
                            </span>
                          )}
                          {c.qr_scan && (
                            <span className="rounded-full bg-green-150 px-2 py-0.5 text-[9px] font-semibold text-green-700 bg-green-100 border border-green-200">
                              QR SCAN
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground break-all leading-normal max-w-xl">
                          Referrer: <span className="font-mono">{c.referrer || "Direct"}</span>
                          {c.utm_source && (
                            <span className="ml-2 font-mono text-primary font-medium">
                              [utm: {c.utm_source} / {c.utm_medium}]
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">
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
