"use client"

import React from "react"
import { UL0Icon } from "./ul0-icon"

export function FloatingActionDock() {
  const handleScroll = (tab?: "link" | "qr") => {
    const el = document.getElementById("shortener")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      if (tab) {
        window.dispatchEvent(new CustomEvent("ul0:set-tab", { detail: { tab } }))
      }
    }
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 p-1.5 pl-3.5 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-200 select-none animate-in fade-in slide-in-from-bottom-4"
      role="region"
      aria-label="Quick Actions Dock"
    >
      <span className="text-xs font-bold tracking-tight pr-1">Start now:</span>
      <button
        type="button"
        onClick={() => handleScroll("link")}
        className="h-8 w-8 rounded-full bg-white text-foreground hover:bg-neutral-100 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-xs cursor-pointer"
        title="Shorten a link"
        aria-label="Shorten a link"
      >
        <UL0Icon name="link" size={16} />
      </button>
      <button
        type="button"
        onClick={() => handleScroll("qr")}
        className="h-8 w-8 rounded-full bg-white text-foreground hover:bg-neutral-100 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-xs cursor-pointer"
        title="Generate dynamic QR code"
        aria-label="Generate dynamic QR code"
      >
        <UL0Icon name="qr" size={16} />
      </button>
    </div>
  )
}
