"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  DollarSign, 
  Clock, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Coffee,
  Utensils,
  Car,
  Plane,
  Smartphone,
  Shirt,
  Heart,
  TrendingUp,
  Calculator
} from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Currency configurations
const currencies = {
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
  INR: { symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  JPY: { symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
  AUD: { symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  CAD: { symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  BRL: { symbol: "R$", name: "Brazilian Real", locale: "pt-BR" },
  MXN: { symbol: "$", name: "Mexican Peso", locale: "es-MX" },
  PHP: { symbol: "₱", name: "Philippine Peso", locale: "en-PH" },
  IDR: { symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID" },
  THB: { symbol: "฿", name: "Thai Baht", locale: "th-TH" },
  VND: { symbol: "₫", name: "Vietnamese Dong", locale: "vi-VN" },
} as const

type CurrencyCode = keyof typeof currencies

// Fun comparisons based on typical prices
const getComparisons = (price: number, currency: CurrencyCode) => {
  // Approximate prices in USD equivalent for comparisons
  const usdEquivalent: Record<CurrencyCode, number> = {
    USD: 1, EUR: 1.1, GBP: 1.27, INR: 0.012, JPY: 0.0067,
    AUD: 0.65, CAD: 0.74, BRL: 0.2, MXN: 0.058, PHP: 0.018,
    IDR: 0.000063, THB: 0.028, VND: 0.00004,
  }
  
  const priceInUSD = price * usdEquivalent[currency]
  
  return [
    { icon: <Coffee className="h-5 w-5" />, name: "Coffees", count: Math.round(priceInUSD / 5), emoji: "☕" },
    { icon: <Utensils className="h-5 w-5" />, name: "Meals out", count: Math.round(priceInUSD / 15), emoji: "🍔" },
    { icon: <Smartphone className="h-5 w-5" />, name: "Netflix months", count: Math.round(priceInUSD / 15), emoji: "📺" },
    { icon: <Car className="h-5 w-5" />, name: "Uber rides", count: Math.round(priceInUSD / 12), emoji: "🚗" },
    { icon: <Plane className="h-5 w-5" />, name: "Spotify years", count: Math.round(priceInUSD / 120), emoji: "🎵" },
  ].filter(c => c.count > 0)
}

// Get verdict based on hours of work
const getVerdict = (hoursOfWork: number) => {
  if (hoursOfWork < 1) {
    return {
      status: "go",
      icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
      title: "Go for it! 🎉",
      message: "Less than an hour of work? Treat yourself!",
      color: "text-green-500",
      bgColor: "bg-green-500/10 border-green-500/20",
    }
  } else if (hoursOfWork < 4) {
    return {
      status: "maybe",
      icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
      title: "Think about it 🤔",
      message: "A few hours of work. Is it worth it to you?",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10 border-yellow-500/20",
    }
  } else if (hoursOfWork < 8) {
    return {
      status: "careful",
      icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
      title: "Sleep on it 😴",
      message: "That's almost a full day of work. Maybe wait 24 hours?",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10 border-orange-500/20",
    }
  } else if (hoursOfWork < 40) {
    return {
      status: "warning",
      icon: <XCircle className="h-8 w-8 text-red-500" />,
      title: "Major purchase 💸",
      message: "This costs you a week (or more) of work. Really think hard.",
      color: "text-red-500",
      bgColor: "bg-red-500/10 border-red-500/20",
    }
  } else {
    return {
      status: "stop",
      icon: <XCircle className="h-8 w-8 text-red-600" />,
      title: "Whoa there! 🛑",
      message: "This is a MAJOR financial decision. Do your research!",
      color: "text-red-600",
      bgColor: "bg-red-600/10 border-red-600/20",
    }
  }
}

export default function ShouldIBuyPage() {
  const [price, setPrice] = useState<string>("")
  const [hourlyWage, setHourlyWage] = useState<string>("")
  const [salaryType, setSalaryType] = useState<"hourly" | "monthly" | "yearly">("hourly")
  const [currency, setCurrency] = useState<CurrencyCode>("USD")
  const [showResult, setShowResult] = useState(false)

  // Real trusted directories for marquee (from user-provided badges)
  const trustedDirectories = [
    { name: "DANG!", url: "https://dang.tools/", img: "/badges/dang.png", alt: "Verified on DANG!" },
    { name: "Turbo0.com", url: "https://turbo0.com/", img: "/badges/turbo0.png", alt: "Listed on Turbo0.com" },
    { name: "Findly.tools", url: "https://findly.tools/", img: "/badges/findly.png", alt: "Featured on Findly.tools" },
    { name: "need", url: "https://need.tools/", img: "/badges/need.png", alt: "Featured on need" },
    { name: "twelve.tools", url: "https://twelve.tools/", img: "/badges/twelve.png", alt: "Featured on twelve.tools" },
    { name: "Million Dot Homepage", url: "https://milliondothomepage.com/", img: "/badges/milliondot.png", alt: "Featured on Million Dot Homepage" },
    { name: "Best Tool Vault", url: "https://besttoolvault.com/", img: "/badges/besttoolvault.png", alt: "Featured on Best Tool Vault" },
    { name: "LaunchClash", url: "https://launchclash.com/", img: "/badges/launchclash.png", alt: "Featured on LaunchClash" },
    { name: "ShinyLaunch", url: "https://shinylauch.com/", img: "/badges/shinylaunch.png", alt: "Featured on ShinyLaunch" },
    { name: "Acid Tools", url: "https://acidtools.xyz/", img: "/badges/acidtools.png", alt: "Featured on Acid Tools" },
    { name: "AIGC 160", url: "https://aigc160.com/", img: "/badges/aigc160.png", alt: "Featured on AIGC 160" },
    { name: "AI Tech Viral", url: "https://aitechviral.com/", img: "/badges/aitechviral.png", alt: "Featured on AI Tech Viral" },
    { name: "AI Toolz", url: "https://aitoolz.io/", img: "/badges/aitoolz.png", alt: "Featured on AI Toolz" },
    { name: "Appa List", url: "https://appalist.com/", img: "/badges/appalist.png", alt: "Featured on Appa List" },
    { name: "Appsy Tools", url: "https://appsytools.com/", img: "/badges/appsytools.png", alt: "Featured on Appsy Tools" },
  ]

  // Calculate hourly rate from different salary types
  const effectiveHourlyRate = useMemo(() => {
    const wage = parseFloat(hourlyWage) || 0
    switch (salaryType) {
      case "monthly":
        return wage / 160 // Assuming 40 hours/week, 4 weeks/month
      case "yearly":
        return wage / 2080 // Assuming 40 hours/week, 52 weeks/year
      default:
        return wage
    }
  }, [hourlyWage, salaryType])

  const priceNum = parseFloat(price) || 0
  const hoursOfWork = effectiveHourlyRate > 0 ? priceNum / effectiveHourlyRate : 0
  
  const verdict = useMemo(() => getVerdict(hoursOfWork), [hoursOfWork])
  const comparisons = useMemo(() => getComparisons(priceNum, currency), [priceNum, currency])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currencies[currency].locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`
    } else if (hours < 24) {
      const h = Math.floor(hours)
      const m = Math.round((hours - h) * 60)
      return m > 0 ? `${h}h ${m}m` : `${h} hour${h !== 1 ? "s" : ""}`
    } else if (hours < 168) { // Less than a week
      const days = Math.floor(hours / 8) // 8-hour workday
      const remainingHours = Math.round(hours % 8)
      return remainingHours > 0 ? `${days} day${days !== 1 ? "s" : ""} ${remainingHours}h` : `${days} work day${days !== 1 ? "s" : ""}`
    } else {
      const weeks = Math.floor(hours / 40) // 40-hour workweek
      return `${weeks} work week${weeks !== 1 ? "s" : ""}`
    }
  }

  const handleCalculate = () => {
    if (priceNum > 0 && effectiveHourlyRate > 0) {
      setShowResult(true)
    }
  }

  const resetCalculator = () => {
    setPrice("")
    setHourlyWage("")
    setShowResult(false)
  }

  return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />

        {/* Marquee: Real Trusted Directory Badges */}
        <div className="w-full overflow-x-hidden py-2 bg-muted border-b border-border">
          <div
            className="flex items-center gap-8 animate-marquee whitespace-nowrap"
            style={{ animationDuration: '32s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
          >
            <span className="font-semibold text-primary mr-6">Featured on trusted directories:</span>
            {trustedDirectories.map((dir, i) => (
              <a
                key={dir.name}
                href={dir.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline opacity-80 hover:opacity-100 transition"
                style={{ minWidth: 160, justifyContent: 'center' }}
              >
                <img
                  src={dir.img}
                  alt={dir.alt}
                  className="h-10 w-auto object-contain rounded bg-white border border-border shadow-sm px-2 py-1"
                  style={{ background: '#fff', maxHeight: 40 }}
                />
              </a>
            ))}
          </div>
        </div>

        <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-4 inline-flex items-center gap-1 transition-colors">
              ← Back to Home
            </Link>
            <div className="flex items-center justify-center gap-3 mt-4 mb-3">
              <span className="text-4xl">🤔</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Should I Buy This?</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Convert any price into hours of work to make smarter decisions
            </p>
          </div>

          {!showResult ? (
            <Card className="border-2">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6">
                  {/* Currency Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(currencies).map(([code, { symbol, name }]) => (
                          <SelectItem key={code} value={code}>
                            {symbol} {name} ({code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Input */}
                  <div className="space-y-2">
                    <Label htmlFor="price">Item Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {currencies[currency].symbol}
                      </span>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="pl-8 h-12 text-lg"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Salary Type Selection */}
                  <div className="space-y-2">
                    <Label>Your Income Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["hourly", "monthly", "yearly"] as const).map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={salaryType === type ? "default" : "outline"}
                          onClick={() => setSalaryType(type)}
                          className="capitalize"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Wage Input */}
                  <div className="space-y-2">
                    <Label htmlFor="wage">
                      Your {salaryType.charAt(0).toUpperCase() + salaryType.slice(1)} {salaryType === "hourly" ? "Rate" : "Salary"}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {currencies[currency].symbol}
                      </span>
                      <Input
                        id="wage"
                        type="number"
                        placeholder={salaryType === "hourly" ? "25" : salaryType === "monthly" ? "4000" : "50000"}
                        value={hourlyWage}
                        onChange={(e) => setHourlyWage(e.target.value)}
                        className="pl-8 h-12 text-lg"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {salaryType !== "hourly" && effectiveHourlyRate > 0 && (
                      <p className="text-sm text-muted-foreground">
                        ≈ {formatCurrency(effectiveHourlyRate)}/hour
                      </p>
                    )}
                  </div>

                  <Button 
                    onClick={handleCalculate} 
                    className="w-full h-12 text-lg gap-2"
                    disabled={!priceNum || !effectiveHourlyRate}
                  >
                    <Calculator className="h-5 w-5" />
                    Calculate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Verdict Card */}
              <Card className={`border-2 ${verdict.bgColor}`}>
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="flex justify-center mb-4">
                    {verdict.icon}
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 ${verdict.color}`}>
                    {verdict.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {verdict.message}
                  </p>
                  
                  <div className="bg-background/50 rounded-xl p-6 mb-6">
                    <p className="text-sm text-muted-foreground mb-2">This purchase costs you</p>
                    <p className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                      {formatTime(hoursOfWork)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      of work at {formatCurrency(effectiveHourlyRate)}/hour
                    </p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{formatCurrency(priceNum)}</span>
                    {" ÷ "}
                    <span className="font-medium">{formatCurrency(effectiveHourlyRate)}/hr</span>
                    {" = "}
                    <span className="font-medium">{hoursOfWork.toFixed(1)} hours</span>
                  </div>
                </CardContent>
              </Card>

              {/* Comparisons Card */}
              {comparisons.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      What else could you buy?
                    </CardTitle>
                    <CardDescription>
                      {formatCurrency(priceNum)} is equivalent to...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {comparisons.map((item, i) => (
                        <div key={i} className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl mb-1">{item.emoji}</div>
                          <div className="text-2xl font-bold">{item.count}</div>
                          <div className="text-sm text-muted-foreground">{item.name}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Questions to Ask */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Ask yourself...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Would I work {formatTime(hoursOfWork)} overtime just to buy this?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Will I still want this in 30 days?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Do I already own something similar?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Am I buying this because I'm bored, sad, or stressed?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Could this money be better used elsewhere?</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Button 
                onClick={resetCalculator} 
                variant="outline" 
                className="w-full h-12"
              >
                Calculate Another Purchase
              </Button>
            </div>
          )}

          {/* SEO Content */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              The "Should I Buy This" calculator helps you make smarter spending decisions 
              by converting prices into hours of work. Simply enter the item price and your 
              hourly wage (or monthly/yearly salary) to see how long you'd need to work to 
              afford it. This perspective can help prevent impulse purchases and encourage 
              mindful spending.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
