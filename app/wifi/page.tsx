"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UL0Icon } from "@/components/ul0-icon"
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
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-surface-3 text-primary px-4 py-1.5 rounded-full text-xs font-semibold mb-2 border border-primary/20">
              <UL0Icon name="wifi" animated={true} size={15} />
              <span>Free WiFi QR Code Generator</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 sm:text-4xl lg:text-5xl text-foreground">
              WiFi QR Code Generator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Create a QR code for your WiFi network. Guests can scan and connect instantly without typing the password. 
              Perfect for homes, offices, restaurants, and hotels.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Generator Form */}
            <Card className="rounded-3xl border-border bg-card shadow-2xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <UL0Icon name="wifi" size={18} />
                  WiFi Network Details
                </CardTitle>
                <CardDescription className="text-xs">Enter your WiFi credentials to generate QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ssid" className="text-xs font-semibold">Network Name (SSID) *</Label>
                  <Input
                    id="ssid"
                    placeholder="Your WiFi network name"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    className="rounded-xl h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="WiFi password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl h-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <UL0Icon name={showPassword ? "eyeoff" : "eye"} size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encryption" className="text-xs font-semibold">Security Type</Label>
                  <Select value={encryption} onValueChange={setEncryption}>
                    <SelectTrigger className="rounded-xl h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">None (Open Network)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Most modern networks use WPA2 or WPA3
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hidden"
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor="hidden" className="text-xs text-muted-foreground cursor-pointer">
                    Hidden network (SSID not broadcast)
                  </Label>
                </div>

                <Button 
                  onClick={generateWifiQR} 
                  className="w-full rounded-full bg-primary text-primary-foreground hover:opacity-90 font-semibold mt-2" 
                  disabled={generating || !ssid.trim()}
                  size="lg"
                >
                  <UL0Icon name="qr" size={16} />
                  <span>{generating ? "Generating..." : "Generate WiFi QR"}</span>
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="rounded-3xl border-border bg-card shadow-2xs">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Your WiFi QR Code</CardTitle>
                <CardDescription className="text-xs">Scan with any smartphone camera to connect</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-[320px] h-[320px] border border-border rounded-2xl flex items-center justify-center bg-surface-2 mb-4 p-4">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="WiFi QR Code" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className="text-center text-muted-foreground p-6 space-y-2">
                      <div className="flex justify-center opacity-60">
                        <UL0Icon name="wifi" size={48} />
                      </div>
                      <p className="font-semibold text-sm">Your WiFi QR code will appear here</p>
                      <p className="text-xs">Enter your network details and click Generate</p>
                    </div>
                  )}
                </div>
                
                {qrDataUrl && (
                  <>
                    <div className="flex gap-2 w-full mb-4">
                      <Button onClick={downloadQR} className="flex-1 rounded-full bg-primary text-primary-foreground hover:opacity-90">
                        <UL0Icon name="download" size={14} />
                        <span>Download PNG</span>
                      </Button>
                      <Button onClick={copyQR} variant="outline" className="flex-1 rounded-full">
                        {copied ? (
                          <>
                            <UL0Icon name="check" size={14} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <UL0Icon name="copy" size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Print this QR code and display it for guests to easily connect
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* How it works */}
          <section className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
              How WiFi QR Codes Work
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center p-6 rounded-2xl bg-surface-2/60 border border-border/80">
                <div className="w-12 h-12 bg-surface-3 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UL0Icon name="qr" size={24} />
                </div>
                <h3 className="font-semibold mb-1 text-sm text-foreground">1. Generate QR</h3>
                <p className="text-xs text-muted-foreground">
                  Enter your WiFi network name and password above
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-surface-2/60 border border-border/80">
                <div className="w-12 h-12 bg-surface-3 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UL0Icon name="mobile" size={24} />
                </div>
                <h3 className="font-semibold mb-1 text-sm text-foreground">2. Scan Code</h3>
                <p className="text-xs text-muted-foreground">
                  Guests point their phone camera at the QR code
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-surface-2/60 border border-border/80">
                <div className="w-12 h-12 bg-surface-3 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UL0Icon name="wifi" size={24} />
                </div>
                <h3 className="font-semibold mb-1 text-sm text-foreground">3. Connected!</h3>
                <p className="text-xs text-muted-foreground">
                  Phone automatically connects to WiFi - no typing needed
                </p>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
              Perfect For
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-5 bg-card border border-border rounded-2xl text-center flex flex-col items-center gap-2">
                <UL0Icon name="home" size={24} />
                <h3 className="font-semibold text-sm text-foreground">Home</h3>
                <p className="text-xs text-muted-foreground">Share with family &amp; visitors</p>
              </div>
              <div className="p-5 bg-card border border-border rounded-2xl text-center flex flex-col items-center gap-2">
                <UL0Icon name="domain" size={24} />
                <h3 className="font-semibold text-sm text-foreground">Office</h3>
                <p className="text-xs text-muted-foreground">Guest WiFi for clients</p>
              </div>
              <div className="p-5 bg-card border border-border rounded-2xl text-center flex flex-col items-center gap-2">
                <UL0Icon name="cart" size={24} />
                <h3 className="font-semibold text-sm text-foreground">Restaurant</h3>
                <p className="text-xs text-muted-foreground">Table tent QR codes</p>
              </div>
              <div className="p-5 bg-card border border-border rounded-2xl text-center flex flex-col items-center gap-2">
                <UL0Icon name="domain" size={24} />
                <h3 className="font-semibold text-sm text-foreground">Hotel/Airbnb</h3>
                <p className="text-xs text-muted-foreground">Room WiFi access</p>
              </div>
            </div>
          </section>

          {/* Security Note */}
          <section className="mt-12 max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-surface-3/50 rounded-3xl">
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="shrink-0">
                  <UL0Icon name="shield" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-1">Zero-Server Data Processing Security Guarantee</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
          <section className="mt-12 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 p-6 text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">Hosting a Digital Menu, Guest Portal, or Airbnb Guide?</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-4">
              Pair your WiFi code with a branded short link for your digital menu or guest portal. Shorten links and connect custom domains on ul0 — 100% free with instant click tracking.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="sm">
                <a href="/">Shorten Link Free</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/qr">Full QR Generator &rarr;</a>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <a href="/custom-domain-landing">Free Custom Domains &rarr;</a>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
