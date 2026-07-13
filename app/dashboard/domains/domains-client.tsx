"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Globe,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  RefreshCw,
  Shield,
  Copy,
  ArrowLeft,
} from "lucide-react"

interface DomainDoc {
  $id: string
  domain: string
  status: "unverified" | "verified" | "failed"
  verification_token: string | null
  ssl_status: "pending" | "active" | "failed"
  created_at: string | null
  brand_logo_url?: string | null
}

interface VerificationInfo {
  type: string
  domain: string
  value: string
  reason: string
}

interface DomainsClientProps {
  initialDomains: DomainDoc[]
  maxDomains: number
  currentPlan: string
}

export function DomainsClient({
  initialDomains,
  maxDomains,
  currentPlan,
}: DomainsClientProps) {
  const [domains, setDomains] = useState<DomainDoc[]>(initialDomains)
  const [newDomain, setNewDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [verificationDetails, setVerificationDetails] = useState<
    Record<string, VerificationInfo[]>
  >({})
  const [copied, setCopied] = useState<string | null>(null)
  const [brandLogoEdit, setBrandLogoEdit] = useState<Record<string, string>>({})
  const [savingLogo, setSavingLogo] = useState<string | null>(null)

  const canAdd = domains.length < maxDomains

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault()
    if (!newDomain.trim() || !canAdd) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/domains/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to connect domain")
        return
      }

      // Add the new domain to the list
      setDomains((prev) => [
        {
          $id: data.id,
          domain: data.domain,
          status: data.status,
          verification_token: data.verification_token,
          ssl_status: "pending",
          created_at: new Date().toISOString(),
        },
        ...prev,
      ])
      setNewDomain("")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(domainId: string) {
    setVerifying(domainId)

    try {
      const res = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to verify domain")
        return
      }

      // Update domain in list
      setDomains((prev) =>
        prev.map((d) =>
          d.$id === domainId
            ? { ...d, status: data.status, ssl_status: data.ssl_status }
            : d,
        ),
      )

      // Store verification details if not yet verified
      if (data.verification && data.verification.length > 0) {
        setVerificationDetails((prev) => ({
          ...prev,
          [domainId]: data.verification,
        }))
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setVerifying(null)
    }
  }

  async function handleRemove(domainId: string) {
    if (!confirm("Remove this domain? This cannot be undone.")) return

    setRemoving(domainId)

    try {
      const res = await fetch("/api/domains/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to remove domain")
        return
      }

      setDomains((prev) => prev.filter((d) => d.$id !== domainId))
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setRemoving(null)
    }
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleSaveBrandLogo(domainId: string) {
    const url = brandLogoEdit[domainId] ?? ""
    setSavingLogo(domainId)
    try {
      // Optimistically update UI
      setDomains((prev) =>
        prev.map((d) => (d.$id === domainId ? { ...d, brand_logo_url: url || null } : d)),
      )
      // We'll store it in appwrite via a lightweight API call (fire and forget for now)
      await fetch("/api/domains/brand-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId, brandLogoUrl: url || null }),
      })
    } catch {
      // Non-critical
    } finally {
      setSavingLogo(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back to Dashboard */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Connect Domain Form */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Connect a Domain</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Point your domain&apos;s CNAME record to{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
            cname.vercel-dns.com
          </code>{" "}
          (or your project-specific Vercel CNAME) then add it below.
        </p>

        {canAdd ? (
          <form onSubmit={handleConnect} className="flex gap-3">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="go.yoursite.com"
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newDomain.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Connect
            </button>
          </form>
        ) : (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm">
            <p className="font-medium text-amber-600">Domain limit reached</p>
            <p className="mt-1 text-muted-foreground">
              Your {currentPlan} plan allows {maxDomains} domain(s).{" "}
              <Link href="/pricing" className="text-primary hover:underline">
                Upgrade your plan
              </Link>{" "}
              to connect more.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Domains List */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">
            Your Domains ({domains.length}/{maxDomains})
          </h2>
        </div>

        {domains.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No domains connected</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Connect your first custom domain to start creating branded short
              links.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {domains.map((domain) => (
              <div key={domain.$id} className="px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{domain.domain}</span>

                      {/* Status badge */}
                      {domain.status === "verified" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                          <AlertCircle className="h-3 w-3" />
                          Unverified
                        </span>
                      )}

                      {/* SSL badge */}
                      {domain.ssl_status === "active" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                          <Shield className="h-3 w-3" />
                          SSL
                        </span>
                      )}
                    </div>
                    {domain.created_at && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Connected{" "}
                        {new Date(domain.created_at).toLocaleDateString()}
                      </p>
                    )}
                    {/* Brand logo input for verified domains */}
                    {domain.status === "verified" && (
                      <div className="mt-3 flex flex-col gap-2">
                        <p className="text-xs text-muted-foreground font-medium">Brand Logo URL (PNG, shown in link footer)</p>
                        <div className="flex items-center gap-2">
                          {(domain.brand_logo_url || brandLogoEdit[domain.$id] !== undefined) && (
                            <img
                              src={brandLogoEdit[domain.$id] ?? domain.brand_logo_url ?? ""}
                              alt="brand logo preview"
                              className="h-7 w-auto max-w-[80px] object-contain rounded border border-border bg-muted"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                            />
                          )}
                          <input
                            type="url"
                            placeholder="https://yoursite.com/logo.png"
                            value={brandLogoEdit[domain.$id] ?? domain.brand_logo_url ?? ""}
                            onChange={(e) =>
                              setBrandLogoEdit((prev) => ({ ...prev, [domain.$id]: e.target.value }))
                            }
                            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <button
                            onClick={() => handleSaveBrandLogo(domain.$id)}
                            disabled={savingLogo === domain.$id}
                            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors whitespace-nowrap"
                          >
                            {savingLogo === domain.$id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {domain.status !== "verified" && (
                      <button
                        onClick={() => handleVerify(domain.$id)}
                        disabled={verifying === domain.$id}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        {verifying === domain.$id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3.5 w-3.5" />
                        )}
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(domain.$id)}
                      disabled={removing === domain.$id}
                      className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      {removing === domain.$id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Remove
                    </button>
                  </div>
                </div>

                {/* Verification instructions */}
                {domain.status !== "verified" && (
                  <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                    <h4 className="text-sm font-medium mb-2">
                      DNS Configuration Required
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Add the following DNS record to verify ownership:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded bg-background px-3 py-2 text-xs font-mono">
                        <div>
                          <span className="text-muted-foreground">Type:</span>{" "}
                          CNAME
                        </div>
                        <div>
                          <span className="text-muted-foreground">Name:</span>{" "}
                          {domain.domain.split(".")[0]}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Value:</span>{" "}
                          cname.vercel-dns.com
                          <button
                            onClick={() =>
                              handleCopy(
                                "cname.vercel-dns.com",
                                `cname-${domain.$id}`,
                              )
                            }
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {copied === `cname-${domain.$id}` ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Show Vercel-provided verification records */}
                      {verificationDetails[domain.$id]?.map((v, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded bg-background px-3 py-2 text-xs font-mono"
                        >
                          <div>
                            <span className="text-muted-foreground">
                              Type:
                            </span>{" "}
                            {v.type}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Name:
                            </span>{" "}
                            {v.domain}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Value:
                            </span>{" "}
                            <span className="truncate max-w-[200px]">
                              {v.value}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(v.value, `ver-${domain.$id}-${i}`)
                              }
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {copied === `ver-${domain.$id}-${i}` ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      After adding DNS records, click &quot;Verify&quot;. DNS
                      changes may take up to 48 hours to propagate.
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground/80 leading-relaxed border-t border-border/40 pt-2">
                      <strong>Tip:</strong> Both the generic <code className="bg-muted px-1 rounded">cname.vercel-dns.com</code> and project-specific CNAME targets recommended by Vercel are fully supported. If your DNS provider or Vercel suggests a specific target, you can use either option.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
