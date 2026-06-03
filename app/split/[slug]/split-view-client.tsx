"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  ArrowRight, 
  Download, 
  QrCode, 
  Clock, 
  Users, 
  Receipt,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Wallet,
  Smartphone,
  CreditCard
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
  SiGooglepay
} from "react-icons/si"
import { FaMoneyBillTransfer } from "react-icons/fa6"
import { BsBank2 } from "react-icons/bs"
import { AdBanner } from "@/components/ad-banner"

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

interface Member {
  id: string
  name: string
  paymentMethod?: PaymentMethod
  paymentId?: string
  upiId?: string // Legacy support
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
}

interface SplitSession {
  id: string
  slug: string
  title: string
  created_at: string
  expires_at: string
  members: Member[]
  expenses: Expense[]
  settlements: Settlement[]
  total_amount: number
}

interface Props {
  session: SplitSession
  slug: string
}

export function SplitViewClient({ session, slug }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})

  const getMemberName = (id: string) => session.members.find(m => m.id === id)?.name || "Unknown"
  const getMember = (id: string) => session.members.find(m => m.id === id)
  
  // Get payment ID - support both old (upiId) and new (paymentId) formats
  const getPaymentId = (member: Member) => member.paymentId || member.upiId || ""
  const getPaymentMethod = (member: Member): PaymentMethod => member.paymentMethod || "upi"

  const expiresAt = new Date(session.expires_at)
  const hoursLeft = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)))
  const minutesLeft = Math.max(0, Math.floor(((expiresAt.getTime() - Date.now()) % (1000 * 60 * 60)) / (1000 * 60)))

  // Generate payment link based on payment method
  const getPaymentLink = (member: Member, amount: number): string => {
    const paymentId = getPaymentId(member)
    const method = getPaymentMethod(member)
    const note = encodeURIComponent(`${session.title} - Split payment`)
    
    switch (method) {
      case 'upi':
        return `upi://pay?pa=${paymentId}&pn=${encodeURIComponent(member.name)}&am=${amount.toFixed(2)}&tn=${note}`
      case 'paypal':
        if (paymentId.includes('@')) return ''
        return `https://paypal.me/${paymentId}/${amount.toFixed(2)}`
      case 'venmo':
        const venmoId = paymentId.startsWith('@') ? paymentId.slice(1) : paymentId
        return `https://venmo.com/${venmoId}?txn=pay&amount=${amount.toFixed(2)}`
      case 'cashapp':
        const cashTag = paymentId.startsWith('$') ? paymentId.slice(1) : paymentId
        return `https://cash.app/$${cashTag}/${amount.toFixed(2)}`
      case 'revolut':
        const revolutId = paymentId.startsWith('@') ? paymentId.slice(1) : paymentId
        return `https://revolut.me/${revolutId}`
      default:
        return ''
    }
  }

  // Legacy UPI link for backward compatibility
  const getUPILink = (upiId: string, name: string, amount: number) => {
    const note = encodeURIComponent(`${session.title} - Split payment`)
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount.toFixed(2)}&tn=${note}`
  }

  const generateQR = async (settlement: Settlement, idx: number) => {
    const toMember = session.members.find(m => m.id === settlement.to)
    if (!toMember) return
    const paymentMethod = getPaymentMethod(toMember)
    const paymentId = getPaymentId(toMember)

    // For UPI, prefer server-generated PNG for better compatibility
    if (paymentMethod === 'upi' && paymentId) {
      try {
        const params = new URLSearchParams({ upi: paymentId, name: toMember.name || '', amount: settlement.amount.toFixed(2) })
        const resp = await fetch(`/api/upi/qr?${params.toString()}`)
        if (!resp.ok) throw new Error('QR fetch failed')
        const blob = await resp.blob()
        const url = URL.createObjectURL(blob)
        setQrCodes(prev => ({ ...prev, [idx.toString()]: url }))
        return
      } catch (err) {
        console.error('Server QR generation failed, falling back to client QR:', err)
        // fallthrough to client QR generation
      }
    }

    const paymentLink = getPaymentLink(toMember, settlement.amount)
    if (!paymentLink) return

    try {
      const qrDataUrl = await QRCode.toDataURL(paymentLink, { width: 200, margin: 2 })
      setQrCodes(prev => ({ ...prev, [idx.toString()]: qrDataUrl }))
    } catch (err) {
      console.error("QR generation failed:", err)
    }
  }

  const copyPaymentId = async (paymentId: string) => {
    await navigator.clipboard.writeText(paymentId)
    setCopiedId(paymentId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const downloadPDF = async () => {
    if (!contentRef.current) return
    
    try {
      const element = contentRef.current
      
      // Create canvas from HTML element  
      const canvas = await (html2canvas as Function)(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      })
      
      const imgData = canvas.toDataURL('image/png')
      
      // Calculate dimensions
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      const pdf = new jsPDF('p', 'mm', 'a4')
      let heightLeft = imgHeight
      let position = 0
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      // Add more pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      pdf.save(`${session.title.replace(/\s+/g, "-")}-split.pdf`)
    } catch (error) {
      console.error("PDF generation failed:", error)
      // Fallback: open print dialog
      window.print()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Ad Banner - Large */}
      <AdBanner slot={1} type="large" />

      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/ul0.png"
              alt="ul0 logo"
              className="h-7 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Expires in {hoursLeft}h {minutesLeft}m</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-2xl">
          {/* Small Ad Banner */}
          <AdBanner slot={2} type="small" />
          {/* PDF Content Area */}
          <div ref={contentRef} className="space-y-4">
            {/* Title Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  {session.title}
                </CardTitle>
                <CardDescription className="flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Wallet className="h-4 w-4" />
                    ₹{session.total_amount.toFixed(2)} total
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {session.members.length} people
                  </span>
                  <span className="flex items-center gap-1">
                    <Receipt className="h-4 w-4" />
                    {session.expenses.length} expenses
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {session.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg bg-muted/20 p-3">
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{getPaymentId(member)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyPaymentId(getPaymentId(member))}
                      >
                        {copiedId === getPaymentId(member) ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expenses - Grouped by Date */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  // Group expenses by date
                  const groupedExpenses: Record<string, typeof session.expenses> = {}
                  
                  session.expenses.forEach(exp => {
                    const dateKey = exp.date || 'No Date'
                    if (!groupedExpenses[dateKey]) {
                      groupedExpenses[dateKey] = []
                    }
                    groupedExpenses[dateKey].push(exp)
                  })

                  // Sort dates (oldest first - chronological order)
                  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => {
                    if (a === 'No Date') return 1
                    if (b === 'No Date') return -1
                    return new Date(a).getTime() - new Date(b).getTime()
                  })

                  return sortedDates.map(dateKey => {
                    const dateExpenses = groupedExpenses[dateKey]
                    const dateTotal = dateExpenses.reduce((sum, e) => sum + e.amount, 0)
                    const formattedDate = dateKey === 'No Date' 
                      ? 'No Date' 
                      : new Date(dateKey).toLocaleDateString('en-IN', { 
                          weekday: 'short',
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })

                    return (
                      <div key={dateKey} className="space-y-2">
                        {/* Date Header */}
                        <div className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{formattedDate}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">₹{dateTotal.toFixed(2)}</span>
                        </div>
                        
                        {/* Expenses for this date */}
                        <div className="space-y-1 pl-2 border-l-2 border-muted ml-2">
                          {dateExpenses.map((exp) => (
                            <div key={exp.id} className="flex items-center justify-between rounded-lg bg-muted/20 p-3">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{exp.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Paid by {getMemberName(exp.paidBy)}
                                </p>
                              </div>
                              <span className="font-semibold">₹{exp.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })
                })()}
                
                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3 mt-3">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg text-primary">₹{session.total_amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Settlements */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  Who Owes Who
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {session.settlements.length === 0 ? (
                  <div className="rounded-lg bg-green-500/10 p-4 text-center text-sm text-green-600">
                    Everyone is settled up! 🎉
                  </div>
                ) : (
                  session.settlements.map((settlement, idx) => {
                    const toMember = getMember(settlement.to)
                    const paymentLink = toMember ? getPaymentLink(toMember, settlement.amount) : ""
                    const paymentId = toMember ? getPaymentId(toMember) : ""
                    const paymentMethod = toMember ? getPaymentMethod(toMember) : "upi"
                    const methodInfo = PAYMENT_METHODS[paymentMethod]

                    return (
                      <div key={idx} className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{getMemberName(settlement.from)}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{getMemberName(settlement.to)}</span>
                          </div>
                          <span className="font-bold text-lg text-primary">{settlement.amount.toFixed(2)}</span>
                        </div>

                        {/* Payment method info */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs flex items-center gap-1">
                            <PaymentIcon method={paymentMethod} className="h-3 w-3" />
                            {methodInfo.name}
                          </span>
                          <span className="truncate">{paymentId}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {/* Pay Button - only show if payment link is available */}
                          {paymentLink && (
                            <Button asChild size="sm" className="gap-1">
                              <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                                Pay Now
                              </a>
                            </Button>
                          )}
                          
                          {/* QR Code Button - only for methods that support deep links */}
                          {paymentLink && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => generateQR(settlement, idx)}
                            >
                              <QrCode className="h-3 w-3" />
                              Show QR
                            </Button>
                          )}
                          
                          {/* Copy Payment ID */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => copyPaymentId(paymentId)}
                          >
                            {copiedId === paymentId ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            Copy {methodInfo.name} ID
                          </Button>
                        </div>

                        {/* QR Code Display */}
                        {qrCodes[idx.toString()] && (
                          <div className="flex justify-center pt-2">
                            <div className="rounded-lg bg-white p-2">
                              <img 
                                src={qrCodes[idx.toString()]} 
                                alt="Payment QR Code" 
                                className="h-40 w-40"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>

            {/* Powered By - for PDF */}
            <div className="flex items-center justify-center gap-2 py-4">
              <span className="text-sm text-muted-foreground">Powered by</span>
              <img
                src="/ul0.png"
                alt="ul0"
                className="h-6 w-auto object-contain"
              />
            </div>
          </div>

          {/* Download PDF Button */}
          <div className="mt-6 space-y-4">
            <Button 
              onClick={downloadPDF} 
              className="w-full gap-2"
              size="lg"
            >
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>

            <Button 
              variant="outline" 
              className="w-full gap-2 bg-transparent"
              asChild
            >
              <a href="/split">
                <ExternalLink className="h-4 w-4" />
                Create Your Own Split
              </a>
            </Button>
          </div>

          {/* Bottom Ad Banners */}
          <div className="mt-6 space-y-4">
            <AdBanner slot={3} type="large" />
            <AdBanner slot={4} type="small" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 px-4 py-4 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Made with ❤️ by stablersleet</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
