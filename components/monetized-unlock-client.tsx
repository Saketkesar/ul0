"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { AdBanner } from "@/components/ad-banner"
import type { BlogArticle } from "@/lib/blog-data"

interface Props {
  slug: string
  title: string
  targetUrl: string
  currentStep: number
  totalSteps: number
  article: BlogArticle
}

export function MonetizedUnlockClient({
  slug,
  title,
  targetUrl,
  currentStep,
  totalSteps,
  article,
}: Props) {
  const router = useRouter()
  const [secondsLeft, setSecondsLeft] = useState(10)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const isFinalStep = currentStep >= totalSteps
  const progressPercent = Math.round((currentStep / totalSteps) * 100)

  // 10s Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsUnlocked(true)
      return
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsUnlocked(true)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsLeft])

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.innerHeight + window.scrollY
      const docHeight = document.documentElement.offsetHeight
      if (scrollPos >= docHeight - 300 || window.scrollY > 350) {
        setHasScrolled(true)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNextStep = () => {
    if (!isUnlocked) return
    const nextStep = currentStep + 1
    router.push(`/m/${slug}?step=${nextStep}`)
  }

  const scrollToUnlock = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* ──────── TOP STICKY PROGRESS HEADER ──────── */}
      <div className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md px-4 py-3">
        <div className="container mx-auto max-w-4xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/ul0.png"
                alt="ul0"
                width={65}
                height={22}
                className="h-5 w-auto object-contain invert"
              />
            </Link>
            <span className="text-neutral-600 dark:text-neutral-700">•</span>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 font-semibold">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="hidden sm:inline truncate max-w-xs text-neutral-300">
                {title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <button
                onClick={handleNextStep}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 animate-pulse"
              >
                <span>{isFinalStep ? "Get Final Link" : "Next Step"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={scrollToUnlock}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs flex items-center gap-1.5 hover:bg-neutral-700 transition-colors"
              >
                <Clock className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                <span>{secondsLeft}s left</span>
                <ChevronDown className="h-3 w-3 text-neutral-500" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-800 h-1 mt-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <main className="container mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* ──────── TOP ADSTERRA AD BANNER ──────── */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col items-center justify-center min-h-[100px] overflow-hidden">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-mono">
            Advertisement • Scroll down to continue
          </span>
          <AdBanner type="large" />
        </div>

        {/* ──────── FLOATING / IN-PAGE UNLOCK INSTRUCTION NOTICE ──────── */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              {isUnlocked ? (
                <Unlock className="h-5 w-5 text-emerald-400" />
              ) : (
                <Lock className="h-5 w-5 text-amber-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                {isUnlocked
                  ? "Step Complete! You can proceed now."
                  : `Step ${currentStep}/${totalSteps}: Please read or scroll while link unlocks`}
              </p>
              <p className="text-xs text-neutral-400">
                {isUnlocked
                  ? isFinalStep
                    ? "Click the button below to reach your target download / destination link."
                    : `Click continue to go to step ${currentStep + 1} of ${totalSteps}.`
                  : `Waiting timer: ${secondsLeft}s • Scroll down to unlock button`}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {!isUnlocked && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-medium">
                <Clock className="h-3.5 w-3.5 animate-pulse" />
                <span>00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</span>
              </div>
            )}
            {isUnlocked && (
              <button
                onClick={handleNextStep}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <span>{isFinalStep ? "Open Final Link →" : `Continue to Step ${currentStep + 1} →`}</span>
              </button>
            )}
          </div>
        </div>

        {/* ──────── BLOG ARTICLE CONTENT ──────── */}
        <article className="p-6 sm:p-8 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 space-y-6">
          <header className="space-y-3 border-b border-neutral-800 pb-5">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                {article.category}
              </span>
              <span>•</span>
              <span>{article.readTime}</span>
              <span>•</span>
              <span>{article.date}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100 leading-snug">
              {article.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {article.subtitle}
            </p>
          </header>

          {/* Section 1 */}
          {article.sections.slice(0, 1).map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-neutral-200">
                {sec.heading}
              </h2>
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {p}
                </p>
              ))}
              {sec.bulletPoints && (
                <ul className="space-y-1.5 my-3 pl-2">
                  {sec.bulletPoints.map((bp, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-neutral-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* ──────── MID-CONTENT ADSTERRA BANNER ──────── */}
          <div className="my-6 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col items-center justify-center min-h-[90px] overflow-hidden">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-mono">
              Sponsored Content
            </span>
            <AdBanner type="small" />
          </div>

          {/* Remaining Sections */}
          {article.sections.slice(1).map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-neutral-200">
                {sec.heading}
              </h2>
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {p}
                </p>
              ))}
              {sec.tip && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs sm:text-sm text-emerald-300 flex items-start gap-2.5 my-3">
                  <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{sec.tip}</span>
                </div>
              )}
            </div>
          ))}

          {/* ──────── BOTTOM UNLOCK ACTION ZONE ──────── */}
          <div
            ref={bottomRef}
            className="pt-6 border-t border-neutral-800 space-y-4"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-800/50 to-neutral-900 border border-neutral-700/60 text-center space-y-4 shadow-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                {isUnlocked ? (
                  <Unlock className="h-6 w-6 text-emerald-400" />
                ) : (
                  <Clock className="h-6 w-6 text-amber-400 animate-spin" />
                )}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-100">
                  {isUnlocked
                    ? isFinalStep
                      ? "🎉 Link Unlocked & Ready!"
                      : `Step ${currentStep} Completed!`
                    : `Unlocking in ${secondsLeft} seconds...`}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                  {isUnlocked
                    ? isFinalStep
                      ? "Your final target URL is verified and ready to visit."
                      : `Click the button below to proceed to step ${currentStep + 1} of ${totalSteps}.`
                    : "Please wait for the timer countdown to complete to unlock your destination link."}
                </p>
              </div>

              <div className="pt-2">
                {isUnlocked ? (
                  <button
                    onClick={handleNextStep}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 mx-auto"
                  >
                    <span>
                      {isFinalStep
                        ? "🚀 Proceed to Final Destination Link"
                        : `Continue to Step ${currentStep + 1} →`}
                    </span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-400 text-sm font-medium flex items-center justify-center gap-2 mx-auto cursor-not-allowed opacity-70"
                  >
                    <Clock className="h-4 w-4 text-amber-400 animate-spin" />
                    <span>Please wait {secondsLeft} seconds...</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* ──────── BOTTOM ADSTERRA AD BANNER ──────── */}
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col items-center justify-center min-h-[100px] overflow-hidden">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-mono">
            Advertisement
          </span>
          <AdBanner type="large" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Protected Link • Powered by ul0.site</span>
          <span className="font-mono text-[11px]">Safe & Verified Interstitial</span>
        </div>
      </footer>
    </div>
  )
}
