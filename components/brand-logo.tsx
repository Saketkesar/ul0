import React from "react"

interface BrandLogoProps {
  className?: string
  height?: number
  priority?: boolean
}

export function BrandLogo({
  className = "",
  height = 30,
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/ul0.png"
        alt="ul0"
        className="w-auto object-contain pointer-events-none"
        style={{ height }}
      />
    </div>
  )
}
