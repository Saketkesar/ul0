"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, RotateCcw, Maximize2, Minimize2, Share2, Copy, Check, Trash2, Plus, Calendar } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface Countdown { id: string; title: string; targetDate: Date; theme: string }

const themes = {
  default: { bg: "bg-background", text: "text-foreground", accent: "text-primary", card: "bg-card border-border" },
  neon: { bg: "bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950", text: "text-cyan-400", accent: "text-pink-400", card: "bg-black/40 border-cyan-500/30" },
  sunset: { bg: "bg-gradient-to-br from-orange-600 via-rose-600 to-purple-800", text: "text-white", accent: "text-yellow-200", card: "bg-white/10 border-white/20" },
  ocean: { bg: "bg-gradient-to-br from-blue-950 via-cyan-900 to-teal-800", text: "text-white", accent: "text-cyan-300", card: "bg-white/10 border-white/20" },
  forest: { bg: "bg-gradient-to-br from-green-950 via-emerald-900 to-teal-900", text: "text-emerald-100", accent: "text-lime-300", card: "bg-white/10 border-white/20" },
  midnight: { bg: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900", text: "text-white", accent: "text-indigo-300", card: "bg-white/5 border-white/10" },
}

type ThemeName = keyof typeof themes

function calculateTimeLeft(targetDate: Date) {
  const now = new Date().getTime()
  const target = targetDate.getTime()
  const difference = target - now
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  }
}

