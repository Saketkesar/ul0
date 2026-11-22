"use client"

import React, { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UL0Icon } from "@/components/ul0-icon"
import { toast } from "sonner"

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

  // Realistic metallic cylinder spin
  playCylinderSpin() {
    this.initCtx()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    for (let i = 0; i < 8; i++) {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = "triangle"
      osc.frequency.setValueAtTime(800 + i * 50, now + i * 0.04)
      gain.gain.setValueAtTime(0.08, now + i * 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.02)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now + i * 0.04)
      osc.stop(now + i * 0.04 + 0.02)
    }
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
    gain.gain.setValueAtTime(0.3, now)
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
    gain2.gain.setValueAtTime(0.2, now)
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
    const bufferSize = this.ctx.sampleRate * 0.5
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
    filter.frequency.setValueAtTime(1000, now)
    filter.frequency.linearRampToValueAtTime(100, now + 0.4)

    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(1.0, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    whiteNoise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)
    whiteNoise.start(now)
    whiteNoise.stop(now + 0.5)

    // Deep sub-bass boom
    const subOsc = this.ctx.createOscillator()
    const subGain = this.ctx.createGain()
    subOsc.type = "sine"
    subOsc.frequency.setValueAtTime(160, now)
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.4)
    subGain.gain.setValueAtTime(0.8, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
    subOsc.connect(subGain)
    subGain.connect(this.ctx.destination)
    subOsc.start(now)
    subOsc.stop(now + 0.4)
  }
}

const sounds = new SoundEffects()

interface GunGameProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMembers?: string[]
  onSelectPayer?: (name: string) => void
}

