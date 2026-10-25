"use client"

import { useRef, useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  ArrowRight, 
  Download, 
  QrCode, 
  Clock, 
  Users, 
  Receipt, 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar, 
  Wallet, 
  Smartphone, 
  CreditCard,
  Share2,
  CheckCircle2,
  Hourglass,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Sparkles
} from "lucide-react"
import QRCode from "qrcode"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { 
  SiPaypal, 
  SiCashapp, 
  SiRevolut, 
  SiWise, 
  SiPaytm, 
  SiGooglepay 
} from "react-icons/si"
import { FaMoneyBillTransfer } from "react-icons/fa6"
import { BsBank2 } from "react-icons/bs"

// Payment methods configuration
const PAYMENT_METHODS = {
  upi: { name: "UPI", urlPrefix: "upi://pay?pa=" },
  paypal: { name: "PayPal", urlPrefix: "https://paypal.me/" },
  venmo: { name: "Venmo", urlPrefix: "https://venmo.com/" },
  cashapp: { name: "Cash App", urlPrefix: "https://cash.app/" },
  pix: { name: "PIX", urlPrefix: "" },
  wise: { name: "Wise", urlPrefix: "" },
  revolut: { name: "Revolut", urlPrefix: "https://revolut.me/" },
  gcash: { name: "GCash", urlPrefix: "" },
  grabpay: { name: "GrabPay", urlPrefix: "" },
  paytm: { name: "Paytm", urlPrefix: "" },
  other: { name: "Other", urlPrefix: "" },
} as const

type PaymentMethod = keyof typeof PAYMENT_METHODS

const PaymentIcon = ({ method, className = "h-4 w-4" }: { method: PaymentMethod; className?: string }) => {
  switch (method) {
    case 'upi':
      return <SiGooglepay className={className} />
    case 'paypal':
      return <SiPaypal className={className} />
    case 'venmo':
      return <span className={`font-bold text-[#3D95CE] ${className}`}>V</span>
    case 'cashapp':
      return <SiCashapp className={className} />
    case 'pix':
      return <FaMoneyBillTransfer className={className} />
    case 'wise':
      return <SiWise className={className} />
    case 'revolut':
      return <SiRevolut className={className} />
    case 'gcash':
      return <Wallet className={className} />
    case 'grabpay':
      return <Smartphone className={className} />
    case 'paytm':
      return <SiPaytm className={className} />
    case 'other':
      return <BsBank2 className={className} />
    default:
      return <CreditCard className={className} />
  }
}

interface Member {
  id: string
  name: string
  paymentMethod?: PaymentMethod
  paymentId?: string
  upiId?: string
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
}

interface SplitSession {
  id?: string
  $id?: string
  slug: string
  title: string
  created_at: string | null
  expires_at: string | null
  members: Member[]
  expenses: Expense[]
  settlements: Settlement[]
  total_amount: number
}

interface Props {
  session: SplitSession
  slug: string
}

// Avatar color generator for Splitwise look
const AVATAR_BG_COLORS = [
  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
  "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
  "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_BG_COLORS[Math.abs(hash) % AVATAR_BG_COLORS.length]
}

