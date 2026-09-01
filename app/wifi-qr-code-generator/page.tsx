"use client"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wifi, Download, Copy, Check, Eye, EyeOff, ShieldCheck, Printer, Sparkles } from "lucide-react"
import QRCode from "qrcode"
import Link from "next/link"

export default function CanonicalWifiQrGeneratorPage() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Form states
  const [ssid, setSsid] = useState("")
  const [password, setPassword] = useState("")
  const [encryption, setEncryption] = useState("WPA")
  const [hidden, setHidden] = useState(false)

  const generateWifiQR = async () => {
    if (!ssid.trim()) {
      setQrDataUrl("")
      return
    }

    try {
      const hiddenStr = hidden ? "true" : "false"
      const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hiddenStr};;`
      const canvas = canvasRef.current

      if (canvas) {
        await QRCode.toCanvas(canvas, wifiString, {
          width: 320,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
          errorCorrectionLevel: "H",
        })
        setQrDataUrl(canvas.toDataURL("image/png"))
      }
    } catch (err) {
      console.error("[WiFi QR Error]:", err)
    }
  }

  useEffect(() => {
    generateWifiQR()
  }, [ssid, password, encryption, hidden])

  const downloadQR = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.download = `wifi-qr-${ssid || "network"}.png`
    link.href = qrDataUrl
    link.click()
  }

  const printCard = () => {
    window.print()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              <Wifi className="h-4 w-4" />
              Instant Scan-to-Connect QR Codes
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Free WiFi QR Code Generator
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
              Create a scannable WiFi QR code for your home, Airbnb, cafe, hotel, or office. Guests can scan with their smartphone camera to connect instantly without typing passwords.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Form Details */}
            <div className="lg:col-span-7 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Network Information</CardTitle>
                  <CardDescription className="text-xs">Enter your wireless network credentials.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ssid" className="text-xs font-semibold">
                      Network Name (SSID) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="ssid"
                      placeholder="e.g. Blue_Bottle_Guest or BeachHouse_WiFi"
                      value={ssid}
                      onChange={(e) => setSsid(e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-xs font-semibold">
                      WiFi Password
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Network password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 pt-1">
                    <div>
                      <Label className="text-xs font-semibold">Security Encryption</Label>
                      <Select value={encryption} onValueChange={setEncryption}>
                        <SelectTrigger className="mt-1 text-sm">
                          <SelectValue placeholder="Encryption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA / WPA2 / WPA3 (Standard)</SelectItem>
                          <SelectItem value="WEP">WEP (Legacy)</SelectItem>
                          <SelectItem value="nopass">None (Open Network)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="hidden"
                        checked={hidden}
                        onChange={(e) => setHidden(e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <Label htmlFor="hidden" className="text-xs font-medium cursor-pointer">
                        Hidden Network SSID
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Use Case Tips */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs text-muted-foreground">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h4 className="font-semibold text-foreground mb-1">Airbnb &amp; Rental Hosts</h4>
                  <p>Print a frameable WiFi card for your guest bedroom or refrigerator to eliminate guest check-in friction.</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h4 className="font-semibold text-foreground mb-1">Cafes &amp; Restaurants</h4>
                  <p>Place QR tent cards on customer tables so patrons can join guest WiFi without asking staff for passwords.</p>
                </div>
              </div>
            </div>

            {/* Print & Download Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <Card className="w-full text-center p-6 bg-card border-border shadow-lg">
                <CardTitle className="text-base mb-1">WiFi QR Card</CardTitle>
                <CardDescription className="text-xs mb-6">Scan with iOS Camera or Android</CardDescription>

                <div className="mx-auto p-4 rounded-2xl bg-white border border-border shadow-sm inline-block">
                  <canvas ref={canvasRef} className="mx-auto" />
                  {ssid && (
                    <div className="mt-2 text-center text-zinc-900 font-bold text-xs">
                      SSID: {ssid}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-2.5">
                  <Button onClick={downloadQR} disabled={!qrDataUrl} className="w-full gap-2 font-semibold h-11">
                    <Download className="h-4 w-4" /> Download Printable PNG
                  </Button>
                  <Button variant="outline" onClick={printCard} disabled={!qrDataUrl} className="w-full gap-2 text-xs h-9">
                    <Printer className="h-4 w-4" /> Print Frame Card
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Passwords are never sent to any server</span>
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
