"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, ExternalLink, ArrowLeft, X } from "lucide-react"
import Image from "next/image"

export function AdDisclaimerPopup() {
  // Ads removed: do not show disclaimer. Mark acknowledged so any other checks won't show.
  useEffect(() => {
    try { localStorage.setItem("adDisclaimerAcknowledged", "true") } catch {}
  }, [])

  return null
}
