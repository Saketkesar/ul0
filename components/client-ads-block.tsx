"use client"

import dynamic from "next/dynamic"
import type { AdBannerProps } from "@/components/ad-banner"
import type { NativeAdsProps } from "@/components/native-ads"

const AdBanner = dynamic<AdBannerProps>(() => import("@/components/ad-banner").then(mod => mod.AdBanner), { ssr: false })
const NativeAds = dynamic<NativeAdsProps>(() => import("@/components/native-ads").then(mod => mod.NativeAds), { ssr: false })

export function ClientAdsBlock(props: { nativeScripts: any[] }) {
  return (
    <>
      {/* Top Banner Strip */}
      <div className="mb-4 flex justify-center">
        <AdBanner slot={1} scripts={[{
          iframe: true,
          src: 'https://unsettledradiator.com/ea31a2b23b71044ce04e59b9147c7ffc/invoke.js',
          width: 728,
          height: 90
        }]} />
      </div>
      {/* Mid Banner Adsterra (slot 2) */}
      <div className="mt-5 mb-6 flex items-center justify-center">
        <div className="max-w-[468px]">
          <AdBanner slot={2} scripts={[{
            iframe: true,
            src: 'https://unsettledradiator.com/1ef074fb53b9c298ba4b329b92f27240/invoke.js',
            width: 468,
            height: 60
          }]} />
        </div>
      </div>
      {/* Middle Banner Strip (728x90) */}
      <div className="my-6 flex items-center justify-center">
        <AdBanner slot={3} type="large" />
      </div>
      {/* Native Ad Block */}
      <div className="mt-6">
        <NativeAds count={3} scripts={props.nativeScripts} />
      </div>
      {/* Bottom Banner Strip */}
      <AdBanner slot={4} type="small" />
    </>
  )
}
