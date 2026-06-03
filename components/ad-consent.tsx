"use client"

import { useEffect, useState } from "react"

export function AdConsent() {
  const [visible, setVisible] = useState(false)
  const key = "ul0_ad_consent"

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key)
      if (!stored) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    try { sessionStorage.setItem(key, "accepted") } catch {}
    setVisible(false)
  }

  const decline = () => {
    try { sessionStorage.setItem(key, "declined") } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto max-w-xl w-full bg-white/95 dark:bg-slate-900/95 border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1 text-sm text-slate-900 dark:text-slate-100">
            <strong className="block font-semibold">This website contains ads to keep the service free</strong>
            <p className="mt-1">Please support us by allowing ads or disabling your ad blocker. We respect your privacy and only show non-intrusive ads.</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={accept} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Allow Ads</button>
            <button onClick={decline} className="px-3 py-1 border rounded text-sm">No Thanks</button>
          </div>
        </div>
      </div>
    </div>
  )
}
