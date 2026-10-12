"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Trash2,
  RefreshCw,
  Plus,
  Search,
  X,
  Monitor,
  Smartphone,
  Tablet,
  BarChart3,
  Wand2,
  Image as ImageIcon,
  Sparkles,
  Link2,
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
  dotStyle: "square" | "dots" | "rounded" | "classy" | "diamond"
  cornerStyle: "square" | "rounded" | "circle" | "leaf"
  margin: number
  logoType: "none" | "ul0" | "custom"
  customLogoUrl?: string | null
  removeBg?: boolean
  labelText?: string
}

interface ClickItem {
  $id?: string
  link_id?: string
  clicked_at?: string | null
  device_type?: string | null
  device?: string | null
  browser?: string | null
  os?: string | null
  country?: string | null
  qr_scan?: boolean | null
}

interface QrStudioClientProps {
  initialLinks: DynamicQrItem[]
  initialClicks?: ClickItem[]
  userEmail: string | null
}

// Curated colors
const PALETTE = [
  "#000000", "#18181b", "#0f766e", "#0369a1",
  "#4338ca", "#b91c1c", "#c2410c", "#854d0e",
]

const BG_PALETTE = ["#ffffff", "#fafafa", "#fefce8", "#f0fdf4", "#f0f9ff"]

const DOT_STYLES: { value: "square" | "dots" | "rounded" | "classy" | "diamond"; label: string }[] = [
  { value: "rounded", label: "Smooth" },
  { value: "dots", label: "Dots" },
  { value: "square", label: "Square" },
  { value: "classy", label: "Classy" },
  { value: "diamond", label: "Diamond" },
]

const CORNER_STYLES: { value: "square" | "rounded" | "circle" | "leaf"; label: string }[] = [
  { value: "rounded", label: "Squircle" },
  { value: "circle", label: "Circle" },
  { value: "leaf", label: "Leaf" },
  { value: "square", label: "Sharp" },
]

// SVGs extracted from docs/browser icons.txt
function BraveIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M15.68 0l2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633-1.38.972-3.884 2.66-4.293 2.916-.409.256-.92.692-1.38.692-.46 0-.97-.436-1.38-.692a185.796 185.796 0 01-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633-.247-.975-2.351-8.955-2.351-8.955l.715-2.047-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36zm-3.679 14.936c-.14 0-1.038.317-1.758.69-.72.373-1.242.637-1.409.742-.167.104-.065.301.087.409.152.107 2.194 1.69 2.393 1.866.198.175.489.464.687.464.198 0 .49-.29.688-.464.198-.175 2.24-1.759 2.392-1.866.152-.108.254-.305.087-.41-.167-.104-.689-.368-1.41-.741-.72-.373-1.617-.69-1.757-.69z"
        fill="#FB542B"
      />
    </svg>
  )
}

function ChromeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32">
      <path fill="#00ac47" d="M4.7434,22.505A12.9769,12.9769,0,0,0,14.88,28.949l5.8848-10.1927L16,16.0058,11.2385,18.755l-1.5875-2.75L8.4885,13.9919,5.3553,8.5649A12.9894,12.9894,0,0,0,4.7434,22.505Z" />
      <path fill="#ea4435" d="M16,3.0072A12.9769,12.9769,0,0,0,5.3507,8.5636l5.8848,10.1927L16,16.0057V10.5072H27.766A12.99,12.99,0,0,0,16,3.0072Z" />
      <path fill="#ffba00" d="M27.2557,22.505a12.9772,12.9772,0,0,0,.5124-12H15.9986v5.5011l4.7619,2.7492-1.5875,2.75-1.1625,2.0135-3.1333,5.4269A12.99,12.99,0,0,0,27.2557,22.505Z" />
      <circle cx="15.999" cy="16.007" r="5.5" fill="#fff" />
      <circle cx="15.999" cy="16.007" r="4.25" fill="#4285f4" />
    </svg>
  )
}

function EdgeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512">
      <radialGradient id="edge-a" cx=".6" cy=".5"><stop offset=".8" stopColor="#114488" /><stop offset="1" stopColor="#113377" /></radialGradient>
      <radialGradient id="edge-b" cx=".5" cy=".6" fx=".2" fy=".6"><stop offset=".8" stopColor="#3388cc" /><stop offset="1" stopColor="#226699" /></radialGradient>
      <linearGradient id="edge-c" y1=".5" y2="1"><stop offset=".1" stopColor="#55aadd" /><stop offset=".6" stopColor="#55cc88" /><stop offset=".8" stopColor="#77dd55" /></linearGradient>
      <path fill="url(#edge-a)" d="M439 374c-50 77-131 98-163 96-191-9-162-262-47-261-82 52 30 224 195 157 17-12 20 3 15 8" />
      <path fill="url(#edge-b)" d="M311 255c18-82-31-135-129-135S38 212 38 259c0 124 125 253 287 203-134 39-214-116-146-210 46-66 123-68 132 3 M411 99h1" />
      <path fill="url(#edge-c)" d="M39 253C51-15 419-30 472 202c14 107-86 149-166 115-42-26 26-20-3-99-48-112-251-103-264 35" />
    </svg>
  )
}

function SafariIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#EEE" />
      <circle cx="12" cy="12" r="11" fill="#3375f8" />
      <path fill="#CD151E" d="m19.584 4.416-8.85 6.291 2.625 2.606 6.225-8.897z" />
      <path fill="#FA5153" d="m10.744 10.688 1.322 1.303 7.519-7.575-8.841 6.272z" />
      <path fill="#ACACAC" d="m10.744 10.688 2.625 2.606-8.85 6.291 6.225-8.897z" />
      <path fill="#EEE" d="m4.519 19.584 7.547-7.594-1.322-1.303-6.225 8.897z" />
    </svg>
  )
}

function FirefoxIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512">
      <g transform="scale(4)">
        <path fill="#ff8855" d="M48 49s-3-9-1-16c-9 2-33 35-33 35a51 48 0 1087-32s5 9 5 15c-3-9-20-25-26-37-24 13-16 39-16 39" />
        <circle cx="64" cy="67" r="26" fill="#7744dd" />
        <path fill="#ff8855" d="M21 45l43 12c-6 11-16 3-23 14a22 22 0 1034-20s33 3 17 42H28m36 25h1" />
        <path fill="#ffdd55" d="M35 43c16 0 12 7 29 14-18 6-23-9-38 0 5 9 12 8 12 8 1 43 72 29 67-17a50 46.6 47 01-88 33c-9-18-1-40 16-51" />
      </g>
    </svg>
  )
}

function AndroidIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256">
      <path fill="#3DDC84" d="M163.935 111.433L176.14 90.2778C176.476 89.6939 176.567 89.0005 176.393 88.3498C176.219 87.699 175.794 87.1439 175.211 86.8061C174.627 86.47 173.934 86.3793 173.284 86.5538C172.633 86.7284 172.079 87.1539 171.742 87.737L159.385 109.16C149.933 104.844 139.32 102.439 127.995 102.439C116.67 102.439 106.055 104.844 96.6055 109.16L84.2479 87.7365C83.9108 87.1534 83.3562 86.728 82.7057 86.5535C82.0552 86.3791 81.3621 86.4699 80.7785 86.8061C80.1954 87.1437 79.7701 87.6989 79.5959 88.3497C79.4216 89.0006 79.5128 89.694 79.8493 90.2778L92.0546 111.433C71.0968 122.841 56.7628 144.075 54.666 169.162H201.324C199.225 144.075 184.891 122.841 163.935 111.433ZM161.689 136.038C165.028 136.038 167.743 138.804 167.743 142.204C167.743 145.606 165.028 148.374 161.689 148.374C158.351 148.374 155.636 145.606 155.636 142.204C155.636 138.804 158.351 136.038 161.689 136.038ZM94.3003 136.038C97.6379 136.038 100.354 138.804 100.354 142.204C100.354 145.606 97.6379 148.374 94.3003 148.374C90.9615 148.374 88.2466 145.606 88.2466 142.204C88.2466 138.804 90.9621 136.038 94.3003 136.038Z" />
    </svg>
  )
}

function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="currentColor">
      <path d="M30.54 26.24a14 14 0 0 1-1.41 2.52 13.16 13.16 0 0 1-1.8 2.24A3.55 3.55 0 0 1 25 32a5.94 5.94 0 0 1-2.15-.51 6.13 6.13 0 0 0-2.31-.49 6.42 6.42 0 0 0-2.38.51 6.49 6.49 0 0 1-2.05.54A3.35 3.35 0 0 1 13.73 31a14 14 0 0 1-1.89-2.27 15.54 15.54 0 0 1-2-4A14.55 14.55 0 0 1 9 20a8.6 8.6 0 0 1 1.14-4.52A6.6 6.6 0 0 1 12.51 13a6.44 6.44 0 0 1 3.22-.91 7.7 7.7 0 0 1 2.49.58 7.67 7.67 0 0 0 2 .58 12 12 0 0 0 2.19-.68 7.23 7.23 0 0 1 3-.53 6.34 6.34 0 0 1 4.95 2.61 5.48 5.48 0 0 0-2.92 5 5.52 5.52 0 0 0 1.81 4.16A6.18 6.18 0 0 0 31 25c-.15.42-.3.82-.46 1.21ZM25.5 6.4a5.59 5.59 0 0 1-1.43 3.66 4.85 4.85 0 0 1-4 2 3.79 3.79 0 0 1 0-.49 5.7 5.7 0 0 1 1.51-3.69 5.85 5.85 0 0 1 1.85-1.39 5.65 5.65 0 0 1 2.11-.6 4.67 4.67 0 0 1 0 .52Z" />
    </svg>
  )
}

function WindowsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 257">
      <path fill="#00ADEF" d="M0 36.357L104.62 22.11l.045 100.914-104.57.595L0 36.358zm104.57 98.293l.08 101.002L.081 221.275l-.006-87.302 104.494.677zm12.682-114.405L255.968 0v121.74l-138.716 1.1V20.246zM256 135.6l-.033 121.191-138.716-19.578-.194-101.84L256 135.6z" />
    </svg>
  )
}

function LinuxIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128">
      <path d="M108 81c-1.5 6.3-9.3 19.5-13.5 25.3-4.1 5.8-3.6 11.1-11.3 9-7.6-2-9.8-1.7-17.6-1.2-7.8.5-6.1-.2-11 2-4.9 2.2-21.3-26.8-22.6-32.2-1.3-5.4-1.9-4.7 1.5-10.6 3.4-5.8 3.9-11.6 8.4-18.7 4.5-7.1 9.7-10.7 9.3-16.1-1.5-20.1-2.6-30.2 6.3-34.8C66 9.4 73.1 12 75.9 13.5c1.2.7 3.7 1.9 5.5 4.1 1.8 2.2 3.5 5.4 4.4 9.6 1.9 8.3-.8 5.6 1.4 15.1 2.1 9.5 6.5 14.1 11.8 21.6 5.3 7.5 10.8 19.9 9 27.1z" fill="#1a1a1a" />
      <circle cx="56" cy="30" r="4.5" fill="#fc0" />
      <circle cx="70" cy="30" r="4.5" fill="#fc0" />
      <ellipse cx="63" cy="38" rx="8" ry="4" fill="#fc0" />
      <path fill="#fff" d="M63 54c-13 0-19 16-19 32 0 13 8 24 19 24s19-11 19-24c0-16-6-32-19-32z" />
      <ellipse cx="48" cy="111" rx="14" ry="6" fill="#fc0" />
      <ellipse cx="78" cy="111" rx="14" ry="6" fill="#fc0" />
    </svg>
  )
}

// Client-side auto background removal for uploaded logos
async function autoRemoveBackground(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const w = img.naturalWidth || img.width
        const h = img.naturalHeight || img.height
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext("2d")
        if (!ctx) return resolve(imageSrc)

        ctx.drawImage(img, 0, 0)
        const imgData = ctx.getImageData(0, 0, w, h)
        const data = imgData.data

        // Sample 4 corners to detect bg color
        const corners = [
          0,
          (w - 1) * 4,
          ((h - 1) * w) * 4,
          ((h - 1) * w + (w - 1)) * 4,
        ]

        const bgR = Math.round(corners.reduce((s, idx) => s + data[idx], 0) / 4)
        const bgG = Math.round(corners.reduce((s, idx) => s + data[idx + 1], 0) / 4)
        const bgB = Math.round(corners.reduce((s, idx) => s + data[idx + 2], 0) / 4)

        const tolerance = bgR > 210 && bgG > 210 && bgB > 210 ? 45 : 30

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]

          if (a === 0) continue

          const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2)

          if (dist < tolerance) {
            data[i + 3] = 0 // Transparent
          } else if (dist < tolerance + 15) {
            const factor = (dist - tolerance) / 15
            data[i + 3] = Math.round(a * factor) // Smooth edge
          }
        }

        ctx.putImageData(imgData, 0, 0)
        resolve(canvas.toDataURL("image/png"))
      } catch {
        resolve(imageSrc)
      }
    }
    img.onerror = () => resolve(imageSrc)
    img.src = imageSrc
  })
}

