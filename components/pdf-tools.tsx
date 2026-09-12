"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { jsPDF } from "jspdf"
import { PDFDocument } from "pdf-lib"
import {
  ImageIcon,
  FileStack,
  ScanLine,
  Upload,
  Trash2,
  GripVertical,
  Download,
  Camera,
  RotateCcw,
  Plus,
  FileText,
  ChevronUp,
  ChevronDown,
  X,
  ZapIcon,
  AlertTriangle,
} from "lucide-react"
import { PdfAdBanner } from "./pdf-ad-banner"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface ImageItem {
  id: string
  file: File
  preview: string
  name: string
}

interface PdfItem {
  id: string
  file: File
  name: string
  pages: number
}

interface ScannedPage {
  id: string
  dataUrl: string
  name: string
}

type ActiveTab = "image-to-pdf" | "merge-pdf" | "scanner"

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
let idCounter = 0
const uid = () => `item_${Date.now()}_${++idCounter}`

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function PdfTools() {
  const [tab, setTab] = useState<ActiveTab>("image-to-pdf")
  const { bannerRef, sideRef } = PdfAdBanner()

  return (
    <div className="w-full">
      {/* Ad Banner (horizontal) */}
      <div className="flex justify-center mb-6">
        <div
          ref={bannerRef}
          className="w-full max-w-[468px] h-[60px] overflow-hidden rounded-xl bg-muted/10 flex items-center justify-center border border-border/60 shadow-inner"
        />
      </div>

      <div className="flex gap-6">
        {/* Main workspace */}
        <div className="flex-1 min-w-0">
          {/* Tab bar */}
          <div className="flex gap-1 p-1 bg-muted/30 rounded-xl mb-6 border border-border/50">
            {([
              { key: "image-to-pdf" as ActiveTab, label: "Image to PDF", icon: ImageIcon },
              { key: "merge-pdf" as ActiveTab, label: "Merge PDFs", icon: FileStack },
              { key: "scanner" as ActiveTab, label: "Document Scanner", icon: ScanLine },
            ]).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "image-to-pdf" && <ImageToPdf />}
          {tab === "merge-pdf" && <MergePdfs />}
          {tab === "scanner" && <DocScanner />}
        </div>

        {/* Sidebar ad (desktop only) */}
        <div className="hidden lg:block w-[180px] shrink-0">
          <div className="sticky top-20">
            <div
              ref={sideRef}
              className="w-[160px] h-[300px] overflow-hidden rounded-xl bg-muted/10 flex items-center justify-center border border-border/60 shadow-inner"
            />
            <p className="text-[10px] text-muted-foreground/50 text-center mt-1">Sponsored</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  TAB 1: Image to PDF                                                */
/* ================================================================== */
function ImageToPdf() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "legal">("a4")
  const [filename, setFilename] = useState("images")
  const [generating, setGenerating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addImages = useCallback((files: FileList | null) => {
    if (!files) return
    const newItems: ImageItem[] = []
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return
      newItems.push({
        id: uid(),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      })
    })
    setImages((prev) => [...prev, ...newItems])
  }, [])

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter((i) => i.id !== id)
    })
  }

  const move = (idx: number, dir: -1 | 1) => {
    setImages((prev) => moveItem(prev, idx, idx + dir))
  }

  const generatePdf = async () => {
    if (images.length === 0) return
    setGenerating(true)
    try {
      const sizes: Record<string, [number, number]> = {
        a4: [210, 297],
        letter: [215.9, 279.4],
        legal: [215.9, 355.6],
      }
      const [w, h] = sizes[pageSize]
      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: [w, h],
      })

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage()
        const img = images[i]
        const dataUrl = await readFileAsDataUrl(img.file)
        const pageW = orientation === "portrait" ? w : h
        const pageH = orientation === "portrait" ? h : w
        const margin = 5
        const maxW = pageW - margin * 2
        const maxH = pageH - margin * 2

        const imgEl = await loadImage(dataUrl)
        const ratio = Math.min(maxW / imgEl.width, maxH / imgEl.height)
        const imgW = imgEl.width * ratio
        const imgH = imgEl.height * ratio
        const x = (pageW - imgW) / 2
        const y = (pageH - imgH) / 2

        pdf.addImage(dataUrl, "JPEG", x, y, imgW, imgH)
      }

      pdf.save(`${filename || "images"}.pdf`)
    } catch (err) {
      console.error("PDF generation failed:", err)
    } finally {
      setGenerating(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    addImages(e.dataTransfer.files)
  }

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border/80 rounded-2xl p-10 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group"
      >
        <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
        <p className="text-sm font-medium text-foreground">Drop images here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP, GIF — unlimited files</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addImages(e.target.files)}
        />
      </div>

      {/* Image list */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/60 group hover:border-primary/40 transition-colors"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/40" />
              <img
                src={img.preview}
                alt={img.name}
                className="h-12 w-12 object-cover rounded-lg border border-border/50"
              />
              <span className="flex-1 text-sm truncate">{img.name}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => move(idx, 1)}
                  disabled={idx === images.length - 1}
                  className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => removeImage(img.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Options */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-xl border border-border/40">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Filename</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="my-document"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Page Size</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as "a4" | "letter" | "legal")}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="letter">Letter (8.5 × 11 in)</option>
              <option value="legal">Legal (8.5 × 14 in)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Orientation</label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>
      )}

      {/* Generate button */}
      {images.length > 0 && (
        <button
          onClick={generatePdf}
          disabled={generating}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <Download className="h-4 w-4" />
          {generating ? "Generating PDF..." : `Generate PDF (${images.length} image${images.length > 1 ? "s" : ""})`}
        </button>
      )}
    </div>
  )
}

