import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Zap, Shield, Globe, Users, QrCode, Wifi } from "lucide-react"

export const metadata: Metadata = {
  title: "Raccourcisseur d'URL Gratuit - Raccourcir un Lien | ul0",
  description:
    "ul0 est le raccourcisseur d'URL gratuit le plus rapide. Raccourcissez n'importe quel lien instantanément. Sans inscription, sans limite, 100% gratuit. QR codes inclus.",
  keywords: [
    "raccourcir url",
    "raccourcir un lien",
    "raccourcisseur de lien gratuit",
    "raccourcisseur url gratuit",
    "raccourcir lien",
    "créer lien court",
    "lien court gratuit",
    "bitly alternative",
    "tinyurl alternative",
    "raccourcisseur url france",
    "générateur qr code gratuit",
    "partager les dépenses",
  ],
  alternates: {
    canonical: "https://ul0.site/fr",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "Raccourcisseur d'URL Gratuit - Raccourcir un Lien | ul0",
    description: "Le raccourcisseur d'URL gratuit le plus rapide. Sans inscription.",
    url: "https://ul0.site/fr",
    locale: "fr_FR",
  },
}

export default function FrenchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "ul0 - Raccourcisseur d'URL Gratuit",
        url: "https://ul0.site/fr",
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        inLanguage: "fr",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1120" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Le raccourcisseur d'URL est-il vraiment gratuit ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, ul0 est 100% gratuit. Vous pouvez raccourcir un nombre illimité de liens, sans inscription ni frais cachés.",
            },
          },
          {
            "@type": "Question",
            name: "Dois-je créer un compte pour raccourcir un lien ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Non. Vous pouvez commencer immédiatement, sans inscription ni connexion.",
            },
          },
          {
            "@type": "Question",
            name: "Puis-je créer des QR codes pour mes liens ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, vous pouvez générer gratuitement un QR code pour chaque lien raccourci.",
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">🇫🇷 Raccourcisseur d'URL Gratuit</h1>
            <p className="text-xl text-muted-foreground mb-2">#1 Raccourcisseur de Liens Gratuit</p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Raccourcissez n'importe quelle URL longue instantanément. Sans inscription, sans limite, 100% gratuit.
              Parfait pour WhatsApp, Instagram, TikTok et LinkedIn.
            </p>
            <LinkShortenerForm />
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Pourquoi choisir ul0 ?</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Ultra Rapide</h3>
                <p className="text-sm text-muted-foreground">Raccourcissez vos liens en moins d'une seconde.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">100% Sécurisé</h3>
                <p className="text-sm text-muted-foreground">Vos liens sont protégés. Pas de spam, pas de virus.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Toujours Gratuit</h3>
                <p className="text-sm text-muted-foreground">Aucun coût caché. Liens illimités.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Partager les Dépenses</h3>
                <p className="text-sm text-muted-foreground">Partagez les additions entre amis facilement.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR Code</h3>
                <p className="text-sm text-muted-foreground">Générez des QR codes pour chaque lien instantanément.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Wifi className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR WiFi</h3>
                <p className="text-sm text-muted-foreground">Créez des QR codes WiFi pour partager vos mots de passe.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
            <div className="space-y-4">
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">Le raccourcisseur d'URL est-il vraiment gratuit ?</h3>
                <p className="text-sm text-muted-foreground">Oui, ul0 est 100% gratuit, illimité et sans frais cachés.</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">Dois-je créer un compte ?</h3>
                <p className="text-sm text-muted-foreground">Non, vous pouvez raccourcir vos liens immédiatement sans inscription.</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">Puis-je créer des QR codes ?</h3>
                <p className="text-sm text-muted-foreground">Oui, générez gratuitement un QR code pour chaque lien.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Commencez maintenant – 100% gratuit !</h2>
            <p className="text-muted-foreground mb-6">Envie de partager les dépenses entre amis ? Essayez notre fonction Split.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/split" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium">
                Partager les dépenses →
              </Link>
              <Link href="/qr" className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 font-medium">
                Créer un QR code →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
