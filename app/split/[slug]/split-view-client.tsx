"use client"

import { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { UL0Icon } from "@/components/ul0-icon"
import QRCode from "qrcode"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  status: "unpaid" | "claimed" | "partial" | "confirmed"
  paid_amount?: number
  claimed_at?: string | null
  confirmed_at?: string | null
  utr_last4?: string | null
  paid?: boolean
  verified?: boolean
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
  pay_by?: string | null
  locale?: string
  banner_url?: string | null
  icon_url?: string | null
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
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [lang, setLang] = useState<"en" | "hi">((initialSession.locale as any) || "en")

  // PayCard Modal State
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [activeQr, setActiveQr] = useState<string | null>(null)
  const [utrInput, setUtrInput] = useState<string>("")
  const [isClaiming, setIsClaiming] = useState<boolean>(false)

  const contentRef = useRef<HTMLDivElement>(null)

  // Find collector
  const collector = useMemo(() => {
    if (settlements.length > 0) {
      const colId = settlements[0].to
      const found = session.members.find((m) => m.id === colId)
      if (found) return found
    }
    return session.members[0]
  }, [session.members, settlements])

  const collectorName = collector?.name || "Organizer"
  const collectorMaskedUpi = collector?.paymentId || collector?.upiId || ""

  const formatAmount = useCallback((num: number) => `₹${num.toFixed(2)}`, [])

  // Progress metrics
  const totalSettlementAmount = useMemo(
    () => settlements.reduce((sum, s) => sum + s.amount, 0),
    [settlements]
  )

  const settledCount = useMemo(
    () => settlements.filter((s) => s.status === "confirmed" || s.verified).length,
    [settlements]
  )

  const settledAmount = useMemo(
    () =>
      settlements
        .filter((s) => s.status === "confirmed" || s.verified)
        .reduce((sum, s) => sum + s.amount, 0),
    [settlements]
  )

  const progressPercent =
    totalSettlementAmount > 0
      ? Math.round((settledAmount / totalSettlementAmount) * 100)
      : 100

  // Member lookup
  const getMember = useCallback(
    (id: string): Member | undefined => session.members.find((m) => m.id === id),
    [session.members]
  )

  // Refresh session from server
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

  // Periodic polling every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      refreshSession()
    }, 8000)
    return () => clearInterval(timer)
  }, [refreshSession])

  // Open PayCard Drawer
  const openPayCard = async (idx: number) => {
    const s = settlements[idx]
    if (!s) return
    setActiveIdx(idx)
    setUtrInput("")

    const fromMember = getMember(s.from)
    const note = encodeURIComponent(`${session.title} - ${fromMember?.name || "Friend"}`)
    const nameEnc = encodeURIComponent(collectorName)
    const upiUri = `upi://pay?pa=${collectorMaskedUpi}&pn=${nameEnc}&am=${s.amount.toFixed(2)}&tn=${note}&cu=INR`

    try {
      const qr = await QRCode.toDataURL(upiUri, {
        width: 280,
        margin: 2,
        color: { dark: "#0B1A17", light: "#FFFFFF" },
      })
      setActiveQr(qr)
    } catch {
      setActiveQr(null)
    }
  }

  // Claim settlement ("I've Paid")
  const handleClaim = async () => {
    if (activeIdx === null) return
    setIsClaiming(true)

    try {
      const res = await fetch(`/api/split/${slug}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settlementIndex: activeIdx,
          utrLast4: utrInput.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to record payment claim")
      }

      if (data.session?.settlements) {
        setSettlements(data.session.settlements)
      }

      toast.success(
        lang === "hi"
          ? "भुगतान दर्ज हो गया! आयोजक सत्यापन करेंगे।"
          : "Payment claimed! The organizer will confirm in their bank."
      )
      setActiveIdx(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to record payment.")
    } finally {
      setIsClaiming(false)
    }
  }

  const copyShareLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://ul0.site/split/${slug}`
    await navigator.clipboard.writeText(url)
    setCopiedLink(true)
    toast.success("Split link copied!")
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const downloadPDF = async () => {
    if (!contentRef.current) return
    try {
      const element = contentRef.current
      const canvas = await (html2canvas as Function)(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#F7FAF8",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })
      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF("p", "mm", "a4")
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`${session.title.replace(/\s+/g, "-")}-receipt.pdf`)
      toast.success("PDF receipt downloaded!")
    } catch {
      window.print()
    }
  }

  const activeSettlement = activeIdx !== null ? settlements[activeIdx] : null
  const activeFromMember = activeSettlement ? getMember(activeSettlement.from) : null
  const activeUpiUri = activeSettlement
    ? `upi://pay?pa=${collectorMaskedUpi}&pn=${encodeURIComponent(collectorName)}&am=${activeSettlement.amount.toFixed(2)}&tn=${encodeURIComponent(session.title)}&cu=INR`
    : ""

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex flex-col font-sans selection:bg-[#3DDBB8] selection:text-[#04231C]">
      {/* Quiet Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E4ECE8] bg-white/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <a
              href="/split"
              className="text-xs font-bold text-[#0B1A17] hover:text-[#0B7A66] transition-colors flex items-center gap-1.5"
            >
              <UL0Icon name="splitbill" size={16} />
              <span>UL0 Split</span>
            </a>
            <span className="text-[#D5E0DB]">/</span>
            <span className="text-xs font-medium text-[#5A6B66] truncate max-w-[140px] sm:max-w-[200px]">
              {session.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="px-2 py-1 rounded-md border border-[#E4ECE8] bg-[#F7FAF8] text-[11px] font-semibold text-[#0B1A17] hover:bg-[#EAF1EE] cursor-pointer"
            >
              {lang === "en" ? "हिंदी" : "EN"}
            </button>

            {/* Refresh */}
            <button
              type="button"
              onClick={refreshSession}
              disabled={isRefreshing}
              className="p-1.5 rounded-md border border-[#E4ECE8] bg-white text-[#5A6B66] hover:text-[#0B1A17] cursor-pointer"
              title="Refresh settlements"
            >
              <UL0Icon name="refresh" size={14} className={isRefreshing ? "animate-spin" : ""} />
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={copyShareLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#D5E0DB] bg-white hover:bg-[#F7FAF8] text-xs font-semibold text-[#0B1A17] cursor-pointer"
            >
              <UL0Icon name={copiedLink ? "check" : "share"} size={13} />
              <span>{copiedLink ? "Copied" : "Share"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Settle Paper Receipt */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 space-y-6">
        {session.banner_url && (
          <div className="relative w-full h-40 sm:h-52 rounded-2xl overflow-hidden border border-[#E4ECE8] shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={session.banner_url}
              alt={session.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                {session.icon_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={session.icon_url}
                    alt=""
                    className="w-12 h-12 rounded-xl border-2 border-white object-cover shadow-sm bg-white"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl border-2 border-white bg-[#0B7A66] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {session.title.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">
                    {session.title}
                  </h2>
                  <p className="text-[11px] text-white/80 font-medium">Split Bill • Direct UPI</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={contentRef} className="space-y-6">
          {/* Paper Receipt Card */}
          <div className="rounded-2xl border border-[#E4ECE8] bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(10,30,26,0.06)] space-y-5">
            {/* Header info */}
            <div className="border-b border-dashed border-[#E4ECE8] pb-4 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#5A6B66]">
                <span>UL0 UPI SETTLEMENT</span>
                <span>
                  {session.created_at
                    ? new Date(session.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : new Date().toLocaleDateString("en-IN")}
                </span>
              </div>

              <h1 className="text-2xl font-black text-[#0B1A17] tracking-tight">
                {session.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="text-[#5A6B66]">
                  {lang === "hi" ? "भुगतान पाने वाले: " : "Pay to "}
                  <strong className="text-[#0B1A17]">{collectorName}</strong>
                </div>

                <div className="font-mono text-xl font-black text-[#0B7A66]">
                  {formatAmount(session.total_amount)}
                </div>
              </div>

              {/* Pay-by deadline chip if set */}
              {session.pay_by && (
                <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B57C00] bg-[#F7FAF8] border border-[#E4ECE8] px-2 py-0.5 rounded-md mt-1">
                  <UL0Icon name="clock" size={12} />
                  <span>
                    Pay by {new Date(session.pay_by).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              )}
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5A6B66]">
                  {settledCount} of {settlements.length} settled ({formatAmount(settledAmount)} of {formatAmount(totalSettlementAmount)})
                </span>
                <span className="font-mono font-bold text-[#0B7A66]">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EAF1EE] overflow-hidden">
                <div
                  className="h-full bg-[#0B7A66] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Tap your name prompt */}
            <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E4ECE8] flex items-center justify-between text-xs text-[#5A6B66]">
              <div className="flex items-center gap-1.5 font-medium text-[#0B1A17]">
                <UL0Icon name="mobile" size={16} className="text-[#0B7A66]" />
                <span>{lang === "hi" ? "अपना नाम चुनें और UPI से भुगतान करें" : "Tap your name to pay directly via UPI"}</span>
              </div>
              <span className="text-[10px] text-[#5A6B66] hidden sm:inline">No app download</span>
            </div>

            {/* Interactive Friend Rows */}
            <div className="space-y-2.5">
              {settlements.map((settlement, idx) => {
                const fromMember = getMember(settlement.from)
                const fromName = fromMember?.name || "Friend"
                const isConfirmed = settlement.status === "confirmed" || settlement.verified
                const isClaimed = settlement.status === "claimed" || settlement.paid

                return (
                  <div
                    key={idx}
                    onClick={() => !isConfirmed && openPayCard(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isConfirmed
                        ? "bg-[#DDF5EE]/30 border-[#3DDBB8]/40 text-[#5A6B66]"
                        : isClaimed
                        ? "bg-[#F7FAF8] border-[#D5E0DB] text-[#0B1A17]"
                        : "bg-white border-[#E4ECE8] hover:border-[#3DDBB8] text-[#0B1A17] shadow-sm hover:shadow"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          isConfirmed
                            ? "bg-[#DDF5EE] text-[#0B7A66]"
                            : isClaimed
                            ? "bg-[#EAF1EE] text-[#5A6B66]"
                            : "bg-[#EAF1EE] text-[#0B1A17]"
                        }`}
                      >
                        {fromName.slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-[#0B1A17] flex items-center gap-2">
                          <span>{fromName}</span>
                          {isConfirmed ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DDF5EE] text-[#0B7A66] font-semibold border border-[#3DDBB8]/40">
                              Confirmed
                            </span>
                          ) : isClaimed ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF1EE] text-[#5A6B66] font-medium border border-[#D5E0DB]">
                              Waiting confirmation
                            </span>
                          ) : null}
                        </div>
                        <div className="text-[11px] text-[#5A6B66]">
                          Owes {collectorName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-base text-[#0B1A17]">
                        {formatAmount(settlement.amount)}
                      </span>

                      {!isConfirmed && !isClaimed && (
                        <div className="w-7 h-7 rounded-full bg-[#3DDBB8] text-[#04231C] flex items-center justify-center">
                          <UL0Icon name="arrowright" size={13} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Trust and Safety note */}
            <div className="pt-3 border-t border-dashed border-[#E4ECE8] text-center text-[11px] text-[#5A6B66] flex items-center justify-center gap-1.5">
              <UL0Icon name="shield" size={13} className="text-[#0B7A66]" />
              <span>Direct bank transfer via NPCI UPI. UL0 never holds your money.</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={downloadPDF}
            className="flex-1 h-11 border-[#D5E0DB] text-xs font-semibold text-[#0B1A17] rounded-xl cursor-pointer"
          >
            <UL0Icon name="download" size={14} className="mr-1.5" />
            <span>Download Receipt</span>
          </Button>

          <Button
            asChild
            className="flex-1 h-11 bg-[#0B7A66] hover:bg-[#086353] text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            <a href="/split">
              <UL0Icon name="plus" size={14} className="mr-1.5" />
              <span>Split another bill</span>
            </a>
          </Button>
        </div>
      </main>

      {/* PayCard Drawer / Modal */}
      <Dialog open={activeIdx !== null} onOpenChange={(open) => !open && setActiveIdx(null)}>
        <DialogContent className="bg-white border-[#E4ECE8] text-[#0B1A17] max-w-sm sm:max-w-md p-6 rounded-2xl shadow-xl">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-black text-[#0B1A17]">
              Pay {collectorName}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5A6B66]">
              {session.title} · Exact Share:{" "}
              <strong className="text-[#0B7A66] font-mono text-sm">
                {activeSettlement ? formatAmount(activeSettlement.amount) : "₹0"}
              </strong>
            </DialogDescription>
          </DialogHeader>

          {activeSettlement && activeFromMember && (
            <div className="space-y-4">
              {/* Direct UPI Mobile Button */}
              {activeUpiUri && (
                <div className="space-y-1">
                  <a
                    href={activeUpiUri}
                    className="w-full bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-bold h-12 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm transition-transform active:translate-y-[1px]"
                  >
                    <UL0Icon name="mobile" size={16} />
                    <span>Pay {formatAmount(activeSettlement.amount)} with Any UPI App</span>
                  </a>
                  <p className="text-[10px] text-[#5A6B66] text-center">
                    Opens Google Pay, PhonePe, Paytm, or CRED directly on your phone
                  </p>
                </div>
              )}

              {/* Supported App Badges */}
              <div className="flex items-center justify-center gap-4 py-1 text-xs text-[#5A6B66]">
                <span className="flex items-center gap-1"><SiGooglepay className="w-4 h-4 text-[#0B1A17]" /> GPay</span>
                <span className="flex items-center gap-1"><SiPhonepe className="w-3.5 h-3.5 text-[#0B1A17]" /> PhonePe</span>
                <span className="flex items-center gap-1"><SiPaytm className="w-4 h-4 text-[#0B1A17]" /> Paytm</span>
                <span className="font-semibold text-[#0B1A17]">CRED</span>
              </div>

              {/* Scannable QR Code */}
              <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E4ECE8] text-center space-y-2">
                <span className="text-[11px] text-[#5A6B66] block">
                  Or scan with your phone camera or any UPI app:
                </span>

                <div className="bg-white p-2.5 rounded-lg inline-block shadow-sm">
                  {activeQr ? (
                    <img src={activeQr} alt="UPI QR" className="w-44 h-44 object-contain rounded" />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-[#5A6B66]">
                      Generating QR...
                    </div>
                  )}
                </div>

                {/* Masked UPI and Verification Safety Notice */}
                <div className="text-center pt-1 space-y-1">
                  {collectorMaskedUpi && (
                    <span className="text-xs font-mono font-semibold text-[#0B1A17] block">
                      UPI: {collectorMaskedUpi}
                    </span>
                  )}
                  <p className="text-[10px] text-[#5A6B66] leading-tight">
                    Check that the recipient name in your UPI app shows <strong className="text-[#0B1A17]">{collectorName}</strong> before paying.
                  </p>
                </div>
              </div>

              {/* "I've Paid" Claim Button */}
              <div className="space-y-2 pt-1">
                <Input
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="Last 4 digits of UTR / Ref (Optional)"
                  maxLength={4}
                  className="h-9 text-xs text-center font-mono bg-[#F7FAF8] border-[#E4ECE8]"
                />

                <Button
                  type="button"
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="w-full bg-[#0B7A66] hover:bg-[#086353] text-white font-bold h-11 text-xs rounded-xl cursor-pointer"
                >
                  <UL0Icon name="check" size={14} className="mr-1.5" />
                  <span>{isClaiming ? "Recording..." : "I've Completed Payment"}</span>
                </Button>
              </div>

              <p className="text-[10px] text-[#5A6B66] text-center">
                Money transfers direct bank-to-bank. UL0 never holds your money.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
