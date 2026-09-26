import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Briefcase,
  Megaphone,
  Home,
  UtensilsCrossed,
  Sparkles,
  ShoppingBag,
  Rocket,
  Calendar,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  QrCode,
  Globe,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Link Management Use Cases for US Businesses & Creators | UL0",
  description: "Discover how small businesses, marketing agencies, real estate professionals, restaurants, and creators use UL0 for link tracking, branded short links, and QR campaigns.",
  alternates: {
    canonical: "https://ul0.site/use-cases",
  },
  openGraph: {
    title: "UL0 Use Cases — Link Management for Modern Workflows",
    description: "Explore tailored link tracking and QR code solutions for your industry.",
    url: "https://ul0.site/use-cases",
    type: "website",
  },
}

const USE_CASES = [
  {
    title: "Small Businesses",
    slug: "small-business",
    icon: <Briefcase className="h-6 w-6 text-emerald-500" />,
    description: "Build local brand trust with branded links, print trackable flyer QR codes, and measure physical-to-digital conversions.",
    badge: "Local & Retail",
    highlights: ["Branded short links", "Flyer QR code tracking", "Zero monthly minimums"],
  },
  {
    title: "Marketing Agencies",
    slug: "marketing-agencies",
    icon: <Megaphone className="h-6 w-6 text-blue-500" />,
    description: "Manage client campaigns with standardized UTM parameter taxonomy, multichannel attribution, and exportable reports.",
    badge: "Campaign Analytics",
    highlights: ["Standardized UTM taxonomy", "Client domain delegation", "Multi-channel tracking"],
  },
  {
    title: "Real Estate",
    slug: "real-estate",
    icon: <Home className="h-6 w-6 text-amber-500" />,
    description: "Generate trackable QR codes for yard signs, open house flyers, MLS virtual tours, and measure buyer interest by neighborhood.",
    badge: "Property Marketing",
    highlights: ["Yard sign QR codes", "Virtual tour link tracking", "Open house visitor capture"],
  },
  {
    title: "Restaurants & Bars",
    slug: "restaurants",
    icon: <UtensilsCrossed className="h-6 w-6 text-rose-500" />,
    description: "Dine-in menu QR codes that never expire, promotional SMS links, and hour-by-hour scan volume tracking.",
    badge: "Hospitality",
    highlights: ["Dynamic menu QR codes", "SMS marketing links", "Peak hour scan metrics"],
  },
  {
    title: "Content Creators",
    slug: "creators",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
    description: "Optimize Instagram bio links, track YouTube video description clicks, and measure sponsor affiliate conversions.",
    badge: "Social Media",
    highlights: ["Link in bio tracking", "Sponsor click verification", "Clean branded vanity URLs"],
  },
  {
    title: "E-Commerce Brands",
    slug: "ecommerce",
    icon: <ShoppingBag className="h-6 w-6 text-cyan-500" />,
    description: "Insert dynamic QR codes into product packaging, track seasonal promotional SMS, and protect brand affiliate equity.",
    badge: "Direct-to-Consumer",
    highlights: ["Unboxing QR codes", "Affiliate link attribution", "Seasonal campaign redirection"],
  },
  {
    title: "Startups & Tech",
    slug: "startups",
    icon: <Rocket className="h-6 w-6 text-indigo-500" />,
    description: "Pitch deck tracking, Product Hunt launch links, developer REST API integration, and investor update CTR analytics.",
    badge: "Growth & Developers",
    highlights: ["REST API & Webhooks", "Pitch deck access metrics", "Launch campaign attribution"],
  },
  {
    title: "Events & Conferences",
    slug: "events",
    icon: <Calendar className="h-6 w-6 text-emerald-400" />,
    description: "Print trackable badge QR codes, distribute session schedule links, and monitor booth attendee engagement in real time.",
    badge: "Live Experiences",
    highlights: ["Badge QR check-ins", "Booth collateral tracking", "Real-time attendee analytics"],
  },
]

export default function UseCasesIndexPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4">
              <Globe className="h-3.5 w-3.5" />
              Tailored Link Management Workflows
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Link Tracking &amp; QR Solutions for Every Industry
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              From neighborhood restaurants to multi-client marketing agencies, see how teams use UL0 to increase click-through rates, safeguard brand trust, and attribute traffic accurately.
            </p>
          </div>

          {/* Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((uc) => (
              <Link
                key={uc.slug}
                href={`/use-cases/${uc.slug}`}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="rounded-xl bg-muted p-3 group-hover:scale-105 transition-transform">
                      {uc.icon}
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {uc.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {uc.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {uc.description}
                  </p>
                </div>

                <div>
                  <div className="space-y-1.5 border-t border-border pt-4 mb-4">
                    {uc.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
                    <span>Explore {uc.title} workflow</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Callout */}
          <div className="mt-16 rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              Ready to elevate your link infrastructure?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6">
              Create short links and dynamic QR codes in seconds. Connect your custom domain with simple DNS CNAME records.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Shorten a Link Free
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                View Plans &amp; Custom Domains
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
