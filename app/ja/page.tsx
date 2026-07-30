import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Zap, Shield, Globe, Users, QrCode, Wifi } from "lucide-react"

export const metadata: Metadata = {
  title: "無料URL短縮ツール - リンクを短縮 | ul0",
  description:
    "ul0は最速の無料URL短縮ツールです。どんなリンクも一瞬で短縮。登録不要、制限なし、100%無料。QRコード生成や割り勘機能も。",
  keywords: [
    "url 短縮",
    "url短縮 無料",
    "リンク 短縮",
    "短縮url 作成",
    "url短縮ツール",
    "リンク短縮 無料",
    "bitly 代替",
    "tinyurl 代替",
    "url shortener 日本",
    "qrコード 作成 無料",
    "割り勘 アプリ",
    "短縮リンク 無料",
  ],
  alternates: {
    canonical: "https://ul0.site/ja",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "無料URL短縮ツール - リンクを短縮 | ul0",
    description: "最速の無料URL短縮ツール。登録不要。",
    url: "https://ul0.site/ja",
    locale: "ja_JP",
  },
}

export default function JapanesePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "ul0 - 無料URL短縮ツール",
        url: "https://ul0.site/ja",
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "URL短縮ツールは本当に無料ですか？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "はい、ul0は100%無料です。登録不要・隠れた費用なしで、無制限にリンクを短縮できます。",
            },
          },
          {
            "@type": "Question",
            name: "リンクを短縮するのにアカウントは必要ですか？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "いいえ。登録やログインなしですぐにご利用いただけます。",
            },
          },
          {
            "@type": "Question",
            name: "リンクのQRコードを作成できますか？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "はい、短縮した各リンクのQRコードを無料で生成できます。",
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">🇯🇵 無料URL短縮ツール</h1>
            <p className="text-xl text-muted-foreground mb-2">No.1 無料リンク短縮</p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              長いURLを一瞬で短縮。登録不要、制限なし、100%無料。
              WhatsApp、Instagram、X、LINEに最適。
            </p>
            <LinkShortenerForm />
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">ul0が選ばれる理由</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">超高速</h3>
                <p className="text-sm text-muted-foreground">1秒以内でリンクを短縮。待ち時間なし。</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">100%安全</h3>
                <p className="text-sm text-muted-foreground">リンクは安全。スパムやウイルスなし。</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">ずっと無料</h3>
                <p className="text-sm text-muted-foreground">隠れた費用なし。無制限に短縮。</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">割り勘</h3>
                <p className="text-sm text-muted-foreground">友達との支払いを簡単に分割。</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QRコード</h3>
                <p className="text-sm text-muted-foreground">各リンクのQRコードを即時生成。</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Wifi className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">WiFi QR</h3>
                <p className="text-sm text-muted-foreground">パスワード共有用のWiFi QRを作成。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">よくある質問</h2>
            <div className="space-y-4">
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">URL短縮ツールは本当に無料ですか？</h3>
                <p className="text-sm text-muted-foreground">はい、ul0は100%無料・無制限・隠れた費用なしです。</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">アカウントは必要ですか？</h3>
                <p className="text-sm text-muted-foreground">いいえ、登録なしですぐにリンクを短縮できます。</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">QRコードは作成できますか？</h3>
                <p className="text-sm text-muted-foreground">はい、各リンクのQRコードを無料で生成できます。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">今すぐ開始 – 100%無料！</h2>
            <p className="text-muted-foreground mb-6">友達と割り勘したい？Split機能をお試しください。</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/split" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium">
                割り勘する →
              </Link>
              <Link href="/qr" className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 font-medium">
                QRコードを作成 →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
