"use client"

import { useRef, useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Download,
  QrCode,
  Clock,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
  Share2,
  CreditCard,
  Wallet,
  Smartphone,
  Plus,
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
  SiGooglepay,
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
  const [activeQrIndex, setActiveQrIndex] = useState<number | null>(null)
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedShareLink, setCopiedShareLink] = useState(false)
  const [updatingIdx, setUpdatingIdx] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)

  // Resolve appropriate currency symbol
  const currencySymbol = useMemo(() => {
    if (session.currency === "USD") return "$"
    if (session.currency === "INR") return "₹"
    if (session.currency === "EUR") return "€"
    if (session.currency === "GBP") return "£"
    const hasUpi = session.members.some((m) => m.paymentMethod === "upi" || Boolean(m.upiId))
    return hasUpi ? "₹" : "$"
  }, [session])

  const formatAmount = useCallback(
    (num: number) => {
      return `${currencySymbol}${num.toFixed(2)}`
    },
    [currencySymbol]
  )

  // Member lookup helpers
  const getMember = useCallback(
    (id: string): Member | undefined => session.members.find((m) => m.id === id),
    [session.members]
  )

  const getMemberName = useCallback(
    (id: string): string => getMember(id)?.name || "Member",
    [getMember]
  )

  const getPaymentMethod = (member: Member): PaymentMethod => {
    if (member.paymentMethod) return member.paymentMethod
    if (member.upiId) return "upi"
    return "other"
  }

  const getPaymentId = (member: Member): string => {
    return member.paymentId || member.upiId || ""
  }

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  // Calculate Net Balances per member
  const memberBalances = useMemo(() => {
    const balances: Record<string, { totalPaid: number; totalShare: number; net: number }> = {}
    session.members.forEach((m) => {
      balances[m.id] = { totalPaid: 0, totalShare: 0, net: 0 }
    })

    session.expenses.forEach((exp) => {
      if (balances[exp.paidBy]) {
        balances[exp.paidBy].totalPaid += exp.amount
      }
      exp.splits.forEach((split) => {
        if (balances[split.memberId]) {
          balances[split.memberId].totalShare += split.amount
        }
      })
    })

    Object.keys(balances).forEach((id) => {
      balances[id].net = balances[id].totalPaid - balances[id].totalShare
    })

    return balances
  }, [session.members, session.expenses])

  // Progress metrics
  const totalSettlementAmount = useMemo(
    () => settlements.reduce((sum, s) => sum + s.amount, 0),
    [settlements]
  )

  const settledAmount = useMemo(
    () => settlements.filter((s) => s.paid).reduce((sum, s) => sum + s.amount, 0),
    [settlements]
  )

  const progressPercent = totalSettlementAmount > 0
    ? Math.round((settledAmount / totalSettlementAmount) * 100)
    : 100

  const isAllSettled = settlements.length > 0 && settlements.every((s) => s.paid)

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 })

  useEffect(() => {
    if (!session.expires_at) return
    const updateCountdown = () => {
      const now = new Date().getTime()
      const expiry = new Date(session.expires_at!).getTime()
      const diff = Math.max(0, expiry - now)
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      })
    }
    updateCountdown()
    const timer = setInterval(updateCountdown, 60000)
    return () => clearInterval(timer)
  }, [session.expires_at])

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
    } catch {} finally {
      setIsRefreshing(false)
    }
  }, [slug])

  // Periodic polling for live group sync
  useEffect(() => {
    const interval = setInterval(() => {
      refreshSession()
    }, 12000)
    return () => clearInterval(interval)
  }, [refreshSession])

  // Toggle paid status
  const handleTogglePaid = async (index: number) => {
    const current = settlements[index]
    const nextPaid = !current.paid

    // Optimistic update
    const updated = settlements.map((s, i) =>
      i === index ? { ...s, paid: nextPaid, paid_at: nextPaid ? new Date().toISOString() : null } : s
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
    } catch {
      setSettlements(settlements)
    } finally {
      setUpdatingIdx(null)
    }
  }

  // Payment links
  const getPaymentLink = (member: Member, amount: number): string => {
    const paymentId = getPaymentId(member)
    const method = getPaymentMethod(member)
    const note = encodeURIComponent(`${session.title} - Split`)

    switch (method) {
      case "upi":
        return `upi://pay?pa=${paymentId}&pn=${encodeURIComponent(member.name)}&am=${amount.toFixed(2)}&tn=${note}`
      case "paypal":
        if (paymentId.includes("@")) return ""
        return `https://paypal.me/${paymentId}/${amount.toFixed(2)}`
      case "venmo": {
        const venmoId = paymentId.startsWith("@") ? paymentId.slice(1) : paymentId
        return `https://venmo.com/${venmoId}?txn=pay&amount=${amount.toFixed(2)}`
      }
      case "cashapp": {
        const cashTag = paymentId.startsWith("$") ? paymentId.slice(1) : paymentId
        return `https://cash.app/$${cashTag}/${amount.toFixed(2)}`
      }
      case "revolut": {
        const revolutId = paymentId.startsWith("@") ? paymentId.slice(1) : paymentId
        return `https://revolut.me/${revolutId}`
      }
      default:
        return ""
    }
  }

  const toggleQR = async (settlement: Settlement, idx: number) => {
    if (activeQrIndex === idx) {
      setActiveQrIndex(null)
      return
    }

    const toMember = session.members.find((m) => m.id === settlement.to)
    if (!toMember) return
    const paymentMethod = getPaymentMethod(toMember)
    const paymentId = getPaymentId(toMember)

    if (!qrCodes[idx.toString()]) {
      if (paymentMethod === "upi" && paymentId) {
        try {
          const params = new URLSearchParams({
            upi: paymentId,
            name: toMember.name || "",
            amount: settlement.amount.toFixed(2),
          })
          const resp = await fetch(`/api/upi/qr?${params.toString()}`)
          if (resp.ok) {
            const blob = await resp.blob()
            const url = URL.createObjectURL(blob)
            setQrCodes((prev) => ({ ...prev, [idx.toString()]: url }))
            setActiveQrIndex(idx)
            return
          }
        } catch {}
      }

      const paymentLink = getPaymentLink(toMember, settlement.amount)
      if (paymentLink) {
        try {
          const qrDataUrl = await QRCode.toDataURL(paymentLink, { width: 200, margin: 1 })
          setQrCodes((prev) => ({ ...prev, [idx.toString()]: qrDataUrl }))
        } catch {}
      }
    }

    setActiveQrIndex(idx)
  }

  const copyPaymentId = async (id: string) => {
    await navigator.clipboard.writeText(id)
    setCopiedId(id)
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
        backgroundColor: "#ffffff",
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
    } catch {
      window.print()
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Dub-style Top Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/split"
              className="text-sm font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity"
            >
              UL0
            </a>
            <span className="text-muted-foreground/40 text-xs">/</span>
            <span className="text-xs font-mono text-muted-foreground truncate max-w-[140px] sm:max-w-[200px]">
              {session.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {session.expires_at && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-card text-[11px] font-mono text-muted-foreground">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span>
                  {timeLeft.hours}h {timeLeft.minutes}m left
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={refreshSession}
              disabled={isRefreshing}
              className="p-1.5 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>

            <button
              type="button"
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted/50 text-xs font-medium text-foreground transition-colors cursor-pointer"
            >
              {copiedShareLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-foreground" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div ref={contentRef} className="space-y-6">
          {/* Overview Card */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
                    Expense Split
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {session.members.length} {session.members.length === 1 ? "member" : "members"}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  {session.title}
                </h1>
                {session.created_at && (
                  <p className="text-xs text-muted-foreground">
                    Created on {new Date(session.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                )}
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Total Bill
                </span>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                  {formatAmount(session.total_amount)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  {isAllSettled
                    ? "All settlements completed"
                    : `${formatAmount(settledAmount)} of ${formatAmount(totalSettlementAmount)} settled`}
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Settlements Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Settlements ({settlements.length})
              </h2>
              <span className="text-xs text-muted-foreground">
                Mark as paid once transferred
              </span>
            </div>

            {settlements.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center text-xs text-muted-foreground">
                All balances are settled. No transfers required.
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                {settlements.map((settlement, idx) => {
                  const fromMember = getMember(settlement.from)
                  const toMember = getMember(settlement.to)
                  const fromName = fromMember?.name || "Member"
                  const toName = toMember?.name || "Member"
                  const isPaid = Boolean(settlement.paid)
                  const paymentLink = toMember ? getPaymentLink(toMember, settlement.amount) : ""
                  const paymentId = toMember ? getPaymentId(toMember) : ""
                  const isQrOpen = activeQrIndex === idx

                  return (
                    <div
                      key={idx}
                      className={`p-4 sm:p-5 transition-colors ${
                        isPaid ? "bg-muted/20 opacity-75" : "hover:bg-muted/10"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Member Flow */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-mono font-semibold text-foreground">
                            {getInitials(fromName)}
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-foreground">{fromName}</span>
                            <span className="text-xs text-muted-foreground font-mono">owes</span>
                            <span className="font-medium text-foreground">{toName}</span>
                          </div>
                        </div>

                        {/* Amount & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className="text-sm sm:text-base font-bold font-mono text-foreground">
                            {formatAmount(settlement.amount)}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {!isPaid && paymentLink && (
                              <a
                                href={paymentLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border bg-card hover:bg-muted/50 text-xs font-medium text-foreground transition-colors"
                              >
                                <span>Pay</span>
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                              </a>
                            )}

                            {!isPaid && (paymentLink || paymentId) && (
                              <button
                                type="button"
                                onClick={() => toggleQR(settlement, idx)}
                                className="p-1.5 rounded-md border border-border bg-card hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                title="Show QR code"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {paymentId && (
                              <button
                                type="button"
                                onClick={() => copyPaymentId(paymentId)}
                                className="p-1.5 rounded-md border border-border bg-card hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                title={`Copy ${paymentId}`}
                              >
                                {copiedId === paymentId ? (
                                  <Check className="w-3.5 h-3.5 text-foreground" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            {/* Mark as paid toggle button */}
                            <button
                              type="button"
                              disabled={updatingIdx === idx}
                              onClick={() => handleTogglePaid(idx)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                                isPaid
                                  ? "border border-border bg-transparent text-muted-foreground hover:text-foreground"
                                  : "bg-foreground text-background hover:opacity-90"
                              }`}
                            >
                              {updatingIdx === idx ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : isPaid ? (
                                <span>Settled</span>
                              ) : (
                                <span>Mark paid</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* QR Drawer */}
                      {isQrOpen && qrCodes[idx.toString()] && (
                        <div className="mt-4 pt-4 border-t border-border flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                          <img
                            src={qrCodes[idx.toString()]}
                            alt="Payment QR"
                            className="w-40 h-40 object-contain rounded-md border border-border bg-white p-2"
                          />
                          <p className="text-[11px] text-muted-foreground font-mono mt-2 text-center">
                            Pay {formatAmount(settlement.amount)} to {toName}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Member Breakdown */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Member Breakdown ({session.members.length})
            </h2>

            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
              {session.members.map((member) => {
                const bal = memberBalances[member.id] || { totalPaid: 0, totalShare: 0, net: 0 }
                const isPositive = bal.net > 0.01
                const isNegative = bal.net < -0.01

                return (
                  <div key={member.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center font-mono font-semibold text-foreground text-[11px]">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">{member.name}</div>
                        <div className="text-muted-foreground font-mono text-[11px]">
                          Paid {formatAmount(bal.totalPaid)} · Share {formatAmount(bal.totalShare)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      {isPositive ? (
                        <span className="text-foreground font-semibold">
                          +{formatAmount(bal.net)}
                        </span>
                      ) : isNegative ? (
                        <span className="text-muted-foreground">
                          -{formatAmount(Math.abs(bal.net))}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Settled
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Itemized Expenses */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Expenses ({session.expenses.length})
            </h2>

            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
              {session.expenses.map((exp) => (
                <div key={exp.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-medium text-foreground text-sm">{exp.title}</div>
                    <div className="text-muted-foreground text-[11px] mt-0.5">
                      <span>Paid by {getMemberName(exp.paidBy)}</span>
                      {exp.date && (
                        <>
                          <span> · </span>
                          <span className="font-mono">
                            {new Date(exp.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="font-mono font-semibold text-sm text-foreground">
                    {formatAmount(exp.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={downloadPDF}
            className="w-full sm:w-1/2 h-10 rounded-md text-xs font-medium cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Download PDF Receipt</span>
          </Button>

          <Button
            asChild
            className="w-full sm:w-1/2 h-10 rounded-md text-xs font-medium bg-foreground text-background hover:opacity-90 cursor-pointer"
          >
            <a href="/split">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>New Split</span>
            </a>
          </Button>
        </div>

        <div className="text-center pt-4 pb-8">
          <p className="text-xs font-mono text-muted-foreground/60">
            Calculated with <a href="/" className="hover:text-foreground transition-colors underline underline-offset-4">ul0.site</a>
          </p>
        </div>
      </main>
    </div>
  )
}
