import type { Metadata } from "next"
import Link from "next/link"
import {
  Clock,
  ShieldCheck,
  Layers,
  Activity,
  Info,
  Mail,
  ChevronRight,
  Database,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Scheduled Maintenance — UL0",
  description: "UL0 is currently undergoing scheduled infrastructure migration. Services will resume within 24 hours.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#191919] text-[#37352F] dark:text-[#D4D4D4] antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800 flex flex-col justify-between font-sans">
      {/* Top Notion-Style Breadcrumb Navigation */}
      <header className="border-b border-[#E9E9E7] dark:border-[#2E2E2E] bg-[#FBFBFA]/90 dark:bg-[#191919]/90 backdrop-blur-xs sticky top-0 z-20">
        <div className="max-w-[760px] mx-auto px-4 h-12 flex items-center justify-between text-xs text-[#787774] dark:text-[#9B9A97]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 truncate">
            <span className="flex items-center gap-1 font-medium text-[#37352F] dark:text-[#E6E6E5]">
              <span className="w-4 h-4 rounded-xs bg-[#37352F] dark:bg-[#E6E6E5] text-white dark:text-[#191919] flex items-center justify-center text-[10px] font-bold font-mono">
                U
              </span>
              <span>UL0</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[1.5] text-[#9B9A97]" />
            <span>Infrastructure</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[1.5] text-[#9B9A97]" />
            <span className="text-[#37352F] dark:text-[#E6E6E5] truncate">Maintenance</span>
          </div>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border border-[#E9E9E7] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] text-[#787774] dark:text-[#9B9A97]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>HTTP 503</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Notion-Style Document Page */}
      <main className="flex-1 max-w-[760px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Document Icon & Title Block */}
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-lg border border-[#E9E9E7] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] flex items-center justify-center text-[#37352F] dark:text-[#E6E6E5] shadow-xs">
            <Database className="w-6 h-6 stroke-[1.5]" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#37352F] dark:text-[#E6E6E5]">
              Scheduled Maintenance
            </h1>
            <p className="text-sm text-[#787774] dark:text-[#9B9A97] leading-relaxed">
              Infrastructure upgrade in progress. Systems are offline temporarily to migrate database capacity.
            </p>
          </div>
        </div>

        {/* Notion Property Table */}
        <div className="border-t border-b border-[#E9E9E7] dark:border-[#2E2E2E] py-3 space-y-2 text-xs">
          {/* Status Property */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4 sm:col-span-3 flex items-center gap-1.5 text-[#787774] dark:text-[#9B9A97]">
              <Activity className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Status</span>
            </div>
            <div className="col-span-8 sm:col-span-9 flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FCF4E6] text-[#B07219] dark:bg-[#3E2D17] dark:text-[#E8A850]">
                In Progress
              </span>
            </div>
          </div>

          {/* Window Property */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4 sm:col-span-3 flex items-center gap-1.5 text-[#787774] dark:text-[#9B9A97]">
              <Clock className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Downtime Window</span>
            </div>
            <div className="col-span-8 sm:col-span-9 text-[#37352F] dark:text-[#E6E6E5] font-mono text-[11px]">
              24 hours (Retry-After: 86400)
            </div>
          </div>

          {/* Scope Property */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4 sm:col-span-3 flex items-center gap-1.5 text-[#787774] dark:text-[#9B9A97]">
              <Layers className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Scope</span>
            </div>
            <div className="col-span-8 sm:col-span-9 text-[#37352F] dark:text-[#E6E6E5]">
              Link Redirection, QR Generator, API, Public Forms, Dashboard
            </div>
          </div>

          {/* Data Integrity Property */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4 sm:col-span-3 flex items-center gap-1.5 text-[#787774] dark:text-[#9B9A97]">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Data Integrity</span>
            </div>
            <div className="col-span-8 sm:col-span-9 flex items-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#EBF5EE] text-[#2B7A4B] dark:bg-[#183624] dark:text-[#57B77C]">
                <CheckCircle2 className="w-3 h-3 stroke-[2]" />
                <span>Zero Link Loss</span>
              </span>
            </div>
          </div>
        </div>

        {/* Notion Media Embed: Animated WebP */}
        <div className="space-y-2">
          <div className="rounded-lg border border-[#E9E9E7] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] overflow-hidden shadow-xs">
            <img
              src="/ul0-maintenance.webp"
              alt="UL0 Scheduled Maintenance Animation"
              width={800}
              height={450}
              className="w-full h-auto object-cover block"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#787774] dark:text-[#9B9A97] px-1 font-mono">
            <span>ul0-maintenance-animation.webp</span>
            <span>90 frames · continuous loop</span>
          </div>
        </div>

        {/* Notion Callout Box */}
        <div className="p-4 rounded-lg border border-[#E9E9E7] dark:border-[#2E2E2E] bg-[#F7F6F3] dark:bg-[#202020] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#787774] dark:text-[#9B9A97] shrink-0 mt-0.5 stroke-[1.5]" />
          <div className="space-y-1 text-xs sm:text-sm text-[#37352F] dark:text-[#D4D4D4] leading-relaxed">
            <div className="font-semibold text-[#37352F] dark:text-[#E6E6E5]">
              Important update for customers and developers
            </div>
            <p className="text-xs text-[#787774] dark:text-[#9B9A97] leading-relaxed">
              We are carrying out essential database and infrastructure maintenance. All existing short links, custom domain mappings, QR configurations, and analytics logs are safe. Short link redirection will resume automatically as soon as the database migration concludes.
            </p>
          </div>
        </div>

        {/* Notion-Style Toggle / Accordion FAQs */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#787774] dark:text-[#9B9A97]">
            Frequently Asked Questions
          </h2>

          <details className="group border border-[#E9E9E7] dark:border-[#2E2E2E] rounded-md bg-white dark:bg-[#202020] p-3 text-xs open:bg-[#F7F6F3]/50 dark:open:bg-[#252525]/50 transition-colors">
            <summary className="font-medium text-[#37352F] dark:text-[#E6E6E5] cursor-pointer list-none flex items-center justify-between">
              <span>Why is the website in maintenance mode?</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#9B9A97] transition-transform duration-150 group-open:rotate-90 stroke-[1.5]" />
            </summary>
            <p className="mt-2 text-[#787774] dark:text-[#9B9A97] leading-relaxed pl-1">
              Our storage tier is being migrated to an upgraded cluster with increased connection limits and lower latency. To ensure no database writes are interrupted or corrupted, write and read operations are temporarily suspended.
            </p>
          </details>

          <details className="group border border-[#E9E9E7] dark:border-[#2E2E2E] rounded-md bg-white dark:bg-[#202020] p-3 text-xs open:bg-[#F7F6F3]/50 dark:open:bg-[#252525]/50 transition-colors">
            <summary className="font-medium text-[#37352F] dark:text-[#E6E6E5] cursor-pointer list-none flex items-center justify-between">
              <span>Will my existing short links work after maintenance?</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#9B9A97] transition-transform duration-150 group-open:rotate-90 stroke-[1.5]" />
            </summary>
            <p className="mt-2 text-[#787774] dark:text-[#9B9A97] leading-relaxed pl-1">
              Yes. All short links, custom aliases, domain configurations, and QR codes are preserved without modification. Redirection will resume immediately once maintenance mode ends.
            </p>
          </details>

          <details className="group border border-[#E9E9E7] dark:border-[#2E2E2E] rounded-md bg-white dark:bg-[#202020] p-3 text-xs open:bg-[#F7F6F3]/50 dark:open:bg-[#252525]/50 transition-colors">
            <summary className="font-medium text-[#37352F] dark:text-[#E6E6E5] cursor-pointer list-none flex items-center justify-between">
              <span>How are search crawlers and SEO treated during downtime?</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#9B9A97] transition-transform duration-150 group-open:rotate-90 stroke-[1.5]" />
            </summary>
            <p className="mt-2 text-[#787774] dark:text-[#9B9A97] leading-relaxed pl-1">
              All pages respond with standard HTTP 503 Service Unavailable and a Retry-After header of 86,400 seconds (24 hours). This signals Googlebot and other crawlers that downtime is temporary, preserving search indexing and rankings.
            </p>
          </details>
        </div>

        {/* Action Links */}
        <div className="pt-4 border-t border-[#E9E9E7] dark:border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-[#787774] dark:text-[#9B9A97]">
            <a
              href="mailto:support@ul0.site"
              className="inline-flex items-center gap-1 hover:text-[#37352F] dark:hover:text-[#E6E6E5] underline underline-offset-4 decoration-[#E9E9E7] dark:decoration-[#2E2E2E] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Contact Support</span>
            </a>

            <a
              href="https://github.com/Saketkesar/ul0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#37352F] dark:hover:text-[#E6E6E5] underline underline-offset-4 decoration-[#E9E9E7] dark:decoration-[#2E2E2E] transition-colors"
            >
              <span>GitHub Status</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#787774] dark:text-[#9B9A97] font-mono">
            <span>support@ul0.site</span>
          </div>
        </div>
      </main>

      {/* Notion Footer */}
      <footer className="border-t border-[#E9E9E7] dark:border-[#2E2E2E] py-6 text-center text-xs text-[#787774] dark:text-[#9B9A97]">
        <div className="max-w-[760px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>UL0 Platform Maintenance · 2026</span>
          <span className="font-mono text-[11px]">System Status: Paused</span>
        </div>
      </footer>
    </div>
  )
}
