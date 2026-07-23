"use client"

import { useEffect, useRef } from "react"

export interface AdBannerProps {
  slot?: number
  type?: "large" | "small" | "skyscraper" | "medium_skyscraper"
  scriptKey?: string
  width?: number
  height?: number
}

const AD_DOMAIN = "https://unsettledradiator.com"

const AD_CONFIGS = {
  large: { key: "ea31a2b23b71044ce04e59b9147c7ffc", width: 728, height: 90 },
  small: { key: "1ef074fb53b9c298ba4b329b92f27240", width: 468, height: 60 },
  skyscraper: { key: "c675322a5f6d9f2ad9e187be52a5721e", width: 160, height: 600 },
  medium_skyscraper: { key: "25084f2a22060ec74cff3a46dbf2fb73", width: 160, height: 300 },
}

/**
 * Direct DOM script injection component for Adsterra banners.
 *
 * WHY DIRECT INJECTION:
 * Adsterra's invoke.js checks `window.location.hostname` against the user's
 * registered domain (ul0.site). Using srcdoc hidden domain context (about:srcdoc)
 * causes Adsterra to return blank 0-byte responses. Direct DOM injection allows
 * Adsterra to verify `ul0.site` and serve ads reliably.
 *
 * NO AUTO-REDIRECT:
 * A MutationObserver attaches sandbox restriction attributes (`allow-scripts allow-popups allow-forms`)
 * to any iframe created by Adsterra, stripping `allow-top-navigation` to prevent parent page redirects.
 */
export function AdBanner({ slot = 1, type = "large", scriptKey, width, height }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const config = AD_CONFIGS[type] || AD_CONFIGS.large
  const finalKey = scriptKey || config.key
  const finalW = width || config.width
  const finalH = height || config.height

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.innerHTML = ""

    const wrapper = document.createElement("div")
    wrapper.style.width = "100%"
    wrapper.style.maxWidth = `${finalW}px`
    wrapper.style.height = `${finalH}px`
    wrapper.style.margin = "0 auto"
    wrapper.style.overflow = "hidden"
    wrapper.style.display = "flex"
    wrapper.style.justifyContent = "center"
    wrapper.style.alignItems = "center"

    // Observe when Adsterra creates an iframe and enforce sandbox security
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeName === "IFRAME") {
            const iframe = node as HTMLIFrameElement
            iframe.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms")
          }
        })
      })
    })

    observer.observe(wrapper, { childList: true, subtree: true })

    const optsScript = document.createElement("script")
    optsScript.type = "text/javascript"
    optsScript.text = `
      atOptions = {
        'key' : '${finalKey}',
        'format' : 'iframe',
        'height' : ${finalH},
        'width' : ${finalW},
        'params' : {}
      };
    `

    const invokeScript = document.createElement("script")
    invokeScript.type = "text/javascript"
    invokeScript.src = `${AD_DOMAIN}/${finalKey}/invoke.js`
    invokeScript.async = true

    wrapper.appendChild(optsScript)
    wrapper.appendChild(invokeScript)
    el.appendChild(wrapper)

    return () => {
      observer.disconnect()
      if (el) el.innerHTML = ""
    }
  }, [finalKey, finalW, finalH])

  return (
    <div className="w-full flex justify-center items-center py-2 px-1 overflow-hidden">
      <div
        ref={containerRef}
        className="w-full flex justify-center items-center overflow-hidden"
        style={{ minHeight: `${Math.min(finalH, 60)}px` }}
      />
    </div>
  )
}
