import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UL0Icon } from "@/components/ul0-icon"

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
    description: "Global HTTP 307 edge redirection and short link resolution (/r/*)",
    status: "Operational",
    icon: "bolt",
  },
  {
    name: "Developer REST API",
    description: "Link creation, custom slug generation, and API key authentication (/api/*)",
    status: "Operational",
    icon: "server",
  },
  {
    name: "Custom Domain DNS & SSL Engine",
    description: "Automated CNAME verification and Let's Encrypt SSL certificates",
    status: "Operational",
    icon: "domain",
  },
  {
    name: "Privacy-Friendly Click Analytics",
    description: "Real-time geo-attribution and device click counting",
    status: "Operational",
    icon: "chartline",
  },
  {
    name: "Web Dashboard & Authentication",
    description: "Account access, domain management, and QR code tools",
    status: "Operational",
    icon: "shield",
  },
]

export default function StatusPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16 border-b bg-muted/20">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-6 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>All Systems Operational</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              System Status
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
              Current service status and health across UL0 edge routing, API endpoints, and DNS workers.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-base font-bold text-foreground mb-4">Core Services</h2>
            <div className="rounded-3xl border border-border divide-y divide-border bg-card overflow-hidden shadow-2xs">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 sm:p-5">
                  <div className="flex items-start gap-3.5">
                    <div className="rounded-2xl border border-border bg-surface-2 p-2 mt-0.5 text-primary">
                      <UL0Icon name={service.icon} animated={true} size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{service.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                    <UL0Icon name="check" size={14} />
                    <span>{service.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-border bg-card/60 p-6 text-center shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-foreground">Need help or noticing an anomaly?</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Our support team monitors edge infrastructure 24/7.
              </p>
              <div className="pt-1">
                <a
                  href="mailto:getul0site@gmail.com"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-surface-2 px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
                >
                  Contact Infrastructure Support
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
