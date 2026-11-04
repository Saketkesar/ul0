import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Clock, ShieldAlert, RefreshCw, Mail, ExternalLink, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Scheduled Maintenance — UL0",
  description: "UL0 is currently undergoing scheduled database maintenance. Services will resume within 24 hours.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md border border-border bg-card flex items-center justify-center p-1">
              <img src="/ul0.png" alt="UL0 Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground">UL0</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border border-border bg-card text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Maintenance Mode</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 sm:py-16 space-y-8 flex flex-col items-center text-center justify-center">
        {/* Maintenance Banner Graphic */}
        <div className="w-full max-w-2xl rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <picture>
            <source srcSet="/ul0-maintenance-4k.webp" media="(min-width: 1920px)" />
            <img
              src="/ul0-maintenance.webp"
              alt="UL0 Scheduled Maintenance"
              className="w-full h-auto object-cover aspect-video"
            />
          </picture>
        </div>

        {/* Informational Card */}
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-mono text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimated Window: ~24 Hours</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            Scheduled System Maintenance
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We are performing essential database and infrastructure upgrades to improve system capacity, stability, and link routing speeds. All services are temporarily paused and will resume shortly.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-medium">
            <a
              href="mailto:support@ul0.site"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-md border border-border bg-card hover:bg-muted/50 text-foreground transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Contact Support</span>
            </a>

            <a
              href="https://github.com/Saketkesar/ul0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-md border border-border bg-card hover:bg-muted/50 text-foreground transition-colors cursor-pointer"
            >
              <span>GitHub Status &amp; Releases</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          </div>
        </div>

        {/* System Notice Box */}
        <div className="w-full max-w-md p-4 rounded-xl border border-border bg-muted/20 text-left text-xs font-mono space-y-1 text-muted-foreground">
          <div className="flex items-center justify-between text-foreground font-semibold">
            <span>Systems Offline</span>
            <span>24h Migration</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Link shortening, dashboard management, QR generator, and public forms are paused during this maintenance window. Existing redirects will resume as soon as migration completes.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs font-mono text-muted-foreground">
        <p>UL0 Infrastructure Maintenance · support@ul0.site</p>
      </footer>
    </div>
  )
}
