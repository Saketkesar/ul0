"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, AlertTriangle } from "lucide-react"

export function LinkResultAd() {
  const containerRef1 = useRef<HTMLDivElement>(null)
  const containerRef2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Inject Banner 1
    if (containerRef1.current) {
      containerRef1.current.innerHTML = ""

      const wrapper1 = document.createElement("div")
      wrapper1.style.width = "160px"
      wrapper1.style.height = "300px"
      wrapper1.style.margin = "0 auto"

      const opts1 = document.createElement("script")
      opts1.type = "text/javascript"
      opts1.text = `
        atOptions = {
          'key' : '25084f2a22060ec74cff3a46dbf2fb73',
          'format' : 'iframe',
          'height' : 300,
          'width' : 160,
          'params' : {}
        };
      `

      const invoke1 = document.createElement("script")
      invoke1.type = "text/javascript"
      invoke1.src = "https://unsettledradiator.com/25084f2a22060ec74cff3a46dbf2fb73/invoke.js"
      invoke1.async = true

      wrapper1.appendChild(opts1)
      wrapper1.appendChild(invoke1)
      containerRef1.current.appendChild(wrapper1)
    }

    // Inject Banner 2
    if (containerRef2.current) {
      containerRef2.current.innerHTML = ""

      const wrapper2 = document.createElement("div")
      wrapper2.style.width = "160px"
      wrapper2.style.height = "300px"
      wrapper2.style.margin = "0 auto"

      const opts2 = document.createElement("script")
      opts2.type = "text/javascript"
      opts2.text = `
        atOptions = {
          'key' : '25084f2a22060ec74cff3a46dbf2fb73',
          'format' : 'iframe',
          'height' : 300,
          'width' : 160,
          'params' : {}
        };
      `

      const invoke2 = document.createElement("script")
      invoke2.type = "text/javascript"
      invoke2.src = "https://unsettledradiator.com/25084f2a22060ec74cff3a46dbf2fb73/invoke.js"
      invoke2.async = true

      wrapper2.appendChild(opts2)
      wrapper2.appendChild(invoke2)
      containerRef2.current.appendChild(wrapper2)
    }
  }, [])

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card/80 to-background p-3 sm:p-5 shadow-md">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
            Sponsored Advertisements
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">Server Support</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
        {/* User warning & explanation message with flowing arrow */}
        <div className="flex-1 space-y-2.5 text-left w-full">
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
            <span>Sponsored ads</span>
            <span className="flex items-center gap-1 font-mono text-sm tracking-tighter animate-pulse">
              → → →
            </span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* 2 Responsive Ad Banners (160x300 each) */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto shrink-0">
          <div
            ref={containerRef1}
            className="w-[160px] h-[300px] overflow-hidden rounded-xl bg-muted/20 flex items-center justify-center border border-border/60 shadow-inner shrink-0"
          />
          <div
            ref={containerRef2}
            className="w-[160px] h-[300px] overflow-hidden rounded-xl bg-muted/20 flex items-center justify-center border border-border/60 shadow-inner shrink-0"
          />
        </div>
      </div>
    </div>
  )
}
