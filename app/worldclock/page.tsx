"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Maximize2, Minimize2, Plus, X, Search, Globe, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface City { name: string; timezone: string; country: string; emoji: string }

const popularCities: City[] = [
  { name: "New York", timezone: "America/New_York", country: "USA", emoji: "🗽" },
  { name: "Los Angeles", timezone: "America/Los_Angeles", country: "USA", emoji: "🌴" },
  { name: "London", timezone: "Europe/London", country: "UK", emoji: "🇬🇧" },
  { name: "Paris", timezone: "Europe/Paris", country: "France", emoji: "🗼" },
  { name: "Tokyo", timezone: "Asia/Tokyo", country: "Japan", emoji: "🗾" },
  { name: "Sydney", timezone: "Australia/Sydney", country: "Australia", emoji: "🦘" },
  { name: "Dubai", timezone: "Asia/Dubai", country: "UAE", emoji: "🏙️" },
  { name: "Singapore", timezone: "Asia/Singapore", country: "Singapore", emoji: "🇸🇬" },
  { name: "Mumbai", timezone: "Asia/Kolkata", country: "India", emoji: "🇮🇳" },
  { name: "Berlin", timezone: "Europe/Berlin", country: "Germany", emoji: "🇩🇪" },
  { name: "Moscow", timezone: "Europe/Moscow", country: "Russia", emoji: "🇷🇺" },
  { name: "Seoul", timezone: "Asia/Seoul", country: "South Korea", emoji: "🇰🇷" },
  { name: "Jakarta", timezone: "Asia/Jakarta", country: "Indonesia", emoji: "🇮🇩" },
  { name: "Bangkok", timezone: "Asia/Bangkok", country: "Thailand", emoji: "🇹🇭" },
  { name: "Toronto", timezone: "America/Toronto", country: "Canada", emoji: "🍁" },
  { name: "Amsterdam", timezone: "Europe/Amsterdam", country: "Netherlands", emoji: "🇳🇱" },
  { name: "Hong Kong", timezone: "Asia/Hong_Kong", country: "China", emoji: "🇭🇰" },
  { name: "São Paulo", timezone: "America/Sao_Paulo", country: "Brazil", emoji: "🇧🇷" },
]

function getTimeForTimezone(timezone: string): { time: string; date: string; period: string } {
  try {
    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hour12: true })
    const dateStr = now.toLocaleDateString("en-US", { timeZone: timezone, weekday: "short", month: "short", day: "numeric" })
    const parts = timeStr.split(" ")
    return { time: parts[0], date: dateStr, period: parts[1] || "" }
  } catch { return { time: "--:--", date: "---", period: "" } }
}

function isDaytime(timezone: string): boolean {
  try { const hour = parseInt(new Date().toLocaleString("en-US", { timeZone: timezone, hour: "numeric", hour12: false })); return hour >= 6 && hour < 18 } catch { return true }
}

function getTimeDiff(timezone: string): string {
  try {
    const now = new Date()
    const localOffset = now.getTimezoneOffset()
    const targetDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
    const localDate = new Date(now.toLocaleString("en-US"))
    const diff = (targetDate.getTime() - localDate.getTime()) / (1000 * 60 * 60)
    if (diff === 0) return "Same time"
    return diff > 0 ? `+${diff}h` : `${diff}h`
  } catch { return "" }
}

