"use client"

import React, { useState, useMemo } from "react"
import { UL0Icon } from "@/components/ul0-icon"

const ALL_ICONS = [
  "analytics", "api", "apikey", "arrowdown", "arrowleft", "arrowright", "arrowup", "bell", "billing", "blog",
  "bolt", "bookmark", "bulb", "calendar", "campaign", "cart", "chartline", "chartpie", "chat", "check",
  "checker", "clock", "close", "cloud", "code", "coin", "compare", "copy", "crown", "dashboard",
  "database", "desktop", "diamond", "docs", "domain", "download", "edit", "empty", "error", "external",
  "eye", "eyeoff", "facebook", "faq", "filter", "flag", "folder", "gift", "heart", "home",
  "image", "info", "instagram", "instant", "lang-ar", "lang-bn", "lang-de", "lang-en", "lang-es", "lang-fr",
  "lang-hi", "lang-it", "lang-ja", "lang-ko", "lang-pt", "lang-ru", "lang-ta", "lang-tr", "lang-vi", "lang-zh",
  "language", "laptop", "link", "linkedin", "linkinbio", "loading",
  "lock", "login", "logout", "mail", "maintenance", "medal", "mic", "minus", "mobile", "music",
  "noads", "nocookie", "notfound", "opensource", "palette", "pdf", "percent", "phone", "pin", "play",
  "plug", "plus", "pricing", "privacy", "qr", "refresh", "rocket", "rss", "scissors", "search",
  "server", "settings", "share", "shield", "signup", "sparkles", "splitbill", "star", "status", "tablet",
  "target", "team", "telegram", "terminal", "terms", "texttools", "tools", "trash", "trophy", "unlock",
  "upload", "user", "video", "wallet", "wand", "warning", "whatsapp", "wifi", "x"
]

export function IconsGalleryClient() {
  const [query, setQuery] = useState("")
  const [variant, setVariant] = useState<"clean" | "tile">("clean")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_ICONS
    return ALL_ICONS.filter((name) => name.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Icon Library Showcase ({ALL_ICONS.length} Custom Vector Marks)
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Duo-tone vector illustrations crafted exclusively for the UL0 interface, including regional language glyphs.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Variant Selector */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-card border border-border text-xs">
            <button
              type="button"
              onClick={() => setVariant("clean")}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                variant === "clean"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Clean Vector
            </button>
            <button
              type="button"
              onClick={() => setVariant("tile")}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                variant === "tile"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Framed Tile
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <UL0Icon name="search" size={15} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons..."
              className="w-full h-9 pl-9 pr-3 rounded-full bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
        {filtered.map((iconName) => (
          <div
            key={iconName}
            className="group rounded-2xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-all shadow-2xs hover:shadow-xs hover:bg-surface-2/40"
          >
            <div className="p-2 transition-transform group-hover:scale-110">
              <UL0Icon name={iconName} variant={variant} size={variant === "tile" ? 52 : 44} />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground truncate max-w-full">
              {iconName}
            </span>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No custom icons match &quot;{query}&quot;.
        </div>
      )}
    </div>
  )
}

