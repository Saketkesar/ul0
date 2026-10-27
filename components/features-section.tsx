import { Link2, Globe, BarChart3, QrCode, ShieldCheck, Scissors, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Link2,
    badge: "Core",
    title: "Instant URL Shortener",
    description: "Shorten links in milliseconds with permanent 301 edge redirects. Custom aliases, zero link expiration, and no signup needed.",
    href: "/",
  },
  {
    icon: Globe,
    badge: "Branding",
    title: "Custom Branded Domains",
    description: "Connect your own domain (e.g., link.yourbrand.com) in 60 seconds with automatic SSL. One domain is included free on all plans.",
    href: "/custom-domain-landing",
  },
  {
    icon: QrCode,
    badge: "Vector Studio",
    title: "Dynamic Vector QR Codes",
    description: "Generate high-resolution PNG & SVG vector QR codes. Customize colors, add logos, and print on menus, packaging, and cards.",
    href: "/qr",
  },
  {
    icon: BarChart3,
    badge: "Privacy First",
    title: "Real-Time Click Analytics",
    description: "Inspect visitor country, device type, browser, and referrers in real time without invasive tracking cookies or GDPR consent popups.",
    href: "/features",
  },
  {
    icon: Scissors,
    badge: "PWA App",
    title: "Files & PDF Tools Suite",
    description: "Split, merge, convert images to PDF, extract pages, and scan documents with your camera. 100% client-side privacy, installable as a phone app.",
    href: "/files",
  },
  {
    icon: Users,
    badge: "Bill Splitter",
    title: "Group Expense Splitter",
    description: "Split dinners, trips, and roommate expenses with clean shareable links. Friends can settle via instant UPI QR codes without downloading an app.",
    href: "/split",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-border/80" id="features">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Simple tools for links, QR codes &amp; documents
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Lightweight, fast, and privacy-respecting utilities built for creators, small businesses, and individuals.
          </p>
        </div>

        {/* Notion-style Clean Card Grid */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group rounded-lg border border-border/80 bg-card p-5 space-y-3 hover:border-foreground/30 hover:bg-muted/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded border border-border/80 bg-muted/40 text-foreground">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded border border-border/60 bg-muted/30">
                    {feature.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[11px] font-medium text-foreground/80 flex items-center gap-1 group-hover:text-primary transition-colors">
                <span>Explore tool</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
