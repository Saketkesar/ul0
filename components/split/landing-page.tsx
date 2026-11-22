"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ArrowRight, Shield, Zap, Users, Receipt, ChevronDown, Plus, Minus } from "lucide-react"

export function SplitLandingPage() {
  const router = useRouter()

  // Live mini calculator state
  const [calcTotal, setCalcTotal] = useState<number>(1200)
  const [calcPeople, setCalcPeople] = useState<number>(3)

  const perPersonAmount = calcPeople > 0 ? Math.round((calcTotal / calcPeople) * 100) / 100 : 0

  const handleStartWithCalc = () => {
    router.push(`/split/dashboard?amount=${calcTotal}&people=${calcPeople}`)
  }

  return (
    <div className="w-full bg-[#F6F5F1] text-[#111715] font-sans selection:bg-[#0F7B5F]/20 selection:text-[#0F7B5F]">
      {/* =====================================================================
          1. NAV (64px, flat, no dropdowns)
      ====================================================================== */}
      <nav className="h-16 border-b border-[#E4E2DA] bg-[#F6F5F1] sticky top-0 z-40 px-4 sm:px-8">
        <div className="max-w-[1080px] mx-auto h-full flex items-center justify-between">
          <Link href="/split" className="flex items-center gap-2 font-bold text-base tracking-tight text-[#111715]">
            <span className="w-7 h-7 rounded-[8px] bg-[#0F7B5F] text-white flex items-center justify-center font-bold text-xs">
              U
            </span>
            <span>UL0 Split</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#5F6763]">
            <a href="#how-it-works" className="hover:text-[#111715] transition-colors">How it works</a>
            <a href="#what-friends-see" className="hover:text-[#111715] transition-colors">Friend view</a>
            <a href="#vs-splitwise" className="hover:text-[#111715] transition-colors">vs Splitwise</a>
            <a href="#faq" className="hover:text-[#111715] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/split/dashboard"
              className="text-[14px] font-medium text-[#5F6763] hover:text-[#111715] transition-colors px-2 py-1"
            >
              Log in
            </Link>
            <Link
              href="/split/dashboard"
              className="h-10 px-4 rounded-[10px] bg-[#111715] hover:bg-[#25302C] text-white text-[14px] font-semibold flex items-center justify-center transition-colors shadow-none"
            >
              Open app
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1080px] mx-auto px-4 sm:px-8">
        {/* =====================================================================
            2. HERO (2 columns: left pitch + right live mini calculator)
        ====================================================================== */}
        <section className="py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-[36px] sm:text-[54px] lg:text-[60px] font-bold tracking-[-0.035em] text-[#111715] leading-[1.08]">
              Split the bill. Friends pay by UPI. No app needed.
            </h1>

            <p className="text-[17px] sm:text-[19px] text-[#5F6763] leading-relaxed max-w-xl">
              Create a split in 10 seconds. Friends open the link, tap their name, and pay via any UPI app. Direct bank to bank.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/split/dashboard"
                className="h-11 px-6 rounded-[10px] bg-[#111715] hover:bg-[#25302C] text-white text-[15px] font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Split a bill — free</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </Link>
              <a
                href="#how-it-works"
                className="h-11 px-5 rounded-[10px] border border-[#E4E2DA] bg-white hover:bg-[#FAF9F5] text-[#111715] text-[15px] font-semibold flex items-center justify-center transition-colors"
              >
                See how it works
              </a>
            </div>

            <div className="pt-3 space-y-2 border-t border-[#E4E2DA]">
              <p className="text-[13px] text-[#5F6763]">
                No signup. Money goes bank to bank. UL0 never holds it.
              </p>
              <p className="text-[12px] text-[#5F6763]/90">
                Works with Google Pay, PhonePe, Paytm, CRED, BHIM &amp; any UPI app
              </p>
            </div>
          </div>

          {/* Right Column: Live Mini Calculator */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E4E2DA] rounded-[16px] p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E2DA]">
                <span className="text-[13px] font-semibold text-[#111715] uppercase tracking-wider">
                  Live Calculator
                </span>
                <span className="text-[12px] text-[#0F7B5F] font-semibold bg-[#0F7B5F]/10 px-2.5 py-0.5 rounded-full">
                  Try it now
                </span>
              </div>

              {/* Bill Amount Input */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#5F6763]">Total bill amount</label>
                <div className="flex items-center border border-[#E4E2DA] rounded-[10px] px-3.5 h-11 bg-[#FAF9F5] focus-within:border-[#111715] transition-colors">
                  <span className="text-base font-bold text-[#111715] mr-1.5">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={calcTotal || ""}
                    onChange={(e) => setCalcTotal(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-transparent text-lg font-bold text-[#111715] outline-none"
                    placeholder="1200"
                  />
                </div>
              </div>

              {/* People Stepper */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#5F6763]">Split among how many?</label>
                <div className="flex items-center justify-between border border-[#E4E2DA] rounded-[10px] px-3.5 h-11 bg-white">
                  <span className="text-sm font-semibold text-[#111715]">
                    {calcPeople} {calcPeople === 1 ? "person" : "people"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCalcPeople(Math.max(2, calcPeople - 1))}
                      className="w-7 h-7 rounded-[6px] border border-[#E4E2DA] flex items-center justify-center hover:bg-[#FAF9F5] text-[#111715] cursor-pointer"
                      aria-label="Decrease people"
                    >
                      <Minus className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcPeople(Math.min(12, calcPeople + 1))}
                      className="w-7 h-7 rounded-[6px] border border-[#E4E2DA] flex items-center justify-center hover:bg-[#FAF9F5] text-[#111715] cursor-pointer"
                      aria-label="Increase people"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Per-person Live Rows */}
              <div className="pt-2 space-y-2 border-t border-[#E4E2DA]">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#5F6763]">Each person owes:</span>
                  <span className="text-lg font-bold text-[#0F7B5F]">
                    ₹{perPersonAmount.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {Array.from({ length: Math.min(3, calcPeople) }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between text-[13px] py-1 px-2.5 rounded-[8px] bg-[#FAF9F5]">
                      <span className="text-[#111715] font-medium">
                        {i === 0 ? "You (organizer)" : `Person ${i + 1}`}
                      </span>
                      <span className="font-semibold text-[#111715]">
                        ₹{perPersonAmount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {calcPeople > 3 && (
                    <p className="text-[11px] text-[#5F6763] text-center pt-0.5">
                      + {calcPeople - 3} more people
                    </p>
                  )}
                </div>
              </div>

              {/* Under-calculator CTA */}
              <button
                type="button"
                onClick={handleStartWithCalc}
                className="w-full h-11 rounded-[10px] bg-[#111715] hover:bg-[#25302C] text-white text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Start with this split</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================================
            3. HOW IT WORKS (3 cards)
        ====================================================================== */}
        <section id="how-it-works" className="py-16 sm:py-20 border-t border-[#E4E2DA] space-y-10">
          <div className="space-y-2">
            <span className="text-[13px] font-semibold text-[#0F7B5F] uppercase tracking-wider">
              Simple 3-step flow
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#111715]">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E4E2DA] rounded-[16px] p-6 space-y-3">
              <div className="w-8 h-8 rounded-[8px] bg-[#FAF9F5] border border-[#E4E2DA] flex items-center justify-center font-bold text-sm text-[#111715]">
                1
              </div>
              <h3 className="text-[17px] font-bold text-[#111715]">Enter the bill</h3>
              <p className="text-[14px] text-[#5F6763] leading-relaxed">
                Add total amount, your UPI ID, and friend names. Choose equal split, custom amounts, or item-wise grocery/receipt mode.
              </p>
            </div>

            <div className="bg-white border border-[#E4E2DA] rounded-[16px] p-6 space-y-3">
              <div className="w-8 h-8 rounded-[8px] bg-[#FAF9F5] border border-[#E4E2DA] flex items-center justify-center font-bold text-sm text-[#111715]">
                2
              </div>
              <h3 className="text-[17px] font-bold text-[#111715]">Share one link</h3>
              <p className="text-[14px] text-[#5F6763] leading-relaxed">
                Send the settle link via WhatsApp or let friends scan the QR. Friends don&apos;t install an app or register an account.
              </p>
            </div>

            <div className="bg-white border border-[#E4E2DA] rounded-[16px] p-6 space-y-3">
              <div className="w-8 h-8 rounded-[8px] bg-[#FAF9F5] border border-[#E4E2DA] flex items-center justify-center font-bold text-sm text-[#111715]">
                3
              </div>
              <h3 className="text-[17px] font-bold text-[#111715]">They pay, you see it</h3>
              <p className="text-[14px] text-[#5F6763] leading-relaxed">
                Friends tap their name and pay via GPay, PhonePe, or Paytm. Money transfers directly into your bank. You verify in one tap.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================================
            4. WHAT YOUR FRIENDS SEE (Phone mockup + 3 ticks)
        ====================================================================== */}
        <section id="what-friends-see" className="py-16 sm:py-20 border-t border-[#E4E2DA] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[13px] font-semibold text-[#0F7B5F] uppercase tracking-wider">
              Friend Experience
            </span>
            <h2 className="text-[28px] sm:text-[38px] font-bold tracking-tight text-[#111715] leading-tight">
              What your friends see on their phone
            </h2>
            <p className="text-[16px] text-[#5F6763] leading-relaxed">
              No login walls, no app store downloads, and no sign-up forms. Friends tap the link, find their name, and pay in two taps.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#0F7B5F]/15 text-[#0F7B5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <p className="text-[14px] text-[#111715]">
                  <strong>Zero app download &amp; zero signup:</strong> Friends open the page directly in their browser.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#0F7B5F]/15 text-[#0F7B5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <p className="text-[14px] text-[#111715]">
                  <strong>Works with their existing UPI app:</strong> Pre-filled deep links to Google Pay, PhonePe, Paytm, or CRED.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#0F7B5F]/15 text-[#0F7B5F] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <p className="text-[14px] text-[#111715]">
                  <strong>Exact paise rounding:</strong> Largest-remainder distribution guarantees shares balance down to the exact paise.
                </p>
              </div>
            </div>
          </div>

          {/* Clean Flat Phone Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[320px] rounded-[28px] border-4 border-[#111715] bg-white p-5 shadow-none space-y-4">
              {/* Phone Speaker Notch bar */}
              <div className="w-16 h-1 rounded-full bg-[#E4E2DA] mx-auto mb-2" />

              <div className="space-y-1 text-center pb-2 border-b border-[#E4E2DA]">
                <span className="text-[11px] font-mono text-[#5F6763] uppercase">UL0 Settle Link</span>
                <h4 className="text-[17px] font-bold text-[#111715]">Dinner at Olive</h4>
                <span className="text-[22px] font-bold text-[#0F7B5F] block">₹450.00</span>
                <span className="text-[12px] text-[#5F6763]">Pay to Organizer (via UPI)</span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full h-11 rounded-[10px] bg-[#0F7B5F] text-white font-semibold text-[14px] flex items-center justify-center gap-1.5 shadow-none"
                >
                  <span>Pay ₹450 with UPI</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <p className="text-[11px] text-[#5F6763] text-center">
                  Opens Google Pay, PhonePe, or Paytm
                </p>
              </div>

              <div className="pt-2 border-t border-[#E4E2DA] space-y-2">
                <span className="text-[11px] font-semibold text-[#5F6763] block">Bill Breakdown</span>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#111715]">Pizzas &amp; Pasta</span>
                  <span className="text-[#111715] font-semibold">₹380.00</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#5F6763]">GST (5%) &amp; Service</span>
                  <span className="text-[#111715] font-semibold">₹70.00</span>
                </div>
              </div>

              <div className="pt-1 text-center">
                <span className="text-[10px] text-[#0F7B5F] font-semibold">
                  ✓ Bank to Bank · UL0 holds ₹0
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. WHY NOT SPLITWISE? (Comparison Table)
        ====================================================================== */}
        <section id="vs-splitwise" className="py-16 sm:py-20 border-t border-[#E4E2DA] space-y-8">
          <div className="space-y-2 text-center max-w-xl mx-auto">
            <span className="text-[13px] font-semibold text-[#0F7B5F] uppercase tracking-wider">
              Comparison
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#111715]">
              Why not Splitwise?
            </h2>
            <p className="text-[15px] text-[#5F6763]">
              Splitwise added daily expense caps and a \$39.99/year subscription. UL0 is free and purpose-built for India&apos;s UPI.
            </p>
          </div>

          <div className="bg-white border border-[#E4E2DA] rounded-[16px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-[#FAF9F5] border-b border-[#E4E2DA] text-[#111715]">
                  <tr>
                    <th className="p-4 font-bold">Feature</th>
                    <th className="p-4 font-bold text-[#0F7B5F] bg-[#0F7B5F]/5">UL0 Split</th>
                    <th className="p-4 font-medium text-[#5F6763]">Splitwise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E2DA] text-[#111715]">
                  <tr>
                    <td className="p-4 font-medium">Do friends need an app?</td>
                    <td className="p-4 font-semibold text-[#0F7B5F] bg-[#0F7B5F]/5">No (open web link)</td>
                    <td className="p-4 text-[#5F6763]">Yes (must download)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Do friends need an account?</td>
                    <td className="p-4 font-semibold text-[#0F7B5F] bg-[#0F7B5F]/5">No signup for friends</td>
                    <td className="p-4 text-[#5F6763]">Yes (mandatory signup)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">UPI payment in the flow</td>
                    <td className="p-4 font-semibold text-[#0F7B5F] bg-[#0F7B5F]/5">Yes (1-tap deep link)</td>
                    <td className="p-4 text-[#5F6763]">No (external manual step)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Daily expense cap</td>
                    <td className="p-4 font-semibold text-[#0F7B5F] bg-[#0F7B5F]/5">Unlimited (free)</td>
                    <td className="p-4 text-[#5F6763]">Limited on free plan</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Receipt scanning OCR</td>
                    <td className="p-4 font-semibold text-[#0F7B5F] bg-[#0F7B5F]/5">Free on-device (WASM)</td>
                    <td className="p-4 text-[#5F6763]">Splitwise Pro required</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Price</td>
                    <td className="p-4 font-semibold text-[#0F7B5F] bg-[#0F7B5F]/5">100% Free forever</td>
                    <td className="p-4 text-[#5F6763]">\$39.99/year for Pro</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* =====================================================================
            6. USE CASES (4 small cards)
        ====================================================================== */}
        <section className="py-16 sm:py-20 border-t border-[#E4E2DA] space-y-8">
          <div className="space-y-2">
            <span className="text-[13px] font-semibold text-[#0F7B5F] uppercase tracking-wider">
              Everyday Scenarios
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#111715]">
              Built for how you actually split
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E4E2DA] rounded-[16px] p-5 space-y-2">
              <h3 className="font-bold text-[16px] text-[#111715]">Dinners &amp; Lunches</h3>
              <p className="text-[13px] text-[#5F6763] leading-relaxed">
                One person pays the restaurant bill. Friends tap their share and transfer before leaving the table.
              </p>
            </div>

            <div className="bg-white border border-[#E4E2DA] rounded-[16px] p-5 space-y-2">
              <h3 className="font-bold text-[16px] text-[#111715]">Weekend Trips</h3>
              <p className="text-[13px] text-[#5F6763] leading-relaxed">
                Tangled hotel, cab, and food expenses collapsed into the fewest possible UPI payments.
              </p>
            </div>

            <div className="bg-white border border-[#E4E2DA] rounded-[16px] p-5 space-y-2">
              <h3 className="font-bold text-[16px] text-[#111715]">Flatmates &amp; Rent</h3>
              <p className="text-[13px] text-[#5F6763] leading-relaxed">
                Running tabs for Wi-Fi, maid, cook, and electricity with monthly settle-up links.
              </p>
            </div>

            <div className="bg-white border border-[#E4E2DA] rounded-[16px] p-5 space-y-2">
              <h3 className="font-bold text-[16px] text-[#111715]">Parties &amp; Turf</h3>
              <p className="text-[13px] text-[#5F6763] leading-relaxed">
                Book the cricket turf or buy party supplies. Share a single QR code in the group chat.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================================
            7. FAQ (5 <details> items)
        ====================================================================== */}
        <section id="faq" className="py-16 sm:py-20 border-t border-[#E4E2DA] space-y-8">
          <div className="space-y-2">
            <span className="text-[13px] font-semibold text-[#0F7B5F] uppercase tracking-wider">
              Answers
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-[#111715]">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3 max-w-3xl">
            <details className="group bg-white border border-[#E4E2DA] rounded-[12px] p-4.5 cursor-pointer">
              <summary className="font-semibold text-[15px] text-[#111715] flex items-center justify-between list-none">
                <span>Does UL0 hold or touch any money?</span>
                <ChevronDown className="w-4 h-4 text-[#5F6763] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-[14px] text-[#5F6763] pt-3 leading-relaxed">
                Never. UL0 provides direct NPCI UPI deep links and scannable QR codes. Payments transfer directly from your friend&apos;s bank account into yours. We have zero wallet custody and zero access to your bank balance.
              </p>
            </details>

            <details className="group bg-white border border-[#E4E2DA] rounded-[12px] p-4.5 cursor-pointer">
              <summary className="font-semibold text-[15px] text-[#111715] flex items-center justify-between list-none">
                <span>Do my friends need to install an app or sign up?</span>
                <ChevronDown className="w-4 h-4 text-[#5F6763] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-[14px] text-[#5F6763] pt-3 leading-relaxed">
                No. Friends simply open the shared link in WhatsApp or scan your QR code. They do not need to register, create a password, or download an app.
              </p>
            </details>

            <details className="group bg-white border border-[#E4E2DA] rounded-[12px] p-4.5 cursor-pointer">
              <summary className="font-semibold text-[15px] text-[#111715] flex items-center justify-between list-none">
                <span>Is UL0 Split really 100% free?</span>
                <ChevronDown className="w-4 h-4 text-[#5F6763] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-[14px] text-[#5F6763] pt-3 leading-relaxed">
                Yes, completely free forever. There are zero transaction charges, zero hidden fees, and no monthly limits on how many bills or friends you can split with.
              </p>
            </details>

            <details className="group bg-white border border-[#E4E2DA] rounded-[12px] p-4.5 cursor-pointer">
              <summary className="font-semibold text-[15px] text-[#111715] flex items-center justify-between list-none">
                <span>How does itemized receipt splitting calculate GST and service charge?</span>
                <ChevronDown className="w-4 h-4 text-[#5F6763] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-[14px] text-[#5F6763] pt-3 leading-relaxed">
                Taxes (GST) and service charges are allocated proportionally based on each person&apos;s item subtotal using the largest-remainder method. This guarantees that individual shares sum to the exact paise of the restaurant bill.
              </p>
            </details>

            <details className="group bg-white border border-[#E4E2DA] rounded-[12px] p-4.5 cursor-pointer">
              <summary className="font-semibold text-[15px] text-[#111715] flex items-center justify-between list-none">
                <span>Which UPI apps are supported?</span>
                <ChevronDown className="w-4 h-4 text-[#5F6763] group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-[14px] text-[#5F6763] pt-3 leading-relaxed">
                All Indian UPI apps are supported: Google Pay, PhonePe, Paytm, CRED, BHIM, Amazon Pay, and any bank app with UPI functionality.
              </p>
            </details>
          </div>
        </section>

        {/* =====================================================================
            8. FINAL CTA
        ====================================================================== */}
        <section className="py-16 sm:py-20 border-t border-[#E4E2DA] text-center space-y-5">
          <h2 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-[#111715]">
            Stop chasing people for ₹300.
          </h2>
          <p className="text-[16px] text-[#5F6763] max-w-md mx-auto">
            Create your split in seconds. Friends pay from a link with the UPI app they already use.
          </p>
          <div className="pt-2">
            <Link
              href="/split/dashboard"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-[10px] bg-[#111715] hover:bg-[#25302C] text-white text-[15px] font-semibold transition-colors"
            >
              <span>Split a bill — free</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </Link>
          </div>
        </section>
      </main>

      {/* =====================================================================
          9. FOOTER (Minimal, 5 links max)
      ====================================================================== */}
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
