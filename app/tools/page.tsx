import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  LinkIcon,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Search,
  Code2,
  Share2,
  FileJson,
  ScanLine,
  Wifi,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Eye,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Free Web & Link Developer Tools Suite | UL0",
  description: "Free developer and marketer tools: HTTP redirect checker, URL expander, OpenGraph previewer, UTM campaign builder, QR code generator, and Meta tag generator.",
  alternates: {
    canonical: "https://ul0.site/tools",
  },
  openGraph: {
    title: "UL0 Free Web & Developer Tools Suite",
    description: "High-performance tools for link inspection, SEO metadata, QR generation, and campaign tracking.",
    url: "https://ul0.site/tools",
    type: "website",
  },
}

const TOOL_CATEGORIES = [
  {
    category: "Link & SEO Utilities",
    description: "Inspect redirects, audit short link security, and optimize campaign attribution.",
    tools: [
      {
        title: "HTTP Redirect Checker",
        slug: "redirect-checker",
        href: "/tools/redirect-checker",
        icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
        badge: "New",
        description: "Trace 301, 302, and 307 redirect chains, view response headers, and audit landing page latency.",
      },
      {
        title: "URL Expander & Safety Checker",
        slug: "url-expander",
        href: "/tools/url-expander",
        icon: <Search className="h-5 w-5 text-blue-500" />,
        badge: "Popular",
        description: "Unshorten any short link (bit.ly, t.co, tinyurl), preview the destination, and inspect safety status.",
      },
      {
        title: "UTM Campaign Builder",
        slug: "utm-builder",
        href: "/utm",
        icon: <LinkIcon className="h-5 w-5 text-purple-500" />,
        badge: "Essential",
        description: "Generate standardized Google Analytics 4 (GA4) campaign tracking links with sanitized UTM parameters.",
      },
      {
        title: "OpenGraph & Social Previewer",
        slug: "og-preview",
        href: "/tools/og-preview",
        icon: <Eye className="h-5 w-5 text-cyan-500" />,
        badge: "New",
        description: "Test how your link looks when shared on X (Twitter), LinkedIn, Facebook, and Discord.",
      },
      {
        title: "Meta Tag Generator",
        slug: "meta-tag-generator",
        href: "/tools/meta-tag-generator",
        icon: <Code2 className="h-5 w-5 text-amber-500" />,
        badge: "SEO Tool",
        description: "Generate standard HTML meta tags, OpenGraph markup, and Twitter card code for any webpage.",
      },
      {
        title: "Free URL Shortener",
        slug: "shortener",
        href: "/",
        icon: <Share2 className="h-5 w-5 text-primary" />,
        badge: "Core",
        description: "Shorten links instantly with permanent 301 redirects, click analytics, and zero required registration.",
      },
    ],
  },
  {
    category: "QR Code & Connectivity",
    description: "Generate high-resolution vector codes for physical marketing, restaurants, and wireless access.",
    tools: [
      {
        title: "QR Code Generator",
        slug: "qr-generator",
        href: "/qr",
        icon: <QrCode className="h-5 w-5 text-emerald-500" />,
        badge: "Vector High-Res",
        description: "Create crisp, high-resolution QR codes for websites, social profiles, menus, and business flyers.",
      },
      {
        title: "WiFi QR Code Generator",
        slug: "wifi-qr",
        href: "/wifi",
        icon: <Wifi className="h-5 w-5 text-blue-500" />,
        badge: "No Typing",
        description: "Generate a scan-to-connect Wi-Fi QR code for homes, offices, cafes, and event spaces.",
      },
    ],
  },
  {
    category: "Developer & Document Utilities",
    description: "Browser-based utilities running client-side with zero data storage.",
    tools: [
      {
        title: "JSON Formatter & Validator",
        slug: "json",
        href: "/json",
        icon: <FileJson className="h-5 w-5 text-indigo-500" />,
        badge: "Client-Side",
        description: "Prettify, minify, and validate JSON payloads with syntax error detection and copyable formatting.",
      },
      {
        title: "PDF Tools & Scanner",
        slug: "pdf",
        href: "/pdf",
        icon: <ScanLine className="h-5 w-5 text-rose-500" />,
        badge: "Private",
        description: "Scan documents, convert images to PDF, and merge or reorder files entirely inside your browser.",
      },
      {
        title: "Free Backlink Directory",
        slug: "backlinks",
        href: "/backlinks",
        icon: <Sparkles className="h-5 w-5 text-emerald-400" />,
        badge: "SEO Exchange",
        description: "Earn a permanent verified partner backlink from ul0.site by embedding a verified safety badge.",
      },
    ],
  },
]

export default function ToolsIndexPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4">
              <Code2 className="h-3.5 w-3.5" />
              100% Free Online Web Utilities
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Developer &amp; Link Marketing Tool Suite
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Fast, privacy-conscious tools for webmasters, digital marketers, and software engineers. No paywalls, no mandatory signups, and zero data selling.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-16">
            {TOOL_CATEGORIES.map((cat, idx) => (
              <div key={idx}>
                <div className="mb-6 border-b border-border pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">{cat.category}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{cat.description}</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={tool.href}
                      className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="rounded-xl bg-muted p-2.5 group-hover:scale-105 transition-transform">
                            {tool.icon}
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                            {tool.badge}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
                        <span>Launch tool</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-20 rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
              Need custom branded links with real-time analytics?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6">
              Connect your own custom domain, monitor link clicks by country and device, and protect your URLs with UL0.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create a Free Short Link
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
