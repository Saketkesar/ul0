import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Link2, Zap, Shield, Globe, Users, QrCode } from "lucide-react"

export const metadata: Metadata = {
  title: "Encurtador de URL Grátis - Encurtar Link | ul0",
  description: "ul0 - O encurtador de URL mais rápido e gratuito do Brasil. Encurte qualquer link instantaneamente. Sem cadastro, sem limite, 100% grátis. Divida despesas com amigos.",
  keywords: [
    "encurtador de url gratis",
    "encurtador de link",
    "short link gratis",
    "url shortener brasil",
    "encurtar link",
    "link curto gratis",
    "bitly alternativa brasil",
    "encurtador de url melhor",
    "dividir despesas",
    "rachar conta",
    "split conta amigos",
    "divisor de despesas",
  ],
  alternates: {
    canonical: "https://ul0.site/pt",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "Encurtador de URL Grátis - Encurtar Link | ul0",
    description: "O encurtador de URL mais rápido e gratuito do Brasil. Divida despesas com amigos.",
    url: "https://ul0.site/pt",
    locale: "pt_BR",
  },
}

export default function PortuguesePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ul0 - Encurtador de URL Grátis",
    url: "https://ul0.site/pt",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    inLanguage: "pt",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
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
              🇧🇷 Encurtador de URL Grátis
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              #1 Encurtador de Link Grátis no Brasil
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Encurte qualquer URL longo instantaneamente. Sem registro, sem limite, 100% grátis. 
              Compartilhe facilmente no WhatsApp, Instagram, TikTok.
            </p>
            
            <LinkShortenerForm />
          </div>
        </section>

        {/* Features in Portuguese */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Por que escolher ul0?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Super Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Encurte links em menos de 1 segundo. Sem espera.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">100% Seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Seus links estão seguros. Sem spam, sem vírus.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Sempre Grátis</h3>
                <p className="text-sm text-muted-foreground">
                  Sem custos ocultos. Encurte links ilimitados.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Dividir Despesas</h3>
                <p className="text-sm text-muted-foreground">
                  Rachar conta com amigos. Fácil e rápido.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR Code PIX</h3>
                <p className="text-sm text-muted-foreground">
                  Gere QR code para pagamento via PIX.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Link2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Sem Cadastro</h3>
                <p className="text-sm text-muted-foreground">
                  Não precisa criar conta. Use agora mesmo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Onde usar?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto text-center">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="font-semibold text-green-600">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Status e conversas</p>
              </div>
              <div className="p-4 bg-pink-500/10 rounded-lg">
                <p className="font-semibold text-pink-600">Instagram</p>
                <p className="text-sm text-muted-foreground">Link na bio</p>
              </div>
              <div className="p-4 bg-slate-500/10 rounded-lg">
                <p className="font-semibold text-slate-600">TikTok</p>
                <p className="text-sm text-muted-foreground">Bio do perfil</p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg">
                <p className="font-semibold text-red-600">YouTube</p>
                <p className="text-sm text-muted-foreground">Descrição</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Comece Agora - 100% Grátis!
            </h2>
            <p className="text-muted-foreground mb-6">
              Quer dividir despesas com amigos? Experimente nosso recurso Split.
            </p>
            <Link 
              href="/split"
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium"
            >
              Dividir Despesas →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
