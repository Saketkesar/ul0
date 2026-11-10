"use client"

import { useEffect, useRef, useState } from "react"

export interface AdBannerProps {
  slot?: number
  type?: "large" | "small" | "skyscraper" | "medium_skyscraper"
  scriptKey?: string
  width?: number
  height?: number
  scripts?: any
}

const AD_DOMAIN = "https://unsettledradiator.com"

const AD_CONFIGS = {
  large: { key: "ea31a2b23b71044ce04e59b9147c7ffc", width: 728, height: 90 },
  small: { key: "1ef074fb53b9c298ba4b329b92f27240", width: 468, height: 60 },
  skyscraper: { key: "c675322a5f6d9f2ad9e187be52a5721e", width: 160, height: 600 },
  medium_skyscraper: { key: "25084f2a22060ec74cff3a46dbf2fb73", width: 160, height: 300 },
}

/**
 * Sandboxed Ad Banner Component
 * Isolates ad network scripts inside a sandboxed iframe to prevent top-level redirect hijacking,
 * while allowing ads to render and open tabs safely upon user click.
 */
export function AdBanner({ slot = 1, type = "large", scriptKey, width, height, scripts }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const customScript = scripts && Array.isArray(scripts) && scripts[0]
  const config = AD_CONFIGS[type] || AD_CONFIGS.large
  const finalKey = customScript?.src
    ? customScript.src.split("/")[3] || config.key
    : scriptKey || config.key
  const baseW = width || customScript?.width || config.width
  const baseH = height || customScript?.height || config.height

  useEffect(() => {
    const updateScale = () => {
      if (typeof window === "undefined") return
      const availableW = window.innerWidth - 32
      if (availableW < baseW) {
        setScale(Math.max(0.4, availableW / baseW))
      } else {
        setScale(1)
      }
    }

    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [baseW])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.innerHTML = ""

    const iframe = document.createElement("iframe")
    iframe.style.width = `${baseW}px`
    iframe.style.height = `${baseH}px`
    iframe.style.border = "none"
    iframe.style.overflow = "hidden"
    iframe.style.display = "block"
    iframe.style.background = "transparent"
    iframe.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-same-origin")
    iframe.setAttribute("scrolling", "no")
    iframe.title = `Advertisement ${slot}`

    const adSrc = customScript?.src || `${AD_DOMAIN}/${finalKey}/invoke.js`
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin:0; padding:0; overflow:hidden; }
  html, body { width: ${baseW}px; height: ${baseH}px; background: transparent; display: flex; align-items: center; justify-content: center; }
</style>
</head>
<body>
<script type="text/javascript">
var atOptions = {
  'key': '${finalKey}',
  'format': 'iframe',
  'height': ${baseH},
  'width': ${baseW},
  'params': {}
};
</script>
<script type="text/javascript" src="${adSrc}"></script>
</body>
</html>`

    iframe.srcdoc = html
    el.appendChild(iframe)

    return () => {
      if (el) el.innerHTML = ""
    }
  }, [finalKey, baseW, baseH, slot, customScript])

  const containerH = Math.round(baseH * scale)

  return (
    <div
      className="w-full flex justify-center items-center py-2 px-1 overflow-hidden"
      style={{ minHeight: `${Math.min(containerH, 60)}px` }}
    >
      <div
        style={{
          width: baseW,
          height: baseH,
          transform: scale < 1 ? `scale(${scale})` : "none",
          transformOrigin: "center center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div ref={containerRef} style={{ width: baseW, height: baseH }} />
      </div>
    </div>
  )
}
