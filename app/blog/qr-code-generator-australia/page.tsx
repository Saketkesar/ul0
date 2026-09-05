import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Check, Sparkles, QrCode, Coffee } from "lucide-react"

export const metadata: Metadata = {
  title: "Free QR Code Generator Australia (2026) – Cafes, Tradies & Real Estate | ul0",
  description: "Generate free, permanent QR codes in Australia for cafe menus, tradie stickers, business cards, and guest WiFi. Instant high-res download with no subscription trap.",
  keywords: [
    "free qr code generator australia",
    "qr code for cafes australia",
    "tradie qr code sticker",
    "real estate sign qr code australia",
    "wifi qr code generator australia",
    "free qr code maker melbourne sydney",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/qr-code-generator-australia",
  },
  openGraph: {
    title: "Free QR Code Generator Australia (2026)",
    description: "Generate print-ready QR codes for Aussie businesses with no monthly subscription fees.",
    url: "https://ul0.site/blog/qr-code-generator-australia",
    type: "article",
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Free QR Code Generator Australia (2026)",
  description: "How Australian businesses, tradies, and hospitality venues generate print-ready QR codes without monthly fees.",
  author: { "@type": "Organization", name: "ul0" },
  publisher: {
    "@type": "Organization",
    name: "ul0",
    logo: { "@type": "ImageObject", url: "https://ul0.site/ul0.png" },
  },
  datePublished: "2026-09-01",
  dateModified: "2026-09-05",
}

export default function QrCodeGeneratorAustraliaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Guides
          </Link>

          <header className="mb-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <QrCode className="h-3.5 w-3.5" /> Australian Small Business &amp; Hospitality
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Free QR Code Generator in Australia (2026 Guide)
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Australian consumers scan QR codes daily—from coffee orders in Melbourne to tradie contact cards in Brisbane. Here is how to create permanent, watermark-free QR codes without falling into monthly subscription traps.
            </p>
          </header>

          <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Why Australian Tradies &amp; Small Businesses Need Permanent QR Codes</h2>
              <p>
                Printing a QR code on a work ute, trailer, business card, or cafe table is an investment in physical marketing. If you use a predatory service that turns off your QR code after a 14-day &quot;free trial&quot;, your printed marketing materials become completely useless.
              </p>
              <p>
                With <Link href="/qr" className="text-primary font-semibold hover:underline">ul0.site</Link>, all QR codes are directly encoded with zero expiration dates. They will scan reliably for years to come.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Popular Australian Applications</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Aussie Cafes &amp; Bakeries:</strong> Table-ordering and digital menus that load instantly without customer app downloads.</li>
                <li><strong>Tradies (Electricians, Plumbers, Builders):</strong> Magnetic ute stickers with QR codes linking straight to online quote request forms.</li>
                <li><strong>Real Estate Agents:</strong> For-sale sign boards linking directly to property walkthrough videos and floor plans.</li>
                <li><strong>Guest WiFi:</strong> Instant scan-to-connect guest WiFi for salons, offices, and gym reception areas via our <Link href="/wifi" className="text-primary font-semibold hover:underline">WiFi QR Generator</Link>.</li>
              </ul>
            </section>

            {/* CTA Box */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8 text-center not-prose mt-8">
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                Generate Your Free Australian QR Code
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                No credit card, no sign-up. Instant high-resolution PNG download.
              </p>
              <div className="mt-5">
                <Link
                  href="/qr"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105"
                >
                  Create Free QR Code Now →
                </Link>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  )
}
