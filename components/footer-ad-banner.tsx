"use client"

import dynamic from "next/dynamic"
import type { AdBannerProps } from "./ad-banner"

const AdBanner = dynamic<AdBannerProps>(() => import("./ad-banner").then(mod => mod.AdBanner), { ssr: false })

export function FooterAdBanner(props: AdBannerProps) {
  return <AdBanner {...props} />
}
