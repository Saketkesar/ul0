import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Link2, Zap, Shield, Globe, Users, QrCode } from "lucide-react"

export const metadata: Metadata = {
  title: "Pemendek URL Gratis - Perpendek Link | ul0",
  description: "ul0 - Pemendek URL tercepat dan gratis di Indonesia. Perpendek link apapun secara instan. Tanpa daftar, tanpa batas, 100% gratis. Bagi tagihan dengan teman.",
  keywords: [
    "pemendek url gratis",
    "pemendek link indonesia",
    "short link gratis",
    "url shortener indonesia",
    "perpendek link",
    "link pendek gratis",
    "bitly alternatif indonesia",
    "pemendek url terbaik",
    "bagi tagihan",
    "split bill indonesia",
    "pembagi biaya",
  ],
  alternates: {
    canonical: "https://ul0.site/id",
    languages: {
      "en": "https://ul0.site",
      "id": "https://ul0.site/id",
    },
  },
  openGraph: {
    title: "Pemendek URL Gratis - Perpendek Link | ul0",
    description: "Pemendek URL tercepat dan gratis di Indonesia. Bagi tagihan dengan teman.",
    url: "https://ul0.site/id",
    locale: "id_ID",
  },
}

export default function IndonesianPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ul0 - Pemendek URL Gratis",
    url: "https://ul0.site/id",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    inLanguage: "id",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "980",
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
              🇮🇩 Pemendek URL Gratis
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              #1 Pemendek Link Gratis di Indonesia
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Perpendek URL panjang apapun secara instan. Tanpa registrasi, tanpa batas, 100% gratis. 
              Bagikan dengan mudah di WhatsApp, Instagram, TikTok.
            </p>
            
            <LinkShortenerForm />
          </div>
        </section>

        {/* Features in Indonesian */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Mengapa Pilih ul0?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Super Cepat</h3>
                <p className="text-sm text-muted-foreground">
                  Perpendek link dalam waktu kurang dari 1 detik. Tanpa menunggu.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">100% Aman</h3>
                <p className="text-sm text-muted-foreground">
                  Link Anda aman. Tidak ada spam, tidak ada virus.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Selalu Gratis</h3>
                <p className="text-sm text-muted-foreground">
                  Tidak ada biaya tersembunyi. Perpendek link tanpa batas.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Bagi Tagihan</h3>
                <p className="text-sm text-muted-foreground">
                  Split bill dengan teman-teman. Mudah dan cepat.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Generate QR code untuk pembayaran instan.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Link2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Tanpa Daftar</h3>
                <p className="text-sm text-muted-foreground">
                  Tidak perlu buat akun. Langsung pakai sekarang.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Di Mana Bisa Dipakai?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto text-center">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="font-semibold text-green-600">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Status & chat</p>
              </div>
              <div className="p-4 bg-pink-500/10 rounded-lg">
                <p className="font-semibold text-pink-600">Instagram</p>
                <p className="text-sm text-muted-foreground">Link di bio</p>
              </div>
              <div className="p-4 bg-slate-500/10 rounded-lg">
                <p className="font-semibold text-slate-600">TikTok</p>
                <p className="text-sm text-muted-foreground">Bio profile</p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <p className="font-semibold text-blue-600">Telegram</p>
                <p className="text-sm text-muted-foreground">Grup & channel</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Mulai Sekarang - 100% Gratis!
            </h2>
            <p className="text-muted-foreground mb-6">
              Mau bagi tagihan dengan teman? Coba fitur Split kami.
            </p>
            <Link 
              href="/split"
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium"
            >
              Bagi Tagihan →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
