"use client"

import { useState, useEffect, useId, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import QRCode from "qrcode"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { UL0Icon } from "@/components/ul0-icon"
import {
  CATEGORY_PRESETS,
  EXPIRY_OPTIONS,
  distributeWithLargestRemainder,
  buildReminderMessage,
  ReminderTone,
  ReminderLang,
} from "./split-constants"

interface Friend {
  id: string
  name: string
  customAmount?: number
  percent?: number
  shares?: number
}

interface ItemEntry {
  id: string
  name: string
  price: number
  qty?: number
  sharedBy: string[]
}

interface RecentSplit {
  slug: string
  title: string
  totalAmount: number
  createdAt: string
  collectorToken?: string
}

type SplitMode = "equal" | "items" | "exact" | "percent" | "shares"

export function SplitWizard() {
  const router = useRouter()
  const { user } = useUser()
  const baseId = useId()
  const collectorId = `collector-${baseId}`

  // Step state: 0 = Dashboard (Screenshot 1), 1 = "How much?" (Screenshot 2), 2 = "Who's in?", 3 = "Split it" (Screenshot 3), 4 = "Looks right?" (Screenshot 4)
  const [step, setStep] = useState<number>(0)

  // Step 1: Amount & Title & Category
  const [totalAmountStr, setTotalAmountStr] = useState<string>("500")
  const [title, setTitle] = useState<string>("Dinner at Truffles")
  const [category, setCategory] = useState<string>("Food")
  const [billType, setBillType] = useState<"full" | "itemized">("full")

  // Collector (You)
  const [collectorName, setCollectorName] = useState<string>(user?.firstName || "Saket")
  const [collectorUpi, setCollectorUpi] = useState<string>("")
  const [isEditingCollector, setIsEditingCollector] = useState<boolean>(false)
  const [hasSavedCollector, setHasSavedCollector] = useState<boolean>(false)

  // Friends
  const [friends, setFriends] = useState<Friend[]>([
    { id: "f-1", name: "Om Bisht Cse", shares: 1, percent: 50 },
  ])
  const [friendInput, setFriendInput] = useState<string>("")
  const [includeCollector, setIncludeCollector] = useState<boolean>(true)

  // Split mode
  const [splitMode, setSplitMode] = useState<SplitMode>("equal")

  // Itemized bill (e.g. groceries, dining items)
  const [items, setItems] = useState<ItemEntry[]>([
    { id: "item-1", name: "Burgers & Fries", price: 350, qty: 1, sharedBy: [collectorId, "f-1"] },
    { id: "item-2", name: "Beverages", price: 150, qty: 1, sharedBy: [collectorId, "f-1"] },
  ])
  const [newItemName, setNewItemName] = useState<string>("")
  const [newItemPrice, setNewItemPrice] = useState<string>("")
  const [newItemQty, setNewItemQty] = useState<string>("1")
  const [taxPercent, setTaxPercent] = useState<string>("5")
  const [serviceChargePercent, setServiceChargePercent] = useState<string>("0")

  // Step 4 Options (Looks right?)
  const [note, setNote] = useState<string>("")
  const [autoRemindDays, setAutoRemindDays] = useState<number | null>(null)
  const [payByOption, setPayByOption] = useState<string | null>(null)
  const [isSavedTemplate, setIsSavedTemplate] = useState<boolean>(false)
  const [expiryDays, setExpiryDays] = useState<number>(30)
  const [locale, setLocale] = useState<"en" | "hi">("en")

  // Image backdrop & icon
  const [bannerUrl, setBannerUrl] = useState<string>("")
  const [iconUrl, setIconUrl] = useState<string>("")
  const [isUploadingBanner, setIsUploadingBanner] = useState<boolean>(false)

  // Recent splits on this device
  const [recentSplits, setRecentSplits] = useState<RecentSplit[]>([])

  // Spin the Bottle (Dice Modal)
  const [showSpinBottle, setShowSpinBottle] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)
  const [spinWinner, setSpinWinner] = useState<string | null>(null)

  // QR Scanner Modal
  const [showQrScanner, setShowQrScanner] = useState<boolean>(false)

  // Submitting & Share Dialog
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const [collectorToken, setCollectorToken] = useState<string | null>(null)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const [copiedManageLink, setCopiedManageLink] = useState<boolean>(false)
  const [reminderTone, setReminderTone] = useState<ReminderTone>("polite")
  const [reminderLang, setReminderLang] = useState<ReminderLang>("en")

  // Load saved collector profile & recent splits from localStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem("ul0_split_collector_name")
      const savedUpi = localStorage.getItem("ul0_split_collector_upi")
      if (savedName && savedUpi) {
        setCollectorName(savedName)
        setCollectorUpi(savedUpi)
        setHasSavedCollector(true)
      } else {
        if (user?.firstName) setCollectorName(user.firstName)
        setIsEditingCollector(true)
      }

      const savedRecent = localStorage.getItem("ul0_recent_splits")
      if (savedRecent) {
        setRecentSplits(JSON.parse(savedRecent))
      }
    } catch {}
  }, [user])

  // Save collector profile to localStorage
  const saveCollectorDetails = (name: string, upi: string) => {
    try {
      localStorage.setItem("ul0_split_collector_name", name.trim())
      localStorage.setItem("ul0_split_collector_upi", upi.trim().toLowerCase())
      setHasSavedCollector(true)
      setIsEditingCollector(false)
    } catch {}
  }

  // Handle Image Upload for Split Banner
  const handleBannerUpload = async (file: File) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB")
      return
    }

    setIsUploadingBanner(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/groups/upload-image", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Image upload failed")
      setBannerUrl(data.url)
      toast.success("Split banner backdrop uploaded!")
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image")
    } finally {
      setIsUploadingBanner(false)
    }
  }

  // Add friend
  const handleAddFriends = () => {
    if (!friendInput.trim()) return
    const rawNames = friendInput
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (rawNames.length === 0) return

    const newFriends: Friend[] = rawNames.map((name, i) => ({
      id: `f-${Date.now()}-${i}`,
      name,
      shares: 1,
      percent: 0,
    }))

    setFriends((prev) => [...prev, ...newFriends])
    setFriendInput("")
  }

  const handleRemoveFriend = (id: string) => {
    if (friends.length <= 1) {
      toast.error("Keep at least one friend to split with")
      return
    }
    setFriends((prev) => prev.filter((f) => f.id !== id))
    setItems((prev) =>
      prev.map((it) => ({
        ...it,
        sharedBy: it.sharedBy.filter((mId) => mId !== id),
      }))
    )
  }

  // Itemized management
  const handleAddItem = () => {
    const trimmed = newItemName.trim()
    const parsedPrice = parseFloat(newItemPrice)
    const parsedQty = parseInt(newItemQty, 10) || 1
    if (!trimmed || isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Please enter item name and valid price")
      return
    }
    const allMemberIds = [
      ...(includeCollector ? [collectorId] : []),
      ...friends.map((f) => f.id),
    ]
    const itemTotal = parsedPrice * parsedQty
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: trimmed,
        price: itemTotal,
        qty: parsedQty,
        sharedBy: allMemberIds,
      },
    ])
    setNewItemName("")
    setNewItemPrice("")
    setNewItemQty("1")
  }

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const toggleItemMember = (itemId: string, memberId: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it
        const has = it.sharedBy.includes(memberId)
        return {
          ...it,
          sharedBy: has ? it.sharedBy.filter((id) => id !== memberId) : [...it.sharedBy, memberId],
        }
      })
    )
  }

  // All active members list
  const allMembers = useMemo(
    () => [
      { id: collectorId, name: `${collectorName.trim() || "You"} (you)` },
      ...friends.map((f) => ({ id: f.id, name: f.name })),
    ],
    [collectorId, collectorName, friends]
  )

  // Calculations with Largest-Remainder rounding
  const { calculatedTotal, friendShares, collectorShare } = useMemo(() => {
    let parsedTotal = parseFloat(totalAmountStr) || 0

    if (billType === "itemized") {
      const itemsSubtotal = items.reduce((sum, it) => sum + it.price, 0)
      const taxAmt = (itemsSubtotal * (parseFloat(taxPercent) || 0)) / 100
      const srvAmt = (itemsSubtotal * (parseFloat(serviceChargePercent) || 0)) / 100
      parsedTotal = itemsSubtotal + taxAmt + srvAmt

      // Item proportional allocation
      const memberSubtotals: Record<string, number> = {}
      allMembers.forEach((m) => {
        memberSubtotals[m.id] = 0
      })

      items.forEach((item) => {
        if (item.sharedBy.length > 0) {
          const perPerson = item.price / item.sharedBy.length
          item.sharedBy.forEach((mId) => {
            memberSubtotals[mId] = (memberSubtotals[mId] || 0) + perPerson
          })
        }
      })

      const rawSum = Object.values(memberSubtotals).reduce((a, b) => a + b, 0)
      const memberWeights = allMembers.map((m) =>
        rawSum > 0 ? (memberSubtotals[m.id] || 0) / rawSum : 1 / allMembers.length
      )

      const exactShares = distributeWithLargestRemainder(parsedTotal, memberWeights)
      let colShare = 0
      const fShares: Record<string, number> = {}

      allMembers.forEach((m, idx) => {
        if (m.id === collectorId) {
          colShare = exactShares[idx]
        } else {
          fShares[m.id] = exactShares[idx]
        }
      })

      return {
        calculatedTotal: parsedTotal,
        friendShares: fShares,
        collectorShare: colShare,
      }
    }

    if (splitMode === "equal") {
      const activeMembers = [
        ...(includeCollector ? [{ id: collectorId }] : []),
        ...friends.map((f) => ({ id: f.id })),
      ]
      const count = activeMembers.length
      if (count === 0) return { calculatedTotal: 0, friendShares: {}, collectorShare: 0 }

      const equalAllocations = distributeWithLargestRemainder(
        parsedTotal,
        activeMembers.map(() => 1)
      )

      let colShare = 0
      const fShares: Record<string, number> = {}

      activeMembers.forEach((m, idx) => {
        if (m.id === collectorId) {
          colShare = equalAllocations[idx]
        } else {
          fShares[m.id] = equalAllocations[idx]
        }
      })

      return {
        calculatedTotal: parsedTotal,
        friendShares: fShares,
        collectorShare: colShare,
      }
    }

    if (splitMode === "shares") {
      const memberIds = [
        ...(includeCollector ? [{ id: collectorId, shares: 1 }] : []),
        ...friends.map((f) => ({ id: f.id, shares: f.shares || 1 })),
      ]
      const weights = memberIds.map((m) => m.shares)
      const allocations = distributeWithLargestRemainder(parsedTotal, weights)

      let colShare = 0
      const fShares: Record<string, number> = {}

      memberIds.forEach((m, idx) => {
        if (m.id === collectorId) {
          colShare = allocations[idx]
        } else {
          fShares[m.id] = allocations[idx]
        }
      })

      return {
        calculatedTotal: parsedTotal,
        friendShares: fShares,
        collectorShare: colShare,
      }
    }

    if (splitMode === "percent") {
      const memberIds = [
        ...(includeCollector
          ? [{ id: collectorId, percent: 100 - friends.reduce((sum, f) => sum + (f.percent || 0), 0) }]
          : []),
        ...friends.map((f) => ({ id: f.id, percent: f.percent || 0 })),
      ]
      const weights = memberIds.map((m) => Math.max(0, m.percent))
      const allocations = distributeWithLargestRemainder(parsedTotal, weights)

      let colShare = 0
      const fShares: Record<string, number> = {}

      memberIds.forEach((m, idx) => {
        if (m.id === collectorId) {
          colShare = allocations[idx]
        } else {
          fShares[m.id] = allocations[idx]
        }
      })

      return {
        calculatedTotal: parsedTotal,
        friendShares: fShares,
        collectorShare: colShare,
      }
    }

    // Exact / Custom mode
    const fShares: Record<string, number> = {}
    let sum = 0
    friends.forEach((f) => {
      const amt = f.customAmount || 0
      fShares[f.id] = amt
      sum += amt
    })
    const colShare = includeCollector ? Math.max(0, parsedTotal - sum) : 0

    return {
      calculatedTotal: parsedTotal > 0 ? parsedTotal : sum,
      friendShares: fShares,
      collectorShare: colShare,
    }
  }, [
    totalAmountStr,
    billType,
    splitMode,
    includeCollector,
    collectorId,
    friends,
    items,
    taxPercent,
    serviceChargePercent,
    allMembers,
  ])

  // Spin the Bottle (Random Payer Picker)
  const handleSpinBottle = () => {
    if (friends.length === 0) {
      toast.error("Add at least one friend first")
      return
    }
    setSpinning(true)
    setSpinWinner(null)

    const candidates = [collectorName || "You", ...friends.map((f) => f.name)]
    let count = 0
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * candidates.length)
      setSpinWinner(candidates[randomIdx])
      count++
      if (count > 16) {
        clearInterval(interval)
        setSpinning(false)
        const finalWinner = candidates[Math.floor(Math.random() * candidates.length)]
        setSpinWinner(finalWinner)
        toast.success(`🎉 ${finalWinner} pays the bill!`)
      }
    }, 100)
  }

  // Create Split Session API Call
  const handleCreateSplit = async () => {
    const cleanTitle = title.trim() || "Split Bill"
    const cleanCollectorName = collectorName.trim() || "You"
    const cleanCollectorUpi = collectorUpi.trim().toLowerCase()

    if (!cleanCollectorUpi) {
      toast.error("Please enter your UPI ID so friends can pay you directly")
      setStep(2)
      setIsEditingCollector(true)
      return
    }

    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(cleanCollectorUpi)) {
      toast.error("Please enter a valid UPI handle (e.g. yourname@oksbi or 9876543210@paytm)")
      setStep(2)
      setIsEditingCollector(true)
      return
    }

    if (calculatedTotal <= 0) {
      toast.error("Total amount must be greater than 0")
      setStep(1)
      return
    }

    saveCollectorDetails(cleanCollectorName, cleanCollectorUpi)
    setIsSubmitting(true)

    try {
      const membersPayload = [
        {
          id: collectorId,
          name: cleanCollectorName,
          paymentMethod: "upi",
          paymentId: cleanCollectorUpi,
          upiId: cleanCollectorUpi,
        },
        ...friends.map((f) => ({
          id: f.id,
          name: f.name.trim(),
          paymentMethod: "upi",
          paymentId: "",
          upiId: "",
        })),
      ]

      const settlementsPayload = friends
        .map((f) => ({
          from: f.id,
          to: collectorId,
          amount: Math.round((friendShares[f.id] || 0) * 100) / 100,
          status: "unpaid",
        }))
        .filter((s) => s.amount > 0)

      const expenseSplits = [
        ...(includeCollector && collectorShare > 0
          ? [{ memberId: collectorId, amount: Math.round(collectorShare * 100) / 100 }]
          : []),
        ...friends.map((f) => ({
          memberId: f.id,
          amount: Math.round((friendShares[f.id] || 0) * 100) / 100,
        })),
      ]

      const expensesPayload = [
        {
          id: `exp-${Date.now()}`,
          title: cleanTitle,
          amount: Math.round(calculatedTotal * 100) / 100,
          paidBy: collectorId,
          date: new Date().toISOString().split("T")[0],
          splitType: splitMode === "equal" ? "equal" : "custom",
          splits: expenseSplits,
        },
      ]

      // Pay by deadline calculation
      let calculatedPayBy: string | null = null
      if (payByOption) {
        const d = new Date()
        if (payByOption === "3days") d.setDate(d.getDate() + 3)
        else if (payByOption === "sunday") {
          const day = d.getDay()
          const diff = d.getDate() + (7 - day) % 7
          d.setDate(diff)
        } else if (payByOption === "week") d.setDate(d.getDate() + 7)
        else if (payByOption === "month") {
          d.setMonth(d.getMonth() + 1, 0)
        }
        calculatedPayBy = d.toISOString()
      }

      const res = await fetch("/api/split/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          currency: "INR",
          members: membersPayload,
          expenses: expensesPayload,
          settlements: settlementsPayload,
          totalAmount: Math.round(calculatedTotal * 100) / 100,
          expiryDays,
          payBy: calculatedPayBy,
          locale,
          bannerUrl: bannerUrl.trim() || undefined,
          iconUrl: iconUrl.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create split")

      setCreatedSlug(data.slug)
      setCollectorToken(data.collectorToken)

      // Save token in localStorage
      try {
        localStorage.setItem(`ul0_split_token_${data.slug}`, data.collectorToken)
        const updatedRecent: RecentSplit[] = [
          {
            slug: data.slug,
            title: cleanTitle,
            totalAmount: Math.round(calculatedTotal * 100) / 100,
            createdAt: new Date().toISOString(),
            collectorToken: data.collectorToken,
          },
          ...recentSplits.filter((s) => s.slug !== data.slug).slice(0, 9),
        ]
        setRecentSplits(updatedRecent)
        localStorage.setItem("ul0_recent_splits", JSON.stringify(updatedRecent))
      } catch {}

      // Generate QR
      const settleUrl = `${window.location.origin}/split/${data.slug}`
      const qr = await QRCode.toDataURL(settleUrl, {
        width: 320,
        margin: 2,
        color: { dark: "#0B1A17", light: "#FFFFFF" },
      })
      setQrCodeData(qr)

      toast.success("Split created! Share link with friends.")
    } catch (err: any) {
      toast.error(err.message || "Failed to create split")
    } finally {
      setIsSubmitting(false)
    }
  }

  const settleUrl = createdSlug
    ? `${typeof window !== "undefined" ? window.location.origin : "https://ul0.site"}/split/${createdSlug}`
    : ""
  const manageUrl = createdSlug && collectorToken
    ? `${typeof window !== "undefined" ? window.location.origin : "https://ul0.site"}/split/${createdSlug}/manage?token=${collectorToken}`
    : ""

  // =========================================================================
  // SCREEN 1: SPLITS DASHBOARD (Empty state or recent splits)
  // =========================================================================
  if (step === 0) {
    const greetingName = user?.firstName || collectorName || "Friend"

    return (
      <div className="relative min-h-[80vh] flex flex-col justify-between max-w-md mx-auto w-full px-4 py-6 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6">
          <div>
            <span className="text-xs font-semibold text-[#5A6B66] block">Hi {greetingName}</span>
            <h1 className="text-3xl font-extrabold text-[#0B1A17] tracking-tight">Splits</h1>
          </div>
          <button
            onClick={() => setShowQrScanner(true)}
            className="w-11 h-11 rounded-2xl border border-[#E4ECE8] bg-white flex items-center justify-center text-[#0B1A17] hover:bg-[#F7FAF8] shadow-xs cursor-pointer transition-transform active:scale-95"
            aria-label="Scan QR Code"
          >
            <UL0Icon name="qr" size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center items-center py-10">
          {recentSplits.length === 0 ? (
            // Empty State (Screenshot 1)
            <div className="text-center space-y-4 max-w-xs mx-auto animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF7F3] border border-[#CCD9D4] text-[#0B7A66] mx-auto flex items-center justify-center">
                <UL0Icon name="splitbill" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0B1A17]">No splits yet</h2>
                <p className="text-xs text-[#5A6B66] mt-1.5 leading-relaxed">
                  Create one in under 15 seconds. Your friends pay from a link, no app, no signup.
                </p>
              </div>
            </div>
          ) : (
            // Recent Splits List
            <div className="w-full space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5A6B66] px-1">
                <span>Recent Splits</span>
                <span className="text-[11px] font-normal">{recentSplits.length} splits saved</span>
              </div>
              {recentSplits.map((sp) => (
                <div
                  key={sp.slug}
                  onClick={() => router.push(`/split/${sp.slug}`)}
                  className="p-4 rounded-2xl border border-[#E4ECE8] bg-white hover:border-[#0B7A66]/40 shadow-xs cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF7F3] text-[#0B7A66] flex items-center justify-center font-bold text-sm">
                      <UL0Icon name="splitbill" size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0B1A17]">{sp.title}</h3>
                      <p className="text-[11px] text-[#5A6B66]">
                        {new Date(sp.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#0B1A17] block">
                      ₹{sp.totalAmount.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#0B7A66] font-semibold">Open Settle →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Bottom Action Buttons (Screenshot 1) */}
        <div className="flex items-center justify-between pt-6 pb-2">
          {/* Spin the Bottle (Dice Button) */}
          <button
            onClick={() => setShowSpinBottle(true)}
            className="w-14 h-14 rounded-full border border-[#E4ECE8] bg-white text-[#0B1A17] flex items-center justify-center shadow-md hover:bg-[#F7FAF8] active:scale-95 transition-all cursor-pointer"
            title="Spin the bottle (who pays?)"
          >
            <span className="text-2xl">🎲</span>
          </button>

          {/* Big Black Circle + Button */}
          <button
            onClick={() => setStep(1)}
            className="w-16 h-16 rounded-full bg-[#0B1A17] text-white flex items-center justify-center shadow-xl hover:bg-[#1a2e2a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Create new split"
          >
            <UL0Icon name="plus" size={28} />
          </button>
        </div>

        {/* Bottom Tab Bar */}
        <div className="pt-4 border-t border-[#E4ECE8] flex items-center justify-around text-[#5A6B66]">
          <button className="flex flex-col items-center gap-1 text-[#0B1A17] font-semibold text-[10px]">
            <UL0Icon name="splitbill" size={18} />
            <span>Splits</span>
          </button>
          <button
            onClick={() => router.push("/split/groups")}
            className="flex flex-col items-center gap-1 hover:text-[#0B1A17] text-[10px] transition-colors"
          >
            <UL0Icon name="billing" size={18} />
            <span>Khata</span>
          </button>
          <button
            onClick={() => setShowQrScanner(true)}
            className="flex flex-col items-center gap-1 hover:text-[#0B1A17] text-[10px] transition-colors"
          >
            <UL0Icon name="qr" size={18} />
            <span>Collect</span>
          </button>
        </div>

        {/* Spin the Bottle Modal */}
        <Dialog open={showSpinBottle} onOpenChange={setShowSpinBottle}>
          <DialogContent className="max-w-sm bg-white border border-[#E4ECE8] text-[#0B1A17] p-6 rounded-3xl">
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-bold flex items-center justify-center gap-2">
                <span>🎲</span> Spin the Bottle
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5A6B66]">
                Randomly pick who covers the bill this time!
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 flex flex-col items-center justify-center space-y-4">
              <div
                className={`w-28 h-28 rounded-full border-4 border-[#0B7A66] bg-[#EAF7F3] flex items-center justify-center text-3xl font-extrabold text-[#0B7A66] shadow-inner transition-transform duration-300 ${
                  spinning ? "animate-spin" : ""
                }`}
              >
                {spinning ? "🎲" : spinWinner ? spinWinner.slice(0, 2).toUpperCase() : "🍾"}
              </div>

              {spinWinner && !spinning && (
                <div className="text-center animate-in zoom-in-90 duration-200">
                  <span className="text-xs font-semibold text-[#5A6B66] block">The Chosen One:</span>
                  <span className="text-2xl font-black text-[#0B1A17] mt-0.5 block">
                    {spinWinner}
                  </span>
                </div>
              )}

              <Button
                onClick={handleSpinBottle}
                disabled={spinning}
                className="w-full bg-[#0B1A17] hover:bg-[#1a2e2a] text-white text-xs h-11 rounded-xl font-bold cursor-pointer"
              >
                {spinning ? "Spinning..." : spinWinner ? "Spin Again" : "Spin the Bottle!"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* QR Scanner Modal */}
        <Dialog open={showQrScanner} onOpenChange={setShowQrScanner}>
          <DialogContent className="max-w-sm bg-white border border-[#E4ECE8] text-[#0B1A17] p-6 rounded-3xl text-center">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Scan UPI QR or Receipt</DialogTitle>
              <DialogDescription className="text-xs text-[#5A6B66]">
                Scan merchant or personal QR codes to auto-populate the split.
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 flex flex-col items-center space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-[#F7FAF8] border-2 border-dashed border-[#CCD9D4] flex items-center justify-center text-[#5A6B66]">
                <UL0Icon name="qr" size={32} />
              </div>
              <p className="text-xs text-[#5A6B66] max-w-xs">
                Camera access available on mobile browsers. You can also pick an image from your photos.
              </p>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B7A66] text-white text-xs font-bold hover:bg-[#086353]">
                <UL0Icon name="upload" size={14} /> Upload QR Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={() => {
                    toast.info("QR image uploaded. Ready to split!")
                    setShowQrScanner(false)
                    setStep(1)
                  }}
                />
              </label>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // =========================================================================
  // STEP WIZARD CONTAINER (Screenshots 2, 3, 4)
  // =========================================================================
  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 font-sans">
      {/* 4-Step Progress Indicator Header */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#0B1A17] hover:bg-[#EAF1EE] cursor-pointer"
              aria-label="Back"
            >
              <UL0Icon name="chevron-left" size={18} />
            </button>
          ) : (
            <div className="w-8" />
          )}

          {/* 4 Progress Segment Bars */}
          <div className="flex-1 max-w-[200px] flex gap-1.5 px-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-[#0B1A17]" : "bg-[#E4ECE8]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setStep(0)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#5A6B66] hover:text-[#0B1A17] hover:bg-[#EAF1EE] cursor-pointer"
            aria-label="Close"
          >
            <UL0Icon name="cross" size={16} />
          </button>
        </div>
      </div>

      {/* =====================================================================
          STEP 1: "How much?" (Screenshot 2)
      ====================================================================== */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0B1A17] tracking-tight">How much?</h2>
          </div>

          {/* Currency dropdown + Big Amount */}
          <div className="pt-2">
            <div className="flex items-baseline gap-2 border-b-2 border-[#0B1A17] pb-2">
              <span className="text-3xl font-bold text-[#0B1A17]">₹</span>
              <input
                type="number"
                inputMode="decimal"
                value={totalAmountStr}
                onChange={(e) => setTotalAmountStr(e.target.value)}
                placeholder="0"
                className="w-full text-5xl font-extrabold text-[#0B1A17] bg-transparent focus:outline-none tracking-tight"
                autoFocus
              />
            </div>

            {/* Quick Amount Pills */}
            <div className="flex gap-2.5 mt-4">
              {[500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTotalAmountStr(String(amt))}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                    parseFloat(totalAmountStr) === amt
                      ? "border-[#0B1A17] bg-[#0B1A17] text-white"
                      : "border-[#E4ECE8] bg-white text-[#0B1A17] hover:bg-[#F7FAF8]"
                  }`}
                >
                  ₹{amt.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>

          {/* What's it for? */}
          <div className="space-y-3 pt-2">
            <Label className="text-xs font-bold text-[#0B1A17]">What&apos;s it for?</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dinner at Truffles"
              className="h-12 rounded-xl border-[#E4ECE8] text-sm text-[#0B1A17] focus-visible:ring-[#0B1A17]"
            />

            {/* Category Pills (Screenshot 2) */}
            <div className="flex flex-wrap gap-2 pt-1">
              {CATEGORY_PRESETS.map((cat) => {
                const isActive = category === cat.label
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => {
                      setCategory(cat.label)
                      if (!title || title === "Dinner at Truffles") {
                        setTitle(cat.title)
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#0B1A17] text-white shadow-xs"
                        : "bg-white border border-[#E4ECE8] text-[#0B1A17] hover:bg-[#F7FAF8]"
                    }`}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bill Mode Toggle: Full vs Itemized (Groceries / Receipts) */}
          <div className="pt-2">
            <div className="p-1 rounded-xl bg-[#EAF1EE] flex text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillType("full")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  billType === "full" ? "bg-white text-[#0B1A17] shadow-xs" : "text-[#5A6B66]"
                }`}
              >
                Entire Bill
              </button>
              <button
                type="button"
                onClick={() => setBillType("itemized")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  billType === "itemized" ? "bg-white text-[#0B1A17] shadow-xs" : "text-[#5A6B66]"
                }`}
              >
                Item-wise (Groceries / Items)
              </button>
            </div>

            {/* Itemized details if selected */}
            {billType === "itemized" && (
              <div className="mt-4 p-4 rounded-2xl border border-[#E4ECE8] bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B1A17]">Itemized Breakdown</span>
                  <span className="text-[11px] text-[#0B7A66] font-semibold">
                    Total: ₹{calculatedTotal.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#F7FAF8] text-xs border border-[#E4ECE8]"
                    >
                      <div>
                        <span className="font-semibold text-[#0B1A17] block">{it.name}</span>
                        <span className="text-[10px] text-[#5A6B66]">
                          ₹{it.price} • Shared by {it.sharedBy.length} people
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="text-[#D9383A] hover:opacity-80 p-1"
                      >
                        <UL0Icon name="trash" size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Item Row */}
                <div className="flex gap-2 pt-1">
                  <Input
                    placeholder="Item name (e.g. Milk, Bread)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <Input
                    placeholder="Price (₹)"
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="h-9 text-xs w-24"
                  />
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    className="h-9 bg-[#0B7A66] text-white text-xs px-3 rounded-lg font-bold"
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA Button (Screenshot 2) */}
          <div className="pt-6">
            <Button
              type="button"
              disabled={parseFloat(totalAmountStr) <= 0}
              onClick={() => setStep(2)}
              className="w-full h-13 rounded-2xl bg-[#0B1A17] hover:bg-[#1a2e2a] disabled:bg-[#CCD9D4] text-white text-sm font-bold shadow-md cursor-pointer transition-all"
            >
              Who&apos;s in?
            </Button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 2: "Who's in?"
      ====================================================================== */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0B1A17] tracking-tight">Who&apos;s in?</h2>
            <p className="text-xs text-[#5A6B66] mt-1">
              Add your friends. They won&apos;t need to sign up to pay.
            </p>
          </div>

          {/* Collector Details Box */}
          <div className="p-4 rounded-2xl border border-[#CCD9D4] bg-[#EAF7F3]/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B7A66]">You (Collector)</span>
              <button
                type="button"
                onClick={() => setIsEditingCollector(!isEditingCollector)}
                className="text-[11px] font-semibold text-[#0B7A66] underline cursor-pointer"
              >
                {isEditingCollector ? "Save" : "Edit UPI"}
              </button>
            </div>

            {isEditingCollector ? (
              <div className="space-y-2 pt-1">
                <Input
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  placeholder="Your Name (e.g. Saket)"
                  className="h-9 text-xs bg-white"
                />
                <Input
                  value={collectorUpi}
                  onChange={(e) => setCollectorUpi(e.target.value)}
                  placeholder="Your UPI ID (e.g. saket@oksbi)"
                  className="h-9 text-xs font-mono bg-white"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0B1A17]">{collectorName}</span>
                <span className="font-mono text-[#5A6B66]">
                  {collectorUpi || "No UPI set (tap edit)"}
                </span>
              </div>
            )}
          </div>

          {/* Friend List & Input */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-[#0B1A17]">Friends</Label>
            <div className="flex gap-2">
              <Input
                value={friendInput}
                onChange={(e) => setFriendInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddFriends()
                  }
                }}
                placeholder="Friend name (or paste multiple names)"
                className="h-11 rounded-xl text-xs"
              />
              <Button
                type="button"
                onClick={handleAddFriends}
                className="h-11 px-4 rounded-xl bg-[#0B1A17] text-white text-xs font-bold"
              >
                Add
              </Button>
            </div>

            {/* Friend Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {friends.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E4ECE8] text-xs font-medium text-[#0B1A17] shadow-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-[#EAF7F3] text-[#0B7A66] font-bold text-[10px] flex items-center justify-center">
                    {f.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span>{f.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFriend(f.id)}
                    className="text-[#5A6B66] hover:text-[#D9383A] ml-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Preset Groups */}
            <div className="pt-2">
              <span className="text-[11px] text-[#5A6B66] block mb-1.5">Quick Add Preset Groups:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Roommates", names: ["Aman", "Rohan", "Pooja"] },
                  { label: "Trip Friends", names: ["Rahul", "Om", "Sneha"] },
                  { label: "Chai Gang", names: ["Vikram", "Neha"] },
                ].map((grp) => (
                  <button
                    key={grp.label}
                    type="button"
                    onClick={() => {
                      const newF: Friend[] = grp.names.map((name, i) => ({
                        id: `f-${Date.now()}-${i}`,
                        name,
                        shares: 1,
                      }))
                      setFriends(newF)
                      toast.success(`Loaded ${grp.label} group!`)
                    }}
                    className="px-2.5 py-1 rounded-lg border border-dashed border-[#CCD9D4] bg-[#F7FAF8] hover:bg-[#EAF7F3] text-[11px] text-[#0B7A66] font-medium transition-colors"
                  >
                    + {grp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="pt-6">
            <Button
              type="button"
              disabled={friends.length === 0}
              onClick={() => setStep(3)}
              className="w-full h-13 rounded-2xl bg-[#0B1A17] hover:bg-[#1a2e2a] text-white text-sm font-bold shadow-md cursor-pointer transition-all"
            >
              Split it
            </Button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 3: "Split it" (Screenshot 3)
      ====================================================================== */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-[#0B1A17] tracking-tight">Split it</h2>
            <span className="text-xl font-bold font-mono text-[#0B1A17]">
              ₹{calculatedTotal.toFixed(0)}
            </span>
          </div>

          {/* Mode Selector Segmented Pills (Screenshot 3) */}
          <div className="p-1 rounded-2xl bg-[#F1F5F3] flex text-xs font-semibold">
            {(["equal", "exact", "percent", "shares"] as SplitMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSplitMode(mode)}
                className={`flex-1 py-2 rounded-xl capitalize transition-all ${
                  splitMode === mode ? "bg-white text-[#0B1A17] shadow-xs font-bold" : "text-[#5A6B66]"
                }`}
              >
                {mode === "percent" ? "%" : mode}
              </button>
            ))}
          </div>

          {/* Member Share Cards (Screenshot 3) */}
          <div className="space-y-3">
            {/* Collector Card */}
            {includeCollector && (
              <div className="p-4 rounded-2xl border border-[#E4ECE8] bg-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0B1A17] text-white font-bold text-xs flex items-center justify-center">
                    {collectorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#0B1A17] block">
                      {collectorName} (you)
                    </span>
                    <span className="text-[11px] text-[#5A6B66]">Organizer</span>
                  </div>
                </div>
                <span className="text-base font-extrabold font-mono text-[#0B1A17]">
                  ₹{collectorShare.toFixed(0)}
                </span>
              </div>
            )}

            {/* Friend Cards */}
            {friends.map((f) => {
              const shareAmt = friendShares[f.id] || 0
              const initials = f.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()

              return (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl border border-[#E4ECE8] bg-white flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0B1A17] text-white font-bold text-xs flex items-center justify-center">
                      {initials}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#0B1A17] block">{f.name}</span>
                    </div>
                  </div>

                  {splitMode === "exact" ? (
                    <div className="w-24">
                      <Input
                        type="number"
                        value={f.customAmount || ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          setFriends((prev) =>
                            prev.map((item) => (item.id === f.id ? { ...item, customAmount: val } : item))
                          )
                        }}
                        className="h-9 text-xs text-right font-mono"
                        placeholder="0"
                      />
                    </div>
                  ) : (
                    <span className="text-base font-extrabold font-mono text-[#0B1A17]">
                      ₹{shareAmt.toFixed(0)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Primary CTA */}
          <div className="pt-6">
            <Button
              type="button"
              onClick={() => setStep(4)}
              className="w-full h-13 rounded-2xl bg-[#0B1A17] hover:bg-[#1a2e2a] text-white text-sm font-bold shadow-md cursor-pointer transition-all"
            >
              Review
            </Button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 4: "Looks right?" (Screenshot 4)
      ====================================================================== */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0B1A17] tracking-tight">Looks right?</h2>
          </div>

          {/* Summary Card (Screenshot 4) */}
          <div className="rounded-3xl border border-[#E4ECE8] bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F3]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EAF7F3] text-[#0B7A66] flex items-center justify-center text-xs font-bold">
                  <UL0Icon name="billing" size={14} />
                </div>
                <span className="text-base font-bold text-[#0B1A17]">{title || "Split"}</span>
              </div>
              <span className="text-lg font-black font-mono text-[#0B1A17]">
                ₹{calculatedTotal.toFixed(0)}
              </span>
            </div>

            {/* Member Breakdown Rows */}
            <div className="space-y-3">
              {includeCollector && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#0B1A17] text-white font-bold text-[10px] flex items-center justify-center">
                      {collectorName.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-[#0B1A17]">{collectorName} (you)</span>
                  </div>
                  <span className="font-mono font-bold text-[#0B1A17]">
                    ₹{collectorShare.toFixed(0)}
                  </span>
                </div>
              )}

              {friends.map((f) => {
                const initials = f.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()

                return (
                  <div key={f.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#0B1A17] text-white font-bold text-[10px] flex items-center justify-center">
                        {initials}
                      </div>
                      <span className="font-semibold text-[#0B1A17]">{f.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[#0B1A17]">
                      ₹{(friendShares[f.id] || 0).toFixed(0)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Note (optional) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#0B1A17]">Note (optional)</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Table 12, birthday dinner"
              className="h-11 rounded-xl text-xs"
            />
          </div>

          {/* Auto-remind if unpaid (Screenshot 4) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UL0Icon name="bell" size={14} className="text-[#0B1A17]" />
              <span className="text-xs font-bold text-[#0B1A17]">Auto-remind if unpaid</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "After 2 days", days: 2 },
                { label: "After 3 days", days: 3 },
                { label: "After 7 days", days: 7 },
              ].map((opt) => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setAutoRemindDays(autoRemindDays === opt.days ? null : opt.days)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                    autoRemindDays === opt.days
                      ? "bg-[#0B1A17] text-white"
                      : "bg-white border border-[#E4ECE8] text-[#0B1A17] hover:bg-[#F7FAF8]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#5A6B66] leading-relaxed">
              You get a nudge with the message ready, the app never texts your friends itself.
            </p>
          </div>

          {/* Pay-by date (Screenshot 4) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UL0Icon name="clock" size={14} className="text-[#0B1A17]" />
              <span className="text-xs font-bold text-[#0B1A17]">Pay-by date</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "In 3 days", val: "3days" },
                { label: "This Sunday", val: "sunday" },
                { label: "In a week", val: "week" },
                { label: "End of month", val: "month" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setPayByOption(payByOption === opt.val ? null : opt.val)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                    payByOption === opt.val
                      ? "bg-[#0B1A17] text-white"
                      : "bg-white border border-[#E4ECE8] text-[#0B1A17] hover:bg-[#F7FAF8]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#5A6B66] leading-relaxed">
              Friends see the date on their settle page, and nudges say when it is late.
            </p>
          </div>

          {/* Save as template */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setIsSavedTemplate(!isSavedTemplate)
                toast.success("Saved as template for future splits!")
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E4ECE8] bg-white text-xs font-semibold text-[#0B1A17] hover:bg-[#F7FAF8] cursor-pointer"
            >
              <UL0Icon name={isSavedTemplate ? "check" : "bookmark"} size={14} />
              <span>Save as template</span>
            </button>
          </div>

          {/* Backdrop Banner Image Upload (Free Image Host) */}
          <div className="p-3.5 rounded-2xl border border-[#E4ECE8] bg-[#F7FAF8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B1A17]">Backdrop Banner Image</span>
              <span className="text-[10px] text-[#5A6B66]">Free image upload</span>
            </div>
            <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#CCD9D4] bg-white hover:bg-[#EAF7F3]/40 cursor-pointer text-xs font-medium text-[#0B1A17] transition-colors">
              <UL0Icon name="upload" size={14} />
              <span>
                {isUploadingBanner ? "Uploading image..." : bannerUrl ? "Change Banner" : "Upload Hero Banner Backdrop"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleBannerUpload(f)
                }}
              />
            </label>
            {bannerUrl && (
              <p className="text-[11px] text-[#0B7A66] font-semibold">
                ✓ Banner attached! Will be shown as hero backdrop on settle page.
              </p>
            )}
          </div>

          {/* Primary CTA (Screenshot 4) */}
          <div className="pt-6">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleCreateSplit}
              className="w-full h-13 rounded-2xl bg-[#0B1A17] hover:bg-[#1a2e2a] text-white text-sm font-bold shadow-md cursor-pointer transition-all"
            >
              {isSubmitting ? "Creating split..." : "Create split"}
            </Button>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUCCESS SHARE SHEET DIALOG
      ====================================================================== */}
      <Dialog open={!!createdSlug} onOpenChange={(open) => !open && setCreatedSlug(null)}>
        <DialogContent className="max-w-md bg-white border border-[#E4ECE8] text-[#0B1A17] p-6 rounded-3xl">
          <DialogHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#EAF7F3] text-[#0B7A66] mx-auto flex items-center justify-center mb-2">
              <UL0Icon name="check" size={24} />
            </div>
            <DialogTitle className="text-xl font-bold">Split Link Ready!</DialogTitle>
            <DialogDescription className="text-xs text-[#5A6B66]">
              Friends tap the link, choose their name, and pay via any UPI app.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Settle Link Copy */}
            <div className="p-3 bg-[#F7FAF8] rounded-xl border border-[#E4ECE8] flex items-center justify-between">
              <span className="text-xs font-mono truncate text-[#0B1A17] max-w-[240px]">
                {settleUrl}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(settleUrl)
                  setCopiedLink(true)
                  toast.success("Link copied!")
                  setTimeout(() => setCopiedLink(false), 2000)
                }}
                className="text-xs h-8 px-3 rounded-lg border-[#CCD9D4] font-semibold"
              >
                {copiedLink ? "Copied!" : "Copy"}
              </Button>
            </div>

            {/* In-person QR code */}
            {qrCodeData && (
              <div className="flex flex-col items-center py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeData} alt="Split QR" className="w-40 h-40 rounded-xl border border-[#E4ECE8]" />
                <span className="text-[11px] text-[#5A6B66] mt-1.5">
                  Scan to settle right now
                </span>
              </div>
            )}

            {/* WhatsApp Share Button */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                buildReminderMessage({
                  friendName: "Friend",
                  amount: calculatedTotal,
                  title: title || "our bill",
                  url: settleUrl,
                  payBy: payByOption,
                  tone: reminderTone,
                  lang: reminderLang,
                })
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-colors"
            >
              Share on WhatsApp
            </a>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/split/${createdSlug}`)}
                className="h-10 text-xs rounded-xl border-[#CCD9D4] font-bold"
              >
                Open Settle Page
              </Button>
              <Button
                onClick={() => router.push(manageUrl)}
                className="h-10 text-xs rounded-xl bg-[#0B1A17] text-white font-bold"
              >
                Manage Split
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
