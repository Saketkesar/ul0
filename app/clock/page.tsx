"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Maximize, 
  Minimize, 
  Settings, 
  X,
  Sun,
  Moon,
  Sparkles,
  Monitor,
  Palette
} from "lucide-react"

type ClockTheme = "minimal" | "neon" | "retro" | "gradient" | "terminal"

const THEMES: { id: ClockTheme; name: string; icon: React.ReactNode }[] = [
  { id: "minimal", name: "Minimal", icon: <Sun className="h-4 w-4" /> },
  { id: "neon", name: "Neon", icon: <Sparkles className="h-4 w-4" /> },
  { id: "retro", name: "Retro", icon: <Monitor className="h-4 w-4" /> },
  { id: "gradient", name: "Gradient", icon: <Palette className="h-4 w-4" /> },
  { id: "terminal", name: "Terminal", icon: <Moon className="h-4 w-4" /> },
]

export default function ClockPage() {
  const [time, setTime] = useState(new Date())
  const [theme, setTheme] = useState<ClockTheme>("minimal")
  const [showSeconds, setShowSeconds] = useState(true)
  const [show24Hour, setShow24Hour] = useState(false)
  const [showDate, setShowDate] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }

  const formatTime = () => {
    let hours = time.getHours()
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()
    let period = ""

    if (!show24Hour) {
      period = hours >= 12 ? " PM" : " AM"
      hours = hours % 12 || 12
    }

    const h = hours.toString().padStart(2, "0")
    const m = minutes.toString().padStart(2, "0")
    const s = seconds.toString().padStart(2, "0")

    if (showSeconds) {
      return { time: `${h}:${m}:${s}`, period }
    }
    return { time: `${h}:${m}`, period }
  }

  const formatDate = () => {
    return time.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getThemeStyles = () => {
    switch (theme) {
      case "neon":
        return {
          bg: "bg-black",
          text: "text-cyan-400",
          glow: "drop-shadow-[0_0_25px_rgba(34,211,238,0.8)] drop-shadow-[0_0_50px_rgba(34,211,238,0.4)]",
          date: "text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]",
          font: "font-mono",
        }
      case "retro":
        return {
          bg: "bg-amber-950",
          text: "text-amber-500",
          glow: "drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]",
          date: "text-amber-600",
          font: "font-mono",
        }
      case "gradient":
        return {
          bg: "bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900",
          text: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500",
          glow: "",
          date: "text-purple-300",
          font: "font-bold",
        }
      case "terminal":
        return {
          bg: "bg-[#0d1117]",
          text: "text-green-500",
          glow: "drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]",
          date: "text-green-600",
          font: "font-mono",
        }
      default: // minimal
        return {
          bg: "bg-zinc-950",
          text: "text-white",
          glow: "",
          date: "text-zinc-500",
          font: "font-light",
        }
    }
  }

  const styles = getThemeStyles()
  const { time: timeStr, period } = formatTime()

  return (
    <div 
      className={`min-h-screen ${styles.bg} flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500`}
    >
      {/* Animated background elements for certain themes */}
      {theme === "neon" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </>
      )}
      
      {theme === "gradient" && (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px] animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-pink-500/30 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-4 right-4 z-50 bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 min-w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Settings</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(false)}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Theme Selection */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">Theme</label>
              <div className="grid grid-cols-5 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                      theme === t.id
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                    title={t.name}
                  >
                    {t.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/60 text-sm">Show Seconds</span>
                <button
                  onClick={() => setShowSeconds(!showSeconds)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    showSeconds ? "bg-cyan-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full m-1 transition-transform ${
                      showSeconds ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/60 text-sm">24 Hour Format</span>
                <button
                  onClick={() => setShow24Hour(!show24Hour)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    show24Hour ? "bg-cyan-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full m-1 transition-transform ${
                      show24Hour ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/60 text-sm">Show Date</span>
                <button
                  onClick={() => setShowDate(!showDate)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    showDate ? "bg-cyan-500" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full m-1 transition-transform ${
                      showDate ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons - Hidden in fullscreen until hover */}
      <div 
        className={`absolute top-4 left-4 z-50 flex gap-2 transition-opacity duration-300 ${
          isFullscreen ? "opacity-0 hover:opacity-100" : "opacity-100"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
          className="text-white/40 hover:text-white hover:bg-white/10 rounded-full"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="text-white/40 hover:text-white hover:bg-white/10 rounded-full"
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
      </div>

      {/* Main Clock Display */}
      <div className="relative z-10 text-center select-none">
        <div 
          className={`${styles.font} ${styles.text} ${styles.glow} text-[12vw] sm:text-[15vw] md:text-[18vw] leading-none tracking-tight transition-all duration-300`}
        >
          {timeStr}
          {!show24Hour && (
            <span className="text-[3vw] ml-2 opacity-60">{period}</span>
          )}
        </div>
        
        {showDate && (
          <div className={`${styles.date} ${styles.font} text-[2vw] sm:text-[2.5vw] mt-4 tracking-widest uppercase`}>
            {formatDate()}
          </div>
        )}
      </div>

      {/* Branding - Subtle */}
      <div 
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-white/20 text-xs tracking-widest transition-opacity ${
          isFullscreen ? "opacity-0" : "opacity-100"
        }`}
      >
        ul0.site/clock
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 10px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 15s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
