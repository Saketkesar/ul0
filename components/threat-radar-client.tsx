"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  ExternalLink,
  Copy,
  Check,
  Filter,
  AlertOctagon,
  Globe2,
  Server,
  Ban,
  Activity,
  ArrowUpRight,
  Radio,
  Lock,
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
  serverLocation?: string
  isp?: string
  clicksPrevented?: number
}

interface Props {
  threats: BlockedThreatItem[]
  blacklistedDomains: string[]
  stats: {
    totalBlocked: number
    blacklistedDomainsCount: number
    brandsProtected: number
    interceptRate: string
  }
}

export function ThreatRadarClient({ threats, blacklistedDomains, stats }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Extract unique brands for filtering
  const brands = useMemo(() => {
    const list = new Set<string>()
    threats.forEach((t) => {
      if (t.spoofedBrand) list.add(t.spoofedBrand)
    })
    return ["all", ...Array.from(list)]
  }, [threats])

  // Filter threats based on search & selected brand
  const filteredThreats = useMemo(() => {
    return threats.filter((t) => {
      const matchesBrand = selectedBrand === "all" || t.spoofedBrand.toLowerCase() === selectedBrand.toLowerCase()
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        t.slug.toLowerCase().includes(q) ||
        t.rawDomain.toLowerCase().includes(q) ||
        t.defangedUrl.toLowerCase().includes(q) ||
        t.threatCategory.toLowerCase().includes(q) ||
        t.spoofedBrand.toLowerCase().includes(q)
      return matchesBrand && matchesSearch
    })
  }, [threats, selectedBrand, searchQuery])

  const copyDefanged = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-10">
      {/* Real-time Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-zinc-900/60 border border-red-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                RADAR ACTIVE
              </span>
              <span className="text-zinc-600 dark:text-zinc-500">•</span>
              <span className="text-xs font-semibold text-zinc-300">
                Automated Zero-Tolerance Anti-Phishing Filter
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              All malicious links below are permanently disabled. Redirection is blocked and 0% link equity (DR) is passed to attackers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            DEFANGED &amp; NEUTRALIZED
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            NOFOLLOW ARMED
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/80 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Intercepted Links
            </span>
            <Ban className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
            {stats.totalBlocked}
          </p>
          <p className="text-[11px] text-muted-foreground">Permanent redirection lockout</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/80 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Blocked Domains
            </span>
            <AlertOctagon className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
            {stats.blacklistedDomainsCount}
          </p>
          <p className="text-[11px] text-muted-foreground">Blacklisted root domains</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/80 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Protected Brands
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
            {stats.brandsProtected}+
          </p>
          <p className="text-[11px] text-muted-foreground">Spoofing heuristics enabled</p>
        </div>

        <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/80 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Neutralization Rate
            </span>
            <Activity className="h-4 w-4 text-sky-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-500 dark:text-emerald-400">
            {stats.interceptRate}
          </p>
          <p className="text-[11px] text-muted-foreground">0 traffic passed to scams</p>
        </div>
      </div>

      {/* Permanently Blacklisted Root Domains Strip */}
      <div className="p-5 rounded-2xl bg-muted/20 border border-border/60 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-red-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Permanently Banned Phishing Infrastructure Domains
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            Direct &amp; Wildcard Subdomains Blocked
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {blacklistedDomains.map((domain) => (
            <div
              key={domain}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>*.{domain.replace(".", "[.]")}</span>
              <span className="text-[10px] text-red-500/70 font-sans uppercase font-bold">BANNED</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls: Search & Brand Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search slug, domain or threat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 font-mono placeholder:font-sans"
          />
        </div>

        {/* Brand category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          <span className="text-xs text-muted-foreground font-medium mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Target:
          </span>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all shrink-0 ${
                selectedBrand === brand
                  ? "bg-red-500 text-white shadow-sm"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              {brand === "all" ? "All Targets" : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Threat List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            Intercepted Threat Feed ({filteredThreats.length})
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            Updated in Real Time
          </span>
        </div>

        {filteredThreats.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-3">
            <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto opacity-80" />
            <p className="text-sm font-semibold text-foreground">No matching threat records found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search query or brand filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredThreats.map((threat) => (
              <div
                key={threat.id}
                className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 hover:border-red-500/40 transition-all shadow-sm space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Shortened Slug Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted font-mono font-bold text-xs text-foreground border border-border">
                      <span>ul0.site/{threat.slug}</span>
                    </div>

                    {/* Threat Category Pill */}
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase">
                      {threat.threatCategory}
                    </span>

                    {/* Spoofed Brand */}
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
                      Target: {threat.spoofedBrand}
                    </span>
                  </div>

                  {/* Status & Date */}
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground self-end sm:self-auto">
                    <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-[11px]">
                      <Ban className="h-3 w-3" /> BLOCKED
                    </span>
                    <span>•</span>
                    <span>{threat.dateBlocked}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid sm:grid-cols-12 gap-4 items-center">
                  {/* Defanged malicious destination */}
                  <div className="sm:col-span-8 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3 w-3 text-red-400" /> Defanged Malicious Destination (No Backlink):
                      </span>
                      <button
                        onClick={() => copyDefanged(threat.id, threat.defangedUrl)}
                        className="text-[11px] font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                        title="Copy defanged string for threat intelligence"
                      >
                        {copiedId === threat.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copy Defanged
                          </>
                        )}
                      </button>
                    </div>

                    {/* Strictly unclickable code block to prevent any DR or backlinks */}
                    <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 font-mono text-xs text-red-400 break-all select-all">
                      <code>{threat.defangedUrl}</code>
                    </div>
                  </div>

                  {/* Threat Intelligence / Server info */}
                  <div className="sm:col-span-4 p-3 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">Threat Score</span>
                      <span className="font-mono font-bold text-red-500">{threat.threatScore}/100 [HIGH RISK]</span>
                    </div>

                    {threat.serverLocation && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">Location</span>
                        <span className="font-mono text-foreground">{threat.serverLocation}</span>
                      </div>
                    )}

                    {threat.isp && (
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">Hosting ISP</span>
                        <span className="font-mono text-foreground truncate max-w-[120px]" title={threat.isp}>
                          {threat.isp}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Safe Redirection row */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-t border-border/40">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-medium text-foreground">Safe Genuine Service:</span>
                    <a
                      href={threat.genuineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-mono inline-flex items-center gap-1 font-semibold"
                    >
                      {threat.genuineUrl}
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>

                  <Link
                    href={`/r/${threat.slug}`}
                    target="_blank"
                    className="text-[11px] font-mono text-muted-foreground hover:text-red-400 inline-flex items-center gap-1 transition-colors"
                  >
                    View Active Block Screen &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Architecture Callout */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          Our Anti-Phishing Commitment to the Internet
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Unlike ordinary URL shorteners that silently profit from scam traffic, ul0 uses real-time brand spoofing heuristics, high-risk TLD filters, and community takedowns to permanently intercept scam operations. When a phishing link is neutralized, redirection is revoked instantly, traffic is safely guided to genuine brand portals, and no search engine link equity (PageRank / DR) is ever provided to the bad actors.
        </p>
        <div className="flex flex-wrap gap-4 pt-1">
          <Link
            href="/security"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            Read our Security Architecture &rarr;
          </Link>
          <Link
            href="/report-abuse"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            Report an Abusive Link &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
