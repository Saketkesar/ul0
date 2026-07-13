"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import {
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CloudRain,
  Coffee,
  Waves,
  Wind,
  Flame,
  Bird,
  Moon,
  TreePine,
  Zap,
  Droplets,
  Music,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface SoundTrack {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  audioUrl: string
}

// Using local audio files stored in public/sounds folder
const soundTracks: SoundTrack[] = [
  { id: "rain", name: "Rain", icon: <CloudRain className="w-6 h-6" />, color: "from-blue-500 to-blue-700", audioUrl: "/sounds/rain.mp3" },
  { id: "thunder", name: "Thunder", icon: <Zap className="w-6 h-6" />, color: "from-slate-600 to-slate-800", audioUrl: "/sounds/thunder.mp3" },
  { id: "ocean", name: "Ocean", icon: <Waves className="w-6 h-6" />, color: "from-cyan-500 to-cyan-700", audioUrl: "/sounds/ocean.mp3" },
  { id: "wind", name: "Wind", icon: <Wind className="w-6 h-6" />, color: "from-gray-400 to-gray-600", audioUrl: "/sounds/wind.mp3" },
  { id: "fire", name: "Fire", icon: <Flame className="w-6 h-6" />, color: "from-orange-500 to-red-600", audioUrl: "/sounds/fire.mp3" },
  { id: "birds", name: "Birds", icon: <Bird className="w-6 h-6" />, color: "from-green-500 to-green-700", audioUrl: "/sounds/birds.mp3" },
  { id: "forest", name: "Forest", icon: <TreePine className="w-6 h-6" />, color: "from-emerald-600 to-emerald-800", audioUrl: "/sounds/forest.mp3" },
  { id: "night", name: "Night", icon: <Moon className="w-6 h-6" />, color: "from-indigo-600 to-purple-800", audioUrl: "/sounds/night.mp3" },
  { id: "cafe", name: "Café", icon: <Coffee className="w-6 h-6" />, color: "from-amber-500 to-amber-700", audioUrl: "/sounds/cafe.mp3" },
]

interface ActiveSound {
  id: string
  volume: number
  isLoading: boolean
}

