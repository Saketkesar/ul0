"use client"

import React, { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Play, RotateCcw, ArrowRight } from "lucide-react"
import { toast } from "sonner"

// Timing constants (ms)
const SPIN_DURATION_MS = 1900
const SPIN_TICK_INTERVAL_MS = 110
const ROTATE_STEP_DURATION_MS = 280
const BANG_FLASH_DURATION_MS = 500
const BANG_SHAKE_DURATION_MS = 450

// Web Audio API Sound Generator for Gun Game
class SoundEffects {
  private ctx: AudioContext | null = null

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume()
    }
  }

  // Ticking sound during spin
  playSpinTick() {
    this.initCtx()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(950, now)
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.02)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.02)
  }

  // Metallic empty chamber *CLICK* sound
  playEmptyClick() {
    this.initCtx()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // High snap
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(2200, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03)
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.04)

    // Metal body resonance
    const osc2 = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    osc2.type = "triangle"
    osc2.frequency.setValueAtTime(950, now)
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.06)
    gain2.gain.setValueAtTime(0.18, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
    osc2.connect(gain2)
    gain2.connect(this.ctx.destination)
    osc2.start(now)
    osc2.stop(now + 0.06)
  }

  // Gunshot explosive *BANG!* sound
  playGunshot() {
    this.initCtx()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // White noise explosion burst
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.6)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = this.ctx.createBufferSource()
    whiteNoise.buffer = buffer

    // Low-pass filter for gunshot boom
    const filter = this.ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(1200, now)
    filter.frequency.linearRampToValueAtTime(80, now + 0.5)

    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(1.0, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55)

    whiteNoise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)
    whiteNoise.start(now)
    whiteNoise.stop(now + 0.55)

    // Deep sub-bass boom
    const subOsc = this.ctx.createOscillator()
    const subGain = this.ctx.createGain()
    subOsc.type = "sine"
    subOsc.frequency.setValueAtTime(160, now)
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.45)
    subGain.gain.setValueAtTime(0.85, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
    subOsc.connect(subGain)
    subGain.connect(this.ctx.destination)
    subOsc.start(now)
    subOsc.stop(now + 0.45)
  }
}

const sounds = new SoundEffects()

interface GunGameProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMembers?: string[]
  onSelectPayer?: (name: string) => void
}

type GamePhase = "setup" | "spinning" | "playing" | "shot"

