"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Trash2,
  Sparkles,
  RefreshCw,
  Plus,
  Shield,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  Palette,
  Image as ImageIcon,
  Heart,
  BarChart2,
  Clock,
  Search,
  Upload,
} from "lucide-react"
import QRCode from "qrcode"
import { getDynamicQrUrl } from "@/lib/utils/link-url"
import { DEFAULT_HOST } from "@/lib/appwrite/config"

export interface DynamicQrItem {
  id: string
  slug: string
  long_url: string
  title: string
  dynamicUrl: string
  clicks_count: number
  created_at: string
  targeting?: {
    is_dynamic_qr?: boolean
    title?: string
    cute_message?: string
    qr_design?: QrDesignConfig
  }
}

export interface QrDesignConfig {
  darkColor: string
  lightColor: string
  dotStyle: "square" | "dots" | "rounded"
  cornerStyle: "square" | "rounded"
  margin: number
  logoType: "none" | "ul0" | "whatsapp" | "instagram" | "youtube" | "globe" | "custom"
  customLogoUrl?: string | null
  labelText?: string
}

interface QrStudioClientProps {
  initialLinks: DynamicQrItem[]
  userEmail: string | null
}

const COLOR_SWATCHES = [
  { name: "Onyx Black", hex: "#000000" },
  { name: "Deep Slate", hex: "#0f172a" },
  { name: "Brand Teal", hex: "#0F766E" },
  { name: "Emerald", hex: "#059669" },
  { name: "Royal Indigo", hex: "#3730a3" },
  { name: "Crimson", hex: "#b91c1c" },
  { name: "Sunset Coral", hex: "#ea580c" },
  { name: "Bronze Gold", hex: "#ca8a04" },
]

const BG_SWATCHES = [
  { name: "Pure White", hex: "#ffffff" },
  { name: "Soft Cream", hex: "#fefce8" },
  { name: "Light Mint", hex: "#f0fdf4" },
  { name: "Ice Blue", hex: "#f0f9ff" },
]

