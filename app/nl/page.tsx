import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Zap, Shield, Globe, Users, QrCode, Wifi } from "lucide-react"

export const metadata: Metadata = {
  title: "Gratis URL Verkorter - Link Inkorten | ul0",
  description:
    "ul0 is de snelste gratis URL-verkorter. Kort elke link direct in. Geen registratie, geen limieten, 100% gratis. Inclusief QR-codes en kosten delen.",
  keywords: [
    "url verkorten",
    "url verkorter gratis",
    "link inkorten",
    "link verkorten gratis",
    "korte url maken",
    "linkverkorter",
    "gratis url verkorter",
    "bitly alternatief",
    "tinyurl alternatief",
    "url shortener nederland",
    "qr code generator gratis",
    "kosten delen app",
  ],
  alternates: {
    canonical: "https://ul0.site/nl",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "Gratis URL Verkorter - Link Inkorten | ul0",
    description: "De snelste gratis URL-verkorter. Geen registratie nodig.",
    url: "https://ul0.site/nl",
    locale: "nl_NL",
  },
}

export default function DutchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "ul0 - Gratis URL Verkorter",
        url: "https://ul0.site/nl",
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        inLanguage: "nl",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "760" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is de URL-verkorter echt gratis?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja, ul0 is 100% gratis. Je kunt onbeperkt links inkorten zonder registratie of verborgen kosten.",
            },
          },
          {
            "@type": "Question",
            name: "Heb ik een account nodig om links in te korten?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nee. Je kunt meteen beginnen zonder je te registreren of aan te melden.",
            },
          },
          {
            "@type": "Question",
            name: "Kan ik QR-codes maken voor mijn links?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja, voor elke ingekorte link kun je gratis een QR-code genereren.",
            },
          },
        ],
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">🇳🇱 Gratis URL Verkorter</h1>
            <p className="text-xl text-muted-foreground mb-2">#1 Gratis Linkverkorter</p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Kort elke lange URL direct in. Geen registratie, geen limieten, 100% gratis.
              Perfect voor WhatsApp, Instagram, TikTok en LinkedIn.
            </p>
            <LinkShortenerForm />
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Waarom ul0?</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Supersnel</h3>
                <p className="text-sm text-muted-foreground">Kort links in binnen een seconde. Zonder wachten.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">100% Veilig</h3>
                <p className="text-sm text-muted-foreground">Je links zijn veilig. Geen spam, geen virussen.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Altijd Gratis</h3>
                <p className="text-sm text-muted-foreground">Geen verborgen kosten. Onbeperkt links inkorten.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Kosten Delen</h3>
                <p className="text-sm text-muted-foreground">Verdeel rekeningen met vrienden. Snel en eenvoudig.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR-Code</h3>
                <p className="text-sm text-muted-foreground">Maak direct QR-codes voor elke link.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Wifi className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">WiFi-QR</h3>
                <p className="text-sm text-muted-foreground">Maak WiFi-QR-codes om wachtwoorden te delen.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">Veelgestelde vragen</h2>
            <div className="space-y-4">
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">Is de URL-verkorter echt gratis?</h3>
                <p className="text-sm text-muted-foreground">Ja, ul0 is 100% gratis, onbeperkt en zonder verborgen kosten.</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">Heb ik een account nodig?</h3>
                <p className="text-sm text-muted-foreground">Nee, je kunt direct links inkorten zonder registratie.</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">Kan ik QR-codes maken?</h3>
                <p className="text-sm text-muted-foreground">Ja, genereer gratis een QR-code voor elke link.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Begin nu – 100% gratis!</h2>
            <p className="text-muted-foreground mb-6">Kosten delen met vrienden? Probeer onze Split-functie.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/split" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium">
                Kosten delen →
              </Link>
              <Link href="/qr" className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 font-medium">
                QR-code maken →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
