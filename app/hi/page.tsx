import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import { FeaturesSection } from "@/components/features-section"
import Link from "next/link"
import { Link2, Zap, Shield, Globe, Users, QrCode } from "lucide-react"

export const metadata: Metadata = {
  title: "मुफ्त URL शॉर्टनर - लिंक छोटा करें | ul0",
  description: "ul0 - भारत का सबसे तेज़ और मुफ्त URL शॉर्टनर। किसी भी लिंक को तुरंत छोटा करें। कोई साइनअप नहीं, कोई विज्ञापन नहीं, 100% मुफ्त। UPI के साथ खर्च बांटें।",
  keywords: [
    "url shortener hindi",
    "free url shortener india",
    "link shortener hindi",
    "मुफ्त url शॉर्टनर",
    "लिंक छोटा करें",
    "फ्री लिंक शॉर्टनर",
    "bitly alternative india",
    "url shortener india",
    "short link generator hindi",
    "expense splitter india",
    "upi payment splitter",
    "bill split app india",
  ],
  alternates: {
    canonical: "https://ul0.site/hi",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "मुफ्त URL शॉर्टनर - लिंक छोटा करें | ul0",
    description: "भारत का सबसे तेज़ और मुफ्त URL शॉर्टनर। UPI के साथ खर्च बांटें।",
    url: "https://ul0.site/hi",
    locale: "hi_IN",
  },
}

export default function HindiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ul0 - मुफ्त URL शॉर्टनर",
    url: "https://ul0.site/hi",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    inLanguage: "hi",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
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
              🇮🇳 मुफ्त URL शॉर्टनर
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              भारत का #1 फ्री लिंक शॉर्टनर
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              किसी भी लंबे URL को तुरंत छोटा करें। कोई रजिस्ट्रेशन नहीं, कोई लिमिट नहीं, 100% मुफ्त। 
              WhatsApp, Instagram, Facebook पर आसानी से शेयर करें।
            </p>
            
            <LinkShortenerForm />
          </div>
        </section>

        {/* Features in Hindi */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              ul0 क्यों चुनें?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">बिजली की तरह तेज़</h3>
                <p className="text-sm text-muted-foreground">
                  1 सेकंड से भी कम समय में लिंक शॉर्ट करें। कोई इंतज़ार नहीं।
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">100% सुरक्षित</h3>
                <p className="text-sm text-muted-foreground">
                  आपके लिंक सुरक्षित हैं। कोई स्पैम नहीं, कोई वायरस नहीं।
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">हमेशा मुफ्त</h3>
                <p className="text-sm text-muted-foreground">
                  कोई छिपे हुए चार्ज नहीं। अनलिमिटेड लिंक शॉर्ट करें।
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">खर्च बांटें</h3>
                <p className="text-sm text-muted-foreground">
                  दोस्तों के साथ बिल स्प्लिट करें। UPI QR कोड के साथ।
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">UPI पेमेंट</h3>
                <p className="text-sm text-muted-foreground">
                  PhonePe, GPay, Paytm से तुरंत पेमेंट करें।
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Link2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">कोई साइनअप नहीं</h3>
                <p className="text-sm text-muted-foreground">
                  अकाउंट बनाने की ज़रूरत नहीं। तुरंत इस्तेमाल करें।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              कहाँ इस्तेमाल करें?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto text-center">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="font-semibold text-green-600">WhatsApp</p>
                <p className="text-sm text-muted-foreground">स्टेटस और चैट में शेयर करें</p>
              </div>
              <div className="p-4 bg-pink-500/10 rounded-lg">
                <p className="font-semibold text-pink-600">Instagram</p>
                <p className="text-sm text-muted-foreground">Bio में लिंक डालें</p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <p className="font-semibold text-blue-600">Facebook</p>
                <p className="text-sm text-muted-foreground">पोस्ट में शेयर करें</p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg">
                <p className="font-semibold text-red-600">YouTube</p>
                <p className="text-sm text-muted-foreground">Description में डालें</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
              अभी शुरू करें - 100% मुफ्त!
            </h2>
            <p className="text-muted-foreground mb-6">
              दोस्तों के साथ खर्च बांटना है? हमारा Split feature ट्राई करें।
            </p>
            <Link 
              href="/split"
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium"
            >
              खर्च बांटें →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
