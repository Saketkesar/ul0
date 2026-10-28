"use client"

import { usePathname } from "next/navigation"
import Script from "next/script"

/**
 * Privacy-friendly cookieless analytics.
 * Simple Analytics does not use cookies, collect personal data, or track users across sessions.
 * Google AdSense and third-party ad scripts are permanently removed to ensure zero-tracking cookies.
 */
export function ConditionalAnalytics() {
  const pathname = usePathname()

  if (pathname && (pathname.startsWith("/e/") || pathname === "/e")) {
    return null
  }

  return (
    <>
      {/* Simple Analytics - Privacy-friendly & cookieless */}
      <Script
        src="https://scripts.simpleanalyticscdn.com/latest.js"
        strategy="afterInteractive"
        data-collect-dnt="true"
      />
      <noscript>
        <img
          src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true"
          alt=""
          referrerPolicy="no-referrer-when-downgrade"
        />
      </noscript>
    </>
  )
}
