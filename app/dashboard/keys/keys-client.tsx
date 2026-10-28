"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Clock,
  Activity,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"

interface ApiKeyItem {
  id: string
  name: string
  prefix: string
  created_at: string
  last_used_at: string | null
}

interface ApiKeysClientProps {
  initialKeys: ApiKeyItem[]
  planSlug: string
}

export function ApiKeysClient({ initialKeys, planSlug }: ApiKeysClientProps) {
  const [keys, setKeys] = useState<ApiKeyItem[]>(initialKeys)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createdSecret, setCreatedSecret] = useState<string | null>(null)
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [copiedSnippet, setCopiedSnippet] = useState(false)
  const [revokeModalKey, setRevokeModalKey] = useState<ApiKeyItem | null>(null)
  const [isRevoking, setIsRevoking] = useState(false)

  const isFreePlan = planSlug === "free_user"
  const rateLimitLabel =
    planSlug === "business_user"
      ? "300 requests / minute"
      : planSlug === "pro_user"
      ? "60 requests / minute"
      : "10 requests / minute (Sandbox)"

  const handleOpenCreate = () => {
    setKeyName("")
    setCreatedSecret(null)
    setCopiedSecret(false)
    setCreateDialogOpen(true)
  }

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName.trim() || "Default API Key" }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create API key")
      }

      setKeys((prev) => [data.key, ...prev])
      setCreatedSecret(data.secretKey)
      toast.success("API key generated")
    } catch (err: any) {
      toast.error(err.message || "Failed to generate API key")
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopySecret = async () => {
    if (!createdSecret) return
    try {
      await navigator.clipboard.writeText(createdSecret)
      setCopiedSecret(true)
      toast.success("API key copied to clipboard")
      setTimeout(() => setCopiedSecret(false), 2000)
    } catch {
      toast.error("Failed to copy to clipboard")
    }
  }

  const handleRevokeKey = async () => {
    if (!revokeModalKey) return
    setIsRevoking(true)

    try {
      const res = await fetch(`/api/keys?id=${encodeURIComponent(revokeModalKey.id)}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to revoke key")
      }

      setKeys((prev) => prev.filter((k) => k.id !== revokeModalKey.id))
      toast.success("API key revoked")
      setRevokeModalKey(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke key")
    } finally {
      setIsRevoking(false)
    }
  }

  const curlSnippet = `curl -X POST https://ul0.site/api/shorten \\
  -H "Authorization: Bearer ${keys[0]?.prefix ? "YOUR_API_KEY" : "YOUR_API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "longUrl": "https://example.com/long-page-url",
    "customSlug": "summer-promo"
  }'`

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(curlSnippet)
      setCopiedSnippet(true)
      setTimeout(() => setCopiedSnippet(false), 2000)
    } catch {}
  }

  return (
    <div className="space-y-6">
      {/* Rate limit status tile */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Activity className="h-3.5 w-3.5 text-primary" />
            Rate Limit Quota
          </span>
          <p className="text-sm font-semibold text-foreground">{rateLimitLabel}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Key className="h-3.5 w-3.5 text-primary" />
            Active Keys
          </span>
          <p className="text-sm font-semibold text-foreground">{keys.length} of 5</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 space-y-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Clock className="h-3.5 w-3.5 text-primary" />
            Authentication Scheme
          </span>
          <p className="text-sm font-mono font-semibold text-foreground">Bearer Token</p>
        </div>
      </div>

      {/* Main Keys List Card */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Active API Keys</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Secret keys allow programmatic access to shorten links and inspect analytics.
            </p>
          </div>
          <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Create key</span>
          </Button>
        </div>

        {keys.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="mx-auto h-9 w-9 rounded-md border border-border bg-muted/40 flex items-center justify-center text-muted-foreground">
              <Key className="h-4 w-4" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-xs font-semibold text-foreground">No API keys generated</h3>
              <p className="text-xs text-muted-foreground">
                Generate an API key to integrate URL shortening into your command-line tools or backend applications.
              </p>
            </div>
            <Button onClick={handleOpenCreate} size="sm" variant="outline" className="text-xs gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Generate your first key</span>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-muted-foreground">
                  <th className="px-4 py-3 font-semibold text-foreground">Name</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Key Prefix</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Created</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Last Used</th>
                  <th className="px-4 py-3 font-semibold text-right text-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <span className="flex items-center gap-1.5">
                        <Key className="h-3 w-3 text-muted-foreground shrink-0" />
                        {k.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground select-all">
                      {k.prefix}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(k.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {k.last_used_at
                        ? new Date(k.last_used_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        onClick={() => setRevokeModalKey(k)}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        <span>Revoke</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Code Snippet Card */}
      <div className="rounded-lg border border-border bg-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-foreground">Example Request</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send a JSON POST request with your API key to shorten links.
            </p>
          </div>
          <Button
            onClick={handleCopySnippet}
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
          >
            {copiedSnippet ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
            <span>{copiedSnippet ? "Copied" : "Copy curl"}</span>
          </Button>
        </div>

        <pre className="p-3 rounded-md bg-muted/60 border border-border font-mono text-xs overflow-x-auto text-foreground">
          {curlSnippet}
        </pre>

        <div className="pt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Accepts JSON payloads. Supports custom back-half aliases and connected domains.</span>
          <Link
            href="/docs"
            className="text-primary hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Full API Reference</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Create Key Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {createdSecret ? "API Key Created" : "Create New API Key"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {createdSecret
                ? "Copy this secret key immediately. For security, you will not be able to view it again."
                : "Give your key a descriptive name to track its usage across your tools."}
            </DialogDescription>
          </DialogHeader>

          {createdSecret ? (
            <div className="space-y-4 py-2">
              <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Save this key in a password manager or secure environment variable. It cannot be recovered once this dialog is closed.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Secret Key</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={createdSecret}
                    readOnly
                    className="font-mono text-xs bg-muted/50 select-all"
                  />
                  <Button
                    onClick={handleCopySecret}
                    size="sm"
                    className="gap-1.5 shrink-0 text-xs"
                  >
                    {copiedSecret ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedSecret ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setCreateDialogOpen(false)} size="sm" className="w-full text-xs">
                  I have copied my key
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleCreateKey} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label htmlFor="keyName" className="text-xs font-medium text-foreground">
                  Key Name
                </label>
                <Input
                  id="keyName"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. GitHub Actions, Zapier, Local CLI"
                  maxLength={50}
                  className="text-xs"
                  autoFocus
                />
              </div>

              {isFreePlan && (
                <p className="text-[11px] text-muted-foreground">
                  Free plan includes sandbox access (10 req/min). Upgrade to Pro for 60 req/min and production webhooks.
                </p>
              )}

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={isCreating}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isCreating}
                  className="text-xs"
                >
                  {isCreating ? "Generating..." : "Generate Key"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Revoke Key Confirmation Dialog */}
      <Dialog
        open={Boolean(revokeModalKey)}
        onOpenChange={(open) => !open && setRevokeModalKey(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to revoke <strong>{revokeModalKey?.name}</strong> (
              <span className="font-mono">{revokeModalKey?.prefix}</span>)? Any applications or
              scripts using this key will immediately be denied access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRevokeModalKey(null)}
              disabled={isRevoking}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRevokeKey}
              disabled={isRevoking}
              className="text-xs"
            >
              {isRevoking ? "Revoking..." : "Revoke Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
