"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import {
  Upload, Download, Copy, Check, Zap, Lock,
  FileIcon, QrCode, ArrowRight, Share2, AlertCircle,
  FileCheck, Globe, RefreshCcw, X,
} from "lucide-react"

// ─── REAL BROWSER SVGs (from browser icons.txt) ──────────────────────────────
function BraveIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15.68 0l2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633-1.38.972-3.884 2.66-4.293 2.916-.409.256-.92.692-1.38.692-.46 0-.97-.436-1.38-.692a185.796 185.796 0 01-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633-.247-.975-2.351-8.955-2.351-8.955l.715-2.047-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36zm-3.679 14.936c-.14 0-1.038.317-1.758.69-.72.373-1.242.637-1.409.742-.167.104-.065.301.087.409.152.107 2.194 1.69 2.393 1.866.198.175.489.464.687.464.198 0 .49-.29.688-.464.198-.175 2.24-1.759 2.392-1.866.152-.108.254-.305.087-.41-.167-.104-.689-.368-1.41-.741-.72-.373-1.617-.69-1.757-.69zm0-11.278s-.409.001-1.022.206-1.278.46-1.584.46c-.307 0-2.581-.434-2.581-.434S4.119 7.152 4.119 7.849c0 .697.339.881.68 1.243l2.02 2.149c.192.203.59.511.356 1.066-.235.555-.58 1.26-.196 1.977.384.716 1.042 1.194 1.464 1.115.421-.08 1.412-.598 1.776-.834.364-.237 1.518-1.19 1.518-1.554 0-.365-1.193-1.02-1.413-1.168-.22-.15-1.226-.725-1.247-.95-.02-.227-.012-.293.284-.851.297-.559.831-1.304.742-1.8-.089-.495-.95-.753-1.565-.986-.615-.232-1.799-.671-1.947-.74-.148-.068-.11-.133.339-.175.448-.043 1.719-.212 2.292-.052.573.16 1.552.403 1.632.532.079.13.149.134.067.579-.081.445-.5 2.581-.541 2.96-.04.38-.12.63.288.724.409.094 1.097.256 1.333.256s.924-.162 1.333-.256c.408-.093.329-.344.288-.723-.04-.38-.46-2.516-.541-2.961-.082-.445-.012-.45.067-.579.08-.129 1.059-.372 1.632-.532.573-.16 1.845.009 2.292.052.449.042.487.107.339.175-.148.069-1.332.508-1.947.74-.615.233-1.476.49-1.565.986-.09.496.445 1.241.742 1.8.297.558.304.624.284.85-.02.226-1.026.802-1.247.95-.22.15-1.413.804-1.413 1.169 0 .364 1.154 1.317 1.518 1.554.364.236 1.355.755 1.776.834.422.079 1.08-.4 1.464-1.115.384-.716.039-1.422-.195-1.977-.235-.555.163-.863.355-1.066l2.02-2.149c.341-.362.68-.546.68-1.243 0-.697-2.695-3.96-2.695-3.96s-2.274.436-2.58.436c-.307 0-.972-.256-1.585-.461-.613-.205-1.022-.206-1.022-.206z" fill="#FB542B"/>
    </svg>
  )
}

function ChromeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path fill="#00ac47" d="M4.7434,22.505A12.9769,12.9769,0,0,0,14.88,28.949l5.8848-10.1927L16,16.0058,11.2385,18.755l-1.5875-2.75L8.4885,13.9919,5.3553,8.5649A12.9894,12.9894,0,0,0,4.7434,22.505Z"/>
      <path fill="#ea4435" d="M16,3.0072A12.9769,12.9769,0,0,0,5.3507,8.5636l5.8848,10.1927L16,16.0057V10.5072H27.766A12.99,12.99,0,0,0,16,3.0072Z"/>
      <path fill="#ffba00" d="M27.2557,22.505a12.9772,12.9772,0,0,0,.5124-12H15.9986v5.5011l4.7619,2.7492-1.5875,2.75-1.1625,2.0135-3.1333,5.4269A12.99,12.99,0,0,0,27.2557,22.505Z"/>
      <circle cx="15.999" cy="16.007" r="5.5" fill="#fff"/>
      <circle cx="15.999" cy="16.007" r="4.25" fill="#4285f4"/>
    </svg>
  )
}

function EdgeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#fff" rx="15%"/>
      <radialGradient id="eg1" cx=".6" cy=".5"><stop offset=".8" stopColor="#148"/><stop offset="1" stopColor="#137"/></radialGradient>
      <radialGradient id="eg2" cx=".5" cy=".6" fx=".2" fy=".6"><stop offset=".8" stopColor="#38c"/><stop offset="1" stopColor="#269"/></radialGradient>
      <linearGradient id="eg3" y1=".5" y2="1"><stop offset=".1" stopColor="#5ad"/><stop offset=".6" stopColor="#5c8"/><stop offset=".8" stopColor="#7d5"/></linearGradient>
      <path fill="url(#eg1)" d="M439 374c-50 77-131 98-163 96-191-9-162-262-47-261-82 52 30 224 195 157 17-12 20 3 15 8"/>
      <path fill="url(#eg2)" d="M311 255c18-82-31-135-129-135S38 212 38 259c0 124 125 253 287 203-134 39-214-116-146-210 46-66 123-68 132 3"/>
      <path fill="url(#eg3)" d="M39 253C51-15 419-30 472 202c14 107-86 149-166 115-42-26 26-20-3-99-48-112-251-103-264 35"/>
    </svg>
  )
}

function SafariIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#EEE"/>
      <radialGradient id="sg1" cx="3.946" cy="916.391" r=".006" gradientTransform="matrix(2240.2344 0 0 -2240.2344 -8827.055 2052939.25)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2abce1"/>
        <stop offset=".114" stopColor="#2abbe1"/>
        <stop offset="1" stopColor="#3375f8"/>
      </radialGradient>
      <circle cx="12" cy="12" r="11.1" fill="url(#sg1)"/>
      <path fill="#CD151E" d="m19.584 4.416-8.85 6.291 2.625 2.606 6.225-8.897z"/>
      <path fill="#FA5153" d="m10.744 10.688 1.322 1.303 7.519-7.575-8.841 6.272z"/>
      <path fill="#ACACAC" d="m10.744 10.688 2.625 2.606-8.85 6.291 6.225-8.897z"/>
      <path fill="#EEE" d="m4.519 19.584 7.547-7.594-1.322-1.303-6.225 8.897z"/>
    </svg>
  )
}

function FirefoxIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#fff" rx="15%"/>
      <linearGradient id="ff1" x1=".7" x2=".3" y2=".8"><stop offset=".3" stopColor="#fd5"/><stop offset=".6" stopColor="#f85"/><stop offset="1" stopColor="#d06"/></linearGradient>
      <radialGradient id="ff2" cx=".4" cy=".7"><stop offset=".4" stopColor="#74d"/><stop offset="1" stopColor="#a2d"/></radialGradient>
      <linearGradient id="ff3" x1=".8" x2=".4" y1=".2" y2=".8"><stop offset=".2" stopColor="#fd5"/><stop offset="1" stopColor="#f33"/></linearGradient>
      <g transform="scale(4)">
        <path fill="url(#ff1)" d="M48 49s-3-9-1-16c-9 2-33 35-33 35a51 48 0 1087-32s5 9 5 15c-3-9-20-25-26-37-24 13-16 39-16 39"/>
        <circle cx="64" cy="67" r="26" fill="url(#ff2)"/>
        <path fill="url(#ff1)" d="M21 45l43 12c-6 11-16 3-23 14a22 22 0 1034-20s33 3 17 42H28"/>
        <path fill="url(#ff3)" d="M35 43c16 0 12 7 29 14-18 6-23-9-38 0 5 9 12 8 12 8 1 43 72 29 67-17a50 46.6 47 01-88 33c-9-18-1-40 16-51"/>
      </g>
    </svg>
  )
}

function AndroidIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256">
      <rect width="224" height="224" x="16" y="16" fill="#EEE" rx="70"/>
      <path fill="#3DDC84" d="M163.935 111.433L176.14 90.278c.336-.584.427-1.277.253-1.928a2.635 2.635 0 00-1.182-1.544 2.635 2.635 0 00-1.927-.231 2.635 2.635 0 00-1.542 1.163L159.385 109.16C149.933 104.844 139.32 102.44 127.995 102.44c-11.325 0-21.94 2.405-31.39 6.72L84.248 87.737a2.635 2.635 0 00-1.542-1.163 2.635 2.635 0 00-1.927.231 2.635 2.635 0 00-1.183 1.544 2.635 2.635 0 00.253 1.928L92.055 111.433C71.097 122.84 56.763 144.075 54.666 169.162H201.324c-2.099-25.087-16.433-46.32-37.389-57.73zM161.689 148.374a6.17 6.17 0 01-6.054-6.17 6.17 6.17 0 016.054-6.166 6.17 6.17 0 016.054 6.167 6.17 6.17 0 01-6.054 6.17zm-67.388 0a6.17 6.17 0 01-6.054-6.17 6.17 6.17 0 016.054-6.166 6.17 6.17 0 016.054 6.167 6.17 6.17 0 01-6.054 6.17z"/>
    </svg>
  )
}

function AppleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path d="M30.54 26.24a14 14 0 0 1-1.41 2.52 13.16 13.16 0 0 1-1.8 2.24A3.55 3.55 0 0 1 25 32a5.94 5.94 0 0 1-2.15-.51 6.13 6.13 0 0 0-2.31-.49 6.42 6.42 0 0 0-2.38.51 6.49 6.49 0 0 1-2.05.54A3.35 3.35 0 0 1 13.73 31a14 14 0 0 1-1.89-2.27 15.54 15.54 0 0 1-2-4A14.55 14.55 0 0 1 9 20a8.6 8.6 0 0 1 1.14-4.52A6.6 6.6 0 0 1 12.51 13a6.44 6.44 0 0 1 3.22-.91 7.7 7.7 0 0 1 2.49.58 7.67 7.67 0 0 0 2 .58 12 12 0 0 0 2.19-.68 7.23 7.23 0 0 1 3-.53 6.34 6.34 0 0 1 4.95 2.61 5.48 5.48 0 0 0-2.92 5 5.52 5.52 0 0 0 1.81 4.16A6.18 6.18 0 0 0 31 25c-.15.42-.3.82-.46 1.21ZM25.5 6.4a5.59 5.59 0 0 1-1.43 3.66 4.85 4.85 0 0 1-4 2 3.79 3.79 0 0 1 0-.49 5.7 5.7 0 0 1 1.51-3.69 5.85 5.85 0 0 1 1.85-1.39 5.65 5.65 0 0 1 2.11-.6 4.67 4.67 0 0 1 0 .52Z" fill="#1d1d1f"/>
    </svg>
  )
}

function WindowsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 257">
      <path fill="#00ADEF" d="M0 36.357L104.62 22.11l.045 100.914-104.57.595L0 36.358zm104.57 98.293l.08 101.002L.081 221.275l-.006-87.302 104.494.677zm12.682-114.405L255.968 0v121.74l-138.716 1.1V20.246zM256 135.6l-.033 121.191-138.716-19.578-.194-101.84L256 135.6z"/>
    </svg>
  )
}

function LinuxIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128">
      <path d="M108.095 81.343c-1.534 6.324-9.322 19.527-13.459 25.338-4.138 5.835-3.626 11.089-11.275 9.043-7.625-2.045-9.763-1.673-17.644-1.208-7.833.464-6.137-.233-11.042 1.976-4.882 2.208-21.27-26.78-22.595-32.173-1.301-5.393-1.93-4.743 1.464-10.577 3.395-5.834 3.883-11.6 8.368-18.667 4.487-7.09 9.671-10.693 9.299-16.109-1.464-20.108-2.626-30.15 6.301-34.8 8.507-4.417 15.621-1.79 18.434-.279 1.208.651 3.673 1.906 5.509 4.115 1.836 2.162 3.487 5.44 4.417 9.577 1.906 8.299-.791 5.556 1.371 15.064 2.139 9.484 6.485 14.133 11.787 21.642 5.299 7.508 10.832 19.898 9.065 27.058z" fill="#000"/>
    </svg>
  )
}

