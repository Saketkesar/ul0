"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Plus, 
  Trash2, 
  Users, 
  Receipt, 
  Calculator, 
  Link2, 
  Loader2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  Banknote,
  Wallet,
  CreditCard,
  Smartphone
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

// Payment method icons component
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

// Payment methods by region
const PAYMENT_METHODS = {
  upi: { name: "UPI", countries: ["IN"], placeholder: "username@upi", urlPrefix: "upi://pay?pa=" },
  paypal: { name: "PayPal", countries: ["GLOBAL"], placeholder: "email or PayPal.me username", urlPrefix: "https://paypal.me/" },
  venmo: { name: "Venmo", countries: ["US"], placeholder: "@username", urlPrefix: "https://venmo.com/" },
  cashapp: { name: "Cash App", countries: ["US", "GB"], placeholder: "$cashtag", urlPrefix: "https://cash.app/" },
  pix: { name: "PIX", countries: ["BR"], placeholder: "CPF, email, phone, or random key", urlPrefix: "" },
  wise: { name: "Wise", countries: ["GLOBAL"], placeholder: "email", urlPrefix: "" },
  revolut: { name: "Revolut", countries: ["EU", "GB", "US"], placeholder: "@username or phone", urlPrefix: "https://revolut.me/" },
  gcash: { name: "GCash", countries: ["PH"], placeholder: "phone number", urlPrefix: "" },
  grabpay: { name: "GrabPay", countries: ["SG", "MY", "PH", "TH", "VN", "ID"], placeholder: "phone number", urlPrefix: "" },
  paytm: { name: "Paytm", countries: ["IN"], placeholder: "phone or Paytm ID", urlPrefix: "" },
  other: { name: "Other / Bank Transfer", countries: ["GLOBAL"], placeholder: "Bank details or payment info", urlPrefix: "" },
} as const

type PaymentMethod = keyof typeof PAYMENT_METHODS

interface Member {
  id: string
  name: string
  paymentMethod: PaymentMethod
  paymentId: string
  upiId?: string // Keep for backward compatibility
}

interface Expense {
  id: string
  title: string
  amount: number
  paidBy: string
  date: string
  splitType: "equal" | "custom"
  splits: { memberId: string; amount: number }[]
}

interface Settlement {
  from: string
  to: string
  amount: number
}

type CurrencyCode = "INR" | "USD"

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
}

// Detect user's country from IP (with fallback to timezone)
const detectCountryFromIP = async (): Promise<string> => {
  try {
    // Try multiple free IP geolocation APIs
    const apis = [
      'https://ipapi.co/country/',
      'https://api.country.is/',
    ]
    
    for (const api of apis) {
      try {
        const response = await fetch(api, { 
          signal: AbortSignal.timeout(3000) // 3 second timeout
        })
        if (response.ok) {
          if (api.includes('ipapi.co')) {
            const country = await response.text()
            if (country && country.length === 2) return country
          } else {
            const data = await response.json()
            if (data.country) return data.country
          }
        }
      } catch {
        continue // Try next API
      }
    }
  } catch {
    // Fallback to timezone detection
  }
  
  return detectCountryFromTimezone()
}

// Fallback: Detect user's country from timezone/locale
const detectCountryFromTimezone = (): string => {
  if (typeof window === 'undefined') return 'US'
  
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const locale = navigator.language || 'en-US'
  
  // Map common timezones to countries
  if (timezone.includes('Kolkata') || timezone.includes('India') || locale.includes('IN') || locale.startsWith('hi')) return 'IN'
  if (timezone.includes('Sao_Paulo') || timezone.includes('Brazil') || locale.includes('BR') || locale.startsWith('pt-BR')) return 'BR'
  if (timezone.includes('London') || timezone.includes('Europe/London')) return 'GB'
  if (timezone.includes('Europe/')) return 'EU'
  if (timezone.includes('Manila') || locale.includes('PH')) return 'PH'
  if (timezone.includes('Singapore')) return 'SG'
  if (timezone.includes('Bangkok') || locale.includes('TH') || locale.startsWith('th')) return 'TH'
  if (timezone.includes('Jakarta') || locale.includes('ID') || locale.startsWith('id')) return 'ID'
  if (timezone.includes('Kuala_Lumpur') || locale.includes('MY')) return 'MY'
  if (timezone.includes('Ho_Chi_Minh') || locale.includes('VN') || locale.startsWith('vi')) return 'VN'
  if (timezone.includes('America/') && !timezone.includes('Sao_Paulo')) return 'US'
  
  return 'US'
}

