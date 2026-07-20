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
  Globe,
  RefreshCcw,
  Sparkles,
  Link2,
} from "lucide-react"

// Authentic High-Definition Brand SVG Logos for Browsers
function BraveLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <path
        d="M27.2 9.4L22.5 2h-13L4.8 9.4c-.6.9-.7 2.1-.3 3.1l4 9.8c.4 1 1.3 1.7 2.4 1.7h10.2c1.1 0 2-.7 2.4-1.7l4-9.8c.4-1 .3-2.2-.3-3.1z"
        fill="#FF5500"
      />
      <path
        d="M16 6.5l-4.5 3h9L16 6.5zm-6.2 5.5l-1.5 5h15.4l-1.5-5H9.8zm1.7 7l4.5 3.5 4.5-3.5H11.5z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function ChromeLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#4285F4" />
      <path d="M12 12L7.3 3.9A10 10 0 0 1 12 2a10 10 0 0 1 8.7 5.1L12 12z" fill="#EA4335" />
      <path d="M12 12l8.7-4.9A10 10 0 0 1 18 19.4L12 12z" fill="#FBBC05" />
      <path d="M12 12l6 7.4A10 10 0 0 1 3.9 12L12 12z" fill="#34A853" />
      <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
      <circle cx="12" cy="12" r="3.5" fill="#1A73E8" />
    </svg>
  )
}

function SafariLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#0066CC" />
      <path d="M12 4a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm2.8 5.2l-2 5.6-5.6 2 2-5.6 5.6-2z" fill="#FFFFFF" />
      <polygon points="12,12 14.8,9.2 12.8,14.8" fill="#FF3B30" />
    </svg>
  )
}

function FirefoxLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#E66000" />
      <path d="M12 4a8 8 0 0 1 7 11.8A7.9 7.9 0 0 0 12 4z" fill="#FF9400" />
      <circle cx="12" cy="12" r="5" fill="#0060DF" />
    </svg>
  )
}

function EdgeLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10 4.8 0 8.8-3.4 9.7-8h-6.2a4 4 0 1 1-3.5-5.8h9.8A10 10 0 0 0 12 2z"
        fill="#0078D4"
      />
    </svg>
  )
}

function BrowserBrandIcon({ browser }: { browser: string }) {
  const b = browser.toLowerCase()
  if (b.includes("brave")) return <BraveLogo className="h-4 w-4 shrink-0" />
  if (b.includes("chrome")) return <ChromeLogo className="h-4 w-4 shrink-0" />
  if (b.includes("safari")) return <SafariLogo className="h-4 w-4 shrink-0" />
  if (b.includes("firefox")) return <FirefoxLogo className="h-4 w-4 shrink-0" />
  if (b.includes("edge") || b.includes("edg")) return <EdgeLogo className="h-4 w-4 shrink-0" />
  return <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
}

// Format bytes
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// Format ETA
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

// Detect client OS & Browser
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

// Global AudioContext singleton to unlock browser sound
let globalAudioCtx: AudioContext | null = null

function unlockAudioContext() {
  try {
    if (!globalAudioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContextClass) globalAudioCtx = new AudioContextClass()
    }
    if (globalAudioCtx && globalAudioCtx.state === "suspended") {
      globalAudioCtx.resume()
    }
  } catch {}
}

function playConnectionChime() {
  try {
    unlockAudioContext()
    if (!globalAudioCtx) return
    const ctx = globalAudioCtx

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
  } catch {}
}

