"use client"

import React, { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  BarChart3,
  Sliders,
  MoreVertical,
  Lock,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  Plus,
  X,
  FileSpreadsheet,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { PlanSlug, PlanLimits } from "@/lib/plans"
import QRCodeLib from "qrcode"
import { getShortUrl, getShortDisplayPrefix } from "@/lib/utils/link-url"

interface LinkItem {
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

interface LinksClientProps {
  initialLinks: LinkItem[]
  total: number
  plan: {
    slug: PlanSlug
    limits: PlanLimits
    label: string
  }
  verifiedDomains: Array<{ domain: string }>
}

export function LinksClient({
  initialLinks,
  total,
  plan,
  verifiedDomains,
}: LinksClientProps) {
  const router = useRouter()
  const [links, setLinks] = useState<LinkItem[]>(initialLinks)
  const [search, setSearch] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "clicks">("newest")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [qrModalLink, setQrModalLink] = useState<LinkItem | null>(null)
  const [qrModalDataUrl, setQrModalDataUrl] = useState("")
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Generate QR code on demand
  useEffect(() => {
    if (qrModalLink) {
      QRCodeLib.toDataURL(getShortUrl(qrModalLink.host, qrModalLink.slug), {
        width: 240,
        margin: 2,
      })
        .then(setQrModalDataUrl)
        .catch(() => {})
    } else {
      setQrModalDataUrl("")
    }
  }, [qrModalLink])

  // Filter and sort links
  const filteredLinks = useMemo(() => {
    let result = [...links]

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(
        (l) =>
          l.slug.toLowerCase().includes(q) ||
          l.long_url.toLowerCase().includes(q) ||
          l.host.toLowerCase().includes(q) ||
          (l.meta_title && l.meta_title.toLowerCase().includes(q))
      )
    }

    // Domain filter
    if (selectedDomain !== "all") {
      result = result.filter((l) => l.host === selectedDomain)
    }

    // Status filter
    const now = new Date().toISOString()
    if (selectedStatus === "active") {
      result = result.filter((l) => !l.expire_at || l.expire_at > now)
    } else if (selectedStatus === "expired") {
      result = result.filter((l) => Boolean(l.expire_at && l.expire_at <= now))
    } else if (selectedStatus === "password") {
      result = result.filter((l) => {
        try {
          const t = l.targeting_json ? JSON.parse(l.targeting_json) : null
          return Boolean(t?.password)
        } catch {
          return false
        }
      })
    } else if (selectedStatus === "ab") {
      result = result.filter((l) => {
        try {
          const t = l.targeting_json ? JSON.parse(l.targeting_json) : null
          return Boolean(t?.ab_rules?.length)
        } catch {
          return false
        }
      })
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "clicks") {
        return (b.clicks_count || 0) - (a.clicks_count || 0)
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      }
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    })

    return result
  }, [links, search, selectedDomain, selectedStatus, sortBy])

  // Copy handler
  const handleCopy = (shortUrl: string, id: string) => {
    navigator.clipboard.writeText(shortUrl)
    setCopiedId(id)
    toast.success("Short URL copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Delete handler
  const handleDeleteLink = async (id: string) => {
    if (!plan.limits.canDeleteDomainLinks && plan.slug === "free_user") {
      toast.error("Link deletion is a Pro feature", {
        description: "Upgrade to Pro to delete links and clean up unused slugs.",
      })
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" })
      if (!res.ok) {
        throw new Error("Failed to delete link")
      }
      setLinks((prev) => prev.filter((l) => l.$id !== id))
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      toast.success("Link deleted successfully")
      setDeletePendingId(null)
    } catch {
      toast.error("Error deleting link")
    } finally {
      setIsDeleting(false)
    }
  }

  // Export CSV handler
  const handleExportCsv = () => {
    if (plan.slug === "free_user") {
      toast.error("CSV Export is a Pro feature", {
        description: "Upgrade to Pro to export your full link library and analytics.",
      })
      return
    }

    const headers = ["Slug", "Host", "Short URL", "Destination URL", "Clicks", "Created At", "Expires At"]
    const rows = filteredLinks.map((l) => [
      l.slug,
      l.host,
      getShortUrl(l.host, l.slug),
      `"${l.long_url.replace(/"/g, '""')}"`,
      l.clicks_count || 0,
      l.created_at || "",
      l.expire_at || "",
    ])

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ul0-links-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("CSV export downloaded")
  }

  // Select all toggle
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLinks.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredLinks.map((l) => l.$id)))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Get link status chip
  const renderStatusChips = (link: LinkItem) => {
    const chips = []
    const now = new Date().toISOString()
    const isExpired = Boolean(link.expire_at && link.expire_at <= now)

    if (isExpired) {
      chips.push(
        <span key="expired" className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-500 border border-red-500/20">
          Expired
        </span>
      )
    } else {
      chips.push(
        <span key="active" className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          Active
        </span>
      )
    }

    if (link.targeting_json) {
      try {
        const t = JSON.parse(link.targeting_json)
        if (t.password) {
          chips.push(
            <span key="pw" className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-0.5">
              <Lock className="h-2.5 w-2.5" /> PW
            </span>
          )
        }
        if (t.ab_rules?.length) {
          chips.push(
            <span key="ab" className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center gap-0.5">
              <Layers className="h-2.5 w-2.5" /> A/B
            </span>
          )
        }
      } catch {}
    }

    return chips
  }

  return (
    <div className="space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Links
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage, filter, and track all your active and expired short links.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface-2 text-xs font-medium text-foreground hover:bg-surface-3 transition-colors shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-xl border border-border bg-surface-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search slug, destination, title..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-surface-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Domain Filter */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            aria-label="Filter by domain"
            className="px-2.5 py-1.5 rounded-lg border border-border bg-surface-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Domains</option>
            <option value="ul0.site">ul0.site</option>
            {verifiedDomains.map((d) => (
              <option key={d.domain} value={d.domain}>
                {d.domain}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by status"
            className="px-2.5 py-1.5 rounded-lg border border-border bg-surface-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="expired">Expired Only</option>
            <option value="password">Password Protected</option>
            <option value="ab">A/B Testing</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort links"
            className="px-2.5 py-1.5 rounded-lg border border-border bg-surface-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="clicks">Most Clicks</option>
          </select>
        </div>
      </div>

      {/* Links Table (Desktop) & Cards (Mobile) */}
      {filteredLinks.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface-1 p-12 text-center space-y-3">
          <div className="mx-auto h-10 w-10 rounded-xl bg-surface-2 flex items-center justify-center text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No matching links found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or create a new short link.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface-1 overflow-hidden shadow-2xs">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredLinks.length && filteredLinks.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Select all links"
                      className="rounded border-border"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-foreground">Short Link</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Destination</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-right">Clicks</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Created</th>
                  <th className="py-3 px-4 text-right font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLinks.map((link) => {
                  const shortUrl = getShortUrl(link.host, link.slug)
                  const isSelected = selectedIds.has(link.$id)

                  return (
                    <tr
                      key={link.$id}
                      className={`hover:bg-surface-2/60 transition-colors ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(link.$id)}
                          aria-label={`Select link ${link.slug}`}
                          className="rounded border-border"
                        />
                      </td>

                      {/* Short Link */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 group">
                          <Link
                            href={`/dashboard/links/${link.$id}`}
                            className="font-mono text-xs hover:underline flex items-center"
                          >
                            <span className="text-muted-foreground">{getShortDisplayPrefix(link.host)}</span>
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                              {link.slug}
                            </span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleCopy(shortUrl, link.$id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-all"
                            title="Copy link"
                          >
                            {copiedId === link.$id ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Destination URL */}
                      <td className="py-3 px-4 max-w-xs truncate">
                        <span className="text-muted-foreground" title={link.long_url}>
                          {link.meta_title ? link.meta_title : link.long_url}
                        </span>
                      </td>

                      {/* Clicks */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                        {link.clicks_count?.toLocaleString() || 0}
                      </td>

                      {/* Status chips */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {renderStatusChips(link)}
                        </div>
                      </td>

                      {/* Created date */}
                      <td className="py-3 px-4 text-muted-foreground font-mono">
                        {link.created_at
                          ? new Date(link.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Row Action Menu */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setQrModalLink(link)}
                            className="p-1.5 rounded-md hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                            title="View QR Code"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                          </button>

                          <Link
                            href={`/dashboard/links/${link.$id}`}
                            className="p-1.5 rounded-md hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                            title="View Analytics"
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                          </Link>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                aria-label="Open link options"
                                className="p-1.5 rounded-md hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => window.open(shortUrl, "_blank")}
                                className="gap-2 text-xs"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Open destination</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCopy(shortUrl, link.$id)}
                                className="gap-2 text-xs"
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy link</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/links/${link.$id}?tab=targeting`}
                                  className="gap-2 text-xs flex items-center"
                                >
                                  <Sliders className="h-3.5 w-3.5" />
                                  <span>Edit rules &amp; targeting</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setDeletePendingId(link.$id)}
                                className="gap-2 text-xs text-red-500 focus:text-red-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete link</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-border">
            {filteredLinks.map((link) => {
              const shortUrl = getShortUrl(link.host, link.slug)
              return (
                <div key={link.$id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/dashboard/links/${link.$id}`}
                        className="font-mono text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center"
                      >
                        <span className="text-muted-foreground font-normal">{getShortDisplayPrefix(link.host)}</span>
                        <span>{link.slug}</span>
                      </Link>
                      <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">
                        {link.long_url}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-xs bg-surface-2 px-2 py-1 rounded">
                      {link.clicks_count || 0} clicks
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      {renderStatusChips(link)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(shortUrl, link.$id)}
                        className="p-1.5 rounded hover:bg-surface-2 text-muted-foreground"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrModalLink(link)}
                        className="p-1.5 rounded hover:bg-surface-2 text-muted-foreground"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/dashboard/links/${link.$id}`}
                        className="p-1.5 rounded hover:bg-surface-2 text-muted-foreground"
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* QR Code Quick View Dialog */}
      {qrModalLink && (
        <Dialog open={Boolean(qrModalLink)} onOpenChange={() => setQrModalLink(null)}>
          <DialogContent className="sm:max-w-md text-center">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                QR Code for {getShortDisplayPrefix(qrModalLink.host)}{qrModalLink.slug}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Scan with any smartphone camera to test the link.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 flex flex-col items-center justify-center">
              <div className="p-4 bg-white rounded-2xl shadow-md border border-border flex items-center justify-center min-w-[200px] min-h-[200px]">
                {qrModalDataUrl ? (
                  <img
                    src={qrModalDataUrl}
                    alt={`QR code for ${qrModalLink.slug}`}
                    className="w-48 h-48 rounded"
                  />
                ) : (
                  <div className="w-48 h-48 rounded bg-muted/30 animate-pulse" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Link
                href={`/dashboard/links/${qrModalLink.$id}?tab=qr`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-all"
              >
                <span>Customize in Studio</span>
                <Sparkles className="h-3.5 w-3.5" />
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deletePendingId && (
        <Dialog open={Boolean(deletePendingId)} onOpenChange={() => setDeletePendingId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-red-500 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Delete Link</span>
              </DialogTitle>
              <DialogDescription className="text-xs leading-relaxed">
                Are you sure you want to delete this short link? Any QR codes, social shares, or printed media pointing to this URL will immediately return a 404 error. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-2.5 pt-4">
              <button
                type="button"
                onClick={() => setDeletePendingId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteLink(deletePendingId)}
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
