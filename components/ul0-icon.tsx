import React from "react"
import Image from "next/image"

export type UL0IconName =
  | "analytics"
  | "api"
  | "apikey"
  | "arrowdown"
  | "arrowleft"
  | "arrowright"
  | "arrowup"
  | "bell"
  | "billing"
  | "blog"
  | "bolt"
  | "bookmark"
  | "bulb"
  | "calendar"
  | "campaign"
  | "cart"
  | "chartline"
  | "chartpie"
  | "chat"
  | "check"
  | "checker"
  | "clock"
  | "close"
  | "cloud"
  | "code"
  | "coin"
  | "compare"
  | "copy"
  | "crown"
  | "dashboard"
  | "database"
  | "desktop"
  | "diamond"
  | "docs"
  | "domain"
  | "download"
  | "edit"
  | "empty"
  | "error"
  | "external"
  | "eye"
  | "eyeoff"
  | "facebook"
  | "faq"
  | "filter"
  | "flag"
  | "folder"
  | "gift"
  | "heart"
  | "home"
  | "image"
  | "info"
  | "instagram"
  | "instant"
  | "link"
  | "linkinbio"
  | "linkedin"
  | "lock"
  | "login"
  | "logout"
  | "mail"
  | "maintenance"
  | "medal"
  | "mic"
  | "minus"
  | "mobile"
  | "music"
  | "noads"
  | "nocookie"
  | "notfound"
  | "opensource"
  | "palette"
  | "pdf"
  | "percent"
  | "phone"
  | "pin"
  | "play"
  | "plug"
  | "plus"
  | "pricing"
  | "privacy"
  | "qr"
  | "refresh"
  | "rocket"
  | "rss"
  | "scissors"
  | "search"
  | "server"
  | "settings"
  | "share"
  | "shield"
  | "signup"
  | "sparkles"
  | "splitbill"
  | "star"
  | "status"
  | "tablet"
  | "target"
  | "team"
  | "telegram"
  | "terminal"
  | "terms"
  | "texttools"
  | "tools"
  | "trash"
  | "trophy"
  | "unlock"
  | "upload"
  | "user"
  | "video"
  | "wallet"
  | "wand"
  | "warning"
  | "whatsapp"
  | "wifi"
  | "x"

interface UL0IconProps {
  name: UL0IconName | string
  variant?: "clean" | "tile"
  size?: number
  className?: string
  alt?: string
}

export function UL0Icon({
  name,
  variant = "clean",
  size = 24,
  className = "",
  alt,
}: UL0IconProps) {
  const iconPath = `/ul0-icon-kit/svg/${variant}/ul0-${name}.svg`
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconPath}
        alt={alt || `${name} icon`}
        width={size}
        height={size}
        className="w-full h-full object-contain pointer-events-none select-none"
        loading="lazy"
      />
    </span>
  )
}
