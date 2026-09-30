"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { PDFDocument } from "pdf-lib"
import JSZip from "jszip"
import {
  Upload,
  FileText,
  Download,
  CheckSquare,
  Square,
  Edit2,
  Trash2,
  Layers,
  Archive,
  RefreshCw,
  Loader2,
  ArrowDownToLine,
  Eye,
  Check,
  Split,
  FileCheck,
  SlidersHorizontal,
  LayoutList,
  LayoutGrid,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageItem {
  pageNumber: number // 1-indexed
  originalName: string
  customName: string
  previewUrl: string | null
  selected: boolean
  isRendering: boolean
}

export function PdfSplitterClient() {
  const [file, setFile] = useState<File | null>(null)
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [pages, setPages] = useState<PageItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [statusMessage, setStatusMessage] = useState<string>("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [isProcessingZip, setIsProcessingZip] = useState<boolean>(false)
  const [isMergingSelected, setIsMergingSelected] = useState<boolean>(false)
  const [batchPrefix, setBatchPrefix] = useState<string>("")
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfJsLoadedRef = useRef<boolean>(false)

  // Dynamically load PDF.js from cdnjs
  useEffect(() => {
    if (typeof window === "undefined" || pdfJsLoadedRef.current) return

    if ((window as any).pdfjsLib) {
      pdfJsLoadedRef.current = true
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
    script.async = true
    script.onload = () => {
      if ((window as any).pdfjsLib) {
        ;(window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
        pdfJsLoadedRef.current = true
      }
    }
    document.body.appendChild(script)

    return () => {
      // Keep script in document
    }
  }, [])

  // Process loaded PDF file
  const handlePdfUpload = async (uploadedFile: File) => {
    if (!uploadedFile || uploadedFile.type !== "application/pdf") {
      alert("Please upload a valid PDF file.")
      return
    }

    try {
      setIsLoading(true)
      setStatusMessage("Reading PDF document...")
      setFile(uploadedFile)

      const buffer = await uploadedFile.arrayBuffer()
      setFileBuffer(buffer)

      // Load using pdf-lib to get exact page count and verify integrity
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
      const count = pdfDoc.getPageCount()
      setTotalPages(count)

      const baseCleanName = uploadedFile.name.replace(/\.pdf$/i, "")
      setBatchPrefix(`${baseCleanName}_page`)

      // Initialize page items
      const initialPages: PageItem[] = Array.from({ length: count }, (_, i) => ({
        pageNumber: i + 1,
        originalName: `${baseCleanName}_page_${i + 1}`,
        customName: `${baseCleanName}_page_${i + 1}`,
        previewUrl: null,
        selected: false,
        isRendering: true,
      }))
      setPages(initialPages)
      setStatusMessage(`Found ${count} pages. Generating visual previews...`)

      // Render previews using PDF.js in background
      renderThumbnails(buffer, count, initialPages)
    } catch (err: any) {
      console.error("PDF upload error:", err)
      alert("Failed to load PDF: " + (err.message || "Invalid or password-protected PDF."))
      setIsLoading(false)
    }
  }

  // Render thumbnail previews for all pages
  const renderThumbnails = async (buffer: ArrayBuffer, total: number, currentPages: PageItem[]) => {
    const pdfjsLib = (window as any).pdfjsLib
    if (!pdfjsLib) {
      // Retry in 500ms if script still loading
      setTimeout(() => renderThumbnails(buffer, total, currentPages), 500)
      return
    }

    try {
      const loadingTask = pdfjsLib.getDocument({ data: buffer })
      const pdf = await loadingTask.promise

      for (let i = 1; i <= total; i++) {
        try {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 0.6 }) // crisp thumbnail
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")
          canvas.height = viewport.height
          canvas.width = viewport.width

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise
            const dataUrl = canvas.toDataURL("image/jpeg", 0.8)

            setPages((prev) =>
              prev.map((p) => (p.pageNumber === i ? { ...p, previewUrl: dataUrl, isRendering: false } : p))
            )
          }
        } catch (pageErr) {
          console.error(`Error rendering page ${i}:`, pageErr)
          setPages((prev) => prev.map((p) => (p.pageNumber === i ? { ...p, isRendering: false } : p)))
        }
      }
    } catch (err) {
      console.error("Error generating thumbnails:", err)
    } finally {
      setIsLoading(false)
      setStatusMessage("")
    }
  }

  // File Drop Handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfUpload(e.dataTransfer.files[0])
    }
  }

  // Toggle page selection
  const togglePageSelection = (pageNumber: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p))
    )
  }

  // Select all / Deselect all
  const selectAll = (select: boolean) => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: select })))
  }

  // Invert selection
  const invertSelection = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: !p.selected })))
  }

  // Update custom name for single page
  const handleNameChange = (pageNumber: number, newName: string) => {
    setPages((prev) =>
      prev.map((p) => (p.pageNumber === pageNumber ? { ...p, customName: newName } : p))
    )
  }

  // Apply batch rename
  const applyBatchRename = () => {
    if (!batchPrefix.trim()) return
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        customName: `${batchPrefix.trim()}_${p.pageNumber}`,
      }))
    )
    setShowBatchModal(false)
  }

  // Trigger browser download for a Blob
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1500)
  }

  // Download a single page as a standalone PDF
  const downloadSinglePage = async (pageNumber: number, customName: string) => {
    if (!fileBuffer) return

    try {
      const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true })
      const newDoc = await PDFDocument.create()

      // pageNumber is 1-indexed, pdf-lib is 0-indexed
      const [copiedPage] = await newDoc.copyPages(srcDoc, [pageNumber - 1])
      newDoc.addPage(copiedPage)

      const pdfBytes = await newDoc.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
      const finalName = customName.trim() || `page_${pageNumber}`
      triggerDownload(blob, finalName)
    } catch (err: any) {
      console.error("Single page download error:", err)
      alert("Error exporting page: " + err.message)
    }
  }

  // Download selected pages as a single merged PDF
  const mergeSelectedPages = async () => {
    const selected = pages.filter((p) => p.selected)
    if (selected.length === 0 || !fileBuffer) {
      alert("Please select at least 1 page to merge.")
      return
    }

    try {
      setIsMergingSelected(true)
      const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true })
      const mergedDoc = await PDFDocument.create()

      const indices = selected.map((p) => p.pageNumber - 1)
      const copiedPages = await mergedDoc.copyPages(srcDoc, indices)

      for (const page of copiedPages) {
        mergedDoc.addPage(page)
      }

      const pdfBytes = await mergedDoc.save()
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" })

      const baseName = file?.name.replace(/\.pdf$/i, "") || "document"
      const pageListStr = selected.map((p) => p.pageNumber).join("-")
      const finalName = `${baseName}_selected_pages_${selected.length}.pdf`

      triggerDownload(blob, finalName)
    } catch (err: any) {
      console.error("Merge error:", err)
      alert("Failed to merge selected pages: " + err.message)
    } finally {
      setIsMergingSelected(false)
    }
  }

  // Download selected pages (or all pages) as a ZIP file containing individual PDFs
  const downloadAsZip = async (onlySelected: boolean) => {
    if (!fileBuffer) return

    const targetPages = onlySelected ? pages.filter((p) => p.selected) : pages
    if (targetPages.length === 0) {
      alert("No pages selected for download.")
      return
    }

    try {
      setIsProcessingZip(true)
      const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true })
      const zip = new JSZip()

      for (const p of targetPages) {
        const singleDoc = await PDFDocument.create()
        const [copiedPage] = await singleDoc.copyPages(srcDoc, [p.pageNumber - 1])
        singleDoc.addPage(copiedPage)
        const pdfBytes = await singleDoc.save()

        const cleanName = (p.customName.trim() || `page_${p.pageNumber}`).replace(/\.pdf$/i, "")
        zip.file(`${cleanName}.pdf`, pdfBytes)
      }

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const baseName = file?.name.replace(/\.pdf$/i, "") || "document"
      const zipName = onlySelected
        ? `${baseName}_selected_${targetPages.length}_pages.zip`
        : `${baseName}_all_${targetPages.length}_pages.zip`

      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = zipName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1500)
    } catch (err: any) {
      console.error("ZIP generation error:", err)
      alert("Failed to create ZIP package: " + err.message)
    } finally {
      setIsProcessingZip(false)
    }
  }

  const selectedCount = pages.filter((p) => p.selected).length

  return (
    <div className="w-full space-y-8">
      {/* Upload Box (if no file loaded) */}
      {!file && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border hover:border-primary/60 transition-all rounded-3xl p-10 sm:p-16 text-center cursor-pointer bg-card/60 hover:bg-card/90 shadow-sm group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handlePdfUpload(e.target.files[0])
              }
            }}
          />
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Upload Multi-Page PDF to Split
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Drag &amp; drop any PDF (e.g. 5, 10, 30, or 100+ pages). Preview every page line-by-line, rename, and download single pages or selected batches.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm">
            Choose PDF File
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            🔒 100% Private &amp; Client-Side — Your files never leave your browser.
          </p>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-6 rounded-2xl border border-border bg-card text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm font-medium text-foreground">{statusMessage}</p>
        </div>
      )}

      {/* PDF Pages Management Workspace */}
      {file && pages.length > 0 && (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Total <span className="font-semibold text-foreground">{totalPages} Pages</span> •{" "}
                  <span className="font-semibold text-primary">{selectedCount} Selected</span>
                </p>
              </div>
            </div>

            {/* Quick Actions & View Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectAll(true)}
                className="text-xs h-8 gap-1.5 rounded-lg"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                Select All
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => selectAll(false)}
                className="text-xs h-8 gap-1.5 rounded-lg"
              >
                <Square className="h-3.5 w-3.5" />
                Deselect All
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBatchModal(true)}
                className="text-xs h-8 gap-1.5 rounded-lg"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Batch Rename
              </Button>

              {/* View Switcher */}
              <div className="flex items-center rounded-lg border border-border bg-muted p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                  title="Line-by-line List View"
                >
                  <LayoutList className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                  title="Grid Card View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>

              {/* Reset / Change File */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null)
                  setFileBuffer(null)
                  setPages([])
                }}
                className="text-xs h-8 text-destructive hover:bg-destructive/10"
              >
                Change PDF
              </Button>
            </div>
          </div>

          {/* Action Banner for Selected Pages */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-medium text-foreground">
              {selectedCount === 0 ? (
                <span>Click any checkbox below to select pages for merged or ZIP export.</span>
              ) : (
                <span>
                  🎉 You have selected <strong className="text-primary">{selectedCount} pages</strong>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Merge Selected */}
              <Button
                size="sm"
                disabled={selectedCount < 2 || isMergingSelected}
                onClick={mergeSelectedPages}
                className="text-xs h-8 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                {isMergingSelected ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Layers className="h-3.5 w-3.5" />
                )}
                Merge {selectedCount > 1 ? `${selectedCount} Pages` : "Selected"}
              </Button>

              {/* Download Selected as ZIP */}
              <Button
                size="sm"
                variant="outline"
                disabled={selectedCount === 0 || isProcessingZip}
                onClick={() => downloadAsZip(true)}
                className="text-xs h-8 gap-1.5 rounded-lg border-primary/30 text-primary hover:bg-primary/10"
              >
                {isProcessingZip ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Archive className="h-3.5 w-3.5" />
                )}
                Download Selected ({selectedCount}) as ZIP
              </Button>

              {/* Download All as ZIP */}
              <Button
                size="sm"
                variant="outline"
                disabled={isProcessingZip}
                onClick={() => downloadAsZip(false)}
                className="text-xs h-8 gap-1.5 rounded-lg"
              >
                <ArrowDownToLine className="h-3.5 w-3.5" />
                Download All {totalPages} Pages (ZIP)
              </Button>
            </div>
          </div>

          {/* Batch Rename Modal */}
          {showBatchModal && (
            <div className="p-4 rounded-2xl border border-border bg-card space-y-3 animate-in fade-in-50 duration-200">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-primary" />
                <span>Batch Rename All Pages</span>
              </h4>
              <p className="text-xs text-muted-foreground">
                Enter a prefix. Each page will be named: <code>[prefix]_[page_number].pdf</code>
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={batchPrefix}
                  onChange={(e) => setBatchPrefix(e.target.value)}
                  placeholder="e.g. quarterly_invoice_page"
                  className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" onClick={applyBatchRename} className="h-8 text-xs rounded-xl">
                  Apply to All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowBatchModal(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* LIST VIEW (Line by Line Display of All 30 Pages)               */}
          {/* ============================================================== */}
          {viewMode === "list" ? (
            <div className="space-y-3">
              {pages.map((p) => (
                <div
                  key={p.pageNumber}
                  className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    p.selected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  {/* Left: Checkbox + Page Badge + Preview */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => togglePageSelection(p.pageNumber)}
                      className="text-primary focus:outline-none shrink-0"
                    >
                      {p.selected ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>

                    <div className="flex items-center justify-center h-8 w-12 rounded-lg bg-muted text-foreground text-xs font-mono font-bold shrink-0">
                      #{p.pageNumber}
                    </div>

                    {/* Thumbnail preview */}
                    <div className="h-16 w-12 rounded-lg border border-border bg-background overflow-hidden flex items-center justify-center shrink-0">
                      {p.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.previewUrl}
                          alt={`Page ${p.pageNumber}`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Page {p.pageNumber} of {totalPages}
                      </span>
                      <p className="text-xs font-mono text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                        {p.customName}.pdf
                      </p>
                    </div>
                  </div>

                  {/* Middle: Editable Name Input */}
                  <div className="w-full sm:flex-1 max-w-sm">
                    <div className="relative">
                      <input
                        type="text"
                        value={p.customName}
                        onChange={(e) => handleNameChange(p.pageNumber, e.target.value)}
                        placeholder={`page_${p.pageNumber}`}
                        className="w-full pl-3 pr-10 py-1.5 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-foreground"
                      />
                      <span className="absolute right-2.5 top-1.5 text-[11px] font-mono text-muted-foreground pointer-events-none">
                        .pdf
                      </span>
                    </div>
                  </div>

                  {/* Right: Individual Single Page Download Button */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                      size="sm"
                      onClick={() => downloadSinglePage(p.pageNumber, p.customName)}
                      className="text-xs h-8 gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs shrink-0"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Page {p.pageNumber}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ============================================================== */
            /* GRID VIEW (Thumbnail Cards for All Pages)                      */
            /* ============================================================== */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((p) => (
                <div
                  key={p.pageNumber}
                  className={`rounded-2xl border p-3 flex flex-col justify-between transition-all ${
                    p.selected
                      ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => togglePageSelection(p.pageNumber)}
                      className="text-primary focus:outline-none"
                    >
                      {p.selected ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-foreground">
                      #{p.pageNumber}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div
                    onClick={() => togglePageSelection(p.pageNumber)}
                    className="aspect-[3/4] w-full rounded-xl border border-border bg-background overflow-hidden flex items-center justify-center cursor-pointer mb-2"
                  >
                    {p.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.previewUrl}
                        alt={`Page ${p.pageNumber}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  {/* Editable Name */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={p.customName}
                      onChange={(e) => handleNameChange(p.pageNumber, e.target.value)}
                      className="w-full px-2 py-1 text-[11px] bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary font-mono truncate"
                      title={p.customName}
                    />

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadSinglePage(p.pageNumber, p.customName)}
                      className="w-full text-[11px] h-7 gap-1 rounded-lg"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
