"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

interface VideoAdModalProps {
  isOpen: boolean
  onClose: () => void
  onAdComplete: () => void
}

export function VideoAdModal({ isOpen, onClose, onAdComplete }: VideoAdModalProps) {
  // Ads removed: immediately signal that the ad has completed so callers proceed
  useEffect(() => {
    if (isOpen) {
      // Give a micro-delay so UI updates predictably
      const t = setTimeout(() => {
        try {
          onAdComplete()
        } catch {}
        try {
          onClose()
        } catch {}
      }, 50)
      return () => clearTimeout(t)
    }
  }, [isOpen, onAdComplete, onClose])

  return null
}
