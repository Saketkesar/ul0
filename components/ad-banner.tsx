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
 * Direct Script Injection Ad Banner Component
 * Adsterra's invoke.js validates window.location.hostname against ul0.site.
 * Direct DOM injection allows Adsterra to verify domain approval and render ads.
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

    // Create a friendly same-origin iframe to isolate window.atOptions
    // and prevent race conditions between multiple concurrent ad slots.
    const iframe = document.createElement("iframe")
    iframe.id = `adsterra-frame-${slot}-${finalKey}`
    iframe.width = `${baseW}`
    iframe.height = `${baseH}`
    iframe.style.width = `${baseW}px`
    iframe.style.height = `${baseH}px`
    iframe.style.border = "none"
    iframe.style.overflow = "hidden"
    iframe.scrolling = "no"
    el.appendChild(iframe)

    try {
      const doc = iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <base target="_blank">
              <style>
                * { box-sizing: border-box; }
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key': '${finalKey}',
                  'format': 'iframe',
                  'height': ${baseH},
                  'width': ${baseW},
                  'params': {}
                };
              </script>
              <script type="text/javascript" src="${customScript?.src || `${AD_DOMAIN}/${finalKey}/invoke.js`}"></script>
            </body>
          </html>
        `)
        doc.close()
      }
    } catch (e) {
      console.error("AdBanner iframe rendering error:", e)
    }

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
