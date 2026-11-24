"use client"

import { useState, useEffect, useId, useMemo, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useUser, useClerk } from "@clerk/nextjs"
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
  Send,
  Mail,
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
import { SplitOnboardingModal } from "./split-onboarding-modal"
import { SplitCoverUploadModal } from "./split-cover-upload-modal"

interface Friend {
  id: string
  name: string
  customAmount?: number
  percent?: number
  shares?: number
  email?: string
  telegram?: string
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
  const { openSignIn } = useClerk()
  const { isSignedIn, user, isLoaded } = useUser()
  const baseId = useId()
  const collectorId = `collector-${baseId}`

  // Onboarding & Cover Modal state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false)
  const [showCoverModal, setShowCoverModal] = useState<boolean>(false)

  // Trigger onboarding upfront as soon as signed-in user enters dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      try {
        const onboarded = localStorage.getItem("ul0_split_onboarding_v1")
        const savedUpi = localStorage.getItem("ul0_split_collector_upi")
        if (!onboarded || !savedUpi) {
          setShowOnboarding(true)
        }
      } catch {}
    }
  }, [isLoaded, isSignedIn])

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
  const [friendEmail, setFriendEmail] = useState<string>("")
  const [friendTelegram, setFriendTelegram] = useState<string>("")
  const [showFriendContactInputs, setShowFriendContactInputs] = useState<boolean>(false)
  const [includeCollector, setIncludeCollector] = useState<boolean>(true)

  // 24-hour reminder state
  const [isSendingManualReminder, setIsSendingManualReminder] = useState<boolean>(false)
  const [hasSentReminderToday, setHasSentReminderToday] = useState<boolean>(false)

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
      email: rawNames.length === 1 && friendEmail.trim() ? friendEmail.trim() : undefined,
      telegram: rawNames.length === 1 && friendTelegram.trim() ? friendTelegram.trim() : undefined,
    }))

    setFriends((prev) => [...prev, ...newFriends])
    setFriendInput("")
    setFriendEmail("")
    setFriendTelegram("")
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
    if (!isSignedIn) {
      toast.info("Please sign in to create and manage your splits.")
      openSignIn()
      return
    }

    try {
      const onboarded = localStorage.getItem("ul0_split_onboarding_v1")
      if (!onboarded || !collectorUpi) {
        setShowOnboarding(true)
        return
      }
    } catch {}

    const cleanTitle = title.trim() || `${category} Split`
    const cleanCollectorName = collectorName.trim() || user?.fullName || user?.firstName || "Organizer"
    const cleanCollectorUpi = collectorUpi.trim().toLowerCase()

    if (!cleanCollectorUpi) {
      toast.error("Please enter your UPI ID so friends can pay you directly")
      setShowOnboarding(true)
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
          email: f.email,
          telegram: f.telegram,
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

      // Trigger split-created notification email to creator & members in background
      fetch("/api/notify/split-created", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: data.slug,
          title: cleanTitle,
          totalAmount: Math.round(calculatedTotal * 100) / 100,
          collectorName: cleanCollectorName,
          collectorEmail: user?.primaryEmailAddress?.emailAddress,
          collectorUpi: cleanCollectorUpi,
          manageUrl: `${window.location.origin}/split/${data.slug}/manage?token=${data.collectorToken}`,
          settleUrl,
          members: [
            ...(includeCollector ? [{ name: cleanCollectorName, amount: collectorShare, isCollector: true }] : []),
            ...friends.map((f) => ({
              name: f.name.trim(),
              amount: friendShares[f.id] || 0,
              email: f.email,
              telegram: f.telegram,
              isCollector: false,
            })),
          ],
        }),
      }).catch(() => {})

      toast.success("Split created! Share link with friends.")
    } catch (err: any) {
      toast.error(err.message || "Failed to create split")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 1-Click Telegram & Email Manual Reminder with 24-hr cooldown
  const handleSendManualReminder = async (friendId?: string) => {
    if (!createdSlug) return
    setIsSendingManualReminder(true)

    try {
      const targetFriend = friendId ? friends.find((f) => f.id === friendId) : friends[0]
      const memberId = targetFriend?.id || "first-member"

      const res = await fetch("/api/notify/split-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: createdSlug,
          memberId: memberId,
          memberName: targetFriend?.name || "Friend",
          collectorName: collectorName || "Organizer",
          amount: targetFriend ? (friendShares[targetFriend.id] || 0) : calculatedTotal,
          title: title || `${category} bill`,
          email: targetFriend?.email,
          telegram: targetFriend?.telegram,
          settleUrl,
          isManual: true,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to send reminder")
      }

      setHasSentReminderToday(true)
      toast.success("Reminder dispatched via Telegram & Email!")
    } catch (err: any) {
      toast.error(err.message || "Could not send reminder.")
    } finally {
      setIsSendingManualReminder(false)
    }
  }

  const settleUrl = createdSlug
    ? `${typeof window !== "undefined" ? window.location.origin : "https://ul0.site"}/split/${createdSlug}`
    : ""
  const manageUrl = createdSlug && collectorToken
    ? `${typeof window !== "undefined" ? window.location.origin : "https://ul0.site"}/split/${createdSlug}/manage?token=${collectorToken}`
    : ""

  if (isLoaded && !isSignedIn) {
    return (
      <div className="max-w-[500px] mx-auto px-4 py-16 text-center">
        <div className="p-8 sm:p-10 rounded-[28px] border border-[#D3E2DD] bg-[#F4FAF8] shadow-sm">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white border border-[#D3E2DD] flex items-center justify-center shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ul0split-logo-dark.png" alt="UL0 Split" className="h-10 w-auto object-contain" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1A17] mb-3">
            Sign in to use UL0.split
          </h2>
          <p className="text-[14px] text-[#5E726C] leading-relaxed mb-8 max-w-sm mx-auto">
            You must be logged in to create bill splits, track who paid in real-time, and receive direct bank-to-bank UPI transfers.
          </p>
          <Button
            type="button"
            onClick={() => openSignIn()}
            className="w-full h-12 rounded-full bg-[#1B685C] hover:bg-[#155248] text-white font-bold text-[15px] shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
          >
            Sign in / Sign up to Continue →
          </Button>
          <div className="mt-6">
            <Link
              href="/split"
              className="text-[13px] font-medium text-[#5E726C] hover:text-[#0B1A17] transition-colors"
            >
              ← Back to landing page
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white text-[#0B1A17] font-['Space_Grotesk',sans-serif] selection:bg-[#3DDBB8] selection:text-[#0B1A17]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Desktop Shell (Sidebar + Main Content Grid) */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* =====================================================================
              DESKTOP SIDEBAR (240px Flat Rail - Bold Theme)
          ====================================================================== */}
          <aside className="hidden md:flex flex-col w-[240px] shrink-0 rounded-[20px] border border-[#D3E2DD] bg-[#F4FAF8] p-4.5 space-y-6 sticky top-20">
            {/* Brand header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/ul0split-logo-dark.png" alt="UL0 Split" className="h-7 w-auto object-contain" />
              </div>
              <span className="inline-block text-[11px] font-mono text-[#5E726C] pl-1">
                Direct UPI · Zero signup
              </span>
            </div>

            {/* Nav Items */}
            <nav className="space-y-1 text-[13px] font-medium">
              <button
                onClick={() => setStep(0)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-full transition-colors cursor-pointer text-left ${
                  step === 0
                    ? "bg-[#DDF5EE] text-[#0B1A17] font-bold"
                    : "text-[#5E726C] hover:bg-[#EBF7F3] hover:text-[#0B1A17]"
                }`}
              >
                <Receipt className="w-4 h-4 text-[#1B685C]" strokeWidth={2} />
                <span>Splits Dashboard</span>
              </button>

              <button
                onClick={() => router.push("/split/groups")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-[#5E726C] hover:bg-[#EBF7F3] hover:text-[#0B1A17] transition-colors cursor-pointer text-left"
              >
                <Users className="w-4 h-4 text-[#1B685C]" strokeWidth={2} />
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
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-[#5E726C] hover:bg-[#EBF7F3] hover:text-[#0B1A17] transition-colors cursor-pointer text-left"
              >
                <Clock className="w-4 h-4 text-[#1B685C]" strokeWidth={2} />
                <span>Ledger</span>
              </button>

              <button
                onClick={() => setShowQrScanner(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-[#5E726C] hover:bg-[#EBF7F3] hover:text-[#0B1A17] transition-colors cursor-pointer text-left"
              >
                <QrCode className="w-4 h-4 text-[#1B685C]" strokeWidth={2} />
                <span>Collect / QR</span>
              </button>

              <button
                onClick={() => setShowOnboarding(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-[#5E726C] hover:bg-[#EBF7F3] hover:text-[#0B1A17] transition-colors cursor-pointer text-left"
              >
                <Settings className="w-4 h-4 text-[#1B685C]" strokeWidth={2} />
                <span>Settings</span>
              </button>
            </nav>

            {/* Secondary Action: Gun Game (clean secondary link) */}
            <div className="pt-2 border-t border-[#D3E2DD]">
              <button
                onClick={() => setShowGunGame(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-full text-[12px] font-bold text-[#1B685C] hover:bg-[#DDF5EE] transition-colors cursor-pointer"
              >
                <span>Who pays? (minigame)</span>
                <span className="text-[11px] font-mono text-[#1B685C]">Roll →</span>
              </button>
            </div>

            {/* Organizer Card */}
            <div className="pt-2 border-t border-[#D3E2DD] space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#5E726C] uppercase tracking-wider block">
                Your UPI details
              </span>
              <div className="p-3 rounded-[12px] bg-white border border-[#D3E2DD] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#0B1A17] truncate max-w-[120px]">
                    {collectorName || "Organizer"}
                  </span>
                  <button
                    onClick={() => setShowOnboarding(true)}
                    className="text-[11px] text-[#1B685C] font-bold underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <span className="text-[12px] font-mono text-[#5E726C] block truncate">
                  {collectorUpi || "No UPI set"}
                </span>
              </div>
            </div>

            {/* Direct Bank Transfer Notice */}
            <div className="pt-1 text-[11px] text-[#5E726C] flex items-center gap-1.5 leading-tight">
              <Shield className="w-3.5 h-3.5 text-[#1B685C] shrink-0" strokeWidth={2} />
              <span>Direct bank-to-bank UPI. UL0 never holds funds.</span>
            </div>
          </aside>

          {/* =====================================================================
              MAIN CONTENT AREA
          ====================================================================== */}
          <main className="flex-1 w-full max-w-2xl">
            {/* Top Prompt: Missing UPI ID */}
            {!collectorUpi && step === 0 && (
              <div className="mb-6 p-4 rounded-[16px] border border-[#D3E2DD] bg-[#F4FAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-[14px] text-[#0B1A17] block">
                    Add your UPI ID to receive money
                  </span>
                  <span className="text-[12px] text-[#5E726C] block">
                    Friends will pay directly into your bank via UPI deep links.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="e.g. name@oksbi"
                    value={inlineUpiInput}
                    onChange={(e) => setInlineUpiInput(e.target.value)}
                    className="h-9 w-44 text-[13px] font-mono rounded-[8px] border-[#D3E2DD] bg-white"
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
                    className="h-9 px-4 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-[12px] font-bold shadow-xs cursor-pointer"
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 0: DASHBOARD */}
            {step === 0 && (
              <div className="space-y-6 pb-24 md:pb-0">
                {/* Header Row: Clean H1 "Splits" + QR Scanner & New Split Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-['JetBrains_Mono',monospace] font-bold text-[11px] tracking-[0.14em] text-[#1B685C] uppercase block mb-1">
                      / your active splits
                    </span>
                    <h1 className="text-[28px] sm:text-[34px] font-bold text-[#0B1A17] tracking-tight">
                      Splits
                    </h1>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowQrScanner(true)}
                      className="w-10 h-10 rounded-full border border-[#D3E2DD] bg-[#F4FAF8] flex items-center justify-center text-[#0B1A17] hover:bg-[#DDF5EE] transition-colors cursor-pointer"
                      title="Scan UPI QR Code"
                      aria-label="Scan UPI QR Code"
                    >
                      <QrCode className="w-5 h-5 text-[#1B685C]" strokeWidth={2} />
                    </button>
                    <Button
                      onClick={() => {
                        if (!isSignedIn) {
                          toast.info("Please sign in to create a split.")
                          openSignIn()
                          return
                        }
                        const savedOnboard = typeof window !== "undefined" ? localStorage.getItem("ul0_split_onboarding_v1") : null
                        if (!savedOnboard && !collectorUpi) {
                          setShowOnboarding(true)
                          return
                        }
                        setStep(1)
                      }}
                      className="bg-[#1B685C] hover:bg-[#145248] text-white text-[13px] h-10 px-5 rounded-full font-bold flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-sm"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                      <span>New split</span>
                    </Button>
                  </div>
                </div>

                {/* Dashboard View */}
                {recentSplits.length === 0 ? (
                  // Compact empty state
                  <div className="p-8 sm:p-12 rounded-[24px] border border-[#D3E2DD] bg-[#F4FAF8] text-center space-y-4 shadow-sm">
                    <div className="w-14 h-14 rounded-[16px] bg-[#DDF5EE] text-[#1B685C] mx-auto flex items-center justify-center shadow-xs">
                      <Receipt className="w-7 h-7 text-[#1B685C]" strokeWidth={2} />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-[19px] font-bold text-[#0B1A17]">No splits yet</h2>
                      <p className="text-[13px] text-[#5E726C] max-w-sm mx-auto leading-relaxed">
                        Create one in under 15 seconds. Friends pay from a link — no app, no signup.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => {
                          if (!isSignedIn) {
                            toast.info("Please sign in to create a split.")
                            openSignIn()
                            return
                          }
                          const savedOnboard = typeof window !== "undefined" ? localStorage.getItem("ul0_split_onboarding_v1") : null
                          if (!savedOnboard && !collectorUpi) {
                            setShowOnboarding(true)
                            return
                          }
                          setStep(1)
                        }}
                        className="bg-[#1B685C] hover:bg-[#145248] text-white text-[13px] h-11 px-7 rounded-full font-bold cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md"
                      >
                        Create your first split →
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Recent splits list
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[13px] font-mono text-[#5E726C] px-1">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-[#1B685C]">Recent Splits</span>
                      <span className="text-[12px]">{recentSplits.length} saved</span>
                    </div>

                    <div className="space-y-2.5">
                      {recentSplits.map((sp) => (
                        <div
                          key={sp.slug}
                          onClick={() => router.push(`/split/${sp.slug}`)}
                          className="p-4 rounded-[16px] border border-[#D3E2DD] bg-[#F4FAF8] hover:border-[#1B685C] hover:bg-[#EBF7F3] cursor-pointer transition-all flex items-center justify-between shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-[10px] bg-[#DDF5EE] text-[#1B685C] flex items-center justify-center font-bold text-xs">
                              <Receipt className="w-5 h-5 text-[#1B685C]" strokeWidth={2} />
                            </div>
                            <div>
                              <h3 className="text-[14px] font-bold text-[#0B1A17]">{sp.title}</h3>
                              <p className="text-[12px] font-mono text-[#5E726C]">
                                {new Date(sp.createdAt).toLocaleDateString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <span className="text-[16px] font-bold font-mono text-[#0B1A17]">
                              ₹{sp.totalAmount.toFixed(0)}
                            </span>
                            <ChevronRight className="w-4 h-4 text-[#1B685C]" strokeWidth={2} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Floating Action Buttons: Gun Game & Quick New Split */}
                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => setShowGunGame(true)}
                    className="fixed bottom-20 left-6 z-20 w-13 h-13 rounded-full bg-white border-2 border-[#1B685C] shadow-xl flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    title="Who pays? (Gun game)"
                    aria-label="Gun game minigame"
                  >
                    🎲
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="fixed bottom-20 right-6 z-20 w-14 h-14 rounded-full bg-[#1B685C] text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    title="New split"
                    aria-label="Create new split"
                  >
                    <Plus className="w-6 h-6" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Mobile Fixed Bottom Navigation Bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#D3E2DD] py-2 flex items-center justify-around text-[#5E726C]">
                  <button
                    onClick={() => setStep(0)}
                    className="flex flex-col items-center gap-1 text-[#1B685C] font-bold text-[11px]"
                  >
                    <Receipt className="w-5 h-5 text-[#1B685C]" strokeWidth={2} />
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
                    className="flex flex-col items-center gap-1 hover:text-[#0B1A17] text-[11px] transition-colors"
                  >
                    <Clock className="w-5 h-5" strokeWidth={2} />
                    <span>Ledger</span>
                  </button>
                  <button
                    onClick={() => router.push("/split/groups")}
                    className="flex flex-col items-center gap-1 hover:text-[#0B1A17] text-[11px] transition-colors"
                  >
                    <Users className="w-5 h-5" strokeWidth={2} />
                    <span>Hisab</span>
                  </button>
                  <button
                    onClick={() => setShowQrScanner(true)}
                    className="flex flex-col items-center gap-1 hover:text-[#0B1A17] text-[11px] transition-colors"
                  >
                    <QrCode className="w-5 h-5" strokeWidth={2} />
                    <span>Collect</span>
                  </button>
                  <button
                    onClick={() => setShowOnboarding(true)}
                    className="flex flex-col items-center gap-1 hover:text-[#0B1A17] text-[11px] transition-colors"
                  >
                    <Settings className="w-5 h-5" strokeWidth={2} />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* WIZARD CONTAINER (Steps 1, 2, 3, 4) */}
            {step > 0 && (
              <div className="space-y-6">
                {/* Progress Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#D3E2DD]">
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-1.5 text-[13px] font-bold text-[#5E726C] hover:text-[#0B1A17] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" strokeWidth={2} />
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
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold font-['JetBrains_Mono'] ${
                            s.num <= step ? "bg-[#1B685C] text-white" : "bg-[#D3E2DD] text-[#5E726C]"
                          }`}
                        >
                          {s.num}
                        </div>
                        <span
                          className={`text-[12px] hidden sm:inline ${
                            s.num === step ? "font-bold text-[#0B1A17]" : "text-[#5E726C]"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(0)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#5E726C] hover:text-[#0B1A17] hover:bg-[#DDF5EE] cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>

                {/* STEP 1: How much? */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <span className="font-['JetBrains_Mono',monospace] font-bold text-[11px] tracking-[0.14em] text-[#1B685C] uppercase block mb-1">
                        / step 01
                      </span>
                      <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0B1A17] tracking-tight">How much?</h2>
                    </div>

                    {/* Currency + Amount Input */}
                    <div className="pt-2">
                      <div className="flex items-baseline gap-2 border-b-2 border-[#1B685C] pb-2">
                        <span className="text-3xl font-bold font-mono text-[#1B685C]">₹</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={totalAmountStr}
                          onChange={(e) => setTotalAmountStr(e.target.value)}
                          placeholder="0"
                          className="w-full text-4xl sm:text-5xl font-bold font-mono text-[#0B1A17] bg-transparent focus:outline-none tracking-tight"
                          autoFocus
                        />
                      </div>

                      {/* Doodle Arrow Guide */}
                      <div className="flex items-center gap-2 text-[12px] font-mono text-[#1B685C] font-bold mt-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/arrows/svg/teal/curly-up-a.svg" alt="" className="w-5 h-5 -rotate-90 inline-block" />
                        <span>Type total bill or scan receipt photo</span>
                      </div>

                      {/* Quick Amount Pills */}
                      <div className="flex gap-2 mt-4">
                        {[500, 1000, 2000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setTotalAmountStr(String(amt))}
                            className={`px-4 py-1.5 rounded-full border text-[13px] font-mono font-medium cursor-pointer transition-colors ${
                              parseFloat(totalAmountStr) === amt
                                ? "border-[#1B685C] bg-[#1B685C] text-white font-bold"
                                : "border-[#D3E2DD] bg-[#F4FAF8] text-[#0B1A17] hover:bg-[#DDF5EE]"
                            }`}
                          >
                            ₹{amt.toLocaleString("en-IN")}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* What's it for? */}
                    <div className="space-y-2 pt-2">
                      <Label className="text-[13px] font-bold text-[#0B1A17]">What is it for?</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Dinner, Groceries, Movie, Trip"
                        className="h-11 rounded-[12px] border-[#D3E2DD] bg-white text-[14px] text-[#0B1A17] focus-visible:ring-[#1B685C]"
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
                              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-colors ${
                                isActive
                                  ? "bg-[#1B685C] text-white font-bold border border-[#1B685C]"
                                  : "bg-[#F4FAF8] border border-[#D3E2DD] text-[#5E726C] hover:text-[#0B1A17] hover:bg-[#DDF5EE]"
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
                      <div className="p-1 rounded-full bg-[#DDF5EE] border border-[#D3E2DD] flex text-[13px] font-medium">
                        <button
                          type="button"
                          onClick={() => setBillType("full")}
                          className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
                            billType === "full" ? "bg-[#1B685C] text-white font-bold shadow-xs" : "text-[#5E726C]"
                          }`}
                        >
                          Entire Bill
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillType("itemized")}
                          className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
                            billType === "itemized" ? "bg-[#1B685C] text-white font-bold shadow-xs" : "text-[#5E726C]"
                          }`}
                        >
                          Item-wise (Groceries / Items)
                        </button>
                      </div>

                      {/* Itemized details & OCR scan */}
                      {billType === "itemized" && (
                        <div className="mt-4 p-5 rounded-[20px] border border-[#D3E2DD] bg-[#F4FAF8] space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#0B1A17]">Item Breakdown</span>
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
                                className="h-8 text-[12px] px-3 rounded-full border-[#D3E2DD] bg-white text-[#1B685C] hover:bg-[#DDF5EE] font-bold cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                                {ocrScanning ? `Scanning ${ocrProgress}%` : "Scan receipt"}
                              </Button>
                              <span className="text-[12px] font-mono text-[#1B685C] font-bold">
                                Total: ₹{calculatedTotal.toFixed(0)}
                              </span>
                            </div>
                          </div>

                          {ocrScanning && (
                            <div className="space-y-1.5 p-3 rounded-[12px] bg-white border border-[#D3E2DD]">
                              <div className="flex justify-between text-[11px] font-bold font-mono text-[#1B685C]">
                                <span>Scanning receipt locally on device...</span>
                                <span>{ocrProgress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#DDF5EE] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#1B685C] transition-all duration-200"
                                  style={{ width: `${ocrProgress}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-[#5E726C] block">
                                100% on-device OCR. No receipt photos are uploaded.
                              </span>
                            </div>
                          )}

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {items.map((it) => (
                              <div
                                key={it.id}
                                className="flex items-center justify-between p-2.5 rounded-[12px] bg-white text-[13px] border border-[#D3E2DD]"
                              >
                                <div>
                                  <span className="font-bold text-[#0B1A17] block">{it.name}</span>
                                  <span className="text-[11px] font-mono text-[#5E726C]">
                                    ₹{it.price} {it.qty && it.qty > 1 ? `(Qty: ${it.qty})` : ""}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(it.id)}
                                  className="text-[#5E726C] hover:text-[#D6402B] p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
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
                              className="h-9 text-[13px] rounded-[10px] border-[#D3E2DD] bg-white"
                            />
                            <Input
                              placeholder="Price (₹)"
                              type="number"
                              value={newItemPrice}
                              onChange={(e) => setNewItemPrice(e.target.value)}
                              className="h-9 text-[13px] w-24 font-mono rounded-[10px] border-[#D3E2DD] bg-white"
                            />
                            <Button
                              type="button"
                              onClick={handleAddItem}
                              className="h-9 bg-[#1B685C] hover:bg-[#145248] text-white text-[12px] px-4 rounded-full font-bold cursor-pointer"
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
                        className="w-full h-12 rounded-full bg-[#1B685C] hover:bg-[#145248] disabled:opacity-40 text-white text-[15px] font-bold cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-md"
                      >
                        Who&apos;s in? →
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Who's in? */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <span className="font-['JetBrains_Mono',monospace] font-bold text-[11px] tracking-[0.14em] text-[#1B685C] uppercase block mb-1">
                        / step 02
                      </span>
                      <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0B1A17] tracking-tight">Who&apos;s in?</h2>
                      <p className="text-[13px] text-[#5E726C] mt-0.5">
                        Add friends sharing this bill. They won&apos;t need an app or account to pay.
                      </p>
                    </div>

                    {/* Organizer / Collector Card */}
                    <div className="p-4 rounded-[16px] border border-[#D3E2DD] bg-[#F4FAF8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#0B1A17]">Organizer (You)</span>
                        <button
                          type="button"
                          onClick={() => setIsEditingCollector(!isEditingCollector)}
                          className="text-[12px] font-bold text-[#1B685C] underline cursor-pointer"
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
                            className="h-9 text-[13px] rounded-[10px] border-[#D3E2DD] bg-white text-[#0B1A17]"
                          />
                          <Input
                            value={collectorUpi}
                            onChange={(e) => setCollectorUpi(e.target.value)}
                            placeholder="Your UPI ID (e.g. name@oksbi)"
                            className="h-9 text-[13px] font-mono rounded-[10px] border-[#D3E2DD] bg-white text-[#0B1A17]"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="font-bold text-[#0B1A17]">{collectorName || "You"} (you)</span>
                          <span className="font-mono text-[#5E726C]">
                            {collectorUpi || "No UPI set"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Friends Input */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-[13px] font-bold text-[#0B1A17]">Add friends</Label>
                        <button
                          type="button"
                          onClick={() => setShowFriendContactInputs(!showFriendContactInputs)}
                          className="text-[12px] text-[#1B685C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{showFriendContactInputs ? "− Hide Telegram & Email" : "+ Add friend's Telegram/Email"}</span>
                        </button>
                      </div>

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
                          className="h-10 text-[13px] rounded-[12px] border-[#D3E2DD] bg-white text-[#0B1A17]"
                        />
                        <Button
                          type="button"
                          onClick={handleAddFriends}
                          className="h-10 px-5 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-[13px] font-bold cursor-pointer"
                        >
                          Add
                        </Button>
                      </div>

                      {showFriendContactInputs && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-[12px] bg-[#F4FAF8] border border-[#D3E2DD] animate-in fade-in duration-150">
                          <div>
                            <Label className="text-[11px] font-bold text-[#0B1A17]">Telegram (Chat ID or @handle)</Label>
                            <Input
                              value={friendTelegram}
                              onChange={(e) => setFriendTelegram(e.target.value)}
                              placeholder="@username"
                              className="h-8 text-[12px] font-mono rounded-[8px] border-[#D3E2DD] bg-white mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] font-bold text-[#0B1A17]">Email (for instant notification)</Label>
                            <Input
                              value={friendEmail}
                              onChange={(e) => setFriendEmail(e.target.value)}
                              placeholder="friend@example.com"
                              className="h-8 text-[12px] font-mono rounded-[8px] border-[#D3E2DD] bg-white mt-1"
                            />
                          </div>
                        </div>
                      )}

                      {/* Doodle Arrow Guide */}
                      <div className="flex items-center gap-2 text-[12px] font-mono text-[#1B685C] font-bold">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/arrows/svg/teal/curved-down-right-a.svg" alt="" className="w-5 h-5 inline-block" />
                        <span>Add group members — zero app downloads needed to pay</span>
                      </div>

                      {/* Friend chips */}
                      <div className="min-h-[50px] pt-1">
                        {friends.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {friends.map((f) => (
                              <span
                                key={f.id}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#DDF5EE] border border-[#D3E2DD] text-[13px] font-medium text-[#0B1A17]"
                              >
                                <span>{f.name}</span>
                                {f.telegram && (
                                  <span className="text-[10px] bg-[#1B685C] text-white px-1.5 py-0.2 rounded-full font-mono">
                                    TG
                                  </span>
                                )}
                                {f.email && (
                                  <span className="text-[10px] bg-[#0B1A17] text-white px-1.5 py-0.2 rounded-full font-mono">
                                    @
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFriend(f.id)}
                                  className="text-[#5E726C] hover:text-[#D6402B] cursor-pointer ml-0.5"
                                >
                                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[12px] text-[#5E726C] py-2">
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
                        className="w-full h-12 rounded-full bg-[#1B685C] hover:bg-[#145248] disabled:opacity-40 text-white text-[15px] font-bold cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-md"
                      >
                        Next: Split it →
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Split it */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <span className="font-['JetBrains_Mono',monospace] font-bold text-[11px] tracking-[0.14em] text-[#1B685C] uppercase block mb-1">
                        / step 03
                      </span>
                      <div className="flex items-center justify-between">
                        <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0B1A17] tracking-tight">Split it</h2>
                        <span className="text-[20px] font-bold font-mono text-[#1B685C]">
                          ₹{calculatedTotal.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Mode Selector */}
                    <div className="p-1 rounded-full bg-[#DDF5EE] border border-[#D3E2DD] flex text-[13px] font-medium">
                      {(["equal", "exact", "percent", "shares"] as SplitMode[]).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setSplitMode(mode)}
                          className={`flex-1 py-1.5 rounded-full capitalize transition-all cursor-pointer ${
                            splitMode === mode ? "bg-[#1B685C] text-white font-bold shadow-xs" : "text-[#5E726C]"
                          }`}
                        >
                          {mode === "percent" ? "%" : mode}
                        </button>
                      ))}
                    </div>

                    {/* Doodle Arrow Guide */}
                    <div className="flex items-center gap-2 text-[12px] font-mono text-[#1B685C] font-bold">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/arrows/svg/teal/dashed-right.svg" alt="" className="w-5 h-5 inline-block" />
                      <span>Evenly split or custom weights — auto-rounded to 0 extra paise</span>
                    </div>

                    {/* Itemized Member Assignment Chips */}
                    {billType === "itemized" && items.length > 0 && (
                      <div className="space-y-3 p-5 rounded-[20px] border border-[#D3E2DD] bg-[#F4FAF8]">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-[#0B1A17]">Assign Items</span>
                          <span className="text-[12px] font-mono text-[#1B685C] font-bold">{items.length} items</span>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {items.map((it) => (
                            <div key={it.id} className="p-3.5 rounded-[12px] bg-white border border-[#D3E2DD] space-y-2 shadow-xs">
                              <div className="flex items-center justify-between text-[13px]">
                                <span className="font-bold text-[#0B1A17]">{it.name}</span>
                                <span className="font-mono font-bold text-[#1B685C]">₹{it.price}</span>
                              </div>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {allMembers.map((m) => {
                                  const isSelected = it.sharedBy.includes(m.id)
                                  return (
                                    <button
                                      key={m.id}
                                      type="button"
                                      onClick={() => toggleItemMember(it.id, m.id)}
                                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                                        isSelected
                                          ? "bg-[#1B685C] text-white font-bold"
                                          : "bg-[#F4FAF8] border border-[#D3E2DD] text-[#5E726C] hover:text-[#0B1A17]"
                                      }`}
                                    >
                                      {m.name.split(" ")[0]}
                                    </button>
                                  )
                                })}
                                <button
                                  type="button"
                                  onClick={() => selectAllItemMembers(it.id)}
                                  className="px-2.5 py-1 text-[11px] text-[#1B685C] font-bold underline cursor-pointer"
                                >
                                  All
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#D3E2DD]">
                          <div>
                            <Label className="text-[11px] font-mono text-[#5E726C]">GST / Tax (%)</Label>
                            <Input
                              type="number"
                              value={taxPercent}
                              onChange={(e) => setTaxPercent(e.target.value)}
                              className="h-8 text-[12px] font-mono rounded-[8px] border-[#D3E2DD] bg-white"
                              placeholder="5"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] font-mono text-[#5E726C]">Service Charge (%)</Label>
                            <Input
                              type="number"
                              value={serviceChargePercent}
                              onChange={(e) => setServiceChargePercent(e.target.value)}
                              className="h-8 text-[12px] font-mono rounded-[8px] border-[#D3E2DD] bg-white"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Member Share Cards */}
                    <div className="space-y-2.5">
                      {includeCollector && (
                        <div className="p-4 rounded-[16px] border border-[#D3E2DD] bg-[#F4FAF8] flex items-center justify-between shadow-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#DDF5EE] text-[#1B685C] font-bold text-xs flex items-center justify-center">
                              {(collectorName || "You").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-[14px] font-bold text-[#0B1A17] block">
                                {collectorName || "You"} (you)
                              </span>
                              <span className="text-[11px] font-mono text-[#5E726C]">Organizer</span>
                            </div>
                          </div>
                          <span className="text-[16px] font-bold font-mono text-[#1B685C]">
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
                            className="p-4 rounded-[16px] border border-[#D3E2DD] bg-[#F4FAF8] flex items-center justify-between shadow-xs"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#DDF5EE] text-[#1B685C] font-bold text-xs flex items-center justify-center">
                                {initials}
                              </div>
                              <div>
                                <span className="text-[14px] font-bold text-[#0B1A17] block">{f.name}</span>
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
                                  className="h-8 text-[12px] text-right font-mono rounded-[8px] border-[#D3E2DD] bg-white"
                                  placeholder="0"
                                />
                              </div>
                            ) : (
                              <span className="text-[16px] font-bold font-mono text-[#0B1A17]">
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
                        className="w-full h-12 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-[15px] font-bold cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-md"
                      >
                        Review Split →
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Looks right? */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <span className="font-['JetBrains_Mono',monospace] font-bold text-[11px] tracking-[0.14em] text-[#1B685C] uppercase block mb-1">
                        / step 04
                      </span>
                      <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0B1A17] tracking-tight">Looks right?</h2>
                    </div>

                    {/* Summary Card - Styled like a sleek receipt */}
                    <div className="rounded-[20px] border border-[#D3E2DD] bg-[#F4FAF8] p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-[#D3E2DD]">
                        <span className="text-[16px] font-bold text-[#0B1A17]">
                          {title || `${category} Split`}
                        </span>
                        <span className="text-[20px] font-bold font-mono text-[#1B685C]">
                          ₹{calculatedTotal.toFixed(0)}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {includeCollector && (
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="font-medium text-[#0B1A17]">{collectorName || "You"} (you)</span>
                            <span className="font-mono font-bold text-[#0B1A17]">
                              ₹{collectorShare.toFixed(0)}
                            </span>
                          </div>
                        )}

                        {friends.map((f) => (
                          <div key={f.id} className="flex items-center justify-between text-[13px]">
                            <span className="font-medium text-[#0B1A17]">{f.name}</span>
                            <span className="font-mono font-bold text-[#0B1A17]">
                              ₹{(friendShares[f.id] || 0).toFixed(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-bold text-[#0B1A17]">Note (optional)</Label>
                      <Input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="e.g. Note for the group"
                        className="h-10 text-[13px] rounded-[12px] border-[#D3E2DD] bg-white text-[#0B1A17]"
                      />
                    </div>

                    {/* Auto-remind if unpaid */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-[#1B685C]" strokeWidth={2} />
                        <span className="text-[13px] font-bold text-[#0B1A17]">Auto-remind if unpaid</span>
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
                            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-colors ${
                              autoRemindDays === opt.days
                                ? "bg-[#1B685C] text-white font-bold border border-[#1B685C]"
                                : "bg-[#F4FAF8] border border-[#D3E2DD] text-[#5E726C] hover:text-[#0B1A17]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#5E726C]">
                        Pre-fills reminder message for you to send. UL0 never messages your friends directly.
                      </p>
                    </div>

                    {/* Expiry selection */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#1B685C]" strokeWidth={2} />
                        <span className="text-[13px] font-bold text-[#0B1A17]">Link Expiry</span>
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
                            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-colors ${
                              expiryDays === opt.days
                                ? "bg-[#1B685C] text-white font-bold border border-[#1B685C]"
                                : "bg-[#F4FAF8] border border-[#D3E2DD] text-[#5E726C] hover:text-[#0B1A17]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Backdrop Banner Image Upload */}
                    <div className="p-4 rounded-[16px] border border-[#D3E2DD] bg-[#F4FAF8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#0B1A17]">Cover Image (optional)</span>
                        <span className="text-[11px] font-mono text-[#1B685C] font-bold">Free via FreeImage.host</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCoverModal(true)}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-[12px] border border-dashed border-[#D3E2DD] bg-white hover:bg-[#DDF5EE] cursor-pointer text-[12px] font-bold text-[#0B1A17] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#1B685C]" strokeWidth={2} />
                        <span>
                          {bannerUrl ? "Change Cover Image" : "Upload cover backdrop (FreeImage.host)"}
                        </span>
                      </button>
                      {bannerUrl && (
                        <p className="text-[11px] text-[#1B685C] font-bold">
                          ✓ Cover attached and will show at the top of the settle page.
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleCreateSplit}
                        className="w-full h-13 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-[16px] font-bold cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg"
                      >
                        {isSubmitting ? "Generating split link..." : "Create split link →"}
                      </Button>

                      {/* Doodle Arrow Guide */}
                      <div className="flex items-center justify-center gap-2 text-[12px] font-mono text-[#1B685C] font-bold mt-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/arrows/svg/teal/curly-up-a.svg" alt="" className="w-5 h-5 inline-block" />
                        <span>Direct bank-to-bank UPI · Zero fees</span>
                      </div>
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
        <DialogContent className="max-w-sm bg-white border border-[#D3E2DD] text-[#0B1A17] p-6 rounded-[24px] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#1B685C]" strokeWidth={2} />
              <span>Organizer settings</span>
            </DialogTitle>
            <DialogDescription className="text-[12px] text-[#5E726C]">
              Your name and UPI ID are stored locally on this device.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-bold text-[#0B1A17]">Your Name</Label>
              <Input
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                placeholder="Your Name"
                className="h-10 text-[13px] rounded-[10px] border-[#D3E2DD] bg-[#F4FAF8]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] font-bold text-[#0B1A17]">Default UPI ID</Label>
              <Input
                value={collectorUpi}
                onChange={(e) => setCollectorUpi(e.target.value)}
                placeholder="e.g. yourname@oksbi"
                className="h-10 text-[13px] font-mono rounded-[10px] border-[#D3E2DD] bg-[#F4FAF8]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  saveCollectorDetails(collectorName, collectorUpi)
                  toast.success("Settings saved!")
                  setShowSettings(false)
                }}
                className="flex-1 bg-[#1B685C] hover:bg-[#145248] text-white text-[13px] h-10 rounded-full font-bold cursor-pointer shadow-xs"
              >
                Save Details
              </Button>
              {hasSavedCollector && (
                <Button
                  variant="outline"
                  onClick={clearCollectorDetails}
                  className="text-[12px] h-10 px-4 rounded-full border-[#D3E2DD] text-[#D6402B] hover:bg-red-50 cursor-pointer"
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
        <DialogContent className="max-w-sm bg-white border border-[#D3E2DD] text-[#0B1A17] p-6 rounded-[24px] text-center shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold">Scan receipt or QR</DialogTitle>
            <DialogDescription className="text-[12px] text-[#5E726C]">
              Upload a bill photo or QR code to auto-parse amounts.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-[16px] bg-[#DDF5EE] text-[#1B685C] flex items-center justify-center">
              <QrCode className="w-8 h-8 text-[#1B685C]" strokeWidth={2} />
            </div>
            <p className="text-[12px] text-[#5E726C] max-w-xs">
              Runs 100% locally on your device with on-device OCR.
            </p>
            <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1B685C] text-white text-[13px] font-bold hover:bg-[#145248] shadow-md transition-transform hover:scale-105 active:scale-95">
              <Upload className="w-4 h-4" strokeWidth={2} />
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
        <DialogContent className="max-w-md bg-white border border-[#D3E2DD] text-[#0B1A17] p-6 rounded-[24px] shadow-2xl">
          <DialogHeader className="text-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#DDF5EE] text-[#1B685C] mx-auto flex items-center justify-center mb-1">
              <Check className="w-6 h-6 text-[#1B685C]" strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-[20px] font-bold">Split link ready</DialogTitle>
            <DialogDescription className="text-[12px] text-[#5E726C]">
              Share this link. Friends tap their name and pay via GPay, PhonePe, or Paytm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Settle Link Copy */}
            <div className="p-3 bg-[#F4FAF8] rounded-full border border-[#D3E2DD] flex items-center justify-between pl-4">
              <span className="text-[12px] font-mono truncate text-[#0B1A17] max-w-[240px]">
                {settleUrl}
              </span>
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(settleUrl)
                  setCopiedLink(true)
                  toast.success("Link copied!")
                  setTimeout(() => setCopiedLink(false), 2000)
                }}
                className="text-[12px] h-8 px-4 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white font-bold cursor-pointer"
              >
                {copiedLink ? "Copied" : "Copy"}
              </Button>
            </div>

            {/* In-person QR code */}
            {qrCodeData && (
              <div className="flex flex-col items-center py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeData} alt="Split QR" className="w-40 h-40 rounded-[12px] border border-[#D3E2DD] p-2 bg-white" />
                <span className="text-[11px] font-mono text-[#5E726C] mt-2">
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
              className="w-full flex items-center justify-center gap-2 h-11 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-[13px] font-bold transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4" strokeWidth={2} />
              <span>Share on WhatsApp</span>
            </a>

            {/* 1-Click Telegram & Email Manual Reminder (Strict 24h limit) */}
            <div className="p-3 bg-[#F4FAF8] rounded-[16px] border border-[#D3E2DD] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B1A17] flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#1B685C]" strokeWidth={2} />
                  <span>Telegram &amp; Email Reminder</span>
                </span>
                <span className="text-[10px] font-mono text-[#5E726C] bg-white px-2 py-0.5 rounded border border-[#D3E2DD]">
                  1 send / 24 hrs
                </span>
              </div>
              <p className="text-[11px] text-[#5E726C] leading-snug">
                Dispatches instant reminder to all friends via Pella bot.
              </p>
              <Button
                type="button"
                onClick={() => handleSendManualReminder()}
                disabled={isSendingManualReminder || hasSentReminderToday}
                className="w-full h-9 rounded-full bg-[#1B685C] hover:bg-[#145248] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer mt-1"
              >
                {isSendingManualReminder
                  ? "Dispatching..."
                  : hasSentReminderToday
                  ? "✓ Reminder sent (available in 24 hrs)"
                  : "Send 1-Click Reminder Now"}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Button
                variant="outline"
                onClick={() => router.push(`/split/${createdSlug}`)}
                className="h-10 text-[13px] rounded-full border-[#D3E2DD] font-bold text-[#0B1A17] hover:bg-[#F4FAF8] cursor-pointer"
              >
                Open Settle Page
              </Button>
              <Button
                onClick={() => router.push(manageUrl)}
                className="h-10 text-[13px] rounded-full bg-[#0B1A17] hover:bg-[#1A2E2A] text-white font-bold cursor-pointer"
              >
                Manage Split
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Split Onboarding Modal */}
      <SplitOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSave={(profile) => {
          setCollectorName(profile.name)
          setCollectorUpi(profile.upiId)
          setHasSavedCollector(true)
          setIsEditingCollector(false)
          localStorage.setItem("ul0_split_collector_name", profile.name)
          localStorage.setItem("ul0_split_collector_upi", profile.upiId)
          if (step === 0) setStep(1)
        }}
      />

      {/* FreeImage.host Cover Upload Modal */}
      <SplitCoverUploadModal
        isOpen={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        onUploaded={(url) => setBannerUrl(url)}
        currentUrl={bannerUrl}
      />
    </div>
  )
}
