import { Link2, Globe, BarChart3, QrCode, Shield, Code } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Link2,
    title: "Short Links",
    description: "Shorten any URL instantly without signup. Custom slugs, permanent links, and smart app detection.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Connect your own domain (e.g. link.yourbrand.com) and create branded short links. One domain free on every plan.",
    href: "/pricing",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description: "See who clicks your links — country, device, browser, and referrer — without cookies or tracking scripts.",
  },
  {
    icon: QrCode,
    title: "QR Codes",
    description: "Generate dynamic QR codes that point to your short link. Edit the destination later without reprinting.",
    href: "/qr",
  },
  {
    icon: Shield,
    title: "Safe & Private",
    description: "Every link is scanned for phishing and malware. No cookies, no IP storage, no personal data sold.",
  },
  {
    icon: Code,
    title: "Developer API",
    description: "Create and manage links programmatically. JSON API with rate limiting and API key authentication.",
    href: "/docs",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16" id="features">
      <div className="container mx-auto px-4">
        <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Everything you need to manage links
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted-foreground sm:mb-12 sm:text-base">
          Branded short links, QR codes, and click analytics. Free to start, no credit card.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {features.map((feature) => {
            const Content = (
              <>
                <feature.icon className="mb-3 h-6 w-6 text-primary sm:mb-4" strokeWidth={1.5} />
                <h3 className="mb-1.5 text-base font-semibold text-card-foreground sm:text-lg">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground sm:text-sm">{feature.description}</p>
              </>
            )

            return feature.href ? (
              <Link
                key={feature.title}
                href={feature.href}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-primary/5 sm:p-6 block"
              >
                {Content}
              </Link>
            ) : (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-5 sm:p-6"
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
