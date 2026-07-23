"use client"

import { useEffect, useState } from "react"

export interface AdBannerProps {
  slot?: number
  type?: "large" | "small" | "skyscraper" | "medium_skyscraper"
  scripts?: Array<{
    iframe?: boolean
    src?: string
    width?: number
    height?: number
  }>
}

// Adsterra ad keys on unsettledradiator.com
const AD_DOMAIN = "https://unsettledradiator.com"

const AD_KEYS = {
  large: { key: "ea31a2b23b71044ce04e59b9147c7ffc", width: 728, height: 90 },
  small: { key: "1ef074fb53b9c298ba4b329b92f27240", width: 468, height: 60 },
  skyscraper: { key: "c675322a5f6d9f2ad9e187be52a5721e", width: 160, height: 600 },
  medium_skyscraper: { key: "25084f2a22060ec74cff3a46dbf2fb73", width: 160, height: 300 },
}

/**
 * Renders Adsterra banner ads inside a sandboxed iframe (srcdoc).
 *
 * PREVENTS AUTO-REDIRECTS:
 * By running the script inside an iframe with sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
 * without `allow-top-navigation` or `allow-same-origin`, the script can NEVER redirect or navigate the parent page.
 */
export function AdBanner({ slot = 1, type = "large", scripts }: AdBannerProps) {
  const [mounted, setMounted] = useState(false)
  const [scale, setScale] = useState(1)

  const preset = AD_KEYS[type] || AD_KEYS.large
  const customScript = scripts && scripts[0]
  const adKey = customScript?.src
    ? customScript.src.split("/")[3] || preset.key
    : preset.key

  const adSrc = customScript?.src || `${AD_DOMAIN}/${adKey}/invoke.js`
  const baseWidth = customScript?.width || preset.width
  const baseHeight = customScript?.height || preset.height

  useEffect(() => {
    setMounted(true)
    const updateScale = () => {
      if (typeof window === "undefined") return
      const containerPadding = 24
      const availableW = window.innerWidth - containerPadding
      if (availableW < baseWidth) {
        setScale(Math.max(0.35, availableW / baseWidth))
      } else {
        setScale(1)
      }
    }
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [baseWidth])

  if (!mounted) return null

  // Adsterra requires atOptions width and height to match registered zone dimensions.
  const srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin:0; padding:0; overflow:hidden; }
  html, body { width: ${baseWidth}px; height: ${baseHeight}px; background: transparent; }
</style>
</head>
<body>
<script type="text/javascript">
var atOptions = {
  'key': '${adKey}',
  'format': 'iframe',
  'height': ${baseHeight},
  'width': ${baseWidth},
  'params': {}
};
</script>
<script type="text/javascript" src="${adSrc}"></script>
</body>
</html>`

  const containerHeight = Math.round(baseHeight * scale)

  return (
    <div
      className="w-full flex justify-center items-center py-1.5 px-1 overflow-hidden"
      style={{ minHeight: containerHeight }}
    >
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: scale < 1 ? `scale(${scale})` : "none",
          transformOrigin: "center center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <iframe
          srcDoc={srcdoc}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
          scrolling="no"
          frameBorder="0"
          width={baseWidth}
          height={baseHeight}
          style={{
            width: `${baseWidth}px`,
            height: `${baseHeight}px`,
            border: "none",
            overflow: "hidden",
            display: "block",
            background: "transparent",
          }}
          title={`Advertisement ${slot}`}
        />
      </div>
    </div>
  )
}
