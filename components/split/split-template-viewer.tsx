"use client"

import { useEffect, useRef } from "react"

interface SplitTemplateViewerProps {
  html: string
  title: string
}

export function SplitTemplateViewer({ html, title }: SplitTemplateViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Listen for any postMessage navigation requests from inside iframe
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.go) {
        window.location.href = `/split/${e.data.go}`
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-start items-center overflow-x-hidden">
      <iframe
        ref={iframeRef}
        srcDoc={html}
        title={title}
        className="w-full flex-1 border-0"
        style={{
          minHeight: "100vh",
          height: "100%",
          width: "100%",
          display: "block",
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  )
}
