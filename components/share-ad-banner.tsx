"use client"

import { useEffect, useRef } from "react"

export function ShareAdBanner() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up previous children
    containerRef.current.innerHTML = ""

    // Create inline script setting atOptions
    const optsScript = document.createElement("script")
    optsScript.type = "text/javascript"
    optsScript.text = `
      atOptions = {
        'key' : '25084f2a22060ec74cff3a46dbf2fb73',
        'format' : 'iframe',
        'height' : 300,
        'width' : 160,
        'params' : {}
      };
    `

    // Create external invoke script
    const invokeScript = document.createElement("script")
    invokeScript.type = "text/javascript"
    invokeScript.src = "https://unsettledradiator.com/25084f2a22060ec74cff3a46dbf2fb73/invoke.js"
    invokeScript.async = true

    containerRef.current.appendChild(optsScript)
    containerRef.current.appendChild(invokeScript)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xs shadow-xs text-center">
      <span className="text-[10px] font-mono tracking-widest text-muted-foreground/60 uppercase mb-2">
        Sponsored
      </span>
      <div 
        ref={containerRef} 
        className="w-[160px] h-[300px] overflow-hidden rounded-xl bg-muted/20 flex items-center justify-center"
      />
    </div>
  )
}
