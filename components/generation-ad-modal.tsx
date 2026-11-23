"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Check, Loader2, Sparkles, X } from "lucide-react"

interface GenerationAdModalProps {
  isOpen: boolean
  onClose?: () => void
  onComplete?: () => void
  title?: string
  durationSec?: number // Default 3.2s (within 2-4s range)
}

const AD_DOMAIN = "https://bauval.org/22"

const AD_SLOTS = {
  topLeft: { key: "25084f2a22060ec74cff3a46dbf2fb73", width: 160, height: 300, label: "Partner Ad" },
  bottomLeft: { key: "25084f2a22060ec74cff3a46dbf2fb73", width: 160, height: 300, label: "Partner Ad" },
  topRight: { key: "25084f2a22060ec74cff3a46dbf2fb73", width: 160, height: 300, label: "Partner Ad" },
  bottomRight: { key: "25084f2a22060ec74cff3a46dbf2fb73", width: 160, height: 300, label: "Partner Ad" },
  banner: { key: "1ef074fb53b9c298ba4b329b92f27240", width: 468, height: 60, label: "Partner Ad" },
}

function SandboxedAdFrame({
  slotKey,
  width,
  height,
  id,
}: {
  slotKey: string
  width: number
  height: number
  id: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.innerHTML = ""

    // Create fully sandboxed iframe to prevent top-navigation hijacking or escape
    const iframe = document.createElement("iframe")
    iframe.id = `gen-ad-${id}-${slotKey}`
    iframe.width = `${width}`
    iframe.height = `${height}`
    iframe.style.width = `${width}px`
    iframe.style.height = `${height}px`
    iframe.style.border = "none"
    iframe.style.overflow = "hidden"
    iframe.scrolling = "no"
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms")
    el.appendChild(iframe)

    try {
      const doc = iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <base target="_blank">
              <style>
                * { box-sizing: border-box; }
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key': '${slotKey}',
                  'format': 'iframe',
                  'height': ${height},
                  'width': ${width},
                  'params': {}
                };
              </script>
              <script type="text/javascript" src="${AD_DOMAIN}/${slotKey}"></script>
            </body>
          </html>
        `)
        doc.close()
      }
    } catch (e) {
      console.error("SandboxedAdFrame error:", e)
    }

    return () => {
      if (el) el.innerHTML = ""
    }
  }, [slotKey, width, height, id])

  return (
    <div
      ref={containerRef}
      className="rounded-[10px] bg-white/5 border border-slate-200/20 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-sm"
      style={{ width, height }}
    />
  )
}

export function GenerationAdModal({
  isOpen,
  onClose,
  onComplete,
  title = "Generating output...",
  durationSec = 3.2,
}: GenerationAdModalProps) {
  const [progress, setProgress] = useState<number>(0)
  const [isDone, setIsDone] = useState<boolean>(false)
  const startTimeRef = useRef<number | null>(null)
  const reqIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setIsDone(false)
      startTimeRef.current = null
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current)
      return
    }

    startTimeRef.current = performance.now()
    const totalMs = durationSec * 1000

    const update = (now: number) => {
      if (!startTimeRef.current) return
      const elapsed = now - startTimeRef.current
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100))
      setProgress(pct)

      if (pct < 100) {
        reqIdRef.current = requestAnimationFrame(update)
      } else {
        setIsDone(true)
        if (onComplete) {
          // Slight 300ms pause so user sees 100% complete
          setTimeout(() => {
            onComplete()
          }, 350)
        }
      }
    }

    reqIdRef.current = requestAnimationFrame(update)

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current)
    }
  }, [isOpen, durationSec, onComplete])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Outer Modal Container */}
      <div className="relative w-full max-w-[1040px] max-h-[92vh] overflow-y-auto rounded-[24px] bg-[#0E1513] text-white border border-[#233530] shadow-2xl p-4 sm:p-8 flex flex-col items-center">
        {/* Top Header / Close bar */}
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3DDBB8] animate-pulse" />
            <span className="text-[13px] sm:text-[14px] font-semibold text-white tracking-tight">
              {title}
            </span>
          </div>

          {isDone ? (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[11px] font-mono text-[#3DDBB8] bg-[#3DDBB8]/10 px-2.5 py-1 rounded-full border border-[#3DDBB8]/20">
              Processing...
            </span>
          )}
        </div>

        {/* =====================================================================
            PLACEMENT GUIDE LAYOUT:
            - Center: /ul0-ad-arrows-with-logo.webp
            - 4 Corner Ads (Top-Left, Bottom-Left, Top-Right, Bottom-Right)
        ====================================================================== */}
        <div className="w-full flex flex-col items-center justify-center my-auto">
          {/* Desktop & Tablet: 3-column Layout matching user diagram */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6">
            {/* Left Ad Column (Top-Left & Bottom-Left) */}
            <div className="hidden lg:flex flex-col gap-6 items-center shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Sponsored</span>
                <SandboxedAdFrame
                  id="top-left"
                  slotKey={AD_SLOTS.topLeft.key}
                  width={AD_SLOTS.topLeft.width}
                  height={AD_SLOTS.topLeft.height}
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Sponsored</span>
                <SandboxedAdFrame
                  id="bottom-left"
                  slotKey={AD_SLOTS.bottomLeft.key}
                  width={AD_SLOTS.bottomLeft.width}
                  height={AD_SLOTS.bottomLeft.height}
                />
              </div>
            </div>

            {/* Center Area: UL0 WebP Graphic with arrows + Progress Bar */}
            <div className="flex flex-col items-center max-w-[540px] w-full text-center space-y-4">
              <div className="relative w-full rounded-[16px] overflow-hidden bg-black/40 border border-white/10 p-2 sm:p-4 shadow-inner flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ul0-ad-arrows-with-logo.webp"
                  alt="UL0 Generating Result"
                  className="w-full max-h-[320px] object-contain rounded-[12px]"
                />
              </div>

              {/* Progress Bar under the WebP Graphic (2-4s view guarantee) */}
              <div className="w-full space-y-2 px-2 sm:px-6">
                <div className="flex items-center justify-between text-[12px] font-mono text-white/80">
                  <span className="flex items-center gap-1.5 font-medium">
                    {isDone ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#3DDBB8]" strokeWidth={2.5} />
                        <span className="text-[#3DDBB8]">Generation complete!</span>
                      </>
                    ) : (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-[#3DDBB8] animate-spin" />
                        <span>Rendering assets...</span>
                      </>
                    )}
                  </span>
                  <span className="font-bold text-[#3DDBB8]">{progress}%</span>
                </div>

                {/* Progress track */}
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1B685C] via-[#3DDBB8] to-[#87D474] transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-[11px] text-white/50 pt-0.5">
                  Free tools powered by non-intrusive sponsor ads. Thank you for supporting UL0!
                </p>
              </div>

              {/* Action Button once ready */}
              {isDone && (
                <div className="pt-2 animate-in zoom-in-95 duration-200">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white font-semibold text-[13px] flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>View Generated Result</span>
                    <Sparkles className="w-4 h-4 text-[#3DDBB8]" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Ad Column (Top-Right & Bottom-Right) */}
            <div className="hidden lg:flex flex-col gap-6 items-center shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Sponsored</span>
                <SandboxedAdFrame
                  id="top-right"
                  slotKey={AD_SLOTS.topRight.key}
                  width={AD_SLOTS.topRight.width}
                  height={AD_SLOTS.topRight.height}
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Sponsored</span>
                <SandboxedAdFrame
                  id="bottom-right"
                  slotKey={AD_SLOTS.bottomRight.key}
                  width={AD_SLOTS.bottomRight.width}
                  height={AD_SLOTS.bottomRight.height}
                />
              </div>
            </div>
          </div>

          {/* Mobile / Tablet Responsive Fallback Ad Banners */}
          <div className="lg:hidden w-full flex flex-col items-center gap-4 mt-6 pt-4 border-t border-white/10">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Sponsored</span>
            <div className="w-full max-w-[468px] overflow-hidden flex justify-center">
              <SandboxedAdFrame
                id="mobile-banner-1"
                slotKey={AD_SLOTS.banner.key}
                width={AD_SLOTS.banner.width}
                height={AD_SLOTS.banner.height}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
