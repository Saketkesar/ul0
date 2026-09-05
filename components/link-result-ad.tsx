"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, Info, AlertTriangle } from "lucide-react"

export function LinkResultAd() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ""

    const wrapper = document.createElement("div")
    wrapper.style.width = "160px"
    wrapper.style.height = "300px"
    wrapper.style.margin = "0 auto"

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
    containerRef.current.appendChild(wrapper)
  }, [])

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card/80 to-background p-4 sm:p-5 shadow-md">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
            Sponsored Advertisement
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">Server Support</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        {/* User warning & explanation message with flowing arrow */}
        <div className="flex-1 space-y-2.5 text-left">
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

          <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>Sponsored ad</span>
            <span className="flex items-center gap-1 font-mono text-sm tracking-tighter animate-pulse">
              → → →
            </span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* Ad container (160x300) */}
        <div className="shrink-0 flex flex-col items-center">
          <div
            ref={containerRef}
            className="w-[160px] h-[300px] overflow-hidden rounded-xl bg-muted/20 flex items-center justify-center border border-border/60 shadow-inner"
          />
        </div>
      </div>
    </div>
  )
}
