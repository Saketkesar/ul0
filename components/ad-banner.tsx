"use client"

import { useEffect, useState } from "react"

export interface AdBannerProps {
  slot?: number
  type?: "large" | "small"
  scripts?: Array<{
    iframe?: boolean
    src?: string
    width?: number
    height?: number
  }>
}

// Adsterra keys from adsscript.txt
const AD_KEY_LARGE = "ea31a2b23b71044ce04e59b9147c7ffc" // 728x90
const AD_KEY_SMALL = "1ef074fb53b9c298ba4b329b92f27240" // 468x60
const AD_DOMAIN = "https://corruptioneasiestsubmarine.com"

/**
 * Renders Adsterra banner ads inside a sandboxed iframe (srcdoc).
 *
 * WHY: Adsterra's invoke.js attaches onclick handlers to the *parent* document,
 * causing popunder behavior. Running inside a sandboxed iframe with
 * `sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"`
 * isolates the script while letting ads load and open tabs when clicked.
 */
export function AdBanner({ slot = 1, type = "large", scripts }: AdBannerProps) {
  const [mounted, setMounted] = useState(false)
  const [scale, setScale] = useState(1)

  const customScript = scripts && scripts[0]
  const defaultKey = type === "large" ? AD_KEY_LARGE : AD_KEY_SMALL
  const adKey = customScript?.src
    ? customScript.src.split("/")[3] || defaultKey
    : defaultKey

  const adSrc = customScript?.src || `${AD_DOMAIN}/${adKey}/invoke.js`
  const baseWidth = customScript?.width || (type === "large" ? 728 : 468)
  const baseHeight = customScript?.height || (type === "large" ? 90 : 60)

  useEffect(() => {
    setMounted(true)
    const updateScale = () => {
      if (typeof window === "undefined") return
      const containerPadding = 32
      const availableW = window.innerWidth - containerPadding
      if (availableW < baseWidth) {
        setScale(Math.max(0.4, availableW / baseWidth))
      } else {
        setScale(1)
      }
    }
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [baseWidth])

  if (!mounted) return null

  // Adsterra requires atOptions.width and atOptions.height to match registered zone dimensions exactly.
  // Using explicit https:// protocol prevents about:srcdoc resolution errors.
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
      className="w-full flex justify-center items-center py-2 px-2 overflow-hidden"
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
