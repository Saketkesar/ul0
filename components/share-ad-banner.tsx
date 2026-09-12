"use client"

import { useEffect, useRef } from "react"

export function ShareAdBanner() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ""

    const iframe = document.createElement("iframe")
    iframe.style.width = "160px"
    iframe.style.maxWidth = "100%"
    iframe.style.height = "300px"
    iframe.style.border = "none"
    iframe.style.overflow = "hidden"
    iframe.style.display = "block"
    iframe.style.margin = "0 auto"
    iframe.setAttribute("sandbox", "allow-scripts allow-popups allow-same-origin")
    iframe.setAttribute("scrolling", "no")

    const html = `<!DOCTYPE html>
<html><head><style>body{margin:0;overflow:hidden;display:flex;align-items:center;justify-content:center;width:160px;height:300px}</style></head>
<body>
<script type="text/javascript">
atOptions = {
  'key' : '25084f2a22060ec74cff3a46dbf2fb73',
  'format' : 'iframe',
  'height' : 300,
  'width' : 160,
  'params' : {}
};
</script>
<script type="text/javascript" src="https://unsettledradiator.com/25084f2a22060ec74cff3a46dbf2fb73/invoke.js"></script>
</body></html>`

    iframe.srcdoc = html
    containerRef.current.appendChild(iframe)
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
