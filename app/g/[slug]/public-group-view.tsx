"use client"

import { useState, useMemo, useCallback } from "react"
import QRCode from "qrcode"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { UL0Icon } from "@/components/ul0-icon"
import { toast } from "sonner"
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si"
import { SettleUpPayment, Group, GroupMember, GroupExpense } from "@/lib/groups"

interface PublicGroupViewProps {
  initialData: {
    group: Group
    members: (GroupMember & { masked_upi_id?: string })[]
    expenses: GroupExpense[]
    settlements: SettleUpPayment[]
  }
  slug: string
}

export function PublicGroupView({ initialData, slug }: PublicGroupViewProps) {
  const [group, setGroup] = useState<Group>(initialData.group)
  const [members, setMembers] = useState<(GroupMember & { masked_upi_id?: string })[]>(initialData.members)
  const [expenses, setExpenses] = useState<GroupExpense[]>(initialData.expenses)
  const [settlements, setSettlements] = useState<SettleUpPayment[]>(initialData.settlements)
  const [tab, setTab] = useState<"settle" | "balances" | "expenses" | "members">("settle")

  // Settle Pay Modal
  const [activePayment, setActivePayment] = useState<SettleUpPayment | null>(null)
  const [payQr, setPayQr] = useState<string | null>(null)

  // Add Expense Dialog (if member entries allowed)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseNote, setExpenseNote] = useState("")
  const [paidBy, setPaidBy] = useState(members[0]?.id || "")
  const [splitAmong, setSplitAmong] = useState<string[]>(members.map((m) => m.id))
  const [isAddingExpense, setIsAddingExpense] = useState(false)

  // Copy share state
  const [copiedLink, setCopiedLink] = useState(false)

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://ul0.site/g/${slug}`

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + parseFloat(String(e.amount || 0)), 0),
    [expenses]
  )

  // Balances calculation
  const balances = useMemo(() => {
    const map = new Map<string, { paid: number; share: number; net: number; name: string }>()
    members.forEach((m) => {
      map.set(m.id, { paid: 0, share: 0, net: 0, name: m.name })
    })

    expenses.forEach((exp) => {
      const p = map.get(exp.paid_by_member_id)
      if (p) p.paid += parseFloat(String(exp.amount))

      const splits = Array.isArray(exp.split_among) ? exp.split_among : []
      splits.forEach((s: any) => {
        const sm = map.get(s.member_id)
        if (sm) sm.share += parseFloat(String(s.amount))
      })
    })

    for (const val of map.values()) {
      val.net = Math.round((val.paid - val.share) * 100) / 100
    }

    return Array.from(map.values())
  }, [members, expenses])

  // Open Settle Pay Modal
  const handleOpenPay = useCallback(async (payment: SettleUpPayment) => {
    setActivePayment(payment)
    if (payment.toUpiId) {
      const upiUrl = `upi://pay?pa=${encodeURIComponent(payment.toUpiId)}&pn=${encodeURIComponent(
        payment.toName
      )}&am=${payment.amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
        `${group.name} - Settle up`
      )}`
      try {
        const qr = await QRCode.toDataURL(upiUrl, {
          width: 320,
          margin: 1,
          color: { dark: "#0B1A17", light: "#FFFFFF" },
        })
        setPayQr(qr)
      } catch {
        setPayQr(null)
      }
    } else {
      setPayQr(null)
    }
  }, [group.name])

  // Submit Expense (Public member entry)
  const handleAddExpenseSubmit = async () => {
    const amt = parseFloat(expenseAmount)
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid expense amount")
      return
    }

    if (!expenseNote.trim()) {
      toast.error("Please enter what this expense was for")
      return
    }

    if (splitAmong.length === 0) {
      toast.error("Select at least one member to share this expense")
      return
    }

    setIsAddingExpense(true)
    try {
      // Split equally among selected members
      const perPersonAmt = Math.round((amt / splitAmong.length) * 100) / 100
      const splitShares = splitAmong.map((mId, idx) => {
        if (idx === 0) {
          const remainder = Math.round((amt - perPersonAmt * (splitAmong.length - 1)) * 100) / 100
          return { member_id: mId, amount: remainder }
        }
        return { member_id: mId, amount: perPersonAmt }
      })

      const res = await fetch(`/api/groups/${group.id}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paidByMemberId: paidBy,
          amount: amt,
          note: expenseNote.trim(),
          splitAmong: splitShares,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add expense")

      toast.success("Expense logged to group!")
      setShowAddExpense(false)
      setExpenseAmount("")
      setExpenseNote("")

      // Refresh public data
      const refreshRes = await fetch(`/api/groups/share/${slug}`)
      if (refreshRes.ok) {
        const refreshed = await refreshRes.json()
        setGroup(refreshed.group)
        setMembers(refreshed.members)
        setExpenses(refreshed.expenses)
        setSettlements(refreshed.settlements)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add expense")
    } finally {
      setIsAddingExpense(false)
    }
  }

  // Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopiedLink(true)
    toast.success("Public group link copied to clipboard")
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Export CSV
  const handleExportCsv = () => {
    const rows = [
      ["Date", "Expense", "Paid By", "Amount (INR)", "Split Among"],
      ...expenses.map((e) => [
        new Date(e.created_at).toLocaleDateString("en-IN"),
        `"${e.note.replace(/"/g, '""')}"`,
        `"${e.payer_name || "Member"}"`,
        e.amount,
        `"${Array.isArray(e.split_among) ? e.split_among.length : 0} members"`,
      ]),
      [],
      ["Settlement Recommendations (Minimum Transfers)"],
      ["From", "To", "Amount (INR)", "Recipient UPI"],
      ...settlements.map((s) => [s.fromName, s.toName, s.amount, s.toMaskedUpiId || ""]),
    ]

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${group.name.replace(/\s+/g, "-").toLowerCase()}-khata.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV export downloaded")
  }

  // UPI deep links
  const getUpiDeepLink = (app: "gpay" | "phonepe" | "paytm" | "cred" | "generic") => {
    if (!activePayment?.toUpiId) return "#"
    const pa = encodeURIComponent(activePayment.toUpiId)
    const pn = encodeURIComponent(activePayment.toName)
    const am = activePayment.amount.toFixed(2)
    const tn = encodeURIComponent(`${group.name} - Settle up`)

    switch (app) {
      case "gpay":
        return `tez://upi/pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`
      case "phonepe":
        return `phonepe://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`
      case "paytm":
        return `paytmmp://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`
      case "cred":
        return `cred://upi/pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`
      default:
        return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {group.banner_url && (
          <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-[#E4ECE8] shadow-xs mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={group.banner_url}
              alt={group.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                {group.icon_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={group.icon_url}
                    alt=""
                    className="w-14 h-14 rounded-2xl border-2 border-white object-cover shadow-sm bg-white"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl border-2 border-white bg-[#0B7A66] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                    {group.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                    {group.name}
                  </h1>
                  <p className="text-xs text-white/80 font-medium">Group Khata • {members.length} members</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group Header Card */}
        <div className="bg-white rounded-2xl border border-[#E4ECE8] p-6 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF7F3] text-[#0B7A66]">
                  <UL0Icon name="splitbill" size={12} /> Group Khata
                </span>
                <span className="text-[11px] text-[#5A6B66]">Direct Bank-to-Bank UPI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1A17] tracking-tight">
                {group.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="border-[#CCD9D4] text-[#0B1A17] hover:bg-[#EAF7F3] text-xs h-9 rounded-xl font-medium"
              >
                <UL0Icon name={copiedLink ? "check" : "copy"} size={14} className="mr-1.5" />
                {copiedLink ? "Copied" : "Share Link"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                className="border-[#CCD9D4] text-[#0B1A17] hover:bg-[#EAF7F3] text-xs h-9 rounded-xl font-medium"
              >
                <UL0Icon name="download" size={14} className="mr-1.5" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-[#E4ECE8]">
            <div className="bg-[#F7FAF8] rounded-xl p-3 border border-[#E4ECE8]">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-[#5A6B66] block">
                Total Group Spend
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#0B1A17] mt-0.5 block">
                ₹{totalSpent.toFixed(2)}
              </span>
            </div>
            <div className="bg-[#F7FAF8] rounded-xl p-3 border border-[#E4ECE8]">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-[#5A6B66] block">
                Members
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#0B1A17] mt-0.5 block">
                {members.length}
              </span>
            </div>
            <div className="bg-[#F7FAF8] rounded-xl p-3 border border-[#E4ECE8]">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-[#5A6B66] block">
                To Settle
              </span>
              <span className="text-lg sm:text-xl font-bold text-[#0B7A66] mt-0.5 block">
                {settlements.length} {settlements.length === 1 ? "payment" : "payments"}
              </span>
            </div>
          </div>

          {/* Group invite trust banner */}
          <div className="mt-4 p-3 bg-[#EAF7F3] border border-[#CCD9D4] rounded-xl flex items-center justify-between text-xs text-[#0B7A66]">
            <div className="flex items-center gap-2">
              <UL0Icon name="shield" size={16} />
              <span>Public friend view. Zero signup required. Money transfers directly over UPI.</span>
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Hey! View and settle our group expenses for "${group.name}" here: ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline hover:text-[#086353] inline-flex items-center gap-1"
            >
              WhatsApp Friends
            </a>
          </div>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-[#E4ECE8] mb-6">
          <div className="flex gap-1">
            <button
              onClick={() => setTab("settle")}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                tab === "settle"
                  ? "border-[#0B7A66] text-[#0B7A66] bg-white"
                  : "border-transparent text-[#5A6B66] hover:text-[#0B1A17]"
              }`}
            >
              <UL0Icon name="check" size={14} /> Settle Up ({settlements.length})
            </button>
            <button
              onClick={() => setTab("balances")}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                tab === "balances"
                  ? "border-[#0B7A66] text-[#0B7A66] bg-white"
                  : "border-transparent text-[#5A6B66] hover:text-[#0B1A17]"
              }`}
            >
              <UL0Icon name="split" size={14} /> Balances
            </button>
            <button
              onClick={() => setTab("expenses")}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                tab === "expenses"
                  ? "border-[#0B7A66] text-[#0B7A66] bg-white"
                  : "border-transparent text-[#5A6B66] hover:text-[#0B1A17]"
              }`}
            >
              <UL0Icon name="clock" size={14} /> Expenses ({expenses.length})
            </button>
            <button
              onClick={() => setTab("members")}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
                tab === "members"
                  ? "border-[#0B7A66] text-[#0B7A66] bg-white"
                  : "border-transparent text-[#5A6B66] hover:text-[#0B1A17]"
              }`}
            >
              <UL0Icon name="profile" size={14} /> Members ({members.length})
            </button>
          </div>

          {group.allow_member_entries && (
            <Button
              size="sm"
              onClick={() => setShowAddExpense(true)}
              className="bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-8 px-3 rounded-xl font-medium mb-1.5"
            >
              <UL0Icon name="plus" size={14} className="mr-1" /> Add Expense
            </Button>
          )}
        </div>

        {/* TAB 1: Settle Up (Minimum Transfers) */}
        {tab === "settle" && (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-[#E4ECE8] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#0B1A17]">Minimum Settle Payments</h2>
                <span className="text-[11px] text-[#5A6B66]">Greedy net-balance matching</span>
              </div>
              <p className="text-xs text-[#5A6B66] mb-4">
                Instead of everyone sending money back and forth, settle all group balances with these exact payments:
              </p>

              {settlements.length === 0 ? (
                <div className="text-center py-10 bg-[#F7FAF8] rounded-xl border border-dashed border-[#CCD9D4]">
                  <div className="w-10 h-10 rounded-full bg-[#EAF7F3] text-[#0B7A66] mx-auto flex items-center justify-center mb-2">
                    <UL0Icon name="check" size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-[#0B1A17]">All debts are settled!</h3>
                  <p className="text-xs text-[#5A6B66] mt-1">No pending payments between members.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {settlements.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[#E4ECE8] bg-[#F7FAF8] hover:bg-[#EAF7F3]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white border border-[#CCD9D4] flex items-center justify-center text-xs font-bold text-[#0B7A66]">
                          {s.fromName.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0B1A17] flex items-center gap-1.5">
                            <span>{s.fromName}</span>
                            <span className="text-[#5A6B66] font-normal">owes</span>
                            <span className="text-[#0B7A66] font-bold">{s.toName}</span>
                          </div>
                          <div className="text-[11px] text-[#5A6B66] mt-0.5">
                            {s.toMaskedUpiId ? `UPI: ${s.toMaskedUpiId}` : "Direct Bank Transfer"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-[#E4ECE8]">
                        <span className="text-base font-extrabold text-[#0B1A17]">
                          ₹{s.amount.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleOpenPay(s)}
                          className="bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-9 px-4 rounded-xl font-semibold"
                        >
                          <UL0Icon name="splitbill" size={14} className="mr-1.5" />
                          Pay ₹{s.amount.toFixed(0)}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Balances */}
        {tab === "balances" && (
          <div className="bg-white rounded-2xl border border-[#E4ECE8] p-5 shadow-xs">
            <h2 className="text-sm font-bold text-[#0B1A17] mb-3">Net Member Balances</h2>
            <div className="divide-y divide-[#E4ECE8]">
              {balances.map((b, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#0B1A17]">{b.name}</h3>
                    <p className="text-[11px] text-[#5A6B66] mt-0.5">
                      Paid ₹{b.paid.toFixed(2)} • Share ₹{b.share.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    {b.net > 0.01 ? (
                      <span className="text-sm font-bold text-[#0B7A66]">
                        Gets back ₹{b.net.toFixed(2)}
                      </span>
                    ) : b.net < -0.01 ? (
                      <span className="text-sm font-bold text-[#D9383A]">
                        Owes ₹{Math.abs(b.net).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[#5A6B66]">Settled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Expenses */}
        {tab === "expenses" && (
          <div className="bg-white rounded-2xl border border-[#E4ECE8] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#0B1A17]">Logged Expenses</h2>
              {group.allow_member_entries && (
                <Button
                  size="sm"
                  onClick={() => setShowAddExpense(true)}
                  className="bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-8 px-3 rounded-xl font-medium"
                >
                  <UL0Icon name="plus" size={14} className="mr-1" /> Add Expense
                </Button>
              )}
            </div>

            {expenses.length === 0 ? (
              <div className="text-center py-10 bg-[#F7FAF8] rounded-xl border border-dashed border-[#CCD9D4]">
                <p className="text-xs text-[#5A6B66]">No expenses recorded yet in this group.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E4ECE8]">
                {expenses.map((exp) => (
                  <div key={exp.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[#0B1A17]">{exp.note}</h3>
                      <p className="text-[11px] text-[#5A6B66] mt-0.5">
                        Paid by <span className="font-medium text-[#0B1A17]">{exp.payer_name || "Member"}</span> •{" "}
                        {new Date(exp.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • Split among {Array.isArray(exp.split_among) ? exp.split_among.length : 0} members
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#0B1A17]">
                      ₹{parseFloat(String(exp.amount)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Members */}
        {tab === "members" && (
          <div className="bg-white rounded-2xl border border-[#E4ECE8] p-5 shadow-xs">
            <h2 className="text-sm font-bold text-[#0B1A17] mb-3">Group Members ({members.length})</h2>
            <div className="divide-y divide-[#E4ECE8]">
              {members.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAF7F3] border border-[#CCD9D4] text-[#0B7A66] text-xs font-bold flex items-center justify-center">
                      {m.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0B1A17]">{m.name}</h3>
                      {m.masked_upi_id && (
                        <p className="text-[11px] text-[#5A6B66]">UPI: {m.masked_upi_id}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Settle Up Pay Dialog */}
      <Dialog open={!!activePayment} onOpenChange={(open) => !open && setActivePayment(null)}>
        <DialogContent className="max-w-md bg-white border border-[#E4ECE8] text-[#0B1A17] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0B1A17]">
              Settle with {activePayment?.toName}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5A6B66]">
              Scan QR or tap your UPI app below to pay your exact share.
            </DialogDescription>
          </DialogHeader>

          {activePayment && (
            <div className="space-y-5 pt-2">
              <div className="p-4 bg-[#F7FAF8] rounded-xl border border-[#E4ECE8] text-center">
                <span className="text-[11px] text-[#5A6B66] uppercase tracking-wider block font-medium">
                  Exact Amount
                </span>
                <span className="text-3xl font-extrabold text-[#0B1A17] block mt-1">
                  ₹{activePayment.amount.toFixed(2)}
                </span>
                <span className="text-xs text-[#5A6B66] block mt-1">
                  Recipient: {activePayment.toName}{" "}
                  {activePayment.toMaskedUpiId && `(${activePayment.toMaskedUpiId})`}
                </span>
              </div>

              {payQr && (
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-white border border-[#E4ECE8] rounded-2xl shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={payQr} alt="UPI QR Code" className="w-48 h-48 rounded-lg" />
                  </div>
                  <span className="text-[11px] text-[#5A6B66] mt-2">
                    Scan with GPay, PhonePe, Paytm, or any UPI app
                  </span>
                </div>
              )}

              {/* 1-Tap Mobile UPI Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-semibold text-[#5A6B66] tracking-wider block">
                  Tap to Pay Directly (Mobile)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={getUpiDeepLink("gpay")}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#E4ECE8] bg-white hover:bg-[#F7FAF8] text-xs font-semibold text-[#0B1A17] transition-colors"
                  >
                    <SiGooglepay className="w-5 h-5 text-[#4285F4]" /> Google Pay
                  </a>
                  <a
                    href={getUpiDeepLink("phonepe")}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#E4ECE8] bg-white hover:bg-[#F7FAF8] text-xs font-semibold text-[#0B1A17] transition-colors"
                  >
                    <SiPhonepe className="w-4 h-4 text-[#5f259f]" /> PhonePe
                  </a>
                  <a
                    href={getUpiDeepLink("paytm")}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#E4ECE8] bg-white hover:bg-[#F7FAF8] text-xs font-semibold text-[#0B1A17] transition-colors"
                  >
                    <SiPaytm className="w-5 h-5 text-[#00baf2]" /> Paytm
                  </a>
                  <a
                    href={getUpiDeepLink("generic")}
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#E4ECE8] bg-white hover:bg-[#F7FAF8] text-xs font-semibold text-[#0B1A17] transition-colors"
                  >
                    <UL0Icon name="link" size={14} /> Any UPI App
                  </a>
                </div>
              </div>

              <div className="p-3 bg-[#EAF7F3] rounded-xl border border-[#CCD9D4] text-xs text-[#0B7A66] flex items-center gap-2">
                <UL0Icon name="shield" size={16} />
                <span>Direct peer-to-peer bank transfer. UL0 never touches or holds money.</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Expense Dialog (for public members if allowed) */}
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="max-w-md bg-white border border-[#E4ECE8] text-[#0B1A17] p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0B1A17]">Add Group Expense</DialogTitle>
            <DialogDescription className="text-xs text-[#5A6B66]">
              Log a group expense to update balances and settlement transfers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold text-[#0B1A17]">Amount (₹)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="mt-1 border-[#CCD9D4] rounded-xl text-lg font-bold text-[#0B1A17]"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#0B1A17]">What was this for?</Label>
              <Input
                placeholder="Dinner, Cab, Groceries, Hotel..."
                value={expenseNote}
                onChange={(e) => setExpenseNote(e.target.value)}
                className="mt-1 border-[#CCD9D4] rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#0B1A17]">Who Paid?</Label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full mt-1 border border-[#CCD9D4] rounded-xl text-xs h-10 px-3 bg-white text-[#0B1A17]"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#0B1A17] block mb-2">
                Split equally among
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 border border-[#E4ECE8] rounded-xl">
                {members.map((m) => {
                  const isChecked = splitAmong.includes(m.id)
                  return (
                    <label
                      key={m.id}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? "bg-[#EAF7F3] text-[#0B7A66] font-medium" : "text-[#5A6B66]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSplitAmong([...splitAmong, m.id])
                          } else {
                            if (splitAmong.length > 1) {
                              setSplitAmong(splitAmong.filter((id) => id !== m.id))
                            }
                          }
                        }}
                        className="rounded accent-[#0B7A66]"
                      />
                      <span>{m.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <Button
              onClick={handleAddExpenseSubmit}
              disabled={isAddingExpense}
              className="w-full bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-10 rounded-xl font-semibold mt-4"
            >
              {isAddingExpense ? "Logging Expense..." : "Save Expense"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
