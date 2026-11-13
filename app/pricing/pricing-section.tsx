"use client"

import React, { useState } from "react"
import Link from "next/link"
import { UL0Icon } from "@/components/ul0-icon"

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly")

  const isAnnual = billingCycle === "annually"

  const plans = [
    {
      name: "Free",
      price: "$0",
      cadence: "forever",
      description: "For individuals needing clean short links and dynamic QR codes.",
      cta: "Start free",
      ctaHref: "/sign-up",
      variant: "outline" as const,
      highlight: false,
      specs: {
        linksPerMonth: "Unlimited",
        customDomains: "1 domain",
        linksPerDomain: "1 link",
        qrCodes: "Unlimited PNG & SVG",
        analyticsRetention: "24-hour total clicks",
        apiRateLimit: "Not included (Pro & Business)",
        teamSeats: "1 user",
        support: "Community GitHub",
      },
    },
    {
      name: "Pro",
      price: isAnnual ? "$30" : "$3",
      cadence: isAnnual ? "per year" : "per month",
      description: "For creators and builders requiring branded domains and click analytics.",
      cta: "Upgrade to Pro",
      ctaHref: isAnnual
        ? "/api/billing/checkout?plan=pro_annual"
        : "/api/billing/checkout?plan=pro_monthly",
      variant: "default" as const,
      highlight: true,
      specs: {
        linksPerMonth: "Unlimited",
        customDomains: "3 domains",
        linksPerDomain: "100 links",
        qrCodes: "Unlimited dynamic vector",
        analyticsRetention: "1 year history",
        apiRateLimit: "60 requests / min",
        teamSeats: "1 user",
        support: "Priority email",
      },
    },
    {
      name: "Business",
      price: isAnnual ? "$90" : "$9",
      cadence: isAnnual ? "per year" : "per month",
      description: "For agencies and growing teams with higher domain and link volumes.",
      cta: "Upgrade to Business",
      ctaHref: isAnnual
        ? "/api/billing/checkout?plan=business_annual"
        : "/api/billing/checkout?plan=business_monthly",
      variant: "outline" as const,
      highlight: false,
      specs: {
        linksPerMonth: "Unlimited",
        customDomains: "10 domains",
        linksPerDomain: "Unlimited",
        qrCodes: "Unlimited dynamic vector",
        analyticsRetention: "2 years history",
        apiRateLimit: "300 requests / min",
        teamSeats: "5 users",
        support: "Dedicated email & SLA",
      },
    },
  ]

  const featureRows = [
    { label: "Short links / month", key: "linksPerMonth" },
    { label: "Custom branded domains", key: "customDomains" },
    { label: "Links per domain", key: "linksPerDomain" },
    { label: "Vector QR codes", key: "qrCodes" },
    { label: "Analytics retention", key: "analyticsRetention" },
    { label: "API rate limit", key: "apiRateLimit" },
    { label: "Team seats", key: "teamSeats" },
    { label: "Customer support", key: "support" },
  ] as const

  return (
    <div className="space-y-12">
      {/* Billing toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-surface-2 border border-border shadow-2xs">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              !isAnnual ? "bg-primary text-primary-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annually")}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all inline-flex items-center gap-1.5 cursor-pointer ${
              isAnnual ? "bg-primary text-primary-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Annual billing</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAnnual ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
              2 months free
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((p) => {
          const isPro = p.name === "Pro"
          return (
            <div
              key={p.name}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all ${
                isPro
                  ? "bg-[#0B1A17] dark:bg-[#0E211E] text-white shadow-xl border border-[#3DDBB8]/30 relative scale-[1.02]"
                  : "bg-card border border-border text-foreground shadow-2xs"
              }`}
            >
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold tracking-wider uppercase ${
                        isPro ? "text-[#3DDBB8]" : "text-muted-foreground"
                      }`}
                    >
                      {p.name}
                    </span>
                    {isPro && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#3DDBB8] text-[#0B1A17] text-[10px] font-bold">
                        popular
                      </span>
                    )}
                  </div>
                  <div className={`text-4xl font-extrabold mt-2 tracking-tight ${isPro ? "text-white" : "text-foreground"}`}>
                    {p.price}
                    <span className={`text-xs font-normal ml-1 ${isPro ? "text-white/60" : "text-muted-foreground"}`}>
                      /{p.cadence}
                    </span>
                  </div>
                  <p className={`text-xs mt-2 leading-relaxed ${isPro ? "text-white/80" : "text-muted-foreground"}`}>
                    {p.description}
                  </p>
                </div>

                <div className={`pt-4 border-t space-y-2.5 text-xs ${isPro ? "border-white/10" : "border-border"}`}>
                  {featureRows.map((row) => (
                    <div key={row.key} className="flex items-center justify-between py-1">
                      <span className={isPro ? "text-white/70" : "text-muted-foreground"}>{row.label}</span>
                      <span className={`font-semibold text-right ${isPro ? "text-white" : "text-foreground"}`}>
                        {p.specs[row.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={p.ctaHref}
                className={`w-full py-3 rounded-full text-xs font-bold text-center transition-all shadow-2xs cursor-pointer ${
                  isPro
                    ? "bg-[#3DDBB8] text-[#0B1A17] hover:opacity-90"
                    : "border border-border bg-surface-2 hover:bg-muted text-foreground"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          )
        })}
      </div>

      {/* Fair use note */}
      <div className="rounded-3xl border border-border bg-card/60 p-6 space-y-1.5 text-xs text-muted-foreground shadow-2xs">
        <h4 className="font-semibold text-foreground text-sm">What counts as fair use?</h4>
        <p className="leading-relaxed">
          The Free plan is intended for creators, developers, and normal personal and commercial projects.
          Automated abusive link generation (such as bulk phishing distribution, URL redirection hopping, or
          high-frequency automated flooding) is blocked by edge rate limiters to safeguard network reputation.
        </p>
      </div>
    </div>
  )
}
