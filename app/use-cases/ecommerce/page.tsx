import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Smartphone,
  Tag,
  HelpCircle,
  Truck,
  RotateCw,
} from "lucide-react"

export const metadata: Metadata = {
  title: "E-Commerce Packaging QR Codes & SMS Link Tracking | UL0",
  description: "Boost repeat customer purchases with unboxing packaging QR codes, warranty registration links, and character-saving SMS marketing short URLs.",
  alternates: {
    canonical: "https://ul0.site/use-cases/ecommerce",
  },
  openGraph: {
    title: "E-Commerce Packaging QR Codes & SMS Link Tracking — UL0",
    description: "Product packaging QR codes and high-conversion SMS marketing links for DTC brands.",
    url: "https://ul0.site/use-cases/ecommerce",
    type: "article",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do short links help e-commerce SMS marketing campaigns?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard SMS text messages are strictly limited to 160 characters. A long product URL can consume up to 80 characters alone. Shortening links with UL0 reduces the URL footprint to under 20 characters, leaving ample room for persuasive copy and preventing carrier segment splitting charges."
      }
    },
    {
      "@type": "Question",
      name: "What happens if we redesign our website after printing 10,000 product boxes with QR codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because UL0 links use dynamic redirection, you simply log in to your dashboard and change the destination URL to your new product or warranty page. Your printed boxes in warehouses and customer hands will automatically route to the updated page."
      }
    },
    {
      "@type": "Question",
      name: "Do UL0 short links trigger carrier spam filters in transactional or promotional SMS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Using branded custom domains (e.g. shop.yourbrand.com) via UL0 significantly reduces carrier spam blocking compared to public shared domains, which wireless carriers like Verizon, AT&T, and T-Mobile frequently throttle."
      }
    }
  ]
}

export default function EcommerceUseCasePage() {
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
            <span className="text-foreground">E-Commerce &amp; DTC</span>
          </div>

          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-500 mb-4">
              <ShoppingBag className="h-3.5 w-3.5" />
              Direct-to-Consumer Commerce
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
              Turn Unboxing Moments Into Repeat Customer Revenue
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              From product inserts and packaging QR codes to character-efficient SMS text marketing, UL0 equips online brands with high-reliability link infrastructure that preserves brand equity, cuts SMS marketing costs, and drives repeat customer lifetime value (LTV).
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/qr"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Generate Packaging QR Code
              </Link>
              <Link
                href="/utm"
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Build Trackable Campaign URL
              </Link>
            </div>
          </div>

          {/* E-Commerce Touchpoints */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-cyan-500/10 text-cyan-500 p-3 w-fit mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Unboxing Inserts</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Include a QR code on packing slips and product boxes leading to warranty registration, digital user manuals, or VIP reorder discount codes.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-emerald-500/10 text-emerald-500 p-3 w-fit mb-4">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">High-Deliverability SMS</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Send short links under your own branded domain (e.g. <code>shop.brand.com/sale</code>) to keep texts under 160 characters and prevent telecom spam filtering.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-purple-500/10 text-purple-500 p-3 w-fit mb-4">
                <RotateCw className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Zero-Reprint Flexibility</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Update product instruction videos or seasonal landing pages anytime without discarding physical packaging inventory already sitting in fulfillment centers.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              E-Commerce FAQ
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
              Supercharge Your E-Commerce Product Links
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Create vector packaging QR codes and clean branded campaign links in seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Shorten Link Free
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border bg-background px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Connect Branded Domain ($3/mo)
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
