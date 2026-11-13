"use client"

import React from "react"
import { UL0Icon, UL0IconName } from "./ul0-icon"

interface FloatingIconItem {
  name: UL0IconName
  top: string
  left?: string
  right?: string
  size: number
  delay: string
  duration: string
  opacity: string
  scale?: number
  glowColor?: string
}

const FLOATING_ICONS: FloatingIconItem[] = [
  // Top region
  { name: "link", top: "8%", left: "3%", size: 48, delay: "0s", duration: "6.5s", opacity: "opacity-45 dark:opacity-30", glowColor: "rgba(61, 219, 184, 0.25)" },
  { name: "qr", top: "10%", right: "4%", size: 52, delay: "1.2s", duration: "7.2s", opacity: "opacity-50 dark:opacity-30", glowColor: "rgba(27, 104, 92, 0.25)" },
  { name: "sparkles", top: "14%", left: "18%", size: 36, delay: "0.5s", duration: "5.8s", opacity: "opacity-40 dark:opacity-25" },
  { name: "bolt", top: "15%", right: "19%", size: 38, delay: "2.1s", duration: "6.2s", opacity: "opacity-40 dark:opacity-25" },

  // Upper middle
  { name: "domain", top: "28%", left: "5%", size: 46, delay: "1.7s", duration: "7.8s", opacity: "opacity-45 dark:opacity-25", glowColor: "rgba(135, 212, 116, 0.25)" },
  { name: "scissors", top: "32%", right: "6%", size: 44, delay: "0.8s", duration: "6.8s", opacity: "opacity-45 dark:opacity-30" },
  { name: "cloud", top: "26%", left: "22%", size: 38, delay: "3.2s", duration: "8.5s", opacity: "opacity-35 dark:opacity-20" },
  { name: "bulb", top: "30%", right: "23%", size: 40, delay: "2.4s", duration: "7.4s", opacity: "opacity-40 dark:opacity-25" },

  // Center sides
  { name: "target", top: "48%", left: "2%", size: 46, delay: "2.5s", duration: "8.2s", opacity: "opacity-40 dark:opacity-25" },
  { name: "heart", top: "50%", right: "3%", size: 42, delay: "1.4s", duration: "7.1s", opacity: "opacity-45 dark:opacity-30" },
  { name: "cart", top: "52%", left: "12%", size: 38, delay: "3.5s", duration: "6.4s", opacity: "opacity-35 dark:opacity-20" },
  { name: "wifi", top: "54%", right: "14%", size: 40, delay: "0.9s", duration: "7.6s", opacity: "opacity-40 dark:opacity-25" },

  // Lower middle
  { name: "chartline", top: "66%", left: "6%", size: 44, delay: "1.9s", duration: "7.0s", opacity: "opacity-40 dark:opacity-25" },
  { name: "splitbill", top: "68%", right: "7%", size: 46, delay: "2.8s", duration: "8.0s", opacity: "opacity-45 dark:opacity-30" },
  { name: "mobile", top: "72%", left: "20%", size: 36, delay: "0.4s", duration: "6.9s", opacity: "opacity-35 dark:opacity-20" },
  { name: "tools", top: "70%", right: "21%", size: 42, delay: "3.1s", duration: "7.5s", opacity: "opacity-40 dark:opacity-25" },

  // Bottom region
  { name: "rocket", top: "84%", left: "4%", size: 48, delay: "2.2s", duration: "6.6s", opacity: "opacity-45 dark:opacity-30" },
  { name: "crown", top: "86%", right: "5%", size: 44, delay: "1.1s", duration: "7.3s", opacity: "opacity-45 dark:opacity-25" },
  { name: "diamond", top: "88%", left: "15%", size: 36, delay: "3.7s", duration: "8.2s", opacity: "opacity-35 dark:opacity-20" },
  { name: "gift", top: "89%", right: "17%", size: 38, delay: "0.7s", duration: "6.5s", opacity: "opacity-40 dark:opacity-25" },
  { name: "calendar", top: "92%", left: "28%", size: 34, delay: "2.9s", duration: "7.7s", opacity: "opacity-30 dark:opacity-20" },
  { name: "palette", top: "93%", right: "30%", size: 36, delay: "1.6s", duration: "7.1s", opacity: "opacity-35 dark:opacity-20" },
]

export function AnimatedIconBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* Soft color ambient blobs for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3DDBB8]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-[#1B685C]/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

      {FLOATING_ICONS.map((item, idx) => (
        <div
          key={idx}
          className={`absolute ${item.opacity} transition-all duration-300 drop-shadow-xs`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            animation: `floatUpDown ${item.duration} ease-in-out infinite alternate`,
            animationDelay: item.delay,
          }}
        >
          <div
            className="p-2 rounded-2xl bg-card/60 dark:bg-card/30 backdrop-blur-2xs border border-border/40 shadow-xs hover:scale-115 transition-transform"
            style={{
              boxShadow: item.glowColor ? `0 8px 24px -4px ${item.glowColor}` : undefined,
            }}
          >
            <UL0Icon name={item.name} animated={true} size={item.size} />
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes floatUpDown {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-18px) rotate(4deg) scale(1.04);
          }
          100% {
            transform: translateY(14px) rotate(-4deg) scale(0.97);
          }
        }
      `}</style>
    </div>
  )
}

