"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si"

export function SplitLandingPage() {
  return (
    <div className="space-y-20 py-4 sm:py-8 font-sans">
      {/* =====================================================================
          HERO SECTION
      ====================================================================== */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF7F3] border border-[#CCD9D4] text-[#0B7A66] text-xs font-semibold shadow-2xs">
          <UL0Icon name="shield" size={14} />
          <span>Zero app install · Pure bank-to-bank UPI · 100% Free</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0B1A17] leading-[1.1]">
          Split bills over UPI. <br className="hidden sm:inline" />
          <span className="text-[#0B7A66]">Friends install nothing.</span>
        </h1>

        <p className="text-[#5A6B66] text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          The person who paid creates the split in seconds. Friends open the link, tap their name, and pay their exact share from GPay, PhonePe, or Paytm. Money transfers directly into your bank account.
        </p>

        {/* Primary CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            className="w-full sm:w-auto bg-[#0B1A17] hover:bg-[#1a2e2a] text-white font-extrabold text-base h-14 px-8 rounded-2xl shadow-md transition-transform active:translate-y-[1px] cursor-pointer"
          >
            <Link href="/split/dashboard">
              <span>Create your split</span>
              <UL0Icon name="arrowright" size={18} className="ml-2" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-[#CCD9D4] hover:bg-[#F7FAF8] text-[#0B1A17] font-bold text-base h-14 px-7 rounded-2xl cursor-pointer"
          >
            <Link href="/hisab">
              <UL0Icon name="billing" size={18} className="mr-2 text-[#0B7A66]" />
              <span>Group Hisab (Trips & Flat)</span>
            </Link>
          </Button>
        </div>

        {/* Supported UPI Apps Badges */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-xs text-[#5A6B66] font-medium">
          <span className="flex items-center gap-1.5">
            <SiGooglepay className="w-5 h-5 text-[#0B1A17]" /> Google Pay
          </span>
          <span className="flex items-center gap-1.5">
            <SiPhonepe className="w-4 h-4 text-[#0B1A17]" /> PhonePe
          </span>
          <span className="flex items-center gap-1.5">
            <SiPaytm className="w-5 h-5 text-[#0B1A17]" /> Paytm
          </span>
          <span className="font-bold text-[#0B1A17]">CRED · BHIM · Any UPI App</span>
        </div>

        {/* Hero Animation Container (split-01-bill-to-shares.webp) */}
        <div className="pt-8">
          <div className="relative mx-auto max-w-2xl rounded-3xl border border-[#E4ECE8] bg-white p-4 sm:p-6 shadow-[0_4px_24px_rgba(11,26,23,0.06)] overflow-hidden">
            {/* Visual Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F3] text-xs">
              <div className="flex items-center gap-2 text-[#0B7A66] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3DDBB8] animate-pulse" />
                <span>Live Bill Splitting Preview</span>
              </div>
              <span className="text-[11px] text-[#5A6B66] font-mono">1 Bill → Exact Shares</span>
            </div>

            {/* Transparent Animated WebP */}
            <div className="py-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/split-animations/split-01-bill-to-shares.webp"
                alt="Bill splits into equal shares that fly to each person and settle over UPI"
                className="w-full max-w-lg object-contain rounded-2xl"
              />
            </div>

            {/* Bottom trust row inside card */}
            <div className="pt-3 border-t border-[#F1F5F3] grid grid-cols-3 gap-2 text-center text-[11px] text-[#5A6B66]">
              <div>
                <strong className="text-[#0B1A17] block">₹0 Fee</strong>
                <span>100% Free Forever</span>
              </div>
              <div>
                <strong className="text-[#0B1A17] block">Zero Custody</strong>
                <span>Direct Bank Transfer</span>
              </div>
              <div>
                <strong className="text-[#0B1A17] block">No Signup</strong>
                <span>Friends Just Pay</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FEATURE SHOWCASE (Animations 2 to 6)
      ====================================================================== */}
      <section className="space-y-16 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#0B7A66] uppercase tracking-wider">
            Engineered for India & UPI
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0B1A17] tracking-tight">
            Everything Splitwise charges for — free forever.
          </h2>
          <p className="text-sm text-[#5A6B66] max-w-xl mx-auto">
            No daily expense caps, no forced subscriptions, and zero app install barriers for your friends.
          </p>
        </div>

        {/* Feature 1: Receipt Scan (split-06-receipt-scan.webp) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-[#E4ECE8] shadow-xs">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F3] text-[#0B7A66] flex items-center justify-center font-bold">
              <UL0Icon name="upload" size={20} />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0B1A17] tracking-tight">
              Instant on-device receipt scan. Zero photo uploads.
            </h3>
            <p className="text-sm text-[#5A6B66] leading-relaxed">
              Snap or upload a restaurant or grocery bill. Our browser-based WASM OCR engine detects line items, quantities, and prices right inside your phone without uploading your photo to any remote server.
            </p>
            <ul className="text-xs text-[#5A6B66] space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Assign items to specific friends with one tap</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Proportional GST & service charge distribution</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Largest-remainder rounding: shares always balance down to the paise</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center bg-[#F7FAF8] p-4 rounded-2xl border border-[#E4ECE8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/split-animations/split-06-receipt-scan.webp"
              alt="Receipt scan animation with items assigned and taxes calculated"
              className="w-full max-w-md object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Feature 2: 1-Tap Pay & Custom QR (split-02-pay-qr.webp) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-[#E4ECE8] shadow-xs">
          <div className="order-2 md:order-1 flex items-center justify-center bg-[#F7FAF8] p-4 rounded-2xl border border-[#E4ECE8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/split-animations/split-02-pay-qr.webp"
              alt="Friend pays via QR scan and confirmed checkmark"
              className="w-full max-w-md object-contain rounded-xl"
            />
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F3] text-[#0B7A66] flex items-center justify-center font-bold">
              <UL0Icon name="qr" size={20} />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0B1A17] tracking-tight">
              Tap to pay. Deep links to GPay, PhonePe, and Paytm.
            </h3>
            <p className="text-sm text-[#5A6B66] leading-relaxed">
              When friends open your settle link, they see their exact share and a 1-tap button that launches their preferred UPI app with amount and recipient prefilled. On laptop or desktop, they scan the scannable UPI QR code.
            </p>
            <ul className="text-xs text-[#5A6B66] space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Opens directly inside installed UPI apps without typing numbers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Masked UPI ID security prevents handle harvesting</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Works on iOS, Android, and Desktop browsers</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 3: Live Status & Verification (split-03-who-paid.webp) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-[#E4ECE8] shadow-xs">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F3] text-[#0B7A66] flex items-center justify-center font-bold">
              <UL0Icon name="check" size={20} />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0B1A17] tracking-tight">
              Live status: Claimed → Confirmed with zero forgery.
            </h3>
            <p className="text-sm text-[#5A6B66] leading-relaxed">
              Unlike competitor apps where anyone with the link can falsely toggle a bill as paid, UL0 uses a two-step claim flow: friends report &quot;I paid&quot; with optional UTR, and only the organizer with the secret token can confirm receipt.
            </p>
            <ul className="text-xs text-[#5A6B66] space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Live progress bar shows ₹ settled vs ₹ pending</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Secret collector token protects against unauthorized status tampering</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Automatic live sync every few seconds</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center bg-[#F7FAF8] p-4 rounded-2xl border border-[#E4ECE8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/split-animations/split-03-who-paid.webp"
              alt="Live payment status tracking from unpaid to claimed to settled"
              className="w-full max-w-md object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Feature 4: Group Hisab & Trip Tabs (split-04-group-settle-up.webp) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-[#E4ECE8] shadow-xs">
          <div className="order-2 md:order-1 flex items-center justify-center bg-[#F7FAF8] p-4 rounded-2xl border border-[#E4ECE8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/split-animations/split-04-group-settle-up.webp"
              alt="Group trip tangled debts collapse into minimal payments"
              className="w-full max-w-md object-contain rounded-xl"
            />
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F3] text-[#0B7A66] flex items-center justify-center font-bold">
              <UL0Icon name="billing" size={20} />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0B1A17] tracking-tight">
              Group Hisab for trips &amp; flatmates. Minimal UPI transfers.
            </h3>
            <p className="text-sm text-[#5A6B66] leading-relaxed">
              Going on a vacation or sharing an apartment? Keep a running hisab where everyone can log cabs, groceries, and hotel expenses. Our greedy net-balance settlement algorithm calculates the fewest possible payments needed to settle the entire trip.
            </p>
            <ul className="text-xs text-[#5A6B66] space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Collapses 20+ scattered expenses into just 2 or 3 UPI payments</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Custom hero backdrop banner and group icons</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>1-Click CSV export for accountants and trip records</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 5: WhatsApp Nudges in Hindi & English (split-05-reminders.webp) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-[#E4ECE8] shadow-xs">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F3] text-[#0B7A66] flex items-center justify-center font-bold">
              <UL0Icon name="whatsapp" size={20} />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0B1A17] tracking-tight">
              Smart reminders on WhatsApp. Polite, firm, or funny.
            </h3>
            <p className="text-sm text-[#5A6B66] leading-relaxed">
              No more awkward payment requests. Pick a tone (Polite, Firm, or Funny) and language (English, Hindi, or Hinglish) and click &quot;Share on WhatsApp&quot; to send a pre-filled message with friend name, amount, and settle link.
            </p>
            <ul className="text-xs text-[#5A6B66] space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Pre-filled wa.me links: the app never texts anyone directly without your consent</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Optional pay-by deadlines turn reminders into friendly alerts when overdue</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0B7A66] font-bold">✓</span>
                <span>Culturally tuned Hinglish jokes that keep friendships stress-free</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center bg-[#F7FAF8] p-4 rounded-2xl border border-[#E4ECE8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/split-animations/split-05-reminders.webp"
              alt="Polite, firm, and funny reminder messages on WhatsApp"
              className="w-full max-w-md object-contain rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          COMPETITOR COMPARISON TABLE
      ====================================================================== */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#0B7A66] uppercase tracking-wider">Comparison</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B1A17]">
            Why people switch from Splitwise to UL0
          </h2>
        </div>

        <div className="rounded-3xl border border-[#E4ECE8] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F7FAF8] border-b border-[#E4ECE8] text-[#0B1A17]">
                <tr>
                  <th className="p-4 font-bold">Feature</th>
                  <th className="p-4 font-extrabold text-[#0B7A66] bg-[#EAF7F3]/60">UL0 Split</th>
                  <th className="p-4 font-semibold text-[#5A6B66]">Splitwise</th>
                  <th className="p-4 font-semibold text-[#5A6B66]">GPay / PhonePe Groups</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F3] text-[#5A6B66]">
                <tr>
                  <td className="p-4 font-medium text-[#0B1A17]">Daily Expense Limit</td>
                  <td className="p-4 font-bold text-[#0B7A66] bg-[#EAF7F3]/20">Unlimited (Free)</td>
                  <td className="p-4 text-[#D9383A]">Limited to 3 or 4 expenses/day</td>
                  <td className="p-4 text-[#0B1A17]">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#0B1A17]">Friends App Install</td>
                  <td className="p-4 font-bold text-[#0B7A66] bg-[#EAF7F3]/20">None (Browser link)</td>
                  <td className="p-4 text-[#D9383A]">Must download app</td>
                  <td className="p-4 text-[#D9383A]">Must use same app</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#0B1A17]">Direct UPI Deep Link</td>
                  <td className="p-4 font-bold text-[#0B7A66] bg-[#EAF7F3]/20">Yes (Any UPI app)</td>
                  <td className="p-4">Manual manual transfer</td>
                  <td className="p-4">Locked to ecosystem</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#0B1A17]">Itemized GST &amp; Tax Split</td>
                  <td className="p-4 font-bold text-[#0B7A66] bg-[#EAF7F3]/20">Proportional (Paise exact)</td>
                  <td className="p-4 text-[#D9383A]">Requires Pro ($39.99/yr)</td>
                  <td className="p-4 text-[#D9383A]">Equal only</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[#0B1A17]">On-Device Receipt OCR</td>
                  <td className="p-4 font-bold text-[#0B7A66] bg-[#EAF7F3]/20">100% Free &amp; Private</td>
                  <td className="p-4 text-[#D9383A]">Paid Pro feature</td>
                  <td className="p-4 text-[#D9383A]">Not available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BOTTOM CALL TO ACTION BANNER
      ====================================================================== */}
      <section className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#0B1A17] to-[#0B7A66] text-white p-8 sm:p-14 text-center space-y-6 shadow-xl">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Ready to split without the awkwardness?
        </h2>
        <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto">
          Create your first split in under 15 seconds. Share the link on WhatsApp, and watch payments settle directly into your bank.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            className="w-full sm:w-auto bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-black text-base h-14 px-9 rounded-2xl shadow-lg transition-transform active:translate-y-[1px] cursor-pointer"
          >
            <Link href="/split/dashboard">
              <span>Create your split</span>
              <UL0Icon name="arrowright" size={18} className="ml-2" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 font-bold text-base h-14 px-7 rounded-2xl cursor-pointer"
          >
            <Link href="/hisab">
              <span>Group Hisab</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
