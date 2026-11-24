import { SplitWizard } from "@/components/split/split-wizard"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Dashboard | UL0 Split — Free UPI Bill Splitter",
  description: "Create and manage your UPI splits. Friends pay with GPay, PhonePe, or Paytm with zero app install.",
}

export default function SplitDashboardPage() {
  return (
    <div className="min-h-screen bg-white text-[#0B1A17] flex flex-col font-['Space_Grotesk',sans-serif] selection:bg-[#3DDBB8] selection:text-[#0B1A17]">
      {/* 64px Flat Bold Nav matching Landing Page */}
      <nav className="h-16 border-b border-[#D3E2DD] bg-white sticky top-0 z-40 px-4 sm:px-8">
        <div className="max-w-[1080px] mx-auto h-full flex items-center justify-between">
          <Link
            href="/split"
            className="flex items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ul0split-logo-dark.png" alt="UL0 Split" className="h-8 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/split"
              className="text-[13px] font-medium text-[#5E726C] hover:text-[#0B1A17] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
              <span className="hidden sm:inline">How it works</span>
              <span className="sm:hidden">Landing</span>
            </Link>

            <Link
              href="/split"
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full border border-[#D3E2DD] text-[12px] font-bold text-[#1B685C] hover:bg-[#F4FAF8] transition-colors"
            >
              Tear a receipt →
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full bg-white">
        <SplitWizard />
      </main>

      {/* 5-Link Minimal Footer matching Bold Theme */}
      <footer className="border-t border-[#D3E2DD] py-8 px-4 sm:px-8 bg-white">
        <div className="max-w-[1080px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#5E726C]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0B1A17]">UL0.split</span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-[#0B1A17] font-bold">
              by
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ul0.png" alt="ul0.site" className="h-5 w-auto object-contain inline-block" />
              <span>ul0.site</span>
            </span>
            <span>·</span>
            <span className="font-['JetBrains_Mono',monospace] text-[12px]">Direct bank-to-bank UPI</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[13px] font-medium">
            <Link href="/" className="hover:text-[#0B1A17] transition-colors">Link Shortener</Link>
            <Link href="/pricing" className="hover:text-[#0B1A17] transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-[#0B1A17] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#0B1A17] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[#0B1A17] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
