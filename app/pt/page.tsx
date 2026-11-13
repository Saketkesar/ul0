import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "Encurtador de URL Grátis - Encurtar Link | ul0",
  description: "ul0 - O encurtador de URL mais rápido e gratuito do Brasil. Encurte qualquer link instantaneamente. Sem cadastro, sem limite, 100% grátis.",
  alternates: {
    canonical: "https://ul0.site/pt",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Encurtador de URL Grátis - Encurtar Link | ul0",
    description: "O encurtador de URL mais rápido e gratuito. Encurte links instantaneamente sem cadastro.",
    url: "https://ul0.site/pt",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Encurtador de URL Grátis | ul0",
    description: "Encurtador de links e gerador de QR code grátis sem cadastro.",
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
              Encurtador de URL Grátis
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
              <div className="bg-card p-6 rounded-3xl border border-border/80 shadow-xs">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <UL0Icon name="bolt" className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Super Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Encurte links em menos de 1 segundo. Sem espera.
                </p>
              </div>
              <div className="bg-card p-6 rounded-3xl border border-border/80 shadow-xs">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <UL0Icon name="shield" className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">100% Seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Seus links estão seguros. Sem spam, sem vírus.
                </p>
              </div>
              <div className="bg-card p-6 rounded-3xl border border-border/80 shadow-xs">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <UL0Icon name="domain" className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Sempre Grátis</h3>
                <p className="text-sm text-muted-foreground">
                  Sem custos ocultos. Encurte links ilimitados.
                </p>
              </div>
              <div className="bg-card p-6 rounded-3xl border border-border/80 shadow-xs">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <UL0Icon name="team" className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Dividir Despesas</h3>
                <p className="text-sm text-muted-foreground">
                  Rachar conta com amigos. Fácil e rápido.
                </p>
              </div>
              <div className="bg-card p-6 rounded-3xl border border-border/80 shadow-xs">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <UL0Icon name="qr" className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">QR Code PIX</h3>
                <p className="text-sm text-muted-foreground">
                  Gere QR code para pagamento via PIX.
                </p>
              </div>
              <div className="bg-card p-6 rounded-3xl border border-border/80 shadow-xs">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <UL0Icon name="link" className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Sem Cadastro</h3>
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
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <p className="font-semibold text-emerald-600">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Status e conversas</p>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                <p className="font-semibold text-primary">Instagram</p>
                <p className="text-sm text-muted-foreground">Link na bio</p>
              </div>
              <div className="p-4 bg-muted/60 border border-border rounded-2xl">
                <p className="font-semibold text-foreground">TikTok</p>
                <p className="text-sm text-muted-foreground">Bio do perfil</p>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <p className="font-semibold text-emerald-600">YouTube</p>
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
              className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium shadow-xs"
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
