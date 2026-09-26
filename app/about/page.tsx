import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import { Link2, Globe, ShieldCheck, Zap, BarChart3, Code2, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About UL0 — The Modern Link Management & Analytics Platform",
  description:
    "Learn about UL0's mission to build fast, secure, and privacy-respecting link infrastructure, custom branded domains, and dynamic QR codes for businesses and developers.",
  alternates: {
    canonical: "https://ul0.site/about",
  },
  openGraph: {
    title: "About UL0 — Next-Generation Link Infrastructure",
    description:
      "UL0 empowers marketing teams, developers, and businesses with fast 301 redirects, real-time analytics, and custom domain delegation.",
    url: "https://ul0.site/about",
    type: "website",
  },
}

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: "Edge-Level Speed",
      description:
        "Every millisecond matters when routing a user to your offer. UL0's edge distribution network executes 301 redirects in under 15ms globally with zero intermediary interstitial ads.",
    },
    {
      icon: ShieldCheck,
      title: "Integrity & Anti-Abuse",
      description:
        "We actively police our link network using automated malware filters and domain reputation feeds to ensure bad actors never abuse our infrastructure for phishing.",
    },
    {
      icon: BarChart3,
      title: "Privacy-Respecting Analytics",
      description:
        "Our analytics deliver deep geographic and device insights without invading consumer privacy, avoiding invasive tracking cookies while maintaining 100% GDPR and CCPA compliance.",
    },
    {
      icon: Globe,
      title: "Brand Ownership",
      description:
        "We believe businesses should never be forced to share third-party short domains. UL0 enables easy, multi-tenant custom domain delegation for all organizations.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <Link2 className="h-3.5 w-3.5" />
              <span>Building the Future of Digital Attribution</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Empowering Teams to Own and Measure Every Click
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              UL0 was created to solve a fundamental problem on the modern web: legacy link shorteners had become bloated, prohibitively expensive, and cluttered with intrusive interstitials. We set out to build a clean, blazing-fast, and developer-friendly alternative.
            </p>

            {/* Banner Showcase */}
            <div className="mt-12 overflow-hidden rounded-2xl sm:rounded-3xl border border-border shadow-xl bg-card">
              <Image
                src="/githubbanner.png"
                alt="UL0 Ecosystem — Link Shortener & Free Tools Suite"
                width={1600}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                Links are the connective tissue of the internet. Whether you are an indie founder launching on Product Hunt, an e-commerce brand dispatching SMS order notifications, or a digital agency managing campaigns for Fortune 500 clients, you need link infrastructure you can trust.
              </p>
              <p>
                Too often, businesses are trapped with legacy shorteners that paywall basic custom domain features behind expensive $35+/month plans, throttle analytics queries, or inject slow interstitial redirect delays.
              </p>
              <p>
                At UL0, our mission is to deliver enterprise-grade link management, custom domain routing, dynamic vector QR codes, and free developer tools accessible to anyone, anywhere in the world.
              </p>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-12 sm:py-16 bg-muted/20 border-y border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Our Core Principles</h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                The foundational values that guide our architecture, product development, and customer commitments.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((val, idx) => {
                const Icon = val.icon
                return (
                  <div key={idx} className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">{val.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{val.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Platform Overview CTA */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Explore the UL0 Ecosystem
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Check out our feature matrix, try our free developer tools, or read about how companies in your industry leverage UL0.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/features">
                <Button className="rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                  Platform Features
                </Button>
              </Link>
              <Link href="/use-cases">
                <Button variant="outline" className="rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold">
                  Industry Use Cases
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="outline" className="rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold">
                  Free Web Tools
                </Button>
              </Link>
              <Link href="/changelog">
                <Button variant="ghost" className="rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold">
                  Changelog &amp; Roadmap
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
