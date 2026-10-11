"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Download,
  Sparkles,
  Zap,
  Globe,
  Share2,
  RefreshCw,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from "lucide-react"
import QRCode from "qrcode"
import { toast } from "sonner"
import { getShortUrl } from "@/lib/utils/link-url"

// Popular country dialing codes
const COUNTRY_CODES = [
  { name: "India", code: "91", flag: "🇮🇳" },
  { name: "United States", code: "1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "44", flag: "🇬🇧" },
  { name: "Brazil", code: "55", flag: "🇧🇷" },
  { name: "Indonesia", code: "62", flag: "🇮🇩" },
  { name: "Spain", code: "34", flag: "🇪🇸" },
  { name: "Germany", code: "49", flag: "🇩🇪" },
  { name: "Canada", code: "1", flag: "🇨🇦" },
  { name: "Australia", code: "61", flag: "🇦🇺" },
  { name: "United Arab Emirates", code: "971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "966", flag: "🇸🇦" },
  { name: "Mexico", code: "52", flag: "🇲🇽" },
  { name: "France", code: "33", flag: "🇫🇷" },
  { name: "Italy", code: "39", flag: "🇮🇹" },
  { name: "Pakistan", code: "92", flag: "🇵🇰" },
  { name: "Bangladesh", code: "880", flag: "🇧🇩" },
  { name: "Nigeria", code: "234", flag: "🇳🇬" },
  { name: "South Africa", code: "27", flag: "🇿🇦" },
  { name: "Philippines", code: "63", flag: "🇵🇭" },
  { name: "Malaysia", code: "60", flag: "🇲🇾" },
  { name: "Singapore", code: "65", flag: "🇸🇬" },
]

// Pre-filled template presets
const PRESET_TEMPLATES = [
  {
    title: "Product Inquiry",
    text: "Hello! I saw your product on your website/Instagram and would like more details on pricing and availability.",
    icon: "🛍️",
  },
  {
    title: "Customer Support",
    text: "Hi support team, I have a question regarding my order/account. Can you please assist me?",
    icon: "💬",
  },
  {
    title: "Book Consultation",
    text: "Hi! I would like to schedule a consultation/appointment. What times are currently open?",
    icon: "📅",
  },
  {
    title: "Price Quotation",
    text: "Hi! Could you please share a quotation for your services? Here is what I am looking for:",
    icon: "🏷️",
  },
  {
    title: "General Greeting",
    text: "Hi there! I found your profile online and wanted to connect with you.",
    icon: "👋",
  },
]

export default function WhatsAppLinkGeneratorPage() {
  const [countryCode, setCountryCode] = useState("91")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [customSlug, setCustomSlug] = useState("")

  // Output state
  const [copiedRaw, setCopiedRaw] = useState(false)
  const [copiedShort, setCopiedShort] = useState(false)
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [shortening, setShortening] = useState(false)
  const [shortenError, setShortenError] = useState<string | null>(null)

  // QR state
  const [qrColor, setQrColor] = useState<"whatsapp" | "teal" | "dark">("whatsapp")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Clean phone number: digits only, strip leading zeros
  const cleanPhone = useMemo(() => {
    return phoneNumber.replace(/\D/g, "").replace(/^0+/, "")
  }, [phoneNumber])

  // Generated raw WhatsApp link
  const rawWaLink = useMemo(() => {
    if (!cleanPhone) return ""
    const fullNumber = `${countryCode}${cleanPhone}`
    const encodedText = message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""
    return `https://wa.me/${fullNumber}${encodedText}`
  }, [countryCode, cleanPhone, message])

  // Active target URL for QR and preview (either shortened URL or raw wa.me)
  const activeUrl = shortUrl || rawWaLink

  // Re-generate QR Code when active URL or color theme changes
  useEffect(() => {
    if (!activeUrl || !canvasRef.current) return

    let darkHex = "#25D366" // WhatsApp Green
    if (qrColor === "teal") darkHex = "#1FA087"
    if (qrColor === "dark") darkHex = "#0B1412"

    QRCode.toCanvas(
      canvasRef.current,
      activeUrl,
      {
        width: 240,
        margin: 2,
        color: {
          dark: darkHex,
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      },
      (err) => {
        if (err) console.error("QR Code Error:", err)
      }
    )
  }, [activeUrl, qrColor])

  // Reset shortened link when phone or message inputs change
  useEffect(() => {
    setShortUrl(null)
    setShortenError(null)
  }, [countryCode, cleanPhone, message])

  // Copy raw wa.me link
  const handleCopyRaw = () => {
    if (!rawWaLink) return
    navigator.clipboard.writeText(rawWaLink)
    setCopiedRaw(true)
    toast.success("WhatsApp link copied!", { description: rawWaLink })
    setTimeout(() => setCopiedRaw(false), 2000)
  }

  // Copy shortened link
  const handleCopyShort = () => {
    if (!shortUrl) return
    navigator.clipboard.writeText(shortUrl)
    setCopiedShort(true)
    toast.success("Short URL copied!", { description: shortUrl })
    setTimeout(() => setCopiedShort(false), 2000)
  }

  // Test link in WhatsApp
  const handleTestLink = () => {
    if (!rawWaLink) return
    window.open(rawWaLink, "_blank", "noopener,noreferrer")
  }

  // Create UL0 short link with tracking
  const handleCreateShortLink = async () => {
    if (!rawWaLink) return
    setShortening(true)
    setShortenError(null)

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          longUrl: rawWaLink,
          customSlug: customSlug.trim() ? customSlug.trim().toLowerCase() : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setShortenError(data.error || "Failed to generate short link")
        toast.error(data.error || "Failed to shorten WhatsApp link")
        return
      }

      const canonicalShort = getShortUrl("ul0.site", data.slug)
      setShortUrl(canonicalShort)
      toast.success("Trackable WhatsApp Short Link Created!", {
        description: canonicalShort,
      })
    } catch {
      setShortenError("Network error. Please try again.")
      toast.error("Network error while creating short link.")
    } finally {
      setShortening(false)
    }
  }

  // Download high-resolution PNG QR Code
  const handleDownloadQr = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.download = `whatsapp-qr-${countryCode}${cleanPhone || "link"}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
    toast.success("QR Code downloaded as PNG!")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-border">
          {/* Ambient Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[400px] pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-1/3 w-[350px] h-[350px] bg-emerald-500/15 rounded-full blur-[120px]" />
            <div className="absolute top-[10%] right-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp Click-to-Chat Studio · 100% Free</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Free WhatsApp Link &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-primary">
                QR Code Generator
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Generate instant <code className="text-emerald-500 font-mono">wa.me</code> click-to-chat links with pre-filled messages. Compress into trackable short URLs and download dynamic vector QR codes for Instagram bios, printed flyers, and ads.
            </p>
          </div>
        </section>

        {/* Generator Workspace */}
        <section className="py-10 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 items-start">
              {/* Left Column: Form Configuration (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl border border-border bg-surface-2 p-5 sm:p-7 shadow-2xs space-y-6">
                  {/* Step 1: Phone Number & Country Code */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      <span>1. Phone Number &amp; Country</span>
                      <span className="text-[11px] font-normal lowercase text-muted-foreground">
                        digits only, no spaces
                      </span>
                    </label>

                    <div className="flex rounded-xl border border-border bg-surface-1 overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-colors">
                      {/* Country code selector */}
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-surface-3 px-3 py-3 text-xs sm:text-sm font-semibold border-r border-border outline-none cursor-pointer text-foreground max-w-[130px]"
                        aria-label="Country Code"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={`${c.code}-${c.name}`} value={c.code}>
                            {c.flag} +{c.code} ({c.name})
                          </option>
                        ))}
                      </select>

                      {/* Phone number input */}
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="9876543210 (without leading 0)"
                        className="w-full bg-transparent px-3.5 py-3 text-sm sm:text-base font-mono outline-none text-foreground placeholder:text-muted-foreground/40"
                      />
                    </div>

                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <span>
                        Recipient will receive message at:{" "}
                        <strong className="text-foreground font-mono">
                          +{countryCode} {cleanPhone || "..."}
                        </strong>
                      </span>
                    </p>
                  </div>

                  {/* Step 2: Pre-filled Message */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        2. Pre-filled Custom Message
                      </label>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {message.length} chars
                      </span>
                    </div>

                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi! I saw your post and want to know more about..."
                      className="w-full rounded-xl border border-border bg-surface-1 p-3.5 text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-foreground placeholder:text-muted-foreground/40 resize-y"
                    />

                    {/* Preset template chips */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Quick Template Starters:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {PRESET_TEMPLATES.map((tpl) => (
                          <button
                            key={tpl.title}
                            type="button"
                            onClick={() => setMessage(tpl.text)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-border bg-surface-1 hover:bg-surface-3 hover:border-emerald-500/40 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                          >
                            <span>{tpl.icon}</span>
                            <span>{tpl.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Optional Custom Alias */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      <span>3. Custom Short Link Alias (Optional)</span>
                      <span className="text-[11px] font-normal lowercase text-muted-foreground">
                        for ul0.site/r/...
                      </span>
                    </label>

                    <div className="flex rounded-xl border border-border bg-surface-1 overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
                      <span className="bg-surface-3 px-3 py-2.5 text-xs font-mono text-muted-foreground border-r border-border select-none whitespace-nowrap">
                        ul0.site/r/
                      </span>
                      <input
                        type="text"
                        value={customSlug}
                        onChange={(e) =>
                          setCustomSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, "")
                          )
                        }
                        placeholder="chat-with-me"
                        maxLength={40}
                        className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm font-mono outline-none text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Conversion Tips Box */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 font-bold text-emerald-500">
                    <Sparkles className="h-4 w-4" />
                    <span>Pro Growth Tip for Bio Links:</span>
                  </div>
                  <p className="leading-relaxed">
                    Raw <code className="text-emerald-500 font-mono">wa.me</code> links expose your private phone number on public profiles. Shortening through UL0 hides your phone number, prevents bot scrapers, and tracks the exact count of clicks from Instagram and TikTok.
                  </p>
                </div>
              </div>

              {/* Right Column: Output & Live Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-border bg-surface-2 p-5 sm:p-7 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Zap className="h-4 w-4 text-emerald-500" />
                      <span>Generated Link &amp; QR</span>
                    </h3>
                    {rawWaLink && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                        Ready to Share
                      </span>
                    )}
                  </div>

                  {rawWaLink ? (
                    <div className="space-y-5">
                      {/* Raw wa.me Display */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Direct WhatsApp Click Link:
                        </span>
                        <div className="p-3 rounded-xl border border-border bg-surface-1 font-mono text-xs text-emerald-500 break-all select-all">
                          {rawWaLink}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleCopyRaw}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-1 hover:bg-surface-3 text-xs font-bold py-2.5 transition-colors cursor-pointer text-foreground"
                          >
                            {copiedRaw ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy wa.me</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={handleTestLink}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 transition-all shadow-md cursor-pointer"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Test Chat</span>
                          </button>
                        </div>
                      </div>

                      {/* UL0 Short Link Converter */}
                      <div className="space-y-2 pt-2 border-t border-border">
                        <span className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                          <span>Trackable Branded Short URL:</span>
                          <span className="text-[10px] text-primary font-bold">With Analytics</span>
                        </span>

                        {shortUrl ? (
                          <div className="space-y-2">
                            <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 font-mono text-xs font-bold text-primary break-all select-all flex items-center justify-between gap-2">
                              <span>{shortUrl}</span>
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyShort}
                              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2.5 transition-all shadow-md cursor-pointer"
                            >
                              {copiedShort ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Copied Short Link!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy Trackable Link</span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleCreateShortLink}
                            disabled={shortening}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2.5 transition-all cursor-pointer shadow-xs"
                          >
                            {shortening ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Zap className="h-3.5 w-3.5" />
                            )}
                            <span>Create Short Link (ul0.site/r/...)</span>
                          </button>
                        )}

                        {shortenError && (
                          <p className="text-xs text-red-500">{shortenError}</p>
                        )}
                      </div>

                      {/* Live Vector QR Code Studio */}
                      <div className="space-y-3 pt-2 border-t border-border text-center">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground">
                            Printable Vector QR Code:
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setQrColor("whatsapp")}
                              className={`h-4 w-4 rounded-full bg-[#25D366] transition-transform ${
                                qrColor === "whatsapp" ? "scale-125 ring-2 ring-emerald-500" : ""
                              }`}
                              title="WhatsApp Green"
                            />
                            <button
                              type="button"
                              onClick={() => setQrColor("teal")}
                              className={`h-4 w-4 rounded-full bg-[#1FA087] transition-transform ${
                                qrColor === "teal" ? "scale-125 ring-2 ring-teal-500" : ""
                              }`}
                              title="UL0 Teal"
                            />
                            <button
                              type="button"
                              onClick={() => setQrColor("dark")}
                              className={`h-4 w-4 rounded-full bg-[#0B1412] transition-transform ${
                                qrColor === "dark" ? "scale-125 ring-2 ring-gray-600" : ""
                              }`}
                              title="Dark Charcoal"
                            />
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-border inline-block shadow-inner">
                          <canvas ref={canvasRef} className="mx-auto block rounded-lg" />
                        </div>

                        <button
                          type="button"
                          onClick={handleDownloadQr}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-1 hover:bg-surface-3 text-xs font-semibold py-2.5 transition-colors cursor-pointer text-foreground"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download High-Res QR (PNG)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-2">
                      <div className="h-12 w-12 rounded-2xl bg-surface-3 text-muted-foreground flex items-center justify-center mx-auto">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">Awaiting Phone Number</h4>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Type your phone number on the left to see the instant live link and printable QR code.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Informational SEO Guide Section */}
        <section className="py-14 sm:py-20 border-t border-border bg-surface-2/40">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-semibold text-emerald-500 uppercase tracking-wider">
                Usage Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                How WhatsApp Click-to-Chat Works
              </h2>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface-1 p-6 space-y-2">
                <div className="font-mono text-xl font-black text-emerald-500">01</div>
                <h3 className="font-bold text-sm text-foreground">No Contact Saving Needed</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  WhatsApp&apos;s native click-to-chat protocol lets users start conversations without having to manually add your phone number to their address book first.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface-1 p-6 space-y-2">
                <div className="font-mono text-xl font-black text-emerald-500">02</div>
                <h3 className="font-bold text-sm text-foreground">Pre-loaded Conversation Context</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your custom message automatically populates the user&apos;s chat input. They just tap Send, eliminating customer friction and hesitation.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface-1 p-6 space-y-2">
                <div className="font-mono text-xl font-black text-emerald-500">03</div>
                <h3 className="font-bold text-sm text-foreground">Full Attribution Tracking</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By shortening with UL0, you can see which Instagram story, billboard QR scan, or email campaign generated the conversation.
                </p>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4 pt-6">
              <h3 className="text-lg font-bold text-foreground text-center">
                Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {[
                  {
                    q: "What is a wa.me link?",
                    a: "wa.me is WhatsApp's official URL short link provided by Meta. It allows people to open a chat directly with a specified phone number without saving it in their contact list.",
                  },
                  {
                    q: "Do I need to include the '+' or '0' in the phone number?",
                    a: "No. Our tool automatically formats your phone number in full international E.164 format without any plus signs, brackets, spaces, or leading zeros.",
                  },
                  {
                    q: "Why should I shorten my WhatsApp link with UL0?",
                    a: "A raw wa.me link displays your full private phone number in plain text. Shortening with UL0 protects your phone number from spam scrapers, creates a cleaner link for social bios, and gives you real-time click and geo analytics.",
                  },
                  {
                    q: "Can I use the WhatsApp QR code on physical menus and posters?",
                    a: "Yes! The downloaded high-resolution PNG QR code is ideal for restaurant menus, shop windows, packaging stickers, and event banners.",
                  },
                ].map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-2xl border border-border bg-surface-1 p-4 sm:p-5 transition-all [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="text-xs sm:text-sm font-bold text-foreground cursor-pointer flex items-center justify-between select-none">
                      <span>{faq.q}</span>
                      <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-lg bg-surface-3 text-muted-foreground transition-transform group-open:rotate-45 shrink-0 text-base">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pr-6">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
