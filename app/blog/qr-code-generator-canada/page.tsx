import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Check, Sparkles, QrCode, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Free QR Code Generator for Canadian Businesses (2026) | ul0",
  description: "Create free, permanent QR codes in Canada for menus, flyers, business cards, and WiFi. No monthly fees, no watermarks, and instant high-res PNG downloads.",
  keywords: [
    "free qr code generator canada",
    "qr code for small business canada",
    "restaurant menu qr code free canada",
    "canada wifi qr code generator",
    "real estate qr code flyers canada",
    "free qr code maker ontario bc quebec",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/qr-code-generator-canada",
  },
  openGraph: {
    title: "Free QR Code Generator for Canadian Businesses (2026)",
    description: "Generate high-resolution scannable QR codes without subscription paywalls or expiration dates.",
    url: "https://ul0.site/blog/qr-code-generator-canada",
    type: "article",
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Free QR Code Generator for Canadian Businesses (2026)",
  description: "How Canadian companies use ul0 to generate print-ready, unbranded QR codes with zero monthly fees.",
  author: { "@type": "Organization", name: "ul0" },
  publisher: {
    "@type": "Organization",
    name: "ul0",
    logo: { "@type": "ImageObject", url: "https://ul0.site/ul0.png" },
  },
  datePublished: "2026-09-01",
  dateModified: "2026-09-05",
}

export default function QrCodeGeneratorCanadaPage() {
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
              <QrCode className="h-3.5 w-3.5" /> Canadian Marketing &amp; Print Strategy
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Free QR Code Generator for Canadian Small Businesses (2026 Guide)
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Beware of QR code &quot;free trials&quot; that expire 14 days after you print hundreds of flyers or menus. Learn how to create truly permanent, high-res QR codes for free with ul0.
            </p>
          </header>

          <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">The QR Code &quot;Free Trial&quot; Trap</h2>
              <p>
                Many Canadian business owners have experienced the nightmare of printing thousands of dollars worth of flyers, stickers, or physical restaurant menus, only to find the QR codes stop working two weeks later because the service requires a $20–$40/month subscription.
              </p>
              <p>
                With <Link href="/qr" className="text-primary font-semibold hover:underline">ul0&apos;s QR Code Generator</Link>, your QR codes encode your direct URL permanently. They never expire, have no hidden subscriptions, and feature zero watermarks.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Popular Use Cases Across Canada</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Restaurants &amp; Cafes:</strong> Instant contactless menus that load on any iPhone or Android camera.</li>
                <li><strong>Real Estate Agents:</strong> Printable sign-rider codes linking directly to virtual tours and MLS listings.</li>
                <li><strong>Event Organizers:</strong> Fast check-in and ticket purchase links on concert posters and community boards.</li>
                <li><strong>Guest WiFi:</strong> Use our <Link href="/wifi" className="text-primary font-semibold hover:underline">Free WiFi QR Generator</Link> to let customers join your store Wi-Fi without typing passwords.</li>
              </ul>
            </section>

            {/* CTA Box */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8 text-center not-prose mt-8">
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                Generate Your Permanent QR Code in 3 Seconds
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
