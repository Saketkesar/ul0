"use client"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Download, Link2, Mail, Phone, Wifi, MessageSquare, Copy, Check } from "lucide-react"
import QRCode from "qrcode"

export default function QRCodeGeneratorPage() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Form states
  const [urlInput, setUrlInput] = useState("")
  const [textInput, setTextInput] = useState("")
  const [emailTo, setEmailTo] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [wifiSsid, setWifiSsid] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")
  const [wifiEncryption, setWifiEncryption] = useState("WPA")
  const [smsNumber, setSmsNumber] = useState("")
  const [smsMessage, setSmsMessage] = useState("")

  const generateQR = async (data: string) => {
    if (!data.trim()) return
    setGenerating(true)
    try {
      const canvas = canvasRef.current
      if (canvas) {
        // High error correction 'H' is required when center is obscured by a logo
        await QRCode.toCanvas(canvas, data, {
          width: 400,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        })

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

            // Draw white rounded card behind the logo
            ctx.fillStyle = "#ffffff"
            ctx.beginPath()
            const padding = 6
            ctx.roundRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2, 6)
            ctx.fill()

            // Draw the logo image
            ctx.drawImage(logoImg, x, y, logoSize, logoSize)
          }
        }

        const url = canvas.toDataURL("image/png")
        setQrDataUrl(url)
      } else {
        const url = await QRCode.toDataURL(data, {
          width: 400,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        })
        setQrDataUrl(url)
      }
    } catch (err) {
      console.error("Error generating QR code:", err)
    }
    setGenerating(false)
  }

  const downloadQR = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.download = "qr-code.png"
    link.href = qrDataUrl
    link.click()
  }

  const copyQR = async () => {
    if (!qrDataUrl) return
    try {
      const blob = await fetch(qrDataUrl).then(r => r.blob())
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error copying:", err)
    }
  }

  const generateUrlQR = () => {
    let url = urlInput.trim()
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url
    }
    generateQR(url)
  }

  const generateEmailQR = () => {
    const mailto = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`
    generateQR(mailto)
  }

  const generatePhoneQR = () => {
    generateQR(`tel:${phoneNumber}`)
  }

  const generateWifiQR = () => {
    const wifiString = `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`
    generateQR(wifiString)
  }

  const generateSmsQR = () => {
    generateQR(`sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <QrCode className="h-4 w-4" />
              100% Free QR Code Generator
            </div>
            <h1 className="text-3xl font-bold mb-4 sm:text-4xl lg:text-5xl">
              Free QR Code Generator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Create QR codes for URLs, WiFi, Email, Phone, SMS and more. 
              No signup required. Download instantly in high quality PNG format.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Generator */}
            <Card>
              <CardHeader>
                <CardTitle>Generate QR Code</CardTitle>
                <CardDescription>Select type and enter your data</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
                    <TabsTrigger value="url" className="text-xs">
                      <Link2 className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">URL</span>
                    </TabsTrigger>
                    <TabsTrigger value="text" className="text-xs">
                      <MessageSquare className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Text</span>
                    </TabsTrigger>
                    <TabsTrigger value="email" className="text-xs">
                      <Mail className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Email</span>
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="text-xs">
                      <Phone className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Phone</span>
                    </TabsTrigger>
                    <TabsTrigger value="wifi" className="text-xs">
                      <Wifi className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">WiFi</span>
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="text-xs">
                      <MessageSquare className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">SMS</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="url">Website URL</Label>
                      <Input
                        id="url"
                        placeholder="https://example.com"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                      />
                    </div>
                    <Button onClick={generateUrlQR} className="w-full" disabled={generating}>
                      {generating ? "Generating..." : "Generate QR Code"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text">Text Content</Label>
                      <Input
                        id="text"
                        placeholder="Enter any text..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => generateQR(textInput)} className="w-full" disabled={generating}>
                      {generating ? "Generating..." : "Generate QR Code"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="email" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-to">Email Address</Label>
                      <Input
                        id="email-to"
                        type="email"
                        placeholder="example@email.com"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-subject">Subject (optional)</Label>
                      <Input
                        id="email-subject"
                        placeholder="Email subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                    </div>
                    <Button onClick={generateEmailQR} className="w-full" disabled={generating}>
                      {generating ? "Generating..." : "Generate QR Code"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <Button onClick={generatePhoneQR} className="w-full" disabled={generating}>
                      {generating ? "Generating..." : "Generate QR Code"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="wifi" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ssid">Network Name (SSID)</Label>
                      <Input
                        id="ssid"
                        placeholder="Your WiFi name"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wifi-password">Password</Label>
                      <Input
                        id="wifi-password"
                        type="password"
                        placeholder="WiFi password"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="encryption">Encryption</Label>
                      <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={generateWifiQR} className="w-full" disabled={generating}>
                      {generating ? "Generating..." : "Generate QR Code"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="sms" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sms-number">Phone Number</Label>
                      <Input
                        id="sms-number"
                        type="tel"
                        placeholder="+1234567890"
                        value={smsNumber}
                        onChange={(e) => setSmsNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms-message">Message (optional)</Label>
                      <Input
                        id="sms-message"
                        placeholder="Pre-filled message"
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                      />
                    </div>
                    <Button onClick={generateSmsQR} className="w-full" disabled={generating}>
                      {generating ? "Generating..." : "Generate QR Code"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Your QR Code</CardTitle>
                <CardDescription>Scan with any QR code reader app</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-[300px] h-[300px] border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30 mb-4">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Generated QR Code" className="w-full h-full" />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <QrCode className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p>Your QR code will appear here</p>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
                
                {qrDataUrl && (
                  <div className="flex gap-2 w-full">
                    <Button onClick={downloadQR} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                    <Button onClick={copyQR} variant="outline" className="flex-1">
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* SEO Content */}
          <section className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Why Use Our Free QR Code Generator?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Multiple QR Types</h3>
                <p className="text-sm text-muted-foreground">
                  Create QR codes for URLs, WiFi, Email, Phone, SMS, and plain text.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">High Quality Download</h3>
                <p className="text-sm text-muted-foreground">
                  Download your QR code in high-resolution PNG format for print or digital use.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">No Signup Required</h3>
                <p className="text-sm text-muted-foreground">
                  Generate unlimited QR codes instantly without creating an account.
                </p>
              </div>
            </div>
          </section>

          {/* Comprehensive Guide & Educational Content */}
          <section className="mt-16 max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Complete Guide to QR Codes: Technology, Use Cases & Best Practices</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Quick Response (QR) codes have transformed how businesses and individuals bridge physical objects with online experiences. Originally invented in 1994 by Masahiro Hara at Denso Wave for automotive parts tracking, QR codes are now ubiquitous in marketing, contactless payments, digital menus, event ticketing, and WiFi authentication.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unlike traditional 1D barcodes that store up to 20 numerical characters, 2D QR codes can store thousands of alphanumeric characters in a matrix pattern, making them versatile for embedding complex URLs, WiFi credentials, vCards, and encrypted transaction signatures.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-border p-6 rounded-xl bg-card">
                <h3 className="text-lg font-semibold mb-3">Understanding QR Error Correction Levels</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  QR codes utilize Reed-Solomon Error Correction algorithms. This mathematical capability allows scanning devices to accurately read codes even if parts of the graphic are smudged, torn, or obscured by custom branding logos.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li><strong>Level L (Low):</strong> Recovers up to 7% of lost data</li>
                  <li><strong>Level M (Medium):</strong> Recovers up to 15% of lost data</li>
                  <li><strong>Level Q (Quartile):</strong> Recovers up to 25% of lost data</li>
                  <li><strong>Level H (High):</strong> Recovers up to 30% of lost data (Used by ul0 for custom logos)</li>
                </ul>
              </div>

              <div className="border border-border p-6 rounded-xl bg-card">
                <h3 className="text-lg font-semibold mb-3">Static vs Dynamic QR Codes Explained</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Understanding the difference between Static and Dynamic QR codes is crucial when planning offline marketing campaigns:
                </p>
                <ul className="text-xs text-muted-foreground space-y-2">
                  <li><strong>Static QR Codes:</strong> Data is encoded directly into the pattern. They never expire and require no server hosting, but the target destination URL cannot be edited after printing.</li>
                  <li><strong>Dynamic QR Codes:</strong> The QR code embeds a short redirect URL (e.g. using ul0). This allows you to update the final destination website anytime without re-printing posters or packaging.</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Best Practices for Printing and Displaying QR Codes</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1">1. Maintain Sufficient Contrast & Sizing</h4>
                  <p>Always print dark code modules on a bright, high-contrast background (typically black pattern on white cardstock). For distance scanning on flyers or tabletop stands, ensure the code is at least 2cm x 2cm (0.8 inches) in dimension.</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1">2. Provide a Clear Call-to-Action (CTA)</h4>
                  <p>Don't print a naked QR code without context. Add a clear headline such as &quot;Scan for Digital Menu&quot; or &quot;Scan to Connect to Guest WiFi&quot; so users know what benefit to expect before launching their mobile camera.</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1">3. Test Across Multiple Mobile Operating Systems</h4>
                  <p>Before sending graphics to production printers, test your generated code using both iOS Native Camera and Android Lens/Scanner apps under varying light conditions.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions (FAQ)</h2>
              <div className="space-y-4 text-sm">
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-1">Do QR codes generated on ul0 expire?</h3>
                  <p className="text-muted-foreground">No. All static QR codes generated on ul0 encode your destination parameters directly and remain operational indefinitely with no subscription fees or scan limits.</p>
                </div>
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-1">Is any personal data stored when generating a QR code?</h3>
                  <p className="text-muted-foreground">No. Our QR code generator executes client-side within your browser runtime environment. We do not store or track the payload text, credentials, or URLs you encode into codes.</p>
                </div>
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold text-foreground mb-1">Can I use generated QR codes for commercial printing?</h3>
                  <p className="text-muted-foreground">Yes. The high-resolution PNG image output provided by ul0 is completely royalty-free for use across commercial packaging, marketing flyers, business cards, and store signages.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
