"use client"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  Building2,
  Utensils,
  Home,
  CreditCard,
  FileText,
  Download,
  Check,
  Copy,
  Star,
  Printer,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import QRCode from "qrcode"
import Link from "next/link"

const BUSINESS_TEMPLATES = [
  {
    id: "reviews",
    icon: Star,
    name: "Google Reviews QR",
    description: "Send customers directly to your Google Business Review page.",
    defaultPayload: "https://g.page/r/your-business-review",
    cta: "Leave a 5-Star Review ⭐",
  },
  {
    id: "menu",
    icon: Utensils,
    name: "Restaurant Digital Menu",
    description: "Contactless QR code for table menus, wine lists & takeout.",
    defaultPayload: "https://yourrestaurant.com/menu.pdf",
    cta: "Scan for Today's Specials 🍷",
  },
  {
    id: "realestate",
    icon: Home,
    name: "Real Estate Property Tour",
    description: "Link for property yard signs, open houses, and virtual 3D tours.",
    defaultPayload: "https://realestate.com/123-maple-ave",
    cta: "Take Virtual 3D Tour 🏡",
  },
  {
    id: "card",
    icon: CreditCard,
    name: "Digital Business Card",
    description: "Scan to save contact details directly into smartphone address books.",
    defaultPayload: "https://ul0.site/bio/founder",
    cta: "Save Contact Details 📱",
  },
  {
    id: "flyer",
    icon: FileText,
    name: "Promotional Flyer / Event",
    description: "Trackable QR code for event tickets, discounts & brochures.",
    defaultPayload: "https://ul0.site/r/fall-discount",
    cta: "Get 20% Off Your Order 🏷️",
  },
]

export default function QrCodeForBusinessPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(BUSINESS_TEMPLATES[0])
  const [businessName, setBusinessName] = useState("Oak & Iron Bistro")
  const [targetUrl, setTargetUrl] = useState(BUSINESS_TEMPLATES[0].defaultPayload)
  const [callToAction, setCallToAction] = useState(BUSINESS_TEMPLATES[0].cta)
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const selectTemplate = (tmpl: typeof BUSINESS_TEMPLATES[0]) => {
    setSelectedTemplate(tmpl)
    setTargetUrl(tmpl.defaultPayload)
    setCallToAction(tmpl.cta)
  }

  const renderQR = async () => {
    if (!targetUrl.trim()) return
    try {
      const canvas = canvasRef.current
      if (canvas) {
        await QRCode.toCanvas(canvas, targetUrl.trim(), {
          width: 320,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
          errorCorrectionLevel: "H",
        })
        setQrDataUrl(canvas.toDataURL("image/png"))
      }
    } catch (err) {
      console.error("[Business QR Error]:", err)
    }
  }

  useEffect(() => {
    renderQR()
  }, [targetUrl])

  const downloadPNG = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.download = `business-qr-${selectedTemplate.id}.png`
    link.href = qrDataUrl
    link.click()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              <Building2 className="h-4 w-4" />
              Commercial QR Solutions for Small Businesses &amp; Retail
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              QR Codes for Business Cards, Flyers &amp; Menus
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
              Design professional, high-resolution QR codes optimized for print marketing, restaurant tables, property flyers, and Google reviews.
            </p>
          </div>

          {/* Template Selector Cards */}
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-8">
            {BUSINESS_TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon
              const isSelected = selectedTemplate.id === tmpl.id
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => selectTemplate(tmpl)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5 mb-2 text-primary" />
                  <span className="text-xs leading-snug">{tmpl.name}</span>
                </button>
              )
            })}
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Form */}
            <div className="lg:col-span-7 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Customize Business QR</CardTitle>
                  <CardDescription className="text-xs">{selectedTemplate.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="bName" className="text-xs font-semibold">Business / Brand Name</Label>
                    <Input
                      id="bName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tUrl" className="text-xs font-semibold">Destination URL / Review Link</Label>
                    <Input
                      id="tUrl"
                      placeholder="https://..."
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="mt-1 text-sm font-mono text-xs"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cta" className="text-xs font-semibold">Print Call-to-Action Text</Label>
                    <Input
                      id="cta"
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Print Best Practices Checklist */}
              <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  <Printer className="h-4 w-4 text-primary" />
                  Print Checklist for Flyers &amp; Signage
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li><strong>Minimum Size:</strong> At least 0.8 x 0.8 inches (2 x 2 cm) for business cards; 1.5 x 1.5 inches for flyers.</li>
                  <li><strong>High Contrast:</strong> Always keep dark codes against a clean white background.</li>
                  <li><strong>Clear CTA:</strong> Add text like <em>"{callToAction}"</em> so customers know why to scan.</li>
                  <li><strong>Test Before Printing:</strong> Scan with both iPhone and Android cameras prior to bulk print runs.</li>
                </ul>
              </div>
            </div>

            {/* Print Sign Mockup Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[340px] rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 bg-white p-6 shadow-xl text-center text-zinc-950">
                <div className="font-bold text-base mb-1 tracking-tight text-zinc-900">
                  {businessName || "Your Business"}
                </div>
                <div className="text-xs text-zinc-500 font-medium mb-4">
                  {callToAction}
                </div>

                <div className="mx-auto p-2 bg-white border rounded-xl inline-block shadow-sm">
                  <canvas ref={canvasRef} className="mx-auto" />
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                  Scan With Phone Camera
                </div>
              </div>

              <div className="w-full max-w-[340px] mt-4 flex flex-col gap-2">
                <Button onClick={downloadPNG} className="w-full gap-2 font-semibold h-11">
                  <Download className="h-4 w-4" /> Download Print-Ready PNG
                </Button>
                <Button variant="outline" onClick={() => window.print()} className="w-full gap-2 text-xs h-9">
                  <Printer className="h-4 w-4" /> Print Display Tent Card
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
