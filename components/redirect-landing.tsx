"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
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
  X as XIcon,
} from "lucide-react"
import { AdBanner } from "@/components/ad-banner"

interface Props {
  longUrl: string
  domain: string | null
  /** If the link was accessed from a custom domain, pass the host here */
  customHost?: string | null
  /** Brand logo URL for the company that owns this domain */
  brandLogoUrl?: string | null
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
  // Use exact match or subdomain prefix to prevent subdomain-confusion attacks
  // e.g. "youtube.com.evil.com" would pass an includes() check but fails endsWith()
  const is = (domain: string) => host === domain || host.endsWith(`.${domain}`)
  if (is("youtube.com") || is("youtu.be")) return "youtube"
  if (is("instagram.com")) return "instagram"
  if (is("facebook.com") || is("fb.com") || is("fb.watch")) return "facebook"
  if (is("twitter.com") || is("x.com")) return "twitter"
  if (is("pinterest.com") || is("pin.it")) return "pinterest"
  if (is("tiktok.com")) return "tiktok"
  if (is("snapchat.com")) return "snapchat"
  if (is("spotify.com")) return "spotify"
  if (is("linkedin.com")) return "linkedin"
  if (is("wa.me") || is("whatsapp.com")) return "whatsapp"
  if (is("t.me") || is("telegram.me")) return "telegram"
  if (is("reddit.com")) return "reddit"
  if (is("amazon.com") || is("amazon.in") || is("amazon.co.uk") || is("amzn.to")) return "amazon"
  if (is("flipkart.com") || is("fkrt.it")) return "flipkart"
  return null
}

export function RedirectLanding({ longUrl, domain, customHost, brandLogoUrl }: Props) {
  const [countdown, setCountdown] = useState(5)
  const [canSkip, setCanSkip] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [detectedApp, setDetectedApp] = useState<string | null>(null)

  // Whether this redirect is served from a custom brand domain
  const isBrandedDomain = !!customHost

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
    // Start countdown immediately
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
      {/* Only show ads on non-branded domains */}
      {!isBrandedDomain && <AdBanner slot={1} type="large" />}

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${((5 - countdown) / 5) * 100}%` }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Redirecting to: </span>
            <span className="max-w-[150px] truncate font-medium text-foreground sm:max-w-xs">
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
        {/* Only show middle ad on non-branded domains */}
        {!isBrandedDomain && <AdBanner slot={2} type="small" />}

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

        {/* Only show bottom ads on non-branded domains */}
        {!isBrandedDomain && (
          <>
            <AdBanner slot={3} type="large" />
            <AdBanner slot={4} type="small" />
          </>
        )}
      </main>

      {/* Footer — branded co-badge */}
      <footer className="border-t border-border bg-muted/30 px-4 py-4">
        <div className="container mx-auto flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-0">
          {/* Left side: company brand logo (if custom domain) */}
          {isBrandedDomain ? (
            <div className="flex items-center gap-3">
              {brandLogoUrl ? (
                <img
                  src={brandLogoUrl}
                  alt="Brand Logo"
                  className="h-7 w-auto object-contain max-w-[120px]"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              ) : (
                <span className="text-xs font-medium text-muted-foreground font-mono">{customHost}</span>
              )}
              <XIcon className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              <a href="https://ul0.site" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/ul0.png"
                  alt="ul0"
                  width={50}
                  height={18}
                  className="h-5 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          ) : (
            <a
              href="https://ul0.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Powered by ul0 — Free URL Shortener
            </a>
          )}

          {isBrandedDomain && (
            <a
              href="https://ul0.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Powered by ul0.site
            </a>
          )}
        </div>
      </footer>
    </div>
  )
}
