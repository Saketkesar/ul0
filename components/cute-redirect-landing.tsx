"use client"

import React, { useEffect, useState, useCallback } from "react"
import { ExternalLink, Sparkles, ShieldCheck, ArrowRight, Heart, Zap } from "lucide-react"
import { AdBanner } from "@/components/ad-banner"

interface CuteRedirectLandingProps {
  longUrl: string
  domain: string | null
  customHost?: string | null
  brandLogoUrl?: string | null
  customMessage?: string | null
}

export function CuteRedirectLanding({
  longUrl,
  domain,
  customHost,
  brandLogoUrl,
  customMessage,
}: CuteRedirectLandingProps) {
  const [countdown, setCountdown] = useState(6)
  const [progress, setProgress] = useState(0)

  const redirect = useCallback(() => {
    window.location.href = longUrl
  }, [longUrl])

  // 6 second timer countdown
  useEffect(() => {
    const totalTime = 6
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const remaining = Math.max(0, Math.ceil(totalTime - elapsed))
      const pct = Math.min(100, (elapsed / totalTime) * 100)

      setCountdown(remaining)
      setProgress(pct)

      if (remaining <= 0) {
        clearInterval(interval)
        redirect()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [redirect])

  // Extract friendly display domain
  let displayDomain = domain || "destination site"
  try {
    const parsed = new URL(longUrl)
    displayDomain = parsed.hostname.replace(/^www\./, "")
  } catch {}

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-teal-50/70 via-sky-50/40 to-white px-4 py-8 text-neutral-800 overflow-hidden font-sans">
      {/* Hidden background Ads: Ads load and execute telemetry in background without disturbing user */}
      <div
        className="opacity-0 pointer-events-none fixed -bottom-[9999px] -left-[9999px] w-0 h-0 overflow-hidden"
        aria-hidden="true"
        tabIndex={-1}
      >
        <AdBanner slot={1} type="large" />
        <AdBanner slot={2} type="small" />
      </div>

      {/* Floating cute ambient background blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-teal-200/35 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse delay-700" />
      <div className="absolute top-10 right-1/3 w-48 h-48 bg-teal-100/40 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Top Header / Branding */}
      <header className="w-full max-w-md flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {brandLogoUrl ? (
            <img src={brandLogoUrl} alt="Logo" className="h-7 w-auto object-contain rounded" />
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-teal-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span className="text-xs font-semibold text-teal-800 tracking-tight">UL0 Safe Link</span>
            </div>
          )}
        </div>
        <div className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700/80 bg-teal-100/60 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>No Ads · Clean Page</span>
        </div>
      </header>

      {/* Central Cute Redirect Card */}
      <main className="w-full max-w-md my-auto">
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-7 sm:p-9 shadow-xl shadow-teal-900/5 border border-teal-100 text-center space-y-6 transition-all">
          {/* Cute Animated Mascot / Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-emerald-400 rounded-3xl rotate-6 opacity-20 animate-pulse" />
            <div className="relative w-full h-full bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
              <Sparkles className="w-10 h-10 animate-bounce" />
            </div>
            {/* Countdown Badge */}
            <div className="absolute -bottom-2 -right-2 bg-neutral-900 text-white font-mono text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white tabular-nums">
              {countdown}s
            </div>
          </div>

          {/* Cute Headline & Message */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">
              <Heart className="w-3.5 h-3.5 text-teal-500 fill-teal-500" />
              <span>{customMessage || "Hang tight! You are being redirected..."}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Redirecting in{" "}
              <span className="text-teal-600 font-mono tabular-nums">{countdown}</span> seconds
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
              We&apos;re taking you directly to your clean destination with zero clutter or popups.
            </p>
          </div>

          {/* Smooth Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200/50">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400 px-1">
              <span>Scanning link...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Destination Preview Card */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-left flex items-center justify-between gap-3 group hover:border-teal-300 transition-colors">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Destination Target
              </p>
              <p className="text-xs font-mono font-medium text-neutral-800 truncate" title={longUrl}>
                {displayDomain}
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                Verified
              </span>
            </div>
          </div>

          {/* Skip Wait Action Button */}
          <button
            type="button"
            onClick={redirect}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <span>Redirect Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer reassurance */}
      <footer className="w-full max-w-md text-center pt-4">
        <p className="text-[11px] text-neutral-400 inline-flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-teal-500" />
          <span>Powered by UL0 Edge Engine · Fast, secure, privacy-first</span>
        </p>
      </footer>
    </div>
  )
}
