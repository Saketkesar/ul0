import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  UtensilsCrossed,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Wifi,
  HelpCircle,
  Clock,
  Smartphone,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Restaurant Menu QR Codes & Hospitality Link Tracking | UL0",
  description: "Create contactless digital menu QR codes for restaurants, cafes, and bars. Update menu PDF links without reprinting table tents or coasters.",
  alternates: {
    canonical: "https://ul0.site/use-cases/restaurants",
  },
  openGraph: {
    title: "Restaurant Menu QR Codes & Hospitality Link Tracking — UL0",
    description: "Contactless dine-in menu QR codes and scan analytics for food and beverage venues.",
    url: "https://ul0.site/use-cases/restaurants",
    type: "article",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What happens when our restaurant menu prices or items change?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "With UL0, you never need to replace the physical QR code stickers on your dining tables. Simply update the destination URL in your UL0 dashboard (whether it's a PDF on Google Drive or an online Toast/Square menu), and the table QR codes instantly route to your updated menu."
      }
    },
    {
      "@type": "Question",
      name: "Can we track how many customers scan our menu each day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. UL0 tracks every scan with real-time analytics. You can see total scan counts, peak hours (lunch vs dinner rush), and guest device types (iOS vs Android)."
      }
    },
    {
      "@type": "Question",
      name: "Can we also generate a WiFi QR code for our guests?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. UL0 includes a dedicated WiFi QR Code generator that lets guests connect to your guest Wi-Fi network instantly with a single camera scan—no typing complicated passwords."
      }
    }
  ]
}

export default function RestaurantsUseCasePage() {
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
            <span className="text-foreground">Restaurants &amp; Hospitality</span>
          </div>

          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-500 mb-4">
              <UtensilsCrossed className="h-3.5 w-3.5" />
              Hospitality &amp; Dining
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
              Table Menu QR Codes That Never Expire or Require Re-Printing
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Updating physical menus costs restaurants thousands in printing every season. With UL0, your table QR codes are permanent. Update your digital menu, drink specials, or happy hour schedule anytime in your dashboard without replacing a single table sticker.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/qr"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create Restaurant Menu QR
              </Link>
              <Link
                href="/wifi"
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Make Guest WiFi QR Code
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-rose-500/10 text-rose-500 p-3 w-fit mb-4">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Permanent Table Codes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Print high-resolution vector QR codes onto acrylic stands, wood blocks, or bar coasters once. The link remains active forever.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-amber-500/10 text-amber-500 p-3 w-fit mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Rush Hour Scan Analytics</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Discover your true customer traffic peaks. Compare lunch rush scan volume against late-night weekend beverage orders.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-emerald-500/10 text-emerald-500 p-3 w-fit mb-4">
                <Wifi className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">One-Tap Guest WiFi</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Eliminate guest frustration asking waitstaff for WiFi details. Guests scan a tabletop code to authenticate automatically.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              Restaurant FAQ
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
              Modernize Your Restaurant Tabletop Experience
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Generate menu QR codes in seconds. 100% free with no monthly subscription lock-in.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/qr"
                className="rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Generate Menu QR Code
              </Link>
              <Link
                href="/wifi"
                className="rounded-xl border border-border bg-background px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Create Guest WiFi QR
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
