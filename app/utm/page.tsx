"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, Trash2, Link2, ExternalLink, QrCode, Plus, History, Bookmark, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import QRCode from "qrcode"

interface SavedCampaign {
  id: string
  url: string
  source: string
  medium: string
  campaign: string
  term?: string
  content?: string
  createdAt: number
}

const COMMON_SOURCES = [
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter/X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "email", label: "Email" },
  { value: "newsletter", label: "Newsletter" },
  { value: "reddit", label: "Reddit" },
  { value: "pinterest", label: "Pinterest" },
]

const COMMON_MEDIUMS = [
  { value: "cpc", label: "CPC (Cost Per Click)" },
  { value: "cpm", label: "CPM (Cost Per Mille)" },
  { value: "social", label: "Social" },
  { value: "email", label: "Email" },
  { value: "organic", label: "Organic" },
  { value: "referral", label: "Referral" },
  { value: "display", label: "Display" },
  { value: "affiliate", label: "Affiliate" },
  { value: "banner", label: "Banner" },
  { value: "video", label: "Video" },
]

export default function UtmBuilderPage() {
  // Form state
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [utmSource, setUtmSource] = useState("")
  const [utmMedium, setUtmMedium] = useState("")
  const [utmCampaign, setUtmCampaign] = useState("")
  const [utmTerm, setUtmTerm] = useState("")
  const [utmContent, setUtmContent] = useState("")
  
  // UI state
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedCampaigns, setSavedCampaigns] = useState<SavedCampaign[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // QR Code state
  const [qrDataUrl, setQrDataUrl] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-generate QR code when URL is generated
  useEffect(() => {
    if (generatedUrl) {
      const canvas = canvasRef.current
      if (canvas) {
        QRCode.toCanvas(canvas, generatedUrl, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        }).then(async () => {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            const logoImg = new Image()
            logoImg.src = "/favicon.png"
            await new Promise((resolve) => {
              logoImg.onload = resolve
              logoImg.onerror = resolve
            })

            if (logoImg.complete && logoImg.naturalWidth > 0) {
              const logoSize = canvas.width * 0.20
              const x = (canvas.width - logoSize) / 2
              const y = (canvas.height - logoSize) / 2

              // Draw white border behind logo
              ctx.fillStyle = "#ffffff"
              ctx.beginPath()
              const padding = 5
              ctx.roundRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2, 5)
              ctx.fill()

              ctx.drawImage(logoImg, x, y, logoSize, logoSize)
            }
          }
          setQrDataUrl(canvas.toDataURL("image/png"))
        }).catch(err => {
          console.error("UTM QR code generation failed:", err)
        })
      }
    } else {
      setQrDataUrl("")
    }
  }, [generatedUrl])

  const downloadCampaignQR = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.download = `campaign-qr-${utmCampaign || "code"}.png`
    link.href = qrDataUrl
    link.click()
  }

  // Load saved campaigns from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("utm_campaigns")
      if (saved) {
        setSavedCampaigns(JSON.parse(saved))
      }
    } catch {}
  }, [])

  // Generate UTM URL
  const generateUrl = useCallback(() => {
    // Validate URL
    if (!websiteUrl.trim()) {
      setError("Please enter a website URL")
      setGeneratedUrl("")
      return
    }

    let url: URL
    try {
      // Add https if no protocol
      let urlString = websiteUrl.trim()
      if (!urlString.match(/^https?:\/\//i)) {
        urlString = "https://" + urlString
      }
      url = new URL(urlString)
    } catch {
      setError("Please enter a valid URL")
      setGeneratedUrl("")
      return
    }

    // Validate required fields
    if (!utmSource.trim()) {
      setError("Campaign Source is required")
      setGeneratedUrl("")
      return
    }
    if (!utmMedium.trim()) {
      setError("Campaign Medium is required")
      setGeneratedUrl("")
      return
    }
    if (!utmCampaign.trim()) {
      setError("Campaign Name is required")
      setGeneratedUrl("")
      return
    }

    setError(null)

    // Build UTM parameters
    const params = new URLSearchParams(url.search)
    params.set("utm_source", utmSource.trim().toLowerCase().replace(/\s+/g, "_"))
    params.set("utm_medium", utmMedium.trim().toLowerCase().replace(/\s+/g, "_"))
    params.set("utm_campaign", utmCampaign.trim().toLowerCase().replace(/\s+/g, "_"))
    
    if (utmTerm.trim()) {
      params.set("utm_term", utmTerm.trim().toLowerCase().replace(/\s+/g, "_"))
    }
    if (utmContent.trim()) {
      params.set("utm_content", utmContent.trim().toLowerCase().replace(/\s+/g, "_"))
    }

    url.search = params.toString()
    setGeneratedUrl(url.toString())
  }, [websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent])

  // Auto-generate on input change
  useEffect(() => {
    if (websiteUrl && utmSource && utmMedium && utmCampaign) {
      generateUrl()
    }
  }, [websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, generateUrl])

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!generatedUrl) return
    
    try {
      await navigator.clipboard.writeText(generatedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Save campaign
  const saveCampaign = () => {
    if (!generatedUrl) return
    
    const campaign: SavedCampaign = {
      id: Date.now().toString(),
      url: generatedUrl,
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
      term: utmTerm || undefined,
      content: utmContent || undefined,
      createdAt: Date.now(),
    }
    
    const updated = [campaign, ...savedCampaigns].slice(0, 20) // Keep last 20
    setSavedCampaigns(updated)
    try {
      localStorage.setItem("utm_campaigns", JSON.stringify(updated))
    } catch {}
  }

  // Load saved campaign
  const loadCampaign = (campaign: SavedCampaign) => {
    try {
      const url = new URL(campaign.url)
      setWebsiteUrl(url.origin + url.pathname)
    } catch {
      setWebsiteUrl("")
    }
    setUtmSource(campaign.source)
    setUtmMedium(campaign.medium)
    setUtmCampaign(campaign.campaign)
    setUtmTerm(campaign.term || "")
    setUtmContent(campaign.content || "")
    setShowHistory(false)
  }

  // Clear all
  const clearAll = () => {
    setWebsiteUrl("")
    setUtmSource("")
    setUtmMedium("")
    setUtmCampaign("")
    setUtmTerm("")
    setUtmContent("")
    setGeneratedUrl("")
    setError(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3 sm:text-4xl flex items-center justify-center gap-3">
              <Link2 className="h-10 w-10 text-primary" />
              Free UTM Link Builder
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create UTM tracking links for Google Analytics. Track your marketing campaigns with proper attribution. 100% free, no signup required.
            </p>
          </div>

          {/* Main Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Build Your UTM Link</CardTitle>
              <CardDescription>
                Fill in the required fields (*) to generate your tracking URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Website URL */}
              <div className="space-y-2">
                <Label htmlFor="url">Website URL *</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/landing-page"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The full URL of the page you want to track
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* UTM Source */}
                <div className="space-y-2">
                  <Label htmlFor="source">Campaign Source * (utm_source)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="source"
                      placeholder="google, facebook, newsletter"
                      value={utmSource}
                      onChange={(e) => setUtmSource(e.target.value)}
                      className="flex-1"
                    />
                    <Select onValueChange={setUtmSource}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Pick" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_SOURCES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Where the traffic is coming from
                  </p>
                </div>

                {/* UTM Medium */}
                <div className="space-y-2">
                  <Label htmlFor="medium">Campaign Medium * (utm_medium)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="medium"
                      placeholder="cpc, email, social"
                      value={utmMedium}
                      onChange={(e) => setUtmMedium(e.target.value)}
                      className="flex-1"
                    />
                    <Select onValueChange={setUtmMedium}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Pick" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_MEDIUMS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Marketing medium (cpc, email, social, etc.)
                  </p>
                </div>
              </div>

              {/* UTM Campaign */}
              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign Name * (utm_campaign)</Label>
                <Input
                  id="campaign"
                  placeholder="spring_sale, product_launch, black_friday"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Name of your marketing campaign
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* UTM Term (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="term">Campaign Term (utm_term) - Optional</Label>
                  <Input
                    id="term"
                    placeholder="running+shoes, keyword"
                    value={utmTerm}
                    onChange={(e) => setUtmTerm(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Paid search keywords
                  </p>
                </div>

                {/* UTM Content (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="content">Campaign Content (utm_content) - Optional</Label>
                  <Input
                    id="content"
                    placeholder="banner_ad, text_link, button"
                    value={utmContent}
                    onChange={(e) => setUtmContent(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Differentiate ads or links (A/B testing)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={generateUrl} className="gap-2">
                  <Link2 className="h-4 w-4" />
                  Generate UTM Link
                </Button>
                <Button onClick={clearAll} variant="outline" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
                <Button 
                  onClick={() => setShowHistory(!showHistory)} 
                  variant="outline" 
                  className="gap-2"
                >
                  <History className="h-4 w-4" />
                  History ({savedCampaigns.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Hidden Canvas for QR Generation */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Generated URL */}
          {generatedUrl && (
            <Card className="mb-6 border-primary/50 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Your UTM Link is Ready!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Column: Link Inputs & Actions */}
                  <div className="flex-1 space-y-4">
                    <Textarea
                      value={generatedUrl}
                      readOnly
                      className="font-mono text-sm bg-background min-h-[85px]"
                    />
                    <div className="flex flex-wrap gap-2.5">
                      <Button onClick={copyToClipboard} size="sm" className="gap-1.5">
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied!" : "Copy Link"}
                      </Button>
                      <Button onClick={saveCampaign} size="sm" variant="outline" className="gap-1.5">
                        <Bookmark className="h-3.5 w-3.5" />
                        Save Campaign
                      </Button>
                      <Button asChild size="sm" variant="outline" className="gap-1.5">
                        <a href={generatedUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Test Link
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="gap-1.5">
                        <Link href={`/?url=${encodeURIComponent(generatedUrl)}`}>
                          <Link2 className="h-3.5 w-3.5" />
                          Shorten URL
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: QR Code Preview & Download */}
                  {qrDataUrl && (
                    <div className="flex flex-col items-center gap-3 p-4 border border-border bg-card rounded-xl shadow-xs shrink-0 self-center md:self-stretch justify-center">
                      <div className="relative bg-white p-2.5 rounded-lg border border-border">
                        <img 
                          src={qrDataUrl} 
                          alt="Campaign QR Code" 
                          className="w-[125px] h-[125px] block object-contain" 
                        />
                      </div>
                      <Button 
                        onClick={downloadCampaignQR} 
                        size="sm" 
                        variant="secondary" 
                        className="w-full gap-1.5 h-8 text-xs font-medium"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download QR
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Campaigns History */}
          {showHistory && savedCampaigns.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Saved Campaigns
                </CardTitle>
                <CardDescription>Click to load a previous campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {savedCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      onClick={() => loadCampaign(campaign)}
                      className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="font-medium text-sm truncate">{campaign.campaign}</div>
                      <div className="text-xs text-muted-foreground">
                        {campaign.source} / {campaign.medium}
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {campaign.url}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* UTM Parameters Explanation */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">utm_source</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="mb-2">Identifies which site sent the traffic.</p>
                <p className="font-medium text-foreground">Examples:</p>
                <code className="text-xs">google, facebook, newsletter, twitter</code>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">utm_medium</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="mb-2">The marketing medium or channel.</p>
                <p className="font-medium text-foreground">Examples:</p>
                <code className="text-xs">cpc, email, social, banner, affiliate</code>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">utm_campaign</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="mb-2">The specific campaign name.</p>
                <p className="font-medium text-foreground">Examples:</p>
                <code className="text-xs">spring_sale, product_launch, promo_2024</code>
              </CardContent>
            </Card>
          </div>

          {/* SEO Content & Comprehensive Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Mastering UTM Parameters for Campaign Tracking & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-6">
              <p className="leading-relaxed">
                <strong>UTM parameters</strong> (Urchin Tracking Module parameters) are standardized text snippets appended to destination URLs. When visitors click a tagged link, Google Analytics (GA4), Adobe Analytics, and Mixpanel parse these query strings to pinpoint the exact traffic acquisition channel, marketing creative, and ad campaign driving engagement and conversions.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 pt-2">
                <div className="border border-border p-4 rounded-lg bg-background">
                  <h4 className="font-semibold text-foreground mb-2">Required Parameters:</h4>
                  <ul className="text-sm space-y-1.5 list-disc list-inside">
                    <li><strong>utm_source:</strong> Identifies the traffic provider or referrer platform (e.g. <code className="text-xs">google, newsletter, linkedin</code>).</li>
                    <li><strong>utm_medium:</strong> Categorizes the high-level marketing mechanism (e.g. <code className="text-xs">cpc, email, social, affiliate</code>).</li>
                    <li><strong>utm_campaign:</strong> Names the specific strategic promotion or product launch (e.g. <code className="text-xs">summer_sale_2026, webinar_q3</code>).</li>
                  </ul>
                </div>

                <div className="border border-border p-4 rounded-lg bg-background">
                  <h4 className="font-semibold text-foreground mb-2">Optional Parameters:</h4>
                  <ul className="text-sm space-y-1.5 list-disc list-inside">
                    <li><strong>utm_term:</strong> Captures paid search keywords or audience targeting criteria (e.g. <code className="text-xs">free_url_shortener</code>).</li>
                    <li><strong>utm_content:</strong> Differentiates specific ad creatives, CTA button variations, or link positions for A/B testing.</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground text-lg mb-3">Enterprise UTM Naming Conventions & Best Practices</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Enforce Lowercase Formatting:</strong> Analytics tools treat <code className="text-xs">Facebook</code> and <code className="text-xs">facebook</code> as two separate sources. Standardize strictly on lowercase text.</li>
                  <li><strong>Avoid Spaces & Special Characters:</strong> Replace spaces with hyphens (<code className="text-xs">-</code>) or underscores (<code className="text-xs">_</code>) to maintain clean URL encoding.</li>
                  <li><strong>Never Embed PII (Personally Identifiable Information):</strong> Avoid putting user email addresses or real names into UTM parameters to maintain compliance with GDPR and Google Analytics policy.</li>
                  <li><strong>Pair tagged long URLs with short aliases:</strong> Tagging URLs can result in 100+ character addresses. Shorten your tagged UTM links using ul0 to maintain clean social media posts.</li>
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground text-lg mb-3">Frequently Asked Questions</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-foreground">Do UTM parameters impact search engine SEO rankings?</h4>
                    <p className="text-xs mt-0.5">No. Search engines ignore standard tracking parameters when crawling pages, especially when canonical tags are properly configured on target landing pages.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">What is the difference between utm_source and utm_medium?</h4>
                    <p className="text-xs mt-0.5">Source answers &quot;WHERE is the visitor coming from?&quot; (e.g. Twitter). Medium answers &quot;HOW did they get here?&quot; (e.g. organic social post vs paid ad click).</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
