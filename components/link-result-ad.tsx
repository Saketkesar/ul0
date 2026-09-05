"use client"

import { useEffect, useRef } from "react"
import { AlertTriangle, ArrowDown } from "lucide-react"

export function LinkResultAd() {
  const container300Ref = useRef<HTMLDivElement>(null)
  const container468Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Inject 160x300 Skyscraper Ad (Key: 25084f2a22060ec74cff3a46dbf2fb73)
    if (container300Ref.current) {
      container300Ref.current.innerHTML = ""

      const wrapper = document.createElement("div")
      wrapper.style.width = "160px"
      wrapper.style.height = "300px"
      wrapper.style.margin = "0 auto"
      wrapper.style.overflow = "hidden"
      wrapper.style.display = "flex"
      wrapper.style.justifyContent = "center"
      wrapper.style.alignItems = "center"

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

      const invokeScript = document.createElement("script")
      invokeScript.type = "text/javascript"
      invokeScript.src = "https://unsettledradiator.com/25084f2a22060ec74cff3a46dbf2fb73/invoke.js"
      invokeScript.async = true

      wrapper.appendChild(optsScript)
      wrapper.appendChild(invokeScript)
      container300Ref.current.appendChild(wrapper)
    }

    // 2. Inject 468x60 Banner Ad (Key: 1ef074fb53b9c298ba4b329b92f27240)
    if (container468Ref.current) {
      container468Ref.current.innerHTML = ""

      const wrapper = document.createElement("div")
      wrapper.style.width = "100%"
      wrapper.style.maxWidth = "468px"
      wrapper.style.height = "60px"
      wrapper.style.margin = "0 auto"
      wrapper.style.overflow = "hidden"
      wrapper.style.display = "flex"
      wrapper.style.justifyContent = "center"
      wrapper.style.alignItems = "center"

      const optsScript = document.createElement("script")
      optsScript.type = "text/javascript"
      optsScript.text = `
        atOptions = {
          'key' : '1ef074fb53b9c298ba4b329b92f27240',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `

      const invokeScript = document.createElement("script")
      invokeScript.type = "text/javascript"
      invokeScript.src = "https://unsettledradiator.com/1ef074fb53b9c298ba4b329b92f27240/invoke.js"
      invokeScript.async = true

      wrapper.appendChild(optsScript)
      wrapper.appendChild(invokeScript)
      container468Ref.current.appendChild(wrapper)
    }

    return () => {
      if (container300Ref.current) container300Ref.current.innerHTML = ""
      if (container468Ref.current) container468Ref.current.innerHTML = ""
    }
  }, [])

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card/80 to-background p-4 sm:p-5 shadow-md">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
            Sponsored Advertisements
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">Server Support</span>
      </div>

      {/* Visitor Notice Box (Full Width) */}
      <div className="space-y-2 text-left mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          Notice to visitors
        </div>
        
        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
          These are third-party ads. Please don&apos;t click on them unless you intend to — they are third-party sponsored content.
        </p>

        <p className="text-xs text-muted-foreground leading-relaxed">
          This is <strong>ul0.site&apos;s main income source</strong> to pay for servers, domain infrastructure, and keep all link tools 100% free with no mandatory fees. Sorry for any inconvenience!
        </p>
      </div>

      {/* Flowing Arrow Indicator */}
      <div className="flex items-center justify-center gap-2 py-2 mb-3 text-xs font-semibold text-amber-600 dark:text-amber-400 border-t border-border/40">
        <span>Sponsored ads</span>
        <span className="flex items-center gap-1 font-mono text-sm tracking-tighter animate-pulse">
          ↓ ↓ ↓
        </span>
        <ArrowDown className="h-4 w-4" />
      </div>

      {/* 2 Distinct Responsive Ad Units */}
      <div className="flex flex-col items-center justify-center gap-3 w-full">
        {/* Banner 1: 468x60 Horizontal Banner (Fully Responsive) */}
        <div
          ref={container468Ref}
          className="w-full max-w-[468px] h-[60px] overflow-hidden rounded-xl bg-muted/10 flex items-center justify-center border border-border/60 shadow-inner"
        />

        {/* Banner 2: 160x300 Skyscraper Banner */}
        <div
          ref={container300Ref}
          className="w-[160px] h-[300px] overflow-hidden rounded-xl bg-muted/10 flex items-center justify-center border border-border/60 shadow-inner shrink-0"
        />
      </div>
    </div>
  )
}
