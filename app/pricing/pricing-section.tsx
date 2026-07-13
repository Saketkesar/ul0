"use client"

import { useState } from "react"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"

const pricingPlans = {
  monthly: [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "For individuals needing clean, basic short links.",
      features: [
        { text: "1 custom domain", available: true },
        { text: "1 domain short link", available: true },
        { text: "Basic click count analytics", available: true },
        { text: "Free public URL shortener", available: true },
        { text: "QR code generator", available: true },
        { text: "Full analytics (Referrer, Device)", available: false },
        { text: "Link deletion", available: false },
      ],
      cta: "Get started for free",
      ctaHref: "/sign-up",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$3",
      period: "per month",
      description: "For creators and teams needing robust link management.",
      features: [
        { text: "3 custom domains", available: true },
        { text: "100 domain short links", available: true },
        { text: "Full analytics (Referrer, Device)", available: true },
        { text: "Public shortener analytics", available: true },
        { text: "QR code generator", available: true },
        { text: "Link deletion", available: true },
        { text: "Priority support", available: true },
      ],
      cta: "Upgrade to Pro",
      ctaHref: "/api/billing/checkout?plan=pro_monthly",
      highlight: true,
    },
    {
      name: "Business",
      price: "$9",
      period: "per month",
      description: "For agencies and growing businesses at scale.",
      features: [
        { text: "10 custom domains", available: true },
        { text: "Unlimited domain short links", available: true },
        { text: "Full analytics (Referrer, Device)", available: true },
        { text: "Public shortener analytics", available: true },
        { text: "QR code generator", available: true },
        { text: "Link deletion", available: true },
        { text: "Dedicated 24/7 support", available: true },
      ],
      cta: "Start Business",
      ctaHref: "/api/billing/checkout?plan=business_monthly",
      highlight: false,
    },
  ],
  annually: [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "For individuals needing clean, basic short links.",
      features: [
        { text: "1 custom domain", available: true },
        { text: "1 domain short link", available: true },
        { text: "Basic click count analytics", available: true },
        { text: "Free public URL shortener", available: true },
        { text: "QR code generator", available: true },
        { text: "Full analytics (Referrer, Device)", available: false },
        { text: "Link deletion", available: false },
      ],
      cta: "Get started for free",
      ctaHref: "/sign-up",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$2",
      period: "per month, billed annually ($24/yr)",
      description: "For creators and teams needing robust link management.",
      features: [
        { text: "3 custom domains", available: true },
        { text: "100 domain short links", available: true },
        { text: "Full analytics (Referrer, Device)", available: true },
        { text: "Public shortener analytics", available: true },
        { text: "QR code generator", available: true },
        { text: "Link deletion", available: true },
        { text: "Priority support", available: true },
      ],
      cta: "Upgrade to Pro",
      ctaHref: "/api/billing/checkout?plan=pro_annually",
      highlight: true,
    },
    {
      name: "Business",
      price: "$6",
      period: "per month, billed annually ($72/yr)",
      description: "For agencies and growing businesses at scale.",
      features: [
        { text: "10 custom domains", available: true },
        { text: "Unlimited domain short links", available: true },
        { text: "Full analytics (Referrer, Device)", available: true },
        { text: "Public shortener analytics", available: true },
        { text: "QR code generator", available: true },
        { text: "Link deletion", available: true },
        { text: "Dedicated 24/7 support", available: true },
      ],
      cta: "Start Business",
      ctaHref: "/api/billing/checkout?plan=business_annually",
      highlight: false,
    },
  ],
}

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly")

  const activePlans = pricingPlans[billingCycle]

  return (
    <div className="space-y-12">
      {/* Notion-style Toggle Switch */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-md bg-gray-150 p-1 border border-gray-200 bg-gray-100">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded px-4.5 py-1.5 text-xs font-semibold tracking-tight transition-all ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-950"
            }`}
          >
            Billed monthly
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={`relative rounded px-4.5 py-1.5 text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 ${
              billingCycle === "annually"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-950"
            }`}
          >
            Billed annually
            <span className="rounded-full bg-gray-900 text-white px-1.5 py-0.5 text-3xs font-extrabold uppercase scale-90">
              -33%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {activePlans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm transition-all duration-150 ${
              plan.highlight
                ? "border-gray-900 ring-[1px] ring-gray-900"
                : "border-gray-200"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
                {plan.highlight && (
                  <span className="rounded bg-gray-900 px-2 py-0.5 text-2xs font-bold text-white uppercase tracking-wider">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed min-h-[36px]">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                <span className="text-xs text-gray-400 font-mono ml-1">/ {plan.period}</span>
              </div>

              <div className="border-t border-gray-100 my-4" />

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2.5 text-xs ${
                      feature.available ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    <Check
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        feature.available ? "text-gray-900" : "text-gray-300"
                      }`}
                    />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={plan.ctaHref}
              className={`flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold tracking-tight transition-colors ${
                plan.highlight
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {plan.cta}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
