import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Link2, Zap, Shield, Globe, Users, QrCode, Wifi } from "lucide-react"

export const metadata: Metadata = {
  title: "Acortador de URL Gratis - Acortar Enlaces | ul0",
  description: "ul0 - El acortador de URL más rápido y gratuito. Acorta cualquier enlace al instante. Sin registro, sin límites, 100% gratis. Divide gastos con amigos.",
  keywords: [
    "acortador de url gratis",
    "acortador de enlaces",
    "short link gratis",
    "acortar url",
    "acortar enlace",
    "link corto gratis",
    "bitly alternativa",
    "acortador de url mejor",
    "dividir gastos",
    "compartir gastos amigos",
    "url shortener español",
    "acortador links",
  ],
  alternates: {
    canonical: "https://ul0.site/es",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "Acortador de URL Gratis - Acortar Enlaces | ul0",
    description: "El acortador de URL más rápido y gratuito. Divide gastos con amigos.",
    url: "https://ul0.site/es",
    locale: "es_ES",
  },
}

export default function SpanishPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ul0 - Acortador de URL Gratis",
    url: "https://ul0.site/es",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    inLanguage: "es",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "890",
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">
              🇪🇸 Acortador de URL Gratis
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              #1 Acortador de Enlaces Gratis
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Acorta cualquier URL larga al instante. Sin registro, sin límites, 100% gratis. 
              Comparte fácilmente en WhatsApp, Instagram, TikTok, Twitter.
            </p>
            
            <LinkShortenerForm />
          </div>
        </section>

        {/* Features in Spanish */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              ¿Por qué elegir ul0?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Super Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Acorta enlaces en menos de 1 segundo. Sin esperas.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">100% Seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Tus enlaces están seguros. Sin spam, sin virus.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Siempre Gratis</h3>
                <p className="text-sm text-muted-foreground">
                  Sin costos ocultos. Acorta enlaces ilimitados.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Dividir Gastos</h3>
                <p className="text-sm text-muted-foreground">
                  Divide cuentas con amigos. Fácil y rápido.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Código QR</h3>
                <p className="text-sm text-muted-foreground">
                  Genera códigos QR para pagos instantáneos.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Wifi className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR WiFi</h3>
                <p className="text-sm text-muted-foreground">
                  Crea QR WiFi para compartir contraseñas fácilmente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              ¿Dónde usar?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto text-center">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="font-semibold text-green-600">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Estados y chats</p>
              </div>
              <div className="p-4 bg-pink-500/10 rounded-lg">
                <p className="font-semibold text-pink-600">Instagram</p>
                <p className="text-sm text-muted-foreground">Link en bio</p>
              </div>
              <div className="p-4 bg-slate-500/10 rounded-lg">
                <p className="font-semibold text-slate-600">TikTok</p>
                <p className="text-sm text-muted-foreground">Bio del perfil</p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <p className="font-semibold text-blue-600">Twitter/X</p>
                <p className="text-sm text-muted-foreground">Tweets y bio</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
              ¡Empieza Ahora - 100% Gratis!
            </h2>
            <p className="text-muted-foreground mb-6">
              ¿Quieres dividir gastos con amigos? Prueba nuestra función Split.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/split"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium"
              >
                Dividir Gastos →
              </Link>
              <Link 
                href="/qr"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 font-medium"
              >
                Crear Código QR →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
