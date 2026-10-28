import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingSection } from "./pricing-section"
import { ExternalLink, Check, ChevronRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description:
    "Simple, transparent pricing for short links, vector QR codes, custom domains, and analytics. Free forever tier included.",
  alternates: {
    canonical: "https://ul0.site/pricing",
  },
}

const BILLING_FAQS = [
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. You can cancel your Pro or Business subscription at any time with a single click in your customer billing portal. Your access remains active until the end of the paid billing period.",
  },
  {
    q: "What is your refund policy?",
    a: "We provide a 14-day no-questions-asked refund policy on all first-time subscriptions. If UL0 does not fit your workflow, email support@ul0.site and we will issue a full refund.",
  },
  {
    q: "What happens to my links if I downgrade to the Free plan?",
    a: "Your existing short links continue to redirect without interruption. If you have more custom domains or links than the Free plan allows, you will not be able to create new ones until usage falls within limits, but existing redirects stay live.",
  },
  {
    q: "How does invoice and receipt generation work?",
    a: "Invoices and receipts with your organization VAT or tax ID are generated automatically by our billing processor (Polar / Stripe) and downloadable from your billing dashboard.",
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-16">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Predictable, transparent pricing
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Start free with no credit card required. Upgrade when you need multiple custom domains,
              extended click analytics history, or high API limits.
            </p>
          </div>

          {/* Pricing table & toggle */}
          <PricingSection />

          {/* Customer Portal Banner */}
          <div className="rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-foreground">Existing Customer Billing Portal</h3>
              <p className="text-xs text-muted-foreground">
                Update credit card details, view invoices, download receipts, or manage your subscription.
              </p>
            </div>
            <a
              href="https://polar.sh/ul0-link/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors shrink-0"
            >
              <span>Manage Billing</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          </div>

          {/* Compare Link */}
          <div className="rounded-lg border border-border bg-card/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-semibold text-foreground">Evaluating other link shorteners?</h4>
              <p className="text-muted-foreground">
                Read our dated, verified comparison matrix against Bitly, Short.io, Dub, and TinyURL.
              </p>
            </div>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1 text-primary hover:underline font-semibold shrink-0"
            >
              <span>View competitor breakdown</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* FAQ */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-foreground">Billing &amp; Account FAQ</h2>
              <p className="text-xs text-muted-foreground">Answers to common billing questions.</p>
            </div>

            <div className="space-y-3">
              {BILLING_FAQS.map((faq) => (
                <div key={faq.q} className="rounded-md border border-border bg-card p-4 space-y-1.5 text-xs">
                  <h4 className="font-semibold text-foreground">{faq.q}</h4>
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
