"use client"

import { useEffect, useRef, useState } from "react"

export interface AdBannerProps {
  slot?: number
  type?: "large" | "small"
}

// Ad keys
const AD_KEY_LARGE = "ea31a2b23b71044ce04e59b9147c7ffc" // 728x90
const AD_KEY_SMALL = "1ef074fb53b9c298ba4b329b92f27240" // 468x60

/**
 * Renders Adsterra banner ads inside a sandboxed iframe (srcdoc).
 *
 * WHY: Adsterra's invoke.js attaches onclick handlers to the *parent* document,
 * causing the entire page to redirect on any click (popunder behaviour).
 * By running the ad script inside an iframe with sandbox="allow-scripts allow-popups"
 * the scripts are fully isolated — they can open popups/new tabs when the user
 * clicks *inside* the ad area, but they cannot touch the parent document at all.
 */
export function AdBanner({ slot = 1, type = "large" }: AdBannerProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!mounted) return null

  const adKey = type === "large" ? AD_KEY_LARGE : AD_KEY_SMALL

  // Responsive dimensions
  const width  = isMobile ? (type === "large" ? 320 : 300) : (type === "large" ? 728 : 468)
  const height = isMobile ? (type === "large" ? 100 : 50)  : (type === "large" ? 90  : 60)

  // The ad HTML runs entirely inside the sandboxed iframe.
  // allow-scripts  → lets Adsterra JS run
  // allow-popups   → lets ad open new tabs/windows on click
  // allow-same-origin is intentionally OMITTED to prevent parent DOM access
  const srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin:0; padding:0; overflow:hidden; }
  body { width:${width}px; height:${height}px; }
</style>
</head>
<body>
<script>
var atOptions = {
  'key': '${adKey}',
  'format': 'iframe',
  'height': ${height},
  'width': ${width},
  'params': {}
};
<\/script>
<script src="//www.highperformanceformat.com/${adKey}/invoke.js"><\/script>
</body>
</html>`

  return (
    <div className="w-full flex justify-center py-2 px-2">
      <iframe
        srcDoc={srcdoc}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        scrolling="no"
        frameBorder="0"
        width={width}
        height={height}
        style={{
          maxWidth: "100%",
          border: "none",
          overflow: "hidden",
          display: "block",
        }}
        title={`Advertisement ${slot}`}
      />
    </div>
  )
}
