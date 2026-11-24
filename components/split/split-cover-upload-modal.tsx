"use client"

import React, { useState, useRef } from "react"
import { Upload, X, Shield, Image as ImageIcon, ExternalLink, Check, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface SplitCoverUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploaded: (imageUrl: string) => void
  currentUrl?: string
  title?: string
}

export function SplitCoverUploadModal({
  isOpen,
  onClose,
  onUploaded,
  currentUrl = "",
  title = "Upload Split Cover Backdrop",
}: SplitCoverUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (file: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WebP).")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be under 5MB.")
      return
    }
    setError(null)
    setSelectedFile(file)
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
  }

  const handleUpload = async () => {
    if (!selectedFile && !previewUrl) {
      setError("Please select an image first.")
      return
    }

    if (!selectedFile && previewUrl) {
      // If user kept existing or pasted URL
      onUploaded(previewUrl)
      onClose()
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile!)

      const res = await fetch("/api/groups/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.")
      }

      toast.success("Cover backdrop uploaded successfully!")
      onUploaded(data.url)
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to upload image to host.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-[500px] rounded-[28px] bg-white text-[#0B1A17] border border-[#D3E2DD] shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E4E2DA]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B685C]" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#0B1A17]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4FAF8] hover:bg-[#EAF7F3] border border-[#D3E2DD] flex items-center justify-center cursor-pointer text-[#0B1A17]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FreeImage.host Infrastructure Notice */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#F4FAF8] border border-[#D3E2DD] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1B685C]">
            <Shield className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
            <span>Hosted securely on FreeImage.host</span>
          </div>
          <p className="text-[12px] text-[#5E726C] leading-relaxed">
            To keep UL0 ultra-fast, zero-cost, and privacy-respecting, media files are stored directly on FreeImage.host. UL0 only stores verified links so our infrastructure stays ultra-lean.
          </p>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dropzone */}
        <div className="mt-4 space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleFileChange(file)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              isDragOver
                ? "border-[#1B685C] bg-[#DDF5EE]"
                : "border-[#D3E2DD] bg-[#FAFCFB] hover:border-[#1B685C] hover:bg-[#F4FAF8]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFileChange(f)
              }}
            />

            {previewUrl ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Cover Preview"
                  className="w-full h-36 object-cover rounded-xl border border-[#D3E2DD]"
                />
                <span className="text-[11px] font-bold text-[#1B685C] block">
                  Tap to choose a different photo
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#DDF5EE] text-[#1B685C] flex items-center justify-center">
                  <Upload className="w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0B1A17] block">
                    Choose an image or drag &amp; drop
                  </span>
                  <span className="text-[11px] text-[#5E726C] block mt-0.5">
                    JPG, PNG, or WebP up to 5MB
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 h-11 rounded-full border-[#D3E2DD] text-xs font-bold text-[#0B1A17] hover:bg-[#F4FAF8] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || (!selectedFile && !previewUrl)}
              className="flex-1 h-11 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-xs font-bold cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-50"
            >
              {isUploading ? "Uploading to FreeImage..." : "Save Image →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
