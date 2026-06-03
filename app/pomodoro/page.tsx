"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Maximize2, Minimize2, BarChart3, Eye, Coffee, Target, Trash2, SkipForward, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

interface Session { id: string; date: string; focusMinutes: number; sessions: number; breaks: number }

type TimerMode = "focus" | "shortBreak" | "longBreak"

const modeConfig = {
  focus: { label: "Focus Time", emoji: "🎯", color: "from-rose-500 to-orange-500", bgColor: "bg-background" },
  shortBreak: { label: "Short Break", emoji: "☕", color: "from-emerald-500 to-teal-500", bgColor: "bg-background" },
  longBreak: { label: "Long Break", emoji: "🧘", color: "from-blue-500 to-indigo-500", bgColor: "bg-background" },
}

// Better notification sounds
const SOUNDS = {
  focus: "https://cdn.freesound.org/previews/80/80921_1022651-lq.mp3", // Soft bell
  break: "https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3", // Gentle chime
  complete: "https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3", // Achievement sound
}

export default function PomodoroPage() {
  const [focusDuration, setFocusDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>("focus")
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [autoStartBreaks, setAutoStartBreaks] = useState(true)
  const [autoStartFocus, setAutoStartFocus] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [eyeProtection, setEyeProtection] = useState(true)
  const [showBreakOverlay, setShowBreakOverlay] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [showStats, setShowStats] = useState(false)
  const [longBreakInterval, setLongBreakInterval] = useState(4)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ul0_pomodoro_sessions")
    if (saved) { try { setSessions(JSON.parse(saved)) } catch {} }
    const stats = localStorage.getItem("ul0_pomodoro_stats")
    if (stats) { try { const s = JSON.parse(stats); setSessionsCompleted(s.sessions || 0); setTotalFocusMinutes(s.totalMinutes || 0) } catch {} }
    const settings = localStorage.getItem("ul0_pomodoro_settings")
    if (settings) { 
      try { 
        const s = JSON.parse(settings)
        if (s.focusDuration) setFocusDuration(s.focusDuration)
        if (s.shortBreakDuration) setShortBreakDuration(s.shortBreakDuration)
        if (s.longBreakDuration) setLongBreakDuration(s.longBreakDuration)
        if (s.autoStartBreaks !== undefined) setAutoStartBreaks(s.autoStartBreaks)
        if (s.autoStartFocus !== undefined) setAutoStartFocus(s.autoStartFocus)
        if (s.eyeProtection !== undefined) setEyeProtection(s.eyeProtection)
        if (s.longBreakInterval) setLongBreakInterval(s.longBreakInterval)
      } catch {} 
    }
  }, [])

  // Save settings
  const saveSettings = useCallback(() => {
    localStorage.setItem("ul0_pomodoro_settings", JSON.stringify({
      focusDuration, shortBreakDuration, longBreakDuration, autoStartBreaks, autoStartFocus, eyeProtection, longBreakInterval
    }))
  }, [focusDuration, shortBreakDuration, longBreakDuration, autoStartBreaks, autoStartFocus, eyeProtection, longBreakInterval])

  useEffect(() => { saveSettings() }, [saveSettings])

  // Save session data
  const saveSession = useCallback(() => {
    const today = new Date().toISOString().split("T")[0]
    setSessions(prev => {
      const existing = prev.find(s => s.date === today)
      let updated: Session[]
      if (existing) {
        updated = prev.map(s => s.date === today ? { ...s, focusMinutes: s.focusMinutes + focusDuration, sessions: s.sessions + 1 } : s)
      } else {
        updated = [...prev, { id: Date.now().toString(), date: today, focusMinutes: focusDuration, sessions: 1, breaks: 0 }]
      }
      localStorage.setItem("ul0_pomodoro_sessions", JSON.stringify(updated.slice(-30))) // Keep last 30 days
      return updated
    })
  }, [focusDuration])

  // Play notification sound
  const playSound = useCallback((type: 'focus' | 'break' | 'complete') => {
    if (!soundEnabled) return
    try {
      const audio = new Audio(SOUNDS[type])
      audio.volume = 0.6
      audio.play().catch(() => {})
    } catch {}
  }, [soundEnabled])

  // Timer logic
  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (mode === "focus") {
            playSound('complete')
            const newSessions = sessionsCompleted + 1
            setSessionsCompleted(newSessions)
            setTotalFocusMinutes(prev => prev + focusDuration)
            localStorage.setItem("ul0_pomodoro_stats", JSON.stringify({ sessions: newSessions, totalMinutes: totalFocusMinutes + focusDuration }))
            saveSession()
            const nextMode = newSessions % longBreakInterval === 0 ? "longBreak" : "shortBreak"
            setMode(nextMode)
            setShowBreakOverlay(eyeProtection)
            if (autoStartBreaks) setIsRunning(true)
            else setIsRunning(false)
            return (nextMode === "longBreak" ? longBreakDuration : shortBreakDuration) * 60
          } else {
            playSound('focus')
            setMode("focus")
            setShowBreakOverlay(false)
            if (autoStartFocus) setIsRunning(true)
            else setIsRunning(false)
            return focusDuration * 60
          }
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, mode, focusDuration, shortBreakDuration, longBreakDuration, sessionsCompleted, autoStartBreaks, autoStartFocus, playSound, saveSession, totalFocusMinutes, eyeProtection, longBreakInterval])

  // Update document title
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    document.title = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")} - ${modeConfig[mode].label} | ul0`
    return () => { document.title = "Pomodoro Timer | ul0" }
  }, [timeLeft, mode])

  const toggleTimer = () => { 
    setIsRunning(!isRunning)
    if (showBreakOverlay && !isRunning) setShowBreakOverlay(false) 
  }
  
  const resetTimer = () => { 
    setIsRunning(false)
    setMode("focus")
    setTimeLeft(focusDuration * 60)
    setShowBreakOverlay(false) 
  }
  
  const switchMode = (newMode: TimerMode) => { 
    setMode(newMode)
    setIsRunning(false)
    setShowBreakOverlay(false)
    setTimeLeft(newMode === "focus" ? focusDuration * 60 : newMode === "shortBreak" ? shortBreakDuration * 60 : longBreakDuration * 60) 
  }

  const skipBreak = () => {
    setShowBreakOverlay(false)
    setMode("focus")
    setTimeLeft(focusDuration * 60)
    setIsRunning(false)
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

  const clearHistory = () => { 
    setSessions([])
    localStorage.removeItem("ul0_pomodoro_sessions")
    setSessionsCompleted(0)
    setTotalFocusMinutes(0)
    localStorage.removeItem("ul0_pomodoro_stats") 
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = mode === "focus" 
    ? (1 - timeLeft / (focusDuration * 60)) * 100 
    : mode === "shortBreak" 
      ? (1 - timeLeft / (shortBreakDuration * 60)) * 100 
      : (1 - timeLeft / (longBreakDuration * 60)) * 100
  const config = modeConfig[mode]

  // Get last 7 days for chart
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split("T")[0]
    const session = sessions.find(s => s.date === dateStr)
    return { date: date.toLocaleDateString("en-US", { weekday: "short" }), minutes: session?.focusMinutes || 0, sessions: session?.sessions || 0 }
  })
  const maxMinutes = Math.max(...last7Days.map(d => d.minutes), 25)

  return (
    <>
      {!isFullscreen && <Header />}
      <div ref={containerRef} className={cn(
        "min-h-screen transition-all duration-500",
        "bg-background",
        isFullscreen && "fixed inset-0 z-50 overflow-auto",
        showBreakOverlay && eyeProtection && "!bg-[#0a0a0a]"
      )}>
        {/* Break Overlay - Eye Protection Mode */}
        {showBreakOverlay && eyeProtection && (
          <div className="fixed inset-0 bg-[#0a0a0a] z-40 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="text-8xl mb-8">{mode === "longBreak" ? "🧘" : "☕"}</div>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-500 mb-4">
                {mode === "longBreak" ? "Long Break" : "Short Break"}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Rest your eyes. Look away from the screen.
                <br />
                <span className="text-gray-700 text-sm mt-2 block">Follow the 20-20-20 rule: Look at something 20 feet away.</span>
              </p>
              <div className="text-[120px] md:text-[180px] font-bold text-gray-700 tabular-nums leading-none mb-8">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => { setShowBreakOverlay(false) }} 
                  variant="outline" 
                  className="border-gray-700 text-gray-400 hover:bg-gray-800"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Show Screen
                </Button>
                <Button 
                  onClick={skipBreak}
                  variant="outline" 
                  className="border-gray-700 text-gray-400 hover:bg-gray-800"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip & Focus
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className={cn("container mx-auto px-4 py-8", !isFullscreen && "max-w-4xl")}>
          {/* Header */}
          {!isFullscreen && !showBreakOverlay && (
            <div className="mb-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-flex items-center gap-1 transition-colors">
                ← Back to Home
              </Link>
              <div className="flex items-center gap-3 mt-4 mb-2">
                <span className="text-3xl">🍅</span>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Pomodoro Timer</h1>
              </div>
              <p className="text-muted-foreground text-lg">Focus in {focusDuration}-minute sessions with short breaks</p>
            </div>
          )}

          {!showBreakOverlay && (
            <>
              {/* Mode Selector */}
              <div className="flex justify-center gap-2 mb-8">
                {(["focus", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
                  <Button 
                    key={m} 
                    onClick={() => switchMode(m)} 
                    variant={mode === m ? "default" : "outline"} 
                    className={cn(
                      "transition-all",
                      mode === m && `bg-gradient-to-r ${modeConfig[m].color} text-white border-0`
                    )}
                  >
                    <span className="mr-2">{modeConfig[m].emoji}</span>
                    {modeConfig[m].label}
                  </Button>
                ))}
              </div>

              {/* Timer Display */}
              <Card className="max-w-lg mx-auto mb-8 overflow-hidden border">
                <div 
                  className={cn("h-1.5 bg-gradient-to-r transition-all duration-1000", config.color)} 
                  style={{ width: `${progress}%` }} 
                />
                <CardContent className="p-8 md:p-12 text-center">
                  <div className={cn(
                    "text-7xl md:text-9xl font-bold tabular-nums bg-gradient-to-r bg-clip-text text-transparent",
                    config.color
                  )}>
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </div>
                  <p className="text-lg text-muted-foreground mt-4 flex items-center justify-center gap-2">
                    <span>{config.emoji}</span>
                    {config.label}
                  </p>
                  {mode === "focus" && sessionsCompleted > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Session {(sessionsCompleted % longBreakInterval) + 1} of {longBreakInterval} until long break
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Controls */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Button 
                  size="lg" 
                  onClick={toggleTimer} 
                  className={cn("min-w-[120px] bg-gradient-to-r text-white border-0", config.color)}
                >
                  {isRunning ? <><Pause className="w-5 h-5 mr-2" />Pause</> : <><Play className="w-5 h-5 mr-2" />Start</>}
                </Button>
                <Button size="lg" variant="outline" onClick={resetTimer}>
                  <RotateCcw className="w-5 h-5 mr-2" />Reset
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={!soundEnabled ? "text-muted-foreground" : ""}
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setShowSettings(!showSettings)}
                  className={showSettings ? "bg-accent" : ""}
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setShowStats(!showStats)}
                  className={showStats ? "bg-accent" : ""}
                >
                  <BarChart3 className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
              </div>

              {/* Stats Cards */}
              {!isFullscreen && (
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-foreground">{sessionsCompleted}</div>
                      <div className="text-sm text-muted-foreground">Sessions</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-foreground">{totalFocusMinutes}</div>
                      <div className="text-sm text-muted-foreground">Minutes</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-foreground">{Math.floor(totalFocusMinutes / 60)}h</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Settings Panel */}
              {showSettings && !isFullscreen && (
                <Card className="max-w-lg mx-auto mb-8">
                  <CardContent className="p-6 space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Settings
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <Label className="flex items-center justify-between mb-2">
                          <span>Focus Duration</span>
                          <span className="text-muted-foreground">{focusDuration} min</span>
                        </Label>
                        <Slider 
                          value={[focusDuration]} 
                          onValueChange={(v) => { setFocusDuration(v[0]); if (mode === "focus" && !isRunning) setTimeLeft(v[0] * 60) }} 
                          min={5} max={60} step={5} 
                        />
                      </div>
                      <div>
                        <Label className="flex items-center justify-between mb-2">
                          <span>Short Break</span>
                          <span className="text-muted-foreground">{shortBreakDuration} min</span>
                        </Label>
                        <Slider 
                          value={[shortBreakDuration]} 
                          onValueChange={(v) => { setShortBreakDuration(v[0]); if (mode === "shortBreak" && !isRunning) setTimeLeft(v[0] * 60) }} 
                          min={1} max={15} step={1} 
                        />
                      </div>
                      <div>
                        <Label className="flex items-center justify-between mb-2">
                          <span>Long Break</span>
                          <span className="text-muted-foreground">{longBreakDuration} min</span>
                        </Label>
                        <Slider 
                          value={[longBreakDuration]} 
                          onValueChange={(v) => { setLongBreakDuration(v[0]); if (mode === "longBreak" && !isRunning) setTimeLeft(v[0] * 60) }} 
                          min={10} max={30} step={5} 
                        />
                      </div>
                      <div>
                        <Label className="flex items-center justify-between mb-2">
                          <span>Long Break After</span>
                          <span className="text-muted-foreground">{longBreakInterval} sessions</span>
                        </Label>
                        <Slider 
                          value={[longBreakInterval]} 
                          onValueChange={(v) => setLongBreakInterval(v[0])} 
                          min={2} max={6} step={1} 
                        />
                      </div>
                      <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Play className="w-4 h-4 text-muted-foreground" />
                            Auto-start Breaks
                          </Label>
                          <Switch checked={autoStartBreaks} onCheckedChange={setAutoStartBreaks} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-muted-foreground" />
                            Auto-start Focus
                          </Label>
                          <Switch checked={autoStartFocus} onCheckedChange={setAutoStartFocus} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            Eye Protection (dim on breaks)
                          </Label>
                          <Switch checked={eyeProtection} onCheckedChange={setEyeProtection} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats Panel with Chart */}
              {showStats && !isFullscreen && (
                <Card className="max-w-2xl mx-auto mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Last 7 Days
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearHistory} 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />Clear
                      </Button>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-40 mb-4">
                      {last7Days.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex flex-col items-center justify-end h-32">
                            <div 
                              className={cn("w-full max-w-[40px] rounded-t-lg bg-gradient-to-t transition-all", config.color)} 
                              style={{ height: `${(day.minutes / maxMinutes) * 100}%`, minHeight: day.minutes > 0 ? "8px" : "0" }} 
                            />
                          </div>
                          <span className="text-xs text-muted-foreground mt-2">{day.date}</span>
                          <span className="text-xs font-medium">{day.minutes}m</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-sm text-muted-foreground border-t pt-4">
                      <p>Total this week: <strong>{last7Days.reduce((a, b) => a + b.minutes, 0)}</strong> minutes ({last7Days.reduce((a, b) => a + b.sessions, 0)} sessions)</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tips */}
              {!isFullscreen && !showSettings && !showStats && (
                <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">🎯 The Pomodoro Technique</h4>
                      <p className="text-sm text-muted-foreground">
                        Work for {focusDuration} minutes, then take a {shortBreakDuration}-minute break. 
                        After {longBreakInterval} sessions, take a longer {longBreakDuration}-minute break.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">👁️ Eye Protection</h4>
                      <p className="text-sm text-muted-foreground">
                        During breaks, the screen dims to remind you to look away and rest your eyes. Follow the 20-20-20 rule!
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {!isFullscreen && !showBreakOverlay && <Footer />}
    </>
  )
}
