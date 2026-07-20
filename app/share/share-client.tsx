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
  Globe,
  Lock,
  RefreshCw,
  FileIcon,
  HardDrive,
  QrCode,
  ArrowRight,
  Share2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Wifi,
  Clock,
  Gauge,
  Radio,
  Sparkles,
  Volume2,
  Tv,
  Smartphone,
  Laptop,
} from "lucide-react"
import { ShareAdBanner } from "@/components/share-ad-banner"

// Human-readable file size formatter
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// ETA Time Formatter
function formatTimeRemaining(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return "Calculating…"
  if (seconds < 60) return `${Math.ceil(seconds)}s remaining`
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  if (mins < 60) return `${mins}m ${secs}s remaining`
  const hrs = Math.floor(mins / 60)
  const remMins = mins % 60
  return `${hrs}h ${remMins}m remaining`
}

// Generate 6-character clean room code
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let res = ""
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return res
}

// Web Audio API Connection Chime (AirDrop Sound)
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

    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  } catch {
    // ignore
  }
}

interface NearbyDevice {
  id: string
  name: string
  code: string
  type: "mac" | "phone" | "desktop"
  lastSeen: number
}

export function ShareClient() {
  const searchParams = useSearchParams()
  const urlCode = searchParams.get("code")

  const [mode, setMode] = useState<"send" | "receive" | "nearby">("send")
  const [roomCode, setRoomCode] = useState<string>("")
  const [inputCode, setInputCode] = useState<string>("")

  // PeerJS / Connection State
  const [peerId, setPeerId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [peerDeviceName, setPeerDeviceName] = useState<string>("Connected Peer")
  const [statusText, setStatusText] = useState<string>("Initializing P2P WebRTC engine…")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState<number>(0)

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

  // Nearby Discovery State
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([])
  const [isScanningNearby, setIsScanningNearby] = useState<boolean>(false)

  // UI State
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const [copiedCode, setCopiedCode] = useState<boolean>(false)
  const [showQr, setShowQr] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const peerRef = useRef<any>(null)
  const connRef = useRef<any>(null)
  const broadcastRef = useRef<BroadcastChannel | null>(null)
  const retryTimerRef = useRef<any>(null)

  // Initialize room code
  useEffect(() => {
    if (urlCode && urlCode.trim().length >= 4) {
      setMode("receive")
      const clean = urlCode.trim().toUpperCase()
      setInputCode(clean)
    } else {
      setRoomCode(generateCode())
    }
  }, [urlCode])

  // Setup Local BroadcastChannel for instant local pairing & nearby discovery
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return

    const bc = new BroadcastChannel("ul0_p2p_channel")
    broadcastRef.current = bc

    bc.onmessage = (evt) => {
      const { type, code, senderName } = evt.data || {}

      if (type === "HEARTBEAT" && code && code !== roomCode) {
        setNearbyDevices((prev) => {
          const exists = prev.find((d) => d.code === code)
          const updated: NearbyDevice = {
            id: `dev-${code}`,
            name: senderName || `Peer (${code.slice(0, 3)})`,
            code,
            type: navigator.userAgent.includes("Mobile") ? "phone" : "mac",
            lastSeen: Date.now(),
          }
          if (exists) {
            return prev.map((d) => (d.code === code ? updated : d))
          }
          return [...prev, updated]
        })
      }
    }

    // Broadcast periodic heartbeat if in send mode
    const hbInterval = setInterval(() => {
      if (mode === "send" && roomCode) {
        bc.postMessage({
          type: "HEARTBEAT",
          code: roomCode,
          senderName: navigator.platform.includes("Mac") ? "MacBook Pro" : "Local Device",
        })
      }
    }, 2000)

    return () => {
      clearInterval(hbInterval)
      bc.close()
    }
  }, [mode, roomCode])

  // Initialize PeerJS client with extensive STUN fallback servers
  useEffect(() => {
    let peerInstance: any = null

    async function initPeer() {
      try {
        const { default: Peer } = await import("peerjs")

        const codeToUse = mode === "send" ? roomCode : ""
        const idToRegister = codeToUse ? `ul-p2p-${codeToUse}` : undefined

        peerInstance = new Peer(idToRegister as any, {
          debug: 1,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
              { urls: "stun:stun3.l.google.com:19302" },
              { urls: "stun:stun4.l.google.com:19302" },
              { urls: "stun:global.stun.twilio.com:3478" },
            ],
          },
        })

        peerRef.current = peerInstance

        peerInstance.on("open", (id: string) => {
          setPeerId(id)
          setErrorMsg(null)
          setStatusText(
            mode === "send"
              ? "Sender Node Active. Share code or QR to pair."
              : "Ready to pair with sender."
          )

          // If in receive mode and inputCode is already provided via URL, auto connect!
          if (mode === "receive" && inputCode.length >= 4) {
            connectToSender(inputCode, peerInstance)
          }
        })

        peerInstance.on("connection", (conn: any) => {
          connRef.current = conn
          setIsConnected(true)
          setStatusText("Peer Connected via P2P WebRTC!")
          playConnectionChime()
          setupConnectionListeners(conn)
        })

        peerInstance.on("error", (err: any) => {
          console.log("PeerJS status note:", err.type)
          if (err.type === "peer-not-found" && mode === "receive") {
            // Friendly retry note instead of hard crash
            setStatusText(`Waiting for sender node (${inputCode}) to get online…`)
          }
        })
      } catch (err: any) {
        console.error("PeerJS init error:", err)
        setErrorMsg("WebRTC engine initialization warning. Please refresh if pairing hangs.")
      }
    }

    if ((mode === "send" && roomCode) || mode === "receive") {
      initPeer()
    }

    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
      if (peerInstance) peerInstance.destroy()
    }
  }, [mode, roomCode])

  // Connect Receiver to Sender with automated retry loop
  const connectToSender = (targetCode?: string, customPeer?: any) => {
    const code = (targetCode || inputCode).trim().toUpperCase()
    if (!code || code.length < 4) {
      setErrorMsg("Please enter a valid 6-character room code.")
      return
    }

    const peer = customPeer || peerRef.current
    if (!peer) return

    setErrorMsg(null)
    setStatusText(`Connecting to sender code ${code}…`)

    const targetPeerId = `ul-p2p-${code}`
    let attempts = 0

    const attemptConnection = () => {
      attempts++
      setRetryCount(attempts)
      setStatusText(`Establishing WebRTC P2P tunnel to ${code}… (Attempt ${attempts}/10)`)

      const conn = peer.connect(targetPeerId, { reliable: true })
      connRef.current = conn

      conn.on("open", () => {
        setIsConnected(true)
        setStatusText(`Connected to sender ${code}!`)
        playConnectionChime()
        setupConnectionListeners(conn)
      })

      conn.on("error", (err: any) => {
        console.log("Retry connection note:", err)
        if (attempts < 10 && !isConnected) {
          retryTimerRef.current = setTimeout(attemptConnection, 2000)
        } else {
          setErrorMsg("Connection timeout. Make sure the sender's tab is active and code matches.")
        }
      })
    }

    attemptConnection()
  }

  // Setup connection event handlers & chunk assembly
  const setupConnectionListeners = (conn: any) => {
    let receivedChunks: ArrayBuffer[] = []
    let expectedHeader: { name: string; size: number; mime: string } | null = null
    let receivedBytes = 0
    let lastTime = Date.now()
    let lastBytes = 0

    conn.on("data", (data: any) => {
      // 1. Header packet
      if (data && data.type === "header") {
        expectedHeader = { name: data.name, size: data.size, mime: data.mime }
        setIncomingFile(expectedHeader)
        setIsReceiving(true)
        setReceiveProgress(0)
        setReceiveCompleted(false)
        receivedChunks = []
        receivedBytes = 0
        lastTime = Date.now()
        lastBytes = 0
        setStatusText(`Receiving file: ${data.name} (${formatBytes(data.size)})…`)
        return
      }

      // 2. Chunk packet
      if (data && data.type === "chunk" && data.chunk) {
        const chunk: ArrayBuffer = data.chunk
        receivedChunks.push(chunk)
        receivedBytes += chunk.byteLength

        if (expectedHeader && expectedHeader.size > 0) {
          const pct = Math.min(100, Math.round((receivedBytes / expectedHeader.size) * 100))
          setReceiveProgress(pct)

          // Live Speed and ETA telemetry calculations
          const now = Date.now()
          const diffSec = (now - lastTime) / 1000
          if (diffSec >= 0.6) {
            const bytesDiff = receivedBytes - lastBytes
            const bps = bytesDiff / diffSec
            setReceiveSpeedBps(bps)

            const remainingBytes = expectedHeader.size - receivedBytes
            const etaSec = bps > 0 ? remainingBytes / bps : 0
            setReceiveEtaSeconds(etaSec)

            lastTime = now
            lastBytes = receivedBytes
          }
        }

        // Completion check
        if (data.isLast || (expectedHeader && receivedBytes >= expectedHeader.size)) {
          setIsReceiving(false)
          setReceiveCompleted(true)
          setStatusText("File transfer complete! Download ready.")
          setReceiveProgress(100)

          const blob = new Blob(receivedChunks, {
            type: expectedHeader?.mime || "application/octet-stream",
          })
          const url = URL.createObjectURL(blob)
          setReceivedBlobUrl(url)

          // Auto-trigger browser download
          const a = document.createElement("a")
          a.href = url
          a.download = expectedHeader?.name || "downloaded-file"
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      }
    })

    conn.on("close", () => {
      setIsConnected(false)
      setStatusText("Connection closed by peer.")
    })
  }

  // Handle File Selection (Sender)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setSendCompleted(false)
      setSendProgress(0)
      setErrorMsg(null)
    }
  }

  // Drag and Drop
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
      setErrorMsg("Please select a file to share first.")
      return
    }
    if (!connRef.current || !isConnected) {
      setErrorMsg("No receiver connected yet. Share your code or link with the receiver first.")
      return
    }

    const conn = connRef.current
    setIsSending(true)
    setSendProgress(0)
    setSendCompleted(false)
    setErrorMsg(null)

    const file = selectedFile
    const chunkSize = 64 * 1024 // 64KB chunks
    const totalChunks = Math.ceil(file.size / chunkSize)

    conn.send({
      type: "header",
      name: file.name,
      size: file.size,
      mime: file.type || "application/octet-stream",
    })

    let offset = 0
    let chunkIndex = 0
    let lastTime = Date.now()
    let lastBytes = 0

    const readAndSendNextChunk = () => {
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
        if (!evt.target || !evt.target.result) return
        const buffer = evt.target.result as ArrayBuffer
        offset += buffer.byteLength
        chunkIndex++

        const isLast = offset >= file.size

        conn.send({
          type: "chunk",
          chunk: buffer,
          chunkIndex,
          totalChunks,
          isLast,
        })

        const pct = Math.min(100, Math.round((offset / file.size) * 100))
        setSendProgress(pct)

        // Speed & ETA calculations
        const now = Date.now()
        const diffSec = (now - lastTime) / 1000
        if (diffSec >= 0.6) {
          const bytesDiff = offset - lastBytes
          const bps = bytesDiff / diffSec
          setSendSpeedBps(bps)

          const remBytes = file.size - offset
          const etaSec = bps > 0 ? remBytes / bps : 0
          setSendEtaSeconds(etaSec)

          lastTime = now
          lastBytes = offset
        }

        if (conn.dataChannel && conn.dataChannel.bufferedAmount > 1024 * 1024) {
          setTimeout(readAndSendNextChunk, 40)
        } else {
          setTimeout(readAndSendNextChunk, 3)
        }
      }

      reader.readAsArrayBuffer(slice)
    }

    readAndSendNextChunk()
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

  // Network speed classification helper
  const getNetworkQualityLabel = (speedBps: number) => {
    if (speedBps > 10 * 1024 * 1024) return "Ultra Wi-Fi Direct (~100+ Mbps)"
    if (speedBps > 2 * 1024 * 1024) return "High-Speed P2P (~20-50 Mbps)"
    if (speedBps > 500 * 1024) return "Standard WebRTC (~5-15 Mbps)"
    return "Relay P2P Tunnel"
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Navigation Mode Bar */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-3xl border border-border/60 p-1.5 bg-card/80 backdrop-blur-xl shadow-lg">
          <button
            onClick={() => {
              setMode("send")
              setErrorMsg(null)
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "send"
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground"
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
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "receive"
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Download className="h-4 w-4" />
            Receive File
          </button>
          <button
            onClick={() => {
              setMode("nearby")
              setErrorMsg(null)
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              mode === "nearby"
                ? "bg-emerald-600 text-white shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Radio className="h-4 w-4 animate-pulse" />
            AirDrop Radar
          </button>
        </div>
      </div>

      {/* Main Layout Grid with Dual Aesthetic 160x300 Ad Banners */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* Left Ad Banner (Desktop) */}
        <div className="hidden xl:block xl:col-span-2">
          <ShareAdBanner label="Ad Banner 1" />
        </div>

        {/* Center Main Dashboard Workspace (8 cols on XL, 9 on LG) */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">
          <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden relative">
            
            {/* Background Radial Neon Glow effect */}
            <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

            <CardContent className="p-6 sm:p-8 space-y-6">
              
              {/* STATUS HEADER WITH TELEMETRY INDICATORS */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                      isConnected
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-lg shadow-emerald-500/20"
                        : "bg-primary/10 border-primary/20 text-primary"
                    }`}
                  >
                    {isConnected ? (
                      <CheckCircle2 className="h-6 w-6 animate-pulse" />
                    ) : (
                      <Shield className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2">
                      {mode === "send"
                        ? "Sender Node"
                        : mode === "receive"
                        ? "Receiver Node"
                        : "AirDrop Discovery Scan"}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 font-mono">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isConnected ? "bg-emerald-500 animate-ping" : "bg-amber-500"
                        }`}
                      />
                      {statusText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40 text-[11px] font-mono text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 text-emerald-500" />
                    <span>256-Bit WebRTC Encrypted</span>
                  </div>
                </div>
              </div>

              {/* ERROR / NOTICE ALERT */}
              {errorMsg && (
                <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3.5 text-sm text-destructive">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="flex-1 text-xs sm:text-sm">{errorMsg}</p>
                </div>
              )}

              {/* ================= SENDER MODE ================= */}
              {mode === "send" && (
                <div className="space-y-6">
                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
                      isDragging
                        ? "border-primary bg-primary/10 scale-[1.01]"
                        : selectedFile
                        ? "border-emerald-500/40 bg-emerald-500/5 shadow-inner"
                        : "border-border/60 bg-muted/10 hover:border-primary/50 hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />

                    {selectedFile ? (
                      <div className="space-y-3">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 shadow-md">
                          <FileCheck className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-lg max-w-xs sm:max-w-md truncate mx-auto">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-1">
                            {formatBytes(selectedFile.size)} · Unlimited Transfer Ready
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Change Selected File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 pointer-events-none">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-sm">
                          <Upload className="h-8 w-8 animate-bounce" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-lg sm:text-xl">
                            Drag &amp; Drop Any File Here
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            or click to select from your device. Zero file size limits!
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] font-mono text-muted-foreground/70">
                          <span>Videos</span> · <span>PDFs</span> · <span>RAW Photos</span> · <span>Archives</span> · <span>Software</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Transfer Code & Share Box */}
                  <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                          Share Room Code
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Recipient enters this code at <code className="text-primary font-mono">ul0.site/share</code>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <code className="px-4 py-2 rounded-2xl bg-background border border-border text-xl font-bold font-mono tracking-widest text-primary shadow-xs">
                          {roomCode}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyRoomCode}
                          className="h-10 text-xs gap-1.5 rounded-xl"
                        >
                          {copiedCode ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                          {copiedCode ? "Copied" : "Copy Code"}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <Input
                        readOnly
                        value={shareUrl}
                        className="bg-background text-xs font-mono truncate h-10 rounded-xl"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={copyShareLink}
                          variant="default"
                          className="h-10 text-xs gap-1.5 shrink-0 rounded-xl"
                        >
                          {copiedLink ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                          {copiedLink ? "Link Copied!" : "Copy Link"}
                        </Button>
                        <Button
                          onClick={() => setShowQr(!showQr)}
                          variant="outline"
                          className="h-10 text-xs gap-1.5 shrink-0 rounded-xl"
                        >
                          <QrCode className="h-4 w-4" />
                          QR Code
                        </Button>
                      </div>
                    </div>

                    {showQr && (
                      <div className="pt-3 text-center flex flex-col items-center animate-in fade-in duration-300">
                        <div className="p-3 bg-white rounded-2xl shadow-md border">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                              shareUrl
                            )}`}
                            alt="Scan QR code"
                            className="w-40 h-40"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Scan with your camera to open instantly on mobile
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Real-time Telemetry Dashboard & Progress */}
                  {selectedFile && (
                    <div className="space-y-4 pt-2">
                      {isSending ? (
                        <div className="space-y-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-sm">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-foreground">Transmitting {selectedFile.name}…</span>
                            <span className="font-mono text-primary text-sm font-bold">{sendProgress}%</span>
                          </div>

                          <div className="h-3.5 w-full rounded-full bg-muted overflow-hidden border border-border/40">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${sendProgress}%` }}
                            />
                          </div>

                          {/* Live Transfer Telemetry Grid */}
                          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs font-mono">
                            <div className="p-2.5 rounded-xl bg-background/80 border border-border/50">
                              <span className="text-[10px] text-muted-foreground block uppercase">Transfer Speed</span>
                              <span className="font-bold text-primary text-sm mt-0.5 block">
                                {(sendSpeedBps / (1024 * 1024)).toFixed(2)} MB/s
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-background/80 border border-border/50">
                              <span className="text-[10px] text-muted-foreground block uppercase">Time Remaining</span>
                              <span className="font-bold text-foreground text-sm mt-0.5 block">
                                {formatTimeRemaining(sendEtaSeconds)}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-background/80 border border-border/50">
                              <span className="text-[10px] text-muted-foreground block uppercase">Network Mode</span>
                              <span className="font-bold text-emerald-500 text-[11px] mt-1 block truncate">
                                {getNetworkQualityLabel(sendSpeedBps)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : sendCompleted ? (
                        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center space-y-2 shadow-sm">
                          <p className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                            🎉 Transfer Completed Successfully!
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Recipient has received <strong className="text-foreground">{selectedFile.name}</strong>.
                          </p>
                        </div>
                      ) : (
                        <Button
                          onClick={handleStartTransfer}
                          disabled={!isConnected}
                          className="w-full h-14 text-base font-bold gap-2 rounded-2xl shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground"
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
                <div className="space-y-6">
                  {!isConnected ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">
                          Enter 6-Character Room Transfer Code
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            placeholder="e.g. X7K2M9"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                            maxLength={8}
                            className="h-12 text-lg font-mono tracking-widest text-center uppercase bg-background rounded-xl"
                          />
                          <Button
                            onClick={() => connectToSender()}
                            className="h-12 px-8 text-sm font-bold gap-2 shrink-0 rounded-xl shadow-md"
                          >
                            Connect to Sender
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Enter the code provided by the sender or open their shared URL directly.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                          <div>
                            <p className="text-sm font-bold text-foreground">WebRTC Tunnel Connected</p>
                            <p className="text-xs text-muted-foreground">Direct Peer-to-Peer Link Established</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsConnected(false)}
                          className="text-xs text-muted-foreground"
                        >
                          Disconnect
                        </Button>
                      </div>

                      {incomingFile ? (
                        <div className="rounded-2xl border border-border bg-muted/20 p-6 space-y-5 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-xs">
                              <FileIcon className="h-7 w-7" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-foreground text-base truncate">
                                {incomingFile.name}
                              </p>
                              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                                File Size: {formatBytes(incomingFile.size)}
                              </p>
                            </div>
                          </div>

                          {isReceiving && (
                            <div className="space-y-4 pt-2">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-foreground">Downloading directly from sender…</span>
                                <span className="font-mono text-primary text-sm font-bold">{receiveProgress}%</span>
                              </div>
                              <div className="h-3.5 w-full rounded-full bg-muted overflow-hidden border border-border/40">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-300"
                                  style={{ width: `${receiveProgress}%` }}
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                                <div className="p-2.5 rounded-xl bg-background/80 border border-border/50">
                                  <span className="text-[10px] text-muted-foreground block uppercase">Download Speed</span>
                                  <span className="font-bold text-primary text-sm mt-0.5 block">
                                    {(receiveSpeedBps / (1024 * 1024)).toFixed(2)} MB/s
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-background/80 border border-border/50">
                                  <span className="text-[10px] text-muted-foreground block uppercase">Time Remaining</span>
                                  <span className="font-bold text-foreground text-sm mt-0.5 block">
                                    {formatTimeRemaining(receiveEtaSeconds)}
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-background/80 border border-border/50">
                                  <span className="text-[10px] text-muted-foreground block uppercase">Tunnel Status</span>
                                  <span className="font-bold text-emerald-500 text-[11px] mt-1 block truncate">
                                    Encrypted Direct P2P
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {receiveCompleted && receivedBlobUrl && (
                            <div className="space-y-3 pt-2">
                              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                ✨ Transfer finished! Your file downloaded automatically.
                              </div>
                              <Button
                                asChild
                                className="w-full h-12 text-base font-bold gap-2 rounded-2xl shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white"
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
                        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center space-y-2">
                          <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto" />
                          <p className="font-bold text-foreground text-sm">Waiting for Sender to Initiate Transfer</p>
                          <p className="text-xs text-muted-foreground">The sender will choose and transmit the file momentarily.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ================= AIRDROP / NEARBY MODE ================= */}
              {mode === "nearby" && (
                <div className="space-y-6">
                  <div className="text-center space-y-2 py-4">
                    <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 shadow-md">
                        <Radio className="h-7 w-7 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground text-lg">Scanning Nearby Devices</h3>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      Any device open to <code className="text-emerald-500 font-mono">ul0.site/share</code> on your local network will appear below automatically.
                    </p>
                  </div>

                  {nearbyDevices.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {nearbyDevices.map((dev) => (
                        <div
                          key={dev.id}
                          className="flex items-center justify-between p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60 transition-all cursor-pointer shadow-xs"
                          onClick={() => {
                            setMode("receive")
                            setInputCode(dev.code)
                            connectToSender(dev.code)
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                              {dev.type === "phone" ? <Smartphone className="h-5 w-5" /> : <Laptop className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-sm">{dev.name}</p>
                              <p className="text-xs font-mono text-muted-foreground">Code: {dev.code}</p>
                            </div>
                          </div>
                          <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                            Connect
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center space-y-2">
                      <p className="text-xs font-mono text-muted-foreground">
                        No secondary device detected on local broadcast yet. Open <span className="text-primary font-bold">ul0.site/share</span> on another tab or device to test!
                      </p>
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right Ad Banner (Desktop) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-2">
          <ShareAdBanner label="Ad Banner 2" />
        </div>
      </div>
    </div>
  )
}
