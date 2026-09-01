"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  LinkIcon,
  Copy,
  Check,
  QrCode,
  Link2,
  Sparkles,
  ArrowRight,
  Download,
  Trash2,
  ExternalLink,
} from "lucide-react"
import QRCode from "qrcode"
import Link from "next/link"

const CAMPAIGN_PRESETS = [
  { name: "Google Ads", source: "google", medium: "cpc", campaign: "summer_sale" },
  { name: "Meta / Instagram", source: "instagram", medium: "paid_social", campaign: "retargeting" },
  { name: "TikTok Ads", source: "tiktok", medium: "video", campaign: "ugc_creator" },
  { name: "LinkedIn", source: "linkedin", medium: "social", campaign: "b2b_leadgen" },
  { name: "Email Newsletter", source: "newsletter", medium: "email", campaign: "weekly_digest" },
  { name: "Print Flyer QR", source: "flyer_print", medium: "qr_code", campaign: "local_promo" },
]

export default function CanonicalUtmBuilderPage() {
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [source, setSource] = useState("")
  const [medium, setMedium] = useState("")
  const [campaign, setCampaign] = useState("")
  const [term, setTerm] = useState("")
  const [content, setContent] = useState("")
  
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Build full tagged URL
  useEffect(() => {
    if (!websiteUrl.trim()) {
      setGeneratedUrl("")
      return
    }

    try {
      let raw = websiteUrl.trim()
      if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
        raw = `https://${raw}`
      }
      const url = new URL(raw)
      if (source.trim()) url.searchParams.set("utm_source", source.trim())
      if (medium.trim()) url.searchParams.set("utm_medium", medium.trim())
      if (campaign.trim()) url.searchParams.set("utm_campaign", campaign.trim())
      if (term.trim()) url.searchParams.set("utm_term", term.trim())
      if (content.trim()) url.searchParams.set("utm_content", content.trim())

      const finalStr = url.toString()
      setGeneratedUrl(finalStr)

      // Generate matching QR code
      const canvas = canvasRef.current
      if (canvas) {
        QRCode.toCanvas(canvas, finalStr, {
          width: 260,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
        }).then(() => {
          setQrDataUrl(canvas.toDataURL("image/png"))
        })
      }
    } catch {
      setGeneratedUrl("")
    }
  }, [websiteUrl, source, medium, campaign, term, content])

  const applyPreset = (preset: typeof CAMPAIGN_PRESETS[0]) => {
    setSource(preset.source)
    setMedium(preset.medium)
    setCampaign(preset.campaign)
  }

  const copyUrl = () => {
    if (!generatedUrl) return
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.download = `utm-campaign-qr.png`
    link.href = qrDataUrl
    link.click()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              <LinkIcon className="h-4 w-4" />
              Campaign Attribution &amp; Tracking Link Generator
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Free UTM Campaign Link Builder
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
              Add Google Analytics UTM tracking parameters to your URLs for accurate multi-channel attribution across ads, emails, and social posts.
            </p>
          </div>

          {/* Presets Row */}
          <div className="mb-6">
            <Label className="text-xs text-muted-foreground mb-2 block font-medium">Quick Campaign Presets:</Label>
            <div className="flex flex-wrap gap-2">
              {CAMPAIGN_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-xs font-medium text-foreground transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3 text-primary" /> {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Input Form */}
            <div className="lg:col-span-7 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">UTM Campaign Parameters</CardTitle>
                  <CardDescription className="text-xs">Fill out the fields to tag your destination URL.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="webUrl" className="text-xs font-semibold">
                      Website URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="webUrl"
                      placeholder="https://example.com/product-page"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="source" className="text-xs font-semibold">
                        Campaign Source (utm_source) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="source"
                        placeholder="google, newsletter, instagram"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="medium" className="text-xs font-semibold">
                        Campaign Medium (utm_medium) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="medium"
                        placeholder="cpc, email, social, banner"
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="campaign" className="text-xs font-semibold">
                      Campaign Name (utm_campaign)
                    </Label>
                    <Input
                      id="campaign"
                      placeholder="spring_launch, 50off_flash"
                      value={campaign}
                      onChange={(e) => setCampaign(e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="term" className="text-xs font-semibold">
                        Campaign Term (utm_term)
                      </Label>
                      <Input
                        id="term"
                        placeholder="keyword keywords, target query"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content" className="text-xs font-semibold">
                        Campaign Content (utm_content)
                      </Label>
                      <Input
                        id="content"
                        placeholder="cta_button_blue, hero_banner_v2"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Output & Actions */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Generated Tracking URL</CardTitle>
                  <CardDescription className="text-xs">Your ready-to-share tagged link.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3.5 rounded-xl border border-border bg-background font-mono text-xs text-foreground break-all min-h-[70px] flex items-center">
                    {generatedUrl || <span className="text-muted-foreground font-sans">Fill in the website URL above to generate your link...</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button onClick={copyUrl} disabled={!generatedUrl} className="w-full gap-2 h-10 font-semibold">
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied Tagged Link!" : "Copy Tagged URL"}
                    </Button>

                    <Link
                      href={generatedUrl ? `/?url=${encodeURIComponent(generatedUrl)}` : "/"}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors ${!generatedUrl ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      <Link2 className="h-3.5 w-3.5" /> Shorten Link on ul0
                    </Link>
                  </div>

                  {/* QR Code Preview */}
                  {generatedUrl && (
                    <div className="mt-4 pt-4 border-t border-border text-center">
                      <div className="p-3 bg-white rounded-xl border border-border inline-block shadow-sm">
                        <canvas ref={canvasRef} className="mx-auto" />
                      </div>
                      <div className="mt-2">
                        <Button variant="ghost" size="sm" onClick={downloadQR} className="text-xs gap-1">
                          <Download className="h-3 w-3" /> Download Campaign QR Code
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
