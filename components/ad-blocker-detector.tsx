"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function AdBlockerDetector() {
  // Ads removed: do not detect or prompt users. Mark dismissed to avoid future checks.
  useEffect(() => {
    try { localStorage.setItem("adblock-popup-dismissed", "true") } catch {}
  }, [])

  return null
}
