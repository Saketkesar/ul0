"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Minus } from "lucide-react"

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
        apiRateLimit: "10 requests / min (Sandbox)",
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
    <div className="space-y-10">
      {/* Billing toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1 p-1 rounded-md bg-muted/40 border border-border">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              !isAnnual ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annually")}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors inline-flex items-center gap-1.5 ${
              isAnnual ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Annual billing</span>
            <span className="text-[10px] font-mono text-primary font-bold">2 months free</span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-lg bg-card p-6 flex flex-col justify-between space-y-6 ${
              p.highlight ? "border-2 border-primary" : "border border-border"
            }`}
          >
            <div className="space-y-4">
              <div>
                <h3
                  className={`text-xs font-semibold tracking-wider uppercase ${
                    p.highlight ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {p.name}
                </h3>
                <div className="text-3xl font-bold text-foreground mt-1">
                  {p.price}
                  <span className="text-xs font-normal text-muted-foreground ml-1">/{p.cadence}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
              </div>

              <div className="pt-2 border-t border-border space-y-2 text-xs">
                {featureRows.map((row) => (
                  <div key={row.key} className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-foreground text-right">
                      {p.specs[row.key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              asChild
              variant={p.variant}
              size="sm"
              className="w-full text-xs font-semibold"
            >
              <Link href={p.ctaHref}>{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>

      {/* Fair use note */}
      <div className="rounded-lg border border-border bg-muted/20 p-5 space-y-1.5 text-xs text-muted-foreground">
        <h4 className="font-semibold text-foreground">What counts as fair use?</h4>
        <p className="leading-relaxed">
          The Free plan is intended for creators, developers, and normal personal and commercial projects.
          Automated abusive link generation (such as bulk phishing distribution, URL redirection hopping, or
          high-frequency automated flooding) is blocked by edge rate limiters to safeguard network reputation.
        </p>
      </div>
    </div>
  )
}
