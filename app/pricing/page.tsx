import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingSection } from "./pricing-section"
import { ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing — ul0",
  description:
    "Simple, transparent pricing. Start free, upgrade when you need custom domains and full analytics. Cheapest URL shortener SaaS in 2026.",
  alternates: {
    canonical: "https://ul0.site/pricing",
  },
}

const comparison = [
  { feature: "Custom Domains", free: "1", pro: "3", business: "10" },
  { feature: "Domain Short Links", free: "1 link", pro: "100 links", business: "Unlimited" },
  { feature: "Domain Links Analytics", free: "Basic click count", pro: "Full (Referrer, Device)", business: "Full (Referrer, Device)" },
  { feature: "Public Shortener Analytics", free: "—", pro: "✓", business: "✓" },
  { feature: "Link Deletion", free: "—", pro: "✓", business: "✓" },
  { feature: "QR Code Generator", free: "✓", pro: "✓", business: "✓" },
  { feature: "Support", free: "Community", pro: "Priority", business: "24/7 Dedicated" },
]

const faqs = [
  {
    q: "Can I still shorten links for free?",
    a: "Yes. The free URL shortener on ul0.site works instantly without any signup. Always has, always will.",
  },
  {
    q: "What are custom domain links?",
    a: "Connect your own domain (e.g. go.yourcompany.com) and create branded short links served from it. Your visitors see your domain, not ours.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes. You can cancel your subscription or request a refund at any time from your customer billing settings portal.",
  },
  {
    q: "Do I get analytics on the free plan?",
    a: "The free plan includes basic click count analytics for links created on your connected custom domain. Upgrade to Pro for detailed device and referrer analytics.",
  },
]

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fafafa] text-gray-900 font-sans antialiased selection:bg-gray-200">
        <div className="container mx-auto px-6 py-20 max-w-5xl">
          
          {/* Header */}
          <div className="text-left mb-16 pb-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, flat pricing.
            </h1>
            <p className="mt-3 text-lg text-gray-500 max-w-xl">
              Start free with no credit card required. Choose a plan to connect custom domains, remove ads, and unlock advanced analytics.
            </p>
          </div>

          {/* Interactive Pricing Toggle & Cards */}
          <div className="mb-16">
            <PricingSection />
          </div>

          {/* Billing Options & Polar Portal */}
          <div className="mb-20">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-2xs max-w-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Manage Your Subscription</h2>
              <p className="text-xs text-gray-500 mb-6">
                Update payment methods, view invoices, download receipts, or cancel/pause your subscription.
              </p>
              <a
                href="https://polar.sh/ul0-link/portal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Go to Billing Portal
                <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="mb-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Plan Comparison</h2>
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 font-bold text-gray-600 w-2/5">Features &amp; Limits</th>
                      <th className="p-4 font-bold text-center w-1/5">Free</th>
                      <th className="p-4 font-bold text-center w-1/5 bg-gray-100/40">Pro</th>
                      <th className="p-4 font-bold text-center w-1/5">Business</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {comparison.map((row) => (
                      <tr key={row.feature} className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-900">{row.feature}</td>
                        <td className="p-4 text-center text-gray-500">{row.free}</td>
                        <td className="p-4 text-center font-semibold text-gray-900 bg-gray-100/10">{row.pro}</td>
                        <td className="p-4 text-center text-gray-500">{row.business}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-5 shadow-2xs">
                  <h3 className="font-semibold text-sm text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
