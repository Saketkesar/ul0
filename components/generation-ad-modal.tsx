"use client"

import React, { useState, useEffect, useRef } from "react"
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
  className = "",
}: {
  slotKey: string
  width: number
  height: number
  id: string
  className?: string
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
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: flex-start; background: transparent; overflow: hidden; }
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
      className={`rounded-[14px] bg-[#F6F6F6] border border-[#C8CDC8] overflow-hidden shadow-2xs flex items-center justify-center ${className}`}
      style={{ width: `${width}px` }}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Outer Modal Container - PURE WHITE BACKGROUND matching user diagram */}
      <div className="relative w-full max-w-[960px] max-h-[95vh] overflow-y-auto rounded-[28px] bg-white text-[#0B1A17] border border-[#D3E2DD] shadow-2xl p-4 sm:p-6 flex flex-col items-center">
        {/* Top Header / Close bar */}
        <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[#E4E2DA]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B685C] animate-pulse" />
            <span className="text-[13px] sm:text-[14px] font-bold text-[#0B1A17] tracking-tight">
              {title}
            </span>
          </div>

          {isDone ? (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F4FAF8] hover:bg-[#EAF7F3] border border-[#D3E2DD] text-[#0B1A17] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[11px] font-mono font-bold text-[#1B685C] bg-[#DDF5EE] px-3 py-1 rounded-full border border-[#3DDBB8]/30">
              Processing...
            </span>
          )}
        </div>

        {/* =====================================================================
            PLACEMENT GUIDE CANVAS (900x500 Stage)
            - Clean White background so animated black doodle arrows & text are crystal clear
            - Animated WebP in the center with arrows pointing outwards to the 4 corners
            - 4 Corner Ad Frames placed exactly where the arrows point (matching media_1795419095655_42207e60.png)
        ====================================================================== */}
        <div className="w-full flex flex-col items-center justify-center my-auto overflow-x-auto py-2">
          {/* Desktop & Tablet: Exact 900x500 Canvas Matching User Placement Guide */}
          <div className="hidden md:block relative w-[900px] h-[500px] shrink-0 bg-white rounded-[20px] overflow-hidden select-none border border-[#E4E2DA]/80 shadow-xs">
            {/* 1. The Animated WebP Image (Shows UL0 Center Logo + 4 Animated Arrows + Doodle Texts) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ul0-ad-arrows-with-logo.webp"
              alt="UL0 Generating"
              className="absolute inset-0 w-[900px] h-[500px] object-cover pointer-events-none select-none z-10"
            />

            {/* 2. TOP-LEFT AD SLOT (Where arrow "ads! don't click" points) */}
            <div className="absolute left-[34px] top-[20px] z-20 w-[171px] h-[130px] rounded-[16px] border border-[#C8CDC8] bg-[#F6F6F6] overflow-hidden shadow-2xs flex items-center justify-center">
              <SandboxedAdFrame
                id="top-left"
                slotKey={AD_SLOTS.topLeft.key}
                width={160}
                height={300}
                className="border-none bg-transparent"
              />
            </div>

            {/* 3. BOTTOM-LEFT AD SLOT (Where arrow "also an ad" points) */}
            <div className="absolute left-[34px] top-[350px] z-20 w-[171px] h-[140px] rounded-[16px] border border-[#C8CDC8] bg-[#F6F6F6] overflow-hidden shadow-2xs flex items-center justify-center">
              <SandboxedAdFrame
                id="bottom-left"
                slotKey={AD_SLOTS.bottomLeft.key}
                width={160}
                height={300}
                className="border-none bg-transparent"
              />
            </div>

            {/* 4. TOP-RIGHT AD SLOT (Where arrow "ad too, skip" points) */}
            <div className="absolute right-[34px] top-[20px] z-20 w-[171px] h-[130px] rounded-[16px] border border-[#C8CDC8] bg-[#F6F6F6] overflow-hidden shadow-2xs flex items-center justify-center">
              <SandboxedAdFrame
                id="top-right"
                slotKey={AD_SLOTS.topRight.key}
                width={160}
                height={600}
                className="border-none bg-transparent"
              />
            </div>

            {/* 5. BOTTOM-RIGHT AD SLOT (Where arrow "nope, ad!" points) */}
            <div className="absolute right-[34px] top-[350px] z-20 w-[171px] h-[140px] rounded-[16px] border border-[#C8CDC8] bg-[#F6F6F6] overflow-hidden shadow-2xs flex items-center justify-center">
              <SandboxedAdFrame
                id="bottom-right"
                slotKey={AD_SLOTS.bottomRight.key}
                width={160}
                height={300}
                className="border-none bg-transparent"
              />
            </div>
          </div>

          {/* Mobile Screen Fallback (< 768px): Responsive Stacked Layout */}
          <div className="md:hidden w-full flex flex-col items-center gap-4 bg-white p-2">
            <div className="relative w-full max-w-[400px] aspect-[900/500] bg-white rounded-[16px] overflow-hidden border border-[#E4E2DA]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ul0-ad-arrows-with-logo.webp"
                alt="UL0 Generating"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-[10px] text-[#5E726C] uppercase font-mono tracking-widest">Sponsored Partner</span>
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

          {/* ===================================================================
              PROGRESS BAR UNDER THE GRAPHIC (2-4s view guarantee)
          ==================================================================== */}
          <div className="w-full max-w-[620px] space-y-2.5 px-4 pt-6 text-center">
            <div className="flex items-center justify-between text-xs font-mono text-[#0B1A17]">
              <span className="flex items-center gap-1.5 font-bold">
                {isDone ? (
                  <>
                    <Check className="w-4 h-4 text-[#1B685C]" strokeWidth={2.5} />
                    <span className="text-[#1B685C]">Generation complete!</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-[#1B685C] animate-spin" />
                    <span>Rendering assets...</span>
                  </>
                )}
              </span>
              <span className="font-bold text-[#1B685C]">{progress}%</span>
            </div>

            {/* Progress track */}
            <div className="w-full h-3 rounded-full bg-[#EAF2EE] overflow-hidden p-0.5 border border-[#D3E2DD]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1B685C] via-[#3DDBB8] to-[#87D474] transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-[11px] text-[#5E726C] pt-0.5">
              Free tools powered by non-intrusive sponsor ads. Thank you for supporting UL0!
            </p>

            {/* Action Button once ready */}
            {isDone && (
              <div className="pt-2 flex justify-center animate-in zoom-in-95 duration-200">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>View Generated Result</span>
                  <Sparkles className="w-4 h-4 text-[#3DDBB8]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
