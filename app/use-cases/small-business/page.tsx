import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Briefcase,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Globe,
  BarChart3,
  HelpCircle,
  Share2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Link Tracking & Branded Links for Small Businesses | UL0",
  description: "Learn how small businesses use UL0 to create branded short links, print high-resolution flyer QR codes, and measure physical-to-digital marketing attribution.",
  alternates: {
    canonical: "https://ul0.site/use-cases/small-business",
  },
  openGraph: {
    title: "Link Tracking & Branded Links for Small Businesses — UL0",
    description: "Build local brand trust with branded links and measure real-world marketing ROI.",
    url: "https://ul0.site/use-cases/small-business",
    type: "article",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why should a small business use branded short links instead of generic ones?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generic short links like bit.ly or tinyurl often look suspicious to customers and get blocked by email spam filters. Using a branded domain (e.g., brand.link) builds brand trust and typically increases click-through rates by up to 34%."
      }
    },
    {
      "@type": "Question",
      name: "Can I use UL0 QR codes on printed marketing materials like business cards and flyers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every shortened link on UL0 comes with an auto-generated, high-resolution QR code that you can download and print on flyers, business cards, window stickers, and packaging."
      }
    },
    {
      "@type": "Question",
      name: "Do I need technical expertise to connect my own domain to UL0?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. You simply add a standard CNAME record in your domain registrar (like Namecheap, GoDaddy, or Cloudflare) pointing to ul0.site. UL0 handles SSL provisioning and 301 redirection automatically."
      }
    }
  ]
}

export default function SmallBusinessUseCasePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/use-cases" className="hover:text-foreground">Use Cases</Link>
            <span>/</span>
            <span className="text-foreground">Small Business</span>
          </div>

          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-500 mb-4">
              <Briefcase className="h-3.5 w-3.5" />
              Small Business Growth
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
              Turn Local Marketing Into Measurable Foot Traffic &amp; Sales
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Small businesses spend thousands on physical flyers, local sponsorships, and social ads without knowing what actually works. UL0 provides custom branded short links and high-resolution QR codes that track customer engagement down to the exact day, city, and device.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create a Free Trackable Link
              </Link>
              <Link
                href="/qr"
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Generate Flyer QR Code
              </Link>
            </div>
          </div>

          {/* The Pain Point vs The UL0 Solution */}
          <div className="grid gap-6 md:grid-cols-2 mb-16">
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-rose-500 mb-3 flex items-center gap-2">
                <span>The Challenge for Local Businesses</span>
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Long, unwieldy URLs on printed flyers get ignored because nobody wants to type 50 characters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Generic third-party short links look like phishing links and reduce customer trust.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>No way to know whether your $500 local newspaper ad or mailer drop generated any website visits.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-emerald-500 mb-3 flex items-center gap-2">
                <span>The UL0 Advantage</span>
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Short branded URLs (e.g. <code>shop.link/deal</code>) that customers remember and trust.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Crisp, auto-generated vector QR codes that customers scan in under 2 seconds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Real-time click dashboards showing exactly when, where, and on what device customers engaged.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Real 3-Step Workflow */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center mb-8">
              How Small Businesses Use UL0 in 3 Simple Steps
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="rounded-xl bg-primary/10 text-primary w-10 h-10 flex items-center justify-center font-bold mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">Shorten Your Promo Link</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Paste your booking page, Google Reviews link, or seasonal discount URL into UL0. Choose a custom alias like <code>/spring-sale</code>.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="rounded-xl bg-primary/10 text-primary w-10 h-10 flex items-center justify-center font-bold mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">Print or Share Everywhere</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Download the generated QR code for business cards, receipts, table tents, and direct mailers. Share the short link in SMS &amp; social bios.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="rounded-xl bg-primary/10 text-primary w-10 h-10 flex items-center justify-center font-bold mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">Measure What Converts</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  View your live analytics dashboard to see which physical marketing channels generated the most scans and traffic.
                </p>
              </div>
            </div>
          </div>

          {/* Concrete Examples Table */}
          <div className="mb-16 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20">
              <h3 className="font-bold text-foreground text-lg">Real Small Business Use Cases</h3>
              <p className="text-xs text-muted-foreground mt-1">Examples of how local businesses apply UL0 link tracking.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 font-semibold text-foreground">
                  <tr>
                    <th className="p-4">Business Type</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Channel</th>
                    <th className="p-4">What They Track</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted-foreground">
                  <tr>
                    <td className="p-4 font-medium text-foreground">Local Coffee Roaster</td>
                    <td className="p-4">Google Review Submission Form</td>
                    <td className="p-4">QR Code on coffee cup sleeves</td>
                    <td className="p-4">Review click volume by day of week</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Boutique Fitness Studio</td>
                    <td className="p-4">Free Trial Class Booking</td>
                    <td className="p-4">Door hanger flyers in neighborhood</td>
                    <td className="p-4">Mailer response rate vs online ads</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Auto Repair Shop</td>
                    <td className="p-4">Seasonal Tire Change Promo</td>
                    <td className="p-4">Postcard mailer + SMS campaign</td>
                    <td className="p-4">Mobile clicks and booking completions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {faqSchema.mainEntity.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>{item.name}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                    {item.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Start Tracking Your Small Business Links Today
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Create your first short link or QR code in less than 30 seconds. No credit card or account required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Shorten a URL Now
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border bg-background px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Custom Domain Plans ($3/mo)
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
