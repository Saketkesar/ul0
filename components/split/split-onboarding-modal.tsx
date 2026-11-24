"use client"

import React, { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Check, Shield, X, AlertCircle } from "lucide-react"

export interface SplitUserProfile {
  name: string
  upiId: string
  bankName: string
  defaultGst: number
  telegram?: string
  email: string
}

interface SplitOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profile: SplitUserProfile) => void
}

export function detectUpiBank(upiId: string): { bankName: string; provider: string; color: string } | null {
  const trimmed = upiId.trim().toLowerCase()
  if (!trimmed.includes("@")) return null
  const handle = trimmed.slice(trimmed.lastIndexOf("@"))

  // BHIM UPI
  if (handle === "@upi") {
    return { bankName: "BHIM UPI (NPCI)", provider: "bhim", color: "#1B685C" }
  }
  // Google Pay
  if (handle === "@okhdfcbank") return { bankName: "HDFC Bank (Google Pay)", provider: "gpay", color: "#004B87" }
  if (handle === "@okaxis") return { bankName: "Axis Bank (Google Pay)", provider: "gpay", color: "#97144D" }
  if (handle === "@okicici") return { bankName: "ICICI Bank (Google Pay)", provider: "gpay", color: "#F37021" }
  if (handle === "@oksbi") return { bankName: "State Bank of India (Google Pay)", provider: "gpay", color: "#2259A4" }
  // PhonePe
  if (handle === "@ybl") return { bankName: "YES Bank (PhonePe)", provider: "phonepe", color: "#5F259F" }
  if (handle === "@ibl") return { bankName: "ICICI Bank (PhonePe)", provider: "phonepe", color: "#5F259F" }
  if (handle === "@axl") return { bankName: "Axis Bank (PhonePe)", provider: "phonepe", color: "#5F259F" }
  // Paytm
  if (handle === "@paytm") return { bankName: "Paytm Payments Bank", provider: "paytm", color: "#00BAF2" }
  // Amazon Pay
  if (handle === "@apl") return { bankName: "Amazon Pay", provider: "amazon", color: "#FF9900" }
  // Other prominent Indian banks
  if (handle === "@fbl") return { bankName: "Federal Bank", provider: "bank", color: "#002B49" }
  if (handle === "@kotak") return { bankName: "Kotak Mahindra Bank", provider: "bank", color: "#ED1C24" }
  if (handle === "@barodampay") return { bankName: "Bank of Baroda", provider: "bank", color: "#F26522" }
  if (handle === "@indus") return { bankName: "IndusInd Bank", provider: "bank", color: "#8E181B" }
  if (handle === "@pnb") return { bankName: "Punjab National Bank", provider: "bank", color: "#A20A3C" }
  if (handle === "@cnrb") return { bankName: "Canara Bank", provider: "bank", color: "#0085C8" }
  if (handle === "@unionbank") return { bankName: "Union Bank of India", provider: "bank", color: "#D3122A" }
  if (handle === "@idfcbank") return { bankName: "IDFC First Bank", provider: "bank", color: "#990000" }
  if (handle === "@postbank") return { bankName: "India Post Payments Bank", provider: "bank", color: "#ED1C24" }
  if (handle === "@cred") return { bankName: "CRED UPI", provider: "cred", color: "#000000" }

  return { bankName: `${handle.replace("@", "").toUpperCase()} UPI`, provider: "bank", color: "#1B685C" }
}

