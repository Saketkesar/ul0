"use client"

import { useEffect, useRef } from "react"

export function PdfAdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null)
  const sideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 468x60 horizontal banner
    if (bannerRef.current) {
      bannerRef.current.innerHTML = ""
      const wrapper = document.createElement("div")
      wrapper.style.width = "100%"
      wrapper.style.maxWidth = "468px"
      wrapper.style.height = "60px"
      wrapper.style.margin = "0 auto"
      wrapper.style.overflow = "hidden"

      const optsScript = document.createElement("script")
      optsScript.type = "text/javascript"
      optsScript.text = "atOptions = { 'key' : '1ef074fb53b9c298ba4b329b92f27240', 'format' : 'iframe', 'height' : 60, 'width' : 468, 'params' : {} };"

      const invokeScript = document.createElement("script")
      invokeScript.type = "text/javascript"
      invokeScript.src = "https://unsettledradiator.com/1ef074fb53b9c298ba4b329b92f27240/invoke.js"
      invokeScript.async = true

      wrapper.appendChild(optsScript)
      wrapper.appendChild(invokeScript)
      bannerRef.current.appendChild(wrapper)
    }

    // 160x300 sidebar banner (desktop only)
    if (sideRef.current) {
      sideRef.current.innerHTML = ""
      const wrapper = document.createElement("div")
      wrapper.style.width = "160px"
      wrapper.style.height = "300px"
      wrapper.style.margin = "0 auto"
      wrapper.style.overflow = "hidden"

      const optsScript = document.createElement("script")
      optsScript.type = "text/javascript"
      optsScript.text = "atOptions = { 'key' : '25084f2a22060ec74cff3a46dbf2fb73', 'format' : 'iframe', 'height' : 300, 'width' : 160, 'params' : {} };"

      const invokeScript = document.createElement("script")
      invokeScript.type = "text/javascript"
      invokeScript.src = "https://unsettledradiator.com/25084f2a22060ec74cff3a46dbf2fb73/invoke.js"
      invokeScript.async = true

      wrapper.appendChild(optsScript)
      wrapper.appendChild(invokeScript)
      sideRef.current.appendChild(wrapper)
    }

    return () => {
      if (bannerRef.current) bannerRef.current.innerHTML = ""
      if (sideRef.current) sideRef.current.innerHTML = ""
    }
  }, [])

  return { bannerRef, sideRef }
}
