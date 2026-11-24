"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { UL0Icon } from "@/components/ul0-icon"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  buildReminderMessage,
  ReminderTone,
  ReminderLang,
  EXPIRY_OPTIONS,
} from "@/components/split/split-constants"

export default function SplitManagePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isSignedIn, userId } = useAuth()

  const slug = (params.slug as string) || ""

  // State
  const [session, setSession] = useState<any>(null)
  const [settlements, setSettlements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [collectorToken, setCollectorToken] = useState<string>("")
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Reminder Modal
  const [remindFriend, setRemindFriend] = useState<any | null>(null)
  const [remindIdx, setRemindIdx] = useState<number | null>(null)
  const [remindTone, setRemindTone] = useState<ReminderTone>("polite")
  const [remindLang, setRemindLang] = useState<ReminderLang>("en")

  // Extend & Delete
  const [isExtending, setIsExtending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 1. Resolve collector token from URL query or localStorage
  useEffect(() => {
    const urlToken = searchParams.get("token")
    if (urlToken) {
      setCollectorToken(urlToken)
      try {
        localStorage.setItem(`ul0_split_token_${slug}`, urlToken)
      } catch {}
      return
    }

    try {
      const stored = localStorage.getItem(`ul0_split_token_${slug}`)
      if (stored) {
        setCollectorToken(stored)
      }
    } catch {}
  }, [searchParams, slug])

  // 2. Fetch session with owner verification
  const loadSession = useCallback(async () => {
    if (!slug) return
    setIsLoading(true)
    setAuthError(null)

    try {
      const headers: Record<string, string> = {}
      if (collectorToken) {
        headers["x-collector-token"] = collectorToken
      }

      const res = await fetch(`/api/split/${slug}`, { headers })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to load split session")
      }

      setSession(data.session)
      setSettlements(data.session.settlements || [])
      setIsAuthorized(Boolean(data.isOwner))

      if (!data.isOwner) {
        setAuthError("You need creator access to manage this split. Enter your private manage token or sign in with the creator account.")
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to load session")
    } finally {
      setIsLoading(false)
    }
  }, [slug, collectorToken])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  // Settle metrics
  const totalAmount = session?.total_amount || 0
  const settledAmount = useMemo(
    () =>
      settlements
        .filter((s) => s.status === "confirmed" || s.verified)
        .reduce((sum, s) => sum + s.amount, 0),
    [settlements]
  )
  const settledCount = settlements.filter((s) => s.status === "confirmed" || s.verified).length
  const pendingCount = settlements.filter((s) => s.status === "claimed" || s.paid).length
  const unpaidCount = settlements.filter(
    (s) => s.status === "unpaid" && !s.paid && !s.verified
  ).length

  // Friend name helper
  const getMemberName = (id: string): string => {
    const m = session?.members?.find((item: any) => item.id === id)
    return m?.name || "Friend"
  }

  // Confirm or reject settlement
  const handleConfirm = async (index: number, confirmed: boolean) => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (collectorToken) headers["x-collector-token"] = collectorToken

      const res = await fetch(`/api/split/${slug}/confirm`, {
        method: "POST",
        headers,
        body: JSON.stringify({ settlementIndex: index, confirmed }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update settlement")

      if (data.session?.settlements) {
        setSettlements(data.session.settlements)
      }
      toast.success(confirmed ? "Payment confirmed!" : "Payment marked as not received.")
    } catch (err: any) {
      toast.error(err.message || "Could not update payment.")
    }
  }

  // Extend expiry
  const handleExtend = async (days: number) => {
    setIsExtending(true)
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (collectorToken) headers["x-collector-token"] = collectorToken

      const res = await fetch(`/api/split/${slug}/extend`, {
        method: "POST",
        headers,
        body: JSON.stringify({ days }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to extend expiry")

      toast.success(`Expiry extended by ${days} days!`)
      loadSession()
    } catch (err: any) {
      toast.error(err.message || "Could not extend expiry")
    } finally {
      setIsExtending(false)
    }
  }

  // Delete session
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const headers: Record<string, string> = {}
      if (collectorToken) headers["x-collector-token"] = collectorToken

      const res = await fetch(`/api/split/${slug}`, {
        method: "DELETE",
        headers,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete split")

      toast.success("Split deleted permanently.")
      router.push("/split")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete split")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    if (!session) return
    const rows = [
      ["Bill Title", session.title],
      ["Total Amount", `₹${session.total_amount}`],
      ["Created Date", session.created_at || ""],
      ["Expires At", session.expires_at || ""],
      [],
      ["Member", "Amount (₹)", "Status", "Claimed At", "Confirmed At", "UTR Reference"],
      ...settlements.map((s) => [
        getMemberName(s.from),
        s.amount.toFixed(2),
        s.status || (s.verified ? "confirmed" : s.paid ? "claimed" : "unpaid"),
        s.claimed_at || "",
        s.confirmed_at || "",
        s.utr_last4 || "",
      ]),
    ]

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${session.title.replace(/\s+/g, "-")}-settlements.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV export downloaded!")
  }

  // Reminder message preview
  const previewMessage = useMemo(() => {
    if (!remindFriend || !session) return ""
    const settleUrl = `${typeof window !== "undefined" ? window.location.origin : "https://ul0.site"}/split/${slug}`
    return buildReminderMessage({
      friendName: getMemberName(remindFriend.from),
      title: session.title,
      amount: remindFriend.amount,
      settleUrl,
      payByDate: session.pay_by,
      tone: remindTone,
      lang: remindLang,
    })
  }, [remindFriend, session, slug, remindTone, remindLang])

  const sendWhatsAppReminder = () => {
    if (!previewMessage) return
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(previewMessage)}`, "_blank")
    setRemindFriend(null)
  }

  const copyReminderMessage = async () => {
    if (!previewMessage) return
    await navigator.clipboard.writeText(previewMessage)
    toast.success("Reminder message copied!")
  }

  const [isSendingBotReminder, setIsSendingBotReminder] = useState(false)

  const sendBotReminder = async () => {
    if (!remindFriend || !session) return
    setIsSendingBotReminder(true)

    try {
      const friendMember = session?.members?.find((m: any) => m.id === remindFriend.from)
      const res = await fetch("/api/notify/split-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          memberId: remindFriend.from,
          memberName: getMemberName(remindFriend.from),
          collectorName: session?.collector_name || "Organizer",
          amount: remindFriend.amount,
          title: session?.title,
          email: friendMember?.email,
          telegram: friendMember?.telegram,
          settleUrl: `${window.location.origin}/split/${slug}`,
          isManual: true,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch reminder.")
      }
      toast.success("Reminder dispatched via Telegram & Email!")
      setRemindFriend(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to send reminder.")
    } finally {
      setIsSendingBotReminder(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#0B1A17] flex flex-col font-sans selection:bg-[#3DDBB8] selection:text-[#04231C]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-[#E4ECE8] bg-white/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a
              href="/split"
              className="text-xs font-bold text-[#0B1A17] hover:text-[#0B7A66] transition-colors flex items-center gap-1.5"
            >
              <UL0Icon name="splitbill" size={16} />
              <span>UL0 Split</span>
            </a>
            <span className="text-[#D5E0DB]">/</span>
            <span className="text-xs font-medium text-[#5A6B66]">Manage</span>
          </div>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-[#D5E0DB] text-xs h-8 px-3 rounded-lg"
          >
            <a href={`/split/${slug}`}>
              <span>Public View</span>
              <UL0Icon name="external" size={12} className="ml-1" />
            </a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-[#EAF1EE] rounded w-64" />
            <div className="h-4 bg-[#EAF1EE] rounded w-48" />
            <div className="h-48 bg-white border border-[#E4ECE8] rounded-2xl mt-4" />
          </div>
        ) : !isAuthorized ? (
          // Unauthorized Card
          <div className="p-8 rounded-2xl border border-[#E4ECE8] bg-white text-center space-y-4 max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#EAF1EE] text-[#0B7A66] mx-auto flex items-center justify-center">
              <UL0Icon name="shield" size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#0B1A17]">Creator Access Required</h2>
            <p className="text-xs text-[#5A6B66] leading-relaxed">
              {authError || "Enter your private collector token or sign in with your creator account to verify payments."}
            </p>
            <div className="space-y-2 pt-2">
              <input
                type="text"
                value={collectorToken}
                onChange={(e) => setCollectorToken(e.target.value)}
                placeholder="Paste collector token"
                className="w-full h-10 px-3 text-xs font-mono bg-[#F7FAF8] border border-[#E4ECE8] rounded-xl outline-none"
              />
              <Button
                type="button"
                onClick={loadSession}
                className="w-full bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-10 rounded-xl"
              >
                Verify Token
              </Button>
            </div>
          </div>
        ) : (
          // Authorized Manage Dashboard
          <div className="space-y-6">
            {/* Summary Stat Card */}
            <div className="rounded-2xl border border-[#E4ECE8] bg-white p-6 shadow-[0_1px_2px_rgba(10,30,26,0.06)] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E4ECE8] pb-3">
                <div>
                  <span className="text-[11px] font-bold text-[#0B7A66] uppercase tracking-wider block">
                    Manage Split
                  </span>
                  <h1 className="text-2xl font-black text-[#0B1A17] tracking-tight">
                    {session?.title}
                  </h1>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#5A6B66] block">Total Bill</span>
                  <span className="text-2xl font-black font-mono text-[#0B1A17]">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Progress Stat */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-[#0B7A66] font-bold">
                    ₹{settledAmount.toFixed(2)} of ₹{totalAmount.toFixed(2)} settled
                  </span>
                  <span className="text-[#5A6B66]">
                    {settledCount} confirmed · {pendingCount} pending check · {unpaidCount} unpaid
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EAF1EE] overflow-hidden">
                  <div
                    className="h-full bg-[#0B7A66] rounded-full transition-all duration-300"
                    style={{ width: `${totalAmount > 0 ? (settledAmount / totalAmount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Section 1: Pending Confirmations */}
            {pendingCount > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold text-[#B57C00] uppercase tracking-wider flex items-center gap-1.5">
                    <UL0Icon name="clock" size={14} />
                    <span>Pending Bank Check ({pendingCount})</span>
                  </h2>
                  <span className="text-[11px] text-[#5A6B66]">Friends who tapped "I've Paid"</span>
                </div>

                <div className="rounded-2xl border border-[#F2B544]/50 bg-[#F7FAF8] divide-y divide-[#E4ECE8] overflow-hidden">
                  {settlements.map((s, idx) => {
                    const isClaimed = s.status === "claimed" || (s.paid && !s.verified)
                    if (!isClaimed) return null
                    const name = getMemberName(s.from)

                    return (
                      <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white">
                        <div>
                          <div className="font-bold text-sm text-[#0B1A17]">{name}</div>
                          <div className="text-[11px] text-[#5A6B66] mt-0.5">
                            Owes ₹{s.amount.toFixed(2)}
                            {s.utr_last4 && ` · UTR Ref: ${s.utr_last4}`}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleConfirm(idx, true)}
                            className="bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-8 px-3 rounded-lg cursor-pointer"
                          >
                            <UL0Icon name="check" size={13} className="mr-1" />
                            <span>Confirm Received</span>
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirm(idx, false)}
                            className="border-[#D5E0DB] text-[#B3261E] hover:bg-[#FF8A7A]/10 text-xs h-8 px-3 rounded-lg cursor-pointer"
                          >
                            <span>Not Received</span>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Section 2: Waiting for Payment (Unpaid Friends) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold text-[#5A6B66] uppercase tracking-wider flex items-center gap-1.5">
                  <UL0Icon name="team" size={14} />
                  <span>Waiting for Payment ({unpaidCount})</span>
                </h2>
                <span className="text-[11px] text-[#5A6B66]">Send a polite or funny WhatsApp reminder</span>
              </div>

              <div className="rounded-2xl border border-[#E4ECE8] bg-white divide-y divide-[#E4ECE8] overflow-hidden">
                {settlements.map((s, idx) => {
                  const isUnpaid = s.status === "unpaid" && !s.paid && !s.verified
                  if (!isUnpaid) return null
                  const name = getMemberName(s.from)

                  return (
                    <div key={idx} className="p-4 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-sm text-[#0B1A17]">{name}</div>
                        <div className="font-mono text-xs font-bold text-[#0B7A66]">
                          ₹{s.amount.toFixed(2)}
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setRemindFriend(s)
                          setRemindIdx(idx)
                        }}
                        className="bg-[#EAF1EE] hover:bg-[#DDF5EE] text-[#0B7A66] font-semibold text-xs h-8 px-3 rounded-lg cursor-pointer"
                      >
                        <UL0Icon name="whatsapp" size={14} className="mr-1" />
                        <span>Remind</span>
                      </Button>
                    </div>
                  )
                })}

                {unpaidCount === 0 && (
                  <div className="p-6 text-center text-xs text-[#5A6B66]">
                    🎉 Everyone has either paid or marked their settlement!
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Confirmed Settlements */}
            {settledCount > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold text-[#0B7A66] uppercase tracking-wider flex items-center gap-1.5">
                    <UL0Icon name="check" size={14} />
                    <span>Confirmed Settlements ({settledCount})</span>
                  </h2>
                </div>

                <div className="rounded-2xl border border-[#E4ECE8] bg-white divide-y divide-[#E4ECE8] overflow-hidden">
                  {settlements.map((s, idx) => {
                    const isConfirmed = s.status === "confirmed" || s.verified
                    if (!isConfirmed) return null
                    const name = getMemberName(s.from)

                    return (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs text-[#5A6B66]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0B7A66]"></span>
                          <span className="font-semibold text-[#0B1A17]">{name}</span>
                          <span>(₹{s.amount.toFixed(2)})</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleConfirm(idx, false)}
                          className="text-[11px] text-[#5A6B66] hover:text-[#B3261E] hover:underline cursor-pointer"
                        >
                          Undo
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Footer Management Actions */}
            <div className="p-5 rounded-2xl border border-[#E4ECE8] bg-white space-y-4">
              <h3 className="text-xs font-bold text-[#5A6B66] uppercase tracking-wider">
                Split Settings & Actions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Extend Expiry */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleExtend(30)}
                  disabled={isExtending}
                  className="h-10 text-xs border-[#D5E0DB] text-[#0B1A17] rounded-xl cursor-pointer"
                >
                  <UL0Icon name="clock" size={13} className="mr-1.5" />
                  <span>Extend (+30 days)</span>
                </Button>

                {/* Export CSV */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExportCSV}
                  className="h-10 text-xs border-[#D5E0DB] text-[#0B1A17] rounded-xl cursor-pointer"
                >
                  <UL0Icon name="download" size={13} className="mr-1.5" />
                  <span>Export CSV</span>
                </Button>

                {/* Delete Split */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-10 text-xs border-[#D5E0DB] text-[#B3261E] hover:bg-[#FF8A7A]/10 rounded-xl cursor-pointer"
                >
                  <UL0Icon name="trash" size={13} className="mr-1.5" />
                  <span>Delete Split</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Remind Modal with Tone Picker & Live Preview */}
      <Dialog open={Boolean(remindFriend)} onOpenChange={(open) => !open && setRemindFriend(null)}>
        <DialogContent className="bg-white border-[#E4ECE8] text-[#0B1A17] max-w-md p-6 rounded-2xl shadow-xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-bold text-[#0B1A17]">
              Remind {remindFriend ? getMemberName(remindFriend.from) : "Friend"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5A6B66]">
              Pick a tone and language. See live message preview before sending.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* Tone Selector */}
            <div>
              <div className="text-[11px] font-semibold text-[#5A6B66] mb-1.5">Reminder Tone</div>
              <div className="grid grid-cols-3 p-1 rounded-xl bg-[#EAF1EE] text-xs font-medium text-center">
                {(["polite", "firm", "funny"] as ReminderTone[]).map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setRemindTone(tone)}
                    className={`py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                      remindTone === tone
                        ? "bg-white text-[#0B1A17] font-bold shadow-sm"
                        : "text-[#5A6B66] hover:text-[#0B1A17]"
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <div className="text-[11px] font-semibold text-[#5A6B66] mb-1.5">Language</div>
              <div className="grid grid-cols-3 p-1 rounded-xl bg-[#EAF1EE] text-xs font-medium text-center">
                {(["en", "hi", "hinglish"] as ReminderLang[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setRemindLang(l)}
                    className={`py-1.5 rounded-lg uppercase transition-all cursor-pointer ${
                      remindLang === l
                        ? "bg-white text-[#0B1A17] font-bold shadow-sm"
                        : "text-[#5A6B66] hover:text-[#0B1A17]"
                    }`}
                  >
                    {l === "en" ? "English" : l === "hi" ? "Hindi" : "Hinglish"}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Message Preview */}
            <div>
              <div className="text-[11px] font-semibold text-[#5A6B66] mb-1">Message Preview</div>
              <div className="p-3 rounded-xl border border-[#E4ECE8] bg-[#F7FAF8] text-xs font-mono text-[#0B1A17] whitespace-pre-wrap leading-relaxed select-all">
                {previewMessage}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={sendWhatsAppReminder}
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold h-11 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <UL0Icon name="whatsapp" size={16} />
                  <span>Open WhatsApp</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={copyReminderMessage}
                  className="h-11 px-4 border-[#D5E0DB] text-xs rounded-xl cursor-pointer"
                >
                  <UL0Icon name="copy" size={14} />
                </Button>
              </div>

              <Button
                type="button"
                onClick={sendBotReminder}
                disabled={isSendingBotReminder}
                className="w-full bg-[#1B685C] hover:bg-[#145248] text-white font-bold h-11 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <span>{isSendingBotReminder ? "Dispatching..." : "Send via Telegram & Email Bot (1 per 24 hrs)"}</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-white border-[#E4ECE8] text-[#0B1A17] max-w-sm p-6 rounded-2xl shadow-xl">
          <DialogHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-[#FF8A7A]/20 text-[#B3261E] mx-auto flex items-center justify-center mb-2">
              <UL0Icon name="trash" size={24} />
            </div>
            <DialogTitle className="text-lg font-bold text-[#0B1A17]">Delete this Split?</DialogTitle>
            <DialogDescription className="text-xs text-[#5A6B66]">
              This action cannot be undone. The settle link will stop working for all friends.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 h-10 border-[#D5E0DB] text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-[#B3261E] hover:bg-[#992019] text-white text-xs h-10 rounded-xl font-bold"
            >
              {isDeleting ? "Deleting..." : "Delete Split"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
