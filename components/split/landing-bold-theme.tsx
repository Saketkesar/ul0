"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, ArrowRight } from "lucide-react"

const NAMES = ["You", "Rahul", "Priya", "Aman", "Neha", "Kabir", "Isha", "Dev"]
const TICKER_ITEMS = [
  "₹4,280 · Toit · 6 people",
  "₹1,860 · Zomato night · 4",
  "₹12,400 · Goa trip · 8",
  "₹720 · Cab home · 3",
  "₹18,000 · Rent · 3",
  "₹960 · Chai tapri · 5",
]

export function LandingBoldTheme() {
  const router = useRouter()

  // Receipt interactive state
  const [amount, setAmount] = useState<number>(2400)
  const [people, setPeople] = useState<number>(4)
  const [isTorn, setIsTorn] = useState<boolean>(false)
  const [paidIndices, setPaidIndices] = useState<number[]>([])
  const [isCollected, setIsCollected] = useState<boolean>(false)

  // Gun game cylinder auto-rotation state
  const [cylCurrent, setCylCurrent] = useState<number>(0)
  const [cylRotation, setCylRotation] = useState<number>(0)
  const [cylBullet, setCylBullet] = useState<number>(3)
  const [cylHit, setCylHit] = useState<string | null>(null)

  const stepTimeoutsRef = useRef<NodeJS.Timeout[]>([])

  // Calculate per person shares with largest-remainder exact paise balance
  const stripsData = useMemo(() => {
    const total = Math.max(0, amount || 0)
    const count = Math.max(2, Math.min(8, people))
    const baseShare = Math.floor(total / count)
    const remainder = total - baseShare * count

    return Array.from({ length: count }, (_, i) => ({
      name: NAMES[i % NAMES.length] + (i === 0 ? " (collector)" : ""),
      amount: baseShare + (i === 0 ? remainder : 0),
      dx: (i % 2 ? 1 : -1) * (10 + ((i * 7) % 16)),
      dy: i * 4,
      rotation: ((i * 3.1) % 8 - 4).toFixed(1),
    }))
  }, [amount, people])

  // Play tearing receipt animation sequence
  const playSequence = () => {
    stepTimeoutsRef.current.forEach(clearTimeout)
    stepTimeoutsRef.current = []

    setIsTorn(false)
    setPaidIndices([])
    setIsCollected(false)

    // Check prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsTorn(true)
      setPaidIndices(stripsData.map((_, i) => i))
      setIsCollected(true)
      return
    }

    // Step 1: Tear apart after 900ms
    const t1 = setTimeout(() => {
      setIsTorn(true)

      // Step 2: Stamp PAID on each person one by one
      stripsData.forEach((_, idx) => {
        const delay = 700 + (idx === 0 ? stripsData.length * 500 : idx * 500)
        const tStamp = setTimeout(() => {
          setPaidIndices((prev) => [...new Set([...prev, idx])])
          if (idx === 0) {
            setIsCollected(true)
          }
        }, delay)
        stepTimeoutsRef.current.push(tStamp)
      })

      // Step 3: Loop after 4.2s
      const tLoop = setTimeout(() => {
        playSequence()
      }, 700 + stripsData.length * 500 + 4200)
      stepTimeoutsRef.current.push(tLoop)
    }, 900)

    stepTimeoutsRef.current.push(t1)
  }

  // Restart sequence whenever amount or people change
  useEffect(() => {
    playSequence()
    return () => {
      stepTimeoutsRef.current.forEach(clearTimeout)
    }
  }, [amount, people])

  // Bento Gun Game cylinder auto-cycling animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCylCurrent((prev) => {
        const next = (prev + 1) % 6
        setCylRotation((r) => r - 60)

        if (next === cylBullet) {
          const victims = ["Priya", "Rahul", "Aman", "Neha"]
          const luckyVictim = victims[Math.floor(Math.random() * victims.length)]
          setCylHit(luckyVictim)
          setTimeout(() => {
            setCylHit(null)
            setCylBullet(Math.floor(Math.random() * 6))
          }, 1800)
        }
        return next
      })
    }, 1100)

    return () => clearInterval(interval)
  }, [cylBullet])

  const formattedTotal = "₹" + Math.round(amount || 0).toLocaleString("en-IN")

  return (
    <div className="relative min-h-screen bg-white text-[#0B1A17] font-['Space_Grotesk',system-ui,sans-serif] selection:bg-[#3DDBB8] selection:text-[#0B1A17] overflow-x-hidden">
      {/* Film-grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.045] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* JSON-LD Schemas for SEO & Trust */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "UL0 Split",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              featureList: [
                "Zero app install for friends",
                "Direct bank-to-bank UPI payment links",
                "Instant receipt tearing and itemized calculation",
                "Largest-remainder exact paise balancing",
                "Who Pays cylinder roulette",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Does UL0 hold or touch any money?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. UL0 never touches or holds funds. Every payment transfers directly bank-to-bank via NPCI UPI deep links and QR codes from Google Pay, PhonePe, Paytm, CRED, or BHIM.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do my friends need to install an app or register an account?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Zero apps and zero signup. Friends simply open the shared settle link in their phone browser, select their name, and pay their exact share with 1 tap.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is UL0 Split really 100% free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, 100% free with unlimited bill splits, unlimited members, and no paywalled features.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Why choose UL0 Split over Splitwise?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Splitwise adds daily expense caps and costs $39.99/year while forcing all friends to download an app and create accounts. UL0 Split is free, runs on the web, and integrates directly with India's UPI apps.",
                  },
                },
              ],
            },
          ]),
        }}
      />

      {/* =====================================================================
          1. 72px FLAT NAV
      ====================================================================== */}
      <div className="max-w-[1200px] mx-auto px-6">
        <nav className="h-[72px] flex items-center justify-between">
          <Link
            href="/split"
            className="font-bold text-[22px] tracking-[-0.04em] text-[#0B1A17] flex items-center"
          >
            <span>UL0</span>
            <span className="text-[#1B685C]">.</span>
            <span>split</span>
          </Link>

          <div className="flex items-center gap-7 text-[14px] text-[#5E726C]">
            <a href="#how" className="hidden sm:inline hover:text-[#0B1A17] transition-colors">
              Why it hits
            </a>
            <a href="#features" className="hidden sm:inline hover:text-[#0B1A17] transition-colors">
              Features
            </a>
            <a href="#faq" className="hidden sm:inline hover:text-[#0B1A17] transition-colors">
              FAQ
            </a>
            <Link
              href="/split/dashboard"
              className="inline-flex items-center justify-center h-10 px-5 rounded-[99px] bg-[#1B685C] hover:bg-[#155349] text-white font-bold text-[14px] transition-transform hover:-translate-y-0.5"
            >
              Open app
            </Link>
          </div>
        </nav>
      </div>

      {/* =====================================================================
          2. HERO SECTION ("Split it. Tear it. Get paid.")
      ====================================================================== */}
      <div className="max-w-[1200px] mx-auto px-6 relative pt-10 pb-20">
        {/* Radial mint glow behind receipt */}
        <div
          className="absolute right-[-10%] top-0 w-[620px] h-[620px] rounded-full pointer-events-none opacity-40 blur-3xl -z-10"
          style={{
            background: "radial-gradient(circle, rgba(61,219,184,0.3) 0%, transparent 65%)",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-10 items-center">
          {/* Left Column: Giant Display Typography */}
          <div>
            <h1 className="text-[clamp(54px,9.6vw,142px)] leading-[0.88] tracking-[-0.055em] font-bold text-[#0B1A17]">
              <span className="block">Split it.</span>
              <span
                className="block"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2.5px #0B1A17",
                }}
              >
                Tear it.
              </span>
              <span className="block mt-2 sm:mt-3">
                <mark className="bg-[#3DDBB8] text-[#0B1A17] px-[0.14em] py-[0.02em] inline-block -rotate-[2.5deg] rounded-[6px]">
                  Get paid.
                </mark>
              </span>
            </h1>

            <p className="max-w-[30em] text-[18px] sm:text-[21px] text-[#5E726C] my-7 leading-relaxed font-normal">
              Type the bill. Share one link. Your friends pay you from GPay, PhonePe or Paytm without installing a thing.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/split/dashboard?amount=${amount}&people=${people}`}
                className="inline-flex items-center gap-2.5 h-[52px] px-7 rounded-[99px] bg-[#1B685C] hover:bg-[#155349] text-white font-bold text-[16px] transition-all hover:-translate-y-0.5 hover:-rotate-1 shadow-[0_12px_36px_-8px_rgba(27,104,92,0.4)]"
              >
                <span>Split a bill, free →</span>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center h-[52px] px-6 rounded-[99px] bg-transparent text-[#0B1A17] border border-[#0B1A17] font-bold text-[16px] hover:bg-[#F4FAF8] transition-colors"
              >
                Or spin who pays
              </a>
            </div>

            <div className="font-['JetBrains_Mono',ui-monospace,monospace] text-[12px] text-[#5E726C] mt-6 tracking-[0.02em] uppercase">
              NO SIGNUP · NO APP · MONEY GOES BANK → BANK
            </div>
          </div>

          {/* Right Column: Physical Tearing Receipt Hero */}
          <div className="flex flex-col items-center gap-4 relative z-10 pt-4 lg:pt-0">
            <div
              className={`w-[320px] text-[#0B1A17] font-['JetBrains_Mono',ui-monospace,monospace] transition-transform duration-500 ${
                isTorn ? "rotate-[1deg]" : "rotate-[3deg]"
              }`}
              style={{
                filter:
                  "drop-shadow(0 26px 34px rgba(11,26,23,0.18)) drop-shadow(0 0 1px rgba(11,26,23,0.3))",
              }}
            >
              {/* Receipt Header with Conic-gradient Zigzag Top Edge */}
              <div
                className="bg-[#F4FAF8] px-5 pt-7 pb-3.5 relative"
                style={{
                  WebkitMask:
                    "conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50%/14px 100%",
                  mask:
                    "conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50%/14px 100%",
                }}
              >
                <small className="block text-[10px] tracking-[0.14em] text-[#6A6D62] font-semibold">
                  UL0 SPLIT · TOIT, INDIRANAGAR
                </small>
                <div className="text-[38px] font-bold tracking-[-0.04em] my-1 font-['Space_Grotesk',system-ui,sans-serif] text-[#0B1A17]">
                  {formattedTotal}
                </div>
                <div
                  className={`text-[11px] transition-colors duration-300 ${
                    isCollected ? "text-[#1B685C] font-bold" : "text-[#6A6D62]"
                  }`}
                >
                  {isCollected
                    ? `${formattedTotal} collected · 0 apps installed`
                    : `${people} people · tap tear`}
                </div>
              </div>

              {/* Strips: Intact or Torn Apart */}
              <div
                className={`flex flex-col transition-all duration-500 ${
                  isTorn ? "gap-2" : "gap-0"
                }`}
              >
                {stripsData.map((strip, i) => {
                  const isPaid = paidIndices.includes(i)
                  const isLast = i === stripsData.length - 1

                  return (
                    <div
                      key={i}
                      className="bg-[#F4FAF8] flex justify-between items-center px-5 py-3.5 text-[14px] relative transition-transform duration-700 ease-[cubic-bezier(0.2,1.4,0.4,1)]"
                      style={{
                        transform: isTorn
                          ? `translate(${strip.dx}px, ${strip.dy}px) rotate(${strip.rotation}deg)`
                          : "none",
                        transitionDelay: `${i * 60}ms`,
                        borderTop: isTorn ? "none" : "1.5px dashed #AFCBC2",
                        paddingBottom: isTorn || isLast ? "24px" : "14px",
                        WebkitMask:
                          isTorn || isLast
                            ? "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50%/14px 100%"
                            : "none",
                        mask:
                          isTorn || isLast
                            ? "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50%/14px 100%"
                            : "none",
                      }}
                    >
                      <span className="text-[13px] text-[#0B1A17]">{strip.name}</span>
                      <b className="font-['Space_Grotesk',system-ui,sans-serif] text-[17px] font-bold text-[#0B1A17]">
                        ₹{strip.amount.toLocaleString("en-IN")}
                      </b>

                      {/* Slamming PAID Stamp */}
                      <span
                        className={`absolute right-20 top-1/2 -translate-y-1/2 font-['Space_Grotesk',system-ui,sans-serif] font-bold text-[12px] tracking-[0.1em] bg-[#1B685C] text-white px-2 py-0.5 rounded-[4px] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] ${
                          isPaid
                            ? "opacity-100 scale-100 -rotate-8"
                            : "opacity-0 scale-[2.4] -rotate-12"
                        }`}
                      >
                        PAID
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Interactive Controls (Amount, Stepper, Tear it) */}
            <div className="flex items-center gap-2.5 bg-[#F4FAF8] border border-[#D3E2DD] rounded-[99px] py-1.5 pl-4 pr-1.5 font-['JetBrains_Mono',ui-monospace,monospace] text-[13px] text-[#5E726C] shadow-sm">
              <span className="font-bold text-[#0B1A17]">₹</span>
              <input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 bg-transparent border-0 outline-none text-[#0B1A17] font-bold text-[16px] font-['JetBrains_Mono',ui-monospace,monospace]"
                aria-label="Bill Total"
              />
              <button
                type="button"
                onClick={() => setPeople(Math.max(2, people - 1))}
                className="w-8 h-8 rounded-full border border-[#D3E2DD] bg-white text-[#0B1A17] text-[18px] flex items-center justify-center font-bold cursor-pointer hover:bg-[#DDF5EE] transition-colors"
                aria-label="Fewer people"
              >
                −
              </button>
              <span className="text-[#0B1A17] font-bold min-w-[14px] text-center">
                {people}
              </span>
              <button
                type="button"
                onClick={() => setPeople(Math.min(8, people + 1))}
                className="w-8 h-8 rounded-full border border-[#D3E2DD] bg-white text-[#0B1A17] text-[18px] flex items-center justify-center font-bold cursor-pointer hover:bg-[#DDF5EE] transition-colors"
                aria-label="More people"
              >
                +
              </button>
              <button
                type="button"
                onClick={playSequence}
                className="h-9 px-4 rounded-[99px] bg-[#1B685C] hover:bg-[#155349] text-white font-bold text-[13px] font-['Space_Grotesk',system-ui,sans-serif] cursor-pointer transition-transform hover:scale-105"
              >
                Tear it
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. PINE TICKER BAND (Rotated -1.6deg, Infinite Marquee)
      ====================================================================== */}
      <div className="bg-[#1B685C] text-white py-4 overflow-hidden -rotate-[1.6deg] my-10 select-none shadow-md">
        <div className="flex gap-11 w-max animate-ticker hover:[animation-play-state:paused] font-['JetBrains_Mono',ui-monospace,monospace] font-bold text-[20px] uppercase tracking-[-0.01em] whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <span key={idx} className="flex items-center gap-11">
              <span>{item}</span>
              <span className="text-[#3DDBB8]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* =====================================================================
          4. BEFORE / AFTER CHAT STORY SECTION
      ====================================================================== */}
      <section id="how" className="py-24 max-w-[1200px] mx-auto px-6">
        <div className="space-y-4">
          <span className="font-['JetBrains_Mono',ui-monospace,monospace] font-bold text-[12px] tracking-[0.16em] text-[#1B685C] uppercase block">
            / the group chat problem
          </span>
          <h2 className="text-[clamp(36px,5.8vw,78px)] leading-[0.95] tracking-[-0.045em] font-bold text-[#0B1A17] max-w-[13em]">
            Chasing friends for ₹600 is a full-time job.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-14 items-stretch">
          {/* Chaos: Messy WhatsApp-style Chat */}
          <div className="rounded-[28px] p-8 bg-[#F4FAF8] border border-[#D3E2DD] relative min-h-[380px] overflow-hidden">
            <span className="absolute top-5 right-6 font-['JetBrains_Mono',ui-monospace,monospace] font-bold text-[11px] tracking-[0.12em] text-[#5E726C]">
              BEFORE
            </span>

            <div className="space-y-2.5 pt-4">
              <span className="inline-block max-w-[80%] bg-white border border-[#D3E2DD] py-2.5 px-4 rounded-[18px_18px_18px_4px] text-[15px] text-[#0B1A17] -rotate-1 shadow-2xs">
                who paid at toit??
              </span>
              <div className="text-right">
                <span className="inline-block max-w-[80%] bg-[#DDF5EE] border border-[#D3E2DD] py-2.5 px-4 rounded-[18px_18px_4px_18px] text-[15px] text-[#0B1A17] rotate-1 shadow-2xs">
                  i did. 2400 total
                </span>
              </div>
              <span className="inline-block max-w-[80%] bg-white border border-[#D3E2DD] py-2.5 px-4 rounded-[18px_18px_18px_4px] text-[15px] text-[#0B1A17] rotate-1 shadow-2xs">
                bro send me ur share
              </span>
              <span className="inline-block max-w-[80%] bg-white border border-[#D3E2DD] py-2.5 px-4 rounded-[18px_18px_18px_4px] text-[15px] text-[#0B1A17] -rotate-1 shadow-2xs">
                will gpay u tmrw 🙏
              </span>
              <div className="text-right">
                <span className="inline-block max-w-[80%] bg-[#DDF5EE] border border-[#D3E2DD] py-2.5 px-4 rounded-[18px_18px_4px_18px] text-[15px] text-[#0B1A17] -rotate-1 shadow-2xs">
                  that was last week
                </span>
              </div>
              <span className="inline-block max-w-[80%] bg-white border border-[#D3E2DD] py-2.5 px-4 rounded-[18px_18px_18px_4px] text-[15px] text-[#0B1A17] rotate-1 shadow-2xs">
                how much was mine again
              </span>
              <span className="inline-block max-w-[80%] bg-white border border-[#D3E2DD] py-2.5 px-4 rounded-[18px_18px_18px_4px] text-[14px] text-[#5E726C] italic shadow-2xs">
                ⏳ typing…
              </span>
            </div>
          </div>

          {/* Clean: One Link. Everyone Pays. */}
          <div className="rounded-[28px] p-8 bg-[#1B685C] text-white relative min-h-[380px] overflow-hidden">
            <span className="absolute top-5 right-6 font-['JetBrains_Mono',ui-monospace,monospace] font-bold text-[11px] tracking-[0.12em] text-[#3DDBB8]">
              AFTER
            </span>

            <div className="space-y-4 pt-2">
              <h3 className="text-[32px] sm:text-[36px] font-bold tracking-[-0.04em] leading-tight">
                One link. Everyone pays.
              </h3>

              <div className="inline-block font-['JetBrains_Mono',ui-monospace,monospace] font-bold text-[16px] bg-[#0B1A17] text-[#3DDBB8] px-4 py-2.5 rounded-[12px]">
                ul0.site/s/toit-4x9
              </div>

              <div className="space-y-1 pt-2">
                {[
                  { name: "Rahul", amt: 600 },
                  { name: "Priya", amt: 600 },
                  { name: "Aman", amt: 600 },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between py-3 border-t border-white/20 text-[18px] font-medium"
                  >
                    <span>{p.name}</span>
                    <span className="font-['JetBrains_Mono',ui-monospace,monospace] font-bold text-[12px] text-[#0B1A17] bg-[#3DDBB8] px-3 py-1 rounded-[99px] tracking-[0.06em]">
                      PAID ₹{p.amt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. BENTO GRID ("Built for India's group chats")
      ====================================================================== */}
      <section id="features" className="py-20 max-w-[1200px] mx-auto px-6">
        <div className="space-y-4">
          <span className="font-['JetBrains_Mono',ui-monospace,monospace] font-bold text-[12px] tracking-[0.16em] text-[#1B685C] uppercase block">
            / what you get
          </span>
          <h2 className="text-[clamp(36px,5.8vw,78px)] leading-[0.95] tracking-[-0.045em] font-bold text-[#0B1A17]">
            Built for India&apos;s group chats.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-14">
          {/* Bento Card 1: 0 Apps (Span 7) */}
          <div className="md:col-span-7 rounded-[28px] p-8 bg-[#F4FAF8] border border-[#D3E2DD] hover:border-[#1B685C] transition-all">
            <div className="text-[clamp(72px,10vw,130px)] font-bold tracking-[-0.07em] leading-[0.8] text-[#1B685C] mb-4 font-['Space_Grotesk',system-ui,sans-serif]">
              0
            </div>
            <h3 className="text-[26px] font-bold tracking-[-0.035em] text-[#0B1A17] leading-tight mb-2">
              apps for your friends to install.
            </h3>
            <p className="text-[16px] text-[#5E726C] max-w-[26em] leading-relaxed">
              They open the link, tap their name and pay from the UPI app already on their phone.
            </p>
          </div>

          {/* Bento Card 2: Split any way (Span 5) */}
          <div className="md:col-span-5 rounded-[28px] p-8 bg-[#F4FAF8] border border-[#D3E2DD] hover:border-[#1B685C] transition-all">
            <h3 className="text-[26px] font-bold tracking-[-0.035em] text-[#0B1A17] leading-tight mb-2">
              Split any way
            </h3>
            <p className="text-[16px] text-[#5E726C] leading-relaxed mb-6">
              Equal, by item with GST shared properly, or custom amounts.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="border border-[#0B1A17] bg-[#0B1A17] text-white font-bold rounded-[99px] px-4 py-2 text-[14px]">
                Equal
              </span>
              <span className="border border-[#D3E2DD] bg-white text-[#0B1A17] rounded-[99px] px-4 py-2 text-[14px]">
                Itemized
              </span>
              <span className="border border-[#D3E2DD] bg-white text-[#0B1A17] rounded-[99px] px-4 py-2 text-[14px]">
                Custom
              </span>
            </div>
          </div>

          {/* Bento Card 3: Live tracker (Span 5) */}
          <div className="md:col-span-5 rounded-[28px] p-8 bg-[#F4FAF8] border border-[#D3E2DD] hover:border-[#1B685C] transition-all">
            <h3 className="text-[26px] font-bold tracking-[-0.035em] text-[#0B1A17] leading-tight mb-2">
              Live tracker
            </h3>
            <p className="text-[16px] text-[#5E726C] leading-relaxed">
              See who paid, who&apos;s ghosting.
            </p>
            {/* Animated progress bar */}
            <div className="h-3 bg-[#DDF5EE] rounded-[9px] my-5 overflow-hidden">
              <div className="h-full bg-[#1B685C] rounded-[9px] animate-[pulse_2.5s_ease-in-out_infinite] w-[75%]" />
            </div>
            <div className="flex gap-2 flex-wrap font-['JetBrains_Mono',ui-monospace,monospace] text-[12px] font-medium">
              <span className="px-3 py-1.5 rounded-[99px] bg-[rgba(27,104,92,0.14)] text-[#1B685C]">
                Rahul ✓
              </span>
              <span className="px-3 py-1.5 rounded-[99px] bg-[rgba(27,104,92,0.14)] text-[#1B685C]">
                Priya ✓
              </span>
              <span className="px-3 py-1.5 rounded-[99px] bg-[rgba(27,104,92,0.14)] text-[#1B685C]">
                Aman ✓
              </span>
              <span className="px-3 py-1.5 rounded-[99px] bg-[#DDF5EE] text-[#5E726C]">
                Neha …
              </span>
            </div>
          </div>

          {/* Bento Card 4: Gun Game Cylinder (Span 7, Pine Emerald Background) */}
          <div className="md:col-span-7 rounded-[28px] p-8 bg-[#1B685C] text-white border border-[#1B685C] hover:border-[#3DDBB8] transition-all">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-[26px] font-bold tracking-[-0.035em] leading-tight mb-2">
                  Can&apos;t decide who pays?
                </h3>
                <p className="text-[15px] text-white/80 max-w-[20em] leading-relaxed mb-6">
                  Load the cylinder. One live round, six chambers. Whoever takes the shot covers the bill.
                </p>
                <Link
                  href="/split/dashboard"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-[99px] bg-white hover:bg-[#F4FAF8] text-[#1B685C] font-bold text-[14px] transition-transform hover:-translate-y-0.5"
                >
                  Play Who Pays →
                </Link>
              </div>

              {/* Interactive SVG Revolver Cylinder */}
              <div className="w-[190px] h-[190px] shrink-0 relative">
                {/* Pointer marker at 12 o'clock */}
                <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-0 h-0 border-x-[8px] border-x-transparent border-t-[12px] border-t-white z-20" />

                <svg
                  viewBox="0 0 300 300"
                  className="w-full h-full transition-transform duration-350 ease-[cubic-bezier(0.3,1.5,0.5,1)]"
                  style={{ transform: `rotate(${cylRotation}deg)` }}
                >
                  <circle cx="150" cy="150" r="140" fill="#0B1A17" />
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const angle = (i * 60 * Math.PI) / 180
                    const cx = 150 + Math.sin(angle) * 86
                    const cy = 150 - Math.cos(angle) * 86
                    const isActive = i === cylCurrent

                    return (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r="30"
                        fill={isActive ? (cylHit ? "#87D474" : "#2E7A6C") : "#12433B"}
                        stroke="#3DDBB8"
                        strokeWidth="3"
                        className="transition-colors duration-200"
                      />
                    )
                  })}
                </svg>

                {/* BANG result overlay on hit */}
                {cylHit && (
                  <div className="absolute inset-0 rounded-full bg-[#87D474] text-[#0B1A17] font-bold text-[18px] flex items-center justify-center text-center p-3 animate-in zoom-in-95 duration-200">
                    {cylHit} pays!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Real Experience WebP Animation Highlights Row */}
        <div className="mt-14 pt-10 border-t border-[#D3E2DD]">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <span className="font-['JetBrains_Mono',ui-monospace,monospace] font-bold text-[11px] tracking-[0.14em] text-[#1B685C] uppercase">
              / seamless flow
            </span>
            <h3 className="text-[28px] font-bold tracking-tight text-[#0B1A17]">
              Zero math headaches. Total transparency.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-[20px] p-5 bg-[#F4FAF8] border border-[#D3E2DD] text-center space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/split-animations/split-01-bill-to-shares.webp"
                alt="Bill to shares animation"
                className="w-full h-44 object-contain mx-auto"
                loading="lazy"
              />
              <h4 className="font-bold text-[15px] text-[#0B1A17]">1. Bill to exact shares</h4>
              <p className="text-[13px] text-[#5E726C]">
                Equal, percent, shares, or itemized with automatic tax distribution.
              </p>
            </div>

            <div className="rounded-[20px] p-5 bg-[#F4FAF8] border border-[#D3E2DD] text-center space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/split-animations/split-02-pay-qr.webp"
                alt="Pay via UPI deep link animation"
                className="w-full h-44 object-contain mx-auto"
                loading="lazy"
              />
              <h4 className="font-bold text-[15px] text-[#0B1A17]">2. Direct 1-tap UPI</h4>
              <p className="text-[13px] text-[#5E726C]">
                GPay, PhonePe, and Paytm links pre-filled with the exact paise amount.
              </p>
            </div>

            <div className="rounded-[20px] p-5 bg-[#F4FAF8] border border-[#D3E2DD] text-center space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/split-animations/split-03-who-paid.webp"
                alt="Live payment tracker animation"
                className="w-full h-44 object-contain mx-auto"
                loading="lazy"
              />
              <h4 className="font-bold text-[15px] text-[#0B1A17]">3. Live payment status</h4>
              <p className="text-[13px] text-[#5E726C]">
                Watch shares update in real-time from Unpaid to Claimed to Settled.
              </p>
            </div>

            <div className="rounded-[20px] p-5 bg-[#F4FAF8] border border-[#D3E2DD] text-center space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/split-animations/split-04-group-settle-up.webp"
                alt="Group settle debt simplification animation"
                className="w-full h-44 object-contain mx-auto"
                loading="lazy"
              />
              <h4 className="font-bold text-[15px] text-[#0B1A17]">4. Group debt simplification</h4>
              <p className="text-[13px] text-[#5E726C]">
                Multi-day trip debts collapse entangled balances into 2 minimal transfers.
              </p>
            </div>

            <div className="rounded-[20px] p-5 bg-[#F4FAF8] border border-[#D3E2DD] text-center space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/split-animations/split-05-reminders.webp"
                alt="WhatsApp reminders animation"
                className="w-full h-44 object-contain mx-auto"
                loading="lazy"
              />
              <h4 className="font-bold text-[15px] text-[#0B1A17]">5. WhatsApp nudges</h4>
              <p className="text-[13px] text-[#5E726C]">
                Polite, firm, and desi-style reminder messages ready to copy or send.
              </p>
            </div>

            <div className="rounded-[20px] p-5 bg-[#F4FAF8] border border-[#D3E2DD] text-center space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/split-animations/split-06-receipt-scan.webp"
                alt="Receipt scan animation"
                className="w-full h-44 object-contain mx-auto"
                loading="lazy"
              />
              <h4 className="font-bold text-[15px] text-[#0B1A17]">6. On-device receipt scan</h4>
              <p className="text-[13px] text-[#5E726C]">
                Scan restaurant or grocery bills locally on your device with zero upload.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. FAQ SECTION (Visually quiet, above footer)
      ====================================================================== */}
      <section id="faq" className="py-20 max-w-[900px] mx-auto px-6 border-t border-[#D3E2DD]">
        <div className="space-y-3 mb-10">
          <span className="font-['JetBrains_Mono',ui-monospace,monospace] font-bold text-[12px] tracking-[0.16em] text-[#1B685C] uppercase block">
            / questions & answers
          </span>
          <h2 className="text-[32px] sm:text-[44px] font-bold tracking-tight text-[#0B1A17]">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          <details className="group bg-[#F4FAF8] border border-[#D3E2DD] rounded-[16px] p-5 cursor-pointer">
            <summary className="font-bold text-[16px] text-[#0B1A17] flex items-center justify-between list-none">
              <span>Does UL0 hold or touch any money?</span>
              <ChevronDown className="w-4 h-4 text-[#5E726C] group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-[14px] text-[#5E726C] pt-3 leading-relaxed">
              No. UL0 never touches or holds funds. Every payment transfers directly bank-to-bank via NPCI UPI deep links and QR codes from Google Pay, PhonePe, Paytm, CRED, or BHIM.
            </p>
          </details>

          <details className="group bg-[#F4FAF8] border border-[#D3E2DD] rounded-[16px] p-5 cursor-pointer">
            <summary className="font-bold text-[16px] text-[#0B1A17] flex items-center justify-between list-none">
              <span>Do my friends need to install an app or register an account?</span>
              <ChevronDown className="w-4 h-4 text-[#5E726C] group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-[14px] text-[#5E726C] pt-3 leading-relaxed">
              Zero apps and zero signup. Friends simply open the shared settle link in their phone browser, select their name, and pay their exact share with 1 tap.
            </p>
          </details>

          <details className="group bg-[#F4FAF8] border border-[#D3E2DD] rounded-[16px] p-5 cursor-pointer">
            <summary className="font-bold text-[16px] text-[#0B1A17] flex items-center justify-between list-none">
              <span>Is UL0 Split really 100% free?</span>
              <ChevronDown className="w-4 h-4 text-[#5E726C] group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-[14px] text-[#5E726C] pt-3 leading-relaxed">
              Yes, 100% free with unlimited bill splits, unlimited members, and no paywalled features.
            </p>
          </details>

          <details className="group bg-[#F4FAF8] border border-[#D3E2DD] rounded-[16px] p-5 cursor-pointer">
            <summary className="font-bold text-[16px] text-[#0B1A17] flex items-center justify-between list-none">
              <span>How does itemized receipt splitting calculate GST and service charge?</span>
              <ChevronDown className="w-4 h-4 text-[#5E726C] group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-[14px] text-[#5E726C] pt-3 leading-relaxed">
              It distributes GST, taxes, and service charges proportionally across items using the largest-remainder method, ensuring that shares balance down to the exact paise.
            </p>
          </details>

          <details className="group bg-[#F4FAF8] border border-[#D3E2DD] rounded-[16px] p-5 cursor-pointer">
            <summary className="font-bold text-[16px] text-[#0B1A17] flex items-center justify-between list-none">
              <span>Why choose UL0 Split over Splitwise?</span>
              <ChevronDown className="w-4 h-4 text-[#5E726C] group-open:rotate-180 transition-transform" />
            </summary>
            <p className="text-[14px] text-[#5E726C] pt-3 leading-relaxed">
              Splitwise adds daily expense caps and costs $39.99/year while forcing all friends to download an app and create accounts. UL0 Split is free, runs on the web, and integrates directly with India&apos;s UPI apps.
            </p>
          </details>
        </div>
      </section>

      {/* =====================================================================
          7. FINAL CTA ("Stop chasing. Start splitting.")
      ====================================================================== */}
      <div className="max-w-[1200px] mx-auto px-6 text-center py-28 relative">
        <h2 className="text-[clamp(52px,11vw,160px)] leading-[0.86] font-bold text-[#0B1A17] tracking-tight mb-8">
          <span>Stop </span>
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: "2.5px #0B1A17",
            }}
          >
            chasing.
          </span>
          <br />
          <span>Start </span>
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: "2.5px #0B1A17",
            }}
          >
            splitting.
          </span>
        </h2>

        <Link
          href="/split/dashboard"
          className="inline-flex items-center gap-2 h-[52px] px-8 rounded-[99px] bg-[#1B685C] hover:bg-[#155349] text-white font-bold text-[16px] transition-all hover:-translate-y-0.5 shadow-md"
        >
          <span>Split a bill, free →</span>
        </Link>

        <div className="font-['JetBrains_Mono',ui-monospace,monospace] text-[12px] text-[#5E726C] mt-5 uppercase tracking-[0.02em]">
          UL0 NEVER HOLDS YOUR MONEY
        </div>
      </div>

      {/* =====================================================================
          8. 5-LINK MINIMAL FOOTER
      ====================================================================== */}
      <footer className="border-t border-[#D3E2DD] py-8 px-6 bg-white font-['JetBrains_Mono',ui-monospace,monospace] text-[13px] text-[#5E726C]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 UL0</span>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="hover:text-[#0B1A17] transition-colors">
              Link shortener
            </Link>
            <Link href="/pricing" className="hover:text-[#0B1A17] transition-colors">
              Pricing
            </Link>
            <Link href="/privacy" className="hover:text-[#0B1A17] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#0B1A17] transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-[#0B1A17] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
