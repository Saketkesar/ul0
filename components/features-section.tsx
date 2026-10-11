import { Link2, Globe, BarChart3, QrCode, Shield, Code, Sparkles, ArrowRight, Zap, Lock, Cpu } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Link2,
    badge: "Core Engine",
    title: "Instant Short Links",
    description: "Shorten any URL in milliseconds without signup. Custom slugs, permanent 301 redirects, and zero link expiration.",
    gradient: "from-teal-500/10 to-emerald-500/5",
    iconColor: "text-primary",
  },
  {
    icon: Globe,
    badge: "Branding",
    title: "Custom Branded Domains",
    description: "Connect link.yourbrand.com in 60 seconds with automated SSL. Included free on every plan with zero DNS headaches.",
    href: "/pricing",
    gradient: "from-blue-500/10 to-cyan-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: BarChart3,
    badge: "Privacy First",
    title: "Real-Time Analytics",
    description: "Track visitor country, device type, browser, and referrer in real time without cookies, IP storage, or privacy breaches.",
    href: "/features",
    gradient: "from-purple-500/10 to-indigo-500/5",
    iconColor: "text-purple-500",
  },
  {
    icon: QrCode,
    badge: "High Resolution",
    title: "Vector QR Code Studio",
    description: "Generate crisp dynamic SVG/PNG vector QR codes with embedded logos and live redirect destinations.",
    href: "/qr",
    gradient: "from-amber-500/10 to-orange-500/5",
    iconColor: "text-amber-500",
  },
  {
    icon: Shield,
    badge: "Zero Phishing",
    title: "Automated Threat Defense",
    description: "Every link is scanned in real time against malicious phishing lists, ensuring 100% brand safety for your audience.",
    gradient: "from-emerald-500/10 to-teal-500/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: Code,
    badge: "REST & Webhooks",
    title: "Developer REST API",
    description: "Create, inspect, and manage links programmatically with lightning-fast JSON API endpoints and SDKs.",
    href: "/docs",
    gradient: "from-pink-500/10 to-rose-500/5",
    iconColor: "text-pink-500",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden" id="features">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Power Features Built for Growth</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            Everything you need to master your link infrastructure
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            From instant public shortening to enterprise custom domains and vector QR codes, all powered by global edge servers.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Content = (
              <div className="h-full flex flex-col justify-between p-6 sm:p-7">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-surface-1 border border-border shadow-xs ${feature.iconColor}`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-3 text-muted-foreground border border-border">
                      {feature.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {feature.href && (
                  <div className="pt-4 mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Explore feature</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            )

            return feature.href ? (
              <Link
                key={feature.title}
                href={feature.href}
                className={`group rounded-2xl border border-border bg-surface-2 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 block relative overflow-hidden bg-gradient-to-br ${feature.gradient}`}
              >
                {Content}
              </Link>
            ) : (
              <div
                key={feature.title}
                className={`rounded-2xl border border-border bg-surface-2 relative overflow-hidden bg-gradient-to-br ${feature.gradient}`}
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
