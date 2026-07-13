"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Plus, Loader2, Link2, AlertCircle, CheckCircle2 } from "lucide-react"

interface DomainDoc {
  $id: string
  domain: string
  status: "unverified" | "verified" | "failed"
}

interface CreateLinkButtonProps {
  verifiedDomains: DomainDoc[]
}

export function CreateLinkButton({ verifiedDomains }: CreateLinkButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [selectedDomainId, setSelectedDomainId] = useState<string>("ul0.site")
  const [longUrl, setLongUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!longUrl.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      let res
      if (selectedDomainId === "ul0.site") {
        // Create on main site
        res = await fetch("/api/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            longUrl: longUrl.trim(),
            customSlug: customSlug.trim() || undefined,
          }),
        })
      } else {
        // Create on custom domain
        res = await fetch("/api/domains/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            domainId: selectedDomainId,
            longUrl: longUrl.trim(),
            customSlug: customSlug.trim() || undefined,
          }),
        })
      }

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create short link")
        return
      }

      // Link created successfully!
      const shortUrl =
        selectedDomainId === "ul0.site"
          ? `https://ul0.site/r/${data.slug}`
          : data.shortUrl

      setSuccess(shortUrl)
      setLongUrl("")
      setCustomSlug("")
      
      // Refresh dashboard links list
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) {
        setError(null)
        setSuccess(null)
      }
    }}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Create Link
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Short Link</DialogTitle>
          <DialogDescription>
            Shorten a URL on the default platform or one of your custom domains.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-green-500/10 p-4 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold text-green-600">Link Created Successfully!</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Your short link is ready to use:
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 rounded bg-background px-3 py-2 text-sm font-mono border border-border">
                <span className="truncate max-w-[280px]">{success}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccess(null)
              }}
              className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Create another link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Domain Select */}
            <div className="space-y-1.5">
              <label htmlFor="domain" className="text-xs font-semibold text-muted-foreground">
                Short Domain
              </label>
              <select
                id="domain"
                value={selectedDomainId}
                onChange={(e) => setSelectedDomainId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="ul0.site">ul0.site (Default)</option>
                {verifiedDomains.map((d) => (
                  <option key={d.$id} value={d.$id}>
                    {d.domain}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination URL */}
            <div className="space-y-1.5">
              <label htmlFor="longUrl" className="text-xs font-semibold text-muted-foreground">
                Destination URL
              </label>
              <input
                id="longUrl"
                type="url"
                required
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very/long/path/to/page"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Custom Slug */}
            <div className="space-y-1.5">
              <label htmlFor="customSlug" className="text-xs font-semibold text-muted-foreground flex justify-between">
                <span>Custom Slug</span>
                <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <div className="flex rounded-lg border border-border bg-muted/30 overflow-hidden items-center px-3">
                <span className="text-sm text-muted-foreground select-none font-mono">
                  {selectedDomainId === "ul0.site"
                    ? "ul0.site/r/"
                    : `${verifiedDomains.find((d) => d.$id === selectedDomainId)?.domain}/r/`}
                </span>
                <input
                  id="customSlug"
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="promo-2026"
                  className="flex-1 bg-transparent py-2 pl-0.5 text-sm focus:outline-none font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-2 text-xs text-destructive flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !longUrl.trim()}
              className="w-full inline-flex justify-center items-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Short Link"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