export default function WorldClockPage() {
  const [selectedCities, setSelectedCities] = useState<City[]>([popularCities[0], popularCities[2], popularCities[4], popularCities[5], popularCities[8]])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("ul0_worldclock_cities")
    if (saved) { 
      try { 
        const cities = JSON.parse(saved).map((name: string) => popularCities.find((c) => c.name === name)).filter(Boolean)
        if (cities.length > 0) setSelectedCities(cities) 
      } catch {} 
    }
  }, [])

  useEffect(() => { 
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval) 
  }, [])

  const addCity = (city: City) => {
    if (selectedCities.find((c) => c.name === city.name)) return
    if (selectedCities.length >= 10) return
    const updated = [...selectedCities, city]
    setSelectedCities(updated)
    localStorage.setItem("ul0_worldclock_cities", JSON.stringify(updated.map((c) => c.name)))
    setShowSearch(false); setSearchQuery("")
  }

  const removeCity = (cityName: string) => {
    const updated = selectedCities.filter((c) => c.name !== cityName)
    setSelectedCities(updated)
    localStorage.setItem("ul0_worldclock_cities", JSON.stringify(updated.map((c) => c.name)))
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

  const filteredCities = popularCities.filter((city) => 
    !selectedCities.find((c) => c.name === city.name) && 
    (city.name.toLowerCase().includes(searchQuery.toLowerCase()) || city.country.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <>
      {!isFullscreen && <Header />}
      <div ref={containerRef} className={cn(
        "min-h-screen transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 overflow-auto bg-[#191919]" : "bg-background"
      )}>
        <div className={cn("container mx-auto px-4 py-8", !isFullscreen && "max-w-5xl")}>
          {/* Header */}
          {!isFullscreen && (
            <div className="mb-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-flex items-center gap-1 transition-colors">
                ← Back to Home
              </Link>
              <div className="flex flex-wrap items-start justify-between gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-primary" />
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">World Clock</h1>
                    <p className="text-muted-foreground text-lg">Track multiple timezones at a glance</p>
                  </div>
                </div>
                <Button variant="outline" onClick={toggleFullscreen} className="gap-2">
                  <Maximize2 className="w-4 h-4" />
                  Fullscreen
                </Button>
              </div>
            </div>
          )}

          {/* Fullscreen Header */}
          {isFullscreen && (
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-indigo-400" />
                World Clock
              </h1>
              <Button variant="ghost" onClick={toggleFullscreen} className="text-white/70 hover:text-white hover:bg-white/10">
                <Minimize2 className="w-4 h-4 mr-2" />Exit
              </Button>
            </div>
          )}

          {/* City Grid */}
          <div className={cn(
            "grid gap-4",
            isFullscreen 
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {selectedCities.map((city) => {
              const { time, date, period } = getTimeForTimezone(city.timezone)
              const isDay = isDaytime(city.timezone)
              const timeDiff = getTimeDiff(city.timezone)
              return (
                <Card 
                  key={city.name} 
                  className={cn(
                    "relative group transition-all hover:shadow-md",
                    isFullscreen 
                      ? "bg-white/5 border-white/10 hover:bg-white/10" 
                      : "bg-card hover:bg-accent/50"
                  )}
                >
                  <CardContent className={cn("p-5", isFullscreen && "p-6")}>
                    {/* Remove Button */}
                    <button 
                      onClick={() => removeCity(city.name)} 
                      className={cn(
                        "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg",
                        isFullscreen 
                          ? "hover:bg-red-500/20 text-red-400" 
                          : "hover:bg-destructive/10 text-destructive"
                      )}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    {/* City Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{city.emoji}</span>
                      <div>
                        <h3 className={cn(
                          "font-semibold",
                          isFullscreen ? "text-white" : "text-foreground"
                        )}>
                          {city.name}
                        </h3>
                        <p className={cn(
                          "text-xs",
                          isFullscreen ? "text-white/50" : "text-muted-foreground"
                        )}>
                          {city.country} • {timeDiff}
                        </p>
                      </div>
                    </div>
                    
                    {/* Time Display */}
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "font-bold tabular-nums",
                        isFullscreen ? "text-5xl text-white" : "text-4xl text-foreground"
                      )}>
                        {time}
                      </span>
                      <span className={cn(
                        "text-lg",
                        isFullscreen ? "text-white/60" : "text-muted-foreground"
                      )}>
                        {period}
                      </span>
                    </div>
                    
                    {/* Date and Day/Night */}
                    <div className="flex items-center justify-between mt-3">
                      <span className={cn(
                        "text-sm",
                        isFullscreen ? "text-white/50" : "text-muted-foreground"
                      )}>
                        {date}
                      </span>
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                        isDay 
                          ? "bg-amber-500/10 text-amber-500" 
                          : "bg-indigo-500/10 text-indigo-400"
                      )}>
                        {isDay ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                        {isDay ? "Day" : "Night"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            
            {/* Add City Button */}
            {!isFullscreen && selectedCities.length < 10 && (
              <Card 
                className="cursor-pointer border-dashed hover:border-primary/50 hover:bg-accent/30 transition-all" 
                onClick={() => setShowSearch(true)}
              >
                <CardContent className="p-5 flex flex-col items-center justify-center h-full min-h-[180px]">
                  <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground">Add City</span>
                  <span className="text-xs text-muted-foreground mt-1">{selectedCities.length}/10</span>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Search Modal */}
          {showSearch && !isFullscreen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md bg-background border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Add City</h3>
                    <button 
                      onClick={() => { setShowSearch(false); setSearchQuery("") }} 
                      className="p-1 hover:bg-accent rounded-lg text-muted-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder="Search cities..." 
                      className="pl-10" 
                      autoFocus 
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto space-y-1">
                    {filteredCities.map((city) => (
                      <button 
                        key={city.name} 
                        onClick={() => addCity(city)} 
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                      >
                        <span className="text-xl">{city.emoji}</span>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{city.name}</div>
                          <div className="text-sm text-muted-foreground">{city.country}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getTimeForTimezone(city.timezone).time}
                        </div>
                      </button>
                    ))}
                    {filteredCities.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">No cities found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Footer Note */}
          {!isFullscreen && (
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Click on a city to remove • Add up to 10 cities • Saved automatically
              </p>
            </div>
          )}
        </div>
      </div>
      {!isFullscreen && <Footer />}
    </>
  )
}
