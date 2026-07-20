"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Upload, Download, Copy, Check, Zap, Lock, FileIcon,
  QrCode, ArrowRight, Share2, AlertCircle, FileCheck,
  Globe, RefreshCcw, Wifi, MapPin, X, ChevronRight,
} from "lucide-react"

// ─── AUTHENTIC BROWSER SVG LOGOS ─────────────────────────────────────────────
function BraveLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <path d="M477.8 189.4l-22.4-52.8-31.2-72.4-15.2-35.6c-1.2-2.8-4.4-4-7.2-2.8L256 96 110.2 26c-2.8-1.2-6 0-7.2 2.8L87.8 64.6 56.6 137 34.2 189.4c-6 14-7.6 29.6-4.4 44.4l51.6 234c2.8 12.8 10 24.2 20.4 32l130 97.2c14.4 10.8 33.8 10.8 48.2 0l130-97.2c10.4-7.8 17.6-19.2 20.4-32l51.6-234c3.2-14.8 1.6-30.4-4.2-44.4z" fill="#FF5500"/>
      <path d="M361 219.2l-17.2-16.8c-3.2-3.2-7.6-4.8-12-4.4l-24 2-20.8-28.4c-4.4-6-11.4-9.6-18.8-9.6h-24.4c-7.4 0-14.4 3.6-18.8 9.6l-20.8 28.4-24-2c-4.4-.4-8.8 1.2-12 4.4l-17.2 16.8c-4 3.8-5.4 9.6-3.6 14.8l7.2 21.6-14.4 19.2c-3.6 4.8-4 11.2-.8 16.4l18 30.4c2.4 4 6.4 6.8 10.8 7.6l28.4 5.2 16 24c3.2 4.8 8.8 7.6 14.4 7.2l21.6-1.6 16.8 12.4c5.2 3.8 12.2 3.8 17.4 0l16.8-12.4 21.6 1.6c5.6.4 11.2-2.4 14.4-7.2l16-24 28.4-5.2c4.4-.8 8.4-3.6 10.8-7.6l18-30.4c3.2-5.2 2.8-11.6-.8-16.4l-14.4-19.2 7.2-21.6c1.8-5.2.4-11-3.6-14.8z" fill="white"/>
      <path d="M256 320a64 64 0 1 0 0-128 64 64 0 0 0 0 128z" fill="#FF5500"/>
    </svg>
  )
}

function ChromeLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#fff"/>
      <path d="M50 30 A20 20 0 0 1 67.3 40 L95 40 A48 48 0 0 0 5 40 L32.7 40 A20 20 0 0 1 50 30z" fill="#EA4335"/>
      <path d="M70 50 A20 20 0 0 1 52.7 70 L36.7 97.5 A48 48 0 0 0 98 54 L70 54z" fill="#FBBC05"/>
      <path d="M30 50 A20 20 0 0 1 47.3 70 L63.3 97.5 A48 48 0 0 1 2 54 L30 54z" fill="#34A853"/>
      <path d="M50 30 A20 20 0 1 0 50 70 A20 20 0 0 0 50 30z" fill="#4285F4"/>
      <circle cx="50" cy="50" r="13" fill="#fff"/>
    </svg>
  )
}

function SafariLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="saf-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1AA3FF"/>
          <stop offset="100%" stopColor="#006ED4"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#saf-bg)"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="3" opacity="0.4"/>
      <polygon points="50,20 57,50 50,80 43,50" fill="white" opacity="0.9"/>
      <polygon points="20,50 50,43 80,50 50,57" fill="white" opacity="0.6"/>
      <polygon points="50,30 55,50 50,70 45,50" fill="#FF3B30"/>
      <circle cx="50" cy="50" r="4" fill="white"/>
    </svg>
  )
}

function FirefoxLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#FF9500"/>
      <circle cx="50" cy="50" r="33" fill="#0060DF"/>
      <path d="M50 17 C30 17 14 33 14 53 C14 65 20 76 29 83 C25 76 23 68 23 59 C23 44 34 31 50 31 C62 31 72 39 75 51 C78 39 76 25 66 17 C61 17.3 55.5 17 50 17z" fill="#FF9500"/>
      <circle cx="50" cy="50" r="16" fill="#00B3F4"/>
    </svg>
  )
}

function EdgeLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="edge-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2F9BD8"/>
          <stop offset="100%" stopColor="#0078D4"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#edge-g1)"/>
      <path d="M50 20 C34 20 21 33 21 49 C21 59 26 67 35 73 C29 69 25 62 25 54 C25 38 38 25 54 25 C65 25 73 31 76 40 C78 32 75 20 66 14 C61 21 56 20 50 20z" fill="white" opacity="0.9"/>
      <ellipse cx="52" cy="72" rx="28" ry="10" fill="white" opacity="0.8"/>
      <path d="M24 56 C24 72 36 83 50 83 C62 83 72 76 77 65 C49 65 30 58 24 56z" fill="white"/>
    </svg>
  )
}

function OperaLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="#FF1B2D"/>
      <ellipse cx="50" cy="50" rx="21" ry="30" fill="white"/>
      <ellipse cx="50" cy="50" rx="14" ry="26" fill="#FF1B2D"/>
    </svg>
  )
}

function BrowserIcon({ browser, size = 18 }: { browser: string; size?: number }) {
  const b = browser.toLowerCase()
  if (b.includes("brave")) return <BraveLogo size={size} />
  if (b.includes("chrome")) return <ChromeLogo size={size} />
  if (b.includes("safari")) return <SafariLogo size={size} />
  if (b.includes("firefox")) return <FirefoxLogo size={size} />
  if (b.includes("edge") || b.includes("edg")) return <EdgeLogo size={size} />
  if (b.includes("opera")) return <OperaLogo size={size} />
  return <Globe width={size} height={size} className="text-gray-400" />
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = ""
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function formatBytes(bytes: number, dec = 1): string {
  if (bytes === 0) return "0 B"
  const k = 1024, sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dec))} ${sizes[i]}`
}

function formatETA(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return "calculating…"
  if (sec < 60) return `${Math.ceil(sec)}s left`
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60)
  if (m < 60) return `${m}m ${s}s left`
  return `${Math.floor(m / 60)}h ${m % 60}m left`
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function detectDevice() {
  if (typeof window === "undefined") return { os: "Unknown", browser: "Browser" }
  const ua = navigator.userAgent
  let os = "Desktop"
  if (/Android/.test(ua)) os = "Android"
  else if (/iPhone|iPad/.test(ua)) os = "iOS"
  else if (/Linux/.test(ua)) os = "Linux"
  else if (/Mac OS/.test(ua)) os = "macOS"
  else if (/Windows/.test(ua)) os = "Windows"

  let browser = "Browser"
  if ((navigator as any).brave || /Brave/.test(ua)) browser = "Brave"
  else if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = "Chrome"
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = "Safari"
  else if (/Firefox/.test(ua)) browser = "Firefox"
  else if (/Edg/.test(ua)) browser = "Edge"
  else if (/OPR|Opera/.test(ua)) browser = "Opera"

  return { os, browser }
}

// ─── AUDIO ───────────────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null

function ensureAudio() {
  try {
    if (!audioCtx) {
      const Cls = window.AudioContext || (window as any).webkitAudioContext
      if (Cls) audioCtx = new Cls()
    }
    if (audioCtx?.state === "suspended") audioCtx.resume()
  } catch {}
}

function playChime() {
  try {
    ensureAudio()
    if (!audioCtx) return
    const ctx = audioCtx
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, now + i * 0.1)
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.1 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.1)
      osc.stop(now + i * 0.1 + 0.3)
    })
  } catch {}
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface DeviceInfo { os: string; browser: string; ip: string; countryFlag?: string }
interface NearbyRoom { code: string; distance: number }

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function ShareClient() {
  const searchParams = useSearchParams()
  const urlCode = searchParams.get("code")

  const [mode, setMode] = useState<"send" | "receive">("send")
  const [roomCode, setRoomCode] = useState("")
  const [inputCode, setInputCode] = useState("")

  // Connection
  const [isConnected, setIsConnected] = useState(false)
  const [connType, setConnType] = useState<"p2p" | "relay">("p2p")
  const [status, setStatus] = useState("Waiting for peer…")
  const [error, setError] = useState<string | null>(null)
  const [myDevice, setMyDevice] = useState({ os: "Device", browser: "Browser" })
  const [peerDevice, setPeerDevice] = useState<DeviceInfo | null>(null)

  // Send
  const [file, setFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [sendPct, setSendPct] = useState(0)
  const [sendBps, setSendBps] = useState(0)
  const [sendEta, setSendEta] = useState(0)
  const [sendDone, setSendDone] = useState(false)

  // Receive
  const [incoming, setIncoming] = useState<{ name: string; size: number; mime: string } | null>(null)
  const [receiving, setReceiving] = useState(false)
  const [recvPct, setRecvPct] = useState(0)
  const [recvBps, setRecvBps] = useState(0)
  const [recvEta, setRecvEta] = useState(0)
  const [recvUrl, setRecvUrl] = useState<string | null>(null)
  const [recvDone, setRecvDone] = useState(false)

  // UI
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [drag, setDrag] = useState(false)
  const [connPulse, setConnPulse] = useState(false)

  // Nearby
  const [nearbyRooms, setNearbyRooms] = useState<NearbyRoom[]>([])
  const [nearbyLoading, setNearbyLoading] = useState(false)
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const pollRef = useRef<any>(null)
  const appliedIce = useRef<Set<string>>(new Set())

  // Unlock audio on first gesture
  useEffect(() => {
    const h = () => ensureAudio()
    window.addEventListener("click", h, { once: true })
    window.addEventListener("touchstart", h, { once: true })
    return () => { window.removeEventListener("click", h); window.removeEventListener("touchstart", h) }
  }, [])

  // Init
  useEffect(() => {
    setMyDevice(detectDevice())
    if (urlCode && urlCode.trim().length >= 4) {
      setMode("receive")
      setInputCode(urlCode.trim().toUpperCase())
    } else {
      setRoomCode(generateCode())
    }
    // Try get geolocation quietly
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude) },
        () => {}
      )
    }
  }, [urlCode])

  const createPC = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ],
    })
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setIsConnected(true)
        setConnType("p2p")
        setStatus("Direct P2P Connected ⚡")
        setConnPulse(true)
        playChime()
        setTimeout(() => setConnPulse(false), 3000)
      } else if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
        setIsConnected(false)
        setStatus("Connection lost")
      }
    }
    pcRef.current = pc
    return pc
  }, [])

  // SENDER: init offer + poll
  useEffect(() => {
    if (mode !== "send" || !roomCode) return
    let alive = true

    async function init() {
      const pc = createPC()
      const dc = pc.createDataChannel("ft", { ordered: true })
      dcRef.current = dc
      listenChannel(dc)

      pc.onicecandidate = (e) => {
        if (!e.candidate) return
        fetch("/api/share/signal", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add_ice", code: roomCode, role: "sender", candidate: e.candidate }),
        }).catch(() => {})
      }

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      await fetch("/api/share/signal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_room", code: roomCode, offer,
          deviceInfo: detectDevice(),
          lat: userLat, lng: userLng,
        }),
      })
      setStatus("Room ready. Waiting for receiver…")

      const poll = async () => {
        if (!alive) return
        try {
          const res = await fetch("/api/share/signal", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "poll", code: roomCode, role: "sender" }),
          })
          const d = await res.json()

          if (d.found && d.receiverDeviceInfo) {
            setPeerDevice(d.receiverDeviceInfo)
            if (!isConnected) {
              setIsConnected(true)
              setStatus(`Peer joined: ${d.receiverDeviceInfo.os} (${d.receiverDeviceInfo.browser})`)
              playChime()
            }
          }

          if (d.hasAnswer && pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(d.answer))
          }

          for (const c of (d.receiverCandidates || [])) {
            const k = JSON.stringify(c)
            if (!appliedIce.current.has(k)) {
              appliedIce.current.add(k)
              try { await pc.addIceCandidate(new RTCIceCandidate(c)) } catch {}
            }
          }
        } catch {}
        if (alive) pollRef.current = setTimeout(poll, 900)
      }
      poll()
    }

    init()
    return () => {
      alive = false
      clearTimeout(pollRef.current)
      pcRef.current?.close()
    }
  }, [mode, roomCode, userLat, userLng])

  // RECEIVER: join room
  const joinRoom = async (code = inputCode) => {
    const c = code.trim().toUpperCase()
    if (c.length < 4) { setError("Enter a valid 4–8 character room code."); return }
    setError(null)
    setStatus(`Connecting to ${c}…`)

    const res = await fetch("/api/share/signal", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join_room", code: c, deviceInfo: detectDevice() }),
    })
    const data = await res.json()
    if (!res.ok || !data.offer) {
      setError(data.error || "Room not found. Make sure sender has ul0.site/share open.")
      return
    }

    if (data.senderDeviceInfo) {
      setPeerDevice(data.senderDeviceInfo)
      setIsConnected(true)
      setStatus(`Connected to ${data.senderDeviceInfo.os} (${data.senderDeviceInfo.browser})`)
      playChime()
      setConnPulse(true)
      setTimeout(() => setConnPulse(false), 3000)
    }

    const pc = createPC()
    pc.ondatachannel = (e) => { dcRef.current = e.channel; listenChannel(e.channel) }
    pc.onicecandidate = (e) => {
      if (!e.candidate) return
      fetch("/api/share/signal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_ice", code: c, role: "receiver", candidate: e.candidate }),
      }).catch(() => {})
    }

    await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    await fetch("/api/share/signal", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join_room", code: c, answer, deviceInfo: detectDevice() }),
    })

    // Poll sender ICE candidates
    let alive = true
    const poll = async () => {
      if (!alive || pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") return
      try {
        const r = await fetch("/api/share/signal", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "poll", code: c, role: "receiver" }),
        })
        const d = await r.json()
        for (const cand of (d.senderCandidates || [])) {
          const k = JSON.stringify(cand)
          if (!appliedIce.current.has(k)) {
            appliedIce.current.add(k)
            try { await pc.addIceCandidate(new RTCIceCandidate(cand)) } catch {}
          }
        }
      } catch {}
      if (alive) setTimeout(poll, 900)
    }
    poll()

    // Relay fallback poll after 3s
    startRelayReceiverPoll(c, () => { alive = false })
  }

  // Relay receiver poll
  const startRelayReceiverPoll = (code: string, onDone?: () => void) => {
    let lastIdx = 0
    let relayChunks: ArrayBuffer[] = []
    let relayHeader: { name: string; size: number; mime: string } | null = null

    const check = async () => {
      if (dcRef.current?.readyState === "open") return
      try {
        const r = await fetch("/api/share/relay", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_chunks", code, fromIndex: lastIdx }),
        })
        const d = await r.json()
        if (d.found && d.header) {
          if (!relayHeader) {
            relayHeader = d.header
            setIncoming(relayHeader)
            setReceiving(true)
            setConnType("relay")
            setStatus(`Receiving via relay: ${relayHeader!.name}`)
          }
          for (const b64 of (d.chunks || [])) {
            const bin = atob(b64), arr = new Uint8Array(bin.length)
            for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
            relayChunks.push(arr.buffer)
          }
          lastIdx = d.nextIndex
          if (relayHeader) {
            const got = relayChunks.reduce((a, c) => a + c.byteLength, 0)
            setRecvPct(Math.min(100, Math.round(got / relayHeader.size * 100)))
          }
          if (d.isComplete && relayHeader) {
            setReceiving(false); setRecvDone(true); setRecvPct(100)
            setStatus("Transfer complete!")
            const blob = new Blob(relayChunks, { type: relayHeader.mime || "application/octet-stream" })
            const url = URL.createObjectURL(blob)
            setRecvUrl(url)
            const a = document.createElement("a"); a.href = url; a.download = relayHeader.name
            document.body.appendChild(a); a.click(); document.body.removeChild(a)
            onDone?.(); return
          }
        }
      } catch {}
      if (!recvDone) setTimeout(check, 1200)
    }
    setTimeout(check, 3000)
  }

  // DataChannel listeners
  const listenChannel = (dc: RTCDataChannel) => {
    let chunks: ArrayBuffer[] = [], header: { name: string; size: number; mime: string } | null = null
    let got = 0, lastT = Date.now(), lastB = 0
    dc.binaryType = "arraybuffer"

    dc.onopen = () => {
      setIsConnected(true); setConnType("p2p")
      setStatus("P2P Channel Open ⚡"); playChime()
      setConnPulse(true); setTimeout(() => setConnPulse(false), 3000)
    }
    dc.onmessage = (e) => {
      if (typeof e.data === "string") {
        try {
          const p = JSON.parse(e.data)
          if (p.type === "header") {
            header = { name: p.name, size: p.size, mime: p.mime }
            setIncoming(header); setReceiving(true); setRecvPct(0); setRecvDone(false)
            chunks = []; got = 0; lastT = Date.now(); lastB = 0
            setStatus(`Receiving ${p.name}…`)
          }
        } catch {}
        return
      }
      if (e.data instanceof ArrayBuffer) {
        chunks.push(e.data); got += e.data.byteLength
        if (header) {
          setRecvPct(Math.min(100, Math.round(got / header.size * 100)))
          const now = Date.now(), dt = (now - lastT) / 1000
          if (dt >= 0.5) {
            const bps = (got - lastB) / dt; setRecvBps(bps)
            setRecvEta(bps > 0 ? (header.size - got) / bps : 0)
            lastT = now; lastB = got
          }
          if (got >= header.size) {
            setReceiving(false); setRecvDone(true); setRecvPct(100); setStatus("Transfer complete! 🎉")
            const blob = new Blob(chunks, { type: header.mime || "application/octet-stream" })
            const url = URL.createObjectURL(blob); setRecvUrl(url)
            const a = document.createElement("a"); a.href = url; a.download = header.name
            document.body.appendChild(a); a.click(); document.body.removeChild(a)
          }
        }
      }
    }
    dc.onclose = () => { setIsConnected(false); setStatus("Channel closed") }
  }

  // Send file
  const startSend = async () => {
    if (!file) { setError("Pick a file first."); return }

    setSending(true); setSendPct(0); setSendDone(false); setError(null)

    // Primary: WebRTC
    if (dcRef.current?.readyState === "open") {
      const dc = dcRef.current, chunk = 64 * 1024
      dc.send(JSON.stringify({ type: "header", name: file.name, size: file.size, mime: file.type || "application/octet-stream" }))
      let off = 0, lastT = Date.now(), lastB = 0

      const next = () => {
        if (off >= file.size) { setSending(false); setSendDone(true); setSendPct(100); setStatus("Sent! 🎉"); return }
        const slice = file.slice(off, off + chunk)
        const reader = new FileReader()
        reader.onload = (ev) => {
          if (!(ev.target?.result instanceof ArrayBuffer)) return
          dc.send(ev.target.result); off += ev.target.result.byteLength
          setSendPct(Math.min(100, Math.round(off / file.size * 100)))
          const now = Date.now(), dt = (now - lastT) / 1000
          if (dt >= 0.5) {
            const bps = (off - lastB) / dt; setSendBps(bps)
            setSendEta(bps > 0 ? (file.size - off) / bps : 0); lastT = now; lastB = off
          }
          setTimeout(next, dc.bufferedAmount > 512 * 1024 ? 25 : 2)
        }
        reader.readAsArrayBuffer(slice)
      }
      next(); return
    }

    // Fallback: Relay
    setConnType("relay"); setStatus("Uploading via server relay…")
    await fetch("/api/share/relay", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "init_relay", code: roomCode, header: { name: file.name, size: file.size, mime: file.type || "application/octet-stream" } }),
    })

    let off = 0, lastT = Date.now(), lastB = 0
    const chunk = 64 * 1024

    const upload = async () => {
      if (off >= file.size) { setSending(false); setSendDone(true); setSendPct(100); setStatus("Sent via relay! 🎉"); return }
      const slice = file.slice(off, off + chunk)
      const reader = new FileReader()
      reader.onload = async (ev) => {
        if (!(ev.target?.result instanceof ArrayBuffer)) return
        const b64 = arrayBufferToBase64(ev.target.result)
        const isLast = off + slice.size >= file.size
        try {
          const r = await fetch("/api/share/relay", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "upload_chunk", code: roomCode, header: { name: file.name, size: file.size, mime: file.type || "application/octet-stream" }, chunk: b64, isLast }),
          })
          if (r.ok) {
            off += slice.size
            setSendPct(Math.min(100, Math.round(off / file.size * 100)))
            const now = Date.now(), dt = (now - lastT) / 1000
            if (dt >= 0.5) {
              const bps = (off - lastB) / dt; setSendBps(bps)
              setSendEta(bps > 0 ? (file.size - off) / bps : 0); lastT = now; lastB = off
            }
            setTimeout(upload, 10)
          } else { setError("Relay upload failed. Retrying…"); setTimeout(upload, 800) }
        } catch { setError("Network issue. Retrying…"); setTimeout(upload, 800) }
      }
      reader.readAsArrayBuffer(slice)
    }
    upload()
  }

  // Nearby rooms discovery
  const discoverNearby = async () => {
    if (!userLat || !userLng) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude) },
        () => setError("Location permission denied. Enable to use Nearby Share.")
      )
      return
    }
    setNearbyLoading(true)
    try {
      const r = await fetch("/api/share/signal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "nearby", lat: userLat, lng: userLng }),
      })
      const d = await r.json()
      setNearbyRooms(d.nearby || [])
    } catch {}
    setNearbyLoading(false)
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/share?code=${roomCode}` : ""

  const copyCode = () => { navigator.clipboard?.writeText(roomCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const copyUrl = () => { navigator.clipboard?.writeText(shareUrl); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000) }

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">

      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div
          className="inline-flex rounded-full p-1 gap-1"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {(["send", "receive"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null) }}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200"
              style={mode === m
                ? { background: "white", color: "#0a0a0f", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }
                : { color: "rgba(255,255,255,0.5)" }
              }
            >
              {m === "send" ? <Upload className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
              {m === "send" ? "Send" : "Receive"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Card Header: Device Telemetry */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: isConnected ? "#22c55e" : "#f59e0b",
                boxShadow: isConnected ? "0 0 8px #22c55e" : "0 0 8px #f59e0b",
              }}
            />
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{status}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* My device badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              <BrowserIcon browser={myDevice.browser} size={13} />
              <span>{myDevice.os} · {myDevice.browser}</span>
            </div>

            {/* Peer device badge */}
            {peerDevice && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono"
                style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac" }}
              >
                <span>{peerDevice.countryFlag || "🌐"}</span>
                <BrowserIcon browser={peerDevice.browser} size={13} />
                <span>{peerDevice.os} · {peerDevice.browser}</span>
                {peerDevice.ip && <span style={{ opacity: 0.6 }}>[{peerDevice.ip}]</span>}
              </div>
            )}

            <div className="flex items-center gap-1 text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
              <Lock className="h-3 w-3 text-green-500" />
              <span>E2EE</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mx-6 mt-4 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)}><X className="h-4 w-4 opacity-60 hover:opacity-100" /></button>
          </div>
        )}

        <div className="p-6 space-y-5">

          {/* ══ SEND MODE ══════════════════════════════════════════════════ */}
          {mode === "send" && (
            <div className="space-y-5">

              {/* Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]) }}
                className="relative flex flex-col items-center justify-center rounded-2xl p-8 text-center cursor-pointer transition-all duration-300"
                style={{
                  border: `2px dashed ${drag ? "rgba(99,102,241,0.8)" : file ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.15)"}`,
                  background: drag
                    ? "rgba(99,102,241,0.08)"
                    : file
                    ? "rgba(34,197,94,0.05)"
                    : "rgba(255,255,255,0.02)",
                }}
              >
                <input type="file" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer" />
                {file ? (
                  <div className="space-y-2">
                    <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}>
                      <FileCheck className="h-7 w-7 text-green-400" />
                    </div>
                    <p className="font-bold text-white text-sm max-w-xs truncate mx-auto">{file.name}</p>
                    <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{formatBytes(file.size)}</p>
                    <button className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>change file</button>
                  </div>
                ) : (
                  <div className="space-y-3 pointer-events-none">
                    <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <Upload className="h-6 w-6" style={{ color: "rgba(255,255,255,0.4)" }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">Drop any file here</p>
                      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>or click to browse · no size limit</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Room Code Display */}
              <div className="rounded-2xl p-4 space-y-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.35)" }}>Room Code</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Share at <code className="text-white/40">ul0.site/share</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Large glowing room code */}
                    <div
                      className="px-4 py-2 rounded-xl"
                      style={{
                        background: "rgba(99,102,241,0.15)",
                        border: "1px solid rgba(99,102,241,0.4)",
                        boxShadow: "0 0 20px rgba(99,102,241,0.15)",
                      }}
                    >
                      <span className="text-xl font-black font-mono tracking-[0.2em] text-indigo-300">
                        {roomCode}
                      </span>
                    </div>
                    <button
                      onClick={copyCode}
                      className="h-9 w-9 rounded-xl flex items-center justify-center transition-all"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-white/50" />}
                    </button>
                  </div>
                </div>

                {/* Share link row */}
                <div className="flex gap-2">
                  <input readOnly value={shareUrl}
                    className="flex-1 bg-transparent rounded-xl px-3 py-2 text-xs font-mono truncate outline-none"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
                  />
                  <button onClick={copyUrl}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: copiedLink ? "rgba(34,197,94,0.2)" : "rgba(99,102,241,0.2)", border: `1px solid ${copiedLink ? "rgba(34,197,94,0.4)" : "rgba(99,102,241,0.4)"}`, color: copiedLink ? "#86efac" : "#a5b4fc" }}
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                    {copiedLink ? "Copied" : "Copy Link"}
                  </button>
                  <button onClick={() => setShowQr(!showQr)}
                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
                  >
                    <QrCode className="h-4 w-4" />
                  </button>
                </div>

                {showQr && (
                  <div className="flex justify-center pt-1">
                    <div className="p-3 bg-white rounded-2xl shadow-lg">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(shareUrl)}`}
                        alt="QR" className="w-32 h-32" />
                    </div>
                  </div>
                )}
              </div>

              {/* Transfer Button / Progress */}
              {file && !sendDone && !sending && (
                <button
                  onClick={startSend}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{
                    background: isConnected
                      ? "linear-gradient(135deg, #6366f1, #818cf8)"
                      : "rgba(255,255,255,0.06)",
                    color: isConnected ? "white" : "rgba(255,255,255,0.3)",
                    boxShadow: isConnected ? "0 8px 24px rgba(99,102,241,0.4)" : "none",
                    border: isConnected ? "none" : "1px solid rgba(255,255,255,0.08)",
                    cursor: isConnected ? "pointer" : "default",
                  }}
                >
                  <Zap className="h-4 w-4" />
                  {isConnected ? "Start Transfer" : "Waiting for receiver to connect…"}
                </button>
              )}

              {/* Progress bar */}
              {(sending || sendDone) && (
                <div className="rounded-2xl p-4 space-y-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white/60 truncate max-w-[200px]">{file?.name}</span>
                    <span className="font-bold text-white">{sendPct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${sendPct}%`,
                        background: sendDone
                          ? "linear-gradient(90deg, #22c55e, #86efac)"
                          : "linear-gradient(90deg, #6366f1, #818cf8)",
                      }} />
                  </div>
                  {!sendDone && (
                    <div className="flex gap-3 text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>{(sendBps / 1048576).toFixed(2)} MB/s</span>
                      <span>·</span>
                      <span>{formatETA(sendEta)}</span>
                      <span>·</span>
                      <span className="uppercase">{connType === "p2p" ? "⚡ Direct P2P" : "☁ Relay"}</span>
                    </div>
                  )}
                  {sendDone && (
                    <p className="text-xs text-green-400 font-semibold text-center">🎉 File sent successfully!</p>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ══ RECEIVE MODE ═══════════════════════════════════════════════ */}
          {mode === "receive" && (
            <div className="space-y-5">
              {!isConnected ? (
                <div className="space-y-4">
                  {/* Code Input */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.35)" }}>
                      Enter Room Code
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        placeholder="e.g. A3BX7K"
                        maxLength={8}
                        onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                        className="flex-1 text-center text-xl font-black font-mono tracking-[0.2em] uppercase rounded-2xl py-3 outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "white",
                          letterSpacing: "0.2em",
                        }}
                      />
                      <button
                        onClick={() => joinRoom()}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
                        style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "white", boxShadow: "0 8px 24px rgba(99,102,241,0.4)" }}
                      >
                        Connect
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
                      or open the sender's shared link directly
                    </p>
                  </div>

                  {/* Nearby Share */}
                  <div className="rounded-2xl p-4 space-y-3"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: "rgba(99,102,241,0.8)" }} />
                        <span className="text-xs font-semibold text-white/60">Nearby Share</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                          style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                          within 50km
                        </span>
                      </div>
                      <button
                        onClick={discoverNearby}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}
                      >
                        {nearbyLoading
                          ? <RefreshCcw className="h-3 w-3 animate-spin" />
                          : <Wifi className="h-3 w-3" />}
                        {nearbyLoading ? "Scanning…" : "Discover"}
                      </button>
                    </div>

                    {nearbyRooms.length > 0 ? (
                      <div className="space-y-2">
                        {nearbyRooms.map((r) => (
                          <button key={r.code} onClick={() => { setInputCode(r.code); joinRoom(r.code) }}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all hover:scale-[1.01]"
                            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "white" }}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-indigo-400" />
                              <span className="font-mono font-bold tracking-wider text-indigo-300">{r.code}</span>
                            </div>
                            <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                              <span>{r.distance} km away</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
                        Click Discover to find nearby senders (uses your location)
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Connected Badge */}
                  <div className="flex items-center justify-between rounded-2xl px-4 py-3"
                    style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"
                        style={{ boxShadow: "0 0 8px #22c55e" }} />
                      <span className="text-xs font-semibold text-green-300">
                        {peerDevice
                          ? `${peerDevice.countryFlag || ""} ${peerDevice.os} (${peerDevice.browser})`
                          : "Sender connected"}
                      </span>
                    </div>
                    <button onClick={() => setIsConnected(false)}
                      className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
                      disconnect
                    </button>
                  </div>

                  {/* Incoming file */}
                  {incoming ? (
                    <div className="rounded-2xl p-4 space-y-4"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <FileIcon className="h-5 w-5 text-white/60" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate">{incoming.name}</p>
                          <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {formatBytes(incoming.size)}
                          </p>
                        </div>
                      </div>

                      {(receiving || recvDone) && (
                        <>
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span style={{ color: "rgba(255,255,255,0.4)" }}>
                              {recvDone ? "Complete" : "Receiving…"}
                            </span>
                            <span className="font-bold text-white">{recvPct}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                            <div className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${recvPct}%`,
                                background: recvDone
                                  ? "linear-gradient(90deg, #22c55e, #86efac)"
                                  : "linear-gradient(90deg, #6366f1, #818cf8)",
                              }} />
                          </div>
                          {receiving && (
                            <div className="flex gap-3 text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                              <span>{(recvBps / 1048576).toFixed(2)} MB/s</span>
                              <span>·</span>
                              <span>{formatETA(recvEta)}</span>
                              <span>·</span>
                              <span className="uppercase">{connType === "p2p" ? "⚡ Direct P2P" : "☁ Relay"}</span>
                            </div>
                          )}
                        </>
                      )}

                      {recvDone && recvUrl && (
                        <a href={recvUrl} download={incoming.name}
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
                          style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}
                        >
                          <Download className="h-4 w-4" />
                          Download Again
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl p-6 text-center space-y-3"
                      style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                      <RefreshCcw className="h-6 w-6 animate-spin mx-auto" style={{ color: "rgba(255,255,255,0.3)" }} />
                      <p className="text-xs font-semibold text-white/50">Waiting for sender to start transfer…</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
