import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Home,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Smartphone,
  Eye,
  HelpCircle,
  MapPin,
  TrendingUp,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Real Estate QR Codes & Listing Link Tracking | UL0",
  description: "Generate trackable QR codes for yard signs, open house brochures, and MLS virtual tours. Change listing destinations without reprinting collateral.",
  alternates: {
    canonical: "https://ul0.site/use-cases/real-estate",
  },
  openGraph: {
    title: "Real Estate QR Codes & Listing Link Tracking — UL0",
    description: "Yard sign QR codes, open house flyers, and MLS listing attribution for real estate agents.",
    url: "https://ul0.site/use-cases/real-estate",
    type: "article",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I update the destination URL of a yard sign QR code after printing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. When you use UL0 short links for your yard signs and flyers, you can easily change where the link points in your dashboard—for example, switching from an 'Active Listing' page to an 'Under Contract' or 'Virtual Tour' page—without reprinting signs."
      }
    },
    {
      "@type": "Question",
      name: "Are UL0 QR codes high enough resolution for large outdoor real estate signs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. UL0 generates crisp high-resolution QR codes that can be printed on 24x18 yard signs, large window graphics, and full-bleed glossy open house brochures without pixelation."
      }
    },
    {
      "@type": "Question",
      name: "What data does UL0 show when someone scans a property QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You see the exact scan timestamp, visitor device type (iPhone, Android), browser, and geographic location so you can measure buyer interest by neighborhood and campaign flyer."
      }
    }
  ]
}

export default function RealEstateUseCasePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/use-cases" className="hover:text-foreground">Use Cases</Link>
            <span>/</span>
            <span className="text-foreground">Real Estate</span>
          </div>

          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-500 mb-4">
              <Home className="h-3.5 w-3.5" />
              Real Estate Marketing
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
              Connect Drive-By Buyers to Virtual Tours in Under 2 Seconds
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Real estate agents lose qualified buyers when physical yard signs only show a phone number or long MLS web address. With UL0, every yard sign, postcard mailer, and open house brochure features a crisp, trackable QR code that instantly opens virtual tours and captures buyer interest.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/qr"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create a Property QR Code
              </Link>
              <Link
                href="/"
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Shorten an MLS Listing URL
              </Link>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-amber-500/10 text-amber-500 p-3 w-fit mb-4">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Drive-By Yard Sign Scans</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Prospective buyers scanning your sign rider immediately access property photos, pricing, and 3D tours without having to type complex MLS numbers.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-emerald-500/10 text-emerald-500 p-3 w-fit mb-4">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Open House Digital Sign-In</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Replace unreadable paper guest books with an iPad or printed QR code that directs visitors to your digital sign-in form or agent contact card.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-blue-500/10 text-blue-500 p-3 w-fit mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Seller Proof of Marketing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Show your home sellers real data: prove how many neighborhood buyers scanned their yard sign or engaged with direct-mail postcards each week.
              </p>
            </div>
          </div>

          {/* Real World Property Workflow */}
          <div className="mb-16 rounded-2xl border border-border bg-card p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Real Estate Marketing Touchpoints</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">Sign Riders &amp; Postcards</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Print custom QR codes on physical "Scan for 3D Walkthrough" sign riders. Every scan routes directly to your Matterport or YouTube tour.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                <Eye className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">Single-Property Branded Domains</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect domains like <code>123oakstreet.info</code> through UL0 so buyers remember the home's unique address across social media promotions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">Dynamic Status Updates</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    When the property enters escrow or sells, redirect the link to your personal agent portfolio or active neighborhood inventory.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              Real Estate FAQ
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {faqSchema.mainEntity.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>{item.name}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                    {item.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Ready to Upgrade Your Property Marketing?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Generate property QR codes and clean short links for your next listing in seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/qr"
                className="rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create Listing QR Code
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border bg-background px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
