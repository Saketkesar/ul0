"use client"

import React, { useEffect, useState, useCallback } from "react"
import { AdBanner } from "@/components/ad-banner"

interface CuteRedirectLandingProps {
  longUrl: string
  domain: string | null
  customHost?: string | null
  brandLogoUrl?: string | null
  customMessage?: string | null
  countdownSeconds?: number
}

export function CuteRedirectLanding({
  longUrl,
  domain,
  customHost,
  brandLogoUrl,
  customMessage,
  countdownSeconds = 5,
}: CuteRedirectLandingProps) {
  const initialSeconds = Math.max(1, Math.min(10, countdownSeconds))
  const [countdown, setCountdown] = useState(initialSeconds)
  const [progress, setProgress] = useState(0)

  const redirect = useCallback(() => {
    window.location.href = longUrl
  }, [longUrl])

  // Timer countdown
  useEffect(() => {
    const totalTime = initialSeconds
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const remaining = Math.max(0, Math.ceil(totalTime - elapsed))
      const pct = Math.min(100, (elapsed / totalTime) * 100)

      setCountdown(remaining)
      setProgress(pct)

      if (remaining <= 0) {
        clearInterval(interval)
        redirect()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [redirect, initialSeconds])

  // Extract friendly display domain
  let displayDomain = domain || "destination"
  try {
    const parsed = new URL(longUrl)
    displayDomain = parsed.hostname.replace(/^www\./, "")
  } catch {}

  // SVG progress ring
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 relative overflow-hidden select-none transition-colors"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Background Ads: Loads and executes ad impressions invisibly without disturbing user */}
      <div
        style={{
          position: "fixed",
          top: "-3000px",
          left: "-3000px",
          width: "728px",
          height: "90px",
          opacity: 0.001,
          pointerEvents: "none",
          zIndex: -999,
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <AdBanner slot={1} type="large" />
        <AdBanner slot={2} type="small" />
      </div>

      {/* Subtle background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 50% 20%, rgba(22, 130, 112, 0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Single Sleek Hero Circle with Progress Ring */}
        <div style={{ position: "relative", width: "136px", height: "136px" }}>
          {/* SVG Progress Ring */}
          <svg
            width="136"
            height="136"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: "rotate(-90deg)",
            }}
          >
            {/* Track */}
            <circle
              cx="68"
              cy="68"
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth="3.5"
            />
            {/* Animated Progress Indicator */}
            <circle
              cx="68"
              cy="68"
              r={radius}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.08s linear" }}
            />
          </svg>

          {/* Central Logo Container (No disjointed double circles with x!) */}
          <div
            style={{
              position: "absolute",
              inset: "8px",
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              padding: brandLogoUrl ? "14px" : "8px",
            }}
          >
            <img
              src={brandLogoUrl || "/ulo_smooth.webp"}
              alt={brandLogoUrl ? "Brand Logo" : "UL0"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Message */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p
            style={{
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--muted-foreground)",
              letterSpacing: "-0.01em",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {customMessage || "You're being redirected"}
          </p>

          <p
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "var(--foreground)",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              margin: 0,
              fontVariantNumeric: "tabular-nums",
              fontFamily: "'SF Mono', 'Roboto Mono', 'Fira Code', monospace",
            }}
          >
            {countdown}
          </p>

          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            seconds remaining
          </p>
        </div>

        {/* Destination pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#34d399",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "13px",
              color: "var(--foreground)",
              fontFamily: "'SF Mono', 'Roboto Mono', monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayDomain}
          </span>
        </div>

        {/* Skip button */}
        <button
          type="button"
          onClick={redirect}
          style={{
            width: "100%",
            padding: "14px 24px",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "-0.01em",
            transition: "all 0.15s ease",
            fontFamily: "inherit",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "0.9"
            e.currentTarget.style.transform = "translateY(-1px)"
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "1"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          Continue now →
        </button>
      </div>

      {/* Minimal footer */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: "var(--muted-foreground)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          ul0.site
        </span>
      </div>

      {/* Inline font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  )
}
