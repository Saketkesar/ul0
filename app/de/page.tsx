import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Zap, Shield, Globe, Users, QrCode, Wifi } from "lucide-react"

export const metadata: Metadata = {
  title: "Kostenloser URL-Kürzer - Links kürzen | ul0",
  description:
    "ul0 ist der schnellste kostenlose URL-Kürzer. Verkürze jeden Link sofort. Keine Anmeldung, keine Limits, 100% gratis. Inklusive QR-Codes und Kostenteilung.",
  keywords: [
    "url kürzen",
    "url kürzen kostenlos",
    "link kürzen",
    "linkkürzer kostenlos",
    "url verkürzen",
    "kurze url erstellen",
    "link verkürzer",
    "bitly alternative",
    "tinyurl alternative",
    "url shortener deutschland",
    "qr code generator kostenlos",
    "kosten teilen app",
  ],
  alternates: {
    canonical: "https://ul0.site/de",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "Kostenloser URL-Kürzer - Links kürzen | ul0",
    description: "Der schnellste kostenlose URL-Kürzer. Keine Anmeldung erforderlich.",
    url: "https://ul0.site/de",
    locale: "de_DE",
  },
}

export default function GermanPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "ul0 - Kostenloser URL-Kürzer",
        url: "https://ul0.site/de",
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        inLanguage: "de",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1240" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Ist der URL-Kürzer wirklich kostenlos?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja, ul0 ist zu 100% kostenlos. Du kannst unbegrenzt Links kürzen, ohne Anmeldung und ohne versteckte Kosten.",
            },
          },
          {
            "@type": "Question",
            name: "Brauche ich ein Konto, um Links zu kürzen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nein. Du kannst sofort loslegen, ohne dich zu registrieren oder anzumelden.",
            },
          },
          {
            "@type": "Question",
            name: "Kann ich QR-Codes für meine Links erstellen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja, für jeden gekürzten Link kannst du kostenlos einen QR-Code generieren.",
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">🇩🇪 Kostenloser URL-Kürzer</h1>
            <p className="text-xl text-muted-foreground mb-2">#1 Gratis Linkkürzer</p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Verkürze jede lange URL sofort. Keine Anmeldung, keine Limits, 100% kostenlos.
              Perfekt für WhatsApp, Instagram, TikTok und LinkedIn.
            </p>
            <LinkShortenerForm />
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Warum ul0?</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Blitzschnell</h3>
                <p className="text-sm text-muted-foreground">Kürze Links in unter einer Sekunde. Ohne Wartezeit.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">100% Sicher</h3>
                <p className="text-sm text-muted-foreground">Deine Links sind sicher. Kein Spam, keine Viren.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Immer Gratis</h3>
                <p className="text-sm text-muted-foreground">Keine versteckten Kosten. Unbegrenzt Links kürzen.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Kosten teilen</h3>
                <p className="text-sm text-muted-foreground">Teile Rechnungen mit Freunden. Einfach und schnell.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR-Code</h3>
                <p className="text-sm text-muted-foreground">Erstelle QR-Codes für jeden Link sofort.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Wifi className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">WLAN-QR</h3>
                <p className="text-sm text-muted-foreground">Erstelle WLAN-QR-Codes zum einfachen Teilen.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">Häufige Fragen</h2>
            <div className="space-y-4">
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">Ist der URL-Kürzer wirklich kostenlos?</h3>
                <p className="text-sm text-muted-foreground">Ja, ul0 ist zu 100% kostenlos – unbegrenzt und ohne versteckte Kosten.</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">Brauche ich ein Konto?</h3>
                <p className="text-sm text-muted-foreground">Nein, du kannst sofort ohne Registrierung Links kürzen.</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">Kann ich QR-Codes erstellen?</h3>
                <p className="text-sm text-muted-foreground">Ja, für jeden Link kannst du kostenlos einen QR-Code generieren.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Jetzt starten – 100% gratis!</h2>
            <p className="text-muted-foreground mb-6">Kosten mit Freunden teilen? Probiere unsere Split-Funktion.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/split" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium">
                Kosten teilen →
              </Link>
              <Link href="/qr" className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 font-medium">
                QR-Code erstellen →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
