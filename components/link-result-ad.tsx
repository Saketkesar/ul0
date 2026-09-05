"use client"

import { useEffect, useRef } from "react"
import { AlertTriangle, ArrowDown } from "lucide-react"

const PRIMARY_KEY = "25084f2a22060ec74cff3a46dbf2fb73"
const FALLBACK_KEY = "c675322a5f6d9f2ad9e187be52a5721e"

export function LinkResultAd() {
  const containerRef1 = useRef<HTMLDivElement>(null)
  const containerRef2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timer1: ReturnType<typeof setTimeout>
    let timer2: ReturnType<typeof setTimeout>

    const injectBanner = (
      container: HTMLDivElement | null,
      slotId: string,
      key = PRIMARY_KEY,
      w = 160,
      h = 300
    ) => {
      if (!container) return

      container.innerHTML = ""

      const wrapper = document.createElement("div")
      wrapper.style.width = `${w}px`
      wrapper.style.height = `${h}px`
      wrapper.style.margin = "0 auto"
      wrapper.style.overflow = "hidden"
      wrapper.style.display = "flex"
      wrapper.style.justifyContent = "center"
      wrapper.style.alignItems = "center"

      const optsScript = document.createElement("script")
      optsScript.type = "text/javascript"
      optsScript.text = `
        window.atOptions = {
          'key' : '${key}',
          'format' : 'iframe',
          'height' : ${h},
          'width' : ${w},
          'params' : {}
        };
      `

      const invokeScript = document.createElement("script")
      invokeScript.type = "text/javascript"
      invokeScript.src = `https://unsettledradiator.com/${key}/invoke.js?slot=${slotId}&t=${Date.now()}`
      invokeScript.async = true

      wrapper.appendChild(optsScript)
      wrapper.appendChild(invokeScript)
      container.appendChild(wrapper)
    }

    // 1. Inject first banner immediately
    injectBanner(containerRef1.current, "slot1", PRIMARY_KEY)

    // 2. Inject second banner sequentially after 1.2s to prevent window.atOptions race condition
    timer1 = setTimeout(() => {
      injectBanner(containerRef2.current, "slot2", PRIMARY_KEY)
    }, 1200)

    // 3. Fallback verification: if after 3.8s container 2 has no iframe, load fallback placement
    timer2 = setTimeout(() => {
      if (containerRef2.current) {
        const hasIframe = containerRef2.current.querySelector("iframe")
        if (!hasIframe) {
          injectBanner(containerRef2.current, "slot2_fb", FALLBACK_KEY, 160, 300)
        }
      }
    }, 3800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      if (containerRef1.current) containerRef1.current.innerHTML = ""
      if (containerRef2.current) containerRef2.current.innerHTML = ""
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

      {/* 2 Responsive Ad Banners (160x300 each) */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <div
          ref={containerRef1}
          className="w-[160px] h-[300px] overflow-hidden rounded-xl bg-muted/10 flex items-center justify-center border border-border/60 shadow-inner shrink-0"
        />
        <div
          ref={containerRef2}
          className="w-[160px] h-[300px] overflow-hidden rounded-xl bg-muted/10 flex items-center justify-center border border-border/60 shadow-inner shrink-0"
        />
      </div>
    </div>
  )
}
