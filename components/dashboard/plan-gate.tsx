"use client"

import React from "react"
import Link from "next/link"
import { Lock, Sparkles, ArrowRight } from "lucide-react"
import { PLANS, PLAN_FEATURES, type PlanSlug } from "@/lib/plans"

export type GateFeature =
  | "regularAnalytics"
  | "domainAnalytics"
  | "deleteLinks"
  | "apiAccess"
  | "exportCsv"
  | "customDomains"

interface PlanGateProps {
  plan: PlanSlug
  feature: GateFeature
  children: React.ReactNode
  title?: string
  description?: string
  fallback?: React.ReactNode
}

export function PlanGate({
  plan,
  feature,
  children,
  title,
  description,
  fallback,
}: PlanGateProps) {
  // Check if allowed
  let isAllowed = false

  if (plan === "business_user") {
    isAllowed = true
  } else if (plan === "pro_user") {
    isAllowed = feature !== "customDomains" // Pro has 3 domains; only business has 10
  } else {
    // Free user
    if (feature === "domainAnalytics") {
      isAllowed = true // Free gets 1 custom domain link with analytics
    }
  }

  if (isAllowed) {
    return <>{children}</>
  }

  const proPlan = PLANS.pro_user
  const defaultTitle =
    title ||
    (feature === "regularAnalytics"
      ? "Full Link Analytics is a Pro Feature"
      : feature === "apiAccess"
      ? "REST API Access is a Pro Feature"
      : feature === "exportCsv"
      ? "CSV Export is a Pro Feature"
      : "Unlock Premium Features with Pro")

  const defaultDescription =
    description ||
    (feature === "regularAnalytics"
      ? "Track geographic locations, devices, operating systems, referrers, and live click timelines across all your links."
      : feature === "apiAccess"
      ? "Automate link creation and analytics reporting directly inside your internal systems."
      : "Upgrade to unlock unlimited analytics, domain links, and deletion.")

  return (
    <div className="relative rounded-xl border border-border bg-surface-1 overflow-hidden my-4">
      {/* Blurred / Sample background */}
      <div className="pointer-events-none select-none filter blur-sm opacity-40 p-6">
        {fallback ? (
          fallback
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
            <div className="h-40 w-full bg-muted/40 rounded-lg flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-mono">Sample Data Preview</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 bg-muted/30 rounded" />
              <div className="h-16 bg-muted/30 rounded" />
              <div className="h-16 bg-muted/30 rounded" />
            </div>
          </div>
        )}
      </div>

      {/* Overlay card */}
      <div className="absolute inset-0 flex items-center justify-center p-4 bg-background/60 backdrop-blur-xs">
        <div className="max-w-md w-full rounded-xl border border-primary/30 bg-surface-2 p-6 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Lock className="h-5 w-5" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3" />
              <span>Pro Plan (${proPlan.priceMonthly}/mo)</span>
            </div>
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              {defaultTitle}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {defaultDescription}
            </p>
          </div>

          <div className="pt-1">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
            >
              <span>Upgrade to Pro</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
