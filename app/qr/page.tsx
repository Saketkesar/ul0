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
      const url = await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
      setQrDataUrl(url)
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

          {/* Use Cases */}
          <section className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Popular QR Code Use Cases
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">🏪 Business Cards</h3>
                <p className="text-sm text-muted-foreground">
                  Add a QR code to your business card linking to your website or contact info.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">🍽️ Restaurant Menus</h3>
                <p className="text-sm text-muted-foreground">
                  Create contactless menus by linking to your digital menu.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">📶 WiFi Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Let guests connect to your WiFi instantly by scanning a QR code.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">📱 Social Media</h3>
                <p className="text-sm text-muted-foreground">
                  Share your Instagram, TikTok, or YouTube channel with a simple scan.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
