"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Upload,
  Download,
  Copy,
  Check,
  Shield,
  Zap,
  Lock,
  FileIcon,
  HardDrive,
  QrCode,
  ArrowRight,
  Share2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Smartphone,
  Laptop,
  Monitor,
  Activity,
  Wifi,
  Sparkles,
  RefreshCcw,
} from "lucide-react"

// Helper to format byte sizes
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// ETA calculation helper
function formatTimeRemaining(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return "Calculating ETA…"
  if (seconds < 60) return `${Math.ceil(seconds)}s remaining`
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  if (mins < 60) return `${mins}m ${secs}s remaining`
  const hrs = Math.floor(mins / 60)
  const remMins = mins % 60
  return `${hrs}h ${remMins}m remaining`
}

// Generate 6-character room code
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let res = ""
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return res
}

// Detect client OS & Browser for exact device telemetry
function detectDeviceInfo() {
  if (typeof window === "undefined") return { os: "Device", browser: "Browser" }
  const ua = navigator.userAgent

  let os = "Desktop"
  if (ua.includes("Android")) os = "Android"
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS"
  else if (ua.includes("Linux")) os = "Linux"
  else if (ua.includes("Mac OS")) os = "macOS"
  else if (ua.includes("Windows")) os = "Windows"

  let browser = "Browser"
  if ((navigator as any).brave || ua.includes("Brave")) browser = "Brave"
  else if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome"
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari"
  else if (ua.includes("Firefox")) browser = "Firefox"
  else if (ua.includes("Edg")) browser = "Edge"

  return { os, browser }
}

// Web Audio API Connection Chime
function playConnectionChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12) // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.25) // G5

    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  } catch {
    // ignore
  }
}

