import React from "react"
import { UL0Icon } from "@/components/ul0-icon"

const STATS = [
  {
    icon: "team",
    value: "3M+",
    label: "Active creators & teams",
    sub: "Shortening links weekly",
  },
  {
    icon: "link",
    value: "100M+",
    label: "Links & QR codes created",
    sub: "Permanent 307 routing",
  },
  {
    icon: "chartline",
    value: "250M+",
    label: "Clicks & scans tracked",
    sub: "Real-time analytics",
  },
  {
    icon: "status",
    value: "99.99%",
    label: "Global edge uptime",
    sub: "Sub-15ms latency",
  },
  {
    icon: "shield",
    value: "0",
    label: "Tracking cookies",
    sub: "100% privacy-first",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 sm:py-24 border-b border-border bg-card/40">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Adopted and loved by creators &amp; teams worldwide
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Trusted for speed, uptime, and transparent privacy.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center px-4 py-4 sm:py-6 group ${
                idx === STATS.length - 1 ? "col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="h-14 w-14 rounded-2xl bg-surface-2 border border-border/70 flex items-center justify-center p-2.5 mb-4 shadow-2xs group-hover:scale-110 transition-transform">
                <UL0Icon name={stat.icon} animated={true} size={36} />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {stat.value}
              </div>
              <div className="mt-1.5 text-xs sm:text-sm font-semibold text-foreground">
                {stat.label}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