function getInitials(name: string) {
  const parts = name.trim().split(" ")
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function SplitViewClient({ session: initialSession, slug }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [session, setSession] = useState<SplitSession>(initialSession)
  const [settlements, setSettlements] = useState<Settlement[]>(initialSession.settlements || [])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false)
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
  const [activeQrIndex, setActiveQrIndex] = useState<number | null>(null)
  const [updatingIdx, setUpdatingIdx] = useState<number | null>(null)

  const getMemberName = (id: string) => session.members.find(m => m.id === id)?.name || "Unknown"
  const getMember = (id: string) => session.members.find(m => m.id === id)
  const getPaymentId = (member: Member) => member.paymentId || member.upiId || ""
  const getPaymentMethod = (member: Member): PaymentMethod => member.paymentMethod || "upi"

  const expiresAt = session.expires_at ? new Date(session.expires_at) : new Date(Date.now() + 86400000)
  const hoursLeft = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)))
  const minutesLeft = Math.max(0, Math.floor(((expiresAt.getTime() - Date.now()) % (1000 * 60 * 60)) / (1000 * 60)))

  // Calculate Net Balances per Member (Splitwise style)
  const memberBalances = useMemo(() => {
    const balances: Record<string, { totalPaid: number; totalShare: number; net: number }> = {}

    session.members.forEach((m) => {
      balances[m.id] = { totalPaid: 0, totalShare: 0, net: 0 }
    })

    session.expenses.forEach((exp) => {
      if (balances[exp.paidBy]) {
        balances[exp.paidBy].totalPaid += exp.amount
      }

      if (exp.splits && exp.splits.length > 0) {
        exp.splits.forEach((sp) => {
          if (balances[sp.memberId]) {
            balances[sp.memberId].totalShare += sp.amount
          }
        })
      } else {
        // Equal split fallback
        const splitAmount = exp.amount / (session.members.length || 1)
        session.members.forEach((m) => {
          if (balances[m.id]) {
            balances[m.id].totalShare += splitAmount
          }
        })
      }
    })

    Object.keys(balances).forEach((id) => {
      balances[id].net = balances[id].totalPaid - balances[id].totalShare
    })

    return balances
  }, [session.members, session.expenses])

  // Settlement Progress Calculation
  const totalSettlementAmount = useMemo(() => {
    return settlements.reduce((sum, s) => sum + s.amount, 0)
  }, [settlements])

  const settledAmount = useMemo(() => {
    return settlements.reduce((sum, s) => sum + (s.paid ? s.amount : 0), 0)
  }, [settlements])

  const progressPercent = useMemo(() => {
    if (totalSettlementAmount === 0) return 100
    return Math.min(100, Math.round((settledAmount / totalSettlementAmount) * 100))
  }, [settledAmount, totalSettlementAmount])

  const isAllSettled = progressPercent === 100

  // Polling to keep both parties in sync in real-time
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/split/${slug}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.session) {
        setSession(data.session)
        if (data.session.settlements) {
          setSettlements(data.session.settlements)
        }
      }
    } catch {}
  }, [slug])

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        refreshSession()
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [refreshSession])

  // Toggle Settlement Paid status
  const handleTogglePaid = async (index: number) => {
    const current = settlements[index]
    const nextPaid = !current.paid

    // Optimistic update
    const updated = settlements.map((s, i) => (i === index ? { ...s, paid: nextPaid, paid_at: nextPaid ? new Date().toISOString() : null } : s))
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
    } catch {
      // Revert on error
      setSettlements(settlements)
    } finally {
      setUpdatingIdx(null)
    }
  }

  // Payment Link generator
  const getPaymentLink = (member: Member, amount: number): string => {
    const paymentId = getPaymentId(member)
    const method = getPaymentMethod(member)
    const note = encodeURIComponent(`${session.title} - Split`)
    
    switch (method) {
      case 'upi':
        return `upi://pay?pa=${paymentId}&pn=${encodeURIComponent(member.name)}&am=${amount.toFixed(2)}&tn=${note}`
      case 'paypal':
        if (paymentId.includes('@')) return ''
        return `https://paypal.me/${paymentId}/${amount.toFixed(2)}`
      case 'venmo':
        const venmoId = paymentId.startsWith('@') ? paymentId.slice(1) : paymentId
        return `https://venmo.com/${venmoId}?txn=pay&amount=${amount.toFixed(2)}`
      case 'cashapp':
        const cashTag = paymentId.startsWith('$') ? paymentId.slice(1) : paymentId
        return `https://cash.app/$${cashTag}/${amount.toFixed(2)}`
      case 'revolut':
        const revolutId = paymentId.startsWith('@') ? paymentId.slice(1) : paymentId
        return `https://revolut.me/${revolutId}`
      default:
        return ''
    }
  }

  const toggleQR = async (settlement: Settlement, idx: number) => {
    if (activeQrIndex === idx) {
      setActiveQrIndex(null)
      return
    }

    const toMember = session.members.find(m => m.id === settlement.to)
    if (!toMember) return
    const paymentMethod = getPaymentMethod(toMember)
    const paymentId = getPaymentId(toMember)

    if (!qrCodes[idx.toString()]) {
      if (paymentMethod === 'upi' && paymentId) {
        try {
          const params = new URLSearchParams({ upi: paymentId, name: toMember.name || '', amount: settlement.amount.toFixed(2) })
          const resp = await fetch(`/api/upi/qr?${params.toString()}`)
          if (resp.ok) {
            const blob = await resp.blob()
            const url = URL.createObjectURL(blob)
            setQrCodes(prev => ({ ...prev, [idx.toString()]: url }))
            setActiveQrIndex(idx)
            return
          }
        } catch {}
      }

      const paymentLink = getPaymentLink(toMember, settlement.amount)
      if (paymentLink) {
        try {
          const qrDataUrl = await QRCode.toDataURL(paymentLink, { width: 220, margin: 2 })
          setQrCodes(prev => ({ ...prev, [idx.toString()]: qrDataUrl }))
        } catch {}
      }
    }

    setActiveQrIndex(idx)
  }

  const copyPaymentId = async (paymentId: string) => {
    await navigator.clipboard.writeText(paymentId)
    setCopiedId(paymentId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyShareLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://ul0.site/split/${slug}`
    await navigator.clipboard.writeText(url)
    setCopiedShareLink(true)
    setTimeout(() => setCopiedShareLink(false), 2000)
  }

  const downloadPDF = async () => {
    if (!contentRef.current) return
    try {
      const element = contentRef.current
      const canvas = await (html2canvas as Function)(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      })
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pdf = new jsPDF('p', 'mm', 'a4')
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      pdf.save(`${session.title.replace(/\s+/g, "-")}-receipt.pdf`)
    } catch {
      window.print()
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-6 sm:py-10 px-4 selection:bg-emerald-500/20">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
          <a
            href="/split"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Create your own free bill split"
          >
            <span className="font-semibold text-[var(--foreground)] tracking-tight">ul0 split</span>
            <span className="hidden sm:inline-block text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono font-medium">
              Free • No App
            </span>
            <span>·</span>
            <span className="font-mono">{session.members.length} members</span>
          </a>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 font-mono text-[11px] bg-[var(--surface-3)] px-2.5 py-1 rounded-full border border-[var(--border)]">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{hoursLeft}h {minutesLeft}m left</span>
            </div>

            <button
              type="button"
              onClick={copyShareLink}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--surface-3)] hover:bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] transition-colors cursor-pointer"
              title="Copy bill link"
            >
              {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShareLink ? "Copied" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Content Container (PDF printable) */}
        <div ref={contentRef} className="space-y-6">

          {/* 1. Main Bill Header Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Shared Bill
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] mt-2">
                  {session.title}
                </h1>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Created {session.created_at ? new Date(session.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "recently"}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] font-mono text-[var(--muted-foreground)] block uppercase">Total Bill</span>
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                  ₹{session.total_amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Live Settlement Progress Bar (Splitkaro / Splitwise inspired 100% tracker) */}
            <div className="pt-2 border-t border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  {isAllSettled ? (
                    <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      100% Settled Up
                    </span>
                  ) : (
                    <span>
                      ₹{settledAmount.toFixed(0)} of ₹{totalSettlementAmount.toFixed(0)} settled
                    </span>
                  )}
                </div>
                <span className="font-mono font-bold text-xs" style={{ color: isAllSettled ? "#10b981" : "inherit" }}>
                  {progressPercent}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2.5 rounded-full bg-[var(--surface-3)] overflow-hidden p-0.5 border border-[var(--border)]">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progressPercent}%`,
                    background: isAllSettled ? "#10b981" : "linear-gradient(90deg, #1FA087 0%, #10b981 100%)",
                  }}
                />
              </div>

              {isAllSettled && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All payments have been settled between everyone!</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Who Owes Who (Core Settlement Action Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold tracking-tight text-[var(--foreground)] uppercase font-mono text-xs">
                Settlements ({settlements.length})
              </h2>
              <span className="text-[11px] text-[var(--muted-foreground)]">
                Mark as paid once transferred
              </span>
            </div>

            {settlements.length === 0 ? (
              <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] text-center text-xs text-[var(--muted-foreground)]">
                Everyone is completely even! No settlements required.
              </div>
            ) : (
              <div className="space-y-3">
                {settlements.map((settlement, idx) => {
                  const fromMember = getMember(settlement.from)
                  const toMember = getMember(settlement.to)
                  const fromName = fromMember?.name || "Member"
                  const toName = toMember?.name || "Member"
                  const isPaid = Boolean(settlement.paid)
                  const paymentLink = toMember ? getPaymentLink(toMember, settlement.amount) : ""
                  const paymentId = toMember ? getPaymentId(toMember) : ""
                  const paymentMethod = toMember ? getPaymentMethod(toMember) : "upi"
                  const isQrOpen = activeQrIndex === idx

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border transition-all duration-200 p-4 sm:p-5 ${
                        isPaid
                          ? "bg-emerald-500/[0.04] border-emerald-500/30"
                          : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--muted-foreground)]/30"
                      }`}
                    >
                      {/* Top Row: Flow and Amount */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Member Avatars and Arrow */}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border ${getAvatarColor(fromName)}`}>
                            {getInitials(fromName)}
                          </div>

                          <div className="flex flex-col">
                            <span className="text-xs text-[var(--muted-foreground)] font-mono">owes</span>
                            <span className="text-sm font-bold text-[var(--foreground)]">{fromName}</span>
                          </div>

                          <div className="flex items-center px-1 text-[var(--muted-foreground)] opacity-50">
                            <ArrowRight className="w-4 h-4" />
                          </div>

                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border ${getAvatarColor(toName)}`}>
                            {getInitials(toName)}
                          </div>

                          <div className="flex flex-col">
                            <span className="text-xs text-[var(--muted-foreground)] font-mono">receives</span>
                            <span className="text-sm font-bold text-[var(--foreground)]">{toName}</span>
                          </div>
                        </div>

                        {/* Amount & Status Badge */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-none border-[var(--border)]">
                          <div className="text-right">
                            <span className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] block">
                              ₹{settlement.amount.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-[var(--muted-foreground)] font-mono">
                              {paymentId ? `${PAYMENT_METHODS[paymentMethod]?.name}: ${paymentId}` : "Direct settlement"}
                            </span>
                          </div>

                          <div className="flex-shrink-0">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Paid</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <Hourglass className="w-3.5 h-3.5" />
                                <span>Pending</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="mt-4 pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs">
                        {/* Left: Pay buttons (only if not yet paid) */}
                        <div className="flex flex-wrap items-center gap-2">
                          {!isPaid && paymentLink && (
                            <a
                              href={paymentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-xs cursor-pointer"
                            >
                              <PaymentIcon method={paymentMethod} className="w-3.5 h-3.5" />
                              <span>Pay ₹{settlement.amount.toFixed(0)}</span>
                              <ExternalLink className="w-3 h-3 opacity-70" />
                            </a>
                          )}

                          {!isPaid && (paymentLink || paymentId) && (
                            <button
                              type="button"
                              onClick={() => toggleQR(settlement, idx)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-3)] hover:bg-[var(--surface-2)] text-[var(--foreground)] font-medium transition-colors cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>{isQrOpen ? "Hide QR" : "Show QR"}</span>
                            </button>
                          )}

                          {paymentId && (
                            <button
                              type="button"
                              onClick={() => copyPaymentId(paymentId)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-3)] hover:bg-[var(--surface-2)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                              title="Copy ID"
                            >
                              {copiedId === paymentId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedId === paymentId ? "Copied" : "Copy ID"}</span>
                            </button>
                          )}
                        </div>

                        {/* Right: Mark as Paid toggle */}
                        <button
                          type="button"
                          disabled={updatingIdx === idx}
                          onClick={() => handleTogglePaid(idx)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isPaid
                              ? "border border-[var(--border)] bg-[var(--surface-3)] text-[var(--muted-foreground)] hover:text-rose-500 hover:border-rose-500/30"
                              : "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 shadow-xs"
                          }`}
                        >
                          {updatingIdx === idx ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : isPaid ? (
                            <span>Undo (Mark Pending)</span>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark as Paid</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Expandable QR Code Drawer */}
                      {isQrOpen && qrCodes[idx.toString()] && (
                        <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col items-center justify-center p-4 bg-white rounded-xl">
                          <img
                            src={qrCodes[idx.toString()]}
                            alt="Payment QR"
                            className="w-44 h-44 object-contain"
                          />
                          <p className="text-[11px] text-zinc-600 font-mono mt-2 text-center">
                            Scan with GPay, PhonePe, Paytm or BHIM to pay <strong>₹{settlement.amount.toFixed(2)}</strong> to {toName}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 3. Member Balances (Splitkaro/Splitwise net breakdown) */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold tracking-tight text-[var(--foreground)] uppercase font-mono text-xs px-1">
              Member Breakdown ({session.members.length})
            </h2>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)] overflow-hidden">
              {session.members.map((member) => {
                const bal = memberBalances[member.id] || { totalPaid: 0, totalShare: 0, net: 0 }
                const isPositive = bal.net > 0.01
                const isNegative = bal.net < -0.01

                return (
                  <div key={member.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border ${getAvatarColor(member.name)}`}>
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[var(--foreground)]">{member.name}</div>
                        <div className="text-xs text-[var(--muted-foreground)] font-mono">
                          Paid ₹{bal.totalPaid.toFixed(2)} · Share ₹{bal.totalShare.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {isPositive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <ArrowDownLeft className="w-3 h-3" />
                          <span>Gets +₹{bal.net.toFixed(2)}</span>
                        </span>
                      ) : isNegative ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold font-mono text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Owes -₹{Math.abs(bal.net).toFixed(2)}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-[var(--muted-foreground)] bg-[var(--surface-3)] px-2.5 py-1 rounded-full">
                          Settled
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 4. Itemized Expenses List */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold tracking-tight text-[var(--foreground)] uppercase font-mono text-xs px-1">
              Expenses ({session.expenses.length})
            </h2>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)] overflow-hidden">
              {session.expenses.map((exp) => (
                <div key={exp.id} className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">{exp.title}</div>
                    <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-2 mt-0.5">
                      <span>Paid by {getMemberName(exp.paidBy)}</span>
                      {exp.date && (
                        <>
                          <span>·</span>
                          <span className="font-mono">{new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right font-extrabold text-base text-[var(--foreground)] font-mono">
                    ₹{exp.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Receipt Footer Branding */}
          <div className="py-2 text-center text-xs text-[var(--muted-foreground)] opacity-60">
            Split calculated and verified via ul0.site
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button
            type="button"
            onClick={downloadPDF}
            className="w-full sm:w-1/2 h-11 rounded-xl gap-2 font-semibold bg-[var(--surface-3)] hover:bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Receipt</span>
          </Button>

          <Button
            type="button"
            asChild
            className="w-full sm:w-1/2 h-11 rounded-xl gap-2 font-semibold bg-[var(--primary)] text-white hover:opacity-90 cursor-pointer"
          >
            <a href="/split">
              <span>Create New Split</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Viral Conversion Box — Turn every shared bill into new users */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Online Bill Splitter • No App Needed</span>
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              Tired of Splitwise wait timers & daily limits?
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] max-w-md">
              Split dinners, trips, and flat expenses with friends instantly on the web. Zero signup, instant UPI QR codes, 100% free.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Button
              asChild
              className="w-full sm:w-auto h-9 px-4 rounded-xl text-xs font-semibold bg-primary text-white hover:opacity-90 cursor-pointer"
            >
              <a href="/split">
                <span>Try UL0 Split Free</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
