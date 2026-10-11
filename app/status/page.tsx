import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle2, ShieldCheck, Zap, Globe, Server, Activity } from "lucide-react"

export const metadata: Metadata = {
  title: "System Status & Service Health",
  description: "Live operational status of UL0 edge redirect engine, REST API, DNS verification workers, and click analytics infrastructure.",
  alternates: {
    canonical: "https://ul0.site/status",
  },
  openGraph: {
    title: "UL0 System Status & Service Health | UL0",
    description: "Live operational status of UL0 services and infrastructure.",
    url: "https://ul0.site/status",
    type: "website",
    images: [{
      url: "https://ul0.site/social-card.png",
      width: 1376,
      height: 768,
      alt: "UL0 System Status",
    }],
  },
}

const services = [
  {
    name: "Edge Link Redirection Engine",
    description: "Global HTTP 301 edge redirection and short link resolution (/r/*)",
    status: "Operational",
    icon: Zap,
  },
  {
    name: "Developer REST API",
    description: "Link creation, custom slug generation, and API key authentication (/api/*)",
    status: "Operational",
    icon: Server,
  },
  {
    name: "Custom Domain DNS & SSL Engine",
    description: "Automated CNAME verification and Let's Encrypt SSL certificates",
    status: "Operational",
    icon: Globe,
  },
  {
    name: "Privacy-Friendly Click Analytics",
    description: "Real-time geo-attribution and device click counting",
    status: "Operational",
    icon: Activity,
  },
  {
    name: "Web Dashboard & Authentication",
    description: "Account access, domain management, and QR code tools",
    status: "Operational",
    icon: ShieldCheck,
  },
]

export default function StatusPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16 border-b bg-muted/20">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              All Systems Operational
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              System Status
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Current service status and health across UL0 edge routing, API endpoints, and DNS workers.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-base font-semibold text-foreground mb-4">Core Services</h2>
            <div className="rounded-xl border border-border divide-y divide-border bg-card overflow-hidden">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <div key={service.name} className="flex items-center justify-between p-4 sm:p-5">
                    <div className="flex items-start gap-3.5">
                      <div className="rounded-lg border border-border bg-muted/50 p-2 mt-0.5 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground">{service.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{service.status}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 rounded-xl border border-border bg-muted/20 p-5 text-center">
              <h3 className="text-sm font-semibold text-foreground mb-1">Need help or noticing an anomaly?</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Our support team monitors edge infrastructure 24/7.
              </p>
              <a
                href="mailto:getul0site@gmail.com"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
              >
                Contact Infrastructure Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
