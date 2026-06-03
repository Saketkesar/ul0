"use client"

import { useEffect, useState } from "react"

interface InterstitialAdProps {
  isOpen: boolean
  onClose: () => void
}

export default function InterstitialAd({ isOpen, onClose }: InterstitialAdProps) {
  const [visible, setVisible] = useState(isOpen)

  useEffect(() => setVisible(isOpen), [isOpen])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded bg-white p-6">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-bold">Sponsored</h3>
          <p className="text-sm text-muted-foreground">This is a placeholder interstitial. No external ad scripts are loaded.</p>
        </div>
        <div className="mb-4 h-40 rounded bg-muted" />
        <div className="flex justify-end">
          <button
            className="inline-flex items-center rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => {
              setVisible(false)
              try { onClose() } catch {}
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