function BrowserIcon({ browser, os, size = 16 }: { browser: string; os?: string; size?: number }) {
  const b = (browser || "").toLowerCase()
  const o = (os || "").toLowerCase()
  if (b.includes("brave")) return <BraveIcon size={size} />
  if (b.includes("firefox")) return <FirefoxIcon size={size} />
  if (b.includes("edge") || b.includes("edg")) return <EdgeIcon size={size} />
  if (b.includes("chrome")) return <ChromeIcon size={size} />
  if (b.includes("safari")) return <SafariIcon size={size} />
  if (o.includes("android")) return <AndroidIcon size={size} />
  if (o.includes("ios") || o.includes("macos")) return <AppleIcon size={size} />
  if (o.includes("windows")) return <WindowsIcon size={size} />
  if (o.includes("linux")) return <LinuxIcon size={size} />
  return <Globe width={size} height={size} style={{ color: "#94a3b8" }} />
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let bin = ""
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024, sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatETA(sec: number): string {
  if (!isFinite(sec) || sec <= 0 || sec > 86400) return "calculating…"
  if (sec < 60) return `${Math.ceil(sec)}s left`
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60)
  return m < 60 ? `${m}m ${s}s left` : `${Math.floor(m / 60)}h ${m % 60}m left`
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
  else if (/Mac OS/.test(ua)) os = "macOS"
  else if (/Linux/.test(ua)) os = "Linux"
  else if (/Windows/.test(ua)) os = "Windows"
  let browser = "Browser"
  if ((navigator as any).brave) browser = "Brave"
  else if (/Edg/.test(ua)) browser = "Edge"
  else if (/Chrome/.test(ua)) browser = "Chrome"
  else if (/Firefox/.test(ua)) browser = "Firefox"
  else if (/Safari/.test(ua)) browser = "Safari"
  return { os, browser }
}

// ─── AUDIO — play ONCE on connect ─────────────────────────────────────────────
let audioCtx: AudioContext | null = null
let chimePlayed = false

function ensureAudio() {
  try {
    if (!audioCtx) {
      const Cls = window.AudioContext || (window as any).webkitAudioContext
      if (Cls) audioCtx = new Cls()
    }
    if (audioCtx?.state === "suspended") audioCtx.resume()
  } catch {}
}

