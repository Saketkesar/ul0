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

  // Advanced settings states
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [password, setPassword] = useState("")
  const [clicksLimit, setClicksLimit] = useState<number | "">("")
  const [oneTime, setOneTime] = useState(false)
  const [expireAt, setExpireAt] = useState("")
  
  // UTM builder states
  const [utmSource, setUtmSource] = useState("")
  const [utmMedium, setUtmMedium] = useState("")
  const [utmCampaign, setUtmCampaign] = useState("")

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!longUrl.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    // Build targeting JSON
    const targeting: Record<string, any> = {}
    if (password.trim()) targeting.password = password.trim()
    if (clicksLimit) targeting.clicks_limit = Number(clicksLimit)
    if (oneTime) targeting.one_time = true
    if (expireAt) targeting.expire_at = new Date(expireAt).toISOString()

    // Append UTM tags to destination URL
    let finalUrl = longUrl.trim()
    try {
      if (utmSource || utmMedium || utmCampaign) {
        const urlObj = new URL(finalUrl)
        if (utmSource) urlObj.searchParams.set("utm_source", utmSource)
        if (utmMedium) urlObj.searchParams.set("utm_medium", utmMedium)
        if (utmCampaign) urlObj.searchParams.set("utm_campaign", utmCampaign)
        finalUrl = urlObj.href
      }
    } catch {
      // Fallback to raw URL
    }

    try {
      let res
      const bodyPayload = {
        longUrl: finalUrl,
        customSlug: customSlug.trim() || undefined,
        targeting_json: Object.keys(targeting).length > 0 ? JSON.stringify(targeting) : undefined,
      }

      if (selectedDomainId === "ul0.site") {
        // Create on main site
        res = await fetch("/api/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyPayload),
        })
      } else {
        // Create on custom domain
        res = await fetch("/api/domains/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...bodyPayload,
            domainId: selectedDomainId,
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
      setPassword("")
      setClicksLimit("")
      setOneTime(false)
      setExpireAt("")
      setUtmSource("")
      setUtmMedium("")
      setUtmCampaign("")
      setShowAdvanced(false)
      
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
      <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto pr-2">
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

            {/* Advanced Settings Toggle */}
            <div className="border-t pt-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-gray-950 transition-colors"
              >
                <span>{showAdvanced ? "Hide" : "Show"} Advanced Targeting Options</span>
              </button>
            </div>

            {showAdvanced && (
              <div className="space-y-3.5 border-l-2 border-primary/20 pl-3.5 pt-1 animate-in slide-in-from-left duration-250">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Password Protect</label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Access password..."
                      className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Clicks Limit</label>
                    <input
                      type="number"
                      value={clicksLimit}
                      onChange={(e) => setClicksLimit(e.target.value ? Number(e.target.value) : "")}
                      placeholder="Max clicks..."
                      className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Expiry Date</label>
                    <input
                      type="datetime-local"
                      value={expireAt}
                      onChange={(e) => setExpireAt(e.target.value)}
                      className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="createOneTime"
                      checked={oneTime}
                      onChange={(e) => setOneTime(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="createOneTime" className="text-[11px] font-semibold text-gray-600 cursor-pointer">
                      One-time redirect
                    </label>
                  </div>
                </div>

                {/* Campaign tags */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">UTM Parameters Builder</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder="utm_source (e.g. google)"
                      value={utmSource}
                      onChange={(e) => setUtmSource(e.target.value)}
                      className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="utm_medium (e.g. social)"
                      value={utmMedium}
                      onChange={(e) => setUtmMedium(e.target.value)}
                      className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="utm_campaign (e.g. winter)"
                      value={utmCampaign}
                      onChange={(e) => setUtmCampaign(e.target.value)}
                      className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

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
