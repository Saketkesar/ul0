"use client"

import { useEffect, useRef } from "react"

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
    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card/60 p-4 text-center shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3">
        <span className="text-[10px] font-mono font-medium tracking-wider text-muted-foreground uppercase">
          Advertisement
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
      </div>
      <div
        ref={containerRef}
        className="w-[160px] h-[300px] mx-auto overflow-hidden rounded-xl bg-muted/20 flex items-center justify-center border border-border/40"
      />
    </div>
  )
}
