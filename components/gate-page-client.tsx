"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, CheckCircle2, ArrowRight, ShieldCheck, Loader2, Sparkles, AlertCircle, ChevronDown } from "lucide-react"
import { AdBanner } from "@/components/ad-banner"
import { Button } from "@/components/ui/button"

interface GatePageClientProps {
  alias: string
  currentStep: number // 0-indexed
  totalSteps: number
  gateTimerSeconds?: number
  destinationDomain: string
  children: React.ReactNode
}

export function GatePageClient({
  alias,
  currentStep,
  totalSteps,
  gateTimerSeconds = 15,
  destinationDomain,
  children,
}: GatePageClientProps) {
  const [secondsLeft, setSecondsLeft] = useState(gateTimerSeconds)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const actionSectionRef = useRef<HTMLDivElement>(null)

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsUnlocked(true)
      return
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsUnlocked(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [secondsLeft])

  // Scroll to bottom action
  const scrollToContinue = () => {
    actionSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle advance step or destination redirect
  const handleAdvance = async () => {
    if (!isUnlocked || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/marketing/gate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to continue. Please try again.")
      }

      if (data.isComplete && data.destinationUrl) {
        // Final destination reached
        window.location.href = data.destinationUrl
        return
      }

      // Next step - reload page to hydrate next step session
      window.location.reload()
    } catch (err: any) {
      console.error("Gate progression error:", err)
      setErrorMessage(err.message || "An error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  const isFinalStep = currentStep + 1 >= totalSteps
  const stepNumber = currentStep + 1
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100))

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Top Floating Progress Bar & Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
        {/* Step Progress Line */}
        <div className="w-full bg-muted/40 h-1">
          <div
            className="bg-emerald-500 h-1 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-2">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" target="_blank" rel="noopener noreferrer">
            <Image
              src="/ul0.png"
              alt="ul0 Logo"
              width={72}
              height={26}
              className="h-6 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Center Step Indicator */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                Step {stepNumber} of {totalSteps}
              </span>
            </div>
          </div>

          {/* Right Status / Jump Button */}
          <div className="flex items-center gap-2">
            {!isUnlocked ? (
              <button
                onClick={scrollToContinue}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/80 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                title="Scroll down to unlock"
              >
                <Clock className="h-3.5 w-3.5 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
                <span>{secondsLeft}s left</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={scrollToContinue}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all shadow-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Ready</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Top Ad Unit */}
        <section className="w-full bg-muted/20 border-b border-border/50 py-3 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block mb-1.5">
              Advertisement
            </span>
            <div className="overflow-hidden flex justify-center items-center min-h-[90px]">
              <AdBanner type="large" slot={1} />
            </div>
          </div>
        </section>

        {/* Real Embedded Blog Article */}
        <div className="gate-embedded-article [&>div>header]:hidden [&>div>footer]:hidden [&_a[href='/blog']]:hidden [&>div]:min-h-0 [&>div]:bg-transparent">
          {children}
        </div>

        {/* Middle Ad Unit */}
        <section className="container mx-auto max-w-4xl px-4 my-8">
          <div className="rounded-xl border border-border/60 bg-muted/10 p-4 text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block mb-2">
              Sponsored Recommendation
            </span>
            <div className="overflow-hidden flex justify-center items-center min-h-[60px]">
              <AdBanner type="small" slot={2} />
            </div>
          </div>
        </section>

        {/* Bottom Continuation Gate Action Card */}
        <section ref={actionSectionRef} className="container mx-auto max-w-2xl px-4 mt-8">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-card p-6 sm:p-8 shadow-xl shadow-emerald-500/5">
            {/* Ambient decorative glow */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Step Icon */}
              <div className="mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-emerald-400">
                {isUnlocked ? (
                  <Sparkles className="h-7 w-7 text-emerald-400 animate-pulse" />
                ) : (
                  <Clock className="h-7 w-7 text-amber-400 animate-pulse" />
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isFinalStep
                  ? isUnlocked
                    ? "Destination Link Ready!"
                    : "Unlocking Your Final Destination"
                  : isUnlocked
                  ? `Step ${stepNumber} of ${totalSteps} Complete!`
                  : `Reading Verification: Step ${stepNumber} of ${totalSteps}`}
              </h2>

              {/* Subtitle */}
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                {isFinalStep
                  ? `You are heading to ${destinationDomain}. Click continue below to proceed.`
                  : `Please explore the content above for ${gateTimerSeconds} seconds to support our free service and unlock the next article.`}
              </p>

              {/* Error display if any */}
              {errorMessage && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 max-w-md w-full">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Progress Countdown Bar */}
              {!isUnlocked && (
                <div className="mt-6 w-full max-w-md">
                  <div className="flex justify-between items-center text-xs font-mono text-muted-foreground mb-1.5">
                    <span>Verifying session</span>
                    <span className="text-amber-400 font-bold">{secondsLeft}s remaining</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-2 transition-all duration-1000 ease-linear rounded-full"
                      style={{
                        width: `${Math.round(((gateTimerSeconds - secondsLeft) / gateTimerSeconds) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6 w-full max-w-md">
                <Button
                  onClick={handleAdvance}
                  disabled={!isUnlocked || isSubmitting}
                  size="lg"
                  className={`w-full h-12 text-sm font-bold transition-all shadow-md ${
                    isUnlocked
                      ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/25 cursor-pointer hover:scale-[1.01]"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-80"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying & Advancing...</span>
                    </span>
                  ) : !isUnlocked ? (
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Please wait {secondsLeft} seconds...</span>
                    </span>
                  ) : isFinalStep ? (
                    <span className="flex items-center gap-2">
                      <span>Continue to {destinationDomain}</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Continue to Next Article (Step {stepNumber + 1} of {totalSteps})</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>

              {/* Trust Badge */}
              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Protected by ul0 link verification system</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Ad Unit */}
        <section className="container mx-auto max-w-4xl px-4 mt-8">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono block mb-2">
              Advertisement
            </span>
            <div className="overflow-hidden flex justify-center items-center min-h-[90px]">
              <AdBanner type="large" slot={3} />
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground bg-muted/10">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ul0.site. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors" target="_blank">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" target="_blank">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
