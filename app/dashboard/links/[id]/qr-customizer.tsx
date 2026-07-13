"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Download, Upload, Trash2, Check, Copy, Palette, Type } from "lucide-react"
import QRCode from "qrcode"

interface QrCustomizerProps {
  shortUrl: string
  slug: string
}

export function QrCustomizer({ shortUrl, slug }: QrCustomizerProps) {
  // Styling settings
  const [darkColor, setDarkColor] = useState("#000000")
  const [lightColor, setLightColor] = useState("#ffffff")
  const [logoSrc, setLogoSrc] = useState<string | null>(null)
  const [logoName, setLogoName] = useState<string | null>(null)
  const [labelText, setLabelText] = useState("")
  const [labelColor, setLabelColor] = useState("#000000")

  // Output/UI states
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [copied, setCopied] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-compile the custom styled QR code whenever styling parameters change
  useEffect(() => {
    const compileCustomQR = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      try {
        const qrSize = 350
        const extraBottomPadding = labelText.trim() ? 50 : 0
        const canvasWidth = qrSize
        const canvasHeight = qrSize + extraBottomPadding

        // Set dimensions
        canvas.width = canvasWidth
        canvas.height = canvasHeight

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // 1. Fill background color
        ctx.fillStyle = lightColor
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // 2. Render temporary base QR code to hidden canvas
        const tempCanvas = document.createElement("canvas")
        await QRCode.toCanvas(tempCanvas, shortUrl, {
          width: qrSize,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: darkColor,
            light: lightColor,
          },
        })

        // 3. Draw base QR code onto our target canvas
        ctx.drawImage(tempCanvas, 0, 0, qrSize, qrSize)

        // 4. Overlap custom brand logo if uploaded
        if (logoSrc) {
          const logoImg = new Image()
          logoImg.src = logoSrc
          await new Promise((resolve) => {
            logoImg.onload = resolve
            logoImg.onerror = resolve
          })

          if (logoImg.complete && logoImg.naturalWidth > 0) {
            const logoSize = qrSize * 0.20
            const x = (qrSize - logoSize) / 2
            const y = (qrSize - logoSize) / 2

            // Draw clean rounded white border card behind the logo
            ctx.fillStyle = lightColor
            ctx.beginPath()
            const padding = 6
            ctx.roundRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2, 6)
            ctx.fill()

            // Draw logo image
            ctx.drawImage(logoImg, x, y, logoSize, logoSize)
          }
        } else {
          // Draw standard favicon fallback if no custom logo is uploaded
          const defaultLogo = new Image()
          defaultLogo.src = "/favicon.png"
          await new Promise((resolve) => {
            defaultLogo.onload = resolve
            defaultLogo.onerror = resolve
          })

          if (defaultLogo.complete && defaultLogo.naturalWidth > 0) {
            const logoSize = qrSize * 0.18
            const x = (qrSize - logoSize) / 2
            const y = (qrSize - logoSize) / 2

            ctx.fillStyle = lightColor
            ctx.beginPath()
            const padding = 5
            ctx.roundRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2, 5)
            ctx.fill()

            ctx.drawImage(defaultLogo, x, y, logoSize, logoSize)
          }
        }

        // 5. Draw footer text if configured
        if (labelText.trim()) {
          ctx.fillStyle = labelColor
          ctx.font = "bold 14px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(labelText.trim(), canvasWidth / 2, qrSize + 22)
        }

        setQrDataUrl(canvas.toDataURL("image/png"))
      } catch (err) {
        console.error("QR Customizer compilation error:", err)
      }
    }

    compileCustomQR()
  }, [shortUrl, darkColor, lightColor, logoSrc, labelText, labelColor])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogoSrc(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoSrc(null)
    setLogoName(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.download = `branded-qr-${slug}.png`
    link.href = qrDataUrl
    link.click()
  }

  const handleCopy = async () => {
    if (!qrDataUrl) return
    try {
      const blob = await fetch(qrDataUrl).then((r) => r.blob())
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          Brand QR Studio
        </CardTitle>
        <CardDescription>
          Design custom colored QR codes with uploaded logos and labels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Layout Split: Preview vs Settings */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side: Real-time Live Preview */}
          <div className="flex flex-col items-center gap-3 shrink-0 self-center">
            {qrDataUrl ? (
              <div className="relative bg-white p-3 rounded-2xl border border-border shadow-xs">
                <img
                  src={qrDataUrl}
                  alt="Branded QR Preview"
                  className="w-[200px] h-auto object-contain max-w-[200px] block"
                />
              </div>
            ) : (
              <div className="w-[200px] h-[200px] bg-muted/30 border border-dashed rounded-2xl flex items-center justify-center">
                <QrCode className="h-10 w-10 text-muted-foreground/30 animate-pulse" />
              </div>
            )}
            <div className="flex gap-2 w-full max-w-[200px]">
              <Button onClick={handleDownload} className="flex-1 text-xs gap-1 h-8 px-2.5">
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
              <Button onClick={handleCopy} variant="outline" className="flex-1 text-xs gap-1 h-8 px-2.5">
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Right Side: Visual Customizers */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="palette" className="space-y-4">
              <TabsList className="grid grid-cols-3 h-9">
                <TabsTrigger value="palette" className="text-xs gap-1.5 py-1">
                  <Palette className="h-3.5 w-3.5" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="logo" className="text-xs gap-1.5 py-1">
                  <Upload className="h-3.5 w-3.5" />
                  Logo
                </TabsTrigger>
                <TabsTrigger value="text" className="text-xs gap-1.5 py-1">
                  <Type className="h-3.5 w-3.5" />
                  Text
                </TabsTrigger>
              </TabsList>

              {/* Colors Styling */}
              <TabsContent value="palette" className="space-y-4 m-0">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="dark-color" className="text-xs">QR Blocks</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        id="dark-color"
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="h-8 w-10 p-0 border cursor-pointer"
                      />
                      <span className="font-mono text-xs uppercase">{darkColor}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="light-color" className="text-xs">Background</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        id="light-color"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="h-8 w-10 p-0 border cursor-pointer"
                      />
                      <span className="font-mono text-xs uppercase">{lightColor}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Brand Logo Upload */}
              <TabsContent value="logo" className="space-y-4 m-0">
                <div className="space-y-2">
                  <Label className="text-xs">Upload Center Brand Logo</Label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5 text-xs h-8"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Choose Image
                    </Button>
                    {logoSrc && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleRemoveLogo}
                        className="gap-1.5 text-xs h-8"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    )}
                  </div>
                  {logoName && (
                    <p className="text-[10px] text-muted-foreground truncate max-w-xs">
                      Selected: {logoName}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                    Upload a high contrast square logo. Standard error correction (30% restoration data) will keep the QR readable.
                  </p>
                </div>
              </TabsContent>

              {/* Bottom Label Text */}
              <TabsContent value="text" className="space-y-4 m-0">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="label-text" className="text-xs">Footer Text</Label>
                    <Input
                      id="label-text"
                      placeholder="e.g. SCAN ME, VISIT SITE"
                      value={labelText}
                      onChange={(e) => setLabelText(e.target.value)}
                      maxLength={24}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="label-color" className="text-xs">Text Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        id="label-color"
                        value={labelColor}
                        onChange={(e) => setLabelColor(e.target.value)}
                        className="h-8 w-10 p-0 border cursor-pointer"
                      />
                      <span className="font-mono text-xs uppercase">{labelColor}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
