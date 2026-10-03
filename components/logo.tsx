import React from "react"

interface LogoProps {
  className?: string
  iconSize?: number
  showText?: boolean
  textColor?: string
}

export function Logo({
  className = "",
  iconSize = 28,
  showText = true,
  textColor,
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Handcrafted Precision Vector Brand Mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ul0-base-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="ul0-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="ul0-dot-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {/* Squircle Background Container */}
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="12"
          fill="url(#ul0-base-gradient)"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
        />

        {/* Clean Geometric Link Interlock Mark */}
        {/* Left Link Node (Forms 'U') */}
        <path
          d="M14 18V25C14 28.3137 16.6863 31 20 31H21.5"
          stroke="url(#ul0-stroke-gradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Link Node (Forms '0' loop) */}
        <path
          d="M34 22V29C34 32.3137 31.3137 35 28 35C24.6863 35 22 32.3137 22 29V23C22 19.6863 24.6863 17 28 17C31.3137 17 34 19.6863 34 23Z"
          stroke="url(#ul0-stroke-gradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Top Connecting Link Bar */}
        <path
          d="M14 18C14 14.6863 16.6863 12 20 12C23.3137 12 26 14.6863 26 18V21"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Precision Core Dot (Zero Latency Origin) */}
        <circle cx="28" cy="26" r="2.5" fill="url(#ul0-dot-gradient)" />
      </svg>

      {/* Modern Typographic Wordmark */}
      {showText && (
        <div className="flex items-baseline tracking-tight font-sans">
          <span className={`text-lg font-extrabold ${textColor || "text-foreground"} tracking-tight`}>
            ul<span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-black">0</span>
          </span>
          <span className="text-[11px] font-mono font-medium text-muted-foreground ml-0.5 opacity-80">
            .site
          </span>
        </div>
      )}
    </div>
  )
}
