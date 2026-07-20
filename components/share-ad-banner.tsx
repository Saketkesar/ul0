"use client"

import { useEffect, useRef } from "react"

interface ShareAdBannerProps {
  label?: string
  className?: string
}

export function ShareAdBanner({ label = "Sponsored", className = "" }: ShareAdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous contents to prevent duplicates
    containerRef.current.innerHTML = ""

    const wrapper = document.createElement("div")
    wrapper.style.width = "160px"
    wrapper.style.height = "300px"
    wrapper.style.margin = "0 auto"

    // Inline script defining atOptions
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

    // External script loading invoke.js
    const invokeScript = document.createElement("script")
    invokeScript.type = "text/javascript"
    invokeScript.src = "https://unsettledradiator.com/25084f2a22060ec74cff3a46dbf2fb73/invoke.js"
    invokeScript.async = true

    wrapper.appendChild(optsScript)
    wrapper.appendChild(invokeScript)
    containerRef.current.appendChild(wrapper)
  }, [])

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-md p-4 shadow-lg text-center transition-all hover:border-primary/40 ${className}`}>
      <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-primary/80 uppercase">
          {label}
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <div 
        ref={containerRef} 
        className="w-[160px] h-[300px] mx-auto overflow-hidden rounded-2xl bg-muted/30 flex items-center justify-center border border-border/30"
      />
    </div>
  )
}
