"use client"

import React, { useEffect, useState, useCallback } from "react"
import { AdBanner } from "@/components/ad-banner"

interface CuteRedirectLandingProps {
  longUrl: string
  domain: string | null
  customHost?: string | null
  brandLogoUrl?: string | null
  customMessage?: string | null
}

export function CuteRedirectLanding({
  longUrl,
  domain,
  customHost,
  brandLogoUrl,
  customMessage,
}: CuteRedirectLandingProps) {
  const [countdown, setCountdown] = useState(6)
  const [progress, setProgress] = useState(0)

  const redirect = useCallback(() => {
    window.location.href = longUrl
  }, [longUrl])

  // 6 second timer countdown
  useEffect(() => {
    const totalTime = 6
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
  }, [redirect])

  // Extract friendly display domain
  let displayDomain = domain || "destination"
  try {
    const parsed = new URL(longUrl)
    displayDomain = parsed.hostname.replace(/^www\./, "")
  } catch {}

  // SVG progress ring
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        color: "#1a1a1a",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hidden background Ads: load and execute telemetry without disturbing user */}
      <div
        style={{
          opacity: 0,
          pointerEvents: "none",
          position: "fixed",
          bottom: "-9999px",
          left: "-9999px",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <AdBanner slot={1} type="large" />
        <AdBanner slot={2} type="small" />
      </div>

      {/* Subtle background grain texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 50% 0%, rgba(0,0,0,0.015) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          maxWidth: "380px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Animated Logo with Progress Ring */}
        {brandLogoUrl ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
            <div style={{ position: "relative", width: "110px", height: "110px" }}>
              <svg
                width="110"
                height="110"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "rotate(-90deg)",
                }}
              >
                <circle cx="55" cy="55" r="48" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                <circle
                  cx="55"
                  cy="55"
                  r="48"
                  fill="none"
                  stroke="#0B1412"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={(2 * Math.PI * 48) - (progress / 100) * (2 * Math.PI * 48)}
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: "8px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fafafa",
                }}
              >
                <img
                  src="/ulo_4k.webp"
                  alt="UL0"
                  style={{ width: "72px", height: "72px", objectFit: "contain" }}
                />
              </div>
            </div>

            <span style={{ fontSize: "16px", color: "#bbb", fontWeight: 400, userSelect: "none" }}>×</span>

            <div
              style={{
                width: "94px",
                height: "94px",
                borderRadius: "50%",
                background: "#fafafa",
                border: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                padding: "14px",
              }}
            >
              <img
                src={brandLogoUrl}
                alt="Brand Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        ) : (
          <div style={{ position: "relative", width: "140px", height: "140px" }}>
            {/* SVG Progress Ring */}
            <svg
              width="140"
              height="140"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: "rotate(-90deg)",
              }}
            >
              {/* Track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="3"
              />
              {/* Progress */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#0B1412"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 0.1s linear" }}
              />
            </svg>

            {/* UL0 Animated Logo */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fafafa",
              }}
            >
              <img
                src="/ulo_4k.webp"
                alt="UL0"
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        )}

        {/* Message */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p
            style={{
              fontSize: "15px",
              fontWeight: 500,
              color: "#666",
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
              color: "#1a1a1a",
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
              color: "#999",
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
            background: "#f7f7f7",
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
              color: "#666",
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
            background: "#1a1a1a",
            color: "#fff",
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
            e.currentTarget.style.background = "#333"
            e.currentTarget.style.transform = "translateY(-1px)"
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#1a1a1a"
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
            color: "#ccc",
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
