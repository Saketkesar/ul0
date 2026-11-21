"use client"

import { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { UL0Icon } from "@/components/ul0-icon"
import QRCode from "qrcode"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si"

interface Member {
  id: string
  name: string
  paymentMethod?: string
  paymentId?: string
  upiId?: string
  currency?: string
}

interface Expense {
  id: string
  title: string
  amount: number
  paidBy: string
  date?: string
  splitType: "equal" | "custom"
  splits: { memberId: string; amount: number }[]
}

interface Settlement {
  from: string
  to: string
  amount: number
  paid?: boolean
  paid_at?: string | null
  verified?: boolean
  verified_at?: string | null
}

interface SplitSession {
  id?: string
  $id?: string
  slug: string
  title: string
  created_at: string | null
  expires_at: string | null
  total_amount: number
  currency?: string
  members: Member[]
  expenses: Expense[]
  settlements?: Settlement[]
}

interface SplitViewClientProps {
  session: SplitSession
  slug: string
}

export function SplitViewClient({ session: initialSession, slug }: SplitViewClientProps) {
  const [session, setSession] = useState<SplitSession>(initialSession)
  const [settlements, setSettlements] = useState<Settlement[]>(initialSession.settlements || [])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedShareLink, setCopiedShareLink] = useState(false)
  const [updatingIdx, setUpdatingIdx] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Bharpai Settle Drawer / Modal state
  const [activeSettlementIdx, setActiveSettlementIdx] = useState<number | null>(null)
  const [activeUpiQrData, setActiveUpiQrData] = useState<string | null>(null)
  const [isGeneratingQr, setIsGeneratingQr] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  // Find collector (first member or whoever is in settlements[0]?.to)
  const collector = useMemo(() => {
    if (settlements.length > 0) {
      const collectorId = settlements[0].to
      const found = session.members.find(m => m.id === collectorId)
      if (found) return found
    }
    return session.members[0]
  }, [session.members, settlements])

  const collectorUpi = collector?.paymentId || collector?.upiId || ""

  // Member lookup helpers
  const getMember = useCallback(
    (id: string): Member | undefined => session.members.find((m) => m.id === id),
    [session.members]
  )

  const getMemberName = useCallback(
    (id: string): string => getMember(id)?.name || "Member",
    [getMember]
  )

  const formatAmount = useCallback((num: number) => {
    return `₹${num.toFixed(2)}`
  }, [])

  // Progress metrics
  const totalSettlementAmount = useMemo(
    () => settlements.reduce((sum, s) => sum + s.amount, 0),
    [settlements]
  )

  const settledAmount = useMemo(
    () => settlements.filter((s) => s.paid || s.verified).reduce((sum, s) => sum + s.amount, 0),
    [settlements]
  )

  const progressPercent = totalSettlementAmount > 0
    ? Math.round((settledAmount / totalSettlementAmount) * 100)
    : 100

  const isAllSettled = settlements.length > 0 && settlements.every((s) => s.verified || s.paid)

  // Sync data from server
  const refreshSession = useCallback(async () => {
    try {
      setIsRefreshing(true)
      const res = await fetch(`/api/split/${slug}`)
      if (res.ok) {
        const data = await res.json()
        if (data.session) {
          setSession(data.session)
          if (data.session.settlements) {
            setSettlements(data.session.settlements)
          }
        }
      }
    } catch {
    } finally {
      setIsRefreshing(false)
    }
  }, [slug])

  // Periodic polling for live group sync every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshSession()
    }, 10000)
    return () => clearInterval(interval)
  }, [refreshSession])

  // Generate UPI deep link URI
  const getUpiUri = useCallback((amount: number, fromName: string) => {
    if (!collectorUpi) return ""
    const note = encodeURIComponent(`${session.title} - ${fromName}`)
    const name = encodeURIComponent(collector?.name || "Collector")
    return `upi://pay?pa=${collectorUpi}&pn=${name}&am=${amount.toFixed(2)}&tn=${note}&cu=INR`
  }, [collectorUpi, collector?.name, session.title])

  // Open Settle Drawer for a specific friend
  const openSettleModal = async (idx: number) => {
    const settlement = settlements[idx]
    if (!settlement) return

    setActiveSettlementIdx(idx)
    setIsGeneratingQr(true)

    const fromMember = getMember(settlement.from)
    const upiUri = getUpiUri(settlement.amount, fromMember?.name || "Friend")

    try {
      if (upiUri) {
        const qr = await QRCode.toDataURL(upiUri, {
          width: 300,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" }
        })
        setActiveUpiQrData(qr)
      } else {
        setActiveUpiQrData(null)
      }
    } catch {
      setActiveUpiQrData(null)
    } finally {
      setIsGeneratingQr(false)
    }
  }

  // Handle "I Have Paid" (Friend action)
  const handleMarkAsPaid = async (index: number) => {
    const current = settlements[index]
    const nextPaid = true

    // Optimistic update
    const updated = settlements.map((s, i) =>
      i === index ? { ...s, paid: nextPaid, paid_at: new Date().toISOString() } : s
    )
    setSettlements(updated)
    setUpdatingIdx(index)

    try {
      const res = await fetch(`/api/split/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settlementIndex: index, paid: nextPaid }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      const data = await res.json()
      if (data.session?.settlements) {
        setSettlements(data.session.settlements)
      }
      toast.success("Payment marked! The collector will verify.")
      setActiveSettlementIdx(null)
    } catch {
      setSettlements(settlements)
      toast.error("Could not record payment. Please try again.")
    } finally {
      setUpdatingIdx(null)
    }
  }

  // Handle "Verify in Bank" (Collector action)
  const handleVerifyPayment = async (index: number) => {
    const current = settlements[index]
    const nextVerified = !current.verified

    const updated = settlements.map((s, i) =>
      i === index
        ? {
            ...s,
            paid: nextVerified ? true : s.paid,
            verified: nextVerified,
            verified_at: nextVerified ? new Date().toISOString() : null,
          }
        : s
    )
    setSettlements(updated)
    setUpdatingIdx(index)

    try {
      const res = await fetch(`/api/split/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settlementIndex: index,
          paid: nextVerified ? true : current.paid,
          verified: nextVerified,
        }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      const data = await res.json()
      if (data.session?.settlements) {
        setSettlements(data.session.settlements)
      }
      toast.success(nextVerified ? "Payment confirmed in bank!" : "Payment unverified.")
    } catch {
      setSettlements(settlements)
      toast.error("Failed to verify settlement.")
    } finally {
      setUpdatingIdx(null)
    }
  }

  // Copy UPI ID helper
  const copyPaymentId = async (id: string) => {
    await navigator.clipboard.writeText(id)
    setCopiedId(id)
    toast.success("UPI ID copied!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Copy Share Link helper
  const copyShareLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://ul0.site/split/${slug}`
    await navigator.clipboard.writeText(url)
    setCopiedShareLink(true)
    toast.success("Split link copied!")
    setTimeout(() => setCopiedShareLink(false), 2000)
  }

  // WhatsApp Nudge for unpaid friend
  const sendWhatsAppNudge = (settlement: Settlement) => {
    const fromMember = getMember(settlement.from)
    const name = fromMember?.name || "Friend"
    const url = typeof window !== "undefined" ? window.location.href : `https://ul0.site/split/${slug}`
    const text = encodeURIComponent(
      `Hey ${name}! Gentle nudge for *${session.title}* (₹${settlement.amount.toFixed(2)}).\n\nTap your name to pay directly via UPI:\n${url}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank")
  }

  // Download PDF Receipt
  const downloadPDF = async () => {
    if (!contentRef.current) return
    try {
      const element = contentRef.current
      const canvas = await (html2canvas as Function)(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0a0a0a",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })
      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF("p", "mm", "a4")
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      pdf.save(`${session.title.replace(/\s+/g, "-")}-receipt.pdf`)
      toast.success("PDF receipt downloaded!")
    } catch {
      window.print()
    }
  }

  const activeSettlement = activeSettlementIdx !== null ? settlements[activeSettlementIdx] : null
  const activeFromMember = activeSettlement ? getMember(activeSettlement.from) : null
  const activeUpiUri = activeSettlement && activeFromMember ? getUpiUri(activeSettlement.amount, activeFromMember.name) : ""

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/split"
              className="text-sm font-bold tracking-tight text-white hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <UL0Icon name="splitbill" size={18} />
              <span>UL0 Split</span>
            </a>
            <span className="text-neutral-600 text-xs">/</span>
            <span className="text-xs font-mono text-neutral-400 truncate max-w-[140px] sm:max-w-[200px]">
              {session.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshSession}
              disabled={isRefreshing}
              className="p-1.5 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh settlements"
            >
              <UL0Icon name="refresh" size={14} className={isRefreshing ? "animate-spin" : ""} />
            </button>

            <button
              type="button"
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              {copiedShareLink ? (
                <>
                  <UL0Icon name="check" size={14} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <UL0Icon name="share" size={14} />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Settle Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        <div ref={contentRef} className="space-y-6">
          {/* Authentic Paper Receipt Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Header / Receipt details */}
            <div className="border-b border-dashed border-neutral-700 pb-5 mb-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono uppercase tracking-wider">UL0 UPI RECEIPT</span>
                <span className="font-mono">
                  {session.created_at
                    ? new Date(session.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : new Date().toLocaleDateString("en-IN")}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {session.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="text-neutral-300">
                  Paid by <span className="text-amber-400 font-semibold">{collector?.name || "Collector"}</span>
                  {collectorUpi && (
                    <span className="font-mono text-neutral-500 ml-1.5">({collectorUpi})</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-400 mr-2">Total:</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {formatAmount(session.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Settlement Progress */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium">
                  {isAllSettled
                    ? "🎉 All friends have settled!"
                    : `${formatAmount(settledAmount)} of ${formatAmount(totalSettlementAmount)} collected`}
                </span>
                <span className="font-mono text-xs font-semibold text-amber-400">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Friend Settle Prompt */}
            <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-3 mb-5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <UL0Icon name="mobile" size={16} />
                <span><strong className="text-white">Tap your name below</strong> to pay instantly via UPI</span>
              </div>
              <span className="text-[11px] text-neutral-500 hidden sm:inline">No app install required</span>
            </div>

            {/* Interactive Settle Cards (Bharpai Style) */}
            <div className="space-y-3">
              {settlements.map((settlement, idx) => {
                const fromMember = getMember(settlement.from)
                const fromName = fromMember?.name || "Friend"
                const isVerified = Boolean(settlement.verified)
                const isPaid = Boolean(settlement.paid)

                return (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-all p-4 ${
                      isVerified
                        ? "bg-emerald-950/20 border-emerald-900/40 text-neutral-300"
                        : isPaid
                        ? "bg-amber-950/20 border-amber-900/40 text-neutral-200"
                        : "bg-neutral-950/80 border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-950 cursor-pointer text-white"
                    }`}
                    onClick={() => {
                      if (!isVerified) {
                        openSettleModal(idx)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Friend Info & Status */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                            isVerified
                              ? "bg-emerald-500/20 text-emerald-400"
                              : isPaid
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-neutral-800 text-neutral-300"
                          }`}
                        >
                          {fromName.slice(0, 2).toUpperCase()}
                        </div>

                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            <span>{fromName}</span>
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <UL0Icon name="check" size={12} /> Settled
                              </span>
                            ) : isPaid ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <UL0Icon name="clock" size={12} /> Paid (Pending check)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-normal px-2 py-0.5 rounded-full bg-neutral-800 text-amber-400 border border-neutral-700">
                                Tap to Pay
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                            Owes {collector?.name || "Collector"}
                          </div>
                        </div>
                      </div>

                      {/* Amount & Direct Action */}
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base sm:text-lg text-amber-400">
                          {formatAmount(settlement.amount)}
                        </span>

                        {!isVerified && !isPaid && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              openSettleModal(idx)
                            }}
                            className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Pay</span>
                            <UL0Icon name="arrowright" size={12} />
                          </button>
                        )}

                        {/* WhatsApp Nudge for unpaid */}
                        {!isVerified && !isPaid && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              sendWhatsAppNudge(settlement)
                            }}
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-[#25D366] transition-colors cursor-pointer"
                            title={`Remind ${fromName} on WhatsApp`}
                          >
                            <UL0Icon name="whatsapp" size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Collector Verification Toggle (Optional row) */}
                    {(isPaid || isVerified) && (
                      <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-neutral-400">
                          {isVerified ? "Verified in bank account" : "Friend marked paid. Confirm in bank?"}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVerifyPayment(idx)
                          }}
                          disabled={updatingIdx === idx}
                          className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                            isVerified
                              ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                          }`}
                        >
                          <UL0Icon name="check" size={12} />
                          <span>{isVerified ? "Undo Verified" : "Confirm Received"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Bottom Receipt Security Guarantee */}
            <div className="mt-6 pt-4 border-t border-dashed border-neutral-700 text-center">
              <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
                <UL0Icon name="shield" size={14} />
                <span>Direct bank-to-bank UPI payment. UL0 never holds or touches any funds.</span>
              </p>
            </div>
          </div>

          {/* Expenses Breakdown (If any) */}
          {session.expenses && session.expenses.length > 0 && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <UL0Icon name="billing" size={14} />
                <span>Expense Breakdown</span>
              </h2>
              <div className="divide-y divide-neutral-800/60">
                {session.expenses.map((exp) => (
                  <div key={exp.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-medium text-neutral-200">{exp.title}</div>
                      <div className="text-[11px] text-neutral-500">
                        Paid by {getMemberName(exp.paidBy)}
                        {exp.date && ` · ${exp.date}`}
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-neutral-300">
                      {formatAmount(exp.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={downloadPDF}
            className="w-full sm:w-1/2 border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs h-10 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <UL0Icon name="download" size={14} />
            <span>Download PDF Receipt</span>
          </Button>

          <Button
            type="button"
            onClick={copyShareLink}
            className="w-full sm:w-1/2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs h-10 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <UL0Icon name="share" size={14} />
            <span>{copiedShareLink ? "Link Copied!" : "Share Bill with Friends"}</span>
          </Button>
        </div>

        <div className="text-center pt-2">
          <a
            href="/split"
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
          >
            <UL0Icon name="plus" size={12} />
            <span>Create another bill split</span>
          </a>
        </div>
      </main>

      {/* Bharpai Settle Modal / Drawer */}
      <Dialog
        open={activeSettlementIdx !== null}
        onOpenChange={(open) => !open && setActiveSettlementIdx(null)}
      >
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 max-w-sm sm:max-w-md p-6">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-bold text-white">
              Pay {collector?.name || "Collector"}
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              {session.title} · Exact Share: <strong className="text-amber-400 font-mono text-sm">{activeSettlement ? formatAmount(activeSettlement.amount) : "₹0"}</strong>
            </DialogDescription>
          </DialogHeader>

          {activeSettlement && activeFromMember && (
            <div className="space-y-4">
              {/* 1-Click Mobile UPI Button */}
              {activeUpiUri && (
                <div className="space-y-1.5">
                  <a
                    href={activeUpiUri}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xl transition-transform active:scale-[0.98]"
                  >
                    <UL0Icon name="mobile" size={18} />
                    <span>Pay {formatAmount(activeSettlement.amount)} with UPI</span>
                  </a>
                  <p className="text-[10px] text-neutral-500 text-center">
                    Opens Google Pay, PhonePe, Paytm, or CRED directly on your phone
                  </p>
                </div>
              )}

              {/* Supported Brand Badges */}
              <div className="flex items-center justify-center gap-3 py-1 text-neutral-400 text-xs">
                <span className="flex items-center gap-1 text-[11px]"><SiGooglepay className="w-4 h-4 text-neutral-300" /> GPay</span>
                <span className="flex items-center gap-1 text-[11px]"><SiPhonepe className="w-3.5 h-3.5 text-neutral-300" /> PhonePe</span>
                <span className="flex items-center gap-1 text-[11px]"><SiPaytm className="w-4 h-4 text-neutral-300" /> Paytm</span>
                <span className="text-[11px] font-medium text-neutral-300">CRED</span>
              </div>

              {/* Scannable Dynamic QR Code for Desktop/Laptop */}
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center space-y-2">
                <div className="text-[11px] text-neutral-400">
                  Or scan this QR code with any UPI app / phone camera:
                </div>

                <div className="bg-white p-2.5 rounded-lg inline-block shadow-md">
                  {isGeneratingQr ? (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <UL0Icon name="refresh" size={24} className="animate-spin text-neutral-900" />
                    </div>
                  ) : activeUpiQrData ? (
                    <img
                      src={activeUpiQrData}
                      alt="UPI Payment QR Code"
                      className="w-48 h-48 object-contain rounded"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-neutral-800 text-xs">
                      UPI QR Unavailable
                    </div>
                  )}
                </div>

                {/* Collector UPI Copy */}
                {collectorUpi && (
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="text-xs font-mono text-neutral-400">{collectorUpi}</span>
                    <button
                      type="button"
                      onClick={() => copyPaymentId(collectorUpi)}
                      className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy UPI ID"
                    >
                      {copiedId === collectorUpi ? (
                        <UL0Icon name="check" size={14} />
                      ) : (
                        <UL0Icon name="copy" size={14} />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* "I've Paid" Confirmation Action */}
              <div className="pt-1">
                <Button
                  type="button"
                  onClick={() => activeSettlementIdx !== null && handleMarkAsPaid(activeSettlementIdx)}
                  disabled={updatingIdx === activeSettlementIdx}
                  variant="outline"
                  className="w-full border-neutral-700 bg-neutral-800/80 hover:bg-neutral-700 text-white font-medium py-3 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UL0Icon name="check" size={14} />
                  <span>I've Completed Payment</span>
                </Button>
              </div>

              {/* Reassurance */}
              <p className="text-[10px] text-neutral-500 text-center flex items-center justify-center gap-1">
                <UL0Icon name="shield" size={12} />
                <span>Direct bank-to-bank transfer. No middleman or wallet.</span>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
