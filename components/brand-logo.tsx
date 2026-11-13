import React from "react"

interface BrandLogoProps {
  className?: string
  iconSize?: "sm" | "md" | "lg"
  showText?: boolean
  textClassName?: string
}

export function BrandLogo({
  className = "",
  iconSize = "md",
  showText = true,
  textClassName = "",
}: BrandLogoProps) {
  const sizeMap = {
    sm: "h-6 w-6 text-xs rounded-lg",
    md: "h-7 w-7 text-sm rounded-[9px]",
    lg: "h-9 w-9 text-base rounded-[11px]",
  }

  const textMap = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div
        className={`bg-[#EE6123] text-white font-bold flex items-center justify-center tracking-tight shadow-xs ${sizeMap[iconSize]}`}
        aria-hidden="true"
      >
        u
      </div>
      {showText && (
        <span
          className={`font-bold tracking-tight text-foreground lowercase ${textMap[iconSize]} ${textClassName}`}
        >
          ul0
        </span>
      )}
    </div>
  )
}
