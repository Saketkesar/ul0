import { Metadata } from "next"
import { hreflangAlternates } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import Link from "next/link"
import { Zap, Shield, Globe, Users, QrCode, Wifi } from "lucide-react"

export const metadata: Metadata = {
  title: "اختصار الروابط مجانا - تقصير الرابط | ul0",
  description:
    "ul0 هو أسرع أداة مجانية لاختصار الروابط. اختصر أي رابط فورا. بدون تسجيل، بدون حدود، مجاني 100%. يشمل أكواد QR وتقسيم المصاريف.",
  keywords: [
    "اختصار الروابط",
    "تقصير الرابط مجانا",
    "اختصار الروابط مجانا",
    "مختصر روابط",
    "تقصير الروابط",
    "إنشاء رابط قصير",
    "اختصار رابط",
    "بديل bitly",
    "بديل tinyurl",
    "مختصر روابط مجاني",
    "مولد رمز qr مجاني",
    "تقسيم المصاريف",
  ],
  alternates: {
    canonical: "https://ul0.site/ar",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "اختصار الروابط مجانا - تقصير الرابط | ul0",
    description: "أسرع أداة مجانية لاختصار الروابط. بدون تسجيل.",
    url: "https://ul0.site/ar",
    locale: "ar_AR",
  },
}

export default function ArabicPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "ul0 - اختصار الروابط مجانا",
        url: "https://ul0.site/ar",
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        inLanguage: "ar",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "720" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "هل أداة اختصار الروابط مجانية حقا؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "نعم، ul0 مجاني 100%. يمكنك اختصار عدد غير محدود من الروابط بدون تسجيل وبدون رسوم خفية.",
            },
          },
          {
            "@type": "Question",
            name: "هل أحتاج إلى حساب لاختصار الروابط؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "لا. يمكنك البدء فورا بدون تسجيل أو تسجيل دخول.",
            },
          },
          {
            "@type": "Question",
            name: "هل يمكنني إنشاء أكواد QR لروابطي؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "نعم، يمكنك إنشاء رمز QR مجاني لكل رابط مختصر.",
            },
          },
        ],
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">🇸🇦 اختصار الروابط مجانا</h1>
            <p className="text-xl text-muted-foreground mb-2">الأداة رقم 1 لاختصار الروابط مجانا</p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              اختصر أي رابط طويل فورا. بدون تسجيل، بدون حدود، مجاني 100%.
              مثالي لواتساب وإنستغرام وتيك توك وتويتر.
            </p>
            <LinkShortenerForm />
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">لماذا ul0؟</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              <div className="bg-background p-6 rounded-lg border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">سريع جدا</h3>
                <p className="text-sm text-muted-foreground">اختصر الروابط في أقل من ثانية. بدون انتظار.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">آمن 100%</h3>
                <p className="text-sm text-muted-foreground">روابطك آمنة. بدون سبام وبدون فيروسات.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">مجاني دائما</h3>
                <p className="text-sm text-muted-foreground">بدون تكاليف خفية. روابط غير محدودة.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">تقسيم المصاريف</h3>
                <p className="text-sm text-muted-foreground">قسّم الفواتير مع الأصدقاء بسهولة.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <QrCode className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">رمز QR</h3>
                <p className="text-sm text-muted-foreground">أنشئ أكواد QR لكل رابط فورا.</p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <Wifi className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">QR للواي فاي</h3>
                <p className="text-sm text-muted-foreground">أنشئ أكواد QR للواي فاي لمشاركة كلمات المرور.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">الأسئلة الشائعة</h2>
            <div className="space-y-4">
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">هل الأداة مجانية حقا؟</h3>
                <p className="text-sm text-muted-foreground">نعم، ul0 مجاني 100% وغير محدود وبدون رسوم خفية.</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">هل أحتاج إلى حساب؟</h3>
                <p className="text-sm text-muted-foreground">لا، يمكنك اختصار الروابط فورا بدون تسجيل.</p>
              </div>
              <div className="bg-background p-5 rounded-lg border">
                <h3 className="font-semibold mb-2">هل يمكنني إنشاء أكواد QR؟</h3>
                <p className="text-sm text-muted-foreground">نعم، أنشئ رمز QR مجاني لكل رابط.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">ابدأ الآن – مجاني 100%!</h2>
            <p className="text-muted-foreground mb-6">تريد تقسيم المصاريف مع الأصدقاء؟ جرّب ميزة Split.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/split" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium">
                تقسيم المصاريف →
              </Link>
              <Link href="/qr" className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 font-medium">
                إنشاء رمز QR →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
