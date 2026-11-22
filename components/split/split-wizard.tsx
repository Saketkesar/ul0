"use client"

import { useState, useEffect, useId, useMemo, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import QRCode from "qrcode"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Receipt,
  Plus,
  ArrowLeft,
  ArrowRight,
  X,
  QrCode,
  Settings,
  Users,
  Shield,
  Upload,
  Trash2,
  Copy,
  Check,
  Clock,
  Bell,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import {
  CATEGORY_PRESETS,
  distributeWithLargestRemainder,
  buildReminderMessage,
  ReminderTone,
  ReminderLang,
} from "./split-constants"
import { scanReceiptWithTesseract } from "@/lib/split/receipt-ocr"
import { GunGame } from "./gun-game"

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
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#5F6763] text-sm">Loading split...</div>}>
      <SplitWizardContent />
    </Suspense>
  )
}

function SplitWizardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUser()
  const baseId = useId()
  const collectorId = `collector-${baseId}`

  // Step state: 0 = Dashboard, 1 = "How much?", 2 = "Who's in?", 3 = "Split it", 4 = "Looks right?"
  const [step, setStep] = useState<number>(0)

  // Step 1: Amount & Title & Category
  const [totalAmountStr, setTotalAmountStr] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [category, setCategory] = useState<string>("Food")
  const [billType, setBillType] = useState<"full" | "itemized">("full")

  // Collector (You) - clean generic default
  const [collectorName, setCollectorName] = useState<string>("")
  const [collectorUpi, setCollectorUpi] = useState<string>("")
  const [isEditingCollector, setIsEditingCollector] = useState<boolean>(false)
  const [hasSavedCollector, setHasSavedCollector] = useState<boolean>(false)
  const [inlineUpiInput, setInlineUpiInput] = useState<string>("")

  // Friends - initialized empty, no hardcoded personal friends
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendInput, setFriendInput] = useState<string>("")
  const [includeCollector, setIncludeCollector] = useState<boolean>(true)

  // Split mode
  const [splitMode, setSplitMode] = useState<SplitMode>("equal")

  // Itemized bill
  const [items, setItems] = useState<ItemEntry[]>([])
  const [newItemName, setNewItemName] = useState<string>("")
  const [newItemPrice, setNewItemPrice] = useState<string>("")
  const [newItemQty, setNewItemQty] = useState<string>("1")
  const [taxPercent, setTaxPercent] = useState<string>("5")
  const [serviceChargePercent, setServiceChargePercent] = useState<string>("0")

  // OCR Receipt scanner state
  const [ocrScanning, setOcrScanning] = useState<boolean>(false)
  const [ocrProgress, setOcrProgress] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Gun Game (Russian Roulette Who Pays?)
  const [showGunGame, setShowGunGame] = useState<boolean>(false)

  // QR Scanner Modal
  const [showQrScanner, setShowQrScanner] = useState<boolean>(false)

  // Settings Modal
  const [showSettings, setShowSettings] = useState<boolean>(false)

  // Submitting & Share Dialog
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const [collectorToken, setCollectorToken] = useState<string | null>(null)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const [reminderTone, setReminderTone] = useState<ReminderTone>("polite")
  const [reminderLang, setReminderLang] = useState<ReminderLang>("en")

  // Handle URL query parameters from landing page calculator (?amount=1200&people=3)
  useEffect(() => {
    const amountParam = searchParams.get("amount")
    if (amountParam && !isNaN(Number(amountParam)) && Number(amountParam) > 0) {
      setTotalAmountStr(amountParam)
      setStep(1)
    }
  }, [searchParams])

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
        const defaultName = user?.fullName || user?.firstName || "You"
        setCollectorName(defaultName)
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
      setCollectorName(name.trim())
      setCollectorUpi(upi.trim().toLowerCase())
      setHasSavedCollector(true)
      setIsEditingCollector(false)
    } catch {}
  }

  // Clear collector profile from localStorage
  const clearCollectorDetails = () => {
    try {
      localStorage.removeItem("ul0_split_collector_name")
      localStorage.removeItem("ul0_split_collector_upi")
      setCollectorUpi("")
      setHasSavedCollector(false)
      setIsEditingCollector(true)
      toast.info("Organizer details cleared from this device.")
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

  // Handle Receipt Scan with on-device OCR
  const handleReceiptScan = async (file: File) => {
    if (!file) return
    setOcrScanning(true)
    setOcrProgress(0)

    try {
      const result = await scanReceiptWithTesseract(file, (p) => setOcrProgress(p))
      if (result.items.length > 0) {
        const allMemberIds = [
          ...(includeCollector ? [collectorId] : []),
          ...friends.map((f) => f.id),
        ]
        const newItems: ItemEntry[] = result.items.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          qty: it.qty,
          sharedBy: allMemberIds,
        }))
        setItems(newItems)
        setBillType("itemized")
        if (result.detectedTax) {
          const subtotal = newItems.reduce((s, it) => s + it.price, 0)
          if (subtotal > 0) {
            setTaxPercent(((result.detectedTax / subtotal) * 100).toFixed(1))
          }
        }
        if (result.detectedTotal) {
          setTotalAmountStr(String(Math.round(result.detectedTotal)))
        }
        toast.success(`Scanned ${result.items.length} items from receipt!`)
      } else {
        toast.info("Couldn't detect items automatically. You can add them manually below.")
      }
    } catch {
      toast.error("Receipt scanning failed. Please add items manually.")
    } finally {
      setOcrScanning(false)
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
        const updated = has ? it.sharedBy.filter((id) => id !== memberId) : [...it.sharedBy, memberId]
        return {
          ...it,
          sharedBy: updated.length > 0 ? updated : [memberId],
        }
      })
    )
  }

  const selectAllItemMembers = (itemId: string) => {
    const allMemberIds = [
      ...(includeCollector ? [collectorId] : []),
      ...friends.map((f) => f.id),
    ]
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, sharedBy: allMemberIds } : it))
    )
  }

  // All active members list
  const allMembers = useMemo(
    () => [
      ...(includeCollector ? [{ id: collectorId, name: `${collectorName.trim() || "You"} (you)` }] : []),
      ...friends.map((f) => ({ id: f.id, name: f.name })),
    ],
    [collectorId, collectorName, friends, includeCollector]
  )

  // Calculations with Largest-Remainder rounding
  const { calculatedTotal, friendShares, collectorShare } = useMemo(() => {
    let parsedTotal = parseFloat(totalAmountStr) || 0

    if (billType === "itemized") {
      const itemsSubtotal = items.reduce((sum, it) => sum + it.price, 0)
      const taxAmt = (itemsSubtotal * (parseFloat(taxPercent) || 0)) / 100
      const srvAmt = (itemsSubtotal * (parseFloat(serviceChargePercent) || 0)) / 100
      parsedTotal = itemsSubtotal + taxAmt + srvAmt

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
        rawSum > 0 ? (memberSubtotals[m.id] || 0) / rawSum : 1 / (allMembers.length || 1)
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
      const activeMembers = allMembers
      const count = activeMembers.length
      if (count === 0) return { calculatedTotal: parsedTotal, friendShares: {}, collectorShare: 0 }

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

  // Create Split Session API Call
  const handleCreateSplit = async () => {
    const cleanTitle = title.trim() || `${category} Split`
    const cleanCollectorName = collectorName.trim() || "Organizer"
    const cleanCollectorUpi = collectorUpi.trim().toLowerCase()

    if (!cleanCollectorUpi) {
      toast.error("Please enter your UPI ID so friends can pay you directly")
      setIsEditingCollector(true)
      return
    }

    if (calculatedTotal <= 0) {
      toast.error("Total amount must be greater than 0")
      return
    }

    if (friends.length === 0) {
      toast.error("Please add at least one friend to split with")
      return
    }

    setIsSubmitting(true)
    try {
      saveCollectorDetails(cleanCollectorName, cleanCollectorUpi)

      const membersPayload = [
        ...(includeCollector
          ? [
              {
                id: collectorId,
                name: cleanCollectorName,
                isCollector: true,
                upiId: cleanCollectorUpi,
              },
            ]
          : []),
        ...friends.map((f) => ({
          id: f.id,
          name: f.name.trim(),
          isCollector: false,
        })),
      ]

      const expensesPayload = [
        {
          id: `exp-${Date.now()}`,
          description: cleanTitle,
          amount: Math.round(calculatedTotal * 100) / 100,
          paidBy: collectorId,
          splitMode: billType === "itemized" ? "items" : splitMode,
          date: new Date().toISOString(),
          category,
          note: note.trim() || undefined,
          items:
            billType === "itemized"
              ? items.map((it) => ({
                  id: it.id,
                  name: it.name,
                  price: it.price,
                  qty: it.qty,
                  sharedBy: it.sharedBy,
                }))
              : undefined,
          taxPercent: billType === "itemized" ? parseFloat(taxPercent) || 0 : undefined,
          serviceChargePercent:
            billType === "itemized" ? parseFloat(serviceChargePercent) || 0 : undefined,
        },
      ]

      const settlementsPayload = friends.map((f) => ({
        fromMemberId: f.id,
        toMemberId: collectorId,
        amount: Math.round((friendShares[f.id] || 0) * 100) / 100,
        status: "pending" as const,
      }))

      let calculatedPayBy: string | undefined = undefined
      if (payByOption === "3days") {
        const d = new Date()
        d.setDate(d.getDate() + 3)
        calculatedPayBy = d.toISOString()
      } else if (payByOption === "sunday") {
        const d = new Date()
        d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7))
        calculatedPayBy = d.toISOString()
      } else if (payByOption === "week") {
        const d = new Date()
        d.setDate(d.getDate() + 7)
        calculatedPayBy = d.toISOString()
      } else if (payByOption === "month") {
        const d = new Date()
        d.setMonth(d.getMonth() + 1, 0)
        calculatedPayBy = d.toISOString()
      }

      const res = await fetch("/api/split/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          collectorName: cleanCollectorName,
          collectorUpi: cleanCollectorUpi,
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
        color: { dark: "#111715", light: "#FFFFFF" },
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

  return (
    <div className="w-full bg-[#F6F5F1] text-[#111715] font-sans selection:bg-[#0F7B5F]/20 selection:text-[#0F7B5F]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Desktop Shell (Sidebar + Main Content Grid) */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* =====================================================================
              DESKTOP SIDEBAR (240px Flat Rail)
          ====================================================================== */}
          <aside className="hidden md:flex flex-col w-[240px] shrink-0 rounded-[16px] border border-[#E4E2DA] bg-white p-4.5 space-y-6 sticky top-20">
            {/* Brand header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-[6px] bg-[#0F7B5F] text-white flex items-center justify-center font-bold text-xs">
                  U
                </span>
                <span className="font-bold text-[15px] tracking-tight text-[#111715]">
                  UL0 Split & Hisab
                </span>
              </div>
              <span className="inline-block text-[11px] font-medium text-[#5F6763] pl-8">
                Direct UPI · Zero signup
              </span>
            </div>

            {/* Nav Items */}
            <nav className="space-y-1 text-[13px] font-medium">
              <button
                onClick={() => setStep(0)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] transition-colors cursor-pointer text-left ${
                  step === 0
                    ? "bg-[#EAE8E1] text-[#111715] font-semibold"
                    : "text-[#5F6763] hover:bg-[#F6F5F1] hover:text-[#111715]"
                }`}
              >
                <Receipt className="w-4 h-4" strokeWidth={1.75} />
                <span>Splits Dashboard</span>
              </button>

              <button
                onClick={() => router.push("/split/groups")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[#5F6763] hover:bg-[#F6F5F1] hover:text-[#111715] transition-colors cursor-pointer text-left"
              >
                <Users className="w-4 h-4" strokeWidth={1.75} />
                <span>Group Hisab</span>
              </button>

              <button
                onClick={() => {
                  if (recentSplits.length > 0) {
                    router.push(`/split/${recentSplits[0].slug}`)
                  } else {
                    toast.info("No past splits in your ledger yet.")
                  }
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[#5F6763] hover:bg-[#F6F5F1] hover:text-[#111715] transition-colors cursor-pointer text-left"
              >
                <Clock className="w-4 h-4" strokeWidth={1.75} />
                <span>Ledger</span>
              </button>

              <button
                onClick={() => setShowQrScanner(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[#5F6763] hover:bg-[#F6F5F1] hover:text-[#111715] transition-colors cursor-pointer text-left"
              >
                <QrCode className="w-4 h-4" strokeWidth={1.75} />
                <span>Collect / QR</span>
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[#5F6763] hover:bg-[#F6F5F1] hover:text-[#111715] transition-colors cursor-pointer text-left"
              >
                <Settings className="w-4 h-4" strokeWidth={1.75} />
                <span>Settings</span>
              </button>
            </nav>

            {/* Secondary Action: Gun Game (clean secondary link, not red block) */}
            <div className="pt-2 border-t border-[#E4E2DA]">
              <button
                onClick={() => setShowGunGame(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[12px] font-medium text-[#5F6763] hover:text-[#111715] hover:bg-[#F6F5F1] transition-colors cursor-pointer"
              >
                <span>Who pays? (random pick)</span>
                <span className="text-[11px] font-mono text-[#0F7B5F]">Roll →</span>
              </button>
            </div>

            {/* Organizer Card */}
            <div className="pt-2 border-t border-[#E4E2DA] space-y-2">
              <span className="text-[11px] font-medium text-[#5F6763] uppercase tracking-wider block">
                Your UPI details
              </span>
              <div className="p-3 rounded-[10px] bg-[#F6F5F1] border border-[#E4E2DA] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[13px] text-[#111715] truncate max-w-[120px]">
                    {collectorName || "Organizer"}
                  </span>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-[11px] text-[#0F7B5F] font-medium underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <span className="text-[12px] font-mono text-[#5F6763] block truncate">
                  {collectorUpi || "No UPI set"}
                </span>
              </div>
            </div>

            {/* Direct Bank Transfer Notice */}
            <div className="pt-1 text-[11px] text-[#5F6763] flex items-center gap-1.5 leading-tight">
              <Shield className="w-3.5 h-3.5 text-[#0F7B5F] shrink-0" strokeWidth={1.75} />
              <span>Direct bank-to-bank UPI. UL0 never holds funds.</span>
            </div>
          </aside>

          {/* =====================================================================
              MAIN CONTENT AREA
          ====================================================================== */}
          <main className="flex-1 w-full max-w-2xl">
            {/* Top Prompt: Missing UPI ID */}
            {!collectorUpi && step === 0 && (
              <div className="mb-6 p-4 rounded-[12px] border border-[#E4E2DA] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[14px] text-[#111715] block">
                    Add your UPI ID to receive money
                  </span>
                  <span className="text-[12px] text-[#5F6763] block">
                    Friends will pay directly into your bank via UPI deep links.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="e.g. name@oksbi"
                    value={inlineUpiInput}
                    onChange={(e) => setInlineUpiInput(e.target.value)}
                    className="h-9 w-44 text-[13px] font-mono rounded-[8px] border-[#E4E2DA]"
                  />
                  <Button
                    onClick={() => {
                      if (!inlineUpiInput.trim().includes("@")) {
                        toast.error("Please enter a valid UPI ID (e.g. name@oksbi)")
                        return
                      }
                      saveCollectorDetails(collectorName || "Organizer", inlineUpiInput)
                      toast.success("UPI ID saved!")
                    }}
                    className="h-9 px-3.5 rounded-[8px] bg-[#111715] hover:bg-[#25302C] text-white text-[12px] font-medium"
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 0: DASHBOARD */}
            {step === 0 && (
              <div className="space-y-6">
                {/* Header Row: Clean H1 "Splits" */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-[28px] sm:text-[32px] font-bold text-[#111715] tracking-tight">
                      Splits
                    </h1>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setStep(1)}
                      className="bg-[#111715] hover:bg-[#25302C] text-white text-[13px] h-10 px-4 rounded-[10px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" strokeWidth={1.75} />
                      <span>New split</span>
                    </Button>
                  </div>
                </div>

                {/* Dashboard View */}
                {recentSplits.length === 0 ? (
                  // Compact empty state
                  <div className="p-8 sm:p-12 rounded-[16px] border border-[#E4E2DA] bg-white text-center space-y-4">
                    <div className="w-12 h-12 rounded-[12px] bg-[#F6F5F1] text-[#111715] mx-auto flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-[#5F6763]" strokeWidth={1.75} />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-[17px] font-semibold text-[#111715]">No splits yet</h2>
                      <p className="text-[13px] text-[#5F6763] max-w-sm mx-auto leading-relaxed">
                        Create one in under 15 seconds. Friends pay from a link — no app, no signup.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => setStep(1)}
                        className="bg-[#0F7B5F] hover:bg-[#0c654e] text-white text-[13px] h-10 px-6 rounded-[10px] font-semibold cursor-pointer transition-colors"
                      >
                        Create your first split
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Recent splits list
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[13px] font-medium text-[#5F6763] px-1">
                      <span>Recent Splits</span>
                      <span className="text-[12px]">{recentSplits.length} saved</span>
                    </div>

                    <div className="space-y-2">
                      {recentSplits.map((sp) => (
                        <div
                          key={sp.slug}
                          onClick={() => router.push(`/split/${sp.slug}`)}
                          className="p-4 rounded-[12px] border border-[#E4E2DA] bg-white hover:border-[#0F7B5F]/40 cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-[8px] bg-[#F6F5F1] text-[#0F7B5F] flex items-center justify-center font-bold text-xs">
                              <Receipt className="w-4 h-4" strokeWidth={1.75} />
                            </div>
                            <div>
                              <h3 className="text-[14px] font-semibold text-[#111715]">{sp.title}</h3>
                              <p className="text-[12px] text-[#5F6763]">
                                {new Date(sp.createdAt).toLocaleDateString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <span className="text-[15px] font-bold text-[#111715]">
                              ₹{sp.totalAmount.toFixed(0)}
                            </span>
                            <ChevronRight className="w-4 h-4 text-[#5F6763]" strokeWidth={1.75} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Bottom Navigation Bar */}
                <div className="md:hidden pt-8 border-t border-[#E4E2DA] flex items-center justify-around text-[#5F6763]">
                  <button
                    onClick={() => setStep(0)}
                    className="flex flex-col items-center gap-1 text-[#111715] font-semibold text-[11px]"
                  >
                    <Receipt className="w-5 h-5" strokeWidth={1.75} />
                    <span>Splits</span>
                  </button>
                  <button
                    onClick={() => {
                      if (recentSplits.length > 0) {
                        router.push(`/split/${recentSplits[0].slug}`)
                      } else {
                        toast.info("No past splits yet.")
                      }
                    }}
                    className="flex flex-col items-center gap-1 hover:text-[#111715] text-[11px] transition-colors"
                  >
                    <Clock className="w-5 h-5" strokeWidth={1.75} />
                    <span>Ledger</span>
                  </button>
                  <button
                    onClick={() => router.push("/split/groups")}
                    className="flex flex-col items-center gap-1 hover:text-[#111715] text-[11px] transition-colors"
                  >
                    <Users className="w-5 h-5" strokeWidth={1.75} />
                    <span>Hisab</span>
                  </button>
                  <button
                    onClick={() => setShowQrScanner(true)}
                    className="flex flex-col items-center gap-1 hover:text-[#111715] text-[11px] transition-colors"
                  >
                    <QrCode className="w-5 h-5" strokeWidth={1.75} />
                    <span>Collect</span>
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex flex-col items-center gap-1 hover:text-[#111715] text-[11px] transition-colors"
                  >
                    <Settings className="w-5 h-5" strokeWidth={1.75} />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* WIZARD CONTAINER (Steps 1, 2, 3, 4) */}
            {step > 0 && (
              <div className="space-y-6">
                {/* Progress Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E4E2DA]">
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#5F6763] hover:text-[#111715] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
                    <span>{step === 1 ? "Dashboard" : "Back"}</span>
                  </button>

                  {/* 4 Steps Segment */}
                  <div className="flex items-center gap-2">
                    {[
                      { num: 1, label: "Amount" },
                      { num: 2, label: "Friends" },
                      { num: 3, label: "Split" },
                      { num: 4, label: "Review" },
                    ].map((s) => (
                      <div key={s.num} className="flex items-center gap-1.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            s.num <= step ? "bg-[#111715] text-white" : "bg-[#E4E2DA] text-[#5F6763]"
                          }`}
                        >
                          {s.num}
                        </div>
                        <span
                          className={`text-[12px] hidden sm:inline ${
                            s.num === step ? "font-bold text-[#111715]" : "text-[#5F6763]"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(0)}
                    className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#5F6763] hover:text-[#111715] hover:bg-[#EAE8E1] cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>

                {/* STEP 1: How much? */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-[26px] font-bold text-[#111715] tracking-tight">How much?</h2>
                    </div>

                    {/* Currency + Amount Input */}
                    <div className="pt-2">
                      <div className="flex items-baseline gap-2 border-b-2 border-[#111715] pb-2">
                        <span className="text-3xl font-bold text-[#111715]">₹</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={totalAmountStr}
                          onChange={(e) => setTotalAmountStr(e.target.value)}
                          placeholder="0"
                          className="w-full text-4xl sm:text-5xl font-bold text-[#111715] bg-transparent focus:outline-none tracking-tight"
                          autoFocus
                        />
                      </div>

                      {/* Quick Amount Pills */}
                      <div className="flex gap-2 mt-4">
                        {[500, 1000, 2000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setTotalAmountStr(String(amt))}
                            className={`px-3.5 py-1.5 rounded-[8px] border text-[13px] font-medium cursor-pointer transition-colors ${
                              parseFloat(totalAmountStr) === amt
                                ? "border-[#111715] bg-[#111715] text-white"
                                : "border-[#E4E2DA] bg-white text-[#111715] hover:bg-[#F6F5F1]"
                            }`}
                          >
                            ₹{amt.toLocaleString("en-IN")}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* What's it for? */}
                    <div className="space-y-2 pt-2">
                      <Label className="text-[13px] font-semibold text-[#111715]">What is it for?</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Dinner, Groceries, Movie, Trip"
                        className="h-11 rounded-[10px] border-[#E4E2DA] text-[14px] text-[#111715] focus-visible:ring-[#0F7B5F]"
                      />

                      {/* Category Pills */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {CATEGORY_PRESETS.map((cat) => {
                          const isActive = category === cat.label
                          return (
                            <button
                              key={cat.label}
                              type="button"
                              onClick={() => {
                                setCategory(cat.label)
                                if (!title) {
                                  setTitle(cat.title)
                                }
                              }}
                              className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium cursor-pointer transition-colors ${
                                isActive
                                  ? "bg-[#111715] text-white"
                                  : "bg-white border border-[#E4E2DA] text-[#5F6763] hover:text-[#111715] hover:bg-[#F6F5F1]"
                              }`}
                            >
                              {cat.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Mode Toggle: Entire Bill vs Item-wise */}
                    <div className="pt-2">
                      <div className="p-1 rounded-[10px] bg-[#EAE8E1] flex text-[13px] font-medium">
                        <button
                          type="button"
                          onClick={() => setBillType("full")}
                          className={`flex-1 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                            billType === "full" ? "bg-white text-[#111715] font-semibold" : "text-[#5F6763]"
                          }`}
                        >
                          Entire Bill
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillType("itemized")}
                          className={`flex-1 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                            billType === "itemized" ? "bg-white text-[#111715] font-semibold" : "text-[#5F6763]"
                          }`}
                        >
                          Item-wise (Groceries / Items)
                        </button>
                      </div>

                      {/* Itemized details & OCR scan */}
                      {billType === "itemized" && (
                        <div className="mt-4 p-4 rounded-[12px] border border-[#E4E2DA] bg-white space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-[#111715]">Item Breakdown</span>
                            <div className="flex items-center gap-2">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0]
                                  if (f) handleReceiptScan(f)
                                }}
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={ocrScanning}
                                className="h-8 text-[12px] px-2.5 rounded-[8px] border-[#E4E2DA] text-[#0F7B5F] hover:bg-[#F6F5F1] font-medium cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5 mr-1" strokeWidth={1.75} />
                                {ocrScanning ? `Scanning ${ocrProgress}%` : "Scan receipt"}
                              </Button>
                              <span className="text-[12px] text-[#0F7B5F] font-semibold">
                                Total: ₹{calculatedTotal.toFixed(0)}
                              </span>
                            </div>
                          </div>

                          {ocrScanning && (
                            <div className="space-y-1.5 p-3 rounded-[8px] bg-[#F6F5F1] border border-[#E4E2DA]">
                              <div className="flex justify-between text-[11px] font-bold text-[#0F7B5F]">
                                <span>Scanning receipt locally on device...</span>
                                <span>{ocrProgress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#0F7B5F] transition-all duration-200"
                                  style={{ width: `${ocrProgress}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-[#5F6763] block">
                                100% on-device OCR. No receipt photos are uploaded.
                              </span>
                            </div>
                          )}

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {items.map((it) => (
                              <div
                                key={it.id}
                                className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#F6F5F1] text-[13px] border border-[#E4E2DA]"
                              >
                                <div>
                                  <span className="font-medium text-[#111715] block">{it.name}</span>
                                  <span className="text-[11px] text-[#5F6763]">
                                    ₹{it.price} {it.qty && it.qty > 1 ? `(Qty: ${it.qty})` : ""}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(it.id)}
                                  className="text-[#5F6763] hover:text-[#D6402B] p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Add Item Row */}
                          <div className="flex gap-2 pt-1">
                            <Input
                              placeholder="Item name (e.g. Milk, Pizza)"
                              value={newItemName}
                              onChange={(e) => setNewItemName(e.target.value)}
                              className="h-9 text-[13px] rounded-[8px] border-[#E4E2DA]"
                            />
                            <Input
                              placeholder="Price (₹)"
                              type="number"
                              value={newItemPrice}
                              onChange={(e) => setNewItemPrice(e.target.value)}
                              className="h-9 text-[13px] w-24 rounded-[8px] border-[#E4E2DA]"
                            />
                            <Button
                              type="button"
                              onClick={handleAddItem}
                              className="h-9 bg-[#111715] hover:bg-[#25302C] text-white text-[12px] px-3.5 rounded-[8px] font-medium cursor-pointer"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        disabled={parseFloat(totalAmountStr) <= 0 && items.length === 0}
                        onClick={() => setStep(2)}
                        className="w-full h-11 rounded-[10px] bg-[#111715] hover:bg-[#25302C] disabled:opacity-40 text-white text-[14px] font-semibold cursor-pointer transition-colors"
                      >
                        Who&apos;s in?
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Who's in? */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-[26px] font-bold text-[#111715] tracking-tight">Who&apos;s in?</h2>
                      <p className="text-[13px] text-[#5F6763] mt-0.5">
                        Add friends sharing this bill. They won&apos;t need an app or account to pay.
                      </p>
                    </div>

                    {/* Organizer / Collector Card */}
                    <div className="p-4 rounded-[12px] border border-[#E4E2DA] bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[#111715]">Organizer (You)</span>
                        <button
                          type="button"
                          onClick={() => setIsEditingCollector(!isEditingCollector)}
                          className="text-[12px] font-medium text-[#0F7B5F] underline cursor-pointer"
                        >
                          {isEditingCollector ? "Done" : "Edit details"}
                        </button>
                      </div>

                      {isEditingCollector ? (
                        <div className="space-y-2 pt-1">
                          <Input
                            value={collectorName}
                            onChange={(e) => setCollectorName(e.target.value)}
                            placeholder="Your Name"
                            className="h-9 text-[13px] rounded-[8px] border-[#E4E2DA]"
                          />
                          <Input
                            value={collectorUpi}
                            onChange={(e) => setCollectorUpi(e.target.value)}
                            placeholder="Your UPI ID (e.g. name@oksbi)"
                            className="h-9 text-[13px] font-mono rounded-[8px] border-[#E4E2DA]"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="font-medium text-[#111715]">{collectorName || "You"} (you)</span>
                          <span className="font-mono text-[#5F6763]">
                            {collectorUpi || "No UPI set"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Friends Input */}
                    <div className="space-y-2.5">
                      <Label className="text-[13px] font-semibold text-[#111715]">Add friends</Label>
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
                          placeholder="Type a name or paste comma-separated names"
                          className="h-10 text-[13px] rounded-[10px] border-[#E4E2DA]"
                        />
                        <Button
                          type="button"
                          onClick={handleAddFriends}
                          className="h-10 px-4 rounded-[10px] bg-[#111715] hover:bg-[#25302C] text-white text-[13px] font-medium cursor-pointer"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Friend chips */}
                      <div className="min-h-[60px] pt-1">
                        {friends.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {friends.map((f) => (
                              <span
                                key={f.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white border border-[#E4E2DA] text-[13px] font-medium text-[#111715]"
                              >
                                <span>{f.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFriend(f.id)}
                                  className="text-[#5F6763] hover:text-[#D6402B] cursor-pointer ml-0.5"
                                >
                                  <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[12px] text-[#5F6763] py-2">
                            No friends added yet. Type a name above and tap Add.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        disabled={friends.length === 0}
                        onClick={() => setStep(3)}
                        className="w-full h-11 rounded-[10px] bg-[#111715] hover:bg-[#25302C] disabled:opacity-40 text-white text-[14px] font-semibold cursor-pointer transition-colors"
                      >
                        Next: Split it
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Split it */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[26px] font-bold text-[#111715] tracking-tight">Split it</h2>
                      <span className="text-[18px] font-bold font-mono text-[#111715]">
                        ₹{calculatedTotal.toFixed(0)}
                      </span>
                    </div>

                    {/* Mode Selector */}
                    <div className="p-1 rounded-[10px] bg-[#EAE8E1] flex text-[13px] font-medium">
                      {(["equal", "exact", "percent", "shares"] as SplitMode[]).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setSplitMode(mode)}
                          className={`flex-1 py-1.5 rounded-[8px] capitalize transition-colors cursor-pointer ${
                            splitMode === mode ? "bg-white text-[#111715] font-semibold" : "text-[#5F6763]"
                          }`}
                        >
                          {mode === "percent" ? "%" : mode}
                        </button>
                      ))}
                    </div>

                    {/* Itemized Member Assignment Chips */}
                    {billType === "itemized" && items.length > 0 && (
                      <div className="space-y-3 p-4 rounded-[12px] border border-[#E4E2DA] bg-white">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-semibold text-[#111715]">Assign Items</span>
                          <span className="text-[12px] text-[#0F7B5F] font-medium">{items.length} items</span>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {items.map((it) => (
                            <div key={it.id} className="p-3 rounded-[8px] bg-[#F6F5F1] border border-[#E4E2DA] space-y-2">
                              <div className="flex items-center justify-between text-[13px]">
                                <span className="font-semibold text-[#111715]">{it.name}</span>
                                <span className="font-mono font-bold text-[#0F7B5F]">₹{it.price}</span>
                              </div>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {allMembers.map((m) => {
                                  const isSelected = it.sharedBy.includes(m.id)
                                  return (
                                    <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => toggleItemMember(it.id, m.id)}
                                      className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors cursor-pointer ${
                                        isSelected
                                          ? "bg-[#111715] text-white"
                                          : "bg-white border border-[#E4E2DA] text-[#5F6763] hover:text-[#111715]"
                                      }`}
                                    >
                                      {m.name.split(" ")[0]}
                                    </button>
                                  )
                                })}
                                <button
                                  type="button"
                                  onClick={() => selectAllItemMembers(it.id)}
                                  className="px-2 py-1 text-[11px] text-[#0F7B5F] font-medium underline cursor-pointer"
                                >
                                  All
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E4E2DA]">
                          <div>
                            <Label className="text-[11px] text-[#5F6763]">GST / Tax (%)</Label>
                            <Input
                              type="number"
                              value={taxPercent}
                              onChange={(e) => setTaxPercent(e.target.value)}
                              className="h-8 text-[12px] font-mono rounded-[6px] border-[#E4E2DA]"
                              placeholder="5"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-[#5F6763]">Service Charge (%)</Label>
                            <Input
                              type="number"
                              value={serviceChargePercent}
                              onChange={(e) => setServiceChargePercent(e.target.value)}
                              className="h-8 text-[12px] font-mono rounded-[6px] border-[#E4E2DA]"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Member Share Cards */}
                    <div className="space-y-2">
                      {includeCollector && (
                        <div className="p-3.5 rounded-[12px] border border-[#E4E2DA] bg-white flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[8px] bg-[#F6F5F1] text-[#111715] font-bold text-xs flex items-center justify-center">
                              {(collectorName || "You").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-[14px] font-semibold text-[#111715] block">
                                {collectorName || "You"} (you)
                              </span>
                              <span className="text-[11px] text-[#5F6763]">Organizer</span>
                            </div>
                          </div>
                          <span className="text-[15px] font-bold font-mono text-[#111715]">
                            ₹{collectorShare.toFixed(0)}
                          </span>
                        </div>
                      )}

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
                            className="p-3.5 rounded-[12px] border border-[#E4E2DA] bg-white flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-[8px] bg-[#F6F5F1] text-[#111715] font-bold text-xs flex items-center justify-center">
                                {initials}
                              </div>
                              <div>
                                <span className="text-[14px] font-semibold text-[#111715] block">{f.name}</span>
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
                                  className="h-8 text-[12px] text-right font-mono rounded-[6px] border-[#E4E2DA]"
                                  placeholder="0"
                                />
                              </div>
                            ) : (
                              <span className="text-[15px] font-bold font-mono text-[#111715]">
                                ₹{shareAmt.toFixed(0)}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        onClick={() => setStep(4)}
                        className="w-full h-11 rounded-[10px] bg-[#111715] hover:bg-[#25302C] text-white text-[14px] font-semibold cursor-pointer transition-colors"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Looks right? */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-[26px] font-bold text-[#111715] tracking-tight">Looks right?</h2>
                    </div>

                    {/* Summary Card */}
                    <div className="rounded-[16px] border border-[#E4E2DA] bg-white p-5 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E4E2DA]">
                        <span className="text-[15px] font-bold text-[#111715]">
                          {title || `${category} Split`}
                        </span>
                        <span className="text-[18px] font-bold font-mono text-[#111715]">
                          ₹{calculatedTotal.toFixed(0)}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {includeCollector && (
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="font-medium text-[#111715]">{collectorName || "You"} (you)</span>
                            <span className="font-mono font-bold text-[#111715]">
                              ₹{collectorShare.toFixed(0)}
                            </span>
                          </div>
                        )}

                        {friends.map((f) => (
                          <div key={f.id} className="flex items-center justify-between text-[13px]">
                            <span className="font-medium text-[#111715]">{f.name}</span>
                            <span className="font-mono font-bold text-[#111715]">
                              ₹{(friendShares[f.id] || 0).toFixed(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-semibold text-[#111715]">Note (optional)</Label>
                      <Input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="e.g. Note for the group"
                        className="h-10 text-[13px] rounded-[10px] border-[#E4E2DA]"
                      />
                    </div>

                    {/* Auto-remind if unpaid PRO */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-[#111715]" strokeWidth={1.75} />
                        <span className="text-[13px] font-semibold text-[#111715]">Auto-remind if unpaid</span>
                        <span className="px-1.5 py-0.2 rounded-[4px] bg-[#111715] text-[9px] font-bold text-white tracking-wider">
                          PRO
                        </span>
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
                            className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium cursor-pointer transition-colors ${
                              autoRemindDays === opt.days
                                ? "bg-[#111715] text-white"
                                : "bg-white border border-[#E4E2DA] text-[#5F6763] hover:text-[#111715]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#5F6763]">
                        Pre-fills reminder message for you to send. UL0 never messages your friends directly.
                      </p>
                    </div>

                    {/* Expiry selection */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#111715]" strokeWidth={1.75} />
                        <span className="text-[13px] font-semibold text-[#111715]">Link Expiry</span>
                      </div>
                      <div className="flex gap-2">
                        {[
                          { label: "7 days", days: 7 },
                          { label: "30 days", days: 30 },
                          { label: "90 days", days: 90 },
                        ].map((opt) => (
                          <button
                            key={opt.days}
                            type="button"
                            onClick={() => setExpiryDays(opt.days)}
                            className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium cursor-pointer transition-colors ${
                              expiryDays === opt.days
                                ? "bg-[#111715] text-white"
                                : "bg-white border border-[#E4E2DA] text-[#5F6763] hover:text-[#111715]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Backdrop Banner Image Upload */}
                    <div className="p-3.5 rounded-[12px] border border-[#E4E2DA] bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[#111715]">Cover Image (optional)</span>
                        <span className="text-[11px] text-[#5F6763]">Free upload</span>
                      </div>
                      <label className="flex items-center justify-center gap-2 p-2.5 rounded-[8px] border border-dashed border-[#E4E2DA] bg-[#F6F5F1] hover:bg-[#EAE8E1] cursor-pointer text-[12px] font-medium text-[#111715] transition-colors">
                        <Upload className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span>
                          {isUploadingBanner ? "Uploading image..." : bannerUrl ? "Change Image" : "Upload cover backdrop"}
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
                        <p className="text-[11px] text-[#0F7B5F] font-medium">
                          ✓ Cover attached and will show at the top of the settle page.
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleCreateSplit}
                        className="w-full h-11 rounded-[10px] bg-[#0F7B5F] hover:bg-[#0c654e] text-white text-[14px] font-semibold cursor-pointer transition-colors"
                      >
                        {isSubmitting ? "Creating split..." : "Create split & get link"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =====================================================================
          GUN GAME MODAL (Russian Roulette)
      ====================================================================== */}
      <GunGame
        open={showGunGame}
        onOpenChange={setShowGunGame}
        initialMembers={[
          ...(collectorName ? [collectorName] : []),
          ...friends.map((f) => f.name),
        ]}
        onSelectPayer={(payerName) => {
          setCollectorName(payerName)
          setStep(1)
          toast.success(`Set ${payerName} as the organizer/payer!`)
        }}
      />

      {/* =====================================================================
          SETTINGS DIALOG
      ====================================================================== */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-sm bg-white border border-[#E4E2DA] text-[#111715] p-6 rounded-[16px]">
          <DialogHeader>
            <DialogTitle className="text-[17px] font-bold flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#5F6763]" strokeWidth={1.75} />
              <span>Organizer settings</span>
            </DialogTitle>
            <DialogDescription className="text-[12px] text-[#5F6763]">
              Your name and UPI ID are stored locally on this device.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-[#111715]">Your Name</Label>
              <Input
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                placeholder="Your Name"
                className="h-9 text-[13px] rounded-[8px] border-[#E4E2DA]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-[#111715]">Default UPI ID</Label>
              <Input
                value={collectorUpi}
                onChange={(e) => setCollectorUpi(e.target.value)}
                placeholder="e.g. yourname@oksbi"
                className="h-9 text-[13px] font-mono rounded-[8px] border-[#E4E2DA]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  saveCollectorDetails(collectorName, collectorUpi)
                  toast.success("Settings saved!")
                  setShowSettings(false)
                }}
                className="flex-1 bg-[#111715] hover:bg-[#25302C] text-white text-[13px] h-9 rounded-[8px] font-medium cursor-pointer"
              >
                Save
              </Button>
              {hasSavedCollector && (
                <Button
                  variant="outline"
                  onClick={clearCollectorDetails}
                  className="text-[12px] h-9 px-3 rounded-[8px] border-[#E4E2DA] text-[#D6402B] hover:bg-[#F6F5F1] cursor-pointer"
                >
                  Forget Me
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* =====================================================================
          QR SCANNER DIALOG
      ====================================================================== */}
      <Dialog open={showQrScanner} onOpenChange={setShowQrScanner}>
        <DialogContent className="max-w-sm bg-white border border-[#E4E2DA] text-[#111715] p-6 rounded-[16px] text-center">
          <DialogHeader>
            <DialogTitle className="text-[17px] font-bold">Scan receipt or QR</DialogTitle>
            <DialogDescription className="text-[12px] text-[#5F6763]">
              Upload a bill photo or QR code to auto-parse amounts.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-[12px] bg-[#F6F5F1] border border-dashed border-[#E4E2DA] flex items-center justify-center text-[#5F6763]">
              <QrCode className="w-8 h-8" strokeWidth={1.75} />
            </div>
            <p className="text-[12px] text-[#5F6763] max-w-xs">
              Runs 100% locally in your browser.
            </p>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-[#0F7B5F] text-white text-[13px] font-medium hover:bg-[#0c654e]">
              <Upload className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Upload Bill Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    setShowQrScanner(false)
                    handleReceiptScan(f)
                    setStep(1)
                  }
                }}
              />
            </label>
          </div>
        </DialogContent>
      </Dialog>

      {/* =====================================================================
          SUCCESS SHARE SHEET DIALOG
      ====================================================================== */}
      <Dialog open={!!createdSlug} onOpenChange={(open) => !open && setCreatedSlug(null)}>
        <DialogContent className="max-w-md bg-white border border-[#E4E2DA] text-[#111715] p-6 rounded-[16px]">
          <DialogHeader className="text-center">
            <div className="w-10 h-10 rounded-[8px] bg-[#0F7B5F]/10 text-[#0F7B5F] mx-auto flex items-center justify-center mb-1">
              <Check className="w-5 h-5" strokeWidth={2} />
            </div>
            <DialogTitle className="text-[18px] font-bold">Split link ready</DialogTitle>
            <DialogDescription className="text-[12px] text-[#5F6763]">
              Share this link. Friends tap their name and pay via GPay, PhonePe, or Paytm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Settle Link Copy */}
            <div className="p-3 bg-[#F6F5F1] rounded-[8px] border border-[#E4E2DA] flex items-center justify-between">
              <span className="text-[12px] font-mono truncate text-[#111715] max-w-[240px]">
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
                className="text-[12px] h-7 px-2.5 rounded-[6px] border-[#E4E2DA] font-medium cursor-pointer"
              >
                {copiedLink ? "Copied" : "Copy"}
              </Button>
            </div>

            {/* In-person QR code */}
            {qrCodeData && (
              <div className="flex flex-col items-center py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeData} alt="Split QR" className="w-36 h-36 rounded-[8px] border border-[#E4E2DA]" />
                <span className="text-[11px] text-[#5F6763] mt-1.5">
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
                  title: title || `${category} bill`,
                  settleUrl: settleUrl,
                  payByDate: payByOption,
                  tone: reminderTone,
                  lang: reminderLang,
                })
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 h-10 rounded-[8px] bg-[#25D366] hover:bg-[#20ba59] text-white text-[13px] font-medium transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" strokeWidth={1.75} />
              <span>Share on WhatsApp</span>
            </a>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => router.push(`/split/${createdSlug}`)}
                className="h-9 text-[12px] rounded-[8px] border-[#E4E2DA] font-medium cursor-pointer"
              >
                Open Settle Page
              </Button>
              <Button
                onClick={() => router.push(manageUrl)}
                className="h-9 text-[12px] rounded-[8px] bg-[#111715] hover:bg-[#25302C] text-white font-medium cursor-pointer"
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
