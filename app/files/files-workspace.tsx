"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { PDFDocument, degrees } from "pdf-lib"
import { jsPDF } from "jspdf"
import JSZip from "jszip"
import {
  Scissors,
  FileStack,
  ImageIcon,
  ScanLine,
  Download,
  Upload,
  Trash2,
  Plus,
  Smartphone,
  Share2,
  Check,
  ArrowRight,
  ShieldCheck,
  MoveUp,
  MoveDown,
  Info,
  Loader2,
  Camera,
  X,
  FileDown,
  Layers,
  Sparkles,
  RotateCw,
  Scaling,
  FileEdit,
  Maximize2,
  Sliders,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PdfSplitterClient } from "@/app/tools/pdf-splitter/pdf-splitter-client"

type ToolTab =
  | "split"
  | "merge"
  | "img-to-pdf"
  | "pdf-to-img"
  | "resize-convert"
  | "rotate-organize"
  | "text-to-pdf"
  | "scanner"

interface MergeItem {
  id: string
  file: File
  name: string
  pageCount: number
}

interface ImageToPdfItem {
  id: string
  file: File
  previewUrl: string
  name: string
  sizeBytes: number
}

interface ScannedDocPage {
  id: string
  dataUrl: string
}

interface PdfPageRotateItem {
  pageIndex: number
  rotation: number // 0, 90, 180, 270
  previewUrl: string | null
  deleted: boolean
}

