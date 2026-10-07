"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Link2,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  ToggleLeft,
  ToggleRight,
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
} from "lucide-react"
import type { MarketingLinkDoc } from "@/lib/appwrite/marketing-links"
import type { BlogMeta } from "@/lib/blog-discovery"

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
  const [links, setLinks] = useState(initialLinks)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

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
    setError("")
    setSuccess("")
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/marketing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_url: destUrl,
          alias: alias.toLowerCase().trim(),
          link_type: linkType,
          timer_seconds: timerSeconds,
          target_slug: blogSelectionMode === "specific" ? targetSlug : "",
          blog_count: blogSelectionMode === "specific" ? 1 : blogCount,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create link.")
        return
      }

      setLinks((prev) => [data.link, ...prev])
      setSuccess(`Link created successfully: ${data.public_url}`)
      setDestUrl("")
      setAlias("")
      setTimerSeconds(5)
      setBlogCount(1)
      setShowCreate(false)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  async function handleToggle(id: string, currentActive: boolean) {
    setToggling(id)
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
      }
    } catch {
      // Silently fail
    } finally {
      setToggling(null)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/marketing/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.$id !== id))
        setDeleteConfirm(null)
      }
    } catch {
      // Silently fail
    } finally {
      setDeleting(null)
    }
  }

  function copyUrl(alias: string, id: string) {
    navigator.clipboard.writeText(`https://ul0.site/go/${alias}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header with Quick Create Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketing Links</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create ad-supported marketing links with automatic 5s skipping or button unlock through real blog content.
          </p>
        </div>

        {/* Separate Buttons for Auto-Skip vs Button Link */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => openCreateModal("auto_skip")}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02]"
          >
            <Zap className="h-4 w-4 fill-black" />
            <span>+ Auto-Skip Link (5s)</span>
          </button>

          <button
            onClick={() => openCreateModal("button")}
            className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
          >
            <MousePointerClick className="h-4 w-4" />
            <span>+ Button Link</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Link2 className="h-5 w-5 text-blue-500" />}
          label="Total Links"
          value={stats.totalLinks}
          bgClass="bg-blue-500/10"
        />
        <StatCard
          icon={<Eye className="h-5 w-5 text-green-500" />}
          label="Gate Opens"
          value={stats.totalGateOpens}
          bgClass="bg-green-500/10"
        />
        <StatCard
          icon={<Target className="h-5 w-5 text-purple-500" />}
          label="Completions"
          value={stats.totalCompletions}
          bgClass="bg-purple-500/10"
        />
        <StatCard
          icon={<Percent className="h-5 w-5 text-amber-500" />}
          label="Completion Rate"
          value={`${stats.completionRate}%`}
          bgClass="bg-amber-500/10"
        />
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
          <Check className="h-4 w-4 shrink-0" />
          <span>{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="ml-auto text-green-500 hover:text-green-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Creation Modal / Inline Drawer */}
      {showCreate && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                {linkType === "auto_skip" ? <Zap className="h-5 w-5 text-amber-500" /> : <MousePointerClick className="h-5 w-5" />}
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {linkType === "auto_skip" ? "Create 5s Auto-Skip Link" : "Create Button Verification Link"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {linkType === "auto_skip"
                    ? "Visitors automatically advance to destination after 5 seconds"
                    : "Visitors click Continue to unlock after reading the blog article"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreate(false)}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-5 max-w-2xl">
            {/* Link Type Selector Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Redirect Action Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLinkType("auto_skip")
                    setTimerSeconds(5)
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    linkType === "auto_skip"
                      ? "border-amber-500/60 bg-amber-500/10 shadow-sm"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${linkType === "auto_skip" ? "bg-amber-500 text-black" : "bg-muted text-muted-foreground"}`}>
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <span>⚡ Auto-Skip Link</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-500 font-mono px-1.5 py-0.5 rounded font-bold">5s</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Skips automatically with timer header</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLinkType("button")
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    linkType === "button"
                      ? "border-primary/60 bg-primary/10 shadow-sm"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${linkType === "button" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <MousePointerClick className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">🔘 Button Link</div>
                    <div className="text-xs text-muted-foreground">User clicks "Continue" when timer finishes</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Destination URL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Destination URL
              </label>
              <input
                type="url"
                value={destUrl}
                onChange={(e) => setDestUrl(e.target.value)}
                placeholder="https://example.com/target-page"
                required
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            {/* Custom Alias */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Short Alias
              </label>
              <div className="flex items-center gap-0">
                <span className="rounded-l-xl border border-r-0 border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground whitespace-nowrap">
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
                  placeholder="special-offer"
                  required
                  minLength={2}
                  maxLength={50}
                  className="w-full rounded-r-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Final URL: ul0.site/go/{alias || "your-alias"}
              </p>
            </div>

            {/* Blog Selection Method */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Choose Blog Content ({availableBlogs.length} articles available)</span>
                </label>
                <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setBlogSelectionMode("specific")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      blogSelectionMode === "specific"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Specific Article (by Slug)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogSelectionMode("random")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      blogSelectionMode === "random"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Random Sequence
                  </button>
                </div>
              </div>

              {blogSelectionMode === "specific" ? (
                <div className="space-y-1.5">
                  <select
                    value={targetSlug}
                    onChange={(e) => setTargetSlug(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    {availableBlogs.map((b) => (
                      <option key={b.slug} value={b.slug}>
                        [{b.category}] {b.title} ({b.slug})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span>Will load article:</span>
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
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    {Array.from(
                      { length: Math.min(maxBlogCount, totalBlogsAvailable) },
                      (_, i) => i + 1
                    ).map((n) => (
                      <option key={n} value={n}>
                        {n} random article{n > 1 ? "s" : ""}{" "}
                        {n === 1 ? "(fastest)" : n <= 3 ? "(recommended)" : "(higher ad views)"}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted-foreground">
                    Cycles visitors randomly through our pool of {totalBlogsAvailable} high-value articles.
                  </p>
                </div>
              )}
            </div>

            {/* Timer Duration */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Timer Duration</span>
              </label>
              <div className="flex items-center gap-2">
                {[3, 5, 7, 10, 15].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setTimerSeconds(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      timerSeconds === sec
                        ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-border hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {sec}s {sec === 5 ? "(Recommended)" : ""}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {linkType === "auto_skip"
                  ? `Visitor will see live countdown in header and automatically redirect after ${timerSeconds} seconds.`
                  : `Visitor must wait ${timerSeconds} seconds before Continue button unlocks.`}
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md"
              >
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Create {linkType === "auto_skip" ? "Auto-Skip" : "Button"} Link</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>Your Marketing Links</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {links.length}
            </span>
          </h2>
          {!showCreate && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openCreateModal("auto_skip")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>+ Auto-Skip</span>
              </button>
              <button
                onClick={() => openCreateModal("button")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Button</span>
              </button>
            </div>
          )}
        </div>

        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Link2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No marketing links yet</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Create an Auto-Skip (5s) or Button link to drive traffic through your blog articles with live Adsterra monetization.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => openCreateModal("auto_skip")}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-all shadow-md"
              >
                Create Auto-Skip Link (5s)
              </button>
              <button
                onClick={() => openCreateModal("button")}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all"
              >
                Create Button Link
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {links.map((link) => (
              <div
                key={link.$id}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-primary truncate">
                      ul0.site/go/{link.alias}
                    </span>

                    {/* Link Type Badge */}
                    {link.link_type === "auto_skip" ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <Zap className="h-3 w-3" />
                        Auto-Skip ({link.timer_seconds || 5}s)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <MousePointerClick className="h-3 w-3" />
                        Button ({link.timer_seconds || 5}s)
                      </span>
                    )}

                    {/* Active/Disabled Badge */}
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        link.is_active
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {link.is_active ? "Active" : "Disabled"}
                    </span>
                  </div>

                  {/* Destination & Target Slug */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="truncate max-w-md">
                      → {link.destination_url}
                    </span>
                    {link.target_slug ? (
                      <Link
                        href={`/blog/${link.target_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-mono"
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>/blog/{link.target_slug}</span>
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">
                        {link.blog_count} random article{link.blog_count > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Telemetry */}
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span>{link.total_gate_opens || 0} opens</span>
                    <span>{link.total_completions || 0} completions</span>
                    {link.total_gate_opens ? (
                      <span className="text-emerald-500 font-semibold">
                        {Math.round(((link.total_completions || 0) / link.total_gate_opens) * 100)}% completion
                      </span>
                    ) : null}
                    {link.created_at && (
                      <span>
                        {new Date(link.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Copy */}
                  <button
                    onClick={() => copyUrl(link.alias, link.$id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === link.$id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>

                  {/* Open */}
                  <a
                    href={`/go/${link.alias}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title="Open link in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(link.$id, link.is_active)}
                    disabled={toggling === link.$id}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title={link.is_active ? "Disable" : "Enable"}
                  >
                    {toggling === link.$id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : link.is_active ? (
                      <ToggleRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </button>

                  {/* Delete */}
                  {deleteConfirm === link.$id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(link.$id)}
                        disabled={deleting === link.$id}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        {deleting === link.$id ? "…" : "Delete"}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(link.$id)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  bgClass,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  bgClass: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2.5 ${bgClass}`}>{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}
