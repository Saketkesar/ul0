import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Zap, Shield, Globe, Users, QrCode, Wifi } from "lucide-react"

export const metadata: Metadata = {
  title: "무료 URL 단축기 - 링크 줄이기 | ul0",
  description:
    "ul0는 가장 빠른 무료 URL 단축기입니다. 어떤 링크든 즉시 단축하세요. 가입 불필요, 제한 없음, 100% 무료. QR 코드 생성과 비용 분담 기능 포함.",
  keywords: [
    "url 단축",
    "url 단축기 무료",
    "링크 줄이기",
    "단축 url 만들기",
    "링크 단축기",
    "무료 링크 단축기",
    "짧은 url 만들기",
    "bitly 대안",
    "tinyurl 대안",
    "url shortener 한국",
    "qr 코드 생성 무료",
    "더치페이 앱",
  ],
  alternates: {
    canonical: "https://ul0.site/ko",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "무료 URL 단축기 - 링크 줄이기 | ul0",
    description: "가장 빠른 무료 URL 단축기. 가입 불필요.",
    url: "https://ul0.site/ko",
    locale: "ko_KR",
  },
}

export default function KoreanPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "ul0 - 무료 URL 단축기",
        url: "https://ul0.site/ko",
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        inLanguage: "ko",
        offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "640" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "URL 단축기는 정말 무료인가요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "네, ul0는 100% 무료입니다. 가입 없이 숨겨진 비용 없이 무제한으로 링크를 단축할 수 있습니다.",
            },
          },
          {
            "@type": "Question",
            name: "링크를 단축하려면 계정이 필요한가요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "아니요. 가입이나 로그인 없이 바로 사용할 수 있습니다.",
            },
          },
          {
            "@type": "Question",
            name: "링크의 QR 코드를 만들 수 있나요?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "네, 단축한 각 링크의 QR 코드를 무료로 생성할 수 있습니다.",
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
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">🇰🇷 무료 URL 단축기</h1>
            <p className="text-xl text-muted-foreground mb-2">No.1 무료 링크 단축</p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              긴 URL을 즉시 단축하세요. 가입 불필요, 제한 없음, 100% 무료.
              카카오톡, 인스타그램, 틱톡, X에 완벽합니다.
            </p>
            <LinkShortenerForm />
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">왜 ul0인가요?</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">초고속</h3>
                <p className="text-sm text-muted-foreground">1초 이내에 링크를 단축. 기다림 없음.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">100% 안전</h3>
                <p className="text-sm text-muted-foreground">링크는 안전합니다. 스팸과 바이러스 없음.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">항상 무료</h3>
                <p className="text-sm text-muted-foreground">숨겨진 비용 없음. 무제한 단축.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">비용 분담</h3>
                <p className="text-sm text-muted-foreground">친구들과 계산을 쉽게 나누세요.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR 코드</h3>
                <p className="text-sm text-muted-foreground">각 링크의 QR 코드를 즉시 생성.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Wifi className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">WiFi QR</h3>
                <p className="text-sm text-muted-foreground">비밀번호 공유용 WiFi QR 코드 생성.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">자주 묻는 질문</h2>
            <div className="space-y-4">
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">URL 단축기는 정말 무료인가요?</h3>
                <p className="text-sm text-muted-foreground">네, ul0는 100% 무료이며 무제한, 숨겨진 비용이 없습니다.</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">계정이 필요한가요?</h3>
                <p className="text-sm text-muted-foreground">아니요, 가입 없이 바로 링크를 단축할 수 있습니다.</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">QR 코드를 만들 수 있나요?</h3>
                <p className="text-sm text-muted-foreground">네, 각 링크의 QR 코드를 무료로 생성할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">지금 시작 – 100% 무료!</h2>
            <p className="text-muted-foreground mb-6">친구들과 비용을 나누고 싶으세요? Split 기능을 사용해 보세요.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/split" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium">
                비용 분담하기 →
              </Link>
              <Link href="/qr" className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 font-medium">
                QR 코드 만들기 →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