export default function AmbientPage() {
  const [activeSounds, setActiveSounds] = useState<Map<string, ActiveSound>>(new Map())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [masterVolume, setMasterVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map())

  useEffect(() => {
    const effectiveVolume = isMuted ? 0 : masterVolume / 100
    activeSounds.forEach((sound, id) => {
      const audio = audioRefs.current.get(id)
      if (audio) audio.volume = (sound.volume / 100) * effectiveVolume
    })
  }, [masterVolume, isMuted, activeSounds])

  const toggleSound = useCallback((track: SoundTrack) => {
    const existingAudio = audioRefs.current.get(track.id)
    if (existingAudio) {
      existingAudio.pause()
      existingAudio.currentTime = 0
      existingAudio.src = ""
      audioRefs.current.delete(track.id)
      setActiveSounds(prev => { const newMap = new Map(prev); newMap.delete(track.id); return newMap })
    } else {
      setActiveSounds(prev => { const newMap = new Map(prev); newMap.set(track.id, { id: track.id, volume: 70, isLoading: true }); return newMap })

      // Create and play the audio synchronously inside the click handler so the
      // play() call stays within the user-activation window. Deferring play() to
      // an async "canplaythrough" listener causes iOS Safari and some mobile
      // browsers to block playback (autoplay policy), which left sounds stuck.
      const audio = new Audio(track.audioUrl)
      audio.loop = true
      audio.preload = "auto"
      audio.crossOrigin = "anonymous"
      audio.volume = 0.7 * (isMuted ? 0 : masterVolume / 100)
      audioRefs.current.set(track.id, audio)

      const markPlaying = () => {
        setActiveSounds(prev => {
          const newMap = new Map(prev)
          const sound = newMap.get(track.id)
          if (sound) newMap.set(track.id, { ...sound, isLoading: false })
          return newMap
        })
      }

      const removeTrack = () => {
        audioRefs.current.get(track.id)?.pause()
        audioRefs.current.delete(track.id)
        setActiveSounds(prev => { const newMap = new Map(prev); newMap.delete(track.id); return newMap })
      }

      audio.addEventListener("playing", markPlaying, { once: true })
      audio.addEventListener("error", () => {
        const error = audio.error
        console.error("Audio error:", error?.message || "Unknown", "Code:", error?.code)
        removeTrack()
      })

      audio.play().then(markPlaying).catch(err => {
        console.error("Play error:", err)
        removeTrack()
      })
    }
  }, [masterVolume, isMuted])

  const updateSoundVolume = useCallback((trackId: string, volume: number) => {
    const audio = audioRefs.current.get(trackId)
    if (audio) audio.volume = (volume / 100) * (isMuted ? 0 : masterVolume / 100)
    setActiveSounds(prev => { const newMap = new Map(prev); const sound = newMap.get(trackId); if (sound) newMap.set(trackId, { ...sound, volume }); return newMap })
  }, [masterVolume, isMuted])

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    try {
      if (!document.fullscreenElement) { await containerRef.current.requestFullscreen(); setIsFullscreen(true) }
      else { await document.exitFullscreen(); setIsFullscreen(false) }
    } catch (err) { console.error("Fullscreen error:", err) }
  }

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      audioRefs.current.forEach(audio => { audio.pause(); audio.src = "" })
      audioRefs.current.clear()
    }
  }, [])

  const stopAllSounds = useCallback(() => {
    audioRefs.current.forEach(audio => { audio.pause(); audio.currentTime = 0 })
    audioRefs.current.clear()
    setActiveSounds(new Map())
  }, [])

  const activeCount = activeSounds.size

  return (
    <>
      {!isFullscreen && <Header />}
      <div ref={containerRef} className={cn(
        "min-h-screen transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 overflow-auto bg-[#191919]" : "bg-background"
      )}>
        <div className={cn("container mx-auto px-4", isFullscreen ? "py-8" : "py-8 max-w-5xl")}>
          {/* Header Section */}
          {!isFullscreen && (
            <div className="mb-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-6 inline-flex items-center gap-1 transition-colors">
                ← Back to Home
              </Link>
              <div className="flex flex-wrap items-start justify-between gap-4 mt-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🎧</span>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Ambient Sounds</h1>
                  </div>
                  <p className="text-muted-foreground text-lg">Mix relaxing sounds for focus, sleep, or relaxation</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={toggleFullscreen} 
                  className="gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  Fullscreen
                </Button>
              </div>
            </div>
          )}

          {/* Fullscreen Header */}
          {isFullscreen && (
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Music className="w-6 h-6 text-white/70" />
                <h2 className="text-xl font-semibold text-white">Ambient Sounds</h2>
              </div>
              <Button 
                variant="ghost" 
                onClick={toggleFullscreen} 
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Minimize2 className="w-4 h-4 mr-2" />
                Exit Fullscreen
              </Button>
            </div>
          )}

          {/* Master Volume Control */}
          <Card className={cn(
            "mb-8 border",
            isFullscreen ? "bg-white/5 border-white/10" : "bg-card"
          )}>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-[280px]">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMuted(!isMuted)} 
                    className={cn(
                      "shrink-0",
                      isFullscreen ? "text-white/70 hover:text-white hover:bg-white/10" : ""
                    )}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <span className={cn(
                    "text-sm font-medium shrink-0",
                    isFullscreen ? "text-white/70" : "text-foreground"
                  )}>Master Volume</span>
                  <Slider 
                    value={[masterVolume]} 
                    onValueChange={(v) => setMasterVolume(v[0])} 
                    max={100} 
                    step={1} 
                    className="flex-1 max-w-[200px]" 
                    disabled={isMuted} 
                  />
                  <span className={cn(
                    "text-sm w-12",
                    isFullscreen ? "text-white/50" : "text-muted-foreground"
                  )}>{masterVolume}%</span>
                </div>
                {activeCount > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={stopAllSounds} 
                    className={cn(
                      "gap-2",
                      isFullscreen 
                        ? "border-red-500/30 text-red-400 hover:bg-red-500/20 bg-transparent" 
                        : "border-destructive/30 text-destructive hover:bg-destructive/10"
                    )}
                  >
                    <Pause className="w-4 h-4" />
                    Stop All ({activeCount})
                  </Button>
                )}
              </div>
              {activeCount > 0 && (
                <div className={cn(
                  "mt-4 pt-4 border-t",
                  isFullscreen ? "border-white/10" : "border-border"
                )}>
                  <p className={cn(
                    "text-sm flex items-center gap-2",
                    isFullscreen ? "text-white/50" : "text-muted-foreground"
                  )}>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Now Playing: {Array.from(activeSounds.keys()).map((id) => soundTracks.find((t) => t.id === id)?.name).join(" + ")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sound Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-8">
            {soundTracks.map((track) => {
              const soundState = activeSounds.get(track.id)
              const isActive = !!soundState && !soundState.isLoading
              const isLoading = soundState?.isLoading
              return (
                <Card 
                  key={track.id} 
                  className={cn(
                    "relative overflow-hidden cursor-pointer transition-all duration-200 group",
                    isActive 
                      ? `bg-gradient-to-br ${track.color} border-transparent shadow-lg scale-[1.02]` 
                      : isFullscreen
                        ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        : "bg-card hover:bg-accent/50 hover:shadow-md"
                  )} 
                  onClick={() => !isLoading && toggleSound(track)}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center text-center">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : isFullscreen
                            ? "bg-white/10 text-white/60 group-hover:text-white"
                            : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}>
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        ) : track.icon}
                      </div>
                      <span className={cn(
                        "font-medium text-sm",
                        isActive ? "text-white" : isFullscreen ? "text-white/80" : "text-foreground"
                      )}>{track.name}</span>
                      
                      {/* Individual Volume Slider */}
                      {isActive && (
                        <div 
                          className="flex items-center gap-2 mt-3 w-full" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Volume2 className="w-3 h-3 text-white/70 flex-shrink-0" />
                          <Slider 
                            value={[soundState?.volume || 70]} 
                            onValueChange={(v) => updateSoundVolume(track.id, v[0])} 
                            max={100} 
                            step={1} 
                            className="flex-1" 
                          />
                        </div>
                      )}
                      
                      {/* Playing Indicator */}
                      {isActive && (
                        <div className="absolute top-3 right-3">
                          <div className="flex gap-0.5 items-end h-4">
                            {[...Array(4)].map((_, i) => (
                              <div 
                                key={i} 
                                className="w-1 bg-white rounded-full animate-pulse" 
                                style={{ 
                                  height: `${6 + (i % 2) * 6}px`, 
                                  animationDelay: `${i * 0.15}s` 
                                }} 
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Recommended Mixes Section */}
          {!isFullscreen && (
            <div className="mt-12">
              <h2 className={cn(
                "text-xl font-semibold mb-4 flex items-center gap-2",
                isFullscreen ? "text-white" : "text-foreground"
              )}>
                💡 Recommended Mixes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5">
                    <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">📚 Deep Focus</h3>
                    <p className="text-muted-foreground text-sm">Rain + Café for the perfect study atmosphere</p>
                  </CardContent>
                </Card>
                <Card className="bg-card hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5">
                    <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">😴 Sleep Better</h3>
                    <p className="text-muted-foreground text-sm">Ocean + Night at low volume for restful sleep</p>
                  </CardContent>
                </Card>
                <Card className="bg-card hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5">
                    <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">🧘 Meditation</h3>
                    <p className="text-muted-foreground text-sm">Forest + Birds for peaceful meditation vibes</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      {!isFullscreen && <Footer />}
    </>
  )
}