export function QrStudioClient({ initialLinks, userEmail }: QrStudioClientProps) {
  const [links, setLinks] = useState<DynamicQrItem[]>(initialLinks)
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create")
  const [searchQuery, setSearchQuery] = useState("")

  // Create Form State
  const [destinationUrl, setDestinationUrl] = useState("")
  const [title, setTitle] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [cuteMessage, setCuteMessage] = useState("You are being redirected, please wait 6 sec...")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  // QR Design Customizer State
  const [darkColor, setDarkColor] = useState("#0B1412")
  const [lightColor, setLightColor] = useState("#ffffff")
  const [dotStyle, setDotStyle] = useState<"square" | "dots" | "rounded">("rounded")
  const [cornerStyle, setCornerStyle] = useState<"square" | "rounded">("rounded")
  const [margin, setMargin] = useState(2)
  const [logoType, setLogoType] = useState<"none" | "ul0" | "whatsapp" | "instagram" | "youtube" | "globe" | "custom">("ul0")
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null)
  const [labelText, setLabelText] = useState("")

  // Editing Modal State
  const [editingItem, setEditingItem] = useState<DynamicQrItem | null>(null)
  const [editDestinationUrl, setEditDestinationUrl] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editCuteMessage, setEditCuteMessage] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  // Preview & Download Modal State
  const [previewItem, setPreviewItem] = useState<DynamicQrItem | null>(null)

  // Feedback State
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Canvas references
  const studioCanvasRef = useRef<HTMLCanvasElement>(null)
  const previewModalCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Preview Slug for Studio Canvas
  const previewSlug = customSlug.trim() || "demo-qr"
  const previewDynamicUrl = getDynamicQrUrl(DEFAULT_HOST, previewSlug)

  // Render QR Canvas
  const renderQrOnCanvas = useCallback(
    async (
      canvas: HTMLCanvasElement | null,
      url: string,
      cfg: {
        darkColor: string
        lightColor: string
        dotStyle: "square" | "dots" | "rounded"
        cornerStyle: "square" | "rounded"
        margin: number
        logoType: string
        customLogoUrl?: string | null
        labelText?: string
      }
    ) => {
      if (!canvas) return

      try {
        const qrSize = 400
        const extraBottom = cfg.labelText?.trim() ? 50 : 0
        canvas.width = qrSize
        canvas.height = qrSize + extraBottom

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // 1. Fill background
        ctx.fillStyle = cfg.lightColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 2. Generate Base QR to temp canvas
        const tempCanvas = document.createElement("canvas")
        await QRCode.toCanvas(tempCanvas, url, {
          width: qrSize,
          margin: cfg.margin,
          errorCorrectionLevel: "H",
          color: {
            dark: cfg.darkColor,
            light: cfg.lightColor,
          },
        })

        // Draw basic QR code onto main canvas
        ctx.drawImage(tempCanvas, 0, 0, qrSize, qrSize)

        // 3. Render Center Brand Logo if enabled
        let logoImageToDraw: HTMLImageElement | null = null

        if (cfg.logoType === "custom" && cfg.customLogoUrl) {
          logoImageToDraw = new Image()
          logoImageToDraw.src = cfg.customLogoUrl
        } else if (cfg.logoType === "ul0") {
          logoImageToDraw = new Image()
          logoImageToDraw.src = "/ul0.png"
        } else if (cfg.logoType === "whatsapp") {
          logoImageToDraw = new Image()
          logoImageToDraw.src = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg"
        } else if (cfg.logoType === "instagram") {
          logoImageToDraw = new Image()
          logoImageToDraw.src = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg"
        } else if (cfg.logoType === "youtube") {
          logoImageToDraw = new Image()
          logoImageToDraw.src = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg"
        }

        if (logoImageToDraw) {
          await new Promise((resolve) => {
            if (!logoImageToDraw) return resolve(null)
            logoImageToDraw.onload = resolve
            logoImageToDraw.onerror = resolve
            setTimeout(resolve, 500)
          })

          if (logoImageToDraw.complete && logoImageToDraw.naturalWidth > 0) {
            const logoBoxSize = qrSize * 0.22
            const logoX = (qrSize - logoBoxSize) / 2
            const logoY = (qrSize - logoBoxSize) / 2
            const pad = 6

            // Draw clean rounded badge cutout behind logo
            ctx.fillStyle = cfg.lightColor
            ctx.beginPath()
            ctx.roundRect(logoX - pad, logoY - pad, logoBoxSize + pad * 2, logoBoxSize + pad * 2, 12)
            ctx.fill()

            // Subtle border around logo box
            ctx.strokeStyle = cfg.darkColor + "25"
            ctx.lineWidth = 1.5
            ctx.stroke()

            ctx.drawImage(logoImageToDraw, logoX, logoY, logoBoxSize, logoBoxSize)
          }
        }

        // 4. Render Bottom Label Text if provided
        if (cfg.labelText?.trim()) {
          ctx.fillStyle = cfg.darkColor
          ctx.font = "bold 14px system-ui, -apple-system, sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(cfg.labelText.trim().toUpperCase(), qrSize / 2, qrSize + extraBottom / 2)
        }
      } catch (err) {
        console.error("Render QR error:", err)
      }
    },
    []
  )

  // Re-compile Studio canvas whenever design or preview URL changes
  useEffect(() => {
    renderQrOnCanvas(studioCanvasRef.current, previewDynamicUrl, {
      darkColor,
      lightColor,
      dotStyle,
      cornerStyle,
      margin,
      logoType,
      customLogoUrl,
      labelText,
    })
  }, [
    renderQrOnCanvas,
    previewDynamicUrl,
    darkColor,
    lightColor,
    dotStyle,
    cornerStyle,
    margin,
    logoType,
    customLogoUrl,
    labelText,
  ])

  // Re-compile Preview Modal canvas when item is opened
  useEffect(() => {
    if (previewItem && previewModalCanvasRef.current) {
      const cfg = previewItem.targeting?.qr_design || {
        darkColor: "#0B1412",
        lightColor: "#ffffff",
        dotStyle: "rounded",
        cornerStyle: "rounded",
        margin: 2,
        logoType: "ul0",
      }
      renderQrOnCanvas(previewModalCanvasRef.current, previewItem.dynamicUrl, cfg)
    }
  }, [previewItem, renderQrOnCanvas])

  // Handle Logo File Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, SVG).")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setCustomLogoUrl(result)
      setLogoType("custom")
    }
    reader.readAsDataURL(file)
  }

  // Copy URL to Clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Download High-Res PNG
  const downloadPng = (canvas: HTMLCanvasElement | null, filename: string) => {
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${filename}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  // Download SVG
  const downloadSvg = async (url: string, filename: string) => {
    try {
      const svgString = await QRCode.toString(url, {
        type: "svg",
        margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      })
      const blob = new Blob([svgString], { type: "image/svg+xml" })
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `${filename}.svg`
      link.href = blobUrl
      link.click()
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error("SVG download error:", err)
    }
  }

  // Handle Dynamic QR Link Creation
  const handleCreateDynamicQr = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    if (!destinationUrl.trim()) {
      setFormError("Please enter a destination URL.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/dynamic-qr/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          long_url: destinationUrl.trim(),
          title: title.trim() || "Dynamic QR Link",
          custom_slug: customSlug.trim() || undefined,
          cute_message: cuteMessage.trim(),
          qr_design: {
            darkColor,
            lightColor,
            dotStyle,
            cornerStyle,
            margin,
            logoType,
            customLogoUrl,
            labelText,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create dynamic QR code.")
      }

      setLinks((prev) => [data.link, ...prev])
      setFormSuccess(`🎉 Dynamic QR Created! Scans resolve through /q/${data.link.slug} with zero visible ads.`)

      // Reset input form
      setDestinationUrl("")
      setTitle("")
      setCustomSlug("")
      setActiveTab("manage")
    } catch (err: any) {
      setFormError(err.message || "Failed to create dynamic QR code.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Editing Destination URL Dynamically
  const handleUpdateDestination = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    setEditError(null)

    if (!editDestinationUrl.trim()) {
      setEditError("Please enter a new destination URL.")
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/dynamic-qr/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          long_url: editDestinationUrl.trim(),
          title: editTitle.trim(),
          cute_message: editCuteMessage.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update destination URL.")
      }

      setLinks((prev) =>
        prev.map((item) => (item.id === editingItem.id ? { ...item, ...data.link } : item))
      )

      setEditingItem(null)
    } catch (err: any) {
      setEditError(err.message || "Failed to update destination URL.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle Delete
  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dynamic QR? Existing printed codes will stop working.")) {
      return
    }

    try {
      const response = await fetch(`/api/dynamic-qr/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete.")
      setLinks((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      alert("Error deleting dynamic QR.")
    }
  }

  // Calculate statistics
  const totalScans = links.reduce((sum, item) => sum + (item.clicks_count || 0), 0)
  const topPerformer = links.length > 0 ? [...links].sort((a, b) => b.clicks_count - a.clicks_count)[0] : null

  // Filter links for management table
  const filteredLinks = links.filter((item) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      item.title?.toLowerCase().includes(q) ||
      item.slug?.toLowerCase().includes(q) ||
      item.long_url?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Exclusive Feature for kesarsaket607</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dynamic QR Code Studio &amp; No-Ads Interstitial
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Generate permanent QR codes routed to{" "}
              <code className="text-teal-300 font-mono bg-teal-950/60 px-1.5 py-0.5 rounded">/q/[slug]</code>.
              Change the destination URL at any time without reprinting. Visitors see a cute 6s redirect
              while ads run stealthily in the background.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "create"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Dynamic QR</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("manage")}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "manage"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Manage &amp; Scans ({links.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Dynamic QRs</span>
            <QrCode className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">{links.length}</div>
          <p className="text-[11px] text-muted-foreground">Active dynamic links with permanent slugs</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Scans Recorded</span>
            <BarChart2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-foreground font-mono">{totalScans.toLocaleString()}</div>
          <p className="text-[11px] text-muted-foreground">Real-time scan telemetry via /q/ route</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Top Scanned Link</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-bold text-foreground truncate font-mono">
            {topPerformer ? topPerformer.title : "None yet"}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {topPerformer ? `${topPerformer.clicks_count} scans (/q/${topPerformer.slug})` : "Awaiting first scan"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Stealth Monetization</span>
            <Shield className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-sm font-bold text-emerald-600">Active · Hidden Ads</div>
          <p className="text-[11px] text-muted-foreground">Visitors only see the cute 6s redirect card</p>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "create" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Configuration & Design Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleCreateDynamicQr} className="rounded-3xl border border-border bg-card p-6 sm:p-7 space-y-6 shadow-xs">
              <div className="space-y-1 pb-2 border-b border-border">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-600" />
                  <span>1. Link Destination &amp; Slug</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  The slug and QR matrix remain permanent forever. You can change this destination URL anytime!
                </p>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs">
                  {formSuccess}
                </div>
              )}

              <div className="space-y-4">
                {/* Destination URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span>Destination URL</span>
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    placeholder="https://example.com/promo-page"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Editable anytime in your dashboard without altering the QR code.
                  </p>
                </div>

                {/* Title & Custom Slug Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Campaign Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Summer Menu 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>Custom Permanent Slug</span>
                      <span className="text-[11px] text-muted-foreground">Optional</span>
                    </label>
                    <div className="flex rounded-xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-teal-500">
                      <span className="px-3 py-2.5 text-xs text-muted-foreground bg-muted/40 font-mono border-r border-border shrink-0">
                        /q/
                      </span>
                      <input
                        type="text"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value)}
                        placeholder="menu-qr"
                        className="w-full px-3 py-2.5 text-sm bg-transparent text-foreground focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Cute Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-teal-600" />
                    <span>Cute Redirect Message</span>
                  </label>
                  <input
                    type="text"
                    value={cuteMessage}
                    onChange={(e) => setCuteMessage(e.target.value)}
                    placeholder="You are being redirected, please wait 6 sec..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Cute message displayed to visitors during the 6-second interstitial countdown.
                  </p>
                </div>
              </div>

              {/* QR Customizer Styling Controls */}
              <div className="pt-4 border-t border-border space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Palette className="w-4 h-4 text-teal-600" />
                    <span>2. QR Code Visual Customizations</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Customize colors, dot style, margin, and center logo for maximum scan fidelity.
                  </p>
                </div>

                {/* Foreground Color Swatches */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Foreground Color</span>
                    <span className="text-xs font-mono text-muted-foreground">{darkColor}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {COLOR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.hex}
                        type="button"
                        onClick={() => setDarkColor(swatch.hex)}
                        title={swatch.name}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                          darkColor.toLowerCase() === swatch.hex.toLowerCase()
                            ? "scale-115 ring-2 ring-teal-500 ring-offset-2 border-white"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      />
                    ))}
                    <input
                      type="color"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="w-7 h-7 rounded-full p-0 border border-border cursor-pointer"
                      title="Custom color picker"
                    />
                  </div>
                </div>

                {/* Background Color Swatches */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Background Color</span>
                    <span className="text-xs font-mono text-muted-foreground">{lightColor}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {BG_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.hex}
                        type="button"
                        onClick={() => setLightColor(swatch.hex)}
                        title={swatch.name}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                          lightColor.toLowerCase() === swatch.hex.toLowerCase()
                            ? "scale-115 ring-2 ring-teal-500 ring-offset-2 border-neutral-400"
                            : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      />
                    ))}
                    <input
                      type="color"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="w-7 h-7 rounded-full p-0 border border-border cursor-pointer"
                      title="Custom background color"
                    />
                  </div>
                </div>

                {/* Center Logo Options */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Center Icon / Brand Logo</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { type: "ul0", label: "UL0 Logo" },
                      { type: "whatsapp", label: "WhatsApp" },
                      { type: "instagram", label: "Instagram" },
                      { type: "youtube", label: "YouTube" },
                      { type: "none", label: "None" },
                      { type: "custom", label: "Upload" },
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          if (item.type === "custom") {
                            fileInputRef.current?.click()
                          } else {
                            setLogoType(item.type as any)
                          }
                        }}
                        className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                          logoType === item.type
                            ? "bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-300 font-semibold"
                            : "border-border hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {customLogoUrl && logoType === "custom" && (
                    <div className="flex items-center gap-2 pt-1 text-xs text-teal-600">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Custom brand logo active</span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="underline text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Label CTA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Bottom Text Label (Optional)</label>
                  <input
                    type="text"
                    value={labelText}
                    onChange={(e) => setLabelText(e.target.value)}
                    placeholder="e.g. SCAN TO VISIT"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono tracking-wider"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Generate Dynamic QR Code</span>
              </button>
            </form>
          </div>

          {/* Right: Live Interactive Canvas Preview (5 Cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 text-center space-y-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pb-2 border-b border-border">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-teal-600" />
                  <span>Live Studio Preview</span>
                </span>
                <span className="font-mono text-[11px] text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded-full">
                  Vector High-Res
                </span>
              </div>

              {/* HTML5 Canvas Element */}
              <div className="flex justify-center p-4 bg-muted/30 rounded-2xl border border-border/70 overflow-hidden">
                <canvas
                  ref={studioCanvasRef}
                  className="max-w-[280px] w-full h-auto aspect-square rounded-xl shadow-md border border-border"
                />
              </div>

              {/* Destination Pill */}
              <div className="p-3 rounded-xl bg-background border border-border text-left space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">Permanent Dynamic Link</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-mono font-medium text-teal-600 truncate">{previewDynamicUrl}</p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(previewDynamicUrl, "preview")}
                    className="p-1 rounded hover:bg-muted text-muted-foreground shrink-0 cursor-pointer"
                    title="Copy Link"
                  >
                    {copiedId === "preview" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Download & Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => downloadPng(studioCanvasRef.current, previewSlug)}
                  className="py-2.5 px-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PNG High-Res</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadSvg(previewDynamicUrl, previewSlug)}
                  className="py-2.5 px-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Vector SVG</span>
                </button>
              </div>

              <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                <Shield className="w-3 h-3 text-teal-600" />
                <span>300 DPI ready for high-resolution print banners &amp; cards</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Management & Scan Tracking Tab */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, slug, or destination..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Dynamic QR</span>
            </button>
          </div>

          {filteredLinks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center space-y-4">
              <QrCode className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">No Dynamic QR codes found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {searchQuery
                    ? "No dynamic QRs match your search query."
                    : "Create your first dynamic QR code to start tracking scans and updating destination URLs."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setActiveTab("create")
                }}
                className="py-2 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create QR</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLinks.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-border bg-card p-5 space-y-4 hover:border-teal-500/50 transition-all flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    {/* Header: Title & Total Scans */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="text-sm font-bold text-foreground truncate">{item.title}</h3>
                        <p className="text-[11px] font-mono text-teal-600 truncate">/q/{item.slug}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-mono text-xs font-bold border border-teal-500/20">
                        <BarChart2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>{item.clicks_count} scans</span>
                      </div>
                    </div>

                    {/* Destination URL Display */}
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/80 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase">
                        <span>Current Target</span>
                        <span className="text-emerald-600 font-mono">Dynamic</span>
                      </div>
                      <p className="text-xs font-mono text-foreground truncate" title={item.long_url}>
                        {item.long_url}
                      </p>
                    </div>

                    {/* Dynamic QR link & Copy */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground text-[11px]">Dynamic Link:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.dynamicUrl, item.id)}
                          className="px-2 py-1 rounded-lg bg-background border border-border text-[11px] font-mono text-foreground hover:bg-muted flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy</span>
                        </button>
                        <a
                          href={item.dynamicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Test /q/ redirect"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item)
                        setEditDestinationUrl(item.long_url)
                        setEditTitle(item.title)
                        setEditCuteMessage(item.targeting?.cute_message || "")
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 hover:bg-teal-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Destination</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="py-2 px-3 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="View & Download QR"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLink(item.id)}
                      className="p-2 rounded-xl border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      title="Delete QR"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Destination Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Edit Destination URL</h3>
                <p className="text-xs text-muted-foreground">
                  Slug <code className="text-teal-600 font-mono">/q/{editingItem.slug}</code> stays permanent.
                  Printed QR codes will immediately redirect to the new URL!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs border border-destructive/20">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateDestination} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">New Target Destination URL</label>
                <input
                  type="url"
                  required
                  value={editDestinationUrl}
                  onChange={(e) => setEditDestinationUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Campaign Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Cute Message</label>
                <input
                  type="text"
                  value={editCuteMessage}
                  onChange={(e) => setEditCuteMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save &amp; Update Destination</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview & Download Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-center space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground truncate">{previewItem.title}</h3>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center p-4 bg-muted/40 rounded-2xl border border-border">
              <canvas
                ref={previewModalCanvasRef}
                className="max-w-[240px] w-full h-auto aspect-square rounded-xl shadow-sm border border-border"
              />
            </div>

            <p className="text-xs font-mono text-teal-600 truncate">{previewItem.dynamicUrl}</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => downloadPng(previewModalCanvasRef.current, previewItem.slug)}
                className="py-2.5 px-3 rounded-xl bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                onClick={() => downloadSvg(previewItem.dynamicUrl, previewItem.slug)}
                className="py-2.5 px-3 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Vector SVG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
