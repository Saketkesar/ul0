"use client"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  QrCode,
  Download,
  Link2,
  Mail,
  Phone,
  Wifi,
  MessageSquare,
  Copy,
  Check,
  Sparkles,
  Palette,
  ShieldCheck,
  User,
} from "lucide-react"
import QRCode from "qrcode"
import Link from "next/link"

export default function CanonicalQrCodeGeneratorPage() {
  const [activeTab, setActiveTab] = useState("url")
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [darkColor, setDarkColor] = useState("#000000")
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("H")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Form states
  const [urlInput, setUrlInput] = useState("https://ul0.site")
  const [textInput, setTextInput] = useState("")
  const [emailTo, setEmailTo] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [wifiSsid, setWifiSsid] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")
  const [wifiEncryption, setWifiEncryption] = useState("WPA")
  const [smsNumber, setSmsNumber] = useState("")
  const [smsMessage, setSmsMessage] = useState("")
  const [vcardName, setVcardName] = useState("")
  const [vcardPhone, setVcardPhone] = useState("")
  const [vcardEmail, setVcardEmail] = useState("")
  const [vcardCompany, setVcardCompany] = useState("")

  const computeQrPayload = () => {
    switch (activeTab) {
      case "url":
        return urlInput.trim() || "https://ul0.site"
      case "text":
        return textInput.trim() || "ul0 free QR code generator"
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      case "phone":
        return `tel:${phoneNumber}`
      case "sms":
        return `smsto:${smsNumber}:${smsMessage}`
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nORG:${vcardCompany}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`
      default:
        return urlInput.trim() || "https://ul0.site"
    }
  }

  const renderQR = async () => {
    const payload = computeQrPayload()
    if (!payload) return

    try {
      const canvas = canvasRef.current
      if (canvas) {
        await QRCode.toCanvas(canvas, payload, {
          width: 360,
          margin: 2,
          errorCorrectionLevel: errorCorrection,
          color: {
            dark: darkColor,
            light: "#ffffff",
          },
        })

        const url = canvas.toDataURL("image/png")
        setQrDataUrl(url)
      }
    } catch (err) {
      console.error("[QR Generation Error]:", err)
    }
  }

  useEffect(() => {
    renderQR()
  }, [
    activeTab,
    urlInput,
    textInput,
    emailTo,
    emailSubject,
    emailBody,
    phoneNumber,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    smsNumber,
    smsMessage,
    vcardName,
    vcardPhone,
    vcardEmail,
    vcardCompany,
    darkColor,
    errorCorrection,
  ])

  const downloadPNG = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.download = `ul0-qrcode-${activeTab}.png`
    link.href = qrDataUrl
    link.click()
  }

  const copyImage = async () => {
    if (!qrDataUrl) return
    try {
      const blob = await fetch(qrDataUrl).then((r) => r.blob())
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Copy error:", err)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              <QrCode className="h-4 w-4" />
              High-Resolution Free QR Code Generator
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Free QR Code Generator Online
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
              Create high-resolution, scannable QR codes for websites, WiFi networks, digital business cards, flyers, and menus. 100% free with no watermark.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: QR Content Controls */}
            <div className="lg:col-span-7 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Select QR Code Type</CardTitle>
                  <CardDescription className="text-xs">Choose what content your QR code should encode.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 sm:grid-cols-7 h-auto p-1 gap-1">
                      <TabsTrigger value="url" className="text-xs py-2">
                        <Link2 className="h-3.5 w-3.5 mr-1" /> URL
                      </TabsTrigger>
                      <TabsTrigger value="text" className="text-xs py-2">
                        Text
                      </TabsTrigger>
                      <TabsTrigger value="wifi" className="text-xs py-2">
                        <Wifi className="h-3.5 w-3.5 mr-1" /> WiFi
                      </TabsTrigger>
                      <TabsTrigger value="vcard" className="text-xs py-2">
                        <User className="h-3.5 w-3.5 mr-1" /> vCard
                      </TabsTrigger>
                      <TabsTrigger value="email" className="text-xs py-2">
                        <Mail className="h-3.5 w-3.5 mr-1" /> Email
                      </TabsTrigger>
                      <TabsTrigger value="phone" className="text-xs py-2">
                        <Phone className="h-3.5 w-3.5 mr-1" /> Phone
                      </TabsTrigger>
                      <TabsTrigger value="sms" className="text-xs py-2">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" /> SMS
                      </TabsTrigger>
                    </TabsList>

                    {/* Tab: URL */}
                    <TabsContent value="url" className="space-y-3 pt-4">
                      <Label htmlFor="url" className="text-xs">Website URL</Label>
                      <Input
                        id="url"
                        placeholder="https://yourwebsite.com"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="text-sm"
                      />
                    </TabsContent>

                    {/* Tab: Plain Text */}
                    <TabsContent value="text" className="space-y-3 pt-4">
                      <Label htmlFor="text" className="text-xs">Plain Text Message</Label>
                      <Textarea
                        id="text"
                        placeholder="Type any message, serial number, or note..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                    </TabsContent>

                    {/* Tab: WiFi */}
                    <TabsContent value="wifi" className="space-y-3 pt-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label className="text-xs">Network Name (SSID)</Label>
                          <Input
                            placeholder="Home or Cafe WiFi"
                            value={wifiSsid}
                            onChange={(e) => setWifiSsid(e.target.value)}
                            className="text-sm mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Password</Label>
                          <Input
                            placeholder="Network password"
                            type="password"
                            value={wifiPassword}
                            onChange={(e) => setWifiPassword(e.target.value)}
                            className="text-sm mt-1"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab: vCard */}
                    <TabsContent value="vcard" className="space-y-3 pt-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label className="text-xs">Full Name</Label>
                          <Input
                            placeholder="Jane Doe"
                            value={vcardName}
                            onChange={(e) => setVcardName(e.target.value)}
                            className="text-sm mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Company / Title</Label>
                          <Input
                            placeholder="Founder, Studio"
                            value={vcardCompany}
                            onChange={(e) => setVcardCompany(e.target.value)}
                            className="text-sm mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Phone Number</Label>
                          <Input
                            placeholder="+1 (555) 019-2834"
                            value={vcardPhone}
                            onChange={(e) => setVcardPhone(e.target.value)}
                            className="text-sm mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Email Address</Label>
                          <Input
                            placeholder="jane@company.com"
                            value={vcardEmail}
                            onChange={(e) => setVcardEmail(e.target.value)}
                            className="text-sm mt-1"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab: Email */}
                    <TabsContent value="email" className="space-y-3 pt-4">
                      <div>
                        <Label className="text-xs">Recipient Email</Label>
                        <Input
                          placeholder="support@company.com"
                          value={emailTo}
                          onChange={(e) => setEmailTo(e.target.value)}
                          className="text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Subject Line</Label>
                        <Input
                          placeholder="Inquiry about services"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          className="text-sm mt-1"
                        />
                      </div>
                    </TabsContent>

                    {/* Tab: Phone */}
                    <TabsContent value="phone" className="space-y-3 pt-4">
                      <Label className="text-xs">Phone Number</Label>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="text-sm"
                      />
                    </TabsContent>

                    {/* Tab: SMS */}
                    <TabsContent value="sms" className="space-y-3 pt-4">
                      <div>
                        <Label className="text-xs">Recipient Phone Number</Label>
                        <Input
                          placeholder="+1 (555) 123-4567"
                          value={smsNumber}
                          onChange={(e) => setSmsNumber(e.target.value)}
                          className="text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Pre-filled SMS Message</Label>
                        <Input
                          placeholder="Hi! I saw your flyer..."
                          value={smsMessage}
                          onChange={(e) => setSmsMessage(e.target.value)}
                          className="text-sm mt-1"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Styling & Color Controls */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <Label className="text-xs flex items-center gap-1.5 font-semibold">
                      <Palette className="h-3.5 w-3.5 text-primary" /> QR Color Palette
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { color: "#000000", label: "Classic Black" },
                        { color: "#1e3a8a", label: "Navy Blue" },
                        { color: "#047857", label: "Emerald" },
                        { color: "#7c3aed", label: "Royal Purple" },
                        { color: "#c2410c", label: "Amber Crimson" },
                      ].map((preset) => (
                        <button
                          key={preset.color}
                          type="button"
                          onClick={() => setDarkColor(preset.color)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            darkColor === preset.color
                              ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                              : "border-border bg-card text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          <span className="h-3 w-3 rounded-full border border-black/20" style={{ backgroundColor: preset.color }} />
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Live Canvas Preview & Download */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <Card className="w-full text-center p-6 bg-card border-border shadow-lg">
                <CardTitle className="text-base mb-1">Live QR Code</CardTitle>
                <CardDescription className="text-xs mb-6">Scan with any smartphone camera</CardDescription>

                <div className="mx-auto p-4 rounded-2xl bg-white border border-border shadow-sm inline-block">
                  <canvas ref={canvasRef} className="mx-auto" />
                </div>

                <div className="mt-6 flex flex-col gap-2.5">
                  <Button onClick={downloadPNG} className="w-full gap-2 font-semibold h-11">
                    <Download className="h-4 w-4" /> Download High-Res PNG
                  </Button>
                  <Button variant="outline" onClick={copyImage} className="w-full gap-2 text-xs h-9">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied to Clipboard!" : "Copy Image to Clipboard"}
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>No scan limits • Permanent &amp; Ad-free</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
