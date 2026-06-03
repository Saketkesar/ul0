"use client"

import { useEffect, useRef, useState } from "react"

type AdScript = {
  id?: string
  src?: string
  async?: boolean
  attrs?: Record<string, string>
  inline?: string // inline JS
  iframe?: boolean // load inside sandboxed iframe
  width?: number
  height?: number
}

interface AdLoaderProps {
  scripts: AdScript[]
}

// Client-side loader that will only inject scripts after consent and admin flag
export default function AdLoader({ scripts }: AdLoaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [enabled, setEnabled] = useState(true)

  // Ads are now always enabled, no consent required

  useEffect(() => {
    if (!enabled) return
    if (!containerRef.current) return

    const created: HTMLScriptElement[] = []

    scripts.forEach((s) => {
      // Direct script injection (no iframe wrapper - Adsterra needs direct DOM access)
      if (s.src || s.inline) {
        const el = document.createElement('script')
        if (s.src) el.src = s.src
        if (s.async !== false) el.async = true
        if (s.attrs) Object.entries(s.attrs).forEach(([k, v]) => el.setAttribute(k, v))
        if (s.inline && !s.src) el.textContent = s.inline
        if (containerRef.current) containerRef.current.appendChild(el)
        created.push(el)
      }
    })

    return () => {
      // cleanup injected scripts
      created.forEach((c) => c.remove())
    }
  }, [enabled, scripts])

  // Render the container where scripts or iframes will be injected
  return <div ref={containerRef} />
}
