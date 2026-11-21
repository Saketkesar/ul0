"use client"

import { useState, useId } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import QRCode from "qrcode"
import { UL0Icon } from "@/components/ul0-icon"
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si"

const QUICK_PRESETS = [
  { label: "Dinner 🍕", title: "Dinner" },
  { label: "Drinks 🍻", title: "Drinks" },
  { label: "Cab 🚕", title: "Cab Fare" },
  { label: "Groceries 🛒", title: "Groceries" },
  { label: "Trip 🏖️", title: "Goa Trip" },
  { label: "Party 🎉", title: "House Party" },
  { label: "Zomato 🛵", title: "Food Order" },
  { label: "Rent 🏠", title: "Flat Rent" },
]

const UPI_SUFFIXES = [
  "@oksbi",
  "@okhdfcbank",
  "@okicici",
  "@okaxis",
  "@paytm",
  "@ybl",
  "@ibl",
]

interface FriendItem {
  id: string
  name: string
  customAmount?: number
}

interface ItemizedEntry {
  id: string
  name: string
  price: number
  sharedBy: string[] // member IDs
}

export default function SplitCreatorPage() {
  const router = useRouter()
  const baseCollectorId = useId()
  const collectorId = `collector-${baseCollectorId}`

  // State
  const [title, setTitle] = useState("")
  const [collectorName, setCollectorName] = useState("")
  const [collectorUpi, setCollectorUpi] = useState("")
  const [friends, setFriends] = useState<FriendItem[]>([
    { id: "friend-1", name: "Rahul" },
    { id: "friend-2", name: "Priya" },
  ])
  const [newFriendName, setNewFriendName] = useState("")
  const [splitMode, setSplitMode] = useState<"equal" | "itemized" | "custom">("equal")
  
  // Equal Split State
  const [totalBillAmount, setTotalBillAmount] = useState<string>("1200")
  const [includeCollector, setIncludeCollector] = useState<boolean>(true)

  // Itemized Split State
  const [items, setItems] = useState<ItemizedEntry[]>([
    { id: "item-1", name: "Starters & Snacks", price: 450, sharedBy: [collectorId, "friend-1", "friend-2"] },
    { id: "item-2", name: "Main Course", price: 750, sharedBy: [collectorId, "friend-1"] },
  ])
  const [newItemName, setNewItemName] = useState("")
  const [newItemPrice, setNewItemPrice] = useState("")
  const [taxPercent, setTaxPercent] = useState<string>("5") // 5% GST
  const [serviceChargePercent, setServiceChargePercent] = useState<string>("0")

  // Submission / Modal
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Helpers
  const addFriend = () => {
    const trimmed = newFriendName.trim()
    if (!trimmed) return
    const newId = `friend-${Date.now()}`
    setFriends([...friends, { id: newId, name: trimmed }])
    setNewFriendName("")
  }

  const removeFriend = (id: string) => {
    if (friends.length <= 1) {
      toast.error("Keep at least one friend to split with")
      return
    }
    setFriends(friends.filter(f => f.id !== id))
    // Also remove from itemized sharedBy
    setItems(items.map(it => ({
      ...it,
      sharedBy: it.sharedBy.filter(mId => mId !== id)
    })))
  }

  const addItem = () => {
    const trimmedName = newItemName.trim()
    const parsedPrice = parseFloat(newItemPrice)
    if (!trimmedName || isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Please enter a valid item name and price")
      return
    }
    const allMemberIds = [
      ...(includeCollector ? [collectorId] : []),
      ...friends.map(f => f.id)
    ]
    const newItem: ItemizedEntry = {
      id: `item-${Date.now()}`,
      name: trimmedName,
      price: parsedPrice,
      sharedBy: allMemberIds,
    }
    setItems([...items, newItem])
    setNewItemName("")
    setNewItemPrice("")
  }

  const removeItem = (id: string) => {
    setItems(items.filter(it => it.id !== id))
  }

  const toggleItemMember = (itemId: string, memberId: string) => {
    setItems(items.map(item => {
      if (item.id !== itemId) return item
      const hasMember = item.sharedBy.includes(memberId)
      const nextShared = hasMember
        ? item.sharedBy.filter(m => m !== memberId)
        : [...item.sharedBy, memberId]
      return { ...item, sharedBy: nextShared }
    }))
  }

  // Calculations
  const allMembers = [
    { id: collectorId, name: collectorName.trim() || "You" },
    ...friends.map(f => ({ id: f.id, name: f.name }))
  ]

  let calculatedGrandTotal = 0
  const friendShares: { [friendId: string]: number } = {}
  let collectorShare = 0

  if (splitMode === "equal") {
    const parsedTotal = parseFloat(totalBillAmount) || 0
    calculatedGrandTotal = parsedTotal
    const splitCount = (includeCollector ? 1 : 0) + friends.length
    const perPerson = splitCount > 0 ? parsedTotal / splitCount : 0
    
    if (includeCollector) {
      collectorShare = perPerson
    }
    friends.forEach(f => {
      friendShares[f.id] = perPerson
    })
  } else if (splitMode === "itemized") {
    // 1. Calculate items subtotal
    const itemsSubtotal = items.reduce((sum, it) => sum + (it.price || 0), 0)
    
    // Member raw items cost
    const rawCosts: { [id: string]: number } = { [collectorId]: 0 }
    friends.forEach(f => { rawCosts[f.id] = 0 })

    items.forEach(it => {
      const eaters = it.sharedBy.length
      if (eaters > 0) {
        const itemPerPerson = it.price / eaters
        it.sharedBy.forEach(mId => {
          rawCosts[mId] = (rawCosts[mId] || 0) + itemPerPerson
        })
      }
    })

    // Tax & Service Charges
    const taxRate = (parseFloat(taxPercent) || 0) / 100
    const scRate = (parseFloat(serviceChargePercent) || 0) / 100
    const taxAmount = itemsSubtotal * taxRate
    const scAmount = itemsSubtotal * scRate
    const extraRatio = itemsSubtotal > 0 ? (taxAmount + scAmount) / itemsSubtotal : 0

    calculatedGrandTotal = itemsSubtotal + taxAmount + scAmount

    collectorShare = (rawCosts[collectorId] || 0) * (1 + extraRatio)
    friends.forEach(f => {
      friendShares[f.id] = (rawCosts[f.id] || 0) * (1 + extraRatio)
    })
  } else {
    // Custom Split
    let sum = 0
    friends.forEach(f => {
      const amt = f.customAmount || 0
      friendShares[f.id] = amt
      sum += amt
    })
    calculatedGrandTotal = sum + (includeCollector ? (collectorShare || 0) : 0)
  }

  // Handle Split Creation
  const handleCreateSplit = async () => {
    const cleanTitle = title.trim() || "Split Bill"
    const cleanCollectorName = collectorName.trim()
    const cleanCollectorUpi = collectorUpi.trim().toLowerCase()

    if (!cleanCollectorName) {
      toast.error("Please enter your name")
      return
    }

    if (!cleanCollectorUpi) {
      toast.error("Please enter your UPI ID so friends can pay you")
      return
    }

    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(cleanCollectorUpi)) {
      toast.error("Please enter a valid UPI ID (e.g. yourname@oksbi or phone@paytm)")
      return
    }

    if (friends.length === 0) {
      toast.error("Add at least one friend to split the bill with")
      return
    }

    if (calculatedGrandTotal <= 0) {
      toast.error("Total amount must be greater than 0")
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Prepare members
      // Collector is first member
      const membersPayload = [
        {
          id: collectorId,
          name: cleanCollectorName,
          paymentMethod: "upi",
          paymentId: cleanCollectorUpi,
          upiId: cleanCollectorUpi,
        },
        ...friends.map(f => ({
          id: f.id,
          name: f.name.trim(),
          paymentMethod: "upi",
          paymentId: "",
          upiId: "",
        }))
      ]

      // 2. Prepare settlements: each friend pays the collector
      const settlementsPayload = friends.map(f => ({
        from: f.id,
        to: collectorId,
        amount: Math.round((friendShares[f.id] || 0) * 100) / 100,
      })).filter(s => s.amount > 0)

      // 3. Prepare expense payload
      const expenseSplits = [
        ...(includeCollector && collectorShare > 0 ? [{
          memberId: collectorId,
          amount: Math.round(collectorShare * 100) / 100,
        }] : []),
        ...friends.map(f => ({
          memberId: f.id,
          amount: Math.round((friendShares[f.id] || 0) * 100) / 100,
        }))
      ]

      const expensesPayload = [
        {
          id: `exp-${Date.now()}`,
          title: cleanTitle,
          amount: Math.round(calculatedGrandTotal * 100) / 100,
          paidBy: collectorId,
          date: new Date().toISOString().split("T")[0],
          splitType: splitMode === "equal" ? "equal" : "custom",
          splits: expenseSplits,
        }
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
          totalAmount: Math.round(calculatedGrandTotal * 100) / 100,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.errors?.[0]?.message || "Failed to create split")
      }

      setCreatedSlug(data.slug)

      // Generate QR code for the share link
      const shareUrl = `${window.location.origin}/split/${data.slug}`
      const qr = await QRCode.toDataURL(shareUrl, {
        width: 320,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" }
      })
      setQrDataUrl(qr)

      toast.success("Split created! Friends can now pay via UPI.")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const shareUrl = createdSlug ? `${typeof window !== "undefined" ? window.location.origin : "https://ul0.site"}/split/${createdSlug}` : ""

  const copyShareLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopiedLink(true)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const openWhatsApp = () => {
    if (!shareUrl) return
    const text = encodeURIComponent(
      `Hey! Here's the bill split for *${title || "our bill"}* (Total: ₹${calculatedGrandTotal.toFixed(2)}).\n\nTap your name to pay directly via UPI (GPay, PhonePe, Paytm, CRED):\n${shareUrl}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Top Hero Banner */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-medium mb-4">
            <UL0Icon name="sparkles" size={16} />
            <span>Zero apps. Zero signup. Pure UPI.</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Split bills over UPI. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
              Friends never install anything.
            </span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            One person pays the bill. Friends tap their name to pay straight to your UPI app (Google Pay, PhonePe, Paytm, CRED). Direct bank-to-bank.
          </p>

          {/* Supported UPI Badges */}
          <div className="flex items-center justify-center gap-4 mt-4 text-neutral-400 text-xs">
            <span className="flex items-center gap-1.5"><SiGooglepay className="w-5 h-5 text-neutral-300" /> Google Pay</span>
            <span className="flex items-center gap-1.5"><SiPhonepe className="w-4 h-4 text-neutral-300" /> PhonePe</span>
            <span className="flex items-center gap-1.5"><SiPaytm className="w-5 h-5 text-neutral-300" /> Paytm</span>
            <span className="flex items-center gap-1.5 font-medium text-neutral-300">CRED & BHIM</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Creator Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Bill & Collector */}
            <Card className="bg-neutral-900/90 border-neutral-800 text-neutral-100 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
                  <UL0Icon name="splitbill" size={20} />
                  1. Bill & Collector Details
                </CardTitle>
                <CardDescription className="text-neutral-400 text-xs">
                  Where did you spend and who receives the money?
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Title & Quick Pills */}
                <div>
                  <Label htmlFor="bill-title" className="text-xs text-neutral-300 font-medium">
                    Bill / Event Name
                  </Label>
                  <Input
                    id="bill-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dinner at Toit, Goa Cab, Movie Tickets"
                    className="bg-neutral-950/70 border-neutral-800 text-white mt-1.5 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                  {/* Suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {QUICK_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setTitle(preset.title)}
                        className="text-xs px-2.5 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collector Info */}
                <div className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <UL0Icon name="shield" size={16} />
                    <span>Your Details (Payment Receiver)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="collector-name" className="text-xs text-neutral-400">
                        Your Name
                      </Label>
                      <Input
                        id="collector-name"
                        value={collectorName}
                        onChange={(e) => setCollectorName(e.target.value)}
                        placeholder="e.g. Saket"
                        className="bg-neutral-900 border-neutral-700 text-white mt-1 text-sm focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="collector-upi" className="text-xs text-neutral-400">
                        Your UPI ID / VPA
                      </Label>
                      <Input
                        id="collector-upi"
                        value={collectorUpi}
                        onChange={(e) => setCollectorUpi(e.target.value)}
                        placeholder="e.g. saket@oksbi"
                        className="bg-neutral-900 border-neutral-700 text-white mt-1 text-sm font-mono focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Suffix Shortcuts */}
                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-neutral-400">
                    <span className="text-neutral-500 mr-1">Quick handles:</span>
                    {UPI_SUFFIXES.map(suffix => (
                      <button
                        key={suffix}
                        type="button"
                        onClick={() => {
                          const base = collectorUpi.split("@")[0] || collectorName.toLowerCase().replace(/[^a-z0-9]/g, "")
                          setCollectorUpi(`${base}${suffix}`)
                        }}
                        className="px-1.5 py-0.5 rounded bg-neutral-800/70 hover:bg-neutral-700 text-neutral-300 text-[10px] font-mono transition-colors cursor-pointer"
                      >
                        {suffix}
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 pt-1">
                    <UL0Icon name="info" size={14} />
                    <span>Direct bank-to-bank. Friends never need to enter payment IDs or install an app.</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Friends List */}
            <Card className="bg-neutral-900/90 border-neutral-800 text-neutral-100 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
                  <UL0Icon name="team" size={20} />
                  2. Add Friends
                </CardTitle>
                <CardDescription className="text-neutral-400 text-xs">
                  Just enter friend names. They do NOT need to install anything.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Input row */}
                <div className="flex gap-2">
                  <Input
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addFriend()
                      }
                    }}
                    placeholder="Friend's name (e.g. Rahul, Priya)"
                    className="bg-neutral-950/70 border-neutral-800 text-white focus:border-amber-400"
                  />
                  <Button
                    type="button"
                    onClick={addFriend}
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold px-4 flex items-center gap-1 cursor-pointer"
                  >
                    <UL0Icon name="plus" size={14} /> Add
                  </Button>
                </div>

                {/* Friend Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {/* Collector Chip */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700 text-neutral-200 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{collectorName.trim() || "You"} (Collector)</span>
                  </div>

                  {/* Friends Chips */}
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs group hover:border-neutral-700 transition-colors"
                    >
                      <span>{friend.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFriend(friend.id)}
                        className="text-neutral-500 hover:text-red-400 ml-1 transition-colors cursor-pointer"
                        title="Remove friend"
                      >
                        <UL0Icon name="trash" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Split Mode */}
            <Card className="bg-neutral-900/90 border-neutral-800 text-neutral-100 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <UL0Icon name="billing" size={20} />
                    <span>3. How to Split</span>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Tabs value={splitMode} onValueChange={(v) => setSplitMode(v as any)} className="w-full">
                  <TabsList className="grid grid-cols-3 bg-neutral-950 p-1 border border-neutral-800 rounded-lg">
                    <TabsTrigger value="equal" className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-neutral-950">
                      Equal Split
                    </TabsTrigger>
                    <TabsTrigger value="itemized" className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-neutral-950">
                      Itemized
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-neutral-950">
                      Custom
                    </TabsTrigger>
                  </TabsList>

                  {/* Equal Split Tab */}
                  <TabsContent value="equal" className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="total-bill" className="text-xs text-neutral-300 font-medium">
                        Total Bill Amount (₹)
                      </Label>
                      <div className="relative mt-1.5">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-lg">
                          ₹
                        </span>
                        <Input
                          id="total-bill"
                          type="number"
                          value={totalBillAmount}
                          onChange={(e) => setTotalBillAmount(e.target.value)}
                          placeholder="1200"
                          className="pl-8 bg-neutral-950/70 border-neutral-800 text-white text-lg font-mono focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
                      <div>
                        <div className="text-xs font-medium text-neutral-200">Are you included in the bill?</div>
                        <div className="text-[11px] text-neutral-500">Turn off if you paid on behalf of others without eating.</div>
                      </div>
                      <Switch
                        checked={includeCollector}
                        onCheckedChange={setIncludeCollector}
                        className="data-[state=checked]:bg-amber-500"
                      />
                    </div>
                  </TabsContent>

                  {/* Itemized Split Tab */}
                  <TabsContent value="itemized" className="space-y-4 pt-4">
                    <div className="text-xs text-neutral-400">
                      Add items from your receipt. Tax & service charge will be automatically split proportionally!
                    </div>

                    {/* Add Item form */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <Input
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Item name (e.g. Pizza)"
                        className="sm:col-span-6 bg-neutral-950/70 border-neutral-800 text-xs text-white"
                      />
                      <Input
                        type="number"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        placeholder="Price (₹)"
                        className="sm:col-span-3 bg-neutral-950/70 border-neutral-800 text-xs font-mono text-white"
                      />
                      <Button
                        type="button"
                        onClick={addItem}
                        className="sm:col-span-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <UL0Icon name="plus" size={14} /> Add Item
                      </Button>
                    </div>

                    {/* Existing Items */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-neutral-200">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-amber-400">₹{item.price.toFixed(2)}</span>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="text-neutral-500 hover:text-red-400 cursor-pointer"
                              >
                                <UL0Icon name="trash" size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Member checkboxes */}
                          <div className="flex flex-wrap gap-1.5 items-center pt-1 border-t border-neutral-900">
                            <span className="text-[10px] text-neutral-500 mr-1">Shared by:</span>
                            {allMembers.map(m => {
                              const isShared = item.sharedBy.includes(m.id)
                              return (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => toggleItemMember(item.id, m.id)}
                                  className={`text-[10px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                                    isShared
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                      : "bg-neutral-900 text-neutral-500 border border-neutral-800"
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

                    {/* Taxes & Charges */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                      <div>
                        <Label className="text-[11px] text-neutral-400">GST / Tax (%)</Label>
                        <Input
                          type="number"
                          value={taxPercent}
                          onChange={(e) => setTaxPercent(e.target.value)}
                          placeholder="5"
                          className="bg-neutral-950 border-neutral-800 text-xs mt-1 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-neutral-400">Service Charge (%)</Label>
                        <Input
                          type="number"
                          value={serviceChargePercent}
                          onChange={(e) => setServiceChargePercent(e.target.value)}
                          placeholder="0"
                          className="bg-neutral-950 border-neutral-800 text-xs mt-1 text-white"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Custom Split Tab */}
                  <TabsContent value="custom" className="space-y-3 pt-4">
                    <div className="text-xs text-neutral-400">
                      Enter the exact amount each person owes:
                    </div>
                    {friends.map((friend) => (
                      <div key={friend.id} className="flex items-center justify-between gap-4 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-xs font-medium text-neutral-200">{friend.name}</span>
                        <div className="relative w-32">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-500 font-mono">₹</span>
                          <Input
                            type="number"
                            value={friend.customAmount ?? ""}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0
                              setFriends(friends.map(f => f.id === friend.id ? { ...f, customAmount: val } : f))
                            }}
                            placeholder="0"
                            className="pl-6 h-8 text-xs font-mono bg-neutral-900 border-neutral-700 text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Side Preview & Settle Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-20 space-y-4">
              {/* Paper Receipt Card */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
                {/* Decorative receipt top jagged edge effect */}
                <div className="border-b border-dashed border-neutral-700 pb-4 mb-4">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span>UL0 SPLIT BILL</span>
                    <span className="font-mono">{new Date().toLocaleDateString("en-IN")}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {title.trim() || "Untitled Bill"}
                  </h3>
                  <div className="text-xs text-neutral-400 mt-1">
                    Collector: <span className="text-amber-400 font-medium">{collectorName.trim() || "You"}</span>
                    {collectorUpi && <span className="font-mono text-neutral-500 ml-1">({collectorUpi})</span>}
                  </div>
                </div>

                {/* Live Settlement Breakdown */}
                <div className="space-y-3 mb-5">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Who Owes What
                  </div>

                  {includeCollector && (
                    <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/60 text-neutral-300">
                      <span>{collectorName.trim() || "You"} (Your share)</span>
                      <span className="font-mono font-medium text-neutral-400">₹{collectorShare.toFixed(2)}</span>
                    </div>
                  )}

                  {friends.map(f => (
                    <div key={f.id} className="flex items-center justify-between text-xs py-1 border-b border-neutral-800/60 text-neutral-200">
                      <span className="font-medium">{f.name}</span>
                      <span className="font-mono font-semibold text-amber-400">₹{(friendShares[f.id] || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Grand Total */}
                <div className="pt-2 border-t border-dashed border-neutral-700 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400">Total Bill</div>
                    <div className="text-[11px] text-neutral-500">
                      {(includeCollector ? 1 : 0) + friends.length} people
                    </div>
                  </div>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    ₹{calculatedGrandTotal.toFixed(2)}
                  </div>
                </div>

                {/* Settle Action Button */}
                <div className="mt-6">
                  <Button
                    type="button"
                    onClick={handleCreateSplit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold py-6 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Generating Settle Link...</span>
                    ) : (
                      <>
                        <span>Create Split & Get Settle Link</span>
                        <UL0Icon name="arrowright" size={16} />
                      </>
                    )}
                  </Button>
                </div>

                {/* Security Reassurance */}
                <p className="text-[11px] text-neutral-500 text-center mt-3 flex items-center justify-center gap-1.5">
                  <UL0Icon name="shield" size={14} />
                  <span>Direct UPI transfer. UL0 never holds your money.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share / Success Modal */}
      <Dialog open={Boolean(createdSlug)} onOpenChange={(open) => !open && setCreatedSlug(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100 max-w-md p-6">
          <DialogHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-2">
              <UL0Icon name="check" size={24} />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Split Created! Ready to Settle
            </DialogTitle>
            <DialogDescription className="text-neutral-400 text-xs">
              Share this link with your friends. They can tap their name and pay straight to your UPI ID without downloading anything!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Scannable QR code */}
            {qrDataUrl && (
              <div className="bg-white p-3 rounded-xl max-w-[200px] mx-auto shadow-md">
                <img src={qrDataUrl} alt="Bill QR Code" className="w-full h-auto rounded" />
                <div className="text-[10px] text-neutral-800 font-mono text-center mt-1 font-semibold">
                  Scan to Open & Pay
                </div>
              </div>
            )}

            {/* Share Link Field */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-950 border border-neutral-800">
              <input
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-neutral-300 font-mono flex-1 outline-none px-2 select-all"
              />
              <Button
                type="button"
                onClick={copyShareLink}
                size="sm"
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs h-8 px-3 cursor-pointer"
              >
                {copiedLink ? <UL0Icon name="check" size={14} /> : <UL0Icon name="copy" size={14} />}
              </Button>
            </div>

            {/* 1-Click WhatsApp Button */}
            <Button
              type="button"
              onClick={openWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-5 flex items-center justify-center gap-2 text-sm shadow-lg cursor-pointer"
            >
              <UL0Icon name="whatsapp" size={18} />
              <span>Share Bill on WhatsApp</span>
            </Button>

            {/* Open Settle Page */}
            <Button
              type="button"
              onClick={() => router.push(`/split/${createdSlug}`)}
              variant="outline"
              className="w-full border-neutral-700 bg-neutral-800/60 hover:bg-neutral-700 text-neutral-200 text-xs py-4 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open Settle Page Now</span>
              <UL0Icon name="external" size={14} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