/* ================================================================== */
/*  TAB 2: Merge PDFs                                                  */
/* ================================================================== */
function MergePdfs() {
  const [pdfs, setPdfs] = useState<PdfItem[]>([])
  const [filename, setFilename] = useState("merged")
  const [merging, setMerging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addPdfs = useCallback(async (files: FileList | null) => {
    if (!files) return
    const newItems: PdfItem[] = []
    for (const file of Array.from(files)) {
      if (file.type !== "application/pdf") continue
      try {
        const bytes = await file.arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        newItems.push({
          id: uid(),
          file,
          name: file.name,
          pages: doc.getPageCount(),
        })
      } catch {
        // Skip invalid PDFs
      }
    }
    setPdfs((prev) => [...prev, ...newItems])
  }, [])

  const removePdf = (id: string) => {
    setPdfs((prev) => prev.filter((p) => p.id !== id))
  }

  const move = (idx: number, dir: -1 | 1) => {
    setPdfs((prev) => moveItem(prev, idx, idx + dir))
  }

  const mergePdfs = async () => {
    if (pdfs.length < 2) return
    setMerging(true)
    try {
      const merged = await PDFDocument.create()
      for (const item of pdfs) {
        const bytes = await item.file.arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach((page) => merged.addPage(page))
      }
      const pdfBytes = await merged.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename || "merged"}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Merge failed:", err)
    } finally {
      setMerging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    addPdfs(e.dataTransfer.files)
  }

  const totalPages = pdfs.reduce((sum, p) => sum + p.pages, 0)

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border/80 rounded-2xl p-10 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group"
      >
        <FileStack className="h-10 w-10 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
        <p className="text-sm font-medium text-foreground">Drop PDF files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Select 2 or more PDFs to merge</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => addPdfs(e.target.files)}
        />
      </div>

      {/* PDF list */}
      {pdfs.length > 0 && (
        <div className="space-y-2">
          {pdfs.map((pdf, idx) => (
            <div
              key={pdf.id}
              className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/60 group hover:border-primary/40 transition-colors"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/40" />
              <div className="h-12 w-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{pdf.name}</p>
                <p className="text-xs text-muted-foreground">{pdf.pages} page{pdf.pages > 1 ? "s" : ""}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => move(idx, 1)}
                  disabled={idx === pdfs.length - 1}
                  className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => removePdf(pdf.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Options + merge */}
      {pdfs.length > 0 && (
        <>
          <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl border border-border/40">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Output Filename</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="merged-document"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-foreground">{totalPages}</p>
              <p className="text-xs text-muted-foreground">total pages</p>
            </div>
          </div>

          <button
            onClick={mergePdfs}
            disabled={merging || pdfs.length < 2}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <FileStack className="h-4 w-4" />
            {merging ? "Merging..." : `Merge ${pdfs.length} PDFs`}
          </button>
        </>
      )}
    </div>
  )
}

/* ================================================================== */
/*  TAB 3: Document Scanner                                            */
/* ================================================================== */
type DocRatio = "a4" | "letter" | "id" | "full"
type DocFilter = "enhanced" | "bw" | "original"

const RATIO_CONFIGS: Record<DocRatio, { label: string; ratio: number; desc: string; widthMm: number; heightMm: number }> = {
  a4: { label: "A4 Document", ratio: 210 / 297, desc: "1 : 1.41", widthMm: 210, heightMm: 297 },
  letter: { label: "US Letter", ratio: 8.5 / 11, desc: "1 : 1.29", widthMm: 215.9, heightMm: 279.4 },
  id: { label: "ID Card / Badge", ratio: 85.6 / 53.98, desc: "1.58 : 1", widthMm: 85.6, heightMm: 53.98 },
  full: { label: "Full Camera Frame", ratio: 0, desc: "Auto", widthMm: 210, heightMm: 297 },
}

function DocScanner() {
  const [pages, setPages] = useState<ScannedPage[]>([])
  const [cameraActive, setCameraActive] = useState(false)
  const [filename, setFilename] = useState("scanned-document")
  const [generating, setGenerating] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [docRatio, setDocRatio] = useState<DocRatio>("a4")
  const [filter, setFilter] = useState<DocFilter>("enhanced")
  const [autoCrop, setAutoCrop] = useState(true)
  const [autoCapture, setAutoCapture] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")
  const [shutterFlash, setShutterFlash] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autoCaptureTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Attach stream to video whenever video element or cameraActive changes
  const attachStream = useCallback((stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch((e) => console.warn("Video play error:", e))
    }
  }, [])

  const startCamera = async (targetFacing: "environment" | "user" = facingMode) => {
    setCameraError(null)

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }

    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera is not supported on this browser or connection. Make sure you are using HTTPS, or upload photos below.")
      return
    }

    let stream: MediaStream | null = null

    try {
      // 1. Try with ideal constraints
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
    } catch (err1) {
      console.warn("First camera constraint failed, falling back to basic camera:", err1)
      try {
        // 2. Fallback to basic video: true (works on laptops/macbooks/webcams)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
      } catch (err2: any) {
        console.error("Camera access failed completely:", err2)
        if (err2.name === "NotAllowedError" || err2.name === "PermissionDeniedError") {
          setCameraError("Camera permission was blocked. Please tap the camera/lock icon in your browser URL bar to allow camera access, then try again.")
        } else if (err2.name === "NotFoundError" || err2.name === "DevicesNotFoundError") {
          setCameraError("No camera found on this device. You can upload photos directly below.")
        } else {
          setCameraError(err2.message || "Failed to access camera. Please allow permissions or upload photos.")
        }
        return
      }
    }

    if (stream) {
      streamRef.current = stream
      setCameraActive(true)
      // Slight delay to ensure video element is rendered
      setTimeout(() => {
        attachStream(stream!)
      }, 50)
    }
  }

  const stopCamera = () => {
    if (autoCaptureTimerRef.current) {
      clearInterval(autoCaptureTimerRef.current)
      autoCaptureTimerRef.current = null
    }
    setCountdown(null)
    setAutoCapture(false)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const toggleCamera = async () => {
    const nextFacing = facingMode === "environment" ? "user" : "environment"
    setFacingMode(nextFacing)
    await startCamera(nextFacing)
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      if (autoCaptureTimerRef.current) {
        clearInterval(autoCaptureTimerRef.current)
      }
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current

    const vw = video.videoWidth
    const vh = video.videoHeight
    if (!vw || !vh) return

    // Trigger visual shutter flash
    setShutterFlash(true)
    setTimeout(() => setShutterFlash(false), 200)

    const cfg = RATIO_CONFIGS[docRatio]
    let cropX = 0
    let cropY = 0
    let cropW = vw
    let cropH = vh

    // Auto-crop to document guide box if enabled and ratio specified
    if (autoCrop && cfg.ratio > 0) {
      const targetRatio = cfg.ratio // width / height
      // Match document guide box proportion (75% width or 85% height)
      if (vw / vh > targetRatio) {
        // Video is wider than target doc
        cropH = vh * 0.85
        cropW = cropH * targetRatio
      } else {
        // Video is taller than target doc
        cropW = vw * 0.85
        cropH = cropW / targetRatio
      }
      cropX = Math.max(0, (vw - cropW) / 2)
      cropY = Math.max(0, (vh - cropH) / 2)
    }

    canvas.width = Math.round(cropW)
    canvas.height = Math.round(cropH)
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height)

    // Apply selected filter
    if (filter !== "original") {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      if (filter === "bw") {
        // High-contrast clean Black & White text document filter
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
          // Crisp document thresholding
          const bw = gray > 135 ? 255 : Math.max(0, gray * 0.4)
          data[i] = bw
          data[i + 1] = bw
          data[i + 2] = bw
        }
      } else if (filter === "enhanced") {
        // Document enhancement: boost contrast & whites
        const contrast = 1.35
        const intercept = 128 * (1 - contrast)
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, data[i] * contrast + intercept))
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * contrast + intercept))
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * contrast + intercept))
        }
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
    setPages((prev) => [
      ...prev,
      { id: uid(), dataUrl, name: `Page ${prev.length + 1}` },
    ])
  }, [docRatio, autoCrop, filter])

  // Auto-capture timer
  useEffect(() => {
    if (!autoCapture || !cameraActive) {
      if (autoCaptureTimerRef.current) {
        clearInterval(autoCaptureTimerRef.current)
        autoCaptureTimerRef.current = null
      }
      setCountdown(null)
      return
    }

    let count = 3
    setCountdown(count)

    autoCaptureTimerRef.current = setInterval(() => {
      count -= 1
      if (count <= 0) {
        capturePhoto()
        count = 3
      }
      setCountdown(count)
    }, 1000)

    return () => {
      if (autoCaptureTimerRef.current) {
        clearInterval(autoCaptureTimerRef.current)
        autoCaptureTimerRef.current = null
      }
    }
  }, [autoCapture, cameraActive, capturePhoto])

  const addFromFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = () => {
        setPages((prev) => [
          ...prev,
          { id: uid(), dataUrl: reader.result as string, name: `Page ${prev.length + 1}` },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id))
  }

  const movePage = (idx: number, dir: -1 | 1) => {
    setPages((prev) => moveItem(prev, idx, idx + dir))
  }

  const generatePdf = async () => {
    if (pages.length === 0) return
    setGenerating(true)
    try {
      const cfg = RATIO_CONFIGS[docRatio]
      const isLandscape = cfg.ratio > 1
      const pdf = new jsPDF({
        orientation: isLandscape ? "landscape" : "portrait",
        unit: "mm",
        format: [cfg.widthMm, cfg.heightMm],
      })
      const pageW = isLandscape ? cfg.heightMm : cfg.widthMm
      const pageH = isLandscape ? cfg.widthMm : cfg.heightMm
      const margin = 5

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage([cfg.widthMm, cfg.heightMm], isLandscape ? "landscape" : "portrait")
        const imgEl = await loadImage(pages[i].dataUrl)
        const maxW = pageW - margin * 2
        const maxH = pageH - margin * 2
        const ratio = Math.min(maxW / imgEl.width, maxH / imgEl.height)
        const imgW = imgEl.width * ratio
        const imgH = imgEl.height * ratio
        const x = (pageW - imgW) / 2
        const y = (pageH - imgH) / 2
        pdf.addImage(pages[i].dataUrl, "JPEG", x, y, imgW, imgH)
      }

      pdf.save(`${(filename || "scanned-document").trim()}.pdf`)
    } catch (err) {
      console.error("Scan PDF generation failed:", err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Camera view or start button */}
      {!cameraActive ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => startCamera()}
              className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-primary/40 bg-primary/5 rounded-2xl hover:border-primary hover:bg-primary/10 transition-all group"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Camera className="h-7 w-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">Open Document Scanner</p>
                <p className="text-xs text-muted-foreground mt-1">Real-time auto-crop, A4 ratio & camera capture</p>
              </div>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border/80 rounded-2xl hover:border-primary/60 hover:bg-muted/30 transition-all group"
            >
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center transition-colors">
                <Upload className="h-7 w-7 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">Upload Document Photos</p>
                <p className="text-xs text-muted-foreground mt-1">Select photos from camera roll or files</p>
              </div>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFromFiles(e.target.files)}
          />

          {cameraError && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-2xl text-sm text-destructive flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Camera Access Notice</p>
                  <p className="text-xs opacity-90 leading-relaxed">{cameraError}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 pt-2 border-t border-destructive/20">
                <button
                  onClick={() => startCamera()}
                  className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Retry Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-background/80 text-foreground border border-border rounded-lg text-xs font-semibold hover:bg-background transition-colors"
                >
                  Upload Photos Instead
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top Controls: Ratio selection & Auto-Crop */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/30 border border-border/60 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-muted-foreground font-medium shrink-0 mr-1">Ratio:</span>
              {(Object.keys(RATIO_CONFIGS) as DocRatio[]).map((r) => {
                const isSel = docRatio === r
                return (
                  <button
                    key={r}
                    onClick={() => setDocRatio(r)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors shrink-0 ${
                      isSel
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-background/80 hover:bg-background text-foreground border border-border/60"
                    }`}
                  >
                    {RATIO_CONFIGS[r].label} <span className="opacity-75 text-[10px]">({RATIO_CONFIGS[r].desc})</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoCrop}
                  onChange={(e) => setAutoCrop(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span className="font-medium text-foreground">Auto-Crop to Guide</span>
              </label>

              <button
                onClick={() => setAutoCapture((prev) => !prev)}
                className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1 ${
                  autoCapture
                    ? "bg-emerald-500 text-white shadow-sm animate-pulse"
                    : "bg-background border border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <ZapIcon className="h-3 w-3" />
                {autoCapture ? `Auto-Snap (${countdown ?? 3}s)` : "Auto-Capture"}
              </button>
            </div>
          </div>

          {/* Camera feed viewport */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-border/80 shadow-2xl flex items-center justify-center min-h-[360px] max-h-[65vh]">
            <video
              ref={(el) => {
                videoRef.current = el
                if (el && streamRef.current && !el.srcObject) {
                  attachStream(streamRef.current)
                }
              }}
              autoPlay
              playsInline
              muted
              className="w-full h-full max-h-[65vh] object-contain"
            />

            {/* Shutter flash animation overlay */}
            {shutterFlash && (
              <div className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 z-30" />
            )}

            {/* Document Bounding Box Overlay Guide */}
            {docRatio !== "full" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 z-10">
                <div
                  className="relative border-2 border-primary/80 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] transition-all duration-300 flex flex-col justify-between p-2"
                  style={{
                    width: docRatio === "id" ? "85%" : "72%",
                    aspectRatio: `${RATIO_CONFIGS[docRatio].ratio}`,
                    maxHeight: "85%",
                  }}
                >
                  {/* Corner brackets */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary" />

                  {/* Realtime Size Badge */}
                  <div className="self-center bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-primary border border-primary/40 flex items-center gap-1.5 shadow-lg">
                    <span>{RATIO_CONFIGS[docRatio].label}</span>
                    <span className="opacity-60">•</span>
                    <span>{RATIO_CONFIGS[docRatio].desc}</span>
                  </div>

                  {autoCapture && countdown !== null && (
                    <div className="self-center bg-emerald-600/90 text-white font-bold text-lg px-4 py-1.5 rounded-full shadow-xl animate-bounce">
                      Auto-snap in {countdown}...
                    </div>
                  )}

                  <div className="self-center bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white/75">
                    Align document edges inside guide
                  </div>
                </div>
              </div>
            )}

            {/* Top controls over video */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
              <button
                onClick={toggleCamera}
                title="Flip Camera"
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={stopCamera}
                title="Close Camera"
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar & Snap Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card rounded-2xl border border-border/60">
            {/* Filter mode */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Filter:</span>
              {(
                [
                  { key: "enhanced", label: "Magic Contrast" },
                  { key: "bw", label: "B&W Document" },
                  { key: "original", label: "Color (Original)" },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Shutter buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Add photo from files"
                className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>

              <button
                onClick={capturePhoto}
                className="px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 active:scale-95 flex items-center gap-2"
              >
                <Camera className="h-5 w-5" />
                <span>Capture Page</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanned pages list & PDF export */}
      {pages.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              {pages.length} Scanned Page{pages.length > 1 ? "s" : ""}
            </h3>
            <button
              onClick={() => setPages([])}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {pages.map((page, idx) => (
              <div
                key={page.id}
                className="relative group rounded-xl overflow-hidden border border-border/60 bg-card hover:border-primary/40 transition-colors shadow-sm"
              >
                <img
                  src={page.dataUrl}
                  alt={page.name}
                  className="w-full aspect-[3/4] object-contain bg-black/10"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {idx > 0 && (
                    <button
                      onClick={() => movePage(idx, -1)}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removePage(page.id)}
                    className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {idx < pages.length - 1 && (
                    <button
                      onClick={() => movePage(idx, 1)}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  Page {idx + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Filename + generate */}
          <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Custom PDF Filename</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="scanned-document"
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
              />
            </div>

            <button
              onClick={generatePdf}
              disabled={generating}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Download className="h-4 w-4" />
              {generating ? "Compiling PDF..." : `Download Scanned PDF (${pages.length} Page${pages.length > 1 ? "s" : ""})`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/*  Utilities                                                          */
/* ================================================================== */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
