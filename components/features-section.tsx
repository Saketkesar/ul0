import {
  Link2,
  QrCode,
  BarChart3,
  LinkIcon,
  Smartphone,
  ShieldCheck,
  Wifi,
  Globe,
  Users,
  ScanLine,
  FileJson,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

const coreTools = [
  {
    icon: Link2,
    title: "Free URL Shortener",
    description: "Shorten long web addresses instantly. Permanent links, custom slugs, and no signup needed.",
    href: "/free-url-shortener",
    badge: "Core",
  },
  {
    icon: QrCode,
    title: "QR Code Generator",
    description: "Create high-resolution scannable QR codes for websites, text, business cards, flyers, and menus.",
    href: "/qr-code-generator",
    badge: "Popular",
  },
  {
    icon: BarChart3,
    title: "Link Tracker & Analytics",
    description: "Monitor real-time clicks, top visitor countries, mobile vs desktop devices, and referrer sources.",
    href: "/link-tracker",
    badge: "Free Stats",
  },
  {
    icon: LinkIcon,
    title: "UTM Campaign Builder",
    description: "Build tagged campaign links for Google Ads, Facebook, Instagram, LinkedIn, and email marketing.",
    href: "/utm-builder",
    badge: "Marketing",
  },
  {
    icon: Smartphone,
    title: "Link-in-Bio Creator",
    description: "Build a sleek, customizable mobile profile page for your Instagram, TikTok, YouTube, or X bio.",
    href: "/link-in-bio",
    badge: "Creators",
  },
  {
    icon: ShieldCheck,
    title: "URL Expander & Safety Checker",
    description: "Safely unwrap and inspect shortened URLs before clicking to verify the real destination and HTTPS status.",
    href: "/url-expander",
    badge: "Security",
  },
  {
    icon: Wifi,
    title: "WiFi QR Generator",
    description: "Create scan-to-connect WiFi codes for guests at home, cafes, Airbnbs, restaurants, and offices.",
    href: "/wifi-qr-code-generator",
    badge: "Instant",
  },
  {
    icon: Globe,
    title: "Branded Custom Domains",
    description: "Connect your own domain (e.g. link.yourbrand.com) to build trust and brand recognition on every link.",
    href: "/pricing",
    badge: "Pro",
  },
]

const utilityTools = [
  {
    icon: Users,
    title: "Split Expenses & Bills",
    description: "Calculate group shares and create UPI payment QR codes for effortless bill splitting.",
    href: "/split",
  },
  {
    icon: ScanLine,
    title: "PDF Document Scanner",
    description: "Browser-based document scanning with auto-crop, contrast filters, and multi-page PDF export.",
    href: "/pdf",
  },
  {
    icon: FileJson,
    title: "JSON Formatter & Validator",
    description: "Format, validate, minify, and inspect JSON payloads client-side with syntax highlighting.",
    href: "/json",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20" id="features">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Complete Link Toolkit
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Everything you need to share, brand &amp; track links
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Professional link management tools built for creators, marketers, and small businesses. 100% free with no signup required.
          </p>
        </div>

        {/* 8 Core Tool Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {coreTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group relative rounded-xl border border-border bg-card/60 p-5 transition-all hover:border-primary/50 hover:bg-accent/40 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center text-xs font-medium text-primary">
                Open Tool <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Secondary Free Utility Tools Banner */}
        <div className="mt-16 rounded-2xl border border-border/80 bg-muted/20 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Free Everyday Utilities</h3>
              <p className="text-xs text-muted-foreground">Extra free productivity tools available directly in your browser.</p>
            </div>
            <Link href="/docs" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              API Documentation <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {utilityTools.map((util) => (
              <Link
                key={util.title}
                href={util.href}
                className="rounded-lg border border-border bg-card p-4 hover:border-primary/40 transition-colors block"
              >
                <div className="flex items-center gap-3 mb-2">
                  <util.icon className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">{util.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{util.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
