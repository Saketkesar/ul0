import { Link2, Users, QrCode, Smartphone, Shield, Zap, Globe, Clock, Share2, ScanLine } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Link2,
    title: "Free URL Shortener",
    description: "Shorten any long URL instantly. Create short links without signup or registration.",
  },
  {
    icon: Users,
    title: "Bill Splitter",
    description: "Split expenses with friends and groups. Calculate who owes whom automatically.",
    href: "/split",
  },
  {
    icon: QrCode,
    title: "UPI QR Code Generator",
    description: "Generate QR codes for UPI payments. Scan and pay instantly with any UPI app.",
    href: "/split",
  },
  {
    icon: ScanLine,
    title: "PDF Scanner & Tools",
    description: "Scan documents with your camera, auto-crop, create PDFs from images, and merge, reorder & rename PDFs. 100% free.",
    href: "/pdf",
  },
  {
    icon: Smartphone,
    title: "Open in App",
    description: "Smart app detection for YouTube, Instagram, Facebook, Twitter & more social apps.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "All shortened URLs are scanned for security. HTTPS protected connections.",
  },
  {
    icon: Zap,
    title: "Fast Redirects",
    description: "Lightning-fast URL redirection. Optimized for speed on all devices.",
  },
  {
    icon: Globe,
    title: "Custom Domain Short Links",
    description: "Connect your own custom domain (e.g. link.yourbrand.com) and shorten links under your own brand. 1 custom domain included free!",
    href: "/pricing",
  },
  {
    icon: Clock,
    title: "Permanent Links",
    description: "Your shortened URLs never expire. Links work forever without any time limit.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "One-click copy and share. Share to WhatsApp, Twitter, Facebook directly.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16" id="features">
      <div className="container mx-auto px-4">
        <h2 className="mb-3 text-center text-2xl font-bold text-foreground sm:text-3xl">
          Why Choose ul0 URL Shortener?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted-foreground sm:mb-12 sm:text-base">
          The best free link shortener with expense splitting. No signup needed. No hidden fees. 100% free forever.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {features.map((feature) => {
            const Content = (
              <>
                <feature.icon className="mb-3 h-8 w-8 text-primary sm:mb-4 sm:h-10 sm:w-10" />
                <h3 className="mb-1.5 text-base font-semibold text-card-foreground sm:mb-2 sm:text-lg">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground sm:text-sm">{feature.description}</p>
              </>
            )

            return feature.href ? (
              <Link
                key={feature.title}
                href={feature.href}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50 sm:p-6 block"
              >
                {Content}
              </Link>
            ) : (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50 sm:p-6"
              >
                {Content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
