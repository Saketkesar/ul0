"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, Copy, Eye, EyeOff, Key, RefreshCw, Trash2, ShieldAlert, ChevronRight } from "lucide-react"

interface ApiKeysClientProps {
  initialApiKey: string | null
  plan: string
}

export function ApiKeysClient({ initialApiKey, plan }: ApiKeysClientProps) {
  const [apiKey, setApiKey] = useState<string | null>(initialApiKey)
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateKey = async () => {
    if (apiKey && !confirm("Generating a new API key will invalidate your existing key immediately. Are you sure you want to proceed?")) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/keys", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setApiKey(data.apiKey)
        setRevealed(true)
      } else {
        setError(data.error || "Failed to generate key")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKey = async () => {
    if (!confirm("Are you sure you want to delete your API key? All programmatic tools using this key will fail immediately.")) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/keys", { method: "DELETE" })
      if (res.ok) {
        setApiKey(null)
        setRevealed(false)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to delete key")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!apiKey) return
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 9)}••••••••••••••••••••${apiKey.slice(-4)}`
    : ""

  const rateLimitDesc = plan === "business_user"
    ? "300 requests per minute"
    : "60 requests per minute"

  return (
    <div className="space-y-6">
      {/* API Key Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Credentials</CardTitle>
          <CardDescription>
            Use this key to authorize API requests. Do not share this key with anyone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {apiKey ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 font-mono text-sm border border-border bg-muted/50 rounded-lg p-3 select-all overflow-x-auto min-h-[44px] flex items-center">
                  {revealed ? apiKey : maskedKey}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setRevealed(!revealed)}
                    variant="outline"
                    size="icon"
                    title={revealed ? "Hide key" : "Show key"}
                  >
                    {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="icon"
                    title="Copy key"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={handleDeleteKey}
                    variant="destructive"
                    size="icon"
                    disabled={loading}
                    title="Revoke key"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-blue-500/5 border border-blue-500/10 rounded-md p-3">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-500 shrink-0" style={{ animationDuration: '4s' }} />
                <span>Your API key is active. Rate limits: **{rateLimitDesc}** based on your plan level.</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed border-border rounded-lg bg-muted/20">
              <Key className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-sm font-semibold">No API Key Generated</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 mb-4">
                You haven&apos;t generated an API key yet. Click below to create your credentials.
              </p>
              <Button onClick={handleGenerateKey} disabled={loading} className="gap-2">
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <PlusIcon className="h-4 w-4" />}
                Generate API Key
              </Button>
            </div>
          )}

          {apiKey && (
            <div className="pt-2 flex justify-start">
              <Button
                onClick={handleGenerateKey}
                disabled={loading}
                variant="outline"
                className="gap-2 text-xs"
              >
                {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Roll / Regenerate API Key
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Programmatic Integration Guide</CardTitle>
          <CardDescription>
            Learn how to use your API key to shorten URLs programmatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">1. Standard Shortening (ul0.site)</h3>
            <p className="text-xs text-muted-foreground">
              Send a POST request to create links. Pass your API key in the <code>Authorization: Bearer</code> header.
            </p>
            <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto border">
{`curl -X POST https://ul0.site/api/shorten \\
  -H "Authorization: Bearer ${apiKey || "YOUR_API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "longUrl": "https://example.com/some-long-product-link",
    "customSlug": "summer-promo"
  }'`}
            </pre>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-semibold">2. Shortening on your Connected Custom Domain</h3>
            <p className="text-xs text-muted-foreground">
              To shorten links on your connected domain, include the <code>"host"</code> parameter in the request body.
            </p>
            <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto border">
{`curl -X POST https://ul0.site/api/shorten \\
  -H "Authorization: Bearer ${apiKey || "YOUR_API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "longUrl": "https://example.com/another-link",
    "host": "link.yourbrand.com",
    "customSlug": "sales"
  }'`}
            </pre>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-semibold">Expected JSON Response</h3>
            <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto border">
{`{
  "slug": "sales",
  "shortUrl": "http://link.yourbrand.com/r/sales",
  "host": "link.yourbrand.com"
}`}
            </pre>
          </div>
          <div className="pt-4 border-t flex justify-end">
            <a href="/docs" target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View Full API Documentation
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