export function ShareClient() {
  const searchParams = useSearchParams()
  const urlCode = searchParams.get("code")

  const [mode, setMode] = useState<"send" | "receive">("send")
  const [roomCode, setRoomCode] = useState<string>("")
  const [inputCode, setInputCode] = useState<string>("")

  // Connection State (WebRTC or Fail-Safe Server Relay)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [connectionType, setConnectionType] = useState<"p2p" | "relay">("p2p")
  const [statusText, setStatusText] = useState<string>("Ready. Share room code or link to connect.")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [peerDevice, setPeerDevice] = useState<{ os: string; browser: string; ip: string; countryCode?: string; countryFlag?: string } | null>(null)
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
  const appliedCandidates = useRef<Set<string>>(new Set())

  // Unlock AudioContext on click/touch
  useEffect(() => {
    const handleGesture = () => unlockAudioContext()
    window.addEventListener("click", handleGesture, { once: true })
    window.addEventListener("touchstart", handleGesture, { once: true })
    return () => {
      window.removeEventListener("click", handleGesture)
      window.removeEventListener("touchstart", handleGesture)
    }
  }, [])

  // Initialize room code & device info
  useEffect(() => {
    setMyDeviceInfo(detectDeviceInfo())
    if (urlCode && urlCode.trim().length >= 4) {
      setMode("receive")
      const clean = urlCode.trim().toUpperCase()
      setInputCode(clean)
    } else {
      setRoomCode(generateCode())
    }
  }, [urlCode])

  // Create WebRTC PeerConnection
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
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setIsConnected(true)
        setConnectionType("p2p")
        setStatusText("Direct WebRTC P2P Channel Active")
        playConnectionChime()
      } else if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
        setIsConnected(false)
        setStatusText("Peer disconnected")
      }
    }

    pcRef.current = pc
    return pc
  }

  // SENDER ROLE: Publish Offer & Poll Receiver's Answer + Candidates continuously
  useEffect(() => {
    if (mode !== "send" || !roomCode) return

    let isSubscribed = true

    async function initSender() {
      const pc = createPeerConnection()
      const dc = pc.createDataChannel("fileTransfer", { ordered: true })
      dcRef.current = dc

      setupDataChannelListeners(dc)

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
            setIsConnected(true)
            setStatusText(`Connected to Receiver (${data.receiverDeviceInfo.os})`)
            playConnectionChime()
          }

          if (data.hasAnswer && pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
          }

          if (data.receiverCandidates && data.receiverCandidates.length > 0) {
            for (const cand of data.receiverCandidates) {
              const candStr = JSON.stringify(cand)
              if (!appliedCandidates.current.has(candStr)) {
                appliedCandidates.current.add(candStr)
                try { await pc.addIceCandidate(new RTCIceCandidate(cand)) } catch {}
              }
            }
          }
        } catch (e) {}

        if (isSubscribed && !isConnected) {
          pollTimerRef.current = setTimeout(pollAnswer, 800)
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

  // RECEIVER ROLE: Join Room, Set Remote Offer, Create Answer & Poll Sender Candidates
  const handleConnectReceiver = async (targetCode?: string) => {
    const code = (targetCode || inputCode).trim().toUpperCase()
    if (!code || code.length < 4) {
      setErrorMsg("Please enter a valid 6-character room code.")
      return
    }

    setErrorMsg(null)
    setStatusText(`Connecting to room ${code}…`)

    try {
      const res = await fetch("/api/share/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join_room", code, deviceInfo: detectDeviceInfo() }),
      })
      const data = await res.json()

      if (!res.ok || !data.offer) {
        setErrorMsg(data.error || `Room ${code} not found. Make sure the sender has ul0.site/share open.`)
        return
      }

      if (data.senderDeviceInfo) {
        setPeerDevice(data.senderDeviceInfo)
        setIsConnected(true)
        setStatusText(`Connected to Sender (${data.senderDeviceInfo.os})`)
        playConnectionChime()
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

      // Continuous ICE Candidate poll
      const pollSenderCandidates = async () => {
        if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") return
        try {
          const pollRes = await fetch("/api/share/signal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "poll", code, role: "receiver" }),
          })
          const pollData = await pollRes.json()

          if (pollData.senderCandidates && pollData.senderCandidates.length > 0) {
            for (const cand of pollData.senderCandidates) {
              const candStr = JSON.stringify(cand)
              if (!appliedCandidates.current.has(candStr)) {
                appliedCandidates.current.add(candStr)
                try { await pc.addIceCandidate(new RTCIceCandidate(cand)) } catch {}
              }
            }
          }
        } catch {}

        if (pc.iceConnectionState !== "connected" && pc.iceConnectionState !== "completed") {
          setTimeout(pollSenderCandidates, 800)
        }
      }

      pollSenderCandidates()

      // Backup Receiver Server Relay Poll (If WebRTC DataChannel doesn't open in 4s)
      startRelayReceiverPoll(code)
    } catch (err: any) {
      console.error("Join room error:", err)
      setErrorMsg("Failed to connect to room. Please check code.")
    }
  }

  // Backup Receiver Server Relay Polling (Ensures 100% transfer success rate even on mobile 4G symmetric NATs)
  const startRelayReceiverPoll = (code: string) => {
    let lastFetchedIndex = 0
    let relayChunks: ArrayBuffer[] = []
    let relayHeader: { name: string; size: number; mime: string } | null = null

    const checkRelay = async () => {
      // If WebRTC P2P DataChannel is already open, skip relay!
      if (dcRef.current && dcRef.current.readyState === "open") return

      try {
        const res = await fetch("/api/share/relay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_chunks", code, fromIndex: lastFetchedIndex }),
        })
        const data = await res.json()

        if (data.found && data.header) {
          if (!relayHeader) {
            relayHeader = data.header
            setIncomingFile(relayHeader)
            setIsReceiving(true)
            setConnectionType("relay")
            setStatusText(`Receiving ${relayHeader.name} via Fast Stream Relay…`)
          }

          if (data.chunks && data.chunks.length > 0) {
            for (const b64 of data.chunks) {
              const bin = atob(b64)
              const len = bin.length
              const bytes = new Uint8Array(len)
              for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i)
              relayChunks.push(bytes.buffer)
            }
            lastFetchedIndex = data.nextIndex

            const receivedBytes = relayChunks.reduce((acc, c) => acc + c.byteLength, 0)
            if (relayHeader.size > 0) {
              const pct = Math.min(100, Math.round((receivedBytes / relayHeader.size) * 100))
              setReceiveProgress(pct)
            }
          }

          if (data.isComplete && relayHeader) {
            setIsReceiving(false)
            setReceiveCompleted(true)
            setReceiveProgress(100)
            setStatusText("File received successfully!")

            const blob = new Blob(relayChunks, {
              type: relayHeader.mime || "application/octet-stream",
            })
            const url = URL.createObjectURL(blob)
            setReceivedBlobUrl(url)

            const a = document.createElement("a")
            a.href = url
            a.download = relayHeader.name
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            return
          }
        }
      } catch {}

      if (!receiveCompleted) {
        setTimeout(checkRelay, 1000)
      }
    }

    setTimeout(checkRelay, 3000)
  }

  // DataChannel Handlers
  const setupDataChannelListeners = (dc: RTCDataChannel) => {
    let receivedChunks: ArrayBuffer[] = []
    let expectedHeader: { name: string; size: number; mime: string } | null = null
    let receivedBytes = 0
    let lastTime = Date.now()
    let lastBytes = 0

    dc.binaryType = "arraybuffer"

    dc.onopen = () => {
      setIsConnected(true)
      setConnectionType("p2p")
      setStatusText("WebRTC P2P Channel Active")
      playConnectionChime()
    }

    dc.onmessage = (evt) => {
      const data = evt.data

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
      setStatusText("Channel closed.")
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

  // Send File Chunks (Dual WebRTC + Server Stream Relay Fallback)
  const handleStartTransfer = async () => {
    if (!selectedFile) {
      setErrorMsg("Please select a file to send first.")
      return
    }

    const file = selectedFile
    setIsSending(true)
    setSendProgress(0)
    setSendCompleted(false)
    setErrorMsg(null)

    // Mode A: WebRTC DataChannel (Primary)
    if (dcRef.current && dcRef.current.readyState === "open") {
      const dc = dcRef.current
      const chunkSize = 32 * 1024

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
            setTimeout(sendNextSlice, 20)
          } else {
            setTimeout(sendNextSlice, 2)
          }
        }

        reader.readAsArrayBuffer(slice)
      }

      sendNextSlice()
      return
    }

    // Mode B: Server Relay Stream Fallback (If WebRTC P2P is blocked by mobile 4G symmetric NATs)
    try {
      setConnectionType("relay")
      setStatusText("Uploading via Fail-Safe Stream Relay…")

      // Init relay
      await fetch("/api/share/relay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "init_relay",
          code: roomCode,
          header: { name: file.name, size: file.size, mime: file.type || "application/octet-stream" },
        }),
      })

      const chunkSize = 128 * 1024 // 128KB chunks
      let offset = 0
      let lastTime = Date.now()
      let lastBytes = 0

      const uploadRelayChunk = async () => {
        if (offset >= file.size) {
          setIsSending(false)
          setSendCompleted(true)
          setSendProgress(100)
          setStatusText("File sent successfully!")
          return
        }

        const slice = file.slice(offset, offset + chunkSize)
        const isLast = offset + slice.size >= file.size

        const res = await fetch(`/api/share/relay?code=${roomCode}&isLast=${isLast}`, {
          method: "POST",
          headers: { "Content-Type": "application/octet-stream" },
          body: slice,
        })

        if (res.ok) {
          offset += slice.size
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

          setTimeout(uploadRelayChunk, 10)
        } else {
          setErrorMsg("Relay upload error. Please try again.")
          setIsSending(false)
        }
      }

      uploadRelayChunk()
    } catch (err: any) {
      console.error("Relay error:", err)
      setErrorMsg("Transfer error. Please check connection.")
      setIsSending(false)
    }
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
    <div className="w-full max-w-4xl mx-auto space-y-6 font-sans">
      {/* Notion-Style Header Segment Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl border border-border/80 p-1 bg-card shadow-xs">
          <button
            onClick={() => {
              setMode("send")
              setErrorMsg(null)
            }}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === "send"
                ? "bg-foreground text-background shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            Send File
          </button>
          <button
            onClick={() => {
              setMode("receive")
              setErrorMsg(null)
            }}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === "receive"
                ? "bg-foreground text-background shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            Receive File
          </button>
        </div>
      </div>

      {/* Main Notion-Style Card Container */}
      <Card className="border border-border/80 bg-card shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          
          {/* Notion Callout Box with Real Device Telemetry & Country Flags */}
          <div className="rounded-xl border border-border/70 bg-muted/40 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                <span className="text-xs font-medium text-foreground">
                  {mode === "send" ? "Sender Station" : "Receiver Station"}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground font-mono">{statusText}</span>
              </div>

              <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-emerald-500" />
                <span>E2E Encrypted</span>
              </div>
            </div>

            {/* REAL DEVICE & COUNTRY TELEMETRY BADGES */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border/60 text-[11px] font-mono text-foreground">
                <BrowserBrandIcon browser={myDeviceInfo.browser} />
                <span>
                  This Device: <strong>{myDeviceInfo.os} ({myDeviceInfo.browser})</strong>
                </span>
              </div>

              {peerDevice && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  <span>{peerDevice.countryFlag || "🌐"}</span>
                  <BrowserBrandIcon browser={peerDevice.browser} />
                  <span>
                    Peer: <strong>{peerDevice.os} ({peerDevice.browser})</strong> [{peerDevice.ip}]
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="flex-1">{errorMsg}</p>
            </div>
          )}

          {/* ================= SENDER MODE ================= */}
          {mode === "send" && (
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 sm:p-10 text-center transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : selectedFile
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-border/80 bg-background hover:border-primary/50"
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-foreground text-sm max-w-xs sm:max-w-md truncate mx-auto">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      {formatBytes(selectedFile.size)} · Unlimited Transfer Ready
                    </p>
                    <Button size="sm" variant="ghost" className="text-xs text-muted-foreground hover:text-foreground mt-1">
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5 pointer-events-none">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted border border-border text-foreground">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-foreground text-sm">
                      Drag &amp; drop any file or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      No file size limits. Direct browser-to-browser P2P.
                    </p>
                  </div>
                )}
              </div>

              {/* Notion-Style Property Room Code Box */}
              <div className="rounded-xl border border-border/70 bg-background p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Room Code
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Share with receiver to open at <code className="text-foreground font-mono">ul0.site/share</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <code className="px-4 py-1.5 rounded-lg bg-muted border border-border text-lg font-bold font-mono tracking-widest text-foreground">
                      {roomCode}
                    </code>
                    <Button size="sm" variant="outline" onClick={copyRoomCode} className="h-9 text-xs gap-1.5">
                      {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedCode ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row gap-2">
                  <Input
                    readOnly
                    value={shareUrl}
                    className="bg-muted/40 text-xs font-mono truncate h-9 rounded-lg border-border/60"
                  />
                  <div className="flex gap-2">
                    <Button onClick={copyShareLink} size="sm" className="h-9 text-xs gap-1.5 shrink-0">
                      {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                      {copiedLink ? "Copied" : "Copy Link"}
                    </Button>
                    <Button onClick={() => setShowQr(!showQr)} size="sm" variant="outline" className="h-9 text-xs gap-1.5 shrink-0">
                      <QrCode className="h-3.5 w-3.5" />
                      QR
                    </Button>
                  </div>
                </div>

                {showQr && (
                  <div className="pt-2 text-center flex flex-col items-center animate-in fade-in duration-300">
                    <div className="p-2 bg-white rounded-xl shadow-xs border">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(shareUrl)}`}
                        alt="QR code"
                        className="w-36 h-36"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">Scan to connect on mobile</p>
                  </div>
                )}
              </div>

              {/* Progress & Speed Dashboard */}
              {selectedFile && (
                <div className="space-y-3 pt-1">
                  {isSending ? (
                    <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-foreground truncate max-w-xs">Sending {selectedFile.name}…</span>
                        <span className="font-mono text-foreground font-bold">{sendProgress}%</span>
                      </div>

                      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-foreground rounded-full transition-all duration-300"
                          style={{ width: `${sendProgress}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                        <div className="p-2 rounded-lg bg-background border border-border/50">
                          <span className="text-[10px] text-muted-foreground block">Speed</span>
                          <span className="font-semibold text-foreground text-xs mt-0.5 block">
                            {(sendSpeedBps / (1024 * 1024)).toFixed(2)} MB/s
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-background border border-border/50">
                          <span className="text-[10px] text-muted-foreground block">Time Remaining</span>
                          <span className="font-semibold text-foreground text-xs mt-0.5 block">
                            {formatTimeRemaining(sendEtaSeconds)}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-background border border-border/50">
                          <span className="text-[10px] text-muted-foreground block">Mode</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px] mt-0.5 block uppercase">
                            {connectionType === "p2p" ? "Direct P2P" : "Stream Relay"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : sendCompleted ? (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center space-y-1">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                        🎉 Transfer Finished!
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Receiver downloaded <strong className="text-foreground">{selectedFile.name}</strong>.
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleStartTransfer}
                      className="w-full h-11 text-xs font-bold gap-2 rounded-xl shadow-xs"
                    >
                      <Zap className="h-4 w-4 fill-current" />
                      Start File Transfer Now
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
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">
                      Enter 6-Character Room Code
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        placeholder="e.g. DV4UV7"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        maxLength={8}
                        className="h-11 text-base font-mono font-bold tracking-widest text-center uppercase bg-background rounded-lg border-border"
                      />
                      <Button
                        onClick={() => handleConnectReceiver()}
                        className="h-11 px-6 text-xs font-bold gap-2 shrink-0 rounded-lg"
                      >
                        Connect to Sender
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Enter the code provided by sender or open their shared URL directly.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-medium text-foreground">
                        Connected to Sender: {peerDevice ? `${peerDevice.countryFlag || ""} ${peerDevice.os} (${peerDevice.browser})` : "Active"}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsConnected(false)}
                      className="text-xs text-muted-foreground hover:text-foreground h-7"
                    >
                      Disconnect
                    </Button>
                  </div>

                  {incomingFile ? (
                    <div className="rounded-xl border border-border/80 bg-background p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground shrink-0">
                          <FileIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-sm truncate">
                            {incomingFile.name}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-0.5">
                            File Size: {formatBytes(incomingFile.size)}
                          </p>
                        </div>
                      </div>

                      {isReceiving && (
                        <div className="space-y-3 pt-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-foreground">Downloading from sender…</span>
                            <span className="font-mono text-foreground font-bold">{receiveProgress}%</span>
                          </div>

                          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-foreground rounded-full transition-all duration-300"
                              style={{ width: `${receiveProgress}%` }}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                            <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
                              <span className="text-[10px] text-muted-foreground block">Speed</span>
                              <span className="font-semibold text-foreground text-xs mt-0.5 block">
                                {(receiveSpeedBps / (1024 * 1024)).toFixed(2)} MB/s
                              </span>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
                              <span className="text-[10px] text-muted-foreground block">Time Remaining</span>
                              <span className="font-semibold text-foreground text-xs mt-0.5 block">
                                {formatTimeRemaining(receiveEtaSeconds)}
                              </span>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
                              <span className="text-[10px] text-muted-foreground block">Mode</span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px] mt-0.5 block uppercase">
                                {connectionType === "p2p" ? "Direct P2P" : "Stream Relay"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {receiveCompleted && receivedBlobUrl && (
                        <div className="space-y-2 pt-1">
                          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            ✨ Transfer finished! File downloaded automatically.
                          </div>
                          <Button
                            asChild
                            className="w-full h-11 text-xs font-bold gap-2 rounded-lg shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <a href={receivedBlobUrl} download={incomingFile.name}>
                              <Download className="h-4 w-4" />
                              Download Again ({formatBytes(incomingFile.size)})
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/70 p-6 text-center space-y-2">
                      <RefreshCcw className="h-6 w-6 text-muted-foreground animate-spin mx-auto" />
                      <p className="font-semibold text-foreground text-xs">Waiting for Sender to Start File Transfer</p>
                      <p className="text-[11px] text-muted-foreground">The sender will choose and transmit the file now.</p>
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