export function FilesWorkspace() {
  const [activeTab, setActiveTab] = useState<ToolTab>("split")

  // PWA / Add to home screen state
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showIosGuide, setShowIosGuide] = useState(false)
  const [isIos, setIsIos] = useState(false)

  // Listen for PWA install prompt
  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true)
    }

    const userAgent = window.navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream) {
      setIsIos(true)
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    window.addEventListener("appinstalled", () => setIsInstalled(true))

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
    }
  }, [])

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === "accepted") {
        setIsInstalled(true)
      }
      setInstallPrompt(null)
    } else {
      setShowIosGuide(true)
    }
  }

  /* =========================================================================
   * 1. MERGE PDF STATE & ACTIONS
   * ========================================================================= */
  const [mergeFiles, setMergeFiles] = useState<MergeItem[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const mergeInputRef = useRef<HTMLInputElement>(null)

  const handleMergeFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected || selected.length === 0) return

    const newItems: MergeItem[] = []
    for (let i = 0; i < selected.length; i++) {
      const f = selected[i]
      if (f.type !== "application/pdf" && !f.name.endsWith(".pdf")) continue
      try {
        const buf = await f.arrayBuffer()
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true })
        newItems.push({
          id: `merge_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          file: f,
          name: f.name,
          pageCount: pdf.getPageCount(),
        })
      } catch (err) {
        console.warn("Failed reading PDF page count for merge:", err)
      }
    }
    setMergeFiles((prev) => [...prev, ...newItems])
    if (mergeInputRef.current) mergeInputRef.current.value = ""
  }

  const moveMergeItem = (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir
    if (targetIdx < 0 || targetIdx >= mergeFiles.length) return
    setMergeFiles((prev) => {
      const copy = [...prev]
      const temp = copy[idx]
      copy[idx] = copy[targetIdx]
      copy[targetIdx] = temp
      return copy
    })
  }

  const removeMergeItem = (id: string) => {
    setMergeFiles((prev) => prev.filter((item) => item.id !== id))
  }

  const handleExecuteMerge = async () => {
    if (mergeFiles.length < 2) {
      alert("Please upload at least 2 PDF files to merge.")
      return
    }

    try {
      setIsMerging(true)
      const mergedPdf = await PDFDocument.create()

      for (const item of mergeFiles) {
        const buf = await item.file.arrayBuffer()
        const srcPdf = await PDFDocument.load(buf, { ignoreEncryption: true })
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices())
        copiedPages.forEach((p) => mergedPdf.addPage(p))
      }

      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([mergedBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `merged_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert("Error merging PDF files. Please verify the files are valid and unencrypted.")
    } finally {
      setIsMerging(false)
    }
  }

  /* =========================================================================
   * 2. IMAGE TO PDF STATE & ACTIONS
   * ========================================================================= */
  const [imageItems, setImageItems] = useState<ImageToPdfItem[]>([])
  const [isConvertingImages, setIsConvertingImages] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleImageFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected || selected.length === 0) return

    const newItems: ImageToPdfItem[] = []
    for (let i = 0; i < selected.length; i++) {
      const f = selected[i]
      if (!f.type.startsWith("image/")) continue
      newItems.push({
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        name: f.name,
        sizeBytes: f.size,
      })
    }
    setImageItems((prev) => [...prev, ...newItems])
    if (imageInputRef.current) imageInputRef.current.value = ""
  }

  const moveImageItem = (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir
    if (targetIdx < 0 || targetIdx >= imageItems.length) return
    setImageItems((prev) => {
      const copy = [...prev]
      const temp = copy[idx]
      copy[idx] = copy[targetIdx]
      copy[targetIdx] = temp
      return copy
    })
  }

  const removeImageItem = (id: string) => {
    setImageItems((prev) => {
      const item = prev.find((x) => x.id === id)
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((x) => x.id !== id)
    })
  }

  const handleExecuteImageToPdf = async () => {
    if (imageItems.length === 0) {
      alert("Please upload at least one image.")
      return
    }

    try {
      setIsConvertingImages(true)
      const pdf = new jsPDF()

      for (let i = 0; i < imageItems.length; i++) {
        if (i > 0) pdf.addPage()

        const item = imageItems[i]
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(item.file)
        })

        const img = new Image()
        await new Promise((resolve) => {
          img.onload = resolve
          img.src = dataUrl
        })

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        const imgWidth = img.naturalWidth || 800
        const imgHeight = img.naturalHeight || 600
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight) * 0.92

        const renderWidth = imgWidth * ratio
        const renderHeight = imgHeight * ratio
        const xOffset = (pageWidth - renderWidth) / 2
        const yOffset = (pageHeight - renderHeight) / 2

        const format = item.file.type.includes("png") ? "PNG" : "JPEG"
        pdf.addImage(dataUrl, format, xOffset, yOffset, renderWidth, renderHeight)
      }

      pdf.save(`images_${Date.now()}.pdf`)
    } catch (err) {
      alert("Error converting images to PDF.")
    } finally {
      setIsConvertingImages(false)
    }
  }

  /* =========================================================================
   * 3. PDF TO IMAGES STATE & ACTIONS
   * ========================================================================= */
  const [pdfForImages, setPdfForImages] = useState<File | null>(null)
  const [extractedImages, setExtractedImages] = useState<{ page: number; url: string }[]>([])
  const [isExtractingImages, setIsExtractingImages] = useState(false)
  const [isDownloadingAllZip, setIsDownloadingAllZip] = useState(false)
  const pdfToImageInputRef = useRef<HTMLInputElement>(null)

  const handlePdfToImageFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file.")
      return
    }

    setPdfForImages(file)
    setExtractedImages([])
    setIsExtractingImages(true)

    try {
      let pdfjs = (window as any).pdfjsLib
      if (!pdfjs) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          script.async = true
          script.onload = () => {
            pdfjs = (window as any).pdfjsLib
            if (pdfjs) {
              pdfjs.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
              resolve(true)
            } else {
              reject(new Error("pdfjs not loaded"))
            }
          }
          script.onerror = reject
          document.body.appendChild(script)
        })
      }

      const buffer = await file.arrayBuffer()
      const loadingTask = pdfjs.getDocument({ data: buffer })
      const doc = await loadingTask.promise
      const total = doc.numPages

      const results: { page: number; url: string }[] = []

      for (let p = 1; p <= total; p++) {
        const page = await doc.getPage(p)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        canvas.width = viewport.width
        canvas.height = viewport.height

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise
          const dataUrl = canvas.toDataURL("image/png")
          results.push({ page: p, url: dataUrl })
        }
      }

      setExtractedImages(results)
    } catch (err) {
      alert("Could not render PDF pages to images. Ensure the file is not password-protected.")
    } finally {
      setIsExtractingImages(false)
      if (pdfToImageInputRef.current) pdfToImageInputRef.current.value = ""
    }
  }

  const handleDownloadAllImagesZip = async () => {
    if (extractedImages.length === 0) return
    try {
      setIsDownloadingAllZip(true)
      const zip = new JSZip()
      extractedImages.forEach((item) => {
        const base64Data = item.url.replace(/^data:image\/png;base64,/, "")
        zip.file(`page_${item.page}.png`, base64Data, { base64: true })
      })

      const content = await zip.generateAsync({ type: "blob" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(content)
      link.download = `${pdfForImages?.name.replace(/\.pdf$/i, "") || "pdf"}_pages.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      alert("Error packaging images into ZIP.")
    } finally {
      setIsDownloadingAllZip(false)
    }
  }

  /* =========================================================================
   * 4. IMAGE CONVERTER & RESIZER (NEW!)
   * ========================================================================= */
  const [resizerFile, setResizerFile] = useState<File | null>(null)
  const [resizerPreview, setResizerPreview] = useState<string | null>(null)
  const [origWidth, setOrigWidth] = useState<number>(0)
  const [origHeight, setOrigHeight] = useState<number>(0)
  const [targetWidth, setTargetWidth] = useState<number>(0)
  const [targetHeight, setTargetHeight] = useState<number>(0)
  const [lockAspect, setLockAspect] = useState<boolean>(true)
  const [outputFormat, setOutputFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg")
  const [compressionQuality, setCompressionQuality] = useState<number>(85)
  const [isProcessingResize, setIsProcessingResize] = useState<boolean>(false)
  const [processedBlobUrl, setProcessedBlobUrl] = useState<string | null>(null)
  const [processedSizeBytes, setProcessedSizeBytes] = useState<number>(0)
  const resizerInputRef = useRef<HTMLInputElement>(null)

  const handleResizerFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file.")
      return
    }

    setResizerFile(file)
    setProcessedBlobUrl(null)
    setProcessedSizeBytes(0)

    const url = URL.createObjectURL(file)
    setResizerPreview(url)

    const img = new Image()
    img.onload = () => {
      setOrigWidth(img.naturalWidth)
      setOrigHeight(img.naturalHeight)
      setTargetWidth(img.naturalWidth)
      setTargetHeight(img.naturalHeight)
    }
    img.src = url
  }

  const handleWidthChange = (val: number) => {
    setTargetWidth(val)
    if (lockAspect && origWidth > 0) {
      const ratio = origHeight / origWidth
      setTargetHeight(Math.round(val * ratio))
    }
  }

  const handleHeightChange = (val: number) => {
    setTargetHeight(val)
    if (lockAspect && origHeight > 0) {
      const ratio = origWidth / origHeight
      setTargetWidth(Math.round(val * ratio))
    }
  }

  const applyPreset = (scale: number) => {
    if (origWidth > 0 && origHeight > 0) {
      setTargetWidth(Math.round(origWidth * scale))
      setTargetHeight(Math.round(origHeight * scale))
    }
  }

  const handleExecuteResize = async () => {
    if (!resizerPreview || targetWidth <= 0 || targetHeight <= 0) return
    setIsProcessingResize(true)

    try {
      const img = new Image()
      await new Promise((resolve) => {
        img.onload = resolve
        img.src = resizerPreview
      })

      const canvas = document.createElement("canvas")
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext("2d")

      if (!ctx) throw new Error("Could not get canvas context")

      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, targetWidth, targetHeight)
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

      const qualityDecimal = outputFormat === "image/png" ? undefined : compressionQuality / 100

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (processedBlobUrl) URL.revokeObjectURL(processedBlobUrl)
            const newUrl = URL.createObjectURL(blob)
            setProcessedBlobUrl(newUrl)
            setProcessedSizeBytes(blob.size)
          }
          setIsProcessingResize(false)
        },
        outputFormat,
        qualityDecimal
      )
    } catch (err) {
      alert("Error resizing image.")
      setIsProcessingResize(false)
    }
  }

  /* =========================================================================
   * 5. ROTATE & ORGANIZE PDF (NEW!)
   * ========================================================================= */
  const [rotateFile, setRotateFile] = useState<File | null>(null)
  const [rotatePages, setRotatePages] = useState<PdfPageRotateItem[]>([])
  const [isRenderingRotate, setIsRenderingRotate] = useState<boolean>(false)
  const [isSavingRotatedPdf, setIsSavingRotatedPdf] = useState<boolean>(false)
  const rotateInputRef = useRef<HTMLInputElement>(null)

  const handleRotateFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.")
      return
    }

    setRotateFile(file)
    setIsRenderingRotate(true)
    setRotatePages([])

    try {
      const buffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
      const count = pdfDoc.getPageCount()

      let pdfjs = (window as any).pdfjsLib
      if (!pdfjs) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          script.async = true
          script.onload = () => {
            pdfjs = (window as any).pdfjsLib
            if (pdfjs) {
              pdfjs.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
              resolve(true)
            } else {
              reject(new Error("pdfjs not loaded"))
            }
          }
          script.onerror = reject
          document.body.appendChild(script)
        })
      }

      const loadingTask = pdfjs.getDocument({ data: buffer.slice(0) })
      const doc = await loadingTask.promise

      const items: PdfPageRotateItem[] = []
      for (let i = 0; i < count; i++) {
        let preview: string | null = null
        try {
          const page = await doc.getPage(i + 1)
          const viewport = page.getViewport({ scale: 0.6 })
          const canvas = document.createElement("canvas")
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext("2d")
          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise
            preview = canvas.toDataURL("image/jpeg", 0.7)
          }
        } catch {}

        items.push({
          pageIndex: i,
          rotation: 0,
          previewUrl: preview,
          deleted: false,
        })
      }
      setRotatePages(items)
    } catch (err) {
      alert("Could not load PDF document.")
    } finally {
      setIsRenderingRotate(false)
      if (rotateInputRef.current) rotateInputRef.current.value = ""
    }
  }

  const rotatePage = (idx: number) => {
    setRotatePages((prev) => {
      const copy = [...prev]
      copy[idx] = {
        ...copy[idx],
        rotation: (copy[idx].rotation + 90) % 360,
      }
      return copy
    })
  }

  const rotateAllPages = () => {
    setRotatePages((prev) =>
      prev.map((item) => ({
        ...item,
        rotation: (item.rotation + 90) % 360,
      }))
    )
  }

  const toggleDeletePage = (idx: number) => {
    setRotatePages((prev) => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], deleted: !copy[idx].deleted }
      return copy
    })
  }

  const handleSaveRotatedPdf = async () => {
    if (!rotateFile) return
    const activePages = rotatePages.filter((p) => !p.deleted)
    if (activePages.length === 0) {
      alert("All pages have been deleted. At least 1 page is required.")
      return
    }

    setIsSavingRotatedPdf(true)
    try {
      const buffer = await rotateFile.arrayBuffer()
      const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
      const newPdf = await PDFDocument.create()

      for (const item of activePages) {
        const [copied] = await newPdf.copyPages(srcPdf, [item.pageIndex])
        if (item.rotation > 0) {
          const currentRotation = copied.getRotation().angle
          copied.setRotation(degrees((currentRotation + item.rotation) % 360))
        }
        newPdf.addPage(copied)
      }

      const bytes = await newPdf.save()
      const blob = new Blob([bytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `organized_${rotateFile.name}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert("Error saving rotated PDF.")
    } finally {
      setIsSavingRotatedPdf(false)
    }
  }

  /* =========================================================================
   * 6. TEXT / NOTES TO PDF (NEW!)
   * ========================================================================= */
  const [docTitle, setDocTitle] = useState("Meeting Notes & Document")
  const [docAuthor, setDocAuthor] = useState("")
  const [docBody, setDocBody] = useState(
    "Paste your notes, contracts, or summaries here to instantly generate a clean, printable A4 PDF.\n\n- Fully formatted and line-wrapped\n- 100% private, never uploaded to any cloud server\n- Ready to share or print instantly"
  )
  const [fontSize, setFontSize] = useState<number>(11)

  const handleExportTextToPdf = () => {
    if (!docBody.trim()) {
      alert("Please enter some text to export.")
      return
    }

    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 18
      const maxLineWidth = pageWidth - margin * 2

      let y = 24

      // Header Title
      if (docTitle.trim()) {
        doc.setFont("Helvetica", "bold")
        doc.setFontSize(18)
        doc.text(docTitle.trim(), margin, y)
        y += 8
      }

      // Author / Date subtext
      doc.setFont("Helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      const subtext = `${docAuthor ? `${docAuthor} • ` : ""}${new Date().toLocaleDateString()}`
      doc.text(subtext, margin, y)
      y += 8

      // Divider line
      doc.setDrawColor(210, 210, 210)
      doc.setLineWidth(0.3)
      doc.line(margin, y, pageWidth - margin, y)
      y += 10

      // Body text
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(fontSize)
      const lines = doc.splitTextToSize(docBody, maxLineWidth)

      lines.forEach((line: string) => {
        if (y > 275) {
          doc.addPage()
          y = 20
        }
        doc.text(line, margin, y)
        y += fontSize * 0.45
      })

      doc.save(`${docTitle.replace(/[^a-zA-Z0-9-_]/g, "_") || "document"}.pdf`)
    } catch (err) {
      alert("Error generating PDF from text.")
    }
  }

  /* =========================================================================
   * 7. DOCUMENT SCANNER (CAMERA)
   * ========================================================================= */
  const [scannerPages, setScannerPages] = useState<ScannedDocPage[]>([])
  const [isCameraActive, setIsCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      streamRef.current = stream
      setIsCameraActive(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      alert("Could not access camera. Please allow camera permissions in your browser.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      setScannerPages((prev) => [
        ...prev,
        { id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`, dataUrl },
      ])
    }
  }

  const exportScannedPdf = () => {
    if (scannerPages.length === 0) return
    const pdf = new jsPDF()
    scannerPages.forEach((page, i) => {
      if (i > 0) pdf.addPage()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      pdf.addImage(page.dataUrl, "JPEG", 5, 5, pageWidth - 10, pageHeight - 10)
    })
    pdf.save(`scan_${Date.now()}.pdf`)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Notion-Style Header */}
      <div className="space-y-4 border-b border-border/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground uppercase tracking-wider">
              <span>Client-Side Workspace</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Private
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Files &amp; PDF Tools Suite
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Split, merge, convert, resize, rotate, and scan documents directly inside your browser. No files are
              ever uploaded to a server.
            </p>
          </div>

          {/* Add to Home Screen Button */}
          <div className="flex items-center gap-2 shrink-0">
            {isInstalled ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">
                <Check className="h-3.5 w-3.5" />
                <span>App Installed</span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleInstallClick}
                className="gap-2 text-xs font-medium border-border/80 hover:bg-muted cursor-pointer"
                title="Install UL0 Files as an app on your phone or desktop"
              >
                <Smartphone className="h-4 w-4 text-foreground/80" />
                <span>Add to Home Screen</span>
              </Button>
            )}
          </div>
        </div>

        {/* Notion-style Tab Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("split")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "split"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Scissors className="h-3.5 w-3.5" />
            <span>Split PDF</span>
          </button>

          <button
            onClick={() => setActiveTab("merge")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "merge"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <FileStack className="h-3.5 w-3.5" />
            <span>Merge PDFs</span>
          </button>

          <button
            onClick={() => setActiveTab("img-to-pdf")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "img-to-pdf"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Image to PDF</span>
          </button>

          <button
            onClick={() => setActiveTab("pdf-to-img")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "pdf-to-img"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>PDF to Images</span>
          </button>

          <button
            onClick={() => setActiveTab("resize-convert")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "resize-convert"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Scaling className="h-3.5 w-3.5" />
            <span>Resize &amp; Convert</span>
          </button>

          <button
            onClick={() => setActiveTab("rotate-organize")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "rotate-organize"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Rotate PDF</span>
          </button>

          <button
            onClick={() => setActiveTab("text-to-pdf")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "text-to-pdf"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <FileEdit className="h-3.5 w-3.5" />
            <span>Text to PDF</span>
          </button>

          <button
            onClick={() => setActiveTab("scanner")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "scanner"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <ScanLine className="h-3.5 w-3.5" />
            <span>Document Scanner</span>
          </button>
        </div>
      </div>

      {/* iOS / Mobile Install Guide Modal */}
      {showIosGuide && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
              <Smartphone className="h-4 w-4" />
              <span>How to install UL0 Files on your phone</span>
            </div>
            <button
              onClick={() => setShowIosGuide(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground pt-1">
            <div className="p-2.5 rounded-md bg-muted/50 border border-border/50">
              <div className="font-semibold text-foreground mb-0.5">1. Open Safari / Chrome</div>
              <div>Navigate to this page in your mobile browser.</div>
            </div>
            <div className="p-2.5 rounded-md bg-muted/50 border border-border/50">
              <div className="font-semibold text-foreground mb-0.5">2. Tap Share / Menu</div>
              <div>Tap the browser Share icon (or three dots menu on Android).</div>
            </div>
            <div className="p-2.5 rounded-md bg-muted/50 border border-border/50">
              <div className="font-semibold text-foreground mb-0.5">3. Add to Home Screen</div>
              <div>Select &ldquo;Add to Home Screen&rdquo; to launch as a standalone app anytime.</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * TAB 1: SPLIT PDF
       * ========================================================================= */}
      {activeTab === "split" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">PDF Page Splitter</h2>
              <p className="text-xs text-muted-foreground">
                Extract individual pages, split by custom page ranges, preview every page, and
                download as single PDFs or a ZIP package.
              </p>
            </div>
            <PdfSplitterClient />
          </div>
        </div>
      )}

      {/* =========================================================================
       * TAB 2: MERGE PDFS
       * ========================================================================= */}
      {activeTab === "merge" && (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Merge Multiple PDFs</h2>
              <p className="text-xs text-muted-foreground">
                Combine separate PDF documents into a single file in the exact order you choose.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={mergeInputRef}
                type="file"
                multiple
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleMergeFilesSelected}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => mergeInputRef.current?.click()}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add PDFs</span>
              </Button>

              {mergeFiles.length >= 2 && (
                <Button
                  size="sm"
                  onClick={handleExecuteMerge}
                  disabled={isMerging}
                  className="gap-1.5 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                >
                  {isMerging ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>Merge {mergeFiles.length} PDFs</span>
                </Button>
              )}
            </div>
          </div>

          {mergeFiles.length === 0 ? (
            <div
              onClick={() => mergeInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 rounded-lg p-10 text-center space-y-3 cursor-pointer hover:border-foreground/30 hover:bg-muted/30 transition-colors"
            >
              <FileStack className="h-8 w-8 mx-auto text-muted-foreground/60" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">Click to select PDF files</div>
                <div className="text-xs text-muted-foreground">
                  Select 2 or more PDF documents to merge into one file
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground px-1">
                Reorder documents (top will be merged first):
              </div>
              <div className="divide-y divide-border border border-border rounded-md overflow-hidden bg-background">
                {mergeFiles.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-muted-foreground w-5 text-center">
                        {idx + 1}.
                      </span>
                      <span className="font-medium text-foreground truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                        {item.pageCount} {item.pageCount === 1 ? "page" : "pages"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveMergeItem(idx, -1)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={idx === mergeFiles.length - 1}
                        onClick={() => moveMergeItem(idx, 1)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeMergeItem(item.id)}
                        className="p-1 rounded text-muted-foreground hover:text-rose-500 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
       * TAB 3: IMAGE TO PDF
       * ========================================================================= */}
      {activeTab === "img-to-pdf" && (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Convert Images to PDF</h2>
              <p className="text-xs text-muted-foreground">
                Convert JPG, PNG, and WebP images into a clean multi-page PDF document.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageFilesSelected}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Images</span>
              </Button>

              {imageItems.length > 0 && (
                <Button
                  size="sm"
                  onClick={handleExecuteImageToPdf}
                  disabled={isConvertingImages}
                  className="gap-1.5 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                >
                  {isConvertingImages ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>Export PDF ({imageItems.length})</span>
                </Button>
              )}
            </div>
          </div>

          {imageItems.length === 0 ? (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 rounded-lg p-10 text-center space-y-3 cursor-pointer hover:border-foreground/30 hover:bg-muted/30 transition-colors"
            >
              <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/60" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">Click to select photos</div>
                <div className="text-xs text-muted-foreground">
                  Supports JPG, PNG, and WebP formats. Processed locally in your browser.
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {imageItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="group relative rounded-md border border-border bg-background p-2 space-y-2 text-xs"
                >
                  <div className="aspect-square w-full rounded bg-muted/40 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="truncate font-medium text-[11px] text-foreground">
                    {idx + 1}. {item.name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{(item.sizeBytes / 1024).toFixed(0)} KB</span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveImageItem(idx, -1)}
                        className="hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Move Left"
                      >
                        <MoveUp className="h-3 w-3 rotate-[-90deg]" />
                      </button>
                      <button
                        disabled={idx === imageItems.length - 1}
                        onClick={() => moveImageItem(idx, 1)}
                        className="hover:text-foreground disabled:opacity-30 cursor-pointer"
                        title="Move Right"
                      >
                        <MoveDown className="h-3 w-3 rotate-[-90deg]" />
                      </button>
                      <button
                        onClick={() => removeImageItem(item.id)}
                        className="hover:text-rose-500 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
       * TAB 4: PDF TO IMAGES
       * ========================================================================= */}
      {activeTab === "pdf-to-img" && (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Extract PDF to PNG Images</h2>
              <p className="text-xs text-muted-foreground">
                Render every page of your PDF into crisp, downloadable PNG images.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={pdfToImageInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handlePdfToImageFileSelected}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => pdfToImageInputRef.current?.click()}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload PDF</span>
              </Button>

              {extractedImages.length > 0 && (
                <Button
                  size="sm"
                  onClick={handleDownloadAllImagesZip}
                  disabled={isDownloadingAllZip}
                  className="gap-1.5 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                >
                  {isDownloadingAllZip ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>Download All as ZIP</span>
                </Button>
              )}
            </div>
          </div>

          {isExtractingImages ? (
            <div className="p-12 text-center space-y-2 text-xs text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-foreground" />
              <div>Rendering PDF pages to PNG images in browser...</div>
            </div>
          ) : extractedImages.length === 0 ? (
            <div
              onClick={() => pdfToImageInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 rounded-lg p-10 text-center space-y-3 cursor-pointer hover:border-foreground/30 hover:bg-muted/30 transition-colors"
            >
              <FileDown className="h-8 w-8 mx-auto text-muted-foreground/60" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">Click to select PDF document</div>
                <div className="text-xs text-muted-foreground">
                  Each page will be rendered into a high-resolution PNG image
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {extractedImages.map((item) => (
                <div
                  key={item.page}
                  className="rounded-md border border-border bg-background p-2 space-y-2 text-xs flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] w-full rounded bg-muted/20 overflow-hidden border border-border/40">
                    <img
                      src={item.url}
                      alt={`Page ${item.page}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-muted-foreground text-[11px]">
                      Page {item.page}
                    </span>
                    <a
                      href={item.url}
                      download={`page_${item.page}.png`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground hover:underline"
                    >
                      <Download className="h-3 w-3" />
                      <span>PNG</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
       * TAB 5: IMAGE CONVERTER & RESIZER (NEW!)
       * ========================================================================= */}
      {activeTab === "resize-convert" && (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Image Resizer &amp; Converter</h2>
              <p className="text-xs text-muted-foreground">
                Resize image dimensions, change format (PNG, JPEG, WebP), and compress file size locally.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={resizerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleResizerFileSelected}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => resizerInputRef.current?.click()}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Choose Image</span>
              </Button>
            </div>
          </div>

          {!resizerFile ? (
            <div
              onClick={() => resizerInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 rounded-lg p-10 text-center space-y-3 cursor-pointer hover:border-foreground/30 hover:bg-muted/30 transition-colors"
            >
              <Scaling className="h-8 w-8 mx-auto text-muted-foreground/60" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">Click to select an image to resize</div>
                <div className="text-xs text-muted-foreground">
                  Supports PNG, JPEG, and WebP. Resize dimensions or shrink file size.
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <div className="p-3 rounded-md border border-border bg-muted/20 space-y-1 text-xs">
                  <div className="font-semibold text-foreground">Original Image Details:</div>
                  <div className="text-muted-foreground">
                    Dimensions: <span className="font-mono text-foreground">{origWidth} × {origHeight} px</span>
                  </div>
                  <div className="text-muted-foreground">
                    Original Size: <span className="font-mono text-foreground">{(resizerFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                {/* Target Dimensions */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-foreground">Target Dimensions (pixels):</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={targetWidth}
                        onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                        className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={targetHeight}
                        onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                        className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs font-mono outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-muted-foreground pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lockAspect}
                      onChange={(e) => setLockAspect(e.target.checked)}
                      className="rounded border-border text-foreground"
                    />
                    <span>Maintain aspect ratio</span>
                  </label>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-muted-foreground">Quick scale:</span>
                    {[0.25, 0.5, 0.75, 1.0].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => applyPreset(s)}
                        className="px-2 py-0.5 rounded text-[11px] font-mono border border-border bg-muted/40 hover:bg-muted text-foreground cursor-pointer"
                      >
                        {s * 100}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Format */}
                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-foreground">Convert to Format:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "JPEG", value: "image/jpeg" },
                      { label: "PNG", value: "image/png" },
                      { label: "WebP", value: "image/webp" },
                    ].map((fmt) => (
                      <button
                        key={fmt.value}
                        type="button"
                        onClick={() => setOutputFormat(fmt.value as any)}
                        className={`py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                          outputFormat === fmt.value
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality slider */}
                {outputFormat !== "image/png" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground font-medium">Quality / Compression:</span>
                      <span className="font-mono text-muted-foreground">{compressionQuality}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={compressionQuality}
                      onChange={(e) => setCompressionQuality(parseInt(e.target.value))}
                      className="w-full accent-foreground cursor-pointer"
                    />
                  </div>
                )}

                <Button
                  size="sm"
                  onClick={handleExecuteResize}
                  disabled={isProcessingResize}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 text-xs font-medium cursor-pointer"
                >
                  {isProcessingResize ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Scaling className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  <span>Process Resize &amp; Convert</span>
                </Button>
              </div>

              {/* Preview & Download */}
              <div className="rounded-lg border border-border bg-muted/10 p-4 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-foreground">Preview Result:</div>
                  <div className="aspect-square w-full rounded bg-muted/30 border border-border flex items-center justify-center overflow-hidden p-2">
                    <img
                      src={processedBlobUrl || resizerPreview || ""}
                      alt="Resized Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                {processedBlobUrl && (
                  <div className="space-y-3 pt-2 border-t border-border/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">New File Size:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {(processedSizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>

                    <a
                      href={processedBlobUrl}
                      download={`resized_${targetWidth}x${targetHeight}.${
                        outputFormat === "image/png" ? "png" : outputFormat === "image/webp" ? "webp" : "jpg"
                      }`}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Resized Image</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
       * TAB 6: ROTATE & ORGANIZE PDF (NEW!)
       * ========================================================================= */}
      {activeTab === "rotate-organize" && (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Rotate &amp; Organize PDF Pages</h2>
              <p className="text-xs text-muted-foreground">
                Rotate sideways or upside-down pages, delete unwanted pages, and re-export a clean document.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={rotateInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleRotateFileSelected}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => rotateInputRef.current?.click()}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload PDF</span>
              </Button>

              {rotatePages.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rotateAllPages}
                    className="gap-1.5 text-xs font-medium cursor-pointer"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>Rotate All 90°</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleSaveRotatedPdf}
                    disabled={isSavingRotatedPdf}
                    className="gap-1.5 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                  >
                    {isSavingRotatedPdf ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    <span>Save PDF</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {isRenderingRotate ? (
            <div className="p-12 text-center space-y-2 text-xs text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-foreground" />
              <div>Reading PDF pages for orientation check...</div>
            </div>
          ) : rotatePages.length === 0 ? (
            <div
              onClick={() => rotateInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 rounded-lg p-10 text-center space-y-3 cursor-pointer hover:border-foreground/30 hover:bg-muted/30 transition-colors"
            >
              <RotateCw className="h-8 w-8 mx-auto text-muted-foreground/60" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">Click to select PDF document</div>
                <div className="text-xs text-muted-foreground">
                  Preview individual pages and rotate 90°, 180°, or 270°
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {rotatePages.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-md border p-2.5 space-y-2 text-xs transition-all ${
                    item.deleted
                      ? "border-rose-500/30 bg-rose-500/5 opacity-50"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="aspect-[3/4] w-full rounded bg-muted/20 overflow-hidden border border-border/40 flex items-center justify-center p-1">
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={`Page ${idx + 1}`}
                        style={{ transform: `rotate(${item.rotation}deg)` }}
                        className="max-w-full max-h-full object-contain transition-transform duration-200"
                      />
                    ) : (
                      <div className="text-muted-foreground font-mono">Page {idx + 1}</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-muted-foreground">
                      P.{idx + 1} {item.rotation > 0 ? `(${item.rotation}°)` : ""}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => rotatePage(idx)}
                        disabled={item.deleted}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Rotate 90° Clockwise"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => toggleDeletePage(idx)}
                        className={`p-1 rounded cursor-pointer ${
                          item.deleted
                            ? "text-emerald-600 hover:text-emerald-500"
                            : "text-muted-foreground hover:text-rose-500"
                        }`}
                        title={item.deleted ? "Restore Page" : "Delete Page"}
                      >
                        {item.deleted ? <RefreshCw className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
       * TAB 7: TEXT TO PDF (NEW!)
       * ========================================================================= */}
      {activeTab === "text-to-pdf" && (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Text &amp; Notes to PDF</h2>
              <p className="text-xs text-muted-foreground">
                Convert written notes, contracts, or summaries into clean formatted A4 documents.
              </p>
            </div>

            <Button
              size="sm"
              onClick={handleExportTextToPdf}
              className="gap-1.5 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export PDF Document</span>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Document Title"
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Author / Subtitle (Optional)</label>
                <input
                  type="text"
                  value={docAuthor}
                  onChange={(e) => setDocAuthor(e.target.value)}
                  placeholder="e.g. John Doe or Department"
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-foreground">Document Content</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Font Size:</span>
                  {[9, 11, 13].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                        fontSize === sz
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      {sz}pt
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={12}
                value={docBody}
                onChange={(e) => setDocBody(e.target.value)}
                placeholder="Type or paste text content here..."
                className="w-full rounded-md border border-border bg-background p-3 text-xs font-mono leading-relaxed outline-none focus:border-foreground"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * TAB 8: DOCUMENT SCANNER (CAMERA)
       * ========================================================================= */}
      {activeTab === "scanner" && (
        <div className="rounded-lg border border-border bg-card p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Mobile Document Scanner</h2>
              <p className="text-xs text-muted-foreground">
                Capture pages directly with your camera and compile into a single PDF.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isCameraActive ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startCamera}
                  className="gap-1.5 text-xs font-medium cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Start Camera</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopCamera}
                  className="gap-1.5 text-xs font-medium text-rose-500 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Stop Camera</span>
                </Button>
              )}

              {scannerPages.length > 0 && (
                <Button
                  size="sm"
                  onClick={exportScannedPdf}
                  className="gap-1.5 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export PDF ({scannerPages.length})</span>
                </Button>
              )}
            </div>
          </div>

          {/* Active Camera Viewfinder */}
          {isCameraActive && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-black max-w-md mx-auto aspect-[4/3]">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-4 border border-white/30 rounded pointer-events-none" />
              </div>
              <div className="text-center">
                <Button
                  size="sm"
                  onClick={capturePhoto}
                  className="gap-2 bg-foreground text-background hover:bg-foreground/90 cursor-pointer font-medium"
                >
                  <Camera className="h-4 w-4" />
                  <span>Capture Page ({scannerPages.length + 1})</span>
                </Button>
              </div>
            </div>
          )}

          {/* Captured Pages List */}
          {scannerPages.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Captured Pages:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {scannerPages.map((pg, idx) => (
                  <div
                    key={pg.id}
                    className="rounded border border-border p-2 space-y-1.5 bg-background text-xs"
                  >
                    <div className="aspect-[4/3] rounded overflow-hidden bg-muted">
                      <img src={pg.dataUrl} alt={`Scan ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Page {idx + 1}</span>
                      <button
                        onClick={() =>
                          setScannerPages((prev) => prev.filter((p) => p.id !== pg.id))
                        }
                        className="hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notion Callout Box: Privacy & Offline Guarantee */}
      <div className="rounded-lg border border-border bg-muted/30 p-4 flex items-start gap-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <div className="font-semibold text-foreground">Why UL0 Files is 100% Private</div>
          <div>
            Unlike standard online PDF converters that send your personal documents to unknown remote
            servers, all processing on this page runs locally in your browser using WebAssembly and
            native JavaScript. Your files never touch our servers or the cloud.
          </div>
        </div>
      </div>
    </div>
  )
}
