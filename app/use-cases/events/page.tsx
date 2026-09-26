import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Users,
  BarChart3,
  HelpCircle,
  Clock,
  Sparkles,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Conference & Event QR Code Tracking | UL0",
  description: "Provide frictionless digital schedules, badge check-ins, and sponsor collateral tracking for conferences, trade shows, and live events with UL0.",
  alternates: {
    canonical: "https://ul0.site/use-cases/events",
  },
  openGraph: {
    title: "Conference & Event QR Code Tracking — UL0",
    description: "Badge QR codes, digital schedule links, and sponsor booth attribution for live events.",
    url: "https://ul0.site/use-cases/events",
    type: "article",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why use web-based QR codes instead of forcing attendees to download a native event app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Studies show over 60% of attendees abandon clunky 200MB event app downloads due to slow venue Wi-Fi or lack of device storage. UL0 QR codes open instant web schedules in mobile browsers in under one second with zero installation."
      }
    },
    {
      "@type": "Question",
      name: "Can our event team track which sponsor booths generated the most scans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. By creating individual trackable links and QR codes for each sponsor booth, you can provide sponsors with verified post-event scan analytics showing exact visitor numbers and peak engagement times."
      }
    },
    {
      "@type": "Question",
      name: "Can we change the schedule link if session rooms or speakers change at the last minute?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Because UL0 links are dynamic, you can update the destination URL instantly from your phone or laptop. Every badge and printed signage QR code will immediately direct attendees to the updated room schedule."
      }
    }
  ]
}

export default function EventsUseCasePage() {
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
            <span className="text-foreground">Events &amp; Conferences</span>
          </div>

          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-500 mb-4">
              <Calendar className="h-3.5 w-3.5" />
              Live Events &amp; Conferences
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
              Frictionless Attendee Access Without Forcing Clunky App Downloads
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Attendees despise downloading heavy native apps just to view an event schedule or Wi-Fi code. UL0 enables event organizers to print dynamic badge QR codes, track sponsor booth engagement, and update session schedules on the fly without reprinting a single badge.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/qr"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create Event Badge QR Code
              </Link>
              <Link
                href="/wifi"
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Venue Wi-Fi QR Generator
              </Link>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-emerald-500/10 text-emerald-500 p-3 w-fit mb-4">
                <QrCode className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Instant Badge Scans</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Print QR codes on lanyard badges for speaker bios, attendee digital business cards, or instant PDF schedule access.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-blue-500/10 text-blue-500 p-3 w-fit mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Sponsor Proof of Traffic</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Provide exhibitors with verified scan reports showing exact booth foot traffic, device types, and peak visiting hours.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-purple-500/10 text-purple-500 p-3 w-fit mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Live Schedule Agility</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Room change or speaker delay? Update the redirect destination in seconds to ensure thousands of attendees arrive at the right hall.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              Event Organizers FAQ
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
              Power Your Next Event With UL0
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Generate event QR codes and dynamic schedule links in seconds. Free with no credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/qr"
                className="rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create Event QR Code
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
