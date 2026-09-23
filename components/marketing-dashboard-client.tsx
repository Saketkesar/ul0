"use client"

import { useState } from "react"
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
} from "lucide-react"
import type { MarketingLinkDoc } from "@/lib/appwrite/marketing-links"

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
}

export function MarketingDashboardClient({
  initialLinks,
  stats,
  maxBlogCount,
  totalBlogsAvailable,
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
  const [blogCount, setBlogCount] = useState(3)

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
          blog_count: blogCount,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create link.")
        return
      }

      setLinks((prev) => [data.link, ...prev])
      setSuccess(`Link created: ${data.public_url}`)
      setDestUrl("")
      setAlias("")
      setBlogCount(3)
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Marketing Links</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create ad-supported marketing links that guide visitors through blog content before reaching the destination.
        </p>
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
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          <Check className="h-4 w-4 shrink-0" />
          {success}
          <button
            onClick={() => setSuccess("")}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Create Section */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">Your Links</h2>
          <button
            onClick={() => {
              setShowCreate(!showCreate)
              setError("")
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Link
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="border-b border-border px-6 py-6">
            <form onSubmit={handleCreate} className="space-y-4 max-w-xl">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Destination URL
                </label>
                <input
                  type="url"
                  value={destUrl}
                  onChange={(e) => setDestUrl(e.target.value)}
                  placeholder="https://example.com/product"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Custom Alias
                </label>
                <div className="flex items-center gap-0">
                  <span className="rounded-l-lg border border-r-0 border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground whitespace-nowrap">
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
                    placeholder="summer-sale"
                    required
                    minLength={2}
                    maxLength={50}
                    className="w-full rounded-r-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, and hyphens only.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Blog Pages
                </label>
                <select
                  value={blogCount}
                  onChange={(e) => setBlogCount(parseInt(e.target.value, 10))}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                >
                  {Array.from(
                    { length: Math.min(maxBlogCount, totalBlogsAvailable) },
                    (_, i) => i + 1
                  ).map((n) => (
                    <option key={n} value={n}>
                      {n} article{n > 1 ? "s" : ""}{" "}
                      {n <= 3 ? "(recommended)" : n >= 7 ? "(may reduce completion)" : ""}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Visitors must read each article for 15 seconds before continuing.
                  {totalBlogsAvailable < maxBlogCount &&
                    ` ${totalBlogsAvailable} articles available.`}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Create Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Links Table */}
        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Link2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No marketing links yet</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Create your first marketing link to start driving ad-supported traffic through your blog content.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {links.map((link) => (
              <div
                key={link.$id}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-primary truncate">
                      ul0.site/go/{link.alias}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        link.is_active
                          ? "bg-green-500/10 text-green-600"
                          : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {link.is_active ? "Active" : "Disabled"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600">
                      {link.blog_count} article{link.blog_count > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground truncate">
                    → {link.destination_url}
                  </p>
                  <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{link.total_gate_opens || 0} opens</span>
                    <span>{link.total_completions || 0} completions</span>
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
                    className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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
                    className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title="Open link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(link.$id, link.is_active)}
                    disabled={toggling === link.$id}
                    className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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
                        className="rounded-md px-2 py-1 text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        {deleting === link.$id ? "…" : "Delete"}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(link.$id)}
                      className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete"
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
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2.5 ${bgClass}`}>{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}
