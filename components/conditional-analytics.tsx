"use client"

import { usePathname } from "next/navigation"
import Script from "next/script"

/**
 * Conditionally loads SimpleAnalytics and AdSense only on standard site pages.
 * Explicitly omitted from /e/* public form pages to ensure privacy and fast load times.
 */
export function ConditionalAnalytics() {
  const pathname = usePathname()

  // Form respondent pages are completely free of ads and analytics
  if (pathname && (pathname.startsWith("/e/") || pathname === "/e")) {
    return null
  }

  return (
    <>
      {/* Simple Analytics */}
      <Script
        src="https://scripts.simpleanalyticscdn.com/latest.js"
        strategy="afterInteractive"
        data-collect-dnt="true"
      />
      <noscript>
        <img
          src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true"
          alt="Simple Analytics Visitor Tracking Pixel"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </noscript>
      {/* Google AdSense */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8018312015732327"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
    </>
  )
}
