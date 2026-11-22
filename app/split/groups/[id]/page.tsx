"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import QRCode from "qrcode"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { UL0Icon } from "@/components/ul0-icon"
import { toast } from "sonner"
import { SettleUpPayment } from "@/lib/groups"

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = (params.id as string) || ""

  const [group, setGroup] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [settlements, setSettlements] = useState<SettleUpPayment[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tab, setTab] = useState<"expenses" | "balances" | "settle" | "members">("expenses")

  // Add Expense Dialog
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseNote, setExpenseNote] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [splitAmong, setSplitAmong] = useState<string[]>([])
  const [isAddingExpense, setIsAddingExpense] = useState(false)

  // Settle Up Pay Modal
  const [activePayment, setActivePayment] = useState<SettleUpPayment | null>(null)
  const [payQr, setPayQr] = useState<string | null>(null)

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const loadGroup = useCallback(async () => {
    if (!groupId) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/groups/${groupId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load group")

      setGroup(data.group)
      setMembers(data.members || [])
      setExpenses(data.expenses || [])
      setSettlements(data.settlements || [])
      setIsOwner(Boolean(data.isOwner))

      if (data.members?.length > 0 && !paidBy) {
        setPaidBy(data.members[0].id)
        setSplitAmong(data.members.map((m: any) => m.id))
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load group")
    } finally {
      setIsLoading(false)
    }
  }, [groupId, paidBy])

  useEffect(() => {
    loadGroup()
  }, [loadGroup])

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
    [expenses]
  )

  // Net balances
  const balances = useMemo(() => {
    const map = new Map<string, { paid: number; share: number; net: number; name: string }>()
    members.forEach((m) => {
      map.set(m.id, { paid: 0, share: 0, net: 0, name: m.name })
    })

    expenses.forEach((exp) => {
      const p = map.get(exp.paid_by_member_id)
      if (p) p.paid += parseFloat(exp.amount)

      const splits = Array.isArray(exp.split_among) ? exp.split_among : []
      splits.forEach((s: any) => {
        const sm = map.get(s.member_id)
        if (sm) sm.share += parseFloat(s.amount)
      })
    })

    for (const val of map.values()) {
      val.net = Math.round((val.paid - val.share) * 100) / 100
    }

    return Array.from(map.values())
  }, [members, expenses])

  // Handle Add Expense
  const handleAddExpenseSubmit = async () => {
    const amt = parseFloat(expenseAmount)
    if (isNaN(amt) || amt <= 0) {
      toast.error("Enter a valid expense amount")
      return
    }

    if (!expenseNote.trim()) {
      toast.error("Expense description is required")
      return
    }

    if (splitAmong.length === 0) {
      toast.error("Select at least one member to share this expense")
      return
    }

    setIsAddingExpense(true)

    try {
      const eachShare = Math.round((amt / splitAmong.length) * 100) / 100
      const splitPayload = splitAmong.map((mId) => ({
        member_id: mId,
        amount: eachShare,
      }))

      const res = await fetch(`/api/groups/${groupId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paidByMemberId: paidBy,
          amount: amt,
          note: expenseNote.trim(),
          splitAmong: splitPayload,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add expense")

      toast.success("Expense added!")
      setShowAddExpense(false)
      setExpenseAmount("")
      setExpenseNote("")
      loadGroup()
    } catch (err: any) {
      toast.error(err.message || "Failed to add expense")
    } finally {
      setIsAddingExpense(false)
    }
  }

  // Open Settle Payment QR Modal
  const openPaymentModal = async (payment: SettleUpPayment) => {
    setActivePayment(payment)
    const note = encodeURIComponent(`${group.name} - Settle Up`)
    const nameEnc = encodeURIComponent(payment.toName)
    const upiUri = payment.toUpiId
      ? `upi://pay?pa=${payment.toUpiId}&pn=${nameEnc}&am=${payment.amount.toFixed(2)}&tn=${note}&cu=INR`
      : ""

    if (upiUri) {
      try {
        const qr = await QRCode.toDataURL(upiUri, {
          width: 280,
          margin: 2,
          color: { dark: "#0B1A17", light: "#FFFFFF" },
        })
        setPayQr(qr)
      } catch {
        setPayQr(null)
      }
    } else {
      setPayQr(null)
    }
  }

  // Delete Group
  const handleDeleteGroup = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete group")
      toast.success("Group deleted")
      router.push("/split/groups")
    } catch (err: any) {
      toast.error(err.message || "Could not delete group")
    }
  }

  const [isGeneratingSplit, setIsGeneratingSplit] = useState(false)

  const handleGenerateSplit = async () => {
    setIsGeneratingSplit(true)
    try {
      const res = await fetch(`/api/groups/${groupId}/split`, {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to generate split")
      if (data.collectorToken) {
        localStorage.setItem(`ul0_split_token_${data.slug}`, data.collectorToken)
      }
      toast.success("Split settlement link generated!")
      router.push(`/split/${data.slug}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to generate split link")
    } finally {
      setIsGeneratingSplit(false)
    }
  }

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
      ...settlements.map((s) => [s.fromName, s.toName, s.amount, s.toUpiId || ""]),
    ]

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${group?.name?.replace(/\s+/g, "-")?.toLowerCase() || "group"}-hisab.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV export downloaded")
  }

  const shareUrl = group?.share_slug
    ? `${typeof window !== "undefined" ? window.location.origin : "https://ul0.site"}/g/${group.share_slug}`
    : ""

  const copyShareLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    toast.success("Public group link copied!")
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex flex-col font-sans selection:bg-[#3DDBB8] selection:text-[#04231C]">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-[#EAF1EE] rounded w-64" />
            <div className="h-32 bg-white border border-[#E4ECE8] rounded-2xl" />
          </div>
        ) : !group ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-[#E4ECE8]">
            <h2 className="text-lg font-bold">Group not found</h2>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Backdrop Banner Hero */}
            {group.banner_url && (
              <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-[#E4ECE8] shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={group.banner_url}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                        {group.name}
                      </h2>
                      <p className="text-xs text-white/80 font-medium">Group Hisab • {members.length} members</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Navigation & Share */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4ECE8] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <a href="/split/groups" className="text-xs font-bold text-[#5A6B66] hover:text-[#0B7A66]">
                    Groups
                  </a>
                  <span className="text-[#D5E0DB]">/</span>
                  <span className="text-xs font-bold text-[#0B7A66]">{group.name}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0B1A17] tracking-tight">
                  {group.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyShareLink}
                  className="border-[#D5E0DB] text-xs h-9 px-3 rounded-xl cursor-pointer"
                >
                  <UL0Icon name="share" size={13} className="mr-1" />
                  <span>Share Group</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportCsv}
                  className="border-[#D5E0DB] text-xs h-9 px-3 rounded-xl cursor-pointer"
                >
                  <UL0Icon name="download" size={13} className="mr-1" />
                  <span>Export CSV</span>
                </Button>

                {isOwner && (
                  <Button
                    size="sm"
                    onClick={handleGenerateSplit}
                    disabled={isGeneratingSplit}
                    className="bg-[#0B7A66] hover:bg-[#086353] text-white font-bold text-xs h-9 px-3.5 rounded-xl cursor-pointer"
                  >
                    <UL0Icon name="splitbill" size={13} className="mr-1" />
                    <span>{isGeneratingSplit ? "Generating..." : "Create Split Link"}</span>
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => setShowAddExpense(true)}
                  className="bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-bold text-xs h-9 px-3 rounded-xl cursor-pointer"
                >
                  <UL0Icon name="plus" size={13} className="mr-1" />
                  <span>Add Expense</span>
                </Button>
              </div>
            </div>

            {/* Total Spent Banner */}
            <div className="rounded-2xl border border-[#E4ECE8] bg-white p-5 flex items-center justify-between shadow-[0_1px_2px_rgba(10,30,26,0.06)]">
              <div>
                <span className="text-xs font-bold text-[#5A6B66] block">Total Spent in Group</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-[#0B1A17]">
                  ₹{totalSpent.toFixed(2)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#5A6B66] block">{members.length} members</span>
                <span className="text-xs text-[#0B7A66] font-semibold">{settlements.length} payments to settle</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-4 p-1 rounded-xl bg-[#EAF1EE] text-xs font-semibold text-center">
              {(["expenses", "balances", "settle", "members"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`py-2 rounded-lg capitalize transition-all cursor-pointer ${
                    tab === t
                      ? "bg-white text-[#0B1A17] font-bold shadow-sm"
                      : "text-[#5A6B66] hover:text-[#0B1A17]"
                  }`}
                >
                  {t === "settle" ? "Settle Up" : t}
                </button>
              ))}
            </div>

            {/* Tab 1: Expenses */}
            {tab === "expenses" && (
              <div className="space-y-3">
                {expenses.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#5A6B66] bg-white rounded-2xl border border-[#E4ECE8]">
                    No expenses logged yet. Tap "Add Expense" to log your first spend!
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#E4ECE8] bg-white divide-y divide-[#E4ECE8] overflow-hidden">
                    {expenses.map((exp) => (
                      <div key={exp.id} className="p-4 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-sm text-[#0B1A17]">{exp.note}</div>
                          <div className="text-[11px] text-[#5A6B66] mt-0.5">
                            Paid by <strong className="text-[#0B1A17]">{exp.payer_name || "Member"}</strong> · Split among {exp.split_among?.length || 0} members
                          </div>
                        </div>

                        <span className="font-mono font-bold text-sm text-[#0B1A17]">
                          ₹{parseFloat(exp.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Balances */}
            {tab === "balances" && (
              <div className="rounded-2xl border border-[#E4ECE8] bg-white divide-y divide-[#E4ECE8] overflow-hidden">
                {balances.map((b, i) => (
                  <div key={i} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-sm text-[#0B1A17]">{b.name}</div>
                      <div className="text-[11px] text-[#5A6B66]">
                        Paid ₹{b.paid.toFixed(2)} · Share ₹{b.share.toFixed(2)}
                      </div>
                    </div>

                    <div className="font-mono text-sm font-bold">
                      {b.net > 0.01 ? (
                        <span className="text-[#0B7A66]">+₹{b.net.toFixed(2)}</span>
                      ) : b.net < -0.01 ? (
                        <span className="text-[#B3261E]">-₹{Math.abs(b.net).toFixed(2)}</span>
                      ) : (
                        <span className="text-[#5A6B66]">Settled</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Settle Up (Greedy Minimum Payments) */}
            {tab === "settle" && (
              <div className="space-y-3">
                <div className="text-xs text-[#5A6B66] px-1">
                  Minimal peer-to-peer transfers required to settle the entire group:
                </div>

                {settlements.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#0B7A66] font-semibold bg-white rounded-2xl border border-[#E4ECE8]">
                    🎉 All balances are settled up! No payments required.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {settlements.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-[#E4ECE8] bg-white flex items-center justify-between gap-3 text-xs shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0B1A17]">{s.fromName}</span>
                          <span className="text-[#5A6B66]">pays</span>
                          <span className="font-bold text-sm text-[#0B7A66]">{s.toName}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-base text-[#0B1A17]">
                            ₹{s.amount.toFixed(2)}
                          </span>

                          <Button
                            size="sm"
                            onClick={() => openPaymentModal(s)}
                            className="bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-bold text-xs h-8 px-3 rounded-lg cursor-pointer"
                          >
                            Pay via UPI
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Members */}
            {tab === "members" && (
              <div className="rounded-2xl border border-[#E4ECE8] bg-white divide-y divide-[#E4ECE8] overflow-hidden">
                {members.map((m) => (
                  <div key={m.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-sm text-[#0B1A17]">{m.name}</span>
                      {m.upi_id && (
                        <span className="font-mono text-[11px] text-[#5A6B66] block mt-0.5">
                          {m.upi_id}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Owner Settings / Delete */}
            {isOwner && (
              <div className="pt-4 border-t border-[#E4ECE8] flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="border-[#D5E0DB] text-[#B3261E] hover:bg-[#FF8A7A]/10 text-xs h-8 px-3 rounded-xl cursor-pointer"
                >
                  <UL0Icon name="trash" size={12} className="mr-1" />
                  <span>Delete Group</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Expense Modal */}
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="bg-white border-[#E4ECE8] text-[#0B1A17] max-w-md p-6 rounded-2xl shadow-xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-black text-[#0B1A17]">Add Group Expense</DialogTitle>
            <DialogDescription className="text-xs text-[#5A6B66]">
              Log a spend for {group?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            <div>
              <Label className="text-xs font-semibold text-[#5A6B66]">Amount (₹)</Label>
              <Input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="450.00"
                className="mt-1 h-12 text-lg font-mono font-bold bg-[#F7FAF8] border-[#E4ECE8]"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#5A6B66]">Description</Label>
              <Input
                value={expenseNote}
                onChange={(e) => setExpenseNote(e.target.value)}
                placeholder="e.g. Dinner, Fuel, Groceries"
                className="mt-1 h-10 text-xs bg-white border-[#E4ECE8]"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#5A6B66]">Who Paid?</Label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full h-10 text-xs bg-white border border-[#E4ECE8] rounded-xl px-3 mt-1 outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#5A6B66]">Split Among</Label>
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {members.map((m) => {
                  const isChecked = splitAmong.includes(m.id)
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setSplitAmong((prev) =>
                          isChecked ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                        )
                      }
                      className={`text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-[#DDF5EE] border border-[#3DDBB8] text-[#0B7A66] font-semibold"
                          : "bg-[#F7FAF8] border border-[#E4ECE8] text-[#5A6B66]"
                      }`}
                    >
                      {m.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAddExpenseSubmit}
              disabled={isAddingExpense}
              className="w-full bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-bold text-sm h-11 rounded-xl cursor-pointer mt-2"
            >
              {isAddingExpense ? "Adding..." : "Log Expense"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settle Up Pay Modal */}
      <Dialog open={Boolean(activePayment)} onOpenChange={(open) => !open && setActivePayment(null)}>
        <DialogContent className="bg-white border-[#E4ECE8] text-[#0B1A17] max-w-sm p-6 rounded-2xl shadow-xl text-center">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-black text-[#0B1A17]">
              Pay {activePayment?.toName}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5A6B66]">
              Exact debt share: <strong className="font-mono text-sm text-[#0B7A66]">₹{activePayment?.amount.toFixed(2)}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {activePayment?.toUpiId ? (
              <>
                <a
                  href={`upi://pay?pa=${activePayment.toUpiId}&pn=${encodeURIComponent(activePayment.toName)}&am=${activePayment.amount.toFixed(2)}&tn=${encodeURIComponent(group.name)}&cu=INR`}
                  className="w-full bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-bold h-11 rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm"
                >
                  <UL0Icon name="mobile" size={16} />
                  <span>Pay with UPI App</span>
                </a>

                {payQr && (
                  <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E4ECE8] inline-block">
                    <img src={payQr} alt="Payment QR" className="w-40 h-40 object-contain rounded" />
                  </div>
                )}

                <span className="text-xs font-mono text-[#5A6B66] block">
                  UPI ID: {activePayment.toUpiId}
                </span>
              </>
            ) : (
              <p className="text-xs text-[#5A6B66]">
                {activePayment?.toName} hasn't added a UPI ID yet. You can pay them directly via your UPI app using their phone number or account.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-white border-[#E4ECE8] text-[#0B1A17] max-w-sm p-6 rounded-2xl shadow-xl text-center">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-bold text-[#0B1A17]">Delete this Group?</DialogTitle>
            <DialogDescription className="text-xs text-[#5A6B66]">
              All expenses and balances in {group?.name} will be removed permanently.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 h-10 border-[#D5E0DB] text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteGroup}
              className="flex-1 bg-[#B3261E] hover:bg-[#992019] text-white text-xs h-10 rounded-xl font-bold"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
