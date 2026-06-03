"use client"

import { useEffect, useRef, useState } from "react"

export interface AdBannerProps {
  slot?: number
  type?: "large" | "small"
}

// Ad keys
const AD_KEY_LARGE = "ea31a2b23b71044ce04e59b9147c7ffc" // 728x90
const AD_KEY_SMALL = "1ef074fb53b9c298ba4b329b92f27240" // 468x60

// Ad banner component - direct script injection (as Adsterra requires)
export function AdBanner({ slot = 1, type = "large" }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const loadedRef = useRef(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!containerRef.current || loadedRef.current) return
    loadedRef.current = true

    const adKey = type === "large" ? AD_KEY_LARGE : AD_KEY_SMALL
    
    // Dimensions based on screen size
    let width = type === "large" ? 728 : 468
    let height = type === "large" ? 90 : 60
    
    if (isMobile) {
      width = type === "large" ? 320 : 300
      height = type === "large" ? 100 : 50
    }

    const container = containerRef.current

    // Create unique options variable to avoid conflicts
    const optionsScript = document.createElement("script")
    optionsScript.textContent = `
      var atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `
    container.appendChild(optionsScript)

    // Load the invoke script
    const invokeScript = document.createElement("script")
    invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`
    invokeScript.async = true
    container.appendChild(invokeScript)

  }, [type, isMobile])

  // Dimensions for container
  const width = isMobile ? (type === "large" ? 320 : 300) : (type === "large" ? 728 : 468)
  const height = isMobile ? (type === "large" ? 100 : 50) : (type === "large" ? 90 : 60)

  return (
    <div className="w-full flex justify-center py-2 px-2">
      <div 
        ref={containerRef}
        className="flex items-center justify-center overflow-hidden bg-muted/20 rounded"
        style={{ 
          width: width,
          maxWidth: "100%",
          minHeight: height
        }}
      />
    </div>
  )
}
