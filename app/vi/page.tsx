import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Link2, Zap, Shield, Globe, Users, QrCode, Wifi } from "lucide-react"

export const metadata: Metadata = {
  title: "Rút gọn Link Miễn Phí - Công cụ Rút gọn URL | ul0",
  description: "ul0 - Công cụ rút gọn link miễn phí nhanh nhất Việt Nam. Rút gọn bất kỳ URL nào ngay lập tức. Không cần đăng ký, không giới hạn, 100% miễn phí.",
  keywords: [
    "rút gọn link miễn phí",
    "rút gọn url",
    "công cụ rút gọn link",
    "short link việt nam",
    "rút gọn link online",
    "tạo link ngắn",
    "bitly thay thế",
    "rút gọn link không cần đăng ký",
    "link shortener vietnam",
    "url shortener vietnam",
  ],
  alternates: {
    canonical: "https://ul0.site/vi",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "Rút gọn Link Miễn Phí - Công cụ Rút gọn URL | ul0",
    description: "Công cụ rút gọn link miễn phí nhanh nhất Việt Nam. Không cần đăng ký.",
    url: "https://ul0.site/vi",
    locale: "vi_VN",
  },
}

export default function VietnamesePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ul0 - Rút gọn Link Miễn Phí",
    url: "https://ul0.site/vi",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    inLanguage: "vi",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "VND",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "720",
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
              🇻🇳 Rút gọn Link Miễn Phí
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              #1 Công cụ Rút gọn Link tại Việt Nam
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Rút gọn bất kỳ URL dài nào ngay lập tức. Không cần đăng ký, không giới hạn, 100% miễn phí. 
              Chia sẻ dễ dàng trên Zalo, Facebook, TikTok.
            </p>
            
            <LinkShortenerForm />
          </div>
        </section>

        {/* Features in Vietnamese */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Tại sao chọn ul0?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Siêu Nhanh</h3>
                <p className="text-sm text-muted-foreground">
                  Rút gọn link trong chưa đầy 1 giây. Không cần chờ đợi.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">100% An toàn</h3>
                <p className="text-sm text-muted-foreground">
                  Link của bạn được bảo mật. Không spam, không virus.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Luôn Miễn Phí</h3>
                <p className="text-sm text-muted-foreground">
                  Không có chi phí ẩn. Rút gọn không giới hạn.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Chia Chi Phí</h3>
                <p className="text-sm text-muted-foreground">
                  Chia tiền với bạn bè. Nhanh chóng và dễ dàng.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Mã QR</h3>
                <p className="text-sm text-muted-foreground">
                  Tạo mã QR cho thanh toán nhanh chóng.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Wifi className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR WiFi</h3>
                <p className="text-sm text-muted-foreground">
                  Tạo mã QR WiFi để chia sẻ mật khẩu dễ dàng.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Sử dụng ở đâu?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto text-center">
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <p className="font-semibold text-blue-600">Zalo</p>
                <p className="text-sm text-muted-foreground">Chat & chia sẻ</p>
              </div>
              <div className="p-4 bg-blue-600/10 rounded-lg">
                <p className="font-semibold text-blue-700">Facebook</p>
                <p className="text-sm text-muted-foreground">Bài đăng & tin nhắn</p>
              </div>
              <div className="p-4 bg-slate-500/10 rounded-lg">
                <p className="font-semibold text-slate-600">TikTok</p>
                <p className="text-sm text-muted-foreground">Bio profile</p>
              </div>
              <div className="p-4 bg-pink-500/10 rounded-lg">
                <p className="font-semibold text-pink-600">Instagram</p>
                <p className="text-sm text-muted-foreground">Link trong bio</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Bắt đầu ngay - 100% Miễn Phí!
            </h2>
            <p className="text-muted-foreground mb-6">
              Muốn chia tiền với bạn bè? Thử tính năng Split của chúng tôi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/split"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium"
              >
                Chia Chi Phí →
              </Link>
              <Link 
                href="/qr"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 font-medium"
              >
                Tạo Mã QR →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
