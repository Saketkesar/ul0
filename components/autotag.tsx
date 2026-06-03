"use client"

import { useEffect } from "react"

export function Autotag() {
  useEffect(() => {
    // Ads removed: do not load external ad libraries. Keep function as no-op.
    try {
      localStorage.setItem("autotag_disabled", "true")
    } catch {}
  }, [])

  return null
}
