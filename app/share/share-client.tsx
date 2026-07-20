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
  Smartphone,
  Laptop,
} from "lucide-react"
import { ShareAdBanner } from "@/components/share-ad-banner"

// Helper to format bytes into human-readable strings
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// Generate a random 6-character room code
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let res = ""
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return res
}

export function ShareClient() {
  const searchParams = useSearchParams()
  const urlCode = searchParams.get("code")

  const [mode, setMode] = useState<"send" | "receive">("send")
  const [roomCode, setRoomCode] = useState<string>("")
  const [inputCode, setInputCode] = useState<string>("")
  
  // PeerJS state
  const [peerId, setPeerId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [statusText, setStatusText] = useState<string>("Initializing secure P2P engine…")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // File state (Sender)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSending, setIsSending] = useState<boolean>(false)
  const [sendProgress, setSendProgress] = useState<number>(0)
  const [sendSpeed, setSendSpeed] = useState<string>("0 MB/s")
  const [sendCompleted, setSendCompleted] = useState<boolean>(false)

  // File state (Receiver)
  const [incomingFile, setIncomingFile] = useState<{ name: string; size: number; mime: string } | null>(null)
  const [isReceiving, setIsReceiving] = useState<boolean>(false)
  const [receiveProgress, setReceiveProgress] = useState<number>(0)
  const [receiveSpeed, setReceiveSpeed] = useState<string>("0 MB/s")
  const [receivedBlobUrl, setReceivedBlobUrl] = useState<string | null>(null)
  const [receiveCompleted, setReceiveCompleted] = useState<boolean>(false)

  // UI state
  const [copiedLink, setCopiedLink] = useState<boolean>(false)
  const [copiedCode, setCopiedCode] = useState<boolean>(false)
  const [showQr, setShowQr] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const peerRef = useRef<any>(null)
  const connRef = useRef<any>(null)

  // Initialize room code
  useEffect(() => {
    if (urlCode && urlCode.trim().length >= 4) {
      setMode("receive")
      setInputCode(urlCode.trim().toUpperCase())
    } else {
      setRoomCode(generateCode())
    }
  }, [urlCode])

  // Initialize PeerJS client
  useEffect(() => {
    let peerInstance: any = null

    async function initPeer() {
      try {
        const { default: Peer } = await import("peerjs")
        
        // Generate peer prefix to isolate ul0 room codes
        const codeToUse = mode === "send" ? roomCode : ""
        const idToRegister = codeToUse ? `ul0-share-${codeToUse}` : undefined

        peerInstance = new Peer(idToRegister as any, {
          debug: 1,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
            ],
          },
        })

        peerRef.current = peerInstance

        peerInstance.on("open", (id: string) => {
          setPeerId(id)
          setStatusText(mode === "send" ? "Ready. Share code or link with receiver." : "Ready to connect.")
        })

        peerInstance.on("connection", (conn: any) => {
          connRef.current = conn
          setIsConnected(true)
          setStatusText("Peer connected! Ready to transfer file.")
          setupConnectionListeners(conn)
        })

        peerInstance.on("error", (err: any) => {
          console.error("PeerJS error:", err)
          if (err.type === "peer-not-found") {
            setErrorMsg("Transfer session not found or sender disconnected. Please check the code.")
          } else {
            setErrorMsg(`P2P Connection notice: ${err.message || err.type}`)
          }
        })
      } catch (err: any) {
        console.error("Failed to load PeerJS:", err)
        setErrorMsg("Failed to start WebRTC engine. Please refresh the page.")
      }
    }

    if (mode === "send" && roomCode) {
      initPeer()
    } else if (mode === "receive") {
      initPeer()
    }

    return () => {
      if (peerInstance) {
        peerInstance.destroy()
      }
    }
  }, [mode, roomCode])

  // Connect to Sender (Receiver side)
  const handleConnectReceiver = (codeTarget?: string) => {
    const code = (codeTarget || inputCode).trim().toUpperCase()
    if (!code || code.length < 4) {
      setErrorMsg("Please enter a valid 6-character room code.")
      return
    }

    setErrorMsg(null)
    setStatusText(`Connecting to sender code ${code}…`)

    if (!peerRef.current) return

    const targetPeerId = `ul0-share-${code}`
    const conn = peerRef.current.connect(targetPeerId, { reliable: true })
    connRef.current = conn

    conn.on("open", () => {
      setIsConnected(true)
      setStatusText("Connected to sender! Waiting for file transfer…")
      setupConnectionListeners(conn)
    })

    conn.on("error", (err: any) => {
      console.error("Connection error:", err)
      setErrorMsg("Failed to connect to sender. Make sure sender's tab is still open.")
    })
  }

  // Handle incoming data & chunk assembly over WebRTC DataChannel
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
        setStatusText(`Receiving ${data.name} (${formatBytes(data.size)})…`)
        return
      }

      // 2. File Chunk packet
      if (data && data.type === "chunk" && data.chunk) {
        const chunk: ArrayBuffer = data.chunk
        receivedChunks.push(chunk)
        receivedBytes += chunk.byteLength

        if (expectedHeader && expectedHeader.size > 0) {
          const pct = Math.min(100, Math.round((receivedBytes / expectedHeader.size) * 100))
          setReceiveProgress(pct)

          // Speed calculation
          const now = Date.now()
          const diffSec = (now - lastTime) / 1000
          if (diffSec >= 0.8) {
            const bytesDiff = receivedBytes - lastBytes
            const speedMbps = (bytesDiff / diffSec / (1024 * 1024)).toFixed(2)
            setReceiveSpeed(`${speedMbps} MB/s`)
            lastTime = now
            lastBytes = receivedBytes
          }
        }

        // Check completion
        if (data.isLast || (expectedHeader && receivedBytes >= expectedHeader.size)) {
          setIsReceiving(false)
          setReceiveCompleted(true)
          setStatusText("File transfer complete! Download ready.")
          setReceiveProgress(100)

          const blob = new Blob(receivedChunks, { type: expectedHeader?.mime || "application/octet-stream" })
          const url = URL.createObjectURL(blob)
          setReceivedBlobUrl(url)

          // Auto-trigger download
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

  // Drag & Drop handlers
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

  // Send File Chunks over WebRTC DataChannel
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

    // Send header first
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

        // Speed calculation
        const now = Date.now()
        const diffSec = (now - lastTime) / 1000
        if (diffSec >= 0.8) {
          const bytesDiff = offset - lastBytes
          const speedMbps = (bytesDiff / diffSec / (1024 * 1024)).toFixed(2)
          setSendSpeed(`${speedMbps} MB/s`)
          lastTime = now
          lastBytes = offset
        }

        // Use slight delay to avoid WebRTC buffer overflow on large files
        if (conn.dataChannel && conn.dataChannel.bufferedAmount > 1024 * 1024) {
          setTimeout(readAndSendNextChunk, 50)
        } else {
          setTimeout(readAndSendNextChunk, 4)
        }
      }

      reader.readAsArrayBuffer(slice)
    }

    readAndSendNextChunk()
  }

  // Copy share URL
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/share?code=${roomCode}` : ""
  
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
        <div className="inline-flex rounded-2xl border border-border p-1 bg-card/60 backdrop-blur-md shadow-xs">
          <button
            onClick={() => {
              setMode("send")
              setErrorMsg(null)
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === "send"
                ? "bg-primary text-primary-foreground shadow-sm"
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
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === "receive"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Download className="h-4 w-4" />
            Receive File
          </button>
        </div>
      </div>

      {/* Main Interactive App Workspace with Aesthetic Ad Sidebar */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left / Center Main Card (9 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/60 bg-card/80 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-6">
              
              {/* STATUS HEADER */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                    isConnected
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                      : "bg-primary/10 border-primary/20 text-primary"
                  }`}>
                    {isConnected ? <CheckCircle2 className="h-5 w-5 animate-pulse" /> : <Shield className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">
                      {mode === "send" ? "P2P Sender Node" : "P2P Receiver Node"}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
                      {statusText}
                    </p>
                  </div>
                </div>

                {/* Encrypted Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border/40 text-[11px] font-mono text-muted-foreground">
                  <Lock className="h-3 w-3 text-emerald-500" />
                  <span>256-Bit WebRTC Encrypted</span>
                </div>
              </div>

              {/* ERROR ALERT */}
              {errorMsg && (
                <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3.5 text-sm text-destructive">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="flex-1 text-xs sm:text-sm">{errorMsg}</p>
                </div>
              )}

              {/* ================= SENDER MODE ================= */}
              {mode === "send" && (
                <div className="space-y-6">
                  {/* File Drag & Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
                      isDragging
                        ? "border-primary bg-primary/10 scale-[1.01]"
                        : selectedFile
                        ? "border-emerald-500/40 bg-emerald-500/5"
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
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                          <FileCheck className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-base max-w-xs sm:max-w-md truncate mx-auto">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-1">
                            {formatBytes(selectedFile.size)} · Ready to share
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-xs text-muted-foreground hover:text-foreground">
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 pointer-events-none">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                          <Upload className="h-7 w-7 animate-bounce" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-base sm:text-lg">
                            Drag & Drop Any File Here
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            or click to browse from device. Zero file size limits!
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] font-mono text-muted-foreground/70">
                          <span>Videos</span> · <span>PDFs</span> · <span>Photos</span> · <span>Archives</span> · <span>Software</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Room Transfer Code & Link Sharing Section */}
                  <div className="rounded-2xl border border-border/50 bg-muted/20 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                          Share Room Code
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Receiver can enter this code at <code className="text-primary">ul0.site/share</code>
                        </p>
                      </div>

                      {/* Code display */}
                      <div className="flex items-center gap-2">
                        <code className="px-4 py-2 rounded-xl bg-background border border-border text-lg sm:text-xl font-bold font-mono tracking-widest text-primary">
                          {roomCode}
                        </code>
                        <Button size="sm" variant="outline" onClick={copyRoomCode} className="h-10 text-xs gap-1.5">
                          {copiedCode ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                          {copiedCode ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>

                    {/* Direct URL Share Box */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <Input
                        readOnly
                        value={shareUrl}
                        className="bg-background text-xs font-mono truncate h-10"
                      />
                      <div className="flex gap-2">
                        <Button onClick={copyShareLink} variant="default" className="h-10 text-xs gap-1.5 shrink-0">
                          {copiedLink ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                          {copiedLink ? "Link Copied!" : "Copy Link"}
                        </Button>
                        <Button
                          onClick={() => setShowQr(!showQr)}
                          variant="outline"
                          className="h-10 text-xs gap-1.5 shrink-0"
                        >
                          <QrCode className="h-4 w-4" />
                          QR
                        </Button>
                      </div>
                    </div>

                    {/* QR Code preview box if toggled */}
                    {showQr && (
                      <div className="pt-3 text-center flex flex-col items-center animate-in fade-in duration-300">
                        <div className="p-3 bg-white rounded-2xl shadow-md border">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                              shareUrl
                            )}`}
                            alt="Scan QR to receive file"
                            className="w-40 h-40"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Scan with camera to connect on mobile</p>
                      </div>
                    )}
                  </div>

                  {/* Transfer Action Button & Live Progress */}
                  {selectedFile && (
                    <div className="space-y-4 pt-2">
                      {isSending ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-foreground">Sending {selectedFile.name}…</span>
                            <span className="font-mono text-primary">{sendProgress}% ({sendSpeed})</span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-muted overflow-hidden border">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${sendProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : sendCompleted ? (
                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-1">
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                            🎉 Transfer Complete!
                          </p>
                          <p className="text-xs text-muted-foreground">
                            The receiver has safely downloaded {selectedFile.name}.
                          </p>
                        </div>
                      ) : (
                        <Button
                          onClick={handleStartTransfer}
                          disabled={!isConnected}
                          className="w-full h-12 text-base font-semibold gap-2 rounded-2xl shadow-md"
                        >
                          <Zap className="h-5 w-5 fill-current" />
                          {isConnected ? "Start Transfer Now" : "Waiting for Receiver to Connect…"}
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
                          Enter 6-Character Transfer Code
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            placeholder="e.g. X7K2M9"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                            maxLength={8}
                            className="h-12 text-lg font-mono tracking-widest text-center uppercase bg-background"
                          />
                          <Button
                            onClick={() => handleConnectReceiver()}
                            className="h-12 px-8 text-sm font-semibold gap-2 shrink-0 rounded-xl"
                          >
                            Connect to Sender
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Ask the sender for their 6-character room code or open the link directly on your device.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Connection indicator */}
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">Connected to Sender</p>
                            <p className="text-xs text-muted-foreground">Direct Peer-to-Peer Data Channel Active</p>
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

                      {/* Incoming File Header preview */}
                      {incomingFile ? (
                        <div className="rounded-2xl border border-border bg-muted/20 p-6 space-y-5">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                              <FileIcon className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-foreground text-base truncate">
                                {incomingFile.name}
                              </p>
                              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                                Size: {formatBytes(incomingFile.size)}
                              </p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          {isReceiving && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-medium">
                                <span className="text-foreground">Downloading from sender…</span>
                                <span className="font-mono text-primary">{receiveProgress}% ({receiveSpeed})</span>
                              </div>
                              <div className="h-3 w-full rounded-full bg-muted overflow-hidden border">
                                <div
                                  className="h-full bg-primary rounded-full transition-all duration-300"
                                  style={{ width: `${receiveProgress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Download Ready Button */}
                          {receiveCompleted && receivedBlobUrl && (
                            <div className="space-y-3 pt-2">
                              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                ✨ Transfer finished! Your file has been downloaded automatically.
                              </div>
                              <Button
                                asChild
                                className="w-full h-12 text-base font-semibold gap-2 rounded-2xl shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
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
                          <p className="font-semibold text-foreground text-sm">Waiting for Sender to Initiate Transfer</p>
                          <p className="text-xs text-muted-foreground">The sender will select and transmit the file momentarily.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feature Highlights Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/40 bg-card/40 p-4 space-y-1">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <HardDrive className="h-4 w-4" />
                <span>Unlimited Size</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct P2P WebRTC data channels mean files stream straight between devices without server caps.
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-card/40 p-4 space-y-1">
              <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
                <Lock className="h-4 w-4" />
                <span>100% Private & E2EE</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your files never touch any cloud database or server disk. End-to-end encrypted by default.
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-card/40 p-4 space-y-1">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Zap className="h-4 w-4" />
                <span>Blazing Fast</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transfers move at your local Wi-Fi or LAN speeds. No cloud upload delays or waiting queues.
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar Ad Container (300x160 ad unit as requested) */}
        <div className="lg:col-span-4 space-y-6">
          <ShareAdBanner />

          {/* Quick How-It-Works Box */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-3">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              How P2P Share Works
            </h4>
            <ol className="space-y-2.5 text-xs text-muted-foreground list-decimal pl-4">
              <li>
                <strong className="text-foreground">Select File</strong>: Choose any video, archive, document, or photo.
              </li>
              <li>
                <strong className="text-foreground">Share Code</strong>: Send your 6-digit room code or URL to the recipient.
              </li>
              <li>
                <strong className="text-foreground">Direct Transfer</strong>: Data streams browser-to-browser encrypted via WebRTC.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
