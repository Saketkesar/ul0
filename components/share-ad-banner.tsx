"use client"

import { useEffect, useRef } from "react"

export function ShareAdBanner() {
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
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-[#0d1017]/90 backdrop-blur-xl p-4 shadow-2xl text-center max-w-xs mx-auto my-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
          SPONSORED AD
        </span>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      <div
        ref={containerRef}
        className="w-[160px] h-[300px] mx-auto overflow-hidden rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 shadow-inner"
      />
    </div>
  )
}
