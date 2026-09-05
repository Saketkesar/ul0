import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Check, Sparkles, QrCode, Utensils } from "lucide-react"

export const metadata: Metadata = {
  title: "Free Dynamic QR Code Generator UK (2026) – Pubs, Events & Business Cards | ul0",
  description: "Create free, permanent QR codes in the UK for pub menus, business cards, event flyers, and guest WiFi. No subscription fees, no watermarks, and instant downloads.",
  keywords: [
    "free qr code generator uk",
    "qr code for pubs and restaurants uk",
    "wifi qr code generator uk",
    "business card qr code free uk",
    "event flyer qr code uk",
    "free qr code maker london",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/qr-code-generator-uk",
  },
  openGraph: {
    title: "Free Dynamic QR Code Generator UK (2026)",
    description: "Permanent, scan-ready QR codes for UK pubs, restaurants, and businesses without monthly subscriptions.",
    url: "https://ul0.site/blog/qr-code-generator-uk",
    type: "article",
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Free Dynamic QR Code Generator UK (2026)",
  description: "How British pubs, event organizers, and small businesses create permanent QR codes without hidden fees.",
  author: { "@type": "Organization", name: "ul0" },
  publisher: {
    "@type": "Organization",
    name: "ul0",
    logo: { "@type": "ImageObject", url: "https://ul0.site/ul0.png" },
  },
  datePublished: "2026-09-01",
  dateModified: "2026-09-05",
}

export default function QrCodeGeneratorUkPage() {
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
              <QrCode className="h-3.5 w-3.5" /> UK Hospitality &amp; Business Strategy
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Free QR Code Generator for UK Pubs, Restaurants &amp; Events (2026)
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              QR ordering and contactless menus became standard across the UK, but paying £20/month just to keep a menu link active is an unnecessary burden. Learn how to generate permanent QR codes with no fees on ul0.
            </p>
          </header>

          <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Avoid QR Code Expiration Traps</h2>
              <p>
                Many UK hospitality businesses have been caught out by QR code platforms that offer a &quot;14-day trial&quot; only to deactivate printed table talkers and bar runners when the trial ends.
              </p>
              <p>
                With <Link href="/qr" className="text-primary font-semibold hover:underline">ul0.site</Link>, the QR codes you generate encode your direct URL permanently. They work indefinitely with zero ongoing maintenance costs.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Top Use Cases for British Enterprises</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Pubs &amp; Gastropubs:</strong> Contactless drinks menus and Sunday roast ordering.</li>
                <li><strong>Guest WiFi:</strong> Use our <Link href="/wifi" className="text-primary font-semibold hover:underline">Free WiFi QR Generator</Link> to let patrons connect to pub Wi-Fi with one quick scan.</li>
                <li><strong>Concert &amp; Festival Posters:</strong> Quick ticket sales links on community boards and venue doors.</li>
                <li><strong>Business Cards:</strong> Clean vCards and website links for trade shows and networking events.</li>
              </ul>
            </section>

            {/* CTA Box */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8 text-center not-prose mt-8">
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                Create Your Free Permanent UK QR Code
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                No subscription, no watermark. Instant high-res download.
              </p>
              <div className="mt-5">
                <Link
                  href="/qr"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform hover:scale-105"
                >
                  Generate Free QR Code Now →
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
