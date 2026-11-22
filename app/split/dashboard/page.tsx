import { SplitWizard } from "@/components/split/split-wizard"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Dashboard | UL0 Split — Free UPI Bill Splitter",
  description: "Create and manage your UPI splits. Friends pay with GPay, PhonePe, or Paytm with zero app install.",
}

export default function SplitDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#111715] flex flex-col font-sans selection:bg-[#0F7B5F]/20 selection:text-[#0F7B5F]">
      {/* 64px Flat Nav */}
      <nav className="h-16 border-b border-[#E4E2DA] bg-[#F6F5F1] sticky top-0 z-40 px-4 sm:px-8">
        <div className="max-w-[1080px] mx-auto h-full flex items-center justify-between">
          <Link href="/split" className="flex items-center gap-2 font-bold text-base tracking-tight text-[#111715]">
            <span className="w-7 h-7 rounded-[8px] bg-[#0F7B5F] text-white flex items-center justify-center font-bold text-xs">
              U
            </span>
            <span>UL0 Split</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/split"
              className="text-[13px] font-medium text-[#5F6763] hover:text-[#111715] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">About UL0 Split</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full">
        <SplitWizard />
      </main>

      {/* 5-Link Minimal Footer */}
      <footer className="border-t border-[#E4E2DA] py-8 px-4 sm:px-8 bg-[#F6F5F1]">
        <div className="max-w-[1080px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#5F6763]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#111715]">UL0 Split</span>
            <span>·</span>
            <span>Direct bank-to-bank UPI</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-[#111715] transition-colors">Link Shortener</Link>
            <Link href="/pricing" className="hover:text-[#111715] transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-[#111715] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#111715] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[#111715] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
