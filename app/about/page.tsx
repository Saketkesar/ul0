import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import { Link2, Users, QrCode, Zap, Shield, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About ul0 - Best Free URL Shortener & Bill Splitter 2025",
  description: "ul0 is the best free URL shortener 2025. Shorten links instantly, split expenses with friends, generate QR codes. Bitly & Splitwise alternative - no signup required!",
  keywords: [
    // Primary Keywords
    "about ul0",
    "ul0 url shortener",
    "ul0 review",
    "what is ul0",
    
    // Company/Service Keywords
    "url shortener company",
    "link shortener service",
    "expense splitter app",
    "free url shortener service",
    
    // Comparison Keywords
    "bitly alternative",
    "bitly alternative free",
    "tinyurl alternative",
    "splitwise alternative",
    "splitwise alternative free",
    
    // Feature Keywords
    "url shortener with qr code",
    "url shortener with analytics",
    "expense splitter with upi",
    "bill splitter with paypal",
    "bill splitter with venmo",
    
    // Trust Keywords
    "best url shortener",
    "best link shortener",
    "top url shortener",
    "reliable url shortener",
    "trusted url shortener",
    
    // Free Keywords
    "free link shortener",
    "free url shortener no signup",
    "free bill splitter",
    "free expense splitter",
    
    // Region Keywords
    "url shortener india",
    "bill splitter india",
    "upi payment splitter",
    "split expenses app india",
    "url shortener usa",
    "bill splitter usa",
    
    // Long-tail Keywords
    "best free url shortener 2025",
    "best bitly alternative 2025",
    "best splitwise alternative 2025",
  ],
  alternates: {
    canonical: "https://ul0.site/about",
  },
  openGraph: {
    title: "About ul0 - Best Free URL Shortener & Bill Splitter",
    description: "ul0 is the best free URL shortener 2025. Bitly & Splitwise alternative - no signup required!",
    url: "https://ul0.site/about",
    type: "website",
    siteName: "ul0 - About Us",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 - Best Free URL Shortener",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ul0 - Free URL Shortener & Bill Splitter",
    description: "Best free URL shortener 2025. Bitly & Splitwise alternative!",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AboutPage() {
  const features = [
    {
      icon: Link2,
      title: "Free URL Shortening",
      description: "Create short, memorable links from long URLs instantly. No signup required. 100% free forever."
    },
    {
      icon: Users,
      title: "Bill Splitting Made Easy",
      description: "Split expenses with friends and groups. Calculate who owes whom automatically with smart algorithms."
    },
    {
      icon: QrCode,
      title: "UPI QR Code Generator",
      description: "Auto-generate QR codes for UPI payments. Scan with any UPI app - GPay, PhonePe, Paytm."
    },
    {
      icon: Zap,
      title: "Smart App Detection",
      description: "Automatically detect YouTube, Instagram, Twitter and other apps for seamless opening."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "All shortened links are scanned for malware. Your data is protected with HTTPS encryption."
    },
    {
      icon: Globe,
      title: "Works Everywhere",
      description: "Lightning fast redirects. Works perfectly on any device, any browser, anywhere in the world."
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/ul0.png"
                alt="ul0 Logo - Free URL Shortener"
                width={80}
                height={80}
                className="rounded-xl"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4 sm:text-4xl lg:text-5xl">About ul0</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make link sharing and expense splitting simple, fast, and free for everyone.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 sm:text-3xl">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                ul0 was born out of a simple frustration: long, ugly URLs that break in messages and the hassle of manually calculating who owes what after group dinners.
              </p>
              <p>
                We built ul0 to solve both problems in one place. Our URL shortener creates clean, shareable links in seconds. Our expense splitter calculates settlements automatically and generates UPI payment links - so you can settle up without awkward Venmo requests.
              </p>
              <p>
                We believe in keeping things simple. No accounts, no subscriptions, no complicated features. Just paste a link, hit shorten, and share. Add your friends, enter expenses, and get instant payment links with QR codes.
              </p>
              <p>
                ul0 is and will always be free. We support ourselves through non-intrusive advertising, so you get a clean experience while we keep the lights on.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center sm:text-3xl">What We Offer</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border border-border">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12 sm:py-16 bg-primary/5">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-6 sm:text-3xl">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To simplify digital sharing and financial settlements for everyone. We believe technology should make life easier, not more complicated. That's why ul0 is built to be fast, free, and frustration-free.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
