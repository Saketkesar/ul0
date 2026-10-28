"use client"

export interface AdBannerProps {
  slot?: number
  type?: "large" | "small" | "skyscraper" | "medium_skyscraper"
  scriptKey?: string
  width?: number
  height?: number
  scripts?: any
}

/**
 * AdBanner is permanently disabled.
 * UL0 is privacy-first with zero tracking cookies and zero third-party ads.
 */
export function AdBanner(_props: AdBannerProps) {
  return null
}