export function QrStudioClient({ initialLinks, initialClicks = [], userEmail }: QrStudioClientProps) {
  const [links, setLinks] = useState<DynamicQrItem[]>(initialLinks)
  const [view, setView] = useState<"create" | "manage" | "analytics">("create")
  const [searchQuery, setSearchQuery] = useState("")

  // Form State
  const [destinationUrl, setDestinationUrl] = useState("")
  const [title, setTitle] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [cuteMessage, setCuteMessage] = useState("You are being redirected, please wait 6 sec...")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  // QR Design State
  const [darkColor, setDarkColor] = useState("#0B1412")
  const [lightColor, setLightColor] = useState("#ffffff")
  const [dotStyle, setDotStyle] = useState<"square" | "dots" | "rounded" | "classy" | "diamond">("rounded")
  const [cornerStyle, setCornerStyle] = useState<"square" | "rounded" | "circle" | "leaf">("rounded")
  const [margin, setMargin] = useState(2)
  const [logoType, setLogoType] = useState<"none" | "ul0" | "custom">("ul0")
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null)
  const [rawLogoInput, setRawLogoInput] = useState("")
  const [autoRemoveBg, setAutoRemoveBg] = useState(true)
  const [labelText, setLabelText] = useState("")

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<DynamicQrItem | null>(null)
  const [editDestinationUrl, setEditDestinationUrl] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editCuteMessage, setEditCuteMessage] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  // QR Preview Modal State
  const [previewItem, setPreviewItem] = useState<DynamicQrItem | null>(null)

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isCleaningLogo, setIsCleaningLogo] = useState(false)

  const studioCanvasRef = useRef<HTMLCanvasElement>(null)
  const previewModalCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const previewSlug = customSlug.trim() || "demo-qr"
  const previewDynamicUrl = getDynamicQrUrl(DEFAULT_HOST, previewSlug)

  // Render QR Canvas with custom dot patterns & corner styles
  const renderQrOnCanvas = useCallback(
    async (
      canvas: HTMLCanvasElement | null,
      url: string,
      cfg: {
        darkColor: string
        lightColor: string
        dotStyle: "square" | "dots" | "rounded" | "classy" | "diamond"
        cornerStyle: "square" | "rounded" | "circle" | "leaf"
        margin: number
        logoType: string
        customLogoUrl?: string | null
        labelText?: string
      }
    ) => {
      if (!canvas) return

      try {
        const qrSize = 420
        const extraBottom = cfg.labelText?.trim() ? 50 : 0
        canvas.width = qrSize
        canvas.height = qrSize + extraBottom

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Fill background
        ctx.fillStyle = cfg.lightColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Generate QR Matrix
        const qr = QRCode.create(url, { errorCorrectionLevel: "H" })
        const modules = qr.modules
        const size = modules.size
        const marginModules = cfg.margin
        const totalModules = size + marginModules * 2
        const moduleSize = qrSize / totalModules

        const hasLogo = cfg.logoType !== "none" && (cfg.logoType === "ul0" || !!cfg.customLogoUrl)
        // Logo reservation area in matrix coordinates
        const centerStart = Math.floor(size / 2) - 4
        const centerEnd = Math.floor(size / 2) + 4

        // Helper to check if row, col is inside corner eye finder patterns (7x7 in 3 corners)
        const isCornerEye = (r: number, c: number) => {
          if (r < 7 && c < 7) return true // Top-left
          if (r < 7 && c >= size - 7) return true // Top-right
          if (r >= size - 7 && c < 7) return true // Bottom-left
          return false
        }

        // Draw data modules
        ctx.fillStyle = cfg.darkColor

        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (!modules.get(r, c)) continue

            // Skip corner eyes - drawn separately
            if (isCornerEye(r, c)) continue

            // Skip center if logo is active
            if (hasLogo && r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd) {
              continue
            }

            const x = (c + marginModules) * moduleSize
            const y = (r + marginModules) * moduleSize

            if (cfg.dotStyle === "dots") {
              ctx.beginPath()
              ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.42, 0, Math.PI * 2)
              ctx.fill()
            } else if (cfg.dotStyle === "rounded") {
              ctx.beginPath()
              ctx.roundRect(x + 0.5, y + 0.5, moduleSize - 1, moduleSize - 1, moduleSize * 0.3)
              ctx.fill()
            } else if (cfg.dotStyle === "diamond") {
              ctx.beginPath()
              ctx.moveTo(x + moduleSize / 2, y)
              ctx.lineTo(x + moduleSize, y + moduleSize / 2)
              ctx.lineTo(x + moduleSize / 2, y + moduleSize)
              ctx.lineTo(x, y + moduleSize / 2)
              ctx.closePath()
              ctx.fill()
            } else if (cfg.dotStyle === "classy") {
              ctx.beginPath()
              ctx.roundRect(x + 0.5, y + 0.5, moduleSize - 1, moduleSize - 1, moduleSize * 0.48)
              ctx.fill()
            } else {
              // Classic square
              ctx.fillRect(x, y, moduleSize, moduleSize)
            }
          }
        }

        // Draw 3 Position Detection Eyes
        const drawFinderEye = (startX: number, startY: number, eyeCorner: "top-left" | "top-right" | "bottom-left") => {
          const eyeWidth = 7 * moduleSize
          const outerRadius = cfg.cornerStyle === "circle" ? eyeWidth / 2 : cfg.cornerStyle === "rounded" ? 14 : cfg.cornerStyle === "leaf" ? 18 : 0

          // Outer frame
          ctx.strokeStyle = cfg.darkColor
          ctx.lineWidth = moduleSize
          ctx.beginPath()

          if (cfg.cornerStyle === "circle") {
            ctx.arc(startX + eyeWidth / 2, startY + eyeWidth / 2, eyeWidth / 2 - moduleSize / 2, 0, Math.PI * 2)
          } else if (cfg.cornerStyle === "leaf") {
            // Leaf: round one corner, square the opposite
            const r1 = eyeCorner === "top-left" ? 18 : 6
            const r2 = eyeCorner === "top-right" ? 18 : 6
            const r3 = eyeCorner === "bottom-left" ? 18 : 6
            ctx.roundRect(startX + moduleSize / 2, startY + moduleSize / 2, eyeWidth - moduleSize, eyeWidth - moduleSize, [r1, r2, 6, r3])
          } else {
            ctx.roundRect(startX + moduleSize / 2, startY + moduleSize / 2, eyeWidth - moduleSize, eyeWidth - moduleSize, outerRadius)
          }
          ctx.stroke()

          // Inner Eyeball (3x3 modules)
          const innerX = startX + 2 * moduleSize
          const innerY = startY + 2 * moduleSize
          const innerWidth = 3 * moduleSize

          ctx.fillStyle = cfg.darkColor
          ctx.beginPath()
          if (cfg.cornerStyle === "circle") {
            ctx.arc(startX + eyeWidth / 2, startY + eyeWidth / 2, innerWidth / 2, 0, Math.PI * 2)
          } else if (cfg.cornerStyle === "rounded") {
            ctx.roundRect(innerX, innerY, innerWidth, innerWidth, 6)
          } else {
            ctx.fillRect(innerX, innerY, innerWidth, innerWidth)
          }
          ctx.fill()
        }

        // Top-left
        drawFinderEye(marginModules * moduleSize, marginModules * moduleSize, "top-left")
        // Top-right
        drawFinderEye((size - 7 + marginModules) * moduleSize, marginModules * moduleSize, "top-right")
        // Bottom-left
        drawFinderEye(marginModules * moduleSize, (size - 7 + marginModules) * moduleSize, "bottom-left")

        // Draw Center Logo
        if (hasLogo) {
          let logoSrc = ""
          if (cfg.logoType === "ul0") {
            logoSrc = "/ul0.png"
          } else if (cfg.logoType === "custom" && cfg.customLogoUrl) {
            logoSrc = cfg.customLogoUrl
          }

          if (logoSrc) {
            const logoImg = new Image()
            logoImg.crossOrigin = "anonymous"
            logoImg.src = logoSrc

            await new Promise((res) => {
              logoImg.onload = res
              logoImg.onerror = res
              setTimeout(res, 400)
            })

            if (logoImg.complete && logoImg.naturalWidth > 0) {
              const badgeSize = qrSize * 0.22
              const logoX = (qrSize - badgeSize) / 2
              const logoY = (qrSize - badgeSize) / 2
              const pad = 6

              // Badge backplate
              ctx.fillStyle = cfg.lightColor
              ctx.beginPath()
              ctx.roundRect(logoX - pad, logoY - pad, badgeSize + pad * 2, badgeSize + pad * 2, 14)
              ctx.fill()

              ctx.strokeStyle = cfg.darkColor + "20"
              ctx.lineWidth = 1
              ctx.stroke()

              // Draw logo centered
              ctx.drawImage(logoImg, logoX, logoY, badgeSize, badgeSize)
            }
          }
        }

        // Bottom Label
        if (cfg.labelText?.trim()) {
          ctx.fillStyle = cfg.darkColor
          ctx.font = "600 13px -apple-system, BlinkMacSystemFont, 'Inter', sans-serif"
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
  }, [renderQrOnCanvas, previewDynamicUrl, darkColor, lightColor, dotStyle, cornerStyle, margin, logoType, customLogoUrl, labelText])

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

  const [previewTab, setPreviewTab] = useState<"qr" | "redirect">("qr")

  let previewDisplayDomain = "destination.com"
  try {
    if (destinationUrl.trim()) {
      previewDisplayDomain = new URL(destinationUrl.trim()).hostname.replace(/^www\./, "")
    }
  } catch {}

  // Handle Logo Upload: Auto Background Removal + Cloud Upload via Freeimage.host
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, SVG, WebP).")
      return
    }

    setIsCleaningLogo(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string
      try {
        let finalDataUrl = rawDataUrl
        if (autoRemoveBg) {
          finalDataUrl = await autoRemoveBackground(rawDataUrl)
        }

        // Upload to Freeimage.host via our API route
        const res = await fetch("/api/upload-logo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: finalDataUrl }),
        })
        const data = await res.json()

        if (res.ok && data.url) {
          setCustomLogoUrl(data.url)
          setLogoType("custom")
        } else {
          // Fallback to data URL if external API has a hiccup
          setCustomLogoUrl(finalDataUrl)
          setLogoType("custom")
        }
      } catch (err) {
        console.warn("Logo upload error:", err)
        setCustomLogoUrl(rawDataUrl)
        setLogoType("custom")
      } finally {
        setIsCleaningLogo(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const downloadPng = (canvas: HTMLCanvasElement | null, filename: string) => {
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${filename}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const downloadSvg = async (url: string, filename: string) => {
    try {
      const svgString = await QRCode.toString(url, {
        type: "svg",
        margin,
        color: { dark: darkColor, light: lightColor },
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
          qr_design: { darkColor, lightColor, dotStyle, cornerStyle, margin, logoType, customLogoUrl, labelText },
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to create dynamic QR code.")
      setLinks((prev) => [data.link, ...prev])
      setFormSuccess(`Dynamic QR created — /q/${data.link.slug}`)
      setDestinationUrl("")
      setTitle("")
      setCustomSlug("")
      setView("manage")
    } catch (err: any) {
      setFormError(err.message || "Failed to create dynamic QR code.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
      if (!response.ok) throw new Error(data.error || "Failed to update.")
      setLinks((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...data.link } : item)))
      setEditingItem(null)
    } catch (err: any) {
      setEditError(err.message || "Failed to update.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Delete this dynamic QR? Existing printed codes will stop working.")) return
    try {
      const response = await fetch(`/api/dynamic-qr/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete.")
      setLinks((prev) => prev.filter((item) => item.id !== id))
    } catch {
      alert("Error deleting dynamic QR.")
    }
  }

  const totalScans = links.reduce((sum, item) => sum + (item.clicks_count || 0), 0)

  // Compute Analytics Data
  const analytics = useMemo(() => {
    // Generate dates for last 7 days
    const days: { date: string; label: string; count: number }[] = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]
      const label = d.toLocaleDateString("en-US", { weekday: "short" })
      days.push({ date: dateStr, label, count: 0 })
    }

    const browserCounts: Record<string, number> = { chrome: 0, safari: 0, firefox: 0, edge: 0, brave: 0 }
    const osCounts: Record<string, number> = { Android: 0, Apple: 0, Windows: 0, Linux: 0 }
    const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 }

    let totalRecorded = 0

    initialClicks.forEach((c) => {
      totalRecorded++
      // Date count
      if (c.clicked_at) {
        const dStr = c.clicked_at.split("T")[0]
        const match = days.find((item) => item.date === dStr)
        if (match) match.count++
      }

      // Browser
      const b = (c.browser || "").toLowerCase()
      if (b.includes("brave")) browserCounts.brave++
      else if (b.includes("chrome")) browserCounts.chrome++
      else if (b.includes("safari")) browserCounts.safari++
      else if (b.includes("edge")) browserCounts.edge++
      else if (b.includes("firefox")) browserCounts.firefox++
      else browserCounts.chrome++ // Fallback

      // OS
      const o = (c.os || "").toLowerCase()
      if (o.includes("android")) osCounts.Android++
      else if (o.includes("mac") || o.includes("ios") || o.includes("iphone") || o.includes("ipad")) osCounts.Apple++
      else if (o.includes("win")) osCounts.Windows++
      else if (o.includes("linux")) osCounts.Linux++
      else osCounts.Android++ // Fallback

      // Device
      const dev = (c.device_type || "").toLowerCase()
      if (dev.includes("mobile")) deviceCounts.mobile++
      else if (dev.includes("tablet")) deviceCounts.tablet++
      else deviceCounts.desktop++
    })

    // If zero clicks yet, use realistic starter telemetry so graphs and icons animate beautifully
    const isMock = totalRecorded === 0 && totalScans === 0
    if (isMock) {
      days[0].count = 4
      days[1].count = 9
      days[2].count = 14
      days[3].count = 18
      days[4].count = 27
      days[5].count = 34
      days[6].count = 42

      browserCounts.chrome = 62
      browserCounts.safari = 38
      browserCounts.brave = 18
      browserCounts.firefox = 14
      browserCounts.edge = 10

      osCounts.Apple = 58
      osCounts.Android = 52
      osCounts.Windows = 24
      osCounts.Linux = 8

      deviceCounts.mobile = 94
      deviceCounts.desktop = 38
      deviceCounts.tablet = 10
    }

    const maxDayCount = Math.max(...days.map((d) => d.count), 1)

    return {
      days,
      maxDayCount,
      browserCounts,
      osCounts,
      deviceCounts,
      isMock,
    }
  }, [initialClicks, totalScans])

  const filteredLinks = links.filter((item) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      item.title?.toLowerCase().includes(q) ||
      item.slug?.toLowerCase().includes(q) ||
      item.long_url?.toLowerCase().includes(q)
    )
  })

  // Notion-inspired styling tokens
  const s = {
    page: "space-y-6 max-w-5xl mx-auto pb-16" as const,
    label: {
      fontSize: "12px",
      fontWeight: 500,
      color: "#37352F",
      marginBottom: "4px",
      display: "block",
    } as React.CSSProperties,
    input: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #e8e8e8",
      borderRadius: "8px",
      fontSize: "14px",
      background: "#fff",
      color: "#1a1a1a",
      outline: "none",
      fontFamily: "inherit",
      transition: "border-color 0.15s",
    } as React.CSSProperties,
    card: {
      background: "#fff",
      border: "1px solid #e8e8e8",
      borderRadius: "12px",
      padding: "24px",
    } as React.CSSProperties,
    btnPrimary: {
      background: "#1a1a1a",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 18px",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      transition: "background 0.15s",
      fontFamily: "inherit",
    } as React.CSSProperties,
    btnSecondary: {
      background: "#fff",
      color: "#37352F",
      border: "1px solid #e8e8e8",
      borderRadius: "8px",
      padding: "8px 14px",
      fontSize: "13px",
      fontWeight: 500,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.15s",
      fontFamily: "inherit",
    } as React.CSSProperties,
    mono: {
      fontFamily: "'SF Mono', 'Roboto Mono', 'Fira Code', monospace",
    } as React.CSSProperties,
  }

  return (
    <div className={s.page} style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.03em", margin: 0 }}>
            QR Studio
          </h1>
          <p style={{ fontSize: "13px", color: "#999", margin: "4px 0 0", letterSpacing: "-0.01em" }}>
            Dynamic QR codes · Vector shapes · Logo background removal · Live scan telemetry
          </p>
        </div>

        <div style={{ display: "flex", gap: "4px", background: "#f5f5f5", borderRadius: "10px", padding: "3px" }}>
          {(["create", "manage", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setView(tab)}
              style={{
                padding: "7px 16px",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit",
                background: view === tab ? "#fff" : "transparent",
                color: view === tab ? "#1a1a1a" : "#999",
                boxShadow: view === tab ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                textTransform: "capitalize",
              }}
            >
              {tab === "create" ? "Create QR" : tab === "manage" ? `Manage (${links.length})` : "Scan Analytics"}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats Banner */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {[
          { label: "Dynamic QRs", value: links.length.toString(), sub: "Permanent slugs" },
          { label: "Total Scans", value: totalScans.toLocaleString(), sub: "Redirects completed" },
          { label: "Monetization", value: "Stealth", sub: "Hidden background ads" },
        ].map((stat) => (
          <div key={stat.label} style={{ ...s.card, padding: "16px 20px" }}>
            <p
              style={{
                fontSize: "11px",
                color: "#999",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                margin: 0,
              }}
            >
              {stat.label}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", margin: "4px 0 0", ...s.mono }}>
              {stat.value}
            </p>
            <p style={{ fontSize: "11px", color: "#bbb", margin: "2px 0 0" }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* TAB 1: CREATE VIEW */}
      {view === "create" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
          {/* Form */}
          <div style={s.card}>
            <form onSubmit={handleCreateDynamicQr} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Destination &amp; Slug</h2>
                <p style={{ fontSize: "12px", color: "#999", margin: "4px 0 0" }}>
                  The QR code points to <span style={s.mono}>/q/[slug]</span>. You can change destination anytime.
                </p>
              </div>

              {formError && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#dc2626",
                  }}
                >
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#16a34a",
                  }}
                >
                  {formSuccess}
                </div>
              )}

              {/* Destination URL */}
              <div>
                <label style={s.label}>
                  Destination Target <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="url"
                  required
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  placeholder="https://example.com/summer-promo"
                  style={{ ...s.input, ...s.mono, fontSize: "13px" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2383e2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
                />
              </div>

              {/* Title & Slug */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={s.label}>Campaign Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Product Launch 2026"
                    style={s.input}
                    onFocus={(e) => (e.target.style.borderColor = "#2383e2")}
                    onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
                  />
                </div>
                <div>
                  <label style={s.label}>
                    Custom Slug <span style={{ color: "#bbb", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <div style={{ display: "flex", border: "1px solid #e8e8e8", borderRadius: "8px", overflow: "hidden" }}>
                    <span
                      style={{
                        padding: "8px 10px",
                        background: "#fafafa",
                        borderRight: "1px solid #e8e8e8",
                        fontSize: "13px",
                        color: "#999",
                        ...s.mono,
                        flexShrink: 0,
                      }}
                    >
                      /q/
                    </span>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="launch-qr"
                      style={{ ...s.input, border: "none", borderRadius: 0, ...s.mono, fontSize: "13px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Redirect Message */}
              <div>
                <label style={s.label}>Redirect Screen Message</label>
                <input
                  type="text"
                  value={cuteMessage}
                  onChange={(e) => setCuteMessage(e.target.value)}
                  placeholder="You are being redirected, please wait 6 sec..."
                  style={s.input}
                  onFocus={(e) => (e.target.style.borderColor = "#2383e2")}
                  onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
                />
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "#f0f0f0" }} />

              {/* QR Aesthetics Section */}
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
                  Vector Styling &amp; Shapes
                </h2>
                <p style={{ fontSize: "12px", color: "#999", margin: "4px 0 0" }}>
                  Apple-inspired smooth corner eyes and dot patterns
                </p>
              </div>

              {/* Colors */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={s.label}>Dark Color (Foreground)</label>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                    {PALETTE.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setDarkColor(hex)}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: darkColor === hex ? "2px solid #2383e2" : "1px solid #e8e8e8",
                          background: hex,
                          cursor: "pointer",
                          transform: darkColor === hex ? "scale(1.1)" : "scale(1)",
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      style={{ width: "24px", height: "24px", borderRadius: "6px", border: "1px solid #e8e8e8", cursor: "pointer", padding: 0 }}
                    />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Light Color (Background)</label>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                    {BG_PALETTE.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setLightColor(hex)}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          border: lightColor === hex ? "2px solid #2383e2" : "1px solid #e8e8e8",
                          background: hex,
                          cursor: "pointer",
                          transform: lightColor === hex ? "scale(1.1)" : "scale(1)",
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      style={{ width: "24px", height: "24px", borderRadius: "6px", border: "1px solid #e8e8e8", cursor: "pointer", padding: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* Dot Shape Pattern */}
              <div>
                <label style={s.label}>Data Pattern (Dots)</label>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {DOT_STYLES.map((ds) => (
                    <button
                      key={ds.value}
                      type="button"
                      onClick={() => setDotStyle(ds.value)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 500,
                        border: dotStyle === ds.value ? "1px solid #1a1a1a" : "1px solid #e8e8e8",
                        background: dotStyle === ds.value ? "#1a1a1a" : "#fff",
                        color: dotStyle === ds.value ? "#fff" : "#666",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {ds.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Eye Style */}
              <div>
                <label style={s.label}>Corner Eyes Shape</label>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {CORNER_STYLES.map((cs) => (
                    <button
                      key={cs.value}
                      type="button"
                      onClick={() => setCornerStyle(cs.value)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 500,
                        border: cornerStyle === cs.value ? "1px solid #1a1a1a" : "1px solid #e8e8e8",
                        background: cornerStyle === cs.value ? "#1a1a1a" : "#fff",
                        color: cornerStyle === cs.value ? "#fff" : "#666",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {cs.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Logo & Auto Background Removal */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ ...s.label, margin: 0 }}>Center Brand Logo</label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#666", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={autoRemoveBg}
                      onChange={(e) => setAutoRemoveBg(e.target.checked)}
                      style={{ accentColor: "#1a1a1a" }}
                    />
                    <span>Auto-remove background</span>
                  </label>
                </div>

                <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                  {[
                    { type: "ul0", label: "UL0 Logo" },
                    { type: "none", label: "None" },
                    { type: "custom", label: "Custom Logo" },
                  ].map((lo) => (
                    <button
                      key={lo.type}
                      type="button"
                      onClick={() => {
                        if (lo.type === "custom") {
                          setLogoType("custom")
                        } else {
                          setLogoType(lo.type as any)
                        }
                      }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 500,
                        border: logoType === lo.type ? "1px solid #1a1a1a" : "1px solid #e8e8e8",
                        background: logoType === lo.type ? "#1a1a1a" : "#fff",
                        color: logoType === lo.type ? "#fff" : "#666",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {lo.label}
                    </button>
                  ))}
                </div>

                {logoType === "custom" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px", background: "#fafafa", borderRadius: "8px", border: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        disabled={isCleaningLogo}
                        onClick={() => fileInputRef.current?.click()}
                        style={{ ...s.btnPrimary, fontSize: "12px", padding: "8px 16px" }}
                      >
                        {isCleaningLogo ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading to CDN &amp; Cleaning...</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>{customLogoUrl ? "Replace Brand Logo" : "Upload Brand Logo"}</span>
                          </>
                        )}
                      </button>

                      {customLogoUrl && !isCleaningLogo && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img
                            src={customLogoUrl}
                            alt="Logo preview"
                            style={{ width: "28px", height: "28px", objectFit: "contain", borderRadius: "6px", background: "#fff", border: "1px solid #e8e8e8", padding: "2px" }}
                          />
                          <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 500 }}>
                            ✓ Cleaned &amp; hosted on CDN
                          </span>
                          <button
                            type="button"
                            onClick={() => { setCustomLogoUrl(null); setLogoType("none") }}
                            style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "11px", textDecoration: "underline" }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: "11px", color: "#999", margin: 0 }}>
                      Automatic background removal active. Uploads permanently to Freeimage CDN.
                    </p>
                  </div>
                )}

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
              </div>

              {/* Bottom Label */}
              <div>
                <label style={s.label}>
                  Bottom Label <span style={{ color: "#bbb", fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  placeholder="SCAN TO REDIRECT"
                  style={{ ...s.input, ...s.mono, fontSize: "12px", letterSpacing: "0.05em" }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ ...s.btnPrimary, width: "100%", justifyContent: "center", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Generate Dynamic QR</span>
              </button>
            </form>
          </div>

          {/* Right Preview Card */}
          <div style={{ ...s.card, position: "sticky", top: "80px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Live Preview</p>
              <div style={{ display: "flex", gap: "2px", background: "#f5f5f5", borderRadius: "6px", padding: "2px" }}>
                <button
                  type="button"
                  onClick={() => setPreviewTab("qr")}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "11px",
                    fontWeight: 500,
                    cursor: "pointer",
                    background: previewTab === "qr" ? "#fff" : "transparent",
                    color: previewTab === "qr" ? "#1a1a1a" : "#888",
                    boxShadow: previewTab === "qr" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  QR Code
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("redirect")}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "11px",
                    fontWeight: 500,
                    cursor: "pointer",
                    background: previewTab === "redirect" ? "#fff" : "transparent",
                    color: previewTab === "redirect" ? "#1a1a1a" : "#888",
                    boxShadow: previewTab === "redirect" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  /q/ Redirect Screen
                </button>
              </div>
            </div>

            {previewTab === "qr" ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                    background: "#fafafa",
                    borderRadius: "10px",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <canvas ref={studioCanvasRef} style={{ width: "220px", height: "auto", aspectRatio: "1", borderRadius: "8px" }} />
                </div>

                {/* URL Display */}
                <div
                  style={{
                    marginTop: "16px",
                    padding: "10px 12px",
                    background: "#fafafa",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <p style={{ fontSize: "12px", color: "#666", margin: 0, ...s.mono, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {previewDynamicUrl}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(previewDynamicUrl, "preview")}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#999", flexShrink: 0 }}
                  >
                    {copiedId === "preview" ? <Check className="w-3.5 h-3.5" style={{ color: "#16a34a" }} /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Download Buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => downloadPng(studioCanvasRef.current, previewSlug)}
                    style={s.btnSecondary}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadSvg(previewDynamicUrl, previewSlug)}
                    style={s.btnSecondary}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>SVG</span>
                  </button>
                </div>
              </>
            ) : (
              /* Live Mini Preview of /q/ Redirect Page (UL0 x User Logo) */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "20px 14px",
                  background: "#ffffff",
                  borderRadius: "10px",
                  border: "1px solid #f0f0f0",
                  textAlign: "center",
                  gap: "14px",
                }}
              >
                {/* Visual of UL0 x User Logo */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <div style={{ position: "relative", width: "64px", height: "64px" }}>
                    <svg width="64" height="64" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#f0f0f0" strokeWidth="2.5" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#0B1412"
                        strokeWidth="2.5"
                        strokeDasharray={176}
                        strokeDashoffset={45}
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: "5px", borderRadius: "50%", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <img src="/ulo_4k.webp" alt="UL0" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
                    </div>
                  </div>

                  {customLogoUrl && (
                    <>
                      <span style={{ fontSize: "14px", color: "#bbb", userSelect: "none" }}>×</span>
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          background: "#fafafa",
                          border: "1px solid #f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          padding: "8px",
                        }}
                      >
                        <img src={customLogoUrl} alt="Brand" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <p style={{ fontSize: "12px", color: "#666", margin: "0 0 4px", fontWeight: 500 }}>
                    {cuteMessage || "You're being redirected"}
                  </p>
                  <p style={{ fontSize: "36px", fontWeight: 700, color: "#1a1a1a", margin: 0, ...s.mono, lineHeight: 1 }}>
                    6
                  </p>
                  <p style={{ fontSize: "11px", color: "#aaa", margin: "3px 0 0" }}>seconds remaining</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    background: "#f7f7f7",
                    borderRadius: "8px",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399" }} />
                  <span style={{ fontSize: "11px", color: "#666", ...s.mono, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {previewDisplayDomain}
                  </span>
                </div>

                <div
                  style={{
                    width: "100%",
                    padding: "9px",
                    background: "#1a1a1a",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Continue now →
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE VIEW */}
      {view === "manage" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Search bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
              <Search
                className="w-4 h-4"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#bbb" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search links..."
                style={{ ...s.input, paddingLeft: "36px", fontSize: "13px" }}
              />
            </div>
            <button type="button" onClick={() => setView("create")} style={s.btnPrimary}>
              <Plus className="w-3.5 h-3.5" />
              <span>New QR</span>
            </button>
          </div>

          {filteredLinks.length === 0 ? (
            <div style={{ ...s.card, textAlign: "center", padding: "60px 20px" }}>
              <QrCode className="w-10 h-10 mx-auto" style={{ color: "#ddd", marginBottom: "12px" }} />
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>No QR codes found</p>
              <p style={{ fontSize: "13px", color: "#999", margin: "4px 0 16px" }}>
                {searchQuery ? "No matches for your search." : "Create your first dynamic QR code."}
              </p>
              <button type="button" onClick={() => { setSearchQuery(""); setView("create") }} style={s.btnPrimary}>
                <Plus className="w-3.5 h-3.5" />
                <span>Create QR</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.5fr 90px 140px",
                  padding: "8px 16px",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#999",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                <span>Title</span>
                <span>Destination Target</span>
                <span style={{ textAlign: "center" }}>Scans</span>
                <span style={{ textAlign: "right" }}>Actions</span>
              </div>

              {filteredLinks.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...s.card,
                    padding: "14px 16px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1.5fr 90px 140px",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: "11px", color: "#999", margin: "2px 0 0", ...s.mono }}>
                      /q/{item.slug}
                    </p>
                  </div>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      margin: 0,
                      ...s.mono,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={item.long_url}
                  >
                    {item.long_url}
                  </p>

                  <p style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", margin: 0, textAlign: "center", ...s.mono }}>
                    {item.clicks_count}
                  </p>

                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.dynamicUrl, item.id)}
                      style={{ ...s.btnSecondary, padding: "6px 8px", fontSize: "11px" }}
                      title="Copy link"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3" style={{ color: "#16a34a" }} /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item)
                        setEditDestinationUrl(item.long_url)
                        setEditTitle(item.title)
                        setEditCuteMessage(item.targeting?.cute_message || "")
                      }}
                      style={{ ...s.btnSecondary, padding: "6px 8px", fontSize: "11px" }}
                      title="Edit Destination URL"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      style={{ ...s.btnSecondary, padding: "6px 8px", fontSize: "11px" }}
                      title="View & Download QR"
                    >
                      <QrCode className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(item.id)}
                      style={{ ...s.btnSecondary, padding: "6px 8px", fontSize: "11px", color: "#dc2626" }}
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ANALYTICS & INSIGHTS VIEW */}
      {view === "analytics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Animated Timeline Graph */}
          <div style={s.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
                  Scan Velocity (Last 7 Days)
                </h2>
                <p style={{ fontSize: "12px", color: "#999", margin: "2px 0 0" }}>
                  Real-time scan timestamps aggregated across all dynamic QR campaigns
                </p>
              </div>
              {analytics.isMock && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "#f3f4f6",
                    color: "#6b7280",
                  }}
                >
                  Live Preview Sample
                </span>
              )}
            </div>

            {/* SVG Animated Chart */}
            <div style={{ height: "180px", display: "flex", alignItems: "flex-end", gap: "16px", padding: "10px 0 20px" }}>
              {analytics.days.map((d, idx) => {
                const heightPct = Math.max(12, Math.round((d.count / analytics.maxDayCount) * 100))
                return (
                  <div
                    key={d.date}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      height: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#1a1a1a", ...s.mono }}>
                      {d.count}
                    </span>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "48px",
                        height: `${heightPct}%`,
                        background: "#1a1a1a",
                        borderRadius: "6px 6px 2px 2px",
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "#2383e2")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "#1a1a1a")}
                    />
                    <span style={{ fontSize: "11px", color: "#999", fontWeight: 500 }}>
                      {d.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Breakdown Grid: Browsers, Operating Systems, Devices */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {/* 1. Browsers */}
            <div style={s.card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Browsers</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { name: "Chrome", key: "chrome", icon: <ChromeIcon /> },
                  { name: "Safari", key: "safari", icon: <SafariIcon /> },
                  { name: "Brave", key: "brave", icon: <BraveIcon /> },
                  { name: "Firefox", key: "firefox", icon: <FirefoxIcon /> },
                  { name: "Edge", key: "edge", icon: <EdgeIcon /> },
                ].map((b) => {
                  const count = analytics.browserCounts[b.key] || 0
                  const total = Object.values(analytics.browserCounts).reduce((a, c) => a + c, 0) || 1
                  const pct = Math.round((count / total) * 100)
                  return (
                    <div key={b.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {b.icon}
                        </div>
                        <span style={{ fontSize: "12px", color: "#37352F", fontWeight: 500 }}>{b.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "60px", height: "6px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "#1a1a1a", borderRadius: "3px" }} />
                        </div>
                        <span style={{ fontSize: "11px", color: "#999", ...s.mono, width: "32px", textAlign: "right" }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2. Operating Systems */}
            <div style={s.card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Operating Systems</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { name: "iOS / macOS", key: "Apple", icon: <AppleIcon /> },
                  { name: "Android", key: "Android", icon: <AndroidIcon /> },
                  { name: "Windows", key: "Windows", icon: <WindowsIcon /> },
                  { name: "Linux", key: "Linux", icon: <LinuxIcon /> },
                ].map((o) => {
                  const count = analytics.osCounts[o.key] || 0
                  const total = Object.values(analytics.osCounts).reduce((a, c) => a + c, 0) || 1
                  const pct = Math.round((count / total) * 100)
                  return (
                    <div key={o.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {o.icon}
                        </div>
                        <span style={{ fontSize: "12px", color: "#37352F", fontWeight: 500 }}>{o.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "60px", height: "6px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "#1a1a1a", borderRadius: "3px" }} />
                        </div>
                        <span style={{ fontSize: "11px", color: "#999", ...s.mono, width: "32px", textAlign: "right" }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3. Devices */}
            <div style={s.card}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>Device Types</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { name: "Mobile Phone", key: "mobile", icon: <Smartphone className="w-4 h-4 text-neutral-700" /> },
                  { name: "Desktop", key: "desktop", icon: <Monitor className="w-4 h-4 text-neutral-700" /> },
                  { name: "Tablet", key: "tablet", icon: <Tablet className="w-4 h-4 text-neutral-700" /> },
                ].map((d) => {
                  const count = analytics.deviceCounts[d.key] || 0
                  const total = Object.values(analytics.deviceCounts).reduce((a, c) => a + c, 0) || 1
                  const pct = Math.round((count / total) * 100)
                  return (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {d.icon}
                        </div>
                        <span style={{ fontSize: "12px", color: "#37352F", fontWeight: 500 }}>{d.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "60px", height: "6px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "#1a1a1a", borderRadius: "3px" }} />
                        </div>
                        <span style={{ fontSize: "11px", color: "#999", ...s.mono, width: "32px", textAlign: "right" }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            padding: "16px",
          }}
        >
          <div style={{ ...s.card, maxWidth: "480px", width: "100%", boxShadow: "0 24px 48px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a", margin: 0 }}>
                  Edit Dynamic Destination
                </h3>
                <p style={{ fontSize: "12px", color: "#999", margin: "4px 0 0" }}>
                  Permanent QR slug: <span style={s.mono}>/q/{editingItem.slug}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: "4px" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#dc2626",
                  marginBottom: "16px",
                }}
              >
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateDestination} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={s.label}>New Destination Target</label>
                <input
                  type="url"
                  required
                  value={editDestinationUrl}
                  onChange={(e) => setEditDestinationUrl(e.target.value)}
                  style={{ ...s.input, ...s.mono, fontSize: "13px" }}
                />
              </div>
              <div>
                <label style={s.label}>Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={s.input}
                />
              </div>
              <div>
                <label style={s.label}>Redirect Message</label>
                <input
                  type="text"
                  value={editCuteMessage}
                  onChange={(e) => setEditCuteMessage(e.target.value)}
                  style={s.input}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingTop: "8px" }}>
                <button type="button" onClick={() => setEditingItem(null)} style={s.btnSecondary}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  style={{ ...s.btnPrimary, opacity: isUpdating ? 0.6 : 1 }}
                >
                  {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Destination</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR PREVIEW MODAL */}
      {previewItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            padding: "16px",
          }}
        >
          <div style={{ ...s.card, maxWidth: "380px", width: "100%", textAlign: "center", boxShadow: "0 24px 48px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {previewItem.title}
              </p>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: "4px" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", padding: "20px", background: "#fafafa", borderRadius: "10px", border: "1px solid #f0f0f0" }}>
              <canvas ref={previewModalCanvasRef} style={{ width: "220px", height: "auto", aspectRatio: "1", borderRadius: "8px" }} />
            </div>

            <p style={{ fontSize: "12px", color: "#666", margin: "14px 0", ...s.mono }}>{previewItem.dynamicUrl}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                onClick={() => downloadPng(previewModalCanvasRef.current, previewItem.slug)}
                style={s.btnPrimary}
              >
                <Download className="w-3.5 h-3.5" />
                <span>PNG</span>
              </button>
              <button
                type="button"
                onClick={() => downloadSvg(previewItem.dynamicUrl, previewItem.slug)}
                style={s.btnSecondary}
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}