export function GunGame({
  open,
  onOpenChange,
  initialMembers = [],
  onSelectPayer,
}: GunGameProps) {
  // Phase management
  const [phase, setPhase] = useState<GamePhase>("setup")
  const [players, setPlayers] = useState<string[]>([])
  const [newPlayerName, setNewPlayerName] = useState<string>("")

  // Game state
  const [bulletChamber, setBulletChamber] = useState<number>(0)
  const [currentChamber, setCurrentChamber] = useState<number>(0)
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState<number>(0)
  const [isPulling, setIsPulling] = useState<boolean>(false)
  const [rotationAngle, setRotationAngle] = useState<number>(0)
  const [shotVictim, setShotVictim] = useState<string | null>(null)

  // Visual effects
  const [flashWhite, setFlashWhite] = useState<boolean>(false)
  const [shakePanel, setShakePanel] = useState<boolean>(false)
  const [chamberStatus, setChamberStatus] = useState<("unknown" | "safe" | "hit")[]>([
    "unknown",
    "unknown",
    "unknown",
    "unknown",
    "unknown",
    "unknown",
  ])

  const spinTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize players from props when modal opens
  useEffect(() => {
    if (open) {
      const clean = initialMembers
        .map((m) => m.trim().replace(/\s*\(you\)$/i, ""))
        .filter((m) => m.length > 0)
      if (clean.length >= 2 && clean.length <= 6) {
        setPlayers(clean)
      } else if (players.length === 0) {
        setPlayers([])
      }
      setPhase("setup")
      setShotVictim(null)
      setChamberStatus(["unknown", "unknown", "unknown", "unknown", "unknown", "unknown"])
      setRotationAngle(0)
    }
    return () => {
      if (spinTimerRef.current) clearInterval(spinTimerRef.current)
    }
  }, [open, initialMembers])

  const handleAddPlayer = () => {
    const trimmed = newPlayerName.trim()
    if (!trimmed) return
    if (players.length >= 6) {
      toast.error("Maximum 6 players")
      return
    }
    if (players.includes(trimmed)) {
      toast.error("Player already added")
      return
    }
    setPlayers((prev) => [...prev, trimmed])
    setNewPlayerName("")
  }

  const handleRemovePlayer = (idx: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== idx))
  }

  // Spin the cylinder and start game
  const handleSpinCylinder = () => {
    if (players.length < 2) {
      toast.error("Add at least 2 players")
      return
    }
    if (players.length > 6) {
      toast.error("Maximum 6 players")
      return
    }

    // 1 bullet placed in a random chamber 0..5
    const bullet = Math.floor(Math.random() * 6)
    setBulletChamber(bullet)
    setCurrentChamber(0)
    setCurrentPlayerIdx(0)
    setShotVictim(null)
    setChamberStatus(["unknown", "unknown", "unknown", "unknown", "unknown", "unknown"])
    setPhase("spinning")

    // Full 1800deg spin over 1.9s
    const totalSpin = 1800 + Math.floor(Math.random() * 6) * 60
    setRotationAngle((prev) => prev + totalSpin)

    // Ticking audio loop
    let ticks = 0
    const maxTicks = Math.floor(SPIN_DURATION_MS / SPIN_TICK_INTERVAL_MS)
    const tickInterval = setInterval(() => {
      sounds.playSpinTick()
      ticks++
      if (ticks >= maxTicks) {
        clearInterval(tickInterval)
      }
    }, SPIN_TICK_INTERVAL_MS)
    spinTimerRef.current = tickInterval

    setTimeout(() => {
      clearInterval(tickInterval)
      setPhase("playing")
    }, SPIN_DURATION_MS)
  }

  // Pull trigger logic with suspense delays
  const handlePullTrigger = () => {
    if (isPulling || phase !== "playing") return
    setIsPulling(true)

    const chambersRemaining = 6 - currentChamber
    // Suspense delay schedule
    let delay = 300
    if (chambersRemaining <= 2) {
      delay = 900
    } else if (chambersRemaining <= 4) {
      delay = 550
    }

    const activePlayer = players[currentPlayerIdx]

    setTimeout(() => {
      if (currentChamber === bulletChamber) {
        // BANG!
        sounds.playGunshot()
        setFlashWhite(true)
        setShakePanel(true)
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          try {
            navigator.vibrate([80, 40, 200])
          } catch {}
        }

        setChamberStatus((prev) => {
          const next = [...prev]
          next[currentChamber] = "hit"
          return next
        })

        setTimeout(() => setFlashWhite(false), BANG_FLASH_DURATION_MS)
        setTimeout(() => setShakePanel(false), BANG_SHAKE_DURATION_MS)

        setTimeout(() => {
          setShotVictim(activePlayer)
          setPhase("shot")
          setIsPulling(false)
        }, 900)
      } else {
        // SAFE (Empty shell)
        sounds.playEmptyClick()

        setChamberStatus((prev) => {
          const next = [...prev]
          next[currentChamber] = "safe"
          return next
        })

        // Wait 700ms, then rotate -60deg over 280ms
        setTimeout(() => {
          setRotationAngle((prev) => prev + 60)
          setTimeout(() => {
            const nextChamber = currentChamber + 1
            const nextPlayer = (currentPlayerIdx + 1) % players.length
            setCurrentChamber(nextChamber)
            setCurrentPlayerIdx(nextPlayer)
            setIsPulling(false)
          }, ROTATE_STEP_DURATION_MS)
        }, 700)
      }
    }, delay)
  }

  const activePlayerName = players[currentPlayerIdx] || "Player"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-[420px] p-0 border border-[#E4E2DA] rounded-[16px] overflow-hidden shadow-none bg-white">
        {/* =====================================================================
            SCREEN 1: SETUP SCREEN
        ====================================================================== */}
        {phase === "setup" && (
          <div className="p-6 bg-white text-[#111715] space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-bold tracking-tight text-[#111715]">
                  Who pays?
                </h2>
                <p className="text-[13px] text-[#5F6763] mt-0.5">
                  Add 2 to 6 names. One bullet, five empty shells.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#5F6763] hover:text-[#111715] hover:bg-[#F6F5F1] transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddPlayer()
                    }
                  }}
                  placeholder="Enter name"
                  maxLength={20}
                  className="h-10 text-[14px] rounded-[10px] border-[#E4E2DA] focus-visible:ring-1 focus-visible:ring-[#0F7B5F]"
                  autoFocus
                />
                <Button
                  type="button"
                  onClick={handleAddPlayer}
                  disabled={!newPlayerName.trim() || players.length >= 6}
                  className="h-10 px-4 rounded-[10px] bg-[#111715] hover:bg-[#25302C] text-white text-[13px] font-medium"
                >
                  Add
                </Button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#5F6763] px-1">
                <span>Min 2, max 6 players</span>
                <span>{players.length}/6 added</span>
              </div>
            </div>

            {/* Chips */}
            <div className="min-h-[80px]">
              {players.length === 0 ? (
                <div className="p-4 rounded-[10px] border border-dashed border-[#E4E2DA] text-center text-[12px] text-[#5F6763]">
                  No names added yet. Enter names above to begin.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {players.map((p, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#F6F5F1] border border-[#E4E2DA] text-[13px] font-medium text-[#111715]"
                    >
                      <span>{p}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePlayer(idx)}
                        className="text-[#5F6763] hover:text-[#D6402B] transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Button
              type="button"
              disabled={players.length < 2 || players.length > 6}
              onClick={handleSpinCylinder}
              className="w-full h-11 rounded-[10px] bg-[#0F7B5F] hover:bg-[#0c654e] text-white text-[14px] font-semibold transition-colors disabled:opacity-40"
            >
              Spin the cylinder
            </Button>
          </div>
        )}

        {/* =====================================================================
            SCREEN 2 & 3: GAME STAGE (DARK PANEL #121816)
        ====================================================================== */}
        {(phase === "spinning" || phase === "playing") && (
          <div
            className={`relative p-6 bg-[#121816] text-[#F6F5F1] flex flex-col items-center justify-between min-h-[460px] select-none ${
              shakePanel ? "animate-shake" : ""
            }`}
          >
            {/* White flash overlay on BANG */}
            {flashWhite && (
              <div className="absolute inset-0 bg-white pointer-events-none z-50 transition-opacity duration-500 opacity-95" />
            )}

            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-[6px] flex items-center justify-center text-[#F6F5F1]/60 hover:text-[#F6F5F1] hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>

            {/* Top Indicator */}
            <div className="text-center space-y-1 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#F6F5F1]/60">
                CHAMBER {currentChamber + 1} OF 6
              </span>
              <h3 className="text-[22px] font-bold tracking-tight text-white">
                {phase === "spinning" ? "Spinning..." : `${activePlayerName}'s turn`}
              </h3>
            </div>

            {/* 6 Progress Dots: grey = safe, red = hit, outline = pending */}
            <div className="flex items-center gap-2.5 my-2">
              {chamberStatus.map((st, i) => {
                let dotClass = "bg-[#25302C] border border-white/20"
                if (st === "safe") dotClass = "bg-[#5F6763] border border-[#5F6763]"
                if (st === "hit") dotClass = "bg-[#D6402B] border border-[#D6402B]"
                if (i === currentChamber && phase === "playing") {
                  dotClass = "bg-[#0F7B5F] border border-[#0F7B5F] ring-2 ring-[#0F7B5F]/40"
                }

                return (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${dotClass}`}
                  />
                )
              })}
            </div>

            {/* 300x300 SVG Cylinder Disc */}
            <div className="relative w-[240px] h-[240px] flex items-center justify-center my-2">
              {/* White Triangle Marker pointing down at 12 o'clock */}
              <div className="absolute -top-1 z-20 w-0 h-0 border-x-[7px] border-x-transparent border-t-[10px] border-t-white drop-shadow-sm" />

              <svg
                width="220"
                height="220"
                viewBox="0 0 300 300"
                className="transition-transform"
                style={{
                  transform: `rotate(${rotationAngle}deg)`,
                  transitionDuration:
                    phase === "spinning"
                      ? `${SPIN_DURATION_MS}ms`
                      : `${ROTATE_STEP_DURATION_MS}ms`,
                  transitionTimingFunction:
                    phase === "spinning"
                      ? "cubic-bezier(.12,.7,.1,1)"
                      : "cubic-bezier(.3,1.4,.5,1)",
                }}
              >
                <defs>
                  <radialGradient id="cylinderGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4B5853" />
                    <stop offset="100%" stopColor="#1E2623" />
                  </radialGradient>
                  <radialGradient id="chamberHole" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0B1110" />
                    <stop offset="100%" stopColor="#18201E" />
                  </radialGradient>
                </defs>

                {/* Outer disc */}
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="url(#cylinderGrad)"
                  stroke="#333F3A"
                  strokeWidth="4"
                />

                {/* Inner decorative groove */}
                <circle
                  cx="150"
                  cy="150"
                  r="120"
                  fill="none"
                  stroke="#2E3834"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Center Hub */}
                <circle cx="150" cy="150" r="34" fill="#18201E" stroke="#4B5853" strokeWidth="3" />
                <circle cx="150" cy="150" r="14" fill="#0B1110" stroke="#333F3A" strokeWidth="2" />

                {/* 6 Chambers at r=86 */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const angle = (i * 60 - 90) * (Math.PI / 180)
                  const cx = 150 + 86 * Math.cos(angle)
                  const cy = 150 + 86 * Math.sin(angle)
                  const st = chamberStatus[i]

                  let fillHole = "url(#chamberHole)"
                  let strokeHole = "#4B5853"
                  if (st === "safe") {
                    fillHole = "#25302C"
                    strokeHole = "#5F6763"
                  } else if (st === "hit") {
                    fillHole = "#D6402B"
                    strokeHole = "#D6402B"
                  }

                  return (
                    <g key={i}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r="24"
                        fill={fillHole}
                        stroke={strokeHole}
                        strokeWidth="3"
                      />
                      {/* Inner bullet casing dot if unspent */}
                      {st === "unknown" && (
                        <circle cx={cx} cy={cy} r="6" fill="#4B5853" opacity="0.6" />
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Status Line */}
            <div className="text-[12px] text-[#F6F5F1]/70 text-center pb-2">
              {phase === "spinning"
                ? "Shuffling cylinder..."
                : isPulling
                ? "Holding breath..."
                : `Pull the trigger to test chamber ${currentChamber + 1}`}
            </div>

            {/* ONE Single Pull Trigger Button (No accidental tap anywhere else) */}
            <Button
              type="button"
              disabled={isPulling || phase === "spinning"}
              onClick={handlePullTrigger}
              className="w-full h-12 rounded-[10px] bg-white hover:bg-[#EAE8E1] text-[#111715] text-[14px] font-bold transition-all disabled:opacity-40"
            >
              {isPulling ? "Testing..." : `Pull trigger (${activePlayerName})`}
            </Button>
          </div>
        )}

        {/* =====================================================================
            SCREEN 4: RESULT / WHO PAYS
        ====================================================================== */}
        {phase === "shot" && shotVictim && (
          <div className="p-8 bg-[#121816] text-[#F6F5F1] flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-2">
              <span className="text-[14px] font-mono font-bold tracking-widest text-[#D6402B] uppercase">
                BANG
              </span>
              <h2 className="text-[34px] font-extrabold tracking-tight text-white leading-none">
                {shotVictim}
              </h2>
              <p className="text-[15px] text-[#F6F5F1]/70">
                pays the bill.
              </p>
            </div>

            <div className="w-full space-y-2.5 pt-4">
              {onSelectPayer && (
                <Button
                  type="button"
                  onClick={() => {
                    onSelectPayer(shotVictim)
                    onOpenChange(false)
                  }}
                  className="w-full h-11 rounded-[10px] bg-[#0F7B5F] hover:bg-[#0c654e] text-white text-[14px] font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Split the bill</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Button>
              )}

              <Button
                type="button"
                onClick={handleSpinCylinder}
                className="w-full h-11 rounded-[10px] bg-white/10 hover:bg-white/15 text-white text-[13px] font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Play again</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
