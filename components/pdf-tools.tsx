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
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
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
function DocScanner() {
  const [pages, setPages] = useState<ScannedPage[]>([])
  const [cameraActive, setCameraActive] = useState(false)
  const [filename, setFilename] = useState("scanned")
  const [generating, setGenerating] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setCameraActive(true)
    } catch (err) {
      console.error("Camera access denied:", err)
      setCameraError("Camera access denied. Please allow camera permissions or upload images instead.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)

    // Apply basic document enhancement: increase contrast
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const contrast = 1.3
    const intercept = 128 * (1 - contrast)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] * contrast + intercept))
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * contrast + intercept))
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * contrast + intercept))
    }
    ctx.putImageData(imageData, 0, 0)

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
    setPages((prev) => [
      ...prev,
      { id: uid(), dataUrl, name: `Page ${prev.length + 1}` },
    ])
  }

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
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const pageW = 210
      const pageH = 297
      const margin = 5

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage()
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

      pdf.save(`${filename || "scanned"}.pdf`)
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
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={startCamera}
              className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border/80 rounded-2xl hover:border-primary/60 hover:bg-primary/5 transition-all group"
            >
              <Camera className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-center">
                <p className="text-sm font-medium">Open Camera</p>
                <p className="text-xs text-muted-foreground">Scan documents with your camera</p>
              </div>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border/80 rounded-2xl hover:border-primary/60 hover:bg-primary/5 transition-all group"
            >
              <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-center">
                <p className="text-sm font-medium">Upload Images</p>
                <p className="text-xs text-muted-foreground">Select photos of documents</p>
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
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {cameraError}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Camera feed */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-border/60">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-h-[60vh] object-contain"
            />
            {/* A4 ratio overlay guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="border-2 border-primary/50 rounded-lg"
                style={{
                  width: "70%",
                  aspectRatio: "210 / 297",
                  maxHeight: "85%",
                }}
              />
            </div>
            {/* Quick capture info */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <p className="text-xs text-white/80 flex items-center gap-1.5">
                <ZapIcon className="h-3 w-3 text-primary" />
                Align document within the guide
              </p>
            </div>
          </div>

          {/* Camera controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={stopCamera}
              className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={capturePhoto}
              className="p-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-95"
            >
              <Camera className="h-6 w-6" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => addFromFiles(e.target.files)}
            />
          </div>
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanned pages */}
      {pages.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">{pages.length} page{pages.length > 1 ? "s" : ""} scanned</h3>
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
                className="relative group rounded-xl overflow-hidden border border-border/60 bg-card hover:border-primary/40 transition-colors"
              >
                <img
                  src={page.dataUrl}
                  alt={page.name}
                  className="w-full aspect-[3/4] object-cover"
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
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Filename + generate */}
          <div className="p-4 bg-muted/20 rounded-xl border border-border/40">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">PDF Filename</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="scanned-document"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <button
            onClick={generatePdf}
            disabled={generating}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <Download className="h-4 w-4" />
            {generating ? "Generating PDF..." : `Export as PDF (${pages.length} page${pages.length > 1 ? "s" : ""})`}
          </button>
        </>
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