export function ShareClient() {
  const searchParams = useSearchParams()
  const urlCode = searchParams.get("code")

  const [mode, setMode] = useState<"send" | "receive">("send")
  const [roomCode, setRoomCode] = useState<string>("")
  const [inputCode, setInputCode] = useState<string>("")

  // WebRTC Connection State
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [statusText, setStatusText] = useState<string>("Ready. Share code or QR to pair.")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [peerDevice, setPeerDevice] = useState<{ os: string; browser: string; ip: string } | null>(null)
  const [myDeviceInfo, setMyDeviceInfo] = useState<{ os: string; browser: string }>({ os: "Device", browser: "Browser" })

  // File state (Sender)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSending, setIsSending] = useState<boolean>(false)
  const [sendProgress, setSendProgress] = useState<number>(0)
  const [sendSpeedBps, setSendSpeedBps] = useState<number>(0)
  const [sendEtaSeconds, setSendEtaSeconds] = useState<number>(0)
  const [sendCompleted, setSendCompleted] = useState<boolean>(false)

  // File state (Receiver)
  const [incomingFile, setIncomingFile] = useState<{ name: string; size: number; mime: string } | null>(null)
  const [isReceiving, setIsReceiving] = useState<boolean>(false)
  const [receiveProgress, setReceiveProgress] = useState<number>(0)
  const [receiveSpeedBps, setReceiveSpeedBps] = useState<number>(0)
  const [receiveEtaSeconds, setReceiveEtaSeconds] = useState<number>(0)
  const [receivedBlobUrl, setReceivedBlobUrl] = useState<string | null>(null)
  const [receiveCompleted, setReceiveCompleted] = useState<boolean>(false)

  // UI state
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const [copiedCode, setCopiedCode] = useState<boolean>(false)
  const [showQr, setShowQr] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const pollTimerRef = useRef<any>(null)

  // Initialize room code & device info
  useEffect(() => {
    setMyDeviceInfo(detectDeviceInfo())
    if (urlCode && urlCode.trim().length >= 4) {
      setMode("receive")
      setInputCode(urlCode.trim().toUpperCase())
    } else {
      setRoomCode(generateCode())
    }
  }, [urlCode])

  // Setup PeerConnection with STUN configuration
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ],
    })

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.iceConnectionState)
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setIsConnected(true)
        setStatusText("Direct P2P WebRTC Tunnel Established!")
        playConnectionChime()
      } else if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
        setIsConnected(false)
        setStatusText("Peer disconnected.")
      }
    }

    pcRef.current = pc
    return pc
  }

  // SENDER ROLE: Publish Offer & Poll for Answer
  useEffect(() => {
    if (mode !== "send" || !roomCode) return

    let isSubscribed = true

    async function initSender() {
      const pc = createPeerConnection()
      const dc = pc.createDataChannel("fileTransfer", { ordered: true })
      dcRef.current = dc

      setupDataChannelListeners(dc)

      // Collect sender ICE candidates
      pc.onicecandidate = (evt) => {
        if (evt.candidate) {
          fetch("/api/share/signal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "add_ice",
              code: roomCode,
              role: "sender",
              candidate: evt.candidate,
            }),
          }).catch(() => {})
        }
      }

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      // Post Offer to server signaling API
      await fetch("/api/share/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_room",
          code: roomCode,
          offer,
          deviceInfo: detectDeviceInfo(),
        }),
      })

      // Poll for Receiver's Answer
      const pollAnswer = async () => {
        if (!isSubscribed || isConnected) return
        try {
          const res = await fetch("/api/share/signal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "poll", code: roomCode, role: "sender" }),
          })
          const data = await res.json()

          if (data.found && data.receiverDeviceInfo) {
            setPeerDevice(data.receiverDeviceInfo)
          }

          if (data.hasAnswer && pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
            
            // Add receiver ICE candidates
            if (data.receiverCandidates && data.receiverCandidates.length > 0) {
              for (const cand of data.receiverCandidates) {
                try { await pc.addIceCandidate(new RTCIceCandidate(cand)) } catch {}
              }
            }
          }
        } catch (e) {
          // ignore
        }

        if (isSubscribed && !isConnected) {
          pollTimerRef.current = setTimeout(pollAnswer, 1500)
        }
      }

      pollAnswer()
    }

    initSender()

    return () => {
      isSubscribed = false
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
      if (pcRef.current) pcRef.current.close()
    }
  }, [mode, roomCode])

  // RECEIVER ROLE: Connect to Room, Get Offer & Post Answer
  const handleConnectReceiver = async (targetCode?: string) => {
    const code = (targetCode || inputCode).trim().toUpperCase()
    if (!code || code.length < 4) {
      setErrorMsg("Please enter a valid 6-character room code.")
      return
    }

    setErrorMsg(null)
    setStatusText(`Locating sender for room ${code}…`)

    try {
      const res = await fetch("/api/share/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join_room", code, deviceInfo: detectDeviceInfo() }),
      })
      const data = await res.json()

      if (!res.ok || !data.offer) {
        setErrorMsg(data.error || `Room ${code} not found. Make sure the sender has ul0.site/share open!`)
        return
      }

      if (data.senderDeviceInfo) {
        setPeerDevice(data.senderDeviceInfo)
      }

      const pc = createPeerConnection()

      pc.ondatachannel = (evt) => {
        dcRef.current = evt.channel
        setupDataChannelListeners(evt.channel)
      }

      pc.onicecandidate = (evt) => {
        if (evt.candidate) {
          fetch("/api/share/signal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "add_ice",
              code,
              role: "receiver",
              candidate: evt.candidate,
            }),
          }).catch(() => {})
        }
      }

      await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      // Send Answer back
      await fetch("/api/share/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join_room",
          code,
          answer,
          deviceInfo: detectDeviceInfo(),
        }),
      })

      setStatusText("Exchanging WebRTC handshake…")
    } catch (err: any) {
      console.error("Join room error:", err)
      setErrorMsg("Failed to connect to room. Please check code and try again.")
    }
  }

  // Setup DataChannel chunk receiver
  const setupDataChannelListeners = (dc: RTCDataChannel) => {
    let receivedChunks: ArrayBuffer[] = []
    let expectedHeader: { name: string; size: number; mime: string } | null = null
    let receivedBytes = 0
    let lastTime = Date.now()
    let lastBytes = 0

    dc.binaryType = "arraybuffer"

    dc.onopen = () => {
      setIsConnected(true)
      setStatusText("WebRTC P2P DataChannel Active!")
      playConnectionChime()
    }

    dc.onmessage = (evt) => {
      const data = evt.data

      // Text Packet (Header)
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data)
          if (parsed.type === "header") {
            expectedHeader = { name: parsed.name, size: parsed.size, mime: parsed.mime }
            setIncomingFile(expectedHeader)
            setIsReceiving(true)
            setReceiveProgress(0)
            setReceiveCompleted(false)
            receivedChunks = []
            receivedBytes = 0
            lastTime = Date.now()
            lastBytes = 0
            setStatusText(`Receiving ${parsed.name} (${formatBytes(parsed.size)})…`)
            return
          }
        } catch {}
      }

      // Binary Packet (File Chunk)
      if (data instanceof ArrayBuffer) {
        receivedChunks.push(data)
        receivedBytes += data.byteLength

        if (expectedHeader && expectedHeader.size > 0) {
          const pct = Math.min(100, Math.round((receivedBytes / expectedHeader.size) * 100))
          setReceiveProgress(pct)

          const now = Date.now()
          const diffSec = (now - lastTime) / 1000
          if (diffSec >= 0.5) {
            const bytesDiff = receivedBytes - lastBytes
            const bps = bytesDiff / diffSec
            setReceiveSpeedBps(bps)

            const remBytes = expectedHeader.size - receivedBytes
            const etaSec = bps > 0 ? remBytes / bps : 0
            setReceiveEtaSeconds(etaSec)

            lastTime = now
            lastBytes = receivedBytes
          }
        }

        if (expectedHeader && receivedBytes >= expectedHeader.size) {
          setIsReceiving(false)
          setReceiveCompleted(true)
          setStatusText("Transfer finished! File ready.")
          setReceiveProgress(100)

          const blob = new Blob(receivedChunks, {
            type: expectedHeader.mime || "application/octet-stream",
          })
          const url = URL.createObjectURL(blob)
          setReceivedBlobUrl(url)

          // Auto Download
          const a = document.createElement("a")
          a.href = url
          a.download = expectedHeader.name
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      }
    }

    dc.onclose = () => {
      setIsConnected(false)
      setStatusText("DataChannel closed.")
    }
  }

  // Handle File Select (Sender)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setSendCompleted(false)
      setSendProgress(0)
      setErrorMsg(null)
    }
  }

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setSendCompleted(false)
      setSendProgress(0)
      setErrorMsg(null)
    }
  }

  // Send File Chunks
  const handleStartTransfer = async () => {
    if (!selectedFile) {
      setErrorMsg("Please select a file to send first.")
      return
    }
    if (!dcRef.current || dcRef.current.readyState !== "open") {
      setErrorMsg("No receiver connected yet. Share your code or link with receiver.")
      return
    }

    const dc = dcRef.current
    setIsSending(true)
    setSendProgress(0)
    setSendCompleted(false)
    setErrorMsg(null)

    const file = selectedFile
    const chunkSize = 32 * 1024 // 32KB chunks for high stability

    // Send header first
    dc.send(
      JSON.stringify({
        type: "header",
        name: file.name,
        size: file.size,
        mime: file.type || "application/octet-stream",
      })
    )

    let offset = 0
    let lastTime = Date.now()
    let lastBytes = 0

    const sendNextSlice = () => {
      if (offset >= file.size) {
        setIsSending(false)
        setSendCompleted(true)
        setSendProgress(100)
        setStatusText("File sent successfully!")
        return
      }

      const slice = file.slice(offset, offset + chunkSize)
      const reader = new FileReader()

      reader.onload = (evt) => {
        if (!evt.target || !(evt.target.result instanceof ArrayBuffer)) return
        const buffer = evt.target.result
        offset += buffer.byteLength

        dc.send(buffer)

        const pct = Math.min(100, Math.round((offset / file.size) * 100))
        setSendProgress(pct)

        const now = Date.now()
        const diffSec = (now - lastTime) / 1000
        if (diffSec >= 0.5) {
          const bytesDiff = offset - lastBytes
          const bps = bytesDiff / diffSec
          setSendSpeedBps(bps)

          const remBytes = file.size - offset
          const etaSec = bps > 0 ? remBytes / bps : 0
          setSendEtaSeconds(etaSec)

          lastTime = now
          lastBytes = offset
        }

        if (dc.bufferedAmount > 1024 * 512) {
          setTimeout(sendNextSlice, 25)
        } else {
          setTimeout(sendNextSlice, 2)
        }
      }

      reader.readAsArrayBuffer(slice)
    }

    sendNextSlice()
  }

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/share?code=${roomCode}` : ""

  const copyShareLink = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const copyRoomCode = () => {
    if (navigator.clipboard && roomCode) {
      navigator.clipboard.writeText(roomCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2500)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Mode Switcher Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl border border-white/10 p-1.5 bg-[#0e111a]/90 backdrop-blur-2xl shadow-2xl">
          <button
            onClick={() => {
              setMode("send")
              setErrorMsg(null)
            }}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === "send"
                ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Upload className="h-4 w-4" />
            Send File
          </button>
          <button
            onClick={() => {
              setMode("receive")
              setErrorMsg(null)
            }}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === "receive"
                ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Download className="h-4 w-4" />
            Receive File
          </button>
        </div>
      </div>

      {/* Main Interactive Card Canvas */}
      <Card className="border border-white/10 bg-[#0d1017]/95 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden relative">
        {/* Neon Glow Accents */}
        <div className="absolute top-0 right-0 -z-10 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />

        <CardContent className="p-6 sm:p-10 space-y-8">
          
          {/* HEADER & DEVICE TELEMETRY CARD */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all ${
                  isConnected
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/20"
                    : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                }`}
              >
                {isConnected ? (
                  <CheckCircle2 className="h-7 w-7 animate-pulse" />
                ) : (
                  <Shield className="h-7 w-7" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg sm:text-xl flex items-center gap-2">
                  {mode === "send" ? "P2P Sender Station" : "P2P Receiver Station"}
                </h3>
                <p className="text-xs text-gray-400 font-mono flex items-center gap-2 mt-1">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isConnected ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                    }`}
                  />
                  {statusText}
                </p>
              </div>
            </div>

            {/* EXACT DEVICE TELEMETRY DISPLAY */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                {myDeviceInfo.os === "Android" ? (
                  <Smartphone className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Laptop className="h-4 w-4 text-indigo-400" />
                )}
                <span>
                  This Device: <strong className="text-white">{myDeviceInfo.os} ({myDeviceInfo.browser})</strong>
                </span>
              </div>

              {peerDevice && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
                  <Activity className="h-4 w-4 animate-pulse" />
                  <span>
                    Peer: <strong className="text-white">{peerDevice.os} ({peerDevice.browser})</strong> [{peerDevice.ip}]
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="flex items-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              <p className="flex-1 text-xs sm:text-sm">{errorMsg}</p>
            </div>
          )}

          {/* ================= SENDER MODE ================= */}
          {mode === "send" && (
            <div className="space-y-8">
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
                  isDragging
                    ? "border-indigo-400 bg-indigo-500/15 scale-[1.01]"
                    : selectedFile
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-inner"
                    : "border-white/15 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10"
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-md">
                      <FileCheck className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg max-w-xs sm:max-w-md truncate mx-auto">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs font-mono text-emerald-400 mt-1">
                        {formatBytes(selectedFile.size)} · Direct P2P Ready
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Change Selected File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 pointer-events-none">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-sm">
                      <Upload className="h-8 w-8 animate-bounce" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg sm:text-xl">
                        Drag &amp; Drop Any File Here
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        or click to select from your device. Zero file size limits!
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] font-mono text-gray-500">
                      <span>Videos</span> · <span>PDFs</span> · <span>RAW Photos</span> · <span>Archives</span> · <span>Software</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Room Code Box with Pulsing Ring */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Transfer Room Code
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Receiver inputs this code at <code className="text-cyan-400 font-mono">ul0.site/share</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-70 blur-xs animate-pulse" />
                      <code className="relative px-5 py-2.5 rounded-2xl bg-[#090b10] border border-white/20 text-2xl font-black font-mono tracking-widest text-cyan-400 shadow-xl block">
                        {roomCode}
                      </code>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyRoomCode}
                      className="h-11 text-xs gap-1.5 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
                    >
                      {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      {copiedCode ? "Copied" : "Copy Code"}
                    </Button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <Input
                    readOnly
                    value={shareUrl}
                    className="bg-[#080a0e] border-white/10 text-xs font-mono text-gray-300 truncate h-11 rounded-xl"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={copyShareLink}
                      className="h-11 text-xs gap-1.5 shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    >
                      {copiedLink ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                      {copiedLink ? "Link Copied!" : "Copy Link"}
                    </Button>
                    <Button
                      onClick={() => setShowQr(!showQr)}
                      variant="outline"
                      className="h-11 text-xs gap-1.5 shrink-0 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
                    >
                      <QrCode className="h-4 w-4" />
                      QR Code
                    </Button>
                  </div>
                </div>

                {showQr && (
                  <div className="pt-3 text-center flex flex-col items-center animate-in fade-in duration-300">
                    <div className="p-3 bg-white rounded-2xl shadow-2xl border">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                          shareUrl
                        )}`}
                        alt="Scan QR code"
                        className="w-40 h-40"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Scan with camera to open instantly on mobile
                    </p>
                  </div>
                )}
              </div>

              {/* Telemetry Dashboard & Progress Bar */}
              {selectedFile && (
                <div className="space-y-4 pt-2">
                  {isSending ? (
                    <div className="space-y-4 rounded-3xl border border-indigo-500/30 bg-indigo-500/10 p-6 shadow-xl">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-white">Transmitting {selectedFile.name}…</span>
                        <span className="font-mono text-cyan-400 text-base">{sendProgress}%</span>
                      </div>

                      <div className="h-4 w-full rounded-full bg-black/50 overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${sendProgress}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs font-mono">
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                          <span className="text-[10px] text-gray-400 block uppercase">Real-Time Speed</span>
                          <span className="font-bold text-cyan-400 text-sm mt-0.5 block">
                            {(sendSpeedBps / (1024 * 1024)).toFixed(2)} MB/s
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                          <span className="text-[10px] text-gray-400 block uppercase">Time Remaining</span>
                          <span className="font-bold text-white text-sm mt-0.5 block">
                            {formatTimeRemaining(sendEtaSeconds)}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                          <span className="text-[10px] text-gray-400 block uppercase">Connection</span>
                          <span className="font-bold text-emerald-400 text-xs mt-1 block truncate">
                            WebRTC P2P Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : sendCompleted ? (
                    <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center space-y-2 shadow-xl">
                      <p className="font-extrabold text-emerald-400 text-lg">
                        🎉 Transfer Completed Successfully!
                      </p>
                      <p className="text-xs text-gray-300">
                        Receiver has safely downloaded <strong className="text-white">{selectedFile.name}</strong>.
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleStartTransfer}
                      disabled={!isConnected}
                      className="w-full h-14 text-base font-extrabold gap-2 rounded-2xl shadow-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white"
                    >
                      <Zap className="h-5 w-5 fill-current" />
                      {isConnected ? "Start Direct Transfer Now" : "Waiting for Receiver to Connect…"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= RECEIVER MODE ================= */}
          {mode === "receive" && (
            <div className="space-y-8">
              {!isConnected ? (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                      Enter 6-Character Transfer Code
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        placeholder="e.g. DV4UV7"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        maxLength={8}
                        className="h-14 text-xl font-mono font-bold tracking-widest text-center uppercase bg-[#080a0e] border-white/15 rounded-2xl text-cyan-400"
                      />
                      <Button
                        onClick={() => handleConnectReceiver()}
                        className="h-14 px-8 text-sm font-extrabold gap-2 shrink-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-xl"
                      >
                        Connect to Sender
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Enter the room code provided by sender or open shared URL directly.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                      <div>
                        <p className="text-sm font-bold text-white">Direct P2P WebRTC Tunnel Connected</p>
                        <p className="text-xs text-gray-300 font-mono">
                          Sender: {peerDevice ? `${peerDevice.os} (${peerDevice.browser}) [${peerDevice.ip}]` : "Active"}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsConnected(false)}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Disconnect
                    </Button>
                  </div>

                  {incomingFile ? (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6 shadow-xl">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
                          <FileIcon className="h-7 w-7" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-base truncate">
                            {incomingFile.name}
                          </p>
                          <p className="text-xs font-mono text-gray-400 mt-0.5">
                            File Size: {formatBytes(incomingFile.size)}
                          </p>
                        </div>
                      </div>

                      {isReceiving && (
                        <div className="space-y-4 pt-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-white">Downloading directly from sender…</span>
                            <span className="font-mono text-cyan-400 text-base">{receiveProgress}%</span>
                          </div>

                          <div className="h-4 w-full rounded-full bg-black/50 overflow-hidden border border-white/10">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                              style={{ width: `${receiveProgress}%` }}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                              <span className="text-[10px] text-gray-400 block uppercase">Download Speed</span>
                              <span className="font-bold text-cyan-400 text-sm mt-0.5 block">
                                {(receiveSpeedBps / (1024 * 1024)).toFixed(2)} MB/s
                              </span>
                            </div>
                            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                              <span className="text-[10px] text-gray-400 block uppercase">Time Remaining</span>
                              <span className="font-bold text-white text-sm mt-0.5 block">
                                {formatTimeRemaining(receiveEtaSeconds)}
                              </span>
                            </div>
                            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                              <span className="text-[10px] text-gray-400 block uppercase">Connection</span>
                              <span className="font-bold text-emerald-400 text-xs mt-1 block truncate">
                                Direct Encrypted P2P
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {receiveCompleted && receivedBlobUrl && (
                        <div className="space-y-3 pt-2">
                          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center text-xs text-emerald-400 font-bold">
                            ✨ Transfer finished! Your file downloaded automatically.
                          </div>
                          <Button
                            asChild
                            className="w-full h-14 text-base font-extrabold gap-2 rounded-2xl shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <a href={receivedBlobUrl} download={incomingFile.name}>
                              <Download className="h-5 w-5" />
                              Download Again ({formatBytes(incomingFile.size)})
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-white/15 p-8 text-center space-y-3">
                      <RefreshCcw className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
                      <p className="font-bold text-white text-base">Waiting for Sender to Start File Transfer</p>
                      <p className="text-xs text-gray-400">Sender will select and send the file now.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          </CardContent>
        </Card>
      </div>
    )
}