function playConnectChime() {
  if (chimePlayed) return
  chimePlayed = true
  try {
    ensureAudio()
    if (!audioCtx) return
    const ctx = audioCtx
    const now = ctx.currentTime
    ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"; osc.frequency.value = freq
      gain.gain.setValueAtTime(0, now + i * 0.1)
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.35)
    })
  } catch {}
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface DeviceInfo { os: string; browser: string; ip?: string; countryFlag?: string }

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export function ShareClient() {
  const searchParams = useSearchParams()
  const urlCode = searchParams.get("code")

  const [mode, setMode] = useState<"send" | "receive">("send")
  const [roomCode, setRoomCode] = useState("")
  const [inputCode, setInputCode] = useState("")

  const [isConnected, setIsConnected] = useState(false)
  const [status, setStatus] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [myDevice] = useState(detectDevice)
  const [peerDevice, setPeerDevice] = useState<DeviceInfo | null>(null)

  // Send
  const [file, setFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [sendPct, setSendPct] = useState(0)
  const [sendBps, setSendBps] = useState(0)
  const [sendEta, setSendEta] = useState(0)
  const [sendDone, setSendDone] = useState(false)
  const [drag, setDrag] = useState(false)

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

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const pollRef = useRef<any>(null)
  const appliedIce = useRef<Set<string>>(new Set())
  const connectedRef = useRef(false)

  useEffect(() => {
    const h = () => ensureAudio()
    window.addEventListener("click", h, { once: true })
    window.addEventListener("touchstart", h, { once: true })
    return () => { window.removeEventListener("click", h); window.removeEventListener("touchstart", h) }
  }, [])

  useEffect(() => {
    if (urlCode?.trim()) {
      setMode("receive")
      setInputCode(urlCode.trim().toUpperCase())
    } else {
      setRoomCode(generateCode())
    }
  }, [urlCode])

  const markConnected = useCallback((peer?: DeviceInfo) => {
    if (connectedRef.current) return
    connectedRef.current = true
    setIsConnected(true)
    if (peer) setPeerDevice(peer)
    playConnectChime()
    setStatus("Connected")
  }, [])

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
      if ((pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") && !connectedRef.current) {
        markConnected()
        setStatus("Direct P2P ⚡")
      }
    }
    pcRef.current = pc
    return pc
  }, [markConnected])

  // Listen on DataChannel
  const listenChannel = useCallback((dc: RTCDataChannel) => {
    let chunks: ArrayBuffer[] = [], header: { name: string; size: number; mime: string } | null = null
    let got = 0, lastT = Date.now(), lastB = 0
    dc.binaryType = "arraybuffer"

    dc.onopen = () => { markConnected(); setStatus("P2P Ready ⚡") }

    dc.onmessage = (e) => {
      if (typeof e.data === "string") {
        try {
          const p = JSON.parse(e.data)
          if (p.type === "header") {
            header = { name: p.name, size: p.size, mime: p.mime }
            setIncoming(header); setReceiving(true); setRecvPct(0); setRecvDone(false); setRecvUrl(null)
            chunks = []; got = 0; lastT = Date.now(); lastB = 0
            setStatus(`Receiving ${p.name}`)
          }
        } catch {}
        return
      }
      if (e.data instanceof ArrayBuffer && header) {
        chunks.push(e.data); got += e.data.byteLength
        setRecvPct(Math.min(100, Math.round((got / header.size) * 100)))
        const now = Date.now(), dt = (now - lastT) / 1000
        if (dt >= 0.5) {
          const bps = (got - lastB) / dt; setRecvBps(bps)
          setRecvEta(bps > 0 ? (header.size - got) / bps : 0); lastT = now; lastB = got
        }
        if (got >= header.size) {
          setReceiving(false); setRecvDone(true); setRecvPct(100); setStatus("Transfer complete ✓")
          const blob = new Blob(chunks, { type: header.mime || "application/octet-stream" })
          const url = URL.createObjectURL(blob); setRecvUrl(url)
          const a = document.createElement("a"); a.href = url; a.download = header.name
          document.body.appendChild(a); a.click(); document.body.removeChild(a)
        }
      }
    }
    dc.onclose = () => { setStatus("Disconnected") }
    dcRef.current = dc
  }, [markConnected])

  // SENDER init
  useEffect(() => {
    if (mode !== "send" || !roomCode) return
    let alive = true
    connectedRef.current = false; chimePlayed = false

    async function init() {
      const pc = createPC()
      const dc = pc.createDataChannel("ft", { ordered: true })
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
        body: JSON.stringify({ action: "create_room", code: roomCode, offer, deviceInfo: detectDevice() }),
      })
      setStatus("Waiting for receiver…")

      const poll = async () => {
        if (!alive) return
        try {
          const r = await fetch("/api/share/signal", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "poll", code: roomCode, role: "sender" }),
          })
          const d = await r.json()
          if (d.receiverDeviceInfo) {
            setPeerDevice(d.receiverDeviceInfo)
            if (!connectedRef.current) {
              connectedRef.current = true
              setIsConnected(true)
              playConnectChime()
              setStatus("Peer joined — P2P handshake…")
            }
          }
          if (d.hasAnswer && pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(d.answer))
          }
          for (const c of (d.receiverCandidates || [])) {
            const k = c.candidate
            if (!appliedIce.current.has(k)) { appliedIce.current.add(k); try { await pc.addIceCandidate(new RTCIceCandidate(c)) } catch {} }
          }
        } catch {}
        if (alive) pollRef.current = setTimeout(poll, 900)
      }
      poll()
    }

    init()
    return () => {
      alive = false; clearTimeout(pollRef.current); pcRef.current?.close()
    }
  }, [mode, roomCode])

  // RECEIVER join
  const joinRoom = async (code = inputCode) => {
    const c = code.trim().toUpperCase()
    if (c.length < 4) { setError("Enter a valid room code (4–8 chars)."); return }
    setError(null)
    connectedRef.current = false; chimePlayed = false
    setStatus(`Connecting to ${c}…`)

    const r = await fetch("/api/share/signal", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join_room", code: c, deviceInfo: detectDevice() }),
    })
    const data = await r.json()
    if (!r.ok || !data.offer) {
      setError(data.error || "Room not found. Make sure the sender has ul0.site/share open.")
      return
    }

    if (data.senderDeviceInfo) markConnected(data.senderDeviceInfo)

    const pc = createPC()
    pc.ondatachannel = (e) => listenChannel(e.channel)
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

    // Poll sender ICE
    let alive = true
    const poll = async () => {
      if (!alive || (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed")) return
      try {
        const pr = await fetch("/api/share/signal", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "poll", code: c, role: "receiver" }),
        })
        const pd = await pr.json()
        for (const cand of (pd.senderCandidates || [])) {
          const k = cand.candidate
          if (!appliedIce.current.has(k)) { appliedIce.current.add(k); try { await pc.addIceCandidate(new RTCIceCandidate(cand)) } catch {} }
        }
      } catch {}
      if (alive) setTimeout(poll, 900)
    }
    poll()
    return () => { alive = false }
  }

  // Send file over DataChannel
  const startSend = async () => {
    if (!file) { setError("Pick a file first."); return }
    if (!dcRef.current || dcRef.current.readyState !== "open") {
      setError("Not connected yet. Wait for receiver to join."); return
    }
    setSending(true); setSendPct(0); setSendDone(false); setError(null)
    const dc = dcRef.current, chunkSize = 64 * 1024
    dc.send(JSON.stringify({ type: "header", name: file.name, size: file.size, mime: file.type || "application/octet-stream" }))

    let off = 0, lastT = Date.now(), lastB = 0
    const next = () => {
      if (off >= file.size) { setSending(false); setSendDone(true); setSendPct(100); setStatus("Sent ✓"); return }
      const slice = file.slice(off, off + chunkSize)
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (!(ev.target?.result instanceof ArrayBuffer)) return
        dc.send(ev.target.result); off += ev.target.result.byteLength
        setSendPct(Math.min(100, Math.round((off / file.size) * 100)))
        const now = Date.now(), dt = (now - lastT) / 1000
        if (dt >= 0.5) {
          const bps = (off - lastB) / dt; setSendBps(bps)
          setSendEta(bps > 0 ? (file.size - off) / bps : 0); lastT = now; lastB = off
        }
        setTimeout(next, dc.bufferedAmount > 512 * 1024 ? 25 : 2)
      }
      reader.readAsArrayBuffer(slice)
    }
    next()
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/share?code=${roomCode}` : ""
  const copyCode = () => { navigator.clipboard?.writeText(roomCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const copyUrl = () => { navigator.clipboard?.writeText(shareUrl); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000) }

  // ─── NOTION-LIKE STYLES ───────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "0",
    overflow: "hidden",
  }

  const pillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "3px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontFamily: "ui-monospace, monospace",
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    color: "#6b7280",
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-xl mx-auto" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}>

      {/* Mode tabs — Notion sidebar style */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "16px", padding: "3px", background: "#f3f4f6", borderRadius: "10px" }}>
        {(["send", "receive"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null) }}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.15s",
              background: mode === m ? "#fff" : "transparent",
              color: mode === m ? "#111827" : "#6b7280",
              boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {m === "send" ? <Upload style={{ width: 13, height: 13 }} /> : <Download style={{ width: 13, height: 13 }} />}
            {m === "send" ? "Send" : "Receive"}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div style={cardStyle}>

        {/* Status bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid #f3f4f6",
          background: "#fafafa",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: isConnected ? "#22c55e" : "#f59e0b",
              boxShadow: isConnected ? "0 0 0 2px rgba(34,197,94,0.2)" : "0 0 0 2px rgba(245,158,11,0.2)",
              display: "inline-block",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "ui-monospace, monospace" }}>
              {status || (mode === "send" ? "Ready to send" : "Enter code to receive")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* My device */}
            <span style={pillStyle}>
              <BrowserIcon browser={myDevice.browser} os={myDevice.os} size={12} />
              {myDevice.os}
            </span>
            {/* Peer device */}
            {peerDevice && (
              <span style={{ ...pillStyle, background: "#f0fdf4", borderColor: "#bbf7d0", color: "#166534" }}>
                {peerDevice.countryFlag || ""} <BrowserIcon browser={peerDevice.browser} os={peerDevice.os} size={12} />
                {peerDevice.os} · {peerDevice.browser}
              </span>
            )}
            <span style={{ ...pillStyle, color: "#22c55e", borderColor: "#dcfce7", background: "#f0fdf4" }}>
              <Lock style={{ width: 10, height: 10 }} />E2EE
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            margin: "12px 16px 0",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            fontSize: "12px",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}>
            <AlertCircle style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }} />
            <span style={{ flex: 1 }}>{error}</span>
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: 0 }}>
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>
        )}

        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* ══ SEND MODE ══════════════════════════════════════════════════ */}
          {mode === "send" && (
            <>
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]) }}
                style={{
                  position: "relative",
                  border: `1.5px dashed ${drag ? "#6366f1" : file ? "#22c55e" : "#d1d5db"}`,
                  borderRadius: "10px",
                  padding: "28px 16px",
                  textAlign: "center",
                  background: drag ? "#f0f0ff" : file ? "#f0fdf4" : "#fafafa",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <input type="file" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                {file ? (
                  <div>
                    <div style={{
                      width: 44, height: 44, borderRadius: "10px",
                      background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 10px",
                    }}>
                      <FileCheck style={{ width: 22, height: 22, color: "#16a34a" }} />
                    </div>
                    <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14, color: "#111827" }}>{file.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#6b7280", fontFamily: "ui-monospace, monospace" }}>{formatBytes(file.size)}</p>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null) }}
                      style={{ marginTop: 8, fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                      change file
                    </button>
                  </div>
                ) : (
                  <div style={{ pointerEvents: "none" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "10px",
                      background: "#f3f4f6", border: "1px solid #e5e7eb",
                      display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
                    }}>
                      <Upload style={{ width: 20, height: 20, color: "#9ca3af" }} />
                    </div>
                    <p style={{ margin: "0 0 4px", fontWeight: 500, fontSize: 14, color: "#374151" }}>Drop any file here</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>or click to browse · no size limit</p>
                  </div>
                )}
              </div>

              {/* Room Code block — Notion callout style */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ padding: "12px 14px", background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Share Code
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{
                      fontSize: 28, fontWeight: 800, fontFamily: "ui-monospace, monospace",
                      letterSpacing: "0.15em", color: "#111827",
                    }}>
                      {roomCode}
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={copyCode} style={{
                        padding: "6px 10px", borderRadius: "7px", fontSize: 12,
                        border: "1px solid #e5e7eb", background: "#fff",
                        display: "flex", alignItems: "center", gap: 4, cursor: "pointer",
                        color: copied ? "#16a34a" : "#374151", transition: "all 0.15s",
                      }}>
                        {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <button onClick={() => setShowQr(!showQr)} style={{
                        padding: "6px 8px", borderRadius: "7px",
                        border: "1px solid #e5e7eb", background: "#fff",
                        display: "flex", alignItems: "center", cursor: "pointer", color: "#6b7280",
                      }}>
                        <QrCode style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "10px 14px", display: "flex", gap: 6, alignItems: "center" }}>
                  <input readOnly value={shareUrl} style={{
                    flex: 1, fontSize: 11, fontFamily: "ui-monospace, monospace",
                    background: "#f9fafb", border: "1px solid #f3f4f6",
                    borderRadius: "6px", padding: "6px 8px", color: "#6b7280",
                    outline: "none",
                  }} />
                  <button onClick={copyUrl} style={{
                    flexShrink: 0, padding: "6px 12px", borderRadius: "7px", fontSize: 12,
                    border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                    background: copiedLink ? "#22c55e" : "#111827",
                    color: "#fff", transition: "all 0.15s",
                  }}>
                    {copiedLink ? <Check style={{ width: 12, height: 12 }} /> : <Share2 style={{ width: 12, height: 12 }} />}
                    {copiedLink ? "Copied!" : "Share Link"}
                  </button>
                </div>

                {showQr && (
                  <div style={{ padding: "0 14px 14px", display: "flex", justifyContent: "center" }}>
                    <div style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff" }}>
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(shareUrl)}`}
                        alt="QR" style={{ width: 128, height: 128, display: "block" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Send button + progress */}
              {file && !sendDone && !sending && (
                <button
                  onClick={startSend}
                  disabled={!isConnected}
                  style={{
                    width: "100%", padding: "11px", borderRadius: "9px",
                    fontSize: 14, fontWeight: 600, border: "none", cursor: isConnected ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    background: isConnected ? "#111827" : "#f3f4f6",
                    color: isConnected ? "#fff" : "#9ca3af",
                    transition: "all 0.15s",
                  }}
                >
                  <Zap style={{ width: 15, height: 15 }} />
                  {isConnected ? "Send File" : "Waiting for receiver to connect…"}
                </button>
              )}

              {(sending || sendDone) && file && (
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                    <span style={{ color: "#374151", fontWeight: 500, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {file.name}
                    </span>
                    <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "#111827" }}>{sendPct}%</span>
                  </div>
                  <div style={{ height: 4, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 4, transition: "width 0.3s",
                      width: `${sendPct}%`,
                      background: sendDone ? "#22c55e" : "#111827",
                    }} />
                  </div>
                  {!sendDone && (
                    <p style={{ margin: "8px 0 0", fontSize: 11, fontFamily: "ui-monospace, monospace", color: "#9ca3af" }}>
                      {(sendBps / 1048576).toFixed(2)} MB/s · {formatETA(sendEta)}
                    </p>
                  )}
                  {sendDone && (
                    <p style={{ margin: "8px 0 0", fontSize: 12, color: "#16a34a", fontWeight: 500 }}>
                      ✓ File sent successfully
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* ══ RECEIVE MODE ═══════════════════════════════════════════════ */}
          {mode === "receive" && (
            <>
              {!isConnected ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Enter Room Code
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        placeholder="e.g. A3BX7K"
                        maxLength={8}
                        onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                        style={{
                          flex: 1, textAlign: "center",
                          fontSize: 24, fontWeight: 800, fontFamily: "ui-monospace, monospace",
                          letterSpacing: "0.15em", textTransform: "uppercase",
                          border: "1.5px solid #e5e7eb", borderRadius: "9px",
                          padding: "10px 12px", outline: "none", color: "#111827",
                          background: "#fafafa",
                        }}
                      />
                      <button
                        onClick={() => joinRoom()}
                        style={{
                          flexShrink: 0, padding: "10px 18px", borderRadius: "9px",
                          fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
                          background: "#111827", color: "#fff",
                          display: "flex", alignItems: "center", gap: 6,
                        }}
                      >
                        Connect <ArrowRight style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                    <p style={{ margin: "8px 0 0", fontSize: 11, color: "#9ca3af", textAlign: "center" }}>
                      or open the sender's shared link directly
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Connected */}
                  <div style={{
                    padding: "10px 14px", borderRadius: "9px",
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%", background: "#22c55e",
                      flexShrink: 0, display: "inline-block",
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#166534" }}>
                      {peerDevice
                        ? `Connected — ${peerDevice.os} (${peerDevice.browser})`
                        : "Connected to sender"}
                    </span>
                  </div>

                  {/* Incoming file info */}
                  {incoming ? (
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ padding: "12px 14px", background: "#fafafa", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: "8px", flexShrink: 0,
                          background: "#f3f4f6", border: "1px solid #e5e7eb",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <FileIcon style={{ width: 18, height: 18, color: "#6b7280" }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 13, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {incoming.name}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, fontFamily: "ui-monospace, monospace", color: "#6b7280" }}>
                            {formatBytes(incoming.size)}
                          </p>
                        </div>
                      </div>

                      {(receiving || recvDone) && (
                        <div style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                            <span style={{ color: "#6b7280" }}>{recvDone ? "Complete" : "Receiving…"}</span>
                            <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "#111827" }}>{recvPct}%</span>
                          </div>
                          <div style={{ height: 4, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{
                              height: "100%", borderRadius: 4, transition: "width 0.3s",
                              width: `${recvPct}%`,
                              background: recvDone ? "#22c55e" : "#111827",
                            }} />
                          </div>
                          {receiving && (
                            <p style={{ margin: "8px 0 0", fontSize: 11, fontFamily: "ui-monospace, monospace", color: "#9ca3af" }}>
                              {(recvBps / 1048576).toFixed(2)} MB/s · {formatETA(recvEta)} · {formatBytes(Math.round(recvPct / 100 * incoming.size))} of {formatBytes(incoming.size)}
                            </p>
                          )}
                          {recvDone && recvUrl && (
                            <a href={recvUrl} download={incoming.name} style={{
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                              marginTop: 10, padding: "9px", borderRadius: "8px",
                              background: "#111827", color: "#fff",
                              fontSize: 13, fontWeight: 600, textDecoration: "none",
                            }}>
                              <Download style={{ width: 14, height: 14 }} />
                              Download Again
                            </a>
                          )}
                        </div>
                      )}

                      {!receiving && !recvDone && (
                        <div style={{ padding: "16px 14px", textAlign: "center" }}>
                          <RefreshCcw style={{ width: 16, height: 16, color: "#9ca3af", animation: "spin 1.5s linear infinite", display: "inline-block" }} />
                          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#9ca3af" }}>Waiting for sender to start…</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      padding: "24px 16px", textAlign: "center",
                      border: "1.5px dashed #e5e7eb", borderRadius: "10px",
                    }}>
                      <RefreshCcw style={{ width: 18, height: 18, color: "#d1d5db", display: "inline-block" }} />
                      <p style={{ margin: "10px 0 0", fontSize: 12, color: "#9ca3af" }}>Waiting for sender to pick a file and start the transfer…</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Footer trust row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, paddingTop: 4 }}>
            {[
              { icon: <Lock style={{ width: 10, height: 10 }} />, text: "End-to-end encrypted" },
              { icon: <Zap style={{ width: 10, height: 10 }} />, text: "No file size limit" },
              { icon: <Globe style={{ width: 10, height: 10 }} />, text: "No server storage" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#9ca3af" }}>
                {icon} {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