export default function CountdownPage() {
  const [title, setTitle] = useState("My Countdown")
  const [targetDate, setTargetDate] = useState("")
  const [targetTime, setTargetTime] = useState("12:00")
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("default")
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [savedCountdowns, setSavedCountdowns] = useState<Countdown[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("ul0_countdowns")
    if (saved) { try { setSavedCountdowns(JSON.parse(saved).map((c: Countdown) => ({ ...c, targetDate: new Date(c.targetDate) }))) } catch {} }
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); setTargetDate(tomorrow.toISOString().split("T")[0])
  }, [])

  useEffect(() => {
    if (!isRunning || !targetDate) return
    const target = new Date(`${targetDate}T${targetTime}:00`)
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft(target)), 1000)
    setTimeLeft(calculateTimeLeft(target))
    return () => clearInterval(interval)
  }, [isRunning, targetDate, targetTime])

  const startCountdown = () => { if (targetDate) setIsRunning(true) }
  const resetCountdown = () => { setIsRunning(false); setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false }) }

  const saveCountdown = () => {
    if (!targetDate || !title.trim()) return
    const newCountdown: Countdown = { id: Date.now().toString(), title: title.trim(), targetDate: new Date(`${targetDate}T${targetTime}:00`), theme: currentTheme }
    const updated = [...savedCountdowns, newCountdown]
    setSavedCountdowns(updated)
    localStorage.setItem("ul0_countdowns", JSON.stringify(updated))
  }

  const loadCountdown = (countdown: Countdown) => {
    setTitle(countdown.title)
    setTargetDate(countdown.targetDate.toISOString().split("T")[0])
    setTargetTime(countdown.targetDate.toTimeString().slice(0, 5))
    setCurrentTheme(countdown.theme as ThemeName)
    setIsRunning(true)
  }

  const deleteCountdown = (id: string) => {
    const updated = savedCountdowns.filter((c) => c.id !== id)
    setSavedCountdowns(updated)
    localStorage.setItem("ul0_countdowns", JSON.stringify(updated))
  }

  const copyShareLink = () => {
    const url = new URL(window.location.href)
    url.searchParams.set("title", title); url.searchParams.set("date", targetDate); url.searchParams.set("time", targetTime); url.searchParams.set("theme", currentTheme)
    navigator.clipboard.writeText(url.toString())
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    try { if (!document.fullscreenElement) { await containerRef.current.requestFullscreen(); setIsFullscreen(true) } else { await document.exitFullscreen(); setIsFullscreen(false) } } catch {}
  }

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("title")) setTitle(params.get("title")!)
    if (params.get("date")) setTargetDate(params.get("date")!)
    if (params.get("time")) setTargetTime(params.get("time")!)
    if (params.get("theme") && themes[params.get("theme") as ThemeName]) setCurrentTheme(params.get("theme") as ThemeName)
    if (params.get("date")) setIsRunning(true)
  }, [])

  const theme = themes[currentTheme]
  const isDefaultTheme = currentTheme === "default"

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className={cn(
      "p-4 md:p-6 rounded-2xl text-center border",
      isDefaultTheme ? "bg-card border-border" : cn(theme.card, "backdrop-blur-sm")
    )}>
      <div className={cn(
        "text-5xl md:text-7xl lg:text-8xl font-bold tabular-nums",
        isDefaultTheme ? "text-foreground" : theme.text,
        currentTheme === "neon" && "drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]"
      )}>
        {String(value).padStart(2, "0")}
      </div>
      <div className={cn(
        "text-sm md:text-base mt-2 uppercase tracking-wider font-medium",
        isDefaultTheme ? "text-muted-foreground" : theme.accent
      )}>
        {label}
      </div>
    </div>
  )

  return (
    <>
      {!isFullscreen && <Header />}
      <div 
        ref={containerRef} 
        className={cn(
          "min-h-screen transition-all duration-500",
          isDefaultTheme ? "bg-background" : theme.bg,
          isFullscreen && "fixed inset-0 z-50 overflow-auto"
        )}
      >
        <div className={cn("container mx-auto px-4 py-8", !isFullscreen && "max-w-4xl")}>
          {/* Header */}
          {!isFullscreen && (
            <div className="mb-8">
              <Link 
                href="/" 
                className={cn(
                  "text-sm mb-6 inline-flex items-center gap-1 transition-colors",
                  isDefaultTheme ? "text-muted-foreground hover:text-foreground" : "text-white/60 hover:text-white/80"
                )}
              >
                ← Back to Home
              </Link>
              <div className="flex items-center gap-3 mt-4 mb-2">
                <span className="text-3xl">⏰</span>
                <h1 className={cn(
                  "text-3xl md:text-4xl font-bold tracking-tight",
                  isDefaultTheme ? "text-foreground" : "text-white"
                )}>
                  Countdown Creator
                </h1>
              </div>
              <p className={cn(
                "text-lg",
                isDefaultTheme ? "text-muted-foreground" : "text-white/60"
              )}>
                Create beautiful countdown timers for any event
              </p>
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center mb-8">
            {isRunning && (
              <h2 className={cn(
                "text-2xl md:text-4xl font-semibold mb-6",
                isDefaultTheme ? "text-foreground" : theme.text
              )}>
                {title}
              </h2>
            )}
            
            {isRunning && !timeLeft.isExpired ? (
              <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto mb-8">
                <TimeBlock value={timeLeft.days} label="Days" />
                <TimeBlock value={timeLeft.hours} label="Hours" />
                <TimeBlock value={timeLeft.minutes} label="Minutes" />
                <TimeBlock value={timeLeft.seconds} label="Seconds" />
              </div>
            ) : isRunning && timeLeft.isExpired ? (
              <div className="text-center py-12">
                <div className="text-6xl md:text-8xl mb-4">🎉</div>
                <h3 className={cn(
                  "text-3xl md:text-5xl font-bold mb-2",
                  isDefaultTheme ? "text-foreground" : theme.text
                )}>
                  Time&apos;s Up!
                </h3>
                <p className={cn(
                  "text-xl",
                  isDefaultTheme ? "text-muted-foreground" : theme.accent
                )}>
                  {title} has arrived!
                </p>
              </div>
            ) : (
              <div className={cn(
                "py-12",
                isDefaultTheme ? "text-muted-foreground" : "text-white/50"
              )}>
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-xl">Set a date and start your countdown</p>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {!isRunning ? (
                <Button 
                  onClick={startCountdown} 
                  disabled={!targetDate} 
                  className={cn(
                    isDefaultTheme 
                      ? "" 
                      : "bg-white/20 hover:bg-white/30 text-white border-0"
                  )}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Countdown
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={resetCountdown} 
                    variant="outline" 
                    className={cn(
                      !isDefaultTheme && "border-white/30 text-white hover:bg-white/10 bg-transparent"
                    )}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button 
                    onClick={copyShareLink} 
                    variant="outline" 
                    className={cn(
                      !isDefaultTheme && "border-white/30 text-white hover:bg-white/10 bg-transparent"
                    )}
                  >
                    {copied ? <><Check className="w-4 h-4 mr-2" />Copied!</> : <><Share2 className="w-4 h-4 mr-2" />Share</>}
                  </Button>
                </>
              )}
              <Button 
                onClick={toggleFullscreen} 
                variant="outline"
                className={cn(
                  !isDefaultTheme && "border-white/30 text-white hover:bg-white/10 bg-transparent"
                )}
              >
                {isFullscreen ? <><Minimize2 className="w-4 h-4 mr-2" />Exit</> : <><Maximize2 className="w-4 h-4 mr-2" />Fullscreen</>}
              </Button>
            </div>
          </div>

          {/* Settings Card */}
          {!isFullscreen && (
            <div className="max-w-2xl mx-auto">
              <Card className={cn(
                "border",
                isDefaultTheme ? "bg-card" : cn(theme.card, "backdrop-blur-xl")
              )}>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={cn(isDefaultTheme ? "text-foreground" : "text-white")}>
                        Event Title
                      </Label>
                      <Input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="My Birthday" 
                        className={cn(
                          isDefaultTheme 
                            ? "bg-background border-input" 
                            : "bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        )} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={cn(isDefaultTheme ? "text-foreground" : "text-white")}>
                        Target Date
                      </Label>
                      <Input 
                        type="date" 
                        value={targetDate} 
                        onChange={(e) => setTargetDate(e.target.value)} 
                        className={cn(
                          isDefaultTheme 
                            ? "bg-background border-input" 
                            : "bg-white/10 border-white/20 text-white [color-scheme:dark]"
                        )} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={cn(isDefaultTheme ? "text-foreground" : "text-white")}>
                        Target Time
                      </Label>
                      <Input 
                        type="time" 
                        value={targetTime} 
                        onChange={(e) => setTargetTime(e.target.value)} 
                        className={cn(
                          isDefaultTheme 
                            ? "bg-background border-input" 
                            : "bg-white/10 border-white/20 text-white [color-scheme:dark]"
                        )} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={cn(isDefaultTheme ? "text-foreground" : "text-white")}>
                        Theme
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(themes) as ThemeName[]).map((themeName) => (
                          <button 
                            key={themeName} 
                            onClick={() => setCurrentTheme(themeName)} 
                            className={cn(
                              "w-8 h-8 rounded-full border-2 transition-all",
                              themeName === "default" 
                                ? "bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900" 
                                : themeName === "neon"
                                  ? "bg-gradient-to-br from-violet-600 to-fuchsia-600"
                                  : themeName === "sunset"
                                    ? "bg-gradient-to-br from-orange-500 to-purple-600"
                                    : themeName === "ocean"
                                      ? "bg-gradient-to-br from-blue-500 to-teal-500"
                                      : themeName === "forest"
                                        ? "bg-gradient-to-br from-green-600 to-teal-600"
                                        : "bg-gradient-to-br from-slate-700 to-indigo-900",
                              currentTheme === themeName 
                                ? "border-primary scale-110 ring-2 ring-primary/50" 
                                : "border-transparent opacity-70 hover:opacity-100"
                            )} 
                            title={themeName} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className={cn(isDefaultTheme ? "text-foreground" : "text-white")}>
                      Quick Presets
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { setTitle("New Year 2026"); setTargetDate("2026-01-01"); setTargetTime("00:00") }} 
                        className={cn(
                          !isDefaultTheme && "border-white/20 text-white hover:bg-white/10 bg-transparent"
                        )}
                      >
                        🎆 New Year 2026
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { setTitle("Christmas 2025"); setTargetDate("2025-12-25"); setTargetTime("00:00") }} 
                        className={cn(
                          !isDefaultTheme && "border-white/20 text-white hover:bg-white/10 bg-transparent"
                        )}
                      >
                        🎄 Christmas 2025
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={saveCountdown} 
                    disabled={!targetDate || !title.trim()} 
                    className={cn(
                      "w-full",
                      isDefaultTheme 
                        ? "" 
                        : "bg-white/20 hover:bg-white/30 text-white border-0"
                    )}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Save Countdown
                  </Button>
                </CardContent>
              </Card>

              {/* Saved Countdowns */}
              {savedCountdowns.length > 0 && (
                <div className="mt-8">
                  <h3 className={cn(
                    "text-xl font-semibold mb-4",
                    isDefaultTheme ? "text-foreground" : "text-white"
                  )}>
                    📋 Saved Countdowns
                  </h3>
                  <div className="grid gap-3">
                    {savedCountdowns.map((countdown) => (
                      <Card 
                        key={countdown.id} 
                        className={cn(
                          "cursor-pointer hover:shadow-md transition-all",
                          isDefaultTheme 
                            ? "bg-card hover:bg-accent/50" 
                            : cn(theme.card, "hover:bg-white/10")
                        )} 
                        onClick={() => loadCountdown(countdown)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <h4 className={cn(
                              "font-medium",
                              isDefaultTheme ? "text-foreground" : "text-white"
                            )}>
                              {countdown.title}
                            </h4>
                            <p className={cn(
                              "text-sm",
                              isDefaultTheme ? "text-muted-foreground" : "text-white/60"
                            )}>
                              {countdown.targetDate.toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); deleteCountdown(countdown.id) }} 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {!isFullscreen && <Footer />}
    </>
  )
}
