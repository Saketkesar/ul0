"use client"

import { SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si"

export function PublicLanding() {
  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDF5EE] border border-[#3DDBB8]/40 text-[#0B7A66] text-xs font-medium">
          <UL0Icon name="shield" size={14} />
          <span>Zero app install · Pure bank-to-bank UPI</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0B1A17] leading-tight">
          Split bills over UPI. <br />
          <span className="text-[#0B7A66]">Friends install nothing.</span>
        </h1>

        <p className="text-[#5A6B66] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          The person who paid creates the split. Friends open the link, tap their name, and pay their exact share from Google Pay, PhonePe, or Paytm. Direct bank-to-bank.
        </p>

        {/* Primary CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <SignInButton mode="modal">
            <Button className="w-full sm:w-auto bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-bold text-base h-14 px-8 rounded-[18px] shadow-sm transition-transform active:translate-y-[1px] cursor-pointer">
              <span>Sign in to create a split</span>
              <UL0Icon name="arrowright" size={16} className="ml-1.5" />
            </Button>
          </SignInButton>
        </div>

        {/* Trust Row */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#5A6B66]">
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#EAF1EE]/50">
            <UL0Icon name="check" size={14} />
            <span>100% Free</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#EAF1EE]/50">
            <UL0Icon name="team" size={14} />
            <span>No signup for friends</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#EAF1EE]/50">
            <UL0Icon name="bolt" size={14} />
            <span>Direct bank-to-bank</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#EAF1EE]/50">
            <UL0Icon name="shield" size={14} />
            <span>Zero platform custody</span>
          </div>
        </div>

        {/* Supported UPI Badges */}
        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-[#5A6B66]">
          <span className="flex items-center gap-1"><SiGooglepay className="w-5 h-5 text-[#0B1A17]" /> Google Pay</span>
          <span className="flex items-center gap-1"><SiPhonepe className="w-4 h-4 text-[#0B1A17]" /> PhonePe</span>
          <span className="flex items-center gap-1"><SiPaytm className="w-5 h-5 text-[#0B1A17]" /> Paytm</span>
          <span className="font-semibold text-[#0B1A17]">CRED & BHIM</span>
        </div>
      </div>

      {/* Dimmed Wizard Preview */}
      <div className="relative max-w-xl mx-auto rounded-2xl border border-[#E4ECE8] bg-white p-6 shadow-[0_1px_2px_rgba(10,30,26,0.06)] overflow-hidden">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#DDF5EE] flex items-center justify-center text-[#0B7A66] mb-3">
            <UL0Icon name="splitbill" size={24} />
          </div>
          <h3 className="text-lg font-bold text-[#0B1A17] mb-1">
            Ready to split your bill?
          </h3>
          <p className="text-xs text-[#5A6B66] max-w-xs mb-4">
            Sign in once to save your UPI ID, create unlimited splits, and verify settlements.
          </p>
          <SignInButton mode="modal">
            <Button className="bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-semibold text-sm h-11 px-6 rounded-[16px] shadow-sm cursor-pointer">
              Sign in with Google
            </Button>
          </SignInButton>
        </div>

        {/* Mock Wizard Background */}
        <div className="space-y-4 opacity-40 pointer-events-none select-none">
          <div>
            <div className="text-xs font-semibold text-[#5A6B66] mb-1">1. Bill Amount</div>
            <div className="h-14 rounded-xl border border-[#E4ECE8] bg-[#F7FAF8] flex items-center px-4 font-mono text-2xl font-bold text-[#0B1A17]">
              ₹ 2,400.00
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#5A6B66] mb-1">2. People</div>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 rounded-full bg-[#EAF1EE] text-xs font-medium">You (Collector)</span>
              <span className="px-3 py-1.5 rounded-full bg-[#EAF1EE] text-xs">Rahul</span>
              <span className="px-3 py-1.5 rounded-full bg-[#EAF1EE] text-xs">Priya</span>
              <span className="px-3 py-1.5 rounded-full bg-[#EAF1EE] text-xs">Ankit</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#5A6B66] mb-1">3. Split Mode</div>
            <div className="h-10 rounded-lg bg-[#EAF1EE] grid grid-cols-3 p-1 text-xs text-center font-medium">
              <span className="bg-white rounded py-1 shadow-sm">Equal</span>
              <span className="py-1">Items</span>
              <span className="py-1">Custom</span>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works (3 Steps) */}
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#0B1A17]">
            How it works in 3 clean steps
          </h2>
          <p className="text-sm text-[#5A6B66] mt-1">
            Built for speed and simplicity. No apps to install or accounts for your friends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-[#E4ECE8] bg-white space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#EAF1EE] flex items-center justify-center font-bold text-sm text-[#0B7A66]">
              1
            </div>
            <h3 className="font-bold text-base text-[#0B1A17]">Create in 10 seconds</h3>
            <p className="text-xs text-[#5A6B66] leading-relaxed">
              Enter total amount, your UPI ID, and friend names. Choose equal or itemized receipt split.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#E4ECE8] bg-white space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#EAF1EE] flex items-center justify-center font-bold text-sm text-[#0B7A66]">
              2
            </div>
            <h3 className="font-bold text-base text-[#0B1A17]">Share on WhatsApp</h3>
            <p className="text-xs text-[#5A6B66] leading-relaxed">
              Send the split link. Friends open the page, tap their name, and see their exact owed share.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#E4ECE8] bg-white space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#EAF1EE] flex items-center justify-center font-bold text-sm text-[#0B7A66]">
              3
            </div>
            <h3 className="font-bold text-base text-[#0B1A17]">Pay straight via UPI</h3>
            <p className="text-xs text-[#5A6B66] leading-relaxed">
              Friends pay directly through GPay, PhonePe, or Paytm. Money transfers straight to your bank account.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#0B1A17]">
            How UL0 compares
          </h2>
          <p className="text-xs text-[#5A6B66] mt-1">
            Source: Independent feature audit (November 2026)
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4ECE8] bg-white overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7FAF8] border-b border-[#E4ECE8] text-[#5A6B66]">
                  <th className="p-3.5 font-semibold">Feature</th>
                  <th className="p-3.5 font-bold text-[#0B7A66] bg-[#DDF5EE]/50">UL0 Split</th>
                  <th className="p-3.5 font-semibold">WhatsApp Chat</th>
                  <th className="p-3.5 font-semibold">Notebook / Paper</th>
                  <th className="p-3.5 font-semibold">Splitwise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4ECE8] text-[#0B1A17]">
                <tr>
                  <td className="p-3.5 font-medium">Friend app download</td>
                  <td className="p-3.5 font-bold text-[#0B7A66] bg-[#DDF5EE]/20">Never</td>
                  <td className="p-3.5 text-[#5A6B66]">Already installed</td>
                  <td className="p-3.5 text-[#5A6B66]">None</td>
                  <td className="p-3.5 text-[#B3261E]">Required for full features</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">Friend signup / account</td>
                  <td className="p-3.5 font-bold text-[#0B7A66] bg-[#DDF5EE]/20">Zero</td>
                  <td className="p-3.5 text-[#5A6B66]">Phone number</td>
                  <td className="p-3.5 text-[#5A6B66]">None</td>
                  <td className="p-3.5 text-[#B3261E]">Mandatory</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">1-Click UPI deep linking</td>
                  <td className="p-3.5 font-bold text-[#0B7A66] bg-[#DDF5EE]/20">GPay, PhonePe, Paytm</td>
                  <td className="p-3.5 text-[#B3261E]">Manual typing</td>
                  <td className="p-3.5 text-[#B3261E]">None</td>
                  <td className="p-3.5 text-[#5A6B66]">Limited</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">Fair GST / service charge split</td>
                  <td className="p-3.5 font-bold text-[#0B7A66] bg-[#DDF5EE]/20">Proportional</td>
                  <td className="p-3.5 text-[#B3261E]">Manual math</td>
                  <td className="p-3.5 text-[#B3261E]">Manual math</td>
                  <td className="p-3.5 text-[#5A6B66]">Requires Pro</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium">Cost / daily limits</td>
                  <td className="p-3.5 font-bold text-[#0B7A66] bg-[#DDF5EE]/20">100% Free, no limits</td>
                  <td className="p-3.5 text-[#5A6B66]">Free</td>
                  <td className="p-3.5 text-[#5A6B66]">Free</td>
                  <td className="p-3.5 text-[#B3261E]">Daily expense caps unless paid</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5-Question FAQ */}
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-extrabold text-[#0B1A17] text-center">
          Frequently asked questions
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-[#E4ECE8] bg-white space-y-1">
            <h4 className="font-bold text-sm text-[#0B1A17]">1. Is UL0 Split free to use?</h4>
            <p className="text-xs text-[#5A6B66] leading-relaxed">
              Yes, 100% free forever. There are no transaction fees, daily expense limits, or subscription paywalls.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#E4ECE8] bg-white space-y-1">
            <h4 className="font-bold text-sm text-[#0B1A17]">2. Do my friends need to install an app or create an account?</h4>
            <p className="text-xs text-[#5A6B66] leading-relaxed">
              No. Friends simply click the shared link in WhatsApp or scan your QR code. They do not need to sign up, enter their payment details, or download anything.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#E4ECE8] bg-white space-y-1">
            <h4 className="font-bold text-sm text-[#0B1A17]">3. Does UL0 hold or touch any money?</h4>
            <p className="text-xs text-[#5A6B66] leading-relaxed">
              Never. UL0 provides direct NPCI UPI deep links and QR codes. Funds transfer directly from your friend’s bank account into yours. We never custody funds or operate a digital wallet.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#E4ECE8] bg-white space-y-1">
            <h4 className="font-bold text-sm text-[#0B1A17]">4. Which payment apps are supported?</h4>
            <p className="text-xs text-[#5A6B66] leading-relaxed">
              All major UPI applications are supported: Google Pay, PhonePe, Paytm, CRED, BHIM, and any bank UPI app.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[#E4ECE8] bg-white space-y-1">
            <h4 className="font-bold text-sm text-[#0B1A17]">5. How does itemized splitting distribute taxes and tips?</h4>
            <p className="text-xs text-[#5A6B66] leading-relaxed">
              Taxes (GST), service charges, and tips are distributed proportionally according to each friend’s order subtotal using the largest-remainder method, ensuring total shares sum to the exact paise.
            </p>
          </div>
        </div>

        {/* Privacy & Safety Note */}
        <div className="p-4 rounded-xl border border-[#D5E0DB] bg-[#F7FAF8] text-xs text-[#5A6B66] space-y-1">
          <div className="font-bold text-[#0B1A17] flex items-center gap-1.5">
            <UL0Icon name="shield" size={14} />
            <span>Trust & Safety Commitment</span>
          </div>
          <p className="leading-relaxed">
            UL0 only operates at <strong className="text-[#0B1A17]">ul0.site</strong>. We never request your UPI PIN, banking passwords, or OTPs. All settlements are peer-to-peer over the official NPCI UPI network.
          </p>
        </div>
      </div>
    </div>
  )
}