export function GunGame({
  open,
  onOpenChange,
  initialMembers = [],
  onSelectPayer,
}: GunGameProps) {
  // Setup phase vs Playing phase vs Result phase
  const [phase, setPhase] = useState<"setup" | "playing" | "shot">("setup")
  const [players, setPlayers] = useState<string[]>([])
  const [newPlayerName, setNewPlayerName] = useState<string>("")

  // Game mechanics: 6 chambers, 1 live bullet
  const [bulletChamber, setBulletChamber] = useState<number>(0)
  const [currentChamber, setCurrentChamber] = useState<number>(0)
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState<number>(0)
  const [isPulling, setIsPulling] = useState<boolean>(false)
  const [cylinderAngle, setCylinderAngle] = useState<number>(0)
  const [shotVictim, setShotVictim] = useState<string | null>(null)
  const [flashRed, setFlashRed] = useState<boolean>(false)

  // Initialize players from props when modal opens
  useEffect(() => {
    if (open) {
      const filtered = initialMembers.filter((m) => m && m.trim().length > 0)
      if (filtered.length >= 2) {
        setPlayers(filtered)
      } else if (players.length === 0) {
        setPlayers([])
      }
      setPhase("setup")
      setShotVictim(null)
    }
  }, [open, initialMembers])

  const handleAddPlayer = () => {
    const trimmed = newPlayerName.trim()
    if (!trimmed) return
    if (players.includes(trimmed)) {
      toast.error("Player already in the game")
      return
    }
    setPlayers((prev) => [...prev, trimmed])
    setNewPlayerName("")
  }

  const handleRemovePlayer = (idx: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== idx))
  }

  // Start the game: load 1 bullet randomly into 6 chambers
  const handleStartGame = () => {
    if (players.length < 2) {
      toast.error("Add at least 2 players to play the Gun Game")
      return
    }
    // Randomize chamber with live bullet (0 to 5)
    const bullet = Math.floor(Math.random() * 6)
    setBulletChamber(bullet)
    setCurrentChamber(0)
    setCurrentPlayerIdx(0)
    setCylinderAngle(0)
    setShotVictim(null)
    setPhase("playing")

    // Play spinning sound
    sounds.playCylinderSpin()
    toast.success("Gun loaded with 1 bullet & 5 empty shells! Best of luck.")
  }

  // Pull the trigger
  const handlePullTrigger = () => {
    if (isPulling || phase !== "playing") return
    setIsPulling(true)

    // Rotate cylinder visually
    const nextAngle = cylinderAngle + 60
    setCylinderAngle(nextAngle)

    const activePlayer = players[currentPlayerIdx]

    // Check if this chamber has the live bullet
    if (currentChamber === bulletChamber) {
      // 💥 BANG!
      sounds.playGunshot()
      setFlashRed(true)
      setTimeout(() => setFlashRed(false), 600)

      setShotVictim(activePlayer)
      setPhase("shot")
      setIsPulling(false)
      toast.error(`💥 BANG! ${activePlayer} was shot! They pay the entire bill!`)
    } else {
      // 😅 CLICK (Empty shell)
      sounds.playEmptyClick()

      setTimeout(() => {
        const nextChamber = currentChamber + 1
        const nextPlayerIdx = (currentPlayerIdx + 1) % players.length
        setCurrentChamber(nextChamber)
        setCurrentPlayerIdx(nextPlayerIdx)
        setIsPulling(false)
      }, 500)
    }
  }

  const activePlayerName = players[currentPlayerIdx] || "Player"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-md bg-white border border-[#E4ECE8] text-[#0B1A17] p-6 rounded-3xl transition-colors duration-300 ${
          flashRed ? "bg-[#D9383A]/20" : ""
        }`}
      >
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-xl font-black text-[#0B1A17] flex items-center justify-center gap-2">
            <span>🎯</span> Russian Roulette: Who Pays?
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5A6B66]">
            6 chambers, 1 live bullet, 5 empty shells. Take turns pulling the trigger!
          </DialogDescription>
        </DialogHeader>

        {/* =================================================================
            PHASE 1: SETUP PLAYERS
        ================================================================== */}
        {phase === "setup" && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0B1A17]">Add Players</label>
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
                  placeholder="Enter player name (e.g. Alex)"
                  className="h-10 text-xs rounded-xl"
                  autoFocus
                />
                <Button
                  type="button"
                  onClick={handleAddPlayer}
                  className="h-10 px-4 rounded-xl bg-[#0B1A17] text-white text-xs font-bold cursor-pointer"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Player chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#5A6B66]">
                <span>Players in Gun Game:</span>
                <span>{players.length} players</span>
              </div>

              {players.length === 0 ? (
                <div className="p-4 rounded-2xl border border-dashed border-[#CCD9D4] bg-[#F7FAF8] text-center text-xs text-[#5A6B66]">
                  No players added yet. Add at least 2 people to start the game!
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  {players.map((p, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E4ECE8] text-xs font-medium text-[#0B1A17] shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#0B1A17] text-white font-bold text-[10px] flex items-center justify-center">
                        {p.slice(0, 1).toUpperCase()}
                      </span>
                      <span>{p}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePlayer(idx)}
                        className="text-[#5A6B66] hover:text-[#D9383A] cursor-pointer ml-1 text-sm font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="button"
              disabled={players.length < 2}
              onClick={handleStartGame}
              className="w-full h-12 rounded-2xl bg-[#0B1A17] hover:bg-[#1a2e2a] text-white text-sm font-bold shadow-md cursor-pointer disabled:bg-[#CCD9D4] transition-all"
            >
              Load Cylinder & Spin 🔫
            </Button>
          </div>
        )}

        {/* =================================================================
            PHASE 2: PLAYING THE GAME
        ================================================================== */}
        {phase === "playing" && (
          <div
            onClick={handlePullTrigger}
            className="py-4 flex flex-col items-center justify-center space-y-5 cursor-pointer select-none"
          >
            {/* Turn Announcement Banner */}
            <div className="text-center p-3 w-full rounded-2xl bg-[#EAF7F3] border border-[#CCD9D4]">
              <span className="text-[11px] font-semibold text-[#0B7A66] uppercase tracking-wider block">
                Chamber {currentChamber + 1} of 6
              </span>
              <h3 className="text-2xl font-black text-[#0B1A17] mt-0.5">
                👉 {activePlayerName}&apos;s Turn!
              </h3>
              <p className="text-xs text-[#5A6B66] mt-1">
                Tap anywhere on screen to pull the trigger...
              </p>
            </div>

            {/* Revolver Cylinder Graphic (6 chambers, rotates smoothly) */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer Cylinder ring */}
              <div
                className="w-40 h-40 rounded-full border-4 border-[#0B1A17] bg-[#F1F5F3] shadow-xl relative flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${cylinderAngle}deg)` }}
              >
                {/* Center Pin */}
                <div className="w-10 h-10 rounded-full bg-[#0B1A17] border-2 border-white flex items-center justify-center shadow-md">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>

                {/* 6 Chambers */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const angle = (i * 60 * Math.PI) / 180
                  const radius = 50 // distance from center
                  const x = radius * Math.cos(angle)
                  const y = radius * Math.sin(angle)
                  const isCurrent = i === currentChamber % 6

                  return (
                    <div
                      key={i}
                      className={`absolute w-7 h-7 rounded-full border-2 border-[#0B1A17] flex items-center justify-center shadow-inner transition-colors ${
                        isCurrent ? "bg-[#3DDBB8] font-bold text-[10px]" : "bg-white"
                      }`}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0B1A17]/60" />
                    </div>
                  )
                })}
              </div>

              {/* Hammer / Barrel Pointer at Top */}
              <div className="absolute -top-1 w-4 h-6 bg-[#0B1A17] rounded-b-md shadow-sm pointer-events-none" />
            </div>

            {/* Pull Trigger Button */}
            <Button
              type="button"
              disabled={isPulling}
              onClick={(e) => {
                e.stopPropagation()
                handlePullTrigger()
              }}
              className="w-full h-13 rounded-2xl bg-[#0B1A17] hover:bg-[#1a2e2a] text-white text-sm font-bold shadow-lg cursor-pointer transition-all"
            >
              {isPulling ? "Spinning & Pulling..." : `Pull Trigger (${activePlayerName}) 💥`}
            </Button>
          </div>
        )}

        {/* =================================================================
            PHASE 3: SHOT / RESULT (WHO PAYS)
        ================================================================== */}
        {phase === "shot" && shotVictim && (
          <div className="py-6 flex flex-col items-center justify-center space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="w-24 h-24 rounded-full bg-[#D9383A]/10 border-4 border-[#D9383A] text-4xl flex items-center justify-center shadow-lg animate-bounce">
              💥
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#D9383A] uppercase tracking-wider">
                BANG! Chamber {currentChamber + 1} was Loaded!
              </span>
              <h2 className="text-3xl font-black text-[#0B1A17]">
                {shotVictim} Pays! 🎉
              </h2>
              <p className="text-xs text-[#5A6B66] max-w-xs mx-auto">
                The cylinder went off on {shotVictim}&apos;s turn. By the law of the Gun Game, they cover the entire bill!
              </p>
            </div>

            <div className="w-full space-y-2 pt-2">
              {onSelectPayer && (
                <Button
                  type="button"
                  onClick={() => {
                    onSelectPayer(shotVictim)
                    onOpenChange(false)
                  }}
                  className="w-full h-11 rounded-xl bg-[#0B7A66] hover:bg-[#086353] text-white text-xs font-bold cursor-pointer"
                >
                  Create Split with {shotVictim} as Payer →
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleStartGame}
                className="w-full h-11 rounded-xl border-[#CCD9D4] text-xs font-bold cursor-pointer"
              >
                Play Again 🔄
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
