import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Link2, Zap, Shield, Globe, Users, QrCode, Wifi } from "lucide-react"

export const metadata: Metadata = {
  title: "ย่อลิงก์ฟรี - เครื่องมือย่อ URL | ul0",
  description: "ul0 - เครื่องมือย่อลิงก์ฟรีที่เร็วที่สุดในประเทศไทย ย่อลิงก์ใดก็ได้ทันที ไม่ต้องสมัครสมาชิก ไม่จำกัด ฟรี 100%",
  keywords: [
    "ย่อลิงก์ฟรี",
    "ย่อ url",
    "เครื่องมือย่อลิงก์",
    "short link ไทย",
    "ย่อลิงก์ออนไลน์",
    "สร้างลิงก์สั้น",
    "bitly ทางเลือก",
    "url shortener thailand",
    "link shortener thai",
    "ย่อลิงก์ไม่ต้องสมัคร",
  ],
  alternates: {
    canonical: "https://ul0.site/th",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "ย่อลิงก์ฟรี - เครื่องมือย่อ URL | ul0",
    description: "เครื่องมือย่อลิงก์ฟรีที่เร็วที่สุดในประเทศไทย ไม่ต้องสมัครสมาชิก",
    url: "https://ul0.site/th",
    locale: "th_TH",
  },
}

export default function ThaiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ul0 - ย่อลิงก์ฟรี",
    url: "https://ul0.site/th",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    inLanguage: "th",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "THB",
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
              🇹🇭 ย่อลิงก์ฟรี
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              #1 เครื่องมือย่อลิงก์ฟรีในประเทศไทย
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              ย่อลิงก์ยาวใดก็ได้ทันที ไม่ต้องสมัครสมาชิก ไม่จำกัด ฟรี 100% 
              แชร์ง่ายบน LINE, Facebook, TikTok, Instagram
            </p>
            
            <LinkShortenerForm />
          </div>
        </section>

        {/* Features in Thai */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              ทำไมต้องเลือก ul0?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">เร็วมาก</h3>
                <p className="text-sm text-muted-foreground">
                  ย่อลิงก์ในไม่ถึง 1 วินาที ไม่ต้องรอ
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">ปลอดภัย 100%</h3>
                <p className="text-sm text-muted-foreground">
                  ลิงก์ของคุณปลอดภัย ไม่มีสแปม ไม่มีไวรัส
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">ฟรีตลอด</h3>
                <p className="text-sm text-muted-foreground">
                  ไม่มีค่าใช้จ่ายแอบแฝง ย่อลิงก์ไม่จำกัด
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">หารค่าใช้จ่าย</h3>
                <p className="text-sm text-muted-foreground">
                  หารบิลกับเพื่อน ง่ายและรวดเร็ว
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  สร้าง QR code สำหรับชำระเงินทันที
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Wifi className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">WiFi QR</h3>
                <p className="text-sm text-muted-foreground">
                  สร้าง QR WiFi แชร์รหัสผ่านง่ายๆ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              ใช้ได้ที่ไหน?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto text-center">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="font-semibold text-green-600">LINE</p>
                <p className="text-sm text-muted-foreground">แชทและไทม์ไลน์</p>
              </div>
              <div className="p-4 bg-blue-600/10 rounded-lg">
                <p className="font-semibold text-blue-700">Facebook</p>
                <p className="text-sm text-muted-foreground">โพสต์และข้อความ</p>
              </div>
              <div className="p-4 bg-slate-500/10 rounded-lg">
                <p className="font-semibold text-slate-600">TikTok</p>
                <p className="text-sm text-muted-foreground">Bio โปรไฟล์</p>
              </div>
              <div className="p-4 bg-pink-500/10 rounded-lg">
                <p className="font-semibold text-pink-600">Instagram</p>
                <p className="text-sm text-muted-foreground">ลิงก์ใน Bio</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
              เริ่มเลย - ฟรี 100%!
            </h2>
            <p className="text-muted-foreground mb-6">
              อยากหารค่าใช้จ่ายกับเพื่อน? ลองฟีเจอร์ Split ของเรา
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/split"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium"
              >
                หารค่าใช้จ่าย →
              </Link>
              <Link 
                href="/qr"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 font-medium"
              >
                สร้าง QR Code →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
