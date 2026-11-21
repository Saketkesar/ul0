"use client"

import { useState, useEffect, useId, useMemo } from "react"
import { useRouter } from "next/navigation"
import QRCode from "qrcode"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { UL0Icon } from "@/components/ul0-icon"
import {
  CATEGORY_PRESETS,
  COMMON_UPI_PROVIDERS,
  EXPIRY_OPTIONS,
  distributeWithLargestRemainder,
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
  sharedBy: string[]
}

type SplitMode = "equal" | "items" | "custom" | "percent" | "shares"

export function SplitWizard() {
  const router = useRouter()
  const baseId = useId()
  const collectorId = `collector-${baseId}`

  // State
  const [totalAmountStr, setTotalAmountStr] = useState<string>("1200")
  const [title, setTitle] = useState<string>("")
  const [collectorName, setCollectorName] = useState<string>("")
  const [collectorUpi, setCollectorUpi] = useState<string>("")
  const [isEditingCollector, setIsEditingCollector] = useState<boolean>(false)
  const [hasSavedCollector, setHasSavedCollector] = useState<boolean>(false)

  // Friends
  const [friends, setFriends] = useState<Friend[]>([
    { id: "f-1", name: "Rahul", shares: 1, percent: 33.33 },
    { id: "f-2", name: "Priya", shares: 1, percent: 33.33 },
  ])
  const [friendInput, setFriendInput] = useState<string>("")
  const [includeCollector, setIncludeCollector] = useState<boolean>(true)

  // Split mode
  const [splitMode, setSplitMode] = useState<SplitMode>("equal")

  // Itemized
  const [items, setItems] = useState<ItemEntry[]>([
    { id: "item-1", name: "Starters", price: 450, sharedBy: [collectorId, "f-1", "f-2"] },
    { id: "item-2", name: "Main Course", price: 750, sharedBy: [collectorId, "f-1"] },
  ])
  const [newItemName, setNewItemName] = useState<string>("")
  const [newItemPrice, setNewItemPrice] = useState<string>("")
  const [taxPercent, setTaxPercent] = useState<string>("5")
  const [serviceChargePercent, setServiceChargePercent] = useState<string>("0")

  // Options
  const [showOptions, setShowOptions] = useState<boolean>(false)
  const [payByDate, setPayByDate] = useState<string>("")
  const [expiryDays, setExpiryDays] = useState<number>(30)
  const [locale, setLocale] = useState<"en" | "hi">("en")

  // Creation State & Share Sheet
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const [collectorToken, setCollectorToken] = useState<string | null>(null)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const [copiedManageLink, setCopiedManageLink] = useState<boolean>(false)

  // Load remembered collector from localStorage & restore draft from sessionStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem("ul0_split_collector_name")
      const savedUpi = localStorage.getItem("ul0_split_collector_upi")
      if (savedName && savedUpi) {
        setCollectorName(savedName)
        setCollectorUpi(savedUpi)
        setHasSavedCollector(true)
      } else {
        setIsEditingCollector(true)
      }

      // Check draft in sessionStorage
      const draft = sessionStorage.getItem("ul0_split_draft")
      if (draft) {
        const parsed = JSON.parse(draft)
        if (parsed.totalAmountStr) setTotalAmountStr(parsed.totalAmountStr)
        if (parsed.title) setTitle(parsed.title)
        if (parsed.friends && Array.isArray(parsed.friends)) setFriends(parsed.friends)
        if (parsed.splitMode) setSplitMode(parsed.splitMode)
        sessionStorage.removeItem("ul0_split_draft")
      }
    } catch {}
  }, [])

  // Save collector profile to localStorage
  const saveCollectorDetails = (name: string, upi: string) => {
    try {
      localStorage.setItem("ul0_split_collector_name", name.trim())
      localStorage.setItem("ul0_split_collector_upi", upi.trim().toLowerCase())
      setHasSavedCollector(true)
      setIsEditingCollector(false)
    } catch {}
  }

  const forgetCollectorDetails = () => {
    try {
      localStorage.removeItem("ul0_split_collector_name")
      localStorage.removeItem("ul0_split_collector_upi")
      setCollectorName("")
      setCollectorUpi("")
      setHasSavedCollector(false)
      setIsEditingCollector(true)
      toast.info("Cleared remembered details from this device.")
    } catch {}
  }

  // Add friend (supports comma or newline separation)
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

  // Items handling
  const handleAddItem = () => {
    const trimmed = newItemName.trim()
    const parsedPrice = parseFloat(newItemPrice)
    if (!trimmed || isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Please enter item name and valid price")
      return
    }
    const allMemberIds = [
      ...(includeCollector ? [collectorId] : []),
      ...friends.map((f) => f.id),
    ]
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: trimmed,
        price: parsedPrice,
        sharedBy: allMemberIds,
      },
    ])
    setNewItemName("")
    setNewItemPrice("")
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

  // All members list
  const allMembers = useMemo(
    () => [
      { id: collectorId, name: collectorName.trim() || "You" },
      ...friends.map((f) => ({ id: f.id, name: f.name })),
    ],
    [collectorId, collectorName, friends]
  )

  // Calculations with Largest-Remainder rounding
  const { calculatedTotal, friendShares, collectorShare } = useMemo(() => {
    const parsedTotal = parseFloat(totalAmountStr) || 0

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

    if (splitMode === "items") {
      const itemsSubtotal = items.reduce((sum, it) => sum + (it.price || 0), 0)
      const rawWeights: Record<string, number> = { [collectorId]: 0 }
      friends.forEach((f) => {
        rawWeights[f.id] = 0
      })

      items.forEach((it) => {
        const eaters = it.sharedBy.length
        if (eaters > 0) {
          const each = it.price / eaters
          it.sharedBy.forEach((mId) => {
            rawWeights[mId] = (rawWeights[mId] || 0) + each
          })
        }
      })

      const taxRate = (parseFloat(taxPercent) || 0) / 100
      const scRate = (parseFloat(serviceChargePercent) || 0) / 100
      const grandTotal = itemsSubtotal * (1 + taxRate + scRate)

      const memberIds = [
        ...(includeCollector ? [collectorId] : []),
        ...friends.map((f) => f.id),
      ]
      const weights = memberIds.map((id) => rawWeights[id] || 0)
      const allocations = distributeWithLargestRemainder(grandTotal, weights)

      let colShare = 0
      const fShares: Record<string, number> = {}

      memberIds.forEach((id, idx) => {
        if (id === collectorId) {
          colShare = allocations[idx]
        } else {
          fShares[id] = allocations[idx]
        }
      })

      return {
        calculatedTotal: Math.round(grandTotal * 100) / 100,
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
        ...(includeCollector ? [{ id: collectorId, percent: 100 - friends.reduce((sum, f) => sum + (f.percent || 0), 0) }] : []),
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

    // Custom mode
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
    splitMode,
    includeCollector,
    collectorId,
    friends,
    items,
    taxPercent,
    serviceChargePercent,
  ])

  // Submit & create split
  const handleCreateSplit = async () => {
    const cleanTitle = title.trim() || "Split Bill"
    const cleanCollectorName = collectorName.trim()
    const cleanCollectorUpi = collectorUpi.trim().toLowerCase()

    if (!cleanCollectorName) {
      toast.error("Please enter your name")
      setIsEditingCollector(true)
      return
    }

    if (!cleanCollectorUpi) {
      toast.error("Please enter your UPI ID so friends can pay you")
      setIsEditingCollector(true)
      return
    }

    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(cleanCollectorUpi)) {
      toast.error("Please enter a valid UPI handle (e.g. yourname@oksbi or 9876543210@paytm)")
      setIsEditingCollector(true)
      return
    }

    if (friends.length === 0) {
      toast.error("Add at least one friend to split with")
      return
    }

    if (calculatedTotal <= 0) {
      toast.error("Total amount must be greater than 0")
      return
    }

    // Save collector to localStorage
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
          payBy: payByDate ? new Date(payByDate).toISOString() : null,
          locale,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.errors?.[0]?.message || "Failed to create split")
      }

      setCreatedSlug(data.slug)
      setCollectorToken(data.collectorToken)

      // Store token in localStorage
      try {
        localStorage.setItem(`ul0_split_token_${data.slug}`, data.collectorToken)
      } catch {}

      // Generate QR Code
      const settleUrl = `${window.location.origin}/split/${data.slug}`
      const qr = await QRCode.toDataURL(settleUrl, {
        width: 320,
        margin: 2,
        color: { dark: "#0B1A17", light: "#FFFFFF" },
      })
      setQrCodeData(qr)

      toast.success("Split link ready! Share it with friends.")
    } catch (err: any) {
      toast.error(err.message || "Failed to create split. Please try again.")
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

  const copySettleLink = async () => {
    if (!settleUrl) return
    await navigator.clipboard.writeText(settleUrl)
    setCopiedLink(true)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const copyManageLink = async () => {
    if (!manageUrl) return
    await navigator.clipboard.writeText(manageUrl)
    setCopiedManageLink(true)
    toast.success("Private manage link copied!")
    setTimeout(() => setCopiedManageLink(false), 2000)
  }

  const shareWhatsApp = () => {
    if (!settleUrl) return
    const msg = encodeURIComponent(
      `Hey! Here's the split for *${title.trim() || "our bill"}* (Total: ₹${calculatedTotal.toFixed(2)}).\n\nTap your name to pay directly via UPI:\n${settleUrl}`
    )
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto w-full">
      {/* Main Single-Column Wizard */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-[#E4ECE8] bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(10,30,26,0.06)] space-y-6">
          <div className="border-b border-[#E4ECE8] pb-4">
            <span className="text-[11px] font-bold text-[#0B7A66] uppercase tracking-wider block mb-1">
              New Bill Split
            </span>
            <h2 className="text-2xl font-black text-[#0B1A17] tracking-tight">
              Split with friends over UPI
            </h2>
          </div>

          {/* 1. Amount & Title */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="bill-amount" className="text-xs font-semibold text-[#5A6B66]">
                1. How much was the bill?
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-[#5A6B66] font-mono">
                  ₹
                </span>
                <input
                  id="bill-amount"
                  type="number"
                  inputMode="decimal"
                  value={totalAmountStr}
                  onChange={(e) => setTotalAmountStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-16 pl-10 pr-4 text-3xl font-black font-mono text-[#0B1A17] bg-[#F7FAF8] rounded-[16px] border border-[#E4ECE8] focus:border-[#3DDBB8] focus:ring-3 focus:ring-[#3DDBB8]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bill-title" className="text-xs font-semibold text-[#5A6B66]">
                What was it for?
              </Label>
              <Input
                id="bill-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dinner at Toit, Goa Trip, Cab Fare"
                className="mt-1 h-12 text-sm bg-white border-[#E4ECE8] text-[#0B1A17] rounded-[14px] focus:border-[#3DDBB8] focus:ring-2 focus:ring-[#3DDBB8]/20"
              />

              {/* Clean category icon chips (NO emojis) */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {CATEGORY_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setTitle(preset.title)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#EAF1EE] hover:bg-[#DDF5EE] text-[#0B1A17] font-medium transition-colors cursor-pointer"
                  >
                    <UL0Icon name={preset.icon} size={14} />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. People & Collector Info */}
          <div className="space-y-4 pt-4 border-t border-[#E4ECE8]">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-[#5A6B66]">
                2. Who's in the bill?
              </Label>
              <span className="text-[11px] text-[#5A6B66]">
                {friends.length + (includeCollector ? 1 : 0)} people
              </span>
            </div>

            {/* Collector Card (Remembered in localStorage) */}
            <div className="p-3.5 rounded-xl border border-[#D5E0DB] bg-[#F7FAF8] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B7A66]"></span>
                  <span className="text-xs font-bold text-[#0B1A17]">You (Payment Receiver)</span>
                </div>
                {hasSavedCollector && !isEditingCollector && (
                  <button
                    type="button"
                    onClick={() => setIsEditingCollector(true)}
                    className="text-xs font-semibold text-[#0B7A66] hover:underline cursor-pointer"
                  >
                    Edit details
                  </button>
                )}
              </div>

              {isEditingCollector ? (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <Label htmlFor="c-name" className="text-[11px] text-[#5A6B66]">
                        Your Name
                      </Label>
                      <Input
                        id="c-name"
                        value={collectorName}
                        onChange={(e) => setCollectorName(e.target.value)}
                        placeholder="e.g. Saket"
                        className="mt-1 h-10 text-xs bg-white border-[#E4ECE8] text-[#0B1A17] rounded-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="c-upi" className="text-[11px] text-[#5A6B66]">
                        Your UPI ID / VPA
                      </Label>
                      <Input
                        id="c-upi"
                        value={collectorUpi}
                        onChange={(e) => setCollectorUpi(e.target.value)}
                        placeholder="e.g. username@oksbi"
                        className="mt-1 h-10 text-xs font-mono bg-white border-[#E4ECE8] text-[#0B1A17] rounded-lg"
                      />
                    </div>
                  </div>

                  {/* UPI Provider Shortcuts */}
                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-[#5A6B66]">
                    <span>Handles:</span>
                    {COMMON_UPI_PROVIDERS.map((provider) => (
                      <button
                        key={provider}
                        type="button"
                        onClick={() => {
                          const base = collectorUpi.split("@")[0] || collectorName.toLowerCase().replace(/[^a-z0-9]/g, "")
                          setCollectorUpi(`${base}${provider}`)
                        }}
                        className="px-1.5 py-0.5 rounded bg-white border border-[#E4ECE8] text-[#0B1A17] text-[10px] font-mono hover:border-[#3DDBB8] cursor-pointer"
                      >
                        {provider}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-[#5A6B66]">
                      Saved on this device so you don't retype it.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => saveCollectorDetails(collectorName, collectorUpi)}
                      className="bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-8 px-3 rounded-lg cursor-pointer"
                    >
                      Save details
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-[#0B1A17] pt-0.5">
                  <div>
                    <span className="font-semibold">{collectorName}</span>
                    <span className="font-mono text-[#5A6B66] ml-2">
                      ({collectorUpi.length > 5 ? `${collectorUpi.slice(0, 2)}****@${collectorUpi.split("@")[1] || "upi"}` : collectorUpi})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={forgetCollectorDetails}
                    className="text-[11px] text-[#B3261E] hover:underline cursor-pointer"
                  >
                    Forget
                  </button>
                </div>
              )}
            </div>

            {/* Friend Input */}
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
                placeholder="Add friend name (or paste multiple names)"
                className="h-11 text-xs bg-white border-[#E4ECE8] text-[#0B1A17] rounded-[12px] focus:border-[#3DDBB8]"
              />
              <Button
                type="button"
                onClick={handleAddFriends}
                className="bg-[#EAF1EE] hover:bg-[#DDF5EE] text-[#0B7A66] font-bold px-4 h-11 rounded-[12px] text-xs cursor-pointer"
              >
                <UL0Icon name="plus" size={14} className="mr-1" /> Add
              </Button>
            </div>

            {/* People Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DDF5EE] border border-[#3DDBB8]/40 text-[#0B7A66] text-xs font-semibold">
                <span>{collectorName || "You"} (Collector)</span>
              </div>

              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7FAF8] border border-[#E4ECE8] text-[#0B1A17] text-xs font-medium"
                >
                  <span>{friend.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="text-[#5A6B66] hover:text-[#B3261E] transition-colors cursor-pointer"
                    title={`Remove ${friend.name}`}
                  >
                    <UL0Icon name="trash" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Split Mode Segmented Control */}
          <div className="space-y-4 pt-4 border-t border-[#E4ECE8]">
            <Label className="text-xs font-semibold text-[#5A6B66]">
              3. How to split
            </Label>

            <div className="grid grid-cols-5 p-1 rounded-xl bg-[#EAF1EE] text-xs font-medium text-center">
              {(["equal", "items", "custom", "percent", "shares"] as SplitMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSplitMode(mode)}
                  className={`py-2 rounded-lg capitalize transition-all cursor-pointer ${
                    splitMode === mode
                      ? "bg-white text-[#0B1A17] font-bold shadow-sm"
                      : "text-[#5A6B66] hover:text-[#0B1A17]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Equal Mode Sub-options */}
            {splitMode === "equal" && (
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E4ECE8] bg-[#F7FAF8]">
                <div>
                  <div className="text-xs font-bold text-[#0B1A17]">Are you included in the bill?</div>
                  <div className="text-[11px] text-[#5A6B66]">Turn off if you only paid on behalf of others.</div>
                </div>
                <Switch
                  checked={includeCollector}
                  onCheckedChange={setIncludeCollector}
                  className="data-[state=checked]:bg-[#0B7A66]"
                />
              </div>
            )}

            {/* Items Mode Sub-options */}
            {splitMode === "items" && (
              <div className="space-y-3">
                <div className="text-xs text-[#5A6B66]">
                  Add receipt items. Tax and service charges are split proportionally to each person's subtotal!
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <Input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Item (e.g. Pizza)"
                    className="sm:col-span-6 h-9 text-xs bg-white border-[#E4ECE8] text-[#0B1A17]"
                  />
                  <Input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="₹ Price"
                    className="sm:col-span-3 h-9 text-xs font-mono bg-white border-[#E4ECE8] text-[#0B1A17]"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddItem}
                    className="sm:col-span-3 bg-[#0B7A66] hover:bg-[#086353] text-white text-xs h-9 cursor-pointer"
                  >
                    <UL0Icon name="plus" size={14} className="mr-1" /> Add Item
                  </Button>
                </div>

                {/* Items List */}
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-lg border border-[#E4ECE8] bg-[#F7FAF8] text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#0B1A17]">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#0B7A66]">₹{item.price.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-[#5A6B66] hover:text-[#B3261E] cursor-pointer"
                          >
                            <UL0Icon name="trash" size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Shared By Chips */}
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-[10px] text-[#5A6B66] mr-1">Shared:</span>
                        {allMembers.map((m) => {
                          const isShared = item.sharedBy.includes(m.id)
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => toggleItemMember(item.id, m.id)}
                              className={`text-[10px] px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                                isShared
                                  ? "bg-[#DDF5EE] border border-[#3DDBB8] text-[#0B7A66] font-semibold"
                                  : "bg-white border border-[#E4ECE8] text-[#5A6B66]"
                              }`}
                            >
                              {m.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tax & Service Charge */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <Label className="text-[11px] text-[#5A6B66]">GST / Tax (%)</Label>
                    <Input
                      type="number"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(e.target.value)}
                      placeholder="5"
                      className="h-9 text-xs bg-white border-[#E4ECE8] text-[#0B1A17] mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-[#5A6B66]">Service Charge (%)</Label>
                    <Input
                      type="number"
                      value={serviceChargePercent}
                      onChange={(e) => setServiceChargePercent(e.target.value)}
                      placeholder="0"
                      className="h-9 text-xs bg-white border-[#E4ECE8] text-[#0B1A17] mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Custom Mode */}
            {splitMode === "custom" && (
              <div className="space-y-2">
                <div className="text-xs text-[#5A6B66]">Enter the exact share for each friend:</div>
                {friends.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-2 rounded-lg border border-[#E4ECE8] bg-[#F7FAF8]">
                    <span className="text-xs font-semibold text-[#0B1A17]">{f.name}</span>
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#5A6B66]">₹</span>
                      <Input
                        type="number"
                        value={f.customAmount ?? ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          setFriends((prev) => prev.map((item) => (item.id === f.id ? { ...item, customAmount: val } : item)))
                        }}
                        placeholder="0.00"
                        className="h-8 pl-6 text-xs font-mono bg-white border-[#E4ECE8] text-[#0B1A17]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Shares Mode */}
            {splitMode === "shares" && (
              <div className="space-y-2">
                <div className="text-xs text-[#5A6B66]">Assign relative shares (e.g. 2 shares for couples, 1 for solo):</div>
                {friends.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-2 rounded-lg border border-[#E4ECE8] bg-[#F7FAF8]">
                    <span className="text-xs font-semibold text-[#0B1A17]">{f.name}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={f.shares ?? 1}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 1
                          setFriends((prev) => prev.map((item) => (item.id === f.id ? { ...item, shares: val } : item)))
                        }}
                        className="w-16 h-8 text-xs font-mono bg-white border-[#E4ECE8] text-[#0B1A17] text-center"
                      />
                      <span className="text-xs text-[#5A6B66]">shares</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Percent Mode */}
            {splitMode === "percent" && (
              <div className="space-y-2">
                <div className="text-xs text-[#5A6B66]">Enter percentage per friend:</div>
                {friends.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-2 rounded-lg border border-[#E4ECE8] bg-[#F7FAF8]">
                    <span className="text-xs font-semibold text-[#0B1A17]">{f.name}</span>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        value={f.percent ?? ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          setFriends((prev) => prev.map((item) => (item.id === f.id ? { ...item, percent: val } : item)))
                        }}
                        className="w-20 h-8 text-xs font-mono bg-white border-[#E4ECE8] text-[#0B1A17] text-right"
                      />
                      <span className="text-xs text-[#5A6B66]">%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. More Options (Collapsed) */}
          <div className="pt-2 border-t border-[#E4ECE8]">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="text-xs font-bold text-[#0B7A66] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <UL0Icon name="arrowdown" size={14} className={showOptions ? "rotate-180 transition-transform" : "transition-transform"} />
              <span>{showOptions ? "Hide options" : "More options (Deadline, Expiry, Language)"}</span>
            </button>

            {showOptions && (
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-[11px] text-[#5A6B66]">Pay-by Deadline</Label>
                  <Input
                    type="date"
                    value={payByDate}
                    onChange={(e) => setPayByDate(e.target.value)}
                    className="h-9 text-xs bg-white border-[#E4ECE8] text-[#0B1A17] mt-1"
                  />
                </div>

                <div>
                  <Label className="text-[11px] text-[#5A6B66]">Link Expiry</Label>
                  <select
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                    className="w-full h-9 text-xs bg-white border border-[#E4ECE8] text-[#0B1A17] rounded-md px-2 mt-1 outline-none"
                  >
                    {EXPIRY_OPTIONS.map((opt) => (
                      <option key={opt.days} value={opt.days}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-[11px] text-[#5A6B66]">Language</Label>
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as any)}
                    className="w-full h-9 text-xs bg-white border border-[#E4ECE8] text-[#0B1A17] rounded-md px-2 mt-1 outline-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA on wizard */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={handleCreateSplit}
              disabled={isSubmitting}
              className="w-full bg-[#3DDBB8] hover:bg-[#34c4a4] text-[#04231C] font-bold text-base h-14 rounded-[18px] shadow-sm transition-transform active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Generating split link...</span>
              ) : (
                <>
                  <span>Create split link</span>
                  <UL0Icon name="arrowright" size={16} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Sticky Receipt Column */}
      <div className="lg:col-span-5 sticky top-24 hidden lg:block">
        <div className="rounded-2xl border border-[#E4ECE8] bg-white p-6 shadow-[0_1px_2px_rgba(10,30,26,0.06)] space-y-4">
          <div className="border-b border-dashed border-[#E4ECE8] pb-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#5A6B66]">
              <span>UL0 SETTLE PREVIEW</span>
              <span>{new Date().toLocaleDateString("en-IN")}</span>
            </div>
            <h3 className="text-lg font-bold text-[#0B1A17] mt-1">
              {title.trim() || "Untitled Bill"}
            </h3>
            <div className="text-xs text-[#5A6B66] mt-0.5">
              Collector: <strong className="text-[#0B1A17]">{collectorName || "You"}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-[#5A6B66] uppercase tracking-wider">
              Who Owes What
            </div>

            {includeCollector && (
              <div className="flex items-center justify-between text-xs py-1 border-b border-[#F7FAF8]">
                <span className="text-[#5A6B66]">{collectorName || "You"} (Your share)</span>
                <span className="font-mono font-semibold text-[#0B1A17]">₹{collectorShare.toFixed(2)}</span>
              </div>
            )}

            {friends.map((f) => (
              <div key={f.id} className="flex items-center justify-between text-xs py-1 border-b border-[#F7FAF8]">
                <span className="font-medium text-[#0B1A17]">{f.name}</span>
                <span className="font-mono font-bold text-[#0B7A66]">₹{(friendShares[f.id] || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-dashed border-[#E4ECE8] flex items-center justify-between">
            <span className="text-xs text-[#5A6B66]">Total Bill:</span>
            <span className="text-2xl font-black font-mono text-[#0B1A17]">
              ₹{calculatedTotal.toFixed(2)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#E4ECE8] text-[11px] text-[#5A6B66] flex items-center gap-1.5">
            <UL0Icon name="shield" size={14} className="shrink-0 text-[#0B7A66]" />
            <span>Money transfers direct bank-to-bank. UL0 never touches funds.</span>
          </div>
        </div>
      </div>

      {/* Share Sheet Dialog (After creation) */}
      <Dialog open={Boolean(createdSlug)} onOpenChange={(open) => !open && setCreatedSlug(null)}>
        <DialogContent className="bg-white border-[#E4ECE8] text-[#0B1A17] max-w-md p-6 rounded-2xl shadow-xl">
          <DialogHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-[#DDF5EE] text-[#0B7A66] mx-auto flex items-center justify-center mb-2">
              <UL0Icon name="check" size={24} />
            </div>
            <DialogTitle className="text-xl font-bold text-[#0B1A17]">
              Split Created! Ready to Share
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5A6B66]">
              Friends tap their name and pay via Google Pay, PhonePe, or Paytm with zero app install!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* Scannable QR */}
            {qrCodeData && (
              <div className="p-3 rounded-xl border border-[#E4ECE8] bg-[#F7FAF8] max-w-[200px] mx-auto text-center">
                <img src={qrCodeData} alt="Bill Settle QR" className="w-full h-auto rounded" />
                <span className="text-[10px] font-mono font-semibold text-[#5A6B66] mt-1 block">
                  Scan to Open & Settle
                </span>
              </div>
            )}

            {/* Settle Link Copy */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F7FAF8] border border-[#E4ECE8]">
              <input
                readOnly
                value={settleUrl}
                className="bg-transparent text-xs text-[#0B1A17] font-mono flex-1 outline-none px-2 select-all"
              />
              <Button
                type="button"
                onClick={copySettleLink}
                size="sm"
                className="bg-white hover:bg-[#EAF1EE] border border-[#D5E0DB] text-[#0B1A17] text-xs h-8 px-3 rounded-lg cursor-pointer"
              >
                {copiedLink ? <UL0Icon name="check" size={14} className="text-[#0B7A66]" /> : <UL0Icon name="copy" size={14} />}
              </Button>
            </div>

            {/* 1-Click WhatsApp Share */}
            <Button
              type="button"
              onClick={shareWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
            >
              <UL0Icon name="whatsapp" size={18} />
              <span>Share Bill on WhatsApp</span>
            </Button>

            {/* Open Settle Page button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/split/${createdSlug}`)}
              className="w-full border-[#D5E0DB] text-[#0B1A17] text-xs h-10 rounded-xl cursor-pointer"
            >
              <span>View Settle Page (Friend View)</span>
              <UL0Icon name="external" size={14} className="ml-1" />
            </Button>

            {/* Private Manage Link Banner */}
            <div className="p-3.5 rounded-xl border border-[#3DDBB8]/60 bg-[#DDF5EE]/50 text-xs text-[#04231C] space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <UL0Icon name="shield" size={14} className="text-[#0B7A66]" />
                <span>Your Private Manage Link</span>
              </div>
              <p className="text-[11px] text-[#5A6B66] leading-relaxed">
                Save this link to confirm payments from friends, send WhatsApp nudges, and extend or delete this bill.
              </p>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={copyManageLink}
                  className="bg-white hover:bg-[#EAF1EE] text-[#0B1A17] border border-[#D5E0DB] text-[11px] h-7 px-2.5 rounded-lg cursor-pointer"
                >
                  {copiedManageLink ? "Copied!" : "Copy Manage Link"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => router.push(`/split/${createdSlug}/manage?token=${collectorToken}`)}
                  className="bg-[#0B7A66] hover:bg-[#086353] text-white text-[11px] h-7 px-2.5 rounded-lg cursor-pointer"
                >
                  Open Manage Page
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
