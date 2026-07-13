"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Check, Copy, Code2, ShieldCheck, Zap, AlertCircle, ChevronRight } from "lucide-react"

export default function ApiDocsPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(id)
      setTimeout(() => setCopiedText(null), 2000)
    } catch {}
  }

  const curlCode = `curl -X POST https://ul0.site/api/shorten \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "longUrl": "https://example.com/very-long-product-details-link",
    "host": "link.yourbrand.com",
    "customSlug": "summer-promo"
  }'`

  const nodeCode = `const fetch = require('node-fetch');

async function shortenUrl() {
  const response = await fetch('https://ul0.site/api/shorten', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      longUrl: 'https://example.com/very-long-product-details-link',
      host: 'link.yourbrand.com', // Optional
      customSlug: 'summer-promo' // Optional
    })
  });

  const data = await response.json();
  console.log(data);
}

shortenUrl();`

  const pythonCode = `import requests

url = "https://ul0.site/api/shorten"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "longUrl": "https://example.com/very-long-product-details-link",
    "host": "link.yourbrand.com",  # Optional
    "customSlug": "summer-promo"   # Optional
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data)`

  const goCode = `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	url := "https://ul0.site/api/shorten"
	
	payload := map[string]string{
		"longUrl":    "https://example.com/very-long-product-details-link",
		"host":       "link.yourbrand.com", // Optional
		"customSlug": "summer-promo",        // Optional
	}
	
	jsonPayload, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
	
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")
	
	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	
	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	fmt.Println(result)
}`

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Code2 className="h-10 w-10 text-primary" />
              Developer API Reference
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Automate branded short link creation using our simple HTTP REST API. Perfect for product integrations, campaigns, and dashboards.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Navigation Sidebar */}
            <aside className="lg:col-span-1 space-y-2">
              <nav className="flex flex-col gap-1 text-sm sticky top-24">
                <a href="#authentication" className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  Authentication
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
                <a href="#endpoints" className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  Create Link Endpoint
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
                <a href="#rate-limiting" className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  Rate Limits
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
                <a href="#responses" className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                  Error Responses
                  <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </nav>
            </aside>

            {/* Documentation Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Authentication */}
              <section id="authentication" className="scroll-mt-20 space-y-4">
                <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                  Authentication
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Authenticate your requests by passing your generated API key in the headers. You can generate API credentials directly inside the <a href="/dashboard/keys" className="text-primary hover:underline font-medium">API Keys Dashboard</a>.
                </p>
                <Card className="bg-muted/10 border-border">
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-semibold">Supported Authorization Headers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
                      <span className="font-mono font-semibold">Authorization</span>
                      <span className="font-mono text-muted-foreground">Bearer ul0_yourApiKeyHere</span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between">
                      <span className="font-mono font-semibold">X-API-Key</span>
                      <span className="font-mono text-muted-foreground">ul0_yourApiKeyHere</span>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Endpoints */}
              <section id="endpoints" className="scroll-mt-20 space-y-4">
                <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-amber-500" />
                  Shorten URL
                </h2>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-md bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-600">POST</span>
                  <code className="text-sm font-mono font-semibold bg-muted px-2 py-0.5 rounded border">https://ul0.site/api/shorten</code>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Submit a payload containing the target URL. If a connected custom domain is specified, we check ownership, register the record in your account, and create a short URL targeting your custom link.
                </p>

                {/* Request Parameters Table */}
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="p-3 font-semibold">Parameter</th>
                        <th className="p-3 font-semibold">Type</th>
                        <th className="p-3 font-semibold">Required</th>
                        <th className="p-3 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3 font-mono font-semibold">longUrl</td>
                        <td className="p-3 text-muted-foreground">string</td>
                        <td className="p-3 text-red-500 font-semibold">Yes</td>
                        <td className="p-3 text-muted-foreground">The full destination web address to redirect readers to.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-semibold">host</td>
                        <td className="p-3 text-muted-foreground">string</td>
                        <td className="p-3 text-muted-foreground">No</td>
                        <td className="p-3 text-muted-foreground">Connected custom domain (e.g., <code>link.yourbrand.com</code>). Defaults to <code>ul0.site</code>.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-semibold">customSlug</td>
                        <td className="p-3 text-muted-foreground">string</td>
                        <td className="p-3 text-muted-foreground">No</td>
                        <td className="p-3 text-muted-foreground">Desirable slug identifier (path component). Auto-generated if omitted.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Code Examples Tabs */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Request Integration Samples</h3>
                  <Tabs defaultValue="curl" className="border rounded-xl bg-card overflow-hidden">
                    <div className="border-b bg-muted/40 px-4 py-2 flex items-center justify-between">
                      <TabsList className="bg-transparent border-0 h-auto p-0 gap-3">
                        <TabsTrigger value="curl" className="data-[state=active]:bg-background border-0 text-xs px-2.5 py-1">cURL</TabsTrigger>
                        <TabsTrigger value="node" className="data-[state=active]:bg-background border-0 text-xs px-2.5 py-1">NodeJS</TabsTrigger>
                        <TabsTrigger value="python" className="data-[state=active]:bg-background border-0 text-xs px-2.5 py-1">Python</TabsTrigger>
                        <TabsTrigger value="go" className="data-[state=active]:bg-background border-0 text-xs px-2.5 py-1">Go</TabsTrigger>
                      </TabsList>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="h-7 text-xs gap-1"
                        onClick={() => {
                          const tab = document.querySelector('[data-state=active]')?.getAttribute('value');
                          const text = tab === 'curl' ? curlCode : tab === 'node' ? nodeCode : tab === 'python' ? pythonCode : goCode;
                          handleCopy(text, tab || 'copy');
                        }}
                      >
                        {copiedText ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        {copiedText ? "Copied" : "Copy"}
                      </Button>
                    </div>

                    <TabsContent value="curl" className="p-4 m-0">
                      <pre className="text-xs font-mono overflow-x-auto leading-relaxed">{curlCode}</pre>
                    </TabsContent>
                    <TabsContent value="node" className="p-4 m-0">
                      <pre className="text-xs font-mono overflow-x-auto leading-relaxed">{nodeCode}</pre>
                    </TabsContent>
                    <TabsContent value="python" className="p-4 m-0">
                      <pre className="text-xs font-mono overflow-x-auto leading-relaxed">{pythonCode}</pre>
                    </TabsContent>
                    <TabsContent value="go" className="p-4 m-0">
                      <pre className="text-xs font-mono overflow-x-auto leading-relaxed">{goCode}</pre>
                    </TabsContent>
                  </Tabs>
                </div>
              </section>

              {/* Rate Limiting */}
              <section id="rate-limiting" className="scroll-mt-20 space-y-4">
                <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-blue-500" />
                  Rate Limits
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Programmatic requests carry different rate limits depending on your subscribed account tier:
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-border">
                    <CardHeader className="py-4">
                      <CardTitle className="text-sm font-semibold">Pro Plan Keys</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Allows up to **60 requests per minute** per key. Ideal for small applications.
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardHeader className="py-4">
                      <CardTitle className="text-sm font-semibold">Business Plan Keys</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Allows up to **300 requests per minute** per key. Perfect for scaling enterprise systems.
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Responses */}
              <section id="responses" className="scroll-mt-20 space-y-4">
                <h2 className="text-2xl font-bold tracking-tight border-b pb-2 flex items-center gap-2">
                  Error Responses
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The API will return appropriate HTTP response status codes along with descriptive JSON error objects if a call fails:
                </p>
                <div className="space-y-3">
                  <div className="rounded-lg border p-4 bg-muted/5">
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <span className="font-semibold text-red-500">401 Unauthorized</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Occurs if the API key header is missing or incorrect.
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-muted/5">
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <span className="font-semibold text-red-500">403 Forbidden</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Occurs if attempting to shorten on a custom domain (`host`) that is not connected or verified on your account.
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-muted/5">
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <span className="font-semibold text-amber-500">409 Conflict</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Occurs if the requested `customSlug` is already taken on that domain.
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-muted/5">
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <span className="font-semibold text-red-500">429 Too Many Requests</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Occurs if you exceed the minute rate limit associated with your active plan.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
