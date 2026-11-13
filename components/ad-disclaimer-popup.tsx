"use client"

import { useEffect } from "react"

export function AdDisclaimerPopup() {
  // Ads removed: do not show disclaimer. Mark acknowledged so any other checks won't show.
  useEffect(() => {
    try { localStorage.setItem("adDisclaimerAcknowledged", "true") } catch {}
  }, [])

  return null
}