// Get recommended payment methods for a country
const getRecommendedMethods = (country: string): PaymentMethod[] => {
  const recommended: PaymentMethod[] = []
  const others: PaymentMethod[] = []
  
  // Separate country-specific and global methods
  ;(Object.entries(PAYMENT_METHODS) as [PaymentMethod, typeof PAYMENT_METHODS[PaymentMethod]][]).forEach(([method, info]) => {
    const countries = info.countries as readonly string[]
    if (countries.includes(country)) {
      recommended.push(method)
    } else if (countries.includes('GLOBAL')) {
      recommended.push(method)
    } else {
      others.push(method)
    }
  })
  
  // Sort recommended: country-specific first, then global, then add all others
  const sorted = recommended.sort((a, b) => {
    const countriesA = PAYMENT_METHODS[a].countries as readonly string[]
    const countriesB = PAYMENT_METHODS[b].countries as readonly string[]
    const aGlobal = countriesA.includes('GLOBAL')
    const bGlobal = countriesB.includes('GLOBAL')
    if (aGlobal && !bGlobal) return 1
    if (!aGlobal && bGlobal) return -1
    return 0
  })
  
  // Always include ALL payment methods (recommended first, then others)
  return [...sorted, ...others]
}

// Get default payment method for country
const getDefaultMethod = (country: string): PaymentMethod => {
  if (country === 'IN') return 'upi'
  if (country === 'US') return 'venmo'
  if (country === 'BR') return 'pix'
  if (country === 'PH') return 'gcash'
  if (['SG', 'MY', 'TH', 'VN', 'ID'].includes(country)) return 'grabpay'
  if (['GB', 'EU'].includes(country)) return 'revolut'
  return 'paypal'
}

