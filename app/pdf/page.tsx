"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { jsPDF } from "jspdf"
import { PDFDocument } from "pdf-lib"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AdBanner } from "@/components/ad-banner"
import { autoCropToCanvas, applyFilter, getScanner } from "@/lib/scanner"
import {
  Camera,
  ImagePlus,
  FileStack,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Loader2,
  ScanLine,
  X,
  RotateCw,
} from "lucide-react"

type FilterMode = "color" | "gray" | "bw"

interface ScanPage {
  id: string
  dataUrl: string
  width: number
  height: number
}

type Tab = "scan" | "merge"

const uid = () => Math.random().toString(36).slice(2, 10)

function canvasToPage(canvas: HTMLCanvasElement): ScanPage {
  return {
    id: uid(),
    dataUrl: canvas.toDataURL("image/jpeg", 0.92),
    width: canvas.width,
    height: canvas.height,
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export default function PdfToolPage() {
  const [tab, setTab] = useState<Tab>("scan")
  const [pages, setPages] = useState<ScanPage[]>([])
  const [filter, setFilter] = useState<FilterMode>("color")
  const [autoCrop, setAutoCrop] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [fileName, setFileName] = useState("ul0-scan")

  // Camera state
  const [cameraOn, setCameraOn] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Export / download-ready state
  const [exported, setExported] = useState<{ url: string; name: string } | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  // "granted" | "denied" | "prompt" | null (null = unsupported/unknown)
  const [permissionState, setPermissionState] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  // File input with capture="environment" — lets the OS camera app open directly,
  // completely bypassing the browser's getUserMedia permission system.
  const cameraFileInputRef = useRef<HTMLInputElement>(null)

  // Query camera permission state on mount and watch for changes.
  useEffect(() => {
    if (typeof navigator === "undefined") return
    if (!navigator.permissions?.query) return
    navigator.permissions
      .query({ name: "camera" as PermissionName })
      .then((status) => {
        setPermissionState(status.state)
        // Show the pre-emptive warning immediately if already denied.
        if (status.state === "denied") setCameraError("permission_denied")
        status.onchange = () => {
          setPermissionState(status.state)
          // Clear the error automatically when the user grants permission.
          if (status.state === "granted") setCameraError(null)
          if (status.state === "denied") setCameraError("permission_denied")
        }
      })
      .catch(() => {/* Permissions API not supported — ignore */})
  }, [])

  // Warm up the scanner engine in the background when auto-crop is enabled.
  useEffect(() => {
    if (autoCrop) getScanner()
  }, [autoCrop])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOn(false)
    // Don't clear cameraError here — if permission is denied we keep showing
    // the instructions even after the stream stops.
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  const processCanvasToPage = useCallback(
    async (source: HTMLImageElement | HTMLCanvasElement) => {
      let canvas: HTMLCanvasElement
      if (autoCrop) {
        canvas = await autoCropToCanvas(source)
      } else {
        canvas = document.createElement("canvas")
        const w = source instanceof HTMLImageElement ? source.naturalWidth : source.width
        const h = source instanceof HTMLImageElement ? source.naturalHeight : source.height
        canvas.width = w
        canvas.height = h
        canvas.getContext("2d")!.drawImage(source, 0, 0, w, h)
      }
      applyFilter(canvas, filter)
      return canvasToPage(canvas)
    },
    [autoCrop, filter],
  )

  const onAddImages = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      setBusy("Processing images...")
      try {
        const newPages: ScanPage[] = []
        for (const file of Array.from(files)) {
          if (!file.type.startsWith("image/")) continue
          const url = URL.createObjectURL(file)
          try {
            const img = await loadImage(url)
            newPages.push(await processCanvasToPage(img))
          } finally {
            URL.revokeObjectURL(url)
          }
        }
        setPages((prev) => [...prev, ...newPages])
      } finally {
        setBusy(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        if (cameraFileInputRef.current) cameraFileInputRef.current.value = ""
      }
    },
    [processCanvasToPage],
  )

  const startCamera = useCallback(async () => {
    // If the browser already has a hard "denied" block, opening getUserMedia will
    // immediately throw NotAllowedError. Skip the attempt entirely and show the
    // step-by-step instructions instead — trying again would just frustrate.
    if (permissionState === "denied") {
      setCameraError("permission_denied")
      return
    }

    setCameraError(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported by your browser or environment. Use 'Add Images' or 'Use OS Camera' instead.")
      return
    }

    try {
      let stream: MediaStream
      try {
        // Prefer high-resolution back camera (ideal for document scanning).
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        })
      } catch {
        // Fall back to any available camera.
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      }

      streamRef.current = stream
      setCameraOn(true)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
      }, 50)
    } catch (err: any) {
      console.error("Camera error:", err)
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionState("denied")
        setCameraError("permission_denied")
      } else {
        setCameraError("Could not access the camera. Please ensure it's not in use by another app, or try 'Use OS Camera' below.")
      }
    }
  }, [permissionState])

  const capture = useCallback(async () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    setBusy("Scanning...")
    try {
      const frame = document.createElement("canvas")
      frame.width = video.videoWidth
      frame.height = video.videoHeight
      frame.getContext("2d")!.drawImage(video, 0, 0)
      const page = await processCanvasToPage(frame)
      setPages((prev) => [...prev, page])
    } finally {
      setBusy(null)
    }
  }, [processCanvasToPage])

  const movePage = useCallback((index: number, dir: -1 | 1) => {
    setPages((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }, [])

  const rotatePage = useCallback(async (index: number) => {
    setPages((prev) => prev)
    const page = pages[index]
    if (!page) return
    const img = await loadImage(page.dataUrl)
    const canvas = document.createElement("canvas")
    canvas.width = img.naturalHeight
    canvas.height = img.naturalWidth
    const ctx = canvas.getContext("2d")!
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(Math.PI / 2)
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
    const rotated = canvasToPage(canvas)
    setPages((prev) => prev.map((p, i) => (i === index ? rotated : p)))
  }, [pages])

  const removePage = useCallback((id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const safeName = useCallback(() => {
    const base = fileName.trim().replace(/\.pdf$/i, "").replace(/[^\w\-]+/g, "-") || "ul0-scan"
    return `${base}.pdf`
  }, [fileName])

  const exportImagesToPdf = useCallback(async () => {
    if (pages.length === 0) return
    setBusy("Building PDF...")
    try {
      let pdf: jsPDF | null = null
      for (const page of pages) {
        const orientation = page.width >= page.height ? "landscape" : "portrait"
        if (!pdf) {
          pdf = new jsPDF({ orientation, unit: "px", format: [page.width, page.height] })
        } else {
          pdf.addPage([page.width, page.height], orientation)
        }
        pdf.addImage(page.dataUrl, "JPEG", 0, 0, page.width, page.height, undefined, "FAST")
      }
      const blob = pdf!.output("blob")
      const url = URL.createObjectURL(blob)
      setExported({ url, name: safeName() })
    } finally {
      setBusy(null)
    }
  }, [pages, safeName])

  const onMergePdfs = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      if (files.length < 2) {
        alert("Select at least two PDF files to merge.")
        return
      }
      setBusy("Merging PDFs...")
      try {
        const merged = await PDFDocument.create()
        for (const file of Array.from(files)) {
          const bytes = await file.arrayBuffer()
          const src = await PDFDocument.load(bytes, { ignoreEncryption: true })
          const copied = await merged.copyPages(src, src.getPageIndices())
          copied.forEach((p) => merged.addPage(p))
        }
        const out = await merged.save()
        const blob = new Blob([out], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)
        setExported({ url, name: safeName() })
      } catch (err) {
        console.error("Merge error:", err)
        alert("Could not merge these PDFs. Make sure they are valid, unencrypted PDF files.")
      } finally {
        setBusy(null)
        if (pdfInputRef.current) pdfInputRef.current.value = ""
      }
    },
    [safeName],
  )

  const resetExport = useCallback(() => {
    if (exported) URL.revokeObjectURL(exported.url)
    setExported(null)
  }, [exported])

  // ---------- Download-ready screen (ads shown after export) ----------
  if (exported) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <AdBanner slot={1} type="large" />
          <section className="container mx-auto px-4 py-10 max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <FileStack className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your PDF is ready!</h1>
            <p className="text-muted-foreground mb-6">
              Tap download to save <span className="font-medium text-foreground">{exported.name}</span> to your device.
            </p>

            <AdBanner slot={2} type="small" />

            <div className="my-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={exported.url}
                download={exported.name}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
              <Button variant="outline" onClick={resetExport} className="h-11 px-8">
                Create another
              </Button>
            </div>

            <AdBanner slot={3} type="large" />
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  // ---------- Main tool ----------
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ScanLine className="h-7 w-7 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold">Free PDF Scanner &amp; Tools</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Scan documents with your camera (auto edge-detection &amp; auto-crop), turn images into PDFs, and merge,
              reorder &amp; rename files. 100% free, private, and runs entirely in your browser.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button variant={tab === "scan" ? "default" : "outline"} onClick={() => setTab("scan")} className="gap-2">
              <Camera className="h-4 w-4" /> Scan / Images → PDF
            </Button>
            <Button variant={tab === "merge" ? "default" : "outline"} onClick={() => setTab("merge")} className="gap-2">
              <FileStack className="h-4 w-4" /> Merge PDFs
            </Button>
          </div>

          {tab === "scan" && (
            <div className="space-y-6">
              {/* Controls */}
              <Card>
                <CardContent className="p-4 flex flex-wrap items-center gap-3">
                  <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                    <ImagePlus className="h-4 w-4" /> Add Images
                  </Button>
                  {/* Standard hidden file input for gallery images */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onAddImages(e.target.files)}
                  />
                  {/* OS camera fallback — uses the native camera app, bypasses
                      getUserMedia entirely so browser permission state doesn't matter. */}
                  <input
                    ref={cameraFileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => onAddImages(e.target.files)}
                  />

                  {permissionState === "denied" ? (
                    // Permission is hard-blocked: offer the OS camera fallback prominently.
                    <Button
                      variant="outline"
                      onClick={() => cameraFileInputRef.current?.click()}
                      className="gap-2 border-amber-500/60 text-amber-700 hover:bg-amber-50"
                    >
                      <Camera className="h-4 w-4" /> Use OS Camera
                    </Button>
                  ) : !cameraOn ? (
                    <Button variant="outline" onClick={startCamera} className="gap-2">
                      <Camera className="h-4 w-4" /> Open Camera
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={stopCamera} className="gap-2">
                      <X className="h-4 w-4" /> Close Camera
                    </Button>
                  )}

                  <label className="flex items-center gap-2 text-sm ml-auto cursor-pointer select-none">
                    <input type="checkbox" checked={autoCrop} onChange={(e) => setAutoCrop(e.target.checked)} />
                    Auto-crop (edge detection)
                  </label>

                  <div className="flex items-center gap-1 text-sm">
                    {(["color", "gray", "bw"] as FilterMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setFilter(m)}
                        className={`rounded-md px-3 py-1.5 border transition-colors ${
                          filter === m ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"
                        }`}
                      >
                        {m === "color" ? "Color" : m === "gray" ? "Grayscale" : "B&W"}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Camera Error / Permission Instructions */}
              {cameraError && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 text-amber-600">
                      <Camera className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-300 mb-1">
                        {cameraError === "permission_denied"
                          ? "Camera permission is blocked"
                          : "Camera access error"}
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                        {cameraError === "permission_denied"
                          ? "Your browser has blocked camera access for this site. You have two options: fix the permission in browser settings, or use the OS camera workaround below (no permission needed)."
                          : cameraError}
                      </p>
                    </div>
                  </div>

                  {cameraError === "permission_denied" && (
                    <>
                      {/* Workaround: OS camera (always works regardless of browser permission) */}
                      <div className="rounded-md border border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-700 p-3">
                        <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2 uppercase tracking-wide">
                          ✅ Quickest fix — Use OS Camera (no permission required)
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-400 mb-3">
                          This opens your phone or laptop camera app directly, bypassing the browser's permission system entirely.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => cameraFileInputRef.current?.click()}
                          className="gap-2 bg-green-600 hover:bg-green-700 text-white border-none h-8 text-xs"
                        >
                          <Camera className="h-3.5 w-3.5" /> Open OS Camera
                        </Button>
                      </div>

                      {/* Manual fix instructions */}
                      <div className="text-xs text-muted-foreground space-y-2 border-t border-amber-200 dark:border-amber-700 pt-3">
                        <p className="font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide text-[10px]">
                          Or fix browser permission manually:
                        </p>
                        <ul className="space-y-1.5 list-none pl-0">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-amber-700 mt-0.5">Chrome / Edge / Brave:</span>
                            <span>Click the <strong>lock / settings icon</strong> left of the address bar → <strong>Site settings</strong> → set Camera to <strong>Allow</strong> → reload the page.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-amber-700 mt-0.5">Firefox:</span>
                            <span>Click the <strong>camera icon</strong> in the address bar (or the shield icon) → click <strong>Blocked Temporarily</strong> → choose <strong>Allow</strong> → reload.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-amber-700 mt-0.5">Safari (iPhone/iPad):</span>
                            <span>Go to <strong>Settings → Safari → Camera</strong> → set to <strong>Allow</strong> → reload this page.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-amber-700 mt-0.5">Safari (Mac):</span>
                            <span>Go to <strong>Safari menu → Settings → Websites → Camera</strong> → find ul0.site → set to <strong>Allow</strong>.</span>
                          </li>
                        </ul>
                        <div className="flex gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setCameraError(null); setPermissionState(null) }}
                            className="h-7 text-xs"
                          >
                            Dismiss
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={startCamera}
                            className="h-7 text-xs"
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {cameraError !== "permission_denied" && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setCameraError(null)} className="h-8 text-xs">
                        Dismiss
                      </Button>
                      <Button size="sm" onClick={startCamera} className="h-8 text-xs">
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Camera viewport */}
              {cameraOn && (
                <Card>
                  <CardContent className="p-4">
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <video ref={videoRef} playsInline muted className="w-full max-h-[60vh] object-contain" />
                    </div>
                    <div className="mt-3 flex justify-center">
                      <Button onClick={capture} disabled={!!busy} className="gap-2">
                        <ScanLine className="h-4 w-4" /> Capture Page
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pages */}
              {pages.length > 0 ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold">{pages.length} page{pages.length > 1 ? "s" : ""}</h2>
                      <Button variant="ghost" size="sm" onClick={() => setPages([])} className="text-destructive gap-1">
                        <Trash2 className="h-4 w-4" /> Clear all
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {pages.map((page, i) => (
                        <div key={page.id} className="group relative rounded-lg border overflow-hidden bg-muted/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={page.dataUrl} alt={`Page ${i + 1}`} className="w-full h-40 object-contain bg-white" />
                          <span className="absolute top-1 left-1 rounded bg-black/60 text-white text-xs px-1.5 py-0.5">
                            {i + 1}
                          </span>
                          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-background/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => movePage(i, -1)} title="Move up">
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => movePage(i, 1)} title="Move down">
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => rotatePage(i)} title="Rotate">
                              <RotateCw className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removePage(page.id)} title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Filename + export */}
                    <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <label htmlFor="pdfname" className="text-sm text-muted-foreground whitespace-nowrap">File name</label>
                        <input
                          id="pdfname"
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                          placeholder="ul0-scan"
                        />
                        <span className="text-sm text-muted-foreground">.pdf</span>
                      </div>
                      <Button onClick={exportImagesToPdf} disabled={!!busy} className="gap-2">
                        <Download className="h-4 w-4" /> Export PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                !cameraOn && (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <ScanLine className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>Add images or open your camera to start building a PDF.</p>
                  </div>
                )
              )}
            </div>
          )}

          {tab === "merge" && (
            <Card>
              <CardContent className="p-6 text-center">
                <FileStack className="h-10 w-10 mx-auto mb-3 text-primary" />
                <h2 className="font-semibold mb-1">Merge multiple PDFs into one</h2>
                <p className="text-muted-foreground text-sm mb-5">
                  Select two or more PDF files. They&apos;ll be combined in the order you pick them, fully in your browser.
                </p>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => onMergePdfs(e.target.files)}
                />
                <Button onClick={() => pdfInputRef.current?.click()} disabled={!!busy} className="gap-2">
                  <FileStack className="h-4 w-4" /> Select PDFs to Merge
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* SEO content */}
        <section className="border-t bg-muted/20">
          <div className="container mx-auto px-4 py-10 max-w-3xl">
            <h2 className="text-xl font-bold mb-4">Free PDF Scanner, Maker &amp; Merger</h2>
            <p className="text-sm text-muted-foreground mb-6">
              ul0&apos;s PDF tool turns your phone or laptop camera into a document scanner with automatic edge detection
              and auto-crop, just like premium scanner apps. Convert photos and images (JPG, PNG) into a clean multi-page
              PDF, merge several PDFs into one file, reorder or rotate pages, apply a grayscale or black-and-white scan
              filter, and rename your file before downloading. Everything happens locally in your browser, so your
              documents never leave your device.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Is this PDF scanner really free?</h3>
                <p className="text-sm text-muted-foreground">Yes. There&apos;s no signup, no watermark, and no limits. It&apos;s 100% free.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Are my documents uploaded to a server?</h3>
                <p className="text-sm text-muted-foreground">No. Scanning, conversion and merging all run on your device for full privacy.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">How does auto-crop work?</h3>
                <p className="text-sm text-muted-foreground">We detect the largest document shape in the frame and straighten it automatically. If detection isn&apos;t possible, the full image is used.</p>
              </div>
            </div>
          </div>
        </section>

        {busy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="flex items-center gap-3 rounded-lg border bg-card px-6 py-4 shadow-lg">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">{busy}</span>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
