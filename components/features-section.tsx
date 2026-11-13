import Link from "next/link"
import { UL0Icon, UL0IconName } from "@/components/ul0-icon"

interface FeatureItem {
  icon: UL0IconName
  badge: string
  title: string
  description: string
  href: string
}

const features: FeatureItem[] = [
  {
    icon: "link",
    badge: "Core",
    title: "Instant URL Shortener",
    description: "Shorten links in milliseconds with permanent 301 edge redirects. Custom aliases, zero link expiration, and no signup needed.",
    href: "/",
  },
  {
    icon: "domain",
    badge: "Branding",
    title: "Custom Branded Domains",
    description: "Connect your own domain (e.g., link.yourbrand.com) in 60 seconds with automatic SSL. One domain is included free on all plans.",
    href: "/custom-domain-landing",
  },
  {
    icon: "qr",
    badge: "Vector Studio",
    title: "Dynamic Vector QR Codes",
    description: "Generate high-resolution PNG & SVG vector QR codes. Customize colors, add logos, and print on menus, packaging, and cards.",
    href: "/qr",
  },
  {
    icon: "chartline",
    badge: "Privacy First",
    title: "Real-Time Click Analytics",
    description: "Inspect visitor country, device type, browser, and referrers in real time without invasive tracking cookies or GDPR consent popups.",
    href: "/features",
  },
  {
    icon: "scissors",
    badge: "PWA App",
    title: "Files & PDF Tools Suite",
    description: "Split, merge, convert images to PDF, extract pages, and scan documents with your camera. 100% client-side privacy, installable as a phone app.",
    href: "/files",
  },
  {
    icon: "splitbill",
    badge: "Bill Splitter",
    title: "Group Expense Splitter",
    description: "Split dinners, trips, and roommate expenses with clean shareable links. Friends can settle via instant UPI QR codes without downloading an app.",
    href: "/split",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 border-t border-border/60" id="features">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center space-y-2 mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <UL0Icon name="sparkles" size={14} />
            <span>Platform Capabilities</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Simple tools for links, QR codes &amp; documents
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Lightweight, fast, and privacy-respecting utilities built for creators, small businesses, and individuals.
          </p>
        </div>

        {/* Heytaby / Bharpai Style Rounded Card Grid */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group rounded-3xl border border-border/60 bg-card/70 p-6 space-y-4 hover:border-primary/40 hover:bg-card hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <UL0Icon name={feature.icon} animated size={22} />
                  </div>
                  <span className="text-[11px] font-mono text-primary px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/5 font-semibold">
                    {feature.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs font-semibold text-primary flex items-center gap-1.5">
                <span>Explore tool</span>
                <UL0Icon name="arrowright" size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
