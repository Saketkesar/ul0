"use client"

import dynamic from "next/dynamic"
const AdLoader = dynamic(() => import('./ad-loader'), { ssr: false })
export interface NativeAdsProps {
  count?: number
  scripts?: any[]
}

export function NativeAds({ count = 3, scripts }: NativeAdsProps) {
  // If scripts provided, render one AdLoader per native ad slot
  if (scripts && scripts.length > 0) {
    return (
      <div className="flex flex-wrap gap-3">
        {scripts.map((s, i) => (
          <div key={i} className="flex-1 min-w-[160px] max-w-[320px] rounded border border-border bg-muted/10 p-3">
            <AdLoader scripts={[s]} />
          </div>
        ))}
      </div>
    )
  }
  // fallback placeholder
  const items = Array.from({ length: Math.max(1, Math.min(3, count)) })
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((_, i) => (
        <div key={i} className="flex-1 min-w-[160px] max-w-[320px] rounded border border-border bg-muted/10 p-3">
          <div className="h-6 mb-2 w-full rounded bg-muted" />
          <div className="space-y-1">
            <div className="h-3 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
