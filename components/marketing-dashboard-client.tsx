"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Link2,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  TrendingUp,
  Eye,
  Target,
  Percent,
  AlertCircle,
  Zap,
  MousePointerClick,
  Clock,
  Sparkles,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  X,
  Shuffle,
  ShieldCheck,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react"
import { toast } from "sonner"
import type { MarketingLinkDoc } from "@/lib/appwrite/marketing-links"
import type { BlogMeta } from "@/lib/blog-discovery"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Props {
  initialLinks: MarketingLinkDoc[]
  stats: {
    totalLinks: number
    activeLinks: number
    totalGateOpens: number
    totalCompletions: number
    completionRate: number
  }
  maxBlogCount: number
  totalBlogsAvailable: number
  availableBlogs?: BlogMeta[]
}

export function MarketingDashboardClient({
  initialLinks,
  stats,
  maxBlogCount,
  totalBlogsAvailable,
  availableBlogs = [],
}: Props) {
  const [links, setLinks] = useState<MarketingLinkDoc[]>(initialLinks)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MarketingLinkDoc | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "auto_skip" | "button">("all")

  // Form state
  const [destUrl, setDestUrl] = useState("")
  const [alias, setAlias] = useState("")
  const [linkType, setLinkType] = useState<"auto_skip" | "button">("auto_skip")
  const [timerSeconds, setTimerSeconds] = useState(5)
  const [blogSelectionMode, setBlogSelectionMode] = useState<"random" | "specific">("random")
  const [targetSlug, setTargetSlug] = useState(availableBlogs[0]?.slug || "")
  const [blogCount, setBlogCount] = useState(1)

  function openCreateModal(defaultType: "auto_skip" | "button" = "auto_skip") {
    setLinkType(defaultType)
    setTimerSeconds(5)
    setShowCreate(true)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch("/api/marketing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_url: destUrl.trim(),
          alias: alias.toLowerCase().trim(),
          link_type: linkType,
          timer_seconds: timerSeconds,
          target_slug: blogSelectionMode === "specific" ? targetSlug : "",
          blog_count: blogSelectionMode === "specific" ? 1 : blogCount,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to create link.")
        return
      }

      setLinks((prev) => [data.link, ...prev])
      toast.success(`Marketing link created: ul0.site/go/${data.link.alias}`)
      setDestUrl("")
      setAlias("")
      setTimerSeconds(5)
      setBlogCount(1)
      setShowCreate(false)
    } catch {
      toast.error("Network error while creating link.")
    } finally {
      setCreating(false)
    }
  }

  async function handleToggle(id: string, currentActive: boolean) {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/marketing/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentActive }),
      })

      if (res.ok) {
        setLinks((prev) =>
          prev.map((l) =>
            l.$id === id ? { ...l, is_active: !currentActive } : l
          )
        )
        toast.success(currentActive ? "Link paused" : "Link activated")
      } else {
        toast.error("Failed to update status")
      }
    } catch {
      toast.error("Network error toggling link status")
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.$id
    setDeletingId(id)
    try {
      const res = await fetch(`/api/marketing/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.$id !== id))
        toast.success(`Deleted ul0.site/go/${deleteTarget.alias}`)
        setDeleteTarget(null)
      } else {
        toast.error("Failed to delete link")
      }
    } catch {
      toast.error("Network error deleting link")
    } finally {
      setDeletingId(null)
    }
  }

  function copyUrl(linkAlias: string, id: string) {
    const full = `https://ul0.site/go/${linkAlias}`
    navigator.clipboard.writeText(full)
    setCopiedId(id)
    toast.success("Copied to clipboard", { description: full })
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filtered links
  const filteredLinks = useMemo(() => {
    return links.filter((l) => {
      const matchesSearch =
        !searchQuery ||
        l.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.destination_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.target_slug && l.target_slug.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && l.is_active) ||
        (statusFilter === "inactive" && !l.is_active)

      const matchesType =
        typeFilter === "all" || l.link_type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [links, searchQuery, statusFilter, typeFilter])

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="rounded-2xl border border-border bg-surface-2 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Monetization Engine Active
              </span>
              <span className="text-xs text-muted-foreground">
                {totalBlogsAvailable} Content Gate Articles Ready
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Automated Blog Content Gates & Ad Campaigns
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Route traffic through organic editorial articles with embedded Adsterra high-CPM monetized displays before auto-skipping or button unlocking.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => openCreateModal("auto_skip")}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-black" />
              <span>+ Auto-Skip Link (5s)</span>
            </button>

            <button
              type="button"
              onClick={() => openCreateModal("button")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 text-xs font-bold transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            >
              <MousePointerClick className="h-4 w-4" />
              <span>+ Button Unlock Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface-2 p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Links</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Link2 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
              {stats.totalLinks}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              <span className="text-emerald-500 font-semibold">{stats.activeLinks}</span> active · {stats.totalLinks - stats.activeLinks} paused
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Gate Impressions</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
              {stats.totalGateOpens.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Total times gates loaded
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Completions</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
              {stats.totalCompletions.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Target destinations reached
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Completion Rate</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                {stats.completionRate}%
              </div>
              <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">
                Healthy
              </span>
            </div>
            <div className="w-full bg-surface-3 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, stats.completionRate))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inline Creation Card / Drawer */}
      {showCreate && (
        <div className="rounded-2xl border border-primary/30 bg-surface-2 p-5 sm:p-7 shadow-lg space-y-6 relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex items-start justify-between border-b border-border pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-primary/10 text-primary">
                  {linkType === "auto_skip" ? (
                    <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                  ) : (
                    <MousePointerClick className="h-5 w-5 text-primary" />
                  )}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {linkType === "auto_skip"
                      ? "Create High-Speed Auto-Skip Gate (5s)"
                      : "Create Verification Button Unlock Gate"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {linkType === "auto_skip"
                      ? "Visitor lands on blog, sees countdown header bar, and is automatically forwarded after timer."
                      : "Visitor lands on blog and must click an interactive unlock button to proceed to destination."}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-surface-3 hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-5 max-w-3xl">
            {/* Step 1: Mode Toggle Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                1. Select Gate Transition Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLinkType("auto_skip")
                    setTimerSeconds(5)
                  }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    linkType === "auto_skip"
                      ? "border-amber-500 bg-amber-500/10 shadow-xs ring-1 ring-amber-500/30"
                      : "border-border hover:bg-surface-3"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      linkType === "auto_skip"
                        ? "bg-amber-500 text-black font-bold"
                        : "bg-surface-3 text-muted-foreground"
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span>⚡ Auto-Skip Mode</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-500 font-mono px-1.5 py-0.5 rounded font-bold">
                        Highest Volume
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Smooth non-intrusive progress bar. Readers automatically forward to destination.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLinkType("button")}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    linkType === "button"
                      ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/30"
                      : "border-border hover:bg-surface-3"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      linkType === "button"
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-surface-3 text-muted-foreground"
                    }`}
                  >
                    <MousePointerClick className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <span>🔘 Button Verification</span>
                      <span className="text-[10px] bg-primary/20 text-primary font-mono px-1.5 py-0.5 rounded font-bold">
                        High Engagement
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Requires manual user click on unlocked button after timer completes.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Destination URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                2. Target Destination URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={destUrl}
                  onChange={(e) => setDestUrl(e.target.value)}
                  placeholder="https://yourtargetsite.com/resource"
                  required
                  className="w-full rounded-xl border border-border bg-surface-1 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Where the visitor will land after completing the content gate.
              </p>
            </div>

            {/* Step 3: Custom Alias */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                3. Short Link Alias
              </label>
              <div className="flex items-center rounded-xl border border-border bg-surface-1 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden transition-colors">
                <span className="bg-surface-3 px-3 py-2.5 text-xs font-mono text-muted-foreground border-r border-border select-none whitespace-nowrap">
                  ul0.site/go/
                </span>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) =>
                    setAlias(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  placeholder="black-friday-offer"
                  required
                  minLength={2}
                  maxLength={50}
                  className="w-full bg-transparent px-3 py-2 text-sm text-foreground font-mono outline-none"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Final URL: <code className="text-primary font-mono font-semibold">ul0.site/go/{alias || "your-alias"}</code></span>
                <span>{alias.length}/50 chars</span>
              </div>
            </div>

            {/* Step 4: Blog Content Routing */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>4. Editorial Content Source</span>
                </label>
                <div className="flex items-center gap-1 bg-surface-3 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setBlogSelectionMode("specific")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      blogSelectionMode === "specific"
                        ? "bg-surface-1 text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Specific Article
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogSelectionMode("random")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      blogSelectionMode === "random"
                        ? "bg-surface-1 text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Random Pool
                  </button>
                </div>
              </div>

              {blogSelectionMode === "specific" ? (
                <div className="space-y-1.5">
                  <select
                    value={targetSlug}
                    onChange={(e) => setTargetSlug(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-1 px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
                  >
                    {availableBlogs.map((b) => (
                      <option key={b.slug} value={b.slug}>
                        [{b.category || "General"}] {b.title} ({b.slug})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span>Target Article:</span>
                    <code className="text-primary font-mono">/blog/{targetSlug}</code>
                    <a
                      href={`/blog/${targetSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline ml-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <select
                    value={blogCount}
                    onChange={(e) => setBlogCount(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-border bg-surface-1 px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
                  >
                    {Array.from(
                      { length: Math.min(maxBlogCount, totalBlogsAvailable) },
                      (_, i) => i + 1
                    ).map((n) => (
                      <option key={n} value={n}>
                        {n} random article{n > 1 ? "s" : ""}{" "}
                        {n === 1 ? "(Fastest redirect)" : n <= 3 ? "(Optimal ad revenue)" : "(Max ad impressions)"}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted-foreground">
                    Cycles visitors through our high-value pool of {totalBlogsAvailable} articles to maximize organic search authority and CPM rates.
                  </p>
                </div>
              )}
            </div>

            {/* Step 5: Timer Seconds */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>5. Countdown Duration</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {[3, 5, 7, 10, 15].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setTimerSeconds(sec)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      timerSeconds === sec
                        ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-xs"
                        : "border-border bg-surface-1 hover:bg-surface-3 text-muted-foreground"
                    }`}
                  >
                    {sec}s {sec === 5 ? "(Recommended)" : ""}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {linkType === "auto_skip"
                  ? `Visitor sees header progress bar countdown for ${timerSeconds} seconds before forwarding.`
                  : `Continue button unlocks after ${timerSeconds} seconds.`}
              </p>
            </div>

            {/* Submit & Cancel */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-xs sm:text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md cursor-pointer"
              >
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Create {linkType === "auto_skip" ? "Auto-Skip" : "Button"} Gate</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-medium text-muted-foreground hover:bg-surface-3 hover:text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links Search, Filters & Table */}
      <div className="rounded-2xl border border-border bg-surface-2 shadow-2xs overflow-hidden space-y-0">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by alias, destination, or blog slug..."
                className="w-full rounded-lg border border-border bg-surface-1 pl-9 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-lg border border-border bg-surface-1 px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Paused Only</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="rounded-lg border border-border bg-surface-1 px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Gate Types</option>
              <option value="auto_skip">⚡ Auto-Skip (5s)</option>
              <option value="button">🔘 Button Unlock</option>
            </select>

            <span className="text-xs text-muted-foreground pl-1">
              {filteredLinks.length} of {links.length}
            </span>
          </div>
        </div>

        {/* Empty state */}
        {filteredLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-surface-3 flex items-center justify-center text-muted-foreground">
              <Link2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">No marketing links found</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search query or filter toggles."
                  : "Create your first high-CPM marketing link to monetize reader traffic."}
              </p>
            </div>
            {!showCreate && (
              <button
                type="button"
                onClick={() => openCreateModal("auto_skip")}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Marketing Link</span>
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-3/50 text-muted-foreground border-b border-border uppercase tracking-wider font-semibold text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Marketing Alias &amp; Short URL</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Destination</th>
                    <th className="px-4 py-3">Editorial Route</th>
                    <th className="px-4 py-3 text-right">Telemetry</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLinks.map((link) => (
                    <tr
                      key={link.$id}
                      className="hover:bg-surface-3/40 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary text-xs">
                            ul0.site/go/{link.alias}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyUrl(link.alias, link.$id)}
                            className="p-1 rounded hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Copy link"
                          >
                            {copiedId === link.$id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <a
                            href={`https://ul0.site/go/${link.alias}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded hover:bg-surface-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            title="Test open link"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {link.link_type === "auto_skip" ? (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Zap className="h-3 w-3 fill-amber-500" />
                            Auto-Skip ({link.timer_seconds || 5}s)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <MousePointerClick className="h-3 w-3" />
                            Button ({link.timer_seconds || 5}s)
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 max-w-[220px]">
                        <span className="truncate block text-muted-foreground text-[11px]" title={link.destination_url}>
                          {link.destination_url}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {link.target_slug ? (
                          <Link
                            href={`/blog/${link.target_slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-[11px]"
                          >
                            <BookOpen className="h-3 w-3" />
                            <span>/blog/{link.target_slug}</span>
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground text-[11px]">
                            <Shuffle className="h-3 w-3" />
                            <span>{link.blog_count || 1} random article{(link.blog_count || 1) > 1 ? "s" : ""}</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="font-mono text-xs font-semibold text-foreground">
                            {(link.total_gate_opens || 0).toLocaleString()} opens
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {(link.total_completions || 0).toLocaleString()} finished (
                            <span className="text-emerald-500 font-semibold">
                              {link.total_gate_opens
                                ? Math.round(((link.total_completions || 0) / link.total_gate_opens) * 100)
                                : 0}
                              %
                            </span>
                            )
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggle(link.$id, link.is_active)}
                          disabled={togglingId === link.$id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                            link.is_active
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-surface-3 text-muted-foreground border border-border hover:bg-surface-3/80"
                          }`}
                        >
                          {togglingId === link.$id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                link.is_active ? "bg-emerald-500" : "bg-muted-foreground"
                              }`}
                            />
                          )}
                          <span>{link.is_active ? "Active" : "Paused"}</span>
                        </button>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(link)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Responsive Cards View */}
            <div className="lg:hidden divide-y divide-border">
              {filteredLinks.map((link) => (
                <div key={link.$id} className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-primary text-sm">
                          ul0.site/go/{link.alias}
                        </span>
                        {link.link_type === "auto_skip" ? (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Zap className="h-3 w-3 fill-amber-500" />
                            Auto-Skip ({link.timer_seconds || 5}s)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <MousePointerClick className="h-3 w-3" />
                            Button ({link.timer_seconds || 5}s)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate" title={link.destination_url}>
                        → {link.destination_url}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(link.$id, link.is_active)}
                      disabled={togglingId === link.$id}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                        link.is_active
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-surface-3 text-muted-foreground border border-border"
                      }`}
                    >
                      {togglingId === link.$id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            link.is_active ? "bg-emerald-500" : "bg-muted-foreground"
                          }`}
                        />
                      )}
                      <span>{link.is_active ? "Active" : "Paused"}</span>
                    </button>
                  </div>

                  {/* Telemetry row */}
                  <div className="flex items-center justify-between text-xs bg-surface-1 p-2.5 rounded-xl border border-border">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Opens</span>
                      <span className="font-mono font-bold text-foreground">
                        {(link.total_gate_opens || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Completions</span>
                      <span className="font-mono font-bold text-foreground">
                        {(link.total_completions || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Rate</span>
                      <span className="font-mono font-bold text-emerald-500">
                        {link.total_gate_opens
                          ? Math.round(((link.total_completions || 0) / link.total_gate_opens) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-muted-foreground">
                      {link.target_slug ? (
                        <span className="font-mono text-primary">/blog/{link.target_slug}</span>
                      ) : (
                        <span>{link.blog_count || 1} random articles</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => copyUrl(link.alias, link.$id)}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-surface-3 hover:text-foreground cursor-pointer"
                        title="Copy"
                      >
                        {copiedId === link.$id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <a
                        href={`https://ul0.site/go/${link.alias}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-surface-3 hover:text-foreground cursor-pointer"
                        title="Open"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(link)}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-red-500 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                <span>Confirm Marketing Link Deletion</span>
              </DialogTitle>
              <DialogDescription className="text-xs leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <span className="font-mono font-bold text-foreground">
                  ul0.site/go/{deleteTarget.alias}
                </span>
                ? Any traffic hitting this marketing gate will immediately fail.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === deleteTarget.$id}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {deletingId === deleteTarget.$id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
