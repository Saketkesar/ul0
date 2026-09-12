"use client"

import { useEffect, useRef } from "react"

/**
 * Loads Adsterra ads inside sandboxed iframes to prevent redirect hijacking.
 * The sandbox attribute blocks top-level navigation while allowing scripts.
 */
function createSandboxedAd(
  container: HTMLDivElement,
  key: string,
  width: number,
  height: number
) {
  container.innerHTML = ""

  const iframe = document.createElement("iframe")
  iframe.style.width = `${width}px`
  iframe.style.maxWidth = "100%"
  iframe.style.height = `${height}px`
  iframe.style.border = "none"
  iframe.style.overflow = "hidden"
  iframe.style.display = "block"
  iframe.style.margin = "0 auto"
  // Sandbox: allow scripts but BLOCK top-level navigation (prevents redirects)
  iframe.setAttribute("sandbox", "allow-scripts allow-popups allow-same-origin")
  iframe.setAttribute("scrolling", "no")

  const html = `<!DOCTYPE html>
<html><head><style>body{margin:0;overflow:hidden;display:flex;align-items:center;justify-content:center;width:${width}px;height:${height}px}</style></head>
<body>
<script type="text/javascript">
atOptions = { 'key' : '${key}', 'format' : 'iframe', 'height' : ${height}, 'width' : ${width}, 'params' : {} };
</script>
<script type="text/javascript" src="https://unsettledradiator.com/${key}/invoke.js"></script>
</body></html>`

  iframe.srcdoc = html
  container.appendChild(iframe)
}

export function PdfAdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null)
  const sideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 468x60 horizontal banner
    if (bannerRef.current) {
      createSandboxedAd(
        bannerRef.current,
        "1ef074fb53b9c298ba4b329b92f27240",
        468,
        60
      )
    }

    // 160x300 sidebar banner (desktop only)
    if (sideRef.current) {
      createSandboxedAd(
        sideRef.current,
        "25084f2a22060ec74cff3a46dbf2fb73",
        160,
        300
      )
    }

    return () => {
      if (bannerRef.current) bannerRef.current.innerHTML = ""
      if (sideRef.current) sideRef.current.innerHTML = ""
    }
  }, [])

  return { bannerRef, sideRef }
}