export function SplitOnboardingModal({ isOpen, onClose, onSave }: SplitOnboardingModalProps) {
  const { user } = useUser()
  const [name, setName] = useState("")
  const [upiId, setUpiId] = useState("")
  const [defaultGst, setDefaultGst] = useState("0")
  const [telegram, setTelegram] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Prefill from Clerk on mount
  useEffect(() => {
    if (user) {
      if (user.fullName || user.firstName) {
        setName(user.fullName || user.firstName || "")
      }
    }
    // Check if previously saved
    try {
      const saved = localStorage.getItem("ul0_split_onboarding_v1")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.name) setName(parsed.name)
        if (parsed.upiId) setUpiId(parsed.upiId)
        if (parsed.defaultGst !== undefined) setDefaultGst(String(parsed.defaultGst))
        if (parsed.telegram) setTelegram(parsed.telegram)
      } else {
        const savedName = localStorage.getItem("ul0_split_collector_name")
        const savedUpi = localStorage.getItem("ul0_split_collector_upi")
        if (savedName) setName(savedName)
        if (savedUpi) setUpiId(savedUpi)
      }
    } catch {}
  }, [user, isOpen])

  if (!isOpen) return null

  const userEmail = user?.primaryEmailAddress?.emailAddress || ""
  const bankInfo = detectUpiBank(upiId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cleanName = name.trim()
    const cleanUpi = upiId.trim()
    if (!cleanName) {
      setError("Please enter your name.")
      return
    }
    if (!cleanUpi || !cleanUpi.includes("@")) {
      setError("Please enter a valid UPI ID (e.g. mobile@upi or name@okhdfcbank).")
      return
    }

    setIsSubmitting(true)
    const profile: SplitUserProfile = {
      name: cleanName,
      upiId: cleanUpi,
      bankName: bankInfo?.bankName || "UPI Account",
      defaultGst: parseFloat(defaultGst) || 0,
      telegram: telegram.trim() || undefined,
      email: userEmail,
    }

    try {
      // Save locally
      localStorage.setItem("ul0_split_onboarding_v1", JSON.stringify(profile))
      localStorage.setItem("ul0_split_collector_name", profile.name)
      localStorage.setItem("ul0_split_collector_upi", profile.upiId)
      if (profile.telegram) localStorage.setItem("ul0_split_collector_telegram", profile.telegram)
      if (profile.email) localStorage.setItem("ul0_split_collector_email", profile.email)

      // Trigger welcome / confirmation email in background
      fetch("/api/notify/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      }).catch(() => {})

      onSave(profile)
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to save profile.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-[540px] max-h-[92vh] overflow-y-auto rounded-[28px] bg-white text-[#0B1A17] border border-[#D3E2DD] shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E4E2DA]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B685C]" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1A17]">
                Quick Split Setup
              </h2>
            </div>
            <p className="text-xs text-[#5E726C] mt-1">
              One-time setup. Direct bank-to-bank UPI · Zero fees.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4FAF8] hover:bg-[#EAF7F3] border border-[#D3E2DD] flex items-center justify-center cursor-pointer text-[#0B1A17]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* 1. Name */}
          <div>
            <label className="block text-xs font-bold text-[#0B1A17] uppercase tracking-wider mb-1.5">
              Your Name / Nickname
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Saket, Rahul, Priya"
              className="w-full h-12 px-4 rounded-xl border border-[#D3E2DD] bg-[#F4FAF8] text-sm text-[#0B1A17] font-medium focus:outline-none focus:border-[#1B685C] focus:bg-white transition-all"
            />
          </div>

          {/* 2. UPI ID with Live Bank Detection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#0B1A17] uppercase tracking-wider">
                UPI ID (Where friends send you money)
              </label>
              {bankInfo && (
                <span className="text-[11px] font-bold font-mono text-[#1B685C] bg-[#DDF5EE] px-2 py-0.5 rounded-md border border-[#3DDBB8]/40 animate-in fade-in duration-150">
                  ✓ {bankInfo.bankName}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                placeholder="mobile@upi or yourname@okhdfcbank"
                className="w-full h-12 px-4 pr-12 rounded-xl border border-[#D3E2DD] bg-[#F4FAF8] font-mono text-sm text-[#0B1A17] focus:outline-none focus:border-[#1B685C] focus:bg-white transition-all"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                {bankInfo ? (
                  <span className="w-3 h-3 rounded-full bg-[#1B685C]" />
                ) : (
                  <span className="text-xs text-muted-foreground font-mono">@upi</span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-[#5E726C] mt-1.5">
              Supports Google Pay, PhonePe, Paytm, BHIM, CRED, and all Indian banks.
            </p>
          </div>

          {/* 3. Default GST (Preset to 0 as instructed) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0B1A17] uppercase tracking-wider mb-1.5">
                Default GST %
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="28"
                  step="0.5"
                  value={defaultGst}
                  onChange={(e) => setDefaultGst(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-[#D3E2DD] bg-[#F4FAF8] font-mono text-sm text-[#0B1A17] focus:outline-none focus:border-[#1B685C] focus:bg-white transition-all"
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-xs font-bold text-muted-foreground">%</span>
              </div>
            </div>

            {/* 4. Telegram alerts (Optional) */}
            <div>
              <label className="block text-xs font-bold text-[#0B1A17] uppercase tracking-wider mb-1.5">
                Telegram No. / Handle
              </label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username or phone"
                className="w-full h-12 px-4 rounded-xl border border-[#D3E2DD] bg-[#F4FAF8] font-mono text-sm text-[#0B1A17] focus:outline-none focus:border-[#1B685C] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* 5. Email ID (Fetched from Clerk) */}
          <div>
            <label className="block text-xs font-bold text-[#0B1A17] uppercase tracking-wider mb-1.5">
              Account Email
            </label>
            <div className="flex items-center justify-between h-12 px-4 rounded-xl border border-[#D3E2DD] bg-[#EAF2EE] text-sm text-[#0B1A17] font-mono">
              <span className="truncate">{userEmail || "Signed in with Clerk"}</span>
              <span className="text-[10px] uppercase font-bold text-[#1B685C] bg-white px-2 py-0.5 rounded border border-[#1B685C]/20 shrink-0 ml-2">
                Verified
              </span>
            </div>
          </div>

          {/* Security Banner */}
          <div className="p-3 rounded-xl bg-[#F4FAF8] border border-[#D3E2DD] flex items-center gap-2.5 text-xs text-[#5E726C]">
            <Shield className="w-4 h-4 text-[#1B685C] shrink-0" />
            <span>UL0 never holds your money. Settlements transfer bank-to-bank directly to your UPI.</span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              <span>{isSubmitting ? "Saving Profile..." : "Complete Setup & Continue →"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
