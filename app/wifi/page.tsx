"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wifi, Download, Copy, Check, Eye, EyeOff, QrCode, Smartphone, Laptop, Shield } from "lucide-react"
import QRCode from "qrcode"
import Link from "next/link"

export default function WifiQRGeneratorPage() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form states
  const [ssid, setSsid] = useState("")
  const [password, setPassword] = useState("")
  const [encryption, setEncryption] = useState("WPA")
  const [hidden, setHidden] = useState(false)

  const generateWifiQR = async () => {
    if (!ssid.trim()) return
    setGenerating(true)
    try {
      // WiFi QR code format: WIFI:T:WPA;S:networkname;P:password;H:hidden;;
      const hiddenStr = hidden ? "true" : "false"
      const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hiddenStr};;`
      
      const url = await QRCode.toDataURL(wifiString, {
        width: 350,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
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
    link.download = `wifi-qr-${ssid}.png`
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Wifi className="h-4 w-4" />
              Free WiFi QR Code Generator
            </div>
            <h1 className="text-3xl font-bold mb-4 sm:text-4xl lg:text-5xl">
              WiFi QR Code Generator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Create a QR code for your WiFi network. Guests can scan and connect instantly without typing the password. 
              Perfect for homes, offices, restaurants, and hotels.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Generator Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  WiFi Network Details
                </CardTitle>
                <CardDescription>Enter your WiFi credentials to generate QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ssid">Network Name (SSID) *</Label>
                  <Input
                    id="ssid"
                    placeholder="Your WiFi network name"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="WiFi password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encryption">Security Type</Label>
                  <Select value={encryption} onValueChange={setEncryption}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">None (Open Network)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Most modern networks use WPA2 or WPA3
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hidden"
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="hidden" className="text-sm font-normal cursor-pointer">
                    Hidden network (SSID not broadcast)
                  </Label>
                </div>

                <Button 
                  onClick={generateWifiQR} 
                  className="w-full" 
                  disabled={generating || !ssid.trim()}
                  size="lg"
                >
                  {generating ? "Generating..." : "Generate WiFi QR Code"}
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Your WiFi QR Code</CardTitle>
                <CardDescription>Scan with any smartphone camera to connect</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-[350px] h-[350px] border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30 mb-4">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="WiFi QR Code" className="w-full h-full" />
                  ) : (
                    <div className="text-center text-muted-foreground p-6">
                      <Wifi className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p className="mb-2">Your WiFi QR code will appear here</p>
                      <p className="text-xs">Enter your network details and click Generate</p>
                    </div>
                  )}
                </div>
                
                {qrDataUrl && (
                  <>
                    <div className="flex gap-2 w-full mb-4">
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
                    <p className="text-sm text-muted-foreground text-center">
                      Print this QR code and display it for guests to easily connect
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* How it works */}
          <section className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              How WiFi QR Codes Work
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">1. Generate QR</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your WiFi network name and password above
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">2. Scan Code</h3>
                <p className="text-sm text-muted-foreground">
                  Guests point their phone camera at the QR code
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wifi className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">3. Connected!</h3>
                <p className="text-sm text-muted-foreground">
                  Phone automatically connects to WiFi - no typing needed
                </p>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Perfect For
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <span className="text-3xl mb-2 block">🏠</span>
                <h3 className="font-semibold mb-1">Home</h3>
                <p className="text-sm text-muted-foreground">Share with family & visitors</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <span className="text-3xl mb-2 block">🏢</span>
                <h3 className="font-semibold mb-1">Office</h3>
                <p className="text-sm text-muted-foreground">Guest WiFi for clients</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <span className="text-3xl mb-2 block">🍽️</span>
                <h3 className="font-semibold mb-1">Restaurant</h3>
                <p className="text-sm text-muted-foreground">Table tent QR codes</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <span className="text-3xl mb-2 block">🏨</span>
                <h3 className="font-semibold mb-1">Hotel/Airbnb</h3>
                <p className="text-sm text-muted-foreground">Room WiFi access</p>
              </div>
            </div>
          </section>

          {/* Security Note */}
          <section className="mt-12 max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-start gap-4 pt-6">
                <Shield className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Zero-Server Data Processing Security Guarantee</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your Wi-Fi SSID network name and security passphrases are parsed and rendered 100% locally within your client browser session using Web Canvas API primitives. Credentials are never dispatched across network sockets or saved in server logs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Deep Educational Content & Wi-Fi Protocol Technical Breakdown */}
          <section className="mt-12 max-w-4xl mx-auto space-y-8 text-muted-foreground leading-relaxed text-sm">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">How Wi-Fi QR Code Authentication Works (MECARD / WIFI Protocol)</h2>
              <p className="mb-3">
                Wi-Fi QR codes utilize a standardized structured string schema natively recognized by iOS (version 11+), Android (version 10+), and Windows devices. When a smartphone camera detects a Wi-Fi matrix code, it parses the payload parameters structured as follows:
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-xs text-foreground overflow-x-auto">
                WIFI:S:YourNetworkSSID;T:WPA;P:YourPassword;H:false;;
              </div>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li><strong>S:</strong> Network Service Set Identifier (SSID)</li>
                <li><strong>T:</strong> Security Encryption Protocol (WPA, WPA2, WPA3, WEP, or nopass)</li>
                <li><strong>P:</strong> Pre-Shared Key (PSK) or WPA Passphrase</li>
                <li><strong>H:</strong> Boolean flag indicating whether the SSID is hidden</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Best Practices for Business & Hospitality Wi-Fi Sharing</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-border p-4 rounded-lg bg-card">
                  <h3 className="font-semibold text-foreground mb-1">Separate Guest VLANs</h3>
                  <p className="text-xs">Never share primary administrative Wi-Fi networks with customers. Always configure an isolated Guest SSID to prevent unauthorized local network device discovery.</p>
                </div>
                <div className="border border-border p-4 rounded-lg bg-card">
                  <h3 className="font-semibold text-foreground mb-1">Printed Tabletop Displays</h3>
                  <p className="text-xs">Display Wi-Fi QR codes on durable acrylic stands at reception desks, hotel rooms, or cafe tables to minimize staff time spent dictating complex passwords.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">Do guests need a special app to scan the Wi-Fi QR code?</h4>
                  <p className="text-xs">No. Standard native camera applications on iPhone, iPad, Samsung, Google Pixel, and Xiaomi smartphones automatically detect Wi-Fi QR codes and prompt a one-tap &quot;Join Network&quot; dialog.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Does changing my Wi-Fi password break printed QR codes?</h4>
                  <p className="text-xs">Yes. Because static Wi-Fi QR codes encode the passphrase directly into the graphic pattern, updating your router's password requires generating and printing a new QR code.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Need other QR code types?
            </p>
            <Link
              href="/qr"
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 font-medium"
            >
              Go to Full QR Generator →
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
