"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/code-block"
import {
  Code,
  Key,
  Layers,
  ExternalLink,
  ShieldCheck,
  Check,
  Download,
  AlertTriangle,
} from "lucide-react"

export default function ApiDocsPage() {
  const [selectedLang, setSelectedLang] = useState<"curl" | "js" | "python">("curl")

  const curlExample = `curl -X POST https://ul0.site/api/shorten \\
  -H "Authorization: Bearer ul0_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "longUrl": "https://example.com/very-long-product-details-link",
    "customSlug": "summer-sale",
    "host": "link.yourbrand.com"
  }'`

  const jsExample = `const response = await fetch("https://ul0.site/api/shorten", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ul0_live_your_api_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    longUrl: "https://example.com/very-long-product-details-link",
    customSlug: "summer-sale",
    host: "link.yourbrand.com", // Optional connected domain
  }),
});

const data = await response.json();
console.log(data.shortUrl); // https://link.yourbrand.com/r/summer-sale`

  const pythonExample = `import requests

url = "https://ul0.site/api/shorten"
headers = {
    "Authorization": "Bearer ul0_live_your_api_key_here",
    "Content-Type": "application/json",
}
payload = {
    "longUrl": "https://example.com/very-long-product-details-link",
    "customSlug": "summer-sale",
    "host": "link.yourbrand.com",  # Optional connected domain
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data["shortUrl"])`

  const openApiSpec = {
    openapi: "3.1.0",
    info: {
      title: "UL0 REST API",
      version: "1.0.0",
      description: "Programmatic short link creation, vector QR codes, and click analytics.",
    },
    servers: [{ url: "https://ul0.site" }],
    paths: {
      "/api/shorten": {
        post: {
          summary: "Create a short link",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["longUrl"],
                  properties: {
                    longUrl: { type: "string", format: "uri" },
                    customSlug: { type: "string" },
                    host: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Link created successfully" },
            "400": { description: "Invalid URL or slug" },
            "401": { description: "Missing or invalid API key" },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },
    },
  }

  const downloadOpenApi = () => {
    const blob = new Blob([JSON.stringify(openApiSpec, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ul0-openapi.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-16">
          {/* Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border border-border bg-muted/40 text-muted-foreground">
              <Code className="h-3 w-3 text-primary" />
              <span>Developer Reference</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-foreground">
              REST API Documentation
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Integrate short link creation, custom domain routing, and click metrics into your applications.
            </p>
          </div>

          {/* Authentication */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">1. Authentication</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              All API requests must include your secret API key in the standard{" "}
              <code className="font-mono text-foreground font-semibold">Authorization: Bearer</code> header
              or via the <code className="font-mono text-foreground">x-api-key</code> header.
            </p>
            <div className="p-3.5 rounded-md border border-border bg-card font-mono text-xs text-foreground">
              Authorization: Bearer ul0_live_••••••••••••••••••••••••
            </div>
            <p className="text-xs text-muted-foreground">
              Manage your credentials in the{" "}
              <Link href="/dashboard/keys" className="text-primary hover:underline font-medium">
                API Keys dashboard →
              </Link>
            </p>
          </div>

          {/* Quickstart Code Example */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">2. Create a Short Link</h2>
              <div className="flex items-center gap-1 p-0.5 rounded border border-border bg-muted/30 text-xs">
                {(["curl", "js", "python"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLang(lang)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors ${
                      selectedLang === lang
                        ? "bg-background text-foreground shadow-2xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {selectedLang === "curl" && <CodeBlock language="bash" code={curlExample} />}
            {selectedLang === "js" && <CodeBlock language="javascript" code={jsExample} />}
            {selectedLang === "python" && <CodeBlock language="python" code={pythonExample} />}

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-semibold text-foreground">Expected JSON Response (200 OK)</h3>
              <pre className="p-3.5 rounded-lg border border-border bg-muted/40 font-mono text-xs text-foreground overflow-x-auto">
{`{
  "slug": "summer-sale",
  "shortUrl": "https://link.yourbrand.com/r/summer-sale",
  "host": "link.yourbrand.com",
  "id": "670c1d2e0021b8f9a"
}`}
              </pre>
            </div>
          </div>

          {/* Endpoints Table */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">3. Core API Endpoints</h2>
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-muted-foreground">
                    <th className="px-3.5 py-2.5 font-semibold">Method</th>
                    <th className="px-3.5 py-2.5 font-semibold">Path</th>
                    <th className="px-3.5 py-2.5 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono text-[11px]">
                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                    <td className="px-3.5 py-2.5">/api/shorten</td>
                    <td className="px-3.5 py-2.5 font-sans text-muted-foreground">Create short link or dynamic QR code</td>
                  </tr>
                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-blue-600 dark:text-blue-400">GET</td>
                    <td className="px-3.5 py-2.5">/api/keys</td>
                    <td className="px-3.5 py-2.5 font-sans text-muted-foreground">List active credentials and usage</td>
                  </tr>
                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                    <td className="px-3.5 py-2.5">/api/keys</td>
                    <td className="px-3.5 py-2.5 font-sans text-muted-foreground">Generate a new secret API key</td>
                  </tr>
                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-rose-600 dark:text-rose-400">DELETE</td>
                    <td className="px-3.5 py-2.5">/api/keys?id=:keyId</td>
                    <td className="px-3.5 py-2.5 font-sans text-muted-foreground">Revoke a specific API key</td>
                  </tr>
                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-blue-600 dark:text-blue-400">GET</td>
                    <td className="px-3.5 py-2.5">/api/dashboard/links/:id/analytics</td>
                    <td className="px-3.5 py-2.5 font-sans text-muted-foreground">Query aggregated click metrics</td>
                  </tr>
                  <tr>
                    <td className="px-3.5 py-2.5 font-bold text-rose-600 dark:text-rose-400">DELETE</td>
                    <td className="px-3.5 py-2.5">/api/links/:id</td>
                    <td className="px-3.5 py-2.5 font-sans text-muted-foreground">Permanently delete a short link</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Rate Limits & Errors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Rate Limits by Plan</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center justify-between">
                  <span>Free Plan</span>
                  <span className="font-mono font-medium text-foreground">10 requests / min (Sandbox)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Pro Plan</span>
                  <span className="font-mono font-medium text-foreground">60 requests / min</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Business Plan</span>
                  <span className="font-mono font-medium text-foreground">300 requests / min</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">HTTP Error Codes</h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground font-mono">
                <li><strong className="text-foreground">400 Bad Request:</strong> Invalid URL or duplicate slug</li>
                <li><strong className="text-foreground">401 Unauthorized:</strong> Missing or expired Bearer key</li>
                <li><strong className="text-foreground">403 Forbidden:</strong> Domain not verified or plan gated</li>
                <li><strong className="text-foreground">429 Too Many Requests:</strong> Exceeded rate limit window</li>
                <li><strong className="text-foreground">500 Server Error:</strong> Database or network glitch</li>
              </ul>
            </div>
          </div>

          {/* OpenAPI Spec Download */}
          <div className="rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-foreground">OpenAPI 3.1 Specification</h3>
              <p className="text-xs text-muted-foreground">
                Download the machine-readable OpenAPI schema for Postman, Insomnia, or SDK generation.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadOpenApi}
              className="text-xs font-semibold gap-1.5 shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download openapi.json</span>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