export default function SplitExpensePage() {
  const [step, setStep] = useState<"members" | "expenses" | "summary">("members")
  const [groupName, setGroupName] = useState("")
  const [userCountry, setUserCountry] = useState<string>('US')
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<PaymentMethod>('paypal')
  const [currency, setCurrency] = useState<CurrencyCode>("INR")
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "", paymentMethod: "paypal", paymentId: "" },
    { id: "2", name: "", paymentMethod: "paypal", paymentId: "" },
  ])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  // Server-side field errors: map of path -> message
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({})
  const [expandedExpense, setExpandedExpense] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0) // Rate limit cooldown in seconds
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)

  // Countdown timer for rate limit
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setRateLimitError(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldown])

  // Detect country and set default payment method on mount
  useEffect(() => {
    const initCountry = async () => {
      const country = await detectCountryFromIP()
      setUserCountry(country)
      const defaultMethod = getDefaultMethod(country)
      setDefaultPaymentMethod(defaultMethod)
      // Update initial members with detected payment method
      setMembers([
        { id: "1", name: "", paymentMethod: defaultMethod, paymentId: "" },
        { id: "2", name: "", paymentMethod: defaultMethod, paymentId: "" },
      ])
    }
    initCountry()
  }, [])

  // Member functions
  const addMember = () => {
    setMembers([...members, { id: Date.now().toString(), name: "", paymentMethod: defaultPaymentMethod, paymentId: "" }])
  }

  const removeMember = (id: string) => {
    if (members.length > 2) {
      setMembers(members.filter((m) => m.id !== id))
      // Remove member from all expenses
      setExpenses(expenses.map(exp => ({
        ...exp,
        splits: exp.splits.filter(s => s.memberId !== id),
        paidBy: exp.paidBy === id ? "" : exp.paidBy
      })))
    }
  }

  const updateMember = (id: string, field: keyof Member, value: string | PaymentMethod) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  // Expense functions
  const addExpense = () => {
    const today = new Date().toISOString().split('T')[0]
    const newExpense: Expense = {
      id: Date.now().toString(),
      title: "",
      amount: 0,
      paidBy: members[0]?.id || "",
      date: today,
      splitType: "equal",
      splits: members.map(m => ({ memberId: m.id, amount: 0 }))
    }
    setExpenses([...expenses, newExpense])
    setExpandedExpense(newExpense.id)
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const updateExpense = (id: string, field: keyof Expense, value: unknown) => {
    setExpenses(expenses.map((e) => {
      if (e.id !== id) return e
      const updated = { ...e, [field]: value }
      
      // Recalculate splits if amount or splitType changes
      if (field === "amount" || field === "splitType") {
        if (updated.splitType === "equal") {
          const perPerson = Math.ceil((updated.amount / members.length) * 100) / 100
          updated.splits = members.map(m => ({ memberId: m.id, amount: perPerson }))
        }
      }
      
      return updated
    }))
  }

  const updateExpenseSplit = (expenseId: string, memberId: string, amount: number) => {
    setExpenses(expenses.map((e) => {
      if (e.id !== expenseId) return e
      return {
        ...e,
        splits: e.splits.map(s => 
          s.memberId === memberId ? { ...s, amount } : s
        )
      }
    }))
  }

  // Calculate settlements
  const calculateSettlements = (): Settlement[] => {
    const balances: Record<string, number> = {}
    
    // Initialize balances
    members.forEach(m => { balances[m.id] = 0 })
    
    // Calculate net balance for each member
    expenses.forEach(exp => {
      // Person who paid gets credit
      balances[exp.paidBy] = (balances[exp.paidBy] || 0) + exp.amount
      
      // Everyone who owes gets debit
      exp.splits.forEach(split => {
        balances[split.memberId] = (balances[split.memberId] || 0) - split.amount
      })
    })
    
    // Calculate settlements using greedy algorithm
    const settlements: Settlement[] = []
    const debtors = Object.entries(balances).filter(([, b]) => b < -0.01).map(([id, b]) => ({ id, balance: b }))
    const creditors = Object.entries(balances).filter(([, b]) => b > 0.01).map(([id, b]) => ({ id, balance: b }))
    
    let i = 0, j = 0
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i]
      const creditor = creditors[j]
      
      const amount = Math.min(-debtor.balance, creditor.balance)
      if (amount > 0.01) {
        settlements.push({
          from: debtor.id,
          to: creditor.id,
          amount: Math.round(amount * 100) / 100
        })
      }
      
      debtor.balance += amount
      creditor.balance -= amount
      
      if (Math.abs(debtor.balance) < 0.01) i++
      if (Math.abs(creditor.balance) < 0.01) j++
    }
    
    return settlements
  }

  const getMemberName = (id: string) => members.find(m => m.id === id)?.name || "Unknown"
  const getMember = (id: string) => members.find(m => m.id === id)

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const formatMoney = (amount: number) => `${CURRENCY_SYMBOLS[currency]}${amount.toFixed(2)}`
  const settlements = calculateSettlements()

  // Generate shareable link directly
  const generateSplitLink = async () => {
    setIsGenerating(true)
    setRateLimitError(null)
    setServerFieldErrors({})

    // show server validation error
    let serverError: string | null = null
    try {
      const response = await fetch("/api/split/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: groupName,
          members,
          expenses,
          settlements,
          totalAmount: totalExpenses
        }),
      })
      
      const data = await response.json()
      if (response.ok) {
        setGeneratedLink(`${window.location.origin}/split/${data.slug}`)
      } else if (response.status === 429) {
        // Rate limited
        const retryAfter = data.retryAfter || 60
        setCooldown(retryAfter)
        setRateLimitError(`Please wait ${retryAfter} seconds before creating another split session.`)
      } else if (response.status === 400) {
        // Validation or bad request - expect structured { errors: [{ path, message }] }
        if (data && Array.isArray(data.errors)) {
          const map: Record<string, string> = {}
          for (const err of data.errors) {
            if (err && typeof err.path === 'string') map[err.path] = err.message || 'Invalid value'
          }
          setServerFieldErrors(map)
          // Also set a generic rateLimitError so the user sees a message summary
          setRateLimitError('Please fix the highlighted fields')
        } else {
          serverError = data.error || 'Invalid request payload'
          setRateLimitError(serverError)
        }
      }
    } catch (error) {
      console.error("Failed to generate link:", error)
    } finally {
      setIsGenerating(false)
    }
  }


  const copyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink)
    }
  }

  const isStepValid = () => {
    if (step === "members") {
      // Also ensure there are no server field errors for member fields
      const hasMemberFieldErrors = Object.keys(serverFieldErrors).some(k => k.startsWith('members['))
      return groupName.trim() && members.every(m => m.name.trim() && m.paymentId.trim()) && !hasMemberFieldErrors
    }
    if (step === "expenses") {
      return expenses.length > 0 && expenses.every(e => e.title.trim() && e.amount > 0 && e.paidBy)
    }
    return true
  }

  // Generate payment link based on method
  const getPaymentLink = (member: Member, amount: number): string => {
    const method = PAYMENT_METHODS[member.paymentMethod]
    const paymentId = member.paymentId
    
    switch (member.paymentMethod) {
      case 'upi':
        return `upi://pay?pa=${encodeURIComponent(paymentId)}&am=${amount}&cu=INR`
      case 'paypal':
        // Handle PayPal.me links or emails
        if (paymentId.includes('@')) {
          return `https://paypal.com/paypalme/my/profile` // Can't deep link with email
        }
        return `https://paypal.me/${paymentId}/${amount}`
      case 'venmo':
        const venmoId = paymentId.startsWith('@') ? paymentId.slice(1) : paymentId
        return `https://venmo.com/${venmoId}?txn=pay&amount=${amount}`
      case 'cashapp':
        const cashTag = paymentId.startsWith('$') ? paymentId.slice(1) : paymentId
        return `https://cash.app/$${cashTag}/${amount}`
      case 'revolut':
        const revolutId = paymentId.startsWith('@') ? paymentId.slice(1) : paymentId
        return `https://revolut.me/${revolutId}`
      case 'pix':
      case 'wise':
      case 'gcash':
      case 'grabpay':
      case 'paytm':
      case 'other':
      default:
        return '' // These don't have universal deep links
    }
  }

  // Get recommended payment methods for display
  const recommendedMethods = getRecommendedMethods(userCountry)

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />

        <main className="flex-1 py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6 text-center sm:mb-8">
              <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Split Expenses</h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Add members, track expenses, and settle up in INR or USD
              </p>
            </div>

            {/* Progress Steps */}
          <div className="mx-auto mb-6 flex max-w-2xl items-center justify-center gap-2 sm:mb-8">
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              step === "members" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              step === "expenses" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Expenses</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              step === "summary" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Summary</span>
            </div>
          </div>

          <div className="mx-auto max-w-2xl">
            {/* Step 1: Members */}
            {step === "members" && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Users className="h-5 w-5 text-primary" />
                    Add Members
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Add everyone who will be splitting expenses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="groupName" className="text-sm">
                      Group / Event Name
                    </Label>
                    <Input
                      id="groupName"
                      placeholder="Trip to Goa, Dinner Party, etc."
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Members ({members.length})</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addMember}
                        className="gap-1 bg-transparent"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {members.map((member, index) => (
                        <div
                          key={member.id}
                          className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
                            <div className="flex-1 space-y-1">
                              <Label className="text-xs text-muted-foreground">Name</Label>
                              <Input
                                placeholder={`Person ${index + 1}`}
                                value={member.name}
                                onChange={(e) => updateMember(member.id, "name", e.target.value)}
                                className={`h-9 ${serverFieldErrors[`members[${index}].name`] ? 'border-destructive' : ''}`}
                              />
                              {serverFieldErrors[`members[${index}].name`] && (
                                <p className="text-xs text-destructive mt-1">{serverFieldErrors[`members[${index}].name`]}</p>
                              )}
                            </div>
                            <div className="w-full sm:w-36 space-y-1">
                              <Label className="text-xs text-muted-foreground">Payment Method</Label>
                              <Select
                                value={member.paymentMethod}
                                onValueChange={(value) => updateMember(member.id, "paymentMethod", value as PaymentMethod)}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {recommendedMethods.map((method) => (
                                    <SelectItem key={method} value={method}>
                                      <span className="flex items-center gap-2">
                                        <PaymentIcon method={method} className="h-4 w-4" />
                                        {PAYMENT_METHODS[method].name}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2 sm:gap-3 items-end">
                            <div className="flex-1 space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                {PAYMENT_METHODS[member.paymentMethod].name} ID
                              </Label>
                              <Input
                                placeholder={PAYMENT_METHODS[member.paymentMethod].placeholder}
                                value={member.paymentId}
                                onChange={(e) => updateMember(member.id, "paymentId", e.target.value)}
                                className={`h-9 ${serverFieldErrors[`members[${index}].paymentId`] ? 'border-destructive' : ''}`}
                              />
                              {serverFieldErrors[`members[${index}].paymentId`] && (
                                <p className="text-xs text-destructive mt-1">{serverFieldErrors[`members[${index}].paymentId`]}</p>
                              )}
                            </div>
                            {members.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 flex-shrink-0 text-destructive hover:bg-destructive/10"
                                onClick={() => removeMember(member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setStep("expenses")}
                    disabled={!isStepValid()}
                  >
                    Continue to Expenses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Expenses */}
            {step === "expenses" && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Receipt className="h-5 w-5 text-primary" />
                    Add Expenses
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Add all expenses and who paid for them
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Currency</Label>
                      <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
                        <SelectTrigger className="h-10 w-full sm:w-44">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {expenses.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-8 text-center">
                        <Receipt className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No expenses added yet</p>
                      </div>
                    ) : (
                      expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="rounded-lg border border-border bg-muted/20 p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-3">
                              <div className="flex flex-col gap-2 sm:flex-row">
                                <Input
                                  placeholder="Expense title"
                                  value={expense.title}
                                  onChange={(e) => updateExpense(expense.id, "title", e.target.value)}
                                  className="h-9"
                                />
                                <div className="relative flex items-center">
                                  <Banknote className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={expense.amount || ""}
                                    onChange={(e) => updateExpense(expense.id, "amount", Number(e.target.value) || 0)}
                                    className="h-9 w-full pl-8 sm:w-32"
                                  />
                                </div>
                              </div>

                              {/* Date Picker */}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div className="flex gap-1 flex-wrap">
                                  {/* Quick date buttons */}
                                  <Button
                                    type="button"
                                    variant={expense.date === new Date().toISOString().split('T')[0] ? "default" : "outline"}
                                    size="sm"
                                    className="h-7 text-xs px-2"
                                    onClick={() => updateExpense(expense.id, "date", new Date().toISOString().split('T')[0])}
                                  >
                                    Today
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={expense.date === new Date(Date.now() - 86400000).toISOString().split('T')[0] ? "default" : "outline"}
                                    size="sm"
                                    className="h-7 text-xs px-2"
                                    onClick={() => updateExpense(expense.id, "date", new Date(Date.now() - 86400000).toISOString().split('T')[0])}
                                  >
                                    Yesterday
                                  </Button>
                                  <div className="relative">
                                    <Input
                                      type="date"
                                      value={expense.date}
                                      onChange={(e) => updateExpense(expense.id, "date", e.target.value)}
                                      className="h-7 text-xs w-32 cursor-pointer"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                  <Label className="text-xs text-muted-foreground whitespace-nowrap">Paid by:</Label>
                                  <Select
                                    value={expense.paidBy}
                                    onValueChange={(v: string) => updateExpense(expense.id, "paidBy", v)}
                                  >
                                    <SelectTrigger className="h-8 w-full sm:w-40">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {members.map(m => (
                                        <SelectItem key={m.id} value={m.id}>
                                          {m.name || `Person ${members.indexOf(m) + 1}`}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Label className="text-xs text-muted-foreground whitespace-nowrap">Split:</Label>
                                  <div className="flex gap-1">
                                    <Button
                                      type="button"
                                      variant={expense.splitType === "equal" ? "default" : "outline"}
                                      size="sm"
                                      className="h-8 text-xs"
                                      onClick={() => updateExpense(expense.id, "splitType", "equal")}
                                    >
                                      50-50
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={expense.splitType === "custom" ? "default" : "outline"}
                                      size="sm"
                                      className="h-8 text-xs"
                                      onClick={() => updateExpense(expense.id, "splitType", "custom")}
                                    >
                                      Custom
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {expense.splitType === "custom" && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-full justify-between text-xs"
                                  onClick={() => setExpandedExpense(expandedExpense === expense.id ? null : expense.id)}
                                >
                                  <span>Edit individual splits</span>
                                  {expandedExpense === expense.id ? (
                                    <ChevronUp className="h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )}
                                </Button>
                              )}

                              {expense.splitType === "custom" && expandedExpense === expense.id && (
                                <div className="space-y-2 border-t border-border pt-2">
                                  {members.map(m => (
                                    <div key={m.id} className="flex items-center justify-between gap-2">
                                      <span className="text-xs text-muted-foreground">
                                        {m.name || `Person ${members.indexOf(m) + 1}`}
                                      </span>
                                      <div className="relative flex items-center">
                                        <Banknote className="absolute left-2 h-3 w-3 text-muted-foreground" />
                                        <Input
                                          type="number"
                                          value={expense.splits.find(s => s.memberId === m.id)?.amount || ""}
                                          onChange={(e) => updateExpenseSplit(expense.id, m.id, Number(e.target.value) || 0)}
                                          className="h-7 w-24 pl-6 text-xs"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0 text-destructive hover:bg-destructive/10"
                              onClick={() => removeExpense(expense.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 bg-transparent"
                    onClick={addExpense}
                  >
                    <Plus className="h-4 w-4" />
                    Add Expense
                  </Button>

                  {expenses.length > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
                      <span className="text-sm font-medium">Total Expenses</span>
                      <span className="text-lg font-bold text-primary">{formatMoney(totalExpenses)}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setStep("members")}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => setStep("summary")}
                      disabled={!isStepValid()}
                    >
                      View Summary
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Summary */}
            {step === "summary" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Calculator className="h-5 w-5 text-primary" />
                      {groupName}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Total: {formatMoney(totalExpenses)} • {members.length} people • {expenses.length} expenses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Expenses Summary */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Expenses</Label>
                      {expenses.map((exp) => (
                        <div key={exp.id} className="flex items-center justify-between rounded-lg bg-muted/20 p-3">
                          <div>
                            <p className="font-medium text-sm">{exp.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Paid by {getMemberName(exp.paidBy)}
                            </p>
                          </div>
                          <span className="font-semibold">{formatMoney(exp.amount)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Settlements */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Who Owes Who</Label>
                      {settlements.length === 0 ? (
                        <div className="rounded-lg bg-green-500/10 p-3 text-center text-sm text-green-600">
                          Everyone is settled up! 🎉
                        </div>
                      ) : (
                        settlements.map((settlement, idx) => {
                          const toMember = getMember(settlement.to)
                          const paymentLink = toMember ? getPaymentLink(toMember, settlement.amount) : ''
                          return (
                            <div key={idx} className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{getMemberName(settlement.from)}</span>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-sm">{getMemberName(settlement.to)}</span>
                                </div>
                                <span className="font-bold text-primary">{formatMoney(settlement.amount)}</span>
                              </div>
                              {toMember && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <PaymentIcon method={toMember.paymentMethod} className="h-3 w-3" />
                                    {PAYMENT_METHODS[toMember.paymentMethod].name}
                                  </span>
                                  <span className="truncate">{toMember.paymentId}</span>
                                  {toMember.paymentMethod === 'upi' && currency === 'USD' && (
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                      UPI stays INR
                                    </span>
                                  )}
                                  {paymentLink && (
                                    <a 
                                      href={paymentLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90"
                                    >
                                      Pay Now
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>

                {generatedLink ? (
                  <Card className="border-primary">
                    <CardContent className="pt-6 space-y-4">
                      <div className="text-center">
                        <Link2 className="mx-auto mb-2 h-8 w-8 text-primary" />
                        <p className="text-sm font-medium mb-2">Your split link is ready!</p>
                        <p className="text-xs text-muted-foreground mb-4">Valid for 24 hours</p>
                      </div>
                      <div className="flex gap-2">
                        <Input value={generatedLink} readOnly className="flex-1 text-xs" />
                        <Button onClick={copyLink} variant="outline">
                          Copy
                        </Button>
                      </div>
                      <Button className="w-full" asChild>
                        <a href={generatedLink} target="_blank" rel="noopener noreferrer">
                          Open Split Page
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {rateLimitError && (
                      <p className="text-sm text-red-500 text-center mb-2">
                        {cooldown > 0 ? `Please wait ${cooldown} seconds before creating another split session.` : rateLimitError}
                      </p>
                    )}
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={generateSplitLink}
                      disabled={isGenerating || cooldown > 0}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : cooldown > 0 ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4" />
                          Wait {cooldown}s
                        </>
                      ) : (
                        <>
                          <Link2 className="mr-2 h-4 w-4" />
                          Generate Split Link
                        </>
                      )}
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setStep("expenses")}
                >
                  Back to Expenses
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </>
  )
}
