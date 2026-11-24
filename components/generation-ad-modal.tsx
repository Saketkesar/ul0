"use client"

import React, { useState, useEffect, useRef } from "react"
import { ArrowRight, Check, X } from "lucide-react"

interface GenerationAdModalProps {
  isOpen: boolean
  onClose?: () => void
  onComplete?: () => void
  title?: string
  minDurationSec?: number // Default 5.0s (user requirement: at least 5s wait)
  durationSec?: number // Deprecated alias
  isReady?: boolean // Whether the real backend operation has completed (defaults to true)
  buttonText?: string // Clear CTA label
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
  minDurationSec = 5.0,
  durationSec,
  isReady = true,
  buttonText = "Continue to Result →",
}: GenerationAdModalProps) {
  const [progress, setProgress] = useState<number>(0)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [remainingSec, setRemainingSec] = useState<number>(5)
  const startTimeRef = useRef<number | null>(null)
  const reqIdRef = useRef<number | null>(null)
  const isReadyRef = useRef<boolean>(isReady)

  useEffect(() => {
    isReadyRef.current = isReady
  }, [isReady])

  // At least 5 seconds minimum wait guarantee
  const effectiveMinMs = Math.max(5000, (minDurationSec ?? durationSec ?? 5.0) * 1000)

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setIsDone(false)
      setRemainingSec(Math.ceil(effectiveMinMs / 1000))
      startTimeRef.current = null
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current)
      return
    }

    startTimeRef.current = performance.now()

    const update = (now: number) => {
      if (!startTimeRef.current) return
      const elapsed = now - startTimeRef.current
      const left = Math.max(0, Math.ceil((effectiveMinMs - elapsed) / 1000))
      setRemainingSec(left)

      const timeFraction = Math.min(1.0, elapsed / effectiveMinMs)

      if (!isReadyRef.current) {
        // Real operation still processing: cap progress at 92% smoothly
        const capped = Math.min(92, Math.round(timeFraction * 92))
        setProgress(capped)
        reqIdRef.current = requestAnimationFrame(update)
      } else {
        // Real operation is ready!
        if (elapsed < effectiveMinMs) {
          // Still need to meet minimum 5s sponsor view time
          const currentPct = Math.min(99, Math.round(timeFraction * 100))
          setProgress(currentPct)
          reqIdRef.current = requestAnimationFrame(update)
        } else {
          // Both 5s minimum elapsed AND real task is ready!
          setProgress(100)
          setIsDone(true)
        }
      }
    }

    reqIdRef.current = requestAnimationFrame(update)

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current)
    }
  }, [isOpen, effectiveMinMs])

  // Auto trigger action once done (instant download / reveal without requiring button click!)
  useEffect(() => {
    if (isDone) {
      const timer = setTimeout(() => {
        handleAction()
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [isDone])

  // Keyboard shortcut: Press Enter to trigger action when ready
  useEffect(() => {
    if (!isOpen || !isDone) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleAction()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isDone])

  const handleAction = () => {
    if (onComplete) onComplete()
    if (onClose) onClose()
  }

  if (!isOpen) return null

  // Dynamic engineering stage description
  let stageDescription = "Initializing pipeline..."
  if (isDone) {
    stageDescription = "Processing complete · Ready"
  } else if (!isReady) {
    if (progress < 40) stageDescription = "Extracting source data..."
    else if (progress < 70) stageDescription = "Compiling document structure..."
    else stageDescription = "Awaiting server render..."
  } else {
    if (progress < 40) stageDescription = "Parsing data structure..."
    else if (progress < 75) stageDescription = "Generating high-res assets..."
    else stageDescription = "Finalizing output package..."
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Outer Modal Container - PURE WHITE BACKGROUND matching user diagram */}
      <div className="relative w-full max-w-[960px] max-h-[95vh] overflow-y-auto rounded-[28px] bg-white text-[#0B1A17] border border-[#D3E2DD] shadow-2xl p-4 sm:p-6 flex flex-col items-center">
        {/* Top Header / Close bar */}
        <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[#E4E2DA]">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isDone ? "bg-[#1B685C]" : "bg-[#1B685C] animate-pulse"}`} />
            <span className="text-[13px] sm:text-[14px] font-bold text-[#0B1A17] tracking-tight">
              {title}
            </span>
          </div>

          {isDone ? (
            <button
              onClick={handleAction}
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

          {/* Mobile Screen (< 768px): Exact 540x960 Canvas Matching User Placement Guide media_1795507019737_c2734770.png */}
          <div className="md:hidden relative w-full max-w-[340px] aspect-[540/960] bg-white rounded-[20px] overflow-hidden select-none border border-[#E4E2DA]/80 shadow-xs my-2">
            {/* The Animated Mobile WebP Image (UL0 Center Logo + Top & Bottom Doodle Arrows) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ul0-ad-arrows-mobile-with-logo.webp"
              alt="UL0 Generating"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-10"
            />

            {/* Top Ad Slot (Where arrow "ads! don't click" points UP) - left: 8.8%, top: 2.5%, w: 82.4%, h: 26.8% */}
            <div className="absolute left-[8.8%] top-[2.5%] z-20 w-[82.4%] h-[26.8%] rounded-[16px] border border-[#C8CDC8] bg-[#F6F6F6] overflow-hidden shadow-2xs flex items-center justify-center">
              <SandboxedAdFrame
                id="mobile-top-slot"
                slotKey={AD_SLOTS.topLeft.key}
                width={160}
                height={300}
                className="border-none bg-transparent"
              />
            </div>

            {/* Bottom Ad Slot (Where arrow "ad too, skip" points DOWN) - left: 8.8%, bottom: 2.5%, w: 82.4%, h: 35% */}
            <div className="absolute left-[8.8%] bottom-[2.5%] z-20 w-[82.4%] h-[35%] rounded-[16px] border border-[#C8CDC8] bg-[#F6F6F6] overflow-hidden shadow-2xs flex items-center justify-center">
              <SandboxedAdFrame
                id="mobile-bottom-slot"
                slotKey={AD_SLOTS.bottomLeft.key}
                width={160}
                height={300}
                className="border-none bg-transparent"
              />
            </div>
          </div>

          {/* ===================================================================
              TECHNICAL PROGRESS BAR (5s min guarantee + real wait)
          ==================================================================== */}
          <div className="w-full max-w-[620px] pt-5 pb-2 px-4 space-y-3">
            {/* Stage info & counter */}
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isDone ? "bg-[#1B685C]" : "bg-[#1B685C] animate-pulse"}`} />
                <span className="font-bold text-[#0B1A17] tracking-tight">{stageDescription}</span>
              </div>
              <span className="font-bold font-mono text-xs px-2.5 py-0.5 rounded-md bg-[#F4FAF8] border border-[#D3E2DD] text-[#1B685C]">
                {isDone ? "100%" : `${progress}%`}
              </span>
            </div>

            {/* Precision Progress Bar - Solid Pine Emerald */}
            <div className="w-full h-2 rounded-full bg-[#EAF2EE] overflow-hidden border border-[#D3E2DD]">
              <div
                className="h-full rounded-full bg-[#1B685C] transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status footer line */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#5E726C]">
              <span>UL0 Engine · In-memory processing</span>
              <span>
                {isDone ? (
                  <span className="text-[#1B685C] font-bold">Ready</span>
                ) : !isReady && progress >= 90 ? (
                  <span className="text-[#1B685C] font-semibold animate-pulse">Rendering output...</span>
                ) : remainingSec > 0 ? (
                  <span>~{remainingSec}s wait</span>
                ) : (
                  <span>Completing...</span>
                )}
              </span>
            </div>

            {/* The Action Button - Clean, Tactile, No Sparkles, No AI clichés */}
            {isDone && (
              <div className="pt-3 flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
                <button
                  type="button"
                  onClick={handleAction}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#1B685C] hover:bg-[#145248] text-white font-bold text-sm tracking-tight transition-all active:scale-[0.98] cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>{buttonText}</span>
                  <ArrowRight className="w-4 h-4 text-[#3DDBB8]" strokeWidth={2.5} />
                </button>
                <span className="text-[11px] font-mono text-[#5E726C]">Press Enter ↵ to continue</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
