"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  Smartphone,
  Globe,
  Shield,
  SkipForward,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react"
import { AdBanner } from "@/components/ad-banner"

interface Props {
  longUrl: string
  domain: string | null
}

const APP_CONFIGS: Record<string, { name: string; icon: React.ElementType; getDeepLink: (url: URL) => string | null }> =
  {
    youtube: {
      name: "YouTube",
      icon: Youtube,
      getDeepLink: (url) => {
        if (url.hostname.includes("youtu.be")) {
          return `youtube://watch?v=${url.pathname.slice(1)}`
        }
        const videoId = url.searchParams.get("v")
        if (videoId) return `youtube://watch?v=${videoId}`
        if (url.pathname.includes("/shorts/")) {
          return `youtube://shorts/${url.pathname.split("/shorts/")[1]}`
        }
        return `youtube://${url.pathname}`
      },
    },
    instagram: {
      name: "Instagram",
      icon: Instagram,
      getDeepLink: (url) => `instagram://` + url.pathname,
    },
    facebook: {
      name: "Facebook",
      icon: Facebook,
      getDeepLink: (url) => `fb://facewebmodal/f?href=${encodeURIComponent(url.href)}`,
    },
    twitter: {
      name: "X (Twitter)",
      icon: Twitter,
      getDeepLink: (url) => `twitter://` + url.pathname,
    },
    pinterest: {
      name: "Pinterest",
      icon: Globe,
      getDeepLink: (url) => `pinterest://` + url.pathname,
    },
    tiktok: {
      name: "TikTok",
      icon: Globe,
      getDeepLink: (url) => `snssdk1128://` + url.pathname,
    },
    snapchat: {
      name: "Snapchat",
      icon: Globe,
      getDeepLink: (url) => `snapchat://` + url.pathname,
    },
    spotify: {
      name: "Spotify",
      icon: Globe,
      getDeepLink: (url) => url.href.replace("https://open.spotify.com", "spotify://"),
    },
    linkedin: {
      name: "LinkedIn",
      icon: Globe,
      getDeepLink: (url) => `linkedin://` + url.pathname,
    },
    whatsapp: {
      name: "WhatsApp",
      icon: Globe,
      getDeepLink: (url) =>
        url.href
          .replace("https://wa.me", "whatsapp://send?phone=")
          .replace("https://api.whatsapp.com/send", "whatsapp://send"),
    },
    telegram: {
      name: "Telegram",
      icon: Globe,
      getDeepLink: (url) => `tg://resolve?domain=${url.pathname.slice(1)}`,
    },
    reddit: {
      name: "Reddit",
      icon: Globe,
      getDeepLink: (url) => `reddit://` + url.pathname,
    },
    amazon: {
      name: "Amazon",
      icon: Globe,
      getDeepLink: (url) => `com.amazon.mobile.shopping://` + url.pathname,
    },
    flipkart: {
      name: "Flipkart",
      icon: Globe,
      getDeepLink: (url) => `flipkart://` + url.pathname,
    },
  }

function detectApp(hostname: string): string | null {
  const host = hostname.toLowerCase()
  if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube"
  if (host.includes("instagram.com")) return "instagram"
  if (host.includes("facebook.com") || host.includes("fb.com") || host.includes("fb.watch")) return "facebook"
  if (host.includes("twitter.com") || host.includes("x.com")) return "twitter"
  if (host.includes("pinterest.com") || host.includes("pin.it")) return "pinterest"
  if (host.includes("tiktok.com")) return "tiktok"
  if (host.includes("snapchat.com")) return "snapchat"
  if (host.includes("spotify.com")) return "spotify"
  if (host.includes("linkedin.com")) return "linkedin"
  if (host.includes("wa.me") || host.includes("whatsapp.com")) return "whatsapp"
  if (host.includes("t.me") || host.includes("telegram.me")) return "telegram"
  if (host.includes("reddit.com")) return "reddit"
  if (host.includes("amazon.") || host.includes("amzn.")) return "amazon"
  if (host.includes("flipkart.com") || host.includes("fkrt.it")) return "flipkart"
  return null
}

export function RedirectLanding({ longUrl, domain }: Props) {
  const [countdown, setCountdown] = useState(5)
  const [canSkip, setCanSkip] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [detectedApp, setDetectedApp] = useState<string | null>(null)

  const redirect = useCallback(() => {
    window.location.href = longUrl
  }, [longUrl])

  useEffect(() => {
    const mobile = /mobile|android|iphone|ipad|tablet/i.test(navigator.userAgent)
    setIsMobile(mobile)

    try {
      const url = new URL(longUrl)
      const app = detectApp(url.hostname)
      setDetectedApp(app)
    } catch {
      // Invalid URL
    }
  }, [longUrl])

  useEffect(() => {
    // Start countdown immediately (no video ad)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          redirect()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const skipTimer = setTimeout(() => {
      setCanSkip(true)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(skipTimer)
    }
  }, [redirect])

  const handleOpenInApp = () => {
    if (!detectedApp) {
      redirect()
      return
    }

    try {
      const url = new URL(longUrl)
      const appConfig = APP_CONFIGS[detectedApp]
      const deepLink = appConfig?.getDeepLink(url)

      if (deepLink) {
        window.location.href = deepLink
        setTimeout(() => {
          window.location.href = longUrl
        }, 2000)
      } else {
        redirect()
      }
    } catch {
      redirect()
    }
  }

  const appConfig = detectedApp ? APP_CONFIGS[detectedApp] : null
  const AppIcon = appConfig?.icon || Globe

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Banner Strip - Large 728x90 */}
      <AdBanner slot={1} type="large" />

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${((10 - countdown) / 10) * 100}%` }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Redirecting to: </span>
            <span className="max-w-[150px] truncate font-medium text-foreground sm:max-w-none">
              {domain || "external site"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tabular-nums text-primary">{countdown}s</span>
            {canSkip && (
              <Button size="sm" onClick={redirect} className="gap-1">
                <SkipForward className="h-4 w-4" />
                <span className="hidden sm:inline">Skip</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center gap-4 overflow-auto p-4">
        {/* Middle Banner - Small 468x60 */}
        <AdBanner slot={2} type="small" />

        {/* App Detection & Buttons */}
        {isMobile && detectedApp && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 w-full max-w-md">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <AppIcon className="h-5 w-5 text-primary" />
              <span>Open in {appConfig?.name}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={handleOpenInApp} size="sm" className="gap-2">
                <Smartphone className="h-4 w-4" />
                Open App
              </Button>
              <Button variant="outline" size="sm" onClick={redirect} className="gap-2 bg-transparent">
                <Globe className="h-4 w-4" />
                Browser
              </Button>
            </div>
          </div>
        )}

        {/* Trust Badge */}
        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-600 dark:text-green-400">
          <Shield className="h-4 w-4" />
          <span>Link verified safe</span>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          <span className="max-w-xs truncate sm:max-w-md">{longUrl}</span>
        </div>

        {/* Bottom Banner - Large 728x90 */}
        <AdBanner slot={3} type="large" />
        
        {/* Extra Small Banner */}
        <AdBanner slot={4} type="small" />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 px-4 py-2 text-center text-xs text-muted-foreground">
        Powered by ul0 - Free URL shortener
      </footer>
    </div>
  )
}
